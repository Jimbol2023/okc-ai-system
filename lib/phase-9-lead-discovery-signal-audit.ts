import { phase9LeadDiscoveryForbiddenDrift } from "./phase-9-ai-assisted-lead-discovery-scope";

export const phase9LeadDiscoverySignalAuditFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  signalAuditOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  leadCreationEnabled: false,
  importMutationEnabled: false,
  sourceMutationEnabled: false,
  crmMutationEnabled: false,
  providerActivated: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  externalLookupEnabled: false,
  publicRecordConnectorEnabled: false,
  mapAutomationEnabled: false,
  streetViewAutomationEnabled: false,
  gpsSurveillanceEnabled: false,
  campaignEnabled: false,
  spendIncreaseEnabled: false,
  phase10ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase9LeadDiscoverySignalFamily =
  | "phase_8_final_lockdown_handoff"
  | "lead_source_taxonomy_and_aliases"
  | "list_importer_preview_resolution_readiness_duplicates_headers_blockers_cleanup"
  | "source_quality_intelligence_lanes_and_forbidden_drift"
  | "acquisition_bottleneck_import_source_public_record_referral_operator_d4d_comparison"
  | "activation_evidence_source_provenance_legal_manual_no_scraping_no_skip_tracing"
  | "manual_d4d_planning_readiness_future_phase_10_handoff_only";

export const phase9LeadDiscoverySignalFamilies: Phase9LeadDiscoverySignalFamily[] = [
  "phase_8_final_lockdown_handoff",
  "lead_source_taxonomy_and_aliases",
  "list_importer_preview_resolution_readiness_duplicates_headers_blockers_cleanup",
  "source_quality_intelligence_lanes_and_forbidden_drift",
  "acquisition_bottleneck_import_source_public_record_referral_operator_d4d_comparison",
  "activation_evidence_source_provenance_legal_manual_no_scraping_no_skip_tracing",
  "manual_d4d_planning_readiness_future_phase_10_handoff_only",
];

export type Phase9LeadDiscoverySignalAudit = {
  phase: "Phase 9: AI-Assisted Lead Discovery";
  phaseStep: "Phase 9B — Lead Discovery Signal Audit";
  previousStep: "Phase 9A — AI-Assisted Lead Discovery Scope";
  phaseDecision: "signal_audit_only";
  implementationDecision: "not_authorized";
  importDecision: "not_authorized";
  sourceDecision: "not_authorized";
  leadCreationDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  providerDecision: "not_authorized";
  scrapingDecision: "not_authorized";
  skipTracingDecision: "not_authorized";
  externalLookupDecision: "not_authorized";
  mapDecision: "not_authorized";
  gpsDecision: "not_authorized";
  spendDecision: "not_authorized";
  campaignDecision: "not_authorized";
  recommendedNextExactStep: "Phase 9C — Manual Lead Discovery Advisory Policy";
  nextStageRecommendation: "Phase 9C — Manual Lead Discovery Advisory Policy";
  signalFamilies: Phase9LeadDiscoverySignalFamily[];
  auditPurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase9LeadDiscoverySignalAuditFlags;
};

export const phase9LeadDiscoverySignalAuditPurpose = [
  "Audit existing lead-discovery signal families without creating leads, mutating imports, mutating sources, mutating CRM records, activating providers, scraping, skip tracing, external lookups, maps, GPS, campaigns, spend, queues, or assignments.",
  "Reference lead-source taxonomy, list-importer preview data, source-quality intelligence, acquisition bottleneck reassessment, activation evidence boundaries, and manual D4D planning/readiness as future Phase 10 handoff only.",
  "Support highest acquisition ROI per operator hour by making source provenance, legal-source clarity, import quality, cleanup burden, duplicate burden, and operator throughput easier for humans to review.",
];

export const phase9LeadDiscoverySignalAuditStopRules = [
  "Phase 9B audits existing lead-discovery signal families only.",
  "No lead creation, import mutation, CRM mutation, source mutation, provider activation, scraping, skip tracing, external lookup, public-record connector activation, map automation, Street View automation, GPS surveillance, owner lookup, seller outreach, buyer outreach, campaign activation, spend increase, autonomous qualification, Phase 10 implementation, or go-live is authorized.",
];

export const phase9LeadDiscoverySignalAuditAiBoundary = [
  "summarize existing lead-discovery signals for human review only",
  "flag source provenance legal-source clarity import quality source quality duplicate cleanup property-first cleanup public-record export referral and operator-throughput visibility",
  "do not create leads or mutate imports sources CRM records lead records or storage",
  "do not scrape skip trace run external lookups activate public-record connectors automate maps use Street View automation or perform GPS surveillance",
  "do not contact sellers buyers owners or providers",
  "do not launch campaigns increase spend or autonomously qualify leads",
];

