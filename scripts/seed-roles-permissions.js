const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/dmconsultant_mydmcons_dm';
const parsedUrl = new URL(databaseUrl);
const database = parsedUrl.pathname.replace(/^\//, '');

const baseConfig = {
  host: parsedUrl.hostname || 'localhost',
  port: Number(parsedUrl.port || 3306),
  user: decodeURIComponent(parsedUrl.username || 'root'),
  password: decodeURIComponent(parsedUrl.password || ''),
  multipleStatements: false,
};

const adminPermissions = [
  'all',
  'admin.access',
  'sales.view',
  'sales.create',
  'sales.update',
  'sales.delete',
  'operations.view',
  'operations.create',
  'operations.update',
  'operations.delete',
  'operations.manage',
  'reports.view',
  'reports.create',
  'reports.update',
  'reports.delete',
  'leads.view',
  'leads.create',
  'leads.update',
  'leads.delete',
  'analytics.view',
  'appointments.view',
  'appointments.manage',
  'documents.view',
  'documents.create',
  'documents.update',
  'documents.delete',
  'payments.view',
  'payments.create',
  'payments.update',
  'payments.delete',
  'invoices.view',
  'invoices.create',
  'invoices.update',
  'invoices.delete',
  'agreements.view',
  'agreements.create',
  'agreements.update',
  'agreements.delete',
  'clients.view',
  'clients.create',
  'clients.update',
  'clients.delete',
  'counselors.manage',
  'employees.manage',
  'branches.manage',
  'departments.manage',
  'attendance.manage',
  'programs.manage',
  'fees.manage',
  'currency.manage',
  'countries.manage',
  'roles.manage',
  'marketing.manage',
  'campaigns.manage',
  'templates.manage',
  'b2b.manage',
  'employers.manage',
  'transfers.manage',
  'recognition.manage',
  'monitoring.view',
  'settings.manage',
  'hr.dashboard',
  'hr.view',
  'hr.create',
  'hr.update',
  'hr.delete',
  'hr.config',
  'hr.payroll',
  'hr.eosb',
  'pro.dashboard',
  'pro.view',
  'pro.create',
  'pro.update',
  'pro.delete',
  'pro.config',
  'pro.wps.view',
  'pro.owners.restricted',
  'hr.self',
  'hr.team.attendance_leave',
  'finance.view',
  'finance.manage',
  'fees.view',
];

// Full sales-workflow access: leads, clients, appointments, documents,
// payments, invoices, agreements, reports — everything under the Sales module.
const salesModulePermissions = [
  'sales.view', 'sales.create', 'sales.update',
  'leads.view', 'leads.create', 'leads.update', 'leads.delete',
  'clients.view', 'clients.create', 'clients.update',
  'appointments.view', 'appointments.manage',
  'documents.view', 'documents.create', 'documents.update',
  'payments.view', 'payments.create',
  'invoices.view', 'invoices.create',
  'agreements.view', 'agreements.create',
  'reports.view',
  'fees.view',
];

const branchManagerPermissions = [
  ...salesModulePermissions,
  'sales.delete',
  'counselors.manage',
];

// Regional Manager: same module access as Branch Manager, scoped by region
// instead of branch at query time.
const regionalManagerPermissions = [...branchManagerPermissions];

// Individual-contributor tier: own leads/meetings/agreements only, read-only
// Operations visibility, and no receipts/invoice access.
const counsellorPermissions = [
  'sales.view', 'sales.create', 'sales.update',
  'leads.view', 'leads.create', 'leads.update',
  'clients.view', 'clients.create', 'clients.update',
  'appointments.view', 'appointments.manage',
  'documents.view', 'documents.create', 'documents.update',
  'agreements.view', 'agreements.create',
  'operations.view',
  'reports.view',
  'fees.view',
];

// Director of Sales / Assistant Director of Sales: full company-wide sales +
// operations + reporting authority, but no user/role/system administration,
// no fee-plan editing, and no destructive delete/void/refund actions.
const directorOfSalesPermissions = [
  'sales.view', 'sales.create', 'sales.update',
  'leads.view', 'leads.create', 'leads.update',
  'clients.view', 'clients.create', 'clients.update', 'clients.delete',
  'appointments.view', 'appointments.manage',
  'documents.view', 'documents.create', 'documents.update', 'documents.delete',
  'payments.view', 'payments.create', 'payments.update',
  'invoices.view', 'invoices.create', 'invoices.update',
  'agreements.view', 'agreements.create', 'agreements.update',
  'reports.view', 'reports.create',
  'analytics.view',
  'operations.view', 'operations.create', 'operations.update', 'operations.manage',
  'counselors.manage',
  'transfers.manage',
  'recognition.manage',
  'monitoring.view',
  'fees.view',
];

const hrModulePermissions = [
  'hr.dashboard', 'hr.view', 'hr.create', 'hr.update', 'hr.delete',
  'hr.config', 'hr.payroll', 'hr.eosb',
];

const proModulePermissions = [
  'pro.dashboard', 'pro.view', 'pro.create', 'pro.update', 'pro.delete',
  'pro.config', 'pro.wps.view', 'pro.owners.restricted',
];

// Front-desk role: can log new leads and assign/reassign them to a counsellor,
// but has no visibility into the rest of the Sales module (clients, payments, etc).
const receptionistPermissions = ['leads.view', 'leads.create', 'leads.update'];

// Front Office Executive: assigns leads, creates balance receipts, and confirms meetings.
const foePermissions = ['leads.view', 'leads.create', 'leads.update', 'payments.view', 'payments.create', 'appointments.view', 'appointments.manage'];

const roleSeeds = [
  { name: 'Super Admin', type: 'super_admin', hierarchy: 1, departmentId: 1, permissions: adminPermissions },
  { name: 'Founder', type: 'founder', hierarchy: 5, departmentId: 1, permissions: adminPermissions },
  // CEO reuses the 'director' type so it automatically inherits every hardcoded
  // "full access" role check across the app (leads, analytics, dashboards, etc.)
  { name: 'CEO', type: 'director', hierarchy: 8, departmentId: 1, permissions: adminPermissions },
  { name: 'Director', type: 'director', hierarchy: 10, departmentId: 1, permissions: adminPermissions },
  // Company-wide sales/operations authority, but NOT user/system administration
  // (no employees.manage, roles.manage, settings.manage, fees.manage, etc).
  { name: 'Director of Sales', type: 'director_of_sales', hierarchy: 10, departmentId: 1, permissions: directorOfSalesPermissions },
  // Assistant Director of Sales reuses the 'director_of_sales' type so it
  // automatically inherits the same company-wide data-visibility checks as
  // Director of Sales, with the identical (non-admin) permission grant.
  { name: 'Assistant Director of Sales', type: 'director_of_sales', hierarchy: 11, departmentId: 1, permissions: directorOfSalesPermissions },
  { name: 'Regional Manager', type: 'regional_manager', hierarchy: 15, departmentId: 1, permissions: regionalManagerPermissions },
  { name: 'Branch Manager', type: 'branch_manager', hierarchy: 20, departmentId: 1, permissions: branchManagerPermissions },
  // Full, unrestricted view of the whole Operations module.
  { name: 'Director of Operations', type: 'director_of_operations', hierarchy: 25, departmentId: 1, permissions: ['operations.view', 'operations.create', 'operations.update', 'operations.manage', 'operations.delete'] },
  { name: 'Accountant', type: 'accountant', hierarchy: 30, departmentId: 1, permissions: [...salesModulePermissions, 'finance.view', 'finance.manage'] },
  { name: 'HR', type: 'hr', hierarchy: 30, departmentId: 1, permissions: hrModulePermissions },
  { name: 'PRO', type: 'pro', hierarchy: 30, departmentId: 1, permissions: proModulePermissions },
  { name: 'Operations', type: 'operations', hierarchy: 40, departmentId: 1, permissions: ['operations.view', 'operations.create', 'operations.update', 'operations.manage'] },
  { name: 'Sales', type: 'sales', hierarchy: 40, departmentId: 1, permissions: counsellorPermissions },
  { name: 'Counsellor', type: 'counsellor', hierarchy: 45, departmentId: 1, permissions: counsellorPermissions },
  // Sees Operations, scoped at query time to cases where they are the case_officer.
  { name: 'Process Coordinator', type: 'process_coordinator', hierarchy: 46, departmentId: 1, permissions: ['operations.view', 'operations.update'] },
  { name: 'Receptionist', type: 'receptionist', hierarchy: 50, departmentId: 1, permissions: receptionistPermissions },
  { name: 'FOE', type: 'foe', hierarchy: 50, departmentId: 1, permissions: foePermissions },
];

const titleCase = (value) => value
  .replace(/[._-]+/g, ' ')
  .replace(/\b\w/g, (char) => char.toUpperCase());

const permissionMeta = (permissionKey) => {
  if (permissionKey === 'all') {
    return { module: 'system', action: 'all', label: 'All Permissions' };
  }

  const [module, ...actionParts] = permissionKey.split('.');
  return {
    module,
    action: actionParts.join('.') || 'access',
    label: titleCase(permissionKey),
  };
};

async function ensureRolePermissionTables(connection) {
  await connection.query(`CREATE TABLE IF NOT EXISTS dm_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permission_key VARCHAR(120) NOT NULL UNIQUE,
    module VARCHAR(80) NOT NULL,
    action VARCHAR(40) NOT NULL,
    label VARCHAR(160) NOT NULL,
    description TEXT NULL,
    status INT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_dm_permissions_module (module),
    INDEX idx_dm_permissions_status (status)
  )`);

  await connection.query(`CREATE TABLE IF NOT EXISTS dm_role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    status INT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_dm_role_permission (role_id, permission_id),
    INDEX idx_dm_role_permissions_role (role_id),
    INDEX idx_dm_role_permissions_permission (permission_id),
    INDEX idx_dm_role_permissions_status (status)
  )`);
}

async function ensureForeignKey(connection, tableName, constraintName, definition) {
  const [rows] = await connection.query(
    `SELECT COUNT(*) AS count
     FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
     WHERE CONSTRAINT_SCHEMA = ? AND TABLE_NAME = ? AND CONSTRAINT_NAME = ?`,
    [database, tableName, constraintName],
  );

  if (Number(rows[0].count) === 0) {
    await connection.query(`ALTER TABLE \`${tableName}\` ADD CONSTRAINT \`${constraintName}\` ${definition}`);
  }
}

async function ensureIndex(connection, tableName, indexName, columns) {
  const [rows] = await connection.query(
    `SELECT COUNT(*) AS count
     FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [database, tableName, indexName],
  );

  if (Number(rows[0].count) === 0) {
    await connection.query(`CREATE INDEX \`${indexName}\` ON \`${tableName}\` (${columns})`);
  }
}

