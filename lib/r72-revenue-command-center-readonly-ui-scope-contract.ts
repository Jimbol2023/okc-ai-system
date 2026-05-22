export const r72ReadonlyUiAuthorizedSurfaces = [
  "components/dashboard/revenue-command-center-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx",
] as const;

export const r72ReadonlyUiAllowedSections = [
  "manual revenue priority summary",
  "stuck-deal visibility",
  "near-close visibility",
  "buyer-ready visibility",
  "overdue manual work visibility",
  "missing-data blocker visibility",
  "governance-blocked revenue risk visibility",
  "provider blocked warning",
  "no-execution warning",
  "advisory-only operator guidance",
] as const;

export const r72ReadonlyUiSafeCopy = [
  "Revenue priority is advisory only.",
  "Manual review may be useful.",
  "Governance stops still dominate.",
  "Contact is not authorized in this phase.",
  "No SMS sent.",
  "No email sent.",
  "No call placed.",
  "Provider activation remains blocked.",
  "No audit records are written in this phase.",
] as const;

export const r72ReadonlyUiForbiddenSurfaces = [
  "buttons",
  "send controls",
  "call controls",
  "email controls",
  "SMS controls",
  "provider controls",
  "approval-to-send controls",
  "workflow controls",
  "campaign controls",
  "forms",
  "inputs",
  "links that imply execution",
  "polling",
  "auto-refresh",
  "runtime activation",
  "persistence",
  "fetch/network",
] as const;

export const r72ReadonlyUiAccessibility = {
  semanticHeadings: true,
  clearSectionStructure: true,
  ariaLabelledby: true,
  ariaDescribedby: true,
  readableLabels: true,
  plainLanguageSummaries: true,
  textBasedStatusMeaning: true,
  noColorOnlyMeaning: true,
  sufficientSpacing: true,
  noMotionDependency: true,
  noFocusMovement: true,
  noAutoRefresh: true,
  noPolling: true,
  predictableReadingOrder: true,
  visibleGovernanceWarnings: true,
  noTinyUnreadableText: true,
  noCrampedControls: true,
} as const;

export const r72ReadonlyUiFlags = {
  implementationAllowedNow: false,
  readOnly: true,
  advisoryOnly: true,
  providerCalled: false,
  sent: false,
  executionControlsAllowed: false,
  providerControlsAllowed: false,
  sendControlsAllowed: false,
  callControlsAllowed: false,
  smsControlsAllowed: false,
  emailControlsAllowed: false,
  formsAllowed: false,
  inputsAllowed: false,
  fetchNetworkAllowed: false,
  runtimeActivationAllowed: false,
  pollingAllowed: false,
  persistenceAllowedNow: false,
} as const;

export type R72ReadonlyUiStatus = "revenue_command_ui_scope_blocked" | "operator_review_required" | "revenue_command_ui_scope_ready";

export type R72ReadonlyUiInput = {
  authorizedSurfacesReviewed?: boolean;
  safeCopyReviewed?: boolean;
  forbiddenSurfacesReviewed?: boolean;
  accessibilityReviewed?: boolean;
  implementationRequestedNow?: boolean;
  buttonRequested?: boolean;
  sendControlRequested?: boolean;
  callControlRequested?: boolean;
  smsControlRequested?: boolean;
  emailControlRequested?: boolean;
  providerControlRequested?: boolean;
  approvalToSendRequested?: boolean;
  workflowControlRequested?: boolean;
  campaignControlRequested?: boolean;
  formRequested?: boolean;
  inputRequested?: boolean;
  executionLinkRequested?: boolean;
  fetchNetworkRequested?: boolean;
  pollingRequested?: boolean;
  runtimeRequested?: boolean;
  persistenceRequested?: boolean;
};

