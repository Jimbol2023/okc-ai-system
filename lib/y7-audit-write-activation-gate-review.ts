import { y7PlanningFlags } from "./y7-schema-implementation-gate-readiness";

export const y7AuditWriteActivationGateAreas = ["write path disabled", "redaction precondition", "retention precondition", "operator attribution precondition", "failure handling precondition", "storage disable switch concept", "no approval-as-write", "no provider-triggered write", "no runtime-triggered write"] as const;

export type Y7AuditWriteActivationGateInput = Partial<Record<"writeDisabledReviewed" | "redactionPreconditionReviewed" | "retentionPreconditionReviewed" | "operatorAttributionReviewed" | "failureHandlingReviewed" | "disableSwitchReviewed" | "approvalAsWriteBlockedReviewed" | "providerWriteBlockedReviewed" | "runtimeWriteBlockedReviewed", boolean>> & Partial<Record<"auditWriteRequested" | "writePathRequested" | "approvalAsWriteRequested" | "providerWriteRequested" | "runtimeWriteRequested" | "storageRequested", boolean>>;

export type Y7AuditWriteActivationGateStatus = "audit_write_activation_gate_blocked" | "operator_review_required" | "audit_write_activation_gate_clear";

const requiredReviewAreas: Array<[keyof Y7AuditWriteActivationGateInput, string]> = [["writeDisabledReviewed", "write path disabled"], ["redactionPreconditionReviewed", "redaction precondition"], ["retentionPreconditionReviewed", "retention precondition"], ["operatorAttributionReviewed", "operator attribution precondition"], ["failureHandlingReviewed", "failure handling precondition"], ["disableSwitchReviewed", "storage disable switch concept"], ["approvalAsWriteBlockedReviewed", "no approval-as-write"], ["providerWriteBlockedReviewed", "no provider-triggered write"], ["runtimeWriteBlockedReviewed", "no runtime-triggered write"]];
const blockedRequests: Array<[keyof Y7AuditWriteActivationGateInput, string]> = [["auditWriteRequested", "audit writing remains unauthorized"], ["writePathRequested", "write path creation remains blocked"], ["approvalAsWriteRequested", "approval-as-write remains blocked"], ["providerWriteRequested", "provider-triggered writes remain blocked"], ["runtimeWriteRequested", "runtime-triggered writes remain blocked"], ["storageRequested", "storage remains unauthorized"]];

export function createY7AuditWriteActivationGateReview(input: Y7AuditWriteActivationGateInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y7AuditWriteActivationGateStatus = blockedReasons.length > 0 ? "audit_write_activation_gate_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "audit_write_activation_gate_clear";
  return {
    phase: "Y7C" as const,
    status,
    flags: y7PlanningFlags,
    planningOnly: true,
    auditWritingAllowed: false,
    writePathCreationAuthorized: false,
    storageAuthorized: false,
    approvalGrantsExecution: false,
    providerCalled: false,
    runtimeActivationAllowed: false,
    persistenceWritten: false,
    reviewAreas: y7AuditWriteActivationGateAreas,
    missingReviewAreas,
    blockedReasons,
  };
}
