import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import axios, { AxiosError } from 'axios';
import { createServer } from 'vite';

const calls = [];
let respond;
const originalAdapter = axios.defaults.adapter;
axios.defaults.adapter = async (config) => {
  calls.push(config);
  const { status = 200, data = null } = await respond(config);
  const response = { status, data, statusText: String(status), headers: {}, config };
  if (status >= 400) throw new AxiosError('Request failed', undefined, config, null, response);
  return response;
};
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const { api, imageUrl, presentPost, formatTimeAgo, onUnauthorized } = await server.ssrLoadModule('/src/lib/api.js');
after(async () => { axios.defaults.adapter = originalAdapter; await server.close(); });

await test('Axios API contract', async (t) => {
  await t.test('gets CSRF before login, sends credentials, and retains rotated token', async () => {
    respond = (config) => config.url === '/auth/csrf'
      ? { data: { csrfToken: 'initial-token' } }
      : { data: { admin: { id: 'admin' }, csrfToken: 'rotated-token' } };
    const result = await api('/auth/login', { method: 'POST', body: { email: 'admin@example.com', password: 'example' } });
    assert.equal(result.admin.id, 'admin');
    assert.deepEqual(calls.map((call) => call.url), ['/auth/csrf', '/auth/login']);
    assert.equal(calls[1].withCredentials, true);
    assert.equal(calls[1].headers.get('X-CSRF-Token'), 'initial-token');
    assert.deepEqual(JSON.parse(calls[1].data), { email: 'admin@example.com', password: 'example' });
    respond = () => ({ status: 204 });
    assert.equal(await api('/posts/post-id', { method: 'DELETE' }), null);
    assert.equal(calls.at(-1).headers.get('X-CSRF-Token'), 'rotated-token');
  });

  await t.test('uploads FormData without JSON serialization', async () => {
    const body = new FormData();
    body.append('image', new Blob(['image'], { type: 'image/png' }), 'image.png');
    respond = () => ({ data: { id: 'image-id', url: '/uploads/image.png' } });
    await api('/uploads/images', { method: 'POST', body });
    assert.equal(calls.at(-1).data, body);
    assert.equal(calls.at(-1).withCredentials, true);
  });

  await t.test('403 refreshes CSRF but never replays the mutation', async () => {
    const start = calls.length;
    respond = (config) => config.url === '/auth/csrf'
      ? { data: { csrfToken: 'refreshed-token' } }
      : { status: 403, data: { message: 'Invalid CSRF' } };
    await assert.rejects(api('/posts/post-id', { method: 'PATCH', body: { title: 'Updated' } }), (error) => error.status === 403 && error.message.includes('try the action again'));
    assert.deepEqual(calls.slice(start).map((call) => call.url), ['/posts/post-id', '/auth/csrf']);
    respond = () => ({ data: { id: 'post-id' } });
    await api('/posts/post-id', { method: 'PATCH', body: { title: 'Updated' } });
    assert.equal(calls.at(-1).headers.get('X-CSRF-Token'), 'refreshed-token');
  });

  await t.test('401 invalidates auth and clears CSRF; logout clears the new token', async () => {
    let expired = 0;
    const unsubscribe = onUnauthorized(() => { expired += 1; });
    respond = () => ({ status: 401, data: { message: 'Session expired' } });
    await assert.rejects(api('/auth/me'), (error) => error.status === 401);
    assert.equal(expired, 1);
    unsubscribe();
    respond = (config) => config.url === '/auth/csrf' ? { data: { csrfToken: 'fresh-token' } } : { status: 204 };
    const start = calls.length;
    await api('/auth/logout', { method: 'POST' });
    assert.deepEqual(calls.slice(start).map((call) => call.url), ['/auth/csrf', '/auth/logout']);
    await api('/auth/login', { method: 'POST', body: {} });
    assert.equal(calls.at(-2).url, '/auth/csrf');
  });

  await t.test('preserves validation, missing article, rate limit and network errors', async () => {
    for (const status of [400, 404, 429, 500]) {
      respond = () => ({ status, data: { message: 'Backend message' } });
      await assert.rejects(api('/posts'), (error) => error.status === status && error.message === 'Backend message');
    }
    respond = () => { throw new AxiosError('Connection refused', 'ERR_NETWORK'); };
    await assert.rejects(api('/posts'), /Unable to reach the server/);
  });

  await t.test('cancellation is not treated as an authentication/network error', async () => {
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(api('/posts', { signal: controller.signal }), axios.isCancel);
  });

  await t.test('formats relative time and normalizes backend article dates', () => {
    const fixedNow = new Date('2026-11-13T00:00:00Z');
    assert.equal(formatTimeAgo('2026-11-12T23:59:30Z', fixedNow), 'Just now');
    assert.equal(formatTimeAgo('2026-11-12T23:45:00Z', fixedNow), '15 minutes ago');
    assert.equal(formatTimeAgo('2026-11-12T22:00:00Z', fixedNow), '2 hours ago');
    assert.equal(formatTimeAgo('2026-11-11T20:00:00Z', fixedNow), '1 day ago');
    assert.equal(formatTimeAgo('2026-11-05T00:00:00Z', fixedNow), '8 days ago');
    assert.equal(formatTimeAgo('2026-09-13T00:00:00Z', fixedNow), '2 months ago');
    assert.equal(formatTimeAgo('2025-11-13T00:00:00Z', fixedNow), '1 year ago');
    assert.equal(formatTimeAgo(null), '');
    assert.equal(formatTimeAgo('invalid-date'), '');

    assert(imageUrl('/uploads/example.webp').endsWith('/uploads/example.webp'));
    assert.equal(imageUrl(''), '');
    const post = presentPost({ title: 'Story', image: '/uploads/example.webp', categoryId: 'sports', topic: 'Cricket', publishedAt: '2026-11-12T10:00:00Z', readTime: 2 });
    assert.equal(post.category, 'Cricket');
    assert.equal(post.date, 'November 12, 2026');
    assert.equal(post.readTime, '2 min read');
    assert.ok(post.timeAgo);
  });
});
