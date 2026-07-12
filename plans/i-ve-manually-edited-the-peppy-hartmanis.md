# Plan: Change Number Annotation Tool Icon

## Context

The "Number" annotation tool button currently shows a `Hash` (#) icon from lucide-react. The user wants it replaced with a circle-badge icon matching `image-10.png` — a ring circle with "1" centered inside it, styled with a warm orange-to-red gradient outline (matching the numbered circle aesthetic).

Only the selected button element may be modified.

---

## Change

**File:** `/src/app/pages/AuditPage.tsx`  
**Location:** The button inside `ANNOTATION_TOOLS.map(...)` — the selected snippet around line 1121.

Replace the generic `<Icon className="w-3 h-3" strokeWidth={1.8} />` with a conditional: when `id === 'number'`, render an inline SVG circle badge instead of the Hash icon. All other tools continue using their `<Icon>` as before.

```tsx
{id === 'number' ? (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <defs>
      <linearGradient id="numToolGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF9F43"/>
        <stop offset="100%" stopColor="#FF6B6B"/>
      </linearGradient>
    </defs>
    <circle cx="6" cy="6" r="5" stroke={activeTool === id ? 'currentColor' : 'url(#numToolGrad)'} strokeWidth="1.2" fill="none"/>
    <text x="6" y="9" fontSize="6" fontWeight="700" fill={activeTool === id ? 'currentColor' : 'url(#numToolGrad)'} textAnchor="middle" fontFamily="monospace">1</text>
  </svg>
) : (
  <Icon className="w-3 h-3" strokeWidth={1.8} />
)}
```

When the tool is active (`activeTool === id`), the gradient is replaced with `currentColor` so the icon inherits the button's active blue text color (`text-[#007AFF]`) and blends naturally with the active state styling.

---

## Files Modified

- `/src/app/pages/AuditPage.tsx` — button render inside `ANNOTATION_TOOLS.map` only

## Verification

Open `/app/audit`, expand an issue — confirm the Number annotation tool button shows a small circle-with-1 icon instead of `#`, and that it turns blue when clicked (active state).
