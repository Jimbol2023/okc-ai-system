import { phase12ConversionImplementationLanes } from "./phase-12-conversion-implementation-scope";
import { phase12ManualConversionOptimizationLanes, phase12ConversionSummaryStates } from "./phase-12-manual-conversion-optimization-policy";
import { phase12ConversionOptimizationForbiddenDrift, phase12ConversionOptimizationHumanBoundary } from "./phase-12-conversion-optimization-scope";

export const phase12MinimalConversionGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  gateOnly: true,
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

export const phase12MinimalConversionGateChecks = [
  "minimal_readonly_conversion_optimization_package",
  "human_conversion_judgment_required",
  "seller_trust_and_form_friction_review_required",
  "content_compliance_review_required",
  "experiment_and_publishing_approval_required",
  "no_form_ui_content_metadata_boundary_required",
  "no_analytics_tracking_experiment_campaign_spend_boundary_required",
  "phase_12f_lockdown_ready",
] as const;

export type Phase12MinimalConversionGate = {
  phase: "Phase 12: Conversion Optimization Engine";
  phaseStep: "Phase 12E — Minimal Conversion Optimization Gate";
  previousStep: "Phase 12D — Conversion Optimization Implementation Scope";
  phaseDecision: "minimal_gate_only";
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
  recommendedNextExactStep: "Phase 12F — Conversion Optimization Final Lockdown";
  nextStageRecommendation: "Phase 12F — Conversion Optimization Final Lockdown";
  gateChecks: typeof phase12MinimalConversionGateChecks;
  implementationLaneReferences: typeof phase12ConversionImplementationLanes;
  policyLaneReferences: typeof phase12ManualConversionOptimizationLanes;
  summaryStateReferences: typeof phase12ConversionSummaryStates;
  gateRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase12MinimalConversionGateFlags;
};

export const phase12MinimalConversionGateRules = [
  "Phase 12E can only decide whether a minimal read-only conversion optimization visibility package is worth carrying to final lockdown.",
  "A minimal package is only advisory if it preserves human conversion judgment, seller-trust judgment, form-friction judgment, content approval, compliance review, experiment approval, publishing approval, and no form/UI/content/metadata/tracking/experiment/campaign/spend boundaries.",
  "The gate cannot approve implementation, form changes, UI changes, content changes, metadata changes, analytics, tracking, experiments, API/schema/storage changes, CRM mutation, provider activation, campaigns, spend increases, Phase 13 implementation, or go-live.",
];

export const phase12MinimalConversionGateStopRules = [
  "Phase 12E is a minimal gate only.",
  "No implementation, route changes, UI changes, form changes, content changes, publishing, metadata changes, analytics, tracking pixels, event tracking, rank tracking, A/B tests, experiments, API changes, schema changes, storage changes, lead creation beyond existing behavior, CRM mutation, outreach, calling, SMS sending, email sending, provider activation, campaigns, ads, spend increases, offer generation, contract generation, signature requests, audit writing, Phase 13 implementation, or go-live is authorized.",
];

export const phase12MinimalConversionGateAiBoundary = [
  "summarize whether minimal read-only conversion optimization visibility is worth final lockdown review",
  "do not approve implementation, change forms, change UI, change routes, change content, change metadata, publish, run analytics, track events, run experiments, change APIs, change schema, write storage, mutate CRM, create leads, activate providers, launch campaigns, increase spend, generate offers or contracts, request signatures, write audits, approve Phase 13 implementation, or authorize go-live",
];

export function getPhase12MinimalConversionGate(): Phase12MinimalConversionGate {
  const result: Phase12MinimalConversionGate = {
    phase: "Phase 12: Conversion Optimization Engine",
    phaseStep: "Phase 12E — Minimal Conversion Optimization Gate",
    previousStep: "Phase 12D — Conversion Optimization Implementation Scope",
    phaseDecision: "minimal_gate_only",
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
    recommendedNextExactStep: "Phase 12F — Conversion Optimization Final Lockdown",
    nextStageRecommendation: "Phase 12F — Conversion Optimization Final Lockdown",
    gateChecks: phase12MinimalConversionGateChecks,
    implementationLaneReferences: phase12ConversionImplementationLanes,
    policyLaneReferences: phase12ManualConversionOptimizationLanes,
    summaryStateReferences: phase12ConversionSummaryStates,
    gateRules: phase12MinimalConversionGateRules,
    stopRules: phase12MinimalConversionGateStopRules,
    aiOperatorLeverageBoundary: phase12MinimalConversionGateAiBoundary,
    humanOwnershipBoundary: phase12ConversionOptimizationHumanBoundary,
    forbiddenDrift: phase12ConversionOptimizationForbiddenDrift,
    flags: phase12MinimalConversionGateFlags,
  };
  assertPhase12MinimalConversionGateSafe(result);
  return result;
}

export function assertPhase12MinimalConversionGateSafe(result: Phase12MinimalConversionGate) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "gateOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.gateRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.gateChecks].flat().join(" ");
  const unsafePattern = /implementation is authorized|form changes are authorized|UI changes are authorized|content changes are authorized|metadata changes are authorized|analytics is authorized|tracking pixels are authorized|experiments are authorized|API changes are authorized|schema changes are authorized|storage changes are authorized|CRM mutation is authorized|campaigns are authorized|spend increases are authorized|Phase 13 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 12E — Minimal Conversion Optimization Gate") throw new Error("Phase 12E step must remain pinned.");
  if (result.previousStep !== "Phase 12D — Conversion Optimization Implementation Scope") throw new Error("Phase 12E previous step must remain Phase 12D.");
  if (result.phaseDecision !== "minimal_gate_only") throw new Error("Phase 12E must remain minimal-gate-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 12E decisions must remain not_authorized.");
  if (result.gateChecks.join("|") !== phase12MinimalConversionGateChecks.join("|")) throw new Error("Phase 12E gate checks are missing.");
  if (result.implementationLaneReferences.join("|") !== phase12ConversionImplementationLanes.join("|")) throw new Error("Phase 12E implementation lane references are missing.");
  if (result.policyLaneReferences.join("|") !== phase12ManualConversionOptimizationLanes.join("|")) throw new Error("Phase 12E policy lane references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 12E blocked flags cannot turn true.");
  if (!/minimal gate only/i.test(result.stopRules.join(" "))) throw new Error("Phase 12E stop rules are missing.");
  if (!/do not approve implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 12E AI boundary is missing.");
  if (!/publishing approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 12E human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 12F — Conversion Optimization Final Lockdown") throw new Error("Phase 12E must hand off to Phase 12F.");
  if (unsafePattern.test(text)) throw new Error("Phase 12E wording must not imply unsafe authorization.");
}

export function getPhase12MinimalConversionGateSummary() {
  const result = getPhase12MinimalConversionGate();
  return `${result.phase} / ${result.phaseStep}: gates a minimal read-only conversion optimization package for highest acquisition ROI per operator hour with human-owned conversion judgment, content approval, compliance review, experiment approval, and publishing approval. No form changes, no UI changes, no analytics/tracking, no experiments, no outreach, no CRM mutation, no spend increase, no Phase 13 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
