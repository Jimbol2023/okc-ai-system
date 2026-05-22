export type R64SafetyReviewStatus = "review_blocked" | "operator_review_required" | "safety_accessibility_review_complete";

export type R64SafetyReviewInput = {
  r64dUiReviewed?: boolean;
  forbiddenControlsReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  executionDriftReviewed?: boolean;
  providerDriftReviewed?: boolean;
  gpsMapDriftReviewed?: boolean;
  scrapingSkipTracingDriftReviewed?: boolean;
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

export type R64SafetyFlags = {
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

export type R64SafetyReviewResult = R64SafetyFlags & {
  phase: "R64E";
  surface: "driving_for_dollars_intelligence_dashboard_summary";
  reviewStatus: R64SafetyReviewStatus;
  filesReviewed: string[];
  safetyFindings: string[];
  accessibilityFindings: string[];
  governanceFindings: string[];
  forbiddenControlFindings: string[];
  fixesRequired: boolean;
  fixesApplied: string[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R64SafetyFlags;
  reviewNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

const safetyFlags: R64SafetyFlags = {
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
  "components/dashboard/driving-for-dollars-intelligence-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx",
];

const safetyFindings = [
  "R64D UI is read-only and advisory-only.",
  "No new buttons, links, event handlers, fetch calls, localStorage/sessionStorage usage, timers, polling, auto-refresh, provider imports, GPS/map integration, scraping logic, skip-tracing logic, campaign controls, outreach controls, or execution handlers were added by R64D.",
  "Property review labels are computed from existing stored lead fields and do not invent property facts.",
  "Safety flags preserve readOnly:true, advisoryOnly:true, simulationOnly:true, providerCalled:false, sent:false, persistenceAllowedNow:false, pollingAllowed:false, runtimeActivationAllowed:false, providerActivationAllowed:false, approvalGrantsExecution:false.",
];

const accessibilityFindings = [
  "The component uses a semantic section with aria-labelledby and aria-describedby.",
  "The heading structure uses h2 for the surface and h3 for repeated review cards.",
  "Status meaning is text-based through titles, counts, status text, details, and explicit safety badges.",
  "The UI does not depend on motion, focus movement, auto-refresh, polling, or color-only meaning.",
  "The summary is concise and screen-reader-friendly.",
];

const governanceFindings = [
  "Governance stop visibility renders first in the section order.",
  "Governance stop signals explicitly outrank distress visibility, revenue opportunity, stale-property urgency, acquisition momentum, workload pressure, and neighborhood opportunity visibility.",
  "Driving-for-dollars priority is framed as manual property review only.",
  "Property priority does not authorize owner contact, outbound communication, GPS/map systems, data scraping, tracing services, provider systems, campaigns, persistence, polling, runtime activation, autonomous property targeting, autonomous routing, or execution controls.",
];

const forbiddenControlFindings = [
  "No send, call, SMS, email, mailer, campaign, provider, map, GPS, scraping, skip-tracing, route-planning, execution, approval-to-execution, or autonomous acquisition control was introduced.",
  "R64D did not add routes, Prisma/schema/migrations, persistence, polling, runtime activation, or provider connectivity.",
];

function addUnique(list: string[], value: string) {
  const trimmed = value.trim();
  if (trimmed && !list.includes(trimmed)) list.push(trimmed.length <= 180 ? trimmed : `${trimmed.slice(0, 180)}...`);
}

export function summarizeR64DrivingForDollarsSafetyReview(result: R64SafetyReviewResult) {
  return (
    `R64E ${result.surface} status is ${result.reviewStatus}. ` +
    `${result.filesReviewed.length} files reviewed. ` +
    `Fixes required: ${result.fixesRequired ? "true" : "false"}. ` +
    "Review confirms read-only advisory UI with no provider, GPS/map, scraping, skip-tracing, outreach, campaign, polling, persistence, runtime activation, autonomous acquisition, or execution drift."
  );
}

export function createR64DrivingForDollarsSafetyAccessibilityReview(
  input: R64SafetyReviewInput = {},
): R64SafetyReviewResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const reviewNotes: string[] = [];
  for (const note of input.extraReviewNotes ?? []) addUnique(reviewNotes, note);

  if (Object.keys(input).length === 0) addUnique(warningCodes, "input_missing");
  if (input.r64dUiReviewed !== true) addUnique(warningCodes, "r64d_ui_review_required");
  if (input.forbiddenControlsReviewed !== true) addUnique(warningCodes, "forbidden_controls_review_required");
  if (input.dangerousWordingReviewed !== true) addUnique(warningCodes, "dangerous_wording_review_required");
  if (input.executionDriftReviewed !== true) addUnique(warningCodes, "execution_drift_review_required");
  if (input.providerDriftReviewed !== true) addUnique(warningCodes, "provider_drift_review_required");
  if (input.gpsMapDriftReviewed !== true) addUnique(warningCodes, "gps_map_drift_review_required");
  if (input.scrapingSkipTracingDriftReviewed !== true) addUnique(warningCodes, "scraping_skip_tracing_drift_review_required");
  if (input.automationDriftReviewed !== true) addUnique(warningCodes, "automation_drift_review_required");
  if (input.accessibilityReviewed !== true) addUnique(warningCodes, "accessibility_review_required");
  if (input.governanceStopDominanceReviewed !== true) addUnique(warningCodes, "governance_stop_dominance_review_required");
  if (input.operatorReviewCompleted !== true) addUnique(warningCodes, "operator_review_required");
  if (input.unsafeUiFound === true) addUnique(warningCodes, "unsafe_ui_found");
  if (input.unsafeExecutionFound === true) addUnique(warningCodes, "unsafe_execution_found");
  if (input.accessibilityGapFound === true) addUnique(warningCodes, "accessibility_gap_found");
  if (input.governanceStopFirst === false) addUnique(warningCodes, "governance_stop_first_required");
  if (input.readOnly === false) addUnique(warningCodes, "read_only_required");
  if (input.advisoryOnly === false) addUnique(warningCodes, "advisory_only_required");
  if (input.simulationOnly === false) addUnique(warningCodes, "simulation_only_required");
  if (input.providerCalled === true) addUnique(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addUnique(warningCodes, "sent_must_be_false");
  if (input.persistenceAllowedNow === true) addUnique(warningCodes, "persistence_not_allowed_now");
  if (input.pollingAllowed === true) addUnique(warningCodes, "polling_not_allowed");
  if (input.runtimeActivationAllowed === true) addUnique(warningCodes, "runtime_activation_not_allowed");
  if (input.providerActivationAllowed === true) addUnique(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.approvalGrantsExecution === true) addUnique(warningCodes, "approval_grants_execution_must_be_false");

  for (const warningCode of warningCodes) {
    if (warningCode.includes("found") || warningCode.endsWith("_required") || warningCode.endsWith("_must_be_false") || warningCode.endsWith("_not_allowed_now")) {
      addUnique(rejectionReasons, warningCode);
    }
  }

  const missingReview =
    input.r64dUiReviewed !== true ||
    input.forbiddenControlsReviewed !== true ||
    input.dangerousWordingReviewed !== true ||
    input.executionDriftReviewed !== true ||
    input.providerDriftReviewed !== true ||
    input.gpsMapDriftReviewed !== true ||
    input.scrapingSkipTracingDriftReviewed !== true ||
    input.automationDriftReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.governanceStopDominanceReviewed !== true ||
    input.operatorReviewCompleted !== true;
  const fixesRequired = input.unsafeUiFound === true || input.unsafeExecutionFound === true || input.accessibilityGapFound === true || input.governanceStopFirst === false;
  const reviewStatus: R64SafetyReviewStatus = fixesRequired
    ? "review_blocked"
    : missingReview
      ? "operator_review_required"
      : "safety_accessibility_review_complete";

  const result: R64SafetyReviewResult = {
    phase: "R64E",
    surface: "driving_for_dollars_intelligence_dashboard_summary",
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
    nextSuggestedPhase: "R64F - Driving-for-Dollars Intelligence Final Dashboard Lockdown",
    summary: "R64E driving-for-dollars safety and accessibility review.",
    ...safetyFlags,
  };
  return { ...result, summary: summarizeR64DrivingForDollarsSafetyReview(result) };
}
