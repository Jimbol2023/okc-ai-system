import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type InstitutionalExpansionSequencingClassification = "not_ready" | "defensive_review" | "selective" | "disciplined" | "institutional_grade";

export type InstitutionalExpansionSequencingInput = {
  expansionReadinessScore?: number;
  corridorRolloutDurabilityScore?: number;
  multiMarketPacingScore?: number;
  institutionalScalingCadenceScore?: number;
  phasedExpansionDisciplineScore?: number;
  expansionDependencyManagementScore?: number;
  corridorExpansionAlignmentScore?: number;
  capitalAlignedExpansionPacingScore?: number;
  diversificationAwareExpansionScore?: number;
  defensiveExpansionTimingScore?: number;
  expansionSurvivabilityScore?: number;
  rolloutResilienceScore?: number;
  strategicExitTimingProfile?: unknown;
  portfolioRiskBalancingProfile?: unknown;
  portfolioCorrelationProfile?: unknown;
  capitalCycleProfile?: unknown;
  institutionalCapitalFlowProfile?: unknown;
  multiAssetExpansionProfile?: unknown;
  corridorIntelligenceProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type InstitutionalExpansionSequencingScoreBreakdown = CorridorScoreBreakdown & {
  institutionalExpansionSequencingQualityScore: number;
  expansionReadinessScore: number;
  corridorRolloutDurabilityScore: number;
  multiMarketPacingQualityScore: number;
  institutionalScalingCadenceScore: number;
  phasedExpansionDisciplineScore: number;
  expansionDependencyManagementScore: number;
  corridorExpansionAlignmentScore: number;
  capitalAlignedExpansionPacingScore: number;
  diversificationAwareExpansionQualityScore: number;
  defensiveExpansionTimingScore: number;
  expansionSurvivabilityQualityScore: number;
  strategicRolloutResilienceScore: number;
};

export type InstitutionalExpansionSequencingExplainability = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  assumptions: string[];
};

export type InstitutionalExpansionSequencingResult = {
  institutionalExpansionSequencingQuality: number;
  expansionSequencingClassification: InstitutionalExpansionSequencingClassification;
  expansionReadiness: number;
  corridorRolloutDurability: number;
  multiMarketPacingQuality: number;
  institutionalScalingCadence: number;
  phasedExpansionDiscipline: number;
  expansionDependencyManagement: number;
  corridorExpansionAlignment: number;
  capitalAlignedExpansionPacing: number;
  diversificationAwareExpansionQuality: number;
  defensiveExpansionTiming: number;
  expansionSurvivabilityQuality: number;
  strategicRolloutResilience: number;
  confidenceScore: number;
  scoreBreakdown: InstitutionalExpansionSequencingScoreBreakdown;
  explainability: InstitutionalExpansionSequencingExplainability;
  warnings: CorridorWarning[];
  missingData: string[];
  assumptions: string[];
  safety: {
    readOnly: true;
    outreachAuthorized: false;
    executionAuthorized: false;
    databaseWriteAuthorized: false;
    externalDataUsed: false;
    financialApiUsed: false;
    liveMarketDataUsed: false;
    livePortfolioSystemUsed: false;
    brokerageSystemUsed: false;
    scrapingUsed: false;
    demographicTargetingUsed: false;
    protectedClassLogicUsed: false;
    autonomousExecutionLogic: false;
    lendingAdvice: false;
    investmentAdvice: false;
    portfolioManagementAdvice: false;
    legalAdvice: false;
    marketPrediction: false;
  };
  readOnly: true;
};

const REQUIRED_INPUTS: Array<keyof InstitutionalExpansionSequencingInput> = [
  "expansionReadinessScore",
  "corridorRolloutDurabilityScore",
  "multiMarketPacingScore",
  "institutionalScalingCadenceScore",
  "phasedExpansionDisciplineScore",
  "expansionDependencyManagementScore",
  "corridorExpansionAlignmentScore",
  "capitalAlignedExpansionPacingScore",
  "diversificationAwareExpansionScore",
  "defensiveExpansionTimingScore",
  "expansionSurvivabilityScore",
  "rolloutResilienceScore",
];

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function weightedAverage(values: Array<[number, number]>) {
  const totalWeight = values.reduce((total, [, weight]) => total + weight, 0);

  if (totalWeight <= 0) return 0;

  return normalizeCorridorScore(values.reduce((total, [value, weight]) => total + normalizeCorridorScore(value) * weight, 0) / totalWeight);
}

