import {
  consentDncOptOutSenderPolicyDoctrine,
  consentDncOptOutSenderPolicyLanes,
  forbiddenConsentDncOptOutSenderPolicyDrift,
} from "./consent-dnc-opt-out-sender-policy-review";
import {
  phase13SafetyComplianceForbiddenDrift,
  phase13SafetyComplianceHumanBoundary,
} from "./phase-13-safety-compliance-scope";
import { y7SecurityPrivacyComplianceGateAreas } from "./y7-security-privacy-compliance-gate-review";

export const phase13SafetyComplianceSignalAuditFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  signalAuditOnly: true,
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
  routeChangeEnabled: false,
  apiChangeEnabled: false,
  authChangeEnabled: false,
  securityChangeEnabled: false,
  storageMutationEnabled: false,
  auditWritingEnabled: false,
  crmMutationEnabled: false,
  leadMutationEnabled: false,
  campaignEnabled: false,
  spendIncreaseEnabled: false,
  phase14ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase13SafetyComplianceSignalFamily =
  | "phase_12_final_lockdown_handoff"
  | "consent_dnc_opt_out_sender_policy_review"
  | "outreach_preflight_permissions_gating_mock_outreach_opt_out_sms_twilio_eligibility"
  | "security_privacy_y7_retention_deletion_migration_governance_traceability"
  | "approval_governance_provider_isolation_controlled_outreach_automation_last"
  | "lead_contact_safety_fields_dnc_stop_approval_source_blocked_suppressed"
  | "safety_accessibility_reviews_advisory_only_no_engine_no_scanning_no_audit_persistence";

export const phase13SafetyComplianceSignalFamilies: Phase13SafetyComplianceSignalFamily[] = [
  "phase_12_final_lockdown_handoff",
  "consent_dnc_opt_out_sender_policy_review",
  "outreach_preflight_permissions_gating_mock_outreach_opt_out_sms_twilio_eligibility",
  "security_privacy_y7_retention_deletion_migration_governance_traceability",
  "approval_governance_provider_isolation_controlled_outreach_automation_last",
  "lead_contact_safety_fields_dnc_stop_approval_source_blocked_suppressed",
  "safety_accessibility_reviews_advisory_only_no_engine_no_scanning_no_audit_persistence",
];

export type Phase13SafetyComplianceSignalAudit = {
  phase: "Phase 13: Safety & Compliance Engine";
  phaseStep: "Phase 13B — Safety & Compliance Signal Audit";
  previousStep: "Phase 13A — Safety & Compliance Engine Scope";
  phaseDecision: "signal_audit_only";
  implementationDecision: "not_authorized";
  consentDecision: "not_authorized";
  dncDecision: "not_authorized";
  optOutDecision: "not_authorized";
  providerDecision: "not_authorized";
  outreachDecision: "not_authorized";
  callDecision: "not_authorized";
  smsDecision: "not_authorized";
  emailDecision: "not_authorized";
  routeDecision: "not_authorized";
  apiDecision: "not_authorized";
  authDecision: "not_authorized";
  securityDecision: "not_authorized";
  storageDecision: "not_authorized";
  auditDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  campaignDecision: "not_authorized";
  spendDecision: "not_authorized";
  recommendedNextExactStep: "Phase 13C — Manual Safety & Compliance Advisory Policy";
  nextStageRecommendation: "Phase 13C — Manual Safety & Compliance Advisory Policy";
  signalFamilies: Phase13SafetyComplianceSignalFamily[];
  groundedReferences: {
    consentLanes: typeof consentDncOptOutSenderPolicyLanes;
    consentDoctrine: typeof consentDncOptOutSenderPolicyDoctrine;
    consentForbiddenDrift: typeof forbiddenConsentDncOptOutSenderPolicyDrift;
    y7SecurityPrivacyAreas: typeof y7SecurityPrivacyComplianceGateAreas;
    safetySurfaceFiles: string[];
  };
  auditPurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase13SafetyComplianceSignalAuditFlags;
};

export const phase13SafetyComplianceSignalAuditPurpose = [
  "Audit existing safety and compliance signal families without changing consent handling, DNC/opt-out handling, routes, APIs, auth, security, storage, audit logs, CRM records, lead records, outreach, providers, campaigns, or go-live state.",
  "Reference consent/DNC/opt-out policy, outreach preflight and eligibility, security review, Y7 security/privacy gate, approval governance, provider isolation, controlled outreach, lead safety fields, and safety/accessibility reviews as existing signals only.",
  "Support highest acquisition ROI per operator hour by making compliance blockers, consent evidence gaps, privacy/security review needs, provider isolation, approval separation, and auditability visibility easier for humans to review.",
];

export const phase13SafetyComplianceSignalAuditStopRules = [
  "Phase 13B audits existing safety and compliance signal families only.",
  "No implementation, consent collection, consent persistence, consent bypass, DNC bypass, opt-out bypass, STOP handling activation, revocation handling activation, provider activation, provider SDK imports, provider env reads, credential reads, outbound SMS, outbound email, calling, AI voice, outreach, queues, reminders, runtime jobs, polling, route/API/UI/form/schema/storage/auth/security mutations, audit writing, CRM mutation, lead mutation, campaigns, ads, spend increases, Phase 14 implementation, or go-live is authorized.",
];

