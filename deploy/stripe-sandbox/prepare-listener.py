#!/usr/bin/env python3
"""Capture the local test listener secret without printing or committing it."""
from pathlib import Path
import os
import re
import subprocess
import tempfile
folder = Path(__file__).resolve().parent
env_file = folder / '.env.sandbox'
values = env_file.read_text()
key = re.search(r'^STRIPE_TEST_SECRET_KEY=(.*)$', values, re.M)
if not key or not key[1].startswith(('sk_test_', 'rk_test_')):
    raise SystemExit('Enter a Stripe test key in .env.sandbox first. No changes made.')
command = ['docker', 'compose', '--env-file', str(env_file), '-f', str(folder / 'compose.yaml'),
           '--profile', 'stripe', 'run', '--rm', '--no-deps', 'stripe-listener', 'listen', '--print-secret']
result = subprocess.run(command, capture_output=True, text=True, timeout=90)
secret = re.search(r'\bwhsec_[A-Za-z0-9]+\b', result.stdout)
if result.returncode or not secret:
    raise SystemExit('Could not obtain the test listener signing secret. No env changes; raw output withheld.')
values = re.sub(r'^STRIPE_TEST_WEBHOOK_SECRET=.*$', lambda _: 'STRIPE_TEST_WEBHOOK_SECRET=' + secret[0], values, flags=re.M)
fd, temp = tempfile.mkstemp(dir=folder, prefix='.env.sandbox-tmp-')
try:
    with os.fdopen(fd, 'w') as output:
        output.write(values)
    os.replace(temp, env_file)
finally:
    if os.path.exists(temp): os.unlink(temp)
print('Test listener signing secret saved privately. No secret printed.')
