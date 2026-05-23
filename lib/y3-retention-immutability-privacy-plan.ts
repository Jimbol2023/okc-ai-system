import { y3PlanningFlags } from "./y3-minimum-viable-audit-memory-plan";

export const y3RetentionPrivacyReviewAreas = ["retention period categories", "deletion concepts", "immutable governance traces", "editable notes separation", "privacy minimization", "sensitive data avoidance", "operator accountability", "seller privacy protection", "buyer privacy protection", "compliance review requirements", "future export/archive concepts"] as const;

export const y3RetentionCategories = ["short operational review", "governance trace", "incident review", "compliance hold candidate", "archive candidate"] as const;

export type Y3RetentionImmutabilityPrivacyInput = Partial<Record<"retentionCategoriesReviewed" | "deletionConceptsReviewed" | "immutableGovernanceReviewed" | "editableNotesReviewed" | "privacyMinimizationReviewed" | "sensitiveDataAvoidanceReviewed" | "operatorAccountabilityReviewed" | "sellerPrivacyReviewed" | "buyerPrivacyReviewed" | "complianceReviewReviewed" | "exportArchiveReviewed", boolean>> & Partial<Record<"deletionImplementationRequested" | "exportImplementationRequested" | "storageRequested" | "auditTableRequested" | "privacyRouteRequested" | "dbWriteRequested" | "auditWriteRequested", boolean>>;

export type Y3RetentionImmutabilityPrivacyStatus = "retention_immutability_privacy_blocked" | "operator_review_required" | "retention_immutability_privacy_clear";

const requiredReviewAreas: Array<[keyof Y3RetentionImmutabilityPrivacyInput, string]> = [["retentionCategoriesReviewed", "retention period categories"], ["deletionConceptsReviewed", "deletion concepts"], ["immutableGovernanceReviewed", "immutable governance traces"], ["editableNotesReviewed", "editable notes separation"], ["privacyMinimizationReviewed", "privacy minimization"], ["sensitiveDataAvoidanceReviewed", "sensitive data avoidance"], ["operatorAccountabilityReviewed", "operator accountability"], ["sellerPrivacyReviewed", "seller privacy protection"], ["buyerPrivacyReviewed", "buyer privacy protection"], ["complianceReviewReviewed", "compliance review requirements"], ["exportArchiveReviewed", "future export/archive concepts"]];
const blockedRequests: Array<[keyof Y3RetentionImmutabilityPrivacyInput, string]> = [["deletionImplementationRequested", "deletion implementation remains blocked"], ["exportImplementationRequested", "export implementation remains blocked"], ["storageRequested", "storage remains blocked"], ["auditTableRequested", "audit tables remain blocked"], ["privacyRouteRequested", "privacy routes remain blocked"], ["dbWriteRequested", "DB writes remain blocked"], ["auditWriteRequested", "audit writing remains blocked"]];

export function createY3RetentionImmutabilityPrivacyPlan(input: Y3RetentionImmutabilityPrivacyInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y3RetentionImmutabilityPrivacyStatus = blockedReasons.length > 0 ? "retention_immutability_privacy_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "retention_immutability_privacy_clear";
  return {
    phase: "Y3D" as const,
    status,
    flags: y3PlanningFlags,
    planningOnly: true,
    auditWritingAllowed: false,
    persistenceAllowedNow: false,
    persistenceWritten: false,
    retentionCategories: y3RetentionCategories,
    editableNotesSeparateFromImmutableAudit: true,
    immutableGovernanceTraceRequired: true,
    privacyMinimizationRequired: true,
    sensitiveDataAvoidanceRequired: true,
    sellerPrivacyProtectionRequired: true,
    buyerPrivacyProtectionRequired: true,
    complianceReviewRequired: true,
    deletionImplemented: false,
    exportsImplemented: false,
    storageImplemented: false,
    auditTablesImplemented: false,
    privacyRoutesImplemented: false,
    reviewAreas: y3RetentionPrivacyReviewAreas,
    missingReviewAreas,
    blockedReasons,
  };
}
