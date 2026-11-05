#!/usr/bin/env python3
"""Prepare a NEW isolated copy. Never edits a live database or prints secrets."""
import argparse
import json
import os
from pathlib import Path
import secrets
import shutil

REVISIONS = {
    'school': 'colegio-iberoamericano-wh-09151933',
    'commerce': 'giovcommerce-00036-jux',
    'payments': 'giovsoft-backend-wh-09151933',
}


def compose_literals(value):
    if isinstance(value, str):
        return value.replace('$', '$$')
    if isinstance(value, dict):
        return {key: compose_literals(item) for key, item in value.items()}
    if isinstance(value, list):
        return [compose_literals(item) for item in value]
    return value


def prepare(backup, target):
    backup, target = Path(backup).resolve(), Path(target).resolve()
    if os.geteuid() != 0:
        raise SystemExit('Ejecutar como root en el VPS; no se modifico produccion.')
    if target.exists() or target == backup or backup in target.parents:
        raise SystemExit('Destino debe ser nuevo y separado del respaldo.')
    envs = {}
    for service, revision in REVISIONS.items():
        env = json.loads((backup / 'config' / (revision + '.env.json')).read_text())
        if not isinstance(env, dict) or not all(isinstance(v, str) and '\x00' not in v for v in env.values()):
            raise SystemExit('Configuracion privada invalida.')
        envs[service] = env
    if not envs['payments'].get('DB_PASSWORD') or not envs['payments'].get('STRIPE_SECRET_KEY'):
        raise SystemExit('Configuracion de pagos incompleta; no se crearon servicios.')
    for path in ['school-data/content.json', 'school-data/store-accounts.json', 'commerce-data/commerce.json']:
        json.loads((backup / 'payload' / path).read_text())
    target.mkdir(mode=0o700, parents=True)
    (target / 'school').mkdir(mode=0o700)
    shutil.copytree(backup / 'payload' / 'school-data' / 'uploads', target / 'school' / 'uploads')
    data = target / 'school' / 'data'
    data.mkdir(mode=0o700)
    for name in ['content.json', 'store-accounts.json']:
        shutil.copy2(backup / 'payload' / 'school-data' / name, data / name)
    shutil.copytree(backup / 'payload' / 'commerce-data', target / 'commerce')
    (target / 'payments').mkdir(mode=0o700)
    shutil.copy2(backup / 'config' / 'giovsoft-preliminar.dump', target / 'preliminary.dump')
    app_password = envs['payments']['DB_PASSWORD']
    sql = ("CREATE ROLE giovsoft_app LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD '"
           + app_password.replace("'", "''") + "';\nALTER DATABASE giovsoft OWNER TO giovsoft_app;\n")
    init = target / '10-app.sql'
    init.write_text(sql)
    # Parent directory is 0700; the mounted SQL must be readable by the image
    # postgres UID (70 on Alpine, 999 on other variants).
    init.chmod(0o644)
    envs['school'].update(NODE_ENV='production', PORT='8080', GCS_BUCKET='',
                          GIOVCOMMERCE_API_URL='http://commerce:8080')
    envs['commerce'].update(NODE_ENV='production', PORT='8080',
                            GIOVSOFT_API_URL='http://payments:4000')
    envs['payments'].update(NODE_ENV='production', PORT='4000',
                            CLOUD_SQL_CONNECTION_NAME='', PGHOST='database',
                            PGDATABASE='giovsoft', PGUSER='giovsoft_app', PGPASSWORD=app_password,
                            DB_HOST='database', GIOVCOMMERCE_API_URL='http://commerce:8080')
    services = {name: {'environment': env} for name, env in envs.items()}
    def bind(source, dest):
        return {'type': 'bind', 'source': str(source), 'target': dest,
                'bind': {'create_host_path': False}}
    services['school']['volumes'] = [bind(data, '/app/data'), bind(target / 'school' / 'uploads', '/app/public/uploads')]
    services['commerce']['volumes'] = [bind(target / 'commerce', '/app/data')]
    services['payments']['volumes'] = [bind(target / 'payments', '/app/data')]
    services['database'] = {
        'environment': {'POSTGRES_DB': 'giovsoft', 'POSTGRES_USER': 'postgres',
                        'POSTGRES_PASSWORD': secrets.token_hex(32)},
        'volumes': [dict(bind(init, '/docker-entrypoint-initdb.d/10-app.sql'), read_only=True)],
    }
    out = target / 'runtime.json'
    out.write_text(json.dumps(compose_literals({'services': services}), indent=2))
    out.chmod(0o600)
    print('Copia aislada preparada. Runtime privado 0600; sin publicar ni arrancar servicios.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('backup')
    parser.add_argument('target')
    args = parser.parse_args()
    prepare(args.backup, args.target)
