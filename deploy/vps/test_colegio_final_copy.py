"""Offline cutover rehearsal: fake Cloud SDK, HTTP and drain wait, no credentials."""
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPT = Path(__file__).with_name('colegio-final-copy.sh')
FAKE = '''import json,os,pathlib,sys
r=pathlib.Path(os.environ['COLEGIO_COPY_TEST_ROOT']); a=sys.argv[1:]
with (r/'calls').open('a') as f:f.write(' '.join(a)+'\\n')
if a[:3]==['run','services','describe']:
 n=int((r/'count').read_text()) if (r/'count').exists() else 0
 (r/'count').write_text(str(n+1))
 tag={'tag':'old','revisionName':'school-previous','url':'https://tag.example.invalid'}
 tags=[tag] if n==0 or os.environ.get('COLEGIO_TEST_TAG_REMAINS') else []
 s={'metadata':{'annotations':{} if n==0 else {'run.googleapis.com/scalingMode':'manual','run.googleapis.com/manualInstanceCount':'0'}},'spec':{'template':{'spec':{'timeoutSeconds':1}}},'status':{'url':'https://school.example.invalid','traffic':tags}}
 print(json.dumps(s))
elif a[:3]==['storage','ls','--recursive']:print('inventario ficticio estable')
elif a[:2]==['storage','rsync']:
 d=pathlib.Path(a[-1]);(d/'uploads').mkdir();(d/'uploads/logo.png').write_bytes(b'ficticio')
 (d/'content.json').write_text('{}');(d/'store-accounts.json').write_text('[]')
'''


class CopyTests(unittest.TestCase):
    def exercise(self, tags_remain=False):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root / 'fake.py').write_text(FAKE)
            env = {**os.environ, 'COLEGIO_COPY_TEST_ROOT': temp, 'COLEGIO_BACKUP_PARENT': temp}
            if tags_remain:
                env['COLEGIO_TEST_TAG_REMAINS'] = '1'
            shell = '''gcloud() { python3 "$COLEGIO_COPY_TEST_ROOT/fake.py" "$@"; }
curl() { printf 503; }
sleep() { :; }
export -f gcloud curl sleep
bash "$1" --freeze-and-copy
'''
            result = subprocess.run(['bash', '-c', shell, 'test', str(SCRIPT)], env=env, text=True, capture_output=True)
            copies = list(root.glob('colegio-respaldo-final.*'))
            self.assertEqual(len(copies), 1)
            copy = copies[0]
            calls = (root / 'calls').read_text()
            if tags_remain:
                self.assertNotEqual(result.returncode, 0)
                self.assertNotIn('storage rsync', calls)
                self.assertFalse((copy / 'colegio-final.tar.gz').exists())
            else:
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertTrue((copy / 'colegio-final.tar.gz').is_file())
                subprocess.run(['shasum', '-a', '256', '-c', 'colegio-final.tar.gz.sha256'], cwd=copy, check=True, capture_output=True)
                rollback = (copy / 'reactivar-origen-antes-de-escrituras-vps.sh').read_text()
                self.assertIn('--scaling=auto', rollback)
                self.assertIn('--set-tags=old=school-previous', rollback)
                self.assertLess(calls.index('--clear-tags'), calls.index('--scaling=0'))

    def test_freeze_copy_and_rollback_inventory(self):
        self.exercise()

    def test_refuses_copy_if_tag_remains(self):
        self.exercise(tags_remain=True)


if __name__ == '__main__':
    unittest.main()
