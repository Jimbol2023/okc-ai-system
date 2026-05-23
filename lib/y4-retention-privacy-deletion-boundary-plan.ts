import { y4PlanningFlags } from "./y4-future-audit-schema-concept-plan";

export const y4RetentionPrivacyDeletionAreas = ["retention categories", "immutable governance traces", "editable notes separation", "privacy minimization", "seller/buyer protection", "export/archive review", "legal hold review"] as const;

export const y4RetentionBoundaryCategories = ["operational review", "governance trace", "incident review", "legal hold candidate", "archive candidate"] as const;

export type Y4RetentionPrivacyDeletionBoundaryInput = Partial<Record<"retentionCategoriesReviewed" | "immutableGovernanceTracesReviewed" | "editableNotesSeparationReviewed" | "privacyMinimizationReviewed" | "sellerBuyerProtectionReviewed" | "exportArchiveReviewed" | "legalHoldReviewed", boolean>> & Partial<Record<"deletionImplementationRequested" | "exportImplementationRequested" | "archiveImplementationRequested" | "legalHoldImplementationRequested" | "storageRequested" | "auditWriteRequested", boolean>>;

export type Y4RetentionPrivacyDeletionBoundaryStatus = "retention_privacy_deletion_boundary_blocked" | "operator_review_required" | "retention_privacy_deletion_boundary_clear";

const requiredReviewAreas: Array<[keyof Y4RetentionPrivacyDeletionBoundaryInput, string]> = [["retentionCategoriesReviewed", "retention categories"], ["immutableGovernanceTracesReviewed", "immutable governance traces"], ["editableNotesSeparationReviewed", "editable notes separation"], ["privacyMinimizationReviewed", "privacy minimization"], ["sellerBuyerProtectionReviewed", "seller/buyer protection"], ["exportArchiveReviewed", "export/archive review"], ["legalHoldReviewed", "legal hold review"]];
const blockedRequests: Array<[keyof Y4RetentionPrivacyDeletionBoundaryInput, string]> = [["deletionImplementationRequested", "deletion implementation remains blocked"], ["exportImplementationRequested", "export implementation remains blocked"], ["archiveImplementationRequested", "archive implementation remains blocked"], ["legalHoldImplementationRequested", "legal hold implementation remains blocked"], ["storageRequested", "storage remains unauthorized"], ["auditWriteRequested", "audit writing remains unauthorized"]];

export function createY4RetentionPrivacyDeletionBoundaryPlan(input: Y4RetentionPrivacyDeletionBoundaryInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y4RetentionPrivacyDeletionBoundaryStatus = blockedReasons.length > 0 ? "retention_privacy_deletion_boundary_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "retention_privacy_deletion_boundary_clear";
  return {
    phase: "Y4D" as const,
    status,
    flags: y4PlanningFlags,
    planningOnly: true,
    retentionCategories: y4RetentionBoundaryCategories,
    immutableGovernanceTracesRequired: true,
    editableNotesSeparateFromAudit: true,
    privacyMinimizationRequired: true,
    sellerBuyerProtectionRequired: true,
    implementationCreated: false,
    storageAuthorized: false,
    auditWritingAllowed: false,
    persistenceWritten: false,
    persistenceAllowedNow: false,
    reviewAreas: y4RetentionPrivacyDeletionAreas,
    missingReviewAreas,
    blockedReasons,
  };
}
