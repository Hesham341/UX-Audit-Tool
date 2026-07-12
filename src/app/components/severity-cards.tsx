import { SectionHeader } from "./section-header";
import { TrendingUp, TrendingDown } from "lucide-react";

const cards = [
  {
    level: "Critical",
    count: 9,
    delta: "+2",
    trend: "up",
    desc: "Block primary flows or block business outcomes. Resolve within the sprint.",
    accent: "from-rose-300/20 via-rose-300/5 to-transparent",
    dot: "bg-rose-300",
  },
  {
    level: "High",
    count: 27,
    delta: "+6",
    trend: "up",
    desc: "Notable friction at scale. Schedule into the next product cycle.",
    accent: "from-amber-200/20 via-amber-200/5 to-transparent",
    dot: "bg-amber-200",
  },
  {
    level: "Medium",
    count: 64,
    delta: "−4",
    trend: "down",
    desc: "Quality and clarity refinements that compound over time.",
    accent: "from-teal-300/20 via-teal-300/5 to-transparent",
    dot: "bg-teal-300",
  },
  {
    level: "Low",
    count: 47,
    delta: "+1",
    trend: "up",
    desc: "Polish items captured for future design system alignment.",
    accent: "from-blue-300/20 via-blue-300/5 to-transparent",
    dot: "bg-blue-300",
  },
];

export function SeverityCards() {
  return (
    <section className="px-10 lg:px-16 py-24 bg-[var(--surface-base)]">
      <SectionHeader
        eyebrow="Severity scoring"
        title="How weight is given to each piece of evidence."
        description="Findings are scored on a calibrated rubric weighing user impact, business risk, frequency, and remediation cost. Numbers below reflect the current audit baseline."
        action="Scoring rubric"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((c) => {
          const Trend = c.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <div
              key={c.level}
              className="relative rounded-[28px] bg-[var(--surface-2)] p-8 overflow-hidden border border-[var(--border-on-dark)]"
              style={{ boxShadow: 'var(--card-shadow-elevated)' }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.accent} pointer-events-none`} />
              <div className="relative">
                <div className="flex items-center gap-2.5">
                  <span className={`size-2 rounded-full ${c.dot}`} />
                  <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
                    {c.level}
                  </span>
                </div>
                <div className="mt-10 flex items-end gap-3">
                  <div className="text-[var(--text-on-dark)] tracking-tight" style={{ fontSize: "64px", lineHeight: 0.95, fontWeight: 500 }}>
                    {c.count}
                  </div>
                  <div className="mb-2 inline-flex items-center gap-1 text-[var(--text-muted)]">
                    <Trend className="size-3.5" strokeWidth={1.8} />
                    {c.delta}
                  </div>
                </div>
                <p className="mt-8 text-[var(--text-subtle)] leading-relaxed">{c.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
