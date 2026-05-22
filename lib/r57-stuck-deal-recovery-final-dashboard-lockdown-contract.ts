export type R57StuckDealRecoveryFinalLockdownStatus =
  | "final_lockdown_blocked"
  | "operator_review_required"
  | "stuck_deal_recovery_dashboard_locked";

export type R57NextRevenueIntelligencePhase =
  | "acquisition_daily_call_priority_intelligence"
  | "buyer_ready_disposition_priority_intelligence"
  | "near_close_revenue_recovery_intelligence"
  | "missing_data_revenue_leakage_intelligence"
  | "lead_quality_source_intelligence"
  | "manual_operator_work_queue_intelligence";

export type R57NextRevenueIntelligenceCandidate = {
  phase: R57NextRevenueIntelligencePhase;
  rank: number;
  roiScore: number;
  safetyScore: number;
  operatorLeverageScore: number;
  reason: string;
  allowedPlanningScope: string;
  boundary: string;
};

export type R57FinalBlockedPattern =
  | "send now"
  | "auto recover"
  | "auto follow-up"
  | "activate workflow"
  | "bulk recovery"
  | "AI negotiates"
  | "approve and send"
  | "release automation"
  | "start campaign"
  | "retry automatically"
  | "queue execution"
  | "provider activation"
  | "autonomous outreach"
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
  | "hidden execution affordances";

export type R57FinalLockdownWarningCode =
  | "r57f_final_dashboard_lockdown_contract_only"
  | "input_missing"
  | "r57a_scope_review_required"
  | "r57b_ui_scope_review_required"
  | "r57c_implementation_scope_review_required"
  | "r57d_ui_implementation_review_required"
  | "r57e_safety_accessibility_review_required"
  | "dashboard_safety_review_required"
  | "revenue_priority_review_required"
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

