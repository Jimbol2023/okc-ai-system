import { phase13ManualSafetyComplianceLanes, phase13SafetyComplianceSummaryStates } from "./phase-13-manual-safety-compliance-policy";
import { phase13SafetyComplianceSignalFamilies } from "./phase-13-safety-compliance-signal-audit";
import { phase13SafetyComplianceForbiddenDrift, phase13SafetyComplianceHumanBoundary } from "./phase-13-safety-compliance-scope";

export const phase13SafetyComplianceImplementationScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  implementationScopeOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  consentCollectionEnabled: false,
  dncBypassEnabled: false,
  optOutBypassEnabled: false,
  providerActivated: false,
  outreachEnabled: false,
  routeChangeEnabled: false,
  apiChangeEnabled: false,
  authChangeEnabled: false,
  securityChangeEnabled: false,
  schemaChangeEnabled: false,
  storageMutationEnabled: false,
  runtimeJobsEnabled: false,
  auditWritingEnabled: false,
  crmMutationEnabled: false,
  campaignEnabled: false,
  spendIncreaseEnabled: false,
  phase14ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export const phase13SafetyComplianceImplementationLanes = [
  "candidate_readonly_consent_dnc_opt_out_visibility",
  "candidate_privacy_security_auth_access_visibility",
  "candidate_outreach_preflight_provider_isolation_visibility",
  "candidate_approval_separation_and_auditability_visibility",
  "deferred_legal_human_approved_future_scope_only",
  "blocked_execution_provider_outreach_audit_mutation_paths",
] as const;

export type Phase13SafetyComplianceImplementationScope = {
  phase: "Phase 13: Safety & Compliance Engine";
  phaseStep: "Phase 13D — Safety & Compliance Implementation Scope";
  previousStep: "Phase 13C — Manual Safety & Compliance Advisory Policy";
  phaseDecision: "implementation_scope_only";
  implementationDecision: "not_authorized";
  consentDecision: "not_authorized";
  dncDecision: "not_authorized";
  optOutDecision: "not_authorized";
  providerDecision: "not_authorized";
  outreachDecision: "not_authorized";
  routeDecision: "not_authorized";
  apiDecision: "not_authorized";
  authDecision: "not_authorized";
  securityDecision: "not_authorized";
  schemaDecision: "not_authorized";
  storageDecision: "not_authorized";
  runtimeDecision: "not_authorized";
  auditDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  campaignDecision: "not_authorized";
  spendDecision: "not_authorized";
  recommendedNextExactStep: "Phase 13E — Minimal Safety & Compliance Gate";
  nextStageRecommendation: "Phase 13E — Minimal Safety & Compliance Gate";
  implementationLanes: typeof phase13SafetyComplianceImplementationLanes;
  signalReferences: typeof phase13SafetyComplianceSignalFamilies;
  policyLaneReferences: typeof phase13ManualSafetyComplianceLanes;
  summaryStateReferences: typeof phase13SafetyComplianceSummaryStates;
  scopeRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase13SafetyComplianceImplementationScopeFlags;
};

export const phase13SafetyComplianceImplementationScopeRules = [
  "Phase 13D may describe a future read-only safety/compliance visibility package, but cannot execute implementation, consent handling, provider activation, outreach, route/API/schema/storage/auth/security changes, runtime jobs, CRM mutation, campaigns, audit writing, or go-live.",
  "Future candidates must remain limited to readonly consent/DNC/opt-out visibility, privacy/security review visibility, auth/access visibility, outreach preflight visibility, provider isolation, approval separation, and auditability visibility.",
  "Any actual safety/compliance change is deferred until explicit legal and human approval in a future authorized step.",
];

export const phase13SafetyComplianceImplementationScopeStopRules = [
  "Phase 13D scopes a possible future implementation only.",
  "No implementation execution, consent collection, consent persistence, consent bypass, DNC bypass, opt-out bypass, STOP handling activation, provider activation, provider SDK imports, provider env reads, credential reads, outbound SMS, outbound email, calling, outreach, queues, runtime jobs, route/API/UI/form/schema/storage/auth/security mutations, audit writing, CRM mutation, lead mutation, campaigns, spend increases, Phase 14 implementation, or go-live is authorized.",
];

export const phase13SafetyComplianceImplementationScopeAiBoundary = [
  "explain future read-only safety/compliance implementation scope for human review only",
  "do not execute implementation, collect consent, bypass DNC or opt-out, activate providers, send or call, mutate routes APIs auth security storage CRM or leads, create queues or runtime jobs, write audits, launch campaigns, increase spend, approve Phase 14 implementation, or authorize go-live",
];

