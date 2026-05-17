/**
 * County risk intelligence contracts.
 *
 * Advisory-only metadata for county/public-record source planning risk.
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

export type CountyRiskLevel =
  | "low_operational_risk"
  | "moderate_operational_risk"
  | "elevated_review_risk"
  | "unstable_high_risk"
  | "unsafe_unknown_risk";

export type CountyRiskReviewIntensity = "low" | "medium" | "high" | "mandatory";

export type CountyRiskWarningCode =
  | "missing_operational_volatility"
  | "missing_structure_instability"
  | "operational_volatility_high"
  | "ocr_dependency_high"
  | "ambiguity_escalation_high"
  | "manual_review_dependency_high"
  | "structure_instability_high"
  | "unsupported_format_exposure_high"
  | "risk_confidence_low"
  | "unsafe_unknown_risk"
  | "manual_review_required"
  | "execution_blocked"
  | "planning_only_no_connectivity";

export interface CountyRiskIntelligenceInput {
  operationalVolatility?: number | null;
  ocrDependency?: number | null;
  ambiguityEscalation?: number | null;
  manualReviewDependency?: number | null;
  structureInstability?: number | null;
  unsupportedFormatExposure?: number | null;
  riskConfidenceScore?: number | null;
}

export interface CountyRiskIntelligenceResult {
  riskLevel: CountyRiskLevel;
  riskConfidenceScore: number;
  operationalVolatility: number;
  ocrDependency: number;
  ambiguityEscalation: number;
  manualReviewDependency: number;
  structureInstability: number;
  unsupportedFormatExposure: number;
  expectedHumanReviewIntensity: CountyRiskReviewIntensity;
  warningCodes: readonly CountyRiskWarningCode[];
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

export const CountyRiskIntelligenceVersion = "S7-COUNTY-RISK-INTELLIGENCE-V1" as const;

export const CountyRiskFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

export const CountyRiskWarningCodes: Record<Uppercase<CountyRiskWarningCode>, CountyRiskWarningCode> = {
  MISSING_OPERATIONAL_VOLATILITY: "missing_operational_volatility",
  MISSING_STRUCTURE_INSTABILITY: "missing_structure_instability",
  OPERATIONAL_VOLATILITY_HIGH: "operational_volatility_high",
  OCR_DEPENDENCY_HIGH: "ocr_dependency_high",
  AMBIGUITY_ESCALATION_HIGH: "ambiguity_escalation_high",
  MANUAL_REVIEW_DEPENDENCY_HIGH: "manual_review_dependency_high",
  STRUCTURE_INSTABILITY_HIGH: "structure_instability_high",
  UNSUPPORTED_FORMAT_EXPOSURE_HIGH: "unsupported_format_exposure_high",
  RISK_CONFIDENCE_LOW: "risk_confidence_low",
  UNSAFE_UNKNOWN_RISK: "unsafe_unknown_risk",
  MANUAL_REVIEW_REQUIRED: "manual_review_required",
  EXECUTION_BLOCKED: "execution_blocked",
  PLANNING_ONLY_NO_CONNECTIVITY: "planning_only_no_connectivity",
} as const;

export const CountyRiskThresholds = {
  moderateRisk: 0.35,
  elevatedRisk: 0.55,
  highRisk: 0.75,
  minimumRiskConfidence: 0.65,
} as const;

const clampScore = (score: number | null | undefined): number => {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return 0;
  }

  return Math.min(1, Math.max(0, score));
};

const calculateRiskPressureScore = (
  operationalVolatility: number,
  ocrDependency: number,
  ambiguityEscalation: number,
  manualReviewDependency: number,
  structureInstability: number,
  unsupportedFormatExposure: number,
): number =>
  clampScore(
    operationalVolatility * 0.18 +
      ocrDependency * 0.14 +
      ambiguityEscalation * 0.2 +
      manualReviewDependency * 0.16 +
      structureInstability * 0.2 +
      unsupportedFormatExposure * 0.12,
  );

const inferRiskConfidenceScore = (
  explicitConfidence: number | null | undefined,
  riskPressureScore: number,
  missingCoreMetadata: boolean,
): number => {
  if (typeof explicitConfidence === "number") {
    return clampScore(explicitConfidence);
  }

  if (missingCoreMetadata) {
    return 0;
  }

  return clampScore(1 - riskPressureScore * 0.55);
};

const getRiskLevel = (
  riskPressureScore: number,
  warningCodes: readonly CountyRiskWarningCode[],
): CountyRiskLevel => {
  if (
    warningCodes.includes("unsafe_unknown_risk") ||
    warningCodes.includes("missing_operational_volatility") ||
    warningCodes.includes("missing_structure_instability")
  ) {
    return "unsafe_unknown_risk";
  }

  if (riskPressureScore >= CountyRiskThresholds.highRisk) {
    return "unstable_high_risk";
  }

  if (riskPressureScore >= CountyRiskThresholds.elevatedRisk) {
    return "elevated_review_risk";
  }

  if (riskPressureScore >= CountyRiskThresholds.moderateRisk) {
    return "moderate_operational_risk";
  }

  return "low_operational_risk";
};

const getReviewIntensity = (riskLevel: CountyRiskLevel): CountyRiskReviewIntensity => {
  const reviewIntensityByRiskLevel: Record<CountyRiskLevel, CountyRiskReviewIntensity> = {
    low_operational_risk: "low",
    moderate_operational_risk: "medium",
    elevated_review_risk: "high",
    unstable_high_risk: "mandatory",
    unsafe_unknown_risk: "mandatory",
  };

  return reviewIntensityByRiskLevel[riskLevel];
};

export function evaluateCountyRisk(input: CountyRiskIntelligenceInput): CountyRiskIntelligenceResult {
  const operationalVolatility = clampScore(input.operationalVolatility);
  const ocrDependency = clampScore(input.ocrDependency);
  const ambiguityEscalation = clampScore(input.ambiguityEscalation);
  const manualReviewDependency = clampScore(input.manualReviewDependency);
  const structureInstability = clampScore(input.structureInstability);
  const unsupportedFormatExposure = clampScore(input.unsupportedFormatExposure);
  const missingCoreMetadata =
    input.operationalVolatility === null ||
    input.operationalVolatility === undefined ||
    input.structureInstability === null ||
    input.structureInstability === undefined;
  const riskPressureScore = calculateRiskPressureScore(
    operationalVolatility,
    ocrDependency,
    ambiguityEscalation,
    manualReviewDependency,
    structureInstability,
    unsupportedFormatExposure,
  );
  const riskConfidenceScore = inferRiskConfidenceScore(
    input.riskConfidenceScore,
    riskPressureScore,
    missingCoreMetadata,
  );
  const warningCodes: CountyRiskWarningCode[] = [];

  if (input.operationalVolatility === null || input.operationalVolatility === undefined) {
    warningCodes.push("missing_operational_volatility");
  }

  if (input.structureInstability === null || input.structureInstability === undefined) {
    warningCodes.push("missing_structure_instability");
  }

  if (operationalVolatility >= CountyRiskThresholds.highRisk) {
    warningCodes.push("operational_volatility_high");
  }

  if (ocrDependency >= CountyRiskThresholds.highRisk) {
    warningCodes.push("ocr_dependency_high");
  }

  if (ambiguityEscalation >= CountyRiskThresholds.highRisk) {
    warningCodes.push("ambiguity_escalation_high");
  }

  if (manualReviewDependency >= CountyRiskThresholds.highRisk) {
    warningCodes.push("manual_review_dependency_high");
  }

  if (structureInstability >= CountyRiskThresholds.highRisk) {
    warningCodes.push("structure_instability_high");
  }

  if (unsupportedFormatExposure >= CountyRiskThresholds.highRisk) {
    warningCodes.push("unsupported_format_exposure_high");
  }

  if (riskConfidenceScore < CountyRiskThresholds.minimumRiskConfidence) {
    warningCodes.push("risk_confidence_low");
  }

  if (missingCoreMetadata) {
    warningCodes.push("unsafe_unknown_risk");
  }

  warningCodes.push("manual_review_required");
  warningCodes.push("execution_blocked");
  warningCodes.push("planning_only_no_connectivity");

  const riskLevel = getRiskLevel(riskPressureScore, warningCodes);

  return {
    riskLevel,
    riskConfidenceScore,
    operationalVolatility,
    ocrDependency,
    ambiguityEscalation,
    manualReviewDependency,
    structureInstability,
    unsupportedFormatExposure,
    expectedHumanReviewIntensity: getReviewIntensity(riskLevel),
    warningCodes,
    ingestionBlocked: CountyRiskFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountyRiskFailClosedDefaults.automationBlocked,
    executionBlocked: CountyRiskFailClosedDefaults.executionBlocked,
    planningOnly: CountyRiskFailClosedDefaults.planningOnly,
    failClosed: CountyRiskFailClosedDefaults.failClosed,
  };
}
