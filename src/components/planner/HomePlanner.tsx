"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  budgets,
  contactMethods,
  homeSizes,
  homeStyles,
  labelFor,
  landStatuses,
  projectTypes,
  timelines,
  type Option,
} from "@/config/planner";
import { isDemo } from "@/config/site";
import { plannerContactSchema, type PlannerAnswers, type PlannerContact } from "@/lib/leads/schema";
import { isServiceZip, nextStepsFor } from "@/lib/leads/scoring";
import { submitLead } from "@/lib/leads/client";
import { track, trackLeadConversion } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Checkbox, ChoiceGroup, Honeypot, TextField } from "@/components/forms/Field";
import { ProjectSummary } from "./ProjectSummary";

type AnswerKey = keyof PlannerAnswers;

type ChoiceStep = {
  key: AnswerKey;
  name: string;
  title: string;
  intro: string;
  options: readonly (Option & { image?: string })[];
  note?: string;
  layout?: "cards" | "images";
};

const choiceSteps: ChoiceStep[] = [
  { key: "projectType", name: "Project", title: "What are you planning?", intro: "Choose the option closest to where you are today.", options: projectTypes },
  { key: "landStatus", name: "Land", title: "Do you already own land?", intro: "It's completely fine if you're still looking — many people start here.", options: landStatuses },
  { key: "homeSize", name: "Size", title: "What size home do you have in mind?", intro: "A rough range is all we need. Size is one of the biggest drivers of budget.", options: homeSizes },
  { key: "style", name: "Style", title: "Which architectural style feels like home?", intro: "Pick the one that resonates most. Every design is tailored — this is just a starting point.", options: homeStyles, layout: "images" },
  {
    key: "budget",
    name: "Budget",
    title: "What is your planning budget?",
    intro: "Your comfortable range for the home itself, excluding land.",
    options: budgets,
    note: "This is your own planning range — it helps us frame the conversation. It is not a quote or a promise of construction cost, which depends on your lot, design, finishes and local requirements.",
  },
  { key: "timeline", name: "Timeline", title: "When would you like to begin?", intro: "Design and permitting usually come before construction, so earlier conversations help.", options: timelines },
];

const TOTAL = 7; // 6 choice steps + contact
const STORAGE_KEY = "ag_planner_v1";

type Stored = { step: number; answers: Partial<PlannerAnswers>; contact?: Partial<PlannerContact>; startedAt?: number };

const readStored = (): Stored | null => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
};

const subscribeNoop = () => () => {};

/** Renders the planner only in the browser, where saved progress can be read synchronously. */
export function HomePlanner() {
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);
  return isClient ? <Planner /> : <div className="min-h-[80svh] bg-ivory" />;
}

type Initial = Stored & { prefilled?: string };

function initialState(type: string | null): Initial {
  const stored = readStored();
  const prefill = projectTypes.find((o) => o.value === type)?.value;
  if (prefill && !stored?.answers.projectType) {
    return { step: 1, answers: { ...stored?.answers, projectType: prefill }, contact: stored?.contact, startedAt: Date.now(), prefilled: prefill };
  }
  if (stored) return { ...stored, step: Math.min(stored.step, TOTAL - 1) };
  return { step: 0, answers: {} };
}

