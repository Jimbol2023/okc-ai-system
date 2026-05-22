export const r675InclusiveReviewFlags = {
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
  auditPersistenceAllowedNow: false,
  auditRecordsWritten: false,
  noExecutionControlsAdded: true,
} as const;

export const r675InclusiveReviewFindings = [
  "Dashboard canvas uses more large-screen width through a dashboard-only shell.",
  "Public-site container width remains unchanged.",
  "Large-screen card distribution is less cramped while readable line lengths remain bounded inside cards.",
  "Elderly and low-vision readability is protected through spacing, larger canvas, and reduced narrow-column pressure.",
  "Blind and screen-reader structure is preserved because semantic sections and aria relationships were not removed.",
  "Keyboard-only usability is preserved because no controls, focus movement, auto-refresh, or polling were added.",
  "Audit layer is not active yet; no audit records are written in this phase.",
] as const;

export type R675InclusiveReviewStatus =
  | "inclusive_responsive_review_blocked"
  | "operator_review_required"
  | "inclusive_responsive_review_passed";

export type R675InclusiveReviewInput = {
  r675dReviewed?: boolean;
  canvasExpansionReviewed?: boolean;
  lineLengthReviewed?: boolean;
  elderlyLowVisionReviewed?: boolean;
  screenReaderReviewed?: boolean;
  keyboardReviewed?: boolean;
  governanceReviewed?: boolean;
  auditBoundaryReviewed?: boolean;
  crampedLayoutRemainsCritical?: boolean;
  unreadableLongLinesIntroduced?: boolean;
  colorOnlyMeaningIntroduced?: boolean;
  motionDependencyIntroduced?: boolean;
  focusMovementIntroduced?: boolean;
  autoRefreshIntroduced?: boolean;
  pollingIntroduced?: boolean;
  executionControlIntroduced?: boolean;
  providerPathIntroduced?: boolean;
  runtimeIntroduced?: boolean;
  persistenceIntroduced?: boolean;
  auditWritingIntroduced?: boolean;
  routeApiChangeIntroduced?: boolean;
};

export type R675InclusiveReviewResult = {
  phase: "R67.5E";
  status: R675InclusiveReviewStatus;
  flags: typeof r675InclusiveReviewFlags;
  findings: typeof r675InclusiveReviewFindings;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R67.5F - Final Dashboard Canvas Lockdown Contract";
};

const requiredReviewAreas: Array<[keyof R675InclusiveReviewInput, string]> = [
  ["r675dReviewed", "R67.5D implementation"],
  ["canvasExpansionReviewed", "canvas expansion"],
  ["lineLengthReviewed", "readable line lengths"],
  ["elderlyLowVisionReviewed", "elderly and low-vision usability"],
  ["screenReaderReviewed", "screen-reader structure"],
  ["keyboardReviewed", "keyboard-only usability"],
  ["governanceReviewed", "governance visibility"],
  ["auditBoundaryReviewed", "audit-log-not-active boundary"],
];

const blockedReasons: Array<[keyof R675InclusiveReviewInput, string]> = [
  ["crampedLayoutRemainsCritical", "critical cramped layout remains"],
  ["unreadableLongLinesIntroduced", "unreadable long lines introduced"],
  ["colorOnlyMeaningIntroduced", "color-only meaning introduced"],
  ["motionDependencyIntroduced", "motion dependency introduced"],
  ["focusMovementIntroduced", "focus movement introduced"],
  ["autoRefreshIntroduced", "auto-refresh introduced"],
  ["pollingIntroduced", "polling introduced"],
  ["executionControlIntroduced", "execution control introduced"],
  ["providerPathIntroduced", "provider path introduced"],
  ["runtimeIntroduced", "runtime activation introduced"],
  ["persistenceIntroduced", "persistence introduced"],
  ["auditWritingIntroduced", "audit writing introduced"],
  ["routeApiChangeIntroduced", "route/API change introduced"],
];

export function assertR675InclusiveAccessibilityResponsiveSafetyReviewInvariants(result: R675InclusiveReviewResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) {
    throw new Error("R67.5E must remain read-only, advisory-only, and simulation-only");
  }
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.auditPersistenceAllowedNow ||
    flags.auditRecordsWritten ||
    !flags.noExecutionControlsAdded
  ) {
    throw new Error("R67.5E cannot pass with execution, provider, persistence, polling, runtime, approval, or audit writing drift");
  }
}

export function createR675InclusiveAccessibilityResponsiveSafetyReview(
  input: R675InclusiveReviewInput = {},
): R675InclusiveReviewResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R675InclusiveReviewStatus =
    activeBlockedReasons.length > 0
      ? "inclusive_responsive_review_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "inclusive_responsive_review_passed";
  const result: R675InclusiveReviewResult = {
    phase: "R67.5E",
    status,
    flags: r675InclusiveReviewFlags,
    findings: r675InclusiveReviewFindings,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R67.5F - Final Dashboard Canvas Lockdown Contract",
  };
  assertR675InclusiveAccessibilityResponsiveSafetyReviewInvariants(result);
  return result;
}

export function summarizeR675InclusiveAccessibilityResponsiveSafetyReview(result: R675InclusiveReviewResult): string {
  assertR675InclusiveAccessibilityResponsiveSafetyReviewInvariants(result);
  return `R67.5E ${result.status}: canvas expansion reviewed for inclusive accessibility, responsive safety, governance visibility, and audit-log-not-active boundaries.`;
}
