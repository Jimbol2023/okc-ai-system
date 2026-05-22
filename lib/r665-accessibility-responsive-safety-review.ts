export type R665AccessibilityResponsiveReviewStatus =
  | "accessibility_responsive_review_blocked"
  | "operator_review_required"
  | "accessibility_responsive_review_passed";

export type R665AccessibilityResponsiveReviewInput = {
  r665dCleanupReviewed?: boolean;
  overflowContainmentReviewed?: boolean;
  badgeWrappingReviewed?: boolean;
  responsiveGridReviewed?: boolean;
  governanceVisibilityReviewed?: boolean;
  semanticStructureReviewed?: boolean;
  screenReaderSummaryReviewed?: boolean;
  forbiddenControlSearchReviewed?: boolean;
  executionDriftSearchReviewed?: boolean;
  providerRuntimePollingSearchReviewed?: boolean;
  hiddenControlIntroduced?: boolean;
  governanceWarningHidden?: boolean;
  safetyCopyWeakened?: boolean;
  colorOnlyMeaningIntroduced?: boolean;
  motionDependencyIntroduced?: boolean;
  focusMovementIntroduced?: boolean;
  autoRefreshIntroduced?: boolean;
  pollingIntroduced?: boolean;
  providerPathIntroduced?: boolean;
  runtimeActivationIntroduced?: boolean;
  persistenceIntroduced?: boolean;
  executionControlIntroduced?: boolean;
  routeChangeIntroduced?: boolean;
  logicChangeIntroduced?: boolean;
  dataMutationIntroduced?: boolean;
};

export type R665AccessibilityResponsiveSafetyFlags = {
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
  noExecutionControlsAdded: true;
  noUiLogicChanged: true;
};

export type R665AccessibilityResponsiveReviewResult =
  R665AccessibilityResponsiveSafetyFlags & {
    phase: "R66.5E";
    surface: "accessibility_responsive_safety_review";
    reviewStatus: R665AccessibilityResponsiveReviewStatus;
    reviewedFiles: string[];
    overflowFindings: string[];
    densityFindings: string[];
    accessibilityFindings: string[];
    governanceFindings: string[];
    forbiddenSemanticFindings: string[];
    blockedReasons: string[];
    missingReviewAreas: string[];
    safetyFlags: R665AccessibilityResponsiveSafetyFlags;
    nextSuggestedPhase: "R66.5F - Final UX Lockdown Contract";
    summary: string;
  };

export type R665AccessibilityResponsiveInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const safetyFlags: R665AccessibilityResponsiveSafetyFlags = {
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
  noExecutionControlsAdded: true,
  noUiLogicChanged: true,
};

const reviewedFiles = [
  "app/(dashboard)/dashboard/page.tsx",
  "components/dashboard/acquisition-daily-call-priority-summary.tsx",
  "components/dashboard/buyer-disposition-operational-intelligence-summary.tsx",
  "components/dashboard/buyer-ready-disposition-priority-summary.tsx",
  "components/dashboard/controlled-execution-readiness-summary.tsx",
  "components/dashboard/driving-for-dollars-intelligence-summary.tsx",
  "components/dashboard/lead-quality-intelligence-summary.tsx",
  "components/dashboard/manual-revenue-workday-summary.tsx",
  "components/dashboard/near-close-revenue-recovery-summary.tsx",
  "components/dashboard/operator-work-queue-intelligence-summary.tsx",
  "components/dashboard/operator-work-queue-summary.tsx",
  "components/dashboard/stuck-deal-recovery-summary.tsx",
];

const overflowFindings = [
  "Dashboard sections now use overflow containment on reviewed card surfaces.",
  "Long headings, status copy, advisory copy, and safety flags have break-word protection.",
  "Card header title/count layouts use min-width containment and wrapping to reduce squeeze risk.",
  "Long governance flag badges are wrapped and constrained within their parent containers.",
];

const densityFindings = [
  "High-density five-column grids now include intermediate two-column behavior before wide layouts.",
  "Seven-column areas are reserved for very wide screens with safer intermediate four-column layout.",
  "Repeated guidance panels remain visible while gaining text wrapping and containment.",
  "Card spacing was normalized without changing information architecture or adding sections.",
];

const accessibilityFindings = [
  "Semantic headings and section structure remain present.",
  "Existing aria-labelledby and aria-describedby relationships are preserved where present.",
  "Status meaning remains text-based and not color-only.",
  "No motion dependency, focus movement, polling, timers, or auto-refresh was introduced.",
  "Governance and safety text remains visible; no line-clamp was used to hide critical copy.",
];

const governanceFindings = [
  "Read-only, advisory-only, simulation-only posture remains intact.",
  "Governance stop warnings remain visible and were not weakened.",
  "Cleanup was limited to dashboard presentation classes and page spacing containment.",
  "No business logic, intelligence logic, route, provider, persistence, polling, runtime, or execution boundary changed.",
];

const forbiddenSemanticFindings = [
  "No new send control was added.",
  "No new execution control was added.",
  "No provider, Twilio, email, SMS, campaign, automation, scraping, enrichment, skip-tracing, GPS/map, polling, or runtime activation path was added.",
  "Existing dashboard buttons were not introduced by R66.5D and no hidden controls were added.",
];

