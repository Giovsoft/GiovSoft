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

## 2026-10-26 — Credenciales iniciales rechazadas: diagnóstico PostgreSQL

- Giovanni informó que las credenciales del archivo de entorno son rechazadas. No se recibió ni registró su contraseña.
- **Hallazgo en el código:** `ensureAdminUsersFile()` crea un usuario inicial con ADMIN_EMAIL/ADMIN_PASSWORD para almacenamiento JSON. La rama PostgreSQL de `readAdminUsers()` consulta `admin_users` y solo contempla alta automática de un master si existen MASTER_ADMIN_EMAIL/MASTER_ADMIN_PASSWORD; el Compose del VPS no configura esas variables master. Por tanto, la instalación PostgreSQL limpia puede no haber creado el administrador inicial. Es una causa probable del rechazo, pendiente de confirmar el contenido de la tabla en el VPS.
- Se preparó una consulta de solo lectura: `SELECT count(*) AS administradores FROM admin_users`. Giovanni la ejecutará dentro del contenedor database. Si devuelve cero, crear explícitamente la cuenta inicial; si hay usuarios, revisar email/estado antes de restablecer la contraseña. No regenerar secretos, no crear master ni desactivar 2FA para diagnosticar.
- La afirmación anterior de que ADMIN_PASSWORD permitiría entrar se limita al caso en que el usuario inicial realmente se haya creado. La existencia de esa variable no prueba que haya un usuario PostgreSQL asociado.

## 2026-10-26 — Alta inicial del administrador PostgreSQL preparada

- **Confirmación de Giovanni:** la consulta a `admin_users` devolvió 0 administradores. Autorizó crear la cuenta inicial.
- **Herramienta añadida:** `deploy/vps/create-initial-admin.cjs`, ejecutada por stdin dentro del contenedor backend con sus variables existentes. Toma ADMIN_EMAIL, ADMIN_NAME y ADMIN_PASSWORD sin imprimir contraseña ni hash.
- **Protección:** transacción y bloqueo de la tabla antes de comprobar que está vacía; se niega a cambiar usuarios si existe cualquiera. Inserta un único usuario ordinario Administrador activo (no master), con PBKDF2-SHA256 de 120000 iteraciones compatible con el login. No modifica 2FA, sesiones, SMTP, otros secretos, datos del colegio ni GCP.
- **Pruebas locales:** tres pruebas pasan: alta con hash verificable, rechazo de tabla no vacía con rollback y rechazo de credenciales ausentes antes de abrir conexión. Se comprobó también la ejecución por stdin y su rechazo seguro sin credenciales. No se ejecutó contra PostgreSQL del VPS desde el equipo local.
- **Estado:** preparado; alta remota pendiente de ejecución y confirmación de Giovanni. No se considera creada hasta recibir el resultado.

Comandos entregados para el VPS:

```bash
cd /opt/giovsoft
git pull --ff-only origin codex/akira-presentacion
docker compose --env-file deploy/vps/.env.production -f deploy/vps/compose.yaml exec -T backend node < deploy/vps/create-initial-admin.cjs
docker compose --env-file deploy/vps/.env.production -f deploy/vps/compose.yaml exec -T database psql -U giovsoft_app -d giovsoft -c "SELECT email, role, status FROM admin_users;"
```

No requiere reconstruir imágenes porque el script se transmite por stdin. Iniciar sesión con ADMIN_EMAIL/ADMIN_PASSWORD del entorno existente; el doble factor seguirá requiriendo SMTP operativo. Si falla el envío 2FA, configurar SMTP en lugar de desactivar la protección. No volver a ejecutar `init-env.py` ni borrar volúmenes para este procedimiento.

## 2026-10-26 — Desactivación de 2FA del VPS solicitada

