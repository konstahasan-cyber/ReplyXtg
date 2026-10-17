import { company } from "@/config/site";

/**
 * Aurelia Grove mark: a single architectural line drawing an asymmetric
 * California roofline, with a leaf rising from the threshold — its midrib
 * continuing the vertical axis of the home. Uses currentColor, so it works on
 * light and dark backgrounds; the leaf takes the terracotta accent.
 */
export function LogoMark({ className = "h-9 w-9", accent = true }: { className?: string; accent?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <path
        d="M6.5 42.5V21.2L27.4 7.5 41.5 16.6V42.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path d="M3.5 42.5h41" stroke="currentColor" strokeWidth="1.9" strokeLinecap="square" />
      <path
        d="M24 42.5c-7.6-3.9-9.4-12.3-1.2-21.6 7.4 7.6 7.6 16.6 1.2 21.6Z"
        fill={accent ? "var(--color-terracotta)" : "currentColor"}
      />
      <path d="M24 42.5c-.4-6.3-.2-12.4-1.2-21.6" fill="none" stroke="var(--color-ivory)" strokeWidth="1.1" strokeLinecap="round" opacity={accent ? 0.9 : 0.6} />
    </svg>
  );
}

export function Logo({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const color = tone === "light" ? "text-ivory" : "text-forest";
  return (
    <span className={`inline-flex items-center gap-3 ${color} ${className}`}>
      <LogoMark />
      <span className="flex flex-col leading-none" aria-hidden="true">
        <span className="font-serif text-[1.45rem] font-medium tracking-[0.06em]">AURELIA GROVE</span>
        <span className={`mt-1 text-[0.58rem] font-semibold tracking-[0.42em] ${tone === "light" ? "text-ivory/70" : "text-stone"}`}>
          CUSTOM HOMES
        </span>
      </span>
      <span className="sr-only">{company.name}, home</span>
    </span>
  );
}
