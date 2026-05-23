import { y8PlanningFlags } from "./y8-human-approval-package-contents";

export const y8RiskDisclosureAreas = ["schema drift risk", "privacy risk", "retention risk", "migration rollback risk", "operator misuse risk", "audit write drift risk", "provider coupling risk", "runtime coupling risk", "production rollout risk"] as const;

export type Y8RiskDisclosurePackageInput = Partial<Record<"schemaDriftRiskReviewed" | "privacyRiskReviewed" | "retentionRiskReviewed" | "migrationRollbackRiskReviewed" | "operatorMisuseRiskReviewed" | "auditWriteDriftRiskReviewed" | "providerCouplingRiskReviewed" | "runtimeCouplingRiskReviewed" | "productionRolloutRiskReviewed", boolean>> & Partial<Record<"riskAcceptanceAsAuthorizationRequested" | "providerCouplingRequested" | "runtimeCouplingRequested" | "productionRolloutRequested" | "auditWriteRequested", boolean>>;

export type Y8RiskDisclosurePackageStatus = "risk_disclosure_package_blocked" | "operator_review_required" | "risk_disclosure_package_clear";

const requiredReviewAreas: Array<[keyof Y8RiskDisclosurePackageInput, string]> = [["schemaDriftRiskReviewed", "schema drift risk"], ["privacyRiskReviewed", "privacy risk"], ["retentionRiskReviewed", "retention risk"], ["migrationRollbackRiskReviewed", "migration rollback risk"], ["operatorMisuseRiskReviewed", "operator misuse risk"], ["auditWriteDriftRiskReviewed", "audit write drift risk"], ["providerCouplingRiskReviewed", "provider coupling risk"], ["runtimeCouplingRiskReviewed", "runtime coupling risk"], ["productionRolloutRiskReviewed", "production rollout risk"]];
const blockedRequests: Array<[keyof Y8RiskDisclosurePackageInput, string]> = [["riskAcceptanceAsAuthorizationRequested", "risk acceptance does not authorize implementation"], ["providerCouplingRequested", "provider coupling remains blocked"], ["runtimeCouplingRequested", "runtime coupling remains blocked"], ["productionRolloutRequested", "production rollout remains blocked"], ["auditWriteRequested", "audit writing remains unauthorized"]];

export function createY8RiskDisclosurePackageReview(input: Y8RiskDisclosurePackageInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y8RiskDisclosurePackageStatus = blockedReasons.length > 0 ? "risk_disclosure_package_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "risk_disclosure_package_clear";
  return {
    phase: "Y8C" as const,
    status,
    flags: y8PlanningFlags,
    planningOnly: true,
    riskDisclosureAreas: y8RiskDisclosureAreas,
    riskAcceptanceAuthorizesImplementation: false,
    providerActivationAllowed: false,
    runtimeActivationAllowed: false,
    auditWritingAllowed: false,
    productionRolloutAllowed: false,
    missingReviewAreas,
    blockedReasons,
  };
}
