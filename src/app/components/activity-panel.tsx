import { CheckCircle2, MessageSquare, AlertCircle, Camera, GitBranch } from "lucide-react";

const items = [
  { icon: AlertCircle, color: "text-rose-300", who: "Lina H.", action: "raised severity of #042 to Critical", time: "12m" },
  { icon: MessageSquare, color: "text-[#4ea2ff]", who: "Omar K.", action: "commented on #039", time: "1h" },
  { icon: Camera, color: "text-amber-300", who: "Mira T.", action: "added 3 screenshots to #036", time: "3h" },
  { icon: CheckCircle2, color: "text-emerald-300", who: "Yara S.", action: "marked #028 as resolved", time: "yesterday" },
  { icon: GitBranch, color: "text-[var(--text-subtle)]", who: "Lina H.", action: "linked #022 to Jira PROD-481", time: "2d" },
];

export function ActivityPanel() {
  return (
    <aside className="hidden 2xl:flex w-[320px] shrink-0 flex-col border-l border-[var(--border-faint)] bg-[var(--surface-1)]">
      <div className="px-5 h-12 border-b border-[var(--border-faint)] flex items-center justify-between">
        <div className="text-[13px] text-[var(--text-on-dark)]">Activity</div>
        <button className="text-[12px] text-[var(--text-subtle)] hover:text-[var(--text-on-dark)]">View all</button>
      </div>

      <div className="p-5 space-y-4 overflow-y-auto">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <div key={i} className="flex gap-3">
              <div className={`size-7 shrink-0 rounded-full bg-[var(--surface-3)] border border-[var(--border-faint)] grid place-items-center ${it.color}`}>
                <Icon className="size-3.5" strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] text-[var(--text-muted)] leading-snug">
                  <span className="text-[var(--text-on-dark)]">{it.who}</span>{" "}
                  <span className="text-[var(--text-muted)]">{it.action}</span>
                </div>
                <div className="mt-0.5 text-[11px] text-[var(--text-faint)]">{it.time}</div>
              </div>
            </div>
          );
        })}

        <div className="mt-2 pt-4 border-t border-[var(--border-faint)]">
          <div className="text-[11px] uppercase tracking-wider text-[var(--text-faint)] mb-3">Collaborators online</div>
          <div className="space-y-2.5">
            {[
              { n: "Lina Haddad", r: "Editing #042", c: "from-[#007AFF] to-[#5856d6]", i: "LH" },
              { n: "Omar Khalil", r: "Reviewing", c: "from-emerald-400 to-teal-500", i: "OK" },
              { n: "Mira Tabbara", r: "Viewing report", c: "from-amber-400 to-orange-500", i: "MT" },
            ].map((p) => (
              <div key={p.n} className="flex items-center gap-2.5">
                <div className="relative">
                  <div className={`size-7 rounded-full bg-gradient-to-br ${p.c} grid place-items-center text-[10px] text-white`}>
                    {p.i}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 border-2 border-[var(--surface-1)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] text-[var(--text-on-dark)] truncate">{p.n}</div>
                  <div className="text-[11px] text-[var(--text-faint)] truncate">{p.r}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
