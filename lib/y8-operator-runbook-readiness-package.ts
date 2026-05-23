import { y8PlanningFlags } from "./y8-human-approval-package-contents";

export const y8OperatorRunbookReadinessAreas = ["manual review procedure", "pre-migration checklist", "rollback checklist", "storage disable checklist", "incident reporting path", "operator training note", "support escalation path", "no runtime procedure"] as const;

export type Y8OperatorRunbookReadinessInput = Partial<Record<"manualReviewProcedureReviewed" | "preMigrationChecklistReviewed" | "rollbackChecklistReviewed" | "storageDisableChecklistReviewed" | "incidentReportingReviewed" | "operatorTrainingReviewed" | "supportEscalationReviewed" | "noRuntimeProcedureReviewed", boolean>> & Partial<Record<"runbookAsAutomationRequested" | "runtimeProcedureRequested" | "operatorBypassRequested" | "storageActivationRequested" | "migrationExecutionRequested", boolean>>;

export type Y8OperatorRunbookReadinessStatus = "operator_runbook_readiness_blocked" | "operator_review_required" | "operator_runbook_readiness_clear";

const requiredReviewAreas: Array<[keyof Y8OperatorRunbookReadinessInput, string]> = [["manualReviewProcedureReviewed", "manual review procedure"], ["preMigrationChecklistReviewed", "pre-migration checklist"], ["rollbackChecklistReviewed", "rollback checklist"], ["storageDisableChecklistReviewed", "storage disable checklist"], ["incidentReportingReviewed", "incident reporting path"], ["operatorTrainingReviewed", "operator training note"], ["supportEscalationReviewed", "support escalation path"], ["noRuntimeProcedureReviewed", "no runtime procedure"]];
const blockedRequests: Array<[keyof Y8OperatorRunbookReadinessInput, string]> = [["runbookAsAutomationRequested", "runbook automation remains blocked"], ["runtimeProcedureRequested", "runtime procedures remain blocked"], ["operatorBypassRequested", "operator bypass remains blocked"], ["storageActivationRequested", "storage activation remains blocked"], ["migrationExecutionRequested", "migration execution remains blocked"]];

export function createY8OperatorRunbookReadinessPackage(input: Y8OperatorRunbookReadinessInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y8OperatorRunbookReadinessStatus = blockedReasons.length > 0 ? "operator_runbook_readiness_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "operator_runbook_readiness_clear";
  return {
    phase: "Y8D" as const,
    status,
    flags: y8PlanningFlags,
    planningOnly: true,
    runbookAreas: y8OperatorRunbookReadinessAreas,
    manualOperationsRemainPrimary: true,
    runbookAutomationAllowed: false,
    runtimeActivationAllowed: false,
    storageAuthorized: false,
    migrationsAuthorized: false,
    missingReviewAreas,
    blockedReasons,
  };
}
