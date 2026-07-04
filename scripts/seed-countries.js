const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const { COUNTRY } = require('./seed-fees');

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

// Fixed ids matching the COUNTRY map in seed-fees.js, which assumes this
// stock data already exists in dm_country_proces. seed-fees.js's
// ensureCountries() only appends brand-new countries after this set, using
// MAX(id)+1, so these ids must be seeded first or its ids would collide.
async function seedCountries(connection) {
  for (const [name, id] of Object.entries(COUNTRY)) {
    await connection.query(
      `INSERT INTO dm_country_proces (id, name, sub_counteries, status)
       VALUES (?, ?, 0, 1)
       ON DUPLICATE KEY UPDATE name = VALUES(name), status = 1`,
      [id, name]
    );
  }

  return { countries: Object.keys(COUNTRY).length };
}

async function run() {
  if (!database) throw new Error('DATABASE_URL must include a database name');
  const connection = await mysql.createConnection({ ...baseConfig, database });
  const result = await seedCountries(connection);
  await connection.end();
  console.log(`Seeded ${result.countries} countries.`);
}

if (require.main === module) {
  run().catch((error) => {
    console.error('Country seed failed:', error);
    process.exit(1);
  });
}

module.exports = { seedCountries };
