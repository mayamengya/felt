"use client";
// Front-view body map on a realistic felt figure. Her right is on the VIEWER'S LEFT.
// Whole body first; tapping the belly zooms in so each abdomen/pelvis region is >= 44px.
import { useEffect, useId, useRef, useState } from "react";
import { REGIONS, REGION_NOTE } from "@/content/regions";
import type { RegionId } from "@/lib/types";
import { FeltDefs, OUTLINE, SHAPES, TORSO_REGIONS } from "./BodyFigure";
import { Chip } from "./ui";

const FULL = [0, 2, 200, 398];
const BELLY = [46, 126, 108, 124];
const ZOOM_REGIONS: RegionId[] = ["upper-right", "upper-center", "upper-left", "lower-right", "lower-center", "lower-left", "pelvis"];

const SKIN = "#D9A685";
const TONES: Record<string, string> = {
  chest: "#E2C49A",
  "upper-right": "#E9D2AE",
  "upper-center": "#DFC39C",
  "upper-left": "#E9D2AE",
  "lower-right": "#DFC39C",
  "lower-center": "#E9D2AE",
  "lower-left": "#DFC39C",
  pelvis: "#D9AE8A",
};

/** Smoothly animate an SVG viewBox between targets. */
function useViewBox(target: number[]) {
  const [vb, setVb] = useState(target);
  const cur = useRef(target);
  const key = target.join(" ");
  useEffect(() => {
    const from = cur.current;
    const to = key.split(" ").map(Number);
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 520);
      const e = 1 - Math.pow(1 - p, 3);
      const v = from.map((f, i) => f + (to[i] - f) * e);
      cur.current = v;
      setVb(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [key]);
  return vb.join(" ");
}

export function BodyMap({ value, onChange }: { value: RegionId[]; onChange: (v: RegionId[]) => void }) {
  const uid = useId().replace(/:/g, "");
  const [zoom, setZoom] = useState(value.some((r) => ZOOM_REGIONS.includes(r)));
  const [focus, setFocus] = useState<RegionId | null>(value.at(-1) ?? null);
  const viewBox = useViewBox(zoom ? BELLY : FULL);

  const toggle = (id: RegionId) => {
    const on = value.includes(id);
    const next = on ? value.filter((r) => r !== id) : [...value, id];
    onChange(next);
    setFocus(on ? (next.at(-1) ?? null) : id);
  };

  const piece = (id: RegionId, shape: React.ReactNode, _wide = 0) => {
    void _wide;
    const on = value.includes(id);
    const label = REGIONS[id].label;
    return (
      <g
        key={id}
        role="button"
        tabIndex={0}
        aria-pressed={on}
        aria-label={label}
        className="region cursor-pointer"
        data-on={on}
        onClick={() => toggle(id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle(id);
          }
        }}
      >
        <title>{label}</title>
        {shape}
      </g>
    );
  };

  const fill = (id: RegionId, base: string) => (value.includes(id) ? "#6B2D5C" : base);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-11 items-center justify-between gap-2">
        <p className="text-sm text-quiet">{zoom ? "Zoomed in on your belly." : "Tap where you feel it. Tap the belly to zoom in."}</p>
        {zoom ? (
          <button type="button" className="chip shrink-0 !min-h-10 text-sm font-semibold" onClick={() => setZoom(false)}>
            ← Whole body
          </button>
        ) : null}
      </div>

      <div className="piece relative min-h-0 flex-1 overflow-hidden">
        <svg viewBox={viewBox} className="absolute inset-0 h-full w-full" role="group" aria-label="Body map, front view. Your right side is on the left of the picture.">
          <defs>
            <FeltDefs id={`f${uid}`} />
            <clipPath id={`t${uid}`}>
              <path d={SHAPES.torso} />
            </clipPath>
          </defs>

          <g filter={`url(#f${uid})`}>
            <path d={SHAPES.hairBack} fill="#7A5C48" stroke={OUTLINE} strokeWidth="1.4" aria-hidden="true" />
            {piece("leg-right", <path d={SHAPES.legRight} fill={fill("leg-right", SKIN)} stroke={OUTLINE} strokeWidth="1.4" />, 1)}
            {piece("leg-left", <path d={SHAPES.legLeft} fill={fill("leg-left", SKIN)} stroke={OUTLINE} strokeWidth="1.4" />, 1)}
            <path d={SHAPES.neck} fill={SKIN} stroke={OUTLINE} strokeWidth="1.4" aria-hidden="true" />
            {piece("arm-right", <path d={SHAPES.armRight} fill={fill("arm-right", SKIN)} stroke={OUTLINE} strokeWidth="1.4" />, 1)}
            {piece("arm-left", <path d={SHAPES.armLeft} fill={fill("arm-left", SKIN)} stroke={OUTLINE} strokeWidth="1.4" />, 1)}

            {/* torso: one silhouette, cut into felt pieces along seams */}
            <g clipPath={`url(#t${uid})`}>
              {(Object.keys(TORSO_REGIONS) as (keyof typeof TORSO_REGIONS)[]).map((id) => {
                const r = TORSO_REGIONS[id];
                const on = value.includes(id);
                return piece(
                  id,
                  <>
                    <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={fill(id, TONES[id])} stroke="#F8F2E8" strokeWidth="1.6" />
                    <rect
                      x={r.x + 3}
                      y={r.y + 3}
                      width={r.w - 6}
                      height={r.h - 6}
                      rx="3"
                      fill="none"
                      stroke={on ? "#fff" : OUTLINE}
                      strokeOpacity={on ? 0.8 : 0.25}
                      strokeWidth={zoom ? 0.7 : 0.9}
                      strokeDasharray={zoom ? "2.2 1.8" : "3 2.5"}
                      pointerEvents="none"
                    />
                  </>,
                );
              })}
            </g>
            <path d={SHAPES.torso} fill="none" stroke={OUTLINE} strokeWidth="1.6" pointerEvents="none" />
            {piece("head", <path d={SHAPES.head} fill={fill("head", SKIN)} stroke={OUTLINE} strokeWidth="1.4" />)}
            <path d={SHAPES.fringe} fill="#7A5C48" stroke={OUTLINE} strokeWidth="1.2" pointerEvents="none" />
          </g>

          {/* whole-body view: the belly is one big target that zooms in */}
          {!zoom ? (
            <g
              role="button"
              tabIndex={0}
              aria-label="Zoom in on the belly and pelvis"
              className="cursor-pointer"
              onClick={() => setZoom(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setZoom(true);
                }
              }}
            >
              <rect x="56" y="136" width="88" height="106" rx="16" fill="#6B2D5C" fillOpacity="0.06" stroke="#6B2D5C" strokeWidth="1.4" strokeDasharray="4 3" className="pulse-ring" />
              <g transform="translate(100 252)">
                <rect x="-26" y="-7" width="52" height="14" rx="7" fill="#6B2D5C" />
                <text textAnchor="middle" y="3.6" fontSize="9" fontWeight="700" fill="#fff" fontFamily="var(--font-sans)">
                  Zoom +
                </text>
              </g>
            </g>
          ) : null}
        </svg>
        <div className="pointer-events-none absolute inset-x-3 bottom-2 flex justify-between text-xs font-semibold text-quiet" aria-hidden="true">
          <span>← Your right</span>
          <span>Your left →</span>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        {(["lower-back", "general"] as RegionId[]).map((id) => (
          <Chip key={id} selected={value.includes(id)} onClick={() => toggle(id)}>
            <span className="text-sm">{REGIONS[id].label}</span>
          </Chip>
        ))}
      </div>

      {focus ? (
        <div key={focus} className="stitch-in mt-3 rounded-2xl bg-cream p-3 shadow-[0_2px_0_var(--color-cream-dark)]">
          <p className="font-serif font-semibold">{REGIONS[focus].label}</p>
          <p className="mt-0.5 text-sm leading-snug">{REGIONS[focus].inside}</p>
          <p className="mt-1 text-xs leading-snug text-quiet">{REGION_NOTE}</p>
        </div>
      ) : null}
    </div>
  );
}
