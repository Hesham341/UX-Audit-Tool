import {
  Search,
  Bell,
  Share2,
  ImagePlus,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { Link, useLocation } from 'react-router';
import logoSrc from '../../imports/Logo.png';
import { ThemeToggle } from './ThemeToggle';

const navItems = ["Projects", "Criteria", "Integrations", "Tools"];

export function AppTopbar() {
  const location = useLocation();

  return (
    <div
      className="h-14 flex items-center gap-1 px-4 border-b sticky top-0 z-30"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--border-on-dark)' }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 pr-5 mr-2 h-full shrink-0"
        style={{ borderRight: '1px solid var(--border-on-dark)' }}
      >
        <div className="size-7 rounded-lg overflow-hidden shrink-0">
          <img src={logoSrc} alt="UX Mosaic Logo" className="w-full h-full object-cover" />
        </div>
        <div className="text-[13px] tracking-tight" style={{ color: 'var(--text-on-dark)', fontWeight: 600 }}>
          UX Mosaic
        </div>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-0.5">
        {navItems.map((item, i) => (
          <button
            key={item}
            className="px-3 h-8 rounded-md text-[13px] flex items-center gap-1.5 transition-colors"
            style={{
              color: i === 0 ? 'var(--text-on-dark)' : 'var(--text-on-dark-subtle)',
              background: i === 0 ? 'var(--border-on-dark)' : 'transparent',
            }}
          >
            {item}
            <ChevronDown className="size-3 opacity-50" strokeWidth={1.8} />
          </button>
        ))}
      </nav>

      {/* Search */}
      <div className="ml-6 flex-1 max-w-md relative">
        <Search
          className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5"
          strokeWidth={1.8}
          style={{ color: 'var(--text-on-dark-subtle)' }}
        />
        <input
          placeholder="Search issues, screens, tags…"
          className="w-full h-8 rounded-md pl-8 pr-14 text-[13px] outline-none transition-colors"
          style={{
            background: 'var(--surface-3)',
            border: '1px solid var(--border-on-dark)',
            color: 'var(--text-on-dark)',
          }}
        />
        <kbd
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] px-1.5 py-0.5 rounded pointer-events-none"
          style={{
            color: 'var(--text-on-dark-subtle)',
            background: 'var(--surface-2)',
            border: '1px solid var(--border-on-dark-strong)',
          }}
        >
          ⌘K
        </kbd>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2 pl-4">

        {/* Add images — ghost */}
        <button
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[13px] transition-all"
          style={{
            color: 'var(--text-on-dark-subtle)',
            border: '1px solid var(--border-on-dark-strong)',
            background: 'transparent',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-on-dark)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-on-dark-strong)';
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-3)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-on-dark-subtle)';
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          <ImagePlus className="size-3.5" strokeWidth={1.8} />
          <span>Add images</span>
        </button>

        {/* Share — primary */}
        <button
          className="flex items-center gap-1.5 h-8 px-4 rounded-lg text-[13px] text-white transition-all"
          style={{
            background: 'var(--brand-blue)',
            boxShadow: '0 1px 3px rgba(66,116,186,0.35)',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--brand-blue-hover)')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--brand-blue)')}
        >
          <Share2 className="size-3.5" strokeWidth={2} />
          <span style={{ fontWeight: 600 }}>Share</span>
        </button>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: 'var(--border-on-dark-strong)' }} />

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: 'var(--border-on-dark)' }} />

        {/* Icon button group — Help + Bell */}
        <div
          className="flex items-center rounded-lg overflow-hidden"
          style={{ border: '1px solid var(--border-on-dark-strong)' }}
        >
          <button
            className="flex items-center justify-center size-8 transition-colors"
            style={{ color: 'var(--text-on-dark-subtle)' }}
            title="Help"
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-on-dark)';
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-3)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-on-dark-subtle)';
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <HelpCircle className="size-4" strokeWidth={1.8} />
          </button>

          <div className="w-px h-4 self-center" style={{ background: 'var(--border-on-dark-strong)' }} />

          <button
            className="flex items-center justify-center size-8 relative transition-colors"
            style={{ color: 'var(--text-on-dark-subtle)' }}
            title="Notifications"
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-on-dark)';
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-3)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-on-dark-subtle)';
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <Bell className="size-4" strokeWidth={1.8} />
            <span
              className="absolute top-1.5 right-1.5 size-[7px] rounded-full ring-[1.5px]"
              style={{ background: 'var(--brand-blue)', ringColor: 'var(--surface-1)' }}
            />
          </button>
        </div>

        {/* Avatar → Settings */}
        <Link
          to="/app/settings"
          state={{ from: location.pathname }}
          title="Settings"
          className="flex items-center gap-2 h-8 pl-1 pr-3 rounded-lg no-underline transition-all"
          style={{ border: '1px solid var(--border-on-dark-strong)' }}
          onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-3)')}
          onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = 'transparent')}
        >
          <div
            className="size-6 rounded-full grid place-items-center text-[11px] text-white shrink-0"
            style={{
              background: 'linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-teal) 100%)',
              fontWeight: 700,
            }}
          >
            LH
          </div>
          <span className="text-[13px]" style={{ color: 'var(--text-on-dark)', fontWeight: 500 }}>
            Lena H.
          </span>
          <ChevronDown className="size-3 shrink-0" style={{ color: 'var(--text-on-dark-subtle)' }} strokeWidth={1.8} />
        </Link>
      </div>
    </div>
  );
}
