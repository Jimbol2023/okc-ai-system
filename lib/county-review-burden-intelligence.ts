/**
 * County review burden intelligence contracts.
 *
 * Advisory-only metadata for estimating county/public-record review burden.
 *
 * Strictly planning metadata only:
 * - no scraping
 * - no fetch calls
 * - no OCR execution
 * - no parser execution
 * - no ingestion execution
 * - no normalization execution
 * - no uploads
 * - no database writes
 * - no dashboard/API wiring
 */

export type CountyReviewBurdenLevel =
  | "low_review_burden"
  | "moderate_review_burden"
  | "elevated_review_burden"
  | "manual_remediation_heavy"
  | "unsafe_unknown_review_burden";

export type CountyReviewEffortEstimate = "low" | "medium" | "high" | "manual_rebuild" | "unknown";

export type CountyReviewQueueComplexity = "simple" | "moderate" | "complex" | "manual_triage" | "unknown";

export type CountyReviewBurdenWarningCode =
  | "missing_reviewer_effort"
  | "missing_review_queue_complexity"
  | "reviewer_effort_high"
  | "escalation_likelihood_high"
  | "manual_remediation_burden_high"
  | "review_queue_complexity_high"
  | "confidence_degradation_high"
  | "review_confidence_low"
  | "unsafe_unknown_review_burden"
  | "manual_review_required"
  | "execution_blocked"
  | "planning_only_no_mutation";

export interface CountyReviewBurdenIntelligenceInput {
  reviewerEffortScore?: number | null;
  escalationLikelihood?: number | null;
  manualRemediationBurden?: number | null;
  reviewQueueComplexityScore?: number | null;
  confidenceDegradationScore?: number | null;
  reviewConfidenceScore?: number | null;
}

export interface CountyReviewBurdenIntelligenceResult {
  reviewBurdenLevel: CountyReviewBurdenLevel;
  reviewerEffortEstimate: CountyReviewEffortEstimate;
  escalationLikelihood: number;
  manualRemediationBurden: number;
  reviewQueueComplexity: CountyReviewQueueComplexity;
  reviewQueueComplexityScore: number;
  confidenceDegradationScore: number;
  reviewBurdenScore: number;
  reviewConfidenceScore: number;
  warningCodes: readonly CountyReviewBurdenWarningCode[];
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

export const CountyReviewBurdenIntelligenceVersion = "S8-COUNTY-REVIEW-BURDEN-INTELLIGENCE-V1" as const;

export const CountyReviewBurdenFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

export const CountyReviewBurdenWarningCodes: Record<
  Uppercase<CountyReviewBurdenWarningCode>,
  CountyReviewBurdenWarningCode
> = {
  MISSING_REVIEWER_EFFORT: "missing_reviewer_effort",
  MISSING_REVIEW_QUEUE_COMPLEXITY: "missing_review_queue_complexity",
  REVIEWER_EFFORT_HIGH: "reviewer_effort_high",
  ESCALATION_LIKELIHOOD_HIGH: "escalation_likelihood_high",
  MANUAL_REMEDIATION_BURDEN_HIGH: "manual_remediation_burden_high",
  REVIEW_QUEUE_COMPLEXITY_HIGH: "review_queue_complexity_high",
  CONFIDENCE_DEGRADATION_HIGH: "confidence_degradation_high",
  REVIEW_CONFIDENCE_LOW: "review_confidence_low",
  UNSAFE_UNKNOWN_REVIEW_BURDEN: "unsafe_unknown_review_burden",
  MANUAL_REVIEW_REQUIRED: "manual_review_required",
  EXECUTION_BLOCKED: "execution_blocked",
  PLANNING_ONLY_NO_MUTATION: "planning_only_no_mutation",
} as const;

export const CountyReviewBurdenThresholds = {
  moderateBurden: 0.35,
  elevatedBurden: 0.55,
  heavyBurden: 0.75,
  highComponentRisk: 0.7,
  minimumReviewConfidence: 0.65,
} as const;

const clampScore = (score: number | null | undefined): number => {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return 0;
  }

  return Math.min(1, Math.max(0, score));
};

const calculateReviewBurdenScore = (
  reviewerEffortScore: number,
  escalationLikelihood: number,
  manualRemediationBurden: number,
  reviewQueueComplexityScore: number,
  confidenceDegradationScore: number,
): number =>
  clampScore(
    reviewerEffortScore * 0.24 +
      escalationLikelihood * 0.18 +
      manualRemediationBurden * 0.24 +
      reviewQueueComplexityScore * 0.2 +
      confidenceDegradationScore * 0.14,
  );

const inferReviewConfidenceScore = (
  explicitConfidence: number | null | undefined,
  reviewBurdenScore: number,
  missingCoreMetadata: boolean,
): number => {
  if (typeof explicitConfidence === "number") {
    return clampScore(explicitConfidence);
  }

  if (missingCoreMetadata) {
    return 0;
  }

  return clampScore(1 - reviewBurdenScore * 0.5);
};

const getReviewerEffortEstimate = (
  reviewerEffortScore: number,
  missingCoreMetadata: boolean,
): CountyReviewEffortEstimate => {
  if (missingCoreMetadata) {
    return "unknown";
  }

  if (reviewerEffortScore >= CountyReviewBurdenThresholds.heavyBurden) {
    return "manual_rebuild";
  }

  if (reviewerEffortScore >= CountyReviewBurdenThresholds.elevatedBurden) {
    return "high";
  }

  if (reviewerEffortScore >= CountyReviewBurdenThresholds.moderateBurden) {
    return "medium";
  }

  return "low";
};

