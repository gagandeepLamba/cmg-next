const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/dmconsultant_mydmcons_dm';
const parsedUrl = new URL(databaseUrl);
const database = parsedUrl.pathname.replace(/^\//, '');

const config = {
  host: parsedUrl.hostname || 'localhost',
  port: Number(parsedUrl.port || 3306),
  user: decodeURIComponent(parsedUrl.username || 'root'),
  password: decodeURIComponent(parsedUrl.password || ''),
  database,
};

const usernames = ['Soumya', 'sales1', 'sales2', 'Accounts', 'HR', 'PRO'];

async function run() {
  const connection = await mysql.createConnection(config);
  let updated = 0;

  for (const username of usernames) {
    const hashed = await bcrypt.hash(username, 12);
    const [result] = await connection.query('UPDATE dm_employee SET password = ? WHERE username = ?', [hashed, username]);
    if (result.affectedRows === 0) {
      console.warn(`No employee found with username "${username}"`);
    } else {
      updated += result.affectedRows;
      console.log(`Updated password for "${username}"`);
    }
  }

  await connection.end();
  console.log(`Done. ${updated} row(s) updated.`);
}

run().catch((error) => {
  console.error('Password reset failed:', error);
  process.exit(1);
});
