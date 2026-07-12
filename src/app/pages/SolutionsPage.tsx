import { Link } from 'react-router';
import { Search, Building2, Rocket, Users, ArrowRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const roles = [
  {
    id: 'auditors',
    icon: Search,
    label: 'UX Auditors',
    headline: 'Spend less time formatting, more time auditing.',
    benefits: [
      'Structured templates replace blank documents',
      'Auto-generated reports from your findings',
      'White-label deliverables in one click',
    ],
    cta: 'Start as an Auditor',
    accent: 'var(--brand-blue)',
  },
  {
    id: 'agencies',
    icon: Building2,
    label: 'Agencies',
    headline: 'Standardize quality across every engagement.',
    benefits: [
      'Shared methodology for your whole team',
      'Collaborate in real-time on audits',
      'Branded reports under your agency name',
    ],
    cta: 'Grow Your Agency',
    accent: 'var(--brand-teal)',
  },
  {
    id: 'product',
    icon: Rocket,
    label: 'Product Teams',
    headline: 'Catch UX debt before it becomes churn.',
    benefits: [
      'Severity scoring guides what to fix first',
      'Developer-ready specs from audit findings',
      'Jira & Linear sync built in',
    ],
    cta: 'Improve Your Product',
    accent: 'var(--brand-blue)',
  },
  {
    id: 'founders',
    icon: Users,
    label: 'Founders & PMs',
    headline: 'Run a professional audit without a design background.',
    benefits: [
      'Built-in Nielsen\'s 10 and WCAG guidance',
      'Step-by-step audit templates',
      'Shareable reports for investors and teams',
    ],
    cta: 'Audit Your Product',
    accent: 'var(--brand-green)',
  },
];

export function SolutionsPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-14 px-6 bg-[var(--surface-base)] border-b border-[var(--border-on-dark)] text-center">
        <div className="max-w-xl mx-auto">
          <h1 className="text-[var(--text-on-dark)] mb-4">
            {t('solutions.hero.headline')}
          </h1>
          <p className="text-lg text-[var(--text-muted)]">
            Pick your role. See exactly what UX Mosaic does for you.
          </p>
        </div>
      </section>

      {/* Role cards — 2×2 grid, one glance */}
      <section className="py-14 px-6 bg-[var(--surface-base)]">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-5">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className="bg-[var(--surface-2)] rounded-2xl border border-[var(--border-on-dark)] p-7 flex flex-col"
                style={{ boxShadow: 'var(--card-shadow-default)' }}
              >
                {/* Role header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `color-mix(in srgb, ${role.accent} 12%, transparent)` }}
                  >
                    <Icon className="w-4.5 h-4.5" style={{ color: role.accent, width: 18, height: 18 }} strokeWidth={1.8} />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-[var(--text-on-dark-subtle)]">
                    {role.label}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="text-[var(--text-on-dark)] mb-5 leading-snug" style={{ fontSize: '18px' }}>
                  {role.headline}
                </h3>

                {/* 3 key benefits — scannable */}
                <ul className="space-y-2.5 mb-7 flex-1">
                  {role.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <Check
                        className="w-3.5 h-3.5 shrink-0 mt-0.5"
                        style={{ color: role.accent }}
                        strokeWidth={2.5}
                      />
                      <span className="text-sm text-[var(--text-muted)]">{b}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm no-underline transition-colors"
                  style={{ color: role.accent }}
                >
                  {role.cta}
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" strokeWidth={2} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Single bottom CTA */}
      <section className="py-16 px-6 bg-[var(--surface-1)] border-t border-[var(--border-on-dark)] text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="mb-3 text-[var(--text-on-dark)]">
            {t('solutions.overview.headline')}
          </h2>
          <p className="text-[var(--text-muted)] mb-8">
            One platform, every role. Free for 14 days.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue-hover)] transition-colors no-underline"
          >
            Get started free
            <ArrowRight className="w-4 h-4 rtl:rotate-180" strokeWidth={2} />
          </Link>
        </div>
      </section>
    </>
  );
}
