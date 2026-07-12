import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import i18n from '../../i18n';

type Lang = 'en' | 'ar';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  isRTL: false,
});

function loadCairoFont() {
  if (document.getElementById('cairo-font-link')) return;
  const link = document.createElement('link');
  link.id = 'cairo-font-link';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
}

function applyLang(lang: Lang) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', dir);
  if (lang === 'ar') loadCairoFont();
  try { localStorage.setItem('ux-mosaic-lang', lang); } catch {}
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return (localStorage.getItem('ux-mosaic-lang') as Lang) || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    applyLang(lang);
    i18n.changeLanguage(lang);
  }, [lang]);

  // Apply on mount
  useEffect(() => {
    applyLang(lang);
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, isRTL: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
