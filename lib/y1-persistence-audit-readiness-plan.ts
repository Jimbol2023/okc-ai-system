import { y1PlanningFlags } from "./y1-activation-eligibility-roi-gate";

export const y1PersistenceAuditReadinessAreas = ["future record needs", "redaction needs", "bounded record scope", "immutable record needs", "manual-review-only records", "retention policy needs", "audit event shape needs", "unsafe execution record risk", "persistence activation blockers", "schema/migration readiness blockers"] as const;

export type Y1PersistenceAuditInput = Partial<Record<"recordsReviewed" | "redactionReviewed" | "boundedScopeReviewed" | "immutableReviewed" | "manualReviewRecordsReviewed" | "retentionReviewed" | "auditShapeReviewed" | "unsafeExecutionRecordReviewed" | "persistenceBlockersReviewed" | "schemaMigrationBlockersReviewed", boolean>> & Partial<Record<"schemaChangeRequested" | "migrationRequested" | "dbWriteRequested" | "persistenceRouteRequested" | "auditRouteRequested", boolean>>;
export type Y1PersistenceAuditStatus = "persistence_audit_blocked" | "operator_review_required" | "persistence_audit_review_clear";

const requiredReadinessAreas: Array<[keyof Y1PersistenceAuditInput, string]> = [["recordsReviewed", "future record needs"], ["redactionReviewed", "redaction needs"], ["boundedScopeReviewed", "bounded record scope"], ["immutableReviewed", "immutable record needs"], ["manualReviewRecordsReviewed", "manual-review-only records"], ["retentionReviewed", "retention policy needs"], ["auditShapeReviewed", "audit event shape needs"], ["unsafeExecutionRecordReviewed", "unsafe execution record risk"], ["persistenceBlockersReviewed", "persistence activation blockers"], ["schemaMigrationBlockersReviewed", "schema/migration readiness blockers"]];
const blockedRequests: Array<[keyof Y1PersistenceAuditInput, string]> = [["schemaChangeRequested", "Prisma schema changes remain blocked"], ["migrationRequested", "migrations remain blocked"], ["dbWriteRequested", "DB writes remain blocked"], ["persistenceRouteRequested", "persistence routes remain blocked"], ["auditRouteRequested", "audit routes remain blocked"]];

export function createY1PersistenceAuditReadinessPlan(input: Y1PersistenceAuditInput = {}) {
  const missingReadinessAreas = requiredReadinessAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y1PersistenceAuditStatus = blockedReasons.length > 0 ? "persistence_audit_blocked" : missingReadinessAreas.length > 0 ? "operator_review_required" : "persistence_audit_review_clear";
  return { phase: "Y1D" as const, status, flags: y1PlanningFlags, readinessAreas: y1PersistenceAuditReadinessAreas, persistenceWritten: false, persistenceAllowedNow: false, auditWritingAllowed: false, planningOnly: true, missingReadinessAreas, blockedReasons };
}
