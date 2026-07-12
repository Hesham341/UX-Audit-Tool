import React from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AppUserMenu } from '../components/AppUserMenu';
import logoSrc from '../../imports/Logo.png';
import monshaat30 from '../../imports/Issue_example.png';
import { AnimatePresence, motion } from 'motion/react';
import {
  Folder, FileText, Plus, X,
  Filter, ChevronDown, ChevronRight, ArrowUpDown,
  AlertCircle, Flag, Zap, Share2, Copy, Eye, Download,
  CheckCircle2, Circle, XCircle,
  SortAsc, SortDesc, Search, Clock, Layers,
  ListChecks, MousePointerClick, Bookmark,
  Bug, Monitor, Sparkles, Network, PenTool, Pointer, BookOpen, Tag,
  ArrowRight, Pencil, MessageSquare, Send, SlidersHorizontal, Image as ImageIcon, RotateCcw, RotateCw,
  Calendar,
  Link2,
  Settings,
  UserPlus, Mail, Check, Users,
  Quote, Milestone,
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Annotation, Issue, IssueCard, IssueCardProps, CardPrefs, DEFAULT_CARD_PREFS } from '../components/shared-issue-card';
import { MultiSelectFilter } from '../components/multi-select-filter';
import { DateRangeFilter } from '../components/date-range-filter';

type SortField = 'severity' | 'priority' | 'effort' | 'none';
type SortDir = 'asc' | 'desc';

const SEVERITY_ORDER = { Critical: 4, High: 3, Medium: 2, Low: 1 };
const PRIORITY_ORDER = { High: 3, Medium: 2, Low: 1 };
const EFFORT_ORDER = { High: 3, Medium: 2, Low: 1 };

// ─── Drag-and-drop ───────────────────────────────────────────────────────────
const DRAG_TYPE = 'ISSUE_CARD';
interface DragItem { id: number; index: number }

// Shared state: which card is the current drop target and where (above/below mid)
const dragState = { overId: -1, aboveMid: false };

function DraggableIssueCard({
  filteredIndex,
  onMove,
  canDrag,
  totalCount,
  ...cardProps
}: Omit<IssueCardProps, 'dragHandleRef'> & {
  filteredIndex: number;
  onMove: (fromId: number, toId: number) => void;
  canDrag: boolean;
  totalCount: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [dropIndicator, setDropIndicator] = useState<'top' | 'bottom' | null>(null);

  const [{ isDragging }, drag, preview] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: DRAG_TYPE,
    item: () => ({ id: cardProps.issue.id, index: filteredIndex }),
    canDrag,
    collect: monitor => ({ isDragging: monitor.isDragging() }),
    end: () => { dragState.overId = -1; },
  });

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: DRAG_TYPE,
    collect: monitor => ({ isOver: monitor.isOver() }),
    hover(item: DragItem, monitor) {
      if (!wrapperRef.current) return;
      const dragIndex = item.index;
      const hoverIndex = filteredIndex;

      const rect = wrapperRef.current.getBoundingClientRect();
      const midY = (rect.bottom - rect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const cursorY = clientOffset.y - rect.top;
      const aboveMid = cursorY < midY;

      dragState.overId = cardProps.issue.id;
      dragState.aboveMid = aboveMid;

      if (dragIndex === hoverIndex) return;
      if (dragIndex < hoverIndex && aboveMid) return;
      if (dragIndex > hoverIndex && !aboveMid) return;

      onMove(item.id, cardProps.issue.id);
      item.index = hoverIndex;
    },
  });

  // Update local drop indicator
  useEffect(() => {
    if (!isOver) { setDropIndicator(null); return; }
    const id = cardProps.issue.id;
    const update = () => {
      if (dragState.overId === id) {
        setDropIndicator(dragState.aboveMid ? 'top' : 'bottom');
      }
    };
    const interval = setInterval(update, 16);
    return () => clearInterval(interval);
  }, [isOver, cardProps.issue.id]);

  drag(handleRef);
  preview(drop(wrapperRef));

  // Auto-scroll — HTML5 drag suppresses mousemove/wheel, so we intercept both
  useEffect(() => {
    if (!isDragging) return;
    let cursorY = window.innerHeight / 2;
    let animId: number;
    const TOPBAR_H = 56;
    const THRESHOLD = 150;
    const MAX_SPEED = 25;
    const onDragOver = (e: DragEvent) => { cursorY = e.clientY; };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Direct scrollTop assignment works even when window.scrollBy is suppressed during drag
      document.documentElement.scrollTop += e.deltaY * 1.2;
      document.body.scrollTop += e.deltaY * 1.2;
    };
    const tick = () => {
      const vh = window.innerHeight;
      const distFromTop = cursorY - TOPBAR_H;
      const distFromBottom = vh - cursorY;
      if (distFromTop < THRESHOLD && distFromTop >= 0) {
        const t = 1 - distFromTop / THRESHOLD;
        window.scrollBy(0, -MAX_SPEED * t * t);
      } else if (distFromBottom < THRESHOLD && distFromBottom >= 0) {
        const t = 1 - distFromBottom / THRESHOLD;
        window.scrollBy(0, MAX_SPEED * t * t);
      }
      animId = requestAnimationFrame(tick);
    };
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    animId = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener('dragover', onDragOver);
      document.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('wheel', onWheel, { capture: true });
      cancelAnimationFrame(animId);
    };
  }, [isDragging]);

  return (
    <motion.div
      ref={wrapperRef}
      layout="position"
      layoutId={`drag-card-${cardProps.issue.id}`}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: isDragging ? 0.3 : 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1], layout: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
      style={{
        position: 'relative',
        zIndex: isDragging ? 50 : undefined,
        marginBottom: '1.25rem',
      }}
    >
      {/* Drop indicator line — top */}
      {dropIndicator === 'top' && (
        <div style={{ position: 'absolute', top: -6, left: 0, right: 0, height: 2, borderRadius: 2, background: 'var(--brand-blue)', zIndex: 10, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: 0, top: -3, width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-blue)' }} />
        </div>
      )}
      <IssueCard
        {...cardProps}
        dragHandleRef={canDrag ? handleRef : undefined}
      />
      {/* Drop indicator line — bottom */}
      {dropIndicator === 'bottom' && (
        <div style={{ position: 'absolute', bottom: -6, left: 0, right: 0, height: 2, borderRadius: 2, background: 'var(--brand-blue)', zIndex: 10, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: 0, bottom: -3, width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-blue)' }} />
        </div>
      )}
    </motion.div>
  );
}


