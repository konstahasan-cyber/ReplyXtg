import type { Metadata } from "next";
import { PageHero, SectionHeading } from "@/components/ui/Section";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { ButtonLink } from "@/components/ui/Button";
import { PrimaryCta } from "@/components/analytics/Experiments";
import { faqs, processDisclaimer, processSteps } from "@/config/content";

export const metadata: Metadata = {
  title: "Our Custom Home Building Process — Six Clear Steps",
  description:
    "Understand the custom home building process: discovery, site planning, design development, permits and preconstruction, construction and final walkthrough.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        image="/images/service-planning.jpg"
        alt="Concept rendering of a white architectural massing model"
        eyebrow="Our process"
        title="Understand Every Step Before You Take It."
        lede="Building a custom home involves many decisions over many months. Knowing the sequence — and what's expected of you — makes the journey calmer."
        crumbs={[{ name: "Our Process", path: "/process" }]}
        size="md"
      >
        <PrimaryCta location="process_hero" variant="light" />
      </PageHero>

      <section className="section-y bg-ivory">
        <div className="container-x">
          <SectionHeading eyebrow="Interactive overview" title="The Six Phases at a Glance." lede="Select a phase to see what happens, what you'll provide and what you'll receive." />
          <div className="mt-16">
            <ProcessTimeline />
          </div>
        </div>
      </section>

      <section className="on-dark section-y bg-forest text-ivory">
        <div className="container-x">
          <SectionHeading tone="light" eyebrow="In detail" title="What Each Phase Involves." />
          <ol className="mt-16 space-y-0">
            {processSteps.map((s) => (
              <li key={s.number} data-reveal className="grid gap-6 border-t border-ivory/15 py-12 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <span className="font-serif text-6xl text-clay-light/80">{s.number}</span>
                  <h3 className="mt-3 text-h3">{s.title}</h3>
                </div>
                <div className="lg:col-span-5">
                  <p className="text-lede text-ivory/90">{s.summary}</p>
                  <ul className="mt-5 space-y-2 text-ivory/70">
                    {s.details.map((d) => (
                      <li key={d} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.75em] h-px w-4 shrink-0 bg-terracotta" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6 text-sm lg:col-span-3">
                  <div>
                    <h4 className="eyebrow text-ivory/55">You&apos;ll provide</h4>
                    <p className="mt-2 text-ivory/85">{s.youProvide.join(" · ")}</p>
                  </div>
                  <div>
                    <h4 className="eyebrow text-ivory/55">You&apos;ll receive</h4>
                    <p className="mt-2 text-ivory/85">{s.typicalOutputs.join(" · ")}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-3xl border-l-2 border-terracotta pl-5 text-ivory/75">{processDisclaimer}</p>
        </div>
      </section>

      <section className="section-y bg-sand/55">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Things that affect timing" title="Why No Two Schedules Match." />
          </div>
          <ul className="grid gap-px self-start bg-line sm:grid-cols-2">
            {[
              ["Municipality", "Each city and county has its own review process and workload."],
              ["The lot", "Slope, soils, utilities, flood or fire zones can add studies and steps."],
              ["Design complexity", "Custom structure, glazing and finishes take longer to detail and build."],
              ["Decisions & selections", "Timely choices and long-lead items keep the schedule moving."],
            ].map(([t, d]) => (
              <li key={t} data-reveal className="bg-ivory p-7">
                <h3 className="font-serif text-2xl text-forest">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{d}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="container-x mt-14">
          <ButtonLink href="/contact" variant="outline">
            Ask About Your Timeline
          </ButtonLink>
        </div>
      </section>

      <FaqSection faqs={faqs.filter((f) => ["Timeline", "Permits", "Preparation", "Design"].includes(f.topic))} title="Process Questions" />
      <FinalCta />
    </>
  );
}
