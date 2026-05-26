import { phase12ConversionSignalFamilies } from "./phase-12-conversion-signal-audit";
import {
  phase12ConversionOptimizationForbiddenDrift,
  phase12ConversionOptimizationHumanBoundary,
} from "./phase-12-conversion-optimization-scope";

export const phase12ManualConversionOptimizationPolicyFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  policyOnly: true,
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
  outreachEnabled: false,
  campaignEnabled: false,
  spendIncreaseEnabled: false,
  auditWritingEnabled: false,
  phase13ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export const phase12ManualConversionOptimizationLanes = [
  "stop_truthfulness_and_compliance_first",
  "lead_form_friction_review",
  "source_tracking_conversion_review",
  "seller_trust_message_review",
  "cta_clarity_review",
  "no_pressure_copy_review",
  "mobile_conversion_visibility_review",
  "validation_error_clarity_review",
  "success_state_expectation_review",
  "phone_cta_review",
  "conversion_path_continuity_review",
  "defer_until_human_approved",
] as const;

export const phase12ConversionSummaryStates = [
  "conversion_optimization_blocked",
  "truthfulness_review_required",
  "form_friction_visible",
  "source_tracking_visible",
  "trust_message_visible",
  "cta_clarity_visible",
  "mobile_visibility_review_only",
  "validation_clarity_review_only",
  "success_state_review_only",
  "phone_cta_review_only",
  "operator_focus_only",
  "not_ready",
] as const;

export type Phase12ManualConversionOptimizationPolicy = {
  phase: "Phase 12: Conversion Optimization Engine";
  phaseStep: "Phase 12C — Manual Conversion Optimization Advisory Policy";
  previousStep: "Phase 12B — Conversion Signal Audit";
  phaseDecision: "manual_policy_only";
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
  campaignDecision: "not_authorized";
  spendDecision: "not_authorized";
  recommendedNextExactStep: "Phase 12D — Conversion Optimization Implementation Scope";
  nextStageRecommendation: "Phase 12D — Conversion Optimization Implementation Scope";
  signalReferences: typeof phase12ConversionSignalFamilies;
  conversionOptimizationLanes: typeof phase12ManualConversionOptimizationLanes;
  summaryStates: typeof phase12ConversionSummaryStates;
  policyRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase12ManualConversionOptimizationPolicyFlags;
};

export const phase12ManualConversionOptimizationPolicyRules = [
  "Manual conversion optimization lanes are advisory visibility only and cannot trigger form/UI/content/metadata edits, analytics, tracking, experiments, outreach, campaigns, or spend increases.",
  "Trust, CTA, and conversion-path recommendations must remain unimplemented until the human operator approves truthfulness, compliance, content, experiment, and publishing decisions.",
  "The highest-aROI policy is to stop truthfulness and compliance drift first, then focus human review on form friction, source tracking, trust messages, CTA clarity, no-pressure copy, mobile visibility, validation clarity, success expectations, phone CTA visibility, and conversion-path continuity.",
];

export const phase12ManualConversionOptimizationPolicyStopRules = [
  "Phase 12C defines manual conversion optimization advisory lanes and summary states only.",
  "No implementation, route changes, UI changes, form changes, content changes, publishing, metadata changes, analytics, tracking pixels, event tracking, rank tracking, A/B tests, experiments, API changes, schema changes, storage changes, lead creation beyond existing behavior, CRM mutation, outreach, calling, SMS sending, email sending, provider activation, campaigns, ads, spend increases, offer generation, contract generation, signature requests, audit writing, Phase 13 implementation, or go-live is authorized.",
];

export const phase12ManualConversionOptimizationPolicyAiBoundary = [
  "rank and explain manual conversion optimization lanes for human review only",
  "do not change forms, UI, routes, content, metadata, APIs, schema, storage, analytics, tracking, pixels, experiments, campaigns, lead creation, CRM records, outreach, offers, contracts, signatures, audit logs, spend, or approve implementation",
];

