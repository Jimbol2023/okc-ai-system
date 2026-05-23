import { x10AccessibilityRequirements, x10AdvisoryCategories, x10InternalOperationalPilotFlags } from "./x10-internal-operational-pilot-scope-contract";

export const x10ReadonlyUiAuthorizedSurfaces = ["app/(dashboard)/dashboard/page.tsx", "components/dashboard/internal-operational-pilot-summary.tsx"] as const;
export const x10ReadonlyUiWording = {
  pilotReadiness: "Internal pilot visibility is advisory only.",
  workflowReadiness: "Workflow readiness visibility does not route work.",
  governanceReadiness: "Governance readiness visibility does not activate providers.",
  communicationReadiness: "Communication readiness visibility does not send messages or trigger outreach.",
  executionBlocked: "Execution-blocked visibility does not activate runtime jobs.",
  providerBlocked: "Provider-blocked visibility does not activate providers.",
  noExecution: "No execution is authorized.",
  noProvider: "No provider activation permitted.",
  noContact: "Internal operational pilot does not contact buyers or sellers.",
} as const;
export const x10ReadonlyUiForbiddenControls = ["buttons", "forms", "inputs", "links", "click handlers", "send controls", "routing controls", "provider controls", "outreach controls", "runtime controls", "automation controls", "polling", "fetch/network behavior", "persistence behavior", "audit writing"] as const;

export type X10ReadonlyUiInput = Partial<Record<"authorizedSurfacesReviewed" | "wordingReviewed" | "forbiddenControlsReviewed" | "accessibilityReviewed", boolean>> & Partial<Record<"buttonRequested" | "formRequested" | "inputRequested" | "linkRequested" | "clickHandlerRequested" | "sendControlRequested" | "routingControlRequested" | "providerControlRequested" | "outreachControlRequested" | "runtimeControlRequested" | "automationControlRequested" | "pollingRequested" | "fetchNetworkRequested" | "persistenceRequested" | "auditWritingRequested", boolean>>;
export type X10ReadonlyUiStatus = "x10_ui_scope_blocked" | "operator_review_required" | "x10_ui_scope_ready";

const requiredReviewAreas: Array<[keyof X10ReadonlyUiInput, string]> = [["authorizedSurfacesReviewed", "authorized read-only pilot surfaces"], ["wordingReviewed", "safe internal pilot wording"], ["forbiddenControlsReviewed", "forbidden controls"], ["accessibilityReviewed", "accessibility requirements"]];
const blockedRequests: Array<[keyof X10ReadonlyUiInput, string]> = [["buttonRequested", "buttons remain forbidden"], ["formRequested", "forms remain forbidden"], ["inputRequested", "inputs remain forbidden"], ["linkRequested", "links remain forbidden"], ["clickHandlerRequested", "click handlers remain forbidden"], ["sendControlRequested", "send controls remain forbidden"], ["routingControlRequested", "routing controls remain forbidden"], ["providerControlRequested", "provider controls remain forbidden"], ["outreachControlRequested", "outreach controls remain forbidden"], ["runtimeControlRequested", "runtime controls remain forbidden"], ["automationControlRequested", "automation controls remain forbidden"], ["pollingRequested", "polling remains blocked"], ["fetchNetworkRequested", "fetch/network remains blocked"], ["persistenceRequested", "persistence remains blocked"], ["auditWritingRequested", "audit writing remains blocked"]];

export function createX10InternalOperationalPilotReadonlyUiScopeContract(input: X10ReadonlyUiInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X10ReadonlyUiStatus = blockedReasons.length > 0 ? "x10_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x10_ui_scope_ready";
  return { phase: "X10D" as const, status, flags: { ...x10InternalOperationalPilotFlags, uiScopeOnly: true }, authorizedSurfaces: x10ReadonlyUiAuthorizedSurfaces, wording: x10ReadonlyUiWording, categories: x10AdvisoryCategories, forbiddenControls: x10ReadonlyUiForbiddenControls, accessibility: x10AccessibilityRequirements, missingReviewAreas, blockedReasons };
}
