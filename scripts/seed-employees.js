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
  { branch: 'AUH', dept: 'Sales', doj: '2026-06-26', name: 'Satvir', username: 'Satvir', role: 'Counsellor' },
  { branch: 'AUH', dept: 'Sales', doj: '2024-01-23', name: 'Gaurav Singh', username: 'GauravS', role: 'Counsellor' },
  { branch: 'AUH', dept: 'Sales', doj: '2025-06-12', name: 'Mohammed Loirdigi', username: 'Mohammed', role: 'Counsellor' },
  { branch: 'AUH', dept: 'Sales', doj: '2025-06-01', name: 'Pooja Dhankar', username: 'Pooja', role: 'Counsellor' },
  { branch: 'AUH', dept: 'Sales', doj: '2026-07-01', name: 'Surabhi', username: 'Surabhi', role: 'Counsellor' },
  { branch: 'AUH', dept: 'Sales', doj: '2025-10-22', name: 'Uppala Sravan Kumar', username: 'Sravan', role: 'Counsellor' },
  { branch: 'DXB', dept: 'Sales', doj: '2020-02-25', name: 'Sherin Almas Shanoob', username: 'SherinA', role: 'Counsellor' },
  { branch: 'DXB', dept: 'Sales', doj: '2025-05-01', name: 'Soundar', username: 'Soundar', role: 'Counsellor' },
  { branch: 'DXB', dept: 'Sales', doj: '2026-01-07', name: 'Mahnaz Sarwari', username: 'Mahnaz', role: 'Counsellor' },
  { branch: 'DXB', dept: 'Sales', doj: '2026-02-14', name: 'Umer Iqbal', username: 'Umer', role: 'Counsellor' },
  { branch: 'DXB', dept: 'Sales', doj: '2026-03-08', name: 'Bharti', username: 'Bharti', role: 'Counsellor' },
  { branch: 'DXB', dept: 'Sales', doj: '2026-04-22', name: 'Mohamad Abbas', username: 'MohamadAbbas', role: 'Counsellor' },
  { branch: 'DXB', dept: 'Sales', doj: '2026-05-21', name: 'Prince Sharma', username: 'Prince', role: 'Counsellor' },
  { branch: 'KWT', dept: 'Sales', doj: '2024-11-28', name: 'Sachin Pillai', username: 'Sachin', role: 'Counsellor' },
  { branch: 'QTR', dept: 'Sales', doj: '2024-06-25', name: 'Abdul Saud Khan', username: 'AbdulSaud', role: 'Counsellor' },
  { branch: 'QTR', dept: 'Sales', doj: '2024-04-02', name: 'Jaya Prakash', username: 'Jaya', role: 'Counsellor' },
  { branch: 'QTR', dept: 'Sales', doj: '2024-12-07', name: 'Mohd Altamash', username: 'Altamash', role: 'Counsellor' },
  { branch: 'QTR', dept: 'Sales', doj: '2025-06-10', name: 'Syed Khaleel', username: 'Syed', role: 'Counsellor' },
  { branch: 'DXB', dept: 'Admin', doj: '2026-01-09', name: 'FOE Dubai', username: 'FOEDubai', role: 'FOE' },
  { branch: 'KWT', dept: 'Admin', doj: '2024-07-31', name: 'Shelane Dela Pieza', username: 'Shelane', role: 'FOE' },
  { branch: 'HYD', dept: 'Sales', doj: null, name: 'Rishab Agarwal', username: 'Rishab', role: 'Counsellor' },
  { branch: 'HYD', dept: 'Sales', doj: null, name: 'Battu Shruti', username: 'Shruti', role: 'Branch Manager' },
  { branch: 'HYD', dept: 'Sales', doj: null, name: 'Kappa Harika', username: 'Harika', role: 'Counsellor' },
  { branch: 'HYD', dept: 'Sales', doj: null, name: 'Gaddam Madhu Sudhan Reddy', username: 'Madhu', role: 'Counsellor' },
  { branch: 'HYD', dept: 'Sales', doj: null, name: 'Christopher Walter Mackness', username: 'Christopher', role: 'Counsellor' },
  { branch: 'AUH', dept: 'Sales', doj: null, name: 'Mohamad Ismail', username: 'MohamadIsmail', role: 'Branch Manager' },
  { branch: 'DXB', dept: 'Sales', doj: null, name: 'Naveed Pasha', username: 'NaveedPasha', role: 'Assistant Director of Sales' },
  { branch: 'DXB', dept: 'Sales', doj: null, name: 'Misbah', username: 'Misbah', role: 'Branch Manager' },
  { branch: 'KWT', dept: 'Sales', doj: null, name: 'Shahzad Ali', username: 'ShahzadAli', role: 'Assistant Director of Sales' },
  { branch: 'QTR', dept: 'Sales', doj: null, name: 'Deenadayalan', username: 'Deenadayalan', role: 'Branch Manager' },
  { branch: 'DXB', dept: 'Admin', doj: null, name: 'Lukeman', username: 'Lukeman', role: 'CEO' },
  { branch: 'QTR', dept: 'Admin', doj: null, name: 'Bismymol Mathew', username: 'Bismymol', role: 'FOE' },
  { branch: 'DXB', dept: 'Admin', doj: null, name: 'Accounts', username: 'Accounts', role: 'Accountant' },
  { branch: 'DXB', dept: 'Admin', doj: null, name: 'HR', username: 'HR', role: 'HR' },
  { branch: 'DXB', dept: 'Admin', doj: null, name: 'PRO', username: 'PRO', role: 'PRO' },
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
