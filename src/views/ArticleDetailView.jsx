import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePosts } from '../context/PostsContext';
import { useLanguage } from '../context/LanguageContext';
import useApiResource from '../hooks/useApiResource';
import RequestState from '../components/RequestState';
import { presentPost } from '../lib/api';

export default function ArticleDetailView() {
  const { slug } = useParams();
  const { version } = usePosts();
  const { t, currentLang } = useLanguage();
  const lang = currentLang?.code || 'en';
  const { data, loading, error, retry } = useApiResource(
    `/posts/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`,
    `${version}-${lang}`,
  );

  useEffect(() => {
    if (!data) return;
    const previous = document.title;
    document.title = `${data.title} | Christian Monitor News`;
    return () => { document.title = previous; };
  }, [data]);

  if (error?.status === 404) {
    return (
      <section className="mx-auto max-w-[800px] px-4 py-20 text-center">
        <h1 className="mb-4 font-serif text-3xl font-bold">{t('articleNotFound')}</h1>
        <Link to="/" className="text-brand-blue dark:text-blue-400 font-semibold">{t('returnHome')}</Link>
      </section>
    );
  }

  if (loading || error) return <RequestState loading={loading} error={error} onRetry={retry} />;
  if (!data) return null;
  const article = presentPost(data);
  const related = (data.relatedPosts || []).map(presentPost);

  return (
    <section className="mx-auto max-w-[1180px] px-4 py-8 overflow-hidden">
      <Link to="/" className="mb-6 inline-block text-sm font-semibold text-brand-blue dark:text-blue-400">
        {t('backToHome')}
      </Link>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <article className="lg:col-span-2 min-w-0 break-words">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {(Array.isArray(article.categories) && article.categories.length > 0
              ? article.categories
              : [article.categoryId || article.category]
            ).filter(Boolean).map((catId, index) => (
              <span
                key={`${catId}-${index}`}
                className="text-xs font-bold uppercase tracking-widest text-brand-blue dark:text-blue-400 bg-brand-blue/10 dark:bg-brand-blue/20 px-2 py-0.5 rounded"
              >
                {catId}
              </span>
            ))}
          </div>
          <h1 className="mb-4 mt-2 font-serif text-3xl font-bold leading-tight sm:text-4xl break-words">{article.title}</h1>
          <p className="mb-6 text-xs text-gray-500">
            {t('by')} {article.author} &middot;{' '}
            <time dateTime={article.publishedAt} title={article.date}>
              {article.timeAgo || article.date}
            </time>
            {article.readTime ? ` \u00b7 ${article.readTime}` : ''}
          </p>
          {article.image && <img src={article.image} alt={article.imageAlt || ''} className="mb-3 max-h-[520px] w-full rounded-lg object-cover" />}
          {article.caption && <p className="mb-8 border-b border-gray-200 pb-4 text-xs italic text-gray-500 dark:border-brand-darkBorder">{article.caption}</p>}
          <div
            className="article-body mt-6 text-base leading-relaxed text-gray-800 sm:text-lg dark:text-gray-200 min-w-0"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
        {related.length > 0 && (
          <aside>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-brand-darkBorder dark:bg-brand-darkCard shadow-xs">
              <h2 className="mb-5 font-serif text-xl font-bold text-gray-900 dark:text-white">{t('relatedCoverage')}</h2>
              <div className="space-y-5 divide-y divide-gray-200/70 dark:divide-brand-darkBorder">
                {related.map((post, idx) => (
                  <Link
                    key={post.id}
                    to={`/article/${post.slug}`}
                    className={`block group transition-colors ${idx > 0 ? 'pt-4' : ''}`}
                  >
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-blue dark:group-hover:text-blue-400 leading-snug">
                      {post.title}
                    </h3>
                    <span className="mt-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      <time dateTime={post.publishedAt} title={post.date}>{post.timeAgo || post.date}</time>
                      {post.readTime ? ` · ${post.readTime}` : ''}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
