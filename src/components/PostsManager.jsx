import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../context/PostsContext';
import usePostList from '../hooks/usePostList';
import useDebouncedValue from '../hooks/useDebouncedValue';
import Pagination from './Pagination';
import RequestState from './RequestState';

export default function PostsManager({ onEdit, onDelete, disabled = false }) {
  const { categories } = usePosts();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const search = useDebouncedValue(query);
  const [category, setCategory] = useState('');
  const [pending, setPending] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const { posts, pagination, loading, error: listError, retry } = usePostList({ page, category, search });
  const waiting = search !== query;
  const locked = disabled || deleting;
  const actionClass = 'rounded px-2 py-1 text-sm font-semibold disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-brand-blue';

  useEffect(() => {
    if (pagination && page > Math.max(1, pagination.totalPages)) setPage(Math.max(1, pagination.totalPages));
  }, [page, pagination]);

  async function confirmDelete() {
    if (locked) return;
    setDeleting(true);
    setError('');
    try {
      await onDelete(pending);
      setPending(null);
    } catch (error) { setError(error.message); }
    finally { setDeleting(false); }
  }

  return (
    <section aria-labelledby="manage-posts" className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-brand-darkBorder dark:bg-brand-darkCard">
      <div className="flex flex-wrap items-end justify-between gap-4 p-5 sm:p-6">
        <div><h2 id="manage-posts" className="text-xl font-semibold">Manage posts</h2>{pagination && <p className="mt-1 text-sm text-gray-500">{pagination.total} published posts</p>}</div>
        <div className="flex flex-wrap gap-3">
          <label className="text-xs font-semibold">Search posts<input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search by keyword" className="mt-1 block rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-brand-darkBorder" /></label>
          <label className="text-xs font-semibold">Category<select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className="mt-1 block rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-brand-darkBorder dark:bg-brand-darkCard"><option value="">All categories</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        </div>
      </div>
      {pending && <div role="alert" className="mx-5 mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
        <p>Delete <strong>{pending.title}</strong>? This removes the post from the website and cannot be undone.</p>
        <div className="mt-3 flex gap-3"><button type="button" disabled={locked} onClick={confirmDelete} className="rounded bg-red-700 px-3 py-2 font-semibold text-white disabled:opacity-40">{deleting ? 'Deleting...' : 'Delete post'}</button><button type="button" disabled={deleting} onClick={() => { setPending(null); setError(''); }} className="rounded border border-current px-3 py-2">Cancel</button></div>
        {error && <p className="mt-3">{error}</p>}
      </div>}
      <RequestState loading={loading || waiting} error={waiting ? null : listError} onRetry={retry} />
      {!loading && !waiting && !listError && <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <caption className="sr-only">Posts with category, status and management actions</caption>
          <thead className="border-y border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:border-brand-darkBorder dark:bg-brand-darkBg"><tr>{['Post', 'Category', 'Status', 'Actions'].map((label) => <th key={label} scope="col" className="px-5 py-3">{label}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-100 dark:divide-brand-darkBorder">{posts.map((post) => <tr key={post.id}>
            <th scope="row" className="max-w-md px-5 py-4 font-semibold"><span className="line-clamp-2">{post.title}</span><span className="mt-1 block text-xs font-normal text-gray-500">{post.author}</span></th>
            <td className="px-5 py-4">
              <div className="flex flex-wrap gap-1">
                {(Array.isArray(post.categories) && post.categories.length > 0
                  ? post.categories
                  : (post.categoryId ? [post.categoryId] : [])
                ).map((catId) => (
                  <span key={catId} className="inline-block rounded bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs">
                    {categories.find((c) => c.id === catId)?.label || catId}
                  </span>
                ))}
              </div>
            </td>
            <td className="px-5 py-4"><span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-300">Published</span></td>
            <td className="px-5 py-4"><div className="flex items-center gap-1"><button type="button" disabled={locked} className={`${actionClass} text-brand-blue dark:text-blue-400`} onClick={() => onEdit(post)}>Edit</button><Link to={`/article/${post.slug}`} className={`${actionClass} text-brand-blue dark:text-blue-400`}>View</Link><button type="button" disabled={locked} className={`${actionClass} text-red-600 dark:text-red-400`} onClick={() => { setPending(post); setError(''); }}>Delete</button></div></td>
          </tr>)}</tbody>
        </table>
        {!posts.length && <p className="p-8 text-center text-sm text-gray-500">No posts found.</p>}
      </div>}
      {!waiting && <Pagination pagination={pagination} disabled={locked || loading} onPageChange={setPage} />}
    </section>
  );
}
