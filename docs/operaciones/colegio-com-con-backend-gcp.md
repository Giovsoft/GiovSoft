# Solo .com en VPS; .com.mx continúa en GCP

Decisión de Giovanni del 2026-10-27: excluir `.com.mx` de la migración y mantenerlo funcionando. Este procedimiento sustituye el corte conjunto anterior. **No pausar Cloud Run, retirar tags o ejecutar copia final del plan previo. No modificar DNS, NS ni configuración de `.com.mx`.**

## Alcance intermedio

- VPS sirve los archivos web compilados de `.com` y `www.com` redirige a la raíz `.com`.
- Todas las rutas `/api`, `/api/*`, `/uploads` y `/uploads/*` se sirven mediante proxy HTTPS al servicio existente `colegio-iberoamericano-598441636410.us-central1.run.app`, con validación de certificado y SNI.
- GCP sigue siendo el único backend de contenido editable, cuentas, correo y conexión Commerce/Stripe. Así ambos dominios usan los mismos datos y no hay copias de cuentas divergiendo.
- El contenedor web del VPS no monta datos restaurados, no tiene salida de red ni configuración de GCS, SMTP o Commerce operativa. Su API local no se publica mediante el proxy. No es una migración completa de backend/almacenamiento fuera de GCP.
- No se requieren claves de servicio GCP adicionales. Las copias iniciales se conservan como respaldo; no reemplazan los datos vigentes de GCP.
- Las URLs de retorno de checkout y recuperación las genera el backend GCP con su `PUBLIC_URL` actual `.com.mx`. Se mantienen en esta etapa para no cambiar el comportamiento de ese dominio. No afirmar que esos retornos ya usan `.com`.
- La contraseña SMTP de recuperación nueva del VPS no se traslada automáticamente a GCP. Las comprobaciones SMTP anteriores del contenedor local no certifican el correo del backend compartido; no se cambian sus secretos durante este corte.

## 1. Levantar comprobación privada sin escrituras

En el VPS:

```bash
(
  set -eu
  cd /opt/giovsoft
  git pull --ff-only origin codex/akira-presentacion
  docker network inspect giovsoft-vps_app --format '{{.Name}}'
  docker compose --env-file /opt/colegio/production.env \
    -f deploy/vps/compose.colegio-com-shared.yaml up -d --wait
  curl --fail --silent --show-error http://127.0.0.1:8085/api/health
  printf '\n'
  curl --silent --output /dev/null --write-out 'Catálogo HTTP %{http_code}\n' \
    http://127.0.0.1:8085/api/store/catalog
  curl --silent --output /dev/null --write-out 'Checkout bloqueado HTTP %{http_code}\n' \
    -X POST http://127.0.0.1:8085/api/store/checkout
)
```

Esperado: web/access healthy, health OK, catálogo 200 y checkout 405. El proyecto es `colegio-com-shared`, loopback 8085. No iniciar simultáneamente el viejo proyecto live: ambos usarían el alias `colegio-public`.

Puerta inicial `colegio-shared-readonly.conf`: solo GET/HEAD y POST del login existente; consultas de pedidos se bloquean para no provocar conciliaciones. No editar `COLEGIO_SHARED_GATE` todavía. No confundir esta puerta del VPS con una pausa de GCP: `.com.mx` permanece activo.

Desde Terminal de la Mac:

```bash
ssh -o ExitOnForwardFailure=yes -N -L 8085:127.0.0.1:8085 root@5.183.11.142
```

Revisar `http://127.0.0.1:8085/`, `/otros-servicios` y `/admin`. Estos accesos comprueban ahora el backend compartido, no la copia local anterior. No guardar cambios ni probar compras, registro o recuperación. Confirmar también `.com.mx` público disponible sin cambios.

## 2. Caddy solo para .com

El snippet `deploy/vps/colegio.caddy` ahora solo incluye `.com` y `www.com`. No solicita certificados `.com.mx` ni redirige www a ese dominio. La base de Caddy incluye un directorio opcional para sitios; hacer pull no activa por sí solo un sitio.

En el VPS, después de comprobar el proyecto compartido:

