import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  ZoomIn,
  MessageSquare,
  Paperclip,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  MapPin,
  Plus,
} from "lucide-react";

export type Severity = "Critical" | "High" | "Medium" | "Low";

export type Issue = {
  number: string;
  title: string;
  severity: Severity;
  status: string;
  priority: string;
  effort: string;
  category: string;
  uxLaw: string;
  surface: string;
  tags: string[];
  author: { name: string; initials: string; color: string };
  assignee: { name: string; initials: string; color: string };
  comments: number;
  description: string;
  recommendation: string;
  screenshots: { src: string; annotations: number }[];
  expanded?: boolean;
};

const sevConfig: Record<Severity, { bg: string; text: string; dot: string; border: string }> = {
  Critical: { bg: "bg-rose-500/10", text: "text-rose-300", dot: "bg-rose-400", border: "border-rose-500/25" },
  High:     { bg: "bg-amber-500/10", text: "text-amber-200", dot: "bg-amber-300", border: "border-amber-500/25" },
  Medium:   { bg: "bg-[#007AFF]/12", text: "text-[#4ea2ff]", dot: "bg-[#007AFF]", border: "border-[#007AFF]/25" },
  Low:      { bg: "bg-[var(--surface-hover-medium)]", text: "text-[var(--text-muted)]", dot: "bg-[var(--text-subtle)]", border: "border-[var(--border-default)]" },
};

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <button className="h-6 pl-1.5 pr-1 rounded border border-[var(--border-subtle)] bg-[var(--surface-3)] text-[11px] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)] flex items-center gap-1">
      <span className="text-[var(--text-faint)]">{label}</span>
      <span>{value}</span>
      <ChevronDown className="size-2.5 text-[var(--text-faint)]" strokeWidth={2} />
    </button>
  );
}

