import { NextRequest, NextResponse } from 'next/server'
import { Dm3partyPayment, Dm3partyPaymentDet, DmcForumLeads } from '@/models'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const leadId = searchParams.get('leadId')
    const status = searchParams.get('status')
    const paymentMethod = searchParams.get('paymentMethod')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (leadId) {
      where.leadId = parseInt(leadId)
    }

    if (status) {
      where.status = status
    }

    if (paymentMethod) {
      where.payMethod = paymentMethod
    }

    const [payments, total] = await Promise.all([
      Dm3partyPayment.findAll({
        where,
        attributes: [
          'id', 'leadId', 'date', 'currency_id', 'amount', 'Tax', 'payMethod',
          'emp_id', 'receipt_date', 'cc_number', 'receipt', 'counselor_receipt',
          'trans_or_ref_number', 'remarks'
        ],
        offset: skip,
        limit: limit,
        order: [['date', 'DESC']],
      }),
      Dm3partyPayment.count({ where })
    ])

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { details, ...paymentData } = data

    // Create payment record
    const payment = await Dm3partyPayment.create({
      ...paymentData,
      receipt_date: new Date(),
      payoption: paymentData.payoption || '',
      paycardoption: paymentData.paycardoption || ''
    });

    // Create payment details if provided
    if (details && details.length > 0) {
      const paymentDetails = details.map((detail: any) => ({
        ...detail,
        payId: payment.id
      }))

      await Dm3partyPaymentDet.bulkCreate(paymentDetails)
    }

    // Reload with associations
    const paymentWithDetails = await Dm3partyPayment.findByPk(payment.id, {
      include: [
        {
          association: 'lead',
          attributes: ['id', 'fname', 'lname', 'email']
        },
        {
          model: Dm3partyPaymentDet,
          as: 'details'
        }
      ]
    });

    return NextResponse.json(paymentWithDetails, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
