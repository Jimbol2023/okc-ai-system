export const r73DriftRiskCategories = [
  "readiness-to-activation drift",
  "readiness-to-send drift",
  "provider-ready-to-provider drift",
  "approval-to-send drift",
  "AI-recommendation-to-provider drift",
  "queue-to-provider drift",
  "urgency-to-provider drift",
  "revenue-pressure-to-provider drift",
  "simulation-to-provider drift",
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

export const r73DriftAuditFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  providerCalled: false,
  sent: false,
  providerActivationAllowed: false,
  providerClientAllowed: false,
  credentialEnvReadAllowed: false,
  fetchNetworkAllowed: false,
  executionAllowed: false,
  outreachAllowed: false,
  runtimeActivationAllowed: false,
  pollingAllowed: false,
  campaignAllowed: false,
  persistenceAllowedNow: false,
  auditWritingAllowed: false,
} as const;

export type R73DriftStatus = "provider_readiness_drift_blocked" | "operator_review_required" | "provider_readiness_drift_clear";

export type R73DriftInput = {
  readinessToActivationReviewed?: boolean;
  providerReadyToProviderReviewed?: boolean;
  credentialBoundaryReviewed?: boolean;
  fetchNetworkBoundaryReviewed?: boolean;
  runtimeBoundaryReviewed?: boolean;
  campaignBoundaryReviewed?: boolean;
  auditBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  readinessActivationRequested?: boolean;
  readinessSendRequested?: boolean;
  providerReadyProviderRequested?: boolean;
  approvalSendRequested?: boolean;
  aiRecommendationProviderRequested?: boolean;
  queueProviderRequested?: boolean;
  urgencyProviderRequested?: boolean;
  revenuePressureProviderRequested?: boolean;
  simulationProviderRequested?: boolean;
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

export type R73DriftResult = {
  phase: "R73B";
  status: R73DriftStatus;
  flags: typeof r73DriftAuditFlags;
  riskCategories: typeof r73DriftRiskCategories;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R73C - Controlled Provider Activation Readiness Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R73DriftInput, string]> = [
  ["readinessToActivationReviewed", "readiness-to-activation"],
  ["providerReadyToProviderReviewed", "provider-ready-to-provider"],
  ["credentialBoundaryReviewed", "credential/env boundary"],
  ["fetchNetworkBoundaryReviewed", "fetch/network boundary"],
  ["runtimeBoundaryReviewed", "runtime boundary"],
  ["campaignBoundaryReviewed", "campaign boundary"],
  ["auditBoundaryReviewed", "audit boundary"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R73DriftInput, string]> = [
  ["readinessActivationRequested", "readiness cannot activate providers"],
  ["readinessSendRequested", "readiness cannot send"],
  ["providerReadyProviderRequested", "provider-ready status cannot reach providers"],
  ["approvalSendRequested", "approval cannot send"],
  ["aiRecommendationProviderRequested", "AI recommendation cannot activate providers"],
  ["queueProviderRequested", "queue cannot activate providers"],
  ["urgencyProviderRequested", "urgency cannot activate providers"],
  ["revenuePressureProviderRequested", "revenue pressure cannot activate providers"],
  ["simulationProviderRequested", "simulation cannot activate providers"],
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

export function assertR73DriftInvariants(result: R73DriftResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R73B must remain read-only advisory simulation");
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.providerActivationAllowed ||
    flags.providerClientAllowed ||
    flags.credentialEnvReadAllowed ||
    flags.fetchNetworkAllowed ||
    flags.executionAllowed ||
    flags.outreachAllowed ||
    flags.runtimeActivationAllowed ||
    flags.pollingAllowed ||
    flags.campaignAllowed ||
    flags.persistenceAllowedNow ||
    flags.auditWritingAllowed
  ) {
    throw new Error("R73B cannot authorize provider reachability, execution, outreach, runtime, polling, persistence, campaigns, or audit writing");
  }
}

export function createR73ProviderActivationReadinessDriftRiskAudit(input: R73DriftInput = {}): R73DriftResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R73DriftStatus =
    activeBlockedReasons.length > 0 ? "provider_readiness_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "provider_readiness_drift_clear";
  const result: R73DriftResult = {
    phase: "R73B",
    status,
    flags: r73DriftAuditFlags,
    riskCategories: r73DriftRiskCategories,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R73C - Controlled Provider Activation Readiness Read-Only UI Scope Contract",
  };
  assertR73DriftInvariants(result);
  return result;
}

export function summarizeR73ProviderActivationReadinessDriftAudit(result: R73DriftResult): string {
  assertR73DriftInvariants(result);
  return `R73B ${result.status}: provider readiness drift audit blocks readiness, approval, AI recommendation, queue, urgency, revenue pressure, simulation, and preview signals from activating providers, sending, creating clients, reading credentials, using fetch/network, launching campaigns, writing audit records, or executing.`;
}
