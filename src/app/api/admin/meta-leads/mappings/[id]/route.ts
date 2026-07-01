import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { verifyToken } from '@/lib/auth';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

function authUser(request: NextRequest) {
  const token =
    request.cookies.get('auth-token')?.value ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  return token ? verifyToken(token) : null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cu = authUser(request);
  if (!cu) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await ensureDB();

  const { id } = await params;
  const body = await request.json() as {
    meta_field_key?: string;
    crm_field_key?: string;
    fallback_value?: string;
    transform_type?: string;
    is_enabled?: number;
    sort_order?: number;
    scope_type?: string;
    campaign_id?: string;
    form_id?: string;
  };

  const fields: string[] = [];
  const replacements: Record<string, unknown> = { id: Number(id) };

  const allowed = [
    'meta_field_key','crm_field_key','fallback_value','transform_type',
    'is_enabled','sort_order','scope_type','campaign_id','form_id',
  ] as const;

  for (const key of allowed) {
    if (key in body) {
      fields.push(`${key} = :${key}`);
      replacements[key] = (body as Record<string, unknown>)[key] ?? null;
    }
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  await sequelize.query(
    `UPDATE dm_meta_lead_mappings SET ${fields.join(', ')}, updated_at = NOW() WHERE id = :id`,
    { replacements, type: QueryTypes.UPDATE }
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cu = authUser(request);
  if (!cu) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await ensureDB();

  const { id } = await params;
  await sequelize.query(
    `DELETE FROM dm_meta_lead_mappings WHERE id = :id`,
    { replacements: { id: Number(id) }, type: QueryTypes.DELETE }
  );

  return NextResponse.json({ success: true });
}
