import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  FileText, Upload, Plus, X, Image as ImageIcon, Trash2,
  MessageSquare, MoreVertical, ChevronDown,
  ArrowRight, Type, Droplet, Crop, RotateCcw, RotateCw, ChevronLeft,
  ChevronRight, AlertCircle, Flag, Zap,
  Link2, Calendar, Tag, BookOpen, Hash, CheckCircle2, Circle, XCircle,
  ExternalLink, Clock, Layers, Copy,
  MousePointerClick, Bookmark, Send, Check, Pencil,
  Square, Maximize2, GripVertical, Search
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const AVATAR_COLORS = [
  'linear-gradient(135deg, #4274BA 0%, #6BB5AA 100%)',
  'linear-gradient(135deg, #C0375A 0%, #FF8D3A 100%)',
  'linear-gradient(135deg, #7B5EA6 0%, #4274BA 100%)',
  'linear-gradient(135deg, #3A9EB5 0%, #ACD8AB 100%)',
  'linear-gradient(135deg, #E8B84B 0%, #FF8D3A 100%)',
];

function getProfile() {
  try {
    const raw = localStorage.getItem('uxm_profile');
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function IssueAuthorAvatar() {
  const profile = getProfile();
  const name: string = profile.name ?? 'Lena Hassan';
  const avatarImage: string | null = profile.avatarImage ?? null;
  const avatarIdx: number = profile.avatarIdx ?? 0;
  const initials = name.trim()
    ? name.trim().split(/\s+/).map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'LH';

  return (
    <div className="relative group/author shrink-0">
      <div
        className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center text-white shrink-0 select-none cursor-default"
        style={{
          background: avatarImage ? 'var(--surface-3)' : AVATAR_COLORS[avatarIdx],
          fontSize: '9px',
          fontWeight: 700,
        }}
      >
        {avatarImage
          ? <img src={avatarImage} alt={name} className="w-full h-full object-cover" />
          : initials
        }
      </div>
      {/* Tooltip */}
      <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-[11px] whitespace-nowrap pointer-events-none opacity-0 group-hover/author:opacity-100 transition-opacity z-50"
        style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-on-dark-strong)', color: 'var(--text-on-dark)', boxShadow: 'var(--card-shadow-elevated)' }}
      >
        {name}
      </div>
    </div>
  );
}
import { ColorWheelPicker } from './ColorWheelPicker';
import { useFieldOptions } from '../context/FieldOptionsContext';
import { DynamicIcon } from '../utils/iconMap';
import { ConfirmModal } from './ConfirmModal';

export type Annotation = {
  imageIndex: number;
  type: 'rect' | 'arrow' | 'number' | 'text' | 'blur';
  x: number; // % of container width
  y: number; // % of container height
  w?: number; // % width (rect/blur only)
  h?: number; // % height (rect/blur only)
  endX?: number; // % end x for arrows
  endY?: number; // % end y for arrows
  text?: string; // text content for text annotations
  numberValue?: number; // sequential number for number annotations
  color?: string; // annotation color
};

export type Issue = {
  id: number;
  issueTitle: string;
  pageName: string;
  pageUrl: string;
  dateTaken: string;
  description: string;
  recommendation: string;
  uxLaw: string;
  tags: string;
  category: string;
  severity: string;
  priority: string;
  effort: string;
  status: string;
  author: string;
  images: Array<{ id: string; data: string; name: string; originalData: string; objectPosition?: string }>;
  currentImageIndex: number;
  annotations: Annotation[];
  visualRecImages: Array<{ id: string; data: string; name: string }>;
  collapsed: boolean;
  comments: { id: number; author: string; text: string; timestamp: string; edited?: boolean; editedAt?: string }[];
  showComments: boolean;
  bookmarked: boolean;
};

export const UX_LAWS_BY_FRAMEWORK: Record<string, string[]> = {
  'Nielsen 10 Usability Heuristics': [
    '#1 Visibility of System Status',
    '#2 Match Between System and the Real World',
    '#3 User Control and Freedom',
    '#4 Consistency and Standards',
    '#5 Error Prevention',
    '#6 Recognition Rather Than Recall',
    '#7 Flexibility and Efficiency of Use',
    '#8 Aesthetic and Minimalist Design',
    '#9 Help Users Recognize, Diagnose, and Recover from Errors',
    '#10 Help and Documentation',
  ],
  'WCAG 2.2': [
    'Perceivable',
    'Operable',
    'Understandable',
    'Robust',
  ],
  'ISO 9241-110': [
    'Suitability for the Task',
    'Self-Descriptiveness',
    'Controllability',
    'Conformity with User Expectations',
    'Error Tolerance',
    'Suitability for Individualization',
    'Suitability for Learning',
  ],
};

// Fallback: all laws across all frameworks for when no framework is specified
export const ALL_UX_LAWS: string[] = Object.values(UX_LAWS_BY_FRAMEWORK).flat();

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: 'var(--brand-blue)', fontWeight: 600 }}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

export const severityBg: Record<string, string> = {
  Critical: 'bg-[var(--severity-critical-bg)] text-[var(--severity-critical)] border-[var(--severity-critical-border)]',
  High: 'bg-[var(--severity-serious-bg)] text-[var(--severity-serious)] border-[var(--severity-serious-border)]',
  Medium: 'bg-[var(--severity-medium-bg)] text-[var(--severity-medium)] border-[var(--severity-medium-border)]',
  Low: 'bg-[var(--severity-low-bg)] text-[var(--severity-low)] border-[var(--severity-low-border)]',
};

export const statusBg: Record<string, string> = {
  'Not Resolved': 'bg-[var(--severity-critical-bg)] text-[var(--severity-critical)] border-[var(--severity-critical-border)]',
  'In Progress': 'bg-[var(--severity-medium-bg)] text-[var(--severity-medium)] border-[var(--severity-medium-border)]',
  Resolved: 'bg-[var(--brand-green-soft)] text-[var(--brand-green)] border-[var(--brand-green)]/25',
  'Not an issue': 'bg-[var(--surface-hover-medium)] text-[var(--text-subtle)] border-[var(--border-default)]',
};

export const ANNOTATION_TOOLS = [
  { id: 'square', label: 'Square', Icon: Square },
  { id: 'arrow', label: 'Arrow', Icon: ArrowRight },
  { id: 'number', label: 'Number', Icon: Hash },
  { id: 'blur', label: 'Blur', Icon: Droplet },
  { id: 'crop', label: 'Crop', Icon: Crop },
  { id: 'text', label: 'Text', Icon: Type },
];

export const ANNOTATION_COLORS = [
  { label: 'Red',    value: '#FF5C5C' },
  { label: 'Orange', value: '#FF8D3A' },
  { label: 'Yellow', value: '#E8B84B' },
  { label: 'Blue',   value: '#4274BA' },
  { label: 'Green',  value: '#ACD8AB' },
  { label: 'Teal',   value: '#6BB5AA' },
];

export type CardPrefs = {
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
  showStatus: boolean;
  showUxLaw: boolean;
  showTags: boolean;
  showIntroduction: boolean;
  showConclusion: boolean;
};

export const DEFAULT_CARD_PREFS: CardPrefs = {
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
  showStatus: true,
  showUxLaw: true,
  showTags: true,
  showIntroduction: true,
  showConclusion: true,
};

export type IssueCardProps = {
  issue: Issue;
  index: number;
  activeAnnotation: { issueId: number; tool: string } | null;
  activeMenu: number | null;
  cardPrefs?: CardPrefs;
  dragHandleRef?: React.RefObject<HTMLElement>;
  onToggleCollapse: () => void;
  onSetAnnotation: (tool: string) => void;
  onAddImage: (file: File) => void;
  onRemoveImage: (imgIdx: number) => void;
  onNavigateImage: (dir: 'prev' | 'next') => void;
  onAddVisualRec: (file: File) => void;
  onRemoveVisualRec: (idx: number) => void;
  onRemoveIssue: () => void;
  onDuplicateIssue: () => void;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onUpdateIssue: (field: keyof Issue, value: string | boolean | number | Annotation[]) => void;
  onToggleComments: () => void;
  onAddComment: (text: string) => void;
  onDeleteComment: (commentId: number) => void;
  onEditComment: (commentId: number, newText: string) => void;
  onAddAnnotation: (ann: Annotation) => void;
  onUndoAnnotation: () => void;
  onRedoAnnotation: () => void;
  canRedo: boolean;
  canUndo: boolean;
  onClearAnnotations: (imageIndex: number) => void;
  onReplaceImage: (imgIdx: number, newData: string) => void;
  onToggleBookmark: () => void;
  framework?: string;
};

