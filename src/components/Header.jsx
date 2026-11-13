import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="text-center py-7 sm:py-9 bg-white dark:bg-brand-darkBg transition-colors">
      <Link to="/" className="inline-block">
        <img
          src="/image.png"
          alt="Christian Monitor News"
          className="mx-auto max-h-32 sm:max-h-44 md:max-h-52 w-auto object-contain drop-shadow-xs"
        />
      </Link>
    </header>
  );
}
