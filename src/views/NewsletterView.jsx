import { Link } from 'react-router-dom';
import ArticleRow from '../components/ArticleRow';
import { ARTICLES } from '../data/newsData';

export default function NewsletterView() {
  return (
    <article className="max-w-[850px] mx-auto px-4 py-10">
      <Link to="/" className="text-brand-blue dark:text-blue-400 text-xs font-bold mb-4 inline-block">
        ← Back to Homepage
      </Link>
      <header className="bg-brand-blue text-white rounded-xl p-8 sm:p-12 mb-8">
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-blue-200 mb-3">Issue #01 · Weekly briefing</p>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-4">The Weekly Monitor</h1>
        <p className="text-sm sm:text-base text-blue-100">
          Verified court updates, independent investigation, and human rights briefings from Pakistan and beyond.
        </p>
      </header>

      <section className="mb-8">
        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-3">This week’s briefing</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          This inaugural issue brings together reporting on uniform Christian family laws, child protection, accountability, and threats to religious communities. Select a report below to read the full story.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white border-b-2 border-brand-blue pb-2 mb-2">
          In this issue
        </h2>
        <div className="divide-y divide-gray-200 dark:divide-brand-darkBorder">
          {ARTICLES.map((article) => (
            <ArticleRow key={article.id} article={article} />
          ))}
        </div>
      </section>
    </article>
  );
}
