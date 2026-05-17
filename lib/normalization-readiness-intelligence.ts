/**
 * Normalization readiness intelligence contracts.
 *
 * Planning-only metadata for evaluating future normalization readiness of
 * county/public-record sources.
 *
 * Strictly planning metadata only:
 * - no scraping
 * - no fetch calls
 * - no OCR execution
 * - no parser execution
 * - no ingestion
 * - no normalization execution
 * - no database writes
 * - no dashboard/API wiring
 */

import type { ParserStrategyFamily } from "./parser-strategy-planner";
import type { SourceFormat } from "./source-format-classifier";

export type NormalizationReadinessLevel =
  | "ready_for_future_normalization"
  | "moderate_review_required"
  | "heavy_review_required"
  | "manual_only"
  | "unsafe_unknown";

export type NormalizationOcrBurdenLevel = "none" | "low" | "medium" | "high" | "blocking";

export type NormalizationHumanReviewIntensity = "low" | "medium" | "high" | "mandatory";

export type EstimatedNormalizationDifficulty = "low" | "medium" | "high" | "manual_only" | "unsafe_unknown";

export type NormalizationReadinessWarningCode =
  | "missing_source_format"
  | "unknown_source_format"
  | "missing_parser_family"
  | "unknown_parser_family"
  | "ocr_burden_high"
  | "structured_data_quality_low"
  | "completeness_low"
  | "ambiguity_high"
  | "parser_readiness_low"
  | "risk_high"
  | "manual_review_required"
  | "normalization_execution_blocked"
  | "planning_only_no_execution";

export interface NormalizationReadinessInput {
  sourceFormat?: SourceFormat | null;
  parserFamily?: ParserStrategyFamily | null;
  ocrBurdenLevel?: NormalizationOcrBurdenLevel | null;
  structuredDataQuality?: number | null;
  completenessScore?: number | null;
  ambiguityScore?: number | null;
  parserReadinessScore?: number | null;
  riskScore?: number | null;
}

export interface NormalizationReadinessResult {
  readinessLevel: NormalizationReadinessLevel;
  normalizationReadinessScore: number;
  completenessScore: number;
  ambiguityScore: number;
  humanReviewIntensity: NormalizationHumanReviewIntensity;
  estimatedNormalizationDifficulty: EstimatedNormalizationDifficulty;
  warningCodes: readonly NormalizationReadinessWarningCode[];
  ingestionBlocked: true;
  automationBlocked: true;
  normalizationExecutionAllowed: false;
  normalizationPlanningOnly: true;
  failClosed: true;
}

export const NormalizationReadinessIntelligenceVersion =
  "S4-NORMALIZATION-READINESS-INTELLIGENCE-V1" as const;

export const NormalizationReadinessFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  normalizationExecutionAllowed: false,
  normalizationPlanningOnly: true,
  failClosed: true,
} as const;

export const NormalizationReadinessWarningCodes: Record<
  Uppercase<NormalizationReadinessWarningCode>,
  NormalizationReadinessWarningCode
> = {
  MISSING_SOURCE_FORMAT: "missing_source_format",
  UNKNOWN_SOURCE_FORMAT: "unknown_source_format",
  MISSING_PARSER_FAMILY: "missing_parser_family",
  UNKNOWN_PARSER_FAMILY: "unknown_parser_family",
  OCR_BURDEN_HIGH: "ocr_burden_high",
  STRUCTURED_DATA_QUALITY_LOW: "structured_data_quality_low",
  COMPLETENESS_LOW: "completeness_low",
  AMBIGUITY_HIGH: "ambiguity_high",
  PARSER_READINESS_LOW: "parser_readiness_low",
  RISK_HIGH: "risk_high",
  MANUAL_REVIEW_REQUIRED: "manual_review_required",
  NORMALIZATION_EXECUTION_BLOCKED: "normalization_execution_blocked",
  PLANNING_ONLY_NO_EXECUTION: "planning_only_no_execution",
} as const;

export const NormalizationReadinessThresholds = {
  ready: 0.82,
  moderate: 0.62,
  heavy: 0.4,
  minimumStructuredDataQuality: 0.7,
  minimumCompleteness: 0.7,
  maximumAmbiguity: 0.35,
  minimumParserReadiness: 0.7,
  maximumRisk: 0.45,
} as const;

const structuredParserFamilies: readonly ParserStrategyFamily[] = [
  "csv_structured",
  "spreadsheet_structured",
  "html_table",
];

const manualOnlyParserFamilies: readonly ParserStrategyFamily[] = [
  "manual_review_only",
  "unknown",
];

