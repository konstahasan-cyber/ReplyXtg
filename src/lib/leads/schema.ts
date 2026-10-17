import { z } from "zod";
import {
  budgets,
  contactMethods,
  homeSizes,
  homeStyles,
  landStatuses,
  projectTypes,
  timelines,
  values,
} from "@/config/planner";

/** Shared client + server validation for every lead form. */

const name = z
  .string()
  .trim()
  .min(2, "Please enter your name.")
  .max(80, "Please keep your name under 80 characters.");

const email = z.string().trim().max(120).email("Please enter a valid email address, like name@example.com.");

const phone = z
  .string()
  .trim()
  .max(30)
  .refine((v) => v === "" || v.replace(/\D/g, "").length >= 10, "Please enter a 10-digit phone number, or leave this blank.")
  .optional()
  .or(z.literal(""));

const zip = z.string().trim().regex(/^\d{5}$/, "Please enter a 5-digit ZIP code.");

const consent = z.literal(true, { error: "Please confirm you agree to be contacted about your project." });

export const attributionSchema = z
  .object({
    first: z.record(z.string(), z.string()).optional(),
    last: z.record(z.string(), z.string()).optional(),
  })
  .optional();

/** Anti-spam metadata sent with every form. */
const meta = z.object({
  /** Honeypot — must stay empty. */
  website: z.string().max(0).optional().or(z.literal("")),
  /** ms timestamp when the form was first rendered. */
  startedAt: z.number().int().positive(),
  attribution: attributionSchema,
  page: z.string().max(200).optional(),
  variants: z.record(z.string(), z.string()).optional(),
});

export const plannerAnswersSchema = z.object({
  projectType: z.enum(values(projectTypes), { error: "Choose the option closest to your plans." }),
  landStatus: z.enum(values(landStatuses), { error: "Choose one option to continue." }),
  homeSize: z.enum(values(homeSizes), { error: "Choose a size range, or “Not sure”." }),
  style: z.enum(values(homeStyles), { error: "Choose a style, or “Not Sure Yet”." }),
  budget: z.enum(values(budgets), { error: "Choose a range, or “Not sure”." }),
  timeline: z.enum(values(timelines), { error: "Choose a timeline to continue." }),
});

export const plannerContactSchema = z.object({
  name,
  email,
  phone,
  zip,
  contactMethod: z.enum(values(contactMethods), { error: "Choose how you'd like us to reach you." }),
  consent,
});

export const plannerLeadSchema = z.object({
  kind: z.literal("planner"),
  answers: plannerAnswersSchema,
  contact: plannerContactSchema,
  meta,
});

/** Stage 1 of the consultation form — deliberately short. */
export const consultationSchema = z.object({
  name,
  email,
  phone,
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little about your project (at least 10 characters).")
    .max(2000, "Please keep your message under 2,000 characters."),
  consent,
});

/** Stage 2 — optional qualification questions. */
export const qualificationSchema = z.object({
  leadId: z.string().min(8).max(64),
  landStatus: z.enum(values(landStatuses)).optional(),
  timeline: z.enum(values(timelines)).optional(),
  budget: z.enum(values(budgets)).optional(),
  zip: zip.optional().or(z.literal("")),
  contactMethod: z.enum(values(contactMethods)).optional(),
});

export const consultationLeadSchema = z.object({
  kind: z.literal("consultation"),
  contact: consultationSchema,
  meta,
});

export const qualificationLeadSchema = z.object({
  kind: z.literal("qualification"),
  details: qualificationSchema,
  meta: meta.partial({ startedAt: true }),
});

export const leadRequestSchema = z.discriminatedUnion("kind", [
  plannerLeadSchema,
  consultationLeadSchema,
  qualificationLeadSchema,
]);

export type PlannerAnswers = z.infer<typeof plannerAnswersSchema>;
export type PlannerContact = z.infer<typeof plannerContactSchema>;
export type ConsultationInput = z.infer<typeof consultationSchema>;
export type QualificationInput = z.infer<typeof qualificationSchema>;
export type LeadRequest = z.infer<typeof leadRequestSchema>;

export type LeadFit = "priority" | "qualified" | "nurture";

export type LeadResponse =
  | { ok: true; leadId: string; demo: boolean; fit?: LeadFit; delivered: boolean }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };
