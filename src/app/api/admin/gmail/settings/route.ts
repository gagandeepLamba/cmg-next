import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

export async function GET(request: NextRequest) {
  const auth = requireAuth(request, ['admin.access']);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  const [row] = await sequelize.query<{
    is_enabled: number; backfill_days: number; backfill_message_cap: number;
    employees_per_sync_tick: number; last_cron_run_at: string | null;
  }>(
    `SELECT is_enabled, backfill_days, backfill_message_cap, employees_per_sync_tick, last_cron_run_at
     FROM dm_gmail_settings WHERE id = 1 LIMIT 1`,
    { type: QueryTypes.SELECT }
  );

  return NextResponse.json({
    settings: row ?? null,
    envStatus: {
      serviceAccountEmail: process.env.GMAIL_SERVICE_ACCOUNT_EMAIL ? '✓ set' : '✗ missing',
      serviceAccountPrivateKey: process.env.GMAIL_SERVICE_ACCOUNT_PRIVATE_KEY ? '✓ set' : '✗ missing',
    },
  });
}

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request, ['admin.access']);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  const body = await request.json() as {
    is_enabled?: number; backfill_days?: number; backfill_message_cap?: number; employees_per_sync_tick?: number;
  };

  await sequelize.query(
    `UPDATE dm_gmail_settings
     SET is_enabled = :is_enabled, backfill_days = :backfill_days,
         backfill_message_cap = :backfill_message_cap, employees_per_sync_tick = :employees_per_sync_tick,
         updated_at = NOW()
     WHERE id = 1`,
    {
      replacements: {
        is_enabled: body.is_enabled ?? 0,
        backfill_days: body.backfill_days ?? 90,
        backfill_message_cap: body.backfill_message_cap ?? 1000,
        employees_per_sync_tick: body.employees_per_sync_tick ?? 20,
      },
      type: QueryTypes.UPDATE,
    }
  );

  return NextResponse.json({ success: true });
}
