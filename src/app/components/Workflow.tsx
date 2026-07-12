import { Camera, FolderOpen, ListChecks, Users as UsersIcon, FileText, TrendingUp } from 'lucide-react';

export function Workflow() {
  const steps = [
    {
      icon: Camera,
      number: '01',
      title: 'Capture Findings',
      description: 'Screenshot issues, annotate problems, and document usability concerns as you audit',
    },
    {
      icon: FolderOpen,
      number: '02',
      title: 'Organize Issues',
      description: 'Apply heuristics, tag findings, and categorize by product area or user flow',
    },
    {
      icon: ListChecks,
      number: '03',
      title: 'Prioritize Problems',
      description: 'Score severity and impact to help teams focus on what matters most',
    },
    {
      icon: UsersIcon,
      number: '04',
      title: 'Collaborate',
      description: 'Share with stakeholders, gather feedback, and assign action items',
    },
    {
      icon: FileText,
      number: '05',
      title: 'Generate Reports',
      description: 'Create role-specific reports for executives, designers, and developers',
    },
    {
      icon: TrendingUp,
      number: '06',
      title: 'Improve UX',
      description: 'Track implementation progress and measure UX improvements over time',
    },
  ];

  return (
    <section className="py-[120px] bg-surface-bg">
      <div className="max-w-[1400px] mx-auto px-2xl">
        <div className="text-center mb-2xl">
          <h2 className="text-[48px] font-semibold leading-[1.2] text-text-primary mb-lg">
            Your Audit Workflow, Streamlined
          </h2>
          <p className="text-heading text-text-secondary max-w-[700px] mx-auto">
            From discovery to implementation, UX Mosaic guides you through every step
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-xl">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="bg-brand-tertiary rounded-[24px] p-xl h-full">
                <div className="flex items-start gap-lg mb-lg">
                  <div className="w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <step.icon size={24} className="text-on-brand" />
                  </div>
                  <div className="text-[32px] font-semibold text-brand-primary/30">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-label font-semibold text-text-primary mb-sm">
                  {step.title}
                </h3>
                <p className="text-label-sm text-text-secondary">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-[23px] w-12 h-[2px] bg-border-secondary z-10">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-brand-primary rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
