import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_HOST && process.env.NEXT_PUBLIC_HOST.startsWith("http")
    ? process.env.NEXT_PUBLIC_HOST
    : "https://explorer.ruangbumi.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
