"use client";

/**
 * Analytics consent. Third-party analytics load only after an explicit opt-in,
 * and a browser Global Privacy Control signal is always honoured as "denied".
 */

export type ConsentState = "granted" | "denied" | "unset";
const KEY = "ag_consent";
export const CONSENT_EVENT = "ag:consent";

const safeStorage = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export function hasGpc() {
  return typeof navigator !== "undefined" && (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

export function getConsent(): ConsentState {
  if (typeof window === "undefined") return "unset";
  if (hasGpc()) return "denied";
  const v = safeStorage()?.getItem(KEY);
  return v === "granted" || v === "denied" ? v : "unset";
}

export function setConsent(state: Exclude<ConsentState, "unset">) {
  safeStorage()?.setItem(KEY, state);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
}
