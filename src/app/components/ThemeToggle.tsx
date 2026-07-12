import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    document.documentElement.style.setProperty('--vt-x', `${x}px`);
    document.documentElement.style.setProperty('--vt-y', `${y}px`);

    if (!('startViewTransition' in document)) {
      toggleTheme();
      return;
    }

    (document as any).startViewTransition(() => {
      toggleTheme();
    });
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isDark ? t('nav.switchToLight') : t('nav.switchToDark')}
      className={`relative h-7 w-[52px] rounded-full shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/50 ${className}`}
      style={{
        background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,27,47,0.07)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(26,27,47,0.13)'}`,
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      {/* Background track fill */}
      

      {/* Moon icon — left side */}
      <Moon
        className="absolute left-[7px] top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
        style={{
          color: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(26,27,47,0.18)',
          transition: 'color 0.3s',
        }}
        strokeWidth={2}
      />
      {/* Sun icon — right side */}
      <Sun
        className="absolute right-[7px] top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
        style={{
          color: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(26,27,47,0.28)',
          transition: 'color 0.3s',
        }}
        strokeWidth={2}
      />

      {/* Sliding knob */}
      <motion.span
        className="absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full flex items-center justify-center shadow-md pointer-events-none"
        animate={{ x: isDark ? 0 : 25 }}
        transition={{ type: 'spring', stiffness: 500, damping: 38, mass: 0.8 }}
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #4274BA 0%, #6BB5AA 100%)'
            : 'linear-gradient(135deg, #F8B500 0%, #FF8C00 100%)',
        }}
      >
        <motion.span
          animate={{ rotate: isDark ? 0 : 360, scale: isDark ? 1 : 0.9 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {isDark
            ? <Moon className="w-[11px] h-[11px] text-white" strokeWidth={2.2} />
            : <Sun className="w-[11px] h-[11px] text-white" strokeWidth={2.2} />
          }
        </motion.span>
      </motion.span>
    </button>
  );
}
