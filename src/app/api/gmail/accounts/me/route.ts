import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

/** GET current employee's Gmail connection state. */
export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  const [account] = await sequelize.query<{
    id: number; mailbox_email: string; is_enabled: number;
    last_synced_at: string | null; last_sync_status: string; last_sync_error: string | null;
    initial_backfill_completed_at: string | null; backfill_message_count: number;
  }>(
    `SELECT id, mailbox_email, is_enabled, last_synced_at, last_sync_status, last_sync_error,
            initial_backfill_completed_at, backfill_message_count
     FROM dm_gmail_accounts WHERE employee_id = :employeeId LIMIT 1`,
    { replacements: { employeeId: auth.id }, type: QueryTypes.SELECT }
  );

  return NextResponse.json({ account: account ?? null, mailboxEmail: auth.cemail || auth.email });
}

/** POST self-enable — "connecting" is just a DB flag flip, no OAuth redirect needed. */
export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  const mailboxEmail = auth.cemail || auth.email;
  if (!mailboxEmail) {
    return NextResponse.json({ error: 'No mailbox email on file for your account' }, { status: 400 });
  }

  await sequelize.query(
    `INSERT INTO dm_gmail_accounts (employee_id, mailbox_email, is_enabled, connected_at)
     VALUES (:employeeId, :mailboxEmail, 1, NOW())
     ON DUPLICATE KEY UPDATE is_enabled = 1, mailbox_email = VALUES(mailbox_email),
       connected_at = NOW(), disabled_at = NULL, disabled_reason = NULL`,
    { replacements: { employeeId: auth.id, mailboxEmail }, type: QueryTypes.INSERT }
  );

  return NextResponse.json({ success: true });
}

/** DELETE disables sync for the current employee (does not revoke Google-side access). */
export async function DELETE(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  await sequelize.query(
    `UPDATE dm_gmail_accounts SET is_enabled = 0, disabled_at = NOW(), disabled_reason = 'manual'
     WHERE employee_id = :employeeId`,
    { replacements: { employeeId: auth.id }, type: QueryTypes.UPDATE }
  );

  return NextResponse.json({ success: true });
}
