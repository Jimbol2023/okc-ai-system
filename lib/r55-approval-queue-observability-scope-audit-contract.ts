export type R55ApprovalQueueScopeAuditSurface = "approval_queue_observability";

export type R55ApprovalQueueScopeAuditStatus =
  | "approval_queue_scope_blocked"
  | "approval_queue_scope_requires_review"
  | "approval_queue_scope_locked_for_future_read_only_ui";

export type R55ApprovalQueueScopeRiskLevel = "high" | "elevated";

export type R55ApprovalQueueAllowedReadOnlyItem =
  | "review_backlog_count_status"
  | "blocked_state_visibility"
  | "governance_review_required_visibility"
  | "human_review_required_summaries"
  | "missing_data_review_indicators"
  | "manual_review_reminders"
  | "advisory_queue_workload_visibility"
  | "review_reason_summaries"
  | "safety_reason_summaries"
  | "non_actionable_queue_classification";

export type R55ApprovalQueueBlockedSemantic =
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
  | "send after approval"
  | "queue execution"
  | "auto release"
  | "bulk send"
  | "approval means send"
  | "approval triggers execution"
  | "approval grants permission"
  | "provider-ready wording"
  | "runtime-ready wording"
  | "one-click execution"
  | "auto-follow-up semantics"
  | "auto-send semantics"
  | "provider activation semantics"
  | "persistence semantics"
  | "polling semantics"
  | "hidden execution affordances";

export type R55ApprovalQueueScopeWarningCode =
  | "r55b_approval_queue_scope_audit_contract_only"
  | "approval_queue_surface_high_risk"
  | "input_missing"
  | "safe_scope_review_required"
  | "safe_data_review_required"
  | "wording_review_required"
  | "action_pattern_review_required"
  | "operator_review_required"
  | "manual_review_semantics_required"
  | "accessibility_review_required"
  | "ui_implementation_rejected"
  | "approval_behavior_change_rejected"
  | "route_change_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "approval_as_permission_rejected"
  | "approval_as_send_rejected"
  | "send_after_approval_rejected"
  | "ready_to_send_wording_rejected"
  | "queue_execution_wording_rejected"
  | "auto_release_wording_rejected"
  | "bulk_approve_rejected"
  | "bulk_send_rejected"
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
  | "ui_implementation_not_allowed_now"
  | "approval_grants_execution_must_be_false";

export type R55ApprovalQueueSafeDataFinding = {
  item: R55ApprovalQueueAllowedReadOnlyItem;
  sourceShape: string;
  safeUse: string;
  requiredBoundary: string;
};

export type R55ApprovalQueueApprovalWordingRule = {
  rule: string;
  allowedLanguage: string;
  blockedLanguage: string;
};

export type R55ApprovalQueueScopeAuditInput = {
  safeScopeReviewed?: boolean;
  safeDataReviewed?: boolean;
  wordingReviewed?: boolean;
  actionPatternsReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  manualReviewSemanticsAccepted?: boolean;
  accessibilityReviewed?: boolean;
  uiImplementationRequested?: boolean;
  approvalBehaviorChangeRequested?: boolean;
  routeChangeRequested?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  approvalConvertedToPermission?: boolean;
  approvalAsSendRequested?: boolean;
  sendAfterApprovalRequested?: boolean;
  readyToSendWordingRequested?: boolean;
  queueExecutionWordingRequested?: boolean;
  autoReleaseWordingRequested?: boolean;
  bulkApproveRequested?: boolean;
  bulkSendRequested?: boolean;
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
  approvalGrantsExecution?: boolean;
  extraAuditNotes?: string[];
};

export type R55ApprovalQueueScopeSafetyFlags = {
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
  approvalGrantsExecution: false;
};

export type R55ApprovalQueueScopeImplementationBoundaries = {
  futureCandidateSurface: "app/(dashboard)/dashboard/approvals/page.tsx";
  futureCandidateComponent: "ApprovalQueueClient";
  futureAllowedPlacement: "above_approval_queue_client_or_summary_region";
  noUiImplementationNow: true;
  noApprovalBehaviorChanges: true;
  noNewRoutes: true;
  noMutationControls: true;
  noProviderControls: true;
  noPolling: true;
  noPersistence: true;
  noRuntimeExecution: true;
  noAutomationAgent: true;
  noBulkApprove: true;
  noBulkSend: true;
  noApprovalAsPermission: true;
  useExistingQueueDataOnlyLater: true;
};

