import {
  phase12ConversionFinalLockdownFlags,
  phase12ConversionFinalLockdownRules,
} from "./phase-12-conversion-final-lockdown";

export const phase13SafetyComplianceScopeFlags = {
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
  apiChangeEnabled: false,
  authChangeEnabled: false,
  securityChangeEnabled: false,
  consentCollectionEnabled: false,
  consentPersistenceEnabled: false,
  consentBypassEnabled: false,
  dncBypassEnabled: false,
  optOutBypassEnabled: false,
  stopHandlingEnabled: false,
  revocationHandlingEnabled: false,
  auditWritingEnabled: false,
  outreachEnabled: false,
  callingEnabled: false,
  smsSendingEnabled: false,
  emailSendingEnabled: false,
  aiVoiceEnabled: false,
  campaignEnabled: false,
  adEnabled: false,
  spendIncreaseEnabled: false,
  goLiveAuthorized: false,
  phase14ImplementationEnabled: false,
} as const;

export type Phase13Decision = "not_authorized";

export type Phase13SafetyComplianceScope = {
  phase: "Phase 13: Safety & Compliance Engine";
  phaseStep: "Phase 13A — Safety & Compliance Engine Scope";
  previousStep: "Phase 12F — Conversion Optimization Final Lockdown";
  phaseDecision: "scope_only";
  primaryMetric: "acquisition_roi_per_operator_hour";
  aiRole: "operator_leverage_only";
  humanRole: "final_compliance_judgment_legal_review_privacy_security_judgment_consent_dnc_opt_out_judgment_outreach_approval_provider_approval_audit_approval_go_live_approval_execution_owner";
  implementationDecision: Phase13Decision;
  providerDecision: Phase13Decision;
  automationDecision: Phase13Decision;
  communicationDecision: Phase13Decision;
  crmMutationDecision: Phase13Decision;
  schemaDecision: Phase13Decision;
  storageDecision: Phase13Decision;
  runtimeDecision: Phase13Decision;
  routeDecision: Phase13Decision;
  uiDecision: Phase13Decision;
  formDecision: Phase13Decision;
  apiDecision: Phase13Decision;
  authDecision: Phase13Decision;
  securityDecision: Phase13Decision;
  consentDecision: Phase13Decision;
  dncDecision: Phase13Decision;
  optOutDecision: Phase13Decision;
  auditDecision: Phase13Decision;
  outreachDecision: Phase13Decision;
  callDecision: Phase13Decision;
  smsDecision: Phase13Decision;
  emailDecision: Phase13Decision;
  campaignDecision: Phase13Decision;
  adDecision: Phase13Decision;
  spendDecision: Phase13Decision;
  goLiveDecision: Phase13Decision;
  recommendedNextExactStep: "Phase 13B — Safety & Compliance Signal Audit";
  nextStageRecommendation: "Phase 13B — Safety & Compliance Signal Audit";
  phase12FinalLockdownReference: {
    flags: typeof phase12ConversionFinalLockdownFlags;
    rules: typeof phase12ConversionFinalLockdownRules;
  };
  scopePurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase13SafetyComplianceScopeFlags;
};

export const phase13SafetyCompliancePurpose = [
  "Define read-only Safety & Compliance planning for highest acquisition ROI per operator hour.",
  "Summarize consent evidence needs, DNC/opt-out blockers, STOP/revocation expectations, sender identity, outreach preflight gaps, provider isolation, privacy/security review needs, approval separation, and auditability visibility for human review only.",
  "Improve operator focus without changing routes, APIs, UI, forms, schema, storage, auth, security controls, consent handling, DNC/opt-out handling, audit logs, CRM records, lead records, providers, outreach, campaigns, ads, spend, or go-live state.",
];

export const phase13SafetyComplianceStopRules = [
  "Phase 13A is scope only.",
  "No implementation, go-live authorization, consent collection, consent persistence, consent bypass, DNC bypass, opt-out bypass, STOP handling activation, revocation handling activation, provider activation, provider SDK imports, provider env reads, credential reads, outbound SMS, outbound email, calling, AI voice, seller outreach, buyer outreach, communication queues, reminders, runtime jobs, polling, route changes, API changes, UI changes, form changes, schema changes, storage changes, auth changes, security mutations, audit writing, audit persistence, CRM mutation, lead mutation, campaigns, ads, spend increases, offer generation, contract generation, signature requests, legal/compliance approval by AI, Phase 14 implementation, or go-live is authorized.",
];

export const phase13SafetyComplianceAiBoundary = [
  "summarize safety and compliance gaps for human review only",
  "surface consent evidence needs, DNC and opt-out blockers, STOP/revocation expectations, sender identity requirements, privacy/security gaps, auth/access concerns, outreach preflight gaps, provider isolation, approval separation, and auditability visibility",
  "do not approve legal or compliance decisions, collect consent, persist consent, bypass DNC or opt-out, activate STOP runtime handling, activate providers, read env or credentials, send SMS or email, call, create queues, run jobs, mutate routes APIs UI schema storage auth security CRM or leads, write audits, launch campaigns, increase spend, approve Phase 14 implementation, or authorize go-live",
];

export const phase13SafetyComplianceHumanBoundary = [
  "final compliance judgment",
  "legal review",
  "privacy/security judgment",
  "consent/DNC/opt-out judgment",
  "outreach approval",
  "provider approval",
  "audit approval",
  "go-live approval",
  "communication judgment",
  "manual execution",
  "future implementation approval",
];

