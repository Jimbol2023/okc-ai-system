import { createZ6ManualRevenueWorkdayPolicyReview, z6ManualRevenueWorkdayFlags } from "./z6-manual-revenue-workday-policy";
import { createZ6WorkdayFocusSignalReview } from "./z6-workday-focus-signal-review";
import { createZ6ManualWorkdayFocusClassifierReview } from "./z6-manual-workday-focus-classifier";
import { createZ6WorkdayFocusSummaryReview } from "./z6-workday-focus-summary";

export function createZ6FinalManualRevenueWorkdayFocusSummary() {
  return {
    phase: "Z6F" as const,
    flags: z6ManualRevenueWorkdayFlags,
    advisoryOnly: true,
    deterministic: true,
    manualOperationsRemainPrimary: true,
    policyReadiness: createZ6ManualRevenueWorkdayPolicyReview(),
    signalReadiness: createZ6WorkdayFocusSignalReview(),
    classifierReadiness: createZ6ManualWorkdayFocusClassifierReview(),
    focusSummaryReadiness: createZ6WorkdayFocusSummaryReview(),
    unresolvedBlockers: [
      "no provider/runtime/schema/storage/audit/communication authorization",
      "no CRM mutation authorization",
      "no task/queue/routing/assignment/calendar/reminder creation",
      "no workday persistence",
      "no revenue execution",
      "UI not wired",
    ],
    recommendedNextExactPhase: "Z7 - Manual Revenue Bottleneck Cleanup",
    z6Complete: true,
  };
}
