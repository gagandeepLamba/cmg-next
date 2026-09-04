import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/sequelize';
import { syncAllAccounts } from '@/lib/gmail/sync';

export const maxDuration = 300;

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

/**
 * POST /api/cron/gmail-sync
 * Syncs the least-recently-synced batch of enabled Gmail accounts.
 *
 * Protect with CRON_SECRET header: Authorization: Bearer <CRON_SECRET>
 * Vercel Cron config (vercel.json): runs every 10 minutes.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization') || '';
    if (auth.replace(/^Bearer\s+/i, '') !== secret) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  await ensureDB();

  try {
    const result = await syncAllAccounts();
    console.log(`[Cron] gmail-sync: ${JSON.stringify(result)}`);
    return NextResponse.json({ success: true, result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Cron] gmail-sync failed:', msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

export { POST as GET };
