export type R60AcquisitionDailyCallPriorityUiScopeStatus =
  | "ui_scope_blocked"
  | "operator_review_required"
  | "ui_scope_ready_for_later_implementation";

export type R60AcquisitionDailyCallPriorityAllowedUiSection =
  | "daily_seller_call_priorities"
  | "highest_priority_seller_review"
  | "governance_stop_signals"
  | "seller_urgency_review"
  | "seller_momentum_risk"
  | "overdue_seller_follow_up"
  | "lead_decay_risk"
  | "high_motivation_seller_review"
  | "missing_acquisition_data"
  | "acquisition_bottlenecks"
  | "manual_call_review_guidance"
  | "safe_operator_review_guidance";

export type R60AcquisitionDailyCallPriorityVisibilityConcept = {
  order: number;
  section: R60AcquisitionDailyCallPriorityAllowedUiSection;
  intent: string;
  revenuePriorityReason: string;
  safeCopyRequired: string;
};

export type R60AcquisitionDailyCallPriorityForbiddenUiControl =
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

export type R60AcquisitionDailyCallPriorityUiWarningCode =
  | "r60b_acquisition_daily_call_priority_ui_scope_audit_only"
  | "input_missing"
  | "r60a_scope_review_required"
  | "ui_surface_review_required"
  | "visibility_concept_review_required"
  | "urgency_visibility_review_required"
  | "lead_decay_visibility_review_required"
  | "seller_momentum_visibility_review_required"
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

export type R60AcquisitionDailyCallPriorityUiScopeAuditInput = {
  r60aScopeReviewed?: boolean;
  uiSurfaceReviewed?: boolean;
  visibilityConceptsReviewed?: boolean;
  urgencyVisibilityReviewed?: boolean;
  leadDecayVisibilityReviewed?: boolean;
  sellerMomentumVisibilityReviewed?: boolean;
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
  extraAuditNotes?: string[];
};

