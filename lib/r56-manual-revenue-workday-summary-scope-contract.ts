export type R56ManualRevenueWorkdayScopeStatus =
  | "workday_summary_scope_blocked"
  | "operator_review_required"
  | "workday_summary_scope_ready";

export type R56ManualRevenueWorkdayAllowedItem =
  | "highest_priority_leads"
  | "overdue_follow_ups"
  | "stuck_deals"
  | "near_close_opportunities"
  | "missing_critical_data"
  | "blocked_deals"
  | "buyer_ready_deals"
  | "seller_response_urgency"
  | "manual_action_today"
  | "revenue_leakage_risks"
  | "human_review_required_opportunities";

export type R56ManualRevenueWorkdayBlockedPattern =
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
  | "autonomous negotiation"
  | "autonomous outreach"
  | "hidden execution affordances";

export type R56ManualRevenueWorkdayWarningCode =
  | "r56b_manual_revenue_workday_scope_contract_only"
  | "input_missing"
  | "revenue_priority_review_required"
  | "manual_workflow_review_required"
  | "governance_boundary_review_required"
  | "accessibility_review_required"
  | "operator_review_required"
  | "ui_implementation_rejected"
  | "route_change_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "autonomous_workflow_rejected"
  | "approval_grants_execution_rejected"
  | "read_only_required"
  | "advisory_only_required"
  | "simulation_only_required"
  | "provider_called_must_be_false"
  | "sent_must_be_false"
  | "persistence_not_allowed_now"
  | "polling_not_allowed"
  | "runtime_activation_not_allowed"
  | "provider_activation_allowed_must_be_false"
  | "ui_implementation_not_allowed_now"
  | "approval_grants_execution_must_be_false";

export type R56ManualRevenueWorkdayOperationalPriority = {
  priority:
    | "protect_revenue_today"
    | "move_near_close_deals"
    | "recover_stuck_deals"
    | "complete_missing_data"
    | "review_blocked_risks"
    | "prepare_buyer_disposition";
  revenueImpact: "high" | "medium";
  manualAction: string;
  safetyBoundary: string;
};

export type R56ManualRevenueWorkdayInput = {
  revenuePriorityReviewed?: boolean;
  manualWorkflowReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiImplementationRequested?: boolean;
  routeChangeRequested?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  autonomousWorkflowRequested?: boolean;
  approvalGrantsExecution?: boolean;
  readOnly?: boolean;
  advisoryOnly?: boolean;
  simulationOnly?: boolean;
  providerCalled?: boolean;
  sent?: boolean;
  persistenceAllowedNow?: boolean;
  pollingAllowed?: boolean;
  runtimeActivationAllowed?: boolean;
  providerActivationAllowed?: boolean;
  uiImplementationAllowedNow?: boolean;
  extraScopeNotes?: string[];
};

export type R56ManualRevenueWorkdaySafetyFlags = {
  readOnly: true;
  advisoryOnly: true;
  simulationOnly: true;
  providerCalled: false;
  sent: false;
  persistenceAllowedNow: false;
  pollingAllowed: false;
  runtimeActivationAllowed: false;
  providerActivationAllowed: false;
  approvalGrantsExecution: false;
  uiImplementationAllowedNow: false;
};

export type R56ManualRevenueWorkdayImplementationBoundaries = {
  noUiImplementationNow: true;
  noExecutionControls: true;
  noProviderActivation: true;
  noPolling: true;
  noPersistence: true;
  noRuntimeAutomation: true;
  noAutomationAgent: true;
  noPrismaOrSchemaChanges: true;
  noApprovalAsPermission: true;
  futureUiRequiresSeparateAuthorization: true;
  useExistingReadOnlyDataOnlyLater: true;
};

