"use client";
// Cute felt mascot (welcome + loading only; never on the red-flag screen).
// Chibi felt doll: big round head, bob with a little bun, button eyes, rosy cheeks, holding a heart.
import { useId } from "react";

/** Soft, fuzzy felt: wobbly edges + fibre grain. */
function FuzzyFelt({ id, wobble = 3, soft = false }: { id: string; wobble?: number; soft?: boolean }) {
  const hi = soft ? "1 0 0 0 -0.82" : "1.4 0 0 0 -0.75";
  const lo = soft ? "0 1 0 0 -0.84" : "0 1.5 0 0 -0.8";
  return (
    <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="2" result="warp" />
      <feDisplacementMap in="SourceGraphic" in2="warp" scale={wobble} xChannelSelector="R" yChannelSelector="G" result="edge" />
      <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="5" result="fib" />
      <feColorMatrix in="fib" type="matrix" values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  ${hi}`} result="hi" />
      <feComposite in="hi" in2="edge" operator="in" result="hiClip" />
      <feColorMatrix in="fib" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${lo}`} result="lo" />
      <feComposite in="lo" in2="edge" operator="in" result="loClip" />
      <feMerge>
        <feMergeNode in="edge" />
        <feMergeNode in="hiClip" />
        <feMergeNode in="loClip" />
      </feMerge>
    </filter>
  );
}

