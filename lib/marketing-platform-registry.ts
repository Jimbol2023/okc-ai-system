export type MarketingPlatformId =
  | "website"
  | "google_business_profile"
  | "facebook_business"
  | "instagram_business"
  | "linkedin_company"
  | "pinterest_business"
  | "youtube"
  | "x"
  | "tiktok";

export type MarketingPlatformStatus = "configured" | "partial" | "planned";
export type MarketingPublishingMode = "MANUAL";

export type MarketingPlatformReadiness = {
  id: MarketingPlatformId;
  label: string;
  status: MarketingPlatformStatus;
  profileExists: boolean;
  logoPresent: boolean;
  bioAboutPresent: boolean;
  websitePresent: boolean;
  headerBannerPresent: boolean;
  pinnedFeaturedContentPresent: boolean;
  readinessScore: number;
  readiness: "ready_for_manual_use" | "needs_brand_review" | "planned";
  notes: string[];
  publishingMode: MarketingPublishingMode;
  approvalRequired: "CEO APPROVAL REQUIRED";
  manualPublishing: true;
  futureProviderSupport: boolean;
  providerCalled: false;
  liveExecutionAllowed: false;
  oauthStarted: false;
  published: false;
  scheduled: false;
  scraped: false;
};

export type MarketingPlatformRegistryReport = {
  ok: true;
  platforms: MarketingPlatformReadiness[];
  averageReadinessScore: number;
  weakestPlatforms: MarketingPlatformReadiness[];
  readyPlatformCount: number;
  nextManualAction: string;
  safety: {
    manualPublishingOnly: true;
    ceoApprovalRequired: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    oauthStarted: false;
    publishingBlocked: true;
    scrapingBlocked: true;
    adsBlocked: true;
  };
};

const platformDefinitions: Array<Omit<MarketingPlatformReadiness, "readinessScore" | "readiness" | "providerCalled" | "liveExecutionAllowed" | "oauthStarted" | "published" | "scheduled" | "scraped">> = [
  {
    id: "website",
    label: "Website",
    status: "configured",
    profileExists: true,
    logoPresent: true,
    bioAboutPresent: true,
    websitePresent: true,
    headerBannerPresent: true,
    pinnedFeaturedContentPresent: true,
    notes: ["Public website is the primary owned brand surface."],
    publishingMode: "MANUAL",
    approvalRequired: "CEO APPROVAL REQUIRED",
    manualPublishing: true,
    futureProviderSupport: false,
  },
  {
    id: "google_business_profile",
    label: "Google Business Profile",
    status: "configured",
    profileExists: true,
    logoPresent: true,
    bioAboutPresent: true,
    websitePresent: true,
    headerBannerPresent: false,
    pinnedFeaturedContentPresent: false,
    notes: ["Manual GBP review is required before public updates."],
    publishingMode: "MANUAL",
    approvalRequired: "CEO APPROVAL REQUIRED",
    manualPublishing: true,
    futureProviderSupport: true,
  },
  {
    id: "facebook_business",
    label: "Facebook Business",
    status: "configured",
    profileExists: true,
    logoPresent: true,
    bioAboutPresent: true,
    websitePresent: true,
    headerBannerPresent: true,
    pinnedFeaturedContentPresent: false,
    notes: ["Configured for planning metadata only; no Graph API execution."],
    publishingMode: "MANUAL",
    approvalRequired: "CEO APPROVAL REQUIRED",
    manualPublishing: true,
    futureProviderSupport: true,
  },
  {
    id: "instagram_business",
    label: "Instagram Business",
    status: "configured",
    profileExists: true,
    logoPresent: true,
    bioAboutPresent: true,
    websitePresent: true,
    headerBannerPresent: false,
    pinnedFeaturedContentPresent: true,
    notes: ["Use for manual brand storytelling and short-form campaign assists."],
    publishingMode: "MANUAL",
    approvalRequired: "CEO APPROVAL REQUIRED",
    manualPublishing: true,
    futureProviderSupport: true,
  },
  {
    id: "linkedin_company",
    label: "LinkedIn Company",
    status: "configured",
    profileExists: true,
    logoPresent: true,
    bioAboutPresent: true,
    websitePresent: true,
    headerBannerPresent: true,
    pinnedFeaturedContentPresent: false,
    notes: ["Company page metadata is configured; publishing remains manual."],
    publishingMode: "MANUAL",
    approvalRequired: "CEO APPROVAL REQUIRED",
    manualPublishing: true,
    futureProviderSupport: true,
  },
  {
    id: "pinterest_business",
    label: "Pinterest Business",
    status: "planned",
    profileExists: false,
    logoPresent: false,
    bioAboutPresent: false,
    websitePresent: false,
    headerBannerPresent: false,
    pinnedFeaturedContentPresent: false,
    notes: ["Future visual authority channel for seller education assets."],
    publishingMode: "MANUAL",
    approvalRequired: "CEO APPROVAL REQUIRED",
    manualPublishing: true,
    futureProviderSupport: true,
  },
  {
    id: "youtube",
    label: "YouTube",
    status: "partial",
    profileExists: true,
    logoPresent: true,
    bioAboutPresent: false,
    websitePresent: true,
    headerBannerPresent: false,
    pinnedFeaturedContentPresent: false,
    notes: ["Prioritize educational video metadata and thumbnail consistency."],
    publishingMode: "MANUAL",
    approvalRequired: "CEO APPROVAL REQUIRED",
    manualPublishing: true,
    futureProviderSupport: true,
  },
  {
    id: "x",
    label: "X (@JcapitalPG)",
    status: "configured",
    profileExists: true,
    logoPresent: true,
    bioAboutPresent: true,
    websitePresent: true,
    headerBannerPresent: false,
    pinnedFeaturedContentPresent: false,
    notes: ["Handle is tracked as manual brand metadata; no X API calls."],
    publishingMode: "MANUAL",
    approvalRequired: "CEO APPROVAL REQUIRED",
    manualPublishing: true,
    futureProviderSupport: true,
  },
  {
    id: "tiktok",
    label: "TikTok",
    status: "planned",
    profileExists: false,
    logoPresent: false,
    bioAboutPresent: false,
    websitePresent: false,
    headerBannerPresent: false,
    pinnedFeaturedContentPresent: false,
    notes: ["Future repurposing channel for approved educational short-form content."],
    publishingMode: "MANUAL",
    approvalRequired: "CEO APPROVAL REQUIRED",
    manualPublishing: true,
    futureProviderSupport: true,
  },
];

