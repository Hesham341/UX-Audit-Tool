import {
  LayoutDashboard,
  ClipboardList,
  AlertTriangle,
  Camera,
  FileText,
  Users,
  Activity,
  ScrollText,
  UserCircle2,
  Map,
  Settings,
  LogOut,
} from "lucide-react";
import logoSrc from '../../imports/Logo.png';

const nav = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: ClipboardList, label: "Audits" },
  { icon: AlertTriangle, label: "Findings" },
  { icon: Camera, label: "Captures" },
  { icon: FileText, label: "Templates" },
  { icon: UserCircle2, label: "Personas" },
  { icon: Map, label: "Journeys" },
  { icon: ScrollText, label: "Reports" },
  { icon: Users, label: "Team" },
  { icon: Activity, label: "Activity" },
];

export function SidebarNav() {
  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col justify-between px-6 py-8 border-r border-[var(--border-faint)]">
      <div>
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="size-9 rounded-xl overflow-hidden shrink-0">
            <img src={logoSrc} alt="UX Mosaic Logo" className="w-full h-full object-cover scale-[1.25]" />
          </div>
          <div>
            <div className="text-[var(--text-on-dark)] tracking-tight">Mosaic</div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)]">UX Audit</div>
          </div>
        </div>

        <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-placeholder)] px-3 mb-4">
          Workspace
        </div>
        <nav className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  item.active
                    ? "bg-[var(--surface-hover-medium)] text-[var(--text-on-dark)]"
                    : "text-[var(--text-subtle)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <Icon className="size-[18px]" strokeWidth={1.6} />
                <span>{item.label}</span>
                {item.active && (
                  <span className="ml-auto size-1.5 rounded-full bg-teal-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-1 pt-6 border-t border-[var(--border-faint)]">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-subtle)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover)]">
          <Settings className="size-[18px]" strokeWidth={1.6} />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-subtle)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover)]">
          <LogOut className="size-[18px]" strokeWidth={1.6} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
