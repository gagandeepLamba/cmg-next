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

/** POST /api/admin/google-console/settings/tracked-pages — add a page to the curated coverage list. */
export async function POST(request: NextRequest) {
  const auth = requireCeo(request);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  const body = await request.json() as { page_url?: string; label?: string };
  const pageUrl = (body.page_url || '').trim();
  if (!pageUrl) {
    return NextResponse.json({ error: 'page_url is required' }, { status: 400 });
  }

  await sequelize.query(
    `INSERT IGNORE INTO dm_gsc_tracked_pages (page_url, label) VALUES (:pageUrl, :label)`,
    { replacements: { pageUrl, label: body.label ?? null }, type: QueryTypes.INSERT }
  );

  return NextResponse.json({ success: true });
}

/** DELETE /api/admin/google-console/settings/tracked-pages?id=123 */
export async function DELETE(request: NextRequest) {
  const auth = requireCeo(request);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  await sequelize.query(`DELETE FROM dm_gsc_tracked_pages WHERE id = :id`, {
    replacements: { id },
    type: QueryTypes.DELETE,
  });

  return NextResponse.json({ success: true });
}
