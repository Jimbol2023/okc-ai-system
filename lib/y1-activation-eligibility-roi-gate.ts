export const y1PlanningFlags = {
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

export const y1EligibilityReviewAreas = ["operational maturity", "manual revenue workflow strength", "lead throughput readiness", "seller workflow readiness", "buyer workflow readiness", "communication workspace readiness", "governance maturity", "operator review maturity", "ROI potential", "risk-adjusted activation value", "unresolved blockers"] as const;
export type Y1ActivationDecision = "continue_manual_operations" | "improve_manual_revenue_ops_first" | "plan_limited_activation_later" | "blocked_by_governance" | "blocked_by_readiness_gaps";

export type Y1ActivationEligibilityInput = Partial<Record<"operationalMature" | "manualRevenueWorkflowStrong" | "leadThroughputReady" | "sellerWorkflowReady" | "buyerWorkflowReady" | "communicationWorkspaceReady" | "governanceMature" | "operatorReviewMature" | "roiPotentialClear" | "riskAdjustedValueClear", boolean>> & {
  unresolvedBlockers?: string[];
  governanceBlocked?: boolean;
};

const requiredEligibilityAreas: Array<[keyof Y1ActivationEligibilityInput, string]> = [["operationalMature", "operational maturity"], ["manualRevenueWorkflowStrong", "manual revenue workflow strength"], ["leadThroughputReady", "lead throughput readiness"], ["sellerWorkflowReady", "seller workflow readiness"], ["buyerWorkflowReady", "buyer workflow readiness"], ["communicationWorkspaceReady", "communication workspace readiness"], ["governanceMature", "governance maturity"], ["operatorReviewMature", "operator review maturity"], ["roiPotentialClear", "ROI potential"], ["riskAdjustedValueClear", "risk-adjusted activation value"]];

export function createY1ActivationEligibilityRoiGate(input: Y1ActivationEligibilityInput = {}) {
  const readinessGaps = requiredEligibilityAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const unresolvedBlockers = input.unresolvedBlockers ?? [];
  const recommendedDecision: Y1ActivationDecision = input.governanceBlocked
    ? "blocked_by_governance"
    : unresolvedBlockers.length > 0
      ? "blocked_by_readiness_gaps"
      : readinessGaps.includes("manual revenue workflow strength") || readinessGaps.includes("lead throughput readiness")
        ? "improve_manual_revenue_ops_first"
        : readinessGaps.length === 0
          ? "plan_limited_activation_later"
          : "continue_manual_operations";

  return {
    phase: "Y1A" as const,
    flags: y1PlanningFlags,
    reviewAreas: y1EligibilityReviewAreas,
    activationEligible: false,
    activationPlanningOnly: true,
    activationRequiresFutureApproval: true,
    recommendedDecision,
    readinessGaps,
    unresolvedBlockers,
  };
}
