const { test } = require('node:test');
const assert = require('node:assert/strict');
const { runChecks } = require('./check-colegio-production.cjs');

const env = {
  ADMIN_PASSWORD: 'private-admin', GIOVCOMMERCE_STOREFRONT_SECRET: 'private-storefront',
  GIOVCOMMERCE_API_URL: 'https://commerce.giovsoft.com', GIOVCOMMERCE_STORE_DOMAIN: 'colegioiberoamericano.com.mx',
  SMTP_HOST: 'smtp.example.invalid', SMTP_USER: 'private-user', SMTP_PASS: 'private-password',
  SUPPORT_SMTP_HOST: 'smtp.example.invalid', SUPPORT_SMTP_USER: 'private-user2', SUPPORT_SMTP_PASS: 'private-password2',
};

test('verifies admin, storefront and SMTP without sends or mutations', async () => {
  let calls = [], verifications = 0;
  const lines = [];
  const ok = await runChecks({env, emit: text => lines.push(text),
    fetch: async (url, options) => { calls.push({url, options}); return {status: 200}; },
    createTransport: () => ({verify: async () => { verifications++; }, close() {}}),
  });
  assert.equal(ok, true);
  assert.equal(verifications, 2);
  assert.equal(calls.length, 2);
  assert.equal(new URL(calls[1].url).searchParams.get('email'), 'vps-migration-check@example.invalid');
  assert.ok(calls.every(call => !call.options.method || call.options.method === 'GET'));
  assert.ok(!lines.join('').includes('private-'));
});

test('does not forward credentials to an unexpected Commerce destination', async () => {
  let called = false;
  const ok = await runChecks({env: {...env, GIOVCOMMERCE_API_URL: 'https://other.example.invalid'}, emit() {},
    fetch: async () => { called = true; }, createTransport: () => { called = true; },
  });
  assert.equal(ok, false);
  assert.equal(called, false);
});

test('reports failures without printing sensitive error details', async () => {
  const lines = [];
  const ok = await runChecks({env, emit: text => lines.push(text),
    fetch: async () => { throw new Error('private-storefront'); },
    createTransport: () => ({verify: async () => { throw new Error('private-password'); }, close() {}}),
  });
  assert.equal(ok, false);
  assert.ok(!lines.join('').includes('private-'));
});

test('reports allowlisted SMTP diagnostics without the provider message', async () => {
  const lines = [];
  await runChecks({env, emit: text => lines.push(text),
    fetch: async () => ({status: 200}),
    createTransport: () => ({verify: async () => {
      throw Object.assign(new Error('private-password and private-user'), {code: 'EAUTH', responseCode: 535, command: 'AUTH PLAIN'});
    }, close() {}}),
  });
  assert.ok(lines.some(line => line.includes('EAUTH') && line.includes('535') && line.includes('AUTH PLAIN')));
  assert.ok(!lines.join('').includes('private-'));
});
