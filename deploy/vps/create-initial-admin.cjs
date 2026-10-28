// Run on the VPS via: docker compose ... exec -T backend node < this-file
// Reads the existing container environment; never prints passwords or hashes.
const crypto = require('node:crypto');

async function createInitialAdmin(pool, config) {
  const email = String(config.ADMIN_EMAIL || '').trim().toLowerCase();
  const name = String(config.ADMIN_NAME || 'GiovSoft').trim();
  const password = config.ADMIN_PASSWORD || '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 16 || !name) {
    throw new Error('Valid ADMIN_EMAIL, ADMIN_NAME and ADMIN_PASSWORD credentials (16+ characters) are required.');
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Prevent another bootstrap or normal user write racing the empty-table check.
    await client.query('LOCK TABLE admin_users IN SHARE ROW EXCLUSIVE MODE');
    const { rows } = await client.query('SELECT count(*)::int AS count FROM admin_users');
    if (Number(rows[0].count) !== 0) {
      throw new Error('admin_users already contains users; no account or password was changed.');
    }
    const salt = crypto.randomBytes(16).toString('base64url');
    const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('base64url');
    await client.query(`INSERT INTO admin_users
      (id, name, email, password_hash, role, status, password_change_required, is_master)
      VALUES ($1, $2, $3, $4, 'Administrador', 'active', false, false)`,
    [crypto.randomUUID(), name, email, `${salt}.${hash}`]);
    await client.query('COMMIT');
    return { email };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
module.exports = { createInitialAdmin };

if (!module.parent) {
  const { Pool } = require('pg');
  const pool = new Pool({ connectionTimeoutMillis: 10000, query_timeout: 15000 });
  createInitialAdmin(pool, process.env)
    .then(({ email }) => {
      console.log(`Initial admin created: ${email}. Password was not printed.`);
      console.log('Use the existing ADMIN_PASSWORD. Two-factor authentication was not changed.');
    })
    .catch(error => {
      // Do not print database error detail, query arguments, credentials or hashes.
      const safeMessages = ['already contains', 'credentials (16+'];
      console.error(safeMessages.some(text => error.message.includes(text))
        ? error.message : 'Could not create initial admin; transaction rolled back. Check database availability and schema.');
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}
