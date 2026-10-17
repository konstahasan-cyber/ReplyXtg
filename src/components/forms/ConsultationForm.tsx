"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgets, contactMethods, landStatuses, timelines, type Budget, type ContactMethod, type LandStatus, type Timeline } from "@/config/planner";
import { isDemo } from "@/config/site";
import { consultationSchema, type ConsultationInput } from "@/lib/leads/schema";
import { isServiceZip } from "@/lib/leads/scoring";
import { submitLead } from "@/lib/leads/client";
import { track, trackLeadConversion } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Checkbox, ChoiceGroup, Honeypot, TextArea, TextField } from "./Field";

const DRAFT_KEY = "ag_consult_draft";

/**
 * Two-stage consultation form.
 * Stage 1 asks only for what's needed to reply (name, email, message).
 * Stage 2 — shown after the lead is safely captured — offers optional
 * qualification questions, so qualification never blocks the first contact.
 */
export function ConsultationForm({ source = "contact_page" }: { source?: string }) {
  const [stage, setStage] = useState<"contact" | "qualify" | "done">("contact");
  const [leadId, setLeadId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef<number | undefined>(undefined);
  const statusRef = useRef<HTMLHeadingElement>(null);

  const { register, handleSubmit, formState, setError, reset, control } = useForm<ConsultationInput>({
    resolver: zodResolver(consultationSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", phone: "", message: "", consent: false as unknown as true },
  });

  // Keep a draft in this tab so nothing typed is lost on refresh or error.
  useEffect(() => {
    try {
      const d = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "null");
      if (d) reset({ ...d, consent: false as unknown as true });
    } catch {
      /* ignore */
    }
  }, [reset]);
  const draft = useWatch({ control });
  useEffect(() => {
    if (stage !== "contact") return;
    const { consent: _c, ...rest } = draft;
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
    } catch {
      /* ignore */
    }
  }, [draft, stage]);

  useEffect(() => {
    if (stage !== "contact") statusRef.current?.focus();
  }, [stage]);

  // Render time anchors the anti-bot time trap; first focus marks a genuine start.
  const startTracked = useRef(false);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const onFocusCapture = () => {
    if (startTracked.current) return;
    startTracked.current = true;
    track("consultation_form_start", { source });
  };

  const onSubmit = async (contact: ConsultationInput) => {
    setServerError(null);
    const result = await submitLead({ kind: "consultation", contact }, { startedAt: startedAt.current, website: honeypot });
    if (!result.ok) {
      setServerError(result.error);
      for (const [field, msgs] of Object.entries(result.fieldErrors ?? {})) {
        const name = field.replace(/^contact\./, "") as keyof ConsultationInput;
        if (name in contact) setError(name, { message: msgs[0] });
      }
      track("consultation_form_error", { source, error: "server_validation" });
      return;
    }
    track("consultation_form_submit", { source });
    trackLeadConversion("consultation");
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    setLeadId(result.leadId);
    setFirstName(contact.name.split(" ")[0]);
    setStage("qualify");
  };

  if (stage === "qualify") {
    return <Qualification leadId={leadId} firstName={firstName} statusRef={statusRef} onDone={() => setStage("done")} />;
  }

  if (stage === "done") {
    return (
      <div className="animate-[page-in_0.5s_ease_both]" role="status">
        {isDemo && <DemoBadge />}
        <h2 ref={statusRef} tabIndex={-1} className="mt-5 text-h3 text-forest outline-none">
          Thank you, {firstName}. You&apos;re all set.
        </h2>
        <p className="mt-4 leading-relaxed text-stone">
          {isDemo
            ? "In a live site, the team would reply using your preferred contact method. This demo did not send your message anywhere."
            : "We'll reply using your preferred contact method. In the meantime, you might enjoy exploring our process."}
        </p>
        <div className="mt-8 flex flex-wrap gap-6 text-xs font-semibold uppercase tracking-[0.14em] text-forest">
          <Link href="/process" className="link-underline">
            Understand the Building Process →
          </Link>
          <Link href="/home-designs" className="link-underline">
            Explore Home Designs →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(ev) => handleSubmit(onSubmit, (e) => track("consultation_form_error", { source, error: Object.keys(e).join(",") }))(ev)} onFocusCapture={onFocusCapture} noValidate className="relative">
      <div className="grid gap-8 sm:grid-cols-2">
        <TextField label="Name" autoComplete="name" error={formState.errors.name?.message} {...register("name")} />
        <TextField label="Email" type="email" inputMode="email" autoComplete="email" error={formState.errors.email?.message} {...register("email")} />
        <TextField
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          optional
          className="sm:col-span-2"
          error={formState.errors.phone?.message}
          {...register("phone")}
        />
        <TextArea
          label="What are you imagining?"
          className="sm:col-span-2"
          placeholder="A few words about your home, your lot or your questions."
          error={formState.errors.message?.message}
          {...register("message")}
        />
      </div>
      <Checkbox
        className="mt-8"
        error={formState.errors.consent?.message}
        label={
          <>
            I agree to be contacted about my project and accept the{" "}
            <Link href="/privacy" className="font-semibold text-forest underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </>
        }
        {...register("consent")}
      />
      <Honeypot name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />

      {serverError && (
        <p role="alert" className="mt-6 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-900">
          {serverError}
        </p>
      )}

      <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" arrow disabled={formState.isSubmitting}>
          {formState.isSubmitting ? "Sending…" : "Request a Consultation"}
        </Button>
        <p className="text-xs leading-relaxed text-stone sm:max-w-[16rem]">
          {isDemo ? "Demo: saved only in your browser. Nothing is emailed." : "We reply on business days."}
        </p>
      </div>
    </form>
  );
}

