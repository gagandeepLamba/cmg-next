import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';
import { isCeo } from '@/lib/roleChecks';
import { syncSearchPerformance, syncSitemaps, syncTrackedPageCoverage } from '@/lib/google/gsc-sync';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  if (!isCeo(auth)) {
    return NextResponse.json({ error: 'CEO access required' }, { status: 403 });
  }

  await ensureDB();

  try {
    const performance = await syncSearchPerformance();
    const sitemaps = await syncSitemaps();
    const coverage = await syncTrackedPageCoverage();
    return NextResponse.json({ success: true, performance, sitemaps, coverage });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
