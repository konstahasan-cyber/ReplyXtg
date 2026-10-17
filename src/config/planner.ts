/** Options for the Home Planner wizard and the qualification step of the contact form. */

export type Option<V extends string = string> = { value: V; label: string; hint?: string };

export const projectTypes = [
  { value: "custom-home", label: "Build a custom home", hint: "A new home designed for you" },
  { value: "design-build", label: "Explore design-build options", hint: "Design and construction under one team" },
  { value: "rebuild", label: "Rebuild an existing home", hint: "Replace a home on a lot you own" },
  { value: "exploring", label: "I'm still exploring", hint: "Learning what's possible" },
] as const satisfies readonly Option[];

export const landStatuses = [
  { value: "yes", label: "Yes", hint: "I own the lot" },
  { value: "no", label: "No", hint: "I'm still looking" },
  { value: "buying", label: "In the process of buying", hint: "Under contract or negotiating" },
  { value: "unsure", label: "Not sure yet", hint: "Still weighing options" },
] as const satisfies readonly Option[];

export const homeSizes = [
  { value: "under-2000", label: "Under 2,000 sq ft" },
  { value: "2000-3000", label: "2,000–3,000 sq ft" },
  { value: "3000-4500", label: "3,000–4,500 sq ft" },
  { value: "4500-plus", label: "4,500+ sq ft" },
  { value: "unsure", label: "Not sure" },
] as const satisfies readonly Option[];

export const homeStyles = [
  { value: "california-modern", label: "California Modern", hint: "Clean lines, big glass, indoor-outdoor flow", image: "/images/style-california-modern.jpg" },
  { value: "modern-farmhouse", label: "Modern Farmhouse", hint: "Gables, porches and warm materials", image: "/images/style-modern-farmhouse.jpg" },
  { value: "contemporary-luxury", label: "Contemporary Luxury", hint: "Bold forms, stone and refined detail", image: "/images/style-contemporary-luxury.jpg" },
  { value: "mediterranean", label: "Mediterranean", hint: "Plaster, tile roofs and shaded arches", image: "/images/style-mediterranean.jpg" },
  { value: "unsure", label: "Not Sure Yet", hint: "We'll explore styles together", image: "/images/style-not-sure.jpg" },
] as const satisfies readonly (Option & { image: string })[];

export const budgets = [
  { value: "under-500k", label: "Under $500,000" },
  { value: "500k-750k", label: "$500,000–$750,000" },
  { value: "750k-1250k", label: "$750,000–$1.25M" },
  { value: "1250k-plus", label: "$1.25M+" },
  { value: "unsure", label: "Not sure" },
] as const satisfies readonly Option[];

export const timelines = [
  { value: "asap", label: "As soon as practical" },
  { value: "6-months", label: "Within 6 months" },
  { value: "6-12-months", label: "6–12 months" },
  { value: "exploring", label: "Just exploring" },
] as const satisfies readonly Option[];

export const contactMethods = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone call" },
  { value: "text", label: "Text message" },
] as const satisfies readonly Option[];

type Values<T extends readonly Option[]> = T[number]["value"];
export type ProjectType = Values<typeof projectTypes>;
export type LandStatus = Values<typeof landStatuses>;
export type HomeSize = Values<typeof homeSizes>;
export type HomeStyle = Values<typeof homeStyles>;
export type Budget = Values<typeof budgets>;
export type Timeline = Values<typeof timelines>;
export type ContactMethod = Values<typeof contactMethods>;

export const values = <T extends readonly Option[]>(opts: T) =>
  opts.map((o) => o.value) as unknown as [Values<T>, ...Values<T>[]];

export const labelFor = (opts: readonly Option[], value?: string) =>
  opts.find((o) => o.value === value)?.label ?? "—";
