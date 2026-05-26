import {
  phase17SecurityForbiddenDrift,
  phase17SecurityHumanBoundary,
} from "./phase-17-pentest-security-engine-scope";

export const phase17SecuritySignalAuditFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  signalAuditOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  pentestExecutionEnabled: false,
  scannerEnabled: false,
  exploitExecutionEnabled: false,
  networkEnabled: false,
  externalApiEnabled: false,
  fetchEnabled: false,
  envReadEnabled: false,
  credentialReadEnabled: false,
  authMutationEnabled: false,
  securityMutationEnabled: false,
  apiChangeEnabled: false,
  routeChangeEnabled: false,
  storageMutationEnabled: false,
  auditWritingEnabled: false,
  remediationExecutionEnabled: false,
  providerActivated: false,
  outreachEnabled: false,
  runtimeJobsEnabled: false,
  goLiveAuthorized: false,
  furtherRoadmapImplementationEnabled: false,
} as const;

export type Phase17SecuritySignalFamily =
  | "phase_16_final_lockdown_handoff"
  | "auth_security_surfaces_auth_routes_middleware_unauthorized_responses"
  | "security_review_agent_api_page_y7_security_privacy_gate"
  | "privacy_retention_redaction_audit_persistence_no_secret_logging"
  | "communication_provider_consent_dnc_outreach_send_sms_twilio_boundaries"
  | "route_api_exposure_public_dashboard_lead_buyer_deal_provider_paths"
  | "final_roadmap_governance_no_scans_no_exploits_no_credentials_no_remediation_no_go_live";

export const phase17SecuritySignalFamilies: Phase17SecuritySignalFamily[] = [
  "phase_16_final_lockdown_handoff",
  "auth_security_surfaces_auth_routes_middleware_unauthorized_responses",
  "security_review_agent_api_page_y7_security_privacy_gate",
  "privacy_retention_redaction_audit_persistence_no_secret_logging",
  "communication_provider_consent_dnc_outreach_send_sms_twilio_boundaries",
  "route_api_exposure_public_dashboard_lead_buyer_deal_provider_paths",
  "final_roadmap_governance_no_scans_no_exploits_no_credentials_no_remediation_no_go_live",
];

export type Phase17SecuritySignalAudit = {
  phase: "Phase 17: Pentest & Security Engine";
  phaseStep: "Phase 17B â€” Security Signal Audit";
  previousStep: "Phase 17A â€” Pentest & Security Engine Scope";
  phaseDecision: "signal_audit_only";
  implementationDecision: "not_authorized";
  pentestDecision: "not_authorized";
  scannerDecision: "not_authorized";
  exploitDecision: "not_authorized";
  networkDecision: "not_authorized";
  externalApiDecision: "not_authorized";
  fetchDecision: "not_authorized";
  envDecision: "not_authorized";
  credentialDecision: "not_authorized";
  authDecision: "not_authorized";
  securityDecision: "not_authorized";
  apiDecision: "not_authorized";
  routeDecision: "not_authorized";
  storageDecision: "not_authorized";
  auditDecision: "not_authorized";
  remediationDecision: "not_authorized";
  providerDecision: "not_authorized";
  outreachDecision: "not_authorized";
  runtimeDecision: "not_authorized";
  goLiveDecision: "not_authorized";
  recommendedNextExactStep: "Phase 17C â€” Manual Security Review Advisory Policy";
  nextStageRecommendation: "Phase 17C â€” Manual Security Review Advisory Policy";
  signalFamilies: Phase17SecuritySignalFamily[];
  groundedReferences: {
    authSecuritySurfaces: string[];
    securityReviewSurfaces: string[];
    privacyRetentionSurfaces: string[];
    communicationProviderSafetySurfaces: string[];
    routeApiExposureConcepts: string[];
    finalRoadmapGovernance: string[];
  };
  auditPurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase17SecuritySignalAuditFlags;
};

export const phase17SecuritySignalAuditPurpose = [
  "Audit existing security, privacy, auth, provider, audit, and route/API exposure signal families without running pentests, scanning, reading env or credentials, mutating auth/security controls, writing audits, executing remediation, activating providers, or authorizing go-live.",
  "Reference auth surfaces, security review surfaces, privacy/retention/redaction boundaries, communication/provider safety, route/API exposure, and final roadmap governance as advisory signals only.",
  "Support highest acquisition ROI per operator hour by making auth/access gaps, API authorization risk, provider secret boundaries, privacy/redaction concerns, audit logging risk, runtime/network boundaries, vulnerability triage, and manual pentest scope easier for humans to review.",
];

export const phase17SecuritySignalAuditStopRules = [
  "Phase 17B audits existing security signal families only.",
  "No implementation, live pentesting, exploit execution, fuzzing, scanning, crawling, brute force, destructive testing, external API/fetch/network behavior, third-party scanners, provider activation, env reads, credential reads, secret extraction, token exposure, process.env inspection, auth/security control mutation, route/API/UI/schema/storage mutation, audit writing, audit persistence, remediation execution, issue creation, ticket creation, CRM/lead/buyer/deal mutation, outreach, SMS/email/calling, runtime jobs, queues, go-live approval, production authorization, legal/security approval by AI, or new roadmap phase implementation is authorized.",
];

export const phase17SecuritySignalAuditAiBoundary = [
  "summarize existing security and pentest planning signals for human review only",
  "flag secrets/credential risk, auth/access concerns, protected route exposure, API authorization gaps, provider secret boundaries, privacy/redaction concerns, audit logging safety, outreach security boundaries, runtime/network boundaries, vulnerability triage needs, and manual pentest scope",
  "do not run pentests, scan, crawl, fuzz, exploit, call networks, read env or credentials, mutate auth/security controls, write audits, execute remediation, create issues or tickets, activate providers, approve security decisions, authorize go-live, or implement a new roadmap phase",
];

