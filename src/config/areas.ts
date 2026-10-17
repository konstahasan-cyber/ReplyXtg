/**
 * Service areas. Only three cities get a dedicated page — each with genuinely
 * different content — instead of thin, near-duplicate SEO pages for every town.
 */

export type ServiceArea = {
  name: string;
  /** Slug of a dedicated city page, if one exists. */
  slug?: string;
  blurb: string;
};

export const serviceAreas: ServiceArea[] = [
  { name: "Sacramento", slug: "sacramento", blurb: "Infill lots, established neighborhoods and riverside parcels." },
  { name: "Elk Grove", slug: "elk-grove", blurb: "Larger lots and family homes with room for outdoor living." },
  { name: "Folsom", slug: "folsom", blurb: "Hillside and view sites near the lake and the foothills." },
  { name: "Roseville", blurb: "Growing neighborhoods with a mix of new and established lots." },
  { name: "Rocklin", blurb: "Rolling terrain and family-oriented communities." },
  { name: "Granite Bay", blurb: "Estate-sized parcels, mature oaks and lake proximity." },
  { name: "Rancho Cordova", blurb: "Convenient access to the city with new residential areas." },
  { name: "Davis", blurb: "Thoughtful, energy-conscious homes in a walkable college town." },
  { name: "Fair Oaks", blurb: "Wooded lots and character along the American River." },
  { name: "Carmichael", blurb: "Generous mid-century lots ready for a modern rebuild." },
];

/**
 * ZIP prefixes broadly covering the greater Sacramento region. Used only to give
 * a friendly "outside our usual area" hint and to tag leads — never to block.
 */
export const serviceZipPrefixes = ["956", "957", "958"];

export type CityPage = {
  slug: string;
  city: string;
  title: string;
  metaDescription: string;
  heroImage: string;
  heroAlt: string;
  intro: string;
  lede: string;
  character: { heading: string; body: string }[];
  considerations: { heading: string; body: string }[];
  neighborhoods: string[];
  nearby: string[];
  featuredProject: string;
};

