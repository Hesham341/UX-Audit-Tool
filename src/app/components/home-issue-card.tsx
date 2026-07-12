import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronDown, ChevronRight, MessageSquare, MoreVertical, Bookmark,
  FileText, CheckCircle2, BookOpen, Tag, Layers, AlertCircle,
  Flag, Zap, Circle, Clock, XCircle, Check, Send,
  MousePointerClick, Calendar, Link2, Square, ArrowRight, Hash,
  Droplet, Crop, Type, RotateCcw, X,
  Bug, Monitor, Sparkles, Network, Pointer, PenTool,
} from 'lucide-react';

// ─── MetaSelect (identical to AuditPage version) ─────────────────────────────

function MetaSelect({ label, icon, value, onChange, options, optionIcons }: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  optionIcons?: Record<string, React.ReactNode>;
}) {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  const calcPosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setDropdownStyle({ position: 'fixed', top: rect.bottom + 4, left: rect.left, width: rect.width, zIndex: 9999 });
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        ref.current && !ref.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => calcPosition();
    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => document.removeEventListener('scroll', onScroll, { capture: true });
  }, [open]);

  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-2">
        <span className="text-[var(--text-faint)]">{icon}</span> {label}
      </label>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => { calcPosition(); setOpen((o) => !o); }}
          className="w-full h-9 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-2.5 text-xs text-[var(--text-on-dark)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors flex items-center gap-1.5 cursor-pointer"
          style={{ fontWeight: 600 }}
        >
          {optionIcons?.[value] && <span className="shrink-0">{optionIcons[value]}</span>}
          <span className="flex-1 text-left">{value}</span>
          <ChevronDown className={`w-3 h-3 text-[var(--text-faint)] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={2} />
        </button>
        {open && createPortal(
          <div ref={ref} style={dropdownStyle} className="bg-[var(--surface-elevated)] border border-[var(--border-medium)] rounded-xl shadow-2xl overflow-hidden">
            {options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => { onChange(o); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors font-semibold ${value === o ? 'text-[var(--text-on-dark)] bg-[rgba(66,116,186,0.32)]' : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'}`}
              >
                {optionIcons?.[o] && <span className="shrink-0">{optionIcons[o]}</span>}
                <span className="flex-1">{o}</span>
                {value === o && <Check className="w-3 h-3 text-[var(--brand-blue)] shrink-0" strokeWidth={2.5} />}
              </button>
            ))}
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}

// ─── Static mock screenshot ───────────────────────────────────────────────────

