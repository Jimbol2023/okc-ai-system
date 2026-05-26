import { sellerBenefits, sellerProcess, trustPoints } from "./content/homepage";
import {
  phase12ConversionOptimizationForbiddenDrift,
  phase12ConversionOptimizationHumanBoundary,
} from "./phase-12-conversion-optimization-scope";
import { leadIntakeSchema } from "./validations/lead";
import { z4ManualConversionStages, z4ManualConversionStageMetadata } from "./z4-manual-conversion-policy";
import { createZ4ManualConversionReadinessReview } from "./z4-manual-conversion-readiness";

export const phase12ConversionSignalAuditFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  signalAuditOnly: true,
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

export type Phase12ConversionSignalFamily =
  | "phase_11_final_lockdown_handoff"
  | "public_homepage_contact_sell_your_house_public_layout_lead_capture_form_homepage_content"
  | "lead_intake_schema_source_tracking_validation_submit_success_phone_cta"
  | "seller_trust_value_copy_oklahoma_city_no_pressure_as_is_no_repairs_no_commissions_simple_process_timeline"
  | "z4_manual_conversion_stages_readiness_blocked_execution_boundaries"
  | "follow_up_conversion_helper_concepts_advisory_only_no_engine_analytics_ab_testing_tracking";

export const phase12ConversionSignalFamilies: Phase12ConversionSignalFamily[] = [
  "phase_11_final_lockdown_handoff",
  "public_homepage_contact_sell_your_house_public_layout_lead_capture_form_homepage_content",
  "lead_intake_schema_source_tracking_validation_submit_success_phone_cta",
  "seller_trust_value_copy_oklahoma_city_no_pressure_as_is_no_repairs_no_commissions_simple_process_timeline",
  "z4_manual_conversion_stages_readiness_blocked_execution_boundaries",
  "follow_up_conversion_helper_concepts_advisory_only_no_engine_analytics_ab_testing_tracking",
];

export type Phase12ConversionSignalAudit = {
  phase: "Phase 12: Conversion Optimization Engine";
  phaseStep: "Phase 12B — Conversion Signal Audit";
  previousStep: "Phase 12A — Conversion Optimization Engine Scope";
  phaseDecision: "signal_audit_only";
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
  auditDecision: "not_authorized";
  recommendedNextExactStep: "Phase 12C — Manual Conversion Optimization Advisory Policy";
  nextStageRecommendation: "Phase 12C — Manual Conversion Optimization Advisory Policy";
  signalFamilies: Phase12ConversionSignalFamily[];
  groundedReferences: {
    publicSurfaces: string[];
    leadCaptureSurface: "components/forms/lead-capture-form.tsx";
    leadIntakeSchema: typeof leadIntakeSchema;
    homepageContent: {
      sellerBenefits: typeof sellerBenefits;
      sellerProcess: typeof sellerProcess;
      trustPoints: typeof trustPoints;
    };
    z4Stages: typeof z4ManualConversionStages;
    z4StageMetadata: typeof z4ManualConversionStageMetadata;
    z4ReadinessReview: ReturnType<typeof createZ4ManualConversionReadinessReview>;
  };
  auditPurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase12ConversionSignalAuditFlags;
};

export const phase12ConversionSignalAuditPurpose = [
  "Audit existing conversion signal families without changing routes, UI, forms, content, metadata, APIs, schema, storage, analytics, tracking, experiments, campaigns, lead records, CRM records, outreach, audit logs, or publishing behavior.",
  "Reference public pages, LeadCaptureForm, leadIntakeSchema, source tracking, validation/submission/success states, phone CTA, homepage trust copy, and Z4 manual conversion doctrine as existing signals only.",
  "Support highest acquisition ROI per operator hour by making form friction, CTA clarity, seller trust, validation clarity, success-state expectations, phone CTA visibility, and conversion-path continuity easier for humans to review.",
];

export const phase12ConversionSignalAuditStopRules = [
  "Phase 12B audits existing conversion signal families only.",
  "No implementation, route changes, UI changes, form changes, content changes, publishing, metadata changes, analytics, tracking pixels, event tracking, rank tracking, A/B tests, experiments, API changes, schema changes, storage changes, lead creation beyond existing behavior, CRM mutation, outreach, calling, SMS sending, email sending, provider activation, campaigns, ads, spend increases, offer generation, contract generation, signature requests, audit writing, Phase 13 implementation, or go-live is authorized.",
];

