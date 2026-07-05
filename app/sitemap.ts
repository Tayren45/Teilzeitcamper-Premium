import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/content";

const BASE = "https://www.teilzeitcamper.ch";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "", "/fahrzeuge", "/fahrzeuge/carado-t447", "/buchung", "/preise",
    "/versicherungen", "/faq", "/ueber-uns", "/blog", "/trip-clips", "/kontakt",
  ].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : p === "/buchung" ? 0.9 : 0.7,
  }));

  const posts = blogPosts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...posts];
}
