export type R52ApprovalQueueSopScopeStatus =
  | "approval_queue_scope_blocked"
  | "operator_review_required"
  | "approval_queue_scope_ready";

export type R52ApprovalQueuePlacement = "top_of_approval_queue_page";

export type R52ApprovalQueueContentCategory =
  | "approval_is_review_only"
  | "approval_does_not_send"
  | "provider_disabled_reminder"
  | "manual_follow_up_reminder"
  | "do_not_proceed_conditions"
  | "dnc_opt_out_warning"
  | "missing_critical_data_warning"
  | "human_review_required";

export type R52ApprovalQueueScopeWarningCode =
  | "r52o_approval_queue_scope_contract_only"
  | "input_missing"
  | "placement_review_required"
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
  | "bulk_approval_rejected"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false"
  | "persistence_not_allowed_now";

export type R52ApprovalQueueManualRevenueSopScopeInput = {
  placementReviewed?: boolean;
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
  bulkApprovalRequested?: boolean;
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

export type R52ApprovalQueueScopeBoundary = {
  allowedFile: "app/(dashboard)/dashboard/approvals/page.tsx";
  allowedPlacement: R52ApprovalQueuePlacement;
  allowedContent: R52ApprovalQueueContentCategory[];
  prohibitedContent: string[];
  noNewRoutes: true;
  noNewMutationBehavior: true;
  existingApprovalBehaviorUnchanged: true;
  noProviderControls: true;
  noPolling: true;
  noPersistence: true;
};

export type R52ApprovalQueueAccessibilityRequirement = {
  requirement: string;
  reason: string;
};

export type R52ApprovalQueueValidationPlan = {
  check: string;
  expectedResult: string;
};

export type R52ApprovalQueueManualRevenueSopScopeResult = {
  scopeStatus: R52ApprovalQueueSopScopeStatus;
  firstApprovalQueuePlacement: R52ApprovalQueuePlacement;
  placementReason: string;
  readOnlyContentScope: R52ApprovalQueueContentCategory[];
  implementationBoundary: R52ApprovalQueueScopeBoundary;
  dangerousExclusions: string[];
  accessibilityRequirements: R52ApprovalQueueAccessibilityRequirement[];
  r52pValidationPlan: R52ApprovalQueueValidationPlan[];
  r52pSuccessCriteria: string[];
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

export type R52ApprovalQueueManualRevenueSopScopeInvariantCheck = {
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

function addWarning(warningCodes: string[], warningCode: R52ApprovalQueueScopeWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function hasForbiddenScopeRequest(input: R52ApprovalQueueManualRevenueSopScopeInput) {
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
    input.bulkApprovalRequested === true ||
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

const readOnlyContentScope: R52ApprovalQueueContentCategory[] = [
  "approval_is_review_only",
  "approval_does_not_send",
  "provider_disabled_reminder",
  "manual_follow_up_reminder",
  "do_not_proceed_conditions",
  "dnc_opt_out_warning",
  "missing_critical_data_warning",
  "human_review_required",
];

const dangerousExclusions = [
  "Send SMS",
  "Send Email",
  "Auto Follow-Up",
  "Start Automation",
  "Activate Provider",
  "Run Campaign",
  "AI Autopilot",
  "Override Governance",
  "Persist SOP Progress",
  "Auto-contact seller",
  "Auto-share with buyer",
  "Approve and Send",
  "Bulk Approve",
];

const implementationBoundary: R52ApprovalQueueScopeBoundary = {
  allowedFile: "app/(dashboard)/dashboard/approvals/page.tsx",
  allowedPlacement: "top_of_approval_queue_page",
  allowedContent: readOnlyContentScope,
  prohibitedContent: dangerousExclusions,
  noNewRoutes: true,
  noNewMutationBehavior: true,
  existingApprovalBehaviorUnchanged: true,
  noProviderControls: true,
  noPolling: true,
  noPersistence: true,
};

const accessibilityRequirements: R52ApprovalQueueAccessibilityRequirement[] = [
  {
    requirement: "Use a semantic heading for the approval queue SOP guidance region.",
    reason: "Operators should encounter review-only guidance before reaching approval cards or controls.",
  },
  {
    requirement: "Use readable labels for approval-does-not-send, DNC/opt-out, missing data, and provider-disabled status.",
    reason: "Approval risk must be understandable without relying on color.",
  },
  {
    requirement: "Preserve existing keyboard order and keep guidance above queue controls.",
    reason: "Read-only guidance should not obscure or interrupt existing approval controls.",
  },
  {
    requirement: "Avoid motion, auto-refresh, or focus movement.",
    reason: "Approval guidance must not behave like polling, automation, or workflow progression.",
  },
  {
    requirement: "Keep copy concise and screen-reader-friendly.",
    reason: "Operators need quick clarity before reviewing queue items.",
  },
];

const r52pValidationPlan: R52ApprovalQueueValidationPlan[] = [
  {
    check: "Run npm.cmd run build.",
    expectedResult: "Build passes with no R52P TypeScript or rendering errors.",
  },
  {
    check: "Inspect exact diff.",
    expectedResult: "Only app/(dashboard)/dashboard/approvals/page.tsx changes.",
  },
  {
    check: "Search for automation-agent import.",
    expectedResult: "R52P does not import lib/automation-agent.ts.",
  },
  {
    check: "Search for provider, send, campaign, autopilot, activation, approve-and-send, and bulk-approve controls.",
    expectedResult: "No new provider, sending, campaign, activation, autopilot, override, auto-contact, auto-share, approve-and-send, or bulk-approve controls are added.",
  },
  {
    check: "Search for polling references.",
    expectedResult: "No setInterval, polling loop, or auto-refresh guidance is introduced.",
  },
  {
    check: "Review UI copy.",
    expectedResult: "Copy confirms approval is review-only, approval does not send, providers are disabled, and human review remains required.",
  },
];

const r52pSuccessCriteria = [
  "Exactly one authorized approval queue UI surface is changed.",
  "Guidance is read-only and appears above pending approvals.",
  "Existing approval behavior remains unchanged.",
  "No runtime activation path is added.",
  "No provider reachability is added.",
  "No advisory-to-permission language is introduced.",
  "No automation-looking controls are introduced.",
  "No new mutation, persistence, polling, or workflow write is added.",
  "Hard execution invariants remain false.",
];

export function assertR52ApprovalQueueManualRevenueSopScopeInvariants(
  result: Pick<
    R52ApprovalQueueManualRevenueSopScopeResult,
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
): R52ApprovalQueueManualRevenueSopScopeInvariantCheck {
  const warningCodes: R52ApprovalQueueManualRevenueSopScopeInvariantCheck["warningCodes"] = [];

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

export function summarizeR52ApprovalQueueManualRevenueSopScope(
  result: R52ApprovalQueueManualRevenueSopScopeResult,
) {
  const invariantCheck = assertR52ApprovalQueueManualRevenueSopScopeInvariants(result);

  return boundSummary(
    `R52O approval queue SOP scope status is ${result.scopeStatus}. ` +
      `First placement is ${result.firstApprovalQueuePlacement}. ` +
      `${result.readOnlyContentScope.length} read-only content categories, ${result.dangerousExclusions.length} dangerous exclusions, ` +
      `${result.accessibilityRequirements.length} accessibility requirements, and ${result.r52pValidationPlan.length} validation checks are defined. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract is scope-only, advisory-only, simulation-only, and cannot authorize approval behavior changes, automation, providers, sending, polling, persistence, or execution.",
  );
}

export function createR52ApprovalQueueManualRevenueSopScopeContract(
  input: R52ApprovalQueueManualRevenueSopScopeInput = {},
): R52ApprovalQueueManualRevenueSopScopeResult {
  const warningCodes: string[] = [];
  const operatorNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r52o_approval_queue_scope_contract_only");
  addWarning(warningCodes, "persistence_not_allowed_now");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.placementReviewed !== true) addWarning(warningCodes, "placement_review_required");
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
  if (input.bulkApprovalRequested === true) addWarning(warningCodes, "bulk_approval_rejected");
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
  const scopeStatus: R52ApprovalQueueSopScopeStatus = hasForbiddenScopeRequest(input)
    ? "approval_queue_scope_blocked"
    : operatorReviewRequired ||
        input.placementReviewed !== true ||
        input.contentScopeReviewed !== true ||
        input.implementationBoundaryReviewed !== true ||
        input.accessibilityRequirementsReviewed !== true ||
        input.validationPlanReviewed !== true
      ? "operator_review_required"
      : "approval_queue_scope_ready";

  const result: R52ApprovalQueueManualRevenueSopScopeResult = {
    scopeStatus,
    firstApprovalQueuePlacement: "top_of_approval_queue_page",
    placementReason:
      "The top of the approval queue page is visible before filters, cards, and approval controls, so it can clarify review-only behavior without touching existing queue logic.",
    readOnlyContentScope,
    implementationBoundary,
    dangerousExclusions,
    accessibilityRequirements,
    r52pValidationPlan,
    r52pSuccessCriteria,
    operatorReviewRequired,
    warningCodes,
    operatorNotes,
    summary: "R52O approval queue manual revenue SOP scope contract only.",
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
    summary: summarizeR52ApprovalQueueManualRevenueSopScope(result),
  };
}
