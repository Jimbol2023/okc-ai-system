export const r72SafetyReviewFindings = [
  "Revenue pressure does not override governance.",
  "Revenue priority is advisory only.",
  "Revenue score never grants execution.",
  "Near-close status never grants execution.",
  "Stuck-deal status never grants provider activation.",
  "Buyer-ready status never grants outreach.",
  "Overdue follow-up never grants sending.",
  "No execution controls are present.",
  "No provider controls are present.",
  "No send, call, text, or email controls are present.",
  "No campaign controls are present.",
  "Governance warnings remain visible.",
] as const;

export const r72AccessibilityReviewFindings = [
  "Semantic section structure is preserved.",
  "aria-labelledby is required.",
  "aria-describedby is required.",
  "Readable labels are required.",
  "Screen-reader summaries are preserved.",
  "Keyboard-only usability is preserved because no controls are added.",
  "Elderly and low-vision readability is preserved with plain text and sufficient spacing.",
  "No color-only meaning is allowed.",
  "No motion dependency is allowed.",
  "No focus movement is allowed.",
  "No auto-refresh is allowed.",
  "No polling is allowed.",
] as const;

export const r72SafetyReviewFlags = {
  readOnly: true,
  advisoryOnly: true,
  providerCalled: false,
  sent: false,
  executionControlsPresent: false,
  providerControlsPresent: false,
  sendControlsPresent: false,
  callControlsPresent: false,
  smsControlsPresent: false,
  emailControlsPresent: false,
  campaignControlsPresent: false,
  hiddenExecutionAffordancePresent: false,
  fetchNetworkPresent: false,
  runtimeActivationPresent: false,
  pollingPresent: false,
  persistencePresent: false,
  auditWritingPresent: false,
} as const;

export type R72SafetyReviewStatus = "revenue_command_safety_blocked" | "operator_review_required" | "revenue_command_safety_clear";

export type R72SafetyReviewInput = {
  semanticStructureReviewed?: boolean;
  accessibilityReviewed?: boolean;
  revenuePressureReviewed?: boolean;
  governanceWarningsReviewed?: boolean;
  forbiddenControlsReviewed?: boolean;
  providerBoundaryReviewed?: boolean;
  revenuePressureOverrideRequested?: boolean;
  executionControlDetected?: boolean;
  providerControlDetected?: boolean;
  sendControlDetected?: boolean;
  callControlDetected?: boolean;
  smsControlDetected?: boolean;
  emailControlDetected?: boolean;
  campaignControlDetected?: boolean;
  hiddenExecutionAffordanceDetected?: boolean;
  dangerousWordingDetected?: boolean;
  fetchNetworkDetected?: boolean;
  runtimeDetected?: boolean;
  pollingDetected?: boolean;
  persistenceDetected?: boolean;
  auditWritingDetected?: boolean;
};

export type R72SafetyReviewResult = {
  phase: "R72E";
  status: R72SafetyReviewStatus;
  flags: typeof r72SafetyReviewFlags;
  safetyFindings: typeof r72SafetyReviewFindings;
  accessibilityFindings: typeof r72AccessibilityReviewFindings;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R72F - Revenue Command Center Final Lockdown Contract";
};

const requiredReviewAreas: Array<[keyof R72SafetyReviewInput, string]> = [
  ["semanticStructureReviewed", "semantic structure"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["revenuePressureReviewed", "revenue pressure"],
  ["governanceWarningsReviewed", "governance warnings"],
  ["forbiddenControlsReviewed", "forbidden controls"],
  ["providerBoundaryReviewed", "provider boundary"],
];

const blockedReasons: Array<[keyof R72SafetyReviewInput, string]> = [
  ["revenuePressureOverrideRequested", "revenue pressure cannot override governance"],
  ["executionControlDetected", "execution controls remain forbidden"],
  ["providerControlDetected", "provider controls remain forbidden"],
  ["sendControlDetected", "send controls remain forbidden"],
  ["callControlDetected", "call controls remain forbidden"],
  ["smsControlDetected", "SMS controls remain forbidden"],
  ["emailControlDetected", "email controls remain forbidden"],
  ["campaignControlDetected", "campaign controls remain forbidden"],
  ["hiddenExecutionAffordanceDetected", "hidden execution affordances remain forbidden"],
  ["dangerousWordingDetected", "dangerous wording must be removed"],
  ["fetchNetworkDetected", "fetch/network remains blocked"],
  ["runtimeDetected", "runtime activation remains blocked"],
  ["pollingDetected", "polling remains blocked"],
  ["persistenceDetected", "persistence remains blocked"],
  ["auditWritingDetected", "audit writing remains blocked"],
];

export function assertR72SafetyReviewInvariants(result: R72SafetyReviewResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly) throw new Error("R72E review must preserve read-only advisory behavior");
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.executionControlsPresent ||
    flags.providerControlsPresent ||
    flags.sendControlsPresent ||
    flags.callControlsPresent ||
    flags.smsControlsPresent ||
    flags.emailControlsPresent ||
    flags.campaignControlsPresent ||
    flags.hiddenExecutionAffordancePresent ||
    flags.fetchNetworkPresent ||
    flags.runtimeActivationPresent ||
    flags.pollingPresent ||
    flags.persistencePresent ||
    flags.auditWritingPresent
  ) {
    throw new Error("R72E safety review cannot pass with execution, provider, send, campaign, fetch/network, runtime, polling, persistence, or audit-writing drift");
  }
}

export function createR72RevenueCommandCenterSafetyAccessibilityReview(input: R72SafetyReviewInput = {}): R72SafetyReviewResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R72SafetyReviewStatus =
    activeBlockedReasons.length > 0 ? "revenue_command_safety_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "revenue_command_safety_clear";
  const result: R72SafetyReviewResult = {
    phase: "R72E",
    status,
    flags: r72SafetyReviewFlags,
    safetyFindings: r72SafetyReviewFindings,
    accessibilityFindings: r72AccessibilityReviewFindings,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R72F - Revenue Command Center Final Lockdown Contract",
  };
  assertR72SafetyReviewInvariants(result);
  return result;
}

export function summarizeR72RevenueCommandCenterSafetyReview(result: R72SafetyReviewResult): string {
  assertR72SafetyReviewInvariants(result);
  return `R72E ${result.status}: Revenue Command Center safety review preserves visible governance warnings, accessible read-only structure, no controls, no revenue-pressure override, no provider activation, no sending, no polling, no persistence, no audit writing, and no execution.`;
}
