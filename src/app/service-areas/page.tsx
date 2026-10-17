import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero, SectionHeading } from "@/components/ui/Section";
import { FinalCta } from "@/components/sections/FinalCta";
import { ButtonLink } from "@/components/ui/Button";
import { cityPages, serviceAreas } from "@/config/areas";

export const metadata: Metadata = {
  title: "Service Areas — Custom Homes Across Greater Sacramento",
  description:
    "Custom home design and construction across greater Sacramento: Sacramento, Elk Grove, Folsom, Roseville, Rocklin, Granite Bay, Rancho Cordova, Davis, Fair Oaks and Carmichael.",
  alternates: { canonical: "/service-areas" },
};

export default function ServiceAreasPage() {
  return (
    <>
      <PageHero
        image="/images/oakmeadow-4.jpg"
        alt="Concept rendering of a landscaped backyard behind a modern farmhouse"
        eyebrow="Service areas"
        title="Rooted in Greater Sacramento."
        lede="From riverside infill lots to foothill view sites, every community in the region brings its own character — and its own planning considerations."
        crumbs={[{ name: "Service Areas", path: "/service-areas" }]}
        size="md"
      />

      <section className="section-y bg-ivory">
        <div className="container-x">
          <SectionHeading eyebrow="Featured communities" title="Local Guides to Building Custom." lede="Each guide covers the character of the area, common lot types and the planning considerations worth knowing early." />
          <ul className="mt-14 grid gap-8 md:grid-cols-3">
            {cityPages.map((c) => (
              <li key={c.slug} data-reveal>
                <Link href={`/service-areas/${c.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                    <Image src={c.heroImage} alt={c.heroAlt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
                    <div className="scrim-bottom absolute inset-0" aria-hidden="true" />
                    <div className="absolute bottom-6 left-6 right-6 text-ivory">
                      <p className="eyebrow text-clay-light">Custom homes in</p>
                      <h2 className="mt-2 font-serif text-4xl">{c.city}</h2>
                    </div>
                  </div>
                  <p className="mt-5 leading-relaxed text-stone">{c.lede.split(". ")[0]}.</p>
                  <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-forest">
                    <span className="link-underline group-hover:bg-[length:100%_1px]">Read the {c.city} guide</span> →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y bg-sand/55">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Where we work" title="Ten Communities, One Region." />
            <p data-reveal className="mt-6 leading-relaxed text-stone">
              Building nearby but don&apos;t see your town? Reach out anyway — we&apos;ll tell you honestly whether we can help.
            </p>
            <div data-reveal className="mt-8">
              <ButtonLink href="/contact" variant="outline">
                Ask About Your Location
              </ButtonLink>
            </div>
          </div>
          <ul className="grid gap-px self-start bg-line sm:grid-cols-2 lg:col-span-8">
            {serviceAreas.map((a) => (
              <li key={a.name} className="bg-ivory p-6">
                <h3 className="font-serif text-2xl text-forest">
                  {a.slug ? (
                    <Link href={`/service-areas/${a.slug}`} className="link-underline">
                      {a.name}
                    </Link>
                  ) : (
                    a.name
                  )}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone">{a.blurb}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
