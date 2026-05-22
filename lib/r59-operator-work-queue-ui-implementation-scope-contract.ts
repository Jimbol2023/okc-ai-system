export type R59OperatorWorkQueueUiImplementationScopeStatus =
  | "implementation_scope_blocked"
  | "operator_review_required"
  | "read_only_ui_implementation_scope_ready";

export type R59OperatorWorkQueueAllowedUiPlacement = {
  surface: "existing_dashboard";
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx";
  futureComponentAllowed: "components/dashboard/operator-work-queue-summary.tsx";
  placement: "dashboard_read_only_revenue_operations_section";
  routeChangesAllowed: false;
  redesignAllowed: false;
  implementationAllowedNow: false;
};

export type R59OperatorWorkQueueAllowedReadOnlyDataSource = {
  source: "existing_dashboard_loaded_lead_deal_manual_revenue_and_recovery_signals";
  allowedDataOnly: string[];
  allowedDerivedSignalsOnlyIfAlreadyInDashboardScope: string[];
  forbiddenDataSources: string[];
  newFetchAllowed: false;
  sourceMutationAllowed: false;
  persistenceAllowed: false;
  pollingAllowed: false;
};

export type R59OperatorWorkQueueAllowedDisplaySection =
  | "operator_work_queue_summary"
  | "governance_stop_signals"
  | "highest_value_next_actions"
  | "daily_revenue_priorities"
  | "near_close_recovery_items"
  | "stuck_deal_recovery_items"
  | "seller_follow_up_priorities"
  | "buyer_disposition_priorities"
  | "missing_revenue_data_items"
  | "workflow_bottlenecks"
  | "manual_review_queue"
  | "safe_operator_guidance";

export type R59OperatorWorkQueuePriorityOrderItem = {
  order: number;
  section: R59OperatorWorkQueueAllowedDisplaySection;
  renderIntent: string;
  allowedReadOnlySignals: string[];
  requiredSafetyCopy: string;
};

