import {
  phase11SeoLocalAuthorityFinalLockdownFlags,
  phase11SeoLocalAuthorityFinalLockdownRules,
} from "./phase-11-seo-local-authority-final-lockdown";

export const phase12ConversionOptimizationScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  operatorLeverageOnly: true,
  scopeOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  automationEnabled: false,
  communicationEnabled: false,
  crmMutationEnabled: false,
  schemaChangeEnabled: false,
  storageMutationEnabled: false,
  runtimeJobsEnabled: false,
  routeChangeEnabled: false,
  uiChangeEnabled: false,
  formChangeEnabled: false,
  contentChangeEnabled: false,
  metadataChangeEnabled: false,
  contentPublishingEnabled: false,
  analyticsEnabled: false,
  trackingEnabled: false,
  pixelEnabled: false,
  experimentEnabled: false,
  apiChangeEnabled: false,
  campaignEnabled: false,
  leadCreationEnabled: false,
  outreachEnabled: false,
  callingEnabled: false,
  smsSendingEnabled: false,
  emailSendingEnabled: false,
  offerGenerationEnabled: false,
  contractGenerationEnabled: false,
  signatureRequestEnabled: false,
  auditWritingEnabled: false,
  spendIncreaseEnabled: false,
  phase13ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase12Decision = "not_authorized";

export type Phase12ConversionOptimizationScope = {
  phase: "Phase 12: Conversion Optimization Engine";
  phaseStep: "Phase 12A — Conversion Optimization Engine Scope";
  previousStep: "Phase 11F — SEO & Local Authority Final Lockdown";
  phaseDecision: "scope_only";
  primaryMetric: "acquisition_roi_per_operator_hour";
  aiRole: "operator_leverage_only";
  humanRole: "final_conversion_judgment_seller_trust_judgment_form_friction_judgment_content_approval_compliance_review_experiment_approval_publishing_approval_spend_decisions_execution_owner";
  implementationDecision: Phase12Decision;
  providerDecision: Phase12Decision;
  automationDecision: Phase12Decision;
  communicationDecision: Phase12Decision;
  crmMutationDecision: Phase12Decision;
  schemaDecision: Phase12Decision;
  storageDecision: Phase12Decision;
  runtimeDecision: Phase12Decision;
  routeDecision: Phase12Decision;
  uiDecision: Phase12Decision;
  formDecision: Phase12Decision;
  contentDecision: Phase12Decision;
  metadataDecision: Phase12Decision;
  analyticsDecision: Phase12Decision;
  trackingDecision: Phase12Decision;
  experimentDecision: Phase12Decision;
  pixelDecision: Phase12Decision;
  campaignDecision: Phase12Decision;
  leadCreationDecision: Phase12Decision;
  outreachDecision: Phase12Decision;
  apiDecision: Phase12Decision;
  auditDecision: Phase12Decision;
  spendDecision: Phase12Decision;
  recommendedNextExactStep: "Phase 12B — Conversion Signal Audit";
  nextStageRecommendation: "Phase 12B — Conversion Signal Audit";
  phase11FinalLockdownReference: {
    flags: typeof phase11SeoLocalAuthorityFinalLockdownFlags;
    rules: typeof phase11SeoLocalAuthorityFinalLockdownRules;
  };
  scopePurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase12ConversionOptimizationScopeFlags;
};

export const phase12ConversionOptimizationPurpose = [
  "Define read-only Conversion Optimization planning for highest acquisition ROI per operator hour.",
  "Summarize form friction, CTA clarity, trust-message clarity, mobile conversion visibility, validation clarity, success-state clarity, phone CTA visibility, and conversion-path continuity for human review only.",
  "Improve acquisition focus without changing routes, UI, forms, content, metadata, APIs, schema, storage, analytics, tracking, experiments, campaigns, lead records, CRM records, outreach, audit logs, or publishing behavior.",
];

export const phase12ConversionOptimizationStopRules = [
  "Phase 12A is scope only.",
  "No implementation, route changes, UI changes, form changes, content changes, publishing, metadata changes, analytics, tracking pixels, event tracking, rank tracking, A/B tests, experiments, API changes, schema changes, storage changes, lead creation beyond existing behavior, CRM mutation, outreach, calling, SMS sending, email sending, provider activation, campaigns, ads, spend increases, offer generation, contract generation, signature requests, audit writing, Phase 13 implementation, or go-live is authorized.",
];

export const phase12ConversionOptimizationAiBoundary = [
  "summarize conversion optimization signals for human review only",
  "surface form friction, source tracking, seller trust messages, CTA clarity, no-pressure copy, mobile visibility, validation clarity, success-state expectations, phone CTA visibility, and conversion-path continuity",
  "do not change routes, UI, forms, content, metadata, APIs, schema, storage, analytics, tracking, pixels, experiments, campaigns, lead creation, CRM records, outreach, offers, contracts, signatures, audit logs, Phase 13 implementation, or go-live",
];

export const phase12ConversionOptimizationHumanBoundary = [
  "final conversion judgment",
  "seller-trust judgment",
  "form-friction judgment",
  "content approval",
  "compliance review",
  "experiment approval",
  "publishing approval",
  "spend decisions",
  "seller communication judgment",
  "manual execution",
  "future implementation approval",
];

