export type R58NearCloseRevenueRecoveryScopeStatus =
  | "near_close_recovery_scope_blocked"
  | "operator_review_required"
  | "near_close_recovery_scope_ready";

export type R58NearCloseDealCategory =
  | "under_contract_needs_manual_review"
  | "closing_ready_claim_requires_verification"
  | "assignment_ready_but_blocked"
  | "buyer_package_needs_completion"
  | "title_or_escrow_blocked"
  | "seller_signature_or_response_pending"
  | "closing_checklist_incomplete"
  | "stale_closing_timeline"
  | "missing_close_critical_documents"
  | "governance_or_compliance_stop_signal";

export type R58RevenueRecoverySignal =
  | "closest_to_cash_stage"
  | "near_close_blocker_unresolved"
  | "assignment_path_unclear"
  | "buyer_or_disposition_blocked"
  | "seller_side_response_gap"
  | "title_escrow_or_checklist_gap"
  | "missing_document_gap"
  | "timeline_staleness"
  | "manual_review_pending"
  | "revenue_leakage_before_closing";

export type R58ManualRecoveryPriority = {
  priority:
    | "resolve_stop_signals_first"
    | "recover_title_or_escrow_path"
    | "complete_closing_checklist_review"
    | "confirm_assignment_readiness"
    | "recover_seller_side_response"
    | "complete_buyer_package_review"
    | "resolve_missing_documents"
    | "refresh_stale_timeline";
  rank: number;
  revenueReason: string;
  safeManualActionLanguage: string;
  boundary: string;
};

export type R58ForbiddenExecutionSemantic =
  | "send now"
  | "auto recover"
  | "auto follow-up"
  | "activate workflow"
  | "approve and send"
  | "queue execution"
  | "provider activation"
  | "autonomous outreach"
  | "autonomous negotiation"
  | "runtime execution"
  | "persistence activation"
  | "polling activation"
  | "ready to close"
  | "release assignment"
  | "contact buyer now"
  | "contact seller now"
  | "trigger escrow"
  | "order title automatically"
  | "hidden execution affordances";

export type R58WarningCode =
  | "r58a_scope_contract_only"
  | "input_missing"
  | "r57f_lockdown_review_required"
  | "near_close_categories_review_required"
  | "revenue_recovery_signal_review_required"
  | "closing_friction_review_required"
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

