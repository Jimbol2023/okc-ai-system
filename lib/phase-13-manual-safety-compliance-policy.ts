import { phase13SafetyComplianceSignalFamilies } from "./phase-13-safety-compliance-signal-audit";
import { phase13SafetyComplianceForbiddenDrift, phase13SafetyComplianceHumanBoundary } from "./phase-13-safety-compliance-scope";

export const phase13ManualSafetyCompliancePolicyFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  policyOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  consentCollectionEnabled: false,
  consentPersistenceEnabled: false,
  consentBypassEnabled: false,
  dncBypassEnabled: false,
  optOutBypassEnabled: false,
  providerActivated: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  callingEnabled: false,
  outreachEnabled: false,
  auditWritingEnabled: false,
  crmMutationEnabled: false,
  campaignEnabled: false,
  spendIncreaseEnabled: false,
  phase14ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export const phase13ManualSafetyComplianceLanes = [
  "stop_legal_and_compliance_first",
  "consent_evidence_review",
  "dnc_opt_out_hard_blocker_review",
  "stop_revocation_expectation_review",
  "sender_identity_truthfulness_review",
  "privacy_security_review",
  "auth_access_control_review",
  "outreach_preflight_review",
  "provider_isolation_review",
  "human_approval_separation_review",
  "auditability_visibility_review",
  "defer_until_legal_human_approved",
] as const;

export const phase13SafetyComplianceSummaryStates = [
  "safety_compliance_blocked",
  "legal_review_required",
  "consent_evidence_missing",
  "dnc_or_opt_out_blocked",
  "sender_policy_review_only",
  "privacy_security_review_required",
  "auth_access_review_required",
  "outreach_preflight_review_only",
  "provider_isolation_required",
  "approval_separation_visible",
  "auditability_review_only",
  "not_ready",
] as const;

export type Phase13ManualSafetyCompliancePolicy = {
  phase: "Phase 13: Safety & Compliance Engine";
  phaseStep: "Phase 13C — Manual Safety & Compliance Advisory Policy";
  previousStep: "Phase 13B — Safety & Compliance Signal Audit";
  phaseDecision: "manual_policy_only";
  implementationDecision: "not_authorized";
  consentDecision: "not_authorized";
  dncDecision: "not_authorized";
  optOutDecision: "not_authorized";
  providerDecision: "not_authorized";
  outreachDecision: "not_authorized";
  callDecision: "not_authorized";
  smsDecision: "not_authorized";
  emailDecision: "not_authorized";
  auditDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  campaignDecision: "not_authorized";
  spendDecision: "not_authorized";
  recommendedNextExactStep: "Phase 13D — Safety & Compliance Implementation Scope";
  nextStageRecommendation: "Phase 13D — Safety & Compliance Implementation Scope";
  signalReferences: typeof phase13SafetyComplianceSignalFamilies;
  safetyComplianceLanes: typeof phase13ManualSafetyComplianceLanes;
  summaryStates: typeof phase13SafetyComplianceSummaryStates;
  policyRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase13ManualSafetyCompliancePolicyFlags;
};

export const phase13ManualSafetyCompliancePolicyRules = [
  "Manual safety/compliance lanes are advisory visibility only and cannot trigger consent collection, DNC/opt-out bypass, sending, calling, provider activation, audit writing, CRM mutation, campaigns, spend, or go-live.",
  "DNC and opt-out remain hard blockers; approval visibility cannot become execution permission.",
  "The highest-aROI policy is to stop legal/compliance risk first, then focus human review on consent evidence, sender truthfulness, privacy/security, auth/access, outreach preflight, provider isolation, approval separation, and auditability visibility.",
];

export const phase13ManualSafetyCompliancePolicyStopRules = [
  "Phase 13C defines manual safety/compliance advisory lanes and summary states only.",
  "No implementation, consent collection, consent persistence, consent bypass, DNC bypass, opt-out bypass, STOP handling activation, revocation handling activation, provider activation, provider SDK imports, provider env reads, credential reads, outbound SMS, outbound email, calling, AI voice, outreach, queues, reminders, runtime jobs, polling, route/API/UI/form/schema/storage/auth/security mutations, audit writing, CRM mutation, lead mutation, campaigns, ads, spend increases, offer generation, contract generation, signature requests, Phase 14 implementation, or go-live is authorized.",
];

