"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { PrimaryCta } from "@/components/analytics/Experiments";
import { PhoneLink } from "@/components/analytics/Tracked";
import { company, primaryNav } from "@/config/site";

/** Routes without a dark full-bleed hero use the solid header from the start. */
const SOLID_ROUTES = ["/privacy", "/terms", "/planner", "/contact"];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);

  const solidRoute = SOLID_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  const solid = solidRoute || scrolled || menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation (state adjustment during render, no effect needed).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setServicesOpen(false);
  }

  useEffect(() => {
    if (!servicesOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setServicesOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));
  const tone = solid ? "dark" : "light";

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,color] duration-500 ${
        solid ? "bg-ivory/92 text-charcoal shadow-[0_1px_0_var(--color-line)] backdrop-blur-md" : "on-dark bg-transparent text-ivory"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-forest focus:px-4 focus:py-2 focus:text-ivory"
      >
        Skip to content
      </a>
      <div className="container-x flex h-20 items-center justify-between gap-6">
        <Link href="/" aria-label={`${company.name} — home`} className="shrink-0">
          <Logo tone={tone} />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.8rem] font-semibold uppercase tracking-[0.12em]">
            {primaryNav.map((item) =>
              item.children ? (
                <li key={item.label} ref={servicesRef} className="relative" onMouseLeave={() => setServicesOpen(false)}>
                  <button
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-controls="services-menu"
                    onClick={() => setServicesOpen((v) => !v)}
                    onMouseEnter={() => setServicesOpen(true)}
                    className={`flex items-center gap-1.5 py-3 ${isActive("/custom-home-building") || isActive("/design-build") ? "opacity-100" : "opacity-85 hover:opacity-100"}`}
                  >
                    {item.label}
                    <svg viewBox="0 0 10 6" className={`h-1.5 w-2.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} aria-hidden="true">
                      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  </button>
                  <div
                    id="services-menu"
                    hidden={!servicesOpen}
                    className="absolute left-1/2 top-full w-[22rem] -translate-x-1/2 pt-2"
                  >
                    <ul className="bg-ivory p-3 normal-case tracking-normal text-charcoal shadow-[0_24px_60px_-20px_rgb(32_39_36/0.35)] ring-1 ring-line">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block px-4 py-3.5 transition-colors hover:bg-sand/60 focus-visible:bg-sand/60">
                            <span className="block font-serif text-xl font-medium">{c.label}</span>
                            <span className="mt-0.5 block text-[0.83rem] font-normal leading-snug text-stone">{c.description}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`link-underline py-1 ${isActive(item.href) ? "bg-[length:100%_1px]" : "opacity-85 hover:opacity-100"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <PhoneLink location="header" className="text-[0.85rem] font-semibold tracking-wide opacity-90 hover:opacity-100" />
          <PrimaryCta location="header" variant={solid ? "primary" : "light"} arrow={false} className="min-h-11 px-5" />
        </div>

        <button
          type="button"
          className="relative -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`absolute h-px w-6 bg-current transition-transform duration-300 ${menuOpen ? "rotate-45" : "-translate-y-1.5"}`} />
          <span className={`absolute h-px w-6 bg-current transition-transform duration-300 ${menuOpen ? "-rotate-45" : "translate-y-1.5"}`} />
        </button>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} isActive={isActive} />
    </header>
  );
}

function MobileMenu({ open, onClose, isActive }: { open: boolean; onClose: () => void; isActive: (h: string) => boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !ref.current) return;
      const els = ref.current.querySelectorAll<HTMLElement>("a,button");
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    ref.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onKeyDown]);

  const links = [
    ...primaryNav.flatMap((i) => (i.children ? i.children : [i])),
    { label: "Contact", href: "/contact" },
  ].filter((l, i, arr) => arr.findIndex((x) => x.href === l.href) === i);

  return (
    <div
      id="mobile-menu"
      ref={ref}
      hidden={!open}
      className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-5rem)] overflow-y-auto border-t border-line bg-ivory text-charcoal lg:hidden"
    >
      <nav aria-label="Mobile" className="container-x flex min-h-full flex-col py-8">
        <ul className="divide-y divide-line border-y border-line">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className="flex items-center justify-between py-4 font-serif text-[1.9rem] leading-tight"
                onClick={onClose}
              >
                {l.label}
                <span aria-hidden="true" className="text-base text-clay">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto space-y-4 pt-10">
          <PrimaryCta location="mobile_menu" className="w-full" />
          <PhoneLink location="mobile_menu" className="flex min-h-12 w-full items-center justify-center border border-forest/30 text-sm font-semibold tracking-wide text-forest">
            Call {company.phone.display}
          </PhoneLink>
          <p className="text-center text-xs text-stone">{company.demoNotice}</p>
        </div>
      </nav>
    </div>
  );
}
