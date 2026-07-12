import { ArrowRight } from "lucide-react";

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-10 mb-12">
      <div className="max-w-2xl">
        <div className="text-[11px] uppercase tracking-[0.24em] text-teal-300/80 mb-5">
          {eyebrow}
        </div>
        <h2 className="text-[var(--text-on-dark)] tracking-tight" style={{ fontSize: "38px", lineHeight: 1.1, fontWeight: 500 }}>
          {title}
        </h2>
        {description && (
          <p className="mt-5 text-[var(--text-subtle)] leading-relaxed">{description}</p>
        )}
      </div>
      {action && (
        <button className="hidden md:flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-on-dark)] shrink-0">
          {action}
          <ArrowRight className="size-4" strokeWidth={1.8} />
        </button>
      )}
    </div>
  );
}
