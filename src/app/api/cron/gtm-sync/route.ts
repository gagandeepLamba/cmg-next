import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/sequelize';
import { syncGtmTagsAndTriggers, syncGtmVersionHistory } from '@/lib/google/gtm-sync';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

/**
 * POST /api/cron/gtm-sync
 * Backstop sync for GTM tags/triggers/version history — the primary path is
 * the admin "Sync now" button, since GTM config only changes when someone
 * edits and publishes the container.
 *
 * Protect with CRON_SECRET header: Authorization: Bearer <CRON_SECRET>
 * Vercel Cron config (vercel.json): runs twice daily (00:00 and 12:00 UTC)
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
    const tags = await syncGtmTagsAndTriggers();
    const versions = await syncGtmVersionHistory();
    console.log(`[Cron] gtm-sync: tags=${JSON.stringify(tags)} versions=${JSON.stringify(versions)}`);
    return NextResponse.json({ success: true, tags, versions });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Cron] gtm-sync failed:', msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

export { POST as GET };
