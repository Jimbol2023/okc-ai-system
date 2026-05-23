export const y2ReviewFlags = {
  readOnly: true,
  advisoryOnly: true,
  humanReviewOnly: true,
  simulationOnly: true,
  providerCalled: false,
  sent: false,
  persistenceWritten: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  providerActivationAllowed: false,
  approvalGrantsExecution: false,
} as const;

export const y2WorkflowEfficiencyAreas = ["seller workflow continuity", "buyer workflow continuity", "operator task flow clarity", "lead review workflow", "disposition workflow", "follow-up workflow", "communication workspace usability", "dashboard operational clarity", "workflow duplication", "unnecessary operator steps", "workflow friction", "operational complexity", "operational scalability"] as const;

export type Y2WorkflowEfficiencyInput = Partial<Record<"sellerWorkflowReviewed" | "buyerWorkflowReviewed" | "taskFlowReviewed" | "leadReviewReviewed" | "dispositionReviewed" | "followUpReviewed" | "communicationWorkspaceReviewed" | "dashboardClarityReviewed" | "duplicationReviewed" | "operatorStepsReviewed" | "frictionReviewed" | "complexityReviewed" | "scalabilityReviewed", boolean>> & Partial<Record<"executionRequested" | "providerRequested" | "runtimeRequested" | "persistenceRequested", boolean>>;
export type Y2WorkflowEfficiencyStatus = "workflow_efficiency_blocked" | "operator_review_required" | "workflow_efficiency_review_clear";

const requiredWorkflowAreas: Array<[keyof Y2WorkflowEfficiencyInput, string]> = [["sellerWorkflowReviewed", "seller workflow continuity"], ["buyerWorkflowReviewed", "buyer workflow continuity"], ["taskFlowReviewed", "operator task flow clarity"], ["leadReviewReviewed", "lead review workflow"], ["dispositionReviewed", "disposition workflow"], ["followUpReviewed", "follow-up workflow"], ["communicationWorkspaceReviewed", "communication workspace usability"], ["dashboardClarityReviewed", "dashboard operational clarity"], ["duplicationReviewed", "workflow duplication"], ["operatorStepsReviewed", "unnecessary operator steps"], ["frictionReviewed", "workflow friction"], ["complexityReviewed", "operational complexity"], ["scalabilityReviewed", "operational scalability"]];
const blockedRequests: Array<[keyof Y2WorkflowEfficiencyInput, string]> = [["executionRequested", "execution remains blocked"], ["providerRequested", "provider activation remains blocked"], ["runtimeRequested", "runtime activation remains blocked"], ["persistenceRequested", "persistence remains blocked"]];

export function createY2ManualWorkflowEfficiencyReview(input: Y2WorkflowEfficiencyInput = {}) {
  const missingReviewAreas = requiredWorkflowAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y2WorkflowEfficiencyStatus = blockedReasons.length > 0 ? "workflow_efficiency_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "workflow_efficiency_review_clear";
  return { phase: "Y2A" as const, status, flags: y2ReviewFlags, reviewAreas: y2WorkflowEfficiencyAreas, reviewOnly: true, advisoryOnly: true, optimizationOnly: true, executionAllowed: false, missingReviewAreas, blockedReasons };
}
