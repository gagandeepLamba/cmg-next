import { NextRequest, NextResponse } from 'next/server';
import { sequelize } from '@/lib/sequelize';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');
    const status = searchParams.get('status');
    const reassignmentType = searchParams.get('reassignmentType');

    // Build WHERE clause
    let whereClause = '';
    const replacements: any[] = [];
    
    if (leadId) {
      whereClause += ' WHERE r.leadId = ?';
      replacements.push(leadId);
    }
    
    if (status && status !== 'pending') {
      whereClause += whereClause ? ' AND 1 = 0' : ' WHERE 1 = 0';
    }
    
    if (reassignmentType) {
      whereClause += whereClause ? ' AND r.reassignmentType = ?' : ' WHERE r.reassignmentType = ?';
      replacements.push(reassignmentType);
    }

    // Get reassignments with related data
    const [reassignments] = await sequelize.query(`
      SELECT 
        r.*,
        'pending' as status,
        NULL as approvedBy,
        NULL as approvedAt,
        NULL as notes,
        l.fname as lead_fname,
        l.lname as lead_lname,
        l.email as lead_email,
        l.mobile as lead_mobile,
        fe.name as from_employee_name,
        te.name as to_employee_name,
        NULL as approved_employee_name,
        ce.name as created_employee_name
      FROM dm_lead_reassignments r
      LEFT JOIN dmc_forum_leads l ON r.leadId = l.id
      LEFT JOIN dm_employee fe ON r.fromEmployeeId = fe.id
      LEFT JOIN dm_employee te ON r.toEmployeeId = te.id
      LEFT JOIN dm_employee ce ON r.createdBy = ce.id
      ${whereClause}
      ORDER BY r.createdAt DESC
    `, {
      replacements
    });

    return NextResponse.json({
      success: true,
      data: reassignments,
      count: (reassignments as any[]).length
    });
  } catch (error: any) {
    console.error('Error fetching lead reassignments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lead reassignments: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['leadId', 'fromEmployeeId', 'toEmployeeId', 'reassignmentType', 'reason', 'previousStatus', 'newStatus', 'createdBy'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if lead exists
    const [leadCheck] = await sequelize.query(`
      SELECT id, fname, lname, assignTo FROM dmc_forum_leads WHERE id = ?
    `, {
      replacements: [body.leadId]
    });

    if (!leadCheck || (leadCheck as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Check if employees exist
    const [employeeCheck] = await sequelize.query(`
      SELECT id, name FROM dm_employee WHERE id IN (?, ?)
    `, {
      replacements: [body.fromEmployeeId, body.toEmployeeId]
    });

    if (!employeeCheck || (employeeCheck as any[]).length < 2) {
      return NextResponse.json(
        { success: false, error: 'One or both employees not found' },
        { status: 404 }
      );
    }

    // Create reassignment record
    const [result] = await sequelize.query(`
      INSERT INTO dm_lead_reassignments (
        leadId, fromEmployeeId, toEmployeeId, reassignmentType, reason,
        previousStatus, newStatus, reassignmentDate, createdBy, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, {
      replacements: [
        body.leadId,
        body.fromEmployeeId,
        body.toEmployeeId,
        body.reassignmentType,
        body.reason,
        body.previousStatus,
        body.newStatus,
        new Date(),
        body.createdBy
      ]
    });

    const reassignmentId = (result as any).insertId;

    // Update lead assignment if reassignment is approved or auto-approved
    if (body.autoApprove) {
      await sequelize.query(`
        UPDATE dmc_forum_leads 
        SET assignTo = ?, last_updated = ?, last_updtd_time = ?, status = ?
        WHERE id = ?
      `, {
        replacements: [
          body.toEmployeeId,
          new Date().toISOString().split('T')[0],
          new Date().toTimeString().split(' ')[0],
          body.newStatus,
          body.leadId
        ]
      });

      await sequelize.query(
        `UPDATE dm_lead_reassignments SET updatedAt = NOW() WHERE id = ?`,
        { replacements: [reassignmentId] }
      );
    }

    // Get the created reassignment with details
    const [newReassignment] = await sequelize.query(`
      SELECT 
        r.*,
        l.fname as lead_fname,
        l.lname as lead_lname,
        l.email as lead_email,
        fe.name as from_employee_name,
        te.name as to_employee_name
      FROM dm_lead_reassignments r
      LEFT JOIN dmc_forum_leads l ON r.leadId = l.id
      LEFT JOIN dm_employee fe ON r.fromEmployeeId = fe.id
      LEFT JOIN dm_employee te ON r.toEmployeeId = te.id
      WHERE r.id = ?
    `, {
      replacements: [reassignmentId]
    });

    return NextResponse.json({
      success: true,
      message: 'Lead reassignment created successfully',
      data: (newReassignment as any[])[0]
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating lead reassignment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create lead reassignment: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Reassignment ID is required' },
        { status: 400 }
      );
    }

    // Check if reassignment exists
    const [existingReassignment] = await sequelize.query(`
      SELECT * FROM dm_lead_reassignments WHERE id = ?
    `, {
      replacements: [id]
    });

    if (!existingReassignment || (existingReassignment as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Lead reassignment not found' },
        { status: 404 }
      );
    }

    await sequelize.query(`
      UPDATE dm_lead_reassignments
      SET updatedAt = NOW()
      WHERE id = ?
    `, {
      replacements: [id]
    });

    // If approved, update lead assignment
    if (body.status === 'approved') {
      const [reassignmentData] = await sequelize.query(`
        SELECT leadId, toEmployeeId, newStatus FROM dm_lead_reassignments WHERE id = ?
      `, {
        replacements: [id]
      });

      if (reassignmentData && (reassignmentData as any[]).length > 0) {
        const reassign = (reassignmentData as any)[0];
        
        await sequelize.query(`
          UPDATE dmc_forum_leads 
          SET assignTo = ?, last_updated = ?, last_updtd_time = ?, status = ?
          WHERE id = ?
        `, {
          replacements: [
            reassign.toEmployeeId,
            new Date().toISOString().split('T')[0],
            new Date().toTimeString().split(' ')[0],
            reassign.newStatus,
            reassign.leadId
          ]
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Lead reassignment updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating lead reassignment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update lead reassignment: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Reassignment ID is required' },
        { status: 400 }
      );
    }

    // Check if reassignment exists
    const [existingReassignment] = await sequelize.query(`
      SELECT * FROM dm_lead_reassignments WHERE id = ?
    `, {
      replacements: [id]
    });

    if (!existingReassignment || (existingReassignment as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Lead reassignment not found' },
        { status: 404 }
      );
    }

    // Delete reassignment
    await sequelize.query(`
      DELETE FROM dm_lead_reassignments WHERE id = ?
    `, {
      replacements: [id]
    });

    return NextResponse.json({
      success: true,
      message: 'Lead reassignment deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting lead reassignment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete lead reassignment: ' + error.message },
      { status: 500 }
    );
  }
}
