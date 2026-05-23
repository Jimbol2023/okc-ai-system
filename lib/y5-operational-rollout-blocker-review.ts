import { y5PlanningFlags } from "./y5-audit-schema-model-readiness-review";

export const y5OperationalRolloutBlockerAreas = ["human review procedure", "operator training needs", "incident review procedure", "rollback rehearsal", "storage disable procedure", "privacy review signoff", "manual operations continuity", "provider/runtime isolation", "no production rollout"] as const;

export type Y5OperationalRolloutBlockerInput = Partial<Record<"humanReviewProcedureReviewed" | "operatorTrainingReviewed" | "incidentReviewProcedureReviewed" | "rollbackRehearsalReviewed" | "storageDisableProcedureReviewed" | "privacyReviewSignoffReviewed" | "manualContinuityReviewed" | "providerRuntimeIsolationReviewed" | "noProductionRolloutReviewed", boolean>> & Partial<Record<"productionRolloutRequested" | "runtimeRequested" | "providerRequested" | "storageActivationRequested" | "auditWritingRequested" | "automationRequested" | "communicationRequested", boolean>>;

export type Y5OperationalRolloutBlockerStatus = "operational_rollout_blocker_review_blocked" | "operator_review_required" | "operational_rollout_blocker_review_clear";

const requiredReviewAreas: Array<[keyof Y5OperationalRolloutBlockerInput, string]> = [["humanReviewProcedureReviewed", "human review procedure"], ["operatorTrainingReviewed", "operator training needs"], ["incidentReviewProcedureReviewed", "incident review procedure"], ["rollbackRehearsalReviewed", "rollback rehearsal"], ["storageDisableProcedureReviewed", "storage disable procedure"], ["privacyReviewSignoffReviewed", "privacy review signoff"], ["manualContinuityReviewed", "manual operations continuity"], ["providerRuntimeIsolationReviewed", "provider/runtime isolation"], ["noProductionRolloutReviewed", "no production rollout"]];
const blockedRequests: Array<[keyof Y5OperationalRolloutBlockerInput, string]> = [["productionRolloutRequested", "production rollout remains blocked"], ["runtimeRequested", "runtime activation remains blocked"], ["providerRequested", "provider activation remains blocked"], ["storageActivationRequested", "storage activation remains blocked"], ["auditWritingRequested", "audit writing remains unauthorized"], ["automationRequested", "automation remains blocked"], ["communicationRequested", "communication activation remains blocked"]];

export function createY5OperationalRolloutBlockerReview(input: Y5OperationalRolloutBlockerInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y5OperationalRolloutBlockerStatus = blockedReasons.length > 0 ? "operational_rollout_blocker_review_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "operational_rollout_blocker_review_clear";
  return {
    phase: "Y5E" as const,
    status,
    flags: y5PlanningFlags,
    planningOnly: true,
    productionRolloutAllowed: false,
    runtimeActivationAllowed: false,
    providerActivationAllowed: false,
    storageAuthorized: false,
    auditWritingAllowed: false,
    automationAllowed: false,
    communicationActivationAllowed: false,
    manualOperationsRemainPrimary: true,
    readinessAreas: y5OperationalRolloutBlockerAreas,
    missingReviewAreas,
    blockedReasons,
  };
}
