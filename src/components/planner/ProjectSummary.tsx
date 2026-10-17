"use client";

import { useEffect, useRef } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { budgets, contactMethods, homeSizes, homeStyles, labelFor, landStatuses, projectTypes, timelines } from "@/config/planner";
import { company, isDemo } from "@/config/site";
import type { PlannerAnswers, PlannerContact } from "@/lib/leads/schema";

/** Printable project summary in a native modal <dialog> (focus trap + Esc built in). */
export function ProjectSummary({
  answers,
  contact,
  nextSteps,
  leadId,
  onClose,
}: {
  answers: PlannerAnswers;
  contact: PlannerContact;
  nextSteps: string[];
  leadId: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    return () => d?.close();
  }, []);

  const rows: [string, string][] = [
    ["Project type", labelFor(projectTypes, answers.projectType)],
    ["Land", labelFor(landStatuses, answers.landStatus)],
    ["Approximate size", labelFor(homeSizes, answers.homeSize)],
    ["Architectural style", labelFor(homeStyles, answers.style)],
    ["Planning budget (client estimate)", labelFor(budgets, answers.budget)],
    ["Timeline", labelFor(timelines, answers.timeline)],
    ["Preferred contact", labelFor(contactMethods, contact.contactMethod)],
    ["ZIP code", contact.zip],
  ];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="summary-title"
      className="m-auto max-h-[92svh] w-[min(52rem,calc(100vw-1.5rem))] overflow-y-auto bg-ivory p-0 text-charcoal backdrop:bg-charcoal/70 backdrop:backdrop-blur-sm print:max-h-none print:w-full"
    >
      <div className="p-6 sm:p-12">
        <div className="flex items-start justify-between gap-6 border-b border-line pb-6">
          <div className="flex items-center gap-3 text-forest">
            <LogoMark className="h-10 w-10" />
            <div>
              <p className="font-serif text-xl tracking-[0.06em]">AURELIA GROVE</p>
              <p className="text-[0.6rem] font-semibold tracking-[0.3em] text-stone">PROJECT SUMMARY</p>
            </div>
          </div>
          <button type="button" onClick={() => ref.current?.close()} className="no-print -m-2 p-2 text-2xl leading-none text-stone hover:text-charcoal" aria-label="Close summary">
            ×
          </button>
        </div>

        <h2 id="summary-title" className="mt-8 text-h3 text-forest">
          {contact.name}&apos;s custom home plan
        </h2>
        <p className="mt-2 text-sm text-stone">
          Prepared {new Date().toLocaleDateString("en-US", { dateStyle: "long" })} · Reference {leadId.slice(0, 8).toUpperCase()}
        </p>

        <dl className="mt-8 grid gap-x-10 sm:grid-cols-2">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-line py-3 text-sm">
              <dt className="text-stone">{k}</dt>
              <dd className="text-right font-semibold">{v}</dd>
            </div>
          ))}
        </dl>

        <h3 className="mt-10 font-serif text-2xl text-forest">Suggested next steps</h3>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
          {nextSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>

        <h3 className="mt-10 font-serif text-2xl text-forest">Questions worth preparing</h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-charcoal">
          <li>Which rooms matter most to your daily routine, and which could be smaller?</li>
          <li>What does a typical weekday and weekend look like in your future home?</li>
          <li>Which items in the budget are fixed, and where is there flexibility?</li>
        </ul>

        <p className="mt-10 border-l-2 border-terracotta pl-4 text-xs leading-relaxed text-stone">
          The budget shown is your own planning range, not a quote. Costs, timelines and requirements depend on your lot,
          design, selections and local approvals.
          {isDemo && ` ${company.demoNotice}: this summary was generated in your browser and was not sent to anyone.`}
        </p>

        <div className="no-print mt-10 flex flex-col gap-3 sm:flex-row">
          <Button type="button" onClick={() => window.print()}>
            Print or Save as PDF
          </Button>
          <Button type="button" variant="outline" onClick={() => ref.current?.close()}>
            Close
          </Button>
        </div>
      </div>
    </dialog>
  );
}
