// dsh-task-tracker — todo-инбокс для Ди (Ди + DeepSeek Harness).
//
// Три тула против локального task-tracker (todo.goodandready.app):
//   todo_add   — POST  /api/tasks                (создать задачу)
//   todo_list  — GET   /api/tasks                (список; ?status= фильтр)
//   todo_done  — PATCH /api/tasks/{id} status=completed
//
// Это трекер-инбокс: инциденты / кроны / изучение / идеи ведутся здесь,
// а не в task-board DSH (тот трекером не является).
//
// Авторизация — HTTP Basic (admin / AUTH_PASS). Креды читаются на сервере из
// исходника task-tracker (main.go defaults) либо из env AUTH_PASS; плагин
// берёт их из конфига/окружения, значения не логирует.
import { readFileSync } from 'node:fs';
import Schema from '@deepseek-ai/schemastery';
import { defineTool } from '@deepseek-ai/dsh-tools';

export const name = 'dsh-task-tracker';
export const inject = ['tools'];

export const Config = Schema.object({
  /** Base URL of the task-tracker API (without trailing slash). */
  base: Schema.string().default('http://127.0.0.1:8182'),
  /** Basic auth username. */
  user: Schema.string().default('admin'),
  /** Basic auth password; empty = fall back to env AUTH_PASS. */
  pass: Schema.string().role('secret').default(''),
  /** Password file (optional; read if set and `pass` is empty). */
  passFile: Schema.string().default(''),
});

function resolvePass(config) {
  if (config.pass) return config.pass;
  if (process.env.AUTH_PASS) return process.env.AUTH_PASS;
  if (config.passFile) {
    try {
      const v = readFileSync(config.passFile, 'utf8').trim();
      if (v) return v;
    } catch {
      /* fall through */
    }
  }
  return '020291'; // task-tracker main.go default when AUTH_PASS unset
}

export function apply(ctx, config = {}) {
  const cfg = Config(config) ?? {};
  const base = (cfg.base ?? 'http://127.0.0.1:8182').replace(/\/$/, '');
  const user = cfg.user ?? 'admin';
  const pass = resolvePass(cfg);

  async function api(method, url, body) {
    const res = await fetch(`${base}${url}`, {
      method,
      headers: {
        Authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`,
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`task-tracker ${method} ${url}: HTTP ${res.status} ${String(text).slice(0, 200)}`);
    }
    if (res.status === 204) return undefined;
    return res.json();
  }

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

  register('todo_add',
    {
      title: { type: 'string', required: true, description: 'Заголовок задачи.' },
      description: { type: 'string', description: 'Подробности (несколько строк).' },
      priority: { type: 'integer', description: 'Приоритет (0 default).' },
    },
    'Создать задачу в todo-инбоксе (task-tracker / todo.goodandready.app). Использовать для инцидентов, кронов, изучения и идей.',
    async (args) => {
      const body = {
        title: args.title,
        ...(args.description !== undefined ? { description: args.description } : {}),
        ...(args.priority !== undefined ? { priority: args.priority } : {}),
      };
      const t = await api('POST', '/api/tasks', body);
      return `✅ Задача создана: ${t.id} — ${t.title} (https://todo.goodandready.app)`;
    });

  register('todo_list',
    {
      status: { type: 'string', description: 'Фильтр по статусу (например pending, completed). Пусто = все.' },
      limit: { type: 'integer', description: 'Максимум строк (по умолчанию 30).' },
    },
    'Список задач из todo-инбокса (task-tracker).',
    async (args) => {
      const qs = new URLSearchParams();
      if (args.status) qs.set('status', args.status);
      const items = await api('GET', `/api/tasks${qs.toString() ? `?${qs}` : ''}`);
      const arr = Array.isArray(items) ? items : [];
      const n = Math.min(args.limit ?? 30, 100);
      if (arr.length === 0) return '(todo пусто)';
      return arr.slice(0, n).map((t) =>
        `${t.status === 'completed' ? '✅' : '⬜'} [${t.id}] ${t.title}${t.status !== 'completed' ? ` ${t.status}` : ''}`,
      ).join('\n') || '(todo пусто)';
    });

  register('todo_done',
    { id: { type: 'string', required: true, description: 'id задачи (из todo_list).' } },
    'Отметить задачу в todo-инбоксе выполненной (status=completed).',
    async (args) => {
      await api('PATCH', `/api/tasks/${encodeURIComponent(args.id)}`, { status: 'completed' });
      return `✅ Задача ${args.id} отмечена выполненной.`;
    });
}
