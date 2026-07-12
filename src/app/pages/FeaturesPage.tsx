import { Link } from 'react-router';
import { FileText, Shield, BookOpen, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const cards = [
  {
    icon: FileText,
    title: 'Document Findings',
    description: 'Upload screenshots, document usability issues, and provide actionable recommendations in a structured audit workflow.',
  },
  {
    icon: Shield,
    title: 'Evaluate & Prioritize',
    description: 'Categorize issues, assign severity, priority and effort, apply UX laws, and track status to prioritize improvements effectively.',
  },
  {
    icon: BookOpen,
    title: 'Organize & Report',
    description: 'Filter findings, organize audits, and generate professional reports for stakeholders and clients.',
  },
];

export function FeaturesPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-16 px-6 bg-[var(--surface-base)] border-b border-[var(--border-on-dark)] text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--brand-blue)] mb-4">
            {t('features.badge')}
          </p>
          <h1 className="mb-4 text-[var(--text-on-dark)]">
            {t('features.hero.headline')}
          </h1>
          <p className="text-lg text-[var(--text-muted)] mb-8 leading-relaxed">
            Three steps. One platform. Professional results every time.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue-hover)] transition-colors no-underline"
          >
            {t('features.hero.ctaPrimary')}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" strokeWidth={2} />
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-20 px-6 bg-[var(--surface-base)]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5">
            {cards.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-[var(--surface-2)] rounded-2xl p-7 border border-[var(--border-on-dark)] flex flex-col"
                style={{ boxShadow: 'var(--card-shadow-default)' }}
              >
                {/* Icon block */}
                <div className="w-20 h-20 rounded-2xl bg-[var(--surface-3)] flex items-center justify-center mb-6 shrink-0">
                  <Icon
                    className="w-10 h-10"
                    style={{ color: 'var(--brand-blue)', opacity: 0.75 }}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Text */}
                <h3 className="text-[var(--text-on-dark)] mb-3" style={{ fontSize: '18px', fontWeight: 600 }}>
                  {title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-6 bg-[var(--surface-1)] border-t border-[var(--border-on-dark)] text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="mb-3 text-[var(--text-on-dark)]">{t('features.cta.headline')}</h2>
          <p className="text-[var(--text-muted)] mb-8">
            14-day free trial. No credit card required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue-hover)] transition-colors no-underline"
            >
              {t('features.cta.ctaPrimary')}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" strokeWidth={2} />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center h-11 px-6 rounded-lg border border-[var(--border-on-dark-strong)] bg-[var(--surface-2)] text-[var(--text-on-dark)] hover:bg-[var(--surface-3)] transition-colors no-underline"
            >
              {t('features.cta.ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
