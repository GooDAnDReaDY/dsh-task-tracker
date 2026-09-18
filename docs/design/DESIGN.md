# DESIGN.md — dsh-task-tracker

## Product / Purpose
- Назначение: автономный встроенный todo-инбокс для агента (todo_add / todo_list / todo_done) и оператора DeepSeek Harness без привязки к внешним сервисам.
- Аудитория: оператор и агент DeepSeek Harness.
- Статус: active (Вариант Б — standalone DSH plugin).

## Architecture & Storage (Вариант Б)
- Хранилище: локальный файл `tasks.json` (по умолчанию `~/.dsh/task-tracker/tasks.json`, настраивается через конфиг или `DSH_TASK_TRACKER_FILE`).
- Атомарная запись: стандартный модуль `node:fs` (`.tmp` + `renameSync`), zero external dependencies, без тяжелых сторонних СУБД (YAGNI/ponytail).
- Автомиграция: при первом старте, если `tasks.json` отсутствует, плагин автоматически импортирует существующие задачи из прежней SQLite базы (`/mnt/external/Project/DEV/task-tracker/data/tasks.db` / `DSH_TASK_TRACKER_LEGACY_DB`), сохраняя всю историю.
- Модель задачи:
  - `id`: строковый идентификатор (base36 timestamp + random).
  - `title`: заголовок задачи (обязательный, непустой).
  - `description`: подробное описание / контекст.
  - `priority`: приоритет (0 = Normal, 1 = Low, 2 = Medium, 3 = High).
  - `status`: `'pending'` | `'completed'`.
  - `createdAt`, `updatedAt`: ISO 8601 временные метки.
  - `completedAt`: ISO 8601 временная метка завершения или `null`.

## User Surfaces
- **Web UI:**
  - Полноэкранный рабочий экран поверх чата (`TasksScreen`): фильтры (All, Active, Done), быстрый поиск, список с чекбоксами, теги приоритета, удаление, инлайн-форма создания задачи.
  - Кнопка-чип в шапке сессии (`conversation.session.header.utilities`) со значком задач и бейджем количества активных задач.
  - Пункт в боковой панели (`tt-sidebar-entry`), клонируемый рядом с кнопкой новой сессии.
  - Карточка настроек плагина `settings.plugin.item` (NS `dsh-task-tracker`).
- **DSH tools:** `todo_add`, `todo_list`, `todo_done` — напрямую обращаются к локальному `TaskStore`.
- **Внутренний REST API:** `ctx.webServer.register` обслуживает `/dsh-task-tracker/api/tasks[...]`.
- **Документация:** README.md.

## Visual Direction
- Нативный вид компонентов ядра DSH (`data-dsh-plugin="dsh-task-tracker"`), переменные темы `--dsw-alias-*`.
- Префикс CSS классов: `tt-`.
- Иконка задачи: инлайн SVG (галочка в квадрате / чеклист).
- Координация панелей через `dsh:active-panel`, закрытие по Esc и кнопке `✕`.

## Locale and Languages
- Канонический язык клиентской части: английский (`en`) в `lib/client.js`.
- Русская локализация клиентского интерфейса делегирована внешнему системному плагину `dsh-russian-lang` (предотвращение аварии `already has locale "ru"`).
- Язык инструментов агента: описания и подсказки `todo_add`, `todo_list`, `todo_done` в `lib/index.js` ведутся на русском языке для максимальной точности работы LLM-модели Ди.

## Locked Design Decisions
- 2026-09-05: карточка `settings.plugin.item`, NS = `dsh-task-tracker`.
- 2026-09-05: секрет через `.role('secret')`, без echo в UI.
- 2026-09-18: регистрация только словаря `en` в `lib/client.js`; русская локализация делегирована `dsh-russian-lang` (предотвращение аварии `already has locale "ru"`).
- 2026-09-18: русскоязычные описания инструментов в `lib/index.js` зафиксированы как рабочий язык промптов для модели агента.
- 2026-09-18: Автономный встроенный трекер (Вариант Б): перенос хранилища в `tasks.json` со стандартной библиотекой `node:fs` и атомарной записью; устранение зависимости от внешнего Go-микросервиса и порта 8182.
- 2026-09-18: Полноэкранный интерфейс `TasksScreen` в центральной колонке поверх чата, кнопка в шапке `conversation.session.header.utilities` с бейджем активных задач и пункт в боковой панели.
- 2026-09-18: диагностические метки `ctx.effect` в `lib/client.js` ведутся на английском языке (`'dsh-task-tracker: locale dictionaries'`, `'settings card'`, `'chip'`, `'overlay'`) в соответствии с каноническим языком клиента.
