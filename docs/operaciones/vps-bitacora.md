# Bitácora del VPS de GiovSoft

Registro de la migración y operación de `giovsoft.com`. Fechas en la zona `America/Mexico_City`. Los comandos de esta guía se ejecutan como `root`, salvo indicación expresa.

## Acuerdos

- Giovanni ejecuta los comandos en el VPS desde la consola de Hostinger. El asistente prepara y documenta los pasos.
- Instalación limpia desde GitHub; no descargar copias ni datos de GCP.
- Conservar el servicio actual hasta verificar el VPS y completar el cambio de DNS.
- No registrar contraseñas, tokens, claves privadas, archivos `.env` completos ni códigos de doble factor. Las evidencias deben estar depuradas.
- Registrar cada acción como **preparada**, **ejecutada y confirmada**, **fallida** o **pendiente de verificar**. Un comando entregado al usuario no cuenta como ejecutado.
- Actualizar esta bitácora al preparar cambios y al recibir resultados del VPS. Si se altera un servicio, anotar cómo verificarlo y cómo revertir el cambio cuando corresponda.

## Inventario inicial

| Elemento | Valor | Evidencia |
| --- | --- | --- |
| Proveedor | Hostinger | Captura facilitada por Giovanni |
| Sistema | Ubuntu 24.04 LTS | Captura del panel; pendiente de comprobar dentro del VPS |
| Host | `srv2026851.hstgr.cloud` | Captura del panel |
| IPv4 | `5.183.11.142` | Captura del panel |
| Directorio previsto | `/opt/giovsoft` | Configuración preparada |
| Repositorio | https://github.com/Giovsoft/GiovSoft | Repositorio del proyecto |
| Rama de instalación | `codex/akira-presentacion` | Incluye el rediseño y la configuración del VPS |
| Configuración | `deploy/vps/compose.yaml` | Versionada en Git |
| Secretos en el VPS | `deploy/vps/.env.production` | Archivo ignorado por Git, generado con permisos 0600 |

## 2026-10-26 — Preparación de la migración

### Ejecutado y confirmado localmente

- Se preparó y publicó el commit `5143e32` en la rama `codex/akira-presentacion`.
- Se añadió Docker Compose con frontend Nginx, API Node, PostgreSQL 16 y Caddy para HTTPS.
- PostgreSQL no publica puertos. La vista previa del frontend escucha únicamente en `127.0.0.1:8080` en el VPS.
- El frontend utiliza `/api` en el mismo dominio para no depender de la API anterior en GCP.
- Se añadió generación de secretos únicos mediante `deploy/vps/init-env.py`, sin imprimirlos ni reemplazar archivos existentes.
- Se corrigió el acceso directo de Nginx a las rutas públicas, incluidos artículos y Akira.
- En un entorno Docker local desechable, frontend, API y PostgreSQL alcanzaron estado saludable. Nginx y la configuración de Caddy validaron correctamente.
- Las rutas `/`, `/akira`, `/servicios`, `/proceso`, `/articulos`, `/articulos/conoce-akira-inteligencia-para-aprender-y-avanzar`, `/studios` y `/payments` respondieron HTTP 200. Una ruta inexistente respondió 404.
- Los contenedores, volúmenes y secretos de esa prueba local se eliminaron después de verificarla. Estas pruebas no certifican todavía el VPS ni su HTTPS público.

### DNS observado, sin modificar

La consulta pública y la respuesta autoritativa de Squarespace indicaron estos servidores: `nsc1.squarespacedns.com`, `nsc2.squarespacedns.com`, `nsc3.squarespacedns.com` y `nsc4.squarespacedns.com`.

Los registros observados fueron:

| Registro | Valor observado |
| --- | --- |
| A raíz | `216.239.32.21`, `216.239.34.21`, `216.239.36.21`, `216.239.38.21` |
| AAAA raíz | `2001:4860:4802:32::15`, `2001:4860:4802:34::15`, `2001:4860:4802:36::15`, `2001:4860:4802:38::15` |
| CNAME www | `ghs.googlehosted.com.` |
| MX raíz | Prioridad 1, `smtp.google.com.` |

Giovanni indicó que Cloudflare administra el dominio; esta diferencia queda pendiente de resolver antes del cambio. Volver a consultar el DNS en ese momento. Preservar correo, verificaciones y otros subdominios.

### Acceso remoto

Un intento SSH se detuvo por un cambio de identidad del servidor. No se omitió la comprobación ni se modificó `known_hosts`. Posteriormente Giovanni indicó que ejecutará los comandos personalmente; no se estableció conexión SSH al VPS.

### Preparado y entregado, pendiente de ejecución confirmada en el VPS

1. Instalar Docker desde el repositorio oficial para Ubuntu.
2. Clonar la rama del sitio en `/opt/giovsoft`.
3. Generar el archivo de secretos.
4. Construir e iniciar frontend, API y PostgreSQL.
5. Revisar el estado de los servicios y la respuesta HTTP local.

Comandos de instalación de Docker entregados:

```bash
apt update
apt install -y ca-certificates curl git python3
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
cat > /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker
```

