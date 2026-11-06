"use client";
// One felt woman figure, real proportions (~7.5 heads), front view, non-sexualised.
// Shared by the welcome screen (hero), loading moments (mini) and the body map.
// viewBox 0 0 200 400. x < 100 is HER RIGHT side (viewer's left).
import { useEffect, useId, useState } from "react";

export const VB = { w: 200, h: 400 };

export const SHAPES = {
  head: "M100 9 C111 9 118 19 118 32 C118 46 110 55 100 55 C90 55 82 46 82 32 C82 19 89 9 100 9 Z",
  neck: "M92 48 H108 V72 H92 Z",
  hairBack: "M79 32 C77 8 123 8 121 32 L123 56 C117 60 112 58 110 52 L90 52 C88 58 83 60 77 56 Z",
  fringe: "M82 28 C85 11 115 11 118 28 C109 21 91 21 82 28 Z",
  torso:
    "M62 76 C74 68 88 68 100 68 C112 68 126 68 138 76 C146 80 147 92 145 104 C142 124 134 146 132 166 C131 182 139 196 140 210 C141 222 132 234 118 238 L100 240 L82 238 C68 234 59 222 60 210 C61 196 69 182 68 166 C66 146 58 124 55 104 C53 92 54 80 62 76 Z",
  armRight: "M60 77 C48 78 42 90 41 104 L37 150 C35 172 34 196 34 216 C32 226 34 236 40 239 C47 240 49 230 47 218 L50 156 C51 140 52 120 54 106 Z",
  armLeft: "M140 77 C152 78 158 90 159 104 L163 150 C165 172 166 196 166 216 C168 226 166 236 160 239 C153 240 151 230 153 218 L150 156 C149 140 148 120 146 106 Z",
  legRight: "M61 212 C62 232 70 240 99 240 L97 262 C95 290 94 312 93 332 C92 352 92 372 92 384 C92 392 80 394 74 390 L77 383 C76 360 72 338 72 318 C70 296 64 270 62 242 Z",
  legLeft: "M139 212 C138 232 130 240 101 240 L103 262 C105 290 106 312 107 332 C108 352 108 372 108 384 C108 392 120 394 126 390 L123 383 C124 360 128 338 128 318 C130 296 136 270 138 242 Z",
};

/** Torso bands (clipped to the torso silhouette). Columns split at x=87 and x=113. */
export const TORSO_REGIONS = {
  chest: { x: 50, y: 60, w: 100, h: 78 },
  "upper-right": { x: 58, y: 138, w: 29, h: 34 },
  "upper-center": { x: 87, y: 138, w: 26, h: 34 },
  "upper-left": { x: 113, y: 138, w: 29, h: 34 },
  "lower-right": { x: 58, y: 172, w: 29, h: 34 },
  "lower-center": { x: 87, y: 172, w: 26, h: 34 },
  "lower-left": { x: 113, y: 172, w: 29, h: 34 },
  pelvis: { x: 56, y: 206, w: 88, h: 40 },
} as const;

export const OUTLINE = "#5A4336";

/** Felt filter: uneven cut edges (displacement) + fibre grain. */
export function FeltDefs({ id }: { id: string }) {
  return (
    <filter id={id} x="-8%" y="-8%" width="116%" height="116%">
      <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="4" result="warp" />
      <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="edge" />
      <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="9" result="fib" />
      <feColorMatrix in="fib" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.7 0 0 0 -0.75" result="fibA" />
      <feFlood floodColor="#3A2A20" floodOpacity="0.22" result="ink" />
      <feComposite in="ink" in2="fibA" operator="in" result="fibers" />
      <feComposite in="fibers" in2="edge" operator="in" result="fibersClip" />
      <feMerge>
        <feMergeNode in="edge" />
        <feMergeNode in="fibersClip" />
      </feMerge>
    </filter>
  );
}

const stitch = { fill: "none", stroke: "#fff", strokeOpacity: 0.55, strokeWidth: 1.1, strokeDasharray: "3 2.6" } as const;

/** Hero / mini figure: dressed in felt (plum jumper, moss trousers), small heart patch. */
export function FeltWomanFigure({ height = 260, className = "" }: { height?: number; className?: string }) {
  const f = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 400" height={height} width={(height * 200) / 400} className={className} aria-hidden="true">
      <defs>
        <FeltDefs id={f} />
      </defs>
      <g filter={`url(#${f})`} stroke={OUTLINE} strokeWidth="1.6" strokeLinejoin="round">
        <path d={SHAPES.hairBack} fill="#7A5C48" />
        <path d={SHAPES.legRight} fill="#6F7F5E" />
        <path d={SHAPES.legLeft} fill="#6F7F5E" />
        <path d={SHAPES.neck} fill="#C98B6B" />
        <path d={SHAPES.armRight} fill="#6B2D5C" />
        <path d={SHAPES.armLeft} fill="#6B2D5C" />
        <path d={SHAPES.torso} fill="#6B2D5C" />
        <path d={SHAPES.head} fill="#D49A78" />
        <path d={SHAPES.fringe} fill="#7A5C48" />
        {/* heart patch, held over her chest */}
        <path d="M100 128 C84 118 86 104 94 104 C97 104 99 106 100 109 C101 106 103 104 106 104 C114 104 116 118 100 128 Z" fill="#C98B6B" />
      </g>
      {/* stitching details */}
      <path d="M66 84 C80 76 120 76 134 84" {...stitch} />
      <path d="M70 226 C90 234 110 234 130 226" {...stitch} />
      <path d="M100 124 C88 116 90 108 95 108" {...stitch} />
      <path d="M78 300 L80 370 M122 300 L120 370" {...stitch} strokeOpacity={0.35} />
    </svg>
  );
}

const MESSAGES: Record<string, string[]> = {
  simile: ["Reading your image…", "Finding words that share it…", "Almost there…"],
  followups: ["Looking over your answers…", "Thinking like a clinician would…", "Writing a few gentle questions…"],
};

/** Loading moment for the Claude calls: the felt woman, a line being stitched, rotating messages. */
export function StitchLoader({ kind }: { kind: "simile" | "followups" }) {
  const msgs = MESSAGES[kind];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % msgs.length), 1700);
    return () => clearInterval(t);
  }, [msgs.length]);
  return (
    <div className="piece stitch-in flex items-center gap-4 p-4" role="status" aria-live="polite">
      <FeltWomanFigure height={84} className="sway shrink-0" />
      <div className="min-w-0 flex-1">
        <p key={i} className="stitch-in font-serif text-lg leading-snug">
          {msgs[i]}
        </p>
        <svg viewBox="0 0 200 12" className="mt-2 w-full" aria-hidden="true">
          <path d="M2 6 H198" stroke="#E4D8C6" strokeWidth="3" strokeLinecap="round" />
          <path d="M2 6 H198" className="sewing" stroke="#6B2D5C" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 6" />
        </svg>
      </div>
    </div>
  );
}
