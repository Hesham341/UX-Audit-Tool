import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link } from 'react-router';
import { Check, X, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    monthly: '$29',
    annual: '$23',
    description: 'For independent UX auditors and consultants getting started.',
    features: [
      'Unlimited audits',
      'Screenshot annotation',
      'Nielsen & WCAG heuristics',
      'PDF & Word export',
      '5 GB storage',
      'Email support',
    ],
    cta: 'startFreeTrial',
    highlighted: false,
  },
  {
    name: 'Professional',
    monthly: '$79',
    annual: '$63',
    description: 'For UX teams and agencies who need collaboration and white-labeling.',
    features: [
      'Everything in Starter',
      'Team collaboration (up to 10)',
      'All export formats',
      'Custom heuristics',
      'White-label reports',
      '50 GB storage per user',
      'Priority support',
    ],
    cta: 'startFreeTrial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    monthly: 'Custom',
    annual: 'Custom',
    description: 'For large organizations with advanced security and compliance needs.',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'SSO & advanced security',
      'REST API access',
      'Custom integrations',
      'Dedicated success manager',
      'Unlimited storage',
      'SLA guarantee',
    ],
    cta: 'contactSalesButton',
    highlighted: false,
  },
];

type FeatureRow = {
  feature: string;
  starter: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
};

const comparisonRows: FeatureRow[] = [
  { feature: 'Unlimited audits', starter: true, professional: true, enterprise: true },
  { feature: 'Screenshot annotation', starter: true, professional: true, enterprise: true },
  { feature: 'Built-in heuristics', starter: 'Nielsen + WCAG', professional: 'Nielsen + WCAG + Custom', enterprise: 'Nielsen + WCAG + Custom' },
  { feature: 'Export formats', starter: 'PDF, Word', professional: 'PDF, Word, PPTX, CSV', enterprise: 'All formats + JSON' },
  { feature: 'Storage', starter: '5 GB', professional: '50 GB / user', enterprise: 'Unlimited' },
  { feature: 'Team collaboration', starter: false, professional: 'Up to 10 users', enterprise: 'Unlimited' },
  { feature: 'White-label reports', starter: false, professional: true, enterprise: true },
  { feature: 'Custom heuristics', starter: false, professional: true, enterprise: true },
  { feature: 'REST API access', starter: false, professional: false, enterprise: true },
  { feature: 'SSO / SAML', starter: false, professional: false, enterprise: true },
  { feature: 'Dedicated CSM', starter: false, professional: false, enterprise: true },
  { feature: 'SLA guarantee', starter: false, professional: false, enterprise: true },
  { feature: 'Support', starter: 'Email', professional: 'Priority email', enterprise: 'Dedicated' },
];

const faqs = [
  {
    q: 'Is there a free trial?',
    a: 'Yes — all paid plans include a 14-day free trial. No credit card required to start. You\'ll only be charged if you choose to continue after the trial period.',
  },
  {
    q: 'Can I switch plans later?',
    a: 'Absolutely. You can upgrade or downgrade at any time. Upgrades take effect immediately; downgrades apply at the end of your current billing period.',
  },
  {
    q: 'What counts as a "user"?',
    a: 'A user is any person who logs into UX Mosaic with their own credentials. Clients who view shared reports do not count as users.',
  },
  {
    q: 'Do you offer annual billing?',
    a: 'Yes — annual billing gives you a 20% discount compared to monthly. You can switch between monthly and annual billing in your account settings.',
  },
  {
    q: 'What export formats are supported?',
    a: 'Starter includes PDF and Word. Professional and Enterprise add PowerPoint, CSV, and embeddable web links. Enterprise also includes JSON data export for custom integrations.',
  },
  {
    q: 'Can I white-label reports for clients?',
    a: 'White-labeling is available on Professional and Enterprise plans. You can add your logo, set custom colors, and remove all UX Mosaic branding from client-facing reports.',
  },
  {
    q: 'Is my data secure?',
    a: 'All data is encrypted at rest and in transit. We are SOC 2 Type II compliant and GDPR ready. Enterprise customers can request additional security review documentation.',
  },
];

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="w-4 h-4 text-[var(--brand-green)] mx-auto" strokeWidth={2} />;
  if (value === false) return <X className="w-4 h-4 text-[var(--text-placeholder)] mx-auto" strokeWidth={2} />;
  return <span className="text-sm text-[var(--text-muted)]">{value}</span>;
}

