import { SectionHeader } from "./section-header";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Camera, Maximize2, MessageCircle } from "lucide-react";

const captures = [
  {
    title: "Checkout · Shipping step",
    surface: "iOS 17 · Arabic",
    notes: 12,
    img: "https://images.unsplash.com/photo-1545239351-cefa43af60f3?w=800",
    severity: "Critical",
    sevColor: "bg-rose-300",
  },
  {
    title: "Order tracking timeline",
    surface: "Android 14 · English",
    notes: 7,
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    severity: "High",
    sevColor: "bg-amber-200",
  },
  {
    title: "Dashboard overview",
    surface: "Web · Desktop",
    notes: 5,
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    severity: "Medium",
    sevColor: "bg-teal-300",
  },
];

export function ScreenshotSection() {
  return (
    <section className="px-10 lg:px-16 py-24 bg-[var(--surface-base)]">
      <SectionHeader
        eyebrow="Capture studio"
        title="Annotated evidence, one source of truth."
        description="Researchers capture surfaces directly inside the platform, mark friction with regional context, and link each screenshot to the originating finding."
        action="Open capture studio"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {captures.map((c) => (
          <div
            key={c.title}
            className="group rounded-[28px] bg-[var(--surface-2)] border border-[var(--border-on-dark)] overflow-hidden"
            style={{ boxShadow: 'var(--card-shadow-elevated)' }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src={c.img}
                alt={c.title}
                className="w-full h-full object-cover opacity-90 group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                <span className={`size-1.5 rounded-full ${c.sevColor}`} />
                <span className="text-[11px] uppercase tracking-[0.18em] text-white/85">{c.severity}</span>
              </div>
              <button className="absolute top-5 right-5 size-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 grid place-items-center text-white/85 hover:bg-black/60">
                <Maximize2 className="size-3.5" strokeWidth={1.8} />
              </button>
            </div>
            <div className="p-7">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)]">{c.surface}</div>
              <div className="mt-3 text-[var(--text-on-dark)] leading-snug">{c.title}</div>
              <div className="mt-6 flex items-center justify-between text-[var(--text-subtle)]">
                <div className="inline-flex items-center gap-2">
                  <MessageCircle className="size-4" strokeWidth={1.6} />
                  {c.notes} annotations
                </div>
                <div className="inline-flex items-center gap-2">
                  <Camera className="size-4" strokeWidth={1.6} />
                  Captured today
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
