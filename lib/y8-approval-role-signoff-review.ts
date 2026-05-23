import { y8PlanningFlags } from "./y8-human-approval-package-contents";

export const y8ApprovalRoles = ["governance owner", "privacy reviewer", "security reviewer", "operator lead", "migration reviewer", "rollback reviewer", "legal/compliance placeholder"] as const;

export type Y8ApprovalRoleSignoffInput = Partial<Record<"governanceOwnerReviewed" | "privacyReviewerReviewed" | "securityReviewerReviewed" | "operatorLeadReviewed" | "migrationReviewerReviewed" | "rollbackReviewerReviewed" | "legalComplianceReviewed", boolean>> & Partial<Record<"singleApproverRequested" | "approvalBypassRequested" | "approvalAsExecutionRequested" | "schemaImplementationRequested" | "migrationRequested" | "storageRequested", boolean>>;

export type Y8ApprovalRoleSignoffStatus = "approval_role_signoff_blocked" | "operator_review_required" | "approval_role_signoff_clear";

const requiredReviewAreas: Array<[keyof Y8ApprovalRoleSignoffInput, string]> = [["governanceOwnerReviewed", "governance owner"], ["privacyReviewerReviewed", "privacy reviewer"], ["securityReviewerReviewed", "security reviewer"], ["operatorLeadReviewed", "operator lead"], ["migrationReviewerReviewed", "migration reviewer"], ["rollbackReviewerReviewed", "rollback reviewer"], ["legalComplianceReviewed", "legal/compliance placeholder"]];
const blockedRequests: Array<[keyof Y8ApprovalRoleSignoffInput, string]> = [["singleApproverRequested", "single-approver authorization remains blocked"], ["approvalBypassRequested", "approval bypass remains blocked"], ["approvalAsExecutionRequested", "approval-as-execution remains blocked"], ["schemaImplementationRequested", "schema implementation remains unauthorized"], ["migrationRequested", "migrations remain unauthorized"], ["storageRequested", "storage remains unauthorized"]];

export function createY8ApprovalRoleSignoffReview(input: Y8ApprovalRoleSignoffInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y8ApprovalRoleSignoffStatus = blockedReasons.length > 0 ? "approval_role_signoff_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "approval_role_signoff_clear";
  return {
    phase: "Y8B" as const,
    status,
    flags: y8PlanningFlags,
    planningOnly: true,
    approvalRoles: y8ApprovalRoles,
    singleApproverAllowed: false,
    approvalBypassAllowed: false,
    approvalGrantsExecution: false,
    schemaChangesAuthorized: false,
    migrationsAuthorized: false,
    storageAuthorized: false,
    missingReviewAreas,
    blockedReasons,
  };
}
