export function sanitizeErrorMessage(err) {
  if (!err) return 'Internal server error';
  const rawMsg = typeof err === 'string' ? err : String(err.message || '');
  if (!rawMsg) return 'Internal server error';
  return rawMsg
    .replace(/(?:[a-zA-Z]:\\|[a-zA-Z]:\/|\/)[^\s:;"']+/g, '<path>')
    .trim() || 'Internal server error';
}

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

export function isPrivateLanAddress(value) {
  const address = String(value || '').toLowerCase().replace(/^\[|\]$/g, '');
  if (!address) return false;
  const ipv4 = address.startsWith('::ffff:') ? address.slice(7) : address;
  return (
    ipv4.startsWith('192.168.') ||
    ipv4.startsWith('10.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ipv4)
  );
}

export function getConnection(ctx) {
  try {
    const fromCtx = ctx?.reflect?.get
      ? (ctx.reflect.get('connection') || ctx?.connection)
      : (ctx?.get ? (ctx.get('connection') || ctx?.connection) : Reflect.get(ctx || {}, 'connection'));
    if (fromCtx) return fromCtx;
    if (ctx?.root) {
      return getConnection(ctx.root);
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export function checkRequestAuthorization(req, ctx = null) {
  const remote = req.socket?.remoteAddress || req.connection?.remoteAddress;
  const isLoopback = isLoopbackAddress(remote);
  const isLan = isPrivateLanAddress(remote);

  // #72: Never skip address check. Non-loopback, non-LAN callers (e.g. public IPs) are rejected unconditionally.
  if (!isLoopback && !isLan) {
    return { status: 403, error: 'Forbidden: remote address not allowed' };
  }

  // #73: Core DSH connection auth gate. Remote callers must be authenticated by host connection service.
  const conn = getConnection(ctx) || req?.connectionService;
  if (conn && typeof conn.requestRejection === 'function') {
    let rejection;
    try {
      rejection = conn.requestRejection(req);
    } catch {
      rejection = 403;
    }
    if (rejection !== undefined) {
      return {
        status: rejection,
        error: rejection === 401 ? 'Authentication required' : 'Forbidden',
      };
    }
  }

  const hasConnectionAuth = Boolean(conn && typeof conn.requestRejection === 'function');

  // #72 & #73: Non-loopback callers without connection authentication cannot prove session legitimacy
  if (!isLoopback && !hasConnectionAuth) {
    return {
      status: 401,
      error: 'Authentication required: remote access requires authentication',
    };
  }

  const headers = req.headers || {};
  const site = headers['sec-fetch-site'];
  if (site === 'cross-site') {
    return { status: 403, error: 'Forbidden: cross-origin request rejected' };
  }

  const method = String(req.method || 'GET').toUpperCase();
  const isMutating = method === 'POST' || method === 'PATCH' || method === 'DELETE' || method === 'PUT';

  // #61: Sec-Fetch-Site: none must not bypass mutating route authorization for remote callers
  if (isMutating && site === 'none' && !isLoopback) {
    return { status: 403, error: 'Forbidden: invalid fetch metadata' };
  }

  const origin = headers.origin;
  const host = headers.host || '';

  if (origin !== undefined) {
    if (origin === 'null') {
      return { status: 403, error: 'Forbidden: null origin rejected' };
    }
    try {
      const parsed = new URL(origin);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return { status: 403, error: 'Forbidden: invalid origin scheme' };
      }
      if (!host || parsed.host.toLowerCase() !== host.toLowerCase()) {
        if (!isLoopback || !isLoopbackAddress(parsed.hostname)) {
          return { status: 403, error: 'Forbidden: origin mismatch' };
        }
      }
    } catch {
      return { status: 403, error: 'Forbidden: malformed origin' };
    }
  }

  if (!isLoopback && isMutating && !origin) {
    const referer = headers.referer;
    if (!referer) {
      return { status: 403, error: 'Forbidden: missing origin or referer' };
    }
    try {
      const parsedRef = new URL(referer);
      if (!host || parsedRef.host.toLowerCase() !== host.toLowerCase()) {
        return { status: 403, error: 'Forbidden: referer mismatch' };
      }
    } catch {
      return { status: 403, error: 'Forbidden: malformed referer' };
    }
  }

  return null;
}

export function isAllowedRequest(req, ctx = null) {
  return checkRequestAuthorization(req, ctx) === null;
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
export async function handleTasksApi(req, res, store, ctx = null) {
  const authErr = checkRequestAuthorization(req, ctx);
  if (authErr) {
    writeJson(res, authErr.status, { error: authErr.error });
    return;
  }

  const url = new URL(req.url, 'http://127.0.0.1');
  const pathname = url.pathname;
  // Route prefix: /dsh-task-tracker/api/tasks
  // Subpath after prefix:
  const subpath = pathname.replace(/^\/dsh-task-tracker\/api\/tasks/, '').replace(/^\//, '');

  if (subpath === 'reset' && req.method === 'POST') {
    const remote = req.socket?.remoteAddress || req.connection?.remoteAddress;
    if (!isLoopbackAddress(remote)) {
      writeJson(res, 403, { error: 'Forbidden: storage reset is only permitted from loopback' });
      return;
    }
    store.resetStorage();
    writeJson(res, 200, { message: 'Storage reset successfully', quarantine: store.quarantinePath });
    return;
  }

  if (store.corrupted) {
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

      let limit = undefined;
      if (url.searchParams.has('limit')) {
        const rawLimit = url.searchParams.get('limit');
        const parsed = Number(rawLimit);
        if (!Number.isInteger(parsed) || parsed < 0) {
          writeJson(res, 400, { error: 'Invalid limit parameter: must be a non-negative integer' });
          return;
        }
        limit = parsed;
      }

      let offset = undefined;
      if (url.searchParams.has('offset')) {
        const rawOffset = url.searchParams.get('offset');
        const parsed = Number(rawOffset);
        if (!Number.isInteger(parsed) || parsed < 0) {
          writeJson(res, 400, { error: 'Invalid offset parameter: must be a non-negative integer' });
          return;
        }
        offset = parsed;
      }

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
    if (err && (err.message === 'Title is required' || err.message === 'Title cannot be empty' || err.message === 'Folder name is required')) {
      writeJson(res, 400, { error: err.message });
      return;
    }
    const safeError = sanitizeErrorMessage(err);
    writeJson(res, 500, { error: safeError });
  }
}

export function registerRoutes(ctx, store) {
  if (!ctx.webServer || typeof ctx.webServer.register !== 'function') {
    return;
  }

  const handler = (req, res) => handleTasksApi(req, res, store, ctx);

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
