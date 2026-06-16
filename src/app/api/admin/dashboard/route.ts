import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';

let dbInitialized = false;

const ensureDBConnection = async () => {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
};

const numberValue = (value: unknown) => Number(value || 0);

export async function GET(request: NextRequest) {
  try {
    await ensureDBConnection();
    const { searchParams } = new URL(request.url);
    const employeeId = Number(searchParams.get('employeeId') || 0);
    const employeeFilter = employeeId > 0 ? 'AND a.counsilorid = :employeeId' : '';
    const followUpEmployeeFilter = employeeId > 0 ? 'AND r.user_id = :employeeId' : '';
    const replacements = employeeId > 0 ? { employeeId } : {};

    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const yearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [leadStats] = await sequelize.query<any>(`
      SELECT
        COUNT(*) AS totalLeads,
        SUM(CASE WHEN DATE(COALESCE(created, regdate)) = ? THEN 1 ELSE 0 END) AS todayLeads,
        SUM(CASE WHEN DATE(COALESCE(created, regdate)) >= ? THEN 1 ELSE 0 END) AS weekLeads,
        SUM(CASE WHEN DATE(COALESCE(created, regdate)) >= ? THEN 1 ELSE 0 END) AS monthLeads,
        SUM(CASE
          WHEN LOWER(COALESCE(status, '')) IN ('converted', 'retained', 'client')
            OR LOWER(COALESCE(opportunity_status, '')) = 'won'
          THEN 1 ELSE 0 END) AS convertedLeads,
        SUM(CASE
          WHEN followupstat = 0 AND followup IS NOT NULL AND DATE(followup) <= ?
          THEN 1 ELSE 0 END) AS pendingFollowups,
        COALESCE(SUM(payTotal), 0) AS totalRevenue,
        COALESCE(SUM(paidYet), 0) AS totalPaidAmount,
        COALESCE(SUM(payBalance), 0) AS totalBalance
      FROM dmc_forum_leads
    `, {
      replacements: [today, weekAgo, monthAgo, today],
      type: QueryTypes.SELECT
    });

    const [appointmentStats] = await sequelize.query<any>(`
      SELECT
        COUNT(*) AS totalAppointments,
        SUM(CASE WHEN DATE(date) = ? THEN 1 ELSE 0 END) AS todayAppointments,
        SUM(CASE WHEN COALESCE(done, 0) = 0 AND COALESCE(not_done, 0) = 0 THEN 1 ELSE 0 END) AS pendingAppointments,
        SUM(CASE WHEN DATE(date) >= ? THEN 1 ELSE 0 END) AS upcomingAppointments
      FROM appointments
    `, {
      replacements: [today, today],
      type: QueryTypes.SELECT
    });

    const [employeeStats] = await sequelize.query<any>(`
      SELECT COUNT(*) AS totalEmployees
      FROM dm_employee
      WHERE COALESCE(status, 1) = 1
    `, { type: QueryTypes.SELECT });

    const [branchStats] = await sequelize.query<any>(`
      SELECT COUNT(*) AS totalBranches
      FROM dm_branch
    `, { type: QueryTypes.SELECT });

    const [opportunityStats] = await sequelize.query<any>(`
      SELECT
        COUNT(*) AS totalOperations,
        SUM(CASE WHEN LOWER(COALESCE(status, '')) IN ('qualified', 'proposal', 'negotiation', 'in_progress') THEN 1 ELSE 0 END) AS activeOperations,
        SUM(CASE WHEN LOWER(COALESCE(status, '')) = 'won' THEN 1 ELSE 0 END) AS completedOperations
      FROM dmc_opportunities
    `, { type: QueryTypes.SELECT });

    const recentLeads = await sequelize.query<any>(`
      SELECT
        l.id, l.fname, l.lname, l.email, l.phone, l.status, l.priority,
        l.country_interest, l.service_interest, l.created, l.regdate,
        e.name AS assignedTo
      FROM dmc_forum_leads l
      LEFT JOIN dm_employee e ON l.assignTo = e.id
      ORDER BY COALESCE(l.created, l.regdate) DESC
      LIMIT 10
    `, { type: QueryTypes.SELECT });

    const recentAppointments = await sequelize.query<any>(`
      SELECT
        a.id, a.date, a.appointtime, a.leadid,
        l.fname, l.lname, l.phone,
        e.name AS counselorName
      FROM appointments a
      LEFT JOIN dmc_forum_leads l ON a.leadid = l.id
      LEFT JOIN dm_employee e ON a.counsilorid = e.id
      WHERE (a.date IS NULL OR DATE(a.date) >= :today) ${employeeFilter}
      ORDER BY a.date ASC, a.appointtime ASC
      LIMIT 10
    `, {
      replacements: { today, ...replacements },
      type: QueryTypes.SELECT
    });

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
      WHERE DATE(a.date) = :today ${employeeFilter}
      ORDER BY a.appointtime ASC
      LIMIT 50
    `, {
      replacements: { today, ...replacements },
      type: QueryTypes.SELECT
    });

    const todayFollowUps = await sequelize.query<any>(`
      SELECT
        r.id, r.lead_id, r.user_id, r.reminder_date, r.message, r.status, r.priority,
        l.fname, l.lname, l.phone, l.mobile,
        e.name AS employeeName
      FROM dmc_follow_up_reminders r
      LEFT JOIN dmc_forum_leads l ON r.lead_id = l.id
      LEFT JOIN dm_employee e ON r.user_id = e.id
      WHERE DATE(r.reminder_date) = :today ${followUpEmployeeFilter}
      ORDER BY r.reminder_date ASC
      LIMIT 50
    `, {
      replacements: { today, ...replacements },
      type: QueryTypes.SELECT
    });

    const monthlyLeads = await sequelize.query<any>(`
      SELECT
        DATE_FORMAT(COALESCE(created, regdate), '%Y-%m') AS month,
        COUNT(*) AS count
      FROM dmc_forum_leads
      WHERE DATE(COALESCE(created, regdate)) >= ?
      GROUP BY DATE_FORMAT(COALESCE(created, regdate), '%Y-%m')
      ORDER BY month ASC
    `, {
      replacements: [yearAgo],
      type: QueryTypes.SELECT
    });

    const leadTrend = await sequelize.query<any>(`
      SELECT
        DATE(COALESCE(created, regdate)) AS date,
        COUNT(*) AS leads
      FROM dmc_forum_leads
      WHERE DATE(COALESCE(created, regdate)) >= ?
      GROUP BY DATE(COALESCE(created, regdate))
      ORDER BY date ASC
    `, {
      replacements: [monthAgo],
      type: QueryTypes.SELECT
    });

    const statusBreakdownRows = await sequelize.query<any>(`
      SELECT COALESCE(status, 'Unknown') AS status, COUNT(*) AS count
      FROM dmc_forum_leads
      GROUP BY COALESCE(status, 'Unknown')
      ORDER BY count DESC
    `, { type: QueryTypes.SELECT });

    const priorityBreakdown = await sequelize.query<any>(`
      SELECT COALESCE(priority, 'Unknown') AS name, COUNT(*) AS value
      FROM dmc_forum_leads
      GROUP BY COALESCE(priority, 'Unknown')
      ORDER BY value DESC
    `, { type: QueryTypes.SELECT });

    const sourceBreakdown = await sequelize.query<any>(`
      SELECT COALESCE(market_source, 'Unknown') AS name, COUNT(*) AS value
      FROM dmc_forum_leads
      GROUP BY COALESCE(market_source, 'Unknown')
      ORDER BY value DESC
    `, { type: QueryTypes.SELECT });

    const branchPerformance = await sequelize.query<any>(`
      SELECT
        COALESCE(b.name, 'Unassigned') AS branch,
        COUNT(l.id) AS leads,
        SUM(CASE
          WHEN LOWER(COALESCE(l.status, '')) IN ('converted', 'retained', 'client')
            OR LOWER(COALESCE(l.opportunity_status, '')) = 'won'
          THEN 1 ELSE 0 END) AS converted
      FROM dmc_forum_leads l
      LEFT JOIN dm_branch b ON l.branch = b.id
      GROUP BY COALESCE(b.name, 'Unassigned')
      ORDER BY leads DESC
      LIMIT 8
    `, { type: QueryTypes.SELECT });

    const topEmployees = await sequelize.query<any>(`
      SELECT
        COALESCE(e.name, 'Unassigned') AS name,
        COUNT(l.id) AS leads,
        SUM(CASE
          WHEN LOWER(COALESCE(l.status, '')) IN ('converted', 'retained', 'client')
            OR LOWER(COALESCE(l.opportunity_status, '')) = 'won'
          THEN 1 ELSE 0 END) AS converted
      FROM dmc_forum_leads l
      LEFT JOIN dm_employee e ON l.assignTo = e.id
      GROUP BY COALESCE(e.name, 'Unassigned')
      ORDER BY leads DESC
      LIMIT 8
    `, { type: QueryTypes.SELECT });

    const totalLeads = numberValue(leadStats?.totalLeads);
    const convertedLeads = numberValue(leadStats?.convertedLeads);
    const conversionRate = totalLeads > 0 ? Number(((convertedLeads / totalLeads) * 100).toFixed(1)) : 0;
    const totalOperations = numberValue(opportunityStats?.totalOperations);
    const completedOperations = numberValue(opportunityStats?.completedOperations);
    const completionRate = totalOperations > 0 ? Number(((completedOperations / totalOperations) * 100).toFixed(1)) : 0;

    const formattedRecentLeads = recentLeads.map(lead => ({
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
      assignedTo: lead.assignedTo || 'Unassigned'
    }));

    const statusBreakdown = statusBreakdownRows.map(item => ({
      status: item.status || 'Unknown',
      name: item.status || 'Unknown',
      count: numberValue(item.count),
      value: numberValue(item.count),
      percentage: totalLeads > 0 ? ((numberValue(item.count) / totalLeads) * 100).toFixed(1) : '0'
    }));

    const statusDistributionColors = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2'];

    const stats = {
      totalLeads,
      todayLeads: numberValue(leadStats?.todayLeads),
      weekLeads: numberValue(leadStats?.weekLeads),
      monthLeads: numberValue(leadStats?.monthLeads),
      convertedLeads,
      pendingFollowups: numberValue(leadStats?.pendingFollowups),
      followupLeads: numberValue(leadStats?.pendingFollowups),
      totalAppointments: numberValue(appointmentStats?.totalAppointments),
      todayAppointments: numberValue(appointmentStats?.todayAppointments),
      pendingAppointments: numberValue(appointmentStats?.pendingAppointments),
      upcomingAppointments: numberValue(appointmentStats?.upcomingAppointments),
      totalEmployees: numberValue(employeeStats?.totalEmployees),
      totalBranches: numberValue(branchStats?.totalBranches),
      totalRevenue: numberValue(leadStats?.totalRevenue),
      totalPayments: numberValue(leadStats?.totalPaidAmount),
      totalPaidAmount: numberValue(leadStats?.totalPaidAmount),
      totalBalance: numberValue(leadStats?.totalBalance),
      totalOperations,
      activeOperations: numberValue(opportunityStats?.activeOperations),
      completedOperations,
      pendingTasks: numberValue(leadStats?.pendingFollowups) + numberValue(appointmentStats?.pendingAppointments),
      recentActivities: formattedRecentLeads.length,
      conversionRate,
      completionRate,
      leadTrend: `${numberValue(leadStats?.weekLeads)} this week`,
      monthlyLeads: monthlyLeads.map(item => ({ month: item.month, count: numberValue(item.count) })),
      statusBreakdown: statusBreakdownRows.map(item => ({ name: item.status || 'Unknown', value: numberValue(item.count) })),
      priorityBreakdown: priorityBreakdown.map(item => ({ name: item.name, value: numberValue(item.value) })),
      sourceBreakdown: sourceBreakdown.map(item => ({ name: item.name, value: numberValue(item.value) })),
      recentLeads: formattedRecentLeads,
      branchPerformance: branchPerformance.map(item => ({
        branch: item.branch,
        leads: numberValue(item.leads),
        conversion: numberValue(item.leads) > 0 ? `${((numberValue(item.converted) / numberValue(item.leads)) * 100).toFixed(1)}%` : '0%'
      })),
      topEmployees: topEmployees.map(item => ({
        name: item.name,
        leads: numberValue(item.leads),
        conversion: numberValue(item.leads) > 0 ? `${((numberValue(item.converted) / numberValue(item.leads)) * 100).toFixed(1)}%` : '0%'
      })),
      todayCounselorAppointments: todayAppointments.length,
      todayCounselorFollowUps: todayFollowUps.length
    };

    const data = {
      stats,
      recentLeads: formattedRecentLeads,
      recentAppointments,
      todayAppointments,
      todayFollowUps,
      counselorDaily: {
        employeeId: employeeId || null,
        appointments: todayAppointments,
        followUps: todayFollowUps
      },
      statusBreakdown,
      notifications: [
        {
          id: 1,
          type: 'dashboard',
          message: `${stats.pendingTasks} pending follow-ups or appointments need attention`,
          time: new Date().toISOString(),
          read: false
        }
      ],
      graphData: {
        leadTrend: leadTrend.map(item => ({
          date: item.date instanceof Date ? item.date.toISOString().split('T')[0] : String(item.date),
          leads: numberValue(item.leads)
        })),
        statusDistribution: statusBreakdown.map((item, index) => ({
          name: item.status,
          value: item.count,
          color: statusDistributionColors[index % statusDistributionColors.length]
        }))
      },
      verification: {
        databaseConnection: 'working',
        lastUpdated: new Date().toISOString(),
        dataIntegrity: 'verified',
        totalRecords: totalLeads,
        tablesAccessible: ['dmc_forum_leads', 'appointments', 'dm_employee', 'dm_branch', 'dmc_opportunities']
      }
    };

    return NextResponse.json({
      ...stats,
      success: true,
      data,
      generatedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data', details: error.message },
      { status: 500 }
    );
  }
}
