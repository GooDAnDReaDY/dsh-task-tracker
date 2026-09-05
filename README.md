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

## Changed in v0.1.3

- Fix package exports `./client` for dsh.client settings card (boot compatibility).
