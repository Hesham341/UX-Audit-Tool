import React from 'react';
import { Link } from 'react-router';
import { ArrowRight, FileText, Shield, SlidersHorizontal, RotateCcw, MousePointerClick, Calendar, Link2, CheckCircle2, ImageIcon, Layers, Tag, BookOpen, LayoutGrid, Plus, Folder, TrendingUp } from 'lucide-react';
import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { IssueCard, Issue, Annotation, CardPrefs, DEFAULT_CARD_PREFS } from '../components/shared-issue-card';
import monshaat30 from '../../imports/Issue_example.png';

// ── Logged-in hero — replaces the marketing hero for returning users ────────── 
function LoggedInHero() {
  const { t } = useTranslation();

  return (
    <section className="pt-16 pb-14 px-6 bg-[var(--surface-base)] border-b border-[var(--border-on-dark)]">
      <div className="max-w-4xl mx-auto">
        {/* Greeting */}
        <div className="mb-8">
          <p className="text-sm text-[var(--brand-blue)] mb-2">
            Welcome back
          </p>
          <h1 className="mb-3 text-[var(--text-on-dark)]">
            Jane Doe
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl leading-relaxed">Pick up where you left off or start a new audit.</p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/app/projects"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue-hover)] transition-colors no-underline"
          >
            <LayoutGrid className="w-4 h-4" strokeWidth={2} />
            Open Dashboard
          </Link>
          <Link
            to="/app/new"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-[var(--border-on-dark-strong)] bg-[var(--surface-2)] text-[var(--text-on-dark)] hover:bg-[var(--surface-3)] transition-colors no-underline"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            New Audit
          </Link>
        </div>

      </div>
    </section>
  );
}