- **Cambio de criterio autorizado expresamente:** Giovanni indicó «vamos a quitar el 2FA». Esta solicitud sustituye el criterio previo de mantenerlo activo para el administrador del VPS.
- **Preparado en Compose:** ADMIN_2FA_ENABLED ahora toma la variable del archivo de entorno, con valor true por defecto para instalaciones que no indiquen otra cosa. Se añade la opción al ejemplo de entorno. El backend ya implementa la desactivación con el valor literal false.
- **Procedimiento entregado:** actualizar el checkout; establecer ADMIN_2FA_ENABLED=false en el archivo privado del VPS y recrear solo backend con Compose. No basta con reiniciarlo: hay que recrear el contenedor para aplicar el entorno.
- **Alcance:** acceso administrativo del backend del VPS mediante correo y contraseña, sin solicitar el código adicional. No se altera la contraseña, los datos, Stripe ni el servicio de integración del colegio en GCP.
- **Estado:** preparado y validado localmente; aplicación y prueba de login en el VPS pendientes de confirmación. No se ha recibido aún confirmación del alta inicial del administrador.
- **Reversión:** cambiar ADMIN_2FA_ENABLED=true y ejecutar el mismo `up -d --no-deps --force-recreate backend`; para usar 2FA por correo será necesario SMTP operativo.

Comandos preparados:

```bash
cd /opt/giovsoft
git pull --ff-only origin codex/akira-presentacion
sed -i '/^ADMIN_2FA_ENABLED=/d' deploy/vps/.env.production
printf '\nADMIN_2FA_ENABLED=false\n' >> deploy/vps/.env.production
docker compose --env-file deploy/vps/.env.production -f deploy/vps/compose.yaml up -d --no-deps --force-recreate --wait backend
```

Verificación sin revelar secretos:

```bash
docker compose --env-file deploy/vps/.env.production -f deploy/vps/compose.yaml exec -T backend node -e 'console.log("ADMIN_2FA_ENABLED=" + process.env.ADMIN_2FA_ENABLED)'
```

## 2026-10-26 16:23 — Revisión autenticada del panel y disponibilidad del colegio

- **Acceso confirmado:** Giovanni informó que pudo entrar. Se observó en Chrome una sesión administrativa activa de `hola@giovsoft.com`, rol Administrador. Se resuelve el pendiente de disponer de una sesión para revisar la interfaz; no se leyó contraseña, token ni código 2FA.
- **Payments desactivado en la interfaz:** no existe enlace Payments en el menú. Al navegar con sesión a `https://giovsoft.com/admin/payments`, la aplicación redirige a `https://giovsoft.com/admin` y muestra el Dashboard.
- **Facturación conservada:** carga correctamente; solo ofrece las pestañas «Emisión CFDI» y «Validación fiscal», sin controles ni configuración de Stripe o motor Payments. El proveedor fiscal muestra «Configuración pendiente»; no se emitieron CFDI ni se cambiaron ajustes.
- **Aplicaciones:** se abrió el formulario de nueva aplicación para inspeccionarlo; no ofrece webhook saliente de pagos ni checkbox de sincronización de pagos. Se canceló sin guardar. El panel lista cero aplicaciones conectadas, consistente con la base nueva y separado de la integración que permanece en GCP.
- **Ventas:** reportes y listado cargan sin error. La base del VPS no contiene órdenes; por ello no se pudo abrir una orden existente para comprobar visualmente su drawer. Las acciones de cobro ya están ausentes del código publicado, comprobado en la entrada anterior.
- **API administrativa:** no se extrajo el token ni se fabricó una sesión para invocar endpoints. La prueba directa del 403 con autenticación continúa sin realizarse; el bloqueo del middleware fue probado localmente y la interfaz desplegada se verificó con sesión. No confundir redirección de React con una comprobación HTTP 403 de backend.
- **Disponibilidad externa nueva:** `/api/health` del VPS responde 200 desde `5.183.11.142`, TLS válido. `https://api.giovsoft.com/api/health` responde 200 en Google y `https://colegioiberoamericano.com/otros-servicios` responde 200, ambos con TLS válido.
- **Conexión del colegio preservada:** no se alteraron GCP, endpoints, claves Stripe, webhooks ni datos. La tienda y la API siguen disponibles. No se creó checkout, cargo, devolución, conciliación ni modificación de orden; no se certifica un pago de extremo a extremo ni entrega reciente de webhook basándose únicamente en estas respuestas 200.
- **Evidencia visual:** [Facturación sin módulo Payments ni configuración Stripe](evidencias/admin-sin-pagos-stripe-2026-10-26.png).
- **Estado:** interfaz administrativa de pagos retirada y revisión autenticada completada para los controles visibles; integración del colegio conservada y disponible, con validación transaccional pendiente si se requiere.