function scorePlatform(platform: Omit<MarketingPlatformReadiness, "readinessScore" | "readiness" | "providerCalled" | "liveExecutionAllowed" | "oauthStarted" | "published" | "scheduled" | "scraped">) {
  const checks = [
    platform.profileExists,
    platform.logoPresent,
    platform.bioAboutPresent,
    platform.websitePresent,
    platform.headerBannerPresent,
    platform.pinnedFeaturedContentPresent,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function readinessForScore(score: number): MarketingPlatformReadiness["readiness"] {
  if (score >= 80) return "ready_for_manual_use";
  if (score > 0) return "needs_brand_review";

  return "planned";
}

export function createMarketingPlatformRegistryReport(): MarketingPlatformRegistryReport {
  const platforms = platformDefinitions.map((platform) => {
    const readinessScore = scorePlatform(platform);

    return {
      ...platform,
      readinessScore,
      readiness: readinessForScore(readinessScore),
      providerCalled: false as const,
      liveExecutionAllowed: false as const,
      oauthStarted: false as const,
      published: false as const,
      scheduled: false as const,
      scraped: false as const,
    };
  });
  const averageReadinessScore = Math.round(platforms.reduce((total, platform) => total + platform.readinessScore, 0) / platforms.length);
  const weakestPlatforms = [...platforms].sort((a, b) => a.readinessScore - b.readinessScore || a.label.localeCompare(b.label)).slice(0, 3);

  return {
    ok: true,
    platforms,
    averageReadinessScore,
    weakestPlatforms,
    readyPlatformCount: platforms.filter((platform) => platform.readiness === "ready_for_manual_use").length,
    nextManualAction: weakestPlatforms[0]
      ? `Complete manual brand readiness review for ${weakestPlatforms[0].label}.`
      : "Maintain manual platform review cadence before any publishing.",
    safety: {
      manualPublishingOnly: true,
      ceoApprovalRequired: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      oauthStarted: false,
      publishingBlocked: true,
      scrapingBlocked: true,
      adsBlocked: true,
    },
  };
}
