#!/usr/bin/env python3
"""Consistent Academy SQL snapshot; never publishes VPS writers."""
import concurrent.futures
import hashlib
import json
import os
from pathlib import Path
import shlex
import subprocess
import sys
import tempfile
import time
import urllib.parse

REVISIONS = {'giovsoft-api': 'giovsoft-api-00039-drx',
             'giovsoft-runner': 'giovsoft-runner-00018-mw8'}
FLAGS = ['--project', 'healthy-genre-497401-j7', '--region', 'northamerica-south1', '--quiet']
DEST = '/root/academy-final-20261104'


def snapshot(root):
    os.umask(0o077)
    root = Path(root).resolve()
    cut = Path(tempfile.mkdtemp(prefix='academy-cut-20261104.', dir=root))
    log = (cut / 'operations.log').open('a')
    def run(cmd, **kw):
        return subprocess.run(cmd, stdout=subprocess.PIPE, stderr=log, check=True, **kw).stdout
    control = str(Path.home() / '.ssh/colegio-migrate-%C')
    ssh = ['ssh', '-o', 'BatchMode=yes', '-o', 'ControlPath=' + control, 'root@5.183.11.142']
    run(ssh + ['test ! -e ' + DEST])
    e = json.loads((root / 'academy-api38.env.json').read_text())
    u = urllib.parse.urlparse(e['DATABASE_URL'])
    env = os.environ.copy()
    env.update(PGHOST='127.0.0.1', PGPORT='15435', PGDATABASE=u.path.lstrip('/'),
               PGUSER=urllib.parse.unquote(u.username), PGPASSWORD=urllib.parse.unquote(u.password),
               PGCONNECT_TIMEOUT='10', PGSSLMODE='require')
    assert run(['psql', '-Atc', 'select 1'], env=env).strip() == b'1'
    rollback = ['#!/usr/bin/env bash', 'set -euo pipefail']
    drain = 0
    for svc, rev in REVISIONS.items():
        s = json.loads(run(['gcloud', 'run', 'services', 'describe', svc] + FLAGS + ['--format=json']))
        active = [t for t in s['status']['traffic'] if int(t.get('percent', 0)) > 0]
        assert len(active) == 1 and active[0]['revisionName'] == rev and active[0]['percent'] == 100
        (cut / (svc + '.before.json')).write_text(json.dumps(s))
        a = s['metadata'].get('annotations', {})
        scale = str(a.get('run.googleapis.com/manualInstanceCount', '0')) if a.get('run.googleapis.com/scalingMode') == 'manual' else 'auto'
        rollback.append(shlex.join(['gcloud', 'run', 'services', 'update', svc, '--scaling=' + scale] + FLAGS))
        tags = [t['tag'] + '=' + t['revisionName'] for t in s['status']['traffic'] if t.get('tag')]
        if tags:
            rollback.append(shlex.join(['gcloud', 'run', 'services', 'update-traffic', svc, '--set-tags=' + ','.join(tags)] + FLAGS))
        drain = max(drain, int(s['spec']['template']['spec'].get('timeoutSeconds', 300)) + 30)
    assert drain <= 600
    (cut / 'rollback.sh').write_text('\n'.join(rollback) + '\n')
    (root / 'academy-prepared-cut-path').write_text(str(cut))
    print('ACADEMY_PREFLIGHT_OK', str(cut), flush=True)
    watchdog = subprocess.Popen([sys.executable, str(Path(__file__).resolve()), '--watchdog', str(cut)],
                                stdout=log, stderr=log, start_new_session=True)
    try:
        def freeze(svc):
            run(['gcloud', 'run', 'services', 'update-traffic', svc, '--clear-tags', '--to-revisions=' + REVISIONS[svc] + '=100'] + FLAGS)
            run(['gcloud', 'run', 'services', 'update', svc, '--scaling=0'] + FLAGS)
            s = json.loads(run(['gcloud', 'run', 'services', 'describe', svc] + FLAGS + ['--format=json']))
            a = s['metadata']['annotations']
            assert a.get('run.googleapis.com/scalingMode') == 'manual' and str(a.get('run.googleapis.com/manualInstanceCount')) == '0'
            assert not any(t.get('tag') for t in s['status']['traffic'])
            print('ACADEMY_ORIGEN_PAUSADO', svc, flush=True)
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as p:
            list(p.map(freeze, REVISIONS))
        print('ACADEMY_DRENAJE', drain, flush=True)
        time.sleep(drain)
        tables = int(run(['psql', '-Atc', "select count(*) from information_schema.tables where table_schema='public'"], env=env))
        counts = json.loads(run(['psql', '-Atc', "select json_build_object('users',(select count(*) from users),'enrollments',(select count(*) from enrollments),'subscriptions',(select count(*) from subscriptions),'transactions',(select count(*) from transactions))"], env=env))
        dump = cut / 'figma-final.dump'
        run(['pg_dump', '--format=custom', '--no-owner', '--no-acl', '--file', str(dump)], env=env)
        assert tables > 0 and dump.stat().st_size > 10000
        run(['pg_restore', '--list', str(dump)])
        digest = hashlib.sha256(dump.read_bytes()).hexdigest()
        sha = cut / 'figma-final.dump.sha256'
        sha.write_text(digest + '  figma-final.dump\n')
        receipt = cut / 'receipt.json'
        receipt.write_text(json.dumps({'final': True, 'tables': tables, 'counts': counts, 'sha256': digest, 'created_epoch': time.time(), 'revisions': REVISIONS}))
        run(ssh + ['install -d -m 700 ' + DEST])
        run(['scp', '-o', 'BatchMode=yes', '-o', 'ControlPath=' + control, str(dump), str(sha), str(receipt), 'root@5.183.11.142:' + DEST + '/'])
        run(ssh + ['cd ' + DEST + ' && sha256sum -c figma-final.dump.sha256 && touch SNAPSHOT_RECEIVED_OK'])
        (cut / 'FINAL_SNAPSHOT_OK').write_text(digest)
        print('ACADEMY_FINAL_SNAPSHOT_OK', tables, dump.stat().st_size, flush=True)
    except BaseException:
        watchdog.terminate()
        if not (cut / 'VPS_WRITES_ACTIVE').exists():
            subprocess.run(['bash', str(cut / 'rollback.sh')], stdout=log, stderr=log, check=True)
        raise


if __name__ == '__main__':
    if len(sys.argv) == 3 and sys.argv[1] == '--watchdog':
        cut = Path(sys.argv[2])
        time.sleep(1200)
        if not (cut / 'VPS_WRITES_ACTIVE').exists():
            subprocess.run(['bash', str(cut / 'rollback.sh')], check=True)
            (cut / 'WATCHDOG_ROLLBACK').write_text(str(time.time()))
    elif len(sys.argv) == 3 and sys.argv[2] == '--confirm-freeze':
        snapshot(sys.argv[1])
    else:
        raise SystemExit('root --confirm-freeze | --watchdog cut-directory')
