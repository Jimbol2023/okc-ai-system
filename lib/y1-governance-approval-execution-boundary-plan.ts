import { y1PlanningFlags } from "./y1-activation-eligibility-roi-gate";

export const y1ApprovalBoundaryAreas = ["human approval", "approval does not equal execution", "approval queue review", "approval-to-send risk", "final operator confirmation", "audit-before-execution", "compliance-before-execution", "provider-before-execution checks", "DNC-before-execution checks", "message preview-before-execution checks", "rollback/stop conditions", "emergency disable concepts"] as const;

export type Y1ApprovalBoundaryInput = Partial<Record<"humanApprovalReviewed" | "approvalNotExecutionReviewed" | "queueReviewed" | "approvalToSendRiskReviewed" | "operatorConfirmationReviewed" | "auditBeforeReviewed" | "complianceBeforeReviewed" | "providerBeforeReviewed" | "dncBeforeReviewed" | "previewBeforeReviewed" | "rollbackReviewed" | "emergencyDisableReviewed", boolean>> & Partial<Record<"executionRequested" | "runtimeRequested" | "providerRequested" | "approvalGrantRequested", boolean>>;
export type Y1ApprovalBoundaryStatus = "approval_boundary_blocked" | "operator_review_required" | "approval_boundary_review_clear";

const requiredBoundaryAreas: Array<[keyof Y1ApprovalBoundaryInput, string]> = [["humanApprovalReviewed", "human approval"], ["approvalNotExecutionReviewed", "approval does not equal execution"], ["queueReviewed", "approval queue review"], ["approvalToSendRiskReviewed", "approval-to-send risk"], ["operatorConfirmationReviewed", "final operator confirmation"], ["auditBeforeReviewed", "audit-before-execution"], ["complianceBeforeReviewed", "compliance-before-execution"], ["providerBeforeReviewed", "provider-before-execution checks"], ["dncBeforeReviewed", "DNC-before-execution checks"], ["previewBeforeReviewed", "message preview-before-execution checks"], ["rollbackReviewed", "rollback/stop conditions"], ["emergencyDisableReviewed", "emergency disable concepts"]];
const blockedRequests: Array<[keyof Y1ApprovalBoundaryInput, string]> = [["executionRequested", "execution remains blocked"], ["runtimeRequested", "runtime activation remains blocked"], ["providerRequested", "provider activation remains blocked"], ["approvalGrantRequested", "approval does not grant execution"]];

export function createY1GovernanceApprovalExecutionBoundaryPlan(input: Y1ApprovalBoundaryInput = {}) {
  const missingBoundaryAreas = requiredBoundaryAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y1ApprovalBoundaryStatus = blockedReasons.length > 0 ? "approval_boundary_blocked" : missingBoundaryAreas.length > 0 ? "operator_review_required" : "approval_boundary_review_clear";
  return { phase: "Y1C" as const, status, flags: y1PlanningFlags, boundaryAreas: y1ApprovalBoundaryAreas, approvalGrantsExecution: false, runtimeActivationAllowed: false, providerActivationAllowed: false, executionAllowed: false, missingBoundaryAreas, blockedReasons };
}
