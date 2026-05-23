import { y4PlanningFlags } from "./y4-future-audit-schema-concept-plan";

export const y4MigrationRollbackFailureAreas = ["migration approval", "rollback requirements", "failed write behavior", "emergency storage disable", "no silent failures", "no provider-triggered persistence", "no runtime-triggered persistence"] as const;

export type Y4MigrationRollbackFailureSafetyInput = Partial<Record<"migrationApprovalReviewed" | "rollbackRequirementsReviewed" | "failedWriteBehaviorReviewed" | "emergencyStorageDisableReviewed" | "noSilentFailuresReviewed" | "noProviderTriggeredPersistenceReviewed" | "noRuntimeTriggeredPersistenceReviewed", boolean>> & Partial<Record<"migrationRequested" | "rollbackImplementationRequested" | "storageRequested" | "providerTriggeredPersistenceRequested" | "runtimeTriggeredPersistenceRequested" | "silentFailureRequested" | "dbWriteRequested", boolean>>;

export type Y4MigrationRollbackFailureSafetyStatus = "migration_rollback_failure_safety_blocked" | "operator_review_required" | "migration_rollback_failure_safety_clear";

const requiredReviewAreas: Array<[keyof Y4MigrationRollbackFailureSafetyInput, string]> = [["migrationApprovalReviewed", "migration approval"], ["rollbackRequirementsReviewed", "rollback requirements"], ["failedWriteBehaviorReviewed", "failed write behavior"], ["emergencyStorageDisableReviewed", "emergency storage disable"], ["noSilentFailuresReviewed", "no silent failures"], ["noProviderTriggeredPersistenceReviewed", "no provider-triggered persistence"], ["noRuntimeTriggeredPersistenceReviewed", "no runtime-triggered persistence"]];
const blockedRequests: Array<[keyof Y4MigrationRollbackFailureSafetyInput, string]> = [["migrationRequested", "migrations remain unauthorized"], ["rollbackImplementationRequested", "rollback implementation remains blocked"], ["storageRequested", "storage remains unauthorized"], ["providerTriggeredPersistenceRequested", "provider-triggered persistence remains blocked"], ["runtimeTriggeredPersistenceRequested", "runtime-triggered persistence remains blocked"], ["silentFailureRequested", "silent failures remain blocked"], ["dbWriteRequested", "DB writes remain blocked"]];

export function createY4MigrationRollbackFailureSafetyPlan(input: Y4MigrationRollbackFailureSafetyInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y4MigrationRollbackFailureSafetyStatus = blockedReasons.length > 0 ? "migration_rollback_failure_safety_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "migration_rollback_failure_safety_clear";
  return {
    phase: "Y4E" as const,
    status,
    flags: y4PlanningFlags,
    planningOnly: true,
    migrationApprovalRequired: true,
    rollbackRequirementsRequired: true,
    failedWriteBehaviorReviewRequired: true,
    emergencyStorageDisableRequired: true,
    silentFailuresAllowed: false,
    providerTriggeredPersistenceAllowed: false,
    runtimeTriggeredPersistenceAllowed: false,
    migrationsAuthorized: false,
    storageAuthorized: false,
    persistenceWritten: false,
    persistenceAllowedNow: false,
    auditWritingAllowed: false,
    reviewAreas: y4MigrationRollbackFailureAreas,
    missingReviewAreas,
    blockedReasons,
  };
}
