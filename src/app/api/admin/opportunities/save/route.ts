import { NextRequest, NextResponse } from 'next/server';
import { sequelize } from '@/lib/sequelize';
import { QueryTypes } from 'sequelize';

// Only these columns are allowed in the dynamic UPDATE to prevent accidental overwrites.
const ALLOWED_LEAD_UPDATE_COLS = new Set([
  'service_interest', 'payTotal', 'priority', 'stepComplete',
  'demandAmt', 'dueDate', 'paidYet', 'payBalance', 'feeAgreeDate',
  'agreeDate', 'status', 'last_updated', 'last_updtd_time',
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, stage, data, completeFlow = false } = body;

    if (!leadId) {
      return NextResponse.json({ message: 'Lead ID is required' }, { status: 400 });
    }

    const [leadResult] = await sequelize.query(
      `SELECT * FROM dmc_forum_leads WHERE id = ?`,
      { replacements: [leadId], type: QueryTypes.SELECT }
    );

    if (!leadResult) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    const lead = leadResult as any;

    if (completeFlow && stage === 'retained') {
      return await handleCompleteFlow(leadId, data, lead);
    }

    const updateData: Record<string, unknown> = {
      last_updated: new Date().toISOString().split('T')[0],
      last_updtd_time: new Date().toTimeString().split(' ')[0],
    };

    if (stage === 'prospect') {
      updateData.service_interest = data.serviceRequired || lead.service_interest;
      updateData.payTotal = data.estimatedValue ? parseFloat(data.estimatedValue) : lead.payTotal;
      updateData.priority = data.priority || lead.priority;
      updateData.stepComplete = 1;
    } else if (stage === 'quotation') {
      updateData.demandAmt = data.total || lead.demandAmt;
      updateData.dueDate = data.validUntil ? new Date(data.validUntil) : lead.dueDate;
      updateData.stepComplete = 1;
    } else if (stage === 'payment') {
      updateData.paidYet = data.paidAmount || lead.paidYet;
      updateData.payBalance = data.remainingBalance || lead.payBalance;
      if (data.paymentDate) updateData.feeAgreeDate = new Date(data.paymentDate);
      updateData.stepComplete = 2;
    } else if (stage === 'documents') {
      updateData.stepComplete = 2;
    } else if (stage === 'agreement') {
      updateData.agreeDate = data.startDate ? new Date(data.startDate) : lead.agreeDate;
      updateData.stepComplete = 2;
    } else if (stage === 'retained') {
      updateData.stepComplete = data.retentionStatus === 'approved' ? 3 : 2;
      updateData.status = data.retentionStatus === 'approved' ? 'Converted' : 'In Progress';
    }

    // Filter to only whitelisted columns before building the SET clause.
    const safeKeys = Object.keys(updateData).filter(k => ALLOWED_LEAD_UPDATE_COLS.has(k));
    if (safeKeys.length > 0) {
      await sequelize.query(
        `UPDATE dmc_forum_leads SET ${safeKeys.map(k => `\`${k}\` = ?`).join(', ')} WHERE id = ?`,
        { replacements: [...safeKeys.map(k => updateData[k]), leadId] }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Stage ${stage} saved successfully`,
      lead: { ...lead, ...updateData },
    });
  } catch (error: any) {
    console.error('Opportunity save error:', error);
    return NextResponse.json(
      { message: 'Failed to save opportunity stage: ' + error.message },
      { status: 500 }
    );
  }
}

async function handleCompleteFlow(leadId: number, data: any, lead: any) {
  const t = await sequelize.transaction();
  try {
    // Create opportunity record
    const [oppMeta] = await sequelize.query(
      `INSERT INTO dmc_opportunities (
        leadId, opportunityNumber, opportunityName, description, serviceType,
        estimatedValue, currency, status, priority, assignedTo, createdBy,
        source, conversionDate, leadSource, expectedCloseDate, probability,
        stage, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          leadId,
          `OPP-${Date.now()}-${Math.random().toString(36).slice(2, 11).toUpperCase()}`,
          data.opportunityName || `${lead.fname} ${lead.lname} - ${lead.service_interest}`,
          data.description || `Opportunity created for lead: ${lead.fname} ${lead.lname}`,
          lead.service_interest,
          data.estimatedValue || lead.payTotal || 0,
          'AED',
          'qualified',
          data.priority || 'Medium',
          lead.assignTo,
          data.createdBy || lead.assignTo,
          'lead_conversion',
          new Date(),
          lead.market_source,
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          75,
          'qualified',
          new Date(),
          new Date(),
        ],
        transaction: t,
      }
    ) as any;

    const opportunityId = (oppMeta as any)?.insertId;
    if (!opportunityId) throw new Error('Failed to create opportunity record — insertId missing');

    // Create payment record
    await sequelize.query(
      `INSERT INTO dm_opportunity_payments (
        opportunityId, paymentNumber, paymentType, amount, currency,
        status, paymentMethod, paymentDate, dueDate, description,
        paidAmount, balanceAmount, createdBy, notes, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          opportunityId,
          `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          'initial_deposit',
          data.totalAmount || lead.payTotal || 0,
          'AED',
          'pending',
          data.paymentMethod || 'cash',
          new Date(),
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          'Initial payment for opportunity',
          data.paidAmount || 0,
          (data.totalAmount || lead.payTotal || 0) - (data.paidAmount || 0),
          data.createdBy || lead.assignTo,
          data.notes || '',
          new Date(),
          new Date(),
        ],
        transaction: t,
      }
    );

    // Create agreement record
    await sequelize.query(
      `INSERT INTO dm_opportunity_agreements (
        opportunityId, agreementNumber, agreementType, templateId, status,
        title, description, termsAndConditions, totalAmount, currency,
        startDate, endDate, signedDate, clientName, clientEmail, clientPhone,
        companyName, companyAddress, createdBy, uploadedBy, generatedDate,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          opportunityId,
          `AGR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          'service_agreement',
          null,
          'draft',
          data.agreementTitle || `Service Agreement - ${lead.fname} ${lead.lname}`,
          data.description || `Service agreement for ${lead.service_interest}`,
          data.terms || '',
          data.totalAmount || lead.payTotal || 0,
          'AED',
          data.startDate ? new Date(data.startDate) : new Date(),
          data.endDate ? new Date(data.endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          null,
          `${lead.fname} ${lead.lname}`,
          lead.email,
          lead.mobile || lead.phone,
          data.companyName || '',
          data.companyAddress || lead.address || '',
          data.createdBy || lead.assignTo,
          data.createdBy || lead.assignTo,
          new Date(),
          new Date(),
          new Date(),
        ],
        transaction: t,
      }
    );

    // Update lead status
    await sequelize.query(
      `UPDATE dmc_forum_leads
       SET status = 'opportunity_created', convet = 'Opportunity',
           opportunity_id = ?, opportunity_status = 'qualified',
           stepComplete = 3, last_updated = ?, last_updtd_time = ?
       WHERE id = ?`,
      {
        replacements: [
          opportunityId,
          new Date().toISOString().split('T')[0],
          new Date().toTimeString().split(' ')[0],
          leadId,
        ],
        transaction: t,
      }
    );

    await t.commit();

    return NextResponse.json({
      success: true,
      message: 'Lead successfully converted to opportunity with complete flow data',
      data: {
        opportunityId,
        leadStatus: 'opportunity_created',
      },
    });
  } catch (error: any) {
    await t.rollback();
    console.error('Complete flow error:', error);
    return NextResponse.json(
      { message: 'Failed to complete opportunity flow: ' + error.message },
      { status: 500 }
    );
  }
}
