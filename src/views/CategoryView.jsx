import { useParams } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import ArticleRow from '../components/ArticleRow';
import { ARTICLES, CATEGORIES } from '../data/newsData';

const CATEGORY_MATCHERS = {
  pakistan: (article) => article.category !== 'World News',
  world: (article) => article.category === 'World News',
};

export default function CategoryView() {
  const { categoryId } = useParams();
  const category = CATEGORIES.find((item) => item.id === categoryId);

  if (!category) {
    return (
      <div className="max-w-[1180px] mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">Section not found</h1>
      </div>
    );
  }

  const matchesCategory = CATEGORY_MATCHERS[categoryId];
  const filteredArticles = categoryId === 'latest'
    ? ARTICLES
    : ARTICLES.filter((article) => (
      matchesCategory
        ? matchesCategory(article)
        : article.category.toLowerCase().includes(categoryId)
    ));

  return (
    <section className="max-w-[1180px] mx-auto px-4 py-8">
      <header className="border-b-2 border-brand-blue pb-3 mb-6">
        <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
          {category.label}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {filteredArticles.length} {filteredArticles.length === 1 ? 'story' : 'stories'}
        </p>
      </header>

      {filteredArticles.length > 0 ? (
        categoryId === 'latest' ? (
          <div className="divide-y divide-gray-200 dark:divide-brand-darkBorder">
            {filteredArticles.map((article) => (
              <ArticleRow key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )
      ) : (
        <p className="text-center py-12 text-gray-500 dark:text-gray-400">
          There are no stories in this category yet.
        </p>
      )}
    </section>
  );
}
