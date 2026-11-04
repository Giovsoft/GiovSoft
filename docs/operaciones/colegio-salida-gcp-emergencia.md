# Salida completa de GCP — emergencia comunicada 2026-11-03

Giovanni comunica que GCP dejará de funcionar mañana a las 23:00. Se interpreta como 2026-11-04 23:00, hora de México; no se ha verificado causa de suspensión ni aviso de facturación. La estrategia temporal con backend en GCP ya no satisface ese plazo como destino final.

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

Copias GCS e imágenes exactas iniciadas. Aún debe verificarse su finalización e integridad. Transferencia inicial de configuración/dump preparada hacia `/root/colegio-emergencia-20261103` del VPS, permiso 0700; no declarar completada hasta checksum en destino.

## Pendientes importantes

- Validar, transferir y restaurar todos los respaldos; obtener copia final al bloquear escritores.
- Configurar red, volúmenes y PostgreSQL separados del sitio GiovSoft existente.
- Evitar ejecución de colas/reintentos de webhooks de las copias mientras GCP sigue activo.
- Revisar rutas de webhook Stripe, claves de firma, Connected Account y callback Commerce conservando autenticación/idempotencia.
- DNSSEC .com: respetar retirada DS/TTL documentados, ventana segura desde 2026-11-04 20:52. .com.mx ya está en Cloudflare. Si hay problemas, priorizar continuidad de .com.mx y api/commerce antes del límite comunicado.
- Documentar prueba final y reversión; no prometer disponibilidad total hasta verificaciones completas.

## Ampliación confirmada: todo el proyecto

El usuario confirma que el límite afecta todo el proyecto. Inventario adicional: servicios `cruje`, `giovsoft`, `giovsoft-frontend`, `giovsoft-api`, `giovsoft-runner`, `giovsoft-web`; VM `giovsoft-ops` en northamerica-south1-a; Cloud SQL `giovsoft-pg`, PostgreSQL 16, base `figma_academy`, solo IP privada. La API adicional referencia Vertex: trasladar contenedores no elimina esa dependencia de IA.

Configuración principal y dump preliminar: recibidos y checksum correcto en VPS. Archivo `production-payload.tar.gz` de 380529058 bytes recibido, checksum correcto y extraído en carpeta privada; verificación del manifiesto interno y carga de imágenes en curso. No es copia final de escritores detenidos.

La segunda base todavía NO tiene respaldo válido: el intento con región incorrecta falló, y el proxy de región correcta agotó conexión a IP privada. No se ha publicado la base en Internet. Se investiga acceso desde VM existente en su red.

La referencia `latest` del secreto webhook usada por la API adicional apunta a versión 6 deshabilitada; versión 5 está habilitada y es la referencia explícita de la API principal. No se ha sustituido silenciosamente una referencia por otra.

Consulta Stripe de solo lectura: webhook habilitado en `https://api.giovsoft.com/api/webhooks/stripe`, otro duplicado deshabilitado y un webhook habilitado en `https://academy.giovsoft.com/api/checkout/webhook`. No se modificaron endpoints ni se generaron pagos. Conservar Academy y comprobar sus dependencias antes de retirar el proyecto.

El cambio de alojamiento puede adelantarse cambiando A/AAAA en Squarespace; la espera DNSSEC corresponde a delegación de nameservers. Mantener también actualizada la zona pendiente de Cloudflare antes de delegarla.
