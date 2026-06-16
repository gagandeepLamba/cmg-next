import { NextRequest, NextResponse } from 'next/server';
import { sequelize } from '@/lib/sequelize';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: opportunityId } = await params;

    if (!opportunityId) {
      return NextResponse.json(
        { success: false, error: 'Opportunity ID is required' },
        { status: 400 }
      );
    }

    // Get opportunity details
    const [opportunityResult] = await sequelize.query(`
      SELECT o.*, 
             l.fname, l.lname, l.email, l.mobile, l.phone, l.address, l.nationality,
             l.dob, l.id_number, l.id_expiry, l.service_interest, l.payTotal,
             fe.name as assignedEmployeeName, fe.email as assignedEmployeeEmail,
             be.name as branchName, be.address as branchAddress
      FROM dmc_opportunities o
      LEFT JOIN dmc_forum_leads l ON o.leadId = l.id
      LEFT JOIN dm_employee fe ON o.assignedTo = fe.id
      LEFT JOIN dm_branch be ON o.branchId = be.id
      WHERE o.id = ?
    `, {
      replacements: [opportunityId]
    });

    if (!opportunityResult || (opportunityResult as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    const opportunity = (opportunityResult as any[])[0];

    // Get opportunity payments
    const [paymentsResult] = await sequelize.query(`
      SELECT * FROM dm_opportunity_payments 
      WHERE opportunityId = ? 
      ORDER BY createdAt DESC
    `, {
      replacements: [opportunityId]
    });

    // Get opportunity agreements
    const [agreementsResult] = await sequelize.query(`
      SELECT * FROM dm_opportunity_agreements 
      WHERE opportunityId = ? 
      ORDER BY createdAt DESC
    `, {
      replacements: [opportunityId]
    });

    return NextResponse.json({
      success: true,
      data: {
        opportunity,
        payments: paymentsResult,
        agreements: agreementsResult
      }
    });

  } catch (error: any) {
    console.error('Error fetching opportunity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch opportunity: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: opportunityId } = await params;
    const body = await request.json();

    if (!opportunityId) {
      return NextResponse.json(
        { success: false, error: 'Opportunity ID is required' },
        { status: 400 }
      );
    }

    // Check if opportunity exists
    const [existingResult] = await sequelize.query(`
      SELECT id FROM dmc_opportunities WHERE id = ?
    `, {
      replacements: [opportunityId]
    });

    if (!existingResult || (existingResult as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {
      updatedAt: new Date()
    };

    // Update only provided fields
    if (body.status) updateData.status = body.status;
    if (body.actualCloseDate) updateData.actualCloseDate = new Date(body.actualCloseDate);
    if (body.actualValue) updateData.actualValue = body.actualValue;
    if (body.retentionStatus) updateData.retentionStatus = body.retentionStatus;
    if (body.retentionDate) updateData.retentionDate = new Date(body.retentionDate);
    if (body.agreementGenerated !== undefined) updateData.agreementGenerated = body.agreementGenerated;
    if (body.agreementId) updateData.agreementId = body.agreementId;
    if (body.agreementSent !== undefined) updateData.agreementSent = body.agreementSent;
    if (body.agreementSigned !== undefined) updateData.agreementSigned = body.agreementSigned;
    if (body.paymentReceived !== undefined) updateData.paymentReceived = body.paymentReceived;
    if (body.documentsVerified !== undefined) updateData.documentsVerified = body.documentsVerified;
    if (body.stage) updateData.stage = body.stage;
    if (body.probability) updateData.probability = body.probability;
    if (body.assignedTo) updateData.assignedTo = body.assignedTo;
    if (body.notes) updateData.notes = body.notes;

    // Update opportunity
    await sequelize.query(`
      UPDATE dmc_opportunities 
      SET ${Object.keys(updateData).map(key => `${key} = ?`).join(', ')}
      WHERE id = ?
    `, {
      replacements: [...Object.values(updateData), opportunityId]
    });

    // If status is 'won' or 'lost', update the associated lead
    if (body.status === 'won' || body.status === 'lost') {
      const leadStatus = body.status === 'won' ? 'retained' : 'lost';
      
      await sequelize.query(`
        UPDATE dmc_forum_leads 
        SET status = ?, opportunity_status = ?, conversion_date = ?, 
            conversion_reason = ?, last_updated = ?, last_updtd_time = ?
        WHERE id = (SELECT leadId FROM dmc_opportunities WHERE id = ?)
      `, {
        replacements: [
          leadStatus,
          body.status,
          new Date().toISOString().split('T')[0],
          body.status === 'won' ? 'Successfully converted and retained client' : 'Opportunity lost',
          new Date().toISOString().split('T')[0],
          new Date().toTimeString().split(' ')[0],
          opportunityId
        ]
      });
    }

    // Get updated opportunity
    const [updatedResult] = await sequelize.query(`
      SELECT o.*, l.fname, l.lname, l.email, l.mobile, l.phone
      FROM dmc_opportunities o
      LEFT JOIN dmc_forum_leads l ON o.leadId = l.id
      WHERE o.id = ?
    `, {
      replacements: [opportunityId]
    });

    const updatedOpportunity = (updatedResult as any[])[0];

    return NextResponse.json({
      success: true,
      message: 'Opportunity updated successfully',
      data: updatedOpportunity
    });

  } catch (error: any) {
    console.error('Error updating opportunity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update opportunity: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: opportunityId } = await params;

    if (!opportunityId) {
      return NextResponse.json(
        { success: false, error: 'Opportunity ID is required' },
        { status: 400 }
      );
    }

    // Check if opportunity exists
    const [existingResult] = await sequelize.query(`
      SELECT id, leadId FROM dmc_opportunities WHERE id = ?
    `, {
      replacements: [opportunityId]
    });

    if (!existingResult || (existingResult as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    const opportunity = (existingResult as any[])[0];

    // Delete related records first (payments, agreements)
    await sequelize.query(`DELETE FROM dm_opportunity_payments WHERE opportunityId = ?`, {
      replacements: [opportunityId]
    });

    await sequelize.query(`DELETE FROM dm_opportunity_agreements WHERE opportunityId = ?`, {
      replacements: [opportunityId]
    });

    // Delete the opportunity
    await sequelize.query(`DELETE FROM dmc_opportunities WHERE id = ?`, {
      replacements: [opportunityId]
    });

    // Update lead status back to original
    await sequelize.query(`
      UPDATE dmc_forum_leads 
      SET status = 'new', opportunity_status = NULL, convet = NULL,
          last_updated = ?, last_updtd_time = ?
      WHERE id = ?
    `, {
      replacements: [
        new Date().toISOString().split('T')[0],
        new Date().toTimeString().split(' ')[0],
        opportunity.leadId
      ]
    });

    return NextResponse.json({
      success: true,
      message: 'Opportunity deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting opportunity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete opportunity: ' + error.message },
      { status: 500 }
    );
  }
}
