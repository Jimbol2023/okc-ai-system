import { phase8DealQualityForbiddenDrift } from "./phase-8-deal-quality-intelligence-scope";

export const phase8DealQualitySignalAuditFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  signalAuditOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  analyzerMutationEnabled: false,
  dealScorePersistenceEnabled: false,
  crmMutationEnabled: false,
  offerGenerationEnabled: false,
  contractGenerationEnabled: false,
  buyerOutreachEnabled: false,
  sellerOutreachEnabled: false,
  closingExecutionEnabled: false,
  titleContactEnabled: false,
  providerActivated: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  autonomousLeadCreationEnabled: false,
  revenueExecutionEnabled: false,
  phase9ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase8DealQualitySignalFamily =
  | "phase_7_final_lockdown_handoff"
  | "closing_readiness_contract_title_earnest_money_closing_risk"
  | "disposition_readiness_buyer_assignment_arv_repairs_spread_photos_access"
  | "revenue_pipeline_buckets_bottlenecks_missing_value_assumptions"
  | "r65_lead_quality_missing_arv_repairs_property_condition_duplicate_readiness_revenue_risk"
  | "existing_analyzer_fields_only"
  | "activation_readiness_title_repair_occupancy_seller_realism_buyer_fit";

export const phase8DealQualitySignalFamilies: Phase8DealQualitySignalFamily[] = [
  "phase_7_final_lockdown_handoff",
  "closing_readiness_contract_title_earnest_money_closing_risk",
  "disposition_readiness_buyer_assignment_arv_repairs_spread_photos_access",
  "revenue_pipeline_buckets_bottlenecks_missing_value_assumptions",
  "r65_lead_quality_missing_arv_repairs_property_condition_duplicate_readiness_revenue_risk",
  "existing_analyzer_fields_only",
  "activation_readiness_title_repair_occupancy_seller_realism_buyer_fit",
];

export type Phase8DealQualitySignalAudit = {
  phase: "Phase 8: Deal Quality Intelligence";
  phaseStep: "Phase 8B — Deal Quality Signal Audit";
  previousStep: "Phase 8A — Deal Quality Intelligence Scope";
  phaseDecision: "signal_audit_only";
  implementationDecision: "not_authorized";
  analyzerDecision: "not_authorized";
  scoreDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  offerDecision: "not_authorized";
  contractDecision: "not_authorized";
  buyerDecision: "not_authorized";
  sellerDecision: "not_authorized";
  closingDecision: "not_authorized";
  recommendedNextExactStep: "Phase 8C — Manual Deal Quality Review Policy";
  nextStageRecommendation: "Phase 8C — Manual Deal Quality Review Policy";
  signalFamilies: Phase8DealQualitySignalFamily[];
  auditPurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase8DealQualitySignalAuditFlags;
};

export const phase8DealQualitySignalAuditPurpose = [
  "Audit existing deal-quality signal families without mutating analyzer values, deal scores, CRM records, buyer records, closing records, reports, tasks, queues, notifications, audit logs, or storage.",
  "Reference closing readiness, disposition readiness, revenue pipeline, R65 lead quality, existing analyzer fields, and activation-readiness deal-quality evidence only.",
  "Support highest acquisition ROI per operator hour by making valuation uncertainty, repair uncertainty, title/closing risk, occupancy/access gaps, seller realism, buyer fit, spread assumptions, and bottlenecks easier for humans to review.",
];

export const phase8DealQualitySignalAuditStopRules = [
  "Phase 8B audits existing deal-quality signal families only.",
  "No property fact invention, valuation fact invention, repair fact invention, analyzer mutation, deal score persistence, CRM mutation, offer generation, contract generation, buyer outreach, seller outreach, closing execution, title contact, provider activation, scraping, skip tracing, autonomous lead creation, revenue execution, Phase 9 implementation, or go-live is authorized.",
];

export const phase8DealQualitySignalAuditAiBoundary = [
  "summarize existing deal-quality signals for human review only",
  "flag valuation repair title closing occupancy access seller realism buyer fit spread and bottleneck visibility",
  "do not invent property valuation or repair facts",
  "do not mutate analyzer deal score CRM buyer or closing records",
  "do not generate offers contracts assignments or closing documents",
  "do not contact sellers buyers title companies or providers",
  "do not scrape or skip trace",
  "do not execute revenue actions",
];

