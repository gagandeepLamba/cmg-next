import { NextRequest, NextResponse } from 'next/server';
import { sequelize } from '@/lib/sequelize';
import { resolveLeadAutoAssignment } from '@/lib/leadAutoAssignment';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('Creating lead:', data);
    const assignment = await resolveLeadAutoAssignment({
      branchId: Number.parseInt(String(data.branch || data.branchId || 5), 10) || 5,
      preferredEmployeeId: data.assignTo ? Number.parseInt(String(data.assignTo), 10) : null,
      forceAutoAssign: Boolean(data.autoAssign || !data.assignTo),
      roundRobin: true,
    });

    // Simple lead creation with minimal required fields
    const [result] = await sequelize.query(`
      INSERT INTO dmc_forum_leads (
        fname, mname, lname, email, phone, mobile, nationality, address, 
        status, priority, regdate, regtime, created, created_by,
        assignTo, branch, region, Counsilor, case_officer
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, {
      replacements: [
        data.fname || '',
        data.mname || '',
        data.lname || '',
        data.email || '',
        data.phone || '',
        data.mobile || data.phone || '',
        data.nationality || 'Unknown',
        data.address || '',
        data.status || 'Prospect',
        data.priority || 'P1',
        new Date().toISOString().split('T')[0], // regdate
        new Date().toTimeString().split(' ')[0], // regtime
        new Date().toISOString(), // created
        1, // created_by (default to 1)
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
      ORDER BY id DESC LIMIT 1
    `);

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
