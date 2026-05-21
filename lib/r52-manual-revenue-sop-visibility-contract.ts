export type R52SopVisibilityStatus =
  | "visibility_planning_blocked"
  | "operator_review_required"
  | "visibility_plan_ready";

export type R52VisibilityCandidatePriority = "high_roi" | "useful_later" | "avoid_noise";

export type R52HumanReviewClass =
  | "always_human_review"
  | "eventually_assisted_with_review"
  | "never_autonomous";

export type R52VisibilityWarningCode =
  | "r52g_visibility_planning_contract_only"
  | "input_missing"
  | "sop_review_required"
  | "governance_visibility_review_required"
  | "revenue_priority_review_required"
  | "accessibility_review_required"
  | "operator_review_required"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "workflow_mutation_rejected"
  | "advisory_to_permission_rejected"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false"
  | "persistence_not_allowed_now";

export type R52ManualRevenueSopVisibilityInput = {
  sopDoctrineReviewed?: boolean;
  governanceVisibilityReviewed?: boolean;
  revenuePriorityVisibilityReviewed?: boolean;
  accessibilityUsabilityReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  workflowMutationRequested?: boolean;
  advisoryConvertedToPermission?: boolean;
  activationExecuted?: boolean;
  providerActivationAllowed?: boolean;
  liveExecutionAllowed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
  persistenceAllowedNow?: boolean;
  extraVisibilityNotes?: string[];
};

export type R52VisibilityCandidate = {
  surface: string;
  priority: R52VisibilityCandidatePriority;
  operatorValue: string;
  safetyConstraint: string;
};

export type R52HumanReviewPreservationItem = {
  workflow: string;
  classification: R52HumanReviewClass;
  reason: string;
};

export type R52ManualRevenueSopVisibilityResult = {
  visibilityStatus: R52SopVisibilityStatus;
  visibilityDoctrine: string;
  sopVisibilityGaps: string[];
  dashboardGuidancePriorities: R52VisibilityCandidate[];
  revenuePriorityVisibility: R52VisibilityCandidate[];
  governanceVisibility: R52VisibilityCandidate[];
  accessibilityUsabilityVisibility: R52VisibilityCandidate[];
  humanReviewPreservation: R52HumanReviewPreservationItem[];
  futureImplementationOrder: string[];
  overbuildWarnings: string[];
  highRoiVisibility: string[];
  operatorReviewRequired: boolean;
  warningCodes: string[];
  operatorNotes: string[];
  summary: string;
  activationExecuted: false;
  providerActivationAllowed: false;
  liveExecutionAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  simulationOnly: true;
  liveTestReady: false;
  persistenceAllowedNow: false;
};

