import { NextRequest, NextResponse } from 'next/server';
import type { Transaction } from 'sequelize';
import { models, sequelize } from '@/models';
import { verifyToken } from '@/lib/auth';
import { branchCurrencyError, resolveBranchCurrency } from '@/lib/branchCurrency';
import { renderBilingualAgreementWithPdfFirstPage } from '@/lib/bilingualAgreementTemplate';
import crypto from 'crypto';

const LEAD_FLOW_ATTRIBUTES = [
  'id',
  'fname',
  'lname',
  'email',
  'phone',
  'mobile',
  'nationality',
  'country_interest',
  'id_number',
  'address',
  'dob',
  'service_interest',
  'market_source',
  'priority',
  'assignTo',
  'case_officer',
  'Counsilor',
  'branch',
  'region',
  'payTotal',
  'discount',
  'paidYet',
  'payBalance',
  'followup',
  'folowuptime',
  'followupstat',
  'status',
  'area',
  'lead_remark',
  'next_followup_date',
  'opportunity_notes'
];

export async function POST(request: NextRequest) {
  const transaction = await sequelize.transaction();

  try {
    const body = await request.json();
    const {
      leadId: rawLeadId,
      opportunityData = {},
      paymentData = {},
      agreementData = {},
      invoiceData = {},
      followUpData = {},
      appointmentData = {},
      leadRemarks,
      // A client/case is deliberately not created at conversion.  It is created
      // only after the Finance and CRM Compliance gates approve the opportunity.
      createClient = false
    } = body;
    const counselorHandover = body.counselorHandover || body.conversationHandover || {};
    const leadId = normalizeLeadId(rawLeadId ?? body.lead_id ?? body.id ?? body.lead);
    const authorization = request.headers.get('authorization');
    const token = request.cookies.get('auth-token')?.value || authorization?.replace(/^Bearer\s+/i, '');
    const loggedInUser = token ? verifyToken(token) : null;

    if (!loggedInUser) {
      await transaction.rollback();
      return NextResponse.json({ error: 'Authentication is required to convert a lead.' }, { status: 401 });
    }

    if (!leadId) {
      await transaction.rollback();
      return NextResponse.json(
        {
          error: 'Valid Lead ID is required',
          receivedKeys: Object.keys(body || {})
        },
        { status: 400 }
      );
    }

    const conversationSummary = String(counselorHandover.summary || counselorHandover.conversation || '').trim();
    const validationErrors = validateOpportunitySubmission(opportunityData, paymentData, agreementData);
    if (validationErrors.length > 0) {
      await transaction.rollback();
      return NextResponse.json({ error: 'Opportunity validation failed', errors: validationErrors }, { status: 422 });
    }

    const leadColumns = await getTableColumns('dmc_forum_leads', transaction);
    const leadFlowAttributes = LEAD_FLOW_ATTRIBUTES.filter((attribute) => leadColumns.has(attribute));

    // Step 1: Verify lead exists and get lead details
    const lead = await models.DmcForumLeads.findByPk(leadId, {
      attributes: leadFlowAttributes,
      include: [
        { association: 'dmEmployeeByASSIGNTo', attributes: ['id', 'name'] },
        { association: 'dmBranch', attributes: ['id', 'name'] }
      ],
      transaction
    });

    if (!lead) {
      const tablePresence = await findLeadTablePresence(leadId, transaction);
      await transaction.rollback();
      const legacyOnly = tablePresence.includes('dm_forum_leads') && !tablePresence.includes('dmc_forum_leads');
      return NextResponse.json(
        {
          error: legacyOnly
            ? 'Lead exists only in legacy dm_forum_leads, not active dmc_forum_leads'
            : 'Lead not found',
          leadId,
          searchedTables: ['dmc_forum_leads', 'dm_forum_leads'],
          foundInTables: tablePresence
        },
        { status: 404 }
      );
    }
    Object.assign(lead, lead.get({ plain: true }));

    // The counselor's login determines the operating branch. This keeps the
    // opportunity, agreement, and receipts within that counselor's branch.
    const branchId = Number(loggedInUser?.branch || lead.branch || 0) || null;
    const branchCurrency = await resolveBranchCurrency(branchId);
    if (!branchCurrency) {
      await transaction.rollback();
      return NextResponse.json({ error: branchCurrencyError(branchId) }, { status: 422 });
    }

    // A discounted opportunity must not be created until the Director of Sales or Super Admin
    // has approved the exact discount requested for this lead. This is enforced
    // here as well as in the wizard so a direct API call cannot bypass the flow.
    const requestedDiscount = Number(
      paymentData.discountAmount ?? invoiceData.discount ?? opportunityData.discount ?? 0
    );
    if (requestedDiscount > 0) {
      const [discountRequests] = await sequelize.query(
        `SELECT id, status
         FROM dm_discount_approvals
         WHERE leadId = ? AND discountAmount = ?
         ORDER BY createdAt DESC, id DESC
         LIMIT 1`,
        { replacements: [leadId, requestedDiscount], transaction }
      );

      if ((discountRequests as any[])[0]?.status !== 'approved') {
        await transaction.rollback();
        return NextResponse.json(
          { error: 'Discount approval by the Director of Sales or Super Admin is required before this opportunity can continue.' },
          { status: 403 }
        );
      }
    }

    const now = new Date();
    const createdBy = Number(loggedInUser?.id || opportunityData.createdBy || paymentData.createdBy || agreementData.createdBy || lead.assignTo || 1);
    const serviceName = opportunityData.serviceRequired || opportunityData.serviceType || lead.service_interest || 'Consulting Service';
    const clientName = `${lead.fname || ''} ${lead.lname || ''}`.trim() || 'Client';
    const totalAmount = Number(paymentData.totalAmount || agreementData.totalAmount || opportunityData.estimatedValue || lead.payTotal || 0);
    const paidAmount = Number(paymentData.paidAmount ?? paymentData.amount ?? lead.paidYet ?? 0);
    const paymentProofUrl = String(paymentData.proofOfPaymentUrl || paymentData.paymentProofUrl || '').trim();
    const remainingBalance = Math.max(totalAmount - paidAmount, 0);
    const paymentStatus = normalizePaymentStatus(paymentData.status, paidAmount, totalAmount);
    const isClient = remainingBalance <= 0 && paidAmount > 0;
    const followUpDate = normalizeOptionalDate(
      followUpData.scheduledAt ?? followUpData.reminderDate ?? followUpData.followup ?? body.followup
    );
    const appointmentDate = normalizeOptionalDate(
      appointmentData.scheduledAt ?? appointmentData.meetingDate ?? appointmentData.appointmentDate ?? body.appointment
    );
    const remarkText = normalizeRemark(
      leadRemarks ?? body.leadRemark ?? body.lead_remark ?? followUpData.notes ?? appointmentData.notes
    );

    // Step 2: Create opportunity from lead
    const opportunityNumber = `OPP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const opportunityId = await findNextId('dmc_opportunities', transaction);
    const opportunity = await models.DmcOpportunities.create({
      id: opportunityId,
      leadId: lead.id,
      opportunityNumber,
      opportunityName: opportunityData.opportunityName || `${clientName} - ${serviceName}`,
      opportunityType: opportunityData.opportunityType || 'new_business',
      description: opportunityData.description || `Opportunity created for lead: ${clientName}`,
      serviceType: serviceName,
      serviceRequired: serviceName,
      estimatedValue: totalAmount,
      actualValue: paidAmount,
      currency: branchCurrency.currencyCode,
      status: isClient ? 'won' : 'qualified',
      priority: normalizePriority(opportunityData.priority),
      assignedTo: lead.assignTo || createdBy,
      createdBy,
      source: 'lead_conversion',
      conversionDate: now,
      leadSource: lead.market_source,
      branchId,
      expectedCloseDate: opportunityData.expectedCloseDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      probability: opportunityData.probability || 75,
      stage: 'opportunity_created',
      nextAction: '',
      tags: '',
      notes: '',
      agreementGenerated: true,
      agreementSent: false,
      agreementSigned: false,
      paymentReceived: paidAmount > 0,
      documentsVerified: Boolean(opportunityData.documentsVerified),
      createdAt: now,
      updatedAt: now
    }, { transaction });
    Object.assign(opportunity, opportunity.get({ plain: true }));

    const receiptNumber = paymentData.receiptNumber || `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    if (conversationSummary) {
      await sequelize.query(
        `INSERT INTO dm_opportunity_handover_notes (lead_id, opportunity_id, counselor_id, conversation_summary, client_commitments, next_action, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        { replacements: [lead.id, opportunityId, lead.assignTo || createdBy, conversationSummary, counselorHandover.commitments || null, counselorHandover.nextAction || null, now], transaction }
      );
    }
    await sequelize.query(
      `INSERT INTO dm_opportunity_workflow_reviews
       (opportunity_id, lead_id, workflow_status, official_id_data, payment_data, finance_status, compliance_status, created_at, updated_at)
       VALUES (?, ?, 'opportunity_created', ?, ?, 'pending', 'pending', ?, ?)`,
      {
        replacements: [
          opportunityId,
          lead.id,
          JSON.stringify({
            passportNumber: agreementData.passportNumber || lead.id_number || null,
            passportIssueDate: opportunityData.passportIssueDate || null,
            passportExpiryDate: opportunityData.passportExpiryDate || null,
            emiratesIdNumber: agreementData.emiratesId || opportunityData.emiratesIdNumber || null,
            emiratesIdExpiryDate: opportunityData.emiratesIdExpiryDate || null,
            dateOfBirth: lead.dob || opportunityData.dateOfBirth || null,
            gender: opportunityData.gender || null
          }),
          JSON.stringify({
            totalFee: totalAmount,
            discount: requestedDiscount,
            discountApprovalReference: opportunityData.discountApprovalReference || null,
            netPayable: totalAmount - requestedDiscount,
            paymentMethod: paymentData.paymentMethod || null,
            firstInstallment: paidAmount,
            receiptNumber,
            receiptDate: paymentData.paymentDate || now,
            paymentSchedule: paymentData.paymentSchedule || null,
            bankReference: paymentData.transactionId || null,
            paymentProofUrl
          }),
          now,
          now
        ],
        transaction
      }
    );
    await sequelize.query(
      `INSERT INTO dm_opportunity_accounting_verifications (lead_id, opportunity_id, payment_proof_url, payment_received, documents_complete, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
      { replacements: [lead.id, opportunityId, paymentProofUrl || null, paidAmount > 0 ? 1 : 0, Boolean(counselorHandover.documentsCollected) ? 1 : 0, now], transaction }
    );

    // Step 3: Create initial receipt/payment record
    const paymentNumber = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const paymentId = await findNextId('dm_opportunity_payments', transaction);
    const payment = await models.DmcOpportunityPayments.create({
      id: paymentId,
      opportunityId,
      paymentNumber,
      receiptNumber,
      paymentStructure: paymentData.paymentStructure || 'full',
      paymentType: normalizePaymentType(paymentData.paymentType),
      totalAmount,
      amount: Number(paymentData.amount ?? paidAmount),
      currency: branchCurrency.currencyCode,
      status: paymentStatus,
      paymentMethod: paymentData.paymentMethod || 'cash',
      transactionId: paymentData.transactionId || null,
      paymentDate: paymentData.paymentDate || now,
      dueDate: paymentData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      description: paymentData.description || 'Initial payment for opportunity',
      paidAmount,
      remainingBalance,
      balanceAmount: remainingBalance,
      createdBy,
      notes: paymentData.notes || '',
      clientName,
      clientEmail: lead.email,
      clientPhone: lead.mobile || lead.phone,
      clientAddress: lead.address || '',
      serviceName,
      branchName: branchCurrency.branchName,
      consultantName: lead.dmEmployeeByASSIGNTo?.name || '',
      taxAmount: Number(paymentData.taxAmount || invoiceData.taxAmt || 0),
      discountAmount: Number(paymentData.discountAmount || lead.discount || 0),
      createdAt: now,
      updatedAt: now
    }, { transaction });
    Object.assign(payment, payment.get({ plain: true }));

    // Step 4: Create invoice record
    const invoiceReceipt = invoiceData.receipt || `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const nextInvoiceId = await findNextId('dm_b2b_invoices', transaction);
    await sequelize.query(
      `INSERT INTO dm_b2b_invoices
        (id, region, receipt, branch, company, purpose, narration, vat, taxAmt, totPayAmt, payBalance, payment_mode, amount, discount, status, created, Counsilor, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          nextInvoiceId,
          lead.region || null,
          invoiceReceipt,
          branchId,
          invoiceData.company || clientName,
          invoiceData.purpose || serviceName,
          invoiceData.narration || `Invoice generated for opportunity ${opportunityNumber}`,
          Number(invoiceData.vat || 0),
          Number(invoiceData.taxAmt || payment.taxAmount || 0),
          totalAmount,
          remainingBalance,
          paymentData.paymentMethod || 'cash',
          paidAmount,
          Number(invoiceData.discount || payment.discountAmount || 0),
          isClient ? 1 : 0,
          now,
          loggedInUser?.id || lead.Counsilor || lead.assignTo || null,
          createdBy
        ],
        transaction
      }
    );

    const invoiceId = nextInvoiceId;

    // Step 5: Create agreement record
    const agreementNumber = `AGR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const clientPortalId = `CMG-${String(lead.id).padStart(6, '0')}-${String(opportunityId).padStart(6, '0')}`;
    const clientPortalToken = crypto.randomBytes(32).toString('hex');
    const agreementId = await findNextId('dm_opportunity_agreements', transaction);
    const agreementContent = agreementData.content || renderBilingualAgreementWithPdfFirstPage({
      agreementNumber,
      agreementDate: now.toLocaleDateString(),
      clientName,
      clientEmail: lead.email || '',
      clientPhone: lead.mobile || lead.phone || '',
      clientAddress: agreementData.companyAddress || lead.address || '',
      nationality: lead.nationality || '',
      passportNumber: lead.id_number || '',
      emiratesId: agreementData.emiratesId || lead.id_number || '',
      occupation: agreementData.occupation || lead.profession || '',
      clientId: clientPortalId,
      serviceProgram: serviceName || 'Professional Consultancy Services',
      destinationCountry: String(opportunityData.country || lead.country_interest || ''),
      totalAmount: `${branchCurrency.currencyCode} ${totalAmount.toLocaleString()}`,
      initialPayment: `${branchCurrency.currencyCode} ${paidAmount.toLocaleString()}`,
      secondPayment: `${branchCurrency.currencyCode} ${Math.max(totalAmount - paidAmount, 0).toLocaleString()}`,
      branchName: branchCurrency.branchName || 'DM Immigration Consultants DMCC',
      branchAddress: branchCurrency.branchAddress || 'Office 3703B, Latifa Tower, Sheikh Zayed Road, Dubai, UAE',
    });
    const agreement = await models.DmcOpportunityAgreements.create({
      id: agreementId,
      opportunityId,
      agreementNumber,
      agreementType: agreementData.agreementType || 'service_agreement',
      templateId: agreementData.templateId || null,
      status: agreementData.status || 'generated',
      agreementTitle: agreementData.agreementTitle || agreementData.title || `Service Agreement - ${clientName}`,
      title: agreementData.title || agreementData.agreementTitle || `Service Agreement - ${clientName}`,
      description: agreementData.description || `Service agreement for ${serviceName}`,
      duration: agreementData.duration || '12',
      amount: Number(agreementData.amount || totalAmount),
      terms: agreementData.terms || agreementData.termsAndConditions || '',
      termsAndConditions: agreementData.termsAndConditions || agreementData.terms || '',
      specialConditions: agreementData.specialConditions || '',
      content: agreementContent,
      totalAmount,
      currency: branchCurrency.currencyCode,
      startDate: agreementData.startDate || now,
      endDate: agreementData.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      signedDate: agreementData.status === 'uploaded' ? normalizeOptionalDate(agreementData.signatureDate) : null,
      clientSignature: agreementData.clientSignature || null,
      signatureDate: normalizeOptionalDate(agreementData.signatureDate),
      documentUrl: agreementData.documentUrl || null,
      clientName,
      clientEmail: lead.email,
      clientPhone: lead.mobile || lead.phone,
      companyName: agreementData.companyName || '',
      companyAddress: agreementData.companyAddress || lead.address || '',
      uploadedToCrm: Boolean(agreementData.documentUrl || agreementData.uploadedToCrm),
      createdBy,
      uploadedBy: createdBy,
      generatedDate: now,
      createdAt: now,
      updatedAt: now
    }, { transaction });
    Object.assign(agreement, agreement.get({ plain: true }));

    await sequelize.query(
      `INSERT INTO dm_client_upload_portals (client_id, lead_id, opportunity_id, agreement_number, access_token, status, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?, 'active', ?, ?)`,
      { replacements: [clientPortalId, lead.id, opportunityId, agreementNumber, clientPortalToken, new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), now], transaction }
    );
    await sequelize.query(
      `INSERT INTO dm_client_upload_checklist_items (portal_id, item_name, required, status)
       SELECT id, ?, 1, 'pending' FROM dm_client_upload_portals WHERE access_token = ?
       UNION ALL SELECT id, ?, 1, 'pending' FROM dm_client_upload_portals WHERE access_token = ?
       UNION ALL SELECT id, ?, 1, 'pending' FROM dm_client_upload_portals WHERE access_token = ?
       UNION ALL SELECT id, ?, 1, 'pending' FROM dm_client_upload_portals WHERE access_token = ?`,
      { replacements: ['Passport copy', clientPortalToken, 'National / Emirates ID copy', clientPortalToken, 'Signed agreement', clientPortalToken, 'Proof of address', clientPortalToken], transaction }
    );

    await sequelize.query(
      'UPDATE dmc_opportunities SET agreementId = ?, agreementGenerated = ?, paymentReceived = ?, updatedAt = ? WHERE id = ?',
      { replacements: [agreementId, true, paidAmount > 0, now, opportunityId], transaction }
    );

    // Step 6: Store follow-up, appointment, and lead remarks in the lead DB tables
    let followUpSummary = null;
    if (followUpDate) {
      const followUp = await models.DmcFollowUpReminders.create({
        lead_id: lead.id,
        user_id: Number(followUpData.employeeId || followUpData.userId || lead.assignTo || createdBy),
        reminder_date: followUpDate,
        message: followUpData.message || followUpData.subject || remarkText || `Follow up ${clientName} for ${serviceName}`,
        status: followUpData.status || 'pending',
        priority: normalizePriority(followUpData.priority || opportunityData.priority),
        created_at: now,
        updated_at: now
      }, { transaction });
      Object.assign(followUp, followUp.get({ plain: true }));
      const followUpId = Number(followUp.id || await findLatestLeadChildId(
        'dmc_follow_up_reminders',
        lead.id,
        transaction
      ));
      followUpSummary = {
        id: followUpId,
        leadId: lead.id,
        userId: followUp.user_id,
        reminderDate: followUp.reminder_date,
        status: followUp.status
      };
    }

    let appointmentSummary = null;
    if (appointmentDate) {
      const appointment = await models.DmcMeetingSchedules.create({
        lead_id: lead.id,
        user_id: Number(appointmentData.employeeId || appointmentData.userId || lead.assignTo || createdBy),
        meeting_date: appointmentDate,
        meeting_type: appointmentData.meetingType || appointmentData.type || 'appointment',
        location: appointmentData.location || null,
        agenda: appointmentData.agenda || appointmentData.title || `Appointment for ${clientName} - ${serviceName}`,
        status: appointmentData.status || 'scheduled',
        priority: normalizePriority(appointmentData.priority || opportunityData.priority),
        notes: appointmentData.notes || remarkText || null,
        created_at: now,
        updated_at: now
      }, { transaction });
      Object.assign(appointment, appointment.get({ plain: true }));
      const appointmentId = Number(appointment.id || await findLatestLeadChildId(
        'dmc_meeting_schedules',
        lead.id,
        transaction
      ));
      appointmentSummary = {
        id: appointmentId,
        leadId: lead.id,
        userId: appointment.user_id,
        appointmentDate: appointment.meeting_date,
        status: appointment.status
      };
    }

    let leadRemarkSummary = null;
    if (remarkText) {
      const leadRemark = await createLeadRemark(lead.id, remarkText, createdBy, now, transaction);
      leadRemarkSummary = {
        id: leadRemark.id,
        leadId: lead.id,
        remark: remarkText,
        employeeId: createdBy
      };
    }

    // Step 7: Create or update client record
    let client = null;
    let clientSummary = null;
    if (createClient) {
      client = await models.DmClients.findOne({ where: { leadId: lead.id }, transaction });
      const clientPayload = {
        leadId: lead.id,
        first_name: lead.fname || '',
        last_name: lead.lname || '',
        email: lead.email || '',
        image: '',
        dob: lead.dob || new Date('1970-01-01'),
        address: lead.address || '',
        full_address: lead.address || '',
        token: Math.random().toString(36).substr(2, 10).toUpperCase(),
        token_validity: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        verify: 0,
        password: '',
        hash_password: '',
      status: 0,
      accept: 0,
        created: now,
        case_manager: lead.case_officer || lead.assignTo || createdBy,
        backend_person: lead.assignTo || createdBy,
        is_deleted: 0,
        city: lead.area || '',
        nationality: lead.nationality || ''
      };

      if (client) {
        await client.update(clientPayload, { transaction });
        Object.assign(client, client.get({ plain: true }));
        clientSummary = {
          id: await findInsertedId('dm_clients', 'leadId', String(lead.id), transaction),
          leadId: lead.id,
          status: clientPayload.status,
          accept: clientPayload.accept
        };
      } else {
        const nextClientId = await findNextId('dm_clients', transaction);
        await sequelize.query(
          `INSERT INTO dm_clients
            (id, leadId, first_name, last_name, email, image, dob, address, full_address, token, token_validity, verify, password, hash_password, status, accept, created, case_manager, backend_person, is_deleted, city, nationality)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          {
            replacements: [
              nextClientId,
              clientPayload.leadId,
              clientPayload.first_name,
              clientPayload.last_name,
              clientPayload.email,
              clientPayload.image,
              clientPayload.dob,
              clientPayload.address,
              clientPayload.full_address,
              clientPayload.token,
              clientPayload.token_validity,
              clientPayload.verify,
              clientPayload.password,
              clientPayload.hash_password,
              clientPayload.status,
              clientPayload.accept,
              clientPayload.created,
              clientPayload.case_manager,
              clientPayload.backend_person,
              clientPayload.is_deleted,
              clientPayload.city,
              clientPayload.nationality
            ],
            transaction
          }
        );
        clientSummary = {
          id: nextClientId,
          leadId: lead.id,
          status: clientPayload.status,
          accept: clientPayload.accept
        };
      }
    }

    // Step 8: Update lead status to reflect conversion to opportunity/client
    const leadUpdate: Record<string, unknown> = {
      status: 'opportunity_created',
      convet: 'Opportunity',
      opportunity_status: opportunity.status,
      conversion_date: now,
      last_updated: now.toISOString().split('T')[0],
      last_updtd_time: now.toTimeString().split(' ')[0],
      stepComplete: 2,
      paidYet: paidAmount,
      payBalance: remainingBalance,
      payTotal: totalAmount,
      followup: followUpDate || lead.followup,
      folowuptime: followUpDate || lead.folowuptime,
      followupstat: followUpDate ? 1 : lead.followupstat,
      appointment: appointmentDate || lead.appointment,
      status_date: now
    };

    if (leadColumns.has('next_followup_date')) {
      leadUpdate.next_followup_date = followUpDate || lead.next_followup_date || null;
    }
    if (leadColumns.has('opportunity_notes')) {
      leadUpdate.opportunity_notes = remarkText || opportunityData.notes || lead.opportunity_notes || null;
    }

    await lead.update(leadUpdate as any, { transaction });

    await sequelize.query(
      'UPDATE dmc_forum_leads SET opportunity_id = ? WHERE id = ?',
      { replacements: [opportunityId, lead.id], transaction }
    );

    // Step 9: Create activity log
    await models.DmcOpportunityActivities.create({
      opportunityId,
      activityType: 'opportunity_created',
      activityTitle: 'Opportunity created',
      description: `Opportunity created from lead ${clientName}`,
      activityDate: now,
      assignedTo: createdBy,
      createdBy,
      duration: 0,
      outcome: 'Created',
      nextStep: 'Submit to Finance Review',
      status: 'completed',
      priority: 'medium',
      location: '',
      attendees: '',
      notes: `Payment ${paymentNumber}, invoice ${invoiceReceipt}, and agreement ${agreementNumber} generated.`,
      createdAt: now,
      updatedAt: now
    }, { transaction });

    await transaction.commit();

    // Step 10: Return complete flow data
    return NextResponse.json({
      success: true,
      message: 'Lead converted to an opportunity and submitted for Finance Review.',
      data: {
        lead: {
          id: lead.id,
          name: clientName,
          email: lead.email,
          status: 'opportunity_created',
          assignedTo: lead.dmEmployeeByASSIGNTo?.name
        },
        client: clientSummary,
        opportunity: {
          id: opportunityId,
          opportunityNumber,
          opportunityName: opportunityData.opportunityName || `${clientName} - ${serviceName}`,
          estimatedValue: totalAmount,
          status: isClient ? 'won' : 'qualified',
          stage: 'opportunity_created'
        },
        payment: {
          id: paymentId,
          paymentNumber,
          amount: Number(paymentData.amount ?? paidAmount),
          status: paymentStatus,
          paymentDate: paymentData.paymentDate || now
        },
        invoice: {
          id: invoiceId,
          receipt: invoiceReceipt,
          totalAmount,
          paidAmount,
          balance: remainingBalance,
          status: isClient ? 1 : 0
        },
        agreement: {
          id: agreementId,
          agreementNumber,
          title: agreementData.title || agreementData.agreementTitle || `Service Agreement - ${clientName}`,
          status: agreementData.status || 'generated',
          totalAmount
        },
        followUp: followUpSummary,
        appointment: appointmentSummary,
        leadRemark: leadRemarkSummary
      }
    });

  } catch (error: unknown) {
    await transaction.rollback();
    console.error('Error in lead-to-opportunity flow:', error);
    return NextResponse.json(
      { 
        error: 'Failed to complete lead-to-opportunity flow', 
        details: getErrorMessage(error)
      },
      { status: 500 }
    );
  }
}

