export type R55ApprovalQueueObservabilitySurface = "approval_queue_observability";

export type R55ApprovalQueueObservabilityScopeStatus =
  | "approval_queue_observability_plan_blocked"
  | "approval_queue_observability_planning_only"
  | "approval_queue_observability_strict_read_only_scope_ready";

export type R55ApprovalQueueRiskClassification =
  | "approval_surface_high_risk"
  | "approval_surface_requires_strong_governance_wording"
  | "approval_surface_strict_read_only_candidate";

export type R55ApprovalQueueCandidateObservabilityItem =
  | "approval_review_backlog_visibility"
  | "blocked_state_visibility"
  | "governance_review_required_visibility"
  | "human_review_required_summary"
  | "missing_data_review_indicators"
  | "manual_review_reminders"
  | "advisory_queue_status_summary"
  | "safe_workload_visibility";

export type R55ApprovalQueueBlockedPattern =
  | "Start Automation"
  | "Send SMS"
  | "Send Email"
  | "Auto Follow-Up"
  | "Activate Provider"
  | "Run Campaign"
  | "AI Autopilot"
  | "Override Governance"
  | "Persist Metrics"
  | "Approve and Send"
  | "Bulk Approve"
  | "ready to send"
  | "queue execution"
  | "auto release"
  | "approval means send"
  | "approval triggers execution"
  | "provider-ready wording"
  | "runtime-ready wording"
  | "one-click execution"
  | "auto-send semantics"
  | "bulk execution semantics"
  | "provider activation semantics"
  | "persistence semantics"
  | "polling semantics"
  | "hidden execution affordances";

export type R55ApprovalQueueGovernanceWarning =
  | "r55a_approval_queue_observability_plan_contract_only"
  | "approval_surface_is_higher_risk"
  | "input_missing"
  | "scope_review_required"
  | "approval_semantics_review_required"
  | "safety_boundary_review_required"
  | "accessibility_review_required"
  | "operator_review_required"
  | "stronger_governance_wording_required"
  | "ui_implementation_rejected"
  | "route_change_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "approval_as_permission_rejected"
  | "approval_as_send_rejected"
  | "bulk_execution_rejected"
  | "ready_to_send_wording_rejected"
  | "queue_execution_wording_rejected"
  | "auto_release_wording_rejected"
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

export type R55ApprovalQueueRiskCategoryRanking = {
  category:
    | "approval_as_permission_drift"
    | "execution_proximity"
    | "bulk_action_confusion"
    | "provider_readiness_confusion"
    | "persistence_or_polling_confusion"
    | "accessibility_attention_load";
  riskLevel: "high" | "medium";
  reason: string;
  requiredMitigation: string;
};

export type R55ApprovalQueueObservabilityPlanInput = {
  scopeReviewed?: boolean;
  approvalSemanticsReviewed?: boolean;
  safetyBoundariesReviewed?: boolean;
  accessibilityReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  strongerGovernanceWordingAccepted?: boolean;
  uiImplementationRequested?: boolean;
  routeChangeRequested?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  approvalConvertedToPermission?: boolean;
  approvalAsSendRequested?: boolean;
  bulkExecutionRequested?: boolean;
  readyToSendWordingRequested?: boolean;
  queueExecutionWordingRequested?: boolean;
  autoReleaseWordingRequested?: boolean;
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
  extraPlanningNotes?: string[];
};

