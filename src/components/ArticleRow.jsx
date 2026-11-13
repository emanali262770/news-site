import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function ArticleRow({ article }) {
  const { tCategory } = useLanguage();

  return (
    <Link
      to={`/article/${article.slug}`}
      className="w-full py-4 flex gap-4 items-center text-left group"
    >
      <div
        className="w-24 h-20 bg-cover bg-center rounded bg-gray-200 dark:bg-gray-800 shrink-0"
        style={{ backgroundImage: `url(${article.image})` }}
        aria-hidden="true"
      />
      <span className="min-w-0">
        <span className="inline-flex flex-wrap items-center gap-1 text-[10px] text-brand-blue dark:text-blue-400 font-bold uppercase">
          {(Array.isArray(article.categories) && article.categories.length > 0
            ? article.categories
            : [article.categoryId || article.category]
          ).filter(Boolean).map((catId, index) => (
            <span key={`${catId}-${index}`}>
              {tCategory(catId, catId)}
              {index < (article.categories?.length || 1) - 1 ? ' ·' : ''}
            </span>
          ))}
        </span>
        <span className="block font-serif text-base font-bold text-gray-900 dark:text-white group-hover:text-brand-blue">
          {article.title}
        </span>
        <span className="block text-xs text-gray-500 line-clamp-1">{article.subtitle}</span>
        <span className="block text-[11px] text-gray-400 mt-1">
          <time dateTime={article.publishedAt} title={article.date}>
            {article.timeAgo || article.date}
          </time>
          {article.readTime ? ` · ${article.readTime}` : ''}
        </span>
      </span>
    </Link>
  );
}