async function upsertPermission(connection, permissionKey) {
  const meta = permissionMeta(permissionKey);
  await connection.query(
    `INSERT INTO dm_permissions (permission_key, module, action, label, description, status)
     VALUES (?, ?, ?, ?, ?, 1)
     ON DUPLICATE KEY UPDATE module = VALUES(module), action = VALUES(action), label = VALUES(label), status = 1, updated_at = CURRENT_TIMESTAMP`,
    [permissionKey, meta.module, meta.action, meta.label, `${meta.label} access`],
  );

  const [rows] = await connection.query('SELECT id FROM dm_permissions WHERE permission_key = ? LIMIT 1', [permissionKey]);
  return rows[0].id;
}

async function upsertRole(connection, role) {
  const [existing] = await connection.query('SELECT id FROM dm_role WHERE LOWER(name) = LOWER(?) LIMIT 1', [role.name]);

  if (existing.length) {
    await connection.query(
      'UPDATE dm_role SET type = ?, hierarchy = ?, department_id = ?, status = 1 WHERE id = ?',
      [role.type, role.hierarchy, role.departmentId, existing[0].id],
    );
    return existing[0].id;
  }

  const [result] = await connection.query(
    'INSERT INTO dm_role (name, hierarchy, status, type, department_id) VALUES (?, ?, 1, ?, ?)',
    [role.name, role.hierarchy, role.type, role.departmentId],
  );
  return result.insertId;
}

