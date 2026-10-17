import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { AnalyticsRoot } from "@/components/analytics/AnalyticsRoot";
import { ExperimentProvider } from "@/components/analytics/Experiments";
import { DemoBar } from "@/components/layout/DemoBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { RevealObserver } from "@/components/ui/Reveal";
import { JsonLd, organizationJsonLd } from "@/components/seo/JsonLd";
import { company, siteUrl } from "@/config/site";
import { getVariants } from "@/lib/experiments";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Custom Home Builder in Sacramento, CA | ${company.name}`,
    template: `%s | ${company.shortName}`,
  },
  description:
    "Design-led custom homes for Sacramento, Folsom, Elk Grove and nearby communities. Plan your home with a transparent process from first idea to final walkthrough. Concept website.",
  applicationName: company.name,
  openGraph: {
    type: "website",
    siteName: company.name,
    locale: "en_US",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "Concept rendering of a California contemporary home at golden hour" }],
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
  // A concept site for a fictional company should not be indexed in production.
  robots: process.env.NEXT_PUBLIC_DEMO_MODE !== "false" ? { index: false, follow: true } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#25382F",
  colorScheme: "light",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const variants = await getVariants();
  return (
    <html lang="en-US" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Opt into reveal animations before first paint (content stays visible without JS). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <ExperimentProvider variants={variants}>
          <DemoBar />
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <MobileCtaBar />
          <AnalyticsRoot />
          <RevealObserver />
        </ExperimentProvider>
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
