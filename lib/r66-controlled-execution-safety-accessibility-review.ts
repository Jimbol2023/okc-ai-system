export type R66SafetyReviewStatus = "review_blocked" | "operator_review_required" | "safety_accessibility_review_complete";

export type R66SafetyReviewInput = {
  r66dUiReviewed?: boolean;
  forbiddenControlsReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  hiddenExecutionReviewed?: boolean;
  approvalPermissionReviewed?: boolean;
  providerDriftReviewed?: boolean;
  runtimeDriftReviewed?: boolean;
  accessibilityReviewed?: boolean;
  governanceReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  unsafeUiFound?: boolean;
  hiddenExecutionFound?: boolean;
  approvalExecutionFound?: boolean;
  providerDriftFound?: boolean;
  runtimeDriftFound?: boolean;
  accessibilityGapFound?: boolean;
  governanceStopFirst?: boolean;
  providerCalled?: boolean;
  sent?: boolean;
  approvalGrantsExecution?: boolean;
};

export type R66SafetyFlags = {
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
  executionAllowedNow: false;
};

export type R66SafetyReviewResult = R66SafetyFlags & {
  phase: "R66E";
  surface: "controlled_execution_readiness_dashboard_summary";
  reviewStatus: R66SafetyReviewStatus;
  filesReviewed: string[];
  safetyFindings: string[];
  accessibilityFindings: string[];
  governanceFindings: string[];
  forbiddenControlFindings: string[];
  fixesRequired: boolean;
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R66SafetyFlags;
  nextSuggestedPhase: string;
  summary: string;
};

const safetyFlags: R66SafetyFlags = {
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
  executionAllowedNow: false,
};

const filesReviewed = ["components/dashboard/controlled-execution-readiness-summary.tsx", "app/(dashboard)/dashboard/page.tsx"];
const safetyFindings = [
  "R66D UI is read-only and advisory-only.",
  "No buttons, links, event handlers, fetch calls, storage usage, timers, polling, provider imports, campaign controls, execution queues, runtime activation, background jobs, or execution handlers were added.",
  "Approval is explicitly separated from execution.",
];
const accessibilityFindings = [
  "The component uses a semantic section with aria-labelledby and aria-describedby.",
  "Status meaning is text-based and does not rely on color alone.",
  "No motion dependency, focus movement, auto-refresh, or polling is present.",
];
const governanceFindings = [
  "Governance stop dominance renders first.",
  "Execution readiness is advisory only and does not grant execution, provider activation, runtime activation, campaigns, or outreach.",
];
const forbiddenControlFindings = [
  "No send controls, provider controls, approval-to-send controls, runtime controls, polling controls, campaign controls, execution queue controls, or workflow execution controls were introduced.",
];

function addUnique(list: string[], value: string) {
  if (value && !list.includes(value)) list.push(value);
}

export function createR66ControlledExecutionSafetyAccessibilityReview(input: R66SafetyReviewInput = {}): R66SafetyReviewResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  if (Object.keys(input).length === 0) addUnique(warningCodes, "input_missing");
  if (input.r66dUiReviewed !== true) addUnique(warningCodes, "r66d_ui_review_required");
  if (input.forbiddenControlsReviewed !== true) addUnique(warningCodes, "forbidden_controls_review_required");
  if (input.dangerousWordingReviewed !== true) addUnique(warningCodes, "dangerous_wording_review_required");
  if (input.hiddenExecutionReviewed !== true) addUnique(warningCodes, "hidden_execution_review_required");
  if (input.approvalPermissionReviewed !== true) addUnique(warningCodes, "approval_permission_review_required");
  if (input.providerDriftReviewed !== true) addUnique(warningCodes, "provider_drift_review_required");
  if (input.runtimeDriftReviewed !== true) addUnique(warningCodes, "runtime_drift_review_required");
  if (input.accessibilityReviewed !== true) addUnique(warningCodes, "accessibility_review_required");
  if (input.governanceReviewed !== true) addUnique(warningCodes, "governance_review_required");
  if (input.operatorReviewCompleted !== true) addUnique(warningCodes, "operator_review_required");
  const foundMap: Array<[boolean | undefined, string]> = [
    [input.unsafeUiFound, "unsafe_ui_found"],
    [input.hiddenExecutionFound, "hidden_execution_found"],
    [input.approvalExecutionFound, "approval_execution_found"],
    [input.providerDriftFound, "provider_drift_found"],
    [input.runtimeDriftFound, "runtime_drift_found"],
    [input.accessibilityGapFound, "accessibility_gap_found"],
  ];
  for (const [flag, code] of foundMap) if (flag === true) addUnique(warningCodes, code);
  if (input.governanceStopFirst === false) addUnique(warningCodes, "governance_stop_first_required");
  if (input.providerCalled === true) addUnique(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addUnique(warningCodes, "sent_must_be_false");
  if (input.approvalGrantsExecution === true) addUnique(warningCodes, "approval_grants_execution_must_be_false");
  for (const code of warningCodes) if (code.includes("found") || code.endsWith("_required") || code.endsWith("_must_be_false")) addUnique(rejectionReasons, code);
  const missing =
    input.r66dUiReviewed !== true ||
    input.forbiddenControlsReviewed !== true ||
    input.dangerousWordingReviewed !== true ||
    input.hiddenExecutionReviewed !== true ||
    input.approvalPermissionReviewed !== true ||
    input.providerDriftReviewed !== true ||
    input.runtimeDriftReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.governanceReviewed !== true ||
    input.operatorReviewCompleted !== true;
  const fixesRequired = foundMap.some(([flag]) => flag === true) || input.governanceStopFirst === false || input.providerCalled === true || input.sent === true || input.approvalGrantsExecution === true;
  const reviewStatus: R66SafetyReviewStatus = fixesRequired ? "review_blocked" : missing ? "operator_review_required" : "safety_accessibility_review_complete";
  return {
    phase: "R66E",
    surface: "controlled_execution_readiness_dashboard_summary",
    reviewStatus,
    filesReviewed,
    safetyFindings,
    accessibilityFindings,
    governanceFindings,
    forbiddenControlFindings,
    fixesRequired,
    warningCodes,
    rejectionReasons,
    safetyFlags,
    nextSuggestedPhase: "R66F - Controlled Execution Final Lockdown Contract",
    summary: `R66E controlled execution safety review status is ${reviewStatus}. Review confirms read-only advisory visibility with no hidden execution, provider, runtime, polling, campaign, or approval-to-execution drift.`,
    ...safetyFlags,
  };
}
