/**
 * County field mapping planning contracts.
 *
 * Planning-only metadata for describing how county/public-record source fields
 * may map into the Universal County Lead Schema.
 *
 * Strictly planning metadata only:
 * - no ingestion
 * - no parsing
 * - no scraping
 * - no database writes
 * - no dashboard/API wiring
 */

import type { SourceFormat } from "./source-format-classifier";

export type CountyFieldMappingTargetPath =
  | "source.sourceName"
  | "source.sourceCategory"
  | "source.sourceFormat"
  | "jurisdiction.countyName"
  | "jurisdiction.stateCode"
  | "identifiers.parcelNumber"
  | "identifiers.accountNumber"
  | "identifiers.taxId"
  | "identifiers.propertyId"
  | "propertyAddress.fullAddress"
  | "owner.ownerName"
  | "owner.mailingAddress.fullAddress"
  | "taxAuctionListMetadata.listName"
  | "taxAuctionListMetadata.listYear"
  | "taxAuctionListMetadata.taxYear"
  | "taxAuctionListMetadata.delinquentAmount"
  | "taxAuctionListMetadata.totalDue"
  | "taxAuctionListMetadata.auctionDate"
  | "saleResaleMetadata.resaleDate"
  | "saleResaleMetadata.resaleMinimumBid"
  | "assessedValues.assessedTotalValue"
  | "assessedValues.marketTotalValue"
  | "legalDescription.legalDescription"
  | "rawFieldReferences.rawFieldName";

export type CountyFieldMappingRequirement = "required" | "optional";

export type CountyFieldMappingAmbiguityLevel = "none" | "low" | "medium" | "high";

export type CountyFieldMappingWarningCode =
  | "missing_source_field_name"
  | "missing_target_field_path"
  | "missing_county"
  | "missing_state"
  | "unknown_source_format"
  | "low_confidence_mapping"
  | "ambiguous_mapping"
  | "required_mapping_needs_review"
  | "planning_only_no_execution";

export interface CountyFieldMappingWarning {
  code: CountyFieldMappingWarningCode;
  field?: string | null;
  message: string;
}

export interface CountyFieldMappingCandidate {
  sourceFieldName?: string | null;
  normalizedTargetFieldPath?: CountyFieldMappingTargetPath | null;
  county?: string | null;
  state?: string | null;
  sourceFormat?: SourceFormat | null;
  confidence?: number | null;
  requirement?: CountyFieldMappingRequirement;
  ambiguityLevel?: CountyFieldMappingAmbiguityLevel;
}

export interface CountyFieldMappingPlan {
  sourceFieldName: string | null;
  normalizedTargetFieldPath: CountyFieldMappingTargetPath | null;
  county: string | null;
  state: string | null;
  sourceFormat: SourceFormat | null;
  confidence: number;
  requirement: CountyFieldMappingRequirement;
  ambiguityLevel: CountyFieldMappingAmbiguityLevel;
  warnings: readonly CountyFieldMappingWarning[];
  humanReviewRequired: boolean;
  ingestionBlocked: boolean;
  automationBlocked: boolean;
  parserExecutionAllowed: false;
  mappingPlanningOnly: true;
}

export interface CountyFieldMappingPlanSummary {
  totalMappings: number;
  requiredMappings: number;
  optionalMappings: number;
  humanReviewRequiredMappings: number;
  blockedMappings: number;
  ambiguousMappings: number;
  lowConfidenceMappings: number;
  humanReviewRequired: boolean;
  ingestionBlocked: boolean;
  automationBlocked: boolean;
  parserExecutionAllowed: false;
  mappingPlanningOnly: true;
  warningCodes: readonly CountyFieldMappingWarningCode[];
}

export const CountyFieldMappingPlannerVersion = "S2C-COUNTY-FIELD-MAPPING-PLANNER-V1" as const;

export const CountyFieldMappingFailClosedDefaults = {
  humanReviewRequired: true,
  ingestionBlocked: true,
  automationBlocked: true,
  parserExecutionAllowed: false,
  mappingPlanningOnly: true,
} as const;

export const CountyFieldMappingConfidenceThresholds = {
  minimumReviewFreeConfidence: 0.85,
  lowConfidence: 0.5,
} as const;

export const CountyFieldMappingAmbiguityReviewLevels = ["low", "medium", "high"] as const;

const COUNTY_FIELD_MAPPING_WARNING_MESSAGES: Record<CountyFieldMappingWarningCode, string> = {
  missing_source_field_name: "Source field name is required before a mapping can be considered review-ready.",
  missing_target_field_path: "Normalized target field path is required before a mapping can be considered review-ready.",
  missing_county: "County is required before a mapping can be considered review-ready.",
  missing_state: "State is required before a mapping can be considered review-ready.",
  unknown_source_format: "Known source format is required before a mapping can be considered review-ready.",
  low_confidence_mapping: "Mapping confidence is below the review-free threshold.",
  ambiguous_mapping: "Mapping ambiguity requires human review.",
  required_mapping_needs_review: "Required mapping is not ready for automated use.",
  planning_only_no_execution: "Mapping plans are metadata only and never allow parser execution.",
};

const hasPlanningValue = (value: unknown): boolean => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return value !== null && value !== undefined;
};

