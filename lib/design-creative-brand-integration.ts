import { brandConfig } from "./brand-config";
import { getPhase15DesignCreativeAiAgentScopeSummary } from "./phase-15-design-creative-ai-agent-scope";
import {
  getPhase15DesignCreativeFinalLockdown,
  getPhase15DesignCreativeFinalLockdownSummary,
} from "./phase-15-design-creative-final-lockdown";

export const designCreativeBrandIntegrationFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  humanReviewOnly: true,
  implementationEnabled: false,
  mutationEnabled: false,
  generationEnabled: false,
  logoGenerationEnabled: false,
  assetEditEnabled: false,
  contentGenerationEnabled: false,
  canvaProviderActivated: false,
  providerActivated: false,
  publishingEnabled: false,
  trackingEnabled: false,
  crmWriteEnabled: false,
  storageWriteEnabled: false,
  outreachEnabled: false,
  spendEnabled: false,
  goLiveAuthorized: false,
  phase16ExecutionEnabled: false,
} as const;

export type DesignCreativeBrandIntegration = {
  brandIdentity: {
    displayName: typeof brandConfig.companyDisplayName;
    legalName: typeof brandConfig.companyLegalName;
    domain: typeof brandConfig.domain;
    email: typeof brandConfig.primaryEmail;
    appDescription: typeof brandConfig.appDescription;
    logoAlt: typeof brandConfig.logoAlt;
  };
  phase15Status: {
    scopeSummary: string;
    finalLockdownSummary: string;
    finalLockdownPhase: ReturnType<typeof getPhase15DesignCreativeFinalLockdown>["phase"];
    finalLockdownStep: ReturnType<typeof getPhase15DesignCreativeFinalLockdown>["phaseStep"];
    finalLockdownDecision: ReturnType<typeof getPhase15DesignCreativeFinalLockdown>["phaseDecision"];
    recommendedNextStep: ReturnType<typeof getPhase15DesignCreativeFinalLockdown>["recommendedNextExactStep"];
  };
  allowedUse: ["human-review-only brand/design visibility"];
  blockedUse: string[];
  recommendedNextAction: "Create a human-reviewed brand asset replacement checklist before any logo/theme/content implementation";
  flags: typeof designCreativeBrandIntegrationFlags;
};

const blockedUse = [
  "no UI mutation",
  "no logo generation",
  "no asset edits",
  "no content generation",
  "no Canva/provider activation",
  "no publishing",
  "no tracking",
  "no CRM/storage writes",
  "no outreach",
  "no spend",
  "no go-live",
  "no Phase 16 execution",
];

const recommendedNextAction =
  "Create a human-reviewed brand asset replacement checklist before any logo/theme/content implementation";

export function getDesignCreativeBrandIntegration(): DesignCreativeBrandIntegration {
  const finalLockdown = getPhase15DesignCreativeFinalLockdown();
  const result: DesignCreativeBrandIntegration = {
    brandIdentity: {
      displayName: brandConfig.companyDisplayName,
      legalName: brandConfig.companyLegalName,
      domain: brandConfig.domain,
      email: brandConfig.primaryEmail,
      appDescription: brandConfig.appDescription,
      logoAlt: brandConfig.logoAlt,
    },
    phase15Status: {
      scopeSummary: getPhase15DesignCreativeAiAgentScopeSummary(),
      finalLockdownSummary: getPhase15DesignCreativeFinalLockdownSummary(),
      finalLockdownPhase: finalLockdown.phase,
      finalLockdownStep: finalLockdown.phaseStep,
      finalLockdownDecision: finalLockdown.phaseDecision,
      recommendedNextStep: finalLockdown.recommendedNextExactStep,
    },
    allowedUse: ["human-review-only brand/design visibility"],
    blockedUse,
    recommendedNextAction,
    flags: designCreativeBrandIntegrationFlags,
  };

  assertDesignCreativeBrandIntegrationSafe(result);
  return result;
}

export function assertDesignCreativeBrandIntegrationSafe(result: DesignCreativeBrandIntegration) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "humanReviewOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const blockedText = result.blockedUse.join(" ");
  const requiredBlockedTerms = [
    /no UI mutation/i,
    /no logo generation/i,
    /no asset edits/i,
    /no content generation/i,
    /no Canva\/provider activation/i,
    /no publishing/i,
    /no tracking/i,
    /no CRM\/storage writes/i,
    /no outreach/i,
    /no spend/i,
    /no go-live/i,
    /no Phase 16 execution/i,
  ];

  if (unsafeTrue.length > 0) throw new Error("Design creative brand integration unsafe flags cannot turn true.");
  if (result.brandIdentity.displayName !== brandConfig.companyDisplayName) throw new Error("Brand display name must come from brandConfig.");
  if (result.brandIdentity.legalName !== brandConfig.companyLegalName) throw new Error("Brand legal name must come from brandConfig.");
  if (result.brandIdentity.domain !== brandConfig.domain) throw new Error("Brand domain must come from brandConfig.");
  if (result.brandIdentity.email !== brandConfig.primaryEmail) throw new Error("Brand email must come from brandConfig.");
  if (result.brandIdentity.appDescription !== brandConfig.appDescription) throw new Error("Brand app description must come from brandConfig.");
  if (result.brandIdentity.logoAlt !== brandConfig.logoAlt) throw new Error("Brand logo alt must come from brandConfig.");
  if (result.allowedUse.join("|") !== "human-review-only brand/design visibility") throw new Error("Allowed use must remain human-review-only.");
  if (requiredBlockedTerms.some((term) => !term.test(blockedText))) throw new Error("Blocked use must preserve all core safety terms.");
  if (result.recommendedNextAction !== recommendedNextAction) throw new Error("Recommended next action must remain pinned.");
}

export function summarizeDesignCreativeBrandIntegration(result: DesignCreativeBrandIntegration) {
  assertDesignCreativeBrandIntegrationSafe(result);
  return "J Capital Property Group design/creative integration is read-only and ready for human review.";
}
