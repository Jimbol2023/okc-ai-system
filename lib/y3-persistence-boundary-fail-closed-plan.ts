import { y3PlanningFlags } from "./y3-minimum-viable-audit-memory-plan";

export const y3PersistenceBoundaryReviewAreas = ["write-disabled default", "explicit future enablement", "governance gate", "schema review", "redaction review", "retention review", "operator review", "failure handling", "rollback support", "provider isolation", "execution isolation", "approval/execution separation"] as const;

export type Y3PersistenceBoundaryFailClosedInput = Partial<Record<"writeDisabledDefaultReviewed" | "explicitEnablementReviewed" | "governanceGateReviewed" | "schemaReviewReviewed" | "redactionReviewReviewed" | "retentionReviewReviewed" | "operatorReviewReviewed" | "failureHandlingReviewed" | "rollbackSupportReviewed" | "providerIsolationReviewed" | "executionIsolationReviewed" | "approvalExecutionSeparationReviewed", boolean>> & Partial<Record<"persistenceEnablementRequested" | "dbWriteRequested" | "auditWriteRequested" | "providerCouplingRequested" | "executionCouplingRequested" | "approvalAsExecutionRequested" | "runtimeRequested" | "providerRequested", boolean>>;

export type Y3PersistenceBoundaryFailClosedStatus = "persistence_boundary_fail_closed_blocked" | "operator_review_required" | "persistence_boundary_fail_closed_clear";

const requiredReviewAreas: Array<[keyof Y3PersistenceBoundaryFailClosedInput, string]> = [["writeDisabledDefaultReviewed", "write-disabled default"], ["explicitEnablementReviewed", "explicit future enablement"], ["governanceGateReviewed", "governance gate"], ["schemaReviewReviewed", "schema review"], ["redactionReviewReviewed", "redaction review"], ["retentionReviewReviewed", "retention review"], ["operatorReviewReviewed", "operator review"], ["failureHandlingReviewed", "failure handling"], ["rollbackSupportReviewed", "rollback support"], ["providerIsolationReviewed", "provider isolation"], ["executionIsolationReviewed", "execution isolation"], ["approvalExecutionSeparationReviewed", "approval/execution separation"]];
const blockedRequests: Array<[keyof Y3PersistenceBoundaryFailClosedInput, string]> = [["persistenceEnablementRequested", "persistence enablement remains blocked"], ["dbWriteRequested", "DB writes remain blocked"], ["auditWriteRequested", "audit writing remains blocked"], ["providerCouplingRequested", "provider coupling remains blocked"], ["executionCouplingRequested", "execution coupling remains blocked"], ["approvalAsExecutionRequested", "approval-as-execution remains blocked"], ["runtimeRequested", "runtime activation remains blocked"], ["providerRequested", "provider activation remains blocked"]];

export function createY3PersistenceBoundaryFailClosedPlan(input: Y3PersistenceBoundaryFailClosedInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y3PersistenceBoundaryFailClosedStatus = blockedReasons.length > 0 ? "persistence_boundary_fail_closed_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "persistence_boundary_fail_closed_clear";
  return {
    phase: "Y3C" as const,
    status,
    flags: y3PlanningFlags,
    planningOnly: true,
    auditWritingAllowed: false,
    persistenceAllowedNow: false,
    persistenceWritten: false,
    writeDisabledByDefault: true,
    explicitFutureEnablementRequired: true,
    governanceGateRequired: true,
    schemaReviewRequired: true,
    redactionReviewRequired: true,
    retentionReviewRequired: true,
    operatorReviewRequired: true,
    failureHandlingRequired: true,
    rollbackSupportRequired: true,
    providerCalled: false,
    runtimeActivationAllowed: false,
    approvalGrantsExecution: false,
    providerCouplingAllowed: false,
    executionCouplingAllowed: false,
    approvalAsExecutionAllowed: false,
    reviewAreas: y3PersistenceBoundaryReviewAreas,
    missingReviewAreas,
    blockedReasons,
  };
}
