import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, imageUrl } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import RequestState from '../components/RequestState';
import { usePosts } from '../context/PostsContext';
import PostsManager from '../components/PostsManager';

const emptyForm = { title: '', categoryId: '', topic: '', subtitle: '', imageId: '', imageAlt: '', caption: '', author: 'Admin', content: '', showOnHomepage: false };
const control = 'mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 dark:border-brand-darkBorder dark:bg-brand-darkBg';
const button = 'rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-brand-blue dark:border-brand-darkBorder dark:hover:bg-brand-darkBg disabled:opacity-50';

export default function AdminDashboardView() {
  const { categories, categoriesLoading, categoriesError, retryCategories, savePost, deletePost } = usePosts();
  const { admin, logout } = useAuth();
  const [form, setForm] = useState({ ...emptyForm, author: admin.name || 'Admin' });
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [busy, setBusy] = useState(false);
  const requestRef = useRef(null);
  useEffect(() => () => requestRef.current?.abort(), []);
  const fileRef = useRef(null);
  const editorRef = useRef(null);

  function update(event) {
    const { name, value, checked, type } = event.target;
    setForm((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
    setNotice('');
    setError('');
  }

  async function uploadImage(event) {
    const file = event.target.files[0];
    if (!file || busy) return;
    setError('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 1024 * 1024) {
      setError('Choose a JPG, PNG or WebP image up to 1 MiB.');
      event.target.value = '';
      return;
    }
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setImageLoading(true);
    const body = new FormData();
    body.append('image', file);
    try {
      const uploaded = await api('/uploads/images', { method: 'POST', body, signal: controller.signal });
      if (!controller.signal.aborted) {
        setForm((previous) => ({ ...previous, imageId: uploaded.id }));
        setImagePreview(imageUrl(uploaded.url));
      }
    } catch (error) { if (!controller.signal.aborted) setError(error.message); }
    finally { if (!controller.signal.aborted) setImageLoading(false); }
  }

  function resetForm() {
    requestRef.current?.abort();
    setImageLoading(false);
    setForm({ ...emptyForm, author: admin.name || 'Admin' });
    setImagePreview('');
    setEditing(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function editPost(post) {
    if (busy || imageLoading) return;
    setBusy(true);
    setError('');
    setNotice('');
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const detail = await api('/posts/' + encodeURIComponent(post.slug), { signal: controller.signal });
      if (controller.signal.aborted) return;
      const fields = Object.fromEntries(Object.entries(emptyForm).map(([key, fallback]) => [key, detail[key] ?? fallback]));
      setForm(fields);
      setImagePreview(imageUrl(detail.image));
      setEditing(detail.id);
      if (fileRef.current) fileRef.current.value = '';
      requestAnimationFrame(() => {
        editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        editorRef.current?.querySelector('[name="title"]')?.focus({ preventScroll: true });
      });
    } catch (error) { if (!controller.signal.aborted) setError(error.message); }
    finally { if (!controller.signal.aborted) setBusy(false); }
  }

  async function submit(event) {
    event.preventDefault();
    if (busy || imageLoading) return;
    setError('');
    setNotice('');
    if (!form.title.trim() || !form.categoryId || !form.subtitle.trim() || !form.author.trim() || !form.content.trim() || !form.imageId) {
      setError('Add a title, category, summary, author, image and article content before publishing.');
      return;
    }
    setBusy(true);
    try {
      // Form state contains only the editable fields accepted by the backend.
      await savePost({ ...form, title: form.title.trim() }, editing);
      resetForm();
      setNotice('Post published. Open it from Manage posts below.');
    } catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }

  async function handleLogout() {
    setBusy(true);
    setError('');
    try { await logout(); }
    catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }

  return (
    <section className="mx-auto max-w-[1180px] px-4 py-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link to="/" className="font-semibold text-brand-blue hover:underline dark:text-blue-400">Home</Link></li>
          <li aria-hidden="true" className="text-gray-400">/</li>
          <li aria-current="page" className="text-gray-500 dark:text-gray-400">Admin dashboard</li>
        </ol>
      </nav>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6 dark:border-brand-darkBorder">
        <div><p className="text-xs font-bold uppercase tracking-widest text-brand-blue dark:text-blue-400">Editorial workspace</p><h1 className="mt-2 text-3xl font-semibold">Admin dashboard</h1></div>
        <button onClick={handleLogout} disabled={busy || imageLoading} className={button}>Log out</button>
      </header>
      {notice && <p role="status" className="mb-5 rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">{notice}</p>}
      <RequestState loading={categoriesLoading} error={categoriesError} onRetry={retryCategories} />
      {error && <p role="alert" className="mb-5 text-sm text-red-600 dark:text-red-400">{error}</p>}
      <div ref={editorRef} className="mb-8 scroll-mt-6">
        <form aria-busy={busy || imageLoading} onSubmit={submit} className="rounded-xl border border-gray-200 bg-white p-5 sm:p-8 dark:border-brand-darkBorder dark:bg-brand-darkCard">
          <h2 className="mb-6 text-xl font-semibold">{editing ? 'Edit post' : 'Create a post'}</h2>
          <fieldset disabled={busy} className="grid gap-6 md:grid-cols-2">
            <label className="text-sm font-semibold md:col-span-2">Title *<input name="title" value={form.title} onChange={update} maxLength={250} className={control} placeholder="Enter the headline" /></label>
            <label className="text-sm font-semibold">Category *<select name="categoryId" value={form.categoryId} onChange={update} className={control}><option value="">Select a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></label>
            <label className="text-sm font-semibold">Topic label <span className="font-normal text-gray-500">(optional)</span><input name="topic" value={form.topic} onChange={update} className={control} placeholder="e.g. Family Law Reform" /></label>
            <label className="text-sm font-semibold md:col-span-2">Short summary *<textarea name="subtitle" value={form.subtitle} onChange={update} rows={3} className={control} placeholder="A short introduction for news cards" /></label>
            <div className="md:col-span-2"><label className="text-sm font-semibold">Featured image *<input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} className={control} /></label><p className="mt-2 text-xs text-gray-500">JPG, PNG or WebP. Maximum 1 MiB.</p>{imageLoading && <p role="status">Uploading image...</p>}{imagePreview && <img src={imagePreview} alt="Selected featured image preview" className="mt-4 max-h-52 rounded-lg object-contain" />}</div>
            <label className="text-sm font-semibold">Image description (alt text) (optional)<input name="imageAlt" value={form.imageAlt} onChange={update} className={control} /></label>
            <label className="text-sm font-semibold">Image caption / credit<input name="caption" value={form.caption} onChange={update} className={control} /></label>
            <label className="text-sm font-semibold md:col-span-2">Author / Byline *<input name="author" value={form.author} onChange={update} className={control} /></label>
            <div className="md:col-span-2"><label htmlFor="post-content" className="text-sm font-semibold">Article content *</label><textarea id="post-content" name="content" value={form.content} onChange={update} rows={12} className={control} aria-describedby="content-help" placeholder="Write your article..." /><p id="content-help" className="mt-2 text-xs text-gray-500">Separate paragraphs with a blank line.</p></div>
            <label className="flex items-center gap-3 text-sm md:col-span-2"><input type="checkbox" name="showOnHomepage" checked={form.showOnHomepage} onChange={update} className="size-4 accent-brand-blue" />Show on homepage</label>
          </fieldset>
          <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-200 pt-6 dark:border-brand-darkBorder">
            <button type="submit" value="publish" disabled={busy || imageLoading || categoriesLoading || Boolean(categoriesError)} className="rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue/90 disabled:opacity-50">{busy ? 'Please wait...' : 'Publish'}</button>
          </div>
        </form>
      </div>
      <PostsManager
        disabled={busy || imageLoading}
        onEdit={editPost}
        onDelete={async (post) => {
          setBusy(true);
          try {
            await deletePost(post);
            if (editing === post.id) resetForm();
            setNotice('Post deleted.');
          } finally { setBusy(false); }
        }}
      />
    </section>
  );
}
