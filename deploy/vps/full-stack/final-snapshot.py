#!/usr/bin/env python3
"""Freeze the three original writers and create a checked incremental snapshot.
Run only in the already authenticated Cloud Shell after DNS/TLS preflight.
Never starts VPS writers. On failure before publication, restores GCP scaling/tags.
"""
import argparse
import concurrent.futures
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tarfile
import time

PROJECT = 'healthy-genre-497401-j7'
REVISIONS = {
    'colegio-iberoamericano': 'colegio-iberoamericano-wh-09151933',
    'giovcommerce': 'giovcommerce-00036-jux',
    'giovsoft-backend': 'giovsoft-backend-wh-09151933',
}
SOURCES = {
    'school-data': 'gs://healthy-genre-497401-j7-iberoamericano/colegio-iberoamericano/',
    'commerce-data': 'gs://healthy-genre-497401-j7-giovcommerce-data/',
}
FLAGS = ['--project', PROJECT, '--region', 'us-central1', '--quiet']


def main(root):
    os.umask(0o077)
    root = Path(root).resolve()
    cut = Path((root / 'prepared-cut-path').read_text()).resolve()
    assert cut.parent == root and cut.name.startswith('cut-20261104.')
    assert (cut / 'DNS_TLS_PREFLIGHT_OK').is_file()
    assert not (cut / 'FINAL_SNAPSHOT_OK').exists()
    log = (cut / 'final-snapshot.log').open('a')
    def run(args, **kwargs):
        return subprocess.run(args, stdout=subprocess.PIPE, stderr=log, check=True, **kwargs).stdout
    control = str(Path.home() / '.ssh/colegio-migrate-%C')
    ssh = ['ssh', '-o', 'BatchMode=yes', '-o', 'ControlPath=' + control, 'root@5.183.11.142']
    run(ssh + ['true'])
    # Verify SQL access before any service is paused.
    e = json.loads((cut / 'config/giovsoft-backend-wh-09151933.env.json').read_text())
    env = os.environ.copy()
    env.update(PGHOST='127.0.0.1', PGPORT='15432', PGDATABASE='giovsoft',
               PGUSER='giovsoft_app', PGPASSWORD=e['DB_PASSWORD'],
               PGCONNECT_TIMEOUT='10', PGSSLMODE='disable')
    assert run(['psql', '-Atc', 'select 1'], env=env).strip() == b'1'
    for svc, rev in REVISIONS.items():
        s = json.loads(run(['gcloud', 'run', 'services', 'describe', svc] + FLAGS + ['--format=json']))
        active = [t for t in s['status']['traffic'] if int(t.get('percent', 0)) > 0]
        assert len(active) == 1 and active[0]['revisionName'] == rev and active[0]['percent'] == 100
        (cut / (svc + '.at-freeze.json')).write_text(json.dumps(s))
    print('PREFLIGHT_OK; comenzando pausa coordinada', flush=True)
    paused = False
    try:
        paused = True
        def freeze(svc):
            run(['gcloud', 'run', 'services', 'update-traffic', svc,
                 '--clear-tags', '--to-revisions=' + REVISIONS[svc] + '=100'] + FLAGS)
            run(['gcloud', 'run', 'services', 'update', svc, '--scaling=0'] + FLAGS)
            s = json.loads(run(['gcloud', 'run', 'services', 'describe', svc] + FLAGS + ['--format=json']))
            a = s['metadata']['annotations']
            assert a.get('run.googleapis.com/scalingMode') == 'manual'
            assert str(a.get('run.googleapis.com/manualInstanceCount')) == '0'
            assert not any(t.get('tag') for t in s['status'].get('traffic', []))
            print('ORIGEN_PAUSADO', svc, flush=True)
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
            list(pool.map(freeze, REVISIONS))
        drain = int((cut / 'drain-seconds').read_text())
        assert 330 <= drain <= 600
        (cut / 'PAUSED_AT').write_text(str(time.time()))
        print('DRENAJE_SEGUNDOS', drain, flush=True)
        time.sleep(drain)
        before = {}
        for name, src in SOURCES.items():
            before[name] = run(['gcloud', 'storage', 'ls', '--recursive', '--long', src])
            run(['gcloud', 'storage', 'rsync', '--recursive', '--checksums-only',
                 '--delete-unmatched-destination-objects', src, str(cut / 'payload' / name)])
        dump = cut / 'config/giovsoft-preliminar.dump'
        # The historical restore helper expects this filename; receipt identifies it as final.
        run(['pg_dump', '--format=custom', '--no-owner', '--no-acl', '--file', str(dump)], env=env)
        assert dump.stat().st_size > 10000
        run(['pg_restore', '--list', str(dump)])
        for name, src in SOURCES.items():
            after = run(['gcloud', 'storage', 'ls', '--recursive', '--long', src])
            assert sorted(before[name].splitlines()) == sorted(after.splitlines()), 'GCS changed after freeze'
        for name in ['school-data/content.json', 'school-data/store-accounts.json', 'commerce-data/commerce.json']:
            json.loads((cut / 'payload' / name).read_text())
        baseline = json.loads((root / 'payload-manifest.json').read_text())
        manifest = {}
        for name in SOURCES:
            for p in sorted((cut / 'payload' / name).rglob('*')):
                if p.is_file():
                    assert not p.is_symlink()
                    manifest[p.relative_to(cut / 'payload').as_posix()] = hashlib.sha256(p.read_bytes()).hexdigest()
        changed = [p for p, digest in manifest.items() if baseline.get(p) != digest]
        (cut / 'final-manifest.json').write_text(json.dumps(manifest))
        receipt = {'final': True, 'created_utc_epoch': time.time(), 'revisions': REVISIONS,
                   'dump_kind': 'final_after_freeze', 'files': len(manifest), 'changed': changed}
        (cut / 'receipt.json').write_text(json.dumps(receipt))
        archive = cut / 'final-delta.tar.gz'
        with tarfile.open(archive, 'w:gz') as t:
            for name in ['config', 'final-manifest.json', 'receipt.json']:
                t.add(cut / name, arcname=name)
            for name in changed:
                t.add(cut / 'payload' / name, arcname='payload/' + name)
        digest = hashlib.sha256(archive.read_bytes()).hexdigest()
        (cut / 'final-delta.tar.gz.sha256').write_text(digest + '  final-delta.tar.gz\n')
        run(ssh + ['install -d -m 700 /root/colegio-emergencia-20261104-final'])
        run(['scp', '-o', 'BatchMode=yes', '-o', 'ControlPath=' + control,
             str(archive), str(cut / 'final-delta.tar.gz.sha256'),
             'root@5.183.11.142:/root/colegio-emergencia-20261104-final/'])
        run(ssh + ['cd /root/colegio-emergencia-20261104-final && sha256sum -c final-delta.tar.gz.sha256'])
        (cut / 'FINAL_SNAPSHOT_OK').write_text(digest)
        print('FINAL_SNAPSHOT_OK', 'archivos', len(manifest), 'diferencias', len(changed),
              'bytes', archive.stat().st_size, flush=True)
        print('GCP_PAUSADO; restaurar VPS antes de habilitar escrituras. No revertir tras nuevas escrituras.', flush=True)
    except BaseException:
        if paused and not (cut / 'VPS_WRITES_ACTIVE').exists():
            print('FALLO_ANTES_DE_ESCRITURAS; restaurando origen', flush=True)
            subprocess.run(['bash', str(cut / 'rollback-before-vps-writes.sh')], stdout=log, stderr=log, check=True)
        raise


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('root')
    p.add_argument('--confirm-freeze', action='store_true', required=True)
    main(p.parse_args().root)
