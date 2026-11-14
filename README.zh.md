# @goodandready/dsh-task-tracker

DeepSeek Harness 内置的待办收件箱和任务管理器。

- **存储：** 本地 `tasks.json`，用 `node:fs` 原子写入（`.tmp` + `renameSync`），没有额外依赖。
- **界面：** 盖在对话上的全屏 `TasksScreen`、可拖放的文件夹条、任务详情，以及跳进代理对话。
- **代理：** 「与代理开始对话」会把任务上下文放进输入框。工具为 `todo_add`、`todo_list`、`todo_done`。
- **REST API：** `/dsh-task-tracker/api/tasks[...]`，通过 `ctx.webServer.register` 注册。

## 能做什么

1. **文件夹条。** 文件夹固定在底部，可以改图标；把任务行拖到文件夹上即可归类。
2. **紧凑列表。** 文件夹里只显示标题、完成状态和优先级，列表过长时滚动。
3. **任务详情。** 点击任务可编辑标题、描述、作者、文件夹和优先级（普通 / 低 / 中 / 高）。**与代理开始对话**会为这个任务打开对话。
4. **新建。** **+ 新建**添加任务，也可以新建后立刻打开对话。
5. **筛选与刷新。** 全部 / 未完成 / 已完成，支持按标题和描述搜索，提供手动刷新按钮与任务实时同步。
6. **入口。** 会话顶栏的未完成计数、侧栏按钮，以及返回对话。

## 安装

包已发布到 npm：

```sh
npm install @goodandready/dsh-task-tracker
```

或添加到 DSH 配置文件：

```sh
dsh plugin add @goodandready/dsh-task-tracker
```

## 代理工具

注册在 `ctx.tools`：

- `todo_add`：新建任务。`title` 必填。可选 `description`、`priority`（0-3）、`folder`（默认 `Inbox`）、`author`。
- `todo_list`：列出任务。可选 `status`（`pending`、`done`、`all`）、`folder`、`limit`。
- `todo_done`：按 `id` 完成任务。

## REST API

前缀：`/dsh-task-tracker/api`。

- `GET /tasks`：列出任务（`status`、`folder`）。
- `POST /tasks`：创建 `{ title, description, priority, folder, author }`。
- `GET /tasks/stats`：`{ total, pending, done }`。
- `GET /tasks/folders`：文件夹名称（`details=1` 返回 `{ name, icon, count }`）。
- `POST /tasks/folders`：创建 `{ name, icon }`。
- `PATCH /tasks/folders/:name`：修改图标。
- `DELETE /tasks/folders/:name`：删除文件夹，其中的任务移到 `Inbox`。
- `PATCH /tasks/:id`：更新 `title`、`description`、`completed`、`priority`、`folder`。
- `DELETE /tasks/:id`：删除任务。

## 设置

在 Task Tracker 插件设置中：

- **自定义任务 JSON 路径（`filePath`）：** `tasks.json` 的位置。默认在配置档目录的 `task-tracker/tasks.json`。
- 首次使用时创建目录和文件。
- 首次启动时，如果存在旧的 SQLite 数据库，会导入其中的任务。

## 语言

客户端只附带 `dsh-task-tracker` 的英文目录。俄文界面由单独的 `dsh-russian-lang` 插件提供。

## 许可证

MIT
