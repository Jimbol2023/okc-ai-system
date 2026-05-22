export const r70ReadonlyUiFlags = {
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
  providerClientAllowed: false,
  auditRecordsWritten: false,
  uiImplementationAllowedNow: false,
} as const;

export const r70AuthorizedReadonlySurfaces = [
  "existing dashboard placement only",
  "components/dashboard/manual-operator-action-center-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx only for placement",
] as const;

export const r70FutureReadOnlySections = [
  "revenue-priority advisory summary",
  "seller follow-up review visibility",
  "stuck-deal review visibility",
  "near-close review visibility",
  "buyer-ready review visibility",
  "missing-data blocker visibility",
  "governance-blocked item visibility",
  "manual-review-needed visibility",
] as const;

export const r70SafeUiCopy = [
  "Manual review recommended.",
  "Human decision required.",
  "Revenue priority is advisory only.",
  "Recommendations do not execute.",
  "Provider activation remains blocked.",
  "No message sent.",
  "No workflow executed.",
  "Audit layer not active yet.",
  "No audit records are written in this phase.",
] as const;

export type R70ReadonlyUiScopeStatus = "manual_action_center_ui_scope_blocked" | "operator_review_required" | "manual_action_center_ui_scope_ready";

export type R70ReadonlyUiScopeInput = {
  r70aReviewed?: boolean;
  r70bReviewed?: boolean;
  surfacesReviewed?: boolean;
  sectionsReviewed?: boolean;
  safeCopyReviewed?: boolean;
  accessibilityReviewed?: boolean;
  governanceReviewed?: boolean;
  uiImplementationRequestedNow?: boolean;
  buttonsRequested?: boolean;
  controlsRequested?: boolean;
  formsRequested?: boolean;
  sendRequested?: boolean;
  providerRequested?: boolean;
  fetchNetworkRequested?: boolean;
  runtimeRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
};

export type R70ReadonlyUiScopeResult = {
  phase: "R70C";
  status: R70ReadonlyUiScopeStatus;
  flags: typeof r70ReadonlyUiFlags;
  authorizedSurfaces: typeof r70AuthorizedReadonlySurfaces;
  futureSections: typeof r70FutureReadOnlySections;
  safeCopy: typeof r70SafeUiCopy;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R70D - Manual Operator Action Center Read-Only UI Implementation";
};

const requiredReviewAreas: Array<[keyof R70ReadonlyUiScopeInput, string]> = [
  ["r70aReviewed", "R70A scope"],
  ["r70bReviewed", "R70B audit"],
  ["surfacesReviewed", "authorized surfaces"],
  ["sectionsReviewed", "future sections"],
  ["safeCopyReviewed", "safe copy"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["governanceReviewed", "governance"],
];

const blockedReasons: Array<[keyof R70ReadonlyUiScopeInput, string]> = [
  ["uiImplementationRequestedNow", "R70C is scope-only and cannot implement UI now"],
  ["buttonsRequested", "buttons are forbidden"],
  ["controlsRequested", "controls are forbidden"],
  ["formsRequested", "forms are forbidden"],
  ["sendRequested", "send actions are forbidden"],
  ["providerRequested", "provider controls are forbidden"],
  ["fetchNetworkRequested", "fetch/network calls are forbidden"],
  ["runtimeRequested", "runtime activation is forbidden"],
  ["pollingRequested", "polling is forbidden"],
  ["persistenceRequested", "persistence is forbidden"],
  ["auditWritingRequested", "audit writing is forbidden"],
];

export function assertR70ReadonlyUiScopeInvariants(result: R70ReadonlyUiScopeResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R70C must remain read-only advisory simulation");
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.fetchNetworkAllowed ||
    flags.providerClientAllowed ||
    flags.auditRecordsWritten ||
    flags.uiImplementationAllowedNow
  ) {
    throw new Error("R70C cannot authorize UI implementation, controls, providers, fetch/network, runtime, polling, persistence, audit writing, sending, or execution");
  }
}

export function createR70ManualOperatorActionCenterReadonlyUiScopeContract(input: R70ReadonlyUiScopeInput = {}): R70ReadonlyUiScopeResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R70ReadonlyUiScopeStatus =
    activeBlockedReasons.length > 0
      ? "manual_action_center_ui_scope_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "manual_action_center_ui_scope_ready";
  const result: R70ReadonlyUiScopeResult = {
    phase: "R70C",
    status,
    flags: r70ReadonlyUiFlags,
    authorizedSurfaces: r70AuthorizedReadonlySurfaces,
    futureSections: r70FutureReadOnlySections,
    safeCopy: r70SafeUiCopy,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R70D - Manual Operator Action Center Read-Only UI Implementation",
  };
  assertR70ReadonlyUiScopeInvariants(result);
  return result;
}

export function summarizeR70ManualOperatorActionCenterReadonlyUiScope(result: R70ReadonlyUiScopeResult): string {
  assertR70ReadonlyUiScopeInvariants(result);
  return `R70C ${result.status}: future manual action center UI is read-only advisory visibility only, with no buttons, controls, forms, providers, fetch/network, runtime, polling, persistence, audit writing, sending, or execution.`;
}
