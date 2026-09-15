import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';
import { refreshTokenIfNeeded, setManualToken } from '@/lib/meta/token-manager';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

/**
 * POST /api/admin/meta-leads/refresh-token
 * - No body: forces an immediate refresh of the stored token, bypassing the 10-day threshold.
 * - { pageToken, userToken?, pageId? }: emergency override — replaces the stored token outright
 *   (recovery path for when Meta fully invalidates the old one and auto-refresh can't renew it).
 */
export async function POST(request: NextRequest) {
  const auth = requireAuth(request, ['admin.access', 'marketing.manage']);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  const body = await request.json().catch(() => null) as { pageToken?: string; userToken?: string; pageId?: string } | null;

  if (body?.pageToken) {
    try {
      const status = await setManualToken({ pageToken: body.pageToken, userToken: body.userToken, pageId: body.pageId });
      return NextResponse.json({ success: true, status: 'ok', message: 'Token updated manually', tokenStatus: status });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ success: false, status: 'failed', message: msg }, { status: 400 });
    }
  }

  const result = await refreshTokenIfNeeded({ force: true });
  return NextResponse.json({ success: result.status !== 'failed', ...result });
}
