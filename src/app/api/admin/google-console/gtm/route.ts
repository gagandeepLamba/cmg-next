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

  const [tags, triggers] = await Promise.all([
    sequelize.query(
      `SELECT tag_id, name, type, status, firing_trigger_ids, last_synced_at
       FROM dm_gtm_tags_cache ORDER BY name ASC`,
      { type: QueryTypes.SELECT }
    ),
    sequelize.query(
      `SELECT trigger_id, name, type, last_synced_at
       FROM dm_gtm_triggers_cache ORDER BY name ASC`,
      { type: QueryTypes.SELECT }
    ),
  ]);

  return NextResponse.json({ tags, triggers });
}
