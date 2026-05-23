import { x4AccessibilityRequirements, x4AdvisoryCategories, x4BuyerMatchingFlags } from "./x4-human-guided-buyer-matching-operations-scope-contract";

export const x4ReadonlyUiAuthorizedSurfaces = ["app/(dashboard)/dashboard/page.tsx", "components/dashboard/human-guided-buyer-matching-operations-summary.tsx"] as const;
export const x4ReadonlyUiWording = {
  buyerFit: "Buyer-fit visibility is advisory only.",
  assignmentReadiness: "Assignment-readiness visibility does not assign buyers.",
  buyerDemand: "Buyer-demand visibility does not trigger outreach.",
  dispositionReview: "Disposition review visibility remains manual review only.",
  throughput: "Revenue-throughput visibility does not activate runtime jobs.",
  blockedReview: "Blocked disposition visibility does not route work.",
  noExecution: "No execution is authorized.",
  noProvider: "No provider activation permitted.",
  noContact: "Buyer operations do not contact buyers or sellers.",
} as const;
export const x4ReadonlyUiForbiddenControls = ["buttons", "forms", "inputs", "links", "click handlers", "send controls", "routing controls", "provider controls", "outreach controls", "runtime controls", "automation controls", "polling", "fetch/network behavior", "persistence behavior", "audit writing"] as const;

export type X4ReadonlyUiInput = Partial<Record<"authorizedSurfacesReviewed" | "wordingReviewed" | "forbiddenControlsReviewed" | "accessibilityReviewed", boolean>> & Partial<Record<"buttonRequested" | "formRequested" | "inputRequested" | "linkRequested" | "clickHandlerRequested" | "sendControlRequested" | "routingControlRequested" | "providerControlRequested" | "outreachControlRequested" | "runtimeControlRequested" | "automationControlRequested" | "pollingRequested" | "fetchNetworkRequested" | "persistenceRequested" | "auditWritingRequested", boolean>>;
export type X4ReadonlyUiStatus = "x4_ui_scope_blocked" | "operator_review_required" | "x4_ui_scope_ready";

const requiredReviewAreas: Array<[keyof X4ReadonlyUiInput, string]> = [["authorizedSurfacesReviewed", "authorized read-only buyer operations surfaces"], ["wordingReviewed", "safe buyer matching wording"], ["forbiddenControlsReviewed", "forbidden controls"], ["accessibilityReviewed", "accessibility requirements"]];
const blockedRequests: Array<[keyof X4ReadonlyUiInput, string]> = [["buttonRequested", "buttons remain forbidden"], ["formRequested", "forms remain forbidden"], ["inputRequested", "inputs remain forbidden"], ["linkRequested", "links remain forbidden"], ["clickHandlerRequested", "click handlers remain forbidden"], ["sendControlRequested", "send controls remain forbidden"], ["routingControlRequested", "routing controls remain forbidden"], ["providerControlRequested", "provider controls remain forbidden"], ["outreachControlRequested", "outreach controls remain forbidden"], ["runtimeControlRequested", "runtime controls remain forbidden"], ["automationControlRequested", "automation controls remain forbidden"], ["pollingRequested", "polling remains blocked"], ["fetchNetworkRequested", "fetch/network remains blocked"], ["persistenceRequested", "persistence remains blocked"], ["auditWritingRequested", "audit writing remains blocked"]];

export function createX4HumanGuidedBuyerMatchingOperationsReadonlyUiScopeContract(input: X4ReadonlyUiInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X4ReadonlyUiStatus = blockedReasons.length > 0 ? "x4_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x4_ui_scope_ready";
  return { phase: "X4D" as const, status, flags: { ...x4BuyerMatchingFlags, uiScopeOnly: true }, authorizedSurfaces: x4ReadonlyUiAuthorizedSurfaces, wording: x4ReadonlyUiWording, categories: x4AdvisoryCategories, forbiddenControls: x4ReadonlyUiForbiddenControls, accessibility: x4AccessibilityRequirements, missingReviewAreas, blockedReasons };
}