async function seedRolePermissions(connection) {
  await ensureRolePermissionTables(connection);

  const allPermissions = Array.from(new Set(roleSeeds.flatMap((role) => role.permissions)));
  const permissionIds = new Map();
  for (const permissionKey of allPermissions) {
    permissionIds.set(permissionKey, await upsertPermission(connection, permissionKey));
  }

  for (const role of roleSeeds) {
    const roleId = await upsertRole(connection, role);
    await connection.query('UPDATE dm_role_permissions SET status = 0 WHERE role_id = ?', [roleId]);

    for (const permissionKey of role.permissions) {
      await connection.query(
        `INSERT INTO dm_role_permissions (role_id, permission_id, status)
         VALUES (?, ?, 1)
         ON DUPLICATE KEY UPDATE status = 1, updated_at = CURRENT_TIMESTAMP`,
        [roleId, permissionIds.get(permissionKey)],
      );
    }
  }

  await connection.query('DELETE rp FROM dm_role_permissions rp LEFT JOIN dm_role r ON r.id = rp.role_id WHERE r.id IS NULL');
  await connection.query('DELETE rp FROM dm_role_permissions rp LEFT JOIN dm_permissions p ON p.id = rp.permission_id WHERE p.id IS NULL');
  await ensureIndex(connection, 'dm_role', 'idx_dm_role_id', '`id`');
  await ensureIndex(connection, 'dm_permissions', 'idx_dm_permissions_id', '`id`');
  await ensureForeignKey(
    connection,
    'dm_role_permissions',
    'fk_dm_role_permissions_role',
    'FOREIGN KEY (`role_id`) REFERENCES `dm_role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE',
  );
  await ensureForeignKey(
    connection,
    'dm_role_permissions',
    'fk_dm_role_permissions_permission',
    'FOREIGN KEY (`permission_id`) REFERENCES `dm_permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE',
  );

  return { roles: roleSeeds.length, permissions: allPermissions.length };
}

async function run() {
  if (!database) throw new Error('DATABASE_URL must include a database name');
  const connection = await mysql.createConnection({ ...baseConfig, database });
  const result = await seedRolePermissions(connection);
  await connection.end();
  console.log(`Seeded ${result.roles} roles and ${result.permissions} permissions.`);
}

if (require.main === module) {
  run().catch((error) => {
    console.error('Role permission seed failed:', error);
    process.exit(1);
  });
}

module.exports = {
  adminPermissions,
  roleSeeds,
  seedRolePermissions,
};
