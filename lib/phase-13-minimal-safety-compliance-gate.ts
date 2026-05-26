import { phase13ManualSafetyComplianceLanes, phase13SafetyComplianceSummaryStates } from "./phase-13-manual-safety-compliance-policy";
import { phase13SafetyComplianceImplementationLanes } from "./phase-13-safety-compliance-implementation-scope";
import { phase13SafetyComplianceForbiddenDrift, phase13SafetyComplianceHumanBoundary } from "./phase-13-safety-compliance-scope";

export const phase13MinimalSafetyComplianceGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  gateOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  consentCollectionEnabled: false,
  dncBypassEnabled: false,
  optOutBypassEnabled: false,
  providerActivated: false,
  outreachEnabled: false,
  runtimeJobsEnabled: false,
  auditWritingEnabled: false,
  crmMutationEnabled: false,
  campaignEnabled: false,
  adEnabled: false,
  spendIncreaseEnabled: false,
  phase14ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export const phase13MinimalSafetyComplianceGateChecks = [
  "minimal_readonly_safety_compliance_package",
  "human_legal_compliance_review_required",
  "privacy_security_review_required",
  "consent_dnc_opt_out_review_required",
  "provider_outreach_audit_go_live_approval_required",
  "no_consent_provider_send_call_audit_mutation_boundary_required",
  "no_campaign_ad_spend_go_live_boundary_required",
  "phase_13f_lockdown_ready",
] as const;

export type Phase13MinimalSafetyComplianceGate = {
  phase: "Phase 13: Safety & Compliance Engine";
  phaseStep: "Phase 13E — Minimal Safety & Compliance Gate";
  previousStep: "Phase 13D — Safety & Compliance Implementation Scope";
  phaseDecision: "minimal_gate_only";
  implementationDecision: "not_authorized";
  consentDecision: "not_authorized";
  dncDecision: "not_authorized";
  optOutDecision: "not_authorized";
  providerDecision: "not_authorized";
  outreachDecision: "not_authorized";
  runtimeDecision: "not_authorized";
  auditDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  campaignDecision: "not_authorized";
  adDecision: "not_authorized";
  spendDecision: "not_authorized";
  recommendedNextExactStep: "Phase 13F — Safety & Compliance Final Lockdown";
  nextStageRecommendation: "Phase 13F — Safety & Compliance Final Lockdown";
  gateChecks: typeof phase13MinimalSafetyComplianceGateChecks;
  implementationLaneReferences: typeof phase13SafetyComplianceImplementationLanes;
  policyLaneReferences: typeof phase13ManualSafetyComplianceLanes;
  summaryStateReferences: typeof phase13SafetyComplianceSummaryStates;
  gateRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase13MinimalSafetyComplianceGateFlags;
};

export const phase13MinimalSafetyComplianceGateRules = [
  "Phase 13E can only decide whether a minimal read-only safety/compliance visibility package is worth carrying to final lockdown.",
  "A minimal package is only advisory if it preserves human legal/compliance review, privacy/security judgment, consent/DNC/opt-out judgment, outreach approval, provider approval, audit approval, and go-live approval boundaries.",
  "The gate cannot approve implementation, consent collection, DNC/opt-out bypass, provider activation, sending, calling, outreach, audit writing, CRM mutation, campaigns, ads, spend increases, Phase 14 implementation, or go-live.",
];

export const phase13MinimalSafetyComplianceGateStopRules = [
  "Phase 13E is a minimal gate only.",
  "No implementation, consent collection, consent persistence, consent bypass, DNC bypass, opt-out bypass, STOP handling activation, provider activation, outbound SMS, outbound email, calling, outreach, queues, runtime jobs, route/API/UI/form/schema/storage/auth/security mutations, audit writing, CRM mutation, lead mutation, campaigns, ads, spend increases, offer generation, contract generation, signature requests, Phase 14 implementation, or go-live is authorized.",
];

export const phase13MinimalSafetyComplianceGateAiBoundary = [
  "summarize whether minimal read-only safety/compliance visibility is worth final lockdown review",
  "do not approve implementation, legal/compliance decisions, consent collection, DNC/opt-out bypass, provider activation, sending, calling, outreach, audit writing, CRM mutation, campaigns, ads, spend, Phase 14 implementation, or go-live",
];

