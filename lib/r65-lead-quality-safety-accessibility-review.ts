export type R65SafetyReviewStatus = "review_blocked" | "operator_review_required" | "safety_accessibility_review_complete";

export type R65SafetyReviewInput = {
  r65dUiReviewed?: boolean;
  forbiddenControlsReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  executionDriftReviewed?: boolean;
  providerDriftReviewed?: boolean;
  enrichmentDriftReviewed?: boolean;
  skipTracingDriftReviewed?: boolean;
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

export type R65SafetyFlags = {
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

export type R65SafetyReviewResult = R65SafetyFlags & {
  phase: "R65E";
  surface: "lead_quality_intelligence_dashboard_summary";
  reviewStatus: R65SafetyReviewStatus;
  filesReviewed: string[];
  safetyFindings: string[];
  accessibilityFindings: string[];
  governanceFindings: string[];
  forbiddenControlFindings: string[];
  fixesRequired: boolean;
  fixesApplied: string[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R65SafetyFlags;
  reviewNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

const safetyFlags: R65SafetyFlags = {
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

const filesReviewed = ["components/dashboard/lead-quality-intelligence-summary.tsx", "app/(dashboard)/dashboard/page.tsx"];
const safetyFindings = [
  "R65D UI is read-only and advisory-only.",
  "No new buttons, links, event handlers, fetch calls, localStorage/sessionStorage usage, timers, polling, auto-refresh, provider imports, enrichment activation, tracing activation, campaign controls, outreach controls, or execution handlers were added by R65D.",
  "Lead quality labels are computed from existing stored lead fields and do not enrich, validate externally, reject, assign, route, or mutate leads.",
];
const accessibilityFindings = [
  "The component uses a semantic section with aria-labelledby and aria-describedby.",
  "The heading structure uses h2 for the surface and h3 for repeated review cards.",
  "Status meaning is text-based through titles, counts, status text, details, and explicit safety badges.",
  "The UI does not depend on motion, focus movement, auto-refresh, polling, or color-only meaning.",
];
const governanceFindings = [
  "Governance stop visibility renders first in the section order.",
  "Governance stop signals explicitly outrank lead quality score, revenue opportunity, data completeness, acquisition readiness, disposition readiness, follow-up urgency, and operator workload pressure.",
  "Lead quality priority is framed as manual review and data cleanup guidance only.",
];
const forbiddenControlFindings = [
  "No enrichment, tracing, external lookup, contact, call, SMS, email, campaign, provider, execution, approval-to-execution, autonomous qualification, or autonomous routing control was introduced.",
  "R65D did not add routes, Prisma/schema/migrations, persistence, polling, runtime activation, provider connectivity, enrichment activation, or skip-tracing activation.",
];

function addUnique(list: string[], value: string) {
  const trimmed = value.trim();
  if (trimmed && !list.includes(trimmed)) list.push(trimmed.length <= 180 ? trimmed : `${trimmed.slice(0, 180)}...`);
}

export function createR65LeadQualitySafetyAccessibilityReview(input: R65SafetyReviewInput = {}): R65SafetyReviewResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const reviewNotes: string[] = [];
  for (const note of input.extraReviewNotes ?? []) addUnique(reviewNotes, note);

  if (Object.keys(input).length === 0) addUnique(warningCodes, "input_missing");
  if (input.r65dUiReviewed !== true) addUnique(warningCodes, "r65d_ui_review_required");
  if (input.forbiddenControlsReviewed !== true) addUnique(warningCodes, "forbidden_controls_review_required");
  if (input.dangerousWordingReviewed !== true) addUnique(warningCodes, "dangerous_wording_review_required");
  if (input.executionDriftReviewed !== true) addUnique(warningCodes, "execution_drift_review_required");
  if (input.providerDriftReviewed !== true) addUnique(warningCodes, "provider_drift_review_required");
  if (input.enrichmentDriftReviewed !== true) addUnique(warningCodes, "enrichment_drift_review_required");
  if (input.skipTracingDriftReviewed !== true) addUnique(warningCodes, "skip_tracing_drift_review_required");
  if (input.automationDriftReviewed !== true) addUnique(warningCodes, "automation_drift_review_required");
  if (input.accessibilityReviewed !== true) addUnique(warningCodes, "accessibility_review_required");
  if (input.governanceStopDominanceReviewed !== true) addUnique(warningCodes, "governance_stop_dominance_review_required");
  if (input.operatorReviewCompleted !== true) addUnique(warningCodes, "operator_review_required");
  if (input.unsafeUiFound === true) addUnique(warningCodes, "unsafe_ui_found");
  if (input.unsafeExecutionFound === true) addUnique(warningCodes, "unsafe_execution_found");
  if (input.accessibilityGapFound === true) addUnique(warningCodes, "accessibility_gap_found");
  if (input.governanceStopFirst === false) addUnique(warningCodes, "governance_stop_first_required");
  if (input.providerCalled === true) addUnique(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addUnique(warningCodes, "sent_must_be_false");
  if (input.pollingAllowed === true) addUnique(warningCodes, "polling_not_allowed");
  if (input.runtimeActivationAllowed === true) addUnique(warningCodes, "runtime_activation_not_allowed");
  if (input.providerActivationAllowed === true) addUnique(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.approvalGrantsExecution === true) addUnique(warningCodes, "approval_grants_execution_must_be_false");
  for (const warningCode of warningCodes) if (warningCode.includes("found") || warningCode.endsWith("_required") || warningCode.endsWith("_must_be_false") || warningCode.endsWith("_not_allowed")) addUnique(rejectionReasons, warningCode);

  const missingReview =
    input.r65dUiReviewed !== true ||
    input.forbiddenControlsReviewed !== true ||
    input.dangerousWordingReviewed !== true ||
    input.executionDriftReviewed !== true ||
    input.providerDriftReviewed !== true ||
    input.enrichmentDriftReviewed !== true ||
    input.skipTracingDriftReviewed !== true ||
    input.automationDriftReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.governanceStopDominanceReviewed !== true ||
    input.operatorReviewCompleted !== true;
  const fixesRequired = input.unsafeUiFound === true || input.unsafeExecutionFound === true || input.accessibilityGapFound === true || input.governanceStopFirst === false;
  const reviewStatus: R65SafetyReviewStatus = fixesRequired ? "review_blocked" : missingReview ? "operator_review_required" : "safety_accessibility_review_complete";

  const result: R65SafetyReviewResult = {
    phase: "R65E",
    surface: "lead_quality_intelligence_dashboard_summary",
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
    nextSuggestedPhase: "R65F - Lead Quality Intelligence Final Dashboard Lockdown",
    summary: `R65E lead quality safety review status is ${reviewStatus}. Review confirms read-only advisory UI with no provider, enrichment, tracing, outreach, campaign, polling, persistence, runtime activation, autonomous routing, or execution drift.`,
    ...safetyFlags,
  };
  return result;
}