function MockScreenshot() {
  return (
    <div className="w-full h-72 bg-[var(--surface-3)] border border-[var(--border-subtle)] rounded-xl relative overflow-hidden select-none">
      {/* Browser chrome */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-[var(--surface-hover)] border-b border-[var(--border-faint)] flex items-center gap-2 px-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-default)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-default)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-default)]" />
        </div>
        <div className="flex-1 h-4 rounded bg-[var(--surface-hover-medium)] mx-4" />
      </div>

      {/* Page nav */}
      <div className="absolute top-8 left-0 right-0 h-10 bg-[var(--surface-hover)] border-b border-[var(--border-faint)] flex items-center px-5 gap-4">
        <div className="w-5 h-5 rounded bg-[var(--brand-blue)]/30" />
        <div className="flex gap-3 ml-2">
          {[32, 24, 40, 28].map((w, i) => (
            <div key={i} className="h-2 rounded-full bg-[var(--border-subtle)]" style={{ width: w }} />
          ))}
        </div>
        <div className="ml-auto">
          {/* The hidden CTA — this is the "issue" being annotated */}
          <div className="w-24 h-6 rounded bg-[var(--brand-blue)]/15 border border-[var(--brand-blue)]/20 opacity-30" />
        </div>
      </div>

      {/* Hero content */}
      <div className="absolute top-18 left-0 right-0 bottom-0 flex">
        <div className="flex-1 p-5 flex flex-col gap-3">
          <div className="h-3 rounded-full bg-[var(--border-hover)] w-3/4" />
          <div className="h-2 rounded-full bg-[var(--border-subtle)] w-4/5" />
          <div className="h-2 rounded-full bg-[var(--border-subtle)] w-3/5" />
          <div className="h-2 rounded-full bg-[var(--border-subtle)] w-4/5" />
          <div className="mt-3 flex gap-2">
            <div className="w-28 h-8 rounded-lg bg-[var(--brand-blue)]/20 border border-[var(--brand-blue)]/25" />
            <div className="w-24 h-8 rounded-lg bg-[var(--surface-hover)] border border-[var(--border-default)]" />
          </div>
          {/* Lots of body content pushing CTA below fold */}
          <div className="mt-4 space-y-2">
            {[0.12, 0.08, 0.10, 0.07, 0.09].map((o, i) => (
              <div key={i} className="h-1.5 rounded-full" style={{ width: `${70 + i * 5}%`, background: `rgba(255,255,255,${o})` }} />
            ))}
          </div>
        </div>
        <div className="w-2/5 p-4">
          <div className="w-full h-full rounded-xl bg-[var(--surface-hover)] border border-[var(--border-faint)]" />
        </div>
      </div>

      {/* Annotation 1 — red rect around hidden nav CTA */}
      <div
        className="absolute rounded-sm pointer-events-none"
        style={{ top: '22%', right: '4%', width: '18%', height: '11%', border: '2px solid #FF5C5C' }}
      />

      {/* Annotation 2 — number pin on the below-fold CTA button */}
      <div
        className="absolute w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md pointer-events-none"
        style={{ top: '64%', left: '15%', background: '#FF5C5C', fontSize: 11, fontWeight: 700, boxShadow: '0 0 0 2px var(--surface-3)' }}
      >1</div>
      <div
        className="absolute w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md pointer-events-none"
        style={{ top: '24%', right: '5%', background: '#E8B84B', color: 'var(--surface-3)', fontSize: 11, fontWeight: 700, boxShadow: '0 0 0 2px var(--surface-3)' }}
      >2</div>
    </div>
  );
}

// ─── Annotation toolbar colours ───────────────────────────────────────────────

const ANNOTATION_COLORS = [
  { label: 'Red',    value: '#FF5C5C' },
  { label: 'Orange', value: '#FF8D3A' },
  { label: 'Yellow', value: '#E8B84B' },
  { label: 'Blue',   value: '#4274BA' },
  { label: 'Green',  value: '#ACD8AB' },
  { label: 'Teal',   value: '#6BB5AA' },
];

const ANNOTATION_TOOLS = [
  { id: 'square', label: 'Square', Icon: Square },
  { id: 'arrow',  label: 'Arrow',  Icon: ArrowRight },
  { id: 'number', label: 'Number', Icon: Hash },
  { id: 'blur',   label: 'Blur',   Icon: Droplet },
  { id: 'crop',   label: 'Crop',   Icon: Crop },
];

// ─── Main component ───────────────────────────────────────────────────────────

