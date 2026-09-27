import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The Studio and draft-mode routes are tooling, not public content.
        disallow: ["/studio", "/api/draft-mode"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
