"use client";

import { isDemo } from "@/config/site";
import { getAttribution } from "@/lib/attribution";
import type { LeadResponse } from "./schema";

const DEMO_KEY = "ag_demo_leads";

/** Stores a copy of a demo submission in this browser only. */
export function saveDemoLead(entry: Record<string, unknown>) {
  try {
    const list = JSON.parse(localStorage.getItem(DEMO_KEY) || "[]") as unknown[];
    list.push({ ...entry, savedAt: new Date().toISOString() });
    localStorage.setItem(DEMO_KEY, JSON.stringify(list.slice(-20)));
    return true;
  } catch {
    return false;
  }
}

export function readVariantsFromCookie(): Record<string, string> | undefined {
  if (typeof document === "undefined") return undefined;
  const out: Record<string, string> = {};
  for (const part of document.cookie.split(";")) {
    const [k, v] = part.trim().split("=");
    if (k?.startsWith("ag_exp_") && v) out[k.replace("ag_exp_", "")] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

/**
 * Sends a lead to `/api/leads` (validated server-side; forwarded to CRM/email
 * only outside demo mode). In demo mode a local copy is kept so the visitor can
 * see exactly what would have been sent.
 */
export async function submitLead(
  payload: Record<string, unknown> & { kind: string },
  meta: { startedAt?: number; website?: string },
): Promise<LeadResponse> {
  const body = {
    ...payload,
    meta: {
      website: meta.website ?? "",
      startedAt: meta.startedAt,
      attribution: getAttribution(),
      page: window.location.pathname,
      variants: readVariantsFromCookie(),
    },
  };

  let result: LeadResponse;
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    result = (await res.json()) as LeadResponse;
  } catch {
    result = { ok: false, error: "We couldn't reach the server. Please check your connection and try again — your answers are saved." };
  }

  if (result.ok && isDemo) saveDemoLead({ id: result.leadId, ...payload });
  return result;
}
