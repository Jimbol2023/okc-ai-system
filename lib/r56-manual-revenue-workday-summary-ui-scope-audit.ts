export type R56ManualRevenueWorkdayUiScopeStatus =
  | "ui_scope_blocked"
  | "operator_review_required"
  | "ui_scope_ready_for_later_implementation";

export type R56ManualRevenueWorkdayAllowedUiSection =
  | "manual_workday_overview"
  | "today_revenue_priorities"
  | "near_close_opportunities"
  | "stuck_deal_review"
  | "overdue_manual_follow_ups"
  | "missing_critical_data"
  | "buyer_disposition_readiness"
  | "blocked_do_not_proceed"
  | "manual_next_actions"
  | "human_review_required";

export type R56ManualRevenueWorkdayForbiddenUiControl =
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

export type R56ManualRevenueWorkdayDisplayOrderItem = {
  order: number;
  section: R56ManualRevenueWorkdayAllowedUiSection;
  intent: string;
  revenueReason: string;
  safetyCopyRequired: string;
};

export type R56ManualRevenueWorkdayUiWarningCode =
  | "r56c_manual_revenue_workday_ui_scope_audit_only"
  | "input_missing"
  | "r56b_scope_review_required"
  | "ui_surface_review_required"
  | "wording_review_required"
  | "accessibility_review_required"
  | "operator_review_required"
  | "dangerous_pattern_review_required"
  | "ui_implementation_rejected"
  | "route_change_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "execution_control_rejected"
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

export type R56ManualRevenueWorkdayUiScopeAuditInput = {
  r56bScopeReviewed?: boolean;
  uiSurfaceReviewed?: boolean;
  wordingReviewed?: boolean;
  accessibilityReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  dangerousPatternsReviewed?: boolean;
  uiImplementationRequested?: boolean;
  routeChangeRequested?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  executionControlRequested?: boolean;
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
  extraAuditNotes?: string[];
};

