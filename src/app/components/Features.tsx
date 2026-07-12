import { Camera, Layers, Target, Users, FileBarChart, Filter } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Camera,
      title: 'Screenshot Capture & Annotation',
      description: 'Capture screenshots directly or upload existing images. Add annotations, highlights, and notes to pinpoint exact usability issues.',
      benefits: ['Multi-image support per finding', 'Built-in annotation tools', 'Automatic image organization'],
    },
    {
      icon: Layers,
      title: 'Multiple Screenshots Per Finding',
      description: 'Document complex issues with multiple screenshots showing different states, user flows, or device sizes in a single finding.',
      benefits: ['Before/after comparisons', 'Multi-device views', 'User journey documentation'],
    },
    {
      icon: Target,
      title: 'Severity & Priority Tracking',
      description: 'Classify findings by severity (Critical, High, Medium, Low) and track which issues need immediate attention.',
      benefits: ['Impact scoring', 'Effort estimation', 'Priority matrices'],
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Invite team members, assign findings, add comments, and track resolution progress in real-time.',
      benefits: ['Role-based permissions', 'Activity tracking', 'Threaded discussions'],
    },
    {
      icon: FileBarChart,
      title: 'Stakeholder Reports',
      description: 'Generate role-specific reports for executives, product managers, designers, and developers with one click.',
      benefits: ['Executive summaries', 'Technical specifications', 'Visual presentations'],
    },
    {
      icon: Filter,
      title: 'Advanced Filtering & Search',
      description: 'Filter findings by heuristic, severity, status, assignee, or custom tags to quickly find what you need.',
      benefits: ['Saved filter views', 'Custom taxonomies', 'Bulk operations'],
    },
  ];

  return (
    <section id="features" className="py-[120px] bg-brand-tertiary">
      <div className="max-w-[1400px] mx-auto px-2xl">
        <div className="text-center mb-2xl">
          <h2 className="text-[48px] font-semibold leading-[1.2] text-text-primary mb-lg">
            Everything You Need for Professional UX Audits
          </h2>
          <p className="text-heading text-text-secondary max-w-[700px] mx-auto">
            Purpose-built features for UX auditors, researchers, and product teams
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-xl">
          {features.map((feature) => (
            <div key={feature.title} className="bg-surface-bg rounded-[24px] p-xl">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center mb-lg">
                <feature.icon size={24} className="text-brand-primary" />
              </div>
              <h3 className="text-label font-semibold text-text-primary mb-sm">
                {feature.title}
              </h3>
              <p className="text-label-sm text-text-secondary mb-lg">
                {feature.description}
              </p>
              <ul className="space-y-sm">
                {feature.benefits.map((benefit) => (
                  <li key={benefit} className="text-label-sm text-text-secondary flex items-start gap-sm">
                    <span className="text-brand-primary mt-xs">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