export type R57FinalLockdownInput = {
  r57aScopeReviewed?: boolean;
  r57bUiScopeReviewed?: boolean;
  r57cImplementationScopeReviewed?: boolean;
  r57dUiImplementationReviewed?: boolean;
  r57eSafetyAccessibilityReviewed?: boolean;
  dashboardSafetyReviewed?: boolean;
  revenuePriorityReviewed?: boolean;
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

export type R57FinalLockdownSafetyFlags = {
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

export type R57FinalLockdownResult = R57FinalLockdownSafetyFlags & {
  phase: "R57F";
  surface: "stuck_deal_recovery_final_dashboard_lockdown";
  lockdownStatus: R57StuckDealRecoveryFinalLockdownStatus;
  requiredSafetyCopy: "Read-only recovery guidance. No provider called, no message sent, no runtime execution.";
  r57StackReviewFindings: string[];
  dashboardSafetyFindings: string[];
  revenuePriorityFindings: string[];
  accessibilityFindings: string[];
  governanceBoundaryFindings: string[];
  nextRevenueIntelligenceFindings: string[];
  selectedNextPhase: R57NextRevenueIntelligencePhase;
  selectedNextPhaseReason: string;
  candidateRankings: R57NextRevenueIntelligenceCandidate[];
  blockedPatterns: R57FinalBlockedPattern[];
  invariantAssertions: string[];
  allowedFinalState: string[];
  forbiddenBoundaries: string[];
  safetyFlags: R57FinalLockdownSafetyFlags;
  warningCodes: string[];
  rejectionReasons: string[];
  operatorReviewRequired: boolean;
  lockdownNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R57FinalLockdownInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;
const requiredSafetyCopy =
  "Read-only recovery guidance. No provider called, no message sent, no runtime execution." as const;

const safetyFlags: R57FinalLockdownSafetyFlags = {
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

const r57StackReviewFindings = [
  "R57A scoped stuck-deal recovery intelligence as read-only, advisory-only, simulation-only, and blocked from execution.",
  "R57B audited future presentation surfaces, safe wording, accessibility expectations, and forbidden UI semantics.",
  "R57C locked the final implementation scope: existing dashboard placement, existing read-only data only, and no runtime activation.",
  "R57D implemented the read-only dashboard surface with existing dashboard leads and manual revenue metrics only.",
  "R57E reviewed safety, accessibility, and revenue-priority ordering, then corrected the summary order without adding features.",
];

const dashboardSafetyFindings = [
  "The dashboard surface is read-only and advisory-only.",
  "The surface uses existing dashboard data only: already-loaded StoredLead records and existing manual revenue metrics.",
  "The component introduces no fetch, localStorage, sessionStorage, polling, auto-refresh, provider access, or persistence.",
  "The component exposes no buttons, click handlers, forms, links, toggles, menus, or execution-looking controls.",
  "The required safety copy remains exact.",
];

const revenuePriorityFindings = [
  "R57E aligns the visible order with R57C: human review first, then near-close friction, overdue follow-up, missing next step, buyer readiness, missing critical data, revenue leakage, summary, and safe guidance.",
  "Revenue leakage indicators remain explanatory and do not operate as forecasts, guarantees, approvals, or permission to act.",
  "Human-review-required states remain stop-and-check signals before lower-priority revenue recovery guidance.",
  "Near-close friction is prioritized early because it is closest to revenue while still requiring manual review.",
];

const accessibilityFindings = [
  "The surface uses a semantic section with aria-labelledby.",
  "The heading id matches the aria-labelledby target.",
  "Counts and statuses have readable text labels.",
  "Status meaning is expressed in text and does not depend on color alone.",
  "No focus movement, motion dependency, auto-refresh, polling, or live-update behavior is introduced.",
];

const governanceBoundaryFindings = [
  "No routes, providers, Twilio, automation-agent, Prisma, migrations, persistence, polling, runtime activation, execution controls, or redesign were introduced.",
  "No approval wording grants permission to send, contact, negotiate, recover, queue, retry, close, or activate providers.",
  "No hidden execution affordances are present in the R57 dashboard component.",
  "Governance invariants remain hard-closed across the full R57 stack.",
];

const nextRevenueIntelligenceFindings = [
  "Stuck-deal recovery is complete and should stop expanding in R57.",
  "The next phase should target the highest-value remaining revenue bottleneck rather than broaden observability.",
  "Near-close revenue recovery is the highest-ROI next candidate because it focuses on deals closest to cash while staying compatible with manual review.",
  "The next phase should remain planning-first and read-only before any new UI or workflow surface is considered.",
];

const candidateRankings: R57NextRevenueIntelligenceCandidate[] = [
  {
    phase: "near_close_revenue_recovery_intelligence",
    rank: 1,
    roiScore: 10,
    safetyScore: 8,
    operatorLeverageScore: 9,
    reason:
      "It targets deals closest to revenue and builds naturally from R57 near-close friction without adding execution controls.",
    allowedPlanningScope:
      "Define read-only near-close blockers, manual review priorities, missing close-readiness data, buyer/package friction, and safe next-review wording.",
    boundary:
      "No closing-ready claims, buyer outreach, provider activation, legal readiness, send controls, workflow mutation, polling, persistence, or runtime execution.",
  },
  {
    phase: "acquisition_daily_call_priority_intelligence",
    rank: 2,
    roiScore: 9,
    safetyScore: 8,
    operatorLeverageScore: 10,
    reason:
      "It improves daily seller-side throughput and operator focus, but contact-language sensitivity makes it slightly riskier than near-close planning.",
    allowedPlanningScope:
      "Define advisory daily call priority signals from source, urgency, review state, seller outcome, follow-up age, and missing context.",
    boundary: "No dialing, messaging, provider calls, scripts that imply legal advice, or approval-as-contact permission.",
  },
  {
    phase: "buyer_ready_disposition_priority_intelligence",
    rank: 3,
    roiScore: 8,
    safetyScore: 7,
    operatorLeverageScore: 8,
    reason:
      "It can speed disposition throughput, but it is closer to buyer-sharing semantics and must be carefully bounded.",
    allowedPlanningScope:
      "Define package completeness, buyer readiness, disposition blockers, and manual buyer-review priorities.",
    boundary: "No auto-share, buyer outreach, package release, provider activation, send controls, or buyer-ready-to-contact wording.",
  },
  {
    phase: "manual_operator_work_queue_intelligence",
    rank: 4,
    roiScore: 8,
    safetyScore: 9,
    operatorLeverageScore: 9,
    reason:
      "It can consolidate operator focus safely, but it is broader and less directly tied to near-term revenue than near-close recovery.",
    allowedPlanningScope:
      "Define read-only daily work queue categories, manual ordering, and review labels from existing dashboard signals.",
    boundary: "No task mutation, persistence, polling, assignment automation, execution controls, or queue activation.",
  },
  {
    phase: "missing_data_revenue_leakage_intelligence",
    rank: 5,
    roiScore: 7,
    safetyScore: 10,
    operatorLeverageScore: 7,
    reason:
      "It is very safe and useful, but most valuable as a supporting signal inside near-close and acquisition prioritization.",
    allowedPlanningScope:
      "Define missing source, contact, property, motivation, timeline, outcome, and package data risk categories.",
    boundary: "No enrichment claims, property fact invention, persistence shortcuts, scraping, provider calls, or workflow mutation.",
  },
  {
    phase: "lead_quality_source_intelligence",
    rank: 6,
    roiScore: 7,
    safetyScore: 9,
    operatorLeverageScore: 7,
    reason:
      "It can improve upstream focus, but ROI is less immediate than near-close recovery and daily call prioritization.",
    allowedPlanningScope:
      "Define read-only source quality signals, conversion risk labels, and assumptions that require human verification.",
    boundary: "No source suppression automation, property fact invention, paid-provider activation, persistence, or autonomous routing.",
  },
];

const blockedPatterns: R57FinalBlockedPattern[] = [
  "send now",
  "auto recover",
  "auto follow-up",
  "activate workflow",
  "bulk recovery",
  "AI negotiates",
  "approve and send",
  "release automation",
  "start campaign",
  "retry automatically",
  "queue execution",
  "provider activation",
  "autonomous outreach",
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
  "hidden execution affordances",
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
  "R57 dashboard ordering must remain revenue-priority aligned.",
];

const allowedFinalState = [
  "R57 stack is complete and locked.",
  "Dashboard surface may remain visible as read-only advisory guidance.",
  "Existing dashboard data may continue to feed derived labels and counts.",
  "Operators may use the guidance manually outside the app after normal governance review.",
];

const forbiddenBoundaries = [
  "No UI implementation in R57F.",
  "No redesign, routes, providers, Twilio, automation-agent, Prisma, schema, migrations, polling, persistence, or runtime activation.",
  "No execution controls, sending controls, recovery controls, workflow mutation, or approval-as-permission behavior.",
  "No hidden execution affordances or autonomous outreach semantics.",
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

  if (bounded && !list.includes(bounded) && list.length < maxListItems) {
    list.push(bounded);
  }
}

function addWarning(warningCodes: string[], warningCode: R57FinalLockdownWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function hasForbiddenRequest(input: R57FinalLockdownInput) {
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

export function assertR57StuckDealRecoveryFinalLockdownInvariants(
  result: Pick<
    R57FinalLockdownResult,
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
): R57FinalLockdownInvariantCheck {
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

export function summarizeR57StuckDealRecoveryFinalLockdown(result: R57FinalLockdownResult) {
  const invariantCheck = assertR57StuckDealRecoveryFinalLockdownInvariants(result);

  return boundSummary(
    `R57F ${result.surface} status is ${result.lockdownStatus}. ` +
      `R57 stack findings: ${result.r57StackReviewFindings.length}. ` +
      `Selected next phase: ${result.selectedNextPhase}. ` +
      `${result.candidateRankings.length} next revenue intelligence candidates were ranked. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This final lockdown is planning-only and cannot authorize UI, redesign, routes, providers, Twilio, automation-agent usage, Prisma changes, persistence, polling, execution controls, approval execution, autonomous outreach, or runtime activation.",
  );
}

export function createR57StuckDealRecoveryFinalDashboardLockdownContract(
  input: R57FinalLockdownInput = {},
): R57FinalLockdownResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const lockdownNotes = collectNotes(input.extraLockdownNotes);

  addWarning(warningCodes, "r57f_final_dashboard_lockdown_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r57aScopeReviewed !== true) addWarning(warningCodes, "r57a_scope_review_required");
  if (input.r57bUiScopeReviewed !== true) addWarning(warningCodes, "r57b_ui_scope_review_required");
  if (input.r57cImplementationScopeReviewed !== true) {
    addWarning(warningCodes, "r57c_implementation_scope_review_required");
  }
  if (input.r57dUiImplementationReviewed !== true) addWarning(warningCodes, "r57d_ui_implementation_review_required");
  if (input.r57eSafetyAccessibilityReviewed !== true) {
    addWarning(warningCodes, "r57e_safety_accessibility_review_required");
  }
  if (input.dashboardSafetyReviewed !== true) addWarning(warningCodes, "dashboard_safety_review_required");
  if (input.revenuePriorityReviewed !== true) addWarning(warningCodes, "revenue_priority_review_required");
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
    input.r57aScopeReviewed !== true ||
    input.r57bUiScopeReviewed !== true ||
    input.r57cImplementationScopeReviewed !== true ||
    input.r57dUiImplementationReviewed !== true ||
    input.r57eSafetyAccessibilityReviewed !== true ||
    input.dashboardSafetyReviewed !== true ||
    input.revenuePriorityReviewed !== true ||
    input.nextRevenueIntelligenceReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    operatorReviewRequired;
  const lockdownStatus: R57StuckDealRecoveryFinalLockdownStatus = hasForbiddenRequest(input)
    ? "final_lockdown_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "stuck_deal_recovery_dashboard_locked";
  const result: R57FinalLockdownResult = {
    phase: "R57F",
    surface: "stuck_deal_recovery_final_dashboard_lockdown",
    lockdownStatus,
    requiredSafetyCopy,
    r57StackReviewFindings,
    dashboardSafetyFindings,
    revenuePriorityFindings,
    accessibilityFindings,
    governanceBoundaryFindings,
    nextRevenueIntelligenceFindings,
    selectedNextPhase: "near_close_revenue_recovery_intelligence",
    selectedNextPhaseReason:
      "Near-close revenue recovery intelligence is the highest-ROI next phase because it focuses on deals closest to cash, builds directly on R57 near-close friction signals, and can remain read-only, advisory-only, and manual-review-first.",
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
    nextSuggestedPhase: "R58A - Near-Close Revenue Recovery Intelligence Scope Contract",
    summary: "R57F stuck-deal recovery final dashboard lockdown contract only.",
    ...safetyFlags,
  };

  return {
    ...result,
    summary: summarizeR57StuckDealRecoveryFinalLockdown(result),
  };
}
