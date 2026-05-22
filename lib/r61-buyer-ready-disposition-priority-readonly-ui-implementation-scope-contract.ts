export type R61BuyerReadyDispositionUiImplementationScopeStatus =
  | "implementation_scope_blocked"
  | "operator_review_required"
  | "read_only_ui_implementation_scope_ready";

export type R61AllowedFutureUiSurface = {
  surface: "existing_dashboard";
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx";
  futureComponentAllowed: "components/dashboard/buyer-ready-disposition-priority-summary.tsx";
  placement: "dashboard_read_only_revenue_operations_section";
  routeChangesAllowed: false;
  redesignAllowed: false;
  implementationAllowedNow: false;
};

export type R61ForbiddenUiSurface =
  | "new_buyer_outreach_console"
  | "new_campaign_tab"
  | "new_provider_twilio_console"
  | "new_execution_queue"
  | "new_automation_agent_panel"
  | "new_send_approval_workflow_panel"
  | "new_autonomous_matching_panel"
  | "new_route_without_explicit_authorization"
  | "buyer_package_release_panel"
  | "runtime_disposition_workflow_panel";

export type R61AllowedReadOnlyBuyerReadyDataConcept = {
  concept:
    | "buyer_ready_disposition_priority"
    | "near_buyer_ready_review"
    | "ready_to_package_deal"
    | "incomplete_buyer_package"
    | "buyer_fit_review_needed"
    | "buyer_demand_alignment_review"
    | "disposition_bottleneck"
    | "blocked_buyer_disposition"
    | "missing_assignment_title_photos_repair_arv_rent_strategy_data"
    | "high_probability_buyer_review"
    | "manual_disposition_review_recommended"
    | "operator_package_prep_guidance"
    | "governance_stop_signals";
  displayBoundary: string;
};

export type R61AllowedDisplaySection =
  | "governance_stop_signals"
  | "buyer_ready_disposition_priority"
  | "near_buyer_ready_review"
  | "ready_to_package_deal"
  | "incomplete_buyer_package"
  | "missing_buyer_package_data"
  | "buyer_fit_review_needed"
  | "buyer_demand_alignment_review"
  | "high_probability_buyer_review"
  | "disposition_bottleneck"
  | "blocked_buyer_disposition"
  | "manual_disposition_review_guidance"
  | "operator_package_prep_guidance";

export type R61PriorityOrderingRule = {
  order: number;
  section: R61AllowedDisplaySection;
  renderIntent: string;
  safeCopyRequired: string;
};

export type R61ForbiddenExecutionControl =
  | "send to buyers"
  | "blast buyers"
  | "auto email buyers"
  | "auto SMS buyers"
  | "launch buyer campaign"
  | "activate buyer outreach"
  | "queue buyer execution"
  | "match and send automatically"
  | "approve and send"
  | "execute disposition workflow"
  | "release buyer automation"
  | "autonomous buyer negotiation"
  | "provider activation"
  | "hidden execution affordances";

export type R61UiImplementationScopeWarningCode =
  | "r61c_readonly_ui_implementation_scope_contract_only"
  | "input_missing"
  | "r61b_ui_scope_review_required"
  | "future_surface_review_required"
  | "read_only_data_review_required"
  | "display_section_review_required"
  | "priority_ordering_review_required"
  | "package_prep_display_review_required"
  | "buyer_fit_display_review_required"
  | "demand_alignment_display_review_required"
  | "safe_copy_review_required"
  | "governance_boundary_review_required"
  | "accessibility_review_required"
  | "dangerous_pattern_review_required"
  | "operator_review_required"
  | "ui_implementation_rejected"
  | "dashboard_page_component_change_rejected"
  | "route_change_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "email_sms_sending_rejected"
  | "buyer_outreach_execution_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "execution_control_rejected"
  | "redesign_rejected"
  | "autonomous_buyer_outreach_rejected"
  | "autonomous_negotiation_rejected"
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

