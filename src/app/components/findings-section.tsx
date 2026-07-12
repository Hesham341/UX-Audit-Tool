import { SectionHeader } from "./section-header";
import { Flag, Filter, ChevronRight } from "lucide-react";

const sevStyles: Record<string, { ring: string; dot: string; text: string }> = {
  Critical: { ring: "ring-rose-300/30", dot: "bg-rose-300", text: "text-rose-400" },
  High: { ring: "ring-amber-200/30", dot: "bg-amber-200", text: "text-amber-500" },
  Medium: { ring: "ring-teal-300/30", dot: "bg-teal-300", text: "text-teal-600" },
  Low: { ring: "ring-blue-300/30", dot: "bg-blue-300", text: "text-blue-500" },
};

const findings = [
  {
    code: "F-042",
    severity: "Critical",
    title: "Checkout abandons users on shipping step in Arabic locale",
    surface: "Web · Checkout",
    heuristic: "Match between system & real world",
    owner: "Lina",
    avatar: "L",
  },
  {
    code: "F-039",
    severity: "High",
    title: "Tracking screen lacks status hierarchy for multi-package orders",
    surface: "Mobile · Tracking",
    heuristic: "Visibility of system status",
    owner: "Omar",
    avatar: "O",
  },
  {
    code: "F-036",
    severity: "Medium",
    title: "Empty state on saved addresses confuses returning users",
    surface: "Web · Profile",
    heuristic: "Recognition rather than recall",
    owner: "Mira",
    avatar: "M",
  },
  {
    code: "F-031",
    severity: "Low",
    title: "Inconsistent iconography between dashboard and settings",
    surface: "Web · Dashboard",
    heuristic: "Consistency & standards",
    owner: "Yara",
    avatar: "Y",
  },
];

export function FindingsSection() {
  return (
    <section className="px-10 lg:px-16 py-24 bg-[var(--surface-base)]">
      <SectionHeader
        eyebrow="Findings · 147 logged"
        title="A living catalogue of every observed friction."
        description="Each finding is tied to a heuristic, a surface, and an owner. The team triages weekly and routes critical issues to product leads within 48 hours."
        action="Open findings board"
      />

      <div className="flex items-center gap-3 mb-8 flex-wrap">
        {["All", "Critical", "High", "Medium", "Low"].map((f, i) => (
          <button
            key={f}
            className={`px-5 py-2 rounded-full border ${
              i === 0
                ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                : "border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover)] transition-colors"
            }`}
          >
            {f}
          </button>
        ))}
        <button className="ml-auto flex items-center gap-2 px-5 py-2 rounded-full border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] transition-colors">
          <Filter className="size-4" strokeWidth={1.6} />
          Filter
        </button>
      </div>

      <div className="rounded-[28px] border border-[var(--border-on-dark)] overflow-hidden divide-y divide-[var(--border-on-dark)]" style={{ boxShadow: 'var(--card-shadow-default)' }}>
        {findings.map((f) => {
          const s = sevStyles[f.severity];
          return (
            <div
              key={f.code}
              className="grid grid-cols-12 gap-6 items-center px-8 py-7 bg-[var(--surface-2)] hover:bg-[var(--surface-hover)] transition-colors group"
            >
              <div className="col-span-1 text-[var(--text-faint)] tracking-wider">{f.code}</div>
              <div className="col-span-2">
                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ring-1 ${s.ring} ${s.text}`}>
                  <span className={`size-1.5 rounded-full ${s.dot}`} />
                  {f.severity}
                </div>
              </div>
              <div className="col-span-5">
                <div className="text-[var(--text-on-dark)] leading-snug">{f.title}</div>
                <div className="mt-1.5 text-[var(--text-faint)] text-[13px]">{f.heuristic}</div>
              </div>
              <div className="col-span-2 text-[var(--text-subtle)]">{f.surface}</div>
              <div className="col-span-2 flex items-center justify-end gap-3">
                <div className="size-8 rounded-full bg-gradient-to-br from-blue-400 to-teal-300 grid place-items-center text-[#0c1726]">
                  {f.avatar}
                </div>
                <ChevronRight className="size-4 text-[var(--text-faint)] group-hover:text-[var(--text-muted)] transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex items-center gap-2 text-[var(--text-faint)]">
        <Flag className="size-4" strokeWidth={1.6} />
        <span>Showing 4 of 147 findings · Updated 12 minutes ago</span>
      </div>
    </section>
  );
}