Comandos de instalación del sitio entregados:

```bash
git clone --branch codex/akira-presentacion https://github.com/Giovsoft/GiovSoft.git /opt/giovsoft
cd /opt/giovsoft
python3 deploy/vps/init-env.py
docker compose --env-file deploy/vps/.env.production -f deploy/vps/compose.yaml up -d --build --wait frontend backend database
docker compose --env-file deploy/vps/.env.production -f deploy/vps/compose.yaml ps
curl -I http://127.0.0.1:8080/akira
```

No repetir `git clone` si `/opt/giovsoft` ya existe; comprobar primero su contenido. No regenerar secretos para una base de datos ya inicializada.

**Resultado esperado:** los tres servicios saludables y HTTP 200 en `/akira`. **Resultado recibido del VPS:** ver entrada de las 13:49; los tres contenedores aparecen saludables. La comprobación HTTP sigue pendiente.

## Pendientes

- Comprobación HTTP completada: Giovanni confirmó respuestas 200 del frontend y de la API. Pendiente HTTPS público.
- Configurar SMTP en el archivo privado y verificar correos y doble factor del administrador.
- Revisar puertos disponibles, firewall y acceso público a 80/443 antes de iniciar Caddy.
- Confirmar quién administra el DNS autoritativo y preparar los registros web.
- Activar Caddy, cambiar DNS y comprobar HTTPS, redirección de www, navegación y API desde fuera del VPS.
- Definir y probar copias de seguridad de los nuevos datos y un procedimiento de restauración.
- Documentar el procedimiento de actualización y reversión con la versión que finalmente quede instalada.

## 2026-10-26 13:49 — Primera construcción e inicio en el VPS

- **Estado:** ejecutada y confirmada mediante captura de la consola enviada por Giovanni.
- **Responsable y entorno:** Giovanni, consola del VPS; prompt `root@srv2026851:/opt/giovsoft`.
- **Evidencia:** imágenes `giovsoft-vps-frontend` y `giovsoft-vps-backend` construidas; imagen `postgres:16-alpine` descargada. Redes `giovsoft-vps_app` y `giovsoft-vps_storage` y volúmenes `giovsoft-vps_backend-data` y `giovsoft-vps_postgres-data` creados.
- **Verificación:** `giovsoft-vps-frontend-1`, `giovsoft-vps-database-1` y `giovsoft-vps-backend-1` aparecen como `Healthy`; el comando terminó y devolvió el prompt sin error visible.
- **Límite de la evidencia:** no se recibió todavía la respuesta de `curl`, la versión Git instalada ni una prueba de HTTPS público, correo o funciones de la aplicación. No se observan cambios de DNS ni inicio de Caddy en esta captura.
- **Siguiente paso:** comprobar HTTP local en `/akira` y el endpoint de salud de la API. Mantener los datos persistentes; no ejecutar `down -v` en el VPS.

## 2026-10-26 — HTTP confirmado y preparación de HTTPS/DNS

- **Estado HTTP:** ejecutado y confirmado por Giovanni en el chat: frontend `/akira` y API `/api/health` responden 200. No se recibió salida textual adicional.
- **DNS verificado de nuevo desde el equipo local:** continúa delegado a los cuatro servidores Squarespace; A y AAAA raíz y CNAME www conservan los valores de Google registrados arriba. No se modificaron registros.
- **Plan entregado, pendiente de ejecución:** comprobar puertos 80/443 y UFW, permitir TCP 80/443 si el firewall está activo y abrir esos puertos también en el firewall de Hostinger; iniciar `edge`; sustituir únicamente los registros web en el DNS autoritativo; comprobar emisión del certificado y respuesta externa.
- **Registros propuestos:** sustituir los cuatro A raíz de Google por un único A `@ → 5.183.11.142`; retirar los cuatro AAAA raíz de Google al no haber IPv6 del VPS configurada; sustituir CNAME `www → ghs.googlehosted.com` por `www → giovsoft.com`. Preservar MX, TXT, DKIM, verificaciones y otros subdominios. TTL 300 si el panel lo permite.
- **Delegación:** no cambiar nameservers en este paso. La incorporación de Cloudflare requiere revisar primero la zona completa y sus nameservers asignados.
- **HTTPS:** Caddy administra certificados y redirección HTTP a HTTPS; necesita DNS al VPS y puertos públicos 80/443. Los certificados no están confirmados todavía. No usar `curl -k` para dar por válida la verificación.
- **Reversión DNS:** restaurar exactamente los A, AAAA y CNAME de Google registrados en el inventario inicial. No eliminar volúmenes ni apagar GCP durante esta verificación. La reversión depende de la propagación y cachés DNS.

Comandos preparados para el VPS:

```bash
cd /opt/giovsoft
ss -ltnp '( sport = :80 or sport = :443 )'
ufw status
# Si UFW está activo:
ufw allow 80/tcp
ufw allow 443/tcp
# No activar UFW ni detener otros servicios sin revisar primero sus reglas y uso.
docker compose --env-file deploy/vps/.env.production -f deploy/vps/compose.yaml up -d edge
docker compose --env-file deploy/vps/.env.production -f deploy/vps/compose.yaml logs --tail=60 edge
```

