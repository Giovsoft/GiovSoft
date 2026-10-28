// This restriction is mounted only on the GiovSoft administrative API.
// Checkout, Stripe callbacks and application integrations remain independent.
module.exports = function adminPaymentAccess(req, res, next) {
  const paymentSettings = /^\/payments(?:\/|$)/i.test(req.path);
  const orderOperation = /^\/orders(?:\/|$)/i.test(req.path) && !['GET', 'HEAD', 'OPTIONS'].includes(req.method);
  const applicationPaymentSettings = /^\/applications(?:\/|$)/i.test(req.path)
    && !['GET', 'HEAD', 'OPTIONS'].includes(req.method)
    && (Object.hasOwn(req.body || {}, 'outboundWebhookUrl')
      || Object.hasOwn(req.body?.config || {}, 'syncPayments'));
  if (paymentSettings || orderOperation || applicationPaymentSettings) {
    return res.status(403).json({
      code: 'ADMIN_PAYMENTS_DISABLED',
      message: 'Las funciones de pagos y Stripe están desactivadas en este panel.',
    });
  }
  return next();
};
