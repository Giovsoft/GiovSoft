# Salida completa de GCP — emergencia comunicada 2026-11-03

Giovanni comunica que GCP dejará de funcionar mañana a las 23:00. Se interpreta como 2026-11-04 23:00, hora de México; no se ha verificado causa de suspensión ni aviso de facturación. La estrategia temporal con backend en GCP ya no satisface ese plazo como destino final.

## Estado operativo al cierre de esta sesión

- DNS sin cambios de alojamiento. Colegio (.com y .com.mx), Commerce y API principal nuevamente activos en GCP, comprobados HTTP 200 tras reactivación. GiovSoft principal conserva su despliegue previo en VPS.
- VPS: dos bases restauradas en recursos privados separados; colegio/Commerce/pagos saludables y autenticación interna comprobada; Crüje privado saludable/200; API adicional saludable/200 y perfil sin autenticación 401. API adicional sin puertos publicados, frontend/API vía gateway de solo lectura en loopback 8095 y aplicaciones financieras sin salida a Internet.
- Configuraciones y dumps preliminares recibidos fuera de GCP. Siete imágenes exactas cargadas (colegio, Commerce, pagos, Crüje, API/runner/web adicionales); checksums correctos. No se promovió una copia preliminar como producción.
- Corte interrumpido por reautenticación de Squarespace al editar DNS. Orígenes reactivados; la carpeta `corte-final.iknfumhu` está marcada `NOT_FINAL_DNS_SESSION_BLOCKED` y no sirve como copia final. Referencia movida a `last-aborted-cut-path` para impedir reutilización accidental.
- Bloqueo para corte principal: recuperar edición DNS en Squarespace. La API adicional conserva una referencia heredada al secreto webhook versión 6 deshabilitada; no sustituirlo por otro ni reactivar la versión automáticamente. El endpoint Stripe Academy `/api/checkout/webhook` no aparece en el código activo de esa API (sí `/api/webhooks/stripe`); revisar esa integración antes de reactivarla. Esta referencia no bloquea el receptor principal del colegio, que usa versión 5 explícita y se probó en aislamiento.

## Prioridad inmediata

1. Sacar de GCP configuración privada, secretos referenciados por revisiones activas, datos y binarios exactos. Un respaldo que solo vive en Cloud Shell todavía depende de GCP.
2. Restaurar colegio, Commerce y API de pagos en recursos privados nuevos del VPS; preservar el GiovSoft ya publicado y su base local.
3. Probar en aislamiento de red: las copias de producción no deben enviar correos, crear pagos ni despachar webhooks pendientes durante la prueba. No usar el sandbox con datos ficticios como reemplazo de producción.
4. Coordinar mantenimiento breve y copia final de todos los escritores: colegio, Commerce y API. Conservar IDs de pedidos, aplicaciones, eventos y entregas para idempotencia. No promover la copia preliminar como última versión.
5. Publicar servicios del VPS con HTTPS y cambiar DNS de colegio (ambas zonas), `commerce.giovsoft.com` y `api.giovsoft.com`. Mantener nombres públicos para conservar endpoints webhook y callbacks; localizar en Stripe cualquier destino que use directamente run.app antes del corte.
6. Verificar Stripe mediante lecturas y eventos de prueba autorizados, sin cargos reales. No borrar ni revocar recursos originales antes de comprobar el corte.

## Inventario confirmado

| Servicio | Revisión con tráfico | Persistencia |
| --- | --- | --- |
| Colegio | colegio-iberoamericano-wh-09151933 | bucket healthy-genre-497401-j7-iberoamericano, prefijo colegio-iberoamericano |
| Commerce | giovcommerce-00036-jux | bucket healthy-genre-497401-j7-giovcommerce-data montado /app/data; commerce.json |
| API pagos | giovsoft-backend-wh-09151933 | Cloud SQL giovsoft-db, PostgreSQL 16, base giovsoft |

