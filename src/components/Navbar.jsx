import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CATEGORIES } from '../data/newsData';

const mainLinks = [
  { label: 'Latest News', path: '/category/latest' },
  ...CATEGORIES.filter((category) => (
    ['pakistan', 'world', 'business', 'sports', 'technology'].includes(category.id)
  )).map((category) => ({
    label: category.label,
    path: `/category/${category.id}`,
  })),
];

const moreLinks = CATEGORIES
  .filter((category) => ['health', 'entertainment', 'opinion', 'education', 'lifestyle'].includes(category.id))
  .map((category) => ({
    label: category.label,
    path: `/category/${category.id}`,
  }));

const linkClass = ({ isActive }) => (
  `block px-3 py-3 text-sm font-semibold transition-colors ${
    isActive
      ? 'text-brand-blue bg-brand-blueLight dark:bg-brand-blue/20 dark:text-blue-300'
      : 'text-gray-800 dark:text-gray-200 hover:text-brand-blue dark:hover:text-blue-400'
  }`
);

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-brand-darkBg border-t-1 border-brand-blue border-b border-gray-200 dark:border-brand-darkBorder ">
      <div className="max-w-[1180px] mx-auto px-3 sm:px-4 flex items-center justify-between">
        <div className="flex md:hidden w-full items-center justify-between h-14">
          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="border border-gray-300 dark:border-brand-darkBorder px-3 py-1.5 rounded text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-1.5"
          >
            <span>{mobileMenuOpen ? '✕' : '☰'}</span> Menu
          </button>
          <Link to="/" onClick={closeMenus} className="font-serif font-bold text-base text-gray-900 dark:text-white">
            Christian Monitor <strong className="text-brand-blue dark:text-blue-400">News</strong>
          </Link>
          <Link
            to="/search"
            onClick={closeMenus}
            aria-label="Search news"
            className="w-9 h-9 border border-gray-300 dark:border-brand-darkBorder rounded text-lg flex items-center justify-center text-gray-700 dark:text-gray-200"
          >
            ⌕
          </Link>
        </div>

        <ul className="hidden md:flex items-center gap-1 w-full justify-center">
          <li>
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
          </li>
          {mainLinks.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} className={linkClass}>
                {item.label}
              </NavLink>
            </li>
          ))}

          <li className="relative">
            <button
              type="button"
              aria-expanded={moreDropdownOpen}
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className="px-3 py-3 text-sm font-semibold flex items-center gap-1 text-gray-800 dark:text-gray-200 hover:text-brand-blue"
            >
              More <span className="text-[10px]">▼</span>
            </button>
            {moreDropdownOpen && (
              <ul className="absolute left-0 top-full mt-1 w-44 bg-white dark:bg-brand-darkCard border border-gray-200 dark:border-brand-darkBorder shadow-xl rounded-md py-1.5">
                {moreLinks.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={closeMenus}
                      className={({ isActive }) => (
                        `block w-full text-left px-4 py-2 text-sm ${
                          isActive
                            ? 'text-brand-blue font-bold bg-brand-blueLight dark:bg-brand-blue/20'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-brand-blueLight dark:hover:bg-brand-blue/20 hover:text-brand-blue'
                        }`
                      )}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="ml-2">
            <Link to="/newsletter" className="bg-brand-blue text-white px-3.5 py-1.5 rounded text-xs font-semibold hover:opacity-90 transition-opacity block">
              Newsletter
            </Link>
          </li>
          <li className="ml-1">
            <Link to="/search" className="bg-brand-blueLight dark:bg-brand-blue/20 text-brand-blue dark:text-blue-300 border border-gray-200 dark:border-brand-darkBorder px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-brand-blue hover:text-white transition-colors block">
              🔍 Search
            </Link>
          </li>
        </ul>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-brand-darkCard border-b border-gray-200 dark:border-brand-darkBorder px-4 py-3 flex flex-col gap-1">
          <NavLink to="/" end onClick={closeMenus} className={linkClass}>Home</NavLink>
          {[...mainLinks, ...moreLinks].map((item) => (
            <NavLink key={item.path} to={item.path} onClick={closeMenus} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/newsletter"
            onClick={closeMenus}
            className="w-full bg-brand-blue text-white py-2 rounded text-center text-sm font-bold mt-2"
          >
            Newsletter
          </Link>
          <Link
            to="/search"
            onClick={closeMenus}
            className="w-full border border-brand-blue text-brand-blue dark:text-blue-300 py-2 rounded text-center text-sm font-bold"
          >
            Search
          </Link>
        </div>
      )}
    </nav>
  );
}
