import { Button } from '@figma/astraui';
import { ArrowRight, Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="bg-brand-tertiary py-[120px]">
      <div className="max-w-[1400px] mx-auto px-2xl">
        <div className="grid lg:grid-cols-2 gap-2xl items-center">
          <div>
            <h1 className="text-[56px] font-semibold leading-[1.2] text-text-primary mb-lg">
              Modern UX Audit Platform for Product Teams
            </h1>
            <p className="text-heading text-text-secondary mb-2xl">
              Stop using scattered tools for UX audits. Capture findings, annotate screenshots, apply heuristics, and generate stakeholder reports—all in one professional platform.
            </p>

            <div className="flex flex-wrap gap-md mb-2xl">
              <Button variant="primary" className="gap-sm">
                Start Free Trial
                <ArrowRight size={16} />
              </Button>
              <Button variant="neutral" className="gap-sm">
                <Play size={16} />
                Watch Demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-xl text-label-sm text-text-secondary">
              <span>✓ No credit card required</span>
              <span>✓ 14-day free trial</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>

          <div className="bg-surface-bg rounded-[24px] p-xl shadow-lg border border-border-primary">
            <div className="aspect-video bg-bg-faint rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-primary rounded-lg mx-auto mb-md flex items-center justify-center">
                  <Play size={32} className="text-on-brand" />
                </div>
                <p className="text-label text-text-secondary">Product Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
