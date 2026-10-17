import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, SectionHeading } from "@/components/ui/Section";
import { Gallery } from "@/components/sections/Gallery";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { FinalCta } from "@/components/sections/FinalCta";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectView } from "@/components/analytics/ProjectView";
import { formatSqft, getProject, projects } from "@/config/projects";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.style} Concept Home, ${p.location}`,
    description: `${p.summary} ${formatSqft(p.sqft)}, ${p.bedrooms} bedrooms, ${p.bathrooms} baths. Concept design.`,
    alternates: { canonical: `/home-designs/${p.slug}` },
    openGraph: { images: [{ url: p.images[0].src, width: 2000, height: 1300, alt: p.images[0].alt }] },
  };
}

export default async function ProjectPage({ params }: Props) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const others = projects.filter((x) => x.slug !== p.slug);

  const specs: [string, string][] = [
    ["Location", p.location],
    ["Style", p.style],
    ["Size", formatSqft(p.sqft)],
    ["Bedrooms", String(p.bedrooms)],
    ["Bathrooms", String(p.bathrooms)],
  ];

  return (
    <>
      <ProjectView slug={p.slug} name={p.name} />
      <PageHero
        image={p.images[0].src}
        alt={p.images[0].alt}
        eyebrow={`Concept Design · ${p.style}`}
        title={p.name}
        lede={p.summary}
        crumbs={[
          { name: "Home Designs", path: "/home-designs" },
          { name: p.name, path: `/home-designs/${p.slug}` },
        ]}
        label="Concept Design"
      />

      <section className="border-b border-line bg-ivory">
        <div className="container-x">
          <dl className="grid grid-cols-2 gap-px bg-line md:grid-cols-5">
            {specs.map(([k, v]) => (
              <div key={k} className="bg-ivory py-7 pr-4 max-md:even:pl-5 md:px-6 md:first:pl-0">
                <dt className="eyebrow text-stone">{k}</dt>
                <dd className="mt-2 font-serif text-2xl text-forest md:text-[1.7rem]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-y bg-ivory">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p data-reveal className="eyebrow text-clay">The concept</p>
            <h2 data-reveal className="mt-5 text-h2 text-forest">Designed Around a Single Idea.</h2>
          </div>
          <div className="space-y-6 text-lede text-stone lg:col-span-6 lg:col-start-7">
            {p.concept.map((para) => (
              <p data-reveal key={para}>
                {para}
              </p>
            ))}
            <p data-reveal className="border-l-2 border-terracotta pl-5 text-base text-charcoal">
              This is a fictional concept design illustrated with original renderings. It is not a home built by the company,
              and it is not offered at a fixed price.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-ivory pb-24 md:pb-32" aria-labelledby="gallery-title">
        <div className="container-x">
          <h2 id="gallery-title" className="sr-only">
            Gallery
          </h2>
          <Gallery images={p.images} title={p.name} />
        </div>
      </section>

      <section className="section-y bg-sand/55">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Key features" title="What Makes It Feel Like Home." />
            <div data-reveal className="mt-10 bg-ivory p-7">
              <h3 className="eyebrow text-stone">Plan notes (concept)</h3>
              <dl className="mt-4 space-y-3 text-sm">
                {p.planNotes.map((n) => (
                  <div key={n.label} className="flex justify-between gap-4 border-b border-line pb-3">
                    <dt className="text-stone">{n.label}</dt>
                    <dd className="text-right font-semibold text-charcoal">{n.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ul className="border-t border-line">
              {p.features.map((f, i) => (
                <li key={f.title} data-reveal className="grid gap-2 border-b border-line py-7 sm:grid-cols-12 sm:gap-6">
                  <span className="font-serif text-xl text-clay sm:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-serif text-2xl leading-tight text-forest sm:col-span-5">{f.title}</h3>
                  <p className="leading-relaxed text-stone sm:col-span-6">{f.body}</p>
                </li>
              ))}
            </ul>
            <div data-reveal className="mt-12">
              <h3 className="eyebrow text-stone">A good fit for</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.ideaFor.map((t) => (
                  <li key={t} className="border border-forest/25 px-4 py-2 text-sm text-charcoal">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="on-dark bg-forest py-20 text-ivory md:py-24">
        <div className="container-x flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="eyebrow text-clay-light">Inspired by {p.name.replace("The ", "")}?</p>
            <h2 className="mt-4 text-h2">Let&apos;s design a version that fits your lot and life.</h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <ButtonLink href={`/planner?type=custom-home`} variant="light">
              Plan My Custom Home
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline-light">
              Request a Consultation
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="section-y bg-ivory">
        <div className="container-x">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading eyebrow="More concepts" title="Keep Exploring." />
            <Link href="/home-designs" className="link-underline hidden text-xs font-semibold uppercase tracking-[0.14em] text-forest sm:block">
              All home designs →
            </Link>
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-2">
            {others.map((o) => (
              <ProjectCard key={o.slug} project={o} />
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
