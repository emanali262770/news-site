import { Link, useSearchParams } from 'react-router-dom';
import ArticleRow from '../components/ArticleRow';
import Pagination from '../components/Pagination';
import RequestState from '../components/RequestState';
import useDebouncedValue from '../hooks/useDebouncedValue';
import usePostList from '../hooks/usePostList';
import { useLanguage } from '../context/LanguageContext';

export default function SearchView() {
  const [params, setParams] = useSearchParams();
  const { t } = useLanguage();
  const query = params.get('q') || '';
  const search = useDebouncedValue(query);
  const page = Math.max(1, Number(params.get('page')) || 1);
  const { posts, pagination, loading, error, retry } = usePostList({ search, page });
  const waiting = query !== search;

  function updateQuery(value) {
    const next = new URLSearchParams(params);
    value ? next.set('q', value) : next.delete('q');
    next.delete('page');
    setParams(next, { replace: true });
  }

  return (
    <section className="mx-auto max-w-[850px] px-4 py-8">
      <Link to="/" className="mb-4 inline-block text-sm font-semibold text-brand-blue dark:text-blue-400">
        {t('backToHome')}
      </Link>
      <h1 className="mb-6 font-serif text-3xl font-bold">{t('search')}</h1>
      <input
        type="search"
        aria-label={t('searchAria')}
        value={query}
        onChange={(event) => updateQuery(event.target.value)}
        placeholder={t('searchPlaceholder')}
        className="mb-6 w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-brand-blue dark:border-brand-darkBorder dark:bg-brand-darkCard"
      />
      <RequestState loading={loading || waiting} error={waiting ? null : error} onRetry={retry} />
      {!loading && !waiting && !error && (
        <div className="divide-y divide-gray-200 dark:divide-brand-darkBorder">
          {posts.map((post) => <ArticleRow key={post.id} article={post} />)}
          {!posts.length && <p className="py-10 text-center text-gray-500">{t('noMatchingArticles')}</p>}
        </div>
      )}
      {!waiting && (
        <Pagination
          pagination={pagination}
          onPageChange={(nextPage) => {
            const next = new URLSearchParams(params);
            next.set('page', String(nextPage));
            setParams(next);
          }}
        />
      )}
    </section>
  );
}
