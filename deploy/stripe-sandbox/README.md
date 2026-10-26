# Sandbox local: Colegio → GiovCommerce → hub → Stripe de prueba

Entorno independiente de producción, preparado en Docker local. No usa GCP, DNS público, Cloud SQL, buckets, correo real ni volúmenes del VPS. No se ha desplegado al VPS. Puertos publicados solo en 127.0.0.1:

- Colegio: http://127.0.0.1:7410/otros-servicios
- Commerce de prueba: http://127.0.0.1:7411
- Hub de prueba: http://127.0.0.1:7412/api/health

El identificador interno del catálogo conserva `colegioiberoamericano.com.mx` para recorrer la misma selección de métodos de pago que el código actual del colegio. Es una etiqueta dentro del fixture; no cambia DNS ni envía callbacks a ese dominio. Las URL de retorno son loopback y los callbacks usan `http://commerce:8080` dentro de Docker.

## Preparación reproducible

Desde la raíz del repositorio GiovSoft, con Docker Desktop activo:

```bash
python3 deploy/stripe-sandbox/prepare-sources.py
python3 deploy/stripe-sandbox/init-env.py
docker compose --env-file deploy/stripe-sandbox/.env.sandbox -f deploy/stripe-sandbox/compose.yaml up -d --build --wait
```

`prepare-sources.py` necesita acceso Git a los dos repositorios privados. Verifica los commits de `sources.lock.json` sin modificar checkouts existentes. `init-env.py` genera secretos nuevos con permisos 0600 y no sobrescribe archivos existentes. Si el entorno ya fue preparado, no repetir la generación.

El colegio y Commerce solo están en una red Docker interna. Un proxy local publica sus puertos de loopback. El hub y el listener tienen una segunda red para acceder a Stripe; no se pasan credenciales de GCP ni producción. El guard de arranque rechaza claves Stripe live, destinos de backend ajenos al sandbox, almacenamiento externo y SMTP. El checkout del hub devuelve 503 `SANDBOX_STRIPE_NOT_READY` hasta que existan clave, cuenta conectada y secreto de webhook de prueba. Un health check 200 no indica que Stripe ya esté configurado.

Los volúmenes son exclusivos del proyecto `giovsoft-stripe-sandbox`. Los fixtures son un cliente ficticio, una aplicación, una tienda y un producto de 20 MXN; no hay alumnos, compradores ni órdenes reales. La semilla no reemplaza datos existentes. No cambiar las claves internas de aplicación/webhook después del primer inicio; para un nuevo juego de claves preparar otro proyecto aislado.

## Completar credenciales (lo hace Giovanni)

En el Dashboard de Stripe confirmar visualmente **modo de prueba** o el sandbox seleccionado. La vista test actualmente inspeccionada no tenía cuentas conectadas de prueba. Crear/configurar allí una cuenta conectada ficticia que permita pagos con tarjeta y transferencias para el flujo Connect; nunca usar una cuenta live ni datos bancarios reales.

Introducir personalmente en el archivo privado `deploy/stripe-sandbox/.env.sandbox`:

- `STRIPE_TEST_SECRET_KEY`: clave del mismo entorno, con prefijo `sk_test_` o `rk_test_` y permisos necesarios para Checkout/Connect.
- `STRIPE_TEST_CONNECTED_ACCOUNT`: identificador `acct_...` de la cuenta conectada de ese entorno.

No enviar estos valores en chat ni subir el archivo a Git. El prefijo `acct_` por sí solo no acredita el modo; la cuenta debe recuperarse correctamente usando la clave test antes del primer checkout. El código de prueba mantiene Stripe fuera del administrador del VPS.

Tras introducir los dos valores, recrear solo el hub local y comprobar la cuenta mediante una lectura Stripe (no crea cargos):

```bash
docker compose --env-file deploy/stripe-sandbox/.env.sandbox -f deploy/stripe-sandbox/compose.yaml up -d --force-recreate --wait hub
docker compose --env-file deploy/stripe-sandbox/.env.sandbox -f deploy/stripe-sandbox/compose.yaml exec -T hub node < deploy/stripe-sandbox/verify-stripe.cjs
```

Continuar solo si devuelve `ready=true`. El helper no imprime claves ni datos personales de la cuenta.

## Listener y firma de eventos

El perfil opcional `stripe` usa la imagen oficial Stripe CLI 1.55.2 fijada por digest y rechaza claves live antes de iniciarla. No abre un webhook público ni registra destinos en producción.

```bash
python3 deploy/stripe-sandbox/prepare-listener.py
docker compose --env-file deploy/stripe-sandbox/.env.sandbox -f deploy/stripe-sandbox/compose.yaml run --rm seed
docker compose --env-file deploy/stripe-sandbox/.env.sandbox -f deploy/stripe-sandbox/compose.yaml up -d --force-recreate --wait hub
docker compose --env-file deploy/stripe-sandbox/.env.sandbox -f deploy/stripe-sandbox/compose.yaml --profile stripe up -d stripe-listener
```

El helper obtiene `listen --print-secret`, captura el resultado y guarda el secreto únicamente en el archivo privado. No imprime el secreto. El listener reenvía eventos de plataforma y Connect al hub local, que verifica la firma. Sus logs pueden contener el secreto de firma: no compartirlos completos ni guardarlos en la bitácora. Registrar solo estado, tipo/ID de evento de prueba, código de entrega y correlación sin credenciales.

No ejecutar `stripe trigger` como sustituto de comprar desde la tienda: el evento debe corresponder a una sesión y orden reales **de prueba** de este sandbox. El listener puede recibir otros eventos test de la misma cuenta; el hub solo debe aplicar los que correspondan a sus propias órdenes.

## Verificación previa a una transacción

```bash
curl http://127.0.0.1:7410/api/health
curl http://127.0.0.1:7411/api/health
curl http://127.0.0.1:7412/api/health
curl http://127.0.0.1:7410/api/store/catalog
node --test deploy/stripe-sandbox/guard.test.cjs
```

Antes de pagar: verificar acceso Stripe con clave test, capacidad de la cuenta conectada, firma y conectividad del listener; confirmar que la sesión creada tenga `livemode=false`. Después ejecutar los [casos de prueba](../../docs/operaciones/stripe-colegio-pruebas.md), distinguiendo recepción de webhook y callback de la conciliación por polling. Ninguna transacción Stripe está certificada todavía con esta preparación.

## Detener y reanudar

```bash
docker compose --env-file deploy/stripe-sandbox/.env.sandbox -f deploy/stripe-sandbox/compose.yaml --profile stripe stop
```

Conserva datos de prueba y no afecta al VPS ni GCP. No ejecutar `down -v` en otros proyectos. La eliminación definitiva de este sandbox se tratará por separado y con su nombre exacto.

## Referencias

- [Stripe: pruebas](https://docs.stripe.com/testing)
- [Stripe CLI: listener y Connect](https://github.com/stripe/stripe-cli/wiki/Listen-command)
- [Stripe CLI: variable STRIPE_API_KEY](https://github.com/stripe/stripe-cli/wiki/Using-Stripe-API-Keys)
