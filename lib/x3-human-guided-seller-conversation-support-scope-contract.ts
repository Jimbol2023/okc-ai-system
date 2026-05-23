export const x3SellerConversationFlags = {
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
  conversationSupportContactsSeller: false,
  conversationSupportSendsMessages: false,
  conversationSupportExecutes: false,
  conversationSupportRoutesWork: false,
  auditWritingAllowed: false,
} as const;

export const x3AdvisoryCategories = [
  "seller-conversation-review-needed",
  "manual-seller-context-review-needed",
  "seller-motivation-review-needed",
  "seller-timeline-review-needed",
  "seller-objection-review-needed",
  "offer-readiness-conversation-review",
  "follow-up-language-review-needed",
  "missing-seller-context-review",
  "high-opportunity-seller-review",
  "manual-conversation-guidance-only",
  "advisory-seller-conversation-visibility-only",
] as const;

export const x3SellerConversationDoctrines = [
  "human-guided seller conversation support doctrine",
  "manual seller context review doctrine",
  "manual conversation guidance doctrine",
  "seller-conversation-support-does-not-contact doctrine",
  "seller-conversation-support-does-not-send doctrine",
  "seller-conversation-support-does-not-execute doctrine",
  "seller-conversation-support-does-not-route-work doctrine",
  "no-provider doctrine",
  "no-runtime doctrine",
  "no-persistence doctrine",
  "no-audit-writing doctrine",
  "accessibility requirements",
  "deterministic invariants",
  "fail-closed behavior",
] as const;

export const x3AccessibilityRequirements = {
  semanticHeadings: true,
  ariaLabelledby: true,
  readableLabels: true,
  textBasedStatusMeaning: true,
  noColorOnlyMeaning: true,
  noMotionDependency: true,
  noAutoRefresh: true,
  visibleGovernanceWarnings: true,
} as const;

export type X3ScopeInput = Partial<Record<"scopeReviewed" | "sellerContextReviewed" | "conversationGuidanceReviewed" | "noContactReviewed" | "noSendReviewed" | "noExecutionReviewed" | "noRoutingReviewed" | "noProviderReviewed" | "noRuntimeReviewed" | "noPersistenceReviewed" | "noAuditWritingReviewed" | "accessibilityReviewed" | "deterministicInvariantsReviewed" | "failClosedReviewed", boolean>> & Partial<Record<"contactRequested" | "sendRequested" | "executionRequested" | "routingRequested" | "providerRequested" | "runtimeRequested" | "persistenceRequested" | "auditWritingRequested" | "outreachRequested" | "automationRequested", boolean>>;
export type X3ScopeStatus = "x3_scope_blocked" | "operator_review_required" | "x3_scope_ready";

const requiredReviewAreas: Array<[keyof X3ScopeInput, string]> = [["scopeReviewed", "human-guided seller conversation support doctrine"], ["sellerContextReviewed", "manual seller context review doctrine"], ["conversationGuidanceReviewed", "manual conversation guidance doctrine"], ["noContactReviewed", "seller-conversation-support-does-not-contact doctrine"], ["noSendReviewed", "seller-conversation-support-does-not-send doctrine"], ["noExecutionReviewed", "seller-conversation-support-does-not-execute doctrine"], ["noRoutingReviewed", "seller-conversation-support-does-not-route-work doctrine"], ["noProviderReviewed", "no-provider doctrine"], ["noRuntimeReviewed", "no-runtime doctrine"], ["noPersistenceReviewed", "no-persistence doctrine"], ["noAuditWritingReviewed", "no-audit-writing doctrine"], ["accessibilityReviewed", "accessibility requirements"], ["deterministicInvariantsReviewed", "deterministic invariants"], ["failClosedReviewed", "fail-closed behavior"]];
const blockedRequests: Array<[keyof X3ScopeInput, string]> = [["contactRequested", "seller conversation support cannot contact sellers"], ["sendRequested", "seller conversation support cannot send messages"], ["executionRequested", "seller conversation support cannot execute"], ["routingRequested", "seller conversation support cannot route work"], ["providerRequested", "provider activation remains blocked"], ["runtimeRequested", "runtime jobs remain blocked"], ["persistenceRequested", "persistence remains blocked"], ["auditWritingRequested", "audit writing remains blocked"], ["outreachRequested", "outreach remains blocked"], ["automationRequested", "automation remains blocked"]];

export function createX3HumanGuidedSellerConversationSupportScopeContract(input: X3ScopeInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X3ScopeStatus = blockedReasons.length > 0 ? "x3_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x3_scope_ready";
  const result = { phase: "X3A" as const, status, flags: x3SellerConversationFlags, doctrines: x3SellerConversationDoctrines, categories: x3AdvisoryCategories, accessibility: x3AccessibilityRequirements, missingReviewAreas, blockedReasons };
  assertX3ScopeInvariants(result);
  return result;
}

export function assertX3ScopeInvariants(result: { flags: typeof x3SellerConversationFlags }): void {
  if (!result.flags.readOnly || !result.flags.advisoryOnly || !result.flags.humanReviewOnly || !result.flags.simulationOnly) throw new Error("X3A must remain read-only advisory human-review simulation");
  if (Object.entries(result.flags).some(([key, value]) => !["readOnly", "advisoryOnly", "humanReviewOnly", "simulationOnly"].includes(key) && value === true)) throw new Error("X3A cannot authorize contact, sending, execution, routing, providers, runtime, persistence, audit writing, outreach, or automation");
}
