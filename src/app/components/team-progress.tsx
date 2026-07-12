import { SectionHeader } from "./section-header";
import { CheckCircle2, Circle, Clock3 } from "lucide-react";

const team = [
  { name: "Lina Haddad", role: "Lead UX Researcher", load: "On 4 audits", initials: "LH", color: "from-teal-300 to-blue-400" },
  { name: "Omar Khalil", role: "Senior UX Strategist", load: "On 2 audits", initials: "OK", color: "from-blue-400 to-indigo-400" },
  { name: "Mira Tabbara", role: "Accessibility Specialist", load: "On 3 audits", initials: "MT", color: "from-emerald-300 to-teal-400" },
  { name: "Yara Saleh", role: "Service Designer", load: "On 2 audits", initials: "YS", color: "from-amber-200 to-rose-300" },
];

const phases = [
  { name: "Scoping & calibration", status: "done", note: "Completed · 14 Apr" },
  { name: "Heuristic review", status: "done", note: "Completed · 28 Apr" },
  { name: "Field & moderated sessions", status: "active", note: "In progress · 9 of 12 sessions" },
  { name: "Synthesis & severity scoring", status: "next", note: "Begins · 03 Jun" },
  { name: "Executive readout", status: "next", note: "Scheduled · 18 Jun" },
];

export function TeamProgress() {
  return (
    <section className="px-10 lg:px-16 py-24 bg-[var(--surface-base)]">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-7">
          <SectionHeader
            eyebrow="Audit timeline"
            title="A five-phase rhythm, paced for clarity."
            description="Mosaic structures every audit into deliberate phases — calibration, evidence, synthesis, recommendation. Progress is shared with stakeholders in real time."
          />

          <div className="rounded-[28px] bg-[var(--surface-2)] border border-[var(--border-on-dark)] p-3" style={{ boxShadow: 'var(--card-shadow-default)' }}>
            <div className="divide-y divide-[var(--border-faint)]">
              {phases.map((p, i) => {
                const Icon = p.status === "done" ? CheckCircle2 : p.status === "active" ? Clock3 : Circle;
                const color =
                  p.status === "done"
                    ? "text-teal-500"
                    : p.status === "active"
                    ? "text-amber-500"
                    : "text-[var(--text-faint)]";
                return (
                  <div key={p.name} className="flex items-center gap-6 px-6 py-6">
                    <div className="text-[var(--text-placeholder)] tracking-wider w-8">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <Icon className={`size-5 ${color}`} strokeWidth={1.6} />
                    <div className="flex-1">
                      <div className="text-[var(--text-on-dark)]">{p.name}</div>
                      <div className="mt-1 text-[var(--text-faint)] text-[13px]">{p.note}</div>
                    </div>
                    {p.status === "active" && (
                      <div className="hidden sm:block w-44 h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                        <div className="h-full w-[68%] bg-gradient-to-r from-teal-400 to-blue-400" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="xl:col-span-5">
          <SectionHeader
            eyebrow="The team"
            title="Specialists assigned to this engagement."
            action="View all"
          />

          <div className="rounded-[28px] bg-[var(--surface-2)] border border-[var(--border-on-dark)] divide-y divide-[var(--border-faint)]" style={{ boxShadow: 'var(--card-shadow-default)' }}>
            {team.map((m) => (
              <div key={m.name} className="flex items-center gap-5 px-7 py-6">
                <div className={`size-12 rounded-2xl bg-gradient-to-br ${m.color} grid place-items-center text-[#0c1726]`}>
                  {m.initials}
                </div>
                <div className="flex-1">
                  <div className="text-[var(--text-on-dark)]">{m.name}</div>
                  <div className="mt-0.5 text-[var(--text-faint)] text-[13px]">{m.role}</div>
                </div>
                <div className="text-[var(--text-subtle)] text-[13px]">{m.load}</div>
              </div>
            ))}
          </div>

          <button className="mt-6 w-full py-4 rounded-2xl border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover)] transition-colors">
            Invite collaborator
          </button>
        </div>
      </div>
    </section>
  );
}
