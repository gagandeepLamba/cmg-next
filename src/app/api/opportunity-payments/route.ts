import { NextRequest, NextResponse } from 'next/server';
import { DmcOpportunityPayments } from '@/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const opportunityId = searchParams.get('opportunityId');
    const status = searchParams.get('status');

    let whereClause: any = {};
    
    if (opportunityId) {
      whereClause.opportunityId = opportunityId;
    }
    
    if (status) {
      whereClause.status = status;
    }

    const payments = await DmcOpportunityPayments.findAll({
      where: whereClause,
      include: [
        {
          association: 'dmcOpportunity',
          attributes: ['id', 'opportunityName', 'estimatedValue', 'currency']
        },
        {
          association: 'createdEmployee',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const paymentData = {
      ...body,
      paymentNumber: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      paymentStructure: body.paymentStructure || 'full',
      paymentType: normalizePaymentType(body.paymentType),
      status: normalizePaymentStatus(body.status),
      totalAmount: body.totalAmount || body.amount || 0,
      paidAmount: body.paidAmount || body.amount || 0,
      remainingBalance: body.remainingBalance ?? body.balanceAmount ?? Math.max(Number(body.totalAmount || body.amount || 0) - Number(body.paidAmount || body.amount || 0), 0),
      transactionId: body.transactionId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const payment = await DmcOpportunityPayments.create(paymentData);

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
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

function normalizePaymentStatus(status?: string): 'pending' | 'paid' | 'failed' | 'refunded' {
  if (status === 'paid' || status === 'failed' || status === 'refunded') {
    return status;
  }
  if (status === 'completed') {
    return 'paid';
  }
  return 'pending';
}
