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

## Plantilla para próximas entradas

### AAAA-MM-DD HH:MM — Acción

- **Estado:** preparada / ejecutada y confirmada / fallida / pendiente de verificar.
- **Responsable y entorno:** quién ejecutó; VPS, equipo local o panel DNS.
- **Objetivo y versión:** cambio concreto y commit cuando aplique.
- **Comandos o cambios:** sin secretos.
- **Verificación y evidencia:** resultado recibido y criterio de éxito.
- **Reversión:** procedimiento concreto si aplica, sin eliminar datos persistentes.
- **Siguiente paso:** pendiente resultante.
