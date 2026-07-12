import React from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import {
  Folder, Layers, ListChecks, CheckCircle2, BarChart2,
  Filter, ChevronDown,
  AlertCircle, Flag, Zap, ArrowUpDown, X,
  SortAsc, SortDesc, Circle, XCircle, Clock,
  FileText, Image as ImageIcon, Quote, Milestone,
  Maximize2, Search, Link2, MousePointerClick, Calendar, HelpCircle, SlidersHorizontal, Tag, Settings,
} from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import logoSrc from '../../imports/Logo.png';
import monshaat30 from '../../imports/Issue_example.png';
import monshaat31 from '../../imports/Issue_example.png';
import { type Issue, type Annotation } from '../components/shared-issue-card';
import { useFieldOptions } from '../context/FieldOptionsContext';
import { DynamicIcon } from '../utils/iconMap';
import { DateRangeFilter } from '../components/date-range-filter';
import { MultiSelectFilter } from '../components/multi-select-filter';

// ─── Types ────────────────────────────────────────────────────────────────────
type SortField = 'severity' | 'priority' | 'effort' | 'none';
type SortDir = 'asc' | 'desc';

const SEVERITY_ORDER = { Critical: 4, High: 3, Medium: 2, Low: 1 };
const PRIORITY_ORDER = { High: 3, Medium: 2, Low: 1 };
const EFFORT_ORDER   = { High: 3, Medium: 2, Low: 1 };

// ─── Card prefs ───────────────────────────────────────────────────────────────
type ClientCardPrefs = {
  showPage: boolean;
  showDate: boolean;
  showLink: boolean;
  showDescription: boolean;
  showRecommendation: boolean;
  showVisualRec: boolean;
  showMetadata: boolean;
  showCategory: boolean;
  showSeverity: boolean;
  showPriority: boolean;
  showEffort: boolean;
};

const DEFAULT_CLIENT_CARD_PREFS: ClientCardPrefs = {
  showPage: true,
  showDate: true,
  showLink: true,
  showDescription: true,
  showRecommendation: true,
  showVisualRec: true,
  showMetadata: true,
  showCategory: true,
  showSeverity: true,
  showPriority: true,
  showEffort: true,
};


// ─── Mock issues ──────────────────────────────────────────────────────────────
const CLIENT_ISSUES: Issue[] = [
  {
    // Scenario 1: image + annotation + full fields
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
      { id: 'monshaat-home-1', data: monshaat30, name: 'monshaat-homepage.png', originalData: monshaat30, objectPosition: 'right' },
      { id: 'monshaat-home-2', data: monshaat31, name: 'monshaat-nav-detail.png', originalData: monshaat31, objectPosition: 'top left' },
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
  },
  {
    // Scenario 2: image + visual recommendation
    id: 2,
    issueTitle: 'Missing Error State Feedback',
    pageName: 'Dashboard',
    pageUrl: 'https://example.com/dashboard',
    dateTaken: '2026-05-29',
    description: 'When an API call fails, users see a blank screen with no explanation or recovery action.',
    recommendation: 'Add an error boundary with a user-friendly message, retry button, and link to support.',
    uxLaw: "Error Prevention (Nielsen's Heuristic #5)",
    tags: 'error handling, feedback',
    category: 'Bug',
    severity: 'Critical',
    priority: 'High',
    effort: 'Medium',
    status: 'In Progress',
    author: 'You',
    images: [
      { id: 'dashboard-error-1', data: monshaat30, name: 'dashboard-error-state.png', originalData: monshaat30, objectPosition: 'center' },
    ],
    currentImageIndex: 0,
    annotations: [],
    visualRecImages: [
      { id: 'visual-rec-1', name: 'error-state-recommendation.png', data: monshaat31, storagePath: null },
    ],
    collapsed: false,
    comments: [],
    showComments: false,
    bookmarked: false,
  },
  {
    // Scenario 3: no image, no visual rec (minimal fields)
    id: 3,
    issueTitle: 'Inconsistent Button Padding Across Pages',
    pageName: 'Checkout',
    pageUrl: '',
    dateTaken: '2026-06-01',
    description: 'Primary action buttons use different horizontal padding on the checkout and confirmation pages, creating a visually inconsistent experience.',
    recommendation: '',
    uxLaw: '',
    tags: '',
    category: 'User Interface',
    severity: 'Low',
    priority: 'Low',
    effort: 'Low',
    status: 'Not Resolved',
    author: 'You',
    images: [],
    currentImageIndex: 0,
    annotations: [],
    visualRecImages: [],
    collapsed: false,
    comments: [],
    showComments: false,
    bookmarked: false,
  },
  {
    // Scenario 4: fully resolved, all fields, image with annotation
    id: 4,
    issueTitle: 'Search Bar Not Accessible via Keyboard',
    pageName: 'Search Results',
    pageUrl: 'https://example.com/search',
    dateTaken: '2026-05-15',
    description: 'The main search bar cannot be reached or activated using keyboard navigation alone. Users relying on keyboard or screen readers are unable to perform searches. During testing, pressing Tab from the navigation menu skipped the search bar entirely and jumped directly to the page body content. This was reproduced consistently across Chrome, Firefox, and Safari on both Windows and macOS. The issue affects all user flows that involve search — including product discovery, help centre queries, and internal admin lookups. When combined with the absence of a visible focus indicator anywhere on the page, this renders the entire search functionality inaccessible to assistive technology users. This likely violates WCAG 2.1 Level AA criteria 2.1.1 (Keyboard) and 2.4.7 (Focus Visible), and may expose the product to accessibility compliance risk in regulated markets.',
    recommendation: 'Ensure the search input has a visible focus state, is reachable via Tab, and that pressing Enter submits the query. Add an aria-label or aria-labelledby attribute so screen readers announce the input purpose clearly. Additionally, consider adding a skip-link at the top of the page that allows keyboard users to jump directly to the search bar without tabbing through the full navigation. Verify that all interactive elements within the search component — including the submit button, autocomplete suggestions, and filter chips — are also keyboard navigable and correctly announce their state via ARIA roles and properties. Run the updated implementation through automated accessibility tools (axe DevTools, Lighthouse) and conduct a manual screen reader test with NVDA on Windows and VoiceOver on macOS before closing this ticket.',
    uxLaw: 'Accessibility (WCAG 2.1 – 2.1.1 Keyboard)',
    tags: 'accessibility, keyboard, search',
    category: 'Usability',
    severity: 'High',
    priority: 'High',
    effort: 'Low',
    status: 'Resolved',
    author: 'You',
    images: [
      { id: 'search-a11y-1', data: monshaat30, name: 'search-keyboard-issue.png', originalData: monshaat30, objectPosition: 'top' },
    ],
    currentImageIndex: 0,
    annotations: [
      { imageIndex: 0, type: 'rect', x: 5, y: 5, w: 60, h: 12, color: '#3A9EB5' },
    ],
    visualRecImages: [],
    collapsed: false,
    comments: [],
    showComments: false,
    bookmarked: true,
  },
];

// ─── Read-only annotation overlay ─────────────────────────────────────────────
function AnnotationOverlay({ annotations, imageIndex }: { annotations: Annotation[]; imageIndex: number }) {
  const anns = annotations.filter(a => a.imageIndex === imageIndex);
  if (anns.length === 0) return null;
  return (
    <>
      {/* SVG: arrows */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 2 }}>
        <defs>
          {anns.filter(a => a.type === 'arrow').map((ann, i) => (
            <marker key={i} id={`client-arrow-${imageIndex}-${i}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={ann.color ?? '#FF5C5C'} />
            </marker>
          ))}
        </defs>
        {anns.map((ann, i) => {
          if (ann.type !== 'arrow' || ann.endX == null || ann.endY == null) return null;
          const arrowIdx = anns.filter(a => a.type === 'arrow').indexOf(ann);
          return (
            <line key={i}
              x1={`${ann.x}%`} y1={`${ann.y}%`}
              x2={`${ann.endX}%`} y2={`${ann.endY}%`}
              stroke={ann.color ?? '#FF5C5C'} strokeWidth="2.5"
              markerEnd={`url(#client-arrow-${imageIndex}-${arrowIdx})`} />
          );
        })}
      </svg>

      {/* Div layer: rects, blur, numbers, text */}
      {anns.map((ann, i) => {
        if (ann.type === 'rect' && ann.w != null && ann.h != null) {
          return (
            <div key={i} className="absolute rounded-sm pointer-events-none" style={{
              zIndex: 3, left: `${ann.x}%`, top: `${ann.y}%`,
              width: `${ann.w}%`, height: `${ann.h}%`,
              border: `2px solid ${ann.color ?? '#FF5C5C'}`,
            }} />
          );
        }
        if (ann.type === 'blur' && ann.w != null && ann.h != null) {
          return (
            <div key={i} className="absolute rounded-sm pointer-events-none backdrop-blur-xl" style={{
              zIndex: 3, left: `${ann.x}%`, top: `${ann.y}%`,
              width: `${ann.w}%`, height: `${ann.h}%`,
              border: `1.5px solid ${(ann.color ?? '#4274BA')}88`,
              backgroundColor: `${ann.color ?? '#4274BA'}33`,
            }} />
          );
        }
        if (ann.type === 'number') {
          return (
            <div key={i} className="absolute flex items-center justify-center rounded-full text-white shadow-md pointer-events-none" style={{
              zIndex: 4, left: `${ann.x}%`, top: `${ann.y}%`,
              width: 24, height: 24, transform: 'translate(-50%, -50%)',
              backgroundColor: ann.color ?? '#4274BA', fontSize: 11, fontWeight: 700,
            }}>
              {ann.numberValue ?? 1}
            </div>
          );
        }
        if (ann.type === 'text' && ann.text) {
          return (
            <div key={i} className="absolute pointer-events-none" style={{
              zIndex: 4, left: `${ann.x}%`, top: `${ann.y}%`,
              color: ann.color ?? '#ffffff', fontSize: 13, fontWeight: 600,
              textShadow: '0 1px 3px rgba(0,0,0,0.8)', whiteSpace: 'nowrap',
            }}>
              {ann.text}
            </div>
          );
        }
        return null;
      })}
    </>
  );
}

