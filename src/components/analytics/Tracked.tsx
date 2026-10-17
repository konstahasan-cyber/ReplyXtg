"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track, type AnalyticsEvent, type EventParams } from "@/lib/analytics";
import { company } from "@/config/site";

/** Link that fires an analytics event on click. */
export function TrackedLink({
  event,
  params,
  onClick,
  ...props
}: ComponentProps<typeof Link> & { event: AnalyticsEvent; params?: EventParams }) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        track(event, params);
        onClick?.(e);
      }}
    />
  );
}

export function PhoneLink({ className = "", location, children }: { className?: string; location: string; children?: React.ReactNode }) {
  return (
    <a href={company.phone.href} className={className} onClick={() => track("phone_click", { location })}>
      {children ?? company.phone.display}
    </a>
  );
}

export function EmailLink({ className = "", location, children }: { className?: string; location: string; children?: React.ReactNode }) {
  return (
    <a href={`mailto:${company.email}`} className={className} onClick={() => track("email_click", { location })}>
      {children ?? company.email}
    </a>
  );
}
