import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('client registers only canonical English locale', async () => {
  const clientSource = await readFile(resolve(root, 'lib/client.js'), 'utf8');

  // Must register { en: ... }
  assert.match(clientSource, /ctx\.locale\.register\(NS,\s*\{\s*en:\s*\{/);

  // Must not contain bundled ru dictionary in lib/client.js
  assert.doesNotMatch(clientSource, /\bru:\s*\{/);
  assert.doesNotMatch(clientSource, /Загрузка…/);
  assert.doesNotMatch(clientSource, /Токен доступа/);
});

test('client dictionary keys match expected keys for external dsh-russian-lang translation', async () => {
  const clientSource = await readFile(resolve(root, 'lib/client.js'), 'utf8');

  const match = clientSource.match(/en:\s*\{([\s\S]*?)\n\s*\}/);
  assert.ok(match, 'must find en dictionary in lib/client.js');

  const dictBody = match[1];
  const keys = Array.from(dictBody.matchAll(/['"]?([a-zA-Z0-9_.-]+)['"]?:/g)).map((m) => m[1]);

  const expectedKeys = [
    'title',
    'subtitle',
    'loading',
    'unavailable',
    'save',
    'saving',
    'saved',
    'field.base',
    'field.user',
    'field.pass',
    'field.passFile',
    'passPlaceholder',
    'passHint',
  ];

  for (const exp of expectedKeys) {
    assert.ok(keys.includes(exp), `en dictionary must include key: ${exp}`);
  }
});

test('host tools in lib/index.js have Russian descriptions for LLM model', async () => {
  const hostSource = await readFile(resolve(root, 'lib/index.js'), 'utf8');

  assert.match(hostSource, /'Создать задачу в todo-инбоксе/);
  assert.match(hostSource, /'Список задач из todo-инбокса/);
  assert.match(hostSource, /'Отметить задачу в todo-инбоксе/);
  assert.match(hostSource, /description:\s*'Заголовок задачи/);
});
