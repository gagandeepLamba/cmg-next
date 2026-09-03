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

  const [trackedPages, coverage, sitemaps] = await Promise.all([
    sequelize.query(
      `SELECT tp.id, tp.page_url, tp.label, tp.added_at,
              c.index_status, c.coverage_state, c.last_crawl_time, c.checked_at
       FROM dm_gsc_tracked_pages tp
       LEFT JOIN dm_gsc_coverage c ON c.page_url = tp.page_url
       ORDER BY tp.added_at DESC`,
      { type: QueryTypes.SELECT }
    ),
    sequelize.query(
      `SELECT index_status, COUNT(*) AS count FROM dm_gsc_coverage GROUP BY index_status`,
      { type: QueryTypes.SELECT }
    ),
    sequelize.query(
      `SELECT sitemap_path, is_pending, is_sitemaps_index, last_submitted, last_downloaded,
              warnings, errors, submitted_url_count, checked_at
       FROM dm_gsc_sitemaps ORDER BY checked_at DESC`,
      { type: QueryTypes.SELECT }
    ),
  ]);

  return NextResponse.json({ trackedPages, coverageCounts: coverage, sitemaps });
}
