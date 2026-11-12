import axios from 'axios';

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const client = axios.create({ baseURL: `${apiUrl}/api`, withCredentials: true, timeout: 20000 });
const unauthorizedListeners = new Set();
let csrfToken = null;
let csrfRequest = null;

export function onUnauthorized(listener) {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
}

export async function refreshCsrfToken() {
  if (!csrfRequest) {
    csrfRequest = client.get('/auth/csrf').then(({ data }) => {
      csrfToken = data.csrfToken;
      return csrfToken;
    }).finally(() => { csrfRequest = null; });
  }
  return csrfRequest;
}

export async function api(path, { method = 'GET', body, signal } = {}) {
  try {
    const isWrite = ['POST', 'PATCH', 'DELETE', 'PUT'].includes(method);
    if (isWrite && !csrfToken) await refreshCsrfToken();
    const response = await client.request({
      url: path,
      method,
      data: body,
      signal,
      headers: isWrite ? { 'X-CSRF-Token': csrfToken } : undefined,
    });
    if (response.data?.csrfToken) csrfToken = response.data.csrfToken;
    if (path === '/auth/logout') csrfToken = null;
    return response.status === 204 ? null : response.data;
  } catch (cause) {
    if (axios.isCancel(cause)) throw cause;
    const status = cause.response?.status;
    if (status === 401) {
      csrfToken = null;
      unauthorizedListeners.forEach((listener) => listener());
    }
    if (status === 403) {
      csrfToken = null;
      // Refresh the token, but never automatically repeat a write operation.
      try { await refreshCsrfToken(); } catch { /* The next attempt can retry token retrieval. */ }
    }
    const message = status === 403
      ? 'Your security token needs refreshing. Please try the action again.'
      : cause.response?.data?.message || (status === 429
        ? 'Too many attempts. Please wait before trying again.'
        : 'Unable to reach the server. Please try again.');
    throw Object.assign(new Error(message, { cause }), { status });
  }
}

export function imageUrl(path) {
  return path ? new URL(path, `${apiUrl}/`).href : '';
}

export function formatTimeAgo(dateInput, now = new Date()) {
  if (!dateInput) return '';
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '';

  const nowDate = now instanceof Date ? now : new Date(now);
  const diffInSeconds = Math.floor((nowDate.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';

  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.floor(diffInSeconds / 3600);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(diffInSeconds / 86400);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;

  const months = Math.floor(diffInSeconds / (86400 * 30));
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;

  const years = Math.floor(diffInSeconds / (86400 * 365));
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

export function presentPost(post) {
  const publishedDate = post?.publishedAt || post?.createdAt;
  return {
    ...post,
    image: imageUrl(post?.image),
    category: post?.topic || post?.categoryId,
    date: publishedDate ? new Intl.DateTimeFormat('en-US', {
      dateStyle: 'long', timeZone: 'Asia/Karachi',
    }).format(new Date(publishedDate)) : '',
    timeAgo: post?.timeAgo || formatTimeAgo(publishedDate),
    readTime: typeof post?.readTime === 'number' ? `${post.readTime} min read` : (post?.readTime || ''),
  };
}
