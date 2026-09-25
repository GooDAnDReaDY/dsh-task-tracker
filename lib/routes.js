// HTTP API маршруты для dsh-task-tracker
//
// Браузерный клиент TasksScreen общается с сервером через эти маршруты.
// Запросы обслуживаются из локального TaskStore (tasks.json).

export const MAX_BODY_BYTES = 256 * 1024;

export function isLoopbackAddress(value) {
  const address = String(value || '').toLowerCase().replace(/^\[|\]$/g, '');
  return (
    address === '127.0.0.1' ||
    address === '::1' ||
    address === 'localhost' ||
    address.startsWith('127.') ||
    address.startsWith('::ffff:127.')
  );
}

export function isAllowedRequest(req) {
  const headers = req.headers || {};
  const origin = headers.origin;
  if (origin !== undefined) {
    if (origin === 'null') return false;
    try {
      const parsed = new URL(origin);
      const host = headers.host || '';
      if (parsed.host && parsed.host !== host) return false;
    } catch {
      return false;
    }
  }
  const site = headers['sec-fetch-site'];
  if (site && site !== 'same-origin' && site !== 'none') return false;

  const method = String(req.method || 'GET').toUpperCase();
  const isMutating = method === 'POST' || method === 'PATCH' || method === 'DELETE' || method === 'PUT';
  if (isMutating && origin === undefined && !site) {
    const remote = req.socket?.remoteAddress || req.connection?.remoteAddress;
    if (!isLoopbackAddress(remote)) {
      return false;
    }
  }

  return true;
}

export function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

export function writeJson(res, statusCode, data) {
  try {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    res.end(JSON.stringify(data));
  } catch {
    /* socket closed */
  }
}

export function parseJsonBody(req, limit = MAX_BODY_BYTES) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let bytes = 0;
    let settled = false;

    const fail = (err) => {
      if (settled) return;
      settled = true;
      reject(err);
    };

    req.on('data', (chunk) => {
      if (settled) return;
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      bytes += buf.length;
      if (bytes > limit) {
        fail(new Error('Request body exceeds limit'));
        req.destroy();
        return;
      }
      chunks.push(buf);
    });

    req.on('end', () => {
      if (settled) return;
      settled = true;
      if (chunks.length === 0) return resolve({});
      try {
        const text = Buffer.concat(chunks).toString('utf8');
        resolve(text.trim() ? JSON.parse(text) : {});
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });

    req.on('error', fail);
  });
}

/**
 * Обработчик маршрута /dsh-task-tracker/api/tasks[...]
 */
