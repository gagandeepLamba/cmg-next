import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';
import { verifyToken } from '@/lib/auth';

function roleCat(type: string, roleId: number) {
  if (roleId === 1) return 'admin';
  const t = type.toLowerCase().replace(/[\s-]+/g, '_');
  if (['super_admin', 'admin', 'administrator', 'director', 'dos', 'director_of_sales', 'founder'].includes(t)) return 'admin';
  if (['branch_manager', 'bm'].includes(t)) return 'branch_manager';
  return 'other';
}


export async function GET(request: NextRequest) {
  try {
    const token =
      request.cookies.get('auth-token')?.value ||
      request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const cu = token ? verifyToken(token) : null;
    if (!cu) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const cat = roleCat(String(cu.type || ''), Number(cu.role || 0));
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

    const conds: string[] = ['1=1'];
    const rep: Record<string, unknown> = { limit, offset };

    if (cat === 'branch_manager' && userBranch) {
      conds.push('l.branch = :userBranch');
      rep.userBranch = userBranch;
    }
    if (search) {
      conds.push(`(LOWER(CONCAT(COALESCE(l.fname,''),' ',COALESCE(l.lname,''))) LIKE LOWER(:search) OR LOWER(COALESCE(l.email,'')) LIKE LOWER(:search) OR COALESCE(l.phone,'') LIKE :search OR COALESCE(l.mobile,'') LIKE :search)`);
      rep.search = `%${search}%`;
    }
    if (status) {
      conds.push(`LOWER(COALESCE(l.status,'')) = LOWER(:status)`);
      rep.status = status;
    }
    if (assigned === 'unassigned') conds.push('(l.assignTo IS NULL OR l.assignTo = 0)');
    if (assigned === 'assigned')   conds.push('l.assignTo IS NOT NULL AND l.assignTo > 0');
    if (dateFrom) { conds.push('DATE(COALESCE(l.created,l.regdate)) >= :dateFrom'); rep.dateFrom = dateFrom; }
    if (dateTo)   { conds.push('DATE(COALESCE(l.created,l.regdate)) <= :dateTo');   rep.dateTo   = dateTo;   }
    if (priority) { conds.push('LOWER(COALESCE(l.priority,"")) = LOWER(:priority)'); rep.priority = priority; }
    if (branchFilter && cat !== 'branch_manager') { conds.push('l.branch = :branchFilter'); rep.branchFilter = Number(branchFilter); }
    if (nationality) { conds.push('LOWER(COALESCE(l.nationality,"")) LIKE LOWER(:nationality)'); rep.nationality = `%${nationality}%`; }
    if (serviceInterest) { conds.push('l.service_interest = :serviceInterest'); rep.serviceInterest = serviceInterest; }
    if (marketSource) { conds.push('l.market_source = :marketSource'); rep.marketSource = marketSource; }

    const where = `WHERE ${conds.join(' AND ')}`;

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
        COALESCE(b.name,'Unassigned') AS branchName,
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

    // Counsellors for transfer dropdown — all active employees (BM: branch-filtered)
    const cRep: Record<string, unknown> = {};
    const cConds = ['e.status = 1'];
    if (cat === 'branch_manager' && userBranch) {
      cConds.push('e.branch = :branchId');
      cRep.branchId = userBranch;
    }
    const counsellors = await sequelize.query(
      `SELECT e.id, e.name, e.branch, COALESCE(b.name,'') AS branchName
      FROM dm_employee e
      LEFT JOIN dm_branch b ON e.branch = b.id
      WHERE ${cConds.join(' AND ')}
      ORDER BY e.name ASC LIMIT 300`,
      { replacements: cRep, type: QueryTypes.SELECT }
    );

    const branches = cat !== 'branch_manager'
      ? await sequelize.query(`SELECT id, name FROM dm_branch WHERE status=1 ORDER BY name ASC LIMIT 50`, { type: QueryTypes.SELECT })
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

    const cat = roleCat(String(cu.type || ''), Number(cu.role || 0));
    if (cat === 'other') return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    const userBranch = Number(cu.branch || 0);
    const body = await request.json();
    const { leadIds, counsellorId } = body as { leadIds: unknown[]; counsellorId: unknown };

    if (!Array.isArray(leadIds) || leadIds.length === 0)
      return NextResponse.json({ error: 'leadIds array is required' }, { status: 400 });
    if (!counsellorId)
      return NextResponse.json({ error: 'counsellorId is required' }, { status: 400 });

    const ids = leadIds.map(Number).filter(id => id > 0);
    if (ids.length === 0)
      return NextResponse.json({ error: 'No valid lead IDs' }, { status: 400 });

    const upRep: Record<string, unknown> = { cid: Number(counsellorId), ids };
    let whereClause = 'WHERE id IN (:ids)';
    if (cat === 'branch_manager' && userBranch) {
      whereClause += ' AND branch = :userBranch';
      upRep.userBranch = userBranch;
    }

    await sequelize.query(
      `UPDATE dmc_forum_leads SET assignTo = :cid, Counsilor = :cid ${whereClause}`,
      { replacements: upRep, type: QueryTypes.UPDATE }
    );

    const [counsellor] = await sequelize.query<{ name: string }>(
      `SELECT name FROM dm_employee WHERE id = :cid LIMIT 1`,
      { replacements: { cid: Number(counsellorId) }, type: QueryTypes.SELECT }
    );

    return NextResponse.json({
      success: true,
      transferred: ids.length,
      counsellorName: counsellor?.name || 'Unknown',
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Lead pool POST error:', msg);
    return NextResponse.json({ error: 'Failed to transfer leads', details: msg }, { status: 500 });
  }
}
