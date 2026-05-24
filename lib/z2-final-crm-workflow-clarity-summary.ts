import { createZ2CrmStatusTaxonomyReview, z2CrmWorkflowFlags } from "./z2-crm-status-taxonomy";
import { createZ2LeadLifecycleHygieneReview } from "./z2-lead-lifecycle-hygiene";
import { createZ2ManualNextActionClassifierReview } from "./z2-manual-next-action-classifier";
import { createZ2CrmWorkflowReadinessReview } from "./z2-crm-workflow-readiness";

export function createZ2FinalCrmWorkflowClaritySummary() {
  return {
    phase: "Z2F" as const,
    flags: z2CrmWorkflowFlags,
    advisoryOnly: true,
    deterministic: true,
    manualOperationsRemainPrimary: true,
    taxonomyReadiness: createZ2CrmStatusTaxonomyReview(),
    lifecycleHygieneReadiness: createZ2LeadLifecycleHygieneReview(),
    manualNextActionReadiness: createZ2ManualNextActionClassifierReview(),
    workflowReadiness: createZ2CrmWorkflowReadinessReview(),
    unresolvedBlockers: [
      "no provider/runtime/schema/storage/audit/communication authorization",
      "no CRM mutation authorization",
      "UI not wired",
      "follow-up velocity not started",
    ],
    recommendedNextExactPhase: "Z3 - Follow-Up Velocity",
    z2Complete: true,
  };
}
