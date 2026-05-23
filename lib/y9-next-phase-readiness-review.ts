import { y9PlanningFlags } from "./y9-final-authorization-evidence-review";

export const y9NextPhaseReadinessAreas = ["authorization package complete", "stop conditions documented", "human boundary documented", "rollout risks documented", "implementation still blocked", "next phase planning-only", "manual operations primary"] as const;

export type Y9NextPhaseReadinessInput = Partial<Record<"authorizationPackageReviewed" | "stopConditionsReviewed" | "humanBoundaryReviewed" | "rolloutRisksReviewed" | "implementationBlockedReviewed" | "nextPhasePlanningOnlyReviewed" | "manualOperationsReviewed", boolean>> & Partial<Record<"implementationRequested" | "schemaEditRequested" | "migrationRequested" | "storageRequested" | "runtimeRequested" | "providerRequested", boolean>>;

export type Y9NextPhaseReadinessStatus = "next_phase_readiness_blocked" | "operator_review_required" | "next_phase_readiness_clear";

const requiredReviewAreas: Array<[keyof Y9NextPhaseReadinessInput, string]> = [["authorizationPackageReviewed", "authorization package complete"], ["stopConditionsReviewed", "stop conditions documented"], ["humanBoundaryReviewed", "human boundary documented"], ["rolloutRisksReviewed", "rollout risks documented"], ["implementationBlockedReviewed", "implementation still blocked"], ["nextPhasePlanningOnlyReviewed", "next phase planning-only"], ["manualOperationsReviewed", "manual operations primary"]];
const blockedRequests: Array<[keyof Y9NextPhaseReadinessInput, string]> = [["implementationRequested", "implementation remains blocked"], ["schemaEditRequested", "schema edits remain unauthorized"], ["migrationRequested", "migrations remain unauthorized"], ["storageRequested", "storage remains unauthorized"], ["runtimeRequested", "runtime activation remains blocked"], ["providerRequested", "provider activation remains blocked"]];

export function createY9NextPhaseReadinessReview(input: Y9NextPhaseReadinessInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y9NextPhaseReadinessStatus = blockedReasons.length > 0 ? "next_phase_readiness_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "next_phase_readiness_clear";
  return {
    phase: "Y9E" as const,
    status,
    flags: y9PlanningFlags,
    planningOnly: true,
    nextPhaseRecommended: "Y10 - Schema Implementation Authorization Decision Plan",
    nextPhasePlanningOnly: true,
    manualOperationsRemainPrimary: true,
    schemaChangesAuthorized: false,
    migrationsAuthorized: false,
    storageAuthorized: false,
    providerActivationAllowed: false,
    runtimeActivationAllowed: false,
    missingReviewAreas,
    blockedReasons,
  };
}
