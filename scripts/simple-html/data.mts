// Dumps the site content needed by the vanilla-JS widgets (process tabs, planner, galleries) as JSON.
import { processSteps, processDisclaimer } from "../../src/config/content.ts";
import { projectTypes, landStatuses, homeSizes, homeStyles, budgets, timelines, contactMethods } from "../../src/config/planner.ts";
import { projects } from "../../src/config/projects.ts";

const galleries = Object.fromEntries(projects.map((p) => [p.slug, p.images]));
process.stdout.write(
  JSON.stringify({ processSteps, processDisclaimer, planner: { projectTypes, landStatuses, homeSizes, homeStyles, budgets, timelines, contactMethods }, galleries }),
);
