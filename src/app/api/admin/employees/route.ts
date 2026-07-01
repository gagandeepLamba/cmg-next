import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { HRService } from '@/services/hr-service';

let dbReady = false;
const ensureDB = async () => { if (!dbReady) { await connectDB(); dbReady = true; } };

export async function GET(request: NextRequest) {
  try {
    await ensureDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const limit = Math.min(500, Math.max(1, Number(searchParams.get('limit') || '10')));
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';
    const status = searchParams.get('status') || '';
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const replacements: Record<string, unknown> = { limit, offset };

    if (search) {
      conditions.push('(e.name LIKE :search OR e.email LIKE :search OR e.username LIKE :search OR e.mobile LIKE :search)');
      replacements.search = `%${search}%`;
    }
    if (department) {
      conditions.push('e.department = :dept');
      replacements.dept = Number(department) || department;
    }
    if (status === 'active') { conditions.push('e.status = 1'); }
    else if (status === 'inactive') { conditions.push('e.status != 1'); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [countRow] = await sequelize.query<{ total: number }>(
      `SELECT COUNT(*) AS total FROM dm_employee e LEFT JOIN dm_department d ON d.id = e.department ${where}`,
      { replacements, type: QueryTypes.SELECT }
    );

    const [summary] = await sequelize.query<{ total: number; active: number; inactive: number }>(
      `SELECT COUNT(*) AS total,
        SUM(CASE WHEN e.status=1 THEN 1 ELSE 0 END) AS active,
        SUM(CASE WHEN e.status!=1 THEN 1 ELSE 0 END) AS inactive
       FROM dm_employee e LEFT JOIN dm_department d ON d.id = e.department ${where}`,
      { replacements, type: QueryTypes.SELECT }
    );

    const data = await sequelize.query(
      `SELECT e.id, e.name, COALESCE(e.email,'') AS email,
        COALESCE(e.mobile,'') AS mobile, e.department, d.name AS departmentName,
        e.role, e.branch, e.region, e.status, e.EID,
        COALESCE(e.work_location,'Onshore') AS work_location,
        COALESCE(e.employment_type,'Full-time') AS employment_type,
        COALESCE(e.wfh,0) AS wfh,
        CAST(e.doj AS CHAR) AS doj,
        CAST(e.dol AS CHAR) AS dol,
        CAST(e.visaExp AS CHAR) AS visaExp,
        e.nationality, e.gender, e.ppNo, e.address, e.photo
       FROM dm_employee e
       LEFT JOIN dm_department d ON d.id = e.department
       ${where}
       ORDER BY e.id DESC
       LIMIT :limit OFFSET :offset`,
      { replacements, type: QueryTypes.SELECT }
    );

    const total = Number(countRow?.total || 0);
    return NextResponse.json({
      data,
      summary: {
        total: Number(summary?.total || 0),
        active: Number(summary?.active || 0),
        inactive: Number(summary?.inactive || 0),
        missingVisaDates: 0,
        departments: 0,
      },
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error fetching employees:', msg);
    return NextResponse.json({ error: 'Failed to fetch employees', details: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const employee = await HRService.createEmployee(body);
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create employee';
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = Number.parseInt(String(body.id || ''), 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: 'Valid employee id is required' }, { status: 400 });
    }
    const employee = await HRService.updateEmployee({ ...body, id });
    if (!employee) return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    return NextResponse.json(employee);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update employee';
    console.error('Error updating employee:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number.parseInt(searchParams.get('id') || '', 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: 'Valid employee id is required' }, { status: 400 });
    }
    return NextResponse.json(await HRService.softDeleteEmployee(id));
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
