import { y6PlanningFlags } from "./y6-audit-schema-draft-fields-review";

export const y6AuditSchemaMinimizationAreas = ["minimum viable fields", "data minimization", "privacy risk", "sensitive data avoidance", "no raw message bodies", "no raw provider payloads", "no credentials/secrets", "no unrestricted free-form logs", "bounded text only", "bounded arrays only", "safe enums only"] as const;

export type Y6AuditSchemaMinimizationInput = Partial<Record<"minimumFieldsReviewed" | "dataMinimizationReviewed" | "privacyRiskReviewed" | "sensitiveDataAvoidanceReviewed" | "rawMessageBodiesBlockedReviewed" | "rawProviderPayloadsBlockedReviewed" | "credentialsSecretsBlockedReviewed" | "freeFormLogsBlockedReviewed" | "boundedTextReviewed" | "boundedArraysReviewed" | "safeEnumsReviewed", boolean>> & Partial<Record<"rawMessageBodyRequested" | "rawProviderPayloadRequested" | "credentialSecretRequested" | "unrestrictedLogRequested" | "unboundedTextRequested" | "unboundedArrayRequested" | "unsafeEnumRequested" | "schemaChangeRequested", boolean>>;

export type Y6AuditSchemaMinimizationStatus = "audit_schema_minimization_blocked" | "operator_review_required" | "audit_schema_minimization_clear";

const requiredReviewAreas: Array<[keyof Y6AuditSchemaMinimizationInput, string]> = [["minimumFieldsReviewed", "minimum viable fields"], ["dataMinimizationReviewed", "data minimization"], ["privacyRiskReviewed", "privacy risk"], ["sensitiveDataAvoidanceReviewed", "sensitive data avoidance"], ["rawMessageBodiesBlockedReviewed", "no raw message bodies"], ["rawProviderPayloadsBlockedReviewed", "no raw provider payloads"], ["credentialsSecretsBlockedReviewed", "no credentials/secrets"], ["freeFormLogsBlockedReviewed", "no unrestricted free-form logs"], ["boundedTextReviewed", "bounded text only"], ["boundedArraysReviewed", "bounded arrays only"], ["safeEnumsReviewed", "safe enums only"]];
const blockedRequests: Array<[keyof Y6AuditSchemaMinimizationInput, string]> = [["rawMessageBodyRequested", "raw message bodies remain blocked"], ["rawProviderPayloadRequested", "raw provider payloads remain blocked"], ["credentialSecretRequested", "credentials/secrets remain blocked"], ["unrestrictedLogRequested", "unrestricted free-form logs remain blocked"], ["unboundedTextRequested", "unbounded text remains blocked"], ["unboundedArrayRequested", "unbounded arrays remain blocked"], ["unsafeEnumRequested", "unsafe enums remain blocked"], ["schemaChangeRequested", "schema changes remain unauthorized"]];

export function createY6AuditSchemaMinimizationReview(input: Y6AuditSchemaMinimizationInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y6AuditSchemaMinimizationStatus = blockedReasons.length > 0 ? "audit_schema_minimization_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "audit_schema_minimization_clear";
  return {
    phase: "Y6B" as const,
    status,
    flags: y6PlanningFlags,
    planningOnly: true,
    schemaChangesAuthorized: false,
    storageAuthorized: false,
    auditWritingAllowed: false,
    persistenceWritten: false,
    persistenceAllowedNow: false,
    minimizationAreas: y6AuditSchemaMinimizationAreas,
    rawSensitiveDataAllowed: false,
    unrestrictedLogsAllowed: false,
    boundedShapesRequired: true,
    safeEnumsRequired: true,
    missingReviewAreas,
    blockedReasons,
  };
}
