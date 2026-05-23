import { y9PlanningFlags } from "./y9-final-authorization-evidence-review";

export const y9PreSchemaRolloutRiskAreas = ["schema drift", "migration failure", "rollback failure", "privacy exposure", "operator confusion", "audit write drift", "storage disable failure", "runtime coupling", "provider coupling", "production support burden"] as const;

export type Y9PreSchemaRolloutRiskInput = Partial<Record<"schemaDriftReviewed" | "migrationFailureReviewed" | "rollbackFailureReviewed" | "privacyExposureReviewed" | "operatorConfusionReviewed" | "auditWriteDriftReviewed" | "storageDisableFailureReviewed" | "runtimeCouplingReviewed" | "providerCouplingReviewed" | "supportBurdenReviewed", boolean>> & Partial<Record<"riskIgnoredRequested" | "productionRolloutRequested" | "runtimeCouplingRequested" | "providerCouplingRequested" | "auditWriteRequested" | "storageActivationRequested", boolean>>;

export type Y9PreSchemaRolloutRiskStatus = "pre_schema_rollout_risk_blocked" | "operator_review_required" | "pre_schema_rollout_risk_clear";

const requiredReviewAreas: Array<[keyof Y9PreSchemaRolloutRiskInput, string]> = [["schemaDriftReviewed", "schema drift"], ["migrationFailureReviewed", "migration failure"], ["rollbackFailureReviewed", "rollback failure"], ["privacyExposureReviewed", "privacy exposure"], ["operatorConfusionReviewed", "operator confusion"], ["auditWriteDriftReviewed", "audit write drift"], ["storageDisableFailureReviewed", "storage disable failure"], ["runtimeCouplingReviewed", "runtime coupling"], ["providerCouplingReviewed", "provider coupling"], ["supportBurdenReviewed", "production support burden"]];
const blockedRequests: Array<[keyof Y9PreSchemaRolloutRiskInput, string]> = [["riskIgnoredRequested", "risk bypass remains blocked"], ["productionRolloutRequested", "production rollout remains blocked"], ["runtimeCouplingRequested", "runtime coupling remains blocked"], ["providerCouplingRequested", "provider coupling remains blocked"], ["auditWriteRequested", "audit writing remains unauthorized"], ["storageActivationRequested", "storage activation remains blocked"]];

export function createY9PreSchemaRolloutRiskReview(input: Y9PreSchemaRolloutRiskInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y9PreSchemaRolloutRiskStatus = blockedReasons.length > 0 ? "pre_schema_rollout_risk_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "pre_schema_rollout_risk_clear";
  return {
    phase: "Y9D" as const,
    status,
    flags: y9PlanningFlags,
    planningOnly: true,
    riskAreas: y9PreSchemaRolloutRiskAreas,
    productionRolloutAllowed: false,
    providerActivationAllowed: false,
    runtimeActivationAllowed: false,
    storageAuthorized: false,
    auditWritingAllowed: false,
    missingReviewAreas,
    blockedReasons,
  };
}
