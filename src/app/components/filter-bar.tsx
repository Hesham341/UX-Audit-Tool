import { ChevronDown, ArrowUpDown, Rows3, LayoutList, SlidersHorizontal } from "lucide-react";

const filters = [
  { label: "Severity", value: "Any" },
  { label: "Tags", value: "Any" },
  { label: "Author", value: "Anyone" },
  { label: "Priority", value: "Any" },
  { label: "Effort", value: "Any" },
  { label: "Status", value: "Open · In review" },
];

export function FilterBar() {
  return (
    <div className="sticky top-14 z-20 bg-[var(--surface-1)]/95 backdrop-blur border-b border-[var(--border-on-dark)]">
      <div className="px-8 py-3 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 mr-1 text-[11px] uppercase tracking-wider text-[var(--text-faint)]">
          <SlidersHorizontal className="size-3" strokeWidth={1.8} />
          Filters
        </div>
        {filters.map((f) => (
          <button
            key={f.label}
            className="h-7 pl-2.5 pr-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-3)] text-[12px] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)] flex items-center gap-1.5"
          >
            <span className="text-[var(--text-faint)]">{f.label}</span>
            <span>{f.value}</span>
            <ChevronDown className="size-3 text-[var(--text-faint)]" strokeWidth={1.8} />
          </button>
        ))}
        <button className="h-7 px-2.5 rounded-md text-[12px] text-[var(--text-subtle)] hover:text-[var(--text-on-dark)]">+ Add filter</button>

        <div className="ml-auto flex items-center gap-2">
          <button className="h-7 px-2.5 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-3)] text-[12px] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] flex items-center gap-1.5">
            <ArrowUpDown className="size-3" strokeWidth={1.8} />
            Sort: Severity ↓
          </button>
          <div className="flex items-center rounded-md border border-[var(--border-subtle)] bg-[var(--surface-3)] p-0.5">
            <button className="h-6 px-2 rounded text-[12px] text-[var(--text-on-dark)] bg-[var(--surface-active)] flex items-center gap-1.5">
              <Rows3 className="size-3" strokeWidth={1.8} />
              Comfortable
            </button>
            <button className="h-6 px-2 rounded text-[12px] text-[var(--text-subtle)] hover:text-[var(--text-on-dark)] flex items-center gap-1.5">
              <LayoutList className="size-3" strokeWidth={1.8} />
              Compact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