## 2026-10-26 — Preparación del flujo completo Stripe/colegio en modo de prueba

- **Autorización:** Giovanni solicitó verificar el flujo completo únicamente en modo de prueba y sin cargos reales.
- **Exploración realizada:** Dashboard Stripe autenticado abierto en modo de prueba; el aviso visible confirma que no se procesarán transacciones reales en ese Dashboard. La vista Connect no muestra cuentas de prueba. Se guardó [evidencia](evidencias/stripe-prueba-cuentas-2026-10-26.png).
- **GCP inspeccionado solo en lectura:** referencias de secretos Stripe del servicio `giovsoft-backend`, sin revelar contenido ni cambiar claves o configuración. El modo de las claves usadas por ese backend no se ha confirmado. El modo del Dashboard no cambia el modo del backend.
- **Dependencia pendiente:** no se identificó un entorno separado del colegio con hub, almacenamiento y callbacks de prueba. No se encontró su código dentro del workspace inspeccionado. Se pidió URL/repositorio de staging o autorización para prepararlo.
- **Plan escrito:** [Casos de prueba Stripe/colegio](stripe-colegio-pruebas.md), con checkout, pago de prueba, firma y entrega de webhook, callback, confirmación en el colegio, idempotencia, rechazo y cancelación.
- **Estado:** no se ejecutó ningún checkout ni pago. No se crearon cuentas conectadas, credenciales, cargos, destinos de eventos ni reembolsos. No se modificaron VPS, GCP, datos ni Stripe de producción. No presentar esta preparación como validación completa de la integración.

## 2026-10-26 16:42 — Sandbox separado del colegio preparado y levantado localmente

