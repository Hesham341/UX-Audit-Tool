import { SectionHeader } from "./section-header";
import { FileText, Layers, Compass, Accessibility, ShoppingBag, Smartphone, ArrowUpRight } from "lucide-react";

const templates = [
  { icon: Layers, name: "Nielsen 10 Heuristics", count: "10 heuristics · 42 prompts", color: "from-teal-300/20 to-transparent" },
  { icon: Accessibility, name: "WCAG 2.2 Accessibility", count: "13 guidelines · 78 prompts", color: "from-blue-300/20 to-transparent" },
  { icon: ShoppingBag, name: "E-commerce Conversion", count: "8 stages · 56 prompts", color: "from-amber-200/20 to-transparent" },
  { icon: Smartphone, name: "Mobile-first Review", count: "6 surfaces · 38 prompts", color: "from-rose-300/15 to-transparent" },
  { icon: Compass, name: "MENA Localisation", count: "5 dimensions · 22 prompts", color: "from-emerald-300/15 to-transparent" },
  { icon: FileText, name: "Executive Briefing", count: "Report · 12 sections", color: "from-violet-300/15 to-transparent" },
];

export function TemplatesSection() {
  return (
    <section className="px-10 lg:px-16 py-24 bg-[var(--surface-base)]">
      <SectionHeader
        eyebrow="Audit templates"
        title="Pre-calibrated playbooks the team starts from."
        description="Every engagement begins from a template Mosaic has hardened over hundreds of audits. Researchers adapt prompts to the brand and the region."
        action="Browse library"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.name}
              className="relative rounded-[28px] bg-[var(--surface-2)] border border-[var(--border-on-dark)] p-8 overflow-hidden hover:border-[var(--brand-blue)]/40 transition-colors group cursor-pointer"
              style={{ boxShadow: 'var(--card-shadow-default)' }}
            >
              <div className={`absolute -top-20 -right-20 size-60 rounded-full bg-gradient-to-br ${t.color} blur-2xl pointer-events-none`} />
              <div className="relative">
                <div className="size-12 rounded-2xl bg-[var(--surface-hover-medium)] border border-[var(--border-subtle)] grid place-items-center">
                  <Icon className="size-5 text-teal-500" strokeWidth={1.6} />
                </div>
                <div className="mt-8 text-[var(--text-on-dark)] leading-snug" style={{ fontSize: "20px", fontWeight: 500 }}>
                  {t.name}
                </div>
                <div className="mt-3 text-[var(--text-faint)]">{t.count}</div>
                <div className="mt-10 flex items-center justify-between">
                  <div className="text-[var(--text-subtle)]">Use template</div>
                  <ArrowUpRight className="size-4 text-[var(--text-subtle)] group-hover:text-[var(--text-on-dark)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.8} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
