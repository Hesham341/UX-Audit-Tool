export function SocialProof() {
  const stats = [
    { value: '2,400+', label: 'UX Audits Completed' },
    { value: '850+', label: 'Teams Using UX Mosaic' },
    { value: '45,000+', label: 'Issues Documented' },
    { value: '4.9/5', label: 'User Rating' },
  ];

  const logos = [
    'Acme Corp',
    'TechVision',
    'DesignFirst',
    'ProductLab',
    'UXStudio',
    'Innovate',
  ];

  return (
    <section className="py-2xl bg-surface-bg border-b border-border-secondary">
      <div className="max-w-[1400px] mx-auto px-2xl">
        <p className="text-label-sm text-text-secondary text-center mb-xl">
          Trusted by UX teams at leading companies
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-xl mb-2xl">
          {logos.map((logo) => (
            <div
              key={logo}
              className="bg-bg-faint rounded-lg p-lg flex items-center justify-center h-16"
            >
              <span className="text-label-sm text-text-secondary">{logo}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-xl pt-2xl border-t border-border-secondary">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-[32px] font-semibold text-brand-primary mb-xs">
                {stat.value}
              </div>
              <div className="text-label-sm text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
