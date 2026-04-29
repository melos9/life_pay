import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE = "https://melos9.github.io/life_pay";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const articles = ["how-to-use", "use-cases", "fire-basics"];
  return [
    {
      url: `${BASE}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE}/articles`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...articles.map((slug) => ({
      url: `${BASE}/articles/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
