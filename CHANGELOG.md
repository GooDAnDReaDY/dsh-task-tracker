# Changelog

## [0.2.8] - 2026-09-25

### Fixed
- **Storage Quarantine on Parse Failure**: `TaskStore.load()` safely quarantines corrupted `tasks.json` files to `${filePath}.corrupt.<timestamp>` instead of treating parse errors as an empty task list. Protects against accidental data wiping and refuses mutations via `StorageCorruptedError`. Added safe recovery via `POST /dsh-task-tracker/api/tasks/reset` (#54).
- **Host Lifecycle Resource Ownership**: host tools (`todo_add`, `todo_list`, `todo_done`), route registrations, and updater registrations in `lib/index.js` are now strictly bound inside `ctx.effect(...)` with cleanup disposers, preventing resource leaks on reload (#55).
- **Drop Removed Settings Service**: removed obsolete `settings` service from `inject` and `apply` in `lib/index.js`, fixing Cordis proxy accessor crashes during boot in DSH 0.1.7+ (#56).

### Documentation & Security
- **Runtime Language Contracts**: documented language architecture in `docs/design/DESIGN.md`: canonical English (`en`) and Chinese (`zh`) client dictionaries with zero bundled Russian to avoid runtime collisions with `dsh-russian-lang`; Russian tool descriptions preserved for agent prompt fidelity (#9).
- **Git Remote Credential Sanitization**: rotated and removed embedded userinfo tokens from `.git/config` and repository configurations (#53).

## [0.2.7] - 2026-09-24

### Security
- **Request Authorization (Fail-Closed)**: `isAllowedRequest` отклоняет мутирующие запросы (POST, PATCH, DELETE, PUT) без заголовков `Origin` и `Sec-Fetch-Site` со статусом 403 Forbidden, если соединение не является локальным (loopback) (#43).
- **Host Environment Sanitization**: удален захардкоженный fallback-путь `/mnt/external/...` в `lib/storage.js`; значение по умолчанию для `legacyDbPath` изменено на `null`. Расширен `test/identity.test.mjs` для проверки всех файлов `lib/*.js` (#41, #47).

### Fixed
- **Safe Task ID Decoding**: добавлена безопасная обработка URI-кодированных идентификаторов задач (`safeDecode`) в маршрутах GET, PATCH и DELETE. Некорректно закодированные последовательности URL возвращают 400 Bad Request вместо неперехваченного исключения 500 (#40).
- **Reactive TasksScreen Refresh**: `TasksScreen` подписан на открытие панели — задачи загружаются актуальными сразу при открытии (#37).
- **Manual Refresh Button**: добавлена кнопка «Refresh» в шапку экрана задач со спиннером и поддержкой локализации (EN/ZH) (#37).
- **Realtime Component Sync**: внедрено событие `dsh-task-tracker:data-changed` — изменения задач в `TasksScreen` мгновенно обновляют счетчик в `TaskChip` без ожидания 10-секундного таймера поллинга (#37).

### Performance
- **DOM MutationObserver Optimization**: наблюдатели мутаций в `mountTasksScreen` и `mountSidebarEntry` отключаются сразу после успешного монтажа элементов, устраняя холостую нагрузку на CPU при стриминге токенов модели (#38).
- **Storage mtime Caching**: оптимизирован метод `load()` и `ensureFresh()` в `TaskStore` — кэширование `lastMtime` корректно работает даже при 0 задач, устраняя повторное чтение и парсинг с диска при регулярном поллинге статистики (#39).

### Refactoring & Tech Debt
- **Clean Config Schema**: удалены устаревшие неиспользуемые поля `base`, `user`, `pass`, `passFile` из схемы `Config`. Устранены избыточные ветки `ctx.inject` в `apply()`, опираясь на явный экспорт `inject` (#42).
- **GitHub Mirror Workflow**: подтвержден канонический скрипт санитизированной публикации в GitHub-зеркало `scripts/publish-github.sh` (#35).

All notable changes to `@goodandready-private/dsh-task-tracker` will be documented in this file.

## 0.2.6

### Fixed
- Settings no longer wait on the removed settingsScope service. The client uses configForms (#44).

## [0.2.5] - 2026-09-19

### Fixed
- **Settings reachable again on the plugin's own page**: the current DSH core
  (0.1.6-alpha.2) renders a plugin's configuration page only for entries registered
  in the plugin-list seat `plugins.item`. That seat takes an `id` and a static label
  instead of a `key`, so it is mounted separately from the keyed helper; the row seat
  and the legacy card stay as fallbacks. Both lifecycle tests now expect four slot
  injections.

## [0.2.4] - 2026-09-19

### Fixed
- **Настройки снова доступны**: карточка регистрировалась в `settings.plugin.item` —
  слот, который текущее ядро DSH (0.1.6-alpha.2) **не рендерит**, поэтому настройки
  были недостижимы. Теперь поверхность регистрируется первой в посадке строки на
  странице «Плагины» — `plugins.row.config` с ключом
  `@goodandready-private/dsh-task-tracker#dsh-task-tracker`: у строки плагина
  появляется контрол «настроить», чья страница — форма настроек (`view: 'page'`,
  раскрытая и без нашей карточки и шапки), плюс однострочник для
  `view: 'summary'`. Прежняя посадка `settings.plugin.item` сохранена фолбэком.
- Тесты жизненного цикла обновлены под две посадки (строка + легаси-карточка) и
  проверяют ключ строки.

## [0.2.3] - 2026-09-19

### Fixed
- **Updater CLI discovery infinite loop**: исправлен критический баг в findDshCliEntry (lib/updater.js) — добавлен переход directory = parent, предотвращающий бесконечный цикл поиска package.json и 100% загрузку CPU при вызове /dsh-task-tracker/api/updater (#31).
- **Unit test**: добавлен юнит-тест гарантированного быстрого завершения findDshCliEntry при отсутствии package.json в родительских каталогах.

## [0.2.2] - 2026-09-18

### Added
- **Quick-add bar and Prominent Add Task buttons**: добавлен ряд быстрого создания задач (Enter для добавления) и заметные кнопки «+ Add Task» в шапке и в пустом состоянии папки (#31).
- **Auto-updater**: встроен автоматический серверный апдейтер плагина lib/updater.js с поддержкой токенов GitHub Packages из ~/.npmrc и секция обновления в карточке настроек плагина (/dsh-task-tracker/api/updater) (#31).
- **Bilingual dictionaries (EN & ZH)**: полные канонические словари English (en) и Chinese (zh), регистрация в ctx.locale.register и нулевое содержание захардкоженного русского текста в коде клиента (#31).

### Fixed
- **Inbox tasks visibility**: исправлена фильтрация задач в папке Inbox — задачи с дефолтной или пустой папкой корректно сопоставляются с Inbox, счетчики папок синхронизированы (#31).

## [0.2.0] - 2026-09-18

### Added
- **CI / Gitea Actions**: добавлен `.gitea/workflows/ci.yml` с автоматическим запуском проверки синтаксиса (`node --check`) и набора тестов (`npm test`) на push и PR (#28).

### Changed
- **Client Diagnostics & Effects Language**: диагностические метки `ctx.effect` в `lib/client.js` переведены на канонический английский язык клиента (`'dsh-task-tracker: locale dictionaries'`, `'settings card'`) в соответствии с `DESIGN.md` (#27).

- **Нижняя полка папок (Bottom Folder Shelf)**: фиксированные плашки папок (`140px`, значок + название с переносом до 2 строк, счетчик задач), перенос строк в 2 ряда при увеличении числа папок (#25).
- **Смена значка папки**: встроенный поповер с палитрой эмодзи для быстрой персонализации иконок папок (#25).
- **Drag & Drop задач в папки**: перетаскивание строк задач из списка на любую плашку папки внизу для мгновенного перемещения (#25).
- **Компактный список задач в папке**: отображение только заголовков задач с чекбоксом выполнения и меткой приоритета (#25).
- **Вертикальная прокрутка**: плавная полоса прокрутки списка задач при превышении высоты области просмотра (#25).
- **Модальное окно задачи (Task Detail Modal)**: просмотр и редактирование заголовка, многострочного описания, автора, даты и времени создания (`createdAt`), папки и приоритета (#25).
- **Интеграция с агентом («Начать чат с агентом»)**: запуск нового сеанса чата с автоматической вставкой структурированного контекста задачи (заголовок, папка, приоритет, описание) в поле ввода как из модалки создания, так и из модалки просмотра любой задачи (#25).
- **Верхняя панель фильтрации**: быстрые фильтры «Все» / «Не завершенные» / «Завершенные» в шапке экрана (#25).
- **Расширенное API папок**: поддержка метаданных папок (`{ name, icon }`), эндпоинты `PATCH /tasks/folders/:name` и `DELETE /tasks/folders/:name`.
- **Выделенный CHANGELOG.md**: история версий вынесена из `README.md` в соответствии со стандартом документации (#24).

## [0.1.9] - 2026-09-18

### Changed
- **Settings Architecture**: удален избыточный отложенный фолбэк `settings.section` в корень настроек; оставлена единственная каноническая точка входа — карточка `settings.plugin.item` в «Settings → Плагины» в соответствии со стандартом семейства плагинов DSH (#22).
- **Diagnostics**: добавлена явная обработка ошибок и предупреждающее логирование при регистрации карточки настроек (#22).
- **Tests**: добавлены тесты-стражи, гарантирующие отсутствие внедрения `settings.section` (#22).

## [0.1.8] - 2026-09-18

### Added
- **Folder Swimlanes & Drag & Drop**: добавлена поддержка организации задач по папкам/горизонтальным областям (`folders`) с drag & drop переносом между ними (#20).
- **Navigation & Return to Chat**: добавлена стандартная кнопка возврата в чат («To the chat») в шапке экрана `TasksScreen` с иконкой и плавной анимацией возврата (#20).
- **Task Creation & Reliability**: переработана панель создания задач (замена `<form>` на `div.tt-create-bar` с селектором целевой папки, явным выбором приоритета и обработчиком клика), добавлено видимое отображение ошибок валидации и сети (#20).
- **Storage & API**: схема `tasks.json` обновлена до формата v2 с поддержкой списка `folders`, автомиграцией v1, и новыми эндпоинтами `GET /folders`, `POST /folders`, фильтрацией `GET /tasks?folder=...` (#20).
- **Agent Tools**: инструмент `todo_add` расширен опциональным параметром `folder`, `todo_list` поддерживает фильтрацию по папкам (#20).

## [0.1.7] - 2026-09-18

### Changed
- **Packaging**: сделан надежный разбор `npm pack --json` в тестах под npm 12/10/11 (#15).
- **Diagnostics & Error Handling**: устранены пустые `catch` в `lib/client.js`, добавлено логирование сбоя поллинга статистики и явная пометка намерений `/* bestEffort: cleanup */` (#16).
- **Theming & Contrast**: шесть хардкод-цветов переведены на дизайн-токены ядра (`--dsw-alias-*`) и `color-mix()` для адаптации к темной и светлой темам, добавлен тест-страж `test/theme.test.mjs` (#17).
- **Refactoring & Settings**: удален неиспользуемый `getConfig()`, поля внешнего сервиса помечены `@deprecated`, карточка настроек приведена в соответствие с локальным хранилищем, актуализировано описание инструмента `todo_add` (#18).

## [0.1.6] - 2026-09-18

### Added
- **Host Service Inject**: добавлены `webServer` и `settings` в явный список зависимостей плагина (`inject`) для надежной регистрации API-маршрутов (#13).

## [0.1.5] - 2026-09-18

### Added
- **Standalone Architecture (Вариант Б)**: перенос таск-трекера полностью внутрь DSH без внешнего Go-микросервиса и порта 8182 (#13).
- **Storage**: легковесное хранилище `tasks.json` с атомарной записью (`node:fs`) и автоматическим импортом прежних задач из SQLite при первом старте.
- **UI**: полноэкранный экран управления задачами `TasksScreen` с фильтрами, поиском, инлайн-созданием и управлением статусами.
- **Navigation**: кнопка со счетчиком задач в шапке сессии (`conversation.session.header.utilities`) и кнопка в боковой панели.
- **REST API**: эндпоинты `/dsh-task-tracker/api/tasks` (GET, POST, PATCH, DELETE, stats).

## [0.1.4] - 2026-09-18

### Changed
- **Lifecycle**: регистрация локалей и слотов обернута в `ctx.effect` с функциями очистки (#7).
- **Locale**: регистрация только канонического английского словаря; русская локализация делегирована в `dsh-russian-lang` (#9).
- **Packaging**: очищен `package.json.files` (удалены дубликат `lib/` и неотслеживаемый `test/`), исключен внутренний `AGENTS.md` (#8).
