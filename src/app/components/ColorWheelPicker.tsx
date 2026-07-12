import { useRef, useEffect, useState, useCallback } from 'react';
import { Pipette, X } from 'lucide-react';

const SIZE = 160;
const R = SIZE / 2;

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function hexToPos(hex: string): { x: number; y: number } | null {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { x: R, y: R };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  const angle = h * 2 * Math.PI;
  const dist = s * R;
  return { x: R + dist * Math.cos(angle), y: R + dist * Math.sin(angle) };
}

function isValidHex(v: string) {
  return /^#?[0-9a-fA-F]{6}$/.test(v);
}

function normaliseHex(v: string) {
  const clean = v.replace('#', '');
  return clean.length === 6 ? `#${clean}` : null;
}

export function ColorWheelPicker({
  color,
  onChange,
  onClose,
}: {
  color: string;
  onChange: (c: string) => void;
  onClose?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(() => hexToPos(color));
  const [liveHex, setLiveHex] = useState(color);
  const [hexInput, setHexInput] = useState(color.replace('#', '').toUpperCase());
  const [hexError, setHexError] = useState(false);
  const [eyedropping, setEyedropping] = useState(false);
  const isDragging = useRef(false);
  const pendingRef = useRef(color);
  const rafId = useRef<number | null>(null);

  // Draw wheel once with anti-aliased edge
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const img = ctx.createImageData(SIZE, SIZE);
    for (let py = 0; py < SIZE; py++) {
      for (let px = 0; px < SIZE; px++) {
        const dx = px - R, dy = py - R;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= R + 1) {
          const hue = ((Math.atan2(dy, dx) * 180 / Math.PI) + 360) % 360;
          const sat = Math.min(dist / R, 1) * 100;
          const [r, g, b] = hslToRgb(hue, sat, 50);
          const i = (py * SIZE + px) * 4;
          // Feather the last 1.5px for smooth anti-aliased edge
          const alpha = dist > R - 1.5 ? Math.max(0, (R - dist + 1.5) / 1.5) : 1;
          img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = b;
          img.data[i + 3] = Math.round(alpha * 255);
        }
      }
    }
    ctx.putImageData(img, 0, 0);
  }, []);

  // Sync when color changes externally (preset swatch click)
  useEffect(() => {
    setLiveHex(color);
    setHexInput(color.replace('#', '').toUpperCase());
    setHexError(false);
    setCursorPos(hexToPos(color));
  }, [color]);

  const commitColor = useCallback((hex: string) => {
    setLiveHex(hex);
    setCursorPos(hexToPos(hex));
    pendingRef.current = hex;
    if (rafId.current !== null) return;
    rafId.current = requestAnimationFrame(() => {
      onChange(pendingRef.current);
      rafId.current = null;
    });
  }, [onChange]);

  const pickAt = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = SIZE / rect.width;
    const scaleY = SIZE / rect.height;
    const rawX = (clientX - rect.left) * scaleX;
    const rawY = (clientY - rect.top) * scaleY;
    const dx = rawX - R, dy = rawY - R;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clamp = dist > R ? R / dist : 1;
    const cx = R + dx * clamp;
    const cy = R + dy * clamp;
    setCursorPos({ x: cx, y: cy });
    const ctx = canvas.getContext('2d')!;
    const px = ctx.getImageData(Math.round(cx), Math.round(cy), 1, 1).data;
    const hex = rgbToHex(px[0], px[1], px[2]);
    setLiveHex(hex);
    setHexInput(hex.replace('#', '').toUpperCase());
    setHexError(false);
    pendingRef.current = hex;
    if (rafId.current !== null) return;
    rafId.current = requestAnimationFrame(() => {
      onChange(pendingRef.current);
      rafId.current = null;
    });
  }, [onChange]);

  useEffect(() => {
    const move = (e: MouseEvent) => { if (isDragging.current) pickAt(e.clientX, e.clientY); };
    const up = () => { isDragging.current = false; };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [pickAt]);

  // Hex text input handlers
  const handleHexChange = (val: string) => {
    const clean = val.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
    setHexInput(clean.toUpperCase());
    if (clean.length === 6) {
      const hex = `#${clean}`;
      setHexError(false);
      commitColor(hex);
    } else {
      setHexError(true);
    }
  };

  const handleHexBlur = () => {
    if (hexInput.length !== 6) {
      // revert to last valid
      setHexInput(liveHex.replace('#', '').toUpperCase());
      setHexError(false);
    }
  };

  const handleHexKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const norm = normaliseHex(hexInput);
      if (norm) { commitColor(norm); (e.target as HTMLInputElement).blur(); }
    }
  };

  // EyeDropper API — close the picker first so the full page is exposed
  const handleEyedropper = async () => {
    if (!('EyeDropper' in window)) return;
    setEyedropping(true);
    // Dismiss the popover so nothing blocks the screen
    onClose?.();
    // Small delay lets the DOM update before the browser overlay appears
    await new Promise(r => setTimeout(r, 80));
    try {
      // @ts-ignore — EyeDropper is not yet in TS lib
      const dropper = new window.EyeDropper();
      const result = await dropper.open();
      const hex = result.sRGBHex;
      onChange(hex);
    } catch {
      // user cancelled — no-op
    } finally {
      setEyedropping(false);
    }
  };

  const eyedropperSupported = typeof window !== 'undefined' && 'EyeDropper' in window;

  return (
    <div className="flex flex-col gap-2.5 p-3 bg-[var(--surface-elevated)] border border-[var(--border-on-dark-strong)] rounded-xl shadow-2xl" style={{ width: SIZE + 28 }}>
      {/* Header row with close button */}
      <div className="flex items-center justify-end -mb-1">
        <button
          onClick={onClose}
          title="Close"
          className="w-5 h-5 flex items-center justify-center rounded-md text-[var(--text-on-dark-subtle)] hover:text-[var(--text-on-dark)] hover:bg-[var(--surface-3)] transition-colors"
        >
          <X className="w-3 h-3" strokeWidth={2.5} />
        </button>
      </div>
      {/* Wheel */}
      <div
        className="relative cursor-crosshair select-none self-center"
        style={{
          width: SIZE,
          height: SIZE,
          maskImage: 'radial-gradient(circle, black 96%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle, black 96%, transparent 100%)',
        }}
        onMouseDown={(e) => { isDragging.current = true; pickAt(e.clientX, e.clientY); }}
      >
        <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ display: 'block', width: SIZE, height: SIZE }} />
        {cursorPos && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: cursorPos.x - 7,
              top: cursorPos.y - 7,
              width: 14,
              height: 14,
              borderRadius: 3,
              border: '2.5px solid white',
              boxShadow: '0 0 0 1.5px rgba(0,0,0,0.6)',
            }}
          />
        )}
      </div>

      {/* Color swatch + hex input + eyedropper */}
      <div className={`flex items-center gap-1.5 bg-[var(--surface-3)] border rounded-lg px-2 py-1.5 transition-colors ${hexError ? 'border-[var(--severity-critical)]/50' : 'border-[var(--border-on-dark)]'}`}>
        <div className="w-6 h-6 rounded-md shrink-0 border border-[var(--border-on-dark-strong)]" style={{ backgroundColor: liveHex }} />
        <span className="text-xs text-[var(--text-on-dark-subtle)] select-none" style={{ fontFamily: 'monospace' }}>#</span>
        <input
          type="text"
          value={hexInput}
          onChange={(e) => handleHexChange(e.target.value)}
          onBlur={handleHexBlur}
          onKeyDown={handleHexKeyDown}
          maxLength={6}
          spellCheck={false}
          className="flex-1 min-w-0 bg-transparent text-xs text-[var(--text-on-dark)] outline-none"
          style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}
          placeholder="FF5C5C"
        />
        {eyedropperSupported && (
          <button
            onClick={handleEyedropper}
            title="Sample color from screen"
            className={`shrink-0 transition-colors ${eyedropping ? 'text-[var(--brand-blue)]' : 'text-[var(--text-on-dark-subtle)] hover:text-[var(--text-on-dark)]'}`}
          >
            <Pipette className="w-3.5 h-3.5" strokeWidth={1.8} />
          </button>
        )}
      </div>
    </div>
  );
}
