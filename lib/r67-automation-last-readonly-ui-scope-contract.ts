export const r67ReadonlyUiScopeFlags = {
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
  uiImplementationAllowedNow: false,
  executionControlsAllowed: false,
} as const;

export const r67AuthorizedReadonlySurfaces = [
  "existing dashboard placement only",
  "components/dashboard/automation-last-governance-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx only for placement",
] as const;

export const r67ForbiddenUiSurfaces = [
  "automation console",
  "execution queue",
  "provider console",
  "send workflow panel",
  "campaign launcher",
  "approval-to-send panel",
  "runtime job panel",
  "polling monitor",
  "autonomous routing panel",
] as const;

export const r67SafeReadonlyCopy = [
  "Automation remains last.",
  "Intelligence does not grant permission.",
  "Approval does not grant execution.",
  "Readiness does not grant execution.",
  "Queue priority does not grant execution.",
  "Urgency does not grant execution.",
  "Revenue opportunity does not grant execution.",
  "Provider activation remains blocked.",
  "Runtime activation remains blocked.",
  "Polling remains blocked.",
  "Human review remains required.",
] as const;

export const r67ReadonlyAccessibilityRequirements = [
  "semantic section",
  "aria-labelledby",
  "aria-describedby",
  "readable labels",
  "text-based status meaning",
  "no color-only meaning",
  "no motion dependency",
  "no focus movement",
  "no auto-refresh",
  "no polling",
  "predictable reading order",
  "visible governance warnings",
] as const;

export type R67ReadonlyUiScopeStatus =
  | "readonly_ui_scope_blocked"
  | "operator_review_required"
  | "readonly_ui_scope_ready";

export type R67ReadonlyUiScopeInput = {
  r67aScopeReviewed?: boolean;
  r67bAuditReviewed?: boolean;
  authorizedSurfacesReviewed?: boolean;
  forbiddenSurfacesReviewed?: boolean;
  safeCopyReviewed?: boolean;
  accessibilityReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiImplementationRequestedNow?: boolean;
  buttonsRequested?: boolean;
  controlsRequested?: boolean;
  sendActionRequested?: boolean;
  approvalToExecutionRequested?: boolean;
  providerActivationRequested?: boolean;
  runtimeActivationRequested?: boolean;
  pollingRequested?: boolean;
  campaignRequested?: boolean;
  automationAgentActivationRequested?: boolean;
  newRouteRequested?: boolean;
};

export type R67ReadonlyUiScopeResult = {
  phase: "R67C";
  status: R67ReadonlyUiScopeStatus;
  flags: typeof r67ReadonlyUiScopeFlags;
  authorizedSurfaces: typeof r67AuthorizedReadonlySurfaces;
  forbiddenSurfaces: typeof r67ForbiddenUiSurfaces;
  safeReadonlyCopy: typeof r67SafeReadonlyCopy;
  accessibilityRequirements: typeof r67ReadonlyAccessibilityRequirements;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R67D - Automation-Last Read-Only UI Implementation";
};

const requiredReviewAreas: Array<[keyof R67ReadonlyUiScopeInput, string]> = [
  ["r67aScopeReviewed", "R67A scope"],
  ["r67bAuditReviewed", "R67B drift audit"],
  ["authorizedSurfacesReviewed", "authorized read-only surfaces"],
  ["forbiddenSurfacesReviewed", "forbidden surfaces"],
  ["safeCopyReviewed", "safe copy"],
  ["accessibilityReviewed", "accessibility requirements"],
  ["operatorReviewCompleted", "operator review"],
];

const blockedReasons: Array<[keyof R67ReadonlyUiScopeInput, string]> = [
  ["uiImplementationRequestedNow", "R67C is scope-only and cannot implement UI now"],
  ["buttonsRequested", "buttons are forbidden for R67D"],
  ["controlsRequested", "controls are forbidden for R67D"],
  ["sendActionRequested", "send actions are forbidden"],
  ["approvalToExecutionRequested", "approval-to-execution actions are forbidden"],
  ["providerActivationRequested", "provider activation is forbidden"],
  ["runtimeActivationRequested", "runtime activation is forbidden"],
  ["pollingRequested", "polling is forbidden"],
  ["campaignRequested", "campaign controls are forbidden"],
  ["automationAgentActivationRequested", "automation-agent activation is forbidden"],
  ["newRouteRequested", "new routes are forbidden"],
];

export function assertR67ReadonlyUiScopeInvariants(result: R67ReadonlyUiScopeResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) {
    throw new Error("R67C UI scope must remain read-only, advisory-only, and simulation-only");
  }
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.uiImplementationAllowedNow ||
    flags.executionControlsAllowed
  ) {
    throw new Error("R67C cannot authorize implementation, execution controls, providers, runtime, polling, persistence, or sending");
  }
}

export function createR67AutomationLastReadonlyUiScopeContract(input: R67ReadonlyUiScopeInput = {}): R67ReadonlyUiScopeResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R67ReadonlyUiScopeStatus =
    activeBlockedReasons.length > 0
      ? "readonly_ui_scope_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "readonly_ui_scope_ready";
  const result: R67ReadonlyUiScopeResult = {
    phase: "R67C",
    status,
    flags: r67ReadonlyUiScopeFlags,
    authorizedSurfaces: r67AuthorizedReadonlySurfaces,
    forbiddenSurfaces: r67ForbiddenUiSurfaces,
    safeReadonlyCopy: r67SafeReadonlyCopy,
    accessibilityRequirements: r67ReadonlyAccessibilityRequirements,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R67D - Automation-Last Read-Only UI Implementation",
  };
  assertR67ReadonlyUiScopeInvariants(result);
  return result;
}

export function summarizeR67AutomationLastReadonlyUiScope(result: R67ReadonlyUiScopeResult): string {
  assertR67ReadonlyUiScopeInvariants(result);
  return `R67C ${result.status}: future UI is limited to read-only automation-last dashboard visibility, with no buttons, controls, send actions, provider activation, runtime activation, polling, campaigns, or approval-to-execution behavior.`;
}
