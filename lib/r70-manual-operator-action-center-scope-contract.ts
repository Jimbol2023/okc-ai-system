export const r70ScopeFlags = {
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
  providerClientAllowed: false,
  auditRecordsWritten: false,
  executionAllowedNow: false,
} as const;

export const r70AllowedConcepts = [
  "manual operator action center",
  "manual work visibility",
  "human-reviewed action recommendations",
  "revenue-priority advisory labels",
  "seller follow-up review recommended",
  "buyer disposition review recommended",
  "deal readiness review recommended",
  "stuck-deal review recommended",
  "near-close review recommended",
  "missing-data review recommended",
  "governance-blocked item",
  "manual next action suggestion",
  "daily revenue review queue",
  "future UI visibility only",
] as const;

export const r70DangerousWordingPatterns = [
  "send now",
  "call now",
  "text now",
  "email now",
  "approve and send",
  "execute action",
  "run workflow",
  "trigger provider",
  "activate Twilio",
  "start campaign",
  "auto-follow-up",
  "revenue-priority means execute",
  "dashboard action means execution",
] as const;

export const r70GovernanceBoundary = {
  governanceStopsOutrank: [
    "revenue priority",
    "operator priority",
    "seller urgency",
    "buyer readiness",
    "near-close status",
    "stuck-deal status",
    "AI recommendation",
    "workload pressure",
    "approval status",
    "simulation readiness",
    "provider readiness",
  ],
  recommendationsOnlyMean: [
    "human review may be useful",
    "manual decision required",
    "provider activation remains blocked",
    "runtime activation remains blocked",
    "polling remains blocked",
    "persistence remains blocked",
    "audit writing remains inactive",
    "execution remains blocked",
  ],
} as const;

export const r70AuditBoundary = {
  auditLayerActive: false,
  auditPersistenceAuthorizedNow: false,
  auditRecordsWrittenNow: false,
  wording: [
    "future audit log required",
    "audit layer not active yet",
    "audit persistence not authorized now",
    "no audit records are written in this phase",
    "operator audit doctrine only",
  ],
} as const;

export const r70InclusiveAccessibility = {
  semanticHeadings: true,
  clearSectionStructure: true,
  ariaLabelledby: true,
  ariaDescribedby: true,
  readableLabels: true,
  plainLanguageSummaries: true,
  textBasedStatusMeaning: true,
  noColorOnlyMeaning: true,
  sufficientSpacing: true,
  noMotionDependency: true,
  noFocusMovement: true,
  noAutoRefresh: true,
  noPolling: true,
  predictableReadingOrder: true,
  visibleGovernanceWarnings: true,
  noTinyUnreadableText: true,
  noCrampedControls: true,
} as const;

export type R70ScopeStatus = "manual_action_center_blocked" | "operator_review_required" | "manual_action_center_scope_ready";

export type R70ScopeInput = {
  manualOperatorDoctrineReviewed?: boolean;
  humanInControlReviewed?: boolean;
  advisoryOnlyReviewed?: boolean;
  revenuePriorityReviewed?: boolean;
  providerIsolationReviewed?: boolean;
  accessibilityReviewed?: boolean;
  auditBoundaryReviewed?: boolean;
  executionRequested?: boolean;
  providerRequested?: boolean;
  sendRequested?: boolean;
  runtimeRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  credentialEnvRequested?: boolean;
  fetchNetworkRequested?: boolean;
  campaignRequested?: boolean;
  revenueExecutionRequested?: boolean;
  recommendationExecutionRequested?: boolean;
};

export type R70ScopeResult = {
  phase: "R70A";
  status: R70ScopeStatus;
  flags: typeof r70ScopeFlags;
  allowedConcepts: typeof r70AllowedConcepts;
  dangerousWordingPatterns: typeof r70DangerousWordingPatterns;
  governanceBoundary: typeof r70GovernanceBoundary;
  auditBoundary: typeof r70AuditBoundary;
  accessibility: typeof r70InclusiveAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R70B - Manual Operator Action Center Drift / Execution Risk Audit";
};

const requiredReviewAreas: Array<[keyof R70ScopeInput, string]> = [
  ["manualOperatorDoctrineReviewed", "manual operator doctrine"],
  ["humanInControlReviewed", "human-in-control doctrine"],
  ["advisoryOnlyReviewed", "advisory-only doctrine"],
  ["revenuePriorityReviewed", "revenue-priority visibility"],
  ["providerIsolationReviewed", "provider isolation"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["auditBoundaryReviewed", "audit boundary"],
];

const blockedReasons: Array<[keyof R70ScopeInput, string]> = [
  ["executionRequested", "execution remains blocked"],
  ["providerRequested", "provider activation remains blocked"],
  ["sendRequested", "send/call/text/email remains blocked"],
  ["runtimeRequested", "runtime activation remains blocked"],
  ["pollingRequested", "polling remains blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
  ["credentialEnvRequested", "credential/env reads remain blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["campaignRequested", "campaign activation remains blocked"],
  ["revenueExecutionRequested", "revenue priority never grants execution"],
  ["recommendationExecutionRequested", "manual recommendations never grant execution"],
];

export function assertR70ScopeInvariants(result: R70ScopeResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R70A must remain read-only advisory simulation");
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
    flags.providerClientAllowed ||
    flags.auditRecordsWritten ||
    flags.executionAllowedNow
  ) {
    throw new Error("R70A cannot authorize execution, providers, credentials, env reads, fetch/network, persistence, polling, runtime, audit writing, or sending");
  }
}

export function createR70ManualOperatorActionCenterScopeContract(input: R70ScopeInput = {}): R70ScopeResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R70ScopeStatus =
    activeBlockedReasons.length > 0
      ? "manual_action_center_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "manual_action_center_scope_ready";
  const result: R70ScopeResult = {
    phase: "R70A",
    status,
    flags: r70ScopeFlags,
    allowedConcepts: r70AllowedConcepts,
    dangerousWordingPatterns: r70DangerousWordingPatterns,
    governanceBoundary: r70GovernanceBoundary,
    auditBoundary: r70AuditBoundary,
    accessibility: r70InclusiveAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R70B - Manual Operator Action Center Drift / Execution Risk Audit",
  };
  assertR70ScopeInvariants(result);
  return result;
}

export function summarizeR70ManualOperatorActionCenterScope(result: R70ScopeResult): string {
  assertR70ScopeInvariants(result);
  return `R70A ${result.status}: manual operator action center scope is advisory-only; recommendations, revenue priority, urgency, readiness, queue, and approval never grant execution, while providers, fetch/network, runtime, polling, persistence, audit writing, campaigns, and sending remain blocked.`;
}
