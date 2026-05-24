import { createZ4ConversionSignalReadinessReview } from "./z4-conversion-signal-readiness";
import { createZ4ConversionStageClassifierReview } from "./z4-conversion-stage-classifier";
import { createZ4ManualConversionReadinessReview } from "./z4-manual-conversion-readiness";
import { createZ4ManualConversionPolicyReview, z4ManualConversionFlags } from "./z4-manual-conversion-policy";

export function createZ4FinalManualConversionPipelineSummary() {
  return {
    phase: "Z4F" as const,
    flags: z4ManualConversionFlags,
    advisoryOnly: true,
    deterministic: true,
    manualOperationsRemainPrimary: true,
    policyReadiness: createZ4ManualConversionPolicyReview(),
    signalReadiness: createZ4ConversionSignalReadinessReview(),
    stageClassifierReadiness: createZ4ConversionStageClassifierReview(),
    manualConversionReadiness: createZ4ManualConversionReadinessReview(),
    unresolvedBlockers: [
      "no provider/runtime/schema/storage/audit/communication authorization",
      "no CRM mutation authorization",
      "no offer/contract/signature execution",
      "no buyer/seller contact",
      "UI not wired",
    ],
    recommendedNextExactPhase: "Z5 - Manual Revenue Prioritization",
    z4Complete: true,
  };
}
