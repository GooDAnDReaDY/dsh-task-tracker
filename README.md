# @goodandready/dsh-task-tracker

Built-in todo inbox and task manager for DeepSeek Harness.

- **Storage:** a local `tasks.json` file, written atomically with `node:fs` (`.tmp` + `renameSync`). No extra dependencies.
- **Operator UI:** a full-screen `TasksScreen` over the conversation, a folder shelf with drag-and-drop, task modals, and a jump into an agent chat.
- **Agent integration:** a "Start chat with agent" action that puts the task context into the composer, plus the tools `todo_add`, `todo_list`, and `todo_done`.
- **REST API:** `/dsh-task-tracker/api/tasks[...]`, registered through `ctx.webServer.register`.

## What you can do

1. **Folder shelf.** Folders sit in a fixed strip at the bottom. Each folder has an icon, long names wrap, and a task row can be dropped onto a folder.
2. **Compact list.** A folder shows task titles with a completion mark and a priority. Long lists scroll.
3. **Task modal.** Click a task to edit the title, description, author, folder, and priority (normal / low / medium / high). **Start chat with agent** opens a conversation for that task.
4. **Create.** **+ Create** adds a task. The create form can also create the task and open the chat immediately.
5. **Filters & Refresh.** All / open / done, search over title and description, and a manual Refresh button with real-time reactive sync.
6. **Entry points.** An unfinished-count chip in the session header, a sidebar button, and a back-to-chat control.

## Install

Published on npm:

```sh
npm install @goodandready/dsh-task-tracker
```

Or add it to a DSH profile:

```sh
dsh plugin add @goodandready/dsh-task-tracker
```

## Agent tools

Registered on `ctx.tools`:

- `todo_add` — create a task. `title` is required. Optional: `description`, `priority` (0-3), `folder` (default `Inbox`), `author`.
- `todo_list` — list tasks. Optional: `status` (`pending`, `done`, `all`), `folder`, `limit`.
- `todo_done` — complete a task. `id` is required.

## REST API

Prefix: `/dsh-task-tracker/api`.

- `GET /tasks` — list tasks (`status`, `folder`).
- `POST /tasks` — create `{ title, description, priority, folder, author }`.
- `GET /tasks/stats` — `{ total, pending, done }`.
- `GET /tasks/folders` — folder names (`details=1` returns `{ name, icon, count }`).
- `POST /tasks/folders` — create `{ name, icon }`.
- `PATCH /tasks/folders/:name` — change the icon.
- `DELETE /tasks/folders/:name` — delete the folder; its tasks move to `Inbox`.
- `PATCH /tasks/:id` — update `title`, `description`, `completed`, `priority`, `folder`.
- `DELETE /tasks/:id` — delete a task.

## Settings

In Settings, under the Task Tracker plugin:

- **Custom tasks JSON storage path (`filePath`):** where `tasks.json` lives. Default is the profile directory `task-tracker/tasks.json`.
- The directory and file are created on first use.
- On first start, existing tasks are imported from a previous SQLite database when one is present.

## Locale behavior

The client ships the canonical English catalog for `dsh-task-tracker`. Russian UI strings are provided by the separate `dsh-russian-lang` plugin.

## License

MIT
