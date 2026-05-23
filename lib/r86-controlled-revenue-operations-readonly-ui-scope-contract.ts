import {
  r86AccessibilityRequirements,
  r86AdvisoryRevenueOperationsCategories,
  r86ScopeFlags,
} from "./r86-controlled-revenue-operations-scope-contract";
import { r86BlockedDriftTransitions } from "./r86-controlled-revenue-operations-drift-risk-audit";

export const r86ReadonlyUiAuthorizedSurfaces = [
  "components/dashboard/controlled-revenue-operations-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx",
] as const;

export const r86ReadonlyUiWording = {
  revenueOperations: "Read-only revenue operations intelligence is advisory visibility only.",
  throughput: "Throughput signals help humans inspect bottlenecks without runtime jobs.",
  pipelineOptimization: "Manual pipeline review can improve clarity without automation.",
  revenueDelay: "Revenue-delay visibility does not authorize outreach, providers, or execution.",
  assignmentReadiness: "Assignment readiness requires human review before any buyer-facing action.",
  closingReadiness: "Closing readiness visibility does not execute closing actions.",
  operatorCoordination: "Operator coordination required before any real-world action.",
  manualReview: "Manual revenue review recommended.",
  governance: "Governance review remains controlling over every revenue signal.",
  noExecution: "No execution is authorized.",
  noProvider: "No provider activation permitted.",
  noContact: "No buyer, seller, call, text, email, or campaign contact is authorized.",
} as const;

export const r86ReadonlyUiForbiddenControls = [
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

export const r86ReadonlyUiFlags = {
  ...r86ScopeFlags,
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

export type R86ReadonlyUiStatus = "controlled_revenue_operations_ui_scope_blocked" | "operator_review_required" | "controlled_revenue_operations_ui_scope_ready";

export type R86ReadonlyUiInput = {
  authorizedSurfacesReviewed?: boolean;
  revenueOperationsWordingReviewed?: boolean;
  throughputWordingReviewed?: boolean;
  pipelineOptimizationWordingReviewed?: boolean;
  revenueDelayWordingReviewed?: boolean;
  assignmentReadinessWordingReviewed?: boolean;
  closingReadinessWordingReviewed?: boolean;
  operatorCoordinationWordingReviewed?: boolean;
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

export type R86ReadonlyUiResult = {
  phase: "R86C";
  status: R86ReadonlyUiStatus;
  flags: typeof r86ReadonlyUiFlags;
  authorizedSurfaces: typeof r86ReadonlyUiAuthorizedSurfaces;
  wording: typeof r86ReadonlyUiWording;
  advisoryCategories: typeof r86AdvisoryRevenueOperationsCategories;
  forbiddenControls: typeof r86ReadonlyUiForbiddenControls;
  blockedDriftTransitions: typeof r86BlockedDriftTransitions;
  accessibility: typeof r86AccessibilityRequirements;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R86D - Controlled Revenue Operations Read-Only UI Implementation";
};

const requiredReviewAreas: Array<[keyof R86ReadonlyUiInput, string]> = [
  ["authorizedSurfacesReviewed", "authorized read-only surfaces"],
  ["revenueOperationsWordingReviewed", "revenue operations wording"],
  ["throughputWordingReviewed", "throughput wording"],
  ["pipelineOptimizationWordingReviewed", "pipeline optimization wording"],
  ["revenueDelayWordingReviewed", "revenue-delay wording"],
  ["assignmentReadinessWordingReviewed", "assignment-readiness wording"],
  ["closingReadinessWordingReviewed", "closing-readiness wording"],
  ["operatorCoordinationWordingReviewed", "operator-coordination wording"],
  ["manualReviewWordingReviewed", "manual-review wording"],
  ["governanceWordingReviewed", "governance wording"],
  ["noExecutionWordingReviewed", "no-execution wording"],
  ["noProviderWordingReviewed", "no-provider wording"],
  ["noContactWordingReviewed", "no-contact wording"],
  ["forbiddenControlsReviewed", "forbidden UI controls"],
  ["accessibilityReviewed", "accessibility requirements"],
];

const blockedReasons: Array<[keyof R86ReadonlyUiInput, string]> = [
  ["implementationRequestedNow", "R86C is scope-only; UI implementation waits for R86D"],
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

export function assertR86ReadonlyUiScopeInvariants(result: R86ReadonlyUiResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly || !flags.uiScopeOnly) {
    throw new Error("R86C must authorize read-only advisory UI scope only");
  }
  if (Object.entries(flags).some(([key, value]) => !["readOnly", "advisoryOnly", "simulationOnly", "uiScopeOnly"].includes(key) && value === true)) {
    throw new Error("R86C cannot authorize UI controls, providers, outreach, automation, runtime, network behavior, persistence, audit writing, or execution");
  }
}

export function createR86ControlledRevenueOperationsReadonlyUiScopeContract(input: R86ReadonlyUiInput = {}): R86ReadonlyUiResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R86ReadonlyUiStatus =
    activeBlockedReasons.length > 0 ? "controlled_revenue_operations_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "controlled_revenue_operations_ui_scope_ready";
  const result: R86ReadonlyUiResult = {
    phase: "R86C",
    status,
    flags: r86ReadonlyUiFlags,
    authorizedSurfaces: r86ReadonlyUiAuthorizedSurfaces,
    wording: r86ReadonlyUiWording,
    advisoryCategories: r86AdvisoryRevenueOperationsCategories,
    forbiddenControls: r86ReadonlyUiForbiddenControls,
    blockedDriftTransitions: r86BlockedDriftTransitions,
    accessibility: r86AccessibilityRequirements,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R86D - Controlled Revenue Operations Read-Only UI Implementation",
  };
  assertR86ReadonlyUiScopeInvariants(result);
  return result;
}

export function summarizeR86ControlledRevenueOperationsReadonlyUiScope(result: R86ReadonlyUiResult): string {
  assertR86ReadonlyUiScopeInvariants(result);
  return `R86C ${result.status}: future Controlled Revenue Operations UI is limited to read-only advisory wording for revenue operations, throughput, pipeline optimization, revenue delay, assignment readiness, closing readiness, operator coordination, manual review, governance, no execution, no provider, and no contact states.`;
}