function normalizePriority(priority?: string): 'low' | 'medium' | 'high' | 'urgent' {
  const value = String(priority || 'medium').toLowerCase();
  if (value === 'critical') return 'urgent';
  if (value === 'low' || value === 'high' || value === 'urgent') return value;
  return 'medium';
}

function validateOpportunitySubmission(
  opportunityData: Record<string, unknown>,
  paymentData: Record<string, unknown>,
  agreementData: Record<string, unknown>,
): string[] {
  const errors: string[] = [];
  const totalAmount = Number(paymentData.totalAmount ?? agreementData.totalAmount ?? opportunityData.estimatedValue);
  const paidAmount = Number(paymentData.paidAmount ?? paymentData.amount ?? 0);
  const discountAmount = Number(paymentData.discountAmount ?? 0);
  const opportunityName = String(opportunityData.opportunityName ?? '').trim();
  const service = String(opportunityData.serviceRequired ?? opportunityData.serviceType ?? '').trim();

  if (!opportunityName) errors.push('Opportunity name is required.');
  if (!service) errors.push('Service required is required.');
  if (!Number.isFinite(totalAmount) || totalAmount <= 0) errors.push('Total amount must be greater than zero.');
  if (!Number.isFinite(paidAmount) || paidAmount < 0 || paidAmount > totalAmount) errors.push('Paid amount must be between zero and the total amount.');
  if (!Number.isFinite(discountAmount) || discountAmount < 0 || discountAmount > totalAmount) errors.push('Discount amount must be between zero and the total amount.');

  const paymentDate = paymentData.paymentDate;
  if (paymentDate && Number.isNaN(new Date(String(paymentDate)).getTime())) errors.push('Payment date is invalid.');

  const startDate = agreementData.startDate;
  const endDate = agreementData.endDate;
  if (startDate && endDate) {
    const start = new Date(String(startDate));
    const end = new Date(String(endDate));
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) errors.push('Agreement end date must be on or after its start date.');
  }

  return errors;
}