const requiredReviewAreas: Array<[keyof R665AccessibilityResponsiveReviewInput, string]> = [
  ["r665dCleanupReviewed", "R66.5D cleanup diff"],
  ["overflowContainmentReviewed", "overflow containment"],
  ["badgeWrappingReviewed", "badge wrapping"],
  ["responsiveGridReviewed", "responsive grid behavior"],
  ["governanceVisibilityReviewed", "governance warning visibility"],
  ["semanticStructureReviewed", "semantic section structure"],
  ["screenReaderSummaryReviewed", "screen-reader summary preservation"],
  ["forbiddenControlSearchReviewed", "forbidden control search"],
  ["executionDriftSearchReviewed", "execution drift search"],
  ["providerRuntimePollingSearchReviewed", "provider/runtime/polling search"],
];

const blockedReviewReasons: Array<[keyof R665AccessibilityResponsiveReviewInput, string]> = [
  ["hiddenControlIntroduced", "hidden controls are forbidden"],
  ["governanceWarningHidden", "governance warnings cannot be hidden"],
  ["safetyCopyWeakened", "safety copy cannot be weakened"],
  ["colorOnlyMeaningIntroduced", "color-only meaning is forbidden"],
  ["motionDependencyIntroduced", "motion dependency is forbidden"],
  ["focusMovementIntroduced", "focus movement is forbidden"],
  ["autoRefreshIntroduced", "auto-refresh is forbidden"],
  ["pollingIntroduced", "polling is forbidden"],
  ["providerPathIntroduced", "provider paths are forbidden"],
  ["runtimeActivationIntroduced", "runtime activation is forbidden"],
  ["persistenceIntroduced", "persistence is forbidden"],
  ["executionControlIntroduced", "execution controls are forbidden"],
  ["routeChangeIntroduced", "route changes are forbidden"],
  ["logicChangeIntroduced", "logic changes are forbidden"],
  ["dataMutationIntroduced", "data mutations are forbidden"],
];

export function assertR665AccessibilityResponsiveReviewInvariants(
  result: Pick<R665AccessibilityResponsiveReviewResult, keyof R665AccessibilityResponsiveSafetyFlags>,
): R665AccessibilityResponsiveInvariantCheck {
  const warningCodes: string[] = [];
  if (result.readOnly !== true) warningCodes.push("read_only_required");
  if (result.advisoryOnly !== true) warningCodes.push("advisory_only_required");
  if (result.simulationOnly !== true) warningCodes.push("simulation_only_required");
  if (result.providerCalled !== false) warningCodes.push("provider_called_must_be_false");
  if (result.sent !== false) warningCodes.push("sent_must_be_false");
  if (result.persistenceAllowedNow !== false) warningCodes.push("persistence_not_allowed_now");
  if (result.pollingAllowed !== false) warningCodes.push("polling_not_allowed");
  if (result.runtimeActivationAllowed !== false) warningCodes.push("runtime_activation_not_allowed");
  if (result.providerActivationAllowed !== false) warningCodes.push("provider_activation_not_allowed");
  if (result.approvalGrantsExecution !== false) warningCodes.push("approval_grants_execution_must_be_false");
  if (result.noExecutionControlsAdded !== true) warningCodes.push("no_execution_controls_added_required");
  if (result.noUiLogicChanged !== true) warningCodes.push("no_ui_logic_changed_required");
  return { passed: warningCodes.length === 0, warningCodes };
}

export function createR665AccessibilityResponsiveSafetyReview(
  input: R665AccessibilityResponsiveReviewInput = {},
): R665AccessibilityResponsiveReviewResult {
  const blockedReasons = blockedReviewReasons
    .filter(([key]) => input[key])
    .map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas
    .filter(([key]) => !input[key])
    .map(([, label]) => label);
  const reviewStatus: R665AccessibilityResponsiveReviewStatus =
    blockedReasons.length > 0
      ? "accessibility_responsive_review_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "accessibility_responsive_review_passed";

  const result: R665AccessibilityResponsiveReviewResult = {
    phase: "R66.5E",
    surface: "accessibility_responsive_safety_review",
    reviewStatus,
    reviewedFiles,
    overflowFindings,
    densityFindings,
    accessibilityFindings,
    governanceFindings,
    forbiddenSemanticFindings,
    blockedReasons,
    missingReviewAreas,
    safetyFlags,
    nextSuggestedPhase: "R66.5F - Final UX Lockdown Contract",
    summary: "R66.5E accessibility and responsive safety review.",
    ...safetyFlags,
  };

  return {
    ...result,
    summary: summarizeR665AccessibilityResponsiveSafetyReview(result),
  };
}

export function summarizeR665AccessibilityResponsiveSafetyReview(
  result: R665AccessibilityResponsiveReviewResult,
) {
  const invariantCheck = assertR665AccessibilityResponsiveReviewInvariants(result);
  return (
    `R66.5E ${result.surface} status is ${result.reviewStatus}. ` +
    `${result.reviewedFiles.length} dashboard files were reviewed for overflow, density, governance visibility, accessibility, and forbidden controls. ` +
    `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
    "This review cannot authorize execution, provider activation, persistence, polling, runtime activation, hidden controls, routes, logic changes, data mutations, or safety-copy weakening."
  );
}
