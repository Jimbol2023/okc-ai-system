import { y9PlanningFlags } from "./y9-final-authorization-evidence-review";

export const y9SchemaStopConditions = ["missing governance approval", "missing privacy approval", "missing security approval", "missing rollback plan", "missing retention plan", "unresolved risky field", "unresolved rejected field", "operator readiness gap", "migration uncertainty"] as const;

export type Y9SchemaChangeStopConditionInput = Partial<Record<"governanceStopReviewed" | "privacyStopReviewed" | "securityStopReviewed" | "rollbackStopReviewed" | "retentionStopReviewed" | "riskyFieldStopReviewed" | "rejectedFieldStopReviewed" | "operatorReadinessStopReviewed" | "migrationUncertaintyStopReviewed", boolean>> & Partial<Record<"ignoreStopConditionRequested" | "schemaEditRequested" | "prismaModelRequested" | "migrationRequested" | "forceProceedRequested", boolean>>;

export type Y9SchemaChangeStopConditionStatus = "schema_change_stop_condition_blocked" | "operator_review_required" | "schema_change_stop_condition_clear";

const requiredReviewAreas: Array<[keyof Y9SchemaChangeStopConditionInput, string]> = [["governanceStopReviewed", "missing governance approval"], ["privacyStopReviewed", "missing privacy approval"], ["securityStopReviewed", "missing security approval"], ["rollbackStopReviewed", "missing rollback plan"], ["retentionStopReviewed", "missing retention plan"], ["riskyFieldStopReviewed", "unresolved risky field"], ["rejectedFieldStopReviewed", "unresolved rejected field"], ["operatorReadinessStopReviewed", "operator readiness gap"], ["migrationUncertaintyStopReviewed", "migration uncertainty"]];
const blockedRequests: Array<[keyof Y9SchemaChangeStopConditionInput, string]> = [["ignoreStopConditionRequested", "stop condition bypass remains blocked"], ["schemaEditRequested", "schema edits remain unauthorized"], ["prismaModelRequested", "Prisma model creation remains unauthorized"], ["migrationRequested", "migrations remain unauthorized"], ["forceProceedRequested", "force proceed remains blocked"]];

export function createY9SchemaChangeStopConditionReview(input: Y9SchemaChangeStopConditionInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y9SchemaChangeStopConditionStatus = blockedReasons.length > 0 ? "schema_change_stop_condition_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "schema_change_stop_condition_clear";
  return {
    phase: "Y9B" as const,
    status,
    flags: y9PlanningFlags,
    planningOnly: true,
    stopConditions: y9SchemaStopConditions,
    stopConditionBypassAllowed: false,
    schemaChangesAuthorized: false,
    migrationsAuthorized: false,
    storageAuthorized: false,
    persistenceWritten: false,
    missingReviewAreas,
    blockedReasons,
  };
}
