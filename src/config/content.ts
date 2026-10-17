/** Services, principles, process and FAQ content shared across pages. */

export type Service = {
  slug: string;
  title: string;
  outcome: string;
  body: string;
  href: string;
  image: string;
  imageAlt: string;
};

export const services: Service[] = [
  {
    slug: "custom",
    title: "Custom Home Construction",
    outcome: "A home planned around your lot, your routines and your budget — not adapted from a catalog.",
    body: "One team carries your project from early feasibility through construction and walkthrough, so decisions are made once and communicated clearly.",
    href: "/custom-home-building",
    image: "/images/service-custom.jpg",
    imageAlt: "Concept rendering of a custom home with warm interior light",
  },
  {
    slug: "design-build",
    title: "Design-Build",
    outcome: "Design and cost developed side by side, so the plan you love is one you can actually build.",
    body: "Builders and designers collaborate from the first meeting, pricing ideas as they emerge instead of after drawings are finished.",
    href: "/design-build",
    image: "/images/service-designbuild.jpg",
    imageAlt: "Concept rendering of a timber-framed home structure",
  },
  {
    slug: "planning",
    title: "Architectural Planning",
    outcome: "Clarity before commitment: what fits on your lot, what it may require, and the decisions ahead.",
    body: "Site review, zoning checks, programming and coordination with architects and engineers — whether you bring your own designer or need one.",
    href: "/design-build#coordination",
    image: "/images/service-planning.jpg",
    imageAlt: "Concept rendering of a white architectural massing model",
  },
  {
    slug: "luxury",
    title: "Luxury Home Construction",
    outcome: "Refined materials and details executed with care, managed through a transparent selection process.",
    body: "Custom millwork, stone, large-format glazing and integrated systems, with allowances and selections tracked so there are fewer surprises.",
    href: "/custom-home-building#luxury",
    image: "/images/service-luxury.jpg",
    imageAlt: "Concept rendering of a refined interior with stone and oak",
  },
];

export const principles = [
  {
    title: "Personalized Planning",
    body: "We start with how you live — mornings, guests, work, storage, the view you want from the kitchen sink — and let the plan grow from there.",
  },
  {
    title: "Design-Led Thinking",
    body: "Proportion, daylight and materials are considered early, alongside cost, so good design is part of the budget rather than an add-on.",
  },
  {
    title: "Clear Communication",
    body: "Regular updates, written decisions and a single point of contact. You should always know what's happening, what's next and what it costs.",
  },
  {
    title: "Quality-Focused Approach",
    body: "Careful trade coordination, inspections at critical stages and attention to the details you'll touch every day.",
  },
];

export type ProcessStep = {
  number: string;
  title: string;
  summary: string;
  details: string[];
  youProvide: string[];
  typicalOutputs: string[];
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery & Vision",
    summary: "We listen first: your goals, routines, must-haves and the budget range you're comfortable with.",
    details: [
      "An unhurried conversation about how you live today and how you want to live in your new home.",
      "An honest discussion of budget ranges and priorities, so expectations are realistic from the start.",
    ],
    youProvide: ["Your ideas, inspiration and priorities", "A comfortable budget range", "Lot address, if you have one"],
    typicalOutputs: ["Shared project goals", "Preliminary scope", "Recommended next steps"],
  },
  {
    number: "02",
    title: "Site & Project Planning",
    summary: "We study the land — zoning, setbacks, utilities, slope and orientation — to understand what's possible.",
    details: [
      "Feasibility review covering zoning, lot coverage, easements and access.",
      "Identification of studies that may be needed, such as a survey, soils report or utility assessment.",
    ],
    youProvide: ["Property information or purchase documents", "Any existing surveys or reports"],
    typicalOutputs: ["Site feasibility notes", "List of required studies", "Early budget framework"],
  },
  {
    number: "03",
    title: "Design Development",
    summary: "Ideas become drawings. Layouts, elevations and materials are refined together with cost feedback.",
    details: [
      "Schematic design, then design development, with pricing checkpoints along the way.",
      "Material and finish direction, with allowances clearly documented.",
    ],
    youProvide: ["Feedback on layouts and materials", "Decisions on key selections"],
    typicalOutputs: ["Floor plans and elevations", "Material palette", "Updated cost estimate"],
  },
  {
    number: "04",
    title: "Permits & Preconstruction",
    summary: "Construction documents are completed, permits are submitted, and the build is scheduled and priced in detail.",
    details: [
      "Coordination with engineers and consultants for permit-ready drawings.",
      "Submission to the local building department and responses to plan-check comments.",
      "Trade bidding, a detailed schedule and a construction agreement.",
    ],
    youProvide: ["Final approvals on drawings", "Signatures on applications and agreements"],
    typicalOutputs: ["Permit set", "Detailed construction budget", "Construction schedule"],
  },
  {
    number: "05",
    title: "Construction",
    summary: "Your home is built with regular updates, scheduled site visits and a clear process for any changes.",
    details: [
      "Foundation, framing, systems, insulation, drywall and finishes — with inspections at each required stage.",
      "Written change orders with cost and schedule impact before work proceeds.",
    ],
    youProvide: ["Timely selection decisions", "Participation in scheduled walkthroughs"],
    typicalOutputs: ["Progress updates and photos", "Inspection records", "Change-order log"],
  },
  {
    number: "06",
    title: "Final Walkthrough",
    summary: "We walk the home together, complete any punch-list items and hand over documentation for your new home.",
    details: [
      "A detailed walkthrough to identify and resolve finishing items.",
      "Orientation to systems, maintenance guidance and warranty documentation.",
    ],
    youProvide: ["Your walkthrough notes"],
    typicalOutputs: ["Completed punch list", "Home manual and warranties", "Keys to your new home"],
  },
];

