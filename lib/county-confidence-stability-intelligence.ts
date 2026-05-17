/**
 * County confidence stability intelligence contracts.
 *
 * Advisory-only metadata for evaluating confidence durability across county/public-record source planning.
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

export type CountyConfidenceStabilityLevel =
  | "durable_confidence"
  | "moderate_confidence_monitoring"
  | "volatile_confidence_review"
  | "degraded_confidence_manual_review"
  | "unsafe_unknown_confidence";

export type CountyConfidenceDurability = "strong" | "moderate" | "weak" | "degraded" | "unknown";

export type CountyCrossSourceConsistency = "consistent" | "mostly_consistent" | "mixed" | "conflicting" | "unknown";

export type CountyConfidenceStabilityWarningCode =
  | "missing_confidence_durability"
  | "missing_cross_source_consistency"
  | "confidence_drift_high"
  | "cross_source_consistency_low"
  | "confidence_volatility_high"
  | "reviewer_certainty_degradation_high"
  | "confidence_stability_low"
  | "unsafe_unknown_confidence"
  | "manual_review_required"
  | "execution_blocked"
  | "planning_only_no_connectivity";

export interface CountyConfidenceStabilityInput {
  confidenceDurabilityScore?: number | null;
  confidenceDriftEstimate?: number | null;
  crossSourceConsistencyScore?: number | null;
  confidenceVolatilityScore?: number | null;
  reviewerCertaintyDegradation?: number | null;
  confidenceStabilityScore?: number | null;
}

export interface CountyConfidenceStabilityResult {
  confidenceStabilityLevel: CountyConfidenceStabilityLevel;
  confidenceDurability: CountyConfidenceDurability;
  confidenceDurabilityScore: number;
  confidenceDriftEstimate: number;
  crossSourceConsistency: CountyCrossSourceConsistency;
  crossSourceConsistencyScore: number;
  confidenceVolatilityScore: number;
  reviewerCertaintyDegradation: number;
  confidenceStabilityScore: number;
  warningCodes: readonly CountyConfidenceStabilityWarningCode[];
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

export const CountyConfidenceStabilityIntelligenceVersion =
  "S9-COUNTY-CONFIDENCE-STABILITY-INTELLIGENCE-V1" as const;

export const CountyConfidenceStabilityFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

export const CountyConfidenceStabilityWarningCodes: Record<
  Uppercase<CountyConfidenceStabilityWarningCode>,
  CountyConfidenceStabilityWarningCode
> = {
  MISSING_CONFIDENCE_DURABILITY: "missing_confidence_durability",
  MISSING_CROSS_SOURCE_CONSISTENCY: "missing_cross_source_consistency",
  CONFIDENCE_DRIFT_HIGH: "confidence_drift_high",
  CROSS_SOURCE_CONSISTENCY_LOW: "cross_source_consistency_low",
  CONFIDENCE_VOLATILITY_HIGH: "confidence_volatility_high",
  REVIEWER_CERTAINTY_DEGRADATION_HIGH: "reviewer_certainty_degradation_high",
  CONFIDENCE_STABILITY_LOW: "confidence_stability_low",
  UNSAFE_UNKNOWN_CONFIDENCE: "unsafe_unknown_confidence",
  MANUAL_REVIEW_REQUIRED: "manual_review_required",
  EXECUTION_BLOCKED: "execution_blocked",
  PLANNING_ONLY_NO_CONNECTIVITY: "planning_only_no_connectivity",
} as const;

export const CountyConfidenceStabilityThresholds = {
  durableConfidence: 0.82,
  moderateConfidence: 0.62,
  volatileConfidence: 0.42,
  minimumDurability: 0.65,
  minimumCrossSourceConsistency: 0.65,
  highInstability: 0.7,
} as const;

const clampScore = (score: number | null | undefined): number => {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return 0;
  }

  return Math.min(1, Math.max(0, score));
};

const calculateConfidenceStabilityScore = (
  explicitStability: number | null | undefined,
  confidenceDurabilityScore: number,
  confidenceDriftEstimate: number,
  crossSourceConsistencyScore: number,
  confidenceVolatilityScore: number,
  reviewerCertaintyDegradation: number,
  missingCoreMetadata: boolean,
): number => {
  if (typeof explicitStability === "number") {
    return clampScore(explicitStability);
  }

  if (missingCoreMetadata) {
    return 0;
  }

  return clampScore(
    confidenceDurabilityScore * 0.3 +
      crossSourceConsistencyScore * 0.28 +
      (1 - confidenceDriftEstimate) * 0.16 +
      (1 - confidenceVolatilityScore) * 0.16 +
      (1 - reviewerCertaintyDegradation) * 0.1,
  );
};

const getConfidenceDurability = (
  confidenceDurabilityScore: number,
  missingCoreMetadata: boolean,
): CountyConfidenceDurability => {
  if (missingCoreMetadata) {
    return "unknown";
  }

  if (confidenceDurabilityScore >= CountyConfidenceStabilityThresholds.durableConfidence) {
    return "strong";
  }

  if (confidenceDurabilityScore >= CountyConfidenceStabilityThresholds.moderateConfidence) {
    return "moderate";
  }

  if (confidenceDurabilityScore >= CountyConfidenceStabilityThresholds.volatileConfidence) {
    return "weak";
  }

  return "degraded";
};

const getCrossSourceConsistency = (
  crossSourceConsistencyScore: number,
  missingCoreMetadata: boolean,
): CountyCrossSourceConsistency => {
  if (missingCoreMetadata) {
    return "unknown";
  }

  if (crossSourceConsistencyScore >= CountyConfidenceStabilityThresholds.durableConfidence) {
    return "consistent";
  }

  if (crossSourceConsistencyScore >= CountyConfidenceStabilityThresholds.moderateConfidence) {
    return "mostly_consistent";
  }

  if (crossSourceConsistencyScore >= CountyConfidenceStabilityThresholds.volatileConfidence) {
    return "mixed";
  }

  return "conflicting";
};

const getConfidenceStabilityLevel = (
  confidenceStabilityScore: number,
  warningCodes: readonly CountyConfidenceStabilityWarningCode[],
): CountyConfidenceStabilityLevel => {
  if (
    warningCodes.includes("unsafe_unknown_confidence") ||
    warningCodes.includes("missing_confidence_durability") ||
    warningCodes.includes("missing_cross_source_consistency")
  ) {
    return "unsafe_unknown_confidence";
  }

  if (confidenceStabilityScore >= CountyConfidenceStabilityThresholds.durableConfidence && warningCodes.length <= 3) {
    return "durable_confidence";
  }

  if (confidenceStabilityScore >= CountyConfidenceStabilityThresholds.moderateConfidence) {
    return "moderate_confidence_monitoring";
  }

  if (confidenceStabilityScore >= CountyConfidenceStabilityThresholds.volatileConfidence) {
    return "volatile_confidence_review";
  }

  return "degraded_confidence_manual_review";
};

export function evaluateCountyConfidenceStability(
  input: CountyConfidenceStabilityInput,
): CountyConfidenceStabilityResult {
  const confidenceDurabilityScore = clampScore(input.confidenceDurabilityScore);
  const confidenceDriftEstimate = clampScore(input.confidenceDriftEstimate);
  const crossSourceConsistencyScore = clampScore(input.crossSourceConsistencyScore);
  const confidenceVolatilityScore = clampScore(input.confidenceVolatilityScore);
  const reviewerCertaintyDegradation = clampScore(input.reviewerCertaintyDegradation);
  const missingCoreMetadata =
    input.confidenceDurabilityScore === null ||
    input.confidenceDurabilityScore === undefined ||
    input.crossSourceConsistencyScore === null ||
    input.crossSourceConsistencyScore === undefined;
  const confidenceStabilityScore = calculateConfidenceStabilityScore(
    input.confidenceStabilityScore,
    confidenceDurabilityScore,
    confidenceDriftEstimate,
    crossSourceConsistencyScore,
    confidenceVolatilityScore,
    reviewerCertaintyDegradation,
    missingCoreMetadata,
  );
  const warningCodes: CountyConfidenceStabilityWarningCode[] = [];

  if (input.confidenceDurabilityScore === null || input.confidenceDurabilityScore === undefined) {
    warningCodes.push("missing_confidence_durability");
  }

  if (input.crossSourceConsistencyScore === null || input.crossSourceConsistencyScore === undefined) {
    warningCodes.push("missing_cross_source_consistency");
  }

  if (confidenceDriftEstimate >= CountyConfidenceStabilityThresholds.highInstability) {
    warningCodes.push("confidence_drift_high");
  }

  if (crossSourceConsistencyScore < CountyConfidenceStabilityThresholds.minimumCrossSourceConsistency) {
    warningCodes.push("cross_source_consistency_low");
  }

  if (confidenceVolatilityScore >= CountyConfidenceStabilityThresholds.highInstability) {
    warningCodes.push("confidence_volatility_high");
  }

  if (reviewerCertaintyDegradation >= CountyConfidenceStabilityThresholds.highInstability) {
    warningCodes.push("reviewer_certainty_degradation_high");
  }

  if (confidenceDurabilityScore < CountyConfidenceStabilityThresholds.minimumDurability) {
    warningCodes.push("confidence_stability_low");
  }

  if (confidenceStabilityScore < CountyConfidenceStabilityThresholds.moderateConfidence) {
    warningCodes.push("confidence_stability_low");
  }

  if (missingCoreMetadata) {
    warningCodes.push("unsafe_unknown_confidence");
  }

  warningCodes.push("manual_review_required");
  warningCodes.push("execution_blocked");
  warningCodes.push("planning_only_no_connectivity");

  const confidenceStabilityLevel = getConfidenceStabilityLevel(confidenceStabilityScore, warningCodes);

  return {
    confidenceStabilityLevel,
    confidenceDurability: getConfidenceDurability(confidenceDurabilityScore, missingCoreMetadata),
    confidenceDurabilityScore,
    confidenceDriftEstimate,
    crossSourceConsistency: getCrossSourceConsistency(crossSourceConsistencyScore, missingCoreMetadata),
    crossSourceConsistencyScore,
    confidenceVolatilityScore,
    reviewerCertaintyDegradation,
    confidenceStabilityScore,
    warningCodes,
    ingestionBlocked: CountyConfidenceStabilityFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountyConfidenceStabilityFailClosedDefaults.automationBlocked,
    executionBlocked: CountyConfidenceStabilityFailClosedDefaults.executionBlocked,
    planningOnly: CountyConfidenceStabilityFailClosedDefaults.planningOnly,
    failClosed: CountyConfidenceStabilityFailClosedDefaults.failClosed,
  };
}
