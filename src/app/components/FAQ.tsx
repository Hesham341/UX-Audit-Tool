import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How is UX Mosaic different from using spreadsheets or presentation tools?',
      answer: 'UX Mosaic is purpose-built for UX audits. Unlike spreadsheets, it provides visual context with screenshot annotation, automatic stakeholder reports, and built-in heuristics frameworks. Everything is connected—findings, screenshots, severity scoring, and recommendations—in one platform.',
    },
    {
      question: 'Can I import existing audit data?',
      answer: 'Yes. You can import findings from CSV/Excel files, and upload existing screenshots in bulk. We also provide migration assistance for Professional and Enterprise plans.',
    },
    {
      question: 'What heuristics frameworks are included?',
      answer: 'Nielsen\'s 10 Usability Heuristics, WCAG 2.2, ISO 9241-110, and Bastien & Scapin Criteria are built-in. Professional and Enterprise plans allow you to create custom frameworks specific to your domain.',
    },
    {
      question: 'How does team collaboration work?',
      answer: 'Invite team members with role-based permissions (Admin, Editor, Viewer). Comment on findings, assign tasks, and track resolution status. All activity is logged with timestamps and user attribution.',
    },
    {
      question: 'Can I white-label reports for clients?',
      answer: 'Yes, Professional and Enterprise plans support custom branding—replace our logo with yours, customize color schemes, and add your company information to all exported reports.',
    },
    {
      question: 'Is there a limit on audits or findings?',
      answer: 'No. All plans include unlimited audits and unlimited findings. Storage limits apply per plan tier.',
    },
    {
      question: 'What export formats are supported?',
      answer: 'Export to PDF, PowerPoint, Word, HTML, or share secure interactive links. All reports are fully customizable.',
    },
    {
      question: 'Do you offer training or onboarding?',
      answer: 'Starter includes self-service documentation and video tutorials. Professional includes priority email support. Enterprise includes dedicated onboarding sessions and a success manager.',
    },
  ];

  return (
    <section id="faq" className="py-[120px] bg-surface-bg">
      <div className="max-w-[900px] mx-auto px-2xl">
        <div className="text-center mb-2xl">
          <h2 className="text-[48px] font-semibold leading-[1.2] text-text-primary mb-lg">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-md">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-brand-tertiary rounded-[16px] border border-border-primary overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-xl py-lg flex items-center justify-between text-left hover:bg-bg-hover transition-colors"
              >
                <span className="text-label font-semibold text-text-primary pr-lg">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-text-secondary flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-xl pb-lg">
                  <p className="text-label-sm text-text-secondary">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-2xl text-center">
          <p className="text-label-sm text-text-secondary mb-md">
            Still have questions?
          </p>
          <a href="#contact" className="text-label-sm text-brand-primary font-semibold hover:underline">
            Contact our team
          </a>
        </div>
      </div>
    </section>
  );
}
