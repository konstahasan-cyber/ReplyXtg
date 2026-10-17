import "server-only";

/**
 * Production-ready lead delivery interface.
 *
 * Each adapter receives a normalised `LeadRecord`. Adapters run only when
 * demo mode is OFF and their environment variables are configured, so the
 * concept site can never forward a test lead to a real company or CRM.
 */

export type LeadRecord = {
  id: string;
  kind: "planner" | "consultation" | "qualification";
  receivedAt: string;
  fit?: string;
  score?: number;
  fitReasons?: string[];
  contact?: Record<string, unknown>;
  answers?: Record<string, unknown>;
  details?: Record<string, unknown>;
  attribution?: unknown;
  page?: string;
  variants?: Record<string, string>;
};

export interface LeadAdapter {
  name: string;
  enabled(): boolean;
  send(lead: LeadRecord): Promise<void>;
}

/** Generic signed JSON webhook — works with HubSpot workflows, Zapier, Make, Pipedrive, or a custom CRM endpoint. */
export const webhookAdapter: LeadAdapter = {
  name: "crm-webhook",
  enabled: () => Boolean(process.env.LEADS_WEBHOOK_URL),
  async send(lead) {
    const body = JSON.stringify(lead);
    const headers: Record<string, string> = { "content-type": "application/json" };
    const secret = process.env.LEADS_WEBHOOK_SECRET;
    if (secret) {
      const { createHmac } = await import("node:crypto");
      headers["x-signature"] = createHmac("sha256", secret).update(body).digest("hex");
    }
    const res = await fetch(process.env.LEADS_WEBHOOK_URL!, { method: "POST", headers, body, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  },
};

/** Team notification email via a Resend-compatible HTTP API. */
export const emailAdapter: LeadAdapter = {
  name: "email",
  enabled: () => Boolean(process.env.RESEND_API_KEY && process.env.LEADS_NOTIFY_TO && process.env.LEADS_NOTIFY_FROM),
  async send(lead) {
    const lines = [
      `New ${lead.kind} lead (${lead.fit ?? "unscored"})`,
      "",
      ...Object.entries({ ...lead.contact, ...lead.answers, ...lead.details }).map(([k, v]) => `${k}: ${String(v)}`),
      "",
      `Page: ${lead.page ?? "—"}`,
      `Lead ID: ${lead.id}`,
    ];
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEADS_NOTIFY_FROM,
        to: process.env.LEADS_NOTIFY_TO,
        subject: `New website lead — ${lead.kind}${lead.fit ? ` (${lead.fit})` : ""}`,
        text: lines.join("\n"),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Email API responded ${res.status}`);
  },
};

export const adapters: LeadAdapter[] = [webhookAdapter, emailAdapter];

export async function deliverLead(lead: LeadRecord, { demo }: { demo: boolean }) {
  if (demo) return { delivered: false, results: [] as { adapter: string; ok: boolean }[] };
  const active = adapters.filter((a) => a.enabled());
  const results = await Promise.all(
    active.map(async (a) => {
      try {
        await a.send(lead);
        return { adapter: a.name, ok: true };
      } catch (err) {
        console.error(`[leads] ${a.name} failed`, err);
        return { adapter: a.name, ok: false };
      }
    }),
  );
  return { delivered: results.some((r) => r.ok), results };
}
