const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

(async () => {
  if (process.env.SANDBOX_MODE !== 'true') throw new Error('Sandbox only.');
  const account = process.env.STRIPE_TEST_CONNECTED_ACCOUNT || '';
  if (account && !/^acct_[A-Za-z0-9]+$/.test(account)) throw new Error('Invalid test connected account identifier.');
  const hubRoot = '/seed/hub';
  const commerceRoot = '/seed/commerce';
  await fs.mkdir(hubRoot, { recursive: true });
  await fs.mkdir(commerceRoot, { recursive: true });
  // Never overwrite orders, accounts or existing store data.
  async function create(folder, name, data) {
    try { await fs.writeFile(path.join(folder, name), JSON.stringify(data, null, 2), { flag: 'wx', mode: 0o600 }); }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
  }
  const now = new Date().toISOString();
  const appId = '9d987c20-d821-43db-b11b-7cb523416000';
  const clientId = 'd4987c20-d821-43db-b11b-7cb523416001';
  await create(hubRoot, 'connected-applications.json', [{ id: appId, name: 'Colegio Commerce SANDBOX', apiBaseUrl: 'http://commerce:8080', outboundWebhookUrl: 'http://commerce:8080/api/payments/hub-webhook', status: 'active', apiKey: process.env.SANDBOX_APP_KEY, webhookSecret: process.env.SANDBOX_WEBHOOK_KEY, config: { syncPayments: true }, metrics: {}, createdAt: now, updatedAt: now }]);
  await create(hubRoot, 'clients.json', [{ id: clientId, businessName: 'Colegio Iberoamericano SANDBOX', status: 'active', ecommerce: { stripeConnectedAccountId: account }, createdAt: now, updatedAt: now }]);
  const file = path.join(hubRoot, 'clients.json');
  const clients = JSON.parse(await fs.readFile(file, 'utf8'));
  const orderFile = path.join(hubRoot, 'orders.json');
  const orders = await fs.readFile(orderFile, 'utf8').then(JSON.parse).catch(error => { if (error.code === 'ENOENT') return []; throw error; });
  const seededClient = clients.find(client => client.id === clientId);
  if (seededClient && seededClient.ecommerce?.stripeConnectedAccountId !== account) {
    if (orders.length) throw new Error('Do not switch Stripe accounts after sandbox orders exist.');
    seededClient.ecommerce = { stripeConnectedAccountId: account };
    await fs.writeFile(file, JSON.stringify(clients, null, 2), { mode: 0o600 });
  }
  await create(commerceRoot, 'commerce.json', {
    stores: [{ id: 'school-sandbox', name: 'Colegio Iberoamericano SANDBOX', domain: 'colegioiberoamericano.com.mx', giovsoftClientId: clientId, status: 'active', currency: 'MXN', settings: { storefrontDomain: 'colegioiberoamericano.com.mx' } }],
    products: [{ id: 'sandbox-product', storeId: 'school-sandbox', name: 'Servicio ficticio de prueba — SIN COBRO REAL', sku: 'SANDBOX-001', category: 'Pruebas', price: 20, status: 'active', stock: 100, unlimitedStock: true }],
    orders: [], customers: [], users: [], shippingMethods: [], shipments: [], webhookEvents: [],
    settings: { businessName: 'SANDBOX Colegio', defaultCurrency: 'MXN', supportEmail: 'sandbox@example.test' },
  });
  console.log('Sandbox fixtures ready. No production data copied; no secrets printed.');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