export type R52ManualRevenueSopVisibilityInvariantCheck = {
  passed: boolean;
  warningCodes: Array<
    | "activation_executed_must_be_false"
    | "provider_activation_allowed_must_be_false"
    | "live_execution_allowed_must_be_false"
    | "sent_must_be_false"
    | "provider_called_must_be_false"
    | "can_send_now_must_be_false"
    | "simulation_only_required"
    | "live_test_ready_must_be_false"
    | "persistence_not_allowed_now"
  >;
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function boundText(value?: string | null) {
  const normalized = normalizeText(value);

  if (normalized.length <= maxTextLength) return normalized;

  return `${normalized.slice(0, maxTextLength)}...`;
}

function boundSummary(value: string) {
  if (value.length <= maxSummaryLength) return value;

  return `${value.slice(0, maxSummaryLength)}...`;
}

function addUnique(list: string[], value: string) {
  const bounded = boundText(value);

  if (bounded && !list.includes(bounded) && list.length < maxListItems) {
    list.push(bounded);
  }
}

function addWarning(warningCodes: string[], warningCode: R52VisibilityWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function hasForbiddenVisibilityRequest(input: R52ManualRevenueSopVisibilityInput) {
  return (
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.workflowMutationRequested === true ||
    input.advisoryConvertedToPermission === true ||
    input.activationExecuted === true ||
    input.providerActivationAllowed === true ||
    input.liveExecutionAllowed === true ||
    input.sent === true ||
    input.providerCalled === true ||
    input.canSendNow === true ||
    input.liveTestReady === true ||
    input.persistenceAllowedNow === true
  );
}

const sopVisibilityGaps = [
  "Daily workflow order is not yet surfaced as a guided operator sequence.",
  "Do-not-proceed conditions are distributed across governance outputs instead of visible at the point of work.",
  "Manual-only doctrine can be misunderstood as a readiness-to-send signal without explicit reminders.",
  "Revenue priority views can show business urgency without explaining missing data or governance blockers.",
  "Accessibility friction is not yet presented as an operator workflow risk.",
];

const dashboardGuidancePriorities: R52VisibilityCandidate[] = [
  {
    surface: "Readiness banner",
    priority: "high_roi",
    operatorValue: "Shows manual-only operating state before queue work begins.",
    safetyConstraint: "Must never expose activate, send, enable, or provider controls.",
  },
  {
    surface: "SOP next-step panel",
    priority: "high_roi",
    operatorValue: "Presents the ordered workday and the next safe manual action.",
    safetyConstraint: "Must remain informational and must not mutate lead state automatically.",
  },
  {
    surface: "Do-not-proceed warning list",
    priority: "high_roi",
    operatorValue: "Makes DNC, opt-out, missing source, missing contact data, and governance blockers visible.",
    safetyConstraint: "Must fail closed and avoid any override action in the same control surface.",
  },
  {
    surface: "Workflow progress tracker",
    priority: "useful_later",
    operatorValue: "Helps operators see where they are in the manual revenue day.",
    safetyConstraint: "Progress must be local/read-only until explicit persistence governance exists.",
  },
  {
    surface: "Decorative governance score",
    priority: "avoid_noise",
    operatorValue: "Low operational value compared with explicit blockers and next manual action.",
    safetyConstraint: "Avoid gamifying safety state or implying execution readiness.",
  },
];

const revenuePriorityVisibility: R52VisibilityCandidate[] = [
  {
    surface: "Highest-value leads",
    priority: "high_roi",
    operatorValue: "Focuses attention on leads most likely to create manual revenue activity.",
    safetyConstraint: "Must show missing critical data and never auto-contact the seller.",
  },
  {
    surface: "Overdue follow-up queue",
    priority: "high_roi",
    operatorValue: "Finds manual follow-up opportunities without triggering outreach.",
    safetyConstraint: "Must show DNC, opt-out, approval, and last-contact blockers before any operator action.",
  },
  {
    surface: "Near-close opportunities",
    priority: "high_roi",
    operatorValue: "Highlights contract, buyer, title, and disposition bottlenecks.",
    safetyConstraint: "Must label assumptions and avoid inventing property facts.",
  },
  {
    surface: "Incomplete disposition packages",
    priority: "high_roi",
    operatorValue: "Shows missing ARV, repair, photo, contract, buyer, and access data before buyer-facing work.",
    safetyConstraint: "Must require human package review before sharing.",
  },
];

const governanceVisibility: R52VisibilityCandidate[] = [
  {
    surface: "Runtime blocked state",
    priority: "high_roi",
    operatorValue: "Clarifies that automation, provider activation, and live execution remain blocked.",
    safetyConstraint: "Must not be paired with unlock, enable, or override controls.",
  },
  {
    surface: "Simulation-only state",
    priority: "high_roi",
    operatorValue: "Reinforces that dry-run and mock outputs are evidence only.",
    safetyConstraint: "Must not convert advisory status into execution permission.",
  },
  {
    surface: "Approval requirements",
    priority: "high_roi",
    operatorValue: "Explains the human review gates required before sensitive operational steps.",
    safetyConstraint: "Must preserve DNC, opt-out, allowlist, kill-switch, and audit-review supremacy.",
  },
  {
    surface: "Audit persistence status",
    priority: "useful_later",
    operatorValue: "Shows that future audit persistence is planned but not active.",
    safetyConstraint: "Must not write or imply persistenceAllowedNow:true.",
  },
];

const accessibilityUsabilityVisibility: R52VisibilityCandidate[] = [
  {
    surface: "Keyboard-first guidance",
    priority: "high_roi",
    operatorValue: "Helps operators complete revenue review without relying on mouse-only workflows.",
    safetyConstraint: "Must be planned before runtime focus management is added.",
  },
  {
    surface: "Readable status hierarchy",
    priority: "high_roi",
    operatorValue: "Reduces cognitive load by separating blockers, warnings, and next manual actions.",
    safetyConstraint: "Must use text and structure, not color alone.",
  },
  {
    surface: "Reduced-motion guidance",
    priority: "useful_later",
    operatorValue: "Prevents motion from carrying essential workflow state.",
    safetyConstraint: "Must not require global theme/CSS rewrites in this planning phase.",
  },
];

const humanReviewPreservation: R52HumanReviewPreservationItem[] = [
  {
    workflow: "Seller communication",
    classification: "always_human_review",
    reason: "Seller outreach requires DNC, opt-out, approval, claims, and manual context review.",
  },
  {
    workflow: "Buyer-facing disposition package sharing",
    classification: "always_human_review",
    reason: "Buyer work requires valuation, contract, package completeness, and operator approval.",
  },
  {
    workflow: "Lead ranking and queue ordering",
    classification: "eventually_assisted_with_review",
    reason: "Assistance can improve prioritization if it stays advisory and never contacts leads.",
  },
  {
    workflow: "Provider sending and runtime automation",
    classification: "never_autonomous",
    reason: "Outbound provider execution and automation-agent behavior must never bypass human governance.",
  },
];

const futureImplementationOrder = [
  "Add read-only SOP visibility planning to readiness/dashboard design documents.",
  "Show manual-only readiness banner and simulation-only reminders.",
  "Expose ordered SOP next-step guidance without mutation controls.",
  "Expose do-not-proceed warnings near lead and revenue queues.",
  "Add revenue priority visibility for high-value, overdue, near-close, and incomplete-package work.",
  "Implement accessibility improvements before any workflow-heavy UI expansion.",
  "Operationalize audit persistence only after R50 controls become runtime-safe.",
  "Plan controlled runtime activation only after observability, audit, accessibility, and operator SOPs are proven.",
];

const overbuildWarnings = [
  "Avoid dashboards that summarize governance without showing concrete operator action.",
  "Avoid workflow progress persistence until audit persistence and access control are implemented.",
  "Avoid new activation-style controls in readiness or SOP surfaces.",
  "Avoid decorative scores that imply safety or revenue readiness without blockers.",
];

const highRoiVisibility = [
  "Manual-only readiness banner.",
  "Next safe manual action.",
  "Do-not-proceed warnings.",
  "High-priority and overdue lead queues with blockers.",
  "Near-close and incomplete disposition package indicators.",
  "Simulation-only and provider-blocked reminders.",
];

export function assertR52ManualRevenueSopVisibilityInvariants(
  result: Pick<
    R52ManualRevenueSopVisibilityResult,
    | "activationExecuted"
    | "providerActivationAllowed"
    | "liveExecutionAllowed"
    | "sent"
    | "providerCalled"
    | "canSendNow"
    | "simulationOnly"
    | "liveTestReady"
    | "persistenceAllowedNow"
  >,
): R52ManualRevenueSopVisibilityInvariantCheck {
  const warningCodes: R52ManualRevenueSopVisibilityInvariantCheck["warningCodes"] = [];

  if (result.activationExecuted !== false) warningCodes.push("activation_executed_must_be_false");
  if (result.providerActivationAllowed !== false) warningCodes.push("provider_activation_allowed_must_be_false");
  if (result.liveExecutionAllowed !== false) warningCodes.push("live_execution_allowed_must_be_false");
  if (result.sent !== false) warningCodes.push("sent_must_be_false");
  if (result.providerCalled !== false) warningCodes.push("provider_called_must_be_false");
  if (result.canSendNow !== false) warningCodes.push("can_send_now_must_be_false");
  if (result.simulationOnly !== true) warningCodes.push("simulation_only_required");
  if (result.liveTestReady !== false) warningCodes.push("live_test_ready_must_be_false");
  if (result.persistenceAllowedNow !== false) warningCodes.push("persistence_not_allowed_now");

  return {
    passed: warningCodes.length === 0,
    warningCodes,
  };
}

export function summarizeR52ManualRevenueSopVisibility(result: R52ManualRevenueSopVisibilityResult) {
  const invariantCheck = assertR52ManualRevenueSopVisibilityInvariants(result);

  return boundSummary(
    `R52G manual revenue SOP visibility status is ${result.visibilityStatus}. ` +
      `${result.sopVisibilityGaps.length} visibility gaps, ${result.dashboardGuidancePriorities.length} dashboard priorities, ` +
      `${result.revenuePriorityVisibility.length} revenue visibility candidates, and ${result.governanceVisibility.length} governance visibility candidates are defined. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract is planning-only, advisory-only, simulation-only, and cannot authorize automation, providers, live sending, polling, persistence, or workflow mutation.",
  );
}

export function createR52ManualRevenueSopVisibilityContract(
  input: R52ManualRevenueSopVisibilityInput = {},
): R52ManualRevenueSopVisibilityResult {
  const warningCodes: string[] = [];
  const operatorNotes = collectNotes(input.extraVisibilityNotes);

  addWarning(warningCodes, "r52g_visibility_planning_contract_only");
  addWarning(warningCodes, "persistence_not_allowed_now");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.sopDoctrineReviewed !== true) addWarning(warningCodes, "sop_review_required");
  if (input.governanceVisibilityReviewed !== true) addWarning(warningCodes, "governance_visibility_review_required");
  if (input.revenuePriorityVisibilityReviewed !== true) addWarning(warningCodes, "revenue_priority_review_required");
  if (input.accessibilityUsabilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.workflowMutationRequested === true) addWarning(warningCodes, "workflow_mutation_rejected");
  if (input.advisoryConvertedToPermission === true) addWarning(warningCodes, "advisory_to_permission_rejected");
  if (input.activationExecuted === true) addWarning(warningCodes, "activation_executed_must_be_false");
  if (input.providerActivationAllowed === true) addWarning(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.liveExecutionAllowed === true) addWarning(warningCodes, "live_execution_allowed_must_be_false");
  if (input.sent === true) addWarning(warningCodes, "sent_must_be_false");
  if (input.providerCalled === true) addWarning(warningCodes, "provider_called_must_be_false");
  if (input.canSendNow === true) addWarning(warningCodes, "can_send_now_must_be_false");
  if (input.simulationOnly !== true) addWarning(warningCodes, "simulation_only_required");
  if (input.liveTestReady === true) addWarning(warningCodes, "live_test_ready_must_be_false");
  if (input.persistenceAllowedNow === true) addWarning(warningCodes, "persistence_not_allowed_now");

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const visibilityStatus: R52SopVisibilityStatus = hasForbiddenVisibilityRequest(input)
    ? "visibility_planning_blocked"
    : operatorReviewRequired ||
        input.sopDoctrineReviewed !== true ||
        input.governanceVisibilityReviewed !== true ||
        input.revenuePriorityVisibilityReviewed !== true ||
        input.accessibilityUsabilityReviewed !== true
      ? "operator_review_required"
      : "visibility_plan_ready";

  const result: R52ManualRevenueSopVisibilityResult = {
    visibilityStatus,
    visibilityDoctrine:
      "Manual revenue SOP visibility must guide operator decisions without mutating workflow state or enabling execution.",
    sopVisibilityGaps,
    dashboardGuidancePriorities,
    revenuePriorityVisibility,
    governanceVisibility,
    accessibilityUsabilityVisibility,
    humanReviewPreservation,
    futureImplementationOrder,
    overbuildWarnings,
    highRoiVisibility,
    operatorReviewRequired,
    warningCodes,
    operatorNotes,
    summary: "R52G manual revenue SOP visibility planning contract only.",
    activationExecuted: false,
    providerActivationAllowed: false,
    liveExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    liveTestReady: false,
    persistenceAllowedNow: false,
  };

  return {
    ...result,
    summary: summarizeR52ManualRevenueSopVisibility(result),
  };
}