const clampScore = (score: number | null | undefined): number => {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return 0;
  }

  return Math.min(1, Math.max(0, score));
};

const scoreOcrBurden = (ocrBurdenLevel: NormalizationOcrBurdenLevel): number => {
  const ocrBurdenScores: Record<NormalizationOcrBurdenLevel, number> = {
    none: 1,
    low: 0.82,
    medium: 0.55,
    high: 0.25,
    blocking: 0,
  };

  return ocrBurdenScores[ocrBurdenLevel];
};

const inferOcrBurdenLevel = (
  sourceFormat: SourceFormat | null | undefined,
  parserFamily: ParserStrategyFamily | null | undefined,
  explicitBurden: NormalizationOcrBurdenLevel | null | undefined,
): NormalizationOcrBurdenLevel => {
  if (explicitBurden) {
    return explicitBurden;
  }

  if (sourceFormat === "scanned_image" || parserFamily === "image_ocr_candidate") {
    return "blocking";
  }

  if (sourceFormat === "pdf" || parserFamily === "text_pdf" || parserFamily === "scanned_pdf") {
    return "high";
  }

  return "none";
};

const inferStructuredDataQuality = (
  sourceFormat: SourceFormat | null | undefined,
  parserFamily: ParserStrategyFamily | null | undefined,
  explicitQuality: number | null | undefined,
): number => {
  if (typeof explicitQuality === "number") {
    return clampScore(explicitQuality);
  }

  if (parserFamily && structuredParserFamilies.includes(parserFamily)) {
    return sourceFormat === "html_table" ? 0.72 : 0.9;
  }

  if (sourceFormat === "pdf") {
    return 0.3;
  }

  return 0;
};

const inferCompletenessScore = (score: number | null | undefined): number => clampScore(score ?? 0);

const inferAmbiguityScore = (
  score: number | null | undefined,
  sourceFormat: SourceFormat | null | undefined,
  parserFamily: ParserStrategyFamily | null | undefined,
): number => {
  if (typeof score === "number") {
    return clampScore(score);
  }

  if (!sourceFormat || sourceFormat === "unknown" || !parserFamily || parserFamily === "unknown") {
    return 1;
  }

  if (sourceFormat === "mixed_source" || manualOnlyParserFamilies.includes(parserFamily)) {
    return 0.85;
  }

  return 0.25;
};

const inferParserReadinessScore = (
  score: number | null | undefined,
  parserFamily: ParserStrategyFamily | null | undefined,
): number => {
  if (typeof score === "number") {
    return clampScore(score);
  }

  if (!parserFamily || parserFamily === "unknown") {
    return 0;
  }

  if (structuredParserFamilies.includes(parserFamily)) {
    return 0.85;
  }

  if (parserFamily === "text_pdf" || parserFamily === "scanned_pdf") {
    return 0.35;
  }

  return 0.1;
};

const inferRiskScore = (
  score: number | null | undefined,
  sourceFormat: SourceFormat | null | undefined,
  ocrBurdenLevel: NormalizationOcrBurdenLevel,
): number => {
  if (typeof score === "number") {
    return clampScore(score);
  }

  if (!sourceFormat || sourceFormat === "unknown" || ocrBurdenLevel === "blocking") {
    return 0.9;
  }

  if (ocrBurdenLevel === "high") {
    return 0.72;
  }

  return 0.3;
};

const getReadinessLevel = (
  score: number,
  warningCodes: readonly NormalizationReadinessWarningCode[],
): NormalizationReadinessLevel => {
  const substantiveWarningCodes = warningCodes.filter(
    (code) =>
      code !== "manual_review_required" &&
      code !== "normalization_execution_blocked" &&
      code !== "planning_only_no_execution",
  );

  if (
    warningCodes.includes("missing_source_format") ||
    warningCodes.includes("unknown_source_format") ||
    warningCodes.includes("missing_parser_family") ||
    warningCodes.includes("unknown_parser_family")
  ) {
    return "unsafe_unknown";
  }

  if (
    warningCodes.includes("ocr_burden_high") ||
    warningCodes.includes("risk_high") ||
    score < NormalizationReadinessThresholds.heavy
  ) {
    return "manual_only";
  }

  if (score >= NormalizationReadinessThresholds.ready && substantiveWarningCodes.length === 0) {
    return "ready_for_future_normalization";
  }

  if (score >= NormalizationReadinessThresholds.moderate) {
    return "moderate_review_required";
  }

  return "heavy_review_required";
};