function normalizePaymentType(paymentType?: string): 'deposit' | 'installment' | 'final' | 'refund' {
  if (paymentType === 'installment' || paymentType === 'final' || paymentType === 'refund') {
    return paymentType;
  }
  return 'deposit';
}

function normalizePaymentStatus(status?: string, paidAmount = 0, totalAmount = 0): 'pending' | 'processing' | 'completed' | 'paid' | 'failed' | 'refunded' {
  if (status === 'processing' || status === 'completed' || status === 'paid' || status === 'failed' || status === 'refunded') {
    return status;
  }
  if (paidAmount > 0 && paidAmount >= totalAmount) {
    return 'paid';
  }
  if (paidAmount > 0) {
    return 'completed';
  }
  return 'pending';
}

function normalizeOptionalDate(value: unknown): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeRemark(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function formatTime(date: Date): string {
  return date.toTimeString().split(' ')[0];
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

function normalizeLeadId(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^\d+$/.test(trimmed)) {
      return Number(trimmed);
    }
  }

  if (value && typeof value === 'object') {
    const candidate = value as { id?: unknown; leadId?: unknown; lead_id?: unknown };
    return normalizeLeadId(candidate.id ?? candidate.leadId ?? candidate.lead_id);
  }

  return null;
}

async function findLeadTablePresence(leadId: number, transaction?: Transaction): Promise<string[]> {
  const tableNames = ['dmc_forum_leads', 'dm_forum_leads'];
  const foundTables: string[] = [];

  for (const tableName of tableNames) {
    try {
      const [rows] = await sequelize.query(
        `SELECT id FROM ${tableName} WHERE id = ? LIMIT 1`,
        { replacements: [leadId], transaction }
      );
      if (Array.isArray(rows) && rows.length > 0) {
        foundTables.push(tableName);
      }
    } catch {
      // Some installs may not have every legacy table.
    }
  }

  return foundTables;
}

