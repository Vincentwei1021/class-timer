import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://timer.toolboxlite.com",
      lastModified: new Date("2026-04-07"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://timer.toolboxlite.com/privacy",
      lastModified: new Date("2026-04-07"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://timer.toolboxlite.com/terms",
      lastModified: new Date("2026-04-07"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
