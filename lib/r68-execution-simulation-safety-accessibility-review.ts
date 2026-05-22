export const r68SafetyAccessibilityFlags = {
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
  noSimulationToExecutionDrift: true,
} as const;

export const r68SafetyReviewFindings = [
  "Execution simulation dashboard surface is advisory-only, read-only, and simulation-only.",
  "No buttons, execution controls, provider controls, send controls, approval-to-send controls, workflow controls, campaign controls, polling, auto-refresh, runtime activation, automation-agent activation, audit writing, or persistence were added.",
  "Semantic section, aria-labelledby, aria-describedby, readable labels, plain-language summaries, and text-based status meaning are present.",
  "Elderly, low-vision, blind, screen-reader, keyboard-only, reduced-motor-control, and cognitive-load-sensitive usability expectations remain protected.",
  "Governance warnings remain visible, audit layer not active yet wording is explicit, and no audit records are written in this phase.",
  "Simulation preview, approval, readiness, queue, urgency, and revenue signals remain blocked from execution.",
] as const;

export type R68SafetyAccessibilityStatus =
  | "safety_accessibility_review_blocked"
  | "operator_review_required"
  | "safety_accessibility_review_passed";

export type R68SafetyAccessibilityInput = {
  r68dUiReviewed?: boolean;
  contractsReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  hiddenControlsReviewed?: boolean;
  inclusiveAccessibilityReviewed?: boolean;
  providerRuntimePollingReviewed?: boolean;
  persistenceAuditBoundaryReviewed?: boolean;
  governanceVisibilityReviewed?: boolean;
  simulationToExecutionDriftFound?: boolean;
  previewToProviderDriftFound?: boolean;
  providerDriftFound?: boolean;
  runtimeDriftFound?: boolean;
  pollingDriftFound?: boolean;
  persistenceDriftFound?: boolean;
  auditWritingDriftFound?: boolean;
  hiddenExecutionAffordanceFound?: boolean;
  dangerousWordingFound?: boolean;
  accessibilityRegressionFound?: boolean;
  executionControlFound?: boolean;
};

export type R68SafetyAccessibilityResult = {
  phase: "R68E";
  status: R68SafetyAccessibilityStatus;
  flags: typeof r68SafetyAccessibilityFlags;
  findings: typeof r68SafetyReviewFindings;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R68F - Execution Simulation Final Lockdown Contract";
};

const requiredReviewAreas: Array<[keyof R68SafetyAccessibilityInput, string]> = [
  ["r68dUiReviewed", "R68D UI"],
  ["contractsReviewed", "R68 contracts"],
  ["dangerousWordingReviewed", "dangerous wording"],
  ["hiddenControlsReviewed", "hidden controls"],
  ["inclusiveAccessibilityReviewed", "inclusive accessibility"],
  ["providerRuntimePollingReviewed", "provider/runtime/polling"],
  ["persistenceAuditBoundaryReviewed", "persistence/audit boundary"],
  ["governanceVisibilityReviewed", "governance visibility"],
];

const blockedReasons: Array<[keyof R68SafetyAccessibilityInput, string]> = [
  ["simulationToExecutionDriftFound", "simulation-to-execution drift found"],
  ["previewToProviderDriftFound", "preview-to-provider drift found"],
  ["providerDriftFound", "provider drift found"],
  ["runtimeDriftFound", "runtime drift found"],
  ["pollingDriftFound", "polling drift found"],
  ["persistenceDriftFound", "persistence drift found"],
  ["auditWritingDriftFound", "audit-writing drift found"],
  ["hiddenExecutionAffordanceFound", "hidden execution affordance found"],
  ["dangerousWordingFound", "dangerous wording found"],
  ["accessibilityRegressionFound", "accessibility regression found"],
  ["executionControlFound", "execution control found"],
];

export function assertR68SafetyAccessibilityInvariants(result: R68SafetyAccessibilityResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) {
    throw new Error("R68E must remain read-only, advisory-only, and simulation-only");
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
    !flags.noExecutionControlsAdded ||
    !flags.noSimulationToExecutionDrift
  ) {
    throw new Error("R68E cannot pass with execution, provider, runtime, polling, persistence, audit writing, sending, or simulation drift");
  }
}

export function createR68ExecutionSimulationSafetyAccessibilityReview(
  input: R68SafetyAccessibilityInput = {},
): R68SafetyAccessibilityResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R68SafetyAccessibilityStatus =
    activeBlockedReasons.length > 0
      ? "safety_accessibility_review_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "safety_accessibility_review_passed";
  const result: R68SafetyAccessibilityResult = {
    phase: "R68E",
    status,
    flags: r68SafetyAccessibilityFlags,
    findings: r68SafetyReviewFindings,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R68F - Execution Simulation Final Lockdown Contract",
  };
  assertR68SafetyAccessibilityInvariants(result);
  return result;
}

export function summarizeR68ExecutionSimulationSafetyAccessibilityReview(result: R68SafetyAccessibilityResult): string {
  assertR68SafetyAccessibilityInvariants(result);
  return `R68E ${result.status}: simulation UI and contracts reviewed for simulation-to-execution drift, provider/runtime/polling risk, persistence/audit-writing risk, hidden controls, dangerous wording, and inclusive accessibility regression.`;
}
