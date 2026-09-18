import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSemver, isNewerVersion, registerPluginUpdater, findDshCliEntry } from '../lib/updater.js';

test('updater: semver parsing and version comparison', () => {
  assert.deepEqual(parseSemver('0.2.1'), { core: [0, 2, 1], prerelease: [] });
  assert.deepEqual(parseSemver('1.0.0-beta.1'), { core: [1, 0, 0], prerelease: ['beta', '1'] });
  assert.equal(parseSemver('invalid'), undefined);

  assert.equal(isNewerVersion('0.2.1', '0.2.2'), true);
  assert.equal(isNewerVersion('0.2.2', '0.2.1'), false);
  assert.equal(isNewerVersion('0.2.2', '0.2.2'), false);
  assert.equal(isNewerVersion('0.2.1', '0.3.0'), true);
  assert.equal(isNewerVersion('0.2.1', '1.0.0'), true);
});

test('updater: registers endpoint in webServer', () => {
  const registered = [];
  const mockWebServer = {
    register: (spec) => {
      registered.push(spec);
      return () => {};
    },
  };
  const ctx = { webServer: mockWebServer };
  const cleanup = registerPluginUpdater(ctx, {
    endpoint: '/dsh-task-tracker/api/updater',
    packageName: '@goodandready-private/dsh-task-tracker',
    manifestUrl: new URL('../package.json', import.meta.url),
  });

  assert.ok(registered.length >= 1, 'endpoint registered in webServer');
  assert.equal(registered[0].path, '/dsh-task-tracker/api/updater');
  assert.equal(typeof registered[0].handler, 'function');
  assert.equal(typeof cleanup, 'function');
});

test('updater: findDshCliEntry terminates without infinite loop when package.json is absent', () => {
  const origArgv1 = process.argv[1];
  try {
    process.argv[1] = '/home/vadim/.nvm/versions/node/v24.15.0/bin/node';
    const start = Date.now();
    const result = findDshCliEntry();
    const duration = Date.now() - start;
    assert.ok(duration < 200, 'must terminate in under 200ms, took ' + duration + 'ms');
    assert.equal(result, undefined);
  } finally {
    process.argv[1] = origArgv1;
  }
});
