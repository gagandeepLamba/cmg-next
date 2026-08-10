import { NextRequest, NextResponse } from 'next/server';
import { sequelize } from '@/lib/sequelize';
import { verifyToken } from '@/lib/auth';
import { isCeo } from '@/lib/roleChecks';
import { requireAuth, isAuthError } from '@/lib/apiAuth';

async function createClientIfMissing(leadId: number, userId: number | null) {
  const [leadRows] = await sequelize.query(
    `SELECT id, fname, lname, email, dob, address, case_officer, assignTo, area, nationality
     FROM dmc_forum_leads
     WHERE id = ?
     LIMIT 1`,
    { replacements: [leadId] },
  );
  const lead = (leadRows as any[])[0];
  if (!lead) return null;

  const [existingRows] = await sequelize.query(
    'SELECT id FROM dm_clients WHERE leadId = ? LIMIT 1',
    { replacements: [leadId] },
  );
  const existing = (existingRows as any[])[0];
  if (existing?.id) {
    await sequelize.query(
      `UPDATE dm_clients
       SET status = 1, accept = 1, is_deleted = 0, case_manager = COALESCE(NULLIF(case_manager, 0), ?), backend_person = COALESCE(NULLIF(backend_person, 0), ?)
       WHERE id = ?`,
      {
        replacements: [
          lead.case_officer || lead.assignTo || userId || 0,
          lead.assignTo || userId || 0,
          existing.id,
        ],
      },
    );
    return existing.id;
  }

  const [idRows] = await sequelize.query('SELECT COALESCE(MAX(id), 0) + 1 AS id FROM dm_clients');
  const clientId = Number((idRows as any[])[0]?.id || 0);
  await sequelize.query(
    `INSERT INTO dm_clients
      (id, leadId, first_name, last_name, email, image, dob, address, full_address, token, token_validity, verify, password, hash_password, status, accept, created, case_manager, backend_person, is_deleted, city, nationality)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, 1, 1, NOW(), ?, ?, 0, ?, ?)`,
    {
      replacements: [
        clientId,
        leadId,
        lead.fname || '',
        lead.lname || '',
        lead.email || '',
        '',
        lead.dob || new Date('1970-01-01'),
        lead.address || '',
        lead.address || '',
        `CMG-${leadId}-${Date.now()}`,
        new Date(Date.now() + 90 * 86400000),
        '',
        '',
        lead.case_officer || lead.assignTo || userId || 0,
        lead.assignTo || userId || 0,
        lead.area || '',
        lead.nationality || '',
      ],
    },
  );
  return clientId;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(request, ['leads.view']);
    if (isAuthError(auth)) return auth;

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
    const auth = requireAuth(request, ['leads.view', 'leads.update']);
    if (isAuthError(auth)) return auth;

    const { id: opportunityId } = await params;
    const body = await request.json();

    if (!opportunityId) {
      return NextResponse.json(
        { success: false, error: 'Opportunity ID is required' },
        { status: 400 }
      );
    }

    const actualValue = body.actualValue === undefined ? undefined : Number(body.actualValue);
    const probability = body.probability === undefined ? undefined : Number(body.probability);
    if (actualValue !== undefined && (!Number.isFinite(actualValue) || actualValue < 0)) {
      return NextResponse.json({ success: false, error: 'Actual value must be a non-negative number' }, { status: 422 });
    }
    if (probability !== undefined && (!Number.isFinite(probability) || probability < 0 || probability > 100)) {
      return NextResponse.json({ success: false, error: 'Probability must be between 0 and 100' }, { status: 422 });
    }
    if (body.actualCloseDate && Number.isNaN(new Date(body.actualCloseDate).getTime())) {
      return NextResponse.json({ success: false, error: 'Actual close date is invalid' }, { status: 422 });
    }
    if (body.retentionDate && Number.isNaN(new Date(body.retentionDate).getTime())) {
      return NextResponse.json({ success: false, error: 'Retention date is invalid' }, { status: 422 });
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

    // Build update data
    const updateData: any = {
      updatedAt: new Date()
    };

    // Update only provided fields
    if (body.status !== undefined) updateData.status = body.status;
    if (body.actualCloseDate !== undefined) updateData.actualCloseDate = body.actualCloseDate ? new Date(body.actualCloseDate) : null;
    if (actualValue !== undefined) updateData.actualValue = actualValue;
    if (body.retentionStatus !== undefined) updateData.retentionStatus = body.retentionStatus;
    if (body.retentionDate !== undefined) updateData.retentionDate = body.retentionDate ? new Date(body.retentionDate) : null;
    if (body.agreementGenerated !== undefined) updateData.agreementGenerated = body.agreementGenerated;
    if (body.agreementId !== undefined) updateData.agreementId = body.agreementId || null;
    if (body.agreementSent !== undefined) updateData.agreementSent = body.agreementSent;
    if (body.agreementSigned !== undefined) updateData.agreementSigned = body.agreementSigned;
    if (body.paymentReceived !== undefined) updateData.paymentReceived = body.paymentReceived;
    if (body.documentsVerified !== undefined) updateData.documentsVerified = body.documentsVerified;
    if (body.stage !== undefined) updateData.stage = body.stage;
    if (probability !== undefined) updateData.probability = probability;
    if (body.assignedTo !== undefined) updateData.assignedTo = body.assignedTo || null;
    if (body.notes !== undefined) updateData.notes = body.notes;

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
        SET status = ?, convet = ?, opportunity_status = ?, conversion_date = ?, 
            conversion_reason = ?, last_updated = ?, last_updtd_time = ?
        WHERE id = (SELECT leadId FROM dmc_opportunities WHERE id = ?)
      `, {
        replacements: [
          leadStatus,
          body.status === 'won' ? 'Client' : 'Opportunity',
          body.status,
          new Date().toISOString().split('T')[0],
          body.status === 'won' ? 'Successfully converted and retained client' : 'Opportunity lost',
          new Date().toISOString().split('T')[0],
          new Date().toTimeString().split(' ')[0],
          opportunityId
        ]
      });

      if (body.status === 'won') {
        const existingOpportunity = (existingResult as any[])[0];
        await createClientIfMissing(Number(existingOpportunity.leadId), Number(auth.id || 0) || null);
      }
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
    const token = request.cookies.get('auth-token')?.value
      || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const currentUser = token ? verifyToken(token) : null;
    if (!currentUser || !isCeo(currentUser)) {
      return NextResponse.json({ error: 'Only the CEO can delete records' }, { status: 403 });
    }

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
