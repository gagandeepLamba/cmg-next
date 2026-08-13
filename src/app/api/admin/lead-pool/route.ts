import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';
import { verifyToken } from '@/lib/auth';
import { isCeo, isCounsellor } from '@/lib/roleChecks';

function roleCat(cu: { type?: string | null; role?: number | null; roleName?: string | null }) {
  if (Number(cu.role) === 1) return 'admin';
  // CEO shares dm_role.type='director' with Director/Founder/Super Admin, so it's
  // already covered by the type check below — but roleName is checked explicitly
  // too in case that ever changes.
  if (isCeo(cu)) return 'admin';
  const t = String(cu.type || '').toLowerCase().replace(/[\s-]+/g, '_');
  if (['super_admin', 'admin', 'administrator', 'director', 'dos', 'director_of_sales', 'founder'].includes(t)) return 'admin';
  // FOE gets the same branch-scoped access as Branch Manager here — both are
  // meant to assign unassigned leads within their own branch.
  if (['branch_manager', 'bm', 'foe'].includes(t)) return 'branch_manager';
  return 'other';
}

type LeadFilters = {
  search?: string;
  status?: string;
  assigned?: string;
  dateFrom?: string;
  dateTo?: string;
  priority?: string;
  branch?: string;
  nationality?: string;
  serviceInterest?: string;
  marketSource?: string;
};

// Shared by GET (listing) and POST (the "select all matching leads" transfer)
// so the set of leads a bulk transfer acts on always matches what the user
// filtered down to on screen.
function buildLeadConditions(cat: string, userBranch: number, filters: LeadFilters) {
  const conds: string[] = ['1=1'];
  const rep: Record<string, unknown> = {};

  if (cat === 'branch_manager' && userBranch) {
    conds.push('l.branch = :userBranch');
    rep.userBranch = userBranch;
  }
  if (filters.search) {
    conds.push(`(LOWER(CONCAT(COALESCE(l.fname,''),' ',COALESCE(l.lname,''))) LIKE LOWER(:search) OR LOWER(COALESCE(l.email,'')) LIKE LOWER(:search) OR COALESCE(l.phone,'') LIKE :search OR COALESCE(l.mobile,'') LIKE :search)`);
    rep.search = `%${filters.search}%`;
  }
  if (filters.status) {
    conds.push(`LOWER(COALESCE(l.status,'')) = LOWER(:status)`);
    rep.status = filters.status;
  }
  if (filters.assigned === 'unassigned') conds.push('(l.assignTo IS NULL OR l.assignTo = 0)');
  if (filters.assigned === 'assigned')   conds.push('l.assignTo IS NOT NULL AND l.assignTo > 0');
  if (filters.dateFrom) { conds.push('DATE(COALESCE(l.created,l.regdate)) >= :dateFrom'); rep.dateFrom = filters.dateFrom; }
  if (filters.dateTo)   { conds.push('DATE(COALESCE(l.created,l.regdate)) <= :dateTo');   rep.dateTo   = filters.dateTo;   }
  if (filters.priority) { conds.push('LOWER(COALESCE(l.priority,"")) = LOWER(:priority)'); rep.priority = filters.priority; }
  if (filters.branch && cat !== 'branch_manager') { conds.push('l.branch = :branchFilter'); rep.branchFilter = Number(filters.branch); }
  if (filters.nationality) { conds.push('LOWER(COALESCE(l.nationality,"")) LIKE LOWER(:nationality)'); rep.nationality = `%${filters.nationality}%`; }
  if (filters.serviceInterest) { conds.push('l.service_interest = :serviceInterest'); rep.serviceInterest = filters.serviceInterest; }
  if (filters.marketSource) { conds.push('l.market_source = :marketSource'); rep.marketSource = filters.marketSource; }

  return { where: `WHERE ${conds.join(' AND ')}`, rep };
}