```bash
(
  set -eu
  cd /opt/giovsoft
  install -m 644 deploy/vps/colegio.caddy deploy/vps/sites-enabled/colegio.caddy
  docker compose --env-file deploy/vps/.env.production -f deploy/vps/compose.yaml \
    run --rm --no-deps edge caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
  docker compose --env-file deploy/vps/.env.production -f deploy/vps/compose.yaml \
    up -d --no-deps edge
  docker compose --env-file deploy/vps/.env.production -f deploy/vps/compose.yaml \
    exec -T edge caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
  curl --fail --silent --show-error https://giovsoft.com/api/health
)
```

Conserva certificados/volúmenes de GiovSoft. Validación de sintaxis no prueba emisión TLS. Caddy podrá completar ACME una vez que el DNS web `.com` llegue al VPS. No borrar certificados ni reiniciar repetidamente.

## 3. DNS de Squarespace: únicamente colegioiberoamericano.com

Guardar primero valores A/AAAA/CNAME y TTL actuales. Sustituir los cuatro A Google de raíz por un único A al VPS; retirar solo AAAA web de raíz que apunten a Google (no se ha configurado IPv6 del VPS). Ajustar www sin registros incompatibles:

| Tipo | Nombre | Valor |
| --- | --- | --- |
| A | @ | 5.183.11.142 |
| CNAME | www | colegioiberoamericano.com |

No cambiar correo, verificaciones, otros subdominios, NS, ni ningún registro `.com.mx`. Mientras propaguen cachés, clientes pueden seguir viendo el origen Google; al compartir backend no hay bifurcación de datos. El VPS aún bloquea escrituras hasta la comprobación pública.

## 4. Verificar TLS y activar funciones de .com

Comprobar raíz 200, certificado válido sin `-k`, www 308 a `.com`, A al VPS y ausencia de AAAA Google. Confirmar `.com.mx` continúa operativo en Google. Verificar páginas, imágenes y login vía `.com`; no ejecutar compras reales de prueba.

```bash
curl --fail --silent --show-error --resolve colegioiberoamericano.com:443:5.183.11.142 \
  https://colegioiberoamericano.com/api/health
curl --fail --silent --show-error https://colegioiberoamericano.com/api/health
curl --silent --show-error --head https://www.colegioiberoamericano.com/
curl --fail --silent --show-error https://colegioiberoamericano.com.mx/api/health
```

Después de validación pública, añadir una única línea a `/opt/colegio/production.env`: `COLEGIO_SHARED_GATE=./colegio-shared-active.conf`. No tocar `COLEGIO_GATE_CONFIG`, que corresponde al proyecto viejo. Recrear solo access de este proyecto:

```bash
cd /opt/giovsoft
docker compose --env-file /opt/colegio/production.env \
  -f deploy/vps/compose.colegio-com-shared.yaml \
  up -d --no-deps --force-recreate --wait access
```

Desde ese momento las acciones reales de `.com` llegan al mismo backend GCP que `.com.mx`. No se crean cuentas ni pagos automáticamente por activar el proxy. Documentar hora y comprobar accesos sin cargos. Backend, bucket y servicios GCP se conservan; no se retiran al acabar este cambio DNS.

## Reversión

Restaurar únicamente registros web anteriores de `.com` y quitar su snippet Caddy si es necesario. Los datos permanecen en el mismo backend GCP, sin reconciliar copias locales. No borrar copias iniciales ni modificar `.com.mx`. Detener solo `colegio-com-shared` si se abandona el VPS, conservando GiovSoft y los otros proyectos.

## Estado de preparación

Configuración `.com` únicamente y puerta privada preparadas; DNS, Caddy público y GCP no modificados por el asistente. Validación real de la instancia compartida en VPS pendiente; las pruebas anteriores de 8083 eran sobre copias locales y no sustituyen esta comprobación. El backend completo podrá trasladarse en una fase posterior con coordinación de ambos dominios.

Prueba local ejecutada: web/access healthy; inicio 200, health/content/catalog por proxy GCP 200 e imagen subida 200 con tipo image. Checkout y recuperación POST 405; historial de pedidos 405. Web sin montajes de datos y solo red interna. Se hicieron únicamente lecturas públicas del origen y solicitudes bloqueadas por la puerta, sin cuentas, correos u órdenes creados. Caddy validado con solo `.com` y `www.com`. Proyecto temporal de comprobación retirado al finalizar.
