/**
 * County source survivability intelligence contracts.
 *
 * Advisory-only metadata for evaluating long-term county/public-record source survivability.
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

export type CountySourceSurvivabilityLevel =
  | "strong_source_survivability"
  | "moderate_source_survivability"
  | "fragile_source_survivability"
  | "disruption_prone_source"
  | "unsafe_unknown_survivability";

export type CountyDependencyFragility = "low" | "moderate" | "high" | "critical" | "unknown";

export type CountySourceContinuityRisk = "low" | "moderate" | "elevated" | "severe" | "unknown";

export type CountySourceSurvivabilityWarningCode =
  | "missing_survivability_baseline"
  | "missing_operational_sustainability"
  | "dependency_fragility_high"
  | "source_continuity_risk_high"
  | "operational_sustainability_low"
  | "source_disruption_likelihood_high"
  | "survivability_confidence_low"
  | "unsafe_unknown_survivability"
  | "manual_review_required"
  | "execution_blocked"
  | "planning_only_no_connectivity";

export interface CountySourceSurvivabilityInput {
  survivabilityBaselineScore?: number | null;
  dependencyFragilityScore?: number | null;
  sourceContinuityRiskScore?: number | null;
  operationalSustainabilityScore?: number | null;
  sourceDisruptionLikelihood?: number | null;
  survivabilityConfidenceScore?: number | null;
}

export interface CountySourceSurvivabilityResult {
  sourceSurvivabilityLevel: CountySourceSurvivabilityLevel;
  survivabilityBaselineScore: number;
  dependencyFragility: CountyDependencyFragility;
  dependencyFragilityScore: number;
  sourceContinuityRisk: CountySourceContinuityRisk;
  sourceContinuityRiskScore: number;
  operationalSustainabilityScore: number;
  sourceDisruptionLikelihood: number;
  survivabilityScore: number;
  survivabilityConfidenceScore: number;
  warningCodes: readonly CountySourceSurvivabilityWarningCode[];
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

export const CountySourceSurvivabilityIntelligenceVersion =
  "S10-COUNTY-SOURCE-SURVIVABILITY-INTELLIGENCE-V1" as const;

export const CountySourceSurvivabilityFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

export const CountySourceSurvivabilityWarningCodes: Record<
  Uppercase<CountySourceSurvivabilityWarningCode>,
  CountySourceSurvivabilityWarningCode
> = {
  MISSING_SURVIVABILITY_BASELINE: "missing_survivability_baseline",
  MISSING_OPERATIONAL_SUSTAINABILITY: "missing_operational_sustainability",
  DEPENDENCY_FRAGILITY_HIGH: "dependency_fragility_high",
  SOURCE_CONTINUITY_RISK_HIGH: "source_continuity_risk_high",
  OPERATIONAL_SUSTAINABILITY_LOW: "operational_sustainability_low",
  SOURCE_DISRUPTION_LIKELIHOOD_HIGH: "source_disruption_likelihood_high",
  SURVIVABILITY_CONFIDENCE_LOW: "survivability_confidence_low",
  UNSAFE_UNKNOWN_SURVIVABILITY: "unsafe_unknown_survivability",
  MANUAL_REVIEW_REQUIRED: "manual_review_required",
  EXECUTION_BLOCKED: "execution_blocked",
  PLANNING_ONLY_NO_CONNECTIVITY: "planning_only_no_connectivity",
} as const;

export const CountySourceSurvivabilityThresholds = {
  strongSurvivability: 0.82,
  moderateSurvivability: 0.62,
  fragileSurvivability: 0.42,
  minimumOperationalSustainability: 0.65,
  highRisk: 0.7,
  minimumConfidence: 0.65,
} as const;

const clampScore = (score: number | null | undefined): number => {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return 0;
  }

  return Math.min(1, Math.max(0, score));
};

const calculateSurvivabilityScore = (
  survivabilityBaselineScore: number,
  dependencyFragilityScore: number,
  sourceContinuityRiskScore: number,
  operationalSustainabilityScore: number,
  sourceDisruptionLikelihood: number,
  missingCoreMetadata: boolean,
): number => {
  if (missingCoreMetadata) {
    return 0;
  }

  return clampScore(
    survivabilityBaselineScore * 0.3 +
      operationalSustainabilityScore * 0.3 +
      (1 - dependencyFragilityScore) * 0.16 +
      (1 - sourceContinuityRiskScore) * 0.14 +
      (1 - sourceDisruptionLikelihood) * 0.1,
  );
};

const inferSurvivabilityConfidenceScore = (
  explicitConfidence: number | null | undefined,
  survivabilityScore: number,
  missingCoreMetadata: boolean,
): number => {
  if (typeof explicitConfidence === "number") {
    return clampScore(explicitConfidence);
  }

  if (missingCoreMetadata) {
    return 0;
  }

  return clampScore(0.45 + survivabilityScore * 0.5);
};

const getDependencyFragility = (
  dependencyFragilityScore: number,
  missingCoreMetadata: boolean,
): CountyDependencyFragility => {
  if (missingCoreMetadata) {
    return "unknown";
  }

  if (dependencyFragilityScore >= 0.85) {
    return "critical";
  }

  if (dependencyFragilityScore >= CountySourceSurvivabilityThresholds.highRisk) {
    return "high";
  }

  if (dependencyFragilityScore >= 0.4) {
    return "moderate";
  }

  return "low";
};

const getSourceContinuityRisk = (
  sourceContinuityRiskScore: number,
  missingCoreMetadata: boolean,
): CountySourceContinuityRisk => {
  if (missingCoreMetadata) {
    return "unknown";
  }

  if (sourceContinuityRiskScore >= 0.85) {
    return "severe";
  }

  if (sourceContinuityRiskScore >= CountySourceSurvivabilityThresholds.highRisk) {
    return "elevated";
  }

  if (sourceContinuityRiskScore >= 0.4) {
    return "moderate";
  }

  return "low";
};

const getSourceSurvivabilityLevel = (
  survivabilityScore: number,
  warningCodes: readonly CountySourceSurvivabilityWarningCode[],
): CountySourceSurvivabilityLevel => {
  if (
    warningCodes.includes("unsafe_unknown_survivability") ||
    warningCodes.includes("missing_survivability_baseline") ||
    warningCodes.includes("missing_operational_sustainability")
  ) {
    return "unsafe_unknown_survivability";
  }

  if (
    survivabilityScore >= CountySourceSurvivabilityThresholds.strongSurvivability &&
    warningCodes.length <= 3
  ) {
    return "strong_source_survivability";
  }

  if (survivabilityScore >= CountySourceSurvivabilityThresholds.moderateSurvivability) {
    return "moderate_source_survivability";
  }

  if (survivabilityScore >= CountySourceSurvivabilityThresholds.fragileSurvivability) {
    return "fragile_source_survivability";
  }

  return "disruption_prone_source";
};

export function evaluateCountySourceSurvivability(
  input: CountySourceSurvivabilityInput,
): CountySourceSurvivabilityResult {
  const survivabilityBaselineScore = clampScore(input.survivabilityBaselineScore);
  const dependencyFragilityScore = clampScore(input.dependencyFragilityScore);
  const sourceContinuityRiskScore = clampScore(input.sourceContinuityRiskScore);
  const operationalSustainabilityScore = clampScore(input.operationalSustainabilityScore);
  const sourceDisruptionLikelihood = clampScore(input.sourceDisruptionLikelihood);
  const missingCoreMetadata =
    input.survivabilityBaselineScore === null ||
    input.survivabilityBaselineScore === undefined ||
    input.operationalSustainabilityScore === null ||
    input.operationalSustainabilityScore === undefined;
  const survivabilityScore = calculateSurvivabilityScore(
    survivabilityBaselineScore,
    dependencyFragilityScore,
    sourceContinuityRiskScore,
    operationalSustainabilityScore,
    sourceDisruptionLikelihood,
    missingCoreMetadata,
  );
  const survivabilityConfidenceScore = inferSurvivabilityConfidenceScore(
    input.survivabilityConfidenceScore,
    survivabilityScore,
    missingCoreMetadata,
  );
  const warningCodes: CountySourceSurvivabilityWarningCode[] = [];

  if (input.survivabilityBaselineScore === null || input.survivabilityBaselineScore === undefined) {
    warningCodes.push("missing_survivability_baseline");
  }

  if (input.operationalSustainabilityScore === null || input.operationalSustainabilityScore === undefined) {
    warningCodes.push("missing_operational_sustainability");
  }

  if (dependencyFragilityScore >= CountySourceSurvivabilityThresholds.highRisk) {
    warningCodes.push("dependency_fragility_high");
  }

  if (sourceContinuityRiskScore >= CountySourceSurvivabilityThresholds.highRisk) {
    warningCodes.push("source_continuity_risk_high");
  }

  if (operationalSustainabilityScore < CountySourceSurvivabilityThresholds.minimumOperationalSustainability) {
    warningCodes.push("operational_sustainability_low");
  }

  if (sourceDisruptionLikelihood >= CountySourceSurvivabilityThresholds.highRisk) {
    warningCodes.push("source_disruption_likelihood_high");
  }

  if (survivabilityConfidenceScore < CountySourceSurvivabilityThresholds.minimumConfidence) {
    warningCodes.push("survivability_confidence_low");
  }

  if (missingCoreMetadata) {
    warningCodes.push("unsafe_unknown_survivability");
  }

  warningCodes.push("manual_review_required");
  warningCodes.push("execution_blocked");
  warningCodes.push("planning_only_no_connectivity");

  const sourceSurvivabilityLevel = getSourceSurvivabilityLevel(survivabilityScore, warningCodes);

  return {
    sourceSurvivabilityLevel,
    survivabilityBaselineScore,
    dependencyFragility: getDependencyFragility(dependencyFragilityScore, missingCoreMetadata),
    dependencyFragilityScore,
    sourceContinuityRisk: getSourceContinuityRisk(sourceContinuityRiskScore, missingCoreMetadata),
    sourceContinuityRiskScore,
    operationalSustainabilityScore,
    sourceDisruptionLikelihood,
    survivabilityScore,
    survivabilityConfidenceScore,
    warningCodes,
    ingestionBlocked: CountySourceSurvivabilityFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountySourceSurvivabilityFailClosedDefaults.automationBlocked,
    executionBlocked: CountySourceSurvivabilityFailClosedDefaults.executionBlocked,
    planningOnly: CountySourceSurvivabilityFailClosedDefaults.planningOnly,
    failClosed: CountySourceSurvivabilityFailClosedDefaults.failClosed,
  };
}
