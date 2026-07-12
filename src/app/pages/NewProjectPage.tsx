import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logoSrc from '../../imports/Logo.png';
import { AppUserMenu } from '../components/AppUserMenu';

const UX_FRAMEWORKS = [
  'Nielsen 10 Usability Heuristics',
  'WCAG 2.2',
  'ISO 9241-110',
];

const LANGUAGES = ['English', 'Arabic'];

type FormData = {
  projectName: string;
  clientName: string;
  framework: string;
  projectLanguage: string;
};

function SimpleDropdown({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-10 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3.5 text-[13px] text-left flex items-center outline-none transition-colors"
        style={{ borderColor: open ? 'rgba(66,116,186,0.6)' : undefined, color: 'var(--text-on-dark)' }}
      >
        <span className="flex-1">{value}</span>
        <ChevronDown
          className="w-3.5 h-3.5 shrink-0 transition-transform"
          style={{ color: 'var(--text-on-dark-subtle)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1.5 w-full rounded-lg overflow-hidden py-1"
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border-on-dark-strong)',
            boxShadow: 'var(--card-shadow-elevated)',
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full text-left px-3.5 py-2 text-[13px] transition-colors"
              style={{
                color: value === opt ? 'var(--brand-blue)' : 'var(--text-on-dark-muted)',
                background: value === opt ? 'var(--brand-blue-soft)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (value !== opt) (e.currentTarget as HTMLButtonElement).style.background = 'var(--border-on-dark)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = value === opt ? 'var(--brand-blue-soft)' : 'transparent';
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Step1({ data, onChange }: { data: FormData; onChange: (d: FormData) => void }) {
  const { t } = useTranslation();
  const frameworks = [
    t('newProject.frameworks.nielsen'),
    t('newProject.frameworks.wcag'),
    t('newProject.frameworks.iso'),
  ];
  const languages = [
    t('newProject.languages.english'),
    t('newProject.languages.arabic'),
  ];
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-[11px] uppercase tracking-wider text-[var(--text-faint)] mb-2">
          {t('newProject.projectName')} <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={data.projectName}
          onChange={(e) => onChange({ ...data, projectName: e.target.value })}
          placeholder={t('newProject.projectNamePlaceholder')}
          className="w-full h-10 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3.5 text-[13px] text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors"
        />
      </div>

      <div>
        <label className="block text-[11px] uppercase tracking-wider text-[var(--text-faint)] mb-2">{t('newProject.client')}</label>
        <input
          type="text"
          value={data.clientName}
          onChange={(e) => onChange({ ...data, clientName: e.target.value })}
          placeholder={t('newProject.clientPlaceholder')}
          className="w-full h-10 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3.5 text-[13px] text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors"
        />
      </div>

      <div>
        <label className="block text-[11px] uppercase tracking-wider text-[var(--text-faint)] mb-2">{t('newProject.framework')}</label>
        <SimpleDropdown
          value={data.framework}
          onChange={(v) => onChange({ ...data, framework: v })}
          options={frameworks}
        />
        <p className="mt-1.5 text-[11px]" style={{ color: 'var(--text-on-dark-subtle)' }}>
          {t('newProject.frameworkHint')}
        </p>
      </div>

      <div>
        <label className="block text-[11px] uppercase tracking-wider text-[var(--text-faint)] mb-2">{t('newProject.language')}</label>
        <SimpleDropdown
          value={data.projectLanguage}
          onChange={(v) => onChange({ ...data, projectLanguage: v })}
          options={languages}
        />
      </div>
    </div>
  );
}

export function NewProjectPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState<FormData>({
    projectName: '',
    clientName: '',
    framework: 'None',
    projectLanguage: 'English',
  });

  const canContinue = data.projectName.trim().length > 0;

  const handleContinue = () => {
    if (!canContinue) return;
    localStorage.setItem('uxm_project_framework', data.framework);
    navigate('/app/audit');
  };

  return (
    <div className="min-h-screen bg-[var(--surface-base)] flex flex-col">
      {/* Top bar */}
      <div className="h-14 flex items-center gap-4 px-6 border-b border-[var(--border-faint)] bg-[var(--surface-1)]">
        <Link to="/app/projects" className="flex items-center gap-3 pr-5 border-r border-[var(--border-faint)] h-full">
          <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0">
            <img src={logoSrc} alt="UX Mosaic Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm text-[var(--text-on-dark)]">UX Mosaic</span>
        </Link>
        <span className="text-[13px] text-[var(--text-faint)]">{t('newProject.breadcrumb')}</span>
        <div className="flex-1" />
        <AppUserMenu />
      </div>

      {/* Page body */}
      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-2)] overflow-hidden" style={{ boxShadow: 'var(--card-shadow-default)' }}>
            {/* Card header */}
            <div className="px-6 pt-6 pb-5 border-b border-[var(--border-faint)]">
              <h1 className="text-[var(--text-on-dark)] mb-1" style={{ fontSize: '22px', fontWeight: 500 }}>
                {t('newProject.heading')}
              </h1>
            </div>

            {/* Card body */}
            <div className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[var(--text-faint)] mb-2">
                    {t('newProject.projectName')} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.projectName}
                    onChange={(e) => setData({ ...data, projectName: e.target.value })}
                    placeholder={t('newProject.projectNamePlaceholder')}
                    className="w-full h-10 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3.5 text-[13px] text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[var(--text-faint)] mb-2">{t('newProject.client')}</label>
                  <input
                    type="text"
                    value={data.clientName}
                    onChange={(e) => setData({ ...data, clientName: e.target.value })}
                    placeholder={t('newProject.clientPlaceholder')}
                    className="w-full h-10 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3.5 text-[13px] text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[var(--text-faint)] mb-2">{t('newProject.framework')}</label>
                  <SimpleDropdown
                    value={data.framework}
                    onChange={(v) => setData({ ...data, framework: v })}
                    options={[
                      'None',
                      t('newProject.frameworks.nielsen'),
                      t('newProject.frameworks.wcag'),
                      t('newProject.frameworks.iso'),
                    ]}
                  />
                  <p className="mt-1.5 text-[11px]" style={{ color: 'var(--text-on-dark-subtle)' }}>
                    {t('newProject.frameworkHint')}
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[var(--text-faint)] mb-2">{t('newProject.language')}</label>
                  <SimpleDropdown
                    value={data.projectLanguage}
                    onChange={(v) => setData({ ...data, projectLanguage: v })}
                    options={[
                      t('newProject.languages.english'),
                      t('newProject.languages.arabic'),
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Card footer */}
            <div className="px-6 py-4 border-t border-[var(--border-faint)] flex items-center justify-end bg-[var(--surface-1)]">
              <button
                onClick={handleContinue}
                disabled={!canContinue}
                className="flex items-center gap-1.5 h-9 px-5 rounded-lg bg-[var(--brand-blue)] text-white text-[13px] hover:bg-[var(--brand-blue-hover)] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                {t('newProject.continue')}
                <ChevronRight className="size-4 rtl:rotate-180" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
