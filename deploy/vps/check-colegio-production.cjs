// Stream into the school container with `exec -T school node`; no secret output.
async function runChecks({env, fetch, createTransport, emit}) {
  if (env.GIOVCOMMERCE_API_URL !== 'https://commerce.giovsoft.com' ||
      env.GIOVCOMMERCE_STORE_DOMAIN !== 'colegioiberoamericano.com.mx' ||
      !env.ADMIN_PASSWORD || !env.GIOVCOMMERCE_STOREFRONT_SECRET) {
    emit('Configuración: RECHAZADA (destino o credenciales incompletos)');
    return false;
  }
  let ok = true;
  for (const [name, url, headers] of [
    ['Panel privado', 'http://127.0.0.1:8080/api/admin/content', {'x-admin-password': env.ADMIN_PASSWORD}],
    ['Storefront autenticado', 'https://commerce.giovsoft.com/api/internal/storefront/orders?domain=colegioiberoamericano.com.mx&email=vps-migration-check%40example.invalid', {'x-storefront-api-key': env.GIOVCOMMERCE_STOREFRONT_SECRET}],
  ]) {
    try {
      const response = await fetch(url, {headers, redirect: 'error', signal: AbortSignal.timeout(15000)});
      const passed = response.status === 200;
      emit(`${name}: ${passed ? 'OK' : 'FALLO'} (HTTP ${response.status})`);
      await response.body?.cancel();
      ok = ok && passed;
    } catch {
      emit(`${name}: FALLO (conexión o respuesta)`);
      ok = false;
    }
  }
  for (const prefix of ['', 'SUPPORT_']) {
    const label = prefix ? 'SMTP recuperación' : 'SMTP institucional';
    let transport;
    try {
      const host = env[`${prefix}SMTP_HOST`];
      const user = env[`${prefix}SMTP_USER`];
      const pass = env[`${prefix}SMTP_PASS`];
      const port = Number(env[`${prefix}SMTP_PORT`] || 587);
      const secure = env[`${prefix}SMTP_SECURE`] === 'true' || port === 465;
      if (!host || !user || !pass || !Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Incomplete');
      transport = createTransport({host, port, secure, requireTLS: !secure,
        auth: {user, pass}, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000});
      await transport.verify();
      emit(`${label}: OK (conexión y autenticación; sin envío)`);
    } catch {
      emit(`${label}: FALLO (configuración, conexión o autenticación)`);
      ok = false;
    } finally {
      try { transport?.close(); } catch { /* No secret-bearing errors in output. */ }
    }
  }
  emit('No se enviaron mensajes ni se crearon órdenes o pagos.');
  return ok;
}

module.exports = {runChecks};
if (!module.parent) {
  runChecks({env: process.env, fetch: globalThis.fetch,
    createTransport: options => require('nodemailer').createTransport(options), emit: console.log})
    .then(ok => { process.exitCode = ok ? 0 : 1; })
    .catch(() => { console.error('Comprobación interrumpida; sin detalles sensibles.'); process.exitCode = 1; });
}
