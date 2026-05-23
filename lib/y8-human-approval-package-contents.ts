export const y8PlanningFlags = {
  readOnly: true,
  advisoryOnly: true,
  humanReviewOnly: true,
  simulationOnly: true,
  providerCalled: false,
  sent: false,
  persistenceWritten: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  providerActivationAllowed: false,
  approvalGrantsExecution: false,
  schemaChangesAuthorized: false,
  migrationsAuthorized: false,
  storageAuthorized: false,
  auditWritingAllowed: false,
} as const;

export const y8ApprovalPackageContents = ["Y6 schema draft summary", "Y7 gate summary", "field classification summary", "redaction requirements", "retention requirements", "relationship boundaries", "queryability boundaries", "rollback expectations", "unresolved blockers", "explicit non-authorization statement"] as const;

export type Y8HumanApprovalPackageContentsInput = Partial<Record<"schemaDraftSummaryReviewed" | "gateSummaryReviewed" | "fieldClassificationReviewed" | "redactionRequirementsReviewed" | "retentionRequirementsReviewed" | "relationshipBoundariesReviewed" | "queryabilityBoundariesReviewed" | "rollbackExpectationsReviewed" | "unresolvedBlockersReviewed" | "nonAuthorizationReviewed", boolean>> & Partial<Record<"schemaImplementationRequested" | "migrationRequested" | "storageRequested" | "auditWriteRequested" | "executionRequested", boolean>>;

export type Y8HumanApprovalPackageContentsStatus = "human_approval_package_contents_blocked" | "operator_review_required" | "human_approval_package_contents_clear";

const requiredReviewAreas: Array<[keyof Y8HumanApprovalPackageContentsInput, string]> = [["schemaDraftSummaryReviewed", "Y6 schema draft summary"], ["gateSummaryReviewed", "Y7 gate summary"], ["fieldClassificationReviewed", "field classification summary"], ["redactionRequirementsReviewed", "redaction requirements"], ["retentionRequirementsReviewed", "retention requirements"], ["relationshipBoundariesReviewed", "relationship boundaries"], ["queryabilityBoundariesReviewed", "queryability boundaries"], ["rollbackExpectationsReviewed", "rollback expectations"], ["unresolvedBlockersReviewed", "unresolved blockers"], ["nonAuthorizationReviewed", "explicit non-authorization statement"]];
const blockedRequests: Array<[keyof Y8HumanApprovalPackageContentsInput, string]> = [["schemaImplementationRequested", "schema implementation remains unauthorized"], ["migrationRequested", "migrations remain unauthorized"], ["storageRequested", "storage remains unauthorized"], ["auditWriteRequested", "audit writing remains unauthorized"], ["executionRequested", "execution remains blocked"]];

export function createY8HumanApprovalPackageContents(input: Y8HumanApprovalPackageContentsInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y8HumanApprovalPackageContentsStatus = blockedReasons.length > 0 ? "human_approval_package_contents_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "human_approval_package_contents_clear";
  return {
    phase: "Y8A" as const,
    status,
    flags: y8PlanningFlags,
    planningOnly: true,
    packageContents: y8ApprovalPackageContents,
    schemaChangesAuthorized: false,
    migrationsAuthorized: false,
    storageAuthorized: false,
    auditWritingAllowed: false,
    persistenceWritten: false,
    persistenceAllowedNow: false,
    approvalGrantsExecution: false,
    missingReviewAreas,
    blockedReasons,
  };
}
