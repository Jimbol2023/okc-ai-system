import {
  phase10VirtualD4dForbiddenDrift,
  phase10VirtualD4dHumanBoundary,
} from "./phase-10-virtual-d4d-intelligence-scope";
import {
  r75AllowedConcepts,
  r75AuditBoundary,
  r75DangerousWordingPatterns,
  r75GovernanceBoundary,
  r75InclusiveAccessibility,
  r75ScopeFlags,
} from "./r75-virtual-driving-for-dollars-intelligence-scope-contract";
import { r75DriftRiskCategories, r75DriftFlags } from "./r75-virtual-d4d-drift-data-sourcing-risk-audit";
import {
  manualD4dCaptureFields,
  manualD4dCaptureReviewLanes,
  forbiddenManualCaptureDrift,
} from "./manual-d4d-property-capture";

export const phase10VirtualD4dSignalAuditFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  signalAuditOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  scrapingEnabled: false,
  mapCrawlingEnabled: false,
  mapAutomationEnabled: false,
  streetViewAutomationEnabled: false,
  gpsSurveillanceEnabled: false,
  locationTrackingEnabled: false,
  externalApiEnabled: false,
  fetchNetworkEnabled: false,
  ownerLookupEnabled: false,
  ownerContactEnabled: false,
  skipTracingEnabled: false,
  providerActivated: false,
  leadCreationEnabled: false,
  importMutationEnabled: false,
  sourceMutationEnabled: false,
  crmMutationEnabled: false,
  persistenceEnabled: false,
  auditWritingEnabled: false,
  campaignEnabled: false,
  spendIncreaseEnabled: false,
  phase11ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase10VirtualD4dSignalFamily =
  | "phase_9_final_lockdown_handoff"
  | "r75_scope_allowed_concepts_governance_dangerous_wording_audit_accessibility_blocked_flags"
  | "r75_drift_data_sourcing_risk_categories"
  | "r75_readonly_ui_safety_final_lockdown_no_scraping_no_map_no_owner_contact_doctrine"
  | "manual_d4d_property_capture_fields_lanes_provenance_distress_duplicates_cleanup"
  | "manual_d4d_capture_planning_readiness_gate_future_manual_review_only"
  | "activation_evidence_virtual_d4d_neighborhood_distress_lead_approval_buyer_demand_dnc_public_private_no_scraping";

export const phase10VirtualD4dSignalFamilies: Phase10VirtualD4dSignalFamily[] = [
  "phase_9_final_lockdown_handoff",
  "r75_scope_allowed_concepts_governance_dangerous_wording_audit_accessibility_blocked_flags",
  "r75_drift_data_sourcing_risk_categories",
  "r75_readonly_ui_safety_final_lockdown_no_scraping_no_map_no_owner_contact_doctrine",
  "manual_d4d_property_capture_fields_lanes_provenance_distress_duplicates_cleanup",
  "manual_d4d_capture_planning_readiness_gate_future_manual_review_only",
  "activation_evidence_virtual_d4d_neighborhood_distress_lead_approval_buyer_demand_dnc_public_private_no_scraping",
];