Si hay otro servicio escuchando en 80/443, revisar antes de iniciar edge. Tras cambiar DNS y obtener certificados, verificar:

```bash
curl -I https://giovsoft.com/akira
curl https://giovsoft.com/api/health
curl -I http://giovsoft.com
curl -I https://www.giovsoft.com
```

**Pendiente de evidencia:** puertos/firewall, cambios DNS efectivamente guardados, certificado emitido y comprobación HTTPS pública contra el VPS.

## 2026-10-26 13:56 — Puertos libres y UFW inactivo

- **Estado:** ejecutado y confirmado por captura de la consola enviada por Giovanni.
- **Evidencia:** `ss -ltnp '( sport = :80 or sport = :443 )'` devolvió únicamente los encabezados, sin listeners TCP en esos puertos. `ufw status` devolvió `Status: inactive`.
- **API:** la misma captura muestra `200 {"ok":true,"service":"giovsoft-api"}`.
- **Decisión:** mantener UFW inactivo durante este paso; no es necesario ejecutar reglas `ufw allow` para continuar con un firewall inactivo. La política del firewall externo de Hostinger sigue sin verificarse.
- **Siguiente paso preparado:** iniciar el servicio `edge`, comprobar su estado y después realizar los cambios DNS web propuestos. El inicio de Caddy y la emisión de certificados todavía no están confirmados.

## 2026-10-26 13:57 — Caddy iniciado

- **Estado:** ejecutado y confirmado por captura de Giovanni.
- **Comando:** `docker compose --env-file deploy/vps/.env.production -f deploy/vps/compose.yaml up -d edge`, seguido de `ps`.
- **Evidencia:** imagen `caddy:2-alpine` descargada, volúmenes `giovsoft-vps_caddy-config` y `giovsoft-vps_caddy-data` creados, contenedor `giovsoft-vps-edge-1` iniciado y en estado `Up`.
- **Puertos publicados:** TCP 80 y 443 y UDP 443 en las interfaces del host. Frontend limitado a `127.0.0.1:8080`; API y PostgreSQL sin puertos publicados al host.
- **Servicios existentes:** frontend, backend y database continúan `healthy`.
- **Límite:** el estado `Up` no confirma accesibilidad externa ni certificado emitido. No hay todavía evidencia de cambios DNS.
- **Siguiente paso:** ajustar únicamente los registros web en el DNS autoritativo y verificar certificado, redirecciones y respuestas públicas.

## 2026-10-26 14:00 — Verificación externa después de guardar DNS

- **Responsable:** Giovanni confirmó haber guardado DNS; el asistente realizó consultas y peticiones externas de solo lectura desde el equipo local.
- **A raíz confirmado:** el servidor consultado como autoritativo y los resolvers `1.1.1.1` y `8.8.8.8` respondieron `5.183.11.142` (TTL observado 1800).
- **AAAA raíz:** sin respuestas en las consultas realizadas al autoritativo y a `1.1.1.1`.
- **www pendiente:** las consultas a los cuatro nameservers Squarespace y a `8.8.8.8` todavía devolvieron `CNAME ghs.googlehosted.com.`. Volver a comprobar después de corregir o propagar el cambio; no se puede confirmar aún `www → giovsoft.com`.
- **HTTP directo al VPS:** `curl --noproxy '*' --resolve giovsoft.com:80:5.183.11.142 -I http://giovsoft.com/akira` respondió `308 Permanent Redirect`, `Server: Caddy`, destino `https://giovsoft.com/akira`. Confirma acceso externo por TCP 80 al VPS.
- **HTTPS directo al VPS:** peticiones con `--resolve` y validación TLS habilitada tanto para `giovsoft.com` como para `www.giovsoft.com` alcanzaron `5.183.11.142`, pero fallaron con `tlsv1 alert internal error` (curl 35). No se confirmó certificado válido ni HTTP 200 público sobre TLS.
- **Caché/ruta anterior:** las peticiones sin resolución forzada desde este equipo todavía recibieron `Server: Google Frontend`, `/akira` en 404 y HTML del sitio anterior en `/api/health`; no cuentan como prueba del VPS. La causa de la selección de la ruta anterior no se ha aislado.
- **Estado:** DNS raíz actualizado; migración HTTPS incompleta. Causa del fallo TLS pendiente de logs de Caddy. No se reinició Caddy ni se eliminaron certificados o volúmenes.
- **Siguiente paso:** revisar CNAME www en el panel y recibir `docker compose --env-file deploy/vps/.env.production -f deploy/vps/compose.yaml logs --tail=100 edge` para identificar errores ACME antes de decidir una corrección.

## 2026-10-26 14:02 — Nueva comprobación tras corregir www

