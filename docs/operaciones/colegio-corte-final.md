# Colegio: copia final y corte al VPS

> **PLAN ANTERIOR SUSPENDIDO — 2026-10-27.** Giovanni excluye `.com.mx` de la migración y requiere que siga funcionando en GCP. No ejecutar la pausa, copia final, activación live ni cambios DNS de esta guía. El procedimiento vigente es [Solo .com con backend compartido](colegio-com-con-backend-gcp.md). El script antiguo ya no acepta `--freeze-and-copy`; el nuevo argumento explicita que pausaría ambos dominios y tampoco está autorizado para este alcance. El contenido restante se conserva como referencia histórica.

Estado: procedimiento preparado y probado localmente con datos ficticios; **mantenimiento, copia final, DNS y publicación no ejecutados**. Giovanni ejecuta comandos de VPS y Cloud Shell. Aprobados por Giovanni: páginas/imágenes, login de tienda y panel, integridad de copia inicial; cuatro comprobaciones privadas pasan. Candidato de código `9c867b6a8a489bc6140425ee908fa5d8134d628c` validado funcionalmente, construido desde GitHub; no se presenta como identidad binaria del artefacto GCP.

Mantener Commerce, API GiovSoft de pagos y Stripe en GCP. Este procedimiento afecta únicamente `colegio-iberoamericano` y registros web del colegio. No cambiar claves, MX, TXT, DKIM, DMARC o NS. El sandbox Stripe local no interviene.

## 1. Preparar el VPS antes del mantenimiento

```bash
(
  set -eu
  cd /opt/giovsoft
  git pull --ff-only origin codex/akira-presentacion
  docker image inspect colegio-vps:9c867b6 --format '{{.Id}}'
  docker network inspect giovsoft-vps_app --format '{{.Name}}'
  docker compose --env-file /opt/colegio/production.env \
    -f deploy/vps/compose.colegio-live.yaml config --quiet
  test ! -e /opt/colegio/restauracion-final
  mkdir -m 700 /root/colegio-migracion-final
  df -h /opt/colegio
  printf 'Preparación del VPS: OK\n'
)
```

Si carpeta final/transferencia ya existe, revisar el intento previo; no borrarlo ni reutilizarlo a ciegas. Revisar disco antes de continuar (copia comprimida, restauración y margen de crecimiento). No arrancar live contra la copia inicial: el bind exige `restauracion-final` existente. No configurar `COLEGIO_GATE_CONFIG=./colegio-live.conf` todavía; la puerta predeterminada debe bloquear escrituras.

Guardar en los paneles capturas privadas de los registros DNS web actuales de ambos dominios y TTL; bajar TTL web a 300 si está permitido y esperar el TTL anterior antes de empezar mantenimiento. Esto no cambia el destino. `.com` observado en Squarespace (`nsb1` a `nsb4.squarespacedns.com`); SOA `.com.mx` observado `ns301.cloud-mx-ns.net` (responsable `root.ns305.cloud-mx-ns.net`): confirmar/acceder al panel de esa zona, que no se presupone Squarespace. No iniciar mantenimiento hasta tener acceso a ambos paneles y poder completar el corte.

