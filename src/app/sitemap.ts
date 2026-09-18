import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_HOST && process.env.NEXT_PUBLIC_HOST.startsWith("http")
    ? process.env.NEXT_PUBLIC_HOST
    : "https://explorer.ruangbumi.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/citra-satelit`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
