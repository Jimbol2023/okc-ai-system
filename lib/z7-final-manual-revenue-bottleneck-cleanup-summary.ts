import { createZ7BottleneckCleanupClassifierReview } from "./z7-bottleneck-cleanup-classifier";
import { createZ7BottleneckSignalReview } from "./z7-bottleneck-signal-review";
import { createZ7BottleneckCleanupSummaryReview } from "./z7-bottleneck-cleanup-summary";
import { createZ7ManualRevenueBottleneckPolicyReview, z7ManualRevenueBottleneckFlags } from "./z7-manual-revenue-bottleneck-policy";

export function createZ7FinalManualRevenueBottleneckCleanupSummary() {
  return {
    phase: "Z7F" as const,
    flags: z7ManualRevenueBottleneckFlags,
    advisoryOnly: true,
    deterministic: true,
    manualOperationsRemainPrimary: true,
    policyReadiness: createZ7ManualRevenueBottleneckPolicyReview(),
    signalReviewReadiness: createZ7BottleneckSignalReview(),
    classifierReadiness: createZ7BottleneckCleanupClassifierReview(),
    cleanupSummaryReadiness: createZ7BottleneckCleanupSummaryReview(),
    unresolvedBlockers: [
      "no provider/runtime/schema/storage/audit/communication authorization",
      "no CRM mutation authorization",
      "no task/queue/routing/assignment/calendar/reminder creation",
      "no cleanup persistence",
      "no enrichment/scraping/skip tracing/external lookup",
      "no revenue execution",
      "UI not wired",
    ],
    recommendedNextExactPhase: "Z8 - Manual Revenue Recovery Coordination",
    z7Complete: true,
  };
}
