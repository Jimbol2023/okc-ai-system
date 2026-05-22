export type R59OperatorWorkQueueScopeStatus =
  | "operator_work_queue_scope_blocked"
  | "operator_review_required"
  | "operator_work_queue_scope_ready";

export type R59OperatorWorkQueueCategory =
  | "highest_value_next_actions"
  | "daily_revenue_priorities"
  | "recovery_opportunities"
  | "acquisition_focus"
  | "buyer_disposition_focus"
  | "friction_escalation_priorities"
  | "workflow_bottlenecks"
  | "manual_review_priorities"
  | "revenue_leakage_attention"
  | "governance_stop_review";

export type R59DailyRevenuePriorityConcept =
  | "manual_review_recommended"
  | "operator_attention_recommended"
  | "priority_recovery_focus"
  | "revenue_leakage_attention"
  | "follow_up_priority"
  | "friction_escalation"
  | "manual_next_step_guidance"
  | "buyer_review_recommended"
  | "seller_follow_up_recommended"
  | "deal_review_recommended";

export type R59HighestValueNextActionConcept = {
  concept:
    | "resolve_governance_stops"
    | "review_near_close_recovery"
    | "review_stuck_deal_recovery"
    | "prioritize_seller_follow_up"
    | "prioritize_buyer_disposition_review"
    | "resolve_missing_revenue_data"
    | "escalate_workflow_bottleneck";
  rank: number;
  revenueReason: string;
  safeManualGuidance: string;
  boundary: string;
};

export type R59WorkflowBottleneckConcept =
  | "governance_stop_unresolved"
  | "human_review_backlog"
  | "near_close_friction_unreviewed"
  | "stuck_deal_recovery_unreviewed"
  | "seller_follow_up_overdue"
  | "buyer_package_review_pending"
  | "missing_critical_data"
  | "stale_manual_timeline";

export type R59ForbiddenExecutionSemantic =
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
  | "hidden execution semantics";

export type R59OperatorWorkQueueWarningCode =
  | "r59a_scope_contract_only"
  | "input_missing"
  | "r58f_lockdown_review_required"
  | "queue_category_review_required"
  | "daily_revenue_priority_review_required"
  | "highest_value_next_action_review_required"
  | "workflow_bottleneck_review_required"
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

export type R59OperatorWorkQueueInput = {
  r58fLockdownReviewed?: boolean;
  queueCategoriesReviewed?: boolean;
  dailyRevenuePrioritiesReviewed?: boolean;
  highestValueNextActionsReviewed?: boolean;
  workflowBottlenecksReviewed?: boolean;
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
  extraScopeNotes?: string[];
};

