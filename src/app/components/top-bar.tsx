import { Search, Bell, Plus } from "lucide-react";

export function TopBar() {
  return (
    <header className="flex items-center gap-6 px-10 lg:px-16 py-6 border-b border-[var(--border-on-dark)]">
      <div className="flex items-center gap-3">
        <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-faint)]">
          Studio / Aramex Audit Q2
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-auto relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-[var(--text-faint)]" strokeWidth={1.6} />
        <input
          placeholder="Search findings, screens, heuristics…"
          className="w-full bg-[var(--surface-3)] border border-[var(--border-subtle)] rounded-full pl-12 pr-5 py-3 text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--brand-blue)]/40 transition-colors"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="size-11 rounded-full grid place-items-center bg-[var(--surface-hover)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-active)] transition-colors">
          <Bell className="size-[18px]" strokeWidth={1.6} />
        </button>
        <button className="flex items-center gap-2 pl-5 pr-6 py-3 rounded-full bg-[var(--brand-teal)] text-white hover:opacity-90 transition-opacity">
          <Plus className="size-4" strokeWidth={2} />
          <span>New audit</span>
        </button>
      </div>
    </header>
  );
}
