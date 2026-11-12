import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const { currentLang, setLanguage, languages, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentDate = new Intl.DateTimeFormat(currentLang.locale || 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Karachi',
  }).format(new Date());

  return (
    <div className="bg-gray-100 dark:bg-brand-darkCard border-b border-gray-200 dark:border-brand-darkBorder text-gray-600 dark:text-gray-300 text-xs py-2">
      <div className="max-w-[1180px] mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
        <div>
          <strong className="text-gray-900 dark:text-gray-100">{currentDate}</strong> 
        </div>

        <div className="flex items-center gap-3 relative">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              aria-expanded={langOpen}
              onClick={() => setLangOpen(!langOpen)}
              className="bg-white dark:bg-brand-darkBg border border-gray-300 dark:border-brand-darkBorder px-3 py-1 rounded-full flex items-center gap-1.5 font-semibold text-xs text-gray-800 dark:text-gray-200 hover:text-brand-blue"
            >
              <span>🌐</span>
              <span>{currentLang.label.split(' ')[0]}</span>
              <span className="text-[10px]">▾</span>
            </button>
            {langOpen && (
              <ul className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-brand-darkCard border border-gray-200 dark:border-brand-darkBorder rounded-lg shadow-xl py-1 z-50">
                {languages.map((language) => (
                  <li key={language.code}>
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage(language.code);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-brand-blueLight dark:hover:bg-brand-blue/20 cursor-pointer flex items-center gap-2 text-gray-700 dark:text-gray-200 ${
                        currentLang.code === language.code ? 'font-bold text-brand-blue dark:text-blue-400 bg-gray-50 dark:bg-brand-darkBg' : ''
                      }`}
                    >
                      <span>{language.flag}</span> {language.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="border border-gray-300 dark:border-brand-darkBorder px-2.5 py-1 rounded-full flex items-center gap-1 text-gray-800 dark:text-gray-200 hover:bg-brand-blueLight dark:hover:bg-brand-blue/20"
          >
            {theme === 'dark' ? t('themeLight') : t('themeDark')}
          </button>

          <Link
            to="/login"
            className="rounded-full bg-brand-blue px-4 py-1 font-semibold text-white hover:bg-brand-blue/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            {t('login')}
          </Link>
        </div>
      </div>
    </div>
  );
}