function DemoIssueCard({ cardPrefs, framework }: { cardPrefs: CardPrefs, framework: string }) {
  const [issue, setIssue] = useState<Issue>({
    id: 1,
    issueTitle: 'Logo subtitle text is too small to read',
    pageName: 'Home Page',
    pageUrl: 'https://monshaat.gov.sa',
    dateTaken: '2023-08-29',
    description: 'The subtitle text located inside the logo is extremely small, making it impossible to recognise or read. The logo appears in the top-right corner of the navigation bar.',
    recommendation: 'Use a version of the logo that removes the subtitle text below the main logo mark, since at this size the text adds no value and reduces overall legibility.',
    uxLaw: 'Aesthetic and Minimalist Design (Nielsen Heuristic #8)',
    tags: 'logo, typography, legibility, navigation',
    category: 'User Interface',
    severity: 'Medium',
    priority: 'Medium',
    effort: 'Low',
    status: 'Not Resolved',
    author: 'You',
    images: [
      {
        id: 'monshaat-home-1',
        data: monshaat30,
        name: 'monshaat-homepage.png',
        originalData: monshaat30,
        objectPosition: 'right',
      },
    ],
    currentImageIndex: 0,
    annotations: [
      { imageIndex: 0, type: 'rect', x: 85, y: 1, w: 14, h: 21, color: '#EF4444' },
    ],
    visualRecImages: [],
    collapsed: false,
    comments: [],
    showComments: false,
    bookmarked: false,
  });

  const [activeAnnotation, setActiveAnnotation] = useState<{ issueId: number; tool: string } | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const updateIssue = (field: keyof Issue, value: string | boolean | number | Annotation[]) => {
    setIssue((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <IssueCard
      framework={framework}
      issue={issue}
      index={0}
      cardPrefs={cardPrefs}
      activeAnnotation={activeAnnotation}
      activeMenu={activeMenu}
      onToggleCollapse={() => updateIssue('collapsed', !issue.collapsed)}
      onSetAnnotation={(tool) => {
        setActiveAnnotation((prev) =>
          prev?.issueId === issue.id && prev?.tool === tool ? null : { issueId: issue.id, tool }
        );
      }}
      onAddImage={(file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;
          setIssue((prev) => ({
            ...prev,
            images: [...prev.images, {
              id: `img-${Date.now()}`,
              data: imageData,
              originalData: imageData,
              name: file.name,
            }],
          }));
        };
        reader.readAsDataURL(file);
      }}
      onRemoveImage={(imgIdx) => {
        setIssue((prev) => {
          const newImages = prev.images.filter((_, i) => i !== imgIdx);
          return {
            ...prev,
            images: newImages,
            currentImageIndex: Math.min(prev.currentImageIndex, Math.max(0, newImages.length - 1)),
          };
        });
      }}
      onNavigateImage={(dir) => {
        setIssue((prev) => {
          const newIndex =
            dir === 'prev'
              ? Math.max(0, prev.currentImageIndex - 1)
              : Math.min(prev.images.length - 1, prev.currentImageIndex + 1);
          return { ...prev, currentImageIndex: newIndex };
        });
      }}
      onAddVisualRec={(file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;
          setIssue((prev) => ({
            ...prev,
            visualRecImages: [...prev.visualRecImages, {
              id: `visual-${Date.now()}`,
              data: imageData,
              name: file.name,
            }],
          }));
        };
        reader.readAsDataURL(file);
      }}
      onRemoveVisualRec={(idx) => {
        setIssue((prev) => ({
          ...prev,
          visualRecImages: prev.visualRecImages.filter((_, i) => i !== idx),
        }));
      }}
      onRemoveIssue={() => {}}
      onDuplicateIssue={() => {}}
      onToggleMenu={() => {
        setActiveMenu((prev) => (prev === issue.id ? null : issue.id));
      }}
      onCloseMenu={() => setActiveMenu(null)}
      onUpdateIssue={(field, value) => updateIssue(field, value)}
      onToggleComments={() => updateIssue('showComments', !issue.showComments)}
      onAddComment={(text) => {
        setIssue((prev) => ({
          ...prev,
          comments: [
            ...prev.comments,
            {
              id: Date.now(),
              author: 'You',
              text,
              timestamp: new Date().toLocaleString(),
            },
          ],
        }));
      }}
      onDeleteComment={(commentId) => {
        setIssue((prev) => ({
          ...prev,
          comments: prev.comments.filter((c) => c.id !== commentId),
        }));
      }}
      onEditComment={(commentId, newText) => {
        setIssue((prev) => ({
          ...prev,
          comments: prev.comments.map((c) => c.id === commentId ? { ...c, text: newText } : c),
        }));
      }}
      onAddAnnotation={(ann) => {
        setIssue((prev) => ({
          ...prev,
          annotations: [...prev.annotations, ann],
        }));
      }}
      onUndoAnnotation={() => {
        setIssue((prev) => ({
          ...prev,
          annotations: prev.annotations.slice(0, -1),
        }));
      }}
      onClearAnnotations={(imageIndex) => {
        setIssue((prev) => ({
          ...prev,
          annotations: prev.annotations.filter((a) => a.imageIndex !== imageIndex),
        }));
      }}
      onReplaceImage={(imgIdx, newData) => {
        setIssue((prev) => ({
          ...prev,
          images: prev.images.map((img, i) => i === imgIdx ? { ...img, data: newData } : img),
        }));
      }}
      onRestoreImage={(imgIdx) => {
        setIssue((prev) => ({
          ...prev,
          images: prev.images.map((img, i) => i === imgIdx ? { ...img, data: img.originalData } : img),
        }));
      }}
      onToggleBookmark={() => updateIssue('bookmarked', !issue.bookmarked)}
    />
  );
}

