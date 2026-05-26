import { phase17MinimalSecurityGateChecks } from "./phase-17-minimal-security-gate";
import {
  phase17SecurityForbiddenDrift,
  phase17SecurityHumanBoundary,
} from "./phase-17-pentest-security-engine-scope";

export const phase17SecurityFinalLockdownFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  finalLockdownOnly: true,
  operatorLeverageOnly: true,
  roadmapComplete: true,
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

export type Phase17SecurityFinalLockdown = {
  phase: "Phase 17: Pentest & Security Engine";
  phaseStep: "Phase 17F â€” Security Final Lockdown";
  previousStep: "Phase 17E â€” Minimal Security Gate";
  phaseDecision: "final_lockdown_only";
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
  recommendedNextExactStep: "Roadmap Final Lockdown â€” Human Go/No-Go Review";
  nextStageRecommendation: "Roadmap Final Lockdown â€” Human Go/No-Go Review";
  gateReferences: typeof phase17MinimalSecurityGateChecks;
  lockdownRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase17SecurityFinalLockdownFlags;
};

export const phase17SecurityFinalLockdownRules = [
  "Phase 17F locks Phase 17 as read-only planning for Pentest & Security Engine intelligence.",
  "Phase 17F preserves the no-live-pentest, no-scan, no-exploit, no-network, no-env-read, no-credential-read, no-auth-mutation, no-security-mutation, no-route/API/storage-mutation, no-audit-writing, no-remediation, no-provider, no-runtime-job, and no-go-live boundary.",
  "Phase 17F completes the 17-phase roadmap and recommends Roadmap Final Lockdown â€” Human Go/No-Go Review.",
];

export const phase17SecurityFinalLockdownStopRules = [
  "Phase 17F is final lockdown only.",
  "No implementation, live pentesting, exploit execution, fuzzing, scanning, crawling, brute force, destructive testing, external API/fetch/network behavior, third-party scanners, provider activation, env reads, credential reads, secret extraction, token exposure, process.env inspection, auth/security control mutation, route/API/UI/schema/storage mutation, audit writing, audit persistence, remediation execution, issue creation, ticket creation, CRM/lead/buyer/deal mutation, outreach, SMS/email/calling, runtime jobs, queues, go-live approval, production authorization, legal/security approval by AI, or new roadmap phase implementation is authorized.",
];

export const phase17SecurityFinalLockdownAiBoundary = [
  "summarize Phase 17 and roadmap final lockdown boundaries for human review only",
  "do not run pentests, scan, crawl, exploit, call networks, read env or credentials, mutate auth/security controls, change routes APIs or storage, write audits, execute remediation, create issues or tickets, activate providers, approve security decisions, authorize go-live, or implement a new roadmap phase",
];

export function getPhase17SecurityFinalLockdown(): Phase17SecurityFinalLockdown {
  const result: Phase17SecurityFinalLockdown = {
    phase: "Phase 17: Pentest & Security Engine",
    phaseStep: "Phase 17F â€” Security Final Lockdown",
    previousStep: "Phase 17E â€” Minimal Security Gate",
    phaseDecision: "final_lockdown_only",
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
    recommendedNextExactStep: "Roadmap Final Lockdown â€” Human Go/No-Go Review",
    nextStageRecommendation: "Roadmap Final Lockdown â€” Human Go/No-Go Review",
    gateReferences: phase17MinimalSecurityGateChecks,
    lockdownRules: phase17SecurityFinalLockdownRules,
    stopRules: phase17SecurityFinalLockdownStopRules,
    aiOperatorLeverageBoundary: phase17SecurityFinalLockdownAiBoundary,
    humanOwnershipBoundary: phase17SecurityHumanBoundary,
    forbiddenDrift: phase17SecurityForbiddenDrift,
    flags: phase17SecurityFinalLockdownFlags,
  };
  assertPhase17SecurityFinalLockdownSafe(result);
  return result;
}

export function assertPhase17SecurityFinalLockdownSafe(result: Phase17SecurityFinalLockdown) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "finalLockdownOnly", "operatorLeverageOnly", "roadmapComplete"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.lockdownRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /implementation is authorized|live pentesting is authorized|scanning is authorized|network behavior is authorized|credential reads are authorized|auth\/security control mutation is authorized|audit writing is authorized|remediation execution is authorized|provider activation is authorized|go-live approval is authorized|new roadmap phase implementation is authorized/i;

  if (result.phaseStep !== "Phase 17F â€” Security Final Lockdown") throw new Error("Phase 17F step must remain pinned.");
  if (result.previousStep !== "Phase 17E â€” Minimal Security Gate") throw new Error("Phase 17F previous step must remain Phase 17E.");
  if (result.phaseDecision !== "final_lockdown_only") throw new Error("Phase 17F must remain final-lockdown-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 17F decisions must remain not_authorized.");
  if (result.gateReferences.join("|") !== phase17MinimalSecurityGateChecks.join("|")) throw new Error("Phase 17F gate references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 17F blocked flags cannot turn true.");
  if (!/final lockdown only/i.test(result.stopRules.join(" "))) throw new Error("Phase 17F stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not run pentests/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 17F AI boundary is missing.");
  if (!/final security judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/go-live approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 17F human boundary is missing.");
  if (result.recommendedNextExactStep !== "Roadmap Final Lockdown â€” Human Go/No-Go Review") throw new Error("Phase 17F must recommend final roadmap lockdown.");
  if (unsafePattern.test(text)) throw new Error("Phase 17F wording must not imply unsafe authorization.");
}

export function getPhase17SecurityFinalLockdownSummary() {
  const result = getPhase17SecurityFinalLockdown();
  return `${result.phase} / ${result.phaseStep}: locks Phase 17 Pentest & Security Engine planning and completes the 17-phase roadmap for highest acquisition ROI per operator hour with human-owned security judgment, privacy judgment, auth/access approval, vulnerability triage, remediation approval, pentest authorization, audit approval, provider approval, and go-live approval. No live pentesting, no scans, no credential reads, no auth/security mutation, no audit writing, no provider activation, no go-live, and no new roadmap phase implementation are authorized. Next stage: ${result.nextStageRecommendation}.`;
}
