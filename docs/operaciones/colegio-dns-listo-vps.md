# Colegio: ambos dominios en VPS con backend temporal en GCP

Alcance aprobado el 2026-11-03: servir `.com` y `.com.mx` desde el VPS y conservar temporalmente el backend GCP. Esta es la guía vigente para el próximo cambio DNS. No usar el procedimiento de pausa/copia final ni arrancar `colegio-vps-live` durante esta etapa.

## Arquitectura y datos

Caddy atiende ambas raíces y redirige cada www a su propia raíz. El proyecto `colegio-com-shared` sirve páginas/recursos de la imagen `colegio-vps:9c867b6`. Todas las rutas `/api` y `/uploads` llegan al colegio existente en Cloud Run mediante HTTPS verificado. GCP sigue siendo el único escritor de cuentas y contenido. Commerce, API de pagos, Stripe y correo conservan su configuración actual. `PUBLIC_URL` del backend y su identificador Commerce siguen siendo `.com.mx`; los retornos de pago y recuperación pueden llevar a ese dominio.

La credencial SMTP nueva del candidato local no sustituye la de GCP. Las verificaciones SMTP anteriores del contenedor local no certifican entrega desde GCP. No se han creado pagos ni enviado correos por estas pruebas.

## Preparación del VPS

1. Actualizar repositorio y levantar `compose.colegio-com-shared.yaml` usando `/opt/colegio/production.env`.
2. Activar `COLEGIO_SHARED_GATE=./colegio-shared-active.conf` y recrear únicamente access. No confundir con `COLEGIO_GATE_CONFIG` de los candidatos antiguos.
3. Instalar `deploy/vps/colegio.caddy` en `deploy/vps/sites-enabled/colegio.caddy`; validar la configuración completa y actualizar/releer únicamente edge. Conservar los volúmenes de certificados de GiovSoft.
4. Comprobar páginas, API, catálogo y red interna desde el VPS; confirmar que GiovSoft permanece disponible.

La publicación del snippet no modifica DNS. Caddy administra automáticamente los certificados públicos cuando los dominios alcanzan el VPS. Validación de configuración no equivale a certificado emitido. Mientras las A/AAAA sigan en Google no se da por verificado TLS del colegio en el VPS. Después del cambio DNS, revisar la emisión; si el reintento de ACME está en espera, releer una sola vez la configuración de Caddy y revisar logs, sin borrar volúmenes ni reiniciar en bucle.

## Último paso: DNS

**.com:** DNSSEC anterior retirado el 2026-11-03; ausencia del DS observada en el padre a las 20:51:28, México. Esperar al menos hasta el 2026-11-04 20:52 antes de cambiar NS, por TTL previo 86400. Volver a comprobar DS antes de actuar. NS autorizados: `coen.ns.cloudflare.com`, `raquel.ns.cloudflare.com`. Primero confirmar que Cloudflare quedó autoritativo y conserva la zona completa.

**.com.mx:** Cloudflare ya autoritativo (`aliza.ns.cloudflare.com`, `mack.ns.cloudflare.com`). No sustituir su pareja por la de `.com`.

En cada zona, guardar valores previos y cambiar solo registros web:

| Zona | Tipo | Nombre | Valor final | Proxy inicial |
| --- | --- | --- | --- | --- |
| .com | A | @ | 5.183.11.142 | Solo DNS |
| .com | CNAME | www | colegioiberoamericano.com | Solo DNS |
| .com.mx | A | @ | 5.183.11.142 | Solo DNS |
| .com.mx | CNAME | www | colegioiberoamericano.com.mx | Solo DNS |

Reemplazar los cuatro A Google por el único A VPS en cada raíz. Retirar únicamente los cuatro AAAA web Google de cada raíz; no hay IPv6 del VPS configurada. Mantener TXT, MX, DKIM, DMARC, verificaciones, otros CNAME/subdominios. No transferir registros de correo entre zonas. Mantener NS de cada zona correctamente separados.

El cambio de proxy de `.com.mx` a Solo DNS debe confirmarse al aplicarlo: temporalmente el tráfico web deja de pasar por las protecciones Cloudflare, manteniendo HTTPS del servidor. Tras comprobar certificado del origen, se puede volver a activar proxy con Full (strict); no usar Flexible.

## Verificación posterior al DNS

Comprobar A/AAAA y HTTPS válido sin `-k` de ambas raíces, www redirigiendo a su raíz, inicio/tienda/admin/imágenes/API, y acceso personal a cuentas. Confirmar que GiovSoft permanece disponible. No realizar compras reales ni probar recuperación enviando correo sin autorización. Si hay fallo TLS, no declarar el corte terminado.

Con backend compartido no se requiere pausa ni copia final para esta etapa y no se bifurcan cuentas durante cachés DNS. No apagar el colegio, Commerce o la API de GCP al terminar.

## Reversión

Restaurar A/AAAA web Google y los CNAME/proxy previos en la zona afectada; conservar backend GCP. No hay que reconciliar copias de cuentas. Retirar solo el snippet del colegio si fuera necesario, sin modificar GiovSoft ni borrar certificados. Mantener las copias iniciales privadas para la futura migración completa.

## Estado ejecutado el 2026-11-03

VPS actualizado a `01d072d`, web/access healthy, puerta activa, snippet de ambas raíces/www instalado y Caddy validado/recargado. Páginas y API 200; admin autenticado 200; imagen subida 200 image/png; login vacío 401; conexión de Caddy al colegio correcta. GiovSoft y dominios actuales mantienen HTTPS 200. No se requiere nueva activación de contenedores al cambiar DNS. Certificados del colegio en VPS y comprobación pública final permanecen pendientes del DNS. No apagar GCP.
