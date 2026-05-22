export type R58NearCloseRevenueRecoveryFinalLockdownStatus =
  | "final_lockdown_blocked"
  | "operator_review_required"
  | "near_close_revenue_recovery_dashboard_locked";

export type R58NextRevenueIntelligencePhase =
  | "acquisition_daily_call_priority_intelligence"
  | "buyer_ready_disposition_priority_intelligence"
  | "operator_work_queue_intelligence"
  | "driving_for_dollars_acquisition_intelligence"
  | "lead_quality_source_intelligence"
  | "missing_data_revenue_leakage_intelligence";

export type R58NextRevenueIntelligenceCandidate = {
  phase: R58NextRevenueIntelligencePhase;
  rank: number;
  roiScore: number;
  safetyScore: number;
  operatorLeverageScore: number;
  reason: string;
  allowedPlanningScope: string;
  boundary: string;
};

export type R58FinalBlockedPattern =
  | "close deal now"
  | "send assignment"
  | "auto recover"
  | "auto follow-up"
  | "activate workflow"
  | "approve and send"
  | "queue execution"
  | "provider activation"
  | "autonomous outreach"
  | "autonomous negotiation"
  | "legal-ready"
  | "closing-ready"
  | "buyer-ready-to-contact"
  | "assignment-ready"
  | "execute closing"
  | "release automation"
  | "ready to close"
  | "release assignment"
  | "trigger escrow"
  | "order title automatically"
  | "hidden execution affordances";

export type R58FinalLockdownWarningCode =
  | "r58f_final_dashboard_lockdown_contract_only"
  | "input_missing"
  | "r58a_scope_review_required"
  | "r58b_ui_scope_review_required"
  | "r58c_implementation_scope_review_required"
  | "r58d_ui_implementation_review_required"
  | "r58e_safety_accessibility_review_required"
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
  | "legal_or_closing_readiness_claim_rejected"
  | "assignment_ready_claim_rejected"
  | "buyer_ready_to_contact_claim_rejected"
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

