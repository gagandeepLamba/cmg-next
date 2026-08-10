import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';

let dbReady = false;
const ensureDB = async () => { if (!dbReady) { await connectDB(); dbReady = true; } };

// Narrow, read-only employee picker for the operations-rights panels (case
// transfer / access control target selection). Deliberately separate from
// /api/admin/employees, which requires the much broader employees.manage
// permission - Operations Managers shouldn't need full employee-CRUD access
// just to pick a transfer target.
export async function GET(request: NextRequest) {
  const auth = requireAuth(request, [
    'operations.case_transfer',
    'operations.task_reassign',
    'operations.access_control',
    'operations.manage',
  ]);
  if (isAuthError(auth)) return auth;

  await ensureDB();
  const { searchParams } = new URL(request.url);
  const search = (searchParams.get('search') || '').trim();
  if (search.length < 2) return NextResponse.json({ employees: [] });

  const rows = await sequelize.query(
    `SELECT e.id, e.name, e.email, e.status, r.name AS roleName, d.name AS departmentName
     FROM dm_employee e
     LEFT JOIN dm_role r ON r.id = e.role
     LEFT JOIN dm_department d ON d.id = e.department
     WHERE e.name LIKE :search OR e.email LIKE :search
     ORDER BY e.name ASC
     LIMIT 15`,
    { replacements: { search: `%${search}%` }, type: QueryTypes.SELECT }
  );

  return NextResponse.json({ employees: rows });
}
