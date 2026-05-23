import { x9AccessibilityRequirements, x9AdvisoryCategories, x9ControlledExecutionReadinessFlags } from "./x9-controlled-execution-readiness-scope-contract";

export const x9ReadonlyUiAuthorizedSurfaces = ["app/(dashboard)/dashboard/page.tsx", "components/dashboard/controlled-execution-readiness-operations-summary.tsx"] as const;
export const x9ReadonlyUiWording = {
  controlledReadiness: "Controlled execution readiness visibility is advisory only.",
  noActivation: "Readiness does not authorize activation.",
  noApprovalExecution: "Readiness does not grant approval execution.",
  providerBlocked: "Provider readiness visibility does not activate providers.",
  runtimeBlocked: "Runtime readiness visibility does not activate runtime jobs.",
  outreachBlocked: "Outreach readiness visibility does not trigger outreach.",
  routingBlocked: "Routing readiness visibility does not route work.",
  noExecution: "No execution is authorized.",
  noProvider: "No provider activation permitted.",
  noContact: "Controlled execution readiness does not contact buyers or sellers.",
} as const;
export const x9ReadonlyUiForbiddenControls = ["buttons", "forms", "inputs", "links", "click handlers", "activation controls", "execution controls", "approval execution controls", "send controls", "routing controls", "provider controls", "outreach controls", "runtime controls", "automation controls", "polling", "fetch/network behavior", "persistence behavior", "audit writing"] as const;

export type X9ReadonlyUiInput = Partial<Record<"authorizedSurfacesReviewed" | "wordingReviewed" | "forbiddenControlsReviewed" | "accessibilityReviewed", boolean>> & Partial<Record<"buttonRequested" | "formRequested" | "inputRequested" | "linkRequested" | "clickHandlerRequested" | "activationControlRequested" | "executionControlRequested" | "approvalExecutionControlRequested" | "sendControlRequested" | "routingControlRequested" | "providerControlRequested" | "outreachControlRequested" | "runtimeControlRequested" | "automationControlRequested" | "pollingRequested" | "fetchNetworkRequested" | "persistenceRequested" | "auditWritingRequested", boolean>>;
export type X9ReadonlyUiStatus = "x9_ui_scope_blocked" | "operator_review_required" | "x9_ui_scope_ready";

const requiredReviewAreas: Array<[keyof X9ReadonlyUiInput, string]> = [["authorizedSurfacesReviewed", "authorized read-only execution readiness surfaces"], ["wordingReviewed", "safe controlled execution readiness wording"], ["forbiddenControlsReviewed", "forbidden controls"], ["accessibilityReviewed", "accessibility requirements"]];
const blockedRequests: Array<[keyof X9ReadonlyUiInput, string]> = [["buttonRequested", "buttons remain forbidden"], ["formRequested", "forms remain forbidden"], ["inputRequested", "inputs remain forbidden"], ["linkRequested", "links remain forbidden"], ["clickHandlerRequested", "click handlers remain forbidden"], ["activationControlRequested", "activation controls remain forbidden"], ["executionControlRequested", "execution controls remain forbidden"], ["approvalExecutionControlRequested", "approval execution controls remain forbidden"], ["sendControlRequested", "send controls remain forbidden"], ["routingControlRequested", "routing controls remain forbidden"], ["providerControlRequested", "provider controls remain forbidden"], ["outreachControlRequested", "outreach controls remain forbidden"], ["runtimeControlRequested", "runtime controls remain forbidden"], ["automationControlRequested", "automation controls remain forbidden"], ["pollingRequested", "polling remains blocked"], ["fetchNetworkRequested", "fetch/network remains blocked"], ["persistenceRequested", "persistence remains blocked"], ["auditWritingRequested", "audit writing remains blocked"]];

export function createX9ControlledExecutionReadinessReadonlyUiScopeContract(input: X9ReadonlyUiInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X9ReadonlyUiStatus = blockedReasons.length > 0 ? "x9_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x9_ui_scope_ready";
  return { phase: "X9D" as const, status, flags: { ...x9ControlledExecutionReadinessFlags, uiScopeOnly: true }, authorizedSurfaces: x9ReadonlyUiAuthorizedSurfaces, wording: x9ReadonlyUiWording, categories: x9AdvisoryCategories, forbiddenControls: x9ReadonlyUiForbiddenControls, accessibility: x9AccessibilityRequirements, missingReviewAreas, blockedReasons };
}
