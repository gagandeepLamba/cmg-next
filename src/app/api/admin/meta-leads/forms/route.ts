import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

/**
 * GET /api/admin/meta-leads/forms
 * Lists forms discovered by the auto-discovery pipeline (see
 * src/lib/meta/form-registry.ts). Filter with ?status=PENDING_REVIEW to
 * surface only forms whose questions aren't fully covered by a mapping yet.
 */
export async function GET(request: NextRequest) {
  const auth = requireAuth(request, ['admin.access', 'marketing.manage']);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || '';

  const where = status ? 'WHERE mapping_status = :status' : '';

  const rows = await sequelize.query(
    `SELECT id, form_id, page_id, campaign_id, form_name, locale, meta_status,
            known_field_keys, unmapped_field_keys, mapping_status,
            discovered_at, last_seen_at, last_checked_at, reviewed_at, reviewed_by
     FROM dm_meta_forms
     ${where}
     ORDER BY (mapping_status = 'PENDING_REVIEW') DESC, discovered_at DESC`,
    { replacements: { status }, type: QueryTypes.SELECT }
  );

  return NextResponse.json({ data: rows });
}

/**
 * PATCH /api/admin/meta-leads/forms
 * Marks a discovered form reviewed (or otherwise updates its mapping
 * status), e.g. after an admin has added FORM-scoped mappings for its
 * previously-unmapped questions. Body: { form_id, mapping_status? }.
 */
export async function PATCH(request: NextRequest) {
  const auth = requireAuth(request, ['admin.access', 'marketing.manage']);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  const body = await request.json() as { form_id?: string; mapping_status?: string };
  const formId = body.form_id?.trim();
  const mappingStatus = body.mapping_status || 'ACTIVE';

  if (!formId) {
    return NextResponse.json({ error: 'form_id is required' }, { status: 400 });
  }
  if (!['ACTIVE', 'PENDING_REVIEW', 'ARCHIVED'].includes(mappingStatus)) {
    return NextResponse.json({ error: 'Invalid mapping_status' }, { status: 400 });
  }

  await sequelize.query(
    `UPDATE dm_meta_forms
     SET mapping_status = :mappingStatus, reviewed_at = NOW(), reviewed_by = :reviewedBy
     WHERE form_id = :formId`,
    {
      replacements: { mappingStatus, reviewedBy: auth.id, formId },
      type: QueryTypes.UPDATE,
    }
  );

  return NextResponse.json({ success: true });
}
