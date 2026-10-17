"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PhoneLink } from "@/components/analytics/Tracked";
import { PrimaryCta } from "@/components/analytics/Experiments";

const HIDDEN_ON = ["/planner", "/contact"];

/** Compact bottom CTA on small screens; appears after the hero, hides near the footer. */
export function MobileCtaBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY > document.body.scrollHeight - 520;
      setVisible(window.scrollY > window.innerHeight * 0.7 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (HIDDEN_ON.some((r) => pathname.startsWith(r))) return null;

  return (
    <div
      data-mobile-cta
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ivory/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-500 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex gap-2">
        <PhoneLink
          location="mobile_bar"
          className="flex min-h-12 items-center justify-center gap-2 border border-forest/30 px-4 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-forest"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
              d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          Call
        </PhoneLink>
        <PrimaryCta location="mobile_bar" className="min-h-12 flex-1 px-4" arrow={false} />
      </div>
    </div>
  );
}
