import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';
import { verifyToken } from '@/lib/auth';
import { isBranchManagerOrCeo, isCeo, isFoe } from '@/lib/roleChecks';

/**
 * Opportunities with an outstanding balance, scoped by role:
 * - CEO / director / founder / super admin / director of sales: every opportunity.
 * - Branch Manager / FOE: only opportunities in their own branch.
 * - Everyone else (counsellor): only opportunities they own — either the
 *   underlying lead is assigned to them, or the opportunity itself is
 *   assigned to/created by them (mirrors the scoping already used for a
 *   counsellor's "my leads" view in /api/leads).
 */
export async function GET(request: NextRequest) {
  try {
    const token =
      request.cookies.get('auth-token')?.value ||
      request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const currentUser = token ? verifyToken(token) : null;
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication is required' }, { status: 401 });
    }

    const role = String(currentUser.type || '').toLowerCase().replace(/[\s-]+/g, '_');
    const canViewAll =
      currentUser.role === 1 ||
      isCeo(currentUser) ||
      ['admin', 'administrator', 'super_admin', 'director_of_sales', 'director', 'dos', 'founder'].includes(role);
    const isBranchScoped = !canViewAll && (isBranchManagerOrCeo(currentUser) || isFoe(currentUser));

    const conditions: string[] = ['l.payBalance > 0'];
    const replacements: Record<string, unknown> = {};

    if (isBranchScoped) {
      conditions.push('COALESCE(o.branchId, l.branch) = :userBranch');
      replacements.userBranch = currentUser.branch;
    } else if (!canViewAll) {
      conditions.push('(l.Counsilor = :userId OR l.assignTo = :userId OR o.assignedTo = :userId OR o.createdBy = :userId)');
      replacements.userId = currentUser.id;
    }

    const rows = await sequelize.query<any>(
      `SELECT
         o.id AS opportunityId,
         o.opportunityName,
         o.status AS opportunityStatus,
         o.stage,
         l.id AS leadId,
         l.fname, l.lname, l.email, l.phone,
         l.payTotal, l.paidYet, l.payBalance, l.dueDate, l.demdRemark,
         COALESCE(o.branchId, l.branch) AS branchId,
         b.branch AS branchName,
         e.name AS assignedEmployeeName,
         COALESCE(s.name, l.service_interest) AS serviceName,
         a.agreementNumber
       FROM dmc_opportunities o
       JOIN dmc_forum_leads l ON l.id = o.leadId
       LEFT JOIN dm_branch b ON b.id = COALESCE(o.branchId, l.branch)
       LEFT JOIN dm_employee e ON e.id = o.assignedTo
       LEFT JOIN dm_service s ON s.id = CAST(l.service_interest AS UNSIGNED)
       LEFT JOIN (
         SELECT da1.opportunityId, da1.agreementNumber
         FROM dm_opportunity_agreements da1
         INNER JOIN (
           SELECT opportunityId, MAX(id) AS maxId FROM dm_opportunity_agreements GROUP BY opportunityId
         ) da2 ON da2.opportunityId = da1.opportunityId AND da2.maxId = da1.id
       ) a ON a.opportunityId = o.id
       WHERE ${conditions.join(' AND ')}
       ORDER BY l.payBalance DESC`,
      { replacements, type: QueryTypes.SELECT }
    );

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching balance payments:', error);
    return NextResponse.json({ error: 'Failed to fetch balance payments' }, { status: 500 });
  }
}
