import { BookOpen, CheckCircle2 } from 'lucide-react';

export function Heuristics() {
  const frameworks = [
    {
      name: 'Nielsen\'s 10 Usability Heuristics',
      principles: [
        'Visibility of system status',
        'Match between system and real world',
        'User control and freedom',
        'Consistency and standards',
        'Error prevention',
      ],
      usage: 'General usability evaluation',
    },
    {
      name: 'WCAG 2.2 Guidelines',
      principles: [
        'Perceivable',
        'Operable',
        'Understandable',
        'Robust',
      ],
      usage: 'Web accessibility compliance',
    },
    {
      name: 'ISO 9241-110',
      principles: [
        'Suitability for the task',
        'Self-descriptiveness',
        'Controllability',
        'Conformity with user expectations',
        'Error tolerance',
      ],
      usage: 'Dialogue principles for interactive systems',
    },
    {
      name: 'Bastien & Scapin Criteria',
      principles: [
        'Guidance',
        'Workload',
        'Explicit control',
        'Adaptability',
        'Error management',
      ],
      usage: 'Ergonomic evaluation',
    },
  ];

  return (
    <section className="py-[120px] bg-surface-bg">
      <div className="max-w-[1400px] mx-auto px-2xl">
        <div className="text-center mb-2xl">
          <h2 className="text-[48px] font-semibold leading-[1.2] text-text-primary mb-lg">
            Built-in UX Heuristics Frameworks
          </h2>
          <p className="text-heading text-text-secondary max-w-[700px] mx-auto">
            Apply industry-standard evaluation frameworks and create custom heuristics tailored to your product
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-xl mb-2xl">
          {frameworks.map((framework) => (
            <div key={framework.name} className="bg-brand-tertiary rounded-[24px] p-xl">
              <div className="flex items-start gap-md mb-lg">
                <BookOpen size={24} className="text-brand-primary flex-shrink-0 mt-xs" />
                <div>
                  <h3 className="text-label font-semibold text-text-primary mb-xs">
                    {framework.name}
                  </h3>
                  <p className="text-label-sm text-text-tertiary">{framework.usage}</p>
                </div>
              </div>

              <ul className="space-y-sm">
                {framework.principles.map((principle) => (
                  <li key={principle} className="text-label-sm text-text-secondary flex items-start gap-sm">
                    <CheckCircle2 size={16} className="text-success flex-shrink-0 mt-xs" />
                    {principle}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-brand-primary/10 rounded-[24px] p-xl border-2 border-brand-primary/20">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-xl">
            <div className="flex-1">
              <h3 className="text-label font-semibold text-text-primary mb-sm">
                Custom Heuristics
              </h3>
              <p className="text-label-sm text-text-secondary">
                Create your own evaluation frameworks specific to your product domain, industry, or company standards
              </p>
            </div>
            <div className="text-label-sm font-semibold text-brand-primary whitespace-nowrap">
              Available on Pro & Enterprise
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
