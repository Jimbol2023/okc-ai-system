import { y2ReviewFlags } from "./y2-manual-workflow-efficiency-review";

export type Y2FinalManualRevenueOperationsInput = Partial<Record<"efficiencyReviewed" | "workflowMaturityReviewed" | "revenueUsefulnessReviewed" | "operatorUsabilityReviewed" | "cognitiveSustainabilityReviewed" | "scalabilityReviewed" | "bottlenecksReviewed" | "readinessGapsReviewed" | "optimizationReviewed" | "manualBeforeActivationReviewed", boolean>> & {
  unresolvedBottlenecks?: string[];
  activationRequested?: boolean;
  providerRequested?: boolean;
  persistenceRequested?: boolean;
};
export type Y2FinalManualRevenueStatus = "manual_ops_summary_blocked" | "operator_review_required" | "manual_ops_summary_clear";

const requiredSummaryAreas: Array<[keyof Y2FinalManualRevenueOperationsInput, string]> = [["efficiencyReviewed", "operational efficiency"], ["workflowMaturityReviewed", "workflow maturity"], ["revenueUsefulnessReviewed", "revenue workflow usefulness"], ["operatorUsabilityReviewed", "operator usability"], ["cognitiveSustainabilityReviewed", "cognitive sustainability"], ["scalabilityReviewed", "operational scalability"], ["bottlenecksReviewed", "unresolved bottlenecks"], ["readinessGapsReviewed", "operational readiness gaps"], ["optimizationReviewed", "optimization recommendations"], ["manualBeforeActivationReviewed", "manual operations before activation"]];
const blockedRequests: Array<[keyof Y2FinalManualRevenueOperationsInput, string]> = [["activationRequested", "activation remains unauthorized"], ["providerRequested", "provider activation remains gated"], ["persistenceRequested", "persistence remains gated"]];

export function createY2FinalManualRevenueOperationsSummary(input: Y2FinalManualRevenueOperationsInput = {}) {
  const missingSummaryAreas = requiredSummaryAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const unresolvedBottlenecks = input.unresolvedBottlenecks ?? ["operator cognitive load requires field review", "manual ROI requires live operator observation", "dashboard prioritization may need future consolidation"];
  const status: Y2FinalManualRevenueStatus = blockedReasons.length > 0 ? "manual_ops_summary_blocked" : missingSummaryAreas.length > 0 ? "operator_review_required" : "manual_ops_summary_clear";
  return {
    phase: "Y2F" as const,
    status,
    flags: y2ReviewFlags,
    noActivationAuthorized: true,
    manualOperationsRemainPrimary: true,
    optimizationRecommendedBeforeExecution: true,
    providerActivationStillGated: true,
    persistenceStillGated: true,
    summary: {
      operationalEfficiency: "manual workflow usefulness requires continued operator review",
      workflowMaturity: "manual-first revenue operations are coherent but should be optimized before activation",
      cognitiveSustainability: "operator load and dashboard prioritization remain key review areas",
      operationalScalability: "scaling should favor simplification before provider or persistence planning",
    },
    unresolvedBottlenecks,
    missingSummaryAreas,
    blockedReasons,
  };
}
