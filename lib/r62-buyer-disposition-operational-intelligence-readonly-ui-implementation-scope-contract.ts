export type R62BuyerDispositionOperationalReadonlyUiImplementationScopeStatus =
  | "implementation_scope_blocked"
  | "operator_review_required"
  | "read_only_ui_implementation_scope_ready";

export type R62AllowedFutureUiSurface = {
  surface: "existing_dashboard";
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx";
  futureComponentAllowed: "components/dashboard/buyer-disposition-operational-intelligence-summary.tsx";
  placement: "dashboard_read_only_revenue_operations_section";
  routeChangesAllowed: false;
  redesignAllowed: false;
  implementationAllowedNow: false;
};

export type R62ForbiddenUiSurface =
  | "new_buyer_outreach_console"
  | "new_campaign_tab"
  | "new_provider_twilio_console"
  | "new_execution_queue"
  | "new_automation_agent_panel"
  | "new_send_approval_workflow_panel"
  | "new_autonomous_matching_panel"
  | "new_route_without_explicit_authorization";

export type R62AllowedReadOnlyOperationalDataConcept =
  | "buyer_response_probability_review"
  | "buyer_engagement_quality_review"
  | "assignment_readiness_review"
  | "buyer_package_completeness_review"
  | "stale_buyer_package"
  | "stale_deal_visibility"
  | "buyer_demand_mismatch"
  | "high_likelihood_assignment_review"
  | "buyer_fit_review"
  | "package_prep_priority"
  | "disposition_bottleneck"
  | "blocked_disposition"
  | "governance_stop_signals"
  | "buyer_activity_freshness_review"
  | "assignment_readiness_momentum_review"
  | "manual_buyer_review_guidance"
  | "operator_disposition_workflow_guidance"
  | "revenue_priority_disposition_review"
  | "disposition_workload_priority"
  | "high_value_disposition_review"
  | "assignment_risk_review";

export type R62AllowedOperationalDisplayConcept = {
  concept: R62AllowedReadOnlyOperationalDataConcept;
  displayBoundary: string;
};

export type R62AllowedOperationalDisplaySection =
  | "governance_stop_signals"
  | "revenue_priority_disposition_review"
  | "high_likelihood_assignment_review"
  | "assignment_readiness_review"
  | "buyer_package_completeness_review"
  | "stale_buyer_package"
  | "stale_deal_visibility"
  | "buyer_activity_freshness_review"
  | "buyer_response_probability_review"
  | "buyer_engagement_quality_review"
  | "buyer_demand_mismatch"
  | "buyer_fit_review"
  | "package_prep_priority"
  | "assignment_readiness_momentum_review"
  | "assignment_risk_review"
  | "disposition_bottleneck"
  | "blocked_disposition"
  | "disposition_workload_priority"
  | "high_value_disposition_review"
  | "manual_buyer_review_guidance"
  | "operator_disposition_workflow_guidance";

export type R62OperationalPriorityOrderingRule = {
  order: number;
  section: R62AllowedOperationalDisplaySection;
  renderIntent: string;
  safeCopyRequired: string;
};

export type R62ForbiddenExecutionControl =
  | "send to buyers"
  | "blast buyers"
  | "auto email buyers"
  | "auto SMS buyers"
  | "launch buyer campaign"
  | "activate buyer outreach"
  | "queue buyer execution"
  | "execute disposition workflow"
  | "match and send automatically"
  | "autonomous buyer matching"
  | "autonomous buyer negotiation"
  | "approve and send"
  | "release automation"
  | "provider activation"
  | "campaign launch"
  | "AI closes deals automatically"
  | "AI negotiates automatically"
  | "auto assignment workflow"
  | "buyer communication execution"
  | "hidden execution affordances";

