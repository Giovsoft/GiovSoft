const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { createInitialAdmin } = require('./create-initial-admin.cjs');

function fakePool(existing = 0) {
  const queries = [];
  const client = {
    async query(sql, values) {
      queries.push({ sql, values });
      return { rows: sql.includes('count(*)') ? [{ count: existing }] : [], rowCount: 1 };
    },
    release() {},
  };
  return { queries, async connect() { return client; } };
}
const config = { ADMIN_EMAIL: 'Admin@example.com', ADMIN_NAME: 'Administrator', ADMIN_PASSWORD: 'test-only-long-password-123' };

test('creates an ordinary active admin with a login-compatible password hash', async () => {
  const pool = fakePool();
  await createInitialAdmin(pool, config);
  const insert = pool.queries.find(item => item.sql.includes('INSERT INTO admin_users'));
  assert.equal(insert.values[2], 'admin@example.com');
  const [salt, hash] = insert.values[3].split('.');
  assert.equal(crypto.pbkdf2Sync(config.ADMIN_PASSWORD, salt, 120000, 32, 'sha256').toString('base64url'), hash);
  assert.match(insert.sql, /false, false/);
  assert.equal(pool.queries.at(-1).sql, 'COMMIT');
  assert.ok(pool.queries.findIndex(q => q.sql.includes('LOCK TABLE')) < pool.queries.findIndex(q => q.sql.includes('count(*)')));
});
test('refuses existing users and rolls back without changing any password', async () => {
  const pool = fakePool(1);
  await assert.rejects(createInitialAdmin(pool, config), /already contains/);
  assert.equal(pool.queries.some(q => q.sql.includes('INSERT')), false);
  assert.equal(pool.queries.at(-1).sql, 'ROLLBACK');
});
test('refuses missing credentials before opening a database connection', async () => {
  const pool = fakePool();
  await assert.rejects(createInitialAdmin(pool, { ...config, ADMIN_PASSWORD: '' }), /credentials/);
  assert.equal(pool.queries.length, 0);
});