export function AuditPage({ isDemo = false }: { isDemo?: boolean }) {
  const { t } = useTranslation();
  const [framework] = useState<string>(
    () => localStorage.getItem('uxm_project_framework') ?? 'Nielsen 10 Usability Heuristics'
  );
  const [introduction, setIntroduction] = useState('This audit evaluates the usability of the Aramex mobile application, focusing on the checkout and shipment tracking flows. The review covers key interaction patterns, information architecture, and visual hierarchy across the primary user journeys.');
  const [conclusion, setConclusion] = useState('Overall, the application demonstrates solid foundational UX but has notable friction points in the checkout flow and notification system. Addressing the critical and high-severity issues identified in this audit is expected to meaningfully improve task completion rates and user satisfaction.');
  const [introCollapsed, setIntroCollapsed] = useState(false);
  const [conclusionCollapsed, setConclusionCollapsed] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'suggestion' | 'bug'>('suggestion');
  const [showFilters, setShowFilters] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [activeAnnotation, setActiveAnnotation] = useState<{ issueId: number; tool: string } | null>(null);
  const [annotationRedoStacks, setAnnotationRedoStacks] = useState<Record<number, Annotation[]>>({});
  const [clearSnapshots, setClearSnapshots] = useState<Record<number, Annotation[]>>({});
  const [shareOpen, setShareOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Viewer' | 'Editor' | 'Commenter'>('Viewer');
  const [inviteRoleOpen, setInviteRoleOpen] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  const [invitedPeople, setInvitedPeople] = useState<{ email: string; role: string; status: 'pending' | 'accepted' }[]>([
    { email: 'sarah@example.com', role: 'Editor', status: 'accepted' },
    { email: 'james@example.com', role: 'Viewer', status: 'pending' },
  ]);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortDropdownPos, setSortDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [sortField, setSortField] = useState<SortField>('none');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterEffort, setFilterEffort] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterPageNames, setFilterPageNames] = useState<string[]>([]);
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState<string | null>(null);
  const [filterDropdownPos, setFilterDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const moveIssue = useCallback((fromId: number, toId: number) => {
    setIssues(prev => {
      const fromIdx = prev.findIndex(i => i.id === fromId);
      const toIdx   = prev.findIndex(i => i.id === toId);
      if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  }, []);

  const [cardPrefs, setCardPrefs] = useState<CardPrefs>(() => {
    try {
      const showIntro = localStorage.getItem('uxm_show_introduction');
      const showConc  = localStorage.getItem('uxm_show_conclusion');
      return {
        ...DEFAULT_CARD_PREFS,
        showIntroduction: showIntro === null ? true : showIntro === 'true',
        showConclusion:   showConc  === null ? true : showConc  === 'true',
      };
    } catch { return DEFAULT_CARD_PREFS; }
  });
  // Track whether intro/conclusion are truly out of layout (applied after animation completes)
  const [introInLayout, setIntroInLayout] = useState(cardPrefs.showIntroduction);
  const [conclusionInLayout, setConclusionInLayout] = useState(cardPrefs.showConclusion);
  useEffect(() => { if (cardPrefs.showIntroduction) setIntroInLayout(true); }, [cardPrefs.showIntroduction]);
  useEffect(() => { if (cardPrefs.showConclusion) setConclusionInLayout(true); }, [cardPrefs.showConclusion]);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [customizePos, setCustomizePos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const customizeRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const [issues, setIssues] = useState<Issue[]>([
    {
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
    },
    {
      // Scenario: has image + visual recommendation
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
        {
          id: 'dashboard-error-1',
          data: monshaat30,
          name: 'dashboard-error-state.png',
          originalData: monshaat30,
          objectPosition: 'center',
        },
      ],
      currentImageIndex: 0,
      annotations: [],
      visualRecImages: [
        {
          id: 'visual-rec-1',
          name: 'error-state-recommendation.png',
          data: monshaat30,
          storagePath: null,
        },
      ],
      collapsed: false,
      comments: [],
      showComments: false,
      bookmarked: false,
    },
    {
      // Scenario: no image, no visual rec (minimal fields only)
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
      // Scenario: fully resolved, all fields, with image
      id: 4,
      issueTitle: 'Search Bar Not Accessible via Keyboard',
      pageName: 'Search Results',
      pageUrl: 'https://example.com/search',
      dateTaken: '2026-05-15',
      description: 'The main search bar cannot be reached or activated using keyboard navigation alone. Users relying on keyboard or screen readers are unable to perform searches.',
      recommendation: 'Ensure the search input has a visible focus state, is reachable via Tab, and that pressing Enter submits the query. Add an aria-label for screen reader support.',
      uxLaw: 'Accessibility (WCAG 2.1 – 2.1.1 Keyboard)',
      tags: 'accessibility, keyboard, search',
      category: 'Usability',
      severity: 'High',
      priority: 'High',
      effort: 'Low',
      status: 'Resolved',
      author: 'You',
      images: [
        {
          id: 'search-a11y-1',
          data: monshaat30,
          name: 'search-keyboard-issue.png',
          originalData: monshaat30,
          objectPosition: 'top',
        },
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
  ]);

  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('uxm_audit_introduction', introduction);
        localStorage.setItem('uxm_audit_conclusion', conclusion);
      } catch {}
      setLastSaved(new Date());
    }, 2000);
    return () => clearTimeout(timer);
  }, [issues, introduction, conclusion]);

  // Persist intro/conclusion visibility prefs
  useEffect(() => {
    try {
      localStorage.setItem('uxm_show_introduction', String(cardPrefs.showIntroduction));
      localStorage.setItem('uxm_show_conclusion',   String(cardPrefs.showConclusion));
    } catch {}
  }, [cardPrefs.showIntroduction, cardPrefs.showConclusion]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) setShareOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node) && !(e.target as Element).closest?.('[data-sort-portal]')) setSortOpen(false);
      if (customizeRef.current && !customizeRef.current.contains(e.target as Node)) setCustomizeOpen(false);
      if (filterRef.current && !filterRef.current.contains(e.target as Node) && !(e.target as Element).closest?.('[data-filter-portal]')) setFilterDropdownOpen(null);
    };
    const onScroll = () => setFilterDropdownOpen(null);
    document.addEventListener('mousedown', handler);
    document.addEventListener('scroll', onScroll, true);
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('scroll', onScroll, true); };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to add new issue
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        addIssue();
      }
      // Escape to clear active annotation
      if (e.key === 'Escape' && activeAnnotation) {
        setActiveAnnotation(null);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [activeAnnotation]);

  const addIssue = () => {
    setIssues([
      ...issues,
      {
        id: Date.now(),
        issueTitle: '',
        pageName: '',
        pageUrl: '',
        dateTaken: new Date().toISOString().split('T')[0],
        description: '',
        recommendation: '',
        uxLaw: '',
        tags: '',
        category: 'None',
        severity: 'None',
        priority: 'None',
        effort: 'None',
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
    ]);
  };

  const addImageToIssue = (issueId: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setIssues(issues.map((issue) =>
        issue.id === issueId
          ? {
              ...issue,
              images: [...issue.images, {
                id: `img-${Date.now()}`,
                data: imageData,
                originalData: imageData,
                name: file.name
              }]
            }
          : issue
      ));
    };
    reader.readAsDataURL(file);
  };

  const removeImageFromIssue = (issueId: number, imgIndex: number) => {
    setIssues(issues.map((issue) => {
      if (issue.id !== issueId) return issue;
      const newImages = issue.images.filter((_, i) => i !== imgIndex);
      return {
        ...issue,
        images: newImages,
        currentImageIndex: Math.min(issue.currentImageIndex, Math.max(0, newImages.length - 1)),
      };
    }));
  };

  const navigateImage = (issueId: number, direction: 'prev' | 'next') => {
    setIssues(issues.map((issue) => {
      if (issue.id === issueId) {
        const newIndex =
          direction === 'prev'
            ? Math.max(0, issue.currentImageIndex - 1)
            : Math.min(issue.images.length - 1, issue.currentImageIndex + 1);
        return { ...issue, currentImageIndex: newIndex };
      }
      return issue;
    }));
  };

  const addVisualRecImage = (issueId: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setIssues(issues.map((issue) =>
        issue.id === issueId
          ? {
              ...issue,
              visualRecImages: [...issue.visualRecImages, {
                id: `visual-${Date.now()}`,
                data: imageData,
                name: file.name
              }]
            }
          : issue
      ));
    };
    reader.readAsDataURL(file);
  };

  const removeVisualRecImage = (issueId: number, imageIndex: number) => {
    setIssues(issues.map((issue) =>
      issue.id === issueId
        ? { ...issue, visualRecImages: issue.visualRecImages.filter((_, idx) => idx !== imageIndex) }
        : issue
    ));
  };

  const removeIssue = (id: number) => {
    setIssues(issues.filter((issue) => issue.id !== id));
  };

  const duplicateIssue = (id: number) => {
    const source = issues.find((i) => i.id === id);
    if (!source) return;
    const idx = issues.findIndex((i) => i.id === id);
    const clone = { ...source, id: Date.now(), issueTitle: source.issueTitle + ' (Copy)', comments: [], showComments: false };
    const next = [...issues];
    next.splice(idx + 1, 0, clone);
    setIssues(next);
  };

  const addComment = (issueId: number, text: string) => {
    setIssues(issues.map((issue) =>
      issue.id === issueId
        ? {
            ...issue,
            comments: [
              ...issue.comments,
              {
                id: Date.now(),
                author: 'You',
                text,
                timestamp: new Date().toLocaleString(),
              },
            ],
          }
        : issue
    ));
  };

  const toggleComments = (issueId: number) => {
    setIssues(issues.map((issue) =>
      issue.id === issueId ? { ...issue, showComments: !issue.showComments } : issue
    ));
  };

  const toggleBookmark = (issueId: number) => {
    setIssues(issues.map((issue) =>
      issue.id === issueId ? { ...issue, bookmarked: !issue.bookmarked } : issue
    ));
  };

  const updateIssue = (id: number, field: keyof Issue, value: string | boolean | number | Annotation[]) => {
    setIssues(issues.map((issue) => (issue.id === id ? { ...issue, [field]: value } : issue)));
  };

  const toggleCollapse = (id: number) => {
    setIssues(issues.map((issue) => (issue.id === id ? { ...issue, collapsed: !issue.collapsed } : issue)));
  };

  const setAnnotationTool = (issueId: number, tool: string) => {
    setActiveAnnotation((prev) =>
      prev?.issueId === issueId && prev?.tool === tool ? null : { issueId, tool }
    );
  };

  const addAnnotationToIssue = (issueId: number, ann: Annotation) => {
    setIssues(issues.map((issue) =>
      issue.id === issueId
        ? { ...issue, annotations: [...issue.annotations, ann] }
        : issue
    ));
    setAnnotationRedoStacks(s => ({ ...s, [issueId]: [] }));
  };

  const replaceImageInIssue = (issueId: number, imgIdx: number, newData: string) => {
    setIssues(issues.map((issue) =>
      issue.id === issueId
        ? { ...issue, images: issue.images.map((img, i) => i === imgIdx ? { ...img, data: newData } : img) }
        : issue
    ));
  };

  const restoreOriginalImage = (issueId: number, imgIdx: number) => {
    setIssues(issues.map((issue) =>
      issue.id === issueId
        ? { ...issue, images: issue.images.map((img, i) => i === imgIdx ? { ...img, data: img.originalData } : img) }
        : issue
    ));
  };

  const undoLastAnnotation = (issueId: number) => {
    setIssues(prev => prev.map((issue) => {
      if (issue.id !== issueId) return issue;
      const currentImg = issue.images[issue.currentImageIndex];
      if (currentImg && currentImg.data !== currentImg.originalData) {
        return { ...issue, images: issue.images.map((img, i) => i === issue.currentImageIndex ? { ...img, data: img.originalData } : img) };
      }
      if (issue.annotations.length > 0) {
        const removed = issue.annotations[issue.annotations.length - 1];
        setAnnotationRedoStacks(s => ({ ...s, [issueId]: [...(s[issueId] ?? []), removed] }));
        return { ...issue, annotations: issue.annotations.slice(0, -1) };
      }
      // Restore from a clear snapshot if available
      const snapshot = clearSnapshots[issueId];
      if (snapshot && snapshot.length > 0) {
        setClearSnapshots(s => { const n = { ...s }; delete n[issueId]; return n; });
        return { ...issue, annotations: snapshot };
      }
      return issue;
    }));
  };

  const redoLastAnnotation = (issueId: number) => {
    const stack = annotationRedoStacks[issueId] ?? [];
    if (stack.length === 0) return;
    const ann = stack[stack.length - 1];
    setAnnotationRedoStacks(s => ({ ...s, [issueId]: s[issueId].slice(0, -1) }));
    setIssues(prev => prev.map(issue =>
      issue.id === issueId ? { ...issue, annotations: [...issue.annotations, ann] } : issue
    ));
  };

  const clearAnnotationsForImage = (issueId: number, imageIndex: number) => {
    // Save current annotations so Clear can be undone
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
      const currentAnns = issue.annotations.filter(a => a.imageIndex === imageIndex);
      if (currentAnns.length > 0) {
        setClearSnapshots(s => ({ ...s, [issueId]: currentAnns }));
      }
    }
    setAnnotationRedoStacks(s => ({ ...s, [issueId]: [] }));
    setIssues(issues.map((iss) =>
      iss.id === issueId
        ? {
            ...iss,
            annotations: iss.annotations.filter(a => a.imageIndex !== imageIndex),
            images: iss.images.map((img, i) => i === imageIndex ? { ...img, data: img.originalData } : img),
          }
        : iss
    ));
  };

  const handleCopy = (text: string, label: string) => {
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopyFeedback(label);
      setTimeout(() => setCopyFeedback(''), 2000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopyFeedback(label);
        setTimeout(() => setCopyFeedback(''), 2000);
      }).catch(fallback);
    } else {
      fallback();
    }
    setShareOpen(false);
  };

  const handleInviteSend = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inviteEmail.trim()) {
      setInviteError('Please enter an email address.');
      return;
    }
    if (!emailRegex.test(inviteEmail.trim())) {
      setInviteError('Please enter a valid email address.');
      return;
    }
    if (invitedPeople.some(p => p.email.toLowerCase() === inviteEmail.trim().toLowerCase())) {
      setInviteError('This person has already been invited.');
      return;
    }
    setInvitedPeople(prev => [...prev, { email: inviteEmail.trim(), role: inviteRole, status: 'pending' }]);
    setInviteEmail('');
    setInviteError('');
    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 2500);
  };

  const handleSort = (field: SortField, dir: SortDir) => {
    setSortField(field);
    setSortDir(dir);
    setSortOpen(false);
  };

  const sortLabel = sortField === 'none'
    ? t('audit.sort.sortBy')
    : `${t(`audit.sort.${sortField}`)} (${sortDir === 'desc' ? t('audit.sort.highToLow') : t('audit.sort.lowToHigh')})`;

  // Close sort/filter/customize dropdowns on any scroll (use document capture to catch inner overflow-scroll containers)
  useEffect(() => {
    const close = () => { setSortOpen(false); setFilterDropdownOpen(null); setCustomizeOpen(false); };
    document.addEventListener('scroll', close, { capture: true });
    return () => document.removeEventListener('scroll', close, { capture: true });
  }, []);

  // Count issues by filter type
  const severityCounts = {
    None: issues.filter(i => i.severity === 'None').length,
    Critical: issues.filter(i => i.severity === 'Critical').length,
    High: issues.filter(i => i.severity === 'High').length,
    Medium: issues.filter(i => i.severity === 'Medium').length,
    Low: issues.filter(i => i.severity === 'Low').length,
  };

  const priorityCounts = {
    None: issues.filter(i => i.priority === 'None').length,
    High: issues.filter(i => i.priority === 'High').length,
    Medium: issues.filter(i => i.priority === 'Medium').length,
    Low: issues.filter(i => i.priority === 'Low').length,
  };

  const effortCounts = {
    None: issues.filter(i => i.effort === 'None').length,
    High: issues.filter(i => i.effort === 'High').length,
    Medium: issues.filter(i => i.effort === 'Medium').length,
    Low: issues.filter(i => i.effort === 'Low').length,
  };

  const statusCounts = {
    'Not Resolved': issues.filter(i => i.status === 'Not Resolved').length,
    'In Progress': issues.filter(i => i.status === 'In Progress').length,
    Resolved: issues.filter(i => i.status === 'Resolved').length,
    'Not an issue': issues.filter(i => i.status === 'Not an issue').length,
  };

  const categoryCounts = {
    None: issues.filter(i => i.category === 'None').length,
    Usability: issues.filter(i => i.category === 'Usability').length,
    Bug: issues.filter(i => i.category === 'Bug').length,
    'User Interface': issues.filter(i => i.category === 'User Interface').length,
    Feature: issues.filter(i => i.category === 'Feature').length,
    Content: issues.filter(i => i.category === 'Content').length,
    'Info Architecture': issues.filter(i => i.category === 'Info Architecture').length,
    'Info Design': issues.filter(i => i.category === 'Info Design').length,
  };

  // Derived option lists for multi-select filters — update automatically as issues change
  const uniquePageNames = useMemo(() => {
    const names = issues.map((i) => i.pageName).filter(Boolean);
    return [...new Set(names)].sort();
  }, [issues]);

  const uniqueTags = useMemo(() => {
    const tags = issues.flatMap((i) =>
      i.tags.split(',').map((t) => t.trim()).filter(Boolean)
    );
    return [...new Set(tags)].sort();
  }, [issues]);

  // Filter + sort
  const filteredIssues = issues
    .filter((i) => {
      if (showBookmarkedOnly && !i.bookmarked) return false;
      if (filterSeverity !== 'All' && i.severity !== filterSeverity) return false;
      if (filterCategory !== 'All' && i.category !== filterCategory) return false;
      if (filterPriority !== 'All' && i.priority !== filterPriority) return false;
      if (filterEffort !== 'All' && i.effort !== filterEffort) return false;
      if (filterStatus !== 'All' && i.status !== filterStatus) return false;
      if (filterTags.length > 0 && !filterTags.some((t) => i.tags.toLowerCase().includes(t.toLowerCase()))) return false;
      if (filterPageNames.length > 0 && !filterPageNames.includes(i.pageName)) return false;
      if (filterDateFrom && i.dateTaken && i.dateTaken < filterDateFrom) return false;
      if (filterDateTo && i.dateTaken && i.dateTaken > filterDateTo) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortField === 'none') return 0;
      let aVal = 0, bVal = 0;
      if (sortField === 'severity') { aVal = SEVERITY_ORDER[a.severity as keyof typeof SEVERITY_ORDER] ?? 0; bVal = SEVERITY_ORDER[b.severity as keyof typeof SEVERITY_ORDER] ?? 0; }
      if (sortField === 'priority') { aVal = PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] ?? 0; bVal = PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER] ?? 0; }
      if (sortField === 'effort') { aVal = EFFORT_ORDER[a.effort as keyof typeof EFFORT_ORDER] ?? 0; bVal = EFFORT_ORDER[b.effort as keyof typeof EFFORT_ORDER] ?? 0; }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const totalIssues = issues.length;
  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;
  const criticalCount = issues.filter((i) => i.severity === 'Critical').length;
  const bookmarkedCount = issues.filter((i) => i.bookmarked).length;

  return (
    <div className="min-h-screen bg-[var(--surface-base)] flex flex-col">
      {/* Demo banner */}
      {isDemo && (
        <div className="sticky top-0 z-50 flex items-center justify-between gap-4 px-5 py-2.5 bg-[var(--brand-blue)] border-b border-white/20">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
              <Pencil className="w-3 h-3 text-white" strokeWidth={2.5} />
            </div>
            <p className="text-sm text-[var(--text-on-dark)] truncate">
              <span style={{ fontWeight: 600 }}>{t('audit.demoLabel')}</span>
              <span className="text-[var(--text-muted)] ml-2 hidden sm:inline">{t('audit.demoNote')}</span>
            </p>
          </div>
          <Link
            to="/login"
            className="shrink-0 inline-flex items-center gap-1.5 h-7 px-3 rounded-lg bg-[var(--brand-blue)] text-white text-xs no-underline hover:bg-[var(--brand-blue-hover)] transition-colors"
            style={{ fontWeight: 600 }}
          >
            {t('audit.signUpFree')}
            <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
          </Link>
        </div>
      )}
      {/* Top bar */}
      <div className="h-14 flex items-center gap-4 px-6 border-b border-[var(--border-faint)] bg-[var(--surface-1)] sticky top-0 z-30">
        <Link to="/app/projects" className="flex items-center gap-3 pr-5 border-r border-[var(--border-on-dark)] h-full shrink-0 no-underline">
          <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0">
            <img src={logoSrc} alt="UX Mosaic" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm text-[var(--text-on-dark)]">UX Mosaic</span>
        </Link>

        {/* Breadcrumb */}
        <Link
          to="/app/projects"
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[var(--surface-3)] border border-[var(--border-default)] text-xs text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)] transition-colors no-underline shrink-0"
        >
          <Folder className="w-3.5 h-3.5" strokeWidth={1.8} />
          {t('audit.projects')}
        </Link>
        <span className="text-[var(--text-placeholder)] text-sm">/</span>
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[var(--brand-blue)]" strokeWidth={1.8} />
          <span className="text-[13px] text-[var(--text-on-dark)]">{t('audit.myFirstAudit')}</span>
          
        </div>

        <div className="flex-1" />

        {/* Stats pills */}
        <div className="hidden lg:flex items-center gap-1.5">
          
          
        </div>

        {/* Client view — standalone next to Share */}
        <Link
          to="/app/client-view"
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs shrink-0 no-underline transition-colors hover:text-[var(--text-on-dark)]"
          style={{ background: 'var(--surface-hover-medium)', border: '1px solid var(--border-on-dark-strong)', color: 'var(--text-on-dark-subtle)' }}
        >
          <Eye className="w-3.5 h-3.5" strokeWidth={1.8} />
          {t('audit.share_menu.clientView')}
        </Link>

        {/* Share button */}
        <div className="relative" ref={shareRef}>
          <button
            onClick={() => setShareOpen(!shareOpen)}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[var(--brand-blue)] text-xs text-white shrink-0 hover:bg-[var(--brand-blue-hover)] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" strokeWidth={1.8} />
            {t('audit.share')}
            <ChevronDown className={`w-3 h-3 transition-transform ${shareOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
          </button>
          {shareOpen && (
            <div className="absolute right-0 top-10 w-56 bg-[var(--surface-elevated)] border border-[var(--border-medium)] rounded-xl shadow-2xl overflow-hidden z-50" style={{ boxShadow: 'var(--card-shadow-elevated)' }}>
              
              <button
                onClick={() => { setShareOpen(false); setInviteOpen(true); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-[var(--text-on-dark)] hover:bg-[var(--surface-hover-medium)] text-left transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5 text-[var(--brand-blue)]" strokeWidth={1.8} />
                <span className="flex-1">Invite people</span>
                <span className="text-[10px] text-[var(--text-faint)] bg-[var(--surface-3)] rounded px-1.5 py-0.5">{invitedPeople.length}</span>
              </button>
              <div className="border-t border-[var(--border-faint)]" />
              <button
                onClick={() => handleCopy('https://uxmosaic.app/audit/my-first-audit', 'URL copied!')}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-[var(--text-muted)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)] text-left transition-colors"
              >
                <Copy className="w-3.5 h-3.5" strokeWidth={1.8} />
                {t('audit.share_menu.copyUrl')}
              </button>
              <button
                onClick={() => handleCopy('https://uxmosaic.app/audit/my-first-audit?severity=Critical&status=Not+Resolved', 'URL copied!')}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-[var(--text-muted)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)] text-left transition-colors"
              >
                <Filter className="w-3.5 h-3.5" strokeWidth={1.8} />
                {t('audit.share_menu.copyWithFilters')}
              </button>
              <button
                onClick={() => {
                  const severityColor: Record<string, string> = {
                    Critical: '#FF5C5C', High: '#FF8D3A', Medium: '#E8B84B', Low: '#6BA4DC', None: '#8FA1AB'
                  };
                  const statusColor: Record<string, string> = {
                    'Not Resolved': '#FF5C5C', 'In Progress': '#E8B84B', Resolved: '#ACD8AB', 'Not an issue': '#8FA1AB'
                  };
                  const rows = filteredIssues.map((iss, idx) => `
                    <div class="issue">
                      <div class="issue-header">
                        <span class="issue-num">${idx + 1}</span>
                        <span class="issue-title">${iss.issueTitle || 'Untitled issue'}</span>
                        <span class="badge" style="background:${severityColor[iss.severity] ?? '#8FA1AB'}22;color:${severityColor[iss.severity] ?? '#8FA1AB'};border:1px solid ${severityColor[iss.severity] ?? '#8FA1AB'}44">${iss.severity}</span>
                        <span class="badge" style="background:${statusColor[iss.status] ?? '#8FA1AB'}22;color:${statusColor[iss.status] ?? '#8FA1AB'};border:1px solid ${statusColor[iss.status] ?? '#8FA1AB'}44">${iss.status}</span>
                      </div>
                      <div class="meta-row">
                        ${iss.pageName ? `<span class="meta">📄 ${iss.pageName}</span>` : ''}
                        ${iss.dateTaken ? `<span class="meta">📅 ${iss.dateTaken.includes('-') ? iss.dateTaken.split('-').reverse().join('/') : iss.dateTaken}</span>` : ''}
                        ${iss.category !== 'None' ? `<span class="meta">🏷 ${iss.category}</span>` : ''}
                        ${iss.priority !== 'None' ? `<span class="meta">🚩 Priority: ${iss.priority}</span>` : ''}
                        ${iss.effort !== 'None' ? `<span class="meta">⚡ Effort: ${iss.effort}</span>` : ''}
                      </div>
                      ${iss.images.length > 0 ? `<img src="${iss.images[0].data}" class="issue-img" />` : ''}
                      ${iss.description ? `<p class="label">Description</p><p class="body">${iss.description}</p>` : ''}
                      ${iss.recommendation ? `<p class="label">Recommendation</p><p class="body">${iss.recommendation}</p>` : ''}
                      ${iss.uxLaw ? `<p class="label">UX Law</p><p class="body">${iss.uxLaw}</p>` : ''}
                      ${iss.tags ? `<p class="label">Tags</p><p class="body">${iss.tags}</p>` : ''}
                    </div>`).join('');
                  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>UX Audit Report</title>
                    <style>
                      *{box-sizing:border-box;margin:0;padding:0}
                      body{font-family:'Segoe UI',system-ui,sans-serif;font-size:13px;color:#1a1a2e;background:#fff;padding:40px}
                      h1{font-size:24px;font-weight:700;margin-bottom:4px}
                      .sub{color:#666;font-size:13px;margin-bottom:32px}
                      .section-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#888;margin-bottom:6px;margin-top:28px}
                      .intro-text{font-size:13px;color:#333;line-height:1.6;margin-bottom:8px}
                      .issue{border:1px solid #e5e7eb;border-radius:10px;padding:18px 20px;margin-bottom:16px;page-break-inside:avoid}
                      .issue-header{display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap}
                      .issue-num{width:22px;height:22px;border-radius:50%;border:1.5px solid #4274BA;color:#4274BA;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
                      .issue-title{font-size:14px;font-weight:700;flex:1}
                      .badge{font-size:10px;font-weight:600;padding:2px 8px;border-radius:99px}
                      .meta-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px}
                      .meta{font-size:11px;color:#555}
                      .issue-img{width:100%;max-height:260px;object-fit:cover;border-radius:6px;margin-bottom:12px;border:1px solid #e5e7eb}
                      .label{font-size:11px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:.06em;margin-top:10px;margin-bottom:2px}
                      .body{font-size:13px;color:#333;line-height:1.6}
                      @media print{body{padding:24px}@page{margin:16mm}}
                    </style></head><body>
                    <h1>UX Audit Report</h1>
                    <p class="sub">Exported ${new Date().toLocaleDateString('en-GB', { day:'numeric',month:'long',year:'numeric' })} · ${filteredIssues.length} issue${filteredIssues.length !== 1 ? 's' : ''}</p>
                    ${introduction ? `<p class="section-label">Introduction</p><p class="intro-text">${introduction}</p>` : ''}
                    <p class="section-label">Issues</p>
                    ${rows}
                    ${conclusion ? `<p class="section-label">Conclusion</p><p class="intro-text">${conclusion}</p>` : ''}
                  </body></html>`;
                  const w = window.open('', '_blank');
                  if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 400); }
                  setShareOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-[var(--text-muted)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)] text-left transition-colors"
              >
                <Download className="w-3.5 h-3.5" strokeWidth={1.8} />
                {t('audit.share_menu.exportPdf')}
              </button>
            </div>
          )}
        </div>

        {/* User menu */}
        <AppUserMenu />
      </div>

      <AnimatePresence>
        {copyFeedback && (
          <motion.div
            key="copy-toast"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 bg-[var(--surface-elevated)] border border-[var(--brand-blue)]/40 rounded-lg text-sm text-[var(--text-on-dark)] shadow-xl z-50"
          >
            <CheckCircle2 className="w-4 h-4 text-[var(--brand-blue)]" strokeWidth={2} />
            {copyFeedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* Filter & Sort Card */}
          <div className="bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl overflow-hidden" style={{ boxShadow: 'var(--card-shadow-default)' }}>
            <div className="px-5 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs transition-colors ${showFilters ? 'bg-[var(--brand-blue)]/15 border-[var(--brand-blue)]/40 text-[var(--brand-blue)]' : 'bg-[var(--surface-3)] border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)]'}`}
                >
                  <Filter className="w-3.5 h-3.5" strokeWidth={1.8} />
                  {t('audit.filters')}
                  {(filterSeverity !== 'All' || filterCategory !== 'All' || filterPriority !== 'All' || filterEffort !== 'All' || filterStatus !== 'All' || filterTags.length > 0 || filterPageNames.length > 0 || filterDateFrom || filterDateTo) && (
                    <span className="w-4 h-4 rounded-full bg-[var(--brand-blue)] text-white text-[10px] flex items-center justify-center ml-0.5">
                      {[filterSeverity, filterCategory, filterPriority, filterEffort, filterStatus].filter(v => v !== 'All').length + (filterTags.length > 0 ? 1 : 0) + (filterPageNames.length > 0 ? 1 : 0) + (filterDateFrom || filterDateTo ? 1 : 0)}
                    </span>
                  )}
                  <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} strokeWidth={2} />
                </button>

                {/* Sort by */}
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
                          className="w-56 bg-[var(--surface-elevated)] border border-[var(--border-medium)] rounded-xl shadow-2xl overflow-hidden"
                        >
                          {(['severity', 'priority', 'effort'] as SortField[]).map((f, fi) => (
                            <div key={f}>
                              {fi > 0 && <div className="h-px bg-[var(--border-faint)] mx-3" />}
                              {(['desc', 'asc'] as SortDir[]).map((dir) => {
                                const isActive = sortField === f && sortDir === dir;
                                return (
                                  <button
                                    key={dir}
                                    onClick={() => handleSort(f, dir)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${isActive ? 'text-[var(--brand-blue)] bg-[var(--brand-blue)]/10' : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'}`}
                                  >
                                    <span className="flex items-center gap-2">
                                      {f === 'severity' && <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} />}
                                      {f === 'priority' && <Flag className="w-3.5 h-3.5" strokeWidth={2} />}
                                      {f === 'effort' && <Zap className="w-3.5 h-3.5" strokeWidth={2} />}
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
                              <button
                                onClick={() => { setSortField('none'); setSortOpen(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
                              >
                                <X className="w-3 h-3" strokeWidth={2} />
                                {t('audit.sort.clearSort')}
                              </button>
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>,
                    document.body
                  )}
                </div>

                {/* Bookmarked Issues */}
                <button
                  onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
                  className={`flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs transition-colors ${
                    showBookmarkedOnly
                      ? 'bg-[var(--brand-blue)]/15 border-[var(--brand-blue)]/40 text-[var(--brand-blue)]'
                      : 'bg-[var(--surface-3)] border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} fill={showBookmarkedOnly ? 'currentColor' : 'none'} />
                  {t('audit.bookmarked')}
                  <span className="text-[10px] opacity-60 tabular-nums ml-0.5">({bookmarkedCount})</span>
                </button>

                {/* Active filter chips */}
                {filterSeverity !== 'All' && (
                  null
                )}
                {filterStatus !== 'All' && (
                  <span className="flex items-center gap-1 h-6 px-2 rounded-md bg-[var(--brand-blue)]/15 border border-[var(--brand-blue)]/25 text-[11px] text-[var(--brand-blue)]">
                    {filterStatus}
                    <button onClick={() => setFilterStatus('All')}><X className="w-3 h-3" strokeWidth={2} /></button>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Customize card */}
                <div className="relative" ref={customizeRef}>
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
                    {t('audit.cardFields')}
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
                          {/* Header */}
                          <div className="px-4 py-3 border-b border-[var(--border-faint)] flex items-center justify-between">
                            <div>
                              <p className="text-xs text-[var(--text-on-dark)]">{t('audit.cardFields')}</p>
                              <p className="text-[11px] text-[var(--text-faint)] mt-0.5">{t('audit.cardFieldsHint')}</p>
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

                          {/* Field toggles */}
                          <div className="py-1.5">
                            {([
                              [{ key: 'showIntroduction', label: t('audit.introduction'), icon: <Quote className="w-3.5 h-3.5" strokeWidth={1.8} /> }],
                              [
                                { key: 'showPage',           label: t('issueCard.pageName'),           icon: <MousePointerClick className="w-3.5 h-3.5" strokeWidth={1.8} /> },
                                { key: 'showDate',           label: t('issueCard.showDate'),           icon: <Calendar className="w-3.5 h-3.5" strokeWidth={1.8} /> },
                                { key: 'showLink',           label: t('issueCard.showLink'),           icon: <Link2 className="w-3.5 h-3.5" strokeWidth={1.8} /> },
                                { key: 'showDescription',    label: t('issueCard.showDescription'),    icon: <FileText className="w-3.5 h-3.5" strokeWidth={1.8} /> },
                                { key: 'showRecommendation', label: t('issueCard.showRecommendation'), icon: <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.8} /> },
                                { key: 'showVisualRec',      label: t('issueCard.showVisualRec'),      icon: <ImageIcon className="w-3.5 h-3.5" strokeWidth={1.8} /> },
                                { key: 'showMetadata',       label: t('issueCard.showMetadata'),       icon: <ListChecks className="w-3.5 h-3.5" strokeWidth={1.8} /> },
                                { key: 'showTags',    label: t('issueCard.showTags'),    icon: <Tag className="w-3.5 h-3.5" strokeWidth={1.8} /> },
                                { key: 'showUxLaw',   label: t('issueCard.showUxLaw'),   icon: <BookOpen className="w-3.5 h-3.5" strokeWidth={1.8} />, disabled: !framework || framework === 'None' },
                              ],
                              [{ key: 'showConclusion', label: t('audit.conclusion'), icon: <Milestone className="w-3.5 h-3.5" strokeWidth={1.8} /> }],
                            ] as { key: keyof CardPrefs; label: string; icon: React.ReactNode; disabled?: boolean }[][]).map((group, gi) => (
                              <React.Fragment key={gi}>
                                {gi > 0 && <div className="mx-4 my-1" style={{ height: '1px', background: 'var(--border-on-dark)' }} />}
                                {group.map(({ key, label, icon, disabled }) => {
                              const enabled = cardPrefs[key];
                              return (
                                <React.Fragment key={key}>
                                  <button
                                    onClick={() => { if (!disabled) setCardPrefs(p => ({ ...p, [key]: !p[key] })); }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${disabled ? 'cursor-default opacity-50' : 'hover:bg-[var(--surface-hover)]'}`}
                                  >
                                    <span className={`shrink-0 transition-colors ${disabled ? 'text-[var(--text-ghost)]' : enabled ? 'text-[var(--text-subtle)]' : 'text-[var(--text-ghost)]'}`}>
                                      {icon}
                                    </span>
                                    <span className={`flex-1 text-left text-xs transition-colors ${disabled ? 'text-[var(--text-faint)] line-through' : enabled ? 'text-[var(--text-on-dark-subtle)]' : 'text-[var(--text-faint)] line-through'}`}>
                                      {label}
                                    </span>
                                    {disabled ? (
                                      <span
                                        title="Select a UX framework when creating a project to enable this field"
                                        className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[var(--text-on-dark-subtle)] border border-[var(--border-on-dark-strong)] bg-[var(--surface-3)] text-[9px] cursor-help"
                                        style={{ fontStyle: 'italic', fontWeight: 600 }}
                                      >
                                        i
                                      </span>
                                    ) : (
                                    <span className={`relative shrink-0 w-9 h-5 rounded-full transition-colors duration-200 ${enabled ? 'bg-[var(--brand-blue)]' : 'bg-[var(--toggle-track-off)]'}`}>
                                      <span
                                        className="absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                                        style={{ transform: `translateX(${enabled ? '16px' : '0px'})` }}
                                      />
                                    </span>
                                    )}
                                  </button>

                                  {/* Metadata sub-fields — only show when Metadata row is visible */}
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
                                            {([
                                              { key: 'showCategory', label: t('issueCard.showCategory'), icon: <Layers className="w-3 h-3" strokeWidth={1.8} /> },
                                              { key: 'showSeverity', label: t('issueCard.showSeverity'), icon: <AlertCircle className="w-3 h-3" strokeWidth={1.8} /> },
                                              { key: 'showPriority', label: t('issueCard.showPriority'), icon: <Flag className="w-3 h-3" strokeWidth={1.8} /> },
                                              { key: 'showEffort',   label: t('issueCard.showEffort'),   icon: <Zap className="w-3 h-3" strokeWidth={1.8} /> },
                                              { key: 'showStatus',   label: t('issueCard.showStatus'),   icon: <Circle className="w-3 h-3" strokeWidth={1.8} /> },
                                            ] as { key: keyof CardPrefs; label: string; icon: React.ReactNode }[]).map(({ key: subKey, label: subLabel, icon: subIcon }) => {
                                              const subEnabled = cardPrefs[subKey];
                                              return (
                                                <button
                                                  key={subKey}
                                                  onClick={() => setCardPrefs(p => ({ ...p, [subKey]: !p[subKey] }))}
                                                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
                                                >
                                                  <span className={`shrink-0 transition-colors ${subEnabled ? 'text-[var(--text-subtle)]' : 'text-[var(--text-ghost)]'}`}>
                                                    {subIcon}
                                                  </span>
                                                  <span className={`flex-1 text-left text-[11px] transition-colors ${subEnabled ? 'text-[var(--text-on-dark-subtle)]' : 'text-[var(--text-faint)] line-through'}`}>
                                                    {subLabel}
                                                  </span>
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
                              </React.Fragment>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>,
                    document.body
                  )}
                </div>
              </div>
            </div>

            <AnimatePresence initial={false}>
            {showFilters && (
              <motion.div
                key="filters"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                style={{ overflow: 'hidden' }}
              >
              <div className="px-5 pb-4 pt-3 border-t border-[var(--border-faint)] flex flex-col gap-3" ref={filterRef}>
                {/* Row 1: 5 dropdowns */}
                <div className="flex gap-3">
                  {/* Category */}
                  <div className="flex-1 min-w-0">
                    <label className="flex items-center gap-1.5 text-xs text-[var(--text-on-dark-subtle)] mb-1.5"><Layers className="w-3 h-3" strokeWidth={2} />Category</label>
                    <div className="relative">
                      <button
                        onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setFilterDropdownPos({ top: r.bottom + 4, left: r.left }); setFilterDropdownOpen(filterDropdownOpen === 'category' ? null : 'category'); }}
                        className="w-full h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-md px-2 text-xs text-[var(--text-on-dark)] outline-none flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1.5 min-w-0 truncate">
                          {filterCategory === 'All'              && <Layers className="w-3 h-3 text-[var(--text-faint)] shrink-0" strokeWidth={2} />}
                          {filterCategory === 'None'             && <Layers className="w-3 h-3 text-[var(--text-placeholder)] shrink-0" strokeWidth={2} />}
                          {filterCategory === 'Usability'        && <Pointer className="w-3 h-3 shrink-0" style={{ color: '#C0375A' }} strokeWidth={2} />}
                          {filterCategory === 'Bug'              && <Bug className="w-3 h-3 shrink-0" style={{ color: '#D95C4A' }} strokeWidth={2} />}
                          {filterCategory === 'User Interface'   && <Monitor className="w-3 h-3 shrink-0" style={{ color: '#D97B3A' }} strokeWidth={2} />}
                          {filterCategory === 'Feature'          && <Sparkles className="w-3 h-3 shrink-0" style={{ color: '#3AA68A' }} strokeWidth={2} />}
                          {filterCategory === 'Content'          && <FileText className="w-3 h-3 shrink-0" style={{ color: '#3A9EB5' }} strokeWidth={2} />}
                          {filterCategory === 'Info Architecture' && <Network className="w-3 h-3 shrink-0" style={{ color: '#3A5CA6' }} strokeWidth={2} />}
                          {filterCategory === 'Info Design'      && <PenTool className="w-3 h-3 shrink-0" style={{ color: '#7B5EA6' }} strokeWidth={2} />}
                          <span className="truncate">{filterCategory}</span>
                        </span>
                        <ChevronDown className="w-3 h-3 shrink-0" strokeWidth={2} />
                      </button>
                      {filterDropdownOpen === 'category' && createPortal(
                        <div data-filter-portal style={{ position: 'fixed', top: filterDropdownPos.top, left: filterDropdownPos.left, zIndex: 9999 }} className="w-52 bg-[var(--surface-elevated)] border border-[var(--border-medium)] rounded-xl shadow-2xl overflow-hidden">
                          {[
                            { opt: 'All',              icon: <Layers className="w-3 h-3 text-[var(--text-faint)]" strokeWidth={2} /> },
                            { opt: 'None',             icon: <Layers className="w-3 h-3 text-[var(--text-placeholder)]" strokeWidth={2} /> },
                            { opt: 'Usability',        icon: <Pointer className="w-3 h-3" style={{ color: '#C0375A' }} strokeWidth={2} /> },
                            { opt: 'Bug',              icon: <Bug className="w-3 h-3" style={{ color: '#D95C4A' }} strokeWidth={2} /> },
                            { opt: 'User Interface',   icon: <Monitor className="w-3 h-3" style={{ color: '#D97B3A' }} strokeWidth={2} /> },
                            { opt: 'Feature',          icon: <Sparkles className="w-3 h-3" style={{ color: '#3AA68A' }} strokeWidth={2} /> },
                            { opt: 'Content',          icon: <FileText className="w-3 h-3" style={{ color: '#3A9EB5' }} strokeWidth={2} /> },
                            { opt: 'Info Architecture', icon: <Network className="w-3 h-3" style={{ color: '#3A5CA6' }} strokeWidth={2} /> },
                            { opt: 'Info Design',      icon: <PenTool className="w-3 h-3" style={{ color: '#7B5EA6' }} strokeWidth={2} /> },
                          ].map(({ opt, icon }) => (
                            <button key={opt} onClick={() => { setFilterCategory(opt); setFilterDropdownOpen(null); }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors font-semibold ${filterCategory === opt ? 'text-[var(--text-on-dark)] bg-[rgba(66,116,186,0.32)]' : 'text-[var(--text-on-dark-subtle)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'}`}>
                              <span className="flex items-center gap-2">{icon}<span>{opt}</span></span>
                              {opt !== 'All' && <span className="text-[var(--text-faint)]">({categoryCounts[opt as keyof typeof categoryCounts] ?? 0})</span>}
                            </button>
                          ))}
                        </div>, document.body
                      )}
                    </div>
                  </div>

                  {/* Severity */}
                  <div className="flex-1 min-w-0">
                    <label className="flex items-center gap-1.5 text-xs text-[var(--text-on-dark-subtle)] mb-1.5">
                      <AlertCircle className="w-3 h-3" strokeWidth={2} />
                      Severity
                    </label>
                    <div className="relative">
                      <button
                        onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setFilterDropdownPos({ top: r.bottom + 4, left: r.left }); setFilterDropdownOpen(filterDropdownOpen === 'severity' ? null : 'severity'); }}
                        className="w-full h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-md px-2 text-xs text-[var(--text-on-dark)] outline-none flex items-center gap-1.5 justify-between"
                      >
                        <span className="flex items-center gap-1.5 min-w-0 truncate">
                          {filterSeverity === 'All' && <AlertCircle className="w-3 h-3 text-[var(--text-faint)] shrink-0" strokeWidth={2} />}
                          {filterSeverity === 'None' && <AlertCircle className="w-3 h-3 text-[var(--text-placeholder)] shrink-0" strokeWidth={2} />}
                          {filterSeverity === 'Low' && <AlertCircle className="w-3 h-3 text-[var(--severity-low)] shrink-0" strokeWidth={2} />}
                          {filterSeverity === 'Medium' && <AlertCircle className="w-3 h-3 text-[var(--severity-medium)] shrink-0" strokeWidth={2} />}
                          {filterSeverity === 'High' && <AlertCircle className="w-3 h-3 text-[var(--severity-serious)] shrink-0" strokeWidth={2} />}
                          {filterSeverity === 'Critical' && <AlertCircle className="w-3 h-3 text-[var(--severity-critical)] shrink-0" strokeWidth={2} />}
                          <span className="truncate">{filterSeverity}</span>
                        </span>
                        <ChevronDown className="w-3 h-3 shrink-0" strokeWidth={2} />
                      </button>
                      {filterDropdownOpen === 'severity' && createPortal(
                        <div data-filter-portal style={{ position: 'fixed', top: filterDropdownPos.top, left: filterDropdownPos.left, zIndex: 9999 }} className="w-48 bg-[var(--surface-elevated)] border border-[var(--border-medium)] rounded-xl shadow-2xl overflow-hidden">
                          {[
                            { opt: 'All',      icon: <AlertCircle className="w-3 h-3 text-[var(--text-faint)]" strokeWidth={2} /> },
                            { opt: 'None',     icon: <AlertCircle className="w-3 h-3 text-[var(--text-placeholder)]" strokeWidth={2} /> },
                            { opt: 'Low',      icon: <AlertCircle className="w-3 h-3 text-[var(--severity-low)]" strokeWidth={2} /> },
                            { opt: 'Medium',   icon: <AlertCircle className="w-3 h-3 text-[var(--severity-medium)]" strokeWidth={2} /> },
                            { opt: 'High',     icon: <AlertCircle className="w-3 h-3 text-[var(--severity-serious)]" strokeWidth={2} /> },
                            { opt: 'Critical', icon: <AlertCircle className="w-3 h-3 text-[var(--severity-critical)]" strokeWidth={2} /> },
                          ].map(({ opt, icon }) => (
                            <button key={opt} onClick={() => { setFilterSeverity(opt); setFilterDropdownOpen(null); }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors font-semibold ${filterSeverity === opt ? 'text-[var(--text-on-dark)] bg-[rgba(66,116,186,0.32)]' : 'text-[var(--text-on-dark-subtle)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'}`}>
                              <span className="flex items-center gap-2">{icon}<span>{opt}</span></span>
                              {opt !== 'All' && <span className="text-[var(--text-faint)]">({severityCounts[opt as keyof typeof severityCounts] ?? 0})</span>}
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
                        className="w-full h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-md px-2 text-xs text-[var(--text-on-dark)] outline-none flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1.5 min-w-0 truncate">
                          {filterPriority === 'All'    && <Flag className="w-3 h-3 text-[var(--text-faint)] shrink-0" strokeWidth={2} />}
                          {filterPriority === 'None'   && <Flag className="w-3 h-3 text-[var(--text-placeholder)] shrink-0" strokeWidth={2} />}
                          {filterPriority === 'Low'    && <Flag className="w-3 h-3 text-[var(--severity-low)] shrink-0" strokeWidth={2} />}
                          {filterPriority === 'Medium' && <Flag className="w-3 h-3 text-[var(--severity-medium)] shrink-0" strokeWidth={2} />}
                          {filterPriority === 'High'   && <Flag className="w-3 h-3 text-[var(--severity-critical)] shrink-0" strokeWidth={2} />}
                          <span className="truncate">{filterPriority}</span>
                        </span>
                        <ChevronDown className="w-3 h-3 shrink-0" strokeWidth={2} />
                      </button>
                      {filterDropdownOpen === 'priority' && createPortal(
                        <div data-filter-portal style={{ position: 'fixed', top: filterDropdownPos.top, left: filterDropdownPos.left, zIndex: 9999 }} className="w-44 bg-[var(--surface-elevated)] border border-[var(--border-medium)] rounded-xl shadow-2xl overflow-hidden">
                          {[
                            { opt: 'All',    icon: <Flag className="w-3 h-3 text-[var(--text-faint)]" strokeWidth={2} /> },
                            { opt: 'None',   icon: <Flag className="w-3 h-3 text-[var(--text-placeholder)]" strokeWidth={2} /> },
                            { opt: 'Low',    icon: <Flag className="w-3 h-3 text-[var(--severity-low)]" strokeWidth={2} /> },
                            { opt: 'Medium', icon: <Flag className="w-3 h-3 text-[var(--severity-medium)]" strokeWidth={2} /> },
                            { opt: 'High',   icon: <Flag className="w-3 h-3 text-[var(--severity-critical)]" strokeWidth={2} /> },
                          ].map(({ opt, icon }) => (
                            <button key={opt} onClick={() => { setFilterPriority(opt); setFilterDropdownOpen(null); }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors font-semibold ${filterPriority === opt ? 'text-[var(--text-on-dark)] bg-[rgba(66,116,186,0.32)]' : 'text-[var(--text-on-dark-subtle)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'}`}>
                              <span className="flex items-center gap-2">{icon}<span>{opt}</span></span>
                              {opt !== 'All' && <span className="text-[var(--text-faint)]">({priorityCounts[opt as keyof typeof priorityCounts] ?? 0})</span>}
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
                        className="w-full h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-md px-2 text-xs text-[var(--text-on-dark)] outline-none flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1.5 min-w-0 truncate">
                          {filterEffort === 'All'    && <Zap className="w-3 h-3 text-[var(--text-faint)] shrink-0" strokeWidth={2} />}
                          {filterEffort === 'None'   && <Zap className="w-3 h-3 text-[var(--text-placeholder)] shrink-0" strokeWidth={2} />}
                          {filterEffort === 'Low'    && <Zap className="w-3 h-3 text-[var(--severity-low)] shrink-0" strokeWidth={2} />}
                          {filterEffort === 'Medium' && <Zap className="w-3 h-3 text-[var(--severity-medium)] shrink-0" strokeWidth={2} />}
                          {filterEffort === 'High'   && <Zap className="w-3 h-3 text-[var(--severity-critical)] shrink-0" strokeWidth={2} />}
                          <span className="truncate">{filterEffort}</span>
                        </span>
                        <ChevronDown className="w-3 h-3 shrink-0" strokeWidth={2} />
                      </button>
                      {filterDropdownOpen === 'effort' && createPortal(
                        <div data-filter-portal style={{ position: 'fixed', top: filterDropdownPos.top, left: filterDropdownPos.left, zIndex: 9999 }} className="w-44 bg-[var(--surface-elevated)] border border-[var(--border-medium)] rounded-xl shadow-2xl overflow-hidden">
                          {[
                            { opt: 'All',    icon: <Zap className="w-3 h-3 text-[var(--text-faint)]" strokeWidth={2} /> },
                            { opt: 'None',   icon: <Zap className="w-3 h-3 text-[var(--text-placeholder)]" strokeWidth={2} /> },
                            { opt: 'Low',    icon: <Zap className="w-3 h-3 text-[var(--severity-low)]" strokeWidth={2} /> },
                            { opt: 'Medium', icon: <Zap className="w-3 h-3 text-[var(--severity-medium)]" strokeWidth={2} /> },
                            { opt: 'High',   icon: <Zap className="w-3 h-3 text-[var(--severity-critical)]" strokeWidth={2} /> },
                          ].map(({ opt, icon }) => (
                            <button key={opt} onClick={() => { setFilterEffort(opt); setFilterDropdownOpen(null); }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors font-semibold ${filterEffort === opt ? 'text-[var(--text-on-dark)] bg-[rgba(66,116,186,0.32)]' : 'text-[var(--text-on-dark-subtle)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'}`}>
                              <span className="flex items-center gap-2">{icon}<span>{opt}</span></span>
                              {opt !== 'All' && <span className="text-[var(--text-faint)]">({effortCounts[opt as keyof typeof effortCounts] ?? 0})</span>}
                            </button>
                          ))}
                        </div>, document.body
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex-1 min-w-0">
                    <label className="flex items-center gap-1.5 text-xs text-[var(--text-on-dark-subtle)] mb-1.5"><CheckCircle2 className="w-3 h-3" strokeWidth={2} />Status</label>
                    <div className="relative">
                      <button
                        onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setFilterDropdownPos({ top: r.bottom + 4, left: r.left }); setFilterDropdownOpen(filterDropdownOpen === 'status' ? null : 'status'); }}
                        className="w-full h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-md px-2 text-xs text-[var(--text-on-dark)] outline-none flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1.5 min-w-0 truncate">
                          {filterStatus === 'All'           && <Circle className="w-3 h-3 text-[var(--text-faint)] shrink-0" strokeWidth={2} />}
                          {filterStatus === 'Not Resolved'  && <Circle className="w-3 h-3 text-[var(--severity-critical)] shrink-0" strokeWidth={2} />}
                          {filterStatus === 'In Progress'   && <Clock className="w-3 h-3 text-[var(--severity-medium)] shrink-0" strokeWidth={2} />}
                          {filterStatus === 'Resolved'      && <CheckCircle2 className="w-3 h-3 text-[var(--brand-green)] shrink-0" strokeWidth={2} />}
                          {filterStatus === 'Not an issue'  && <XCircle className="w-3 h-3 text-[var(--text-faint)] shrink-0" strokeWidth={2} />}
                          <span className="truncate">{filterStatus}</span>
                        </span>
                        <ChevronDown className="w-3 h-3 shrink-0" strokeWidth={2} />
                      </button>
                      {filterDropdownOpen === 'status' && createPortal(
                        <div data-filter-portal style={{ position: 'fixed', top: filterDropdownPos.top, left: filterDropdownPos.left, zIndex: 9999 }} className="w-52 bg-[var(--surface-elevated)] border border-[var(--border-medium)] rounded-xl shadow-2xl overflow-hidden">
                          {[
                            { opt: 'All',           icon: <Circle className="w-3 h-3 text-[var(--text-faint)]" strokeWidth={2} /> },
                            { opt: 'Not Resolved',  icon: <Circle className="w-3 h-3 text-[var(--severity-critical)]" strokeWidth={2} /> },
                            { opt: 'In Progress',   icon: <Clock className="w-3 h-3 text-[var(--severity-medium)]" strokeWidth={2} /> },
                            { opt: 'Resolved',      icon: <CheckCircle2 className="w-3 h-3 text-[var(--brand-green)]" strokeWidth={2} /> },
                            { opt: 'Not an issue',  icon: <XCircle className="w-3 h-3 text-[var(--text-faint)]" strokeWidth={2} /> },
                          ].map(({ opt, icon }) => (
                            <button key={opt} onClick={() => { setFilterStatus(opt); setFilterDropdownOpen(null); }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors font-semibold ${filterStatus === opt ? 'text-[var(--text-on-dark)] bg-[rgba(66,116,186,0.32)]' : 'text-[var(--text-on-dark-subtle)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'}`}>
                              <span className="flex items-center gap-2">{icon}<span>{opt}</span></span>
                              {opt !== 'All' && <span className="text-[var(--text-faint)]">({statusCounts[opt as keyof typeof statusCounts] ?? 0})</span>}
                            </button>
                          ))}
                        </div>, document.body
                      )}
                    </div>
                  </div>
                </div>
                {/* Row 2: Page Name + Tags + Date */}
                <div className="flex gap-3 flex-wrap">
                  <div className="flex-1 min-w-[140px]">
                    <label className="flex items-center gap-1.5 text-xs text-[var(--text-on-dark-subtle)] mb-1.5">
                      <MousePointerClick className="w-3 h-3" strokeWidth={2} />
                      Page Name
                    </label>
                    <MultiSelectFilter
                      options={uniquePageNames}
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
                      options={uniqueTags}
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
                        <button
                          onClick={() => { setFilterDateFrom(''); setFilterDateTo(''); }}
                          className="ml-auto text-[10px] text-[var(--brand-blue)] hover:text-[var(--brand-blue-hover)] transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </label>
                    <DateRangeFilter
                      dateFrom={filterDateFrom}
                      dateTo={filterDateTo}
                      onChange={(from, to) => {
                        setFilterDateFrom(from);
                        setFilterDateTo(to);
                      }}
                    />
                  </div>
                </div>
              </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>

          {/* Introduction */}
          <motion.div
            initial={false}
            animate={{
              height: cardPrefs.showIntroduction ? 'auto' : 0,
              opacity: cardPrefs.showIntroduction ? 1 : 0,
              marginTop: cardPrefs.showIntroduction ? '1.25rem' : 0,
            }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden', display: introInLayout ? undefined : 'none' }}
            onAnimationComplete={() => { if (!cardPrefs.showIntroduction) setIntroInLayout(false); }}
          >
          <div className="bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl overflow-hidden" style={{ boxShadow: 'var(--card-shadow-default)' }}>
            <div className="px-5 py-3 border-b border-[var(--border-faint)] bg-[var(--surface-1)] flex items-center gap-2">
              <button
                onClick={() => setIntroCollapsed(!introCollapsed)}
                className="flex items-center text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
              >
                {introCollapsed ? <ChevronRight className="w-4 h-4" strokeWidth={2} /> : <ChevronDown className="w-4 h-4" strokeWidth={2} />}
              </button>
              <Quote className="w-3.5 h-3.5 text-[var(--text-subtle)]" strokeWidth={1.8} />
              <h3 className="text-sm text-[var(--text-on-dark)]">{t('audit.introduction')}</h3>
            </div>
            <AnimatePresence initial={false}>
              {!introCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="p-5">
                    <textarea
                      value={introduction}
                      onChange={(e) => setIntroduction(e.target.value)}
                      placeholder="Provide context for your audit. What interface are you reviewing? What are the goals and scope?"
                      className="w-full min-h-[90px] bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg p-3 text-sm text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] resize-none outline-none focus:border-[var(--brand-blue)]/60 transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </motion.div>
          {/* Separator: intro → issues */}
          <motion.div
            initial={false}
            animate={{
              opacity: cardPrefs.showIntroduction ? 1 : 0,
              height: cardPrefs.showIntroduction ? 1 : 0,
              marginTop: 0,
            }}
            transition={{ duration: 0.25 }}
            style={{ background: 'var(--border-on-dark)', display: introInLayout ? undefined : 'none' }}
          />

          {/* Issues */}
          <AnimatePresence mode="sync" initial={false}>
          {filteredIssues.length === 0 && issues.length === 0 ? (
            <motion.div key="empty-all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--brand-blue)]/10 flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-[var(--brand-blue)]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg text-[var(--text-on-dark)] mb-2">{t('audit.noIssuesTitle')}</h3>
              <p className="text-sm text-[var(--text-faint)] mb-5 max-w-md">{t('audit.noIssuesDesc')}</p>
              <button
                onClick={addIssue}
                className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[var(--brand-blue)] text-white text-sm hover:bg-[#0066CC] transition-colors"
              >
                <Plus className="w-4 h-4" strokeWidth={2} />
                Add your first issue
              </button>
              <p className="text-xs text-[var(--text-faint)] mt-4">{t('audit.addIssueHint')}</p>
            </motion.div>
          ) : filteredIssues.length === 0 ? (
            <motion.div key="empty-filter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="w-8 h-8 text-[var(--text-ghost)] mb-3" strokeWidth={1.5} />
              <p className="text-sm text-[var(--text-faint)] mb-1">{t('audit.noFilterResults')}</p>
              <p className="text-xs text-[var(--text-placeholder)] mb-4">{showBookmarkedOnly ? t('audit.noFilterResultsHint_bookmark') : t('audit.noFilterResultsHint_filter')}</p>
              <button
                onClick={() => {
                  setShowBookmarkedOnly(false);
                  setFilterSeverity('All');
                  setFilterCategory('All');
                  setFilterPriority('All');
                  setFilterEffort('All');
                  setFilterStatus('All');
                  setFilterTags([]);
                  setFilterPageNames([]);
                  setFilterDateFrom('');
                  setFilterDateTo('');
                }}
                className="text-xs text-[var(--brand-blue)] hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <motion.div key="cards-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <AnimatePresence initial={false}>
              {filteredIssues.map((issue, filteredIndex) => (
                <DraggableIssueCard
                  key={issue.id}
                  issue={issue}
                  index={issues.findIndex((i) => i.id === issue.id)}
                  filteredIndex={filteredIndex}
                  activeAnnotation={activeAnnotation}
                  activeMenu={activeMenu}
                  cardPrefs={cardPrefs}
                  canDrag={sortField === 'none'}
                  totalCount={filteredIssues.length}
                  onMove={moveIssue}
                  onToggleCollapse={() => toggleCollapse(issue.id)}
                  onSetAnnotation={(tool) => setAnnotationTool(issue.id, tool)}
                  onAddImage={(file) => addImageToIssue(issue.id, file)}
                  onRemoveImage={(imgIdx) => removeImageFromIssue(issue.id, imgIdx)}
                  onNavigateImage={(dir) => navigateImage(issue.id, dir)}
                  onAddVisualRec={(file) => addVisualRecImage(issue.id, file)}
                  onRemoveVisualRec={(idx) => removeVisualRecImage(issue.id, idx)}
                  onRemoveIssue={() => removeIssue(issue.id)}
                  onDuplicateIssue={() => duplicateIssue(issue.id)}
                  onToggleMenu={() => setActiveMenu(activeMenu === issue.id ? null : issue.id)}
                  onCloseMenu={() => setActiveMenu(null)}
                  onUpdateIssue={(field, value) => updateIssue(issue.id, field, value)}
                  onToggleComments={() => toggleComments(issue.id)}
                  onAddComment={(text) => addComment(issue.id, text)}
                  onDeleteComment={(commentId) => setIssues(prev => prev.map(iss => iss.id === issue.id ? { ...iss, comments: iss.comments.filter(c => c.id !== commentId) } : iss))}
                  onEditComment={(commentId, newText) => setIssues(prev => prev.map(iss => iss.id === issue.id ? { ...iss, comments: iss.comments.map(c => c.id === commentId ? { ...c, text: newText, edited: true, editedAt: new Date().toLocaleString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) } : c) } : iss))}
                  onAddAnnotation={(ann) => addAnnotationToIssue(issue.id, ann)}
                  onUndoAnnotation={() => undoLastAnnotation(issue.id)}
                  onRedoAnnotation={() => redoLastAnnotation(issue.id)}
                  canRedo={(annotationRedoStacks[issue.id]?.length ?? 0) > 0}
                  canUndo={
                    issue.annotations.length > 0 ||
                    issue.images.some(img => img.data !== img.originalData) ||
                    (clearSnapshots[issue.id]?.length ?? 0) > 0
                  }
                  onClearAnnotations={(imageIndex) => clearAnnotationsForImage(issue.id, imageIndex)}
                  onReplaceImage={(imgIdx, newData) => replaceImageInIssue(issue.id, imgIdx, newData)}
                  onToggleBookmark={() => toggleBookmark(issue.id)}
                  framework={framework}
                />
              ))}
              </AnimatePresence>
            </motion.div>
          )}
          </AnimatePresence>

          {/* Add New Issue */}
          <button
            onClick={addIssue}
            className="w-full h-14 bg-[var(--surface-2)] border border-dashed border-[var(--border-medium)] rounded-xl flex items-center justify-center gap-2 text-[var(--text-faint)] hover:text-[var(--text-muted)] hover:border-[var(--brand-blue)]/40 hover:bg-[var(--brand-blue)]/[0.04] transition-colors group"
          >
            <div className="w-6 h-6 rounded-md bg-[var(--surface-hover)] group-hover:bg-[var(--brand-blue)]/15 flex items-center justify-center transition-colors">
              <Plus className="w-3.5 h-3.5 group-hover:text-[var(--brand-blue)] transition-colors" strokeWidth={2} />
            </div>
            <span className="text-sm">{t('audit.addIssue')}</span>
          </button>

          {/* Separator: issues → conclusion */}
          <motion.div
            initial={false}
            animate={{
              opacity: cardPrefs.showConclusion ? 1 : 0,
              height: cardPrefs.showConclusion ? 1 : 0,
              marginTop: 0,
            }}
            transition={{ duration: 0.25 }}
            style={{ background: 'var(--border-on-dark)', display: conclusionInLayout ? undefined : 'none' }}
          />

          {/* Conclusion */}
          <motion.div
            initial={false}
            animate={{
              height: cardPrefs.showConclusion ? 'auto' : 0,
              opacity: cardPrefs.showConclusion ? 1 : 0,
              marginTop: cardPrefs.showConclusion ? '1.25rem' : 0,
            }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            onAnimationComplete={() => { if (!cardPrefs.showConclusion) setConclusionInLayout(false); }}
            style={{ overflow: 'hidden', display: conclusionInLayout ? undefined : 'none' }}
          >
          <div className="bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl overflow-hidden" style={{ boxShadow: 'var(--card-shadow-default)' }}>
            <div className="px-5 py-3 border-b border-[var(--border-faint)] bg-[var(--surface-1)] flex items-center gap-2">
              <button
                onClick={() => setConclusionCollapsed(!conclusionCollapsed)}
                className="flex items-center text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
              >
                {conclusionCollapsed ? <ChevronRight className="w-4 h-4" strokeWidth={2} /> : <ChevronDown className="w-4 h-4" strokeWidth={2} />}
              </button>
              <Milestone className="w-3.5 h-3.5 text-[var(--text-subtle)]" strokeWidth={1.8} />
              <h3 className="text-sm text-[var(--text-on-dark)]">{t('audit.conclusion')}</h3>
            </div>
            <AnimatePresence initial={false}>
              {!conclusionCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="p-5">
                    <textarea
                      value={conclusion}
                      onChange={(e) => setConclusion(e.target.value)}
                      placeholder="Summarize key findings, patterns observed, and overall recommendations..."
                      className="w-full min-h-[90px] bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg p-3 text-sm text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] resize-none outline-none focus:border-[var(--brand-blue)]/60 transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </motion.div>
        </div>
      </div>

      {/* Invite modal */}
      <AnimatePresence>
        {inviteOpen && (
          <>
            <motion.div
              key="invite-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/50 z-[100]"
              onClick={() => { setInviteOpen(false); setInviteEmail(''); setInviteError(''); setInviteRoleOpen(false); setInviteSent(false); }}
            />
            <motion.div
              key="invite-modal"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-[440px] bg-[var(--surface-elevated)] border border-[var(--border-medium)] rounded-2xl shadow-2xl"
              style={{ boxShadow: 'var(--card-shadow-elevated)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[var(--border-faint)] rounded-t-2xl overflow-hidden">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[rgba(66,116,186,0.15)] flex items-center justify-center">
                    <Users className="w-4 h-4 text-[var(--brand-blue)]" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-on-dark)] font-semibold leading-tight">Invite people</p>
                    <p className="text-[11px] text-[var(--text-faint)] leading-tight mt-0.5">Share this audit with your team</p>
                  </div>
                </div>
                <button
                  onClick={() => { setInviteOpen(false); setInviteEmail(''); setInviteError(''); setInviteRoleOpen(false); setInviteSent(false); }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover-medium)] transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>

              {/* Email input row */}
              <div className="px-5 pt-4 pb-3">
                <label className="flex items-center gap-1.5 text-[11px] text-[var(--text-on-dark-subtle)] mb-2">
                  <Mail className="w-3 h-3" strokeWidth={2} />
                  Email address
                </label>
                <div className="flex gap-2">
                  {/* Email field */}
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => { setInviteEmail(e.target.value); setInviteError(''); }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleInviteSend();
                        }
                      }}
                      placeholder="name@company.com"
                      className="w-full h-9 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3 text-xs text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors"
                      style={inviteError ? { borderColor: 'rgba(192,55,90,0.6)' } : {}}
                      autoFocus
                    />
                  </div>
                  {/* Role selector */}
                  <div className="relative">
                    <button
                      onClick={() => setInviteRoleOpen(!inviteRoleOpen)}
                      className="h-9 px-2.5 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg text-xs text-[var(--text-on-dark)] flex items-center gap-1.5 whitespace-nowrap hover:border-[var(--border-hover)] transition-colors"
                    >
                      {inviteRole}
                      <ChevronDown className={`w-3 h-3 text-[var(--text-faint)] transition-transform ${inviteRoleOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
                    </button>
                    {inviteRoleOpen && (
                      <div className="absolute right-0 top-10 w-36 bg-[var(--surface-elevated)] border border-[var(--border-medium)] rounded-xl shadow-2xl overflow-hidden z-10">
                        {(['Editor', 'Commenter', 'Viewer'] as const).map((role) => (
                          <button
                            key={role}
                            onClick={() => { setInviteRole(role); setInviteRoleOpen(false); }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${inviteRole === role ? 'bg-[rgba(66,116,186,0.18)] text-[var(--text-on-dark)]' : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)]'}`}
                          >
                            <span>{role}</span>
                            {inviteRole === role && <Check className="w-3 h-3 text-[var(--brand-blue)]" strokeWidth={2.5} />}
                          </button>
                        ))}
                        <div className="border-t border-[var(--border-faint)] mt-1 pt-1 px-3 pb-2">
                          <p className="text-[10px] text-[var(--text-faint)] leading-relaxed">
                            <span className="font-semibold text-[var(--text-muted)]">Editor</span> — can edit issues<br />
                            <span className="font-semibold text-[var(--text-muted)]">Commenter</span> — can add comments<br />
                            <span className="font-semibold text-[var(--text-muted)]">Viewer</span> — read only
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Send button */}
                  <button
                    onClick={handleInviteSend}
                    className="h-9 px-3 rounded-lg bg-[var(--brand-blue)] text-xs text-white flex items-center gap-1.5 hover:bg-[var(--brand-blue-hover)] transition-colors shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" strokeWidth={1.8} />
                    Send
                  </button>
                </div>
                {inviteError && (
                  <p className="mt-1.5 text-[11px] text-[#C0375A]">{inviteError}</p>
                )}
                {inviteSent && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 text-[11px] text-[var(--brand-green)] flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
                    Invite sent!
                  </motion.p>
                )}
              </div>

              {/* People list */}
              {invitedPeople.length > 0 && (
                <div className="px-5 pb-5">
                  <p className="text-[11px] text-[var(--text-faint)] mb-2.5 flex items-center gap-1.5">
                    <Users className="w-3 h-3" strokeWidth={2} />
                    {invitedPeople.length} {invitedPeople.length === 1 ? 'person' : 'people'} with access
                  </p>
                  <div className="flex flex-col gap-1">
                    {invitedPeople.map((person, i) => (
                      <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[var(--surface-3)] border border-[var(--border-faint)]">
                        {/* Avatar */}
                        <div className="w-7 h-7 rounded-full bg-[rgba(66,116,186,0.2)] flex items-center justify-center shrink-0">
                          <span className="text-[11px] font-semibold text-[var(--brand-blue)]">
                            {person.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[var(--text-on-dark)] truncate">{person.email}</p>
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-md"
                            style={{
                              background: person.status === 'accepted' ? 'rgba(76,190,130,0.15)' : 'rgba(232,184,75,0.15)',
                              color: person.status === 'accepted' ? '#4CBE82' : '#E8B84B',
                            }}
                          >
                            {person.status === 'accepted' ? 'Accepted' : 'Pending'}
                          </span>
                        </div>
                        <span className="text-[11px] text-[var(--text-faint)] shrink-0">{person.role}</span>
                        <button
                          onClick={() => setInvitedPeople(prev => prev.filter((_, j) => j !== i))}
                          className="w-5 h-5 flex items-center justify-center rounded text-[var(--text-faint)] hover:text-[#C0375A] hover:bg-[rgba(192,55,90,0.1)] transition-colors"
                          title="Remove access"
                        >
                          <X className="w-3 h-3" strokeWidth={2.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer: copy link */}
              <div className="px-5 py-3 border-t border-[var(--border-faint)] flex items-center justify-between rounded-b-2xl overflow-hidden">
                <p className="text-[11px] text-[var(--text-faint)]">Or share via link</p>
                <button
                  onClick={() => handleCopy('https://uxmosaic.app/audit/my-first-audit', 'Link copied!')}
                  className="flex items-center gap-1.5 text-[11px] text-[var(--brand-blue)] hover:text-[var(--brand-blue-hover)] transition-colors"
                >
                  <Copy className="w-3 h-3" strokeWidth={2} />
                  Copy link
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Feedback button — subtle, bottom-right */}
      <div className="fixed bottom-4 right-4 z-40">
        <AnimatePresence mode="wait">
          {feedbackOpen ? (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="w-80 bg-[var(--surface-2)] border border-[var(--border-default)] rounded-xl shadow-2xl overflow-hidden" style={{ boxShadow: 'var(--card-shadow-elevated)' }}
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-faint)]">
                <div className="flex items-center gap-2 text-xs text-[var(--text-on-dark)]">
                  <MessageSquare className="w-3.5 h-3.5 text-[var(--brand-blue)]" strokeWidth={1.8} />
                  Share feedback
                </div>
                <button
                  onClick={() => { setFeedbackOpen(false); setFeedbackSent(false); }}
                  className="w-6 h-6 rounded-md text-[var(--text-faint)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover-medium)] flex items-center justify-center transition-colors"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </div>
              {feedbackSent ? (
                <div className="px-3 py-4 text-xs text-[var(--text-on-dark-subtle)] text-center">
                  Thanks — your feedback was sent.
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-1.5">
                    {([
                      { id: 'suggestion', label: 'Suggestion', Icon: Sparkles },
                      { id: 'bug', label: 'Bug', Icon: Bug },
                    ] as const).map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        onClick={() => setFeedbackType(id)}
                        className="inline-flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs transition-colors"
                        style={feedbackType === id
                          ? { backgroundColor: 'var(--brand-blue-soft)', color: 'var(--brand-blue)', border: '1px solid var(--brand-blue)' }
                          : { backgroundColor: 'var(--surface-3)', color: 'var(--text-on-dark-subtle)', border: '1px solid var(--border-on-dark)' }}
                      >
                        <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
                        {label}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder={feedbackType === 'bug' ? 'What went wrong? Steps to reproduce…' : "What's an idea that would make this better?"}
                    rows={3}
                    className="w-full bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-2.5 py-2 text-xs text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors resize-none"
                  />
                  <button
                    onClick={() => {
                      if (!feedbackText.trim()) return;
                      setFeedbackSent(true);
                      setFeedbackText('');
                      setTimeout(() => { setFeedbackOpen(false); setFeedbackSent(false); }, 1600);
                    }}
                    disabled={!feedbackText.trim()}
                    className="w-full inline-flex items-center justify-center gap-1.5 h-8 rounded-lg bg-[var(--brand-blue)] text-xs text-white hover:bg-[var(--brand-blue-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-3 h-3" strokeWidth={2} />
                    Send feedback
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.button
              key="trigger"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              onClick={() => setFeedbackOpen(true)}
              title="Share feedback"
              className="h-9 px-3 rounded-full bg-[var(--surface-2)] border border-[var(--border-default)] text-[var(--text-on-dark-subtle)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)] inline-flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-all shadow-lg text-[11px]"
            >
              <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.8} />
              Feedback
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── IssueCard, MetaSelect, types, and constants are now in shared-issue-card.tsx ───

