export const x2LeadOperationsFlags = {
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
  leadOperationsExecute: false,
  leadOperationsContact: false,
  leadOperationsRouteWork: false,
  leadOperationsCreateLeads: false,
  autonomousWorkflowAllowed: false,
  auditWritingAllowed: false,
} as const;

export const x2AdvisoryCategories = [
  "manual-lead-review-needed",
  "overdue-follow-up-review-needed",
  "high-priority-lead-review",
  "lead-aging-review",
  "seller-status-review",
  "blocked-workflow-review",
  "missing-data-review",
  "workload-balance-review",
  "manual-revenue-priority-review",
  "operational-visibility-only",
  "advisory-workflow-review-only",
] as const;

export const x2LeadOperationsDoctrines = [
  "live manual lead operations doctrine",
  "human operator workflow doctrine",
  "manual lead review doctrine",
  "manual follow-up review doctrine",
  "workload visibility doctrine",
  "revenue-priority review doctrine",
  "lead aging doctrine",
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

export const x2AccessibilityRequirements = {
  semanticHeadings: true,
  ariaLabelledby: true,
  readableLabels: true,
  textBasedStatusMeaning: true,
  noColorOnlyMeaning: true,
  noMotionDependency: true,
  noAutoRefresh: true,
  visibleGovernanceWarnings: true,
} as const;

export type X2ScopeInput = {
  scopeReviewed?: boolean;
  humanWorkflowReviewed?: boolean;
  manualLeadReviewReviewed?: boolean;
  manualFollowUpReviewed?: boolean;
  workloadVisibilityReviewed?: boolean;
  revenuePriorityReviewed?: boolean;
  leadAgingReviewed?: boolean;
  noExecutionReviewed?: boolean;
  noProviderReviewed?: boolean;
  noRuntimeReviewed?: boolean;
  noRoutingReviewed?: boolean;
  noContactReviewed?: boolean;
  noPersistenceReviewed?: boolean;
  noAuditWritingReviewed?: boolean;
  accessibilityReviewed?: boolean;
  deterministicInvariantsReviewed?: boolean;
  failClosedReviewed?: boolean;
  executionRequested?: boolean;
  providerRequested?: boolean;
  runtimeRequested?: boolean;
  routingRequested?: boolean;
  contactRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  leadCreationRequested?: boolean;
  outreachRequested?: boolean;
  automationRequested?: boolean;
};

export type X2ScopeStatus = "x2_scope_blocked" | "operator_review_required" | "x2_scope_ready";

const requiredReviewAreas: Array<[keyof X2ScopeInput, string]> = [
  ["scopeReviewed", "live manual lead operations doctrine"],
  ["humanWorkflowReviewed", "human operator workflow doctrine"],
  ["manualLeadReviewReviewed", "manual lead review doctrine"],
  ["manualFollowUpReviewed", "manual follow-up review doctrine"],
  ["workloadVisibilityReviewed", "workload visibility doctrine"],
  ["revenuePriorityReviewed", "revenue-priority review doctrine"],
  ["leadAgingReviewed", "lead aging doctrine"],
  ["noExecutionReviewed", "no-execution doctrine"],
  ["noProviderReviewed", "no-provider doctrine"],
  ["noRuntimeReviewed", "no-runtime doctrine"],
  ["noRoutingReviewed", "no-routing doctrine"],
  ["noContactReviewed", "no-contact doctrine"],
  ["noPersistenceReviewed", "no-persistence doctrine"],
  ["noAuditWritingReviewed", "no-audit-writing doctrine"],
  ["accessibilityReviewed", "accessibility requirements"],
  ["deterministicInvariantsReviewed", "deterministic invariants"],
  ["failClosedReviewed", "fail-closed behavior"],
];

const blockedRequests: Array<[keyof X2ScopeInput, string]> = [
  ["executionRequested", "lead operations cannot execute"],
  ["providerRequested", "provider activation remains blocked"],
  ["runtimeRequested", "runtime jobs remain blocked"],
  ["routingRequested", "lead operations cannot route work"],
  ["contactRequested", "lead operations cannot contact sellers or buyers"],
  ["persistenceRequested", "persistence remains blocked except existing read-only data access"],
  ["auditWritingRequested", "audit writing remains blocked"],
  ["leadCreationRequested", "lead creation remains blocked"],
  ["outreachRequested", "autonomous outreach remains blocked"],
  ["automationRequested", "workflow automation remains blocked"],
];

export type X2ScopeResult = {
  phase: "X2A";
  status: X2ScopeStatus;
  flags: typeof x2LeadOperationsFlags;
  doctrines: typeof x2LeadOperationsDoctrines;
  categories: typeof x2AdvisoryCategories;
  accessibility: typeof x2AccessibilityRequirements;
  missingReviewAreas: string[];
  blockedReasons: string[];
};

export function createX2LiveManualLeadOperationsScopeContract(input: X2ScopeInput = {}): X2ScopeResult {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X2ScopeStatus = blockedReasons.length > 0 ? "x2_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x2_scope_ready";
  const result: X2ScopeResult = { phase: "X2A", status, flags: x2LeadOperationsFlags, doctrines: x2LeadOperationsDoctrines, categories: x2AdvisoryCategories, accessibility: x2AccessibilityRequirements, missingReviewAreas, blockedReasons };
  assertX2ScopeInvariants(result);
  return result;
}

export function assertX2ScopeInvariants(result: X2ScopeResult): void {
  if (!result.flags.readOnly || !result.flags.advisoryOnly || !result.flags.humanReviewOnly || !result.flags.simulationOnly) throw new Error("X2A must remain read-only advisory human-review simulation");
  if (Object.entries(result.flags).some(([key, value]) => !["readOnly", "advisoryOnly", "humanReviewOnly", "simulationOnly"].includes(key) && value === true)) throw new Error("X2A cannot authorize execution, providers, runtime, routing, contact, persistence, audit writing, outreach, automation, or lead creation");
}
