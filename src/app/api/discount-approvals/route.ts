import { NextRequest, NextResponse } from 'next/server';
import { sequelize } from '@/lib/sequelize';
import { QueryTypes } from 'sequelize';
import { verifyToken } from '@/lib/auth';
import { branchCurrencyError, resolveBranchCurrency } from '@/lib/branchCurrency';

function getAuthenticatedUser(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  const token = request.cookies.get('auth-token')?.value || authorization?.replace(/^Bearer\s+/i, '');
  return token ? verifyToken(token) : null;
}

function getDirectorOfSales(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  const role = String(user?.type || '').toLowerCase().replace(/[_-]/g, ' ').trim();

  // "director" is kept for the existing legacy Director role, which represents
  // Director of Sales in installations that have not renamed the role yet.
  return user && ['director of sales', 'director', 'dos', 'ds', 'super admin', 'super_admin', 'administrator', 'admin'].includes(role) ? user : null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');
    const status = searchParams.get('status');
    const discountType = searchParams.get('discountType');

    // Build WHERE conditions
    let whereConditions = [];
    let replacements = [];

    if (leadId) {
      whereConditions.push('da.leadId = ?');
      replacements.push(leadId);
    }
    
    if (status) {
      whereConditions.push('da.status = ?');
      replacements.push(status);
    }
    
    if (discountType) {
      whereConditions.push('da.discountType = ?');
      replacements.push(discountType);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const [discountApprovals] = await sequelize.query(`
      SELECT 
        da.*,
        l.fname, l.lname, l.email, l.mobile,
        o.opportunityName, o.estimatedValue, o.currency,
        e_req.name as requestedEmployeeName,
        e_app.name as approvedEmployeeName,
        e_req.name as createdEmployeeName
      FROM dm_discount_approvals da
      LEFT JOIN dmc_forum_leads l ON da.leadId = l.id
      LEFT JOIN dmc_opportunities o ON da.opportunityId = o.id
      LEFT JOIN dm_employee e_req ON da.requestedBy = e_req.id
      LEFT JOIN dm_employee e_app ON da.approvedBy = e_app.id
      ${whereClause}
      ORDER BY da.createdAt DESC
    `, {
      replacements
    });

    return NextResponse.json({
      success: true,
      data: discountApprovals
    });
  } catch (error: any) {
    console.error('Error fetching discount approvals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch discount approvals: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requester = getAuthenticatedUser(request);

    if (!requester) {
      return NextResponse.json(
        { success: false, error: 'You must be logged in to request a discount approval' },
        { status: 401 }
      );
    }
    const branchCurrency = await resolveBranchCurrency(requester.branch);
    if (!branchCurrency) {
      return NextResponse.json(
        { success: false, error: branchCurrencyError(requester.branch) },
        { status: 422 }
      );
    }
    
    await sequelize.query(`
      INSERT INTO dm_discount_approvals (
        leadId, opportunityId, discountType, discountAmount, originalAmount, 
        discountedAmount, currency, reason, requestedBy, status, 
        requestedDate, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, {
      replacements: [
        body.leadId,
        body.opportunityId || null,
        body.discountType,
        body.discountAmount,
        body.originalAmount,
        body.discountedAmount,
        branchCurrency.currencyCode,
        body.reason,
        requester.id,
        body.status || 'pending',
        new Date(),
        new Date(),
        new Date()
      ]
    });
    const createdRows = await sequelize.query<{ id: number }>(
      `SELECT id
       FROM dm_discount_approvals
       WHERE leadId = ? AND (opportunityId <=> ?) AND requestedBy = ? AND reason = ?
       ORDER BY id DESC
       LIMIT 1`,
      {
        replacements: [
          body.leadId,
          body.opportunityId || null,
          requester.id,
          body.reason,
        ],
        type: QueryTypes.SELECT,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Discount approval created successfully',
      data: { id: Number(createdRows[0]?.id || 0) }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating discount approval:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create discount approval: ' + error.message },
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
        { success: false, error: 'Discount approval ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      updatedAt: new Date()
    };

    if (['approved', 'rejected'].includes(body.status)) {
      const director = getDirectorOfSales(request);
      if (!director) {
        return NextResponse.json(
          { success: false, error: 'Only the Director of Sales can approve or reject discounts' },
          { status: 403 }
        );
      }
      updateData.approvedBy = director.id;
      if (body.status === 'approved') updateData.approvedAt = new Date();
      if (body.status === 'rejected') updateData.rejectedDate = new Date();
    }

    if (body.status) updateData.status = body.status;
    if (body.approvedAt && !updateData.approvedAt) updateData.approvedAt = new Date(body.approvedAt);
    if (body.rejectedDate && !updateData.rejectedDate) updateData.rejectedDate = new Date(body.rejectedDate);

    await sequelize.query(`
      UPDATE dm_discount_approvals 
      SET ${Object.keys(updateData).map(key => `${key} = ?`).join(', ')}
      WHERE id = ?
    `, {
      replacements: [...Object.values(updateData), id]
    });

    if (body.status === 'approved') {
      const [approvalRows] = await sequelize.query(
        `SELECT leadId, opportunityId, discountedAmount, discountAmount FROM dm_discount_approvals WHERE id = ?`,
        { replacements: [id] }
      );
      const approval = (approvalRows as any[])[0];
      if (approval?.leadId) {
        await sequelize.query(
          `UPDATE dmc_forum_leads
           SET discount = ?, payBalance = GREATEST(COALESCE(payTotal, 0) - ? - COALESCE(paidYet, 0), 0)
           WHERE id = ?`,
          { replacements: [approval.discountAmount, approval.discountAmount, approval.leadId] }
        );
      }
      if (approval?.opportunityId) {
        await sequelize.query(
          `UPDATE dmc_opportunities
           SET estimatedValue = ?, actualValue = COALESCE(actualValue, ?), updatedAt = ?
           WHERE id = ?`,
          {
            replacements: [
              approval.discountedAmount,
              approval.discountedAmount,
              new Date(),
              approval.opportunityId,
            ],
          }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Discount approval updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating discount approval:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update discount approval: ' + error.message },
      { status: 500 }
    );
  }
}
