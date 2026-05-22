export const r67AutomationDriftAuditFlags = {
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
  automationAllowedNow: false,
  executionAllowedNow: false,
} as const;

export const r67AutomationDriftRiskCategories = [
  "intelligence-to-permission drift",
  "approval-to-execution drift",
  "readiness-to-execution drift",
  "queue-to-execution drift",
  "urgency-to-execution drift",
  "score-to-execution drift",
  "revenue-to-execution drift",
  "provider activation drift",
  "runtime activation drift",
  "polling drift",
  "campaign drift",
  "hidden execution affordance drift",
] as const;

export const r67DangerousAutomationWordingPatterns = [
  "automate now",
  "send now",
  "approve and send",
  "approval sends message",
  "queue triggers workflow",
  "priority triggers workflow",
  "score triggers workflow",
  "urgency triggers workflow",
  "readiness triggers workflow",
  "launch campaign",
  "activate provider",
  "create execution queue",
  "create runtime job",
  "create polling loop",
  "autonomous routing",
] as const;

export const r67RiskAuditFindings = [
  "Approval states are high-risk if treated as permission rather than review status.",
  "Readiness and priority labels are high-risk if translated into workflow or provider actions.",
  "Queue pressure, urgency, and revenue opportunity are high-risk if used to trigger autonomous routing.",
  "Provider, runtime, polling, campaign, and background-worker language must remain blocked.",
  "Automation-last doctrine must fail closed whenever signal meaning is ambiguous.",
] as const;

export type R67AutomationDriftAuditStatus =
  | "automation_drift_audit_blocked"
  | "operator_review_required"
  | "automation_drift_audit_complete";

export type R67AutomationDriftAuditInput = {
  intelligenceSurfacesReviewed?: boolean;
  approvalSurfacesReviewed?: boolean;
  readinessSurfacesReviewed?: boolean;
  queueSurfacesReviewed?: boolean;
  urgencyRevenueSurfacesReviewed?: boolean;
  providerRuntimePollingRisksReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  failClosedReviewed?: boolean;
  automationPathRequested?: boolean;
  approvalToExecutionRequested?: boolean;
  readinessToExecutionRequested?: boolean;
  queueToExecutionRequested?: boolean;
  urgencyToExecutionRequested?: boolean;
  scoreToExecutionRequested?: boolean;
  revenueToExecutionRequested?: boolean;
  providerActivationRequested?: boolean;
  runtimeActivationRequested?: boolean;
  pollingRequested?: boolean;
  campaignRequested?: boolean;
  hiddenExecutionAffordanceRequested?: boolean;
};

export type R67AutomationDriftAuditResult = {
  phase: "R67B";
  status: R67AutomationDriftAuditStatus;
  flags: typeof r67AutomationDriftAuditFlags;
  riskCategories: typeof r67AutomationDriftRiskCategories;
  dangerousWordingPatterns: typeof r67DangerousAutomationWordingPatterns;
  auditFindings: typeof r67RiskAuditFindings;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R67C - Automation-Last Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R67AutomationDriftAuditInput, string]> = [
  ["intelligenceSurfacesReviewed", "intelligence surfaces"],
  ["approvalSurfacesReviewed", "approval surfaces"],
  ["readinessSurfacesReviewed", "readiness surfaces"],
  ["queueSurfacesReviewed", "queue surfaces"],
  ["urgencyRevenueSurfacesReviewed", "urgency and revenue surfaces"],
  ["providerRuntimePollingRisksReviewed", "provider/runtime/polling risks"],
  ["dangerousWordingReviewed", "dangerous wording"],
  ["failClosedReviewed", "fail-closed behavior"],
];

const blockedReasons: Array<[keyof R67AutomationDriftAuditInput, string]> = [
  ["automationPathRequested", "automation path creation is forbidden"],
  ["approvalToExecutionRequested", "approval-to-execution drift is forbidden"],
  ["readinessToExecutionRequested", "readiness-to-execution drift is forbidden"],
  ["queueToExecutionRequested", "queue-to-execution drift is forbidden"],
  ["urgencyToExecutionRequested", "urgency-to-execution drift is forbidden"],
  ["scoreToExecutionRequested", "score-to-execution drift is forbidden"],
  ["revenueToExecutionRequested", "revenue-to-execution drift is forbidden"],
  ["providerActivationRequested", "provider activation drift is forbidden"],
  ["runtimeActivationRequested", "runtime activation drift is forbidden"],
  ["pollingRequested", "polling drift is forbidden"],
  ["campaignRequested", "campaign drift is forbidden"],
  ["hiddenExecutionAffordanceRequested", "hidden execution affordance drift is forbidden"],
];

export function assertR67AutomationDriftAuditInvariants(result: R67AutomationDriftAuditResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) {
    throw new Error("R67B audit must remain read-only, advisory-only, and simulation-only");
  }
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.automationAllowedNow ||
    flags.executionAllowedNow
  ) {
    throw new Error("R67B cannot authorize execution, automation, providers, runtime, polling, persistence, or sending");
  }
}

export function createR67AutomationDriftPermissionRiskAudit(
  input: R67AutomationDriftAuditInput = {},
): R67AutomationDriftAuditResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R67AutomationDriftAuditStatus =
    activeBlockedReasons.length > 0
      ? "automation_drift_audit_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "automation_drift_audit_complete";

  const result: R67AutomationDriftAuditResult = {
    phase: "R67B",
    status,
    flags: r67AutomationDriftAuditFlags,
    riskCategories: r67AutomationDriftRiskCategories,
    dangerousWordingPatterns: r67DangerousAutomationWordingPatterns,
    auditFindings: r67RiskAuditFindings,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R67C - Automation-Last Read-Only UI Scope Contract",
  };
  assertR67AutomationDriftAuditInvariants(result);
  return result;
}

export function summarizeR67AutomationDriftPermissionRiskAudit(result: R67AutomationDriftAuditResult): string {
  assertR67AutomationDriftAuditInvariants(result);
  return `R67B ${result.status}: ${result.riskCategories.length} automation and permission drift categories audited; provider, runtime, polling, campaign, hidden control, and signal-to-execution drift remain blocked.`;
}
