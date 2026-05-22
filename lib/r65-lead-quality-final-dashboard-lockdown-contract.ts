export type R65FinalLockdownStatus =
  | "lockdown_blocked"
  | "operator_review_required"
  | "final_dashboard_lockdown_complete";

export type R65FinalLockdownInput = {
  r65eSafetyReviewCompleted?: boolean;
  dashboardSurfaceReviewed?: boolean;
  readOnlyBehaviorReviewed?: boolean;
  governanceFirstReviewed?: boolean;
  advisoryWordingReviewed?: boolean;
  accessibilityReviewed?: boolean;
  executionBoundaryReviewed?: boolean;
  providerBoundaryReviewed?: boolean;
  enrichmentBoundaryReviewed?: boolean;
  skipTracingBoundaryReviewed?: boolean;
  persistencePollingRuntimeReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  unsafeUiFound?: boolean;
  executionCapabilityFound?: boolean;
  providerPathFound?: boolean;
  enrichmentActivationFound?: boolean;
  skipTracingActivationFound?: boolean;
  externalLookupFound?: boolean;
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

export type R65FinalLockdownSafetyFlags = {
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
  enrichmentActivationAllowed: false;
  skipTracingAllowed: false;
};

export type R65FinalLockdownResult = R65FinalLockdownSafetyFlags & {
  phase: "R65F";
  surface: "lead_quality_intelligence_dashboard_summary";
  lockdownStatus: R65FinalLockdownStatus;
  lockedFiles: string[];
  readonlyBehaviorLock: string[];
  governanceFirstLock: string[];
  advisoryWordingLock: string[];
  executionBoundaryLock: string[];
  accessibilityLock: string[];
  invariantAssertions: string[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R65FinalLockdownSafetyFlags;
  operatorReviewRequired: boolean;
  lockdownNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

const safetyFlags: R65FinalLockdownSafetyFlags = {
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
  enrichmentActivationAllowed: false,
  skipTracingAllowed: false,
};

const lockedFiles = ["components/dashboard/lead-quality-intelligence-summary.tsx", "app/(dashboard)/dashboard/page.tsx"];
const readonlyBehaviorLock = [
  "R65 dashboard surface remains read-only and advisory-only.",
  "The surface may display lead quality priority, incomplete data, duplicate lead, stale lead, low-confidence lead, acquisition readiness, disposition readiness, seller follow-up readiness, revenue-risk, and manual data cleanup guidance.",
  "The surface must not add buttons, links, event handlers, fetch calls, localStorage/sessionStorage usage, timers, polling, auto-refresh, forms, enrichment controls, tracing controls, provider controls, outreach controls, or execution controls.",
];
const governanceFirstLock = [
  "Governance stop visibility must render first.",
  "Governance stop signals must outrank lead quality score, revenue opportunity, data completeness, acquisition readiness, disposition readiness, follow-up urgency, and operator workload pressure.",
  "Human verification remains required before workflow action.",
];
const advisoryWordingLock = [
  "Manual lead quality review recommended.",
  "Lead quality priority label is advisory only.",
  "Review lead data before taking action.",
  "Human verification required before workflow action.",
  "Manual data cleanup priority.",
  "Governance stop signals must be resolved first.",
  "Lead quality priority does not mean enrich or contact.",
];
const executionBoundaryLock = [
  "No seller contact, buyer contact, SMS, email, calls, campaigns, provider activation, enrichment activation, tracing activation, scraping, external lookup activation, autonomous qualification, autonomous routing, auto rejection, auto assignment, workflow creation, workflow execution, execution queue, persistence, polling, runtime activation, or approval-to-execution escalation.",
  "Approval or review language can never grant execution permission.",
  "No hidden execution state may be introduced by the R65 dashboard surface.",
];
const accessibilityLock = [
  "Use semantic headings and a predictable reading order.",
  "Use aria-labelledby and aria-describedby on the R65 section.",
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
  "enrichmentActivationAllowed:false",
  "skipTracingAllowed:false",
];

function addUnique(list: string[], value: string) {
  const trimmed = value.trim();
  if (trimmed && !list.includes(trimmed)) list.push(trimmed.length <= 180 ? trimmed : `${trimmed.slice(0, 180)}...`);
}

export function createR65LeadQualityFinalDashboardLockdownContract(
  input: R65FinalLockdownInput = {},
): R65FinalLockdownResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const lockdownNotes: string[] = [];
  for (const note of input.extraLockdownNotes ?? []) addUnique(lockdownNotes, note);

  if (Object.keys(input).length === 0) addUnique(warningCodes, "input_missing");
  if (input.r65eSafetyReviewCompleted !== true) addUnique(warningCodes, "r65e_safety_review_required");
  if (input.dashboardSurfaceReviewed !== true) addUnique(warningCodes, "dashboard_surface_review_required");
  if (input.readOnlyBehaviorReviewed !== true) addUnique(warningCodes, "read_only_behavior_review_required");
  if (input.governanceFirstReviewed !== true) addUnique(warningCodes, "governance_first_review_required");
  if (input.advisoryWordingReviewed !== true) addUnique(warningCodes, "advisory_wording_review_required");
  if (input.accessibilityReviewed !== true) addUnique(warningCodes, "accessibility_review_required");
  if (input.executionBoundaryReviewed !== true) addUnique(warningCodes, "execution_boundary_review_required");
  if (input.providerBoundaryReviewed !== true) addUnique(warningCodes, "provider_boundary_review_required");
  if (input.enrichmentBoundaryReviewed !== true) addUnique(warningCodes, "enrichment_boundary_review_required");
  if (input.skipTracingBoundaryReviewed !== true) addUnique(warningCodes, "skip_tracing_boundary_review_required");
  if (input.persistencePollingRuntimeReviewed !== true) addUnique(warningCodes, "persistence_polling_runtime_review_required");
  if (input.operatorReviewCompleted !== true) addUnique(warningCodes, "operator_review_required");

  const foundMap: Array<[boolean | undefined, string]> = [
    [input.unsafeUiFound, "unsafe_ui_found"],
    [input.executionCapabilityFound, "execution_capability_found"],
    [input.providerPathFound, "provider_path_found"],
    [input.enrichmentActivationFound, "enrichment_activation_found"],
    [input.skipTracingActivationFound, "skip_tracing_activation_found"],
    [input.externalLookupFound, "external_lookup_found"],
    [input.pollingFound, "polling_found"],
    [input.persistenceFound, "persistence_found"],
    [input.runtimeActivationFound, "runtime_activation_found"],
    [input.approvalExecutionFound, "approval_execution_found"],
  ];
  for (const [flag, code] of foundMap) if (flag === true) addUnique(warningCodes, code);
  if (input.providerCalled === true) addUnique(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addUnique(warningCodes, "sent_must_be_false");
  if (input.persistenceAllowedNow === true) addUnique(warningCodes, "persistence_not_allowed_now");
  if (input.pollingAllowed === true) addUnique(warningCodes, "polling_not_allowed");
  if (input.runtimeActivationAllowed === true) addUnique(warningCodes, "runtime_activation_not_allowed");
  if (input.providerActivationAllowed === true) addUnique(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.approvalGrantsExecution === true) addUnique(warningCodes, "approval_grants_execution_must_be_false");
  for (const warningCode of warningCodes) if (warningCode.includes("found") || warningCode.endsWith("_required") || warningCode.endsWith("_must_be_false") || warningCode.endsWith("_not_allowed_now")) addUnique(rejectionReasons, warningCode);

  const missingReview =
    input.r65eSafetyReviewCompleted !== true ||
    input.dashboardSurfaceReviewed !== true ||
    input.readOnlyBehaviorReviewed !== true ||
    input.governanceFirstReviewed !== true ||
    input.advisoryWordingReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.executionBoundaryReviewed !== true ||
    input.providerBoundaryReviewed !== true ||
    input.enrichmentBoundaryReviewed !== true ||
    input.skipTracingBoundaryReviewed !== true ||
    input.persistencePollingRuntimeReviewed !== true ||
    input.operatorReviewCompleted !== true;
  const blocked = foundMap.some(([flag]) => flag === true) || input.providerCalled === true || input.sent === true || input.pollingAllowed === true || input.runtimeActivationAllowed === true || input.providerActivationAllowed === true || input.approvalGrantsExecution === true;
  const lockdownStatus: R65FinalLockdownStatus = blocked
    ? "lockdown_blocked"
    : missingReview
      ? "operator_review_required"
      : "final_dashboard_lockdown_complete";

  const result: R65FinalLockdownResult = {
    phase: "R65F",
    surface: "lead_quality_intelligence_dashboard_summary",
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
    operatorReviewRequired: input.operatorReviewCompleted !== true,
    lockdownNotes,
    nextSuggestedPhase: "R66A - Controlled Execution Scope Contract",
    summary: `R65F lead quality final dashboard lockdown status is ${lockdownStatus}. Governance-first read-only advisory lead quality intelligence is locked with no provider, enrichment, tracing, outreach, campaign, persistence, polling, runtime activation, autonomous routing, or execution path.`,
    ...safetyFlags,
  };
  return result;
}
