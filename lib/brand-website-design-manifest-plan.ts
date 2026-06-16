import { brandConfig } from "./brand-config";
import {
  assertBrandAssetReplacementReadinessGateSafe,
  getBrandAssetReplacementReadinessGate,
  summarizeBrandAssetReplacementReadinessGate,
} from "./brand-asset-replacement-readiness-gate";

export const brandWebsiteDesignManifestPlanFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  humanReviewOnly: true,
  designImplementationEnabled: false,
  imageLogoReplacementEnabled: false,
  cssThemeChangeEnabled: false,
  uiEditEnabled: false,
  canvaApiActivationEnabled: false,
  publishingEnabled: false,
  trackingEnabled: false,
  providerActivationEnabled: false,
  crmWriteEnabled: false,
  storageWriteEnabled: false,
  outreachEnabled: false,
  spendEnabled: false,
  goLiveAuthorized: false,
  directImplementationEnabled: false,
} as const;

export type BrandWebsiteDesignManifestSignals = Partial<{
  primaryLogoReviewed: boolean;
  alternateLogoReviewed: boolean;
  faviconReviewed: boolean;
  socialProfileImageReviewed: boolean;
  emailSignatureLogoReviewed: boolean;
  canvaBrandKitExportsReviewed: boolean;
  sellerTrustGraphicsReviewed: boolean;
  homepageHeroAssetReviewed: boolean;
  sellYourHousePageVisualReviewed: boolean;
  contactPageVisualTreatmentReviewed: boolean;
  footerBrandPresentationReviewed: boolean;
  navbarLogoPlacementReviewed: boolean;
  mobileFirstLayoutReviewed: boolean;
  ctaVisualConsistencyReviewed: boolean;
  sellerTrustSectionDesignReviewed: boolean;
  accessibilityReadabilityReviewed: boolean;
  socialMediaTemplatesReviewed: boolean;
  adCreativeTemplatesReviewed: boolean;
  buyerSellerPdfOnePagerTemplatesReviewed: boolean;
  emailSignatureDesignReviewed: boolean;
  brandColorPaletteReviewed: boolean;
  typographyReviewed: boolean;
  iconIllustrationStyleReviewed: boolean;
  brandOwnerApproved: boolean;
  legalIdentityVerified: boolean;
  finalVisualApproval: boolean;
  accessibilityApproved: boolean;
  implementationScopeApproved: boolean;
}>;

export type BrandWebsiteDesignManifestStatus =
  | "manifest_blocked"
  | "manifest_needs_human_review"
  | "manifest_ready_for_future_design_scope";

export type BrandWebsiteDesignManifestPlan = {
  brandIdentity: {
    displayName: typeof brandConfig.companyDisplayName;
    legalName: typeof brandConfig.companyLegalName;
    domain: typeof brandConfig.domain;
    email: typeof brandConfig.primaryEmail;
    logoAlt: typeof brandConfig.logoAlt;
  };
  readinessGateSummary: string;
  manifestStatus: BrandWebsiteDesignManifestStatus;
  completedSignals: Required<BrandWebsiteDesignManifestSignals>;
  missingManifestAreas: string[];
  missingApprovalGates: string[];
  manifestAreas: typeof manifestAreas;
  allowedUse: ["read-only planning visibility for human review only"];
  blockedUse: typeof blockedUse;
  recommendedNextAction: (typeof recommendedNextActionByStatus)[BrandWebsiteDesignManifestStatus];
  flags: typeof brandWebsiteDesignManifestPlanFlags;
};

const brandAssetSignalLabels: Array<[keyof BrandWebsiteDesignManifestSignals, string]> = [
  ["primaryLogoReviewed", "primary logo"],
  ["alternateLogoReviewed", "alternate logo"],
  ["faviconReviewed", "favicon"],
  ["socialProfileImageReviewed", "social profile image"],
  ["emailSignatureLogoReviewed", "email signature logo"],
  ["canvaBrandKitExportsReviewed", "Canva Brand Kit exports"],
  ["sellerTrustGraphicsReviewed", "seller trust graphics"],
];

const websiteDesignSignalLabels: Array<[keyof BrandWebsiteDesignManifestSignals, string]> = [
  ["homepageHeroAssetReviewed", "homepage hero asset"],
  ["sellYourHousePageVisualReviewed", "sell-your-house page hero/visual"],
  ["contactPageVisualTreatmentReviewed", "contact page visual treatment"],
  ["footerBrandPresentationReviewed", "footer brand presentation"],
  ["navbarLogoPlacementReviewed", "navbar logo placement"],
  ["mobileFirstLayoutReviewed", "mobile-first layout review"],
  ["ctaVisualConsistencyReviewed", "CTA visual consistency"],
  ["sellerTrustSectionDesignReviewed", "seller trust section design"],
  ["accessibilityReadabilityReviewed", "accessibility/readability review"],
];

