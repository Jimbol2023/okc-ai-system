import { x6AccessibilityRequirements, x6AdvisoryCategories, x6RevenueLeakageFlags } from "./x6-revenue-leakage-detection-scope-contract";

export const x6ReadonlyUiAuthorizedSurfaces = ["app/(dashboard)/dashboard/page.tsx", "components/dashboard/revenue-leakage-detection-layer-summary.tsx"] as const;
export const x6ReadonlyUiWording = {
  staleOpportunity: "Stale opportunity visibility does not trigger outreach.",
  blockedRevenue: "Blocked revenue visibility does not route work.",
  workflowFriction: "Workflow friction visibility does not activate automation.",
  momentumLoss: "Momentum-loss visibility does not trigger contact.",
  delayedClose: "Delayed close visibility does not activate runtime jobs.",
  nearCloseRisk: "Near-close risk visibility does not activate providers.",
  noExecution: "No execution is authorized.",
  noProvider: "No provider activation permitted.",
  noContact: "Revenue leakage detection does not contact buyers or sellers.",
} as const;
export const x6ReadonlyUiForbiddenControls = ["buttons", "forms", "inputs", "links", "click handlers", "send controls", "routing controls", "provider controls", "outreach controls", "runtime controls", "automation controls", "polling", "fetch/network behavior", "persistence behavior", "audit writing"] as const;

export type X6ReadonlyUiInput = Partial<Record<"authorizedSurfacesReviewed" | "wordingReviewed" | "forbiddenControlsReviewed" | "accessibilityReviewed", boolean>> & Partial<Record<"buttonRequested" | "formRequested" | "inputRequested" | "linkRequested" | "clickHandlerRequested" | "sendControlRequested" | "routingControlRequested" | "providerControlRequested" | "outreachControlRequested" | "runtimeControlRequested" | "automationControlRequested" | "pollingRequested" | "fetchNetworkRequested" | "persistenceRequested" | "auditWritingRequested", boolean>>;
export type X6ReadonlyUiStatus = "x6_ui_scope_blocked" | "operator_review_required" | "x6_ui_scope_ready";

const requiredReviewAreas: Array<[keyof X6ReadonlyUiInput, string]> = [["authorizedSurfacesReviewed", "authorized read-only revenue-risk surfaces"], ["wordingReviewed", "safe revenue leakage wording"], ["forbiddenControlsReviewed", "forbidden controls"], ["accessibilityReviewed", "accessibility requirements"]];
const blockedRequests: Array<[keyof X6ReadonlyUiInput, string]> = [["buttonRequested", "buttons remain forbidden"], ["formRequested", "forms remain forbidden"], ["inputRequested", "inputs remain forbidden"], ["linkRequested", "links remain forbidden"], ["clickHandlerRequested", "click handlers remain forbidden"], ["sendControlRequested", "send controls remain forbidden"], ["routingControlRequested", "routing controls remain forbidden"], ["providerControlRequested", "provider controls remain forbidden"], ["outreachControlRequested", "outreach controls remain forbidden"], ["runtimeControlRequested", "runtime controls remain forbidden"], ["automationControlRequested", "automation controls remain forbidden"], ["pollingRequested", "polling remains blocked"], ["fetchNetworkRequested", "fetch/network remains blocked"], ["persistenceRequested", "persistence remains blocked"], ["auditWritingRequested", "audit writing remains blocked"]];

export function createX6RevenueLeakageDetectionReadonlyUiScopeContract(input: X6ReadonlyUiInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X6ReadonlyUiStatus = blockedReasons.length > 0 ? "x6_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x6_ui_scope_ready";
  return { phase: "X6D" as const, status, flags: { ...x6RevenueLeakageFlags, uiScopeOnly: true }, authorizedSurfaces: x6ReadonlyUiAuthorizedSurfaces, wording: x6ReadonlyUiWording, categories: x6AdvisoryCategories, forbiddenControls: x6ReadonlyUiForbiddenControls, accessibility: x6AccessibilityRequirements, missingReviewAreas, blockedReasons };
}