export const phase13SafetyComplianceForbiddenDrift = [
  "implementation",
  "go-live authorization",
  "consent collection",
  "consent persistence",
  "consent bypass",
  "DNC bypass",
  "opt-out bypass",
  "STOP handling activation",
  "revocation handling activation",
  "provider activation",
  "provider SDK imports",
  "provider env reads",
  "credential reads",
  "outbound SMS",
  "outbound email",
  "calling",
  "AI voice",
  "seller outreach",
  "buyer outreach",
  "communication queues",
  "reminders",
  "runtime jobs",
  "polling",
  "route/API/UI/form/schema/storage/auth/security mutations",
  "audit writing",
  "audit persistence",
  "CRM mutation",
  "lead mutation",
  "campaign activation",
  "ads",
  "spend increase",
  "offer generation",
  "contract generation",
  "signature requests",
  "legal/compliance approval by AI",
  "Phase 14 implementation",
];

export function getPhase13SafetyComplianceScope(): Phase13SafetyComplianceScope {
  const result: Phase13SafetyComplianceScope = {
    phase: "Phase 13: Safety & Compliance Engine",
    phaseStep: "Phase 13A — Safety & Compliance Engine Scope",
    previousStep: "Phase 12F — Conversion Optimization Final Lockdown",
    phaseDecision: "scope_only",
    primaryMetric: "acquisition_roi_per_operator_hour",
    aiRole: "operator_leverage_only",
    humanRole: "final_compliance_judgment_legal_review_privacy_security_judgment_consent_dnc_opt_out_judgment_outreach_approval_provider_approval_audit_approval_go_live_approval_execution_owner",
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
    apiDecision: "not_authorized",
    authDecision: "not_authorized",
    securityDecision: "not_authorized",
    consentDecision: "not_authorized",
    dncDecision: "not_authorized",
    optOutDecision: "not_authorized",
    auditDecision: "not_authorized",
    outreachDecision: "not_authorized",
    callDecision: "not_authorized",
    smsDecision: "not_authorized",
    emailDecision: "not_authorized",
    campaignDecision: "not_authorized",
    adDecision: "not_authorized",
    spendDecision: "not_authorized",
    goLiveDecision: "not_authorized",
    recommendedNextExactStep: "Phase 13B — Safety & Compliance Signal Audit",
    nextStageRecommendation: "Phase 13B — Safety & Compliance Signal Audit",
    phase12FinalLockdownReference: { flags: phase12ConversionFinalLockdownFlags, rules: phase12ConversionFinalLockdownRules },
    scopePurpose: phase13SafetyCompliancePurpose,
    stopRules: phase13SafetyComplianceStopRules,
    aiOperatorLeverageBoundary: phase13SafetyComplianceAiBoundary,
    humanOwnershipBoundary: phase13SafetyComplianceHumanBoundary,
    forbiddenDrift: phase13SafetyComplianceForbiddenDrift,
    flags: phase13SafetyComplianceScopeFlags,
  };
  assertPhase13SafetyComplianceScopeSafe(result);
  return result;
}

export function assertPhase13SafetyComplianceScopeSafe(result: Phase13SafetyComplianceScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "operatorLeverageOnly", "scopeOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopePurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /implementation is authorized|consent collection is authorized|DNC bypass is authorized|opt-out bypass is authorized|provider activation is authorized|credential reads are authorized|outbound SMS is authorized|outbound email is authorized|calling is authorized|outreach is authorized|runtime jobs are authorized|audit writing is authorized|CRM mutation is authorized|lead mutation is authorized|campaign activation is authorized|spend increase is authorized|Phase 14 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 13: Safety & Compliance Engine") throw new Error("Phase 13A phase must remain pinned.");
  if (result.phaseStep !== "Phase 13A — Safety & Compliance Engine Scope") throw new Error("Phase 13A step must remain pinned.");
  if (result.previousStep !== "Phase 12F — Conversion Optimization Final Lockdown") throw new Error("Phase 13A previous step must remain Phase 12F.");
  if (result.primaryMetric !== "acquisition_roi_per_operator_hour" || result.aiRole !== "operator_leverage_only") throw new Error("Phase 13A alignment must remain pinned.");
  if (result.phaseDecision !== "scope_only") throw new Error("Phase 13A must remain scope-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 13A decisions must remain not_authorized.");
  if (result.phase12FinalLockdownReference.rules.join("|") !== phase12ConversionFinalLockdownRules.join("|")) throw new Error("Phase 13A must preserve Phase 12F final lockdown reference.");
  if (unsafeTrue.length > 0) throw new Error("Phase 13A blocked flags cannot turn true.");
  if (!/No implementation, go-live authorization/i.test(result.stopRules.join(" ")) || !/Phase 14 implementation/i.test(result.stopRules.join(" "))) throw new Error("Phase 13A stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not approve legal or compliance decisions/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 13A AI boundary is missing.");
  if (!/final compliance judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/privacy\/security judgment/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 13A human boundary is missing.");
  if (!/consent collection/i.test(result.forbiddenDrift.join(" ")) || !/Phase 14 implementation/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 13A forbidden drift is missing.");
  if (result.recommendedNextExactStep !== "Phase 13B — Safety & Compliance Signal Audit") throw new Error("Phase 13A must hand off to Phase 13B.");
  if (unsafePattern.test(text)) throw new Error("Phase 13A wording must not imply unsafe authorization.");
}

export function getPhase13SafetyComplianceScopeSummary() {
  const result = getPhase13SafetyComplianceScope();
  return `${result.phase} / ${result.phaseStep}: read-only Safety & Compliance scope for highest acquisition ROI per operator hour with human-owned compliance judgment, legal review, privacy/security judgment, consent/DNC/opt-out judgment, outreach approval, provider approval, audit approval, and go-live approval. No provider activation, no sending/calling, no outreach, no audit writing, no CRM mutation, no consent collection, no DNC/opt-out bypass, no go-live, and no Phase 14 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
