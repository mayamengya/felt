"use client";
import type { ReactNode } from "react";
import type { Source } from "@/lib/types";

export function StepHeader({ step, total, title, why }: { step?: number; total?: number; title: string; why?: string }) {
  return (
    <header className="mb-5">
      {step && total ? (
        <p className="mb-2 text-sm font-medium text-quiet">
          Step {step} of {total}
        </p>
      ) : null}
      <h1 className="font-serif text-[1.75rem] leading-tight font-semibold text-ink">{title}</h1>
      {why ? <Why text={why} /> : null}
    </header>
  );
}

/** One-line "Why a clinician asks this". */
export function Why({ text }: { text: string }) {
  return (
    <p className="mt-2 text-sm leading-snug text-quiet">
      <span className="font-semibold">Why a clinician asks: </span>
      {text}
    </p>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`piece stitch p-5 ${className}`}>{children}</section>;
}

export function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className="chip text-[0.95rem]" aria-pressed={selected} onClick={onClick}>
      {children}
    </button>
  );
}

/** Tap-to-answer chips. Single-select toggles off when tapped again. Nothing is pre-selected. */
export function ChipGroup({
  label,
  options,
  value,
  onChange,
  multi = false,
}: {
  label?: string;
  options: string[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multi?: boolean;
}) {
  const isOn = (o: string) => (multi ? (value as string[]).includes(o) : value === o);
  const toggle = (o: string) => {
    if (multi) {
      const v = value as string[];
      onChange(v.includes(o) ? v.filter((x) => x !== o) : [...v, o]);
    } else onChange(value === o ? "" : o);
  };
  return (
    <fieldset className="mt-3">
      {label ? <legend className="mb-2 font-semibold text-ink">{label}</legend> : null}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <Chip key={o} selected={isOn(o)} onClick={() => toggle(o)}>
            {o}
          </Chip>
        ))}
      </div>
    </fieldset>
  );
}

export function TextBox({
  value,
  onChange,
  placeholder,
  label,
  rows = 3,
  tone = "plain",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label: string;
  rows?: number;
  tone?: "plain" | "her";
}) {
  const her = tone === "her";
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`min-h-24 w-full resize-none rounded-2xl border-2 p-4 text-[1.05rem] leading-relaxed placeholder:text-quiet/70 focus:outline-none ${
          her ? "border-moss bg-moss-tint font-serif italic" : "border-cream-dark bg-white/70"
        }`}
      />
    </label>
  );
}

const TAG: Record<Source, { label: string; cls: string }> = {
  her: { label: "Her words", cls: "bg-moss-tint text-moss-ink" },
  chose: { label: "She chose", cls: "bg-plum text-white" },
  info: { label: "Background info", cls: "bg-[#E8E2DA] text-quiet" },
};

export function SourceTag({ source }: { source: Source }) {
  const t = TAG[source];
  return <span className={`inline-block shrink-0 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold tracking-wide uppercase ${t.cls}`}>{t.label}</span>;
}

/**
 * One app screen: header + progress at the top, a scroll area INSIDE the step,
 * and a fixed footer. The page itself never scrolls.
 */
export function Screen({
  progress,
  label,
  title,
  why,
  children,
  footer,
  scroll = true,
}: {
  progress?: number; // 0..1
  label?: string;
  title?: string;
  why?: string;
  children: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      {title ? (
        <header className="shrink-0 px-5 pt-3 pb-2">
          {progress !== undefined ? (
            <div className="no-print mb-3 flex items-center gap-3">
              <div className="progress flex-1" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
                <span style={{ width: `${Math.max(4, progress * 100)}%` }} />
              </div>
              {label ? <span className="text-xs font-semibold whitespace-nowrap text-quiet">{label}</span> : null}
            </div>
          ) : null}
          <h1 className="font-serif text-[1.6rem] leading-tight font-semibold text-ink">{title}</h1>
          {why ? <Why text={why} /> : null}
        </header>
      ) : null}
      <div className={`min-h-0 flex-1 px-5 pt-2 pb-3 ${scroll ? "step-scroll" : "flex flex-col"}`}>{children}</div>
      {footer ? <footer className="no-print shrink-0 px-4 pt-2 pb-[max(14px,env(safe-area-inset-bottom))]">{footer}</footer> : null}
    </div>
  );
}

export function NavBar({
  onBack,
  onNext,
  nextLabel = "Next",
  nextDisabled,
  middle,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  middle?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      {onBack ? (
        <button type="button" className="btn btn-ghost !h-12 !w-12 !px-0 text-xl" onClick={onBack} aria-label="Back">
          ←
        </button>
      ) : (
        <span className="w-12" />
      )}
      <div className="flex min-w-0 flex-1 justify-center">{middle}</div>
      {onNext ? (
        <button type="button" className="btn btn-primary shrink-0" onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
        </button>
      ) : null}
    </div>
  );
}
