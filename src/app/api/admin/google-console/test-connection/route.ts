import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';
import { isCeo } from '@/lib/roleChecks';
import { testSearchConsoleConnection } from '@/lib/google/search-console-api';
import { testTagManagerConnection } from '@/lib/google/tag-manager-api';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  if (!isCeo(auth)) {
    return NextResponse.json({ error: 'CEO access required' }, { status: 403 });
  }

  await ensureDB();

  const target = request.nextUrl.searchParams.get('target');

  const [settings] = await sequelize.query<{
    site_url: string | null; gtm_account_id: string | null; gtm_container_id: string | null;
  }>(
    `SELECT site_url, gtm_account_id, gtm_container_id FROM dm_google_settings WHERE id = 1 LIMIT 1`,
    { type: QueryTypes.SELECT }
  );

  if (target === 'gtm') {
    const result = await testTagManagerConnection(settings?.gtm_account_id ?? '', settings?.gtm_container_id ?? '');
    return NextResponse.json(result);
  }

  const result = await testSearchConsoleConnection(settings?.site_url ?? '');
  return NextResponse.json(result);
}