async function findInsertedId(table: string, field: string, value: string, transaction: Transaction): Promise<number> {
  const [rows] = await sequelize.query(
    `SELECT id FROM ${table} WHERE ${field} = ? ORDER BY id DESC LIMIT 1`,
    { replacements: [value], transaction }
  );
  const record = Array.isArray(rows) ? rows[0] as { id?: number | string } | undefined : undefined;
  return Number(record?.id || 0);
}

async function findLatestLeadChildId(
  table: string,
  leadId: number,
  transaction: Transaction
): Promise<number> {
  const [rows] = await sequelize.query(
    `SELECT id FROM ${table} WHERE lead_id = ? ORDER BY id DESC LIMIT 1`,
    { replacements: [leadId], transaction }
  );
  const record = Array.isArray(rows) ? rows[0] as { id?: number | string } | undefined : undefined;
  return Number(record?.id || 0);
}

async function getExistingAttributes(table: string, attributes: string[]): Promise<string[]> {
  const columns = await getTableColumns(table);
  return attributes.filter((attribute) => columns.has(attribute));
}

async function getTableColumns(table: string, transaction?: Transaction): Promise<Set<string>> {
  const [rows] = await sequelize.query(
    `SHOW COLUMNS FROM ${table}`,
    { transaction }
  );
  return new Set(
    Array.isArray(rows)
      ? rows.map((row) => String((row as { Field?: string }).Field || ''))
      : []
  );
}