export function HomeIssueCard() {
  const currentFramework = typeof window !== 'undefined' ? localStorage.getItem('uxm_project_framework') || 'None' : 'None';
  const hasFramework = currentFramework !== 'None';

  const [collapsed, setCollapsed]       = useState(false);
  const [bookmarked, setBookmarked]     = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [activeTool, setActiveTool]     = useState<string | null>(null);
  const [annotationColor, setAnnotationColor] = useState('#FF5C5C');
  const [commentText, setCommentText]   = useState('');

  // Form state — all editable like the real card
  const [title, setTitle]               = useState('Primary CTA hidden below fold on mobile');
  const [pageName, setPageName]         = useState('Checkout');
  const [dateTaken, setDateTaken]       = useState('04/06/2025');
  const [pageUrl, setPageUrl]           = useState('https://app.example.com/checkout');
  const [description, setDescription]   = useState('The primary "Buy Now" call-to-action button is positioned below the viewport fold on all mobile breakpoints (<768 px). Users must scroll before they can complete a purchase, adding unnecessary friction and increasing drop-off at the critical conversion step.');
  const [recommendation, setRecommendation] = useState('Move the CTA above the product image on mobile, or introduce a sticky bottom bar that persists as the user scrolls. Validate placement with a 5-second test before shipping.');
  const [uxLaw, setUxLaw]               = useState("Fitts's Law");
  const [tags, setTags]                 = useState('mobile, cta, conversion, above-fold');
  const [category, setCategory]         = useState('Usability');
  const [severity, setSeverity]         = useState('High');
  const [priority, setPriority]         = useState('High');
  const [effort, setEffort]             = useState('Low');
  const [status, setStatus]             = useState('Not Resolved');

  const [comments, setComments] = useState([
    { id: 1, author: 'Sarah K.', initials: 'SK', color: '#4274BA', time: '2h ago', text: 'Confirmed on Android Chrome too — the button is fully hidden on a Pixel 6.' },
    { id: 2, author: 'Tom R.',   initials: 'TR', color: '#6BB5AA', time: '1h ago', text: 'Could we ship a sticky footer bar as a quick win while the full redesign is in progress?' },
  ]);

  const submitComment = () => {
    if (!commentText.trim()) return;
    setComments((prev) => [...prev, { id: Date.now(), author: 'You', initials: 'YO', color: '#ACD8AB', time: 'just now', text: commentText.trim() }]);
    setCommentText('');
  };

  return (
    <div className="bg-[var(--surface-2)] border rounded-xl overflow-hidden transition-colors border-[var(--border-subtle)]">

      {/* ── Card Header ───────────────────────────────────────────────────── */}
      <div className="px-5 py-3 flex items-center gap-3 border-b border-[var(--border-faint)] bg-[var(--surface-1)]">
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-1 text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" strokeWidth={2} />
            : <ChevronDown  className="w-4 h-4" strokeWidth={2} />}
        </button>

        {/* Issue number */}
        <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[var(--surface-base)] text-[9px]" style={{ background: 'var(--brand-teal)', fontWeight: 700 }}>
          1
        </div>

        {/* Editable title */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled issue"
            className="w-full bg-transparent border-none text-base text-[var(--text-on-dark)] placeholder:text-[var(--text-faint)] placeholder:italic outline-none focus:ring-0"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Comments */}
          <button
            onClick={() => setShowComments((v) => !v)}
            className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors relative ${showComments ? 'bg-[var(--brand-blue-soft)] border-[var(--brand-blue)]/40 text-[var(--brand-blue)]' : 'border-[var(--border-strong-alt)] text-[var(--text-faint)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover-strong)] hover:bg-[var(--surface-hover-medium)]'}`}
          >
            <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.8} />
            {comments.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--brand-teal)] text-[var(--surface-base)] text-[9px] flex items-center justify-center" style={{ fontWeight: 700 }}>
                {comments.length}
              </span>
            )}
          </button>

          {/* Bookmark */}
          <button
            onClick={() => setBookmarked((b) => !b)}
            className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors ${bookmarked ? 'bg-[var(--brand-blue-soft)] border-[var(--brand-blue)]/40 text-[var(--brand-blue)]' : 'border-[var(--border-strong-alt)] text-[var(--text-faint)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover-strong)] hover:bg-[var(--surface-hover-medium)]'}`}
          >
            <Bookmark className="w-3.5 h-3.5" strokeWidth={1.8} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>

          {/* More */}
          <button className="w-7 h-7 rounded-full border border-[var(--border-strong-alt)] flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover-strong)] hover:bg-[var(--surface-hover-medium)] transition-colors">
            <MoreVertical className="w-3.5 h-3.5" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* ── Collapsible Body ──────────────────────────────────────────────── */}
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
              <div className="grid lg:grid-cols-[420px_1fr] xl:grid-cols-[480px_1fr] gap-x-5 gap-y-2">
                {/* Row 1: Page/Date/Link | Description — same grid row = guaranteed alignment */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-1.5">
                      <MousePointerClick className="w-3 h-3" strokeWidth={2} /> Page
                    </label>
                    <input
                      type="text" value={pageName} onChange={(e) => setPageName(e.target.value)}
                      placeholder="Login Page"
                      className="w-full h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3 text-xs text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors"
                      style={{ fontWeight: 600 }}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-1.5">
                      <Calendar className="w-3 h-3" strokeWidth={2} /> Date
                    </label>
                    <input
                      type="text" value={dateTaken} onChange={(e) => setDateTaken(e.target.value)}
                      placeholder="dd/mm/yyyy"
                      className="w-full h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3 text-xs text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors"
                      style={{ fontWeight: 600 }}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-1.5">
                      <Link2 className="w-3 h-3" strokeWidth={2} /> Link
                    </label>
                    <input
                      type="url" value={pageUrl} onChange={(e) => setPageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3 text-xs text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors"
                      style={{ fontWeight: 600 }}
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-1.5">
                    <FileText className="w-3 h-3" strokeWidth={2} /> Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the usability issue in detail..."
                    className="w-full min-h-[80px] bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg p-3 text-sm text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] resize-none outline-none focus:border-[var(--brand-blue)]/60 transition-colors"
                  />
                </div>
                {/* Row 2: Image area | Rest of form */}
                <div className="flex flex-col gap-2">

                  {/* Screenshot */}
                  <MockScreenshot />

                  {/* Annotation Toolbar */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start gap-2">
                      <div className="flex items-start gap-1 flex-wrap flex-1">
                        {ANNOTATION_TOOLS.map(({ id, label, Icon }) => (
                          <button
                            key={id}
                            onClick={() => setActiveTool((t) => t === id ? null : id)}
                            title={label}
                            className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg border text-xs transition-all"
                            style={
                              activeTool === id
                                ? { backgroundColor: `${annotationColor}22`, borderColor: `${annotationColor}88`, color: annotationColor, border: '1px solid' }
                                : { background: 'var(--surface-3)', borderColor: 'var(--border-on-dark)', color: 'var(--text-on-dark-subtle)' }
                            }
                          >
                            {id === 'number' ? (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                                <defs>
                                  <linearGradient id="numToolGradHome" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#FF9F43"/>
                                    <stop offset="100%" stopColor="#FF6B6B"/>
                                  </linearGradient>
                                </defs>
                                <circle cx="6" cy="6" r="5" stroke={activeTool === id ? 'currentColor' : 'url(#numToolGradHome)'} strokeWidth="1.2" fill="none" />
                                <text x="6" y="9" fontSize="6" fontWeight="700" fill={activeTool === id ? 'currentColor' : 'url(#numToolGradHome)'} textAnchor="middle" fontFamily="monospace">1</text>
                              </svg>
                            ) : <Icon className="w-3 h-3 shrink-0" strokeWidth={1.8} />}
                            <span className="hidden sm:inline">{label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Undo + Clear — always reserve space */}
                      <div className="flex flex-col gap-1 shrink-0" style={{ visibility: 'hidden' }}>
                        <button className="flex items-center gap-1 h-7 px-2 rounded-lg bg-[var(--surface-3)] border border-[var(--border-on-dark)] text-xs text-[var(--text-on-dark-subtle)]">
                          <RotateCcw className="w-3 h-3" strokeWidth={2} />
                          <span className="hidden sm:inline">Undo</span>
                        </button>
                        <button className="flex items-center gap-1 h-7 px-2 rounded-lg bg-[var(--surface-3)] border border-[var(--border-on-dark)] text-xs text-[var(--severity-critical)]/60">
                          <X className="w-3 h-3" strokeWidth={2} />
                          <span className="hidden sm:inline">Clear</span>
                        </button>
                      </div>
                    </div>

                    {/* Color swatches */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-on-dark-subtle)] shrink-0">Color</span>
                      <div className="flex items-center gap-1.5">
                        {ANNOTATION_COLORS.map(({ label, value }) => (
                          <button
                            key={value} title={label}
                            onClick={() => setAnnotationColor(value)}
                            className="w-5 h-5 rounded-full border-2 transition-all shrink-0 hover:scale-110"
                            style={{
                              backgroundColor: value,
                              borderColor: annotationColor === value ? 'rgba(255,255,255,0.9)' : 'transparent',
                              boxShadow: annotationColor === value ? `0 0 0 1px ${value}` : undefined,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {activeTool && (
                      <p className="text-xs text-[var(--text-on-dark-subtle)]">
                        {activeTool === 'square' && 'Click and drag to draw a rectangle'}
                        {activeTool === 'arrow'  && 'Click and drag to draw an arrow'}
                        {activeTool === 'number' && 'Click to place a numbered marker'}
                        {activeTool === 'blur'   && 'Click and drag to mark a blur region'}
                        {activeTool === 'crop'   && 'Click and drag to select the crop area'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2, Col 2: Rest of form */}
                <div className="space-y-4">

                  {/* Recommendation */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-2">
                      <CheckCircle2 className="w-3 h-3" strokeWidth={2} /> Recommendation
                    </label>
                    <textarea
                      value={recommendation}
                      onChange={(e) => setRecommendation(e.target.value)}
                      placeholder="How would you recommend addressing this issue?"
                      className="w-full min-h-[80px] bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg p-3 text-sm text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] resize-none outline-none focus:border-[var(--brand-blue)]/60 transition-colors"
                    />
                  </div>

                  {/* MetaSelect grid — 5 fields exactly like the real card */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <MetaSelect
                      label="Category" icon={<Layers className="w-3 h-3" strokeWidth={2} />}
                      value={category} onChange={setCategory}
                      options={['None', 'Usability', 'Bug', 'User Interface', 'Feature', 'Content', 'Info Architecture', 'Info Design']}
                      optionIcons={{
                        None:               <Layers  className="w-3 h-3 text-[var(--text-placeholder)]" strokeWidth={2} />,
                        Usability:          <Pointer className="w-3 h-3" style={{ color: '#C0375A' }} strokeWidth={2} />,
                        Bug:                <Bug     className="w-3 h-3" style={{ color: '#D95C4A' }} strokeWidth={2} />,
                        'User Interface':   <Monitor className="w-3 h-3" style={{ color: '#D97B3A' }} strokeWidth={2} />,
                        Feature:            <Sparkles className="w-3 h-3" style={{ color: '#3AA68A' }} strokeWidth={2} />,
                        Content:            <FileText className="w-3 h-3" style={{ color: '#3A9EB5' }} strokeWidth={2} />,
                        'Info Architecture':<Network  className="w-3 h-3" style={{ color: '#3A5CA6' }} strokeWidth={2} />,
                        'Info Design':      <PenTool  className="w-3 h-3" style={{ color: '#7B5EA6' }} strokeWidth={2} />,
                      }}
                    />
                    <MetaSelect
                      label="Severity" icon={<AlertCircle className="w-3 h-3" strokeWidth={2} />}
                      value={severity} onChange={setSeverity}
                      options={['None', 'Low', 'Medium', 'High', 'Critical']}
                      optionIcons={{
                        None:     <AlertCircle className="w-3 h-3 text-[var(--text-placeholder)]" strokeWidth={2} />,
                        Low:      <AlertCircle className="w-3 h-3 text-[var(--severity-low)]"             strokeWidth={2} />,
                        Medium:   <AlertCircle className="w-3 h-3 text-[var(--severity-medium)]"          strokeWidth={2} />,
                        High:     <AlertCircle className="w-3 h-3 text-[var(--severity-serious)]"         strokeWidth={2} />,
                        Critical: <AlertCircle className="w-3 h-3 text-[var(--severity-critical)]"        strokeWidth={2} />,
                      }}
                    />
                    <MetaSelect
                      label="Priority" icon={<Flag className="w-3 h-3" strokeWidth={2} />}
                      value={priority} onChange={setPriority}
                      options={['None', 'Low', 'Medium', 'High']}
                      optionIcons={{
                        None:   <Flag className="w-3 h-3 text-[var(--text-placeholder)]" strokeWidth={2} />,
                        Low:    <Flag className="w-3 h-3 text-[var(--severity-low)]"       strokeWidth={2} />,
                        Medium: <Flag className="w-3 h-3 text-[var(--severity-medium)]"    strokeWidth={2} />,
                        High:   <Flag className="w-3 h-3 text-[var(--severity-critical)]"  strokeWidth={2} />,
                      }}
                    />
                    <MetaSelect
                      label="Effort" icon={<Zap className="w-3 h-3" strokeWidth={2} />}
                      value={effort} onChange={setEffort}
                      options={['None', 'Low', 'Medium', 'High']}
                      optionIcons={{
                        None:   <Zap className="w-3 h-3 text-[var(--text-placeholder)]" strokeWidth={2} />,
                        Low:    <Zap className="w-3 h-3 text-[var(--severity-low)]"      strokeWidth={2} />,
                        Medium: <Zap className="w-3 h-3 text-[var(--severity-medium)]"   strokeWidth={2} />,
                        High:   <Zap className="w-3 h-3 text-[var(--severity-critical)]" strokeWidth={2} />,
                      }}
                    />
                    <MetaSelect
                      label="Status" icon={<Circle className="w-3 h-3" strokeWidth={2} />}
                      value={status} onChange={setStatus}
                      options={['Not Resolved', 'In Progress', 'Resolved', 'Not an issue']}
                      optionIcons={{
                        'Not Resolved': <Circle       className="w-3 h-3 text-[var(--severity-critical)]" strokeWidth={2} />,
                        'In Progress':  <Clock        className="w-3 h-3 text-[var(--severity-medium)]"   strokeWidth={2} />,
                        'Resolved':     <CheckCircle2 className="w-3 h-3 text-[var(--brand-green)]"       strokeWidth={2} />,
                        'Not an issue': <XCircle      className="w-3 h-3 text-[var(--text-faint)]" strokeWidth={2} />,
                      }}
                    />
                  </div>

                  {/* UX Law + Tags */}
                  <div className={`grid grid-cols-1 ${hasFramework ? 'sm:grid-cols-2' : ''} gap-3`}>
                    {hasFramework && (
                      <div>
                        <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-2">
                          <BookOpen className="w-3 h-3" strokeWidth={2} /> UX Law <span style={{ color: 'var(--text-ghost)' }} className="ml-1">(optional)</span>
                        </label>
                        <input
                          type="text" value={uxLaw} onChange={(e) => setUxLaw(e.target.value)}
                          placeholder="e.g., Jakob's Law, Fitts's Law..."
                          className="w-full h-9 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3 text-sm text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors"
                        />
                      </div>
                    )}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-2">
                        <Tag className="w-3 h-3" strokeWidth={2} /> Tags <span style={{ color: 'var(--text-ghost)' }} className="ml-1">(optional)</span>
                      </label>
                      <input
                        type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                        placeholder="accessibility, contrast, mobile..."
                        className="w-full h-9 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3 text-sm text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Comments Panel ─────────────────────────────────────────── */}
            <AnimatePresence initial={false}>
              {showComments && (
                <motion.div
                  key="comments"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="px-5 py-4 space-y-4">
                    <p className="text-xs text-[var(--text-faint)]">{comments.length} comment{comments.length !== 1 ? 's' : ''}</p>

                    {comments.map((c) => (
                      <div key={c.id} className="flex gap-3">
                        <div
                          className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white mt-0.5"
                          style={{ background: c.color, fontSize: 9, fontWeight: 700 }}
                        >
                          {c.initials}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-0.5">
                            <span className="text-xs text-[var(--text-on-dark)]">{c.author}</span>
                            <span className="text-[10px] text-[var(--text-faint)]">{c.time}</span>
                          </div>
                          <p className="text-xs text-[var(--text-muted)] leading-relaxed">{c.text}</p>
                        </div>
                      </div>
                    ))}

                    {/* Comment input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        onKeyDown={(e) => { if (e.key === 'Enter') submitComment(); }}
                        className="flex-1 h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3 text-xs text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors"
                      />
                      <button
                        onClick={submitComment}
                        disabled={!commentText.trim()}
                        className="w-8 h-8 rounded-lg bg-[var(--brand-blue)] flex items-center justify-center text-white hover:bg-[var(--brand-blue-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
