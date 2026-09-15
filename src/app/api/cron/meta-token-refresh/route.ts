import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/sequelize';
import { refreshTokenIfNeeded } from '@/lib/meta/token-manager';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

/**
 * POST /api/cron/meta-token-refresh
 * Checks the stored Meta Page Access Token's real expiry (via Meta's
 * debug_token) and refreshes it once it's within 10 days of expiring.
 * A no-op most days — cheap enough to run daily.
 *
 * Protect with CRON_SECRET header:
 *   Authorization: Bearer <CRON_SECRET>
 *
 * Vercel Cron config (vercel.json):
 *   { "crons": [{ "path": "/api/cron/meta-token-refresh", "schedule": "0 4 * * *" }] }
 */
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Fail closed: an unset CRON_SECRET must never mean "no auth required" —
    // this endpoint can force a token rotation, so leaving it open by default
    // would let anyone on the internet trigger it.
    console.error('[Cron] meta-token-refresh: CRON_SECRET is not configured — refusing request');
    return new NextResponse('CRON_SECRET is not configured', { status: 500 });
  }
  const auth = request.headers.get('authorization') || '';
  if (auth.replace(/^Bearer\s+/i, '') !== secret) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  await ensureDB();

  const result = await refreshTokenIfNeeded({ thresholdDays: 10 });
  console.log(`[Cron] meta-token-refresh: status=${result.status} ${result.message}`);

  return NextResponse.json({ success: result.status !== 'failed', ...result });
}

// Also allow GET for simple cron triggers that only support GET
export { POST as GET };
