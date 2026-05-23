import { y7PlanningFlags } from "./y7-schema-implementation-gate-readiness";

export const y7OperationalReadinessGateAreas = ["manual operations continuity", "operator training before storage", "incident procedure review", "rollback rehearsal review", "storage disable drill concept", "support burden review", "no production rollout", "no runtime worker"] as const;

export type Y7OperationalReadinessGateInput = Partial<Record<"manualContinuityReviewed" | "operatorTrainingReviewed" | "incidentProcedureReviewed" | "rollbackRehearsalReviewed" | "storageDisableDrillReviewed" | "supportBurdenReviewed" | "noProductionRolloutReviewed" | "noRuntimeWorkerReviewed", boolean>> & Partial<Record<"productionRolloutRequested" | "runtimeWorkerRequested" | "operatorBypassRequested" | "storageActivationRequested" | "automationRequested" | "communicationRequested", boolean>>;

export type Y7OperationalReadinessGateStatus = "operational_readiness_gate_blocked" | "operator_review_required" | "operational_readiness_gate_clear";

const requiredReviewAreas: Array<[keyof Y7OperationalReadinessGateInput, string]> = [["manualContinuityReviewed", "manual operations continuity"], ["operatorTrainingReviewed", "operator training before storage"], ["incidentProcedureReviewed", "incident procedure review"], ["rollbackRehearsalReviewed", "rollback rehearsal review"], ["storageDisableDrillReviewed", "storage disable drill concept"], ["supportBurdenReviewed", "support burden review"], ["noProductionRolloutReviewed", "no production rollout"], ["noRuntimeWorkerReviewed", "no runtime worker"]];
const blockedRequests: Array<[keyof Y7OperationalReadinessGateInput, string]> = [["productionRolloutRequested", "production rollout remains blocked"], ["runtimeWorkerRequested", "runtime workers remain blocked"], ["operatorBypassRequested", "operator bypass remains blocked"], ["storageActivationRequested", "storage activation remains blocked"], ["automationRequested", "automation remains blocked"], ["communicationRequested", "communication activation remains blocked"]];

export function createY7OperationalReadinessGateReview(input: Y7OperationalReadinessGateInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y7OperationalReadinessGateStatus = blockedReasons.length > 0 ? "operational_readiness_gate_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "operational_readiness_gate_clear";
  return {
    phase: "Y7E" as const,
    status,
    flags: y7PlanningFlags,
    planningOnly: true,
    operationalGatePassed: false,
    manualOperationsRemainPrimary: true,
    productionRolloutAllowed: false,
    runtimeActivationAllowed: false,
    storageAuthorized: false,
    automationAllowed: false,
    communicationActivationAllowed: false,
    reviewAreas: y7OperationalReadinessGateAreas,
    missingReviewAreas,
    blockedReasons,
  };
}
