import { ArrowUpRight, Sparkles } from "lucide-react";
import { MosaicPattern } from "./mosaic-pattern";

const metrics = [
  { label: "Audit progress", value: "62%", sub: "On track · 18 days left" },
  { label: "Findings logged", value: "147", sub: "32 new this week" },
  { label: "Critical issues", value: "09", sub: "3 awaiting triage" },
  { label: "Heuristic coverage", value: "84%", sub: "Nielsen + custom set" },
];

export function HeroOverview() {
  return (
    <section className="relative px-10 lg:px-16 pt-14 pb-20 overflow-hidden">
      <MosaicPattern className="-top-10 -right-10 w-[520px] h-[520px] opacity-80" />

      <div className="relative max-w-6xl">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-teal-500/70 mb-8">
          <Sparkles className="size-3.5" strokeWidth={1.8} />
          <span>UX Audit · Enterprise engagement</span>
        </div>

        <h1 className="text-[var(--text-on-dark)] tracking-tight max-w-3xl" style={{ fontSize: "60px", lineHeight: 1.05, fontWeight: 500 }}>
          A strategic review of <span className="text-teal-600/90 italic">Aramex</span>'s digital experience, end to end.
        </h1>

        <p className="mt-8 max-w-2xl text-[var(--text-subtle)] leading-relaxed">
          Mosaic's research team is auditing 14 product surfaces across web and
          mobile, mapping friction against business outcomes and the regional
          context of MENA users. This is the live workspace.
        </p>

        <div className="mt-12 flex items-center gap-4">
          <button className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--text-on-dark)] text-[var(--surface-base)] hover:opacity-90 transition-opacity">
            Continue audit
            <ArrowUpRight className="size-4" strokeWidth={2} />
          </button>
          <button className="px-7 py-3.5 rounded-full border border-[var(--border-default)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)] transition-colors">
            View executive brief
          </button>
        </div>
      </div>

      <div className="relative mt-20 grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border-on-dark)] rounded-[28px] overflow-hidden" style={{ boxShadow: 'var(--card-shadow-default)' }}>
        {metrics.map((m) => (
          <div key={m.label} className="bg-[var(--surface-2)] p-8">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-faint)] mb-6">
              {m.label}
            </div>
            <div className="text-[var(--text-on-dark)] tracking-tight" style={{ fontSize: "40px", lineHeight: 1, fontWeight: 500 }}>
              {m.value}
            </div>
            <div className="mt-4 text-[var(--text-subtle)]">{m.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
