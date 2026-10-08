import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';
import { getRecordVisibilityScope } from '@/lib/roleChecks';

type LeadAccessUser = {
  id?: number | string | null;
  branch?: number | string | null;
  region?: number | string | null;
  type?: string | null;
  roleName?: string | null;
  role?: string | number | null;
};

// SQL fragment (named replacements) that limits a query over dmc_forum_leads
// (aliased `alias`) to the leads `user` may see, using the same tiers as
// checkLeadAccess below. Returns '1=1' for company-wide roles.
export function buildLeadScopeSql(user: LeadAccessUser, alias = 'l'): { sql: string; replacements: Record<string, number> } {
  const scope = getRecordVisibilityScope(user);
  if (scope === 'all') return { sql: '1=1', replacements: {} };
  if (scope === 'branch') return { sql: `${alias}.branch = :scopeBranch`, replacements: { scopeBranch: Number(user.branch) || 0 } };
  if (scope === 'region') return { sql: `${alias}.region = :scopeRegion`, replacements: { scopeRegion: Number(user.region) || 0 } };
  return {
    sql: `(${alias}.Counsilor = :scopeUser OR ${alias}.assignTo = :scopeUser OR EXISTS (
      SELECT 1 FROM dmc_opportunities so WHERE so.leadId = ${alias}.id AND (so.assignedTo = :scopeUser OR so.createdBy = :scopeUser)
    ))`,
    replacements: { scopeUser: Number(user.id) || 0 },
  };
}

// Record-level counterpart to the list filtering in src/app/api/leads/route.ts:
// CEO/admin see everything, BM/FOE their branch, RM their region, and everyone
// else (counselors) only leads they own - via Counsilor/assignTo or an
// opportunity on the lead assigned to / created by them.
// Returns 'not_found' when the lead doesn't exist so callers can 404 instead of 403.
export async function checkLeadAccess(user: LeadAccessUser, leadId: number): Promise<'allowed' | 'denied' | 'not_found'> {
  const scope = getRecordVisibilityScope(user);
  if (scope === 'all') return 'allowed';

  const [leadRow] = await sequelize.query<{ branch: number | null; region: number | null; assignTo: number | null; Counsilor: number | null; ownsOpportunity: number }>(`
    SELECT l.branch, l.region, l.assignTo, l.Counsilor,
      EXISTS (
        SELECT 1 FROM dmc_opportunities o
        WHERE o.leadId = l.id AND (o.assignedTo = :userId OR o.createdBy = :userId)
      ) AS ownsOpportunity
    FROM dmc_forum_leads l
    WHERE l.id = :leadId
    LIMIT 1
  `, {
    replacements: { leadId, userId: Number(user.id) || 0 },
    type: QueryTypes.SELECT,
  });

  if (!leadRow) return 'not_found';

  const allowed = scope === 'branch'
    ? Number(leadRow.branch) === Number(user.branch)
    : scope === 'region'
      ? Number(leadRow.region) === Number(user.region)
      : Number(leadRow.Counsilor) === Number(user.id)
        || Number(leadRow.assignTo) === Number(user.id)
        || Number(leadRow.ownsOpportunity) === 1;

  return allowed ? 'allowed' : 'denied';
}
