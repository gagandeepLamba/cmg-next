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
];

const roleSeeds = [
  { name: 'Super Admin', type: 'super_admin', hierarchy: 1, departmentId: 1, permissions: adminPermissions },
  { name: 'Founder', type: 'founder', hierarchy: 5, departmentId: 1, permissions: adminPermissions },
  { name: 'Director', type: 'director', hierarchy: 10, departmentId: 1, permissions: adminPermissions },
  { name: 'Director of Sales', type: 'director_of_sales', hierarchy: 10, departmentId: 1, permissions: adminPermissions },
  { name: 'Branch Manager', type: 'branch_manager', hierarchy: 20, departmentId: 1, permissions: ['sales.view', 'leads.view', 'leads.create', 'leads.update', 'reports.view'] },
  { name: 'HR', type: 'hr', hierarchy: 30, departmentId: 1, permissions: ['hr.dashboard', 'hr.view', 'hr.create', 'hr.update', 'hr.delete', 'hr.payroll', 'hr.eosb'] },
  { name: 'PRO', type: 'pro', hierarchy: 30, departmentId: 1, permissions: ['pro.dashboard', 'pro.view', 'pro.create', 'pro.update', 'pro.delete', 'pro.wps.view', 'pro.owners.restricted'] },
  { name: 'Operations', type: 'operations', hierarchy: 40, departmentId: 1, permissions: ['operations.view', 'operations.create', 'operations.update', 'operations.manage'] },
  { name: 'Sales', type: 'sales', hierarchy: 40, departmentId: 1, permissions: ['sales.view', 'leads.view', 'leads.create', 'leads.update', 'reports.view'] },
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