export function HomePage() {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const [framework] = useState<string>(() => localStorage.getItem('uxm_project_framework') ?? 'None');
  const [cardPrefs, setCardPrefs] = useState<CardPrefs>(DEFAULT_CARD_PREFS);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [customizePos, setCustomizePos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const customizeRef = useRef<HTMLDivElement>(null);

  const cardFieldItems = [
    { key: 'showPage',           label: t('issueCard.pageName'),           icon: <MousePointerClick className="w-3.5 h-3.5" strokeWidth={1.8} /> },
    { key: 'showDate',           label: t('issueCard.showDate'),           icon: <Calendar className="w-3.5 h-3.5" strokeWidth={1.8} /> },
    { key: 'showLink',           label: t('issueCard.showLink'),           icon: <Link2 className="w-3.5 h-3.5" strokeWidth={1.8} /> },
    { key: 'showDescription',    label: t('issueCard.showDescription'),    icon: <FileText className="w-3.5 h-3.5" strokeWidth={1.8} /> },
    { key: 'showRecommendation', label: t('issueCard.showRecommendation'), icon: <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.8} /> },
    { key: 'showVisualRec',      label: t('issueCard.showVisualRec'),      icon: <ImageIcon className="w-3.5 h-3.5" strokeWidth={1.8} /> },
    { key: 'showMetadata',       label: t('issueCard.showMetadata'),       icon: <Layers className="w-3.5 h-3.5" strokeWidth={1.8} /> },
    { key: 'showTags',           label: t('issueCard.showTags'),           icon: <Tag className="w-3.5 h-3.5" strokeWidth={1.8} /> },
    ...(framework && framework !== 'None' ? [{ key: 'showUxLaw', label: t('issueCard.showUxLaw'), icon: <BookOpen className="w-3.5 h-3.5" strokeWidth={1.8} /> }] : []),
  ] as { key: keyof CardPrefs; label: string; icon: React.ReactNode }[];

  const subFieldItems = [
    { key: 'showCategory', label: t('issueCard.showCategory'), icon: <Layers className="w-3 h-3" strokeWidth={1.8} /> },
    { key: 'showSeverity', label: t('issueCard.showSeverity'), icon: <Layers className="w-3 h-3" strokeWidth={1.8} /> },
    { key: 'showPriority', label: t('issueCard.showPriority'), icon: <Layers className="w-3 h-3" strokeWidth={1.8} /> },
    { key: 'showEffort',   label: t('issueCard.showEffort'),   icon: <Layers className="w-3 h-3" strokeWidth={1.8} /> },
    { key: 'showStatus',   label: t('issueCard.showStatus'),   icon: <Layers className="w-3 h-3" strokeWidth={1.8} /> },
  ] as { key: keyof CardPrefs; label: string; icon: React.ReactNode }[];

  return (
    <>
      {/* Hero — switches between marketing (logged out) and personal welcome (logged in) */}
      {isLoggedIn ? (
        <LoggedInHero />
      ) : (
        <section className="pt-24 pb-32 px-6 bg-[var(--surface-base)]">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6 max-w-3xl mx-auto text-[var(--text-on-dark)]">
              {t('home.hero.headline')}
            </h1>

            <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed text-[var(--text-muted)]">
              {t('home.hero.subheadline')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-[var(--brand-blue)] text-white hover:opacity-90 transition-opacity no-underline"
              >
                {t('home.hero.ctaPrimary')}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" strokeWidth={2} />
              </Link>
              <Link
                to="/app/demo"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-[var(--border-default)] bg-[var(--surface-2)] text-[var(--text-on-dark)] hover:bg-[var(--surface-3)] transition-colors no-underline"
              >
                {t('home.hero.ctaSecondary')}
              </Link>
            </div>

            <div className="text-sm text-[var(--text-faint)]">
              {t('home.hero.trust')}
            </div>
          </div>
        </section>
      )}

      {/* Interactive Issue Card Demo — only shown to prospects */}
      {!isLoggedIn && <section className="pb-24 px-6 bg-[var(--surface-base)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-sm" style={{ color: 'var(--text-on-dark-subtle)' }}>
              {t('home.demoCard.hint')}
            </p>
          </div>

          <div className="relative">
            <div className="mb-3 flex justify-end">
              <div ref={customizeRef}>
              <button
                onClick={(e) => {
                  const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                  setCustomizePos({ top: rect.bottom + 4, left: rect.right - 280 });
                  setCustomizeOpen(!customizeOpen);
                }}
                className={`flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs transition-colors ${
                  Object.values(cardPrefs).some(v => !v)
                    ? 'bg-[var(--brand-blue)]/15 border-[var(--brand-blue)]/40 text-[var(--brand-blue)]'
                    : 'bg-[var(--surface-3)] border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.8} />
                {t('home.demoCard.cardFields')}
                {Object.values(cardPrefs).some(v => !v) && (
                  <span className="w-4 h-4 rounded-full bg-[var(--brand-blue)] text-white text-[10px] flex items-center justify-center">
                    {Object.values(cardPrefs).filter(v => !v).length}
                  </span>
                )}
              </button>
              {createPortal(
                <AnimatePresence>
                  {customizeOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -6 }}
                      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                      style={{ position: 'fixed', top: customizePos.top, left: customizePos.left, zIndex: 9999, width: 280, transformOrigin: 'top right' }}
                      className="bg-[var(--surface-elevated)] border border-[var(--border-medium)] rounded-xl shadow-2xl overflow-hidden"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div className="px-4 py-3 border-b border-[var(--border-faint)] flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[var(--text-on-dark)]">{t('home.demoCard.cardFields')}</p>
                          <p className="text-[11px] text-[var(--text-faint)] mt-0.5">{t('home.demoCard.cardFieldsHint')}</p>
                        </div>
                        {Object.values(cardPrefs).some(v => !v) && (
                          <button
                            onClick={() => setCardPrefs(DEFAULT_CARD_PREFS)}
                            className="flex items-center gap-1 text-[11px] text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" strokeWidth={2} />
                            {t('common.reset')}
                          </button>
                        )}
                      </div>
                      <div className="py-1.5">
                        {cardFieldItems.map(({ key, label, icon }) => {
                          const enabled = cardPrefs[key];
                          return (
                            <React.Fragment key={key}>
                              <button
                                onClick={() => setCardPrefs(p => ({ ...p, [key]: !p[key] }))}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface-hover)] transition-colors"
                              >
                                <span className={`shrink-0 transition-colors ${enabled ? 'text-[var(--text-subtle)]' : 'text-[var(--text-ghost)]'}`}>{icon}</span>
                                <span className={`flex-1 text-left text-xs transition-colors ${enabled ? 'text-[var(--text-on-dark)]' : 'text-[var(--text-faint)] line-through'}`}>{label}</span>
                                <span className={`relative shrink-0 w-9 h-5 rounded-full transition-colors duration-200 ${enabled ? 'bg-[var(--brand-blue)]' : 'bg-[var(--toggle-track-off)]'}`}>
                                  <span
                                    className="absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                                    style={{ transform: `translateX(${enabled ? '16px' : '0px'})` }}
                                  />
                                </span>
                              </button>

                              {key === 'showMetadata' && (
                                <AnimatePresence initial={false}>
                                  {cardPrefs.showMetadata && (
                                    <motion.div
                                      key="meta-sub"
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                      style={{ overflow: 'hidden' }}
                                    >
                                      <div className="border-l border-[var(--border-faint)] ml-[22px] pl-3 py-0.5">
                                        {subFieldItems.map(({ key: subKey, label: subLabel, icon: subIcon }) => {
                                          const subEnabled = cardPrefs[subKey];
                                          return (
                                            <button
                                              key={subKey}
                                              onClick={() => setCardPrefs(p => ({ ...p, [subKey]: !p[subKey] }))}
                                              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
                                            >
                                              <span className={`shrink-0 transition-colors ${subEnabled ? 'text-[var(--text-faint)]' : 'text-[var(--text-ghost)]'}`}>{subIcon}</span>
                                              <span className={`flex-1 text-left text-[11px] transition-colors ${subEnabled ? 'text-[var(--text-muted)]' : 'text-[var(--text-faint)] line-through'}`}>{subLabel}</span>
                                              <span className={`relative shrink-0 w-7 h-4 rounded-full transition-colors duration-200 ${subEnabled ? 'bg-[var(--brand-blue)]' : 'bg-[var(--toggle-track-off)]'}`}>
                                                <span
                                                  className="absolute top-[2px] left-[2px] w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200"
                                                  style={{ transform: `translateX(${subEnabled ? '12px' : '0px'})` }}
                                                />
                                              </span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>,
                document.body
              )}
              </div>
            </div>

            <DemoIssueCard cardPrefs={cardPrefs} framework={framework} />
          </div>
        </div>
      </section>}

      {/* Features Section */}
      <section className="py-24 px-6 bg-[var(--surface-1)] border-t border-[var(--border-on-dark)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--brand-blue)] mb-3">{t('home.features.eyebrow')}</p>
            <h2 className="mb-4 text-[var(--text-on-dark)]">{t('home.features.headline')}</h2>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              {t('home.features.subheadline')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-7">
            {[
              { icon: FileText, title: t('home.features.documentFindings'), desc: t('home.features.documentFindingsDesc') },
              { icon: Shield, title: t('home.features.evaluatePrioritize'), desc: t('home.features.evaluatePrioritizeDesc') },
              { icon: BookOpen, title: t('home.features.organizeReport'), desc: t('home.features.organizeReportDesc') },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group relative overflow-hidden bg-[var(--card-feature-gradient)] rounded-2xl p-6 border border-[var(--border-subtle)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-blue)]/45 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12),0_0_0_1px_rgba(59,130,246,0.10)]" style={{ boxShadow: 'var(--card-shadow-default)' }}>
                <div className="absolute -top-20 -right-16 w-44 h-44 rounded-full bg-[var(--brand-blue)]/10 blur-3xl pointer-events-none opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex flex-col min-h-[226px]">
                  <div className="w-24 h-24 rounded-[1.35rem] bg-gradient-to-br from-[var(--brand-blue)]/20 via-[var(--brand-blue-soft)] to-transparent border border-[var(--brand-blue)]/25 shadow-[0_8px_24px_rgba(37,99,235,0.12)] flex items-center justify-center mb-7 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.03]">
                    <Icon className="w-12 h-12 text-[var(--brand-blue)]" strokeWidth={1.55} />
                  </div>
                  <div>
                    <h3 className="mb-2.5 text-[var(--text-on-dark)]">{title}</h3>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — adapts to auth state */}
      <section className="py-24 px-6 bg-[var(--surface-base)] border-t border-[var(--border-on-dark)]">
        <div className="max-w-3xl mx-auto text-center">
          {isLoggedIn ? (
            <>
              <h2 className="mb-4 text-[var(--text-on-dark)]">Ready to continue your work?</h2>
              <p className="text-lg text-[var(--text-muted)] mb-10 leading-relaxed max-w-2xl mx-auto">
                Head back to your dashboard to pick up where you left off.
              </p>
              <Link
                to="/app/projects"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue-hover)] transition-colors no-underline"
              >
                <LayoutGrid className="w-4 h-4" strokeWidth={2} />
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <h2 className="mb-4 text-[var(--text-on-dark)]">{t('home.cta.headline')}</h2>
              <p className="text-lg text-[var(--text-muted)] mb-10 leading-relaxed max-w-2xl mx-auto">
                {t('home.cta.subheadline')}
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue-hover)] transition-colors no-underline"
              >
                {t('home.cta.button')}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" strokeWidth={2} />
              </Link>
            </>
          )}
        </div>
      </section>
    </>
  );
}