export type R62ReadonlyUiImplementationScopeWarningCode =
  | "r62c_readonly_ui_implementation_scope_contract_only"
  | "input_missing"
  | "r62b_ui_scope_audit_required"
  | "future_surface_review_required"
  | "read_only_data_review_required"
  | "display_section_review_required"
  | "priority_ordering_review_required"
  | "stale_deal_package_display_review_required"
  | "assignment_readiness_display_review_required"
  | "buyer_engagement_demand_mismatch_display_review_required"
  | "workload_priority_display_review_required"
  | "safe_copy_review_required"
  | "governance_boundary_review_required"
  | "accessibility_review_required"
  | "dangerous_patterns_review_required"
  | "operator_review_required"
  | "ui_implementation_rejected"
  | "dashboard_page_component_change_rejected"
  | "route_change_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "email_sms_sending_rejected"
  | "buyer_outreach_execution_rejected"
  | "buyer_communication_execution_rejected"
  | "campaign_launch_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "execution_control_rejected"
  | "redesign_rejected"
  | "autonomous_matching_rejected"
  | "autonomous_buyer_outreach_rejected"
  | "autonomous_negotiation_rejected"
  | "auto_assignment_workflow_rejected"
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

export type R62ReadonlyUiImplementationScopeInput = {
  r62bUiScopeAuditReviewed?: boolean;
  futureSurfacesReviewed?: boolean;
  readOnlyDataReviewed?: boolean;
  displaySectionsReviewed?: boolean;
  priorityOrderingReviewed?: boolean;
  staleDealPackageDisplayReviewed?: boolean;
  assignmentReadinessDisplayReviewed?: boolean;
  buyerEngagementDemandMismatchDisplayReviewed?: boolean;
  workloadPriorityDisplayReviewed?: boolean;
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
  buyerCommunicationExecutionRequested?: boolean;
  campaignLaunchRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  executionControlRequested?: boolean;
  redesignRequested?: boolean;
  autonomousMatchingRequested?: boolean;
  autonomousBuyerOutreachRequested?: boolean;
  autonomousNegotiationRequested?: boolean;
  autoAssignmentWorkflowRequested?: boolean;
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

export type R62ReadonlyUiImplementationScopeSafetyFlags = {
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

export type R62ReadonlyUiImplementationScopeResult = R62ReadonlyUiImplementationScopeSafetyFlags & {
  phase: "R62C";
  surface: "buyer_disposition_operational_intelligence_readonly_ui_implementation_scope";
  scopeStatus: R62BuyerDispositionOperationalReadonlyUiImplementationScopeStatus;
  allowedFutureUiSurface: R62AllowedFutureUiSurface;
  forbiddenUiSurfaces: R62ForbiddenUiSurface[];
  allowedReadOnlyOperationalDataConcepts: R62AllowedOperationalDisplayConcept[];
  allowedDisplaySections: R62AllowedOperationalDisplaySection[];
  priorityOrderingDisplayRules: R62OperationalPriorityOrderingRule[];
  staleDealPackageDisplayRules: string[];
  assignmentReadinessDisplayRules: string[];
  buyerEngagementDemandMismatchDisplayRules: string[];
  workloadPriorityDisplayRules: string[];
  dispositionBottleneckDisplayRules: string[];
  governanceStopFirstDisplayRules: string[];
  safeCopyRules: string[];
  forbiddenExecutionControls: R62ForbiddenExecutionControl[];
  accessibilityRules: string[];
  noExecutionBoundaries: string[];
  invariantAssertions: string[];
  rejectionReasons: string[];
  safetyFlags: R62ReadonlyUiImplementationScopeSafetyFlags;
  warningCodes: string[];
  operatorReviewRequired: boolean;
  scopeNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R62ReadonlyUiImplementationScopeInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R62ReadonlyUiImplementationScopeSafetyFlags = {
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

const allowedFutureUiSurface: R62AllowedFutureUiSurface = {
  surface: "existing_dashboard",
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx",
  futureComponentAllowed: "components/dashboard/buyer-disposition-operational-intelligence-summary.tsx",
  placement: "dashboard_read_only_revenue_operations_section",
  routeChangesAllowed: false,
  redesignAllowed: false,
  implementationAllowedNow: false,
};

const forbiddenUiSurfaces: R62ForbiddenUiSurface[] = [
  "new_buyer_outreach_console",
  "new_campaign_tab",
  "new_provider_twilio_console",
  "new_execution_queue",
  "new_automation_agent_panel",
  "new_send_approval_workflow_panel",
  "new_autonomous_matching_panel",
  "new_route_without_explicit_authorization",
];

const allowedReadOnlyOperationalDataConcepts: R62AllowedOperationalDisplayConcept[] = [
  {
    concept: "buyer_response_probability_review",
    displayBoundary: "May display probability review as advisory prioritization only; it cannot authorize contact.",
  },
  {
    concept: "buyer_engagement_quality_review",
    displayBoundary: "May display buyer engagement quality as a review label only; no buyer communication execution.",
  },
  {
    concept: "assignment_readiness_review",
    displayBoundary: "May display assignment-readiness review needed; high readiness does not mean send.",
  },
  {
    concept: "buyer_package_completeness_review",
    displayBoundary: "May display package completeness gaps without inventing property facts or releasing a package.",
  },
  {
    concept: "stale_buyer_package",
    displayBoundary: "May display stale buyer package visibility only; it cannot launch reactivation.",
  },
  {
    concept: "stale_deal_visibility",
    displayBoundary: "May display stale deal visibility for manual review only; no campaign or automation trigger.",
  },
  {
    concept: "buyer_demand_mismatch",
    displayBoundary: "May display buyer demand mismatch as advisory review; no autonomous buyer matching.",
  },
  {
    concept: "high_likelihood_assignment_review",
    displayBoundary: "May display high-likelihood assignment review only; high assignment probability does not mean send.",
  },
  {
    concept: "buyer_fit_review",
    displayBoundary: "May display buyer-fit review as manual review only; no buyer-ready-to-contact implication.",
  },
  {
    concept: "package_prep_priority",
    displayBoundary: "May display package-prep priority as operator guidance only; no package release.",
  },
  {
    concept: "disposition_bottleneck",
    displayBoundary: "May display bottlenecks as read-only blockers; no workflow mutation or task assignment.",
  },
  {
    concept: "blocked_disposition",
    displayBoundary: "May display blocked disposition as governance or completeness stop visibility only.",
  },
  {
    concept: "governance_stop_signals",
    displayBoundary: "Must render first and must be resolved before any advisory priority can matter.",
  },
  {
    concept: "buyer_activity_freshness_review",
    displayBoundary: "May display buyer activity freshness for review only; no automatic follow-up.",
  },
  {
    concept: "assignment_readiness_momentum_review",
    displayBoundary: "May display momentum review as advisory only; no execution queue.",
  },
  {
    concept: "manual_buyer_review_guidance",
    displayBoundary: "May display manual buyer-review guidance only.",
  },
  {
    concept: "operator_disposition_workflow_guidance",
    displayBoundary: "May display operator workflow guidance without controls, forms, or execution handlers.",
  },
  {
    concept: "revenue_priority_disposition_review",
    displayBoundary: "May display revenue-priority disposition review as advisory only.",
  },
  {
    concept: "disposition_workload_priority",
    displayBoundary: "May display workload priority as visibility only; it is not an execution queue.",
  },
  {
    concept: "high_value_disposition_review",
    displayBoundary: "May display high-value disposition review for manual operator prioritization.",
  },
  {
    concept: "assignment_risk_review",
    displayBoundary: "May display assignment-risk review as advisory risk visibility only.",
  },
];

const allowedDisplaySections: R62AllowedOperationalDisplaySection[] = [
  "governance_stop_signals",
  "revenue_priority_disposition_review",
  "high_likelihood_assignment_review",
  "assignment_readiness_review",
  "buyer_package_completeness_review",
  "stale_buyer_package",
  "stale_deal_visibility",
  "buyer_activity_freshness_review",
  "buyer_response_probability_review",
  "buyer_engagement_quality_review",
  "buyer_demand_mismatch",
  "buyer_fit_review",
  "package_prep_priority",
  "assignment_readiness_momentum_review",
  "assignment_risk_review",
  "disposition_bottleneck",
  "blocked_disposition",
  "disposition_workload_priority",
  "high_value_disposition_review",
  "manual_buyer_review_guidance",
  "operator_disposition_workflow_guidance",
];

const priorityOrderingDisplayRules: R62OperationalPriorityOrderingRule[] = allowedDisplaySections.map(
  (section, index) => ({
    order: index + 1,
    section,
    renderIntent:
      section === "governance_stop_signals"
        ? "Render governance stop signals before every buyer disposition operational label."
        : "Render as read-only operational intelligence for manual disposition review.",
    safeCopyRequired:
      section === "governance_stop_signals"
        ? "Governance stop signals must be resolved first"
        : "Disposition priority label is advisory only",
  }),
);

const staleDealPackageDisplayRules = [
  "Stale buyer package may appear only as read-only stale-package visibility.",
  "Stale deal visibility may appear only as manual disposition review guidance.",
  "Buyer package completeness review may show missing package facts without inventing property facts.",
  "Package-prep priority may identify preparation needs but cannot release, share, send, or activate a package.",
  "Review buyer context before taking action.",
];

const assignmentReadinessDisplayRules = [
  "Assignment-readiness review needed may appear as advisory status only.",
  "High-likelihood assignment review must remain manual operator guidance.",
  "Assignment-readiness momentum review cannot become an execution queue.",
  "Assignment-risk review must remain read-only risk visibility.",
  "High assignment probability does not mean send.",
];

const buyerEngagementDemandMismatchDisplayRules = [
  "Buyer response probability review may appear only as advisory probability visibility.",
  "Buyer engagement review needed may appear only as manual review guidance.",
  "Buyer engagement quality review does not authorize contact.",
  "Buyer demand mismatch may appear only as demand-alignment review visibility.",
  "Buyer-fit review remains manual only and cannot imply autonomous buyer matching.",
];

const workloadPriorityDisplayRules = [
  "Revenue-priority disposition review may appear only as advisory prioritization.",
  "Disposition workload priority may appear only as read-only workload visibility.",
  "High-value disposition review may appear only as manual review prioritization.",
  "Operator disposition workflow guidance cannot assign work, mutate tasks, poll, persist, or execute.",
  "Disposition priority label is advisory only.",
];

const dispositionBottleneckDisplayRules = [
  "Disposition bottleneck may show package, engagement, fit, demand mismatch, stale-deal, or governance blockers.",
  "Blocked disposition must remain a review-only stop signal.",
  "Bottleneck labels cannot assign work, mutate workflow state, queue execution, poll, or activate providers.",
];

const governanceStopFirstDisplayRules = [
  "Governance stop signals must render before all buyer disposition operational priority sections.",
  "Governance stop signals must be resolved first.",
  "Governance stop signals outrank revenue priority, buyer readiness, package completeness, engagement quality, demand match, stale-deal urgency, workload priority, and assignment momentum.",
  "Governance stop visibility cannot override consent, compliance, review, or do-not-contact boundaries.",
];

const safeCopyRules = [
  "Manual disposition review recommended",
  "Disposition priority label is advisory only",
  "Review buyer context before taking action",
  "Assignment-readiness review needed",
  "Buyer engagement review needed",
  "Package-prep priority",
  "Governance stop signals must be resolved first",
  "High assignment probability does not mean send",
];

const forbiddenExecutionControls: R62ForbiddenExecutionControl[] = [
  "send to buyers",
  "blast buyers",
  "auto email buyers",
  "auto SMS buyers",
  "launch buyer campaign",
  "activate buyer outreach",
  "queue buyer execution",
  "execute disposition workflow",
  "match and send automatically",
  "autonomous buyer matching",
  "autonomous buyer negotiation",
  "approve and send",
  "release automation",
  "provider activation",
  "campaign launch",
  "AI closes deals automatically",
  "AI negotiates automatically",
  "auto assignment workflow",
  "buyer communication execution",
  "hidden execution affordances",
];

const accessibilityRules = [
  "Use one semantic region with a stable heading for the future buyer disposition operational intelligence summary.",
  "Use semantic headings for each read-only operational priority section.",
  "Use readable labels for stale packages, stale deals, assignment readiness, buyer engagement, demand mismatch, package prep, workload priority, bottlenecks, blocked disposition, and governance states.",
  "Status meaning must be text-based and never depend on color alone.",
  "Do not move focus, require motion, auto-refresh, poll, or depend on live update announcements.",
  "Use concise screen-reader-friendly summaries for priority, readiness, engagement, mismatch, bottleneck, and governance groups.",
  "Keep reading order predictable with governance stop signals before advisory operational guidance.",
];

const noExecutionBoundaries = [
  "No UI implementation, dashboard page change, component change, redesign, route, fetch, server action, provider import, automation-agent import, Prisma change, migration, persistence, polling, runtime activation, or execution handler is authorized in R62C.",
  "No email, SMS, buyer outreach, buyer blast, campaign launch, provider activation, buyer communication execution, autonomous matching, autonomous negotiation, approval execution, or auto assignment workflow is allowed.",
  "No buttons, links, toggles, menus, forms, controls, or hidden execution affordances may be introduced by this scope contract.",
  "Existing dashboard placement only may be used later, and only after explicit R62D authorization.",
  "Approval, review, high-likelihood, buyer-ready, workload priority, and assignment-readiness wording must never imply permission to send, share, blast, contact, negotiate, queue execution, launch campaigns, or activate providers.",
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
  "Governance stop signals must render first.",
  "High assignment probability does not mean send.",
  "No hidden execution state or execution affordance is allowed.",
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

function addWarning(
  warningCodes: string[],
  warningCode: R62ReadonlyUiImplementationScopeWarningCode,
) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R62ReadonlyUiImplementationScopeInput) {
  return (
    input.uiImplementationRequested === true ||
    input.dashboardPageComponentChangeRequested === true ||
    input.routeChangeRequested === true ||
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.emailSmsSendingRequested === true ||
    input.buyerOutreachExecutionRequested === true ||
    input.buyerCommunicationExecutionRequested === true ||
    input.campaignLaunchRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.executionControlRequested === true ||
    input.redesignRequested === true ||
    input.autonomousMatchingRequested === true ||
    input.autonomousBuyerOutreachRequested === true ||
    input.autonomousNegotiationRequested === true ||
    input.autoAssignmentWorkflowRequested === true ||
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

export function assertR62BuyerDispositionOperationalReadonlyUiImplementationScopeInvariants(
  result: Pick<
    R62ReadonlyUiImplementationScopeResult,
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
): R62ReadonlyUiImplementationScopeInvariantCheck {
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

export function summarizeR62BuyerDispositionOperationalReadonlyUiImplementationScope(
  result: R62ReadonlyUiImplementationScopeResult,
) {
  const invariantCheck = assertR62BuyerDispositionOperationalReadonlyUiImplementationScopeInvariants(result);

  return boundSummary(
    `R62C ${result.surface} status is ${result.scopeStatus}. ` +
      `${result.allowedReadOnlyOperationalDataConcepts.length} read-only operational concepts and ${result.allowedDisplaySections.length} future display sections are scoped for existing dashboard placement only. ` +
      `${result.forbiddenUiSurfaces.length} UI surfaces and ${result.forbiddenExecutionControls.length} execution controls are forbidden. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract cannot authorize UI implementation, dashboard changes, redesign, routes, providers, Twilio, automation-agent usage, Prisma changes, email, SMS, buyer communication, buyer outreach, campaigns, persistence, polling, execution controls, approval execution, autonomous matching, autonomous outreach, autonomous negotiation, hidden execution affordances, auto assignment workflows, or runtime activation.",
  );
}

export function createR62BuyerDispositionOperationalReadonlyUiImplementationScopeContract(
  input: R62ReadonlyUiImplementationScopeInput = {},
): R62ReadonlyUiImplementationScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r62c_readonly_ui_implementation_scope_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r62bUiScopeAuditReviewed !== true) addWarning(warningCodes, "r62b_ui_scope_audit_required");
  if (input.futureSurfacesReviewed !== true) addWarning(warningCodes, "future_surface_review_required");
  if (input.readOnlyDataReviewed !== true) addWarning(warningCodes, "read_only_data_review_required");
  if (input.displaySectionsReviewed !== true) addWarning(warningCodes, "display_section_review_required");
  if (input.priorityOrderingReviewed !== true) addWarning(warningCodes, "priority_ordering_review_required");
  if (input.staleDealPackageDisplayReviewed !== true) {
    addWarning(warningCodes, "stale_deal_package_display_review_required");
  }
  if (input.assignmentReadinessDisplayReviewed !== true) {
    addWarning(warningCodes, "assignment_readiness_display_review_required");
  }
  if (input.buyerEngagementDemandMismatchDisplayReviewed !== true) {
    addWarning(warningCodes, "buyer_engagement_demand_mismatch_display_review_required");
  }
  if (input.workloadPriorityDisplayReviewed !== true) {
    addWarning(warningCodes, "workload_priority_display_review_required");
  }
  if (input.safeCopyReviewed !== true) addWarning(warningCodes, "safe_copy_review_required");
  if (input.governanceBoundaryReviewed !== true) addWarning(warningCodes, "governance_boundary_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.dangerousPatternsReviewed !== true) addWarning(warningCodes, "dangerous_patterns_review_required");
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
  if (input.buyerCommunicationExecutionRequested === true) {
    addWarning(warningCodes, "buyer_communication_execution_rejected");
  }
  if (input.campaignLaunchRequested === true) addWarning(warningCodes, "campaign_launch_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.executionControlRequested === true) addWarning(warningCodes, "execution_control_rejected");
  if (input.redesignRequested === true) addWarning(warningCodes, "redesign_rejected");
  if (input.autonomousMatchingRequested === true) addWarning(warningCodes, "autonomous_matching_rejected");
  if (input.autonomousBuyerOutreachRequested === true) addWarning(warningCodes, "autonomous_buyer_outreach_rejected");
  if (input.autonomousNegotiationRequested === true) addWarning(warningCodes, "autonomous_negotiation_rejected");
  if (input.autoAssignmentWorkflowRequested === true) addWarning(warningCodes, "auto_assignment_workflow_rejected");
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
    input.r62bUiScopeAuditReviewed !== true ||
    input.futureSurfacesReviewed !== true ||
    input.readOnlyDataReviewed !== true ||
    input.displaySectionsReviewed !== true ||
    input.priorityOrderingReviewed !== true ||
    input.staleDealPackageDisplayReviewed !== true ||
    input.assignmentReadinessDisplayReviewed !== true ||
    input.buyerEngagementDemandMismatchDisplayReviewed !== true ||
    input.workloadPriorityDisplayReviewed !== true ||
    input.safeCopyReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R62BuyerDispositionOperationalReadonlyUiImplementationScopeStatus = hasForbiddenRequest(input)
    ? "implementation_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "read_only_ui_implementation_scope_ready";
  const result: R62ReadonlyUiImplementationScopeResult = {
    phase: "R62C",
    surface: "buyer_disposition_operational_intelligence_readonly_ui_implementation_scope",
    scopeStatus,
    allowedFutureUiSurface,
    forbiddenUiSurfaces,
    allowedReadOnlyOperationalDataConcepts,
    allowedDisplaySections,
    priorityOrderingDisplayRules,
    staleDealPackageDisplayRules,
    assignmentReadinessDisplayRules,
    buyerEngagementDemandMismatchDisplayRules,
    workloadPriorityDisplayRules,
    dispositionBottleneckDisplayRules,
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
    nextSuggestedPhase: "R62D - Buyer Disposition Operational Intelligence Read-Only UI Implementation",
    summary: "R62C buyer disposition operational intelligence read-only UI implementation scope contract only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR62BuyerDispositionOperationalReadonlyUiImplementationScope(result) };
}
