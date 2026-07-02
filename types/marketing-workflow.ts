export const marketingChannels = ["facebook", "instagram", "google_business_profile", "linkedin"] as const;

export type MarketingChannel = (typeof marketingChannels)[number];

export const marketingChannelLabels: Record<MarketingChannel, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  google_business_profile: "Google Business Profile",
  linkedin: "LinkedIn",
};

export const marketingDraftStatuses = [
  "draft",
  "pending_approval",
  "approved",
  "rejected",
  "ready_for_manual_publish",
  "manually_published",
] as const;

export type MarketingDraftStatus = (typeof marketingDraftStatuses)[number];

export const marketingApprovalDecisions = ["approve", "reject", "edit"] as const;

export type MarketingApprovalDecision = (typeof marketingApprovalDecisions)[number];

export const marketingConnectionStatuses = ["manual_setup", "verified", "needs_review"] as const;

export type MarketingConnectionStatus = (typeof marketingConnectionStatuses)[number];

export const marketingCanvaAssetApprovalStatuses = [
  "pending_manual_asset_approval",
  "approved_for_manual_canva_use",
  "rejected",
] as const;

export type MarketingCanvaAssetApprovalStatus = (typeof marketingCanvaAssetApprovalStatuses)[number];

export type MarketingSafetyFlags = {
  noOAuth: true;
  noLiveApis: true;
  noExternalFetchCalls: true;
  noProviderCalls: true;
  noCanvaApiCalls: true;
  noCanvaExports: true;
  noAutomaticDesignCreation: true;
  noPosting: true;
  noScheduling: true;
  noMessaging: true;
  noScraping: true;
  noLeadCreation: true;
  noCrmMutation: true;
  noAds: true;
  noPhase2EPublishing: true;
};