- **Cambio informado:** Giovanni confirmó haber corregido CNAME `www → giovsoft.com` en el panel. Guardado informado por el usuario; propagación todavía no confirmada.
- **DNS observado:** `1.1.1.1` mantiene A raíz `5.183.11.142`; consultas a `8.8.8.8` y `nsc1.squarespacedns.com` todavía devuelven `www CNAME ghs.googlehosted.com.` (TTL restante observado 1833 segundos). Puede haber caché/propagación; este resultado no demuestra que el cambio del panel sea incorrecto.
- **HTTPS probado directamente contra `5.183.11.142`:** `/akira`, `/api/health` y `www` siguen fallando en la negociación TLS con curl 35, `tlsv1 alert internal error`. No se desactivó la validación del certificado.
- **HTTP directo:** Caddy sigue respondiendo 308 hacia `https://giovsoft.com/akira`.
- **Estado:** HTTPS aún no funciona en la prueba directa. Pendiente salida de logs de `edge` para determinar la causa del fallo de certificados; no se realizaron cambios en el VPS.

## 2026-10-26 14:02 — Evidencia del CNAME guardado

- **Confirmado por captura del panel:** registro CNAME, host `www`, destino `giovsoft.com`, TTL `30 mins`. La configuración mostrada es la prevista; no se solicita volver a editarla.
- **Comprobación posterior:** `1.1.1.1` todavía devuelve el destino anterior `ghs.googlehosted.com` (TTL observado 1800). La visibilidad pública del nuevo CNAME sigue pendiente; el TTL no garantiza una hora exacta de propagación.
- **HTTPS directo al VPS:** continúa el error TLS curl 35. Se mantiene pendiente recibir los logs de Caddy para identificar la causa, sin atribuirla únicamente al CNAME.

## 2026-10-26 14:02 — Captura de la zona DNS tras el cambio

- **Confirmado visualmente en el panel:** A `@ → 5.183.11.142` y CNAME `www → giovsoft.com`, ambos con TTL de 30 minutos. En la captura no aparecen registros AAAA raíz.
- **Otros servicios conservados:** A `academy` y `admin-academy` hacia `136.68.177.225`; CNAME `api` y `commerce` hacia `ghs.googlehosted.com`. No forman parte del cambio del sitio principal. El nuevo frontend utiliza `/api` en el mismo dominio.
- **Correo y verificaciones conservados en la captura:** MX raíz prioridad 1 a `smtp.google.com`, SPF de Google, DMARC, DKIM, registros de correo de Stripe y verificaciones TXT. Algunos valores aparecen truncados; la captura no equivale a una exportación completa de la zona.
- **Estado:** configuración web del panel coincide con lo previsto. Falta confirmar propagación del CNAME y resolver el error TLS observado mediante los logs de Caddy, aún no recibidos. No se indican nuevos cambios DNS.

## 2026-10-26 14:03 — Diagnóstico de certificados mediante logs

- **Evidencia:** dos capturas de logs de `edge` enviadas por Giovanni. Los primeros intentos ACME de Let's Encrypt fallan con `unauthorized`: las validaciones HTTP-01 y TLS-ALPN-01 llegan a IPv6 antiguas de Google (`2001:4860:4802:...` para raíz y `2607:f8b0:...` para www), devolviendo 404 o un certificado ajeno a la validación. Esto explica esos intentos fallidos; no indica un fallo del frontend.
- **Intentos posteriores:** Caddy usa ZeroSSL y registra tiempos de espera de solicitudes ACME (`context deadline exceeded` / `Client.Timeout exceeded while awaiting headers`). La causa de esos tiempos de espera no está aislada.
- **DNS externo comprobado después:** raíz sin AAAA en `1.1.1.1`; www aún resuelve vía `ghs.googlehosted.com` a direcciones Google en los resolvers consultados (TTL de la cadena observado entre 68 y 182 segundos en esta comprobación). HTTPS directo al VPS sigue fallando con curl 35.
- **Decisión:** no borrar certificados ni volúmenes, no cambiar configuración TLS ni reiniciar repetidamente. Confirmar que raíz y www resuelvan al VPS antes de provocar un nuevo intento.
- **Siguiente diagnóstico solicitado en el VPS:** `getent ahostsv4 giovsoft.com`, `getent ahostsv4 www.giovsoft.com`, `getent ahostsv6 giovsoft.com`, `getent ahostsv6 www.giovsoft.com`. Se espera IPv4 `5.183.11.142` para ambos y ninguna IPv6 antigua de Google. Salidas aún pendientes.

## 2026-10-26 14:06 — Resolución correcta desde el VPS

- **Confirmado por captura de Giovanni:** `getent ahostsv4` devuelve `5.183.11.142` para raíz y www. `getent ahostsv6` devuelve `::ffff:5.183.11.142`, una representación IPv4-mapped; no es una IPv6 antigua de Google ni una IPv6 nativa configurada para el VPS.
- **Prueba externa posterior:** HTTPS directo contra `5.183.11.142` continúa fallando con curl 35 para ambos nombres. Una consulta a `1.1.1.1` todavía devuelve www vía Google; la resolución local del VPS no garantiza propagación global ni la caché que usará la autoridad certificadora.
- **Siguiente acción preparada para Giovanni:** un único `docker compose --env-file deploy/vps/.env.production -f deploy/vps/compose.yaml restart edge` para iniciar un nuevo ciclo tras la corrección DNS, seguido de `logs --since=2m --tail=100 edge`. Ejecución y certificado aún pendientes de confirmar. No borrar volúmenes ni repetir reinicios si la validación sigue fallando; revisar primero el nuevo error y el DNS.