export type R58NearCloseRevenueRecoveryInput = {
  r57fLockdownReviewed?: boolean;
  nearCloseCategoriesReviewed?: boolean;
  revenueRecoverySignalsReviewed?: boolean;
  closingFrictionReviewed?: boolean;
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

export type R58SafetyFlags = {
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

export type R58NearCloseRevenueRecoveryScopeResult = R58SafetyFlags & {
  phase: "R58A";
  surface: "near_close_revenue_recovery_intelligence";
  scopeStatus: R58NearCloseRevenueRecoveryScopeStatus;
  nearCloseDealCategories: R58NearCloseDealCategory[];
  revenueRecoverySignals: R58RevenueRecoverySignal[];
  closingFrictionReasons: string[];
  assignmentFrictionReasons: string[];
  sellerSideBlockers: string[];
  buyerSideBlockers: string[];
  titleEscrowChecklistBlockers: string[];
  missingDocumentBlockers: string[];
  staleTimelineRisks: string[];
  manualRecoveryPriorities: R58ManualRecoveryPriority[];
  safeManualNextActionWording: string[];
  forbiddenExecutionSemantics: R58ForbiddenExecutionSemantic[];
  governanceBoundaries: string[];
  accessibilityExpectations: string[];
  invariantAssertions: string[];
  safetyFlags: R58SafetyFlags;
  warningCodes: string[];
  rejectionReasons: string[];
  operatorReviewRequired: boolean;
  scopeNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R58InvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R58SafetyFlags = {
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

const nearCloseDealCategories: R58NearCloseDealCategory[] = [
  "under_contract_needs_manual_review",
  "closing_ready_claim_requires_verification",
  "assignment_ready_but_blocked",
  "buyer_package_needs_completion",
  "title_or_escrow_blocked",
  "seller_signature_or_response_pending",
  "closing_checklist_incomplete",
  "stale_closing_timeline",
  "missing_close_critical_documents",
  "governance_or_compliance_stop_signal",
];

const revenueRecoverySignals: R58RevenueRecoverySignal[] = [
  "closest_to_cash_stage",
  "near_close_blocker_unresolved",
  "assignment_path_unclear",
  "buyer_or_disposition_blocked",
  "seller_side_response_gap",
  "title_escrow_or_checklist_gap",
  "missing_document_gap",
  "timeline_staleness",
  "manual_review_pending",
  "revenue_leakage_before_closing",
];

const closingFrictionReasons = [
  "Closing readiness is claimed but not manually verified.",
  "Closing checklist is incomplete or stale.",
  "Title, escrow, inspection, assignment, or buyer package status is unclear.",
  "A governance, DNC, opt-out, or human-review stop signal is unresolved.",
  "The timeline is stale and may no longer reflect seller, buyer, title, or escrow reality.",
];

const assignmentFrictionReasons = [
  "Assignment path is unclear or unreviewed.",
  "Assignment package is missing manual readiness review.",
  "Buyer release or buyer communication would require separate human approval.",
  "Assignment language must not imply legal, closing, or execution readiness.",
];

const sellerSideBlockers = [
  "Seller response or signature is pending.",
  "Seller outcome is stale or missing.",
  "Seller timeline has not been refreshed manually.",
  "Seller-side contact safety, DNC, opt-out, or governance state requires review.",
];

const buyerSideBlockers = [
  "Buyer package is incomplete.",
  "Buyer readiness is unverified.",
  "Disposition path is unclear.",
  "Buyer-facing action would require separate manual review outside this scope.",
];

const titleEscrowChecklistBlockers = [
  "Title status is missing or unresolved.",
  "Escrow status is missing or unresolved.",
  "Closing checklist has incomplete manual review items.",
  "Title or escrow issue cannot be treated as permission to order, contact, or execute.",
];

const missingDocumentBlockers = [
  "Missing assignment agreement review.",
  "Missing seller signature or seller-side confirmation.",
  "Missing buyer package or proof-of-funds review.",
  "Missing title, escrow, inspection, or closing checklist context.",
  "Missing source-backed evidence for close-critical facts.",
];

const staleTimelineRisks = [
  "Closing timeline has not been refreshed after seller, buyer, title, or escrow movement.",
  "Follow-up date is stale relative to the near-close stage.",
  "Near-close status is old enough to risk revenue leakage before closing.",
  "Timeline staleness requires manual review and does not authorize outreach.",
];

const manualRecoveryPriorities: R58ManualRecoveryPriority[] = [
  {
    priority: "resolve_stop_signals_first",
    rank: 1,
    revenueReason: "Governance, DNC, opt-out, and human-review blockers can stop all near-close recovery work.",
    safeManualActionLanguage: "Review stop signals manually before considering any next recovery step.",
    boundary: "No override, contact, provider call, send, queue, execution, or approval-as-permission is allowed.",
  },
  {
    priority: "recover_title_or_escrow_path",
    rank: 2,
    revenueReason: "Title or escrow blockers can directly prevent cash conversion.",
    safeManualActionLanguage: "Review title and escrow status manually and identify the next human-owned clarification step.",
    boundary: "No title order, escrow trigger, provider activation, or runtime execution is allowed.",
  },
  {
    priority: "complete_closing_checklist_review",
    rank: 3,
    revenueReason: "Incomplete closing checklist items create immediate pre-closing leakage.",
    safeManualActionLanguage: "Review the closing checklist manually and mark unresolved facts as assumptions until verified.",
    boundary: "Do not imply closing readiness, legal readiness, or execution readiness.",
  },
  {
    priority: "confirm_assignment_readiness",
    rank: 4,
    revenueReason: "Assignment ambiguity can block revenue even when the deal appears late-stage.",
    safeManualActionLanguage: "Review assignment readiness manually before any seller, buyer, title, or escrow-facing work.",
    boundary: "No assignment release, buyer contact, provider contact, or send control is allowed.",
  },
  {
    priority: "recover_seller_side_response",
    rank: 5,
    revenueReason: "Stale seller response or missing signature can stall near-close revenue.",
    safeManualActionLanguage: "Review seller-side status and define the next human-owned follow-up outside this scope.",
    boundary: "No automatic follow-up, message, dialing, provider call, or outreach permission is allowed.",
  },
  {
    priority: "complete_buyer_package_review",
    rank: 6,
    revenueReason: "Incomplete buyer package can delay assignment or disposition while the deal is closest to cash.",
    safeManualActionLanguage: "Review buyer package completeness manually before any buyer-facing action.",
    boundary: "No buyer release, auto-share, contact buyer now, or approval-and-send semantics.",
  },
  {
    priority: "resolve_missing_documents",
    rank: 7,
    revenueReason: "Missing close-critical documents make near-close status unreliable.",
    safeManualActionLanguage: "Verify missing documents manually and label assumptions clearly.",
    boundary: "No document generation, persistence activation, provider activation, or fact invention is allowed.",
  },
  {
    priority: "refresh_stale_timeline",
    rank: 8,
    revenueReason: "Stale timelines hide revenue leakage before closing.",
    safeManualActionLanguage: "Refresh timeline assumptions through manual review and source-backed notes outside this scope.",
    boundary: "No polling, auto-refresh, runtime activation, or workflow mutation is allowed.",
  },
];

const safeManualNextActionWording = [
  "Review near-close blockers manually before any seller, buyer, title, escrow, or assignment-facing action.",
  "Treat near-close as a revenue-priority signal, not closing readiness or execution permission.",
  "Verify title, escrow, assignment, checklist, document, seller, buyer, and timeline facts manually.",
  "Label assumptions clearly and do not invent property, title, escrow, assignment, seller, or buyer facts.",
  "Define the next human-owned recovery step without sending, queuing, activating, polling, persisting, or calling providers.",
];

const forbiddenExecutionSemantics: R58ForbiddenExecutionSemantic[] = [
  "send now",
  "auto recover",
  "auto follow-up",
  "activate workflow",
  "approve and send",
  "queue execution",
  "provider activation",
  "autonomous outreach",
  "autonomous negotiation",
  "runtime execution",
  "persistence activation",
  "polling activation",
  "ready to close",
  "release assignment",
  "contact buyer now",
  "contact seller now",
  "trigger escrow",
  "order title automatically",
  "hidden execution affordances",
];

const governanceBoundaries = [
  "Near-close recovery intelligence is planning-only and cannot execute, send, persist, poll, or activate providers.",
  "Near-close does not mean closing-ready, assignment-ready, buyer-ready-to-contact, legal-ready, or execution-ready.",
  "Approval, human review, and recovery priority labels cannot grant permission to contact or execute.",
  "Title, escrow, assignment, seller, buyer, document, and timeline facts must be verified manually.",
  "The contract must not invent property facts or treat assumptions as verified facts.",
];

const accessibilityExpectations = [
  "Future presentation must use semantic headings and readable labels.",
  "Status meaning must be text-based and never depend on color alone.",
  "Use concise near-close categories to reduce operator cognitive load.",
  "No focus movement, motion dependency, auto-refresh, polling, or live-update noise is allowed.",
  "Recovery priorities must distinguish blockers, risks, and manual recommendations for screen-reader users.",
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

function addWarning(warningCodes: string[], warningCode: R58WarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R58NearCloseRevenueRecoveryInput) {
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

export function assertR58NearCloseRevenueRecoveryScopeInvariants(
  result: Pick<
    R58NearCloseRevenueRecoveryScopeResult,
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
): R58InvariantCheck {
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

export function summarizeR58NearCloseRevenueRecoveryScope(
  result: R58NearCloseRevenueRecoveryScopeResult,
) {
  const invariantCheck = assertR58NearCloseRevenueRecoveryScopeInvariants(result);

  return boundSummary(
    `R58A ${result.surface} status is ${result.scopeStatus}. ` +
      `${result.nearCloseDealCategories.length} near-close categories and ${result.revenueRecoverySignals.length} recovery signals are scoped. ` +
      `${result.manualRecoveryPriorities.length} manual recovery priorities are ranked. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This scope is planning-only and cannot authorize UI, routes, providers, sending, persistence, polling, automation, approval execution, autonomous outreach, negotiation, or runtime activation.",
  );
}

export function createR58NearCloseRevenueRecoveryIntelligenceScopeContract(
  input: R58NearCloseRevenueRecoveryInput = {},
): R58NearCloseRevenueRecoveryScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r58a_scope_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r57fLockdownReviewed !== true) addWarning(warningCodes, "r57f_lockdown_review_required");
  if (input.nearCloseCategoriesReviewed !== true) addWarning(warningCodes, "near_close_categories_review_required");
  if (input.revenueRecoverySignalsReviewed !== true) addWarning(warningCodes, "revenue_recovery_signal_review_required");
  if (input.closingFrictionReviewed !== true) addWarning(warningCodes, "closing_friction_review_required");
  if (input.manualRecoveryPrioritiesReviewed !== true) addWarning(warningCodes, "manual_recovery_priority_review_required");
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
    input.r57fLockdownReviewed !== true ||
    input.nearCloseCategoriesReviewed !== true ||
    input.revenueRecoverySignalsReviewed !== true ||
    input.closingFrictionReviewed !== true ||
    input.manualRecoveryPrioritiesReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R58NearCloseRevenueRecoveryScopeStatus = hasForbiddenRequest(input)
    ? "near_close_recovery_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "near_close_recovery_scope_ready";
  const result: R58NearCloseRevenueRecoveryScopeResult = {
    phase: "R58A",
    surface: "near_close_revenue_recovery_intelligence",
    scopeStatus,
    nearCloseDealCategories,
    revenueRecoverySignals,
    closingFrictionReasons,
    assignmentFrictionReasons,
    sellerSideBlockers,
    buyerSideBlockers,
    titleEscrowChecklistBlockers,
    missingDocumentBlockers,
    staleTimelineRisks,
    manualRecoveryPriorities,
    safeManualNextActionWording,
    forbiddenExecutionSemantics,
    governanceBoundaries,
    accessibilityExpectations,
    invariantAssertions,
    safetyFlags,
    warningCodes,
    rejectionReasons,
    operatorReviewRequired,
    scopeNotes,
    nextSuggestedPhase: "R58B - Near-Close Revenue Recovery Intelligence UI Scope Audit",
    summary: "R58A near-close revenue recovery intelligence scope contract only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR58NearCloseRevenueRecoveryScope(result) };
}
