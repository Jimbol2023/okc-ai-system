export const r73SafetyFindings = [
  "Provider readiness does not imply activation.",
  "Provider activation remains blocked.",
  "No provider controls are present.",
  "No activation controls are present.",
  "No send, call, text, or email controls are present.",
  "No provider clients are present.",
  "No credential or env reads are present.",
  "No fetch/network behavior is present.",
  "No polling is present.",
  "No runtime activation is present.",
  "Governance warnings remain visible.",
] as const;

export const r73AccessibilityFindings = [
  "Semantic section structure is preserved.",
  "aria-labelledby is required.",
  "aria-describedby is required.",
  "Readable labels are required.",
  "Plain-language summaries are preserved.",
  "Keyboard-only usability is preserved because no controls are added.",
  "Elderly and low-vision readability is preserved.",
  "No color-only meaning is allowed.",
  "No motion dependency is allowed.",
  "No focus movement is allowed.",
  "No auto-refresh is allowed.",
  "No polling is allowed.",
] as const;

export const r73SafetyFlags = {
  readOnly: true,
  advisoryOnly: true,
  providerCalled: false,
  sent: false,
  providerControlsPresent: false,
  activationControlsPresent: false,
  sendControlsPresent: false,
  providerClientPresent: false,
  credentialEnvReadPresent: false,
  fetchNetworkPresent: false,
  hiddenExecutionAffordancePresent: false,
  runtimeActivationPresent: false,
  pollingPresent: false,
  persistencePresent: false,
  auditWritingPresent: false,
} as const;

export type R73SafetyStatus = "provider_readiness_safety_blocked" | "operator_review_required" | "provider_readiness_safety_clear";

export type R73SafetyInput = {
  semanticStructureReviewed?: boolean;
  accessibilityReviewed?: boolean;
  readinessDoesNotActivateReviewed?: boolean;
  governanceWarningsReviewed?: boolean;
  forbiddenControlsReviewed?: boolean;
  providerBoundaryReviewed?: boolean;
  readinessActivationDriftDetected?: boolean;
  providerControlDetected?: boolean;
  activationControlDetected?: boolean;
  sendControlDetected?: boolean;
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

export type R73SafetyResult = {
  phase: "R73E";
  status: R73SafetyStatus;
  flags: typeof r73SafetyFlags;
  safetyFindings: typeof r73SafetyFindings;
  accessibilityFindings: typeof r73AccessibilityFindings;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R73F - Controlled Provider Activation Readiness Final Lockdown Contract";
};

const requiredReviewAreas: Array<[keyof R73SafetyInput, string]> = [
  ["semanticStructureReviewed", "semantic structure"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["readinessDoesNotActivateReviewed", "readiness-does-not-activate"],
  ["governanceWarningsReviewed", "governance warnings"],
  ["forbiddenControlsReviewed", "forbidden controls"],
  ["providerBoundaryReviewed", "provider boundary"],
];

const blockedReasons: Array<[keyof R73SafetyInput, string]> = [
  ["readinessActivationDriftDetected", "readiness-to-activation drift remains forbidden"],
  ["providerControlDetected", "provider controls remain forbidden"],
  ["activationControlDetected", "activation controls remain forbidden"],
  ["sendControlDetected", "send controls remain forbidden"],
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

export function assertR73SafetyInvariants(result: R73SafetyResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly) throw new Error("R73E review must preserve read-only advisory behavior");
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.providerControlsPresent ||
    flags.activationControlsPresent ||
    flags.sendControlsPresent ||
    flags.providerClientPresent ||
    flags.credentialEnvReadPresent ||
    flags.fetchNetworkPresent ||
    flags.hiddenExecutionAffordancePresent ||
    flags.runtimeActivationPresent ||
    flags.pollingPresent ||
    flags.persistencePresent ||
    flags.auditWritingPresent
  ) {
    throw new Error("R73E safety review cannot pass with provider activation, provider clients, credential/env reads, fetch/network, controls, runtime, polling, persistence, or audit writing");
  }
}

export function createR73ProviderActivationReadinessSafetyAccessibilityReview(input: R73SafetyInput = {}): R73SafetyResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R73SafetyStatus =
    activeBlockedReasons.length > 0 ? "provider_readiness_safety_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "provider_readiness_safety_clear";
  const result: R73SafetyResult = {
    phase: "R73E",
    status,
    flags: r73SafetyFlags,
    safetyFindings: r73SafetyFindings,
    accessibilityFindings: r73AccessibilityFindings,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R73F - Controlled Provider Activation Readiness Final Lockdown Contract",
  };
  assertR73SafetyInvariants(result);
  return result;
}

export function summarizeR73ProviderActivationReadinessSafetyReview(result: R73SafetyResult): string {
  assertR73SafetyInvariants(result);
  return `R73E ${result.status}: provider readiness safety review preserves readable read-only structure, visible governance warnings, no readiness-to-activation drift, no provider controls, no clients, no credential/env reads, no fetch/network, no polling, no runtime activation, no persistence, no audit writing, and no execution.`;
}