export function getPhase17SecuritySignalAudit(): Phase17SecuritySignalAudit {
  const result: Phase17SecuritySignalAudit = {
    phase: "Phase 17: Pentest & Security Engine",
    phaseStep: "Phase 17B â€” Security Signal Audit",
    previousStep: "Phase 17A â€” Pentest & Security Engine Scope",
    phaseDecision: "signal_audit_only",
    implementationDecision: "not_authorized",
    pentestDecision: "not_authorized",
    scannerDecision: "not_authorized",
    exploitDecision: "not_authorized",
    networkDecision: "not_authorized",
    externalApiDecision: "not_authorized",
    fetchDecision: "not_authorized",
    envDecision: "not_authorized",
    credentialDecision: "not_authorized",
    authDecision: "not_authorized",
    securityDecision: "not_authorized",
    apiDecision: "not_authorized",
    routeDecision: "not_authorized",
    storageDecision: "not_authorized",
    auditDecision: "not_authorized",
    remediationDecision: "not_authorized",
    providerDecision: "not_authorized",
    outreachDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    goLiveDecision: "not_authorized",
    recommendedNextExactStep: "Phase 17C â€” Manual Security Review Advisory Policy",
    nextStageRecommendation: "Phase 17C â€” Manual Security Review Advisory Policy",
    signalFamilies: phase17SecuritySignalFamilies,
    groundedReferences: {
      authSecuritySurfaces: ["lib/auth.ts", "isAuthenticatedRequest", "login/logout routes", "middleware/proxy behavior", "getUnauthorizedApiResponse"],
      securityReviewSurfaces: ["security-review-agent", "app/api/security-review/route.ts", "dashboard/security-review", "y7-security-privacy-compliance-gate-review"],
      privacyRetentionSurfaces: ["y3-retention-immutability-privacy-plan", "y4-retention-privacy-deletion-boundary-plan", "redaction-before-storage planning", "audit-persistence-planning", "no-secret/no-credential logging doctrine"],
      communicationProviderSafetySurfaces: ["consent/DNC/opt-out policy", "outreach preflight/gating/permissions", "send SMS safety contracts", "Twilio inbound route", "no-provider/no-send/no-call boundaries"],
      routeApiExposureConcepts: ["public pages", "dashboard routes", "lead APIs", "buyer APIs", "deal APIs", "security-review API", "auth-gated strategy APIs", "provider-touching paths"],
      finalRoadmapGovernance: ["no external scans", "no exploit execution", "no credential reads", "no env reads", "no destructive testing", "no audit writing", "no remediation execution", "no go-live by AI"],
    },
    auditPurpose: phase17SecuritySignalAuditPurpose,
    stopRules: phase17SecuritySignalAuditStopRules,
    aiOperatorLeverageBoundary: phase17SecuritySignalAuditAiBoundary,
    humanOwnershipBoundary: phase17SecurityHumanBoundary,
    forbiddenDrift: phase17SecurityForbiddenDrift,
    flags: phase17SecuritySignalAuditFlags,
  };
  assertPhase17SecuritySignalAuditSafe(result);
  return result;
}

export function assertPhase17SecuritySignalAuditSafe(result: Phase17SecuritySignalAudit) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "signalAuditOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.auditPurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.signalFamilies].flat().join(" ");
  const unsafePattern = /live pentesting is authorized|scanning is authorized|exploit execution is authorized|network behavior is authorized|env reads are authorized|credential reads are authorized|auth\/security control mutation is authorized|audit writing is authorized|remediation execution is authorized|go-live approval is authorized|new roadmap phase implementation is authorized/i;

  if (result.phaseStep !== "Phase 17B â€” Security Signal Audit") throw new Error("Phase 17B step must remain pinned.");
  if (result.previousStep !== "Phase 17A â€” Pentest & Security Engine Scope") throw new Error("Phase 17B previous step must remain Phase 17A.");
  if (result.phaseDecision !== "signal_audit_only") throw new Error("Phase 17B must remain signal-audit-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 17B decisions must remain not_authorized.");
  if (result.signalFamilies.join("|") !== phase17SecuritySignalFamilies.join("|")) throw new Error("Phase 17B must include all security signal families.");
  if (unsafeTrue.length > 0) throw new Error("Phase 17B blocked flags cannot turn true.");
  if (!/auth_security_surfaces/i.test(result.signalFamilies.join(" ")) || !/privacy_retention_redaction/i.test(result.signalFamilies.join(" "))) throw new Error("Phase 17B repo-grounded signals are missing.");
  if (!/audits existing security signal families only/i.test(result.stopRules.join(" "))) throw new Error("Phase 17B stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not run pentests/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 17B AI boundary is missing.");
  if (!/auth\/access approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/pentest authorization/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 17B human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 17C â€” Manual Security Review Advisory Policy") throw new Error("Phase 17B must hand off to Phase 17C.");
  if (unsafePattern.test(text)) throw new Error("Phase 17B wording must not imply unsafe authorization.");
}

export function getPhase17SecuritySignalAuditSummary() {
  const result = getPhase17SecuritySignalAudit();
  return `${result.phase} / ${result.phaseStep}: audits existing auth, security review, privacy, retention, redaction, audit, provider safety, and route/API exposure signals for highest acquisition ROI per operator hour. Human-owned security judgment, privacy judgment, auth/access approval, vulnerability triage, remediation approval, pentest authorization, audit approval, provider approval, and go-live approval remain required. No live pentesting, no scans, no credential reads, no auth/security mutation, no audit writing, no provider activation, no go-live, and no new roadmap phase implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
