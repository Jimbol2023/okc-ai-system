export type R54LeadDetailObservabilityScopeStatus =
  | "lead_detail_observability_scope_blocked"
  | "operator_review_required"
  | "lead_detail_observability_scope_ready";

export type R54LeadDetailObservabilitySurface = "lead_detail_observability";

export type R54LeadDetailAllowedObservabilityItem =
  | "lead_revenue_readiness_summary"
  | "missing_critical_lead_data"
  | "seller_call_status_summary"
  | "follow_up_due_overdue_summary"
  | "buyer_package_completeness_summary"
  | "dnc_opt_out_blocked_visibility"
  | "governance_blocked_visibility"
  | "human_review_required_advisory"
  | "near_contract_near_close_advisory"
  | "manual_next_step_reminder";

export type R54LeadDetailBlockedObservabilityItem =
  | "Send SMS"
  | "Send Email"
  | "Start Automation"
  | "Auto Follow-Up"
  | "Activate Provider"
  | "Run Campaign"
  | "AI Autopilot"
  | "Override Governance"
  | "Persist Metrics"
  | "Auto-contact seller"
  | "Auto-share with buyer"
  | "Approve and Send"
  | "Bulk Approve"
  | "one-click execution controls"
  | "approval-as-permission wording"
  | "provider-ready wording"
  | "runtime-ready wording"
  | "polling/auto-refresh semantics"
  | "persistence/write semantics";

export type R54LeadDetailObservabilityWarningCode =
  | "r54b_lead_detail_observability_scope_contract_only"
  | "input_missing"
  | "scope_review_required"
  | "safety_review_required"
  | "accessibility_review_required"
  | "implementation_boundary_review_required"
  | "operator_review_required"
  | "ui_implementation_rejected"
  | "route_change_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "advisory_to_permission_rejected"
  | "approval_as_send_rejected"
  | "read_only_required"
  | "advisory_only_required"
  | "simulation_only_required"
  | "live_execution_allowed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "provider_called_must_be_false"
  | "sent_must_be_false"
  | "persistence_not_allowed_now"
  | "polling_not_allowed"
  | "runtime_activation_not_allowed"
  | "ui_implementation_not_allowed_now";

export type R54LeadDetailObservabilityScopeInput = {
  scopeReviewed?: boolean;
  safetyBoundariesReviewed?: boolean;
  accessibilityReviewed?: boolean;
  implementationBoundariesReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiImplementationRequested?: boolean;
  routeChangeRequested?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  advisoryConvertedToPermission?: boolean;
  approvalAsSendRequested?: boolean;
  readOnly?: boolean;
  advisoryOnly?: boolean;
  simulationOnly?: boolean;
  liveExecutionAllowed?: boolean;
  providerActivationAllowed?: boolean;
  providerCalled?: boolean;
  sent?: boolean;
  persistenceAllowedNow?: boolean;
  pollingAllowed?: boolean;
  runtimeActivationAllowed?: boolean;
  uiImplementationAllowedNow?: boolean;
  extraScopeNotes?: string[];
};

export type R54LeadDetailObservabilitySafetyFlags = {
  readOnly: true;
  advisoryOnly: true;
  simulationOnly: true;
  liveExecutionAllowed: false;
  providerActivationAllowed: false;
  providerCalled: false;
  sent: false;
  persistenceAllowedNow: false;
  pollingAllowed: false;
  runtimeActivationAllowed: false;
  uiImplementationAllowedNow: false;
};

export type R54LeadDetailObservabilityImplementationBoundaries = {
  laterAllowedSurface: "components/dashboard/lead-detail-client.tsx";
  laterAllowedPlacement: "top_of_lead_detail_page";
  noUiImplementationNow: true;
  noNewRoutes: true;
  noMutationControls: true;
  noProviderControls: true;
  noPolling: true;
  noPersistence: true;
  noRuntimeExecution: true;
  noAutomationAgent: true;
  useInMemoryLeadDataOnly: true;
};

export type R54LeadDetailObservabilityScopeResult = R54LeadDetailObservabilitySafetyFlags & {
  surface: R54LeadDetailObservabilitySurface;
  scopeStatus: R54LeadDetailObservabilityScopeStatus;
  allowedObservabilityItems: R54LeadDetailAllowedObservabilityItem[];
  blockedObservabilityItems: R54LeadDetailBlockedObservabilityItem[];
  requiredSafetyCopy: string[];
  accessibilityRequirements: string[];
  safetyFlags: R54LeadDetailObservabilitySafetyFlags;
  implementationBoundaries: R54LeadDetailObservabilityImplementationBoundaries;
  rejectionReasons: string[];
  nextSuggestedPhase: string;
  operatorReviewRequired: boolean;
  warningCodes: string[];
  operatorNotes: string[];
  summary: string;
};

export type R54LeadDetailObservabilityScopeInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R54LeadDetailObservabilitySafetyFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  liveExecutionAllowed: false,
  providerActivationAllowed: false,
  providerCalled: false,
  sent: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  uiImplementationAllowedNow: false,
};

const allowedObservabilityItems: R54LeadDetailAllowedObservabilityItem[] = [
  "lead_revenue_readiness_summary",
  "missing_critical_lead_data",
  "seller_call_status_summary",
  "follow_up_due_overdue_summary",
  "buyer_package_completeness_summary",
  "dnc_opt_out_blocked_visibility",
  "governance_blocked_visibility",
  "human_review_required_advisory",
  "near_contract_near_close_advisory",
  "manual_next_step_reminder",
];

const blockedObservabilityItems: R54LeadDetailBlockedObservabilityItem[] = [
  "Send SMS",
  "Send Email",
  "Start Automation",
  "Auto Follow-Up",
  "Activate Provider",
  "Run Campaign",
  "AI Autopilot",
  "Override Governance",
  "Persist Metrics",
  "Auto-contact seller",
  "Auto-share with buyer",
  "Approve and Send",
  "Bulk Approve",
  "one-click execution controls",
  "approval-as-permission wording",
  "provider-ready wording",
  "runtime-ready wording",
  "polling/auto-refresh semantics",
  "persistence/write semantics",
];

const requiredSafetyCopy = [
  "Read-only lead observability.",
  "Manual operator review only.",
  "Human review is required before seller or buyer-facing action.",
  "Approval does not send messages or activate providers.",
  "Providers, live sending, automation, polling, and persistence remain blocked.",
  "DNC, opt-out, governance-blocked, and incomplete-data signals are do-not-proceed visibility.",
];

const accessibilityRequirements = [
  "Use a semantic heading for the lead-detail observability region.",
  "Use readable labels and short helper text for every metric or status.",
  "Communicate blocked states with text, not color alone.",
  "Preserve keyboard order and do not move focus.",
  "Avoid motion, loading animation dependency, polling, and auto-refresh semantics.",
  "Keep the scope concise so it does not obscure existing lead detail controls.",
  "Use screen-reader-friendly wording that names advisory and blocked states explicitly.",
];

const implementationBoundaries: R54LeadDetailObservabilityImplementationBoundaries = {
  laterAllowedSurface: "components/dashboard/lead-detail-client.tsx",
  laterAllowedPlacement: "top_of_lead_detail_page",
  noUiImplementationNow: true,
  noNewRoutes: true,
  noMutationControls: true,
  noProviderControls: true,
  noPolling: true,
  noPersistence: true,
  noRuntimeExecution: true,
  noAutomationAgent: true,
  useInMemoryLeadDataOnly: true,
};

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

