export type R61BuyerReadyDispositionPriorityScopeStatus =
  | "buyer_ready_disposition_priority_scope_blocked"
  | "operator_review_required"
  | "buyer_ready_disposition_priority_scope_ready";

export type R61BuyerReadyPriorityCategory =
  | "governance_stop_review"
  | "buyer_ready_disposition_priority"
  | "near_buyer_ready_review"
  | "ready_to_package_deal"
  | "incomplete_buyer_package"
  | "buyer_fit_review_needed"
  | "buyer_demand_alignment_review"
  | "disposition_bottleneck"
  | "blocked_buyer_disposition"
  | "missing_buyer_package_data"
  | "high_probability_buyer_review"
  | "manual_disposition_review";

export type R61BuyerDispositionReadinessConcept = {
  concept:
    | "resolve_governance_stops"
    | "review_buyer_ready_priority"
    | "review_near_buyer_ready_deals"
    | "prepare_ready_to_package_deals"
    | "complete_buyer_package_gaps"
    | "review_buyer_fit"
    | "review_buyer_demand_alignment"
    | "resolve_disposition_bottlenecks"
    | "review_blocked_disposition"
    | "review_high_probability_buyer_fit";
  rank: number;
  revenueReason: string;
  safeOperatorGuidance: string;
  boundary: string;
};

export type R61BuyerFitReviewConcept =
  | "buyer_fit_review_needed"
  | "buyer_demand_alignment_review"
  | "high_probability_buyer_review"
  | "strategy_match_review"
  | "price_band_review"
  | "property_type_review"
  | "market_area_review"
  | "rent_arv_repair_context_review"
  | "manual_buyer_match_review_only";

export type R61PackageCompletenessConcept =
  | "missing_assignment_data"
  | "missing_title_data"
  | "missing_photo_data"
  | "missing_repair_data"
  | "missing_arv_data"
  | "missing_rent_data"
  | "missing_strategy_data"
  | "incomplete_buyer_package"
  | "ready_to_package_manual_review";

export type R61ForbiddenExecutionSemantic =
  | "send to buyers"
  | "blast buyers"
  | "auto email buyers"
  | "auto SMS buyers"
  | "launch buyer campaign"
  | "activate buyer outreach"
  | "queue buyer execution"
  | "match and send automatically"
  | "approve and send"
  | "execute disposition workflow"
  | "release buyer automation"
  | "autonomous buyer negotiation"
  | "provider activation"
  | "hidden execution semantics";

export type R61BuyerReadyDispositionPriorityWarningCode =
  | "r61a_scope_contract_only"
  | "input_missing"
  | "r60f_lockdown_review_required"
  | "buyer_ready_priority_review_required"
  | "disposition_readiness_review_required"
  | "buyer_fit_review_required"
  | "package_completeness_review_required"
  | "governance_boundary_review_required"
  | "accessibility_review_required"
  | "operator_review_required"
  | "ui_implementation_rejected"
  | "route_change_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "email_sms_sending_rejected"
  | "buyer_outreach_execution_rejected"
  | "seller_outreach_execution_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "execution_control_rejected"
  | "redesign_rejected"
  | "autonomous_buyer_outreach_rejected"
  | "autonomous_seller_outreach_rejected"
  | "autonomous_negotiation_rejected"
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