**Proveedor de `.com.mx` confirmado posteriormente:** WHOIS directo de NIC México identifica registrador NEUBOX y nameservers ns301 a ns305. [La documentación oficial de NEUBOX](https://neubox.com/tutoriales/base-de-conocimientos/como-activar-la-administacion-dns-de-dominio-en-tu-panel-de-clientes-neubox/) asocia ese conjunto a su Administrador DNS. Localizar `colegioiberoamericano.com.mx` en [Panel de Clientes NEUBOX](https://clientes.neubox.com), Dominios → Gestionar → Registros DNS. Si el usuario no lo ve, localizar la cuenta del titular/proveedor sin compartir credenciales. No cambiar servidores de nombres ni activar/recrear la zona a ciegas. Giovanni por ahora solo tiene localizado el panel `.com`; mantenimiento todavía no iniciado.

## 2. Cloud Shell: iniciar mantenimiento y obtener la copia final

**Este paso interrumpe el sitio antiguo mientras dure el traslado y la convergencia DNS.** No iniciarlo para dejarlo pausado hasta otro día. Evitar ediciones directas del bucket o despliegues simultáneos. Los pagos existentes siguen procesándose en Commerce y el hub; el colegio no crea nuevas compras durante el mantenimiento.

En Cloud Shell del proyecto GiovSoft:

```bash
scp root@5.183.11.142:/opt/giovsoft/deploy/vps/colegio-final-copy.sh \
  "$HOME/colegio-final-copy.sh"
bash "$HOME/colegio-final-copy.sh" --freeze-and-copy
```

El script guarda privadamente configuración y etiquetas de origen, prepara reactivación, retira etiquetas, fija manual/0 solo en el colegio, comprueba estado y espera timeout de solicitudes + 30 segundos (330 segundos con el timeout observado). Después comprueba que URL principal y antiguas etiquetas devuelvan 404/503 y copia el prefijo completo a carpeta nueva. Compara inventarios antes/después y valida JSON; crea tar y checksum sin mostrar cuentas ni credenciales. Las revisiones etiquetadas no se desactivan solo con manual/0, por eso se retiran etiquetas primero. Referencias: [Google, desactivar servicio](https://docs.cloud.google.com/run/docs/configuring/services/manual-scaling#disable-service), [gestión de etiquetas](https://docs.cloud.google.com/sdk/gcloud/reference/run/services/update-traffic).

Si falla, **no repetir** sin revisar: origen puede seguir pausado. La carpeta impresa contiene inventario y reactivación; no compartir JSON privado ni respaldos. Si inventario cambia, investigar otro escritor antes de continuar. El listado comparado no sustituye un bloqueo de escritores ajenos a este servicio.

Al terminar, en Cloud Shell, entrar en **la carpeta exacta impresa por el script** (ejemplo de estructura, sustituir la ruta) y transferir:

```bash
# Usar la ruta real impresa, no pegar literalmente la siguiente línea de ejemplo.
# cd /home/gioramos/colegio-respaldo-final.XXXXXX
sha256sum -c colegio-final.tar.gz.sha256
scp colegio-final.tar.gz colegio-final.tar.gz.sha256 \
  root@5.183.11.142:/root/colegio-migracion-final/
```

## 3. VPS: restaurar y levantar live aún sin escrituras públicas

```bash
(
  set -eu
  cd /root/colegio-migracion-final
  chmod 600 colegio-final.tar.gz colegio-final.tar.gz.sha256
  sha256sum -c colegio-final.tar.gz.sha256
  cd /opt/giovsoft
  python3 deploy/vps/restore-colegio.py \
    /root/colegio-migracion-final/colegio-final.tar.gz \
    /root/colegio-migracion-final/colegio-final.tar.gz.sha256 \
    /opt/colegio/restauracion-final
  (cd /opt/colegio/restauracion-final && sha256sum -c SHA256SUMS > /dev/null)
  docker compose --env-file /opt/colegio/production.env \
    -f deploy/vps/compose.colegio-live.yaml up -d --wait
  curl --fail --silent --show-error http://127.0.0.1:8084/api/health
  printf '\n'
  curl --silent --output /dev/null --write-out 'Compras bloqueadas: HTTP %{http_code}\n' \
    -X POST http://127.0.0.1:8084/api/store/checkout
  docker compose --env-file /opt/colegio/production.env \
    -f deploy/vps/compose.colegio-live.yaml exec -T school node \
    < deploy/vps/check-colegio-production.cjs
)
```

Esperado: checksum y manifiesto OK, JSON válidos, healthy, health OK, compras 405 y cuatro comprobaciones OK. La cantidad final de archivos puede cambiar respecto a 44 si hubo subidas desde la primera copia; revisar el inventario final, no forzar la cantidad vieja.

Proyecto nuevo `colegio-vps-live`: datos finales bind-mount escribible, raíz de imagen de solo lectura, school sin puertos públicos y proxy access en loopback 8084 + red compartida `giovsoft-vps_app` con alias `colegio-public`. Puerta HTTP de solo lectura impide que la aplicación reciba mutaciones durante el cambio DNS; las consultas de pedidos también están bloqueadas. Los proyectos de comprobación anteriores no se convierten en producción.

## 4. VPS: habilitar el colegio en Caddy

El Caddy compartido sigue siendo el único dueño de 80/443. No ejecutar otro proxy con esos puertos. El snippet desactivado no se publica por hacer git pull; activación explícita:

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

Se recrea únicamente edge si necesita el montaje de `sites-enabled`; conserva volúmenes de certificados y configuración. Validación no equivale a certificado emitido. El colegio todavía está con escrituras bloqueadas. Mientras DNS siga en Google, ACME puede fallar; tras actualizar DNS, Caddy reintentará. No borrar volúmenes ni reiniciar repetidamente para resolver cachés.

## 5. Paneles DNS: cambiar únicamente registros web

Aplicar en **cada zona autoritativa** (guardar primero valores previos):

| Zona | Tipo | Nombre | Destino |
| --- | --- | --- | --- |
| colegioiberoamericano.com | A | @ | 5.183.11.142 |
| colegioiberoamericano.com | CNAME | www | colegioiberoamericano.com |
| colegioiberoamericano.com.mx | A | @ | 5.183.11.142 |
| colegioiberoamericano.com.mx | CNAME | www | colegioiberoamericano.com.mx |

Sustituir los cuatro A Google de cada raíz por el único A del VPS, no añadirlo junto a Google. Retirar **solo los AAAA web de raíz/www que lleven a Google**, porque no se ha configurado una dirección IPv6 del VPS para este sitio. Si hay A/AAAA/CNAME previos de www incompatibles con CNAME, reemplazarlos solo para ese nombre. No modificar otros subdominios, registros de correo o NS. Si hay proxy DNS disponible, usar DNS directo durante emisión y diagnóstico; no cambiar proveedores.

En Caddy, ambas raíces sirven el colegio y www redirige a `.com.mx`; se conserva `PUBLIC_URL=https://colegioiberoamericano.com.mx` y el identificador Commerce actual. La raíz `.com` no se redirige para conservar su servicio actual.

## 6. Verificar DNS/HTTPS antes de abrir escrituras

Desde equipo externo y VPS, comprobar A/AAAA y HTTPS de los cuatro nombres, incluidos alias. No usar `curl -k`. Ejemplo para cada raíz:

```bash
curl --fail --silent --show-error --resolve colegioiberoamericano.com.mx:443:5.183.11.142 \
  https://colegioiberoamericano.com.mx/api/health
curl --fail --silent --show-error https://colegioiberoamericano.com.mx/api/health
curl --fail --silent --show-error https://colegioiberoamericano.com/api/health
curl --silent --show-error --head https://www.colegioiberoamericano.com.mx/
curl --silent --show-error --head https://www.colegioiberoamericano.com/
```

Esperado: raíces 200 con certificado válido y alias 308 a `.com.mx`. Confirmar desde más de un resolver y la dirección remota, porque una respuesta cacheada antigua no prueba el origen VPS. Revisar páginas, imágenes y login. Catálogo público 200; checkout debe seguir 405 en esta etapa. `api.giovsoft.com/api/health` y Commerce continúan operativos en GCP. Certificado no confirmado hasta comprobarlo. Los usuarios que mantengan DNS Google verán mantenimiento; el origen permanece pausado para evitar dos almacenes escribiendo.

## 7. Abrir escrituras solo tras verificar el destino público

En el VPS, editar **solo** el archivo privado `/opt/colegio/production.env`: añadir una única línea `COLEGIO_GATE_CONFIG=./colegio-live.conf` (si ya existe, modificarla, no duplicarla). Guardar y ejecutar:

```bash
cd /opt/giovsoft
docker compose --env-file /opt/colegio/production.env \
  -f deploy/vps/compose.colegio-live.yaml \
  up -d --no-deps --force-recreate --wait access
```

Esto habilita funciones reales de la aplicación. No realizar compras reales de prueba. Verificar lectura, login y permanencia de datos. Documentar hora exacta de apertura. Desde ese momento, los hashes iniciales de los JSON pueden cambiar legítimamente; no restaurarlos para hacer pasar el manifiesto. Cualquier reversión debe preservar esos cambios nuevos.

Conservar respaldo final fuera del servidor (Cloud Shell temporal no sustituye una política permanente), bucket y origen pausado mientras se observa el sitio. Definir respaldo automático/retención y comprobar restauración antes de retirar definitivamente almacenamiento antiguo; no borrar GCP en este corte. Detener proyectos de comprobación solo cuando ya no sean necesarios, sin eliminar sus datos.

## Reversión

Antes de abrir escrituras en el VPS: mantenerlo con puerta de lectura, ejecutar personalmente en Cloud Shell el script `reactivar-origen-antes-de-escrituras-vps.sh` guardado en la carpeta de copia final. Restaura escalamiento y etiquetas del inventario; porcentajes de tráfico no se cambiaron. Restaurar A/AAAA y CNAME originales en ambos paneles si ya fueron cambiados y verificar origen. Conservar todos los respaldos.

Después de abrir escrituras: cerrar la puerta de mutaciones del VPS, esperar solicitudes en curso, respaldar y reconciliar cambios hacia GCS antes de reactivar el origen o devolver DNS. **No ejecutar directamente el script de reactivación con datos antiguos.** Si la configuración de GiovSoft se ve afectada, deshabilitar solo el snippet del colegio (moverlo fuera de `sites-enabled`) y recargar Caddy; no borrar certificados o volúmenes compartidos.

## Evidencia de preparación

Pruebas locales con fixtures, sin credenciales reales: proyecto live healthy; health 200; puerta inicial checkout 405; prueba de escritura/borrado de un archivo ficticio en volumen; alias `colegio-public` accesible desde red edge; puerta live inicio 200 y registro inválido 400 sin crear cuenta. Caddy valida con ambos sitios y alias. Script de copia final ensayado sin red mediante sustitutos de gcloud/curl/sleep: guarda reactivación, retira tags antes de manual/0, copia y genera checksum; rechaza copiar si una etiqueta permanece. Dos ensayos pasan. No se ejecutó mantenimiento real ni se emitieron certificados en estas pruebas.