export type R56ManualRevenueWorkdayUiSafetyFlags = {
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

export type R56ManualRevenueWorkdayUiImplementationBoundary = {
  candidateSurface: "dashboard_manual_revenue_workday_summary";
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx";
  noUiImplementationNow: true;
  noNewRoutes: true;
  noPolling: true;
  noPersistence: true;
  noProviderControls: true;
  noExecutionControls: true;
  noAutomationAgent: true;
  noApprovalBehaviorChanges: true;
  useExistingReadOnlyLeadDataOnlyLater: true;
  futureImplementationRequiresExplicitAuthorization: true;
};

export type R56ManualRevenueWorkdayUiScopeAuditResult = R56ManualRevenueWorkdayUiSafetyFlags & {
  surface: "manual_revenue_workday_summary_ui";
  scopeStatus: R56ManualRevenueWorkdayUiScopeStatus;
  allowedUiSections: R56ManualRevenueWorkdayAllowedUiSection[];
  forbiddenUiControls: R56ManualRevenueWorkdayForbiddenUiControl[];
  revenuePriorityDisplayOrder: R56ManualRevenueWorkdayDisplayOrderItem[];
  safeWording: string[];
  accessibilityExpectations: string[];
  noActionBoundaries: string[];
  dangerousPatternChecks: string[];
  implementationBoundaries: R56ManualRevenueWorkdayUiImplementationBoundary;
  rejectionReasons: string[];
  safetyFlags: R56ManualRevenueWorkdayUiSafetyFlags;
  warningCodes: string[];
  operatorReviewRequired: boolean;
  auditNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R56ManualRevenueWorkdayUiInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R56ManualRevenueWorkdayUiSafetyFlags = {
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

const allowedUiSections: R56ManualRevenueWorkdayAllowedUiSection[] = [
  "manual_workday_overview",
  "today_revenue_priorities",
  "near_close_opportunities",
  "stuck_deal_review",
  "overdue_manual_follow_ups",
  "missing_critical_data",
  "buyer_disposition_readiness",
  "blocked_do_not_proceed",
  "manual_next_actions",
  "human_review_required",
];

const forbiddenUiControls: R56ManualRevenueWorkdayForbiddenUiControl[] = [
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

const revenuePriorityDisplayOrder: R56ManualRevenueWorkdayDisplayOrderItem[] = [
  {
    order: 1,
    section: "manual_workday_overview",
    intent: "Set daily operating context and remind the operator the summary is read-only.",
    revenueReason: "Anchors the day around manual revenue work instead of generic dashboard scanning.",
    safetyCopyRequired: "Read-only manual revenue workday summary. No messages are sent and no providers are activated.",
  },
  {
    order: 2,
    section: "today_revenue_priorities",
    intent: "Show the highest-value manual work first.",
    revenueReason: "Reduces operator time spent on low-value records.",
    safetyCopyRequired: "Priorities are advisory and require human review.",
  },
  {
    order: 3,
    section: "near_close_opportunities",
    intent: "Surface deals closest to revenue.",
    revenueReason: "Helps protect near-term deal throughput.",
    safetyCopyRequired: "Near-close does not mean closing-ready or execution-ready.",
  },
  {
    order: 4,
    section: "stuck_deal_review",
    intent: "Expose stale or blocked revenue motion.",
    revenueReason: "Stuck-deal detection reduces leakage.",
    safetyCopyRequired: "Review manually; no auto-escalation or workflow mutation occurs.",
  },
  {
    order: 5,
    section: "overdue_manual_follow_ups",
    intent: "Identify follow-ups that need manual attention.",
    revenueReason: "Follow-up discipline directly affects conversion.",
    safetyCopyRequired: "Manual follow-up only; no automatic contact is available.",
  },
  {
    order: 6,
    section: "missing_critical_data",
    intent: "Show data gaps that block acquisition or disposition decisions.",
    revenueReason: "Missing source, seller context, property, or buyer package data slows revenue.",
    safetyCopyRequired: "Missing-data visibility is advisory and does not persist progress.",
  },
  {
    order: 7,
    section: "buyer_disposition_readiness",
    intent: "Show buyer-ready and incomplete buyer package opportunities.",
    revenueReason: "Disposition prep improves deal movement after acquisition qualification.",
    safetyCopyRequired: "No buyer sharing, provider outreach, or send controls are present.",
  },
  {
    order: 8,
    section: "blocked_do_not_proceed",
    intent: "Make DNC, opt-out, governance, and blocked records unmistakable.",
    revenueReason: "Prevents unsafe work and focuses the operator on remediable blockers.",
    safetyCopyRequired: "Blocked signals are do-not-proceed states.",
  },
  {
    order: 9,
    section: "human_review_required",
    intent: "Separate review requirements from permission or execution.",
    revenueReason: "Keeps decision quality high without creating approval drift.",
    safetyCopyRequired: "Human review does not grant execution permission.",
  },
  {
    order: 10,
    section: "manual_next_actions",
    intent: "Provide concise manual next-step reminders.",
    revenueReason: "Operator clarity improves throughput without adding automation.",
    safetyCopyRequired: "Next actions are manual guidance only.",
  },
];

const safeWording = [
  "Manual revenue workday summary",
  "Read-only revenue priorities",
  "Manual follow-up needed",
  "Human review required",
  "Do-not-proceed blocker",
  "Near-close review needed",
  "Stuck deal review",
  "Missing data blocks next manual step",
  "Buyer package needs manual review",
  "No provider called, no message sent, no runtime execution.",
];

const accessibilityExpectations = [
  "Use one semantic heading for the summary region and clear subheadings for each section.",
  "Use text labels and helper copy so status meaning never depends on color alone.",
  "Preserve keyboard order and do not move focus when the section renders.",
  "Do not use animation, motion, auto-refresh, or live polling behavior.",
  "Keep content concise, scannable, and screen-reader friendly.",
  "Use counts and labels together, not unlabeled numeric cards.",
];

const noActionBoundaries = [
  "No buttons, links, toggles, menus, forms, or controls may trigger contact, provider, send, approval, execution, polling, persistence, or workflow mutation.",
  "Future UI may display only already-available read-only data.",
  "Future UI must not create new routes, server actions, database writes, provider imports, or automation-agent imports.",
  "Approval status and human-review-required text must never imply execution permission.",
  "Manual next actions must remain wording only.",
];

const dangerousPatternChecks = [
  "Reject send, provider, automation, campaign, bulk, override, persistence, polling, and runtime activation wording.",
  "Reject any enabled flag that sets providerCalled, sent, runtimeActivationAllowed, providerActivationAllowed, persistenceAllowedNow, pollingAllowed, approvalGrantsExecution, or uiImplementationAllowedNow to true.",
  "Reject action-looking controls near revenue-priority summaries.",
  "Reject auto-refresh, background refresh, setInterval, or polling semantics.",
  "Reject copy that frames revenue priorities as permission to act without human review.",
];

const implementationBoundaries: R56ManualRevenueWorkdayUiImplementationBoundary = {
  candidateSurface: "dashboard_manual_revenue_workday_summary",
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx",
  noUiImplementationNow: true,
  noNewRoutes: true,
  noPolling: true,
  noPersistence: true,
  noProviderControls: true,
  noExecutionControls: true,
  noAutomationAgent: true,
  noApprovalBehaviorChanges: true,
  useExistingReadOnlyLeadDataOnlyLater: true,
  futureImplementationRequiresExplicitAuthorization: true,
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

function addWarning(warningCodes: string[], warningCode: R56ManualRevenueWorkdayUiWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function hasForbiddenRequest(input: R56ManualRevenueWorkdayUiScopeAuditInput) {
  return (
    input.uiImplementationRequested === true ||
    input.routeChangeRequested === true ||
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.executionControlRequested === true ||
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

export function assertR56ManualRevenueWorkdaySummaryUiScopeInvariants(
  result: Pick<
    R56ManualRevenueWorkdayUiScopeAuditResult,
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
): R56ManualRevenueWorkdayUiInvariantCheck {
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

export function summarizeR56ManualRevenueWorkdaySummaryUiScope(
  result: R56ManualRevenueWorkdayUiScopeAuditResult,
) {
  const invariantCheck = assertR56ManualRevenueWorkdaySummaryUiScopeInvariants(result);

  return boundSummary(
    `R56C ${result.surface} status is ${result.scopeStatus}. ` +
      `${result.allowedUiSections.length} UI sections are allowed for later implementation and ${result.forbiddenUiControls.length} unsafe controls are blocked. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This audit is planning-only and cannot authorize UI implementation, routes, polling, persistence, providers, sending, automation, approval execution, or runtime activation.",
  );
}

export function createR56ManualRevenueWorkdaySummaryUiScopeAudit(
  input: R56ManualRevenueWorkdayUiScopeAuditInput = {},
): R56ManualRevenueWorkdayUiScopeAuditResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const auditNotes = collectNotes(input.extraAuditNotes);

  addWarning(warningCodes, "r56c_manual_revenue_workday_ui_scope_audit_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r56bScopeReviewed !== true) addWarning(warningCodes, "r56b_scope_review_required");
  if (input.uiSurfaceReviewed !== true) addWarning(warningCodes, "ui_surface_review_required");
  if (input.wordingReviewed !== true) addWarning(warningCodes, "wording_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.dangerousPatternsReviewed !== true) addWarning(warningCodes, "dangerous_pattern_review_required");
  if (input.uiImplementationRequested === true) addWarning(warningCodes, "ui_implementation_rejected");
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.executionControlRequested === true) addWarning(warningCodes, "execution_control_rejected");
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
    input.r56bScopeReviewed !== true ||
    input.uiSurfaceReviewed !== true ||
    input.wordingReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R56ManualRevenueWorkdayUiScopeStatus = hasForbiddenRequest(input)
    ? "ui_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "ui_scope_ready_for_later_implementation";
  const result: R56ManualRevenueWorkdayUiScopeAuditResult = {
    surface: "manual_revenue_workday_summary_ui",
    scopeStatus,
    allowedUiSections,
    forbiddenUiControls,
    revenuePriorityDisplayOrder,
    safeWording,
    accessibilityExpectations,
    noActionBoundaries,
    dangerousPatternChecks,
    implementationBoundaries,
    rejectionReasons,
    safetyFlags,
    warningCodes,
    operatorReviewRequired,
    auditNotes,
    nextSuggestedPhase:
      "R56D - Manual Revenue Workday Summary Read-Only UI Implementation, only after explicit authorization.",
    summary: "R56C manual revenue workday summary UI scope audit only.",
    ...safetyFlags,
  };

  return {
    ...result,
    summary: summarizeR56ManualRevenueWorkdaySummaryUiScope(result),
  };
}
