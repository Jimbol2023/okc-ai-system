import { y6PlanningFlags } from "./y6-audit-schema-draft-fields-review";

export const y6ApprovalReadinessAreas = ["governance approval", "privacy approval", "security approval", "retention approval", "redaction approval", "rollback approval", "migration approval", "operator workflow approval", "legal/compliance review placeholder"] as const;

export type Y6AuditSchemaApprovalReadinessInput = Partial<Record<"governanceApprovalReviewed" | "privacyApprovalReviewed" | "securityApprovalReviewed" | "retentionApprovalReviewed" | "redactionApprovalReviewed" | "rollbackApprovalReviewed" | "migrationApprovalReviewed" | "operatorWorkflowApprovalReviewed" | "legalComplianceReviewReviewed", boolean>> & Partial<Record<"approvalAsExecutionRequested" | "schemaImplementationRequested" | "migrationRequested" | "storageRequested" | "auditWritingRequested" | "providerRequested" | "runtimeRequested", boolean>>;

export type Y6AuditSchemaApprovalReadinessStatus = "audit_schema_approval_readiness_blocked" | "operator_review_required" | "audit_schema_approval_readiness_clear";

const requiredReviewAreas: Array<[keyof Y6AuditSchemaApprovalReadinessInput, string]> = [["governanceApprovalReviewed", "governance approval"], ["privacyApprovalReviewed", "privacy approval"], ["securityApprovalReviewed", "security approval"], ["retentionApprovalReviewed", "retention approval"], ["redactionApprovalReviewed", "redaction approval"], ["rollbackApprovalReviewed", "rollback approval"], ["migrationApprovalReviewed", "migration approval"], ["operatorWorkflowApprovalReviewed", "operator workflow approval"], ["legalComplianceReviewReviewed", "legal/compliance review placeholder"]];
const blockedRequests: Array<[keyof Y6AuditSchemaApprovalReadinessInput, string]> = [["approvalAsExecutionRequested", "approval-as-execution remains blocked"], ["schemaImplementationRequested", "schema implementation remains unauthorized"], ["migrationRequested", "migrations remain unauthorized"], ["storageRequested", "storage remains unauthorized"], ["auditWritingRequested", "audit writing remains unauthorized"], ["providerRequested", "provider activation remains blocked"], ["runtimeRequested", "runtime activation remains blocked"]];

export function createY6AuditSchemaApprovalReadinessReview(input: Y6AuditSchemaApprovalReadinessInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y6AuditSchemaApprovalReadinessStatus = blockedReasons.length > 0 ? "audit_schema_approval_readiness_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "audit_schema_approval_readiness_clear";
  return {
    phase: "Y6E" as const,
    status,
    flags: y6PlanningFlags,
    planningOnly: true,
    approvalsRequired: y6ApprovalReadinessAreas,
    approvalGrantsExecution: false,
    schemaImplementationAuthorized: false,
    migrationsAuthorized: false,
    storageAuthorized: false,
    auditWritingAllowed: false,
    providerActivationAllowed: false,
    runtimeActivationAllowed: false,
    missingReviewAreas,
    blockedReasons,
  };
}
