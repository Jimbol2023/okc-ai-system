import { createY6AuditSchemaApprovalReadinessReview } from "./y6-audit-schema-approval-readiness-review";
import { createY6AuditSchemaDraftFieldsReview, y6PlanningFlags } from "./y6-audit-schema-draft-fields-review";
import { createY6AuditSchemaMinimizationReview } from "./y6-audit-schema-minimization-review";
import { createY6AuditSchemaQueryabilityReview } from "./y6-audit-schema-queryability-review";
import { createY6AuditSchemaRelationshipBoundaryReview } from "./y6-audit-schema-relationship-boundary-review";

export type Y6FinalAuditSchemaDraftReviewSummaryInput = Partial<Record<"draftFieldReadinessReviewed" | "minimizationReadinessReviewed" | "relationshipBoundaryReadinessReviewed" | "queryabilityReadinessReviewed" | "approvalReadinessReviewed" | "unresolvedBlockersReviewed" | "recommendedNextStepReviewed", boolean>> & Partial<Record<"schemaRequested" | "migrationRequested" | "storageRequested" | "persistenceRequested" | "auditWritingRequested" | "providerRequested" | "runtimeRequested" | "executionRequested", boolean>>;

export type Y6FinalAuditSchemaDraftReviewSummaryStatus = "final_audit_schema_draft_review_blocked" | "operator_review_required" | "final_audit_schema_draft_review_clear";

const requiredReviewAreas: Array<[keyof Y6FinalAuditSchemaDraftReviewSummaryInput, string]> = [["draftFieldReadinessReviewed", "draft field readiness"], ["minimizationReadinessReviewed", "minimization readiness"], ["relationshipBoundaryReadinessReviewed", "relationship boundary readiness"], ["queryabilityReadinessReviewed", "queryability readiness"], ["approvalReadinessReviewed", "approval readiness"], ["unresolvedBlockersReviewed", "unresolved blockers"], ["recommendedNextStepReviewed", "recommended next step"]];
const blockedRequests: Array<[keyof Y6FinalAuditSchemaDraftReviewSummaryInput, string]> = [["schemaRequested", "schema changes remain unauthorized"], ["migrationRequested", "migrations remain unauthorized"], ["storageRequested", "storage remains unauthorized"], ["persistenceRequested", "persistence remains unauthorized"], ["auditWritingRequested", "audit writing remains unauthorized"], ["providerRequested", "provider activation remains blocked"], ["runtimeRequested", "runtime activation remains blocked"], ["executionRequested", "execution activation remains blocked"]];

export function createY6FinalAuditSchemaDraftReviewSummary(input: Y6FinalAuditSchemaDraftReviewSummaryInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y6FinalAuditSchemaDraftReviewSummaryStatus = blockedReasons.length > 0 ? "final_audit_schema_draft_review_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "final_audit_schema_draft_review_clear";
  return {
    phase: "Y6F" as const,
    status,
    flags: y6PlanningFlags,
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
    executionActivationAllowed: false,
    draftFieldReadiness: createY6AuditSchemaDraftFieldsReview(),
    minimizationReadiness: createY6AuditSchemaMinimizationReview(),
    relationshipBoundaryReadiness: createY6AuditSchemaRelationshipBoundaryReview(),
    queryabilityReadiness: createY6AuditSchemaQueryabilityReview(),
    approvalReadiness: createY6AuditSchemaApprovalReadinessReview(),
    unresolvedBlockers: ["Prisma schema edits remain unauthorized", "migration creation remains unauthorized", "storage remains unauthorized", "audit writing remains unauthorized", "provider/runtime/execution activation remains blocked"],
    recommendedNextStep: "Y7 - Audit Schema Implementation Gate Review",
    recommendedNextStepPlanningOnly: true,
    y7Justified: true,
    y7Justification: "Y6 reviews draft shape, but a separate implementation gate review is still required before any schema edit",
    missingReviewAreas,
    blockedReasons,
  };
}
