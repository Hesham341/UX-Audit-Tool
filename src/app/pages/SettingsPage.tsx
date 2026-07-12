import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  User, Palette, Sliders, Bell, Shield,
  Check, Eye, EyeOff, Trash2, LogOut, Save,
  X, Plus, RotateCcw, Camera, Layers, Calendar, 
  Link2, CircleAlert, Flag, Zap, Circle, Layout,
  ChevronDown,
} from 'lucide-react';
import logoSrc from '../../imports/Logo.png';
import { ThemeToggle } from '../components/ThemeToggle';
import { AppUserMenu } from '../components/AppUserMenu';
import { useTheme } from '../context/ThemeContext';
import { useFieldOptions } from '../context/FieldOptionsContext';
import { useLanguage } from '../context/LanguageContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { DynamicIcon, ICON_KEYS, COLOR_PRESETS } from '../utils/iconMap';

type Section = 'profile' | 'appearance' | 'defaults' | 'notifications' | 'account' | 'fields';

const NAV: { id: Section; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'profile',       label: 'Profile',        icon: <User className="w-4 h-4" strokeWidth={1.8} />,    desc: 'Personal info & avatar' },
  { id: 'appearance',    label: 'Appearance',     icon: <Palette className="w-4 h-4" strokeWidth={1.8} />, desc: 'Theme & display' },
  { id: 'defaults',      label: 'Audit Defaults', icon: <Sliders className="w-4 h-4" strokeWidth={1.8} />, desc: 'Default field values' },
  { id: 'fields',        label: 'Field Options',  icon: <Sliders className="w-4 h-4" strokeWidth={1.8} />, desc: 'Customize labels, icons & colors' },
  { id: 'notifications', label: 'Notifications',  icon: <Bell className="w-4 h-4" strokeWidth={1.8} />,    desc: 'Alerts & digests' },
  { id: 'account',       label: 'Account',        icon: <Shield className="w-4 h-4" strokeWidth={1.8} />,  desc: 'Password & security' },
];

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-base" style={{ color: 'var(--text-on-dark)', fontWeight: 600 }}>{title}</h2>
      <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-subtle)' }}>{desc}</p>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 py-4 border-b" style={{ borderColor: 'var(--border-on-dark)' }}>
      <div className="sm:w-44 shrink-0">
        <p className="text-xs" style={{ color: 'var(--text-on-dark)', fontWeight: 600 }}>{label}</p>
        {hint && <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-on-dark-subtle)' }}>{hint}</p>}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text', dir }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; dir?: string;
}) {
  return (
    <input
      type={type}
      dir={dir}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-9 rounded-lg px-3 text-sm outline-none transition-colors"
      style={{
        background: 'var(--surface-3)',
        border: '1px solid var(--border-on-dark-strong)',
        color: 'var(--text-on-dark)',
      }}
      onFocus={e => (e.currentTarget.style.borderColor = 'var(--brand-blue)')}
      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-on-dark-strong)')}
    />
  );
}

function Toggle({ enabled, onChange, label }: { enabled: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="flex items-center gap-3 group"
    >
      <span
        className="relative shrink-0 w-9 h-5 rounded-full transition-colors duration-200"
        style={{ background: enabled ? 'var(--brand-blue)' : 'var(--border-on-dark-strong)' }}
      >
        <span
          className="absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200"
          style={{ transform: `translateX(${enabled ? '16px' : '0px'})` }}
        />
      </span>
      <span className="text-sm" style={{ color: 'var(--text-on-dark)' }}>{label}</span>
    </button>
  );
}

function SelectPill({ value, onChange, options }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string; color?: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="h-8 px-3 rounded-lg text-xs transition-colors"
          style={{
            background: value === opt.value ? 'var(--brand-blue-soft)' : 'var(--surface-3)',
            border: `1px solid ${value === opt.value ? 'var(--brand-blue)' : 'var(--border-on-dark-strong)'}`,
            color: value === opt.value ? 'var(--brand-blue)' : 'var(--text-on-dark-subtle)',
            fontWeight: value === opt.value ? 600 : 400,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Sections ────────────────────────────────────────────────────────────────

const PROFILE_KEY = 'uxm_profile';

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveProfile(patch: Record<string, any>) {
  try {
    const current = loadProfile();
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...current, ...patch }));
  } catch {}
}

