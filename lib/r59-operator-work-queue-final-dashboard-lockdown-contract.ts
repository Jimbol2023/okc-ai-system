export type R59OperatorWorkQueueFinalLockdownStatus =
  | "final_lockdown_blocked"
  | "operator_review_required"
  | "operator_work_queue_dashboard_locked";

export type R59NextRevenueIntelligencePhase =
  | "acquisition_daily_call_priority_intelligence"
  | "buyer_ready_disposition_priority_intelligence"
  | "driving_for_dollars_acquisition_intelligence"
  | "lead_quality_source_intelligence"
  | "missing_data_revenue_leakage_intelligence"
  | "buyer_fit_intelligence";

export type R59NextRevenueIntelligenceCandidate = {
  phase: R59NextRevenueIntelligencePhase;
  rank: number;
  roiScore: number;
  safetyScore: number;
  operatorLeverageScore: number;
  reason: string;
  allowedPlanningScope: string;
  boundary: string;
};

export type R59FinalBlockedPattern =
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
  | "hidden execution affordances"
  | "start queue"
  | "run queue"
  | "dispatch work"
  | "assign automatically";

export type R59FinalLockdownWarningCode =
  | "r59f_final_dashboard_lockdown_contract_only"
  | "input_missing"
  | "r59a_scope_review_required"
  | "r59b_ui_scope_review_required"
  | "r59c_implementation_scope_review_required"
  | "r59d_ui_implementation_review_required"
  | "r59e_safety_accessibility_review_required"
  | "dashboard_safety_review_required"
  | "revenue_priority_review_required"
  | "highest_value_next_action_review_required"
  | "next_revenue_intelligence_review_required"
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

export type R59FinalLockdownInput = {
  r59aScopeReviewed?: boolean;
  r59bUiScopeReviewed?: boolean;
  r59cImplementationScopeReviewed?: boolean;
  r59dUiImplementationReviewed?: boolean;
  r59eSafetyAccessibilityReviewed?: boolean;
  dashboardSafetyReviewed?: boolean;
  revenuePriorityReviewed?: boolean;
  highestValueNextActionsReviewed?: boolean;
  nextRevenueIntelligenceReviewed?: boolean;
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
  extraLockdownNotes?: string[];
};