export const phase12ConversionSignalAuditAiBoundary = [
  "summarize existing conversion signals for human review only",
  "flag lead form friction, source tracking, seller trust messages, CTA clarity, no-pressure copy, mobile conversion visibility, validation clarity, success-state expectations, phone CTA visibility, and Z4 blocked conversion execution boundaries",
  "do not change forms, UI, routes, content, metadata, APIs, schema, storage, analytics, tracking, pixels, experiments, campaigns, lead creation, CRM records, outreach, offers, contracts, signatures, audit logs, or go-live",
];

export function getPhase12ConversionSignalAudit(): Phase12ConversionSignalAudit {
  const result: Phase12ConversionSignalAudit = {
    phase: "Phase 12: Conversion Optimization Engine",
    phaseStep: "Phase 12B — Conversion Signal Audit",
    previousStep: "Phase 12A — Conversion Optimization Engine Scope",
    phaseDecision: "signal_audit_only",
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
    auditDecision: "not_authorized",
    recommendedNextExactStep: "Phase 12C — Manual Conversion Optimization Advisory Policy",
    nextStageRecommendation: "Phase 12C — Manual Conversion Optimization Advisory Policy",
    signalFamilies: phase12ConversionSignalFamilies,
    groundedReferences: {
      publicSurfaces: ["/", "/contact", "/sell-your-house", "app/(public)/layout.tsx", "lib/content/homepage.ts"],
      leadCaptureSurface: "components/forms/lead-capture-form.tsx",
      leadIntakeSchema,
      homepageContent: { sellerBenefits, sellerProcess, trustPoints },
      z4Stages: z4ManualConversionStages,
      z4StageMetadata: z4ManualConversionStageMetadata,
      z4ReadinessReview: createZ4ManualConversionReadinessReview(),
    },
    auditPurpose: phase12ConversionSignalAuditPurpose,
    stopRules: phase12ConversionSignalAuditStopRules,
    aiOperatorLeverageBoundary: phase12ConversionSignalAuditAiBoundary,
    humanOwnershipBoundary: phase12ConversionOptimizationHumanBoundary,
    forbiddenDrift: phase12ConversionOptimizationForbiddenDrift,
    flags: phase12ConversionSignalAuditFlags,
  };
  assertPhase12ConversionSignalAuditSafe(result);
  return result;
}

export function assertPhase12ConversionSignalAuditSafe(result: Phase12ConversionSignalAudit) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "signalAuditOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.auditPurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.signalFamilies].flat().join(" ");
  const unsafePattern = /form changes are authorized|UI changes are authorized|content changes are authorized|metadata changes are authorized|analytics is authorized|tracking pixels are authorized|experiments are authorized|API changes are authorized|schema changes are authorized|storage changes are authorized|lead creation beyond existing behavior is authorized|CRM mutation is authorized|campaigns are authorized|spend increases are authorized|audit writing is authorized|Phase 13 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 12B — Conversion Signal Audit") throw new Error("Phase 12B step must remain pinned.");
  if (result.previousStep !== "Phase 12A — Conversion Optimization Engine Scope") throw new Error("Phase 12B previous step must remain Phase 12A.");
  if (result.phaseDecision !== "signal_audit_only") throw new Error("Phase 12B must remain signal-audit-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 12B decisions must remain not_authorized.");
  if (result.signalFamilies.join("|") !== phase12ConversionSignalFamilies.join("|")) throw new Error("Phase 12B must include all conversion signal families.");
  if (unsafeTrue.length > 0) throw new Error("Phase 12B blocked flags cannot turn true.");
  if (!/lead_intake_schema_source_tracking/i.test(result.signalFamilies.join(" ")) || !/z4_manual_conversion/i.test(result.signalFamilies.join(" "))) throw new Error("Phase 12B repo-grounded signals are missing.");
  if (!/audits existing conversion signal families only/i.test(result.stopRules.join(" "))) throw new Error("Phase 12B stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not change forms/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 12B AI boundary is missing.");
  if (!/final conversion judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/compliance review/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 12B human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 12C — Manual Conversion Optimization Advisory Policy") throw new Error("Phase 12B must hand off to Phase 12C.");
  if (unsafePattern.test(text)) throw new Error("Phase 12B wording must not imply unsafe authorization.");
}

export function getPhase12ConversionSignalAuditSummary() {
  const result = getPhase12ConversionSignalAudit();
  return `${result.phase} / ${result.phaseStep}: audits existing public conversion surfaces, LeadCaptureForm, leadIntakeSchema, source tracking, validation states, success states, phone CTA, trust copy, and Z4 manual conversion doctrine for highest acquisition ROI per operator hour. Human-owned conversion judgment, content approval, and compliance review remain required. No form changes, no UI changes, no analytics/tracking, no experiments, no outreach, no CRM mutation, no spend increase, no Phase 13 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