// ─── Read-only Client Issue Card ───────────────���──────────────────────────────
function ClientIssueCard({ issue, index, cardPrefs }: { issue: Issue; index: number; cardPrefs: ClientCardPrefs }) {
  const { options: fieldOpts } = useFieldOptions();
  const [collapsed, setCollapsed]     = useState(false);
  const [imgIdx, setImgIdx]           = useState(issue.currentImageIndex);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasDesc    = !!issue.description?.trim();
  const hasRec     = !!issue.recommendation?.trim();
  const hasVisual  = issue.visualRecImages?.length > 0;
  const hasImage   = issue.images?.length > 0;
  const currentImg = issue.images[imgIdx];

  // Show annotations only if they exist for this image index
  const imageAnnotations = issue.annotations.filter(a => a.imageIndex === imgIdx);
  const hasAnnotations   = imageAnnotations.length > 0;

  // Only images with annotations are navigable via thumbnails in client view
  const annotatedThumbs = issue.images
    .map((img, i) => ({ img, i, anns: issue.annotations.filter(a => a.imageIndex === i) }))
    .filter(({ anns }) => anns.length > 0);
  const annotatedThumbIdx = annotatedThumbs.findIndex(({ i }) => i === imgIdx);

  const renderImage = (heightClass: string, contain = false) => (
    <div className={`w-full ${heightClass} bg-[var(--surface-3)] border border-[var(--border-subtle)] rounded-xl relative overflow-hidden group`}>
      <img
        src={currentImg?.data}
        alt={currentImg?.name ?? 'Issue screenshot'}
        className="w-full h-full"
        style={{
          objectFit: contain ? 'contain' : 'cover',
          objectPosition: (currentImg as any)?.objectPosition ?? 'center',
        }}
        draggable={false}
      />
      {/* Only show annotation overlay when annotations exist */}
      {hasAnnotations && (
        <AnnotationOverlay annotations={issue.annotations} imageIndex={imgIdx} />
      )}
      {annotatedThumbs.length > 1 && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md text-xs text-white/80">
          {annotatedThumbIdx + 1} / {annotatedThumbs.length}
        </div>
      )}
      {!lightboxOpen && (
        <button
          onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
          className="absolute bottom-2 right-2 w-7 h-7 rounded-lg bg-black/50 hover:bg-black/70 text-white/80 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-20"
          title="View fullscreen"
        >
          <Maximize2 className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className={`bg-[var(--surface-2)] border rounded-xl overflow-hidden transition-colors ${collapsed ? 'border-[var(--border-faint)]' : 'border-[var(--border-subtle)]'}`}>

        {/* ── Card Header — no severity chip ── */}
        <div className="px-5 py-3 flex items-center gap-3 border-b border-[var(--border-faint)] bg-[var(--surface-1)]">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="flex items-center gap-1 text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
          >
            {collapsed
              ? <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              : <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            }
          </button>
          <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[var(--surface-base)] text-[9px]"
            style={{ background: 'var(--brand-teal)', fontWeight: 700 }}>
            {index + 1}
          </div>
          <p className="flex-1 min-w-0 text-base text-white truncate" style={{ fontWeight: 600 }}>
            {issue.issueTitle || 'Untitled issue'}
          </p>
        </div>

        {/* ── Collapsible Body ── */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="p-5">

                {/* ── Two-column layout matching audit page ── */}
                <div className="flex items-start gap-5 flex-wrap lg:flex-nowrap">

                  {/* Left: Page/Date/Link + Image */}
                  <div className="shrink-0 w-full lg:w-[420px] xl:w-[480px] flex flex-col gap-2">

                    {/* Page / Date / Link above the image */}
                    {(cardPrefs.showPage || cardPrefs.showDate || cardPrefs.showLink) && (
                      <div className="flex items-stretch gap-2 flex-wrap">
                        {cardPrefs.showPage && issue.pageName && (
                          <div className="flex flex-col gap-0.5 px-3 py-2 rounded-lg flex-1 min-w-[100px]"
                            style={{ background: 'var(--surface-3)', border: '1px solid var(--border-on-dark)' }}>
                            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 600 }}>
                              <MousePointerClick className="w-3 h-3 shrink-0" strokeWidth={2} /> Page
                            </span>
                            <span className="text-xs truncate" style={{ color: 'var(--text-on-dark)', fontWeight: 600 }}>{issue.pageName}</span>
                          </div>
                        )}
                        {cardPrefs.showDate && issue.dateTaken && (
                          <div className="flex flex-col gap-0.5 px-3 py-2 rounded-lg flex-1 min-w-[100px]"
                            style={{ background: 'var(--surface-3)', border: '1px solid var(--border-on-dark)' }}>
                            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 600 }}>
                              <Calendar className="w-3 h-3 shrink-0" strokeWidth={2} /> Date
                            </span>
                            <span className="text-xs" style={{ color: 'var(--text-on-dark)', fontWeight: 600 }}>
                              {issue.dateTaken.split('-').reverse().join('/')}
                            </span>
                          </div>
                        )}
                        {cardPrefs.showLink && issue.pageUrl && (
                          <div className="flex flex-col gap-0.5 px-3 py-2 rounded-lg flex-1 min-w-[120px]"
                            style={{ background: 'var(--surface-3)', border: '1px solid var(--border-on-dark)' }}>
                            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 600 }}>
                              <Link2 className="w-3 h-3 shrink-0" strokeWidth={2} /> Link
                            </span>
                            <a href={issue.pageUrl} target="_blank" rel="noopener noreferrer"
                              className="text-xs truncate no-underline hover:underline" style={{ color: 'var(--brand-blue)', fontWeight: 600 }}>
                              {issue.pageUrl}
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Image */}
                    {hasImage && currentImg ? (
                      <>
                        {renderImage('h-72')}
                        {annotatedThumbs.length > 1 ? (
                          <div className="flex gap-2 flex-wrap">
                            {annotatedThumbs.map(({ img, i, anns }) => (
                              <button
                                key={img.id}
                                onClick={() => setImgIdx(i)}
                                className={`relative w-20 h-14 rounded-lg border transition-all overflow-hidden ${imgIdx === i ? 'border-[var(--brand-blue)] ring-2 ring-[var(--brand-blue)]/30' : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)]'}`}
                              >
                                <img src={img.data} alt={img.name} className="w-full h-full object-cover"
                                  style={{ objectPosition: (img as any).objectPosition ?? 'center' }} />
                                {anns.filter(a => a.type === 'rect' && a.w != null && a.h != null).map((ann, ai) => (
                                  <div key={ai} className="absolute rounded-sm pointer-events-none" style={{ left: `${ann.x}%`, top: `${ann.y}%`, width: `${ann.w}%`, height: `${ann.h}%`, border: `1px solid ${ann.color ?? '#FF5C5C'}` }} />
                                ))}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <div className="w-full h-72 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2"
                        style={{ background: 'var(--surface-3)', borderColor: 'var(--border-subtle)' }}>
                        <ImageIcon className="w-8 h-8" style={{ color: 'var(--text-faint)' }} strokeWidth={1.5} />
                        <p className="text-xs" style={{ color: 'var(--text-placeholder)' }}>No image of this issue</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Content column */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <AnimatePresence initial={false}>

                    {cardPrefs.showDescription && hasDesc && (
                      <motion.div key="desc"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                        <div className="mb-4 rounded-xl p-4"
                          style={{ background: 'var(--surface-3)', border: '1px solid var(--border-subtle)' }}>
                          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider mb-1.5"
                            style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 600 }}>
                            <FileText className="w-3 h-3" strokeWidth={2} /> Description
                          </p>
                          <div style={{ maxHeight: '4.5rem', overflowY: 'auto' }}>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
                              {issue.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {cardPrefs.showRecommendation && hasRec && (
                      <motion.div key="rec"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                        <div className="mb-4 rounded-xl p-4"
                          style={{ background: 'var(--brand-blue-soft)', border: '1px solid rgba(66,116,186,0.2)' }}>
                          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider mb-1.5"
                            style={{ color: 'var(--brand-blue)', fontWeight: 600 }}>
                            <CheckCircle2 className="w-3 h-3" strokeWidth={2} /> Recommendation
                          </p>
                          <div style={{ maxHeight: '4.5rem', overflowY: 'auto' }}>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
                              {issue.recommendation}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Visual Rec */}
                    {cardPrefs.showVisualRec && hasVisual && (
                      <motion.div key="visual"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                        <div className="mb-4">
                          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider mb-2"
                            style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 600 }}>
                            <ImageIcon className="w-3 h-3" strokeWidth={2} /> Visual Recommendation
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {issue.visualRecImages.map(img => (
                              <div key={img.id} className="w-32 h-24 border border-[var(--border-subtle)] rounded-lg overflow-hidden">
                                <img src={img.data} alt={img.name} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ── Metadata — explicit labeled rows, below recommendation ── */}
                    {cardPrefs.showMetadata && (
                      <motion.div key="metadata"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                      <div className="rounded-xl overflow-hidden"
                        style={{ background: 'var(--surface-3)', border: '1px solid var(--border-on-dark)' }}>
                        <AnimatePresence initial={false}>
                          {cardPrefs.showCategory && issue.category && issue.category !== 'None' && (
                            <motion.div key="cat" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.18 }} style={{ overflow: 'hidden' }}>
                              <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[var(--border-faint)]">
                                {(() => {
                                  const catOpt = fieldOpts.categories.find(c => c.label === issue.category);
                                  const c = catOpt?.color ?? 'var(--text-on-dark-subtle)';
                                  return (
                                    <>
                                      <DynamicIcon name={catOpt?.icon ?? 'Layers'} className="w-3.5 h-3.5 shrink-0" strokeWidth={2} style={{ color: c }} />
                                      <span className="text-xs shrink-0" style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 500, minWidth: 64 }}>Category</span>
                                      <span className="text-xs" style={{ color: c, fontWeight: 700 }}>{issue.category}</span>
                                    </>
                                  );
                                })()}
                              </div>
                            </motion.div>
                          )}

                          {cardPrefs.showSeverity && issue.severity && issue.severity !== 'None' && (
                            <motion.div key="sev" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.18 }} style={{ overflow: 'hidden' }}>
                              <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[var(--border-faint)]">
                                {(() => {
                                  const sevOpt = fieldOpts.severities.find(s => s.label === issue.severity);
                                  const c = sevOpt?.color ?? 'var(--text-on-dark-subtle)';
                                  return (
                                    <>
                                      <DynamicIcon name={sevOpt?.icon ?? 'AlertCircle'} className="w-3.5 h-3.5 shrink-0" strokeWidth={2} style={{ color: c }} />
                                      <span className="text-xs shrink-0" style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 500, minWidth: 64 }}>Severity</span>
                                      <span className="text-xs" style={{ color: c, fontWeight: 700 }}>{issue.severity}</span>
                                    </>
                                  );
                                })()}
                              </div>
                            </motion.div>
                          )}

                          {cardPrefs.showPriority && issue.priority && issue.priority !== 'None' && (
                            <motion.div key="pri" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.18 }} style={{ overflow: 'hidden' }}>
                              <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[var(--border-faint)]">
                                {(() => {
                                  const priOpt = fieldOpts.priorities.find(p => p.label === issue.priority);
                                  const c = priOpt?.color ?? 'var(--text-on-dark-subtle)';
                                  return (
                                    <>
                                      <DynamicIcon name={priOpt?.icon ?? 'Flag'} className="w-3.5 h-3.5 shrink-0" strokeWidth={2} style={{ color: c }} />
                                      <span className="text-xs shrink-0" style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 500, minWidth: 64 }}>Priority</span>
                                      <span className="text-xs" style={{ color: c, fontWeight: 700 }}>{issue.priority}</span>
                                    </>
                                  );
                                })()}
                              </div>
                            </motion.div>
                          )}

                          {cardPrefs.showEffort && issue.effort && issue.effort !== 'None' && (
                            <motion.div key="eff" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.18 }} style={{ overflow: 'hidden' }}>
                              <div className="flex items-center gap-2.5 px-4 py-2.5">
                                {(() => {
                                  const effOpt = fieldOpts.efforts.find(e => e.label === issue.effort);
                                  const c = effOpt?.color ?? 'var(--text-on-dark-subtle)';
                                  return (
                                    <>
                                      <DynamicIcon name={effOpt?.icon ?? 'Zap'} className="w-3.5 h-3.5 shrink-0" strokeWidth={2} style={{ color: c }} />
                                      <span className="text-xs shrink-0" style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 500, minWidth: 64 }}>Effort</span>
                                      <span className="text-xs" style={{ color: c, fontWeight: 700 }}>{issue.effort}</span>
                                    </>
                                  );
                                })()}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      </motion.div>
                    )}

                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox portal */}
      {lightboxOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/92 backdrop-blur-sm overflow-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxOpen(false); }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="fixed top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-[10000]"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
          <div className="mx-auto max-w-7xl p-6 flex flex-col gap-3">
            <div className="relative w-full h-[78vh] bg-[var(--surface-3)] border border-[var(--border-subtle)] rounded-xl overflow-hidden">
              <img
                src={currentImg?.data}
                alt={currentImg?.name ?? 'Issue screenshot'}
                className="w-full h-full object-contain"
                draggable={false}
              />
              {hasAnnotations && (
                <AnnotationOverlay annotations={issue.annotations} imageIndex={imgIdx} />
              )}
            </div>
            {issue.images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {issue.images.map((img, i) => (
                  <button key={img.id} onClick={() => setImgIdx(i)}
                    className={`relative w-20 h-14 rounded-lg border transition-all overflow-hidden ${imgIdx === i ? 'border-[var(--brand-blue)] ring-2 ring-[var(--brand-blue)]/30' : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)]'}`}>
                    <img src={img.data} alt={img.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

// ─── Multi-token input (page names & tags) ────────────────────────────────────
function MultiTokenInput({
  tokens,
  onTokensChange,
  suggestions,
  placeholder = 'Type to search…',
  allowFreeInput = false,
}: {
  tokens: string[];
  onTokensChange: (t: string[]) => void;
  suggestions: string[];
  placeholder?: string;
  allowFreeInput?: boolean;
}) {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen]             = useState(false);
  const [hlIdx, setHlIdx]           = useState(-1);
  const inputRef     = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = suggestions.filter(
    s => !tokens.includes(s) && s.toLowerCase().includes(inputValue.toLowerCase())
  );

  const addToken = (val: string) => {
    const v = val.trim();
    if (v && !tokens.includes(v)) onTokensChange([...tokens, v]);
    setInputValue('');
    setHlIdx(-1);
  };

  const removeToken = (t: string) => onTokensChange(tokens.filter(x => x !== t));

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        className="min-h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-md px-2 flex items-center flex-wrap gap-1 py-1 cursor-text focus-within:border-[var(--brand-blue)]/60 transition-colors"
        onClick={() => inputRef.current?.focus()}
      >
        {tokens.map(t => (
          <span key={t} className="inline-flex items-center gap-1 h-5 pl-1.5 pr-1 rounded bg-[var(--brand-blue)]/20 border border-[var(--brand-blue)]/30 text-[11px] text-[var(--brand-blue)] shrink-0">
            {t}
            <button
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); removeToken(t); }}
              className="flex items-center justify-center w-3 h-3 rounded-sm text-[var(--brand-blue)]/60 hover:text-[var(--brand-blue)] hover:bg-[var(--brand-blue)]/20 transition-colors"
            >
              <X className="w-2.5 h-2.5" strokeWidth={2.5} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value); setOpen(true); setHlIdx(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (hlIdx >= 0 && filtered[hlIdx]) addToken(filtered[hlIdx]);
              else if (allowFreeInput && inputValue.trim()) addToken(inputValue);
            } else if (e.key === 'Backspace' && !inputValue && tokens.length > 0) {
              removeToken(tokens[tokens.length - 1]);
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              setHlIdx(i => Math.min(i + 1, filtered.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setHlIdx(i => Math.max(i - 1, -1));
            } else if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
          placeholder={tokens.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[60px] h-5 bg-transparent text-xs text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none"
        />
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute top-full mt-1 left-0 w-full max-h-40 overflow-y-auto bg-[var(--surface-3)] border border-[var(--border-medium)] rounded-lg shadow-xl z-50">
          {filtered.map((s, i) => (
            <button
              key={s}
              onMouseDown={(e) => { e.preventDefault(); addToken(s); }}
              className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                i === hlIdx
                  ? 'bg-[var(--brand-blue)]/15 text-[var(--brand-blue)]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Client Audit Page ────────────────────────────────────────────────────────
export function ClientAuditPage() {
  const { options: fieldOpts } = useFieldOptions();
  const introduction   = (() => { try { return localStorage.getItem('uxm_audit_introduction') ?? ''; } catch { return ''; } })();
  const conclusion     = (() => { try { return localStorage.getItem('uxm_audit_conclusion')   ?? ''; } catch { return ''; } })();
  const showIntroduction = (() => { try { const v = localStorage.getItem('uxm_show_introduction'); return v === null ? true : v === 'true'; } catch { return true; } })();
  const showConclusion   = (() => { try { const v = localStorage.getItem('uxm_show_conclusion');   return v === null ? true : v === 'true'; } catch { return true; } })();
  const [sortField, setSortField] = useState<SortField>('none');
  const [sortDir, setSortDir]     = useState<SortDir>('desc');
  const [sortOpen, setSortOpen]   = useState(false);
  const [sortDropdownPos, setSortDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const [showFilters, setShowFilters]         = useState(false);
  const [filterSeverity, setFilterSeverity]   = useState('All');
  const [filterCategory, setFilterCategory]   = useState('All');
  const [filterPriority, setFilterPriority]   = useState('All');
  const [filterEffort, setFilterEffort]       = useState('All');
  const [filterPageNames, setFilterPageNames]       = useState<string[]>([]);
  const [filterTags, setFilterTags]                 = useState<string[]>([]);
  const [filterDateFrom, setFilterDateFrom]         = useState('');
  const [filterDateTo, setFilterDateTo]             = useState('');
  const [filterStatus, setFilterStatus]             = useState('All');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState<string | null>(null);
  const [filterDropdownPos, setFilterDropdownPos]   = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const [cardPrefs, setCardPrefs]         = useState<ClientCardPrefs>(DEFAULT_CLIENT_CARD_PREFS);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [customizePos, setCustomizePos]   = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [legendOpen, setLegendOpen]       = useState(false);
  const [statsOpen, setStatsOpen]         = useState(false);

  const sortRef      = useRef<HTMLDivElement>(null);
  const filterRef    = useRef<HTMLDivElement>(null);
  const customizeRef = useRef<HTMLDivElement>(null);
  const legendRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node) && !(e.target as Element).closest?.('[data-sort-portal]')) setSortOpen(false);
      if (!(e.target as Element).closest?.('[data-filter-portal]') && !filterRef.current?.contains(e.target as Node)) setFilterDropdownOpen(null);
      if (customizeRef.current && !customizeRef.current.contains(e.target as Node)) setCustomizeOpen(false);
      if (legendRef.current && !legendRef.current.contains(e.target as Node)) setLegendOpen(false);
    };
    const onScroll = () => setFilterDropdownOpen(null);
    document.addEventListener('mousedown', handler);
    document.addEventListener('scroll', onScroll, true);
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('scroll', onScroll, true); };
  }, []);

  useEffect(() => {
    const close = () => { setSortOpen(false); };
    document.addEventListener('scroll', close, { capture: true });
    return () => document.removeEventListener('scroll', close, { capture: true });
  }, []);

  const issues = CLIENT_ISSUES;

  const allPageNames = useMemo(() => [...new Set(issues.map(i => i.pageName).filter(Boolean))], []);
  const allTags = useMemo(() => {
    const s = new Set<string>();
    issues.forEach(i => { if (i.tags) i.tags.split(',').map(t => t.trim()).filter(Boolean).forEach(t => s.add(t)); });
    return [...s];
  }, []);

  const filteredIssues = issues
    .filter(i => {
      if (filterSeverity !== 'All' && i.severity !== filterSeverity) return false;
      if (filterCategory !== 'All' && i.category !== filterCategory) return false;
      if (filterPriority !== 'All' && i.priority !== filterPriority) return false;
      if (filterEffort   !== 'All' && i.effort   !== filterEffort)   return false;
      if (filterStatus   !== 'All' && i.status   !== filterStatus)   return false;
      if (filterTags.length > 0 && !filterTags.some(t => i.tags.toLowerCase().includes(t.toLowerCase()))) return false;
      if (filterPageNames.length > 0 && !filterPageNames.includes(i.pageName)) return false;
      if (filterDateFrom && i.dateTaken && i.dateTaken < filterDateFrom) return false;
      if (filterDateTo   && i.dateTaken && i.dateTaken > filterDateTo)   return false;
      return true;
    })
    .sort((a, b) => {
      if (sortField === 'none') return 0;
      let aVal = 0, bVal = 0;
      if (sortField === 'severity') { aVal = SEVERITY_ORDER[a.severity as keyof typeof SEVERITY_ORDER] ?? 0; bVal = SEVERITY_ORDER[b.severity as keyof typeof SEVERITY_ORDER] ?? 0; }
      if (sortField === 'priority') { aVal = PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] ?? 0; bVal = PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER] ?? 0; }
      if (sortField === 'effort')   { aVal = EFFORT_ORDER[a.effort   as keyof typeof EFFORT_ORDER]   ?? 0; bVal = EFFORT_ORDER[b.effort   as keyof typeof EFFORT_ORDER]   ?? 0; }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const totalIssues   = issues.length;
  const criticalCount = issues.filter(i => i.severity === 'Critical').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved').length;

  const sortLabel = sortField === 'none'
    ? 'Sort by'
    : `${sortField.charAt(0).toUpperCase() + sortField.slice(1)} (${sortDir === 'desc' ? 'High → Low' : 'Low → High'})`;

  const activeFilterCount = [filterSeverity, filterCategory, filterPriority, filterEffort, filterStatus].filter(v => v !== 'All').length
    + filterPageNames.length + filterTags.length + (filterDateFrom || filterDateTo ? 1 : 0);

  return (
    <div className="min-h-screen bg-[var(--surface-base)] flex flex-col">

      {/* ── Top bar ── */}
      <div className="h-14 flex items-center gap-4 px-6 border-b border-[var(--border-faint)] bg-[var(--surface-1)] sticky top-0 z-30">
        <Link to="/app/projects" className="flex items-center gap-3 pr-5 border-r border-[var(--border-on-dark)] h-full shrink-0 no-underline">
          <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0">
            <img src={logoSrc} alt="UX Mosaic" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm text-[var(--text-on-dark)]">UX Mosaic</span>
        </Link>

        <Link to="/app/projects"
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[var(--surface-3)] border border-[var(--border-default)] text-xs text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)] transition-colors no-underline shrink-0">
          <Folder className="w-3.5 h-3.5" strokeWidth={1.8} /> Projects
        </Link>
        <span className="text-[var(--text-placeholder)] text-sm">/</span>
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[var(--brand-blue)]" strokeWidth={1.8} />
          <span className="text-[13px] text-white">Monsha'at Audit Q2</span>
          <span className="h-5 px-2 rounded-md text-[11px] flex items-center"
            style={{ background: 'var(--brand-teal-soft)', color: 'var(--brand-teal)', border: '1px solid rgba(107,181,170,0.25)', fontWeight: 600 }}>
            Client View
          </span>
        </div>

        <div className="flex-1" />

        <button
          onClick={() => setStatsOpen(true)}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs shrink-0 transition-colors"
          style={{ background: 'var(--surface-hover-medium)', border: '1px solid var(--border-on-dark-strong)', color: 'var(--text-on-dark-subtle)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-on-dark)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-on-dark-subtle)'; }}
        >
          <BarChart2 className="w-3.5 h-3.5" strokeWidth={1.8} /> Statistics
        </button>
        <Link to="/app/audit"
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs no-underline shrink-0 transition-colors bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue-hover)]">
          ← Edit view
        </Link>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* Filter & Sort Bar */}
          <div className="bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl">
            <div className="px-5 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">

                {/* Filters toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs transition-colors ${showFilters ? 'bg-[var(--brand-blue)]/15 border-[var(--brand-blue)]/40 text-[var(--brand-blue)]' : 'bg-[var(--surface-3)] border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)]'}`}
                >
                  <Filter className="w-3.5 h-3.5" strokeWidth={1.8} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[var(--brand-blue)] text-white text-[10px] flex items-center justify-center ml-0.5">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} strokeWidth={2} />
                </button>

                {/* Sort */}
                <div className="relative" ref={sortRef}>
                  <button
                    onClick={(e) => {
                      const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                      setSortDropdownPos({ top: rect.bottom + 4, left: rect.left });
                      setSortOpen(!sortOpen);
                    }}
                    className={`flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs transition-colors ${sortField !== 'none' ? 'bg-[var(--brand-blue)]/15 border-[var(--brand-blue)]/40 text-[var(--brand-blue)]' : 'bg-[var(--surface-3)] border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)]'}`}
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" strokeWidth={1.8} />
                    {sortLabel}
                    <ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
                  </button>
                  {createPortal(
                    <AnimatePresence>
                      {sortOpen && (
                        <motion.div
                          data-sort-portal
                          initial={{ opacity: 0, scale: 0.95, y: -6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -6 }}
                          transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                          style={{ position: 'fixed', top: sortDropdownPos.top, left: sortDropdownPos.left, zIndex: 9999, transformOrigin: 'top left' }}
                          className="w-56 bg-[var(--surface-3)] border border-[var(--border-medium)] rounded-xl shadow-2xl overflow-hidden"
                        >
                          <div className="px-3 py-2 border-b border-[var(--border-faint)]">
                            <p className="text-xs text-[var(--text-faint)]">Sort by</p>
                          </div>
                          {(['severity', 'priority', 'effort'] as SortField[]).map((f, fi) => (
                            <div key={f}>
                              {fi > 0 && <div className="h-px bg-[var(--border-faint)] mx-3" />}
                              {(['desc', 'asc'] as SortDir[]).map((dir) => {
                                const isActive = sortField === f && sortDir === dir;
                                return (
                                  <button key={dir}
                                    onClick={() => { setSortField(f); setSortDir(dir); setSortOpen(false); }}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${isActive ? 'text-[var(--brand-blue)] bg-[var(--brand-blue)]/10' : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'}`}
                                  >
                                    <span className="flex items-center gap-2">
                                      {f === 'severity' && <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} />}
                                      {f === 'priority' && <Flag className="w-3.5 h-3.5" strokeWidth={2} />}
                                      {f === 'effort'   && <Zap className="w-3.5 h-3.5" strokeWidth={2} />}
                                      {f.charAt(0).toUpperCase() + f.slice(1)} ({dir === 'desc' ? 'High → Low' : 'Low → High'})
                                    </span>
                                    {isActive && (dir === 'desc' ? <SortDesc className="w-3.5 h-3.5" strokeWidth={2} /> : <SortAsc className="w-3.5 h-3.5" strokeWidth={2} />)}
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                          {sortField !== 'none' && (
                            <>
                              <div className="h-px bg-[var(--border-faint)] mx-3" />
                              <button onClick={() => { setSortField('none'); setSortOpen(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors">
                                <X className="w-3 h-3" strokeWidth={2} /> Clear sort
                              </button>
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>,
                    document.body
                  )}
                </div>

                {/* Active filter chips */}
                {filterSeverity !== 'All' && (
                  <span className="flex items-center gap-1 h-6 px-2 rounded-md bg-[var(--brand-blue)]/15 border border-[var(--brand-blue)]/25 text-[11px] text-[var(--brand-blue)]">
                    {filterSeverity} <button onClick={() => setFilterSeverity('All')}><X className="w-3 h-3" strokeWidth={2} /></button>
                  </span>
                )}
                {filterCategory !== 'All' && (
                  <span className="flex items-center gap-1 h-6 px-2 rounded-md bg-[var(--brand-blue)]/15 border border-[var(--brand-blue)]/25 text-[11px] text-[var(--brand-blue)]">
                    {filterCategory} <button onClick={() => setFilterCategory('All')}><X className="w-3 h-3" strokeWidth={2} /></button>
                  </span>
                )}
                {filterPriority !== 'All' && (
                  <span className="flex items-center gap-1 h-6 px-2 rounded-md bg-[var(--brand-blue)]/15 border border-[var(--brand-blue)]/25 text-[11px] text-[var(--brand-blue)]">
                    Priority: {filterPriority} <button onClick={() => setFilterPriority('All')}><X className="w-3 h-3" strokeWidth={2} /></button>
                  </span>
                )}
                {filterEffort !== 'All' && (
                  <span className="flex items-center gap-1 h-6 px-2 rounded-md bg-[var(--brand-blue)]/15 border border-[var(--brand-blue)]/25 text-[11px] text-[var(--brand-blue)]">
                    Effort: {filterEffort} <button onClick={() => setFilterEffort('All')}><X className="w-3 h-3" strokeWidth={2} /></button>
                  </span>
                )}
                {filterPageNames.map(p => (
                  <span key={p} className="flex items-center gap-1 h-6 px-2 rounded-md bg-[var(--brand-blue)]/15 border border-[var(--brand-blue)]/25 text-[11px] text-[var(--brand-blue)]">
                    <MousePointerClick className="w-3 h-3" strokeWidth={2} />{p}
                    <button onClick={() => setFilterPageNames(prev => prev.filter(x => x !== p))}><X className="w-3 h-3" strokeWidth={2} /></button>
                  </span>
                ))}
                {filterTags.map(t => (
                  <span key={t} className="flex items-center gap-1 h-6 px-2 rounded-md bg-[var(--brand-blue)]/15 border border-[var(--brand-blue)]/25 text-[11px] text-[var(--brand-blue)]">
                    <Tag className="w-3 h-3" strokeWidth={2} />{t}
                    <button onClick={() => setFilterTags(prev => prev.filter(x => x !== t))}><X className="w-3 h-3" strokeWidth={2} /></button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0">
              {/* Legend */}
              <div className="relative" ref={legendRef}>
                <button
                  onClick={() => setLegendOpen(!legendOpen)}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs transition-colors bg-[var(--surface-3)] border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)]"
                >
                  <HelpCircle className="w-3.5 h-3.5" strokeWidth={1.8} />
                  Legend
                </button>
                {createPortal(
                  <AnimatePresence>
                    {legendOpen && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
                        style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}
                        onMouseDown={(e) => { if (e.target === e.currentTarget) setLegendOpen(false); }}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.96, y: 12 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.96, y: 12 }}
                          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                          className="relative w-full max-w-2xl max-h-[82vh] overflow-y-auto rounded-2xl shadow-2xl"
                          style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-on-dark)' }}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          {/* Header */}
                          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
                            style={{ background: 'var(--surface-elevated)', borderColor: 'var(--border-on-dark)' }}>
                            <div className="flex items-center gap-2.5">
                              <HelpCircle className="w-4 h-4" style={{ color: 'var(--brand-blue)' }} strokeWidth={2} />
                              <span className="text-sm" style={{ color: 'var(--text-on-dark)', fontWeight: 700 }}>Field Legend</span>
                            </div>
                            <button
                              onClick={() => setLegendOpen(false)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                              style={{ color: 'var(--text-on-dark-subtle)' }}
                              onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-3)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                              <X className="w-3.5 h-3.5" strokeWidth={2} />
                            </button>
                          </div>

                          {/* Body */}
                          <div className="px-6 py-5 flex flex-col gap-6">

                            {/* Category */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Layers className="w-3.5 h-3.5" style={{ color: 'var(--text-on-dark-subtle)' }} strokeWidth={2} />
                                <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 700 }}>Category</span>
                              </div>
                              <div className="flex flex-col gap-1.5">
                                {fieldOpts.categories.map(cat => {
                                  const CATEGORY_DESCS: Record<string, string> = {
                                    'Usability':             'An issue describing behavior that prevents task completion.',
                                    'Bug':                   'An issue describing unexpected or malicious behavior.',
                                    'User Interface':        'Issues related to design.',
                                    'Feature':               'New features description.',
                                    'Content':               'Issues related to error messages and labels improvements.',
                                    'Info Architecture':     'Issues related to user flow and how content is organized.',
                                    'Information Architecture': 'Issues related to user flow and how content is organized.',
                                    'Info Design':           'Issues related to presenting information.',
                                    'Information Design':    'Issues related to presenting information.',
                                  };
                                  const desc = CATEGORY_DESCS[cat.label] ?? '';
                                  return (
                                    <div key={cat.id} className="flex items-start gap-3 px-3 py-2.5 rounded-lg" style={{ background: 'var(--surface-3)' }}>
                                      <span className="mt-0.5 shrink-0">
                                        <DynamicIcon name={cat.icon} className="w-3.5 h-3.5" strokeWidth={2} style={{ color: cat.color }} />
                                      </span>
                                      <span className="text-xs shrink-0 w-32" style={{ color: cat.color, fontWeight: 700 }}>{cat.label}</span>
                                      {desc && <span className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-subtle)' }}>{desc}</span>}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Severity */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <AlertCircle className="w-3.5 h-3.5" style={{ color: 'var(--text-on-dark-subtle)' }} strokeWidth={2} />
                                <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 700 }}>Severity</span>
                              </div>
                              <div className="flex flex-col gap-1.5">
                                {([
                                  { level: 'Low',      color: 'var(--severity-low)',      desc: 'Does not need to be fixed unless extra time is available on the project.' },
                                  { level: 'Medium',   color: 'var(--severity-medium)',   desc: 'Fixing this should be given low priority.' },
                                  { level: 'Serious',  color: 'var(--severity-serious)',  desc: 'Important to fix, so should be given high priority.' },
                                  { level: 'Critical', color: 'var(--severity-critical)', desc: 'Imperative to fix this before the product can be released.' },
                                ] as { level: string; color: string; desc: string }[]).map(({ level, color, desc }) => (
                                  <div key={level} className="flex items-start gap-3 px-3 py-2.5 rounded-lg" style={{ background: 'var(--surface-3)' }}>
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" style={{ color }} strokeWidth={2} />
                                    <span className="text-xs shrink-0 w-14" style={{ color, fontWeight: 700 }}>{level}</span>
                                    <span className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-subtle)' }}>{desc}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Priority */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Flag className="w-3.5 h-3.5" style={{ color: 'var(--text-on-dark-subtle)' }} strokeWidth={2} />
                                <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 700 }}>Priority</span>
                              </div>
                              <div className="flex flex-col gap-1.5">
                                {([
                                  { level: 'High',   color: 'var(--severity-critical)', desc: 'Must be addressed immediately — blocks progress or has wide user impact.' },
                                  { level: 'Medium', color: 'var(--severity-medium)',   desc: 'Should be scheduled in the near term before it causes larger problems.' },
                                  { level: 'Low',    color: 'var(--severity-low)',      desc: 'Can be deferred and addressed when capacity allows.' },
                                ] as { level: string; color: string; desc: string }[]).map(({ level, color, desc }) => (
                                  <div key={level} className="flex items-start gap-3 px-3 py-2.5 rounded-lg" style={{ background: 'var(--surface-3)' }}>
                                    <Flag className="w-3.5 h-3.5 shrink-0 mt-px" style={{ color }} strokeWidth={2} />
                                    <span className="text-xs shrink-0 w-14" style={{ color, fontWeight: 700 }}>{level}</span>
                                    <span className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-subtle)' }}>{desc}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Effort */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-3.5 h-3.5" style={{ color: 'var(--text-on-dark-subtle)' }} strokeWidth={2} />
                                <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 700 }}>Effort</span>
                              </div>
                              <div className="flex flex-col gap-1.5">
                                {([
                                  { level: 'Low',    color: 'var(--severity-low)',      desc: 'Quick fix with minimal time and resources required.' },
                                  { level: 'Medium', color: 'var(--severity-medium)',   desc: 'Fix with moderate time and resources.' },
                                  { level: 'High',   color: 'var(--severity-critical)', desc: 'Complex and time-consuming — requires significant effort.' },
                                ] as { level: string; color: string; desc: string }[]).map(({ level, color, desc }) => (
                                  <div key={level} className="flex items-start gap-3 px-3 py-2.5 rounded-lg" style={{ background: 'var(--surface-3)' }}>
                                    <Zap className="w-3.5 h-3.5 shrink-0 mt-px" style={{ color }} strokeWidth={2} />
                                    <span className="text-xs shrink-0 w-14" style={{ color, fontWeight: 700 }}>{level}</span>
                                    <span className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-subtle)' }}>{desc}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>,
                  document.body
                )}
              </div>

              {/* Card Fields */}
              <div className="relative" ref={customizeRef}>
                <button
                  onClick={(e) => {
                    const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                    setCustomizePos({ top: rect.bottom + 4, left: rect.right - 280 });
                    setCustomizeOpen(o => !o);
                  }}
                  className={`flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs transition-colors ${
                    Object.values(cardPrefs).some(v => !v)
                      ? 'bg-[var(--brand-blue)]/15 border-[var(--brand-blue)]/40 text-[var(--brand-blue)]'
                      : 'bg-[var(--surface-3)] border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.8} />
                  Card fields
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
                            <p className="text-xs" style={{ color: 'var(--text-on-dark)', fontWeight: 600 }}>Card fields</p>
                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-on-dark-subtle)' }}>Show or hide sections in each card</p>
                          </div>
                          {Object.values(cardPrefs).some(v => !v) && (
                            <button onClick={() => setCardPrefs(DEFAULT_CLIENT_CARD_PREFS)}
                              className="flex items-center gap-1 text-[11px] transition-colors" style={{ color: 'var(--text-on-dark-subtle)' }}
                              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-on-dark)')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-on-dark-subtle)')}>
                              Reset
                            </button>
                          )}
                        </div>
                        <div className="py-1.5">
                          {([
                            { key: 'showPage',           label: 'Page',                  icon: <MousePointerClick className="w-3.5 h-3.5" strokeWidth={1.8} /> },
                            { key: 'showDate',           label: 'Date',                  icon: <Calendar className="w-3.5 h-3.5" strokeWidth={1.8} /> },
                            { key: 'showLink',           label: 'Link',                  icon: <Link2 className="w-3.5 h-3.5" strokeWidth={1.8} /> },
                            { key: 'showDescription',    label: 'Description',           icon: <FileText className="w-3.5 h-3.5" strokeWidth={1.8} /> },
                            { key: 'showRecommendation', label: 'Recommendation',        icon: <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.8} /> },
                            { key: 'showVisualRec',      label: 'Visual Recommendation', icon: <ImageIcon className="w-3.5 h-3.5" strokeWidth={1.8} /> },
                            { key: 'showMetadata',       label: 'Metadata',              icon: <Layers className="w-3.5 h-3.5" strokeWidth={1.8} /> },
                          ] as { key: keyof ClientCardPrefs; label: string; icon: React.ReactNode }[]).map(({ key, label, icon }) => {
                            const enabled = cardPrefs[key];
                            return (
                              <React.Fragment key={key}>
                                <button
                                  onClick={() => setCardPrefs(p => ({ ...p, [key]: !p[key] }))}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface-hover-subtle)] transition-colors"
                                >
                                  <span className={`shrink-0 transition-colors ${enabled ? 'text-[var(--text-muted)]' : 'text-[var(--text-placeholder)]'}`}>{icon}</span>
                                  <span className={`flex-1 text-left text-xs transition-colors ${enabled ? 'text-[var(--text-on-dark-subtle)]' : 'text-[var(--text-faint)] line-through'}`}>{label}</span>
                                  <span className={`relative shrink-0 w-9 h-5 rounded-full transition-colors duration-200 ${enabled ? 'bg-[var(--brand-blue)]' : 'bg-[var(--surface-toggle-off)]'}`}>
                                    <span className="absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                                      style={{ transform: `translateX(${enabled ? '16px' : '0px'})` }} />
                                  </span>
                                </button>
                                {key === 'showMetadata' && (
                                  <AnimatePresence initial={false}>
                                    {cardPrefs.showMetadata && (
                                      <motion.div key="meta-sub"
                                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                                        <div className="border-l border-[var(--border-faint)] ml-[22px] pl-3 py-0.5">
                                          {([
                                            { key: 'showCategory', label: 'Category', icon: <Layers className="w-3 h-3" strokeWidth={1.8} /> },
                                            { key: 'showSeverity', label: 'Severity',  icon: <AlertCircle className="w-3 h-3" strokeWidth={1.8} /> },
                                            { key: 'showPriority', label: 'Priority',  icon: <Flag className="w-3 h-3" strokeWidth={1.8} /> },
                                            { key: 'showEffort',   label: 'Effort',    icon: <Zap className="w-3 h-3" strokeWidth={1.8} /> },
                                          ] as { key: keyof ClientCardPrefs; label: string; icon: React.ReactNode }[]).map(({ key: sk, label: sl, icon: si }) => {
                                            const sub = cardPrefs[sk];
                                            return (
                                              <button key={sk}
                                                onClick={() => setCardPrefs(p => ({ ...p, [sk]: !p[sk] }))}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[var(--surface-hover-subtle)] rounded-lg transition-colors">
                                                <span className={`shrink-0 transition-colors ${sub ? 'text-[var(--text-faint)]' : 'text-[var(--text-placeholder)]'}`}>{si}</span>
                                                <span className={`flex-1 text-left text-[11px] transition-colors ${sub ? 'text-[var(--text-muted)]' : 'text-[var(--text-placeholder)] line-through'}`}>{sl}</span>
                                                <span className={`relative shrink-0 w-7 h-4 rounded-full transition-colors duration-200 ${sub ? 'bg-[var(--brand-blue)]' : 'bg-[var(--surface-toggle-off)]'}`}>
                                                  <span className="absolute top-[2px] left-[2px] w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200"
                                                    style={{ transform: `translateX(${sub ? '12px' : '0px'})` }} />
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
            </div>

            {/* Filter panel */}
            <AnimatePresence initial={false}>
              {showFilters && (
                <motion.div key="filters"
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                  <div className="px-5 pb-4 pt-3 border-t border-[var(--border-faint)] flex flex-col gap-3" ref={filterRef}>
                    {/* Row 1: 4 dropdowns (no Status in client view) */}
                    <div className="flex gap-3">

                    {/* Category */}
                    <div className="flex-1 min-w-0">
                      <label className="flex items-center gap-1.5 text-xs text-[var(--text-on-dark-subtle)] mb-1.5"><Layers className="w-3 h-3" strokeWidth={2} />Category</label>
                      <div className="relative">
                        <button
                          onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setFilterDropdownPos({ top: r.bottom + 4, left: r.left }); setFilterDropdownOpen(filterDropdownOpen === 'category' ? null : 'category'); }}
                          className="w-full h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-md px-2 text-xs text-[var(--text-on-dark)] outline-none flex items-center justify-between">
                          <span className="flex items-center gap-1.5 min-w-0 truncate">
                            {filterCategory === 'All'
                              ? <Layers className="w-3 h-3 text-[var(--text-faint)] shrink-0" strokeWidth={2} />
                              : (() => { const opt = fieldOpts.categories.find(c => c.label === filterCategory); return opt ? <DynamicIcon name={opt.icon} className="w-3 h-3 shrink-0" style={{ color: opt.color }} strokeWidth={2} /> : <Layers className="w-3 h-3 text-[var(--text-faint)] shrink-0" strokeWidth={2} />; })()
                            }
                            <span className="truncate">{filterCategory}</span>
                          </span>
                          <ChevronDown className="w-3 h-3 shrink-0" strokeWidth={2} />
                        </button>
                        {filterDropdownOpen === 'category' && createPortal(
                          <div data-filter-portal style={{ position: 'fixed', top: filterDropdownPos.top, left: filterDropdownPos.left, zIndex: 9999 }} className="w-52 bg-[var(--surface-elevated)] border border-[var(--border-medium)] rounded-xl shadow-2xl overflow-hidden">
                            <button onClick={() => { setFilterCategory('All'); setFilterDropdownOpen(null); }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors font-semibold ${filterCategory === 'All' ? 'text-[var(--text-on-dark)] bg-[rgba(66,116,186,0.32)]' : 'text-[var(--text-on-dark-subtle)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'}`}>
                              <span className="flex items-center gap-2"><Layers className="w-3 h-3 text-[var(--text-faint)]" strokeWidth={2} /><span>All</span></span>
                            </button>
                            {fieldOpts.categories.map(cat => (
                              <button key={cat.id} onClick={() => { setFilterCategory(cat.label); setFilterDropdownOpen(null); }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors font-semibold ${filterCategory === cat.label ? 'text-[var(--text-on-dark)] bg-[rgba(66,116,186,0.32)]' : 'text-[var(--text-on-dark-subtle)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'}`}>
                                <span className="flex items-center gap-2"><DynamicIcon name={cat.icon} className="w-3 h-3" style={{ color: cat.color }} strokeWidth={2} /><span>{cat.label}</span></span>
                                <span className="text-[var(--text-faint)]">({issues.filter(i => i.category === cat.label).length})</span>
                              </button>
                            ))}
                          </div>, document.body
                        )}
                      </div>
                    </div>

                    {/* Severity */}
                    <div className="flex-1 min-w-0">
                      <label className="flex items-center gap-1.5 text-xs text-[var(--text-on-dark-subtle)] mb-1.5"><AlertCircle className="w-3 h-3" strokeWidth={2} />Severity</label>
                      <div className="relative">
                        <button
                          onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setFilterDropdownPos({ top: r.bottom + 4, left: r.left }); setFilterDropdownOpen(filterDropdownOpen === 'severity' ? null : 'severity'); }}
                          className="w-full h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-md px-2 text-xs text-[var(--text-on-dark)] outline-none flex items-center justify-between">
                          <span className="flex items-center gap-1.5 min-w-0 truncate">
                            {filterSeverity === 'All' ? <AlertCircle className="w-3 h-3 text-[var(--text-faint)] shrink-0" strokeWidth={2} /> : (() => { const opt = fieldOpts.severities.find(s => s.label === filterSeverity); return opt ? <DynamicIcon name={opt.icon} className="w-3 h-3 shrink-0" style={{ color: opt.color }} strokeWidth={2} /> : <AlertCircle className="w-3 h-3 text-[var(--text-faint)] shrink-0" strokeWidth={2} />; })()}
                            <span className="truncate">{filterSeverity}</span>
                          </span>
                          <ChevronDown className="w-3 h-3 shrink-0" strokeWidth={2} />
                        </button>
                        {filterDropdownOpen === 'severity' && createPortal(
                          <div data-filter-portal style={{ position: 'fixed', top: filterDropdownPos.top, left: filterDropdownPos.left, zIndex: 9999 }} className="w-48 bg-[var(--surface-elevated)] border border-[var(--border-medium)] rounded-xl shadow-2xl overflow-hidden">
                            <button onClick={() => { setFilterSeverity('All'); setFilterDropdownOpen(null); }} className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors font-semibold ${filterSeverity === 'All' ? 'text-[var(--text-on-dark)] bg-[rgba(66,116,186,0.32)]' : 'text-[var(--text-on-dark-subtle)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'}`}><span className="flex items-center gap-2"><AlertCircle className="w-3 h-3 text-[var(--text-faint)]" strokeWidth={2} /><span>All</span></span></button>
                            {fieldOpts.severities.map(sev => (
                              <button key={sev.id} onClick={() => { setFilterSeverity(sev.label); setFilterDropdownOpen(null); }} className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors font-semibold ${filterSeverity === sev.label ? 'text-[var(--text-on-dark)] bg-[rgba(66,116,186,0.32)]' : 'text-[var(--text-on-dark-subtle)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'}`}>
                                <span className="flex items-center gap-2"><DynamicIcon name={sev.icon} className="w-3 h-3" style={{ color: sev.color }} strokeWidth={2} /><span>{sev.label}</span></span>
                                <span className="text-[var(--text-faint)]">({issues.filter(i => i.severity === sev.label).length})</span>
                              </button>
                            ))}
                          </div>, document.body
                        )}
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="flex-1 min-w-0">
                      <label className="flex items-center gap-1.5 text-xs text-[var(--text-on-dark-subtle)] mb-1.5"><Flag className="w-3 h-3" strokeWidth={2} />Priority</label>
                      <div className="relative">
                        <button
                          onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setFilterDropdownPos({ top: r.bottom + 4, left: r.left }); setFilterDropdownOpen(filterDropdownOpen === 'priority' ? null : 'priority'); }}
                          className="w-full h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-md px-2 text-xs text-[var(--text-on-dark)] outline-none flex items-center justify-between">
                          <span className="flex items-center gap-1.5 min-w-0 truncate">
                            {filterPriority === 'All' ? <Flag className="w-3 h-3 text-[var(--text-faint)] shrink-0" strokeWidth={2} /> : (() => { const opt = fieldOpts.priorities.find(p => p.label === filterPriority); return opt ? <DynamicIcon name={opt.icon} className="w-3 h-3 shrink-0" style={{ color: opt.color }} strokeWidth={2} /> : <Flag className="w-3 h-3 text-[var(--text-faint)] shrink-0" strokeWidth={2} />; })()}
                            <span className="truncate">{filterPriority}</span>
                          </span>
                          <ChevronDown className="w-3 h-3 shrink-0" strokeWidth={2} />
                        </button>
                        {filterDropdownOpen === 'priority' && createPortal(
                          <div data-filter-portal style={{ position: 'fixed', top: filterDropdownPos.top, left: filterDropdownPos.left, zIndex: 9999 }} className="w-44 bg-[var(--surface-elevated)] border border-[var(--border-medium)] rounded-xl shadow-2xl overflow-hidden">
                            <button onClick={() => { setFilterPriority('All'); setFilterDropdownOpen(null); }} className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors font-semibold ${filterPriority === 'All' ? 'text-[var(--text-on-dark)] bg-[rgba(66,116,186,0.32)]' : 'text-[var(--text-on-dark-subtle)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'}`}><span className="flex items-center gap-2"><Flag className="w-3 h-3 text-[var(--text-faint)]" strokeWidth={2} /><span>All</span></span></button>
                            {fieldOpts.priorities.map(pri => (
                              <button key={pri.id} onClick={() => { setFilterPriority(pri.label); setFilterDropdownOpen(null); }} className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors font-semibold ${filterPriority === pri.label ? 'text-[var(--text-on-dark)] bg-[rgba(66,116,186,0.32)]' : 'text-[var(--text-on-dark-subtle)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'}`}>
                                <span className="flex items-center gap-2"><DynamicIcon name={pri.icon} className="w-3 h-3" style={{ color: pri.color }} strokeWidth={2} /><span>{pri.label}</span></span>
                                <span className="text-[var(--text-faint)]">({issues.filter(i => i.priority === pri.label).length})</span>
                              </button>
                            ))}
                          </div>, document.body
                        )}
                      </div>
                    </div>

                    {/* Effort */}
                    <div className="flex-1 min-w-0">
                      <label className="flex items-center gap-1.5 text-xs text-[var(--text-on-dark-subtle)] mb-1.5"><Zap className="w-3 h-3" strokeWidth={2} />Effort</label>
                      <div className="relative">
                        <button
                          onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setFilterDropdownPos({ top: r.bottom + 4, left: r.left }); setFilterDropdownOpen(filterDropdownOpen === 'effort' ? null : 'effort'); }}
                          className="w-full h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-md px-2 text-xs text-[var(--text-on-dark)] outline-none flex items-center justify-between">
                          <span className="flex items-center gap-1.5 min-w-0 truncate">
                            {filterEffort === 'All' ? <Zap className="w-3 h-3 text-[var(--text-faint)] shrink-0" strokeWidth={2} /> : (() => { const opt = fieldOpts.efforts.find(e => e.label === filterEffort); return opt ? <DynamicIcon name={opt.icon} className="w-3 h-3 shrink-0" style={{ color: opt.color }} strokeWidth={2} /> : <Zap className="w-3 h-3 text-[var(--text-faint)] shrink-0" strokeWidth={2} />; })()}
                            <span className="truncate">{filterEffort}</span>
                          </span>
                          <ChevronDown className="w-3 h-3 shrink-0" strokeWidth={2} />
                        </button>
                        {filterDropdownOpen === 'effort' && createPortal(
                          <div data-filter-portal style={{ position: 'fixed', top: filterDropdownPos.top, left: filterDropdownPos.left, zIndex: 9999 }} className="w-44 bg-[var(--surface-elevated)] border border-[var(--border-medium)] rounded-xl shadow-2xl overflow-hidden">
                            <button onClick={() => { setFilterEffort('All'); setFilterDropdownOpen(null); }} className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors font-semibold ${filterEffort === 'All' ? 'text-[var(--text-on-dark)] bg-[rgba(66,116,186,0.32)]' : 'text-[var(--text-on-dark-subtle)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'}`}><span className="flex items-center gap-2"><Zap className="w-3 h-3 text-[var(--text-faint)]" strokeWidth={2} /><span>All</span></span></button>
                            {fieldOpts.efforts.map(eff => (
                              <button key={eff.id} onClick={() => { setFilterEffort(eff.label); setFilterDropdownOpen(null); }} className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors font-semibold ${filterEffort === eff.label ? 'text-[var(--text-on-dark)] bg-[rgba(66,116,186,0.32)]' : 'text-[var(--text-on-dark-subtle)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'}`}>
                                <span className="flex items-center gap-2"><DynamicIcon name={eff.icon} className="w-3 h-3" style={{ color: eff.color }} strokeWidth={2} /><span>{eff.label}</span></span>
                                <span className="text-[var(--text-faint)]">({issues.filter(i => i.effort === eff.label).length})</span>
                              </button>
                            ))}
                          </div>, document.body
                        )}
                      </div>
                    </div>

                    </div>

                    {/* Row 2: Page Name + Tags + Date Range */}
                    <div className="flex gap-3 flex-wrap">
                      <div className="flex-1 min-w-[140px]">
                        <label className="flex items-center gap-1.5 text-xs text-[var(--text-on-dark-subtle)] mb-1.5">
                          <MousePointerClick className="w-3 h-3" strokeWidth={2} />
                          Page Name
                        </label>
                        <MultiSelectFilter
                          options={allPageNames}
                          selected={filterPageNames}
                          onChange={setFilterPageNames}
                          placeholder="Search pages…"
                          onOpen={() => setFilterDropdownOpen(null)}
                          closeSignal={filterDropdownOpen}
                        />
                      </div>
                      <div className="flex-1 min-w-[140px]">
                        <label className="flex items-center gap-1.5 text-xs text-[var(--text-on-dark-subtle)] mb-1.5">
                          <Tag className="w-3 h-3" strokeWidth={2} />
                          Tags
                        </label>
                        <MultiSelectFilter
                          options={allTags}
                          selected={filterTags}
                          onChange={setFilterTags}
                          placeholder="Search tags…"
                          onOpen={() => setFilterDropdownOpen(null)}
                          closeSignal={filterDropdownOpen}
                        />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="flex items-center gap-1.5 text-xs text-[var(--text-on-dark-subtle)] mb-1.5">
                          <Calendar className="w-3 h-3" strokeWidth={2} />
                          Date range
                          {(filterDateFrom || filterDateTo) && (
                            <button onClick={() => { setFilterDateFrom(''); setFilterDateTo(''); }} className="ml-auto text-[10px] text-[var(--brand-blue)] hover:text-[var(--brand-blue-hover)] transition-colors">Clear</button>
                          )}
                        </label>
                        <DateRangeFilter dateFrom={filterDateFrom} dateTo={filterDateTo} onChange={(from, to) => { setFilterDateFrom(from); setFilterDateTo(to); }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Introduction */}
          {showIntroduction && introduction && (
            <>
              <div className="rounded-xl p-5" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-on-dark)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Quote className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-on-dark-subtle)' }} strokeWidth={2} />
                  <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 700 }}>Introduction</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>{introduction}</p>
              </div>
              <div className="h-px" style={{ background: 'var(--border-faint)' }} />
            </>
          )}

          {/* Issue cards */}
          <AnimatePresence mode="wait" initial={false}>
          {filteredIssues.length === 0 ? (
            <motion.div
              key="empty-filter"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="w-8 h-8 text-[var(--text-placeholder)] mb-3" strokeWidth={1.5} />
              <p className="text-sm text-[var(--text-faint)] mb-2">No issues match the current filters</p>
              <button
                onClick={() => { setFilterSeverity('All'); setFilterCategory('All'); setFilterPriority('All'); setFilterEffort('All'); setFilterStatus('All'); setFilterPageNames([]); setFilterTags([]); setFilterDateFrom(''); setFilterDateTo(''); }}
                className="text-xs text-[var(--brand-blue)] hover:underline">
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`cards-${filteredIssues.map(i => i.id).join('-')}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
            <div className="flex flex-col gap-4">
              {filteredIssues.map((issue, i) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06, ease: [0.4, 0, 0.2, 1] }}
                >
                  <ClientIssueCard issue={issue} index={i} cardPrefs={cardPrefs} />
                </motion.div>
              ))}
            </div>
            </motion.div>
          )}
          </AnimatePresence>

          {/* Conclusion */}
          {showConclusion && conclusion && (
            <>
              <div className="h-px" style={{ background: 'var(--border-faint)' }} />
              <div className="rounded-xl p-5" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-on-dark)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Milestone className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-on-dark-subtle)' }} strokeWidth={2} />
                  <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 700 }}>Conclusion</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>{conclusion}</p>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="text-center pt-6 pb-2 border-t border-[var(--border-faint)]">
            <p className="text-xs" style={{ color: 'var(--text-on-dark-subtle)' }}>
              Generated by UX Mosaic · This report is confidential and intended for the named client only.
            </p>
          </div>
        </div>
      </div>

      {/* ── Statistics Modal ──────────────────────────────── */}
      {statsOpen && createPortal(
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) setStatsOpen(false); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl"
            style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-on-dark)' }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
              style={{ background: 'var(--surface-elevated)', borderColor: 'var(--border-on-dark)' }}>
              <div className="flex items-center gap-2.5">
                <BarChart2 className="w-4 h-4" style={{ color: 'var(--brand-blue)' }} strokeWidth={2} />
                <span className="text-sm" style={{ color: 'var(--text-on-dark)', fontWeight: 700 }}>Audit Statistics</span>
              </div>
              <button onClick={() => setStatsOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-on-dark-subtle)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-3)] transition-colors">
                <X className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>

            {(() => {
                const total = issues.length;
                const resolved = issues.filter(i => i.status === 'Resolved').length;
                const critical = issues.filter(i => i.severity === 'Critical').length;
                const resRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
                const T = total || 1;

                // Reusable bar row matching client metadata info structure
                const BarRow = ({ icon, label, count, color, labelWidth = 'w-28', onApply }: { icon: string; label: string; count: number; color: string; labelWidth?: string; onApply?: () => void }) => {
                  const pct = Math.round((count / T) * 100);
                  return (
                    <button
                      onClick={onApply}
                      className="w-full flex items-center gap-3 px-4 py-2.5 border-b last:border-b-0 text-left transition-colors hover:bg-[var(--surface-hover-medium)] group cursor-pointer"
                      style={{ borderColor: 'var(--border-faint)' }}
                    >
                      <DynamicIcon name={icon} className="w-3.5 h-3.5 shrink-0" strokeWidth={2} style={{ color }} />
                      <span className={`text-xs shrink-0 ${labelWidth} group-hover:text-[var(--text-on-dark)] transition-colors`} style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 500 }}>{label}</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-base)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <span className="text-xs w-5 text-right shrink-0" style={{ color: 'var(--text-on-dark)', fontWeight: 600 }}>{count}</span>
                    </button>
                  );
                };

                const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
                  <div className="rounded-xl overflow-hidden" style={{ background: 'var(--surface-3)', border: '1px solid var(--border-on-dark)' }}>
                    <div className="px-4 py-2.5 border-b" style={{ borderColor: 'var(--border-faint)', background: 'var(--surface-2)' }}>
                      <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 700 }}>{title}</p>
                    </div>
                    {children}
                  </div>
                );

                return (
                  <div className="px-6 py-5 flex flex-col gap-4">
                    {/* Summary — total issues only */}
                    <div className="rounded-xl px-4 py-3 flex items-center justify-between"
                      style={{ background: 'var(--surface-3)', border: '1px solid var(--border-on-dark)' }}>
                      <span className="text-xs" style={{ color: 'var(--text-on-dark-subtle)', fontWeight: 500 }}>Total Issues</span>
                      <span className="text-base" style={{ color: 'var(--text-on-dark)', fontWeight: 700 }}>{total}</span>
                    </div>

                    {/* Category */}
                    <Section title="Category">
                      {fieldOpts.categories.map(c => (
                        <BarRow key={c.id} icon={c.icon} label={c.label} count={issues.filter(i => i.category === c.label).length} color={c.color} labelWidth="w-36"
                          onApply={() => { setFilterCategory(c.label); setFilterSeverity('All'); setFilterPriority('All'); setFilterEffort('All'); setFilterStatus('All'); setFilterPageNames([]); setFilterTags([]); setShowFilters(true); setStatsOpen(false); }} />
                      ))}
                    </Section>

                    {/* Severity */}
                    <Section title="Severity">
                      {fieldOpts.severities.map(s => (
                        <BarRow key={s.id} icon={s.icon} label={s.label} count={issues.filter(i => i.severity === s.label).length} color={s.color}
                          onApply={() => { setFilterSeverity(s.label); setFilterCategory('All'); setFilterPriority('All'); setFilterEffort('All'); setFilterStatus('All'); setFilterPageNames([]); setFilterTags([]); setShowFilters(true); setStatsOpen(false); }} />
                      ))}
                    </Section>

                    {/* Priority */}
                    <Section title="Priority">
                      {fieldOpts.priorities.map(p => (
                        <BarRow key={p.id} icon={p.icon} label={p.label} count={issues.filter(i => i.priority === p.label).length} color={p.color}
                          onApply={() => { setFilterPriority(p.label); setFilterCategory('All'); setFilterSeverity('All'); setFilterEffort('All'); setFilterStatus('All'); setFilterPageNames([]); setFilterTags([]); setShowFilters(true); setStatsOpen(false); }} />
                      ))}
                    </Section>

                    {/* Effort */}
                    <Section title="Effort">
                      {fieldOpts.efforts.map(e => (
                        <BarRow key={e.id} icon={e.icon} label={e.label} count={issues.filter(i => i.effort === e.label).length} color={e.color}
                          onApply={() => { setFilterEffort(e.label); setFilterCategory('All'); setFilterSeverity('All'); setFilterPriority('All'); setFilterStatus('All'); setFilterPageNames([]); setFilterTags([]); setShowFilters(true); setStatsOpen(false); }} />
                      ))}
                    </Section>
                  </div>
                );
              })()}
          </motion.div>
        </motion.div>,
        document.body
      )}
    </div>
  );
}
