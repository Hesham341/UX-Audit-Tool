import {
  LayoutGrid,
  FileText,
  AlertCircle,
  Camera,
  BookOpen,
  Users,
  Activity,
  Folder,
  ChevronDown,
  PanelLeftClose,
  CircleDot,
} from "lucide-react";

const projects = [
  { name: "Aramex · Q2 Audit", count: 147, active: true },
  { name: "Careem · Onboarding", count: 38 },
  { name: "STC · Self-care", count: 92 },
  { name: "Talabat · Checkout", count: 24 },
];

const sections = [
  { icon: LayoutGrid, label: "Overview" },
  { icon: AlertCircle, label: "Issues", count: 147, active: true },
  { icon: Camera, label: "Screens", count: 62 },
  { icon: FileText, label: "Report" },
  { icon: BookOpen, label: "UX Laws" },
  { icon: Users, label: "Team" },
  { icon: Activity, label: "Activity" },
];

export function AppSidebar() {
  return (
    <aside className="hidden md:flex w-[248px] shrink-0 flex-col border-r border-[var(--border-faint)] bg-[var(--surface-1)]">
      <div className="px-3 py-3 border-b border-[var(--border-faint)] flex items-center justify-between">
        <button className="flex items-center gap-2 h-7 px-2 rounded-md hover:bg-[var(--surface-hover)] flex-1 min-w-0">
          <Folder className="size-3.5 text-[#007AFF]" strokeWidth={1.8} />
          <span className="text-[13px] text-[var(--text-on-dark)] truncate">Aramex · Q2 Audit</span>
          <ChevronDown className="size-3 text-[var(--text-faint)] ml-auto" strokeWidth={1.8} />
        </button>
        <button className="size-7 grid place-items-center rounded-md text-[var(--text-faint)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover)]">
          <PanelLeftClose className="size-3.5" strokeWidth={1.8} />
        </button>
      </div>

      <div className="px-2 py-3">
        <div className="px-2 py-1 text-[11px] uppercase tracking-wider text-[var(--text-faint)]">Workspace</div>
        <nav className="mt-1 space-y-px">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                className={`w-full h-8 px-2 rounded-md flex items-center gap-2.5 text-[13px] ${
                  s.active
                    ? "bg-[var(--surface-hover-medium)] text-[var(--text-on-dark)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <Icon className="size-3.5" strokeWidth={1.8} />
                <span>{s.label}</span>
                {s.count !== undefined && (
                  <span className="ml-auto text-[11px] text-[var(--text-subtle)] tabular-nums">
                    {s.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-2 py-3 border-t border-[var(--border-faint)]">
        <div className="px-2 py-1 text-[11px] uppercase tracking-wider text-[var(--text-faint)]">Recent projects</div>
        <nav className="mt-1 space-y-px">
          {projects.map((p) => (
            <button
              key={p.name}
              className={`w-full h-8 px-2 rounded-md flex items-center gap-2.5 text-[13px] ${
                p.active ? "text-[var(--text-on-dark)]" : "text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <CircleDot className={`size-3 ${p.active ? "text-[#007AFF]" : "text-[var(--text-faint)]"}`} strokeWidth={2} />
              <span className="truncate">{p.name}</span>
              <span className="ml-auto text-[11px] text-[var(--text-faint)] tabular-nums">{p.count}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-3 border-t border-[var(--border-faint)]">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-3)] p-3">
          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
            <span className="uppercase tracking-wider">Audit progress</span>
            <span className="tabular-nums text-[var(--text-on-dark)]">62%</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden">
            <div className="h-full w-[62%] bg-[#007AFF]" />
          </div>
          <div className="mt-2 text-[11px] text-[var(--text-faint)]">91 of 147 issues triaged</div>
        </div>
      </div>
    </aside>
  );
}
