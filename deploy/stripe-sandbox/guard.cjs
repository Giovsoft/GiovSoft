const http = require('node:http');

function validateSandbox(env) {
  if (env.SANDBOX_MODE !== 'true') throw new Error('SANDBOX_MODE=true is required.');
  if (!['hub', 'commerce', 'school'].includes(env.SANDBOX_SERVICE)) throw new Error('Unknown sandbox service.');
  if (env.STRIPE_SECRET_KEY && !/^(sk|rk)_test_/.test(env.STRIPE_SECRET_KEY)) throw new Error('Only a Stripe test key is allowed.');
  for (const name of ['PGHOST', 'DATABASE_URL', 'GCS_BUCKET', 'GOOGLE_APPLICATION_CREDENTIALS', 'SMTP_HOST', 'SUPPORT_SMTP_HOST']) {
    if (env[name]) throw new Error(`Sandbox refuses external storage or email: ${name}`);
  }
  const allowed = {
    GIOVSOFT_API_URL: 'http://hub:4000',
    GIOVCOMMERCE_API_URL: 'http://commerce:8080',
    GIOVCOMMERCE_HUB_URL: 'http://commerce:8080',
  };
  for (const [name, url] of Object.entries(allowed)) {
    if (env[name] && env[name] !== url) throw new Error(`Sandbox refuses non-sandbox destination: ${name}`);
  }
  if (env.PUBLIC_URL && !/^http:\/\/127\.0\.0\.1:\d+$/.test(env.PUBLIC_URL)) throw new Error('Only a loopback public URL is allowed.');
}
module.exports = { validateSandbox };

if (process.env.SANDBOX_MODE === 'true') {
  validateSandbox(process.env);
  if (process.env.SANDBOX_SERVICE === 'hub') {
    const originalEmit = http.Server.prototype.emit;
    http.Server.prototype.emit = function (event, req, res, ...args) {
      if (event === 'request' && req.method === 'POST' && req.url.split('?')[0] === '/api/v1/checkout/sessions'
        && (!process.env.STRIPE_SECRET_KEY || !process.env.SANDBOX_STRIPE_ACCOUNT || !process.env.STRIPE_WEBHOOK_SECRET)) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ code: 'SANDBOX_STRIPE_NOT_READY', message: 'Configure Stripe test key, test connected account and test listener before checkout.' }));
        return true;
      }
      return originalEmit.call(this, event, req, res, ...args);
    };
  }
}
