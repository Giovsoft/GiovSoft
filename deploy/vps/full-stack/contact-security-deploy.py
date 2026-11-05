#!/usr/bin/env python3
"""Prepare/apply/roll back the contact-only image. Never modifies application data."""
import argparse
import hashlib
import ipaddress
import json
import os
from pathlib import Path
import shutil
import subprocess
import time

ROOT = Path('/root/colegio-contact-security-20261105')
SOURCE = ROOT / 'source'
OPS = Path('/opt/giovsoft')
RUNTIME = Path('/opt/colegio-completo/production-20261104-r2/runtime.json')
BACKUP = ROOT / 'runtime-before-contact.json'
REF = '230ecdbf9f554f18753d98e2b7d97330cc5e1a44'
BASE_SHA = '76c70c718edd714e078df559c5a84ad3048fd70ba2f97459116436a0801e9dec'
IMAGE = 'colegio-contact:' + REF[:12]
SCHOOL = 'colegio-completo-r2-school-1'
PREVIEW = 'colegio-contact-preflight-20261105'

def run(*args, **kwargs):
    return subprocess.run(list(args), check=True, **kwargs)

def output(*args, **kwargs):
    return subprocess.check_output(list(args), text=True, **kwargs).strip()

def write_private(path, data):
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_text(data)
    temporary.chmod(0o600)
    os.replace(temporary, path)

def compose_school():
    run('docker', 'compose', '-p', 'colegio-completo-r2', '-f', str(OPS/'deploy/vps/full-stack/compose.stage.yaml'), '-f', str(RUNTIME), '-f', str(OPS/'deploy/vps/full-stack/compose.production.yaml'), 'up', '-d', '--no-deps', '--force-recreate', '--wait', 'school', cwd=OPS)
    run('docker', 'exec', 'colegio-completo-r2-access-1', 'nginx', '-t')
    run('docker', 'exec', 'colegio-completo-r2-access-1', 'nginx', '-s', 'reload')

def prepare():
    current = output('docker','exec',SCHOOL,'sha256sum','/app/server/index.js').split()[0]
    if current != BASE_SHA:
        raise RuntimeError('Current school source differs; inspect before deploying')
    if not SOURCE.exists():
        run('git','clone','--single-branch','--branch','codex/contact-turnstile','https://github.com/Giovsoft/Iberoamericano.git',str(SOURCE))
    run('git','fetch','origin',REF,cwd=SOURCE)
    run('git','checkout','--detach',REF,cwd=SOURCE)
    assert output('git','rev-parse','HEAD',cwd=SOURCE) == REF
    run('docker','build','--tag',IMAGE,str(SOURCE))
    run('docker','run','--rm','--network','none','--read-only','--tmpfs','/tmp','--cap-drop','ALL',IMAGE,'node','--test','server/contact-security.test.js')
    # No SMTP variables, production volumes, exposed ports, or network access.
    run('docker','run','--detach','--name',PREVIEW,'--network','none','--read-only','--tmpfs','/tmp','--cap-drop','ALL','--security-opt','no-new-privileges:true','-e','TURNSTILE_SITE_KEY=preflight','-e','TURNSTILE_SECRET_KEY=preflight',IMAGE,stdout=subprocess.DEVNULL)
    try:
        for _ in range(30):
            ready = subprocess.run(['docker','exec',PREVIEW,'node','-e',"fetch('http://127.0.0.1:8080/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
            if ready.returncode == 0:
                break
            time.sleep(1)
        else:
            raise RuntimeError('Private preflight did not become ready')
        check = """const base='http://127.0.0.1:8080';const lead={guardian:'Prueba privada',phone:'3312345678',email:'migration@example.invalid',level:'Primaria',message:'Prueba',website:''};(async()=>{for(const [path,options,expected] of [['/api/contact-config',{},200],['/api/informes',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(lead)},403],['/api/informes',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...lead,message:'x'.repeat(20000)})},413]]){const r=await fetch(base+path,options);if(r.status!==expected)throw Error(path+' '+r.status);console.log('PRIVATE_CONTACT_CHECK',path,r.status)}})().catch(()=>process.exit(1))"""
        run('docker','exec',PREVIEW,'node','-e',check)
    finally:
        run('docker','rm','--force',PREVIEW,stdout=subprocess.DEVNULL)
    # Official lists verified on 2026-11-05; refresh this artifact before reuse.
    ranges = json.loads((ROOT/'cloudflare-proxy-cidrs-2026-11-05.json').read_text())
    assert len(ranges) >= 20
    for cidr in ranges:
        ipaddress.ip_network(cidr)
    write_private(ROOT/'cloudflare-ranges.json',json.dumps(ranges))
    write_private(ROOT/'PREPARED.json',json.dumps({'source':REF,'image':IMAGE,'base_sha256':BASE_SHA}))
    print('CONTACT_PREPARED_NO_MAIL_NO_PRODUCTION_CHANGE',flush=True)

def apply():
    prepared = json.loads((ROOT/'PREPARED.json').read_text())
    assert prepared['source'] == REF and not BACKUP.exists()
    keys = json.loads((ROOT/'turnstile.json').read_text())
    assert keys.get('siteKey') and keys.get('secretKey')
    assert output('docker','exec',SCHOOL,'sha256sum','/app/server/index.js').split()[0] == BASE_SHA
    old = RUNTIME.read_text()
    write_private(BACKUP,old)
    d = json.loads(old)
    school = d['services']['school']
    school['image'] = IMAGE
    env = school.setdefault('environment',{})
    env['TURNSTILE_SITE_KEY'] = keys['siteKey']
    env['TURNSTILE_SECRET_KEY'] = keys['secretKey']
    networks = json.loads(output('docker','network','inspect','colegio-completo_live','giovsoft-vps_app'))
    trusted = [c['Subnet'] for n in networks for c in n['IPAM']['Config'] if c.get('Subnet')]
    assert trusted
    env['CONTACT_TRUSTED_PROXY_CIDRS'] = ','.join(trusted)
    env['CONTACT_CLOUDFLARE_CIDRS'] = ','.join(json.loads((ROOT/'cloudflare-ranges.json').read_text()))
    try:
        write_private(RUNTIME,json.dumps(d,indent=2))
        compose_school()
        assert output('docker','inspect',SCHOOL,'--format','{{.Config.Image}}') == IMAGE
        write_private(ROOT/'APPLIED.json',json.dumps({'source':REF,'image':IMAGE,'previous_runtime_sha256':hashlib.sha256(old.encode()).hexdigest()}))
        print('CONTACT_SECURITY_APPLIED',flush=True)
    except Exception:
        write_private(RUNTIME,old)
        compose_school()
        print('CONTACT_DEPLOY_FAILED_PREVIOUS_IMAGE_RESTORED',flush=True)
        raise

def rollback():
    assert BACKUP.is_file()
    write_private(RUNTIME,BACKUP.read_text())
    compose_school()
    print('CONTACT_PREVIOUS_IMAGE_RESTORED',flush=True)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('mode',choices=['prepare','apply','rollback'])
    args = parser.parse_args()
    if os.geteuid() != 0:
        raise SystemExit('Run as root on the production VPS')
    os.umask(0o077)
    ROOT.mkdir(mode=0o700,exist_ok=True)
    {'prepare':prepare,'apply':apply,'rollback':rollback}[args.mode]()