export const phase13ManualSafetyCompliancePolicyAiBoundary = [
  "rank and explain manual safety/compliance lanes for human review only",
  "do not approve legal or compliance decisions, collect consent, bypass DNC or opt-out, activate providers, send SMS or email, call, mutate records, write audits, launch campaigns, increase spend, approve Phase 14 implementation, or authorize go-live",
];

export function getPhase13ManualSafetyCompliancePolicy(): Phase13ManualSafetyCompliancePolicy {
  const result: Phase13ManualSafetyCompliancePolicy = {
    phase: "Phase 13: Safety & Compliance Engine",
    phaseStep: "Phase 13C — Manual Safety & Compliance Advisory Policy",
    previousStep: "Phase 13B — Safety & Compliance Signal Audit",
    phaseDecision: "manual_policy_only",
    implementationDecision: "not_authorized",
    consentDecision: "not_authorized",
    dncDecision: "not_authorized",
    optOutDecision: "not_authorized",
    providerDecision: "not_authorized",
    outreachDecision: "not_authorized",
    callDecision: "not_authorized",
    smsDecision: "not_authorized",
    emailDecision: "not_authorized",
    auditDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    campaignDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 13D — Safety & Compliance Implementation Scope",
    nextStageRecommendation: "Phase 13D — Safety & Compliance Implementation Scope",
    signalReferences: phase13SafetyComplianceSignalFamilies,
    safetyComplianceLanes: phase13ManualSafetyComplianceLanes,
    summaryStates: phase13SafetyComplianceSummaryStates,
    policyRules: phase13ManualSafetyCompliancePolicyRules,
    stopRules: phase13ManualSafetyCompliancePolicyStopRules,
    aiOperatorLeverageBoundary: phase13ManualSafetyCompliancePolicyAiBoundary,
    humanOwnershipBoundary: phase13SafetyComplianceHumanBoundary,
    forbiddenDrift: phase13SafetyComplianceForbiddenDrift,
    flags: phase13ManualSafetyCompliancePolicyFlags,
  };
  assertPhase13ManualSafetyCompliancePolicySafe(result);
  return result;
}

export function assertPhase13ManualSafetyCompliancePolicySafe(result: Phase13ManualSafetyCompliancePolicy) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "policyOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.policyRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.safetyComplianceLanes, result.summaryStates].flat().join(" ");
  const unsafePattern = /consent collection is authorized|DNC bypass is authorized|opt-out bypass is authorized|provider activation is authorized|outbound SMS is authorized|calling is authorized|audit writing is authorized|CRM mutation is authorized|campaigns are authorized|spend increases are authorized|Phase 14 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 13C — Manual Safety & Compliance Advisory Policy") throw new Error("Phase 13C step must remain pinned.");
  if (result.previousStep !== "Phase 13B — Safety & Compliance Signal Audit") throw new Error("Phase 13C previous step must remain Phase 13B.");
  if (result.phaseDecision !== "manual_policy_only") throw new Error("Phase 13C must remain manual-policy-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 13C decisions must remain not_authorized.");
  if (result.safetyComplianceLanes.join("|") !== phase13ManualSafetyComplianceLanes.join("|")) throw new Error("Phase 13C safety/compliance lanes are missing.");
  if (result.summaryStates.join("|") !== phase13SafetyComplianceSummaryStates.join("|")) throw new Error("Phase 13C summary states are missing.");
  if (result.signalReferences.join("|") !== phase13SafetyComplianceSignalFamilies.join("|")) throw new Error("Phase 13C signal references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 13C blocked flags cannot turn true.");
  if (!/advisory lanes and summary states only/i.test(result.stopRules.join(" "))) throw new Error("Phase 13C stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not approve legal or compliance decisions/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 13C AI boundary is missing.");
  if (!/legal review/i.test(result.humanOwnershipBoundary.join(" ")) || !/audit approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 13C human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 13D — Safety & Compliance Implementation Scope") throw new Error("Phase 13C must hand off to Phase 13D.");
  if (unsafePattern.test(text)) throw new Error("Phase 13C wording must not imply unsafe authorization.");
}

export function getPhase13ManualSafetyCompliancePolicySummary() {
  const result = getPhase13ManualSafetyCompliancePolicy();
  return `${result.phase} / ${result.phaseStep}: defines manual safety/compliance lanes and summary states for highest acquisition ROI per operator hour with human-owned compliance judgment, legal review, privacy/security judgment, consent/DNC/opt-out judgment, outreach approval, provider approval, audit approval, and go-live approval. No provider activation, no sending/calling, no outreach, no audit writing, no CRM mutation, no go-live, and no Phase 14 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