const otherDesignSignalLabels: Array<[keyof BrandWebsiteDesignManifestSignals, string]> = [
  ["socialMediaTemplatesReviewed", "social media templates"],
  ["adCreativeTemplatesReviewed", "ad creative templates"],
  ["buyerSellerPdfOnePagerTemplatesReviewed", "buyer/seller PDF one-pager templates"],
  ["emailSignatureDesignReviewed", "email signature design"],
  ["brandColorPaletteReviewed", "brand color/palette review"],
  ["typographyReviewed", "typography review"],
  ["iconIllustrationStyleReviewed", "icon/illustration style review"],
];

const manifestSignalLabels = [
  ...brandAssetSignalLabels,
  ...websiteDesignSignalLabels,
  ...otherDesignSignalLabels,
];

const approvalSignalLabels: Array<[keyof BrandWebsiteDesignManifestSignals, string]> = [
  ["brandOwnerApproved", "brand owner approval"],
  ["legalIdentityVerified", "legal identity verification"],
  ["finalVisualApproval", "final visual approval"],
  ["accessibilityApproved", "accessibility approval"],
  ["implementationScopeApproved", "implementation scope approval"],
];

const manifestAreas = {
  brandAssets: brandAssetSignalLabels.map(([, label]) => label),
  websiteDesign: websiteDesignSignalLabels.map(([, label]) => label),
  otherDesign: otherDesignSignalLabels.map(([, label]) => label),
} as const;

const blockedUse = [
  "no design implementation",
  "no image/logo replacement",
  "no CSS/theme changes",
  "no UI edits",
  "no Canva/API activation",
  "no publishing",
  "no tracking",
  "no provider activation",
  "no CRM/storage writes",
  "no outreach",
  "no spend",
  "no go-live",
] as const;

const recommendedNextActionByStatus = {
  manifest_blocked: "Complete all required brand and website design manifest areas before requesting human design approval.",
  manifest_needs_human_review: "Complete missing human approval gates before creating any design implementation scope.",
  manifest_ready_for_future_design_scope:
    "Create a separate human-approved design implementation scope before changing any brand, website, Canva, or public-facing design assets.",
} as const;

function normalizeSignals(signals: BrandWebsiteDesignManifestSignals = {}): Required<BrandWebsiteDesignManifestSignals> {
  return {
    primaryLogoReviewed: signals.primaryLogoReviewed === true,
    alternateLogoReviewed: signals.alternateLogoReviewed === true,
    faviconReviewed: signals.faviconReviewed === true,
    socialProfileImageReviewed: signals.socialProfileImageReviewed === true,
    emailSignatureLogoReviewed: signals.emailSignatureLogoReviewed === true,
    canvaBrandKitExportsReviewed: signals.canvaBrandKitExportsReviewed === true,
    sellerTrustGraphicsReviewed: signals.sellerTrustGraphicsReviewed === true,
    homepageHeroAssetReviewed: signals.homepageHeroAssetReviewed === true,
    sellYourHousePageVisualReviewed: signals.sellYourHousePageVisualReviewed === true,
    contactPageVisualTreatmentReviewed: signals.contactPageVisualTreatmentReviewed === true,
    footerBrandPresentationReviewed: signals.footerBrandPresentationReviewed === true,
    navbarLogoPlacementReviewed: signals.navbarLogoPlacementReviewed === true,
    mobileFirstLayoutReviewed: signals.mobileFirstLayoutReviewed === true,
    ctaVisualConsistencyReviewed: signals.ctaVisualConsistencyReviewed === true,
    sellerTrustSectionDesignReviewed: signals.sellerTrustSectionDesignReviewed === true,
    accessibilityReadabilityReviewed: signals.accessibilityReadabilityReviewed === true,
    socialMediaTemplatesReviewed: signals.socialMediaTemplatesReviewed === true,
    adCreativeTemplatesReviewed: signals.adCreativeTemplatesReviewed === true,
    buyerSellerPdfOnePagerTemplatesReviewed: signals.buyerSellerPdfOnePagerTemplatesReviewed === true,
    emailSignatureDesignReviewed: signals.emailSignatureDesignReviewed === true,
    brandColorPaletteReviewed: signals.brandColorPaletteReviewed === true,
    typographyReviewed: signals.typographyReviewed === true,
    iconIllustrationStyleReviewed: signals.iconIllustrationStyleReviewed === true,
    brandOwnerApproved: signals.brandOwnerApproved === true,
    legalIdentityVerified: signals.legalIdentityVerified === true,
    finalVisualApproval: signals.finalVisualApproval === true,
    accessibilityApproved: signals.accessibilityApproved === true,
    implementationScopeApproved: signals.implementationScopeApproved === true,
  };
}

function getMissingSignals(labels: Array<[keyof BrandWebsiteDesignManifestSignals, string]>, signals: Required<BrandWebsiteDesignManifestSignals>) {
  return labels.filter(([key]) => !signals[key]).map(([, label]) => label);
}

