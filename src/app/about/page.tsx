import type { Metadata } from "next";
import { PageHero, SectionHeading } from "@/components/ui/Section";
import { EditorialSplit } from "@/components/sections/Editorial";
import { Principles } from "@/components/sections/HomeSections";
import { FinalCta } from "@/components/sections/FinalCta";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us — A Design-Led Custom Home Studio",
  description:
    "Aurelia Grove is a concept design-build studio for custom homes in the Sacramento region, built around personalized planning, design-led thinking and clear communication.",
  alternates: { canonical: "/about" },
};

const commitments = [
  { title: "We'll talk about money early", body: "Budget isn't an awkward topic saved for later. It's a design input from the first conversation." },
  { title: "We'll put decisions in writing", body: "Selections, allowances and changes are documented, so nothing depends on memory." },
  { title: "We'll tell you what we don't know yet", body: "Some answers — like permit timelines or soil conditions — need research. We'll say so, and explain how we'll find out." },
  { title: "We'll respect your time", body: "Organized meetings, clear agendas and decisions sequenced so you're never overwhelmed." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        image="/images/about.jpg"
        alt="Concept rendering of a calm architectural study"
        eyebrow="About Aurelia Grove"
        title="Homes Shaped by the People Who Live in Them."
        lede="Aurelia Grove is a concept design-build studio for custom homes in Sacramento and its surrounding communities."
        crumbs={[{ name: "About", path: "/about" }]}
        size="md"
      />

      <EditorialSplit
        image="/images/intro-living.jpg"
        alt="Concept rendering of a double-height living room with floor-to-ceiling glass"
        eyebrow="Our point of view"
        title="Good Design Is a Way of Paying Attention."
      >
        <p>
          We believe a home should feel effortless to live in — and that feeling comes from hundreds of small, considered
          decisions: the width of a hallway, the height of a window sill, the place you drop your keys.
        </p>
        <p>
          So we start with conversation, not catalogs. We study your lot and your routines, then shape light, space and
          materials around them. Throughout, we keep cost and schedule visible, because a beautiful plan is only valuable if
          it can be built.
        </p>
      </EditorialSplit>

      <Principles />

      <section className="section-y bg-ivory">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our commitments"
            title="What Working Together Should Feel Like."
            lede="Promises about outcomes are easy to make. These are commitments about how we work."
          />
          <ul className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2">
            {commitments.map((c, i) => (
              <li key={c.title} data-reveal className="flex gap-6 border-t border-line pt-8">
                <span className="font-serif text-3xl text-clay">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[1.75rem] leading-tight text-forest">{c.title}</h3>
                  <p className="mt-3 leading-relaxed text-stone">{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-sand/55 py-20">
        <div className="container-x max-w-4xl">
          <div className="border border-forest/20 bg-ivory p-8 md:p-12">
            <p className="eyebrow text-clay">A note on this website</p>
            <h2 className="mt-4 font-serif text-3xl text-forest">This is a concept, and we&apos;re upfront about it.</h2>
            <p className="mt-5 leading-relaxed text-stone">
              Aurelia Grove Custom Homes is a fictional company created to demonstrate premium web design, UX and conversion
              strategy for a custom home builder. That&apos;s why you won&apos;t find team bios, testimonials, awards, ratings or
              license verifications here — publishing invented ones would be misleading. A real builder would add verified
              information in their place.
            </p>
            <div className="mt-8">
              <ButtonLink href="/terms#demo" variant="text">
                Read the demo notice
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
