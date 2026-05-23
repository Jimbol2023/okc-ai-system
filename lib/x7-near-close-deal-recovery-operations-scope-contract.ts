export const x7NearCloseDealRecoveryFlags = {
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
  nearCloseRecoveryExecutes: false,
  nearCloseRecoveryRoutesWork: false,
  nearCloseRecoveryContacts: false,
  nearCloseRecoveryAutomates: false,
  autonomousEscalationAllowed: false,
  auditWritingAllowed: false,
} as const;

export const x7AdvisoryCategories = [
  "near-close-recovery-review-needed",
  "closing-risk-review",
  "assignment-risk-review",
  "stalled-near-close-review",
  "blocked-closing-review",
  "missing-closing-data-review",
  "manual-recovery-review",
  "buyer-readiness-review",
  "seller-readiness-review",
  "operational-visibility-only",
  "advisory-near-close-review-only",
] as const;

export const x7NearCloseDealRecoveryDoctrines = [
  "near-close deal recovery doctrine",
  "manual recovery review doctrine",
  "closing readiness doctrine",
  "assignment readiness doctrine",
  "buyer readiness doctrine",
  "seller readiness doctrine",
  "recovery-does-not-execute doctrine",
  "recovery-does-not-route-work doctrine",
  "recovery-does-not-automate doctrine",
  "recovery-does-not-contact doctrine",
  "no-provider doctrine",
  "no-runtime doctrine",
  "no-persistence doctrine",
  "no-audit-writing doctrine",
  "accessibility requirements",
  "deterministic invariants",
  "fail-closed behavior",
] as const;

export const x7AccessibilityRequirements = {
  semanticHeadings: true,
  ariaLabelledby: true,
  readableLabels: true,
  textBasedStatusMeaning: true,
  noColorOnlyMeaning: true,
  noMotionDependency: true,
  noAutoRefresh: true,
  visibleGovernanceWarnings: true,
} as const;

export type X7ScopeInput = Partial<Record<"scopeReviewed" | "manualRecoveryReviewed" | "closingReadinessReviewed" | "assignmentReadinessReviewed" | "buyerReadinessReviewed" | "sellerReadinessReviewed" | "noExecutionReviewed" | "noRoutingReviewed" | "noAutomationReviewed" | "noContactReviewed" | "noProviderReviewed" | "noRuntimeReviewed" | "noPersistenceReviewed" | "noAuditWritingReviewed" | "accessibilityReviewed" | "deterministicInvariantsReviewed" | "failClosedReviewed", boolean>> & Partial<Record<"executionRequested" | "routingRequested" | "automationRequested" | "contactRequested" | "providerRequested" | "runtimeRequested" | "persistenceRequested" | "auditWritingRequested" | "outreachRequested" | "autonomousEscalationRequested", boolean>>;
export type X7ScopeStatus = "x7_scope_blocked" | "operator_review_required" | "x7_scope_ready";

const requiredReviewAreas: Array<[keyof X7ScopeInput, string]> = [["scopeReviewed", "near-close deal recovery doctrine"], ["manualRecoveryReviewed", "manual recovery review doctrine"], ["closingReadinessReviewed", "closing readiness doctrine"], ["assignmentReadinessReviewed", "assignment readiness doctrine"], ["buyerReadinessReviewed", "buyer readiness doctrine"], ["sellerReadinessReviewed", "seller readiness doctrine"], ["noExecutionReviewed", "recovery-does-not-execute doctrine"], ["noRoutingReviewed", "recovery-does-not-route-work doctrine"], ["noAutomationReviewed", "recovery-does-not-automate doctrine"], ["noContactReviewed", "recovery-does-not-contact doctrine"], ["noProviderReviewed", "no-provider doctrine"], ["noRuntimeReviewed", "no-runtime doctrine"], ["noPersistenceReviewed", "no-persistence doctrine"], ["noAuditWritingReviewed", "no-audit-writing doctrine"], ["accessibilityReviewed", "accessibility requirements"], ["deterministicInvariantsReviewed", "deterministic invariants"], ["failClosedReviewed", "fail-closed behavior"]];
const blockedRequests: Array<[keyof X7ScopeInput, string]> = [["executionRequested", "near-close recovery cannot execute"], ["routingRequested", "near-close recovery cannot route work"], ["automationRequested", "near-close recovery cannot automate"], ["contactRequested", "near-close recovery cannot contact buyers or sellers"], ["providerRequested", "provider activation remains blocked"], ["runtimeRequested", "runtime jobs remain blocked"], ["persistenceRequested", "persistence remains blocked"], ["auditWritingRequested", "audit writing remains blocked"], ["outreachRequested", "outreach remains blocked"], ["autonomousEscalationRequested", "autonomous escalation remains blocked"]];

export function createX7NearCloseDealRecoveryOperationsScopeContract(input: X7ScopeInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X7ScopeStatus = blockedReasons.length > 0 ? "x7_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x7_scope_ready";
  const result = { phase: "X7A" as const, status, flags: x7NearCloseDealRecoveryFlags, doctrines: x7NearCloseDealRecoveryDoctrines, categories: x7AdvisoryCategories, accessibility: x7AccessibilityRequirements, missingReviewAreas, blockedReasons };
  assertX7ScopeInvariants(result);
  return result;
}

export function assertX7ScopeInvariants(result: { flags: typeof x7NearCloseDealRecoveryFlags }): void {
  if (!result.flags.readOnly || !result.flags.advisoryOnly || !result.flags.humanReviewOnly || !result.flags.simulationOnly) throw new Error("X7A must remain read-only advisory human-review simulation");
  if (Object.entries(result.flags).some(([key, value]) => !["readOnly", "advisoryOnly", "humanReviewOnly", "simulationOnly"].includes(key) && value === true)) throw new Error("X7A cannot authorize execution, routing, contact, providers, runtime, persistence, audit writing, outreach, automation, or autonomous escalation");
}
