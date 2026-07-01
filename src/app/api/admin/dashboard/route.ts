import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { verifyToken } from '@/lib/auth';

let dbInitialized = false;
const ensureDBConnection = async () => {
  if (!dbInitialized) { await connectDB(); dbInitialized = true; }
};

const n = (v: unknown) => Number(v || 0);

// Determine the role category from the user's type string
function roleCategory(type: string) {
  const t = type.toLowerCase().replace(/[\s-]+/g, '_');
  if (['super_admin', 'admin', 'administrator', 'director', 'dos', 'director_of_sales', 'founder'].includes(t)) return 'admin';
  if (['branch_manager', 'bm'].includes(t)) return 'branch_manager';
  if (['hr'].includes(t)) return 'hr';
  if (['pro'].includes(t)) return 'pro';
  if (['finance', 'accounts'].includes(t)) return 'finance';
  if (['operations', 'ops'].includes(t)) return 'operations';
  return 'counselor'; // sales, employee, etc.
}

export async function GET(request: NextRequest) {
  try {
    await ensureDBConnection();

    // Auth — get the current user from cookie/header
    const token =
      request.cookies.get('auth-token')?.value ||
      request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const currentUser = token ? verifyToken(token) : null;

    const { searchParams } = new URL(request.url);
    // Allow explicit override for backwards-compat (counselor passes employeeId)
    const employeeIdParam = Number(searchParams.get('employeeId') || 0);

    // Derive user identity
    const userId   = currentUser?.id   ?? employeeIdParam;
    const userRole = currentUser?.role ?? 0;
    const userType = String(currentUser?.type || '');
    const userBranch = currentUser?.branch ?? 0;
    const cat = userRole === 1 ? 'admin' : roleCategory(userType);

    const today    = new Date().toISOString().split('T')[0];
    const weekAgo  = new Date(Date.now() -  7 * 86400000).toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
    const yearAgo  = new Date(Date.now() - 365 * 86400000).toISOString().split('T')[0];

    // ── Build WHERE clause for lead queries based on role ────────────────────
    let leadWhere = '';
    let leadReplacements: Record<string, unknown> = {};

    if (cat === 'admin') {
      leadWhere = '';
    } else if (cat === 'branch_manager' && userBranch) {
      leadWhere = 'WHERE l.branch = :branch';
      leadReplacements = { branch: userBranch };
    } else if (cat === 'counselor' && userId) {
      leadWhere = 'WHERE (l.assignTo = :uid OR l.Counsilor = :uid)';
      leadReplacements = { uid: userId };
    } else if (cat === 'finance' || cat === 'operations' || cat === 'hr' || cat === 'pro') {
      // These roles see global summary stats but limited recent leads
      leadWhere = '';
    }

    const andLeadWhere = leadWhere.replace(/^WHERE\s+/, 'AND ');
    const leadWhereForJoin = andLeadWhere ? andLeadWhere : '';

    // ── Appointment filter ───────────────────────────────────────────────────
    const apptEmployeeFilter = (cat === 'counselor' && userId)
      ? 'AND a.counsilorid = :uid'
      : '';
    const fuEmployeeFilter = (cat === 'counselor' && userId)
      ? 'AND r.user_id = :uid'
      : '';
    const apptBranchFilter = (cat === 'branch_manager' && userBranch)
      ? 'AND a.branch = :branch'
      : '';
    const apptReplacements = { today, uid: userId, branch: userBranch };

    // ── Lead Stats ───────────────────────────────────────────────────────────
    const [leadStats] = await sequelize.query<any>(`
      SELECT
        COUNT(*) AS totalLeads,
        SUM(CASE WHEN DATE(COALESCE(l.created, l.regdate)) = :today THEN 1 ELSE 0 END) AS todayLeads,
        SUM(CASE WHEN DATE(COALESCE(l.created, l.regdate)) >= :weekAgo THEN 1 ELSE 0 END) AS weekLeads,
        SUM(CASE WHEN DATE(COALESCE(l.created, l.regdate)) >= :monthAgo THEN 1 ELSE 0 END) AS monthLeads,
        SUM(CASE WHEN LOWER(COALESCE(l.status, '')) IN ('converted', 'retained', 'client')
               OR LOWER(COALESCE(l.opportunity_status, '')) = 'won' THEN 1 ELSE 0 END) AS convertedLeads,
        SUM(CASE WHEN l.followupstat = 0 AND l.followup IS NOT NULL AND DATE(l.followup) <= :today THEN 1 ELSE 0 END) AS pendingFollowups,
        COALESCE(SUM(l.payTotal), 0) AS totalRevenue,
        COALESCE(SUM(l.paidYet), 0) AS totalPaidAmount,
        COALESCE(SUM(l.payBalance), 0) AS totalBalance
      FROM dmc_forum_leads l
      ${leadWhere}
    `, { replacements: { today, weekAgo, monthAgo, ...leadReplacements }, type: QueryTypes.SELECT });

    // ── Appointment Stats ────────────────────────────────────────────────────
    const [appointmentStats] = await sequelize.query<any>(`
      SELECT
        COUNT(*) AS totalAppointments,
        SUM(CASE WHEN DATE(a.date) = :today THEN 1 ELSE 0 END) AS todayAppointments,
        SUM(CASE WHEN COALESCE(a.done, 0) = 0 AND COALESCE(a.not_done, 0) = 0 THEN 1 ELSE 0 END) AS pendingAppointments,
        SUM(CASE WHEN DATE(a.date) >= :today THEN 1 ELSE 0 END) AS upcomingAppointments
      FROM appointments a
      WHERE 1=1 ${apptEmployeeFilter} ${apptBranchFilter}
    `, { replacements: apptReplacements, type: QueryTypes.SELECT });

    // ── Employee Stats ───────────────────────────────────────────────────────
    const [employeeStats] = await sequelize.query<any>(
      `SELECT COUNT(*) AS totalEmployees FROM dm_employee WHERE COALESCE(status, 1) = 1${
        cat === 'branch_manager' && userBranch ? ' AND branch = :branch' : ''}`,
      { replacements: { branch: userBranch }, type: QueryTypes.SELECT }
    );

    // ── Opportunity Stats ────────────────────────────────────────────────────
    const [opportunityStats] = await sequelize.query<any>(`
      SELECT
        COUNT(*) AS totalOperations,
        SUM(CASE WHEN LOWER(COALESCE(status, '')) IN ('qualified','proposal','negotiation','in_progress') THEN 1 ELSE 0 END) AS activeOperations,
        SUM(CASE WHEN LOWER(COALESCE(status, '')) = 'won' THEN 1 ELSE 0 END) AS completedOperations
      FROM dmc_opportunities
    `, { type: QueryTypes.SELECT });

    // ── Branch count ─────────────────────────────────────────────────────────
    const [branchStats] = await sequelize.query<any>(
      `SELECT COUNT(*) AS totalBranches FROM dm_branch`,
      { type: QueryTypes.SELECT }
    );

    // ── Recent Leads ─────────────────────────────────────────────────────────
    const recentLeads = await sequelize.query<any>(`
      SELECT
        l.id, l.fname, l.lname, l.email, l.phone, l.status, l.priority,
        l.country_interest, l.service_interest, l.created, l.regdate,
        e.name AS assignedTo
      FROM dmc_forum_leads l
      LEFT JOIN dm_employee e ON l.assignTo = e.id
      ${leadWhere}
      ORDER BY COALESCE(l.created, l.regdate) DESC
      LIMIT 10
    `, { replacements: leadReplacements, type: QueryTypes.SELECT });

    // ── Today's Appointments ─────────────────────────────────────────────────
    const todayAppointments = await sequelize.query<any>(`
      SELECT
        a.id, a.date, a.appointtime, a.leadid, a.booked, a.done, a.not_done,
        l.fname, l.lname, l.phone, l.mobile,
        e.name AS counselorName,
        b.name AS branchName
      FROM appointments a
      LEFT JOIN dmc_forum_leads l ON a.leadid = l.id
      LEFT JOIN dm_employee e ON a.counsilorid = e.id
      LEFT JOIN dm_branch b ON a.branch = b.id
      WHERE DATE(a.date) = :today ${apptEmployeeFilter} ${apptBranchFilter}
      ORDER BY a.appointtime ASC
      LIMIT 50
    `, { replacements: apptReplacements, type: QueryTypes.SELECT });

    // ── Today's Follow-ups ────────────────────────────────────────────────────
    const todayFollowUps = await sequelize.query<any>(`
      SELECT
        r.id, r.lead_id, r.user_id, r.reminder_date, r.message, r.status, r.priority,
        l.fname, l.lname, l.phone, l.mobile,
        e.name AS employeeName
      FROM dmc_follow_up_reminders r
      LEFT JOIN dmc_forum_leads l ON r.lead_id = l.id
      LEFT JOIN dm_employee e ON r.user_id = e.id
      WHERE DATE(r.reminder_date) = :today ${fuEmployeeFilter}
      ORDER BY r.reminder_date ASC
      LIMIT 50
    `, { replacements: { today, uid: userId }, type: QueryTypes.SELECT });

    // ── Recent Appointments ───────────────────────────────────────────────────
    const recentAppointments = await sequelize.query<any>(`
      SELECT
        a.id, a.date, a.appointtime, a.leadid,
        l.fname, l.lname, l.phone,
        e.name AS counselorName
      FROM appointments a
      LEFT JOIN dmc_forum_leads l ON a.leadid = l.id
      LEFT JOIN dm_employee e ON a.counsilorid = e.id
      WHERE (a.date IS NULL OR DATE(a.date) >= :today)
        ${apptEmployeeFilter} ${apptBranchFilter}
      ORDER BY a.date ASC, a.appointtime ASC
      LIMIT 10
    `, { replacements: apptReplacements, type: QueryTypes.SELECT });

    // ── Status Breakdown ──────────────────────────────────────────────────────
    const statusBreakdownRows = await sequelize.query<any>(`
      SELECT COALESCE(l.status, 'Unknown') AS status, COUNT(*) AS count
      FROM dmc_forum_leads l
      ${leadWhere}
      GROUP BY COALESCE(l.status, 'Unknown')
      ORDER BY count DESC
    `, { replacements: leadReplacements, type: QueryTypes.SELECT });

    // ── Priority Breakdown ────────────────────────────────────────────────────
    const priorityBreakdown = await sequelize.query<any>(`
      SELECT COALESCE(l.priority, 'Unknown') AS name, COUNT(*) AS value
      FROM dmc_forum_leads l
      ${leadWhere}
      GROUP BY COALESCE(l.priority, 'Unknown')
      ORDER BY value DESC
    `, { replacements: leadReplacements, type: QueryTypes.SELECT });

    // ── Source Breakdown ──────────────────────────────────────────────────────
    const sourceBreakdown = await sequelize.query<any>(`
      SELECT
        COALESCE(ms.name, l.market_source, 'Unknown') AS name,
        COUNT(*) AS value
      FROM dmc_forum_leads l
      LEFT JOIN dm_source ms ON ms.id = CAST(l.market_source AS UNSIGNED)
      ${leadWhere}
      GROUP BY COALESCE(ms.name, l.market_source, 'Unknown')
      ORDER BY value DESC
      LIMIT 10
    `, { replacements: leadReplacements, type: QueryTypes.SELECT });

    // ── Branch Performance ─────────────────────────────────────────────────────
    const branchPerformance = await sequelize.query<any>(`
      SELECT
        COALESCE(b.name, 'Unassigned') AS branch,
        COUNT(l.id) AS leads,
        SUM(CASE WHEN LOWER(COALESCE(l.status, '')) IN ('converted','retained','client')
              OR LOWER(COALESCE(l.opportunity_status, '')) = 'won' THEN 1 ELSE 0 END) AS converted
      FROM dmc_forum_leads l
      LEFT JOIN dm_branch b ON l.branch = b.id
      ${leadWhere}
      GROUP BY COALESCE(b.name, 'Unassigned')
      ORDER BY leads DESC
      LIMIT 8
    `, { replacements: leadReplacements, type: QueryTypes.SELECT });

    // ── Top Employees ──────────────────────────────────────────────────────────
    const topEmployees = await sequelize.query<any>(`
      SELECT
        COALESCE(e.name, 'Unassigned') AS name,
        COUNT(l.id) AS leads,
        SUM(CASE WHEN LOWER(COALESCE(l.status, '')) IN ('converted','retained','client')
              OR LOWER(COALESCE(l.opportunity_status, '')) = 'won' THEN 1 ELSE 0 END) AS converted
      FROM dmc_forum_leads l
      LEFT JOIN dm_employee e ON l.assignTo = e.id
      ${leadWhere}
      GROUP BY COALESCE(e.name, 'Unassigned')
      ORDER BY leads DESC
      LIMIT 8
    `, { replacements: leadReplacements, type: QueryTypes.SELECT });

    // ── Monthly Trend ──────────────────────────────────────────────────────────
    const monthlyLeads = await sequelize.query<any>(`
      SELECT
        DATE_FORMAT(COALESCE(l.created, l.regdate), '%Y-%m') AS month,
        COUNT(*) AS count
      FROM dmc_forum_leads l
      ${leadWhere ? leadWhere + ' AND' : 'WHERE'} DATE(COALESCE(l.created, l.regdate)) >= :yearAgo
      GROUP BY DATE_FORMAT(COALESCE(l.created, l.regdate), '%Y-%m')
      ORDER BY month ASC
    `, { replacements: { yearAgo, ...leadReplacements }, type: QueryTypes.SELECT });

    // ── Daily Trend (30 days) ──────────────────────────────────────────────────
    const leadTrend = await sequelize.query<any>(`
      SELECT
        DATE(COALESCE(l.created, l.regdate)) AS date,
        COUNT(*) AS leads
      FROM dmc_forum_leads l
      ${leadWhere ? leadWhere + ' AND' : 'WHERE'} DATE(COALESCE(l.created, l.regdate)) >= :monthAgo
      GROUP BY DATE(COALESCE(l.created, l.regdate))
      ORDER BY date ASC
    `, { replacements: { monthAgo, ...leadReplacements }, type: QueryTypes.SELECT });

    // ── Compose response ──────────────────────────────────────────────────────
    const totalLeads    = n(leadStats?.totalLeads);
    const convertedLeads = n(leadStats?.convertedLeads);
    const conversionRate = totalLeads > 0 ? Number(((convertedLeads / totalLeads) * 100).toFixed(1)) : 0;
    const totalOperations    = n(opportunityStats?.totalOperations);
    const completedOperations = n(opportunityStats?.completedOperations);
    const completionRate = totalOperations > 0 ? Number(((completedOperations / totalOperations) * 100).toFixed(1)) : 0;

    const formattedRecentLeads = recentLeads.map((lead: any) => ({
      id: lead.id,
      fname: lead.fname,
      lname: lead.lname,
      name: `${lead.fname || ''} ${lead.lname || ''}`.trim() || 'Unknown',
      email: lead.email,
      phone: lead.phone,
      status: lead.status || 'New',
      priority: lead.priority || 'Medium',
      country_interest: lead.country_interest || 'Not specified',
      service_interest: lead.service_interest || 'Not specified',
      created: lead.created || lead.regdate,
      date: lead.created ? new Date(lead.created).toISOString().split('T')[0] : today,
      assignedTo: lead.assignedTo || 'Unassigned',
    }));

    const statusBreakdown = statusBreakdownRows.map((item: any) => ({
      status: item.status || 'Unknown',
      name: item.status || 'Unknown',
      count: n(item.count),
      value: n(item.count),
      percentage: totalLeads > 0 ? ((n(item.count) / totalLeads) * 100).toFixed(1) : '0',
    }));

    const statusDistributionColors = ['#35AE22','#289018','#50C835','#1C6B10','#B8DFB0','#0891b2'];

    const stats = {
      // Identity / role context
      roleCategory: cat,
      userBranch,
      // Leads
      totalLeads,
      todayLeads: n(leadStats?.todayLeads),
      weekLeads: n(leadStats?.weekLeads),
      monthLeads: n(leadStats?.monthLeads),
      convertedLeads,
      pendingFollowups: n(leadStats?.pendingFollowups),
      followupLeads: n(leadStats?.pendingFollowups),
      // Appointments
      totalAppointments: n(appointmentStats?.totalAppointments),
      todayAppointments: n(appointmentStats?.todayAppointments),
      pendingAppointments: n(appointmentStats?.pendingAppointments),
      upcomingAppointments: n(appointmentStats?.upcomingAppointments),
      // People
      totalEmployees: n(employeeStats?.totalEmployees),
      totalBranches: n(branchStats?.totalBranches),
      // Finance
      totalRevenue: n(leadStats?.totalRevenue),
      totalPayments: n(leadStats?.totalPaidAmount),
      totalPaidAmount: n(leadStats?.totalPaidAmount),
      totalBalance: n(leadStats?.totalBalance),
      // Opportunities
      totalOperations,
      activeOperations: n(opportunityStats?.activeOperations),
      completedOperations,
      pendingTasks: n(leadStats?.pendingFollowups) + n(appointmentStats?.pendingAppointments),
      recentActivities: formattedRecentLeads.length,
      conversionRate,
      completionRate,
      monthlyLeads: monthlyLeads.map((item: any) => ({ month: item.month, count: n(item.count) })),
      statusBreakdown: statusBreakdownRows.map((item: any) => ({ name: item.status || 'Unknown', value: n(item.count) })),
      priorityBreakdown: priorityBreakdown.map((item: any) => ({ name: item.name, value: n(item.value) })),
      sourceBreakdown: sourceBreakdown.map((item: any) => ({ name: item.name, value: n(item.value) })),
      recentLeads: formattedRecentLeads,
      branchPerformance: branchPerformance.map((item: any) => ({
        branch: item.branch,
        leads: n(item.leads),
        conversion: n(item.leads) > 0 ? `${((n(item.converted) / n(item.leads)) * 100).toFixed(1)}%` : '0%',
      })),
      topEmployees: topEmployees.map((item: any) => ({
        name: item.name,
        leads: n(item.leads),
        conversion: n(item.leads) > 0 ? `${((n(item.converted) / n(item.leads)) * 100).toFixed(1)}%` : '0%',
      })),
      todayCounselorAppointments: todayAppointments.length,
      todayCounselorFollowUps: todayFollowUps.length,
    };

    const data = {
      stats,
      recentLeads: formattedRecentLeads,
      recentAppointments,
      todayAppointments,
      todayFollowUps,
      statusBreakdown,
      graphData: {
        leadTrend: leadTrend.map((item: any) => ({
          date: item.date instanceof Date ? item.date.toISOString().split('T')[0] : String(item.date),
          leads: n(item.leads),
        })),
        statusDistribution: statusBreakdown.map((item, index) => ({
          name: item.status,
          value: item.count,
          color: statusDistributionColors[index % statusDistributionColors.length],
        })),
      },
    };

    return NextResponse.json({
      ...stats,
      success: true,
      data,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data', details: error.message },
      { status: 500 }
    );
  }
}
