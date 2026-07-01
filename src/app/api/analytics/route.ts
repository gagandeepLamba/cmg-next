import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { verifyToken } from '@/lib/auth';

let dbInitialized = false;
const ensureDB = async () => {
  if (!dbInitialized) { await connectDB(); dbInitialized = true; }
};

const n = (v: unknown) => Number(v || 0);

export async function GET(request: NextRequest) {
  try {
    await ensureDB();

    const token =
      request.cookies.get('auth-token')?.value ||
      request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const currentUser = token ? verifyToken(token) : null;
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'month'; // week | month | quarter | year | all

    // Role-based scope
    const userRole   = currentUser.role ?? 0;
    const userType   = String(currentUser.type || '').toLowerCase().replace(/[\s-]+/g, '_');
    const userBranch = currentUser.branch ?? 0;
    const userId     = currentUser.id ?? 0;

    const isAdmin = userRole === 1 || ['super_admin','admin','administrator','director','dos','director_of_sales','founder'].includes(userType);
    const isBM    = !isAdmin && ['branch_manager','bm'].includes(userType);
    const isCounselor = !isAdmin && !isBM;

    // Role WHERE clause for lead queries
    let leadWhere = '';

    if (isBM && userBranch) {
      leadWhere = `AND l.branch = '${userBranch}'`;
    } else if (isCounselor && userId) {
      leadWhere = `AND (l.assignTo = '${userId}' OR l.Counsilor = '${userId}')`;
    }
    const joinRoleFilter = leadWhere.replace(/^AND l\./, 'AND l.');

    // Build date filter
    const now = new Date();
    let startDate: Date | null = null;
    switch (range) {
      case 'week':    startDate = new Date(now.getTime() - 7   * 86400000); break;
      case 'month':   startDate = new Date(now.getTime() - 30  * 86400000); break;
      case 'quarter': startDate = new Date(now.getTime() - 90  * 86400000); break;
      case 'year':    startDate = new Date(now.getTime() - 365 * 86400000); break;
      default:        startDate = null;
    }

    const dateStr = startDate ? startDate.toISOString().slice(0, 10) : null;
    const dateFilter = dateStr ? `AND l.regdate >= '${dateStr}'` : '';
    const joinDateFilter = dateStr ? `AND l.regdate >= '${dateStr}'` : '';

    const [
      summaryRows,
      statusRows,
      monthlyRows,
      sourceRows,
      counselorRows,
      branchRows,
      appointmentRows,
      paymentTrendRows,
      recentLeadsRows,
    ] = await Promise.all([
      // ── Summary totals ──────────────────────────────────────────────────────
      sequelize.query<{
        total: number; new_leads: number; active: number; converted: number;
        revenue: number; paid: number; pending: number;
      }>(
        `SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN l.status IN ('New','new') THEN 1 ELSE 0 END) AS new_leads,
          SUM(CASE WHEN l.status NOT IN ('New','new','Converted','converted','Retained','retained','Client','client')
               AND (l.opportunity_status IS NULL OR l.opportunity_status <> 'won') THEN 1 ELSE 0 END) AS active,
          SUM(CASE WHEN l.status IN ('Converted','converted','Retained','retained','Client','client')
               OR l.opportunity_status = 'won' THEN 1 ELSE 0 END) AS converted,
          COALESCE(SUM(l.payTotal),0) AS revenue,
          COALESCE(SUM(l.paidYet),0) AS paid,
          COALESCE(SUM(l.payBalance),0) AS pending
        FROM dmc_forum_leads l
        WHERE 1=1 ${leadWhere} ${dateFilter}`,
        { type: QueryTypes.SELECT }
      ),

      // ── Leads by status ────────────────────────────────────────────────────
      sequelize.query<{ status: string; count: number }>(
        `SELECT
          CASE
            WHEN l.status IN ('Converted','converted','Retained','retained','Client','client')
              OR l.opportunity_status = 'won' THEN 'Client'
            WHEN l.status IN ('New','new') THEN 'New'
            WHEN l.status IS NULL OR l.status = '' THEN 'Unknown'
            ELSE l.status
          END AS status,
          COUNT(*) AS count
        FROM dmc_forum_leads l
        WHERE 1=1 ${leadWhere} ${dateFilter}
        GROUP BY 1
        ORDER BY count DESC`,
        { type: QueryTypes.SELECT }
      ),

      // ── Monthly lead trend (last 12 months) ────────────────────────────────
      sequelize.query<{ month: string; total: number; converted: number }>(
        `SELECT
          DATE_FORMAT(l.regdate, '%Y-%m') AS month,
          COUNT(*) AS total,
          SUM(CASE WHEN l.status IN ('Converted','converted','Retained','retained','Client','client')
               OR l.opportunity_status = 'won' THEN 1 ELSE 0 END) AS converted
        FROM dmc_forum_leads l
        WHERE l.regdate >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY month
        ORDER BY month ASC`,
        { type: QueryTypes.SELECT }
      ),

      // ── Leads by source ────────────────────────────────────────────────────
      sequelize.query<{ source: string; count: number }>(
        `SELECT
          COALESCE(ms.name, l.market_source, 'Unknown') AS source,
          COUNT(*) AS count
        FROM dmc_forum_leads l
        LEFT JOIN dm_source ms ON ms.id = CAST(l.market_source AS UNSIGNED)
        WHERE l.market_source IS NOT NULL AND l.market_source <> '' ${leadWhere} ${dateFilter}
        GROUP BY source
        ORDER BY count DESC
        LIMIT 10`,
        { type: QueryTypes.SELECT }
      ),

      // ── Counselor performance ───────────────────────────────────────────────
      sequelize.query<{
        id: number; name: string; branch_name: string;
        total: number; converted: number; revenue: number; paid: number;
      }>(
        `SELECT
          e.id,
          e.name,
          COALESCE(b.name, 'N/A') AS branch_name,
          COUNT(l.id) AS total,
          SUM(CASE WHEN l.status IN ('Converted','converted','Retained','retained','Client','client')
               OR l.opportunity_status = 'won' THEN 1 ELSE 0 END) AS converted,
          COALESCE(SUM(l.payTotal),0) AS revenue,
          COALESCE(SUM(l.paidYet),0) AS paid
        FROM dm_employee e
        LEFT JOIN dmc_forum_leads l ON (l.assignTo = e.id OR l.Counsilor = e.id) ${joinDateFilter} ${isCounselor && userId ? `AND (l.assignTo = '${userId}' OR l.Counsilor = '${userId}')` : isBM && userBranch ? `AND l.branch = '${userBranch}'` : ''}
        LEFT JOIN dm_branch b ON b.id = e.branch
        WHERE e.status = 1 ${isBM && userBranch ? `AND e.branch = '${userBranch}'` : ''}
        GROUP BY e.id, e.name, b.name
        HAVING total > 0
        ORDER BY converted DESC, total DESC
        LIMIT 20`,
        { type: QueryTypes.SELECT }
      ),

      // ── Branch performance ──────────────────────────────────────────────────
      sequelize.query<{
        id: number; name: string; region_name: string;
        total: number; converted: number; revenue: number; paid: number;
      }>(
        `SELECT
          b.id,
          b.name,
          COALESCE(r.name, 'N/A') AS region_name,
          COUNT(l.id) AS total,
          SUM(CASE WHEN l.status IN ('Converted','converted','Retained','retained','Client','client')
               OR l.opportunity_status = 'won' THEN 1 ELSE 0 END) AS converted,
          COALESCE(SUM(l.payTotal),0) AS revenue,
          COALESCE(SUM(l.paidYet),0) AS paid
        FROM dm_branch b
        LEFT JOIN dm_region r ON r.id = b.region
        LEFT JOIN dmc_forum_leads l ON l.branch = b.id ${joinDateFilter} ${isCounselor && userId ? `AND (l.assignTo = '${userId}' OR l.Counsilor = '${userId}')` : ''}
        WHERE b.status = 1 ${isBM && userBranch ? `AND b.id = '${userBranch}'` : ''}
        GROUP BY b.id, b.name, r.name
        ORDER BY total DESC`,
        { type: QueryTypes.SELECT }
      ),

      // ── Appointments ────────────────────────────────────────────────────────
      sequelize.query<{ total: number; completed: number; pending: number }>(
        `SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN done = 1 THEN 1 ELSE 0 END) AS completed,
          SUM(CASE WHEN done = 0 AND not_done = 0 THEN 1 ELSE 0 END) AS pending
        FROM appointments`,
        { type: QueryTypes.SELECT }
      ),

      // ── Payment trend (last 6 months) ─────────────────────────────────────
      sequelize.query<{ month: string; collected: number }>(
        `SELECT
          DATE_FORMAT(ph.date, '%Y-%m') AS month,
          COALESCE(SUM(ph.amount),0) AS collected
        FROM dm_pay_history ph
        ${isCounselor && userId ? `JOIN dmc_forum_leads l ON l.id = ph.leadId AND (l.assignTo = '${userId}' OR l.Counsilor = '${userId}')` : isBM && userBranch ? `JOIN dmc_forum_leads l ON l.id = ph.leadId AND l.branch = '${userBranch}'` : ''}
        WHERE ph.date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
          AND (ph.status IS NULL OR ph.status NOT IN ('cancelled','refund'))
        GROUP BY month
        ORDER BY month ASC`,
        { type: QueryTypes.SELECT }
      ),

      // ── Recent leads (last 10) ─────────────────────────────────────────────
      sequelize.query<{
        id: number; fname: string; lname: string; status: string;
        priority: string; branch_name: string; assigned_to: string; regdate: string;
      }>(
        `SELECT
          l.id,
          l.fname,
          l.lname,
          COALESCE(l.status, 'New') AS status,
          COALESCE(l.priority, '') AS priority,
          COALESCE(b.name, 'N/A') AS branch_name,
          COALESCE(e.name, 'Unassigned') AS assigned_to,
          DATE_FORMAT(l.regdate, '%Y-%m-%d') AS regdate
        FROM dmc_forum_leads l
        LEFT JOIN dm_branch b ON b.id = l.branch
        LEFT JOIN dm_employee e ON e.id = l.assignTo
        WHERE 1=1 ${leadWhere}
        ORDER BY l.id DESC
        LIMIT 10`,
        { type: QueryTypes.SELECT }
      ),
    ]);

    const s = summaryRows[0] || {};
    const totalLeads = n(s.total);
    const converted = n(s.converted);

    // Employee count
    const [empCount] = await sequelize.query<{ total: number }>(
      `SELECT COUNT(*) AS total FROM dm_employee WHERE status = 1`,
      { type: QueryTypes.SELECT }
    );

    return NextResponse.json({
      summary: {
        totalLeads,
        newLeads: n(s.new_leads),
        activeLeads: n(s.active),
        convertedLeads: converted,
        conversionRate: totalLeads > 0 ? parseFloat(((converted / totalLeads) * 100).toFixed(1)) : 0,
        totalRevenue: n(s.revenue),
        collectedAmount: n(s.paid),
        pendingAmount: n(s.pending),
        totalEmployees: n(empCount?.total),
        totalAppointments: n(appointmentRows[0]?.total),
        completedAppointments: n(appointmentRows[0]?.completed),
        pendingAppointments: n(appointmentRows[0]?.pending),
      },
      leadsByStatus: statusRows.map(r => ({ status: String(r.status), count: n(r.count) })),
      leadsByMonth: monthlyRows.map(r => ({
        month: r.month,
        total: n(r.total),
        converted: n(r.converted),
      })),
      leadsBySource: sourceRows.map(r => ({ source: String(r.source), count: n(r.count) })),
      counselorPerformance: counselorRows.map(r => ({
        id: r.id,
        name: r.name,
        branch: r.branch_name,
        totalLeads: n(r.total),
        convertedLeads: n(r.converted),
        conversionRate: n(r.total) > 0
          ? parseFloat(((n(r.converted) / n(r.total)) * 100).toFixed(1))
          : 0,
        revenue: n(r.revenue),
        collected: n(r.paid),
      })),
      branchPerformance: branchRows.map(r => ({
        id: r.id,
        name: r.name,
        region: r.region_name,
        totalLeads: n(r.total),
        convertedLeads: n(r.converted),
        conversionRate: n(r.total) > 0
          ? parseFloat(((n(r.converted) / n(r.total)) * 100).toFixed(1))
          : 0,
        revenue: n(r.revenue),
        collected: n(r.paid),
      })),
      paymentTrend: paymentTrendRows.map(r => ({
        month: r.month,
        collected: n(r.collected),
      })),
      recentLeads: recentLeadsRows,
    });
  } catch (error) {
    console.error('[analytics] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
