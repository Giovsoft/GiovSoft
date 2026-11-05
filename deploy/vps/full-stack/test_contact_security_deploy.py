import importlib.util
from pathlib import Path
import sys
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('contact_deploy', Path(__file__).with_name('contact-security-deploy.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class ContactDeploymentTests(unittest.TestCase):
    def test_checked_output_uses_source_working_directory(self):
        with tempfile.TemporaryDirectory() as folder:
            self.assertEqual(module.output(sys.executable, '-c', 'import os; print(os.getcwd())', cwd=folder), str(Path(folder).resolve()))

if __name__ == '__main__':
    unittest.main()
