import { SectionHeader } from "./section-header";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const personas = [
  {
    name: "Reem · The expat shopper",
    location: "Dubai, UAE",
    quote: "I buy from three different countries every month. Tracking should just work, in any language.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    traits: ["Bilingual", "Mobile-first", "High frequency"],
  },
  {
    name: "Khaled · The SME owner",
    location: "Amman, Jordan",
    quote: "I ship 40 packages a week. I need bulk tools, not consumer features.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    traits: ["Business", "Power user", "Desktop"],
  },
  {
    name: "Noura · The occasional sender",
    location: "Riyadh, KSA",
    quote: "I only ship a few times a year. The app should remember me without making me set everything up again.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    traits: ["Low frequency", "Arabic-first", "Mobile"],
  },
];

const journey = [
  { stage: "Discover", emotion: 78, note: "Brand recognition is strong across MENA." },
  { stage: "Quote", emotion: 54, note: "Pricing transparency drops on intercity routes." },
  { stage: "Book", emotion: 32, note: "Address picker fails for newer compounds." },
  { stage: "Ship", emotion: 41, note: "Pickup confirmation lacks reassurance copy." },
  { stage: "Track", emotion: 28, note: "Multi-package status confuses returning users." },
  { stage: "Resolve", emotion: 62, note: "Support chat is praised when reached." },
];

export function PersonasJourney() {
  return (
    <section className="px-10 lg:px-16 py-24 bg-[var(--surface-base)]">
      <SectionHeader
        eyebrow="Research artefacts"
        title="The humans, and the path they walk."
        description="Personas and journeys are not decoration — they are the lens every finding is interpreted through. Each is grounded in 24 moderated sessions across three markets."
        action="Open research library"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
        {personas.map((p) => (
          <div
            key={p.name}
            className="rounded-[28px] bg-[var(--surface-2)] border border-[var(--border-on-dark)] overflow-hidden"
            style={{ boxShadow: 'var(--card-shadow-default)' }}
          >
            <div className="relative h-56 overflow-hidden">
              <ImageWithFallback src={p.img} alt={p.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            </div>
            <div className="p-8 relative">
              <div className="text-[11px] uppercase tracking-[0.2em] text-teal-500/80">{p.location}</div>
              <div className="mt-3 text-[var(--text-on-dark)]" style={{ fontSize: "22px", fontWeight: 500 }}>
                {p.name}
              </div>
              <p className="mt-5 text-[var(--text-subtle)] leading-relaxed italic">"{p.quote}"</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {p.traits.map((t) => (
                  <span key={t} className="px-3 py-1.5 rounded-full bg-[var(--surface-hover)] border border-[var(--border-faint)] text-[var(--text-muted)] text-[12px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Journey map */}
      <div className="rounded-[32px] bg-[var(--surface-2)] border border-[var(--border-on-dark)] p-10 overflow-hidden" style={{ boxShadow: 'var(--card-shadow-default)' }}>
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-teal-500/80 mb-3">Journey map · Reem</div>
            <div className="text-[var(--text-on-dark)]" style={{ fontSize: "26px", fontWeight: 500 }}>End-to-end emotion across the shipping experience</div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[var(--text-faint)] text-[13px]">
            <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-teal-400" />Sentiment</span>
            <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-rose-400" />Friction</span>
          </div>
        </div>

        <div className="relative">
          <svg viewBox="0 0 1000 240" className="w-full h-56" preserveAspectRatio="none">
            <defs>
              <linearGradient id="line" x1="0" x2="1">
                <stop offset="0%" stopColor="#5eead4" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
              <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#5eead4" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
              </linearGradient>
            </defs>
            {(() => {
              const pts = journey.map((j, i) => {
                const x = (i / (journey.length - 1)) * 1000;
                const y = 220 - (j.emotion / 100) * 200;
                return [x, y] as const;
              });
              const path = pts
                .map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`))
                .join(" ");
              const area = `${path} L 1000 240 L 0 240 Z`;
              return (
                <>
                  <path d={area} fill="url(#fill)" />
                  <path d={path} stroke="url(#line)" strokeWidth="2.5" fill="none" />
                  {pts.map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="6" fill="var(--surface-2)" stroke="#5eead4" strokeWidth="2" />
                  ))}
                </>
              );
            })()}
          </svg>
        </div>

        <div className="mt-8 grid grid-cols-3 md:grid-cols-6 gap-6">
          {journey.map((j) => (
            <div key={j.stage}>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">{j.stage}</div>
              <div className="mt-2 text-[var(--text-on-dark)]" style={{ fontSize: "20px", fontWeight: 500 }}>{j.emotion}</div>
              <div className="mt-2 text-[var(--text-subtle)] text-[12px] leading-snug">{j.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