export const phase12ConversionOptimizationForbiddenDrift = [
  "implementation",
  "route changes",
  "UI changes",
  "form changes",
  "content changes",
  "publishing",
  "metadata changes",
  "analytics",
  "tracking pixels",
  "event tracking",
  "rank tracking",
  "A/B tests",
  "experiments",
  "API changes",
  "schema changes",
  "storage changes",
  "lead creation beyond existing behavior",
  "CRM mutation",
  "outreach",
  "calling",
  "SMS sending",
  "email sending",
  "provider activation",
  "campaign activation",
  "spend increase",
  "offer generation",
  "contract generation",
  "signature requests",
  "audit writing",
  "Phase 13 implementation",
  "go-live",
];

export function getPhase12ConversionOptimizationScope(): Phase12ConversionOptimizationScope {
  const result: Phase12ConversionOptimizationScope = {
    phase: "Phase 12: Conversion Optimization Engine",
    phaseStep: "Phase 12A — Conversion Optimization Engine Scope",
    previousStep: "Phase 11F — SEO & Local Authority Final Lockdown",
    phaseDecision: "scope_only",
    primaryMetric: "acquisition_roi_per_operator_hour",
    aiRole: "operator_leverage_only",
    humanRole:
      "final_conversion_judgment_seller_trust_judgment_form_friction_judgment_content_approval_compliance_review_experiment_approval_publishing_approval_spend_decisions_execution_owner",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    schemaDecision: "not_authorized",
    storageDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    routeDecision: "not_authorized",
    uiDecision: "not_authorized",
    formDecision: "not_authorized",
    contentDecision: "not_authorized",
    metadataDecision: "not_authorized",
    analyticsDecision: "not_authorized",
    trackingDecision: "not_authorized",
    experimentDecision: "not_authorized",
    pixelDecision: "not_authorized",
    campaignDecision: "not_authorized",
    leadCreationDecision: "not_authorized",
    outreachDecision: "not_authorized",
    apiDecision: "not_authorized",
    auditDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 12B — Conversion Signal Audit",
    nextStageRecommendation: "Phase 12B — Conversion Signal Audit",
    phase11FinalLockdownReference: { flags: phase11SeoLocalAuthorityFinalLockdownFlags, rules: phase11SeoLocalAuthorityFinalLockdownRules },
    scopePurpose: phase12ConversionOptimizationPurpose,
    stopRules: phase12ConversionOptimizationStopRules,
    aiOperatorLeverageBoundary: phase12ConversionOptimizationAiBoundary,
    humanOwnershipBoundary: phase12ConversionOptimizationHumanBoundary,
    forbiddenDrift: phase12ConversionOptimizationForbiddenDrift,
    flags: phase12ConversionOptimizationScopeFlags,
  };
  assertPhase12ConversionOptimizationScopeSafe(result);
  return result;
}

export function assertPhase12ConversionOptimizationScopeSafe(result: Phase12ConversionOptimizationScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "operatorLeverageOnly", "scopeOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopePurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /implementation is authorized|route changes are authorized|UI changes are authorized|form changes are authorized|content changes are authorized|publishing is authorized|metadata changes are authorized|analytics is authorized|tracking pixels are authorized|experiments are authorized|API changes are authorized|schema changes are authorized|storage changes are authorized|lead creation beyond existing behavior is authorized|CRM mutation is authorized|outreach is authorized|provider activation is authorized|campaign activation is authorized|spend increase is authorized|offer generation is authorized|contract generation is authorized|signature requests are authorized|audit writing is authorized|Phase 13 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 12: Conversion Optimization Engine") throw new Error("Phase 12A phase must remain pinned.");
  if (result.phaseStep !== "Phase 12A — Conversion Optimization Engine Scope") throw new Error("Phase 12A step must remain pinned.");
  if (result.previousStep !== "Phase 11F — SEO & Local Authority Final Lockdown") throw new Error("Phase 12A previous step must remain Phase 11F.");
  if (result.primaryMetric !== "acquisition_roi_per_operator_hour" || result.aiRole !== "operator_leverage_only") throw new Error("Phase 12A alignment must remain pinned.");
  if (result.phaseDecision !== "scope_only") throw new Error("Phase 12A must remain scope-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 12A decisions must remain not_authorized.");
  if (result.phase11FinalLockdownReference.rules.join("|") !== phase11SeoLocalAuthorityFinalLockdownRules.join("|")) throw new Error("Phase 12A must preserve Phase 11F final lockdown reference.");
  if (unsafeTrue.length > 0) throw new Error("Phase 12A blocked flags cannot turn true.");
  if (!/No implementation, route changes/i.test(result.stopRules.join(" ")) || !/Phase 13 implementation/i.test(result.stopRules.join(" "))) throw new Error("Phase 12A stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not change routes/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 12A AI boundary is missing.");
  if (!/final conversion judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/content approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 12A human boundary is missing.");
  if (!/form changes/i.test(result.forbiddenDrift.join(" ")) || !/go-live/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 12A forbidden drift is missing.");
  if (result.recommendedNextExactStep !== "Phase 12B — Conversion Signal Audit") throw new Error("Phase 12A must hand off to Phase 12B.");
  if (unsafePattern.test(text)) throw new Error("Phase 12A wording must not imply unsafe authorization.");
}

export function getPhase12ConversionOptimizationScopeSummary() {
  const result = getPhase12ConversionOptimizationScope();
  return `${result.phase} / ${result.phaseStep}: read-only Conversion Optimization scope for highest acquisition ROI per operator hour with human-owned conversion judgment, content approval, compliance review, experiment approval, publishing approval, and spend decisions. No form changes, no UI changes, no route changes, no analytics/tracking, no experiments, no outreach, no CRM mutation, no spend increase, no Phase 13 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
