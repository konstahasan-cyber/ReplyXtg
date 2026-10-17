import type { Metadata } from "next";
import { HomeHero } from "@/components/sections/HomeHero";
import { FeaturedProjects, Introduction, Principles, ServicesGrid } from "@/components/sections/HomeSections";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { PlannerTeaser } from "@/components/sections/PlannerTeaser";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/Section";
import { faqs } from "@/config/content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Introduction />
      <FeaturedProjects />
      <ServicesGrid />
      <Principles />

      <section className="section-y bg-ivory" id="process">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Our process"
              title="Six Clear Steps, No Guesswork."
              lede="Knowing what comes next is the best antidote to the stress of building. Select a step to see what happens, what you'll provide and what you'll receive."
            />
            <div data-reveal className="shrink-0">
              <ButtonLink href="/process" variant="outline">
                Understand the Building Process
              </ButtonLink>
            </div>
          </div>
          <div className="mt-16">
            <ProcessTimeline />
          </div>
        </div>
      </section>

      <PlannerTeaser />
      <FaqSection faqs={faqs.slice(0, 9)} />
      <FinalCta />
    </>
  );
}