export async function GET(request: NextRequest) {
  try {
    const token =
      request.cookies.get('auth-token')?.value ||
      request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const cu = token ? verifyToken(token) : null;
    if (!cu) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const cat = roleCat(cu);
    if (cat === 'other') return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    const userBranch = Number(cu.branch || 0);
    const { searchParams } = new URL(request.url);
    const page   = Math.max(1, Number(searchParams.get('page')  || 1));
    const limit  = Math.min(100, Math.max(1, Number(searchParams.get('limit') || 50)));
    const search        = searchParams.get('search')?.trim() || '';
    const status        = searchParams.get('status') || '';
    const assigned      = searchParams.get('assigned') || '';
    const dateFrom      = searchParams.get('dateFrom') || '';
    const dateTo        = searchParams.get('dateTo')   || '';
    const priority      = searchParams.get('priority') || '';
    const branchFilter  = searchParams.get('branch') || '';
    const nationality   = searchParams.get('nationality') || '';
    const serviceInterest = searchParams.get('serviceInterest') || '';
    const marketSource  = searchParams.get('marketSource') || '';
    const offset   = (page - 1) * limit;

    const { where, rep: filterRep } = buildLeadConditions(cat, userBranch, {
      search, status, assigned, dateFrom, dateTo, priority,
      branch: branchFilter, nationality, serviceInterest, marketSource,
    });
    const rep: Record<string, unknown> = { ...filterRep, limit, offset };

    const [countRow] = await sequelize.query<{ total: number }>(
      `SELECT COUNT(*) AS total FROM dmc_forum_leads l ${where}`,
      { replacements: rep, type: QueryTypes.SELECT }
    );
    const total = Number(countRow?.total || 0);

    const leads = await sequelize.query(
      `SELECT
        l.id,
        COALESCE(l.fname,'') AS fname,
        COALESCE(l.lname,'') AS lname,
        COALESCE(l.email,'') AS email,
        COALESCE(l.phone, l.mobile,'') AS phone,
        COALESCE(l.status,'New') AS status,
        COALESCE(l.priority,'') AS priority,
        COALESCE(l.nationality,'') AS nationality,
        COALESCE(l.service_interest,'') AS serviceInterest,
        COALESCE(l.market_source,'') AS marketSource,
        l.branch,
        COALESCE(b.branch,'Unassigned') AS branchName,
        l.assignTo,
        COALESCE(ae.name,'') AS assigneeName,
        l.Counsilor,
        COALESCE(ce.name,'') AS counsellorName,
        CAST(COALESCE(l.created,l.regdate) AS CHAR) AS created
      FROM dmc_forum_leads l
      LEFT JOIN dm_branch b  ON l.branch   = b.id
      LEFT JOIN dm_employee ae ON l.assignTo  = ae.id
      LEFT JOIN dm_employee ce ON l.Counsilor = ce.id
      ${where}
      ORDER BY COALESCE(l.created, l.regdate) DESC
      LIMIT :limit OFFSET :offset`,
      { replacements: rep, type: QueryTypes.SELECT }
    );

    // Counsellors for transfer dropdown — active employees holding the Counsellor
    // role (BM: branch-filtered). isCounsellor() is the same role-matching logic
    // used elsewhere to distinguish individual-contributor sales staff from
    // Branch Manager/HR/PRO/Accountant/CEO etc., so this list only ever offers
    // actual counsellors as transfer targets.
    const cRep: Record<string, unknown> = {};
    const cConds = ['e.status = 1'];
    if (cat === 'branch_manager' && userBranch) {
      cConds.push('e.branch = :branchId');
      cRep.branchId = userBranch;
    }
    const counsellorCandidates = await sequelize.query<{
      id: number; name: string; branch: number; branchName: string;
      roleName: string | null; roleType: string | null;
    }>(
      `SELECT e.id, e.name, e.branch, COALESCE(b.branch,'') AS branchName,
        r.name AS roleName, r.type AS roleType
      FROM dm_employee e
      LEFT JOIN dm_branch b ON e.branch = b.id
      LEFT JOIN dm_role r ON r.id = e.role
      WHERE ${cConds.join(' AND ')}
      ORDER BY e.name ASC LIMIT 300`,
      { replacements: cRep, type: QueryTypes.SELECT }
    );
    const counsellors = counsellorCandidates
      .filter((row) => isCounsellor({ roleName: row.roleName, type: row.roleType }))
      .map(({ id, name, branch, branchName }) => ({ id, name, branch, branchName }));

    const branches = cat !== 'branch_manager'
      ? await sequelize.query(`SELECT id, branch AS name FROM dm_branch WHERE status=1 ORDER BY branch ASC LIMIT 50`, { type: QueryTypes.SELECT })
      : [];

    return NextResponse.json({
      leads,
      total,
      counsellors,
      branches,
      roleCategory: cat,
      userBranch,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Lead pool GET error:', msg);
    return NextResponse.json({ error: 'Failed to load lead pool', details: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token =
      request.cookies.get('auth-token')?.value ||
      request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const cu = token ? verifyToken(token) : null;
    if (!cu) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const cat = roleCat(cu);
    if (cat === 'other') return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    const userBranch = Number(cu.branch || 0);
    const body = await request.json();
    const { leadIds, counsellorId, selectAll, filters } = body as {
      leadIds: unknown[];
      counsellorId: unknown;
      selectAll?: boolean;
      filters?: LeadFilters;
    };

    if (!counsellorId)
      return NextResponse.json({ error: 'counsellorId is required' }, { status: 400 });

    const upRep: Record<string, unknown> = { cid: Number(counsellorId) };
    let whereClause: string;
    let expectedCount: number;

    if (selectAll) {
      // "Select all N leads" spans every page, not just the ones loaded in the
      // browser — re-run the same filters server-side (scoped to the same
      // where-clause GET uses) instead of trusting a client-supplied ID list,
      // which would only ever cover the currently-rendered page.
      const { where, rep: filterRep } = buildLeadConditions(cat, userBranch, filters || {});
      whereClause = where;
      Object.assign(upRep, filterRep);

      const [countRow] = await sequelize.query<{ total: number }>(
        `SELECT COUNT(*) AS total FROM dmc_forum_leads l ${whereClause}`,
        { replacements: upRep, type: QueryTypes.SELECT }
      );
      expectedCount = Number(countRow?.total || 0);
      if (expectedCount === 0)
        return NextResponse.json({ error: 'No leads match the current filters' }, { status: 400 });
    } else {
      if (!Array.isArray(leadIds) || leadIds.length === 0)
        return NextResponse.json({ error: 'leadIds array is required' }, { status: 400 });

      const ids = leadIds.map(Number).filter(id => id > 0);
      if (ids.length === 0)
        return NextResponse.json({ error: 'No valid lead IDs' }, { status: 400 });

      upRep.ids = ids;
      whereClause = 'WHERE id IN (:ids)';
      if (cat === 'branch_manager' && userBranch) {
        whereClause += ' AND branch = :userBranch';
        upRep.userBranch = userBranch;
      }
      expectedCount = ids.length;
    }

    // buildLeadConditions() aliases the leads table as `l` (needed for its JOIN-free
    // reuse from GET); the UPDATE statement needs that same alias for the WHERE
    // clause it produced to resolve.
    const updateSql = selectAll
      ? `UPDATE dmc_forum_leads l SET l.assignTo = :cid, l.Counsilor = :cid ${whereClause}`
      : `UPDATE dmc_forum_leads SET assignTo = :cid, Counsilor = :cid ${whereClause}`;

    await sequelize.query(updateSql, { replacements: upRep, type: QueryTypes.UPDATE });

    const [counsellor] = await sequelize.query<{ name: string }>(
      `SELECT name FROM dm_employee WHERE id = :cid LIMIT 1`,
      { replacements: { cid: Number(counsellorId) }, type: QueryTypes.SELECT }
    );

    return NextResponse.json({
      success: true,
      transferred: expectedCount,
      counsellorName: counsellor?.name || 'Unknown',
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Lead pool POST error:', msg);
    return NextResponse.json({ error: 'Failed to transfer leads', details: msg }, { status: 500 });
  }
}
