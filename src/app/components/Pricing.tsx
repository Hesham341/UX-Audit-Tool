import { Button } from '@figma/astraui';
import { Check } from 'lucide-react';

export function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: 'per user/month',
      description: 'For individual UX auditors and consultants',
      features: [
        'Unlimited audits',
        'Screenshot annotation',
        'Built-in heuristics (Nielsen, WCAG)',
        'Basic reporting (PDF, Word)',
        '5GB storage',
        'Email support',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '$79',
      period: 'per user/month',
      description: 'For UX teams and agencies',
      features: [
        'Everything in Starter',
        'Team collaboration',
        'Advanced reporting (all formats)',
        'Custom heuristics',
        'Priority support',
        '50GB storage per user',
        'White-label reports',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact sales',
      description: 'For large organizations',
      features: [
        'Everything in Professional',
        'SSO & advanced security',
        'API access',
        'Custom integrations',
        'Dedicated success manager',
        'Unlimited storage',
        'SLA guarantee',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-[120px] bg-brand-tertiary">
      <div className="max-w-[1400px] mx-auto px-2xl">
        <div className="text-center mb-2xl">
          <h2 className="text-[48px] font-semibold leading-[1.2] text-text-primary mb-lg">
            Simple, Transparent Pricing
          </h2>
          <p className="text-heading text-text-secondary max-w-[700px] mx-auto">
            All plans include 14-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-xl">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[24px] p-xl ${
                plan.highlighted
                  ? 'bg-brand-primary border-2 border-brand-primary'
                  : 'bg-surface-bg border-2 border-border-primary'
              }`}
            >
              {plan.highlighted && (
                <div className="text-label-sm font-semibold text-on-brand mb-lg">
                  Most Popular
                </div>
              )}

              <h3 className={`text-heading font-semibold mb-xs ${plan.highlighted ? 'text-on-brand' : 'text-text-primary'}`}>
                {plan.name}
              </h3>
              <p className={`text-label-sm mb-lg ${plan.highlighted ? 'text-on-brand/80' : 'text-text-secondary'}`}>
                {plan.description}
              </p>

              <div className="mb-lg">
                <div className={`text-[48px] font-semibold leading-[1.2] ${plan.highlighted ? 'text-on-brand' : 'text-text-primary'}`}>
                  {plan.price}
                </div>
                <div className={`text-label-sm ${plan.highlighted ? 'text-on-brand/80' : 'text-text-secondary'}`}>
                  {plan.period}
                </div>
              </div>

              <Button
                variant={plan.highlighted ? 'neutral' : 'primary'}
                className="w-full mb-lg"
              >
                {plan.cta}
              </Button>

              <ul className="space-y-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-sm">
                    <Check
                      size={16}
                      className={`flex-shrink-0 mt-xs ${
                        plan.highlighted ? 'text-on-brand' : 'text-success'
                      }`}
                    />
                    <span className={`text-label-sm ${plan.highlighted ? 'text-on-brand' : 'text-text-primary'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-2xl text-center">
          <p className="text-label-sm text-text-secondary">
            All prices in USD. Annual billing available with 20% discount.
          </p>
        </div>
      </div>
    </section>
  );
}