function getScore(value: number | undefined, fallback: number) {
  return normalizeCorridorScore(value, fallback);
}

function getPath(source: unknown, path: string) {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object" || Array.isArray(current)) return undefined;

    return (current as Record<string, unknown>)[key];
  }, source);
}

function extractProfileScore(profile: unknown, paths: string[], fallback: number) {
  for (const path of paths) {
    const value = getPath(profile, path);

    if (typeof value === "number" && Number.isFinite(value)) return normalizeCorridorScore(value);
  }

  return fallback;
}

function hasProfileScore(profile: unknown, paths: string[]) {
  return paths.some((path) => {
    const value = getPath(profile, path);

    return typeof value === "number" && Number.isFinite(value);
  });
}

function hasFallbackForInput(input: InstitutionalExpansionSequencingInput, key: keyof InstitutionalExpansionSequencingInput) {
  const exitProfile = input.strategicExitTimingProfile;
  const riskProfile = input.portfolioRiskBalancingProfile;
  const correlationProfile = input.portfolioCorrelationProfile;
  const capitalCycleProfile = input.capitalCycleProfile;
  const capitalFlowProfile = input.institutionalCapitalFlowProfile;
  const multiAssetProfile = input.multiAssetExpansionProfile;
  const corridorProfile = input.corridorIntelligenceProfile;

  const fallbackPaths: Partial<Record<keyof InstitutionalExpansionSequencingInput, boolean>> = {
    expansionReadinessScore:
      hasProfileScore(multiAssetProfile, ["crossAssetExpansionStrength", "expansionCoherence"]) ||
      hasProfileScore(exitProfile, ["expansionExitCompatibility", "strategicExitTimingQuality"]),
    corridorRolloutDurabilityScore:
      hasProfileScore(corridorProfile, ["scoreBreakdown.durabilityScore", "strategicExpansionFit", "overallCorridorScore"]) ||
      hasProfileScore(riskProfile, ["corridorExposureBalance"]),
    multiMarketPacingScore:
      hasProfileScore(multiAssetProfile, ["multiMarketSurvivability", "portfolioExpansionDurability"]) ||
      hasProfileScore(capitalCycleProfile, ["expansionTimingDurability"]),
    institutionalScalingCadenceScore:
      hasProfileScore(multiAssetProfile, ["institutionalScalability", "strategicBalancing"]) ||
      hasProfileScore(capitalFlowProfile, ["strategicScalingDurability", "expansionCapitalCoherence"]),
    phasedExpansionDisciplineScore:
      hasProfileScore(multiAssetProfile, ["phasedExpansionCompatibility", "expansionCoherence"]) ||
      hasProfileScore(capitalCycleProfile, ["acquisitionTimingDiscipline", "institutionalPatienceAlignment"]),
    expansionDependencyManagementScore:
      hasProfileScore(correlationProfile, ["expansionDependencyRisk", "scoreBreakdown.expansionDependencyRiskScore"]) ||
      hasProfileScore(riskProfile, ["expansionRiskBalance", "correlationAdjustedRiskBalance"]),
    corridorExpansionAlignmentScore:
      hasProfileScore(corridorProfile, ["strategicExpansionFit", "overallCorridorScore", "scoreBreakdown.expansionScore"]) ||
      hasProfileScore(multiAssetProfile, ["corridorContinuity"]),
    capitalAlignedExpansionPacingScore:
      hasProfileScore(capitalCycleProfile, ["capitalCycleAlignment", "expansionTimingDurability", "capitalFlexibility"]) ||
      hasProfileScore(capitalFlowProfile, ["expansionCapitalCoherence", "phasedCapitalSurvivability"]),
    diversificationAwareExpansionScore:
      hasProfileScore(riskProfile, ["diversificationEffectiveness", "assetExposureBalance"]) ||
      hasProfileScore(multiAssetProfile, ["diversificationQuality", "strategicBalancing"]),
    defensiveExpansionTimingScore:
      hasProfileScore(exitProfile, ["defensiveExitPositioning", "downsideExitResilience"]) ||
      hasProfileScore(riskProfile, ["defensivePositioning", "downsideProtectionBalance"]),
    expansionSurvivabilityScore:
      hasProfileScore(multiAssetProfile, ["multiMarketSurvivability", "portfolioExpansionDurability"]) ||
      hasProfileScore(riskProfile, ["portfolioResilienceBalance"]),
    rolloutResilienceScore:
      hasProfileScore(exitProfile, ["multiAssetExitResilience", "correlationAdjustedExitBalance"]) ||
      hasProfileScore(riskProfile, ["portfolioResilienceBalance", "correlationAdjustedRiskBalance"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: InstitutionalExpansionSequencingInput) {
  const labels: Record<keyof InstitutionalExpansionSequencingInput, string> = {
    expansionReadinessScore: "expansion readiness score",
    corridorRolloutDurabilityScore: "corridor rollout durability score",
    multiMarketPacingScore: "multi-market pacing score",
    institutionalScalingCadenceScore: "institutional scaling cadence score",
    phasedExpansionDisciplineScore: "phased expansion discipline score",
    expansionDependencyManagementScore: "expansion dependency management score",
    corridorExpansionAlignmentScore: "corridor expansion alignment score",
    capitalAlignedExpansionPacingScore: "capital-aligned expansion pacing score",
    diversificationAwareExpansionScore: "diversification-aware expansion score",
    defensiveExpansionTimingScore: "defensive expansion timing score",
    expansionSurvivabilityScore: "expansion survivability score",
    rolloutResilienceScore: "rollout resilience score",
    strategicExitTimingProfile: "strategic exit timing profile",
    portfolioRiskBalancingProfile: "portfolio risk-balancing profile",
    portfolioCorrelationProfile: "portfolio correlation profile",
    capitalCycleProfile: "capital-cycle profile",
    institutionalCapitalFlowProfile: "institutional capital-flow profile",
    multiAssetExpansionProfile: "multi-asset expansion profile",
    corridorIntelligenceProfile: "corridor intelligence profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: InstitutionalExpansionSequencingInput): InstitutionalExpansionSequencingScoreBreakdown {
  const exitProfile = input.strategicExitTimingProfile;
  const riskProfile = input.portfolioRiskBalancingProfile;
  const correlationProfile = input.portfolioCorrelationProfile;
  const capitalCycleProfile = input.capitalCycleProfile;
  const capitalFlowProfile = input.institutionalCapitalFlowProfile;
  const multiAssetProfile = input.multiAssetExpansionProfile;
  const corridorProfile = input.corridorIntelligenceProfile;
  const corridorRolloutDurabilityScore = getScore(
    input.corridorRolloutDurabilityScore,
    weightedAverage([
      [extractProfileScore(corridorProfile, ["scoreBreakdown.durabilityScore", "overallCorridorScore"], 54), 0.3],
      [extractProfileScore(corridorProfile, ["strategicExpansionFit", "scoreBreakdown.expansionScore"], 54), 0.24],
      [extractProfileScore(riskProfile, ["corridorExposureBalance", "scoreBreakdown.corridorExposureBalanceScore"], 54), 0.22],
      [extractProfileScore(exitProfile, ["corridorExitDurability", "scoreBreakdown.corridorExitDurabilityScore"], 54), 0.24],
    ]),
  );
  const capitalAlignedExpansionPacingScore = getScore(
    input.capitalAlignedExpansionPacingScore,
    weightedAverage([
      [extractProfileScore(capitalCycleProfile, ["capitalCycleAlignment", "scoreBreakdown.capitalCycleAlignmentScore"], 54), 0.28],
      [extractProfileScore(capitalCycleProfile, ["expansionTimingDurability", "scoreBreakdown.expansionTimingDurabilityScore"], 54), 0.22],
      [extractProfileScore(capitalCycleProfile, ["capitalFlexibility", "scoreBreakdown.capitalFlexibilityScore"], 54), 0.18],
      [extractProfileScore(capitalFlowProfile, ["expansionCapitalCoherence", "strategicCapitalAlignment"], 54), 0.18],
      [extractProfileScore(capitalFlowProfile, ["phasedCapitalSurvivability", "liquidityDurability"], 54), 0.14],
    ]),
  );
  const phasedExpansionDisciplineScore = getScore(
    input.phasedExpansionDisciplineScore,
    weightedAverage([
      [extractProfileScore(multiAssetProfile, ["phasedExpansionCompatibility", "scoreBreakdown.phasedExpansionCompatibilityScore"], 54), 0.3],
      [extractProfileScore(multiAssetProfile, ["expansionCoherence", "scoreBreakdown.expansionCoherenceScore"], 54), 0.22],
      [extractProfileScore(capitalCycleProfile, ["acquisitionTimingDiscipline", "scoreBreakdown.acquisitionTimingDisciplineScore"], 54), 0.18],
      [extractProfileScore(capitalCycleProfile, ["institutionalPatienceAlignment", "scoreBreakdown.institutionalPatienceAlignmentScore"], 54), 0.16],
      [capitalAlignedExpansionPacingScore, 0.14],
    ]),
  );
  const multiMarketPacingQualityScore = getScore(
    input.multiMarketPacingScore,
    weightedAverage([
      [extractProfileScore(multiAssetProfile, ["multiMarketSurvivability", "scoreBreakdown.multiMarketSurvivabilityScore"], 54), 0.28],
      [extractProfileScore(multiAssetProfile, ["portfolioExpansionDurability", "scoreBreakdown.portfolioExpansionDurabilityScore"], 54), 0.22],
      [extractProfileScore(capitalCycleProfile, ["expansionTimingDurability", "scoreBreakdown.expansionTimingDurabilityScore"], 54), 0.18],
      [phasedExpansionDisciplineScore, 0.18],
      [capitalAlignedExpansionPacingScore, 0.14],
    ]),
  );
  const corridorExpansionAlignmentScore = getScore(
    input.corridorExpansionAlignmentScore,
    weightedAverage([
      [extractProfileScore(corridorProfile, ["strategicExpansionFit", "overallCorridorScore"], 54), 0.28],
      [extractProfileScore(corridorProfile, ["scoreBreakdown.expansionScore", "scoreBreakdown.connectivityScore"], 54), 0.22],
      [extractProfileScore(multiAssetProfile, ["corridorContinuity", "scoreBreakdown.corridorContinuityScore"], 54), 0.22],
      [corridorRolloutDurabilityScore, 0.18],
      [extractProfileScore(exitProfile, ["corridorExitDurability"], 54), 0.1],
    ]),
  );
  const diversificationAwareExpansionQualityScore = getScore(
    input.diversificationAwareExpansionScore,
    weightedAverage([
      [extractProfileScore(riskProfile, ["diversificationEffectiveness", "scoreBreakdown.diversificationEffectivenessScore"], 54), 0.26],
      [extractProfileScore(riskProfile, ["assetExposureBalance", "scoreBreakdown.assetExposureBalanceScore"], 54), 0.18],
      [extractProfileScore(multiAssetProfile, ["diversificationQuality", "scoreBreakdown.diversificationQualityScore"], 54), 0.24],
      [extractProfileScore(multiAssetProfile, ["strategicBalancing", "scoreBreakdown.strategicBalancingScore"], 54), 0.18],
      [100 - extractProfileScore(correlationProfile, ["portfolioCorrelationRisk", "scoreBreakdown.portfolioCorrelationRiskScore"], 48), 0.14],
    ]),
  );
  const expansionDependencyManagementScore = getScore(
    input.expansionDependencyManagementScore,
    weightedAverage([
      [100 - extractProfileScore(correlationProfile, ["expansionDependencyRisk", "scoreBreakdown.expansionDependencyRiskScore"], 48), 0.32],
      [extractProfileScore(riskProfile, ["expansionRiskBalance", "scoreBreakdown.expansionRiskBalanceScore"], 54), 0.22],
      [extractProfileScore(riskProfile, ["correlationAdjustedRiskBalance", "scoreBreakdown.correlationAdjustedRiskBalanceScore"], 54), 0.16],
      [phasedExpansionDisciplineScore, 0.16],
      [diversificationAwareExpansionQualityScore, 0.14],
    ]),
  );
  const defensiveExpansionTimingScore = getScore(
    input.defensiveExpansionTimingScore,
    weightedAverage([
      [extractProfileScore(exitProfile, ["defensiveExitPositioning", "scoreBreakdown.defensiveExitPositioningScore"], 54), 0.24],
      [extractProfileScore(exitProfile, ["downsideExitResilience", "scoreBreakdown.downsideExitResilienceScore"], 54), 0.2],
      [extractProfileScore(riskProfile, ["defensivePositioning", "scoreBreakdown.defensivePositioningScore"], 54), 0.2],
      [extractProfileScore(riskProfile, ["downsideProtectionBalance", "scoreBreakdown.downsideProtectionBalanceScore"], 54), 0.16],
      [capitalAlignedExpansionPacingScore, 0.12],
      [phasedExpansionDisciplineScore, 0.08],
    ]),
  );
  const institutionalScalingCadenceScore = getScore(
    input.institutionalScalingCadenceScore,
    weightedAverage([
      [extractProfileScore(multiAssetProfile, ["institutionalScalability", "scoreBreakdown.institutionalScalabilityScore"], 54), 0.24],
      [extractProfileScore(capitalFlowProfile, ["strategicScalingDurability", "expansionCapitalCoherence"], 54), 0.22],
      [phasedExpansionDisciplineScore, 0.18],
      [capitalAlignedExpansionPacingScore, 0.14],
      [multiMarketPacingQualityScore, 0.12],
      [defensiveExpansionTimingScore, 0.1],
    ]),
  );
  const expansionSurvivabilityQualityScore = getScore(
    input.expansionSurvivabilityScore,
    weightedAverage([
      [extractProfileScore(multiAssetProfile, ["multiMarketSurvivability", "scoreBreakdown.multiMarketSurvivabilityScore"], 54), 0.24],
      [extractProfileScore(multiAssetProfile, ["portfolioExpansionDurability", "scoreBreakdown.portfolioExpansionDurabilityScore"], 54), 0.22],
      [extractProfileScore(riskProfile, ["portfolioResilienceBalance", "scoreBreakdown.portfolioResilienceBalanceScore"], 54), 0.18],
      [defensiveExpansionTimingScore, 0.14],
      [diversificationAwareExpansionQualityScore, 0.12],
      [expansionDependencyManagementScore, 0.1],
    ]),
  );
  const strategicRolloutResilienceScore = getScore(
    input.rolloutResilienceScore,
    weightedAverage([
      [expansionSurvivabilityQualityScore, 0.22],
      [corridorRolloutDurabilityScore, 0.16],
      [multiMarketPacingQualityScore, 0.14],
      [institutionalScalingCadenceScore, 0.12],
      [defensiveExpansionTimingScore, 0.12],
      [extractProfileScore(exitProfile, ["multiAssetExitResilience", "correlationAdjustedExitBalance"], 54), 0.12],
      [extractProfileScore(riskProfile, ["correlationAdjustedRiskBalance", "portfolioResilienceBalance"], 54), 0.12],
    ]),
  );
  const expansionReadinessScore = getScore(
    input.expansionReadinessScore,
    weightedAverage([
      [extractProfileScore(multiAssetProfile, ["crossAssetExpansionStrength", "scoreBreakdown.crossAssetExpansionStrengthScore"], 54), 0.18],
      [institutionalScalingCadenceScore, 0.14],
      [phasedExpansionDisciplineScore, 0.14],
      [capitalAlignedExpansionPacingScore, 0.12],
      [corridorExpansionAlignmentScore, 0.12],
      [diversificationAwareExpansionQualityScore, 0.12],
      [defensiveExpansionTimingScore, 0.1],
      [strategicRolloutResilienceScore, 0.1],
      [extractProfileScore(exitProfile, ["expansionExitCompatibility", "strategicExitTimingQuality"], 54), 0.08],
    ]),
  );
  const institutionalExpansionSequencingQualityScore = weightedAverage([
    [expansionReadinessScore, 0.12],
    [corridorRolloutDurabilityScore, 0.09],
    [multiMarketPacingQualityScore, 0.1],
    [institutionalScalingCadenceScore, 0.1],
    [phasedExpansionDisciplineScore, 0.1],
    [expansionDependencyManagementScore, 0.09],
    [corridorExpansionAlignmentScore, 0.09],
    [capitalAlignedExpansionPacingScore, 0.1],
    [diversificationAwareExpansionQualityScore, 0.08],
    [defensiveExpansionTimingScore, 0.08],
    [expansionSurvivabilityQualityScore, 0.08],
    [strategicRolloutResilienceScore, 0.07],
  ]);

  return {
    connectivityScore: corridorExpansionAlignmentScore,
    durabilityScore: strategicRolloutResilienceScore,
    expansionScore: expansionReadinessScore,
    institutionalScore: institutionalScalingCadenceScore,
    logisticsScore: multiMarketPacingQualityScore,
    luxuryScore: diversificationAwareExpansionQualityScore,
    developmentScore: phasedExpansionDisciplineScore,
    institutionalExpansionSequencingQualityScore,
    expansionReadinessScore,
    corridorRolloutDurabilityScore,
    multiMarketPacingQualityScore,
    institutionalScalingCadenceScore,
    phasedExpansionDisciplineScore,
    expansionDependencyManagementScore,
    corridorExpansionAlignmentScore,
    capitalAlignedExpansionPacingScore,
    diversificationAwareExpansionQualityScore,
    defensiveExpansionTimingScore,
    expansionSurvivabilityQualityScore,
    strategicRolloutResilienceScore,
  };
}

function classifyExpansionSequencing(scoreBreakdown: InstitutionalExpansionSequencingScoreBreakdown, warnings: CorridorWarning[]): InstitutionalExpansionSequencingClassification {
  if (warnings.some((warning) => warning.severity === "high") || scoreBreakdown.institutionalExpansionSequencingQualityScore < 42) return "not_ready";
  if (scoreBreakdown.defensiveExpansionTimingScore < 48 || scoreBreakdown.capitalAlignedExpansionPacingScore < 48) return "defensive_review";
  if (
    scoreBreakdown.institutionalExpansionSequencingQualityScore >= 82 &&
    scoreBreakdown.expansionReadinessScore >= 74 &&
    scoreBreakdown.phasedExpansionDisciplineScore >= 70
  ) {
    return "institutional_grade";
  }
  if (scoreBreakdown.institutionalExpansionSequencingQualityScore >= 66 && scoreBreakdown.strategicRolloutResilienceScore >= 62) return "disciplined";

  return "selective";
}

function buildWarnings(scoreBreakdown: InstitutionalExpansionSequencingScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "INSTITUTIONAL_EXPANSION_SEQUENCING_DATA_INCOMPLETE",
            severity: missingData.length >= 6 ? "high" : "medium",
            message: "Institutional expansion sequencing assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.expansionReadinessScore < 42
      ? [
          createCorridorWarning({
            code: "EXPANSION_READINESS_WEAK",
            severity: "high",
            message: "Expansion readiness is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.phasedExpansionDisciplineScore < 42
      ? [
          createCorridorWarning({
            code: "PHASED_EXPANSION_DISCIPLINE_WEAK",
            severity: "high",
            message: "Phased expansion discipline is weak enough to require manual review.",
            category: "development",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.capitalAlignedExpansionPacingScore < 45
      ? [
          createCorridorWarning({
            code: "CAPITAL_ALIGNED_EXPANSION_PACING_WEAK",
            severity: "medium",
            message: "Capital-aligned expansion pacing is weak; this is not a market prediction or financing recommendation.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.corridorRolloutDurabilityScore < 45 || scoreBreakdown.corridorExpansionAlignmentScore < 45
      ? [
          createCorridorWarning({
            code: "CORRIDOR_ROLLOUT_ALIGNMENT_WEAK",
            severity: "medium",
            message: "Corridor rollout durability or corridor expansion alignment is weak under current structured inputs.",
            category: "mixed",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.expansionDependencyManagementScore < 45
      ? [
          createCorridorWarning({
            code: "EXPANSION_DEPENDENCY_MANAGEMENT_WEAK",
            severity: "medium",
            message: "Expansion dependency management is weak and requires human review before sequencing analysis is used.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.defensiveExpansionTimingScore < 45
      ? [
          createCorridorWarning({
            code: "DEFENSIVE_EXPANSION_TIMING_WEAK",
            severity: "medium",
            message: "Defensive expansion timing is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.institutionalExpansionSequencingQualityScore >= 72 && scoreBreakdown.expansionSurvivabilityQualityScore < 55
      ? [
          createCorridorWarning({
            code: "QUALITY_WITH_SURVIVABILITY_WATCHLIST",
            severity: "low",
            message: "Sequencing quality is strong, but expansion survivability remains on the review watchlist.",
            category: "institutional",
            requiresHumanReview: false,
          }),
        ]
      : []),
  ];
}

function buildAssumptions(input: InstitutionalExpansionSequencingInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0 ? ["Missing institutional expansion sequencing inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."] : []),
    "Institutional expansion sequencing scoring is strategic, deterministic, and read-only; it is not investment advice, portfolio-management advice, lending advice, legal advice, financial advice, market prediction, or autonomous execution logic.",
    "No live market timing, brokerage systems, live portfolio systems, financial APIs, live market data, external APIs, scraping, demographic data, or protected-class data was used.",
  ]);
}

function buildExplainability(params: {
  scoreBreakdown: InstitutionalExpansionSequencingScoreBreakdown;
  classification: InstitutionalExpansionSequencingClassification;
  warnings: CorridorWarning[];
  missingData: string[];
  assumptions: string[];
}): InstitutionalExpansionSequencingExplainability {
  const scoreBreakdown = params.scoreBreakdown;
  const strengths = unique([
    ...(scoreBreakdown.expansionReadinessScore >= 70 ? ["Expansion readiness is strong."] : []),
    ...(scoreBreakdown.corridorRolloutDurabilityScore >= 70 ? ["Corridor rollout durability is strong."] : []),
    ...(scoreBreakdown.multiMarketPacingQualityScore >= 70 ? ["Multi-market pacing quality is strong."] : []),
    ...(scoreBreakdown.institutionalScalingCadenceScore >= 70 ? ["Institutional scaling cadence is strong."] : []),
    ...(scoreBreakdown.phasedExpansionDisciplineScore >= 70 ? ["Phased expansion discipline is strong."] : []),
    ...(scoreBreakdown.capitalAlignedExpansionPacingScore >= 70 ? ["Capital-aligned expansion pacing is strong."] : []),
    ...(scoreBreakdown.diversificationAwareExpansionQualityScore >= 70 ? ["Diversification-aware expansion sequencing is strong."] : []),
    ...(scoreBreakdown.strategicRolloutResilienceScore >= 70 ? ["Strategic rollout resilience is strong."] : []),
  ]);
  const weaknesses = unique([
    ...(scoreBreakdown.expansionReadinessScore < 45 ? ["Expansion readiness is weak."] : []),
    ...(scoreBreakdown.corridorRolloutDurabilityScore < 45 ? ["Corridor rollout durability is weak."] : []),
    ...(scoreBreakdown.multiMarketPacingQualityScore < 45 ? ["Multi-market pacing quality is weak."] : []),
    ...(scoreBreakdown.institutionalScalingCadenceScore < 45 ? ["Institutional scaling cadence is weak."] : []),
    ...(scoreBreakdown.phasedExpansionDisciplineScore < 45 ? ["Phased expansion discipline is weak."] : []),
    ...(scoreBreakdown.expansionDependencyManagementScore < 45 ? ["Expansion dependency management is weak."] : []),
    ...(scoreBreakdown.defensiveExpansionTimingScore < 45 ? ["Defensive expansion timing is weak."] : []),
    ...(scoreBreakdown.expansionSurvivabilityQualityScore < 45 ? ["Expansion survivability quality is weak."] : []),
  ]);
  const risks = unique([
    ...(params.warnings.some((warning) => warning.severity === "high") ? ["High-severity institutional expansion sequencing warning requires manual review."] : []),
    ...(scoreBreakdown.institutionalExpansionSequencingQualityScore < 50 ? ["Institutional expansion sequencing quality is weak under current structured inputs."] : []),
    ...(scoreBreakdown.capitalAlignedExpansionPacingScore < 45 ? ["Capital-aligned pacing may limit sequencing durability; this is not lending or market advice."] : []),
    ...(scoreBreakdown.expansionDependencyManagementScore < 45 ? ["Expansion dependency management may reduce rollout resilience."] : []),
    ...(scoreBreakdown.corridorExpansionAlignmentScore < 45 ? ["Corridor expansion alignment may reduce rollout quality."] : []),
    ...(params.missingData.length > 0 ? `Missing data reduces confidence: ${params.missingData.slice(0, 4).join(", ")}.` : []),
  ]);

  return {
    summary: `Institutional expansion sequencing classification is ${params.classification} with a ${scoreBreakdown.institutionalExpansionSequencingQualityScore}/100 sequencing quality score and ${scoreBreakdown.expansionReadinessScore}/100 expansion readiness score. This is deterministic read-only sequencing intelligence only and does not automate expansion decisions or provide investment, portfolio-management, lending, legal, or market-prediction advice.`,
    strengths,
    weaknesses,
    risks,
    assumptions: params.assumptions,
  };
}

export function analyzeInstitutionalExpansionSequencingIntelligence(input: InstitutionalExpansionSequencingInput = {}): InstitutionalExpansionSequencingResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const expansionSequencingClassification = classifyExpansionSequencing(scoreBreakdown, warnings);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });
  const explainability = buildExplainability({
    scoreBreakdown,
    classification: expansionSequencingClassification,
    warnings,
    missingData,
    assumptions,
  });

  return {
    institutionalExpansionSequencingQuality: scoreBreakdown.institutionalExpansionSequencingQualityScore,
    expansionSequencingClassification,
    expansionReadiness: scoreBreakdown.expansionReadinessScore,
    corridorRolloutDurability: scoreBreakdown.corridorRolloutDurabilityScore,
    multiMarketPacingQuality: scoreBreakdown.multiMarketPacingQualityScore,
    institutionalScalingCadence: scoreBreakdown.institutionalScalingCadenceScore,
    phasedExpansionDiscipline: scoreBreakdown.phasedExpansionDisciplineScore,
    expansionDependencyManagement: scoreBreakdown.expansionDependencyManagementScore,
    corridorExpansionAlignment: scoreBreakdown.corridorExpansionAlignmentScore,
    capitalAlignedExpansionPacing: scoreBreakdown.capitalAlignedExpansionPacingScore,
    diversificationAwareExpansionQuality: scoreBreakdown.diversificationAwareExpansionQualityScore,
    defensiveExpansionTiming: scoreBreakdown.defensiveExpansionTimingScore,
    expansionSurvivabilityQuality: scoreBreakdown.expansionSurvivabilityQualityScore,
    strategicRolloutResilience: scoreBreakdown.strategicRolloutResilienceScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    explainability,
    warnings,
    missingData,
    assumptions,
    safety: {
      readOnly: true,
      outreachAuthorized: false,
      executionAuthorized: false,
      databaseWriteAuthorized: false,
      externalDataUsed: false,
      financialApiUsed: false,
      liveMarketDataUsed: false,
      livePortfolioSystemUsed: false,
      brokerageSystemUsed: false,
      scrapingUsed: false,
      demographicTargetingUsed: false,
      protectedClassLogicUsed: false,
      autonomousExecutionLogic: false,
      lendingAdvice: false,
      investmentAdvice: false,
      portfolioManagementAdvice: false,
      legalAdvice: false,
      marketPrediction: false,
    },
    readOnly: true,
  };
}

export const getInstitutionalExpansionSequencingIntelligence = analyzeInstitutionalExpansionSequencingIntelligence;
