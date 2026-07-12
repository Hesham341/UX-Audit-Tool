import { Menu, X, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import logoSrc from '../../imports/Logo.png';
import { LanguageToggle } from './LanguageToggle';
import { AppUserMenu } from './AppUserMenu';
import { useAuth } from '../context/AuthContext';

export function Navigation() {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/features', label: t('nav.features') },
    { to: '/solutions', label: t('nav.solutions') },
    { to: '/pricing', label: t('nav.pricing') },
    { to: '/app/demo', label: t('nav.liveDemo') },
  ];

  return (
    <nav className="bg-[var(--surface-1)] border-b border-[var(--border-on-dark)] sticky top-0 z-40">
      {/* ── Main bar — fixed h-14 to match all app top bars ── */}
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center gap-6">
        {/* Logo + nav links */}
        <div className="flex items-center gap-10 flex-1 min-w-0">
          <Link to={isLoggedIn ? '/app/projects' : '/'} className="flex items-center gap-3 no-underline shrink-0">
            <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0">
              <img src={logoSrc} alt="UX Mosaic Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm text-[var(--text-on-dark)]">UX Mosaic</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm transition-colors no-underline ${
                    isActive
                      ? 'text-[var(--text-on-dark)]'
                      : 'text-[var(--text-on-dark-subtle)] hover:text-[var(--text-on-dark)]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right side — logged-out */}
        {!isLoggedIn && (
          <div className="hidden lg:flex items-center gap-3">
            <LanguageToggle />
            <Link
              to="/login?mode=login"
              className="inline-flex items-center justify-center h-9 px-4 rounded-lg text-sm text-[var(--text-on-dark-subtle)] hover:text-[var(--text-on-dark)] transition-colors no-underline"
            >
              {t('nav.login')}
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-[var(--brand-blue)] text-white text-sm hover:bg-[var(--brand-blue-hover)] transition-colors no-underline"
            >
              {t('nav.startFreeTrial')}
            </Link>
          </div>
        )}

        {/* Right side — logged-in */}
        {isLoggedIn && (
          <div className="hidden lg:flex items-center gap-3">
            <LanguageToggle />
            <Link
              to="/app/projects"
              className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-[var(--brand-blue)] text-white text-sm hover:bg-[var(--brand-blue-hover)] transition-colors no-underline"
            >
              <LayoutGrid className="w-3.5 h-3.5" strokeWidth={2} />
              {t('nav.openApp')}
            </Link>
            <AppUserMenu />
          </div>
        )}

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle />
          {isLoggedIn && <AppUserMenu />}
          <button
            className="text-[var(--text-on-dark)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown — separate from the h-14 bar ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-6 pb-4 border-t border-[var(--border-on-dark)] flex flex-col gap-3 pt-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm py-2 transition-colors no-underline ${
                  isActive ? 'text-[var(--text-on-dark)]' : 'text-[var(--text-on-dark-subtle)]'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="flex flex-col gap-2 mt-1">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login?mode=login"
                  className="inline-flex items-center justify-center h-10 px-4 rounded-lg border border-[var(--border-on-dark-strong)] text-sm text-[var(--text-on-dark)] no-underline"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-[var(--brand-blue)] text-white text-sm no-underline"
                >
                  {t('nav.startFreeTrial')}
                </Link>
              </>
            ) : (
              <Link
                to="/app/projects"
                className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[var(--brand-blue)] text-white text-sm no-underline"
              >
                <LayoutGrid className="w-3.5 h-3.5" strokeWidth={2} />
                {t('nav.openApp')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
