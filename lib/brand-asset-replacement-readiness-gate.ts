import { brandConfig } from "./brand-config";
import {
  assertBrandAssetReplacementChecklistSafe,
  getHumanReviewedBrandAssetReplacementChecklist,
  summarizeHumanReviewedBrandAssetReplacementChecklist,
} from "./human-reviewed-brand-asset-replacement-checklist";

export const brandAssetReplacementReadinessGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  humanReviewOnly: true,
  directImplementationEnabled: false,
  canvaApiActivationEnabled: false,
  logoImageReplacementEnabled: false,
  cssThemeChangeEnabled: false,
  uiEditEnabled: false,
  publishingEnabled: false,
  providerActivationEnabled: false,
  crmWriteEnabled: false,
  storageWriteEnabled: false,
  outreachEnabled: false,
  spendEnabled: false,
  goLiveAuthorized: false,
} as const;

export type BrandAssetReplacementCompletionSignals = Partial<{
  logoReviewed: boolean;
  canvaBrandKitReviewed: boolean;
  websiteHeroReviewed: boolean;
  emailSignatureReviewed: boolean;
  socialTemplatesReviewed: boolean;
  sellerTrustAssetsReviewed: boolean;
  exportRequirementsReviewed: boolean;
  brandOwnerApproved: boolean;
  legalIdentityVerified: boolean;
  finalVisualApproval: boolean;
  implementationScopeApproved: boolean;
}>;

export type BrandAssetReplacementReadinessStatus =
  | "blocked"
  | "needs_human_review"
  | "ready_for_future_implementation_scope";

export type BrandAssetReplacementReadinessGate = {
  brandIdentity: {
    displayName: typeof brandConfig.companyDisplayName;
    legalName: typeof brandConfig.companyLegalName;
    domain: typeof brandConfig.domain;
    email: typeof brandConfig.primaryEmail;
    logoAlt: typeof brandConfig.logoAlt;
  };
  checklistSummary: string;
  readinessStatus: BrandAssetReplacementReadinessStatus;
  completedSignals: Required<BrandAssetReplacementCompletionSignals>;
  missingAssetAreas: string[];
  missingApprovalGates: string[];
  allowedUse: ["readiness visibility for human review only"];
  blockedUse: typeof blockedUse;
  recommendedNextAction: (typeof recommendedNextActionByStatus)[BrandAssetReplacementReadinessStatus];
  flags: typeof brandAssetReplacementReadinessGateFlags;
};

const assetSignalLabels: Array<[keyof BrandAssetReplacementCompletionSignals, string]> = [
  ["logoReviewed", "logo replacement readiness"],
  ["canvaBrandKitReviewed", "Canva Brand Kit readiness"],
  ["websiteHeroReviewed", "website hero asset readiness"],
  ["emailSignatureReviewed", "email signature readiness"],
  ["socialTemplatesReviewed", "social media template readiness"],
  ["sellerTrustAssetsReviewed", "seller trust asset readiness"],
  ["exportRequirementsReviewed", "export file requirements"],
];

const approvalSignalLabels: Array<[keyof BrandAssetReplacementCompletionSignals, string]> = [
  ["brandOwnerApproved", "brand owner review required"],
  ["legalIdentityVerified", "legal name/domain/email verification required"],
  ["finalVisualApproval", "final visual approval required"],
  ["implementationScopeApproved", "implementation approval required"],
];

const blockedUse = [
  "no Canva API activation",
  "no logo/image replacement",
  "no CSS/theme changes",
  "no UI edits",
  "no publishing",
  "no provider activation",
  "no CRM/storage writes",
  "no outreach",
  "no spend",
  "no go-live",
] as const;

const recommendedNextActionByStatus = {
  blocked: "Complete all required brand asset review areas before requesting implementation approval.",
  needs_human_review: "Complete missing human approval gates before creating any implementation scope.",
  ready_for_future_implementation_scope: "Create a separate human-approved implementation scope before replacing any brand assets.",
} as const;

function normalizeSignals(signals: BrandAssetReplacementCompletionSignals = {}): Required<BrandAssetReplacementCompletionSignals> {
  return {
    logoReviewed: signals.logoReviewed === true,
    canvaBrandKitReviewed: signals.canvaBrandKitReviewed === true,
    websiteHeroReviewed: signals.websiteHeroReviewed === true,
    emailSignatureReviewed: signals.emailSignatureReviewed === true,
    socialTemplatesReviewed: signals.socialTemplatesReviewed === true,
    sellerTrustAssetsReviewed: signals.sellerTrustAssetsReviewed === true,
    exportRequirementsReviewed: signals.exportRequirementsReviewed === true,
    brandOwnerApproved: signals.brandOwnerApproved === true,
    legalIdentityVerified: signals.legalIdentityVerified === true,
    finalVisualApproval: signals.finalVisualApproval === true,
    implementationScopeApproved: signals.implementationScopeApproved === true,
  };
}

