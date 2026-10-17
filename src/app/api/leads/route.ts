import { NextResponse, type NextRequest } from "next/server";
import { isDemo } from "@/config/site";
import { deliverLead, type LeadRecord } from "@/lib/leads/delivery";
import { leadRequestSchema, type LeadFit, type LeadResponse } from "@/lib/leads/schema";
import { scoreLead } from "@/lib/leads/scoring";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** Forms submitted faster than this after rendering are treated as bots. */
const MIN_FILL_MS = 2500;
const MAX_BODY_BYTES = 16_000;

const json = (body: LeadResponse, status = 200, headers?: HeadersInit) => NextResponse.json(body, { status, headers });

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  const limited = rateLimit(`lead:${ip}`);
  if (!limited.ok) {
    return json({ ok: false, error: "Too many submissions. Please wait a moment and try again." }, 429, {
      "retry-after": String(limited.retryAfter),
    });
  }

  if (!req.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "Unsupported content type." }, 415);
  }

  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) {
    return json({ ok: false, error: "Cross-origin submissions are not accepted." }, 403);
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "Submission is too large." }, 413);

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  const parsed = leadRequestSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.slice(1).join(".") || issue.path.join(".");
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return json({ ok: false, error: "Please review the highlighted fields.", fieldErrors }, 422);
  }

  const lead = parsed.data;
  const leadId = crypto.randomUUID();

  // Spam signals: filled honeypot or impossibly fast submissions. Respond with a
  // generic success so bots learn nothing, but never store or forward.
  const tooFast = lead.meta.startedAt ? Date.now() - lead.meta.startedAt < MIN_FILL_MS : false;
  const linkSpam = lead.kind === "consultation" && (lead.contact.message.match(/https?:\/\//g)?.length ?? 0) > 2;
  if (lead.meta.website || tooFast || linkSpam) {
    return json({ ok: true, leadId, demo: isDemo, delivered: false });
  }

  const record: LeadRecord = {
    id: leadId,
    kind: lead.kind,
    receivedAt: new Date().toISOString(),
    attribution: lead.meta.attribution,
    page: lead.meta.page,
    variants: lead.meta.variants,
  };

  if (lead.kind === "planner") {
    const { consent: _consent, ...contact } = lead.contact;
    const s = scoreLead({ ...lead.answers, zip: contact.zip });
    Object.assign(record, { contact, answers: lead.answers, fit: s.fit, score: s.score, fitReasons: s.reasons });
  } else if (lead.kind === "consultation") {
    const { consent: _consent, ...contact } = lead.contact;
    Object.assign(record, { contact, fit: "qualified" });
  } else {
    const s = scoreLead(lead.details);
    Object.assign(record, { details: lead.details, fit: s.fit, score: s.score, fitReasons: s.reasons });
  }

  // Test leads never leave the demo: obvious test domains are flagged too.
  const email = (record.contact as { email?: string } | undefined)?.email ?? "";
  const testLead = isDemo || /@(example\.(com|org|net)|test\.|.*\.example$|.*\.test$)/i.test(email);

  const { delivered } = await deliverLead(record, { demo: testLead });

  return json({ ok: true, leadId, demo: isDemo, fit: record.fit as LeadFit | undefined, delivered });
}

export function GET() {
  return json({ ok: false, error: "Method not allowed." }, 405, { allow: "POST" });
}
