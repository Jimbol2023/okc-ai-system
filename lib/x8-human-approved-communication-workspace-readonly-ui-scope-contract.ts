import { x8AccessibilityRequirements, x8AdvisoryCategories, x8HumanApprovedCommunicationFlags } from "./x8-human-approved-communication-workspace-scope-contract";

export const x8ReadonlyUiAuthorizedSurfaces = ["app/(dashboard)/dashboard/page.tsx", "components/dashboard/human-approved-communication-workspace-summary.tsx"] as const;
export const x8ReadonlyUiWording = {
  communicationReadiness: "Communication readiness visibility does not send messages.",
  communicationRisk: "Communication risk visibility does not trigger outreach or route work.",
  humanApproval: "Human approval visibility does not activate providers or grant execution.",
  dnc: "DNC visibility does not permit contact.",
  optOut: "Opt-out visibility does not permit outreach.",
  providerBlocked: "Provider-blocked visibility does not activate providers.",
  noExecution: "No execution is authorized.",
  noProvider: "No provider activation permitted.",
  noContact: "Communication workspace does not contact buyers or sellers.",
} as const;
export const x8ReadonlyUiForbiddenControls = ["buttons", "forms", "inputs", "links", "click handlers", "send controls", "routing controls", "provider controls", "outreach controls", "runtime controls", "automation controls", "polling", "fetch/network behavior", "persistence behavior", "audit writing"] as const;

export type X8ReadonlyUiInput = Partial<Record<"authorizedSurfacesReviewed" | "wordingReviewed" | "forbiddenControlsReviewed" | "accessibilityReviewed", boolean>> & Partial<Record<"buttonRequested" | "formRequested" | "inputRequested" | "linkRequested" | "clickHandlerRequested" | "sendControlRequested" | "routingControlRequested" | "providerControlRequested" | "outreachControlRequested" | "runtimeControlRequested" | "automationControlRequested" | "pollingRequested" | "fetchNetworkRequested" | "persistenceRequested" | "auditWritingRequested", boolean>>;
export type X8ReadonlyUiStatus = "x8_ui_scope_blocked" | "operator_review_required" | "x8_ui_scope_ready";

const requiredReviewAreas: Array<[keyof X8ReadonlyUiInput, string]> = [["authorizedSurfacesReviewed", "authorized read-only communication surfaces"], ["wordingReviewed", "safe communication workspace wording"], ["forbiddenControlsReviewed", "forbidden controls"], ["accessibilityReviewed", "accessibility requirements"]];
const blockedRequests: Array<[keyof X8ReadonlyUiInput, string]> = [["buttonRequested", "buttons remain forbidden"], ["formRequested", "forms remain forbidden"], ["inputRequested", "inputs remain forbidden"], ["linkRequested", "links remain forbidden"], ["clickHandlerRequested", "click handlers remain forbidden"], ["sendControlRequested", "send controls remain forbidden"], ["routingControlRequested", "routing controls remain forbidden"], ["providerControlRequested", "provider controls remain forbidden"], ["outreachControlRequested", "outreach controls remain forbidden"], ["runtimeControlRequested", "runtime controls remain forbidden"], ["automationControlRequested", "automation controls remain forbidden"], ["pollingRequested", "polling remains blocked"], ["fetchNetworkRequested", "fetch/network remains blocked"], ["persistenceRequested", "persistence remains blocked"], ["auditWritingRequested", "audit writing remains blocked"]];

export function createX8HumanApprovedCommunicationWorkspaceReadonlyUiScopeContract(input: X8ReadonlyUiInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X8ReadonlyUiStatus = blockedReasons.length > 0 ? "x8_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x8_ui_scope_ready";
  return { phase: "X8D" as const, status, flags: { ...x8HumanApprovedCommunicationFlags, uiScopeOnly: true }, authorizedSurfaces: x8ReadonlyUiAuthorizedSurfaces, wording: x8ReadonlyUiWording, categories: x8AdvisoryCategories, forbiddenControls: x8ReadonlyUiForbiddenControls, accessibility: x8AccessibilityRequirements, missingReviewAreas, blockedReasons };
}
