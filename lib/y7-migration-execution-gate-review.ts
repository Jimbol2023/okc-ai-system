import { y7PlanningFlags } from "./y7-schema-implementation-gate-readiness";

export const y7MigrationExecutionGateAreas = ["migration diff review", "rollback plan review", "backup expectation review", "failure stop condition", "no migration generation", "no migration execution", "no hosted DB command", "manual approval required"] as const;

export type Y7MigrationExecutionGateInput = Partial<Record<"diffReviewed" | "rollbackReviewed" | "backupExpectationReviewed" | "failureStopReviewed" | "noGenerationReviewed" | "noExecutionReviewed" | "noHostedDbReviewed" | "manualApprovalReviewed", boolean>> & Partial<Record<"migrationGenerateRequested" | "migrationRunRequested" | "hostedDbCommandRequested" | "rollbackExecutionRequested" | "schemaEditRequested" | "storageRequested", boolean>>;

export type Y7MigrationExecutionGateStatus = "migration_execution_gate_blocked" | "operator_review_required" | "migration_execution_gate_clear";

const requiredReviewAreas: Array<[keyof Y7MigrationExecutionGateInput, string]> = [["diffReviewed", "migration diff review"], ["rollbackReviewed", "rollback plan review"], ["backupExpectationReviewed", "backup expectation review"], ["failureStopReviewed", "failure stop condition"], ["noGenerationReviewed", "no migration generation"], ["noExecutionReviewed", "no migration execution"], ["noHostedDbReviewed", "no hosted DB command"], ["manualApprovalReviewed", "manual approval required"]];
const blockedRequests: Array<[keyof Y7MigrationExecutionGateInput, string]> = [["migrationGenerateRequested", "migration generation remains blocked"], ["migrationRunRequested", "migration execution remains blocked"], ["hostedDbCommandRequested", "hosted DB commands remain blocked"], ["rollbackExecutionRequested", "rollback execution remains blocked"], ["schemaEditRequested", "schema edits remain unauthorized"], ["storageRequested", "storage remains unauthorized"]];

export function createY7MigrationExecutionGateReview(input: Y7MigrationExecutionGateInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y7MigrationExecutionGateStatus = blockedReasons.length > 0 ? "migration_execution_gate_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "migration_execution_gate_clear";
  return {
    phase: "Y7B" as const,
    status,
    flags: y7PlanningFlags,
    planningOnly: true,
    migrationGenerationAuthorized: false,
    migrationExecutionAuthorized: false,
    hostedDbCommandsAuthorized: false,
    migrationsAuthorized: false,
    storageAuthorized: false,
    persistenceWritten: false,
    reviewAreas: y7MigrationExecutionGateAreas,
    missingReviewAreas,
    blockedReasons,
  };
}
