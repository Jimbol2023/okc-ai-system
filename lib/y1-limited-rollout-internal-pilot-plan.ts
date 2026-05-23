import { y1PlanningFlags } from "./y1-activation-eligibility-roi-gate";

export const y1LimitedRolloutStages = ["Stage 0: Manual-only operations continue", "Stage 1: Dry-run execution rehearsal", "Stage 2: Internal-only operator testing", "Stage 3: Single-channel provider sandbox review", "Stage 4: Human-confirmed limited send test", "Stage 5: Small-volume controlled pilot", "Stage 6: Post-pilot review", "Stage 7: production-readiness review"] as const;
export const y1RolloutGates = ["rollback conditions", "stop conditions", "governance gates", "operator approval gates", "compliance gates", "deliverability/reputation review gates", "accessibility/mobile readiness gates"] as const;

export type Y1LimitedRolloutInput = Partial<Record<"rollbackReviewed" | "stopReviewed" | "governanceReviewed" | "operatorApprovalReviewed" | "complianceReviewed" | "deliverabilityReviewed" | "accessibilityReviewed", boolean>> & Partial<Record<"activationNowRequested" | "providerUsageRequested" | "sendRequested" | "runtimeRequested" | "persistenceRequested", boolean>>;
export type Y1LimitedRolloutStatus = "rollout_plan_blocked" | "operator_review_required" | "rollout_plan_review_clear";

const requiredGates: Array<[keyof Y1LimitedRolloutInput, string]> = [["rollbackReviewed", "rollback conditions"], ["stopReviewed", "stop conditions"], ["governanceReviewed", "governance gates"], ["operatorApprovalReviewed", "operator approval gates"], ["complianceReviewed", "compliance gates"], ["deliverabilityReviewed", "deliverability/reputation review gates"], ["accessibilityReviewed", "accessibility/mobile readiness gates"]];
const blockedRequests: Array<[keyof Y1LimitedRolloutInput, string]> = [["activationNowRequested", "activation now remains blocked"], ["providerUsageRequested", "provider usage now remains blocked"], ["sendRequested", "sending now remains blocked"], ["runtimeRequested", "runtime now remains blocked"], ["persistenceRequested", "persistence now remains blocked"]];

export function createY1LimitedRolloutInternalPilotPlan(input: Y1LimitedRolloutInput = {}) {
  const missingGates = requiredGates.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y1LimitedRolloutStatus = blockedReasons.length > 0 ? "rollout_plan_blocked" : missingGates.length > 0 ? "operator_review_required" : "rollout_plan_review_clear";
  return { phase: "Y1E" as const, status, flags: y1PlanningFlags, stages: y1LimitedRolloutStages, gates: y1RolloutGates, activationNowAllowed: false, providerUsageNowAllowed: false, sendingNowAllowed: false, runtimeNowAllowed: false, persistenceNowAllowed: false, missingGates, blockedReasons };
}
