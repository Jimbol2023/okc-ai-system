import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type MarketRotationClassification = "rigid" | "constrained" | "selective" | "adaptable" | "institutional_grade";

export type MarketRotationInput = {
  marketAdaptabilityScore?: number;
  regionalRotationResilienceScore?: number;
  corridorTransitionDurabilityScore?: number;
  diversificationAwareRepositioningScore?: number;
  multiMarketFlexibilityScore?: number;
  strategicRepositioningDisciplineScore?: number;
  defensiveAdaptabilityScore?: number;
  rotationTimingResilienceScore?: number;
  expansionRebalancingScore?: number;
  corridorMigrationFlexibilityScore?: number;
  assetCategoryAdaptabilityScore?: number;
  recoveryTransitionReadinessScore?: number;
  economicShockResilienceProfile?: unknown;
  competitiveSaturationProfile?: unknown;
  regionalDominanceProfile?: unknown;
  institutionalExpansionSequencingProfile?: unknown;
  portfolioRiskBalancingProfile?: unknown;
  corridorIntelligenceProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type MarketRotationScoreBreakdown = CorridorScoreBreakdown & {
  marketRotationResilienceScore: number;
  marketAdaptabilityQualityScore: number;
  regionalRotationResilienceScore: number;
  corridorTransitionDurabilityScore: number;
  diversificationAwareRepositioningScore: number;
  multiMarketFlexibilityScore: number;
  strategicRepositioningDisciplineScore: number;
  defensiveMarketAdaptabilityScore: number;
  rotationTimingResilienceScore: number;
  expansionRebalancingQualityScore: number;
  corridorMigrationFlexibilityScore: number;
  assetCategoryAdaptabilityScore: number;
  recoveryTransitionReadinessScore: number;
};

export type MarketRotationExplainability = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  assumptions: string[];
};

