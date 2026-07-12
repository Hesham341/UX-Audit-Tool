import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Search } from 'lucide-react';

type Props = {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  onOpen?: () => void;
  closeSignal?: string | null;
};

export function MultiSelectFilter({ options, selected, onChange, placeholder = 'Search…', onOpen, closeSignal }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  // Close when another dropdown opens
  useEffect(() => {
    if (closeSignal) setOpen(false);
  }, [closeSignal]);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter(
    (o) => !selected.includes(o) && o.toLowerCase().includes(query.toLowerCase())
  );

  const calcPos = () => {
    if (!anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    setDropdownPos({ top: r.bottom + 4, left: r.left, width: Math.max(r.width, 180) });
  };

  // Calculate position once on open; close immediately on any scroll.
  useEffect(() => {
    if (!open) return;
    calcPos();
    const onScroll = () => setOpen(false);
    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => document.removeEventListener('scroll', onScroll, { capture: true });
  }, [open]);

  const select = (val: string) => {
    onChange([...selected, val]);
    setQuery('');
    setActiveIdx(0);
    setOpen(false);
  };

  const remove = (val: string) => {
    onChange(selected.filter((s) => s !== val));
  };

  return (
    <div ref={anchorRef}>
      {/* Search icon is absolutely positioned so it never moves when pills are added */}
      <div
        className="relative flex flex-wrap items-center gap-1 min-h-8 w-full rounded-md py-1 pl-6 pr-2 cursor-text transition-colors"
        style={{
          background: 'var(--surface-3)',
          border: `1px solid ${open ? 'rgba(66,116,186,0.6)' : 'var(--border-on-dark)'}`,
        }}
        onClick={() => {
          setOpen(true);
          onOpen?.();
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
      >
        <Search
          className="absolute left-2 top-2 w-3 h-3 pointer-events-none shrink-0"
          style={{ color: 'var(--text-on-dark-subtle)' }}
          strokeWidth={2}
        />
        {selected.map((val) => (
          <span
            key={val}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 shrink-0"
            style={{
              background: 'var(--chip-surface)',
              border: '1px solid var(--chip-border)',
              color: 'var(--text-on-dark-muted)',
            }}
          >
            <span className="text-[11px] leading-none">{val}</span>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); remove(val); }}
              className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--text-on-dark-muted)' }}
              aria-label={`Remove ${val}`}
            >
              <X className="w-2.5 h-2.5" strokeWidth={2.5} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); setOpen(true); onOpen?.(); }}
          onFocus={() => { setOpen(true); setActiveIdx(-1); onOpen?.(); }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIdx((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              if (filtered[activeIdx]) select(filtered[activeIdx]);
            } else if (e.key === 'Backspace' && query === '' && selected.length > 0) {
              remove(selected[selected.length - 1]);
            } else if (e.key === 'Escape') {
              setOpen(false);
              setQuery('');
            }
          }}
          placeholder={selected.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[60px] bg-transparent outline-none text-xs placeholder:text-[var(--text-placeholder)] py-0.5"
          style={{ color: 'var(--text-on-dark)', fontWeight: 600 }}
        />
      </div>

      {open && dropdownPos && filtered.length > 0 && createPortal(
        <div
          ref={dropdownRef}
          onMouseDown={(e) => e.preventDefault()}
          onMouseLeave={() => setActiveIdx(-1)}
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            zIndex: 9999,
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border-on-dark-strong)',
            borderRadius: '0.75rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            maxHeight: '220px',
            overflowY: 'auto',
            paddingTop: '4px',
            paddingBottom: '4px',
          }}
        >
          {filtered.map((opt, i) => (
            <button
              key={opt}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); select(opt); }}
              onMouseEnter={() => setActiveIdx(i)}
              className="w-full text-left px-3 py-2 text-xs transition-colors"
              style={{
                color: i === activeIdx ? '#ffffff' : 'var(--text-on-dark-muted)',
                background: i === activeIdx ? 'var(--brand-blue)' : 'transparent',
              }}
            >
              {query ? (
                (() => {
                  const idx = opt.toLowerCase().indexOf(query.toLowerCase());
                  if (idx === -1) return opt;
                  return (
                    <>
                      {opt.slice(0, idx)}
                      <span style={{ color: i === activeIdx ? '#ffffff' : 'var(--brand-blue)', fontWeight: 700, textDecoration: i === activeIdx ? 'underline' : 'none' }}>
                        {opt.slice(idx, idx + query.length)}
                      </span>
                      {opt.slice(idx + query.length)}
                    </>
                  );
                })()
              ) : opt}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