export type R59OperatorWorkQueueSafetyFlags = {
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

export type R59OperatorWorkQueueScopeResult = R59OperatorWorkQueueSafetyFlags & {
  phase: "R59A";
  surface: "operator_work_queue_intelligence";
  scopeStatus: R59OperatorWorkQueueScopeStatus;
  operatorWorkQueueCategories: R59OperatorWorkQueueCategory[];
  dailyRevenuePriorityConcepts: R59DailyRevenuePriorityConcept[];
  highestValueNextActionConcepts: R59HighestValueNextActionConcept[];
  stuckDealEscalationConcepts: string[];
  nearCloseEscalationConcepts: string[];
  acquisitionFollowUpPriorities: string[];
  buyerDispositionPriorities: string[];
  revenueLeakageEscalationPriorities: string[];
  workflowBottleneckConcepts: R59WorkflowBottleneckConcept[];
  manualReviewPriorities: string[];
  safeManualGuidanceWording: string[];
  forbiddenExecutionSemantics: R59ForbiddenExecutionSemantic[];
  governanceBoundaries: string[];
  accessibilityRequirements: string[];
  invariantAssertions: string[];
  safetyFlags: R59OperatorWorkQueueSafetyFlags;
  warningCodes: string[];
  rejectionReasons: string[];
  operatorReviewRequired: boolean;
  scopeNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R59OperatorWorkQueueInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R59OperatorWorkQueueSafetyFlags = {
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

const operatorWorkQueueCategories: R59OperatorWorkQueueCategory[] = [
  "governance_stop_review",
  "highest_value_next_actions",
  "daily_revenue_priorities",
  "recovery_opportunities",
  "friction_escalation_priorities",
  "workflow_bottlenecks",
  "acquisition_focus",
  "buyer_disposition_focus",
  "revenue_leakage_attention",
  "manual_review_priorities",
];

const dailyRevenuePriorityConcepts: R59DailyRevenuePriorityConcept[] = [
  "manual_review_recommended",
  "operator_attention_recommended",
  "priority_recovery_focus",
  "revenue_leakage_attention",
  "follow_up_priority",
  "friction_escalation",
  "manual_next_step_guidance",
  "buyer_review_recommended",
  "seller_follow_up_recommended",
  "deal_review_recommended",
];

const highestValueNextActionConcepts: R59HighestValueNextActionConcept[] = [
  {
    concept: "resolve_governance_stops",
    rank: 1,
    revenueReason: "Governance stops can block every revenue workflow and must be reviewed before lower-priority work.",
    safeManualGuidance: "Manual review recommended before any seller, buyer, recovery, or disposition planning.",
    boundary: "No override, provider call, sending, queue mutation, or approval-as-permission is allowed.",
  },
  {
    concept: "review_near_close_recovery",
    rank: 2,
    revenueReason: "Near-close blockers are closest to cash and can create immediate revenue leakage.",
    safeManualGuidance: "Operator attention recommended for near-close blockers after governance review.",
    boundary: "No closing, assignment, buyer contact, title, escrow, provider, or runtime action is allowed.",
  },
  {
    concept: "review_stuck_deal_recovery",
    rank: 3,
    revenueReason: "Stuck deals can recover revenue when manual follow-up, next step, or data gaps are clarified.",
    safeManualGuidance: "Priority recovery focus should remain a human-owned review label only.",
    boundary: "No automatic recovery, follow-up, provider activation, persistence, or execution controls.",
  },
  {
    concept: "prioritize_seller_follow_up",
    rank: 4,
    revenueReason: "Seller-side follow-up can unblock acquisition and conversion work.",
    safeManualGuidance: "Seller follow-up recommended means review the record and decide manually outside this scope.",
    boundary: "No dialing, SMS, email, outreach, provider call, or autonomous workflow is allowed.",
  },
  {
    concept: "prioritize_buyer_disposition_review",
    rank: 5,
    revenueReason: "Buyer package or disposition review can prevent late-stage revenue drag.",
    safeManualGuidance: "Buyer review recommended means inspect package context manually.",
    boundary: "No buyer contact, auto disposition, package release, sharing, sending, or provider activation.",
  },
  {
    concept: "resolve_missing_revenue_data",
    rank: 6,
    revenueReason: "Missing source, contact, timeline, outcome, package, or property context hides revenue leakage.",
    safeManualGuidance: "Revenue leakage attention should label missing facts and assumptions for human review.",
    boundary: "No property fact invention, enrichment activation, persistence, scraping, or workflow mutation.",
  },
  {
    concept: "escalate_workflow_bottleneck",
    rank: 7,
    revenueReason: "Workflow bottlenecks can spread across acquisition, recovery, disposition, and near-close work.",
    safeManualGuidance: "Friction escalation is a manual prioritization label, not a workflow action.",
    boundary: "No task assignment, route change, polling, queue execution, or runtime activation.",
  },
];

const stuckDealEscalationConcepts = [
  "Manual review recommended for unresolved human-review-required stuck-deal records.",
  "Operator attention recommended for overdue manual follow-up or missing next-step context.",
  "Priority recovery focus may surface stuck-deal records with missing data, buyer blockers, or near-close friction.",
  "Deal review recommended remains advisory and cannot trigger recovery execution.",
];

const nearCloseEscalationConcepts = [
  "Manual review recommended for governance stops before near-close recovery guidance.",
  "Friction escalation may surface title, escrow, checklist, assignment, seller, buyer, document, and timeline blockers.",
  "Revenue leakage attention may prioritize near-close blockers closest to cash.",
  "Manual next step guidance must not imply closing readiness, assignment readiness, provider activation, or buyer contactability.",
];

const acquisitionFollowUpPriorities = [
  "Seller follow-up recommended for stale seller outcome or overdue manual follow-up.",
  "Follow-up priority may consider source, seller context, urgency, and missing next-step data.",
  "Acquisition focus remains manual and cannot dial, message, send, assign, or activate providers.",
];

const buyerDispositionPriorities = [
  "Buyer review recommended for incomplete package or disposition context.",
  "Operator attention recommended where buyer package gaps block late-stage revenue review.",
  "Disposition focus remains manual and cannot share, release, contact buyers, send packages, or execute workflows.",
];

const revenueLeakageEscalationPriorities = [
  "Revenue leakage attention may surface missing critical data, stale timelines, unresolved review, or near-close friction.",
  "Priority recovery focus should rank closest-to-cash records before lower-value backlog when governance allows review.",
  "Manual next step guidance must label assumptions clearly and must not invent property facts.",
];

const workflowBottleneckConcepts: R59WorkflowBottleneckConcept[] = [
  "governance_stop_unresolved",
  "human_review_backlog",
  "near_close_friction_unreviewed",
  "stuck_deal_recovery_unreviewed",
  "seller_follow_up_overdue",
  "buyer_package_review_pending",
  "missing_critical_data",
  "stale_manual_timeline",
];

const manualReviewPriorities = [
  "Review governance stop signals before revenue guidance.",
  "Review near-close recovery signals before lower-value backlog.",
  "Review stuck-deal recovery signals when manual next steps are missing or stale.",
  "Review seller follow-up priorities for acquisition focus.",
  "Review buyer disposition priorities when package or review context is incomplete.",
  "Review missing data and workflow bottlenecks as revenue leakage signals.",
];

const safeManualGuidanceWording = [
  "manual review recommended",
  "operator attention recommended",
  "priority recovery focus",
  "revenue leakage attention",
  "follow-up priority",
  "friction escalation",
  "manual next step guidance",
  "buyer review recommended",
  "seller follow-up recommended",
  "deal review recommended",
  "Use this queue scope for advisory prioritization only; it does not send, assign, recover, persist, poll, activate providers, negotiate, or execute.",
];

const forbiddenExecutionSemantics: R59ForbiddenExecutionSemantic[] = [
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
  "hidden execution semantics",
];

const governanceBoundaries = [
  "Operator work queue intelligence is planning-only and cannot implement UI, routes, providers, persistence, polling, automation, or runtime activation.",
  "Work queue priorities are advisory labels and cannot grant permission to send, assign, recover, contact, negotiate, close, or activate providers.",
  "Approval and human review states cannot become permission to execute or mutate workflow state.",
  "All property, seller, buyer, title, escrow, assignment, and timeline facts must be manually verified.",
  "Assumptions must be labeled clearly and no property facts may be invented.",
];

const accessibilityRequirements = [
  "Future presentation must use semantic headings.",
  "Queue items, counts, statuses, and priorities must use readable labels.",
  "Status meaning must be text-based and never depend on color alone.",
  "No motion dependency, focus movement, polling, auto-refresh, or live-update noise is allowed.",
  "Use concise wording and screen-reader-friendly summaries for priority categories and guidance.",
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
  if (bounded && !list.includes(bounded) && list.length < maxListItems) list.push(bounded);
}

function addWarning(warningCodes: string[], warningCode: R59OperatorWorkQueueWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R59OperatorWorkQueueInput) {
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

export function assertR59OperatorWorkQueueScopeInvariants(
  result: Pick<
    R59OperatorWorkQueueScopeResult,
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
): R59OperatorWorkQueueInvariantCheck {
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

export function summarizeR59OperatorWorkQueueScope(result: R59OperatorWorkQueueScopeResult) {
  const invariantCheck = assertR59OperatorWorkQueueScopeInvariants(result);

  return boundSummary(
    `R59A ${result.surface} status is ${result.scopeStatus}. ` +
      `${result.operatorWorkQueueCategories.length} queue categories and ${result.highestValueNextActionConcepts.length} highest-value next-action concepts are scoped. ` +
      `${result.workflowBottleneckConcepts.length} workflow bottleneck concepts are defined. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This scope is planning-only and cannot authorize UI, routes, providers, sending, persistence, polling, automation, approval execution, autonomous outreach, negotiation, queue execution, or runtime activation.",
  );
}

export function createR59OperatorWorkQueueIntelligenceScopeContract(
  input: R59OperatorWorkQueueInput = {},
): R59OperatorWorkQueueScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r59a_scope_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r58fLockdownReviewed !== true) addWarning(warningCodes, "r58f_lockdown_review_required");
  if (input.queueCategoriesReviewed !== true) addWarning(warningCodes, "queue_category_review_required");
  if (input.dailyRevenuePrioritiesReviewed !== true) {
    addWarning(warningCodes, "daily_revenue_priority_review_required");
  }
  if (input.highestValueNextActionsReviewed !== true) {
    addWarning(warningCodes, "highest_value_next_action_review_required");
  }
  if (input.workflowBottlenecksReviewed !== true) addWarning(warningCodes, "workflow_bottleneck_review_required");
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
    input.r58fLockdownReviewed !== true ||
    input.queueCategoriesReviewed !== true ||
    input.dailyRevenuePrioritiesReviewed !== true ||
    input.highestValueNextActionsReviewed !== true ||
    input.workflowBottlenecksReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R59OperatorWorkQueueScopeStatus = hasForbiddenRequest(input)
    ? "operator_work_queue_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "operator_work_queue_scope_ready";
  const result: R59OperatorWorkQueueScopeResult = {
    phase: "R59A",
    surface: "operator_work_queue_intelligence",
    scopeStatus,
    operatorWorkQueueCategories,
    dailyRevenuePriorityConcepts,
    highestValueNextActionConcepts,
    stuckDealEscalationConcepts,
    nearCloseEscalationConcepts,
    acquisitionFollowUpPriorities,
    buyerDispositionPriorities,
    revenueLeakageEscalationPriorities,
    workflowBottleneckConcepts,
    manualReviewPriorities,
    safeManualGuidanceWording,
    forbiddenExecutionSemantics,
    governanceBoundaries,
    accessibilityRequirements,
    invariantAssertions,
    safetyFlags,
    warningCodes,
    rejectionReasons,
    operatorReviewRequired,
    scopeNotes,
    nextSuggestedPhase: "R59B - Operator Work Queue Intelligence UI Scope Audit",
    summary: "R59A operator work queue intelligence scope contract only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR59OperatorWorkQueueScope(result) };
}
