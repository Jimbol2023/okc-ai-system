import { y3PlanningFlags } from "./y3-minimum-viable-audit-memory-plan";

export const y3AuditRecordShapeReviewAreas = ["event type", "event status", "source module", "actor placeholder", "lead placeholder", "decision label", "risk level", "governance flags", "approval state", "execution state", "provider state", "redacted summary", "bounded notes", "created-at placeholder", "redaction requirements"] as const;

export const y3PlannedAuditRecordFields = ["eventType", "eventStatus", "sourceModule", "actorType", "actorIdPlaceholder", "leadIdPlaceholder", "decisionLabel", "riskLevel", "governanceFlags", "approvalState", "executionState", "providerState", "redactedSummary", "boundedNotes", "createdAtPlaceholder"] as const;

export const y3RedactionCategories = ["phone numbers", "emails", "message bodies", "seller private notes", "provider credentials", "tokens/secrets", "full addresses when unnecessary", "financial details when unnecessary", "personal/private context"] as const;

export type Y3AuditRecordShapeRedactionInput = Partial<Record<"eventTypeReviewed" | "eventStatusReviewed" | "sourceModuleReviewed" | "actorPlaceholderReviewed" | "leadPlaceholderReviewed" | "decisionLabelReviewed" | "riskLevelReviewed" | "governanceFlagsReviewed" | "approvalStateReviewed" | "executionStateReviewed" | "providerStateReviewed" | "redactedSummaryReviewed" | "boundedNotesReviewed" | "createdAtPlaceholderReviewed" | "redactionRequirementsReviewed", boolean>> & Partial<Record<"schemaChangeRequested" | "migrationRequested" | "prismaModelRequested" | "dbWriteRequested" | "persistenceRouteRequested" | "auditRouteRequested" | "auditWriteRequested", boolean>>;

export type Y3AuditRecordShapeRedactionStatus = "audit_record_shape_redaction_blocked" | "operator_review_required" | "audit_record_shape_redaction_clear";

const requiredReviewAreas: Array<[keyof Y3AuditRecordShapeRedactionInput, string]> = [["eventTypeReviewed", "event type"], ["eventStatusReviewed", "event status"], ["sourceModuleReviewed", "source module"], ["actorPlaceholderReviewed", "actor placeholder"], ["leadPlaceholderReviewed", "lead placeholder"], ["decisionLabelReviewed", "decision label"], ["riskLevelReviewed", "risk level"], ["governanceFlagsReviewed", "governance flags"], ["approvalStateReviewed", "approval state"], ["executionStateReviewed", "execution state"], ["providerStateReviewed", "provider state"], ["redactedSummaryReviewed", "redacted summary"], ["boundedNotesReviewed", "bounded notes"], ["createdAtPlaceholderReviewed", "created-at placeholder"], ["redactionRequirementsReviewed", "redaction requirements"]];
const blockedRequests: Array<[keyof Y3AuditRecordShapeRedactionInput, string]> = [["schemaChangeRequested", "schema changes remain blocked"], ["migrationRequested", "migrations remain blocked"], ["prismaModelRequested", "Prisma models remain blocked"], ["dbWriteRequested", "DB writes remain blocked"], ["persistenceRouteRequested", "persistence routes remain blocked"], ["auditRouteRequested", "audit routes remain blocked"], ["auditWriteRequested", "audit writing remains blocked"]];

export function createY3AuditRecordShapeRedactionPlan(input: Y3AuditRecordShapeRedactionInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y3AuditRecordShapeRedactionStatus = blockedReasons.length > 0 ? "audit_record_shape_redaction_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "audit_record_shape_redaction_clear";
  return {
    phase: "Y3B" as const,
    status,
    flags: y3PlanningFlags,
    planningOnly: true,
    auditWritingAllowed: false,
    persistenceAllowedNow: false,
    persistenceWritten: false,
    schemaAuthorized: false,
    migrationsAuthorized: false,
    prismaModelAuthorized: false,
    routeCreationAuthorized: false,
    plannedFields: y3PlannedAuditRecordFields,
    redactionCategories: y3RedactionCategories,
    reviewAreas: y3AuditRecordShapeReviewAreas,
    redactionPolicy: "store only bounded summaries and placeholders until future schema, privacy, and retention reviews authorize otherwise",
    missingReviewAreas,
    blockedReasons,
  };
}
