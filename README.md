# @goodandready-private/dsh-task-tracker

Плагин DeepSeek Harness с инструментами todo_add, todo_list и todo_done для
локального task-tracker API.

## Установка

Пакет публикуется в приватный GitHub Packages registry:

```sh
pnpm add @goodandready-private/dsh-task-tracker
```

Плагин host-only: клиентского loader-файла нет. Bundle patch регистрирует
host id dsh-task-tracker с private package name.

Для Basic Auth передайте pass, задайте AUTH_PASS или укажите passFile с
секретом. Пароль не хранится в исходниках, не логируется и не имеет fallback.

Параметр base задаёт URL API, а maxResults не используется этим плагином.

## Changed in v0.1.4

- Lifecycle: wrap locale and slot registrations in `ctx.effect` with cleanups (#7).
- Locale: register only canonical English dictionary; delegate Russian translations to `dsh-russian-lang` (#9).
- Packaging: clean `package.json.files` (remove duplicate `lib/` and untracked `test/`), untrack internal `AGENTS.md` (#8).

## Changed in v0.1.3

- Fix package exports `./client` for dsh.client settings card (boot compatibility).

## Языковое поведение / Locale behavior

- **Клиентская карточка:** регистрирует только канонический английский словарь (`en`) для пространства `dsh-task-tracker`. Встроенный словарь `ru` не поставляется во избежание коллизии `already has locale "ru"` в веб-профиле DSH.
- **Русская локализация:** карточка переводится централизованным плагином `dsh-russian-lang` (`48-task-tracker.json`).
- **Инструменты агента:** описания и параметры инструментов в `lib/index.js` (`todo_add`, `todo_list`, `todo_done`) выполнены на русском языке как целевые системные инструкции для LLM-агента Ди.
