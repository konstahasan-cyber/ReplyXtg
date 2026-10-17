import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // The concept site is fully crawlable for review; pages carry `noindex` while in demo mode.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
