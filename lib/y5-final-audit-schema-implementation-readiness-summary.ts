import { createY5AuditSchemaModelReadinessReview, y5PlanningFlags } from "./y5-audit-schema-model-readiness-review";
import { createY5OperationalRolloutBlockerReview } from "./y5-operational-rollout-blocker-review";
import { createY5PrismaMigrationReadinessReview } from "./y5-prisma-migration-readiness-review";
import { createY5RedactionValidationReadinessReview } from "./y5-redaction-validation-readiness-review";
import { createY5StorageWritePathReadinessReview } from "./y5-storage-write-path-readiness-review";

export type Y5FinalAuditSchemaImplementationReadinessSummaryInput = Partial<Record<"schemaModelReadinessReviewed" | "migrationReadinessReviewed" | "writePathReadinessReviewed" | "redactionValidationReadinessReviewed" | "rolloutBlockersReviewed" | "unresolvedBlockersReviewed" | "recommendedNextStepReviewed", boolean>> & Partial<Record<"schemaImplementationRequested" | "migrationRequested" | "storageRequested" | "auditWritingRequested" | "providerRequested" | "runtimeRequested" | "productionRequested", boolean>>;

export type Y5FinalAuditSchemaImplementationReadinessSummaryStatus = "final_audit_schema_implementation_readiness_blocked" | "operator_review_required" | "final_audit_schema_implementation_readiness_clear";

const requiredReviewAreas: Array<[keyof Y5FinalAuditSchemaImplementationReadinessSummaryInput, string]> = [["schemaModelReadinessReviewed", "schema model readiness"], ["migrationReadinessReviewed", "migration readiness"], ["writePathReadinessReviewed", "write path readiness"], ["redactionValidationReadinessReviewed", "redaction validation readiness"], ["rolloutBlockersReviewed", "rollout blockers"], ["unresolvedBlockersReviewed", "unresolved blockers"], ["recommendedNextStepReviewed", "recommended next step"]];
const blockedRequests: Array<[keyof Y5FinalAuditSchemaImplementationReadinessSummaryInput, string]> = [["schemaImplementationRequested", "schema implementation remains unauthorized"], ["migrationRequested", "migrations remain unauthorized"], ["storageRequested", "storage remains unauthorized"], ["auditWritingRequested", "audit writing remains unauthorized"], ["providerRequested", "provider activation remains blocked"], ["runtimeRequested", "runtime activation remains blocked"], ["productionRequested", "production rollout remains blocked"]];

export function createY5FinalAuditSchemaImplementationReadinessSummary(input: Y5FinalAuditSchemaImplementationReadinessSummaryInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y5FinalAuditSchemaImplementationReadinessSummaryStatus = blockedReasons.length > 0 ? "final_audit_schema_implementation_readiness_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "final_audit_schema_implementation_readiness_clear";
  return {
    phase: "Y5F" as const,
    status,
    flags: y5PlanningFlags,
    planningOnly: true,
    schemaImplementationAuthorized: false,
    schemaChangesAuthorized: false,
    migrationsAuthorized: false,
    storageAuthorized: false,
    auditWritingAllowed: false,
    persistenceAllowedNow: false,
    persistenceWritten: false,
    providerActivationAllowed: false,
    runtimeActivationAllowed: false,
    productionRolloutAllowed: false,
    schemaModelReadiness: createY5AuditSchemaModelReadinessReview(),
    migrationReadiness: createY5PrismaMigrationReadinessReview(),
    writePathReadiness: createY5StorageWritePathReadinessReview(),
    redactionValidationReadiness: createY5RedactionValidationReadinessReview(),
    rolloutBlockers: createY5OperationalRolloutBlockerReview(),
    unresolvedBlockers: ["Prisma schema implementation not authorized", "migration creation not authorized", "audit write path not authorized", "storage activation not authorized", "production rollout not authorized"],
    recommendedNextStep: "Y6 - Audit Schema Draft Review Plan",
    recommendedNextStepPlanningOnly: true,
    y6Justified: true,
    y6Justification: "Y5 confirms readiness questions but still leaves schema drafting as a separate planning-only review before any Prisma edit",
    missingReviewAreas,
    blockedReasons,
  };
}
