import { x1AccessibilityRequirements, x1AdvisoryCategories, x1CommandCenterFlags } from "./x1-human-operational-command-center-scope-contract";

export const x1ReadonlyUiAuthorizedSurfaces = ["app/(dashboard)/dashboard/page.tsx", "components/dashboard/human-operational-command-center-summary.tsx"] as const;
export const x1ReadonlyUiWording = {
  dailyFocus: "Daily focus is advisory only.",
  manualNextBestAction: "Manual next-best-action visibility only.",
  overdueFollowUp: "Overdue follow-up requires human operator review and does not trigger outreach.",
  hotSeller: "Hot seller visibility does not contact sellers.",
  buyerReady: "Buyer-ready visibility does not activate providers.",
  nearClose: "Near-close visibility does not activate runtime jobs.",
  blockedItem: "Blocked item visibility remains manual review only.",
  noExecution: "No execution is authorized.",
  noProvider: "No provider activation permitted.",
  noContact: "Command center does not contact sellers or buyers.",
} as const;
export const x1ReadonlyUiForbiddenControls = ["buttons", "forms", "inputs", "links", "click handlers", "send controls", "routing controls", "approval execution controls", "provider controls", "outreach controls", "automation controls", "runtime controls", "fetch/network behavior", "persistence behavior", "audit writing"] as const;

export type X1ReadonlyUiInput = Partial<Record<"authorizedSurfacesReviewed" | "wordingReviewed" | "forbiddenControlsReviewed" | "accessibilityReviewed", boolean>> & Partial<Record<"buttonRequested" | "formRequested" | "inputRequested" | "linkRequested" | "clickHandlerRequested" | "sendControlRequested" | "routingControlRequested" | "providerControlRequested" | "outreachControlRequested" | "automationControlRequested" | "runtimeControlRequested" | "fetchNetworkRequested" | "persistenceRequested" | "auditWritingRequested", boolean>>;
export type X1ReadonlyUiStatus = "x1_ui_scope_blocked" | "operator_review_required" | "x1_ui_scope_ready";

const requiredReviewAreas: Array<[keyof X1ReadonlyUiInput, string]> = [["authorizedSurfacesReviewed", "authorized read-only surfaces"], ["wordingReviewed", "safe command center wording"], ["forbiddenControlsReviewed", "forbidden controls"], ["accessibilityReviewed", "accessibility requirements"]];
const blockedRequests: Array<[keyof X1ReadonlyUiInput, string]> = [["buttonRequested", "buttons remain forbidden"], ["formRequested", "forms remain forbidden"], ["inputRequested", "inputs remain forbidden"], ["linkRequested", "links remain forbidden"], ["clickHandlerRequested", "click handlers remain forbidden"], ["sendControlRequested", "send controls remain forbidden"], ["routingControlRequested", "routing controls remain forbidden"], ["providerControlRequested", "provider controls remain forbidden"], ["outreachControlRequested", "outreach controls remain forbidden"], ["automationControlRequested", "automation controls remain forbidden"], ["runtimeControlRequested", "runtime controls remain forbidden"], ["fetchNetworkRequested", "fetch/network remains blocked"], ["persistenceRequested", "persistence remains blocked"], ["auditWritingRequested", "audit writing remains blocked"]];

export function createX1HumanOperationalCommandCenterReadonlyUiScopeContract(input: X1ReadonlyUiInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X1ReadonlyUiStatus = blockedReasons.length > 0 ? "x1_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x1_ui_scope_ready";
  return { phase: "X1D" as const, status, flags: { ...x1CommandCenterFlags, uiScopeOnly: true }, authorizedSurfaces: x1ReadonlyUiAuthorizedSurfaces, wording: x1ReadonlyUiWording, categories: x1AdvisoryCategories, forbiddenControls: x1ReadonlyUiForbiddenControls, accessibility: x1AccessibilityRequirements, missingReviewAreas, blockedReasons };
}
