import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function loadClientModule(code) {
  let loadedModule = null;
  const mockWindow = {
    get window() { return mockWindow; },
    setTimeout: (...args) => setTimeout(...args),
    clearTimeout: (...args) => clearTimeout(...args),
    __ModuleLoader__: {
      load: ({ id, factory }) => {
        const mockRequire = (mod) => {
          if (mod === 'react') {
            return {
              useState: (init) => [typeof init === 'function' ? init() : init, () => {}],
              useEffect: () => {},
              useRef: () => ({ current: null }),
              createElement: () => null,
            };
          }
          return {};
        };
        loadedModule = factory(mockRequire);
      },
    },
  };

  const context = vm.createContext(mockWindow);
  vm.runInContext(code, context);
  return loadedModule;
}

test('client lifecycle: registers locale and slot in ctx.effect with cleanups', async () => {
  const code = await readFile(resolve(root, 'lib/client.js'), 'utf8');
  const mod = loadClientModule(code);

  assert.ok(mod, 'client module should load via __ModuleLoader__');
  assert.equal(typeof mod.apply, 'function');
  assert.deepEqual(Array.from(mod.inject), ['slots', 'locale', 'settingsScope']);

  let unregisterLocaleCalled = 0;
  let unregisterSlotCalled = 0;
  const effects = [];
  const registeredLocales = [];
  const injectedSlots = [];

  const mockCtx = {
    locale: {
      register: (ns, dict) => {
        registeredLocales.push({ ns, dict });
        return () => { unregisterLocaleCalled++; };
      },
    },
    slots: {
      inject: (slotName, callback) => {
        injectedSlots.push(slotName);
        callback();
        return () => { unregisterSlotCalled++; };
      },
      register: (spec, comp) => spec,
    },
    effect: (fn, name) => {
      const cleanup = fn();
      effects.push({ name, cleanup });
    },
  };

  mod.apply(mockCtx);

  // Check effects registered
  const effectNames = effects.map((e) => e.name);
  assert.ok(effectNames.includes('dsh-task-tracker: словари'), 'locale effect registered');
  assert.ok(effectNames.includes('dsh-task-tracker: карточка'), 'card slot effect registered');
  assert.ok(effectNames.includes('dsh-task-tracker: fallback section'), 'fallback section effect registered');

  // Verify initial registration
  assert.equal(registeredLocales.length, 1);
  assert.equal(registeredLocales[0].ns, 'dsh-task-tracker');
  assert.ok(registeredLocales[0].dict.en);
  assert.equal(registeredLocales[0].dict.ru, undefined, 'ru locale must not be bundled');
  assert.ok(injectedSlots.includes('settings.plugin.item'));
  assert.ok(injectedSlots.includes('conversation.session.header.utilities'));
  assert.ok(effectNames.includes('dsh-task-tracker: chip'));
  assert.ok(effectNames.includes('dsh-task-tracker: overlay'));

  // Run cleanups (simulate unmount/re-apply)
  for (const eff of effects) {
    if (typeof eff.cleanup === 'function') {
      eff.cleanup();
    }
  }

  assert.equal(unregisterLocaleCalled, 1, 'locale unregister callback was called on cleanup');
  assert.equal(unregisterSlotCalled, 2, 'slot unregister callback was called on cleanup for card and chip');
});

test('client lifecycle: double apply works cleanly without duplicating uncleaned state', async () => {
  const code = await readFile(resolve(root, 'lib/client.js'), 'utf8');
  const mod = loadClientModule(code);

  let activeLocaleRegistrations = 0;
  let activeSlotInjections = 0;

  function createMockCtx() {
    const cleanups = [];
    return {
      ctx: {
        locale: {
          register: (ns, dict) => {
            activeLocaleRegistrations++;
            return () => { activeLocaleRegistrations--; };
          },
        },
        slots: {
          inject: (slotName, cb) => {
            activeSlotInjections++;
            cb();
            return () => { activeSlotInjections--; };
          },
          register: () => {},
        },
        effect: (fn) => {
          const undo = fn();
          if (typeof undo === 'function') cleanups.push(undo);
        },
      },
      dispose: () => {
        while (cleanups.length) cleanups.pop()();
      },
    };
  }

  // First apply
  const session1 = createMockCtx();
  assert.doesNotThrow(() => mod.apply(session1.ctx));
  assert.equal(activeLocaleRegistrations, 1);
  assert.equal(activeSlotInjections, 2);

  // Reload / second apply: first session disposed, second applied
  session1.dispose();
  assert.equal(activeLocaleRegistrations, 0);
  assert.equal(activeSlotInjections, 0);

  const session2 = createMockCtx();
  assert.doesNotThrow(() => mod.apply(session2.ctx));
  assert.equal(activeLocaleRegistrations, 1);
  assert.equal(activeSlotInjections, 2);

  session2.dispose();
  assert.equal(activeLocaleRegistrations, 0);
  assert.equal(activeSlotInjections, 0);
});

test('client lifecycle: registration errors are not silently swallowed', async () => {
  const code = await readFile(resolve(root, 'lib/client.js'), 'utf8');
  const mod = loadClientModule(code);

  const failingCtx = {
    locale: {
      register: () => {
        throw new Error('Locale registration failed intentionally');
      },
    },
    slots: {
      inject: () => {},
    },
    effect: (fn) => {
      // Cordis effect runner executes fn(); if fn throws, it bubbles
      fn();
    },
  };

  assert.throws(
    () => mod.apply(failingCtx),
    /Locale registration failed intentionally/,
    'registration error must not be swallowed by empty catch',
  );
});
