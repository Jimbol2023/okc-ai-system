/**
 * Parser strategy planning contracts.
 *
 * Planning-only metadata for county/public-record parser strategy selection.
 *
 * Strictly planning metadata only:
 * - no scraping
 * - no fetch calls
 * - no OCR execution
 * - no parser execution
 * - no ingestion
 * - no database writes
 * - no dashboard/API wiring
 */

import type { SourceFormat } from "./source-format-classifier";

export type ParserStrategyFamily =
  | "csv_structured"
  | "spreadsheet_structured"
  | "html_table"
  | "text_pdf"
  | "scanned_pdf"
  | "image_ocr_candidate"
  | "manual_review_only"
  | "unknown";

export type ParserStrategyAmbiguityLevel = "none" | "low" | "medium" | "high";

export type ParserStrategyWarningCode =
  | "unknown_source_format"
  | "ocr_required"
  | "ocr_feasibility_uncertain"
  | "low_structured_data_likelihood"
  | "low_normalization_readiness"
  | "low_parser_confidence"
  | "ambiguous_parser_strategy"
  | "human_review_required"
  | "planning_only_no_execution";

export interface ParserStrategyWarning {
  code: ParserStrategyWarningCode;
  field?: string | null;
  message: string;
}

export interface ParserStrategyPlanningInput {
  sourceFormat: SourceFormat;
  sourceLabel?: string | null;
  declaredContentType?: string | null;
  filename?: string | null;
  parserConfidence?: number | null;
  ambiguityLevel?: ParserStrategyAmbiguityLevel;
}

export interface ParserStrategyPlan {
  sourceFormat: SourceFormat;
  parserFamily: ParserStrategyFamily;
  ocrRequired: boolean;
  ocrFeasibility: number;
  structuredDataLikelihood: number;
  normalizationReadiness: number;
  parserConfidence: number;
  ambiguityLevel: ParserStrategyAmbiguityLevel;
  warnings: readonly ParserStrategyWarning[];
  humanReviewRequired: boolean;
  ingestionBlocked: boolean;
  automationBlocked: boolean;
  parserExecutionAllowed: false;
  parserPlanningOnly: true;
}

export interface ParserStrategyPlanSummary {
  totalStrategies: number;
  humanReviewRequiredStrategies: number;
  ocrRequiredStrategies: number;
  blockedStrategies: number;
  ambiguousStrategies: number;
  lowConfidenceStrategies: number;
  ingestionBlocked: boolean;
  automationBlocked: boolean;
  parserExecutionAllowed: false;
  parserPlanningOnly: true;
  warningCodes: readonly ParserStrategyWarningCode[];
}

export interface ParserStrategyFormatMetadata {
  parserFamily: ParserStrategyFamily;
  ocrRequired: boolean;
  ocrFeasibility: number;
  structuredDataLikelihood: number;
  normalizationReadiness: number;
  parserConfidence: number;
  ambiguityLevel: ParserStrategyAmbiguityLevel;
  humanReviewRequired: boolean;
}

export const ParserStrategyPlannerVersion = "S2D-PARSER-STRATEGY-PLANNER-V1" as const;

export const ParserStrategyFailClosedDefaults = {
  humanReviewRequired: true,
  ingestionBlocked: true,
  automationBlocked: true,
  parserExecutionAllowed: false,
  parserPlanningOnly: true,
} as const;

export const ParserStrategyConfidenceThresholds = {
  minimumReviewFreeConfidence: 0.85,
  minimumStructuredDataLikelihood: 0.7,
  minimumNormalizationReadiness: 0.7,
  uncertainOcrFeasibility: 0.5,
} as const;

