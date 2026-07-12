import { Button } from '@figma/astraui';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export function Solution() {
  const benefits = [
    'Centralized audit workspace with all findings in one place',
    'Screenshot annotation and multi-image support per finding',
    'Built-in UX heuristics frameworks (Nielsen, WCAG, ISO 9241)',
    'Automatic stakeholder-specific report generation',
    'Real-time team collaboration and commenting',
    'Severity tracking and prioritization matrices',
  ];

  return (
    <section id="solutions" className="py-[120px] bg-surface-bg">
      <div className="max-w-[1400px] mx-auto px-2xl">
        <div className="grid lg:grid-cols-2 gap-2xl items-center">
          <div>
            <div className="inline-block bg-brand-primary/10 text-brand-primary text-label-sm font-semibold px-lg py-sm rounded-full mb-lg">
              The Solution
            </div>
            <h2 className="text-[48px] font-semibold leading-[1.2] text-text-primary mb-lg">
              One Platform. Complete UX Audit Workflow.
            </h2>
            <p className="text-heading text-text-secondary mb-2xl">
              UX Mosaic replaces your scattered audit tools with a professional platform designed specifically for UX auditors and product teams.
            </p>

            <div className="flex flex-col gap-md mb-2xl">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-md">
                  <CheckCircle2 size={20} className="text-success mt-xs flex-shrink-0" />
                  <span className="text-label-sm text-text-primary">{benefit}</span>
                </div>
              ))}
            </div>

            <Button variant="primary" className="gap-sm">
              See How It Works
              <ArrowRight size={16} />
            </Button>
          </div>

          <div className="bg-brand-tertiary rounded-[24px] p-2xl">
            <div className="bg-surface-bg rounded-lg p-xl shadow-lg">
              <div className="space-y-lg">
                <div className="h-8 bg-bg-faint rounded w-3/4"></div>
                <div className="space-y-sm">
                  <div className="h-4 bg-bg-subtle rounded w-full"></div>
                  <div className="h-4 bg-bg-subtle rounded w-5/6"></div>
                  <div className="h-4 bg-bg-subtle rounded w-4/6"></div>
                </div>
                <div className="grid grid-cols-2 gap-md">
                  <div className="aspect-video bg-bg-faint rounded"></div>
                  <div className="aspect-video bg-bg-faint rounded"></div>
                </div>
                <div className="flex items-center gap-sm">
                  <div className="w-8 h-8 bg-brand-primary/20 rounded-full"></div>
                  <div className="flex-1 h-10 bg-bg-faint rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
