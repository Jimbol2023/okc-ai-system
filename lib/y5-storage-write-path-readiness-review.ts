import { y5PlanningFlags } from "./y5-audit-schema-model-readiness-review";

export const y5StorageWritePathReadinessAreas = ["write path disabled by default", "explicit enablement gate", "redaction precondition", "retention precondition", "operator attribution precondition", "failure behavior precondition", "provider isolation", "runtime isolation", "approval/write separation"] as const;

export type Y5StorageWritePathReadinessInput = Partial<Record<"writeDisabledReviewed" | "explicitEnablementReviewed" | "redactionPreconditionReviewed" | "retentionPreconditionReviewed" | "operatorAttributionReviewed" | "failureBehaviorReviewed" | "providerIsolationReviewed" | "runtimeIsolationReviewed" | "approvalWriteSeparationReviewed", boolean>> & Partial<Record<"writePathRequested" | "implicitWriteRequested" | "approvalAsWriteRequested" | "providerWriteRequested" | "runtimeWriteRequested" | "auditWriteRequested" | "persistenceRequested", boolean>>;

export type Y5StorageWritePathReadinessStatus = "storage_write_path_readiness_blocked" | "operator_review_required" | "storage_write_path_readiness_clear";

const requiredReviewAreas: Array<[keyof Y5StorageWritePathReadinessInput, string]> = [["writeDisabledReviewed", "write path disabled by default"], ["explicitEnablementReviewed", "explicit enablement gate"], ["redactionPreconditionReviewed", "redaction precondition"], ["retentionPreconditionReviewed", "retention precondition"], ["operatorAttributionReviewed", "operator attribution precondition"], ["failureBehaviorReviewed", "failure behavior precondition"], ["providerIsolationReviewed", "provider isolation"], ["runtimeIsolationReviewed", "runtime isolation"], ["approvalWriteSeparationReviewed", "approval/write separation"]];
const blockedRequests: Array<[keyof Y5StorageWritePathReadinessInput, string]> = [["writePathRequested", "write path creation remains unauthorized"], ["implicitWriteRequested", "implicit writes remain blocked"], ["approvalAsWriteRequested", "approval-as-write remains blocked"], ["providerWriteRequested", "provider-coupled writes remain blocked"], ["runtimeWriteRequested", "runtime-triggered writes remain blocked"], ["auditWriteRequested", "audit writing remains unauthorized"], ["persistenceRequested", "persistence remains unauthorized"]];

export function createY5StorageWritePathReadinessReview(input: Y5StorageWritePathReadinessInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y5StorageWritePathReadinessStatus = blockedReasons.length > 0 ? "storage_write_path_readiness_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "storage_write_path_readiness_clear";
  return {
    phase: "Y5C" as const,
    status,
    flags: y5PlanningFlags,
    planningOnly: true,
    writePathCreationAuthorized: false,
    implicitWritesAllowed: false,
    approvalAsWriteAllowed: false,
    providerCoupledWritesAllowed: false,
    runtimeTriggeredWritesAllowed: false,
    auditWritingAllowed: false,
    persistenceAllowedNow: false,
    persistenceWritten: false,
    readinessAreas: y5StorageWritePathReadinessAreas,
    missingReviewAreas,
    blockedReasons,
  };
}
