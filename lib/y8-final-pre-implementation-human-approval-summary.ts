import { createY8ApprovalRoleSignoffReview } from "./y8-approval-role-signoff-review";
import { createY8GoNoGoDecisionRecordPlan } from "./y8-go-no-go-decision-record-plan";
import { createY8HumanApprovalPackageContents, y8PlanningFlags } from "./y8-human-approval-package-contents";
import { createY8OperatorRunbookReadinessPackage } from "./y8-operator-runbook-readiness-package";
import { createY8RiskDisclosurePackageReview } from "./y8-risk-disclosure-package-review";

export type Y8FinalPreImplementationHumanApprovalSummaryInput = Partial<Record<"packageContentsReviewed" | "approvalRolesReviewed" | "riskDisclosureReviewed" | "operatorRunbookReviewed" | "goNoGoDecisionReviewed" | "unresolvedBlockersReviewed" | "recommendedNextStepReviewed", boolean>> & Partial<Record<"schemaImplementationRequested" | "migrationRequested" | "storageRequested" | "auditWritingRequested" | "providerRequested" | "runtimeRequested" | "executionRequested" | "productionRequested", boolean>>;

export type Y8FinalPreImplementationHumanApprovalSummaryStatus = "final_pre_implementation_human_approval_blocked" | "operator_review_required" | "final_pre_implementation_human_approval_clear";

const requiredReviewAreas: Array<[keyof Y8FinalPreImplementationHumanApprovalSummaryInput, string]> = [["packageContentsReviewed", "approval package contents"], ["approvalRolesReviewed", "approval roles"], ["riskDisclosureReviewed", "risk disclosure"], ["operatorRunbookReviewed", "operator runbook"], ["goNoGoDecisionReviewed", "go/no-go decision record"], ["unresolvedBlockersReviewed", "unresolved blockers"], ["recommendedNextStepReviewed", "recommended next step"]];
const blockedRequests: Array<[keyof Y8FinalPreImplementationHumanApprovalSummaryInput, string]> = [["schemaImplementationRequested", "schema implementation remains unauthorized"], ["migrationRequested", "migrations remain unauthorized"], ["storageRequested", "storage remains unauthorized"], ["auditWritingRequested", "audit writing remains unauthorized"], ["providerRequested", "provider activation remains blocked"], ["runtimeRequested", "runtime activation remains blocked"], ["executionRequested", "execution remains blocked"], ["productionRequested", "production rollout remains blocked"]];

export function createY8FinalPreImplementationHumanApprovalSummary(input: Y8FinalPreImplementationHumanApprovalSummaryInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y8FinalPreImplementationHumanApprovalSummaryStatus = blockedReasons.length > 0 ? "final_pre_implementation_human_approval_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "final_pre_implementation_human_approval_clear";
  return {
    phase: "Y8F" as const,
    status,
    flags: y8PlanningFlags,
    planningOnly: true,
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
    packageContents: createY8HumanApprovalPackageContents(),
    approvalRoles: createY8ApprovalRoleSignoffReview(),
    riskDisclosure: createY8RiskDisclosurePackageReview(),
    operatorRunbook: createY8OperatorRunbookReadinessPackage(),
    goNoGoDecisionRecord: createY8GoNoGoDecisionRecordPlan(),
    unresolvedBlockers: ["human approval package does not authorize implementation", "schema edits remain blocked", "migrations remain blocked", "storage and audit writing remain blocked", "runtime/provider/execution remain blocked"],
    recommendedNextStep: "Y9 - Final Pre-Schema Authorization Review",
    recommendedNextStepPlanningOnly: true,
    y9Justified: true,
    missingReviewAreas,
    blockedReasons,
  };
}
