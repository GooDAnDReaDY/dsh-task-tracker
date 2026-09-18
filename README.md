# @goodandready-private/dsh-task-tracker

Автономный встроенный Todo-инбокс для Ди (Ди + DeepSeek Harness):
- **Хранилище:** локальное JSON-хранилище `tasks.json` со стандартной библиотекой `node:fs` и атомарной записью (`.tmp` + `renameSync`), zero external dependencies (Вариант Б).
- **Инструменты агента:** `todo_add`, `todo_list`, `todo_done` работают напрямую с локальным хранилищем без необходимости внешних микросервисов, Basic Auth или сетевых портов.
- **Интерфейс оператора:** полноэкранный рабочий экран `TasksScreen` в центральной колонке поверх чата, кнопка-чип в шапке сессии (`conversation.session.header.utilities`) с индикатором активных задач и пункт в боковой панели.
- **REST API:** эндпоинты `/dsh-task-tracker/api/tasks[...]` на базе `ctx.webServer.register`.

## Установка

Пакет публикуется в приватный GitHub Packages registry:

```sh
pnpm add @goodandready-private/dsh-task-tracker
```

## Changed in v0.1.9

- Settings Architecture: удален избыточный отложенный фолбэк `settings.section` в корень настроек; оставлена единственная каноническая точка входа — карточка `settings.plugin.item` в «Settings → Плагины» в соответствии со стандартом семейства плагинов DSH (#22).
- Diagnostics: добавлена явная обработка ошибок и предупреждающее логирование при регистрации карточки настроек (#22).
- Tests: добавлены тесты-стражи, гарантирующие отсутствие внедрения `settings.section` (#22).

## Changed in v0.1.8

- Folder Swimlanes & Drag & Drop: добавлена поддержка организации задач по папкам/горизонтальным областям (`folders`) с drag & drop переносом между ними (#20).
- Navigation & Return to Chat: добавлена стандартная кнопка возврата в чат («To the chat») в шапке экрана `TasksScreen` с иконкой и плавной анимацией возврата (#20).
- Task Creation & Reliability: переработана панель создания задач (замена `<form>` на `div.tt-create-bar` с селектором целевой папки, явным выбором приоритета и обработчиком клика), добавлено видимое отображение ошибок валидации и сети (#20).
- Storage & API: схема `tasks.json` обновлена до формата v2 с поддержкой списка `folders`, автомиграцией v1, и новыми эндпоинтами `GET /folders`, `POST /folders`, фильтрацией `GET /tasks?folder=...` (#20).
- Agent Tools: инструмент `todo_add` расширен опциональным параметром `folder`, `todo_list` поддерживает фильтрацию по папкам (#20).

## Changed in v0.1.7

- Packaging: сделан надежный разбор `npm pack --json` в тестах под npm 12/10/11 (#15).
- Diagnostics & Error Handling: устранены пустые `catch` в `lib/client.js`, добавлено логирование сбоя поллинга статистики и явная пометка намерений `/* bestEffort: cleanup */` (#16).
- Theming & Contrast: шесть хардкод-цветов переведены на дизайн-токены ядра (`--dsw-alias-*`) и `color-mix()` для адаптации к темной и светлой темам, добавлен тест-страж `test/theme.test.mjs` (#17).
- Refactoring & Settings: удален неиспользуемый `getConfig()`, поля внешнего сервиса помечены `@deprecated`, карточка настроек приведена в соответствие с локальным хранилищем, актуализировано описание инструмента `todo_add` (#18).

## Changed in v0.1.6

- Host Service Inject: добавлены `webServer` и `settings` в явный список зависимостей плагина (`inject`) для надежной регистрации API-маршрутов (#13).

## Changed in v0.1.5

- Standalone Architecture (Вариант Б): перенос таск-трекера полностью внутрь DSH без внешнего Go-микросервиса и порта 8182 (#13).
- Storage: легковесное хранилище `tasks.json` с атомарной записью (`node:fs`) и автоматическим импортом прежних задач из SQLite при первом старте.
- UI: полноэкранный экран управления задачами `TasksScreen` с фильтрами, поиском, инлайн-созданием и управлением статусами.
- Navigation: кнопка со счетчиком задач в шапке сессии (`conversation.session.header.utilities`) и кнопка в боковой панели.
- REST API: эндпоинты `/dsh-task-tracker/api/tasks` (GET, POST, PATCH, DELETE, stats).

## Changed in v0.1.4

- Lifecycle: wrap locale and slot registrations in `ctx.effect` with cleanups (#7).
- Locale: register only canonical English dictionary; delegate Russian translations to `dsh-russian-lang` (#9).
- Packaging: clean `package.json.files` (remove duplicate `lib/` and untracked `test/`), untrack internal `AGENTS.md` (#8).

## Языковое поведение / Locale behavior

- **Клиентский интерфейс:** регистрирует только канонический английский словарь (`en`) для пространства `dsh-task-tracker`. Встроенный словарь `ru` не поставляется во избежание коллизии `already has locale "ru"` в веб-профиле DSH.
- **Русская локализация:** интерфейс переводится централизованным плагином `dsh-russian-lang`.
- **Инструменты агента:** описания и параметры инструментов в `lib/index.js` (`todo_add`, `todo_list`, `todo_done`) выполнены на русском языке как целевые системные инструкции для LLM-агента Ди.
