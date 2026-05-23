import { createY7AuditWriteActivationGateReview } from "./y7-audit-write-activation-gate-review";
import { createY7MigrationExecutionGateReview } from "./y7-migration-execution-gate-review";
import { createY7OperationalReadinessGateReview } from "./y7-operational-readiness-gate-review";
import { createY7SchemaImplementationGateReadiness, y7PlanningFlags } from "./y7-schema-implementation-gate-readiness";
import { createY7SecurityPrivacyComplianceGateReview } from "./y7-security-privacy-compliance-gate-review";

export type Y7FinalAuditSchemaImplementationGateSummaryInput = Partial<Record<"schemaGateReviewed" | "migrationGateReviewed" | "auditWriteGateReviewed" | "securityPrivacyGateReviewed" | "operationalGateReviewed" | "unresolvedBlockersReviewed" | "recommendedNextStepReviewed", boolean>> & Partial<Record<"schemaImplementationRequested" | "migrationRequested" | "storageRequested" | "auditWritingRequested" | "providerRequested" | "runtimeRequested" | "executionRequested" | "productionRequested", boolean>>;

export type Y7FinalAuditSchemaImplementationGateSummaryStatus = "final_audit_schema_implementation_gate_blocked" | "operator_review_required" | "final_audit_schema_implementation_gate_clear";

const requiredReviewAreas: Array<[keyof Y7FinalAuditSchemaImplementationGateSummaryInput, string]> = [["schemaGateReviewed", "schema implementation gate"], ["migrationGateReviewed", "migration execution gate"], ["auditWriteGateReviewed", "audit write activation gate"], ["securityPrivacyGateReviewed", "security privacy compliance gate"], ["operationalGateReviewed", "operational readiness gate"], ["unresolvedBlockersReviewed", "unresolved blockers"], ["recommendedNextStepReviewed", "recommended next step"]];
const blockedRequests: Array<[keyof Y7FinalAuditSchemaImplementationGateSummaryInput, string]> = [["schemaImplementationRequested", "schema implementation remains unauthorized"], ["migrationRequested", "migrations remain unauthorized"], ["storageRequested", "storage remains unauthorized"], ["auditWritingRequested", "audit writing remains unauthorized"], ["providerRequested", "provider activation remains blocked"], ["runtimeRequested", "runtime activation remains blocked"], ["executionRequested", "execution remains blocked"], ["productionRequested", "production rollout remains blocked"]];

export function createY7FinalAuditSchemaImplementationGateSummary(input: Y7FinalAuditSchemaImplementationGateSummaryInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y7FinalAuditSchemaImplementationGateSummaryStatus = blockedReasons.length > 0 ? "final_audit_schema_implementation_gate_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "final_audit_schema_implementation_gate_clear";
  return {
    phase: "Y7F" as const,
    status,
    flags: y7PlanningFlags,
    planningOnly: true,
    schemaImplementationAuthorized: false,
    schemaChangesAuthorized: false,
    migrationsAuthorized: false,
    storageAuthorized: false,
    auditWritingAllowed: false,
    persistenceAllowedNow: false,
    persistenceWritten: false,
    providerActivationAllowed: false,
    runtimeActivationAllowed: false,
    executionAllowed: false,
    productionRolloutAllowed: false,
    schemaGate: createY7SchemaImplementationGateReadiness(),
    migrationGate: createY7MigrationExecutionGateReview(),
    auditWriteGate: createY7AuditWriteActivationGateReview(),
    securityPrivacyGate: createY7SecurityPrivacyComplianceGateReview(),
    operationalGate: createY7OperationalReadinessGateReview(),
    unresolvedBlockers: ["implementation gate remains closed", "migration execution remains blocked", "audit writing remains unauthorized", "storage activation remains blocked", "runtime/provider/execution activation remains blocked"],
    recommendedNextStep: "Y8 - Pre-Implementation Human Approval Package",
    recommendedNextStepPlanningOnly: true,
    y8Justified: true,
    missingReviewAreas,
    blockedReasons,
  };
}
