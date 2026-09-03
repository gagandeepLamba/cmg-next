import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';
import { isCeo } from '@/lib/roleChecks';
import { syncGtmTagsAndTriggers, syncGtmVersionHistory } from '@/lib/google/gtm-sync';

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
    const tags = await syncGtmTagsAndTriggers();
    const versions = await syncGtmVersionHistory();
    return NextResponse.json({ success: true, tags, versions });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
