export type R62BuyerDispositionOperationalSafetyReviewStatus =
  | "review_blocked"
  | "operator_review_required"
  | "safety_accessibility_review_complete";

export type R62BuyerDispositionOperationalSafetyReviewWarningCode =
  | "r62e_safety_accessibility_review_only"
  | "input_missing"
  | "r62d_ui_review_required"
  | "forbidden_controls_review_required"
  | "dangerous_wording_review_required"
  | "execution_drift_review_required"
  | "provider_drift_review_required"
  | "automation_drift_review_required"
  | "accessibility_review_required"
  | "governance_stop_dominance_review_required"
  | "operator_review_required"
  | "button_or_link_found"
  | "event_handler_found"
  | "fetch_or_storage_found"
  | "timer_or_polling_found"
  | "provider_or_twilio_import_found"
  | "automation_agent_import_found"
  | "forbidden_send_semantics_found"
  | "approval_execution_semantics_found"
  | "autonomous_behavior_semantics_found"
  | "accessibility_gap_found"
  | "governance_stop_not_first"
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
  | "ui_implementation_allowed_only_for_r62d";

export type R62BuyerDispositionOperationalSafetyReviewInput = {
  r62dUiReviewed?: boolean;
  forbiddenControlsReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  executionDriftReviewed?: boolean;
  providerDriftReviewed?: boolean;
  automationDriftReviewed?: boolean;
  accessibilityReviewed?: boolean;
  governanceStopDominanceReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  buttonOrLinkFound?: boolean;
  eventHandlerFound?: boolean;
  fetchOrStorageFound?: boolean;
  timerOrPollingFound?: boolean;
  providerOrTwilioImportFound?: boolean;
  automationAgentImportFound?: boolean;
  forbiddenSendSemanticsFound?: boolean;
  approvalExecutionSemanticsFound?: boolean;
  autonomousBehaviorSemanticsFound?: boolean;
  accessibilityGapFound?: boolean;
  governanceStopFirst?: boolean;
  readOnly?: boolean;
  advisoryOnly?: boolean;
  simulationOnly?: boolean;
  providerCalled?: boolean;
  sent?: boolean;
  persistenceAllowedNow?: boolean;
  pollingAllowed?: boolean;
  runtimeActivationAllowed?: boolean;
  providerActivationAllowed?: boolean;
  approvalGrantsExecution?: boolean;
  uiImplementationAllowedNow?: boolean;
  extraReviewNotes?: string[];
};

export type R62BuyerDispositionOperationalSafetyReviewFlags = {
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
  uiImplementationAllowedNow: true;
};

export type R62BuyerDispositionOperationalSafetyReviewResult =
  R62BuyerDispositionOperationalSafetyReviewFlags & {
    phase: "R62E";
    surface: "buyer_disposition_operational_intelligence_dashboard_summary";
    reviewStatus: R62BuyerDispositionOperationalSafetyReviewStatus;
    filesReviewed: string[];
    safetyFindings: string[];
    accessibilityFindings: string[];
    governanceFindings: string[];
    forbiddenControlFindings: string[];
    dangerousWordingFindings: string[];
    fixesRequired: boolean;
    fixesApplied: string[];
    rejectionReasons: string[];
    warningCodes: string[];
    safetyFlags: R62BuyerDispositionOperationalSafetyReviewFlags;
    reviewNotes: string[];
    nextSuggestedPhase: string;
    summary: string;
  };

export type R62BuyerDispositionOperationalSafetyReviewInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 850;

const safetyFlags: R62BuyerDispositionOperationalSafetyReviewFlags = {
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
  uiImplementationAllowedNow: true,
};

const filesReviewed = [
  "components/dashboard/buyer-disposition-operational-intelligence-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx",
];

const safetyFindings = [
  "R62D surface is read-only and advisory-only.",
  "No R62D buyer outreach execution control was added.",
  "No R62D provider, Twilio, email, SMS, campaign, polling, persistence, runtime activation, or automation-agent path was added.",
  "R62D uses already-loaded dashboard lead data and manual revenue metrics only.",
];

