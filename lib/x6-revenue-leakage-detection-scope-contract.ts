export const x6RevenueLeakageFlags = {
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
  leakageDetectionExecutes: false,
  leakageDetectionRoutesWork: false,
  leakageDetectionContacts: false,
  autonomousEscalationAllowed: false,
  auditWritingAllowed: false,
} as const;

export const x6AdvisoryCategories = [
  "stale-opportunity-review-needed",
  "blocked-revenue-review",
  "delayed-close-review",
  "missing-critical-data-review",
  "workflow-friction-review",
  "momentum-loss-review",
  "revenue-risk-review",
  "near-close-risk-review",
  "assignment-delay-review",
  "operational-visibility-only",
  "advisory-revenue-review-only",
] as const;

export const x6RevenueLeakageDoctrines = [
  "revenue leakage doctrine",
  "stale opportunity doctrine",
  "blocked revenue doctrine",
  "momentum-loss doctrine",
  "near-close-risk doctrine",
  "workflow-friction doctrine",
  "delayed-revenue doctrine",
  "human-review doctrine",
  "no-execution doctrine",
  "no-provider doctrine",
  "no-runtime doctrine",
  "no-routing doctrine",
  "no-contact doctrine",
  "no-persistence doctrine",
  "no-audit-writing doctrine",
  "accessibility requirements",
  "deterministic invariants",
  "fail-closed behavior",
] as const;

export const x6AccessibilityRequirements = {
  semanticHeadings: true,
  ariaLabelledby: true,
  readableLabels: true,
  textBasedStatusMeaning: true,
  noColorOnlyMeaning: true,
  noMotionDependency: true,
  noAutoRefresh: true,
  visibleGovernanceWarnings: true,
} as const;

export type X6ScopeInput = Partial<Record<"scopeReviewed" | "staleOpportunityReviewed" | "blockedRevenueReviewed" | "momentumLossReviewed" | "nearCloseRiskReviewed" | "workflowFrictionReviewed" | "delayedRevenueReviewed" | "humanReviewReviewed" | "noExecutionReviewed" | "noProviderReviewed" | "noRuntimeReviewed" | "noRoutingReviewed" | "noContactReviewed" | "noPersistenceReviewed" | "noAuditWritingReviewed" | "accessibilityReviewed" | "deterministicInvariantsReviewed" | "failClosedReviewed", boolean>> & Partial<Record<"executionRequested" | "providerRequested" | "runtimeRequested" | "routingRequested" | "contactRequested" | "persistenceRequested" | "auditWritingRequested" | "outreachRequested" | "automationRequested" | "autonomousEscalationRequested", boolean>>;
export type X6ScopeStatus = "x6_scope_blocked" | "operator_review_required" | "x6_scope_ready";

const requiredReviewAreas: Array<[keyof X6ScopeInput, string]> = [["scopeReviewed", "revenue leakage doctrine"], ["staleOpportunityReviewed", "stale opportunity doctrine"], ["blockedRevenueReviewed", "blocked revenue doctrine"], ["momentumLossReviewed", "momentum-loss doctrine"], ["nearCloseRiskReviewed", "near-close-risk doctrine"], ["workflowFrictionReviewed", "workflow-friction doctrine"], ["delayedRevenueReviewed", "delayed-revenue doctrine"], ["humanReviewReviewed", "human-review doctrine"], ["noExecutionReviewed", "no-execution doctrine"], ["noProviderReviewed", "no-provider doctrine"], ["noRuntimeReviewed", "no-runtime doctrine"], ["noRoutingReviewed", "no-routing doctrine"], ["noContactReviewed", "no-contact doctrine"], ["noPersistenceReviewed", "no-persistence doctrine"], ["noAuditWritingReviewed", "no-audit-writing doctrine"], ["accessibilityReviewed", "accessibility requirements"], ["deterministicInvariantsReviewed", "deterministic invariants"], ["failClosedReviewed", "fail-closed behavior"]];
const blockedRequests: Array<[keyof X6ScopeInput, string]> = [["executionRequested", "revenue leakage detection cannot execute"], ["providerRequested", "provider activation remains blocked"], ["runtimeRequested", "runtime jobs remain blocked"], ["routingRequested", "revenue leakage detection cannot route work"], ["contactRequested", "revenue leakage detection cannot contact buyers or sellers"], ["persistenceRequested", "persistence remains blocked"], ["auditWritingRequested", "audit writing remains blocked"], ["outreachRequested", "outreach remains blocked"], ["automationRequested", "workflow automation remains blocked"], ["autonomousEscalationRequested", "autonomous escalation remains blocked"]];

export function createX6RevenueLeakageDetectionScopeContract(input: X6ScopeInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X6ScopeStatus = blockedReasons.length > 0 ? "x6_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x6_scope_ready";
  const result = { phase: "X6A" as const, status, flags: x6RevenueLeakageFlags, doctrines: x6RevenueLeakageDoctrines, categories: x6AdvisoryCategories, accessibility: x6AccessibilityRequirements, missingReviewAreas, blockedReasons };
  assertX6ScopeInvariants(result);
  return result;
}

export function assertX6ScopeInvariants(result: { flags: typeof x6RevenueLeakageFlags }): void {
  if (!result.flags.readOnly || !result.flags.advisoryOnly || !result.flags.humanReviewOnly || !result.flags.simulationOnly) throw new Error("X6A must remain read-only advisory human-review simulation");
  if (Object.entries(result.flags).some(([key, value]) => !["readOnly", "advisoryOnly", "humanReviewOnly", "simulationOnly"].includes(key) && value === true)) throw new Error("X6A cannot authorize execution, routing, contact, providers, runtime, persistence, audit writing, outreach, automation, or autonomous escalation");
}
