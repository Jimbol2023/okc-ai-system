export const r74DriftRiskCategories = [
  "approval-to-execution drift",
  "recommendation-to-execution drift",
  "readiness-to-send drift",
  "provider-readiness-to-provider drift",
  "queue-to-autonomy drift",
  "urgency-to-autonomy drift",
  "revenue-pressure-to-autonomy drift",
  "AI-recommendation-to-execution drift",
  "workflow-to-automation drift",
  "simulation-to-execution drift",
  "preview-to-provider drift",
  "provider-client drift",
  "credential/env-read drift",
  "fetch/network drift",
  "runtime activation drift",
  "campaign drift",
  "persistence drift",
  "audit-writing drift",
  "dangerous wording drift",
  "hidden execution affordance drift",
] as const;

export const r74DriftFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  providerCalled: false,
  sent: false,
  autonomousExecutionAllowed: false,
  executionAllowed: false,
  outreachAllowed: false,
  providerActivationAllowed: false,
  providerClientAllowed: false,
  credentialEnvReadAllowed: false,
  fetchNetworkAllowed: false,
  runtimeActivationAllowed: false,
  pollingAllowed: false,
  campaignAllowed: false,
  persistenceAllowedNow: false,
  auditWritingAllowed: false,
} as const;

export type R74DriftStatus = "hitl_drift_blocked" | "operator_review_required" | "hitl_drift_audit_clear";

export type R74DriftInput = {
  approvalToExecutionReviewed?: boolean;
  recommendationToExecutionReviewed?: boolean;
  readinessToSendReviewed?: boolean;
  providerReadinessReviewed?: boolean;
  autonomyBoundaryReviewed?: boolean;
  workflowAutomationReviewed?: boolean;
  providerBoundaryReviewed?: boolean;
  auditBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  approvalExecutionRequested?: boolean;
  recommendationExecutionRequested?: boolean;
  readinessSendRequested?: boolean;
  providerReadinessProviderRequested?: boolean;
  queueAutonomyRequested?: boolean;
  urgencyAutonomyRequested?: boolean;
  revenuePressureAutonomyRequested?: boolean;
  aiRecommendationExecutionRequested?: boolean;
  workflowAutomationRequested?: boolean;
  simulationExecutionRequested?: boolean;
  previewProviderRequested?: boolean;
  providerClientRequested?: boolean;
  credentialEnvReadRequested?: boolean;
  fetchNetworkRequested?: boolean;
  runtimeRequested?: boolean;
  campaignRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  hiddenExecutionAffordanceRequested?: boolean;
};

export type R74DriftResult = {
  phase: "R74B";
  status: R74DriftStatus;
  flags: typeof r74DriftFlags;
  riskCategories: typeof r74DriftRiskCategories;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R74C - HITL Revenue Execution Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R74DriftInput, string]> = [
  ["approvalToExecutionReviewed", "approval-to-execution"],
  ["recommendationToExecutionReviewed", "recommendation-to-execution"],
  ["readinessToSendReviewed", "readiness-to-send"],
  ["providerReadinessReviewed", "provider-readiness boundary"],
  ["autonomyBoundaryReviewed", "autonomy boundary"],
  ["workflowAutomationReviewed", "workflow-to-automation"],
  ["providerBoundaryReviewed", "provider boundary"],
  ["auditBoundaryReviewed", "audit boundary"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R74DriftInput, string]> = [
  ["approvalExecutionRequested", "approval cannot execute"],
  ["recommendationExecutionRequested", "recommendations cannot execute"],
  ["readinessSendRequested", "readiness cannot send"],
  ["providerReadinessProviderRequested", "provider readiness cannot reach providers"],
  ["queueAutonomyRequested", "queue cannot create autonomy"],
  ["urgencyAutonomyRequested", "urgency cannot create autonomy"],
  ["revenuePressureAutonomyRequested", "revenue pressure cannot create autonomy"],
  ["aiRecommendationExecutionRequested", "AI recommendation cannot execute"],
  ["workflowAutomationRequested", "workflow review cannot create automation"],
  ["simulationExecutionRequested", "simulation cannot execute"],
  ["previewProviderRequested", "preview cannot activate providers"],
  ["providerClientRequested", "provider clients remain blocked"],
  ["credentialEnvReadRequested", "credential and env reads remain blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["runtimeRequested", "runtime activation remains blocked"],
  ["campaignRequested", "campaigns remain blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
  ["hiddenExecutionAffordanceRequested", "hidden execution affordances remain forbidden"],
];

export function assertR74DriftInvariants(result: R74DriftResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R74B must remain read-only advisory simulation");
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.autonomousExecutionAllowed ||
    flags.executionAllowed ||
    flags.outreachAllowed ||
    flags.providerActivationAllowed ||
    flags.providerClientAllowed ||
    flags.credentialEnvReadAllowed ||
    flags.fetchNetworkAllowed ||
    flags.runtimeActivationAllowed ||
    flags.pollingAllowed ||
    flags.campaignAllowed ||
    flags.persistenceAllowedNow ||
    flags.auditWritingAllowed
  ) {
    throw new Error("R74B cannot authorize execution, autonomy, provider reachability, runtime, polling, campaigns, persistence, or audit writing");
  }
}

export function createR74HitlRevenueExecutionDriftRiskAudit(input: R74DriftInput = {}): R74DriftResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R74DriftStatus =
    activeBlockedReasons.length > 0 ? "hitl_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "hitl_drift_audit_clear";
  const result: R74DriftResult = {
    phase: "R74B",
    status,
    flags: r74DriftFlags,
    riskCategories: r74DriftRiskCategories,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R74C - HITL Revenue Execution Read-Only UI Scope Contract",
  };
  assertR74DriftInvariants(result);
  return result;
}

export function summarizeR74HitlRevenueExecutionDriftAudit(result: R74DriftResult): string {
  assertR74DriftInvariants(result);
  return `R74B ${result.status}: HITL drift audit blocks approval, recommendations, readiness, queue, urgency, revenue pressure, workflow review, simulation, and preview from becoming autonomous execution, provider activation, campaigns, runtime work, persistence, audit writing, or network reachability.`;
}
