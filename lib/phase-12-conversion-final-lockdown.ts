import { phase12MinimalConversionGateChecks } from "./phase-12-minimal-conversion-gate";
import { phase12ConversionOptimizationForbiddenDrift, phase12ConversionOptimizationHumanBoundary } from "./phase-12-conversion-optimization-scope";

export const phase12ConversionFinalLockdownFlags = {
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
  analyticsEnabled: false,
  trackingEnabled: false,
  pixelEnabled: false,
  experimentEnabled: false,
  apiChangeEnabled: false,
  schemaChangeEnabled: false,
  storageMutationEnabled: false,
  leadCreationEnabled: false,
  crmMutationEnabled: false,
  providerActivated: false,
  outreachEnabled: false,
  campaignEnabled: false,
  spendIncreaseEnabled: false,
  offerGenerationEnabled: false,
  contractGenerationEnabled: false,
  auditWritingEnabled: false,
  phase13ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase12ConversionFinalLockdown = {
  phase: "Phase 12: Conversion Optimization Engine";
  phaseStep: "Phase 12F — Conversion Optimization Final Lockdown";
  previousStep: "Phase 12E — Minimal Conversion Optimization Gate";
  phaseDecision: "final_lockdown_only";
  implementationDecision: "not_authorized";
  routeDecision: "not_authorized";
  uiDecision: "not_authorized";
  formDecision: "not_authorized";
  contentDecision: "not_authorized";
  metadataDecision: "not_authorized";
  analyticsDecision: "not_authorized";
  trackingDecision: "not_authorized";
  experimentDecision: "not_authorized";
  apiDecision: "not_authorized";
  schemaDecision: "not_authorized";
  storageDecision: "not_authorized";
  leadCreationDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  providerDecision: "not_authorized";
  campaignDecision: "not_authorized";
  spendDecision: "not_authorized";
  auditDecision: "not_authorized";
  recommendedNextExactStep: "Phase 13 — Safety & Compliance Engine";
  nextStageRecommendation: "Phase 13 — Safety & Compliance Engine";
  gateReferences: typeof phase12MinimalConversionGateChecks;
  lockdownRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase12ConversionFinalLockdownFlags;
};

export const phase12ConversionFinalLockdownRules = [
  "Phase 12F locks Phase 12 as read-only planning for Conversion Optimization intelligence.",
  "Phase 12F preserves the no-form-change, no-UI-change, no-route-change, no-content-change, no-metadata-change, no-analytics, no-tracking, no-experiment, no-campaign, no-CRM-mutation, no-offer-or-contract-generation, and no-spend-increase boundary.",
  "Phase 12F can recommend Phase 13 — Safety & Compliance Engine, but cannot implement Phase 13.",
];

export const phase12ConversionFinalLockdownStopRules = [
  "Phase 12F is final lockdown only.",
  "No implementation, route changes, UI changes, form changes, content changes, publishing, metadata changes, analytics, tracking pixels, event tracking, rank tracking, A/B tests, experiments, API changes, schema changes, storage changes, lead creation beyond existing behavior, CRM mutation, outreach, calling, SMS sending, email sending, provider activation, campaigns, ads, spend increases, offer generation, contract generation, signature requests, audit writing, Phase 13 implementation, or go-live is authorized.",
];

export const phase12ConversionFinalLockdownAiBoundary = [
  "summarize Phase 12 lockdown boundaries for human review only",
  "do not implement Phase 13, change forms, change UI, change routes, change content, change metadata, publish, run analytics, track events, run experiments, change APIs, change schema, write storage, mutate CRM, create leads, contact sellers, activate providers, launch campaigns, increase spend, generate offers or contracts, request signatures, write audits, or authorize go-live",
];

export function getPhase12ConversionFinalLockdown(): Phase12ConversionFinalLockdown {
  const result: Phase12ConversionFinalLockdown = {
    phase: "Phase 12: Conversion Optimization Engine",
    phaseStep: "Phase 12F — Conversion Optimization Final Lockdown",
    previousStep: "Phase 12E — Minimal Conversion Optimization Gate",
    phaseDecision: "final_lockdown_only",
    implementationDecision: "not_authorized",
    routeDecision: "not_authorized",
    uiDecision: "not_authorized",
    formDecision: "not_authorized",
    contentDecision: "not_authorized",
    metadataDecision: "not_authorized",
    analyticsDecision: "not_authorized",
    trackingDecision: "not_authorized",
    experimentDecision: "not_authorized",
    apiDecision: "not_authorized",
    schemaDecision: "not_authorized",
    storageDecision: "not_authorized",
    leadCreationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    providerDecision: "not_authorized",
    campaignDecision: "not_authorized",
    spendDecision: "not_authorized",
    auditDecision: "not_authorized",
    recommendedNextExactStep: "Phase 13 — Safety & Compliance Engine",
    nextStageRecommendation: "Phase 13 — Safety & Compliance Engine",
    gateReferences: phase12MinimalConversionGateChecks,
    lockdownRules: phase12ConversionFinalLockdownRules,
    stopRules: phase12ConversionFinalLockdownStopRules,
    aiOperatorLeverageBoundary: phase12ConversionFinalLockdownAiBoundary,
    humanOwnershipBoundary: phase12ConversionOptimizationHumanBoundary,
    forbiddenDrift: phase12ConversionOptimizationForbiddenDrift,
    flags: phase12ConversionFinalLockdownFlags,
  };
  assertPhase12ConversionFinalLockdownSafe(result);
  return result;
}

export function assertPhase12ConversionFinalLockdownSafe(result: Phase12ConversionFinalLockdown) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "finalLockdownOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.lockdownRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /implementation is authorized|form changes are authorized|UI changes are authorized|content changes are authorized|metadata changes are authorized|analytics is authorized|tracking pixels are authorized|experiments are authorized|API changes are authorized|schema changes are authorized|storage changes are authorized|CRM mutation is authorized|campaigns are authorized|spend increases are authorized|offer generation is authorized|contract generation is authorized|Phase 13 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 12F — Conversion Optimization Final Lockdown") throw new Error("Phase 12F step must remain pinned.");
  if (result.previousStep !== "Phase 12E — Minimal Conversion Optimization Gate") throw new Error("Phase 12F previous step must remain Phase 12E.");
  if (result.phaseDecision !== "final_lockdown_only") throw new Error("Phase 12F must remain final-lockdown-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 12F decisions must remain not_authorized.");
  if (result.gateReferences.join("|") !== phase12MinimalConversionGateChecks.join("|")) throw new Error("Phase 12F gate references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 12F blocked flags cannot turn true.");
  if (!/final lockdown only/i.test(result.stopRules.join(" "))) throw new Error("Phase 12F stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not implement Phase 13/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 12F AI boundary is missing.");
  if (!/final conversion judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/publishing approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 12F human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 13 — Safety & Compliance Engine") throw new Error("Phase 12F must recommend Phase 13.");
  if (unsafePattern.test(text)) throw new Error("Phase 12F wording must not imply unsafe authorization.");
}

export function getPhase12ConversionFinalLockdownSummary() {
  const result = getPhase12ConversionFinalLockdown();
  return `${result.phase} / ${result.phaseStep}: locks Phase 12 Conversion Optimization planning for highest acquisition ROI per operator hour with human-owned conversion judgment, content approval, compliance review, experiment approval, publishing approval, and spend decisions. No form changes, no UI changes, no analytics/tracking, no experiments, no outreach, no CRM mutation, no spend increase, no Phase 13 implementation, and no go-live are authorized. Next phase: ${result.recommendedNextExactStep}.`;
}
