import { serviceZipPrefixes } from "@/config/areas";
import type { LeadFit, PlannerAnswers } from "./schema";

/**
 * Simple, transparent lead-fit scoring used for routing in a CRM. It optimises
 * for *qualified* conversations, not raw lead volume. Nobody is rejected —
 * "nurture" leads receive educational follow-up instead of a sales call.
 */
export function scoreLead(input: {
  zip?: string;
  landStatus?: string;
  budget?: string;
  timeline?: string;
  projectType?: string;
}): { fit: LeadFit; score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (input.zip && isServiceZip(input.zip)) {
    score += 2;
    reasons.push("In service region");
  } else if (input.zip) {
    reasons.push("Outside usual service region");
  }

  if (input.landStatus === "yes") {
    score += 3;
    reasons.push("Owns land");
  } else if (input.landStatus === "buying") {
    score += 2;
    reasons.push("Buying land");
  }

  if (input.budget === "750k-1250k" || input.budget === "1250k-plus") {
    score += 2;
    reasons.push("Budget aligned");
  } else if (input.budget === "500k-750k") score += 1;

  if (input.timeline === "asap" || input.timeline === "6-months") {
    score += 2;
    reasons.push("Near-term timeline");
  } else if (input.timeline === "6-12-months") score += 1;

  if (input.projectType === "custom-home" || input.projectType === "design-build" || input.projectType === "rebuild") score += 1;

  const fit: LeadFit = score >= 7 ? "priority" : score >= 4 ? "qualified" : "nurture";
  return { fit, score, reasons };
}

export const isServiceZip = (zip: string) => serviceZipPrefixes.some((p) => zip.startsWith(p));

/** Suggested next steps shown on the planner confirmation, based on answers. */
export function nextStepsFor(a: PlannerAnswers): string[] {
  const steps: string[] = [];
  if (a.landStatus === "yes") steps.push("Share your lot address so we can review zoning, setbacks, utilities and orientation.");
  else if (a.landStatus === "buying") steps.push("Before closing, consider a feasibility review of the parcel — zoning, utilities, slope and any special zones.");
  else steps.push("Start a lot checklist: zoning, utility access, slope, orientation and any HOA or fire-zone requirements.");

  if (a.budget === "unsure") steps.push("Talk through a comfortable budget range — we'll explain the main cost drivers rather than quote a generic price.");
  else steps.push("Review how your budget range splits across land costs, design, permits, site work and construction.");

  if (a.style === "unsure") steps.push("Collect 10–15 images of homes and rooms you love; patterns emerge quickly.");
  else steps.push("Gather inspiration that captures what draws you to this style — materials, light, rooflines.");

  if (a.projectType === "rebuild") steps.push("Note any existing structures, utilities and neighborhood design guidelines that may apply to a rebuild.");
  if (a.timeline === "exploring") steps.push("Read through our building process to see what each phase involves.");
  else steps.push("Schedule a discovery conversation to map out a realistic sequence for design, permits and construction.");

  return steps.slice(0, 4);
}
