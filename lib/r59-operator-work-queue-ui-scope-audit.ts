export type R59OperatorWorkQueueUiScopeStatus =
  | "ui_scope_blocked"
  | "operator_review_required"
  | "ui_scope_ready_for_later_implementation";

export type R59OperatorWorkQueueAllowedUiSection =
  | "daily_revenue_priorities"
  | "highest_value_next_actions"
  | "governance_stop_signals"
  | "near_close_recovery_items"
  | "stuck_deal_recovery_items"
  | "seller_follow_up_priorities"
  | "buyer_disposition_priorities"
  | "missing_revenue_data_items"
  | "workflow_bottlenecks"
  | "manual_review_queue"
  | "safe_operator_guidance";

export type R59OperatorWorkQueueVisibilityConcept = {
  order: number;
  section: R59OperatorWorkQueueAllowedUiSection;
  intent: string;
  dailyPriorityReason: string;
  safeCopyRequired: string;
};

export type R59OperatorWorkQueueForbiddenUiControl =
  | "send now"
  | "auto assign"
  | "auto follow-up"
  | "auto recover"
  | "activate workflow"
  | "execute recovery"
  | "approve and send"
  | "provider activation"
  | "queue execution"
  | "autonomous outreach"
  | "autonomous negotiation"
  | "auto disposition"
  | "auto close"
  | "release automation"
  | "hidden execution affordances";

export type R59OperatorWorkQueueUiWarningCode =
  | "r59b_operator_work_queue_ui_scope_audit_only"
  | "input_missing"
  | "r59a_scope_review_required"
  | "ui_surface_review_required"
  | "visibility_concept_review_required"
  | "wording_review_required"
  | "governance_boundary_review_required"
  | "accessibility_review_required"
  | "dangerous_pattern_review_required"
  | "operator_review_required"
  | "ui_implementation_rejected"
  | "route_change_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "execution_control_rejected"
  | "redesign_rejected"
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
  | "approval_grants_execution_must_be_false"
  | "ui_implementation_not_allowed_now";