export type R60AcquisitionDailyCallPriorityUiSafetyFlags = {
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

export type R60AcquisitionDailyCallPriorityUiImplementationBoundary = {
  candidateSurface: "dashboard_acquisition_daily_call_priority_intelligence";
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx";
  noUiImplementationNow: true;
  noNewRoutes: true;
  noPolling: true;
  noPersistence: true;
  noProviderControls: true;
  noCallControls: true;
  noDialerControls: true;
  noCampaignControls: true;
  noExecutionControls: true;
  noAutomationAgent: true;
  noApprovalBehaviorChanges: true;
  noRedesign: true;
  noAutonomousNegotiationOrOutreach: true;
  noHiddenExecutionAffordances: true;
  useExistingReadOnlyDashboardSignalsOnlyLater: true;
  futureImplementationRequiresExplicitAuthorization: true;
};

export type R60AcquisitionDailyCallPriorityUiScopeAuditResult = R60AcquisitionDailyCallPriorityUiSafetyFlags & {
  phase: "R60B";
  surface: "acquisition_daily_call_priority_intelligence_ui";
  scopeStatus: R60AcquisitionDailyCallPriorityUiScopeStatus;
  allowedFutureUiSections: R60AcquisitionDailyCallPriorityAllowedUiSection[];
  sellerCallPriorityVisibilityConcepts: R60AcquisitionDailyCallPriorityVisibilityConcept[];
  urgencyVisibilityWording: string[];
  leadDecayWording: string[];
  sellerMomentumWording: string[];
  overdueFollowUpWording: string[];
  acquisitionBottleneckWording: string[];
  manualReviewWording: string[];
  safeOperatorGuidanceWording: string[];
  forbiddenControlsButtonsActions: R60AcquisitionDailyCallPriorityForbiddenUiControl[];
  dangerousLanguagePatterns: string[];
  accessibilityExpectations: string[];
  noActionExecutionBoundaries: string[];
  invariantAssertions: string[];
  implementationBoundaries: R60AcquisitionDailyCallPriorityUiImplementationBoundary;
  rejectionReasons: string[];
  safetyFlags: R60AcquisitionDailyCallPriorityUiSafetyFlags;
  warningCodes: string[];
  operatorReviewRequired: boolean;
  auditNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R60AcquisitionDailyCallPriorityUiInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R60AcquisitionDailyCallPriorityUiSafetyFlags = {
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

const allowedFutureUiSections: R60AcquisitionDailyCallPriorityAllowedUiSection[] = [
  "daily_seller_call_priorities",
  "highest_priority_seller_review",
  "governance_stop_signals",
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

const sellerCallPriorityVisibilityConcepts: R60AcquisitionDailyCallPriorityVisibilityConcept[] = [
  {
    order: 1,
    section: "governance_stop_signals",
    intent: "Show stop-and-review states before any seller call priority guidance.",
    revenuePriorityReason: "Governance stops can block seller contact review and protect the platform from unsafe outreach drift.",
    safeCopyRequired: "Governance stop signals require manual review and do not grant call, text, email, dialer, or campaign permission.",
  },
  {
    order: 2,
    section: "highest_priority_seller_review",
    intent: "Show the highest-priority seller records for operator review.",
    revenuePriorityReason: "High-probability seller opportunities can create near-term acquisition revenue when reviewed manually.",
    safeCopyRequired: "Highest-priority seller review is advisory only and cannot trigger calls, dialing, messages, or providers.",
  },
  {
    order: 3,
    section: "daily_seller_call_priorities",
    intent: "Group daily seller call priorities into scannable manual review labels.",
    revenuePriorityReason: "Daily seller focus reduces acquisition drift without creating outbound execution.",
    safeCopyRequired: "Call priority labels are informational and cannot call, send, queue, launch, or activate workflows.",
  },
  {
    order: 4,
    section: "seller_urgency_review",
    intent: "Show seller urgency assumptions from existing seller-provided context.",
    revenuePriorityReason: "Urgency and timeline signals can lose value quickly when human follow-up is delayed.",
    safeCopyRequired: "Urgency review is an assumption for human review and does not authorize contact execution.",
  },
  {
    order: 5,
    section: "seller_momentum_risk",
    intent: "Show seller-side momentum risk when recent response or follow-up context may be going stale.",
    revenuePriorityReason: "Momentum loss can reduce acquisition conversion and increase recovery burden.",
    safeCopyRequired: "Seller momentum risk is a review label only and cannot send, dial, or trigger follow-up.",
  },
  {
    order: 6,
    section: "overdue_seller_follow_up",
    intent: "Show overdue seller follow-up labels without outreach controls.",
    revenuePriorityReason: "Overdue follow-up can leak acquisition revenue when the seller is waiting on a human operator.",
    safeCopyRequired: "Overdue seller follow-up is manual visibility and cannot create calls, messages, tasks, or schedules.",
  },
  {
    order: 7,
    section: "lead_decay_risk",
    intent: "Show stale open seller records that may need manual triage.",
    revenuePriorityReason: "Lead decay can turn acquisition opportunities into lost or stuck deals.",
    safeCopyRequired: "Lead decay risk is advisory and cannot launch reactivation campaigns or auto follow-up.",
  },
  {
    order: 8,
    section: "high_motivation_seller_review",
    intent: "Show high-motivation seller assumptions for human verification.",
    revenuePriorityReason: "Verified motivation, distress, urgency, or timeline context can improve seller-side revenue focus.",
    safeCopyRequired: "Motivation labels require human verification and cannot invent property or seller facts.",
  },
  {
    order: 9,
    section: "missing_acquisition_data",
    intent: "Show missing seller, property, source, phone, motivation, timeline, or next-step context.",
    revenuePriorityReason: "Missing acquisition data lowers confidence and can hide revenue leakage.",
    safeCopyRequired: "Missing data labels require human verification and cannot trigger enrichment, scraping, persistence, or providers.",
  },
  {
    order: 10,
    section: "acquisition_bottlenecks",
    intent: "Show acquisition friction that slows seller conversion.",
    revenuePriorityReason: "Bottlenecks such as missing next steps or unresolved review can block multiple seller opportunities.",
    safeCopyRequired: "Acquisition bottlenecks are manual next-step labels and cannot mutate workflow state.",
  },
  {
    order: 11,
    section: "manual_call_review_guidance",
    intent: "Show concise manual call review guidance without creating call controls.",
    revenuePriorityReason: "Operators need safe next-review context before acting outside the app.",
    safeCopyRequired: "Manual call review guidance is advisory only and cannot call, dial, send, queue, or execute.",
  },
  {
    order: 12,
    section: "safe_operator_review_guidance",
    intent: "Show final safe operator guidance that preserves human ownership.",
    revenuePriorityReason: "Safe wording helps operators use priority intelligence without changing system behavior.",
    safeCopyRequired: "Guidance is read-only and does not authorize dialing, messaging, campaigns, providers, or automation.",
  },
];

const urgencyVisibilityWording = [
  "Seller urgency review.",
  "Urgency is inferred from existing seller-provided context and must be manually verified.",
  "Urgency visibility does not pressure sellers, imply legal advice, or authorize contact execution.",
];

const leadDecayWording = [
  "Lead decay risk.",
  "Stale open seller record.",
  "Momentum may be declining; operator review recommended.",
  "Lead decay labels cannot launch campaigns, auto follow-up, or queue execution.",
];

const sellerMomentumWording = [
  "Seller momentum risk.",
  "Recent seller response or follow-up context may need operator review.",
  "Momentum risk is a priority label only and does not send, dial, or schedule anything.",
];

const overdueFollowUpWording = [
  "Overdue seller follow-up.",
  "Seller follow-up priority.",
  "Manual call review recommended for overdue follow-up context.",
  "Overdue follow-up visibility cannot dial, text, email, persist, schedule, or trigger workflow state.",
];

const acquisitionBottleneckWording = [
  "Acquisition bottleneck.",
  "Missing manual next step.",
  "Missing seller or property data.",
  "High-motivation context awaiting human review.",
  "Bottleneck labels are advisory and cannot assign work, activate campaigns, or mutate workflow state.",
];

const manualReviewWording = [
  "Manual call review recommended.",
  "Operator review recommended.",
  "High-priority seller review.",
  "Review assumptions before acting outside the app.",
  "Call priority label is advisory only.",
];

const safeOperatorGuidanceWording = [
  "Use seller call priority guidance for manual review only.",
  "Review governance stop signals before any seller call planning.",
  "Validate seller, property, motivation, timeline, urgency, and missing-data assumptions before acting outside the app.",
  "This future surface may guide human work only; it must not call, dial, send, persist, poll, activate providers, negotiate, launch campaigns, or execute workflows.",
];

const forbiddenControlsButtonsActions: R60AcquisitionDailyCallPriorityForbiddenUiControl[] = [
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

const dangerousLanguagePatterns = [
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
  "start campaign",
  "run dialer",
  "call seller",
  "contact seller now",
  "ready to call",
];

const accessibilityExpectations = [
  "Use semantic headings for the future acquisition daily call priority region and each section.",
  "Use readable labels for priorities, urgency, decay, momentum, missing data, bottlenecks, statuses, and guidance.",
  "Status meaning must be text-based and never depend on color alone.",
  "Do not rely on motion, focus movement, auto-refresh, polling, or live-update noise.",
  "Use concise wording and screen-reader-friendly summaries for daily seller priority groups.",
  "Keep governance stop states distinct from advisory call-priority guidance.",
];

const noActionExecutionBoundaries = [
  "No buttons, links, toggles, menus, forms, or controls may trigger calls, dialing, SMS, email, campaigns, provider activation, approval execution, persistence, polling, route changes, or workflow mutation.",
  "Future UI may display only already-available read-only dashboard signals and already-scoped derived labels.",
  "Daily call priority, urgency, momentum, decay, overdue follow-up, bottleneck, and review wording must remain labels or guidance only.",
  "Approval, review, urgency, and deal-readiness language must never imply permission to call, text, email, negotiate, send, queue, launch campaigns, or activate providers.",
  "No hidden execution affordances, background work, setInterval polling, provider imports, server actions, autonomous outreach, dialer activation, campaign launch, or automation-agent imports are allowed.",
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
  "Call priority labels must remain advisory only.",
  "No hidden execution affordances are allowed.",
];

const implementationBoundaries: R60AcquisitionDailyCallPriorityUiImplementationBoundary = {
  candidateSurface: "dashboard_acquisition_daily_call_priority_intelligence",
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx",
  noUiImplementationNow: true,
  noNewRoutes: true,
  noPolling: true,
  noPersistence: true,
  noProviderControls: true,
  noCallControls: true,
  noDialerControls: true,
  noCampaignControls: true,
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

function addWarning(warningCodes: string[], warningCode: R60AcquisitionDailyCallPriorityUiWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R60AcquisitionDailyCallPriorityUiScopeAuditInput) {
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

export function assertR60AcquisitionDailyCallPriorityUiScopeInvariants(
  result: Pick<
    R60AcquisitionDailyCallPriorityUiScopeAuditResult,
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
): R60AcquisitionDailyCallPriorityUiInvariantCheck {
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

export function summarizeR60AcquisitionDailyCallPriorityUiScopeAudit(
  result: R60AcquisitionDailyCallPriorityUiScopeAuditResult,
) {
  const invariantCheck = assertR60AcquisitionDailyCallPriorityUiScopeInvariants(result);

  return boundSummary(
    `R60B ${result.surface} status is ${result.scopeStatus}. ` +
      `${result.allowedFutureUiSections.length} future UI sections and ${result.sellerCallPriorityVisibilityConcepts.length} visibility concepts are scoped. ` +
      `${result.forbiddenControlsButtonsActions.length} controls, buttons, or action semantics are forbidden. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This audit cannot authorize UI implementation, redesign, routes, providers, Twilio, automation-agent usage, Prisma changes, calls, dialing, SMS, email, campaigns, persistence, polling, execution controls, approval execution, autonomous negotiation, outreach, hidden execution affordances, or runtime activation.",
  );
}

export function createR60AcquisitionDailyCallPriorityUiScopeAudit(
  input: R60AcquisitionDailyCallPriorityUiScopeAuditInput = {},
): R60AcquisitionDailyCallPriorityUiScopeAuditResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const auditNotes = collectNotes(input.extraAuditNotes);

  addWarning(warningCodes, "r60b_acquisition_daily_call_priority_ui_scope_audit_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r60aScopeReviewed !== true) addWarning(warningCodes, "r60a_scope_review_required");
  if (input.uiSurfaceReviewed !== true) addWarning(warningCodes, "ui_surface_review_required");
  if (input.visibilityConceptsReviewed !== true) addWarning(warningCodes, "visibility_concept_review_required");
  if (input.urgencyVisibilityReviewed !== true) addWarning(warningCodes, "urgency_visibility_review_required");
  if (input.leadDecayVisibilityReviewed !== true) addWarning(warningCodes, "lead_decay_visibility_review_required");
  if (input.sellerMomentumVisibilityReviewed !== true) {
    addWarning(warningCodes, "seller_momentum_visibility_review_required");
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
    input.r60aScopeReviewed !== true ||
    input.uiSurfaceReviewed !== true ||
    input.visibilityConceptsReviewed !== true ||
    input.urgencyVisibilityReviewed !== true ||
    input.leadDecayVisibilityReviewed !== true ||
    input.sellerMomentumVisibilityReviewed !== true ||
    input.wordingReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R60AcquisitionDailyCallPriorityUiScopeStatus = hasForbiddenRequest(input)
    ? "ui_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "ui_scope_ready_for_later_implementation";
  const result: R60AcquisitionDailyCallPriorityUiScopeAuditResult = {
    phase: "R60B",
    surface: "acquisition_daily_call_priority_intelligence_ui",
    scopeStatus,
    allowedFutureUiSections,
    sellerCallPriorityVisibilityConcepts,
    urgencyVisibilityWording,
    leadDecayWording,
    sellerMomentumWording,
    overdueFollowUpWording,
    acquisitionBottleneckWording,
    manualReviewWording,
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
    nextSuggestedPhase: "R60C - Acquisition Daily Call Priority Intelligence Read-Only UI Implementation Scope Contract",
    summary: "R60B acquisition daily call priority UI scope audit only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR60AcquisitionDailyCallPriorityUiScopeAudit(result) };
}