export function getPhase13MinimalSafetyComplianceGate(): Phase13MinimalSafetyComplianceGate {
  const result: Phase13MinimalSafetyComplianceGate = {
    phase: "Phase 13: Safety & Compliance Engine",
    phaseStep: "Phase 13E — Minimal Safety & Compliance Gate",
    previousStep: "Phase 13D — Safety & Compliance Implementation Scope",
    phaseDecision: "minimal_gate_only",
    implementationDecision: "not_authorized",
    consentDecision: "not_authorized",
    dncDecision: "not_authorized",
    optOutDecision: "not_authorized",
    providerDecision: "not_authorized",
    outreachDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    auditDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    campaignDecision: "not_authorized",
    adDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 13F — Safety & Compliance Final Lockdown",
    nextStageRecommendation: "Phase 13F — Safety & Compliance Final Lockdown",
    gateChecks: phase13MinimalSafetyComplianceGateChecks,
    implementationLaneReferences: phase13SafetyComplianceImplementationLanes,
    policyLaneReferences: phase13ManualSafetyComplianceLanes,
    summaryStateReferences: phase13SafetyComplianceSummaryStates,
    gateRules: phase13MinimalSafetyComplianceGateRules,
    stopRules: phase13MinimalSafetyComplianceGateStopRules,
    aiOperatorLeverageBoundary: phase13MinimalSafetyComplianceGateAiBoundary,
    humanOwnershipBoundary: phase13SafetyComplianceHumanBoundary,
    forbiddenDrift: phase13SafetyComplianceForbiddenDrift,
    flags: phase13MinimalSafetyComplianceGateFlags,
  };
  assertPhase13MinimalSafetyComplianceGateSafe(result);
  return result;
}

export function assertPhase13MinimalSafetyComplianceGateSafe(result: Phase13MinimalSafetyComplianceGate) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "gateOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.gateRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.gateChecks].flat().join(" ");
  const unsafePattern = /implementation is authorized|consent collection is authorized|DNC bypass is authorized|provider activation is authorized|outbound SMS is authorized|outreach is authorized|audit writing is authorized|CRM mutation is authorized|campaigns are authorized|ads are authorized|spend increases are authorized|Phase 14 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 13E — Minimal Safety & Compliance Gate") throw new Error("Phase 13E step must remain pinned.");
  if (result.previousStep !== "Phase 13D — Safety & Compliance Implementation Scope") throw new Error("Phase 13E previous step must remain Phase 13D.");
  if (result.phaseDecision !== "minimal_gate_only") throw new Error("Phase 13E must remain minimal-gate-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 13E decisions must remain not_authorized.");
  if (result.gateChecks.join("|") !== phase13MinimalSafetyComplianceGateChecks.join("|")) throw new Error("Phase 13E gate checks are missing.");
  if (result.implementationLaneReferences.join("|") !== phase13SafetyComplianceImplementationLanes.join("|")) throw new Error("Phase 13E implementation lane references are missing.");
  if (result.policyLaneReferences.join("|") !== phase13ManualSafetyComplianceLanes.join("|")) throw new Error("Phase 13E policy lane references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 13E blocked flags cannot turn true.");
  if (!/minimal gate only/i.test(result.stopRules.join(" "))) throw new Error("Phase 13E stop rules are missing.");
  if (!/do not approve implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 13E AI boundary is missing.");
  if (!/go-live approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 13E human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 13F — Safety & Compliance Final Lockdown") throw new Error("Phase 13E must hand off to Phase 13F.");
  if (unsafePattern.test(text)) throw new Error("Phase 13E wording must not imply unsafe authorization.");
}

export function getPhase13MinimalSafetyComplianceGateSummary() {
  const result = getPhase13MinimalSafetyComplianceGate();
  return `${result.phase} / ${result.phaseStep}: gates a minimal read-only safety/compliance package for highest acquisition ROI per operator hour with human-owned compliance judgment, legal review, privacy/security judgment, consent/DNC/opt-out judgment, provider approval, audit approval, and go-live approval. No provider activation, no sending/calling, no outreach, no audit writing, no CRM mutation, no go-live, and no Phase 14 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