## 2026-10-26 14:12 — Certificados emitidos y HTTPS del VPS verificado

- **Confirmado por logs enviados por Giovanni:** después del reinicio único, Let's Encrypt validó ambos nombres mediante TLS-ALPN-01 y Caddy registró `certificate obtained successfully` para `giovsoft.com` y `www.giovsoft.com`.
- **Verificación externa independiente:** peticiones curl con `--noproxy '*' --resolve` para conectar directamente a `5.183.11.142`, conservando hostname/SNI y la verificación normal del certificado (sin `-k`). Las tres peticiones HTTPS terminaron con exit 0 y `ssl_verify_result=0`.
- **Akira:** `https://giovsoft.com/akira` devolvió HTTP/2 200, HTML, `via: 1.1 Caddy`.
- **API:** `https://giovsoft.com/api/health` devolvió HTTP/2 200 y `{"ok":true,"service":"giovsoft-api"}`.
- **www:** `https://www.giovsoft.com/akira` devolvió 301 a `https://giovsoft.com/akira`, con certificado válido.
- **HTTP:** `http://giovsoft.com/akira` contra el VPS devolvió 308 al mismo path por HTTPS.
- **DNS:** `8.8.8.8` confirma A raíz `5.183.11.142`. La consulta a `1.1.1.1` aún devuelve www vía Google; queda pendiente confirmar convergencia de cachés públicas. El éxito del origen no se presenta como propagación global completada.
- **Estado:** HTTPS y endpoint de salud del VPS funcionan. No se verificaron todavía SMTP, acceso administrativo con doble factor, envío de formularios ni restauración de copias. Mantener GCP hasta cerrar la verificación funcional y la propagación.

## 2026-10-26 14:14 — Dominio operativo y www confirmado mediante DNS sobre HTTPS

- **Pruebas por dominio sin `--resolve`:** `/`, `/akira`, `/articulos/conoce-akira-inteligencia-para-aprender-y-avanzar` y `/api/health` en `https://giovsoft.com` devolvieron 200 desde `5.183.11.142`, con verificación TLS 0 y curl exit 0. La API devolvió `{"ok":true,"service":"giovsoft-api"}`. HTTP `/akira` devolvió 308 al mismo path por HTTPS.
- **Recursos iniciales:** los seis JS/CSS referenciados por el HTML y `/img/akira/logo-transparent.png` devolvieron 200 por dominio desde el VPS y con TLS válido. Esto comprueba entrega HTTP, no una prueba funcional completa del navegador ni de todos los módulos.
- **DNS sobre HTTPS independiente:** `https://dns.google/resolve?name=www.giovsoft.com&type=A` y `https://cloudflare-dns.com/dns-query?name=www.giovsoft.com&type=A` (Accept application/dns-json) devolvieron CNAME `www.giovsoft.com → giovsoft.com` y A `5.183.11.142`, TTL observado 1800. Confirma el cambio en ambos proveedores por ese canal.
- **Diferencia de resolución detectada:** las consultas DNS convencionales efectuadas desde este equipo todavía devuelven Google para www; el curl normal a www llegó a `192.178.52.147` (Google Frontend), respondió 301 a `https://giovsoft.com/akira` y validó TLS. No atribuir esa respuesta a Caddy. La causa exacta de la discrepancia del canal DNS convencional no está aislada (posible caché o intermediación local).
- **www en el VPS:** certificado y redirección 301 ya verificados directamente contra el VPS en la entrada de las 14:12. Los proveedores DoH principales ahora publican el destino correcto, aunque no se garantiza convergencia de todas las cachés mundiales.
- **Conclusión operativa:** sitio principal y endpoint de salud sirven correctamente desde el dominio en el VPS; www actualizado en Google y Cloudflare por DoH, con resolución residual anterior observada en este equipo. No modificar DNS de nuevo por esa caché. SMTP, formularios, administración y restauración de copias siguen pendientes de pruebas específicas.

## 2026-10-26 — Solicitud de retirar el sitio de GCP

- **Solicitud:** Giovanni indicó «vamos a bajar el sitio de gcp». Continúa ejecutando personalmente los comandos remotos.
- **Estado:** preparación e identificación; ningún servicio GCP detenido ni eliminado.
- **Alcance inicial:** identificar el servicio del sitio principal antes de actuar. `api` y `commerce` siguen configurados hacia Google; no asumir que pueden retirarse ni que están alojados en servicios separados.
- **Siguiente paso solicitado:** desde Google Cloud Shell, ejecutar `gcloud config get-value project` y `gcloud run services list` y compartir las salidas para identificar proyecto, región y servicio. Cloud Run es una hipótesis de alojamiento que debe confirmarse con el inventario.
- **Condición para la retirada:** revisar dependencias y resolución residual de www; definir la acción concreta y su reversión con los identificadores reales. No borrar proyecto, bases de datos, imágenes ni otros servicios como parte de esta identificación. No descargar datos ni copias de GCP.

