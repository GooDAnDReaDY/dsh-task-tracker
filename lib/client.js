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
    // Plugins page row seat (DSH 0.1.6-alpha.2): key = '<package name>#<row id>'.
    const PKG = '@goodandready-private/dsh-task-tracker'
    const ROW_ID = 'dsh-task-tracker'
    const ROW_CONFIG_KEY = PKG + '#' + ROW_ID
    const PANEL_ID = 'dsh-task-tracker'
    const ACTIVATE_EVENT = 'dsh:active-panel'
const DATA_CHANGE_EVENT = 'dsh-task-tracker:data-changed'

function notifyDataChanged() {
  if (typeof document !== 'undefined') {
    try {
      document.dispatchEvent(new CustomEvent(DATA_CHANGE_EVENT))
    } catch (_) { /* bestEffort */ }
  }
}
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
      '.tt-save{appearance:none;font:inherit;cursor:pointer;border:1px solid transparent;border-radius:8px;padding:6px 14px;font-size:13px;font-weight:500;background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-bg-base)}' +
      '.tt-chip-btn{appearance:none;background:0 0;border:0;padding:4px;cursor:pointer;color:var(--dsw-alias-label-secondary);display:flex;align-items:center;position:relative;border-radius:6px;line-height:1}' +
      '.tt-chip-badge{position:absolute;top:-2px;right:-4px;background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-bg-base);font-size:9px;font-weight:700;padding:0 4px;border-radius:10px;line-height:13px;min-width:13px;text-align:center}' +
      '[data-dsh-task-tracker-view]{display:none!important;position:absolute;inset:0;z-index:60;background:var(--dsw-alias-bg-base)}' +
      'html[data-dsh-task-tracker-open] [data-dsh-task-tracker-view]{display:flex!important}' +
      'html[data-dsh-task-tracker-open] [data-pane=conversation]>:not([data-dsh-task-tracker-view]){display:none!important}' +
      'html[data-dsh-task-tracker-open] [class*=centerCol]>:not([data-dsh-task-tracker-view]){display:none!important}' +
      '.tt-screen-container{display:flex;flex-direction:column;width:100%;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);position:relative;overflow:hidden}' +
      '.tt-screen-head{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);flex:none}' +
      '.tt-screen-title{font-size:16px;font-weight:600;display:flex;align-items:center;gap:8px}' +
      '.tt-back-btn{appearance:none;background:transparent;border:0;color:var(--dsw-alias-label-secondary);cursor:pointer;display:inline-flex;align-items:center;gap:4px;font-size:13px;padding:4px 8px;border-radius:6px}' +
      '.tt-search-input{height:30px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);border-radius:6px;padding:0 10px;color:var(--dsw-alias-label-primary);font-size:12px;width:130px;outline:none}' +
      '.tt-add-main-btn{appearance:none;font:inherit;cursor:pointer;border:1px solid transparent;border-radius:8px;padding:4px 12px;font-size:13px;font-weight:500;background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-bg-base);height:30px;display:inline-flex;align-items:center;gap:6px}.tt-quick-add-row{display:flex;align-items:center;gap:8px;padding:4px 0 8px;flex:none}.tt-quick-add-input{flex:1;height:34px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);padding:0 12px;color:var(--dsw-alias-label-primary);font-size:13px;outline:none}.tt-quick-add-btn{appearance:none;font:inherit;cursor:pointer;border:1px solid transparent;border-radius:8px;padding:0 14px;font-size:13px;font-weight:500;background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-bg-base);height:34px;display:inline-flex;align-items:center;gap:6px;flex:none}.tt-empty-box{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 16px;gap:12px;color:var(--dsw-alias-label-tertiary);font-size:13px;text-align:center}.tt-updater-block{margin-top:12px;padding:12px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}.tt-updater-info{font-size:12px;display:flex;align-items:center;gap:8px;color:var(--dsw-alias-label-secondary)}.tt-badge-ok{padding:2px 8px;border-radius:6px;font-size:11px;font-weight:600;background:color-mix(in srgb, var(--dsw-alias-button-primary-fill) 15%, transparent);color:var(--dsw-alias-button-primary-fill)}.tt-badge-warn{padding:2px 8px;border-radius:6px;font-size:11px;font-weight:600;background:color-mix(in srgb, var(--dsw-alias-state-warn-primary) 20%, transparent);color:var(--dsw-alias-state-warn-primary)}.tt-badge-err{padding:2px 8px;border-radius:6px;font-size:11px;font-weight:600;background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 20%, transparent);color:var(--dsw-alias-state-error-primary)}' +
      '.tt-close-btn{appearance:none;background:0 0;border:0;color:var(--dsw-alias-label-secondary);font-size:16px;cursor:pointer;padding:4px 8px;border-radius:6px;line-height:1}' +
      '.tt-filter-group{display:flex;align-items:center;gap:4px;background:var(--dsw-alias-bg-layer-2);padding:2px 4px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2)}' +
      '.tt-filter-btn{background:transparent;border:0;color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:500;padding:3px 8px;border-radius:6px;cursor:pointer;transition:all .15s}' +
      '.tt-filter-btn-active{background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary)}' +
      '.tt-tasks-main{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:12px 16px;display:flex;flex-direction:column;gap:6px}' +
      '.tt-task-row{display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--dsw-alias-bg-layer-3);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;cursor:pointer;transition:border-color .15s, background .15s;user-select:none}' +
      '.tt-task-row:hover{background:color-mix(in srgb, var(--dsw-alias-label-primary) 3%, var(--dsw-alias-bg-layer-3));border-color:color-mix(in srgb, var(--dsw-alias-border-l2) 80%, var(--dsw-alias-label-primary))}' +
      '.tt-task-check{appearance:none;width:16px;height:16px;border:1px solid var(--dsw-alias-border-l2);border-radius:4px;cursor:pointer;background:transparent;display:flex;align-items:center;justify-content:center;flex:none;transition:all .15s}' +
      '.tt-task-check-checked{background:var(--dsw-alias-button-primary-fill);border-color:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-bg-base)}' +
      '.tt-task-title{flex:1;min-width:0;font-size:13px;font-weight:500;color:var(--dsw-alias-label-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
      '.tt-task-title-done{text-decoration:line-through;color:var(--dsw-alias-label-tertiary)}' +
      '.tt-task-priority-badge{font-size:10px;font-weight:600;padding:2px 6px;border-radius:6px;flex:none;text-transform:uppercase}' +
      '.tt-priority-0{display:none}' +
      '.tt-priority-1{background:color-mix(in srgb, var(--dsw-alias-label-secondary) 15%, transparent);color:var(--dsw-alias-label-secondary)}' +
      '.tt-priority-2{background:color-mix(in srgb, var(--dsw-alias-state-warn-primary) 20%, transparent);color:var(--dsw-alias-state-warn-primary)}' +
      '.tt-priority-3{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 20%, transparent);color:var(--dsw-alias-state-error-primary)}' +
      '.tt-task-action-btn{appearance:none;background:0 0;border:0;cursor:pointer;font-size:13px;color:var(--dsw-alias-label-tertiary);padding:4px;border-radius:4px;display:flex;align-items:center;justify-content:center;flex:none}' +
      '.tt-bottom-shelf{flex:none;border-top:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);padding:8px 16px;display:flex;flex-direction:column;gap:6px}' +
      '.tt-shelf-top{display:flex;align-items:center;justify-content:space-between;padding:0 2px}' +
      '.tt-folders-grid{display:flex;flex-wrap:wrap;gap:8px;max-height:124px;overflow-y:auto;align-items:flex-start}' +
      '.tt-folder-tile{width:140px;min-height:52px;max-height:56px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);padding:6px 8px;display:flex;align-items:center;gap:8px;cursor:pointer;position:relative;box-sizing:border-box;user-select:none;transition:border-color .15s, background .15s}' +
      '.tt-folder-tile:hover{background:color-mix(in srgb, var(--dsw-alias-label-primary) 4%, var(--dsw-alias-bg-layer-3))}' +
      '.tt-folder-tile-active{border-color:var(--dsw-alias-button-primary-fill);background:color-mix(in srgb, var(--dsw-alias-button-primary-fill) 12%, var(--dsw-alias-bg-layer-3))}' +
      '.tt-folder-tile-dragover{border-color:var(--dsw-alias-button-primary-fill);box-shadow:0 0 0 2px var(--dsw-alias-button-primary-fill);background:color-mix(in srgb, var(--dsw-alias-button-primary-fill) 20%, var(--dsw-alias-bg-layer-3))}' +
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
      '.tt-start-chat-btn{appearance:none;font:inherit;cursor:pointer;border:1px solid transparent;border-radius:8px;padding:6px 14px;font-size:13px;font-weight:500;background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-bg-base);display:inline-flex;align-items:center;gap:6px}' +
      '.tt-btn-secondary{appearance:none;font:inherit;cursor:pointer;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:6px 14px;font-size:13px;font-weight:500;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}' +
      '.tt-btn-danger{appearance:none;font:inherit;cursor:pointer;border:1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 30%, transparent);border-radius:8px;padding:6px 14px;font-size:13px;font-weight:500;background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 15%, transparent);color:var(--dsw-alias-state-error-primary)}' +
      '.tt-error-banner{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 15%, transparent);color:var(--dsw-alias-state-error-primary);padding:8px 12px;border-radius:6px;font-size:12px}'

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

      const pMap = { 0: 'Normal', 1: 'Low', 2: 'Medium', 3: 'High' }
      const priorityLabel = pMap[task.priority] || 'Normal'
      let prompt = 'Task: ' + (task.title || '')
      if (task.folder) prompt += '\nFolder: ' + task.folder
      prompt += '\nPriority: ' + priorityLabel
      if (task.description && task.description.trim()) {
        prompt += '\n\nDescription:\n' + task.description.trim()
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
      const ctx = props.ctx
      const task = props.task
      const folders = props.folders || []
      const onClose = props.onClose
      const onSave = props.onSave
      const onDelete = props.onDelete
      const onStartChat = props.onStartChat

      const t = (() => {
        try {
          return ctx?.locale?.bind ? ctx.locale.bind(NS) : (k) => k
        } catch (_) {
          return (k) => k
        }
      })()

      const [title, setTitle] = React.useState(task.title || '')
      const [description, setDescription] = React.useState(task.description || '')
      const [folder, setFolder] = React.useState(task.folder || 'Inbox')
      const [priority, setPriority] = React.useState(task.priority || 0)
      const [completed, setCompleted] = React.useState(Boolean(task.completed || task.status === 'completed'))
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
            h('span', { style: { fontWeight: 600, fontSize: 15 } }, t('tasks.modal.title', 'Task')),
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
              h('label', { className: 'tt-sub', style: { marginLeft: 0 } }, t('tasks.form.title', 'Title')),
              h('input', {
                type: 'text',
                className: 'tt-modal-input',
                value: title,
                placeholder: t('tasks.form.titlePlaceholder', 'Task title'),
                onChange: (e) => setTitle(e.target.value),
              }),
            ),
            h(
              'div',
              { className: 'tt-field', style: { marginTop: 0 } },
              h('label', { className: 'tt-sub', style: { marginLeft: 0 } }, t('tasks.form.desc', 'Description')),
              h('textarea', {
                className: 'tt-modal-textarea',
                value: description,
                placeholder: t('tasks.form.descPlaceholder', 'Detailed task description…'),
                onChange: (e) => setDescription(e.target.value),
              }),
            ),
            h(
              'div',
              { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } },
              h(
                'div',
                { className: 'tt-field', style: { marginTop: 0 } },
                h('label', { className: 'tt-sub', style: { marginLeft: 0 } }, t('tasks.form.folder', 'Folder')),
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
                h('label', { className: 'tt-sub', style: { marginLeft: 0 } }, t('tasks.form.priority', 'Priority')),
                h(
                  'select',
                  {
                    className: 'tt-modal-input',
                    value: priority,
                    onChange: (e) => setPriority(Number(e.target.value)),
                  },
                  h('option', { value: 0 }, t('tasks.priority.normal', 'Normal')),
                  h('option', { value: 1 }, t('tasks.priority.low', 'Low')),
                  h('option', { value: 2 }, t('tasks.priority.medium', 'Medium')),
                  h('option', { value: 3 }, t('tasks.priority.high', 'High')),
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
                h('span', null, t('tasks.status.completed', 'Completed')),
              ),
              h('div', { className: 'tt-meta-item' },
                h('span', null, t('tasks.meta.author', 'Author:')),
                h('span', { className: 'tt-meta-badge' }, task.author || 'User'),
              ),
              task.createdAt
                ? h('div', { className: 'tt-meta-item' },
                    h('span', null, t('tasks.meta.created', 'Created:')),
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
              }, t('tasks.delete', 'Delete')),
              h('button', {
                type: 'button',
                className: 'tt-start-chat-btn',
                onClick: () => {
                  if (onStartChat) onStartChat({ ...task, title, description, folder, priority })
                },
              }, '💬 ' + t('tasks.chatWithAgent', 'Chat with agent')),
            ),
            h('div', { style: { display: 'flex', gap: 8 } },
              h('button', {
                type: 'button',
                className: 'tt-btn-secondary',
                onClick: onClose,
              }, t('tasks.close', 'Close')),
              h('button', {
                type: 'button',
                className: 'tt-save',
                disabled: saving || !title.trim(),
                onClick: handleSave,
              }, saving ? t('saving', 'Saving…') : t('save', 'Save')),
            ),
          ),
        ),
      )
    }

                function TaskCreateModal(props) {
      const ctx = props.ctx
      const defaultFolder = props.defaultFolder || 'Inbox'
      const folders = props.folders || []
      const onClose = props.onClose
      const onCreate = props.onCreate
      const onStartChat = props.onStartChat

      const t = (() => {
        try {
          return ctx?.locale?.bind ? ctx.locale.bind(NS) : (k, fb) => fb || k
        } catch (_) {
          return (k, fb) => fb || k
        }
      })()

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
            h('span', { style: { fontWeight: 600, fontSize: 15 } }, t('tasks.newTask', 'New Task')),
            h('button', {
              type: 'button',
              className: 'tt-close-btn',
              onClick: onClose,
            }, '\u2715'),
          ),
          h(
            'div',
            { className: 'tt-modal-body' },
            h(
              'div',
              { className: 'tt-field', style: { marginTop: 0 } },
              h('label', { className: 'tt-sub', style: { marginLeft: 0 } }, t('tasks.titleLabel', 'Title *')),
              h('input', {
                type: 'text',
                className: 'tt-modal-input',
                value: title,
                placeholder: t('tasks.newPlaceholder', 'What needs to be done?'),
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
              h('label', { className: 'tt-sub', style: { marginLeft: 0 } }, t('tasks.description', 'Description')),
              h('textarea', {
                className: 'tt-modal-textarea',
                value: description,
                placeholder: t('tasks.descPlaceholder', 'Detailed task description\u2026'),
                onChange: (e) => setDescription(e.target.value),
              }),
            ),
            h(
              'div',
              { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } },
              h(
                'div',
                { className: 'tt-field', style: { marginTop: 0 } },
                h('label', { className: 'tt-sub', style: { marginLeft: 0 } }, t('tasks.folder', 'Folder')),
                h(
                  'select',
                  {
                    className: 'tt-modal-input',
                    value: folder,
                    onChange: (e) => setFolder(e.target.value),
                  },
                  folders.map((f) =>
                    h('option', { key: f.name, value: f.name }, (f.icon || '\uD83D\uDCC1') + ' ' + f.name),
                  ),
                ),
              ),
              h(
                'div',
                { className: 'tt-field', style: { marginTop: 0 } },
                h('label', { className: 'tt-sub', style: { marginLeft: 0 } }, t('tasks.priority', 'Priority')),
                h(
                  'select',
                  {
                    className: 'tt-modal-input',
                    value: priority,
                    onChange: (e) => setPriority(Number(e.target.value)),
                  },
                  h('option', { value: 0 }, t('tasks.priorityNone', 'Normal')),
                  h('option', { value: 1 }, t('tasks.priorityLow', 'Low')),
                  h('option', { value: 2 }, t('tasks.priorityMedium', 'Medium')),
                  h('option', { value: 3 }, t('tasks.priorityHigh', 'High')),
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
            }, t('tasks.cancel', 'Cancel')),
            h('div', { style: { display: 'flex', gap: 8 } },
              h('button', {
                type: 'button',
                className: 'tt-btn-secondary',
                onClick: handleCreateOnly,
              }, t('tasks.create', '+ Create')),
              h('button', {
                type: 'button',
                className: 'tt-start-chat-btn',
                onClick: handleCreateAndChat,
              }, t('tasks.startChatWithAgent', '\uD83D\uDCAC Start chat with agent')),
            ),
          ),
        ),
      )
    }

    function BottomFolderShelf(props) {
      const ctx = props.ctx
      const folders = props.folders || []
      const activeFolder = props.activeFolder
      const onSelectFolder = props.onSelectFolder
      const onCreateFolder = props.onCreateFolder
      const onUpdateFolderIcon = props.onUpdateFolderIcon
      const onMoveTaskToFolder = props.onMoveTaskToFolder

      const t = (() => {
        try {
          return ctx?.locale?.bind ? ctx.locale.bind(NS) : (k, fb) => fb || k
        } catch (_) {
          return (k, fb) => fb || k
        }
      })()

      const [pickerFolder, setPickerFolder] = React.useState(null)
      const [dragOverFolder, setDragOverFolder] = React.useState(null)

      const handleAddFolder = () => {
        const name = window.prompt ? window.prompt(t('tasks.newFolderPrompt', 'New folder name:')) : null
        if (name && name.trim()) {
          onCreateFolder(name.trim(), '\uD83D\uDCC1')
        }
      }

      return h(
        'div',
        { className: 'tt-bottom-shelf' },
        h(
          'div',
          { className: 'tt-shelf-top' },
          h('span', { style: { fontSize: 12, fontWeight: 600, color: 'var(--dsw-alias-label-secondary)' } },
            t('tasks.folders', 'Folders') + ' (' + folders.length + ')'
          ),
          activeFolder
            ? h('button', {
                type: 'button',
                className: 'tt-btn-secondary',
                style: { padding: '2px 8px', fontSize: 11, height: 22 },
                onClick: () => onSelectFolder(null),
              }, t('tasks.showAllFolders', 'Show all folders'))
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
                title: folder.name + ' (' + (folder.count || 0) + ' ' + t('tasks.tasksCountSuffix', 'tasks') + ')',
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
                  title: t('tasks.changeIcon', 'Change icon'),
                  onClick: (e) => {
                    e.stopPropagation()
                    setPickerFolder(isPickerOpen ? null : folder.name)
                  },
                },
                folder.icon || '\uD83D\uDCC1',
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
              title: t('tasks.createFolder', 'Create folder'),
            },
            h('span', { style: { fontSize: 14, fontWeight: 700 } }, '+'),
            t('tasks.folderBtn', 'Folder'),
          ),
        ),
      )
    }

    function TasksScreen(props) {
      const ctx = props.ctx
      const toggle = props.toggle

      const t = (() => {
        try {
          return ctx?.locale?.bind ? ctx.locale.bind(NS) : (k, fb) => fb || k
        } catch (_) {
          return (k, fb) => fb || k
        }
      })()

      const [tasks, setTasks] = React.useState([])
      const [folders, setFolders] = React.useState([])
      const [activeFolder, setActiveFolder] = React.useState(null)
      const [filter, setFilter] = React.useState('all')
      const [searchQuery, setSearchQuery] = React.useState('')
      const [quickAddTitle, setQuickAddTitle] = React.useState('')
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
            setFolders(folderData.folders.map((f) => (typeof f === 'string' ? { name: f, icon: '\uD83D\uDCC1', count: 0 } : f)))
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

      React.useEffect(() => {
        if (!toggle || typeof toggle.subscribe !== 'function') return
        const unsub = toggle.subscribe((isOpen) => {
          if (isOpen) {
            loadData()
          }
        })
        return unsub
      }, [toggle, loadData])

      React.useEffect(() => {
        const onDataChanged = () => {
          if (toggle && typeof toggle.isOpen === 'function' && toggle.isOpen()) {
            loadData()
          }
        }
        document.addEventListener(DATA_CHANGE_EVENT, onDataChanged)
        return () => {
          document.removeEventListener(DATA_CHANGE_EVENT, onDataChanged)
        }
      }, [toggle, loadData])

      const handleToggleComplete = async (task) => {
        try {
          const isCurrentlyDone = Boolean(task.completed || task.status === 'completed')
          const nextDone = !isCurrentlyDone
          const updated = await apiRequest('/tasks/' + encodeURIComponent(task.id), {
            method: 'PATCH',
            body: {
              completed: nextDone,
              status: nextDone ? 'completed' : 'pending',
            },
          })
          setTasks((prev) => prev.map((tItem) => (tItem.id === task.id ? updated : tItem))); notifyDataChanged()
        } catch (err) {
          console.warn('[dsh-task-tracker] toggle complete error:', err)
        }
      }

      const handleCreateTask = async (taskData) => {
        try {
          const created = await apiRequest('/tasks', {
            method: 'POST',
            body: taskData,
          })
          setTasks((prev) => [created, ...prev])
          loadData()
          notifyDataChanged()
          return created
        } catch (err) {
          console.warn('[dsh-task-tracker] create task error:', err)
        }
      }

      const handleQuickAdd = async () => {
        if (!quickAddTitle.trim()) return
        const val = quickAddTitle.trim()
        setQuickAddTitle('')
        await handleCreateTask({
          title: val,
          description: '',
          folder: activeFolder || 'Inbox',
          priority: 0,
        })
      }

      const handleSaveTask = async (updatedTask) => {
        try {
          const saved = await apiRequest('/tasks/' + encodeURIComponent(updatedTask.id), {
            method: 'PATCH',
            body: updatedTask,
          })
          setTasks((prev) => prev.map((tItem) => (tItem.id === saved.id ? saved : tItem)))
          loadData()
          notifyDataChanged()
        } catch (err) {
          console.warn('[dsh-task-tracker] save task error:', err)
        }
      }

      const handleDeleteTask = async (id) => {
        try {
          await apiRequest('/tasks/' + encodeURIComponent(id), { method: 'DELETE' })
          setTasks((prev) => prev.filter((tItem) => tItem.id !== id))
          if (selectedTask && selectedTask.id === id) setSelectedTask(null)
          loadData()
          notifyDataChanged()
        } catch (err) {
          console.warn('[dsh-task-tracker] delete task error:', err)
        }
      }

      const handleCreateFolder = async (name, icon) => {
        try {
          await apiRequest('/tasks/folders', {
            method: 'POST',
            body: { name, icon: icon || '\uD83D\uDCC1' },
          })
          loadData()
        } catch (err) {
          console.warn('[dsh-task-tracker] create folder error:', err)
        }
      }

      const handleUpdateFolderIcon = async (name, icon) => {
        try {
          await apiRequest('/tasks/folders/' + encodeURIComponent(name), {
            method: 'PATCH',
            body: { icon },
          })
          loadData()
        } catch (err) {
          console.warn('[dsh-task-tracker] update folder icon error:', err)
        }
      }

      const handleMoveTaskToFolder = async (taskId, folderName) => {
        try {
          const updated = await apiRequest('/tasks/' + encodeURIComponent(taskId), {
            method: 'PATCH',
            body: { folder: folderName },
          })
          setTasks((prev) => prev.map((tItem) => (tItem.id === taskId ? updated : tItem)))
          loadData()
        } catch (err) {
          console.warn('[dsh-task-tracker] move task error:', err)
        }
      }

      const filteredTasks = tasks.filter((tItem) => {
        const taskFolder = tItem.folder || 'Inbox'
        if (activeFolder && taskFolder.toLowerCase() !== activeFolder.toLowerCase()) return false
        const isDone = Boolean(tItem.completed || tItem.status === 'completed')
        if (filter === 'active' && isDone) return false
        if (filter === 'completed' && !isDone) return false
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const inTitle = tItem.title && tItem.title.toLowerCase().includes(q)
          const inDesc = tItem.description && tItem.description.toLowerCase().includes(q)
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
              title: t('tasks.backToChat', 'To the chat'),
              onClick: () => toggle && toggle.set(false),
            },
            h('span', { dangerouslySetInnerHTML: { __html: BACK_ICON } }),
            ' ' + t('tasks.backToChat', 'To the chat'),
          ),
          h(
            'div',
            { className: 'tt-screen-title' },
            h('span', null, t('tasks.title', 'Tasks')),
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
              t('tasks.all', 'All'),
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'tt-filter-btn' + (filter === 'active' ? ' tt-filter-btn-active' : ''),
                onClick: () => setFilter('active'),
              },
              t('tasks.active', 'Active'),
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'tt-filter-btn' + (filter === 'completed' ? ' tt-filter-btn-active' : ''),
                onClick: () => setFilter('completed'),
              },
              t('tasks.completed', 'Done'),
            ),
          ),
          h('div', { style: { flex: 1 } }),
          h('input', {
            type: 'text',
            className: 'tt-search-input',
            placeholder: t('tasks.search', 'Search tasks\u2026'),
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
          }),
          h(
            'button',
            {
              type: 'button',
              className: 'tt-btn-secondary tt-refresh-btn',
              style: { height: 32, padding: '0 10px', display: 'flex', alignItems: 'center', gap: 4 },
              title: t('tasks.refresh', 'Refresh'),
              onClick: () => loadData(),
              disabled: loading,
            },
            h('span', { style: { display: 'inline-block' } }, '↻'),
            t('tasks.refresh', 'Refresh'),
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'tt-add-main-btn',
              onClick: () => setIsCreateOpen(true),
            },
            t('tasks.addTask', '+ Add Task'),
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'tt-close-btn',
              title: t('tasks.close', 'Close'),
              onClick: () => toggle && toggle.set(false),
            },
            '\u2715',
          ),
        ),
        h(
          'div',
          { style: { padding: '8px 16px 0' } },
          h(
            'div',
            { className: 'tt-quick-add-row' },
            h('input', {
              type: 'text',
              className: 'tt-quick-add-input',
              placeholder: t('tasks.quickAddPlaceholder', 'What needs to be done? Press Enter to add'),
              value: quickAddTitle,
              onChange: (e) => setQuickAddTitle(e.target.value),
              onKeyDown: (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleQuickAdd()
                }
              },
            }),
            h(
              'button',
              {
                type: 'button',
                className: 'tt-quick-add-btn',
                onClick: handleQuickAdd,
              },
              t('tasks.add', '+ Add'),
            ),
          ),
        ),
        h(
          'div',
          { className: 'tt-tasks-main' },
          loading
            ? h('div', { style: { textAlign: 'center', padding: '40px 0', color: 'var(--dsw-alias-label-secondary)', fontSize: 13 } }, t('tasks.loadingTasks', 'Loading tasks\u2026'))
            : filteredTasks.length === 0
            ? h(
                'div',
                { className: 'tt-empty-box' },
                h('div', { style: { fontSize: 32, marginBottom: 8 } }, '\uD83D\uDCCB'),
                h(
                  'div',
                  { style: { fontSize: 14, fontWeight: 500, color: 'var(--dsw-alias-label-secondary)' } },
                  activeFolder ? t('tasks.emptyInFolder', 'No tasks in folder "%s"').replace('%s', activeFolder) : t('tasks.empty', 'No tasks found'),
                ),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'tt-add-main-btn',
                    style: { marginTop: 8 },
                    onClick: () => setIsCreateOpen(true),
                  },
                  t('tasks.addTask', '+ Add Task'),
                ),
              )
            : filteredTasks.map((tItem) =>
                h(
                  'div',
                  {
                    key: tItem.id,
                    className: 'tt-task-row',
                    draggable: true,
                    onDragStart: (e) => {
                      e.dataTransfer.setData('text/plain', tItem.id)
                      e.dataTransfer.effectAllowed = 'move'
                    },
                    onClick: () => setSelectedTask(tItem),
                  },
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'tt-task-check' + (tItem.completed ? ' tt-task-check-checked' : ''),
                      title: tItem.completed ? t('tasks.markIncomplete', 'Mark as incomplete') : t('tasks.markComplete', 'Mark as completed'),
                      onClick: (e) => {
                        e.stopPropagation()
                        handleToggleComplete(tItem)
                      },
                    },
                    tItem.completed ? '\u2713' : null,
                  ),
                  h(
                    'span',
                    {
                      className: 'tt-task-title' + (tItem.completed ? ' tt-task-title-done' : ''),
                      title: tItem.title,
                    },
                    tItem.title,
                  ),
                  tItem.priority > 0
                    ? h(
                        'span',
                        {
                          className: 'tt-task-priority-badge tt-priority-' + tItem.priority,
                        },
                        tItem.priority === 3 ? t('tasks.priorityHigh', 'High') : tItem.priority === 2 ? t('tasks.priorityMedium', 'Medium') : t('tasks.priorityLow', 'Low'),
                      )
                    : null,
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'tt-task-action-btn',
                      title: t('tasks.delete', 'Delete'),
                      onClick: (e) => {
                        e.stopPropagation()
                        handleDeleteTask(tItem.id)
                      },
                    },
                    '\u2715',
                  ),
                ),
              ),
        ),
        h(BottomFolderShelf, {
          ctx,
          folders,
          activeFolder,
          onSelectFolder: (name) => setActiveFolder(name),
          onCreateFolder: handleCreateFolder,
          onUpdateFolderIcon: handleUpdateFolderIcon,
          onMoveTaskToFolder: handleMoveTaskToFolder,
        }),
        selectedTask
          ? h(TaskDetailModal, {
              ctx,
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
              ctx,
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
        const onDataChanged = () => {
          if (alive) check()
        }
        document.addEventListener(DATA_CHANGE_EVENT, onDataChanged)
        return () => {
          alive = false
          clearInterval(timer)
          document.removeEventListener(DATA_CHANGE_EVENT, onDataChanged)
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
      let observer = null

      const ensure = () => {
        if (container !== null) return
        const column = document.querySelector(COLUMN_SELECTOR)
        if (column === null) return

        container = document.createElement('div')
        container.setAttribute('data-dsh-plugin', 'dsh-task-tracker')
        container.setAttribute('data-dsh-task-tracker-view', '')
        container.style.display = toggle.isOpen() ? 'flex' : 'none'
        column.appendChild(container)

        if (ReactDOM && typeof ReactDOM.createRoot === 'function') {
          root = ReactDOM.createRoot(container)
          root.render(h(TasksScreen, { ctx, toggle }))
        }

        if (observer) {
          observer.disconnect()
          observer = null
        }
      }

      const applyActive = () => {
        if (toggle.isOpen()) {
          if (container) container.style.display = 'flex'
          document.documentElement.setAttribute('data-dsh-task-tracker-open', '')
          document.dispatchEvent(new CustomEvent(ACTIVATE_EVENT, { detail: PANEL_ID }))
        } else {
          if (container) container.style.display = 'none'
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

      observer = new MutationObserver(ensure)
      observer.observe(document.body, { childList: true, subtree: true })
      document.addEventListener(ACTIVATE_EVENT, onOtherActivate)
      document.addEventListener('keydown', onKeyDown)
      const unsub = toggle.subscribe(applyActive)
      ensure()

      return () => {
        if (observer) {
          observer.disconnect()
          observer = null
        }
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
      let observer = null

      const tryPlace = () => {
        if (document.querySelector('[data-dsh-part="task-tracker-sidebar"]')) {
          if (observer) {
            observer.disconnect()
            observer = null
          }
          return
        }
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
        if (observer) {
          observer.disconnect()
          observer = null
        }
      }

      observer = new MutationObserver(tryPlace)
      observer.observe(document.body, { childList: true, subtree: true })
      tryPlace()

      return () => {
        if (observer) {
          observer.disconnect()
          observer = null
        }
        if (entry && entry.remove) entry.remove()
      }
    }

                function PluginCard(props) {
      const ctx = props.ctx
      const [expanded, setExpanded] = React.useState(false)
      const [snap, setSnap] = React.useState({
        status: 'loading',
        value: null,
        writable: true,
      })
      const [draft, setDraft] = React.useState({
        filePath: '',
      })
      const [saving, setSaving] = React.useState(false)
      const [msg, setMsg] = React.useState('')

      const [updateState, setUpdateState] = React.useState({
        checking: true,
        updating: false,
        currentVersion: '',
        latestVersion: '',
        updateAvailable: false,
        error: '',
        notice: '',
      })

      const initializedRef = React.useRef(false)

      React.useEffect(() => {
        let off = null
        try {
          const scope = ctx.configForms && ctx.configForms.get
            ? ctx.configForms.get(NS)
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
          return ctx.locale && ctx.locale.bind ? ctx.locale.bind(NS) : (k, fb) => fb || k
        } catch (_) {
          return (k, fb) => fb || k
        }
      })()

      React.useEffect(() => {
        let alive = true
        ;(async () => {
          try {
            const res = await fetch('/dsh-task-tracker/api/updater')
            if (!res.ok) throw new Error('HTTP ' + res.status)
            const data = await res.json()
            if (!alive) return
            setUpdateState((s) => ({
              ...s,
              checking: false,
              currentVersion: data.currentVersion || '',
              latestVersion: data.latestVersion || '',
              updateAvailable: Boolean(data.updateAvailable),
            }))
          } catch (_) {
            if (!alive) return
            setUpdateState((s) => ({
              ...s,
              checking: false,
              error: t('updater.checkFailed', 'Failed to check updates'),
            }))
          }
        })()
        return () => { alive = false }
      }, [])

      const onTriggerUpdate = async () => {
        if (updateState.updating) return
        setUpdateState((s) => ({ ...s, updating: true, error: '', notice: '' }))
        try {
          const res = await fetch('/dsh-task-tracker/api/updater', {
            method: 'POST',
            headers: { 'x-dsh-plugin-update': '1' },
          })
          const data = await res.json()
          if (!res.ok || data.error) throw new Error(data.error || ('HTTP ' + res.status))
          const newVer = data.updatedVersion || updateState.latestVersion
          setUpdateState((s) => ({
            ...s,
            updating: false,
            updateAvailable: false,
            currentVersion: newVer,
            notice: (t('updater.updated', 'Successfully updated to v{v}. Restart harness to apply.')).replace('{v}', newVer),
          }))
        } catch (err) {
          setUpdateState((s) => ({
            ...s,
            updating: false,
            error: (t('updater.updateFailed', 'Update failed') + ': ' + (err?.message || err)),
          }))
        }
      }

      const onSave = async () => {
        setSaving(true)
        setMsg('')
        try {
          if (!ctx.configForms || !ctx.configForms.get) {
            setMsg(t('unavailable', 'Settings scope unavailable'))
            setSaving(false)
            return
          }
          const scope = ctx.configForms.get(NS)
          const errs = []
          try {
            await scope.set('filePath', draft.filePath ?? '')
          } catch (e) {
            errs.push('filePath: ' + (e && e.message ? e.message : String(e)))
          }
          setMsg(errs.length ? errs.join('; ') : t('saved', 'Saved'))
        } catch (e) {
          setMsg(String(e && e.message ? e.message : e))
        }
        setSaving(false)
      }

      // Row seat (plugins.row.config): the host page draws title/icon/crumb and the
      // padding, so the summary is a one-liner and the page drops our card chrome.
      if (props && props.view === 'summary') {
        return h('span', { className: 'tt-sub' }, t('subtitle', 'Local JSON todo store (~/.dsh/task-tracker/tasks.json)'))
      }
      const page = !!(props && props.view === 'page')

      return h(
        page ? 'div' : 'li',
        { className: page ? 'tt-page' : 'tt-card' },
        h('style', null, CSS),
        h(
          'button',
          {
            type: 'button',
            className: 'tt-head',
            style: page ? { display: 'none' } : undefined,
            onClick: () => setExpanded(!expanded),
            'aria-expanded': page ? true : expanded,
          },
          h('span', { className: 'tt-title' }, t('title', 'Task Tracker')),
          h('span', { className: 'tt-sub' }, t('subtitle', 'Local JSON todo store (~/.dsh/task-tracker/tasks.json)')),
          h(Chevron, {
            className: 'tt-chev' + (expanded ? ' tt-chev-open' : ''),
          }),
        ),
        page || expanded
          ? h(
              'div',
              { className: 'tt-body' },
              h(
                'div',
                { className: 'tt-updater-block' },
                h(
                  'div',
                  { className: 'tt-updater-info' },
                  h('span', null, t('updater.version', 'Version') + ': ' + (updateState.currentVersion || (updateState.checking ? '\u2026' : '\u2014'))),
                  updateState.checking ? h('span', null, t('updater.checking', 'Checking for updates\u2026')) : null,
                  !updateState.checking && updateState.updateAvailable
                    ? h('span', { className: 'tt-badge-warn' }, (t('updater.available', 'Update available: v{v}')).replace('{v}', updateState.latestVersion))
                    : null,
                  !updateState.checking && !updateState.updateAvailable && !updateState.error
                    ? h('span', { className: 'tt-badge-ok' }, '\u2713 ' + t('updater.upToDate', 'Up to date'))
                    : null,
                  updateState.error ? h('span', { className: 'tt-badge-err' }, updateState.error) : null,
                ),
                updateState.updateAvailable
                  ? h(
                      'button',
                      {
                        type: 'button',
                        className: 'tt-save',
                        onClick: onTriggerUpdate,
                        disabled: updateState.updating,
                      },
                      updateState.updating ? t('updater.updating', 'Updating\u2026') : t('updater.updateNow', 'Update now'),
                    )
                  : null,
              ),
              updateState.notice
                ? h('div', { style: { marginTop: 6, fontSize: 12, color: 'var(--dsw-alias-button-primary-fill)' } }, updateState.notice)
                : null,
              snap.status === 'loading'
                ? h(
                    'div',
                    { className: 'tt-field', style: { color: 'var(--dsw-alias-label-secondary)', fontSize: 13 } },
                    t('loading', 'Loading\u2026'),
                  )
                : null,
              snap.status === 'unavailable'
                ? h(
                    'div',
                    { className: 'tt-field', style: { color: 'var(--dsw-alias-label-secondary)', fontSize: 13 } },
                    t('unavailable', 'Settings scope unavailable'),
                  )
                : null,
              snap.status === 'ready'
                ? h(
                    'div',
                    null,
                    h(
                      'div',
                      { className: 'tt-field' },
                      h('label', { className: 'tt-sub' }, t('field.filePath', 'Custom tasks JSON storage path (optional)')),
                      h('input', {
                        className: 'tt-input',
                        type: 'text',
                        value: draft.filePath,
                        placeholder: t('field.filePathPlaceholder', '~/.dsh/task-tracker/tasks.json'),
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
                        saving ? t('saving', 'Saving\u2026') : t('save', 'Save'),
                      ),
                    ),
                  )
                : null,
            )
          : null,
      )
    }

    module.exports.inject = ['slots', 'locale', 'configForms']
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
              loading: 'Loading\u2026',
              unavailable: 'Settings scope unavailable',
              save: 'Save',
              saving: 'Saving\u2026',
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
              'tasks.refresh': 'Refresh',
              'tasks.search': 'Search tasks\u2026',
              'tasks.newPlaceholder': 'What needs to be done?',
              'tasks.add': 'Add Task',
              'tasks.addTask': '+ Add Task',
              'tasks.empty': 'No tasks found',
              'tasks.emptyInFolder': 'No tasks in folder "%s"',
              'tasks.delete': 'Delete task',
              'tasks.close': 'Close',
              'tasks.backToChat': 'To the chat',
              'tasks.quickAddPlaceholder': 'What needs to be done? Press Enter to add',
              'tasks.loadingTasks': 'Loading tasks\u2026',
              'tasks.markIncomplete': 'Mark as incomplete',
              'tasks.markComplete': 'Mark as completed',
              'tasks.priorityNone': 'Normal',
              'tasks.priorityLow': 'Low',
              'tasks.priorityMedium': 'Medium',
              'tasks.priorityHigh': 'High',
              'tasks.newTask': 'New Task',
              'tasks.titleLabel': 'Title *',
              'tasks.description': 'Description',
              'tasks.descPlaceholder': 'Detailed task description\u2026',
              'tasks.folder': 'Folder',
              'tasks.priority': 'Priority',
              'tasks.cancel': 'Cancel',
              'tasks.create': '+ Create',
              'tasks.startChatWithAgent': '\uD83D\uDCAC Start chat with agent',
              'tasks.newFolderPrompt': 'New folder name:',
              'tasks.folders': 'Folders',
              'tasks.showAllFolders': 'Show all folders',
              'tasks.tasksCountSuffix': 'tasks',
              'tasks.changeIcon': 'Change icon',
              'tasks.createFolder': 'Create folder',
              'tasks.folderBtn': 'Folder',
              'tasks.taskDetails': 'Task Details',
              'tasks.status': 'Status',
              'tasks.statusCompleted': 'Completed',
              'tasks.statusActive': 'Active',
              'tasks.promptTemplate': 'Prompt template',
              'tasks.openAgentChat': '\uD83D\uDCAC Chat with agent about this task',
              'tasks.confirmDelete': 'Delete this task?',
              'updater.version': 'Version',
              'updater.checking': 'Checking for updates\u2026',
              'updater.available': 'Update available: v{v}',
              'updater.upToDate': 'Up to date',
              'updater.updateNow': 'Update now',
              'updater.updating': 'Updating\u2026',
              'updater.updated': 'Successfully updated to v{v}. Restart harness to apply.',
              'updater.checkFailed': 'Failed to check updates',
              'updater.updateFailed': 'Update failed',
            },
            zh: {
              title: '\u4efb\u52a1\u8ffd\u8e2a\u5668',
              subtitle: '\u672c\u5730 JSON \u5f85\u529e\u5b58\u50a8 (~/.dsh/task-tracker/tasks.json)',
              'board.back': '\u8fd4\u56de\u804a\u5929',
              'board.backHint': '\u5173\u95ed\u4efb\u52a1\u8ffd\u8e2a\u5668\u5e76\u8fd4\u56de\u804a\u5929',
              'field.filePath': '\u81ea\u5b9a\u4e49\u4efb\u52a1 JSON \u5b58\u50a8\u8def\u5f84\uff08\u53ef\u9009\uff09',
              'field.filePathPlaceholder': '~/.dsh/task-tracker/tasks.json',
              loading: '\u52a0\u8f7d\u4e2d\u2026',
              unavailable: '\u8bbe\u7f6e\u4f5c\u7528\u57df\u4e0d\u53ef\u7528',
              save: '\u4fdd\u5b58',
              saving: '\u4fdd\u5b58\u4e2d\u2026',
              saved: '\u5df2\u4fdd\u5b58',
              'field.base': 'API \u57fa\u7840 URL',
              'field.user': 'Basic \u8ba4\u8bc1\u7528\u6237\u540d',
              'field.pass': 'Basic \u8ba4\u8bc1\u5bc6\u7801',
              'field.passFile': '\u5bc6\u7801\u6587\u4ef6\uff08\u53ef\u9009\uff09',
              passPlaceholder: '\u7559\u7a7a\u4ee5\u4fdd\u6301\u5f53\u524d\u5bc6\u7801',
              passHint: '\u673a\u5bc6\u5b57\u6bb5\uff1a\u6d4f\u89c8\u5668\u4e0d\u4f1a\u56de\u663e\u5df2\u5b58\u50a8\u7684\u5bc6\u7801\u3002',
              'tasks.title': '\u4efb\u52a1',
              'tasks.all': '\u5168\u90e8',
              'tasks.active': '\u8fdb\u884c\u4e2d',
              'tasks.completed': '\u5df2\u5b8c\u6210',
              'tasks.refresh': '\u5237\u65b0',
              'tasks.search': '\u641c\u7d22\u4efb\u52a1\u2026',
              'tasks.newPlaceholder': '\u9700\u8981\u505a\u4ec0\u4e48\uff1f',
              'tasks.add': '\u6dfb\u52a0\u4efb\u52a1',
              'tasks.addTask': '+ \u6dfb\u52a0\u4efb\u52a1',
              'tasks.empty': '\u6682\u65e0\u4efb\u52a1',
              'tasks.emptyInFolder': '\u6587\u4ef6\u5939\u300c%s\u300d\u4e2d\u6ca1\u6709\u4efb\u52a1',
              'tasks.delete': '\u5220\u9664\u4efb\u52a1',
              'tasks.close': '\u5173\u95ed',
              'tasks.backToChat': '\u8fd4\u56de\u804a\u5929',
              'tasks.quickAddPlaceholder': '\u9700\u8981\u505a\u4ec0\u4e48\uff1f\u6309\u56de\u8f66\u6dfb\u52a0',
              'tasks.loadingTasks': '\u6b63\u5728\u52a0\u8f7d\u4efb\u52a1\u2026',
              'tasks.markIncomplete': '\u6807\u8bb0\u4e3a\u672a\u5b8c\u6210',
              'tasks.markComplete': '\u6807\u8bb0\u4e3a\u5df2\u5b8c\u6210',
              'tasks.priorityNone': '\u666e\u901a',
              'tasks.priorityLow': '\u4f4e',
              'tasks.priorityMedium': '\u4e2d',
              'tasks.priorityHigh': '\u9ad8',
              'tasks.newTask': '\u65b0\u5efa\u4efb\u52a1',
              'tasks.titleLabel': '\u6807\u9898 *',
              'tasks.description': '\u63cf\u8ff0',
              'tasks.descPlaceholder': '\u4efb\u52a1\u8be6\u7ec6\u63cf\u8ff0\u2026',
              'tasks.folder': '\u6587\u4ef6\u5939',
              'tasks.priority': '\u4f18\u5148\u7ea7',
              'tasks.cancel': '\u53d6\u6d88',
              'tasks.create': '+ \u521b\u5efa',
              'tasks.startChatWithAgent': '\uD83D\uDCAC \u4e0e\u667a\u80fd\u4f53\u5f00\u59cb\u5bf9\u8bdd',
              'tasks.newFolderPrompt': '\u65b0\u6587\u4ef6\u5939\u540d\u79f0\uff1a',
              'tasks.folders': '\u6587\u4ef6\u5939',
              'tasks.showAllFolders': '\u663e\u793a\u6240\u6709\u6587\u4ef6\u5939',
              'tasks.tasksCountSuffix': '\u4e2a\u4efb\u52a1',
              'tasks.changeIcon': '\u66f4\u6362\u56fe\u6807',
              'tasks.createFolder': '\u65b0\u5efa\u6587\u4ef6\u5939',
              'tasks.folderBtn': '\u6587\u4ef6\u5939',
              'tasks.taskDetails': '\u4efb\u52a1\u8be6\u60c5',
              'tasks.status': '\u72b6\u6001',
              'tasks.statusCompleted': '\u5df2\u5b8c\u6210',
              'tasks.statusActive': '\u8fdb\u884c\u4e2d',
              'tasks.promptTemplate': '\u63d0\u793a\u8bcd\u6a21\u677f',
              'tasks.openAgentChat': '\uD83D\uDCAC \u5c31\u6b64\u4efb\u52a1\u4e0e\u667a\u80fd\u4f53\u5bf9\u8bdd',
              'tasks.confirmDelete': '\u5220\u9664\u6b64\u4efb\u52a1\uff1f',
              'updater.version': '\u7248\u672c',
              'updater.checking': '\u6b63\u5728\u68c0\u67e5\u66f4\u65b0\u2026',
              'updater.available': '\u53d1\u73b0\u65b0\u7248\u672c\uff1av{v}',
              'updater.upToDate': '\u5df2\u662f\u6700\u65b0\u7248\u672c',
              'updater.updateNow': '\u7acb\u5373\u66f4\u65b0',
              'updater.updating': '\u6b63\u5728\u66f4\u65b0\u2026',
              'updater.updated': '\u5df2\u6210\u529f\u66f4\u65b0\u81f3 v{v}\u3002\u91cd\u542f harness \u751f\u6548\u3002',
              'updater.checkFailed': '\u68c0\u67e5\u66f4\u65b0\u5931\u8d25',
              'updater.updateFailed': '\u66f4\u65b0\u5931\u8d25',
            },
          })

        if (typeof ctx.effect === 'function') {
          ctx.effect(registerLocale, 'dsh-task-tracker: locale dictionaries')
        } else {
          registerLocale()
        }
      }

      if (ctx.slots && typeof ctx.slots.inject === 'function') {
        const injectCard = (slotName, key) => () => {
          try {
            return ctx.slots.inject(slotName, () => {
              try {
                return ctx.slots.register(
                  {
                    name: slotName,
                    key,
                    locale: NS,
                    inject: () => ({ ctx }),
                  },
                  PluginCard,
                )
              } catch (regErr) {
                console.warn('[dsh-task-tracker] failed to register PluginCard in ' + slotName + ':', regErr && regErr.message)
                throw regErr
              }
            })
          } catch (err) {
            console.warn('[dsh-task-tracker] failed to inject ' + slotName + ':', err && err.message)
            throw err
          }
        }

        // Plugin-list seat (plugins.item): the seat the current core (0.1.6-alpha.2)
        // renders as the plugin's own page with its configuration. It takes an id and a
        // static label instead of a key, so it is mounted on its own; the label must not
        // read the locale, because it is resolved while the page renders.
        const seatItem = () => {
          try {
            return ctx.slots.inject('plugins.item', () => {
              try {
                return ctx.slots.register(
                  {
                    name: 'plugins.item',
                    id: ROW_ID,
                    order: 60,
                    label: () => 'Task Tracker',
                    locale: NS,
                    inject: () => ({ ctx }),
                  },
                  PluginCard,
                )
              } catch (regErr) {
                console.warn('[dsh-task-tracker] failed to register PluginCard in plugins.item:', regErr && regErr.message)
                throw regErr
              }
            })
          } catch (err) {
            console.warn('[dsh-task-tracker] failed to inject plugins.item:', err && err.message)
            throw err
          }
        }

        // Plugin-list seat first, then the row seat and the legacy seat as fallbacks.
        const seatRow = injectCard('plugins.row.config', ROW_CONFIG_KEY)
        const seatLegacy = injectCard('settings.plugin.item', NS)

        if (typeof ctx.effect === 'function') {
          ctx.effect(seatItem, 'dsh-task-tracker: settings list seat')
          ctx.effect(seatRow, 'dsh-task-tracker: settings row seat')
          ctx.effect(seatLegacy, 'dsh-task-tracker: settings card')
        } else {
          seatItem()
          seatRow()
          seatLegacy()
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
