import { useParams, useSearchParams } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import ArticleRow from '../components/ArticleRow';
import Pagination from '../components/Pagination';
import RequestState from '../components/RequestState';
import { usePosts } from '../context/PostsContext';
import { useLanguage } from '../context/LanguageContext';
import usePostList from '../hooks/usePostList';

export default function CategoryView({ sectionId }) {
  const { categoryId: routeCategory } = useParams();
  const categoryId = sectionId || routeCategory;
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get('page')) || 1);
  const { categories, categoriesLoading, categoriesError, retryCategories } = usePosts();
  const { t, tCategory } = useLanguage();
  const { posts, pagination, loading, error, retry } = usePostList({ page, category: categoryId === 'latest' ? undefined : categoryId });
  const category = categoryId === 'latest' ? { label: t('latestNews') } : categories.find((item) => item.id === categoryId);
  const categoryTitle = categoryId === 'latest' ? t('latestNews') : tCategory(categoryId, category?.label || 'News');

  return (
    <section className="mx-auto max-w-[1180px] px-4 py-8">
      <RequestState loading={categoriesLoading} error={categoriesError} onRetry={retryCategories} />
      {!categoriesLoading && !categoriesError && !category ? <h1 className="font-serif text-3xl font-bold">Section not found</h1> : (
        <>
          <header className="mb-6 border-b-2 border-brand-blue pb-3">
            <h1 className="font-serif text-3xl font-bold">{categoryTitle}</h1>
            {pagination && <p className="mt-1 text-sm text-gray-500">{pagination.total} stories</p>}
          </header>
          <RequestState loading={loading} error={error} onRetry={retry} />
          {!loading && !error && (posts.length ? (
            <div className={categoryId === 'latest' ? 'divide-y divide-gray-200 dark:divide-brand-darkBorder' : 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'}>
              {posts.map((post) => categoryId === 'latest' ? <ArticleRow key={post.id} article={post} /> : <ArticleCard key={post.id} article={post} />)}
            </div>
          ) : <p className="py-12 text-center text-gray-500">There are no stories in this category yet.</p>)}
          <Pagination pagination={pagination} onPageChange={(next) => setParams({ page: String(next) })} />
        </>
      )}
    </section>
  );
}