export const ParserStrategyMetadataBySourceFormat: Record<SourceFormat, ParserStrategyFormatMetadata> = {
  csv: {
    parserFamily: "csv_structured",
    ocrRequired: false,
    ocrFeasibility: 0,
    structuredDataLikelihood: 0.95,
    normalizationReadiness: 0.9,
    parserConfidence: 0.95,
    ambiguityLevel: "none",
    humanReviewRequired: false,
  },
  spreadsheet: {
    parserFamily: "spreadsheet_structured",
    ocrRequired: false,
    ocrFeasibility: 0,
    structuredDataLikelihood: 0.9,
    normalizationReadiness: 0.85,
    parserConfidence: 0.9,
    ambiguityLevel: "low",
    humanReviewRequired: true,
  },
  html_table: {
    parserFamily: "html_table",
    ocrRequired: false,
    ocrFeasibility: 0,
    structuredDataLikelihood: 0.7,
    normalizationReadiness: 0.7,
    parserConfidence: 0.8,
    ambiguityLevel: "medium",
    humanReviewRequired: true,
  },
  pdf: {
    parserFamily: "text_pdf",
    ocrRequired: true,
    ocrFeasibility: 0.45,
    structuredDataLikelihood: 0.2,
    normalizationReadiness: 0.1,
    parserConfidence: 0.55,
    ambiguityLevel: "high",
    humanReviewRequired: true,
  },
  scanned_image: {
    parserFamily: "image_ocr_candidate",
    ocrRequired: true,
    ocrFeasibility: 0.35,
    structuredDataLikelihood: 0.05,
    normalizationReadiness: 0.05,
    parserConfidence: 0.4,
    ambiguityLevel: "high",
    humanReviewRequired: true,
  },
  manual_entry: {
    parserFamily: "manual_review_only",
    ocrRequired: false,
    ocrFeasibility: 0,
    structuredDataLikelihood: 0,
    normalizationReadiness: 0.1,
    parserConfidence: 0.25,
    ambiguityLevel: "high",
    humanReviewRequired: true,
  },
  mixed_source: {
    parserFamily: "manual_review_only",
    ocrRequired: false,
    ocrFeasibility: 0.2,
    structuredDataLikelihood: 0.5,
    normalizationReadiness: 0.4,
    parserConfidence: 0.45,
    ambiguityLevel: "high",
    humanReviewRequired: true,
  },
  unknown: {
    parserFamily: "unknown",
    ocrRequired: false,
    ocrFeasibility: 0,
    structuredDataLikelihood: 0,
    normalizationReadiness: 0,
    parserConfidence: 0,
    ambiguityLevel: "high",
    humanReviewRequired: true,
  },
};

const PARSER_STRATEGY_WARNING_MESSAGES: Record<ParserStrategyWarningCode, string> = {
  unknown_source_format: "Source format is unknown, so parser strategy must remain human-review gated.",
  ocr_required: "OCR may be required, but OCR execution is not allowed in planning mode.",
  ocr_feasibility_uncertain: "OCR feasibility is too uncertain for review-free parser planning.",
  low_structured_data_likelihood: "Structured data likelihood is below the review-free threshold.",
  low_normalization_readiness: "Normalization readiness is below the review-free threshold.",
  low_parser_confidence: "Parser confidence is below the review-free threshold.",
  ambiguous_parser_strategy: "Parser strategy is ambiguous and requires human review.",
  human_review_required: "Human review is required before parser design can advance.",
  planning_only_no_execution: "Parser strategy plans are metadata only and never allow execution.",
};

const clampScore = (score: number | null | undefined): number => {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return 0;
  }

  return Math.min(1, Math.max(0, score));
};

const createParserStrategyWarning = (
  code: ParserStrategyWarningCode,
  field?: string,
): ParserStrategyWarning => ({
  code,
  field,
  message: PARSER_STRATEGY_WARNING_MESSAGES[code],
});

export function getParserStrategyMetadata(sourceFormat: SourceFormat): ParserStrategyFormatMetadata {
  return ParserStrategyMetadataBySourceFormat[sourceFormat];
}

