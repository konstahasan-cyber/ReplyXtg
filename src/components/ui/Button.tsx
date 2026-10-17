import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "light" | "outline" | "outline-light" | "text" | "text-light";

const styles: Record<Variant, string> = {
  primary: "bg-forest text-ivory hover:bg-forest-deep",
  light: "bg-ivory text-forest hover:bg-white",
  outline: "border border-forest/40 text-forest hover:border-forest hover:bg-forest hover:text-ivory",
  "outline-light": "border border-ivory/50 text-ivory hover:border-ivory hover:bg-ivory hover:text-forest",
  text: "px-0! text-forest",
  "text-light": "px-0! text-ivory",
};

const base =
  "group inline-flex min-h-12 items-center justify-center gap-3 px-7 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] transition-[background-color,color,border-color] duration-300 disabled:cursor-not-allowed disabled:opacity-60";

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 12"
      className={`h-3 w-6 shrink-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5 ${className}`}
      aria-hidden="true"
    >
      <path d="M0 6h22M17 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

type Common = { variant?: Variant; arrow?: boolean; children: ReactNode; className?: string };

export function ButtonLink({
  variant = "primary",
  arrow = true,
  className = "",
  children,
  ...props
}: Common & ComponentProps<typeof Link>) {
  const isText = variant.startsWith("text");
  return (
    <Link className={`${base} ${styles[variant]} ${className}`} {...props}>
      <span className={isText ? "link-underline pb-0.5" : undefined}>{children}</span>
      {arrow && <Arrow />}
    </Link>
  );
}

export function Button({
  variant = "primary",
  arrow = false,
  className = "",
  children,
  ...props
}: Common & ComponentProps<"button">) {
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </button>
  );
}
