export const x4BuyerMatchingFlags = {
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
  buyerMatchingExecutes: false,
  buyerMatchingContacts: false,
  buyerMatchingRoutesWork: false,
  autonomousBuyerAssignmentAllowed: false,
  auditWritingAllowed: false,
} as const;

export const x4AdvisoryCategories = [
  "buyer-fit-review-needed",
  "assignment-readiness-review",
  "buyer-demand-review",
  "disposition-review-needed",
  "buyer-alignment-review",
  "buyer-capacity-review",
  "blocked-disposition-review",
  "missing-buyer-data-review",
  "revenue-throughput-review",
  "operational-visibility-only",
  "advisory-buyer-review-only",
] as const;

export const x4BuyerMatchingDoctrines = [
  "human-guided buyer matching doctrine",
  "buyer-fit review doctrine",
  "assignment-readiness doctrine",
  "buyer-demand review doctrine",
  "disposition visibility doctrine",
  "manual buyer coordination doctrine",
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

export const x4AccessibilityRequirements = {
  semanticHeadings: true,
  ariaLabelledby: true,
  readableLabels: true,
  textBasedStatusMeaning: true,
  noColorOnlyMeaning: true,
  noMotionDependency: true,
  noAutoRefresh: true,
  visibleGovernanceWarnings: true,
} as const;

export type X4ScopeInput = Partial<Record<"scopeReviewed" | "buyerFitReviewed" | "assignmentReadinessReviewed" | "buyerDemandReviewed" | "dispositionReviewed" | "manualBuyerCoordinationReviewed" | "noExecutionReviewed" | "noProviderReviewed" | "noRuntimeReviewed" | "noRoutingReviewed" | "noContactReviewed" | "noPersistenceReviewed" | "noAuditWritingReviewed" | "accessibilityReviewed" | "deterministicInvariantsReviewed" | "failClosedReviewed", boolean>> & Partial<Record<"executionRequested" | "providerRequested" | "runtimeRequested" | "routingRequested" | "contactRequested" | "persistenceRequested" | "auditWritingRequested" | "outreachRequested" | "automationRequested" | "autonomousAssignmentRequested", boolean>>;
export type X4ScopeStatus = "x4_scope_blocked" | "operator_review_required" | "x4_scope_ready";

const requiredReviewAreas: Array<[keyof X4ScopeInput, string]> = [["scopeReviewed", "human-guided buyer matching doctrine"], ["buyerFitReviewed", "buyer-fit review doctrine"], ["assignmentReadinessReviewed", "assignment-readiness doctrine"], ["buyerDemandReviewed", "buyer-demand review doctrine"], ["dispositionReviewed", "disposition visibility doctrine"], ["manualBuyerCoordinationReviewed", "manual buyer coordination doctrine"], ["noExecutionReviewed", "no-execution doctrine"], ["noProviderReviewed", "no-provider doctrine"], ["noRuntimeReviewed", "no-runtime doctrine"], ["noRoutingReviewed", "no-routing doctrine"], ["noContactReviewed", "no-contact doctrine"], ["noPersistenceReviewed", "no-persistence doctrine"], ["noAuditWritingReviewed", "no-audit-writing doctrine"], ["accessibilityReviewed", "accessibility requirements"], ["deterministicInvariantsReviewed", "deterministic invariants"], ["failClosedReviewed", "fail-closed behavior"]];
const blockedRequests: Array<[keyof X4ScopeInput, string]> = [["executionRequested", "buyer matching cannot execute"], ["providerRequested", "provider activation remains blocked"], ["runtimeRequested", "runtime jobs remain blocked"], ["routingRequested", "buyer matching cannot route work"], ["contactRequested", "buyer matching cannot contact buyers or sellers"], ["persistenceRequested", "persistence remains blocked"], ["auditWritingRequested", "audit writing remains blocked"], ["outreachRequested", "buyer outreach remains blocked"], ["automationRequested", "workflow automation remains blocked"], ["autonomousAssignmentRequested", "autonomous buyer assignment remains blocked"]];

export function createX4HumanGuidedBuyerMatchingOperationsScopeContract(input: X4ScopeInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X4ScopeStatus = blockedReasons.length > 0 ? "x4_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x4_scope_ready";
  const result = { phase: "X4A" as const, status, flags: x4BuyerMatchingFlags, doctrines: x4BuyerMatchingDoctrines, categories: x4AdvisoryCategories, accessibility: x4AccessibilityRequirements, missingReviewAreas, blockedReasons };
  assertX4ScopeInvariants(result);
  return result;
}

export function assertX4ScopeInvariants(result: { flags: typeof x4BuyerMatchingFlags }): void {
  if (!result.flags.readOnly || !result.flags.advisoryOnly || !result.flags.humanReviewOnly || !result.flags.simulationOnly) throw new Error("X4A must remain read-only advisory human-review simulation");
  if (Object.entries(result.flags).some(([key, value]) => !["readOnly", "advisoryOnly", "humanReviewOnly", "simulationOnly"].includes(key) && value === true)) throw new Error("X4A cannot authorize execution, contact, routing, providers, runtime, persistence, audit writing, outreach, automation, or autonomous assignment");
}
