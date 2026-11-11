import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ARTICLES } from '../data/newsData';

export default function ArticleDetailView() {
  const { slug } = useParams();
  const article = ARTICLES.find((item) => item.slug === slug);

  useEffect(() => {
    if (!article) return undefined;
    const previousTitle = document.title;
    document.title = `${article.title} | Christian Monitor News`;
    return () => {
      document.title = previousTitle;
    };
  }, [article]);

  if (!article) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-2">Article Not Found</h1>
        <p className="text-gray-500 mb-6">The article you are looking for does not exist or has been moved.</p>
        <Link to="/" className="bg-brand-blue text-white px-5 py-2 rounded text-sm font-bold">
          ← Return to Homepage
        </Link>
      </div>
    );
  }

  const related = ARTICLES.filter((item) => item.id !== article.id).slice(0, 2);

  return (
    <div className="max-w-[1180px] mx-auto px-4 py-8">
      <Link to="/" className="text-brand-blue dark:text-blue-400 text-sm font-bold mb-6 inline-flex items-center gap-1 hover:underline">
        ← Back to Homepage
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <article className="lg:col-span-2">
          <span className="text-brand-blue dark:text-blue-400 text-xs font-bold uppercase tracking-widest">
            {article.category}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4 leading-tight">
            {article.title}
          </h1>
          <p className="text-gray-500 text-xs mb-6">
            By {article.author} · Published: {article.date} · {article.readTime}
          </p>

          <div
            role="img"
            aria-label={article.caption}
            className="w-full h-72 sm:h-[420px] rounded-lg bg-cover bg-center mb-3 bg-gray-200 dark:bg-gray-800"
            style={{ backgroundImage: `url(${article.image})` }}
          />
          <p className="text-xs text-gray-500 italic border-b border-gray-200 dark:border-brand-darkBorder pb-4 mb-8">
            {article.caption}
          </p>

          <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 space-y-5 text-base sm:text-lg leading-relaxed font-sans">
            {article.paragraphs?.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            {article.quote && (
              <blockquote className="border-l-4 border-brand-blue bg-gray-50 dark:bg-brand-darkCard pl-6 py-4 my-8 font-serif italic text-xl text-brand-blue dark:text-blue-300">
                “{article.quote}”
              </blockquote>
            )}
          </div>
        </article>

        <aside className="space-y-6">
          {article.factsheet && (
            <div className="bg-gray-50 dark:bg-brand-darkCard border border-gray-200 dark:border-brand-darkBorder p-5 rounded-lg">
              <h2 className="font-serif font-bold text-gray-900 dark:text-white text-base mb-3 border-b border-gray-200 dark:border-brand-darkBorder pb-2">
                Case / Incident Factsheet
              </h2>
              <div className="space-y-2.5 text-xs">
                {Object.entries(article.factsheet).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-2 border-b border-gray-100 dark:border-brand-darkBorder/30 pb-1.5">
                    <span className="font-semibold text-gray-600 dark:text-gray-400">{key}:</span>
                    <span className="text-gray-900 dark:text-gray-100 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-brand-darkCard border border-gray-200 dark:border-brand-darkBorder p-5 rounded-lg">
            <h2 className="font-serif font-bold text-gray-900 dark:text-white text-base mb-3">
              Related Coverage
            </h2>
            <div className="space-y-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/article/${item.slug}`}
                  className="block hover:text-brand-blue group"
                >
                  <span className="block text-xs font-bold text-gray-800 dark:text-gray-200 leading-snug group-hover:text-brand-blue">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-gray-400">{item.date}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