export type Phase10VirtualD4dSignalAudit = {
  phase: "Phase 10: Virtual Driving for Dollars Intelligence Engine";
  phaseStep: "Phase 10B — Virtual D4D Signal Audit";
  previousStep: "Phase 10A — Virtual Driving for Dollars Intelligence Scope";
  phaseDecision: "signal_audit_only";
  implementationDecision: "not_authorized";
  scrapingDecision: "not_authorized";
  mapDecision: "not_authorized";
  gpsDecision: "not_authorized";
  locationDecision: "not_authorized";
  streetViewDecision: "not_authorized";
  externalApiDecision: "not_authorized";
  fetchNetworkDecision: "not_authorized";
  ownerContactDecision: "not_authorized";
  skipTracingDecision: "not_authorized";
  providerDecision: "not_authorized";
  leadCreationDecision: "not_authorized";
  importDecision: "not_authorized";
  sourceDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  campaignDecision: "not_authorized";
  spendDecision: "not_authorized";
  recommendedNextExactStep: "Phase 10C — Manual Virtual D4D Advisory Policy";
  nextStageRecommendation: "Phase 10C — Manual Virtual D4D Advisory Policy";
  signalFamilies: Phase10VirtualD4dSignalFamily[];
  groundedReferences: {
    r75AllowedConcepts: typeof r75AllowedConcepts;
    r75GovernanceBoundary: typeof r75GovernanceBoundary;
    r75DangerousWordingPatterns: typeof r75DangerousWordingPatterns;
    r75AuditBoundary: typeof r75AuditBoundary;
    r75InclusiveAccessibility: typeof r75InclusiveAccessibility;
    r75ScopeFlags: typeof r75ScopeFlags;
    r75DriftRiskCategories: typeof r75DriftRiskCategories;
    r75DriftFlags: typeof r75DriftFlags;
    manualD4dCaptureFields: typeof manualD4dCaptureFields;
    manualD4dCaptureReviewLanes: typeof manualD4dCaptureReviewLanes;
    forbiddenManualCaptureDrift: typeof forbiddenManualCaptureDrift;
  };
  auditPurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase10VirtualD4dSignalAuditFlags;
};

export const phase10VirtualD4dSignalAuditPurpose = [
  "Audit existing Virtual D4D signal families without scraping, map crawling, map automation, Street View automation, GPS surveillance, location tracking, external API behavior, fetch/network behavior, owner lookup, owner contact, lead creation, import/source/CRM mutation, persistence, audit writing, campaigns, or spend changes.",
  "Reference R75 Virtual D4D scope, drift risk, readonly UI, safety, final lockdown, manual D4D capture, manual D4D planning/readiness/gate, and activation evidence concepts as existing doctrine only.",
  "Support highest acquisition ROI per operator hour by making neighborhood review, unverified distress signals, source provenance, manual capture shape, duplicate overlap, property-first cleanup, buyer-demand fit, and operator focus easier for humans to review.",
];

export const phase10VirtualD4dSignalAuditStopRules = [
  "Phase 10B audits existing Virtual D4D signal families only.",
  "No scraping, map crawling, map automation, Street View automation, GPS surveillance, location tracking, external API behavior, fetch/network behavior, owner lookup, owner contact, skip tracing, provider activation, lead creation, import mutation, source mutation, CRM mutation, persistence, audit writing, campaign activation, spend increase, autonomous acquisition, autonomous qualification, Phase 11 implementation, or go-live is authorized.",
];

export const phase10VirtualD4dSignalAuditAiBoundary = [
  "summarize existing Virtual D4D signals for human review only",
  "flag R75 no-scraping no-map no-owner-contact doctrine, manual capture shape, provenance, distress-signal visibility, duplicate overlap, property-first cleanup, buyer-demand fit, and operator-route focus",
  "do not invent property facts, verify distress signals, scrape, crawl maps, automate maps, automate Street View, track GPS/location, call external APIs, fetch network data, look up owners, contact owners, create leads, mutate imports sources CRM records, persist data, write audits, launch campaigns, or increase spend",
];