export type R55ApprovalQueueScopeAuditResult = R55ApprovalQueueScopeSafetyFlags & {
  surface: R55ApprovalQueueScopeAuditSurface;
  scopeStatus: R55ApprovalQueueScopeAuditStatus;
  riskLevel: R55ApprovalQueueScopeRiskLevel;
  allowedReadOnlyItems: R55ApprovalQueueAllowedReadOnlyItem[];
  safeDataFindings: R55ApprovalQueueSafeDataFinding[];
  blockedSemantics: R55ApprovalQueueBlockedSemantic[];
  requiredSafetyCopy: string[];
  governanceBoundaries: string[];
  accessibilityRequirements: string[];
  implementationBoundaries: R55ApprovalQueueScopeImplementationBoundaries;
  approvalWordingRules: R55ApprovalQueueApprovalWordingRule[];
  rejectionReasons: string[];
  safetyFlags: R55ApprovalQueueScopeSafetyFlags;
  nextSuggestedPhase: string;
  operatorReviewRequired: boolean;
  warningCodes: string[];
  auditNotes: string[];
  summary: string;
};

export type R55ApprovalQueueScopeInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R55ApprovalQueueScopeSafetyFlags = {
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
  approvalGrantsExecution: false,
};

const allowedReadOnlyItems: R55ApprovalQueueAllowedReadOnlyItem[] = [
  "review_backlog_count_status",
  "blocked_state_visibility",
  "governance_review_required_visibility",
  "human_review_required_summaries",
  "missing_data_review_indicators",
  "manual_review_reminders",
  "advisory_queue_workload_visibility",
  "review_reason_summaries",
  "safety_reason_summaries",
  "non_actionable_queue_classification",
];

const safeDataFindings: R55ApprovalQueueSafeDataFinding[] = [
  {
    item: "review_backlog_count_status",
    sourceShape: "approvalStatus, requiresHumanApproval, visible queue lane counts",
    safeUse: "Display workload and review state only.",
    requiredBoundary: "Never describe backlog as executable or ready for delivery.",
  },
  {
    item: "blocked_state_visibility",
    sourceShape: "doNotContact, rejected approvalStatus, blocked mock outreach reasons",
    safeUse: "Show do-not-proceed conditions.",
    requiredBoundary: "Blocked state must not include override controls.",
  },
  {
    item: "governance_review_required_visibility",
    sourceShape: "approvalStatus, requiresHumanApproval, safety flags already loaded in queue cards",
    safeUse: "Show that governance review is still required.",
    requiredBoundary: "Review required must not be framed as permission granted.",
  },
  {
    item: "human_review_required_summaries",
    sourceShape: "requiresHumanApproval and approval lane data",
    safeUse: "Summarize manual review needs.",
    requiredBoundary: "Human review remains manual and non-executing.",
  },
  {
    item: "missing_data_review_indicators",
    sourceShape: "propertyAddress, phone, source, suggestedReply, lastFollowUpMessage",
    safeUse: "Highlight incomplete records for operator review.",
    requiredBoundary: "Missing data indicators must not create mutation shortcuts.",
  },
  {
    item: "manual_review_reminders",
    sourceShape: "static safety copy and existing queue context",
    safeUse: "Remind that follow-up happens outside automated execution.",
    requiredBoundary: "Reminder must not include send controls or provider language.",
  },
  {
    item: "advisory_queue_workload_visibility",
    sourceShape: "filtered in-memory leads already fetched by the queue",
    safeUse: "Summarize review workload.",
    requiredBoundary: "No polling, persistence, or background refresh semantics.",
  },
  {
    item: "review_reason_summaries",
    sourceShape: "priority, score, distress flags, approvalStatus",
    safeUse: "Explain why an item needs review.",
    requiredBoundary: "Reason summaries must stay advisory and bounded.",
  },
  {
    item: "safety_reason_summaries",
    sourceShape: "DNC, opt-out, blocked reasons, approval status",
    safeUse: "Explain safety blockers.",
    requiredBoundary: "Safety reasons must be do-not-proceed signals.",
  },
  {
    item: "non_actionable_queue_classification",
    sourceShape: "existing lane and status labels",
    safeUse: "Classify queue state without adding controls.",
    requiredBoundary: "Classification must not imply approval grants execution.",
  },
];