export function IssueCard({ issue }: { issue: Issue }) {
  const sev = sevConfig[issue.severity];
  const expanded = issue.expanded ?? false;

  return (
    <article className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-2)] overflow-hidden" style={{ boxShadow: 'var(--card-shadow-default)' }}>
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 h-12 border-b border-[var(--border-faint)] bg-[var(--surface-1)]">
        <div className="flex items-center justify-center min-w-10 h-7 rounded-md bg-[var(--surface-3)] border border-[var(--border-subtle)] text-[12px] text-[var(--text-muted)] tabular-nums px-2">
          {issue.number}
        </div>
        <div className={`inline-flex items-center gap-1.5 h-6 px-2 rounded-md border ${sev.border} ${sev.bg} ${sev.text} text-[11px]`}>
          <span className={`size-1.5 rounded-full ${sev.dot}`} />
          {issue.severity}
        </div>
        <div className="text-[13px] text-[var(--text-on-dark)] truncate flex-1 min-w-0">{issue.title}</div>

        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[var(--text-subtle)]">
          <MapPin className="size-3" strokeWidth={1.8} />
          {issue.surface}
        </div>

        <div className="flex items-center gap-1">
          <button className="size-7 grid place-items-center rounded-md text-[var(--text-faint)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover)]">
            <MessageSquare className="size-3.5" strokeWidth={1.8} />
          </button>
          <span className="text-[11px] text-[var(--text-faint)] tabular-nums -ml-0.5 mr-1">{issue.comments}</span>
          <button className="size-7 grid place-items-center rounded-md text-[var(--text-faint)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover)]">
            <MoreHorizontal className="size-4" strokeWidth={1.8} />
          </button>
          <button className="h-7 px-2 rounded-md text-[12px] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover)] flex items-center gap-1">
            {expanded ? <ChevronUp className="size-3.5" strokeWidth={1.8} /> : <ChevronDown className="size-3.5" strokeWidth={1.8} />}
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Screenshots */}
        <div className="lg:col-span-7 p-4 border-b lg:border-b-0 lg:border-r border-[var(--border-faint)]">
          <div className="relative rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-3)] group">
            <div className="aspect-[16/9]">
              <ImageWithFallback
                src={issue.screenshots[0].src}
                alt={issue.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Annotation pins — always on image, keep dark ring for visibility against image */}
            <div className="absolute top-[28%] left-[18%] size-6 rounded-full bg-[#007AFF] text-white grid place-items-center text-[11px] shadow-lg shadow-black/40 ring-2 ring-black/20">1</div>
            <div className="absolute top-[55%] left-[62%] size-6 rounded-full bg-rose-500 text-white grid place-items-center text-[11px] shadow-lg shadow-black/40 ring-2 ring-black/20">2</div>
            <div className="absolute top-[42%] left-[78%] size-6 rounded-full bg-amber-400 text-white grid place-items-center text-[11px] shadow-lg shadow-black/40 ring-2 ring-black/20">3</div>

            <button className="absolute top-3 right-3 h-7 px-2.5 rounded-md bg-black/55 backdrop-blur-sm border border-white/15 text-[11px] text-white flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="size-3.5" strokeWidth={1.8} />
              Zoom
            </button>
            <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 h-6 px-2 rounded-md bg-black/55 backdrop-blur-sm border border-white/10 text-[11px] text-white/85">
              <Paperclip className="size-3" strokeWidth={1.8} />
              {issue.screenshots[0].annotations} annotations
            </div>
          </div>

          {/* Thumbnails */}
          <div className="mt-3 flex items-center gap-2">
            {issue.screenshots.map((s, i) => (
              <button
                key={i}
                className={`relative h-14 w-20 rounded-md overflow-hidden border ${
                  i === 0 ? "border-[#007AFF]" : "border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
                }`}
              >
                <ImageWithFallback src={s.src} alt="" className="w-full h-full object-cover" />
                {s.annotations > 0 && (
                  <span className="absolute top-1 right-1 size-4 rounded-full bg-black/60 border border-white/15 text-[9px] text-white grid place-items-center">
                    {s.annotations}
                  </span>
                )}
              </button>
            ))}
            <button className="h-14 w-20 rounded-md border border-dashed border-[var(--border-default)] text-[var(--text-faint)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)] grid place-items-center">
              <Plus className="size-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Details panel */}
        <div className="lg:col-span-5 p-5 space-y-5">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[var(--text-faint)] mb-1.5">Description</div>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">{issue.description}</p>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-[var(--text-faint)] mb-1.5">Recommendation</div>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">{issue.recommendation}</p>
            <button className="mt-2.5 h-7 px-2.5 rounded-md border border-dashed border-[var(--border-default)] text-[12px] text-[var(--text-subtle)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)] flex items-center gap-1.5">
              <Plus className="size-3" strokeWidth={1.8} />
              Add visual recommendation
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-3 pt-1">
            <Meta label="Priority" value={issue.priority} />
            <Meta label="Effort" value={issue.effort} />
            <Meta label="Status" value={issue.status} />
            <Meta label="Category" value={issue.category} />
            <Meta label="UX law" value={issue.uxLaw} wide />
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-[var(--text-faint)] mb-1.5">Tags</div>
            <div className="flex flex-wrap gap-1.5">
              {issue.tags.map((t) => (
                <span key={t} className="h-6 px-2 rounded border border-[var(--border-subtle)] bg-[var(--surface-3)] text-[11px] text-[var(--text-muted)] inline-flex items-center">
                  {t}
                </span>
              ))}
              <button className="h-6 px-2 rounded border border-dashed border-[var(--border-default)] text-[11px] text-[var(--text-faint)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)] inline-flex items-center gap-1">
                <Plus className="size-3" strokeWidth={1.8} />
                Add
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="text-[11px] text-[var(--text-faint)]">By</div>
                <div className={`size-5 rounded-full bg-gradient-to-br ${issue.author.color} grid place-items-center text-[9px] text-white`}>
                  {issue.author.initials}
                </div>
                <div className="text-[12px] text-[var(--text-muted)]">{issue.author.name}</div>
              </div>
              <div className="w-px h-3 bg-[var(--border-default)]" />
              <div className="flex items-center gap-1.5">
                <div className="text-[11px] text-[var(--text-faint)]">Assigned</div>
                <div className={`size-5 rounded-full bg-gradient-to-br ${issue.assignee.color} grid place-items-center text-[9px] text-white`}>
                  {issue.assignee.initials}
                </div>
                <div className="text-[12px] text-[var(--text-muted)]">{issue.assignee.name}</div>
              </div>
            </div>
            <button className="h-7 px-2.5 rounded-md text-[12px] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover)] flex items-center gap-1.5">
              <MessageSquare className="size-3.5" strokeWidth={1.8} />
              {issue.comments}
            </button>
          </div>
        </div>
      </div>

      {/* Pill row */}
      <div className="px-4 py-2.5 border-t border-[var(--border-faint)] flex items-center gap-1.5 flex-wrap bg-[var(--surface-1)]">
        <Pill label="Priority" value={issue.priority} />
        <Pill label="Effort" value={issue.effort} />
        <Pill label="Status" value={issue.status} />
        <Pill label="Category" value={issue.category} />
        <Pill label="UX Law" value={issue.uxLaw} />
        <div className="ml-auto text-[11px] text-[var(--text-faint)]">Updated 12 min ago</div>
      </div>
    </article>
  );
}

function Meta({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <div className="text-[11px] uppercase tracking-wider text-[var(--text-faint)] mb-1">{label}</div>
      <button className="w-full h-8 px-2.5 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-3)] text-[12px] text-[var(--text-muted)] hover:border-[var(--border-hover)] flex items-center justify-between">
        <span>{value}</span>
        <ChevronDown className="size-3 text-[var(--text-faint)]" strokeWidth={1.8} />
      </button>
    </div>
  );
}
