import { NextRequest, NextResponse } from 'next/server';
import { DmcOpportunities, DmcOpportunityAgreements } from '@/models';

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
    const opportunity = await DmcOpportunities.findByPk(body.opportunityId);
    if (!opportunity) return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    
    const agreementData = {
      ...body,
      currency: opportunity.currency,
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

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    const body = await request.json();

    if (!id) return NextResponse.json({ error: 'Agreement ID is required' }, { status: 400 });

    const agreement = await DmcOpportunityAgreements.findByPk(id);
    if (!agreement) return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });

    const editableFields = [
      'agreementType', 'agreementTitle', 'title', 'description', 'duration',
      'startDate', 'endDate', 'amount', 'totalAmount', 'terms',
      'termsAndConditions', 'specialConditions', 'companyName', 'companyAddress',
    ] as const;
    const updates = Object.fromEntries(
      editableFields
        .filter((field) => body[field] !== undefined)
        .map((field) => [field, body[field]]),
    );

    await agreement.update({ ...updates, updatedAt: new Date() });
    return NextResponse.json({ success: true, data: agreement });
  } catch (error) {
    console.error('Error updating agreement:', error);
    return NextResponse.json({ error: 'Failed to update agreement' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'Agreement ID is required' }, { status: 400 });

    const agreement = await DmcOpportunityAgreements.findByPk(id);
    if (!agreement) return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });

    const opportunityId = agreement.opportunityId;
    await agreement.destroy();
    const latestAgreement = await DmcOpportunityAgreements.findOne({
      where: { opportunityId },
      order: [['createdAt', 'DESC']],
    });

    if (latestAgreement) {
      await DmcOpportunities.update({
        agreementId: latestAgreement.id,
        agreementGenerated: Boolean(latestAgreement.content),
        updatedAt: new Date(),
      }, { where: { id: opportunityId } });
    } else {
      await DmcOpportunities.update(
        { agreementId: null, agreementGenerated: false, updatedAt: new Date() },
        { where: { id: opportunityId } },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting agreement:', error);
    return NextResponse.json({ error: 'Failed to delete agreement' }, { status: 500 });
  }
}
