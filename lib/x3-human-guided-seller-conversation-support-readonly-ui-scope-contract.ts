import { x3AccessibilityRequirements, x3AdvisoryCategories, x3SellerConversationFlags } from "./x3-human-guided-seller-conversation-support-scope-contract";

export const x3ReadonlyUiAuthorizedSurfaces = ["app/(dashboard)/dashboard/page.tsx", "components/dashboard/human-guided-seller-conversation-support-summary.tsx"] as const;
export const x3ReadonlyUiWording = {
  sellerConversation: "Seller conversation support is advisory only.",
  manualContextReview: "Seller context requires human operator review.",
  followUpLanguage: "Follow-up language visibility does not send messages.",
  objectionReview: "Seller objection visibility does not automate responses.",
  offerReadiness: "Offer-readiness conversation visibility does not execute offers.",
  noExecution: "No execution is authorized.",
  noProvider: "No provider activation permitted.",
  noContact: "Seller conversation support does not contact sellers or buyers.",
} as const;
export const x3ReadonlyUiForbiddenControls = ["buttons", "forms", "inputs", "links", "click handlers", "send controls", "call controls", "routing controls", "provider controls", "outreach controls", "runtime controls", "automation controls", "polling", "fetch/network behavior", "persistence behavior", "audit writing"] as const;

export type X3ReadonlyUiInput = Partial<Record<"authorizedSurfacesReviewed" | "wordingReviewed" | "forbiddenControlsReviewed" | "accessibilityReviewed", boolean>> & Partial<Record<"buttonRequested" | "formRequested" | "inputRequested" | "linkRequested" | "clickHandlerRequested" | "sendControlRequested" | "callControlRequested" | "routingControlRequested" | "providerControlRequested" | "outreachControlRequested" | "runtimeControlRequested" | "automationControlRequested" | "pollingRequested" | "fetchNetworkRequested" | "persistenceRequested" | "auditWritingRequested", boolean>>;
export type X3ReadonlyUiStatus = "x3_ui_scope_blocked" | "operator_review_required" | "x3_ui_scope_ready";

const requiredReviewAreas: Array<[keyof X3ReadonlyUiInput, string]> = [["authorizedSurfacesReviewed", "authorized read-only seller conversation surfaces"], ["wordingReviewed", "safe seller conversation wording"], ["forbiddenControlsReviewed", "forbidden controls"], ["accessibilityReviewed", "accessibility requirements"]];
const blockedRequests: Array<[keyof X3ReadonlyUiInput, string]> = [["buttonRequested", "buttons remain forbidden"], ["formRequested", "forms remain forbidden"], ["inputRequested", "inputs remain forbidden"], ["linkRequested", "links remain forbidden"], ["clickHandlerRequested", "click handlers remain forbidden"], ["sendControlRequested", "send controls remain forbidden"], ["callControlRequested", "call controls remain forbidden"], ["routingControlRequested", "routing controls remain forbidden"], ["providerControlRequested", "provider controls remain forbidden"], ["outreachControlRequested", "outreach controls remain forbidden"], ["runtimeControlRequested", "runtime controls remain forbidden"], ["automationControlRequested", "automation controls remain forbidden"], ["pollingRequested", "polling remains blocked"], ["fetchNetworkRequested", "fetch/network remains blocked"], ["persistenceRequested", "persistence remains blocked"], ["auditWritingRequested", "audit writing remains blocked"]];

export function createX3HumanGuidedSellerConversationSupportReadonlyUiScopeContract(input: X3ReadonlyUiInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X3ReadonlyUiStatus = blockedReasons.length > 0 ? "x3_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x3_ui_scope_ready";
  return { phase: "X3D" as const, status, flags: { ...x3SellerConversationFlags, uiScopeOnly: true }, authorizedSurfaces: x3ReadonlyUiAuthorizedSurfaces, wording: x3ReadonlyUiWording, categories: x3AdvisoryCategories, forbiddenControls: x3ReadonlyUiForbiddenControls, accessibility: x3AccessibilityRequirements, missingReviewAreas, blockedReasons };
}
