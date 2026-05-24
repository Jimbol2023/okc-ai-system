import { createZ5ManualRevenuePrioritizationPolicyReview, z5ManualRevenuePrioritizationFlags } from "./z5-manual-revenue-prioritization-policy";
import { createZ5RevenuePrioritySignalReview } from "./z5-revenue-priority-signal-review";
import { createZ5ManualRevenueRankClassifierReview } from "./z5-manual-revenue-rank-classifier";
import { createZ5RevenuePrioritizationSummaryReview } from "./z5-revenue-prioritization-summary";

export function createZ5FinalManualRevenuePrioritizationSummary() {
  return {
    phase: "Z5F" as const,
    flags: z5ManualRevenuePrioritizationFlags,
    advisoryOnly: true,
    deterministic: true,
    manualOperationsRemainPrimary: true,
    policyReadiness: createZ5ManualRevenuePrioritizationPolicyReview(),
    signalReadiness: createZ5RevenuePrioritySignalReview(),
    rankClassifierReadiness: createZ5ManualRevenueRankClassifierReview(),
    prioritizationSummaryReadiness: createZ5RevenuePrioritizationSummaryReview(),
    unresolvedBlockers: [
      "no provider/runtime/schema/storage/audit/communication authorization",
      "no CRM mutation authorization",
      "no task/queue/routing/assignment creation",
      "no priority persistence",
      "no revenue execution",
      "UI not wired",
    ],
    recommendedNextExactPhase: "Z6 - Manual Revenue Workday Focus",
    z5Complete: true,
  };
}
