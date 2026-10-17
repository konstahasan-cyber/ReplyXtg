/**
 * Central company configuration.
 *
 * Every piece of company data used across the site lives here so a real
 * builder can replace the concept content in one place. The company below is
 * FICTIONAL: the phone number is in the reserved 555-01xx range, the domain uses
 * the reserved .example TLD and the license is a placeholder.
 */

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://aureliagrove.example").replace(/\/$/, "");

/** True while the site is a concept/demo. Never disable for a fictional company. */
export const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export const company = {
  name: "Aurelia Grove Custom Homes",
  shortName: "Aurelia Grove",
  tagline: "Built Around Your Life.",
  promise: "Thoughtfully designed homes built for the way you live.",
  description:
    "Aurelia Grove Custom Homes is a concept design-build studio for custom homes in Sacramento and the surrounding communities.",
  phone: {
    display: "+1 (916) 555-0142",
    href: "tel:+19165550142",
  },
  email: "hello@aureliagrove.example",
  website: "aureliagrove.example",
  city: "Sacramento",
  region: "CA",
  regionName: "California",
  country: "US",
  license: {
    label: "CSLB License",
    value: "DEMO-NOT-VALID",
    note: "Placeholder for demonstration only — not a valid contractor license.",
  },
  hours: "Replies are sent on business days.",
  demoNotice: "Concept website · Fictional company",
} as const;

export type NavLink = { label: string; href: string; description?: string };

export const primaryNav: (NavLink & { children?: NavLink[] })[] = [
  { label: "Home Designs", href: "/home-designs" },
  {
    label: "Services",
    href: "/custom-home-building",
    children: [
      {
        label: "Custom Home Building",
        href: "/custom-home-building",
        description: "One accountable team from first sketch to final walkthrough.",
      },
      {
        label: "Design-Build",
        href: "/design-build",
        description: "Design and cost developed together, so the plan stays buildable.",
      },
      {
        label: "Home Planner",
        href: "/planner",
        description: "Seven quick questions to frame your project.",
      },
    ],
  },
  { label: "Process", href: "/process" },
  { label: "Service Areas", href: "/service-areas" },
  { label: "About", href: "/about" },
];

export const footerNav = {
  explore: [
    { label: "Home Designs", href: "/home-designs" },
    { label: "Our Process", href: "/process" },
    { label: "Home Planner", href: "/planner" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  services: [
    { label: "Custom Home Building", href: "/custom-home-building" },
    { label: "Design-Build", href: "/design-build" },
    { label: "Luxury Residences", href: "/custom-home-building#luxury" },
    { label: "Architectural Coordination", href: "/design-build#coordination" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
  ],
} satisfies Record<string, NavLink[]>;

/** CTA vocabulary. Each CTA matches a different visitor intent. */
export const ctas = {
  primary: { label: "Plan My Custom Home", href: "/planner" },
  secondary: { label: "Explore Home Designs", href: "/home-designs" },
  highIntent: { label: "Request a Project Consultation", href: "/contact" },
  educational: { label: "Understand the Building Process", href: "/process" },
} as const;
