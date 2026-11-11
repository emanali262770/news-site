import { Link } from 'react-router-dom';

export default function ArticleCard({ article }) {
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
          <span className="text-brand-blue dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            {article.category}
          </span>
          <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mt-1.5 mb-2 leading-snug group-hover:text-brand-blue dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed line-clamp-2">
            {article.subtitle}
          </p>
        </div>
        <span className="block text-gray-500 text-[11px] mt-4">
          {article.date} · {article.readTime}
        </span>
      </div>
    </Link>
  );
}
