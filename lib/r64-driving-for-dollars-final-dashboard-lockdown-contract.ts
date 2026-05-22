export type R64FinalLockdownStatus =
  | "lockdown_blocked"
  | "operator_review_required"
  | "final_dashboard_lockdown_complete";

export type R64FinalLockdownInput = {
  r64eSafetyReviewCompleted?: boolean;
  dashboardSurfaceReviewed?: boolean;
  readOnlyBehaviorReviewed?: boolean;
  governanceFirstReviewed?: boolean;
  advisoryWordingReviewed?: boolean;
  accessibilityReviewed?: boolean;
  executionBoundaryReviewed?: boolean;
  providerBoundaryReviewed?: boolean;
  gpsMapBoundaryReviewed?: boolean;
  scrapingSkipTracingBoundaryReviewed?: boolean;
  persistencePollingRuntimeReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  unsafeUiFound?: boolean;
  executionCapabilityFound?: boolean;
  providerPathFound?: boolean;
  gpsMapActivationFound?: boolean;
  scrapingSkipTracingFound?: boolean;
  pollingFound?: boolean;
  persistenceFound?: boolean;
  runtimeActivationFound?: boolean;
  approvalExecutionFound?: boolean;
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
  extraLockdownNotes?: string[];
};

export type R64FinalLockdownSafetyFlags = {
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

export type R64FinalLockdownResult = R64FinalLockdownSafetyFlags & {
  phase: "R64F";
  surface: "driving_for_dollars_intelligence_dashboard_summary";
  lockdownStatus: R64FinalLockdownStatus;
  lockedFiles: string[];
  readonlyBehaviorLock: string[];
  governanceFirstLock: string[];
  advisoryWordingLock: string[];
  executionBoundaryLock: string[];
  accessibilityLock: string[];
  invariantAssertions: string[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R64FinalLockdownSafetyFlags;
  operatorReviewRequired: boolean;
  lockdownNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

const safetyFlags: R64FinalLockdownSafetyFlags = {
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

const lockedFiles = [
  "components/dashboard/driving-for-dollars-intelligence-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx",
];

const readonlyBehaviorLock = [
  "R64 dashboard surface remains read-only and advisory-only.",
  "The surface may display driving-for-dollars property review priority, distress visibility, stale-property review, field-note quality review, revenue-potential visibility, acquisition bottleneck visibility, and human verification guidance.",
  "The surface must not add buttons, links, event handlers, fetch calls, localStorage/sessionStorage usage, timers, polling, auto-refresh, forms, or execution controls.",
];

const governanceFirstLock = [
  "Governance stop visibility must render first.",
  "Governance stop signals must outrank distress visibility, revenue opportunity, stale-property urgency, acquisition momentum, workload pressure, and neighborhood opportunity visibility.",
  "Human verification remains required before acquisition action.",
];

const advisoryWordingLock = [
  "Manual property review recommended.",
  "Driving-for-dollars priority label is advisory only.",
  "Review property context before taking action.",
  "Human verification required before acquisition action.",
  "Field-note quality review needed.",
  "Governance stop signals must be resolved first.",
  "Property priority does not mean contact owner.",
];

const executionBoundaryLock = [
  "No owner contact, seller outreach, SMS, email, calls, mailers, campaigns, provider activation, Twilio activation, GPS/map activation, route automation, scraping, skip tracing, phone-number pulling, autonomous acquisition, autonomous property targeting, autonomous route planning, workflow execution, execution queue, persistence, polling, runtime activation, or approval-to-execution escalation.",
  "Approval or review language can never grant execution permission.",
  "No hidden execution state may be introduced by the R64 dashboard surface.",
];

const accessibilityLock = [
  "Use semantic headings and a predictable reading order.",
  "Use aria-labelledby and aria-describedby on the R64 section.",
  "Use readable labels and concise screen-reader-friendly summaries.",
  "Use text-based status meaning; do not rely on color alone.",
  "No motion dependency, focus movement, auto-refresh, or polling.",
];

const invariantAssertions = [
  "readOnly:true",
  "advisoryOnly:true",
  "simulationOnly:true",
  "providerCalled:false",
  "sent:false",
  "persistenceAllowedNow:false",
  "pollingAllowed:false",
  "runtimeActivationAllowed:false",
  "providerActivationAllowed:false",
  "approvalGrantsExecution:false",
  "uiImplementationAllowedNow:true",
];

function addUnique(list: string[], value: string) {
  const trimmed = value.trim();
  if (trimmed && !list.includes(trimmed)) list.push(trimmed.length <= 180 ? trimmed : `${trimmed.slice(0, 180)}...`);
}

export function summarizeR64DrivingForDollarsFinalDashboardLockdown(result: R64FinalLockdownResult) {
  return (
    `R64F ${result.surface} status is ${result.lockdownStatus}. ` +
    `${result.lockedFiles.length} files are locked for read-only advisory driving-for-dollars intelligence. ` +
    "Governance stop visibility remains first, accessibility protections remain required, and no execution, provider, GPS/map, scraping, skip-tracing, outreach, campaign, persistence, polling, runtime activation, or approval-to-execution path is allowed."
  );
}

export function createR64DrivingForDollarsFinalDashboardLockdownContract(
  input: R64FinalLockdownInput = {},
): R64FinalLockdownResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const lockdownNotes: string[] = [];
  for (const note of input.extraLockdownNotes ?? []) addUnique(lockdownNotes, note);

  if (Object.keys(input).length === 0) addUnique(warningCodes, "input_missing");
  if (input.r64eSafetyReviewCompleted !== true) addUnique(warningCodes, "r64e_safety_review_required");
  if (input.dashboardSurfaceReviewed !== true) addUnique(warningCodes, "dashboard_surface_review_required");
  if (input.readOnlyBehaviorReviewed !== true) addUnique(warningCodes, "read_only_behavior_review_required");
  if (input.governanceFirstReviewed !== true) addUnique(warningCodes, "governance_first_review_required");
  if (input.advisoryWordingReviewed !== true) addUnique(warningCodes, "advisory_wording_review_required");
  if (input.accessibilityReviewed !== true) addUnique(warningCodes, "accessibility_review_required");
  if (input.executionBoundaryReviewed !== true) addUnique(warningCodes, "execution_boundary_review_required");
  if (input.providerBoundaryReviewed !== true) addUnique(warningCodes, "provider_boundary_review_required");
  if (input.gpsMapBoundaryReviewed !== true) addUnique(warningCodes, "gps_map_boundary_review_required");
  if (input.scrapingSkipTracingBoundaryReviewed !== true) addUnique(warningCodes, "scraping_skip_tracing_boundary_review_required");
  if (input.persistencePollingRuntimeReviewed !== true) addUnique(warningCodes, "persistence_polling_runtime_review_required");
  if (input.operatorReviewCompleted !== true) addUnique(warningCodes, "operator_review_required");
  if (input.unsafeUiFound === true) addUnique(warningCodes, "unsafe_ui_found");
  if (input.executionCapabilityFound === true) addUnique(warningCodes, "execution_capability_found");
  if (input.providerPathFound === true) addUnique(warningCodes, "provider_path_found");
  if (input.gpsMapActivationFound === true) addUnique(warningCodes, "gps_map_activation_found");
  if (input.scrapingSkipTracingFound === true) addUnique(warningCodes, "scraping_skip_tracing_found");
  if (input.pollingFound === true) addUnique(warningCodes, "polling_found");
  if (input.persistenceFound === true) addUnique(warningCodes, "persistence_found");
  if (input.runtimeActivationFound === true) addUnique(warningCodes, "runtime_activation_found");
  if (input.approvalExecutionFound === true) addUnique(warningCodes, "approval_execution_found");
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

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const missingReview =
    input.r64eSafetyReviewCompleted !== true ||
    input.dashboardSurfaceReviewed !== true ||
    input.readOnlyBehaviorReviewed !== true ||
    input.governanceFirstReviewed !== true ||
    input.advisoryWordingReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.executionBoundaryReviewed !== true ||
    input.providerBoundaryReviewed !== true ||
    input.gpsMapBoundaryReviewed !== true ||
    input.scrapingSkipTracingBoundaryReviewed !== true ||
    input.persistencePollingRuntimeReviewed !== true ||
    operatorReviewRequired;
  const blocked =
    input.unsafeUiFound === true ||
    input.executionCapabilityFound === true ||
    input.providerPathFound === true ||
    input.gpsMapActivationFound === true ||
    input.scrapingSkipTracingFound === true ||
    input.pollingFound === true ||
    input.persistenceFound === true ||
    input.runtimeActivationFound === true ||
    input.approvalExecutionFound === true ||
    input.readOnly === false ||
    input.advisoryOnly === false ||
    input.simulationOnly === false ||
    input.providerCalled === true ||
    input.sent === true ||
    input.persistenceAllowedNow === true ||
    input.pollingAllowed === true ||
    input.runtimeActivationAllowed === true ||
    input.providerActivationAllowed === true ||
    input.approvalGrantsExecution === true;
  const lockdownStatus: R64FinalLockdownStatus = blocked
    ? "lockdown_blocked"
    : missingReview
      ? "operator_review_required"
      : "final_dashboard_lockdown_complete";

  const result: R64FinalLockdownResult = {
    phase: "R64F",
    surface: "driving_for_dollars_intelligence_dashboard_summary",
    lockdownStatus,
    lockedFiles,
    readonlyBehaviorLock,
    governanceFirstLock,
    advisoryWordingLock,
    executionBoundaryLock,
    accessibilityLock,
    invariantAssertions,
    warningCodes,
    rejectionReasons,
    safetyFlags,
    operatorReviewRequired,
    lockdownNotes,
    nextSuggestedPhase: "R65A - Lead Quality Intelligence Scope Contract",
    summary: "R64F driving-for-dollars final dashboard lockdown.",
    ...safetyFlags,
  };
  return { ...result, summary: summarizeR64DrivingForDollarsFinalDashboardLockdown(result) };
}
