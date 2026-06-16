// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { models } from '@/models';

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

    // Step 1: Validate lead exists
    const lead = await models.DmcForumLeads.findByPk(leadId, {
      include: [
        { association: 'dmEmployeeByASSIGNTo', attributes: ['id', 'name'] },
        { association: 'dmBranch', attributes: ['id', 'name'] }
      ]
    });

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

    // Step 3: Create receipt record
    const receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const paidAmount = Number(paymentData.paidAmount || paymentData.amount || 0);
    const totalAmount = Number(paymentData.totalAmount || paymentData.amount || lead.payTotal || 0);
    const taxAmount = Number(receiptData.taxAmount || 0);
    const discountAmount = Number(receiptData.discountAmount || 0);

    const receipt = await models.DmcOpportunityPayments.create({
      opportunityId: opportunityId || null,
      paymentNumber: receiptNumber,
      paymentStructure: paymentData.paymentStructure || 'full',
      paymentType: normalizePaymentType(paymentData.paymentType),
      totalAmount,
      amount: paymentData.amount || paidAmount,
      currency: 'AED',
      status: 'paid',
      paymentMethod: paymentData.paymentMethod || 'cash',
      transactionId: paymentData.transactionId || null,
      paymentDate: paymentData.paymentDate || new Date(),
      dueDate: paymentData.dueDate || new Date(),
      description: receiptData.description || `Payment receipt for ${lead.fname} ${lead.lname}`,
      paidAmount,
      remainingBalance: Math.max(totalAmount - paidAmount, 0),
      balanceAmount: Math.max(totalAmount - paidAmount, 0),
      createdBy: paymentData.createdBy || lead.assignTo,
      notes: receiptData.notes || '',
      receiptNumber,
      receiptType: receiptData.receiptType || 'payment',
      clientName: `${lead.fname} ${lead.lname}`,
      clientEmail: lead.email,
      clientPhone: lead.mobile || lead.phone,
      clientAddress: lead.address || '',
      serviceName: lead.service_interest || '',
      branchName: lead.dmBranch?.name || '',
      consultantName: lead.dmEmployeeByASSIGNTo?.name || '',
      taxAmount,
      discountAmount,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Step 4: Update lead payment information
    const newPaidYet = (lead.paidYet || 0) + (paymentData.paidAmount || paymentData.amount || 0);
    const newPayBalance = (lead.payTotal || 0) - newPaidYet;

    await lead.update({
      paidYet: newPaidYet,
      payBalance: newPayBalance,
      last_updated: new Date().toLocaleDateString(),
      last_updtd_time: new Date().toTimeString().split(' ')[0],
      status: newPayBalance <= 0 ? 'fully_paid' : 'partially_paid',
      status_date: new Date()
    });

    // Step 5: Update opportunity if exists
    if (opportunity) {
      await opportunity.update({
        updatedAt: new Date()
      });

      // Create opportunity activity
      await models.DmcOpportunityActivities.create({
        opportunityId: opportunity.id,
        activityType: 'payment_received',
        activityTitle: 'Payment received',
        description: `Payment of AED ${paidAmount} received`,
        activityDate: new Date(),
        assignedTo: paymentData.createdBy || lead.assignTo,
        createdBy: paymentData.createdBy || lead.assignTo,
        status: 'completed',
        priority: 'medium',
        notes: `Receipt ${receipt.receiptNumber} generated.`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Step 6: Generate agreement if requested
    let agreement = null;
    if (generateAgreement && agreementData) {
      agreement = await models.DmcOpportunityAgreements.create({
        opportunityId: opportunityId || null,
        agreementNumber: `AGR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        agreementType: agreementData.agreementType || 'service_agreement',
        templateId: agreementData.templateId || null,
        status: 'draft',
        title: agreementData.title || `Service Agreement - ${lead.fname} ${lead.lname}`,
        description: agreementData.description || `Service agreement for ${lead.service_interest}`,
        termsAndConditions: agreementData.termsAndConditions || '',
        totalAmount: agreementData.totalAmount || lead.payTotal || 0,
        currency: 'AED',
        startDate: agreementData.startDate || new Date(),
        endDate: agreementData.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        signedDate: null,
        clientName: `${lead.fname} ${lead.lname}`,
        clientEmail: lead.email,
        clientPhone: lead.mobile || lead.phone,
        companyName: agreementData.companyName || '',
        companyAddress: agreementData.companyAddress || lead.address || '',
        createdBy: agreementData.createdBy || lead.assignTo,
        uploadedBy: agreementData.createdBy || lead.assignTo,
        generatedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Update lead status to reflect agreement generation
      await lead.update({
        status: 'agreement_generated',
        convet: 'Agreement',
        stepComplete: 3,
        status_date: new Date()
      });
    }

    // Step 7: Return complete receipt and agreement data
    return NextResponse.json({
      success: true,
      message: 'Receipt generated successfully' + (generateAgreement ? ' and agreement created' : ''),
      data: {
        receipt: {
          id: receipt.id,
          receiptNumber: receipt.receiptNumber,
          paymentNumber: receipt.paymentNumber,
          amount: receipt.amount,
          totalAmount: receipt.totalAmount,
          status: receipt.status,
          paymentDate: receipt.paymentDate,
          clientName: receipt.clientName,
          serviceName: receipt.serviceName,
          branchName: receipt.branchName,
          consultantName: receipt.consultantName
        },
        agreement: agreement ? {
          id: agreement.id,
          agreementNumber: agreement.agreementNumber,
          title: agreement.title,
          status: agreement.status,
          totalAmount: agreement.totalAmount,
          startDate: agreement.startDate,
          endDate: agreement.endDate
        } : null,
        lead: {
          id: lead.id,
          name: `${lead.fname} ${lead.lname}`,
          status: lead.status,
          paidYet: lead.paidYet,
          payBalance: lead.payBalance,
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
