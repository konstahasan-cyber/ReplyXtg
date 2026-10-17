/**
 * Concept home designs. These are FICTIONAL concept designs presented with
 * original procedural renderings — they are not homes built by the company.
 */

export type ProjectImage = { src: string; alt: string; caption: string };

export type ConceptProject = {
  slug: string;
  name: string;
  location: string;
  style: string;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  summary: string;
  concept: string[];
  features: { title: string; body: string }[];
  ideaFor: string[];
  images: ProjectImage[];
  planNotes: { label: string; value: string }[];
};

export const projects: ConceptProject[] = [
  {
    slug: "riverstone-residence",
    name: "The Riverstone Residence",
    location: "Sacramento, CA",
    style: "California Contemporary",
    sqft: 3150,
    bedrooms: 4,
    bathrooms: 3.5,
    summary:
      "A light-filled California contemporary organized around a private courtyard, where every main room opens to the garden.",
    concept: [
      "Riverstone starts with a simple idea: the best room in the house should be the one between the walls. The plan wraps a landscaped courtyard so that kitchen, living and primary suite all borrow its light, shade and quiet.",
      "Floor-to-ceiling glass faces the courtyard rather than the street, giving the home openness without sacrificing privacy. Natural oak, smooth plaster and honed stone keep the palette calm, letting daylight become the main finish.",
      "Deep roof overhangs shade the glazing from high summer sun while still welcoming low winter light — a quiet response to Sacramento's climate.",
    ],
    features: [
      { title: "Expansive indoor-outdoor living", body: "Pocketing glass walls dissolve the line between the great room and covered terrace." },
      { title: "Floor-to-ceiling windows", body: "Tall glazing oriented to the courtyard for daylight with privacy from the street." },
      { title: "Natural oak finishes", body: "White oak floors, cabinetry and a slatted entry screen bring warmth throughout." },
      { title: "Open-plan kitchen", body: "A long island anchors the social heart of the home, with a concealed working pantry." },
      { title: "Private landscaped courtyard", body: "A shaded garden room with an olive tree, stone paving and quiet water." },
    ],
    ideaFor: ["Infill or suburban lots", "Households who entertain often", "Single-level living with a compact upper retreat"],
    planNotes: [
      { label: "Levels", value: "1.5 stories" },
      { label: "Garage", value: "2 car, courtyard-side entry" },
      { label: "Lot fit (concept)", value: "Approx. 70 × 120 ft and up" },
      { label: "Outdoor rooms", value: "Courtyard, covered terrace" },
    ],
    images: [
      { src: "/images/riverstone-1.jpg", alt: "Concept rendering of the Riverstone Residence exterior with plaster volumes, oak screen and tall windows at golden hour", caption: "Street approach — plaster, oak and stone" },
      { src: "/images/riverstone-2.jpg", alt: "Concept rendering of a private landscaped courtyard with stone paving and an olive tree", caption: "The courtyard — the home's quiet center" },
      { src: "/images/riverstone-3.jpg", alt: "Concept rendering of an open-plan kitchen with a long oak island and daylight", caption: "Open-plan kitchen in natural oak" },
      { src: "/images/riverstone-4.jpg", alt: "Concept rendering of a great room with sliding glass walls fully open to a terrace", caption: "Glass walls open to the terrace" },
    ],
  },
  {
    slug: "sierra-retreat",
    name: "The Sierra Retreat",
    location: "Folsom, CA",
    style: "Modern Hillside Home",
    sqft: 4100,
    bedrooms: 5,
    bathrooms: 4,
    summary:
      "A stone-and-timber hillside home that steps down its slope, framing long views of the foothills from every level.",
    concept: [
      "The Sierra Retreat is designed for a sloping lot, letting the home step with the terrain instead of fighting it. A grounded stone base holds the lower level into the hill, while lighter timber volumes reach out toward the view above.",
      "Panoramic glass walls turn the main living level into a viewing platform, opening onto a broad entertainment terrace that works for quiet mornings and large gatherings alike.",
      "A dedicated home office sits apart from family spaces with its own view, and the primary suite occupies a private wing with morning light.",
    ],
    features: [
      { title: "Stone and timber exterior", body: "Dry-stacked stone base with warm timber cladding and dark metal accents." },
      { title: "Panoramic glass walls", body: "Floor-to-ceiling glazing frames the foothills across the main living level." },
      { title: "Outdoor entertainment terrace", body: "A covered terrace with an outdoor kitchen, fire feature and long sightlines." },
      { title: "Integrated home office", body: "A quiet, daylit workspace separated from family zones, with built-in storage." },
      { title: "Spacious primary suite", body: "A private wing with a sitting area, walk-in closet and spa-like bath." },
    ],
    ideaFor: ["Sloped or view lots", "Remote workers and hybrid schedules", "Families who host extended visits"],
    planNotes: [
      { label: "Levels", value: "2 stories, split with the slope" },
      { label: "Garage", value: "3 car, upper-level access" },
      { label: "Lot fit (concept)", value: "Sloped lot, approx. 0.4 acre and up" },
      { label: "Outdoor rooms", value: "Entertainment terrace, lower patio" },
    ],
    images: [
      { src: "/images/sierra-1.jpg", alt: "Concept rendering of the Sierra Retreat with a stone base, timber upper volume and panoramic glass on a hillside", caption: "Stepping with the hillside" },
      { src: "/images/sierra-2.jpg", alt: "Concept rendering of a covered outdoor entertainment terrace overlooking the foothills", caption: "The entertainment terrace" },
      { src: "/images/sierra-3.jpg", alt: "Concept rendering of a calm home office with built-in shelving and a large window", caption: "An integrated home office with a view" },
      { src: "/images/sierra-4.jpg", alt: "Concept rendering of a primary suite with a full-height glass wall", caption: "The primary suite" },
    ],
  },
  {
    slug: "oak-meadow-house",
    name: "The Oak Meadow House",
    location: "Elk Grove, CA",
    style: "Modern Farmhouse",
    sqft: 2850,
    bedrooms: 4,
    bathrooms: 3,
    summary:
      "A warm, modern farmhouse with clean gables, a generous covered porch and family spaces that flow into a large backyard.",
    concept: [
      "Oak Meadow takes the familiar farmhouse silhouette and makes it calmer: crisp gables, a restrained material palette and generous windows in place of ornament.",
      "Inside, a custom kitchen island sits at the center of open family spaces, keeping sightlines to the backyard so parents can cook while kids play outside.",
      "A deep covered outdoor room extends the living area through much of the year, with a large landscaped yard beyond for gardens, play and gatherings.",
    ],
    features: [
      { title: "Warm contemporary interiors", body: "Light oak, soft whites and textured tile create a relaxed, lived-in calm." },
      { title: "Covered outdoor living", body: "A deep porch with ceiling fans and room for dining and lounging." },
      { title: "Custom kitchen island", body: "A generous island with seating for five and integrated storage." },
      { title: "Open family spaces", body: "Kitchen, dining and living connected, with a flexible den off the main room." },
      { title: "Large landscaped backyard", body: "Lawn, garden beds and shade trees planned together with the house." },
    ],
    ideaFor: ["Growing families", "Wider suburban or semi-rural lots", "Single-level main living"],
    planNotes: [
      { label: "Levels", value: "1 story with bonus loft" },
      { label: "Garage", value: "2 car + storage bay" },
      { label: "Lot fit (concept)", value: "Approx. 80 × 130 ft and up" },
      { label: "Outdoor rooms", value: "Covered porch, backyard" },
    ],
    images: [
      { src: "/images/oakmeadow-1.jpg", alt: "Concept rendering of the Oak Meadow House, a modern farmhouse with gabled roofs and a covered porch", caption: "A calmer farmhouse silhouette" },
      { src: "/images/oakmeadow-2.jpg", alt: "Concept rendering of a covered outdoor living area with dining and lounge seating", caption: "Covered outdoor living" },
      { src: "/images/oakmeadow-3.jpg", alt: "Concept rendering of a bright kitchen with a large custom island", caption: "The custom kitchen island" },
      { src: "/images/oakmeadow-4.jpg", alt: "Concept rendering of a large landscaped backyard behind a modern farmhouse", caption: "A backyard planned with the house" },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const formatSqft = (n: number) => `${n.toLocaleString("en-US")} sq ft`;
