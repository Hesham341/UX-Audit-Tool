import { ChevronRight, Download, Star, MoreHorizontal, Users } from "lucide-react";

export function ReportHeader() {
  const team = [
    { i: "LH", c: "from-[#007AFF] to-[#5856d6]" },
    { i: "OK", c: "from-emerald-400 to-teal-500" },
    { i: "MT", c: "from-amber-400 to-orange-500" },
    { i: "YS", c: "from-rose-400 to-pink-500" },
  ];
  return (
    <div className="px-8 pt-8 pb-6 border-b border-[var(--border-on-dark)]">
      <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-faint)] mb-5">
        <span>Projects</span>
        <ChevronRight className="size-3" strokeWidth={1.8} />
        <span>Aramex</span>
        <ChevronRight className="size-3" strokeWidth={1.8} />
        <span className="text-[var(--text-muted)]">Q2 Heuristic Audit</span>
      </div>

      <div className="flex items-start justify-between gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-[var(--text-on-dark)] tracking-tight" style={{ fontSize: "26px", fontWeight: 500 }}>
              Aramex · Q2 Heuristic Audit
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 h-6 rounded-md bg-[#007AFF]/12 text-[#4ea2ff] text-[11px] border border-[#007AFF]/20">
              <span className="size-1.5 rounded-full bg-[#007AFF]" />
              In review
            </span>
            <button className="size-7 grid place-items-center rounded-md text-[var(--text-faint)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover)]">
              <Star className="size-3.5" strokeWidth={1.8} />
            </button>
          </div>
          <p className="mt-3 text-[13px] text-[var(--text-subtle)] leading-relaxed max-w-3xl">
            A heuristic and accessibility review of 14 product surfaces across web and mobile, with regional emphasis on
            MENA users. This report consolidates 147 issues into prioritised recommendations for the next two product cycles.
          </p>

          <div className="mt-5 flex items-center gap-5 text-[12px] text-[var(--text-subtle)]">
            <span>Last updated <span className="text-[var(--text-on-dark)]">12 min ago</span></span>
            <span className="w-px h-3 bg-[var(--border-default)]" />
            <span>Owner <span className="text-[var(--text-on-dark)]">Lina Haddad</span></span>
            <span className="w-px h-3 bg-[var(--border-default)]" />
            <span>Template <span className="text-[var(--text-on-dark)]">Nielsen 10 + WCAG 2.2</span></span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex -space-x-1.5 mr-1">
            {team.map((m) => (
              <div
                key={m.i}
                className={`size-7 rounded-full bg-gradient-to-br ${m.c} grid place-items-center text-[10px] text-white border-2 border-[var(--surface-base)]`}
              >
                {m.i}
              </div>
            ))}
            <div className="size-7 rounded-full bg-[var(--surface-3)] border-2 border-[var(--surface-base)] grid place-items-center text-[10px] text-[var(--text-subtle)]">
              +3
            </div>
          </div>
          <button className="h-8 px-2.5 rounded-md text-[12px] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover)] flex items-center gap-1.5 border border-[var(--border-subtle)]">
            <Users className="size-3.5" strokeWidth={1.8} />
            Invite
          </button>
          <button className="h-8 px-2.5 rounded-md text-[12px] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover)] flex items-center gap-1.5 border border-[var(--border-subtle)]">
            <Download className="size-3.5" strokeWidth={1.8} />
            Export report
          </button>
          <button className="size-8 grid place-items-center rounded-md text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover)] border border-[var(--border-subtle)]">
            <MoreHorizontal className="size-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* progress strip */}
      <div className="mt-7 grid grid-cols-4 gap-px rounded-lg overflow-hidden border border-[var(--border-on-dark)] bg-[var(--border-on-dark)]">
        {[
          { l: "Total issues", v: "147" },
          { l: "Triaged", v: "91", sub: "62%" },
          { l: "Critical open", v: "9", sub: "3 unassigned" },
          { l: "Avg. resolution effort", v: "M", sub: "Medium" },
        ].map((s) => (
          <div key={s.l} className="bg-[var(--surface-2)] px-4 py-3 flex flex-col gap-0.5">
            <div className="text-[11px] uppercase tracking-wider text-[var(--text-faint)]">{s.l}</div>
            <div className="flex items-baseline gap-2">
              <div className="text-[var(--text-on-dark)] tabular-nums" style={{ fontSize: "20px", fontWeight: 500 }}>
                {s.v}
              </div>
              {s.sub && <div className="text-[11px] text-[var(--text-faint)]">{s.sub}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
