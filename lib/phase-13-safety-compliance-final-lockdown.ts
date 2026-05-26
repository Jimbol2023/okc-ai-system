import { phase13MinimalSafetyComplianceGateChecks } from "./phase-13-minimal-safety-compliance-gate";
import { phase13SafetyComplianceForbiddenDrift, phase13SafetyComplianceHumanBoundary } from "./phase-13-safety-compliance-scope";

export const phase13SafetyComplianceFinalLockdownFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  finalLockdownOnly: true,
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
  runtimeJobsEnabled: false,
  auditWritingEnabled: false,
  crmMutationEnabled: false,
  leadMutationEnabled: false,
  campaignEnabled: false,
  adEnabled: false,
  spendIncreaseEnabled: false,
  phase14ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase13SafetyComplianceFinalLockdown = {
  phase: "Phase 13: Safety & Compliance Engine";
  phaseStep: "Phase 13F — Safety & Compliance Final Lockdown";
  previousStep: "Phase 13E — Minimal Safety & Compliance Gate";
  phaseDecision: "final_lockdown_only";
  implementationDecision: "not_authorized";
  consentDecision: "not_authorized";
  dncDecision: "not_authorized";
  optOutDecision: "not_authorized";
  providerDecision: "not_authorized";
  outreachDecision: "not_authorized";
  callDecision: "not_authorized";
  smsDecision: "not_authorized";
  emailDecision: "not_authorized";
  runtimeDecision: "not_authorized";
  auditDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  campaignDecision: "not_authorized";
  adDecision: "not_authorized";
  spendDecision: "not_authorized";
  goLiveDecision: "not_authorized";
  recommendedNextExactStep: "Phase 14 — Facebook & TikTok Acquisition Engine";
  nextStageRecommendation: "Phase 14 — Facebook & TikTok Acquisition Engine";
  gateReferences: typeof phase13MinimalSafetyComplianceGateChecks;
  lockdownRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase13SafetyComplianceFinalLockdownFlags;
};

export const phase13SafetyComplianceFinalLockdownRules = [
  "Phase 13F locks Phase 13 as read-only planning for Safety & Compliance intelligence.",
  "Phase 13F preserves the no-consent-collection, no-DNC-bypass, no-opt-out-bypass, no-provider-activation, no-sending, no-calling, no-outreach, no-audit-writing, no-CRM-mutation, no-campaign, no-ad, no-spend-increase, and no-go-live boundary.",
  "Phase 13F can recommend Phase 14 — Facebook & TikTok Acquisition Engine, but cannot implement Phase 14.",
];

export const phase13SafetyComplianceFinalLockdownStopRules = [
  "Phase 13F is final lockdown only.",
  "No implementation, consent collection, consent persistence, consent bypass, DNC bypass, opt-out bypass, STOP handling activation, revocation handling activation, provider activation, provider SDK imports, provider env reads, credential reads, outbound SMS, outbound email, calling, AI voice, outreach, queues, reminders, runtime jobs, polling, route/API/UI/form/schema/storage/auth/security mutations, audit writing, CRM mutation, lead mutation, campaigns, ads, spend increases, offer generation, contract generation, signature requests, legal/compliance approval by AI, Phase 14 implementation, or go-live is authorized.",
];

export const phase13SafetyComplianceFinalLockdownAiBoundary = [
  "summarize Phase 13 lockdown boundaries for human review only",
  "do not implement Phase 14, approve legal/compliance decisions, collect consent, bypass DNC or opt-out, activate providers, send SMS or email, call, create outreach, create runtime jobs, mutate records, write audits, launch campaigns or ads, increase spend, or authorize go-live",
];

export function getPhase13SafetyComplianceFinalLockdown(): Phase13SafetyComplianceFinalLockdown {
  const result: Phase13SafetyComplianceFinalLockdown = {
    phase: "Phase 13: Safety & Compliance Engine",
    phaseStep: "Phase 13F — Safety & Compliance Final Lockdown",
    previousStep: "Phase 13E — Minimal Safety & Compliance Gate",
    phaseDecision: "final_lockdown_only",
    implementationDecision: "not_authorized",
    consentDecision: "not_authorized",
    dncDecision: "not_authorized",
    optOutDecision: "not_authorized",
    providerDecision: "not_authorized",
    outreachDecision: "not_authorized",
    callDecision: "not_authorized",
    smsDecision: "not_authorized",
    emailDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    auditDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    campaignDecision: "not_authorized",
    adDecision: "not_authorized",
    spendDecision: "not_authorized",
    goLiveDecision: "not_authorized",
    recommendedNextExactStep: "Phase 14 — Facebook & TikTok Acquisition Engine",
    nextStageRecommendation: "Phase 14 — Facebook & TikTok Acquisition Engine",
    gateReferences: phase13MinimalSafetyComplianceGateChecks,
    lockdownRules: phase13SafetyComplianceFinalLockdownRules,
    stopRules: phase13SafetyComplianceFinalLockdownStopRules,
    aiOperatorLeverageBoundary: phase13SafetyComplianceFinalLockdownAiBoundary,
    humanOwnershipBoundary: phase13SafetyComplianceHumanBoundary,
    forbiddenDrift: phase13SafetyComplianceForbiddenDrift,
    flags: phase13SafetyComplianceFinalLockdownFlags,
  };
  assertPhase13SafetyComplianceFinalLockdownSafe(result);
  return result;
}

export function assertPhase13SafetyComplianceFinalLockdownSafe(result: Phase13SafetyComplianceFinalLockdown) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "finalLockdownOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.lockdownRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /implementation is authorized|consent collection is authorized|DNC bypass is authorized|opt-out bypass is authorized|provider activation is authorized|outbound SMS is authorized|calling is authorized|outreach is authorized|audit writing is authorized|CRM mutation is authorized|campaigns are authorized|ads are authorized|spend increases are authorized|Phase 14 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 13F — Safety & Compliance Final Lockdown") throw new Error("Phase 13F step must remain pinned.");
  if (result.previousStep !== "Phase 13E — Minimal Safety & Compliance Gate") throw new Error("Phase 13F previous step must remain Phase 13E.");
  if (result.phaseDecision !== "final_lockdown_only") throw new Error("Phase 13F must remain final-lockdown-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 13F decisions must remain not_authorized.");
  if (result.gateReferences.join("|") !== phase13MinimalSafetyComplianceGateChecks.join("|")) throw new Error("Phase 13F gate references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 13F blocked flags cannot turn true.");
  if (!/final lockdown only/i.test(result.stopRules.join(" "))) throw new Error("Phase 13F stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not implement Phase 14/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 13F AI boundary is missing.");
  if (!/go-live approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/legal review/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 13F human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 14 — Facebook & TikTok Acquisition Engine") throw new Error("Phase 13F must recommend Phase 14.");
  if (unsafePattern.test(text)) throw new Error("Phase 13F wording must not imply unsafe authorization.");
}

export function getPhase13SafetyComplianceFinalLockdownSummary() {
  const result = getPhase13SafetyComplianceFinalLockdown();
  return `${result.phase} / ${result.phaseStep}: locks Phase 13 Safety & Compliance planning for highest acquisition ROI per operator hour with human-owned compliance judgment, legal review, privacy/security judgment, consent/DNC/opt-out judgment, provider approval, audit approval, and go-live approval. No provider activation, no sending/calling, no outreach, no audit writing, no CRM mutation, no go-live, and no Phase 14 implementation are authorized. Next phase: ${result.recommendedNextExactStep}.`;
}
