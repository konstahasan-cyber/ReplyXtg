"use client";

import { useId, useState } from "react";
import { track } from "@/lib/analytics";

export type AccordionItem = { id?: string; title: string; content: React.ReactNode };

/** WAI-ARIA accordion: buttons with aria-expanded controlling labelled regions. */
export function Accordion({
  items,
  tone = "dark",
  analyticsEvent,
  defaultOpen = -1,
}: {
  items: AccordionItem[];
  tone?: "dark" | "light";
  analyticsEvent?: "faq_expand";
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState<number>(defaultOpen);
  const base = useId();
  const light = tone === "light";

  return (
    <div className={`border-t ${light ? "border-ivory/20" : "border-line"}`}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${base}-b${i}`;
        const panelId = `${base}-p${i}`;
        return (
          <div key={item.title} className={`border-b ${light ? "border-ivory/20" : "border-line"}`}>
            <h3 className="font-sans">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  setOpen(isOpen ? -1 : i);
                  if (!isOpen && analyticsEvent) track(analyticsEvent, { question: item.title });
                }}
                className={`group flex w-full items-start justify-between gap-6 py-6 text-left font-serif text-[1.35rem] leading-snug md:text-[1.6rem] ${
                  light ? "text-ivory" : "text-forest"
                }`}
              >
                <span>{item.title}</span>
                <span
                  aria-hidden="true"
                  className={`relative mt-2 h-4 w-4 shrink-0 ${light ? "text-clay-light" : "text-clay"}`}
                >
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
                  <span className={`absolute left-1/2 top-0 h-4 w-px bg-current transition-transform duration-300 ${isOpen ? "scale-y-0" : ""}`} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <div className={`max-w-3xl pb-7 pr-10 text-[1.02rem] leading-relaxed ${light ? "text-ivory/80" : "text-stone"}`}>{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
