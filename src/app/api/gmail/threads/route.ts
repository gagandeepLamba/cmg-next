import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

/** GET paginated thread list (one row per thread, showing its latest message) for the current employee's mailbox. */
export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  const [account] = await sequelize.query<{ id: number }>(
    `SELECT id FROM dm_gmail_accounts WHERE employee_id = :employeeId LIMIT 1`,
    { replacements: { employeeId: auth.id }, type: QueryTypes.SELECT }
  );
  if (!account) {
    return NextResponse.json({ threads: [], total: 0 });
  }

  const params = request.nextUrl.searchParams;
  const limit = Math.min(Math.max(Number(params.get('limit')) || 25, 1), 100);
  const offset = Math.max(Number(params.get('offset')) || 0, 0);

  const threads = await sequelize.query(
    `SELECT gmail_thread_id, subject, snippet, from_email, from_name, direction,
            matched_lead_id, message_timestamp, message_count
     FROM (
       SELECT gmail_thread_id, subject, snippet, from_email, from_name, direction,
              matched_lead_id, message_timestamp,
              ROW_NUMBER() OVER (PARTITION BY gmail_thread_id ORDER BY message_timestamp DESC) AS rn,
              COUNT(*) OVER (PARTITION BY gmail_thread_id) AS message_count
       FROM dm_gmail_messages
       WHERE account_id = :accountId
     ) latest
     WHERE rn = 1
     ORDER BY message_timestamp DESC
     LIMIT :limit OFFSET :offset`,
    { replacements: { accountId: account.id, limit, offset }, type: QueryTypes.SELECT }
  );

  const [countRow] = await sequelize.query<{ count: number }>(
    `SELECT COUNT(DISTINCT gmail_thread_id) AS count FROM dm_gmail_messages WHERE account_id = :accountId`,
    { replacements: { accountId: account.id }, type: QueryTypes.SELECT }
  );

  return NextResponse.json({ threads, total: Number(countRow?.count ?? 0) });
}
