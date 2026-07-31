import { publicSiteUrl } from "@/lib/public-seo";

export type SearchConsoleReadinessPacket = {
  schemaVersion: "search-console-readiness-v1";
  siteUrl: string;
  sitemapUrl: string;
  robotsUrl: string;
  targetUrls: string[];
  manualActivationSteps: string[];
  baselineEvidenceFields: string[];
  safety: {
    providerCalled: false;
    externalWritesAllowed: false;
    sitemapSubmissionAutomated: false;
    indexingRequestAutomated: false;
    bingSubmissionAutomated: false;
  };
};

const priorityPaths = [
  "/resources/shared-inherited-property-oklahoma",
  "/edmond",
  "/midwest-city",
  "/moore",
] as const;

export function getSearchConsoleReadinessPacket(): SearchConsoleReadinessPacket {
  const sitemapUrl = `${publicSiteUrl}/sitemap.xml`;

  return {
    schemaVersion: "search-console-readiness-v1",
    siteUrl: publicSiteUrl,
    sitemapUrl,
    robotsUrl: `${publicSiteUrl}/robots.txt`,
    targetUrls: priorityPaths.map((path) => `${publicSiteUrl}${path}`),
    manualActivationSteps: [
      "Verify the jcapitalpropertygroup.com property in Google Search Console.",
      `Submit ${sitemapUrl} in Google Search Console.`,
      `Submit ${sitemapUrl} in Bing Webmaster Tools.`,
      "Request indexing for the priority public URLs listed in this packet.",
      "Record the first baseline for indexed pages, discovered sitemap URLs, coverage warnings, mobile usability, and structured-data warnings."
    ],
    baselineEvidenceFields: [
      "indexed pages",
      "sitemap discovered pages",
      "coverage warnings",
      "mobile usability issues",
      "rich results or schema warnings",
      "manual submission date",
      "review owner"
    ],
    safety: {
      providerCalled: false,
      externalWritesAllowed: false,
      sitemapSubmissionAutomated: false,
      indexingRequestAutomated: false,
      bingSubmissionAutomated: false
    }
  };
}
