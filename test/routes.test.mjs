import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { EventEmitter } from 'node:events';
import { TaskStore } from '../lib/storage.js';
import { handleTasksApi } from '../lib/routes.js';

function createMockReq(method, url, body = null, headers = {}) {
  const req = new EventEmitter();
  req.method = method;
  req.url = url;
  req.headers = { host: '127.0.0.1:3000', ...headers };
  req.destroy = () => {};

  process.nextTick(() => {
    if (body !== null) {
      const data = typeof body === 'string' ? body : JSON.stringify(body);
      req.emit('data', Buffer.from(data));
    }
    req.emit('end');
  });

  return req;
}

function createMockRes() {
  return {
    statusCode: null,
    headers: {},
    body: '',
    writeHead(code, headers) {
      this.statusCode = code;
      this.headers = headers || {};
    },
    end(data) {
      this.body = data ? String(data) : '';
    },
    json() {
      return this.body ? JSON.parse(this.body) : null;
    },
  };
}

test('routes: full API lifecycle (GET, POST, PATCH, DELETE, stats)', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-task-routes-'));
  const filePath = join(dir, 'tasks.json');

  try {
    const store = new TaskStore({ filePath, legacyDbPath: null });

    // 1. Initial list: empty
    {
      const req = createMockReq('GET', '/dsh-task-tracker/api/tasks');
      const res = createMockRes();
      await handleTasksApi(req, res, store);
      assert.equal(res.statusCode, 200);
      assert.deepEqual(res.json(), []);
    }

    // 2. Stats
    {
      const req = createMockReq('GET', '/dsh-task-tracker/api/tasks/stats');
      const res = createMockRes();
      await handleTasksApi(req, res, store);
      assert.equal(res.statusCode, 200);
      assert.deepEqual(res.json(), { total: 0, pending: 0, completed: 0 });
    }

    // 3. POST create task
    let createdId;
    {
      const req = createMockReq('POST', '/dsh-task-tracker/api/tasks', {
        title: 'Api Created Task',
        description: 'Testing via route',
        priority: 2,
      });
      const res = createMockRes();
      await handleTasksApi(req, res, store);
      assert.equal(res.statusCode, 201);
      const data = res.json();
      assert.ok(data.id);
      assert.equal(data.title, 'Api Created Task');
      assert.equal(data.priority, 2);
      assert.equal(data.status, 'pending');
      createdId = data.id;
    }

    // 4. GET by ID
    {
      const req = createMockReq('GET', `/dsh-task-tracker/api/tasks/${createdId}`);
      const res = createMockRes();
      await handleTasksApi(req, res, store);
      assert.equal(res.statusCode, 200);
      assert.equal(res.json().id, createdId);
    }

    // 5. PATCH task status and title
    {
      const req = createMockReq('PATCH', `/dsh-task-tracker/api/tasks/${createdId}`, {
        title: 'Renamed Task',
        status: 'completed',
      });
      const res = createMockRes();
      await handleTasksApi(req, res, store);
      assert.equal(res.statusCode, 200);
      const data = res.json();
      assert.equal(data.title, 'Renamed Task');
      assert.equal(data.status, 'completed');
      assert.ok(data.completedAt);
    }

    // 6. DELETE task
    {
      const req = createMockReq('DELETE', `/dsh-task-tracker/api/tasks/${createdId}`);
      const res = createMockRes();
      await handleTasksApi(req, res, store);
      assert.equal(res.statusCode, 200);
      assert.deepEqual(res.json(), { ok: true });
    }

    // 7. GET by ID after delete -> 404
    {
      const req = createMockReq('GET', `/dsh-task-tracker/api/tasks/${createdId}`);
      const res = createMockRes();
      await handleTasksApi(req, res, store);
      assert.equal(res.statusCode, 404);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('routes: rejects cross-origin and invalid requests', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-task-sec-'));
  const filePath = join(dir, 'tasks.json');

  try {
    const store = new TaskStore({ filePath, legacyDbPath: null });

    // Cross-origin request
    {
      const req = createMockReq('POST', '/dsh-task-tracker/api/tasks', { title: 'Attack' }, {
        origin: 'https://malicious-site.com',
        'sec-fetch-site': 'cross-site',
      });
      const res = createMockRes();
      await handleTasksApi(req, res, store);
      assert.equal(res.statusCode, 403);
    }

    // Missing title
    {
      const req = createMockReq('POST', '/dsh-task-tracker/api/tasks', { title: '   ' });
      const res = createMockRes();
      await handleTasksApi(req, res, store);
      assert.equal(res.statusCode, 400);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
