import {
  r85AccessibilityRequirements,
  r85AdvisoryCommandCenterCategories,
  r85ScopeFlags,
} from "./r85-manual-acquisition-command-center-scope-contract";
import { r85BlockedDriftTransitions } from "./r85-manual-acquisition-command-center-drift-risk-audit";

export const r85ReadonlyUiAuthorizedSurfaces = [
  "components/dashboard/manual-acquisition-command-center-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx",
] as const;

export const r85ReadonlyUiWording = {
  operatorReview: "Manual review recommended for operator oversight.",
  commandCenter: "Manual acquisition command center visibility is advisory only.",
  bottleneck: "Bottleneck visibility shows review pressure only and does not trigger scraping or providers.",
  escalation: "Human escalation visibility does not grant permission to act or activate providers.",
  acquisitionReview: "Acquisition review labels help humans coordinate review order without automation.",
  revenueDelay: "Revenue-delay visibility can inform manual timing review without outreach or execution.",
  manualReview: "Human coordination required before any real-world action.",
  governance: "Governance review remains controlling over every command-center signal.",
  noExecution: "No execution is authorized.",
  noProvider: "No provider activation permitted.",
  noContact: "No seller, buyer, call, text, email, or campaign contact is authorized.",
} as const;

export const r85ReadonlyUiForbiddenControls = [
  "buttons",
  "forms",
  "inputs",
  "links",
  "click handlers",
  "execution controls",
  "provider controls",
  "outreach controls",
  "automation controls",
  "runtime controls",
  "fetch/network behavior",
  "persistence behavior",
  "audit writing",
] as const;

export const r85ReadonlyUiFlags = {
  ...r85ScopeFlags,
  uiScopeOnly: true,
  implementationAllowedNow: false,
  buttonsAllowed: false,
  formsAllowed: false,
  inputsAllowed: false,
  linksAllowed: false,
  clickHandlersAllowed: false,
  executionControlsAllowed: false,
  providerControlsAllowed: false,
  outreachControlsAllowed: false,
  automationControlsAllowed: false,
  runtimeControlsAllowed: false,
  fetchNetworkBehaviorAllowed: false,
  persistenceBehaviorAllowed: false,
  auditWritingBehaviorAllowed: false,
} as const;

export type R85ReadonlyUiStatus = "manual_acquisition_command_center_ui_scope_blocked" | "operator_review_required" | "manual_acquisition_command_center_ui_scope_ready";

export type R85ReadonlyUiInput = {
  authorizedSurfacesReviewed?: boolean;
  operatorReviewWordingReviewed?: boolean;
  commandCenterWordingReviewed?: boolean;
  bottleneckWordingReviewed?: boolean;
  escalationWordingReviewed?: boolean;
  acquisitionReviewWordingReviewed?: boolean;
  revenueDelayWordingReviewed?: boolean;
  manualReviewWordingReviewed?: boolean;
  governanceWordingReviewed?: boolean;
  noExecutionWordingReviewed?: boolean;
  noProviderWordingReviewed?: boolean;
  noContactWordingReviewed?: boolean;
  forbiddenControlsReviewed?: boolean;
  accessibilityReviewed?: boolean;
  implementationRequestedNow?: boolean;
  buttonRequested?: boolean;
  formRequested?: boolean;
  inputRequested?: boolean;
  linkRequested?: boolean;
  clickHandlerRequested?: boolean;
  executionControlRequested?: boolean;
  providerControlRequested?: boolean;
  outreachControlRequested?: boolean;
  automationControlRequested?: boolean;
  runtimeControlRequested?: boolean;
  fetchNetworkRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
};

export type R85ReadonlyUiResult = {
  phase: "R85C";
  status: R85ReadonlyUiStatus;
  flags: typeof r85ReadonlyUiFlags;
  authorizedSurfaces: typeof r85ReadonlyUiAuthorizedSurfaces;
  wording: typeof r85ReadonlyUiWording;
  advisoryCategories: typeof r85AdvisoryCommandCenterCategories;
  forbiddenControls: typeof r85ReadonlyUiForbiddenControls;
  blockedDriftTransitions: typeof r85BlockedDriftTransitions;
  accessibility: typeof r85AccessibilityRequirements;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R85D - Manual Acquisition Command Center Read-Only UI Implementation";
};

