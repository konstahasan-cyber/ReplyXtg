"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { projectTypes } from "@/config/planner";
import { track } from "@/lib/analytics";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Home-page entry to the planner. Answering the first question here starts the
 * planner pre-filled — a low-effort first step that carries momentum forward.
 */
export function PlannerTeaser() {
  const router = useRouter();
  const start = (value: string) => {
    track("primary_cta_click", { location: "planner_teaser", label: value });
    router.push(`/planner?type=${value}`);
  };

  return (
    <section className="section-y relative overflow-hidden bg-sand/60">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p data-reveal className="eyebrow text-clay">
            Interactive home planner
          </p>
          <h2 data-reveal className="mt-5 text-h2 text-forest">
            Every Great Home Begins With a Plan.
          </h2>
          <p data-reveal className="mt-6 text-lede text-stone">
            Seven short questions about land, size, style, budget range and timing. You&apos;ll get a personalized project
            summary with suggested next steps — in about two minutes, with no obligation.
          </p>
          <ul data-reveal className="mt-8 space-y-3 text-[0.95rem] text-charcoal">
            {["No account required", "Edit any answer before you send", "A summary you can keep or print"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <svg viewBox="0 0 16 16" className="h-4 w-4 text-clay" aria-hidden="true">
                  <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
          <div data-reveal className="mt-10">
            <ButtonLink href="/planner" onClick={() => track("primary_cta_click", { location: "planner_teaser", label: "Start Planning My Home" })}>
              Start Planning My Home
            </ButtonLink>
          </div>
        </div>

        <div data-reveal className="lg:col-span-6 lg:col-start-7">
          <div className="relative bg-ivory p-6 shadow-[0_40px_80px_-40px_rgb(32_39_36/0.35)] ring-1 ring-line sm:p-10">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-stone">
              <span>Step 1 of 7</span>
              <span aria-hidden="true" className="flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span key={i} className={`h-1 w-5 ${i === 0 ? "bg-terracotta" : "bg-line"}`} />
                ))}
              </span>
            </div>
            <fieldset className="mt-8">
              <legend className="font-serif text-[2rem] leading-tight text-forest">What are you planning?</legend>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {projectTypes.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => start(o.value)}
                    className="group flex min-h-24 flex-col justify-between border border-line bg-white p-4 text-left transition-colors hover:border-forest focus-visible:border-forest"
                  >
                    <span className="font-semibold text-charcoal">{o.label}</span>
                    <span className="mt-2 flex items-center justify-between text-sm text-stone">
                      {o.hint}
                      <span aria-hidden="true" className="text-clay transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="pointer-events-none absolute -right-6 -top-10 hidden h-28 w-40 overflow-hidden border-8 border-ivory shadow-xl md:block">
              <Image src="/images/style-california-modern.jpg" alt="" fill sizes="160px" className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
