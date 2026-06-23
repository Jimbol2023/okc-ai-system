import type { MetadataRoute } from "next";

import { publicSiteUrl } from "@/lib/public-seo";

const publicRoutes = [
  "/",
  "/sell-your-house",
  "/about",
  "/contact",
  "/thank-you",
  "/faq",
  "/resources",
  "/resources/education",
  "/resources/education/probate-basics-oklahoma-property-owners",
  "/resources/education/deferred-maintenance-oklahoma",
  "/resources/education/property-ownership-change-considerations",
  "/resources/education/family-property-discussions",
  "/resources/videos",
  "/resources/videos/inherited-property",
  "/resources/videos/vacant-property",
  "/resources/videos/relocation-property",
  "/resources/videos/landlord-property",
  "/resources/property-insights",
  "/resources/inherited-property-oklahoma",
  "/resources/sell-inherited-house-oklahoma-city",
  "/resources/vacant-property-oklahoma",
  "/resources/sell-vacant-house-okc",
  "/resources/landlord-property-decisions-oklahoma",
  "/resources/shared-inherited-property-oklahoma",
  "/resources/relocation-property-decisions-oklahoma",
  "/resources/selling-house-during-probate-oklahoma",
  "/resources/out-of-state-owner-selling-oklahoma-property",
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