export type R56ManualRevenueWorkdayScopeResult = R56ManualRevenueWorkdaySafetyFlags & {
  surface: "manual_revenue_workday_summary";
  scopeStatus: R56ManualRevenueWorkdayScopeStatus;
  allowedWorkdayItems: R56ManualRevenueWorkdayAllowedItem[];
  operationalPriorities: R56ManualRevenueWorkdayOperationalPriority[];
  highRoiFindings: string[];
  revenuePriorityFindings: string[];
  governanceBoundaries: string[];
  accessibilityRequirements: string[];
  blockedPatterns: R56ManualRevenueWorkdayBlockedPattern[];
  requiredSafetyCopy: string[];
  implementationBoundaries: R56ManualRevenueWorkdayImplementationBoundaries;
  rejectionReasons: string[];
  safetyFlags: R56ManualRevenueWorkdaySafetyFlags;
  nextSuggestedPhase: string;
  operatorReviewRequired: boolean;
  warningCodes: string[];
  scopeNotes: string[];
  summary: string;
};

export type R56ManualRevenueWorkdayInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R56ManualRevenueWorkdaySafetyFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  providerCalled: false,
  sent: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  providerActivationAllowed: false,
  approvalGrantsExecution: false,
  uiImplementationAllowedNow: false,
};

const allowedWorkdayItems: R56ManualRevenueWorkdayAllowedItem[] = [
  "highest_priority_leads",
  "overdue_follow_ups",
  "stuck_deals",
  "near_close_opportunities",
  "missing_critical_data",
  "blocked_deals",
  "buyer_ready_deals",
  "seller_response_urgency",
  "manual_action_today",
  "revenue_leakage_risks",
  "human_review_required_opportunities",
];

const operationalPriorities: R56ManualRevenueWorkdayOperationalPriority[] = [
  {
    priority: "protect_revenue_today",
    revenueImpact: "high",
    manualAction: "Review urgent leads, overdue follow-ups, and blocked revenue risks before lower-value work.",
    safetyBoundary: "Only show prioritization; do not create contact, send, approval, provider, or automation controls.",
  },
  {
    priority: "move_near_close_deals",
    revenueImpact: "high",
    manualAction: "Surface near-close opportunities and next manual operator review needs.",
    safetyBoundary: "Do not imply closing readiness, legal completion, or transaction authorization.",
  },
  {
    priority: "recover_stuck_deals",
    revenueImpact: "high",
    manualAction: "Identify records with no recent outcome, unclear next step, or unresolved blocker.",
    safetyBoundary: "Do not auto-escalate, auto-follow-up, or mutate workflow state.",
  },
  {
    priority: "complete_missing_data",
    revenueImpact: "medium",
    manualAction: "Highlight missing source, seller context, contact, property, buyer package, or outcome data.",
    safetyBoundary: "Missing-data visibility is advisory and must not create persistence shortcuts.",
  },
  {
    priority: "review_blocked_risks",
    revenueImpact: "high",
    manualAction: "Show DNC, opt-out, governance, incomplete-data, and human-review blockers as do-not-proceed signals.",
    safetyBoundary: "No override governance controls or approval-as-permission wording.",
  },
  {
    priority: "prepare_buyer_disposition",
    revenueImpact: "medium",
    manualAction: "Show buyer-ready and incomplete buyer package opportunities for manual disposition prep.",
    safetyBoundary: "Do not auto-share with buyers or imply provider or buyer outreach readiness.",
  },
];

const highRoiFindings = [
  "Manual revenue workday summary has high ROI because it helps operators decide what matters today.",
  "The scope focuses on deal throughput, stuck-deal detection, near-close visibility, and manual next-action clarity.",
  "The surface should reduce revenue leakage without creating automation, sending, or provider semantics.",
  "The summary should be operationally useful only if it stays concise and tied to manual operator decisions.",
];

const revenuePriorityFindings = [
  "Prioritize high-value leads, overdue manual follow-ups, near-close opportunities, and stuck deals first.",
  "Treat missing critical data, DNC/opt-out, governance blockers, and incomplete buyer packages as revenue blockers.",
  "Keep seller-response urgency and buyer readiness visible as advisory workday intelligence.",
  "Avoid low-ROI generic metrics unless they directly improve acquisition, disposition, or conversion decisions.",
];

