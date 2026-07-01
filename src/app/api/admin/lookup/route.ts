import { NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';

export async function GET() {
  try {
    const [programs, countries, programTypes, branches] = await Promise.all([
      sequelize.query<{ id: number; name: string }>(
        `SELECT id, name FROM dm_service WHERE status = 1 ORDER BY name ASC`,
        { type: QueryTypes.SELECT }
      ),
      sequelize.query<{ id: number; name: string }>(
        `SELECT id, name FROM dm_country_proces WHERE status = 1 ORDER BY name ASC`,
        { type: QueryTypes.SELECT }
      ),
      sequelize.query<{ id: number; name: string }>(
        `SELECT id, type AS name FROM dm_program_type WHERE status = 1 ORDER BY type ASC`,
        { type: QueryTypes.SELECT }
      ),
      sequelize.query<{ id: number; name: string }>(
        `SELECT id, name FROM dm_branch WHERE status = 1 ORDER BY name ASC`,
        { type: QueryTypes.SELECT }
      ),
    ]);

    return NextResponse.json({ programs, countries, programTypes, branches });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to fetch lookup data', details: msg }, { status: 500 });
  }
}