export function PricingPage() {
  const { t } = useTranslation();
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="pt-24 pb-16 px-6 bg-[var(--surface-base)] border-b border-[var(--border-on-dark)] text-center">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-[var(--text-on-dark)] mb-6">{t('pricing.hero.headline')}</h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto mb-10">
            {t('pricing.hero.subheadline')}
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 bg-[var(--surface-2)] border border-[var(--border-on-dark)] rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm transition-colors ${
                !annual ? 'bg-[var(--brand-blue)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-on-dark)]'
              }`}
            >
              {t('pricing.toggle.monthly')}
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm transition-colors flex items-center gap-2 ${
                annual ? 'bg-[var(--brand-blue)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-on-dark)]'
              }`}
            >
              {t('pricing.toggle.annual')}
              <span className="text-xs bg-[var(--brand-green)]/20 text-[var(--brand-green)] px-2 py-0.5 rounded-full">
                {t('pricing.toggle.save')}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-20 px-6 bg-[var(--surface-base)]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-7 border ${
                  plan.highlighted
                    ? 'bg-[var(--surface-2)] border-[var(--brand-blue)]'
                    : 'bg-[var(--surface-2)] border-[var(--border-on-dark)]'
                }`}
                style={{ boxShadow: 'var(--card-shadow-default)' }}
              >
                {plan.highlighted && (
                  <div className="text-xs uppercase tracking-wider text-[var(--brand-blue)] mb-4">
                    {t('pricing.plans.mostPopular')}
                  </div>
                )}

                <h2 className="text-[var(--text-on-dark)] mb-1">{plan.name}</h2>
                <p className="text-sm text-[var(--text-muted)] mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-[var(--text-on-dark)]" style={{ fontSize: '44px', lineHeight: 1 }}>
                    {plan.monthly === 'Custom' ? t('pricing.plans.contactSales') : annual ? plan.annual : plan.monthly}
                  </span>
                  {plan.monthly !== 'Custom' && (
                    <span className="text-sm text-[var(--text-muted)] ml-2">{t('pricing.plans.perUserPerMonth')}</span>
                  )}
                  {plan.monthly !== 'Custom' && annual && (
                    <div className="text-xs text-[var(--text-faint)] mt-1">{t('pricing.plans.billedAnnually')}</div>
                  )}
                  {plan.monthly === 'Custom' && (
                    <div className="text-xs text-[var(--text-faint)] mt-1">{t('pricing.plans.contactUs')}</div>
                  )}
                </div>

                <Link
                  to={plan.monthly === 'Custom' ? '#' : '/login'}
                  className={`flex items-center justify-center w-full h-11 rounded-lg mb-6 transition-colors no-underline ${
                    plan.highlighted
                      ? 'bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue-hover)]'
                      : 'border border-[var(--border-on-dark-strong)] bg-[var(--surface-3)] text-[var(--text-on-dark)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  {t(`pricing.plans.${plan.cta}`)}
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[var(--brand-green)] flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="text-sm text-[var(--text-muted)]">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-[var(--text-muted)] mt-8">
            {t('pricing.footer.note')}{' '}
            <a href="mailto:sales@uxmosaic.com" className="text-[var(--brand-blue)] hover:underline">
              {t('pricing.footer.talkToSales')}
            </a>{' '}
            {t('pricing.footer.forVolumeDiscounts')}
          </p>
        </div>
      </section>

      {/* Feature comparison */}
      <section className="py-20 px-6 bg-[var(--surface-base)] border-t border-[var(--border-on-dark)]">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-[var(--text-on-dark)] mb-12 text-center">{t('pricing.comparison.headline')}</h2>

          <div className="rounded-xl border border-[var(--border-on-dark)] overflow-hidden bg-[var(--surface-2)]" style={{ boxShadow: 'var(--card-shadow-default)' }}>
            <div className="grid grid-cols-4 border-b border-[var(--border-on-dark)] bg-[var(--surface-2)]">
              <div className="p-5" />
              {plans.map((plan) => (
                <div key={plan.name} className="p-5 text-center">
                  <div className="text-[var(--text-on-dark)]">{plan.name}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    {plan.monthly === 'Custom' ? t('pricing.plans.contactUs') : (annual ? plan.annual : plan.monthly) + '/mo'}
                  </div>
                </div>
              ))}
            </div>

            {comparisonRows.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-4 border-b border-[var(--border-on-dark)] last:border-b-0 ${
                  i % 2 === 0 ? 'bg-[var(--surface-2)]' : 'bg-[var(--surface-1)]'
                }`}
              >
                <div className="p-4 text-sm text-[var(--text-muted)]">{row.feature}</div>
                <div className="p-4 text-center flex items-center justify-center">
                  <CellValue value={row.starter} />
                </div>
                <div className="p-4 text-center flex items-center justify-center bg-[var(--brand-blue)]/[0.05]">
                  <CellValue value={row.professional} />
                </div>
                <div className="p-4 text-center flex items-center justify-center">
                  <CellValue value={row.enterprise} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-[var(--surface-1)] border-t border-[var(--border-on-dark)]">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-[var(--text-on-dark)] mb-12 text-center">{t('pricing.faq.headline')}</h2>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-[var(--surface-2)] border border-[var(--border-on-dark)] rounded-xl overflow-hidden"
                style={{ boxShadow: 'var(--card-shadow-default)' }}
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-[var(--text-on-dark)] pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 flex-shrink-0 text-[var(--text-muted)]" strokeWidth={1.8} />
                  ) : (
                    <ChevronDown className="w-4 h-4 flex-shrink-0 text-[var(--text-muted)]" strokeWidth={1.8} />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-on-dark)] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[var(--surface-base)] border-t border-[var(--border-on-dark)] text-center">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-[var(--text-on-dark)] mb-4">{t('pricing.cta.headline')}</h2>
          <p className="text-[var(--text-muted)] mb-10 max-w-md mx-auto">
            {t('pricing.cta.subheadline')}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue-hover)] transition-colors no-underline"
            >
              {t('pricing.cta.ctaPrimary')}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" strokeWidth={2} />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-[var(--border-on-dark-strong)] bg-[var(--surface-2)] text-[var(--text-on-dark)] hover:bg-[var(--surface-3)] transition-colors no-underline"
            >
              {t('pricing.cta.ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