export async function handleTasksApi(req, res, store) {
  if (!isAllowedRequest(req)) {
    writeJson(res, 403, { error: 'Forbidden: cross-origin request rejected' });
    return;
  }

  const url = new URL(req.url, 'http://127.0.0.1');
  const pathname = url.pathname;
  // Route prefix: /dsh-task-tracker/api/tasks
  // Subpath after prefix:
  const subpath = pathname.replace(/^\/dsh-task-tracker\/api\/tasks/, '').replace(/^\//, '');

  if (store.corrupted) {
    if (subpath === 'reset' && req.method === 'POST') {
      store.resetStorage();
      writeJson(res, 200, { message: 'Storage reset successfully', quarantine: store.quarantinePath });
      return;
    }
    writeJson(res, 503, {
      error: 'Storage corrupted and quarantined',
      quarantine: store.quarantinePath,
      message: 'Storage file was invalid and has been safely quarantined. Call POST /api/tasks/reset to reinitialize.',
    });
    return;
  }

  try {
    if (req.method === 'GET') {
      if (subpath === 'stats') {
        const stats = store.stats();
        writeJson(res, 200, stats);
        return;
      }

      if (subpath === 'folders') {
        const withDetails = url.searchParams.get('details') === '1' || url.searchParams.get('format') === 'details';
        if (withDetails) {
          const details = store.getFolders();
          const folders = store.listFolders();
          writeJson(res, 200, { folders, details });
          return;
        }
        const folders = store.listFolders();
        writeJson(res, 200, folders);
        return;
      }

      if (subpath && subpath !== '') {
        const taskId = safeDecode(subpath);
        if (taskId === null) {
          writeJson(res, 400, { error: 'Invalid URL encoding' });
          return;
        }
        const task = store.get(taskId);
        if (!task) {
          writeJson(res, 404, { error: 'Task not found' });
          return;
        }
        writeJson(res, 200, task);
        return;
      }

      const status = url.searchParams.get('status') || undefined;
      const folder = url.searchParams.get('folder') || undefined;
      const query = url.searchParams.get('query') || undefined;
      const limit = url.searchParams.has('limit') ? Number(url.searchParams.get('limit')) : undefined;
      const offset = url.searchParams.has('offset') ? Number(url.searchParams.get('offset')) : undefined;

      const tasks = store.list({ status, folder, query, limit, offset });
      writeJson(res, 200, tasks);
      return;
    }

    if (req.method === 'POST') {
      if (subpath === 'folders') {
        const body = await parseJsonBody(req);
        if (!body.name || !String(body.name).trim()) {
          writeJson(res, 400, { error: 'Folder name is required' });
          return;
        }
        const folders = store.addFolder(body.name, body.icon);
        const details = store.getFolders();
        writeJson(res, 201, { folders, details });
        return;
      }

      if (subpath && subpath !== '') {
        writeJson(res, 404, { error: 'Not found' });
        return;
      }

      const body = await parseJsonBody(req);
      if (!body.title || !String(body.title).trim()) {
        writeJson(res, 400, { error: 'Title is required' });
        return;
      }

      const task = store.create({
        title: body.title,
        description: body.description,
        priority: body.priority,
        status: body.status,
        folder: body.folder,
        author: body.author || 'User',
      });

      writeJson(res, 201, task);
      return;
    }

    if (req.method === 'PATCH') {
      if (!subpath) {
        writeJson(res, 400, { error: 'ID required' });
        return;
      }

      if (subpath.startsWith('folders/')) {
        const folderName = safeDecode(subpath.slice('folders/'.length));
        if (folderName === null) {
          writeJson(res, 400, { error: 'Invalid URL encoding' });
          return;
        }
        const body = await parseJsonBody(req);
        const updated = store.updateFolder(folderName, body);
        if (!updated) {
          writeJson(res, 404, { error: 'Folder not found' });
          return;
        }
        writeJson(res, 200, { folder: updated, folders: store.listFolders(), details: store.getFolders() });
        return;
      }

      const taskId = safeDecode(subpath);
      if (taskId === null) {
        writeJson(res, 400, { error: 'Invalid URL encoding' });
        return;
      }

      const body = await parseJsonBody(req);
      const updated = store.update(taskId, body);
      if (!updated) {
        writeJson(res, 404, { error: 'Task not found' });
        return;
      }

      writeJson(res, 200, updated);
      return;
    }

    if (req.method === 'DELETE') {
      if (!subpath) {
        writeJson(res, 400, { error: 'ID required' });
        return;
      }

      if (subpath.startsWith('folders/')) {
        const folderName = safeDecode(subpath.slice('folders/'.length));
        if (folderName === null) {
          writeJson(res, 400, { error: 'Invalid URL encoding' });
          return;
        }
        const ok = store.removeFolder(folderName);
        writeJson(res, 200, { ok, folders: store.listFolders(), details: store.getFolders() });
        return;
      }

      const taskId = safeDecode(subpath);
      if (taskId === null) {
        writeJson(res, 400, { error: 'Invalid URL encoding' });
        return;
      }

      const deleted = store.delete(taskId);
      if (!deleted) {
        writeJson(res, 404, { error: 'Task not found' });
        return;
      }

      writeJson(res, 200, { ok: true });
      return;
    }

    writeJson(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    writeJson(res, 500, { error: err.message || 'Internal server error' });
  }
}

export function registerRoutes(ctx, store) {
  if (!ctx.webServer || typeof ctx.webServer.register !== 'function') {
    return;
  }

  const handler = (req, res) => handleTasksApi(req, res, store);

  if (typeof ctx.effect === 'function') {
    return ctx.effect(() => {
      return ctx.webServer.register({
        kind: 'prefix',
        path: '/dsh-task-tracker/api/tasks',
        handler,
      });
    }, 'dsh-task-tracker: /api/tasks');
  } else {
    ctx.webServer.register({
      kind: 'prefix',
      path: '/dsh-task-tracker/api/tasks',
      handler,
    });
  }
}