async function createLeadRemark(
  leadId: number,
  remark: string,
  employeeId: number,
  date: Date,
  transaction: Transaction
): Promise<{ id: number }> {
  const columns = await getTableColumns('dmc_forum_leads_remarks', transaction);

  const insertColumns = ['lead', 'date', 'remark', 'emp', 'created'];
  const placeholders = ['?', '?', '?', '?', '?'];
  const replacements: unknown[] = [leadId, date, remark, employeeId, formatTime(date)];

  if (columns.has('status')) {
    insertColumns.push('status');
    placeholders.push('?');
    replacements.push(1);
  }

  await sequelize.query(
    `INSERT INTO dmc_forum_leads_remarks (${insertColumns.join(', ')}) VALUES (${placeholders.join(', ')})`,
    { replacements, transaction }
  );

  const [rows] = await sequelize.query(
    'SELECT id FROM dmc_forum_leads_remarks WHERE lead = ? AND remark = ? AND emp = ? ORDER BY id DESC LIMIT 1',
    { replacements: [leadId, remark, employeeId], transaction }
  );
  const record = Array.isArray(rows) ? rows[0] as { id?: number | string } | undefined : undefined;
  return { id: Number(record?.id || 0) };
}

async function findNextId(table: string, transaction: Transaction): Promise<number> {
  const [rows] = await sequelize.query(
    `SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM ${table}`,
    { transaction }
  );
  const record = Array.isArray(rows) ? rows[0] as { nextId?: number | string } | undefined : undefined;
  return Number(record?.nextId || 1);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = normalizeLeadId(searchParams.get('leadId') ?? searchParams.get('lead_id') ?? searchParams.get('id'));

    if (!leadId) {
      return NextResponse.json(
        { error: 'Valid Lead ID is required' },
        { status: 400 }
      );
    }

    const opportunityIds = (await models.DmcOpportunities.findAll({
      where: { leadId },
      attributes: ['id'],
      raw: true
    })).map((opp: { id: number | string }) => Number(opp.id)).filter(Boolean);

    // Get complete flow data for a lead
    const [lead, opportunities, payments, agreements, clients] = await Promise.all([
      models.DmcForumLeads.findByPk(leadId, {
        attributes: await getExistingAttributes('dmc_forum_leads', LEAD_FLOW_ATTRIBUTES),
        include: [
          { association: 'dmEmployeeByASSIGNTo', attributes: ['id', 'name'] },
          { association: 'dmBranch', attributes: ['id', 'name'] }
        ]
      }),
      models.DmcOpportunities.findAll({
        where: { leadId },
        include: [
          { association: 'assignedEmployee', attributes: ['id', 'name'] }
        ],
        order: [['createdAt', 'DESC']]
      }),
      models.DmcOpportunityPayments.findAll({
        where: { opportunityId: opportunityIds },
        include: [
          { association: 'dmcOpportunity', attributes: ['id', 'opportunityName'] }
        ],
        order: [['createdAt', 'DESC']]
      }),
      models.DmcOpportunityAgreements.findAll({
        where: { opportunityId: opportunityIds },
        include: [
          { association: 'dmcOpportunity', attributes: ['id', 'opportunityName'] }
        ],
        order: [['createdAt', 'DESC']]
      }).catch(() => []),
      models.DmClients.findAll({
        where: { leadId },
        order: [['id', 'DESC']]
      })
    ]);
    if (lead) {
      Object.assign(lead, lead.get({ plain: true }));
    }

    const clientNames = lead ? [
      `${lead.fname || ''} ${lead.lname || ''}`.trim(),
      lead.email
    ].filter(Boolean) : [];

    const relatedInvoices = clientNames.length > 0
      ? await models.DmB2bInvoices.findAll({
        where: {
          company: clientNames
        },
        order: [['id', 'DESC']]
      })
      : [];

    return NextResponse.json({
      lead,
      opportunities,
      payments,
      agreements,
      invoices: relatedInvoices,
      clients,
      flowComplete: opportunities.length > 0 && payments.length > 0 && agreements.length > 0 && relatedInvoices.length > 0 && clients.length > 0
    });

  } catch (error: unknown) {
    console.error('Error fetching lead-to-opportunity flow:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch lead-to-opportunity flow', 
        details: getErrorMessage(error)
      },
      { status: 500 }
    );
  }
}
