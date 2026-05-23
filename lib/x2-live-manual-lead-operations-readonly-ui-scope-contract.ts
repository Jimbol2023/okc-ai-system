import { x2AccessibilityRequirements, x2AdvisoryCategories, x2LeadOperationsFlags } from "./x2-live-manual-lead-operations-scope-contract";

export const x2ReadonlyUiAuthorizedSurfaces = ["app/(dashboard)/dashboard/page.tsx", "components/dashboard/live-manual-lead-operations-summary.tsx"] as const;
export const x2ReadonlyUiWording = {
  manualLeadReview: "Manual lead review is advisory only.",
  overdueFollowUp: "Overdue follow-up visibility requires human operator review and does not trigger outreach.",
  workloadVisibility: "Workload visibility does not route work.",
  leadAging: "Lead aging visibility remains manual review only.",
  revenuePriority: "Revenue-priority visibility does not activate providers.",
  blockedWorkflow: "Blocked workflow visibility does not activate runtime jobs.",
  noExecution: "No execution is authorized.",
  noProvider: "No provider activation permitted.",
  noContact: "Lead operations do not contact sellers or buyers.",
} as const;
export const x2ReadonlyUiForbiddenControls = ["buttons", "forms", "inputs", "links", "click handlers", "send controls", "routing controls", "provider controls", "outreach controls", "runtime controls", "automation controls", "polling", "fetch/network behavior", "persistence behavior", "audit writing"] as const;

export type X2ReadonlyUiInput = Partial<Record<"authorizedSurfacesReviewed" | "wordingReviewed" | "forbiddenControlsReviewed" | "accessibilityReviewed", boolean>> & Partial<Record<"buttonRequested" | "formRequested" | "inputRequested" | "linkRequested" | "clickHandlerRequested" | "sendControlRequested" | "routingControlRequested" | "providerControlRequested" | "outreachControlRequested" | "runtimeControlRequested" | "automationControlRequested" | "pollingRequested" | "fetchNetworkRequested" | "persistenceRequested" | "auditWritingRequested", boolean>>;
export type X2ReadonlyUiStatus = "x2_ui_scope_blocked" | "operator_review_required" | "x2_ui_scope_ready";

const requiredReviewAreas: Array<[keyof X2ReadonlyUiInput, string]> = [["authorizedSurfacesReviewed", "authorized read-only operational surfaces"], ["wordingReviewed", "safe lead operations wording"], ["forbiddenControlsReviewed", "forbidden controls"], ["accessibilityReviewed", "accessibility requirements"]];
const blockedRequests: Array<[keyof X2ReadonlyUiInput, string]> = [["buttonRequested", "buttons remain forbidden"], ["formRequested", "forms remain forbidden"], ["inputRequested", "inputs remain forbidden"], ["linkRequested", "links remain forbidden"], ["clickHandlerRequested", "click handlers remain forbidden"], ["sendControlRequested", "send controls remain forbidden"], ["routingControlRequested", "routing controls remain forbidden"], ["providerControlRequested", "provider controls remain forbidden"], ["outreachControlRequested", "outreach controls remain forbidden"], ["runtimeControlRequested", "runtime controls remain forbidden"], ["automationControlRequested", "automation controls remain forbidden"], ["pollingRequested", "polling remains blocked"], ["fetchNetworkRequested", "fetch/network remains blocked"], ["persistenceRequested", "persistence remains blocked"], ["auditWritingRequested", "audit writing remains blocked"]];

export function createX2LiveManualLeadOperationsReadonlyUiScopeContract(input: X2ReadonlyUiInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: X2ReadonlyUiStatus = blockedReasons.length > 0 ? "x2_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "x2_ui_scope_ready";
  return { phase: "X2D" as const, status, flags: { ...x2LeadOperationsFlags, uiScopeOnly: true }, authorizedSurfaces: x2ReadonlyUiAuthorizedSurfaces, wording: x2ReadonlyUiWording, categories: x2AdvisoryCategories, forbiddenControls: x2ReadonlyUiForbiddenControls, accessibility: x2AccessibilityRequirements, missingReviewAreas, blockedReasons };
}
