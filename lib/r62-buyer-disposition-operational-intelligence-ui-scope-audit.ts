export type R62BuyerDispositionOperationalUiScopeStatus =
  | "ui_scope_blocked"
  | "operator_review_required"
  | "ui_scope_ready_for_later_implementation";

export type R62BuyerDispositionOperationalAllowedUiSection =
  | "governance_stop_visibility"
  | "revenue_priority_disposition_review"
  | "high_likelihood_assignment_review"
  | "assignment_readiness_review"
  | "buyer_package_completeness_review"
  | "buyer_response_probability_review"
  | "buyer_engagement_quality_review"
  | "buyer_activity_freshness_review"
  | "buyer_demand_mismatch_visibility"
  | "stale_package_detection"
  | "stale_deal_visibility"
  | "assignment_readiness_momentum_review"
  | "buyer_ready_urgency_review"
  | "assignment_risk_review"
  | "disposition_bottleneck_visibility"
  | "blocked_disposition_visibility"
  | "disposition_pipeline_stagnation_review"
  | "disposition_workload_prioritization"
  | "high_value_disposition_queue_review"
  | "manual_buyer_review_guidance";

export type R62BuyerDispositionOperationalVisibilityConcept = {
  order: number;
  section: R62BuyerDispositionOperationalAllowedUiSection;
  intent: string;
  revenuePriorityReason: string;
  safeCopyRequired: string;
};

export type R62BuyerDispositionOperationalForbiddenUiControl =
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
  | "autonomous outreach"
  | "approve and send"
  | "release automation"
  | "provider activation"
  | "campaign launch"
  | "auto assignment workflow"
  | "buyer communication execution"
  | "hidden execution affordances";

export type R62BuyerDispositionOperationalUiWarningCode =
  | "r62b_buyer_disposition_operational_ui_scope_audit_only"
  | "input_missing"
  | "r62a_scope_review_required"
  | "ui_surface_review_required"
  | "visibility_concept_review_required"
  | "stale_deal_visibility_review_required"
  | "assignment_readiness_visibility_review_required"
  | "buyer_engagement_visibility_review_required"
  | "bottleneck_visibility_review_required"
  | "workload_priority_visibility_review_required"
  | "wording_review_required"
  | "governance_boundary_review_required"
  | "accessibility_review_required"
  | "dangerous_patterns_review_required"
  | "operator_review_required"
  | "ui_implementation_rejected"
  | "dashboard_change_rejected"
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

export type R62BuyerDispositionOperationalUiScopeAuditInput = {
  r62aScopeReviewed?: boolean;
  uiSurfaceReviewed?: boolean;
  visibilityConceptsReviewed?: boolean;
  staleDealVisibilityReviewed?: boolean;
  assignmentReadinessVisibilityReviewed?: boolean;
  buyerEngagementVisibilityReviewed?: boolean;
  bottleneckVisibilityReviewed?: boolean;
  workloadPriorityVisibilityReviewed?: boolean;
  wordingReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  dangerousPatternsReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiImplementationRequested?: boolean;
  dashboardChangeRequested?: boolean;
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
  extraAuditNotes?: string[];
};

