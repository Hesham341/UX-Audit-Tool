import { Users, Palette, Code, Briefcase } from 'lucide-react';

export function Reports() {
  const reportTypes = [
    {
      icon: Briefcase,
      title: 'Executive Summary',
      description: 'High-level overview with business impact, key metrics, and strategic recommendations',
      includes: ['ROI projections', 'Risk assessment', 'Success metrics', 'Timeline estimates'],
      audience: 'C-Suite, Product Leadership',
    },
    {
      icon: Users,
      title: 'Product Manager Report',
      description: 'Prioritized backlog with user impact analysis and feature recommendations',
      includes: ['User story mapping', 'Feature priorities', 'Sprint planning data', 'Success criteria'],
      audience: 'Product Managers, Product Owners',
    },
    {
      icon: Palette,
      title: 'UX/Design Report',
      description: 'Detailed visual findings with design patterns and interaction improvements',
      includes: ['Visual examples', 'Pattern library gaps', 'Interaction flows', 'Accessibility issues'],
      audience: 'UX Designers, UI Designers',
    },
    {
      icon: Code,
      title: 'Development Report',
      description: 'Technical specifications with implementation guidance and effort estimates',
      includes: ['Technical specs', 'Component breakdown', 'API requirements', 'Test scenarios'],
      audience: 'Engineering Teams, Tech Leads',
    },
  ];

  return (
    <section className="py-[120px] bg-brand-tertiary">
      <div className="max-w-[1400px] mx-auto px-2xl">
        <div className="text-center mb-2xl">
          <h2 className="text-[48px] font-semibold leading-[1.2] text-text-primary mb-lg">
            Reports Tailored to Every Stakeholder
          </h2>
          <p className="text-heading text-text-secondary max-w-[700px] mx-auto">
            One audit, multiple perspectives. Generate role-specific reports that speak to what each stakeholder cares about.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-xl">
          {reportTypes.map((report) => (
            <div key={report.title} className="bg-surface-bg rounded-[24px] p-xl">
              <div className="flex items-start gap-lg mb-lg">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <report.icon size={24} className="text-brand-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-label font-semibold text-text-primary mb-xs">
                    {report.title}
                  </h3>
                  <p className="text-label-sm text-text-tertiary">{report.audience}</p>
                </div>
              </div>

              <p className="text-label-sm text-text-secondary mb-lg">
                {report.description}
              </p>

              <div className="bg-bg-faint rounded-lg p-lg">
                <p className="text-label-sm font-semibold text-text-primary mb-sm">
                  Includes:
                </p>
                <ul className="space-y-xs">
                  {report.includes.map((item) => (
                    <li key={item} className="text-label-sm text-text-secondary flex items-center gap-sm">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2xl bg-surface-bg rounded-[24px] p-xl text-center">
          <p className="text-label font-semibold text-text-primary mb-sm">
            Export in Multiple Formats
          </p>
          <p className="text-label-sm text-text-secondary">
            PDF, PowerPoint, Word, HTML, or share interactive reports via secure links
          </p>
        </div>
      </div>
    </section>
  );
}
