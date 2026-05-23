import { createY9FinalAuthorizationEvidenceReview, y9PlanningFlags } from "./y9-final-authorization-evidence-review";
import { createY9FinalHumanAuthorizationBoundaryReview } from "./y9-final-human-authorization-boundary-review";
import { createY9NextPhaseReadinessReview } from "./y9-next-phase-readiness-review";
import { createY9PreSchemaRolloutRiskReview } from "./y9-pre-schema-rollout-risk-review";
import { createY9SchemaChangeStopConditionReview } from "./y9-schema-change-stop-condition-review";

export type Y9FinalPreSchemaAuthorizationSummaryInput = Partial<Record<"authorizationEvidenceReviewed" | "stopConditionsReviewed" | "humanBoundaryReviewed" | "rolloutRiskReviewed" | "nextPhaseReadinessReviewed" | "unresolvedBlockersReviewed" | "recommendedNextStepReviewed", boolean>> & Partial<Record<"schemaRequested" | "migrationRequested" | "storageRequested" | "auditWritingRequested" | "providerRequested" | "runtimeRequested" | "executionRequested" | "productionRequested", boolean>>;

export type Y9FinalPreSchemaAuthorizationSummaryStatus = "final_pre_schema_authorization_blocked" | "operator_review_required" | "final_pre_schema_authorization_clear";

const requiredReviewAreas: Array<[keyof Y9FinalPreSchemaAuthorizationSummaryInput, string]> = [["authorizationEvidenceReviewed", "authorization evidence"], ["stopConditionsReviewed", "stop conditions"], ["humanBoundaryReviewed", "human authorization boundary"], ["rolloutRiskReviewed", "rollout risk"], ["nextPhaseReadinessReviewed", "next phase readiness"], ["unresolvedBlockersReviewed", "unresolved blockers"], ["recommendedNextStepReviewed", "recommended next step"]];
const blockedRequests: Array<[keyof Y9FinalPreSchemaAuthorizationSummaryInput, string]> = [["schemaRequested", "schema changes remain unauthorized"], ["migrationRequested", "migrations remain unauthorized"], ["storageRequested", "storage remains unauthorized"], ["auditWritingRequested", "audit writing remains unauthorized"], ["providerRequested", "provider activation remains blocked"], ["runtimeRequested", "runtime activation remains blocked"], ["executionRequested", "execution remains blocked"], ["productionRequested", "production rollout remains blocked"]];

export function createY9FinalPreSchemaAuthorizationSummary(input: Y9FinalPreSchemaAuthorizationSummaryInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y9FinalPreSchemaAuthorizationSummaryStatus = blockedReasons.length > 0 ? "final_pre_schema_authorization_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "final_pre_schema_authorization_clear";
  return {
    phase: "Y9F" as const,
    status,
    flags: y9PlanningFlags,
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
    authorizationEvidence: createY9FinalAuthorizationEvidenceReview(),
    stopConditions: createY9SchemaChangeStopConditionReview(),
    humanAuthorizationBoundary: createY9FinalHumanAuthorizationBoundaryReview(),
    rolloutRisk: createY9PreSchemaRolloutRiskReview(),
    nextPhaseReadiness: createY9NextPhaseReadinessReview(),
    unresolvedBlockers: ["schema authorization remains blocked", "migration authorization remains blocked", "storage and audit writing remain blocked", "runtime/provider/execution remain blocked", "manual operations remain primary"],
    recommendedNextStep: "Y10 - Schema Implementation Authorization Decision Plan",
    recommendedNextStepPlanningOnly: true,
    y10Justified: true,
    missingReviewAreas,
    blockedReasons,
  };
}
