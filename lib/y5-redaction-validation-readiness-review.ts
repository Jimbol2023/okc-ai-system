import { y5PlanningFlags } from "./y5-audit-schema-model-readiness-review";

export const y5RedactionValidationReadinessAreas = ["phone redaction", "email redaction", "message body exclusion", "seller/buyer note minimization", "provider payload exclusion", "token/secret exclusion", "address minimization", "financial detail minimization", "bounded text validation", "safe enum validation"] as const;

export type Y5RedactionValidationReadinessInput = Partial<Record<"phoneRedactionReviewed" | "emailRedactionReviewed" | "messageBodyExclusionReviewed" | "sellerBuyerNoteMinimizationReviewed" | "providerPayloadExclusionReviewed" | "tokenSecretExclusionReviewed" | "addressMinimizationReviewed" | "financialDetailMinimizationReviewed" | "boundedTextValidationReviewed" | "safeEnumValidationReviewed", boolean>> & Partial<Record<"rawContactStorageRequested" | "messageBodyStorageRequested" | "providerPayloadStorageRequested" | "tokenSecretStorageRequested" | "unboundedTextRequested" | "unsafeEnumRequested" | "auditWriteRequested", boolean>>;

export type Y5RedactionValidationReadinessStatus = "redaction_validation_readiness_blocked" | "operator_review_required" | "redaction_validation_readiness_clear";

const requiredReviewAreas: Array<[keyof Y5RedactionValidationReadinessInput, string]> = [["phoneRedactionReviewed", "phone redaction"], ["emailRedactionReviewed", "email redaction"], ["messageBodyExclusionReviewed", "message body exclusion"], ["sellerBuyerNoteMinimizationReviewed", "seller/buyer note minimization"], ["providerPayloadExclusionReviewed", "provider payload exclusion"], ["tokenSecretExclusionReviewed", "token/secret exclusion"], ["addressMinimizationReviewed", "address minimization"], ["financialDetailMinimizationReviewed", "financial detail minimization"], ["boundedTextValidationReviewed", "bounded text validation"], ["safeEnumValidationReviewed", "safe enum validation"]];
const blockedRequests: Array<[keyof Y5RedactionValidationReadinessInput, string]> = [["rawContactStorageRequested", "raw contact storage remains blocked"], ["messageBodyStorageRequested", "message body storage remains blocked"], ["providerPayloadStorageRequested", "provider payload storage remains blocked"], ["tokenSecretStorageRequested", "token/secret storage remains blocked"], ["unboundedTextRequested", "unbounded text remains blocked"], ["unsafeEnumRequested", "unsafe enum values remain blocked"], ["auditWriteRequested", "audit writing remains unauthorized"]];

export function createY5RedactionValidationReadinessReview(input: Y5RedactionValidationReadinessInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y5RedactionValidationReadinessStatus = blockedReasons.length > 0 ? "redaction_validation_readiness_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "redaction_validation_readiness_clear";
  return {
    phase: "Y5D" as const,
    status,
    flags: y5PlanningFlags,
    planningOnly: true,
    validationImplementationAuthorized: false,
    rawContactStorageAllowed: false,
    messageBodyStorageAllowed: false,
    providerPayloadStorageAllowed: false,
    tokenSecretStorageAllowed: false,
    auditWritingAllowed: false,
    persistenceWritten: false,
    persistenceAllowedNow: false,
    readinessAreas: y5RedactionValidationReadinessAreas,
    missingReviewAreas,
    blockedReasons,
  };
}