const blockedSemantics: R55ApprovalQueueBlockedSemantic[] = [
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
  "send after approval",
  "queue execution",
  "auto release",
  "bulk send",
  "approval means send",
  "approval triggers execution",
  "approval grants permission",
  "provider-ready wording",
  "runtime-ready wording",
  "one-click execution",
  "auto-follow-up semantics",
  "auto-send semantics",
  "provider activation semantics",
  "persistence semantics",
  "polling semantics",
  "hidden execution affordances",
];

const requiredSafetyCopy = [
  "Approval queue observability is read-only, advisory-only, and non-executing.",
  "Review required means operator review is needed; it does not grant execution permission.",
  "Approval status does not send messages, activate providers, or run automation.",
  "Seller and buyer-facing action remains manual and outside automated execution.",
  "DNC, opt-out, blocked, rejected, incomplete-data, and governance-risk signals are do-not-proceed visibility.",
  "Providers, live sending, polling, persistence, and runtime activation remain blocked.",
];

const governanceBoundaries = [
  "Future UI may show queue workload and risk context only after this scope is locked.",
  "Future UI must not change approval behavior or add mutation controls.",
  "Future UI must separate observability from existing approval controls.",
  "Future UI must avoid language that approval grants permission or execution readiness.",
  "Future UI must not add routes, polling, persistence, providers, sending, automation, or runtime activation.",
];

const accessibilityRequirements = [
  "Use a semantic heading for any future approval queue observability region.",
  "Use readable labels that distinguish review status from execution permission.",
  "Use text-based blocked and do-not-proceed meaning; do not rely on color alone.",
  "Preserve keyboard order and avoid focus movement.",
  "Avoid motion, polling, auto-refresh dependency, and noisy live updates.",
  "Keep the surface concise so guidance does not obscure existing approval controls.",
  "Use screen-reader-friendly wording that says approval does not send or execute.",
];

const implementationBoundaries: R55ApprovalQueueScopeImplementationBoundaries = {
  futureCandidateSurface: "app/(dashboard)/dashboard/approvals/page.tsx",
  futureCandidateComponent: "ApprovalQueueClient",
  futureAllowedPlacement: "above_approval_queue_client_or_summary_region",
  noUiImplementationNow: true,
  noApprovalBehaviorChanges: true,
  noNewRoutes: true,
  noMutationControls: true,
  noProviderControls: true,
  noPolling: true,
  noPersistence: true,
  noRuntimeExecution: true,
  noAutomationAgent: true,
  noBulkApprove: true,
  noBulkSend: true,
  noApprovalAsPermission: true,
  useExistingQueueDataOnlyLater: true,
};

const approvalWordingRules: R55ApprovalQueueApprovalWordingRule[] = [
  {
    rule: "review_required_is_not_permission",
    allowedLanguage: "Review required before any seller or buyer-facing action.",
    blockedLanguage: "Approval grants permission to execute.",
  },
  {
    rule: "approval_does_not_send",
    allowedLanguage: "Approval status does not send messages or activate providers.",
    blockedLanguage: "Approve and send.",
  },
  {
    rule: "queue_status_is_workload_only",
    allowedLanguage: "Queue status describes manual review workload.",
    blockedLanguage: "Queue execution is ready.",
  },
  {
    rule: "manual_follow_up_only",
    allowedLanguage: "Manual follow-up remains outside automated execution.",
    blockedLanguage: "Send after approval.",
  },
  {
    rule: "blocked_signals_are_do_not_proceed",
    allowedLanguage: "Blocked signals are do-not-proceed visibility.",
    blockedLanguage: "Override governance.",
  },
];

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

