import { postX10ReviewFlags } from "./post-x10-system-operational-review";

export type PostX10InstitutionalSummaryInput = {
  operationalReviewed?: boolean;
  governanceReviewed?: boolean;
  communicationReviewed?: boolean;
  providerIsolationReviewed?: boolean;
  accessibilityReviewed?: boolean;
  workflowReviewed?: boolean;
  revenueOperationsReviewed?: boolean;
  roadmapReviewed?: boolean;
  executionRequested?: boolean;
  providerRequested?: boolean;
  persistenceRequested?: boolean;
};
export type PostX10InstitutionalSummaryStatus = "post_x10_summary_blocked" | "operator_review_required" | "post_x10_institutional_summary_clear";

const requiredReviewAreas: Array<[keyof PostX10InstitutionalSummaryInput, string]> = [["operationalReviewed", "operational maturity"], ["governanceReviewed", "governance maturity"], ["communicationReviewed", "communication maturity"], ["providerIsolationReviewed", "provider isolation maturity"], ["accessibilityReviewed", "accessibility maturity"], ["workflowReviewed", "workflow maturity"], ["revenueOperationsReviewed", "revenue operations maturity"], ["roadmapReviewed", "future roadmap readiness"]];
const blockedRequests: Array<[keyof PostX10InstitutionalSummaryInput, string]> = [["executionRequested", "final summary cannot authorize execution"], ["providerRequested", "final summary cannot activate providers"], ["persistenceRequested", "final summary cannot enable persistence"]];

export function createPostX10FinalInstitutionalReviewSummary(input: PostX10InstitutionalSummaryInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: PostX10InstitutionalSummaryStatus = blockedReasons.length > 0 ? "post_x10_summary_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "post_x10_institutional_summary_clear";
  return {
    phase: "POST-X10F" as const,
    status,
    flags: postX10ReviewFlags,
    maturity: {
      operational: "mature advisory visibility across X1-X10",
      governance: "strong fail-closed boundaries preserved",
      communication: "review-ready but non-sending",
      providerIsolation: "provider-blocked and activation-free",
      accessibility: "semantic, readable, text-first review surfaces",
      workflow: "human-review workflow continuity established",
      revenueOperations: "revenue operations intelligence is broad but still non-executing",
    },
    readinessGaps: ["provider activation strategy remains unscoped", "communication activation remains unscoped", "mobile/PWA readiness requires separate review", "operational ROI must be measured through human pilot observation"],
    unresolvedRisks: ["operator cognitive load from many dashboard sections", "future activation could create semantic drift if not separately scoped", "provider and communication governance need dedicated implementation plans before activation"],
    strategicRecommendations: ["pause before any activation track", "run human operational review with real operators", "scope provider, communication, and persistence planning as separate tracks", "preserve exact fail-closed flags in all future work"],
    scalabilityObservations: ["contracts are reusable across future businesses", "read-only helpers are deterministic and portable", "dashboard layering can support future consolidation review"],
    missingReviewAreas,
    blockedReasons,
  };
}
