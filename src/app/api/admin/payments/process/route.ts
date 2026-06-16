import { NextRequest, NextResponse } from 'next/server';
import { Dm3partyPayment, DmcForumLeads, DmcForumLeadsFee } from '@/models';
import { DmcForumLeadsFeeCreationAttributes } from '@/models/DmcForumLeadsFee';
import { Dm3partyPaymentCreationAttributes } from '@/models/Dm3partyPayment';



export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { leadId, payments, totalAmount, receiptNumber } = body;

        if (!leadId) {
            return NextResponse.json({ message: 'Lead ID is required' }, { status: 400 });
        }

        const lead = await DmcForumLeads.findByPk(leadId);
        if (!lead) {
            return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
        }

        // 1. Create payment records (third party or lead fee)
        // For now, let's create a Dm3partyPayment as it seems to be the main the component uses
        const createdPayments = [];
        for (const payment of payments) {
            const paymentData: Dm3partyPaymentCreationAttributes = {
                leadId: leadId,
                date: new Date(payment.date),
                currency_id: 1, // Default
                amount: parseFloat(payment.amount),
                Tax: 0, // Default
                payMethod: payment.method,
                emp_id: 1, // Should be from session
                receipt_date: new Date(payment.date),
                cc_number: payment.reference || '',
                receipt: receiptNumber,
                counselor_receipt: receiptNumber,
                trans_or_ref_number: payment.reference || '',
                remarks: payment.notes || '',
                payoption: 'Full Payment',
                paycardoption: 'N/A'
            };
            const newPayment = await Dm3partyPayment.create(paymentData);
            createdPayments.push(newPayment);

            // Also create a DmcForumLeadsFee record
            const feeData: DmcForumLeadsFeeCreationAttributes = {
                lead: leadId as any,
                amount: parseFloat(payment.amount),
                taxAmt: 0,
                payDate: new Date(payment.date),
                paidAmt: parseFloat(payment.amount),
                paidDate: new Date(payment.date),
                profAmt: parseFloat(payment.amount),
                status: 1
            };
            await DmcForumLeadsFee.create(feeData);
        }

        // 2. Update lead balance
        const currentPaid = parseFloat(lead.paidYet as any || 0);
        const newPaid = currentPaid + totalAmount;
        const newBalance = Math.max(0, lead.payTotal - newPaid);

        await lead.update({
            paidYet: newPaid,
            payBalance: newBalance,
            stepComplete: newPaid >= lead.payTotal ? 3 : 2 // 3 = Fully Paid / Signed
        });

        return NextResponse.json({
            success: true,
            message: 'Payments processed successfully',
            paymentId: createdPayments[0]?.id
        });
    } catch (error: any) {
        console.error('Payment processing error:', error);
        return NextResponse.json(
            { message: 'Failed to process payments: ' + error.message },
            { status: 500 }
        );
    }
}
