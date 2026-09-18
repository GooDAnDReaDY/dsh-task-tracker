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
    const BACK_ICON = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5"/></svg>'

    const POPULAR_EMOJIS = [
      '📁', '📥', '💼', '🚀', '💡', '📌', '🎯', '⚡', '🔥', '📦',
      '🏷️', '📝', '⭐', '🛠️', '💬', '📊', '🎨', '❤️', '✅', '🔍',
    ]

    const CSS =
      '.tt-card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:12px;list-style:none}' +
      '.tt-head{appearance:none;width:100%;font:inherit;text-align:left;display:flex;align-items:center;padding:16px 20px;cursor:pointer;background:transparent;border:0;color:inherit;outline:none}' +
      '.tt-title{font-size:15px;font-weight:600;color:var(--dsw-alias-label-primary)}' +
      '.tt-sub{font-size:12px;color:var(--dsw-alias-label-secondary);margin-left:12px;flex:1}' +
      '.tt-chev{width:14px;height:14px;color:var(--dsw-alias-label-tertiary);transition:transform .2s ease}' +
      '.tt-chev-open{transform:rotate(180deg)}' +
      '.tt-body{padding:0 20px 20px;border-top:1px solid var(--dsw-alias-border-l1)}' +
      '.tt-field{display:flex;flex-direction:column;gap:6px;margin-top:14px}' +
      '.tt-input{height:36px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);padding:0 12px;color:var(--dsw-alias-label-primary);font-size:13px;outline:none}' +
      '.tt-foot{display:flex;justify-content:flex-end;gap:8px;margin-top:16px;align-items:center}' +
      '.tt-save{appearance:none;font:inherit;cursor:pointer;border:1px solid transparent;border-radius:8px;padding:6px 14px;font-size:13px;font-weight:500;background:var(--dsw-alias-color-primary-base);color:var(--dsw-alias-bg-base)}' +
      '.tt-chip-btn{appearance:none;background:0 0;border:0;padding:4px;cursor:pointer;color:var(--dsw-alias-label-secondary);display:flex;align-items:center;position:relative;border-radius:6px;line-height:1}' +
      '.tt-chip-badge{position:absolute;top:-2px;right:-4px;background:var(--dsw-alias-color-primary-base);color:var(--dsw-alias-bg-base);font-size:9px;font-weight:700;padding:0 4px;border-radius:10px;line-height:13px;min-width:13px;text-align:center}' +
      '[data-dsh-task-tracker-open] [data-dsh-task-tracker-view]{display:flex!important}' +
      '[data-dsh-task-tracker-open] [data-pane=conversation]>:not([data-dsh-task-tracker-view]){display:none!important}' +
      '[data-dsh-task-tracker-open] [class*=centerCol]>:not([data-dsh-task-tracker-view]){display:none!important}' +
      '.tt-screen-container{display:flex;flex-direction:column;width:100%;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);position:relative;overflow:hidden}' +
      '.tt-screen-head{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);flex:none}' +
      '.tt-screen-title{font-size:16px;font-weight:600;display:flex;align-items:center;gap:8px}' +
      '.tt-back-btn{appearance:none;background:transparent;border:0;color:var(--dsw-alias-label-secondary);cursor:pointer;display:inline-flex;align-items:center;gap:4px;font-size:13px;padding:4px 8px;border-radius:6px}' +
      '.tt-search-input{height:30px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);border-radius:6px;padding:0 10px;color:var(--dsw-alias-label-primary);font-size:12px;width:130px;outline:none}' +
      '.tt-add-main-btn{appearance:none;font:inherit;cursor:pointer;border:1px solid transparent;border-radius:8px;padding:4px 12px;font-size:13px;font-weight:500;background:var(--dsw-alias-color-primary-base);color:var(--dsw-alias-bg-base);height:30px;display:inline-flex;align-items:center;gap:6px}' +
      '.tt-close-btn{appearance:none;background:0 0;border:0;color:var(--dsw-alias-label-secondary);font-size:16px;cursor:pointer;padding:4px 8px;border-radius:6px;line-height:1}' +
      '.tt-filter-group{display:flex;align-items:center;gap:4px;background:var(--dsw-alias-bg-layer-2);padding:2px 4px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2)}' +
      '.tt-filter-btn{background:transparent;border:0;color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:500;padding:3px 8px;border-radius:6px;cursor:pointer;transition:all .15s}' +
      '.tt-filter-btn-active{background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary)}' +
      '.tt-tasks-main{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:12px 16px;display:flex;flex-direction:column;gap:6px}' +
      '.tt-task-row{display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--dsw-alias-bg-layer-3);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;cursor:pointer;transition:border-color .15s, background .15s;user-select:none}' +
      '.tt-task-row:hover{background:color-mix(in srgb, var(--dsw-alias-label-primary) 3%, var(--dsw-alias-bg-layer-3));border-color:color-mix(in srgb, var(--dsw-alias-border-l2) 80%, var(--dsw-alias-label-primary))}' +
      '.tt-task-check{appearance:none;width:16px;height:16px;border:1px solid var(--dsw-alias-border-l2);border-radius:4px;cursor:pointer;background:transparent;display:flex;align-items:center;justify-content:center;flex:none;transition:all .15s}' +
      '.tt-task-check-checked{background:var(--dsw-alias-color-primary-base);border-color:var(--dsw-alias-color-primary-base);color:var(--dsw-alias-bg-base)}' +
      '.tt-task-title{flex:1;min-width:0;font-size:13px;font-weight:500;color:var(--dsw-alias-label-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
      '.tt-task-title-done{text-decoration:line-through;color:var(--dsw-alias-label-tertiary)}' +
      '.tt-task-priority-badge{font-size:10px;font-weight:600;padding:2px 6px;border-radius:6px;flex:none;text-transform:uppercase}' +
      '.tt-priority-0{display:none}' +
      '.tt-priority-1{background:color-mix(in srgb, var(--dsw-alias-label-secondary) 15%, transparent);color:var(--dsw-alias-label-secondary)}' +
      '.tt-priority-2{background:color-mix(in srgb, var(--dsw-alias-color-warning, #e6a23c) 20%, transparent);color:var(--dsw-alias-color-warning, #e6a23c)}' +
      '.tt-priority-3{background:color-mix(in srgb, var(--dsw-alias-color-danger, #f56c6c) 20%, transparent);color:var(--dsw-alias-color-danger, #f56c6c)}' +
      '.tt-task-action-btn{appearance:none;background:0 0;border:0;cursor:pointer;font-size:13px;color:var(--dsw-alias-label-tertiary);padding:4px;border-radius:4px;display:flex;align-items:center;justify-content:center;flex:none}' +
      '.tt-bottom-shelf{flex:none;border-top:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);padding:8px 16px;display:flex;flex-direction:column;gap:6px}' +
      '.tt-shelf-top{display:flex;align-items:center;justify-content:space-between;padding:0 2px}' +
      '.tt-folders-grid{display:flex;flex-wrap:wrap;gap:8px;max-height:124px;overflow-y:auto;align-items:flex-start}' +
      '.tt-folder-tile{width:140px;min-height:52px;max-height:56px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);padding:6px 8px;display:flex;align-items:center;gap:8px;cursor:pointer;position:relative;box-sizing:border-box;user-select:none;transition:border-color .15s, background .15s}' +
      '.tt-folder-tile:hover{background:color-mix(in srgb, var(--dsw-alias-label-primary) 4%, var(--dsw-alias-bg-layer-3))}' +
      '.tt-folder-tile-active{border-color:var(--dsw-alias-color-primary-base);background:color-mix(in srgb, var(--dsw-alias-color-primary-base) 12%, var(--dsw-alias-bg-layer-3))}' +
      '.tt-folder-tile-dragover{border-color:var(--dsw-alias-color-primary-base);box-shadow:0 0 0 2px var(--dsw-alias-color-primary-base);background:color-mix(in srgb, var(--dsw-alias-color-primary-base) 20%, var(--dsw-alias-bg-layer-3))}' +
      '.tt-folder-icon-btn{appearance:none;background:0 0;border:0;padding:2px;font-size:18px;cursor:pointer;line-height:1;border-radius:4px;display:flex;align-items:center;justify-content:center;flex:none}' +
      '.tt-folder-title-box{flex:1;min-width:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word;font-size:12px;line-height:1.25;font-weight:500;color:var(--dsw-alias-label-primary)}' +
      '.tt-folder-badge{font-size:10px;font-weight:600;padding:1px 5px;border-radius:10px;background:color-mix(in srgb, var(--dsw-alias-label-primary) 10%, transparent);color:var(--dsw-alias-label-secondary);flex:none}' +
      '.tt-add-folder-btn{height:52px;border-radius:8px;border:1px dashed var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-secondary);padding:0 12px;font-size:12px;font-weight:500;display:flex;align-items:center;gap:6px;cursor:pointer}' +
      '.tt-icon-picker{position:absolute;bottom:100%;left:0;margin-bottom:6px;background:var(--dsw-alias-bg-layer-3);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:6px;display:grid;grid-template-columns:repeat(5, 1fr);gap:4px;z-index:80;box-shadow:0 4px 16px color-mix(in srgb, var(--dsw-alias-bg-base) 60%, transparent)}' +
      '.tt-emoji-item{appearance:none;background:0 0;border:0;padding:4px;font-size:16px;cursor:pointer;border-radius:4px;line-height:1}' +
      '.tt-modal-backdrop{position:fixed;inset:0;background:color-mix(in srgb, var(--dsw-alias-bg-base) 65%, transparent);display:flex;align-items:center;justify-content:center;z-index:100;backdrop-filter:blur(3px)}' +
      '.tt-modal-box{width:560px;max-width:92vw;max-height:88vh;background:var(--dsw-alias-bg-layer-3);border:1px solid var(--dsw-alias-border-l2);border-radius:12px;display:flex;flex-direction:column;box-shadow:0 12px 36px color-mix(in srgb, var(--dsw-alias-bg-base) 70%, transparent);overflow:hidden}' +
      '.tt-modal-head{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2)}' +
      '.tt-modal-body{padding:18px;overflow-y:auto;display:flex;flex-direction:column;gap:14px;flex:1}' +
      '.tt-modal-foot{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-top:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2)}' +
      '.tt-modal-input{height:36px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);padding:0 12px;color:var(--dsw-alias-label-primary);font-size:13px;outline:none}' +
      '.tt-modal-textarea{border-radius:8px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);padding:8px 12px;color:var(--dsw-alias-label-primary);font-size:13px;outline:none;resize:vertical;min-height:90px;font-family:inherit}' +
      '.tt-meta-row{display:flex;align-items:center;gap:16px;font-size:12px;color:var(--dsw-alias-label-secondary)}' +
      '.tt-meta-item{display:flex;align-items:center;gap:6px}' +
      '.tt-meta-badge{padding:2px 8px;border-radius:6px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);font-weight:500;color:var(--dsw-alias-label-primary)}' +
      '.tt-start-chat-btn{appearance:none;font:inherit;cursor:pointer;border:1px solid transparent;border-radius:8px;padding:6px 14px;font-size:13px;font-weight:500;background:var(--dsw-alias-color-primary-base);color:var(--dsw-alias-bg-base);display:inline-flex;align-items:center;gap:6px}' +
      '.tt-btn-secondary{appearance:none;font:inherit;cursor:pointer;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:6px 14px;font-size:13px;font-weight:500;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}' +
      '.tt-btn-danger{appearance:none;font:inherit;cursor:pointer;border:1px solid color-mix(in srgb, var(--dsw-alias-color-danger, #f56c6c) 30%, transparent);border-radius:8px;padding:6px 14px;font-size:13px;font-weight:500;background:color-mix(in srgb, var(--dsw-alias-color-danger, #f56c6c) 15%, transparent);color:var(--dsw-alias-color-danger, #f56c6c)}' +
      '.tt-error-banner{background:color-mix(in srgb, var(--dsw-alias-color-danger, #f56c6c) 15%, transparent);color:var(--dsw-alias-color-danger, #f56c6c);padding:8px 12px;border-radius:6px;font-size:12px}'

    function createToggle() {
      let open = false
      const listeners = new Set()
      return {
        isOpen: () => open,
        set: (value) => {
          open = Boolean(value)
          listeners.forEach((fn) => {
            try { fn(open) } catch (_) { /* bestEffort */ }
          })
        },
        toggle: () => {
          open = !open
          listeners.forEach((fn) => {
            try { fn(open) } catch (_) { /* bestEffort */ }
          })
        },
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

    function formatDateTime(iso) {
      if (!iso) return ''
      try {
        const d = new Date(iso)
        return d.toLocaleString('ru-RU', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      } catch (_) {
        return String(iso)
      }
    }

    function startChatWithAgent(ctx, toggle, task) {
      try {
        const nodes = document.querySelectorAll('button[class*="newSession"]')
        let target = null
        for (const n of nodes) {
          if (String(n.className).indexOf('newSessionLabel') === -1) {
            target = n
            break
          }
        }
        if (target && typeof target.click === 'function') {
          target.click()
        } else if (ctx && ctx.get && typeof ctx.get === 'function') {
          const sessions = ctx.get('sessions')
          if (sessions && typeof sessions.create === 'function') {
            sessions.create()
          }
        }
      } catch (err) {
        console.warn('[dsh-task-tracker] failed to trigger new session button:', err)
      }

      if (toggle && typeof toggle.set === 'function') {
        toggle.set(false)
      }

      const pMap = { 0: 'Обычный', 1: 'Низкий', 2: 'Средний', 3: 'Высокий' }
      const priorityLabel = pMap[task.priority] || 'Обычный'
      let prompt = 'Задача: ' + (task.title || '')
      if (task.folder) prompt += '\nПапка: ' + task.folder
      prompt += '\nПриоритет: ' + priorityLabel
      if (task.description && task.description.trim()) {
        prompt += '\n\nОписание:\n' + task.description.trim()
      }

      setTimeout(() => {
        try {
          const sel =
            '.conversation-input textarea, .cb-composer textarea, .dsh-composer textarea, [data-pane="conversation"] textarea, textarea'
          const ta = document.querySelector(sel)
          if (ta) {
            ta.value = prompt
            ta.dispatchEvent(new Event('input', { bubbles: true }))
            ta.dispatchEvent(new Event('change', { bubbles: true }))
            ta.focus()
          }
        } catch (e) {
          console.warn('[dsh-task-tracker] failed to fill composer:', e)
        }
      }, 300)
    }

    function TaskDetailModal(props) {
      const task = props.task
      const folders = props.folders || []
      const onClose = props.onClose
      const onSave = props.onSave
      const onDelete = props.onDelete
      const onStartChat = props.onStartChat

      const [title, setTitle] = React.useState(task.title || '')
      const [description, setDescription] = React.useState(task.description || '')
      const [folder, setFolder] = React.useState(task.folder || 'Inbox')
      const [priority, setPriority] = React.useState(task.priority || 0)
      const [completed, setCompleted] = React.useState(Boolean(task.completed))
      const [saving, setSaving] = React.useState(false)

      const handleSave = async () => {
        if (!title.trim()) return
        setSaving(true)
        try {
          await onSave({
            id: task.id,
            title: title.trim(),
            description: description.trim(),
            folder,
            priority: Number(priority),
            completed,
          })
          onClose()
        } catch (err) {
          console.error(err)
        } finally {
          setSaving(false)
        }
      }

      return h(
        'div',
        { className: 'tt-modal-backdrop', onClick: onClose },
        h(
          'div',
          { className: 'tt-modal-box', onClick: (e) => e.stopPropagation() },
          h(
            'div',
            { className: 'tt-modal-head' },
            h('span', { style: { fontWeight: 600, fontSize: 15 } }, 'Задача'),
            h('button', {
              type: 'button',
              className: 'tt-close-btn',
              onClick: onClose,
            }, '✕'),
          ),
          h(
            'div',
            { className: 'tt-modal-body' },
            h(
              'div',
              { className: 'tt-field', style: { marginTop: 0 } },
              h('label', { className: 'tt-sub', style: { marginLeft: 0 } }, 'Заголовок'),
              h('input', {
                type: 'text',
                className: 'tt-modal-input',
                value: title,
                placeholder: 'Заголовок задачи',
                onChange: (e) => setTitle(e.target.value),
              }),
            ),
            h(
              'div',
              { className: 'tt-field', style: { marginTop: 0 } },
              h('label', { className: 'tt-sub', style: { marginLeft: 0 } }, 'Описание'),
              h('textarea', {
                className: 'tt-modal-textarea',
                value: description,
                placeholder: 'Подробное описание задачи…',
                onChange: (e) => setDescription(e.target.value),
              }),
            ),
            h(
              'div',
              { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } },
              h(
                'div',
                { className: 'tt-field', style: { marginTop: 0 } },
                h('label', { className: 'tt-sub', style: { marginLeft: 0 } }, 'Папка'),
                h(
                  'select',
                  {
                    className: 'tt-modal-input',
                    value: folder,
                    onChange: (e) => setFolder(e.target.value),
                  },
                  folders.map((f) =>
                    h('option', { key: f.name, value: f.name }, (f.icon || '📁') + ' ' + f.name),
                  ),
                ),
              ),
              h(
                'div',
                { className: 'tt-field', style: { marginTop: 0 } },
                h('label', { className: 'tt-sub', style: { marginLeft: 0 } }, 'Приоритет'),
                h(
                  'select',
                  {
                    className: 'tt-modal-input',
                    value: priority,
                    onChange: (e) => setPriority(Number(e.target.value)),
                  },
                  h('option', { value: 0 }, 'Обычный'),
                  h('option', { value: 1 }, 'Низкий'),
                  h('option', { value: 2 }, 'Средний'),
                  h('option', { value: 3 }, 'Высокий'),
                ),
              ),
            ),
            h(
              'div',
              { className: 'tt-meta-row' },
              h(
                'label',
                { style: { display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' } },
                h('input', {
                  type: 'checkbox',
                  checked: completed,
                  onChange: (e) => setCompleted(e.target.checked),
                }),
                h('span', null, 'Завершена'),
              ),
              h('div', { className: 'tt-meta-item' },
                h('span', null, 'Автор:'),
                h('span', { className: 'tt-meta-badge' }, task.author || 'User'),
              ),
              task.createdAt
                ? h('div', { className: 'tt-meta-item' },
                    h('span', null, 'Создана:'),
                    h('span', { className: 'tt-meta-badge' }, formatDateTime(task.createdAt)),
                  )
                : null,
            ),
          ),
          h(
            'div',
            { className: 'tt-modal-foot' },
            h('div', { style: { display: 'flex', gap: 8 } },
              h('button', {
                type: 'button',
                className: 'tt-btn-danger',
                onClick: () => {
                  if (onDelete) onDelete(task.id)
                  onClose()
                },
              }, 'Удалить'),
              h('button', {
                type: 'button',
                className: 'tt-start-chat-btn',
                onClick: () => {
                  if (onStartChat) onStartChat({ ...task, title, description, folder, priority })
                },
              }, '💬 Начать чат с агентом'),
            ),
            h('div', { style: { display: 'flex', gap: 8 } },
              h('button', {
                type: 'button',
                className: 'tt-btn-secondary',
                onClick: onClose,
              }, 'Закрыть'),
              h('button', {
                type: 'button',
                className: 'tt-save',
                disabled: saving || !title.trim(),
                onClick: handleSave,
              }, saving ? 'Сохранение…' : 'Сохранить'),
            ),
          ),
        ),
      )
    }

    function TaskCreateModal(props) {
      const defaultFolder = props.defaultFolder || 'Inbox'
      const folders = props.folders || []
      const onClose = props.onClose
      const onCreate = props.onCreate
      const onStartChat = props.onStartChat

      const [title, setTitle] = React.useState('')
      const [description, setDescription] = React.useState('')
      const [folder, setFolder] = React.useState(defaultFolder)
      const [priority, setPriority] = React.useState(0)

      const handleCreateOnly = async () => {
        if (!title.trim()) return
        await onCreate({
          title: title.trim(),
          description: description.trim(),
          folder,
          priority: Number(priority),
        })
        onClose()
      }

      const handleCreateAndChat = async () => {
        if (!title.trim()) return
        const created = await onCreate({
          title: title.trim(),
          description: description.trim(),
          folder,
          priority: Number(priority),
        })
        onClose()
        if (onStartChat) {
          onStartChat(created || { title, description, folder, priority })
        }
      }

      return h(
        'div',
        { className: 'tt-modal-backdrop', onClick: onClose },
        h(
          'div',
          { className: 'tt-modal-box', onClick: (e) => e.stopPropagation() },
          h(
            'div',
            { className: 'tt-modal-head' },
            h('span', { style: { fontWeight: 600, fontSize: 15 } }, 'Новая задача'),
            h('button', {
              type: 'button',
              className: 'tt-close-btn',
              onClick: onClose,
            }, '✕'),
          ),
          h(
            'div',
            { className: 'tt-modal-body' },
            h(
              'div',
              { className: 'tt-field', style: { marginTop: 0 } },
              h('label', { className: 'tt-sub', style: { marginLeft: 0 } }, 'Заголовок *'),
              h('input', {
                type: 'text',
                className: 'tt-modal-input',
                value: title,
                placeholder: 'Что нужно сделать?',
                autoFocus: true,
                onChange: (e) => setTitle(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleCreateOnly()
                  }
                },
              }),
            ),
            h(
              'div',
              { className: 'tt-field', style: { marginTop: 0 } },
              h('label', { className: 'tt-sub', style: { marginLeft: 0 } }, 'Описание'),
              h('textarea', {
                className: 'tt-modal-textarea',
                value: description,
                placeholder: 'Подробное описание задачи…',
                onChange: (e) => setDescription(e.target.value),
              }),
            ),
            h(
              'div',
              { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } },
              h(
                'div',
                { className: 'tt-field', style: { marginTop: 0 } },
                h('label', { className: 'tt-sub', style: { marginLeft: 0 } }, 'Папка'),
                h(
                  'select',
                  {
                    className: 'tt-modal-input',
                    value: folder,
                    onChange: (e) => setFolder(e.target.value),
                  },
                  folders.map((f) =>
                    h('option', { key: f.name, value: f.name }, (f.icon || '📁') + ' ' + f.name),
                  ),
                ),
              ),
              h(
                'div',
                { className: 'tt-field', style: { marginTop: 0 } },
                h('label', { className: 'tt-sub', style: { marginLeft: 0 } }, 'Приоритет'),
                h(
                  'select',
                  {
                    className: 'tt-modal-input',
                    value: priority,
                    onChange: (e) => setPriority(Number(e.target.value)),
                  },
                  h('option', { value: 0 }, 'Обычный'),
                  h('option', { value: 1 }, 'Низкий'),
                  h('option', { value: 2 }, 'Средний'),
                  h('option', { value: 3 }, 'Высокий'),
                ),
              ),
            ),
          ),
          h(
            'div',
            { className: 'tt-modal-foot' },
            h('button', {
              type: 'button',
              className: 'tt-btn-secondary',
              onClick: onClose,
            }, 'Отмена'),
            h('div', { style: { display: 'flex', gap: 8 } },
              h('button', {
                type: 'button',
                className: 'tt-btn-secondary',
                onClick: handleCreateOnly,
              }, '+ Создать'),
              h('button', {
                type: 'button',
                className: 'tt-start-chat-btn',
                onClick: handleCreateAndChat,
              }, '💬 Начать чат с агентом'),
            ),
          ),
        ),
      )
    }

    function BottomFolderShelf(props) {
      const folders = props.folders || []
      const activeFolder = props.activeFolder
      const onSelectFolder = props.onSelectFolder
      const onCreateFolder = props.onCreateFolder
      const onUpdateFolderIcon = props.onUpdateFolderIcon
      const onMoveTaskToFolder = props.onMoveTaskToFolder

      const [pickerFolder, setPickerFolder] = React.useState(null)
      const [dragOverFolder, setDragOverFolder] = React.useState(null)

      const handleAddFolder = () => {
        const name = window.prompt ? window.prompt('Название новой папки:') : null
        if (name && name.trim()) {
          onCreateFolder(name.trim(), '📁')
        }
      }

      return h(
        'div',
        { className: 'tt-bottom-shelf' },
        h(
          'div',
          { className: 'tt-shelf-top' },
          h('span', { style: { fontSize: 12, fontWeight: 600, color: 'var(--dsw-alias-label-secondary)' } },
            'Папки (' + folders.length + ')'
          ),
          activeFolder
            ? h('button', {
                type: 'button',
                className: 'tt-btn-secondary',
                style: { padding: '2px 8px', fontSize: 11, height: 22 },
                onClick: () => onSelectFolder(null),
              }, 'Показать все папки')
            : null,
        ),
        h(
          'div',
          { className: 'tt-folders-grid' },
          folders.map((folder) => {
            const isActive = activeFolder === folder.name
            const isDragOver = dragOverFolder === folder.name
            const isPickerOpen = pickerFolder === folder.name

            return h(
              'div',
              {
                key: folder.name,
                className: 'tt-folder-tile' + (isActive ? ' tt-folder-tile-active' : '') + (isDragOver ? ' tt-folder-tile-dragover' : ''),
                title: folder.name + ' (' + (folder.count || 0) + ' задач)',
                onClick: () => onSelectFolder(isActive ? null : folder.name),
                onDragOver: (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  e.dataTransfer.dropEffect = 'move'
                  if (dragOverFolder !== folder.name) {
                    setDragOverFolder(folder.name)
                  }
                },
                onDragLeave: (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (dragOverFolder === folder.name) {
                    setDragOverFolder(null)
                  }
                },
                onDrop: (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setDragOverFolder(null)
                  const taskId = e.dataTransfer.getData('text/plain')
                  if (taskId && onMoveTaskToFolder) {
                    onMoveTaskToFolder(taskId, folder.name)
                  }
                },
              },
              h(
                'button',
                {
                  type: 'button',
                  className: 'tt-folder-icon-btn',
                  title: 'Сменить значок',
                  onClick: (e) => {
                    e.stopPropagation()
                    setPickerFolder(isPickerOpen ? null : folder.name)
                  },
                },
                folder.icon || '📁',
              ),
              isPickerOpen
                ? h(
                    'div',
                    {
                      className: 'tt-icon-picker',
                      onClick: (e) => e.stopPropagation(),
                    },
                    POPULAR_EMOJIS.map((emoji) =>
                      h(
                        'button',
                        {
                          key: emoji,
                          type: 'button',
                          className: 'tt-emoji-item',
                          onClick: (e) => {
                            e.stopPropagation()
                            setPickerFolder(null)
                            if (onUpdateFolderIcon) {
                              onUpdateFolderIcon(folder.name, emoji)
                            }
                          },
                        },
                        emoji,
                      ),
                    ),
                  )
                : null,
              h('span', { className: 'tt-folder-title-box' }, folder.name),
              h('span', { className: 'tt-folder-badge' }, String(folder.count || 0)),
            )
          }),
          h(
            'button',
            {
              type: 'button',
              className: 'tt-add-folder-btn',
              onClick: handleAddFolder,
              title: 'Создать новую папку',
            },
            h('span', { style: { fontSize: 14, fontWeight: 700 } }, '+'),
            'Папка',
          ),
        ),
      )
    }

    function TasksScreen(props) {
      const ctx = props.ctx
      const toggle = props.toggle

      const [tasks, setTasks] = React.useState([])
      const [folders, setFolders] = React.useState([])
      const [activeFolder, setActiveFolder] = React.useState(null)
      const [filter, setFilter] = React.useState('all')
      const [searchQuery, setSearchQuery] = React.useState('')
      const [selectedTask, setSelectedTask] = React.useState(null)
      const [isCreateOpen, setIsCreateOpen] = React.useState(false)
      const [loading, setLoading] = React.useState(true)

      const loadData = React.useCallback(async () => {
        try {
          const [taskList, folderData] = await Promise.all([
            apiRequest('/tasks'),
            apiRequest('/tasks/folders?details=1'),
          ])
          if (Array.isArray(taskList)) setTasks(taskList)
          if (folderData && Array.isArray(folderData.details)) {
            setFolders(folderData.details)
          } else if (folderData && Array.isArray(folderData.folders)) {
            setFolders(folderData.folders.map((f) => (typeof f === 'string' ? { name: f, icon: '📁', count: 0 } : f)))
          }
        } catch (err) {
          console.warn('[dsh-task-tracker] failed to load tasks/folders:', err)
        } finally {
          setLoading(false)
        }
      }, [])

      React.useEffect(() => {
        loadData()
      }, [loadData])

      const handleToggleComplete = async (task) => {
        try {
          await apiRequest('/tasks/' + task.id, {
            method: 'PATCH',
            body: JSON.stringify({ completed: !task.completed }),
          })
          loadData()
        } catch (err) {
          console.error(err)
        }
      }

      const handleDeleteTask = async (taskId) => {
        try {
          await apiRequest('/tasks/' + taskId, { method: 'DELETE' })
          loadData()
        } catch (err) {
          console.error(err)
        }
      }

      const handleSaveTask = async (patch) => {
        try {
          await apiRequest('/tasks/' + patch.id, {
            method: 'PATCH',
            body: JSON.stringify(patch),
          })
          loadData()
        } catch (err) {
          console.error(err)
        }
      }

      const handleCreateTask = async (taskData) => {
        try {
          const created = await apiRequest('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData),
          })
          loadData()
          return created
        } catch (err) {
          console.error(err)
          return null
        }
      }

      const handleMoveTaskToFolder = async (taskId, folderName) => {
        try {
          await apiRequest('/tasks/' + taskId, {
            method: 'PATCH',
            body: JSON.stringify({ folder: folderName }),
          })
          loadData()
        } catch (err) {
          console.error(err)
        }
      }

      const handleCreateFolder = async (name, icon) => {
        try {
          await apiRequest('/tasks/folders', {
            method: 'POST',
            body: JSON.stringify({ name, icon }),
          })
          loadData()
        } catch (err) {
          console.error(err)
        }
      }

      const handleUpdateFolderIcon = async (folderName, icon) => {
        try {
          await apiRequest('/tasks/folders/' + encodeURIComponent(folderName), {
            method: 'PATCH',
            body: JSON.stringify({ icon }),
          })
          loadData()
        } catch (err) {
          console.error(err)
        }
      }

      const filteredTasks = tasks.filter((t) => {
        if (activeFolder && t.folder !== activeFolder) return false
        if (filter === 'active' && t.completed) return false
        if (filter === 'completed' && !t.completed) return false
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const inTitle = t.title && t.title.toLowerCase().includes(q)
          const inDesc = t.description && t.description.toLowerCase().includes(q)
          if (!inTitle && !inDesc) return false
        }
        return true
      })

      return h(
        'div',
        { className: 'tt-screen-container' },
        h('style', null, CSS),
        h(
          'div',
          { className: 'tt-screen-head' },
          h(
            'button',
            {
              type: 'button',
              className: 'tt-back-btn',
              title: 'В чат',
              onClick: () => toggle && toggle.set(false),
            },
            h('span', { dangerouslySetInnerHTML: { __html: BACK_ICON } }),
            ' В чат',
          ),
          h(
            'div',
            { className: 'tt-screen-title' },
            h('span', null, 'Задачи'),
            activeFolder
              ? h('span', { style: { fontSize: 13, color: 'var(--dsw-alias-label-secondary)', fontWeight: 400 } }, ' / ' + activeFolder)
              : null,
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
              'Все',
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'tt-filter-btn' + (filter === 'active' ? ' tt-filter-btn-active' : ''),
                onClick: () => setFilter('active'),
              },
              'Не завершенные',
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'tt-filter-btn' + (filter === 'completed' ? ' tt-filter-btn-active' : ''),
                onClick: () => setFilter('completed'),
              },
              'Завершенные',
            ),
          ),
          h('div', { style: { flex: 1 } }),
          h('input', {
            type: 'text',
            className: 'tt-search-input',
            placeholder: 'Поиск…',
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
          }),
          h(
            'button',
            {
              type: 'button',
              className: 'tt-add-main-btn',
              onClick: () => setIsCreateOpen(true),
            },
            '+ Создать',
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'tt-close-btn',
              title: 'Закрыть',
              onClick: () => toggle && toggle.set(false),
            },
            '✕',
          ),
        ),
        h(
          'div',
          { className: 'tt-tasks-main' },
          loading
            ? h('div', { style: { textAlign: 'center', padding: '40px 0', color: 'var(--dsw-alias-label-secondary)', fontSize: 13 } }, 'Загрузка задач…')
            : filteredTasks.length === 0
            ? h(
                'div',
                { style: { textAlign: 'center', padding: '60px 0', color: 'var(--dsw-alias-label-tertiary)', fontSize: 13 } },
                activeFolder ? 'В папке «' + activeFolder + '» нет задач' : 'Нет задач',
              )
            : filteredTasks.map((t) =>
                h(
                  'div',
                  {
                    key: t.id,
                    className: 'tt-task-row',
                    draggable: true,
                    onDragStart: (e) => {
                      e.dataTransfer.setData('text/plain', t.id)
                      e.dataTransfer.effectAllowed = 'move'
                    },
                    onClick: () => setSelectedTask(t),
                  },
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'tt-task-check' + (t.completed ? ' tt-task-check-checked' : ''),
                      title: t.completed ? 'Отметить невыполненной' : 'Отметить выполненной',
                      onClick: (e) => {
                        e.stopPropagation()
                        handleToggleComplete(t)
                      },
                    },
                    t.completed ? '✓' : null,
                  ),
                  h(
                    'span',
                    {
                      className: 'tt-task-title' + (t.completed ? ' tt-task-title-done' : ''),
                      title: t.title,
                    },
                    t.title,
                  ),
                  t.priority > 0
                    ? h(
                        'span',
                        {
                          className: 'tt-task-priority-badge tt-priority-' + t.priority,
                        },
                        t.priority === 3 ? 'Высокий' : t.priority === 2 ? 'Средний' : 'Низкий',
                      )
                    : null,
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'tt-task-action-btn',
                      title: 'Удалить',
                      onClick: (e) => {
                        e.stopPropagation()
                        handleDeleteTask(t.id)
                      },
                    },
                    '✕',
                  ),
                ),
              ),
        ),
        h(BottomFolderShelf, {
          folders,
          activeFolder,
          onSelectFolder: (name) => setActiveFolder(name),
          onCreateFolder: handleCreateFolder,
          onUpdateFolderIcon: handleUpdateFolderIcon,
          onMoveTaskToFolder: handleMoveTaskToFolder,
        }),
        selectedTask
          ? h(TaskDetailModal, {
              task: selectedTask,
              folders,
              onClose: () => setSelectedTask(null),
              onSave: handleSaveTask,
              onDelete: handleDeleteTask,
              onStartChat: (task) => startChatWithAgent(ctx, toggle, task),
            })
          : null,
        isCreateOpen
          ? h(TaskCreateModal, {
              defaultFolder: activeFolder || 'Inbox',
              folders,
              onClose: () => setIsCreateOpen(false),
              onCreate: handleCreateTask,
              onStartChat: (task) => startChatWithAgent(ctx, toggle, task),
            })
          : null,
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
        container.setAttribute('data-dsh-task-tracker-view', '')
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
              'board.back': 'To the chat',
              'board.backHint': 'Close task tracker and return to chat',
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

      if (ctx.slots && typeof ctx.slots.inject === 'function') {
        const injectCard = () => {
          try {
            return ctx.slots.inject('settings.plugin.item', () => {
              try {
                return ctx.slots.register(
                  {
                    name: 'settings.plugin.item',
                    key: NS,
                    locale: NS,
                    inject: () => ({ ctx }),
                  },
                  PluginCard,
                )
              } catch (regErr) {
                console.warn('[dsh-task-tracker] failed to register PluginCard in settings.plugin.item:', regErr && regErr.message)
                throw regErr
              }
            })
          } catch (err) {
            console.warn('[dsh-task-tracker] failed to inject settings.plugin.item:', err && err.message)
            throw err
          }
        }

        if (typeof ctx.effect === 'function') {
          ctx.effect(injectCard, 'dsh-task-tracker: карточка')
        } else {
          injectCard()
        }
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