Se capturaron las configuraciones de servicio y las revisiones con porcentaje de tráfico mayor a cero, no únicamente la plantilla más reciente. Imágenes exactas de Artifact Registry:

- Colegio: sha256:3366348b3bfce011cfb4d3e2f82028b384e9edd18a0bec8dc7d97ddaf2a1f96b
- Commerce: sha256:94f4584347bde0d5fb308b399b3dd52ed90df7a9ea9ed682859197d52d5ae08e
- API: sha256:4aec95ec2172f1c95f1030ca10277b23612429e924bc7a90fcc580334bd873ba

## Rescate privado en curso

Carpeta Cloud Shell `/home/gioramos/colegio-emergencia.telNwx`, umask 077. Configuraciones resueltas guardadas en JSON privados 0600 sin mostrar valores. Las referencias latest se resolvieron al momento de esta copia; no se afirma igualdad con valores inyectados en instancias antiguas antes de una posible rotación.

Base PostgreSQL preliminar: `giovsoft-preliminar.dump`, 203199 bytes; pg_dump 16.15 y pg_restore --list correctos. Conexión por Cloud SQL Auth Proxy instalado 2.26.3, autenticación gcloud existente, listener loopback 15432; sin abrir redes autorizadas ni crear claves de servicio.

Copias GCS e imágenes principales recibidas y verificadas en `/root/colegio-emergencia-20261103` del VPS, permiso 0700. Payload de 380529058 bytes, checksum y 47 hashes internos correctos; configuración y dump inicial con checksum correcto. Las copias siguen siendo preliminares hasta el corte coordinado definitivo.

## Pendientes importantes

- Validar, transferir y restaurar todos los respaldos; obtener copia final al bloquear escritores.
- Configurar red, volúmenes y PostgreSQL separados del sitio GiovSoft existente.
- Evitar ejecución de colas/reintentos de webhooks de las copias mientras GCP sigue activo.
- Revisar rutas de webhook Stripe, claves de firma, Connected Account y callback Commerce conservando autenticación/idempotencia.
- DNSSEC .com: respetar retirada DS/TTL documentados, ventana segura desde 2026-11-04 20:52. .com.mx ya está en Cloudflare. Si hay problemas, priorizar continuidad de .com.mx y api/commerce antes del límite comunicado.
- Documentar prueba final y reversión; no prometer disponibilidad total hasta verificaciones completas.

## Ampliación confirmada: todo el proyecto

El usuario confirma que el límite afecta todo el proyecto. Inventario adicional: servicios `cruje`, `giovsoft`, `giovsoft-frontend`, `giovsoft-api`, `giovsoft-runner`, `giovsoft-web`; VM `giovsoft-ops` en northamerica-south1-a; Cloud SQL `giovsoft-pg`, PostgreSQL 16, base `figma_academy`, solo IP privada. La configuración adicional conserva variables Vertex y runner. La revisión posterior del arranque exacto confirmó `npm start` → `node index.js`, sin override en Cloud Run, sin dependencias Vertex y sin referencias VERTEX_PROJECT/RUNNER_URL en ese archivo. Se retiró la inferencia inicial de dependencia activa; no se necesita cambiar proveedor por esa configuración heredada.

Configuración principal y dump preliminar: recibidos y checksum correcto en VPS. Archivo `production-payload.tar.gz` de 380529058 bytes recibido, checksum correcto y extraído en carpeta privada; verificación del manifiesto interno y carga de imágenes en curso. No es copia final de escritores detenidos.

La segunda base se rescató mediante túnel SSH/IAP por VM existente hacia la IP SQL privada y pg_dump 16 desde Cloud Shell. Dump de 2036638 bytes recibido con checksum correcto en VPS y restaurado en `academy-stage`, 68 tablas públicas. No se publicó SQL en Internet. Los intentos anteriores de región/proxy y cliente 15 quedaron descartados.

La referencia `latest` del secreto webhook usada por la API adicional apunta a versión 6 deshabilitada; versión 5 está habilitada y es la referencia explícita de la API principal. No se ha sustituido silenciosamente una referencia por otra.

