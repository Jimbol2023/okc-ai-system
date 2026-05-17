/**
 * County data quality intelligence contracts.
 *
 * Planning-only metadata for evaluating county/public-record data quality.
 *
 * Strictly planning metadata only:
 * - no scraping
 * - no fetch calls
 * - no OCR execution
 * - no parser execution
 * - no ingestion execution
 * - no normalization execution
 * - no file uploads
 * - no storage/database writes
 * - no dashboard/API wiring
 */

export type CountyDataQualityLevel =
  | "high_confidence_structured"
  | "moderate_quality_review_needed"
  | "inconsistent_high_review"
  | "fragmented_manual_cleanup"
  | "unsafe_unknown_quality";

export type CountyDataQualityReviewIntensity = "low" | "medium" | "high" | "mandatory";

export type CountyDataCleanupBurden = "low" | "medium" | "high" | "manual_rebuild" | "unknown";

export type CountyDataQualityWarningCode =
  | "missing_completeness_confidence"
  | "missing_structure_consistency"
  | "duplication_risk_high"
  | "ambiguity_risk_high"
  | "structure_consistency_low"
  | "completeness_confidence_low"
  | "cleanup_burden_high"
  | "quality_confidence_low"
  | "unsafe_unknown_quality"
  | "manual_review_required"
  | "execution_blocked"
  | "planning_only_no_mutation";

export interface CountyDataQualityInput {
  completenessConfidence?: number | null;
  duplicationRisk?: number | null;
  ambiguityRisk?: number | null;
  structureConsistency?: number | null;
  expectedCleanupBurden?: CountyDataCleanupBurden | null;
  qualityConfidenceScore?: number | null;
}

export interface CountyDataQualityResult {
  qualityLevel: CountyDataQualityLevel;
  qualityConfidenceScore: number;
  completenessConfidence: number;
  duplicationRisk: number;
  ambiguityRisk: number;
  structureConsistency: number;
  expectedCleanupBurden: CountyDataCleanupBurden;
  expectedHumanReviewIntensity: CountyDataQualityReviewIntensity;
  warningCodes: readonly CountyDataQualityWarningCode[];
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

export const CountyDataQualityIntelligenceVersion = "S6-COUNTY-DATA-QUALITY-INTELLIGENCE-V1" as const;

export const CountyDataQualityFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

export const CountyDataQualityWarningCodes: Record<
  Uppercase<CountyDataQualityWarningCode>,
  CountyDataQualityWarningCode
> = {
  MISSING_COMPLETENESS_CONFIDENCE: "missing_completeness_confidence",
  MISSING_STRUCTURE_CONSISTENCY: "missing_structure_consistency",
  DUPLICATION_RISK_HIGH: "duplication_risk_high",
  AMBIGUITY_RISK_HIGH: "ambiguity_risk_high",
  STRUCTURE_CONSISTENCY_LOW: "structure_consistency_low",
  COMPLETENESS_CONFIDENCE_LOW: "completeness_confidence_low",
  CLEANUP_BURDEN_HIGH: "cleanup_burden_high",
  QUALITY_CONFIDENCE_LOW: "quality_confidence_low",
  UNSAFE_UNKNOWN_QUALITY: "unsafe_unknown_quality",
  MANUAL_REVIEW_REQUIRED: "manual_review_required",
  EXECUTION_BLOCKED: "execution_blocked",
  PLANNING_ONLY_NO_MUTATION: "planning_only_no_mutation",
} as const;

export const CountyDataQualityThresholds = {
  highConfidence: 0.82,
  moderateConfidence: 0.62,
  minimumCompleteness: 0.7,
  minimumStructureConsistency: 0.7,
  maximumDuplicationRisk: 0.35,
  maximumAmbiguityRisk: 0.35,
  highRisk: 0.7,
} as const;

const cleanupBurdenScores: Record<CountyDataCleanupBurden, number> = {
  low: 0.1,
  medium: 0.4,
  high: 0.7,
  manual_rebuild: 1,
  unknown: 0.85,
};

const clampScore = (score: number | null | undefined): number => {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return 0;
  }

  return Math.min(1, Math.max(0, score));
};

const inferCleanupBurden = (
  expectedCleanupBurden: CountyDataQualityInput["expectedCleanupBurden"],
  completenessConfidence: number,
  structureConsistency: number,
  duplicationRisk: number,
  ambiguityRisk: number,
): CountyDataCleanupBurden => {
  if (expectedCleanupBurden) {
    return expectedCleanupBurden;
  }

  if (completenessConfidence === 0 && structureConsistency === 0) {
    return "unknown";
  }

  if (
    completenessConfidence < 0.4 ||
    structureConsistency < 0.4 ||
    duplicationRisk >= CountyDataQualityThresholds.highRisk ||
    ambiguityRisk >= CountyDataQualityThresholds.highRisk
  ) {
    return "manual_rebuild";
  }

  if (completenessConfidence < 0.65 || structureConsistency < 0.65) {
    return "high";
  }

  if (duplicationRisk > 0.35 || ambiguityRisk > 0.35) {
    return "medium";
  }

  return "low";
};

