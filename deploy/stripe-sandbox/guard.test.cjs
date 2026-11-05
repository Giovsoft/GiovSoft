const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateSandbox } = require('./guard.cjs');
const base = { SANDBOX_MODE: 'true', SANDBOX_SERVICE: 'hub', FRONTEND_ORIGIN: 'http://127.0.0.1:7410' };
test('rejects live keys before starting a sandbox process', () => {
  assert.throws(() => validateSandbox({ ...base, STRIPE_SECRET_KEY: 'sk_live_fixture' }), /test key/);
});
test('rejects production storage and production destinations', () => {
  for (const extra of [{ PGHOST: 'production-db' }, { GCS_BUCKET: 'production-bucket' }, { GIOVSOFT_API_URL: 'https://api.giovsoft.com' }, { SMTP_HOST: 'smtp.example.com' }]) {
    assert.throws(() => validateSandbox({ ...base, ...extra }));
  }
});
test('accepts isolated internal endpoints and missing Stripe credentials for health checks', () => {
  assert.doesNotThrow(() => validateSandbox(base));
  assert.doesNotThrow(() => validateSandbox({ ...base, GIOVSOFT_API_URL: 'http://hub:4000', STRIPE_SECRET_KEY: 'sk_test_fixture' }));
});
