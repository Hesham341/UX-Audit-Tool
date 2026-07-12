import { Button } from '@figma/astraui';
import { Search, Building2, Rocket, Users } from 'lucide-react';

export function UseCases() {
  const useCases = [
    {
      icon: Search,
      audience: 'UX Auditors & Consultants',
      description: 'Deliver professional audit reports to clients with consistent formatting and comprehensive documentation',
      outcomes: [
        'Faster audit turnaround',
        'Professional client deliverables',
        'Reusable audit templates',
      ],
    },
    {
      icon: Building2,
      audience: 'UX Agencies',
      description: 'Standardize audit methodology across team members and scale your UX consulting services',
      outcomes: [
        'Team collaboration',
        'Consistent quality',
        'Client white-labeling',
      ],
    },
    {
      icon: Rocket,
      audience: 'Product Teams',
      description: 'Identify and prioritize UX improvements before major releases or redesigns',
      outcomes: [
        'Data-driven prioritization',
        'Cross-functional alignment',
        'Tracked improvements',
      ],
    },
    {
      icon: Users,
      audience: 'Startup Founders',
      description: 'Get UX expertise without hiring a full-time team using built-in frameworks and templates',
      outcomes: [
        'DIY audit capability',
        'Learning resources',
        'Affordable pricing',
      ],
    },
  ];

  return (
    <section className="py-[120px] bg-brand-tertiary">
      <div className="max-w-[1400px] mx-auto px-2xl">
        <div className="text-center mb-2xl">
          <h2 className="text-[48px] font-semibold leading-[1.2] text-text-primary mb-lg">
            Built for Every UX Role
          </h2>
          <p className="text-heading text-text-secondary max-w-[700px] mx-auto">
            Whether you're an independent consultant or part of a product team, UX Mosaic adapts to your workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-xl">
          {useCases.map((useCase) => (
            <div key={useCase.audience} className="bg-surface-bg rounded-[24px] p-xl">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center mb-lg">
                <useCase.icon size={24} className="text-brand-primary" />
              </div>

              <h3 className="text-label font-semibold text-text-primary mb-sm">
                {useCase.audience}
              </h3>
              <p className="text-label-sm text-text-secondary mb-lg">
                {useCase.description}
              </p>

              <div className="space-y-sm">
                {useCase.outcomes.map((outcome) => (
                  <div key={outcome} className="flex items-center gap-sm">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    <span className="text-label-sm text-text-primary">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2xl text-center">
          <Button variant="primary">See All Use Cases</Button>
        </div>
      </div>
    </section>
  );
}
