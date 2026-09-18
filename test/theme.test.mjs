import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('client CSS uses design tokens and contains no un-tokenized raw hex/rgba values', async () => {
  const clientSource = await readFile(resolve(root, 'lib/client.js'), 'utf8');
  const cssMatch = clientSource.match(/const CSS =\s*([\s\S]*?)\n\n\s*function createToggle/);
  assert.ok(cssMatch, 'CSS constant must be present in lib/client.js');

  const css = cssMatch[1];

  let stripped = css;
  let prev;
  do {
    prev = stripped;
    stripped = stripped.replace(/var\(--[a-zA-Z0-9_-]+(?:,\s*(?:color-mix\([^)]+\)|#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)|[^(),]+))*\)/g, 'TOKEN');
    stripped = stripped.replace(/color-mix\(in\s+srgb,\s*(?:TOKEN|var\([^)]+\)|#[0-9a-fA-F]{3,6})\s+\d+%?,\s*(?:transparent|TOKEN|var\([^)]+\)|#[0-9a-fA-F]{3,6})\)/g, 'TOKEN');
  } while (stripped !== prev);

  const matches = Array.from(stripped.matchAll(/#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)/g)).map((m) => m[0]);
  assert.deepEqual(matches, [], `client CSS must not contain raw hex or rgba outside design tokens: ${matches.join(', ')}`);
});
