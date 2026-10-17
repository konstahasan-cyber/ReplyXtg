import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, SectionHeading } from "@/components/ui/Section";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { FinalCta } from "@/components/sections/FinalCta";
import { ButtonLink } from "@/components/ui/Button";
import { PrimaryCta } from "@/components/analytics/Experiments";
import { JsonLd, serviceJsonLd } from "@/components/seo/JsonLd";
import { cityPages, getCityPage, serviceAreas } from "@/config/areas";
import { getProject } from "@/config/projects";

type Props = { params: Promise<{ city: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return cityPages.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCityPage((await params).city);
  if (!c) return {};
  return {
    title: c.title,
    description: c.metaDescription,
    alternates: { canonical: `/service-areas/${c.slug}` },
    openGraph: { images: [{ url: c.heroImage, alt: c.heroAlt }] },
  };
}

export default async function CityPage({ params }: Props) {
  const c = getCityPage((await params).city);
  if (!c) notFound();
  const project = getProject(c.featuredProject);
  const nearbyLinks = c.nearby.map((n) => serviceAreas.find((a) => a.name === n)).filter(Boolean);

  return (
    <>
      <JsonLd data={serviceJsonLd(`Custom home building in ${c.city}, CA`, c.metaDescription, `/service-areas/${c.slug}`)} />
      <PageHero
        image={c.heroImage}
        alt={c.heroAlt}
        eyebrow={`${c.intro}, California`}
        title={c.title.replace(", CA", "")}
        lede={c.lede}
        crumbs={[
          { name: "Service Areas", path: "/service-areas" },
          { name: c.city, path: `/service-areas/${c.slug}` },
        ]}
        label="Concept rendering"
      >
        <PrimaryCta location={`city_${c.slug}_hero`} variant="light" />
      </PageHero>

      <section className="section-y bg-ivory">
        <div className="container-x">
          <SectionHeading eyebrow={`Building in ${c.city}`} title={`What Shapes a Custom Home in ${c.city}.`} />
          <ul className="mt-14 grid gap-10 md:grid-cols-3">
            {c.character.map((x, i) => (
              <li key={x.heading} data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties} className="border-t border-forest/30 pt-7">
                <h3 className="text-[1.75rem] leading-tight text-forest">{x.heading}</h3>
                <p className="mt-4 leading-relaxed text-stone">{x.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="on-dark section-y bg-forest text-ivory">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading tone="light" eyebrow="Plan ahead" title="Considerations Worth Checking Early." lede="Requirements vary by parcel. These are the questions we'd look into first for a lot in this area." />
          </div>
          <dl className="space-y-0 lg:col-span-7 lg:col-start-6">
            {c.considerations.map((x) => (
              <div key={x.heading} data-reveal className="grid gap-3 border-t border-ivory/15 py-8 sm:grid-cols-5 sm:gap-8">
                <dt className="font-serif text-2xl sm:col-span-2">{x.heading}</dt>
                <dd className="leading-relaxed text-ivory/75 sm:col-span-3">{x.body}</dd>
              </div>
            ))}
            <p className="border-t border-ivory/15 pt-6 text-sm text-ivory/60">
              Always confirm current requirements with the local building department. This guide is general information, not
              legal or permitting advice.
            </p>
          </dl>
        </div>
      </section>

      {project && (
        <section className="section-y bg-sand/55">
          <div className="container-x grid items-center gap-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ProjectCard project={project} size="large" />
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p data-reveal className="eyebrow text-clay">Concept for {c.city}</p>
              <h2 data-reveal className="mt-5 text-h2 text-forest">{project.name}</h2>
              <p data-reveal className="mt-5 text-lede text-stone">{project.summary}</p>
              <div data-reveal className="mt-8">
                <ButtonLink href={`/home-designs/${project.slug}`} variant="outline">
                  View the Concept
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section-y bg-ivory">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Neighborhoods" title={`Across ${c.city}.`} lede={`Concept examples of areas where a custom home or rebuild might take shape. Every parcel is evaluated individually.`} />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="flex flex-wrap gap-2">
              {c.neighborhoods.map((n) => (
                <li key={n} className="border border-forest/25 px-4 py-2 text-charcoal">
                  {n}
                </li>
              ))}
            </ul>
            <h3 className="eyebrow mt-12 text-stone">Nearby communities</h3>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {nearbyLinks.map((a) =>
                a!.slug ? (
                  <li key={a!.name}>
                    <Link href={`/service-areas/${a!.slug}`} className="link-underline font-semibold text-forest">
                      {a!.name}
                    </Link>
                  </li>
                ) : (
                  <li key={a!.name} className="text-stone">
                    {a!.name}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-y border-t border-line bg-ivory pt-0">
        <div className="container-x">
          <SectionHeading eyebrow="How it works" title="The Path From Lot to Home." />
          <div className="mt-14">
            <ProcessTimeline />
          </div>
        </div>
      </section>

      <FinalCta title={`Planning a Home in ${c.city}?`} sub="Share your lot, your ideas or your questions. We'll help you understand what's possible and what comes next." />
    </>
  );
}
