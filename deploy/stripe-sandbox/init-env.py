#!/usr/bin/env python3
from pathlib import Path
import os
import secrets
folder = Path(__file__).resolve().parent
output = folder / '.env.sandbox'
content = (folder / '.env.sandbox.example').read_text()
for name in ['SANDBOX_ADMIN_PASSWORD', 'SANDBOX_APP_KEY', 'SANDBOX_WEBHOOK_KEY', 'SANDBOX_HUB_KEY', 'SANDBOX_STOREFRONT_KEY']:
    content = content.replace(f'{name}=\n', f'{name}={secrets.token_hex(32)}\n')
fd = os.open(output, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(fd, 'w') as handle:
    handle.write(content)
print('Sandbox env created with fresh local secrets (0600). No secrets printed.')
