"use client";
// Plain, calm, serious. No mascot, no texture, no cute styling.
import { useEffect, useRef } from "react";
import type { Flag } from "@/lib/redFlags";

export function RedFlagScreen({ flag, onContinue }: { flag: Flag; onContinue: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white" role="alertdialog" aria-modal="true" aria-labelledby="flag-title" aria-describedby="flag-msg">
      <div className="mx-auto flex min-h-full max-w-[430px] flex-col justify-center px-6 py-10">
        <h1 id="flag-title" ref={heading} tabIndex={-1} className="text-2xl leading-tight font-semibold text-ink outline-none">
          {flag.title}
        </h1>
        <p id="flag-msg" className="mt-4 text-lg leading-relaxed text-ink">
          {flag.message}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {flag.crisis ? (
            <>
              <a href="tel:988" className="flex min-h-12 items-center justify-center rounded-xl bg-ink px-5 font-semibold text-white">
                Call 988
              </a>
              <a href="sms:988" className="flex min-h-12 items-center justify-center rounded-xl border-2 border-ink px-5 font-semibold text-ink">
                Text 988
              </a>
            </>
          ) : null}
          <a href="tel:911" className={`flex min-h-12 items-center justify-center rounded-xl px-5 font-semibold ${flag.crisis ? "border-2 border-ink text-ink" : "bg-ink text-white"}`}>
            Call 911
          </a>
          <button type="button" onClick={onContinue} className="min-h-12 rounded-xl px-5 font-medium text-quiet underline underline-offset-4">
            I understand. Continue preparing my brief
          </button>
        </div>
        <p className="mt-6 text-sm text-quiet">Felt can&apos;t assess how urgent something is. If you&apos;re unsure, it&apos;s okay to get checked.</p>
      </div>
    </div>
  );
}
