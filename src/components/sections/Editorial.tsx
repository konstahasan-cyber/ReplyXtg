import Image from "next/image";
import type { ReactNode } from "react";

/** Asymmetric image + text block used across interior pages. */
export function EditorialSplit({
  image,
  alt,
  eyebrow,
  title,
  children,
  reverse = false,
  id,
  tone = "light",
}: {
  image: string;
  alt: string;
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
  reverse?: boolean;
  id?: string;
  tone?: "light" | "sand";
}) {
  return (
    <section id={id} className={`section-y ${tone === "sand" ? "bg-sand/55" : "bg-ivory"}`}>
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div data-reveal="image" className={`relative aspect-[4/5] overflow-hidden bg-sand sm:aspect-[5/4] lg:col-span-6 ${reverse ? "lg:order-2 lg:col-start-7" : ""}`}>
          <Image src={image} alt={alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className={`lg:col-span-5 ${reverse ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"}`}>
          <p data-reveal className="eyebrow text-clay">
            {eyebrow}
          </p>
          <h2 data-reveal className="mt-5 text-h2 text-forest">
            {title}
          </h2>
          <div data-reveal className="mt-7 space-y-5 text-lede text-stone">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CheckList({ items, tone = "dark" }: { items: string[]; tone?: "dark" | "light" }) {
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i} className={`flex gap-3 text-base leading-relaxed ${tone === "light" ? "text-ivory/85" : "text-charcoal"}`}>
          <svg viewBox="0 0 16 16" className={`mt-1 h-4 w-4 shrink-0 ${tone === "light" ? "text-clay-light" : "text-clay"}`} aria-hidden="true">
            <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          {i}
        </li>
      ))}
    </ul>
  );
}
