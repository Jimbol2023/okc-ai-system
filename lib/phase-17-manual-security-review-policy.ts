import { phase17SecuritySignalFamilies } from "./phase-17-security-signal-audit";
import {
  phase17SecurityForbiddenDrift,
  phase17SecurityHumanBoundary,
} from "./phase-17-pentest-security-engine-scope";

export const phase17ManualSecurityReviewPolicyFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  policyOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  pentestExecutionEnabled: false,
  scannerEnabled: false,
  exploitExecutionEnabled: false,
  networkEnabled: false,
  credentialReadEnabled: false,
  authMutationEnabled: false,
  securityMutationEnabled: false,
  apiChangeEnabled: false,
  routeChangeEnabled: false,
  storageMutationEnabled: false,
  auditWritingEnabled: false,
  remediationExecutionEnabled: false,
  providerActivated: false,
  runtimeJobsEnabled: false,
  goLiveAuthorized: false,
  furtherRoadmapImplementationEnabled: false,
} as const;

export const phase17ManualSecurityReviewLanes = [
  "stop_secrets_and_credentials_first",
  "auth_access_control_review",
  "protected_route_review",
  "api_authorization_review",
  "provider_secret_boundary_review",
  "privacy_retention_redaction_review",
  "audit_logging_safety_review",
  "outreach_security_boundary_review",
  "runtime_job_and_network_boundary_review",
  "vulnerability_triage_review",
  "manual_pentest_scope_review",
  "defer_until_human_security_approved",
] as const;

export const phase17SecuritySummaryStates = [
  "security_review_blocked",
  "secret_or_credential_risk_visible",
  "auth_review_required",
  "api_authorization_review_required",
  "provider_boundary_review_required",
  "privacy_redaction_review_required",
  "audit_logging_review_only",
  "network_boundary_review_only",
  "vulnerability_triage_needed",
  "manual_pentest_scope_only",
  "human_security_approval_required",
  "not_ready",
] as const;

export type Phase17ManualSecurityReviewPolicy = {
  phase: "Phase 17: Pentest & Security Engine";
  phaseStep: "Phase 17C â€” Manual Security Review Advisory Policy";
  previousStep: "Phase 17B â€” Security Signal Audit";
  phaseDecision: "manual_policy_only";
  implementationDecision: "not_authorized";
  pentestDecision: "not_authorized";
  scannerDecision: "not_authorized";
  exploitDecision: "not_authorized";
  networkDecision: "not_authorized";
  credentialDecision: "not_authorized";
  authDecision: "not_authorized";
  securityDecision: "not_authorized";
  apiDecision: "not_authorized";
  routeDecision: "not_authorized";
  storageDecision: "not_authorized";
  auditDecision: "not_authorized";
  remediationDecision: "not_authorized";
  providerDecision: "not_authorized";
  runtimeDecision: "not_authorized";
  goLiveDecision: "not_authorized";
  recommendedNextExactStep: "Phase 17D â€” Security Implementation Scope";
  nextStageRecommendation: "Phase 17D â€” Security Implementation Scope";
  signalReferences: typeof phase17SecuritySignalFamilies;
  securityReviewLanes: typeof phase17ManualSecurityReviewLanes;
  summaryStates: typeof phase17SecuritySummaryStates;
  policyRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase17ManualSecurityReviewPolicyFlags;
};

export const phase17ManualSecurityReviewPolicyRules = [
  "Manual security review lanes are advisory visibility only and cannot trigger scans, exploits, network calls, credential reads, auth/security mutation, remediation, audit writing, provider activation, runtime jobs, or go-live.",
  "Secrets, auth/access, protected routes, API authorization, provider boundaries, privacy/redaction, audit logging, runtime/network boundaries, vulnerability triage, and manual pentest scope remain human-owned review gates.",
  "The highest-aROI policy is to stop secrets and credential risk first, then focus human review on auth, API, provider, privacy, audit, and pentest scope readiness.",
];

export const phase17ManualSecurityReviewPolicyStopRules = [
  "Phase 17C defines manual security review advisory lanes and summary states only.",
  "No implementation, live pentesting, exploit execution, fuzzing, scanning, crawling, brute force, destructive testing, external API/fetch/network behavior, third-party scanners, provider activation, env reads, credential reads, secret extraction, token exposure, process.env inspection, auth/security control mutation, route/API/UI/schema/storage mutation, audit writing, audit persistence, remediation execution, issue creation, ticket creation, CRM/lead/buyer/deal mutation, outreach, SMS/email/calling, runtime jobs, queues, go-live approval, production authorization, legal/security approval by AI, or new roadmap phase implementation is authorized.",
];

