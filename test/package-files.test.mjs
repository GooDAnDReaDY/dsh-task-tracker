import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('package.json files array is clean, deduplicated and excludes tests/internal docs', async () => {
  const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));

  assert.ok(Array.isArray(pkg.files), 'package.json must have files array');

  // No duplicates
  const set = new Set(pkg.files);
  assert.equal(set.size, pkg.files.length, 'files array must not contain duplicate entries');

  // Must not contain trailing slash duplicates like lib/
  for (const entry of pkg.files) {
    assert.doesNotMatch(entry, /\/$/, `entry "${entry}" should not have trailing slash`);
  }

  // Must not contain test or AGENTS.md
  assert.equal(pkg.files.includes('test'), false, 'files must not include test directory');
  assert.equal(pkg.files.includes('AGENTS.md'), false, 'files must not include AGENTS.md');

  // Must contain essential package files
  assert.ok(pkg.files.includes('README.md'));
  assert.ok(pkg.files.includes('cordis.patch.yml'));
  assert.ok(pkg.files.includes('lib'));
});

test('npm pack --dry-run includes only runtime product files, no test/AGENTS artifacts', async () => {
  const { stdout } = await execFileAsync('npm', ['pack', '--dry-run', '--json'], { cwd: root });
  const [packInfo] = JSON.parse(stdout);

  assert.ok(packInfo && Array.isArray(packInfo.files), 'npm pack output must list files');

  const filePaths = packInfo.files.map((f) => f.path);

  // Must NOT include test files or AGENTS.md
  for (const fp of filePaths) {
    assert.doesNotMatch(fp, /^test\//, `package tarball must not contain test file: ${fp}`);
    assert.doesNotMatch(fp, /AGENTS\.md/, `package tarball must not contain AGENTS.md: ${fp}`);
  }

  // Must include essential files
  assert.ok(filePaths.includes('package.json'));
  assert.ok(filePaths.includes('README.md'));
  assert.ok(filePaths.includes('cordis.patch.yml'));
  assert.ok(filePaths.includes('lib/index.js'));
  assert.ok(filePaths.includes('lib/client.js'));
});
