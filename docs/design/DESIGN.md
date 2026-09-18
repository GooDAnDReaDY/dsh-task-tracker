# DESIGN.md — dsh-task-tracker

## Product / Purpose
- Назначение: todo-инбокс для агента (todo_add / todo_list / todo_done) против локального task-tracker API.
- Аудитория: оператор и агент DeepSeek Harness.
- Статус: active (DEV restored).

## User Surfaces
- Web/UI: карточка `settings.plugin.item` (NS `dsh-task-tracker`) — base / user / pass / passFile.
- DSH tools: `todo_add`, `todo_list`, `todo_done`.
- Документация: README.md.

## Visual Direction
- Нативный вид карточек ядра DSH; префикс классов `tt-`.
- Свёрнута по умолчанию; шеврон ядровый/fallback.

## Components And States
- Snapshot: `loading` / `unavailable` / `ready`.
- `pass` — Schema `.role('secret')`: поле пароля всегда пустое при чтении; новое значение пишется только если введено.
- Браузер не отображает и не запрашивает сохранённый секрет обратно.

## User Flows
1. Настройки → Плагины → Task Tracker.
2. Задать base/user; при необходимости ввести новый pass или passFile → Save.
3. Tools читают live-конфиг.

## Locale and Languages
- Канонический язык карточки: только английский (`en`). Плагин не регистрирует встроенный `ru`, предотвращая сбой дублирующей регистрации (`already has locale "ru"`).
- Русская локализация карточки поставляется внешним системным плагином `dsh-russian-lang` (словарь `48-task-tracker.json`).
- Язык инструментов: описания и подсказки `todo_add`, `todo_list`, `todo_done` в `lib/index.js` ведутся на русском языке для максимальной точности работы LLM-модели Ди.

## Locked Design Decisions
- 2026-09-05: карточка `settings.plugin.item`, NS = `dsh-task-tracker`.
- 2026-09-05: секрет через `.role('secret')`, без echo в UI.
- 2026-09-18: регистрация только словаря `en` в `lib/client.js`; русская локализация делегирована `dsh-russian-lang` (предотвращение аварии `already has locale "ru"`).
- 2026-09-18: русскоязычные описания инструментов в `lib/index.js` зафиксированы как рабочий язык промптов для модели агента.