Consulta Stripe de solo lectura: webhook habilitado en `https://api.giovsoft.com/api/webhooks/stripe`, otro duplicado deshabilitado y un webhook habilitado en `https://academy.giovsoft.com/api/checkout/webhook`. No se modificaron endpoints ni se generaron pagos. Conservar Academy y comprobar sus dependencias antes de retirar el proyecto.

El cambio de alojamiento puede adelantarse cambiando A/AAAA en Squarespace; la espera DNSSEC corresponde a delegación de nameservers. Mantener también actualizada la zona pendiente de Cloudflare antes de delegarla.

## Secuencia corregida antes de repetir el corte

1. Comprobar que TODOS los paneles permiten abrir la edición de registros; cancelar la prueba sin guardar. La lectura del panel no prueba que la sesión permita guardar cambios. Resolver la reautenticación antes de pausar servicios.
2. Preparar una carpeta nueva y precalentar los archivos desde el respaldo validado mientras el origen está activo. Ejecutar sincronización previa; no recopiarlos desde cero durante mantenimiento. En el corte, usar comparación por checksum y volver a validar inventarios antes/después.
3. Guardar nueva reversión y estado de tráfico/etiquetas; no reutilizar el intento abortado. Pausar todos los escritores, drenar 330 segundos y verificar bloqueo de URL principal y etiquetas anteriores.
4. Sincronizar únicamente diferencias, obtener dump PostgreSQL final y manifiesto completo. Transferir diferencias + dump; reconstruir y verificar todos los hashes en una carpeta nueva del VPS.
5. Restaurar producción separada de las copias de prueba y del PostgreSQL de GiovSoft. Aplicar la configuración de correo de recuperación ya comprobada en VPS, conservada privadamente como `config/vps-support-mail.json`.
6. Verificar y sustituir alias `colegio-public` sin dos proyectos activos con el mismo alias. La red de producción usa nombre distinto `colegio-completo_live`; las copias de prueba permanecen aisladas.
7. Cambiar colegio (dos zonas), api/commerce y después los destinos adicionales preparados. Conservar por ahora proxy/cifrado .com.mx. HTTPS de origen aún requiere emisión y prueba; no afirmar certificado emitido por tener Caddy configurado.
8. Si falla antes de escrituras VPS, reactivar el origen y confirmar HTTP público 200; después de nuevas escrituras, reconciliar antes de revertir. No dejar el colegio pausado esperando una sesión del usuario.

Scheduler: inventariadas 34 ubicaciones soportadas, sin errores y sin trabajos. Configuración cron/systemd de VM rescatada y checksum correcto fuera de GCP. Esto no sustituye revisar los reintentos internos de cada aplicación.

## Evidencia y disponibilidad privada consolidada

- `/root/colegio-emergencia-20261103/rescue-index.json`: catálogo privado de siete archivos de respaldo con hashes/tamaños; `production_cut=false` y aviso de snapshot preliminar.
- `cut-audit-not-final.tar.gz`: registros del intento abortado y la reversión, recibido con checksum correcto; no contiene una copia final aprobada.
- `academy-stage`: base/API/web/access saludables. Gateway loopback 8095: `/` y `/api/health` 200, `/api/admin/profile` sin credenciales 401, POST 405. HTML de origen y copia privada coincide por SHA256; sin referencias run.app encontradas en los archivos estáticos inspeccionados. No se probó un login autenticado ni pagos de Academy.
- Configuración Nginx original de Academy copiada desde su imagen a `/opt/academy-completo/stage-20261103/web-nginx` y montada para permitir generación de plantilla, con raíz de imagen solo lectura. No se reemplazó el diseño ni el contenido.
- `cruje-vps` saludable usando únicamente el archivo Compose versionado, sin depender del override temporal de diagnóstico.
- Cron de usuarios de VM: cero archivos de crontab en respaldo. Scheduler: inventario de 34 regiones recibido en VPS y comprobado, cero trabajos.
