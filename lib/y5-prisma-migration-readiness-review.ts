import { y5PlanningFlags } from "./y5-audit-schema-model-readiness-review";

export const y5PrismaMigrationReadinessAreas = ["schema diff review", "migration naming review", "rollback plan review", "seed data avoidance", "production data safety", "human approval gate", "no migration execution", "no Prisma model creation"] as const;

export type Y5PrismaMigrationReadinessInput = Partial<Record<"schemaDiffReviewed" | "migrationNamingReviewed" | "rollbackPlanReviewed" | "seedDataAvoidanceReviewed" | "productionDataSafetyReviewed" | "humanApprovalGateReviewed" | "noMigrationExecutionReviewed" | "noPrismaModelCreationReviewed", boolean>> & Partial<Record<"prismaSchemaEditRequested" | "migrationCreateRequested" | "migrationRunRequested" | "seedDataRequested" | "dbCommandRequested" | "storageRequested", boolean>>;

export type Y5PrismaMigrationReadinessStatus = "prisma_migration_readiness_blocked" | "operator_review_required" | "prisma_migration_readiness_clear";

const requiredReviewAreas: Array<[keyof Y5PrismaMigrationReadinessInput, string]> = [["schemaDiffReviewed", "schema diff review"], ["migrationNamingReviewed", "migration naming review"], ["rollbackPlanReviewed", "rollback plan review"], ["seedDataAvoidanceReviewed", "seed data avoidance"], ["productionDataSafetyReviewed", "production data safety"], ["humanApprovalGateReviewed", "human approval gate"], ["noMigrationExecutionReviewed", "no migration execution"], ["noPrismaModelCreationReviewed", "no Prisma model creation"]];
const blockedRequests: Array<[keyof Y5PrismaMigrationReadinessInput, string]> = [["prismaSchemaEditRequested", "Prisma schema edits remain unauthorized"], ["migrationCreateRequested", "migration creation remains unauthorized"], ["migrationRunRequested", "migration execution remains unauthorized"], ["seedDataRequested", "seed data changes remain blocked"], ["dbCommandRequested", "database commands remain blocked"], ["storageRequested", "storage remains unauthorized"]];

export function createY5PrismaMigrationReadinessReview(input: Y5PrismaMigrationReadinessInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y5PrismaMigrationReadinessStatus = blockedReasons.length > 0 ? "prisma_migration_readiness_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "prisma_migration_readiness_clear";
  return {
    phase: "Y5B" as const,
    status,
    flags: y5PlanningFlags,
    planningOnly: true,
    prismaSchemaEditsAuthorized: false,
    migrationCreationAuthorized: false,
    migrationExecutionAuthorized: false,
    databaseCommandsAuthorized: false,
    storageAuthorized: false,
    persistenceWritten: false,
    readinessAreas: y5PrismaMigrationReadinessAreas,
    missingReviewAreas,
    blockedReasons,
  };
}
