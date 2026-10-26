# Migración de Colegio Iberoamericano al VPS

Estado al 2026-10-26: conservación de datos autorizada; inventario inicial confirmado; copia, restauración y corte pendientes. Giovanni ejecuta los comandos del VPS.

## Alcance y decisiones

Conservar contenido editable, archivos subidos y cuentas actuales. Mover el servidor web del colegio al VPS `5.183.11.142`; mantener inicialmente GiovCommerce y el hub de Stripe de producción en GCP. El sandbox local continúa con datos ficticios y claves test independientes.

Alternativas consideradas: iniciar desde el repositorio (descartado por la decisión de conservar datos); mantener GCS desde el VPS (reduce el traslado inicial, pero conserva dependencia y credenciales Google); trasladar datos a almacenamiento persistente del VPS (propuesta, requiere copia verificada y ventana sin escrituras). Esta última es la propuesta para completar la salida del sitio de GCP, aún sin ejecutar.

## Inventario confirmado

Consulta de solo lectura de la configuración visible en Cloud Run, proyecto `healthy-genre-497401-j7`, servicio `colegio-iberoamericano`, región `us-central1`:

| Ajuste | Valor |
| --- | --- |
| GCS_BUCKET | healthy-genre-497401-j7-iberoamericano |
| STORAGE_PREFIX | colegio-iberoamericano |
| GIOVCOMMERCE_API_URL | https://commerce.giovsoft.com |
| GIOVCOMMERCE_STORE_DOMAIN | colegioiberoamericano.com.mx |
| PUBLIC_URL | https://colegioiberoamericano.com.mx |

El código revisado guarda `content.json`, `store-accounts.json` y `uploads/` bajo ese prefijo. En modo local corresponden a `/app/data/content.json`, `/app/data/store-accounts.json` y `/app/public/uploads/`. La presencia real, tamaño y número de objetos se deben inventariar antes de copiar; no asumir que el repositorio contiene los datos actuales.

Las consultas DNS locales de ambos dominios raíz `.com` y `.com.mx` devuelven direcciones Google. Pendiente inventariar NS, A, AAAA, CNAME, www y asignaciones Cloud Run de todos los nombres que atienden al colegio; conservar registros de correo y verificaciones.

## Procedimiento propuesto

1. Inventariar objetos del prefijo GCS y revisión de Cloud Run que recibe tráfico. Contrastar el código desplegado con el commit que se construirá; el checkout local de referencia está fijado en `9c867b6a8a489bc6140425ee908fa5d8134d628c`.
2. Crear una copia privada del prefijo completo en una ubicación de respaldo, fuera de Git y del sandbox. Guardar manifiesto de rutas, tamaños y hashes; no imprimir cuentas ni contraseñas. La exportación de configuración debe omitir valores secretos. Las credenciales SMTP, admin y storefront se trasladarán directamente a un archivo privado del VPS con permisos 0600, sin publicarlas en la bitácora.
3. Preparar un servicio del colegio separado, con persistencia para `data` y `public/uploads`. Usar el Caddy existente como único dueño de 80/443, sin iniciar un segundo proxy que compita por esos puertos. Acceso de comprobación inicialmente solo por loopback/túnel. No conectar una copia editable a GCS de producción.
4. Restaurar una primera copia y verificar manifiesto, JSON válido y cantidad de cuentas sin mostrar sus datos. Verificar que el proceso lea los archivos restaurados y que una recreación del contenedor no los pierda. No ejecutar correos o compras reales desde la copia de comprobación.
5. Verificar páginas, contenido e imágenes; mantener identificador de tienda y URL pública canónica actuales. Comprobar catálogo contra Commerce sin crear órdenes. Preparar certificados y todos los nombres DNS antes del corte. No sustituir por claves Stripe test ninguna variable de producción.
6. Abrir una ventana breve de mantenimiento que impida escrituras al origen: ediciones del panel, subidas, altas/cambios/recuperaciones de cuentas y nuevas compras. Debe cubrir también el acceso directo a Cloud Run y nombres alternativos. DNS por sí solo no evita escrituras al origen en caché. No detener Commerce, el hub ni sus webhooks: deben seguir procesando órdenes existentes.
7. Con origen sin escrituras, repetir copia final, comparar manifiesto y restaurar antes de habilitar el VPS. Durante la convergencia DNS, el origen antiguo debe permanecer sin escrituras o reenviar al destino; no mantener dos almacenes independientes aceptando cambios. Documentar hora y criterio de reapertura.
8. Cambiar únicamente DNS web del colegio, conservando correo. Verificar TLS sin omitir validación, redirecciones, páginas, imágenes, login y catálogo desde cada dominio público. Un 200 no prueba correo ni flujo completo de pago. El pago completo se valida primero en el sandbox autorizado.
9. Conservar origen y respaldo mientras se observa el destino. Retirar Cloud Run del colegio solo después de la validación. Commerce y la API de pagos permanecen activos en GCP.

