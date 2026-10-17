import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  tone = "dark",
  as: Tag = "h2",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  as?: "h1" | "h2";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && (
        <p data-reveal className={`eyebrow ${light ? "text-clay-light" : "text-clay"}`}>
          {eyebrow}
        </p>
      )}
      <Tag data-reveal style={{ "--reveal-delay": "80ms" } as React.CSSProperties} className={`mt-5 text-h2 ${light ? "text-ivory" : "text-forest"}`}>
        {title}
      </Tag>
      {lede && (
        <p
          data-reveal
          style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
          className={`mt-6 text-lede ${light ? "text-ivory/80" : "text-stone"} ${align === "center" ? "mx-auto" : ""} max-w-2xl`}
        >
          {lede}
        </p>
      )}
    </div>
  );
}

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className={`flex flex-wrap items-center gap-2 text-xs font-medium tracking-[0.12em] uppercase ${tone === "light" ? "text-ivory/70" : "text-stone"}`}>
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === all.length - 1 ? (
                <span aria-current="page" className={tone === "light" ? "text-ivory" : "text-charcoal"}>
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="link-underline hover:opacity-100">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}

/** Full-bleed dark image hero for interior pages (sits under the transparent header). */
export function PageHero({
  image,
  alt,
  eyebrow,
  title,
  lede,
  crumbs,
  children,
  label,
  size = "lg",
}: {
  image: string;
  alt: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  crumbs: Crumb[];
  children?: ReactNode;
  label?: string;
  size?: "md" | "lg";
}) {
  return (
    <section className={`on-dark relative -mt-20 flex ${size === "lg" ? "min-h-[88svh]" : "min-h-[70svh]"} items-end overflow-hidden bg-forest text-ivory`}>
      <Image src={image} alt={alt} fill priority sizes="100vw" quality={80} className="hero-zoom object-cover" />
      <div className="scrim-hero absolute inset-0" aria-hidden="true" />
      <div className="container-x relative pb-16 pt-40 md:pb-20">
        <Breadcrumbs items={crumbs} />
        <p className="eyebrow mt-10 text-clay-light">
          <span className="split-line">
            <span>{eyebrow}</span>
          </span>
        </p>
        <h1 className="mt-5 max-w-4xl text-h1 text-ivory">
          <span className="split-line">
            <span style={{ "--d": "120ms" } as React.CSSProperties}>{title}</span>
          </span>
        </h1>
        {lede && (
          <p className="mt-6 max-w-2xl animate-fade-up text-lede text-ivory/85 [animation-delay:300ms]">{lede}</p>
        )}
        {children && <div className="mt-9 flex animate-fade-up flex-wrap gap-4 [animation-delay:420ms]">{children}</div>}
      </div>
      {label && <ConceptLabel className="absolute right-4 top-28 md:right-8">{label}</ConceptLabel>}
    </section>
  );
}

export function ConceptLabel({ children = "Concept Design", className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 bg-charcoal/70 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ivory backdrop-blur-sm ${className}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-terracotta" />
      {children}
    </span>
  );
}