const getHumanReviewIntensity = (readinessLevel: NormalizationReadinessLevel): NormalizationHumanReviewIntensity => {
  const reviewIntensityByLevel: Record<NormalizationReadinessLevel, NormalizationHumanReviewIntensity> = {
    ready_for_future_normalization: "low",
    moderate_review_required: "medium",
    heavy_review_required: "high",
    manual_only: "mandatory",
    unsafe_unknown: "mandatory",
  };

  return reviewIntensityByLevel[readinessLevel];
};

const getEstimatedDifficulty = (readinessLevel: NormalizationReadinessLevel): EstimatedNormalizationDifficulty => {
  const difficultyByLevel: Record<NormalizationReadinessLevel, EstimatedNormalizationDifficulty> = {
    ready_for_future_normalization: "low",
    moderate_review_required: "medium",
    heavy_review_required: "high",
    manual_only: "manual_only",
    unsafe_unknown: "unsafe_unknown",
  };

  return difficultyByLevel[readinessLevel];
};

export function evaluateNormalizationReadiness(
  input: NormalizationReadinessInput,
): NormalizationReadinessResult {
  const sourceFormat = input.sourceFormat ?? null;
  const parserFamily = input.parserFamily ?? null;
  const ocrBurdenLevel = inferOcrBurdenLevel(sourceFormat, parserFamily, input.ocrBurdenLevel);
  const structuredDataQuality = inferStructuredDataQuality(sourceFormat, parserFamily, input.structuredDataQuality);
  const completenessScore = inferCompletenessScore(input.completenessScore);
  const ambiguityScore = inferAmbiguityScore(input.ambiguityScore, sourceFormat, parserFamily);
  const parserReadinessScore = inferParserReadinessScore(input.parserReadinessScore, parserFamily);
  const riskScore = inferRiskScore(input.riskScore, sourceFormat, ocrBurdenLevel);
  const ocrBurdenScore = scoreOcrBurden(ocrBurdenLevel);
  const warningCodes: NormalizationReadinessWarningCode[] = [];

  if (!sourceFormat) {
    warningCodes.push("missing_source_format");
  }

  if (sourceFormat === "unknown") {
    warningCodes.push("unknown_source_format");
  }

  if (!parserFamily) {
    warningCodes.push("missing_parser_family");
  }

  if (parserFamily === "unknown") {
    warningCodes.push("unknown_parser_family");
  }

  if (ocrBurdenLevel === "high" || ocrBurdenLevel === "blocking") {
    warningCodes.push("ocr_burden_high");
  }

  if (structuredDataQuality < NormalizationReadinessThresholds.minimumStructuredDataQuality) {
    warningCodes.push("structured_data_quality_low");
  }

  if (completenessScore < NormalizationReadinessThresholds.minimumCompleteness) {
    warningCodes.push("completeness_low");
  }

  if (ambiguityScore > NormalizationReadinessThresholds.maximumAmbiguity) {
    warningCodes.push("ambiguity_high");
  }

  if (parserReadinessScore < NormalizationReadinessThresholds.minimumParserReadiness) {
    warningCodes.push("parser_readiness_low");
  }

  if (riskScore > NormalizationReadinessThresholds.maximumRisk) {
    warningCodes.push("risk_high");
  }

  warningCodes.push("manual_review_required");
  warningCodes.push("normalization_execution_blocked");
  warningCodes.push("planning_only_no_execution");

  const normalizationReadinessScore = clampScore(
    structuredDataQuality * 0.25 +
      completenessScore * 0.25 +
      (1 - ambiguityScore) * 0.18 +
      parserReadinessScore * 0.17 +
      ocrBurdenScore * 0.1 +
      (1 - riskScore) * 0.05,
  );
  const readinessLevel = getReadinessLevel(normalizationReadinessScore, warningCodes);

  return {
    readinessLevel,
    normalizationReadinessScore,
    completenessScore,
    ambiguityScore,
    humanReviewIntensity: getHumanReviewIntensity(readinessLevel),
    estimatedNormalizationDifficulty: getEstimatedDifficulty(readinessLevel),
    warningCodes,
    ingestionBlocked: NormalizationReadinessFailClosedDefaults.ingestionBlocked,
    automationBlocked: NormalizationReadinessFailClosedDefaults.automationBlocked,
    normalizationExecutionAllowed: NormalizationReadinessFailClosedDefaults.normalizationExecutionAllowed,
    normalizationPlanningOnly: NormalizationReadinessFailClosedDefaults.normalizationPlanningOnly,
    failClosed: NormalizationReadinessFailClosedDefaults.failClosed,
  };
}
