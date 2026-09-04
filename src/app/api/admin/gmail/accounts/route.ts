import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

/** GET every employee, LEFT JOINed to their Gmail account row so never-connected employees still show up. */
export async function GET(request: NextRequest) {
  const auth = requireAuth(request, ['admin.access']);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  const rows = await sequelize.query(
    `SELECT e.id AS employee_id, e.name AS employee_name, COALESCE(e.cemail, e.email) AS employee_email,
            a.id AS account_id, a.mailbox_email, a.is_enabled, a.last_synced_at,
            a.last_sync_status, a.last_sync_error, a.initial_backfill_completed_at,
            a.backfill_message_count, a.disabled_reason,
            (SELECT COUNT(*) FROM dm_gmail_messages m WHERE m.account_id = a.id) AS message_count
     FROM dm_employee e
     LEFT JOIN dm_gmail_accounts a ON a.employee_id = e.id
     WHERE e.status = 1
     ORDER BY e.name ASC`,
    { type: QueryTypes.SELECT }
  );

  return NextResponse.json({ accounts: rows });
}
