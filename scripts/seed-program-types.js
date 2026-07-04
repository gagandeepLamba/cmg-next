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

// Ids match the scheme already referenced by dm_countries_type_program.type
// and scripts/seed-fees.js's classifyProgramType (2, 4, 5, 6 are already in use).
const programTypeSeeds = {
  1: 'Business Immigration',
  2: 'Skilled Immigration',
  3: 'Study Abroad',
  4: 'Visit Visa/ Tourist Visa',
  5: 'Work Permit',
  6: 'Citizenship By Investment',
};

async function seedProgramTypes(connection) {
  for (const [id, type] of Object.entries(programTypeSeeds)) {
    await connection.query(
      `INSERT INTO dm_program_type (id, type, status, created, created_by)
       VALUES (?, ?, 1, NOW(), 1)
       ON DUPLICATE KEY UPDATE type = VALUES(type), status = 1`,
      [id, type]
    );
  }

  return { programTypes: Object.keys(programTypeSeeds).length };
}

async function run() {
  if (!database) throw new Error('DATABASE_URL must include a database name');
  const connection = await mysql.createConnection({ ...baseConfig, database });
  const result = await seedProgramTypes(connection);
  await connection.end();
  console.log(`Seeded ${result.programTypes} program types.`);
}

if (require.main === module) {
  run().catch((error) => {
    console.error('Program type seed failed:', error);
    process.exit(1);
  });
}

module.exports = { programTypeSeeds, seedProgramTypes };
