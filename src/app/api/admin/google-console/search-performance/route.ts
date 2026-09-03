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

  const params = request.nextUrl.searchParams;
  const days = Math.min(Math.max(Number(params.get('days')) || 28, 1), 90);
  const groupBy = params.get('groupBy') === 'page' ? 'page_url' : 'query';
  const limit = Math.min(Math.max(Number(params.get('limit')) || 50, 1), 200);

  const rows = await sequelize.query(
    `SELECT ${groupBy} AS \`key\`, SUM(clicks) AS clicks, SUM(impressions) AS impressions,
            AVG(ctr) AS ctr, AVG(position) AS position
     FROM dm_gsc_search_performance
     WHERE ${groupBy} IS NOT NULL AND report_date >= DATE_SUB(CURDATE(), INTERVAL :days DAY)
     GROUP BY ${groupBy}
     ORDER BY clicks DESC
     LIMIT :limit`,
    { replacements: { days, limit }, type: QueryTypes.SELECT }
  );

  return NextResponse.json({ rows, days, groupBy });
}
