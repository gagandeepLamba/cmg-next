import { NextRequest, NextResponse } from 'next/server';
import { sequelize } from '@/lib/sequelize';
import { apiError, invalidRequest } from '@/lib/apiError';
import { QueryTypes } from 'sequelize';

const ensureAttendanceTable = () => sequelize.query(`
  CREATE TABLE IF NOT EXISTS dm_employee_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY, emp_id INT NOT NULL,
    created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    checkin INT NOT NULL DEFAULT 0, checkout INT NOT NULL DEFAULT 0,
    remarks TEXT NULL, INDEX idx_employee_attendance_presence (emp_id, created, checkin, checkout)
  )
`);

export async function GET(request: NextRequest) {
  try {
    await ensureAttendanceTable();
    const branchId = Number.parseInt(new URL(request.url).searchParams.get('branchId') || '', 10);
    if (!branchId) return invalidRequest('branchId is required');
    const employees = await sequelize.query<{
      id: number; name: string; email: string | null; present: number;
    }>(`
      SELECT e.id, e.name, e.email,
        EXISTS (
          SELECT 1 FROM dm_employee_attendance attendance
          WHERE attendance.emp_id = e.id AND DATE(attendance.created) = CURDATE()
            AND COALESCE(attendance.checkin, 0) = 1 AND COALESCE(attendance.checkout, 0) = 0
        ) AS present
      FROM dm_employee e
      WHERE e.status = 1 AND e.branch = :branchId
      ORDER BY e.name ASC`, { replacements: { branchId }, type: QueryTypes.SELECT });
    return NextResponse.json({ success: true, branchId, data: employees });
  } catch (error: unknown) {
    return apiError(error, 'Unable to load employee availability');
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureAttendanceTable();
    const body = await request.json();
    const employeeId = Number.parseInt(String(body.employeeId || body.emp_id || ''), 10);
    const present = body.present === true || body.present === 1 || body.present === 'true';
    if (!employeeId) return invalidRequest('employeeId is required');

    const rows = await sequelize.query<{ id: number }>(
      `SELECT id FROM dm_employee_attendance
       WHERE emp_id = :employeeId AND DATE(created) = CURDATE()
       ORDER BY id DESC LIMIT 1`,
      { replacements: { employeeId }, type: QueryTypes.SELECT },
    );
    if (rows[0]) {
      await sequelize.query(
        `UPDATE dm_employee_attendance
         SET checkin = :checkin, checkout = :checkout, created = COALESCE(created, NOW())
         WHERE id = :id`,
        { replacements: { id: rows[0].id, checkin: present ? 1 : 0, checkout: present ? 0 : 1 } },
      );
    } else {
      await sequelize.query(
        `INSERT INTO dm_employee_attendance (emp_id, created, checkin, checkout, remarks)
         VALUES (:employeeId, NOW(), :checkin, :checkout, 'Office presence')`,
        { replacements: { employeeId, checkin: present ? 1 : 0, checkout: present ? 0 : 1 } },
      );
    }

    return NextResponse.json({ success: true, employeeId, present });
  } catch (error: unknown) {
    return apiError(error, 'Unable to update employee presence');
  }
}
