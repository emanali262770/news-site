import { createContext, useContext, useEffect, useState } from 'react';
import { LANGUAGES, TRANSLATIONS } from '../locales/translations';

function getInitialLanguage() {
  const saved = typeof window !== 'undefined'
    ? (localStorage.getItem('site_lang') || localStorage.getItem('cm_language') || 'en')
    : 'en';
  return LANGUAGES.find((l) => l.code === saved) || LANGUAGES[0];
}

function clearGoogleTranslateCookies() {
  if (typeof document === 'undefined') return;
  const hostname = window.location.hostname;
  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  if (hostname) {
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
  }
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(getInitialLanguage);

  useEffect(() => {
    document.documentElement.dir = currentLang.dir;
    document.documentElement.lang = currentLang.code;
    localStorage.setItem('site_lang', currentLang.code);
    localStorage.setItem('cm_language', currentLang.code);

    if (currentLang.code === 'ur') {
      document.body.classList.add('urdu-font');
    } else {
      document.body.classList.remove('urdu-font');
    }

    clearGoogleTranslateCookies();
  }, [currentLang]);

  function setLanguage(code) {
    const match = LANGUAGES.find((l) => l.code === code);
    if (match) {
      setCurrentLang(match);
    }
  }

  function t(path, fallback = '') {
    const parts = path.split('.');
    let val = TRANSLATIONS[currentLang.code];
    for (const part of parts) {
      if (val && typeof val === 'object') {
        val = val[part];
      } else {
        val = undefined;
        break;
      }
    }
    if (val !== undefined) return val;

    let fallbackVal = TRANSLATIONS.en;
    for (const part of parts) {
      if (fallbackVal && typeof fallbackVal === 'object') {
        fallbackVal = fallbackVal[part];
      } else {
        fallbackVal = undefined;
        break;
      }
    }
    return fallbackVal !== undefined ? fallbackVal : fallback;
  }

  function tCategory(categoryId, fallbackLabel) {
    return t(`categories.${categoryId}`, fallbackLabel || categoryId);
  }

  return (
    <LanguageContext.Provider value={{
      currentLang,
      setLanguage,
      t,
      tCategory,
      languages: LANGUAGES,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
