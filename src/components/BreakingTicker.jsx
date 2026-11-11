import { Link } from 'react-router-dom';
import { ARTICLES } from '../data/newsData';

export default function BreakingTicker() {
  const breakingItems = ARTICLES.slice(0, 4);

  return (
    <div className="bg-brand-blueLight dark:bg-brand-darkCard border-b border-gray-200 dark:border-brand-darkBorder py-2.5 overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-4 flex items-center gap-3 overflow-x-auto whitespace-nowrap scrollbar-none text-sm">
        <span className="bg-brand-red text-white text-[11px] font-bold px-2 py-0.5 rounded tracking-wider shrink-0">
          BREAKING NEWS
        </span>
        <div className="flex items-center gap-3">
          {breakingItems.map((article, index) => (
            <span className="inline-flex items-center gap-3" key={article.id}>
              <Link
                to={`/article/${article.slug}`}
                className="font-semibold text-gray-800 dark:text-gray-200 hover:text-brand-blue dark:hover:text-blue-400 shrink-0"
              >
                {article.title}
              </Link>
              {index < breakingItems.length - 1 && <span className="opacity-30">|</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