const clampConfidence = (confidence: number | null | undefined): number => {
  if (typeof confidence !== "number" || Number.isNaN(confidence)) {
    return 0;
  }

  return Math.min(1, Math.max(0, confidence));
};

const createCountyFieldMappingWarning = (
  code: CountyFieldMappingWarningCode,
  field?: string,
): CountyFieldMappingWarning => ({
  code,
  field,
  message: COUNTY_FIELD_MAPPING_WARNING_MESSAGES[code],
});

export function getCountyFieldMappingWarnings(
  candidate: CountyFieldMappingCandidate,
): readonly CountyFieldMappingWarning[] {
  const confidence = clampConfidence(candidate.confidence);
  const requirement = candidate.requirement ?? "optional";
  const ambiguityLevel = candidate.ambiguityLevel ?? "high";
  const warnings: CountyFieldMappingWarning[] = [];

  if (!hasPlanningValue(candidate.sourceFieldName)) {
    warnings.push(createCountyFieldMappingWarning("missing_source_field_name", "sourceFieldName"));
  }

  if (!hasPlanningValue(candidate.normalizedTargetFieldPath)) {
    warnings.push(createCountyFieldMappingWarning("missing_target_field_path", "normalizedTargetFieldPath"));
  }

  if (!hasPlanningValue(candidate.county)) {
    warnings.push(createCountyFieldMappingWarning("missing_county", "county"));
  }

  if (!hasPlanningValue(candidate.state)) {
    warnings.push(createCountyFieldMappingWarning("missing_state", "state"));
  }

  if (!hasPlanningValue(candidate.sourceFormat) || candidate.sourceFormat === "unknown") {
    warnings.push(createCountyFieldMappingWarning("unknown_source_format", "sourceFormat"));
  }

  if (confidence < CountyFieldMappingConfidenceThresholds.minimumReviewFreeConfidence) {
    warnings.push(createCountyFieldMappingWarning("low_confidence_mapping", "confidence"));
  }

  if (ambiguityLevel !== "none") {
    warnings.push(createCountyFieldMappingWarning("ambiguous_mapping", "ambiguityLevel"));
  }

  if (requirement === "required" && warnings.length > 0) {
    warnings.push(createCountyFieldMappingWarning("required_mapping_needs_review"));
  }

  warnings.push(createCountyFieldMappingWarning("planning_only_no_execution"));

  return warnings;
}

export function createCountyFieldMappingPlan(
  candidate: CountyFieldMappingCandidate,
): CountyFieldMappingPlan {
  const warnings = getCountyFieldMappingWarnings(candidate);

  return {
    sourceFieldName: hasPlanningValue(candidate.sourceFieldName) ? String(candidate.sourceFieldName).trim() : null,
    normalizedTargetFieldPath: candidate.normalizedTargetFieldPath ?? null,
    county: hasPlanningValue(candidate.county) ? String(candidate.county).trim() : null,
    state: hasPlanningValue(candidate.state) ? String(candidate.state).trim() : null,
    sourceFormat: candidate.sourceFormat ?? null,
    confidence: clampConfidence(candidate.confidence),
    requirement: candidate.requirement ?? "optional",
    ambiguityLevel: candidate.ambiguityLevel ?? "high",
    warnings,
    humanReviewRequired: warnings.length > 1,
    ingestionBlocked: CountyFieldMappingFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountyFieldMappingFailClosedDefaults.automationBlocked,
    parserExecutionAllowed: CountyFieldMappingFailClosedDefaults.parserExecutionAllowed,
    mappingPlanningOnly: CountyFieldMappingFailClosedDefaults.mappingPlanningOnly,
  };
}

export function summarizeCountyFieldMappingPlans(
  plans: readonly CountyFieldMappingPlan[],
): CountyFieldMappingPlanSummary {
  const warningCodes = [...new Set(plans.flatMap((plan) => plan.warnings.map((warning) => warning.code)))];
  const hasWarningCode = (plan: CountyFieldMappingPlan, code: CountyFieldMappingWarningCode): boolean =>
    plan.warnings.some((warning) => warning.code === code);

  return {
    totalMappings: plans.length,
    requiredMappings: plans.filter((plan) => plan.requirement === "required").length,
    optionalMappings: plans.filter((plan) => plan.requirement === "optional").length,
    humanReviewRequiredMappings: plans.filter((plan) => plan.humanReviewRequired).length,
    blockedMappings: plans.filter((plan) => plan.ingestionBlocked || plan.automationBlocked).length,
    ambiguousMappings: plans.filter((plan) => hasWarningCode(plan, "ambiguous_mapping")).length,
    lowConfidenceMappings: plans.filter((plan) => hasWarningCode(plan, "low_confidence_mapping")).length,
    humanReviewRequired: plans.some((plan) => plan.humanReviewRequired),
    ingestionBlocked: CountyFieldMappingFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountyFieldMappingFailClosedDefaults.automationBlocked,
    parserExecutionAllowed: CountyFieldMappingFailClosedDefaults.parserExecutionAllowed,
    mappingPlanningOnly: CountyFieldMappingFailClosedDefaults.mappingPlanningOnly,
    warningCodes,
  };
}
