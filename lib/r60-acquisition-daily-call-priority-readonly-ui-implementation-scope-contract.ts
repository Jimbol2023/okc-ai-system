export type R60AcquisitionDailyCallPriorityUiImplementationScopeStatus =
  | "implementation_scope_blocked"
  | "operator_review_required"
  | "read_only_ui_implementation_scope_ready";

export type R60AllowedFutureUiSurface = {
  surface: "existing_dashboard";
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx";
  futureComponentAllowed: "components/dashboard/acquisition-daily-call-priority-summary.tsx";
  placement: "dashboard_read_only_revenue_operations_section";
  routeChangesAllowed: false;
  redesignAllowed: false;
  implementationAllowedNow: false;
};

export type R60ForbiddenUiSurface =
  | "new_route"
  | "new_dashboard_tab"
  | "provider_console"
  | "twilio_console"
  | "dialer_panel"
  | "campaign_builder"
  | "automation_agent_console"
  | "approval_execution_panel"
  | "persistent_queue_page"
  | "runtime_workflow_panel";

export type R60AllowedReadOnlyDataConcept = {
  concept:
    | "lead_id"
    | "lead_source"
    | "lead_status"
    | "approval_status"
    | "human_review_required_state"
    | "do_not_contact_or_opt_out_state"
    | "seller_response_context"
    | "manual_follow_up_due_state"
    | "seller_motivation_context"
    | "seller_timeline_context"
    | "missing_acquisition_data_signal"
    | "existing_manual_revenue_metric";
  displayBoundary: string;
};

export type R60AllowedDisplaySection =
  | "governance_stop_signals"
  | "highest_priority_seller_review"
  | "daily_seller_call_priorities"
  | "seller_urgency_review"
  | "seller_momentum_risk"
  | "overdue_seller_follow_up"
  | "lead_decay_risk"
  | "high_motivation_seller_review"
  | "missing_acquisition_data"
  | "acquisition_bottlenecks"
  | "manual_call_review_guidance"
  | "safe_operator_review_guidance";

export type R60PriorityOrderingRule = {
  order: number;
  section: R60AllowedDisplaySection;
  renderIntent: string;
  safeCopyRequired: string;
};

export type R60ForbiddenExecutionControl =
  | "call now"
  | "auto call"
  | "auto dial"
  | "launch dialer"
  | "send SMS"
  | "send email"
  | "activate campaign"
  | "auto follow-up"
  | "queue execution"
  | "provider activation"
  | "autonomous outreach"
  | "autonomous negotiation"
  | "approve and send"
  | "execute workflow"
  | "execute call workflow"
  | "release automation"
  | "hidden execution affordances";

export type R60UiImplementationScopeWarningCode =
  | "r60c_readonly_ui_implementation_scope_contract_only"
  | "input_missing"
  | "r60b_ui_scope_review_required"
  | "future_surface_review_required"
  | "read_only_data_review_required"
  | "display_section_review_required"
  | "priority_ordering_review_required"
  | "safe_copy_review_required"
  | "governance_boundary_review_required"
  | "accessibility_review_required"
  | "dangerous_pattern_review_required"
  | "operator_review_required"
  | "ui_implementation_rejected"
  | "route_change_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "call_execution_rejected"
  | "dialer_activation_rejected"
  | "campaign_activation_rejected"
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