const governanceBoundaries = [
  "Workday summary is visibility only and cannot become execution permission.",
  "Human review remains required before seller-facing or buyer-facing action.",
  "Approval status does not grant execution, sending, provider activation, or workflow mutation.",
  "Future UI must not include action controls, provider controls, polling, persistence, or autonomous behavior.",
  "Blocked, DNC, opt-out, missing-data, and governance-risk states are do-not-proceed signals.",
];

const accessibilityRequirements = [
  "Use semantic headings and readable labels.",
  "Use text-based status meaning and do not rely on color alone.",
  "Preserve keyboard order and avoid focus movement.",
  "Avoid motion, auto-refresh dependency, and live-update noise.",
  "Keep wording concise, screen-reader-friendly, and low clutter.",
];

const blockedPatterns: R56ManualRevenueWorkdayBlockedPattern[] = [
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
  "autonomous negotiation",
  "autonomous outreach",
  "hidden execution affordances",
];

const requiredSafetyCopy = [
  "Manual revenue workday summary is read-only and advisory-only.",
  "The summary helps operators prioritize manual work; it does not send messages or activate providers.",
  "Human review remains required before any seller or buyer-facing action.",
  "Blocked, DNC, opt-out, missing-data, and governance-risk states are do-not-proceed signals.",
  "No automation, polling, persistence, runtime execution, or approval-as-permission behavior is allowed.",
];

