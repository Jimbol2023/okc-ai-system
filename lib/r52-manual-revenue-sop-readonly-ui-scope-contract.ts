export type R52ReadonlyUiScopeStatus =
  | "readonly_ui_scope_blocked"
  | "operator_review_required"
  | "readonly_ui_scope_ready";

export type R52ReadonlyUiFirstTarget = "dashboard_overview";

export type R52ReadonlyUiContentCategory =
  | "manual_only_reminder"
  | "next_safe_manual_action"
  | "do_not_proceed_conditions"
  | "governance_blocked_state"
  | "simulation_only_reminder"
  | "missing_data_warning"
  | "human_review_required_reminder";

export type R52ReadonlyUiWarningCode =
  | "r52i_readonly_ui_scope_contract_only"
  | "input_missing"
  | "first_surface_review_required"
  | "content_scope_review_required"
  | "implementation_boundary_review_required"
  | "accessibility_review_required"
  | "validation_plan_review_required"
  | "operator_review_required"
  | "ui_mutation_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "workflow_mutation_rejected"
  | "persistence_activation_rejected"
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

export type R52ManualRevenueSopReadonlyUiScopeInput = {
  firstSurfaceReviewed?: boolean;
  contentScopeReviewed?: boolean;
  implementationBoundaryReviewed?: boolean;
  accessibilityRequirementsReviewed?: boolean;
  validationPlanReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiMutationRequested?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  workflowMutationRequested?: boolean;
  persistenceActivationRequested?: boolean;
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
  extraScopeNotes?: string[];
};

export type R52ReadonlyUiScopeBoundary = {
  allowedFile: "components/dashboard/system-health-safety-bar.tsx";
  allowedSurface: R52ReadonlyUiFirstTarget;
  allowedContent: R52ReadonlyUiContentCategory[];
  prohibitedContent: string[];
  noNewRoutes: true;
  noMutationControls: true;
  noProviderControls: true;
  noPolling: true;
  noPersistence: true;
};

export type R52ReadonlyUiAccessibilityRequirement = {
  requirement: string;
  reason: string;
};

export type R52ReadonlyUiValidationPlan = {
  check: string;
  expectedResult: string;
};

