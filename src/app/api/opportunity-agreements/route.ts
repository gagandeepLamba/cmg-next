import { NextRequest, NextResponse } from 'next/server';
import { DmcOpportunityAgreements } from '@/models';

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

    const agreements = await DmcOpportunityAgreements.findAll({
      where: whereClause,
      include: [
        {
          association: 'dmcOpportunity',
          attributes: ['id', 'opportunityName', 'estimatedValue', 'currency']
        },
        {
          association: 'createdEmployee',
          attributes: ['id', 'name']
        },
        {
          association: 'uploadedEmployee',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return NextResponse.json(agreements);
  } catch (error) {
    console.error('Error fetching agreements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agreements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const agreementData = {
      ...body,
      generatedDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const agreement = await DmcOpportunityAgreements.create(agreementData);

    return NextResponse.json(agreement, { status: 201 });
  } catch (error) {
    console.error('Error creating agreement:', error);
    return NextResponse.json(
      { error: 'Failed to create agreement' },
      { status: 500 }
    );
  }
}
