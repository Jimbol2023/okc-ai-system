import { y6PlanningFlags } from "./y6-audit-schema-draft-fields-review";

export const y6RelationshipBoundaryAreas = ["lead reference placeholders", "operator reference placeholders", "source module references", "related entity references", "no direct provider payload linkage", "no execution coupling", "no approval-as-execution relationship", "no communication send coupling", "no runtime job coupling"] as const;

export type Y6AuditSchemaRelationshipBoundaryInput = Partial<Record<"leadPlaceholdersReviewed" | "operatorPlaceholdersReviewed" | "sourceModuleReferencesReviewed" | "relatedEntityReferencesReviewed" | "providerPayloadLinkageBlockedReviewed" | "executionCouplingBlockedReviewed" | "approvalExecutionRelationshipBlockedReviewed" | "communicationSendCouplingBlockedReviewed" | "runtimeJobCouplingBlockedReviewed", boolean>> & Partial<Record<"providerPayloadLinkRequested" | "executionCouplingRequested" | "approvalExecutionRelationshipRequested" | "communicationSendCouplingRequested" | "runtimeJobCouplingRequested" | "directForeignKeyRequested" | "schemaChangeRequested", boolean>>;

export type Y6AuditSchemaRelationshipBoundaryStatus = "audit_schema_relationship_boundary_blocked" | "operator_review_required" | "audit_schema_relationship_boundary_clear";

const requiredReviewAreas: Array<[keyof Y6AuditSchemaRelationshipBoundaryInput, string]> = [["leadPlaceholdersReviewed", "lead reference placeholders"], ["operatorPlaceholdersReviewed", "operator reference placeholders"], ["sourceModuleReferencesReviewed", "source module references"], ["relatedEntityReferencesReviewed", "related entity references"], ["providerPayloadLinkageBlockedReviewed", "no direct provider payload linkage"], ["executionCouplingBlockedReviewed", "no execution coupling"], ["approvalExecutionRelationshipBlockedReviewed", "no approval-as-execution relationship"], ["communicationSendCouplingBlockedReviewed", "no communication send coupling"], ["runtimeJobCouplingBlockedReviewed", "no runtime job coupling"]];
const blockedRequests: Array<[keyof Y6AuditSchemaRelationshipBoundaryInput, string]> = [["providerPayloadLinkRequested", "direct provider payload linkage remains blocked"], ["executionCouplingRequested", "execution coupling remains blocked"], ["approvalExecutionRelationshipRequested", "approval-as-execution relationship remains blocked"], ["communicationSendCouplingRequested", "communication send coupling remains blocked"], ["runtimeJobCouplingRequested", "runtime job coupling remains blocked"], ["directForeignKeyRequested", "direct operational foreign keys remain blocked"], ["schemaChangeRequested", "schema changes remain unauthorized"]];

export function createY6AuditSchemaRelationshipBoundaryReview(input: Y6AuditSchemaRelationshipBoundaryInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y6AuditSchemaRelationshipBoundaryStatus = blockedReasons.length > 0 ? "audit_schema_relationship_boundary_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "audit_schema_relationship_boundary_clear";
  return {
    phase: "Y6C" as const,
    status,
    flags: y6PlanningFlags,
    planningOnly: true,
    schemaChangesAuthorized: false,
    storageAuthorized: false,
    auditWritingAllowed: false,
    providerPayloadLinkageAllowed: false,
    executionCouplingAllowed: false,
    approvalAsExecutionRelationshipAllowed: false,
    communicationSendCouplingAllowed: false,
    runtimeJobCouplingAllowed: false,
    relationshipAreas: y6RelationshipBoundaryAreas,
    missingReviewAreas,
    blockedReasons,
  };
}