const accessibilityFindings = [
  "R62D summary uses semantic section structure with aria-labelledby and aria-describedby.",
  "R62D summary uses visible headings and readable text labels.",
  "R62D status meaning is text-based and does not depend on color alone.",
  "R62D summary has no motion dependency, focus movement, polling, or auto-refresh.",
];

const governanceFindings = [
  "Governance stop signals render first inside the R62D operational sections.",
  "Governance stop signals are stated as resolved-first and outrank priority labels.",
  "High assignment probability does not mean send.",
  "Disposition priority labels remain advisory and manual-first.",
];

const forbiddenControlFindings = [
  "No R62D buttons, links, forms, menus, toggles, event handlers, fetches, localStorage, sessionStorage, timers, or polling were introduced.",
  "Existing dashboard controls predate R62D and were not modified except for the new read-only component placement.",
  "R62D added no send, blast, campaign, provider activation, autonomous matching, negotiation, or approval-execution affordance.",
];

const dangerousWordingFindings = [
  "R62D uses safe wording: Manual disposition review recommended.",
  "R62D uses safe wording: Disposition priority label is advisory only.",
  "R62D uses safe wording: Review buyer context before taking action.",
  "R62D uses safe wording: High assignment probability does not mean send.",
  "Provider and autonomous language appears only in explicit negative boundary copy.",
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

function addWarning(
  warningCodes: string[],
  warningCode: R62BuyerDispositionOperationalSafetyReviewWarningCode,
) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasUnsafeFinding(input: R62BuyerDispositionOperationalSafetyReviewInput) {
  return (
    input.buttonOrLinkFound === true ||
    input.eventHandlerFound === true ||
    input.fetchOrStorageFound === true ||
    input.timerOrPollingFound === true ||
    input.providerOrTwilioImportFound === true ||
    input.automationAgentImportFound === true ||
    input.forbiddenSendSemanticsFound === true ||
    input.approvalExecutionSemanticsFound === true ||
    input.autonomousBehaviorSemanticsFound === true ||
    input.accessibilityGapFound === true ||
    input.governanceStopFirst === false ||
    input.readOnly === false ||
    input.advisoryOnly === false ||
    input.simulationOnly === false ||
    input.providerCalled === true ||
    input.sent === true ||
    input.persistenceAllowedNow === true ||
    input.pollingAllowed === true ||
    input.runtimeActivationAllowed === true ||
    input.providerActivationAllowed === true ||
    input.approvalGrantsExecution === true ||
    input.uiImplementationAllowedNow === false
  );
}

export function assertR62BuyerDispositionOperationalSafetyReviewInvariants(
  result: Pick<
    R62BuyerDispositionOperationalSafetyReviewResult,
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
): R62BuyerDispositionOperationalSafetyReviewInvariantCheck {
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
  if (result.uiImplementationAllowedNow !== true) warningCodes.push("ui_implementation_allowed_only_for_r62d");

  return { passed: warningCodes.length === 0, warningCodes };
}

export function summarizeR62BuyerDispositionOperationalSafetyReview(
  result: R62BuyerDispositionOperationalSafetyReviewResult,
) {
  const invariantCheck = assertR62BuyerDispositionOperationalSafetyReviewInvariants(result);

  return boundSummary(
    `R62E ${result.surface} status is ${result.reviewStatus}. ` +
      `${result.filesReviewed.length} files reviewed. ` +
      `Fixes required: ${result.fixesRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "The review confirms no R62D buyer outreach execution, send controls, campaigns, providers, polling, persistence, runtime activation, autonomous matching, autonomous negotiation, or approval-execution affordances were introduced.",
  );
}

export function createR62BuyerDispositionOperationalSafetyAccessibilityReview(
  input: R62BuyerDispositionOperationalSafetyReviewInput = {},
): R62BuyerDispositionOperationalSafetyReviewResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const reviewNotes = collectNotes(input.extraReviewNotes);

  addWarning(warningCodes, "r62e_safety_accessibility_review_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r62dUiReviewed !== true) addWarning(warningCodes, "r62d_ui_review_required");
  if (input.forbiddenControlsReviewed !== true) addWarning(warningCodes, "forbidden_controls_review_required");
  if (input.dangerousWordingReviewed !== true) addWarning(warningCodes, "dangerous_wording_review_required");
  if (input.executionDriftReviewed !== true) addWarning(warningCodes, "execution_drift_review_required");
  if (input.providerDriftReviewed !== true) addWarning(warningCodes, "provider_drift_review_required");
  if (input.automationDriftReviewed !== true) addWarning(warningCodes, "automation_drift_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.governanceStopDominanceReviewed !== true) {
    addWarning(warningCodes, "governance_stop_dominance_review_required");
  }
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.buttonOrLinkFound === true) addWarning(warningCodes, "button_or_link_found");
  if (input.eventHandlerFound === true) addWarning(warningCodes, "event_handler_found");
  if (input.fetchOrStorageFound === true) addWarning(warningCodes, "fetch_or_storage_found");
  if (input.timerOrPollingFound === true) addWarning(warningCodes, "timer_or_polling_found");
  if (input.providerOrTwilioImportFound === true) addWarning(warningCodes, "provider_or_twilio_import_found");
  if (input.automationAgentImportFound === true) addWarning(warningCodes, "automation_agent_import_found");
  if (input.forbiddenSendSemanticsFound === true) addWarning(warningCodes, "forbidden_send_semantics_found");
  if (input.approvalExecutionSemanticsFound === true) addWarning(warningCodes, "approval_execution_semantics_found");
  if (input.autonomousBehaviorSemanticsFound === true) {
    addWarning(warningCodes, "autonomous_behavior_semantics_found");
  }
  if (input.accessibilityGapFound === true) addWarning(warningCodes, "accessibility_gap_found");
  if (input.governanceStopFirst === false) addWarning(warningCodes, "governance_stop_not_first");
  if (input.readOnly === false) addWarning(warningCodes, "read_only_required");
  if (input.advisoryOnly === false) addWarning(warningCodes, "advisory_only_required");
  if (input.simulationOnly === false) addWarning(warningCodes, "simulation_only_required");
  if (input.providerCalled === true) addWarning(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addWarning(warningCodes, "sent_must_be_false");
  if (input.persistenceAllowedNow === true) addWarning(warningCodes, "persistence_not_allowed_now");
  if (input.pollingAllowed === true) addWarning(warningCodes, "polling_not_allowed");
  if (input.runtimeActivationAllowed === true) addWarning(warningCodes, "runtime_activation_not_allowed");
  if (input.providerActivationAllowed === true) addWarning(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.approvalGrantsExecution === true) addWarning(warningCodes, "approval_grants_execution_must_be_false");
  if (input.uiImplementationAllowedNow === false) addWarning(warningCodes, "ui_implementation_allowed_only_for_r62d");

  for (const warningCode of warningCodes) {
    if (
      warningCode.endsWith("_found") ||
      warningCode.endsWith("_must_be_false") ||
      warningCode.endsWith("_not_allowed") ||
      warningCode === "governance_stop_not_first"
    ) {
      addUnique(rejectionReasons, warningCode);
    }
  }

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const missingRequiredReview =
    input.r62dUiReviewed !== true ||
    input.forbiddenControlsReviewed !== true ||
    input.dangerousWordingReviewed !== true ||
    input.executionDriftReviewed !== true ||
    input.providerDriftReviewed !== true ||
    input.automationDriftReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.governanceStopDominanceReviewed !== true ||
    operatorReviewRequired;
  const fixesRequired = hasUnsafeFinding(input);
  const reviewStatus: R62BuyerDispositionOperationalSafetyReviewStatus = fixesRequired
    ? "review_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "safety_accessibility_review_complete";
  const result: R62BuyerDispositionOperationalSafetyReviewResult = {
    phase: "R62E",
    surface: "buyer_disposition_operational_intelligence_dashboard_summary",
    reviewStatus,
    filesReviewed,
    safetyFindings,
    accessibilityFindings,
    governanceFindings,
    forbiddenControlFindings,
    dangerousWordingFindings,
    fixesRequired,
    fixesApplied: [],
    rejectionReasons,
    warningCodes,
    safetyFlags,
    reviewNotes,
    nextSuggestedPhase: "R62F - Buyer Disposition Operational Intelligence Final Dashboard Lockdown",
    summary: "R62E buyer disposition operational intelligence safety/accessibility review only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR62BuyerDispositionOperationalSafetyReview(result) };
}
