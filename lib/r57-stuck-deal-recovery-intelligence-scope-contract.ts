export type R57StuckDealRecoveryScopeStatus =
  | "stuck_deal_recovery_scope_blocked"
  | "operator_review_required"
  | "stuck_deal_recovery_scope_ready";

export type R57StuckDealDetectionCategory =
  | "stale_seller_outcome"
  | "overdue_manual_follow_up"
  | "missing_next_manual_step"
  | "missing_critical_data"
  | "blocked_governance_state"
  | "dnc_or_opt_out_blocked"
  | "buyer_readiness_blocker"
  | "near_close_friction"
  | "human_review_required"
  | "unclear_disposition_path";

export type R57RevenueLeakageReason =
  | "seller_momentum_loss"
  | "follow_up_discipline_gap"
  | "operator_attention_gap"
  | "missing_source_or_contact_data"
  | "missing_motivation_or_timeline"
  | "buyer_package_incomplete"
  | "governance_stop_signal"
  | "near_close_blocker_unresolved"
  | "manual_decision_pending"
  | "deal_stage_ambiguity";

export type R57ManualRecoveryPriority = {
  priority:
    | "resolve_stop_signals_first"
    | "recover_near_close_motion"
    | "complete_overdue_manual_follow_up"
    | "fill_missing_revenue_data"
    | "clarify_buyer_readiness"
    | "assign_manual_next_step";
  rank: number;
  revenueReason: string;
  safeManualActionLanguage: string;
  boundary: string;
};

export type R57StuckDealBlockedPattern =
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
  | "auto recovery"
  | "auto escalation"
  | "hidden execution affordances";

export type R57StuckDealRecoveryWarningCode =
  | "r57a_scope_contract_only"
  | "input_missing"
  | "r56f_lockdown_review_required"
  | "stuck_deal_category_review_required"
  | "revenue_leakage_review_required"
  | "manual_recovery_priority_review_required"
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

export type R57StuckDealRecoveryInput = {
  r56fLockdownReviewed?: boolean;
  stuckDealCategoriesReviewed?: boolean;
  revenueLeakageReviewed?: boolean;
  manualRecoveryPrioritiesReviewed?: boolean;
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
  extraScopeNotes?: string[];
};