export type R62BuyerDispositionOperationalUiSafetyFlags = {
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

export type R62BuyerDispositionOperationalUiImplementationBoundary = {
  candidateSurface: "dashboard_buyer_disposition_operational_intelligence";
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx";
  futureComponentAllowed: "components/dashboard/buyer-disposition-operational-intelligence-summary.tsx";
  noUiImplementationNow: true;
  noDashboardChangesNow: true;
  noNewRoutes: true;
  noPolling: true;
  noPersistence: true;
  noProviderControls: true;
  noEmailSmsControls: true;
  noBuyerOutreachControls: true;
  noExecutionControls: true;
  noAutomationAgent: true;
  noApprovalBehaviorChanges: true;
  noRedesign: true;
  noAutonomousMatchingOutreachOrNegotiation: true;
  noHiddenExecutionAffordances: true;
  useExistingReadOnlyDashboardSignalsOnlyLater: true;
  futureImplementationRequiresExplicitAuthorization: true;
};

export type R62BuyerDispositionOperationalUiScopeAuditResult =
  R62BuyerDispositionOperationalUiSafetyFlags & {
    phase: "R62B";
    surface: "buyer_disposition_operational_intelligence_ui";
    scopeStatus: R62BuyerDispositionOperationalUiScopeStatus;
    allowedFutureUiSections: R62BuyerDispositionOperationalAllowedUiSection[];
    operationalVisibilityConcepts: R62BuyerDispositionOperationalVisibilityConcept[];
    staleDealVisibilityWording: string[];
    assignmentReadinessVisibilityWording: string[];
    buyerEngagementVisibilityWording: string[];
    bottleneckVisibilityWording: string[];
    workloadPriorityVisibilityWording: string[];
    governanceStopVisibilityWording: string[];
    safeOperatorGuidanceWording: string[];
    forbiddenControlsButtonsActions: R62BuyerDispositionOperationalForbiddenUiControl[];
    dangerousLanguagePatterns: string[];
    accessibilityExpectations: string[];
    noActionExecutionBoundaries: string[];
    invariantAssertions: string[];
    implementationBoundaries: R62BuyerDispositionOperationalUiImplementationBoundary;
    rejectionReasons: string[];
    safetyFlags: R62BuyerDispositionOperationalUiSafetyFlags;
    warningCodes: string[];
    operatorReviewRequired: boolean;
    auditNotes: string[];
    nextSuggestedPhase: string;
    summary: string;
  };

export type R62BuyerDispositionOperationalUiInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 50;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R62BuyerDispositionOperationalUiSafetyFlags = {
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

const allowedFutureUiSections: R62BuyerDispositionOperationalAllowedUiSection[] = [
  "governance_stop_visibility",
  "revenue_priority_disposition_review",
  "high_likelihood_assignment_review",
  "assignment_readiness_review",
  "buyer_package_completeness_review",
  "buyer_response_probability_review",
  "buyer_engagement_quality_review",
  "buyer_activity_freshness_review",
  "buyer_demand_mismatch_visibility",
  "stale_package_detection",
  "stale_deal_visibility",
  "assignment_readiness_momentum_review",
  "buyer_ready_urgency_review",
  "assignment_risk_review",
  "disposition_bottleneck_visibility",
  "blocked_disposition_visibility",
  "disposition_pipeline_stagnation_review",
  "disposition_workload_prioritization",
  "high_value_disposition_queue_review",
  "manual_buyer_review_guidance",
];

const operationalVisibilityConcepts: R62BuyerDispositionOperationalVisibilityConcept[] = [
  {
    order: 1,
    section: "governance_stop_visibility",
    intent: "Show governance stop visibility before every buyer disposition operational signal.",
    revenuePriorityReason: "Governance stops can invalidate any buyer-side revenue priority and prevent unsafe escalation.",
    safeCopyRequired: "Governance stop signals must be resolved first.",
  },
  {
    order: 2,
    section: "revenue_priority_disposition_review",
    intent: "Show manual disposition opportunities most likely to produce assignment revenue fastest.",
    revenuePriorityReason: "Revenue-priority disposition review helps operators focus high-ROI manual work.",
    safeCopyRequired: "Revenue-priority disposition review is advisory only.",
  },
  {
    order: 3,
    section: "high_likelihood_assignment_review",
    intent: "Show deals with strong package, buyer-fit, and demand indicators for manual review.",
    revenuePriorityReason: "High-likelihood assignment review can reduce time to assignment when reviewed safely.",
    safeCopyRequired: "High-likelihood assignment review is not a send instruction.",
  },
  {
    order: 4,
    section: "assignment_readiness_review",
    intent: "Show readiness gaps around package, title, strategy, and buyer demand.",
    revenuePriorityReason: "Assignment-readiness review exposes blockers that slow revenue conversion.",
    safeCopyRequired: "Assignment readiness is manual review only.",
  },
  {
    order: 5,
    section: "buyer_package_completeness_review",
    intent: "Show package completeness gaps that block disposition review.",
    revenuePriorityReason: "Incomplete package data can hide revenue leakage and reduce buyer-fit confidence.",
    safeCopyRequired: "Complete buyer package gaps manually.",
  },
  {
    order: 6,
    section: "buyer_response_probability_review",
    intent: "Show response-probability review labels from existing evidence only.",
    revenuePriorityReason: "Response probability can focus human attention without executing buyer communication.",
    safeCopyRequired: "Buyer response probability review is advisory only.",
  },
  {
    order: 7,
    section: "buyer_engagement_quality_review",
    intent: "Show buyer engagement quality labels for manual review.",
    revenuePriorityReason: "Engagement quality helps distinguish strong demand from weak or stale evidence.",
    safeCopyRequired: "Buyer engagement quality review does not authorize contact.",
  },
  {
    order: 8,
    section: "buyer_activity_freshness_review",
    intent: "Show buyer activity freshness without polling or auto-refresh.",
    revenuePriorityReason: "Freshness can improve confidence while stale activity signals caution.",
    safeCopyRequired: "Buyer activity freshness is review context only.",
  },
  {
    order: 9,
    section: "buyer_demand_mismatch_visibility",
    intent: "Show mismatch between deal context and current buyer demand assumptions.",
    revenuePriorityReason: "Demand mismatch visibility prevents misplaced disposition effort.",
    safeCopyRequired: "Buyer demand mismatch visibility is advisory only.",
  },
  {
    order: 10,
    section: "stale_package_detection",
    intent: "Show stale package-prep signals for manual triage.",
    revenuePriorityReason: "Stale packages can leak assignment revenue when package progress stalls.",
    safeCopyRequired: "Stale package detection is manual review only.",
  },
  {
    order: 11,
    section: "stale_deal_visibility",
    intent: "Show stale deal visibility for manual recovery review.",
    revenuePriorityReason: "Stale deal visibility helps recover assignment opportunities before momentum decays.",
    safeCopyRequired: "Stale deal visibility does not launch reactivation.",
  },
  {
    order: 12,
    section: "assignment_readiness_momentum_review",
    intent: "Show whether assignment readiness appears to be moving toward or away from revenue.",
    revenuePriorityReason: "Momentum review helps operators focus stuck or improving disposition work.",
    safeCopyRequired: "Assignment momentum is advisory only.",
  },
  {
    order: 13,
    section: "buyer_ready_urgency_review",
    intent: "Show urgency labels only after governance and readiness review.",
    revenuePriorityReason: "Urgency can improve manual sequencing but cannot override safety.",
    safeCopyRequired: "Buyer-ready urgency never authorizes buyer contact.",
  },
  {
    order: 14,
    section: "assignment_risk_review",
    intent: "Show risks around title, package, fit, stale status, and governance.",
    revenuePriorityReason: "Assignment-risk review prevents unsafe or low-confidence disposition work.",
    safeCopyRequired: "Assignment risk requires manual review.",
  },
  {
    order: 15,
    section: "disposition_bottleneck_visibility",
    intent: "Show package, fit, data, review, or process friction.",
    revenuePriorityReason: "Bottleneck visibility helps operators remove manual blockers.",
    safeCopyRequired: "Disposition bottleneck visibility is review-only.",
  },
  {
    order: 16,
    section: "blocked_disposition_visibility",
    intent: "Show blocked disposition states requiring human review.",
    revenuePriorityReason: "Blocked disposition can reveal governance or package issues that stop revenue movement.",
    safeCopyRequired: "Blocked disposition cannot approve buyer-facing action.",
  },
  {
    order: 17,
    section: "disposition_pipeline_stagnation_review",
    intent: "Show buyer-side workflow stagnation without starting workflow activity.",
    revenuePriorityReason: "Pipeline stagnation review highlights where disposition throughput is stalled.",
    safeCopyRequired: "Pipeline stagnation review is advisory only.",
  },
  {
    order: 18,
    section: "disposition_workload_prioritization",
    intent: "Show manual workload priority without assigning or mutating work.",
    revenuePriorityReason: "Workload prioritization helps decide which manual reviews should happen first.",
    safeCopyRequired: "Disposition workload priority is not an execution queue.",
  },
  {
    order: 19,
    section: "high_value_disposition_queue_review",
    intent: "Show high-value disposition queue review as read-only visibility.",
    revenuePriorityReason: "High-value queue review groups manual opportunities with strong revenue-throughput signals.",
    safeCopyRequired: "High-value disposition queue review is visibility only.",
  },
  {
    order: 20,
    section: "manual_buyer_review_guidance",
    intent: "Show concise manual buyer-review guidance.",
    revenuePriorityReason: "Safe guidance improves throughput while keeping humans in control.",
    safeCopyRequired: "Manual buyer-review guidance only.",
  },
];

const staleDealVisibilityWording = [
  "Stale package detection.",
  "Stale deal visibility.",
  "Buyer activity freshness review.",
  "Disposition pipeline stagnation review.",
  "Manual stale-deal recovery review only.",
  "Stale deal visibility does not launch reactivation.",
];

const assignmentReadinessVisibilityWording = [
  "Assignment readiness review.",
  "High-likelihood assignment review.",
  "Assignment-readiness momentum review.",
  "Assignment-risk review.",
  "Manual assignment review only.",
  "Buyer-ready does not mean send.",
];

const buyerEngagementVisibilityWording = [
  "Buyer response probability review.",
  "Buyer engagement quality review.",
  "Buyer activity freshness review.",
  "Buyer demand mismatch visibility.",
  "Buyer-fit review is manual only.",
  "Buyer engagement labels do not authorize contact.",
];

const bottleneckVisibilityWording = [
  "Disposition bottleneck visibility.",
  "Blocked disposition visibility.",
  "Buyer package completeness review.",
  "Package-prep priority.",
  "Bottleneck labels cannot assign work, mutate workflow state, queue execution, poll, or activate providers.",
];

const workloadPriorityVisibilityWording = [
  "Revenue-priority disposition review.",
  "Disposition workload prioritization.",
  "High-value disposition queue review.",
  "Queue review means operator visibility only.",
  "Disposition workload priority is not an execution queue.",
];

const governanceStopVisibilityWording = [
  "Governance stop signals must be resolved first.",
  "Governance stop visibility outranks urgency, buyer readiness, package completeness, buyer-fit, stale-deal urgency, and assignment momentum.",
  "Governance stop visibility cannot override consent, compliance, review, or do-not-contact boundaries.",
];

const safeOperatorGuidanceWording = [
  "Manual buyer-review guidance only",
  "Revenue-priority disposition review is advisory only",
  "High-likelihood assignment review is not a send instruction",
  "Assignment readiness is manual review only",
  "Buyer engagement quality review does not authorize contact",
  "Stale deal visibility does not launch reactivation",
  "Disposition workload priority is not an execution queue",
  "Buyer-ready does not mean send",
];

const forbiddenControlsButtonsActions: R62BuyerDispositionOperationalForbiddenUiControl[] = [
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
  "autonomous outreach",
  "approve and send",
  "release automation",
  "provider activation",
  "campaign launch",
  "auto assignment workflow",
  "buyer communication execution",
  "hidden execution affordances",
];

const dangerousLanguagePatterns = [
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
  "autonomous outreach",
  "approve and send",
  "release automation",
  "provider activation",
  "campaign launch",
  "AI closes deals automatically",
  "AI negotiates automatically",
  "auto assignment workflow",
  "buyer communication execution",
  "send-ready",
  "buyer-ready-to-contact",
  "reactivate buyers automatically",
];

const accessibilityExpectations = [
  "Use semantic headings for the future buyer disposition operational intelligence region and each section.",
  "Use readable labels for stale deals, assignment readiness, buyer engagement, package completeness, demand mismatch, bottlenecks, blocked disposition, workload priority, and governance states.",
  "Status meaning must be text-based and never depend on color alone.",
  "Do not rely on motion, focus movement, auto-refresh, polling, or live-update noise.",
  "Use concise wording and screen-reader-friendly summaries for buyer disposition operational groups.",
  "Keep governance stop states visually and textually before advisory operational guidance.",
];

const noActionExecutionBoundaries = [
  "No buttons, links, toggles, menus, forms, or controls may trigger buyer outreach, email, SMS, campaigns, provider activation, approval execution, package release, persistence, polling, route changes, autonomous matching, autonomous negotiation, or workflow mutation.",
  "Future UI may display only already-available read-only dashboard signals and explicitly authorized derived labels.",
  "Revenue priority, high-likelihood assignment, response probability, engagement quality, freshness, stale-deal, bottleneck, queue review, and workload priority wording must remain labels or guidance only.",
  "Approval, review, buyer-ready, high-likelihood, assignment-readiness, and queue language must never imply permission to send, share, blast, contact, negotiate, queue execution, launch campaigns, or activate providers.",
  "No hidden execution affordances, background work, server actions, provider imports, automation-agent imports, autonomous buyer matching, autonomous buyer outreach, autonomous negotiation, campaign launch, or auto assignment controls are allowed.",
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
  "Governance stop visibility must appear before every operational visibility section.",
  "Buyer-ready does not mean send.",
  "No hidden execution affordances are allowed.",
];

const implementationBoundaries: R62BuyerDispositionOperationalUiImplementationBoundary = {
  candidateSurface: "dashboard_buyer_disposition_operational_intelligence",
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx",
  futureComponentAllowed: "components/dashboard/buyer-disposition-operational-intelligence-summary.tsx",
  noUiImplementationNow: true,
  noDashboardChangesNow: true,
  noNewRoutes: true,
  noPolling: true,
  noPersistence: true,
  noProviderControls: true,
  noEmailSmsControls: true,
  noBuyerOutreachControls: true,
  noExecutionControls: true,
  noAutomationAgent: true,
  noApprovalBehaviorChanges: true,
  noRedesign: true,
  noAutonomousMatchingOutreachOrNegotiation: true,
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

function addWarning(warningCodes: string[], warningCode: R62BuyerDispositionOperationalUiWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R62BuyerDispositionOperationalUiScopeAuditInput) {
  return (
    input.uiImplementationRequested === true ||
    input.dashboardChangeRequested === true ||
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

export function assertR62BuyerDispositionOperationalUiScopeInvariants(
  result: Pick<
    R62BuyerDispositionOperationalUiScopeAuditResult,
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
): R62BuyerDispositionOperationalUiInvariantCheck {
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

export function summarizeR62BuyerDispositionOperationalUiScopeAudit(
  result: R62BuyerDispositionOperationalUiScopeAuditResult,
) {
  const invariantCheck = assertR62BuyerDispositionOperationalUiScopeInvariants(result);

  return boundSummary(
    `R62B ${result.surface} status is ${result.scopeStatus}. ` +
      `${result.allowedFutureUiSections.length} future UI sections and ${result.operationalVisibilityConcepts.length} visibility concepts are scoped. ` +
      `${result.forbiddenControlsButtonsActions.length} controls, buttons, or action semantics are forbidden. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This audit cannot authorize UI implementation, dashboard changes, redesign, routes, providers, Twilio, automation-agent usage, Prisma changes, email, SMS, buyer communication, buyer outreach, persistence, polling, execution controls, approval execution, autonomous matching, autonomous outreach, autonomous negotiation, hidden execution affordances, package release, auto assignment workflows, or runtime activation.",
  );
}

export function createR62BuyerDispositionOperationalUiScopeAudit(
  input: R62BuyerDispositionOperationalUiScopeAuditInput = {},
): R62BuyerDispositionOperationalUiScopeAuditResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const auditNotes = collectNotes(input.extraAuditNotes);

  addWarning(warningCodes, "r62b_buyer_disposition_operational_ui_scope_audit_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r62aScopeReviewed !== true) addWarning(warningCodes, "r62a_scope_review_required");
  if (input.uiSurfaceReviewed !== true) addWarning(warningCodes, "ui_surface_review_required");
  if (input.visibilityConceptsReviewed !== true) addWarning(warningCodes, "visibility_concept_review_required");
  if (input.staleDealVisibilityReviewed !== true) {
    addWarning(warningCodes, "stale_deal_visibility_review_required");
  }
  if (input.assignmentReadinessVisibilityReviewed !== true) {
    addWarning(warningCodes, "assignment_readiness_visibility_review_required");
  }
  if (input.buyerEngagementVisibilityReviewed !== true) {
    addWarning(warningCodes, "buyer_engagement_visibility_review_required");
  }
  if (input.bottleneckVisibilityReviewed !== true) addWarning(warningCodes, "bottleneck_visibility_review_required");
  if (input.workloadPriorityVisibilityReviewed !== true) {
    addWarning(warningCodes, "workload_priority_visibility_review_required");
  }
  if (input.wordingReviewed !== true) addWarning(warningCodes, "wording_review_required");
  if (input.governanceBoundaryReviewed !== true) addWarning(warningCodes, "governance_boundary_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.dangerousPatternsReviewed !== true) addWarning(warningCodes, "dangerous_patterns_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.uiImplementationRequested === true) addWarning(warningCodes, "ui_implementation_rejected");
  if (input.dashboardChangeRequested === true) addWarning(warningCodes, "dashboard_change_rejected");
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
  if (input.autonomousBuyerOutreachRequested === true) {
    addWarning(warningCodes, "autonomous_buyer_outreach_rejected");
  }
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
    input.r62aScopeReviewed !== true ||
    input.uiSurfaceReviewed !== true ||
    input.visibilityConceptsReviewed !== true ||
    input.staleDealVisibilityReviewed !== true ||
    input.assignmentReadinessVisibilityReviewed !== true ||
    input.buyerEngagementVisibilityReviewed !== true ||
    input.bottleneckVisibilityReviewed !== true ||
    input.workloadPriorityVisibilityReviewed !== true ||
    input.wordingReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R62BuyerDispositionOperationalUiScopeStatus = hasForbiddenRequest(input)
    ? "ui_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "ui_scope_ready_for_later_implementation";
  const result: R62BuyerDispositionOperationalUiScopeAuditResult = {
    phase: "R62B",
    surface: "buyer_disposition_operational_intelligence_ui",
    scopeStatus,
    allowedFutureUiSections,
    operationalVisibilityConcepts,
    staleDealVisibilityWording,
    assignmentReadinessVisibilityWording,
    buyerEngagementVisibilityWording,
    bottleneckVisibilityWording,
    workloadPriorityVisibilityWording,
    governanceStopVisibilityWording,
    safeOperatorGuidanceWording,
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
    nextSuggestedPhase: "R62C - Buyer Disposition Operational Intelligence Read-Only UI Implementation Scope Contract",
    summary: "R62B buyer disposition operational intelligence UI scope audit only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR62BuyerDispositionOperationalUiScopeAudit(result) };
}