- **Autorización:** Giovanni confirmó que no existe entorno de prueba y solicitó preparar uno separado de producción para Colegio Iberoamericano y Stripe, sin cargos reales.
- **Código localizado mediante GitHub:** `Giovsoft/Iberoamericano` y `Giovsoft/GiovCommerce`. Se clonó código fuente, no datos de servicios GCP. Checkouts locales de solo lectura fijados en `9c867b6a8a489bc6140425ee908fa5d8134d628c` (colegio) y `7d5f7763b52493d107a163e47462220acbdfa54d` (Commerce), documentados en `deploy/stripe-sandbox/sources.lock.json`.
- **Cadena real identificada:** tienda del colegio → GiovCommerce (`/api/public/checkout`) → hub GiovSoft (`/api/v1/checkout/sessions`) → Stripe Connect → webhook al hub → callback firmado a Commerce → consulta/retorno en colegio. Por eso el sandbox incluye los tres componentes, no solo una página Stripe.
- **Decisión de implementación:** primer entorno en Docker del equipo local, sin despliegue remoto, nuevos dominios ni cambios DNS. Proyecto `giovsoft-stripe-sandbox`; volúmenes nuevos para colegio, Commerce y hub; datos ficticios y credenciales internas nuevas. No se reutilizan la base del VPS, Cloud SQL, buckets ni secretos de producción.
- **Puertos locales:** colegio `http://127.0.0.1:7410/otros-servicios`, Commerce `http://127.0.0.1:7411`, hub `http://127.0.0.1:7412`. El proxy local publica únicamente loopback y añade aviso visible «SANDBOX LOCAL · Datos ficticios · Solo Stripe de prueba · Sin cargos reales» y noindex.
- **Aislamiento:** colegio y Commerce solo en red Docker interna; hub con red adicional de salida para Stripe. Guard de arranque rechaza claves live, almacenamiento externo, correo SMTP y destinos de backend de producción. La cuenta y la clave Stripe test todavía no se han introducido. Sin clave, cuenta y secreto de webhook, el checkout del hub devuelve 503 `SANDBOX_STRIPE_NOT_READY` y no cae en simulación manual.
- **Datos nuevos:** un cliente ficticio, aplicación con claves exclusivas, tienda y producto ficticio de 20 MXN. El dominio del catálogo es solo un identificador interno para conservar la lógica actual de selección de métodos; las URL de retorno y callbacks apuntan exclusivamente al sandbox. No hay clientes, alumnos ni órdenes reales importados.
- **Verificación ejecutada:** imágenes construidas; los tres servicios están `healthy`. Sus endpoints `/api/health` devuelven 200. El catálogo consultado a través del colegio llega a Commerce y devuelve un producto ficticio. La prueba de checkout sin credenciales devolvió el 503 previsto sin generar sesión Stripe. Tres pruebas del guard pasan; sintaxis de helpers y configuración Compose validadas; Nginx valida y sirve el aviso visible.
- **Stripe CLI:** imagen oficial 1.55.2 descargada y fijada por digest. El wrapper del listener, probado sin clave, se negó a arrancar con exit 1 antes de contactar con Stripe. El helper de captura de firma está preparado, pero no se ejecutó contra Stripe por faltar credenciales.
- **Evidencia visual:** [Tienda local aislada](evidencias/colegio-sandbox-local-2026-10-26.png).
- **Guía reproducible:** [Sandbox local y configuración privada](../../deploy/stripe-sandbox/README.md). Scripts de preparación de fuentes, generación privada de entorno, fixtures, lectura de cuenta Stripe y listener incluidos en `deploy/stripe-sandbox/`.
- **Estado:** infraestructura local y catálogo listos. **Integración Stripe test todavía pendiente** de que Giovanni introduzca personalmente una clave test y configure/identifique una cuenta Connect de prueba del mismo entorno. Luego verificar capacidades mediante lectura Stripe, preparar la firma del listener y ejecutar el flujo completo. No se creó clave, cuenta Stripe, checkout, cargo, devolución ni destino de eventos.
- **Producción:** no se cambiaron VPS, GCP, DNS, credenciales ni integración existente del colegio. La configuración del administrador del VPS sigue separada del sandbox.

## 2026-10-26 — Inicio de evaluación para migrar Colegio Iberoamericano al VPS

- **Solicitud:** Giovanni pidió incorporar la migración del colegio al VPS. Se mantiene pendiente configurar Stripe test en el sandbox local; esta solicitud no autoriza sustituir claves de producción por claves de prueba.
- **Revisión ejecutada:** lectura del repositorio del colegio fijado en `9c867b6a8a489bc6140425ee908fa5d8134d628c` y del Compose/Caddyfile actuales de GiovSoft. No se ejecutaron comandos en el VPS ni cambios en GCP o DNS.
- **Persistencia identificada:** el servidor del colegio guarda contenido editable, cuentas de tienda y archivos subidos en GCS cuando `GCS_BUCKET` está configurado. Sin GCS usa `/app/data` y `/app/public/uploads`; ambos requerirán almacenamiento persistente y respaldo en el VPS. El contenido del repositorio no demuestra que estén incluidos los últimos cambios de producción.
- **Integraciones identificadas:** catálogo y checkout pasan por GiovCommerce; el hub de pagos y Stripe permanecen separados. Correo institucional y recuperación de contraseña usan configuraciones SMTP distintas. Deben verificarse antes de cortar tráfico.
- **Propuesta pendiente de decisión:** migrar primero el sitio del colegio, conservando temporalmente Commerce/hub de producción en GCP y sus credenciales actuales. Configurar Stripe de prueba únicamente en el sandbox. No retirar Commerce ni la API por mover el sitio.
- **Dato pendiente del usuario:** confirmar si se migran contenido, imágenes y cuentas actuales o si se inicia desde el repositorio. La instrucción anterior de empezar limpio se refería a GiovSoft y no se ha extendido al colegio.
- **Secuencia prevista:** resolver persistencia; preparar despliegue separado con acceso previo; verificar páginas, imágenes, administración, correo y tienda; cambiar DNS con HTTPS; observar y conservar una ruta de reversión antes de retirar el servicio GCP del colegio.
- **Estado:** evaluación inicial documentada; migración no ejecutada, dominio y producción sin cambios.

