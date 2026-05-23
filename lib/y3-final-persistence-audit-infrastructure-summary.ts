import { createY3AuditRecordShapeRedactionPlan } from "./y3-audit-record-shape-redaction-plan";
import { createY3ExecutionReconstructionIncidentReviewPlan } from "./y3-execution-reconstruction-incident-review-plan";
import { createY3MinimumViableAuditMemoryPlan, y3PlanningFlags } from "./y3-minimum-viable-audit-memory-plan";
import { createY3PersistenceBoundaryFailClosedPlan } from "./y3-persistence-boundary-fail-closed-plan";
import { createY3RetentionImmutabilityPrivacyPlan } from "./y3-retention-immutability-privacy-plan";

export type Y3FinalPersistenceAuditInfrastructureSummaryInput = Partial<Record<"minimumAuditMemoryReviewed" | "recordShapeReviewed" | "redactionReviewed" | "persistenceBoundaryReviewed" | "retentionPrivacyReviewed" | "incidentReviewReviewed" | "schemaPlanningNeedsReviewed" | "migrationPlanningNeedsReviewed" | "governanceRequirementsReviewed" | "recommendedNextStepReviewed", boolean>> & Partial<Record<"persistenceRequested" | "auditWritingRequested" | "schemaRequested" | "migrationRequested" | "providerRequested" | "communicationRequested" | "runtimeRequested", boolean>>;

export type Y3FinalPersistenceAuditInfrastructureSummaryStatus = "final_persistence_audit_summary_blocked" | "operator_review_required" | "final_persistence_audit_summary_clear";

const requiredReviewAreas: Array<[keyof Y3FinalPersistenceAuditInfrastructureSummaryInput, string]> = [["minimumAuditMemoryReviewed", "minimum viable audit memory"], ["recordShapeReviewed", "record shape readiness"], ["redactionReviewed", "redaction readiness"], ["persistenceBoundaryReviewed", "persistence boundary readiness"], ["retentionPrivacyReviewed", "retention/privacy readiness"], ["incidentReviewReviewed", "incident review readiness"], ["schemaPlanningNeedsReviewed", "future schema planning needs"], ["migrationPlanningNeedsReviewed", "future migration planning needs"], ["governanceRequirementsReviewed", "future governance requirements"], ["recommendedNextStepReviewed", "recommended next step"]];
const blockedRequests: Array<[keyof Y3FinalPersistenceAuditInfrastructureSummaryInput, string]> = [["persistenceRequested", "persistence remains unauthorized"], ["auditWritingRequested", "audit writing remains unauthorized"], ["schemaRequested", "schema changes remain unauthorized"], ["migrationRequested", "migrations remain unauthorized"], ["providerRequested", "provider activation remains blocked"], ["communicationRequested", "communication activation remains blocked"], ["runtimeRequested", "runtime activation remains blocked"]];

export function createY3FinalPersistenceAuditInfrastructureSummary(input: Y3FinalPersistenceAuditInfrastructureSummaryInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y3FinalPersistenceAuditInfrastructureSummaryStatus = blockedReasons.length > 0 ? "final_persistence_audit_summary_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "final_persistence_audit_summary_clear";
  return {
    phase: "Y3F" as const,
    status,
    flags: y3PlanningFlags,
    planningOnly: true,
    auditWritingAllowed: false,
    persistenceAllowedNow: false,
    persistenceWritten: false,
    persistenceAuthorized: false,
    schemaAuthorized: false,
    migrationsAuthorized: false,
    providerActivationAllowed: false,
    communicationActivationAllowed: false,
    runtimeActivationAllowed: false,
    minimumViableAuditMemory: createY3MinimumViableAuditMemoryPlan(),
    recordShapeReadiness: createY3AuditRecordShapeRedactionPlan(),
    persistenceBoundaryReadiness: createY3PersistenceBoundaryFailClosedPlan(),
    retentionPrivacyReadiness: createY3RetentionImmutabilityPrivacyPlan(),
    incidentReviewReadiness: createY3ExecutionReconstructionIncidentReviewPlan(),
    unresolvedBlockers: ["schema planning not authorized", "migration planning not authorized", "audit storage not authorized", "provider activation remains premature", "manual revenue operations remain primary"],
    futureSchemaPlanningNeeds: ["review minimal audit model shape", "review redaction enforcement boundary", "review immutable trace fields before any Prisma change"],
    futureMigrationPlanningNeeds: ["separate migration planning phase", "rollback review before migration creation", "no migration execution without later approval"],
    futureGovernanceRequirements: ["human review remains required", "approval must not grant execution", "provider and communication activation require separate future phases"],
    recommendedNextStep: "Y4 - Audit Schema / Storage Boundary Planning",
    recommendedNextStepPlanningOnly: true,
    activationStillBlockedAfterY3: true,
    missingReviewAreas,
    blockedReasons,
  };
}
