import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function ArticleCard({ article }) {
  const { tCategory } = useLanguage();

  return (
    <Link
      to={`/article/${article.slug}`}
      className="bg-white dark:bg-brand-darkCard border border-gray-200 dark:border-brand-darkBorder rounded-lg overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all group"
    >
      <div
        className="h-44 bg-cover bg-center bg-gray-200 dark:bg-gray-800"
        style={{ backgroundImage: `url(${article.image})` }}
      />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            {(Array.isArray(article.categories) && article.categories.length > 0
              ? article.categories
              : [article.categoryId || article.category]
            ).filter(Boolean).map((catId, index) => (
              <span
                key={`${catId}-${index}`}
                className="text-brand-blue dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider"
              >
                {tCategory(catId, catId)}
                {index < (article.categories?.length || 1) - 1 ? ' ·' : ''}
              </span>
            ))}
          </div>
          <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mt-1.5 mb-2 leading-snug group-hover:text-brand-blue dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed line-clamp-2">
            {article.subtitle}
          </p>
        </div>
        <span className="block text-gray-500 text-[11px] mt-4">
          <time dateTime={article.publishedAt} title={article.date}>
            {article.timeAgo || article.date}
          </time>
          {article.readTime ? ` · ${article.readTime}` : ''}
        </span>
      </div>
    </Link>
  );
}
