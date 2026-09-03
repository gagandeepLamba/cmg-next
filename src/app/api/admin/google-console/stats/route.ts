import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';
import { isCeo } from '@/lib/roleChecks';

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

  // NOTE: destructure each query per its ACTUAL shape — [[row]] only for a
  // true single-row aggregate (COUNT/SUM with no GROUP BY), plain [rows] for
  // anything that can return multiple rows. Getting this wrong silently
  // hands the client a single row object where it expects an array, which
  // crashes .map() at render time (this happened for real in the Meta stats
  // route this session — do not repeat it).
  const [
    [settings],
    [weekTotals],
    [monthTotals],
    topQueries,
    topPages,
    coverageCounts,
    [gtmCounts],
    [lastVersion],
  ] = await Promise.all([
    sequelize.query<{ is_enabled: number; site_url: string | null; last_gsc_sync_at: string | null; last_gtm_sync_at: string | null }>(
      `SELECT is_enabled, site_url, last_gsc_sync_at, last_gtm_sync_at FROM dm_google_settings WHERE id = 1 LIMIT 1`,
      { type: QueryTypes.SELECT }
    ),
    sequelize.query<{ clicks: number; impressions: number; ctr: number; position: number }>(
      `SELECT SUM(clicks) AS clicks, SUM(impressions) AS impressions,
              AVG(ctr) AS ctr, AVG(position) AS position
       FROM dm_gsc_search_performance
       WHERE report_date >= DATE_SUB(CURDATE(), INTERVAL 10 DAY)`,
      { type: QueryTypes.SELECT }
    ),
    sequelize.query<{ clicks: number; impressions: number; ctr: number; position: number }>(
      `SELECT SUM(clicks) AS clicks, SUM(impressions) AS impressions,
              AVG(ctr) AS ctr, AVG(position) AS position
       FROM dm_gsc_search_performance
       WHERE report_date >= DATE_SUB(CURDATE(), INTERVAL 31 DAY)`,
      { type: QueryTypes.SELECT }
    ),
    sequelize.query<{ query: string; clicks: number; impressions: number }>(
      `SELECT query, SUM(clicks) AS clicks, SUM(impressions) AS impressions
       FROM dm_gsc_search_performance
       WHERE query IS NOT NULL AND report_date >= DATE_SUB(CURDATE(), INTERVAL 31 DAY)
       GROUP BY query ORDER BY clicks DESC LIMIT 10`,
      { type: QueryTypes.SELECT }
    ),
    sequelize.query<{ page_url: string; clicks: number; impressions: number }>(
      `SELECT page_url, SUM(clicks) AS clicks, SUM(impressions) AS impressions
       FROM dm_gsc_search_performance
       WHERE page_url IS NOT NULL AND report_date >= DATE_SUB(CURDATE(), INTERVAL 31 DAY)
       GROUP BY page_url ORDER BY clicks DESC LIMIT 10`,
      { type: QueryTypes.SELECT }
    ),
    sequelize.query<{ index_status: string | null; count: number }>(
      `SELECT index_status, COUNT(*) AS count FROM dm_gsc_coverage GROUP BY index_status`,
      { type: QueryTypes.SELECT }
    ),
    sequelize.query<{ tags: number; triggers: number }>(
      `SELECT
         (SELECT COUNT(*) FROM dm_gtm_tags_cache) AS tags,
         (SELECT COUNT(*) FROM dm_gtm_triggers_cache) AS triggers`,
      { type: QueryTypes.SELECT }
    ),
    sequelize.query<{ version_id: string; version_name: string | null; last_synced_at: string }>(
      `SELECT version_id, version_name, last_synced_at FROM dm_gtm_version_history ORDER BY id DESC LIMIT 1`,
      { type: QueryTypes.SELECT }
    ),
  ]);

  return NextResponse.json({
    enabled: !!settings?.is_enabled,
    siteUrl: settings?.site_url ?? null,
    lastGscSyncAt: settings?.last_gsc_sync_at ?? null,
    lastGtmSyncAt: settings?.last_gtm_sync_at ?? null,
    week: {
      clicks: Number(weekTotals?.clicks ?? 0),
      impressions: Number(weekTotals?.impressions ?? 0),
      ctr: Number(weekTotals?.ctr ?? 0),
      position: Number(weekTotals?.position ?? 0),
    },
    month: {
      clicks: Number(monthTotals?.clicks ?? 0),
      impressions: Number(monthTotals?.impressions ?? 0),
      ctr: Number(monthTotals?.ctr ?? 0),
      position: Number(monthTotals?.position ?? 0),
    },
    topQueries,
    topPages,
    coverageCounts,
    gtmTagCount: Number(gtmCounts?.tags ?? 0),
    gtmTriggerCount: Number(gtmCounts?.triggers ?? 0),
    lastVersion: lastVersion ?? null,
  });
}