export type R59FinalLockdownSafetyFlags = {
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

export type R59FinalLockdownResult = R59FinalLockdownSafetyFlags & {
  phase: "R59F";
  surface: "operator_work_queue_final_dashboard_lockdown";
  lockdownStatus: R59OperatorWorkQueueFinalLockdownStatus;
  requiredSafetyCopy: "Read-only operator work queue guidance. No provider called, no message sent, no runtime execution.";
  r59StackReviewFindings: string[];
  dashboardSafetyFindings: string[];
  revenuePriorityFindings: string[];
  highestValueNextActionFindings: string[];
  accessibilityFindings: string[];
  governanceBoundaryFindings: string[];
  nextRevenueIntelligenceFindings: string[];
  selectedNextPhase: R59NextRevenueIntelligencePhase;
  selectedNextPhaseReason: string;
  candidateRankings: R59NextRevenueIntelligenceCandidate[];
  blockedPatterns: R59FinalBlockedPattern[];
  invariantAssertions: string[];
  allowedFinalState: string[];
  forbiddenBoundaries: string[];
  safetyFlags: R59FinalLockdownSafetyFlags;
  warningCodes: string[];
  rejectionReasons: string[];
  operatorReviewRequired: boolean;
  lockdownNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R59FinalLockdownInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;
const requiredSafetyCopy =
  "Read-only operator work queue guidance. No provider called, no message sent, no runtime execution." as const;

const safetyFlags: R59FinalLockdownSafetyFlags = {
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

const r59StackReviewFindings = [
  "R59A scoped operator work queue intelligence as read-only, advisory-only, simulation-only, and manual-first.",
  "R59B audited future dashboard visibility, safe wording, accessibility expectations, and forbidden execution affordances.",
  "R59C locked implementation scope to the existing dashboard, existing dashboard-loaded data, and no runtime activation.",
  "R59D implemented the read-only dashboard surface with existing leads, manual revenue metrics, and already-scoped derived signals.",
  "R59E reviewed safety, accessibility, data boundaries, governance, daily priority ordering, and highest-value next-action clarity.",
];

const dashboardSafetyFindings = [
  "The dashboard surface is read-only, advisory-only, and manual-first.",
  "The surface renders from existing dashboard-loaded StoredLead records and existing manual revenue metrics.",
  "The component introduces no fetch, localStorage, sessionStorage, polling, auto-refresh, provider access, route, or persistence.",
  "The component exposes no buttons, click handlers, forms, links, toggles, menus, or execution-looking controls.",
  "The required safety copy remains exact.",
];

const revenuePriorityFindings = [
  "Daily priority ordering is governance stop signals, highest-value next actions, daily revenue priorities, near-close recovery items, stuck-deal recovery items, seller follow-up priorities, buyer disposition priorities, missing revenue data items, workflow bottlenecks, manual review queue, summary, and safe guidance.",
  "Governance stop signals remain first because they can block every later manual revenue workflow.",
  "Near-close and stuck-deal recovery appear before lower-value backlog because they protect already-created revenue opportunities.",
  "Missing data and workflow bottlenecks remain visible as revenue leakage indicators, not forecasts, guarantees, or permission to act.",
];

const highestValueNextActionFindings = [
  "Highest-value ordering is governance stop review, near-close recovery review, stuck-deal recovery review, seller follow-up review, buyer disposition review, missing revenue data review, and workflow bottleneck review.",
  "Each highest-value next action is a text label for manual operator attention only.",
  "The highest-value ordering is clear, deterministic, and does not create assignment, sending, recovery, provider, or workflow controls.",
];

const accessibilityFindings = [
  "The dashboard surface uses a semantic section with aria-labelledby.",
  "The heading id matches the aria-labelledby target.",
  "Counts, statuses, helpers, and queue meanings have readable text labels.",
  "Status meaning is expressed in text and does not depend on color alone.",
  "No focus movement, motion dependency, auto-refresh, polling, or live-update behavior is introduced.",
];

const governanceBoundaryFindings = [
  "No routes, providers, Twilio, automation-agent, Prisma, migrations, persistence, polling, runtime activation, execution controls, or redesign were introduced.",
  "No approval wording grants permission to send, assign, contact, negotiate, recover, queue, retry, close, dispose, or activate providers.",
  "No autonomous negotiation, autonomous outreach, hidden execution affordance, or approval-as-permission behavior is authorized.",
  "Manual-first guidance remains advisory text and cannot mutate workflow state.",
  "Governance invariants remain hard-closed across the full R59 stack.",
];

const nextRevenueIntelligenceFindings = [
  "Operator work queue intelligence is complete and should stop expanding in R59.",
  "The next phase should improve the highest-frequency revenue activity that feeds the operator queue: seller acquisition calls.",
  "Acquisition daily call priority intelligence is the highest-ROI next candidate because it can rank manual seller attention before leads stall or become recovery work.",
  "The next phase must remain planning-first, read-only, and provider-free before any call-priority UI is considered.",
];

const candidateRankings: R59NextRevenueIntelligenceCandidate[] = [
  {
    phase: "acquisition_daily_call_priority_intelligence",
    rank: 1,
    roiScore: 10,
    safetyScore: 8,
    operatorLeverageScore: 10,
    reason:
      "It targets the highest-frequency manual revenue motion: deciding which seller leads deserve operator call attention today before opportunities stall.",
    allowedPlanningScope:
      "Define advisory daily call priority categories, source-sensitive urgency, manual follow-up age, seller response context, and missing-call-context signals from existing data.",
    boundary: "No dialing, SMS, email, provider activation, scripts that imply legal advice, persistence, polling, or contact permission.",
  },
  {
    phase: "buyer_ready_disposition_priority_intelligence",
    rank: 2,
    roiScore: 9,
    safetyScore: 7,
    operatorLeverageScore: 8,
    reason:
      "It can speed disposition review, but buyer-facing semantics carry higher risk of contact, package-release, and buyer-ready drift.",
    allowedPlanningScope:
      "Define read-only buyer disposition priority categories, package review gaps, fit signals, and manual disposition review wording.",
    boundary: "No buyer contact, package release, auto disposition, send controls, provider activation, or buyer-ready-to-contact claims.",
  },
  {
    phase: "missing_data_revenue_leakage_intelligence",
    rank: 3,
    roiScore: 8,
    safetyScore: 10,
    operatorLeverageScore: 8,
    reason:
      "It is the safest next data-quality improvement and supports every revenue workflow, but it is less directly tied to daily operator outreach focus.",
    allowedPlanningScope:
      "Define missing source, contact, property, motivation, timeline, outcome, package, and review-state leakage categories.",
    boundary: "No enrichment claims, property fact invention, scraping, provider calls, persistence shortcuts, or workflow mutation.",
  },
  {
    phase: "buyer_fit_intelligence",
    rank: 4,
    roiScore: 8,
    safetyScore: 7,
    operatorLeverageScore: 7,
    reason:
      "It can improve disposition quality, but fit language must avoid contactability, readiness, and autonomous matching semantics.",
    allowedPlanningScope:
      "Define advisory buyer fit labels, assumptions, missing fit data, and manual review criteria from existing buyer/deal context.",
    boundary: "No autonomous matching, buyer outreach, package sharing, readiness claims, provider calls, or execution controls.",
  },
  {
    phase: "lead_quality_source_intelligence",
    rank: 5,
    roiScore: 7,
    safetyScore: 9,
    operatorLeverageScore: 7,
    reason:
      "It improves upstream visibility, but daily call prioritization creates a faster revenue feedback loop for operators.",
    allowedPlanningScope:
      "Define read-only source quality signals, assumptions, conversion risk labels, and manual verification needs.",
    boundary: "No source suppression automation, property fact invention, paid-provider activation, persistence, or autonomous routing.",
  },
  {
    phase: "driving_for_dollars_acquisition_intelligence",
    rank: 6,
    roiScore: 7,
    safetyScore: 8,
    operatorLeverageScore: 7,
    reason:
      "It can expand acquisition inputs, but it is upstream and less immediately tied to today's revenue queue than call priority.",
    allowedPlanningScope:
      "Define read-only driving-for-dollars acquisition signals, source labels, manual verification needs, and route-neutral priority categories.",
    boundary: "No route tracking, provider calls, scraping, persistence activation, autonomous outreach, or invented property facts.",
  },
];

const blockedPatterns: R59FinalBlockedPattern[] = [
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
  "start queue",
  "run queue",
  "dispatch work",
  "assign automatically",
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
  "Required safety copy must remain exact.",
  "Daily priority ordering must remain revenue-priority aligned.",
  "Highest-value next-action ordering must remain manual-first.",
];

const allowedFinalState = [
  "R59 stack is complete and locked.",
  "Dashboard surface may remain visible as read-only advisory guidance.",
  "Existing dashboard-loaded data may continue to feed derived labels and counts.",
  "Operators may use the guidance manually outside the app after normal governance review.",
];

const forbiddenBoundaries = [
  "No UI implementation in R59F.",
  "No redesign, routes, providers, Twilio, automation-agent, Prisma, schema, migrations, polling, persistence, or runtime activation.",
  "No execution controls, sending controls, queue controls, recovery controls, workflow mutation, or approval-as-permission behavior.",
  "No autonomous negotiation, autonomous outreach, auto disposition, auto close, auto assignment, or provider activation semantics.",
  "No hidden execution affordances.",
  "No property facts may be invented and assumptions must remain clearly labeled.",
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

function addWarning(warningCodes: string[], warningCode: R59FinalLockdownWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R59FinalLockdownInput) {
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

export function assertR59OperatorWorkQueueFinalLockdownInvariants(
  result: Pick<
    R59FinalLockdownResult,
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
): R59FinalLockdownInvariantCheck {
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

export function summarizeR59OperatorWorkQueueFinalLockdown(result: R59FinalLockdownResult) {
  const invariantCheck = assertR59OperatorWorkQueueFinalLockdownInvariants(result);

  return boundSummary(
    `R59F ${result.surface} status is ${result.lockdownStatus}. ` +
      `R59 stack findings: ${result.r59StackReviewFindings.length}. ` +
      `Selected next phase: ${result.selectedNextPhase}. ` +
      `${result.candidateRankings.length} next revenue intelligence candidates were ranked. ` +
      `Required safety copy: ${result.requiredSafetyCopy} ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This final lockdown is planning-only and cannot authorize UI, redesign, routes, providers, Twilio, automation-agent usage, Prisma changes, persistence, polling, execution controls, approval execution, autonomous outreach, negotiation, queue execution, or runtime activation.",
  );
}

export function createR59OperatorWorkQueueFinalDashboardLockdownContract(
  input: R59FinalLockdownInput = {},
): R59FinalLockdownResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const lockdownNotes = collectNotes(input.extraLockdownNotes);

  addWarning(warningCodes, "r59f_final_dashboard_lockdown_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r59aScopeReviewed !== true) addWarning(warningCodes, "r59a_scope_review_required");
  if (input.r59bUiScopeReviewed !== true) addWarning(warningCodes, "r59b_ui_scope_review_required");
  if (input.r59cImplementationScopeReviewed !== true) {
    addWarning(warningCodes, "r59c_implementation_scope_review_required");
  }
  if (input.r59dUiImplementationReviewed !== true) addWarning(warningCodes, "r59d_ui_implementation_review_required");
  if (input.r59eSafetyAccessibilityReviewed !== true) {
    addWarning(warningCodes, "r59e_safety_accessibility_review_required");
  }
  if (input.dashboardSafetyReviewed !== true) addWarning(warningCodes, "dashboard_safety_review_required");
  if (input.revenuePriorityReviewed !== true) addWarning(warningCodes, "revenue_priority_review_required");
  if (input.highestValueNextActionsReviewed !== true) {
    addWarning(warningCodes, "highest_value_next_action_review_required");
  }
  if (input.nextRevenueIntelligenceReviewed !== true) {
    addWarning(warningCodes, "next_revenue_intelligence_review_required");
  }
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
    input.r59aScopeReviewed !== true ||
    input.r59bUiScopeReviewed !== true ||
    input.r59cImplementationScopeReviewed !== true ||
    input.r59dUiImplementationReviewed !== true ||
    input.r59eSafetyAccessibilityReviewed !== true ||
    input.dashboardSafetyReviewed !== true ||
    input.revenuePriorityReviewed !== true ||
    input.highestValueNextActionsReviewed !== true ||
    input.nextRevenueIntelligenceReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    operatorReviewRequired;
  const lockdownStatus: R59OperatorWorkQueueFinalLockdownStatus = hasForbiddenRequest(input)
    ? "final_lockdown_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "operator_work_queue_dashboard_locked";
  const result: R59FinalLockdownResult = {
    phase: "R59F",
    surface: "operator_work_queue_final_dashboard_lockdown",
    lockdownStatus,
    requiredSafetyCopy,
    r59StackReviewFindings,
    dashboardSafetyFindings,
    revenuePriorityFindings,
    highestValueNextActionFindings,
    accessibilityFindings,
    governanceBoundaryFindings,
    nextRevenueIntelligenceFindings,
    selectedNextPhase: "acquisition_daily_call_priority_intelligence",
    selectedNextPhaseReason:
      "Acquisition daily call priority intelligence is the highest-ROI next phase because the R59 work queue is now locked and the next best revenue lift is ranking manual seller call attention before acquisition leads stall, while still avoiding dialing, messaging, providers, polling, persistence, runtime activation, or approval-as-contact permission.",
    candidateRankings,
    blockedPatterns,
    invariantAssertions,
    allowedFinalState,
    forbiddenBoundaries,
    safetyFlags,
    warningCodes,
    rejectionReasons,
    operatorReviewRequired,
    lockdownNotes,
    nextSuggestedPhase: "R60A - Acquisition Daily Call Priority Intelligence Scope Contract",
    summary: "R59F operator work queue final dashboard lockdown contract only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR59OperatorWorkQueueFinalLockdown(result) };
}
