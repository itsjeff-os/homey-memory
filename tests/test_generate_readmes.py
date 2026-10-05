import importlib.util
from pathlib import Path
import subprocess
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location('generate_readmes', Path(__file__).resolve().parents[1] / 'scripts/generate_readmes.py')
generator = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(generator)


class InventoryTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.git('init', '-q')

    def git(self, *args):
        return subprocess.check_output(['git', *args], cwd=self.root)

    def write(self, name, text):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)
        return path

    def test_add_edit_move_delete_and_idempotence(self):
        source = self.write('alpha/a file.md', '# Actual title\n')
        generator.generate(self.root)
        original = (self.root / 'alpha/README.md').read_text()
        self.assertIn('a%20file.md', original)
        self.assertEqual([], generator.generate(self.root, check=True))
        source.write_text('Changed bytes')
        self.assertIn(Path('alpha/README.md'), generator.generate(self.root, check=True))
        self.assertEqual(original, (self.root / 'alpha/README.md').read_text())
        generator.generate(self.root)
        self.assertNotEqual(original, (self.root / 'alpha/README.md').read_text())
        target = self.root / 'beta/moved.md'
        target.parent.mkdir()
        source.rename(target)
        generator.generate(self.root)
        self.assertNotIn('a file.md', (self.root / 'alpha/README.md').read_text())
        self.assertIn('moved.md', (self.root / 'beta/README.md').read_text())
        self.git('add', '.')
        target.unlink()
        generator.generate(self.root)
        self.assertNotIn('moved.md', (self.root / 'beta/README.md').read_text())
        self.assertEqual([], generator.generate(self.root, check=True))

    def test_ignored_files_and_readme_prose_are_not_inputs(self):
        self.write('.gitignore', 'private/\n')
        self.write('private/secret.txt', 'private value')
        self.write('README.md', 'Invented purpose')
        self.write('empty/README.md', 'Unverified description')
        self.write('named_README.md', 'Source evidence')
        generator.generate(self.root)
        content = (self.root / 'README.md').read_text()
        self.assertNotIn('private', content)
        self.assertNotIn('Invented purpose', content)
        self.assertIn('named_README.md', content)
        self.assertIn('No inventory entries.', (self.root / 'empty/README.md').read_text())

    def test_symlinks_are_not_followed(self):
        with tempfile.TemporaryDirectory() as external:
            secret = Path(external) / 'secret'
            secret.write_text('DO NOT READ')
            (self.root / 'link').symlink_to(secret)
            generator.generate(self.root)
            content = (self.root / 'README.md').read_text()
            self.assertIn('symlink (link text)', content)
            self.assertNotIn('DO NOT READ', content)
            (self.root / 'README.md').unlink()
            (self.root / 'README.md').symlink_to(secret)
            with self.assertRaises(ValueError):
                generator.generate(self.root)
            self.assertEqual('DO NOT READ', secret.read_text())

    def test_paths_preserve_names_and_escape_links(self):
        self.write('A # β/file|[x].txt', 'bytes')
        generator.generate(self.root)
        self.assertIn('A%20%23%20%CE%B2', (self.root / 'README.md').read_text())
        self.assertIn('file%7C%5Bx%5D.txt', (self.root / 'A # β/README.md').read_text())


if __name__ == '__main__':
    unittest.main()