export type R60UiImplementationScopeInput = {
  r60bUiScopeReviewed?: boolean;
  futureSurfacesReviewed?: boolean;
  readOnlyDataReviewed?: boolean;
  displaySectionsReviewed?: boolean;
  priorityOrderingReviewed?: boolean;
  safeCopyReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  dangerousPatternsReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiImplementationRequested?: boolean;
  routeChangeRequested?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  callExecutionRequested?: boolean;
  dialerActivationRequested?: boolean;
  campaignActivationRequested?: boolean;
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

export type R60UiImplementationScopeSafetyFlags = {
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

export type R60UiImplementationScopeResult = R60UiImplementationScopeSafetyFlags & {
  phase: "R60C";
  surface: "acquisition_daily_call_priority_readonly_ui_implementation_scope";
  scopeStatus: R60AcquisitionDailyCallPriorityUiImplementationScopeStatus;
  allowedFutureUiSurface: R60AllowedFutureUiSurface;
  forbiddenUiSurfaces: R60ForbiddenUiSurface[];
  allowedReadOnlyDataConcepts: R60AllowedReadOnlyDataConcept[];
  allowedDisplaySections: R60AllowedDisplaySection[];
  priorityOrderingDisplayRules: R60PriorityOrderingRule[];
  governanceStopFirstRules: string[];
  safeCopyRules: string[];
  forbiddenExecutionControls: R60ForbiddenExecutionControl[];
  accessibilityRules: string[];
  noExecutionBoundaries: string[];
  invariantAssertions: string[];
  rejectionReasons: string[];
  safetyFlags: R60UiImplementationScopeSafetyFlags;
  warningCodes: string[];
  operatorReviewRequired: boolean;
  scopeNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R60UiImplementationScopeInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R60UiImplementationScopeSafetyFlags = {
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

const allowedFutureUiSurface: R60AllowedFutureUiSurface = {
  surface: "existing_dashboard",
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx",
  futureComponentAllowed: "components/dashboard/acquisition-daily-call-priority-summary.tsx",
  placement: "dashboard_read_only_revenue_operations_section",
  routeChangesAllowed: false,
  redesignAllowed: false,
  implementationAllowedNow: false,
};

const forbiddenUiSurfaces: R60ForbiddenUiSurface[] = [
  "new_route",
  "new_dashboard_tab",
  "provider_console",
  "twilio_console",
  "dialer_panel",
  "campaign_builder",
  "automation_agent_console",
  "approval_execution_panel",
  "persistent_queue_page",
  "runtime_workflow_panel",
];

const allowedReadOnlyDataConcepts: R60AllowedReadOnlyDataConcept[] = [
  { concept: "lead_id", displayBoundary: "May identify an existing dashboard lead only; no mutation or queue creation." },
  { concept: "lead_source", displayBoundary: "May explain source context if already loaded; assumptions must be clear." },
  { concept: "lead_status", displayBoundary: "May support manual priority labels; no workflow state changes." },
  { concept: "approval_status", displayBoundary: "May show governance context; approval never grants contact permission." },
  {
    concept: "human_review_required_state",
    displayBoundary: "Must remain a stop-and-review label before any call-priority guidance.",
  },
  {
    concept: "do_not_contact_or_opt_out_state",
    displayBoundary: "Must remain a governance stop and cannot be overridden by priority labels.",
  },
  { concept: "seller_response_context", displayBoundary: "May show already-loaded seller response context for review only." },
  {
    concept: "manual_follow_up_due_state",
    displayBoundary: "May show due or overdue review priority; no scheduling, sending, dialing, or persistence.",
  },
  {
    concept: "seller_motivation_context",
    displayBoundary: "May show seller-provided motivation assumptions that require human verification.",
  },
  {
    concept: "seller_timeline_context",
    displayBoundary: "May show seller-provided urgency or timeline context without pressure or legal claims.",
  },
  {
    concept: "missing_acquisition_data_signal",
    displayBoundary: "May show missing seller, property, source, phone, motivation, timeline, or next-step data.",
  },
  {
    concept: "existing_manual_revenue_metric",
    displayBoundary: "May use existing manual revenue metrics only when already available in dashboard scope.",
  },
];

const allowedDisplaySections: R60AllowedDisplaySection[] = [
  "governance_stop_signals",
  "highest_priority_seller_review",
  "daily_seller_call_priorities",
  "seller_urgency_review",
  "seller_momentum_risk",
  "overdue_seller_follow_up",
  "lead_decay_risk",
  "high_motivation_seller_review",
  "missing_acquisition_data",
  "acquisition_bottlenecks",
  "manual_call_review_guidance",
  "safe_operator_review_guidance",
];

const priorityOrderingDisplayRules: R60PriorityOrderingRule[] = [
  {
    order: 1,
    section: "governance_stop_signals",
    renderIntent: "Render stop-and-review labels before all seller call priority content.",
    safeCopyRequired: "Governance stop signals require manual review and do not grant call, text, email, dialer, or campaign permission.",
  },
  {
    order: 2,
    section: "highest_priority_seller_review",
    renderIntent: "Render highest-value seller review labels after governance stops.",
    safeCopyRequired: "Highest-priority seller review is advisory only and cannot trigger calls, dialing, messages, or providers.",
  },
  {
    order: 3,
    section: "daily_seller_call_priorities",
    renderIntent: "Render daily seller priority labels as scannable manual guidance.",
    safeCopyRequired: "Call priority labels are informational and cannot call, send, queue, launch, or activate workflows.",
  },
  {
    order: 4,
    section: "seller_urgency_review",
    renderIntent: "Render seller urgency assumptions from existing seller-provided context.",
    safeCopyRequired: "Urgency review is an assumption for human review and does not authorize contact execution.",
  },
  {
    order: 5,
    section: "seller_momentum_risk",
    renderIntent: "Render seller momentum risk labels after urgency.",
    safeCopyRequired: "Seller momentum risk is a review label only and cannot send, dial, or trigger follow-up.",
  },
  {
    order: 6,
    section: "overdue_seller_follow_up",
    renderIntent: "Render overdue follow-up labels without outreach controls.",
    safeCopyRequired: "Overdue seller follow-up is manual visibility and cannot create calls, messages, tasks, or schedules.",
  },
  {
    order: 7,
    section: "lead_decay_risk",
    renderIntent: "Render stale open lead risk as manual triage guidance.",
    safeCopyRequired: "Lead decay risk is advisory and cannot launch reactivation campaigns or auto follow-up.",
  },
  {
    order: 8,
    section: "high_motivation_seller_review",
    renderIntent: "Render high-motivation seller assumptions requiring verification.",
    safeCopyRequired: "Motivation labels require human verification and cannot invent property or seller facts.",
  },
  {
    order: 9,
    section: "missing_acquisition_data",
    renderIntent: "Render missing acquisition data labels before bottleneck guidance.",
    safeCopyRequired: "Missing data labels require human verification and cannot trigger enrichment, scraping, persistence, or providers.",
  },
  {
    order: 10,
    section: "acquisition_bottlenecks",
    renderIntent: "Render acquisition bottleneck labels as non-mutating review guidance.",
    safeCopyRequired: "Acquisition bottlenecks are manual next-step labels and cannot mutate workflow state.",
  },
  {
    order: 11,
    section: "manual_call_review_guidance",
    renderIntent: "Render concise manual review guidance without call controls.",
    safeCopyRequired: "Manual call review guidance is advisory only and cannot call, dial, send, queue, or execute.",
  },
  {
    order: 12,
    section: "safe_operator_review_guidance",
    renderIntent: "Render final safe operator guidance preserving human ownership.",
    safeCopyRequired: "Guidance is read-only and does not authorize dialing, messaging, campaigns, providers, or automation.",
  },
];

const governanceStopFirstRules = [
  "Governance stop signals must render before all seller call priority labels.",
  "Do-not-contact, opt-out, missing consent, rejected approval, and human-review-required states must remain stop-and-review labels.",
  "No priority score, urgency label, seller momentum label, or high-motivation label may override a governance stop.",
  "Approval or review states cannot become permission to call, text, email, dial, launch campaigns, or activate providers.",
];

const safeCopyRules = [
  "Manual call review recommended.",
  "Seller follow-up priority.",
  "Operator review recommended.",
  "High-priority seller review.",
  "Call priority label is advisory only.",
  "Use seller call priority guidance for manual review only.",
  "This future UI may guide human work only; it must not call, dial, send, persist, poll, activate providers, negotiate, launch campaigns, or execute workflows.",
];

const forbiddenExecutionControls: R60ForbiddenExecutionControl[] = [
  "call now",
  "auto call",
  "auto dial",
  "launch dialer",
  "send SMS",
  "send email",
  "activate campaign",
  "auto follow-up",
  "queue execution",
  "provider activation",
  "autonomous outreach",
  "autonomous negotiation",
  "approve and send",
  "execute workflow",
  "execute call workflow",
  "release automation",
  "hidden execution affordances",
];

const accessibilityRules = [
  "Render the future surface with a semantic section and stable heading.",
  "Use semantic headings for each seller priority section.",
  "Use readable labels for priorities, urgency, momentum, decay, overdue follow-up, missing data, bottlenecks, and guidance.",
  "Status and priority meaning must be text-based and never depend on color alone.",
  "Do not move focus, require motion, auto-refresh, poll, or create live-update noise.",
  "Use concise wording and screen-reader-friendly summaries for all seller priority groups.",
];

const noExecutionBoundaries = [
  "No calls, dialing, SMS, email, campaigns, provider activation, Twilio calls, or automation-agent behavior.",
  "No buttons, links, toggles, menus, forms, server actions, or controls may imply execution.",
  "No routes, new fetches, persistence, polling, Prisma changes, migrations, or runtime activation.",
  "No approval, review, urgency, or deal-readiness wording may become permission to contact sellers.",
  "No hidden execution affordances, background provider imports, campaign launch, dialer activation, or autonomous outreach.",
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
  "Governance stop signals must render first in any future UI.",
  "Call priority labels must remain advisory only.",
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

function addWarning(warningCodes: string[], warningCode: R60UiImplementationScopeWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R60UiImplementationScopeInput) {
  return (
    input.uiImplementationRequested === true ||
    input.routeChangeRequested === true ||
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.callExecutionRequested === true ||
    input.dialerActivationRequested === true ||
    input.campaignActivationRequested === true ||
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

export function assertR60AcquisitionDailyCallPriorityUiImplementationScopeInvariants(
  result: Pick<
    R60UiImplementationScopeResult,
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
): R60UiImplementationScopeInvariantCheck {
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

export function summarizeR60AcquisitionDailyCallPriorityUiImplementationScope(
  result: R60UiImplementationScopeResult,
) {
  const invariantCheck = assertR60AcquisitionDailyCallPriorityUiImplementationScopeInvariants(result);

  return boundSummary(
    `R60C ${result.surface} status is ${result.scopeStatus}. ` +
      `Future surface is ${result.allowedFutureUiSurface.futureLikelyFile}; implementation allowed now is ${result.allowedFutureUiSurface.implementationAllowedNow}. ` +
      `${result.allowedDisplaySections.length} read-only sections and ${result.priorityOrderingDisplayRules.length} display rules are scoped. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract cannot authorize UI implementation, redesign, routes, providers, Twilio, automation-agent usage, Prisma changes, calls, dialing, SMS, email, campaigns, persistence, polling, execution controls, approval execution, autonomous outreach, or runtime activation.",
  );
}

export function createR60AcquisitionDailyCallPriorityReadonlyUiImplementationScopeContract(
  input: R60UiImplementationScopeInput = {},
): R60UiImplementationScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r60c_readonly_ui_implementation_scope_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r60bUiScopeReviewed !== true) addWarning(warningCodes, "r60b_ui_scope_review_required");
  if (input.futureSurfacesReviewed !== true) addWarning(warningCodes, "future_surface_review_required");
  if (input.readOnlyDataReviewed !== true) addWarning(warningCodes, "read_only_data_review_required");
  if (input.displaySectionsReviewed !== true) addWarning(warningCodes, "display_section_review_required");
  if (input.priorityOrderingReviewed !== true) addWarning(warningCodes, "priority_ordering_review_required");
  if (input.safeCopyReviewed !== true) addWarning(warningCodes, "safe_copy_review_required");
  if (input.governanceBoundaryReviewed !== true) addWarning(warningCodes, "governance_boundary_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.dangerousPatternsReviewed !== true) addWarning(warningCodes, "dangerous_pattern_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.uiImplementationRequested === true) addWarning(warningCodes, "ui_implementation_rejected");
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.callExecutionRequested === true) addWarning(warningCodes, "call_execution_rejected");
  if (input.dialerActivationRequested === true) addWarning(warningCodes, "dialer_activation_rejected");
  if (input.campaignActivationRequested === true) addWarning(warningCodes, "campaign_activation_rejected");
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
    input.r60bUiScopeReviewed !== true ||
    input.futureSurfacesReviewed !== true ||
    input.readOnlyDataReviewed !== true ||
    input.displaySectionsReviewed !== true ||
    input.priorityOrderingReviewed !== true ||
    input.safeCopyReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R60AcquisitionDailyCallPriorityUiImplementationScopeStatus = hasForbiddenRequest(input)
    ? "implementation_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "read_only_ui_implementation_scope_ready";
  const result: R60UiImplementationScopeResult = {
    phase: "R60C",
    surface: "acquisition_daily_call_priority_readonly_ui_implementation_scope",
    scopeStatus,
    allowedFutureUiSurface,
    forbiddenUiSurfaces,
    allowedReadOnlyDataConcepts,
    allowedDisplaySections,
    priorityOrderingDisplayRules,
    governanceStopFirstRules,
    safeCopyRules,
    forbiddenExecutionControls,
    accessibilityRules,
    noExecutionBoundaries,
    invariantAssertions,
    rejectionReasons,
    safetyFlags,
    warningCodes,
    operatorReviewRequired,
    scopeNotes,
    nextSuggestedPhase: "R60D - Acquisition Daily Call Priority Intelligence Read-Only UI Implementation",
    summary: "R60C acquisition daily call priority read-only UI implementation scope contract only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR60AcquisitionDailyCallPriorityUiImplementationScope(result) };
}