## 2026-10-26 — Conservación del colegio confirmada e inventario de configuración

- **Decisión del usuario:** conservar y migrar contenido, imágenes y cuentas actuales. La pregunta de la evaluación anterior queda resuelta; no iniciar el colegio con datos vacíos.
- **Lectura confirmada en GCP:** `GCS_BUCKET=healthy-genre-497401-j7-iberoamericano`, prefijo `colegio-iberoamericano`; Commerce `https://commerce.giovsoft.com`; identificador de tienda `colegioiberoamericano.com.mx`; URL pública `https://colegioiberoamericano.com.mx`. Se consultaron únicamente los valores no secretos necesarios. No se guardaron cambios ni se revelaron credenciales.
- **DNS local:** ambos dominios raíz `.com` y `.com.mx` resuelven a direcciones Google. Inventario completo de nombres y registros aún pendiente; conservar URL de retorno canónica durante el traslado.
- **Procedimiento preparado:** [Migración del colegio al VPS](colegio-migracion-vps.md), con persistencia, copia inicial y final, mantenimiento de escrituras, verificación, dependencias de pagos conservadas y reversión que contempla datos nuevos del VPS.
- **Siguiente acción:** inventariar objetos del prefijo desde Cloud Shell mediante el comando de la guía. Todavía no hay copia descargada, restauración, despliegue ni cambio DNS del colegio. El usuario sigue ejecutando comandos del VPS.

## 2026-10-26 16:52 — Inventario de objetos del colegio recibido

- **Ejecutado por Giovanni en Cloud Shell:** listado recursivo del prefijo `colegio-iberoamericano/`. La captura confirma 44 objetos y aproximadamente 80.61 MiB, con `content.json`, `store-accounts.json` y archivos de `uploads/`.
- **Límite:** existencia y tamaño confirmados mediante captura; todavía no se descargaron ni restauraron datos y no se certifica integridad por un listado.
- **Preparado:** bloque reproducible de respaldo inicial privado en Cloud Shell, validación de JSON, manifiesto SHA-256 y archivo de transporte, incluido en [la guía](colegio-migracion-vps.md). No ejecutado por el asistente. El archivo contiene datos de cuentas y queda fuera de Git y del chat.
- **Producción:** sin cambios en VPS, GCP, DNS, correo, Commerce o Stripe. Será necesaria una copia final con escrituras detenidas; este respaldo inicial no la sustituye.

## 2026-10-26 16:57 — Respaldo inicial del colegio creado en Cloud Shell