export function getPhase13SafetyComplianceImplementationScope(): Phase13SafetyComplianceImplementationScope {
  const result: Phase13SafetyComplianceImplementationScope = {
    phase: "Phase 13: Safety & Compliance Engine",
    phaseStep: "Phase 13D — Safety & Compliance Implementation Scope",
    previousStep: "Phase 13C — Manual Safety & Compliance Advisory Policy",
    phaseDecision: "implementation_scope_only",
    implementationDecision: "not_authorized",
    consentDecision: "not_authorized",
    dncDecision: "not_authorized",
    optOutDecision: "not_authorized",
    providerDecision: "not_authorized",
    outreachDecision: "not_authorized",
    routeDecision: "not_authorized",
    apiDecision: "not_authorized",
    authDecision: "not_authorized",
    securityDecision: "not_authorized",
    schemaDecision: "not_authorized",
    storageDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    auditDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    campaignDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 13E — Minimal Safety & Compliance Gate",
    nextStageRecommendation: "Phase 13E — Minimal Safety & Compliance Gate",
    implementationLanes: phase13SafetyComplianceImplementationLanes,
    signalReferences: phase13SafetyComplianceSignalFamilies,
    policyLaneReferences: phase13ManualSafetyComplianceLanes,
    summaryStateReferences: phase13SafetyComplianceSummaryStates,
    scopeRules: phase13SafetyComplianceImplementationScopeRules,
    stopRules: phase13SafetyComplianceImplementationScopeStopRules,
    aiOperatorLeverageBoundary: phase13SafetyComplianceImplementationScopeAiBoundary,
    humanOwnershipBoundary: phase13SafetyComplianceHumanBoundary,
    forbiddenDrift: phase13SafetyComplianceForbiddenDrift,
    flags: phase13SafetyComplianceImplementationScopeFlags,
  };
  assertPhase13SafetyComplianceImplementationScopeSafe(result);
  return result;
}

export function assertPhase13SafetyComplianceImplementationScopeSafe(result: Phase13SafetyComplianceImplementationScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "implementationScopeOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopeRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.implementationLanes].flat().join(" ");
  const unsafePattern = /implementation execution is authorized|consent collection is authorized|DNC bypass is authorized|provider activation is authorized|outreach is authorized|route\/API\/UI\/form\/schema\/storage\/auth\/security mutations are authorized|audit writing is authorized|CRM mutation is authorized|campaigns are authorized|spend increases are authorized|Phase 14 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 13D — Safety & Compliance Implementation Scope") throw new Error("Phase 13D step must remain pinned.");
  if (result.previousStep !== "Phase 13C — Manual Safety & Compliance Advisory Policy") throw new Error("Phase 13D previous step must remain Phase 13C.");
  if (result.phaseDecision !== "implementation_scope_only") throw new Error("Phase 13D must remain implementation-scope-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 13D decisions must remain not_authorized.");
  if (result.implementationLanes.join("|") !== phase13SafetyComplianceImplementationLanes.join("|")) throw new Error("Phase 13D implementation lanes are missing.");
  if (result.policyLaneReferences.join("|") !== phase13ManualSafetyComplianceLanes.join("|")) throw new Error("Phase 13D policy lane references are missing.");
  if (result.summaryStateReferences.join("|") !== phase13SafetyComplianceSummaryStates.join("|")) throw new Error("Phase 13D summary state references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 13D blocked flags cannot turn true.");
  if (!/possible future implementation only/i.test(result.stopRules.join(" "))) throw new Error("Phase 13D stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not execute implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 13D AI boundary is missing.");
  if (!/future implementation approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 13D human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 13E — Minimal Safety & Compliance Gate") throw new Error("Phase 13D must hand off to Phase 13E.");
  if (unsafePattern.test(text)) throw new Error("Phase 13D wording must not imply unsafe authorization.");
}

export function getPhase13SafetyComplianceImplementationScopeSummary() {
  const result = getPhase13SafetyComplianceImplementationScope();
  return `${result.phase} / ${result.phaseStep}: scopes a possible future read-only safety/compliance visibility package for highest acquisition ROI per operator hour with human-owned compliance judgment, legal review, privacy/security judgment, consent/DNC/opt-out judgment, audit approval, and future implementation approval. No provider activation, no sending/calling, no outreach, no audit writing, no CRM mutation, no go-live, and no Phase 14 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
