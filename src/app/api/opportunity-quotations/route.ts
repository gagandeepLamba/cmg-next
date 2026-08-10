import { NextRequest, NextResponse } from 'next/server';
import { DmcOpportunityQuotations } from '@/models';
import { requireAuth, isAuthError } from '@/lib/apiAuth';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request, ['leads.view']);
    if (isAuthError(auth)) return auth;

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

    const quotations = await DmcOpportunityQuotations.findAll({
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

    return NextResponse.json(quotations);
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request, ['leads.view', 'leads.create']);
    if (isAuthError(auth)) return auth;

    const body = await request.json();

    if (body.total !== undefined && body.total !== null && body.total !== '') {
      const total = Number(body.total);
      if (!Number.isFinite(total) || total < 0) {
        return NextResponse.json({ error: 'total must be a non-negative number' }, { status: 422 });
      }
    }

    const quotationData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const quotation = await DmcOpportunityQuotations.create(quotationData);

    return NextResponse.json(quotation, { status: 201 });
  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}
