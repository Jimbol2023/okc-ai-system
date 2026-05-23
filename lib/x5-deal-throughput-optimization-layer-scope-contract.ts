export const x5DealThroughputFlags = {
  readOnly: true,
  advisoryOnly: true,
  humanReviewOnly: true,
  simulationOnly: true,
  providerCalled: false,
  sent: false,
  persistenceWritten: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  providerActivationAllowed: false,
  approvalGrantsExecution: false,
  throughputOptimizationExecutes: false,
  throughputOptimizationRoutesWork: false,
  throughputOptimizationAutomates: false,
  throughputOptimizationContacts: false,
  auditWritingAllowed: false,
} as const;

export const x5AdvisoryCategories = [
  "deal-throughput-review-needed",
  "stage-friction-review",
  "blocked-throughput-review",
  "assignment-readiness-review",
  "closing-readiness-review",
  "revenue-delay-review",
  "manual-optimization-review",
  "operator-throughput-coordination-needed",
  "missing-throughput-data-review",
  "high-impact-throughput-review",
  "operational-visibility-only",
  "advisory-throughput-optimization-only",
] as const;

export const x5DealThroughputDoctrines = [
  "deal throughput optimization doctrine",
  "manual throughput review doctrine",
  "stage friction visibility doctrine",
  "assignment and closing readiness doctrine",
  "revenue delay visibility doctrine",
  "optimization-does-not-execute doctrine",
  "optimization-does-not-route-work doctrine",
  "optimization-does-not-automate doctrine",
  "optimization-does-not-contact doctrine",
  "no-provider doctrine",
  "no-runtime doctrine",
  "no-persistence doctrine",
  "no-audit-writing doctrine",
  "accessibility requirements",
  "deterministic invariants",
  "fail-closed behavior",
] as const;

export const x5AccessibilityRequirements = {
  semanticHeadings: true,
  ariaLabelledby: true,
  readableLabels: true,
  textBasedStatusMeaning: true,
  noColorOnlyMeaning: true,
  noMotionDependency: true,
  noAutoRefresh: true,
  visibleGovernanceWarnings: true,
} as const;

export type X5ScopeInput = Partial<Record<"scopeReviewed" | "manualThroughputReviewed" | "stageFrictionReviewed" | "assignmentClosingReviewed" | "revenueDelayReviewed" | "noExecutionReviewed" | "noRoutingReviewed" | "noAutomationReviewed" | "noContactReviewed" | "noProviderReviewed" | "noRuntimeReviewed" | "noPersistenceReviewed" | "noAuditWritingReviewed" | "accessibilityReviewed" | "deterministicInvariantsReviewed" | "failClosedReviewed", boolean>> & Partial<Record<"executionRequested" | "routingRequested" | "automationRequested" | "contactRequested" | "providerRequested" | "runtimeRequested" | "persistenceRequested" | "auditWritingRequested" | "outreachRequested", boolean>>;
export type X5ScopeStatus = "x5_scope_blocked" | "operator_review_required" | "x5_scope_ready";

const requiredReviewAreas: Array<[keyof X5ScopeInput, string]> = [["scopeReviewed", "deal throughput optimization doctrine"], ["manualThroughputReviewed", "manual throughput review doctrine"], ["stageFrictionReviewed", "stage friction visibility doctrine"], ["assignmentClosingReviewed", "assignment and closing readiness doctrine"], ["revenueDelayReviewed", "revenue delay visibility doctrine"], ["noExecutionReviewed", "optimization-does-not-execute doctrine"], ["noRoutingReviewed", "optimization-does-not-route-work doctrine"], ["noAutomationReviewed", "optimization-does-not-automate doctrine"], ["noContactReviewed", "optimization-does-not-contact doctrine"], ["noProviderReviewed", "no-provider doctrine"], ["noRuntimeReviewed", "no-runtime doctrine"], ["noPersistenceReviewed", "no-persistence doctrine"], ["noAuditWritingReviewed", "no-audit-writing doctrine"], ["accessibilityReviewed", "accessibility requirements"], ["deterministicInvariantsReviewed", "deterministic invariants"], ["failClosedReviewed", "fail-closed behavior"]];
const blockedRequests: Array<[keyof X5ScopeInput, string]> = [["executionRequested", "deal throughput optimization cannot execute"], ["routingRequested", "deal throughput optimization cannot route work"], ["automationRequested", "deal throughput optimization cannot automate"], ["contactRequested", "deal throughput optimization cannot contact buyers or sellers"], ["providerRequested", "provider activation remains blocked"], ["runtimeRequested", "runtime jobs remain blocked"], ["persistenceRequested", "persistence remains blocked"], ["auditWritingRequested", "audit writing remains blocked"], ["outreachRequested", "outreach remains blocked"]];

export function createX5DealThroughputOptimizationLayerScopeContract(input: X5ScopeInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X5ScopeStatus = blockedReasons.length > 0 ? "x5_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x5_scope_ready";
  const result = { phase: "X5A" as const, status, flags: x5DealThroughputFlags, doctrines: x5DealThroughputDoctrines, categories: x5AdvisoryCategories, accessibility: x5AccessibilityRequirements, missingReviewAreas, blockedReasons };
  assertX5ScopeInvariants(result);
  return result;
}

export function assertX5ScopeInvariants(result: { flags: typeof x5DealThroughputFlags }): void {
  if (!result.flags.readOnly || !result.flags.advisoryOnly || !result.flags.humanReviewOnly || !result.flags.simulationOnly) throw new Error("X5A must remain read-only advisory human-review simulation");
  if (Object.entries(result.flags).some(([key, value]) => !["readOnly", "advisoryOnly", "humanReviewOnly", "simulationOnly"].includes(key) && value === true)) throw new Error("X5A cannot authorize execution, routing, automation, contact, providers, runtime, persistence, audit writing, or outreach");
}