export type R61BuyerReadyDispositionPriorityInput = {
  r60fLockdownReviewed?: boolean;
  buyerReadyPrioritiesReviewed?: boolean;
  dispositionReadinessReviewed?: boolean;
  buyerFitReviewed?: boolean;
  packageCompletenessReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiImplementationRequested?: boolean;
  routeChangeRequested?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  emailSmsSendingRequested?: boolean;
  buyerOutreachExecutionRequested?: boolean;
  sellerOutreachExecutionRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  executionControlRequested?: boolean;
  redesignRequested?: boolean;
  autonomousBuyerOutreachRequested?: boolean;
  autonomousSellerOutreachRequested?: boolean;
  autonomousNegotiationRequested?: boolean;
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

export type R61BuyerReadyDispositionPrioritySafetyFlags = {
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

export type R61BuyerReadyDispositionPriorityScopeResult = R61BuyerReadyDispositionPrioritySafetyFlags & {
  phase: "R61A";
  surface: "buyer_ready_disposition_priority_intelligence";
  scopeStatus: R61BuyerReadyDispositionPriorityScopeStatus;
  buyerReadyPriorityCategories: R61BuyerReadyPriorityCategory[];
  dispositionReadinessConcepts: R61BuyerDispositionReadinessConcept[];
  buyerFitReviewConcepts: R61BuyerFitReviewConcept[];
  packageCompletenessConcepts: R61PackageCompletenessConcept[];
  nearBuyerReadyConcepts: string[];
  blockedDispositionConcepts: string[];
  missingBuyerPackageDataConcepts: string[];
  safeOperatorGuidanceConcepts: string[];
  allowedFutureVisibilityConcepts: string[];
  forbiddenExecutionSemantics: R61ForbiddenExecutionSemantic[];
  governanceBoundaries: string[];
  readinessBoundaries: string[];
  accessibilityRequirements: string[];
  invariantAssertions: string[];
  safetyFlags: R61BuyerReadyDispositionPrioritySafetyFlags;
  warningCodes: string[];
  rejectionReasons: string[];
  operatorReviewRequired: boolean;
  scopeNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R61BuyerReadyDispositionPriorityInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R61BuyerReadyDispositionPrioritySafetyFlags = {
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

const buyerReadyPriorityCategories: R61BuyerReadyPriorityCategory[] = [
  "governance_stop_review",
  "buyer_ready_disposition_priority",
  "near_buyer_ready_review",
  "ready_to_package_deal",
  "incomplete_buyer_package",
  "buyer_fit_review_needed",
  "buyer_demand_alignment_review",
  "disposition_bottleneck",
  "blocked_buyer_disposition",
  "missing_buyer_package_data",
  "high_probability_buyer_review",
  "manual_disposition_review",
];

const dispositionReadinessConcepts: R61BuyerDispositionReadinessConcept[] = [
  {
    concept: "resolve_governance_stops",
    rank: 1,
    revenueReason: "Governance stops can block buyer disposition review and must outrank buyer-readiness or urgency.",
    safeOperatorGuidance: "Review governance stop signals before package preparation or buyer-fit review.",
    boundary: "No override, outreach, sending, package release, provider activation, or approval-as-permission is allowed.",
  },
  {
    concept: "review_buyer_ready_priority",
    rank: 2,
    revenueReason: "Buyer-ready disposition priority can move revenue-producing deals faster when manually reviewed.",
    safeOperatorGuidance: "Buyer-ready means manual review and package preparation may be prioritized.",
    boundary: "Buyer-ready does not mean send, contact buyers, launch outreach, or execute disposition workflow.",
  },
  {
    concept: "review_near_buyer_ready_deals",
    rank: 3,
    revenueReason: "Near-buyer-ready deals may have small gaps that block revenue if not reviewed promptly.",
    safeOperatorGuidance: "Review remaining package or fit gaps before any buyer-facing action outside this scope.",
    boundary: "No match-and-send, buyer campaign, provider activation, persistence, polling, or automation.",
  },
  {
    concept: "prepare_ready_to_package_deals",
    rank: 4,
    revenueReason: "Ready-to-package deals can reduce disposition delay when package materials are reviewed manually.",
    safeOperatorGuidance: "Operator package-prep guidance is advisory and must remain inside manual review.",
    boundary: "No auto-share, blast, email, SMS, package release, or buyer outreach execution.",
  },
  {
    concept: "complete_buyer_package_gaps",
    rank: 5,
    revenueReason: "Incomplete package data can create disposition bottlenecks and hide revenue leakage.",
    safeOperatorGuidance: "Complete missing assignment, title, photos, repair, ARV, rent, or strategy data manually.",
    boundary: "No fact invention, enrichment activation, scraping, persistence, provider call, or workflow mutation.",
  },
  {
    concept: "review_buyer_fit",
    rank: 6,
    revenueReason: "Buyer-fit review can focus operator attention on deals likely to match known demand.",
    safeOperatorGuidance: "Buyer-fit review needed means inspect demand context manually.",
    boundary: "No autonomous matching, sending, negotiation, buyer outreach, or buyer-ready-to-contact claim.",
  },
  {
    concept: "review_buyer_demand_alignment",
    rank: 7,
    revenueReason: "Demand alignment can improve disposition focus when strategy, market, price, and property type are reviewed.",
    safeOperatorGuidance: "Review buyer demand alignment as an advisory label only.",
    boundary: "No campaign launch, buyer blast, provider activation, or execution queue.",
  },
  {
    concept: "resolve_disposition_bottlenecks",
    rank: 8,
    revenueReason: "Disposition bottlenecks can delay revenue even when acquisition work is otherwise strong.",
    safeOperatorGuidance: "Disposition bottleneck means manual review of blocked package, fit, or data gaps.",
    boundary: "No task mutation, workflow activation, polling, runtime activation, or auto disposition.",
  },
  {
    concept: "review_blocked_disposition",
    rank: 9,
    revenueReason: "Blocked buyer disposition can signal governance, package, title, assignment, or buyer-fit issues.",
    safeOperatorGuidance: "Blocked disposition requires human review before any next step.",
    boundary: "No approval-to-send escalation, provider activation, automated buyer outreach, or negotiation.",
  },
  {
    concept: "review_high_probability_buyer_fit",
    rank: 10,
    revenueReason: "High-probability buyer review can help operators focus on deals with likely manual disposition value.",
    safeOperatorGuidance: "High-probability buyer review is a prioritization label, not a contact instruction.",
    boundary: "No autonomous buyer outreach, match-and-send, release automation, or provider connectivity.",
  },
];

const buyerFitReviewConcepts: R61BuyerFitReviewConcept[] = [
  "buyer_fit_review_needed",
  "buyer_demand_alignment_review",
  "high_probability_buyer_review",
  "strategy_match_review",
  "price_band_review",
  "property_type_review",
  "market_area_review",
  "rent_arv_repair_context_review",
  "manual_buyer_match_review_only",
];

const packageCompletenessConcepts: R61PackageCompletenessConcept[] = [
  "missing_assignment_data",
  "missing_title_data",
  "missing_photo_data",
  "missing_repair_data",
  "missing_arv_data",
  "missing_rent_data",
  "missing_strategy_data",
  "incomplete_buyer_package",
  "ready_to_package_manual_review",
];

const nearBuyerReadyConcepts = [
  "Near-buyer-ready means a deal may be close to package preparation after human review.",
  "Near-buyer-ready can include mostly complete package data with one or more manual verification gaps.",
  "Near-buyer-ready does not mean buyer-ready-to-contact, send-ready, campaign-ready, or automation-ready.",
];

const blockedDispositionConcepts = [
  "Governance stop unresolved.",
  "Incomplete buyer package data.",
  "Missing or unclear assignment, title, photos, repair, ARV, rent, or strategy context.",
  "Buyer-fit assumptions require manual verification.",
  "Disposition bottleneck or human review required before package preparation.",
];

const missingBuyerPackageDataConcepts = [
  "Missing assignment data.",
  "Missing title data.",
  "Missing photos.",
  "Missing repair scope or repair assumptions.",
  "Missing ARV context.",
  "Missing rent context.",
  "Missing disposition strategy data.",
  "Missing buyer demand or fit review context.",
];

const safeOperatorGuidanceConcepts = [
  "manual disposition review recommended",
  "operator package-prep guidance",
  "buyer-fit review needed",
  "buyer demand alignment review",
  "near-buyer-ready review",
  "incomplete buyer package",
  "governance stop signals must be resolved first",
  "Buyer-ready does not mean send; it means manual review and package preparation may be prioritized.",
  "Use this scope for advisory buyer disposition prioritization only; it does not send, blast, email, SMS, persist, poll, activate providers, negotiate, or execute workflows.",
];

const allowedFutureVisibilityConcepts = [
  "buyer-ready disposition priority",
  "near-buyer-ready review",
  "ready-to-package deal",
  "incomplete buyer package",
  "buyer-fit review needed",
  "buyer demand alignment review",
  "disposition bottleneck",
  "blocked buyer disposition",
  "missing assignment/title/photos/repair/ARV/rent/strategy data",
  "high-probability buyer review",
  "manual disposition review recommended",
  "operator package-prep guidance",
  "governance stop signals",
];

const forbiddenExecutionSemantics: R61ForbiddenExecutionSemantic[] = [
  "send to buyers",
  "blast buyers",
  "auto email buyers",
  "auto SMS buyers",
  "launch buyer campaign",
  "activate buyer outreach",
  "queue buyer execution",
  "match and send automatically",
  "approve and send",
  "execute disposition workflow",
  "release buyer automation",
  "autonomous buyer negotiation",
  "provider activation",
  "hidden execution semantics",
];

const governanceBoundaries = [
  "Buyer-ready disposition priority intelligence is scope-contract-only and cannot implement UI, routes, providers, persistence, polling, automation, or runtime activation.",
  "Governance stop signals must always outrank buyer-readiness, buyer-fit, demand alignment, package completeness, and urgency.",
  "Buyer-ready, near-buyer-ready, ready-to-package, buyer-fit, and high-probability labels cannot grant permission to contact buyers or send packages.",
  "Approval and human review states cannot become permission to execute buyer outreach, seller outreach, package release, negotiation, or workflow mutation.",
  "All property, buyer-fit, assignment, title, photo, repair, ARV, rent, strategy, and demand facts must be manually verified.",
  "Assumptions must be labeled clearly and no property facts may be invented.",
];

const readinessBoundaries = [
  "Buyer-ready does not mean send.",
  "Buyer-ready means manual review and package preparation may be prioritized.",
  "Near-buyer-ready does not mean buyer-ready-to-contact.",
  "Ready-to-package does not release a buyer package or authorize outreach.",
  "Buyer-fit review does not mean autonomous matching, buyer contact, or negotiation.",
];

const accessibilityRequirements = [
  "Future presentation must use semantic headings.",
  "Buyer-ready, near-buyer-ready, blocked, missing-data, package, fit, and governance labels must be readable.",
  "Status meaning must be text-based and never depend on color alone.",
  "No motion dependency, focus movement, polling, auto-refresh, or live-update noise is allowed.",
  "Use concise wording and screen-reader-friendly summaries for buyer disposition priority categories.",
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
  "Governance stop signals must outrank buyer-readiness and urgency.",
  "Buyer-ready must mean manual review and package preparation only.",
  "No buyer outreach, seller outreach, sending, provider activation, autonomous negotiation, or execution controls may be authorized.",
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

function addWarning(warningCodes: string[], warningCode: R61BuyerReadyDispositionPriorityWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R61BuyerReadyDispositionPriorityInput) {
  return (
    input.uiImplementationRequested === true ||
    input.routeChangeRequested === true ||
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.emailSmsSendingRequested === true ||
    input.buyerOutreachExecutionRequested === true ||
    input.sellerOutreachExecutionRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.executionControlRequested === true ||
    input.redesignRequested === true ||
    input.autonomousBuyerOutreachRequested === true ||
    input.autonomousSellerOutreachRequested === true ||
    input.autonomousNegotiationRequested === true ||
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

export function assertR61BuyerReadyDispositionPriorityScopeInvariants(
  result: Pick<
    R61BuyerReadyDispositionPriorityScopeResult,
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
): R61BuyerReadyDispositionPriorityInvariantCheck {
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

export function summarizeR61BuyerReadyDispositionPriorityScope(
  result: R61BuyerReadyDispositionPriorityScopeResult,
) {
  const invariantCheck = assertR61BuyerReadyDispositionPriorityScopeInvariants(result);

  return boundSummary(
    `R61A ${result.surface} status is ${result.scopeStatus}. ` +
      `${result.buyerReadyPriorityCategories.length} buyer-ready priority categories and ${result.dispositionReadinessConcepts.length} disposition readiness concepts are scoped. ` +
      `${result.packageCompletenessConcepts.length} package completeness concepts and ${result.buyerFitReviewConcepts.length} buyer-fit concepts are defined. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This scope is planning-only and cannot authorize UI, routes, providers, buyer outreach, seller outreach, sending, persistence, polling, automation, approval execution, autonomous negotiation, queue execution, package release, or runtime activation.",
  );
}

export function createR61BuyerReadyDispositionPriorityScopeContract(
  input: R61BuyerReadyDispositionPriorityInput = {},
): R61BuyerReadyDispositionPriorityScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r61a_scope_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r60fLockdownReviewed !== true) addWarning(warningCodes, "r60f_lockdown_review_required");
  if (input.buyerReadyPrioritiesReviewed !== true) addWarning(warningCodes, "buyer_ready_priority_review_required");
  if (input.dispositionReadinessReviewed !== true) {
    addWarning(warningCodes, "disposition_readiness_review_required");
  }
  if (input.buyerFitReviewed !== true) addWarning(warningCodes, "buyer_fit_review_required");
  if (input.packageCompletenessReviewed !== true) {
    addWarning(warningCodes, "package_completeness_review_required");
  }
  if (input.governanceBoundaryReviewed !== true) addWarning(warningCodes, "governance_boundary_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.uiImplementationRequested === true) addWarning(warningCodes, "ui_implementation_rejected");
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.emailSmsSendingRequested === true) addWarning(warningCodes, "email_sms_sending_rejected");
  if (input.buyerOutreachExecutionRequested === true) addWarning(warningCodes, "buyer_outreach_execution_rejected");
  if (input.sellerOutreachExecutionRequested === true) addWarning(warningCodes, "seller_outreach_execution_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.executionControlRequested === true) addWarning(warningCodes, "execution_control_rejected");
  if (input.redesignRequested === true) addWarning(warningCodes, "redesign_rejected");
  if (input.autonomousBuyerOutreachRequested === true) {
    addWarning(warningCodes, "autonomous_buyer_outreach_rejected");
  }
  if (input.autonomousSellerOutreachRequested === true) {
    addWarning(warningCodes, "autonomous_seller_outreach_rejected");
  }
  if (input.autonomousNegotiationRequested === true) addWarning(warningCodes, "autonomous_negotiation_rejected");
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
    input.r60fLockdownReviewed !== true ||
    input.buyerReadyPrioritiesReviewed !== true ||
    input.dispositionReadinessReviewed !== true ||
    input.buyerFitReviewed !== true ||
    input.packageCompletenessReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R61BuyerReadyDispositionPriorityScopeStatus = hasForbiddenRequest(input)
    ? "buyer_ready_disposition_priority_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "buyer_ready_disposition_priority_scope_ready";
  const result: R61BuyerReadyDispositionPriorityScopeResult = {
    phase: "R61A",
    surface: "buyer_ready_disposition_priority_intelligence",
    scopeStatus,
    buyerReadyPriorityCategories,
    dispositionReadinessConcepts,
    buyerFitReviewConcepts,
    packageCompletenessConcepts,
    nearBuyerReadyConcepts,
    blockedDispositionConcepts,
    missingBuyerPackageDataConcepts,
    safeOperatorGuidanceConcepts,
    allowedFutureVisibilityConcepts,
    forbiddenExecutionSemantics,
    governanceBoundaries,
    readinessBoundaries,
    accessibilityRequirements,
    invariantAssertions,
    safetyFlags,
    warningCodes,
    rejectionReasons,
    operatorReviewRequired,
    scopeNotes,
    nextSuggestedPhase: "R61B - Buyer-Ready Disposition Priority Intelligence UI Scope Audit",
    summary: "R61A buyer-ready disposition priority intelligence scope contract only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR61BuyerReadyDispositionPriorityScope(result) };
}
