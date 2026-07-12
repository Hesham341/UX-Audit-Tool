export function MosaicPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute ${className}`}
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="mosfade" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#5eead4" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g stroke="url(#mosfade)" strokeWidth="1">
        {Array.from({ length: 8 }).map((_, i) =>
          Array.from({ length: 8 }).map((_, j) => (
            <rect
              key={`${i}-${j}`}
              x={i * 50}
              y={j * 50}
              width={40}
              height={40}
              rx={8}
              fill={(i + j) % 3 === 0 ? "#5eead4" : "transparent"}
              fillOpacity={(i + j) % 3 === 0 ? 0.04 : 0}
            />
          ))
        )}
      </g>
    </svg>
  );
}
