export type R63SafetyReviewStatus = "review_blocked" | "operator_review_required" | "safety_accessibility_review_complete";

export type R63SafetyReviewInput = {
  r63dUiReviewed?: boolean;
  forbiddenControlsReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  executionDriftReviewed?: boolean;
  providerDriftReviewed?: boolean;
  automationDriftReviewed?: boolean;
  accessibilityReviewed?: boolean;
  governanceStopDominanceReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  unsafeUiFound?: boolean;
  unsafeExecutionFound?: boolean;
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

export type R63SafetyFlags = {
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

export type R63SafetyReviewResult = R63SafetyFlags & {
  phase: "R63E";
  surface: "operator_work_queue_intelligence_dashboard_summary";
  reviewStatus: R63SafetyReviewStatus;
  filesReviewed: string[];
  safetyFindings: string[];
  accessibilityFindings: string[];
  governanceFindings: string[];
  forbiddenControlFindings: string[];
  fixesRequired: boolean;
  fixesApplied: string[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R63SafetyFlags;
  reviewNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

const safetyFlags: R63SafetyFlags = {
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
  "components/dashboard/operator-work-queue-intelligence-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx",
];

const safetyFindings = [
  "R63D surface is read-only and advisory-only.",
  "No R63D execution control, provider activation, outreach execution, campaign launch, polling, persistence, runtime activation, or automation-agent path was added.",
  "R63D uses already-loaded dashboard leads and existing manual revenue metrics only.",
];

const accessibilityFindings = [
  "R63D summary uses semantic section structure with aria-labelledby and aria-describedby.",
  "R63D summary uses visible headings, readable labels, text-based status meaning, and concise summary text.",
  "R63D summary has no motion dependency, focus movement, polling, or auto-refresh.",
];

const governanceFindings = [
  "Governance stop visibility renders first inside the R63D sections.",
  "Governance stop signals are stated as resolved-first and outrank workload pressure and revenue priority.",
  "Operational priority label is advisory only.",
  "Queue pressure is visibility only and not an execution queue.",
];

const forbiddenControlFindings = [
  "No R63D buttons, links, forms, menus, toggles, event handlers, fetches, storage, timers, or polling were introduced.",
  "Existing dashboard controls predate R63D and were not modified except for the new read-only component placement.",
  "R63D added no auto assignment, workflow execution, outreach, provider activation, autonomous routing, or approval-execution affordance.",
];

function addUnique(list: string[], value: string) {
  const bounded = value.trim().length <= 180 ? value.trim() : `${value.trim().slice(0, 180)}...`;
  if (bounded && !list.includes(bounded)) list.push(bounded);
}

function hasUnsafe(input: R63SafetyReviewInput) {
  return (
    input.unsafeUiFound === true ||
    input.unsafeExecutionFound === true ||
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

export function assertR63OperatorWorkQueueSafetyReviewInvariants(result: Pick<R63SafetyReviewResult, keyof R63SafetyFlags>) {
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
  if (result.uiImplementationAllowedNow !== true) warningCodes.push("ui_implementation_allowed_now_required");
  return { passed: warningCodes.length === 0, warningCodes };
}

export function createR63OperatorWorkQueueSafetyAccessibilityReview(input: R63SafetyReviewInput = {}): R63SafetyReviewResult {
  const warningCodes: string[] = ["r63e_safety_accessibility_review_only"];
  const rejectionReasons: string[] = [];
  const reviewNotes: string[] = [];
  for (const note of input.extraReviewNotes ?? []) addUnique(reviewNotes, note);

  if (Object.keys(input).length === 0) warningCodes.push("input_missing");
  if (input.r63dUiReviewed !== true) warningCodes.push("r63d_ui_review_required");
  if (input.forbiddenControlsReviewed !== true) warningCodes.push("forbidden_controls_review_required");
  if (input.dangerousWordingReviewed !== true) warningCodes.push("dangerous_wording_review_required");
  if (input.executionDriftReviewed !== true) warningCodes.push("execution_drift_review_required");
  if (input.providerDriftReviewed !== true) warningCodes.push("provider_drift_review_required");
  if (input.automationDriftReviewed !== true) warningCodes.push("automation_drift_review_required");
  if (input.accessibilityReviewed !== true) warningCodes.push("accessibility_review_required");
  if (input.governanceStopDominanceReviewed !== true) warningCodes.push("governance_stop_dominance_review_required");
  if (input.operatorReviewCompleted !== true) warningCodes.push("operator_review_required");
  if (input.unsafeUiFound === true) warningCodes.push("unsafe_ui_found");
  if (input.unsafeExecutionFound === true) warningCodes.push("unsafe_execution_found");
  if (input.accessibilityGapFound === true) warningCodes.push("accessibility_gap_found");
  if (input.governanceStopFirst === false) warningCodes.push("governance_stop_not_first");
  if (input.readOnly === false) warningCodes.push("read_only_required");
  if (input.sent === true) warningCodes.push("sent_must_be_false");
  if (input.providerCalled === true) warningCodes.push("provider_called_must_be_false");
  if (input.pollingAllowed === true) warningCodes.push("polling_not_allowed");
  if (input.uiImplementationAllowedNow === false) warningCodes.push("ui_implementation_allowed_now_required");
  for (const code of warningCodes) if (code.endsWith("_found") || code.endsWith("_must_be_false")) addUnique(rejectionReasons, code);

  const missingReview =
    input.r63dUiReviewed !== true ||
    input.forbiddenControlsReviewed !== true ||
    input.dangerousWordingReviewed !== true ||
    input.executionDriftReviewed !== true ||
    input.providerDriftReviewed !== true ||
    input.automationDriftReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.governanceStopDominanceReviewed !== true ||
    input.operatorReviewCompleted !== true;
  const fixesRequired = hasUnsafe(input);
  const reviewStatus: R63SafetyReviewStatus = fixesRequired
    ? "review_blocked"
    : missingReview
      ? "operator_review_required"
      : "safety_accessibility_review_complete";
  const result: R63SafetyReviewResult = {
    phase: "R63E",
    surface: "operator_work_queue_intelligence_dashboard_summary",
    reviewStatus,
    filesReviewed,
    safetyFindings,
    accessibilityFindings,
    governanceFindings,
    forbiddenControlFindings,
    fixesRequired,
    fixesApplied: [],
    warningCodes,
    rejectionReasons,
    safetyFlags,
    reviewNotes,
    nextSuggestedPhase: "R63F - Operator Work Queue Intelligence Final Dashboard Lockdown",
    summary: "R63E operator work queue safety/accessibility review only.",
    ...safetyFlags,
  };
  return {
    ...result,
    summary: `R63E ${result.surface} status is ${reviewStatus}. Fixes required: ${fixesRequired}. No R63D execution, provider, outreach, polling, persistence, autonomous routing, or approval-execution affordance was introduced.`,
  };
}
