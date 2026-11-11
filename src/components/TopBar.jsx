import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ur', label: 'اردو (Urdu)', flag: '🇵🇰' },
  { code: 'pa', label: 'پنجابی (Punjabi)', flag: '🇵🇰' },
  { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'ar', label: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');

  const currentDate = new Intl.DateTimeFormat('en-US', {
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
          <strong className="text-gray-900 dark:text-gray-100">{currentDate}</strong> · South Asia &amp; International Edition
        </div>

        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <button
              type="button"
              aria-expanded={langOpen}
              onClick={() => setLangOpen(!langOpen)}
              className="bg-white dark:bg-brand-darkBg border border-gray-300 dark:border-brand-darkBorder px-3 py-1 rounded-full flex items-center gap-1.5 font-semibold text-xs text-gray-800 dark:text-gray-200 hover:text-brand-blue"
            >
              <span>🌐</span>
              <span>{selectedLang}</span>
              <span className="text-[10px]">▾</span>
            </button>
            {langOpen && (
              <ul className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-brand-darkCard border border-gray-200 dark:border-brand-darkBorder rounded-lg shadow-xl py-1 z-50">
                {LANGUAGES.map((language) => (
                  <li key={language.code}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLang(language.label.split(' ')[0]);
                        setLangOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-brand-blueLight dark:hover:bg-brand-blue/20 cursor-pointer flex items-center gap-2 text-gray-700 dark:text-gray-200"
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
            {theme === 'dark' ? '☀️ Light' : '🌓 Theme'}
          </button>

          <Link
            to="/newsletter"
            className="font-semibold text-brand-blue dark:text-blue-400 hover:underline cursor-pointer"
          >
            The Weekly Monitor (Issue #01)
          </Link>
        </div>
      </div>
    </div>
  );
}