export function getPhase12ManualConversionOptimizationPolicy(): Phase12ManualConversionOptimizationPolicy {
  const result: Phase12ManualConversionOptimizationPolicy = {
    phase: "Phase 12: Conversion Optimization Engine",
    phaseStep: "Phase 12C — Manual Conversion Optimization Advisory Policy",
    previousStep: "Phase 12B — Conversion Signal Audit",
    phaseDecision: "manual_policy_only",
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
    campaignDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 12D — Conversion Optimization Implementation Scope",
    nextStageRecommendation: "Phase 12D — Conversion Optimization Implementation Scope",
    signalReferences: phase12ConversionSignalFamilies,
    conversionOptimizationLanes: phase12ManualConversionOptimizationLanes,
    summaryStates: phase12ConversionSummaryStates,
    policyRules: phase12ManualConversionOptimizationPolicyRules,
    stopRules: phase12ManualConversionOptimizationPolicyStopRules,
    aiOperatorLeverageBoundary: phase12ManualConversionOptimizationPolicyAiBoundary,
    humanOwnershipBoundary: phase12ConversionOptimizationHumanBoundary,
    forbiddenDrift: phase12ConversionOptimizationForbiddenDrift,
    flags: phase12ManualConversionOptimizationPolicyFlags,
  };
  assertPhase12ManualConversionOptimizationPolicySafe(result);
  return result;
}

export function assertPhase12ManualConversionOptimizationPolicySafe(result: Phase12ManualConversionOptimizationPolicy) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "policyOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.policyRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.conversionOptimizationLanes, result.summaryStates].flat().join(" ");
  const unsafePattern = /form changes are authorized|UI changes are authorized|content changes are authorized|metadata changes are authorized|analytics is authorized|tracking pixels are authorized|experiments are authorized|API changes are authorized|schema changes are authorized|storage changes are authorized|CRM mutation is authorized|campaigns are authorized|spend increases are authorized|Phase 13 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 12C — Manual Conversion Optimization Advisory Policy") throw new Error("Phase 12C step must remain pinned.");
  if (result.previousStep !== "Phase 12B — Conversion Signal Audit") throw new Error("Phase 12C previous step must remain Phase 12B.");
  if (result.phaseDecision !== "manual_policy_only") throw new Error("Phase 12C must remain manual-policy-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 12C decisions must remain not_authorized.");
  if (result.conversionOptimizationLanes.join("|") !== phase12ManualConversionOptimizationLanes.join("|")) throw new Error("Phase 12C conversion lanes are missing.");
  if (result.summaryStates.join("|") !== phase12ConversionSummaryStates.join("|")) throw new Error("Phase 12C summary states are missing.");
  if (result.signalReferences.join("|") !== phase12ConversionSignalFamilies.join("|")) throw new Error("Phase 12C signal references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 12C blocked flags cannot turn true.");
  if (!/advisory lanes and summary states only/i.test(result.stopRules.join(" "))) throw new Error("Phase 12C stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not change forms/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 12C AI boundary is missing.");
  if (!/final conversion judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/experiment approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 12C human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 12D — Conversion Optimization Implementation Scope") throw new Error("Phase 12C must hand off to Phase 12D.");
  if (unsafePattern.test(text)) throw new Error("Phase 12C wording must not imply unsafe authorization.");
}

export function getPhase12ManualConversionOptimizationPolicySummary() {
  const result = getPhase12ManualConversionOptimizationPolicy();
  return `${result.phase} / ${result.phaseStep}: defines manual conversion optimization lanes and summary states for highest acquisition ROI per operator hour with human-owned conversion judgment, content approval, compliance review, experiment approval, and publishing approval. No form changes, no UI changes, no analytics/tracking, no experiments, no outreach, no CRM mutation, no spend increase, no Phase 13 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
