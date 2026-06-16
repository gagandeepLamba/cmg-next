import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';

const toPositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const ensureLeaveTables = async () => {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS dm_leave_type (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      status INT NOT NULL DEFAULT 1
    )
  `);

  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS dm_leave_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      custId INT NOT NULL,
      applyDate DATETIME NOT NULL,
      fromDate DATETIME NOT NULL,
      toDate DATETIME NOT NULL,
      type VARCHAR(255) NOT NULL,
      approvBy VARCHAR(555) NOT NULL DEFAULT '',
      requestedTo VARCHAR(255) NOT NULL DEFAULT '',
      requested_time_from TIME NULL,
      requested_time_to TIME NULL,
      remark TEXT NULL,
      status INT NOT NULL DEFAULT 1,
      file VARCHAR(50) NOT NULL DEFAULT '',
      reject VARCHAR(100) NOT NULL DEFAULT '',
      reject_remarks TEXT NULL,
      notf INT NOT NULL DEFAULT 0,
      approved_date DATETIME NULL,
      reject_date DATETIME NULL
    )
  `);
};

export async function GET(request: NextRequest) {
  try {
    await ensureLeaveTables();
    const { searchParams } = new URL(request.url);
    const page = toPositiveInt(searchParams.get('page'), 1);
    const limit = toPositiveInt(searchParams.get('limit'), 25);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';
    const offset = (page - 1) * limit;
    const conditions = [];
    const replacements: Record<string, string | number> = { limit, offset };

    if (search) {
      conditions.push('(LOWER(e.name) LIKE LOWER(:search) OR LOWER(l.type) LIKE LOWER(:search) OR CAST(l.custId AS CHAR) LIKE :search)');
      replacements.search = `%${search}%`;
    }

    if (status) {
      conditions.push('l.status = :status');
      replacements.status = Number.parseInt(status, 10);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const rows = await sequelize.query(
      `
        SELECT
          l.id,
          l.custId,
          e.name AS employeeName,
          l.applyDate,
          l.fromDate,
          l.toDate,
          l.type,
          l.approvBy,
          l.requestedTo,
          l.remark,
          l.status,
          l.approved_date AS approvedDate,
          l.reject_date AS rejectDate
        FROM dm_leave_history l
        LEFT JOIN dm_employee e ON e.id = l.custId
        ${where}
        ORDER BY l.id DESC
        LIMIT :limit OFFSET :offset
      `,
      { replacements, type: QueryTypes.SELECT }
    );

    const countRows = await sequelize.query<{ total: number }>(
      `
        SELECT COUNT(*) AS total
        FROM dm_leave_history l
        LEFT JOIN dm_employee e ON e.id = l.custId
        ${where}
      `,
      { replacements, type: QueryTypes.SELECT }
    );

    const total = Number(countRows[0]?.total || 0);

    return NextResponse.json({
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch HR leaves:', error);
    return NextResponse.json({ error: 'Failed to fetch HR leaves' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureLeaveTables();
    const body = await request.json();
    const now = new Date();

    await sequelize.query(
      `
        INSERT INTO dm_leave_history (
          custId, applyDate, fromDate, toDate, type, approvBy, requestedTo,
          requested_time_from, requested_time_to, remark, status, file, reject,
          reject_remarks, notf, approved_date, reject_date
        ) VALUES (
          :custId, :applyDate, :fromDate, :toDate, :type, :approvBy, :requestedTo,
          :requestedTimeFrom, :requestedTimeTo, :remark, :status, '', '',
          '', 0, :approvedDate, :rejectDate
        )
      `,
      {
        replacements: {
          custId: Number(body.custId),
          applyDate: body.applyDate || now,
          fromDate: body.fromDate,
          toDate: body.toDate,
          type: body.type || 'Annual Leave',
          approvBy: body.approvBy || '',
          requestedTo: body.requestedTo || '',
          requestedTimeFrom: body.requested_time_from || '00:00:00',
          requestedTimeTo: body.requested_time_to || '00:00:00',
          remark: body.remark || '',
          status: Number(body.status || 1),
          approvedDate: body.approved_date || null,
          rejectDate: body.reject_date || null,
        },
      }
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Failed to create HR leave:', error);
    return NextResponse.json({ error: 'Failed to create HR leave' }, { status: 500 });
  }
}