export function getBrandWebsiteDesignManifestPlan(
  signals: BrandWebsiteDesignManifestSignals = {},
): BrandWebsiteDesignManifestPlan {
  const readinessGate = getBrandAssetReplacementReadinessGate();
  assertBrandAssetReplacementReadinessGateSafe(readinessGate);

  const completedSignals = normalizeSignals(signals);
  const missingManifestAreas = getMissingSignals(manifestSignalLabels, completedSignals);
  const missingApprovalGates = getMissingSignals(approvalSignalLabels, completedSignals);
  const manifestStatus: BrandWebsiteDesignManifestStatus =
    missingManifestAreas.length > 0
      ? "manifest_blocked"
      : missingApprovalGates.length > 0
        ? "manifest_needs_human_review"
        : "manifest_ready_for_future_design_scope";

  const result: BrandWebsiteDesignManifestPlan = {
    brandIdentity: {
      displayName: brandConfig.companyDisplayName,
      legalName: brandConfig.companyLegalName,
      domain: brandConfig.domain,
      email: brandConfig.primaryEmail,
      logoAlt: brandConfig.logoAlt,
    },
    readinessGateSummary: summarizeBrandAssetReplacementReadinessGate(readinessGate),
    manifestStatus,
    completedSignals,
    missingManifestAreas,
    missingApprovalGates,
    manifestAreas,
    allowedUse: ["read-only planning visibility for human review only"],
    blockedUse,
    recommendedNextAction: recommendedNextActionByStatus[manifestStatus],
    flags: brandWebsiteDesignManifestPlanFlags,
  };

  assertBrandWebsiteDesignManifestPlanSafe(result);
  return result;
}

export function assertBrandWebsiteDesignManifestPlanSafe(result: BrandWebsiteDesignManifestPlan) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "humanReviewOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const blockedUseText = result.blockedUse.join(" ");
  const blockedUseTerms = [
    /no design implementation/i,
    /no image\/logo replacement/i,
    /no CSS\/theme changes/i,
    /no UI edits/i,
    /no Canva\/API activation/i,
    /no publishing/i,
    /no tracking/i,
    /no provider activation/i,
    /no CRM\/storage writes/i,
    /no outreach/i,
    /no spend/i,
    /no go-live/i,
  ];
  const expectedMissingManifestAreas = getMissingSignals(manifestSignalLabels, result.completedSignals);
  const expectedMissingApprovalGates = getMissingSignals(approvalSignalLabels, result.completedSignals);
  const expectedStatus: BrandWebsiteDesignManifestStatus =
    expectedMissingManifestAreas.length > 0
      ? "manifest_blocked"
      : expectedMissingApprovalGates.length > 0
        ? "manifest_needs_human_review"
        : "manifest_ready_for_future_design_scope";

  if (unsafeTrue.length > 0) throw new Error("Brand website design manifest plan unsafe flags cannot turn true.");
  if (result.brandIdentity.displayName !== brandConfig.companyDisplayName) throw new Error("Brand display name must come from brandConfig.");
  if (result.brandIdentity.legalName !== brandConfig.companyLegalName) throw new Error("Brand legal name must come from brandConfig.");
  if (result.brandIdentity.domain !== brandConfig.domain) throw new Error("Brand domain must come from brandConfig.");
  if (result.brandIdentity.email !== brandConfig.primaryEmail) throw new Error("Brand email must come from brandConfig.");
  if (result.brandIdentity.logoAlt !== brandConfig.logoAlt) throw new Error("Brand logo alt must come from brandConfig.");
  if (!/read-only/i.test(result.readinessGateSummary) || !/human review/i.test(result.readinessGateSummary)) {
    throw new Error("Readiness gate summary must preserve read-only human review language.");
  }
  if (result.allowedUse.join("|") !== "read-only planning visibility for human review only") {
    throw new Error("Allowed use must remain read-only planning visibility for human review only.");
  }
  if (blockedUseTerms.some((term) => !term.test(blockedUseText))) throw new Error("Blocked use must preserve all design manifest safety boundaries.");
  if (result.manifestStatus !== expectedStatus) throw new Error("Manifest status must match completed signals.");
  if (result.missingManifestAreas.join("|") !== expectedMissingManifestAreas.join("|")) throw new Error("Missing manifest areas must match completed signals.");
  if (result.missingApprovalGates.join("|") !== expectedMissingApprovalGates.join("|")) throw new Error("Missing approval gates must match completed signals.");
  if (result.recommendedNextAction !== recommendedNextActionByStatus[result.manifestStatus]) throw new Error("Recommended next action must match manifest status.");
}

export function summarizeBrandWebsiteDesignManifestPlan(result: BrandWebsiteDesignManifestPlan) {
  assertBrandWebsiteDesignManifestPlanSafe(result);
  return `J Capital Property Group brand and website design manifest is ${result.manifestStatus}, read-only, and available for human review.`;
}
