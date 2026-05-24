import { createZ8ManualRecoveryCoordinationClassifierReview } from "./z8-manual-recovery-coordination-classifier";
import { createZ8ManualRevenueRecoveryPolicyReview, z8ManualRevenueRecoveryFlags } from "./z8-manual-revenue-recovery-policy";
import { createZ8RecoveryCoordinationSignalReview } from "./z8-recovery-coordination-signal-review";
import { createZ8RecoveryCoordinationSummaryReview } from "./z8-recovery-coordination-summary";

export function createZ8FinalManualRevenueRecoveryCoordinationSummary() {
  return {
    phase: "Z8F" as const,
    flags: z8ManualRevenueRecoveryFlags,
    advisoryOnly: true,
    deterministic: true,
    manualOperationsRemainPrimary: true,
    policyReadiness: createZ8ManualRevenueRecoveryPolicyReview(),
    signalReviewReadiness: createZ8RecoveryCoordinationSignalReview(),
    classifierReadiness: createZ8ManualRecoveryCoordinationClassifierReview(),
    recoverySummaryReadiness: createZ8RecoveryCoordinationSummaryReview(),
    unresolvedBlockers: [
      "no provider/runtime/schema/storage/audit/communication authorization",
      "no CRM mutation authorization",
      "no task/queue/routing/assignment/calendar/reminder creation",
      "no recovery plan persistence",
      "no dependency updates",
      "no seller/buyer/closing contact",
      "no recovery execution",
      "UI not wired",
    ],
    recommendedNextExactPhase: "Z9 - Manual Revenue Risk Review",
    z8Complete: true,
  };
}