const getReviewQueueComplexity = (
  reviewQueueComplexityScore: number,
  missingCoreMetadata: boolean,
): CountyReviewQueueComplexity => {
  if (missingCoreMetadata) {
    return "unknown";
  }

  if (reviewQueueComplexityScore >= CountyReviewBurdenThresholds.heavyBurden) {
    return "manual_triage";
  }

  if (reviewQueueComplexityScore >= CountyReviewBurdenThresholds.elevatedBurden) {
    return "complex";
  }

  if (reviewQueueComplexityScore >= CountyReviewBurdenThresholds.moderateBurden) {
    return "moderate";
  }

  return "simple";
};

const getReviewBurdenLevel = (
  reviewBurdenScore: number,
  warningCodes: readonly CountyReviewBurdenWarningCode[],
): CountyReviewBurdenLevel => {
  if (
    warningCodes.includes("unsafe_unknown_review_burden") ||
    warningCodes.includes("missing_reviewer_effort") ||
    warningCodes.includes("missing_review_queue_complexity")
  ) {
    return "unsafe_unknown_review_burden";
  }

  if (reviewBurdenScore >= CountyReviewBurdenThresholds.heavyBurden) {
    return "manual_remediation_heavy";
  }

  if (reviewBurdenScore >= CountyReviewBurdenThresholds.elevatedBurden) {
    return "elevated_review_burden";
  }

  if (reviewBurdenScore >= CountyReviewBurdenThresholds.moderateBurden) {
    return "moderate_review_burden";
  }

  return "low_review_burden";
};

export function evaluateCountyReviewBurden(
  input: CountyReviewBurdenIntelligenceInput,
): CountyReviewBurdenIntelligenceResult {
  const reviewerEffortScore = clampScore(input.reviewerEffortScore);
  const escalationLikelihood = clampScore(input.escalationLikelihood);
  const manualRemediationBurden = clampScore(input.manualRemediationBurden);
  const reviewQueueComplexityScore = clampScore(input.reviewQueueComplexityScore);
  const confidenceDegradationScore = clampScore(input.confidenceDegradationScore);
  const missingCoreMetadata =
    input.reviewerEffortScore === null ||
    input.reviewerEffortScore === undefined ||
    input.reviewQueueComplexityScore === null ||
    input.reviewQueueComplexityScore === undefined;
  const reviewBurdenScore = calculateReviewBurdenScore(
    reviewerEffortScore,
    escalationLikelihood,
    manualRemediationBurden,
    reviewQueueComplexityScore,
    confidenceDegradationScore,
  );
  const reviewConfidenceScore = inferReviewConfidenceScore(
    input.reviewConfidenceScore,
    reviewBurdenScore,
    missingCoreMetadata,
  );
  const warningCodes: CountyReviewBurdenWarningCode[] = [];

  if (input.reviewerEffortScore === null || input.reviewerEffortScore === undefined) {
    warningCodes.push("missing_reviewer_effort");
  }

  if (input.reviewQueueComplexityScore === null || input.reviewQueueComplexityScore === undefined) {
    warningCodes.push("missing_review_queue_complexity");
  }

  if (reviewerEffortScore >= CountyReviewBurdenThresholds.highComponentRisk) {
    warningCodes.push("reviewer_effort_high");
  }

  if (escalationLikelihood >= CountyReviewBurdenThresholds.highComponentRisk) {
    warningCodes.push("escalation_likelihood_high");
  }

  if (manualRemediationBurden >= CountyReviewBurdenThresholds.highComponentRisk) {
    warningCodes.push("manual_remediation_burden_high");
  }

  if (reviewQueueComplexityScore >= CountyReviewBurdenThresholds.highComponentRisk) {
    warningCodes.push("review_queue_complexity_high");
  }

  if (confidenceDegradationScore >= CountyReviewBurdenThresholds.highComponentRisk) {
    warningCodes.push("confidence_degradation_high");
  }

  if (reviewConfidenceScore < CountyReviewBurdenThresholds.minimumReviewConfidence) {
    warningCodes.push("review_confidence_low");
  }

  if (missingCoreMetadata) {
    warningCodes.push("unsafe_unknown_review_burden");
  }

  warningCodes.push("manual_review_required");
  warningCodes.push("execution_blocked");
  warningCodes.push("planning_only_no_mutation");

  const reviewBurdenLevel = getReviewBurdenLevel(reviewBurdenScore, warningCodes);

  return {
    reviewBurdenLevel,
    reviewerEffortEstimate: getReviewerEffortEstimate(reviewerEffortScore, missingCoreMetadata),
    escalationLikelihood,
    manualRemediationBurden,
    reviewQueueComplexity: getReviewQueueComplexity(reviewQueueComplexityScore, missingCoreMetadata),
    reviewQueueComplexityScore,
    confidenceDegradationScore,
    reviewBurdenScore,
    reviewConfidenceScore,
    warningCodes,
    ingestionBlocked: CountyReviewBurdenFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountyReviewBurdenFailClosedDefaults.automationBlocked,
    executionBlocked: CountyReviewBurdenFailClosedDefaults.executionBlocked,
    planningOnly: CountyReviewBurdenFailClosedDefaults.planningOnly,
    failClosed: CountyReviewBurdenFailClosedDefaults.failClosed,
  };
}
