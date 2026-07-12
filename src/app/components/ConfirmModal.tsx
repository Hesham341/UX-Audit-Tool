import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onConfirm, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border-on-dark-strong)',
          boxShadow: 'var(--card-shadow-elevated)',
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start gap-3">
          {danger && (
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: 'var(--severity-critical-bg)' }}
            >
              <AlertTriangle className="w-4 h-4" style={{ color: 'var(--severity-critical)' }} strokeWidth={2} />
            </div>
          )}
          <div>
            <h2 className="text-sm" style={{ color: 'var(--text-on-dark)', fontWeight: 600 }}>
              {title}
            </h2>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-on-dark-subtle)' }}>
              {message}
            </p>
          </div>
        </div>

        <div className="h-px mx-6" style={{ background: 'var(--border-on-dark)' }} />

        {/* Actions */}
        <div className="px-6 py-4 flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="h-8 px-4 rounded-lg text-xs transition-colors"
            style={{
              background: 'var(--surface-3)',
              border: '1px solid var(--border-on-dark-strong)',
              color: 'var(--text-on-dark-subtle)',
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="h-8 px-4 rounded-lg text-xs text-white transition-colors"
            style={{
              background: danger ? 'var(--severity-critical)' : 'var(--brand-blue)',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
