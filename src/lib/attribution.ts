"use client";

/**
 * First-party attribution: stores the first-touch and latest-touch source
 * (UTM parameters, click IDs, referrer, landing page) in localStorage. It never
 * leaves the browser on its own — it is attached only to a lead the visitor
 * chooses to submit. Respects Global Privacy Control by storing nothing.
 */

import { hasGpc } from "./consent";

const FIRST = "ag_attr_first";
const LAST = "ag_attr_last";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid", "msclkid"];
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

type Touch = Record<string, string>;

const read = (key: string): Touch | undefined => {
  try {
    const t = JSON.parse(localStorage.getItem(key) || "null") as Touch | null;
    if (!t) return undefined;
    if (t.ts && Date.now() - Number(t.ts) > MAX_AGE_MS) {
      localStorage.removeItem(key);
      return undefined;
    }
    return t;
  } catch {
    return undefined;
  }
};

const write = (key: string, t: Touch) => {
  try {
    localStorage.setItem(key, JSON.stringify(t));
  } catch {
    /* storage unavailable — attribution is optional */
  }
};

export function captureAttribution() {
  if (typeof window === "undefined" || hasGpc()) return;
  const url = new URL(window.location.href);
  const touch: Touch = {};
  for (const p of PARAMS) {
    const v = url.searchParams.get(p);
    if (v) touch[p] = v.slice(0, 150);
  }
  const ref = document.referrer && new URL(document.referrer).host !== url.host ? new URL(document.referrer).host : "";
  const hasCampaign = Object.keys(touch).length > 0;
  if (!hasCampaign && !ref && read(FIRST)) return;

  const full: Touch = {
    ...touch,
    referrer: ref || "direct",
    landing: url.pathname,
    ts: String(Date.now()),
  };
  if (!read(FIRST)) write(FIRST, full);
  if (hasCampaign || ref) write(LAST, full);
}

export function getAttribution() {
  if (typeof window === "undefined") return undefined;
  const first = read(FIRST);
  const last = read(LAST);
  return first || last ? { first, last } : undefined;
}