export type R59OperatorWorkQueueHighestValueOrderItem = {
  rank: number;
  concept:
    | "resolve_governance_stops"
    | "review_near_close_recovery"
    | "review_stuck_deal_recovery"
    | "prioritize_seller_follow_up"
    | "prioritize_buyer_disposition_review"
    | "resolve_missing_revenue_data"
    | "escalate_workflow_bottleneck";
  label: string;
  safeManualGuidance: string;
  blockedExecutionBoundary: string;
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

export type R59OperatorWorkQueueUiImplementationWarningCode =
  | "r59c_operator_work_queue_ui_implementation_scope_contract_only"
  | "input_missing"
  | "r59b_ui_scope_review_required"
  | "placement_review_required"
  | "read_only_data_review_required"
  | "display_section_review_required"
  | "daily_priority_review_required"
  | "highest_value_next_action_review_required"
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

export type R59OperatorWorkQueueUiImplementationScopeInput = {
  r59bUiScopeReviewed?: boolean;
  placementReviewed?: boolean;
  readOnlyDataReviewed?: boolean;
  displaySectionsReviewed?: boolean;
  dailyPriorityReviewed?: boolean;
  highestValueNextActionsReviewed?: boolean;
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
  extraScopeNotes?: string[];
};

export type R59OperatorWorkQueueUiImplementationSafetyFlags = {
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

export type R59OperatorWorkQueueUiImplementationScopeResult =
  R59OperatorWorkQueueUiImplementationSafetyFlags & {
    phase: "R59C";
    surface: "operator_work_queue_read_only_ui_implementation_scope";
    scopeStatus: R59OperatorWorkQueueUiImplementationScopeStatus;
    requiredSafetyCopy: "Read-only operator work queue guidance. No provider called, no message sent, no runtime execution.";
    allowedUiPlacement: R59OperatorWorkQueueAllowedUiPlacement;
    allowedReadOnlyDataSource: R59OperatorWorkQueueAllowedReadOnlyDataSource;
    allowedDisplaySections: R59OperatorWorkQueueAllowedDisplaySection[];
    dailyRevenuePriorityOrdering: R59OperatorWorkQueuePriorityOrderItem[];
    highestValueNextActionOrdering: R59OperatorWorkQueueHighestValueOrderItem[];
    safeManualGuidanceWording: string[];
    blockedForbiddenUiControls: R59OperatorWorkQueueForbiddenUiControl[];
    dangerousLanguagePatterns: string[];
    accessibilityRequirements: string[];
    noActionExecutionBoundaries: string[];
    invariantAssertions: string[];
    rejectionReasons: string[];
    safetyFlags: R59OperatorWorkQueueUiImplementationSafetyFlags;
    warningCodes: string[];
    operatorReviewRequired: boolean;
    scopeNotes: string[];
    nextSuggestedPhase: string;
    summary: string;
  };

export type R59OperatorWorkQueueUiImplementationInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;
const requiredSafetyCopy =
  "Read-only operator work queue guidance. No provider called, no message sent, no runtime execution." as const;

const safetyFlags: R59OperatorWorkQueueUiImplementationSafetyFlags = {
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

const allowedUiPlacement: R59OperatorWorkQueueAllowedUiPlacement = {
  surface: "existing_dashboard",
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx",
  futureComponentAllowed: "components/dashboard/operator-work-queue-summary.tsx",
  placement: "dashboard_read_only_revenue_operations_section",
  routeChangesAllowed: false,
  redesignAllowed: false,
  implementationAllowedNow: false,
};

const allowedReadOnlyDataSource: R59OperatorWorkQueueAllowedReadOnlyDataSource = {
  source: "existing_dashboard_loaded_lead_deal_manual_revenue_and_recovery_signals",
  allowedDataOnly: [
    "lead id",
    "lead source",
    "lead status or deal stage",
    "approval status",
    "human-review-required state",
    "do-not-contact or opt-out state",
    "seller response or seller outcome",
    "manual follow-up due state",
    "buyer package completeness signal",
    "near-close or under-contract status signal",
    "missing critical data signal",
  ],
  allowedDerivedSignalsOnlyIfAlreadyInDashboardScope: [
    "existing manual revenue metric values",
    "existing stuck-deal read-only derived labels",
    "existing near-close read-only derived labels",
    "existing in-memory dashboard priority labels",
  ],
  forbiddenDataSources: [
    "new fetch requests",
    "new routes",
    "new database tables",
    "Prisma schema changes",
    "migrations",
    "Twilio provider state",
    "provider callbacks",
    "automation-agent output",
    "polling feeds",
    "persisted UI state",
    "runtime execution queues",
  ],
  newFetchAllowed: false,
  sourceMutationAllowed: false,
  persistenceAllowed: false,
  pollingAllowed: false,
};

const allowedDisplaySections: R59OperatorWorkQueueAllowedDisplaySection[] = [
  "operator_work_queue_summary",
  "governance_stop_signals",
  "highest_value_next_actions",
  "daily_revenue_priorities",
  "near_close_recovery_items",
  "stuck_deal_recovery_items",
  "seller_follow_up_priorities",
  "buyer_disposition_priorities",
  "missing_revenue_data_items",
  "workflow_bottlenecks",
  "manual_review_queue",
  "safe_operator_guidance",
];

const dailyRevenuePriorityOrdering: R59OperatorWorkQueuePriorityOrderItem[] = [
  {
    order: 1,
    section: "governance_stop_signals",
    renderIntent: "Show stop-and-review items before revenue priority guidance.",
    allowedReadOnlySignals: ["human-review-required state", "approval status", "do-not-contact or opt-out state"],
    requiredSafetyCopy,
  },
  {
    order: 2,
    section: "highest_value_next_actions",
    renderIntent: "Show the top advisory manual attention areas.",
    allowedReadOnlySignals: ["existing manual revenue metric values", "lead status or deal stage"],
    requiredSafetyCopy,
  },
  {
    order: 3,
    section: "daily_revenue_priorities",
    renderIntent: "Group daily revenue priorities into scan-friendly read-only labels.",
    allowedReadOnlySignals: ["existing manual revenue metric values", "manual follow-up due state"],
    requiredSafetyCopy,
  },
  {
    order: 4,
    section: "near_close_recovery_items",
    renderIntent: "Show near-close advisory review items using already-scoped signals.",
    allowedReadOnlySignals: ["near-close or under-contract status signal", "existing near-close read-only derived labels"],
    requiredSafetyCopy,
  },
  {
    order: 5,
    section: "stuck_deal_recovery_items",
    renderIntent: "Show stuck-deal advisory review items using existing dashboard scope.",
    allowedReadOnlySignals: ["existing stuck-deal read-only derived labels", "manual follow-up due state"],
    requiredSafetyCopy,
  },
  {
    order: 6,
    section: "seller_follow_up_priorities",
    renderIntent: "Show seller-side follow-up priority labels without outreach controls.",
    allowedReadOnlySignals: ["seller response or seller outcome", "manual follow-up due state"],
    requiredSafetyCopy,
  },
  {
    order: 7,
    section: "buyer_disposition_priorities",
    renderIntent: "Show buyer package or disposition review labels without buyer-contact affordances.",
    allowedReadOnlySignals: ["buyer package completeness signal", "lead status or deal stage"],
    requiredSafetyCopy,
  },
  {
    order: 8,
    section: "missing_revenue_data_items",
    renderIntent: "Show missing revenue-critical fields and assumptions.",
    allowedReadOnlySignals: ["missing critical data signal", "lead source"],
    requiredSafetyCopy,
  },
  {
    order: 9,
    section: "workflow_bottlenecks",
    renderIntent: "Show cross-workflow friction labels without queue execution.",
    allowedReadOnlySignals: ["approval status", "manual follow-up due state", "missing critical data signal"],
    requiredSafetyCopy,
  },
  {
    order: 10,
    section: "manual_review_queue",
    renderIntent: "Summarize bounded manual review items without mutation or persistence.",
    allowedReadOnlySignals: ["human-review-required state", "existing in-memory dashboard priority labels"],
    requiredSafetyCopy,
  },
  {
    order: 11,
    section: "operator_work_queue_summary",
    renderIntent: "Summarize read-only queue signals after priority categories are visible.",
    allowedReadOnlySignals: ["lead id", "lead status or deal stage", "existing manual revenue metric values"],
    requiredSafetyCopy,
  },
  {
    order: 12,
    section: "safe_operator_guidance",
    renderIntent: "Render concise human-owned guidance with no controls or mutation.",
    allowedReadOnlySignals: ["human-review-required state", "missing critical data signal", "manual follow-up due state"],
    requiredSafetyCopy,
  },
];

const highestValueNextActionOrdering: R59OperatorWorkQueueHighestValueOrderItem[] = [
  {
    rank: 1,
    concept: "resolve_governance_stops",
    label: "Manual review recommended for governance stop signals.",
    safeManualGuidance: "Review stop signals manually before any other work queue guidance.",
    blockedExecutionBoundary: "No override, provider call, sending, queue mutation, or approval-as-permission is allowed.",
  },
  {
    rank: 2,
    concept: "review_near_close_recovery",
    label: "Operator attention recommended for near-close recovery items.",
    safeManualGuidance: "Review near-close blockers manually after governance review.",
    blockedExecutionBoundary: "No closing, assignment, buyer contact, title, escrow, provider, or runtime action is allowed.",
  },
  {
    rank: 3,
    concept: "review_stuck_deal_recovery",
    label: "Priority recovery focus for stuck-deal items.",
    safeManualGuidance: "Review stalled records manually without triggering recovery execution.",
    blockedExecutionBoundary: "No automatic recovery, follow-up, provider activation, persistence, or execution controls.",
  },
  {
    rank: 4,
    concept: "prioritize_seller_follow_up",
    label: "Seller follow-up recommended.",
    safeManualGuidance: "Review seller-side context and decide manually outside the app.",
    blockedExecutionBoundary: "No dialing, SMS, email, outreach, provider call, or autonomous workflow is allowed.",
  },
  {
    rank: 5,
    concept: "prioritize_buyer_disposition_review",
    label: "Buyer review recommended.",
    safeManualGuidance: "Review buyer package and disposition context manually.",
    blockedExecutionBoundary: "No buyer contact, auto disposition, package release, sharing, sending, or provider activation.",
  },
  {
    rank: 6,
    concept: "resolve_missing_revenue_data",
    label: "Revenue leakage attention for missing data.",
    safeManualGuidance: "Label missing fields and assumptions for human verification.",
    blockedExecutionBoundary: "No property fact invention, enrichment activation, persistence, scraping, or workflow mutation.",
  },
  {
    rank: 7,
    concept: "escalate_workflow_bottleneck",
    label: "Friction escalation for workflow bottlenecks.",
    safeManualGuidance: "Treat bottlenecks as manual prioritization labels only.",
    blockedExecutionBoundary: "No task assignment, route change, polling, queue execution, or runtime activation.",
  },
];

const safeManualGuidanceWording = [
  requiredSafetyCopy,
  "Manual review recommended.",
  "Operator attention recommended.",
  "Manual next step guidance.",
  "Daily priority labels are advisory only.",
  "Review assumptions before acting outside the app.",
  "The future UI may guide human work only; it must not send, assign, recover, persist, poll, activate providers, negotiate, or execute.",
];

const blockedForbiddenUiControls: R59OperatorWorkQueueForbiddenUiControl[] = [
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

const accessibilityRequirements = [
  "Render the future region with a semantic heading and section headings.",
  "Pair every count, priority, queue group, and status with a readable text label.",
  "Do not communicate priority, risk, severity, or readiness with color alone.",
  "Preserve keyboard order according to the daily revenue-priority ordering.",
  "Do not move focus, animate essential content, auto-refresh, poll, or create live-update noise.",
  "Keep human-review-required states distinct from advisory operator guidance for screen-reader users.",
  "Use concise wording and screen-reader-friendly summaries.",
];

const noActionExecutionBoundaries = [
  "No buttons, links, toggles, menus, forms, or controls may send, assign, recover, call providers, approve execution, persist, poll, queue, retry, or mutate workflows.",
  "The future UI may render only read-only labels, counts, summaries, and explanations from existing dashboard-loaded data and already-scoped derived signals.",
  "Daily priority, queue, recovery, escalation, approval, and human-review wording must never become permission to execute.",
  "No routes, new fetches, server actions, provider imports, Twilio calls, automation-agent imports, Prisma changes, migrations, polling loops, or persisted UI state are allowed.",
  "No hidden execution affordances, autonomous outreach, autonomous negotiation, auto disposition, auto close, or queue execution semantics are allowed.",
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
  "required safety copy must render with every future section.",
  "no hidden execution affordances may appear.",
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

function addWarning(warningCodes: string[], warningCode: R59OperatorWorkQueueUiImplementationWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R59OperatorWorkQueueUiImplementationScopeInput) {
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

export function assertR59OperatorWorkQueueUiImplementationScopeInvariants(
  result: Pick<
    R59OperatorWorkQueueUiImplementationScopeResult,
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
): R59OperatorWorkQueueUiImplementationInvariantCheck {
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

export function summarizeR59OperatorWorkQueueUiImplementationScopeContract(
  result: R59OperatorWorkQueueUiImplementationScopeResult,
) {
  const invariantCheck = assertR59OperatorWorkQueueUiImplementationScopeInvariants(result);

  return boundSummary(
    `R59C ${result.surface} status is ${result.scopeStatus}. ` +
      `Future placement is ${result.allowedUiPlacement.futureLikelyFile} within ${result.allowedUiPlacement.placement}. ` +
      `${result.allowedDisplaySections.length} read-only sections and ${result.dailyRevenuePriorityOrdering.length} priority slots are scoped. ` +
      `${result.highestValueNextActionOrdering.length} highest-value next-action ranks are scoped. ` +
      `Required safety copy: ${result.requiredSafetyCopy} ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract does not authorize UI implementation, redesign, routes, providers, Twilio, automation-agent usage, Prisma changes, persistence, polling, execution controls, approval execution, autonomous outreach, negotiation, queue execution, or runtime activation.",
  );
}

export function createR59OperatorWorkQueueUiImplementationScopeContract(
  input: R59OperatorWorkQueueUiImplementationScopeInput = {},
): R59OperatorWorkQueueUiImplementationScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r59c_operator_work_queue_ui_implementation_scope_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r59bUiScopeReviewed !== true) addWarning(warningCodes, "r59b_ui_scope_review_required");
  if (input.placementReviewed !== true) addWarning(warningCodes, "placement_review_required");
  if (input.readOnlyDataReviewed !== true) addWarning(warningCodes, "read_only_data_review_required");
  if (input.displaySectionsReviewed !== true) addWarning(warningCodes, "display_section_review_required");
  if (input.dailyPriorityReviewed !== true) addWarning(warningCodes, "daily_priority_review_required");
  if (input.highestValueNextActionsReviewed !== true) {
    addWarning(warningCodes, "highest_value_next_action_review_required");
  }
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
    input.r59bUiScopeReviewed !== true ||
    input.placementReviewed !== true ||
    input.readOnlyDataReviewed !== true ||
    input.displaySectionsReviewed !== true ||
    input.dailyPriorityReviewed !== true ||
    input.highestValueNextActionsReviewed !== true ||
    input.wordingReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R59OperatorWorkQueueUiImplementationScopeStatus = hasForbiddenRequest(input)
    ? "implementation_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "read_only_ui_implementation_scope_ready";
  const result: R59OperatorWorkQueueUiImplementationScopeResult = {
    phase: "R59C",
    surface: "operator_work_queue_read_only_ui_implementation_scope",
    scopeStatus,
    requiredSafetyCopy,
    allowedUiPlacement,
    allowedReadOnlyDataSource,
    allowedDisplaySections,
    dailyRevenuePriorityOrdering,
    highestValueNextActionOrdering,
    safeManualGuidanceWording,
    blockedForbiddenUiControls,
    dangerousLanguagePatterns,
    accessibilityRequirements,
    noActionExecutionBoundaries,
    invariantAssertions,
    rejectionReasons,
    safetyFlags,
    warningCodes,
    operatorReviewRequired,
    scopeNotes,
    nextSuggestedPhase: "R59D - Operator Work Queue Intelligence Read-Only UI Implementation",
    summary: "R59C operator work queue read-only UI implementation scope contract only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR59OperatorWorkQueueUiImplementationScopeContract(result) };
}
