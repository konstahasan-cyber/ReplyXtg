"use client";

import { useRef, useState } from "react";
import { processDisclaimer, processSteps } from "@/config/content";

/** Interactive process timeline — ARIA tabs with arrow-key navigation. */
export function ProcessTimeline({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const dark = tone === "dark";
  const step = processSteps[active];

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = processSteps.length - 1;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div>
      <div className="relative">
        <div className={`absolute left-0 right-0 top-[1.15rem] hidden h-px lg:block ${dark ? "bg-ivory/20" : "bg-line"}`} aria-hidden="true" />
        <div
          className="absolute left-0 top-[1.15rem] hidden h-px bg-terracotta transition-[width] duration-700 ease-[var(--ease-out-expo)] lg:block"
          style={{ width: `${(active / (processSteps.length - 1)) * 100}%` }}
          aria-hidden="true"
        />
        <div role="tablist" aria-label="Building process steps" aria-orientation="horizontal" className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
          {processSteps.map((s, i) => {
            const selected = i === active;
            const done = i < active;
            return (
              <button
                key={s.number}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`process-tab-${i}`}
                aria-selected={selected}
                aria-controls="process-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`group flex items-center gap-4 p-3 text-left transition-colors lg:flex-col lg:items-start lg:gap-5 lg:p-0 lg:pr-4 ${
                  selected ? (dark ? "bg-ivory/8 lg:bg-transparent" : "bg-sand/70 lg:bg-transparent") : ""
                }`}
              >
                <span
                  className={`relative z-10 flex h-[2.3rem] w-[2.3rem] shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-300 ${
                    selected || done
                      ? "border-terracotta bg-terracotta text-white"
                      : dark
                        ? "border-ivory/30 bg-forest text-ivory/80 group-hover:border-ivory"
                        : "border-line bg-ivory text-stone group-hover:border-forest"
                  }`}
                >
                  {s.number}
                </span>
                <span
                  className={`font-serif text-[1.3rem] leading-tight transition-colors ${
                    selected ? (dark ? "text-ivory" : "text-forest") : dark ? "text-ivory/65 group-hover:text-ivory" : "text-stone group-hover:text-forest"
                  }`}
                >
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="process-panel"
        role="tabpanel"
        aria-labelledby={`process-tab-${active}`}
        tabIndex={0}
        key={active}
        className={`mt-10 grid animate-[page-in_0.5s_var(--ease-out-quart)_both] gap-10 border-t pt-10 md:grid-cols-12 ${dark ? "border-ivory/20" : "border-line"}`}
      >
        <div className="md:col-span-6">
          <p className={`eyebrow ${dark ? "text-clay-light" : "text-clay"}`}>
            Step {step.number} of {String(processSteps.length).padStart(2, "0")}
          </p>
          <h3 className={`mt-4 text-h3 ${dark ? "text-ivory" : "text-forest"}`}>{step.title}</h3>
          <p className={`mt-4 text-lede ${dark ? "text-ivory/85" : "text-charcoal"}`}>{step.summary}</p>
          <ul className={`mt-6 space-y-3 ${dark ? "text-ivory/75" : "text-stone"}`}>
            {step.details.map((d) => (
              <li key={d} className="flex gap-3 leading-relaxed">
                <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-terracotta" />
                {d}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 md:col-span-5 md:col-start-8 md:grid-cols-1">
          <StepList title="What you'll provide" items={step.youProvide} dark={dark} />
          <StepList title="Typical outcomes" items={step.typicalOutputs} dark={dark} />
        </div>
        <div className="flex items-center justify-between gap-4 md:col-span-12">
          <button
            type="button"
            onClick={() => setActive((a) => Math.max(0, a - 1))}
            disabled={active === 0}
            className={`text-xs font-semibold uppercase tracking-[0.14em] disabled:opacity-30 ${dark ? "text-ivory" : "text-forest"}`}
          >
            ← Previous step
          </button>
          <button
            type="button"
            onClick={() => setActive((a) => Math.min(processSteps.length - 1, a + 1))}
            disabled={active === processSteps.length - 1}
            className={`text-xs font-semibold uppercase tracking-[0.14em] disabled:opacity-30 ${dark ? "text-ivory" : "text-forest"}`}
          >
            Next step →
          </button>
        </div>
      </div>

      <p className={`mt-10 flex gap-3 text-sm leading-relaxed ${dark ? "text-ivory/65" : "text-stone"}`}>
        <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
          <circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" />
          <path d="M10 9v5M10 6v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        {processDisclaimer}
      </p>
    </div>
  );
}

function StepList({ title, items, dark }: { title: string; items: string[]; dark: boolean }) {
  return (
    <div className={`border-l pl-6 ${dark ? "border-ivory/20" : "border-line"}`}>
      <h4 className={`eyebrow ${dark ? "text-ivory/60" : "text-stone"}`}>{title}</h4>
      <ul className={`mt-4 space-y-2 ${dark ? "text-ivory/90" : "text-charcoal"}`}>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