export type R61UiImplementationScopeInput = {
  r61bUiScopeReviewed?: boolean;
  futureSurfacesReviewed?: boolean;
  readOnlyDataReviewed?: boolean;
  displaySectionsReviewed?: boolean;
  priorityOrderingReviewed?: boolean;
  packagePrepDisplayReviewed?: boolean;
  buyerFitDisplayReviewed?: boolean;
  demandAlignmentDisplayReviewed?: boolean;
  safeCopyReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  dangerousPatternsReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiImplementationRequested?: boolean;
  dashboardPageComponentChangeRequested?: boolean;
  routeChangeRequested?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  emailSmsSendingRequested?: boolean;
  buyerOutreachExecutionRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  executionControlRequested?: boolean;
  redesignRequested?: boolean;
  autonomousBuyerOutreachRequested?: boolean;
  autonomousNegotiationRequested?: boolean;
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

export type R61UiImplementationScopeSafetyFlags = {
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

export type R61UiImplementationScopeResult = R61UiImplementationScopeSafetyFlags & {
  phase: "R61C";
  surface: "buyer_ready_disposition_priority_readonly_ui_implementation_scope";
  scopeStatus: R61BuyerReadyDispositionUiImplementationScopeStatus;
  allowedFutureUiSurface: R61AllowedFutureUiSurface;
  forbiddenUiSurfaces: R61ForbiddenUiSurface[];
  allowedReadOnlyBuyerReadyDataConcepts: R61AllowedReadOnlyBuyerReadyDataConcept[];
  allowedDisplaySections: R61AllowedDisplaySection[];
  priorityOrderingDisplayRules: R61PriorityOrderingRule[];
  packagePrepDisplayRules: string[];
  buyerFitReviewDisplayRules: string[];
  demandAlignmentDisplayRules: string[];
  dispositionBottleneckDisplayRules: string[];
  blockedDispositionDisplayRules: string[];
  governanceStopFirstDisplayRules: string[];
  safeCopyRules: string[];
  forbiddenExecutionControls: R61ForbiddenExecutionControl[];
  accessibilityRules: string[];
  noExecutionBoundaries: string[];
  invariantAssertions: string[];
  rejectionReasons: string[];
  safetyFlags: R61UiImplementationScopeSafetyFlags;
  warningCodes: string[];
  operatorReviewRequired: boolean;
  scopeNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R61UiImplementationScopeInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R61UiImplementationScopeSafetyFlags = {
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

const allowedFutureUiSurface: R61AllowedFutureUiSurface = {
  surface: "existing_dashboard",
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx",
  futureComponentAllowed: "components/dashboard/buyer-ready-disposition-priority-summary.tsx",
  placement: "dashboard_read_only_revenue_operations_section",
  routeChangesAllowed: false,
  redesignAllowed: false,
  implementationAllowedNow: false,
};

const forbiddenUiSurfaces: R61ForbiddenUiSurface[] = [
  "new_buyer_outreach_console",
  "new_campaign_tab",
  "new_provider_twilio_console",
  "new_execution_queue",
  "new_automation_agent_panel",
  "new_send_approval_workflow_panel",
  "new_autonomous_matching_panel",
  "new_route_without_explicit_authorization",
  "buyer_package_release_panel",
  "runtime_disposition_workflow_panel",
];

const allowedReadOnlyBuyerReadyDataConcepts: R61AllowedReadOnlyBuyerReadyDataConcept[] = [
  {
    concept: "governance_stop_signals",
    displayBoundary: "Must render first and cannot be overridden by buyer-ready, fit, demand, package, urgency, or review labels.",
  },
  {
    concept: "buyer_ready_disposition_priority",
    displayBoundary: "May show a manual disposition priority label only; buyer-ready does not mean send.",
  },
  {
    concept: "near_buyer_ready_review",
    displayBoundary: "May show remaining manual package or fit gaps; no buyer-ready-to-contact or send-ready wording.",
  },
  {
    concept: "ready_to_package_deal",
    displayBoundary: "May show package-prep priority for operator review; no package release or buyer outreach.",
  },
  {
    concept: "incomplete_buyer_package",
    displayBoundary: "May show package completeness gaps that require manual verification.",
  },
  {
    concept: "missing_assignment_title_photos_repair_arv_rent_strategy_data",
    displayBoundary: "May list missing assignment, title, photos, repair, ARV, rent, or strategy data without inventing facts.",
  },
  {
    concept: "buyer_fit_review_needed",
    displayBoundary: "May show buyer-fit review labels only; no autonomous matching, contact, negotiation, or sending.",
  },
  {
    concept: "buyer_demand_alignment_review",
    displayBoundary: "May show demand alignment review for strategy, area, price, property type, repair, ARV, and rent context.",
  },
  {
    concept: "high_probability_buyer_review",
    displayBoundary: "May show high-probability buyer review as advisory priority, not a contact instruction.",
  },
  {
    concept: "disposition_bottleneck",
    displayBoundary: "May show package, fit, data, or process bottlenecks without task mutation or workflow activation.",
  },
  {
    concept: "blocked_buyer_disposition",
    displayBoundary: "May show blocked disposition states requiring human review before any next step.",
  },
  {
    concept: "manual_disposition_review_recommended",
    displayBoundary: "May show manual disposition review guidance only; no execution controls.",
  },
  {
    concept: "operator_package_prep_guidance",
    displayBoundary: "May show safe package-prep guidance only; no share, release, send, campaign, or provider controls.",
  },
];

const allowedDisplaySections: R61AllowedDisplaySection[] = [
  "governance_stop_signals",
  "buyer_ready_disposition_priority",
  "near_buyer_ready_review",
  "ready_to_package_deal",
  "incomplete_buyer_package",
  "missing_buyer_package_data",
  "buyer_fit_review_needed",
  "buyer_demand_alignment_review",
  "high_probability_buyer_review",
  "disposition_bottleneck",
  "blocked_buyer_disposition",
  "manual_disposition_review_guidance",
  "operator_package_prep_guidance",
];

const priorityOrderingDisplayRules: R61PriorityOrderingRule[] = [
  {
    order: 1,
    section: "governance_stop_signals",
    renderIntent: "Render governance stops before all buyer disposition priority content.",
    safeCopyRequired: "Governance stop signals must be resolved first.",
  },
  {
    order: 2,
    section: "buyer_ready_disposition_priority",
    renderIntent: "Render buyer-ready disposition priority after governance stop review.",
    safeCopyRequired: "Buyer-ready label is advisory only. Buyer-ready does not mean send.",
  },
  {
    order: 3,
    section: "near_buyer_ready_review",
    renderIntent: "Render near-buyer-ready review for remaining manual package or fit gaps.",
    safeCopyRequired: "Near-buyer-ready review does not authorize buyer contact.",
  },
  {
    order: 4,
    section: "ready_to_package_deal",
    renderIntent: "Render package-prep priority for deals that may be reviewed manually.",
    safeCopyRequired: "Package-prep priority. Review buyer package before taking action.",
  },
  {
    order: 5,
    section: "incomplete_buyer_package",
    renderIntent: "Render incomplete buyer package labels before fit and demand guidance.",
    safeCopyRequired: "Incomplete buyer package requires manual verification.",
  },
  {
    order: 6,
    section: "missing_buyer_package_data",
    renderIntent: "Render missing assignment, title, photos, repair, ARV, rent, or strategy data.",
    safeCopyRequired: "Missing package data must be completed manually; do not invent property facts.",
  },
  {
    order: 7,
    section: "buyer_fit_review_needed",
    renderIntent: "Render buyer-fit review labels after package completeness.",
    safeCopyRequired: "Buyer-fit review needed.",
  },
  {
    order: 8,
    section: "buyer_demand_alignment_review",
    renderIntent: "Render demand alignment review for strategy, area, price, property type, repair, ARV, and rent context.",
    safeCopyRequired: "Buyer demand alignment review is advisory only.",
  },
  {
    order: 9,
    section: "high_probability_buyer_review",
    renderIntent: "Render high-probability buyer review labels without contact affordances.",
    safeCopyRequired: "High-probability buyer review is not a contact instruction.",
  },
  {
    order: 10,
    section: "disposition_bottleneck",
    renderIntent: "Render disposition bottleneck labels without workflow mutation.",
    safeCopyRequired: "Disposition bottleneck requires manual review.",
  },
  {
    order: 11,
    section: "blocked_buyer_disposition",
    renderIntent: "Render blocked disposition states requiring human review.",
    safeCopyRequired: "Blocked buyer disposition is review-only and cannot approve outreach.",
  },
  {
    order: 12,
    section: "manual_disposition_review_guidance",
    renderIntent: "Render concise manual disposition guidance without execution controls.",
    safeCopyRequired: "Manual disposition review recommended.",
  },
  {
    order: 13,
    section: "operator_package_prep_guidance",
    renderIntent: "Render safe operator package-prep guidance last.",
    safeCopyRequired: "Review buyer package before taking action.",
  },
];

const packagePrepDisplayRules = [
  "Package-prep priority may appear only as read-only manual guidance.",
  "Ready-to-package does not release, share, send, blast, or queue a buyer package.",
  "Incomplete package labels must show missing assignment, title, photos, repair, ARV, rent, or strategy data as manual review gaps.",
  "Package completeness displays must not invent property facts or activate enrichment, providers, persistence, or workflow mutation.",
];

const buyerFitReviewDisplayRules = [
  "Buyer-fit review needed may appear only as a manual review label.",
  "Buyer-fit display may include strategy, property type, price band, area, repair, ARV, rent, and demand context when already available.",
  "Buyer-fit display must not imply buyer-ready-to-contact, autonomous matching, buyer outreach, negotiation, sending, or package release.",
];

const demandAlignmentDisplayRules = [
  "Buyer demand alignment review may appear only as advisory prioritization.",
  "Demand alignment display may summarize strategy, market area, price band, property type, repair, ARV, and rent context.",
  "Demand alignment cannot launch buyer campaigns, queue execution, activate providers, or authorize contact.",
];

const dispositionBottleneckDisplayRules = [
  "Disposition bottleneck may show package, fit, data, review, or process friction.",
  "Bottleneck labels cannot assign work, mutate tasks, create queues, poll, persist, or activate workflow state.",
  "Disposition bottleneck visibility must remain separate from execution or approval controls.",
];

const blockedDispositionDisplayRules = [
  "Blocked buyer disposition must remain review-only.",
  "Blocked disposition cannot become approve-and-send, release buyer automation, provider activation, or package release.",
  "Blocked states must preserve human review before any buyer-facing action outside the app.",
];

const governanceStopFirstDisplayRules = [
  "Governance stop signals must render before buyer-ready disposition priority.",
  "Governance stops outrank buyer-readiness, package completeness, buyer-fit, demand alignment, bottlenecks, blocked disposition, and urgency.",
  "Do-not-contact, opt-out, missing consent, rejected approval, and human-review-required states must remain stop-and-review labels.",
  "Approval or review state cannot become permission to email, SMS, contact buyers, send packages, launch campaigns, or activate providers.",
];

const safeCopyRules = [
  "Manual disposition review recommended",
  "Buyer-ready label is advisory only",
  "Review buyer package before taking action",
  "Buyer-fit review needed",
  "Package-prep priority",
  "Governance stop signals must be resolved first",
  "Buyer-ready does not mean send",
];

const forbiddenExecutionControls: R61ForbiddenExecutionControl[] = [
  "send to buyers",
  "blast buyers",
  "auto email buyers",
  "auto SMS buyers",
  "launch buyer campaign",
  "activate buyer outreach",
  "queue buyer execution",
  "match and send automatically",
  "approve and send",
  "execute disposition workflow",
  "release buyer automation",
  "autonomous buyer negotiation",
  "provider activation",
  "hidden execution affordances",
];

const accessibilityRules = [
  "Render the future surface with a semantic section and stable heading.",
  "Use semantic headings for each buyer disposition priority section.",
  "Use readable labels for buyer-ready, near-buyer-ready, blocked, missing package data, fit, demand alignment, bottleneck, status, and guidance text.",
  "Status and priority meaning must be text-based and never depend on color alone.",
  "Do not move focus, require motion, auto-refresh, poll, or create live-update noise.",
  "Use concise wording and screen-reader-friendly summaries for all buyer disposition priority groups.",
];

const noExecutionBoundaries = [
  "No email, SMS, buyer outreach, seller outreach, campaigns, provider activation, Twilio calls, or automation-agent behavior.",
  "No buttons, links, toggles, menus, forms, server actions, or controls may imply execution.",
  "No dashboard/page/component changes, routes, new fetches, persistence, polling, Prisma changes, migrations, or runtime activation.",
  "No approval, review, buyer-ready, ready-to-package, buyer-fit, or demand-alignment wording may become permission to contact buyers.",
  "No hidden execution affordances, background provider imports, package release, campaign launch, autonomous matching, or autonomous buyer negotiation.",
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
  "Buyer-ready labels must remain advisory only.",
  "Buyer-ready does not mean send.",
  "No buyer outreach, package release, provider activation, autonomous matching, or execution controls may be authorized.",
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

function addWarning(warningCodes: string[], warningCode: R61UiImplementationScopeWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R61UiImplementationScopeInput) {
  return (
    input.uiImplementationRequested === true ||
    input.dashboardPageComponentChangeRequested === true ||
    input.routeChangeRequested === true ||
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.emailSmsSendingRequested === true ||
    input.buyerOutreachExecutionRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.executionControlRequested === true ||
    input.redesignRequested === true ||
    input.autonomousBuyerOutreachRequested === true ||
    input.autonomousNegotiationRequested === true ||
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

export function assertR61BuyerReadyDispositionUiImplementationScopeInvariants(
  result: Pick<
    R61UiImplementationScopeResult,
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
): R61UiImplementationScopeInvariantCheck {
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

export function summarizeR61BuyerReadyDispositionUiImplementationScope(result: R61UiImplementationScopeResult) {
  const invariantCheck = assertR61BuyerReadyDispositionUiImplementationScopeInvariants(result);

  return boundSummary(
    `R61C ${result.surface} status is ${result.scopeStatus}. ` +
      `Future surface is ${result.allowedFutureUiSurface.futureLikelyFile}; implementation allowed now is ${result.allowedFutureUiSurface.implementationAllowedNow}. ` +
      `${result.allowedDisplaySections.length} read-only sections and ${result.priorityOrderingDisplayRules.length} display rules are scoped. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract cannot authorize UI implementation, dashboard/page/component changes, redesign, routes, providers, Twilio, automation-agent usage, Prisma changes, email, SMS, buyer outreach, persistence, polling, execution controls, approval execution, autonomous buyer outreach, autonomous negotiation, package release, or runtime activation.",
  );
}

export function createR61BuyerReadyDispositionPriorityReadonlyUiImplementationScopeContract(
  input: R61UiImplementationScopeInput = {},
): R61UiImplementationScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r61c_readonly_ui_implementation_scope_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r61bUiScopeReviewed !== true) addWarning(warningCodes, "r61b_ui_scope_review_required");
  if (input.futureSurfacesReviewed !== true) addWarning(warningCodes, "future_surface_review_required");
  if (input.readOnlyDataReviewed !== true) addWarning(warningCodes, "read_only_data_review_required");
  if (input.displaySectionsReviewed !== true) addWarning(warningCodes, "display_section_review_required");
  if (input.priorityOrderingReviewed !== true) addWarning(warningCodes, "priority_ordering_review_required");
  if (input.packagePrepDisplayReviewed !== true) {
    addWarning(warningCodes, "package_prep_display_review_required");
  }
  if (input.buyerFitDisplayReviewed !== true) addWarning(warningCodes, "buyer_fit_display_review_required");
  if (input.demandAlignmentDisplayReviewed !== true) {
    addWarning(warningCodes, "demand_alignment_display_review_required");
  }
  if (input.safeCopyReviewed !== true) addWarning(warningCodes, "safe_copy_review_required");
  if (input.governanceBoundaryReviewed !== true) addWarning(warningCodes, "governance_boundary_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.dangerousPatternsReviewed !== true) addWarning(warningCodes, "dangerous_pattern_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.uiImplementationRequested === true) addWarning(warningCodes, "ui_implementation_rejected");
  if (input.dashboardPageComponentChangeRequested === true) {
    addWarning(warningCodes, "dashboard_page_component_change_rejected");
  }
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.emailSmsSendingRequested === true) addWarning(warningCodes, "email_sms_sending_rejected");
  if (input.buyerOutreachExecutionRequested === true) addWarning(warningCodes, "buyer_outreach_execution_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.executionControlRequested === true) addWarning(warningCodes, "execution_control_rejected");
  if (input.redesignRequested === true) addWarning(warningCodes, "redesign_rejected");
  if (input.autonomousBuyerOutreachRequested === true) {
    addWarning(warningCodes, "autonomous_buyer_outreach_rejected");
  }
  if (input.autonomousNegotiationRequested === true) addWarning(warningCodes, "autonomous_negotiation_rejected");
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
    input.r61bUiScopeReviewed !== true ||
    input.futureSurfacesReviewed !== true ||
    input.readOnlyDataReviewed !== true ||
    input.displaySectionsReviewed !== true ||
    input.priorityOrderingReviewed !== true ||
    input.packagePrepDisplayReviewed !== true ||
    input.buyerFitDisplayReviewed !== true ||
    input.demandAlignmentDisplayReviewed !== true ||
    input.safeCopyReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R61BuyerReadyDispositionUiImplementationScopeStatus = hasForbiddenRequest(input)
    ? "implementation_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "read_only_ui_implementation_scope_ready";
  const result: R61UiImplementationScopeResult = {
    phase: "R61C",
    surface: "buyer_ready_disposition_priority_readonly_ui_implementation_scope",
    scopeStatus,
    allowedFutureUiSurface,
    forbiddenUiSurfaces,
    allowedReadOnlyBuyerReadyDataConcepts,
    allowedDisplaySections,
    priorityOrderingDisplayRules,
    packagePrepDisplayRules,
    buyerFitReviewDisplayRules,
    demandAlignmentDisplayRules,
    dispositionBottleneckDisplayRules,
    blockedDispositionDisplayRules,
    governanceStopFirstDisplayRules,
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
    nextSuggestedPhase: "R61D - Buyer-Ready Disposition Priority Intelligence Read-Only UI Implementation",
    summary: "R61C buyer-ready disposition priority read-only UI implementation scope contract only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR61BuyerReadyDispositionUiImplementationScope(result) };
}
