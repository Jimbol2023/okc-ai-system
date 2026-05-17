/**
 * County capability registry contracts.
 *
 * Planning-only metadata for Oklahoma/public-record source ecosystems.
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

import type { ParserStrategyFamily } from "./parser-strategy-planner";
import type { SourceFormat } from "./source-format-classifier";

export type CountySourceCategory =
  | "tax_resale"
  | "tax_lien"
  | "assessor"
  | "treasurer"
  | "court_records"
  | "code_violations"
  | "GIS"
  | "clerk_records"
  | "auction_lists"
  | "manual_upload_only";

export type CountyUpdateFrequencyEstimate =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "annual"
  | "event_driven"
  | "unknown";

export type CountyHumanReviewIntensity = "low" | "medium" | "high" | "mandatory";

export type CountyCapabilityRiskLevel = "low" | "medium" | "high" | "unknown";

export type CountyCapabilityWarningCode =
  | "missing_county"
  | "missing_state"
  | "missing_supported_source_formats"
  | "missing_source_categories"
  | "manual_source_verification_required"
  | "limited_format_support"
  | "ocr_feasibility_uncertain"
  | "parser_feasibility_low"
  | "normalization_readiness_low"
  | "update_frequency_unknown"
  | "high_human_review_intensity"
  | "high_ambiguity_or_risk"
  | "planning_only_no_execution";

export interface CountyCapabilityWarning {
  code: CountyCapabilityWarningCode;
  field?: string | null;
  message: string;
}

export interface CountySourceAvailabilityMetadata {
  category: CountySourceCategory;
  availability: "known" | "likely" | "unknown" | "manual_only";
  supportedFormats: readonly SourceFormat[];
  updateFrequencyEstimate: CountyUpdateFrequencyEstimate;
  confidence: number;
  humanReviewRequired: boolean;
}

export interface CountyCapabilityProfile {
  countyName: string;
  state: "OK";
  supportedSourceFormats: readonly SourceFormat[];
  knownSourceCategories: readonly CountySourceCategory[];
  sourceAvailability: readonly CountySourceAvailabilityMetadata[];
  parserFamilies: readonly ParserStrategyFamily[];
  parserFeasibility: number;
  ocrFeasibility: number;
  updateFrequencyEstimate: CountyUpdateFrequencyEstimate;
  normalizationReadiness: number;
  humanReviewIntensity: CountyHumanReviewIntensity;
  ambiguityRisk: CountyCapabilityRiskLevel;
  confidence: number;
  warnings: readonly CountyCapabilityWarning[];
  ingestionBlocked: boolean;
  automationBlocked: boolean;
  parserExecutionAllowed: false;
  capabilityPlanningOnly: true;
}

export interface CountyCapabilityRegistrySummary {
  totalCounties: number;
  humanReviewRequiredCounties: number;
  ingestionBlockedCounties: number;
  automationBlockedCounties: number;
  parserBlockedCounties: number;
  ocrFeasibleCounties: number;
  highRiskCounties: number;
  highReviewCounties: number;
  lowNormalizationReadinessCounties: number;
  ocrCandidateCounties: number;
  unknownUpdateFrequencyCounties: number;
  ingestionBlocked: boolean;
  automationBlocked: boolean;
  parserExecutionAllowed: false;
  capabilityPlanningOnly: true;
  warningCodes: readonly CountyCapabilityWarningCode[];
}

export const CountyCapabilityRegistryVersion = "S3-COUNTY-CAPABILITY-REGISTRY-V1" as const;

export const CountyCapabilityFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  parserExecutionAllowed: false,
  capabilityPlanningOnly: true,
} as const;

export const CountyCapabilityThresholds = {
  minimumParserFeasibility: 0.7,
  minimumOcrFeasibility: 0.55,
  minimumNormalizationReadiness: 0.7,
  minimumConfidence: 0.75,
} as const;

const COUNTY_CAPABILITY_WARNING_MESSAGES: Record<CountyCapabilityWarningCode, string> = {
  missing_county: "County name is required before capability metadata can be considered review-ready.",
  missing_state: "State is required before capability metadata can be considered review-ready.",
  missing_supported_source_formats: "Supported source formats are required for capability planning.",
  missing_source_categories: "Known source categories are required for capability planning.",
  manual_source_verification_required: "County source capabilities require manual verification before use.",
  limited_format_support: "County source format support is limited or incomplete.",
  ocr_feasibility_uncertain: "OCR feasibility is uncertain and must remain planning-only.",
  parser_feasibility_low: "Parser feasibility is below the planning threshold.",
  normalization_readiness_low: "Normalization readiness is below the planning threshold.",
  update_frequency_unknown: "Update frequency is unknown and requires manual review.",
  high_human_review_intensity: "County capability profile requires elevated human review.",
  high_ambiguity_or_risk: "County capability profile has elevated ambiguity or risk.",
  planning_only_no_execution: "County capability registry is metadata only and never allows execution.",
};

const createCountyCapabilityWarning = (
  code: CountyCapabilityWarningCode,
  field?: string,
): CountyCapabilityWarning => ({
  code,
  field,
  message: COUNTY_CAPABILITY_WARNING_MESSAGES[code],
});

export const OklahomaCountyCapabilityProfiles = [
  {
    countyName: "Oklahoma County",
    state: "OK",
    supportedSourceFormats: ["csv", "spreadsheet", "pdf", "html_table"],
    knownSourceCategories: ["tax_resale", "assessor", "treasurer", "clerk_records", "auction_lists"],
    sourceAvailability: [
      {
        category: "tax_resale",
        availability: "known",
        supportedFormats: ["pdf", "csv"],
        updateFrequencyEstimate: "annual",
        confidence: 0.8,
        humanReviewRequired: true,
      },
      {
        category: "assessor",
        availability: "likely",
        supportedFormats: ["html_table", "csv"],
        updateFrequencyEstimate: "weekly",
        confidence: 0.7,
        humanReviewRequired: true,
      },
    ],
    parserFamilies: ["csv_structured", "spreadsheet_structured", "html_table", "text_pdf"],
    parserFeasibility: 0.78,
    ocrFeasibility: 0.58,
    updateFrequencyEstimate: "weekly",
    normalizationReadiness: 0.72,
    humanReviewIntensity: "medium",
    ambiguityRisk: "medium",
    confidence: 0.76,
  },
  {
    countyName: "Canadian County",
    state: "OK",
    supportedSourceFormats: ["csv", "spreadsheet", "pdf"],
    knownSourceCategories: ["tax_resale", "assessor", "treasurer", "GIS"],
    sourceAvailability: [
      {
        category: "assessor",
        availability: "likely",
        supportedFormats: ["html_table", "csv"],
        updateFrequencyEstimate: "weekly",
        confidence: 0.68,
        humanReviewRequired: true,
      },
    ],
    parserFamilies: ["csv_structured", "spreadsheet_structured", "text_pdf"],
    parserFeasibility: 0.72,
    ocrFeasibility: 0.5,
    updateFrequencyEstimate: "weekly",
    normalizationReadiness: 0.7,
    humanReviewIntensity: "medium",
    ambiguityRisk: "medium",
    confidence: 0.7,
  },
  {
    countyName: "Cleveland County",
    state: "OK",
    supportedSourceFormats: ["pdf", "manual_entry", "unknown"],
    knownSourceCategories: ["tax_resale", "assessor", "manual_upload_only"],
    sourceAvailability: [
      {
        category: "manual_upload_only",
        availability: "manual_only",
        supportedFormats: ["manual_entry", "pdf"],
        updateFrequencyEstimate: "unknown",
        confidence: 0.55,
        humanReviewRequired: true,
      },
    ],
    parserFamilies: ["text_pdf", "manual_review_only", "unknown"],
    parserFeasibility: 0.45,
    ocrFeasibility: 0.35,
    updateFrequencyEstimate: "unknown",
    normalizationReadiness: 0.45,
    humanReviewIntensity: "mandatory",
    ambiguityRisk: "high",
    confidence: 0.52,
  },
  {
    countyName: "Logan County",
    state: "OK",
    supportedSourceFormats: ["pdf", "html_table", "manual_entry"],
    knownSourceCategories: ["assessor", "treasurer", "clerk_records", "manual_upload_only"],
    sourceAvailability: [
      {
        category: "treasurer",
        availability: "unknown",
        supportedFormats: ["pdf", "manual_entry"],
        updateFrequencyEstimate: "unknown",
        confidence: 0.5,
        humanReviewRequired: true,
      },
    ],
    parserFamilies: ["html_table", "text_pdf", "manual_review_only"],
    parserFeasibility: 0.58,
    ocrFeasibility: 0.42,
    updateFrequencyEstimate: "unknown",
    normalizationReadiness: 0.55,
    humanReviewIntensity: "high",
    ambiguityRisk: "high",
    confidence: 0.56,
  },
  {
    countyName: "Pottawatomie County",
    state: "OK",
    supportedSourceFormats: ["spreadsheet", "pdf", "manual_entry"],
    knownSourceCategories: ["tax_resale", "assessor", "treasurer"],
    sourceAvailability: [
      {
        category: "tax_resale",
        availability: "likely",
        supportedFormats: ["pdf", "spreadsheet"],
        updateFrequencyEstimate: "annual",
        confidence: 0.64,
        humanReviewRequired: true,
      },
    ],
    parserFamilies: ["spreadsheet_structured", "text_pdf", "manual_review_only"],
    parserFeasibility: 0.66,
    ocrFeasibility: 0.38,
    updateFrequencyEstimate: "annual",
    normalizationReadiness: 0.62,
    humanReviewIntensity: "high",
    ambiguityRisk: "medium",
    confidence: 0.63,
  },
  {
    countyName: "Payne County",
    state: "OK",
    supportedSourceFormats: ["csv", "spreadsheet", "html_table"],
    knownSourceCategories: ["assessor", "treasurer", "GIS", "clerk_records"],
    sourceAvailability: [
      {
        category: "assessor",
        availability: "likely",
        supportedFormats: ["csv", "html_table"],
        updateFrequencyEstimate: "monthly",
        confidence: 0.66,
        humanReviewRequired: true,
      },
    ],
    parserFamilies: ["csv_structured", "spreadsheet_structured", "html_table"],
    parserFeasibility: 0.74,
    ocrFeasibility: 0.2,
    updateFrequencyEstimate: "monthly",
    normalizationReadiness: 0.71,
    humanReviewIntensity: "medium",
    ambiguityRisk: "medium",
    confidence: 0.69,
  },
  {
    countyName: "Grady County",
    state: "OK",
    supportedSourceFormats: ["pdf", "manual_entry", "unknown"],
    knownSourceCategories: ["tax_resale", "assessor", "manual_upload_only"],
    sourceAvailability: [
      {
        category: "manual_upload_only",
        availability: "manual_only",
        supportedFormats: ["pdf", "manual_entry"],
        updateFrequencyEstimate: "event_driven",
        confidence: 0.52,
        humanReviewRequired: true,
      },
    ],
    parserFamilies: ["text_pdf", "manual_review_only", "unknown"],
    parserFeasibility: 0.5,
    ocrFeasibility: 0.32,
    updateFrequencyEstimate: "event_driven",
    normalizationReadiness: 0.5,
    humanReviewIntensity: "mandatory",
    ambiguityRisk: "high",
    confidence: 0.5,
  },
  {
    countyName: "Lincoln County",
    state: "OK",
    supportedSourceFormats: ["pdf", "manual_entry"],
    knownSourceCategories: ["tax_resale", "assessor", "manual_upload_only"],
    sourceAvailability: [
      {
        category: "manual_upload_only",
        availability: "manual_only",
        supportedFormats: ["manual_entry"],
        updateFrequencyEstimate: "unknown",
        confidence: 0.45,
        humanReviewRequired: true,
      },
    ],
    parserFamilies: ["text_pdf", "manual_review_only"],
    parserFeasibility: 0.42,
    ocrFeasibility: 0.28,
    updateFrequencyEstimate: "unknown",
    normalizationReadiness: 0.42,
    humanReviewIntensity: "mandatory",
    ambiguityRisk: "high",
    confidence: 0.45,
  },
  {
    countyName: "Tulsa County",
    state: "OK",
    supportedSourceFormats: ["spreadsheet", "pdf", "html_table"],
    knownSourceCategories: ["tax_resale", "assessor", "treasurer", "court_records", "auction_lists"],
    sourceAvailability: [
      {
        category: "tax_resale",
        availability: "likely",
        supportedFormats: ["pdf", "spreadsheet"],
        updateFrequencyEstimate: "annual",
        confidence: 0.72,
        humanReviewRequired: true,
      },
    ],
    parserFamilies: ["spreadsheet_structured", "html_table", "text_pdf"],
    parserFeasibility: 0.7,
    ocrFeasibility: 0.4,
    updateFrequencyEstimate: "monthly",
    normalizationReadiness: 0.68,
    humanReviewIntensity: "high",
    ambiguityRisk: "medium",
    confidence: 0.72,
  },
  {
    countyName: "Comanche County",
    state: "OK",
    supportedSourceFormats: ["spreadsheet", "pdf", "html_table"],
    knownSourceCategories: ["tax_resale", "assessor", "treasurer", "court_records"],
    sourceAvailability: [
      {
        category: "tax_resale",
        availability: "likely",
        supportedFormats: ["pdf", "spreadsheet"],
        updateFrequencyEstimate: "annual",
        confidence: 0.62,
        humanReviewRequired: true,
      },
    ],
    parserFamilies: ["spreadsheet_structured", "html_table", "text_pdf"],
    parserFeasibility: 0.65,
    ocrFeasibility: 0.4,
    updateFrequencyEstimate: "annual",
    normalizationReadiness: 0.6,
    humanReviewIntensity: "high",
    ambiguityRisk: "medium",
    confidence: 0.62,
  },
] as const satisfies readonly Omit<CountyCapabilityProfile, "warnings" | "ingestionBlocked" | "automationBlocked" | "parserExecutionAllowed" | "capabilityPlanningOnly">[];

export function getCountyCapabilityWarnings(
  profile: Omit<CountyCapabilityProfile, "warnings" | "ingestionBlocked" | "automationBlocked" | "parserExecutionAllowed" | "capabilityPlanningOnly">,
): readonly CountyCapabilityWarning[] {
  const warnings: CountyCapabilityWarning[] = [];

  if (!profile.countyName.trim()) {
    warnings.push(createCountyCapabilityWarning("missing_county", "countyName"));
  }

  if (!profile.state.trim()) {
    warnings.push(createCountyCapabilityWarning("missing_state", "state"));
  }

  if (profile.supportedSourceFormats.length === 0) {
    warnings.push(createCountyCapabilityWarning("missing_supported_source_formats", "supportedSourceFormats"));
  }

  if (profile.knownSourceCategories.length === 0) {
    warnings.push(createCountyCapabilityWarning("missing_source_categories", "knownSourceCategories"));
  }

  if (profile.sourceAvailability.some((source) => source.humanReviewRequired || source.availability !== "known")) {
    warnings.push(createCountyCapabilityWarning("manual_source_verification_required", "sourceAvailability"));
  }

  if (profile.supportedSourceFormats.length < 3 || profile.supportedSourceFormats.includes("unknown")) {
    warnings.push(createCountyCapabilityWarning("limited_format_support", "supportedSourceFormats"));
  }

  if (
    profile.supportedSourceFormats.some((format) => format === "pdf" || format === "scanned_image") &&
    profile.ocrFeasibility < CountyCapabilityThresholds.minimumOcrFeasibility
  ) {
    warnings.push(createCountyCapabilityWarning("ocr_feasibility_uncertain", "ocrFeasibility"));
  }

  if (profile.parserFeasibility < CountyCapabilityThresholds.minimumParserFeasibility) {
    warnings.push(createCountyCapabilityWarning("parser_feasibility_low", "parserFeasibility"));
  }

  if (profile.normalizationReadiness < CountyCapabilityThresholds.minimumNormalizationReadiness) {
    warnings.push(createCountyCapabilityWarning("normalization_readiness_low", "normalizationReadiness"));
  }

  if (profile.updateFrequencyEstimate === "unknown") {
    warnings.push(createCountyCapabilityWarning("update_frequency_unknown", "updateFrequencyEstimate"));
  }

  if (profile.humanReviewIntensity === "high" || profile.humanReviewIntensity === "mandatory") {
    warnings.push(createCountyCapabilityWarning("high_human_review_intensity", "humanReviewIntensity"));
  }

  if (profile.ambiguityRisk === "high" || profile.ambiguityRisk === "unknown") {
    warnings.push(createCountyCapabilityWarning("high_ambiguity_or_risk", "ambiguityRisk"));
  }

  warnings.push(createCountyCapabilityWarning("planning_only_no_execution"));

  return warnings;
}

export function createCountyCapabilityProfile(
  profile: Omit<CountyCapabilityProfile, "warnings" | "ingestionBlocked" | "automationBlocked" | "parserExecutionAllowed" | "capabilityPlanningOnly">,
): CountyCapabilityProfile {
  return {
    ...profile,
    warnings: getCountyCapabilityWarnings(profile),
    ingestionBlocked: CountyCapabilityFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountyCapabilityFailClosedDefaults.automationBlocked,
    parserExecutionAllowed: CountyCapabilityFailClosedDefaults.parserExecutionAllowed,
    capabilityPlanningOnly: CountyCapabilityFailClosedDefaults.capabilityPlanningOnly,
  };
}

export function getOklahomaCountyCapabilityRegistry(): readonly CountyCapabilityProfile[] {
  return OklahomaCountyCapabilityProfiles.map((profile) => createCountyCapabilityProfile(profile));
}

export function findCountyCapabilityProfile(
  countyName: string,
  state: string = "OK",
): CountyCapabilityProfile | null {
  const normalizeCountyName = (value: string): string =>
    value.trim().toLowerCase().replace(/\s+county$/, "");
  const normalizedCounty = normalizeCountyName(countyName);
  const normalizedState = state.trim().toUpperCase();

  return (
    getOklahomaCountyCapabilityRegistry().find(
      (profile) =>
        normalizeCountyName(profile.countyName) === normalizedCounty && profile.state === normalizedState,
    ) ?? null
  );
}

export function summarizeCountyCapabilityRegistry(
  profiles: readonly CountyCapabilityProfile[],
): CountyCapabilityRegistrySummary {
  const warningCodes = [...new Set(profiles.flatMap((profile) => profile.warnings.map((warning) => warning.code)))];

  return {
    totalCounties: profiles.length,
    humanReviewRequiredCounties: profiles.filter((profile) => profile.warnings.length > 1).length,
    ingestionBlockedCounties: profiles.filter((profile) => profile.ingestionBlocked).length,
    automationBlockedCounties: profiles.filter((profile) => profile.automationBlocked).length,
    parserBlockedCounties: profiles.filter((profile) => profile.parserExecutionAllowed === false).length,
    ocrFeasibleCounties: profiles.filter(
      (profile) => profile.ocrFeasibility >= CountyCapabilityThresholds.minimumOcrFeasibility,
    ).length,
    highRiskCounties: profiles.filter((profile) => profile.ambiguityRisk === "high").length,
    highReviewCounties: profiles.filter(
      (profile) => profile.humanReviewIntensity === "high" || profile.humanReviewIntensity === "mandatory",
    ).length,
    lowNormalizationReadinessCounties: profiles.filter(
      (profile) => profile.normalizationReadiness < CountyCapabilityThresholds.minimumNormalizationReadiness,
    ).length,
    ocrCandidateCounties: profiles.filter(
      (profile) => profile.supportedSourceFormats.some((format) => format === "pdf" || format === "scanned_image"),
    ).length,
    unknownUpdateFrequencyCounties: profiles.filter((profile) => profile.updateFrequencyEstimate === "unknown").length,
    ingestionBlocked: CountyCapabilityFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountyCapabilityFailClosedDefaults.automationBlocked,
    parserExecutionAllowed: CountyCapabilityFailClosedDefaults.parserExecutionAllowed,
    capabilityPlanningOnly: CountyCapabilityFailClosedDefaults.capabilityPlanningOnly,
    warningCodes,
  };
}
