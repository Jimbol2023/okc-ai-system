import { phase15MinimalDesignCreativeGateChecks } from "./phase-15-minimal-design-creative-gate";
import {
  phase15DesignCreativeForbiddenDrift,
  phase15DesignCreativeHumanBoundary,
} from "./phase-15-design-creative-ai-agent-scope";

export const phase15DesignCreativeFinalLockdownFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  finalLockdownOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  routeChangeEnabled: false,
  uiChangeEnabled: false,
  formChangeEnabled: false,
  contentChangeEnabled: false,
  metadataChangeEnabled: false,
  assetChangeEnabled: false,
  imageGenerationEnabled: false,
  logoChangeEnabled: false,
  themeChangeEnabled: false,
  cssChangeEnabled: false,
  publishingEnabled: false,
  creativePublishingEnabled: false,
  campaignEnabled: false,
  adEnabled: false,
  providerActivated: false,
  trackingEnabled: false,
  analyticsEnabled: false,
  crmMutationEnabled: false,
  storageMutationEnabled: false,
  auditWritingEnabled: false,
  outreachEnabled: false,
  spendIncreaseEnabled: false,
  phase16ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase15DesignCreativeFinalLockdown = {
  phase: "Phase 15: Design & Creative AI Agent";
  phaseStep: "Phase 15F â€” Design & Creative Final Lockdown";
  previousStep: "Phase 15E â€” Minimal Design & Creative Gate";
  phaseDecision: "final_lockdown_only";
  implementationDecision: "not_authorized";
  routeDecision: "not_authorized";
  uiDecision: "not_authorized";
  formDecision: "not_authorized";
  contentDecision: "not_authorized";
  metadataDecision: "not_authorized";
  assetDecision: "not_authorized";
  imageDecision: "not_authorized";
  logoDecision: "not_authorized";
  themeDecision: "not_authorized";
  cssDecision: "not_authorized";
  publishingDecision: "not_authorized";
  creativeDecision: "not_authorized";
  campaignDecision: "not_authorized";
  adDecision: "not_authorized";
  providerDecision: "not_authorized";
  trackingDecision: "not_authorized";
  analyticsDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  storageDecision: "not_authorized";
  auditDecision: "not_authorized";
  outreachDecision: "not_authorized";
  spendDecision: "not_authorized";
  goLiveDecision: "not_authorized";
  recommendedNextExactStep: "Phase 16 â€” Buyer Fit Intelligence";
  nextStageRecommendation: "Phase 16 â€” Buyer Fit Intelligence";
  gateReferences: typeof phase15MinimalDesignCreativeGateChecks;
  lockdownRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase15DesignCreativeFinalLockdownFlags;
};

export const phase15DesignCreativeFinalLockdownRules = [
  "Phase 15F locks Phase 15 as read-only planning for Design & Creative AI Agent intelligence.",
  "Phase 15F preserves the no-UI-change, no-content-change, no-asset-edit, no-logo-change, no-theme-change, no-CSS-change, no-image-generation, no-creative-publishing, no-campaign, no-ad, no-tracking, no-CRM-mutation, no-storage-mutation, no-outreach, no-spend-increase, and no-go-live boundary.",
  "Phase 15F can recommend Phase 16 â€” Buyer Fit Intelligence, but cannot implement Phase 16.",
];

export const phase15DesignCreativeFinalLockdownStopRules = [
  "Phase 15F is final lockdown only.",
  "No implementation, route changes, UI changes, form changes, content changes, metadata changes, CSS changes, theme changes, logo changes, asset edits, image generation, creative generation, creative publishing, copy publishing, page publishing, ad publishing, campaign creation, ad creation, provider activation, analytics, tracking pixels, experiments, audience upload, spend increases, CRM mutation, lead mutation, source mutation, storage mutation, audit writing, outreach, SMS/email/calling, AI voice, queues, runtime jobs, invented local claims, invented seller testimonials, invented property facts, invented before/after results, compliance/platform/legal approval by AI, Phase 16 implementation, or go-live is authorized.",
];

export const phase15DesignCreativeFinalLockdownAiBoundary = [
  "summarize Phase 15 lockdown boundaries for human review only",
  "do not implement Phase 16, edit UI/content/assets/logos/themes/CSS/metadata, generate images, publish creative, create campaigns or ads, activate providers, track analytics, mutate CRM/storage, write audits, launch outreach, increase spend, invent claims or property facts, approve legal/platform decisions, or authorize go-live",
];

