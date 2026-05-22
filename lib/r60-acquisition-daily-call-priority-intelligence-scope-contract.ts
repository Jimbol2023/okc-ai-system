export type R60AcquisitionDailyCallPriorityScopeStatus =
  | "acquisition_daily_call_priority_scope_blocked"
  | "operator_review_required"
  | "acquisition_daily_call_priority_scope_ready";

export type R60AcquisitionDailyCallPriorityCategory =
  | "governance_stop_review"
  | "highest_probability_seller_review"
  | "urgent_seller_follow_up"
  | "overdue_manual_follow_up"
  | "seller_momentum_risk"
  | "lead_decay_risk"
  | "high_motivation_seller_review"
  | "missing_acquisition_data"
  | "deal_readiness_review"
  | "acquisition_bottleneck_review";

export type R60SellerRevenuePriorityConcept = {
  concept:
    | "resolve_governance_stops"
    | "review_high_probability_sellers"
    | "review_urgent_seller_momentum"
    | "review_overdue_follow_up"
    | "review_lead_decay_risk"
    | "review_high_motivation_context"
    | "resolve_missing_acquisition_data"
    | "review_deal_readiness"
    | "review_acquisition_bottlenecks";
  rank: number;
  revenueReason: string;
  safeManualGuidance: string;
  boundary: string;
};

export type R60ManualCallReviewPriorityConcept =
  | "manual_call_review_recommended"
  | "seller_follow_up_priority"
  | "operator_review_recommended"
  | "high_priority_seller_review"
  | "seller_momentum_risk"
  | "lead_decay_risk"
  | "missing_acquisition_data"
  | "acquisition_bottleneck"
  | "manual_next_step_guidance"
  | "call_priority_label_is_advisory_only";

export type R60ForbiddenExecutionSemantic =
  | "call now"
  | "auto call"
  | "auto dial"
  | "send SMS"
  | "send email"
  | "auto follow-up"
  | "activate campaign"
  | "launch dialer"
  | "queue execution"
  | "provider activation"
  | "autonomous outreach"
  | "autonomous negotiation"
  | "approve and send"
  | "execute call workflow"
  | "release automation"
  | "hidden execution semantics";

export type R60AcquisitionDailyCallPriorityWarningCode =
  | "r60a_scope_contract_only"
  | "input_missing"
  | "r59f_lockdown_review_required"
  | "priority_category_review_required"
  | "seller_revenue_priority_review_required"
  | "manual_call_review_priority_review_required"
  | "lead_decay_urgency_review_required"
  | "deal_readiness_review_required"
  | "acquisition_bottleneck_review_required"
  | "governance_boundary_review_required"
  | "accessibility_review_required"
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

export type R60AcquisitionDailyCallPriorityInput = {
  r59fLockdownReviewed?: boolean;
  priorityCategoriesReviewed?: boolean;
  sellerRevenuePrioritiesReviewed?: boolean;
  manualCallReviewPrioritiesReviewed?: boolean;
  leadDecayUrgencyReviewed?: boolean;
  dealReadinessReviewed?: boolean;
  acquisitionBottlenecksReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
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
  extraScopeNotes?: string[];
};

