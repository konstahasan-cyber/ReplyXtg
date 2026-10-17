import type { Metadata } from "next";
import { PageHero, SectionHeading } from "@/components/ui/Section";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { FinalCta } from "@/components/sections/FinalCta";
import { ButtonLink } from "@/components/ui/Button";
import { PrimaryCta } from "@/components/analytics/Experiments";
import { projects } from "@/config/projects";

export const metadata: Metadata = {
  title: "Modern Custom Home Designs — Concept Homes",
  description:
    "Explore modern custom home concept designs for the Sacramento region: a California contemporary, a stone-and-timber hillside home and a modern farmhouse.",
  alternates: { canonical: "/home-designs" },
};

const styles = [
  { name: "California Modern", body: "Clean lines, deep overhangs, natural light and indoor-outdoor flow." },
  { name: "Modern Farmhouse", body: "Familiar gables and porches, simplified and warmed with natural wood." },
  { name: "Contemporary Luxury", body: "Bold massing, stone and glass, with refined, quiet detailing." },
  { name: "Mediterranean", body: "Smooth plaster, clay tile, shaded loggias and courtyard living." },
];

export default function HomeDesignsPage() {
  return (
    <>
      <PageHero
        image="/images/sierra-2.jpg"
        alt="Concept rendering of a covered terrace overlooking the foothills"
        eyebrow="Home designs"
        title="Concept Homes for the Way You Live."
        lede="Each concept explores how a specific lot, climate and lifestyle can shape a home. Use them as inspiration — your home will be designed for you."
        crumbs={[{ name: "Home Designs", path: "/home-designs" }]}
        label="Concept designs"
      >
        <PrimaryCta location="designs_hero" variant="light" />
      </PageHero>

      <section className="section-y bg-ivory">
        <div className="container-x">
          <SectionHeading
            eyebrow="Three concepts"
            title="Starting Points, Not Floor Plans to Copy."
            lede="These designs are fictional concepts illustrated with original renderings. They show possible layouts, features and materials — not completed projects or fixed prices."
          />
          <ul className="mt-16 grid gap-x-10 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <li key={p.slug} className={i === 1 ? "lg:mt-24" : ""}>
                <ProjectCard project={p} index={i} headingLevel="h2" />
                <p className="mt-4 text-[0.98rem] leading-relaxed text-stone">{p.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y bg-sand/55">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Styles we explore"
              title="Find the Language of Your Home."
              lede="Style is a starting vocabulary. The details — proportions, materials, how rooms meet the outdoors — come from your site and your routines."
            />
            <div data-reveal className="mt-10">
              <ButtonLink href="/planner">Start Planning My Home</ButtonLink>
            </div>
          </div>
          <dl className="grid gap-px self-start bg-line sm:grid-cols-2 lg:col-span-7">
            {styles.map((s) => (
              <div key={s.name} data-reveal className="bg-ivory p-8">
                <dt className="font-serif text-2xl text-forest">{s.name}</dt>
                <dd className="mt-3 leading-relaxed text-stone">{s.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <FinalCta title="Have a Lot, a Sketch or Just an Idea?" sub="Bring whatever you have. We'll help you understand what's possible and what comes next." />
    </>
  );
}