## Reversión

Antes de que el VPS acepte escrituras, se puede volver a los registros DNS inventariados y reabrir el origen. Después de aceptar cambios en el VPS, detener escrituras en ambos lados, respaldar y reconciliar primero los datos nuevos hacia el origen; no restaurar DNS a un almacén obsoleto. No eliminar buckets ni volúmenes durante la migración.

## Primer comando: inventario sin modificar datos

Ejecutar en **Cloud Shell del proyecto GiovSoft**, no en la consola del VPS ni en el sandbox local:

```bash
gcloud storage ls --recursive --long \
  gs://healthy-genre-497401-j7-iberoamericano/colegio-iberoamericano/
```

Este comando lista objetos y tamaños, no descarga ni imprime su contenido. Si hay nombres de archivos con información personal, compartir solo cantidades, tamaño total y confirmación de `content.json`, `store-accounts.json` y `uploads/`. No compartir contenido de cuentas ni secretos.

## Pendientes para continuar

- Inventario real y volumen de los objetos; respaldo todavía no realizado.
- Revisión desplegada, nombres DNS completos y destino privado del respaldo.
- Configuración de persistencia, Caddy y secretos del VPS preparada y validada.
- Ventana de mantenimiento y mecanismo concreto para bloquear escrituras.
- Restauración ensayada y comparación de manifiestos.

No se han modificado VPS, GCP, DNS ni datos de producción durante este inventario.

## Inventario recibido y respaldo inicial

Captura de Cloud Shell enviada por Giovanni el 2026-10-26 a las 16:52:59 (hora de Ciudad de México): 44 objetos, aproximadamente 80.61 MiB; aparecen `content.json`, `store-accounts.json` y `uploads/`. Se confirma existencia, no integridad ni restaurabilidad todavía. La captura no muestra el contenido de las cuentas.

Siguiente bloque preparado para Cloud Shell. Solo lee GCS y escribe una carpeta privada nueva en el HOME de Cloud Shell. No es una copia consistente de corte mientras producción siga aceptando escrituras. La verificación SHA-256 posterior comprueba los archivos locales y el transporte del archivo, no demuestra que el origen no haya cambiado durante la descarga.

```bash
(
  set -eu
  umask 077
  colegio_backup_dir=$(mktemp -d "$HOME/colegio-respaldo-inicial.XXXXXX")
  mkdir "$colegio_backup_dir/datos"
  gcloud storage rsync --recursive \
    gs://healthy-genre-497401-j7-iberoamericano/colegio-iberoamericano/ \
    "$colegio_backup_dir/datos"
  python3 - "$colegio_backup_dir/datos" <<'PY'
import hashlib, json, pathlib, sys
root = pathlib.Path(sys.argv[1])
content = json.loads((root / 'content.json').read_text())
accounts = json.loads((root / 'store-accounts.json').read_text())
assert isinstance(content, dict), 'Formato de contenido inesperado'
assert isinstance(accounts, list), 'Formato de cuentas inesperado'
assert (root / 'uploads').is_dir(), 'Falta uploads'
files = sorted(p for p in root.rglob('*') if p.is_file())
with (root.parent / 'SHA256SUMS').open('w') as out:
    for p in files:
        out.write(hashlib.sha256(p.read_bytes()).hexdigest() + '  datos/' + p.relative_to(root).as_posix() + '\n')
print('JSON válidos; archivos:', len(files), '; bytes:', sum(p.stat().st_size for p in files))
print('Cuentas conservadas:', len(accounts))
PY
  (cd "$colegio_backup_dir" && sha256sum -c SHA256SUMS > /dev/null)
  tar -C "$colegio_backup_dir" -czf "$colegio_backup_dir/colegio-inicial.tar.gz" datos SHA256SUMS
  (cd "$colegio_backup_dir" && sha256sum colegio-inicial.tar.gz > colegio-inicial.tar.gz.sha256)
  printf 'Respaldo inicial preparado en: %s\n' "$colegio_backup_dir"
)
```