function ProfileSection() {
  const { t } = useTranslation();
  const saved = loadProfile();
  const [name, setName] = useState(saved.name ?? 'Lena Hassan');
  const [email, setEmail] = useState(saved.email ?? 'lena@company.com');
  const [role, setRole] = useState(saved.role ?? 'Senior UX Researcher');
  const [company, setCompany] = useState(saved.company ?? 'Acme Design Co.');
  const [avatarImage, setAvatarImage] = useState<string | null>(saved.avatarImage ?? null);
  const [avatarIdx, setAvatarIdx] = useState(saved.avatarIdx ?? 0);
  const [avatarError, setAvatarError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = name.trim()
    ? name.trim().split(/\s+/).map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'LH';

  const handleAvatarUpload = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError(t('settings.profile.avatarTypeError'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError(t('settings.profile.avatarSizeError'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarImage(dataUrl);
      setAvatarError('');
      saveProfile({ avatarImage: dataUrl });
    };
    reader.onerror = () => setAvatarError(t('settings.profile.avatarReadError'));
    reader.readAsDataURL(file);
  };

  const removeAvatarImage = () => {
    setAvatarImage(null);
    setAvatarError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    saveProfile({ avatarImage: null });
  };

  const AVATAR_COLORS = [
    { bg: 'linear-gradient(135deg, #4274BA 0%, #6BB5AA 100%)' },
    { bg: 'linear-gradient(135deg, #C0375A 0%, #FF8D3A 100%)' },
    { bg: 'linear-gradient(135deg, #7B5EA6 0%, #4274BA 100%)' },
    { bg: 'linear-gradient(135deg, #3A9EB5 0%, #ACD8AB 100%)' },
    { bg: 'linear-gradient(135deg, #E8B84B 0%, #FF8D3A 100%)' },
  ];

  return (
    <div>
      <SectionHeader title={t('settings.profile.title')} desc={t('settings.profile.descLong')} />

      <Field label={t('settings.profile.avatar')} hint={t('settings.profile.avatarClickHint')}>
        <div className="flex items-start gap-4">
          {/* Clickable avatar with camera overlay */}
          <div className="relative shrink-0 group">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp"
              className="hidden"
              onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl overflow-hidden border relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/50"
              style={{
                background: avatarImage ? 'var(--surface-3)' : AVATAR_COLORS[avatarIdx].bg,
                borderColor: 'var(--border-on-dark-strong)',
                fontWeight: 700,
              }}
              aria-label={t('settings.profile.uploadLabel')}
              title={t('settings.profile.uploadLabel')}
            >
              {avatarImage ? (
                <img src={avatarImage} alt="Profile preview" className="w-full h-full object-cover" />
              ) : initials}
              {/* Camera overlay on hover */}
              <span className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" strokeWidth={1.8} />
              </span>
            </button>

            {/* Remove badge — only when image is set */}
            {avatarImage && (
              <button
                type="button"
                onClick={removeAvatarImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-colors focus:outline-none bg-[var(--severity-critical)] hover:opacity-90 text-white"
                aria-label={t('settings.profile.removeAvatar')}
                title={t('settings.profile.removeAvatar')}
              >
                <X className="w-3 h-3" strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Colour swatches + hint */}
          <div className="min-w-0 flex-1 pt-1">
            {(avatarError || !avatarImage) && (
              <p className="text-[11px] mb-3" style={{ color: avatarError ? '#EF4444' : 'var(--text-on-dark-subtle)' }}>
                {avatarError || 'PNG, JPG, GIF, or WebP · Max 5 MB'}
              </p>
            )}

            {!avatarImage && (
              <div className="flex gap-2 flex-wrap">
                {AVATAR_COLORS.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setAvatarIdx(i); saveProfile({ avatarIdx: i }); }}
                    className="w-7 h-7 rounded-lg transition-transform hover:scale-110 relative"
                    style={{ background: c.bg }}
                    aria-label={`Use avatar colour ${i + 1}`}
                  >
                    {avatarIdx === i && (
                      <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" strokeWidth={2.5} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Field>

      <Field label={t('settings.profile.fullName')}>
        <TextInput value={name} onChange={v => { setName(v); saveProfile({ name: v }); }} placeholder={t('settings.profile.namePlaceholder')} />
      </Field>

      <Field label={t('settings.profile.role')}>
        <TextInput value={role} onChange={v => { setRole(v); saveProfile({ role: v }); }} placeholder={t('settings.profile.rolePlaceholder')} />
      </Field>

      <Field label={t('settings.profile.company')}>
        <TextInput value={company} onChange={v => { setCompany(v); saveProfile({ company: v }); }} placeholder={t('settings.profile.companyPlaceholder')} />
      </Field>
    </div>
  );
}

function AppearanceSection() {
  const { t } = useTranslation();
  const { lang, setLang } = useLanguage();

  return (
    <div>
      <SectionHeader title={t('settings.appearance.title')} desc={t('settings.appearance.descLong')} />

      <Field label={t('settings.appearance.theme')} hint={t('settings.appearance.themeHint')}>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </Field>

      <Field label={t('settings.language.title')} hint={t('settings.language.hint')}>
        <div className="flex gap-2">
          {([
            { value: 'en', label: 'English', native: 'English' },
            { value: 'ar', label: 'Arabic',  native: 'العربية' },
          ] as const).map(({ value, label, native }) => (
            <button
              key={value}
              type="button"
              onClick={() => setLang(value)}
              className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm transition-colors border"
              style={{
                background: lang === value ? 'var(--brand-blue-soft)' : 'var(--surface-3)',
                borderColor: lang === value ? 'var(--brand-blue)' : 'var(--border-on-dark-strong)',
                color: lang === value ? 'var(--brand-blue)' : 'var(--text-on-dark-subtle)',
                fontWeight: lang === value ? 600 : 400,
              }}
            >
              <span>{native}</span>
              <span className="text-xs opacity-60">— {label}</span>
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function DefaultsSection() {
  const { t } = useTranslation();
  const [defaults, setDefaults] = useState({
    categories: 'none',
    severities: 'none',
    priorities: 'none',
    efforts: 'none',
    statuses: 'not-resolved',
  });

  const update = (k: string, v: string) => setDefaults(prev => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-10">
      <div>
        <SectionHeader
          title={t('settings.defaults.title')}
          desc={t('settings.defaults.descLong')}
        />
        
        <div className="rounded-xl border p-6" style={{ background: 'var(--surface-3)', borderColor: 'var(--border-on-dark)' }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <FieldDropdown icon={Layers} label={t('common.category')} fieldKey="categories" value={defaults.categories} onChange={(v: string) => update('categories', v)} />
            <FieldDropdown icon={CircleAlert} label={t('common.severity')} fieldKey="severities" value={defaults.severities} onChange={(v: string) => update('severities', v)} />
            <FieldDropdown icon={Flag} label={t('common.priority')} fieldKey="priorities" value={defaults.priorities} onChange={(v: string) => update('priorities', v)} />
            <FieldDropdown icon={Zap} label={t('common.effort')} fieldKey="efforts" value={defaults.efforts} onChange={(v: string) => update('efforts', v)} />
            <FieldDropdown icon={Circle} label={t('common.status')} fieldKey="statuses" value={defaults.statuses} onChange={(v: string) => update('statuses', v)} />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          
        </div>
      </div>
    </div>
  );
}

function FieldDropdown({ label, icon: Icon, fieldKey, value, onChange }: any) {
  const { options } = useFieldOptions();
  const items = options[fieldKey as keyof typeof options];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedItem = items?.find((i: any) => i.id === value) || null;
  const isDefault = !selectedItem;

  return (
    <div className="space-y-1.5" ref={ref}>
      <div className="flex items-center gap-1.5 px-1">
        <Icon className="w-3 h-3 text-[var(--text-on-dark-subtle)]" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-on-dark-subtle)]">{label}</span>
      </div>
      <div className="relative group">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full h-9 px-3 pe-8 rounded-lg text-xs outline-none transition-all cursor-pointer border flex items-center gap-2 text-start"
          style={{
            background: 'var(--surface-2)',
            borderColor: isDefault ? 'var(--border-on-dark-strong)' : 'var(--brand-blue)',
            color: 'var(--text-on-dark)',
          }}
        >
          {selectedItem ? (
            <>
              <DynamicIcon name={selectedItem.icon} className="w-3.5 h-3.5 shrink-0" style={{ color: selectedItem.color }} />
              <span className="truncate">{selectedItem.label}</span>
            </>
          ) : (
            <span className="text-[var(--text-on-dark-subtle)] truncate">None</span>
          )}
          <div className="absolute end-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full p-1 rounded-xl shadow-2xl"
               style={{ background: 'var(--surface-3)', border: '1px solid var(--border-on-dark)' }}>
            {items?.map((opt: any) => (
              <button
                key={opt.id}
                onClick={() => { onChange(opt.id); setOpen(false); }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors hover:bg-[#2A2B42] text-[var(--text-on-dark)] text-start"
              >
                <DynamicIcon name={opt.icon} className="w-3.5 h-3.5 shrink-0" style={{ color: opt.color }} />
                <span className="truncate">{opt.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationsSection() {
  const { t } = useTranslation();
  const [prefs, setPrefs] = useState({
    newComment: true,
    issueResolved: true,
    weeklyDigest: false,
    teamActivity: true,
    mentionsOnly: false,
    emailEnabled: true,
  });
  const toggle = (k: keyof typeof prefs) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  return (
    <div>
      <SectionHeader title={t('settings.notifications.title')} desc={t('settings.notifications.descLong')} />

      <div className="mb-5">
        <p className="text-xs mb-3" style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 600 }}>{t('settings.notifications.emailSection')}</p>
        <div className="space-y-4 ps-1">
          <Toggle enabled={prefs.emailEnabled} onChange={() => toggle('emailEnabled')} label={t('settings.notifications.emailEnabled')} />
          <div className={prefs.emailEnabled ? '' : 'opacity-40 pointer-events-none'}>
            <div className="space-y-4">
              <Toggle enabled={prefs.newComment}    onChange={() => toggle('newComment')}    label={t('settings.notifications.newComment')} />
              <Toggle enabled={prefs.issueResolved} onChange={() => toggle('issueResolved')} label={t('settings.notifications.issueResolved')} />
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}

function AccountSection() {
  const { t } = useTranslation();
  const saved = loadProfile();
  const email = 'hesham@gmail.com';
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const pwValid = currentPw.length >= 6 && newPw.length >= 6 && newPw === confirmPw;

  const handleChangePw = () => {
    if (!pwValid) return;
    setPwSaved(true);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setPwSaved(false), 2000);
  };

  return (
    <div>
      <SectionHeader title={t('settings.account.title')} desc={t('settings.account.descLong')} />

      {/* Email display (read-only) */}
      <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--surface-3)', border: '1px solid var(--border-on-dark)' }}>
        <h3 className="text-sm mb-3" style={{ color: 'var(--text-on-dark)', fontWeight: 600 }}>{t('settings.account.changeEmail')}</h3>
        <p className="text-sm" style={{ color: 'var(--text-on-dark-subtle)' }}>{email}</p>
      </div>

      {/* Change password */}
      <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--surface-3)', border: '1px solid var(--border-on-dark)' }}>
        <h3 className="text-sm mb-4" style={{ color: 'var(--text-on-dark)', fontWeight: 600 }}>{t('settings.account.changePassword')}</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-on-dark-subtle)' }}>{t('settings.account.currentPassword')}</label>
            <div className="relative">
              <input type={showCurrent ? 'text' : 'password'} value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                placeholder={t('settings.account.currentPasswordPlaceholder')} className="w-full h-9 rounded-lg px-3 pe-10 text-sm outline-none transition-colors"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-on-dark-strong)', color: 'var(--text-on-dark)' }} />
              <button type="button" onClick={() => setShowCurrent(s => !s)}
                className="absolute end-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: 'var(--text-on-dark-subtle)' }}>
                {showCurrent ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-on-dark-subtle)' }}>{t('settings.account.newPassword')}</label>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)}
                placeholder={t('settings.account.newPasswordPlaceholder')} className="w-full h-9 rounded-lg px-3 pe-10 text-sm outline-none transition-colors"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-on-dark-strong)', color: 'var(--text-on-dark)' }} />
              <button type="button" onClick={() => setShowNew(s => !s)}
                className="absolute end-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: 'var(--text-on-dark-subtle)' }}>
                {showNew ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-on-dark-subtle)' }}>{t('settings.account.confirmPassword')}</label>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
              placeholder={t('settings.account.confirmPasswordPlaceholder')} className="w-full h-9 rounded-lg px-3 text-sm outline-none transition-colors"
              style={{ background: 'var(--surface-2)', border: `1px solid ${confirmPw && confirmPw !== newPw ? 'var(--severity-critical)' : 'var(--border-on-dark-strong)'}`, color: 'var(--text-on-dark)' }} />
            {confirmPw && confirmPw !== newPw && (
              <p className="text-[11px] mt-1" style={{ color: 'var(--severity-critical)' }}>{t('settings.account.passwordMismatch')}</p>
            )}
          </div>
          <button onClick={handleChangePw} disabled={!pwValid}
            className="h-9 px-5 rounded-lg text-sm text-white flex items-center gap-2 transition-colors disabled:opacity-40 disabled:pointer-events-none mt-1 bg-[var(--brand-blue)] hover:bg-[var(--brand-blue-hover)]">
            {pwSaved ? <Check className="w-4 h-4" strokeWidth={2.5} /> : null}
            {pwSaved ? t('settings.account.passwordUpdated') : t('settings.account.updatePassword')}
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl p-5" style={{ background: 'var(--severity-critical-bg)', border: '1px solid var(--severity-critical-border)' }}>
        <h3 className="text-sm mb-1" style={{ color: 'var(--severity-critical)', fontWeight: 600 }}>{t('settings.account.dangerZone')}</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--text-on-dark-subtle)' }}>
          {t('settings.account.dangerZoneDesc')}
        </p>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={deleteConfirm}
            onChange={e => setDeleteConfirm(e.target.value)}
            placeholder={t('settings.account.deleteConfirmPlaceholder')}
            className="h-9 rounded-lg px-3 text-sm outline-none w-56"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--severity-critical-border)', color: 'var(--text-on-dark)' }}
          />
          <button
            disabled={deleteConfirm !== 'delete'}
            className="h-9 px-4 rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-30 disabled:pointer-events-none bg-[var(--severity-critical)] hover:opacity-90 text-white"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
            {t('settings.account.deleteAccount')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Field Options Section ────────────────────────────────────────────────────

type FieldTab = 'categories' | 'severities' | 'priorities' | 'efforts' | 'statuses';

const FIELD_TAB_IDS: FieldTab[] = ['categories', 'severities', 'priorities', 'efforts', 'statuses'];

function ColorPopover({
  color,
  onChange,
  onClose,
}: {
  color: string;
  onChange: (c: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hex, setHex] = useState(color);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  const commit = (val: string) => {
    const trimmed = val.startsWith('#') ? val : '#' + val;
    if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) onChange(trimmed);
  };

  return (
    <div
      ref={ref}
      className="absolute z-50 mt-1 p-3 rounded-xl shadow-2xl"
      style={{
        background: 'var(--surface-3)',
        border: '1px solid var(--border-on-dark)',
        minWidth: 200,
        top: '100%',
        left: 0,
      }}
    >
      <div className="grid grid-cols-6 gap-1.5 mb-3">
        {COLOR_PRESETS.map(c => (
          <button
            key={c}
            onClick={() => { onChange(c); setHex(c); }}
            className="w-6 h-6 rounded-md transition-transform hover:scale-110 relative shrink-0"
            style={{ background: c, border: c === color ? '2px solid white' : '2px solid transparent' }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md shrink-0" style={{ background: hex }} />
        <input
          type="text"
          value={hex}
          onChange={e => setHex(e.target.value)}
          onBlur={() => commit(hex)}
          onKeyDown={e => { if (e.key === 'Enter') commit(hex); }}
          className="flex-1 h-7 rounded-md px-2 text-xs outline-none"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border-on-dark-strong)',
            color: 'var(--text-on-dark)',
          }}
          maxLength={7}
        />
      </div>
    </div>
  );
}

function IconPopover({
  current,
  color,
  onChange,
  onClose,
}: {
  current: string;
  color: string;
  onChange: (k: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute z-50 mt-1 p-2 rounded-xl shadow-2xl"
      style={{
        background: 'var(--surface-3)',
        border: '1px solid var(--border-on-dark)',
        minWidth: 220,
        top: '100%',
        left: 0,
        maxHeight: 200,
        overflowY: 'auto',
      }}
    >
      <div className="grid grid-cols-7 gap-1">
        {ICON_KEYS.map(k => (
          <button
            key={k}
            onClick={() => { onChange(k); onClose(); }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border ${
              k === current 
                ? 'bg-[var(--brand-blue-soft)] border-[var(--brand-blue)]' 
                : 'bg-transparent border-transparent hover:bg-[var(--surface-hover)] hover:border-[var(--border-on-dark-strong)]'
            }`}
            title={k}
          >
            <DynamicIcon
              name={k}
              className="w-3.5 h-3.5"
              strokeWidth={1.8}
              style={{ color: k === current ? color : 'var(--text-on-dark-subtle)' }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function OptionRow({
  item,
  onLabelChange,
  onColorChange,
  onIconChange,
  onDelete,
}: {
  item: import('../context/FieldOptionsContext').OptionItem;
  onLabelChange: (v: string) => void;
  onColorChange: (v: string) => void;
  onIconChange: (v: string) => void;
  onDelete: () => void;
}) {
  const [colorOpen, setColorOpen] = useState(false);
  const [iconOpen, setIconOpen]   = useState(false);

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg"
      style={{ background: 'var(--surface-3)', border: '1px solid var(--border-on-dark)' }}
    >
      <DynamicIcon
        name={item.icon}
        className="w-4 h-4 shrink-0"
        strokeWidth={1.8}
        style={{ color: item.color }}
      />

      <input
        type="text"
        value={item.label}
        onChange={e => onLabelChange(e.target.value)}
        className="flex-1 min-w-0 h-7 rounded-md px-2 text-xs outline-none transition-colors"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border-on-dark-strong)',
          color: 'var(--text-on-dark)',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = 'var(--brand-blue)')}
        onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-on-dark-strong)')}
      />

      <div className="flex items-center gap-0">
        <div className="relative shrink-0">
          <button
            onClick={() => { setColorOpen(o => !o); setIconOpen(false); }}
            className="w-6 h-6 flex items-center justify-center transition-transform hover:scale-110 hover:z-10 relative"
            style={{ 
              background: item.color, 
              border: '1px solid var(--border-on-dark-strong)',
              borderRight: 'none',
              borderTopLeftRadius: '6px',
              borderBottomLeftRadius: '6px'
            }}
            title="Pick color"
          />
          {colorOpen && (
            <ColorPopover
              color={item.color}
              onChange={c => { onColorChange(c); }}
              onClose={() => setColorOpen(false)}
            />
          )}
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => { setIconOpen(o => !o); setColorOpen(false); }}
            className="w-6 h-6 flex items-center justify-center transition-all hover:scale-110 hover:z-10 relative"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-on-dark-strong)',
              borderTopRightRadius: '6px',
              borderBottomRightRadius: '6px'
            }}
            title="Pick icon"
          >
            <DynamicIcon
              name={item.icon}
              className="w-3.5 h-3.5 shrink-0"
              strokeWidth={1.8}
              style={{ color: item.color }}
            />
          </button>
          {iconOpen && (
            <IconPopover
              current={item.icon}
              color={item.color}
              onChange={onIconChange}
              onClose={() => setIconOpen(false)}
            />
          )}
        </div>
      </div>

      <button
        onClick={onDelete}
        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors text-[var(--text-on-dark-subtle)] hover:text-[var(--severity-critical)] hover:bg-[var(--severity-critical-bg)]"
        title="Remove"
      >
        <X className="w-3.5 h-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}

function AddOptionForm({ onAdd, onCancel }: { onAdd: (label: string, color: string, icon: string) => void; onCancel: () => void }) {
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#4274BA');
  const [icon, setIcon]   = useState('Circle');
  const [colorOpen, setColorOpen] = useState(false);
  const [iconOpen, setIconOpen]   = useState(false);

  return (
    <div
      className="flex items-center gap-2 px-3 py-2.5 rounded-lg mt-1"
      style={{ background: 'var(--brand-blue-soft)', border: '1px solid var(--brand-blue)' }}
    >
      <input
        type="text"
        value={label}
        onChange={e => setLabel(e.target.value)}
        placeholder="Label"
        autoFocus
        className="flex-1 min-w-0 h-7 rounded-md px-2 text-xs outline-none"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border-on-dark-strong)',
          color: 'var(--text-on-dark)',
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' && label.trim()) onAdd(label.trim(), color, icon);
          if (e.key === 'Escape') onCancel();
        }}
      />

      <div className="flex items-center gap-0">
        <div className="relative shrink-0">
          <button
            onClick={() => { setColorOpen(o => !o); setIconOpen(false); }}
            className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform hover:z-10 relative"
            style={{ 
              background: color, 
              border: '1px solid var(--border-on-dark-strong)',
              borderRight: 'none',
              borderTopLeftRadius: '6px',
              borderBottomLeftRadius: '6px'
            }}
          />
          {colorOpen && (
            <ColorPopover color={color} onChange={setColor} onClose={() => setColorOpen(false)} />
          )}
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => { setIconOpen(o => !o); setColorOpen(false); }}
            className="w-6 h-6 flex items-center justify-center transition-all hover:scale-110 hover:z-10 relative"
            style={{ 
              background: 'var(--surface-2)', 
              border: '1px solid var(--border-on-dark-strong)',
              borderTopRightRadius: '6px',
              borderBottomRightRadius: '6px'
            }}
          >
            <DynamicIcon name={icon} className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} style={{ color }} />
          </button>
          {iconOpen && (
            <IconPopover current={icon} color={color} onChange={v => { setIcon(v); }} onClose={() => setIconOpen(false)} />
          )}
        </div>
      </div>

      <button
        onClick={() => { if (label.trim()) onAdd(label.trim(), color, icon); }}
        disabled={!label.trim()}
        className="h-7 px-3 rounded-md text-xs text-white disabled:opacity-40 transition-colors bg-[var(--brand-blue)] hover:bg-[var(--brand-blue-hover)]"
      >
        Add
      </button>
      <button
        onClick={onCancel}
        className="h-7 px-2 rounded-md text-xs transition-colors text-[var(--text-on-dark-subtle)] bg-[var(--surface-3)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover)]"
      >
        Cancel
      </button>
    </div>
  );
}

function FieldsSection() {
  const { t } = useTranslation();
  const { options, addOption, updateOption, removeOption, resetField } = useFieldOptions();
  const [activeTab, setActiveTab] = useState<FieldTab>('categories');
  const [adding, setAdding] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ tab: FieldTab; id: string } | null>(null);
  const [pendingReset, setPendingReset] = useState<FieldTab | null>(null);

  const FIELD_TABS = FIELD_TAB_IDS.map(id => ({
    id,
    label: t(`settings.fields.tabs.${id}` as any),
  }));

  const items = options[activeTab];

  const handleTabChange = (t: FieldTab) => {
    setActiveTab(t);
    setAdding(false);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-base" style={{ color: 'var(--text-on-dark)', fontWeight: 600 }}>{t('settings.fields.title')}</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-subtle)' }}>{t('settings.fields.descLong')}</p>
        </div>
        <button
          onClick={() => setPendingReset(activeTab)}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs transition-colors shrink-0 bg-[var(--surface-3)] border border-[var(--border-on-dark-strong)] text-[var(--text-on-dark-subtle)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)]"
        >
          <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.8} />
          {t('settings.fields.resetToDefaults')}
        </button>
      </div>

      <div className="flex gap-1 mb-5 flex-wrap">
        {FIELD_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`h-8 px-3.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 border ${
              activeTab === tab.id 
                ? 'bg-[var(--brand-blue-soft)] border-[var(--brand-blue)] text-[var(--brand-blue)] font-semibold' 
                : 'bg-[var(--surface-3)] border-[var(--border-on-dark-strong)] text-[var(--text-on-dark-subtle)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)] font-normal'
            }`}
          >
            {tab.id === 'categories' && <Layers className="w-3.5 h-3.5" />}
            {tab.id === 'severities' && <CircleAlert className="w-3.5 h-3.5" />}
            {tab.id === 'priorities' && <Flag className="w-3.5 h-3.5" />}
            {tab.id === 'efforts' && <Zap className="w-3.5 h-3.5" />}
            {tab.id === 'statuses' && <Circle className="w-3.5 h-3.5" />}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {items.map(item => (
          <OptionRow
            key={item.id}
            item={item}
            onLabelChange={v => updateOption(activeTab, item.id, { label: v })}
            onColorChange={v => updateOption(activeTab, item.id, { color: v })}
            onIconChange={v => updateOption(activeTab, item.id, { icon: v })}
            onDelete={() => setPendingDelete({ tab: activeTab, id: item.id })}
          />
        ))}

        {adding && (
          <AddOptionForm
            onAdd={(label, color, icon) => {
              addOption(activeTab, { label, color, icon });
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        )}

        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 h-9 px-3 rounded-lg text-xs transition-colors mt-1 bg-transparent border border-dashed border-[var(--border-on-dark-strong)] text-[var(--text-on-dark-subtle)] hover:text-[var(--brand-blue)] hover:border-[var(--brand-blue)] hover:bg-[var(--brand-blue-soft)]"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            {t('settings.fields.addOption')}
          </button>
        )}
      </div>

      <ConfirmModal
        open={!!pendingDelete}
        title={t('settings.fields.deleteOption')}
        message={t('settings.fields.deleteOptionMsg')}
        confirmLabel={t('settings.fields.remove')}
        onConfirm={() => {
          if (pendingDelete) removeOption(pendingDelete.tab, pendingDelete.id);
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />

      <ConfirmModal
        open={!!pendingReset}
        title={t('settings.fields.resetConfirmTitle')}
        message={t('settings.fields.resetConfirmMsg')}
        confirmLabel={t('settings.fields.resetConfirmBtn')}
        onConfirm={() => {
          if (pendingReset) resetField(pendingReset);
          setPendingReset(null);
        }}
        onCancel={() => setPendingReset(null)}
      />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function SettingsPage() {
  const { t } = useTranslation();
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState<Section>('profile');

  const returnUrl = (location.state as any)?.from || '/app/projects';
  let backText = t('common.backToProjects');
  if (returnUrl === '/') {
    backText = t('settings.backToHome');
  } else if (returnUrl.includes('/audit')) {
    backText = t('settings.backToAudit');
  } else if (returnUrl.includes('/demo')) {
    backText = t('settings.backToDemo');
  } else if (returnUrl.includes('/client-view')) {
    backText = t('settings.backToClientView');
  } else if (returnUrl.includes('/new')) {
    backText = t('settings.backToNewProject');
  }

  const NAV_TRANSLATED: { id: Section; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'profile',       label: t('settings.profile.title'),        icon: NAV[0].icon, desc: t('settings.profile.desc') },
    { id: 'appearance',    label: t('settings.appearance.title'),     icon: NAV[1].icon, desc: t('settings.appearance.desc') },
    { id: 'defaults',      label: t('settings.defaults.title'),       icon: NAV[2].icon, desc: t('settings.defaults.desc') },
    { id: 'fields',        label: t('settings.fields.title'),          icon: NAV[3].icon, desc: t('settings.fields.desc') },
    { id: 'notifications', label: t('settings.notifications.title'),  icon: NAV[4].icon, desc: t('settings.notifications.desc') },
    { id: 'account',       label: t('settings.account.title'),        icon: NAV[5].icon, desc: t('settings.account.desc') },
  ];

  const CONTENT: Record<Section, React.ReactNode> = {
    profile:       <ProfileSection />,
    appearance:    <AppearanceSection />,
    defaults:      <DefaultsSection />,
    fields:        <FieldsSection />,
    notifications: <NotificationsSection />,
    account:       <AccountSection />,
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--surface-base)' }}>
      {/* Topbar */}
      <div
        className="h-14 flex items-center justify-between px-6 border-b sticky top-0 z-30"
        style={{ background: 'var(--surface-1)', borderColor: 'var(--border-on-dark)' }}
      >
        <div className="flex items-center gap-4">
          <Link to="/app/projects" className="flex items-center gap-3 no-underline shrink-0">
            <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0">
              <img src={logoSrc} alt="UX Mosaic" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm" style={{ color: 'var(--text-on-dark)' }}>UX Mosaic</span>
          </Link>
          <div className="w-px h-5" style={{ background: 'var(--border-on-dark)' }} />
          <span className="text-[13px]" style={{ color: 'var(--text-on-dark-subtle)' }}>{t('common.settings')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={returnUrl}
            className="h-8 px-3 rounded-lg text-xs flex items-center gap-1.5 no-underline transition-colors"
            style={{ color: 'var(--text-on-dark-subtle)', background: 'var(--surface-3)' }}
          >
            {backText}
          </Link>
          <AppUserMenu />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex max-w-5xl w-full mx-auto px-4 py-8 gap-8">
        {/* Sidebar */}
        <aside className="w-52 shrink-0">
          <p className="text-[10px] uppercase tracking-widest mb-3 px-3" style={{ color: 'var(--text-on-dark-subtle)' }}>
            {t('settings.settingsLabel')}
          </p>
          <nav className="flex flex-col gap-0.5">
            {NAV_TRANSLATED.map(item => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-start transition-colors w-full group ${
                  active === item.id 
                    ? 'bg-[var(--brand-blue-soft)] text-[var(--brand-blue)]' 
                    : 'bg-transparent text-[var(--text-on-dark-subtle)] hover:bg-[var(--surface-3)] hover:text-[var(--text-on-dark)]'
                }`}
              >
                <span className={active === item.id ? 'text-[var(--brand-blue)]' : 'text-[var(--text-on-dark-subtle)] group-hover:text-[var(--text-on-dark)]'}>
                  {item.id === 'fields' ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M8 6h13" />
                      <path d="M8 12h13" />
                      <path d="M8 18h13" />
                      <path d="M3 6h.01" />
                      <path d="M3 12h.01" />
                      <path d="M3 18h.01" />
                    </svg>
                  ) : item.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-xs truncate" style={{ fontWeight: active === item.id ? 600 : 500 }}>{item.label}</p>
                </div>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6">
            <button
              onClick={() => { logOut(); navigate('/'); }}
              className="w-full flex items-center gap-2 ps-3 pe-3 py-2.5 rounded-lg text-xs transition-colors text-start text-[var(--text-on-dark-subtle)] hover:text-[var(--severity-critical)] hover:bg-[var(--severity-critical-bg)]"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.8} />
              {t('common.signOut')}
            </button>
          </div>
        </aside>

        {/* Content */}
        <main
          className="flex-1 min-w-0 rounded-xl p-6"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-on-dark)' }}
        >
          {CONTENT[active]}
        </main>
      </div>
    </div>
  );
}