export function getPhase10VirtualD4dSignalAudit(): Phase10VirtualD4dSignalAudit {
  const result: Phase10VirtualD4dSignalAudit = {
    phase: "Phase 10: Virtual Driving for Dollars Intelligence Engine",
    phaseStep: "Phase 10B — Virtual D4D Signal Audit",
    previousStep: "Phase 10A — Virtual Driving for Dollars Intelligence Scope",
    phaseDecision: "signal_audit_only",
    implementationDecision: "not_authorized",
    scrapingDecision: "not_authorized",
    mapDecision: "not_authorized",
    gpsDecision: "not_authorized",
    locationDecision: "not_authorized",
    streetViewDecision: "not_authorized",
    externalApiDecision: "not_authorized",
    fetchNetworkDecision: "not_authorized",
    ownerContactDecision: "not_authorized",
    skipTracingDecision: "not_authorized",
    providerDecision: "not_authorized",
    leadCreationDecision: "not_authorized",
    importDecision: "not_authorized",
    sourceDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    campaignDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 10C — Manual Virtual D4D Advisory Policy",
    nextStageRecommendation: "Phase 10C — Manual Virtual D4D Advisory Policy",
    signalFamilies: phase10VirtualD4dSignalFamilies,
    groundedReferences: {
      r75AllowedConcepts,
      r75GovernanceBoundary,
      r75DangerousWordingPatterns,
      r75AuditBoundary,
      r75InclusiveAccessibility,
      r75ScopeFlags,
      r75DriftRiskCategories,
      r75DriftFlags,
      manualD4dCaptureFields,
      manualD4dCaptureReviewLanes,
      forbiddenManualCaptureDrift,
    },
    auditPurpose: phase10VirtualD4dSignalAuditPurpose,
    stopRules: phase10VirtualD4dSignalAuditStopRules,
    aiOperatorLeverageBoundary: phase10VirtualD4dSignalAuditAiBoundary,
    humanOwnershipBoundary: phase10VirtualD4dHumanBoundary,
    forbiddenDrift: phase10VirtualD4dForbiddenDrift,
    flags: phase10VirtualD4dSignalAuditFlags,
  };
  assertPhase10VirtualD4dSignalAuditSafe(result);
  return result;
}

export function assertPhase10VirtualD4dSignalAuditSafe(result: Phase10VirtualD4dSignalAudit) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "signalAuditOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.auditPurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.signalFamilies].flat().join(" ");
  const unsafePattern = /scraping is authorized|map crawling is authorized|map automation is authorized|Street View automation is authorized|GPS surveillance is authorized|location tracking is authorized|external API behavior is authorized|fetch\/network behavior is authorized|owner lookup is authorized|owner contact is authorized|lead creation is authorized|CRM mutation is authorized|campaign activation is authorized|spend increase is authorized|Phase 11 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 10B — Virtual D4D Signal Audit") throw new Error("Phase 10B step must remain pinned.");
  if (result.previousStep !== "Phase 10A — Virtual Driving for Dollars Intelligence Scope") throw new Error("Phase 10B previous step must remain Phase 10A.");
  if (result.phaseDecision !== "signal_audit_only") throw new Error("Phase 10B must remain signal-audit-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 10B decisions must remain not_authorized.");
  if (result.signalFamilies.join("|") !== phase10VirtualD4dSignalFamilies.join("|")) throw new Error("Phase 10B must include all Virtual D4D signal families.");
  if (unsafeTrue.length > 0) throw new Error("Phase 10B blocked flags cannot turn true.");
  if (!/r75_scope_allowed_concepts/i.test(result.signalFamilies.join(" ")) || !/manual_d4d_property_capture/i.test(result.signalFamilies.join(" "))) throw new Error("Phase 10B repo-grounded signals are missing.");
  if (!/audits existing Virtual D4D signal families only/i.test(result.stopRules.join(" "))) throw new Error("Phase 10B stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not invent property facts/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 10B AI boundary is missing.");
  if (!/final neighborhood judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/legal-source verification/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 10B human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 10C — Manual Virtual D4D Advisory Policy") throw new Error("Phase 10B must hand off to Phase 10C.");
  if (unsafePattern.test(text)) throw new Error("Phase 10B wording must not imply unsafe authorization.");
}

export function getPhase10VirtualD4dSignalAuditSummary() {
  const result = getPhase10VirtualD4dSignalAudit();
  return `${result.phase} / ${result.phaseStep}: audits existing R75, drift-risk, readonly UI, safety, final-lockdown, manual D4D capture, manual readiness, and activation-evidence signals for highest acquisition ROI per operator hour. Human-owned neighborhood judgment, property fact verification, distress-signal verification, and legal-source verification remain required. No scraping, no map crawling, no Street View automation, no GPS surveillance, no owner contact, no autonomous lead creation, no outreach, no CRM mutation, no spend increase, no Phase 11 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
