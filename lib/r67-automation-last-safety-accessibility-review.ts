export const r67SafetyAccessibilityFlags = {
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
  noAutomationDrift: true,
} as const;

export const r67SafetyReviewFindings = [
  "Automation-last dashboard surface is advisory-only and read-only.",
  "No buttons, execution controls, provider controls, send controls, approval-to-send controls, workflow controls, campaign controls, polling, auto-refresh, runtime activation, or automation-agent activation were added.",
  "Semantic section, aria-labelledby, aria-describedby, readable labels, and text-based status meaning are present.",
  "Governance warnings remain visible and automation-last copy is explicit.",
  "Provider, runtime, polling, campaign, hidden execution, and permission drift remain blocked.",
] as const;

export type R67SafetyAccessibilityStatus =
  | "safety_accessibility_review_blocked"
  | "operator_review_required"
  | "safety_accessibility_review_passed";

export type R67SafetyAccessibilityInput = {
  r67dUiReviewed?: boolean;
  contractsReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  hiddenControlsReviewed?: boolean;
  accessibilityReviewed?: boolean;
  providerRuntimePollingReviewed?: boolean;
  governanceVisibilityReviewed?: boolean;
  automationDriftFound?: boolean;
  permissionDriftFound?: boolean;
  providerDriftFound?: boolean;
  runtimeDriftFound?: boolean;
  pollingDriftFound?: boolean;
  hiddenExecutionAffordanceFound?: boolean;
  dangerousWordingFound?: boolean;
  accessibilityRegressionFound?: boolean;
  executionControlFound?: boolean;
};

export type R67SafetyAccessibilityResult = {
  phase: "R67E";
  status: R67SafetyAccessibilityStatus;
  flags: typeof r67SafetyAccessibilityFlags;
  findings: typeof r67SafetyReviewFindings;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R67F - Automation-Last Final Lockdown Contract";
};

const requiredReviewAreas: Array<[keyof R67SafetyAccessibilityInput, string]> = [
  ["r67dUiReviewed", "R67D UI"],
  ["contractsReviewed", "R67 contracts"],
  ["dangerousWordingReviewed", "dangerous wording"],
  ["hiddenControlsReviewed", "hidden controls"],
  ["accessibilityReviewed", "accessibility"],
  ["providerRuntimePollingReviewed", "provider/runtime/polling"],
  ["governanceVisibilityReviewed", "governance visibility"],
];

const blockedReasons: Array<[keyof R67SafetyAccessibilityInput, string]> = [
  ["automationDriftFound", "automation drift found"],
  ["permissionDriftFound", "permission drift found"],
  ["providerDriftFound", "provider drift found"],
  ["runtimeDriftFound", "runtime drift found"],
  ["pollingDriftFound", "polling drift found"],
  ["hiddenExecutionAffordanceFound", "hidden execution affordance found"],
  ["dangerousWordingFound", "dangerous wording found"],
  ["accessibilityRegressionFound", "accessibility regression found"],
  ["executionControlFound", "execution control found"],
];

export function assertR67SafetyAccessibilityInvariants(result: R67SafetyAccessibilityResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) {
    throw new Error("R67E must remain read-only, advisory-only, and simulation-only");
  }
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    !flags.noExecutionControlsAdded ||
    !flags.noAutomationDrift
  ) {
    throw new Error("R67E cannot pass with execution, automation, provider, runtime, polling, persistence, sending, or approval drift");
  }
}

export function createR67AutomationLastSafetyAccessibilityReview(
  input: R67SafetyAccessibilityInput = {},
): R67SafetyAccessibilityResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R67SafetyAccessibilityStatus =
    activeBlockedReasons.length > 0
      ? "safety_accessibility_review_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "safety_accessibility_review_passed";
  const result: R67SafetyAccessibilityResult = {
    phase: "R67E",
    status,
    flags: r67SafetyAccessibilityFlags,
    findings: r67SafetyReviewFindings,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R67F - Automation-Last Final Lockdown Contract",
  };
  assertR67SafetyAccessibilityInvariants(result);
  return result;
}

export function summarizeR67AutomationLastSafetyAccessibilityReview(result: R67SafetyAccessibilityResult): string {
  assertR67SafetyAccessibilityInvariants(result);
  return `R67E ${result.status}: automation-last UI and contracts reviewed for drift, hidden controls, dangerous wording, provider/runtime/polling risk, and accessibility regression.`;
}
