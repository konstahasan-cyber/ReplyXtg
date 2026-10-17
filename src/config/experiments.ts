/**
 * A/B experiment definitions.
 *
 * Variants are assigned once per visitor by `src/proxy.ts` and stored in a
 * first-party cookie, so the same visitor always sees the same variant for the
 * whole test (no flicker, no switching between pages). Disabled by default:
 * enabling reads cookies on the server, which makes pages render dynamically.
 *
 * QA override: append `?exp_cta=B` or `?exp_hero=B` to any URL.
 */

export const experimentsEnabled = process.env.EXPERIMENTS_ENABLED === "true";

export const experiments = {
  cta: {
    cookie: "ag_exp_cta",
    query: "exp_cta",
    variants: ["A", "B"] as const,
    description: "Primary CTA label",
  },
  hero: {
    cookie: "ag_exp_hero",
    query: "exp_hero",
    variants: ["A", "B"] as const,
    description: "Hero message: emotional value (A) vs. concrete process help (B)",
  },
} as const;

export type ExperimentKey = keyof typeof experiments;
export type Variant = "A" | "B";
export type VariantMap = Record<ExperimentKey, Variant>;

export const controlVariants: VariantMap = { cta: "A", hero: "A" };

export const ctaCopy: Record<Variant, { label: string; href: string }> = {
  A: { label: "Plan My Custom Home", href: "/planner" },
  B: { label: "Request a Consultation", href: "/contact" },
};

export const heroCopy: Record<Variant, { eyebrow: string; headline: string; sub: string }> = {
  A: {
    eyebrow: "Custom homes · Greater Sacramento",
    headline: "A Home Built Around How You Live.",
    sub: "Thoughtfully designed custom homes for Sacramento and the surrounding communities. From your first idea to the details that make it yours.",
  },
  B: {
    eyebrow: "Design-build guidance · Greater Sacramento",
    headline: "Build Your Custom Home With a Clear Plan.",
    sub: "From lot feasibility and budget framing to permits and construction, we help you understand each step before you commit to it.",
  },
};
