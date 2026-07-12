import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  const { t } = useTranslation();
  const isAr = lang === 'ar';

  return (
    <button
      onClick={() => setLang(isAr ? 'en' : 'ar')}
      aria-label={isAr ? t('nav.switchToEnglish') : t('nav.switchToArabic')}
      title={isAr ? t('nav.switchToEnglish') : t('nav.switchToArabic')}
      className={`flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs transition-colors text-[var(--text-on-dark-subtle)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover-medium)] ${className}`}
    >
      <Globe className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
      <span style={{ fontFamily: isAr ? "'Cairo', system-ui, sans-serif" : 'inherit', fontWeight: 600, minWidth: '1.75ch' }}>
        {isAr ? 'EN' : 'عر'}
      </span>
    </button>
  );
}