No subir el respaldo al repositorio ni adjuntarlo al chat: contiene datos de cuentas. Compartir únicamente resultado agregado, ruta y errores si los hay, omitiendo datos personales. Conservar la carpeta hasta verificar la transferencia y restauración en el VPS. La copia final debe hacerse a una carpeta nueva después de detener escrituras.

Referencia de sintaxis: [gcloud storage rsync](https://docs.cloud.google.com/sdk/gcloud/reference/storage/rsync). No se usa la opción de eliminar objetos ni se escribe en el bucket.

### Respaldo confirmado a las 16:57 y transferencia pendiente

La captura de Giovanni confirma 44/44 archivos descargados y creación del archivo inicial. Ejecutó la versión abreviada del chat: validación JSON y directorio uploads, tar de `datos/` y checksum del tar; no el manifiesto individual de la variante anterior. No se han comprobado aún restauración, contenido semántico ni contraseñas conservadas mediante login.

Primero en la consola del **VPS**:

```bash
mkdir -m 700 /root/colegio-migracion-inicial
```

Si la carpeta ya existe, detenerse y revisar su contenido antes de reutilizarla. Después en **Cloud Shell**, donde se creó el respaldo:

```bash
(
  set -eu
  cd "$HOME"/colegio-respaldo-inicial.*/
  sha256sum -c colegio-inicial.tar.gz.sha256
  scp colegio-inicial.tar.gz colegio-inicial.tar.gz.sha256 \
    root@5.183.11.142:/root/colegio-migracion-inicial/
)
```

El glob presupone una sola carpeta de respaldo; si hay varias, `cd` falla y se debe seleccionar la correcta explícitamente. Autenticar SSH personalmente. Ante aviso de clave de host cambiada, no desactivar comprobaciones: comparar la huella con la consola de Hostinger antes de aceptar una clave nueva.

Finalmente en el **VPS**, sin extraer todavía:

```bash
cd /root/colegio-migracion-inicial
chmod 600 colegio-inicial.tar.gz colegio-inicial.tar.gz.sha256
sha256sum -c colegio-inicial.tar.gz.sha256
```

Resultado esperado: `colegio-inicial.tar.gz: OK`. Transferencia y comprobación pendientes de evidencia; ningún comando anterior publica el respaldo ni altera el servicio activo.

### Transferencia confirmada; restauración inicial preparada

Giovanni confirmó que SCP terminó y que `sha256sum -c` en el VPS devuelve `colegio-inicial.tar.gz: OK`. Esto comprueba que el archivo transferido coincide con el checksum generado en Cloud Shell; no demuestra todavía funcionamiento de la aplicación ni consistencia de la copia frente a escrituras concurrentes.

Se preparó `deploy/vps/restore-colegio.py`. Solo opera sobre archivos locales: vuelve a verificar el checksum, exige destino inexistente, rechaza rutas fuera de `datos/`, enlaces y archivos especiales; valida los tipos de ambos JSON antes de escribir. Copia sin modificar el contenido de los archivos a una carpeta de preparación y genera un manifiesto SHA-256 de archivos restaurados. No usa credenciales, red, GCS ni Docker. Si se interrumpe por falta de disco, no reutilizar ni borrar automáticamente el destino parcial.

Ejecutar en el **VPS**:

```bash
cd /opt/giovsoft
git pull --ff-only origin codex/akira-presentacion
install -d -m 700 /opt/colegio
python3 deploy/vps/restore-colegio.py \
  /root/colegio-migracion-inicial/colegio-inicial.tar.gz \
  /root/colegio-migracion-inicial/colegio-inicial.tar.gz.sha256 \
  /opt/colegio/restauracion-inicial
```

Si termina correctamente, comprobar el manifiesto en otra orden:

```bash
(
  set -eu
  cd /opt/colegio/restauracion-inicial
  sha256sum -c SHA256SUMS > /dev/null
  printf 'Integridad local de la restauración: OK\n'
)
```

Resultado esperado: ambos JSON válidos, 44 archivos restaurados e integridad local OK. Un número distinto debe revisarse contra el respaldo, no corregirse borrando archivos. Ubicaciones resultantes: `data/content.json`, `data/store-accounts.json`, `uploads/` y `SHA256SUMS`. Carpetas privadas y archivos con permisos restringidos; aún no son los volúmenes de un servicio publicado. No montar la carpeta completa en un directorio web público, porque contiene cuentas.

El helper fue probado localmente con un respaldo ficticio: restauración y conservación de bytes; rechazo de checksum erróneo, ruta con `..` y destino existente. Cuatro pruebas pasan. No se ha ejecutado el helper contra los datos reales ni en el VPS desde el asistente. Confirmación remota de extracción pendiente.

### Restauración confirmada a las 17:12; construcción de imagen pendiente

La captura posterior confirma restauración de 44 archivos, JSON válidos y comprobación del manifiesto local OK en `/opt/colegio/restauracion-inicial`. Se cierra el pendiente de extracción remota. No se certifica todavía login, aplicación funcional o copia final consistente.

Próximas órdenes en el **VPS** para construir el candidato desde el código ya inspeccionado, sin publicar puertos, montar datos privados ni arrancar contenedores:

```bash
(
  set -eu
  cd /opt/colegio
  git clone https://github.com/Giovsoft/Iberoamericano.git source
  cd source
  git checkout --detach 9c867b6a8a489bc6140425ee908fa5d8134d628c
  test "$(git rev-parse HEAD)" = 9c867b6a8a489bc6140425ee908fa5d8134d628c
  docker build -t colegio-vps:9c867b6 .
  docker image inspect colegio-vps:9c867b6 --format '{{.Id}}'
)
```

No añadir tokens a la URL de Git ni al chat; utilizar el acceso GitHub del servidor. Si `source` ya existe, el bloque se detendrá para revisarlo sin sobrescribirlo. El contexto Docker es solo `source`, no `/opt/colegio`: los datos restaurados y respaldos no se incorporan a la imagen. El Dockerfile usa su contenido inicial del repositorio; la instancia futura montará los datos privados restaurados por separado. El candidato está fijado al commit conocido, pero la comparación con la revisión desplegada de GCP sigue pendiente antes de cambiar tráfico.

Tras recibir resultado de construcción: preparar entorno privado (administración, correo y storefront), definir persistencia y servicio de comprobación restringido. No iniciar el colegio con la contraseña predeterminada del código ni con credenciales de Stripe test en producción. Durante las comprobaciones, evitar escrituras reales de compras, correo o GCS.

### Imagen construida; instancia privada de lectura

Giovanni informó que la imagen terminó de construirse. Imagen esperada en VPS: `colegio-vps:9c867b6`; arranque remoto aún pendiente. La primera instancia usa datos restaurados reales pero montados en solo lectura; no es el sandbox ficticio de Stripe ni una instancia de producción lista para cambiar DNS.

Configuración preparada en `deploy/vps/compose.colegio-preview.yaml`:

- Proyecto Docker separado `colegio-vps-preview`. No reemplaza el Compose de GiovSoft ni su proxy Caddy.
- Colegio conectado únicamente a red interna, sin salida a GCP, SMTP, Commerce o Stripe. GCS y SMTP desactivados explícitamente; destino Commerce de loopback no operativo.
- Proxy de acceso en `127.0.0.1:8082`. No publica la aplicación en la IP pública del VPS; acceso desde la computadora mediante túnel SSH.
- Proxy bloquea métodos de escritura salvo POST de login de cuentas existentes, que el código no persiste. Contenido e imágenes disponibles; catálogo/historial/pedidos requieren Commerce y devuelven 503. Registro, recuperación, edición, formularios y checkout bloqueados. No interpretar esas limitaciones como un fallo de migración.
- Contraseña administrativa temporal nueva en `/opt/colegio/preview.env`, permisos 0600, fuera del repositorio y distinta de producción. No copiar claves Stripe ni SMTP para esta prueba.

En el **VPS**, actualizar archivos y generar configuración privada sin imprimir la contraseña. El bloque se niega a reemplazar un `preview.env` existente:

```bash
cd /opt/giovsoft
git pull --ff-only origin codex/akira-presentacion
python3 - <<'PY'
import os, secrets
path = '/opt/colegio/preview.env'
fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(fd, 'w') as output:
    output.write('COLEGIO_PREVIEW_ADMIN_PASSWORD=' + secrets.token_hex(32) + '\n')
    output.write('COLEGIO_PREVIEW_PORT=8082\n')
print('Configuración privada creada; contraseña no mostrada.')
PY
```

Después de confirmar creación correcta, iniciar:

```bash
cd /opt/giovsoft
docker image inspect colegio-vps:9c867b6 --format '{{.Id}}'
docker compose --env-file /opt/colegio/preview.env \
  -f deploy/vps/compose.colegio-preview.yaml up -d --wait
```

Si el puerto está ocupado, no detener otro servicio; seleccionar otro puerto en el archivo privado y reflejarlo en las verificaciones/túnel. Si aparece error, no continuar hasta revisarlo. `docker compose config` sin `--quiet` o `docker inspect` sin formato pueden revelar secretos; no compartir esas salidas.

Comprobar desde el **VPS**:

```bash
curl --fail --silent --show-error http://127.0.0.1:8082/api/health
curl --silent --output /dev/null --write-out '%{http_code}\n' \
  http://127.0.0.1:8082/
curl --silent --output /dev/null --write-out '%{http_code}\n' \
  -X POST http://127.0.0.1:8082/api/store/checkout
```

Esperado: JSON health correcto, inicio 200 y checkout bloqueado 405. No ejecutar checkouts de producción.

Para abrir la vista, ejecutar en **Terminal de la Mac**, manteniéndola abierta:

```bash
ssh -N -L 8082:127.0.0.1:8082 root@5.183.11.142
```

Visitar `http://127.0.0.1:8082/`. Si se necesita inspección del panel, Giovanni puede consultar la contraseña temporal personalmente en `nano /opt/colegio/preview.env` en el VPS; no compartirla. No probar recuperación de cuentas ni usar tarjetas. Los datos restaurados no se incluyen en la imagen ni se publican como archivos estáticos de cuentas.

Verificación local ejecutada con imagen del mismo commit y fixture ficticio: ambos servicios healthy, inicio/content/health e imagen 200, checkout/registro/edición 405, catálogo 503, login inexistente y admin sin contraseña 401. Se comprobó red interna exclusiva del colegio, montajes de solo lectura y archivo de cuentas sin cambios. Proyecto temporal de comprobación retirado después; sandbox existente intacto. No se valida todavía cuenta real, correo o pago completo.

Para detener solo esta instancia, sin borrar datos:

```bash
cd /opt/giovsoft
docker compose --env-file /opt/colegio/preview.env \
  -f deploy/vps/compose.colegio-preview.yaml down
```

Antes de cambiar DNS quedan pendientes: comparar revisión GCP, comprobar visualmente datos reales y cuentas mediante acceso privado, preparar configuración de producción y persistencia escribible separada, correo y conexión Commerce, mantenimiento y copia final sin escrituras. La instancia de lectura no debe conectarse directamente a Caddy público.

### Vista previa verificada; preparación de ajustes de producción

Giovanni confirmó que la huella SSH coincide con la consola de Hostinger, que abrió la vista previa por túnel y que páginas e imágenes se ven bien. No equivale a prueba de login, correo, catálogo o pagos.

Se prepararon `colegio.production.env.example`, `compose.colegio-production-check.yaml` y `colegio-production-check.conf`. La nueva instancia de comprobación conserva Commerce y URL canónica, recibe ajustes privados reales, y usa otra copia local de los datos. Continúa en lectura y solo publica `127.0.0.1:8083`; permite consultar catálogo, pero bloquea escrituras, envío de formularios, recuperación y checkout, además de consultas de pedidos que podrían causar conciliación aguas arriba. No se registran consultas en access logs. No necesita claves Stripe, servicio GCS ni credenciales Google.

Preparar en el **VPS**, sin sobrescribir carpetas o configuración existentes:

```bash
(
  set -eu
  cd /opt/giovsoft
  git pull --ff-only origin codex/akira-presentacion
  test ! -e /opt/colegio/production.env
  test ! -e /opt/colegio/produccion-preparacion
  install -m 600 deploy/vps/colegio.production.env.example /opt/colegio/production.env
  mkdir -m 700 /opt/colegio/produccion-preparacion
  cp -a /opt/colegio/restauracion-inicial/data /opt/colegio/produccion-preparacion/
  cp -a /opt/colegio/restauracion-inicial/uploads /opt/colegio/produccion-preparacion/
  cp -p /opt/colegio/restauracion-inicial/SHA256SUMS /opt/colegio/produccion-preparacion/
  cd /opt/colegio/produccion-preparacion
  sha256sum -c SHA256SUMS > /dev/null
  printf 'Copia de preparación íntegra; configuración privada creada.\n'
)
```

Después abrir personalmente `nano /opt/colegio/production.env` en el VPS. Completar todos los campos vacíos con los valores vigentes del servicio **colegio-iberoamericano** en GCP, no con valores del backend GiovSoft ni del sandbox:

- `ADMIN_PASSWORD`: conservar la contraseña actual del panel del colegio.
- `GIOVCOMMERCE_STOREFRONT_SECRET`: secreto actual de conexión con Commerce; no cambiarlo solo en un extremo.
- **Referencia verificada en Cloud Run el 2026-10-26:** `giovcommerce-storefront-secret-clean`, versión **1**. Introducir su contenido privadamente en el campo anterior; no escribir el nombre del secreto como valor. No se consultó su contenido durante la comprobación.
- `SMTP_*`, `MAIL_FROM`, `MAIL_TO`: correo institucional actual, incluidos puerto y modo seguro reales.
- `SUPPORT_SMTP_*`, `SUPPORT_MAIL_FROM`: recuperación de cuentas actual, separada del correo institucional.

Consultar variables y referencias a secretos en la configuración de Cloud Run; si son referencias, el valor se obtiene de la versión referenciada en Secret Manager mediante la sesión autorizada de Giovanni. No pegar valores en el chat, capturas o comandos que queden en historial. Encerrar valores sensibles con comillas simples en el archivo para preservar `$` literales; si un valor contiene comillas simples, resolver su escape antes de arrancar. Archivo 0600 fuera de Git. Nunca ejecutar ni compartir `cat production.env`, `gh auth token`, la salida completa de `docker compose config` o `docker inspect`.

Cuando estén completos, validar sin imprimir valores y arrancar la instancia privada:

```bash
(
  set -eu
  cd /opt/giovsoft
  docker compose --env-file /opt/colegio/production.env \
    -f deploy/vps/compose.colegio-production-check.yaml config --quiet
  docker compose --env-file /opt/colegio/production.env \
    -f deploy/vps/compose.colegio-production-check.yaml up -d --wait
  curl --fail --silent --show-error http://127.0.0.1:8083/api/health
  printf '\n'
  curl --silent --output /dev/null --write-out 'Catálogo HTTP %{http_code}\n' \
    http://127.0.0.1:8083/api/store/catalog
  curl --silent --output /dev/null --write-out 'Checkout bloqueado HTTP %{http_code}\n' \
    -X POST http://127.0.0.1:8083/api/store/checkout
)
```

Esperado: servicios healthy, health correcto, catálogo 200 y checkout 405. Catálogo 200 no certifica storefront secret, pedidos, SMTP o pagos. No enviar correos ni crear órdenes desde la copia privada. Configuración Compose exige los campos privados, pero esa validación solo comprueba presencia, no validez de las credenciales.

Para revisar en navegador, túnel independiente desde la Mac: `ssh -N -L 8083:127.0.0.1:8083 root@5.183.11.142`, abrir `http://127.0.0.1:8083/`. No conectar este proyecto al Caddy público. Persistencia escribible, certificados/dominos, respaldo periódico, ventana de mantenimiento y copia final deben completarse antes del corte. La carpeta `produccion-preparacion` es una copia inicial para comprobaciones, no el estado final de producción.

Verificación del asistente: Compose válido, dos servicios healthy con datos/ajustes ficticios; inicio/health/content/imagen 200; checkout, recuperación y edición 405; pedidos 503; login inexistente 401. Se comprobaron montajes de solo lectura, puerto de aplicación sin publicación directa, URL canónica y destino Commerce correctos, ausencia de variables Stripe y GCS desactivado. No se invocó el catálogo real ni SMTP ni Stripe durante las pruebas locales. Proyecto local temporal retirado. Configuración remota real pendiente de Giovanni.
