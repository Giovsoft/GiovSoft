#!/usr/bin/env python3
"""Fetch only pinned source code from GitHub, never production service data."""
from pathlib import Path
import json
import subprocess
folder = Path(__file__).resolve().parent
parent = folder.parents[2]
for item in json.loads((folder / 'sources.lock.json').read_text()).values():
    target = parent / item['directory']
    if not target.exists():
        subprocess.run(['git', 'clone', '--no-checkout', item['repository'], str(target)], check=True)
        subprocess.run(['git', '-C', str(target), 'checkout', '--detach', item['commit']], check=True)
    head = subprocess.check_output(['git', '-C', str(target), 'rev-parse', 'HEAD'], text=True).strip()
    dirty = subprocess.check_output(['git', '-C', str(target), 'status', '--porcelain'], text=True).strip()
    if head != item['commit'] or dirty:
        raise SystemExit(f'{target.name}: expected pinned clean checkout; existing work preserved. Review manually.')
    print(f'{target.name}: pinned source verified.')