export const cityPages: CityPage[] = [
  {
    slug: "sacramento",
    city: "Sacramento",
    title: "Custom Home Builder in Sacramento, CA",
    metaDescription:
      "Planning a custom home in Sacramento? Explore how design-led custom homes come together on infill lots, older neighborhoods and riverside parcels — concept site.",
    heroImage: "/images/riverstone-1.jpg",
    heroAlt: "Concept rendering of a California contemporary home with tall glass walls at golden hour",
    intro: "Custom homes in Sacramento",
    lede:
      "Sacramento rewards homes that respond to heat, light and established streets. A custom home here often means working with an existing neighborhood — and making something that feels like it always belonged.",
    character: [
      {
        heading: "Infill and teardown lots",
        body: "Many Sacramento projects start with an older home on a well-located lot. A rebuild lets you keep the neighborhood you love while gaining a plan, systems and efficiency designed for today.",
      },
      {
        heading: "Designing for valley summers",
        body: "Deep overhangs, shaded glazing on the west, cross-ventilation and a well-sealed envelope matter as much as style. We treat climate as a design input from the first sketch.",
      },
      {
        heading: "Indoor-outdoor living",
        body: "Mild evenings for much of the year make courtyards, covered patios and wide sliding walls genuinely useful — not just photogenic.",
      },
    ],
    considerations: [
      {
        heading: "Neighborhood and design review",
        body: "Some areas, especially historic districts, have design guidelines or review steps. These can shape massing, materials and timeline, so we check early.",
      },
      {
        heading: "Existing utilities and demolition",
        body: "Rebuilds involve demolition permits, utility disconnects and sometimes sewer or service upgrades. These items belong in the budget from day one.",
      },
      {
        heading: "Lot coverage and setbacks",
        body: "Zoning rules determine how much house fits and where. A feasibility review before design avoids drawing a home that can't be permitted.",
      },
    ],
    neighborhoods: ["Land Park", "East Sacramento", "Curtis Park", "Pocket–Greenhaven", "River Park", "Arden-Arcade"],
    nearby: ["Carmichael", "Fair Oaks", "Rancho Cordova", "Davis"],
    featuredProject: "riverstone-residence",
  },
  {
    slug: "folsom",
    city: "Folsom",
    title: "Custom Homes in Folsom, CA",
    metaDescription:
      "Thinking about a custom home in Folsom? Learn how hillside sites, views and outdoor living shape a design-led home near the lake and foothills — concept site.",
    heroImage: "/images/sierra-1.jpg",
    heroAlt: "Concept rendering of a modern hillside home with stone and timber walls overlooking the foothills",
    intro: "Custom homes in Folsom",
    lede:
      "Folsom sits where the valley meets the foothills. Views, slopes and big skies invite homes that open up to the landscape — and ask for careful engineering underneath.",
    character: [
      {
        heading: "Hillside and view lots",
        body: "Sloped sites can deliver remarkable views and natural daylight on multiple levels. They also require thoughtful grading, drainage and foundation design.",
      },
      {
        heading: "Outdoor living as a room",
        body: "Terraces, outdoor kitchens and shaded seating extend daily life outside. We plan sun angles and wind so these spaces are comfortable, not just beautiful.",
      },
      {
        heading: "Natural materials",
        body: "Stone, timber and earthy tones help a home sit quietly within the oak-studded terrain rather than competing with it.",
      },
    ],
    considerations: [
      {
        heading: "Geotechnical and grading",
        body: "Slopes typically require soils reports and engineered foundations. These studies inform cost early and are worth commissioning before final design.",
      },
      {
        heading: "HOA and community guidelines",
        body: "Many Folsom neighborhoods have HOA architectural review. Their timelines and requirements run alongside city permits.",
      },
      {
        heading: "Wildland-urban interface",
        body: "Some parcels fall within fire hazard zones that affect materials, vents, roofing and landscaping. We confirm the designation for your lot early.",
      },
    ],
    neighborhoods: ["Empire Ranch", "Broadstone", "Folsom Ranch", "Briggs Ranch", "Historic Folsom"],
    nearby: ["Granite Bay", "Rancho Cordova", "Roseville", "Fair Oaks"],
    featuredProject: "sierra-retreat",
  },
  {
    slug: "elk-grove",
    city: "Elk Grove",
    title: "Custom Home Builder in Elk Grove, CA",
    metaDescription:
      "Planning a custom family home in Elk Grove? See how larger lots, covered outdoor living and flexible floor plans come together in a design-led home — concept site.",
    heroImage: "/images/oakmeadow-1.jpg",
    heroAlt: "Concept rendering of a modern farmhouse with gabled roofs and a covered porch",
    intro: "Custom homes in Elk Grove",
    lede:
      "Elk Grove's larger lots and family-centered neighborhoods are ideal for homes that grow with you — generous kitchens, flexible rooms and backyards built for long evenings.",
    character: [
      {
        heading: "Room to spread out",
        body: "Wider lots can accommodate single-level living, multigenerational suites or a detached studio. We help you decide what deserves the space.",
      },
      {
        heading: "Family-first floor plans",
        body: "Open kitchens, mudrooms, homework nooks and guest suites designed around how your household actually moves through a day.",
      },
      {
        heading: "Modern farmhouse, refined",
        body: "Clean gables, warm woods and covered porches — a familiar silhouette, made calmer and more contemporary.",
      },
    ],
    considerations: [
      {
        heading: "Rural and estate parcels",
        body: "Some properties rely on well and septic systems, or need utility extensions. These can significantly affect budget and timeline.",
      },
      {
        heading: "Flood zone review",
        body: "Parts of the region sit within mapped flood zones, which can affect foundation height and insurance. We confirm the designation for your parcel.",
      },
      {
        heading: "Accessory dwelling units",
        body: "California law has made ADUs more accessible. If you want one, it's best planned alongside the main house.",
      },
    ],
    neighborhoods: ["Laguna", "East Franklin", "Sheldon", "Camden", "Elk Grove Old Town"],
    nearby: ["Sacramento", "Rancho Cordova", "Davis"],
    featuredProject: "oak-meadow-house",
  },
];

export function getCityPage(slug: string) {
  return cityPages.find((c) => c.slug === slug);
}