function DemoBadge() {
  return (
    <p className="inline-flex items-center gap-2 bg-forest px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ivory">
      <span className="h-1.5 w-1.5 rounded-full bg-terracotta" aria-hidden="true" />
      Demo submission saved locally
    </p>
  );
}

function Qualification({
  leadId,
  firstName,
  statusRef,
  onDone,
}: {
  leadId: string;
  firstName: string;
  statusRef: React.RefObject<HTMLHeadingElement | null>;
  onDone: () => void;
}) {
  const [land, setLand] = useState<LandStatus>();
  const [timeline, setTimeline] = useState<Timeline>();
  const [budget, setBudget] = useState<Budget>();
  const [method, setMethod] = useState<ContactMethod>();
  const [zip, setZip] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (zip && !/^\d{5}$/.test(zip)) return setError("Please enter a 5-digit ZIP code, or leave it blank.");
    setBusy(true);
    const result = await submitLead(
      { kind: "qualification", details: { leadId, landStatus: land, timeline, budget, zip, contactMethod: method } },
      {},
    );
    setBusy(false);
    if (!result.ok) return setError(result.error);
    track("qualification_submit", { fit: result.fit, land, timeline, budget });
    onDone();
  };

  return (
    <form onSubmit={submit} className="animate-[page-in_0.5s_ease_both]" noValidate>
      {isDemo && <DemoBadge />}
      <h2 ref={statusRef} tabIndex={-1} className="mt-5 text-h3 text-forest outline-none">
        Thanks, {firstName} — your message is in.
      </h2>
      <p className="mt-3 leading-relaxed text-stone">
        Want a more useful first conversation? Answer any of these <strong className="font-semibold text-charcoal">optional</strong>{" "}
        questions. Skip whatever you like.
      </p>
      <div className="mt-8 space-y-7">
        <ChoiceGroup name="land" legend="Do you own land?" options={landStatuses} value={land} onChange={setLand} />
        <ChoiceGroup name="timeline" legend="When would you like to begin?" options={timelines} value={timeline} onChange={setTimeline} />
        <ChoiceGroup name="budget" legend="Planning budget (your estimate, not a quote)" options={budgets} value={budget} onChange={setBudget} />
        <div className="grid gap-7 sm:grid-cols-2">
          <TextField
            label="ZIP code"
            inputMode="numeric"
            maxLength={5}
            optional
            value={zip}
            onChange={(e) => (setZip(e.target.value), setError(null))}
            hint={zip.length === 5 && !isServiceZip(zip) ? "Outside our usual region — we'll still read your note." : undefined}
          />
          <ChoiceGroup name="method" legend="Preferred contact" options={contactMethods} value={method} onChange={setMethod} columns={3} />
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-6 text-sm font-medium text-red-800">
          {error}
        </p>
      )}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" arrow disabled={busy}>
          {busy ? "Saving…" : "Add These Details"}
        </Button>
        <button type="button" onClick={onDone} className="text-xs font-semibold uppercase tracking-[0.14em] text-forest underline-offset-4 hover:underline sm:ml-4">
          Skip for now
        </button>
      </div>
    </form>
  );
}
