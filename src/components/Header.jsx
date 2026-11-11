import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="text-center py-6 bg-white dark:bg-brand-darkBg transition-colors">
      <Link to="/" className="inline-block">
        <img
          src="/image.png"
          alt="Christian Monitor News"
          className="mx-auto max-h-24 sm:max-h-32 w-auto object-contain"
        />
        <p className="text-gray-500 dark:text-gray-400 tracking-[2px] uppercase text-xs sm:text-sm font-semibold mt-2">
          Voice of Oppressed
        </p>
      </Link>
    </header>
  );
}