export function IssueCard({
  issue, index, activeAnnotation, activeMenu,
  cardPrefs = DEFAULT_CARD_PREFS,
  dragHandleRef,
  onToggleCollapse, onSetAnnotation, onAddImage, onRemoveImage,
  onNavigateImage, onAddVisualRec, onRemoveVisualRec,
  onRemoveIssue, onDuplicateIssue, onToggleMenu, onCloseMenu, onUpdateIssue,
  onToggleComments, onAddComment, onDeleteComment, onEditComment, onAddAnnotation, onUndoAnnotation, onRedoAnnotation, canRedo, canUndo, onClearAnnotations,
  onReplaceImage, onToggleBookmark,
  framework,
}: IssueCardProps) {
  const { t } = useTranslation();
  const { options: fieldOpts } = useFieldOptions();
  const uxLawOptions = framework && UX_LAWS_BY_FRAMEWORK[framework]
    ? UX_LAWS_BY_FRAMEWORK[framework]
    : ALL_UX_LAWS;
  const menuRef = useRef<HTMLDivElement>(null);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [pendingDeleteCommentId, setPendingDeleteCommentId] = useState<number | null>(null);
  const [pendingDeleteIssue, setPendingDeleteIssue] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [duplicated, setDuplicated] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#issue-${issue.id}`;
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.cssText = 'position:fixed;top:-9999px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(fallback);
    } else {
      fallback();
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };
  const [tagInput, setTagInput] = useState('');
  const [uxLawQuery, setUxLawQuery] = useState('');
  const [uxLawOpen, setUxLawOpen] = useState(false);
  const [uxLawActiveIdx, setUxLawActiveIdx] = useState(0);
  const [uxLawDropdownPos, setUxLawDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const uxLawInputRef = useRef<HTMLInputElement>(null);
  const uxLawAnchorRef = useRef<HTMLDivElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const visualRecUploadRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawCurrent, setDrawCurrent] = useState<{ x: number; y: number } | null>(null);
  const [textAnnotationPos, setTextAnnotationPos] = useState<{ x: number; y: number } | null>(null);
  const [textAnnotationValue, setTextAnnotationValue] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isHoveringUpload, setIsHoveringUpload] = useState(false);
  const [annotationColor, setAnnotationColor] = useState('#FF5C5C');
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!colorPickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setColorPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [colorPickerOpen]);

  // Position the portaled UX Law dropdown to the anchor element — calculated once on open.
  // On any scroll the dropdown closes immediately (same pattern as Sort/Filter/Customize).
  useEffect(() => {
    if (!uxLawOpen || !uxLawAnchorRef.current) return;
    const r = uxLawAnchorRef.current.getBoundingClientRect();
    setUxLawDropdownPos({ top: r.bottom + 6, left: r.left, width: r.width });

    const onScroll = () => setUxLawOpen(false);
    const onResize = () => {
      if (!uxLawAnchorRef.current) return;
      const rr = uxLawAnchorRef.current.getBoundingClientRect();
      setUxLawDropdownPos({ top: rr.bottom + 6, left: rr.left, width: rr.width });
    };

    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onResize);
    };
  }, [uxLawOpen]);

  const [selectedAnnGlobalIdx, setSelectedAnnGlobalIdx] = useState<number | null>(null);
  const [annDragInfo, setAnnDragInfo] = useState<{
    globalIdx: number;
    containerRect: DOMRect;
    origX: number; origY: number;
    origEndX?: number; origEndY?: number;
    mouseStartX: number; mouseStartY: number;
  } | null>(null);
  const [resizeDragInfo, setResizeDragInfo] = useState<{
    globalIdx: number;
    containerRect: DOMRect;
    handle: string;
    origX: number; origY: number; origW: number; origH: number;
    mouseStartX: number; mouseStartY: number;
  } | null>(null);
  const annotationsRef = useRef(issue.annotations);
  annotationsRef.current = issue.annotations;
  const onUpdateIssueRef = useRef(onUpdateIssue);
  onUpdateIssueRef.current = onUpdateIssue;
  const selectedAnnGlobalIdxRef = useRef(selectedAnnGlobalIdx);
  selectedAnnGlobalIdxRef.current = selectedAnnGlobalIdx;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      const idx = selectedAnnGlobalIdxRef.current;
      if (idx === null) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      e.preventDefault();
      onUpdateIssueRef.current('annotations', annotationsRef.current.filter((_, i) => i !== idx));
      setSelectedAnnGlobalIdx(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!annDragInfo) return;
    const handleMove = (e: MouseEvent) => {
      const dx = ((e.clientX - annDragInfo.mouseStartX) / annDragInfo.containerRect.width) * 100;
      const dy = ((e.clientY - annDragInfo.mouseStartY) / annDragInfo.containerRect.height) * 100;
      const updated = annotationsRef.current.map((ann, idx) => {
        if (idx !== annDragInfo.globalIdx) return ann;
        const newX = Math.max(0, Math.min(100, annDragInfo.origX + dx));
        const newY = Math.max(0, Math.min(100, annDragInfo.origY + dy));
        if (ann.type === 'arrow') {
          const newEndX = Math.max(0, Math.min(100, (annDragInfo.origEndX ?? 0) + dx));
          const newEndY = Math.max(0, Math.min(100, (annDragInfo.origEndY ?? 0) + dy));
          return { ...ann, x: newX, y: newY, endX: newEndX, endY: newEndY };
        }
        return { ...ann, x: newX, y: newY };
      });
      onUpdateIssueRef.current('annotations', updated);
    };
    const handleUp = () => setAnnDragInfo(null);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [annDragInfo]);

  useEffect(() => {
    if (!resizeDragInfo) return;
    const handleMove = (e: MouseEvent) => {
      const dx = ((e.clientX - resizeDragInfo.mouseStartX) / resizeDragInfo.containerRect.width) * 100;
      const dy = ((e.clientY - resizeDragInfo.mouseStartY) / resizeDragInfo.containerRect.height) * 100;
      const { handle, origX, origY, origW, origH } = resizeDragInfo;
      let newX = origX, newY = origY, newW = origW, newH = origH;
      if (handle.includes('w')) { newX = origX + dx; newW = origW - dx; }
      if (handle.includes('e')) { newW = origW + dx; }
      if (handle.includes('n')) { newY = origY + dy; newH = origH - dy; }
      if (handle.includes('s')) { newH = origH + dy; }
      const MIN = 2;
      if (newW < MIN) { if (handle.includes('w')) newX = origX + origW - MIN; newW = MIN; }
      if (newH < MIN) { if (handle.includes('n')) newY = origY + origH - MIN; newH = MIN; }
      newX = Math.max(0, newX);
      newY = Math.max(0, newY);
      newW = Math.min(100 - newX, newW);
      newH = Math.min(100 - newY, newH);
      const updated = annotationsRef.current.map((ann, idx) => {
        if (idx !== resizeDragInfo.globalIdx) return ann;
        return { ...ann, x: newX, y: newY, w: newW, h: newH };
      });
      onUpdateIssueRef.current('annotations', updated);
    };
    const handleUp = () => setResizeDragInfo(null);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [resizeDragInfo]);

  useEffect(() => {
    if (activeMenu !== issue.id) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onCloseMenu();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [activeMenu, issue.id]);

  useEffect(() => {
    if (!isHoveringUpload) return;
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) { onAddImage(file); break; }
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [isHoveringUpload, onAddImage]);

  const activeTool = activeAnnotation?.issueId === issue.id ? activeAnnotation.tool : null;

  const hasImage = issue.images.length > 0;

  return (
    <div className={`bg-[var(--surface-2)] border rounded-xl overflow-hidden transition-colors ${issue.collapsed ? 'border-[var(--border-faint)]' : 'border-[var(--border-subtle)]'}`} style={{ boxShadow: 'var(--card-shadow-default)' }}>
      {/* Card Header */}
      <div className="px-5 py-3 flex items-center gap-3 border-b border-[var(--border-faint)] bg-[var(--surface-1)]">
        {/* Drag handle — only rendered when dragHandleRef is provided */}
        {dragHandleRef && (
          <div
            ref={dragHandleRef as React.RefObject<HTMLDivElement>}
            className="shrink-0 text-[var(--text-ghost)] hover:text-[var(--text-subtle)] cursor-grab active:cursor-grabbing transition-colors touch-none select-none -ml-1"
            title={t('issueCard.dragToReorder')}
          >
            <GripVertical className="w-4 h-4" strokeWidth={1.8} />
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-1 text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
        >
          {issue.collapsed ? <ChevronRight className="w-4 h-4" strokeWidth={2} /> : <ChevronDown className="w-4 h-4" strokeWidth={2} />}
        </button>

        <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[var(--surface-base)] text-[9px]" style={{ background: 'var(--brand-teal)', fontWeight: 700 }}>
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={issue.issueTitle}
            onChange={(e) => onUpdateIssue('issueTitle', e.target.value)}
            placeholder={t('issueCard.untitled')}
            className="w-full bg-transparent border-none text-base text-[var(--text-on-dark)] placeholder:text-[var(--text-faint)] placeholder:italic outline-none focus:ring-0"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Duplicate toast */}
          <AnimatePresence>
            {duplicated && (
              <motion.span
                initial={{ opacity: 0, scale: 0.85, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 4 }}
                transition={{ duration: 0.15 }}
                className="text-[11px] px-2 py-0.5 rounded-md pointer-events-none"
                style={{ background: 'var(--brand-blue-soft)', color: 'var(--brand-blue)', border: '1px solid var(--brand-blue)/30' }}
              >
                Duplicated!
              </motion.span>
            )}
          </AnimatePresence>

          {/* Copy link toast */}
          <AnimatePresence>
            {linkCopied && (
              <motion.span
                initial={{ opacity: 0, scale: 0.85, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 4 }}
                transition={{ duration: 0.15 }}
                className="text-[11px] px-2 py-0.5 rounded-md pointer-events-none"
                style={{ background: 'var(--brand-blue-soft)', color: 'var(--brand-blue)', border: '1px solid var(--brand-blue)/30' }}
              >
                {t('audit.copyFeedback_url')}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Author avatar */}
          <IssueAuthorAvatar />

          {/* Comments */}
          <button onClick={onToggleComments} className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors relative ${issue.showComments ? 'bg-[var(--brand-blue-soft)] border-[var(--brand-blue)]/40 text-[var(--brand-blue)]' : 'border-[var(--border-strong-alt)] text-[var(--text-faint)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover-strong)] hover:bg-[var(--surface-hover-medium)]'}`}>
            <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.8} fill={issue.showComments ? 'currentColor' : 'none'} style={{ transform: 'translateY(1px)' }} />
            {issue.comments.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--brand-teal)] text-[var(--surface-base)] text-[9px] flex items-center justify-center" style={{ fontWeight: 700 }}>
                {issue.comments.length}
              </span>
            )}
          </button>

          {/* Bookmark */}
          <button
            onClick={onToggleBookmark}
            className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors ${issue.bookmarked ? 'bg-[var(--brand-blue-soft)] border-[var(--brand-blue)]/40 text-[var(--brand-blue)]' : 'border-[var(--border-strong-alt)] text-[var(--text-faint)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover-strong)] hover:bg-[var(--surface-hover-medium)]'}`}
          >
            <Bookmark className="w-3.5 h-3.5" strokeWidth={1.8} fill={issue.bookmarked ? 'currentColor' : 'none'} />
          </button>

          {/* More */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={onToggleMenu}
              className="w-7 h-7 rounded-full border border-[var(--border-strong-alt)] flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover-strong)] hover:bg-[var(--surface-hover-medium)] transition-colors"
            >
              <MoreVertical className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>
            {activeMenu === issue.id && (
              <div className="absolute right-0 top-8 w-44 bg-[var(--surface-elevated)] border border-[var(--border-medium)] rounded-xl shadow-2xl overflow-hidden z-20" style={{ boxShadow: 'var(--card-shadow-elevated)' }}>
                <button onClick={() => { onDuplicateIssue(); onCloseMenu(); setDuplicated(true); setTimeout(() => setDuplicated(false), 2000); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-[var(--text-muted)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)] text-left transition-colors">
                  <Copy className="w-3.5 h-3.5" strokeWidth={1.8} /> {t('issueCard.duplicate')}
                </button>
                <button onClick={() => { handleCopyLink(); onCloseMenu(); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-[var(--text-muted)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)] text-left transition-colors">
                  <Link2 className="w-3.5 h-3.5" strokeWidth={1.8} /> {t('issueCard.copyLink')}
                </button>
                <div className="h-px bg-[var(--border-faint)] mx-3" />
                <button onClick={() => { onCloseMenu(); setPendingDeleteIssue(true); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-400 hover:bg-red-400/10 text-left transition-colors">
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} /> {t('issueCard.deleteIssue')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Body */}
      <AnimatePresence initial={false}>
        {!issue.collapsed && (
        <motion.div
          key="body"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          style={{ overflow: 'hidden' }}
        >
        <div className="p-5">
          <input ref={imageUploadRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onAddImage(f); e.target.value = ''; }} />
          <input ref={visualRecUploadRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onAddVisualRec(f); e.target.value = ''; }} />
          <div className="flex items-start gap-5 flex-wrap lg:flex-nowrap">
            {/* Left: Page/Date/Link then Image — stacked with gap-2 */}
            <div className="shrink-0 w-full lg:w-[420px] xl:w-[480px] flex flex-col gap-2">
            <AnimatePresence initial={false}>
            {(cardPrefs.showPage || cardPrefs.showDate || cardPrefs.showLink) && (
            <motion.div
              key="pdl-row"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <motion.div layout className="flex gap-2">
                <AnimatePresence initial={false} mode="popLayout">
                {cardPrefs.showPage && (
                <motion.div key="page" layout
                  initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                  className="flex-1 min-w-0">
                  <label className="flex items-center gap-1.5 text-xs mb-1.5" style={{ color: 'var(--text-on-dark-subtle)' }}>
                    <MousePointerClick className="w-3 h-3" strokeWidth={2} /> {t('issueCard.page')}
                  </label>
                  <input type="text" value={issue.pageName} onChange={(e) => onUpdateIssue('pageName', e.target.value)} placeholder={t('issueCard.pagePlaceholder')}
                    className="w-full h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3 text-xs text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors" style={{ fontWeight: 600 }} />
                </motion.div>
                )}
                {cardPrefs.showDate && (
                <motion.div key="date" layout
                  initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                  className="flex-1 min-w-0">
                  <label className="flex items-center gap-1.5 text-xs mb-1.5" style={{ color: 'var(--text-on-dark-subtle)' }}>
                    <Calendar className="w-3 h-3" strokeWidth={2} /> {t('issueCard.date')}
                  </label>
                  <input
                    type="text"
                    value={issue.dateTaken ? issue.dateTaken.split('-').reverse().join('/') : ''}
                    onChange={(e) => {
                      const parts = e.target.value.replace(/[^\d/]/g, '').split('/');
                      if (parts.length === 3 && parts[2].length === 4) {
                        const iso = `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
                        onUpdateIssue('dateTaken', iso);
                      } else {
                        onUpdateIssue('dateTaken', e.target.value);
                      }
                    }}
                    placeholder={t('issueCard.datePlaceholder')}
                    className="w-full h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3 text-xs text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors" style={{ fontWeight: 600 }} />
                </motion.div>
                )}
                {cardPrefs.showLink && (
                <motion.div key="link" layout
                  initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                  className="flex-1 min-w-0">
                  <label className="flex items-center gap-1.5 text-xs mb-1.5" style={{ color: 'var(--text-on-dark-subtle)' }}>
                    <Link2 className="w-3 h-3" strokeWidth={2} /> {t('issueCard.link')}
                  </label>
                  <div className="flex gap-1">
                    <input type="url" value={issue.pageUrl} onChange={(e) => onUpdateIssue('pageUrl', e.target.value)} placeholder={t('issueCard.urlPlaceholder')}
                      className="flex-1 h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3 text-xs text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors min-w-0" style={{ fontWeight: 600 }} />
                    {issue.pageUrl && (
                      <a href={issue.pageUrl} target="_blank" rel="noopener noreferrer"
                        className="w-8 h-8 flex items-center justify-center bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg text-[var(--text-faint)] hover:text-[var(--brand-blue)] hover:border-[var(--brand-blue)]/40 transition-colors shrink-0">
                        <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.8} />
                      </a>
                    )}
                  </div>
                </motion.div>
                )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
            )}
            </AnimatePresence>
            {/* Image — directly below Page/Date/Link */}
            <div className="flex flex-col gap-2">

              {!hasImage ? (
                <div
                  role="button" tabIndex={0}
                  onClick={() => imageUploadRef.current?.click()}
                  onKeyDown={(e) => e.key === 'Enter' && imageUploadRef.current?.click()}
                  onMouseEnter={() => setIsHoveringUpload(true)}
                  onMouseLeave={() => { setIsHoveringUpload(false); setIsDragOver(false); }}
                  onDragEnter={(e) => { if (!e.dataTransfer.types.includes('Files')) return; e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
                  onDragOver={(e) => { if (!e.dataTransfer.types.includes('Files')) return; e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
                  onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); }}
                  onDrop={(e) => {
                    if (!e.dataTransfer.types.includes('Files')) return;
                    e.preventDefault(); e.stopPropagation(); setIsDragOver(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f && f.type.startsWith('image/')) onAddImage(f);
                  }}
                  className={`w-full h-72 border border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/50 ${
                    isDragOver ? 'bg-[var(--brand-blue)]/[0.08] border-[var(--brand-blue)]/60' : 'bg-[var(--surface-3)] border-[var(--border-medium)] hover:border-[var(--brand-blue)]/40 hover:bg-[var(--brand-blue)]/[0.04]'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isDragOver ? 'bg-[var(--brand-blue)]/25' : 'bg-[var(--brand-blue)]/10'}`}>
                    <Upload className={`w-5 h-5 text-[var(--brand-blue)] transition-transform ${isDragOver ? 'scale-110' : ''}`} strokeWidth={1.5} />
                  </div>
                  <div className="text-center pointer-events-none">
                    <p className={`text-sm transition-colors ${isDragOver ? 'text-[var(--brand-blue)]' : 'text-[var(--text-subtle)]'}`}>{isDragOver ? t('issueCard.uploadDropHere') : t('issueCard.uploadDrop')}</p>
                    <p className="text-xs text-[var(--text-placeholder)] mt-0.5">{t('issueCard.uploadHint')}</p>
                  </div>
                </div>
              ) : (
                (() => {
                  const inner = (
                <>
                  {/* Main image viewer */}
                  <div className="relative group">
                    <div
                      data-ann-container
                      className={`w-full ${lightboxOpen ? 'h-[78vh]' : 'h-72'} bg-[var(--surface-3)] border border-[var(--border-subtle)] rounded-xl relative overflow-hidden`}
                      style={{ cursor: activeTool ? 'crosshair' : resizeDragInfo ? `${resizeDragInfo.handle}-resize` : annDragInfo ? 'grabbing' : 'default' }}
                      onMouseDown={(e) => {
                        if (activeTool) {
                          if (activeTool === 'text') {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTextAnnotationPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
                            return;
                          }
                          if (activeTool === 'number') {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = ((e.clientX - rect.left) / rect.width) * 100;
                            const y = ((e.clientY - rect.top) / rect.height) * 100;
                            const numberAnns = issue.annotations.filter(a => a.imageIndex === issue.currentImageIndex && a.type === 'number');
                            onAddAnnotation({ imageIndex: issue.currentImageIndex, type: 'number', x, y, numberValue: numberAnns.length + 1, color: annotationColor });
                            return;
                          }
                          const rect = e.currentTarget.getBoundingClientRect();
                          setIsDrawing(true);
                          setDrawStart({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
                        } else {
                          setSelectedAnnGlobalIdx(null);
                        }
                      }}
                      onMouseMove={(e) => {
                        if (!isDrawing || !drawStart || !activeTool) return;
                        e.preventDefault();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setDrawCurrent({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
                      }}
                      onMouseUp={(e) => {
                        if (!isDrawing || !drawStart || !activeTool) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const endX = ((e.clientX - rect.left) / rect.width) * 100;
                        const endY = ((e.clientY - rect.top) / rect.height) * 100;
                        if (activeTool === 'square') {
                          const w = Math.abs(endX - drawStart.x), h = Math.abs(endY - drawStart.y);
                          const x = Math.min(drawStart.x, endX), y = Math.min(drawStart.y, endY);
                          if (w > 1 && h > 1) onAddAnnotation({ imageIndex: issue.currentImageIndex, type: 'rect', x, y, w, h, color: annotationColor });
                        } else if (activeTool === 'blur') {
                          const w = Math.abs(endX - drawStart.x), h = Math.abs(endY - drawStart.y);
                          const x = Math.min(drawStart.x, endX), y = Math.min(drawStart.y, endY);
                          if (w > 1 && h > 1) onAddAnnotation({ imageIndex: issue.currentImageIndex, type: 'blur', x, y, w, h, color: annotationColor });
                        } else if (activeTool === 'arrow') {
                          const dist = Math.sqrt((endX - drawStart.x) ** 2 + (endY - drawStart.y) ** 2);
                          if (dist > 2) onAddAnnotation({ imageIndex: issue.currentImageIndex, type: 'arrow', x: drawStart.x, y: drawStart.y, endX, endY, color: annotationColor });
                        } else if (activeTool === 'crop') {
                          const w = Math.abs(endX - drawStart.x), h = Math.abs(endY - drawStart.y);
                          const x = Math.min(drawStart.x, endX), y = Math.min(drawStart.y, endY);
                          if (w > 2 && h > 2) {
                            const imgData = issue.images[issue.currentImageIndex]?.data;
                            if (imgData) {
                              const containerW = rect.width, containerH = rect.height;
                              const doCrop = (src: string) => {
                                const img = new Image();
                                img.crossOrigin = 'anonymous';
                                img.onload = () => {
                                  const imgAspect = img.naturalWidth / img.naturalHeight;
                                  const containerAspect = containerW / containerH;
                                  let renderW: number, renderH: number, offsetX: number, offsetY: number;
                                  if (imgAspect > containerAspect) { renderW = containerW; renderH = containerW / imgAspect; offsetX = 0; offsetY = (containerH - renderH) / 2; }
                                  else { renderH = containerH; renderW = containerH * imgAspect; offsetX = (containerW - renderW) / 2; offsetY = 0; }
                                  const selX = (x / 100) * containerW - offsetX, selY = (y / 100) * containerH - offsetY;
                                  const selW = (w / 100) * containerW, selH = (h / 100) * containerH;
                                  const clampedX = Math.max(0, selX), clampedY = Math.max(0, selY);
                                  const clampedW = Math.min(renderW - Math.max(0, selX), selW), clampedH = Math.min(renderH - Math.max(0, selY), selH);
                                  const pixelX = (clampedX / renderW) * img.naturalWidth, pixelY = (clampedY / renderH) * img.naturalHeight;
                                  const pixelW = (clampedW / renderW) * img.naturalWidth, pixelH = (clampedH / renderH) * img.naturalHeight;
                                  if (pixelW > 1 && pixelH > 1) {
                                    const canvas = document.createElement('canvas');
                                    canvas.width = Math.round(pixelW); canvas.height = Math.round(pixelH);
                                    const ctx = canvas.getContext('2d');
                                    ctx?.drawImage(img, pixelX, pixelY, pixelW, pixelH, 0, 0, canvas.width, canvas.height);
                                    try {
                                      onReplaceImage(issue.currentImageIndex, canvas.toDataURL('image/png'));
                                    } catch {
                                      // cross-origin image — fetch as blob first then retry
                                      fetch(src).then(r => r.blob()).then(blob => {
                                        const blobUrl = URL.createObjectURL(blob);
                                        doCrop(blobUrl);
                                        URL.revokeObjectURL(blobUrl);
                                      }).catch(() => {});
                                    }
                                  }
                                };
                                img.src = src;
                              };
                              doCrop(imgData);
                            }
                          }
                        }
                        setIsDrawing(false); setDrawStart(null); setDrawCurrent(null);
                      }}
                      onMouseLeave={() => { setIsDrawing(false); setDrawStart(null); setDrawCurrent(null); }}
                    >
                      {issue.images[issue.currentImageIndex] && (
                        <img src={issue.images[issue.currentImageIndex].data} alt={issue.images[issue.currentImageIndex].name} className="w-full h-full object-cover" style={{ objectPosition: issue.images[issue.currentImageIndex].objectPosition ?? 'center' }} draggable={false} />
                      )}
                      {/* Zoom button */}
                      {issue.images[issue.currentImageIndex] && !lightboxOpen && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                          className="absolute bottom-2 right-2 w-7 h-7 rounded-lg bg-black/50 hover:bg-black/70 text-white/80 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-20"
                          title={t('issueCard.viewFullscreen')}
                        >
                          <Maximize2 className="w-3.5 h-3.5" strokeWidth={2} />
                        </button>
                      )}

                      {/* SVG layer: arrows (interactive when no tool active) */}
                      <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible', pointerEvents: activeTool ? 'none' : 'all' }}>
                        <defs>
                          {issue.annotations
                            .filter((a) => a.imageIndex === issue.currentImageIndex && a.type === 'arrow')
                            .map((ann, i) => (
                              <marker key={i} id={`arrowhead-${issue.id}-${i}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                                <polygon points="0 0, 8 3, 0 6" fill={ann.color ?? '#FF5C5C'} />
                              </marker>
                            ))}
                        </defs>
                        {issue.annotations.map((ann, globalIdx) => {
                          if (ann.imageIndex !== issue.currentImageIndex || ann.type !== 'arrow' || ann.endX == null || ann.endY == null) return null;
                          const arrowAnns = issue.annotations.filter(a => a.imageIndex === issue.currentImageIndex && a.type === 'arrow');
                          const localI = arrowAnns.indexOf(ann);
                          const isSelected = selectedAnnGlobalIdx === globalIdx;
                          return (
                            <g key={globalIdx} style={{ cursor: activeTool ? 'crosshair' : 'grab' }}
                              onMouseDown={(e) => {
                                if (activeTool) return;
                                e.stopPropagation();
                                setSelectedAnnGlobalIdx(globalIdx);
                                const containerEl = e.currentTarget.closest('[data-ann-container]') as HTMLElement;
                                const containerRect = containerEl?.getBoundingClientRect();
                                if (containerRect) setAnnDragInfo({ globalIdx, containerRect, origX: ann.x, origY: ann.y, origEndX: ann.endX, origEndY: ann.endY, mouseStartX: e.clientX, mouseStartY: e.clientY });
                              }}>
                              {/* Invisible thick hit area */}
                              <line x1={`${ann.x}%`} y1={`${ann.y}%`} x2={`${ann.endX}%`} y2={`${ann.endY}%`} stroke="transparent" strokeWidth="12" />
                              <line x1={`${ann.x}%`} y1={`${ann.y}%`} x2={`${ann.endX}%`} y2={`${ann.endY}%`}
                                stroke={isSelected ? 'white' : (ann.color ?? '#FF5C5C')}
                                strokeWidth={isSelected ? '3' : '2.5'}
                                markerEnd={`url(#arrowhead-${issue.id}-${localI})`} />
                              {isSelected && (
                                <foreignObject x={`${ann.endX}%`} y={`${ann.endY}%`} width="18" height="18" style={{ transform: 'translate(-2px, -18px)' }}>
                                  <div className="w-4.5 h-4.5 rounded-full bg-red-500 flex items-center justify-center cursor-pointer text-white"
                                    style={{ width: 18, height: 18, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                    onMouseDown={(e) => { e.stopPropagation(); onUpdateIssue('annotations', issue.annotations.filter((_, i) => i !== globalIdx)); setSelectedAnnGlobalIdx(null); }}>
                                    <X style={{ width: 10, height: 10, color: 'white' }} strokeWidth={2.5} />
                                  </div>
                                </foreignObject>
                              )}
                            </g>
                          );
                        })}
                      </svg>

                      {/* Div layer: rect, blur, number, text (interactive when no tool) */}
                      {issue.annotations.map((ann, globalIdx) => {
                        if (ann.imageIndex !== issue.currentImageIndex) return null;
                        const isSelected = selectedAnnGlobalIdx === globalIdx;
                        const interactiveProps = !activeTool ? {
                          style: { cursor: annDragInfo?.globalIdx === globalIdx ? 'grabbing' : 'grab' } as React.CSSProperties,
                          onMouseDown: (e: React.MouseEvent) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setSelectedAnnGlobalIdx(globalIdx);
                            const containerEl = (e.currentTarget as HTMLElement).closest('[data-ann-container]') as HTMLElement;
                            const containerRect = containerEl?.getBoundingClientRect();
                            if (containerRect) setAnnDragInfo({ globalIdx, containerRect, origX: ann.x, origY: ann.y, mouseStartX: e.clientX, mouseStartY: e.clientY });
                          },
                        } : { style: { pointerEvents: 'none' as const } };

                        if ((ann.type === 'rect' || ann.type === 'blur') && ann.w != null && ann.h != null) {
                          const isBlur = ann.type === 'blur';
                          const color = ann.color ?? (isBlur ? '#4274BA' : '#FF5C5C');
                          const HANDLES = [
                            { id: 'nw', top: -5, left: -5 }, { id: 'n', top: -5, left: 'calc(50% - 5px)' }, { id: 'ne', top: -5, left: 'calc(100% - 5px)' },
                            { id: 'e', top: 'calc(50% - 5px)', left: 'calc(100% - 5px)' },
                            { id: 'se', top: 'calc(100% - 5px)', left: 'calc(100% - 5px)' }, { id: 's', top: 'calc(100% - 5px)', left: 'calc(50% - 5px)' }, { id: 'sw', top: 'calc(100% - 5px)', left: -5 },
                            { id: 'w', top: 'calc(50% - 5px)', left: -5 },
                          ];
                          return (
                            <div key={globalIdx}
                              className={`absolute rounded-sm${isBlur ? ' backdrop-blur-xl' : ''}`}
                              {...interactiveProps}
                              style={{
                                ...interactiveProps.style,
                                left: `${ann.x}%`, top: `${ann.y}%`, width: `${ann.w}%`, height: `${ann.h}%`,
                                border: isSelected ? '1.5px solid rgba(255,255,255,0.9)' : isBlur ? `1.5px solid ${color}88` : `2px solid ${color}`,
                                backgroundColor: isBlur ? `${color}33` : undefined,
                                boxShadow: isSelected ? `0 0 0 1px ${color}` : undefined,
                              }}>
                              {isSelected && !activeTool && (
                                <>
                                  <button className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center z-20"
                                    onMouseDown={(e) => { e.stopPropagation(); onUpdateIssue('annotations', issue.annotations.filter((_, i) => i !== globalIdx)); setSelectedAnnGlobalIdx(null); }}>
                                    <X className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
                                  </button>
                                  {HANDLES.map(({ id, top, left }) => (
                                    <div key={id}
                                      className="absolute w-2.5 h-2.5 rounded-full border-2 border-white z-10"
                                      style={{ top, left, background: 'var(--brand-blue)', cursor: `${id}-resize`, transform: 'none' }}
                                      onMouseDown={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        const containerEl = (e.currentTarget as HTMLElement).closest('[data-ann-container]') as HTMLElement;
                                        const containerRect = containerEl?.getBoundingClientRect();
                                        if (containerRect) setResizeDragInfo({ globalIdx, containerRect, handle: id, origX: ann.x, origY: ann.y, origW: ann.w!, origH: ann.h!, mouseStartX: e.clientX, mouseStartY: e.clientY });
                                      }}
                                    />
                                  ))}
                                </>
                              )}
                            </div>
                          );
                        }

                        if (ann.type === 'number')
                          return (
                            <div key={globalIdx} className="absolute w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold -translate-x-1/2 -translate-y-1/2 shadow-md"
                              {...interactiveProps}
                              style={{ ...interactiveProps.style, left: `${ann.x}%`, top: `${ann.y}%`, backgroundColor: ann.color ?? '#4274BA', outline: isSelected ? '2px solid white' : undefined, outlineOffset: isSelected ? '2px' : undefined }}>
                              {ann.numberValue ?? 1}
                              {isSelected && (
                                <button className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center z-10"
                                  onMouseDown={(e) => { e.stopPropagation(); onUpdateIssue('annotations', issue.annotations.filter((_, i) => i !== globalIdx)); setSelectedAnnGlobalIdx(null); }}>
                                  <X className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
                                </button>
                              )}
                            </div>
                          );

                        return null;
                      })}

                      {/* Drawing preview */}
                      {isDrawing && drawStart && drawCurrent && (
                        <>
                          {(activeTool === 'square' || activeTool === 'blur' || activeTool === 'crop') && (
                            <div className="absolute rounded-sm pointer-events-none" style={{
                              left: `${Math.min(drawStart.x, drawCurrent.x)}%`, top: `${Math.min(drawStart.y, drawCurrent.y)}%`,
                              width: `${Math.abs(drawCurrent.x - drawStart.x)}%`, height: `${Math.abs(drawCurrent.y - drawStart.y)}%`,
                              border: activeTool === 'crop' ? '2px dashed rgba(255,255,255,0.8)' : activeTool === 'blur' ? `2px solid ${annotationColor}88` : `2px solid ${annotationColor}`,
                              backgroundColor: activeTool === 'crop' ? 'rgba(0,0,0,0.3)' : activeTool === 'blur' ? `${annotationColor}22` : `${annotationColor}18`,
                            }} />
                          )}
                          {activeTool === 'arrow' && (
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                              <defs>
                                <marker id="arrowhead-preview" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                                  <polygon points="0 0, 8 3, 0 6" fill={annotationColor} />
                                </marker>
                              </defs>
                              <line x1={`${drawStart.x}%`} y1={`${drawStart.y}%`} x2={`${drawCurrent.x}%`} y2={`${drawCurrent.y}%`} stroke={annotationColor} strokeWidth="2" markerEnd="url(#arrowhead-preview)" />
                            </svg>
                          )}
                        </>
                      )}

                      {/* Text annotation input */}
                      {textAnnotationPos && (
                        <div className="absolute bg-yellow-400 rounded shadow-xl p-2 z-10" style={{ left: `${textAnnotationPos.x}%`, top: `${textAnnotationPos.y}%`, transform: 'translate(-50%, 0)' }}>
                          <input type="text" autoFocus placeholder="Type annotation..." value={textAnnotationValue}
                            onChange={(e) => setTextAnnotationValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && textAnnotationValue.trim()) {
                                onAddAnnotation({ imageIndex: issue.currentImageIndex, type: 'text', x: textAnnotationPos.x, y: textAnnotationPos.y, text: textAnnotationValue.trim(), color: annotationColor });
                                setTextAnnotationPos(null); setTextAnnotationValue(''); onSetAnnotation(activeTool || '');
                              } else if (e.key === 'Escape') { setTextAnnotationPos(null); setTextAnnotationValue(''); }
                            }}
                            className="bg-transparent text-black text-xs px-1 py-0.5 outline-none w-32" />
                        </div>
                      )}

                      {activeTool && <div className="absolute inset-0 bg-[var(--brand-blue)]/[0.04] cursor-crosshair" />}

                      {issue.images.length > 1 && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md text-xs text-white/80">
                          {issue.currentImageIndex + 1} / {issue.images.length}
                        </div>
                      )}
                      {!lightboxOpen && (
                        <button onClick={() => onRemoveImage(issue.currentImageIndex)}
                          className="absolute top-2 left-2 w-7 h-7 rounded-md bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
                        </button>
                      )}
                    </div>

                    {issue.images.length > 1 && (
                      null
                    )}
                  </div>

                  {/* Annotation Toolbar */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start gap-2">
                      {/* Tool buttons + color swatches stacked together */}
                      <div className="flex flex-col gap-3 flex-1">
                        {/* Row 1: tool buttons */}
                        <div className="flex items-center gap-1 flex-wrap">
                          {ANNOTATION_TOOLS.filter(({ id }) => id !== 'text').map(({ id, label, Icon }) => (
                            <button key={id} onClick={() => { const savedColor = localStorage.getItem('uxm_annotation_color') || '#EF4444'; setAnnotationColor(savedColor); onSetAnnotation(id); setSelectedAnnGlobalIdx(null); }} title={label}
                              className={`flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs transition-all ${activeTool === id ? '' : 'bg-[var(--surface-3)] text-[var(--text-on-dark-subtle)] hover:text-[var(--text-on-dark)]'}`}
                              style={activeTool === id
                                ? { backgroundColor: `${annotationColor}22`, borderColor: `${annotationColor}88`, borderWidth: '1px', borderStyle: 'solid', color: annotationColor }
                                : { borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--border-on-dark)' }}>
                              {id === 'number' ? (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                                  <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                                  <text x="6" y="9" fontSize="6" fontWeight="700" fill="currentColor" textAnchor="middle" fontFamily="monospace">1</text>
                                </svg>
                              ) : (<Icon className="w-3 h-3 shrink-0" strokeWidth={1.8} />)}
                              <span className="hidden sm:inline">{label}</span>
                            </button>
                          ))}
                        </div>

                        {/* Row 2: color swatches */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--text-on-dark-subtle)] shrink-0">Color</span>
                          <div className="flex items-center gap-1.5">
                            {[
                              { label: 'Red', value: '#EF4444' },
                              { label: 'Blue', value: '#3B82F6' },
                              { label: 'Green', value: '#22C55E' },
                            ].map(({ label, value }) => (
                              <button key={value} title={label} onClick={() => { localStorage.setItem('uxm_annotation_color', value); setAnnotationColor(value); }}
                                className="w-5 h-5 rounded-full border-2 transition-all shrink-0 hover:scale-110"
                                style={{ backgroundColor: value, borderColor: activeTool && annotationColor === value ? 'rgba(255,255,255,0.9)' : 'transparent', boxShadow: activeTool && annotationColor === value ? `0 0 0 1px ${value}` : undefined }} />
                            ))}
                            {/* Custom color wheel picker trigger */}
                            <div ref={colorPickerRef} className="relative shrink-0 inline-flex items-center">
                              <button
                                title="Custom color"
                                onClick={() => setColorPickerOpen(o => !o)}
                                className="w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-all overflow-hidden"
                                style={{
                                  background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)',
                                  boxShadow: activeTool && !['#EF4444', '#3B82F6', '#22C55E'].includes(annotationColor)
                                    ? `0 0 0 2px rgba(255,255,255,0.9), 0 0 0 3.5px ${annotationColor}`
                                    : undefined,
                                }}
                              />
                              {colorPickerOpen && (
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50">
                                  <ColorWheelPicker
                                    color={annotationColor}
                                    onChange={(color) => { localStorage.setItem('uxm_annotation_color', color); setAnnotationColor(color); }}
                                    onClose={() => setColorPickerOpen(false)}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Undo + Clear — always visible, disabled when nothing to act on */}
                      {(() => {
                        const hasAnnotations = issue.annotations.filter(a => a.imageIndex === issue.currentImageIndex).length > 0;
                        const isCropped = issue.images[issue.currentImageIndex]?.data !== issue.images[issue.currentImageIndex]?.originalData;
                        const canClear = hasAnnotations || isCropped;
                        return (
                          <div className="flex flex-col gap-1 shrink-0">
                            <button onClick={onUndoAnnotation} disabled={!canUndo} title="Undo"
                              className="flex items-center gap-1 h-7 px-2 rounded-lg bg-[var(--surface-3)] border border-[var(--border-on-dark)] text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-[var(--text-on-dark-subtle)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-on-dark-strong)]">
                              <RotateCcw className="w-3 h-3" strokeWidth={2} />
                              <span className="hidden sm:inline">Undo</span>
                            </button>
                            <button onClick={onRedoAnnotation} disabled={!canRedo} title="Redo"
                              className="flex items-center gap-1 h-7 px-2 rounded-lg bg-[var(--surface-3)] border border-[var(--border-on-dark)] text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-[var(--text-on-dark-subtle)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-on-dark-strong)]">
                              <RotateCw className="w-3 h-3" strokeWidth={2} />
                              <span className="hidden sm:inline">Redo</span>
                            </button>
                            <button onClick={() => { onClearAnnotations(issue.currentImageIndex); setSelectedAnnGlobalIdx(null); }} disabled={!canClear} title="Clear all annotations"
                              className="flex items-center gap-1 h-7 px-2 rounded-lg bg-[var(--surface-3)] border border-[var(--border-on-dark)] text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-[var(--severity-critical)]/60 hover:text-[var(--severity-critical)] hover:border-[var(--severity-critical)]/30">
                              <X className="w-3 h-3" strokeWidth={2} />
                              <span className="hidden sm:inline">Clear</span>
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {activeTool && (
                      null
                    )}
                    {!activeTool && issue.annotations.filter(a => a.imageIndex === issue.currentImageIndex).length > 0 && (
                      null
                    )}
                  </div>

                  {/* Gallery Thumbnails */}
                  {issue.images.length > 1 && (
                    <div className="flex gap-2 flex-wrap">
                      {issue.images.map((img, imgIdx) => (
                        <button key={img.id} onClick={() => { onUpdateIssue('currentImageIndex', imgIdx); setSelectedAnnGlobalIdx(null); }}
                          className={`relative group/thumb w-20 h-14 rounded-lg border transition-all overflow-hidden ${issue.currentImageIndex === imgIdx ? 'border-[var(--brand-blue)] ring-2 ring-[var(--brand-blue)]/30' : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)]'}`}>
                          <img src={img.data} alt={img.name} className="w-full h-full object-cover" />
                          {/* All annotation types in thumbnail */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'hidden' }}>
                            {issue.annotations.filter(a => a.imageIndex === imgIdx && a.type === 'arrow' && a.endX != null && a.endY != null).map((ann, i) => (
                              <line key={i} x1={`${ann.x}%`} y1={`${ann.y}%`} x2={`${ann.endX}%`} y2={`${ann.endY}%`} stroke={ann.color ?? '#FF5C5C'} strokeWidth="1.5" />
                            ))}
                          </svg>
                          {issue.annotations.filter(a => a.imageIndex === imgIdx).map((ann, i) => {
                            if (ann.type === 'rect' && ann.w != null && ann.h != null)
                              return <div key={i} className="absolute rounded-sm pointer-events-none" style={{ left: `${ann.x}%`, top: `${ann.y}%`, width: `${ann.w}%`, height: `${ann.h}%`, border: `1px solid ${ann.color ?? '#FF5C5C'}` }} />;
                            if (ann.type === 'blur' && ann.w != null && ann.h != null)
                              return <div key={i} className="absolute backdrop-blur-sm pointer-events-none" style={{ left: `${ann.x}%`, top: `${ann.y}%`, width: `${ann.w}%`, height: `${ann.h}%`, backgroundColor: `${ann.color ?? '#4274BA'}33` }} />;
                            if (ann.type === 'number')
                              return <div key={i} className="absolute w-3 h-3 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white" style={{ left: `${ann.x}%`, top: `${ann.y}%`, backgroundColor: ann.color ?? '#4274BA', fontSize: 6 }}>{ann.numberValue ?? 1}</div>;
                            return null;
                          })}
                          <div onClick={(e) => { e.stopPropagation(); onRemoveImage(imgIdx); }}
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--surface-3)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-subtle)] hover:text-red-400 opacity-0 group-hover/thumb:opacity-100 transition-all cursor-pointer">
                            <X className="w-2.5 h-2.5" strokeWidth={2} />
                          </div>
                        </button>
                      ))}
                      {!lightboxOpen && (
                        <button onClick={() => imageUploadRef.current?.click()}
                          className="w-20 h-14 bg-[var(--surface-3)] border border-dashed border-[var(--border-medium)] rounded-lg flex items-center justify-center hover:border-[var(--brand-blue)]/40 hover:bg-[var(--brand-blue)]/[0.04] transition-colors">
                          <Plus className="w-3.5 h-3.5 text-[var(--text-faint)]" strokeWidth={2} />
                        </button>
                      )}
                    </div>
                  )}

                  {issue.images.length === 1 && !lightboxOpen && (
                    <button onClick={() => imageUploadRef.current?.click()}
                      className="w-full h-9 bg-[var(--surface-3)] border border-dashed border-[var(--border-default)] rounded-lg flex items-center justify-center gap-1.5 text-[var(--text-faint)] hover:text-[var(--text-muted)] hover:border-[var(--brand-blue)]/30 transition-colors text-xs">
                      <Plus className="w-3.5 h-3.5" strokeWidth={2} /> {t('issueCard.addAnotherImage')}
                    </button>
                  )}
                </>
                  );
                  return lightboxOpen ? createPortal(
                    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm overflow-auto" onClick={(e) => { if (e.target === e.currentTarget) setLightboxOpen(false); }}>
                      <button onClick={() => setLightboxOpen(false)} className="fixed top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-[10000]" title={t('issueCard.closeFullscreen')}>
                        <X className="w-4 h-4" strokeWidth={2} />
                      </button>
                      <div className="mx-auto max-w-7xl p-6 flex flex-col gap-3">{inner}</div>
                    </div>,
                    document.body
                  ) : inner;
                })()
              )}

            </div>
            </div>

            {/* Right: Description + rest of form */}
            <div className="flex-1 min-w-0">
              <AnimatePresence initial={false}>

                {/* Description */}
                {cardPrefs.showDescription && (
                <motion.div key="desc" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                  <div className="pb-4">
                    <label className="flex items-center gap-1.5 text-xs mb-1.5" style={{ color: 'var(--text-on-dark-subtle)' }}>
                      <FileText className="w-3 h-3" strokeWidth={2} /> {t('issueCard.description')}
                    </label>
                    <textarea
                      value={issue.description}
                      onChange={(e) => onUpdateIssue('description', e.target.value)}
                      placeholder={t('issueCard.descPlaceholder')}
                      className="w-full min-h-[80px] bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg p-3 text-sm text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] resize-none outline-none focus:border-[var(--brand-blue)]/60 transition-colors"
                    />
                  </div>
                </motion.div>
                )}

                {/* Recommendation */}
                {cardPrefs.showRecommendation && (
                <motion.div key="rec" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                  <div className="pb-4">
                    <label className="flex items-center gap-1.5 text-xs mb-2" style={{ color: 'var(--text-on-dark-subtle)' }}>
                      <CheckCircle2 className="w-3 h-3" strokeWidth={2} /> {t('issueCard.recommendation')}
                    </label>
                    <textarea
                      value={issue.recommendation}
                      onChange={(e) => onUpdateIssue('recommendation', e.target.value)}
                      placeholder={t('issueCard.recPlaceholder')}
                      className="w-full min-h-[80px] bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg p-3 text-sm text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] resize-none outline-none focus:border-[var(--brand-blue)]/60 transition-colors"
                    />
                  </div>
                </motion.div>
                )}

                {/* Visual Recommendation */}
                {cardPrefs.showVisualRec && (
                <motion.div key="visual" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                  <div className="pb-4">
                    <label className="flex items-center gap-1.5 text-xs mb-2" style={{ color: 'var(--text-on-dark-subtle)' }}>
                      <ImageIcon className="w-3 h-3" strokeWidth={2} /> {t('issueCard.visualRec')} <span style={{ color: 'var(--text-ghost)' }}>(optional)</span>
                    </label>
                    {issue.visualRecImages.length === 0 ? (
                      <button
                        onClick={() => visualRecUploadRef.current?.click()}
                        className="w-full h-24 bg-[var(--surface-3)] border border-dashed border-[var(--border-medium)] rounded-lg flex flex-col items-center justify-center gap-1.5 hover:border-[var(--brand-blue)]/40 hover:bg-[var(--brand-blue)]/[0.04] transition-colors group"
                      >
                        <ImageIcon className="w-4 h-4 text-[var(--text-faint)] group-hover:text-[var(--brand-blue)]/60 transition-colors" strokeWidth={1.5} />
                        <span className="text-xs text-[var(--text-faint)] group-hover:text-[var(--text-subtle)] transition-colors">{t('issueCard.addVisualRef')}</span>
                      </button>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {issue.visualRecImages.map((img, idx) => (
                          <div key={img.id} className="relative group">
                            <div className="w-32 h-24 border border-[var(--border-subtle)] rounded-lg overflow-hidden">
                              <img src={img.data} alt={img.name} className="w-full h-full object-cover" />
                            </div>
                            <button
                              onClick={() => onRemoveVisualRec(idx)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[var(--surface-3)]/90 border border-[var(--border-default)] flex items-center justify-center text-[var(--text-subtle)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <X className="w-3 h-3" strokeWidth={2} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => visualRecUploadRef.current?.click()}
                          className="w-32 h-24 bg-[var(--surface-3)] border border-dashed border-[var(--border-medium)] rounded-lg flex items-center justify-center hover:border-[var(--brand-blue)]/40 hover:bg-[var(--brand-blue)]/[0.04] transition-colors"
                        >
                          <Plus className="w-4 h-4 text-[var(--text-faint)]" strokeWidth={2} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
                )}

                {/* Metadata row — flex-wrap so items flow when individual ones are hidden */}
                {cardPrefs.showMetadata && (
                <motion.div key="metadata" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                  <div className="pb-4">
                  <div className="flex flex-wrap gap-2">
                  <AnimatePresence initial={false}>
                    {cardPrefs.showCategory && (
                    <motion.div key="cat" layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.18 }} className="min-w-[110px] flex-1">
                      {(() => {
                        const catOptions = ['None', ...fieldOpts.categories.map(c => c.label)];
                        const catIcons: Record<string, React.ReactNode> = {
                          None: <DynamicIcon name="Layers" className="w-3 h-3 text-[var(--text-placeholder)]" strokeWidth={2} />,
                        };
                        fieldOpts.categories.forEach(c => {
                          catIcons[c.label] = <DynamicIcon name={c.icon} className="w-3 h-3" style={{ color: c.color }} strokeWidth={2} />;
                        });
                        return (
                          <MetaSelect
                            label="Category"
                            icon={<Layers className="w-3 h-3" strokeWidth={2} />}
                            value={issue.category}
                            onChange={(v) => onUpdateIssue('category', v)}
                            options={catOptions}
                            optionIcons={catIcons}
                          />
                        );
                      })()}
                    </motion.div>
                    )}
                    {cardPrefs.showSeverity && (
                    <motion.div key="sev" layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.18 }} className="min-w-[100px] flex-1">
                      {(() => {
                        const sevOptions = ['None', ...fieldOpts.severities.map(s => s.label)];
                        const sevIcons: Record<string, React.ReactNode> = {
                          None: <DynamicIcon name="AlertCircle" className="w-3 h-3 text-[var(--text-placeholder)]" strokeWidth={2} />,
                        };
                        fieldOpts.severities.forEach(s => {
                          sevIcons[s.label] = <DynamicIcon name={s.icon} className="w-3 h-3" style={{ color: s.color }} strokeWidth={2} />;
                        });
                        return (
                          <MetaSelect
                            label="Severity"
                            icon={<AlertCircle className="w-3 h-3" strokeWidth={2} />}
                            value={issue.severity}
                            onChange={(v) => onUpdateIssue('severity', v)}
                            options={sevOptions}
                            optionIcons={sevIcons}
                          />
                        );
                      })()}
                    </motion.div>
                    )}
                    {cardPrefs.showPriority && (
                    <motion.div key="pri" layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.18 }} className="min-w-[100px] flex-1">
                      {(() => {
                        const priOptions = ['None', ...fieldOpts.priorities.map(p => p.label)];
                        const priIcons: Record<string, React.ReactNode> = {
                          None: <DynamicIcon name="Flag" className="w-3 h-3 text-[var(--text-placeholder)]" strokeWidth={2} />,
                        };
                        fieldOpts.priorities.forEach(p => {
                          priIcons[p.label] = <DynamicIcon name={p.icon} className="w-3 h-3" style={{ color: p.color }} strokeWidth={2} />;
                        });
                        return (
                          <MetaSelect
                            label="Priority"
                            icon={<Flag className="w-3 h-3" strokeWidth={2} />}
                            value={issue.priority}
                            onChange={(v) => onUpdateIssue('priority', v)}
                            options={priOptions}
                            optionIcons={priIcons}
                          />
                        );
                      })()}
                    </motion.div>
                    )}
                    {cardPrefs.showEffort && (
                    <motion.div key="eff" layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.18 }} className="min-w-[100px] flex-1">
                      {(() => {
                        const effOptions = ['None', ...fieldOpts.efforts.map(e => e.label)];
                        const effIcons: Record<string, React.ReactNode> = {
                          None: <DynamicIcon name="Zap" className="w-3 h-3 text-[var(--text-placeholder)]" strokeWidth={2} />,
                        };
                        fieldOpts.efforts.forEach(e => {
                          effIcons[e.label] = <DynamicIcon name={e.icon} className="w-3 h-3" style={{ color: e.color }} strokeWidth={2} />;
                        });
                        return (
                          <MetaSelect
                            label="Effort"
                            icon={<Zap className="w-3 h-3" strokeWidth={2} />}
                            value={issue.effort}
                            onChange={(v) => onUpdateIssue('effort', v)}
                            options={effOptions}
                            optionIcons={effIcons}
                          />
                        );
                      })()}
                    </motion.div>
                    )}
                    {cardPrefs.showStatus && (
                    <motion.div key="sta" layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.18 }} className="min-w-[110px] flex-1">
                      {(() => {
                        const staOptions = fieldOpts.statuses.map(s => s.label);
                        const staIcons: Record<string, React.ReactNode> = {};
                        fieldOpts.statuses.forEach(s => {
                          staIcons[s.label] = <DynamicIcon name={s.icon} className="w-3 h-3" style={{ color: s.color }} strokeWidth={2} />;
                        });
                        return (
                          <MetaSelect
                            label="Status"
                            icon={<Circle className="w-3 h-3" strokeWidth={2} />}
                            value={issue.status}
                            onChange={(v) => onUpdateIssue('status', v)}
                            options={staOptions}
                            optionIcons={staIcons}
                          />
                        );
                      })()}
                    </motion.div>
                    )}
                  </AnimatePresence>
                  </div>
                  </div>
                </motion.div>
                )}

                {/* Tags */}
                {cardPrefs.showTags && (
                <motion.div key="tags" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                  <div className="pb-5">
                    <label className="flex items-center gap-1.5 text-xs mb-2" style={{ color: 'var(--text-on-dark-subtle)' }}>
                      <Tag className="w-3 h-3" strokeWidth={2} /> {t('issueCard.tags')} <span className="ml-1" style={{ color: 'var(--text-ghost)' }}>(optional)</span>
                    </label>
                    <div
                      className="flex flex-wrap items-center gap-1.5 min-h-9 w-full rounded-lg px-2.5 py-1.5 cursor-text transition-colors"
                      style={{
                        background: 'var(--surface-3)',
                        border: '1px solid var(--border-on-dark)',
                      }}
                      onClick={() => {
                        const inp = document.getElementById(`tag-input-${issue.id}`);
                        if (inp) inp.focus();
                      }}
                    >
                      <AnimatePresence initial={false}>
                        {issue.tags.split(',').filter(tag => tag.trim()).map((tag, i) => (
                          <motion.span
                            key={tag.trim() + i}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.14 }}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 shrink-0"
                            style={{
                              background: 'var(--chip-surface)',
                              border: '1px solid var(--chip-border)',
                              color: 'var(--text-on-dark-muted)',
                            }}
                          >
                            <span className="text-xs leading-none">{tag.trim()}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = issue.tags.split(',').filter(tag => tag.trim()).filter((_, idx) => idx !== i);
                                onUpdateIssue('tags', updated.join(', '));
                              }}
                              className="flex items-center justify-center rounded-sm transition-opacity hover:opacity-100 opacity-50"
                              style={{ color: 'var(--text-on-dark-muted)' }}
                              aria-label={`Remove tag ${tag.trim()}`}
                            >
                              <X className="w-3 h-3" strokeWidth={2.5} />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                      <input
                        id={`tag-input-${issue.id}`}
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
                            e.preventDefault();
                            const newTag = tagInput.trim().replace(/,$/, '');
                            if (!newTag) return;
                            const existing = issue.tags.split(',').map(t => t.trim()).filter(Boolean);
                            if (!existing.includes(newTag)) {
                              onUpdateIssue('tags', [...existing, newTag].join(', '));
                            }
                            setTagInput('');
                          } else if (e.key === 'Backspace' && tagInput === '') {
                            const existing = issue.tags.split(',').map(t => t.trim()).filter(Boolean);
                            if (existing.length > 0) {
                              onUpdateIssue('tags', existing.slice(0, -1).join(', '));
                            }
                          }
                        }}
                        onBlur={() => {
                          const newTag = tagInput.trim().replace(/,$/, '');
                          if (!newTag) return;
                          const existing = issue.tags.split(',').map(t => t.trim()).filter(Boolean);
                          if (!existing.includes(newTag)) {
                            onUpdateIssue('tags', [...existing, newTag].join(', '));
                          }
                          setTagInput('');
                        }}
                        placeholder={issue.tags.split(',').filter(tag => tag.trim()).length === 0 ? t('issueCard.addTags') : ''}
                        className="flex-1 min-w-[80px] bg-transparent outline-none text-xs placeholder:text-[var(--text-placeholder)] py-0.5"
                        style={{ color: 'var(--text-on-dark)', fontWeight: 600 }}
                      />
                    </div>
                  </div>
                </motion.div>
                )}

                {/* UX Law */}
                {cardPrefs.showUxLaw && framework && framework !== 'None' && (
                <motion.div key="uxlaw" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                  <div className="pb-5">
                    <label className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--text-on-dark-subtle)' }}>
                      <BookOpen className="w-3 h-3" strokeWidth={2} /> {t('issueCard.uxLaw')} <span className="ml-1" style={{ color: 'var(--text-ghost)' }}>(optional)</span>
                    </label>
                    <p className="text-[10px] mb-2 leading-none" style={{ color: 'var(--icon-muted)' }}>
                      Only laws from the project's selected framework are shown.
                    </p>
                    {/* Autocomplete — anchor div measured for portal positioning */}
                    <div ref={uxLawAnchorRef}>
                            <div
                              className="relative flex flex-wrap items-center gap-1.5 min-h-9 w-full rounded-lg py-1.5 pl-7 pr-2.5 cursor-text transition-colors"
                              style={{
                                background: 'var(--surface-3)',
                                border: `1px solid ${uxLawOpen ? 'rgba(66,116,186,0.6)' : 'var(--border-on-dark)'}`,
                              }}
                              onClick={() => {
                                setUxLawOpen(true);
                                setTimeout(() => uxLawInputRef.current?.focus(), 0);
                              }}
                            >
                              {/* Search icon — absolutely positioned so it never shifts with pills */}
                              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 pointer-events-none shrink-0" style={{ color: 'var(--text-on-dark-subtle)' }} strokeWidth={2} />
                              <AnimatePresence initial={false}>
                                {[...new Set(issue.uxLaw.split(',').map(l => l.trim()).filter(Boolean))].map((law, i) => (
                                  <motion.span
                                    key={law}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.14 }}
                                    className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 shrink-0"
                                    style={{
                                      background: 'var(--chip-surface)',
                                      border: '1px solid var(--chip-border)',
                                      color: 'var(--text-on-dark-muted)',
                                    }}
                                  >
                                    <span className="text-xs leading-none">{law.trim()}</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const deduped = [...new Set(issue.uxLaw.split(',').map(l => l.trim()).filter(Boolean))];
                                        onUpdateIssue('uxLaw', deduped.filter(l => l !== law).join(', '));
                                      }}
                                      className="flex items-center justify-center rounded-sm transition-opacity hover:opacity-100 opacity-50"
                                      style={{ color: 'var(--text-on-dark-muted)' }}
                                      aria-label={`Remove ${law.trim()}`}
                                    >
                                      <X className="w-3 h-3" strokeWidth={2.5} />
                                    </button>
                                  </motion.span>
                                ))}
                              </AnimatePresence>
                              <input
                                ref={uxLawInputRef}
                                type="text"
                                value={uxLawQuery}
                                onChange={(e) => {
                                  setUxLawQuery(e.target.value);
                                  setUxLawActiveIdx(0);
                                  setUxLawOpen(true);
                                }}
                                onFocus={() => setUxLawOpen(true)}
                                onBlur={() => setTimeout(() => { setUxLawOpen(false); }, 200)}
                                onKeyDown={(e) => {
                                  const selected = issue.uxLaw.split(',').filter(l => l.trim());
                                  const filtered = uxLawOptions.filter(l =>
                                    !selected.includes(l) && l.toLowerCase().includes(uxLawQuery.toLowerCase())
                                  );
                                  if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    setUxLawActiveIdx(i => Math.min(i + 1, filtered.length - 1));
                                  } else if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    setUxLawActiveIdx(i => Math.max(i - 1, 0));
                                  } else if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (filtered[uxLawActiveIdx]) {
                                      const updated = [...selected, filtered[uxLawActiveIdx]];
                                      onUpdateIssue('uxLaw', updated.join(', '));
                                      setUxLawQuery('');
                                      setUxLawActiveIdx(0);
                                      setUxLawOpen(false);
                                    }
                                  } else if (e.key === 'Backspace' && uxLawQuery === '') {
                                    if (selected.length > 0) {
                                      onUpdateIssue('uxLaw', selected.slice(0, -1).join(', '));
                                    }
                                  } else if (e.key === 'Escape') {
                                    setUxLawOpen(false);
                                    setUxLawQuery('');
                                  }
                                }}
                                placeholder={issue.uxLaw.split(',').filter(l => l.trim()).length === 0 ? t('issueCard.searchUxLaws') : ''}
                                className="flex-1 min-w-[80px] bg-transparent outline-none text-xs placeholder:text-[var(--text-placeholder)] py-0.5"
                                style={{ color: 'var(--text-on-dark)', fontWeight: 600 }}
                              />
                            </div>
                          </div>
                          {/* Dropdown portaled to body — escapes all overflow:hidden ancestors */}
                          {uxLawOpen && uxLawDropdownPos && createPortal(
                            <div
                              onMouseDown={(e) => e.preventDefault()}
                              style={{
                                position: 'fixed',
                                top: uxLawDropdownPos.top,
                                left: uxLawDropdownPos.left,
                                width: uxLawDropdownPos.width,
                                zIndex: 9999,
                                background: 'var(--surface-elevated)',
                                border: '1px solid var(--border-on-dark-strong)',
                                borderRadius: '0.5rem',
                                boxShadow: 'var(--card-shadow-elevated)',
                                minHeight: '40px',
                                maxHeight: '300px',
                                overflowY: 'auto',
                                paddingTop: '4px',
                                paddingBottom: '4px',
                              }}
                            >
                              {(() => {
                                const selected = issue.uxLaw.split(',').filter(l => l.trim());
                                const filtered = uxLawOptions.filter(l =>
                                  !selected.includes(l) && l.toLowerCase().includes(uxLawQuery.toLowerCase())
                                );
                                return filtered.length === 0 ? (
                                  <p className="px-3 py-2.5 text-xs italic" style={{ color: 'var(--text-on-dark-subtle)' }}>
                                    {selected.length === uxLawOptions.length ? t('issueCard.allLawsSelected') : t('issueCard.noMatchingLaws')}
                                  </p>
                                ) : filtered.map((law, i) => (
                                  <button
                                    key={law}
                                    type="button"
                                    data-active={i === uxLawActiveIdx ? 'true' : undefined}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      const updated = [...selected, law];
                                      onUpdateIssue('uxLaw', updated.join(', '));
                                      setUxLawQuery('');
                                      setUxLawActiveIdx(0);
                                      setUxLawOpen(false);
                                    }}
                                    onMouseEnter={() => setUxLawActiveIdx(i)}
                                    className="w-full text-left px-3 py-2 text-xs transition-colors"
                                    style={{
                                      color: i === uxLawActiveIdx ? 'var(--text-on-dark)' : 'var(--text-on-dark-muted)',
                                      background: i === uxLawActiveIdx ? 'var(--brand-blue-soft)' : 'transparent',
                                    }}
                                  >
                                    <HighlightMatch text={law} query={uxLawQuery} />
                                  </button>
                                ));
                              })()}
                            </div>,
                            document.body
                          )}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* Comments Section */}
          {issue.showComments && (
            <div className="px-5 pb-5 border-t border-[var(--border-faint)] pt-5 mt-5">
              <div className="space-y-3">
                <h4 className="text-xs text-[var(--text-subtle)] font-semibold">{t('issueCard.comments')}</h4>
                {issue.comments.length === 0 ? (
                  <p className="text-xs text-[var(--text-faint)] italic">{t('issueCard.noComments')}</p>
                ) : (
                  <div className="space-y-2">
                    {issue.comments.map((comment) => (
                      <div key={comment.id} className="group/comment bg-[var(--surface-3)] border border-[var(--border-subtle)] rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs text-[var(--text-muted)] font-medium">{comment.author}</span>
                            <span className="text-[10px] text-[var(--text-faint)]">{comment.timestamp}</span>
                            {comment.edited && (
                              <span
                                className="relative group/edited text-[10px] text-[var(--text-faint)] italic cursor-default"
                              >
                                (edited)
                                {comment.editedAt && (
                                  <span className="absolute bottom-full mb-1.5 left-0 px-2 py-1 rounded-md text-[11px] whitespace-nowrap pointer-events-none opacity-0 group-hover/edited:opacity-100 transition-opacity z-50"
                                    style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-on-dark-strong)', color: 'var(--text-on-dark)', boxShadow: 'var(--card-shadow-elevated)' }}
                                  >
                                    {comment.editedAt}
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover/comment:opacity-100 transition-opacity shrink-0">
                            <button
                              onClick={() => { setEditingCommentId(comment.id); setEditCommentText(comment.text); }}
                              className="w-5 h-5 rounded flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover-medium)] transition-colors"
                              title="Edit comment"
                            >
                              <Pencil className="w-3 h-3" strokeWidth={2} />
                            </button>
                            <button
                              onClick={() => setPendingDeleteCommentId(comment.id)}
                              className="w-5 h-5 rounded flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--severity-critical)] hover:bg-[var(--severity-critical-bg)] transition-colors"
                              title="Delete comment"
                            >
                              <Trash2 className="w-3 h-3" strokeWidth={2} />
                            </button>
                          </div>
                        </div>
                        {editingCommentId === comment.id ? (
                          <div className="flex gap-2 mt-1">
                            <input
                              autoFocus
                              type="text"
                              value={editCommentText}
                              onChange={e => setEditCommentText(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' && editCommentText.trim()) {
                                  onEditComment(comment.id, editCommentText.trim());
                                  setEditingCommentId(null);
                                }
                                if (e.key === 'Escape') setEditingCommentId(null);
                              }}
                              className="flex-1 h-7 bg-[var(--surface-2)] border border-[var(--brand-blue)]/60 rounded px-2 text-xs text-[var(--text-on-dark)] outline-none"
                            />
                            <button
                              onClick={() => { if (editCommentText.trim()) { onEditComment(comment.id, editCommentText.trim()); setEditingCommentId(null); } }}
                              className="w-7 h-7 rounded bg-[var(--brand-blue)] flex items-center justify-center text-white hover:bg-[#0066CC] transition-colors disabled:opacity-50"
                              disabled={!editCommentText.trim()}
                            >
                              <Check className="w-3 h-3" strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => setEditingCommentId(null)}
                              className="w-7 h-7 rounded bg-[var(--surface-2)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text-on-dark)] transition-colors"
                            >
                              <X className="w-3 h-3" strokeWidth={2} />
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-[var(--text-on-dark)]">{comment.text}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={t('issueCard.addComment')}
                    className="flex-1 h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3 text-xs text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && commentText.trim()) {
                        onAddComment(commentText.trim());
                        setCommentText('');
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (commentText.trim()) {
                        onAddComment(commentText.trim());
                        setCommentText('');
                      }
                    }}
                    className="w-8 h-8 rounded-lg bg-[var(--brand-blue)] flex items-center justify-center text-white hover:bg-[#0066CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!commentText.trim()}
                  >
                    <Send className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Delete issue confirmation */}
      <ConfirmModal
        open={pendingDeleteIssue}
        title="Delete issue?"
        message="This issue and all its annotations will be permanently removed. This cannot be undone."
        confirmLabel="Delete issue"
        onConfirm={() => { setPendingDeleteIssue(false); onRemoveIssue(); }}
        onCancel={() => setPendingDeleteIssue(false)}
      />

      {/* Delete comment confirmation */}
      <ConfirmModal
        open={pendingDeleteCommentId !== null}
        title="Delete comment?"
        message="This comment will be permanently removed."
        confirmLabel="Delete comment"
        onConfirm={() => { if (pendingDeleteCommentId !== null) onDeleteComment(pendingDeleteCommentId); setPendingDeleteCommentId(null); }}
        onCancel={() => setPendingDeleteCommentId(null)}
      />
    </div>
  );
}

// ─── MetaSelect ──────────────────────────────────────────────────────────────

export function MetaSelect({ label, icon, value, onChange, options, optionIcons }: {
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
    setDropdownStyle({
      position: 'fixed',
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
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
    const onScroll = () => setOpen(false);
    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => document.removeEventListener('scroll', onScroll, { capture: true });
  }, [open]);

  const handleOpen = () => {
    calcPosition();
    setOpen((o) => !o);
  };

  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs mb-2" style={{ color: 'var(--text-on-dark-subtle)' }}>
        <span className="text-[var(--text-faint)]">{icon}</span> {label}
      </label>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleOpen}
          className="w-full h-9 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-2.5 text-xs text-[var(--text-on-dark)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
          style={{ fontWeight: 600 }}
        >
          {optionIcons?.[value] && <span className="shrink-0">{optionIcons[value]}</span>}
          <span className="flex-1 text-left">{value}</span>
          <ChevronDown className={`w-3 h-3 text-[var(--text-faint)] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={2} />
        </button>
        {open && createPortal(
          <div
            ref={ref}
            style={dropdownStyle}
            className="bg-[var(--surface-elevated)] border border-[var(--border-medium)] rounded-xl shadow-2xl overflow-hidden"
          >
            {options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => { onChange(o); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors font-semibold ${value === o ? 'text-[var(--text-on-dark)] bg-[rgba(66,116,186,0.32)]' : 'text-[var(--text-on-dark-subtle)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'}`}
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
