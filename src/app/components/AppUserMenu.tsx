import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Settings, LogOut, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

interface AppUserMenuProps {
  name?: string;
  email?: string;
  initials?: string;
}

export function AppUserMenu({
  name = 'Jane Doe',
  email = 'jane@company.com',
  initials = 'JD',
}: AppUserMenuProps) {
  const { t } = useTranslation();
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSignOut = () => {
    setOpen(false);
    logOut();
    navigate('/');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 h-8 ps-1 pe-2 rounded-lg hover:bg-[var(--surface-hover-medium)] transition-colors"
        aria-label="Account menu"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-teal)] flex items-center justify-center text-[11px] text-white shrink-0 select-none">
          {initials}
        </div>
        <ChevronDown
          className={`w-3 h-3 text-[var(--text-on-dark-subtle)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div
          className="absolute end-0 top-[calc(100%+6px)] w-52 rounded-xl overflow-hidden z-50"
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border-on-dark-strong)',
            boxShadow: 'var(--card-shadow-elevated)',
          }}
        >
          {/* User info */}
          <div className="px-4 py-3 border-b border-[var(--border-on-dark)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-teal)] flex items-center justify-center text-[12px] text-white shrink-0 select-none">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] text-[var(--text-on-dark)] truncate" style={{ fontWeight: 600 }}>
                  {name}
                </p>
                <p className="text-[11px] text-[var(--text-on-dark-subtle)] truncate">{email}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="py-1">
            <Link
              to="/app/settings"
              state={{ from: location.pathname === '/app/settings' ? (location.state as any)?.from : location.pathname }}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover-medium)] transition-colors no-underline"
            >
              <Settings className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
              {t('common.settings')}
            </Link>
          </div>

          {/* Sign out */}
          <div className="border-t border-[var(--border-faint)] mx-3" />
          <div className="py-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[var(--text-muted)] hover:text-red-500 hover:bg-[var(--surface-hover-medium)] transition-colors text-start"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
              {t('common.signOut')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
