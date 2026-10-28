// Stream into the sandbox hub: node < this-file. Performs Stripe READS only.
const key = process.env.STRIPE_SECRET_KEY || '';
const account = process.env.SANDBOX_STRIPE_ACCOUNT || '';
if (!/^(sk|rk)_test_/.test(key) || !/^acct_[A-Za-z0-9]+$/.test(account)) {
  console.error('Configure a test key and the test connected account first.');
  process.exitCode = 1;
} else {
  const Stripe = require('stripe');
  const stripe = new Stripe(key, { timeout: 15000, maxNetworkRetries: 0 });
  stripe.accounts.retrieve(account).then(result => {
    const ready = result.charges_enabled && result.capabilities?.card_payments === 'active' && result.capabilities?.transfers === 'active';
    console.log(JSON.stringify({ mode: 'test-key', accountFound: true, chargesEnabled: result.charges_enabled, cardPayments: result.capabilities?.card_payments || 'not-active', transfers: result.capabilities?.transfers || 'not-active', ready }));
    if (!ready) process.exitCode = 1;
  }).catch(() => {
    console.error('Could not retrieve this connected account using the configured test key. No checkout attempted.');
    process.exitCode = 1;
  });
}
