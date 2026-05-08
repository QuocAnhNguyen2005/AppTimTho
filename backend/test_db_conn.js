const db = require('./db');

async function testConnection() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('Database connection successful. Server time:', result.rows[0].now);
    
    console.log('--- Checking Users ---');
    const users = await db.query('SELECT id, phone_number, full_name, password_hash FROM users');
    console.log(users.rows);

    console.log('--- Checking Workers ---');
    const workers = await db.query('SELECT id, phone_number, full_name, password_hash FROM workers');
    console.log(workers.rows);

    process.exit(0);
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
}

testConnection();
