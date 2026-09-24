import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { homedir } from 'node:os';
import { createRequire } from 'node:module';

export function getDefaultFilePath() {
  if (process.env.DSH_TASK_TRACKER_FILE) {
    return resolve(process.env.DSH_TASK_TRACKER_FILE);
  }
  const dshHome = process.env.DSH_HOME || join(homedir(), '.dsh');
  return join(dshHome, 'task-tracker', 'tasks.json');
}

export function generateTaskId() {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${ts}${rand}`;
}

function loadSqlite() {
  try {
    const require = createRequire(import.meta.url);
    return require('node:sqlite');
  } catch {
    return null;
  }
}

export class TaskStore {
  constructor(options = {}) {
    this.filePath = options.filePath ? resolve(options.filePath) : getDefaultFilePath();
    this.legacyDbPath = options.legacyDbPath !== undefined ? options.legacyDbPath : (process.env.DSH_TASK_TRACKER_LEGACY_DB || null);
    this.tasks = [];
    this.folders = [];
    this.lastMtime = 0;
    this.init();
  }

  init() {
    if (!existsSync(this.filePath)) {
      // Check if we can migrate from legacy sqlite DB
      const imported = this.tryImportLegacy();
      if (!imported) {
        this.tasks = [];
        this.save();
      }
    } else {
      this.load();
    }
  }

  tryImportLegacy() {
    if (!this.legacyDbPath || !existsSync(this.legacyDbPath)) {
      return false;
    }
    try {
      const sqlite = loadSqlite();
      if (!sqlite || !sqlite.DatabaseSync) return false;
      const db = new sqlite.DatabaseSync(this.legacyDbPath, { open: true, readOnly: true });
      const rows = db.prepare('SELECT id, title, description, status, priority, created_at, updated_at, completed_at FROM tasks ORDER BY created_at ASC').all();
      this.tasks = rows.map((r) => ({
        id: String(r.id),
        title: String(r.title || ''),
        description: String(r.description || ''),
        status: (r.status === 'completed' || r.status === 'resolved') ? 'completed' : 'pending',
        priority: Number(r.priority) || 0,
        createdAt: r.created_at || new Date().toISOString(),
        updatedAt: r.updated_at || r.created_at || new Date().toISOString(),
        completedAt: r.completed_at || null,
      }));
      this.save();
      return true;
    } catch {
      return false;
    }
  }

  load(providedStat = null) {
    try {
      const stat = providedStat || statSync(this.filePath);
      if (stat.mtimeMs === this.lastMtime) {
        return;
      }
      const raw = readFileSync(this.filePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.tasks = parsed;
        this.folders = [];
        this.lastMtime = stat.mtimeMs;
      } else if (parsed && typeof parsed === 'object') {
        this.tasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];
        const rawFolders = Array.isArray(parsed.folders) ? parsed.folders : [];
        this.folders = rawFolders.map((f) => {
          if (typeof f === 'string') {
            return { name: f.trim(), icon: f.trim() === 'Inbox' ? '📥' : '📁' };
          }
          if (f && typeof f === 'object' && f.name) {
            return { name: String(f.name).trim(), icon: String(f.icon || '📁').trim() || '📁' };
          }
          return null;
        }).filter(Boolean);
        this.lastMtime = stat.mtimeMs;
      } else {
        this.tasks = [];
        this.folders = [];
        this.lastMtime = stat.mtimeMs;
      }
      this.ensureDefaultFolders();
    } catch (err) {
      if (err.code !== 'ENOENT') {
        // Corrupted file or permission issue: keep in-memory tasks
      }
    }
  }

  ensureDefaultFolders() {
    if (!Array.isArray(this.folders)) this.folders = [];
    if (!this.folders.some((f) => f.name === 'Inbox')) {
      this.folders.unshift({ name: 'Inbox', icon: '📥' });
    }
    // Also discover any folders referenced by existing tasks
    for (const t of this.tasks) {
      if (t.folder) {
        const fn = String(t.folder).trim();
        if (fn && !this.folders.some((f) => f.name === fn)) {
          this.folders.push({ name: fn, icon: '📁' });
        }
      }
    }
  }

  save() {
    mkdirSync(dirname(this.filePath), { recursive: true });
    const tmp = `${this.filePath}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}.tmp`;
    const payload = JSON.stringify({
      version: 2,
      folders: this.folders || [],
      tasks: this.tasks || [],
    }, null, 2);
    writeFileSync(tmp, payload, 'utf8');
    renameSync(tmp, this.filePath);
    try {
      this.lastMtime = statSync(this.filePath).mtimeMs;
    } catch {
      this.lastMtime = Date.now();
    }
  }

  ensureFresh() {
    try {
      const stat = statSync(this.filePath);
      if (stat.mtimeMs !== this.lastMtime) {
        this.load(stat);
      }
    } catch {
      // ignore
    }
  }

  list(filter = {}) {
    this.ensureFresh();
    let res = [...this.tasks];

    if (filter.status) {
      const s = String(filter.status).toLowerCase();
      res = res.filter((t) => (t.status || 'pending').toLowerCase() === s);
    }

    if (filter.folder !== undefined && filter.folder !== '') {
      const f = String(filter.folder);
      res = res.filter((t) => (t.folder || 'Inbox') === f);
    }

    if (filter.query) {
      const q = String(filter.query).toLowerCase();
      res = res.filter((t) =>
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Default sorting: pending first, then by priority desc, then by createdAt desc
    res.sort((a, b) => {
      const aDone = a.status === 'completed' ? 1 : 0;
      const bDone = b.status === 'completed' ? 1 : 0;
      if (aDone !== bDone) return aDone - bDone;
      const prioDiff = (Number(b.priority) || 0) - (Number(a.priority) || 0);
      if (prioDiff !== 0) return prioDiff;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });

    const offset = Math.max(Number(filter.offset) || 0, 0);
    const limit = filter.limit !== undefined ? Math.max(Number(filter.limit) || 0, 0) : undefined;

    if (offset > 0) {
      res = res.slice(offset);
    }
    if (limit !== undefined && limit > 0) {
      res = res.slice(0, limit);
    }

    return res;
  }

  get(id) {
    this.ensureFresh();
    const targetId = String(id);
    return this.tasks.find((t) => t.id === targetId) || null;
  }

  create({ title, description = '', priority = 0, status = 'pending', folder = 'Inbox', author = 'User' }) {
    this.ensureFresh();
    const cleanTitle = String(title || '').trim();
    if (!cleanTitle) {
      throw new Error('Title is required');
    }

    const cleanFolder = String(folder || 'Inbox').trim() || 'Inbox';
    if (!this.folders.some((f) => f.name === cleanFolder)) {
      this.folders.push({ name: cleanFolder, icon: '📁' });
    }

    const now = new Date().toISOString();
    const task = {
      id: generateTaskId(),
      title: cleanTitle,
      description: String(description || '').trim(),
      priority: Number(priority) || 0,
      status: status === 'completed' ? 'completed' : 'pending',
      folder: cleanFolder,
      author: String(author || 'User').trim() || 'User',
      createdAt: now,
      updatedAt: now,
      completedAt: status === 'completed' ? now : null,
    };

    this.tasks.push(task);
    this.save();
    return task;
  }

  update(id, patch = {}) {
    this.ensureFresh();
    const targetId = String(id);
    const task = this.tasks.find((t) => t.id === targetId);
    if (!task) {
      return null;
    }

    const now = new Date().toISOString();
    if (patch.title !== undefined) {
      const t = String(patch.title).trim();
      if (!t) throw new Error('Title cannot be empty');
      task.title = t;
    }
    if (patch.folder !== undefined) {
      const f = String(patch.folder || 'Inbox').trim() || 'Inbox';
      task.folder = f;
      if (!this.folders.some((item) => item.name === f)) {
        this.folders.push({ name: f, icon: '📁' });
      }
    }
    if (patch.author !== undefined) {
      task.author = String(patch.author || 'User').trim() || 'User';
    }
    if (patch.description !== undefined) {
      task.description = String(patch.description).trim();
    }
    if (patch.priority !== undefined) {
      task.priority = Number(patch.priority) || 0;
    }
    if (patch.status !== undefined) {
      const prev = task.status;
      const next = patch.status === 'completed' ? 'completed' : 'pending';
      task.status = next;
      if (next === 'completed' && prev !== 'completed') {
        task.completedAt = now;
      } else if (next !== 'completed') {
        task.completedAt = null;
      }
    }

    task.updatedAt = now;
    this.save();
    return task;
  }

  delete(id) {
    this.ensureFresh();
    const targetId = String(id);
    const idx = this.tasks.findIndex((t) => t.id === targetId);
    if (idx === -1) {
      return false;
    }
    this.tasks.splice(idx, 1);
    this.save();
    return true;
  }

  listFolders() {
    this.ensureFresh();
    this.ensureDefaultFolders();
    return this.folders.map((f) => f.name);
  }

  getFolders() {
    this.ensureFresh();
    this.ensureDefaultFolders();
    const counts = {};
    for (const t of this.tasks) {
      if (t.status !== 'completed') {
        const fn = String(t.folder || 'Inbox').trim() || 'Inbox';
        counts[fn] = (counts[fn] || 0) + 1;
      }
    }
    return this.folders.map((f) => ({
      name: f.name,
      icon: f.icon || (f.name === 'Inbox' ? '📥' : '📁'),
      count: counts[f.name] || 0,
    }));
  }

  addFolder(name, icon = '📁') {
    this.ensureFresh();
    this.ensureDefaultFolders();
    const clean = String(name || '').trim();
    if (!clean) throw new Error('Folder name is required');
    const cleanIcon = String(icon || '📁').trim() || '📁';
    const existing = this.folders.find((f) => f.name.toLowerCase() === clean.toLowerCase());
    if (!existing) {
      this.folders.push({ name: clean, icon: cleanIcon });
      this.save();
    } else if (icon && existing.icon !== cleanIcon) {
      existing.icon = cleanIcon;
      this.save();
    }
    return this.listFolders();
  }

  updateFolder(name, patch = {}) {
    this.ensureFresh();
    this.ensureDefaultFolders();
    const clean = String(name || '').trim();
    const folder = this.folders.find((f) => f.name === clean);
    if (!folder) return null;
    if (patch.icon !== undefined) {
      folder.icon = String(patch.icon || '📁').trim() || '📁';
    }
    if (patch.name !== undefined) {
      const newName = String(patch.name || '').trim();
      if (newName && newName !== clean) {
        folder.name = newName;
        for (const t of this.tasks) {
          if (t.folder === clean) {
            t.folder = newName;
            t.updatedAt = new Date().toISOString();
          }
        }
      }
    }
    this.save();
    return folder;
  }

  removeFolder(name) {
    this.ensureFresh();
    this.ensureDefaultFolders();
    const clean = String(name || '').trim();
    if (!clean || clean === 'Inbox') return false;
    this.folders = this.folders.filter((f) => f.name !== clean);
    for (const t of this.tasks) {
      if (t.folder === clean) {
        t.folder = 'Inbox';
        t.updatedAt = new Date().toISOString();
      }
    }
    this.save();
    return true;
  }

  stats() {
    this.ensureFresh();
    let total = this.tasks.length;
    let pending = 0;
    let completed = 0;
    for (const t of this.tasks) {
      if (t.status === 'completed') {
        completed++;
      } else {
        pending++;
      }
    }
    return { total, pending, completed };
  }
}