export function Mascot({ size = 200, className = "" }: { size?: number; className?: string }) {
  const f = `m${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 200 220" width={size} height={(size * 220) / 200} className={className} aria-hidden="true">
      <defs>
        <FuzzyFelt id={f} />
        <radialGradient id={`${f}s`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity=".28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* soft ground shadow */}
      <ellipse cx="100" cy="208" rx="58" ry="8" fill="#2E2430" opacity=".14" />
      <g filter={`url(#${f})`}>
        {/* body: little plum jumper */}
        <path d="M52 206 C48 160 70 138 100 138 C130 138 152 160 148 206 Z" fill="#6B2D5C" />
        {/* feet */}
        <ellipse cx="80" cy="207" rx="15" ry="8" fill="#5A4336" />
        <ellipse cx="120" cy="207" rx="15" ry="8" fill="#5A4336" />
        {/* bun + hair back */}
        <circle cx="100" cy="22" r="17" fill="#7A5C48" />
        <path d="M38 92 C34 44 64 26 100 26 C136 26 166 44 162 92 L164 126 C158 136 146 136 142 126 L58 126 C54 136 42 136 36 126 Z" fill="#7A5C48" />
        {/* face */}
        <ellipse cx="100" cy="88" rx="52" ry="50" fill="#E3AE8C" />
        {/* fringe: soft swoop */}
        <path d="M48 78 C50 46 76 34 102 34 C128 34 150 46 153 74 C138 60 118 54 100 60 C84 52 64 60 48 78 Z" fill="#7A5C48" />
        {/* arms hugging a heart */}
        <ellipse cx="66" cy="168" rx="13" ry="20" fill="#6B2D5C" transform="rotate(25 66 168)" />
        <ellipse cx="134" cy="168" rx="13" ry="20" fill="#6B2D5C" transform="rotate(-25 134 168)" />
        <path d="M100 194 C76 180 74 158 88 156 C94 155 98 159 100 164 C102 159 106 155 112 156 C126 158 124 180 100 194 Z" fill="#E7B7AE" />
        <circle cx="80" cy="176" r="8" fill="#E3AE8C" />
        <circle cx="120" cy="176" r="8" fill="#E3AE8C" />
      </g>
      {/* soft light on the felt */}
      <ellipse cx="100" cy="88" rx="52" ry="50" fill={`url(#${f}s)`} />
      {/* button eyes, cheeks, tiny smile (crisp, not filtered) */}
      <circle cx="80" cy="94" r="7" fill="#2E2430" />
      <circle cx="120" cy="94" r="7" fill="#2E2430" />
      <circle cx="82.5" cy="91.5" r="2.2" fill="#fff" />
      <circle cx="122.5" cy="91.5" r="2.2" fill="#fff" />
      <ellipse cx="68" cy="110" rx="9" ry="6" fill="#D98A86" opacity=".55" />
      <ellipse cx="132" cy="110" rx="9" ry="6" fill="#D98A86" opacity=".55" />
      <path d="M93 110 Q100 116 107 110" fill="none" stroke="#2E2430" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/** Full-screen felt scene for the welcome page: layered felt hills, clouds and little stars. */
export function FeltScene() {
  const f = `s${useId().replace(/:/g, "")}`;
  const star = (x: number, y: number, r: number, c: string, rot = 0) => (
    <path
      key={`${x}-${y}`}
      transform={`translate(${x} ${y}) rotate(${rot}) scale(${r})`}
      d="M0 -10 L2.9 -3.1 L10 -3.1 L4.3 1.4 L6.4 8.6 L0 4.3 L-6.4 8.6 L-4.3 1.4 L-10 -3.1 L-2.9 -3.1 Z"
      fill={c}
    />
  );
  return (
    <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <FuzzyFelt id={f} wobble={5} soft />
      </defs>
      <g filter={`url(#${f})`}>
        {/* sky felt */}
        <rect width="390" height="844" fill="#F1E7D9" />
        {/* clouds */}
        <path d="M30 120 C30 98 56 92 66 104 C72 84 104 84 110 104 C126 98 140 110 134 124 Z" fill="#FBF7F1" />
        <path d="M250 80 C250 62 272 58 282 68 C290 52 318 54 322 72 C338 70 348 84 340 94 L252 94 Z" fill="#FBF7F1" />
        <path d="M280 200 C282 186 298 184 304 192 C312 180 332 182 334 196 C346 196 350 208 344 212 L282 212 Z" fill="#FBF7F1" />
        {/* hills, back to front (raised so they show above the welcome card) */}
        <g transform="translate(0 -150)">
        <path d="M-20 430 C60 360 150 360 230 400 C300 430 350 400 410 370 L410 844 L-20 844 Z" fill="#B7C1A5" />
        <path d="M-20 470 C70 420 150 440 210 470 C280 500 340 460 410 440 L410 844 L-20 844 Z" fill="#8A9A78" />
        <path d="M-20 560 C40 520 120 520 190 545 C260 570 330 540 410 520 L410 844 L-20 844 Z" fill="#E7B7AE" />
        <path d="M-20 620 C80 580 170 600 250 630 C320 655 370 630 410 615 L410 844 L-20 844 Z" fill="#6F7F5E" />
        <path d="M-20 700 C90 660 200 690 280 700 C340 708 380 690 410 680 L410 1000 L-20 1000 Z" fill="#D9B77E" />
        {/* felt trees */}
        <path d="M60 455 C46 430 52 400 66 392 C80 400 86 430 72 455 Z" fill="#6F7F5E" />
        <rect x="64" y="452" width="4" height="16" fill="#5A4336" />
        <path d="M330 432 C318 410 322 384 336 376 C350 384 354 410 342 432 Z" fill="#C98B6B" />
        <rect x="334" y="430" width="4" height="16" fill="#5A4336" />
        <path d="M352 520 C342 502 346 482 356 476 C366 482 370 502 360 520 Z" fill="#D9B77E" />
        <rect x="354" y="518" width="3.5" height="12" fill="#5A4336" />
        </g>
      </g>
      {/* little felt stars */}
      {star(180, 150, 0.8, "#D9B77E", 12)}
      {star(80, 230, 0.6, "#E7B7AE", -10)}
      {star(350, 280, 0.7, "#B7C1A5", 20)}
      {star(40, 330, 0.5, "#D9B77E", 5)}
      {star(220, 60, 0.5, "#E7B7AE", -15)}
      {star(300, 410, 0.6, "#F1E7D9", 8)}
      {star(60, 450, 0.55, "#F1E7D9", -12)}
    </svg>
  );
}
