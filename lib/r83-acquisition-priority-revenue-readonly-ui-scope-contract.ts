import {
  r83AccessibilityRequirements,
  r83AdvisoryPriorityCategories,
  r83ScopeFlags,
} from "./r83-acquisition-priority-revenue-scoring-scope-contract";
import {
  r83BlockedDriftTransitions,
} from "./r83-acquisition-priority-revenue-drift-risk-audit";

export const r83ReadonlyUiAuthorizedSurfaces = [
  "components/dashboard/acquisition-priority-revenue-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx",
] as const;

export const r83ReadonlyUiWording = {
  revenueScoring: "Revenue scoring is advisory only and supports manual acquisition prioritization.",
  acquisitionPriority: "Acquisition priority labels help operators decide what to review first.",
  urgency: "Urgency is a review signal only and does not authorize outreach or contact.",
  decay: "Lead decay is a visibility signal only and does not authorize scraping or sourcing.",
  highOpportunity: "High-opportunity labels may indicate revenue relevance but do not authorize execution.",
  blockedReviewNeeded: "Blocked and review-needed labels require manual governance review before action.",
  noExecution: "Priority and revenue scores do not authorize execution.",
  noProvider: "Provider activation remains blocked.",
  noContact: "Contact, outreach, calls, texts, and emails remain blocked.",
} as const;

export const r83ReadonlyUiForbiddenControls = [
  "buttons",
  "forms",
  "inputs",
  "execution controls",
  "outreach controls",
  "provider controls",
  "automation controls",
  "runtime controls",
  "fetch/network controls",
] as const;

export const r83ReadonlyUiFlags = {
  ...r83ScopeFlags,
  uiScopeOnly: true,
  implementationAllowedNow: false,
  buttonsAllowed: false,
  formsAllowed: false,
  inputsAllowed: false,
  executionControlsAllowed: false,
  outreachControlsAllowed: false,
  providerControlsAllowed: false,
  automationControlsAllowed: false,
  runtimeControlsAllowed: false,
  fetchNetworkControlsAllowed: false,
} as const;

export type R83ReadonlyUiStatus = "acquisition_priority_revenue_ui_scope_blocked" | "operator_review_required" | "acquisition_priority_revenue_ui_scope_ready";

export type R83ReadonlyUiInput = {
  authorizedSurfacesReviewed?: boolean;
  revenueScoringWordingReviewed?: boolean;
  acquisitionPriorityWordingReviewed?: boolean;
  urgencyWordingReviewed?: boolean;
  decayWordingReviewed?: boolean;
  highOpportunityWordingReviewed?: boolean;
  blockedReviewNeededWordingReviewed?: boolean;
  noExecutionWordingReviewed?: boolean;
  noProviderWordingReviewed?: boolean;
  noContactWordingReviewed?: boolean;
  forbiddenControlsReviewed?: boolean;
  accessibilityReviewed?: boolean;
  implementationRequestedNow?: boolean;
  buttonRequested?: boolean;
  formRequested?: boolean;
  inputRequested?: boolean;
  executionControlRequested?: boolean;
  outreachControlRequested?: boolean;
  providerControlRequested?: boolean;
  automationControlRequested?: boolean;
  runtimeControlRequested?: boolean;
  fetchNetworkRequested?: boolean;
};

export type R83ReadonlyUiResult = {
  phase: "R83C";
  status: R83ReadonlyUiStatus;
  flags: typeof r83ReadonlyUiFlags;
  authorizedSurfaces: typeof r83ReadonlyUiAuthorizedSurfaces;
  wording: typeof r83ReadonlyUiWording;
  advisoryCategories: typeof r83AdvisoryPriorityCategories;
  forbiddenControls: typeof r83ReadonlyUiForbiddenControls;
  blockedDriftTransitions: typeof r83BlockedDriftTransitions;
  accessibility: typeof r83AccessibilityRequirements;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R83D - Acquisition Priority & Revenue Read-Only UI Implementation";
};

const requiredReviewAreas: Array<[keyof R83ReadonlyUiInput, string]> = [
  ["authorizedSurfacesReviewed", "authorized read-only surfaces"],
  ["revenueScoringWordingReviewed", "revenue scoring wording"],
  ["acquisitionPriorityWordingReviewed", "acquisition priority wording"],
  ["urgencyWordingReviewed", "urgency wording"],
  ["decayWordingReviewed", "decay wording"],
  ["highOpportunityWordingReviewed", "high-opportunity wording"],
  ["blockedReviewNeededWordingReviewed", "blocked/review-needed wording"],
  ["noExecutionWordingReviewed", "no-execution wording"],
  ["noProviderWordingReviewed", "no-provider wording"],
  ["noContactWordingReviewed", "no-contact wording"],
  ["forbiddenControlsReviewed", "forbidden UI controls"],
  ["accessibilityReviewed", "accessibility requirements"],
];

const blockedReasons: Array<[keyof R83ReadonlyUiInput, string]> = [
  ["implementationRequestedNow", "R83C is scope-only; UI implementation waits for R83D"],
  ["buttonRequested", "buttons remain forbidden"],
  ["formRequested", "forms remain forbidden"],
  ["inputRequested", "inputs remain forbidden"],
  ["executionControlRequested", "execution controls remain forbidden"],
  ["outreachControlRequested", "outreach controls remain forbidden"],
  ["providerControlRequested", "provider controls remain forbidden"],
  ["automationControlRequested", "automation controls remain forbidden"],
  ["runtimeControlRequested", "runtime controls remain forbidden"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
];

export function assertR83ReadonlyUiScopeInvariants(result: R83ReadonlyUiResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly || !flags.uiScopeOnly) throw new Error("R83C must authorize read-only advisory UI scope only");
  if (Object.entries(flags).some(([key, value]) => !["readOnly", "advisoryOnly", "simulationOnly", "uiScopeOnly"].includes(key) && value === true)) {
    throw new Error("R83C cannot authorize UI controls, providers, outreach, automation, runtime, network behavior, persistence, audit writing, or execution");
  }
}

export function createR83AcquisitionPriorityRevenueReadonlyUiScopeContract(input: R83ReadonlyUiInput = {}): R83ReadonlyUiResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R83ReadonlyUiStatus =
    activeBlockedReasons.length > 0 ? "acquisition_priority_revenue_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "acquisition_priority_revenue_ui_scope_ready";
  const result: R83ReadonlyUiResult = {
    phase: "R83C",
    status,
    flags: r83ReadonlyUiFlags,
    authorizedSurfaces: r83ReadonlyUiAuthorizedSurfaces,
    wording: r83ReadonlyUiWording,
    advisoryCategories: r83AdvisoryPriorityCategories,
    forbiddenControls: r83ReadonlyUiForbiddenControls,
    blockedDriftTransitions: r83BlockedDriftTransitions,
    accessibility: r83AccessibilityRequirements,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R83D - Acquisition Priority & Revenue Read-Only UI Implementation",
  };
  assertR83ReadonlyUiScopeInvariants(result);
  return result;
}

export function summarizeR83AcquisitionPriorityRevenueReadonlyUiScope(result: R83ReadonlyUiResult): string {
  assertR83ReadonlyUiScopeInvariants(result);
  return `R83C ${result.status}: future Acquisition Priority & Revenue UI is limited to read-only advisory wording for revenue scoring, acquisition priority, urgency, decay, high opportunity, blocked/review-needed, no-execution, no-provider, and no-contact states.`;
}
