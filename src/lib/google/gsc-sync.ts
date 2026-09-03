/**
 * Sync jobs for Google Search Console data. Shared by the /api/cron/gsc-sync
 * route and the admin "Sync now" button — mirrors src/lib/meta/campaign-sync.ts.
 */

import crypto from 'crypto';
import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';
import { fetchSearchAnalytics, fetchSitemaps, inspectUrl } from './search-console-api';

export type SyncResult =
  | { skipped: true; reason: string }
  | { skipped: false; synced: number };

async function getActiveSiteUrl(): Promise<string | null> {
  const [settings] = await sequelize.query<{ is_enabled: number; site_url: string | null }>(
    `SELECT is_enabled, site_url FROM dm_google_settings WHERE id = 1 LIMIT 1`,
    { type: QueryTypes.SELECT }
  );
  if (!settings?.is_enabled || !settings?.site_url) return null;
  return settings.site_url;
}

function hash(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function dateOffset(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

/** Pulls the last week of search performance, respecting GSC's ~2-3 day reporting lag. */
export async function syncSearchPerformance(): Promise<SyncResult> {
  const siteUrl = await getActiveSiteUrl();
  if (!siteUrl) return { skipped: true, reason: 'Integration disabled or site URL not configured' };

  const startDate = dateOffset(10);
  const endDate = dateOffset(3);

  const rows = await fetchSearchAnalytics(siteUrl, startDate, endDate, ['date', 'query', 'page'], 5000);

  for (const row of rows) {
    const [reportDate, query, pageUrl] = row.keys ?? [];
    await sequelize.query(
      `INSERT INTO dm_gsc_search_performance
         (report_date, query, query_hash, page_url, page_hash, device, country, clicks, impressions, ctr, position)
       VALUES
         (:reportDate, :query, :queryHash, :pageUrl, :pageHash, '', '', :clicks, :impressions, :ctr, :position)
       ON DUPLICATE KEY UPDATE
         clicks = VALUES(clicks), impressions = VALUES(impressions), ctr = VALUES(ctr),
         position = VALUES(position), updated_at = NOW()`,
      {
        replacements: {
          reportDate: reportDate ?? null,
          query: query ?? null,
          queryHash: hash(query ?? ''),
          pageUrl: pageUrl ?? null,
          pageHash: hash(pageUrl ?? ''),
          clicks: row.clicks ?? 0,
          impressions: row.impressions ?? 0,
          ctr: row.ctr ?? 0,
          position: row.position ?? 0,
        },
        type: QueryTypes.INSERT,
      }
    );
  }

  await sequelize.query(`UPDATE dm_google_settings SET last_gsc_sync_at = NOW() WHERE id = 1`, { type: QueryTypes.UPDATE });

  return { skipped: false, synced: rows.length };
}

/** Syncs sitemap submission status. */
export async function syncSitemaps(): Promise<SyncResult> {
  const siteUrl = await getActiveSiteUrl();
  if (!siteUrl) return { skipped: true, reason: 'Integration disabled or site URL not configured' };

  const sitemaps = await fetchSitemaps(siteUrl);

  for (const sm of sitemaps) {
    const totalUrls = (sm.contents ?? []).reduce((sum, c) => sum + (Number(c.submitted) || 0), 0);
    await sequelize.query(
      `INSERT INTO dm_gsc_sitemaps
         (sitemap_path, is_pending, is_sitemaps_index, last_submitted, last_downloaded,
          warnings, errors, submitted_url_count, checked_at)
       VALUES
         (:path, :isPending, :isIndex, :lastSubmitted, :lastDownloaded, :warnings, :errors, :urlCount, NOW())
       ON DUPLICATE KEY UPDATE
         is_pending = VALUES(is_pending), is_sitemaps_index = VALUES(is_sitemaps_index),
         last_submitted = VALUES(last_submitted), last_downloaded = VALUES(last_downloaded),
         warnings = VALUES(warnings), errors = VALUES(errors),
         submitted_url_count = VALUES(submitted_url_count), checked_at = NOW()`,
      {
        replacements: {
          path: sm.path,
          isPending: sm.isPending ? 1 : 0,
          isIndex: sm.isSitemapsIndex ? 1 : 0,
          lastSubmitted: sm.lastSubmitted ? new Date(sm.lastSubmitted).toISOString().slice(0, 19).replace('T', ' ') : null,
          lastDownloaded: sm.lastDownloaded ? new Date(sm.lastDownloaded).toISOString().slice(0, 19).replace('T', ' ') : null,
          warnings: Number(sm.warnings) || 0,
          errors: Number(sm.errors) || 0,
          urlCount: totalUrls,
        },
        type: QueryTypes.INSERT,
      }
    );
  }

  return { skipped: false, synced: sitemaps.length };
}

/** Runs URL Inspection against every CEO-curated tracked page. Rate-limited by Google — keep the list short. */
export async function syncTrackedPageCoverage(): Promise<SyncResult> {
  const siteUrl = await getActiveSiteUrl();
  if (!siteUrl) return { skipped: true, reason: 'Integration disabled or site URL not configured' };

  const pages = await sequelize.query<{ page_url: string }>(
    `SELECT page_url FROM dm_gsc_tracked_pages`,
    { type: QueryTypes.SELECT }
  );

  let synced = 0;
  for (const { page_url: pageUrl } of pages) {
    try {
      const result = await inspectUrl(siteUrl, pageUrl);
      const status = result.inspectionResult?.indexStatusResult;
      await sequelize.query(
        `INSERT INTO dm_gsc_coverage (page_url, index_status, coverage_state, last_crawl_time, checked_at, raw_data)
         VALUES (:pageUrl, :indexStatus, :coverageState, :lastCrawl, NOW(), :raw)
         ON DUPLICATE KEY UPDATE
           index_status = VALUES(index_status), coverage_state = VALUES(coverage_state),
           last_crawl_time = VALUES(last_crawl_time), checked_at = NOW(), raw_data = VALUES(raw_data)`,
        {
          replacements: {
            pageUrl,
            indexStatus: status?.verdict ?? null,
            coverageState: status?.coverageState ?? null,
            lastCrawl: status?.lastCrawlTime ? new Date(status.lastCrawlTime).toISOString().slice(0, 19).replace('T', ' ') : null,
            raw: JSON.stringify(result),
          },
          type: QueryTypes.INSERT,
        }
      );
      synced++;
    } catch (err) {
      console.error(`[GSC Sync] Failed to inspect ${pageUrl}:`, err instanceof Error ? err.message : err);
    }
  }

  return { skipped: false, synced };
}