- **Confirmado por captura de Giovanni:** transferencia completada de 44/44 archivos, 80.6 MiB, y mensaje final «Respaldo creado en» una carpeta privada `colegio-respaldo-inicial.*` del HOME de Cloud Shell.
- **Bloque ejecutado:** la versión entregada por chat validó sintaxis de ambos JSON, existencia de `uploads/`, creó `colegio-inicial.tar.gz` y su archivo SHA-256. Al llegar al mensaje final bajo `set -eu`, esas órdenes terminaron sin error. Esta versión no generó el manifiesto individual `SHA256SUMS` de la variante ampliada de la guía; no darlo por existente.
- **Estado:** respaldo inicial local en Cloud Shell, todavía sin transferencia ni restauración en el VPS confirmadas. No es una copia final consistente porque el sitio continúa aceptando escrituras.
- **Siguiente paso preparado:** crear carpeta privada nueva en `/root/colegio-migracion-inicial` del VPS; transferir únicamente archivo comprimido y checksum mediante SCP desde Cloud Shell; ejecutar `sha256sum -c` en el VPS antes de extraer. No borrar origen, publicar datos ni introducir credenciales en el chat. No se ha cambiado DNS.

## 2026-10-26 — Transferencia del respaldo confirmada; restauración preparada

- **Confirmación del usuario:** respaldo transferido al VPS y comprobación `colegio-inicial.tar.gz: OK`. Coincidencia del archivo con el checksum de Cloud Shell confirmada por Giovanni; no implica restauración o aplicación funcional todavía.
- **Preparado localmente:** helper `deploy/vps/restore-colegio.py` y comandos en [la guía](colegio-migracion-vps.md). Verifica checksum y estructura del tar, rechaza enlaces/rutas inseguras, valida ambos JSON, exige destino nuevo y restaura datos sin cambios de contenido a `/opt/colegio/restauracion-inicial`, con manifiesto de integridad local. No sobrescribe el sitio ni imprime datos de cuentas.
- **Verificación ejecutada por el asistente:** cuatro pruebas con datos ficticios pasan: restauración válida, rechazo de ruta que escapa, rechazo de destino existente y rechazo de checksum incorrecto. `git diff --check` sin errores. No se accedió al respaldo real.
- **Pendiente de Giovanni en VPS:** actualizar el checkout, ejecutar helper y verificar manifiesto. Extracción real, persistencia en contenedor, navegación, login, correo y conexión Commerce aún pendientes. No cambiar DNS ni detener GCP en este paso. La copia final sin escrituras sigue pendiente.

## 2026-10-26 17:12 — Restauración inicial del colegio confirmada en VPS

- **Evidencia recibida:** captura de Giovanni muestra actualización por fast-forward de `/opt/giovsoft` hasta `8387fc1`, ejecución del restaurador y salida «JSON válidos; archivos restaurados: 44» en `/opt/colegio/restauracion-inicial`.
- **Integridad confirmada:** la comprobación posterior de `SHA256SUMS` terminó con «Integridad local de la restauración: OK». Se verifica extracción de la copia inicial y consistencia con su manifiesto local; no implica una copia final sin escrituras ni validación funcional de cuentas.
- **Datos:** contenido, cuentas e imágenes restaurados en carpeta privada; no se visualizaron registros de cuentas ni contraseñas. Archivo comprimido y copia de Cloud Shell se conservan.
- **Siguiente paso preparado:** clonar `Giovsoft/Iberoamericano` en `/opt/colegio/source`, fijar candidato conocido `9c867b6a8a489bc6140425ee908fa5d8134d628c` y construir imagen local `colegio-vps:9c867b6`. La revisión corresponde al código inspeccionado y usado en sandbox; aún debe contrastarse con la revisión que recibe tráfico en GCP antes del corte.
- **Estado:** construcción remota pendiente; contenedor del colegio, configuración privada, prueba de navegación y DNS sin cambios. Commerce y API de pagos de GCP continúan conservados.

## 2026-10-26 — Clonación del colegio detenida por autenticación GitHub

