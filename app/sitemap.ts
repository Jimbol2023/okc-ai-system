import type { MetadataRoute } from "next";

import { publicSiteUrl } from "@/lib/public-seo";

const publicRoutes = [
  "/",
  "/sell-your-house",
  "/about",
  "/contact",
  "/faq",
  "/resources",
  "/resources/inherited-property-oklahoma",
  "/resources/vacant-property-oklahoma",
  "/resources/landlord-property-decisions-oklahoma",
  "/resources/shared-inherited-property-oklahoma",
  "/resources/relocation-property-decisions-oklahoma",
  "/oklahoma-city",
  "/yukon",
  "/moore",
  "/norman",
  "/edmond",
  "/midwest-city",
  "/privacy",
  "/accessibility"
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: route === "/" ? `${publicSiteUrl}/` : `${publicSiteUrl}${route}`,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8
  }));
}
