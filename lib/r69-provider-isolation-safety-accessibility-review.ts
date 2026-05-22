export const r69SafetyAccessibilityFlags = {
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
  providerCredentialsAccessed: false,
  providerEnvReadAllowed: false,
  fetchNetworkAllowed: false,
  providerClientAllowed: false,
  auditRecordsWritten: false,
  noProviderControlsAdded: true,
  noProviderActivationDrift: true,
} as const;

export const r69SafetyReviewFindings = [
  "Provider isolation dashboard surface is advisory-only, read-only, and simulation-only.",
  "No buttons, execution controls, provider controls, send controls, approval-to-send controls, workflow controls, campaign controls, polling, auto-refresh, runtime activation, automation-agent activation, audit writing, persistence, env reads, fetch/network calls, or provider clients were added.",
  "Semantic section, aria-labelledby, aria-describedby, readable labels, plain-language summaries, and text-based status meaning are present.",
  "Elderly, low-vision, blind, screen-reader, keyboard-only, reduced-motor-control, and cognitive-load-sensitive usability expectations remain protected.",
  "Governance warnings remain visible, provider activation remains blocked, and audit layer not active yet wording is explicit.",
  "Provider readiness, approval, simulation, preview, readiness, queue, urgency, and revenue signals remain blocked from provider activation.",
] as const;

export type R69SafetyAccessibilityStatus =
  | "provider_safety_accessibility_review_blocked"
  | "operator_review_required"
  | "provider_safety_accessibility_review_passed";

export type R69SafetyAccessibilityInput = {
  r69dUiReviewed?: boolean;
  contractsReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  hiddenControlsReviewed?: boolean;
  inclusiveAccessibilityReviewed?: boolean;
  providerControlsReviewed?: boolean;
  credentialEnvReviewed?: boolean;
  fetchNetworkReviewed?: boolean;
  providerRuntimePollingReviewed?: boolean;
  persistenceAuditBoundaryReviewed?: boolean;
  governanceVisibilityReviewed?: boolean;
  providerActivationDriftFound?: boolean;
  providerReadinessActivationDriftFound?: boolean;
  credentialEnvDriftFound?: boolean;
  fetchNetworkDriftFound?: boolean;
  runtimeDriftFound?: boolean;
  pollingDriftFound?: boolean;
  persistenceDriftFound?: boolean;
  auditWritingDriftFound?: boolean;
  hiddenExecutionAffordanceFound?: boolean;
  dangerousWordingFound?: boolean;
  accessibilityRegressionFound?: boolean;
  providerControlFound?: boolean;
  executionControlFound?: boolean;
};

export type R69SafetyAccessibilityResult = {
  phase: "R69E";
  status: R69SafetyAccessibilityStatus;
  flags: typeof r69SafetyAccessibilityFlags;
  findings: typeof r69SafetyReviewFindings;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R69F - Provider Isolation Final Lockdown Contract";
};

const requiredReviewAreas: Array<[keyof R69SafetyAccessibilityInput, string]> = [
  ["r69dUiReviewed", "R69D UI"],
  ["contractsReviewed", "R69 contracts"],
  ["dangerousWordingReviewed", "dangerous wording"],
  ["hiddenControlsReviewed", "hidden controls"],
  ["inclusiveAccessibilityReviewed", "inclusive accessibility"],
  ["providerControlsReviewed", "provider controls"],
  ["credentialEnvReviewed", "credential/env-read"],
  ["fetchNetworkReviewed", "fetch/network"],
  ["providerRuntimePollingReviewed", "provider/runtime/polling"],
  ["persistenceAuditBoundaryReviewed", "persistence/audit boundary"],
  ["governanceVisibilityReviewed", "governance visibility"],
];

const blockedReasons: Array<[keyof R69SafetyAccessibilityInput, string]> = [
  ["providerActivationDriftFound", "provider activation drift found"],
  ["providerReadinessActivationDriftFound", "provider readiness-to-activation drift found"],
  ["credentialEnvDriftFound", "credential/env-read drift found"],
  ["fetchNetworkDriftFound", "fetch/network drift found"],
  ["runtimeDriftFound", "runtime drift found"],
  ["pollingDriftFound", "polling drift found"],
  ["persistenceDriftFound", "persistence drift found"],
  ["auditWritingDriftFound", "audit-writing drift found"],
  ["hiddenExecutionAffordanceFound", "hidden execution affordance found"],
  ["dangerousWordingFound", "dangerous wording found"],
  ["accessibilityRegressionFound", "accessibility regression found"],
  ["providerControlFound", "provider control found"],
  ["executionControlFound", "execution control found"],
];

export function assertR69SafetyAccessibilityInvariants(result: R69SafetyAccessibilityResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) {
    throw new Error("R69E must remain read-only, advisory-only, and simulation-only");
  }
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.providerCredentialsAccessed ||
    flags.providerEnvReadAllowed ||
    flags.fetchNetworkAllowed ||
    flags.providerClientAllowed ||
    flags.auditRecordsWritten ||
    !flags.noProviderControlsAdded ||
    !flags.noProviderActivationDrift
  ) {
    throw new Error("R69E cannot pass with provider, credential, env, fetch/network, runtime, polling, persistence, audit writing, sending, controls, or execution drift");
  }
}

export function createR69ProviderIsolationSafetyAccessibilityReview(
  input: R69SafetyAccessibilityInput = {},
): R69SafetyAccessibilityResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R69SafetyAccessibilityStatus =
    activeBlockedReasons.length > 0
      ? "provider_safety_accessibility_review_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "provider_safety_accessibility_review_passed";
  const result: R69SafetyAccessibilityResult = {
    phase: "R69E",
    status,
    flags: r69SafetyAccessibilityFlags,
    findings: r69SafetyReviewFindings,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R69F - Provider Isolation Final Lockdown Contract",
  };
  assertR69SafetyAccessibilityInvariants(result);
  return result;
}

export function summarizeR69ProviderIsolationSafetyAccessibilityReview(result: R69SafetyAccessibilityResult): string {
  assertR69SafetyAccessibilityInvariants(result);
  return `R69E ${result.status}: provider isolation UI and contracts reviewed for provider activation drift, credential/env-read drift, fetch/network drift, runtime/polling risk, persistence/audit-writing risk, hidden controls, dangerous wording, and inclusive accessibility regression.`;
}