const implementationBoundaries: R56ManualRevenueWorkdayImplementationBoundaries = {
  noUiImplementationNow: true,
  noExecutionControls: true,
  noProviderActivation: true,
  noPolling: true,
  noPersistence: true,
  noRuntimeAutomation: true,
  noAutomationAgent: true,
  noPrismaOrSchemaChanges: true,
  noApprovalAsPermission: true,
  futureUiRequiresSeparateAuthorization: true,
  useExistingReadOnlyDataOnlyLater: true,
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

function addWarning(warningCodes: string[], warningCode: R56ManualRevenueWorkdayWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function hasForbiddenRequest(input: R56ManualRevenueWorkdayInput) {
  return (
    input.uiImplementationRequested === true ||
    input.routeChangeRequested === true ||
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.autonomousWorkflowRequested === true ||
    input.approvalGrantsExecution === true ||
    input.readOnly === false ||
    input.advisoryOnly === false ||
    input.simulationOnly === false ||
    input.providerCalled === true ||
    input.sent === true ||
    input.persistenceAllowedNow === true ||
    input.pollingAllowed === true ||
    input.runtimeActivationAllowed === true ||
    input.providerActivationAllowed === true ||
    input.uiImplementationAllowedNow === true
  );
}

export function assertR56ManualRevenueWorkdaySummaryScopeInvariants(
  result: Pick<
    R56ManualRevenueWorkdayScopeResult,
    | "readOnly"
    | "advisoryOnly"
    | "simulationOnly"
    | "providerCalled"
    | "sent"
    | "persistenceAllowedNow"
    | "pollingAllowed"
    | "runtimeActivationAllowed"
    | "providerActivationAllowed"
    | "approvalGrantsExecution"
    | "uiImplementationAllowedNow"
  >,
): R56ManualRevenueWorkdayInvariantCheck {
  const warningCodes: string[] = [];

  if (result.readOnly !== true) warningCodes.push("read_only_required");
  if (result.advisoryOnly !== true) warningCodes.push("advisory_only_required");
  if (result.simulationOnly !== true) warningCodes.push("simulation_only_required");
  if (result.providerCalled !== false) warningCodes.push("provider_called_must_be_false");
  if (result.sent !== false) warningCodes.push("sent_must_be_false");
  if (result.persistenceAllowedNow !== false) warningCodes.push("persistence_not_allowed_now");
  if (result.pollingAllowed !== false) warningCodes.push("polling_not_allowed");
  if (result.runtimeActivationAllowed !== false) warningCodes.push("runtime_activation_not_allowed");
  if (result.providerActivationAllowed !== false) warningCodes.push("provider_activation_allowed_must_be_false");
  if (result.approvalGrantsExecution !== false) warningCodes.push("approval_grants_execution_must_be_false");
  if (result.uiImplementationAllowedNow !== false) warningCodes.push("ui_implementation_not_allowed_now");

  return {
    passed: warningCodes.length === 0,
    warningCodes,
  };
}

export function summarizeR56ManualRevenueWorkdaySummaryScope(result: R56ManualRevenueWorkdayScopeResult) {
  const invariantCheck = assertR56ManualRevenueWorkdaySummaryScopeInvariants(result);

  return boundSummary(
    `R56B ${result.surface} status is ${result.scopeStatus}. ` +
      `${result.allowedWorkdayItems.length} high-ROI workday items are scoped. ` +
      `${result.operationalPriorities.length} manual operational priorities are defined. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This scope is planning-only and cannot authorize UI, routes, polling, persistence, providers, sending, automation, autonomous negotiation, or runtime activation.",
  );
}

export function createR56ManualRevenueWorkdaySummaryScopeContract(
  input: R56ManualRevenueWorkdayInput = {},
): R56ManualRevenueWorkdayScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r56b_manual_revenue_workday_scope_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.revenuePriorityReviewed !== true) addWarning(warningCodes, "revenue_priority_review_required");
  if (input.manualWorkflowReviewed !== true) addWarning(warningCodes, "manual_workflow_review_required");
  if (input.governanceBoundaryReviewed !== true) addWarning(warningCodes, "governance_boundary_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.uiImplementationRequested === true) addWarning(warningCodes, "ui_implementation_rejected");
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.autonomousWorkflowRequested === true) addWarning(warningCodes, "autonomous_workflow_rejected");
  if (input.approvalGrantsExecution === true) addWarning(warningCodes, "approval_grants_execution_rejected");
  if (input.readOnly === false) addWarning(warningCodes, "read_only_required");
  if (input.advisoryOnly === false) addWarning(warningCodes, "advisory_only_required");
  if (input.simulationOnly === false) addWarning(warningCodes, "simulation_only_required");
  if (input.providerCalled === true) addWarning(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addWarning(warningCodes, "sent_must_be_false");
  if (input.persistenceAllowedNow === true) addWarning(warningCodes, "persistence_not_allowed_now");
  if (input.pollingAllowed === true) addWarning(warningCodes, "polling_not_allowed");
  if (input.runtimeActivationAllowed === true) addWarning(warningCodes, "runtime_activation_not_allowed");
  if (input.providerActivationAllowed === true) addWarning(warningCodes, "provider_activation_allowed_must_be_false");
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
    input.revenuePriorityReviewed !== true ||
    input.manualWorkflowReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R56ManualRevenueWorkdayScopeStatus = hasForbiddenRequest(input)
    ? "workday_summary_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "workday_summary_scope_ready";
  const result: R56ManualRevenueWorkdayScopeResult = {
    surface: "manual_revenue_workday_summary",
    scopeStatus,
    allowedWorkdayItems,
    operationalPriorities,
    highRoiFindings,
    revenuePriorityFindings,
    governanceBoundaries,
    accessibilityRequirements,
    blockedPatterns,
    requiredSafetyCopy,
    implementationBoundaries,
    rejectionReasons,
    safetyFlags,
    nextSuggestedPhase:
      "R56C - Manual Revenue Workday Summary Read-Only UI Implementation Scope Audit, still without UI implementation or runtime activation.",
    operatorReviewRequired,
    warningCodes,
    scopeNotes,
    summary: "R56B manual revenue workday summary scope contract only.",
    ...safetyFlags,
  };

  return {
    ...result,
    summary: summarizeR56ManualRevenueWorkdaySummaryScope(result),
  };
}
