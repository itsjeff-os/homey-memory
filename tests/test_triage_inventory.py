"""Exercise triage and README regeneration in an isolated repository."""
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


class TriageInventoryTests(unittest.TestCase):
    def test_dry_run_then_move_refreshes_source_and_destination(self):
        source = Path(__file__).resolve().parents[1]
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            subprocess.run(['git', 'init', '-q'], cwd=root, check=True)
            for name in ('scripts', 'intake/queue', 'intake/processing', 'intake/unsorted', 'target'):
                (root / name).mkdir(parents=True)
            (root / '.gitignore').write_text('__pycache__/\n')
            for name in ('triage.py', 'generate_readmes.py'):
                shutil.copyfile(source / 'scripts' / name, root / 'scripts' / name)
            (root / 'intake/triage-rules.yaml').write_text('rules: []\n')
            queued = root / 'intake/queue/evidence.md'
            queued.write_text('---\ndestination: target\n---\nEvidence stays unchanged.\n')
            expected = queued.read_bytes()
            subprocess.run([sys.executable, 'scripts/generate_readmes.py'], cwd=root, check=True, capture_output=True)
            before = (root / 'intake/queue/README.md').read_bytes()
            subprocess.run([sys.executable, 'scripts/triage.py', '--dry-run'], cwd=root, check=True, capture_output=True)
            self.assertTrue(queued.exists())
            self.assertEqual(before, (root / 'intake/queue/README.md').read_bytes())
            subprocess.run([sys.executable, 'scripts/triage.py'], cwd=root, check=True, capture_output=True)
            self.assertFalse(queued.exists())
            self.assertEqual(expected, (root / 'target/evidence.md').read_bytes())
            self.assertNotIn('evidence.md', (root / 'intake/queue/README.md').read_text())
            self.assertIn('evidence.md', (root / 'target/README.md').read_text())
            subprocess.run([sys.executable, 'scripts/generate_readmes.py', '--check'], cwd=root, check=True, capture_output=True)


if __name__ == '__main__':
    unittest.main()