const requiredReviewAreas: Array<[keyof R85ReadonlyUiInput, string]> = [
  ["authorizedSurfacesReviewed", "authorized read-only surfaces"],
  ["operatorReviewWordingReviewed", "operator-review wording"],
  ["commandCenterWordingReviewed", "command-center wording"],
  ["bottleneckWordingReviewed", "bottleneck wording"],
  ["escalationWordingReviewed", "escalation wording"],
  ["acquisitionReviewWordingReviewed", "acquisition-review wording"],
  ["revenueDelayWordingReviewed", "revenue-delay wording"],
  ["manualReviewWordingReviewed", "manual-review wording"],
  ["governanceWordingReviewed", "governance wording"],
  ["noExecutionWordingReviewed", "no-execution wording"],
  ["noProviderWordingReviewed", "no-provider wording"],
  ["noContactWordingReviewed", "no-contact wording"],
  ["forbiddenControlsReviewed", "forbidden UI controls"],
  ["accessibilityReviewed", "accessibility requirements"],
];

const blockedReasons: Array<[keyof R85ReadonlyUiInput, string]> = [
  ["implementationRequestedNow", "R85C is scope-only; UI implementation waits for R85D"],
  ["buttonRequested", "buttons remain forbidden"],
  ["formRequested", "forms remain forbidden"],
  ["inputRequested", "inputs remain forbidden"],
  ["linkRequested", "links remain forbidden"],
  ["clickHandlerRequested", "click handlers remain forbidden"],
  ["executionControlRequested", "execution controls remain forbidden"],
  ["providerControlRequested", "provider controls remain forbidden"],
  ["outreachControlRequested", "outreach controls remain forbidden"],
  ["automationControlRequested", "automation controls remain forbidden"],
  ["runtimeControlRequested", "runtime controls remain forbidden"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
];

export function assertR85ReadonlyUiScopeInvariants(result: R85ReadonlyUiResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly || !flags.uiScopeOnly) {
    throw new Error("R85C must authorize read-only advisory UI scope only");
  }
  if (Object.entries(flags).some(([key, value]) => !["readOnly", "advisoryOnly", "simulationOnly", "uiScopeOnly"].includes(key) && value === true)) {
    throw new Error("R85C cannot authorize UI controls, providers, outreach, automation, runtime, network behavior, persistence, audit writing, or execution");
  }
}

export function createR85ManualAcquisitionCommandCenterReadonlyUiScopeContract(input: R85ReadonlyUiInput = {}): R85ReadonlyUiResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R85ReadonlyUiStatus =
    activeBlockedReasons.length > 0 ? "manual_acquisition_command_center_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "manual_acquisition_command_center_ui_scope_ready";
  const result: R85ReadonlyUiResult = {
    phase: "R85C",
    status,
    flags: r85ReadonlyUiFlags,
    authorizedSurfaces: r85ReadonlyUiAuthorizedSurfaces,
    wording: r85ReadonlyUiWording,
    advisoryCategories: r85AdvisoryCommandCenterCategories,
    forbiddenControls: r85ReadonlyUiForbiddenControls,
    blockedDriftTransitions: r85BlockedDriftTransitions,
    accessibility: r85AccessibilityRequirements,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R85D - Manual Acquisition Command Center Read-Only UI Implementation",
  };
  assertR85ReadonlyUiScopeInvariants(result);
  return result;
}

export function summarizeR85ManualAcquisitionCommandCenterReadonlyUiScope(result: R85ReadonlyUiResult): string {
  assertR85ReadonlyUiScopeInvariants(result);
  return `R85C ${result.status}: future Manual Acquisition Command Center UI is limited to read-only advisory wording for operator review, command center, bottlenecks, escalation, acquisition review, revenue delay, manual review, governance, no execution, no provider, and no contact states.`;
}
