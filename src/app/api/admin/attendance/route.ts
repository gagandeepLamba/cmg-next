import { DmEmployeeAttendance } from '@/models';
import { createCrudHandlers } from '@/lib/apiCrud';
import { sequelize } from '@/lib/sequelize';

const ensureAttendanceTable = () =>
  sequelize.query(`
    CREATE TABLE IF NOT EXISTS dm_employee_attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      emp_id INT NOT NULL,
      ip_address VARCHAR(255) NULL,
      device VARCHAR(255) NULL,
      agent TEXT NULL,
      login_time DATETIME NULL,
      logout_time DATETIME NULL,
      total_hours FLOAT NULL,
      short_fall FLOAT NULL,
      remarks TEXT NULL,
      watch_by INT NULL,
      created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_by INT NOT NULL DEFAULT 1,
      checkin INT NOT NULL DEFAULT 0,
      checkout INT NOT NULL DEFAULT 0,
      logout_ip_address VARCHAR(255) NULL,
      extra_hours FLOAT NULL
    )
  `).then(() => undefined);

const handlers = createCrudHandlers({
  model: DmEmployeeAttendance,
  entityName: 'attendance record',
  searchFields: ['emp_id', 'ip_address', 'device'],
  statusFilter: (status) => {
    if (status === 'complete') return { checkin: 1, checkout: 1 };
    if (status === 'checkedin') return { checkin: 1, checkout: 0 };
    return {};
  },
  defaults: (body) => ({
    created: body.created || new Date(),
    created_by: body.created_by || 1,
  }),
  before: ensureAttendanceTable,
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