function Planner() {
  const params = useSearchParams();
  const [init] = useState(() => initialState(params.get("type")));
  const [step, setStep] = useState(init.step);
  const [answers, setAnswers] = useState<Partial<PlannerAnswers>>(init.answers);
  const [submitted, setSubmitted] = useState<{ firstName: string; leadId: string; delivered: boolean } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [returnToContact, setReturnToContact] = useState(false);
  const startedAt = useRef<number | undefined>(init.startedAt);
  const started = useRef(Boolean(init.startedAt));
  const pointerSelect = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const form = useForm<PlannerContact>({
    resolver: zodResolver(plannerContactSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      zip: "",
      contactMethod: "email",
      ...init.contact,
      consent: false as unknown as true,
    },
  });
  const { register, handleSubmit, formState, setError, control } = form;
  const [honeypot, setHoneypot] = useState("");

  // Arriving from the home-page teaser counts as starting the planner with step 1 answered.
  useEffect(() => {
    if (!init.prefilled) return;
    track("planner_start", { source: "teaser" });
    track("planner_step_complete", { step: 1, step_name: "Project", value: init.prefilled });
  }, [init.prefilled]);

  const contactDraft = useWatch({ control });
  useEffect(() => {
    if (submitted) return;
    const { consent: _c, ...draft } = contactDraft;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers, contact: draft, startedAt: startedAt.current } satisfies Stored));
    } catch {
      /* storage unavailable */
    }
  }, [step, answers, contactDraft, submitted]);

  // Abandonment: started but left before submitting.
  useEffect(() => {
    const onHide = () => {
      if (started.current && !submitted) track("planner_abandon", { last_step: step + 1 });
    };
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      if (started.current && !submitted) onHide();
    };
  }, [step, submitted]);

  // Move focus to the new step heading for keyboard and screen-reader users.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, submitted]);

  function begin(source: string) {
    if (started.current) return;
    started.current = true;
    startedAt.current = Date.now();
    track("planner_start", { source });
  }

  const goTo = useCallback((i: number) => {
    clearTimeout(advanceTimer.current);
    setStepError(null);
    setStep(i);
  }, []);

  const choose = (key: AnswerKey, value: string) => {
    begin("planner");
    setStepError(null);
    setAnswers((a) => ({ ...a, [key]: value }));
    if (pointerSelect.current) {
      pointerSelect.current = false;
      clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => completeStep(key, value), 320);
    }
  };

  const completeStep = (key: AnswerKey, value: string | undefined = answers[key]) => {
    const cs = choiceSteps[step];
    if (!value) {
      setStepError(`Please choose an option to continue.`);
      track("planner_error", { step: step + 1, step_name: cs.name, error: "no_selection" });
      return;
    }
    track("planner_step_complete", { step: step + 1, step_name: cs.name, value });
    // Skip ahead to contact if the visitor came back from the review to edit a single answer.
    const allAnswered = choiceSteps.every((s) => (s.key === key ? value : answers[s.key]));
    setStep(allAnswered && returnToContact ? TOTAL - 1 : step + 1);
    setReturnToContact(false);
  };

  const onSubmit = async (contact: PlannerContact) => {
    setServerError(null);
    const missing = choiceSteps.find((s) => !answers[s.key]);
    if (missing) {
      goTo(choiceSteps.indexOf(missing));
      setStepError("Please answer this question before sending.");
      return;
    }
    const result = await submitLead(
      { kind: "planner", answers: answers as PlannerAnswers, contact },
      { startedAt: startedAt.current, website: honeypot },
    );
    if (!result.ok) {
      setServerError(result.error);
      for (const [field, msgs] of Object.entries(result.fieldErrors ?? {})) {
        const name = field.replace(/^contact\./, "") as keyof PlannerContact;
        if (name in contact) setError(name, { message: msgs[0] });
      }
      track("planner_error", { step: TOTAL, step_name: "Contact", error: "server_validation" });
      return;
    }
    track("planner_step_complete", { step: TOTAL, step_name: "Contact" });
    track("planner_submit", { fit: result.fit, project_type: answers.projectType, style: answers.style, budget: answers.budget });
    trackLeadConversion("planner");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setSubmitted({ firstName: contact.name.split(" ")[0], leadId: result.leadId, delivered: result.delivered });
  };

  const onInvalid = (errors: Record<string, unknown>) =>
    track("planner_error", { step: TOTAL, step_name: "Contact", error: Object.keys(errors).join(",") });

  const progress = submitted ? 100 : Math.round((step / TOTAL) * 100);
  const styleImage = homeStyles.find((s) => s.value === answers.style)?.image ?? "/images/style-california-modern.jpg";
  const zip = contactDraft.zip ?? "";
  const outsideArea = /^\d{5}$/.test(zip ?? "") && !isServiceZip(zip);
  const nextSteps = useMemo(() => (submitted ? nextStepsFor(answers as PlannerAnswers) : []), [submitted, answers]);

  return (
    <div className="grid min-h-[calc(100svh-7rem)] lg:grid-cols-12">
      {/* Side panel */}
      <aside className="on-dark relative hidden overflow-hidden bg-forest text-ivory lg:col-span-4 lg:block">
        <Image key={styleImage} src={styleImage} alt="" fill sizes="33vw" className="animate-[page-in_0.8s_ease_both] object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/40 via-forest/70 to-forest" aria-hidden="true" />
        <div className="relative flex h-full flex-col p-10 xl:p-14">
          <p className="eyebrow text-clay-light">Home Planner</p>
          <p className="mt-4 font-serif text-4xl leading-tight">Let&apos;s shape your project.</p>
          <nav aria-label="Planner steps" className="mt-12">
            <ol className="space-y-1">
              {[...choiceSteps.map((s) => ({ name: s.name, value: labelFor(s.options, answers[s.key]) })), { name: "Contact", value: "" }].map(
                (s, i) => {
                  const done = submitted || i < step || (i < TOTAL - 1 && answers[choiceSteps[i].key]);
                  const current = !submitted && i === step;
                  const canJump = !submitted && (i <= step || Boolean(done));
                  return (
                    <li key={s.name}>
                      <button
                        type="button"
                        disabled={!canJump}
                        onClick={() => {
                          setReturnToContact(step === TOTAL - 1 && i < step);
                          goTo(i);
                        }}
                        aria-current={current ? "step" : undefined}
                        className="group flex w-full items-center gap-4 py-2.5 text-left disabled:cursor-default"
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-semibold ${
                            current ? "border-ivory bg-ivory text-forest" : done ? "border-terracotta bg-terracotta text-white" : "border-ivory/30 text-ivory/60"
                          }`}
                        >
                          {done && !current ? "✓" : i + 1}
                        </span>
                        <span className="min-w-0">
                          <span className={`block text-sm font-semibold ${current ? "text-ivory" : "text-ivory/75"}`}>{s.name}</span>
                          {done && s.value && s.value !== "—" && (
                            <span className="block truncate text-xs text-ivory/60 group-enabled:group-hover:text-ivory">{s.value} · Edit</span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                },
              )}
            </ol>
          </nav>
          <p className="mt-auto pt-10 text-xs leading-relaxed text-ivory/60">
            Your answers are kept in this browser tab only until you send them.
            {isDemo && " In this demo, nothing is sent to a real company."}
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col bg-ivory lg:col-span-8">
        <div className="sticky top-20 z-10 border-b border-line bg-ivory/95 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-6 px-5 py-4 sm:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone" aria-live="polite">
              {submitted ? "Complete" : `Step ${step + 1} of ${TOTAL} · ${step < TOTAL - 1 ? choiceSteps[step].name : "Contact"}`}
            </p>
            <div
              className="h-1 w-32 bg-line sm:w-56"
              role="progressbar"
              aria-label="Planner progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div className="h-full bg-terracotta transition-[width] duration-700 ease-[var(--ease-out-expo)]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-10 md:py-16">
          {submitted ? (
            <Confirmation
              headingRef={headingRef}
              firstName={submitted.firstName}
              answers={answers as PlannerAnswers}
              nextSteps={nextSteps}
              onViewSummary={() => setSummaryOpen(true)}
            />
          ) : step < TOTAL - 1 ? (
            <ChoiceStepView
              key={step}
              cs={choiceSteps[step]}
              index={step}
              value={answers[choiceSteps[step].key]}
              error={stepError}
              headingRef={headingRef}
              onPointer={() => (pointerSelect.current = true)}
              onChoose={(v) => choose(choiceSteps[step].key, v)}
              onBack={step > 0 ? () => goTo(step - 1) : undefined}
              onContinue={() => completeStep(choiceSteps[step].key)}
            />
          ) : (
            <form onSubmit={(e) => handleSubmit(onSubmit, onInvalid)(e)} noValidate className="relative animate-[page-in_0.5s_ease_both]">
              <p className="eyebrow text-clay">Step 7 · Almost done</p>
              <h1 ref={headingRef} tabIndex={-1} className="mt-4 text-h2 text-forest outline-none">
                Where should we send your project summary?
              </h1>
              <p className="mt-4 text-lede text-stone">We&apos;ll use this only to follow up about your home. No newsletters unless you ask.</p>

              <AnswerReview
                answers={answers}
                onEdit={(i) => {
                  setReturnToContact(true);
                  goTo(i);
                }}
              />

              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <TextField label="Name" autoComplete="name" error={formState.errors.name?.message} {...register("name")} />
                <TextField label="Email" type="email" autoComplete="email" inputMode="email" error={formState.errors.email?.message} {...register("email")} />
                <TextField label="Phone" type="tel" autoComplete="tel" inputMode="tel" optional error={formState.errors.phone?.message} {...register("phone")} />
                <TextField
                  label="ZIP code"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  maxLength={5}
                  error={formState.errors.zip?.message}
                  hint={outsideArea ? "This looks outside our usual service region — send it anyway and we'll let you know if we can help." : "Where you plan to build, or where you live now."}
                  {...register("zip")}
                />
              </div>
              <div className="mt-8">
                <ChoiceGroup
                  name="contactMethod"
                  legend="Preferred contact method"
                  options={contactMethods}
                  value={contactDraft.contactMethod}
                  onChange={(v) => form.setValue("contactMethod", v, { shouldValidate: true })}
                  columns={3}
                />
              </div>
              <Checkbox
                className="mt-8"
                error={formState.errors.consent?.message}
                label={
                  <>
                    I agree to be contacted about my project and accept the{" "}
                    <Link href="/privacy" className="font-semibold text-forest underline underline-offset-4" target="_blank">
                      Privacy Policy
                    </Link>
                    .
                  </>
                }
                {...register("consent")}
              />
              <Honeypot name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />

              {serverError && (
                <p role="alert" className="mt-8 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-900">
                  {serverError}
                </p>
              )}
              {isDemo && (
                <p className="mt-8 text-sm text-stone">
                  <strong className="font-semibold text-charcoal">Demo:</strong> your submission is validated and saved locally in this
                  browser. No email is sent and no real company receives it.
                </p>
              )}

              <div className="mt-10 flex flex-col-reverse gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={() => goTo(TOTAL - 2)} className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
                  ← Back
                </button>
                <Button type="submit" arrow disabled={formState.isSubmitting}>
                  {formState.isSubmitting ? "Sending…" : "See My Project Summary"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {summaryOpen && submitted && (
        <ProjectSummary
          answers={answers as PlannerAnswers}
          contact={form.getValues()}
          nextSteps={nextSteps}
          leadId={submitted.leadId}
          onClose={() => setSummaryOpen(false)}
        />
      )}
    </div>
  );
}

function ChoiceStepView({
  cs,
  index,
  value,
  error,
  headingRef,
  onChoose,
  onPointer,
  onBack,
  onContinue,
}: {
  cs: ChoiceStep;
  index: number;
  value?: string;
  error: string | null;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onChoose: (v: string) => void;
  onPointer: () => void;
  onBack?: () => void;
  onContinue: () => void;
}) {
  const images = cs.layout === "images";
  return (
    <div className="animate-[page-in_0.5s_ease_both]">
      <p className="eyebrow text-clay">Step {index + 1}</p>
      <h1 ref={headingRef} tabIndex={-1} id={`q-${cs.key}`} className="mt-4 text-h2 text-forest outline-none">
        {cs.title}
      </h1>
      <p className="mt-4 text-lede text-stone">{cs.intro}</p>

      <div
        role="radiogroup"
        aria-labelledby={`q-${cs.key}`}
        aria-describedby={error ? `err-${cs.key}` : undefined}
        className={`mt-10 grid gap-3 ${images ? "grid-cols-2 md:grid-cols-3" : "sm:grid-cols-2"}`}
      >
        {cs.options.map((o) => {
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              onPointerDown={onPointer}
              className={`group relative flex cursor-pointer flex-col overflow-hidden border bg-white text-left transition-[border-color,box-shadow] duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta ${
                checked ? "border-forest shadow-[inset_0_0_0_1px_var(--color-forest)]" : "border-line hover:border-forest/50"
              }`}
            >
              <input
                type="radio"
                name={cs.key}
                value={o.value}
                checked={checked}
                onChange={() => onChoose(o.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), onContinue())}
                className="sr-only"
              />
              {images && o.image && (
                <span className="relative block aspect-[4/3] overflow-hidden bg-sand">
                  <Image src={o.image} alt="" fill sizes="(min-width: 768px) 240px, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </span>
              )}
              <span className={`flex flex-1 items-start justify-between gap-3 ${images ? "p-4" : "min-h-20 p-5"}`}>
                <span>
                  <span className="block font-semibold text-charcoal">{o.label}</span>
                  {o.hint && <span className="mt-1 block text-sm leading-snug text-stone">{o.hint}</span>}
                </span>
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    checked ? "border-forest bg-forest" : "border-line"
                  }`}
                >
                  {checked && <span className="h-1.5 w-1.5 rounded-full bg-ivory" />}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      {cs.note && (
        <p className="mt-6 border-l-2 border-terracotta bg-sand/50 px-4 py-3 text-sm leading-relaxed text-charcoal">{cs.note}</p>
      )}
      {error && (
        <p id={`err-${cs.key}`} role="alert" className="mt-6 text-sm font-medium text-red-800">
          {error}
        </p>
      )}

      <div className="mt-12 flex items-center justify-between border-t border-line pt-8">
        {onBack ? (
          <button type="button" onClick={onBack} className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
            ← Back
          </button>
        ) : (
          <span />
        )}
        <Button type="button" onClick={onContinue} arrow>
          Continue
        </Button>
      </div>
    </div>
  );
}

function AnswerReview({ answers, onEdit }: { answers: Partial<PlannerAnswers>; onEdit: (i: number) => void }) {
  return (
    <div className="mt-8 bg-sand/50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone">Your answers</p>
      <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        {choiceSteps.map((s, i) => (
          <div key={s.key} className="flex items-baseline justify-between gap-3 border-b border-line/70 py-1.5">
            <dt className="text-stone">{s.name}</dt>
            <dd className="flex items-baseline gap-3 text-right font-medium text-charcoal">
              {labelFor(s.options, answers[s.key])}
              <button type="button" onClick={() => onEdit(i)} className="text-xs font-semibold text-clay underline underline-offset-2">
                Edit<span className="sr-only"> {s.name}</span>
              </button>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Confirmation({
  headingRef,
  firstName,
  answers,
  nextSteps,
  onViewSummary,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  firstName: string;
  answers: PlannerAnswers;
  nextSteps: string[];
  onViewSummary: () => void;
}) {
  const style = labelFor(homeStyles, answers.style);
  const rows = [
    ["Project type", labelFor(projectTypes, answers.projectType)],
    ["Selected style", style],
    ["Approximate size", labelFor(homeSizes, answers.homeSize)],
    ["Budget preference", labelFor(budgets, answers.budget)],
  ];
  return (
    <div className="animate-[page-in_0.6s_ease_both]">
      {isDemo && (
        <p className="inline-flex items-center gap-2 bg-forest px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ivory" role="status">
          <span className="h-1.5 w-1.5 rounded-full bg-terracotta" aria-hidden="true" />
          Demo submission saved locally
        </p>
      )}
      <h1 ref={headingRef} tabIndex={-1} className="mt-6 text-h2 text-forest outline-none">
        Thank you, {firstName}. Your {answers.style === "unsure" ? "custom home" : style} plan is taking shape.
      </h1>
      <p className="mt-5 text-lede text-stone">
        {isDemo
          ? "In a live site, a project coordinator would review your answers and reply using your preferred contact method. In this demo, nothing was sent."
          : "We'll review your answers and reply using your preferred contact method."}
      </p>

      <dl className="mt-10 grid gap-px bg-line sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="bg-white p-6">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone">{k}</dt>
            <dd className="mt-2 font-serif text-2xl text-forest">{v}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-12 font-serif text-3xl text-forest">Suggested next planning steps</h2>
      <ol className="mt-6 space-y-4">
        {nextSteps.map((s, i) => (
          <li key={s} className="flex gap-4">
            <span className="font-serif text-2xl leading-none text-clay">{i + 1}</span>
            <span className="leading-relaxed text-charcoal">{s}</span>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center">
        <Button type="button" onClick={onViewSummary} arrow>
          View My Project Summary
        </Button>
        <Link href="/process" className="link-underline text-xs font-semibold uppercase tracking-[0.14em] text-forest sm:ml-4">
          Understand the Building Process
        </Link>
      </div>
    </div>
  );
}
