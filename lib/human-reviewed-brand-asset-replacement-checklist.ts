import { brandConfig } from "./brand-config";
import {
  assertDesignCreativeBrandIntegrationSafe,
  getDesignCreativeBrandIntegration,
  summarizeDesignCreativeBrandIntegration,
} from "./design-creative-brand-integration";

export const brandAssetReplacementChecklistFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  humanReviewOnly: true,
  uiMutationEnabled: false,
  cssThemeChangeEnabled: false,
  assetReplacementEnabled: false,
  generationEnabled: false,
  canvaProviderActivated: false,
  providerActivated: false,
  publishingEnabled: false,
  trackingEnabled: false,
  crmWriteEnabled: false,
  storageWriteEnabled: false,
  outreachEnabled: false,
  spendEnabled: false,
  goLiveAuthorized: false,
} as const;

export type BrandAssetReplacementChecklist = {
  brandIdentity: {
    displayName: typeof brandConfig.companyDisplayName;
    legalName: typeof brandConfig.companyLegalName;
    domain: typeof brandConfig.domain;
    email: typeof brandConfig.primaryEmail;
    logoAlt: typeof brandConfig.logoAlt;
  };
  integrationSummary: string;
  requiredAssetAreas: typeof requiredAssetAreas;
  humanApprovalGates: typeof humanApprovalGates;
  blockedUse: typeof blockedUse;
  recommendedNextAction: typeof recommendedNextAction;
  flags: typeof brandAssetReplacementChecklistFlags;
};

const requiredAssetAreas = [
  "logo replacement readiness",
  "Canva Brand Kit readiness",
  "website hero asset readiness",
  "email signature readiness",
  "social media template readiness",
  "seller trust asset readiness",
  "export file requirements",
] as const;

const humanApprovalGates = [
  "brand owner review required",
  "legal name/domain/email verification required",
  "final visual approval required",
  "export checklist approval required",
  "implementation approval required",
] as const;

const blockedUse = [
  "no UI changes",
  "no CSS/theme changes",
  "no logo/image replacement",
  "no Canva API/provider activation",
  "no asset generation",
  "no publishing",
  "no tracking",
  "no CRM/storage writes",
  "no outreach",
  "no spend",
  "no go-live",
] as const;

const recommendedNextAction =
  "Complete and approve the brand asset replacement checklist before implementing any logo, theme, Canva, email signature, or public website asset changes.";

export function getHumanReviewedBrandAssetReplacementChecklist(): BrandAssetReplacementChecklist {
  const integration = getDesignCreativeBrandIntegration();
  assertDesignCreativeBrandIntegrationSafe(integration);

  const result: BrandAssetReplacementChecklist = {
    brandIdentity: {
      displayName: brandConfig.companyDisplayName,
      legalName: brandConfig.companyLegalName,
      domain: brandConfig.domain,
      email: brandConfig.primaryEmail,
      logoAlt: brandConfig.logoAlt,
    },
    integrationSummary: summarizeDesignCreativeBrandIntegration(integration),
    requiredAssetAreas,
    humanApprovalGates,
    blockedUse,
    recommendedNextAction,
    flags: brandAssetReplacementChecklistFlags,
  };

  assertBrandAssetReplacementChecklistSafe(result);
  return result;
}

export function assertBrandAssetReplacementChecklistSafe(result: BrandAssetReplacementChecklist) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "humanReviewOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const requiredAreaText = result.requiredAssetAreas.join(" ");
  const approvalGateText = result.humanApprovalGates.join(" ");
  const blockedUseText = result.blockedUse.join(" ");

  const requiredAreaTerms = [
    /logo replacement readiness/i,
    /Canva Brand Kit readiness/i,
    /website hero asset readiness/i,
    /email signature readiness/i,
    /social media template readiness/i,
    /seller trust asset readiness/i,
    /export file requirements/i,
  ];
  const approvalGateTerms = [
    /brand owner review required/i,
    /legal name\/domain\/email verification required/i,
    /final visual approval required/i,
    /export checklist approval required/i,
    /implementation approval required/i,
  ];
  const blockedUseTerms = [
    /no UI changes/i,
    /no CSS\/theme changes/i,
    /no logo\/image replacement/i,
    /no Canva API\/provider activation/i,
    /no asset generation/i,
    /no publishing/i,
    /no tracking/i,
    /no CRM\/storage writes/i,
    /no outreach/i,
    /no spend/i,
    /no go-live/i,
  ];

  if (unsafeTrue.length > 0) throw new Error("Brand asset replacement checklist unsafe flags cannot turn true.");
  if (result.brandIdentity.displayName !== brandConfig.companyDisplayName) throw new Error("Brand display name must come from brandConfig.");
  if (result.brandIdentity.legalName !== brandConfig.companyLegalName) throw new Error("Brand legal name must come from brandConfig.");
  if (result.brandIdentity.domain !== brandConfig.domain) throw new Error("Brand domain must come from brandConfig.");
  if (result.brandIdentity.email !== brandConfig.primaryEmail) throw new Error("Brand email must come from brandConfig.");
  if (result.brandIdentity.logoAlt !== brandConfig.logoAlt) throw new Error("Brand logo alt must come from brandConfig.");
  if (requiredAreaTerms.some((term) => !term.test(requiredAreaText))) throw new Error("Required asset areas must preserve all checklist areas.");
  if (approvalGateTerms.some((term) => !term.test(approvalGateText))) throw new Error("Human approval gates must preserve all approval requirements.");
  if (blockedUseTerms.some((term) => !term.test(blockedUseText))) throw new Error("Blocked use must preserve all brand asset safety boundaries.");
  if (result.recommendedNextAction !== recommendedNextAction) throw new Error("Recommended next action must remain pinned.");
}

export function summarizeHumanReviewedBrandAssetReplacementChecklist(result: BrandAssetReplacementChecklist) {
  assertBrandAssetReplacementChecklistSafe(result);
  return "J Capital Property Group brand asset replacement checklist is read-only and requires human approval before implementation.";
}
