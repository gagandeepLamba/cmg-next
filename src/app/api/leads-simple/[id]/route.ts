import { NextRequest, NextResponse } from 'next/server';
import { sequelize } from '@/lib/sequelize';
import { QueryTypes } from 'sequelize';

const ALLOWED_FIELDS = new Set([
  'status', 'priority', 'lead_quality', 'assignTo', 'branch', 'region',
  'appointment', 'followup', 'folowuptime', 'followupstat',
  'fname', 'mname', 'lname', 'email', 'phone', 'mobile',
  'country_interest', 'service_interest', 'market_source', 'lead_remark',
]);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);
    if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const [lead] = await sequelize.query(
      'SELECT * FROM dmc_forum_leads WHERE id = ? LIMIT 1',
      { replacements: [id], type: QueryTypes.SELECT }
    );

    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    return NextResponse.json(lead);
  } catch (error) {
    console.error('GET /api/leads-simple/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);
    if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const body = await request.json();

    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (ALLOWED_FIELDS.has(key)) updates[key] = value;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const setClauses = Object.keys(updates).map(k => `\`${k}\` = ?`).join(', ');
    const values = [...Object.values(updates), id];

    await sequelize.query(
      `UPDATE dmc_forum_leads SET ${setClauses} WHERE id = ?`,
      { replacements: values, type: QueryTypes.UPDATE }
    );

    const [updated] = await sequelize.query(
      'SELECT id, fname, lname, status, priority, lead_quality FROM dmc_forum_leads WHERE id = ? LIMIT 1',
      { replacements: [id], type: QueryTypes.SELECT }
    );

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error('PUT /api/leads-simple/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
