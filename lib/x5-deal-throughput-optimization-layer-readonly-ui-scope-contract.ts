import { x5AccessibilityRequirements, x5AdvisoryCategories, x5DealThroughputFlags } from "./x5-deal-throughput-optimization-layer-scope-contract";

export const x5ReadonlyUiAuthorizedSurfaces = ["app/(dashboard)/dashboard/page.tsx", "components/dashboard/deal-throughput-optimization-layer-summary.tsx"] as const;
export const x5ReadonlyUiWording = {
  throughput: "Deal throughput optimization is advisory visibility only.",
  stageFriction: "Stage friction visibility does not route work.",
  assignmentReadiness: "Assignment-readiness visibility does not activate providers.",
  closingReadiness: "Closing-readiness visibility does not activate runtime jobs.",
  revenueDelay: "Revenue delay visibility does not trigger outreach.",
  blockedThroughput: "Blocked throughput visibility does not execute workflow actions.",
  noExecution: "No execution is authorized.",
  noProvider: "No provider activation permitted.",
  noContact: "Throughput optimization does not contact buyers or sellers.",
} as const;
export const x5ReadonlyUiForbiddenControls = ["buttons", "forms", "inputs", "links", "click handlers", "send controls", "routing controls", "provider controls", "outreach controls", "runtime controls", "automation controls", "polling", "fetch/network behavior", "persistence behavior", "audit writing"] as const;

export type X5ReadonlyUiInput = Partial<Record<"authorizedSurfacesReviewed" | "wordingReviewed" | "forbiddenControlsReviewed" | "accessibilityReviewed", boolean>> & Partial<Record<"buttonRequested" | "formRequested" | "inputRequested" | "linkRequested" | "clickHandlerRequested" | "sendControlRequested" | "routingControlRequested" | "providerControlRequested" | "outreachControlRequested" | "runtimeControlRequested" | "automationControlRequested" | "pollingRequested" | "fetchNetworkRequested" | "persistenceRequested" | "auditWritingRequested", boolean>>;
export type X5ReadonlyUiStatus = "x5_ui_scope_blocked" | "operator_review_required" | "x5_ui_scope_ready";

const requiredReviewAreas: Array<[keyof X5ReadonlyUiInput, string]> = [["authorizedSurfacesReviewed", "authorized read-only throughput optimization surfaces"], ["wordingReviewed", "safe throughput optimization wording"], ["forbiddenControlsReviewed", "forbidden controls"], ["accessibilityReviewed", "accessibility requirements"]];
const blockedRequests: Array<[keyof X5ReadonlyUiInput, string]> = [["buttonRequested", "buttons remain forbidden"], ["formRequested", "forms remain forbidden"], ["inputRequested", "inputs remain forbidden"], ["linkRequested", "links remain forbidden"], ["clickHandlerRequested", "click handlers remain forbidden"], ["sendControlRequested", "send controls remain forbidden"], ["routingControlRequested", "routing controls remain forbidden"], ["providerControlRequested", "provider controls remain forbidden"], ["outreachControlRequested", "outreach controls remain forbidden"], ["runtimeControlRequested", "runtime controls remain forbidden"], ["automationControlRequested", "automation controls remain forbidden"], ["pollingRequested", "polling remains blocked"], ["fetchNetworkRequested", "fetch/network remains blocked"], ["persistenceRequested", "persistence remains blocked"], ["auditWritingRequested", "audit writing remains blocked"]];

export function createX5DealThroughputOptimizationLayerReadonlyUiScopeContract(input: X5ReadonlyUiInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X5ReadonlyUiStatus = blockedReasons.length > 0 ? "x5_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x5_ui_scope_ready";
  return { phase: "X5D" as const, status, flags: { ...x5DealThroughputFlags, uiScopeOnly: true }, authorizedSurfaces: x5ReadonlyUiAuthorizedSurfaces, wording: x5ReadonlyUiWording, categories: x5AdvisoryCategories, forbiddenControls: x5ReadonlyUiForbiddenControls, accessibility: x5AccessibilityRequirements, missingReviewAreas, blockedReasons };
}