export type R60AcquisitionDailyCallPrioritySafetyFlags = {
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

export type R60AcquisitionDailyCallPriorityScopeResult = R60AcquisitionDailyCallPrioritySafetyFlags & {
  phase: "R60A";
  surface: "acquisition_daily_call_priority_intelligence";
  scopeStatus: R60AcquisitionDailyCallPriorityScopeStatus;
  acquisitionDailyCallPriorityCategories: R60AcquisitionDailyCallPriorityCategory[];
  sellerRevenuePriorityRankingConcepts: R60SellerRevenuePriorityConcept[];
  manualCallReviewPriorityConcepts: R60ManualCallReviewPriorityConcept[];
  sellerUrgencyConcepts: string[];
  overdueFollowUpConcepts: string[];
  staleLeadDecayConcepts: string[];
  highMotivationSellerConcepts: string[];
  missingSellerPropertyDataConcepts: string[];
  dealReadinessReviewConcepts: string[];
  acquisitionBottleneckConcepts: string[];
  governanceStopSignals: string[];
  safeManualGuidanceWording: string[];
  forbiddenExecutionSemantics: R60ForbiddenExecutionSemantic[];
  governanceBoundaries: string[];
  accessibilityRequirements: string[];
  invariantAssertions: string[];
  safetyFlags: R60AcquisitionDailyCallPrioritySafetyFlags;
  warningCodes: string[];
  rejectionReasons: string[];
  operatorReviewRequired: boolean;
  scopeNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R60AcquisitionDailyCallPriorityInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R60AcquisitionDailyCallPrioritySafetyFlags = {
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

const acquisitionDailyCallPriorityCategories: R60AcquisitionDailyCallPriorityCategory[] = [
  "governance_stop_review",
  "highest_probability_seller_review",
  "urgent_seller_follow_up",
  "overdue_manual_follow_up",
  "seller_momentum_risk",
  "lead_decay_risk",
  "high_motivation_seller_review",
  "missing_acquisition_data",
  "deal_readiness_review",
  "acquisition_bottleneck_review",
];

const sellerRevenuePriorityRankingConcepts: R60SellerRevenuePriorityConcept[] = [
  {
    concept: "resolve_governance_stops",
    rank: 1,
    revenueReason: "Governance stops can block seller contact review and must be checked before any call-priority label.",
    safeManualGuidance: "Operator review recommended before any seller call planning outside the app.",
    boundary: "No override, provider call, dialing, sending, campaign activation, or approval-as-permission is allowed.",
  },
  {
    concept: "review_high_probability_sellers",
    rank: 2,
    revenueReason: "High-probability seller records can create near-term acquisition revenue when reviewed manually.",
    safeManualGuidance: "High-priority seller review means inspect the record and decide manually.",
    boundary: "No call now control, auto dial, send SMS, send email, queue execution, or provider activation.",
  },
  {
    concept: "review_urgent_seller_momentum",
    rank: 3,
    revenueReason: "Seller urgency and recent momentum can decay quickly when manual follow-up is delayed.",
    safeManualGuidance: "Seller follow-up priority is a daily review label only.",
    boundary: "No autonomous outreach, call workflow execution, campaign launch, or automatic follow-up.",
  },
  {
    concept: "review_overdue_follow_up",
    rank: 4,
    revenueReason: "Overdue manual follow-up can leak acquisition revenue when a seller is waiting on human response.",
    safeManualGuidance: "Manual call review recommended for overdue follow-up context.",
    boundary: "No dialing, messaging, provider activation, persistence, polling, or workflow mutation.",
  },
  {
    concept: "review_lead_decay_risk",
    rank: 5,
    revenueReason: "Older open leads can lose seller-side momentum and need human triage before they go cold.",
    safeManualGuidance: "Lead decay risk should remain a review label, not an automated action.",
    boundary: "No auto follow-up, activation, retry, queue execution, or autonomous negotiation.",
  },
  {
    concept: "review_high_motivation_context",
    rank: 6,
    revenueReason: "Motivation, timeline, distress, or urgency language can indicate higher acquisition value when verified.",
    safeManualGuidance: "Review assumptions and seller context manually before deciding next steps.",
    boundary: "No invented property facts, no pressure claims, no provider calls, and no contact permission.",
  },
  {
    concept: "resolve_missing_acquisition_data",
    rank: 7,
    revenueReason: "Missing seller, property, source, phone, motivation, or timeline data makes call priority unreliable.",
    safeManualGuidance: "Missing acquisition data should be labeled for human verification.",
    boundary: "No enrichment activation, scraping, persistence, provider activation, or fact invention.",
  },
  {
    concept: "review_deal_readiness",
    rank: 8,
    revenueReason: "Deal-readiness review can identify leads with enough context for manual operator attention.",
    safeManualGuidance: "Deal-readiness review is advisory and does not authorize seller contact.",
    boundary: "No execution controls, outreach, approval-as-contact permission, or readiness guarantee.",
  },
  {
    concept: "review_acquisition_bottlenecks",
    rank: 9,
    revenueReason: "Acquisition bottlenecks can block seller conversion across many otherwise valuable leads.",
    safeManualGuidance: "Acquisition bottleneck means manual next step guidance only.",
    boundary: "No task mutation, workflow activation, assignment automation, polling, or runtime activation.",
  },
];

const manualCallReviewPriorityConcepts: R60ManualCallReviewPriorityConcept[] = [
  "manual_call_review_recommended",
  "seller_follow_up_priority",
  "operator_review_recommended",
  "high_priority_seller_review",
  "seller_momentum_risk",
  "lead_decay_risk",
  "missing_acquisition_data",
  "acquisition_bottleneck",
  "manual_next_step_guidance",
  "call_priority_label_is_advisory_only",
];

const sellerUrgencyConcepts = [
  "Seller urgency may be inferred only from existing seller-provided context and must be treated as an assumption for human review.",
  "Recent seller response, short timeline, stated motivation, or pending manual follow-up may increase review priority.",
  "Urgency labels must not pressure sellers, imply legal advice, or authorize contact execution.",
];

const overdueFollowUpConcepts = [
  "Overdue manual follow-up may raise daily call review priority.",
  "Pending follow-up without a seller outcome may indicate revenue leakage risk.",
  "Overdue status is advisory and cannot dial, text, email, schedule, persist, or trigger a workflow.",
];

const staleLeadDecayConcepts = [
  "Open leads with stale seller momentum may receive a lead decay risk label.",
  "Older open records with no next step, seller reply, or follow-up context may need operator review.",
  "Lead decay labels must remain manual-priority guidance and cannot launch reactivation campaigns.",
];

const highMotivationSellerConcepts = [
  "High-motivation seller review may consider seller-provided urgency, distress, timeline, price sensitivity, or repeated engagement.",
  "Motivation labels require human verification and must label assumptions clearly.",
  "No property facts, seller facts, or motivation facts may be invented.",
];

const missingSellerPropertyDataConcepts = [
  "Missing acquisition data includes missing lead source, phone, property address, seller context, motivation, timeline, or next-step details.",
  "Missing property or seller data can lower confidence and require manual verification before prioritizing contact.",
  "Missing-data visibility cannot trigger enrichment, provider calls, scraping, persistence, or workflow mutation.",
];

const dealReadinessReviewConcepts = [
  "Deal-readiness review means the record may have enough context for manual operator evaluation.",
  "Deal-readiness review may consider status, source, seller response, follow-up freshness, motivation, and missing data.",
  "Deal-readiness review does not mean approved to call, ready to contact, ready to offer, or ready to execute.",
];

const acquisitionBottleneckConcepts = [
  "Governance stop unresolved.",
  "Seller follow-up overdue.",
  "Missing seller or property data.",
  "No manual next step present.",
  "Stale open lead without seller momentum.",
  "High-motivation context awaiting human review.",
];

const governanceStopSignals = [
  "Do-not-contact or opt-out state.",
  "Human-review-required state.",
  "Rejected or blocked approval state.",
  "Missing consent or unclear contact permission.",
  "Any governance stop must appear before seller call priority guidance.",
];

const safeManualGuidanceWording = [
  "manual call review recommended",
  "seller follow-up priority",
  "operator review recommended",
  "high-priority seller review",
  "seller momentum risk",
  "lead decay risk",
  "missing acquisition data",
  "acquisition bottleneck",
  "manual next step guidance",
  "call priority label is advisory only",
  "Use this scope for daily manual prioritization only; it does not call, dial, send, persist, poll, activate providers, negotiate, launch campaigns, or execute workflows.",
];

const forbiddenExecutionSemantics: R60ForbiddenExecutionSemantic[] = [
  "call now",
  "auto call",
  "auto dial",
  "send SMS",
  "send email",
  "auto follow-up",
  "activate campaign",
  "launch dialer",
  "queue execution",
  "provider activation",
  "autonomous outreach",
  "autonomous negotiation",
  "approve and send",
  "execute call workflow",
  "release automation",
  "hidden execution semantics",
];

const governanceBoundaries = [
  "Acquisition daily call priority intelligence is planning-only and cannot implement UI, routes, providers, persistence, polling, automation, or runtime activation.",
  "Call priority labels are advisory only and cannot grant permission to call, dial, text, email, negotiate, send, queue, or activate providers.",
  "Approval, review, urgency, deal-readiness, and follow-up states cannot become permission to execute outreach.",
  "All property, seller, motivation, timeline, and deal-readiness facts must be manually verified.",
  "Assumptions must be labeled clearly and no property facts may be invented.",
];

const accessibilityRequirements = [
  "Future presentation must use semantic headings.",
  "Call priority labels, counts, statuses, seller urgency, decay, and missing-data meanings must use readable labels.",
  "Status meaning must be text-based and never depend on color alone.",
  "No motion dependency, focus movement, polling, auto-refresh, or live-update noise is allowed.",
  "Use concise wording and screen-reader-friendly summaries for daily seller priority categories.",
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
  "No call, dialer, SMS, email, campaign, provider, or workflow execution may be authorized.",
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

function addWarning(warningCodes: string[], warningCode: R60AcquisitionDailyCallPriorityWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R60AcquisitionDailyCallPriorityInput) {
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

export function assertR60AcquisitionDailyCallPriorityScopeInvariants(
  result: Pick<
    R60AcquisitionDailyCallPriorityScopeResult,
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
): R60AcquisitionDailyCallPriorityInvariantCheck {
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

export function summarizeR60AcquisitionDailyCallPriorityScope(
  result: R60AcquisitionDailyCallPriorityScopeResult,
) {
  const invariantCheck = assertR60AcquisitionDailyCallPriorityScopeInvariants(result);

  return boundSummary(
    `R60A ${result.surface} status is ${result.scopeStatus}. ` +
      `${result.acquisitionDailyCallPriorityCategories.length} acquisition call priority categories and ${result.sellerRevenuePriorityRankingConcepts.length} seller-side ranking concepts are scoped. ` +
      `${result.manualCallReviewPriorityConcepts.length} manual call/review priority concepts are defined. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This scope is planning-only and cannot authorize UI, routes, providers, calls, dialing, SMS, email, persistence, polling, campaigns, automation, approval execution, autonomous outreach, negotiation, queue execution, or runtime activation.",
  );
}

export function createR60AcquisitionDailyCallPriorityIntelligenceScopeContract(
  input: R60AcquisitionDailyCallPriorityInput = {},
): R60AcquisitionDailyCallPriorityScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r60a_scope_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r59fLockdownReviewed !== true) addWarning(warningCodes, "r59f_lockdown_review_required");
  if (input.priorityCategoriesReviewed !== true) addWarning(warningCodes, "priority_category_review_required");
  if (input.sellerRevenuePrioritiesReviewed !== true) {
    addWarning(warningCodes, "seller_revenue_priority_review_required");
  }
  if (input.manualCallReviewPrioritiesReviewed !== true) {
    addWarning(warningCodes, "manual_call_review_priority_review_required");
  }
  if (input.leadDecayUrgencyReviewed !== true) addWarning(warningCodes, "lead_decay_urgency_review_required");
  if (input.dealReadinessReviewed !== true) addWarning(warningCodes, "deal_readiness_review_required");
  if (input.acquisitionBottlenecksReviewed !== true) {
    addWarning(warningCodes, "acquisition_bottleneck_review_required");
  }
  if (input.governanceBoundaryReviewed !== true) addWarning(warningCodes, "governance_boundary_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
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
    input.r59fLockdownReviewed !== true ||
    input.priorityCategoriesReviewed !== true ||
    input.sellerRevenuePrioritiesReviewed !== true ||
    input.manualCallReviewPrioritiesReviewed !== true ||
    input.leadDecayUrgencyReviewed !== true ||
    input.dealReadinessReviewed !== true ||
    input.acquisitionBottlenecksReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R60AcquisitionDailyCallPriorityScopeStatus = hasForbiddenRequest(input)
    ? "acquisition_daily_call_priority_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "acquisition_daily_call_priority_scope_ready";
  const result: R60AcquisitionDailyCallPriorityScopeResult = {
    phase: "R60A",
    surface: "acquisition_daily_call_priority_intelligence",
    scopeStatus,
    acquisitionDailyCallPriorityCategories,
    sellerRevenuePriorityRankingConcepts,
    manualCallReviewPriorityConcepts,
    sellerUrgencyConcepts,
    overdueFollowUpConcepts,
    staleLeadDecayConcepts,
    highMotivationSellerConcepts,
    missingSellerPropertyDataConcepts,
    dealReadinessReviewConcepts,
    acquisitionBottleneckConcepts,
    governanceStopSignals,
    safeManualGuidanceWording,
    forbiddenExecutionSemantics,
    governanceBoundaries,
    accessibilityRequirements,
    invariantAssertions,
    safetyFlags,
    warningCodes,
    rejectionReasons,
    operatorReviewRequired,
    scopeNotes,
    nextSuggestedPhase: "R60B - Acquisition Daily Call Priority Intelligence UI Scope Audit",
    summary: "R60A acquisition daily call priority intelligence scope contract only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR60AcquisitionDailyCallPriorityScope(result) };
}