export type R59OperatorWorkQueueUiScopeAuditInput = {
  r59aScopeReviewed?: boolean;
  uiSurfaceReviewed?: boolean;
  visibilityConceptsReviewed?: boolean;
  wordingReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  dangerousPatternsReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiImplementationRequested?: boolean;
  routeChangeRequested?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  executionControlRequested?: boolean;
  redesignRequested?: boolean;
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

export type R59OperatorWorkQueueUiSafetyFlags = {
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

export type R59OperatorWorkQueueUiImplementationBoundary = {
  candidateSurface: "dashboard_operator_work_queue_intelligence";
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx";
  noUiImplementationNow: true;
  noNewRoutes: true;
  noPolling: true;
  noPersistence: true;
  noProviderControls: true;
  noExecutionControls: true;
  noAutomationAgent: true;
  noApprovalBehaviorChanges: true;
  noRedesign: true;
  noAutonomousNegotiationOrOutreach: true;
  noHiddenExecutionAffordances: true;
  useExistingReadOnlyDashboardSignalsOnlyLater: true;
  futureImplementationRequiresExplicitAuthorization: true;
};

export type R59OperatorWorkQueueUiScopeAuditResult = R59OperatorWorkQueueUiSafetyFlags & {
  phase: "R59B";
  surface: "operator_work_queue_intelligence_ui";
  scopeStatus: R59OperatorWorkQueueUiScopeStatus;
  allowedFutureUiSections: R59OperatorWorkQueueAllowedUiSection[];
  operatorQueueVisibilityConcepts: R59OperatorWorkQueueVisibilityConcept[];
  safeManualGuidanceWording: string[];
  dailyPriorityWording: string[];
  recoveryOpportunityWording: string[];
  frictionEscalationWording: string[];
  humanReviewRequiredWording: string[];
  forbiddenControlsButtonsActions: R59OperatorWorkQueueForbiddenUiControl[];
  dangerousLanguagePatterns: string[];
  accessibilityExpectations: string[];
  noActionExecutionBoundaries: string[];
  invariantAssertions: string[];
  implementationBoundaries: R59OperatorWorkQueueUiImplementationBoundary;
  rejectionReasons: string[];
  safetyFlags: R59OperatorWorkQueueUiSafetyFlags;
  warningCodes: string[];
  operatorReviewRequired: boolean;
  auditNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R59OperatorWorkQueueUiInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R59OperatorWorkQueueUiSafetyFlags = {
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

const allowedFutureUiSections: R59OperatorWorkQueueAllowedUiSection[] = [
  "daily_revenue_priorities",
  "highest_value_next_actions",
  "governance_stop_signals",
  "near_close_recovery_items",
  "stuck_deal_recovery_items",
  "seller_follow_up_priorities",
  "buyer_disposition_priorities",
  "missing_revenue_data_items",
  "workflow_bottlenecks",
  "manual_review_queue",
  "safe_operator_guidance",
];

const operatorQueueVisibilityConcepts: R59OperatorWorkQueueVisibilityConcept[] = [
  {
    order: 1,
    section: "governance_stop_signals",
    intent: "Show stop-and-review items before any revenue priority guidance.",
    dailyPriorityReason: "Governance stops can block every manual revenue workflow.",
    safeCopyRequired: "Manual review required. This does not grant contact, assignment, recovery, or execution permission.",
  },
  {
    order: 2,
    section: "highest_value_next_actions",
    intent: "Show the top manual attention areas after governance review.",
    dailyPriorityReason: "Operators need a concise starting point for the most valuable manual work.",
    safeCopyRequired: "Highest-value means advisory priority only, not an action trigger.",
  },
  {
    order: 3,
    section: "daily_revenue_priorities",
    intent: "Group the daily revenue priorities into scannable manual review categories.",
    dailyPriorityReason: "Daily focus reduces drift across acquisition, recovery, disposition, and near-close work.",
    safeCopyRequired: "Daily priority labels are informational and cannot send, assign, queue, or activate workflows.",
  },
  {
    order: 4,
    section: "near_close_recovery_items",
    intent: "Surface near-close recovery items closest to cash.",
    dailyPriorityReason: "Near-close blockers can cause immediate revenue leakage.",
    safeCopyRequired: "Near-close guidance remains manual and does not imply closing, assignment, or buyer-contact readiness.",
  },
  {
    order: 5,
    section: "stuck_deal_recovery_items",
    intent: "Surface stuck-deal recovery items needing human next-step review.",
    dailyPriorityReason: "Stuck-deal review can recover revenue from stalled opportunities.",
    safeCopyRequired: "Recovery visibility cannot trigger auto recovery, follow-up, provider activation, or execution.",
  },
  {
    order: 6,
    section: "seller_follow_up_priorities",
    intent: "Show seller-side records needing manual follow-up review.",
    dailyPriorityReason: "Seller follow-up can unblock acquisition and conversion work.",
    safeCopyRequired: "Seller follow-up recommended is a review label only and does not send or dial.",
  },
  {
    order: 7,
    section: "buyer_disposition_priorities",
    intent: "Show buyer package or disposition review items.",
    dailyPriorityReason: "Buyer disposition friction can delay revenue movement.",
    safeCopyRequired: "Buyer review recommended is manual only and does not contact buyers or release packages.",
  },
  {
    order: 8,
    section: "missing_revenue_data_items",
    intent: "Show missing revenue-critical data and assumptions.",
    dailyPriorityReason: "Missing source, contact, timeline, outcome, package, or property context hides leakage.",
    safeCopyRequired: "Missing data labels require human verification and cannot invent facts.",
  },
  {
    order: 9,
    section: "workflow_bottlenecks",
    intent: "Show cross-workflow bottlenecks that slow operator throughput.",
    dailyPriorityReason: "Bottlenecks can compound across acquisition, recovery, disposition, and near-close work.",
    safeCopyRequired: "Friction escalation is a manual label, not a task assignment or workflow action.",
  },
  {
    order: 10,
    section: "manual_review_queue",
    intent: "Show a bounded manual review queue summary.",
    dailyPriorityReason: "A queue summary helps operators scan without creating execution affordances.",
    safeCopyRequired: "Manual review queue is read-only and cannot mutate tasks, persist state, poll, or execute.",
  },
  {
    order: 11,
    section: "safe_operator_guidance",
    intent: "Show concise guidance that preserves operator ownership.",
    dailyPriorityReason: "Safe wording helps keep the dashboard useful without changing system behavior.",
    safeCopyRequired: "Guidance is advisory only and does not authorize sending, assigning, recovering, or automation.",
  },
];

const safeManualGuidanceWording = [
  "Manual review recommended.",
  "Operator attention recommended.",
  "Manual next step guidance.",
  "Review assumptions before acting outside the app.",
  "This future surface may guide human work only; it must not send, assign, recover, persist, poll, activate providers, negotiate, or execute.",
];

const dailyPriorityWording = [
  "Daily revenue priorities.",
  "Highest-value next actions.",
  "Priority recovery focus.",
  "Revenue leakage attention.",
  "Follow-up priority.",
  "Daily priority labels are advisory only.",
];

const recoveryOpportunityWording = [
  "Priority recovery focus.",
  "Deal review recommended.",
  "Near-close recovery item.",
  "Stuck-deal recovery item.",
  "Recovery opportunity means manual review only and cannot trigger execution.",
];

const frictionEscalationWording = [
  "Friction escalation.",
  "Workflow bottleneck.",
  "Operator attention recommended.",
  "Escalation is a review label only and does not assign work or activate workflow state.",
];

const humanReviewRequiredWording = [
  "Human review required.",
  "Manual review recommended.",
  "Do-not-proceed until reviewed.",
  "Review status does not grant contact, assignment, recovery, negotiation, provider, or execution permission.",
];

const forbiddenControlsButtonsActions: R59OperatorWorkQueueForbiddenUiControl[] = [
  "send now",
  "auto assign",
  "auto follow-up",
  "auto recover",
  "activate workflow",
  "execute recovery",
  "approve and send",
  "provider activation",
  "queue execution",
  "autonomous outreach",
  "autonomous negotiation",
  "auto disposition",
  "auto close",
  "release automation",
  "hidden execution affordances",
];

const dangerousLanguagePatterns = [
  "send now",
  "auto assign",
  "auto follow-up",
  "auto recover",
  "activate workflow",
  "execute recovery",
  "approve and send",
  "provider activation",
  "queue execution",
  "autonomous outreach",
  "autonomous negotiation",
  "auto disposition",
  "auto close",
  "release automation",
  "start queue",
  "run queue",
  "dispatch work",
  "assign automatically",
];

const accessibilityExpectations = [
  "Use semantic headings for the future operator work queue region and each section.",
  "Use readable labels for priorities, counts, queue groups, statuses, and guidance.",
  "Status meaning must be text-based and never depend on color alone.",
  "Do not rely on motion, focus movement, auto-refresh, polling, or live-update noise.",
  "Use concise wording and screen-reader-friendly summaries for queue groups.",
  "Keep human-review-required states distinct from advisory priority guidance.",
];

const noActionExecutionBoundaries = [
  "No buttons, links, toggles, menus, forms, or controls may trigger send, assign, recovery, provider activation, approval execution, persistence, polling, route changes, or workflow mutation.",
  "Future UI may display only already-available read-only dashboard signals and already-scoped derived labels.",
  "Daily priority, recovery, escalation, and human-review wording must remain labels or guidance only.",
  "Approval language must never imply permission to execute, contact, negotiate, send, assign, queue, recover, retry, or activate providers.",
  "No hidden execution affordances, background work, setInterval polling, provider imports, server actions, autonomous outreach, or automation-agent imports are allowed.",
];

const invariantAssertions = [
  "readOnly must remain true.",
  "advisoryOnly must remain true.",
  "simulationOnly must remain true.",
  "providerCalled must remain false.",
  "sent must remain false.",
  "persistenceAllowedNow must remain false.",
  "pollingAllowed must remain false.",
  "runtimeActivationAllowed must remain false.",
  "providerActivationAllowed must remain false.",
  "approvalGrantsExecution must remain false.",
  "uiImplementationAllowedNow must remain false.",
  "No hidden execution affordances are allowed.",
];

const implementationBoundaries: R59OperatorWorkQueueUiImplementationBoundary = {
  candidateSurface: "dashboard_operator_work_queue_intelligence",
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx",
  noUiImplementationNow: true,
  noNewRoutes: true,
  noPolling: true,
  noPersistence: true,
  noProviderControls: true,
  noExecutionControls: true,
  noAutomationAgent: true,
  noApprovalBehaviorChanges: true,
  noRedesign: true,
  noAutonomousNegotiationOrOutreach: true,
  noHiddenExecutionAffordances: true,
  useExistingReadOnlyDashboardSignalsOnlyLater: true,
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
  if (bounded && !list.includes(bounded) && list.length < maxListItems) list.push(bounded);
}

function addWarning(warningCodes: string[], warningCode: R59OperatorWorkQueueUiWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R59OperatorWorkQueueUiScopeAuditInput) {
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
    input.redesignRequested === true ||
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

export function assertR59OperatorWorkQueueUiScopeInvariants(
  result: Pick<
    R59OperatorWorkQueueUiScopeAuditResult,
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
): R59OperatorWorkQueueUiInvariantCheck {
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

  return { passed: warningCodes.length === 0, warningCodes };
}

export function summarizeR59OperatorWorkQueueUiScopeAudit(result: R59OperatorWorkQueueUiScopeAuditResult) {
  const invariantCheck = assertR59OperatorWorkQueueUiScopeInvariants(result);

  return boundSummary(
    `R59B ${result.surface} status is ${result.scopeStatus}. ` +
      `${result.allowedFutureUiSections.length} future UI sections and ${result.operatorQueueVisibilityConcepts.length} visibility concepts are scoped. ` +
      `${result.forbiddenControlsButtonsActions.length} controls, buttons, or action semantics are forbidden. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This audit cannot authorize UI implementation, redesign, routes, providers, Twilio, automation-agent usage, Prisma changes, persistence, polling, execution controls, approval execution, autonomous negotiation, outreach, hidden execution affordances, or runtime activation.",
  );
}

export function createR59OperatorWorkQueueUiScopeAudit(
  input: R59OperatorWorkQueueUiScopeAuditInput = {},
): R59OperatorWorkQueueUiScopeAuditResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const auditNotes = collectNotes(input.extraAuditNotes);

  addWarning(warningCodes, "r59b_operator_work_queue_ui_scope_audit_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r59aScopeReviewed !== true) addWarning(warningCodes, "r59a_scope_review_required");
  if (input.uiSurfaceReviewed !== true) addWarning(warningCodes, "ui_surface_review_required");
  if (input.visibilityConceptsReviewed !== true) addWarning(warningCodes, "visibility_concept_review_required");
  if (input.wordingReviewed !== true) addWarning(warningCodes, "wording_review_required");
  if (input.governanceBoundaryReviewed !== true) addWarning(warningCodes, "governance_boundary_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.dangerousPatternsReviewed !== true) addWarning(warningCodes, "dangerous_pattern_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.uiImplementationRequested === true) addWarning(warningCodes, "ui_implementation_rejected");
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.executionControlRequested === true) addWarning(warningCodes, "execution_control_rejected");
  if (input.redesignRequested === true) addWarning(warningCodes, "redesign_rejected");
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
    input.r59aScopeReviewed !== true ||
    input.uiSurfaceReviewed !== true ||
    input.visibilityConceptsReviewed !== true ||
    input.wordingReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R59OperatorWorkQueueUiScopeStatus = hasForbiddenRequest(input)
    ? "ui_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "ui_scope_ready_for_later_implementation";
  const result: R59OperatorWorkQueueUiScopeAuditResult = {
    phase: "R59B",
    surface: "operator_work_queue_intelligence_ui",
    scopeStatus,
    allowedFutureUiSections,
    operatorQueueVisibilityConcepts,
    safeManualGuidanceWording,
    dailyPriorityWording,
    recoveryOpportunityWording,
    frictionEscalationWording,
    humanReviewRequiredWording,
    forbiddenControlsButtonsActions,
    dangerousLanguagePatterns,
    accessibilityExpectations,
    noActionExecutionBoundaries,
    invariantAssertions,
    implementationBoundaries,
    rejectionReasons,
    safetyFlags,
    warningCodes,
    operatorReviewRequired,
    auditNotes,
    nextSuggestedPhase: "R59C - Operator Work Queue Intelligence Read-Only UI Implementation Scope Contract",
    summary: "R59B operator work queue UI scope audit only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR59OperatorWorkQueueUiScopeAudit(result) };
}
