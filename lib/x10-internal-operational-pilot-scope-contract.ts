export const x10InternalOperationalPilotFlags = {
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
  pilotWorkspaceExecutes: false,
  pilotWorkspaceSends: false,
  pilotWorkspaceRoutesWork: false,
  pilotWorkspaceContacts: false,
  pilotWorkspaceAutomates: false,
  productionActivationAllowed: false,
  auditWritingAllowed: false,
} as const;

export const x10AdvisoryCategories = [
  "internal-pilot-review-needed",
  "workflow-readiness-review",
  "governance-readiness-review",
  "communication-readiness-review",
  "execution-blocked-review",
  "provider-blocked-review",
  "operational-risk-review",
  "manual-pilot-review",
  "readiness-gap-review",
  "operational-visibility-only",
  "advisory-pilot-review-only",
] as const;

export const x10InternalOperationalPilotDoctrines = [
  "internal operational pilot doctrine",
  "pilot readiness doctrine",
  "governance readiness doctrine",
  "workflow readiness doctrine",
  "communication readiness doctrine",
  "provider-blocked operational doctrine",
  "execution-blocked pilot doctrine",
  "manual pilot review doctrine",
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

export const x10AccessibilityRequirements = {
  semanticHeadings: true,
  ariaLabelledby: true,
  readableLabels: true,
  textBasedStatusMeaning: true,
  noColorOnlyMeaning: true,
  noMotionDependency: true,
  noAutoRefresh: true,
  visibleGovernanceWarnings: true,
} as const;

export type X10ScopeInput = Partial<Record<"scopeReviewed" | "pilotReadinessReviewed" | "governanceReadinessReviewed" | "workflowReadinessReviewed" | "communicationReadinessReviewed" | "providerBlockedReviewed" | "executionBlockedReviewed" | "manualPilotReviewReviewed" | "noExecutionReviewed" | "noProviderReviewed" | "noRuntimeReviewed" | "noRoutingReviewed" | "noContactReviewed" | "noPersistenceReviewed" | "noAuditWritingReviewed" | "accessibilityReviewed" | "deterministicInvariantsReviewed" | "failClosedReviewed", boolean>> & Partial<Record<"executionRequested" | "sendRequested" | "providerRequested" | "runtimeRequested" | "routingRequested" | "contactRequested" | "persistenceRequested" | "auditWritingRequested" | "outreachRequested" | "automationRequested" | "productionActivationRequested", boolean>>;
export type X10ScopeStatus = "x10_scope_blocked" | "operator_review_required" | "x10_scope_ready";

const requiredReviewAreas: Array<[keyof X10ScopeInput, string]> = [["scopeReviewed", "internal operational pilot doctrine"], ["pilotReadinessReviewed", "pilot readiness doctrine"], ["governanceReadinessReviewed", "governance readiness doctrine"], ["workflowReadinessReviewed", "workflow readiness doctrine"], ["communicationReadinessReviewed", "communication readiness doctrine"], ["providerBlockedReviewed", "provider-blocked operational doctrine"], ["executionBlockedReviewed", "execution-blocked pilot doctrine"], ["manualPilotReviewReviewed", "manual pilot review doctrine"], ["noExecutionReviewed", "no-execution doctrine"], ["noProviderReviewed", "no-provider doctrine"], ["noRuntimeReviewed", "no-runtime doctrine"], ["noRoutingReviewed", "no-routing doctrine"], ["noContactReviewed", "no-contact doctrine"], ["noPersistenceReviewed", "no-persistence doctrine"], ["noAuditWritingReviewed", "no-audit-writing doctrine"], ["accessibilityReviewed", "accessibility requirements"], ["deterministicInvariantsReviewed", "deterministic invariants"], ["failClosedReviewed", "fail-closed behavior"]];
const blockedRequests: Array<[keyof X10ScopeInput, string]> = [["executionRequested", "internal pilot cannot execute"], ["sendRequested", "internal pilot cannot send messages"], ["providerRequested", "provider activation remains blocked"], ["runtimeRequested", "runtime jobs remain blocked"], ["routingRequested", "internal pilot cannot route work"], ["contactRequested", "internal pilot cannot contact buyers or sellers"], ["persistenceRequested", "persistence remains blocked"], ["auditWritingRequested", "audit writing remains blocked"], ["outreachRequested", "outreach remains blocked"], ["automationRequested", "workflow automation remains blocked"], ["productionActivationRequested", "production activation remains outside X10 scope"]];

export function createX10InternalOperationalPilotScopeContract(input: X10ScopeInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X10ScopeStatus = blockedReasons.length > 0 ? "x10_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x10_scope_ready";
  const result = { phase: "X10A" as const, status, flags: x10InternalOperationalPilotFlags, doctrines: x10InternalOperationalPilotDoctrines, categories: x10AdvisoryCategories, accessibility: x10AccessibilityRequirements, missingReviewAreas, blockedReasons };
  assertX10ScopeInvariants(result);
  return result;
}

export function assertX10ScopeInvariants(result: { flags: typeof x10InternalOperationalPilotFlags }): void {
  if (!result.flags.readOnly || !result.flags.advisoryOnly || !result.flags.humanReviewOnly || !result.flags.simulationOnly) throw new Error("X10A must remain read-only advisory human-review simulation");
  if (Object.entries(result.flags).some(([key, value]) => !["readOnly", "advisoryOnly", "humanReviewOnly", "simulationOnly"].includes(key) && value === true)) throw new Error("X10A cannot authorize execution, sending, routing, contact, providers, runtime, persistence, audit writing, outreach, automation, or production activation");
}
