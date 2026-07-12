import { Button } from '@figma/astraui';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-[120px] bg-brand-tertiary">
      <div className="max-w-[900px] mx-auto px-2xl text-center">
        <h2 className="text-[56px] font-semibold leading-[1.2] text-text-primary mb-lg">
          Ready to Transform Your UX Audit Workflow?
        </h2>
        <p className="text-heading text-text-secondary mb-2xl max-w-[700px] mx-auto">
          Join 850+ UX professionals who have streamlined their audit process with UX Mosaic
        </p>

        <div className="flex flex-col sm:flex-row gap-md justify-center mb-2xl">
          <Button variant="primary" className="gap-sm">
            Start Free Trial
            <ArrowRight size={16} />
          </Button>
          <Button variant="neutral">
            Schedule a Demo
          </Button>
        </div>

        <div className="grid sm:grid-cols-3 gap-xl max-w-[600px] mx-auto">
          <div className="text-center">
            <div className="text-heading font-semibold text-text-primary mb-xs">
              14 days
            </div>
            <div className="text-label-sm text-text-secondary">
              Free trial
            </div>
          </div>
          <div className="text-center">
            <div className="text-heading font-semibold text-text-primary mb-xs">
              No credit card
            </div>
            <div className="text-label-sm text-text-secondary">
              Required
            </div>
          </div>
          <div className="text-center">
            <div className="text-heading font-semibold text-text-primary mb-xs">
              Cancel
            </div>
            <div className="text-label-sm text-text-secondary">
              Anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
