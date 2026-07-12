import { Quote } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      quote: 'UX Mosaic cut our audit time in half. Instead of juggling screenshots across five tools, everything lives in one place with context.',
      author: 'Sarah Chen',
      role: 'Senior UX Researcher',
      company: 'TechVision',
    },
    {
      quote: 'The stakeholder reports are incredible. Our PM gets prioritized backlogs, executives get ROI summaries, and designers get visual specs—all from the same audit.',
      author: 'Marcus Rodriguez',
      role: 'UX Lead',
      company: 'ProductLab',
    },
    {
      quote: 'As a consultant, client deliverables need to look polished. UX Mosaic\'s report generation makes me look like I have a design team backing me.',
      author: 'Emily Thompson',
      role: 'Independent UX Consultant',
      company: 'Thompson UX',
    },
    {
      quote: 'We run quarterly audits across 12 products. UX Mosaic standardized our methodology and made it easy to track improvements over time.',
      author: 'David Park',
      role: 'Head of Design',
      company: 'Innovate Systems',
    },
  ];

  return (
    <section className="py-[120px] bg-surface-bg">
      <div className="max-w-[1400px] mx-auto px-2xl">
        <div className="text-center mb-2xl">
          <h2 className="text-[48px] font-semibold leading-[1.2] text-text-primary mb-lg">
            Trusted by UX Professionals
          </h2>
          <p className="text-heading text-text-secondary max-w-[700px] mx-auto">
            See what UX auditors and product teams say about UX Mosaic
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-xl">
          {testimonials.map((testimonial) => (
            <div key={testimonial.author} className="bg-brand-tertiary rounded-[24px] p-xl">
              <Quote size={32} className="text-brand-primary/20 mb-lg" />
              <p className="text-label text-text-primary mb-lg">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-md">
                <div className="w-12 h-12 bg-brand-primary/20 rounded-full"></div>
                <div>
                  <div className="text-label-sm font-semibold text-text-primary">
                    {testimonial.author}
                  </div>
                  <div className="text-label-sm text-text-secondary">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