## 2026-10-26 — Inspección de GCP mediante navegador

- **Autorización:** Giovanni pidió realizar la revisión desde el navegador. Se inspeccionó la consola autenticada; no se ejecutaron comandos en el VPS ni se modificaron servicios GCP.
- **Proyecto confirmado:** GiovSoft, `healthy-genre-497401-j7`.
- **Mapeos confirmados en Cloud Run:** `giovsoft.com`, `www.giovsoft.com` y `admin.giovsoft.com` comparten servicio `giovsoft`, región `us-central1`; `api.giovsoft.com` usa `giovsoft-backend` en esa región; `commerce.giovsoft.com` usa `giovcommerce`.
- **Otros servicios observados:** `colegio-iberoamericano`, `cruje`, `giovsoft-web` y `giovsoft-api`. Los dos últimos están en `northamerica-south1`; su nombre no basta para atribuirles el sitio público actual. No se tocaron.
- **Configuración actual de giovsoft:** URL `https://giovsoft-598441636410.us-central1.run.app`, escalamiento automático, mínimo de servicio 0, máximo 5, facturación basada en solicitudes, timeout 300 s y concurrencia 80.
- **Dependencia detectada:** apagar `giovsoft` retiraría también el administrador antiguo. Se solicitó a Giovanni aclarar si ese administrador puede retirarse. La decisión queda pendiente; no se borró ni desactivó ningún servicio ni mapeo.

## 2026-10-26 — Servicio GCP del sitio y administrador antiguo desactivado

