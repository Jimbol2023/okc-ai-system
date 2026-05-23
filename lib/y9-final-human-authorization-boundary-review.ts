import { y9PlanningFlags } from "./y9-final-authorization-evidence-review";

export const y9HumanAuthorizationBoundaryAreas = ["human approval is advisory", "approval does not execute", "approval does not write schema", "approval does not create migration", "approval does not activate storage", "approval does not call provider", "approval does not start runtime", "separate implementation authorization required"] as const;

export type Y9FinalHumanAuthorizationBoundaryInput = Partial<Record<"approvalAdvisoryReviewed" | "approvalExecutionBoundaryReviewed" | "approvalSchemaBoundaryReviewed" | "approvalMigrationBoundaryReviewed" | "approvalStorageBoundaryReviewed" | "approvalProviderBoundaryReviewed" | "approvalRuntimeBoundaryReviewed" | "separateAuthorizationReviewed", boolean>> & Partial<Record<"approvalAsExecutionRequested" | "approvalAsSchemaEditRequested" | "approvalAsMigrationRequested" | "approvalAsStorageRequested" | "approvalAsProviderRequested" | "approvalAsRuntimeRequested", boolean>>;

export type Y9FinalHumanAuthorizationBoundaryStatus = "final_human_authorization_boundary_blocked" | "operator_review_required" | "final_human_authorization_boundary_clear";

const requiredReviewAreas: Array<[keyof Y9FinalHumanAuthorizationBoundaryInput, string]> = [["approvalAdvisoryReviewed", "human approval is advisory"], ["approvalExecutionBoundaryReviewed", "approval does not execute"], ["approvalSchemaBoundaryReviewed", "approval does not write schema"], ["approvalMigrationBoundaryReviewed", "approval does not create migration"], ["approvalStorageBoundaryReviewed", "approval does not activate storage"], ["approvalProviderBoundaryReviewed", "approval does not call provider"], ["approvalRuntimeBoundaryReviewed", "approval does not start runtime"], ["separateAuthorizationReviewed", "separate implementation authorization required"]];
const blockedRequests: Array<[keyof Y9FinalHumanAuthorizationBoundaryInput, string]> = [["approvalAsExecutionRequested", "approval-as-execution remains blocked"], ["approvalAsSchemaEditRequested", "approval-as-schema-edit remains blocked"], ["approvalAsMigrationRequested", "approval-as-migration remains blocked"], ["approvalAsStorageRequested", "approval-as-storage remains blocked"], ["approvalAsProviderRequested", "approval-as-provider remains blocked"], ["approvalAsRuntimeRequested", "approval-as-runtime remains blocked"]];

export function createY9FinalHumanAuthorizationBoundaryReview(input: Y9FinalHumanAuthorizationBoundaryInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y9FinalHumanAuthorizationBoundaryStatus = blockedReasons.length > 0 ? "final_human_authorization_boundary_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "final_human_authorization_boundary_clear";
  return {
    phase: "Y9C" as const,
    status,
    flags: y9PlanningFlags,
    planningOnly: true,
    authorizationBoundaries: y9HumanAuthorizationBoundaryAreas,
    approvalGrantsExecution: false,
    schemaChangesAuthorized: false,
    migrationsAuthorized: false,
    storageAuthorized: false,
    providerActivationAllowed: false,
    runtimeActivationAllowed: false,
    missingReviewAreas,
    blockedReasons,
  };
}
