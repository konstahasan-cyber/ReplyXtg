import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { EmailLink, PhoneLink } from "@/components/analytics/Tracked";
import { serviceAreas } from "@/config/areas";
import { company, footerNav } from "@/config/site";

export function Footer() {
  return (
    <footer className="on-dark bg-charcoal pb-28 text-ivory md:pb-0">
      <div className="container-x grid gap-14 pb-14 pt-20 lg:grid-cols-12 lg:gap-10 lg:pt-24">
        <div className="lg:col-span-4">
          <Link href="/" aria-label={`${company.name} — home`}>
            <Logo tone="light" />
          </Link>
          <p className="mt-6 max-w-sm font-serif text-2xl leading-snug text-ivory/90">{company.promise}</p>
          <dl className="mt-8 space-y-3 text-sm">
            <div>
              <dt className="sr-only">Phone</dt>
              <dd>
                <PhoneLink location="footer" className="link-underline text-ivory/85 hover:text-ivory" />
              </dd>
            </div>
            <div>
              <dt className="sr-only">Email</dt>
              <dd>
                <EmailLink location="footer" className="link-underline text-ivory/85 hover:text-ivory" />
              </dd>
            </div>
            <div>
              <dt className="sr-only">Location</dt>
              <dd className="text-ivory/70">
                {company.city}, {company.region} · Serving the greater Sacramento region
              </dd>
            </div>
          </dl>
        </div>

        <FooterCol title="Explore" links={footerNav.explore} className="lg:col-span-2" />
        <FooterCol title="Services" links={footerNav.services} className="lg:col-span-2" />

        <div className="lg:col-span-4">
          <h2 className="eyebrow text-clay-light">Service areas</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-ivory/75">
            {serviceAreas.map((a) => (
              <li key={a.name}>
                {a.slug ? (
                  <Link href={`/service-areas/${a.slug}`} className="link-underline hover:text-ivory">
                    {a.name}
                  </Link>
                ) : (
                  a.name
                )}
              </li>
            ))}
          </ul>
          <Link href="/service-areas" className="link-underline mt-5 inline-block text-sm font-semibold text-ivory">
            All service areas →
          </Link>
        </div>
      </div>

      <div className="container-x">
        <div id="demo-notice" className="border border-ivory/15 p-5 text-sm leading-relaxed text-ivory/75 md:flex md:items-start md:gap-6">
          <p className="eyebrow shrink-0 text-clay-light md:pt-0.5">Demo notice</p>
          <p className="mt-2 md:mt-0">
            This is a concept website for a <strong className="font-semibold text-ivory">fictional company</strong>, created to
            demonstrate premium web design and conversion strategy. Projects shown are concept designs with original renderings,
            not completed homes. The phone number uses a reserved example range, the domain is a reserved test domain, and form
            submissions are stored only in your browser.
          </p>
        </div>
      </div>

      <div className="container-x flex flex-col gap-4 py-8 text-xs text-ivory/60 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {company.name} (fictional). {company.license.label}:{" "}
          <span className="font-mono text-ivory/80">{company.license.value}</span> — demo placeholder, not a valid license.
        </p>
        <ul className="flex gap-6">
          {footerNav.legal.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="link-underline hover:text-ivory">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

function FooterCol({ title, links, className }: { title: string; links: { label: string; href: string }[]; className?: string }) {
  return (
    <nav aria-label={title} className={className}>
      <h2 className="eyebrow text-clay-light">{title}</h2>
      <ul className="mt-5 space-y-2.5 text-sm text-ivory/75">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="link-underline hover:text-ivory">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
