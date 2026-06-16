import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';

let dbInitialized = false;

const ensureDBConnection = async () => {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
};

export async function POST(request: NextRequest) {
  try {
    await ensureDBConnection();

    const body = await request.json();
    const leadId = Number(body.leadId ?? body.lead_id ?? body.lead);
    const employeeId = Number(body.employeeId ?? body.emp ?? body.userId ?? 1);
    const remark = String(body.remark ?? body.notes ?? '').trim();
    const now = new Date();

    if (!leadId || !remark) {
      return NextResponse.json(
        { error: 'Missing required fields: leadId, remark' },
        { status: 400 }
      );
    }

    const columns = await getTableColumns('dmc_forum_leads_remarks');
    const insertColumns = ['`lead`', '`date`', 'remark', 'emp', 'created'];
    const placeholders = ['?', '?', '?', '?', '?'];
    const replacements: unknown[] = [
      leadId,
      now.toISOString().split('T')[0],
      remark,
      employeeId,
      now.toTimeString().split(' ')[0]
    ];

    if (columns.has('status')) {
      insertColumns.push('`status`');
      placeholders.push('?');
      replacements.push(1);
    }

    await sequelize.query(
      `INSERT INTO dmc_forum_leads_remarks (${insertColumns.join(', ')}) VALUES (${placeholders.join(', ')})`,
      { replacements, type: QueryTypes.INSERT }
    );

    await sequelize.query(
      `UPDATE dmc_forum_leads
       SET lead_remark = ?, last_updated = ?, last_updtd_time = ?
       WHERE id = ?`,
      {
        replacements: [remark, now.toISOString().split('T')[0], now.toTimeString().split(' ')[0], leadId],
        type: QueryTypes.UPDATE
      }
    );

    const rows = await sequelize.query<{ id: number }>(
      'SELECT id FROM dmc_forum_leads_remarks WHERE `lead` = ? AND remark = ? AND emp = ? ORDER BY id DESC LIMIT 1',
      { replacements: [leadId, remark, employeeId], type: QueryTypes.SELECT }
    );

    return NextResponse.json({
      success: true,
      remark: {
        id: Number(rows[0]?.id || 0),
        leadId,
        employeeId,
        remark,
        date: now.toISOString().split('T')[0]
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating lead remark:', error);
    return NextResponse.json(
      { error: 'Failed to create lead remark' },
      { status: 500 }
    );
  }
}

async function getTableColumns(table: string): Promise<Set<string>> {
  const rows = await sequelize.query<{ Field?: string }>(
    `SHOW COLUMNS FROM ${table}`,
    { type: QueryTypes.SELECT }
  );

  return new Set(rows.map(row => String(row.Field || '')));
}
