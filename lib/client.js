window.__ModuleLoader__.load({
  id: '@goodandready-private/dsh-task-tracker',
  factory: (require) => {
    var module = { exports: {} }
    const React = require('react')
    const NS = 'dsh-task-tracker'

    let ChevronIcon = null
    try {
      const primitives = require('@deepseek-ai/dsh-client-ui-primitives')
      ChevronIcon = primitives && primitives.IconChevronDownOutline14
    } catch (_) {
      ChevronIcon = null
    }

    function FallbackChevron(props) {
      return React.createElement(
        'svg',
        {
          width: 14,
          height: 14,
          viewBox: '0 0 14 14',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          className: props.className,
          style: props.style,
        },
        React.createElement('path', { d: 'M3.5 5.25L7 8.75L10.5 5.25' }),
      )
    }
    const Chevron = ChevronIcon || FallbackChevron

    const CSS =
      '.tt-card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:12px;list-style:none}' +
      '.tt-head{appearance:none;width:100%;font:inherit;color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;border-radius:12px;display:flex;align-items:center;gap:12px;padding:14px 16px}' +
      '.tt-title{color:var(--dsw-alias-label-primary);font-size:15px;font-weight:600;line-height:1.4}' +
      '.tt-sub{color:var(--dsw-alias-label-secondary);font-size:13px}' +
      '.tt-body{border-top:1px solid var(--dsw-alias-border-l2);margin:0 16px;padding-bottom:8px}' +
      '.tt-field{display:flex;flex-direction:column;gap:6px;padding:12px 0}' +
      '.tt-input{height:34px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);border-radius:8px;padding:0 12px;font-size:13px}' +
      '.tt-foot{border-top:1px solid var(--dsw-alias-border-l2);display:flex;justify-content:flex-end;align-items:center;gap:8px;padding:12px 0 4px}' +
      '.tt-save{appearance:none;font:inherit;cursor:pointer;border:1px solid transparent;border-radius:8px;padding:5px 14px;font-size:13px;background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-layer-3)}' +
      '.tt-save:disabled{opacity:.6;cursor:not-allowed}' +
      '.tt-chev{margin-left:auto;flex:none;color:var(--dsw-alias-label-tertiary);transition:transform .16s}' +
      '.tt-chev-open{transform:rotate(180deg)}'

    function PluginCard(props) {
      const ctx = props.ctx
      const [expanded, setExpanded] = React.useState(false)
      const [snap, setSnap] = React.useState({ status: 'loading', value: null, writable: false })
      const [draft, setDraft] = React.useState({ base: '', user: '', pass: '', passFile: '' })
      const [saving, setSaving] = React.useState(false)
      const [msg, setMsg] = React.useState('')
      const initializedRef = React.useRef(false)

      React.useEffect(() => {
        let off = null
        try {
          const scope = ctx.settingsScope && ctx.settingsScope.bind
            ? ctx.settingsScope.bind({ namespace: NS })
            : null
          if (!scope) {
            setSnap({ status: 'unavailable', value: null, writable: true })
            return
          }
          const update = () => {
            const s = scope.getSnapshot
              ? scope.getSnapshot()
              : { status: 'unavailable', value: null }
            setSnap(s)
            if (s.status === 'ready' && s.value && !initializedRef.current) {
              initializedRef.current = true
              const v = s.value
              // Never echo secret pass back into the form.
              setDraft({
                base: v.base ?? 'http://127.0.0.1:8182',
                user: v.user ?? 'admin',
                pass: '',
                passFile: v.passFile ?? '',
              })
            }
          }
          update()
          if (scope.subscribe) off = scope.subscribe(update)
        } catch (_) {
          setSnap({ status: 'unavailable', value: null, writable: true })
        }
        return () => {
          try {
            off && off()
          } catch (_) {}
        }
      }, [ctx])

      const t = (() => {
        try {
          return ctx.locale && ctx.locale.bind ? ctx.locale.bind(NS) : (k) => k
        } catch (_) {
          return (k) => k
        }
      })()

      const onSave = async () => {
        setSaving(true)
        setMsg('')
        try {
          if (!ctx.settingsScope || !ctx.settingsScope.bind) {
            setMsg(t('unavailable'))
            setSaving(false)
            return
          }
          const scope = ctx.settingsScope.bind({ namespace: NS })
          const errs = []
          for (const key of ['base', 'user', 'passFile']) {
            try {
              await scope.set(key, draft[key] ?? '')
            } catch (e) {
              errs.push(key + ': ' + (e && e.message ? e.message : String(e)))
            }
          }
          // Write pass only when the operator typed a new value.
          if (draft.pass) {
            try {
              await scope.set('pass', draft.pass)
            } catch (e) {
              errs.push('pass: ' + (e && e.message ? e.message : String(e)))
            }
          }
          if (!errs.length) {
            setDraft((d) => ({ ...d, pass: '' }))
          }
          setMsg(errs.length ? errs.join('; ') : t('saved'))
        } catch (e) {
          setMsg(String(e && e.message ? e.message : e))
        }
        setSaving(false)
      }

      return React.createElement(
        'div',
        { className: 'tt-card' },
        React.createElement('style', null, CSS),
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'tt-head',
            onClick: () => setExpanded(!expanded),
            'aria-expanded': expanded,
          },
          React.createElement('span', { className: 'tt-title' }, t('title')),
          React.createElement('span', { className: 'tt-sub' }, t('subtitle')),
          React.createElement(Chevron, {
            className: 'tt-chev' + (expanded ? ' tt-chev-open' : ''),
          }),
        ),
        expanded
          ? React.createElement(
              'div',
              { className: 'tt-body' },
              snap.status === 'loading'
                ? React.createElement(
                    'div',
                    { className: 'tt-field', style: { color: 'var(--dsw-alias-label-secondary)', fontSize: 13 } },
                    t('loading'),
                  )
                : null,
              snap.status === 'unavailable'
                ? React.createElement(
                    'div',
                    { className: 'tt-field', style: { color: 'var(--dsw-alias-label-secondary)', fontSize: 13 } },
                    t('unavailable'),
                  )
                : null,
              snap.status === 'ready'
                ? React.createElement(
                    'div',
                    null,
                    React.createElement(
                      'div',
                      { className: 'tt-field' },
                      React.createElement('label', { className: 'tt-sub' }, t('field.base')),
                      React.createElement('input', {
                        className: 'tt-input',
                        type: 'text',
                        value: draft.base,
                        onChange: (e) => setDraft({ ...draft, base: e.target.value }),
                        disabled: snap.writable === false,
                      }),
                    ),
                    React.createElement(
                      'div',
                      { className: 'tt-field' },
                      React.createElement('label', { className: 'tt-sub' }, t('field.user')),
                      React.createElement('input', {
                        className: 'tt-input',
                        type: 'text',
                        value: draft.user,
                        onChange: (e) => setDraft({ ...draft, user: e.target.value }),
                        disabled: snap.writable === false,
                        autoComplete: 'username',
                      }),
                    ),
                    React.createElement(
                      'div',
                      { className: 'tt-field' },
                      React.createElement('label', { className: 'tt-sub' }, t('field.pass')),
                      React.createElement('input', {
                        className: 'tt-input',
                        type: 'password',
                        value: draft.pass,
                        placeholder: t('passPlaceholder'),
                        onChange: (e) => setDraft({ ...draft, pass: e.target.value }),
                        disabled: snap.writable === false,
                        autoComplete: 'new-password',
                      }),
                      React.createElement('div', { className: 'tt-sub' }, t('passHint')),
                    ),
                    React.createElement(
                      'div',
                      { className: 'tt-field' },
                      React.createElement('label', { className: 'tt-sub' }, t('field.passFile')),
                      React.createElement('input', {
                        className: 'tt-input',
                        type: 'text',
                        value: draft.passFile,
                        onChange: (e) => setDraft({ ...draft, passFile: e.target.value }),
                        disabled: snap.writable === false,
                      }),
                    ),
                    React.createElement(
                      'div',
                      { className: 'tt-foot' },
                      msg
                        ? React.createElement(
                            'span',
                            {
                              style: {
                                fontSize: 12,
                                color: 'var(--dsw-alias-label-secondary)',
                                marginRight: 'auto',
                              },
                            },
                            msg,
                          )
                        : null,
                      React.createElement(
                        'button',
                        {
                          type: 'button',
                          className: 'tt-save',
                          onClick: onSave,
                          disabled: saving || snap.writable === false,
                        },
                        saving ? t('saving') : t('save'),
                      ),
                    ),
                  )
                : null,
            )
          : null,
      )
    }

    module.exports.inject = ['slots', 'locale', 'settingsScope']
    module.exports.apply = function apply(ctx) {
      if (ctx.locale && typeof ctx.locale.register === 'function') {
        const registerLocale = () =>
          ctx.locale.register(NS, {
            en: {
              title: 'Task Tracker',
              subtitle: 'Todo inbox API (base URL and Basic auth)',
              loading: 'Loading…',
              unavailable: 'Settings scope unavailable',
              save: 'Save',
              saving: 'Saving…',
              saved: 'Saved',
              'field.base': 'API base URL',
              'field.user': 'Basic auth user',
              'field.pass': 'Basic auth password',
              'field.passFile': 'Password file (optional)',
              passPlaceholder: 'Leave blank to keep current',
              passHint: 'Secret field: the browser never reads the stored password back.',
            },
            ru: {
              title: 'Task Tracker',
              subtitle: 'Todo-инбокс: URL API и Basic-авторизация',
              loading: 'Загрузка…',
              unavailable: 'Пространство настроек недоступно',
              save: 'Сохранить',
              saving: 'Сохранение…',
              saved: 'Сохранено',
              'field.base': 'Базовый URL API',
              'field.user': 'Пользователь Basic',
              'field.pass': 'Пароль Basic',
              'field.passFile': 'Файл пароля (опционально)',
              passPlaceholder: 'Пусто — оставить текущий',
              passHint: 'Секрет: браузер не читает сохранённый пароль обратно.',
            },
          })

        if (typeof ctx.effect === 'function') {
          ctx.effect(registerLocale, 'dsh-task-tracker: словари')
        } else {
          registerLocale()
        }
      }

      let placed = false
      if (ctx.slots && typeof ctx.slots.inject === 'function') {
        const injectCard = () =>
          ctx.slots.inject('settings.plugin.item', () => {
            placed = true
            return ctx.slots.register(
              {
                name: 'settings.plugin.item',
                key: NS,
                locale: NS,
                inject: () => ({ ctx }),
              },
              PluginCard,
            )
          })

        if (typeof ctx.effect === 'function') {
          ctx.effect(injectCard, 'dsh-task-tracker: карточка')
        } else {
          injectCard()
        }
      }

      const registerFallback = () => {
        let cancelFallback = null
        const timer = setTimeout(() => {
          if (placed) return
          if (ctx.slots && typeof ctx.slots.inject === 'function') {
            cancelFallback = ctx.slots.inject('settings.section', () =>
              ctx.slots.register(
                {
                  name: 'settings.section',
                  id: '@goodandready-private/dsh-task-tracker',
                  order: 56,
                  locale: NS,
                  label: () =>
                    ctx.locale && ctx.locale.bind
                      ? ctx.locale.bind(NS)('title')
                      : 'Task Tracker',
                  inject: () => ({ ctx }),
                },
                PluginCard,
              ),
            )
          }
        }, 3000)

        return () => {
          clearTimeout(timer)
          if (typeof cancelFallback === 'function') cancelFallback()
        }
      }

      if (typeof ctx.effect === 'function') {
        ctx.effect(registerFallback, 'dsh-task-tracker: fallback section')
      } else {
        registerFallback()
      }
    }

    return module.exports
  },
})