export const processDisclaimer =
  "Actual timelines and requirements depend on the municipality, the specific lot, the design and the approvals involved. We'll outline expectations for your project during planning.";

export type Faq = { q: string; a: string; topic: string };

export const faqs: Faq[] = [
  {
    topic: "Cost",
    q: "How much does it cost to build a custom home in the Sacramento area?",
    a: "There isn't an honest single number. Cost depends on size, design complexity, site conditions, finishes, utilities and municipal fees. Rather than quoting a generic price per square foot, we build a budget framework from your goals and lot during planning, then refine it as the design develops — so you see how decisions affect cost before you commit to them.",
  },
  {
    topic: "Land",
    q: "Do I need to own land before we start talking?",
    a: "No. Many people reach out while they're still searching. We can talk through what to look for in a lot — zoning, utilities, slope, orientation and setbacks — and, if you're considering a specific parcel, help you understand its potential before you buy.",
  },
  {
    topic: "Timeline",
    q: "How long does it take to build a custom home?",
    a: "It varies widely. Design and permitting can take several months on their own, and construction duration depends on the size and complexity of the home, the site and the availability of materials and inspections. We'll give you a realistic schedule for your specific project once we understand its scope.",
  },
  {
    topic: "Permits",
    q: "Who handles permits and approvals?",
    a: "We coordinate the permit process with the designers and engineers on your project, prepare submissions and respond to plan-check comments. Requirements vary by city and county, and some lots need extra reviews — for example HOA approval, design review or fire-zone requirements — which we identify early.",
  },
  {
    topic: "Design",
    q: "Can I bring my own architect or designer?",
    a: "Yes. We can collaborate with your architect, offering constructability and cost feedback during design. If you don't have one, our design-build approach coordinates the design team for you.",
  },
  {
    topic: "Budget",
    q: "How do you keep the budget under control?",
    a: "By pricing early and often. Cost checkpoints happen during design, allowances are documented in writing and any change is priced before work proceeds. No builder can promise that nothing will change, but clear documentation means you're making informed decisions rather than discovering surprises.",
  },
  {
    topic: "Preparation",
    q: "What should I prepare before our first conversation?",
    a: "Nothing formal. Helpful extras include a lot address (if you have one), photos or links to homes you love, a rough sense of size and rooms, and a budget range you're comfortable discussing. If you're unsure about any of it, that's exactly what the first conversation is for.",
  },
  {
    topic: "Design",
    q: "Are the homes on this website available to build?",
    a: "The homes shown are concept designs that illustrate a design approach and possible features. A real custom home would be designed for your site, needs and local requirements. This is a concept website for a fictional company.",
  },
  {
    topic: "Service areas",
    q: "Which areas do you serve?",
    a: "The concept service area covers Sacramento and the surrounding region, including Elk Grove, Folsom, Roseville, Rocklin, Granite Bay, Rancho Cordova, Davis, Fair Oaks and Carmichael. If your lot is nearby but outside this list, it's still worth asking.",
  },
  {
    topic: "Rebuild",
    q: "Can you rebuild on a lot where a home already stands?",
    a: "Often, yes. Rebuilds involve demolition permits, utility disconnects and sometimes service upgrades, and some neighborhoods have design guidelines. We review these factors early so they're part of the plan and the budget.",
  },
];
