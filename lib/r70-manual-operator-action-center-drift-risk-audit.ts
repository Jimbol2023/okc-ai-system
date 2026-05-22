export const r70DriftAuditFlags = {
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
  executionControlsAdded: false,
} as const;

export const r70DriftRiskCategories = [
  "recommendation-to-execution drift",
  "advisory-to-provider drift",
  "priority-to-send drift",
  "urgency-to-send drift",
  "queue-to-provider drift",
  "approval-to-send drift",
  "operator-click-to-execution drift",
  "AI recommendation drift",
  "provider/client drift",
  "fetch/network drift",
  "runtime activation drift",
  "persistence drift",
  "audit-writing drift",
  "hidden execution affordance drift",
] as const;

export const r70DangerousOperationalWording = [
  "send now",
  "call now",
  "approve and send",
  "execute action",
  "run workflow",
  "start campaign",
  "priority triggers workflow",
  "operator click executes",
  "AI recommendation executes",
] as const;

export type R70DriftAuditStatus = "manual_action_center_drift_blocked" | "operator_review_required" | "manual_action_center_drift_audit_passed";

export type R70DriftAuditInput = {
  r70aReviewed?: boolean;
  recommendationExecutionReviewed?: boolean;
  advisoryProviderReviewed?: boolean;
  priorityUrgencyQueueReviewed?: boolean;
  approvalClickReviewed?: boolean;
  aiRecommendationReviewed?: boolean;
  providerFetchReviewed?: boolean;
  runtimePersistenceAuditReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  recommendationExecutionDriftFound?: boolean;
  advisoryProviderDriftFound?: boolean;
  prioritySendDriftFound?: boolean;
  urgencySendDriftFound?: boolean;
  queueProviderDriftFound?: boolean;
  approvalSendDriftFound?: boolean;
  operatorClickExecutionDriftFound?: boolean;
  aiRecommendationDriftFound?: boolean;
  providerClientDriftFound?: boolean;
  fetchNetworkDriftFound?: boolean;
  runtimeDriftFound?: boolean;
  persistenceDriftFound?: boolean;
  auditWritingDriftFound?: boolean;
  hiddenExecutionAffordanceFound?: boolean;
};

export type R70DriftAuditResult = {
  phase: "R70B";
  status: R70DriftAuditStatus;
  flags: typeof r70DriftAuditFlags;
  riskCategories: typeof r70DriftRiskCategories;
  dangerousWording: typeof r70DangerousOperationalWording;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R70C - Manual Operator Action Center Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R70DriftAuditInput, string]> = [
  ["r70aReviewed", "R70A scope"],
  ["recommendationExecutionReviewed", "recommendation-to-execution"],
  ["advisoryProviderReviewed", "advisory-to-provider"],
  ["priorityUrgencyQueueReviewed", "priority/urgency/queue"],
  ["approvalClickReviewed", "approval/click drift"],
  ["aiRecommendationReviewed", "AI recommendation drift"],
  ["providerFetchReviewed", "provider/fetch"],
  ["runtimePersistenceAuditReviewed", "runtime/persistence/audit"],
  ["dangerousWordingReviewed", "dangerous wording"],
];

const blockedReasons: Array<[keyof R70DriftAuditInput, string]> = [
  ["recommendationExecutionDriftFound", "recommendation-to-execution drift found"],
  ["advisoryProviderDriftFound", "advisory-to-provider drift found"],
  ["prioritySendDriftFound", "priority-to-send drift found"],
  ["urgencySendDriftFound", "urgency-to-send drift found"],
  ["queueProviderDriftFound", "queue-to-provider drift found"],
  ["approvalSendDriftFound", "approval-to-send drift found"],
  ["operatorClickExecutionDriftFound", "operator-click-to-execution drift found"],
  ["aiRecommendationDriftFound", "AI recommendation drift found"],
  ["providerClientDriftFound", "provider/client drift found"],
  ["fetchNetworkDriftFound", "fetch/network drift found"],
  ["runtimeDriftFound", "runtime drift found"],
  ["persistenceDriftFound", "persistence drift found"],
  ["auditWritingDriftFound", "audit-writing drift found"],
  ["hiddenExecutionAffordanceFound", "hidden execution affordance found"],
];

export function assertR70DriftAuditInvariants(result: R70DriftAuditResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R70B must remain read-only advisory simulation");
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
    flags.auditRecordsWritten ||
    flags.executionControlsAdded
  ) {
    throw new Error("R70B cannot pass with execution/provider/fetch/runtime/persistence/audit drift");
  }
}

export function createR70ManualOperatorActionCenterDriftRiskAudit(input: R70DriftAuditInput = {}): R70DriftAuditResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R70DriftAuditStatus =
    activeBlockedReasons.length > 0
      ? "manual_action_center_drift_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "manual_action_center_drift_audit_passed";
  const result: R70DriftAuditResult = {
    phase: "R70B",
    status,
    flags: r70DriftAuditFlags,
    riskCategories: r70DriftRiskCategories,
    dangerousWording: r70DangerousOperationalWording,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R70C - Manual Operator Action Center Read-Only UI Scope Contract",
  };
  assertR70DriftAuditInvariants(result);
  return result;
}

export function summarizeR70ManualOperatorActionCenterDriftRiskAudit(result: R70DriftAuditResult): string {
  assertR70DriftAuditInvariants(result);
  return `R70B ${result.status}: manual action center drift risks were audited across recommendations, priorities, urgency, queues, approvals, clicks, AI guidance, providers, fetch/network, runtime, persistence, audit writing, and hidden affordances.`;
}
