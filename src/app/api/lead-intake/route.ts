import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';
import { resolveLeadAutoAssignment } from '@/lib/leadAutoAssignment';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const requiredFields = ['name', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const [firstName, ...lastParts] = String(data.name).trim().split(/\s+/);
    const assignment = await resolveLeadAutoAssignment({
      branchId: Number(data.branch || data.branchId || 4),
      preferredEmployeeId: data.assignTo ? Number(data.assignTo) : null,
      forceAutoAssign: !data.assignTo,
      roundRobin: true,
    });

    const [result] = await sequelize.query(
      `INSERT INTO dmc_forum_leads
        (fname, lname, email, phone, mobile, nationality, address, country_interest,
         service_interest, market_source, enquiry, status, priority, regdate, regtime,
         created, created_by, assignTo, branch, region, Counsilor, case_officer)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          firstName || '',
          lastParts.join(' '),
          data.email,
          data.phone,
          data.mobile || data.phone,
          data.nationality || '',
          data.address || '',
          data.country || '',
          data.program || data.service || '',
          data.source || data.market_source || '',
          data.message || '',
          'New',
          data.priority || 'medium',
          new Date(),
          new Date().toTimeString().split(' ')[0],
          new Date(),
          Number(data.createdBy || 1),
          assignment.assignedEmployeeId,
          assignment.branchId,
          Number(data.region || 1),
          assignment.counselorId,
          Number(data.caseOfficer || assignment.assignedEmployeeId),
        ],
      }
    );

    const leadId = Number((result as any).insertId || 0);
    return NextResponse.json({
      success: true,
      leadId,
      assignedTo: assignment.assignedEmployeeId,
      assignment,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error processing lead intake:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'counselors') {
      const rows = await sequelize.query(
        `SELECT id, name, email, mobile AS phone, branch, status
         FROM dm_employee
         WHERE status = 1
         ORDER BY name ASC`,
        { type: QueryTypes.SELECT }
      );
      return NextResponse.json(rows);
    }

    if (action === 'rules') {
      const rows = await sequelize.query(
        `SELECT id, branch_id, counsilors, status, created
         FROM dm_counsilor_allocations
         ORDER BY created DESC`,
        { type: QueryTypes.SELECT }
      );
      return NextResponse.json(rows);
    }

    if (action === 'system-stats') {
      const [stats] = await sequelize.query<any>(
        `SELECT
          (SELECT COUNT(*) FROM dm_employee WHERE status = 1) AS activeCounselors,
          (SELECT COUNT(*) FROM dmc_forum_leads) AS totalLeads,
          (SELECT COUNT(*) FROM dmc_forum_leads WHERE DATE(created) = CURDATE()) AS leadsToday,
          (SELECT COUNT(*) FROM dm_counsilor_allocations WHERE status = 1) AS activeRules`,
        { type: QueryTypes.SELECT }
      );
      return NextResponse.json(stats || {});
    }

    return NextResponse.json({ message: 'Available actions: system-stats, counselors, rules' });
  } catch (error: any) {
    console.error('Error in lead intake GET:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
