import { Link, useSearchParams } from 'react-router-dom';
import ArticleRow from '../components/ArticleRow';
import { ARTICLES } from '../data/newsData';

export default function SearchView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const tags = ['Family Laws', 'Kasur', 'Quetta', 'Bishop', 'Malda'];
  const normalizedQuery = query.toLowerCase().trim();

  const handleQueryChange = (value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set('q', value);
    } else {
      nextParams.delete('q');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const filtered = ARTICLES.filter((article) => (
    `${article.title} ${article.subtitle} ${article.category}`.toLowerCase().includes(normalizedQuery)
  ));

  return (
    <div className="max-w-[850px] mx-auto px-4 py-8">
      <Link to="/" className="text-brand-blue dark:text-blue-400 text-xs font-bold mb-4 inline-block">
        ← Back to Homepage
      </Link>
      <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-2">Search News &amp; Reports</h1>
      <p className="text-xs text-gray-500 mb-6">Explore verified investigative articles and field reports.</p>

      <input
        type="search"
        value={query}
        onChange={(event) => handleQueryChange(event.target.value)}
        placeholder="Type keywords: e.g. Kasur, Quetta, Family Law..."
        aria-label="Search articles"
        className="w-full border-2 border-gray-300 dark:border-brand-darkBorder rounded-lg p-3 text-sm dark:bg-brand-darkCard dark:text-white focus:outline-none focus:border-brand-blue mb-3"
      />

      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-xs text-gray-400 font-semibold py-1">Popular searches:</span>
        {tags.map((tag) => (
          <button
            type="button"
            key={tag}
            onClick={() => handleQueryChange(tag)}
            className="text-xs bg-gray-100 dark:bg-brand-darkCard border border-gray-300 dark:border-brand-darkBorder px-3 py-1 rounded-full text-gray-700 dark:text-gray-300 hover:border-brand-blue"
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="divide-y divide-gray-200 dark:divide-brand-darkBorder">
        {filtered.map((article) => (
          <ArticleRow key={article.id} article={article} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center py-10 text-gray-400 text-sm">
            No matching articles found{query ? ` for "${query}"` : ''}.
          </p>
        )}
      </div>
    </div>
  );
}