export const phase9LeadDiscoverySignalAuditHumanBoundary = [
  "source judgment",
  "legal-source verification",
  "source provenance approval",
  "lead acceptance decisions",
  "lead rejection decisions",
  "property fact verification",
  "seller communication",
  "spend decisions",
  "future implementation approval",
];

export function getPhase9LeadDiscoverySignalAudit(): Phase9LeadDiscoverySignalAudit {
  const result: Phase9LeadDiscoverySignalAudit = {
    phase: "Phase 9: AI-Assisted Lead Discovery",
    phaseStep: "Phase 9B — Lead Discovery Signal Audit",
    previousStep: "Phase 9A — AI-Assisted Lead Discovery Scope",
    phaseDecision: "signal_audit_only",
    implementationDecision: "not_authorized",
    importDecision: "not_authorized",
    sourceDecision: "not_authorized",
    leadCreationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    providerDecision: "not_authorized",
    scrapingDecision: "not_authorized",
    skipTracingDecision: "not_authorized",
    externalLookupDecision: "not_authorized",
    mapDecision: "not_authorized",
    gpsDecision: "not_authorized",
    spendDecision: "not_authorized",
    campaignDecision: "not_authorized",
    recommendedNextExactStep: "Phase 9C — Manual Lead Discovery Advisory Policy",
    nextStageRecommendation: "Phase 9C — Manual Lead Discovery Advisory Policy",
    signalFamilies: phase9LeadDiscoverySignalFamilies,
    auditPurpose: phase9LeadDiscoverySignalAuditPurpose,
    stopRules: phase9LeadDiscoverySignalAuditStopRules,
    aiOperatorLeverageBoundary: phase9LeadDiscoverySignalAuditAiBoundary,
    humanOwnershipBoundary: phase9LeadDiscoverySignalAuditHumanBoundary,
    forbiddenDrift: phase9LeadDiscoveryForbiddenDrift,
    flags: phase9LeadDiscoverySignalAuditFlags,
  };
  assertPhase9LeadDiscoverySignalAuditSafe(result);
  return result;
}

export function assertPhase9LeadDiscoverySignalAuditSafe(result: Phase9LeadDiscoverySignalAudit) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "signalAuditOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.auditPurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.signalFamilies].flat().join(" ");
  const unsafePattern = /lead creation is authorized|import mutation is authorized|CRM mutation is authorized|source mutation is authorized|provider activation is authorized|scraping is authorized|skip tracing is authorized|external lookup is authorized|public-record connector activation is authorized|map automation is authorized|Street View automation is authorized|GPS surveillance is authorized|owner lookup is authorized|seller outreach is authorized|buyer outreach is authorized|campaign activation is authorized|spend increase is authorized|autonomous qualification is authorized|Phase 10 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 9B — Lead Discovery Signal Audit") throw new Error("Phase 9B step must remain pinned.");
  if (result.previousStep !== "Phase 9A — AI-Assisted Lead Discovery Scope") throw new Error("Phase 9B previous step must remain Phase 9A.");
  if (result.phaseDecision !== "signal_audit_only") throw new Error("Phase 9B must remain signal-audit-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 9B decisions must remain not_authorized.");
  if (result.signalFamilies.join("|") !== phase9LeadDiscoverySignalFamilies.join("|")) throw new Error("Phase 9B must include all lead-discovery signal families.");
  if (unsafeTrue.length > 0) throw new Error("Phase 9B blocked flags cannot turn true.");
  if (!/lead_source_taxonomy/i.test(result.signalFamilies.join(" ")) || !/list_importer_preview/i.test(result.signalFamilies.join(" "))) throw new Error("Phase 9B repo-grounded signals are missing.");
  if (!/audits existing lead-discovery signal families only/i.test(result.stopRules.join(" "))) throw new Error("Phase 9B stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not create leads/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 9B AI boundary is missing.");
  if (!/source judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/legal-source verification/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 9B human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 9C — Manual Lead Discovery Advisory Policy") throw new Error("Phase 9B must hand off to Phase 9C.");
  if (unsafePattern.test(text)) throw new Error("Phase 9B wording must not imply unsafe authorization.");
}

export function getPhase9LeadDiscoverySignalAuditSummary() {
  const result = getPhase9LeadDiscoverySignalAudit();
  return `${result.phase} / ${result.phaseStep}: audits existing lead-source, list-importer, source-quality, acquisition-bottleneck, activation-evidence, and manual D4D planning signals for highest acquisition ROI per operator hour. Human-owned source judgment, legal-source verification, and source provenance remain required. No scraping, no skip tracing, no autonomous lead creation, no outreach, no CRM mutation, no spend increase, no Phase 10 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