export const phase17ManualSecurityReviewPolicyAiBoundary = [
  "rank and explain manual security review lanes for human review only",
  "do not run pentests, scan, crawl, exploit, call networks, read env or credentials, mutate auth/security controls, change routes APIs or storage, write audits, execute remediation, create issues or tickets, activate providers, approve security decisions, authorize go-live, or implement a new roadmap phase",
];

export function getPhase17ManualSecurityReviewPolicy(): Phase17ManualSecurityReviewPolicy {
  const result: Phase17ManualSecurityReviewPolicy = {
    phase: "Phase 17: Pentest & Security Engine",
    phaseStep: "Phase 17C â€” Manual Security Review Advisory Policy",
    previousStep: "Phase 17B â€” Security Signal Audit",
    phaseDecision: "manual_policy_only",
    implementationDecision: "not_authorized",
    pentestDecision: "not_authorized",
    scannerDecision: "not_authorized",
    exploitDecision: "not_authorized",
    networkDecision: "not_authorized",
    credentialDecision: "not_authorized",
    authDecision: "not_authorized",
    securityDecision: "not_authorized",
    apiDecision: "not_authorized",
    routeDecision: "not_authorized",
    storageDecision: "not_authorized",
    auditDecision: "not_authorized",
    remediationDecision: "not_authorized",
    providerDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    goLiveDecision: "not_authorized",
    recommendedNextExactStep: "Phase 17D â€” Security Implementation Scope",
    nextStageRecommendation: "Phase 17D â€” Security Implementation Scope",
    signalReferences: phase17SecuritySignalFamilies,
    securityReviewLanes: phase17ManualSecurityReviewLanes,
    summaryStates: phase17SecuritySummaryStates,
    policyRules: phase17ManualSecurityReviewPolicyRules,
    stopRules: phase17ManualSecurityReviewPolicyStopRules,
    aiOperatorLeverageBoundary: phase17ManualSecurityReviewPolicyAiBoundary,
    humanOwnershipBoundary: phase17SecurityHumanBoundary,
    forbiddenDrift: phase17SecurityForbiddenDrift,
    flags: phase17ManualSecurityReviewPolicyFlags,
  };
  assertPhase17ManualSecurityReviewPolicySafe(result);
  return result;
}

export function assertPhase17ManualSecurityReviewPolicySafe(result: Phase17ManualSecurityReviewPolicy) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "policyOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.policyRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.securityReviewLanes, result.summaryStates].flat().join(" ");
  const unsafePattern = /scans are authorized|exploits are authorized|network calls are authorized|credential reads are authorized|auth\/security mutation is authorized|audit writing is authorized|remediation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 17C â€” Manual Security Review Advisory Policy") throw new Error("Phase 17C step must remain pinned.");
  if (result.previousStep !== "Phase 17B â€” Security Signal Audit") throw new Error("Phase 17C previous step must remain Phase 17B.");
  if (result.phaseDecision !== "manual_policy_only") throw new Error("Phase 17C must remain manual-policy-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 17C decisions must remain not_authorized.");
  if (result.securityReviewLanes.join("|") !== phase17ManualSecurityReviewLanes.join("|")) throw new Error("Phase 17C security review lanes are missing.");
  if (result.summaryStates.join("|") !== phase17SecuritySummaryStates.join("|")) throw new Error("Phase 17C summary states are missing.");
  if (result.signalReferences.join("|") !== phase17SecuritySignalFamilies.join("|")) throw new Error("Phase 17C signal references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 17C blocked flags cannot turn true.");
  if (!/advisory lanes and summary states only/i.test(result.stopRules.join(" "))) throw new Error("Phase 17C stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not run pentests/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 17C AI boundary is missing.");
  if (!/remediation approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/go-live approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 17C human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 17D â€” Security Implementation Scope") throw new Error("Phase 17C must hand off to Phase 17D.");
  if (unsafePattern.test(text)) throw new Error("Phase 17C wording must not imply unsafe authorization.");
}

export function getPhase17ManualSecurityReviewPolicySummary() {
  const result = getPhase17ManualSecurityReviewPolicy();
  return `${result.phase} / ${result.phaseStep}: defines manual security review lanes and summary states for highest acquisition ROI per operator hour with human-owned security judgment, privacy judgment, auth/access approval, vulnerability triage, remediation approval, pentest authorization, audit approval, provider approval, and go-live approval. No live pentesting, no scans, no credential reads, no auth/security mutation, no audit writing, no provider activation, no go-live, and no new roadmap phase implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