function addWarning(warningCodes: string[], warningCode: R54LeadDetailObservabilityWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function hasForbiddenRequest(input: R54LeadDetailObservabilityScopeInput) {
  return (
    input.uiImplementationRequested === true ||
    input.routeChangeRequested === true ||
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.advisoryConvertedToPermission === true ||
    input.approvalAsSendRequested === true ||
    input.readOnly === false ||
    input.advisoryOnly === false ||
    input.simulationOnly === false ||
    input.liveExecutionAllowed === true ||
    input.providerActivationAllowed === true ||
    input.providerCalled === true ||
    input.sent === true ||
    input.persistenceAllowedNow === true ||
    input.pollingAllowed === true ||
    input.runtimeActivationAllowed === true ||
    input.uiImplementationAllowedNow === true
  );
}

export function assertR54LeadDetailObservabilityScopeInvariants(
  result: Pick<
    R54LeadDetailObservabilityScopeResult,
    | "readOnly"
    | "advisoryOnly"
    | "simulationOnly"
    | "liveExecutionAllowed"
    | "providerActivationAllowed"
    | "providerCalled"
    | "sent"
    | "persistenceAllowedNow"
    | "pollingAllowed"
    | "runtimeActivationAllowed"
    | "uiImplementationAllowedNow"
  >,
): R54LeadDetailObservabilityScopeInvariantCheck {
  const warningCodes: string[] = [];

  if (result.readOnly !== true) warningCodes.push("read_only_required");
  if (result.advisoryOnly !== true) warningCodes.push("advisory_only_required");
  if (result.simulationOnly !== true) warningCodes.push("simulation_only_required");
  if (result.liveExecutionAllowed !== false) warningCodes.push("live_execution_allowed_must_be_false");
  if (result.providerActivationAllowed !== false) warningCodes.push("provider_activation_allowed_must_be_false");
  if (result.providerCalled !== false) warningCodes.push("provider_called_must_be_false");
  if (result.sent !== false) warningCodes.push("sent_must_be_false");
  if (result.persistenceAllowedNow !== false) warningCodes.push("persistence_not_allowed_now");
  if (result.pollingAllowed !== false) warningCodes.push("polling_not_allowed");
  if (result.runtimeActivationAllowed !== false) warningCodes.push("runtime_activation_not_allowed");
  if (result.uiImplementationAllowedNow !== false) warningCodes.push("ui_implementation_not_allowed_now");

  return {
    passed: warningCodes.length === 0,
    warningCodes,
  };
}

export function summarizeR54LeadDetailObservabilityScope(result: R54LeadDetailObservabilityScopeResult) {
  const invariantCheck = assertR54LeadDetailObservabilityScopeInvariants(result);

  return boundSummary(
    `R54B ${result.surface} scope status is ${result.scopeStatus}. ` +
      `${result.allowedObservabilityItems.length} read-only observability items are allowed and ${result.blockedObservabilityItems.length} unsafe patterns are blocked. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract is scope-only and cannot authorize UI implementation, routes, polling, persistence, providers, sending, automation, or runtime activation.",
  );
}

export function createR54LeadDetailObservabilityScopeContract(
  input: R54LeadDetailObservabilityScopeInput = {},
): R54LeadDetailObservabilityScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const operatorNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r54b_lead_detail_observability_scope_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.scopeReviewed !== true) addWarning(warningCodes, "scope_review_required");
  if (input.safetyBoundariesReviewed !== true) addWarning(warningCodes, "safety_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.implementationBoundariesReviewed !== true) addWarning(warningCodes, "implementation_boundary_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.uiImplementationRequested === true) addWarning(warningCodes, "ui_implementation_rejected");
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.advisoryConvertedToPermission === true) addWarning(warningCodes, "advisory_to_permission_rejected");
  if (input.approvalAsSendRequested === true) addWarning(warningCodes, "approval_as_send_rejected");
  if (input.readOnly === false) addWarning(warningCodes, "read_only_required");
  if (input.advisoryOnly === false) addWarning(warningCodes, "advisory_only_required");
  if (input.simulationOnly === false) addWarning(warningCodes, "simulation_only_required");
  if (input.liveExecutionAllowed === true) addWarning(warningCodes, "live_execution_allowed_must_be_false");
  if (input.providerActivationAllowed === true) addWarning(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.providerCalled === true) addWarning(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addWarning(warningCodes, "sent_must_be_false");
  if (input.persistenceAllowedNow === true) addWarning(warningCodes, "persistence_not_allowed_now");
  if (input.pollingAllowed === true) addWarning(warningCodes, "polling_not_allowed");
  if (input.runtimeActivationAllowed === true) addWarning(warningCodes, "runtime_activation_not_allowed");
  if (input.uiImplementationAllowedNow === true) addWarning(warningCodes, "ui_implementation_not_allowed_now");

  for (const warningCode of warningCodes) {
    if (warningCode.endsWith("_rejected") || warningCode.endsWith("_must_be_false") || warningCode.endsWith("_not_allowed_now")) {
      addUnique(rejectionReasons, warningCode);
    }
  }

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const missingRequiredReview =
    input.scopeReviewed !== true ||
    input.safetyBoundariesReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.implementationBoundariesReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R54LeadDetailObservabilityScopeStatus = hasForbiddenRequest(input)
    ? "lead_detail_observability_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "lead_detail_observability_scope_ready";
  const result: R54LeadDetailObservabilityScopeResult = {
    surface: "lead_detail_observability",
    scopeStatus,
    allowedObservabilityItems,
    blockedObservabilityItems,
    requiredSafetyCopy,
    accessibilityRequirements,
    safetyFlags,
    implementationBoundaries,
    rejectionReasons,
    nextSuggestedPhase:
      "R54C — Lead Detail Read-Only Observability UI Implementation, only after this scope is accepted.",
    operatorReviewRequired,
    warningCodes,
    operatorNotes,
    summary: "R54B lead detail read-only observability scope contract only.",
    ...safetyFlags,
  };

  return {
    ...result,
    summary: summarizeR54LeadDetailObservabilityScope(result),
  };
}
