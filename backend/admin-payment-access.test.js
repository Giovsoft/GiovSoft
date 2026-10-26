const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const adminPaymentAccess = require('./admin-payment-access');

test('admin payment controls are blocked while reporting and integration routes remain available', async () => {
  const app = express();
  app.use('/api/admin', adminPaymentAccess);
  app.use((_req, res) => res.json({ reachedHandler: true }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const [method, path, status] of [
      ['GET', '/api/admin/payments/engine', 403],
      ['PUT', '/api/admin/payments/engine/provider', 403],
      ['POST', '/api/admin/payments/engine/systems', 403],
      ['POST', '/api/admin/orders/example/mark-paid', 403],
      ['POST', '/api/admin/orders/example/deliveries/example/retry', 403],
      ['GET', '/api/admin/orders', 200],
      ['GET', '/api/admin/billing/sat', 200],
      ['GET', '/api/admin/profile', 200],
      ['POST', '/api/webhooks/stripe', 200],
      ['POST', '/api/v1/checkout/sessions', 200],
      ['GET', '/api/v1/orders/example', 200],
    ]) {
      const response = await fetch(base + path, { method });
      assert.equal(response.status, status, `${method} ${path}`);
    }
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

test('application payment configuration cannot be changed through a different admin endpoint', () => {
  for (const body of [{ outboundWebhookUrl: 'https://example.com/payments' }, { config: { syncPayments: true } }]) {
    let status;
    let reached = false;
    adminPaymentAccess({ path: '/applications/example', method: 'PATCH', body }, {
      status(value) { status = value; return this; },
      json() {},
    }, () => { reached = true; });
    assert.equal(status, 403);
    assert.equal(reached, false);
  }
});
