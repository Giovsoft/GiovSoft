# Validación privada de salida completa de GCP

Estos archivos preparan una copia aislada, **no publican producción**. El corte final debe bloquear escritores, repetir las copias de colegio/Commerce/PostgreSQL y verificar Stripe/webhooks antes de retirar GCP. No promover la base de ensayo como copia final.

Requisitos: respaldo crítico validado en `BACKUP/config`, payload verificado en `BACKUP/payload`, imágenes originales cargadas. `prepare-stage.py` exige root, destino nuevo fuera del respaldo, JSON válidos y configuraciones resueltas de las revisiones activas; nunca imprime secretos. Conserva caracteres `$`, comillas y saltos de línea de las credenciales al cargar Compose. Runtime privado 0600 y directorio padre 0700.

```bash
cd /opt/giovsoft
python3 deploy/vps/full-stack/prepare-stage.py \
  /root/colegio-emergencia-20261103 /opt/colegio-completo/stage-20261103

docker compose -f deploy/vps/full-stack/compose.stage.yaml \
  -f /opt/colegio-completo/stage-20261103/runtime.json config --quiet

docker compose -f deploy/vps/full-stack/compose.stage.yaml \
  -f /opt/colegio-completo/stage-20261103/runtime.json up -d --wait database

docker compose -f deploy/vps/full-stack/compose.stage.yaml \
  -f /opt/colegio-completo/stage-20261103/runtime.json \
  exec -T database pg_restore --clean --if-exists --no-owner --no-acl \
  --exit-on-error --single-transaction -U giovsoft_app -d giovsoft \
  < /opt/colegio-completo/stage-20261103/preliminary.dump

docker compose -f deploy/vps/full-stack/compose.stage.yaml \
  -f /opt/colegio-completo/stage-20261103/runtime.json up -d --wait
```

El proyecto es `colegio-completo-stage`, con PostgreSQL y copias de datos separados del GiovSoft publicado. Los tres procesos de aplicación y PostgreSQL solo pertenecen a una red interna sin salida a Internet. El único proxy de comprobación publica loopback 8093 (colegio), 8091 (Commerce), 8092 (API), acepta solo GET/HEAD y no permite crear pedidos/cargos. No se conecta a la red pública de Caddy ni comparte su alias `colegio-public`.

Las aplicaciones pueden actualizar sus copias locales o registrar fallos de entrega durante las pruebas; nada de esa copia se debe sincronizar de vuelta a GCP. No usar health 200 como prueba suficiente de PostgreSQL: comprobar tablas, recuentos, administrador y catálogo autenticados. No ejecutar checkout real ni pruebas de email.

Comprobación local de configuración realizada: esquema Compose válido; contenedor Node con dato ficticio confirma que `$`, comillas y salto de línea sobreviven; aplicaciones sin puertos publicados, red interna y proxy solo loopback. Esto no sustituye la restauración e integración real del VPS.
