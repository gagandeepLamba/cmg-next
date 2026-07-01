// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { DmcOpportunities } from '@/models';
import { sequelize } from '@/lib/sequelize';
import { QueryTypes } from 'sequelize';

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

    const whereParts: string[] = [];
    const replacements: Record<string, string> = {};

    if (whereClause.leadId) {
      whereParts.push('o.leadId = :leadId');
      replacements.leadId = whereClause.leadId;
    }

    if (whereClause.status) {
      whereParts.push('o.status = :status');
      replacements.status = whereClause.status;
    }

    if (whereClause.assignedTo) {
      whereParts.push('o.assignedTo = :assignedTo');
      replacements.assignedTo = whereClause.assignedTo;
    }

    const rows = await sequelize.query<any>(`
      SELECT
        o.*,
        l.id AS lead_id,
        l.fname AS lead_fname,
        l.lname AS lead_lname,
        l.email AS lead_email,
        l.mobile AS lead_mobile,
        l.nationality AS lead_nationality,
        l.country_interest AS lead_country_interest,
        l.service_interest AS lead_service_interest,
        l.market_source AS lead_market_source,
        COALESCE(cp.name, l.country_interest) AS lead_country_interest_label,
        COALESCE(s.name, pt.type, l.service_interest) AS lead_service_interest_label,
        COALESCE(ms.name, l.market_source) AS lead_market_source_label,
        ae.id AS assigned_employee_id,
        ae.name AS assigned_employee_name,
        ce.id AS created_employee_id,
        ce.name AS created_employee_name
      FROM dmc_opportunities o
      LEFT JOIN dmc_forum_leads l ON o.leadId = l.id
      LEFT JOIN dm_country_proces cp ON cp.id = CAST(l.country_interest AS UNSIGNED)
      LEFT JOIN dm_service s ON s.id = CAST(l.service_interest AS UNSIGNED)
      LEFT JOIN dm_program_type pt ON pt.id = CAST(l.service_interest AS UNSIGNED)
      LEFT JOIN dm_source ms ON ms.id = CAST(l.market_source AS UNSIGNED)
      LEFT JOIN dm_employee ae ON o.assignedTo = ae.id
      LEFT JOIN dm_employee ce ON o.createdBy = ce.id
      ${whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : ''}
      ORDER BY o.createdAt DESC
    `, {
      replacements,
      type: QueryTypes.SELECT
    });

    const opportunities = rows.map((row) => ({
      ...row,
      dmcForumLead: row.lead_id ? {
        id: row.lead_id,
        fname: row.lead_fname,
        lname: row.lead_lname,
        email: row.lead_email,
        mobile: row.lead_mobile,
        nationality: row.lead_nationality,
        country_interest: row.lead_country_interest,
        country_interest_label: row.lead_country_interest_label,
        service_interest: row.lead_service_interest,
        service_interest_label: row.lead_service_interest_label,
        market_source: row.lead_market_source,
        market_source_label: row.lead_market_source_label
      } : null,
      assignedEmployee: row.assigned_employee_id ? {
        id: row.assigned_employee_id,
        name: row.assigned_employee_name
      } : null,
      createdEmployee: row.created_employee_id ? {
        id: row.created_employee_id,
        name: row.created_employee_name
      } : null
    }));

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