export type R55ApprovalQueueObservabilitySafetyFlags = {
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

export type R55ApprovalQueueObservabilityImplementationBoundaries = {
  futureCandidateSurface: "app/(dashboard)/dashboard/approvals/page.tsx";
  futureAllowedPlacement: "above_approval_queue_client";
  noUiImplementationNow: true;
  noApprovalBehaviorChanges: true;
  noNewRoutes: true;
  noMutationControls: true;
  noProviderControls: true;
  noPolling: true;
  noPersistence: true;
  noRuntimeExecution: true;
  noAutomationAgent: true;
  noBulkExecutionControls: true;
  useExistingQueueDataOnlyLater: true;
};

export type R55ApprovalQueueObservabilityPlanResult = R55ApprovalQueueObservabilitySafetyFlags & {
  surface: R55ApprovalQueueObservabilitySurface;
  scopeStatus: R55ApprovalQueueObservabilityScopeStatus;
  riskClassification: R55ApprovalQueueRiskClassification;
  candidateObservabilityItems: R55ApprovalQueueCandidateObservabilityItem[];
  blockedPatterns: R55ApprovalQueueBlockedPattern[];
  requiredSafetyCopy: string[];
  governanceWarnings: string[];
  riskCategoryRankings: R55ApprovalQueueRiskCategoryRanking[];
  accessibilityRequirements: string[];
  implementationBoundaries: R55ApprovalQueueObservabilityImplementationBoundaries;
  rejectionReasons: string[];
  safetyFlags: R55ApprovalQueueObservabilitySafetyFlags;
  nextSuggestedPhase: string;
  operatorReviewRequired: boolean;
  warningCodes: string[];
  operatorNotes: string[];
  summary: string;
};

export type R55ApprovalQueueObservabilityInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R55ApprovalQueueObservabilitySafetyFlags = {
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

const candidateObservabilityItems: R55ApprovalQueueCandidateObservabilityItem[] = [
  "approval_review_backlog_visibility",
  "blocked_state_visibility",
  "governance_review_required_visibility",
  "human_review_required_summary",
  "missing_data_review_indicators",
  "manual_review_reminders",
  "advisory_queue_status_summary",
  "safe_workload_visibility",
];

const blockedPatterns: R55ApprovalQueueBlockedPattern[] = [
  "Start Automation",
  "Send SMS",
  "Send Email",
  "Auto Follow-Up",
  "Activate Provider",
  "Run Campaign",
  "AI Autopilot",
  "Override Governance",
  "Persist Metrics",
  "Approve and Send",
  "Bulk Approve",
  "ready to send",
  "queue execution",
  "auto release",
  "approval means send",
  "approval triggers execution",
  "provider-ready wording",
  "runtime-ready wording",
  "one-click execution",
  "auto-send semantics",
  "bulk execution semantics",
  "provider activation semantics",
  "persistence semantics",
  "polling semantics",
  "hidden execution affordances",
];

const requiredSafetyCopy = [
  "Approval queue observability is read-only and advisory-only.",
  "Approval review does not send messages, activate providers, or execute automation.",
  "Human review remains required before any seller or buyer-facing action.",
  "Provider activation, live sending, polling, persistence, and runtime execution remain blocked.",
  "Blocked, incomplete, DNC, opt-out, and governance-risk signals are do-not-proceed visibility.",
  "Queue metrics describe workload only; they do not grant permission or create execution readiness.",
];

const governanceWarnings = [
  "Approval queue surfaces are higher-risk because they sit near review controls.",
  "Approval wording must be stronger than lead detail wording to prevent approval-as-permission drift.",
  "Future UI must separate observability text from existing approval controls.",
  "Future UI must avoid bulk-action language and execution-ready language.",
];

const riskCategoryRankings: R55ApprovalQueueRiskCategoryRanking[] = [
  {
    category: "approval_as_permission_drift",
    riskLevel: "high",
    reason: "Approval queue context can be mistaken for authorization to contact sellers or buyers.",
    requiredMitigation: "Use explicit copy that approval review does not send messages or activate providers.",
  },
  {
    category: "execution_proximity",
    riskLevel: "high",
    reason: "Queue controls are closer to operational decisions than dashboard or lead detail summaries.",
    requiredMitigation: "Keep observability separate from mutation controls and do not add execution affordances.",
  },
  {
    category: "bulk_action_confusion",
    riskLevel: "high",
    reason: "Queue surfaces can suggest batch execution if wording is loose.",
    requiredMitigation: "Block bulk execution, batch send, and queue execution semantics.",
  },
  {
    category: "provider_readiness_confusion",
    riskLevel: "high",
    reason: "Approval terms can imply provider readiness if not explicitly bounded.",
    requiredMitigation: "State that providers remain disabled and no live sending is allowed.",
  },
  {
    category: "persistence_or_polling_confusion",
    riskLevel: "medium",
    reason: "Queue visibility could be mistaken for persisted progress or live refresh.",
    requiredMitigation: "Avoid polling, auto-refresh, and persistence wording.",
  },
  {
    category: "accessibility_attention_load",
    riskLevel: "medium",
    reason: "Approval pages already carry decision pressure and can become noisy.",
    requiredMitigation: "Use concise headings, readable status text, and non-color-only warnings.",
  },
];

const accessibilityRequirements = [
  "Use a semantic heading for any future approval queue observability region.",
  "Use concise labels that distinguish review status from execution permission.",
  "Communicate blocked and do-not-proceed states with text, not color alone.",
  "Preserve keyboard order and do not move focus.",
  "Avoid motion, polling, auto-refresh dependency, and live-region noise.",
  "Keep guidance low clutter so it does not obscure existing approval controls.",
  "Use screen-reader-friendly wording that states approval does not send messages.",
];

const implementationBoundaries: R55ApprovalQueueObservabilityImplementationBoundaries = {
  futureCandidateSurface: "app/(dashboard)/dashboard/approvals/page.tsx",
  futureAllowedPlacement: "above_approval_queue_client",
  noUiImplementationNow: true,
  noApprovalBehaviorChanges: true,
  noNewRoutes: true,
  noMutationControls: true,
  noProviderControls: true,
  noPolling: true,
  noPersistence: true,
  noRuntimeExecution: true,
  noAutomationAgent: true,
  noBulkExecutionControls: true,
  useExistingQueueDataOnlyLater: true,
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

function addWarning(warningCodes: string[], warningCode: R55ApprovalQueueGovernanceWarning) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function hasForbiddenRequest(input: R55ApprovalQueueObservabilityPlanInput) {
  return (
    input.uiImplementationRequested === true ||
    input.routeChangeRequested === true ||
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.approvalConvertedToPermission === true ||
    input.approvalAsSendRequested === true ||
    input.bulkExecutionRequested === true ||
    input.readyToSendWordingRequested === true ||
    input.queueExecutionWordingRequested === true ||
    input.autoReleaseWordingRequested === true ||
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

export function assertR55ApprovalQueueObservabilityPlanInvariants(
  result: Pick<
    R55ApprovalQueueObservabilityPlanResult,
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
): R55ApprovalQueueObservabilityInvariantCheck {
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

export function summarizeR55ApprovalQueueObservabilityPlan(result: R55ApprovalQueueObservabilityPlanResult) {
  const invariantCheck = assertR55ApprovalQueueObservabilityPlanInvariants(result);

  return boundSummary(
    `R55A ${result.surface} status is ${result.scopeStatus}. ` +
      `Risk classification is ${result.riskClassification}. ` +
      `${result.candidateObservabilityItems.length} future read-only items are candidates and ${result.blockedPatterns.length} unsafe approval semantics are blocked. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract is planning-only and cannot authorize approval execution, UI implementation, routes, polling, persistence, providers, sending, automation, or runtime activation.",
  );
}

export function createR55ApprovalQueueObservabilityPlanContract(
  input: R55ApprovalQueueObservabilityPlanInput = {},
): R55ApprovalQueueObservabilityPlanResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const operatorNotes = collectNotes(input.extraPlanningNotes);

  addWarning(warningCodes, "r55a_approval_queue_observability_plan_contract_only");
  addWarning(warningCodes, "approval_surface_is_higher_risk");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.scopeReviewed !== true) addWarning(warningCodes, "scope_review_required");
  if (input.approvalSemanticsReviewed !== true) addWarning(warningCodes, "approval_semantics_review_required");
  if (input.safetyBoundariesReviewed !== true) addWarning(warningCodes, "safety_boundary_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.strongerGovernanceWordingAccepted !== true) addWarning(warningCodes, "stronger_governance_wording_required");
  if (input.uiImplementationRequested === true) addWarning(warningCodes, "ui_implementation_rejected");
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.approvalConvertedToPermission === true) addWarning(warningCodes, "approval_as_permission_rejected");
  if (input.approvalAsSendRequested === true) addWarning(warningCodes, "approval_as_send_rejected");
  if (input.bulkExecutionRequested === true) addWarning(warningCodes, "bulk_execution_rejected");
  if (input.readyToSendWordingRequested === true) addWarning(warningCodes, "ready_to_send_wording_rejected");
  if (input.queueExecutionWordingRequested === true) addWarning(warningCodes, "queue_execution_wording_rejected");
  if (input.autoReleaseWordingRequested === true) addWarning(warningCodes, "auto_release_wording_rejected");
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
    if (
      warningCode.endsWith("_rejected") ||
      warningCode.endsWith("_must_be_false") ||
      warningCode.endsWith("_not_allowed_now")
    ) {
      addUnique(rejectionReasons, warningCode);
    }
  }

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const missingRequiredReview =
    input.scopeReviewed !== true ||
    input.approvalSemanticsReviewed !== true ||
    input.safetyBoundariesReviewed !== true ||
    input.accessibilityReviewed !== true ||
    operatorReviewRequired ||
    input.strongerGovernanceWordingAccepted !== true;
  const scopeStatus: R55ApprovalQueueObservabilityScopeStatus = hasForbiddenRequest(input)
    ? "approval_queue_observability_plan_blocked"
    : missingRequiredReview
      ? "approval_queue_observability_planning_only"
      : "approval_queue_observability_strict_read_only_scope_ready";
  const riskClassification: R55ApprovalQueueRiskClassification = hasForbiddenRequest(input)
    ? "approval_surface_high_risk"
    : missingRequiredReview
      ? "approval_surface_requires_strong_governance_wording"
      : "approval_surface_strict_read_only_candidate";
  const result: R55ApprovalQueueObservabilityPlanResult = {
    surface: "approval_queue_observability",
    scopeStatus,
    riskClassification,
    candidateObservabilityItems,
    blockedPatterns,
    requiredSafetyCopy,
    governanceWarnings,
    riskCategoryRankings,
    accessibilityRequirements,
    implementationBoundaries,
    rejectionReasons,
    safetyFlags,
    nextSuggestedPhase:
      "R55B - Approval Queue Read-Only Observability Scope Audit, still without UI implementation or runtime activation.",
    operatorReviewRequired,
    warningCodes,
    operatorNotes,
    summary: "R55A approval queue read-only observability planning contract only.",
    ...safetyFlags,
  };

  return {
    ...result,
    summary: summarizeR55ApprovalQueueObservabilityPlan(result),
  };
}
