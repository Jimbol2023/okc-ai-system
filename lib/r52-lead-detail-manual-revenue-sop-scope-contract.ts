export type R52LeadDetailSopScopeStatus =
  | "lead_detail_scope_blocked"
  | "operator_review_required"
  | "lead_detail_scope_ready";

export type R52LeadDetailPlacement = "top_of_lead_detail_page";

export type R52LeadDetailContentCategory =
  | "manual_seller_call_reminder"
  | "next_safe_manual_action"
  | "missing_critical_data"
  | "do_not_proceed_conditions"
  | "dnc_opt_out_warning"
  | "human_review_required"
  | "buyer_package_readiness_reminder";

export type R52LeadDetailScopeWarningCode =
  | "r52l_lead_detail_scope_contract_only"
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
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false"
  | "persistence_not_allowed_now";

export type R52LeadDetailManualRevenueSopScopeInput = {
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

export type R52LeadDetailScopeBoundary = {
  allowedFile: "components/dashboard/lead-detail-client.tsx";
  allowedPlacement: R52LeadDetailPlacement;
  allowedContent: R52LeadDetailContentCategory[];
  prohibitedContent: string[];
  noNewRoutes: true;
  noMutationControls: true;
  noProviderControls: true;
  noPolling: true;
  noPersistence: true;
};

export type R52LeadDetailAccessibilityRequirement = {
  requirement: string;
  reason: string;
};

export type R52LeadDetailValidationPlan = {
  check: string;
  expectedResult: string;
};

export type R52LeadDetailManualRevenueSopScopeResult = {
  scopeStatus: R52LeadDetailSopScopeStatus;
  firstLeadDetailPlacement: R52LeadDetailPlacement;
  placementReason: string;
  readOnlyContentScope: R52LeadDetailContentCategory[];
  implementationBoundary: R52LeadDetailScopeBoundary;
  dangerousExclusions: string[];
  accessibilityRequirements: R52LeadDetailAccessibilityRequirement[];
  r52mValidationPlan: R52LeadDetailValidationPlan[];
  r52mSuccessCriteria: string[];
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

export type R52LeadDetailManualRevenueSopScopeInvariantCheck = {
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

function addWarning(warningCodes: string[], warningCode: R52LeadDetailScopeWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function hasForbiddenScopeRequest(input: R52LeadDetailManualRevenueSopScopeInput) {
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

const readOnlyContentScope: R52LeadDetailContentCategory[] = [
  "manual_seller_call_reminder",
  "next_safe_manual_action",
  "missing_critical_data",
  "do_not_proceed_conditions",
  "dnc_opt_out_warning",
  "human_review_required",
  "buyer_package_readiness_reminder",
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
];

const implementationBoundary: R52LeadDetailScopeBoundary = {
  allowedFile: "components/dashboard/lead-detail-client.tsx",
  allowedPlacement: "top_of_lead_detail_page",
  allowedContent: readOnlyContentScope,
  prohibitedContent: dangerousExclusions,
  noNewRoutes: true,
  noMutationControls: true,
  noProviderControls: true,
  noPolling: true,
  noPersistence: true,
};

const accessibilityRequirements: R52LeadDetailAccessibilityRequirement[] = [
  {
    requirement: "Use a semantic heading for the lead-detail SOP guidance region.",
    reason: "The first guidance surface should be discoverable before operators reach forms or approval controls.",
  },
  {
    requirement: "Use readable labels for missing data, DNC/opt-out, buyer readiness, and human review status.",
    reason: "Lead-level blockers must be understandable without relying on color.",
  },
  {
    requirement: "Preserve the existing keyboard order and avoid adding interactive controls.",
    reason: "R52M should add read-only guidance before the existing lead detail workflow controls.",
  },
  {
    requirement: "Avoid motion, auto-refresh, or focus movement.",
    reason: "The lead detail guidance should not disrupt operator review or imply automation.",
  },
  {
    requirement: "Keep copy concise and screen-reader-friendly.",
    reason: "Operators need quick next-action clarity without a dense policy wall.",
  },
];

const r52mValidationPlan: R52LeadDetailValidationPlan[] = [
  {
    check: "Run npm.cmd run build.",
    expectedResult: "Build passes with no R52M TypeScript or rendering errors.",
  },
  {
    check: "Inspect exact diff.",
    expectedResult: "Only components/dashboard/lead-detail-client.tsx changes.",
  },
  {
    check: "Search for automation-agent import.",
    expectedResult: "R52M does not import lib/automation-agent.ts.",
  },
  {
    check: "Search for provider, send, campaign, autopilot, and activation controls.",
    expectedResult: "No new provider, sending, campaign, activation, autopilot, override, auto-contact, or auto-share controls are added.",
  },
  {
    check: "Search for polling references.",
    expectedResult: "No setInterval, polling loop, or auto-refresh guidance is introduced.",
  },
  {
    check: "Review UI copy.",
    expectedResult: "Copy confirms manual-only, human-reviewed, do-not-proceed, DNC/opt-out, and buyer package readiness guidance.",
  },
];

const r52mSuccessCriteria = [
  "Exactly one authorized lead detail UI surface is changed.",
  "Guidance is read-only and appears near the top of the lead detail workflow.",
  "No runtime activation path is added.",
  "No provider reachability is added.",
  "No advisory-to-permission language is introduced.",
  "No automation-looking controls are introduced.",
  "No mutation routes, persistence, polling, or workflow writes are added.",
  "Hard execution invariants remain false.",
];

export function assertR52LeadDetailManualRevenueSopScopeInvariants(
  result: Pick<
    R52LeadDetailManualRevenueSopScopeResult,
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
): R52LeadDetailManualRevenueSopScopeInvariantCheck {
  const warningCodes: R52LeadDetailManualRevenueSopScopeInvariantCheck["warningCodes"] = [];

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

export function summarizeR52LeadDetailManualRevenueSopScope(result: R52LeadDetailManualRevenueSopScopeResult) {
  const invariantCheck = assertR52LeadDetailManualRevenueSopScopeInvariants(result);

  return boundSummary(
    `R52L lead detail SOP scope status is ${result.scopeStatus}. ` +
      `First placement is ${result.firstLeadDetailPlacement}. ` +
      `${result.readOnlyContentScope.length} read-only content categories, ${result.dangerousExclusions.length} dangerous exclusions, ` +
      `${result.accessibilityRequirements.length} accessibility requirements, and ${result.r52mValidationPlan.length} validation checks are defined. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract is scope-only, advisory-only, simulation-only, and cannot authorize UI mutation, automation, providers, sending, polling, persistence, or execution.",
  );
}

export function createR52LeadDetailManualRevenueSopScopeContract(
  input: R52LeadDetailManualRevenueSopScopeInput = {},
): R52LeadDetailManualRevenueSopScopeResult {
  const warningCodes: string[] = [];
  const operatorNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r52l_lead_detail_scope_contract_only");
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
  const scopeStatus: R52LeadDetailSopScopeStatus = hasForbiddenScopeRequest(input)
    ? "lead_detail_scope_blocked"
    : operatorReviewRequired ||
        input.placementReviewed !== true ||
        input.contentScopeReviewed !== true ||
        input.implementationBoundaryReviewed !== true ||
        input.accessibilityRequirementsReviewed !== true ||
        input.validationPlanReviewed !== true
      ? "operator_review_required"
      : "lead_detail_scope_ready";

  const result: R52LeadDetailManualRevenueSopScopeResult = {
    scopeStatus,
    firstLeadDetailPlacement: "top_of_lead_detail_page",
    placementReason:
      "The top of the lead detail page is visible before seller call, approval, and buyer-readiness controls, so it can guide manual review without adding execution paths.",
    readOnlyContentScope,
    implementationBoundary,
    dangerousExclusions,
    accessibilityRequirements,
    r52mValidationPlan,
    r52mSuccessCriteria,
    operatorReviewRequired,
    warningCodes,
    operatorNotes,
    summary: "R52L lead detail manual revenue SOP scope contract only.",
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
    summary: summarizeR52LeadDetailManualRevenueSopScope(result),
  };
}
