export const r69ProviderDriftAuditFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  providerCalled: false,
  sent: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  providerActivationAllowed: false,
  approvalGrantsExecution: false,
  providerCredentialsAccessed: false,
  providerEnvReadAllowed: false,
  fetchNetworkAllowed: false,
  auditRecordsWritten: false,
} as const;

export const r69ProviderDriftRiskCategories = [
  "provider readiness-to-activation drift",
  "preview-to-provider drift",
  "simulation-to-provider drift",
  "approval-to-provider drift",
  "queue-to-provider drift",
  "urgency-to-provider drift",
  "revenue-to-provider drift",
  "credential/env-read drift",
  "fetch/network drift",
  "runtime activation drift",
  "polling drift",
  "audit-writing drift",
  "dangerous wording drift",
] as const;

export const r69ProviderDangerousWordingPatterns = [
  "provider-ready means send",
  "approve and send",
  "activate provider",
  "activate Twilio",
  "send SMS",
  "send email",
  "read provider credentials",
  "read provider env vars",
  "create provider client",
  "create fetch call",
  "simulation triggers provider",
  "preview triggers provider",
  "queue triggers provider",
  "score triggers provider",
  "urgency triggers provider",
  "revenue opportunity triggers provider",
] as const;

export type R69ProviderDriftAuditStatus =
  | "provider_drift_audit_blocked"
  | "operator_review_required"
  | "provider_drift_audit_passed";

export type R69ProviderDriftAuditInput = {
  r69aReviewed?: boolean;
  readinessActivationReviewed?: boolean;
  previewSimulationReviewed?: boolean;
  approvalQueueUrgencyRevenueReviewed?: boolean;
  credentialEnvReviewed?: boolean;
  fetchNetworkReviewed?: boolean;
  runtimePollingReviewed?: boolean;
  auditWritingReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  providerActivationDriftFound?: boolean;
  previewProviderDriftFound?: boolean;
  simulationProviderDriftFound?: boolean;
  approvalProviderDriftFound?: boolean;
  queueProviderDriftFound?: boolean;
  urgencyProviderDriftFound?: boolean;
  revenueProviderDriftFound?: boolean;
  credentialEnvDriftFound?: boolean;
  fetchNetworkDriftFound?: boolean;
  runtimeDriftFound?: boolean;
  pollingDriftFound?: boolean;
  auditWritingDriftFound?: boolean;
  dangerousWordingFound?: boolean;
};

export type R69ProviderDriftAuditResult = {
  phase: "R69B";
  status: R69ProviderDriftAuditStatus;
  flags: typeof r69ProviderDriftAuditFlags;
  riskCategories: typeof r69ProviderDriftRiskCategories;
  dangerousWordingPatterns: typeof r69ProviderDangerousWordingPatterns;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R69C - Provider Isolation Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R69ProviderDriftAuditInput, string]> = [
  ["r69aReviewed", "R69A scope"],
  ["readinessActivationReviewed", "readiness-to-activation"],
  ["previewSimulationReviewed", "preview/simulation-to-provider"],
  ["approvalQueueUrgencyRevenueReviewed", "approval/queue/urgency/revenue"],
  ["credentialEnvReviewed", "credential/env-read"],
  ["fetchNetworkReviewed", "fetch/network"],
  ["runtimePollingReviewed", "runtime/polling"],
  ["auditWritingReviewed", "audit writing"],
  ["dangerousWordingReviewed", "dangerous wording"],
];

const blockedReasons: Array<[keyof R69ProviderDriftAuditInput, string]> = [
  ["providerActivationDriftFound", "provider activation drift found"],
  ["previewProviderDriftFound", "preview-to-provider drift found"],
  ["simulationProviderDriftFound", "simulation-to-provider drift found"],
  ["approvalProviderDriftFound", "approval-to-provider drift found"],
  ["queueProviderDriftFound", "queue-to-provider drift found"],
  ["urgencyProviderDriftFound", "urgency-to-provider drift found"],
  ["revenueProviderDriftFound", "revenue-to-provider drift found"],
  ["credentialEnvDriftFound", "credential/env-read drift found"],
  ["fetchNetworkDriftFound", "fetch/network drift found"],
  ["runtimeDriftFound", "runtime drift found"],
  ["pollingDriftFound", "polling drift found"],
  ["auditWritingDriftFound", "audit-writing drift found"],
  ["dangerousWordingFound", "dangerous wording found"],
];

export function assertR69ProviderDriftAuditInvariants(result: R69ProviderDriftAuditResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) {
    throw new Error("R69B must remain read-only, advisory-only, and simulation-only");
  }
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.providerCredentialsAccessed ||
    flags.providerEnvReadAllowed ||
    flags.fetchNetworkAllowed ||
    flags.auditRecordsWritten
  ) {
    throw new Error("R69B cannot pass with provider, credential, env, fetch/network, runtime, polling, persistence, audit, send, or execution drift");
  }
}

export function createR69ProviderDriftActivationRiskAudit(
  input: R69ProviderDriftAuditInput = {},
): R69ProviderDriftAuditResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R69ProviderDriftAuditStatus =
    activeBlockedReasons.length > 0
      ? "provider_drift_audit_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "provider_drift_audit_passed";
  const result: R69ProviderDriftAuditResult = {
    phase: "R69B",
    status,
    flags: r69ProviderDriftAuditFlags,
    riskCategories: r69ProviderDriftRiskCategories,
    dangerousWordingPatterns: r69ProviderDangerousWordingPatterns,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R69C - Provider Isolation Read-Only UI Scope Contract",
  };
  assertR69ProviderDriftAuditInvariants(result);
  return result;
}

export function summarizeR69ProviderDriftActivationRiskAudit(result: R69ProviderDriftAuditResult): string {
  assertR69ProviderDriftAuditInvariants(result);
  return `R69B ${result.status}: provider readiness, preview, simulation, approval, queue, urgency, revenue, credential/env, fetch/network, runtime, polling, audit-writing, and dangerous wording drift risks were audited.`;
}
