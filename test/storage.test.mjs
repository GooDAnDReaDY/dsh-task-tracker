import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { TaskStore, generateTaskId } from '../lib/storage.js';

test('storage: CRUD operations work with in-memory state and JSON file', () => {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-task-test-'));
  const filePath = join(dir, 'tasks.json');

  try {
    const store = new TaskStore({ filePath, legacyDbPath: null });
    assert.deepEqual(store.list(), []);
    assert.deepEqual(store.stats(), { total: 0, pending: 0, completed: 0 });

    // Create tasks
    const t1 = store.create({ title: 'Task 1', description: 'Desc 1', priority: 1 });
    assert.ok(t1.id);
    assert.equal(t1.title, 'Task 1');
    assert.equal(t1.status, 'pending');
    assert.equal(t1.priority, 1);

    const t2 = store.create({ title: 'Task 2', priority: 3 });
    assert.ok(t2.id);

    // List and Stats
    assert.equal(store.list().length, 2);
    // Task 2 has priority 3, so it should be first
    assert.equal(store.list()[0].id, t2.id);
    assert.deepEqual(store.stats(), { total: 2, pending: 2, completed: 0 });

    // Get
    const found = store.get(t1.id);
    assert.equal(found.title, 'Task 1');
    assert.equal(store.get('non-existent'), null);

    // Update
    const updated = store.update(t1.id, { status: 'completed', description: 'Updated desc' });
    assert.equal(updated.status, 'completed');
    assert.equal(updated.description, 'Updated desc');
    assert.ok(updated.completedAt);
    assert.deepEqual(store.stats(), { total: 2, pending: 1, completed: 1 });

    // Filter by status
    assert.equal(store.list({ status: 'pending' }).length, 1);
    assert.equal(store.list({ status: 'completed' }).length, 1);

    // Search query
    assert.equal(store.list({ query: 'Updated' }).length, 1);
    assert.equal(store.list({ query: 'Task 2' }).length, 1);
    assert.equal(store.list({ query: 'non-existent' }).length, 0);

    // Verify persistence by reading from a new store instance
    const store2 = new TaskStore({ filePath, legacyDbPath: null });
    assert.equal(store2.list().length, 2);
    assert.deepEqual(store2.stats(), { total: 2, pending: 1, completed: 1 });

    // Delete
    const deleted = store2.delete(t2.id);
    assert.equal(deleted, true);
    assert.equal(store2.list().length, 1);
    assert.deepEqual(store2.stats(), { total: 1, pending: 0, completed: 1 });

    // No leftover .tmp files
    const files = readdirSync(dir);
    assert.equal(files.filter(f => f.endsWith('.tmp')).length, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('storage: validation errors', () => {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-task-val-'));
  const filePath = join(dir, 'tasks.json');

  try {
    const store = new TaskStore({ filePath, legacyDbPath: null });
    assert.throws(() => store.create({ title: '' }), /Title is required/);
    assert.throws(() => store.create({ title: '   ' }), /Title is required/);

    const t = store.create({ title: 'Valid' });
    assert.throws(() => store.update(t.id, { title: '' }), /Title cannot be empty/);
    assert.equal(store.update('non-existent', { title: 'New' }), null);
    assert.equal(store.delete('non-existent'), false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('storage: imports tasks from legacy sqlite DB if tasks.json does not exist', () => {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-task-import-'));
  const filePath = join(dir, 'tasks.json');
  const dbPath = join(dir, 'legacy.db');

  try {
    const { DatabaseSync } = require('node:sqlite');
    const db = new DatabaseSync(dbPath);
    db.exec(`
      CREATE TABLE tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        status TEXT NOT NULL DEFAULT 'pending',
        priority INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        completed_at TEXT
      );
      INSERT INTO tasks VALUES ('task-1', 'Legacy Task 1', 'From sqlite', 'pending', 2, '2026-09-01T00:00:00Z', '2026-09-01T00:00:00Z', NULL);
      INSERT INTO tasks VALUES ('task-2', 'Legacy Task 2', 'Done task', 'completed', 0, '2026-09-02T00:00:00Z', '2026-09-02T00:00:00Z', '2026-09-02T01:00:00Z');
    `);
    db.close();

    const store = new TaskStore({ filePath, legacyDbPath: dbPath });
    assert.equal(store.list().length, 2);
    assert.deepEqual(store.stats(), { total: 2, pending: 1, completed: 1 });
    assert.equal(store.get('task-1').title, 'Legacy Task 1');
    assert.equal(store.get('task-2').status, 'completed');

    // tasks.json must now exist
    assert.ok(existsSync(filePath));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
