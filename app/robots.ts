import type { MetadataRoute } from "next";

import { publicSiteUrl } from "@/lib/public-seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/login", "/api"]
    },
    sitemap: `${publicSiteUrl}/sitemap.xml`,
    host: publicSiteUrl
  };
}
