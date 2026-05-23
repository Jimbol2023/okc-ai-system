import { x7AccessibilityRequirements, x7AdvisoryCategories, x7NearCloseDealRecoveryFlags } from "./x7-near-close-deal-recovery-operations-scope-contract";

export const x7ReadonlyUiAuthorizedSurfaces = ["app/(dashboard)/dashboard/page.tsx", "components/dashboard/near-close-deal-recovery-operations-summary.tsx"] as const;
export const x7ReadonlyUiWording = {
  nearCloseRecovery: "Near-close recovery visibility is advisory only.",
  closingRisk: "Closing-risk visibility does not activate runtime jobs.",
  assignmentRisk: "Assignment-risk visibility does not activate providers.",
  stalledNearClose: "Stalled near-close visibility does not trigger outreach.",
  blockedClosing: "Blocked closing visibility does not route work.",
  missingClosingData: "Missing closing data visibility does not trigger skip tracing.",
  noExecution: "No execution is authorized.",
  noProvider: "No provider activation permitted.",
  noContact: "Near-close recovery operations do not contact buyers or sellers.",
} as const;
export const x7ReadonlyUiForbiddenControls = ["buttons", "forms", "inputs", "links", "click handlers", "send controls", "routing controls", "provider controls", "outreach controls", "runtime controls", "automation controls", "polling", "fetch/network behavior", "persistence behavior", "audit writing"] as const;

export type X7ReadonlyUiInput = Partial<Record<"authorizedSurfacesReviewed" | "wordingReviewed" | "forbiddenControlsReviewed" | "accessibilityReviewed", boolean>> & Partial<Record<"buttonRequested" | "formRequested" | "inputRequested" | "linkRequested" | "clickHandlerRequested" | "sendControlRequested" | "routingControlRequested" | "providerControlRequested" | "outreachControlRequested" | "runtimeControlRequested" | "automationControlRequested" | "pollingRequested" | "fetchNetworkRequested" | "persistenceRequested" | "auditWritingRequested", boolean>>;
export type X7ReadonlyUiStatus = "x7_ui_scope_blocked" | "operator_review_required" | "x7_ui_scope_ready";

const requiredReviewAreas: Array<[keyof X7ReadonlyUiInput, string]> = [["authorizedSurfacesReviewed", "authorized read-only near-close recovery surfaces"], ["wordingReviewed", "safe near-close recovery wording"], ["forbiddenControlsReviewed", "forbidden controls"], ["accessibilityReviewed", "accessibility requirements"]];
const blockedRequests: Array<[keyof X7ReadonlyUiInput, string]> = [["buttonRequested", "buttons remain forbidden"], ["formRequested", "forms remain forbidden"], ["inputRequested", "inputs remain forbidden"], ["linkRequested", "links remain forbidden"], ["clickHandlerRequested", "click handlers remain forbidden"], ["sendControlRequested", "send controls remain forbidden"], ["routingControlRequested", "routing controls remain forbidden"], ["providerControlRequested", "provider controls remain forbidden"], ["outreachControlRequested", "outreach controls remain forbidden"], ["runtimeControlRequested", "runtime controls remain forbidden"], ["automationControlRequested", "automation controls remain forbidden"], ["pollingRequested", "polling remains blocked"], ["fetchNetworkRequested", "fetch/network remains blocked"], ["persistenceRequested", "persistence remains blocked"], ["auditWritingRequested", "audit writing remains blocked"]];

export function createX7NearCloseDealRecoveryOperationsReadonlyUiScopeContract(input: X7ReadonlyUiInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X7ReadonlyUiStatus = blockedReasons.length > 0 ? "x7_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x7_ui_scope_ready";
  return { phase: "X7D" as const, status, flags: { ...x7NearCloseDealRecoveryFlags, uiScopeOnly: true }, authorizedSurfaces: x7ReadonlyUiAuthorizedSurfaces, wording: x7ReadonlyUiWording, categories: x7AdvisoryCategories, forbiddenControls: x7ReadonlyUiForbiddenControls, accessibility: x7AccessibilityRequirements, missingReviewAreas, blockedReasons };
}
