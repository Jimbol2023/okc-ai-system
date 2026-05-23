import { y2ReviewFlags } from "./y2-manual-workflow-efficiency-review";

export const y2RevenueBottleneckAreas = ["seller response bottlenecks", "buyer matching bottlenecks", "near-close bottlenecks", "follow-up bottlenecks", "operator review bottlenecks", "missing-data bottlenecks", "communication bottlenecks", "workflow latency", "operator overload", "lead stagnation", "deal progression inefficiencies"] as const;

export type Y2BottleneckInput = Partial<Record<"sellerResponseReviewed" | "buyerMatchingReviewed" | "nearCloseReviewed" | "followUpReviewed" | "operatorReviewReviewed" | "missingDataReviewed" | "communicationReviewed" | "workflowLatencyReviewed" | "operatorOverloadReviewed" | "leadStagnationReviewed" | "dealProgressionReviewed", boolean>> & Partial<Record<"executionRequested" | "automationRequested" | "providerRequested" | "runtimeRequested" | "outreachRequested", boolean>>;
export type Y2BottleneckStatus = "bottleneck_review_blocked" | "operator_review_required" | "bottleneck_review_clear";

const requiredBottleneckAreas: Array<[keyof Y2BottleneckInput, string]> = [["sellerResponseReviewed", "seller response bottlenecks"], ["buyerMatchingReviewed", "buyer matching bottlenecks"], ["nearCloseReviewed", "near-close bottlenecks"], ["followUpReviewed", "follow-up bottlenecks"], ["operatorReviewReviewed", "operator review bottlenecks"], ["missingDataReviewed", "missing-data bottlenecks"], ["communicationReviewed", "communication bottlenecks"], ["workflowLatencyReviewed", "workflow latency"], ["operatorOverloadReviewed", "operator overload"], ["leadStagnationReviewed", "lead stagnation"], ["dealProgressionReviewed", "deal progression inefficiencies"]];
const blockedRequests: Array<[keyof Y2BottleneckInput, string]> = [["executionRequested", "execution remains blocked"], ["automationRequested", "automation remains blocked"], ["providerRequested", "provider activation remains blocked"], ["runtimeRequested", "runtime activation remains blocked"], ["outreachRequested", "outreach remains blocked"]];

export function createY2RevenueOperationsBottleneckReview(input: Y2BottleneckInput = {}) {
  const missingBottleneckAreas = requiredBottleneckAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y2BottleneckStatus = blockedReasons.length > 0 ? "bottleneck_review_blocked" : missingBottleneckAreas.length > 0 ? "operator_review_required" : "bottleneck_review_clear";
  return { phase: "Y2B" as const, status, flags: y2ReviewFlags, bottleneckAreas: y2RevenueBottleneckAreas, advisoryOnly: true, nonExecuting: true, planningOnly: true, missingBottleneckAreas, blockedReasons };
}
