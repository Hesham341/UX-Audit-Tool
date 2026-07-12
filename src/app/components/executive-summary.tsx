import { SectionHeader } from "./section-header";
import { ArrowUpRight, Quote } from "lucide-react";
import { MosaicPattern } from "./mosaic-pattern";

const highlights = [
  { label: "Projected uplift", value: "+18%", note: "Checkout completion if critical issues resolved." },
  { label: "Annualised value", value: "$2.4M", note: "Estimated revenue recovery in MENA markets." },
  { label: "Effort required", value: "11 sprints", note: "Across product, design, and content teams." },
];

export function ExecutiveSummary() {
  return (
    <section className="px-10 lg:px-16 py-24 bg-[var(--surface-base)]">
      <SectionHeader
        eyebrow="Executive readout"
        title="The story leadership will read first."
        description="Every audit ends with a concise narrative — what we saw, what it costs the business, what we recommend, and how confident we are. Designed to be read in twelve minutes."
        action="Open full report"
      />

      <div className="relative rounded-[32px] overflow-hidden border border-[var(--border-on-dark)] bg-[var(--surface-2)]" style={{ boxShadow: 'var(--card-shadow-elevated)' }}>
        <MosaicPattern className="-bottom-20 -left-20 w-[500px] h-[500px] opacity-30" />
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 p-12 lg:p-16">
          <div className="lg:col-span-7">
            <Quote className="size-8 text-teal-500/60 mb-8" strokeWidth={1.4} />
            <p className="text-[var(--text-on-dark)] leading-[1.35]" style={{ fontSize: "30px", fontWeight: 400 }}>
              Aramex's digital experience is competent but emotionally flat. The
              audit surfaces nine critical issues clustered around{" "}
              <span className="text-teal-600 italic">checkout, tracking and locale parity</span>{" "}
              — addressing them unlocks measurable revenue and rebuilds trust with
              high-frequency MENA users.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <div className="size-11 rounded-full bg-gradient-to-br from-teal-300 to-blue-400 grid place-items-center text-[#0c1726]">
                LH
              </div>
              <div>
                <div className="text-[var(--text-on-dark)]">Lina Haddad</div>
                <div className="text-[var(--text-faint)] text-[13px]">Lead UX Researcher · Mosaic</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="rounded-2xl bg-[var(--surface-3)] border border-[var(--border-on-dark)] p-7 flex items-center gap-6"
              >
                <div className="flex-1">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)]">{h.label}</div>
                  <div className="mt-2 text-[var(--text-on-dark)] tracking-tight" style={{ fontSize: "32px", lineHeight: 1, fontWeight: 500 }}>
                    {h.value}
                  </div>
                  <div className="mt-3 text-[var(--text-subtle)] text-[13px] leading-snug">{h.note}</div>
                </div>
              </div>
            ))}
            <button className="mt-2 w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[var(--brand-teal)] text-white hover:opacity-90 transition-opacity">
              Share with stakeholders
              <ArrowUpRight className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