export type R58FinalLockdownInput = {
  r58aScopeReviewed?: boolean;
  r58bUiScopeReviewed?: boolean;
  r58cImplementationScopeReviewed?: boolean;
  r58dUiImplementationReviewed?: boolean;
  r58eSafetyAccessibilityReviewed?: boolean;
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
  legalOrClosingReadinessClaimRequested?: boolean;
  assignmentReadyClaimRequested?: boolean;
  buyerReadyToContactClaimRequested?: boolean;
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

export type R58FinalLockdownSafetyFlags = {
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

export type R58FinalLockdownResult = R58FinalLockdownSafetyFlags & {
  phase: "R58F";
  surface: "near_close_revenue_recovery_final_dashboard_lockdown";
  lockdownStatus: R58NearCloseRevenueRecoveryFinalLockdownStatus;
  requiredSafetyCopy: "Read-only near-close recovery guidance. No provider called, no message sent, no runtime execution.";
  r58StackReviewFindings: string[];
  dashboardSafetyFindings: string[];
  revenuePriorityFindings: string[];
  accessibilityFindings: string[];
  governanceBoundaryFindings: string[];
  nextRevenueIntelligenceFindings: string[];
  selectedNextPhase: R58NextRevenueIntelligencePhase;
  selectedNextPhaseReason: string;
  candidateRankings: R58NextRevenueIntelligenceCandidate[];
  blockedPatterns: R58FinalBlockedPattern[];
  invariantAssertions: string[];
  allowedFinalState: string[];
  forbiddenBoundaries: string[];
  safetyFlags: R58FinalLockdownSafetyFlags;
  warningCodes: string[];
  rejectionReasons: string[];
  operatorReviewRequired: boolean;
  lockdownNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R58FinalLockdownInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;
const requiredSafetyCopy =
  "Read-only near-close recovery guidance. No provider called, no message sent, no runtime execution." as const;

const safetyFlags: R58FinalLockdownSafetyFlags = {
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

const r58StackReviewFindings = [
  "R58A scoped near-close revenue recovery intelligence as read-only, advisory-only, simulation-only, and blocked from execution.",
  "R58B audited future dashboard visibility, safe wording, accessibility expectations, forbidden controls, and readiness-claim boundaries.",
  "R58C locked the final implementation scope: existing dashboard placement, existing dashboard-loaded data only, and no runtime activation.",
  "R58D implemented the read-only dashboard surface with already-loaded leads and existing manual revenue metrics only.",
  "R58E reviewed safety, accessibility, data boundaries, governance, and revenue-priority ordering with no defects requiring changes.",
];

const dashboardSafetyFindings = [
  "The dashboard surface is read-only and advisory-only.",
  "The surface renders from existing dashboard-loaded StoredLead records and existing manual revenue metrics.",
  "The component introduces no fetch, localStorage, sessionStorage, polling, auto-refresh, provider access, route, or persistence.",
  "The component exposes no buttons, click handlers, forms, links, toggles, menus, or execution-looking controls.",
  "The required safety copy remains exact.",
];

const revenuePriorityFindings = [
  "Visible ordering follows R58C/R58D: governance stop signals, title/escrow blockers, closing checklist gaps, assignment friction, seller response blockers, buyer package blockers, missing document blockers, stale near-close timelines, pre-closing leakage indicators, summary, and safe guidance.",
  "Governance stop signals remain first because they can block every later manual recovery step.",
  "Title, escrow, checklist, assignment, seller, buyer package, document, and timeline blockers appear before summary guidance.",
  "Revenue leakage indicators remain explanatory and do not operate as forecasts, guarantees, approvals, or permission to act.",
];

const accessibilityFindings = [
  "The surface uses a semantic section with aria-labelledby.",
  "The heading id matches the aria-labelledby target.",
  "Counts, statuses, helpers, and blocker meanings have readable text labels.",
  "Status meaning is expressed in text and does not depend on color alone.",
  "No focus movement, motion dependency, auto-refresh, polling, or live-update behavior is introduced.",
];

const governanceBoundaryFindings = [
  "No routes, providers, Twilio, automation-agent, Prisma, migrations, persistence, polling, runtime activation, execution controls, or redesign were introduced.",
  "No approval wording grants permission to send, contact, negotiate, recover, queue, retry, close, assign, or activate providers.",
  "No legal-readiness, closing-readiness, assignment-readiness, or buyer-contact-readiness claim is authorized.",
  "No hidden execution affordances are present in the R58 dashboard component.",
  "Governance invariants remain hard-closed across the full R58 stack.",
];

const nextRevenueIntelligenceFindings = [
  "Near-close revenue recovery is complete and should stop expanding in R58.",
  "The next phase should improve daily operator revenue focus using existing dashboard signals before adding more UI breadth.",
  "Operator work queue intelligence is the highest-ROI next candidate because R57 and R58 created multiple read-only revenue signals that now need a unified manual priority queue.",
  "The next phase should remain planning-first and read-only before any work queue UI or workflow surface is considered.",
];

const candidateRankings: R58NextRevenueIntelligenceCandidate[] = [
  {
    phase: "operator_work_queue_intelligence",
    rank: 1,
    roiScore: 10,
    safetyScore: 9,
    operatorLeverageScore: 10,
    reason:
      "It converts the existing manual revenue, stuck-deal, and near-close signals into one operator attention model without needing execution controls.",
    allowedPlanningScope:
      "Define read-only queue categories, manual ordering, stale-work signals, governance stops, and advisory next-review labels from existing dashboard data.",
    boundary:
      "No task mutation, persistence, polling, assignment automation, route changes, execution controls, provider activation, or approval-as-permission behavior.",
  },
  {
    phase: "acquisition_daily_call_priority_intelligence",
    rank: 2,
    roiScore: 9,
    safetyScore: 8,
    operatorLeverageScore: 10,
    reason:
      "It can improve seller-side throughput quickly, but contact-priority language needs stricter outreach boundaries than a pure work queue model.",
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
      "It can speed disposition review, but buyer-facing semantics create higher risk of contact or package-release drift.",
    allowedPlanningScope:
      "Define package completeness, disposition blockers, buyer review priorities, and safe manual package-review wording.",
    boundary: "No auto-share, buyer outreach, package release, provider activation, send controls, or buyer-ready-to-contact wording.",
  },
  {
    phase: "missing_data_revenue_leakage_intelligence",
    rank: 4,
    roiScore: 8,
    safetyScore: 10,
    operatorLeverageScore: 8,
    reason:
      "It is very safe and supports every revenue workflow, but it is most valuable when embedded into a broader work queue priority model.",
    allowedPlanningScope:
      "Define missing source, contact, property, motivation, timeline, outcome, package, title, and review-state risk categories.",
    boundary: "No enrichment claims, property fact invention, persistence shortcuts, scraping, provider calls, or workflow mutation.",
  },
  {
    phase: "lead_quality_source_intelligence",
    rank: 5,
    roiScore: 7,
    safetyScore: 9,
    operatorLeverageScore: 7,
    reason:
      "It improves upstream quality visibility, but ROI is less immediate than prioritizing the operator's current revenue work.",
    allowedPlanningScope:
      "Define read-only source quality signals, conversion risk labels, and assumptions requiring human verification.",
    boundary: "No source suppression automation, property fact invention, paid-provider activation, persistence, or autonomous routing.",
  },
  {
    phase: "driving_for_dollars_acquisition_intelligence",
    rank: 6,
    roiScore: 7,
    safetyScore: 8,
    operatorLeverageScore: 7,
    reason:
      "It can expand acquisition inputs, but it is upstream and less immediately tied to closing current revenue leakage.",
    allowedPlanningScope:
      "Define read-only driving-for-dollars acquisition signals, source labels, manual verification needs, and route-neutral priority categories.",
    boundary: "No route tracking, provider calls, persistence activation, autonomous outreach, scraping, or invented property facts.",
  },
];

const blockedPatterns: R58FinalBlockedPattern[] = [
  "close deal now",
  "send assignment",
  "auto recover",
  "auto follow-up",
  "activate workflow",
  "approve and send",
  "queue execution",
  "provider activation",
  "autonomous outreach",
  "autonomous negotiation",
  "legal-ready",
  "closing-ready",
  "buyer-ready-to-contact",
  "assignment-ready",
  "execute closing",
  "release automation",
  "ready to close",
  "release assignment",
  "trigger escrow",
  "order title automatically",
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
  "R58 dashboard ordering must remain revenue-priority aligned.",
  "Readiness and contactability claims must remain forbidden.",
];

const allowedFinalState = [
  "R58 stack is complete and locked.",
  "Dashboard surface may remain visible as read-only advisory guidance.",
  "Existing dashboard-loaded data may continue to feed derived labels and counts.",
  "Operators may use the guidance manually outside the app after normal governance review.",
];

const forbiddenBoundaries = [
  "No UI implementation in R58F.",
  "No redesign, routes, providers, Twilio, automation-agent, Prisma, schema, migrations, polling, persistence, or runtime activation.",
  "No execution controls, sending controls, recovery controls, workflow mutation, or approval-as-permission behavior.",
  "No legal-readiness, closing-readiness, assignment-readiness, buyer-contact-readiness, autonomous negotiation, or outreach semantics.",
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

  if (bounded && !list.includes(bounded) && list.length < maxListItems) {
    list.push(bounded);
  }
}

function addWarning(warningCodes: string[], warningCode: R58FinalLockdownWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R58FinalLockdownInput) {
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
    input.legalOrClosingReadinessClaimRequested === true ||
    input.assignmentReadyClaimRequested === true ||
    input.buyerReadyToContactClaimRequested === true ||
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

export function assertR58NearCloseRevenueRecoveryFinalLockdownInvariants(
  result: Pick<
    R58FinalLockdownResult,
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
): R58FinalLockdownInvariantCheck {
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

export function summarizeR58NearCloseRevenueRecoveryFinalLockdown(result: R58FinalLockdownResult) {
  const invariantCheck = assertR58NearCloseRevenueRecoveryFinalLockdownInvariants(result);

  return boundSummary(
    `R58F ${result.surface} status is ${result.lockdownStatus}. ` +
      `R58 stack findings: ${result.r58StackReviewFindings.length}. ` +
      `Selected next phase: ${result.selectedNextPhase}. ` +
      `${result.candidateRankings.length} next revenue intelligence candidates were ranked. ` +
      `Required safety copy: ${result.requiredSafetyCopy} ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This final lockdown is planning-only and cannot authorize UI, redesign, routes, providers, Twilio, automation-agent usage, Prisma changes, persistence, polling, execution controls, approval execution, autonomous outreach, negotiation, or runtime activation.",
  );
}

export function createR58NearCloseRevenueRecoveryFinalDashboardLockdownContract(
  input: R58FinalLockdownInput = {},
): R58FinalLockdownResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const lockdownNotes = collectNotes(input.extraLockdownNotes);

  addWarning(warningCodes, "r58f_final_dashboard_lockdown_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r58aScopeReviewed !== true) addWarning(warningCodes, "r58a_scope_review_required");
  if (input.r58bUiScopeReviewed !== true) addWarning(warningCodes, "r58b_ui_scope_review_required");
  if (input.r58cImplementationScopeReviewed !== true) {
    addWarning(warningCodes, "r58c_implementation_scope_review_required");
  }
  if (input.r58dUiImplementationReviewed !== true) addWarning(warningCodes, "r58d_ui_implementation_review_required");
  if (input.r58eSafetyAccessibilityReviewed !== true) {
    addWarning(warningCodes, "r58e_safety_accessibility_review_required");
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
  if (input.legalOrClosingReadinessClaimRequested === true) {
    addWarning(warningCodes, "legal_or_closing_readiness_claim_rejected");
  }
  if (input.assignmentReadyClaimRequested === true) addWarning(warningCodes, "assignment_ready_claim_rejected");
  if (input.buyerReadyToContactClaimRequested === true) {
    addWarning(warningCodes, "buyer_ready_to_contact_claim_rejected");
  }
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
    input.r58aScopeReviewed !== true ||
    input.r58bUiScopeReviewed !== true ||
    input.r58cImplementationScopeReviewed !== true ||
    input.r58dUiImplementationReviewed !== true ||
    input.r58eSafetyAccessibilityReviewed !== true ||
    input.dashboardSafetyReviewed !== true ||
    input.revenuePriorityReviewed !== true ||
    input.nextRevenueIntelligenceReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    operatorReviewRequired;
  const lockdownStatus: R58NearCloseRevenueRecoveryFinalLockdownStatus = hasForbiddenRequest(input)
    ? "final_lockdown_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "near_close_revenue_recovery_dashboard_locked";
  const result: R58FinalLockdownResult = {
    phase: "R58F",
    surface: "near_close_revenue_recovery_final_dashboard_lockdown",
    lockdownStatus,
    requiredSafetyCopy,
    r58StackReviewFindings,
    dashboardSafetyFindings,
    revenuePriorityFindings,
    accessibilityFindings,
    governanceBoundaryFindings,
    nextRevenueIntelligenceFindings,
    selectedNextPhase: "operator_work_queue_intelligence",
    selectedNextPhaseReason:
      "Operator work queue intelligence is the highest-ROI next phase because R57 and R58 now produce multiple safe revenue-priority signals, and a unified read-only queue can turn them into daily operator focus without execution, persistence, polling, provider activation, or approval drift.",
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
    nextSuggestedPhase: "R59A - Operator Work Queue Intelligence Scope Contract",
    summary: "R58F near-close revenue recovery final dashboard lockdown contract only.",
    ...safetyFlags,
  };

  return {
    ...result,
    summary: summarizeR58NearCloseRevenueRecoveryFinalLockdown(result),
  };
}
