import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { writeFileSync, unlinkSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';

// Mock loader for external @deepseek-ai/* peer dependencies
const loaderCode = `
export async function resolve(specifier, context, nextResolve) {
  if (specifier === '@deepseek-ai/schemastery') {
    const code = \`
      const chain = () => {
        const obj = (x) => x;
        obj.default = () => obj;
        obj.description = () => obj;
        obj.role = () => obj;
        return obj;
      };
      const z = {
        object: (shape) => ({ shape, ...chain() }),
        string: chain,
        number: chain,
        boolean: chain,
        array: chain,
      };
      export default z;
    \`;
    return {
      url: 'data:text/javascript,' + encodeURIComponent(code),
      format: 'module',
      shortCircuit: true,
    };
  }
  if (specifier === '@deepseek-ai/dsh-tools') {
    const code = 'export function defineTool(x) { return x; }';
    return {
      url: 'data:text/javascript,' + encodeURIComponent(code),
      format: 'module',
      shortCircuit: true,
    };
  }
  return nextResolve(specifier, context);
}
`;

const loaderPath = join(tmpdir(), `test-loader-tt-${Date.now()}.mjs`);
writeFileSync(loaderPath, loaderCode, 'utf8');
register(pathToFileURL(loaderPath));

after(() => {
  try { unlinkSync(loaderPath); } catch {}
});

test('host tools: todo_add, todo_list, todo_done operate on local store', async () => {
  const { apply } = await import('../lib/index.js');
  const dir = mkdtempSync(join(tmpdir(), 'dsh-task-host-'));
  const filePath = join(dir, 'tasks.json');

  try {
    const registeredTools = {};
    const mockCtx = {
      tools: {
        register: (tool) => {
          registeredTools[tool.name] = tool;
        },
      },
      inject: () => {},
    };

    apply(mockCtx, { filePath, legacyDbPath: null });

    assert.ok(registeredTools.todo_add, 'todo_add registered');
    assert.ok(registeredTools.todo_list, 'todo_list registered');
    assert.ok(registeredTools.todo_done, 'todo_done registered');

    // 1. todo_list when empty
    const listEmpty = await registeredTools.todo_list.execute({}, {});
    assert.equal(listEmpty, '(todo пусто)');

    // 2. todo_add
    const addRes = await registeredTools.todo_add.execute({ title: 'Deploy DSH' }, {});
    assert.match(addRes, /✅ Задача создана:/);
    assert.match(addRes, /Deploy DSH/);

    // 3. todo_list has task
    const listAfterAdd = await registeredTools.todo_list.execute({}, {});
    assert.match(listAfterAdd, /⬜ \[.+\] Deploy DSH/);

    // Extract ID
    const matchId = listAfterAdd.match(/\[([^\]]+)\]/);
    assert.ok(matchId);
    const taskId = matchId[1];

    // 4. todo_done
    const doneRes = await registeredTools.todo_done.execute({ id: taskId }, {});
    assert.equal(doneRes, `✅ Задача ${taskId} отмечена выполненной.`);

    // 5. todo_list has completed task
    const listAfterDone = await registeredTools.todo_list.execute({}, {});
    assert.match(listAfterDone, /✅ \[.+\] Deploy DSH/);

    // 6. todo_done with non-existent id
    const doneMissing = await registeredTools.todo_done.execute({ id: 'missing-id' }, {});
    assert.equal(doneMissing, '❌ Задача missing-id не найдена.');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
