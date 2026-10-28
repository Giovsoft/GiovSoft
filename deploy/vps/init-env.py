#!/usr/bin/env python3
"""Create new VPS secrets locally, without replacing or printing existing values."""
import os
from pathlib import Path
import secrets

folder = Path(__file__).resolve().parent
output = folder / ".env.production"
if output.exists():
    raise SystemExit("Existing .env.production preserved; no changes made.")
values = (folder / ".env.production.example").read_text()
for name in ("POSTGRES_PASSWORD", "ADMIN_PASSWORD", "ADMIN_TOKEN_SECRET"):
    values = values.replace(f"{name}=\n", f"{name}={secrets.token_hex(32)}\n")
fd = os.open(output, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(fd, "w") as handle:
    handle.write(values)
print("Created .env.production with mode 0600. Secrets were not printed.")
print("Configure SMTP on the server before testing admin two-factor login.")