export const phase8DealQualitySignalAuditHumanBoundary = [
  "deal quality judgment",
  "property fact verification",
  "valuation judgment",
  "repair judgment",
  "title review",
  "occupancy review",
  "seller realism review",
  "buyer-fit judgment",
  "offer contract closing decisions",
  "future implementation approval",
];

export function getPhase8DealQualitySignalAudit(): Phase8DealQualitySignalAudit {
  const result: Phase8DealQualitySignalAudit = {
    phase: "Phase 8: Deal Quality Intelligence",
    phaseStep: "Phase 8B — Deal Quality Signal Audit",
    previousStep: "Phase 8A — Deal Quality Intelligence Scope",
    phaseDecision: "signal_audit_only",
    implementationDecision: "not_authorized",
    analyzerDecision: "not_authorized",
    scoreDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    offerDecision: "not_authorized",
    contractDecision: "not_authorized",
    buyerDecision: "not_authorized",
    sellerDecision: "not_authorized",
    closingDecision: "not_authorized",
    recommendedNextExactStep: "Phase 8C — Manual Deal Quality Review Policy",
    nextStageRecommendation: "Phase 8C — Manual Deal Quality Review Policy",
    signalFamilies: phase8DealQualitySignalFamilies,
    auditPurpose: phase8DealQualitySignalAuditPurpose,
    stopRules: phase8DealQualitySignalAuditStopRules,
    aiOperatorLeverageBoundary: phase8DealQualitySignalAuditAiBoundary,
    humanOwnershipBoundary: phase8DealQualitySignalAuditHumanBoundary,
    forbiddenDrift: phase8DealQualityForbiddenDrift,
    flags: phase8DealQualitySignalAuditFlags,
  };
  assertPhase8DealQualitySignalAuditSafe(result);
  return result;
}

export function assertPhase8DealQualitySignalAuditSafe(result: Phase8DealQualitySignalAudit) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "signalAuditOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.auditPurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.signalFamilies].flat().join(" ");
  const unsafePattern = /property fact invention is authorized|valuation fact invention is authorized|repair fact invention is authorized|analyzer mutation is authorized|deal score persistence is authorized|CRM mutation is authorized|offer generation is authorized|contract generation is authorized|buyer outreach is authorized|seller outreach is authorized|closing execution is authorized|title contact is authorized|provider activation is authorized|scraping is authorized|skip tracing is authorized|autonomous lead creation is authorized|revenue execution is authorized|Phase 9 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 8B — Deal Quality Signal Audit") throw new Error("Phase 8B step must remain pinned.");
  if (result.previousStep !== "Phase 8A — Deal Quality Intelligence Scope") throw new Error("Phase 8B previous step must remain Phase 8A.");
  if (result.phaseDecision !== "signal_audit_only") throw new Error("Phase 8B must remain signal-audit-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 8B decisions must remain not_authorized.");
  if (result.signalFamilies.join("|") !== phase8DealQualitySignalFamilies.join("|")) throw new Error("Phase 8B must include all deal-quality signal families.");
  if (unsafeTrue.length > 0) throw new Error("Phase 8B blocked flags cannot turn true.");
  if (!/closing_readiness/i.test(result.signalFamilies.join(" ")) || !/existing_analyzer_fields_only/i.test(result.signalFamilies.join(" "))) throw new Error("Phase 8B repo-grounded signals are missing.");
  if (!/audits existing deal-quality signal families only/i.test(result.stopRules.join(" "))) throw new Error("Phase 8B stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not invent property/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 8B AI boundary is missing.");
  if (!/deal quality judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/property fact verification/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 8B human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 8C — Manual Deal Quality Review Policy") throw new Error("Phase 8B must hand off to Phase 8C.");
  if (unsafePattern.test(text)) throw new Error("Phase 8B wording must not imply unsafe authorization.");
}

export function getPhase8DealQualitySignalAuditSummary() {
  const result = getPhase8DealQualitySignalAudit();
  return `${result.phase} / ${result.phaseStep}: audits existing closing readiness, disposition readiness, revenue pipeline, R65 lead quality, analyzer field, and activation-readiness deal-quality evidence signals for highest acquisition ROI per operator hour. Human-owned deal quality judgment and property fact verification remain required. No invented property facts, no analyzer mutation, no CRM mutation, no outreach, no offer or contract generation, no closing execution, no Phase 9 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
