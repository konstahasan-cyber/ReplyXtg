import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { PhoneLink } from "@/components/analytics/Tracked";

export function FinalCta({
  title = "Your Next Chapter Starts at Home.",
  sub = "Tell us what you're imagining. We'll help you explore the next steps.",
  image = "/images/final-cta.jpg",
}: {
  title?: string;
  sub?: string;
  image?: string;
}) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-charcoal text-ivory">
      <Image
        src={image}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-70"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/30" aria-hidden="true" />
      <div className="container-x py-32 text-center md:py-44">
        <p data-reveal className="eyebrow text-clay-light">
          Begin the conversation
        </p>
        <h2 data-reveal className="mx-auto mt-6 max-w-4xl text-h1 text-ivory">
          {title}
        </h2>
        <p data-reveal className="mx-auto mt-6 max-w-xl text-lede text-ivory/80">
          {sub}
        </p>
        <div data-reveal className="mt-11 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <ButtonLink href="/contact" variant="light">
            Request a Consultation
          </ButtonLink>
          <PhoneLink location="final_cta" className="link-underline text-sm font-semibold tracking-wide text-ivory/90">
            or call +1 (916) 555-0142
          </PhoneLink>
        </div>
        <p className="mt-14 text-xs text-ivory/50">Concept website · No real consultations are booked through this demo.</p>
      </div>
    </section>
  );
}
