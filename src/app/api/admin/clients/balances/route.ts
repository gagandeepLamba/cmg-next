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
       c.id           AS clientId,
       c.leadId,
       COALESCE(l.payTotal, 0)   AS payTotal,
       COALESCE(l.paidYet, 0)    AS paidYet,
       COALESCE(l.payBalance, 0) AS payBalance,
       COUNT(ph.id)              AS receiptCount,
       MAX(ph.counselor_receipt) AS lastReceiptNumber,
       MAX(ph.date)              AS lastPaymentDate
     FROM dm_clients c
     LEFT JOIN dmc_forum_leads l ON l.id = c.leadId
     LEFT JOIN dm_pay_history  ph ON ph.leadId = c.leadId
     WHERE c.leadId IS NOT NULL
     GROUP BY c.id, c.leadId, l.payTotal, l.paidYet, l.payBalance`,
    { type: QueryTypes.SELECT }
  );
  return NextResponse.json({ data: rows });
  } catch (err: any) {
    console.error('[clients/balances] error:', err.message);
    return NextResponse.json({ error: err.message, data: [] }, { status: 500 });
  }
}
