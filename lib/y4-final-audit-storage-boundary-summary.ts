import { createY4FutureAuditSchemaConceptPlan, y4PlanningFlags } from "./y4-future-audit-schema-concept-plan";
import { createY4MigrationRollbackFailureSafetyPlan } from "./y4-migration-rollback-failure-safety-plan";
import { createY4RedactionBeforeStorageContractPlan } from "./y4-redaction-before-storage-contract-plan";
import { createY4RetentionPrivacyDeletionBoundaryPlan } from "./y4-retention-privacy-deletion-boundary-plan";
import { createY4StorageBoundaryAuthorizationPlan } from "./y4-storage-boundary-authorization-plan";

export type Y4FinalAuditStorageBoundarySummaryInput = Partial<Record<"schemaReadinessReviewed" | "storageReadinessReviewed" | "redactionReadinessReviewed" | "retentionPrivacyReadinessReviewed" | "rollbackReadinessReviewed" | "unresolvedBlockersReviewed" | "recommendedNextStepReviewed", boolean>> & Partial<Record<"schemaRequested" | "migrationRequested" | "storageRequested" | "persistenceRequested" | "providerRequested" | "runtimeRequested" | "auditWriteRequested", boolean>>;

export type Y4FinalAuditStorageBoundarySummaryStatus = "final_audit_storage_boundary_summary_blocked" | "operator_review_required" | "final_audit_storage_boundary_summary_clear";

const requiredReviewAreas: Array<[keyof Y4FinalAuditStorageBoundarySummaryInput, string]> = [["schemaReadinessReviewed", "schema readiness"], ["storageReadinessReviewed", "storage readiness"], ["redactionReadinessReviewed", "redaction readiness"], ["retentionPrivacyReadinessReviewed", "retention/privacy readiness"], ["rollbackReadinessReviewed", "rollback readiness"], ["unresolvedBlockersReviewed", "unresolved blockers"], ["recommendedNextStepReviewed", "recommended next step"]];
const blockedRequests: Array<[keyof Y4FinalAuditStorageBoundarySummaryInput, string]> = [["schemaRequested", "schema remains unauthorized"], ["migrationRequested", "migrations remain unauthorized"], ["storageRequested", "storage remains unauthorized"], ["persistenceRequested", "persistence remains unauthorized"], ["providerRequested", "provider activation remains blocked"], ["runtimeRequested", "runtime activation remains blocked"], ["auditWriteRequested", "audit writing remains unauthorized"]];

export function createY4FinalAuditStorageBoundarySummary(input: Y4FinalAuditStorageBoundarySummaryInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y4FinalAuditStorageBoundarySummaryStatus = blockedReasons.length > 0 ? "final_audit_storage_boundary_summary_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "final_audit_storage_boundary_summary_clear";
  return {
    phase: "Y4F" as const,
    status,
    flags: y4PlanningFlags,
    planningOnly: true,
    schemaChangesAuthorized: false,
    migrationsAuthorized: false,
    storageAuthorized: false,
    persistenceAuthorized: false,
    auditWritingAllowed: false,
    persistenceAllowedNow: false,
    persistenceWritten: false,
    providerActivationAllowed: false,
    runtimeActivationAllowed: false,
    schemaReadiness: createY4FutureAuditSchemaConceptPlan(),
    storageReadiness: createY4StorageBoundaryAuthorizationPlan(),
    redactionReadiness: createY4RedactionBeforeStorageContractPlan(),
    retentionPrivacyReadiness: createY4RetentionPrivacyDeletionBoundaryPlan(),
    rollbackReadiness: createY4MigrationRollbackFailureSafetyPlan(),
    unresolvedBlockers: ["schema remains conceptual only", "migrations remain unauthorized", "storage remains unauthorized", "audit writing remains unauthorized", "provider and runtime activation remain premature"],
    recommendedNextStep: "Y5 - Audit Schema Implementation Readiness Review",
    recommendedNextStepPlanningOnly: true,
    y5Justified: true,
    y5Justification: "Y4 defines boundaries but implementation readiness still needs planning before any schema or storage work",
    missingReviewAreas,
    blockedReasons,
  };
}