export function getPhase15DesignCreativeFinalLockdown(): Phase15DesignCreativeFinalLockdown {
  const result: Phase15DesignCreativeFinalLockdown = {
    phase: "Phase 15: Design & Creative AI Agent",
    phaseStep: "Phase 15F â€” Design & Creative Final Lockdown",
    previousStep: "Phase 15E â€” Minimal Design & Creative Gate",
    phaseDecision: "final_lockdown_only",
    implementationDecision: "not_authorized",
    routeDecision: "not_authorized",
    uiDecision: "not_authorized",
    formDecision: "not_authorized",
    contentDecision: "not_authorized",
    metadataDecision: "not_authorized",
    assetDecision: "not_authorized",
    imageDecision: "not_authorized",
    logoDecision: "not_authorized",
    themeDecision: "not_authorized",
    cssDecision: "not_authorized",
    publishingDecision: "not_authorized",
    creativeDecision: "not_authorized",
    campaignDecision: "not_authorized",
    adDecision: "not_authorized",
    providerDecision: "not_authorized",
    trackingDecision: "not_authorized",
    analyticsDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    storageDecision: "not_authorized",
    auditDecision: "not_authorized",
    outreachDecision: "not_authorized",
    spendDecision: "not_authorized",
    goLiveDecision: "not_authorized",
    recommendedNextExactStep: "Phase 16 â€” Buyer Fit Intelligence",
    nextStageRecommendation: "Phase 16 â€” Buyer Fit Intelligence",
    gateReferences: phase15MinimalDesignCreativeGateChecks,
    lockdownRules: phase15DesignCreativeFinalLockdownRules,
    stopRules: phase15DesignCreativeFinalLockdownStopRules,
    aiOperatorLeverageBoundary: phase15DesignCreativeFinalLockdownAiBoundary,
    humanOwnershipBoundary: phase15DesignCreativeHumanBoundary,
    forbiddenDrift: phase15DesignCreativeForbiddenDrift,
    flags: phase15DesignCreativeFinalLockdownFlags,
  };
  assertPhase15DesignCreativeFinalLockdownSafe(result);
  return result;
}

export function assertPhase15DesignCreativeFinalLockdownSafe(result: Phase15DesignCreativeFinalLockdown) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "finalLockdownOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.lockdownRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /implementation is authorized|UI changes are authorized|content changes are authorized|asset edits are authorized|image generation is authorized|creative publishing is authorized|campaign creation is authorized|ads are authorized|tracking pixels are authorized|CRM mutation is authorized|storage mutation is authorized|audit writing is authorized|outreach is authorized|spend increases are authorized|Phase 16 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 15F â€” Design & Creative Final Lockdown") throw new Error("Phase 15F step must remain pinned.");
  if (result.previousStep !== "Phase 15E â€” Minimal Design & Creative Gate") throw new Error("Phase 15F previous step must remain Phase 15E.");
  if (result.phaseDecision !== "final_lockdown_only") throw new Error("Phase 15F must remain final-lockdown-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 15F decisions must remain not_authorized.");
  if (result.gateReferences.join("|") !== phase15MinimalDesignCreativeGateChecks.join("|")) throw new Error("Phase 15F gate references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 15F blocked flags cannot turn true.");
  if (!/final lockdown only/i.test(result.stopRules.join(" "))) throw new Error("Phase 15F stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not implement Phase 16/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 15F AI boundary is missing.");
  if (!/brand judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/creative approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 15F human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 16 â€” Buyer Fit Intelligence") throw new Error("Phase 15F must recommend Phase 16.");
  if (unsafePattern.test(text)) throw new Error("Phase 15F wording must not imply unsafe authorization.");
}

export function getPhase15DesignCreativeFinalLockdownSummary() {
  const result = getPhase15DesignCreativeFinalLockdown();
  return `${result.phase} / ${result.phaseStep}: locks Phase 15 Design & Creative AI Agent planning for highest acquisition ROI per operator hour with human-owned brand judgment, design approval, claim verification, creative approval, publishing approval, compliance review, seller-trust judgment, spend approval, and go-live approval. No UI changes, no asset/logo/theme edits, no creative publishing, no campaigns/ads, no outreach, no CRM mutation, no spend increase, no go-live, and no Phase 16 implementation are authorized. Next phase: ${result.recommendedNextExactStep}.`;
}
