import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function BreakingTicker({ articles = [] }) {
  const { t } = useLanguage();
  const items = Array.isArray(articles) ? articles.filter((item) => item?.title) : [];
  if (items.length === 0) return null;

  // Use up to 10 stories for a rich news stream
  const baseItems = items.slice(0, 10);

  // Ensure enough items to smoothly fill the screen width and loop infinitely
  let tickerItems = [...baseItems];
  while (tickerItems.length < 6) {
    tickerItems = [...tickerItems, ...baseItems];
  }

  return (
    <aside
      aria-label="Breaking News"
      className="border-b border-gray-200 bg-brand-blueLight py-2.5 dark:border-brand-darkBorder dark:bg-brand-darkCard"
    >
      <div className="mx-auto flex max-w-[1180px] items-center px-4">
        {/* Pinned Breaking News Badge */}
        <div className="z-10 flex shrink-0 items-center pr-3">
          <span className="rounded bg-brand-red px-2 py-0.5 text-[11px] font-bold tracking-wider text-white shadow-sm">
            {t('breakingNews')}
          </span>
        </div>

        {/* Continuous Scrolling Ticker */}
        <div className="relative flex-1 overflow-hidden">
          <div className="animate-ticker flex w-max items-center whitespace-nowrap text-sm">
            {/* Primary Track */}
            <div className="flex shrink-0 items-center gap-4 pr-4">
              {tickerItems.map((article, index) => (
                <span className="inline-flex items-center gap-4" key={`track1-${article.id || article.slug}-${index}`}>
                  <Link
                    to={`/article/${article.slug}`}
                    className="font-semibold text-gray-800 transition-colors hover:text-brand-blue hover:underline dark:text-gray-200 dark:hover:text-blue-400"
                  >
                    {article.title}
                  </Link>
                  <span className="select-none text-gray-400 dark:text-gray-600">•</span>
                </span>
              ))}
            </div>

            {/* Duplicate Track for 100% Seamless Infinite Loop */}
            <div className="flex shrink-0 items-center gap-4 pr-4" aria-hidden="true">
              {tickerItems.map((article, index) => (
                <span className="inline-flex items-center gap-4" key={`track2-${article.id || article.slug}-${index}`}>
                  <Link
                    to={`/article/${article.slug}`}
                    tabIndex={-1}
                    className="font-semibold text-gray-800 transition-colors hover:text-brand-blue hover:underline dark:text-gray-200 dark:hover:text-blue-400"
                  >
                    {article.title}
                  </Link>
                  <span className="select-none text-gray-400 dark:text-gray-600">•</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