export type R72ReadonlyUiResult = {
  phase: "R72C";
  status: R72ReadonlyUiStatus;
  flags: typeof r72ReadonlyUiFlags;
  authorizedSurfaces: typeof r72ReadonlyUiAuthorizedSurfaces;
  allowedSections: typeof r72ReadonlyUiAllowedSections;
  safeCopy: typeof r72ReadonlyUiSafeCopy;
  forbiddenSurfaces: typeof r72ReadonlyUiForbiddenSurfaces;
  accessibility: typeof r72ReadonlyUiAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R72D - Revenue Command Center Read-Only UI Implementation";
};

const requiredReviewAreas: Array<[keyof R72ReadonlyUiInput, string]> = [
  ["authorizedSurfacesReviewed", "authorized read-only surfaces"],
  ["safeCopyReviewed", "safe copy"],
  ["forbiddenSurfacesReviewed", "forbidden surfaces"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R72ReadonlyUiInput, string]> = [
  ["implementationRequestedNow", "R72C is scope-only; implementation waits for R72D"],
  ["buttonRequested", "buttons remain forbidden"],
  ["sendControlRequested", "send controls remain forbidden"],
  ["callControlRequested", "call controls remain forbidden"],
  ["smsControlRequested", "SMS controls remain forbidden"],
  ["emailControlRequested", "email controls remain forbidden"],
  ["providerControlRequested", "provider controls remain forbidden"],
  ["approvalToSendRequested", "approval-to-send controls remain forbidden"],
  ["workflowControlRequested", "workflow controls remain forbidden"],
  ["campaignControlRequested", "campaign controls remain forbidden"],
  ["formRequested", "forms remain forbidden"],
  ["inputRequested", "inputs remain forbidden"],
  ["executionLinkRequested", "links that imply execution remain forbidden"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["pollingRequested", "polling remains blocked"],
  ["runtimeRequested", "runtime activation remains blocked"],
  ["persistenceRequested", "persistence remains blocked"],
];

export function assertR72ReadonlyUiScopeInvariants(result: R72ReadonlyUiResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly) throw new Error("R72C must authorize read-only advisory UI scope only");
  if (
    flags.implementationAllowedNow ||
    flags.providerCalled ||
    flags.sent ||
    flags.executionControlsAllowed ||
    flags.providerControlsAllowed ||
    flags.sendControlsAllowed ||
    flags.callControlsAllowed ||
    flags.smsControlsAllowed ||
    flags.emailControlsAllowed ||
    flags.formsAllowed ||
    flags.inputsAllowed ||
    flags.fetchNetworkAllowed ||
    flags.runtimeActivationAllowed ||
    flags.pollingAllowed ||
    flags.persistenceAllowedNow
  ) {
    throw new Error("R72C cannot authorize controls, forms, provider access, send/call/SMS/email, fetch/network, runtime, polling, persistence, or execution");
  }
}

export function createR72RevenueCommandCenterReadonlyUiScopeContract(input: R72ReadonlyUiInput = {}): R72ReadonlyUiResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R72ReadonlyUiStatus =
    activeBlockedReasons.length > 0 ? "revenue_command_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "revenue_command_ui_scope_ready";
  const result: R72ReadonlyUiResult = {
    phase: "R72C",
    status,
    flags: r72ReadonlyUiFlags,
    authorizedSurfaces: r72ReadonlyUiAuthorizedSurfaces,
    allowedSections: r72ReadonlyUiAllowedSections,
    safeCopy: r72ReadonlyUiSafeCopy,
    forbiddenSurfaces: r72ReadonlyUiForbiddenSurfaces,
    accessibility: r72ReadonlyUiAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R72D - Revenue Command Center Read-Only UI Implementation",
  };
  assertR72ReadonlyUiScopeInvariants(result);
  return result;
}

export function summarizeR72RevenueCommandCenterReadonlyUiScope(result: R72ReadonlyUiResult): string {
  assertR72ReadonlyUiScopeInvariants(result);
  return `R72C ${result.status}: future Revenue Command Center UI is limited to read-only revenue visibility, manual review wording, governance warnings, provider-blocked copy, and no-execution advisory summaries.`;
}
