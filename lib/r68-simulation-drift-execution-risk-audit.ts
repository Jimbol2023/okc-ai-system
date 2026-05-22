export const r68SimulationDriftAuditFlags = {
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
  auditPersistenceAllowedNow: false,
  auditRecordsWritten: false,
} as const;

export const r68SimulationDriftRisks = [
  "simulation-to-execution drift",
  "preview-to-provider drift",
  "approval-to-send drift",
  "readiness-to-execution drift",
  "queue-to-workflow drift",
  "urgency-to-workflow drift",
  "revenue-to-execution drift",
  "audit-writing drift",
  "persistence drift",
  "provider activation drift",
  "runtime activation drift",
  "polling drift",
  "dangerous wording drift",
] as const;

export const r68DangerousSimulationWording = [
  "simulation triggers execution",
  "preview triggers provider",
  "approve and send",
  "approval triggers execution",
  "queue triggers workflow",
  "score triggers workflow",
  "urgency triggers workflow",
  "readiness triggers workflow",
  "revenue opportunity triggers workflow",
  "write audit record",
  "persist simulation result",
  "create runtime job",
  "create polling loop",
] as const;

export type R68SimulationDriftAuditStatus =
  | "simulation_drift_audit_blocked"
  | "operator_review_required"
  | "simulation_drift_audit_complete";

export type R68SimulationDriftAuditInput = {
  simulationDriftReviewed?: boolean;
  providerDriftReviewed?: boolean;
  approvalSendRiskReviewed?: boolean;
  signalExecutionRisksReviewed?: boolean;
  auditPersistenceRisksReviewed?: boolean;
  runtimePollingRisksReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  simulationExecutionRequested?: boolean;
  previewProviderRequested?: boolean;
  approvalSendRequested?: boolean;
  readinessExecutionRequested?: boolean;
  queueWorkflowRequested?: boolean;
  urgencyWorkflowRequested?: boolean;
  revenueExecutionRequested?: boolean;
  auditWritingRequested?: boolean;
  persistenceRequested?: boolean;
  providerActivationRequested?: boolean;
  runtimeActivationRequested?: boolean;
  pollingRequested?: boolean;
};

export type R68SimulationDriftAuditResult = {
  phase: "R68B";
  status: R68SimulationDriftAuditStatus;
  flags: typeof r68SimulationDriftAuditFlags;
  driftRisks: typeof r68SimulationDriftRisks;
  dangerousWording: typeof r68DangerousSimulationWording;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R68C - Execution Simulation Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R68SimulationDriftAuditInput, string]> = [
  ["simulationDriftReviewed", "simulation-to-execution drift"],
  ["providerDriftReviewed", "preview-to-provider drift"],
  ["approvalSendRiskReviewed", "approval-to-send risk"],
  ["signalExecutionRisksReviewed", "signal-to-execution risks"],
  ["auditPersistenceRisksReviewed", "audit and persistence risks"],
  ["runtimePollingRisksReviewed", "runtime and polling risks"],
  ["dangerousWordingReviewed", "dangerous wording"],
];

const blockedReasons: Array<[keyof R68SimulationDriftAuditInput, string]> = [
  ["simulationExecutionRequested", "simulation-to-execution drift is forbidden"],
  ["previewProviderRequested", "preview-to-provider drift is forbidden"],
  ["approvalSendRequested", "approval-to-send drift is forbidden"],
  ["readinessExecutionRequested", "readiness-to-execution drift is forbidden"],
  ["queueWorkflowRequested", "queue-to-workflow drift is forbidden"],
  ["urgencyWorkflowRequested", "urgency-to-workflow drift is forbidden"],
  ["revenueExecutionRequested", "revenue-to-execution drift is forbidden"],
  ["auditWritingRequested", "audit-writing drift is forbidden"],
  ["persistenceRequested", "persistence drift is forbidden"],
  ["providerActivationRequested", "provider activation drift is forbidden"],
  ["runtimeActivationRequested", "runtime activation drift is forbidden"],
  ["pollingRequested", "polling drift is forbidden"],
];

export function assertR68SimulationDriftAuditInvariants(result: R68SimulationDriftAuditResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) {
    throw new Error("R68B must remain read-only, advisory-only, and simulation-only");
  }
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.auditPersistenceAllowedNow ||
    flags.auditRecordsWritten
  ) {
    throw new Error("R68B cannot authorize execution/provider/runtime/polling/persistence/audit-writing drift");
  }
}

export function createR68SimulationDriftExecutionRiskAudit(input: R68SimulationDriftAuditInput = {}): R68SimulationDriftAuditResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R68SimulationDriftAuditStatus =
    activeBlockedReasons.length > 0
      ? "simulation_drift_audit_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "simulation_drift_audit_complete";
  const result: R68SimulationDriftAuditResult = {
    phase: "R68B",
    status,
    flags: r68SimulationDriftAuditFlags,
    driftRisks: r68SimulationDriftRisks,
    dangerousWording: r68DangerousSimulationWording,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R68C - Execution Simulation Read-Only UI Scope Contract",
  };
  assertR68SimulationDriftAuditInvariants(result);
  return result;
}

export function summarizeR68SimulationDriftExecutionRiskAudit(result: R68SimulationDriftAuditResult): string {
  assertR68SimulationDriftAuditInvariants(result);
  return `R68B ${result.status}: simulation drift risks are audited and simulation-to-execution, preview-to-provider, audit-writing, persistence, runtime, and polling drift remain blocked.`;
}