export function getParserStrategyWarnings(
  input: ParserStrategyPlanningInput,
): readonly ParserStrategyWarning[] {
  const metadata = getParserStrategyMetadata(input.sourceFormat);
  const parserConfidence = clampScore(input.parserConfidence ?? metadata.parserConfidence);
  const ambiguityLevel = input.ambiguityLevel ?? metadata.ambiguityLevel;
  const warnings: ParserStrategyWarning[] = [];

  if (input.sourceFormat === "unknown") {
    warnings.push(createParserStrategyWarning("unknown_source_format", "sourceFormat"));
  }

  if (metadata.ocrRequired) {
    warnings.push(createParserStrategyWarning("ocr_required", "ocrRequired"));
  }

  if (
    metadata.ocrRequired &&
    metadata.ocrFeasibility < ParserStrategyConfidenceThresholds.uncertainOcrFeasibility
  ) {
    warnings.push(createParserStrategyWarning("ocr_feasibility_uncertain", "ocrFeasibility"));
  }

  if (metadata.structuredDataLikelihood < ParserStrategyConfidenceThresholds.minimumStructuredDataLikelihood) {
    warnings.push(createParserStrategyWarning("low_structured_data_likelihood", "structuredDataLikelihood"));
  }

  if (metadata.normalizationReadiness < ParserStrategyConfidenceThresholds.minimumNormalizationReadiness) {
    warnings.push(createParserStrategyWarning("low_normalization_readiness", "normalizationReadiness"));
  }

  if (parserConfidence < ParserStrategyConfidenceThresholds.minimumReviewFreeConfidence) {
    warnings.push(createParserStrategyWarning("low_parser_confidence", "parserConfidence"));
  }

  if (ambiguityLevel !== "none") {
    warnings.push(createParserStrategyWarning("ambiguous_parser_strategy", "ambiguityLevel"));
  }

  if (metadata.humanReviewRequired || warnings.length > 0) {
    warnings.push(createParserStrategyWarning("human_review_required"));
  }

  warnings.push(createParserStrategyWarning("planning_only_no_execution"));

  return warnings;
}

export function createParserStrategyPlan(input: ParserStrategyPlanningInput): ParserStrategyPlan {
  const metadata = getParserStrategyMetadata(input.sourceFormat);
  const parserConfidence = clampScore(input.parserConfidence ?? metadata.parserConfidence);
  const ambiguityLevel = input.ambiguityLevel ?? metadata.ambiguityLevel;
  const warnings = getParserStrategyWarnings(input);

  return {
    sourceFormat: input.sourceFormat,
    parserFamily: metadata.parserFamily,
    ocrRequired: metadata.ocrRequired,
    ocrFeasibility: metadata.ocrFeasibility,
    structuredDataLikelihood: metadata.structuredDataLikelihood,
    normalizationReadiness: metadata.normalizationReadiness,
    parserConfidence,
    ambiguityLevel,
    warnings,
    humanReviewRequired: warnings.length > 1,
    ingestionBlocked: ParserStrategyFailClosedDefaults.ingestionBlocked,
    automationBlocked: ParserStrategyFailClosedDefaults.automationBlocked,
    parserExecutionAllowed: ParserStrategyFailClosedDefaults.parserExecutionAllowed,
    parserPlanningOnly: ParserStrategyFailClosedDefaults.parserPlanningOnly,
  };
}

export function summarizeParserStrategyPlans(
  plans: readonly ParserStrategyPlan[],
): ParserStrategyPlanSummary {
  const warningCodes = [...new Set(plans.flatMap((plan) => plan.warnings.map((warning) => warning.code)))];
  const hasWarningCode = (plan: ParserStrategyPlan, code: ParserStrategyWarningCode): boolean =>
    plan.warnings.some((warning) => warning.code === code);

  return {
    totalStrategies: plans.length,
    humanReviewRequiredStrategies: plans.filter((plan) => plan.humanReviewRequired).length,
    ocrRequiredStrategies: plans.filter((plan) => plan.ocrRequired).length,
    blockedStrategies: plans.filter((plan) => plan.ingestionBlocked || plan.automationBlocked).length,
    ambiguousStrategies: plans.filter((plan) => hasWarningCode(plan, "ambiguous_parser_strategy")).length,
    lowConfidenceStrategies: plans.filter((plan) => hasWarningCode(plan, "low_parser_confidence")).length,
    ingestionBlocked: ParserStrategyFailClosedDefaults.ingestionBlocked,
    automationBlocked: ParserStrategyFailClosedDefaults.automationBlocked,
    parserExecutionAllowed: ParserStrategyFailClosedDefaults.parserExecutionAllowed,
    parserPlanningOnly: ParserStrategyFailClosedDefaults.parserPlanningOnly,
    warningCodes,
  };
}
