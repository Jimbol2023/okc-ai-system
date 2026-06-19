import type { MetadataRoute } from "next";

import { publicSiteUrl } from "@/lib/public-seo";

const publicRoutes = ["/", "/sell-your-house", "/about", "/contact", "/privacy", "/accessibility"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: route === "/" ? `${publicSiteUrl}/` : `${publicSiteUrl}${route}`,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8
  }));
}
