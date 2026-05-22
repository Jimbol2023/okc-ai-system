export const r74SafetyFindings = [
  "HITL does not imply autonomous execution.",
  "Human accountability remains required.",
  "Governance warnings remain visible.",
  "No provider controls are present.",
  "No activation controls are present.",
  "No send, call, text, or email controls are present.",
  "No workflow execution controls are present.",
  "No hidden execution affordances are present.",
  "No provider clients are present.",
  "No credential or env reads are present.",
  "No fetch/network behavior is present.",
  "No polling or runtime activation is present.",
] as const;

export const r74AccessibilityFindings = [
  "Semantic section structure is preserved.",
  "aria-labelledby is required.",
  "aria-describedby is required.",
  "Readable labels are required.",
  "Plain-language summaries are preserved.",
  "Screen-reader usability is preserved.",
  "Keyboard-only usability is preserved because no controls are added.",
  "Elderly and low-vision readability is preserved.",
  "No color-only meaning is allowed.",
  "No motion dependency is allowed.",
  "No focus movement is allowed.",
  "No auto-refresh is allowed.",
  "No polling is allowed.",
] as const;

export const r74SafetyFlags = {
  readOnly: true,
  advisoryOnly: true,
  providerCalled: false,
  sent: false,
  autonomousExecutionPresent: false,
  executionControlsPresent: false,
  providerControlsPresent: false,
  activationControlsPresent: false,
  sendControlsPresent: false,
  workflowControlsPresent: false,
  providerClientPresent: false,
  credentialEnvReadPresent: false,
  fetchNetworkPresent: false,
  hiddenExecutionAffordancePresent: false,
  runtimeActivationPresent: false,
  pollingPresent: false,
  persistencePresent: false,
  auditWritingPresent: false,
} as const;

export type R74SafetyStatus = "hitl_safety_blocked" | "operator_review_required" | "hitl_safety_clear";

export type R74SafetyInput = {
  semanticStructureReviewed?: boolean;
  accessibilityReviewed?: boolean;
  autonomyDriftReviewed?: boolean;
  governanceWarningsReviewed?: boolean;
  forbiddenControlsReviewed?: boolean;
  providerBoundaryReviewed?: boolean;
  hitlAutonomyDriftDetected?: boolean;
  executionControlDetected?: boolean;
  providerControlDetected?: boolean;
  activationControlDetected?: boolean;
  sendControlDetected?: boolean;
  workflowControlDetected?: boolean;
  providerClientDetected?: boolean;
  credentialEnvReadDetected?: boolean;
  fetchNetworkDetected?: boolean;
  hiddenExecutionAffordanceDetected?: boolean;
  dangerousWordingDetected?: boolean;
  runtimeDetected?: boolean;
  pollingDetected?: boolean;
  persistenceDetected?: boolean;
  auditWritingDetected?: boolean;
};

export type R74SafetyResult = {
  phase: "R74E";
  status: R74SafetyStatus;
  flags: typeof r74SafetyFlags;
  safetyFindings: typeof r74SafetyFindings;
  accessibilityFindings: typeof r74AccessibilityFindings;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R74F - HITL Revenue Execution Final Lockdown Contract";
};

const requiredReviewAreas: Array<[keyof R74SafetyInput, string]> = [
  ["semanticStructureReviewed", "semantic structure"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["autonomyDriftReviewed", "autonomy drift"],
  ["governanceWarningsReviewed", "governance warnings"],
  ["forbiddenControlsReviewed", "forbidden controls"],
  ["providerBoundaryReviewed", "provider boundary"],
];

const blockedReasons: Array<[keyof R74SafetyInput, string]> = [
  ["hitlAutonomyDriftDetected", "HITL must not imply autonomous execution"],
  ["executionControlDetected", "execution controls remain forbidden"],
  ["providerControlDetected", "provider controls remain forbidden"],
  ["activationControlDetected", "activation controls remain forbidden"],
  ["sendControlDetected", "send controls remain forbidden"],
  ["workflowControlDetected", "workflow controls remain forbidden"],
  ["providerClientDetected", "provider clients remain blocked"],
  ["credentialEnvReadDetected", "credential and env reads remain blocked"],
  ["fetchNetworkDetected", "fetch/network remains blocked"],
  ["hiddenExecutionAffordanceDetected", "hidden execution affordances remain forbidden"],
  ["dangerousWordingDetected", "dangerous wording must be removed"],
  ["runtimeDetected", "runtime activation remains blocked"],
  ["pollingDetected", "polling remains blocked"],
  ["persistenceDetected", "persistence remains blocked"],
  ["auditWritingDetected", "audit writing remains blocked"],
];

export function assertR74SafetyInvariants(result: R74SafetyResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly) throw new Error("R74E review must preserve read-only advisory behavior");
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.autonomousExecutionPresent ||
    flags.executionControlsPresent ||
    flags.providerControlsPresent ||
    flags.activationControlsPresent ||
    flags.sendControlsPresent ||
    flags.workflowControlsPresent ||
    flags.providerClientPresent ||
    flags.credentialEnvReadPresent ||
    flags.fetchNetworkPresent ||
    flags.hiddenExecutionAffordancePresent ||
    flags.runtimeActivationPresent ||
    flags.pollingPresent ||
    flags.persistencePresent ||
    flags.auditWritingPresent
  ) {
    throw new Error("R74E safety review cannot pass with autonomy, execution controls, providers, runtime, polling, persistence, or audit writing");
  }
}

export function createR74HitlRevenueExecutionSafetyAccessibilityReview(input: R74SafetyInput = {}): R74SafetyResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R74SafetyStatus =
    activeBlockedReasons.length > 0 ? "hitl_safety_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "hitl_safety_clear";
  const result: R74SafetyResult = {
    phase: "R74E",
    status,
    flags: r74SafetyFlags,
    safetyFindings: r74SafetyFindings,
    accessibilityFindings: r74AccessibilityFindings,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R74F - HITL Revenue Execution Final Lockdown Contract",
  };
  assertR74SafetyInvariants(result);
  return result;
}

export function summarizeR74HitlRevenueExecutionSafetyReview(result: R74SafetyResult): string {
  assertR74SafetyInvariants(result);
  return `R74E ${result.status}: HITL safety review preserves human accountability, readable read-only structure, visible governance warnings, no autonomous execution, no controls, no provider clients, no env reads, no fetch/network, no runtime, no polling, no persistence, and no audit writing.`;
}
