"use client";

import { isDemo } from "@/config/site";
import { getConsent } from "./consent";

/**
 * Tracking layer. Every interaction goes through `track()`, which:
 *  - always pushes to `window.dataLayer` (GTM/GA4-compatible shape),
 *  - forwards to GA4 (`gtag`) only with analytics consent and outside demo mode,
 *  - marks demo/test traffic with `is_test: true` so it can be filtered out,
 *  - logs to the console in development and keeps a short in-memory log for QA.
 */

export type AnalyticsEvent =
  | "page_view"
  | "primary_cta_click"
  | "consultation_form_start"
  | "consultation_form_submit"
  | "consultation_form_error"
  | "qualification_submit"
  | "planner_start"
  | "planner_step_complete"
  | "planner_error"
  | "planner_abandon"
  | "planner_submit"
  | "phone_click"
  | "email_click"
  | "project_view"
  | "faq_expand"
  | "experiment_exposure";

export type EventParams = Record<string, string | number | boolean | undefined>;

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: Gtag;
    __agEvents?: { event: string; params: EventParams; at: number }[];
  }
}

export function track(event: AnalyticsEvent, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  const payload = { ...params, is_test: isDemo || undefined, page_path: window.location.pathname };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });

  (window.__agEvents ||= []).push({ event, params: payload, at: Date.now() });
  if (window.__agEvents.length > 200) window.__agEvents.shift();

  if (process.env.NODE_ENV !== "production") console.debug("[analytics]", event, payload);

  if (!isDemo && getConsent() === "granted" && typeof window.gtag === "function") {
    window.gtag("event", event, payload);
  }
}

/** Google Ads conversion for completed, non-test leads. */
export function trackLeadConversion(kind: string) {
  const id = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;
  if (isDemo || !id || !label || getConsent() !== "granted" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", { send_to: `${id}/${label}`, lead_kind: kind });
}