- **Reportado por Giovanni:** la autenticación para clonar el repositorio no pasa. No se dispone todavía del error exacto; no se afirma que una contraseña o permiso concreto sea la causa.
- **Alternativa preparada:** instalar GitHub CLI si falta y ejecutar `gh auth login --hostname github.com --git-protocol https --web` personalmente en el VPS. Autorizar el código de dispositivo en `https://github.com/login/device`, con una cuenta que tenga acceso a `Giovsoft/Iberoamericano`; después `gh auth setup-git --hostname github.com` configura Git para usar esa sesión.
- **Comprobación prevista:** `git ls-remote https://github.com/Giovsoft/Iberoamericano.git HEAD`, que prueba acceso de lectura sin clonar ni modificar el repositorio. Autorización y clonación todavía pendientes de confirmación. No compartir códigos, contraseñas ni tokens en el chat.
- **Estado:** datos restaurados conservados; construcción de imagen y publicación pendientes. Sin cambios DNS o en integración de pagos.

## 2026-10-26 17:16 — Autorización GitHub CLI completada en VPS

- **Evidencia de Giovanni:** captura con «Authentication complete», configuración del protocolo Git HTTPS y sesión GitHub iniciada. La apertura automática del navegador falló por falta de navegador en el VPS, pero la autorización web manual terminó correctamente.
- **Privacidad:** no se transcriben ni almacenan el código temporal de autorización o credenciales mostradas por el flujo. La captura no se incorpora al repositorio.
- **Pendiente:** comprobar acceso específico a `Giovsoft/Iberoamericano`, clonar y construir la imagen `colegio-vps:9c867b6`. Una sesión autenticada no confirma por sí sola permiso de lectura sobre ese repositorio privado.
- **Estado:** restauración previa intacta; no se arrancó el contenedor del colegio ni se cambió DNS, GCP o Stripe.

## 2026-10-26 — Imagen del colegio construida; configuración privada de comprobación preparada

- **Confirmación de Giovanni:** construcción de imagen terminada en VPS. Imagen esperada `colegio-vps:9c867b6`; arranque del contenedor todavía no confirmado.
- **Preparado y probado por el asistente:** `compose.colegio-preview.yaml` y proxy `colegio-preview.conf`. Proyecto separado, acceso solo `127.0.0.1:8082`, datos restaurados de solo lectura, colegio en red interna sin salida y contraseña administrativa temporal generada en archivo privado fuera de Git. No requiere ni utiliza claves Stripe, credenciales GCP o SMTP.
- **Comportamiento de comprobación:** navegación, contenido e imágenes y login de cuentas existentes; escrituras y checkout bloqueados. Commerce/catálogo/historial desconectados explícitamente, por lo que aún no se certifican. No conectar esta instancia a DNS/Caddy público.
- **Verificación local con datos ficticios:** Compose válido, ambos servicios healthy, GET inicio/health/content/imagen 200; POST checkout/registro y PUT contenido 405; catálogo 503; login inexistente/admin sin contraseña 401. Montajes de solo lectura, red interna exclusiva y cuentas sin cambios comprobados. No se utilizaron datos reales ni se realizaron pagos.
- **Comandos para Giovanni:** generación privada de `/opt/colegio/preview.env`, inicio con `up -d --wait`, pruebas curl y túnel SSH desde la Mac incluidos en [la guía](colegio-migracion-vps.md). Ejecución remota y revisión visual pendientes.
- **Producción:** DNS, GCP, correo, Commerce y Stripe sin cambios. Copia final y corte siguen pendientes.

## Plantilla para próximas entradas

### AAAA-MM-DD HH:MM — Acción

- **Estado:** preparada / ejecutada y confirmada / fallida / pendiente de verificar.
- **Responsable y entorno:** quién ejecutó; VPS, equipo local o panel DNS.
- **Objetivo y versión:** cambio concreto y commit cuando aplique.
- **Comandos o cambios:** sin secretos.
- **Verificación y evidencia:** resultado recibido y criterio de éxito.
- **Reversión:** procedimiento concreto si aplica, sin eliminar datos persistentes.
- **Siguiente paso:** pendiente resultante.
