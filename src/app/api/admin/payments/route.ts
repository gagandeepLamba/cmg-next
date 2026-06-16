import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { Dm3partyPayment, DmcForumLeadsFee, DmcForumLeads } from '@/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || 'thirdparty';
    const paymentMethod = searchParams.get('paymentMethod') || '';

    const offset = (page - 1) * limit;

    if (type === 'thirdparty') {
      const where: any = {};
      if (search) {
        where[Op.or] = [
          { receipt: { [Op.like]: `%${search}%` } },
          { trans_or_ref_number: { [Op.like]: `%${search}%` } }
        ];
      }
      if (paymentMethod) {
        where.payMethod = paymentMethod;
      }

      const { count, rows } = await Dm3partyPayment.findAndCountAll({
        where,
        attributes: [
          'id', 'leadId', 'date', 'currency_id', 'amount', 'Tax', 'payMethod',
          'emp_id', 'receipt_date', 'cc_number', 'receipt', 'counselor_receipt',
          'trans_or_ref_number', 'remarks'
        ],
        limit,
        offset,
        order: [['receipt_date', 'DESC']]
      });

      return NextResponse.json({
        data: rows,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      });
    } else {
      const where: any = {};
      if (search) {
        where.lead = search;
      }

      const { count, rows } = await DmcForumLeadsFee.findAndCountAll({
        where,
        limit,
        offset,
        order: [['paidDate', 'DESC']]
      });

      return NextResponse.json({
        data: rows,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      });
    }
  } catch (error: any) {
    console.error('Fetch payments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'thirdparty') {
      const newPayment = await Dm3partyPayment.create({
        ...data,
        date: data.date ? new Date(data.date) : new Date(),
        receipt_date: data.receipt_date ? new Date(data.receipt_date) : new Date(),
      });
      return NextResponse.json(newPayment, { status: 201 });
    } else {
      const newFee = await DmcForumLeadsFee.create({
        ...data,
        payDate: data.payDate ? new Date(data.payDate) : new Date(),
        paidDate: data.paidDate ? new Date(data.paidDate) : new Date(),
      });
      return NextResponse.json(newFee, { status: 201 });
    }
  } catch (error: any) {
    console.error('Create payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    if (type === 'thirdparty') {
      const payment = await Dm3partyPayment.findByPk(id);
      if (!payment) {
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
      }
      await payment.update(updateData);
      return NextResponse.json(payment);
    } else {
      const fee = await DmcForumLeadsFee.findByPk(id);
      if (!fee) {
        return NextResponse.json({ error: 'Fee not found' }, { status: 404 });
      }
      await fee.update(updateData);
      return NextResponse.json(fee);
    }
  } catch (error: any) {
    console.error('Update payment error:', error);
    return NextResponse.json(
      { error: 'Failed to update payment: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'thirdparty';

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    if (type === 'thirdparty') {
      const deleted = await Dm3partyPayment.destroy({ where: { id } });
      if (!deleted) {
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
      }
    } else {
      const deleted = await DmcForumLeadsFee.destroy({ where: { id } });
      if (!deleted) {
        return NextResponse.json({ error: 'Fee not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ message: 'Payment deleted successfully' });
  } catch (error: any) {
    console.error('Delete payment error:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment: ' + error.message },
      { status: 500 }
    );
  }
}
