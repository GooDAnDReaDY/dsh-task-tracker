import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('private package and host bundle identities match', async () => {
  const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  const patch = await readFile(resolve(root, 'cordis.patch.yml'), 'utf8');
  assert.equal(pkg.name, '@goodandready-private/dsh-task-tracker');
  assert.match(patch, /name: '@goodandready-private\/dsh-task-tracker'/);
  assert.doesNotMatch(patch, /name: dsh-task-tracker/);
});

test('source contains no embedded password', async () => {
  const source = await readFile(resolve(root, 'lib/index.js'), 'utf8');
  assert.doesNotMatch(source, /return\s+['"]\d{6,}['"]/);
  assert.doesNotMatch(source, /020291/);
});

test('source has no machine-specific infrastructure references', async () => {
  const source = await readFile(resolve(root, 'lib/index.js'), 'utf8');
  assert.doesNotMatch(source, /\/home\/|192\.168\.|codex_migrate|MiniAI|MiniPC|vadim@/);
});
