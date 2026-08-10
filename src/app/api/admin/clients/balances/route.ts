import { NextRequest, NextResponse } from 'next/server';
import { sequelize, connectDB } from '@/lib/sequelize';
import { QueryTypes } from 'sequelize';
import { verifyToken } from '@/lib/auth';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

export async function GET(request: NextRequest) {
  const token =
    request.cookies.get('auth-token')?.value ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await ensureDB();

  try {
  // Keyed the same way as GET /api/admin/clients: a "client" is a lead whose
  // workflow review has both finance and compliance verification approved
  // (dm_opportunity_workflow_reviews), not the unpopulated dm_clients table.
  const rows = await sequelize.query<{
    clientId: number;
    leadId: number;
    payTotal: number;
    paidYet: number;
    payBalance: number;
    receiptCount: number;
    lastReceiptNumber: string;
    lastPaymentDate: string;
  }>(
    `SELECT
       w.id                      AS clientId,
       w.lead_id                 AS leadId,
       COALESCE(l.payTotal, 0)   AS payTotal,
       COALESCE(l.paidYet, 0)    AS paidYet,
       COALESCE(l.payBalance, 0) AS payBalance,
       COUNT(ph.id)              AS receiptCount,
       MAX(ph.counselor_receipt) AS lastReceiptNumber,
       MAX(ph.date)              AS lastPaymentDate
     FROM dm_opportunity_workflow_reviews w
     INNER JOIN (
       SELECT lead_id, MAX(id) AS maxId
       FROM dm_opportunity_workflow_reviews
       WHERE finance_status = 'approved' AND compliance_status = 'approved'
       GROUP BY lead_id
     ) latest ON latest.maxId = w.id
     JOIN dmc_forum_leads l ON l.id = w.lead_id
     LEFT JOIN dm_pay_history ph ON ph.leadId = w.lead_id
     WHERE w.finance_status = 'approved' AND w.compliance_status = 'approved'
     GROUP BY w.id, w.lead_id, l.payTotal, l.paidYet, l.payBalance`,
    { type: QueryTypes.SELECT }
  );
  return NextResponse.json({ data: rows });
  } catch (err: any) {
    console.error('[clients/balances] error:', err.message);
    return NextResponse.json({ error: err.message, data: [] }, { status: 500 });
  }
}
