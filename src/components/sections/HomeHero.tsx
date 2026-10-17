"use client";

import Image from "next/image";
import { heroCopy } from "@/config/experiments";
import { ButtonLink } from "@/components/ui/Button";
import { PrimaryCta, useVariants } from "@/components/analytics/Experiments";
import { track } from "@/lib/analytics";

export function HomeHero() {
  const { hero } = useVariants();
  const copy = heroCopy[hero];
  const words = copy.headline.split(" ");
  const mid = Math.ceil(words.length / 2);
  const lines = [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];

  return (
    <section className="on-dark relative -mt-20 flex min-h-[100svh] items-end overflow-hidden bg-forest text-ivory">
      <Image
        src="/images/hero.jpg"
        alt="Concept rendering of a California contemporary custom home at golden hour, with glowing floor-to-ceiling windows, oak screens and a stone wall"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={80}
        className="hero-zoom object-cover object-[65%_50%]"
      />
      <div className="scrim-hero absolute inset-0" aria-hidden="true" />

      <div className="container-x relative pb-24 pt-44 md:pb-28">
        <p className="eyebrow text-clay-light">
          <span className="split-line">
            <span>{copy.eyebrow}</span>
          </span>
        </p>
        <h1 className="mt-6 max-w-[15ch] text-display text-ivory">
          {lines.map((l, i) => (
            <span key={l} className="split-line">
              <span style={{ "--d": `${120 + i * 110}ms` } as React.CSSProperties}>{l}</span>
            </span>
          ))}
        </h1>
        <p className="mt-8 max-w-xl animate-fade-up text-lede text-ivory/85 [animation-delay:420ms]">{copy.sub}</p>
        <div className="mt-10 flex animate-fade-up flex-col gap-4 [animation-delay:540ms] sm:flex-row sm:items-center">
          <PrimaryCta location="hero" variant="light" />
          <ButtonLink
            href="/home-designs"
            variant="outline-light"
            onClick={() => track("primary_cta_click", { location: "hero_secondary", label: "Explore Our Designs" })}
          >
            Explore Our Designs
          </ButtonLink>
        </div>
      </div>

      <a
        href="#introduction"
        className="absolute bottom-8 right-6 hidden flex-col items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-ivory/75 hover:text-ivory md:flex md:right-14"
      >
        <span className="[writing-mode:vertical-rl]">Scroll</span>
        <span className="relative block h-14 w-px bg-ivory/25">
          <span className="scroll-cue absolute inset-0 bg-ivory" />
        </span>
        <span className="sr-only">to the introduction</span>
      </a>
      <span className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-[0.65rem] uppercase tracking-[0.2em] text-ivory/60 lg:block">
        Concept rendering
      </span>
    </section>
  );
}