- **Autorización expresa:** Giovanni confirmó «Retirar también el administrador antiguo» después de identificar que comparte el servicio `giovsoft` con raíz y www.
- **Ejecutado por el asistente desde la consola web de GCP:** proyecto `healthy-genre-497401-j7`, Cloud Run, servicio `giovsoft`, región `us-central1`. Se cambió de escalamiento automático (mínimo 0, máximo 5) a **escalamiento manual con 0 instancias** y se implementó el cambio. No se borró el servicio ni se descargaron datos de GCP.
- **Diferencia revisada:** el diálogo mostró el paso a manual/0 y retiró el máximo 5 de escalamiento de revisión de la nueva configuración. Facturación por solicitudes, timeout 300 s y concurrencia 80 permanecieron visibles sin cambios.
- **Verificación en consola:** actualización del servicio, creación de revisión y enrutamiento de tráfico completados. Indicador: «El servicio está pausado porque la instancia se fijó en 0 para el escalado manual». Campo de instancias guardado en 0.
- **Verificación externa posterior, sin forzar IP:** `https://giovsoft-598441636410.us-central1.run.app` devuelve 503; `https://giovsoft.com/akira` y `/api/health` devuelven 200 desde `5.183.11.142` con TLS válido. `https://www.giovsoft.com/akira` ahora conecta a `5.183.11.142`, valida TLS y devuelve 301 a `https://giovsoft.com/akira`.
- **Administrador antiguo:** comparte el servicio desactivado. La petición externa a `admin.giovsoft.com` no pudo resolver DNS desde este equipo; no se presenta como una respuesta HTTP 503 verificada de ese hostname. No se modificó su DNS.
- **Conservado:** revisiones, mapeos y recursos existentes para reversión. No se tocaron los servicios `giovsoft-backend`, `giovcommerce`, `giovsoft-web`, `giovsoft-api`, `cruje` ni `colegio-iberoamericano`; no se eliminaron bases de datos, imágenes, secretos, proyecto ni facturación.
- **Límite:** la desactivación de este servicio no significa que toda la facturación GCP quede en cero. Cloud Run documenta que las revisiones activas únicamente por etiquetas de tráfico no quedan desactivadas por manual/0; no se auditó aquí el acceso de todas las URLs de revisiones etiquetadas.
- **Reversión preparada, no ejecutada:** en la misma pestaña Escalamiento, seleccionar automático, mínimo de servicio 0 y máximo de servicio 5; restaurar máximo de revisión 5 si se requiere replicar la configuración anterior; revisar diferencia e implementar. También existe el comando `gcloud run services update giovsoft --project=healthy-genre-497401-j7 --region=us-central1 --scaling=auto` para reactivar el modo automático, seguido de revisión explícita de los límites. El DNS público del sitio permanece en el VPS salvo un cambio posterior autorizado.
- **Evidencia:** [Captura de la configuración aplicada](evidencias/gcp-giovsoft-pausado-2026-10-26.png).
- **Referencia:** [Desactivar un servicio con escalamiento manual](https://docs.cloud.google.com/run/docs/configuring/services/manual-scaling#disable-service).

## 2026-10-26 — Auditoría de uso de la API antigua: conservar por integraciones de pagos

- **Solicitud:** retirar también la API antigua únicamente después de revisar que ya no se use.
- **Servicio identificado:** `giovsoft-backend`, proyecto `healthy-genre-497401-j7`, región `us-central1`, dominio `api.giovsoft.com`, URL `https://giovsoft-backend-598441636410.us-central1.run.app`.
- **Auditoría desde navegador:** se revisaron registros de Cloud Run y el Explorador de registros durante el último día. Consulta de solicitudes funcionales utilizada:

```text
resource.type="cloud_run_revision"
resource.labels.service_name="giovsoft-backend"
resource.labels.location="us-central1"
httpRequest.requestUrl:*
NOT httpRequest.requestUrl:"/api/health"
```

- **Hallazgos de uso:** el 26 de octubre se observó `POST /api/v1/checkout/sessions` con respuesta 201 a las 14:15:27 y múltiples `GET /api/v1/orders/[id]` con respuesta 200 alrededor de las 14:54:53–54 (hora local mostrada por la consola). Registros de aplicación también mostraron conciliación de órdenes pagadas en Stripe sin webhook. Se omiten identificadores y detalles de pagos en esta bitácora.
- **Tráfico adicional:** comprobaciones `/api/health` periódicas con user-agent `node` hasta las 15:44; en la consulta sin salud también aparecen exploraciones automatizadas que devolvieron 404. No confundir esas exploraciones ni los health checks con el uso de checkout y órdenes verificado.
- **Aclaración expresa del usuario:** ante estos hallazgos Giovanni respondió «Hay pagos o integraciones que debemos conservar». Por ello **la API antigua permanece activa**. No se modificaron escalamiento, DNS, credenciales, webhooks ni datos del servicio.
- **Independencia del sitio nuevo comprobada:** Compose compila con `VITE_API_URL=/`; el módulo API JS servido actualmente por `https://giovsoft.com` contiene `baseURL: /` y no contiene `api.giovsoft.com`. El código fuente conserva un fallback antiguo y ejemplos de webhooks con ese hostname; no equivalen a llamadas activas de la compilación actual.
- **Estado HTTP posterior:** Akira y `/api/health` en el dominio principal responden 200 desde `5.183.11.142` con TLS válido. `https://api.giovsoft.com/api/health` y la URL run.app de `giovsoft-backend` también responden 200 con TLS válido. Esas dos últimas peticiones son verificaciones del asistente y deben distinguirse del tráfico previo.
- **Límite:** los logs observados identifican rutas y user-agent, pero no permiten atribuir con certeza el cliente a Commerce u otro sistema. No se consultaron cuerpos de órdenes ni se crearon pagos de prueba. No se migraron los datos antiguos: la base del VPS sigue siendo una instalación limpia.
- **Condiciones previas para retirar la API:** identificar consumidores y endpoints de webhooks; decidir dónde conservar sus datos y credenciales sin exponerlos; migrar o separar pagos e integraciones preservando identificadores y firmas; validar callbacks y consultas de órdenes y observar el tráfico antes de apagar. Cambiar únicamente el CNAME de api al VPS no garantiza continuidad con una base nueva.
- **Estado final de esta etapa:** sitio y administrador antiguo de GCP pausados; API de pagos antigua conservada por dependencia confirmada. La retirada de la API queda pendiente de resolver esa dependencia.

## 2026-10-26 — Desactivar controles de pagos/Stripe del administrador del VPS

- **Alcance confirmado por Giovanni:** desactivar únicamente las funciones de pagos y Stripe en `giovsoft.com/admin`; conservar el resto del panel y la conexión de Stripe con Colegio Iberoamericano.
- **Preparado en el repositorio, aún NO aplicado al VPS:** se retira Payments del menú y su importación; acceso directo `/admin/payments` redirige al inicio del panel. Facturación deja de cargar el motor Payments y se eliminan sus vistas internas de Stripe, conservando CFDI y validación fiscal. Ventas conserva consultas y reportes, retirando marcar como pagada y reintentar notificaciones. Aplicaciones deja de permitir editar el webhook de pagos y la sincronización de pagos.
- **Bloqueo en servidor del VPS:** nuevo middleware tras la autenticación administrativa devuelve 403 con código `ADMIN_PAYMENTS_DISABLED` para `/api/admin/payments`, escrituras de `/api/admin/orders` y cambios explícitos de webhook/sincronización de pagos a través de `/api/admin/applications`. Se preservan consultas de órdenes, SAT y los restantes endpoints del panel. Ediciones de configuración de aplicaciones conservan campos previos omitidos; las nuevas aplicaciones administrativas no habilitan sincronización de pagos por defecto.
- **Integración preservada:** no se modificaron el servicio `giovsoft-backend` de GCP, Stripe, claves, webhooks externos, DNS de api ni datos del colegio. Las rutas públicas de checkout, consultas de órdenes y callbacks no se alteraron. No se realiza un cambio de destino del colegio hacia la base nueva del VPS.
- **Pruebas locales:** dos pruebas Node pasan, cubriendo controles denegados y el paso de rutas administrativas de consulta y rutas públicas de integración. Compilación TypeScript, build Vite y revisión de sintaxis de backend correctos; Vite conserva aviso de chunks mayores a 500 kB. Las pruebas con handlers simulados comprueban el límite de acceso, no una transacción Stripe real.
- **Disponibilidad externa observada:** `https://colegioiberoamericano.com` responde 200 y `https://api.giovsoft.com/api/health` devuelve ok. No se crearon cargos, sesiones de checkout ni cambios de estado de órdenes para verificar este trabajo.
- **Pendiente:** Giovanni ejecuta el despliegue en el VPS, según el acuerdo de operación. No afirmar que los controles de producción están desactivados hasta recibir el resultado y verificarlos. GCP permanece activo para las integraciones conservadas.

Comandos preparados (VPS, root):

```bash
cd /opt/giovsoft
git status --short
git rev-parse HEAD
# Si hay cambios locales en archivos versionados, revisar antes de actualizar.
git pull --ff-only origin codex/akira-presentacion
docker compose --env-file deploy/vps/.env.production -f deploy/vps/compose.yaml up -d --build --wait frontend backend
curl -I https://giovsoft.com/akira
curl https://giovsoft.com/api/health
```

No ejecutar `down -v`, no editar `.env.production` y no ejecutar estos comandos contra GCP. Después comprobar con sesión administrativa que Payments no aparece, su URL redirige, Ventas no ofrece acciones de pago y Facturación sigue disponible; una petición autenticada al motor Payments debe devolver 403. Una petición sin sesión sigue devolviendo 401 por la autenticación previa.

**Reversión preparada:** conservar el hash mostrado antes de actualizar. Si es necesario, crear una rama temporal en ese commit con el árbol limpio y reconstruir únicamente frontend/backend con el mismo Compose; no revertir secretos ni volúmenes. No ejecutar esta reversión sin revisar primero el estado del checkout.

## 2026-10-26 16:09 — Verificación de publicación y conservación del servicio del colegio

- **Despliegue informado por Giovanni:** confirmó ejecutar los comandos de actualización y reconstrucción de frontend/backend en el VPS. No se recibió el log completo ni el hash remoto.
- **Frontend de producción verificado por HTTPS:** el HTML actual sirve chunks nuevos: `AdminBilling-BqVSQO9C.js`, `AdminSales-CgnNPeBC.js`, `AdminApplications-DWchY1Jy.js`. La entrada principal no incluye `AdminPayments`; los chunks revisados no contienen `/api/admin/payments/engine`, `stripeProvider`, `mark-paid`, las acciones `/retry` ni el campo «Webhook saliente (pagos)». Confirma que el código nuevo está publicado, sin equivaler a inspección visual con sesión.
- **API del VPS:** `https://giovsoft.com/api/health` responde 200 desde `5.183.11.142`, TLS válido. `/api/admin/payments/engine` sin credenciales responde 401, que es lo esperado por la autenticación previa al bloqueo de pagos. **No se interpreta 401 como prueba del 403 para un administrador autenticado.**
- **Sesión administrativa:** al abrir `/admin/payments` en Chrome se presenta el inicio de sesión. Se pidió a Giovanni iniciar sesión personalmente, sin compartir contraseña ni 2FA. Pendiente comprobación visual del menú, redirección y bloqueo autenticado.
- **Colegio:** sitio público `https://colegioiberoamericano.com` responde 200 con TLS válido; página `/otros-servicios` muestra la tienda y 17 servicios. No se agregaron productos, iniciaron checkouts ni efectuaron cargos.
- **Integración conservada en GCP:** consola de `giovsoft-backend` confirma servicio en buen estado, escalamiento automático, mínimo 0 y máximo 5. `https://api.giovsoft.com/api/health` responde 200 con TLS válido. No se modificaron el servicio, claves, webhooks ni configuración Stripe del colegio.
- **Límite:** estas comprobaciones confirman disponibilidad y publicación del cambio. No certifican un pago completo ni la entrega reciente de un webhook Stripe del colegio; eso requiere evidencia de una operación legítima o una prueba específica autorizada en modo de prueba.

## 2026-10-26 — Recuperación del acceso administrativo pendiente

- Giovanni indicó que no recuerda la contraseña. No se restableció ninguna credencial ni se leyó el archivo privado del VPS.
- La instalación generó una contraseña inicial aleatoria en `deploy/vps/.env.production`, variable `ADMIN_PASSWORD`. Se indica consultarla personalmente con `nano /opt/giovsoft/deploy/vps/.env.production`, sin compartir el contenido ni capturas del archivo.
- Esa contraseña corresponde a la creación inicial del usuario; si posteriormente cambió desde el panel, la copia de entorno puede dejar de coincidir con el hash persistido. No regenerar `.env.production`, no cambiar secretos de base de datos y no borrar volúmenes para recuperar acceso.
- La prueba autenticada del bloqueo de pagos queda pendiente del inicio de sesión de Giovanni. No se desactiva 2FA para completar la verificación.

## Plantilla para próximas entradas

### AAAA-MM-DD HH:MM — Acción

- **Estado:** preparada / ejecutada y confirmada / fallida / pendiente de verificar.
- **Responsable y entorno:** quién ejecutó; VPS, equipo local o panel DNS.
- **Objetivo y versión:** cambio concreto y commit cuando aplique.
- **Comandos o cambios:** sin secretos.
- **Verificación y evidencia:** resultado recibido y criterio de éxito.
- **Reversión:** procedimiento concreto si aplica, sin eliminar datos persistentes.
- **Siguiente paso:** pendiente resultante.
