export const x1CommandCenterFlags = {
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
  commandCenterExecutes: false,
  commandCenterContacts: false,
  commandCenterRoutesWork: false,
  commandCenterCreatesLeads: false,
  autonomousOutreachAllowed: false,
  auditWritingAllowed: false,
} as const;

export const x1AdvisoryCategories = [
  "daily-focus-review-needed",
  "hot-seller-review-needed",
  "overdue-follow-up-review-needed",
  "stuck-deal-review-needed",
  "buyer-ready-review-needed",
  "near-close-review-needed",
  "blocked-item-review-needed",
  "missing-critical-data-review",
  "high-revenue-opportunity-review",
  "manual-next-best-action-review",
  "command-center-summary",
  "advisory-operations-visibility-only",
] as const;

export const x1CommandCenterDoctrines = [
  "human operational command center doctrine",
  "daily operator focus doctrine",
  "manual next-best-action doctrine",
  "command-center-does-not-execute doctrine",
  "command-center-does-not-contact doctrine",
  "command-center-does-not-route-work doctrine",
  "command-center-does-not-create-leads doctrine",
  "no-provider doctrine",
  "no-runtime doctrine",
  "no-persistence except existing read-only data access doctrine",
  "no-audit-writing doctrine",
  "accessibility requirements",
  "deterministic invariants",
  "fail-closed behavior",
] as const;

export const x1AccessibilityRequirements = {
  semanticHeadings: true,
  ariaLabelledby: true,
  readableLabels: true,
  textBasedStatusMeaning: true,
  noColorOnlyMeaning: true,
  noMotionDependency: true,
  noAutoRefresh: true,
  visibleGovernanceWarnings: true,
} as const;

export type X1ScopeInput = {
  scopeReviewed?: boolean;
  dailyFocusReviewed?: boolean;
  manualNextBestActionReviewed?: boolean;
  noExecutionReviewed?: boolean;
  noContactReviewed?: boolean;
  noRoutingReviewed?: boolean;
  noLeadCreationReviewed?: boolean;
  noProviderReviewed?: boolean;
  noRuntimeReviewed?: boolean;
  noPersistenceReviewed?: boolean;
  noAuditWritingReviewed?: boolean;
  accessibilityReviewed?: boolean;
  deterministicInvariantsReviewed?: boolean;
  failClosedReviewed?: boolean;
  executionRequested?: boolean;
  contactRequested?: boolean;
  routingRequested?: boolean;
  providerRequested?: boolean;
  runtimeRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  leadCreationRequested?: boolean;
  outreachRequested?: boolean;
};

export type X1ScopeStatus = "x1_scope_blocked" | "operator_review_required" | "x1_scope_ready";

const requiredReviewAreas: Array<[keyof X1ScopeInput, string]> = [
  ["scopeReviewed", "human operational command center doctrine"],
  ["dailyFocusReviewed", "daily operator focus doctrine"],
  ["manualNextBestActionReviewed", "manual next-best-action doctrine"],
  ["noExecutionReviewed", "command-center-does-not-execute doctrine"],
  ["noContactReviewed", "command-center-does-not-contact doctrine"],
  ["noRoutingReviewed", "command-center-does-not-route-work doctrine"],
  ["noLeadCreationReviewed", "command-center-does-not-create-leads doctrine"],
  ["noProviderReviewed", "no-provider doctrine"],
  ["noRuntimeReviewed", "no-runtime doctrine"],
  ["noPersistenceReviewed", "no-persistence doctrine"],
  ["noAuditWritingReviewed", "no-audit-writing doctrine"],
  ["accessibilityReviewed", "accessibility requirements"],
  ["deterministicInvariantsReviewed", "deterministic invariants"],
  ["failClosedReviewed", "fail-closed behavior"],
];

const blockedRequests: Array<[keyof X1ScopeInput, string]> = [
  ["executionRequested", "command center cannot execute"],
  ["contactRequested", "command center cannot contact sellers or buyers"],
  ["routingRequested", "command center cannot route work"],
  ["providerRequested", "provider activation remains blocked"],
  ["runtimeRequested", "runtime jobs remain blocked"],
  ["persistenceRequested", "persistence remains blocked except existing read-only data access"],
  ["auditWritingRequested", "audit writing remains blocked"],
  ["leadCreationRequested", "lead creation remains blocked"],
  ["outreachRequested", "autonomous outreach remains blocked"],
];

export type X1ScopeResult = {
  phase: "X1A";
  status: X1ScopeStatus;
  flags: typeof x1CommandCenterFlags;
  doctrines: typeof x1CommandCenterDoctrines;
  categories: typeof x1AdvisoryCategories;
  accessibility: typeof x1AccessibilityRequirements;
  missingReviewAreas: string[];
  blockedReasons: string[];
};

export function createX1HumanOperationalCommandCenterScopeContract(input: X1ScopeInput = {}): X1ScopeResult {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X1ScopeStatus = blockedReasons.length > 0 ? "x1_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x1_scope_ready";
  const result: X1ScopeResult = { phase: "X1A", status, flags: x1CommandCenterFlags, doctrines: x1CommandCenterDoctrines, categories: x1AdvisoryCategories, accessibility: x1AccessibilityRequirements, missingReviewAreas, blockedReasons };
  assertX1ScopeInvariants(result);
  return result;
}

export function assertX1ScopeInvariants(result: X1ScopeResult): void {
  if (!result.flags.readOnly || !result.flags.advisoryOnly || !result.flags.humanReviewOnly || !result.flags.simulationOnly) throw new Error("X1A must remain read-only advisory human-review simulation");
  if (Object.entries(result.flags).some(([key, value]) => !["readOnly", "advisoryOnly", "humanReviewOnly", "simulationOnly"].includes(key) && value === true)) throw new Error("X1A cannot authorize execution, contact, routing, providers, runtime, persistence, audit writing, outreach, or lead creation");
}
