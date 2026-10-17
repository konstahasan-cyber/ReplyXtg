import type { Metadata } from "next";
import { PageHero, SectionHeading } from "@/components/ui/Section";
import { CheckList, EditorialSplit } from "@/components/sections/Editorial";
import { FinalCta } from "@/components/sections/FinalCta";
import { ButtonLink } from "@/components/ui/Button";
import { PrimaryCta } from "@/components/analytics/Experiments";
import { JsonLd, serviceJsonLd } from "@/components/seo/JsonLd";

const description =
  "Design-build for custom homes in Sacramento: designers and builders working together from day one, so design, cost and constructability develop side by side.";

export const metadata: Metadata = {
  title: "Design-Build Custom Homes in Sacramento",
  description,
  alternates: { canonical: "/design-build" },
};

const comparison = [
  { aspect: "Who you hire", traditional: "Architect first, builder later through bidding", db: "One integrated team from the start" },
  { aspect: "When cost is known", traditional: "Often after drawings are complete", db: "Estimated early, refined at each design stage" },
  { aspect: "Redesign risk", traditional: "Higher if bids exceed the budget", db: "Lower — pricing informs design as it develops" },
  { aspect: "Communication", traditional: "Multiple contracts and points of contact", db: "One point of contact and shared accountability" },
  { aspect: "Best for", traditional: "Clients who want to separate design and construction", db: "Clients who value coordination and cost visibility" },
];

export default function DesignBuildPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd("Design-Build", description, "/design-build")} />
      <PageHero
        image="/images/service-designbuild.jpg"
        alt="Concept rendering of a timber-framed structure taking shape"
        eyebrow="Design-build · Sacramento region"
        title="Design and Cost, Developed Together."
        lede="In design-build, the people drawing your home and the people building it work as one team — so the design you fall in love with is one you can actually build."
        crumbs={[{ name: "Design-Build", path: "/design-build" }]}
      >
        <PrimaryCta location="service_db_hero" variant="light" />
      </PageHero>

      <section className="section-y bg-ivory">
        <div className="container-x">
          <SectionHeading
            eyebrow="Two paths to a custom home"
            title="Traditional vs. Design-Build."
            lede="Both can produce beautiful homes. The difference is when cost and constructability enter the conversation."
          />
          <div className="mt-14 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left">
              <caption className="sr-only">Comparison of traditional design-bid-build and design-build</caption>
              <thead>
                <tr className="border-b border-forest/30">
                  <th scope="col" className="w-1/4 py-4 pr-4 text-xs font-semibold uppercase tracking-[0.14em] text-stone" />
                  <th scope="col" className="w-[37.5%] py-4 pr-6 font-serif text-2xl font-medium text-stone">Design-Bid-Build</th>
                  <th scope="col" className="w-[37.5%] bg-forest px-6 py-4 font-serif text-2xl font-medium text-ivory">Design-Build</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((r) => (
                  <tr key={r.aspect} className="border-b border-line">
                    <th scope="row" className="py-5 pr-4 align-top text-sm font-semibold text-charcoal">{r.aspect}</th>
                    <td className="py-5 pr-6 align-top text-stone">{r.traditional}</td>
                    <td className="bg-sand/50 px-6 py-5 align-top text-charcoal">{r.db}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <EditorialSplit
        id="coordination"
        tone="sand"
        image="/images/service-planning.jpg"
        alt="Concept rendering of a white architectural massing model"
        eyebrow="Architectural design coordination"
        title="Already Have an Architect? Wonderful."
      >
        <p>
          Design coordination works either way. If you&apos;ve hired an architect, we join early to offer constructability and cost
          feedback while the design is still flexible. If you haven&apos;t, we assemble and coordinate the design team for you.
        </p>
        <CheckList
          items={[
            "Constructability reviews at each design stage",
            "Cost feedback on systems, structure and finishes",
            "Engineer and consultant coordination",
            "Permit-set review before submission",
          ]}
        />
      </EditorialSplit>

      <section className="section-y bg-ivory">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="New home planning & consultation" title="Not Ready to Commit? Start With a Plan." />
          </div>
          <div className="space-y-6 text-lede text-stone lg:col-span-6 lg:col-start-7">
            <p data-reveal>
              Many projects begin with a planning engagement: a feasibility review of a lot you own or are considering, a
              programming session to define rooms and priorities, and a budget framework that shows how the pieces fit.
            </p>
            <p data-reveal>
              It&apos;s a focused way to answer the big questions — <em>Can I build what I want here? Roughly what will it involve?</em> —
              before investing in full design.
            </p>
            <div data-reveal className="flex flex-col gap-4 pt-4 sm:flex-row">
              <ButtonLink href="/planner">Start Planning My Home</ButtonLink>
              <ButtonLink href="/process" variant="outline">
                See the Process
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <FinalCta title="One Team. One Conversation. Your Home." />
    </>
  );
}
