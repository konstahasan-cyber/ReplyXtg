import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/Section";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { principles, services } from "@/config/content";
import { projects } from "@/config/projects";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as React.CSSProperties;

export function Introduction() {
  return (
    <section id="introduction" className="section-y overflow-hidden bg-ivory">
      <div className="container-x grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-6 lg:col-start-1">
          <div data-reveal="image" className="relative aspect-[4/5] w-[86%] overflow-hidden bg-sand">
            <Image
              src="/images/intro-living.jpg"
              alt="Concept rendering of a double-height living room with floor-to-ceiling glass opening to a garden"
              fill
              sizes="(min-width: 1024px) 42vw, 86vw"
              className="object-cover"
            />
          </div>
          <div
            data-reveal="image"
            style={delay(200)}
            className="absolute -bottom-10 right-0 aspect-square w-[44%] overflow-hidden border-[10px] border-ivory bg-sand"
          >
            <Image
              src="/images/intro-detail.jpg"
              alt="Concept rendering of oak slats and natural stone in warm raking light"
              fill
              sizes="(min-width: 1024px) 22vw, 44vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p data-reveal className="eyebrow text-clay">
            The art of feeling at home
          </p>
          <h2 data-reveal style={delay(80)} className="mt-5 text-h2 text-forest">
            More Than a House. <em className="font-normal italic text-clay">A Place to Belong.</em>
          </h2>
          <div data-reveal style={delay(160)} className="mt-8 space-y-5 text-lede text-stone">
            <p>
              The best homes aren&apos;t defined by square footage. They&apos;re defined by the quiet ease of a morning
              kitchen, the way afternoon light reaches the sofa, a door that opens exactly where you want to step outside.
            </p>
            <p>
              Aurelia Grove designs and builds custom homes around those moments. We begin with how you live — then shape
              rooms, light and materials until the house feels unmistakably yours.
            </p>
          </div>
          <dl data-reveal style={delay(240)} className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
            {[
              ["Your lot", "Designed for its light, views and setting"],
              ["Your life", "Rooms shaped around daily routines"],
              ["Your budget", "Cost discussed early and often"],
            ].map(([t, d]) => (
              <div key={t}>
                <dt className="font-serif text-xl text-forest md:text-2xl">{t}</dt>
                <dd className="mt-2 text-sm leading-snug text-stone">{d}</dd>
              </div>
            ))}
          </dl>
          <div data-reveal style={delay(300)} className="mt-10">
            <ButtonLink href="/about" variant="text">
              Our approach
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedProjects() {
  const [first, ...rest] = projects;
  return (
    <section className="section-y bg-sand/55">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Featured concept homes"
            title="Designs That Begin With Daily Life."
            lede="Three concept designs that show how lot, climate and lifestyle shape a home. Each one is a starting point for conversation — not a catalog plan."
          />
          <div data-reveal className="shrink-0">
            <ButtonLink href="/home-designs" variant="outline">
              Explore Home Designs
            </ButtonLink>
          </div>
        </div>
        <div className="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-12">
          <div className="md:col-span-2 lg:col-span-7">
            <ProjectCard project={first} index={0} size="large" />
          </div>
          <div className="lg:col-span-5 lg:pt-32">
            <ProjectCard project={rest[0]} index={1} />
          </div>
          <div className="lg:col-span-5 lg:col-start-3 lg:-mt-24">
            <ProjectCard project={rest[1]} index={2} />
          </div>
          <div className="flex items-end lg:col-span-4 lg:col-start-9">
            <p data-reveal className="max-w-sm border-l-2 border-terracotta pl-5 text-sm leading-relaxed text-stone">
              All homes shown are <strong className="font-semibold text-charcoal">concept designs</strong> illustrated with
              original renderings. They are not completed projects.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServicesGrid({ heading = true }: { heading?: boolean }) {
  return (
    <section className="section-y bg-ivory">
      <div className="container-x">
        {heading && (
          <SectionHeading
            eyebrow="What we do"
            title="From First Sketch to Final Key."
            lede="Four ways we help — each with a clear outcome, so you know exactly what you're getting at every stage."
          />
        )}
        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {services.map((s, i) => (
            <li key={s.slug} data-reveal style={delay(i * 90)} className={i % 2 === 1 ? "lg:mt-20" : ""}>
              <Link href={s.href} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 23vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                  />
                  <div className="scrim-bottom absolute inset-0 opacity-90" aria-hidden="true" />
                  <p className="absolute bottom-5 left-5 right-5 font-serif text-[1.65rem] leading-tight text-ivory">{s.title}</p>
                </div>
                <p className="mt-5 text-[0.98rem] leading-relaxed text-charcoal">{s.outcome}</p>
                <p className="mt-3 text-sm leading-relaxed text-stone">{s.body}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-forest">
                  <span className="link-underline group-hover:bg-[length:100%_1px]">Learn more</span>
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Principles() {
  return (
    <section className="on-dark section-y grain relative overflow-hidden bg-forest text-ivory">
      <div className="container-x relative grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            tone="light"
            eyebrow="Why Aurelia Grove"
            title="A Thoughtful Approach to Every Detail."
            lede="Building a custom home is a long collaboration. These are the principles this concept brand is built around — the way we'd want to be treated if it were our home."
          />
          <div data-reveal className="relative mt-12 hidden aspect-[4/3] overflow-hidden lg:block">
            <Image
              src="/images/about.jpg"
              alt="Concept rendering of a calm architectural massing study"
              fill
              sizes="40vw"
              className="object-cover opacity-90"
            />
          </div>
        </div>
        <ol className="grid gap-px self-end bg-ivory/15 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
          {principles.map((p, i) => (
            <li key={p.title} data-reveal style={delay(i * 100)} className="bg-forest p-8 md:p-10">
              <span className="font-serif text-5xl text-clay-light/90">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-[1.8rem] leading-tight text-ivory">{p.title}</h3>
              <p className="mt-4 leading-relaxed text-ivory/75">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
