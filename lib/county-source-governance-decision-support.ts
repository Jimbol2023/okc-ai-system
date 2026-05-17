/**
 * Deterministic advisory-only County Source Governance Decision Support Layer.
 *
 * No runtime side-effects.
 * No ingestion, parsing, or OCR.
 * No database writes.
 * Planning-only metadata and advisory helps.
 */

export type CountySourceGovernanceDecisionAdvisory =
  | "approve_without_review"
  | "require_manual_review"
  | "reject_due_to_risk";

export interface CountySourceGovernanceDecisionMetadata {
  advisory: CountySourceGovernanceDecisionAdvisory;
  confidence: number; // 0=lowest, 1=highest
  reasoning: string; // brief explanation of rationale
  requiresHumanReview: boolean;
  notes?: string;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: boolean;
}

const CountySourceGovernanceDecisionFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

/**
 * Generate a deterministic governance decision advisory based on input risk signals.
 *
 * @param riskScore - A number indicating overall risk (0 - 1).
 * @param manualReviewFlag - Whether manual review is requested.
 * @returns CountySourceGovernanceDecisionMetadata with advisory and reasoning.
 */
export function deriveCountySourceGovernanceDecision(
  riskScore: number,
  manualReviewFlag: boolean,
): CountySourceGovernanceDecisionMetadata {
  if (riskScore >= 0.75) {
    return {
      advisory: "reject_due_to_risk",
      confidence: 1.0 - riskScore,
      reasoning: "High risk score exceeds threshold.",
      requiresHumanReview: true,
      ...CountySourceGovernanceDecisionFailClosedDefaults,
    };
  }
  if (manualReviewFlag) {
    return {
      advisory: "require_manual_review",
      confidence: 0.8,
      reasoning: "Manual review requested.",
      requiresHumanReview: true,
      ...CountySourceGovernanceDecisionFailClosedDefaults,
    };
  }

  return {
    advisory: "approve_without_review",
    confidence: 0.95,
    reasoning: "Low risk, no manual review needed.",
    requiresHumanReview: false,
    ...CountySourceGovernanceDecisionFailClosedDefaults,
  };
}
