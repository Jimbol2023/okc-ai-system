export type R56ManualRevenueWorkdayFinalLockdownStatus =
  | "final_lockdown_blocked"
  | "operator_review_required"
  | "manual_revenue_workday_summary_locked";

export type R56RevenueIntelligenceNextPhase =
  | "stuck_deal_recovery_intelligence"
  | "acquisition_daily_call_priority_intelligence"
  | "buyer_ready_disposition_priority_intelligence"
  | "near_close_revenue_recovery_intelligence"
  | "missing_data_revenue_leakage_intelligence";

export type R56RevenueIntelligenceCandidate = {
  phase: R56RevenueIntelligenceNextPhase;
  rank: number;
  roiScore: number;
  safetyScore: number;
  operatorLeverageScore: number;
  reason: string;
  allowedPlanningScope: string;
  boundary: string;
};

export type R56ManualRevenueWorkdayFinalBlockedPattern =
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
  | "queue execution"
  | "auto release"
  | "bulk send"
  | "autonomous negotiation"
  | "autonomous outreach"
  | "hidden execution affordances";

export type R56ManualRevenueWorkdayFinalWarningCode =
  | "r56f_final_lockdown_contract_only"
  | "input_missing"
  | "r56b_scope_review_required"
  | "r56c_ui_scope_review_required"
  | "r56d_ui_implementation_review_required"
  | "r56e_smoke_safety_review_required"
  | "revenue_intelligence_review_required"
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

