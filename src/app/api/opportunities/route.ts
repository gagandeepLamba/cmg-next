// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { DmcOpportunities } from '@/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assignedTo');

    let whereClause: any = {};
    
    if (leadId) {
      whereClause.leadId = leadId;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (assignedTo) {
      whereClause.assignedTo = assignedTo;
    }

    const opportunities = await DmcOpportunities.findAll({
      where: whereClause,
      include: [
        {
          association: 'dmcForumLead',
          attributes: ['id', 'fname', 'lname', 'email', 'mobile', 'nationality', 'service_interest']
        },
        {
          association: 'assignedEmployee',
          attributes: ['id', 'name']
        },
        {
          association: 'createdEmployee', 
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return NextResponse.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const opportunityData = {
      ...body,
      opportunityNumber: `OPP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const opportunity = await DmcOpportunities.create(opportunityData);

    return NextResponse.json(opportunity, { status: 201 });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to create opportunity' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    const opportunity = await DmcOpportunities.findByPk(id);
    
    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    await opportunity.update(body);

    return NextResponse.json(opportunity);
  } catch (error) {
    console.error('Error updating opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to update opportunity' },
      { status: 500 }
    );
  }
}
