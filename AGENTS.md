# AGENTS.md

Дополняет корневой `/mnt/external/Project/DEV/AGENTS.md`.

## Product / Purpose
- Проект: `dsh-task-tracker`
- DEV: `/mnt/external/Project/DEV/dhsplugins/dsh-task-tracker`
- Package: `@goodandready-private/dsh-task-tracker` (исторический private scope)
- Назначение: DSH-плагин todo-инбокса

## Package policy
- До явного «публикуем» — без npm publish.
- Patch bump для обычных фиксов.

## Essential Files
- `lib/index.js` — host
- `lib/client.js` — browser card
- `cordis.patch.yml`
- `docs/design/DESIGN.md`
