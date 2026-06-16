import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';
import { resolveLeadAutoAssignment } from '@/lib/leadAutoAssignment';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = Number.parseInt(searchParams.get('branchId') || '1', 10);
    const assignment = await resolveLeadAutoAssignment({ branchId, forceAutoAssign: true, roundRobin: true });

    const candidates = await sequelize.query(
      `SELECT
          e.id,
          e.name,
          e.email,
          e.branch,
          COUNT(l.id) AS openLeadCount
        FROM dm_employee e
        LEFT JOIN dmc_forum_leads l
          ON l.assignTo = e.id
          AND COALESCE(l.status, '') NOT IN ('Converted', 'Closed', 'Lost', 'client', 'retained')
        WHERE e.status = 1 AND e.branch = :branchId
        GROUP BY e.id, e.name, e.email, e.branch
        ORDER BY openLeadCount ASC, e.name ASC`,
      {
        replacements: { branchId: assignment.branchId },
        type: QueryTypes.SELECT,
      }
    );

    return NextResponse.json({ success: true, assignment, candidates });
  } catch (error: any) {
    console.error('Lead auto-assignment lookup failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to resolve lead assignment' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const leadId = Number.parseInt(String(body.leadId || ''), 10);
    const branchId = Number.parseInt(String(body.branchId || body.branch || '1'), 10);

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'leadId is required' },
        { status: 400 }
      );
    }

    const assignment = await resolveLeadAutoAssignment({ branchId, forceAutoAssign: true, roundRobin: true });

    await sequelize.query(
      `UPDATE dmc_forum_leads
       SET assignTo = :employeeId,
           Counsilor = :employeeId,
           branch = :branchId,
           last_updated = :updatedDate,
           last_updtd_time = :updatedTime
       WHERE id = :leadId`,
      {
        replacements: {
          employeeId: assignment.assignedEmployeeId,
          branchId: assignment.branchId,
          leadId,
          updatedDate: new Date().toISOString().split('T')[0],
          updatedTime: new Date().toTimeString().split(' ')[0],
        },
      }
    );

    return NextResponse.json({ success: true, assignment });
  } catch (error: any) {
    console.error('Lead auto-assignment update failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to auto assign lead' },
      { status: 500 }
    );
  }
}
