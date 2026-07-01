import { NextRequest, NextResponse } from 'next/server';
import { sequelize } from '@/lib/sequelize';

const ensureTable = async () => {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS dm_opportunity_compliance_approvals (
      id INT AUTO_INCREMENT PRIMARY KEY,
      leadId INT NOT NULL,
      opportunityId INT NULL,
      signedAgreementUrl TEXT NOT NULL,
      clientSignature VARCHAR(255) NULL,
      signatureDate DATE NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'pending',
      submittedBy INT NULL,
      reviewedBy VARCHAR(255) NULL,
      reviewerRole VARCHAR(80) NULL,
      reviewNotes TEXT NULL,
      submittedAt DATETIME NOT NULL,
      reviewedAt DATETIME NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      INDEX idx_compliance_lead (leadId),
      INDEX idx_compliance_status (status)
    )
  `);
};

export async function GET(request: NextRequest) {
  try {
    await ensureTable();

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');
    const status = searchParams.get('status');
    const whereConditions: string[] = [];
    const replacements: any[] = [];

    if (leadId) {
      whereConditions.push('leadId = ?');
      replacements.push(leadId);
    }

    if (status) {
      whereConditions.push('status = ?');
      replacements.push(status);
    }

    const whereClause = whereConditions.length ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const [rows] = await sequelize.query(`
      SELECT *
      FROM dm_opportunity_compliance_approvals
      ${whereClause}
      ORDER BY createdAt DESC
    `, { replacements });

    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error('Error fetching compliance approvals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch compliance approvals: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTable();

    const body = await request.json();
    if (!body.leadId || !body.signedAgreementUrl) {
      return NextResponse.json(
        { success: false, error: 'Lead ID and signed agreement upload are required' },
        { status: 400 }
      );
    }

    const now = new Date();
    const [result] = await sequelize.query(`
      INSERT INTO dm_opportunity_compliance_approvals (
        leadId, opportunityId, signedAgreementUrl, clientSignature, signatureDate,
        status, submittedBy, submittedAt, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, {
      replacements: [
        body.leadId,
        body.opportunityId || null,
        body.signedAgreementUrl,
        body.clientSignature || null,
        body.signatureDate || null,
        body.status || 'pending',
        body.submittedBy || null,
        now,
        now,
        now
      ]
    });

    return NextResponse.json({
      success: true,
      message: 'Signed agreement submitted for compliance approval',
      data: { id: (result as any).insertId }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating compliance approval:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create compliance approval: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureTable();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Compliance approval ID is required' },
        { status: 400 }
      );
    }

    if (['approved', 'rejected'].includes(body.status) && body.reviewerRole !== 'compliance_officer') {
      return NextResponse.json(
        { success: false, error: 'Only a compliance officer can approve or reject the signed agreement' },
        { status: 403 }
      );
    }

    const now = new Date();
    await sequelize.query(`
      UPDATE dm_opportunity_compliance_approvals
      SET status = ?, reviewedBy = ?, reviewerRole = ?, reviewNotes = ?, reviewedAt = ?, updatedAt = ?
      WHERE id = ?
    `, {
      replacements: [
        body.status,
        body.reviewedBy || null,
        body.reviewerRole || null,
        body.reviewNotes || null,
        body.reviewedAt ? new Date(body.reviewedAt) : now,
        now,
        id
      ]
    });

    return NextResponse.json({
      success: true,
      message: 'Compliance approval updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating compliance approval:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update compliance approval: ' + error.message },
      { status: 500 }
    );
  }
}
