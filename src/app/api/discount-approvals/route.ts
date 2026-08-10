import { NextRequest, NextResponse } from 'next/server';
import { sequelize } from '@/lib/sequelize';
import { QueryTypes } from 'sequelize';
import { verifyToken } from '@/lib/auth';
import { branchCurrencyError, resolveBranchCurrency } from '@/lib/branchCurrency';
import { notifyUser, notifyRole } from '@/lib/notify';
import { getDiscountTier, canApproveDiscountTier, discountTierLabel } from '@/lib/discountApproval';
import { getDiscountTierThresholds } from '@/lib/discountTierConfig';

function getAuthenticatedUser(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  const token = request.cookies.get('auth-token')?.value || authorization?.replace(/^Bearer\s+/i, '');
  return token ? verifyToken(token) : null;
}

export async function GET(request: NextRequest) {
  try {
    const requester = getAuthenticatedUser(request);
    if (!requester) {
      return NextResponse.json({ success: false, error: 'Authentication is required' }, { status: 401 });
    }
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

    // The client sends all three of originalAmount/discountAmount/discountedAmount
    // separately — without re-deriving them server-side, a caller can submit an
    // internally-inconsistent set (e.g. discountAmount > originalAmount) that,
    // once approved, gets written straight into dmc_forum_leads.payTotal as a
    // negative balance (see PUT below).
    const originalAmount = Number(body.originalAmount);
    const discountAmount = Number(body.discountAmount);
    if (!Number.isFinite(originalAmount) || originalAmount <= 0) {
      return NextResponse.json({ success: false, error: 'originalAmount must be greater than zero' }, { status: 422 });
    }
    if (!Number.isFinite(discountAmount) || discountAmount < 0 || discountAmount > originalAmount) {
      return NextResponse.json({ success: false, error: 'discountAmount must be between zero and originalAmount' }, { status: 422 });
    }
    const discountedAmount = originalAmount - discountAmount;

    // Duplicate-submission guard: a resubmit of the same request would create
    // a second approval row (and, for an auto-approved 0-20% discount, apply
    // it a second time) - block an identical request for this lead within
    // the last minute.
    const [recentDuplicate] = await sequelize.query<{ id: number }>(
      `SELECT id FROM dm_discount_approvals
       WHERE leadId = ? AND (opportunityId <=> ?) AND requestedBy = ?
         AND discountAmount = ? AND originalAmount = ?
         AND createdAt >= (NOW() - INTERVAL 60 SECOND)
       LIMIT 1`,
      { replacements: [body.leadId, body.opportunityId || null, requester.id, discountAmount, originalAmount], type: QueryTypes.SELECT }
    );
    if (recentDuplicate) {
      return NextResponse.json(
        { success: false, error: 'This discount request was already submitted a moment ago.' },
        { status: 409 }
      );
    }

    // Tiered policy: 0-20% needs no approval at all (a counsellor can apply it
    // directly), 20-30% needs Branch Manager or CEO sign-off, 30-100% is CEO
    // only. The tier is always re-derived from discountAmount/originalAmount
    // (both stored below) rather than trusted from the client, so it can't be
    // spoofed and stays correct even if the tier boundaries change later.
    const thresholds = await getDiscountTierThresholds();
    const tier = getDiscountTier(discountAmount, originalAmount, thresholds);
    const isAutoApproved = tier === 'auto';
    const now = new Date();

    await sequelize.query(`
      INSERT INTO dm_discount_approvals (
        leadId, opportunityId, discountType, discountAmount, originalAmount,
        discountedAmount, currency, reason, requestedBy, status,
        requestedDate, approvedBy, approvedAt, createdBy, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, {
      replacements: [
        body.leadId,
        body.opportunityId || null,
        body.discountType,
        discountAmount,
        originalAmount,
        discountedAmount,
        branchCurrency.currencyCode,
        body.reason,
        requester.id,
        isAutoApproved ? 'approved' : 'pending',
        now,
        isAutoApproved ? requester.id : null,
        isAutoApproved ? now : null,
        requester.id,
        now,
        now
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

    // A 0-20% discount is applied immediately — the lead/opportunity value
    // must reflect it right away rather than waiting on an approval that
    // will never come (same effects the PUT handler applies on manual approval).
    if (isAutoApproved) {
      await sequelize.query(
        `UPDATE dmc_forum_leads
         SET discount = ?, payTotal = ?, payBalance = GREATEST(? - COALESCE(paidYet, 0), 0)
         WHERE id = ?`,
        { replacements: [discountAmount, discountedAmount, discountedAmount, body.leadId] }
      );
      if (body.opportunityId) {
        await sequelize.query(
          `UPDATE dmc_opportunities
           SET estimatedValue = ?, actualValue = COALESCE(actualValue, ?), updatedAt = ?
           WHERE id = ?`,
          { replacements: [discountedAmount, discountedAmount, now, body.opportunityId] }
        );
      }
    }

    // CEO/Director approve every discount regardless of branch, so notify
    // globally; Branch Manager only oversees their own branch's requests.
    const [leadRow] = await sequelize.query<{ fname: string; lname: string }>(
      `SELECT fname, lname FROM dmc_forum_leads WHERE id = ? LIMIT 1`,
      { replacements: [body.leadId], type: QueryTypes.SELECT }
    );
    const clientName = leadRow ? `${leadRow.fname || ''} ${leadRow.lname || ''}`.trim() : `Lead #${body.leadId}`;
    const discountNotification = {
      type: 'discount_requested',
      title: isAutoApproved ? `Discount auto-approved (0-${thresholds.autoMaxPercent}%)` : 'Discount approval requested',
      message: isAutoApproved
        ? `${clientName || `Lead #${body.leadId}`} received a ${discountAmount} ${branchCurrency.currencyCode} discount (${discountTierLabel(tier, thresholds)}) — no approval was required.`
        : `A ${discountAmount} ${branchCurrency.currencyCode} discount was requested for ${clientName || `Lead #${body.leadId}`} and needs ${discountTierLabel(tier, thresholds)} approval.`,
      priority: 'medium',
      link: `/admin/leads/${body.leadId}/edit`,
      relatedId: body.leadId,
      relatedType: 'lead',
    };
    await Promise.all([
      notifyRole({ roleType: 'director', ...discountNotification }),
      notifyRole({ roleType: 'branch_manager', branchId: requester.branch, ...discountNotification }),
    ]);

    return NextResponse.json({
      success: true,
      message: isAutoApproved ? `Discount applied — no approval required (0-${thresholds.autoMaxPercent}%)` : 'Discount approval created successfully',
      data: { id: Number(createdRows[0]?.id || 0), status: isAutoApproved ? 'approved' : 'pending', tier }
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
      const rows = await sequelize.query<{ discountAmount: number; originalAmount: number }>(
        `SELECT discountAmount, originalAmount FROM dm_discount_approvals WHERE id = ?`,
        { replacements: [id], type: QueryTypes.SELECT }
      );
      const row = rows[0];
      const thresholds = await getDiscountTierThresholds();
      const tier = getDiscountTier(Number(row?.discountAmount || 0), Number(row?.originalAmount || 0), thresholds);
      const reviewer = getAuthenticatedUser(request);
      if (!reviewer || !canApproveDiscountTier(tier, reviewer as any)) {
        return NextResponse.json(
          { success: false, error: `This is a ${discountTierLabel(tier, thresholds)} discount request — you're not authorized to approve or reject it.` },
          { status: 403 }
        );
      }
      updateData.approvedBy = reviewer.id;
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

    if (['approved', 'rejected'].includes(body.status)) {
      const [approvalRows] = await sequelize.query(
        `SELECT leadId, opportunityId, discountedAmount, discountAmount, requestedBy FROM dm_discount_approvals WHERE id = ?`,
        { replacements: [id] }
      );
      const approval = (approvalRows as any[])[0];

      if (approval?.leadId) {
        const [leadRow] = await sequelize.query<{ fname: string; lname: string }>(
          `SELECT fname, lname FROM dmc_forum_leads WHERE id = ? LIMIT 1`,
          { replacements: [approval.leadId], type: QueryTypes.SELECT }
        );
        const clientName = leadRow ? `${leadRow.fname || ''} ${leadRow.lname || ''}`.trim() : `Lead #${approval.leadId}`;
        await notifyUser({
          userId: approval.requestedBy,
          type: 'discount_reviewed',
          title: body.status === 'approved' ? 'Discount approved' : 'Discount rejected',
          message: body.status === 'approved'
            ? `Your discount request for ${clientName} was approved.`
            : `Your discount request for ${clientName} was rejected.`,
          priority: body.status === 'approved' ? 'medium' : 'high',
        });
      }

      if (body.status === 'approved') {
        if (approval?.leadId) {
          // payTotal must itself shrink by the discount — otherwise it's left
          // stale at the pre-discount amount while payBalance silently accounts
          // for a discount that payTotal never reflects.
          await sequelize.query(
            `UPDATE dmc_forum_leads
             SET discount = ?, payTotal = ?, payBalance = GREATEST(? - COALESCE(paidYet, 0), 0)
             WHERE id = ?`,
            { replacements: [approval.discountAmount, approval.discountedAmount, approval.discountedAmount, approval.leadId] }
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
