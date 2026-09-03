import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/sequelize';
import { syncSearchPerformance, syncSitemaps, syncTrackedPageCoverage } from '@/lib/google/gsc-sync';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

/**
 * POST /api/cron/gsc-sync
 * Pulls Search Console search performance + sitemap status.
 *
 * Protect with CRON_SECRET header: Authorization: Bearer <CRON_SECRET>
 * Vercel Cron config (vercel.json): { "path": "/api/cron/gsc-sync", "schedule": "0 6 * * *" }
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
    const performance = await syncSearchPerformance();
    const sitemaps = await syncSitemaps();
    const coverage = await syncTrackedPageCoverage();
    console.log(`[Cron] gsc-sync: performance=${JSON.stringify(performance)} sitemaps=${JSON.stringify(sitemaps)} coverage=${JSON.stringify(coverage)}`);
    return NextResponse.json({ success: true, performance, sitemaps, coverage });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Cron] gsc-sync failed:', msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

export { POST as GET };
