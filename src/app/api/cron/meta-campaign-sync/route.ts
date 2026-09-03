import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/sequelize';
import { syncCampaigns } from '@/lib/meta/campaign-sync';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

/**
 * POST /api/cron/meta-campaign-sync
 * Syncs Meta campaigns into dm_meta_campaign_cache.
 *
 * Protect with CRON_SECRET header.
 * Schedule: every 6 hours (recommended).
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
    const result = await syncCampaigns();
    if (result.skipped) {
      return NextResponse.json({ skipped: true, reason: result.reason });
    }

    console.log(`[Cron] meta-campaign-sync: synced ${result.synced} campaigns`);
    return NextResponse.json({ success: true, synced: result.synced });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Cron] meta-campaign-sync failed:', msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

export { POST as GET };
