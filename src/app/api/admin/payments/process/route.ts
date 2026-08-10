import { NextRequest, NextResponse } from 'next/server';
import { sequelize } from '@/lib/sequelize';
import { Dm3partyPayment, DmcForumLeads, DmcForumLeadsFee } from '@/models';
import { DmcForumLeadsFeeCreationAttributes } from '@/models/DmcForumLeadsFee';
import { Dm3partyPaymentCreationAttributes } from '@/models/Dm3partyPayment';
import { requireAuth, isAuthError } from '@/lib/apiAuth';

export async function POST(request: NextRequest) {
  const auth = requireAuth(request, ['payments.view', 'payments.create', 'finance.view', 'finance.manage']);
  if (isAuthError(auth)) return auth;
  try {
    const body = await request.json();
    const { leadId, payments, totalAmount, receiptNumber } = body;

    if (!leadId) {
      return NextResponse.json({ message: 'Lead ID is required' }, { status: 400 });
    }

    if (!Number.isFinite(Number(totalAmount)) || Number(totalAmount) <= 0) {
      return NextResponse.json({ message: 'totalAmount must be greater than zero' }, { status: 422 });
    }
    if (Array.isArray(payments) && payments.some((p) => !(Number(p?.amount) > 0))) {
      return NextResponse.json({ message: 'Each payment amount must be greater than zero' }, { status: 422 });
    }

    const lead = await DmcForumLeads.findByPk(leadId);
    if (!lead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    if (!Array.isArray(payments) || payments.length === 0) {
      return NextResponse.json({ message: 'payments array is required' }, { status: 400 });
    }

    // Duplicate-submission guard: dm_3party_payment has no insertion
    // timestamp to check a "just now" window against, so this blocks an
    // exact repeat instead - same lead, amount, method, and date already on
    // file is overwhelmingly more likely to be a resubmitted click than a
    // genuine second identical payment (mirrors the same-slot check already
    // used for appointments in src/app/api/appointments/route.ts).
    for (const payment of payments) {
      const [existing] = await Dm3partyPayment.findAll({
        where: {
          leadId,
          amount: parseFloat(payment.amount),
          payMethod: payment.method,
          date: new Date(payment.date),
        },
        limit: 1,
      });
      if (existing) {
        return NextResponse.json(
          { message: 'A matching payment for this lead has already been recorded - check the payment history before resubmitting.' },
          { status: 409 }
        );
      }
    }

    const t = await sequelize.transaction();
    try {
      const createdPayments = [];

      for (const payment of payments) {
        const paymentData: Dm3partyPaymentCreationAttributes = {
          leadId,
          date: new Date(payment.date),
          currency_id: 1,
          amount: parseFloat(payment.amount),
          Tax: 0,
          payMethod: payment.method,
          emp_id: 1,
          receipt_date: new Date(payment.date),
          cc_number: payment.reference || '',
          receipt: receiptNumber,
          counselor_receipt: receiptNumber,
          trans_or_ref_number: payment.reference || '',
          remarks: payment.notes || '',
          payoption: 'Full Payment',
          paycardoption: 'N/A',
        };
        const newPayment = await Dm3partyPayment.create(paymentData, { transaction: t });
        createdPayments.push(newPayment);

        const feeData: DmcForumLeadsFeeCreationAttributes = {
          lead: leadId as any,
          amount: parseFloat(payment.amount),
          taxAmt: 0,
          payDate: new Date(payment.date),
          paidAmt: parseFloat(payment.amount),
          paidDate: new Date(payment.date),
          profAmt: parseFloat(payment.amount),
          status: 1,
        };
        await DmcForumLeadsFee.create(feeData, { transaction: t });
      }

      const currentPaid = parseFloat(lead.paidYet as any || 0);
      const newPaid = currentPaid + totalAmount;
      const newBalance = Math.max(0, lead.payTotal - newPaid);

      await lead.update(
        {
          paidYet: newPaid,
          payBalance: newBalance,
          stepComplete: newPaid >= lead.payTotal ? 3 : 2,
        },
        { transaction: t }
      );

      await t.commit();

      return NextResponse.json({
        success: true,
        message: 'Payments processed successfully',
        paymentId: createdPayments[0]?.id,
      });
    } catch (innerErr: any) {
      await t.rollback();
      throw innerErr;
    }
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { message: 'Failed to process payments: ' + error.message },
      { status: 500 }
    );
  }
}
