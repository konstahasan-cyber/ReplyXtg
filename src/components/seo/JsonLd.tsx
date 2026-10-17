import { serviceAreas } from "@/config/areas";
import { company, siteUrl } from "@/config/site";

/**
 * Structured data. Deliberately conservative for a fictional company:
 * no street address, no ratings, no reviews, no license claims.
 */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteUrl}/#organization`,
    name: company.name,
    slogan: company.tagline,
    description: `${company.description} This is a concept website for a fictional company.`,
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    image: `${siteUrl}/images/og.jpg`,
    telephone: "+1-916-555-0142",
    email: company.email,
    address: { "@type": "PostalAddress", addressLocality: company.city, addressRegion: company.region, addressCountry: company.country },
    areaServed: serviceAreas.map((a) => ({ "@type": "City", name: `${a.name}, CA` })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${siteUrl}${it.path}` })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function serviceJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${siteUrl}${path}`,
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: { "@type": "AdministrativeArea", name: "Greater Sacramento, CA" },
  };
}
