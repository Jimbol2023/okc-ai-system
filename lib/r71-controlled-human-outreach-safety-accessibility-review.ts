export const r71SafetyFlags = {
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
  outreachAuthorizedNow: false,
  smsAllowedNow: false,
  emailAllowedNow: false,
  callAllowedNow: false,
  campaignAllowedNow: false,
  fetchNetworkAllowed: false,
  auditRecordsWritten: false,
  noSendControlsAdded: true,
  noProviderControlsAdded: true,
  noDangerousWording: true,
} as const;

export const r71SafetyFindings = [
  "Controlled human outreach dashboard surface is advisory-only, read-only, and simulation-only.",
  "No buttons, click handlers, forms, inputs, send controls, call controls, SMS controls, email controls, provider controls, campaign controls, polling, auto-refresh, runtime jobs, provider activation, audit writing, persistence, env reads, fetch/network calls, or execution controls were added.",
  "Semantic section, aria-labelledby, aria-describedby, readable labels, plain-language summaries, and text-based status meaning are present.",
  "Elderly, low-vision, blind, screen-reader, keyboard-only, reduced-motor-control, and cognitive-load-sensitive usability expectations remain protected.",
  "Governance warnings remain visible and contact is not authorized in this phase.",
] as const;

export type R71SafetyStatus = "controlled_outreach_safety_blocked" | "operator_review_required" | "controlled_outreach_safety_passed";

export type R71SafetyInput = {
  r71dUiReviewed?: boolean;
  contractsReviewed?: boolean;
  semanticStructureReviewed?: boolean;
  accessibilityReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  hiddenControlsReviewed?: boolean;
  providerBoundaryReviewed?: boolean;
  sendCallTextEmailReviewed?: boolean;
  runtimePollingReviewed?: boolean;
  persistenceAuditReviewed?: boolean;
  governanceVisibilityReviewed?: boolean;
  sendControlFound?: boolean;
  callControlFound?: boolean;
  smsControlFound?: boolean;
  emailControlFound?: boolean;
  providerControlFound?: boolean;
  executionControlFound?: boolean;
  hiddenExecutionAffordanceFound?: boolean;
  dangerousWordingFound?: boolean;
  accessibilityRegressionFound?: boolean;
  pollingFound?: boolean;
  runtimeFound?: boolean;
  persistenceFound?: boolean;
  auditWritingFound?: boolean;
  fetchNetworkFound?: boolean;
  campaignFound?: boolean;
};

export type R71SafetyResult = {
  phase: "R71E";
  status: R71SafetyStatus;
  flags: typeof r71SafetyFlags;
  findings: typeof r71SafetyFindings;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R71F - Controlled Human Outreach Final Lockdown Contract";
};

const requiredReviewAreas: Array<[keyof R71SafetyInput, string]> = [
  ["r71dUiReviewed", "R71D UI"],
  ["contractsReviewed", "R71 contracts"],
  ["semanticStructureReviewed", "semantic structure"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["dangerousWordingReviewed", "dangerous wording"],
  ["hiddenControlsReviewed", "hidden controls"],
  ["providerBoundaryReviewed", "provider boundary"],
  ["sendCallTextEmailReviewed", "send/call/text/email"],
  ["runtimePollingReviewed", "runtime/polling"],
  ["persistenceAuditReviewed", "persistence/audit"],
  ["governanceVisibilityReviewed", "governance visibility"],
];

const blockedReasons: Array<[keyof R71SafetyInput, string]> = [
  ["sendControlFound", "send control found"],
  ["callControlFound", "call control found"],
  ["smsControlFound", "SMS control found"],
  ["emailControlFound", "email control found"],
  ["providerControlFound", "provider control found"],
  ["executionControlFound", "execution control found"],
  ["hiddenExecutionAffordanceFound", "hidden execution affordance found"],
  ["dangerousWordingFound", "dangerous wording found"],
  ["accessibilityRegressionFound", "accessibility regression found"],
  ["pollingFound", "polling found"],
  ["runtimeFound", "runtime activation found"],
  ["persistenceFound", "persistence found"],
  ["auditWritingFound", "audit writing found"],
  ["fetchNetworkFound", "fetch/network found"],
  ["campaignFound", "campaign found"],
];

export function assertR71SafetyInvariants(result: R71SafetyResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R71E must remain read-only advisory simulation");
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.outreachAuthorizedNow ||
    flags.smsAllowedNow ||
    flags.emailAllowedNow ||
    flags.callAllowedNow ||
    flags.campaignAllowedNow ||
    flags.fetchNetworkAllowed ||
    flags.auditRecordsWritten ||
    !flags.noSendControlsAdded ||
    !flags.noProviderControlsAdded ||
    !flags.noDangerousWording
  ) {
    throw new Error("R71E cannot pass with outreach/send/provider/runtime/polling/persistence/audit/campaign/fetch drift");
  }
}

export function createR71ControlledHumanOutreachSafetyAccessibilityReview(input: R71SafetyInput = {}): R71SafetyResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R71SafetyStatus =
    activeBlockedReasons.length > 0 ? "controlled_outreach_safety_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "controlled_outreach_safety_passed";
  const result: R71SafetyResult = {
    phase: "R71E",
    status,
    flags: r71SafetyFlags,
    findings: r71SafetyFindings,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R71F - Controlled Human Outreach Final Lockdown Contract",
  };
  assertR71SafetyInvariants(result);
  return result;
}

export function summarizeR71ControlledHumanOutreachSafetyAccessibilityReview(result: R71SafetyResult): string {
  assertR71SafetyInvariants(result);
  return `R71E ${result.status}: controlled outreach UI and contracts reviewed for send/call/text/email controls, provider drift, hidden controls, dangerous wording, accessibility, polling, runtime, persistence, audit writing, campaigns, fetch/network, and execution regressions.`;
}
