import { Link } from 'react-router';
import { Search, Plus, Folder, Clock, CheckCircle2, Pencil, X, Save, Trash2, ChevronDown, Eye, EyeOff, Camera } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import logoSrc from '../../imports/Logo.png';
import { AppUserMenu } from '../components/AppUserMenu';
import { ConfirmModal } from '../components/ConfirmModal';

const FRAMEWORKS = ['None', 'Nielsen 10 Usability Heuristics', 'WCAG 2.2', 'ISO 9241-110'];
const LANGUAGES = ['English', 'Arabic'];

const MOCK_PROJECTS = [
  // Scenario 1: client name + no cover → shows client initials
  { id: 1, name: 'Aramex Q2 Audit', client: 'Aramex', framework: 'None', language: 'English', issueCount: 14, resolvedCount: 6, updatedAt: '2 hours ago', coverImage: '' },
  // Scenario 2: cover image uploaded → shows the cover image
  { id: 2, name: 'Checkout Flow Review', client: 'Acme Corp', framework: 'WCAG 2.2', language: 'English', issueCount: 8, resolvedCount: 8, updatedAt: '3 days ago', coverImage: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  // Scenario 3: no client + no cover → shows folder icon
  { id: 3, name: 'Internal Usability Review', client: '', framework: 'Nielsen 10 Usability Heuristics', language: 'English', issueCount: 5, resolvedCount: 1, updatedAt: '2 days ago', coverImage: '' },
  // Scenario 1 again: client name + no cover (different client)
  { id: 4, name: 'Onboarding UX Audit', client: 'Fintech Startup', framework: 'Nielsen 10 Usability Heuristics', language: 'English', issueCount: 21, resolvedCount: 4, updatedAt: '1 week ago', coverImage: '' },
];

type Project = typeof MOCK_PROJECTS[number];
type EditableProject = Project & { language: string; framework: string; hideProgress?: boolean; coverImage?: string };

function SmallSelect({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 bg-[var(--surface-3)] border border-[var(--border-on-dark)] rounded-lg pl-2.5 pr-8 text-xs text-[var(--text-on-dark)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors appearance-none cursor-pointer hover:border-[var(--border-on-dark-strong)] shadow-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-on-dark-subtle)] pointer-events-none" />
    </div>
  );
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-[var(--brand-blue)]" style={{ fontWeight: 700 }}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

export function ProjectsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState<EditableProject[]>(() => {
    const saved = localStorage.getItem('uxm_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fall through to defaults
      }
    }
    const currentFramework = localStorage.getItem('uxm_project_framework') ?? 'None';
    const currentLanguage = localStorage.getItem('uxm_project_language') ?? 'English';
    const currentName = localStorage.getItem('uxm_project_name');
    const currentClient = localStorage.getItem('uxm_project_client');
    return MOCK_PROJECTS.map((project, index) => index === 0
      ? { ...project, name: currentName || project.name, client: currentClient || project.client, framework: currentFramework, language: currentLanguage }
      : project
    );
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<EditableProject | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmDeleteCoverId, setConfirmDeleteCoverId] = useState<number | null>(null);
  const [changingCoverId, setChangingCoverId] = useState<number | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const removeProjectCover = (projectId: number) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, coverImage: undefined } : p));
  };

  const handleCoverUpload = (file: File | undefined, projectId: number) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        const scale = Math.min(MAX / img.width, MAX / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL('image/jpeg', 0.8);
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, coverImage: compressed } : p));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    localStorage.setItem('uxm_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (editingId) setTimeout(() => firstInputRef.current?.focus(), 0);
  }, [editingId]);

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.client.toLowerCase().includes(search.toLowerCase()) ||
    p.framework.toLowerCase().includes(search.toLowerCase()) ||
    p.language.toLowerCase().includes(search.toLowerCase())
  );

  const startEditing = (project: EditableProject) => {
    setEditingId(project.id);
    setDraft({ ...project });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraft(null);
  };

  const saveEditing = () => {
    if (!draft || !draft.name.trim()) return;
    const cleanDraft = { ...draft, name: draft.name.trim(), client: draft.client.trim() };
    setProjects((prev) => prev.map((project) => project.id === cleanDraft.id ? cleanDraft : project));
    if (cleanDraft.id === 1) {
      localStorage.setItem('uxm_project_name', cleanDraft.name);
      localStorage.setItem('uxm_project_client', cleanDraft.client);
      localStorage.setItem('uxm_project_framework', cleanDraft.framework);
      localStorage.setItem('uxm_project_language', cleanDraft.language);
    }
    setEditingId(null);
    setDraft(null);
  };

  const deleteProject = (id: number) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (confirmDeleteId === null) return;
    setProjects((prev) => prev.filter((p) => p.id !== confirmDeleteId));
    if (editingId === confirmDeleteId) {
      setEditingId(null);
      setDraft(null);
    }
    setConfirmDeleteId(null);
  };

  const toggleProgress = (id: number) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, hideProgress: !p.hideProgress } : p));
  };

  return (
    <div className="min-h-screen bg-[var(--surface-base)] flex flex-col">
      {/* Top bar */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-[var(--border-on-dark)] bg-[var(--surface-1)] sticky top-0 z-30">
        <div className="flex items-center gap-5">
          <Link to="/" className="flex items-center gap-3 no-underline shrink-0">
            <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0">
              <img src={logoSrc} alt="UX Mosaic" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm text-[var(--text-on-dark)]">UX Mosaic</span>
          </Link>

          <div className="w-px h-5 bg-[var(--border-on-dark)]" />

          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-on-dark-subtle)]" strokeWidth={1.8} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('projects.searchPlaceholder')}
              className="w-60 h-8 bg-[var(--surface-3)] border border-[var(--border-on-dark-strong)] rounded-lg ps-9 pe-3 text-xs text-[var(--text-on-dark)] placeholder:text-[var(--text-on-dark-subtle)] outline-none focus:border-[var(--brand-blue)] transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/app/new"
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-[var(--brand-blue)] text-[var(--on-brand)] text-xs hover:bg-[var(--brand-blue-hover)] transition-colors no-underline shrink-0"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            {t('projects.newProject')}
          </Link>

          <AppUserMenu />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[var(--text-on-dark)] mb-0.5" style={{ fontSize: '18px', fontWeight: 600 }}>
                {t('projects.title')}
              </h1>
              <p className="text-xs text-[var(--text-on-dark-subtle)]">
                {filtered.length} {filtered.length !== 1 ? t('projects.title').toLowerCase() : t('projects.title').toLowerCase()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16 text-center border border-dashed border-[var(--border-on-dark-strong)] rounded-xl bg-[var(--surface-2)]">
                <div className="w-12 h-12 rounded-full bg-[var(--surface-3)] flex items-center justify-center mb-4">
                  <Search className="w-5 h-5 text-[var(--text-on-dark-subtle)]" strokeWidth={1.5} />
                </div>
                <h3 className="text-[var(--text-on-dark)] text-sm font-medium mb-1">No projects found</h3>
                <p className="text-xs text-[var(--text-on-dark-subtle)]">Try adjusting your search criteria</p>
              </div>
            )}

            {filtered.map((project) => {
              const progress = project.issueCount > 0 ? Math.round((project.resolvedCount / project.issueCount) * 100) : 0;
              const isEditing = editingId === project.id && draft;

              if (isEditing) {
                return (
                  <div
                    key={project.id}
                    className="flex flex-col bg-[var(--surface-2)] border border-[var(--brand-blue)]/50 rounded-xl p-5 relative overflow-hidden"
                    style={{ boxShadow: '0 0 0 1px var(--brand-blue-soft), var(--card-shadow-default)' }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-blue-soft)] opacity-20" />
                    
                    <div className="flex items-center justify-between mb-5">
                      <button
                        type="button"
                        onClick={() => deleteProject(project.id)}
                        className="w-9 h-9 rounded-lg bg-[var(--surface-3)] border border-[var(--border-on-dark)] text-[var(--text-on-dark-subtle)] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-colors flex items-center justify-center"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.8} />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="w-9 h-9 rounded-lg bg-[var(--surface-3)] border border-[var(--border-on-dark)] text-[var(--text-on-dark-subtle)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-on-dark-strong)] transition-all flex items-center justify-center"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" strokeWidth={1.8} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-medium uppercase tracking-wider text-[var(--text-on-dark-subtle)] mb-1.5">
                          Project name <span className="text-red-400/80">*</span>
                        </label>
                        <input
                          ref={firstInputRef}
                          value={draft.name}
                          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                          onKeyDown={(e) => { if (e.key === 'Enter') saveEditing(); if (e.key === 'Escape') cancelEditing(); }}
                          className={`w-full h-8 bg-[var(--surface-3)] border ${!draft.name.trim() ? 'border-red-500/50 focus:border-red-500/80' : 'border-[var(--border-on-dark)] focus:border-[var(--brand-blue)]/60'} rounded-lg px-2.5 text-xs text-[var(--text-on-dark)] outline-none transition-colors shadow-sm`}
                          placeholder="e.g. Acme Corp Audit"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium uppercase tracking-wider text-[var(--text-on-dark-subtle)] mb-1.5">Client</label>
                        <input
                          value={draft.client}
                          onChange={(e) => setDraft({ ...draft, client: e.target.value })}
                          onKeyDown={(e) => { if (e.key === 'Enter') saveEditing(); if (e.key === 'Escape') cancelEditing(); }}
                          className="w-full h-8 bg-[var(--surface-3)] border border-[var(--border-on-dark)] rounded-lg px-2.5 text-xs text-[var(--text-on-dark)] outline-none focus:border-[var(--brand-blue)]/60 transition-colors shadow-sm"
                          placeholder="e.g. Acme Corp"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-medium uppercase tracking-wider text-[var(--text-on-dark-subtle)] mb-1.5">Framework</label>
                          <SmallSelect value={draft.framework} options={FRAMEWORKS} onChange={(framework) => setDraft({ ...draft, framework })} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium uppercase tracking-wider text-[var(--text-on-dark-subtle)] mb-1.5">Language</label>
                          <SmallSelect value={draft.language} options={LANGUAGES} onChange={(language) => setDraft({ ...draft, language })} />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={saveEditing}
                        disabled={!draft.name.trim()}
                        className="mx-auto h-8 px-4 rounded-lg bg-[var(--brand-blue)] text-white text-xs hover:bg-[var(--brand-blue-hover)] disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Save className="w-3.5 h-3.5" strokeWidth={2} />
                        Save
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={project.id}
                  className="relative flex flex-col bg-[var(--surface-2)] border border-[var(--border-on-dark)] rounded-xl overflow-hidden hover:border-[var(--border-on-dark-strong)] hover:bg-[var(--surface-elevated)] transition-colors group"
                  style={{ boxShadow: 'var(--card-shadow-default)' }}
                >
                  {/* Hidden file input for cover upload */}
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { if (changingCoverId !== null) handleCoverUpload(e.target.files?.[0], changingCoverId); e.target.value = ''; }}
                  />

                  {/* Cover image — edge-to-edge at top, click navigates to project */}
                  <Link to="/app/audit" className="relative h-36 shrink-0 bg-[var(--surface-3)] block no-underline">
                    {project.coverImage ? (
                      <img src={project.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {project.client ? (() => {
                          const name = project.client.trim();
                          const initials = name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
                          const colors = ['#4274BA','#C0375A','#7B5EA6','#3A9EB5','#E8B84B','#3AA68A','#D97B3A'];
                          const color = colors[name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length];
                          return (
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                              style={{ background: color, fontSize: '14px', fontWeight: 700, letterSpacing: '-0.5px' }}
                            >{initials}</div>
                          );
                        })() : (
                          <Folder className="w-10 h-10 text-[var(--text-on-dark-subtle)] group-hover:text-[var(--brand-blue)] transition-colors" strokeWidth={1.5} />
                        )}
                      </div>
                    )}
                    {/* Trash — top-left, only when cover set */}
                    {project.coverImage && (
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmDeleteCoverId(project.id); }}
                        className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600/80 hover:text-red-100"
                        title="Remove cover"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
                      </button>
                    )}
                    {/* Camera — top-right, always on hover */}
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setChangingCoverId(project.id); setTimeout(() => coverInputRef.current?.click(), 0); }}
                      className="absolute top-2 right-2 flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                      title={project.coverImage ? 'Change cover' : 'Add cover'}
                    >
                      <Camera className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
                      <span className="text-[11px]">{project.coverImage ? 'Change' : 'Add cover'}</span>
                    </button>
                  </Link>

                  <Link to="/app/audit" className="flex flex-col flex-1 no-underline focus:outline-none p-5">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <h3 className="text-sm text-[var(--text-on-dark)] group-hover:text-[var(--brand-blue)] transition-colors">{highlightMatch(project.name, search)}</h3>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); startEditing(project); }}
                        className="shrink-0 w-7 h-7 rounded-lg bg-[var(--surface-3)] border border-[var(--border-on-dark)] text-[var(--text-on-dark-subtle)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-on-dark-strong)] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all flex items-center justify-center shadow-sm"
                        title="Edit project details"
                      >
                        <Pencil className="w-3.5 h-3.5" strokeWidth={1.8} />
                      </button>
                    </div>
                    <p className="text-[11px] text-[var(--text-on-dark-subtle)] mb-3">{project.client ? highlightMatch(project.client, search) : 'No client'}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--surface-3)] border border-[var(--border-on-dark)] text-[var(--text-on-dark-subtle)]">{project.framework}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--surface-3)] border border-[var(--border-on-dark)] text-[var(--text-on-dark-subtle)]">{project.language}</span>
                    </div>

                    <div className="mt-auto">
                      {!project.hideProgress && (
                        <>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-on-dark-subtle)]">
                              <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
                              {t('projects.issuesResolved', { resolved: project.resolvedCount, total: project.issueCount })}
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleProgress(project.id); }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-[var(--text-on-dark)]"
                                title="Hide progress"
                              >
                                <EyeOff className="w-3 h-3" strokeWidth={1.8} />
                              </button>
                            </div>
                            <span className="text-[11px] text-[var(--text-on-dark-subtle)]">{progress}%</span>
                          </div>
                          <div className="h-1 rounded-full bg-[var(--surface-3)] overflow-hidden">
                            <div className="h-full rounded-full bg-[var(--brand-green)] transition-all" style={{ width: `${progress}%` }} />
                          </div>
                        </>
                      )}
                      {project.hideProgress && (
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleProgress(project.id); }}
                          className="flex items-center gap-1 text-[11px] text-[var(--text-on-dark-subtle)] hover:text-[var(--text-on-dark)] transition-colors"
                          title="Show progress"
                        >
                          <Eye className="w-3 h-3 shrink-0" strokeWidth={1.8} />
                          <span className="leading-none">Show progress</span>
                        </button>
                      )}
                      <div className="flex items-center gap-1 mt-2.5 text-[10px] text-[var(--text-on-dark-subtle)]">
                        <Clock className="w-3 h-3" strokeWidth={1.8} />
                        {t('projects.updatedAt', { time: project.updatedAt })}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}

            {/* New project card */}
            <Link
              to="/app/new"
              className="flex flex-col items-center justify-center bg-[var(--surface-2)] border border-dashed border-[var(--border-on-dark-strong)] rounded-xl p-5 min-h-[180px] hover:border-[var(--brand-blue)]/40 hover:bg-[var(--brand-blue-soft)] transition-all group no-underline"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--surface-3)] flex items-center justify-center mb-3 group-hover:bg-[var(--brand-blue)] group-hover:scale-110 transition-all">
                <Plus className="w-5 h-5 text-[var(--text-on-dark-subtle)] group-hover:text-white transition-colors" strokeWidth={2} />
              </div>
              <span className="text-sm text-[var(--text-on-dark-subtle)] group-hover:text-[var(--text-on-dark)] transition-colors">{t('projects.newProject')}</span>
            </Link>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmDeleteId !== null}
        title="Delete project?"
        message="This project and all its issues will be permanently removed. This action cannot be undone."
        confirmLabel="Delete project"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />

      <ConfirmModal
        open={confirmDeleteCoverId !== null}
        title="Remove cover image?"
        message="The cover image will be removed from this project."
        confirmLabel="Remove cover"
        onConfirm={() => { if (confirmDeleteCoverId !== null) removeProjectCover(confirmDeleteCoverId); setConfirmDeleteCoverId(null); }}
        onCancel={() => setConfirmDeleteCoverId(null)}
      />
    </div>
  );
}
