import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import BreakingTicker from '../components/BreakingTicker';
import { ARTICLES } from '../data/newsData';

export default function HomeView() {
  const [leadArticle, ...otherArticles] = ARTICLES;
  const sideArticles = otherArticles.slice(0, 3);

  if (!leadArticle) {
    return <p className="max-w-[1180px] mx-auto px-4 py-12 text-gray-500">No stories are available right now.</p>;
  }

  return (
    <>
      <BreakingTicker />
      <div className="max-w-[1180px] mx-auto px-4 py-8">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Link to={`/article/${leadArticle.slug}`} className="lg:col-span-2 group">
            <div
              className="h-64 sm:h-96 rounded-lg bg-cover bg-center mb-4 relative overflow-hidden bg-gray-200 dark:bg-gray-800"
              style={{ backgroundImage: `url(${leadArticle.image})` }}
            />
            <span className="text-brand-blue dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              {leadArticle.category}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-3 leading-snug group-hover:text-brand-blue dark:group-hover:text-blue-400 transition-colors">
              {leadArticle.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
              {leadArticle.subtitle}
            </p>
            <span className="text-xs text-gray-400">{leadArticle.date} · {leadArticle.readTime}</span>
          </Link>

          <div className="flex flex-col gap-5 divide-y divide-gray-200 dark:divide-brand-darkBorder">
            {sideArticles.map((article) => (
              <Link
                key={article.id}
                to={`/article/${article.slug}`}
                className="pt-4 first:pt-0 flex gap-4 group"
              >
                <div
                  className="w-24 h-20 rounded bg-cover bg-center shrink-0 bg-gray-200 dark:bg-gray-800"
                  style={{ backgroundImage: `url(${article.image})` }}
                />
                <span>
                  <span className="text-brand-blue dark:text-blue-400 text-[11px] font-bold uppercase">
                    {article.category}
                  </span>
                  <span className="block font-serif text-sm font-bold text-gray-900 dark:text-white leading-snug mt-1 group-hover:text-brand-blue dark:group-hover:text-blue-400">
                    {article.title}
                  </span>
                  <span className="text-[11px] text-gray-400 mt-1 block">{article.date}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <div className="flex items-center justify-between border-b-2 border-brand-blue pb-2 mb-6">
            <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
              Dispatches &amp; Field Reports
            </h2>
            <Link to="/category/latest" className="text-brand-blue dark:text-blue-400 text-xs font-bold hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTICLES.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-brand-blue to-slate-900 text-white rounded-xl p-8 sm:p-12 text-center mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2">The Weekly Monitor</h2>
          <p className="text-sm opacity-90 max-w-xl mx-auto mb-6">
            Verified court updates, independent investigation, and human rights briefings in your inbox every Friday.
          </p>
          <Link
            to="/newsletter"
            className="border border-white/40 hover:bg-white/10 px-6 py-2.5 rounded-full text-xs font-bold inline-block"
          >
            Read Issue #01 Online Now →
          </Link>
        </section>
      </div>
    </>
  );
}