export type MarketRotationResult = {
  marketRotationResilience: number;
  marketRotationClassification: MarketRotationClassification;
  marketAdaptabilityQuality: number;
  regionalRotationResilience: number;
  corridorTransitionDurability: number;
  diversificationAwareRepositioning: number;
  multiMarketFlexibility: number;
  strategicRepositioningDiscipline: number;
  defensiveMarketAdaptability: number;
  rotationTimingResilience: number;
  expansionRebalancingQuality: number;
  corridorMigrationFlexibility: number;
  assetCategoryAdaptability: number;
  recoveryTransitionReadiness: number;
  confidenceScore: number;
  scoreBreakdown: MarketRotationScoreBreakdown;
  explainability: MarketRotationExplainability;
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
    liveRatesUsed: false;
    livePortfolioSystemUsed: false;
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

const REQUIRED_INPUTS: Array<keyof MarketRotationInput> = [
  "marketAdaptabilityScore",
  "regionalRotationResilienceScore",
  "corridorTransitionDurabilityScore",
  "diversificationAwareRepositioningScore",
  "multiMarketFlexibilityScore",
  "strategicRepositioningDisciplineScore",
  "defensiveAdaptabilityScore",
  "rotationTimingResilienceScore",
  "expansionRebalancingScore",
  "corridorMigrationFlexibilityScore",
  "assetCategoryAdaptabilityScore",
  "recoveryTransitionReadinessScore",
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

function hasFallbackForInput(input: MarketRotationInput, key: keyof MarketRotationInput) {
  const shockProfile = input.economicShockResilienceProfile;
  const competitiveProfile = input.competitiveSaturationProfile;
  const regionalProfile = input.regionalDominanceProfile;
  const sequencingProfile = input.institutionalExpansionSequencingProfile;
  const riskProfile = input.portfolioRiskBalancingProfile;
  const corridorProfile = input.corridorIntelligenceProfile;

  const fallbackPaths: Partial<Record<keyof MarketRotationInput, boolean>> = {
    marketAdaptabilityScore:
      hasProfileScore(shockProfile, ["economicShockResilience", "recoveryPositioningQuality"]) ||
      hasProfileScore(sequencingProfile, ["strategicRolloutResilience", "expansionReadiness"]),
    regionalRotationResilienceScore:
      hasProfileScore(regionalProfile, ["strategicRegionalResilience", "multiMarketDefensibility"]) ||
      hasProfileScore(shockProfile, ["multiAssetShockBalance", "recoveryPositioningQuality"]),
    corridorTransitionDurabilityScore:
      hasProfileScore(corridorProfile, ["scoreBreakdown.durabilityScore", "overallCorridorScore"]) ||
      hasProfileScore(shockProfile, ["corridorStressDurability"]),
    diversificationAwareRepositioningScore:
      hasProfileScore(riskProfile, ["diversificationEffectiveness", "assetExposureBalance"]) ||
      hasProfileScore(regionalProfile, ["diversificationAwareTerritoryBalance"]),
    multiMarketFlexibilityScore:
      hasProfileScore(regionalProfile, ["multiMarketDefensibility", "regionalExpansionCoherence"]) ||
      hasProfileScore(sequencingProfile, ["multiMarketPacingQuality", "strategicRolloutResilience"]),
    strategicRepositioningDisciplineScore:
      hasProfileScore(sequencingProfile, ["phasedExpansionDiscipline", "capitalAlignedExpansionPacing"]) ||
      hasProfileScore(shockProfile, ["expansionSlowdownTolerance"]),
    defensiveAdaptabilityScore:
      hasProfileScore(shockProfile, ["assetDefensiveStrength", "downsideAbsorptionCapacity"]) ||
      hasProfileScore(riskProfile, ["defensivePositioning", "downsideProtectionBalance"]),
    rotationTimingResilienceScore:
      hasProfileScore(shockProfile, ["recoveryPositioningQuality", "expansionSlowdownTolerance"]) ||
      hasProfileScore(sequencingProfile, ["defensiveExpansionTiming"]),
    expansionRebalancingScore:
      hasProfileScore(sequencingProfile, ["diversificationAwareExpansionQuality", "expansionDependencyManagement"]) ||
      hasProfileScore(riskProfile, ["correlationAdjustedRiskBalance"]),
    corridorMigrationFlexibilityScore:
      hasProfileScore(regionalProfile, ["geographicInfluenceDurability", "corridorConcentrationResilience"]) ||
      hasProfileScore(corridorProfile, ["scoreBreakdown.connectivityScore", "strategicExpansionFit"]),
    assetCategoryAdaptabilityScore:
      hasProfileScore(riskProfile, ["assetExposureBalance", "diversificationEffectiveness"]) ||
      hasProfileScore(shockProfile, ["multiAssetShockBalance", "assetDefensiveStrength"]),
    recoveryTransitionReadinessScore:
      hasProfileScore(shockProfile, ["recoveryPositioningQuality", "economicShockResilience"]) ||
      hasProfileScore(competitiveProfile, ["saturationAdjustedExpansionQuality", "competitiveResilience"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: MarketRotationInput) {
  const labels: Record<keyof MarketRotationInput, string> = {
    marketAdaptabilityScore: "market adaptability score",
    regionalRotationResilienceScore: "regional rotation resilience score",
    corridorTransitionDurabilityScore: "corridor transition durability score",
    diversificationAwareRepositioningScore: "diversification-aware repositioning score",
    multiMarketFlexibilityScore: "multi-market flexibility score",
    strategicRepositioningDisciplineScore: "strategic repositioning discipline score",
    defensiveAdaptabilityScore: "defensive adaptability score",
    rotationTimingResilienceScore: "rotation timing resilience score",
    expansionRebalancingScore: "expansion rebalancing score",
    corridorMigrationFlexibilityScore: "corridor migration flexibility score",
    assetCategoryAdaptabilityScore: "asset-category adaptability score",
    recoveryTransitionReadinessScore: "recovery transition readiness score",
    economicShockResilienceProfile: "economic shock resilience profile",
    competitiveSaturationProfile: "competitive saturation profile",
    regionalDominanceProfile: "regional dominance profile",
    institutionalExpansionSequencingProfile: "institutional expansion sequencing profile",
    portfolioRiskBalancingProfile: "portfolio risk-balancing profile",
    corridorIntelligenceProfile: "corridor intelligence profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: MarketRotationInput): MarketRotationScoreBreakdown {
  const shockProfile = input.economicShockResilienceProfile;
  const competitiveProfile = input.competitiveSaturationProfile;
  const regionalProfile = input.regionalDominanceProfile;
  const sequencingProfile = input.institutionalExpansionSequencingProfile;
  const riskProfile = input.portfolioRiskBalancingProfile;
  const corridorProfile = input.corridorIntelligenceProfile;
  const corridorTransitionDurabilityScore = getScore(
    input.corridorTransitionDurabilityScore,
    weightedAverage([
      [extractProfileScore(corridorProfile, ["scoreBreakdown.durabilityScore", "overallCorridorScore"], 54), 0.28],
      [extractProfileScore(shockProfile, ["corridorStressDurability", "scoreBreakdown.corridorStressDurabilityScore"], 54), 0.24],
      [extractProfileScore(regionalProfile, ["corridorDominanceDurability", "scoreBreakdown.corridorDominanceDurabilityScore"], 54), 0.18],
      [extractProfileScore(sequencingProfile, ["corridorRolloutDurability", "scoreBreakdown.corridorRolloutDurabilityScore"], 54), 0.16],
      [extractProfileScore(corridorProfile, ["strategicExpansionFit", "scoreBreakdown.expansionScore"], 54), 0.14],
    ]),
  );
  const diversificationAwareRepositioningScore = getScore(
    input.diversificationAwareRepositioningScore,
    weightedAverage([
      [extractProfileScore(riskProfile, ["diversificationEffectiveness", "scoreBreakdown.diversificationEffectivenessScore"], 54), 0.28],
      [extractProfileScore(riskProfile, ["assetExposureBalance", "scoreBreakdown.assetExposureBalanceScore"], 54), 0.18],
      [extractProfileScore(regionalProfile, ["diversificationAwareTerritoryBalance", "scoreBreakdown.diversificationAwareTerritoryBalanceScore"], 54), 0.2],
      [extractProfileScore(sequencingProfile, ["diversificationAwareExpansionQuality", "scoreBreakdown.diversificationAwareExpansionQualityScore"], 54), 0.16],
      [extractProfileScore(shockProfile, ["multiAssetShockBalance", "scoreBreakdown.multiAssetShockBalanceScore"], 54), 0.18],
    ]),
  );
  const multiMarketFlexibilityScore = getScore(
    input.multiMarketFlexibilityScore,
    weightedAverage([
      [extractProfileScore(regionalProfile, ["multiMarketDefensibility", "scoreBreakdown.multiMarketDefensibilityScore"], 54), 0.24],
      [extractProfileScore(regionalProfile, ["regionalExpansionCoherence", "scoreBreakdown.regionalExpansionCoherenceScore"], 54), 0.18],
      [extractProfileScore(sequencingProfile, ["multiMarketPacingQuality", "scoreBreakdown.multiMarketPacingQualityScore"], 54), 0.18],
      [extractProfileScore(sequencingProfile, ["strategicRolloutResilience", "scoreBreakdown.strategicRolloutResilienceScore"], 54), 0.16],
      [extractProfileScore(shockProfile, ["multiAssetShockBalance", "recoveryPositioningQuality"], 54), 0.14],
      [diversificationAwareRepositioningScore, 0.1],
    ]),
  );
  const defensiveMarketAdaptabilityScore = getScore(
    input.defensiveAdaptabilityScore,
    weightedAverage([
      [extractProfileScore(shockProfile, ["assetDefensiveStrength", "scoreBreakdown.assetDefensiveStrengthScore"], 54), 0.24],
      [extractProfileScore(shockProfile, ["downsideAbsorptionCapacity", "scoreBreakdown.downsideAbsorptionCapacityScore"], 54), 0.22],
      [extractProfileScore(riskProfile, ["defensivePositioning", "scoreBreakdown.defensivePositioningScore"], 54), 0.18],
      [extractProfileScore(riskProfile, ["downsideProtectionBalance", "scoreBreakdown.downsideProtectionBalanceScore"], 54), 0.16],
      [multiMarketFlexibilityScore, 0.1],
      [diversificationAwareRepositioningScore, 0.1],
    ]),
  );
  const strategicRepositioningDisciplineScore = getScore(
    input.strategicRepositioningDisciplineScore,
    weightedAverage([
      [extractProfileScore(sequencingProfile, ["phasedExpansionDiscipline", "scoreBreakdown.phasedExpansionDisciplineScore"], 54), 0.26],
      [extractProfileScore(sequencingProfile, ["capitalAlignedExpansionPacing", "scoreBreakdown.capitalAlignedExpansionPacingScore"], 54), 0.2],
      [extractProfileScore(shockProfile, ["expansionSlowdownTolerance", "scoreBreakdown.expansionSlowdownToleranceScore"], 54), 0.18],
      [defensiveMarketAdaptabilityScore, 0.14],
      [diversificationAwareRepositioningScore, 0.12],
      [extractProfileScore(competitiveProfile, ["saturationAdjustedExpansionQuality", "scoreBreakdown.saturationAdjustedExpansionQualityScore"], 54), 0.1],
    ]),
  );
  const rotationTimingResilienceScore = getScore(
    input.rotationTimingResilienceScore,
    weightedAverage([
      [extractProfileScore(shockProfile, ["recoveryPositioningQuality", "scoreBreakdown.recoveryPositioningQualityScore"], 54), 0.24],
      [extractProfileScore(shockProfile, ["expansionSlowdownTolerance", "scoreBreakdown.expansionSlowdownToleranceScore"], 54), 0.2],
      [extractProfileScore(sequencingProfile, ["defensiveExpansionTiming", "scoreBreakdown.defensiveExpansionTimingScore"], 54), 0.16],
      [strategicRepositioningDisciplineScore, 0.14],
      [defensiveMarketAdaptabilityScore, 0.14],
      [multiMarketFlexibilityScore, 0.12],
    ]),
  );
  const expansionRebalancingQualityScore = getScore(
    input.expansionRebalancingScore,
    weightedAverage([
      [extractProfileScore(sequencingProfile, ["diversificationAwareExpansionQuality", "scoreBreakdown.diversificationAwareExpansionQualityScore"], 54), 0.22],
      [extractProfileScore(sequencingProfile, ["expansionDependencyManagement", "scoreBreakdown.expansionDependencyManagementScore"], 54), 0.18],
      [extractProfileScore(riskProfile, ["correlationAdjustedRiskBalance", "scoreBreakdown.correlationAdjustedRiskBalanceScore"], 54), 0.16],
      [diversificationAwareRepositioningScore, 0.14],
      [multiMarketFlexibilityScore, 0.12],
      [strategicRepositioningDisciplineScore, 0.1],
      [extractProfileScore(competitiveProfile, ["saturationAdjustedExpansionQuality"], 54), 0.08],
    ]),
  );
  const corridorMigrationFlexibilityScore = getScore(
    input.corridorMigrationFlexibilityScore,
    weightedAverage([
      [extractProfileScore(regionalProfile, ["geographicInfluenceDurability", "scoreBreakdown.geographicInfluenceDurabilityScore"], 54), 0.22],
      [extractProfileScore(regionalProfile, ["corridorConcentrationResilience", "scoreBreakdown.corridorConcentrationResilienceScore"], 54), 0.18],
      [extractProfileScore(corridorProfile, ["scoreBreakdown.connectivityScore", "strategicExpansionFit"], 54), 0.2],
      [corridorTransitionDurabilityScore, 0.14],
      [multiMarketFlexibilityScore, 0.14],
      [expansionRebalancingQualityScore, 0.12],
    ]),
  );
  const assetCategoryAdaptabilityScore = getScore(
    input.assetCategoryAdaptabilityScore,
    weightedAverage([
      [extractProfileScore(riskProfile, ["assetExposureBalance", "scoreBreakdown.assetExposureBalanceScore"], 54), 0.22],
      [extractProfileScore(riskProfile, ["diversificationEffectiveness", "scoreBreakdown.diversificationEffectivenessScore"], 54), 0.2],
      [extractProfileScore(shockProfile, ["multiAssetShockBalance", "scoreBreakdown.multiAssetShockBalanceScore"], 54), 0.2],
      [extractProfileScore(shockProfile, ["assetDefensiveStrength", "scoreBreakdown.assetDefensiveStrengthScore"], 54), 0.14],
      [diversificationAwareRepositioningScore, 0.14],
      [expansionRebalancingQualityScore, 0.1],
    ]),
  );
  const recoveryTransitionReadinessScore = getScore(
    input.recoveryTransitionReadinessScore,
    weightedAverage([
      [extractProfileScore(shockProfile, ["recoveryPositioningQuality", "scoreBreakdown.recoveryPositioningQualityScore"], 54), 0.24],
      [extractProfileScore(shockProfile, ["economicShockResilience", "scoreBreakdown.economicShockResilienceScore"], 54), 0.18],
      [extractProfileScore(competitiveProfile, ["saturationAdjustedExpansionQuality", "scoreBreakdown.saturationAdjustedExpansionQualityScore"], 54), 0.16],
      [extractProfileScore(competitiveProfile, ["competitiveResilience", "scoreBreakdown.competitiveResilienceScore"], 54), 0.12],
      [rotationTimingResilienceScore, 0.12],
      [corridorMigrationFlexibilityScore, 0.1],
      [assetCategoryAdaptabilityScore, 0.08],
    ]),
  );
  const regionalRotationResilienceScore = getScore(
    input.regionalRotationResilienceScore,
    weightedAverage([
      [extractProfileScore(regionalProfile, ["strategicRegionalResilience", "scoreBreakdown.strategicRegionalResilienceScore"], 54), 0.24],
      [extractProfileScore(regionalProfile, ["multiMarketDefensibility", "scoreBreakdown.multiMarketDefensibilityScore"], 54), 0.18],
      [extractProfileScore(shockProfile, ["multiAssetShockBalance", "scoreBreakdown.multiAssetShockBalanceScore"], 54), 0.16],
      [extractProfileScore(shockProfile, ["recoveryPositioningQuality", "scoreBreakdown.recoveryPositioningQualityScore"], 54), 0.14],
      [multiMarketFlexibilityScore, 0.12],
      [corridorMigrationFlexibilityScore, 0.08],
      [recoveryTransitionReadinessScore, 0.08],
    ]),
  );
  const marketAdaptabilityQualityScore = getScore(
    input.marketAdaptabilityScore,
    weightedAverage([
      [regionalRotationResilienceScore, 0.14],
      [corridorTransitionDurabilityScore, 0.1],
      [diversificationAwareRepositioningScore, 0.12],
      [multiMarketFlexibilityScore, 0.12],
      [strategicRepositioningDisciplineScore, 0.11],
      [defensiveMarketAdaptabilityScore, 0.11],
      [rotationTimingResilienceScore, 0.1],
      [expansionRebalancingQualityScore, 0.08],
      [corridorMigrationFlexibilityScore, 0.08],
      [assetCategoryAdaptabilityScore, 0.07],
      [recoveryTransitionReadinessScore, 0.07],
    ]),
  );
  const marketRotationResilienceScore = weightedAverage([
    [marketAdaptabilityQualityScore, 0.12],
    [regionalRotationResilienceScore, 0.1],
    [corridorTransitionDurabilityScore, 0.09],
    [diversificationAwareRepositioningScore, 0.09],
    [multiMarketFlexibilityScore, 0.1],
    [strategicRepositioningDisciplineScore, 0.1],
    [defensiveMarketAdaptabilityScore, 0.1],
    [rotationTimingResilienceScore, 0.08],
    [expansionRebalancingQualityScore, 0.08],
    [corridorMigrationFlexibilityScore, 0.08],
    [assetCategoryAdaptabilityScore, 0.08],
    [recoveryTransitionReadinessScore, 0.08],
  ]);

  return {
    connectivityScore: corridorMigrationFlexibilityScore,
    durabilityScore: corridorTransitionDurabilityScore,
    expansionScore: expansionRebalancingQualityScore,
    institutionalScore: strategicRepositioningDisciplineScore,
    logisticsScore: multiMarketFlexibilityScore,
    luxuryScore: assetCategoryAdaptabilityScore,
    developmentScore: recoveryTransitionReadinessScore,
    marketRotationResilienceScore,
    marketAdaptabilityQualityScore,
    regionalRotationResilienceScore,
    corridorTransitionDurabilityScore,
    diversificationAwareRepositioningScore,
    multiMarketFlexibilityScore,
    strategicRepositioningDisciplineScore,
    defensiveMarketAdaptabilityScore,
    rotationTimingResilienceScore,
    expansionRebalancingQualityScore,
    corridorMigrationFlexibilityScore,
    assetCategoryAdaptabilityScore,
    recoveryTransitionReadinessScore,
  };
}

function classifyMarketRotation(scoreBreakdown: MarketRotationScoreBreakdown, warnings: CorridorWarning[]): MarketRotationClassification {
  if (warnings.some((warning) => warning.severity === "high") || scoreBreakdown.marketRotationResilienceScore < 42) return "rigid";
  if (scoreBreakdown.defensiveMarketAdaptabilityScore < 48 || scoreBreakdown.multiMarketFlexibilityScore < 48) return "constrained";
  if (
    scoreBreakdown.marketRotationResilienceScore >= 82 &&
    scoreBreakdown.marketAdaptabilityQualityScore >= 74 &&
    scoreBreakdown.strategicRepositioningDisciplineScore >= 70
  ) {
    return "institutional_grade";
  }
  if (scoreBreakdown.marketRotationResilienceScore >= 68 && scoreBreakdown.recoveryTransitionReadinessScore >= 62) return "adaptable";

  return "selective";
}

function buildWarnings(scoreBreakdown: MarketRotationScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "MARKET_ROTATION_DATA_INCOMPLETE",
            severity: missingData.length >= 6 ? "high" : "medium",
            message: "Market rotation assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.marketRotationResilienceScore < 42
      ? [
          createCorridorWarning({
            code: "MARKET_ROTATION_RESILIENCE_WEAK",
            severity: "high",
            message: "Market rotation resilience is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.multiMarketFlexibilityScore < 42
      ? [
          createCorridorWarning({
            code: "MULTI_MARKET_FLEXIBILITY_WEAK",
            severity: "high",
            message: "Multi-market flexibility is weak enough to require manual review.",
            category: "mixed",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.corridorTransitionDurabilityScore < 45
      ? [
          createCorridorWarning({
            code: "CORRIDOR_TRANSITION_DURABILITY_WEAK",
            severity: "medium",
            message: "Corridor transition durability is weak under current structured inputs.",
            category: "mixed",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.strategicRepositioningDisciplineScore < 45
      ? [
          createCorridorWarning({
            code: "STRATEGIC_REPOSITIONING_DISCIPLINE_WEAK",
            severity: "medium",
            message: "Strategic repositioning discipline is weak and requires human review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.defensiveMarketAdaptabilityScore < 45
      ? [
          createCorridorWarning({
            code: "DEFENSIVE_MARKET_ADAPTABILITY_WEAK",
            severity: "medium",
            message: "Defensive market adaptability is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.assetCategoryAdaptabilityScore < 45
      ? [
          createCorridorWarning({
            code: "ASSET_CATEGORY_ADAPTABILITY_WEAK",
            severity: "medium",
            message: "Asset-category adaptability is weak under current structured inputs.",
            category: "mixed",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.marketRotationResilienceScore >= 70 && scoreBreakdown.rotationTimingResilienceScore < 56
      ? [
          createCorridorWarning({
            code: "ROTATION_STRENGTH_WITH_TIMING_WATCHLIST",
            severity: "low",
            message: "Market rotation resilience is strong, but rotation timing resilience remains on the review watchlist.",
            category: "institutional",
            requiresHumanReview: false,
          }),
        ]
      : []),
  ];
}

function buildAssumptions(input: MarketRotationInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0 ? ["Missing market rotation inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."] : []),
    "Market rotation scoring is strategic, deterministic, and read-only; it is not investment advice, portfolio-management advice, lending advice, legal advice, financial advice, market prediction, or autonomous execution logic.",
    "No live market data, live rates, financial APIs, external APIs, scraping, MLS data, county calls, portfolio systems, demographic data, or protected-class data was used.",
  ]);
}

function buildExplainability(params: {
  scoreBreakdown: MarketRotationScoreBreakdown;
  classification: MarketRotationClassification;
  warnings: CorridorWarning[];
  missingData: string[];
  assumptions: string[];
}): MarketRotationExplainability {
  const scoreBreakdown = params.scoreBreakdown;
  const strengths = unique([
    ...(scoreBreakdown.marketAdaptabilityQualityScore >= 70 ? ["Market adaptability quality is strong."] : []),
    ...(scoreBreakdown.regionalRotationResilienceScore >= 70 ? ["Regional rotation resilience is strong."] : []),
    ...(scoreBreakdown.corridorTransitionDurabilityScore >= 70 ? ["Corridor transition durability is strong."] : []),
    ...(scoreBreakdown.diversificationAwareRepositioningScore >= 70 ? ["Diversification-aware repositioning is strong."] : []),
    ...(scoreBreakdown.multiMarketFlexibilityScore >= 70 ? ["Multi-market flexibility is strong."] : []),
    ...(scoreBreakdown.strategicRepositioningDisciplineScore >= 70 ? ["Strategic repositioning discipline is strong."] : []),
    ...(scoreBreakdown.defensiveMarketAdaptabilityScore >= 70 ? ["Defensive market adaptability is strong."] : []),
    ...(scoreBreakdown.recoveryTransitionReadinessScore >= 70 ? ["Recovery transition readiness is strong."] : []),
  ]);
  const weaknesses = unique([
    ...(scoreBreakdown.marketAdaptabilityQualityScore < 45 ? ["Market adaptability quality is weak."] : []),
    ...(scoreBreakdown.regionalRotationResilienceScore < 45 ? ["Regional rotation resilience is weak."] : []),
    ...(scoreBreakdown.corridorTransitionDurabilityScore < 45 ? ["Corridor transition durability is weak."] : []),
    ...(scoreBreakdown.diversificationAwareRepositioningScore < 45 ? ["Diversification-aware repositioning is weak."] : []),
    ...(scoreBreakdown.multiMarketFlexibilityScore < 45 ? ["Multi-market flexibility is weak."] : []),
    ...(scoreBreakdown.strategicRepositioningDisciplineScore < 45 ? ["Strategic repositioning discipline is weak."] : []),
    ...(scoreBreakdown.defensiveMarketAdaptabilityScore < 45 ? ["Defensive market adaptability is weak."] : []),
    ...(scoreBreakdown.recoveryTransitionReadinessScore < 45 ? ["Recovery transition readiness is weak."] : []),
  ]);
  const risks = unique([
    ...(params.warnings.some((warning) => warning.severity === "high") ? ["High-severity market rotation warning requires manual review."] : []),
    ...(scoreBreakdown.marketRotationResilienceScore < 50 ? ["Market rotation resilience is weak under current structured inputs."] : []),
    ...(scoreBreakdown.corridorMigrationFlexibilityScore < 45 ? ["Corridor migration flexibility may constrain strategic adaptability."] : []),
    ...(scoreBreakdown.assetCategoryAdaptabilityScore < 45 ? ["Asset-category adaptability may limit repositioning optionality."] : []),
    ...(scoreBreakdown.rotationTimingResilienceScore < 45 ? ["Rotation timing resilience is weak; this is not a market prediction."] : []),
    ...(params.missingData.length > 0 ? `Missing data reduces confidence: ${params.missingData.slice(0, 4).join(", ")}.` : []),
  ]);

  return {
    summary: `Market rotation classification is ${params.classification} with a ${scoreBreakdown.marketRotationResilienceScore}/100 rotation resilience score and ${scoreBreakdown.marketAdaptabilityQualityScore}/100 adaptability quality score. This is deterministic read-only rotation intelligence only and does not predict markets or automate strategy changes.`,
    strengths,
    weaknesses,
    risks,
    assumptions: params.assumptions,
  };
}

export function analyzeMarketRotationIntelligence(input: MarketRotationInput = {}): MarketRotationResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const marketRotationClassification = classifyMarketRotation(scoreBreakdown, warnings);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });
  const explainability = buildExplainability({
    scoreBreakdown,
    classification: marketRotationClassification,
    warnings,
    missingData,
    assumptions,
  });

  return {
    marketRotationResilience: scoreBreakdown.marketRotationResilienceScore,
    marketRotationClassification,
    marketAdaptabilityQuality: scoreBreakdown.marketAdaptabilityQualityScore,
    regionalRotationResilience: scoreBreakdown.regionalRotationResilienceScore,
    corridorTransitionDurability: scoreBreakdown.corridorTransitionDurabilityScore,
    diversificationAwareRepositioning: scoreBreakdown.diversificationAwareRepositioningScore,
    multiMarketFlexibility: scoreBreakdown.multiMarketFlexibilityScore,
    strategicRepositioningDiscipline: scoreBreakdown.strategicRepositioningDisciplineScore,
    defensiveMarketAdaptability: scoreBreakdown.defensiveMarketAdaptabilityScore,
    rotationTimingResilience: scoreBreakdown.rotationTimingResilienceScore,
    expansionRebalancingQuality: scoreBreakdown.expansionRebalancingQualityScore,
    corridorMigrationFlexibility: scoreBreakdown.corridorMigrationFlexibilityScore,
    assetCategoryAdaptability: scoreBreakdown.assetCategoryAdaptabilityScore,
    recoveryTransitionReadiness: scoreBreakdown.recoveryTransitionReadinessScore,
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
      liveRatesUsed: false,
      livePortfolioSystemUsed: false,
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

export const getMarketRotationIntelligence = analyzeMarketRotationIntelligence;
