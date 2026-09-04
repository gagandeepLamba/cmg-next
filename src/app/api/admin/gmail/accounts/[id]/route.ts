import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

/**
 * PATCH /api/admin/gmail/accounts/[id] — [id] is the EMPLOYEE id (not the
 * gmail_accounts row id), since not every employee has an account row yet.
 * Body: { action: 'enable' | 'disable' | 'resync' }
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(request, ['admin.access']);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  const { id: employeeId } = await params;
  const body = await request.json() as { action?: 'enable' | 'disable' | 'resync' };

  if (body.action === 'enable') {
    const [employee] = await sequelize.query<{ email: string | null; cemail: string | null }>(
      `SELECT email, cemail FROM dm_employee WHERE id = :employeeId LIMIT 1`,
      { replacements: { employeeId }, type: QueryTypes.SELECT }
    );
    const mailboxEmail = employee?.cemail || employee?.email;
    if (!mailboxEmail) {
      return NextResponse.json({ error: 'Employee has no email on file' }, { status: 400 });
    }
    await sequelize.query(
      `INSERT INTO dm_gmail_accounts (employee_id, mailbox_email, is_enabled, connected_at)
       VALUES (:employeeId, :mailboxEmail, 1, NOW())
       ON DUPLICATE KEY UPDATE is_enabled = 1, mailbox_email = VALUES(mailbox_email),
         connected_at = NOW(), disabled_at = NULL, disabled_reason = NULL`,
      { replacements: { employeeId, mailboxEmail }, type: QueryTypes.INSERT }
    );
  } else if (body.action === 'disable') {
    await sequelize.query(
      `UPDATE dm_gmail_accounts SET is_enabled = 0, disabled_at = NOW(), disabled_reason = 'admin_disabled'
       WHERE employee_id = :employeeId`,
      { replacements: { employeeId }, type: QueryTypes.UPDATE }
    );
  } else if (body.action === 'resync') {
    await sequelize.query(
      `UPDATE dm_gmail_accounts
       SET history_id = NULL, backfill_page_token = NULL, backfill_message_count = 0,
           initial_backfill_completed_at = NULL, last_sync_status = 'never', last_sync_error = NULL
       WHERE employee_id = :employeeId`,
      { replacements: { employeeId }, type: QueryTypes.UPDATE }
    );
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