export type R56ManualRevenueWorkdayFinalInput = {
  r56bScopeReviewed?: boolean;
  r56cUiScopeReviewed?: boolean;
  r56dUiImplementationReviewed?: boolean;
  r56eSmokeSafetyReviewed?: boolean;
  revenueIntelligenceReviewed?: boolean;
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

export type R56ManualRevenueWorkdayFinalSafetyFlags = {
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

export type R56ManualRevenueWorkdayFinalResult = R56ManualRevenueWorkdayFinalSafetyFlags & {
  phase: "R56F";
  surface: "manual_revenue_workday_summary_final_lockdown";
  lockdownStatus: R56ManualRevenueWorkdayFinalLockdownStatus;
  r56StackReviewFindings: string[];
  lockdownFindings: string[];
  revenueIntelligenceNextStepFindings: string[];
  selectedNextPhase: R56RevenueIntelligenceNextPhase;
  selectedNextPhaseReason: string;
  candidateRankings: R56RevenueIntelligenceCandidate[];
  forbiddenBoundaries: string[];
  allowedPlanningScope: string[];
  governanceBoundaries: string[];
  accessibilityFindings: string[];
  blockedPatterns: R56ManualRevenueWorkdayFinalBlockedPattern[];
  safetyFlags: R56ManualRevenueWorkdayFinalSafetyFlags;
  warningCodes: string[];
  rejectionReasons: string[];
  operatorReviewRequired: boolean;
  lockdownNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R56ManualRevenueWorkdayFinalInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R56ManualRevenueWorkdayFinalSafetyFlags = {
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

const r56StackReviewFindings = [
  "R56B scoped manual revenue workday intelligence around daily operator priorities, stuck deals, near-close opportunities, blockers, and manual next actions.",
  "R56C scoped later UI implementation with safe display order, no-action boundaries, dangerous pattern checks, and accessibility expectations.",
  "R56D implemented a narrow dashboard workday summary using existing read-only metrics and explicit no-provider, no-message, no-runtime safety copy.",
  "R56E smoke review confirmed the summary should remain visible, read-only, advisory-only, accessible, and non-executing.",
];

const lockdownFindings = [
  "Manual revenue workday summary is locked as a read-only revenue intelligence surface.",
  "The stack is aligned to manual-first operator decisions rather than automation expansion.",
  "The summary does not create provider reachability, polling, persistence, runtime activation, or approval-as-permission semantics.",
  "The stack should stop expanding here and move to a higher-ROI revenue intelligence problem.",
];

const revenueIntelligenceNextStepFindings = [
  "The highest-value next phase should target active revenue leakage instead of adding broad observability.",
  "Stuck-deal recovery is the strongest next target because it identifies records with stalled motion, unclear next steps, overdue work, or blockers.",
  "The next phase should remain planning-first and derive operator guidance without sending, activating providers, or mutating workflow state.",
  "The next phase should help operators recover deals manually, not automate negotiation, outreach, or escalation.",
];

const candidateRankings: R56RevenueIntelligenceCandidate[] = [
  {
    phase: "stuck_deal_recovery_intelligence",
    rank: 1,
    roiScore: 10,
    safetyScore: 9,
    operatorLeverageScore: 10,
    reason:
      "Directly targets revenue leakage across acquisition, follow-up, buyer readiness, and near-close blockers while staying manual and advisory.",
    allowedPlanningScope:
      "Define read-only signals for stale outcomes, unresolved blockers, overdue manual follow-ups, missing next steps, and human-review-required recovery opportunities.",
    boundary: "No auto-escalation, provider contact, workflow mutation, negotiation, outreach, polling, persistence, or runtime execution.",
  },
  {
    phase: "near_close_revenue_recovery_intelligence",
    rank: 2,
    roiScore: 9,
    safetyScore: 8,
    operatorLeverageScore: 9,
    reason:
      "High revenue proximity, but narrower than stuck-deal recovery and more likely to be confused with closing readiness if wording is careless.",
    allowedPlanningScope:
      "Define advisory near-close review signals and manual blocker categories without implying legal, funding, disposition, or closing authorization.",
    boundary: "No closing-ready, provider-ready, buyer-ready-to-contact, or execution-ready wording.",
  },
  {
    phase: "acquisition_daily_call_priority_intelligence",
    rank: 3,
    roiScore: 8,
    safetyScore: 8,
    operatorLeverageScore: 9,
    reason:
      "Improves seller-side throughput and daily discipline, but creates higher contact-language sensitivity than a stuck-deal planning layer.",
    allowedPlanningScope:
      "Define manual call priority signals from lead quality, missing seller context, urgency, and review state.",
    boundary: "No call automation, dialing controls, scripts that imply legal advice, or provider contact.",
  },
  {
    phase: "buyer_ready_disposition_priority_intelligence",
    rank: 4,
    roiScore: 8,
    safetyScore: 7,
    operatorLeverageScore: 8,
    reason:
      "Useful for disposition throughput, but downstream and potentially closer to buyer-sharing semantics.",
    allowedPlanningScope:
      "Define package completeness, buyer readiness, and manual disposition prep signals.",
    boundary: "No auto-share, buyer outreach, send controls, or package release semantics.",
  },
  {
    phase: "missing_data_revenue_leakage_intelligence",
    rank: 5,
    roiScore: 7,
    safetyScore: 10,
    operatorLeverageScore: 7,
    reason:
      "Very safe and useful, but better as a supporting signal inside stuck-deal recovery than as the next standalone phase.",
    allowedPlanningScope:
      "Define missing source, contact, property, motivation, timeline, outcome, and buyer package data signals.",
    boundary: "No persistence shortcuts, enrichment claims, property fact invention, or workflow mutation.",
  },
];

const forbiddenBoundaries = [
  "No UI implementation in R56F.",
  "No routes, API calls, server actions, database writes, provider imports, or automation-agent imports.",
  "No execution controls, sending controls, approval/send behavior, polling, persistence, or runtime activation.",
  "No autonomous negotiation, autonomous outreach, auto-escalation, or hidden execution affordances.",
  "No approval-as-permission drift and no wording that implies a deal is ready to execute.",
];

const allowedPlanningScope = [
  "Review the R56 manual revenue workday summary stack and lock its final safety state.",
  "Rank the next high-ROI revenue intelligence candidates using deterministic revenue, safety, and operator-leverage criteria.",
  "Select one next planning phase focused on manual operator effectiveness and revenue recovery.",
  "Define safety invariants, forbidden boundaries, and accessibility expectations for the selected next phase.",
];

const governanceBoundaries = [
  "Revenue intelligence remains advisory and cannot grant execution permission.",
  "Human review remains required before seller-facing, buyer-facing, legal, closing, or disposition action.",
  "Blocked, DNC, opt-out, missing-data, and governance-risk states remain do-not-proceed signals.",
  "Selected next phase may plan operator guidance only; it cannot mutate records or trigger contact.",
];

const accessibilityFindings = [
  "Future revenue intelligence must use semantic headings and readable labels.",
  "Status meaning must be text-based and never depend on color alone.",
  "No focus movement, motion dependency, auto-refresh, or live-update noise should be introduced.",
  "The next phase should keep outputs concise and screen-reader friendly so operators can act without cognitive overload.",
];

const blockedPatterns: R56ManualRevenueWorkdayFinalBlockedPattern[] = [
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
  "queue execution",
  "auto release",
  "bulk send",
  "autonomous negotiation",
  "autonomous outreach",
  "hidden execution affordances",
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

function addWarning(warningCodes: string[], warningCode: R56ManualRevenueWorkdayFinalWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function hasForbiddenRequest(input: R56ManualRevenueWorkdayFinalInput) {
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

export function assertR56ManualRevenueWorkdayFinalLockdownInvariants(
  result: Pick<
    R56ManualRevenueWorkdayFinalResult,
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
): R56ManualRevenueWorkdayFinalInvariantCheck {
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

export function summarizeR56ManualRevenueWorkdayFinalLockdown(
  result: R56ManualRevenueWorkdayFinalResult,
) {
  const invariantCheck = assertR56ManualRevenueWorkdayFinalLockdownInvariants(result);

  return boundSummary(
    `R56F ${result.surface} status is ${result.lockdownStatus}. ` +
      `Selected next phase: ${result.selectedNextPhase}. ` +
      `${result.candidateRankings.length} revenue intelligence candidates were ranked. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This final lockdown is planning-only and cannot authorize UI, routes, providers, sending, persistence, polling, automation, approval execution, autonomous outreach, or runtime activation.",
  );
}

export function createR56ManualRevenueWorkdayFinalLockdownContract(
  input: R56ManualRevenueWorkdayFinalInput = {},
): R56ManualRevenueWorkdayFinalResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const lockdownNotes = collectNotes(input.extraLockdownNotes);

  addWarning(warningCodes, "r56f_final_lockdown_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r56bScopeReviewed !== true) addWarning(warningCodes, "r56b_scope_review_required");
  if (input.r56cUiScopeReviewed !== true) addWarning(warningCodes, "r56c_ui_scope_review_required");
  if (input.r56dUiImplementationReviewed !== true) {
    addWarning(warningCodes, "r56d_ui_implementation_review_required");
  }
  if (input.r56eSmokeSafetyReviewed !== true) addWarning(warningCodes, "r56e_smoke_safety_review_required");
  if (input.revenueIntelligenceReviewed !== true) addWarning(warningCodes, "revenue_intelligence_review_required");
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
    input.r56bScopeReviewed !== true ||
    input.r56cUiScopeReviewed !== true ||
    input.r56dUiImplementationReviewed !== true ||
    input.r56eSmokeSafetyReviewed !== true ||
    input.revenueIntelligenceReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    operatorReviewRequired;
  const lockdownStatus: R56ManualRevenueWorkdayFinalLockdownStatus = hasForbiddenRequest(input)
    ? "final_lockdown_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "manual_revenue_workday_summary_locked";
  const result: R56ManualRevenueWorkdayFinalResult = {
    phase: "R56F",
    surface: "manual_revenue_workday_summary_final_lockdown",
    lockdownStatus,
    r56StackReviewFindings,
    lockdownFindings,
    revenueIntelligenceNextStepFindings,
    selectedNextPhase: "stuck_deal_recovery_intelligence",
    selectedNextPhaseReason:
      "Stuck-deal recovery intelligence is the highest-ROI next phase because it attacks active revenue leakage across stalled leads, overdue manual follow-up, missing next steps, buyer readiness blockers, and near-close friction while preserving manual operator control.",
    candidateRankings,
    forbiddenBoundaries,
    allowedPlanningScope,
    governanceBoundaries,
    accessibilityFindings,
    blockedPatterns,
    safetyFlags,
    warningCodes,
    rejectionReasons,
    operatorReviewRequired,
    lockdownNotes,
    nextSuggestedPhase: "R57A - Stuck-Deal Recovery Intelligence Scope Contract",
    summary: "R56F manual revenue workday summary final lockdown contract only.",
    ...safetyFlags,
  };

  return {
    ...result,
    summary: summarizeR56ManualRevenueWorkdayFinalLockdown(result),
  };
}
