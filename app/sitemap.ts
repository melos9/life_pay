import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { GUIDES } from "@/lib/guides";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const guideEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/guide`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...GUIDES.map((g) => ({
      url: `${SITE_URL}/guide/${g.slug}`,
      lastModified: new Date(g.updated),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...guideEntries,
    {
      url: `${SITE_URL}/how-to-use`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/disclaimer`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