export type R57StuckDealRecoverySafetyFlags = {
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

export type R57StuckDealRecoveryScopeResult = R57StuckDealRecoverySafetyFlags & {
  phase: "R57A";
  surface: "stuck_deal_recovery_intelligence";
  scopeStatus: R57StuckDealRecoveryScopeStatus;
  stuckDealDetectionCategories: R57StuckDealDetectionCategory[];
  revenueLeakageReasons: R57RevenueLeakageReason[];
  manualRecoveryPriorities: R57ManualRecoveryPriority[];
  blockedDealPatterns: string[];
  overdueFollowUpPatterns: string[];
  missingDataBlockers: string[];
  buyerReadinessBlockers: string[];
  nearCloseFrictionSignals: string[];
  humanReviewRequiredRecoveryItems: string[];
  safeManualNextActionLanguage: string[];
  forbiddenExecutionSemantics: R57StuckDealBlockedPattern[];
  governanceBoundaries: string[];
  accessibilityExpectations: string[];
  safetyFlags: R57StuckDealRecoverySafetyFlags;
  warningCodes: string[];
  rejectionReasons: string[];
  operatorReviewRequired: boolean;
  scopeNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R57StuckDealRecoveryInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R57StuckDealRecoverySafetyFlags = {
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

const stuckDealDetectionCategories: R57StuckDealDetectionCategory[] = [
  "stale_seller_outcome",
  "overdue_manual_follow_up",
  "missing_next_manual_step",
  "missing_critical_data",
  "blocked_governance_state",
  "dnc_or_opt_out_blocked",
  "buyer_readiness_blocker",
  "near_close_friction",
  "human_review_required",
  "unclear_disposition_path",
];

const revenueLeakageReasons: R57RevenueLeakageReason[] = [
  "seller_momentum_loss",
  "follow_up_discipline_gap",
  "operator_attention_gap",
  "missing_source_or_contact_data",
  "missing_motivation_or_timeline",
  "buyer_package_incomplete",
  "governance_stop_signal",
  "near_close_blocker_unresolved",
  "manual_decision_pending",
  "deal_stage_ambiguity",
];

const manualRecoveryPriorities: R57ManualRecoveryPriority[] = [
  {
    priority: "resolve_stop_signals_first",
    rank: 1,
    revenueReason: "DNC, opt-out, governance, and blocked states can create compliance or operational risk if ignored.",
    safeManualActionLanguage: "Review the blocker manually and do not proceed until the stop signal is resolved or confirmed.",
    boundary: "No override, send, provider, escalation, or execution control is allowed.",
  },
  {
    priority: "recover_near_close_motion",
    rank: 2,
    revenueReason: "Near-close records are closest to revenue and lose value when blockers sit unresolved.",
    safeManualActionLanguage: "Review the near-close blocker and define the next human-owned recovery step.",
    boundary: "Do not imply legal readiness, closing readiness, buyer release, or execution permission.",
  },
  {
    priority: "complete_overdue_manual_follow_up",
    rank: 3,
    revenueReason: "Overdue manual follow-up is a direct conversion leak.",
    safeManualActionLanguage: "Follow up manually outside the app only after confirming DNC, opt-out, and governance status.",
    boundary: "No automatic outreach, messaging, dialing, provider call, or follow-up mutation is allowed.",
  },
  {
    priority: "fill_missing_revenue_data",
    rank: 4,
    revenueReason: "Missing source, contact, motivation, timeline, property, or outcome data blocks good operator decisions.",
    safeManualActionLanguage: "Complete missing data through manual review and label assumptions clearly.",
    boundary: "Do not invent property facts or persist progress from this planning layer.",
  },
  {
    priority: "clarify_buyer_readiness",
    rank: 5,
    revenueReason: "Incomplete buyer package or unclear disposition path can stall revenue after acquisition qualification.",
    safeManualActionLanguage: "Review buyer package completeness and disposition readiness manually before any buyer-facing action.",
    boundary: "No auto-share, buyer outreach, package release, provider contact, or readiness-to-send wording.",
  },
  {
    priority: "assign_manual_next_step",
    rank: 6,
    revenueReason: "Deals without a clear next step drift out of the operator workday and leak revenue.",
    safeManualActionLanguage: "Assign a human-owned next review step in SOP language.",
    boundary: "No workflow mutation, route, persistence, polling, or automation is allowed.",
  },
];

const blockedDealPatterns = [
  "DNC or opt-out risk is present.",
  "Governance state is blocked or rejected.",
  "Human review is required before any seller or buyer-facing action.",
  "Lead source, seller context, or property review data is incomplete.",
  "Buyer package is incomplete or disposition readiness is unclear.",
];

const overdueFollowUpPatterns = [
  "Manual follow-up date is past the operator reference date.",
  "Seller outcome has not been recorded after a planned manual call.",
  "Follow-up exists without a human-owned next step.",
  "A lead is near-close but has no current manual recovery step.",
];

const missingDataBlockers = [
  "Missing lead source.",
  "Missing seller contact context.",
  "Missing property address or review context.",
  "Missing motivation or timeline.",
  "Missing seller outcome.",
  "Missing buyer package completeness signal.",
];

const buyerReadinessBlockers = [
  "Buyer package is incomplete.",
  "Disposition path is unclear.",
  "Buyer readiness is advisory and has not been human reviewed.",
  "Buyer-facing action would require separate manual approval outside this scope.",
];

const nearCloseFrictionSignals = [
  "Near-close lead has unresolved governance or DNC/opt-out blocker.",
  "Near-close lead lacks current seller outcome.",
  "Near-close lead lacks buyer package readiness.",
  "Near-close lead lacks a human-owned next step.",
];

const humanReviewRequiredRecoveryItems = [
  "Blocked records require human review before work continues.",
  "Near-close recovery requires human review before seller or buyer-facing action.",
  "Manual follow-up recommendations require DNC, opt-out, and governance review.",
  "Missing-data recovery requires clearly labeled assumptions and source verification.",
];

const safeManualNextActionLanguage = [
  "Review stuck deals manually and identify the next human-owned recovery step.",
  "Resolve do-not-proceed blockers before lower-risk revenue work.",
  "Call sellers manually outside the app only after confirming governance and contact safety.",
  "Complete missing source, contact, motivation, timeline, outcome, or buyer package data manually.",
  "Prepare buyer package review manually; do not share or send from this scope.",
];

const forbiddenExecutionSemantics: R57StuckDealBlockedPattern[] = [
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
  "auto recovery",
  "auto escalation",
  "hidden execution affordances",
];

const governanceBoundaries = [
  "Stuck-deal recovery intelligence is planning-only and cannot execute, send, persist, poll, or activate providers.",
  "Recovery language is advisory and cannot grant permission to contact, negotiate, close, or share with buyers.",
  "Approval, near-close, and buyer-ready signals remain human-review-required, not execution-ready.",
  "DNC, opt-out, governance-blocked, and missing-data states remain do-not-proceed signals.",
  "The contract must not invent property facts or treat assumptions as verified facts.",
];

const accessibilityExpectations = [
  "Future presentation must use semantic headings and readable labels.",
  "Status meaning must be text-based and never depend on color alone.",
  "Use concise recovery categories to reduce operator cognitive load.",
  "No focus movement, motion dependency, auto-refresh, polling, or live-update noise is allowed.",
  "Recovery summaries must be screen-reader friendly and distinguish blockers from manual recommendations.",
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

function addWarning(warningCodes: string[], warningCode: R57StuckDealRecoveryWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function hasForbiddenRequest(input: R57StuckDealRecoveryInput) {
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

export function assertR57StuckDealRecoveryScopeInvariants(
  result: Pick<
    R57StuckDealRecoveryScopeResult,
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
): R57StuckDealRecoveryInvariantCheck {
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

export function summarizeR57StuckDealRecoveryScope(result: R57StuckDealRecoveryScopeResult) {
  const invariantCheck = assertR57StuckDealRecoveryScopeInvariants(result);

  return boundSummary(
    `R57A ${result.surface} status is ${result.scopeStatus}. ` +
      `${result.stuckDealDetectionCategories.length} stuck-deal categories and ${result.revenueLeakageReasons.length} revenue leakage reasons are scoped. ` +
      `${result.manualRecoveryPriorities.length} manual recovery priorities are ranked. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This scope is planning-only and cannot authorize UI, routes, providers, sending, persistence, polling, automation, approval execution, autonomous recovery, or runtime activation.",
  );
}

export function createR57StuckDealRecoveryIntelligenceScopeContract(
  input: R57StuckDealRecoveryInput = {},
): R57StuckDealRecoveryScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r57a_scope_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r56fLockdownReviewed !== true) addWarning(warningCodes, "r56f_lockdown_review_required");
  if (input.stuckDealCategoriesReviewed !== true) {
    addWarning(warningCodes, "stuck_deal_category_review_required");
  }
  if (input.revenueLeakageReviewed !== true) addWarning(warningCodes, "revenue_leakage_review_required");
  if (input.manualRecoveryPrioritiesReviewed !== true) {
    addWarning(warningCodes, "manual_recovery_priority_review_required");
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
    input.r56fLockdownReviewed !== true ||
    input.stuckDealCategoriesReviewed !== true ||
    input.revenueLeakageReviewed !== true ||
    input.manualRecoveryPrioritiesReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R57StuckDealRecoveryScopeStatus = hasForbiddenRequest(input)
    ? "stuck_deal_recovery_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "stuck_deal_recovery_scope_ready";
  const result: R57StuckDealRecoveryScopeResult = {
    phase: "R57A",
    surface: "stuck_deal_recovery_intelligence",
    scopeStatus,
    stuckDealDetectionCategories,
    revenueLeakageReasons,
    manualRecoveryPriorities,
    blockedDealPatterns,
    overdueFollowUpPatterns,
    missingDataBlockers,
    buyerReadinessBlockers,
    nearCloseFrictionSignals,
    humanReviewRequiredRecoveryItems,
    safeManualNextActionLanguage,
    forbiddenExecutionSemantics,
    governanceBoundaries,
    accessibilityExpectations,
    safetyFlags,
    warningCodes,
    rejectionReasons,
    operatorReviewRequired,
    scopeNotes,
    nextSuggestedPhase: "R57B - Stuck-Deal Recovery Intelligence UI Implementation Scope Audit",
    summary: "R57A stuck-deal recovery intelligence scope contract only.",
    ...safetyFlags,
  };

  return {
    ...result,
    summary: summarizeR57StuckDealRecoveryScope(result),
  };
}
