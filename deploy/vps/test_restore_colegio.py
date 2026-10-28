import hashlib
import io
import json
from pathlib import Path
import subprocess
import sys
import tarfile
import tempfile
import unittest

SCRIPT = Path(__file__).with_name('restore-colegio.py')


class RestoreTests(unittest.TestCase):
    def run_restore(self, extra=None, existing=False, bad_checksum=False):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            archive = root / 'colegio-inicial.tar.gz'
            with tarfile.open(archive, 'w:gz') as tar:
                for name, value in [('datos/content.json', b'{"title":"ficticio"}'),
                                    ('datos/store-accounts.json', b'[{"email":"fake@example.test"}]'),
                                    ('datos/uploads/demo.png', b'fake-image')]:
                    info = tarfile.TarInfo(name)
                    info.size = len(value)
                    tar.addfile(info, io.BytesIO(value))
                if extra:
                    info = tarfile.TarInfo(extra)
                    info.size = 1
                    tar.addfile(info, io.BytesIO(b'x'))
            digest = '0' * 64 if bad_checksum else hashlib.sha256(archive.read_bytes()).hexdigest()
            checksum = root / 'archive.sha256'
            checksum.write_text(digest + '  colegio-inicial.tar.gz\n')
            dest = root / 'restauracion'
            if existing:
                dest.mkdir()
                (dest / 'keep').write_text('original')
            result = subprocess.run([sys.executable, str(SCRIPT), str(archive), str(checksum), str(dest)], capture_output=True, text=True)
            if existing:
                self.assertEqual((dest / 'keep').read_text(), 'original')
            if result.returncode == 0:
                self.assertEqual(json.loads((dest / 'data/store-accounts.json').read_text())[0]['email'], 'fake@example.test')
                self.assertEqual((dest / 'uploads/demo.png').read_bytes(), b'fake-image')
                self.assertTrue((dest / 'SHA256SUMS').is_file())
                self.assertNotIn('fake@example.test', result.stdout)
            else:
                self.assertFalse((dest / 'data').exists())
            return result

    def test_restores_data_and_uploads_privately(self):
        self.assertEqual(self.run_restore().returncode, 0)

    def test_rejects_path_traversal(self):
        self.assertNotEqual(self.run_restore(extra='datos/../../escape').returncode, 0)

    def test_refuses_existing_destination(self):
        self.assertNotEqual(self.run_restore(existing=True).returncode, 0)

    def test_refuses_bad_checksum(self):
        self.assertNotEqual(self.run_restore(bad_checksum=True).returncode, 0)


if __name__ == '__main__':
    unittest.main()
