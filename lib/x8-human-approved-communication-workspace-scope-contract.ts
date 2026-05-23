export const x8HumanApprovedCommunicationFlags = {
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
  communicationWorkspaceExecutes: false,
  communicationWorkspaceSends: false,
  communicationWorkspaceRoutesWork: false,
  communicationWorkspaceContacts: false,
  communicationWorkspaceAutomates: false,
  autonomousCommunicationApprovalAllowed: false,
  auditWritingAllowed: false,
} as const;

export const x8AdvisoryCategories = [
  "communication-review-needed",
  "communication-readiness-review",
  "communication-risk-review",
  "human-approval-review",
  "dnc-awareness-review",
  "opt-out-awareness-review",
  "provider-blocked-review",
  "communication-context-review",
  "communication-governance-review",
  "operational-visibility-only",
  "advisory-communication-review-only",
] as const;

export const x8HumanApprovedCommunicationDoctrines = [
  "human-approved communication doctrine",
  "communication readiness doctrine",
  "communication risk doctrine",
  "human approval doctrine",
  "DNC awareness doctrine",
  "opt-out awareness doctrine",
  "communication governance doctrine",
  "provider-blocked communication doctrine",
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

export const x8AccessibilityRequirements = {
  semanticHeadings: true,
  ariaLabelledby: true,
  readableLabels: true,
  textBasedStatusMeaning: true,
  noColorOnlyMeaning: true,
  noMotionDependency: true,
  noAutoRefresh: true,
  visibleGovernanceWarnings: true,
} as const;

export type X8ScopeInput = Partial<Record<"scopeReviewed" | "communicationReadinessReviewed" | "communicationRiskReviewed" | "humanApprovalReviewed" | "dncAwarenessReviewed" | "optOutAwarenessReviewed" | "communicationGovernanceReviewed" | "providerBlockedCommunicationReviewed" | "noExecutionReviewed" | "noProviderReviewed" | "noRuntimeReviewed" | "noRoutingReviewed" | "noContactReviewed" | "noPersistenceReviewed" | "noAuditWritingReviewed" | "accessibilityReviewed" | "deterministicInvariantsReviewed" | "failClosedReviewed", boolean>> & Partial<Record<"executionRequested" | "sendRequested" | "providerRequested" | "runtimeRequested" | "routingRequested" | "contactRequested" | "persistenceRequested" | "auditWritingRequested" | "outreachRequested" | "automationRequested" | "autonomousCommunicationApprovalRequested", boolean>>;
export type X8ScopeStatus = "x8_scope_blocked" | "operator_review_required" | "x8_scope_ready";

const requiredReviewAreas: Array<[keyof X8ScopeInput, string]> = [["scopeReviewed", "human-approved communication doctrine"], ["communicationReadinessReviewed", "communication readiness doctrine"], ["communicationRiskReviewed", "communication risk doctrine"], ["humanApprovalReviewed", "human approval doctrine"], ["dncAwarenessReviewed", "DNC awareness doctrine"], ["optOutAwarenessReviewed", "opt-out awareness doctrine"], ["communicationGovernanceReviewed", "communication governance doctrine"], ["providerBlockedCommunicationReviewed", "provider-blocked communication doctrine"], ["noExecutionReviewed", "no-execution doctrine"], ["noProviderReviewed", "no-provider doctrine"], ["noRuntimeReviewed", "no-runtime doctrine"], ["noRoutingReviewed", "no-routing doctrine"], ["noContactReviewed", "no-contact doctrine"], ["noPersistenceReviewed", "no-persistence doctrine"], ["noAuditWritingReviewed", "no-audit-writing doctrine"], ["accessibilityReviewed", "accessibility requirements"], ["deterministicInvariantsReviewed", "deterministic invariants"], ["failClosedReviewed", "fail-closed behavior"]];
const blockedRequests: Array<[keyof X8ScopeInput, string]> = [["executionRequested", "communication workspace cannot execute"], ["sendRequested", "communication workspace cannot send messages"], ["providerRequested", "provider activation remains blocked"], ["runtimeRequested", "runtime jobs remain blocked"], ["routingRequested", "communication workspace cannot route work"], ["contactRequested", "communication workspace cannot contact buyers or sellers"], ["persistenceRequested", "persistence remains blocked"], ["auditWritingRequested", "audit writing remains blocked"], ["outreachRequested", "outreach remains blocked"], ["automationRequested", "workflow automation remains blocked"], ["autonomousCommunicationApprovalRequested", "autonomous communication approval remains blocked"]];

export function createX8HumanApprovedCommunicationWorkspaceScopeContract(input: X8ScopeInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X8ScopeStatus = blockedReasons.length > 0 ? "x8_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x8_scope_ready";
  const result = { phase: "X8A" as const, status, flags: x8HumanApprovedCommunicationFlags, doctrines: x8HumanApprovedCommunicationDoctrines, categories: x8AdvisoryCategories, accessibility: x8AccessibilityRequirements, missingReviewAreas, blockedReasons };
  assertX8ScopeInvariants(result);
  return result;
}

export function assertX8ScopeInvariants(result: { flags: typeof x8HumanApprovedCommunicationFlags }): void {
  if (!result.flags.readOnly || !result.flags.advisoryOnly || !result.flags.humanReviewOnly || !result.flags.simulationOnly) throw new Error("X8A must remain read-only advisory human-review simulation");
  if (Object.entries(result.flags).some(([key, value]) => !["readOnly", "advisoryOnly", "humanReviewOnly", "simulationOnly"].includes(key) && value === true)) throw new Error("X8A cannot authorize execution, sending, routing, contact, providers, runtime, persistence, audit writing, outreach, automation, or autonomous communication approval");
}
