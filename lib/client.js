window.__ModuleLoader__.load({
  id: '@goodandready-private/dsh-task-tracker',
  factory: (require) => {
    var module = { exports: {} }
    const React = require('react')
    const h = React.createElement

    let ReactDOM = null
    try {
      ReactDOM = require('react-dom/client')
    } catch (_) {
      try {
        ReactDOM = require('react-dom')
      } catch (_) {
        ReactDOM = null
      }
    }

    const NS = 'dsh-task-tracker'
    const PANEL_ID = 'dsh-task-tracker'
    const ACTIVATE_EVENT = 'dsh:active-panel'
    const COLUMN_SELECTOR = '[data-pane=conversation], [class*=centerCol]'

    let ChevronIcon = null
    try {
      const primitives = require('@deepseek-ai/dsh-client-ui-primitives')
      ChevronIcon = primitives && primitives.IconChevronDownOutline14
    } catch (_) {
      ChevronIcon = null
    }

    function FallbackChevron(props) {
      return h(
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
        h('path', { d: 'M3.5 5.25L7 8.75L10.5 5.25' }),
      )
    }
    const Chevron = ChevronIcon || FallbackChevron

    const ICON_TASK = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'

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
      '.tt-chev-open{transform:rotate(180deg)}' +
      '.tt-screen-container{position:absolute;inset:0;z-index:45;background:var(--dsw-alias-bg-layer-1, #18181b);color:var(--dsw-alias-label-primary, #ffffff);display:flex;flex-direction:column;overflow:hidden}' +
      '.tt-screen-head{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--dsw-alias-border-l2, rgba(255,255,255,0.08));gap:12px;flex-wrap:wrap}' +
      '.tt-screen-title{font-size:16px;font-weight:600;display:flex;align-items:center;gap:8px}' +
      '.tt-filter-group{display:flex;align-items:center;gap:4px;background:var(--dsw-alias-bg-layer-2, rgba(255,255,255,0.04));padding:3px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2, rgba(255,255,255,0.08))}' +
      '.tt-filter-btn{background:transparent;border:0;color:var(--dsw-alias-label-secondary, #a0a0a0);font-size:12px;font-weight:500;padding:4px 10px;border-radius:6px;cursor:pointer;transition:all .15s}' +
      '.tt-filter-btn-active{background:var(--dsw-alias-bg-layer-3, rgba(255,255,255,0.12));color:var(--dsw-alias-label-primary, #fff)}' +
      '.tt-search-input{height:30px;background:var(--dsw-alias-bg-layer-2, rgba(255,255,255,0.04));border:1px solid var(--dsw-alias-border-l2, rgba(255,255,255,0.1));border-radius:6px;padding:0 10px;color:var(--dsw-alias-label-primary, #fff);font-size:12px;width:150px;outline:none}' +
      '.tt-close-btn{background:transparent;border:0;color:var(--dsw-alias-label-secondary, #a0a0a0);cursor:pointer;padding:6px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:16px;line-height:1}' +
      '.tt-close-btn:hover{color:var(--dsw-alias-label-primary, #fff);background:var(--dsw-alias-bg-layer-3, rgba(255,255,255,0.1))}' +
      '.tt-create-bar{display:flex;align-items:center;gap:10px;padding:12px 20px;border-bottom:1px solid var(--dsw-alias-border-l2, rgba(255,255,255,0.08));background:var(--dsw-alias-bg-layer-2, rgba(255,255,255,0.02))}' +
      '.tt-create-input{flex:1;height:34px;background:var(--dsw-alias-bg-layer-3, rgba(255,255,255,0.06));border:1px solid var(--dsw-alias-border-l2, rgba(255,255,255,0.1));border-radius:8px;padding:0 12px;color:var(--dsw-alias-label-primary, #fff);font-size:13px;outline:none}' +
      '.tt-prio-select{height:34px;background:var(--dsw-alias-bg-layer-3, rgba(255,255,255,0.06));border:1px solid var(--dsw-alias-border-l2, rgba(255,255,255,0.1));border-radius:8px;padding:0 8px;color:var(--dsw-alias-label-primary, #fff);font-size:12px;outline:none}' +
      '.tt-add-btn{height:34px;padding:0 14px;background:var(--dsw-alias-color-primary, #0070f3);color:var(--dsw-alias-bg-layer-1, #fff);border:0;border-radius:8px;font-weight:500;font-size:13px;cursor:pointer;display:flex;align-items:center;gap:4px}' +
      '.tt-list{flex:1;overflow-y:auto;padding:12px 20px;display:flex;flex-direction:column;gap:6px}' +
      '.tt-task-row{display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--dsw-alias-bg-layer-2, rgba(255,255,255,0.03));border:1px solid var(--dsw-alias-border-l2, rgba(255,255,255,0.06));border-radius:8px;transition:border-color .15s}' +
      '.tt-task-row:hover{border-color:var(--dsw-alias-border-l1, rgba(255,255,255,0.15))}' +
      '.tt-task-checkbox{width:16px;height:16px;cursor:pointer;accent-color:var(--dsw-alias-color-primary, #0070f3)}' +
      '.tt-task-title{flex:1;font-size:13px;color:var(--dsw-alias-label-primary, #fff);word-break:break-word}' +
      '.tt-task-done{text-decoration:line-through;opacity:.55;color:var(--dsw-alias-label-secondary, #a0a0a0)}' +
      '.tt-prio-tag{font-size:10px;font-weight:600;padding:2px 5px;border-radius:4px;text-transform:uppercase}' +
      '.tt-prio-3{background:color-mix(in srgb, var(--dsw-alias-state-danger-primary, #ef4444) 15%, transparent);color:var(--dsw-alias-state-danger-primary, #ef4444);border:1px solid color-mix(in srgb, var(--dsw-alias-state-danger-primary, #ef4444) 35%, transparent)}' +
      '.tt-prio-2{background:color-mix(in srgb, var(--dsw-alias-state-warn-primary, #f59e0b) 15%, transparent);color:var(--dsw-alias-state-warn-primary, #f59e0b);border:1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary, #f59e0b) 35%, transparent)}' +
      '.tt-prio-1{background:color-mix(in srgb, var(--dsw-alias-color-primary, #3b82f6) 15%, transparent);color:var(--dsw-alias-color-primary, #3b82f6);border:1px solid color-mix(in srgb, var(--dsw-alias-color-primary, #3b82f6) 30%, transparent)}' +
      '.tt-delete-btn{background:transparent;border:0;color:var(--dsw-alias-label-tertiary, #666);cursor:pointer;padding:2px 6px;border-radius:4px;font-size:13px}' +
      '.tt-delete-btn:hover{color:var(--dsw-alias-state-danger-primary, #ef4444);background:color-mix(in srgb, var(--dsw-alias-state-danger-primary, #ef4444) 10%, transparent)}' +
      '.tt-empty{text-align:center;padding:40px 20px;color:var(--dsw-alias-label-tertiary, #666);font-size:13px}' +
      '.tt-chip-btn{background:none;border:none;color:var(--dsw-alias-label-secondary, #999);cursor:pointer;padding:4px 8px;display:inline-flex;align-items:center;gap:6px;border-radius:6px;transition:background .15s}' +
      '.tt-chip-btn:hover{background:var(--dsw-alias-bg-layer-3, rgba(255,255,255,0.08));color:var(--dsw-alias-label-primary, #fff)}' +
      '.tt-chip-badge{font-size:11px;font-weight:600;padding:1px 5px;border-radius:8px;background:var(--dsw-alias-color-primary, #0070f3);color:var(--dsw-alias-bg-layer-1, #fff)}'

    function createToggle() {
      let open = false
      const listeners = new Set()
      return {
        isOpen: () => open,
        set: (v) => {
          open = Boolean(v)
          for (const fn of listeners) fn()
        },
        toggle() { this.set(!open) },
        subscribe: (fn) => {
          listeners.add(fn)
          return () => listeners.delete(fn)
        },
      }
    }

    async function apiRequest(path, options = {}) {
      const res = await fetch('/dsh-task-tracker/api' + path, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      })
      if (!res.ok) {
        throw new Error('API error: ' + res.status)
      }
      return res.json()
    }

    function TasksScreen(props) {
      const { toggle, ctx } = props
      const [isOpen, setIsOpen] = React.useState(toggle.isOpen())
      const [tasks, setTasks] = React.useState([])
      const [filter, setFilter] = React.useState('all')
      const [search, setSearch] = React.useState('')
      const [newTitle, setNewTitle] = React.useState('')
      const [newPriority, setNewPriority] = React.useState(0)
      const [loading, setLoading] = React.useState(false)

      React.useEffect(() => {
        return toggle.subscribe(() => {
          setIsOpen(toggle.isOpen())
        })
      }, [toggle])

      const refresh = React.useCallback(async () => {
        setLoading(true)
        try {
          const list = await apiRequest('/tasks')
          setTasks(Array.isArray(list) ? list : [])
        } catch (_) {
          // ignore
        } finally {
          setLoading(false)
        }
      }, [])

      React.useEffect(() => {
        if (isOpen) {
          refresh()
        }
      }, [isOpen, refresh])

      if (!isOpen) return null

      const pendingCount = tasks.filter((t) => t.status !== 'completed').length
      const completedCount = tasks.filter((t) => t.status === 'completed').length

      const filtered = tasks.filter((t) => {
        if (filter === 'pending' && t.status === 'completed') return false
        if (filter === 'completed' && t.status !== 'completed') return false
        if (search) {
          const q = search.toLowerCase()
          return (t.title && t.title.toLowerCase().includes(q)) ||
            (t.description && t.description.toLowerCase().includes(q))
        }
        return true
      })

      const handleToggle = async (t) => {
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed'
        setTasks((prev) => prev.map((item) => (item.id === t.id ? { ...item, status: nextStatus } : item)))
        try {
          await apiRequest('/tasks/' + encodeURIComponent(t.id), {
            method: 'PATCH',
            body: JSON.stringify({ status: nextStatus }),
          })
        } catch (_) {
          refresh()
        }
      }

      const handleDelete = async (t) => {
        setTasks((prev) => prev.filter((item) => item.id !== t.id))
        try {
          await apiRequest('/tasks/' + encodeURIComponent(t.id), {
            method: 'DELETE',
          })
        } catch (_) {
          refresh()
        }
      }

      const handleCreate = async (e) => {
        if (e) e.preventDefault()
        const clean = newTitle.trim()
        if (!clean) return
        setNewTitle('')
        try {
          const created = await apiRequest('/tasks', {
            method: 'POST',
            body: JSON.stringify({ title: clean, priority: Number(newPriority) || 0 }),
          })
          setTasks((prev) => [created, ...prev])
        } catch (_) {
          refresh()
        }
      }

      return h(
        'div',
        { className: 'tt-screen-container' },
        h('style', null, CSS),
        h(
          'div',
          { className: 'tt-screen-head' },
          h(
            'div',
            { className: 'tt-screen-title' },
            h('span', { dangerouslySetInnerHTML: { __html: ICON_TASK } }),
            h('span', null, 'Task Tracker'),
            pendingCount > 0 ? h('span', { className: 'tt-chip-badge' }, String(pendingCount)) : null,
          ),
          h(
            'div',
            { className: 'tt-filter-group' },
            h(
              'button',
              {
                type: 'button',
                className: 'tt-filter-btn' + (filter === 'all' ? ' tt-filter-btn-active' : ''),
                onClick: () => setFilter('all'),
              },
              'All (' + tasks.length + ')',
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'tt-filter-btn' + (filter === 'pending' ? ' tt-filter-btn-active' : ''),
                onClick: () => setFilter('pending'),
              },
              'Active (' + pendingCount + ')',
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'tt-filter-btn' + (filter === 'completed' ? ' tt-filter-btn-active' : ''),
                onClick: () => setFilter('completed'),
              },
              'Done (' + completedCount + ')',
            ),
          ),
          h('input', {
            type: 'text',
            className: 'tt-search-input',
            placeholder: 'Search tasks…',
            value: search,
            onChange: (e) => setSearch(e.target.value),
          }),
          h(
            'button',
            {
              type: 'button',
              className: 'tt-close-btn',
              title: 'Close (Esc)',
              onClick: () => toggle.set(false),
            },
            '✕',
          ),
        ),
        h(
          'form',
          { className: 'tt-create-bar', onSubmit: handleCreate },
          h('input', {
            type: 'text',
            className: 'tt-create-input',
            placeholder: 'What needs to be done?',
            value: newTitle,
            onChange: (e) => setNewTitle(e.target.value),
          }),
          h(
            'select',
            {
              className: 'tt-prio-select',
              value: newPriority,
              onChange: (e) => setNewPriority(Number(e.target.value)),
            },
            h('option', { value: 0 }, 'Normal'),
            h('option', { value: 1 }, 'Low'),
            h('option', { value: 2 }, 'Medium'),
            h('option', { value: 3 }, 'High'),
          ),
          h('button', { type: 'submit', className: 'tt-add-btn' }, '+ Add'),
        ),
        h(
          'div',
          { className: 'tt-list' },
          filtered.length === 0
            ? h('div', { className: 'tt-empty' }, loading ? 'Loading tasks…' : 'No tasks found')
            : filtered.map((t) =>
                h(
                  'div',
                  { key: t.id, className: 'tt-task-row' },
                  h('input', {
                    type: 'checkbox',
                    className: 'tt-task-checkbox',
                    checked: t.status === 'completed',
                    onChange: () => handleToggle(t),
                  }),
                  t.priority === 3
                    ? h('span', { className: 'tt-prio-tag tt-prio-3' }, 'High')
                    : t.priority === 2
                    ? h('span', { className: 'tt-prio-tag tt-prio-2' }, 'Med')
                    : t.priority === 1
                    ? h('span', { className: 'tt-prio-tag tt-prio-1' }, 'Low')
                    : null,
                  h(
                    'span',
                    {
                      className: 'tt-task-title' + (t.status === 'completed' ? ' tt-task-done' : ''),
                    },
                    t.title,
                  ),
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'tt-delete-btn',
                      title: 'Delete task',
                      onClick: () => handleDelete(t),
                    },
                    '✕',
                  ),
                ),
              ),
        ),
      )
    }

    function TaskChip(props) {
      const toggle = props.toggle
      const [count, setCount] = React.useState(0)

      React.useEffect(() => {
        let alive = true
        const check = async () => {
          try {
            const stats = await apiRequest('/tasks/stats')
            if (alive && stats && typeof stats.pending === 'number') {
              setCount(stats.pending)
            }
          } catch (err) {
            console.warn('[dsh-task-tracker] failed to fetch task stats:', err)
          }
        }
        check()
        const timer = setInterval(check, 10000)
        return () => {
          alive = false
          clearInterval(timer)
        }
      }, [])

      return h(
        'button',
        {
          type: 'button',
          className: 'tt-chip-btn',
          title: 'Task Tracker',
          onClick: () => toggle && toggle.toggle(),
        },
        h('span', { dangerouslySetInnerHTML: { __html: ICON_TASK } }),
        count > 0 ? h('span', { className: 'tt-chip-badge' }, String(count)) : null,
      )
    }

    function mountTasksScreen(ctx, toggle) {
      if (typeof document === 'undefined') return () => {}

      let root = null
      let container = null

      const ensure = () => {
        if (container !== null) return
        const column = document.querySelector(COLUMN_SELECTOR)
        if (column === null) return

        container = document.createElement('div')
        container.setAttribute('data-dsh-plugin', 'dsh-task-tracker')
        column.appendChild(container)

        if (ReactDOM && typeof ReactDOM.createRoot === 'function') {
          root = ReactDOM.createRoot(container)
          root.render(h(TasksScreen, { ctx, toggle }))
        }
      }

      const applyActive = () => {
        if (toggle.isOpen()) {
          document.documentElement.setAttribute('data-dsh-task-tracker-open', '')
          document.dispatchEvent(new CustomEvent(ACTIVATE_EVENT, { detail: PANEL_ID }))
        } else {
          document.documentElement.removeAttribute('data-dsh-task-tracker-open')
        }
      }

      const onOtherActivate = (e) => {
        if (e.detail !== PANEL_ID && toggle.isOpen()) {
          toggle.set(false)
        }
      }

      const onKeyDown = (e) => {
        if (e.key === 'Escape' && toggle.isOpen()) {
          toggle.set(false)
        }
      }

      const observer = new MutationObserver(ensure)
      observer.observe(document.body, { childList: true, subtree: true })
      document.addEventListener(ACTIVATE_EVENT, onOtherActivate)
      document.addEventListener('keydown', onKeyDown)
      const unsub = toggle.subscribe(applyActive)
      ensure()

      return () => {
        observer.disconnect()
        document.removeEventListener(ACTIVATE_EVENT, onOtherActivate)
        document.removeEventListener('keydown', onKeyDown)
        unsub()
        document.documentElement.removeAttribute('data-dsh-task-tracker-open')
        if (root && typeof root.unmount === 'function') root.unmount()
        if (container && container.remove) container.remove()
      }
    }

    function mountSidebarEntry(toggle, label) {
      if (typeof document === 'undefined') return () => {}

      let entry = null
      const tryPlace = () => {
        if (document.querySelector('[data-dsh-part="task-tracker-sidebar"]')) return
        const nodes = document.querySelectorAll('button[class*="newSession"]')
        let target = null
        for (const n of nodes) {
          if (String(n.className).indexOf('newSessionLabel') === -1) {
            target = n
            break
          }
        }
        if (!target) return

        entry = target.cloneNode(true)
        entry.className = String(target.className) + ' tt-sidebar-entry'
        entry.setAttribute('data-dsh-plugin', 'dsh-task-tracker')
        entry.setAttribute('data-dsh-part', 'task-tracker-sidebar')
        entry.setAttribute('aria-label', label)
        entry.removeAttribute('id')
        entry.innerHTML = ''

        const icon = document.createElement('span')
        icon.innerHTML = ICON_TASK
        entry.appendChild(icon)

        const text = document.createElement('span')
        text.style.marginLeft = '8px'
        text.textContent = label
        entry.appendChild(text)

        entry.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          toggle.toggle()
        })

        target.insertAdjacentElement('afterend', entry)
      }

      const observer = new MutationObserver(tryPlace)
      observer.observe(document.body, { childList: true, subtree: true })
      tryPlace()

      return () => {
        observer.disconnect()
        if (entry && entry.remove) entry.remove()
      }
    }

    function PluginCard(props) {
      const ctx = props.ctx
      const [expanded, setExpanded] = React.useState(false)
      const [snap, setSnap] = React.useState({ status: 'loading', value: null, writable: false })
      const [draft, setDraft] = React.useState({ filePath: '', base: '', user: '', pass: '', passFile: '' })
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
                filePath: v.filePath ?? '',
                base: v.base ?? '',
                user: v.user ?? '',
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
          } catch (_) {
            /* bestEffort: cleanup */
          }
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
          try {
            await scope.set('filePath', draft.filePath ?? '')
          } catch (e) {
            errs.push('filePath: ' + (e && e.message ? e.message : String(e)))
          }
          setMsg(errs.length ? errs.join('; ') : t('saved'))
        } catch (e) {
          setMsg(String(e && e.message ? e.message : e))
        }
        setSaving(false)
      }

      return h(
        'div',
        { className: 'tt-card' },
        h('style', null, CSS),
        h(
          'button',
          {
            type: 'button',
            className: 'tt-head',
            onClick: () => setExpanded(!expanded),
            'aria-expanded': expanded,
          },
          h('span', { className: 'tt-title' }, t('title')),
          h('span', { className: 'tt-sub' }, t('subtitle')),
          h(Chevron, {
            className: 'tt-chev' + (expanded ? ' tt-chev-open' : ''),
          }),
        ),
        expanded
          ? h(
              'div',
              { className: 'tt-body' },
              snap.status === 'loading'
                ? h(
                    'div',
                    { className: 'tt-field', style: { color: 'var(--dsw-alias-label-secondary)', fontSize: 13 } },
                    t('loading'),
                  )
                : null,
              snap.status === 'unavailable'
                ? h(
                    'div',
                    { className: 'tt-field', style: { color: 'var(--dsw-alias-label-secondary)', fontSize: 13 } },
                    t('unavailable'),
                  )
                : null,
              snap.status === 'ready'
                ? h(
                    'div',
                    null,
                    h(
                      'div',
                      { className: 'tt-field' },
                      h('label', { className: 'tt-sub' }, t('field.filePath')),
                      h('input', {
                        className: 'tt-input',
                        type: 'text',
                        value: draft.filePath,
                        placeholder: t('field.filePathPlaceholder'),
                        onChange: (e) => setDraft({ ...draft, filePath: e.target.value }),
                        disabled: snap.writable === false,
                      }),
                    ),
                    h(
                      'div',
                      { className: 'tt-foot' },
                      msg
                        ? h(
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
                      h(
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
              subtitle: 'Local JSON todo store (~/.dsh/task-tracker/tasks.json)',
              'field.filePath': 'Custom tasks JSON storage path (optional)',
              'field.filePathPlaceholder': '~/.dsh/task-tracker/tasks.json',
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
              'tasks.title': 'Tasks',
              'tasks.all': 'All',
              'tasks.active': 'Active',
              'tasks.completed': 'Done',
              'tasks.search': 'Search tasks…',
              'tasks.newPlaceholder': 'What needs to be done?',
              'tasks.add': 'Add Task',
              'tasks.empty': 'No tasks found',
              'tasks.delete': 'Delete task',
              'tasks.close': 'Close',
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

      const toggle = createToggle()

      if (ctx.slots && typeof ctx.slots.inject === 'function') {
        const injectChip = () =>
          ctx.slots.inject('conversation.session.header.utilities', () =>
            ctx.slots.register(
              {
                name: 'conversation.session.header.utilities',
                id: '@goodandready-private/dsh-task-tracker.chip',
                order: 28,
                locale: NS,
                inject: () => ({ ctx, toggle }),
              },
              TaskChip,
            ),
          )

        if (typeof ctx.effect === 'function') {
          ctx.effect(injectChip, 'dsh-task-tracker: chip')
        } else {
          injectChip()
        }
      }

      const mountOverlay = () => {
        const off = [
          mountSidebarEntry(toggle, 'Tasks'),
          mountTasksScreen(ctx, toggle),
        ]
        return () => {
          for (const fn of off) {
            try { fn() } catch (_) {
              /* bestEffort: cleanup */
            }
          }
        }
      }

      if (typeof ctx.effect === 'function') {
        ctx.effect(mountOverlay, 'dsh-task-tracker: overlay')
      } else {
        mountOverlay()
      }
    }

    return module.exports
  },
})
