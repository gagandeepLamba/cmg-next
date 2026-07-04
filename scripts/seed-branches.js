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

// dm_region rows required by the branches below. seed-fees.js and
// seed-employees.js both look branches up by `abbrv`, so these five must exist.
const REGION_SEEDS = ['UAE', 'Kuwait', 'Qatar', 'India'];

// `branch` holds the branch's country/location (see src/lib/branchCurrency.ts,
// which matches dm_currency.country against dm_branch.branch) rather than a
// city name, so it must line up with the dm_currency rows in seed-currency.js.
const BRANCH_SEEDS = [
  { name: 'Abu Dhabi', ar_name: 'أبوظبي', branch: 'United Arab Emirates', region: 'UAE', abbrv: 'AUH',
    address: 'Abu Dhabi, UAE', ar_address: 'أبوظبي، الإمارات العربية المتحدة',
    email: 'auh@dmconsultants.com', mobile: '+971000000000', website: 'https://www.dmconsultants.com' },
  { name: 'Dubai SZR', ar_name: 'دبي', branch: 'United Arab Emirates', region: 'UAE', abbrv: 'DXB SZR',
    address: 'Sheikh Zayed Road, Dubai, UAE', ar_address: 'شارع الشيخ زايد، دبي، الإمارات العربية المتحدة',
    email: 'dxb@dmconsultants.com', mobile: '+971000000001', website: 'https://www.dmconsultants.com' },
  { name: 'Kuwait', ar_name: 'الكويت', branch: 'Kuwait', region: 'Kuwait', abbrv: 'KWD',
    address: 'Kuwait City, Kuwait', ar_address: 'مدينة الكويت، الكويت',
    email: 'kwt@dmconsultants.com', mobile: '+96500000000', website: 'https://www.dmconsultants.com' },
  { name: 'Doha Old Airport Road', ar_name: 'الدوحة', branch: 'Qatar', region: 'Qatar', abbrv: 'DOH old airport rd',
    address: 'Old Airport Road, Doha, Qatar', ar_address: 'شارع المطار القديم، الدوحة، قطر',
    email: 'qtr@dmconsultants.com', mobile: '+97400000000', website: 'https://www.dmconsultants.com' },
  { name: 'Hyderabad', ar_name: 'حيدر أباد', branch: 'India', region: 'India', abbrv: 'HYD',
    address: 'Hyderabad, Telangana, India', ar_address: 'حيدر أباد، تيلانجانا، الهند',
    email: 'hyd@dmconsultants.com', mobile: '+910000000000', website: 'https://www.dmconsultants.com' },
];

async function ensureRegions(connection) {
  const regionIds = {};
  const [rows] = await connection.query('SELECT id, name FROM dm_region');
  for (const row of rows) regionIds[row.name] = row.id;

  for (const name of REGION_SEEDS) {
    if (regionIds[name]) continue;
    const [result] = await connection.query('INSERT INTO dm_region (name, status) VALUES (?, 1)', [name]);
    regionIds[name] = result.insertId;
  }

  return regionIds;
}

async function seedBranches(connection) {
  const regionIds = await ensureRegions(connection);

  const [rows] = await connection.query('SELECT id, abbrv FROM dm_branch');
  const existingIdByAbbrv = new Map(rows.map((r) => [r.abbrv, r.id]));

  let created = 0;
  for (const b of BRANCH_SEEDS) {
    const existingId = existingIdByAbbrv.get(b.abbrv);
    if (existingId) {
      await connection.query('UPDATE dm_branch SET branch = ?, region = ? WHERE id = ?', [b.branch, regionIds[b.region], existingId]);
      continue;
    }
    await connection.query(
      `INSERT INTO dm_branch (name, ar_name, branch, region, abbrv, address, ar_address, email, mobile, status, website)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [b.name, b.ar_name, b.branch, regionIds[b.region], b.abbrv, b.address, b.ar_address, b.email, b.mobile, b.website]
    );
    created++;
  }

  return { branches: created, regions: Object.keys(regionIds).length };
}

async function run() {
  if (!database) throw new Error('DATABASE_URL must include a database name');
  const connection = await mysql.createConnection({ ...baseConfig, database });
  const result = await seedBranches(connection);
  await connection.end();
  console.log(`Seeded ${result.branches} branches (${result.regions} regions ensured).`);
}

if (require.main === module) {
  run().catch((error) => {
    console.error('Branch seed failed:', error);
    process.exit(1);
  });
}

module.exports = { BRANCH_SEEDS, seedBranches };
