export const r71DriftAuditFlags = {
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
  outreachAuthorizedNow: false,
  smsAllowedNow: false,
  emailAllowedNow: false,
  callAllowedNow: false,
  campaignAllowedNow: false,
  fetchNetworkAllowed: false,
  auditRecordsWritten: false,
} as const;

export const r71DriftRiskCategories = [
  "preparation-to-send drift",
  "approval-to-send drift",
  "message-preview-to-send drift",
  "call-prep-to-call drift",
  "queue-to-outreach drift",
  "urgency-to-outreach drift",
  "revenue-to-outreach drift",
  "provider readiness-to-send drift",
  "AI suggestion-to-send drift",
  "human action center-to-send drift",
  "credential/env-read drift",
  "fetch/network drift",
  "provider-client drift",
  "runtime activation drift",
  "campaign drift",
  "persistence drift",
  "audit-writing drift",
  "dangerous wording drift",
] as const;

export type R71DriftAuditStatus = "controlled_outreach_drift_blocked" | "operator_review_required" | "controlled_outreach_drift_audit_passed";

export type R71DriftAuditInput = {
  r71aReviewed?: boolean;
  preparationSendReviewed?: boolean;
  approvalPreviewCallReviewed?: boolean;
  queueUrgencyRevenueReviewed?: boolean;
  providerAiActionCenterReviewed?: boolean;
  credentialEnvFetchReviewed?: boolean;
  runtimeCampaignPersistenceAuditReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  preparationSendDriftFound?: boolean;
  approvalSendDriftFound?: boolean;
  messagePreviewSendDriftFound?: boolean;
  callPrepCallDriftFound?: boolean;
  queueOutreachDriftFound?: boolean;
  urgencyOutreachDriftFound?: boolean;
  revenueOutreachDriftFound?: boolean;
  providerReadinessSendDriftFound?: boolean;
  aiSuggestionSendDriftFound?: boolean;
  actionCenterSendDriftFound?: boolean;
  credentialEnvDriftFound?: boolean;
  fetchNetworkDriftFound?: boolean;
  providerClientDriftFound?: boolean;
  runtimeDriftFound?: boolean;
  campaignDriftFound?: boolean;
  persistenceDriftFound?: boolean;
  auditWritingDriftFound?: boolean;
  dangerousWordingFound?: boolean;
};

export type R71DriftAuditResult = {
  phase: "R71B";
  status: R71DriftAuditStatus;
  flags: typeof r71DriftAuditFlags;
  riskCategories: typeof r71DriftRiskCategories;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R71C - Controlled Human Outreach Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R71DriftAuditInput, string]> = [
  ["r71aReviewed", "R71A scope"],
  ["preparationSendReviewed", "preparation-to-send"],
  ["approvalPreviewCallReviewed", "approval/preview/call-prep"],
  ["queueUrgencyRevenueReviewed", "queue/urgency/revenue"],
  ["providerAiActionCenterReviewed", "provider/AI/action center"],
  ["credentialEnvFetchReviewed", "credential/env/fetch"],
  ["runtimeCampaignPersistenceAuditReviewed", "runtime/campaign/persistence/audit"],
  ["dangerousWordingReviewed", "dangerous wording"],
];

const blockedReasons: Array<[keyof R71DriftAuditInput, string]> = [
  ["preparationSendDriftFound", "preparation-to-send drift found"],
  ["approvalSendDriftFound", "approval-to-send drift found"],
  ["messagePreviewSendDriftFound", "message-preview-to-send drift found"],
  ["callPrepCallDriftFound", "call-prep-to-call drift found"],
  ["queueOutreachDriftFound", "queue-to-outreach drift found"],
  ["urgencyOutreachDriftFound", "urgency-to-outreach drift found"],
  ["revenueOutreachDriftFound", "revenue-to-outreach drift found"],
  ["providerReadinessSendDriftFound", "provider readiness-to-send drift found"],
  ["aiSuggestionSendDriftFound", "AI suggestion-to-send drift found"],
  ["actionCenterSendDriftFound", "human action center-to-send drift found"],
  ["credentialEnvDriftFound", "credential/env-read drift found"],
  ["fetchNetworkDriftFound", "fetch/network drift found"],
  ["providerClientDriftFound", "provider-client drift found"],
  ["runtimeDriftFound", "runtime drift found"],
  ["campaignDriftFound", "campaign drift found"],
  ["persistenceDriftFound", "persistence drift found"],
  ["auditWritingDriftFound", "audit-writing drift found"],
  ["dangerousWordingFound", "dangerous wording found"],
];

export function assertR71DriftAuditInvariants(result: R71DriftAuditResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R71B must remain read-only advisory simulation");
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.outreachAuthorizedNow ||
    flags.smsAllowedNow ||
    flags.emailAllowedNow ||
    flags.callAllowedNow ||
    flags.campaignAllowedNow ||
    flags.fetchNetworkAllowed ||
    flags.auditRecordsWritten
  ) {
    throw new Error("R71B cannot pass with outreach, send, provider, fetch/network, runtime, campaign, persistence, audit, or execution drift");
  }
}

export function createR71ControlledHumanOutreachDriftSendRiskAudit(input: R71DriftAuditInput = {}): R71DriftAuditResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R71DriftAuditStatus =
    activeBlockedReasons.length > 0 ? "controlled_outreach_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "controlled_outreach_drift_audit_passed";
  const result: R71DriftAuditResult = {
    phase: "R71B",
    status,
    flags: r71DriftAuditFlags,
    riskCategories: r71DriftRiskCategories,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R71C - Controlled Human Outreach Read-Only UI Scope Contract",
  };
  assertR71DriftAuditInvariants(result);
  return result;
}

export function summarizeR71ControlledHumanOutreachDriftSendRiskAudit(result: R71DriftAuditResult): string {
  assertR71DriftAuditInvariants(result);
  return `R71B ${result.status}: controlled outreach drift risks were audited across preparation, approval, preview, call prep, queue, urgency, revenue, providers, AI suggestions, action center signals, credentials, fetch/network, runtime, campaigns, persistence, audit writing, and wording.`;
}
