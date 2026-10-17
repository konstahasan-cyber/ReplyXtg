import type { MetadataRoute } from "next";
import { cityPages } from "@/config/areas";
import { projects } from "@/config/projects";
import { siteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: [string, number][] = [
    ["/", 1],
    ["/custom-home-building", 0.9],
    ["/design-build", 0.9],
    ["/home-designs", 0.8],
    ["/process", 0.8],
    ["/service-areas", 0.8],
    ["/planner", 0.8],
    ["/contact", 0.8],
    ["/about", 0.6],
    ["/privacy", 0.2],
    ["/terms", 0.2],
    ...projects.map((p) => [`/home-designs/${p.slug}`, 0.7] as [string, number]),
    ...cityPages.map((c) => [`/service-areas/${c.slug}`, 0.8] as [string, number]),
  ];
  return routes.map(([path, priority]) => ({ url: `${siteUrl}${path}`, lastModified: now, changeFrequency: "monthly", priority }));
}
