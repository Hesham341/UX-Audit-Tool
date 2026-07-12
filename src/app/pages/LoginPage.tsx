import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import logoSrc from '../../imports/Logo.png';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon({ color }: { color: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

type SocialProvider = 'google' | 'apple';

export function LoginPage() {
  const { t } = useTranslation();
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'signup'>(
    searchParams.get('mode') === 'login' ? 'login' : 'signup'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);

  const canSubmit = email.trim().length > 0 && password.length >= 6 && (mode === 'login' || name.trim().length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => { logIn(); navigate('/app/projects'); }, 700);
  };

  const handleSocial = (provider: SocialProvider) => {
    setSocialLoading(provider);
    setTimeout(() => { logIn(); navigate('/app/projects'); }, 900);
  };

  return (
    <div className="min-h-screen bg-[var(--surface-base)] flex flex-col">
      {/* Top bar */}
      <div className="h-14 flex items-center px-6 border-b border-[var(--border-on-dark)]">
        <Link to="/" className="flex items-center gap-3 no-underline shrink-0">
          <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0">
            <img src={logoSrc} alt="UX Mosaic" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm text-[var(--text-on-dark)]">UX Mosaic</span>
        </Link>
      </div>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-[var(--border-on-dark-strong)] bg-[var(--surface-2)] overflow-hidden" style={{ boxShadow: 'var(--card-shadow-default)' }}>
            {/* Header */}
            <div className="px-7 pt-7 pb-6 border-b border-[var(--border-on-dark)]">
              <div className="flex items-center justify-center mb-5">
                <div className="w-10 h-10 rounded-xl overflow-hidden">
                  <img src={logoSrc} alt="UX Mosaic" className="w-full h-full object-cover" />
                </div>
              </div>
              <h1 className="text-center text-[var(--text-on-dark)] mb-1" style={{ fontSize: '20px', fontWeight: 600 }}>
                {mode === 'login' ? t('login.welcomeBack') : t('login.startTrial')}
              </h1>
              <p className="text-center text-xs text-[var(--text-on-dark-subtle)]">
                {mode === 'login' ? t('login.signInDesc') : t('login.trialDesc')}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-7 py-5 space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[var(--text-on-dark-subtle)] mb-1.5">
                    {t('login.fullName')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('login.namePlaceholder')}
                    autoComplete="name"
                    className="w-full h-10 bg-[var(--surface-3)] border border-[var(--border-on-dark-strong)] rounded-lg px-3.5 text-[13px] text-[var(--text-on-dark)] placeholder:text-[var(--text-on-dark-subtle)]/50 outline-none focus:border-[var(--brand-blue)] transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[var(--text-on-dark-subtle)] mb-1.5">
                  {t('login.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('login.emailPlaceholder')}
                  autoComplete="email"
                  dir="ltr"
                  className="w-full h-10 bg-[var(--surface-3)] border border-[var(--border-on-dark-strong)] rounded-lg px-3.5 text-[13px] text-[var(--text-on-dark)] placeholder:text-[var(--text-on-dark-subtle)]/50 outline-none focus:border-[var(--brand-blue)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[var(--text-on-dark-subtle)] mb-1.5">
                  {t('login.password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? t('login.passwordPlaceholderNew') : t('login.passwordPlaceholderLogin')}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    dir="ltr"
                    className="w-full h-10 bg-[var(--surface-3)] border border-[var(--border-on-dark-strong)] rounded-lg px-3.5 pr-10 text-[13px] text-[var(--text-on-dark)] placeholder:text-[var(--text-on-dark-subtle)]/50 outline-none focus:border-[var(--brand-blue)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-on-dark-subtle)] hover:text-[var(--text-on-dark)] transition-colors"
                  >
                    {showPassword
                      ? <EyeOff className="w-4 h-4" strokeWidth={1.8} />
                      : <Eye className="w-4 h-4" strokeWidth={1.8} />}
                  </button>
                </div>
                {mode === 'login' && (
                  <div className="flex justify-start mt-1.5">
                    <button type="button" className="text-[11px] text-[var(--brand-blue)] hover:text-[var(--brand-blue-hover)] transition-colors">
                      {t('login.forgotPassword')}
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!canSubmit || loading || !!socialLoading}
                className="w-full h-10 rounded-lg bg-[var(--brand-blue)] text-[var(--on-brand)] text-[13px] flex items-center justify-center gap-2 hover:bg-[var(--brand-blue-hover)] disabled:opacity-40 disabled:pointer-events-none transition-colors mt-1"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {mode === 'signup' ? t('login.creatingAccount') : t('login.signingIn')}
                  </>
                ) : (
                  <>
                    {mode === 'signup' ? t('login.createAccount') : t('login.signIn')}
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" strokeWidth={2} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="px-7 pb-1 flex items-center gap-3">
              <div className="flex-1 h-px bg-[var(--border-on-dark)]" />
              <span className="text-[11px] text-[var(--text-on-dark-subtle)] shrink-0">{t('login.orContinueWith')}</span>
              <div className="flex-1 h-px bg-[var(--border-on-dark)]" />
            </div>

            {/* Social auth */}
            <div className="px-7 pt-4 pb-5 space-y-2.5">
              <button
                type="button"
                onClick={() => handleSocial('google')}
                disabled={!!socialLoading || loading}
                className="w-full h-10 rounded-lg flex items-center justify-center gap-2.5 text-[13px] transition-colors disabled:opacity-50 disabled:pointer-events-none"
                style={{ background: 'var(--surface-3)', border: '1px solid var(--border-on-dark-strong)', color: 'var(--text-on-dark)' }}
              >
                {socialLoading === 'google' ? (
                  <span className="w-4 h-4 border-2 border-[var(--border-on-dark-strong)] border-t-[var(--brand-blue)] rounded-full animate-spin" />
                ) : <GoogleIcon />}
                <span>{mode === 'login' ? t('login.signInWithGoogle') : t('login.signUpWithGoogle')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocial('apple')}
                disabled={!!socialLoading || loading}
                className="w-full h-10 rounded-lg flex items-center justify-center gap-2.5 text-[13px] transition-colors disabled:opacity-50 disabled:pointer-events-none"
                style={{ background: 'var(--surface-3)', border: '1px solid var(--border-on-dark-strong)', color: 'var(--text-on-dark)' }}
              >
                {socialLoading === 'apple' ? (
                  <span className="w-4 h-4 border-2 border-[var(--border-on-dark-strong)] border-t-[var(--brand-blue)] rounded-full animate-spin" />
                ) : <AppleIcon color="var(--text-on-dark)" />}
                <span>{mode === 'login' ? t('login.signInWithApple') : t('login.signUpWithApple')}</span>
              </button>
            </div>

            {/* Footer toggle */}
            <div className="px-7 pb-6 text-center">
              <span className="text-xs text-[var(--text-on-dark-subtle)]">
                {mode === 'login' ? t('login.noAccount') : t('login.alreadyHaveAccount')}
              </span>
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-xs text-[var(--brand-blue)] hover:text-[var(--brand-blue-hover)] transition-colors"
              >
                {mode === 'login' ? t('login.startFreeTrial') : t('login.signIn')}
              </button>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}
