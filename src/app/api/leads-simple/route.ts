import { NextRequest, NextResponse } from 'next/server';
import { sequelize } from '@/lib/sequelize';
import { resolveLeadAutoAssignment } from '@/lib/leadAutoAssignment';
import { verifyToken } from '@/lib/auth';
import { QueryTypes } from 'sequelize';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const authorization = request.headers.get('authorization');
    const token = request.cookies.get('auth-token')?.value || authorization?.replace(/^Bearer\s+/i, '');
    const currentUser = token ? verifyToken(token) : null;

    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'Authentication is required to create a lead' }, { status: 401 });
    }

    const counselorBranchId = Number(currentUser.branch || data.branch || data.branchId || 0);
    if (!counselorBranchId) {
      return NextResponse.json({ success: false, error: 'Your login does not have a branch assigned' }, { status: 422 });
    }
    
    console.log('Creating lead:', data);
    const assignment = await resolveLeadAutoAssignment({
      branchId: counselorBranchId,
      preferredEmployeeId: currentUser.id,
      forceAutoAssign: false,
      roundRobin: false,
    });

    // This legacy table does not auto-increment IDs in every deployment, so
    // allocate one explicitly before inserting a counselor-created lead.
    const nextIdRows = await sequelize.query<{ nextId: number }>(`
      SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM dmc_forum_leads
    `, { type: QueryTypes.SELECT });
    const leadId = Number(nextIdRows[0]?.nextId || 0);
    if (!leadId) throw new Error('Could not allocate a lead ID');

    // Simple lead creation with minimal required fields
    const [result] = await sequelize.query(`
      INSERT INTO dmc_forum_leads (
        id, fname, mname, lname, email, phone, mobile, nationality, address,
        status, priority, regdate, regtime, created, created_by,
        assignTo, branch, region, Counsilor, case_officer
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, {
      replacements: [
        leadId,
        data.fname || '',
        data.mname || '',
        data.lname || '',
        data.email || '',
        data.phone || '',
        data.mobile || data.phone || '',
        data.nationality || 'Unknown',
        data.address || '',
        'New',
        data.priority || 'P1',
        new Date().toISOString().split('T')[0], // regdate
        new Date().toTimeString().split(' ')[0], // regtime
        new Date().toISOString(), // created
        currentUser.id,
        assignment.assignedEmployeeId,
        assignment.branchId,
        1, // region (use valid region ID 1)
        assignment.counselorId,
        1  // case_officer (use valid employee ID 1)
      ]
    });

    // Get the created lead
    const [newLead] = await sequelize.query(`
      SELECT id, fname, lname, email, phone, status, priority, created
      FROM dmc_forum_leads
      WHERE id = ?
      LIMIT 1
    `, { replacements: [leadId] });

    return NextResponse.json({
      success: true,
      data: newLead[0],
      assignment
    });

  } catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [leads] = await sequelize.query(`
      SELECT id, fname, lname, email, phone, status, priority, created 
      FROM dmc_forum_leads 
      ORDER BY created DESC 
      LIMIT 10
    `);

    return NextResponse.json({
      success: true,
      data: leads
    });

  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
