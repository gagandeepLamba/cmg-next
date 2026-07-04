const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
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

const BRANCH_ABBRV = { AUH: 'AUH', DXB: 'DXB SZR', KWT: 'KWD', QTR: 'DOH old airport rd', HYD: 'HYD' };
const DEPT = { Sales: 5, Admin: 1 };

// New hires: created if missing (matched by username). Existing records are
// left alone except role/branch/department, which are kept in sync.
const newEmployees = [
  { branch: 'DXB', dept: 'Admin', doj: null, name: 'Soumya', username: 'Soumya', role: 'CEO' },
  { branch: 'DXB', dept: 'Sales', doj: null, name: 'Sales1', username: 'sales1', role: 'Counsellor' },
  { branch: 'DXB', dept: 'Sales', doj: null, name: 'Sales2', username: 'sales2', role: 'Counsellor' },
  { branch: 'DXB', dept: 'Admin', doj: null, name: 'Accounts', username: 'Accounts', role: 'Accountant' },
  { branch: 'DXB', dept: 'Admin', doj: null, name: 'HR', username: 'HR', role: 'HR' },
  { branch: 'DXB', dept: 'Admin', doj: null, name: 'PRO', username: 'PRO', role: 'PRO' },
];

// Usernames from the previous roster that are no longer part of newEmployees
// above. These are NOT deleted automatically — run scripts/delete-employees.js
// (or your own confirmed step) against them once you're ready to remove them
// from the live database.
const removedUsernames = [
  'Satvir', 'GauravS', 'Mohammed', 'Pooja', 'Surabhi', 'Sravan', 'SherinA',
  'Soundar', 'Mahnaz', 'Umer', 'Bharti', 'MohamadAbbas', 'Prince', 'Sachin',
  'AbdulSaud', 'Jaya', 'Altamash', 'Syed', 'FOEDubai', 'Shelane', 'Rishab',
  'Shruti', 'Harika', 'Madhu', 'Christopher', 'MohamadIsmail', 'NaveedPasha',
  'Misbah', 'ShahzadAli', 'Deenadayalan', 'Lukeman', 'Bismymol',
];

async function resolveLookups(connection) {
  const [branchRows] = await connection.query('SELECT id, abbrv FROM dm_branch');
  const byAbbrv = new Map(branchRows.map((r) => [r.abbrv, r.id]));
  const branchIds = {};
  for (const [key, abbrv] of Object.entries(BRANCH_ABBRV)) {
    if (!byAbbrv.has(abbrv)) throw new Error(`dm_branch row with abbrv "${abbrv}" not found`);
    branchIds[key] = byAbbrv.get(abbrv);
  }

  const [roleRows] = await connection.query('SELECT id, name FROM dm_role WHERE status = 1');
  const roleIds = new Map(roleRows.map((r) => [r.name, r.id]));

  return { branchIds, roleIds };
}

async function seedEmployees(connection) {
  const { branchIds, roleIds } = await resolveLookups(connection);
  const credentials = [];
  let created = 0;
  let updated = 0;

  for (const emp of newEmployees) {
    const roleId = roleIds.get(emp.role);
    if (!roleId) throw new Error(`Role "${emp.role}" not found for ${emp.name}`);
    const branchId = branchIds[emp.branch];
    const deptId = DEPT[emp.dept];

    const [existing] = await connection.query('SELECT id FROM dm_employee WHERE username = ? LIMIT 1', [emp.username]);
    if (existing.length) {
      await connection.query('UPDATE dm_employee SET role = ?, branch = ?, department = ? WHERE id = ?', [roleId, branchId, deptId, existing[0].id]);
      updated++;
      continue;
    }

    const password = emp.username;
    const hashed = await bcrypt.hash(password, 12);
    const [result] = await connection.query(
      `INSERT INTO dm_employee (
        name, email, cemail, mobile, cmobile, paddress, address, photo, dob,
        role, vendor_id, branch, region, username, password, status, ppNo,
        visaExp, department, EID, doj, nationality, dol, remark, labexp,
        bounce, em_local_name, em_home_name, em_local_number, em_home_number,
        religion, gender, crea, wfh, work_location, work_country, work_city,
        work_site, employment_type
      ) VALUES (
        ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
        ?, 0, ?, NULL, ?, ?, 1, NULL,
        NULL, ?, NULL, ?, NULL, NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, NULL,
        '', '', 1, 0, 'Onshore', 'UAE', NULL,
        NULL, 'Full-time'
      )`,
      [emp.name, roleId, branchId, emp.username, hashed, deptId, emp.doj]
    );
    credentials.push({ id: result.insertId, name: emp.name, username: emp.username, password });
    created++;
  }

  return { created, updated, credentials };
}

async function run() {
  if (!database) throw new Error('DATABASE_URL must include a database name');
  const connection = await mysql.createConnection({ ...baseConfig, database });
  const result = await seedEmployees(connection);
  await connection.end();
  console.log(`Employees: created ${result.created}, updated ${result.updated}.`);
  if (result.credentials.length) {
    console.log('New account credentials (save these — shown only once):');
    console.log(JSON.stringify(result.credentials, null, 2));
  }
}

if (require.main === module) {
  run().catch((error) => {
    console.error('Employee seed failed:', error);
    process.exit(1);
  });
}

module.exports = { newEmployees, seedEmployees };
