export const r70SafetyFlags = {
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
  fetchNetworkAllowed: false,
  auditRecordsWritten: false,
  noExecutionControlsAdded: true,
  noProviderControlsAdded: true,
  noDangerousWording: true,
} as const;

export const r70SafetyFindings = [
  "Manual operator action center dashboard surface is advisory-only, read-only, and simulation-only.",
  "No buttons, click handlers, forms, execution controls, send controls, provider controls, approval controls, polling, auto-refresh, runtime activation, audit writing, persistence, env reads, fetch/network calls, or provider clients were added.",
  "Semantic section, aria-labelledby, aria-describedby, readable labels, plain-language summaries, and text-based status meaning are present.",
  "Elderly, low-vision, blind, screen-reader, keyboard-only, reduced-motor-control, and cognitive-load-sensitive usability expectations remain protected.",
  "Governance warnings remain visible and recommendations remain manual-review-only.",
] as const;

export type R70SafetyStatus = "manual_action_center_safety_blocked" | "operator_review_required" | "manual_action_center_safety_passed";

export type R70SafetyInput = {
  r70dUiReviewed?: boolean;
  contractsReviewed?: boolean;
  semanticStructureReviewed?: boolean;
  accessibilityReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  hiddenControlsReviewed?: boolean;
  providerBoundaryReviewed?: boolean;
  runtimePollingReviewed?: boolean;
  persistenceAuditReviewed?: boolean;
  governanceVisibilityReviewed?: boolean;
  executionControlFound?: boolean;
  providerControlFound?: boolean;
  sendControlFound?: boolean;
  hiddenExecutionAffordanceFound?: boolean;
  dangerousWordingFound?: boolean;
  accessibilityRegressionFound?: boolean;
  pollingFound?: boolean;
  runtimeFound?: boolean;
  persistenceFound?: boolean;
  auditWritingFound?: boolean;
  fetchNetworkFound?: boolean;
};

export type R70SafetyResult = {
  phase: "R70E";
  status: R70SafetyStatus;
  flags: typeof r70SafetyFlags;
  findings: typeof r70SafetyFindings;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R70F - Manual Operator Action Center Final Lockdown Contract";
};

const requiredReviewAreas: Array<[keyof R70SafetyInput, string]> = [
  ["r70dUiReviewed", "R70D UI"],
  ["contractsReviewed", "R70 contracts"],
  ["semanticStructureReviewed", "semantic structure"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["dangerousWordingReviewed", "dangerous wording"],
  ["hiddenControlsReviewed", "hidden controls"],
  ["providerBoundaryReviewed", "provider boundary"],
  ["runtimePollingReviewed", "runtime/polling"],
  ["persistenceAuditReviewed", "persistence/audit"],
  ["governanceVisibilityReviewed", "governance visibility"],
];

const blockedReasons: Array<[keyof R70SafetyInput, string]> = [
  ["executionControlFound", "execution control found"],
  ["providerControlFound", "provider control found"],
  ["sendControlFound", "send control found"],
  ["hiddenExecutionAffordanceFound", "hidden execution affordance found"],
  ["dangerousWordingFound", "dangerous wording found"],
  ["accessibilityRegressionFound", "accessibility regression found"],
  ["pollingFound", "polling found"],
  ["runtimeFound", "runtime activation found"],
  ["persistenceFound", "persistence found"],
  ["auditWritingFound", "audit writing found"],
  ["fetchNetworkFound", "fetch/network found"],
];

export function assertR70SafetyInvariants(result: R70SafetyResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R70E must remain read-only advisory simulation");
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.fetchNetworkAllowed ||
    flags.auditRecordsWritten ||
    !flags.noExecutionControlsAdded ||
    !flags.noProviderControlsAdded ||
    !flags.noDangerousWording
  ) {
    throw new Error("R70E cannot pass with controls, providers, fetch/network, runtime, polling, persistence, audit, send, or wording drift");
  }
}

export function createR70ManualOperatorActionCenterSafetyAccessibilityReview(input: R70SafetyInput = {}): R70SafetyResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R70SafetyStatus =
    activeBlockedReasons.length > 0
      ? "manual_action_center_safety_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "manual_action_center_safety_passed";
  const result: R70SafetyResult = {
    phase: "R70E",
    status,
    flags: r70SafetyFlags,
    findings: r70SafetyFindings,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R70F - Manual Operator Action Center Final Lockdown Contract",
  };
  assertR70SafetyInvariants(result);
  return result;
}

export function summarizeR70ManualOperatorActionCenterSafetyAccessibilityReview(result: R70SafetyResult): string {
  assertR70SafetyInvariants(result);
  return `R70E ${result.status}: manual operator action center UI and contracts reviewed for execution drift, provider drift, hidden controls, dangerous wording, inclusive accessibility, polling, runtime, persistence, audit writing, and fetch/network regressions.`;
}
