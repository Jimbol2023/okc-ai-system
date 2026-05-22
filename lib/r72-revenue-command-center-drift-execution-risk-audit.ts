export const r72DriftRiskCategories = [
  "revenue-priority-to-execution drift",
  "revenue-score-to-send drift",
  "near-close-to-execution drift",
  "stuck-deal-to-provider drift",
  "buyer-ready-to-outreach drift",
  "overdue-follow-up-to-send drift",
  "urgency-to-execution drift",
  "command-center-to-workflow drift",
  "recommendation-to-execution drift",
  "approval-to-execution drift",
  "provider-readiness-to-execution drift",
  "AI-suggestion-to-execution drift",
  "credential/env-read drift",
  "fetch/network drift",
  "provider-client drift",
  "runtime activation drift",
  "campaign drift",
  "persistence drift",
  "audit-writing drift",
  "dangerous wording drift",
  "hidden execution affordance drift",
] as const;

export const r72DriftForbiddenSemantics = [
  "execute now",
  "send now",
  "call now",
  "text now",
  "email now",
  "approve and send",
  "revenue score sends",
  "priority triggers workflow",
  "near-close executes",
  "buyer-ready contacts buyers",
  "stuck deal activates provider",
  "launch campaign",
  "start workflow",
  "activate provider",
  "create runtime job",
  "write audit record",
] as const;

export const r72DriftAuditFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  providerCalled: false,
  sent: false,
  executionAllowed: false,
  outreachAllowed: false,
  providerActivationAllowed: false,
  credentialEnvReadAllowed: false,
  fetchNetworkAllowed: false,
  providerClientAllowed: false,
  runtimeActivationAllowed: false,
  pollingAllowed: false,
  campaignAllowed: false,
  persistenceAllowedNow: false,
  auditWritingAllowed: false,
} as const;

export type R72DriftAuditStatus = "revenue_drift_blocked" | "operator_review_required" | "revenue_drift_audit_clear";

export type R72DriftAuditInput = {
  revenuePriorityToExecutionReviewed?: boolean;
  revenueScoreToSendReviewed?: boolean;
  nearCloseToExecutionReviewed?: boolean;
  stuckDealToProviderReviewed?: boolean;
  buyerReadyToOutreachReviewed?: boolean;
  overdueFollowUpToSendReviewed?: boolean;
  providerBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  revenuePriorityExecutionRequested?: boolean;
  revenueScoreSendRequested?: boolean;
  nearCloseExecutionRequested?: boolean;
  stuckDealProviderRequested?: boolean;
  buyerReadyOutreachRequested?: boolean;
  overdueFollowUpSendRequested?: boolean;
  urgencyExecutionRequested?: boolean;
  commandCenterWorkflowRequested?: boolean;
  recommendationExecutionRequested?: boolean;
  approvalExecutionRequested?: boolean;
  providerReadinessExecutionRequested?: boolean;
  aiSuggestionExecutionRequested?: boolean;
  envReadRequested?: boolean;
  fetchNetworkRequested?: boolean;
  providerClientRequested?: boolean;
  runtimeRequested?: boolean;
  campaignRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  hiddenExecutionAffordanceRequested?: boolean;
};

export type R72DriftAuditResult = {
  phase: "R72B";
  status: R72DriftAuditStatus;
  flags: typeof r72DriftAuditFlags;
  riskCategories: typeof r72DriftRiskCategories;
  forbiddenSemantics: typeof r72DriftForbiddenSemantics;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R72C - Revenue Command Center Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R72DriftAuditInput, string]> = [
  ["revenuePriorityToExecutionReviewed", "revenue-priority-to-execution"],
  ["revenueScoreToSendReviewed", "revenue-score-to-send"],
  ["nearCloseToExecutionReviewed", "near-close-to-execution"],
  ["stuckDealToProviderReviewed", "stuck-deal-to-provider"],
  ["buyerReadyToOutreachReviewed", "buyer-ready-to-outreach"],
  ["overdueFollowUpToSendReviewed", "overdue-follow-up-to-send"],
  ["providerBoundaryReviewed", "provider boundary"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R72DriftAuditInput, string]> = [
  ["revenuePriorityExecutionRequested", "revenue priority cannot execute"],
  ["revenueScoreSendRequested", "revenue score cannot send"],
  ["nearCloseExecutionRequested", "near-close status cannot execute"],
  ["stuckDealProviderRequested", "stuck-deal status cannot activate providers"],
  ["buyerReadyOutreachRequested", "buyer-ready status cannot trigger outreach"],
  ["overdueFollowUpSendRequested", "overdue follow-up cannot send"],
  ["urgencyExecutionRequested", "urgency cannot execute"],
  ["commandCenterWorkflowRequested", "command center cannot start workflows"],
  ["recommendationExecutionRequested", "recommendations cannot execute"],
  ["approvalExecutionRequested", "approval cannot execute"],
  ["providerReadinessExecutionRequested", "provider readiness cannot execute"],
  ["aiSuggestionExecutionRequested", "AI suggestion cannot execute"],
  ["envReadRequested", "credential and env reads remain blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["providerClientRequested", "provider clients remain blocked"],
  ["runtimeRequested", "runtime activation remains blocked"],
  ["campaignRequested", "campaigns remain blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
  ["hiddenExecutionAffordanceRequested", "hidden execution affordances remain forbidden"],
];

export function assertR72DriftAuditInvariants(result: R72DriftAuditResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R72B must remain read-only advisory simulation");
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.executionAllowed ||
    flags.outreachAllowed ||
    flags.providerActivationAllowed ||
    flags.credentialEnvReadAllowed ||
    flags.fetchNetworkAllowed ||
    flags.providerClientAllowed ||
    flags.runtimeActivationAllowed ||
    flags.pollingAllowed ||
    flags.campaignAllowed ||
    flags.persistenceAllowedNow ||
    flags.auditWritingAllowed
  ) {
    throw new Error("R72B drift audit cannot authorize execution, outreach, providers, fetch/network, runtime, polling, persistence, campaigns, or audit writing");
  }
}

export function createR72RevenueCommandCenterDriftExecutionRiskAudit(input: R72DriftAuditInput = {}): R72DriftAuditResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R72DriftAuditStatus =
    activeBlockedReasons.length > 0 ? "revenue_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "revenue_drift_audit_clear";
  const result: R72DriftAuditResult = {
    phase: "R72B",
    status,
    flags: r72DriftAuditFlags,
    riskCategories: r72DriftRiskCategories,
    forbiddenSemantics: r72DriftForbiddenSemantics,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R72C - Revenue Command Center Read-Only UI Scope Contract",
  };
  assertR72DriftAuditInvariants(result);
  return result;
}

export function summarizeR72RevenueCommandCenterDriftAudit(result: R72DriftAuditResult): string {
  assertR72DriftAuditInvariants(result);
  return `R72B ${result.status}: revenue command drift audit blocks revenue-priority, score, near-close, stuck-deal, buyer-ready, overdue follow-up, urgency, recommendation, approval, and provider-readiness signals from becoming execution, outreach, provider activation, campaigns, persistence, audit writing, or runtime work.`;
}