export const phase13SafetyComplianceSignalAuditAiBoundary = [
  "summarize existing safety and compliance signals for human review only",
  "flag consent evidence, DNC and opt-out hard blockers, STOP/revocation expectations, sender identity, outreach preflight, provider isolation, privacy/security review, auth/access review, approval separation, and auditability visibility",
  "do not collect consent, bypass DNC or opt-out, activate providers, send SMS or email, call, mutate routes APIs auth security storage CRM or leads, write audits, launch campaigns, increase spend, approve legal/compliance decisions, or authorize go-live",
];

export function getPhase13SafetyComplianceSignalAudit(): Phase13SafetyComplianceSignalAudit {
  const result: Phase13SafetyComplianceSignalAudit = {
    phase: "Phase 13: Safety & Compliance Engine",
    phaseStep: "Phase 13B — Safety & Compliance Signal Audit",
    previousStep: "Phase 13A — Safety & Compliance Engine Scope",
    phaseDecision: "signal_audit_only",
    implementationDecision: "not_authorized",
    consentDecision: "not_authorized",
    dncDecision: "not_authorized",
    optOutDecision: "not_authorized",
    providerDecision: "not_authorized",
    outreachDecision: "not_authorized",
    callDecision: "not_authorized",
    smsDecision: "not_authorized",
    emailDecision: "not_authorized",
    routeDecision: "not_authorized",
    apiDecision: "not_authorized",
    authDecision: "not_authorized",
    securityDecision: "not_authorized",
    storageDecision: "not_authorized",
    auditDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    campaignDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 13C — Manual Safety & Compliance Advisory Policy",
    nextStageRecommendation: "Phase 13C — Manual Safety & Compliance Advisory Policy",
    signalFamilies: phase13SafetyComplianceSignalFamilies,
    groundedReferences: {
      consentLanes: consentDncOptOutSenderPolicyLanes,
      consentDoctrine: consentDncOptOutSenderPolicyDoctrine,
      consentForbiddenDrift: forbiddenConsentDncOptOutSenderPolicyDrift,
      y7SecurityPrivacyAreas: y7SecurityPrivacyComplianceGateAreas,
      safetySurfaceFiles: [
        "lib/outreach-preflight.ts",
        "lib/outreach-permissions.ts",
        "lib/outreach-gating.ts",
        "lib/security-review-agent.ts",
        "lib/human-approval-workflow-review.ts",
        "lib/funding-approval-guardrails.ts",
        "lib/y8-human-approval-package-contents.ts",
      ],
    },
    auditPurpose: phase13SafetyComplianceSignalAuditPurpose,
    stopRules: phase13SafetyComplianceSignalAuditStopRules,
    aiOperatorLeverageBoundary: phase13SafetyComplianceSignalAuditAiBoundary,
    humanOwnershipBoundary: phase13SafetyComplianceHumanBoundary,
    forbiddenDrift: phase13SafetyComplianceForbiddenDrift,
    flags: phase13SafetyComplianceSignalAuditFlags,
  };
  assertPhase13SafetyComplianceSignalAuditSafe(result);
  return result;
}

export function assertPhase13SafetyComplianceSignalAuditSafe(result: Phase13SafetyComplianceSignalAudit) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "signalAuditOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.auditPurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.signalFamilies].flat().join(" ");
  const unsafePattern = /consent collection is authorized|DNC bypass is authorized|opt-out bypass is authorized|provider activation is authorized|outbound SMS is authorized|outbound email is authorized|calling is authorized|outreach is authorized|audit writing is authorized|CRM mutation is authorized|lead mutation is authorized|campaigns are authorized|spend increases are authorized|Phase 14 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 13B — Safety & Compliance Signal Audit") throw new Error("Phase 13B step must remain pinned.");
  if (result.previousStep !== "Phase 13A — Safety & Compliance Engine Scope") throw new Error("Phase 13B previous step must remain Phase 13A.");
  if (result.phaseDecision !== "signal_audit_only") throw new Error("Phase 13B must remain signal-audit-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 13B decisions must remain not_authorized.");
  if (result.signalFamilies.join("|") !== phase13SafetyComplianceSignalFamilies.join("|")) throw new Error("Phase 13B must include all safety/compliance signal families.");
  if (unsafeTrue.length > 0) throw new Error("Phase 13B blocked flags cannot turn true.");
  if (!/consent_dnc_opt_out/i.test(result.signalFamilies.join(" ")) || !/security_privacy_y7/i.test(result.signalFamilies.join(" "))) throw new Error("Phase 13B repo-grounded signals are missing.");
  if (!/audits existing safety and compliance signal families only/i.test(result.stopRules.join(" "))) throw new Error("Phase 13B stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not collect consent/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 13B AI boundary is missing.");
  if (!/legal review/i.test(result.humanOwnershipBoundary.join(" ")) || !/go-live approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 13B human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 13C — Manual Safety & Compliance Advisory Policy") throw new Error("Phase 13B must hand off to Phase 13C.");
  if (unsafePattern.test(text)) throw new Error("Phase 13B wording must not imply unsafe authorization.");
}

export function getPhase13SafetyComplianceSignalAuditSummary() {
  const result = getPhase13SafetyComplianceSignalAudit();
  return `${result.phase} / ${result.phaseStep}: audits existing consent/DNC/opt-out, outreach preflight, security/privacy, approval governance, provider isolation, and lead contact-safety signals for highest acquisition ROI per operator hour. Human-owned compliance judgment, legal review, privacy/security judgment, and consent/DNC/opt-out judgment remain required. No provider activation, no sending/calling, no outreach, no audit writing, no CRM mutation, no go-live, and no Phase 14 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
