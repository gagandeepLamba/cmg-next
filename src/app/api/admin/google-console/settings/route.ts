import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';
import { isCeo } from '@/lib/roleChecks';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

function requireCeo(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  if (!isCeo(auth)) {
    return NextResponse.json({ error: 'CEO access required' }, { status: 403 });
  }
  return auth;
}

export async function GET(request: NextRequest) {
  const auth = requireCeo(request);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  const [row] = await sequelize.query<{
    id: number;
    is_enabled: number;
    site_url: string | null;
    gtm_account_id: string | null;
    gtm_container_id: string | null;
    gtm_container_public_id: string | null;
    last_gsc_sync_at: string | null;
    last_gtm_sync_at: string | null;
    updated_at: string;
  }>(
    `SELECT id, is_enabled, site_url, gtm_account_id, gtm_container_id, gtm_container_public_id,
            last_gsc_sync_at, last_gtm_sync_at, updated_at
     FROM dm_google_settings WHERE id = 1 LIMIT 1`,
    { type: QueryTypes.SELECT }
  );

  const trackedPages = await sequelize.query<{ id: number; page_url: string; label: string | null; added_at: string }>(
    `SELECT id, page_url, label, added_at FROM dm_gsc_tracked_pages ORDER BY added_at DESC`,
    { type: QueryTypes.SELECT }
  );

  return NextResponse.json({
    settings: row ?? null,
    trackedPages,
    envStatus: {
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✓ set' : '✗ missing',
      serviceAccountPrivateKey: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ? '✓ set' : '✗ missing',
    },
  });
}

export async function PUT(request: NextRequest) {
  const auth = requireCeo(request);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  const body = await request.json() as {
    is_enabled?: number;
    site_url?: string;
    gtm_account_id?: string;
    gtm_container_id?: string;
    gtm_container_public_id?: string;
  };

  await sequelize.query(
    `UPDATE dm_google_settings
     SET is_enabled = :is_enabled,
         site_url = :site_url,
         gtm_account_id = :gtm_account_id,
         gtm_container_id = :gtm_container_id,
         gtm_container_public_id = :gtm_container_public_id,
         updated_at = NOW()
     WHERE id = 1`,
    {
      replacements: {
        is_enabled: body.is_enabled ?? 0,
        site_url: body.site_url ?? null,
        gtm_account_id: body.gtm_account_id ?? null,
        gtm_container_id: body.gtm_container_id ?? null,
        gtm_container_public_id: body.gtm_container_public_id ?? null,
      },
      type: QueryTypes.UPDATE,
    }
  );

  return NextResponse.json({ success: true });
}
