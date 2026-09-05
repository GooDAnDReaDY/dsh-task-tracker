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

test('client ModuleLoader id matches package and registers settings card', async () => {
  const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  const client = await readFile(resolve(root, 'lib/client.js'), 'utf8');
  const host = await readFile(resolve(root, 'lib/index.js'), 'utf8');
  assert.equal(pkg.name, '@goodandready-private/dsh-task-tracker');
  assert.match(client, /id: '@goodandready-private\/dsh-task-tracker'/);
  assert.match(client, /settings\.plugin\.item/);
  assert.match(client, /key: NS/);
  assert.match(client, /Never echo secret pass/);
  assert.match(host, /settings\.register\(NS/);
  assert.match(host, /role\('secret'\)/);
  assert.equal(pkg.dsh?.client?.platform, 'web');
});
