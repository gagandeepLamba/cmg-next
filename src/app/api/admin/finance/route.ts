import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { verifyToken } from '@/lib/auth';

let dbReady = false;
const ensureDB = async () => { if (!dbReady) { await connectDB(); dbReady = true; } };
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
    const months = Number(searchParams.get('months') || '6');
    // Cast to number immediately so any non-numeric input becomes NaN → treated as no filter
    const branchId = Number(searchParams.get('branch') || '') || null;

    const [
      summaryRows,
      revenueByMonthRows,
      opportunityRows,
      expenseRows,
      expenseByMonthRows,
      branchRows,
      counselorRows,
      paymentMethodRows,
    ] = await Promise.all([

      // ── KPI summary ────────────────────────────────────────────────────────
      sequelize.query<{
        total_opps: number; won_opps: number;
        total_revenue: number; collected: number; balance: number;
        total_expenses: number;
      }>(
        `SELECT
          COUNT(DISTINCT o.id) AS total_opps,
          SUM(CASE WHEN o.status='won' THEN 1 ELSE 0 END) AS won_opps,
          COALESCE(SUM(l.payTotal),0) AS total_revenue,
          COALESCE(SUM(l.paidYet),0) AS collected,
          COALESCE(SUM(l.payBalance),0) AS balance,
          COALESCE((SELECT SUM(amount) FROM dm_expense WHERE DATE(date) >= DATE_SUB(NOW(),INTERVAL :months MONTH) ${branchId ? 'AND branch = :branchId' : ''}),0) AS total_expenses
        FROM dmc_opportunities o
        LEFT JOIN dmc_forum_leads l ON l.id = o.leadId
        LEFT JOIN dm_branch b ON b.id = o.branchId
        WHERE o.createdAt >= DATE_SUB(NOW(), INTERVAL :months MONTH)
        ${branchId ? 'AND o.branchId = :branchId' : ''}`,
        { replacements: { months, ...(branchId ? { branchId } : {}) }, type: QueryTypes.SELECT }
      ),

      // ── Revenue by month ───────────────────────────────────────────────────
      sequelize.query<{ month: string; revenue: number; collected: number }>(
        `SELECT
          DATE_FORMAT(ph.date,'%Y-%m') AS month,
          COALESCE(SUM(ph.amount),0) AS collected,
          0 AS revenue
        FROM dm_pay_history ph
        ${branchId ? 'JOIN dmc_forum_leads l2 ON l2.id=ph.leadId AND l2.branch = :branchId' : ''}
        WHERE ph.date >= DATE_SUB(NOW(), INTERVAL :months MONTH)
          AND (ph.status IS NULL OR ph.status NOT IN ('cancelled','refund'))
        GROUP BY month
        ORDER BY month ASC`,
        { replacements: { months, ...(branchId ? { branchId } : {}) }, type: QueryTypes.SELECT }
      ),

      // ── Recent opportunities (revenue) ─────────────────────────────────────
      sequelize.query<{
        id: number; opportunityName: string; lead_name: string;
        counselor: string; branch: string; status: string;
        total_fee: number; paid: number; balance: number;
        service: string; created: string;
      }>(
        `SELECT
          o.id, o.opportunityName,
          CONCAT(COALESCE(l.fname,''),' ',COALESCE(l.lname,'')) AS lead_name,
          COALESCE(e.name,'Unassigned') AS counselor,
          COALESCE(b.name,'N/A') AS branch,
          o.status,
          COALESCE(l.payTotal,0) AS total_fee,
          COALESCE(l.paidYet,0) AS paid,
          COALESCE(l.payBalance,0) AS balance,
          COALESCE(o.serviceRequired,'') AS service,
          DATE_FORMAT(o.createdAt,'%Y-%m-%d') AS created
        FROM dmc_opportunities o
        LEFT JOIN dmc_forum_leads l ON l.id = o.leadId
        LEFT JOIN dm_employee e ON e.id = o.assignedTo
        LEFT JOIN dm_branch b ON b.id = o.branchId
        WHERE o.createdAt >= DATE_SUB(NOW(), INTERVAL :months MONTH)
        ${branchId ? 'AND o.branchId = :branchId' : ''}
        ORDER BY o.id DESC
        LIMIT 100`,
        { replacements: { months, ...(branchId ? { branchId } : {}) }, type: QueryTypes.SELECT }
      ),

      // ── Recent expenses ────────────────────────────────────────────────────
      sequelize.query<{
        id: number; date: string; particular: string; amount: number;
        vat: number; branch_name: string; expense_type: number;
        transaction_type: string; is_approval: number; mgmt_approval: number;
      }>(
        `SELECT
          exp.id,
          DATE_FORMAT(exp.date,'%Y-%m-%d') AS date,
          exp.particular, exp.amount, COALESCE(exp.vat,0) AS vat,
          COALESCE(b.name,'N/A') AS branch_name,
          COALESCE(exp.expense_type,0) AS expense_type,
          COALESCE(exp.transaction_type,'') AS transaction_type,
          COALESCE(exp.is_approval,0) AS is_approval,
          COALESCE(exp.mgmt_approval,0) AS mgmt_approval
        FROM dm_expense exp
        LEFT JOIN dm_branch b ON b.id = exp.branch
        WHERE exp.date >= DATE_SUB(NOW(), INTERVAL :months MONTH)
        ${branchId ? 'AND exp.branch = :branchId' : ''}
        ORDER BY exp.date DESC
        LIMIT 200`,
        { replacements: { months, ...(branchId ? { branchId } : {}) }, type: QueryTypes.SELECT }
      ),

      // ── Expenses by month ──────────────────────────────────────────────────
      sequelize.query<{ month: string; amount: number; vat: number }>(
        `SELECT
          DATE_FORMAT(date,'%Y-%m') AS month,
          COALESCE(SUM(amount),0) AS amount,
          COALESCE(SUM(vat),0) AS vat
        FROM dm_expense
        WHERE date >= DATE_SUB(NOW(), INTERVAL :months MONTH)
        ${branchId ? 'AND branch = :branchId' : ''}
        GROUP BY month
        ORDER BY month ASC`,
        { replacements: { months, ...(branchId ? { branchId } : {}) }, type: QueryTypes.SELECT }
      ),

      // ── Branch performance ─────────────────────────────────────────────────
      sequelize.query<{ id: number; name: string; revenue: number; collected: number; opps: number }>(
        `SELECT
          b.id, b.name,
          COALESCE(SUM(l.payTotal),0) AS revenue,
          COALESCE(SUM(l.paidYet),0) AS collected,
          COUNT(o.id) AS opps
        FROM dm_branch b
        LEFT JOIN dmc_opportunities o ON o.branchId=b.id AND o.createdAt >= DATE_SUB(NOW(),INTERVAL :months MONTH)
        LEFT JOIN dmc_forum_leads l ON l.id=o.leadId
        WHERE b.status=1
        GROUP BY b.id, b.name
        ORDER BY collected DESC`,
        { replacements: { months }, type: QueryTypes.SELECT }
      ),

      // ── Top counselors by revenue ──────────────────────────────────────────
      sequelize.query<{ id: number; name: string; branch: string; opps: number; collected: number }>(
        `SELECT
          e.id, e.name,
          COALESCE(b.name,'N/A') AS branch,
          COUNT(o.id) AS opps,
          COALESCE(SUM(l.paidYet),0) AS collected
        FROM dm_employee e
        LEFT JOIN dm_branch b ON b.id=e.branch
        LEFT JOIN dmc_opportunities o ON o.assignedTo=e.id AND o.createdAt >= DATE_SUB(NOW(),INTERVAL :months MONTH)
        LEFT JOIN dmc_forum_leads l ON l.id=o.leadId
        WHERE e.status=1
        GROUP BY e.id, e.name, b.name
        HAVING opps > 0 OR collected > 0
        ORDER BY collected DESC
        LIMIT 15`,
        { replacements: { months }, type: QueryTypes.SELECT }
      ),

      // ── Payment methods ────────────────────────────────────────────────────
      sequelize.query<{ method: string; count: number; total: number }>(
        `SELECT
          COALESCE(payMethod,'Unknown') AS method,
          COUNT(*) AS count,
          COALESCE(SUM(amount),0) AS total
        FROM dm_3party_payment
        WHERE receipt_date >= DATE_SUB(NOW(), INTERVAL :months MONTH)
        GROUP BY method
        ORDER BY total DESC`,
        { replacements: { months }, type: QueryTypes.SELECT }
      ),
    ]);

    const s = summaryRows[0] || {};

    // Merge revenue and expense month data
    const allMonths = new Set([
      ...revenueByMonthRows.map(r => r.month),
      ...expenseByMonthRows.map(r => r.month),
    ]);
    const monthlyTrend = Array.from(allMonths).sort().map(month => {
      const rev = revenueByMonthRows.find(r => r.month === month);
      const exp = expenseByMonthRows.find(r => r.month === month);
      return {
        month,
        collected: n(rev?.collected),
        expenses: n(exp?.amount) + n(exp?.vat),
        profit: n(rev?.collected) - (n(exp?.amount) + n(exp?.vat)),
      };
    });

    return NextResponse.json({
      summary: {
        totalOpportunities: n(s.total_opps),
        wonOpportunities: n(s.won_opps),
        totalRevenue: n(s.total_revenue),
        collected: n(s.collected),
        balance: n(s.balance),
        totalExpenses: n(s.total_expenses),
        netProfit: n(s.collected) - n(s.total_expenses),
        collectionRate: n(s.total_revenue) > 0
          ? parseFloat(((n(s.collected) / n(s.total_revenue)) * 100).toFixed(1))
          : 0,
      },
      monthlyTrend,
      opportunities: opportunityRows.map(r => ({
        id: r.id,
        name: r.opportunityName,
        client: r.lead_name.trim() || `Opp #${r.id}`,
        counselor: r.counselor,
        branch: r.branch,
        status: r.status,
        totalFee: n(r.total_fee),
        paid: n(r.paid),
        balance: n(r.balance),
        service: r.service,
        date: r.created,
      })),
      expenses: expenseRows.map(r => ({
        id: r.id,
        date: r.date,
        description: r.particular,
        amount: n(r.amount),
        vat: n(r.vat),
        total: n(r.amount) + n(r.vat),
        branch: r.branch_name,
        type: r.transaction_type || 'General',
        approved: r.is_approval === 1 && r.mgmt_approval === 1,
      })),
      branchPerformance: branchRows.map(r => ({
        id: r.id,
        name: r.name,
        revenue: n(r.revenue),
        collected: n(r.collected),
        opportunities: n(r.opps),
      })),
      counselorPerformance: counselorRows.map(r => ({
        id: r.id,
        name: r.name,
        branch: r.branch,
        opportunities: n(r.opps),
        collected: n(r.collected),
      })),
      paymentMethods: paymentMethodRows.map(r => ({
        method: r.method,
        count: n(r.count),
        total: n(r.total),
      })),
    });
  } catch (error: any) {
    console.error('[finance] error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