function getMissingSignals(labels: Array<[keyof BrandAssetReplacementCompletionSignals, string]>, signals: Required<BrandAssetReplacementCompletionSignals>) {
  return labels.filter(([key]) => !signals[key]).map(([, label]) => label);
}

export function getBrandAssetReplacementReadinessGate(
  signals: BrandAssetReplacementCompletionSignals = {},
): BrandAssetReplacementReadinessGate {
  const checklist = getHumanReviewedBrandAssetReplacementChecklist();
  assertBrandAssetReplacementChecklistSafe(checklist);

  const completedSignals = normalizeSignals(signals);
  const missingAssetAreas = getMissingSignals(assetSignalLabels, completedSignals);
  const missingApprovalGates = getMissingSignals(approvalSignalLabels, completedSignals);
  const readinessStatus: BrandAssetReplacementReadinessStatus =
    missingAssetAreas.length > 0
      ? "blocked"
      : missingApprovalGates.length > 0
        ? "needs_human_review"
        : "ready_for_future_implementation_scope";

  const result: BrandAssetReplacementReadinessGate = {
    brandIdentity: {
      displayName: brandConfig.companyDisplayName,
      legalName: brandConfig.companyLegalName,
      domain: brandConfig.domain,
      email: brandConfig.primaryEmail,
      logoAlt: brandConfig.logoAlt,
    },
    checklistSummary: summarizeHumanReviewedBrandAssetReplacementChecklist(checklist),
    readinessStatus,
    completedSignals,
    missingAssetAreas,
    missingApprovalGates,
    allowedUse: ["readiness visibility for human review only"],
    blockedUse,
    recommendedNextAction: recommendedNextActionByStatus[readinessStatus],
    flags: brandAssetReplacementReadinessGateFlags,
  };

  assertBrandAssetReplacementReadinessGateSafe(result);
  return result;
}

export function assertBrandAssetReplacementReadinessGateSafe(result: BrandAssetReplacementReadinessGate) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "humanReviewOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const blockedUseText = result.blockedUse.join(" ");
  const blockedUseTerms = [
    /no Canva API activation/i,
    /no logo\/image replacement/i,
    /no CSS\/theme changes/i,
    /no UI edits/i,
    /no publishing/i,
    /no provider activation/i,
    /no CRM\/storage writes/i,
    /no outreach/i,
    /no spend/i,
    /no go-live/i,
  ];
  const expectedMissingAssetAreas = getMissingSignals(assetSignalLabels, result.completedSignals);
  const expectedMissingApprovalGates = getMissingSignals(approvalSignalLabels, result.completedSignals);
  const expectedStatus: BrandAssetReplacementReadinessStatus =
    expectedMissingAssetAreas.length > 0
      ? "blocked"
      : expectedMissingApprovalGates.length > 0
        ? "needs_human_review"
        : "ready_for_future_implementation_scope";

  if (unsafeTrue.length > 0) throw new Error("Brand asset replacement readiness gate unsafe flags cannot turn true.");
  if (result.brandIdentity.displayName !== brandConfig.companyDisplayName) throw new Error("Brand display name must come from brandConfig.");
  if (result.brandIdentity.legalName !== brandConfig.companyLegalName) throw new Error("Brand legal name must come from brandConfig.");
  if (result.brandIdentity.domain !== brandConfig.domain) throw new Error("Brand domain must come from brandConfig.");
  if (result.brandIdentity.email !== brandConfig.primaryEmail) throw new Error("Brand email must come from brandConfig.");
  if (result.brandIdentity.logoAlt !== brandConfig.logoAlt) throw new Error("Brand logo alt must come from brandConfig.");
  if (!/read-only/i.test(result.checklistSummary) || !/human approval/i.test(result.checklistSummary)) throw new Error("Checklist summary must preserve read-only human approval language.");
  if (result.allowedUse.join("|") !== "readiness visibility for human review only") throw new Error("Allowed use must remain readiness visibility for human review only.");
  if (blockedUseTerms.some((term) => !term.test(blockedUseText))) throw new Error("Blocked use must preserve all readiness gate safety boundaries.");
  if (result.readinessStatus !== expectedStatus) throw new Error("Readiness status must match completed signals.");
  if (result.missingAssetAreas.join("|") !== expectedMissingAssetAreas.join("|")) throw new Error("Missing asset areas must match completed signals.");
  if (result.missingApprovalGates.join("|") !== expectedMissingApprovalGates.join("|")) throw new Error("Missing approval gates must match completed signals.");
  if (result.recommendedNextAction !== recommendedNextActionByStatus[result.readinessStatus]) throw new Error("Recommended next action must match readiness status.");
}

export function summarizeBrandAssetReplacementReadinessGate(result: BrandAssetReplacementReadinessGate) {
  assertBrandAssetReplacementReadinessGateSafe(result);
  return `J Capital Property Group brand asset replacement readiness is ${result.readinessStatus}, read-only, and available for human review.`;
}
