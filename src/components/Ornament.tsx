export function StitchDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`trama-ponto ${className}`} role="separator" aria-hidden="true" />
  );
}

/** Cantos decorativos suaves inspirados em renda/bordado */
export function CornerFlourish({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`${className} ${flip ? '-scale-x-100' : ''}`}
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M4 116C4 60 20 30 60 20c12-3 24-2 32 4"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="1 9"
      />
      <path
        d="M12 116c0-40 12-64 44-74 10-3 20-2 26 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 7"
        opacity="0.6"
      />
      <circle cx="96" cy="20" r="5" fill="currentColor" opacity="0.8" />
      <circle cx="104" cy="30" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="86" cy="12" r="3" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function FloralCorner({ flip = false, className = '' }: { flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      aria-hidden="true"
      className={`pointer-events-none absolute h-28 w-28 text-areia-escura/50 md:h-40 md:w-40 ${className} ${flip ? '-scale-x-100' : ''}`}
      fill="none"
    >
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx="70"
          cy="34"
          rx="10"
          ry="22"
          transform={`rotate(${deg} 70 70)`}
          fill="currentColor"
          opacity="0.35"
        />
      ))}
      <circle cx="70" cy="70" r="9" fill="#E99B32" opacity="0.5" />
    </svg>
  );
}
