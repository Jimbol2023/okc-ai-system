import { y6PlanningFlags } from "./y6-audit-schema-draft-fields-review";

export const y6AuditSchemaQueryNeeds = ["governance review history", "blocked event history", "operator review history", "DNC/opt-out gate visibility", "incident reconstruction", "rollback review", "readiness review", "risk-level filtering"] as const;

export const y6BlockedQueryPatterns = ["surveillance-style tracking", "unbounded search logs", "raw communication search", "provider payload search", "sensitive-data search"] as const;

export type Y6AuditSchemaQueryabilityInput = Partial<Record<"governanceHistoryReviewed" | "blockedEventHistoryReviewed" | "operatorReviewHistoryReviewed" | "dncOptOutVisibilityReviewed" | "incidentReconstructionReviewed" | "rollbackReviewReviewed" | "readinessReviewReviewed" | "riskFilteringReviewed", boolean>> & Partial<Record<"surveillanceTrackingRequested" | "unboundedSearchLogRequested" | "rawCommunicationSearchRequested" | "providerPayloadSearchRequested" | "sensitiveDataSearchRequested" | "storageRequested" | "schemaChangeRequested", boolean>>;

export type Y6AuditSchemaQueryabilityStatus = "audit_schema_queryability_blocked" | "operator_review_required" | "audit_schema_queryability_clear";

const requiredReviewAreas: Array<[keyof Y6AuditSchemaQueryabilityInput, string]> = [["governanceHistoryReviewed", "governance review history"], ["blockedEventHistoryReviewed", "blocked event history"], ["operatorReviewHistoryReviewed", "operator review history"], ["dncOptOutVisibilityReviewed", "DNC/opt-out gate visibility"], ["incidentReconstructionReviewed", "incident reconstruction"], ["rollbackReviewReviewed", "rollback review"], ["readinessReviewReviewed", "readiness review"], ["riskFilteringReviewed", "risk-level filtering"]];
const blockedRequests: Array<[keyof Y6AuditSchemaQueryabilityInput, string]> = [["surveillanceTrackingRequested", "surveillance-style tracking remains blocked"], ["unboundedSearchLogRequested", "unbounded search logs remain blocked"], ["rawCommunicationSearchRequested", "raw communication search remains blocked"], ["providerPayloadSearchRequested", "provider payload search remains blocked"], ["sensitiveDataSearchRequested", "sensitive-data search remains blocked"], ["storageRequested", "storage remains unauthorized"], ["schemaChangeRequested", "schema changes remain unauthorized"]];

export function createY6AuditSchemaQueryabilityReview(input: Y6AuditSchemaQueryabilityInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y6AuditSchemaQueryabilityStatus = blockedReasons.length > 0 ? "audit_schema_queryability_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "audit_schema_queryability_clear";
  return {
    phase: "Y6D" as const,
    status,
    flags: y6PlanningFlags,
    planningOnly: true,
    queryNeeds: y6AuditSchemaQueryNeeds,
    blockedQueryPatterns: y6BlockedQueryPatterns,
    surveillanceTrackingAllowed: false,
    rawCommunicationSearchAllowed: false,
    providerPayloadSearchAllowed: false,
    sensitiveDataSearchAllowed: false,
    schemaChangesAuthorized: false,
    storageAuthorized: false,
    auditWritingAllowed: false,
    missingReviewAreas,
    blockedReasons,
  };
}
