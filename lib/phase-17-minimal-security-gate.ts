import { phase17ManualSecurityReviewLanes, phase17SecuritySummaryStates } from "./phase-17-manual-security-review-policy";
import { phase17SecurityImplementationLanes } from "./phase-17-security-implementation-scope";
import {
  phase17SecurityForbiddenDrift,
  phase17SecurityHumanBoundary,
} from "./phase-17-pentest-security-engine-scope";

export const phase17MinimalSecurityGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  gateOnly: true,
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

export const phase17MinimalSecurityGateChecks = [
  "minimal_readonly_security_review_package",
  "human_security_privacy_judgment_required",
  "auth_access_vulnerability_triage_required",
  "remediation_pentest_audit_provider_approval_required",
  "no_scan_exploit_network_credential_boundary_required",
  "no_auth_security_route_api_storage_mutation_boundary_required",
  "no_audit_remediation_provider_go_live_boundary_required",
  "phase_17f_lockdown_ready",
] as const;

export type Phase17MinimalSecurityGate = {
  phase: "Phase 17: Pentest & Security Engine";
  phaseStep: "Phase 17E â€” Minimal Security Gate";
  previousStep: "Phase 17D â€” Security Implementation Scope";
  phaseDecision: "minimal_gate_only";
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
  recommendedNextExactStep: "Phase 17F â€” Security Final Lockdown";
  nextStageRecommendation: "Phase 17F â€” Security Final Lockdown";
  gateChecks: typeof phase17MinimalSecurityGateChecks;
  implementationLaneReferences: typeof phase17SecurityImplementationLanes;
  policyLaneReferences: typeof phase17ManualSecurityReviewLanes;
  summaryStateReferences: typeof phase17SecuritySummaryStates;
  gateRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase17MinimalSecurityGateFlags;
};

export const phase17MinimalSecurityGateRules = [
  "Phase 17E can only decide whether a minimal read-only security review package is worth carrying to final lockdown.",
  "A minimal package is only advisory if it preserves human security judgment, privacy judgment, auth/access approval, vulnerability triage, remediation approval, pentest authorization, audit approval, provider approval, and go-live approval.",
  "The gate cannot approve implementation, live pentesting, scans, exploits, network calls, credential reads, auth/security changes, API/route/storage mutation, audit writing, remediation execution, provider activation, runtime jobs, go-live, or new roadmap implementation.",
];

export const phase17MinimalSecurityGateStopRules = [
  "Phase 17E is a minimal gate only.",
  "No implementation, live pentesting, exploit execution, fuzzing, scanning, crawling, brute force, destructive testing, external API/fetch/network behavior, third-party scanners, provider activation, env reads, credential reads, secret extraction, token exposure, process.env inspection, auth/security control mutation, route/API/UI/schema/storage mutation, audit writing, audit persistence, remediation execution, issue creation, ticket creation, CRM/lead/buyer/deal mutation, outreach, SMS/email/calling, runtime jobs, queues, go-live approval, production authorization, legal/security approval by AI, or new roadmap phase implementation is authorized.",
];

export const phase17MinimalSecurityGateAiBoundary = [
  "summarize whether minimal read-only security visibility is worth final lockdown review",
  "do not approve implementation, run pentests, scan, crawl, exploit, call networks, read env or credentials, mutate auth/security controls, change routes APIs or storage, write audits, execute remediation, create issues or tickets, activate providers, approve go-live, or implement a new roadmap phase",
];

export function getPhase17MinimalSecurityGate(): Phase17MinimalSecurityGate {
  const result: Phase17MinimalSecurityGate = {
    phase: "Phase 17: Pentest & Security Engine",
    phaseStep: "Phase 17E â€” Minimal Security Gate",
    previousStep: "Phase 17D â€” Security Implementation Scope",
    phaseDecision: "minimal_gate_only",
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
    recommendedNextExactStep: "Phase 17F â€” Security Final Lockdown",
    nextStageRecommendation: "Phase 17F â€” Security Final Lockdown",
    gateChecks: phase17MinimalSecurityGateChecks,
    implementationLaneReferences: phase17SecurityImplementationLanes,
    policyLaneReferences: phase17ManualSecurityReviewLanes,
    summaryStateReferences: phase17SecuritySummaryStates,
    gateRules: phase17MinimalSecurityGateRules,
    stopRules: phase17MinimalSecurityGateStopRules,
    aiOperatorLeverageBoundary: phase17MinimalSecurityGateAiBoundary,
    humanOwnershipBoundary: phase17SecurityHumanBoundary,
    forbiddenDrift: phase17SecurityForbiddenDrift,
    flags: phase17MinimalSecurityGateFlags,
  };
  assertPhase17MinimalSecurityGateSafe(result);
  return result;
}

export function assertPhase17MinimalSecurityGateSafe(result: Phase17MinimalSecurityGate) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "gateOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.gateRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.gateChecks].flat().join(" ");
  const unsafePattern = /implementation is authorized|live pentesting is authorized|scans are authorized|network calls are authorized|credential reads are authorized|auth\/security changes are authorized|audit writing is authorized|remediation execution is authorized|provider activation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 17E â€” Minimal Security Gate") throw new Error("Phase 17E step must remain pinned.");
  if (result.previousStep !== "Phase 17D â€” Security Implementation Scope") throw new Error("Phase 17E previous step must remain Phase 17D.");
  if (result.phaseDecision !== "minimal_gate_only") throw new Error("Phase 17E must remain minimal-gate-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 17E decisions must remain not_authorized.");
  if (result.gateChecks.join("|") !== phase17MinimalSecurityGateChecks.join("|")) throw new Error("Phase 17E gate checks are missing.");
  if (result.implementationLaneReferences.join("|") !== phase17SecurityImplementationLanes.join("|")) throw new Error("Phase 17E implementation lane references are missing.");
  if (result.policyLaneReferences.join("|") !== phase17ManualSecurityReviewLanes.join("|")) throw new Error("Phase 17E policy lane references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 17E blocked flags cannot turn true.");
  if (!/minimal gate only/i.test(result.stopRules.join(" "))) throw new Error("Phase 17E stop rules are missing.");
  if (!/do not approve implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 17E AI boundary is missing.");
  if (!/pentest authorization/i.test(result.humanOwnershipBoundary.join(" ")) || !/go-live approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 17E human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 17F â€” Security Final Lockdown") throw new Error("Phase 17E must hand off to Phase 17F.");
  if (unsafePattern.test(text)) throw new Error("Phase 17E wording must not imply unsafe authorization.");
}

export function getPhase17MinimalSecurityGateSummary() {
  const result = getPhase17MinimalSecurityGate();
  return `${result.phase} / ${result.phaseStep}: gates a minimal read-only security review package for highest acquisition ROI per operator hour with human-owned security judgment, privacy judgment, auth/access approval, vulnerability triage, remediation approval, pentest authorization, audit approval, provider approval, and go-live approval. No live pentesting, no scans, no credential reads, no auth/security mutation, no audit writing, no provider activation, no go-live, and no new roadmap phase implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