function addWarning(warningCodes: string[], warningCode: R55ApprovalQueueScopeWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function hasForbiddenRequest(input: R55ApprovalQueueScopeAuditInput) {
  return (
    input.uiImplementationRequested === true ||
    input.approvalBehaviorChangeRequested === true ||
    input.routeChangeRequested === true ||
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.approvalConvertedToPermission === true ||
    input.approvalAsSendRequested === true ||
    input.sendAfterApprovalRequested === true ||
    input.readyToSendWordingRequested === true ||
    input.queueExecutionWordingRequested === true ||
    input.autoReleaseWordingRequested === true ||
    input.bulkApproveRequested === true ||
    input.bulkSendRequested === true ||
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
    input.uiImplementationAllowedNow === true ||
    input.approvalGrantsExecution === true
  );
}

export function assertR55ApprovalQueueScopeAuditInvariants(
  result: Pick<
    R55ApprovalQueueScopeAuditResult,
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
    | "approvalGrantsExecution"
  >,
): R55ApprovalQueueScopeInvariantCheck {
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
  if (result.approvalGrantsExecution !== false) warningCodes.push("approval_grants_execution_must_be_false");

  return {
    passed: warningCodes.length === 0,
    warningCodes,
  };
}

export function summarizeR55ApprovalQueueScopeAudit(result: R55ApprovalQueueScopeAuditResult) {
  const invariantCheck = assertR55ApprovalQueueScopeAuditInvariants(result);

  return boundSummary(
    `R55B ${result.surface} scope status is ${result.scopeStatus}. ` +
      `Risk level is ${result.riskLevel}. ` +
      `${result.allowedReadOnlyItems.length} read-only items are allowed and ${result.blockedSemantics.length} unsafe semantics are blocked. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract is scope-audit-only and cannot authorize approval behavior changes, UI implementation, routes, polling, persistence, providers, sending, automation, or runtime activation.",
  );
}

export function createR55ApprovalQueueObservabilityScopeAuditContract(
  input: R55ApprovalQueueScopeAuditInput = {},
): R55ApprovalQueueScopeAuditResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const auditNotes = collectNotes(input.extraAuditNotes);

  addWarning(warningCodes, "r55b_approval_queue_scope_audit_contract_only");
  addWarning(warningCodes, "approval_queue_surface_high_risk");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.safeScopeReviewed !== true) addWarning(warningCodes, "safe_scope_review_required");
  if (input.safeDataReviewed !== true) addWarning(warningCodes, "safe_data_review_required");
  if (input.wordingReviewed !== true) addWarning(warningCodes, "wording_review_required");
  if (input.actionPatternsReviewed !== true) addWarning(warningCodes, "action_pattern_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.manualReviewSemanticsAccepted !== true) addWarning(warningCodes, "manual_review_semantics_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.uiImplementationRequested === true) addWarning(warningCodes, "ui_implementation_rejected");
  if (input.approvalBehaviorChangeRequested === true) addWarning(warningCodes, "approval_behavior_change_rejected");
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.approvalConvertedToPermission === true) addWarning(warningCodes, "approval_as_permission_rejected");
  if (input.approvalAsSendRequested === true) addWarning(warningCodes, "approval_as_send_rejected");
  if (input.sendAfterApprovalRequested === true) addWarning(warningCodes, "send_after_approval_rejected");
  if (input.readyToSendWordingRequested === true) addWarning(warningCodes, "ready_to_send_wording_rejected");
  if (input.queueExecutionWordingRequested === true) addWarning(warningCodes, "queue_execution_wording_rejected");
  if (input.autoReleaseWordingRequested === true) addWarning(warningCodes, "auto_release_wording_rejected");
  if (input.bulkApproveRequested === true) addWarning(warningCodes, "bulk_approve_rejected");
  if (input.bulkSendRequested === true) addWarning(warningCodes, "bulk_send_rejected");
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
  if (input.approvalGrantsExecution === true) addWarning(warningCodes, "approval_grants_execution_must_be_false");

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
    input.safeScopeReviewed !== true ||
    input.safeDataReviewed !== true ||
    input.wordingReviewed !== true ||
    input.actionPatternsReviewed !== true ||
    operatorReviewRequired ||
    input.manualReviewSemanticsAccepted !== true ||
    input.accessibilityReviewed !== true;
  const scopeStatus: R55ApprovalQueueScopeAuditStatus = hasForbiddenRequest(input)
    ? "approval_queue_scope_blocked"
    : missingRequiredReview
      ? "approval_queue_scope_requires_review"
      : "approval_queue_scope_locked_for_future_read_only_ui";
  const riskLevel: R55ApprovalQueueScopeRiskLevel = hasForbiddenRequest(input) ? "high" : "elevated";
  const result: R55ApprovalQueueScopeAuditResult = {
    surface: "approval_queue_observability",
    scopeStatus,
    riskLevel,
    allowedReadOnlyItems,
    safeDataFindings,
    blockedSemantics,
    requiredSafetyCopy,
    governanceBoundaries,
    accessibilityRequirements,
    implementationBoundaries,
    approvalWordingRules,
    rejectionReasons,
    safetyFlags,
    nextSuggestedPhase:
      "R55C - Approval Queue Read-Only Observability UI Implementation, only if this scope is accepted and still without runtime activation.",
    operatorReviewRequired,
    warningCodes,
    auditNotes,
    summary: "R55B approval queue read-only observability scope audit contract only.",
    ...safetyFlags,
  };

  return {
    ...result,
    summary: summarizeR55ApprovalQueueScopeAudit(result),
  };
}
