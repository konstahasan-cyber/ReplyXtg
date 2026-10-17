import type { Metadata } from "next";
import { PageHero, SectionHeading } from "@/components/ui/Section";
import { CheckList, EditorialSplit } from "@/components/sections/Editorial";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { ButtonLink } from "@/components/ui/Button";
import { PrimaryCta } from "@/components/analytics/Experiments";
import { JsonLd, serviceJsonLd } from "@/components/seo/JsonLd";
import { faqs } from "@/config/content";

const description =
  "Custom home construction in Sacramento and nearby communities: one accountable team from lot feasibility and design coordination through permits, construction and final walkthrough.";

export const metadata: Metadata = {
  title: "Custom Home Construction in Sacramento, CA",
  description,
  alternates: { canonical: "/custom-home-building" },
};

const fears = [
  {
    worry: "“What if the budget keeps growing?”",
    answer: "Cost checkpoints throughout design, documented allowances and written change orders priced before any work proceeds.",
  },
  {
    worry: "“How will I know what's happening?”",
    answer: "A single point of contact, scheduled updates with photos, and a shared log of decisions and selections.",
  },
  {
    worry: "“What about permits and delays?”",
    answer: "Early feasibility review, realistic scheduling and proactive coordination with the building department and consultants.",
  },
  {
    worry: "“Will the quality be there?”",
    answer: "Careful trade coordination, inspections at required stages and a detailed walkthrough before handover.",
  },
];

const included = [
  "Lot feasibility and zoning review",
  "Programming: rooms, adjacencies and priorities",
  "Coordination with architect, engineers and consultants",
  "Budget framework and cost checkpoints",
  "Permit submission and plan-check responses",
  "Trade bidding, scheduling and site management",
  "Selections tracking and allowance management",
  "Final walkthrough, punch list and home documentation",
];

export default function CustomHomeBuildingPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd("Custom Home Construction", description, "/custom-home-building")} />
      <PageHero
        image="/images/service-custom.jpg"
        alt="Concept rendering of a custom home with warm light glowing through tall windows"
        eyebrow="Custom home building · Sacramento region"
        title="A Custom Home, Built With Clarity."
        lede="One accountable team carries your home from the first site visit to the final walkthrough — with the budget, schedule and decisions out in the open."
        crumbs={[{ name: "Custom Home Building", path: "/custom-home-building" }]}
      >
        <PrimaryCta location="service_custom_hero" variant="light" />
        <ButtonLink href="/process" variant="outline-light">
          Understand the Building Process
        </ButtonLink>
      </PageHero>

      <EditorialSplit
        image="/images/riverstone-4.jpg"
        alt="Concept rendering of a great room opening fully to a terrace through sliding glass walls"
        eyebrow="What custom really means"
        title="Designed for One Lot and One Household."
      >
        <p>
          A production home is designed for an average buyer. A custom home is designed for you: where the morning sun lands,
          how you cook, who visits, what you collect, how you work, and which view you want from your favorite chair.
        </p>
        <p>
          That freedom comes with decisions. Our role is to make them manageable — sequencing choices, explaining trade-offs
          and keeping cost visible so every decision is an informed one.
        </p>
      </EditorialSplit>

      <section className="on-dark section-y bg-forest text-ivory">
        <div className="container-x">
          <SectionHeading
            tone="light"
            eyebrow="Built to reduce uncertainty"
            title="The Worries Are Real. So Is the Plan for Them."
            lede="Building a home is a major commitment. Here's how this approach addresses the concerns we hear most often."
          />
          <ul className="mt-16 grid gap-px bg-ivory/15 md:grid-cols-2">
            {fears.map((f) => (
              <li key={f.worry} data-reveal className="bg-forest p-8 md:p-12">
                <p className="font-serif text-3xl italic text-clay-light">{f.worry}</p>
                <p className="mt-5 text-lg leading-relaxed text-ivory/85">{f.answer}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y bg-ivory">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Scope" title="What's Included." lede="Every project is scoped individually; this is the typical shape of a full custom home engagement." />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <CheckList items={included} />
            <div className="mt-10">
              <ButtonLink href="/contact">Request a Project Consultation</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <EditorialSplit
        id="luxury"
        tone="sand"
        reverse
        image="/images/service-luxury.jpg"
        alt="Concept rendering of a refined interior with stone, oak and soft evening light"
        eyebrow="Luxury residences"
        title="Refinement Lives in the Details."
      >
        <p>
          Large-format glazing, custom millwork, natural stone and integrated systems require precise coordination between
          designers, fabricators and trades. We plan these elements early so they&apos;re detailed, priced and sequenced well before
          installation.
        </p>
        <p>
          A clear selections schedule — with lead times and allowances — keeps premium finishes from becoming late-stage
          surprises.
        </p>
      </EditorialSplit>

      <FaqSection faqs={faqs.filter((f) => ["Cost", "Budget", "Timeline", "Rebuild", "Land"].includes(f.topic))} title="Questions About Custom Homes" />
      <FinalCta />
    </>
  );
}
