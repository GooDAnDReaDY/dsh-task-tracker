// dsh-task-tracker — автономный встроенный todo-инбокс для Ди (Ди + DeepSeek Harness).
//
// Хранилище задач: локальный tasks.json (YAGNI, standard node:fs, атомарная запись).
// Три тула для агента:
//   todo_add   — создать задачу
//   todo_list  — список задач (с опциональным фильтром по статусу)
//   todo_done  — отметить задачу выполненной (status=completed)
//
// REST API для веб-интерфейса регистрируется через ctx.webServer.register.

import Schema from '@deepseek-ai/schemastery';
import { defineTool } from '@deepseek-ai/dsh-tools';
import { TaskStore } from './storage.js';
import { registerRoutes } from './routes.js';
import { registerPluginUpdater } from './updater.js';

export const name = 'dsh-task-tracker';
export const inject = ['tools', 'webServer'];

export const Config = Schema.object({
  /** Путь к файлу tasks.json. Пусто = значение по умолчанию (~/.dsh/task-tracker/tasks.json). */
  filePath: Schema.string().default(''),
});

export function apply(ctx, config = {}) {
  let store = new TaskStore({ filePath: config?.filePath, legacyDbPath: config?.legacyDbPath });

  const render = (_a, v) => [{ type: 'text', text: String(v ?? 'ok') }];

  const register = (name_, params, desc, exec) =>
    ctx.tools.register(defineTool({
      name: name_,
      description: desc,
      parameters: params,
      output: { schema: { type: 'string' }, render },
      async execute(args, execCtx) {
        return await exec(args, execCtx);
      },
    }));

  const setup = () => {
    const disposers = [];

    if (ctx.webServer && typeof ctx.webServer.register === 'function') {
      const unregRoutes = registerRoutes(ctx, store);
      if (typeof unregRoutes === 'function') disposers.push(unregRoutes);
      const unregUpdater = registerPluginUpdater(ctx, {
        endpoint: '/dsh-task-tracker/api/updater',
        packageName: '@goodandready-private/dsh-task-tracker',
        manifestUrl: new URL('../package.json', import.meta.url),
      });
      if (typeof unregUpdater === 'function') disposers.push(unregUpdater);
    }

    if (ctx.tools && typeof ctx.tools.register === 'function') {
      disposers.push(
        register('todo_add',
          {
            title: { type: 'string', required: true, description: 'Заголовок задачи.' },
            description: { type: 'string', description: 'Подробности (несколько строк).' },
            priority: { type: 'integer', description: 'Приоритет (0 default).' },
            folder: { type: 'string', description: 'Папка / область (по умолчанию Inbox).' },
          },
          'Создать задачу в todo-инбоксе трекера. Использовать для инцидентов, кронов, изучения и идей.',
          async (args) => {
            const t = store.create({
              title: args.title,
              description: args.description,
              priority: args.priority,
              folder: args.folder,
            });
            return `✅ Задача создана: ${t.id} — ${t.title}${t.folder ? ` [${t.folder}]` : ''}`;
          }),
        register('todo_list',
          {
            status: { type: 'string', description: 'Фильтр по статусу (например pending, completed). Пусто = все.' },
            folder: { type: 'string', description: 'Фильтр по папке/области (например Inbox). Пусто = все.' },
            limit: { type: 'integer', description: 'Максимум строк (по умолчанию 30).' },
          },
          'Список задач из todo-инбокса (task-tracker).',
          async (args) => {
            const items = store.list({ status: args.status, folder: args.folder, limit: args.limit ?? 30 });
            if (!items || items.length === 0) return '(todo пусто)';
            return items.map((t) =>
              `${t.status === 'completed' ? '✅' : '⬜'} [${t.id}] ${t.title}${t.status !== 'completed' ? ` ${t.status}` : ''}`,
            ).join('\n');
          }),
        register('todo_done',
          { id: { type: 'string', required: true, description: 'id задачи (из todo_list).' } },
          'Отметить задачу в todo-инбоксе выполненной (status=completed).',
          async (args) => {
            const updated = store.update(args.id, { status: 'completed' });
            if (!updated) {
              return `❌ Задача ${args.id} не найдена.`;
            }
            return `✅ Задача ${args.id} отмечена выполненной.`;
          })
      );
    }

    return () => {
      for (const dispose of disposers) {
        if (typeof dispose === 'function') {
          try {
            dispose();
          } catch (_) {
            /* bestEffort */
          }
        }
      }
    };
  };

  if (typeof ctx.effect === 'function') {
    return ctx.effect(setup);
  }
  return setup();
}
