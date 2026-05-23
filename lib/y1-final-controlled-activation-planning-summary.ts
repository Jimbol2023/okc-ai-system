import { y1PlanningFlags } from "./y1-activation-eligibility-roi-gate";

export type Y1FinalPlanningSummaryInput = Partial<Record<"eligibilityReviewed" | "roiReviewed" | "governanceReviewed" | "providerReviewed" | "communicationReviewed" | "persistenceAuditReviewed" | "rolloutReviewed" | "riskReviewed", boolean>> & {
  unresolvedBlockers?: string[];
  activationRequested?: boolean;
  providerRequested?: boolean;
  sendingRequested?: boolean;
};
export type Y1FinalActivationDecision = "no_activation_authorized" | "continue_manual_revenue_operations" | "future_planning_only";
export type Y1FinalPlanningStatus = "final_planning_blocked" | "operator_review_required" | "final_planning_review_clear";

const requiredSummaryAreas: Array<[keyof Y1FinalPlanningSummaryInput, string]> = [["eligibilityReviewed", "activation eligibility"], ["roiReviewed", "ROI readiness"], ["governanceReviewed", "governance readiness"], ["providerReviewed", "provider readiness"], ["communicationReviewed", "communication readiness"], ["persistenceAuditReviewed", "persistence/audit readiness"], ["rolloutReviewed", "rollout readiness"], ["riskReviewed", "risk exposure"]];
const blockedRequests: Array<[keyof Y1FinalPlanningSummaryInput, string]> = [["activationRequested", "activation remains unauthorized"], ["providerRequested", "provider activation remains unauthorized"], ["sendingRequested", "sending remains unauthorized"]];

export function createY1FinalControlledActivationPlanningSummary(input: Y1FinalPlanningSummaryInput = {}) {
  const missingSummaryAreas = requiredSummaryAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const unresolvedBlockers = input.unresolvedBlockers ?? ["future provider activation plan required", "future communication activation plan required", "future persistence/audit plan required"];
  const status: Y1FinalPlanningStatus = blockedReasons.length > 0 ? "final_planning_blocked" : missingSummaryAreas.length > 0 ? "operator_review_required" : "final_planning_review_clear";
  const activationDecision: Y1FinalActivationDecision = blockedReasons.length > 0 ? "no_activation_authorized" : "future_planning_only";
  return {
    phase: "Y1F" as const,
    status,
    flags: y1PlanningFlags,
    noActivationAuthorized: true,
    futurePlanningOnly: true,
    humanReviewRequired: true,
    governanceConfidenceRequired: true,
    manualRevenueOperationsRemainPrimary: true,
    activationDecision,
    riskAdjustedRecommendation: unresolvedBlockers.length > 0 ? "continue manual operations while resolving readiness blockers" : "consider separately scoped limited activation planning later",
    unresolvedBlockers,
    missingSummaryAreas,
    blockedReasons,
  };
}