const calculateQualityConfidenceScore = (
  inputScore: number | null | undefined,
  completenessConfidence: number,
  duplicationRisk: number,
  ambiguityRisk: number,
  structureConsistency: number,
  cleanupBurden: CountyDataCleanupBurden,
): number => {
  if (typeof inputScore === "number") {
    return clampScore(inputScore);
  }

  return clampScore(
    completenessConfidence * 0.3 +
      structureConsistency * 0.3 +
      (1 - duplicationRisk) * 0.15 +
      (1 - ambiguityRisk) * 0.15 +
      (1 - cleanupBurdenScores[cleanupBurden]) * 0.1,
  );
};

const getQualityLevel = (
  qualityConfidenceScore: number,
  warningCodes: readonly CountyDataQualityWarningCode[],
  cleanupBurden: CountyDataCleanupBurden,
): CountyDataQualityLevel => {
  if (
    warningCodes.includes("unsafe_unknown_quality") ||
    warningCodes.includes("missing_completeness_confidence") ||
    warningCodes.includes("missing_structure_consistency")
  ) {
    return "unsafe_unknown_quality";
  }

  if (cleanupBurden === "manual_rebuild" || cleanupBurden === "unknown") {
    return "fragmented_manual_cleanup";
  }

  if (
    warningCodes.includes("duplication_risk_high") ||
    warningCodes.includes("ambiguity_risk_high") ||
    warningCodes.includes("structure_consistency_low")
  ) {
    return "inconsistent_high_review";
  }

  if (qualityConfidenceScore >= CountyDataQualityThresholds.highConfidence && warningCodes.length <= 3) {
    return "high_confidence_structured";
  }

  if (qualityConfidenceScore >= CountyDataQualityThresholds.moderateConfidence) {
    return "moderate_quality_review_needed";
  }

  return "inconsistent_high_review";
};

const getReviewIntensity = (qualityLevel: CountyDataQualityLevel): CountyDataQualityReviewIntensity => {
  const reviewIntensityByLevel: Record<CountyDataQualityLevel, CountyDataQualityReviewIntensity> = {
    high_confidence_structured: "low",
    moderate_quality_review_needed: "medium",
    inconsistent_high_review: "high",
    fragmented_manual_cleanup: "mandatory",
    unsafe_unknown_quality: "mandatory",
  };

  return reviewIntensityByLevel[qualityLevel];
};

export function evaluateCountyDataQuality(input: CountyDataQualityInput): CountyDataQualityResult {
  const completenessConfidence = clampScore(input.completenessConfidence);
  const duplicationRisk = clampScore(input.duplicationRisk);
  const ambiguityRisk = clampScore(input.ambiguityRisk);
  const structureConsistency = clampScore(input.structureConsistency);
  const expectedCleanupBurden = inferCleanupBurden(
    input.expectedCleanupBurden,
    completenessConfidence,
    structureConsistency,
    duplicationRisk,
    ambiguityRisk,
  );
  const qualityConfidenceScore = calculateQualityConfidenceScore(
    input.qualityConfidenceScore,
    completenessConfidence,
    duplicationRisk,
    ambiguityRisk,
    structureConsistency,
    expectedCleanupBurden,
  );
  const warningCodes: CountyDataQualityWarningCode[] = [];

  if (input.completenessConfidence === null || input.completenessConfidence === undefined) {
    warningCodes.push("missing_completeness_confidence");
  }

  if (input.structureConsistency === null || input.structureConsistency === undefined) {
    warningCodes.push("missing_structure_consistency");
  }

  if (duplicationRisk >= CountyDataQualityThresholds.highRisk) {
    warningCodes.push("duplication_risk_high");
  }

  if (ambiguityRisk >= CountyDataQualityThresholds.highRisk) {
    warningCodes.push("ambiguity_risk_high");
  }

  if (structureConsistency < CountyDataQualityThresholds.minimumStructureConsistency) {
    warningCodes.push("structure_consistency_low");
  }

  if (completenessConfidence < CountyDataQualityThresholds.minimumCompleteness) {
    warningCodes.push("completeness_confidence_low");
  }

  if (expectedCleanupBurden === "high" || expectedCleanupBurden === "manual_rebuild" || expectedCleanupBurden === "unknown") {
    warningCodes.push("cleanup_burden_high");
  }

  if (qualityConfidenceScore < CountyDataQualityThresholds.moderateConfidence) {
    warningCodes.push("quality_confidence_low");
  }

  if (
    input.completenessConfidence === null ||
    input.completenessConfidence === undefined ||
    input.structureConsistency === null ||
    input.structureConsistency === undefined
  ) {
    warningCodes.push("unsafe_unknown_quality");
  }

  warningCodes.push("manual_review_required");
  warningCodes.push("execution_blocked");
  warningCodes.push("planning_only_no_mutation");

  const qualityLevel = getQualityLevel(qualityConfidenceScore, warningCodes, expectedCleanupBurden);

  return {
    qualityLevel,
    qualityConfidenceScore,
    completenessConfidence,
    duplicationRisk,
    ambiguityRisk,
    structureConsistency,
    expectedCleanupBurden,
    expectedHumanReviewIntensity: getReviewIntensity(qualityLevel),
    warningCodes,
    ingestionBlocked: CountyDataQualityFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountyDataQualityFailClosedDefaults.automationBlocked,
    executionBlocked: CountyDataQualityFailClosedDefaults.executionBlocked,
    planningOnly: CountyDataQualityFailClosedDefaults.planningOnly,
    failClosed: CountyDataQualityFailClosedDefaults.failClosed,
  };
}
