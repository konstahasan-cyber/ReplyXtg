import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { EmailLink, PhoneLink } from "@/components/analytics/Tracked";
import { Breadcrumbs } from "@/components/ui/Section";
import { company } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact — Request a Project Consultation",
  description:
    "Request a custom home consultation in the Sacramento region. Call, email or send a short message — tell us what you're imagining and we'll help you explore next steps.",
  alternates: { canonical: "/contact" },
};

const expectations = [
  ["A reply, not a sales script", "Someone reads your note and responds to what you actually asked."],
  ["An unhurried first conversation", "Typically 30–45 minutes about your goals, lot, budget range and questions."],
  ["Honest next steps", "If we're not the right fit, we'll say so — and point you in a useful direction."],
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-ivory">
        <div className="container-x grid gap-16 pb-24 pt-14 lg:grid-cols-12 lg:gap-12 lg:pt-20">
          <div className="lg:col-span-5">
            <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} tone="dark" />
            <p className="eyebrow mt-10 text-clay">Request a project consultation</p>
            <h1 className="mt-5 text-h1 text-forest">Let&apos;s Talk About Your Home.</h1>
            <p className="mt-6 text-lede text-stone">
              Whether you own a lot, are comparing options or are simply curious about what a custom home involves, a short
              message is the perfect start.
            </p>

            <dl className="mt-12 space-y-8">
              <div className="border-t border-line pt-6">
                <dt className="eyebrow text-stone">Call</dt>
                <dd className="mt-2 font-serif text-3xl text-forest">
                  <PhoneLink location="contact_page" className="link-underline" />
                </dd>
              </div>
              <div className="border-t border-line pt-6">
                <dt className="eyebrow text-stone">Email</dt>
                <dd className="mt-2 break-all font-serif text-2xl text-forest sm:text-3xl">
                  <EmailLink location="contact_page" className="link-underline" />
                </dd>
              </div>
              <div className="border-t border-line pt-6">
                <dt className="eyebrow text-stone">Based in</dt>
                <dd className="mt-2 text-charcoal">
                  {company.city}, {company.regionName} — serving the{" "}
                  <Link href="/service-areas" className="underline decoration-terracotta underline-offset-4">
                    greater Sacramento region
                  </Link>
                  .
                </dd>
              </div>
            </dl>
            <p className="mt-10 border-l-2 border-terracotta pl-4 text-sm leading-relaxed text-stone">
              Concept website: the phone number and email use reserved example ranges and do not reach a real company.
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="bg-white p-6 shadow-[0_40px_80px_-50px_rgb(32_39_36/0.4)] ring-1 ring-line sm:p-10 md:p-12">
              <h2 className="font-serif text-3xl text-forest">Send a short message</h2>
              <p className="mt-2 text-sm text-stone">Three required fields. Optional details come after, only if you want.</p>
              <div className="mt-10">
                <ConsultationForm />
              </div>
            </div>
            <p className="mt-6 text-sm text-stone">
              Prefer a guided start?{" "}
              <Link href="/planner" className="font-semibold text-forest underline decoration-terracotta underline-offset-4">
                Try the Home Planner
              </Link>{" "}
              — seven quick questions and a project summary.
            </p>
          </div>
        </div>
      </section>

      <section className="on-dark bg-forest py-20 text-ivory md:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12">
          <div className="relative aspect-[4/3] overflow-hidden lg:col-span-5">
            <Image src="/images/intro-detail.jpg" alt="Concept rendering of oak and stone details in warm light" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow text-clay-light">What happens next</p>
            <h2 className="mt-5 text-h2">A calm, useful first step.</h2>
            <ol className="mt-10 space-y-8">
              {expectations.map(([t, d], i) => (
                <li key={t} className="flex gap-6">
                  <span className="font-serif text-4xl leading-none text-clay-light">{i + 1}</span>
                  <div>
                    <h3 className="font-sans text-lg font-semibold">{t}</h3>
                    <p className="mt-1 leading-relaxed text-ivory/75">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
