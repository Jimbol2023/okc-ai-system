export const r71ReadonlyUiFlags = {
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
  fetchNetworkAllowed: false,
  auditRecordsWritten: false,
  uiImplementationAllowedNow: false,
} as const;

export const r71AuthorizedReadonlySurfaces = [
  "existing dashboard placement only",
  "components/dashboard/controlled-human-outreach-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx only for placement",
] as const;

export const r71SafeUiCopy = [
  "Outreach preparation is advisory only.",
  "Contact is not authorized in this phase.",
  "Human review required before any future contact.",
  "Provider activation remains blocked.",
  "No SMS sent.",
  "No email sent.",
  "No call placed.",
  "No campaign launched.",
  "Audit layer not active yet.",
  "No audit records are written in this phase.",
] as const;

export type R71ReadonlyUiScopeStatus = "controlled_outreach_ui_scope_blocked" | "operator_review_required" | "controlled_outreach_ui_scope_ready";

export type R71ReadonlyUiScopeInput = {
  r71aReviewed?: boolean;
  r71bReviewed?: boolean;
  surfacesReviewed?: boolean;
  safeCopyReviewed?: boolean;
  accessibilityReviewed?: boolean;
  governanceReviewed?: boolean;
  uiImplementationRequestedNow?: boolean;
  buttonsRequested?: boolean;
  formsInputsRequested?: boolean;
  executionLinksRequested?: boolean;
  sendControlsRequested?: boolean;
  callControlsRequested?: boolean;
  smsControlsRequested?: boolean;
  emailControlsRequested?: boolean;
  providerControlsRequested?: boolean;
  approvalSendRequested?: boolean;
  fetchNetworkRequested?: boolean;
  runtimeRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
};

export type R71ReadonlyUiScopeResult = {
  phase: "R71C";
  status: R71ReadonlyUiScopeStatus;
  flags: typeof r71ReadonlyUiFlags;
  authorizedSurfaces: typeof r71AuthorizedReadonlySurfaces;
  safeCopy: typeof r71SafeUiCopy;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R71D - Controlled Human Outreach Read-Only UI Implementation";
};

const requiredReviewAreas: Array<[keyof R71ReadonlyUiScopeInput, string]> = [
  ["r71aReviewed", "R71A scope"],
  ["r71bReviewed", "R71B audit"],
  ["surfacesReviewed", "authorized surfaces"],
  ["safeCopyReviewed", "safe copy"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["governanceReviewed", "governance"],
];

const blockedReasons: Array<[keyof R71ReadonlyUiScopeInput, string]> = [
  ["uiImplementationRequestedNow", "R71C is scope-only and cannot implement UI now"],
  ["buttonsRequested", "buttons are forbidden"],
  ["formsInputsRequested", "forms and inputs are forbidden"],
  ["executionLinksRequested", "links that imply execution are forbidden"],
  ["sendControlsRequested", "send controls are forbidden"],
  ["callControlsRequested", "call controls are forbidden"],
  ["smsControlsRequested", "SMS controls are forbidden"],
  ["emailControlsRequested", "email controls are forbidden"],
  ["providerControlsRequested", "provider controls are forbidden"],
  ["approvalSendRequested", "approval-to-send controls are forbidden"],
  ["fetchNetworkRequested", "fetch/network calls are forbidden"],
  ["runtimeRequested", "runtime activation is forbidden"],
  ["pollingRequested", "polling is forbidden"],
  ["persistenceRequested", "persistence is forbidden"],
];

export function assertR71ReadonlyUiScopeInvariants(result: R71ReadonlyUiScopeResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R71C must remain read-only advisory simulation");
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
    flags.fetchNetworkAllowed ||
    flags.auditRecordsWritten ||
    flags.uiImplementationAllowedNow
  ) {
    throw new Error("R71C cannot authorize UI implementation, outreach, sending, calls, providers, fetch/network, runtime, polling, persistence, audit writing, or execution");
  }
}

export function createR71ControlledHumanOutreachReadonlyUiScopeContract(input: R71ReadonlyUiScopeInput = {}): R71ReadonlyUiScopeResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R71ReadonlyUiScopeStatus =
    activeBlockedReasons.length > 0 ? "controlled_outreach_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "controlled_outreach_ui_scope_ready";
  const result: R71ReadonlyUiScopeResult = {
    phase: "R71C",
    status,
    flags: r71ReadonlyUiFlags,
    authorizedSurfaces: r71AuthorizedReadonlySurfaces,
    safeCopy: r71SafeUiCopy,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R71D - Controlled Human Outreach Read-Only UI Implementation",
  };
  assertR71ReadonlyUiScopeInvariants(result);
  return result;
}

export function summarizeR71ControlledHumanOutreachReadonlyUiScope(result: R71ReadonlyUiScopeResult): string {
  assertR71ReadonlyUiScopeInvariants(result);
  return `R71C ${result.status}: future controlled outreach UI is read-only preparation visibility only, with no buttons, forms, send/call/SMS/email/provider controls, polling, runtime, persistence, fetch/network, audit writing, or execution.`;
}