export type R52ManualRevenueSopReadonlyUiScopeResult = {
  scopeStatus: R52ReadonlyUiScopeStatus;
  firstUiTarget: R52ReadonlyUiFirstTarget;
  firstUiTargetReason: string;
  readOnlyContentScope: R52ReadonlyUiContentCategory[];
  implementationBoundary: R52ReadonlyUiScopeBoundary;
  dangerousExclusions: string[];
  accessibilityRequirements: R52ReadonlyUiAccessibilityRequirement[];
  r52jValidationPlan: R52ReadonlyUiValidationPlan[];
  r52jSuccessCriteria: string[];
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

export type R52ManualRevenueSopReadonlyUiScopeInvariantCheck = {
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

function addWarning(warningCodes: string[], warningCode: R52ReadonlyUiWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function hasForbiddenScopeRequest(input: R52ManualRevenueSopReadonlyUiScopeInput) {
  return (
    input.uiMutationRequested === true ||
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.workflowMutationRequested === true ||
    input.persistenceActivationRequested === true ||
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

const readOnlyContentScope: R52ReadonlyUiContentCategory[] = [
  "manual_only_reminder",
  "next_safe_manual_action",
  "do_not_proceed_conditions",
  "governance_blocked_state",
  "simulation_only_reminder",
  "missing_data_warning",
  "human_review_required_reminder",
];

const dangerousExclusions = [
  "Start Automation",
  "Send SMS",
  "Send Email",
  "Auto Follow-Up",
  "Activate Provider",
  "Run Campaign",
  "AI Autopilot",
  "Override Governance",
  "Persist SOP Progress",
];

const implementationBoundary: R52ReadonlyUiScopeBoundary = {
  allowedFile: "components/dashboard/system-health-safety-bar.tsx",
  allowedSurface: "dashboard_overview",
  allowedContent: readOnlyContentScope,
  prohibitedContent: dangerousExclusions,
  noNewRoutes: true,
  noMutationControls: true,
  noProviderControls: true,
  noPolling: true,
  noPersistence: true,
};

const accessibilityRequirements: R52ReadonlyUiAccessibilityRequirement[] = [
  {
    requirement: "Use a semantic heading for the manual revenue guidance area.",
    reason: "Screen-reader users need a clear region name in the dashboard overview.",
  },
  {
    requirement: "Use readable text labels for every status and warning.",
    reason: "Blocked, manual-only, and simulation-only states cannot rely on color alone.",
  },
  {
    requirement: "Preserve existing keyboard order and avoid adding interactive controls.",
    reason: "The first slice is read-only and must not add focus traps or action ambiguity.",
  },
  {
    requirement: "Avoid motion-dependent feedback.",
    reason: "Guidance must be understandable without animation or auto-refresh.",
  },
  {
    requirement: "Keep copy concise and scannable.",
    reason: "Operators need low-cognitive-load instructions during daily revenue work.",
  },
];

const r52jValidationPlan: R52ReadonlyUiValidationPlan[] = [
  {
    check: "Run npm.cmd run build.",
    expectedResult: "Build passes with no R52J TypeScript or rendering errors.",
  },
  {
    check: "Inspect exact diff.",
    expectedResult: "Only components/dashboard/system-health-safety-bar.tsx changes.",
  },
  {
    check: "Search for automation-agent import.",
    expectedResult: "R52J does not import lib/automation-agent.ts.",
  },
  {
    check: "Search for provider and send controls.",
    expectedResult: "No new Send SMS, Send Email, Activate Provider, Run Campaign, or AI Autopilot controls are added.",
  },
  {
    check: "Search for polling references.",
    expectedResult: "No setInterval, polling loop, or auto-refresh guidance is introduced.",
  },
  {
    check: "Review UI copy.",
    expectedResult: "Copy confirms manual-only, simulation-only, provider-blocked, and human-review-required state.",
  },
];

const r52jSuccessCriteria = [
  "Exactly one authorized UI surface is changed.",
  "Manual revenue SOP guidance is read-only.",
  "No runtime activation path is added.",
  "No provider reachability is added.",
  "No advisory-to-permission language is introduced.",
  "No automation-looking controls are introduced.",
  "No mutation routes, persistence, polling, or workflow writes are added.",
  "Hard execution invariants remain false.",
];

export function assertR52ManualRevenueSopReadonlyUiScopeInvariants(
  result: Pick<
    R52ManualRevenueSopReadonlyUiScopeResult,
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
): R52ManualRevenueSopReadonlyUiScopeInvariantCheck {
  const warningCodes: R52ManualRevenueSopReadonlyUiScopeInvariantCheck["warningCodes"] = [];

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

export function summarizeR52ManualRevenueSopReadonlyUiScope(result: R52ManualRevenueSopReadonlyUiScopeResult) {
  const invariantCheck = assertR52ManualRevenueSopReadonlyUiScopeInvariants(result);

  return boundSummary(
    `R52I read-only UI scope status is ${result.scopeStatus}. ` +
      `First target is ${result.firstUiTarget}. ` +
      `${result.readOnlyContentScope.length} read-only content categories, ${result.dangerousExclusions.length} dangerous exclusions, ` +
      `${result.accessibilityRequirements.length} accessibility requirements, and ${result.r52jValidationPlan.length} validation checks are defined. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract is scope-only, advisory-only, simulation-only, and cannot authorize UI mutation, automation, providers, sending, polling, persistence, or execution.",
  );
}

export function createR52ManualRevenueSopReadonlyUiScopeContract(
  input: R52ManualRevenueSopReadonlyUiScopeInput = {},
): R52ManualRevenueSopReadonlyUiScopeResult {
  const warningCodes: string[] = [];
  const operatorNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r52i_readonly_ui_scope_contract_only");
  addWarning(warningCodes, "persistence_not_allowed_now");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.firstSurfaceReviewed !== true) addWarning(warningCodes, "first_surface_review_required");
  if (input.contentScopeReviewed !== true) addWarning(warningCodes, "content_scope_review_required");
  if (input.implementationBoundaryReviewed !== true) addWarning(warningCodes, "implementation_boundary_review_required");
  if (input.accessibilityRequirementsReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.validationPlanReviewed !== true) addWarning(warningCodes, "validation_plan_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.uiMutationRequested === true) addWarning(warningCodes, "ui_mutation_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.workflowMutationRequested === true) addWarning(warningCodes, "workflow_mutation_rejected");
  if (input.persistenceActivationRequested === true) addWarning(warningCodes, "persistence_activation_rejected");
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
  const scopeStatus: R52ReadonlyUiScopeStatus = hasForbiddenScopeRequest(input)
    ? "readonly_ui_scope_blocked"
    : operatorReviewRequired ||
        input.firstSurfaceReviewed !== true ||
        input.contentScopeReviewed !== true ||
        input.implementationBoundaryReviewed !== true ||
        input.accessibilityRequirementsReviewed !== true ||
        input.validationPlanReviewed !== true
      ? "operator_review_required"
      : "readonly_ui_scope_ready";

  const result: R52ManualRevenueSopReadonlyUiScopeResult = {
    scopeStatus,
    firstUiTarget: "dashboard_overview",
    firstUiTargetReason:
      "The dashboard overview safety bar is already read-only, visible at operator day start, and carries safety context without lead mutation controls.",
    readOnlyContentScope,
    implementationBoundary,
    dangerousExclusions,
    accessibilityRequirements,
    r52jValidationPlan,
    r52jSuccessCriteria,
    operatorReviewRequired,
    warningCodes,
    operatorNotes,
    summary: "R52I read-only manual revenue SOP UI scope contract only.",
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
    summary: summarizeR52ManualRevenueSopReadonlyUiScope(result),
  };
}
