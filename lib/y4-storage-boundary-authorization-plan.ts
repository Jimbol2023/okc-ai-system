import { y4PlanningFlags } from "./y4-future-audit-schema-concept-plan";

export const y4StorageAuthorizationGates = ["governance review", "schema review", "redaction review", "retention review", "privacy review", "operator review", "rollback review", "failure handling"] as const;

export const y4BlockedStorageWriteModes = ["implicit writes", "approval-as-write", "provider-coupled writes", "runtime-triggered writes"] as const;

export type Y4StorageBoundaryAuthorizationInput = Partial<Record<"governanceReviewReviewed" | "schemaReviewReviewed" | "redactionReviewReviewed" | "retentionReviewReviewed" | "privacyReviewReviewed" | "operatorReviewReviewed" | "rollbackReviewReviewed" | "failureHandlingReviewed", boolean>> & Partial<Record<"implicitWriteRequested" | "approvalAsWriteRequested" | "providerCoupledWriteRequested" | "runtimeTriggeredWriteRequested" | "storageRequested" | "persistenceRequested" | "auditWriteRequested", boolean>>;

export type Y4StorageBoundaryAuthorizationStatus = "storage_boundary_authorization_blocked" | "operator_review_required" | "storage_boundary_authorization_clear";

const requiredReviewAreas: Array<[keyof Y4StorageBoundaryAuthorizationInput, string]> = [["governanceReviewReviewed", "governance review"], ["schemaReviewReviewed", "schema review"], ["redactionReviewReviewed", "redaction review"], ["retentionReviewReviewed", "retention review"], ["privacyReviewReviewed", "privacy review"], ["operatorReviewReviewed", "operator review"], ["rollbackReviewReviewed", "rollback review"], ["failureHandlingReviewed", "failure handling"]];
const blockedRequests: Array<[keyof Y4StorageBoundaryAuthorizationInput, string]> = [["implicitWriteRequested", "implicit writes remain blocked"], ["approvalAsWriteRequested", "approval-as-write remains blocked"], ["providerCoupledWriteRequested", "provider-coupled writes remain blocked"], ["runtimeTriggeredWriteRequested", "runtime-triggered writes remain blocked"], ["storageRequested", "storage remains unauthorized"], ["persistenceRequested", "persistence remains unauthorized"], ["auditWriteRequested", "audit writing remains unauthorized"]];

export function createY4StorageBoundaryAuthorizationPlan(input: Y4StorageBoundaryAuthorizationInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y4StorageBoundaryAuthorizationStatus = blockedReasons.length > 0 ? "storage_boundary_authorization_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "storage_boundary_authorization_clear";
  return {
    phase: "Y4B" as const,
    status,
    flags: y4PlanningFlags,
    planningOnly: true,
    gatesRequired: y4StorageAuthorizationGates,
    blockedWriteModes: y4BlockedStorageWriteModes,
    storageAuthorized: false,
    persistenceAllowedNow: false,
    persistenceWritten: false,
    auditWritingAllowed: false,
    approvalGrantsExecution: false,
    missingReviewAreas,
    blockedReasons,
  };
}
