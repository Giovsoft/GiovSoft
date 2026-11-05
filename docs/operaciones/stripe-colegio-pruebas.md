# Verificación de Stripe con Colegio Iberoamericano

## Alcance autorizado

Giovanni solicitó una prueba completa en modo de prueba, sin cargos reales. No cambiar las claves activas, el servicio de producción ni los callbacks del colegio para lograrla. No usar la confirmación manual del administrador como sustituto de la integración Stripe.

## Estado al 26 de octubre de 2026

**En preparación, no ejecutada de extremo a extremo.** Se abrió el Dashboard de Stripe y se confirmó el aviso «Entorno de prueba» y «No se procesarán transacciones reales». La vista de cuentas conectadas no muestra cuentas de prueba. Esto no demuestra que la API del colegio esté usando ese modo ni que no haya otro sandbox configurado.

La API de GCP `giovsoft-backend` referencia los secretos `giovsoft-stripe-key`, `giovsoft-stripe-webhook` y `giovsoft-stripe-connect-webhook`. Solo se inspeccionaron las referencias; no se revelaron los valores ni se confirmó su modo. No se crearon sesiones, cargos, cuentas conectadas, reembolsos o destinos de eventos.

No se encontró un proyecto del colegio en el workspace local inspeccionado. Se solicitó la URL y el repositorio del entorno de prueba existente o autorización para preparar uno separado.

## Actualización: entorno separado disponible

Giovanni autorizó preparar el sandbox y ya se levantó localmente la cadena colegio → Commerce → hub, con volúmenes nuevos, producto ficticio, puertos 7410–7412 y aviso visible de pruebas. El catálogo y health checks funcionan. El checkout se bloquea con 503 hasta configurar las credenciales de Stripe test. Las fuentes del colegio y Commerce se localizaron en GitHub y se fijaron por commit; no se descargaron datos de GCP.

Consultar [la guía de preparación](../../deploy/stripe-sandbox/README.md). Siguen pendientes la clave test y una cuenta Connect test, validación de sus capacidades, firma del listener y todos los casos transaccionales de la tabla. La preparación de Docker no implica que Stripe esté conectado ni que se haya probado un pago.

## Requisitos de aislamiento antes de iniciar checkout

- Backend del colegio y hub de pagos de prueba identificados, con almacenamiento y referencias de órdenes separados de producción.
- Claves de prueba de la plataforma y cuenta conectada de prueba del colegio, si se usa Stripe Connect. Confirmar el modo sin mostrar valores secretos.
- Destino de eventos del mismo entorno Stripe de prueba y su secreto de firma, configurados en el backend de prueba.
- Callback del hub hacia el colegio dirigido exclusivamente al entorno de prueba, con autenticación propia; sin escribir en el sistema real ni notificar a clientes reales.
- Un producto, cliente y correo de prueba bajo control del usuario; ninguna tarjeta o identidad real.
- Registrar URL de cada componente, versión instalada y configuración de modo (solo indicadores, nunca claves).

## Casos que se ejecutarán

| Caso | Comprobación de éxito | Estado |
| --- | --- | --- |
| Crear checkout desde la tienda de prueba | Orden de prueba y sesión Stripe de prueba; comprobar `livemode=false` | Pendiente |
| Pago aceptado | Completar Checkout con tarjeta de prueba; pago `succeeded` en Stripe de prueba | Pendiente |
| Webhook Stripe | Evento firmado recibido y aceptado por el hub; entrega 2xx observada en Stripe | Pendiente |
| Confirmación en el colegio | Callback del hub aceptado; orden de prueba pasa a pagada y el retorno muestra confirmación | Pendiente |
| Evitar falso positivo por polling | Confirmar en logs la recepción del evento y callback; no basta la conciliación al consultar órdenes | Pendiente |
| Idempotencia | Repetir solicitud con la misma clave devuelve la misma orden/sesión; sin duplicar efectos | Pendiente |
| Reintento de evento | Reenvío del evento de prueba no duplica pago ni entrega de servicio | Pendiente |
| Rechazo de tarjeta | Tarjeta de rechazo de prueba deja la orden sin confirmar y muestra error recuperable | Pendiente |
| Cancelación | Cancelar Checkout vuelve al colegio sin marcar orden como pagada | Pendiente |
| Continuidad de producción | Comprobaciones de disponibilidad antes y después; sin cambios de claves, datos o servicios reales | Pendiente |

No usar «marcar pagada» para hacer pasar los casos. Separar pago aceptado, entrega del webhook, callback al colegio y retorno del navegador: cada uno necesita su propia evidencia.

## Evidencias y cierre

Registrar fecha, entorno, resultado esperado/observado, estado de pago, `livemode=false`, códigos HTTP y referencias de prueba necesarias para correlación. No guardar tarjetas, claves, tokens, firmas completas ni datos personales. Si hay fallo, registrar el punto exacto y conservar la configuración de producción.

Al cerrar, anotar los recursos de prueba creados y su estado. Cualquier limpieza debe ser específica del entorno de prueba; no borrar datos o recursos reales.

## Referencias oficiales

- [Pruebas de Stripe](https://docs.stripe.com/testing): tarjetas y transacciones simuladas sin movimiento de fondos.
- [Claves de Stripe](https://docs.stripe.com/keys): separación entre claves de prueba y live; secretos de webhook independientes.
- [Webhooks de Stripe](https://docs.stripe.com/webhooks): eventos firmados y entregas al endpoint.
