"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { isDemo } from "@/config/site";
import { track } from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";
import { CONSENT_EVENT, getConsent, setConsent, type ConsentState } from "@/lib/consent";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

/**
 * Captures attribution, emits page_view on every route change and loads
 * GA4 / Google Ads tags only after consent and never in demo mode.
 */
export function AnalyticsRoot() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);
  const consent = useSyncExternalStore(subscribeConsent, getConsent, () => "unset" as ConsentState);

  useEffect(() => {
    captureAttribution();
  }, []);

  useEffect(() => {
    if (last.current === pathname) return;
    last.current = pathname;
    track("page_view", { title: document.title });
  }, [pathname]);

  const tagId = GA4_ID || ADS_ID;
  const loadTags = !isDemo && consent === "granted" && !!tagId;

  return (
    <>
      {loadTags && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${tagId}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());${
              GA4_ID ? `gtag('config','${GA4_ID}',{send_page_view:false});` : ""
            }${ADS_ID ? `gtag('config','${ADS_ID}');` : ""}`}
          </Script>
        </>
      )}
      <ConsentBar consent={consent} />
    </>
  );
}

function subscribeConsent(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_EVENT, onChange);
}

function ConsentBar({ consent }: { consent: ConsentState }) {
  // Nothing to consent to while no third-party analytics are configured.
  if (consent !== "unset" || isDemo || !(GA4_ID || ADS_ID)) return null;
  return (
    <div
      role="region"
      aria-label="Privacy choices"
      className="fixed inset-x-3 bottom-20 z-50 mx-auto max-w-xl bg-charcoal p-5 text-sm text-ivory shadow-2xl md:bottom-6"
    >
      <p className="leading-relaxed text-ivory/85">
        We&apos;d like to use analytics cookies to understand how this site is used. You can change your choice any time.{" "}
        <a href="/privacy#analytics" className="underline">
          Privacy Policy
        </a>
      </p>
      <div className="mt-4 flex gap-3">
        <button onClick={() => setConsent("granted")} className="bg-ivory px-4 py-2 font-semibold text-forest">
          Allow analytics
        </button>
        <button onClick={() => setConsent("denied")} className="border border-ivory/40 px-4 py-2 font-semibold">
          Decline
        </button>
      </div>
    </div>
  );
}
