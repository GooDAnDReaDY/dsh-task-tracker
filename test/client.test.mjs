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
              useCallback: (fn) => fn,
              useRef: () => ({ current: null }),
              createElement: (type, props, ...children) => ({ type, props, children }),
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

test('client: registers all required slots and locale keys for TasksScreen and chip', async () => {
  const code = await readFile(resolve(root, 'lib/client.js'), 'utf8');
  const mod = loadClientModule(code);

  const registeredLocales = {};
  const injectedSlots = [];

  const mockCtx = {
    locale: {
      register: (ns, dict) => {
        registeredLocales[ns] = dict;
        return () => {};
      },
    },
    slots: {
      inject: (slotName, cb) => {
        injectedSlots.push(slotName);
        cb();
        return () => {};
      },
      register: (spec, comp) => spec,
    },
    effect: (fn) => {
      fn();
    },
  };

  mod.apply(mockCtx);

  // Assert slots
  assert.ok(injectedSlots.includes('settings.plugin.item'), 'settings card slot injected');
  assert.ok(!injectedSlots.includes('settings.section'), 'settings.section must not be injected (plugin.item only)');
  assert.ok(injectedSlots.includes('conversation.session.header.utilities'), 'header chip slot injected');

  // Assert locale keys for Tasks screen
  const enDict = registeredLocales['dsh-task-tracker']?.en;
  assert.ok(enDict, 'en locale registered');
  assert.equal(enDict['tasks.title'], 'Tasks');
  assert.equal(enDict['tasks.all'], 'All');
  assert.equal(enDict['tasks.active'], 'Active');
  assert.equal(enDict['tasks.completed'], 'Done');
  assert.equal(enDict['tasks.search'], 'Search tasks…');
  assert.equal(enDict['tasks.newPlaceholder'], 'What needs to be done?');
  assert.equal(enDict['tasks.add'], 'Add Task');
  assert.equal(enDict['tasks.empty'], 'No tasks found');
  assert.equal(enDict['tasks.delete'], 'Delete task');
  assert.equal(enDict['tasks.close'], 'Close');

  const zhDict = registeredLocales['dsh-task-tracker']?.zh;
  assert.ok(zhDict, 'zh locale registered');
  assert.equal(zhDict['tasks.title'], '任务');
  assert.equal(zhDict['tasks.all'], '全部');
  assert.equal(zhDict['tasks.active'], '进行中');
  assert.equal(zhDict['tasks.completed'], '已完成');
});
