// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { models, sequelize } from '@/models';
import { verifyToken } from '@/lib/auth';
import { branchCurrencyError, resolveBranchCurrency } from '@/lib/branchCurrency';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      leadId, 
      opportunityId, 
      paymentData, 
      receiptData,
      generateAgreement = false,
      agreementData 
    } = body;
    const authorization = request.headers.get('authorization');
    const token = request.cookies.get('auth-token')?.value || authorization?.replace(/^Bearer\s+/i, '');
    const loggedInUser = token ? verifyToken(token) : null;

    // Step 1: Validate lead exists
    const [leadRows] = await sequelize.query(`
      SELECT l.id, l.fname, l.lname, l.email, l.phone, l.mobile, l.address,
             l.service_interest, l.assignTo, l.branch, l.payTotal, l.paidYet,
             l.payBalance, e.name AS assignedEmployeeName
      FROM dmc_forum_leads l
      LEFT JOIN dm_employee e ON e.id = l.assignTo
      WHERE l.id = ?
      LIMIT 1
    `, { replacements: [leadId] });
    const lead = (leadRows as any[])[0];

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Step 2: Validate opportunity exists if provided
    let opportunity = null;
    if (opportunityId) {
      opportunity = await models.DmcOpportunities.findByPk(opportunityId);
      if (!opportunity) {
        return NextResponse.json(
          { error: 'Opportunity not found' },
          { status: 404 }
        );
      }
    }

    const branchId = Number(loggedInUser?.branch || opportunity?.branchId || lead.branch || 0) || null;
    const branchCurrency = await resolveBranchCurrency(branchId);
    if (!branchCurrency) {
      return NextResponse.json({ error: branchCurrencyError(branchId) }, { status: 422 });
    }

    // Step 3: Create receipt record — RCT-[YY]-[agreementSeq]-[installmentTag]
    const yy = String(new Date().getFullYear()).slice(-2);
    const paymentTag = body.paymentTag || 'P1';
    let agreementSeq = body.agreementSeq || '';
    if (!agreementSeq) {
      // Try to find linked agreement sequence
      const [agRows] = await sequelize.query(
        `SELECT agreementNumber FROM dm_opportunity_agreements WHERE opportunityId = ? ORDER BY createdAt DESC LIMIT 1`,
        { replacements: [opportunityId || null] }
      );
      const agNum = (agRows as any[])[0]?.agreementNumber || '';
      const seqMatch = agNum.match(/AGR-\d+-\d{2}-(\d{4})$/);
      agreementSeq = seqMatch ? seqMatch[1] : String(Math.floor(Math.random() * 9000 + 1000)).padStart(4, '0');
    }
    const receiptNumber = `RCT-${yy}-${agreementSeq}-${paymentTag}`;
    const [receiptIdRows] = await sequelize.query(`
      SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM dm_opportunity_payments
    `);
    const receiptId = Number((receiptIdRows as any[])[0]?.nextId || 0);
    if (!receiptId) throw new Error('Could not allocate a receipt ID');
    const paidAmount = Number(paymentData.paidAmount || paymentData.amount || 0);
    const totalAmount = Number(paymentData.totalAmount || paymentData.amount || lead.payTotal || 0);
    const taxAmount = Number(receiptData.taxAmount || 0);
    const discountAmount = Number(receiptData.discountAmount || 0);

    const receipt = await models.DmcOpportunityPayments.create({
      id: receiptId,
      opportunityId: opportunityId || null,
      paymentNumber: receiptNumber,
      paymentStructure: paymentData.paymentStructure || 'full',
      paymentType: normalizePaymentType(paymentData.paymentType),
      totalAmount,
      amount: paymentData.amount || paidAmount,
      currency: branchCurrency.currencyCode,
      status: 'paid',
      paymentMethod: paymentData.paymentMethod || 'cash',
      transactionId: paymentData.transactionId || null,
      paymentDate: paymentData.paymentDate || new Date(),
      dueDate: paymentData.dueDate || new Date(),
      description: receiptData.description || `Payment receipt for ${lead.fname} ${lead.lname}`,
      paidAmount,
      remainingBalance: Math.max(totalAmount - paidAmount, 0),
      balanceAmount: Math.max(totalAmount - paidAmount, 0),
      createdBy: loggedInUser?.id || paymentData.createdBy || lead.assignTo,
      notes: receiptData.notes || '',
      receiptNumber,
      receiptType: receiptData.receiptType || 'payment',
      clientName: `${lead.fname} ${lead.lname}`,
      clientEmail: lead.email,
      clientPhone: lead.mobile || lead.phone,
      clientAddress: lead.address || '',
      serviceName: lead.service_interest || '',
      branchName: branchCurrency.branchName,
      consultantName: lead.assignedEmployeeName || '',
      taxAmount,
      discountAmount,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Step 4: Update lead payment information
    const newPaidYet = (lead.paidYet || 0) + (paymentData.paidAmount || paymentData.amount || 0);
    const newPayBalance = (lead.payTotal || 0) - newPaidYet;

    // Use a focused SQL update here because legacy installations can lack
    // optional columns that are present in the Sequelize lead model.
    await sequelize.query(`
      UPDATE dmc_forum_leads
      SET paidYet = ?, payBalance = ?, last_updated = ?, last_updtd_time = ?,
          status = ?, status_date = ?
      WHERE id = ?
    `, {
      replacements: [
        newPaidYet,
        newPayBalance,
        new Date().toLocaleDateString(),
        new Date().toTimeString().split(' ')[0],
        newPayBalance <= 0 ? 'fully_paid' : 'partially_paid',
        new Date(),
        lead.id,
      ],
    });

    // Step 5: Record in dm_pay_history
    const totalPaidSoFar = newPaidYet;
    await sequelize.query(`
      INSERT INTO dm_pay_history
        (leadId, amount, counselor_receipt, tabby, date, payMethod, payoption, paycardoption,
         payNextDate, payBalance, tax, payCategory, payment_remarks, status,
         thirdPartyAmt, dmAmt, dmTax, dmRefundAmt, curValue, refNumber,
         created_by, stage, totaltillnow)
      VALUES
        (:leadId, :amount, :receiptNumber, 0, :payDate, :payMethod, :payoption, '',
         :payNextDate, :payBalance, 0, :payCategory, :remarks, 1,
         0, :amount, 0, 0, 0, :refNumber,
         :createdBy, 'payment', :totalPaidSoFar)
    `, {
      replacements: {
        leadId,
        amount: paidAmount,
        receiptNumber,
        payDate: paymentData.paymentDate || new Date(),
        payMethod: paymentData.paymentMethod || 'cash',
        payoption: paymentData.paymentStructure || 'full',
        payNextDate: paymentData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        payBalance: Math.max(totalAmount - totalPaidSoFar, 0),
        payCategory: receiptData.receiptType || 'payment',
        remarks: receiptData.description || `Receipt ${receiptNumber}`,
        refNumber: paymentData.transactionId || receiptNumber,
        createdBy: loggedInUser?.id || lead.assignTo || 1,
        totalPaidSoFar,
      },
    });

    // Step 6: Update opportunity if exists
    if (opportunity) {
      await opportunity.update({
        updatedAt: new Date()
      });

      // Create opportunity activity
      await models.DmcOpportunityActivities.create({
        opportunityId: Number(opportunityId),
        activityType: 'payment_received',
        activityTitle: 'Payment received',
        description: `Payment of ${branchCurrency.currencyCode} ${paidAmount} received`,
        activityDate: new Date(),
        assignedTo: loggedInUser?.id || paymentData.createdBy || lead.assignTo,
        createdBy: loggedInUser?.id || paymentData.createdBy || lead.assignTo,
        status: 'completed',
        priority: 'medium',
        notes: `Receipt ${receiptNumber} generated.`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Step 7: Generate agreement if requested
    let agreement = null;
    if (generateAgreement && agreementData) {
      const [agreementIdRows] = await sequelize.query(`
        SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM dm_opportunity_agreements
      `);
      const agreementId = Number((agreementIdRows as any[])[0]?.nextId || 0);
      if (!agreementId) throw new Error('Could not allocate an agreement ID');
      agreement = await models.DmcOpportunityAgreements.create({
        id: agreementId,
        opportunityId: opportunityId || null,
        agreementNumber: `AGR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        agreementType: agreementData.agreementType || 'service_agreement',
        templateId: agreementData.templateId || null,
        status: 'draft',
        title: agreementData.title || `Service Agreement - ${lead.fname} ${lead.lname}`,
        description: agreementData.description || `Service agreement for ${lead.service_interest}`,
        termsAndConditions: agreementData.termsAndConditions || '',
        totalAmount: agreementData.totalAmount || lead.payTotal || 0,
        currency: branchCurrency.currencyCode,
        startDate: agreementData.startDate || new Date(),
        endDate: agreementData.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        signedDate: null,
        clientName: `${lead.fname} ${lead.lname}`,
        clientEmail: lead.email,
        clientPhone: lead.mobile || lead.phone,
        companyName: agreementData.companyName || '',
        companyAddress: agreementData.companyAddress || lead.address || '',
        createdBy: loggedInUser?.id || agreementData.createdBy || lead.assignTo,
        uploadedBy: loggedInUser?.id || agreementData.createdBy || lead.assignTo,
        generatedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Update lead status to reflect agreement generation
      // lead is a plain object from raw SQL — use a direct UPDATE query.
      await sequelize.query(
        `UPDATE dmc_forum_leads SET status='agreement_generated', convet='Agreement', stepComplete=3, status_date=? WHERE id=?`,
        { replacements: [new Date(), lead.id] }
      );
    }

    // Step 8: Return complete receipt and agreement data
    return NextResponse.json({
      success: true,
      message: 'Receipt generated successfully' + (generateAgreement ? ' and agreement created' : ''),
      data: {
        receipt: {
          id: receiptId,
          receiptNumber,
          paymentNumber: receiptNumber,
          amount: Number(paymentData.amount || paidAmount),
          totalAmount,
          status: 'paid',
          paymentDate: paymentData.paymentDate || new Date(),
          clientName: `${lead.fname} ${lead.lname}`,
          serviceName: lead.service_interest || '',
          branchName: branchCurrency.branchName,
          currency: branchCurrency.currencyCode,
          consultantName: lead.assignedEmployeeName || ''
        },
        agreement: agreement ? {
          id: agreement.id,
          agreementNumber: agreement.agreementNumber,
          title: agreement.title,
          status: agreement.status,
          totalAmount: agreement.totalAmount,
          currency: agreement.currency,
          startDate: agreement.startDate,
          endDate: agreement.endDate
        } : null,
        lead: {
          id: lead.id,
          name: `${lead.fname} ${lead.lname}`,
          status: lead.status,
          paidYet: newPaidYet,
          payBalance: newPayBalance,
          payTotal: lead.payTotal
        }
      }
    });

  } catch (error: any) {
    console.error('Error generating receipt:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate receipt', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

function normalizePaymentType(paymentType?: string): 'deposit' | 'installment' | 'final' | 'refund' {
  if (paymentType === 'installment' || paymentType === 'final' || paymentType === 'refund') {
    return paymentType;
  }
  return 'deposit';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');
    const opportunityId = searchParams.get('opportunityId');
    const receiptNumber = searchParams.get('receiptNumber');

    let whereClause: any = {};

    if (leadId) {
      // Get receipts for a specific lead
      const opportunities = await models.DmcOpportunities.findAll({
        where: { leadId },
        attributes: ['id']
      });
      
      if (opportunities.length > 0) {
        whereClause.opportunityId = opportunities.map((opp: any) => opp.id);
      }
    }

    if (opportunityId) {
      whereClause.opportunityId = opportunityId;
    }

    if (receiptNumber) {
      whereClause.paymentNumber = receiptNumber;
    }

    const receipts = await models.DmcOpportunityPayments.findAll({
      where: whereClause,
      include: [
        {
          association: 'dmcOpportunity',
          attributes: ['id', 'opportunityName', 'leadId'],
          include: [
            {
              association: 'dmcForumLead',
              attributes: ['id', 'fname', 'lname', 'email', 'mobile']
            }
          ]
        },
        {
          association: 'createdEmployee',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return NextResponse.json(receipts);

  } catch (error: any) {
    console.error('Error fetching receipts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch receipts', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
