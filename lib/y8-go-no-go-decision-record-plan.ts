import { y8PlanningFlags } from "./y8-human-approval-package-contents";

export const y8GoNoGoDecisionAreas = ["decision label", "decision rationale", "approver placeholders", "unresolved blockers", "required follow-up", "explicit non-execution statement", "next planning phase", "stop condition acknowledgement"] as const;

export type Y8GoNoGoDecisionRecordInput = Partial<Record<"decisionLabelReviewed" | "decisionRationaleReviewed" | "approverPlaceholdersReviewed" | "unresolvedBlockersReviewed" | "requiredFollowUpReviewed" | "nonExecutionStatementReviewed" | "nextPlanningPhaseReviewed" | "stopConditionReviewed", boolean>> & Partial<Record<"goDecisionAsExecutionRequested" | "schemaImplementationRequested" | "migrationRequested" | "storageRequested" | "auditWriteRequested" | "providerRequested" | "runtimeRequested", boolean>>;

export type Y8GoNoGoDecisionRecordStatus = "go_no_go_decision_record_blocked" | "operator_review_required" | "go_no_go_decision_record_clear";

const requiredReviewAreas: Array<[keyof Y8GoNoGoDecisionRecordInput, string]> = [["decisionLabelReviewed", "decision label"], ["decisionRationaleReviewed", "decision rationale"], ["approverPlaceholdersReviewed", "approver placeholders"], ["unresolvedBlockersReviewed", "unresolved blockers"], ["requiredFollowUpReviewed", "required follow-up"], ["nonExecutionStatementReviewed", "explicit non-execution statement"], ["nextPlanningPhaseReviewed", "next planning phase"], ["stopConditionReviewed", "stop condition acknowledgement"]];
const blockedRequests: Array<[keyof Y8GoNoGoDecisionRecordInput, string]> = [["goDecisionAsExecutionRequested", "go decision does not grant execution"], ["schemaImplementationRequested", "schema implementation remains unauthorized"], ["migrationRequested", "migrations remain unauthorized"], ["storageRequested", "storage remains unauthorized"], ["auditWriteRequested", "audit writing remains unauthorized"], ["providerRequested", "provider activation remains blocked"], ["runtimeRequested", "runtime activation remains blocked"]];

export function createY8GoNoGoDecisionRecordPlan(input: Y8GoNoGoDecisionRecordInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y8GoNoGoDecisionRecordStatus = blockedReasons.length > 0 ? "go_no_go_decision_record_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "go_no_go_decision_record_clear";
  return {
    phase: "Y8E" as const,
    status,
    flags: y8PlanningFlags,
    planningOnly: true,
    decisionRecordAreas: y8GoNoGoDecisionAreas,
    goDecisionGrantsExecution: false,
    schemaChangesAuthorized: false,
    migrationsAuthorized: false,
    storageAuthorized: false,
    auditWritingAllowed: false,
    runtimeActivationAllowed: false,
    missingReviewAreas,
    blockedReasons,
  };
}
