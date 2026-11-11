import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="text-center py-6 bg-white dark:bg-brand-darkBg transition-colors">
      <Link to="/" className="inline-block">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
          Christian Monitor <br />
          <span className="text-brand-blue dark:text-blue-400">News</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 tracking-[2px] uppercase text-xs sm:text-sm font-semibold mt-2">
          Voice of Oppressed
        </p>
      </Link>
    </header>
  );
}
