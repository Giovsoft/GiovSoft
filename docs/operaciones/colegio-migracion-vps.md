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
