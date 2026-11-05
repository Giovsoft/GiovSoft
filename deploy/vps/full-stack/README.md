# Validación privada de salida completa de GCP

Estos archivos preparan una copia aislada, **no publican producción**. El corte final debe bloquear escritores, repetir las copias de colegio/Commerce/PostgreSQL y verificar Stripe/webhooks antes de retirar GCP. No promover la base de ensayo como copia final.

Requisitos: respaldo crítico validado en `BACKUP/config`, payload verificado en `BACKUP/payload`, imágenes originales cargadas. `prepare-stage.py` exige root, destino nuevo fuera del respaldo, JSON válidos y configuraciones resueltas de las revisiones activas; nunca imprime secretos. Conserva caracteres `$`, comillas y saltos de línea de las credenciales al cargar Compose. Runtime privado 0600 y directorio padre 0700.

```bash
cd /opt/giovsoft
python3 deploy/vps/full-stack/prepare-stage.py \
  /root/colegio-emergencia-20261103 /opt/colegio-completo/stage-20261103

docker compose -f deploy/vps/full-stack/compose.stage.yaml \
  -f /opt/colegio-completo/stage-20261103/runtime.json config --quiet

docker compose -f deploy/vps/full-stack/compose.stage.yaml \
  -f /opt/colegio-completo/stage-20261103/runtime.json up -d --wait database

docker compose -f deploy/vps/full-stack/compose.stage.yaml \
  -f /opt/colegio-completo/stage-20261103/runtime.json \
  exec -T database pg_restore --clean --if-exists --no-owner --no-acl \
  --exit-on-error --single-transaction -U giovsoft_app -d giovsoft \
  < /opt/colegio-completo/stage-20261103/preliminary.dump

docker compose -f deploy/vps/full-stack/compose.stage.yaml \
  -f /opt/colegio-completo/stage-20261103/runtime.json up -d --wait
```

El proyecto es `colegio-completo-stage`, con PostgreSQL y copias de datos separados del GiovSoft publicado. Los tres procesos de aplicación y PostgreSQL solo pertenecen a una red interna sin salida a Internet. El único proxy de comprobación publica loopback 8093 (colegio), 8091 (Commerce), 8092 (API), acepta solo GET/HEAD y no permite crear pedidos/cargos. No se conecta a la red pública de Caddy ni comparte su alias `colegio-public`.

Las aplicaciones pueden actualizar sus copias locales o registrar fallos de entrega durante las pruebas; nada de esa copia se debe sincronizar de vuelta a GCP. No usar health 200 como prueba suficiente de PostgreSQL: comprobar tablas, recuentos, administrador y catálogo autenticados. No ejecutar checkout real ni pruebas de email.

Comprobación local de configuración realizada: esquema Compose válido; contenedor Node con dato ficticio confirma que `$`, comillas y salto de línea sobreviven; aplicaciones sin puertos publicados, red interna y proxy solo loopback. Esto no sustituye la restauración e integración real del VPS.

### Protección del almacenamiento Commerce (incidente 2026-11-04)

La imagen rescatada de Commerce reemplazaba el JSON por un estado vacío ante cualquier error de lectura y escribía directamente sobre el archivo activo. `commerce-storage-patch.mjs original.js patched.js` aplica una sustitución exacta y rechaza versiones desconocidas. Pruebas: `node --test deploy/vps/full-stack/commerce-storage.test.mjs`.

Producción `colegio-completo-r2` monta `/opt/colegio-completo/production-20261104-r2/commerce-index-safe.js` sobre `/app/server/index.js` en solo lectura mediante su runtime privado. Conservar ese montaje al recrear el servicio. No recuperar archivos automáticamente ante un error ni inicializar una tienda vacía: detener escrituras, preservar el archivo afectado y contrastar el respaldo final y cualquier cambio posterior antes de restaurar.

### Protección de contacto del colegio — 2026-11-05

`contact-security-deploy.py` prepara, publica o revierte únicamente la imagen del servicio `school` en `colegio-completo-r2`. Está fijado al código Iberoamericano `230ecdbf9f554f18753d98e2b7d97330cc5e1a44` y exige que el servidor anterior coincida con su SHA256 conocido antes de empezar. No utilizarlo como actualizador genérico sin revisar versiones.

Antes de ejecutar, instalar el artefacto `cloudflare-proxy-cidrs-2026-11-05.json` en `/root/colegio-contact-security-20261105/` y guardar allí `turnstile.json` con siteKey/secretKey mediante entrada privada, permisos 0600. Rangos contrastados con https://www.cloudflare.com/ips-v4 y /ips-v6 el 5 de noviembre; revisar listas actuales antes de reutilizar en otra fecha. La descarga directa de esas listas desde el VPS recibió HTTP 403 durante preparación; se conservó el artefacto verificado por separado, sin desactivar validaciones ni ampliar redes de confianza.

Fases: `python3 deploy/vps/full-stack/contact-security-deploy.py prepare` construye imagen y corre pruebas con `--network none`, sin SMTP ni volúmenes de producción. Exige PREPARED.json antes de `apply`. `apply` respalda runtime privado, conserva los montajes y todos los servicios restantes, configura claves/proxies y recrea solo school; recarga nginx y revierte imagen/configuración si falla. No migra ni sobrescribe datos. `rollback` recupera la imagen/configuración anterior; también retira la protección nueva del contacto, por lo que solo usarlo para una incidencia de disponibilidad confirmada.

Archivos privados del despliegue: runtime-before-contact.json, turnstile.json, prepare.log, apply.log y APPLIED.json, todos bajo `/root/colegio-contact-security-20261105/`. Tras publicación validar `/api/contact-config` (sin secreto), POST sin token rechazado, UI de Turnstile, catálogo de ambos dominios y salud de los demás servicios. No probar un POST válido contra SMTP real.
