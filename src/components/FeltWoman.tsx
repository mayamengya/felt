// A small felt woman: soft, rounded, simple bob, minimal face. Used on welcome and loading moments.
// Never used on the red-flag screen.
export function FeltWoman({ size = 160, heart = false, className = "" }: { size?: number; heart?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 160 180" width={size} height={(size * 180) / 160} className={className} aria-hidden="true">
      <g style={{ filter: "drop-shadow(0 3px 0 rgb(74 31 64 / 0.18))" }}>
        {/* body / jumper */}
        <path d="M30 178 C30 128 50 108 80 108 C110 108 130 128 130 178 Z" fill="#6B2D5C" />
        <path d="M36 172 C38 132 56 116 80 116 C104 116 122 132 124 172" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="1.6" strokeDasharray="4 4" />
        {/* neck */}
        <rect x="70" y="92" width="20" height="22" rx="8" fill="#C98B6B" />
        {/* hair back (bob) */}
        <path d="M38 62 C38 26 60 12 80 12 C100 12 122 26 122 62 L122 92 C122 100 112 102 108 96 L52 96 C48 102 38 100 38 92 Z" fill="#7A5C48" />
        {/* face */}
        <ellipse cx="80" cy="62" rx="32" ry="36" fill="#D9A07F" />
        {/* fringe */}
        <path d="M46 52 C50 28 70 22 84 24 C100 26 112 36 115 52 C100 44 84 40 64 46 C56 48 50 50 46 52 Z" fill="#7A5C48" />
        {/* button eyes + stitched smile, minimal */}
        <circle cx="68" cy="64" r="3.2" fill="#2E2430" />
        <circle cx="92" cy="64" r="3.2" fill="#2E2430" />
        <path d="M70 80 Q80 87 90 80" fill="none" stroke="#2E2430" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 3" />
        {/* cheeks */}
        <circle cx="60" cy="76" r="5" fill="#E7B7AE" opacity=".8" />
        <circle cx="100" cy="76" r="5" fill="#E7B7AE" opacity=".8" />
        {heart ? (
          <g transform="translate(66 132)">
            <path d="M14 26 C-6 12 0 -2 9 2 C12 3 14 6 14 8 C14 6 16 3 19 2 C28 -2 34 12 14 26 Z" fill="#C98B6B" />
            <path d="M14 22 C0 12 3 3 9 5" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="1.2" strokeDasharray="2.5 2.5" />
          </g>
        ) : null}
      </g>
    </svg>
  );
}

/** Small loading moment with the felt woman. */
export function FeltLoading({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 py-3" role="status" aria-live="polite">
      <FeltWoman size={44} className="animate-pulse" />
      <p className="text-quiet">{text}</p>
    </div>
  );
}
