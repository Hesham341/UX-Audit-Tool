import { FileText, Image, Sheet, MessageSquare, AlertCircle } from 'lucide-react';

export function Problem() {
  const problems = [
    {
      icon: FileText,
      title: 'Scattered Documents',
      description: 'UX audits spread across Word docs, PDFs, and PowerPoint presentations',
    },
    {
      icon: Image,
      title: 'Manual Screenshots',
      description: 'Collecting and organizing screenshots across multiple folders and tools',
    },
    {
      icon: Sheet,
      title: 'Spreadsheet Chaos',
      description: 'Tracking findings in Excel with no context or visual reference',
    },
    {
      icon: MessageSquare,
      title: 'Poor Collaboration',
      description: 'Email threads and Slack messages lose critical UX insights',
    },
    {
      icon: AlertCircle,
      title: 'Inconsistent Reports',
      description: 'Every audit looks different, making it hard for stakeholders to follow',
    },
  ];

  return (
    <section id="problem" className="py-[120px] bg-brand-tertiary">
      <div className="max-w-[1400px] mx-auto px-2xl">
        <div className="text-center mb-2xl">
          <h2 className="text-[48px] font-semibold leading-[1.2] text-text-primary mb-lg">
            UX Audits Shouldn't Be This Hard
          </h2>
          <p className="text-heading text-text-secondary max-w-[700px] mx-auto">
            Most teams struggle with disconnected tools and manual processes that slow down audits and make it harder to deliver actionable insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-xl">
          {problems.map((problem) => (
            <div key={problem.title} className="bg-surface-bg rounded-[24px] p-xl">
              <div className="w-12 h-12 bg-bg-faint rounded-lg flex items-center justify-center mb-lg">
                <problem.icon size={24} className="text-text-secondary" />
              </div>
              <h3 className="text-label font-semibold text-text-primary mb-sm">
                {problem.title}
              </h3>
              <p className="text-label-sm text-text-secondary">
                {problem.description}
              </p>
            </div>
          ))}

          <div className="bg-danger/10 rounded-[24px] p-xl border-2 border-danger/20">
            <div className="w-12 h-12 bg-danger/20 rounded-lg flex items-center justify-center mb-lg">
              <AlertCircle size={24} className="text-danger" />
            </div>
            <h3 className="text-label font-semibold text-text-primary mb-sm">
              The Cost of Complexity
            </h3>
            <p className="text-label-sm text-text-secondary mb-md">
              Teams waste 40% of audit time on tooling instead of insights
            </p>
            <p className="text-label-sm font-semibold text-danger">
              Your UX expertise deserves better tools
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
