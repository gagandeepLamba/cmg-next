import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';
import { isCeo } from '@/lib/roleChecks';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

/** Turns a GSC property string (which may be "sc-domain:example.com" for a
 * Domain property) into a fetchable https:// URL for the health-check probe. */
function toFetchableUrl(siteUrl: string): string {
  if (siteUrl.startsWith('sc-domain:')) {
    return `https://${siteUrl.slice('sc-domain:'.length)}/`;
  }
  return siteUrl;
}

/**
 * Presence-only check: does the live site's HTML contain the configured GTM
 * container snippet? This cannot verify tags actually fire — that needs
 * GTM's Preview mode, which has no API.
 */
export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  if (!isCeo(auth)) {
    return NextResponse.json({ error: 'CEO access required' }, { status: 403 });
  }

  await ensureDB();

  const [settings] = await sequelize.query<{ site_url: string | null; gtm_container_public_id: string | null }>(
    `SELECT site_url, gtm_container_public_id FROM dm_google_settings WHERE id = 1 LIMIT 1`,
    { type: QueryTypes.SELECT }
  );

  if (!settings?.site_url) {
    return NextResponse.json({ installed: false, foundContainerId: null, error: 'No site URL configured' });
  }

  try {
    const res = await fetch(toFetchableUrl(settings.site_url), { signal: AbortSignal.timeout(15_000) });
    const html = await res.text();
    const match = html.match(/GTM-[A-Z0-9]+/);
    const foundContainerId = match?.[0] ?? null;
    const installed = !!foundContainerId && (!settings.gtm_container_public_id || foundContainerId === settings.gtm_container_public_id);
    return NextResponse.json({ installed, foundContainerId, expectedContainerId: settings.gtm_container_public_id ?? null });
  } catch (err) {
    return NextResponse.json({ installed: false, foundContainerId: null, error: err instanceof Error ? err.message : String(err) });
  }
}
