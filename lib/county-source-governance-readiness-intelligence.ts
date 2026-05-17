/**
 * County source governance readiness intelligence contracts.
 *
 * Advisory-only metadata for evaluating whether county/public-record source planning is governance-ready.
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

export type CountySourceGovernanceReadinessClassification =
  | "governance_ready"
  | "review_required"
  | "not_governance_ready"
  | "blocked";

export type CountySourceGovernanceWarningCode =
  | "MISSING_CONSTRAINT_DOCUMENTATION"
  | "MISSING_EXPLAINABILITY_DOCUMENTATION"
  | "HIGH_REVIEW_BURDEN"
  | "LOW_CONFIDENCE_STABILITY"
  | "HIGH_SOURCE_RISK"
  | "LOW_DATA_QUALITY"
  | "LOW_SURVIVABILITY"
  | "HUMAN_REVIEW_UNAVAILABLE"
  | "GOVERNANCE_BLOCKED";

export interface CountySourceGovernanceReadinessInput {
  sourceFormatClassification?: number | null;
  universalSchemaReadiness?: number | null;
  fieldMappingReadiness?: number | null;
  parserStrategyReadiness?: number | null;
  countyCapabilityReadiness?: number | null;
  normalizationReadiness?: number | null;
  sourceIntakeReadiness?: number | null;
  dataQualityReadiness?: number | null;
  countyRiskReadiness?: number | null;
  reviewBurdenReadiness?: number | null;
  confidenceStabilityReadiness?: number | null;
  sourceSurvivabilityReadiness?: number | null;
  constraintDocumentationPresent?: boolean | null;
  explainabilityDocumentationPresent?: boolean | null;
  humanReviewAvailable?: boolean | null;
}

export interface CountySourceGovernanceReadinessResult {
  governanceReadinessClassification: CountySourceGovernanceReadinessClassification;
  governanceReadinessScore: number;
  humanReviewRequired: boolean;
  readinessReasons: readonly string[];
  blockingReasons: readonly string[];
  warningCodes: readonly CountySourceGovernanceWarningCode[];
  explainabilitySummary: string;
  recommendedNextStep: string;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

export const CountySourceGovernanceReadinessIntelligenceVersion =
  "S11-COUNTY-SOURCE-GOVERNANCE-READINESS-INTELLIGENCE-V1" as const;

export const CountySourceGovernanceReadinessFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

export const CountySourceGovernanceWarningCodes: Record<
  CountySourceGovernanceWarningCode,
  CountySourceGovernanceWarningCode
> = {
  MISSING_CONSTRAINT_DOCUMENTATION: "MISSING_CONSTRAINT_DOCUMENTATION",
  MISSING_EXPLAINABILITY_DOCUMENTATION: "MISSING_EXPLAINABILITY_DOCUMENTATION",
  HIGH_REVIEW_BURDEN: "HIGH_REVIEW_BURDEN",
  LOW_CONFIDENCE_STABILITY: "LOW_CONFIDENCE_STABILITY",
  HIGH_SOURCE_RISK: "HIGH_SOURCE_RISK",
  LOW_DATA_QUALITY: "LOW_DATA_QUALITY",
  LOW_SURVIVABILITY: "LOW_SURVIVABILITY",
  HUMAN_REVIEW_UNAVAILABLE: "HUMAN_REVIEW_UNAVAILABLE",
  GOVERNANCE_BLOCKED: "GOVERNANCE_BLOCKED",
} as const;

export const CountySourceGovernanceReadinessThresholds = {
  governanceReady: 0.82,
  reviewRequired: 0.62,
  minimumPlanningSignal: 0.5,
  blockingSignal: 0.25,
} as const;

const readinessFieldNames = [
  "sourceFormatClassification",
  "universalSchemaReadiness",
  "fieldMappingReadiness",
  "parserStrategyReadiness",
  "countyCapabilityReadiness",
  "normalizationReadiness",
  "sourceIntakeReadiness",
  "dataQualityReadiness",
  "countyRiskReadiness",
  "reviewBurdenReadiness",
  "confidenceStabilityReadiness",
  "sourceSurvivabilityReadiness",
] as const;

const readinessLabels: Record<(typeof readinessFieldNames)[number], string> = {
  sourceFormatClassification: "source format classification",
  universalSchemaReadiness: "universal schema readiness",
  fieldMappingReadiness: "field mapping readiness",
  parserStrategyReadiness: "parser strategy readiness",
  countyCapabilityReadiness: "county capability readiness",
  normalizationReadiness: "normalization readiness",
  sourceIntakeReadiness: "source intake readiness",
  dataQualityReadiness: "data quality readiness",
  countyRiskReadiness: "county risk readiness",
  reviewBurdenReadiness: "review burden readiness",
  confidenceStabilityReadiness: "confidence stability readiness",
  sourceSurvivabilityReadiness: "source survivability readiness",
};

const clampScore = (score: number | null | undefined): number => {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return 0;
  }

  return Math.min(1, Math.max(0, score));
};

const getGovernanceReadinessScore = (input: CountySourceGovernanceReadinessInput): number => {
  const total = readinessFieldNames.reduce((sum, fieldName) => sum + clampScore(input[fieldName]), 0);

  return Number((total / readinessFieldNames.length).toFixed(4));
};

const getLowReadinessReasons = (input: CountySourceGovernanceReadinessInput): string[] =>
  readinessFieldNames
    .filter((fieldName) => clampScore(input[fieldName]) < CountySourceGovernanceReadinessThresholds.minimumPlanningSignal)
    .map((fieldName) => `${readinessLabels[fieldName]} is below governance planning threshold`);

const getBlockingReadinessReasons = (input: CountySourceGovernanceReadinessInput): string[] =>
  readinessFieldNames
    .filter((fieldName) => clampScore(input[fieldName]) < CountySourceGovernanceReadinessThresholds.blockingSignal)
    .map((fieldName) => `${readinessLabels[fieldName]} is below blocking threshold`);

const getClassification = (
  governanceReadinessScore: number,
  blockingReasons: readonly string[],
  warningCodes: readonly CountySourceGovernanceWarningCode[],
): CountySourceGovernanceReadinessClassification => {
  if (blockingReasons.length > 0 || warningCodes.includes("HUMAN_REVIEW_UNAVAILABLE")) {
    return "blocked";
  }

  if (governanceReadinessScore < CountySourceGovernanceReadinessThresholds.reviewRequired) {
    return "not_governance_ready";
  }

  if (
    governanceReadinessScore >= CountySourceGovernanceReadinessThresholds.governanceReady &&
    warningCodes.length === 0
  ) {
    return "governance_ready";
  }

  return "review_required";
};

const getRecommendedNextStep = (
  classification: CountySourceGovernanceReadinessClassification,
  warningCodes: readonly CountySourceGovernanceWarningCode[],
): string => {
  if (classification === "blocked") {
    return "Resolve governance blockers before any future source activation planning.";
  }

  if (warningCodes.includes("MISSING_CONSTRAINT_DOCUMENTATION")) {
    return "Document source constraints before advancing governance readiness.";
  }

  if (warningCodes.includes("MISSING_EXPLAINABILITY_DOCUMENTATION")) {
    return "Document explainability rationale before advancing governance readiness.";
  }

  if (classification === "review_required") {
    return "Route the planning package for human governance review.";
  }

  if (classification === "not_governance_ready") {
    return "Improve low-readiness planning signals before governance review.";
  }

  return "Keep governance package advisory-only until an explicit future activation decision.";
};

export function evaluateCountySourceGovernanceReadiness(
  input: CountySourceGovernanceReadinessInput,
): CountySourceGovernanceReadinessResult {
  const governanceReadinessScore = getGovernanceReadinessScore(input);
  const warningCodes: CountySourceGovernanceWarningCode[] = [];

  if (input.constraintDocumentationPresent !== true) {
    warningCodes.push("MISSING_CONSTRAINT_DOCUMENTATION");
  }

  if (input.explainabilityDocumentationPresent !== true) {
    warningCodes.push("MISSING_EXPLAINABILITY_DOCUMENTATION");
  }

  if (clampScore(input.reviewBurdenReadiness) < CountySourceGovernanceReadinessThresholds.minimumPlanningSignal) {
    warningCodes.push("HIGH_REVIEW_BURDEN");
  }

  if (clampScore(input.confidenceStabilityReadiness) < CountySourceGovernanceReadinessThresholds.minimumPlanningSignal) {
    warningCodes.push("LOW_CONFIDENCE_STABILITY");
  }

  if (clampScore(input.countyRiskReadiness) < CountySourceGovernanceReadinessThresholds.minimumPlanningSignal) {
    warningCodes.push("HIGH_SOURCE_RISK");
  }

  if (clampScore(input.dataQualityReadiness) < CountySourceGovernanceReadinessThresholds.minimumPlanningSignal) {
    warningCodes.push("LOW_DATA_QUALITY");
  }

  if (clampScore(input.sourceSurvivabilityReadiness) < CountySourceGovernanceReadinessThresholds.minimumPlanningSignal) {
    warningCodes.push("LOW_SURVIVABILITY");
  }

  if (input.humanReviewAvailable !== true) {
    warningCodes.push("HUMAN_REVIEW_UNAVAILABLE");
  }

  const readinessReasons = getLowReadinessReasons(input);
  const blockingReasons = getBlockingReadinessReasons(input);

  if (blockingReasons.length > 0 || warningCodes.includes("HUMAN_REVIEW_UNAVAILABLE")) {
    warningCodes.push("GOVERNANCE_BLOCKED");
  }

  const governanceReadinessClassification = getClassification(
    governanceReadinessScore,
    blockingReasons,
    warningCodes,
  );
  const humanReviewRequired = governanceReadinessClassification !== "governance_ready" || warningCodes.length > 0;

  return {
    governanceReadinessClassification,
    governanceReadinessScore,
    humanReviewRequired,
    readinessReasons,
    blockingReasons,
    warningCodes,
    explainabilitySummary: `Governance readiness evaluated from ${readinessFieldNames.length} deterministic planning signals with fail-closed execution controls preserved.`,
    recommendedNextStep: getRecommendedNextStep(governanceReadinessClassification, warningCodes),
    ingestionBlocked: CountySourceGovernanceReadinessFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountySourceGovernanceReadinessFailClosedDefaults.automationBlocked,
    executionBlocked: CountySourceGovernanceReadinessFailClosedDefaults.executionBlocked,
    planningOnly: CountySourceGovernanceReadinessFailClosedDefaults.planningOnly,
    failClosed: CountySourceGovernanceReadinessFailClosedDefaults.failClosed,
  };
}
