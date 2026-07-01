import { NextRequest, NextResponse } from 'next/server';
import { sequelize, connectDB } from '@/lib/sequelize';
import { QueryTypes } from 'sequelize';
import { verifyToken } from '@/lib/auth';

let dbInitialized = false;
const ensureDB = async () => { if (!dbInitialized) { await connectDB(); dbInitialized = true; } };

export async function GET(request: NextRequest) {
  try {
    await ensureDB();
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get('tab') || 'invoices';
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    const branch = searchParams.get('branch') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const authorization = request.headers.get('authorization');
    const token = request.cookies.get('auth-token')?.value || authorization?.replace(/^Bearer\s+/i, '');
    const currentUser = token ? verifyToken(token) : null;
    const role = String(currentUser?.type || '').toLowerCase().replace(/[\s-]+/g, '_');
    const canViewAll = currentUser?.role === 1 || ['admin', 'administrator', 'super_admin', 'director_of_sales', 'director', 'dos'].includes(role);
    const isBranchManager = ['branch_manager', 'bm'].includes(role) && !canViewAll;

    if (tab === 'stats') {
      return await getStats(dateFrom, dateTo, branch, canViewAll, isBranchManager, currentUser);
    }
    if (tab === 'payments') {
      return await getPayments(search, status, dateFrom, dateTo, branch, page, limit, canViewAll, isBranchManager, currentUser);
    }
    return await getInvoices(search, status, dateFrom, dateTo, branch, page, limit, canViewAll, isBranchManager, currentUser);
  } catch (error) {
    console.error('Error in invoices-payments API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getStats(dateFrom: string, dateTo: string, branch: string, canViewAll: boolean, isBranchManager: boolean, currentUser: any) {
  const conditions: string[] = [];
  const replacements: Record<string, any> = {};

  if (dateFrom) { conditions.push('p.createdAt >= :dateFrom'); replacements.dateFrom = dateFrom; }
  if (dateTo) { conditions.push('p.createdAt <= :dateTo'); replacements.dateTo = `${dateTo} 23:59:59`; }
  if (branch) { conditions.push('p.branchName = :branch'); replacements.branch = branch; }
  if (isBranchManager && currentUser?.branch) {
    conditions.push('(p.branchId = :userBranch OR p.branchId IS NULL)');
    replacements.userBranch = currentUser.branch;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [paymentStats] = await sequelize.query<any>(`
    SELECT
      COUNT(*) AS totalPayments,
      COALESCE(SUM(p.paidAmount), 0) AS totalCollected,
      COALESCE(SUM(p.remainingBalance), 0) AS totalOutstanding,
      COALESCE(SUM(p.totalAmount), 0) AS totalPackageValue,
      COUNT(CASE WHEN p.status = 'completed' OR p.status = 'paid' THEN 1 END) AS completedPayments,
      COUNT(CASE WHEN p.status = 'pending' THEN 1 END) AS pendingPayments
    FROM dm_opportunity_payments p
    ${where}
  `, { replacements, type: QueryTypes.SELECT });

  const [invoiceStats] = await sequelize.query<any>(`
    SELECT
      COUNT(*) AS totalInvoices,
      COALESCE(SUM(i.totPayAmt), 0) AS totalInvoiceAmount,
      COALESCE(SUM(i.payBalance), 0) AS totalInvoiceBalance,
      COALESCE(SUM(i.amount), 0) AS totalReceived
    FROM dm_b2b_invoices i
    LEFT JOIN dmc_opportunity_payments p ON i.receipt = p.paymentNumber
    ${where}
  `, { replacements, type: QueryTypes.SELECT });

  const branchBreakdown = await sequelize.query<any>(`
    SELECT
      p.branchName AS branch,
      COUNT(*) AS payments,
      COALESCE(SUM(p.paidAmount), 0) AS collected,
      COALESCE(SUM(p.remainingBalance), 0) AS outstanding
    FROM dm_opportunity_payments p
    ${where}
    GROUP BY p.branchName
    ORDER BY collected DESC
  `, { replacements, type: QueryTypes.SELECT });

  const monthlyTrend = await sequelize.query<any>(`
    SELECT
      DATE_FORMAT(p.createdAt, '%Y-%m') AS month,
      COUNT(*) AS payments,
      COALESCE(SUM(p.paidAmount), 0) AS collected
    FROM dm_opportunity_payments p
    ${where}
    GROUP BY DATE_FORMAT(p.createdAt, '%Y-%m')
    ORDER BY month DESC
    LIMIT 12
  `, { replacements, type: QueryTypes.SELECT });

  return NextResponse.json({
    data: {
      payments: paymentStats || {},
      invoices: invoiceStats || {},
      branchBreakdown,
      monthlyTrend
    }
  });
}

async function getPayments(search: string, status: string, dateFrom: string, dateTo: string, branch: string, page: number, limit: number, canViewAll: boolean, isBranchManager: boolean, currentUser: any) {
  const conditions: string[] = [];
  const replacements: Record<string, any> = {};

  if (search) {
    conditions.push(`(p.clientName LIKE :search OR p.paymentNumber LIKE :search OR p.transactionId LIKE :search OR p.clientEmail LIKE :search OR p.clientPhone LIKE :search)`);
    replacements.search = `%${search}%`;
  }
  if (status) { conditions.push('p.status = :status'); replacements.status = status; }
  if (dateFrom) { conditions.push('p.createdAt >= :dateFrom'); replacements.dateFrom = dateFrom; }
  if (dateTo) { conditions.push('p.createdAt <= :dateTo'); replacements.dateTo = `${dateTo} 23:59:59`; }
  if (branch) { conditions.push('p.branchName = :branch'); replacements.branch = branch; }
  if (isBranchManager && currentUser?.branch) {
    conditions.push('(p.branchId = :userBranch OR p.branchId IS NULL)');
    replacements.userBranch = currentUser.branch;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [countResult] = await sequelize.query<any>(`
    SELECT COUNT(*) AS total FROM dm_opportunity_payments p ${where}
  `, { replacements, type: QueryTypes.SELECT });

  const total = Number(countResult?.total || 0);

  const payments = await sequelize.query<any>(`
    SELECT
      p.*,
      l.fname, l.lname, l.phone, l.email,
      o.opportunityName, o.estimatedValue,
      e.name AS counselorName,
      ae.name AS accountantName
    FROM dm_opportunity_payments p
    LEFT JOIN dmc_forum_leads l ON p.leadId = l.id
    LEFT JOIN dmc_opportunities o ON p.opportunityId = o.id
    LEFT JOIN dm_employee e ON o.assignedTo = e.id
    LEFT JOIN dm_employee ae ON p.accountantId = ae.id
    ${where}
    ORDER BY p.createdAt DESC
    LIMIT :limit OFFSET :offset
  `, { replacements: { ...replacements, limit, offset: (page - 1) * limit }, type: QueryTypes.SELECT });

  return NextResponse.json({
    data: payments,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
}

async function getInvoices(search: string, status: string, dateFrom: string, dateTo: string, branch: string, page: number, limit: number, canViewAll: boolean, isBranchManager: boolean, currentUser: any) {
  const conditions: string[] = [];
  const replacements: Record<string, any> = {};

  if (search) {
    conditions.push(`(i.receipt LIKE :search OR i.company LIKE :search OR i.purpose LIKE :search)`);
    replacements.search = `%${search}%`;
  }
  if (status) { conditions.push('i.status = :status'); replacements.status = Number(status); }
  if (dateFrom) { conditions.push('i.created >= :dateFrom'); replacements.dateFrom = dateFrom; }
  if (dateTo) { conditions.push('i.created <= :dateTo'); replacements.dateTo = `${dateTo} 23:59:59`; }
  if (branch) { conditions.push('i.branch = :branch'); replacements.branch = Number(branch); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [countResult] = await sequelize.query<any>(`
    SELECT COUNT(*) AS total FROM dm_b2b_invoices i ${where}
  `, { replacements, type: QueryTypes.SELECT });

  const total = Number(countResult?.total || 0);

  const invoices = await sequelize.query<any>(`
    SELECT
      i.*,
      b.name AS branchName,
      e.name AS counselorName,
      p.paymentNumber, p.paidAmount, p.proofOfPaymentUrl, p.paymentMethod, p.paymentDate,
      p.clientName AS oppClientName, p.clientEmail AS oppClientEmail, p.clientPhone AS oppClientPhone,
      p.serviceName, p.receiptUrl, p.currency
    FROM dm_b2b_invoices i
    LEFT JOIN dm_branch b ON i.branch = b.id
    LEFT JOIN dm_employee e ON i.Counsilor = e.id
    LEFT JOIN dm_opportunity_payments p ON i.receipt = p.paymentNumber
    ${where}
    ORDER BY i.created DESC
    LIMIT :limit OFFSET :offset
  `, { replacements: { ...replacements, limit, offset: (page - 1) * limit }, type: QueryTypes.SELECT });

  return NextResponse.json({
    data: invoices,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
}
