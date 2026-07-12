import { Link } from 'react-router';
import {
  Plus, Image as ImageIcon, MessageSquare,
  MoreVertical, Filter, ChevronDown, ArrowUpDown, User, ChevronLeft,
  ChevronRight, AlertCircle, Flag, Zap
} from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Navigation } from '../components/Navigation';

type Issue = {
  id: number;
  title: string;
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
  images: string[];
  currentImageIndex: number;
  visualRecImages: string[];
};

export function AppDemoPage() {
  const [introduction] = useState('This audit evaluates the Aramex mobile app checkout flow, focusing on usability issues that may impact conversion rates and user satisfaction. The review covers the entire purchase journey from cart to payment confirmation.');
  const [conclusion] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const [issues] = useState<Issue[]>([
    {
      id: 1,
      title: 'Checkout Page',
      description: 'The payment confirmation button is positioned at the bottom of a long form, requiring excessive scrolling. Users with smaller screens may miss it entirely or assume the form is incomplete.',
      recommendation: 'Implement a sticky footer with the confirmation button, or use a multi-step wizard that breaks the form into digestible sections with clear progress indicators.',
      uxLaw: 'Fitts\'s Law',
      tags: 'checkout, mobile, conversion',
      category: 'Usability',
      severity: 'High',
      priority: 'High',
      effort: 'Medium',
      status: 'Not Resolved',
      author: 'Sarah Chen',
      images: ['annotated', 'screenshot2'],
      currentImageIndex: 0,
      visualRecImages: ['mockup1']
    },
    {
      id: 2,
      title: 'Product Detail Page',
      description: 'The "Add to Cart" button uses insufficient color contrast against the background, making it difficult to locate quickly.',
      recommendation: 'Increase button contrast to meet WCAG AA standards and consider adding a subtle shadow or border to improve visual prominence.',
      uxLaw: '',
      tags: '',
      category: 'UI Enhancements',
      severity: 'Medium',
      priority: 'Medium',
      effort: 'Low',
      status: 'Not Resolved',
      author: 'Sarah Chen',
      images: [],
      currentImageIndex: 0,
      visualRecImages: []
    }
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-base)]">
      <Navigation />

      {/* Demo Banner */}
      <div className="bg-[var(--brand-blue)]/10 border-b border-[var(--brand-blue)]/20 px-6 py-2.5 flex items-center justify-between gap-4 flex-wrap">
        <span className="text-xs text-[var(--brand-blue)]">You're viewing a live demo — <strong>Aramex · Q2 UX Audit</strong>.</span>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-xs text-[var(--brand-blue)] underline underline-offset-2 hover:opacity-75 transition-opacity"
          >
            ← Back to site
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Top Bar with Filters */}
        <div className="bg-[var(--surface-1)] border-b border-[var(--border-on-dark)]">
          <div className="px-6 py-3 flex items-center justify-between">
            <h1 className="text-base text-[var(--text-on-dark)] font-medium">Aramex Q2 UX Audit</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`h-8 px-3 rounded-md flex items-center gap-1.5 text-xs transition-colors ${
                  showFilters
                    ? 'bg-[var(--brand-blue)] text-white'
                    : 'bg-[var(--surface-3)] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)]'
                }`}
              >
                <Filter className="w-3 h-3" strokeWidth={1.8} />
                Filter
              </button>
              <button className="h-8 px-3 rounded-md bg-[var(--surface-3)] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)] transition-colors flex items-center gap-1.5 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5" strokeWidth={1.8} />
                Sort by
                <ChevronDown className="w-3 h-3" strokeWidth={2} />
              </button>
            </div>
            <div className="text-xs text-[var(--text-faint)]">{issues.length} {issues.length === 1 ? 'issue' : 'issues'}</div>
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
            <div className="px-6 pb-4 grid grid-cols-6 gap-3">
              {['Severity', 'Category', 'Priority', 'Effort', 'Status'].map((lbl) => (
                <div key={lbl}>
                  <label className="block text-xs text-[var(--text-faint)] mb-1.5">{lbl}</label>
                  <select className="w-full h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-md px-2 text-xs text-[var(--text-on-dark)] outline-none focus:border-[var(--brand-blue)]/60">
                    <option>All</option>
                    {lbl === 'Severity' && <><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></>}
                    {lbl === 'Category' && <><option>Usability</option><option>Bug</option><option>UI Enhancements</option></>}
                    {(lbl === 'Priority' || lbl === 'Effort') && <><option>High</option><option>Medium</option><option>Low</option></>}
                    {lbl === 'Status' && <><option>Not Resolved</option><option>Resolved</option><option>Not an issue</option></>}
                  </select>
                </div>
              ))}
              <div>
                <label className="block text-xs text-[var(--text-faint)] mb-1.5">Tags</label>
                <input
                  type="text"
                  placeholder="Filter by tag..."
                  className="w-full h-8 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-md px-2 text-xs text-[var(--text-on-dark)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--brand-blue)]/60"
                />
              </div>
            </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Introduction */}
            <div className="bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl overflow-hidden" style={{ boxShadow: 'var(--card-shadow-default)' }}>
              <div className="px-5 py-3 border-b border-[var(--border-faint)] bg-[var(--surface-1)]">
                <h3 className="text-sm text-[var(--text-on-dark)]">Introduction</h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{introduction}</p>
              </div>
            </div>

            {/* Issues */}
            {issues.map((issue, index) => (
              <div key={issue.id} className="bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl overflow-hidden" style={{ boxShadow: 'var(--card-shadow-default)' }}>
                <div className="p-5">
                  {/* Issue Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-faint)]">Issue #{index + 1}</span>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--text-faint)]">
                        <User className="w-3 h-3" strokeWidth={1.8} />
                        <span>{issue.author}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover-medium)] transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.8} />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === issue.id ? null : issue.id)}
                          className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-hover-medium)] transition-colors"
                        >
                          <MoreVertical className="w-3.5 h-3.5" strokeWidth={1.8} />
                        </button>
                        <AnimatePresence>
                        {activeMenu === issue.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                            transition={{ duration: 0.14, ease: [0.4, 0, 0.2, 1] }}
                            style={{ transformOrigin: 'top right', boxShadow: 'var(--card-shadow-elevated)' }}
                            className="absolute right-0 top-8 w-32 bg-[var(--surface-elevated)] border border-[var(--border-medium)] rounded-lg overflow-hidden z-10">
                            <button className="w-full px-3 py-2 text-xs text-[var(--text-muted)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)] text-left transition-colors">Duplicate</button>
                            <button className="w-full px-3 py-2 text-xs text-[var(--text-muted)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)] text-left transition-colors">Move</button>
                            <button className="w-full px-3 py-2 text-xs text-[var(--text-muted)] hover:bg-[var(--surface-hover-medium)] hover:text-[var(--text-on-dark)] text-left transition-colors">Link</button>
                            <button className="w-full px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 text-left transition-colors">Delete</button>
                          </motion.div>
                        )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    {/* Image Area */}
                    <div className="shrink-0 space-y-3">
                      {issue.images.length === 0 ? (
                        <div className="w-[480px] h-80 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg flex flex-col items-center justify-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-[var(--brand-blue)]/15 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-[var(--brand-blue)]" strokeWidth={1.5} />
                          </div>
                          <span className="text-xs text-[var(--text-faint)]">No image</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="relative">
                            <div className="w-[480px] h-80 bg-[var(--surface-3)] border border-[var(--border-subtle)] rounded-lg relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                              <div className="absolute inset-0 p-8">
                                <div className="w-full h-12 bg-[var(--surface-hover)] rounded mb-4" />
                                <div className="w-3/4 h-8 bg-[var(--surface-hover)] rounded mb-4" />
                                <div className="w-full h-24 bg-[var(--surface-hover)] rounded" />
                              </div>

                              {/* Annotations */}
                              <div className="absolute top-32 left-16 w-32 h-20 border-2 border-red-500 rounded" />
                              <svg className="absolute top-48 left-56 w-20 h-16" viewBox="0 0 80 64">
                                <path d="M 0 32 Q 40 0, 80 32" stroke="#22c55e" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
                                <defs>
                                  <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                                    <polygon points="0 0, 10 5, 0 10" fill="#22c55e" />
                                  </marker>
                                </defs>
                              </svg>
                              <div className="absolute top-12 right-12 w-10 h-10 rounded-full bg-blue-500 border-2 border-blue-400 flex items-center justify-center">
                                <span className="text-base text-white font-semibold">1</span>
                              </div>
                            </div>

                            {issue.images.length > 1 && (
                              <>
                                <button className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                                  <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                                </button>
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                                  <ChevronRight className="w-4 h-4" strokeWidth={2} />
                                </button>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white/80">
                                  {issue.currentImageIndex + 1} / {issue.images.length}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Form Fields */}
                    <div className="flex-1 space-y-4">
                      {/* Page */}
                      <div>
                        <label className="block text-xs text-[var(--text-faint)] mb-2">Page</label>
                        <div className="w-full h-9 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3 text-sm text-[var(--text-on-dark)] flex items-center">
                          {issue.title}
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs text-[var(--text-faint)] mb-2">Description</label>
                        <div className="w-full bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg p-3 text-sm text-[var(--text-muted)]">
                          {issue.description}
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div>
                        <label className="block text-xs text-[var(--text-faint)] mb-2">Recommendation</label>
                        <div className="w-full bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg p-3 text-sm text-[var(--text-muted)]">
                          {issue.recommendation}
                        </div>
                      </div>

                      {/* Visual Recommendation */}
                      {issue.visualRecImages.length > 0 && (
                        <div>
                          <label className="block text-xs text-[var(--text-faint)] mb-2">Visual Recommendation</label>
                          <div className="flex flex-wrap gap-2">
                            {issue.visualRecImages.map((_img, idx) => (
                              <div key={idx} className="w-40 h-28 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-[var(--border-subtle)] rounded-lg" />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="grid grid-cols-5 gap-3">
                        <div>
                          <label className="block text-xs text-[var(--text-faint)] mb-2">Category</label>
                          <div className="w-full h-9 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-2 text-sm text-[var(--text-on-dark)] flex items-center">
                            {issue.category}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-[var(--text-faint)] mb-2">Severity</label>
                          <div className="w-full h-9 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-2 text-sm text-[var(--text-on-dark)] flex items-center gap-2">
                            <AlertCircle
                              className={`w-3.5 h-3.5 ${
                                issue.severity === 'Critical' ? 'text-[var(--severity-critical)]' :
                                issue.severity === 'High' ? 'text-[var(--severity-serious)]' :
                                issue.severity === 'Medium' ? 'text-[var(--severity-medium)]' :
                                'text-[var(--severity-low)]'
                              }`}
                              strokeWidth={2}
                            />
                            {issue.severity}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-[var(--text-faint)] mb-2">Priority</label>
                          <div className="w-full h-9 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-2 text-sm text-[var(--text-on-dark)] flex items-center gap-2">
                            <Flag
                              className={`w-3.5 h-3.5 ${
                                issue.priority === 'High' ? 'text-[var(--severity-critical)]' :
                                issue.priority === 'Medium' ? 'text-[var(--severity-medium)]' :
                                'text-[var(--severity-low)]'
                              }`}
                              strokeWidth={2}
                            />
                            {issue.priority}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-[var(--text-faint)] mb-2">Effort</label>
                          <div className="w-full h-9 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-2 text-sm text-[var(--text-on-dark)] flex items-center gap-2">
                            <Zap
                              className={`w-3.5 h-3.5 ${
                                issue.effort === 'High' ? 'text-[var(--severity-critical)]' :
                                issue.effort === 'Medium' ? 'text-[var(--severity-medium)]' :
                                'text-[var(--brand-green)]'
                              }`}
                              strokeWidth={2}
                            />
                            {issue.effort}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-[var(--text-faint)] mb-2">Status</label>
                          <div className="w-full h-9 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-2 text-sm text-[var(--text-on-dark)] flex items-center">
                            {issue.status}
                          </div>
                        </div>
                      </div>

                      {/* UX Law and Tags */}
                      {(issue.uxLaw || issue.tags) && (
                        <div className="grid grid-cols-2 gap-3">
                          {issue.uxLaw && (
                            <div>
                              <label className="block text-xs text-[var(--text-faint)] mb-2">UX Law</label>
                              <div className="w-full h-9 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3 text-sm text-[var(--text-on-dark)] flex items-center">
                                {issue.uxLaw}
                              </div>
                            </div>
                          )}
                          {issue.tags && (
                            <div>
                              <label className="block text-xs text-[var(--text-faint)] mb-2">Tags</label>
                              <div className="w-full h-9 bg-[var(--surface-3)] border border-[var(--border-default)] rounded-lg px-3 text-sm text-[var(--text-on-dark)] flex items-center">
                                {issue.tags}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Conclusion */}
            {conclusion && (
              <div className="bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl overflow-hidden" style={{ boxShadow: 'var(--card-shadow-default)' }}>
                <div className="px-5 py-3 border-b border-[var(--border-faint)] bg-[var(--surface-1)]">
                  <h3 className="text-sm text-[var(--text-on-dark)]">Conclusion</h3>
                </div>
                <div className="p-5">
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{conclusion}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
