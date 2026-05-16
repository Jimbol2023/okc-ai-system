import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import type { PhaseRSurvivabilityIntelligenceRecord } from "./phase-r-survivability-intelligence-contract";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type EconomicShockResilienceClassification = "fragile" | "exposed" | "selective" | "resilient" | "institutional_grade";

export type EconomicShockResilienceInput = {
  liquidityStressDurabilityScore?: number;
  demandDisruptionResilienceScore?: number;
  capitalAccessResilienceScore?: number;
  incomeDisruptionProxyScore?: number;
  buyerExitResilienceScore?: number;
  corridorStressDurabilityScore?: number;
  assetDefensiveStrengthScore?: number;
  downsideAbsorptionScore?: number;
  expansionSlowdownToleranceScore?: number;
  multiAssetShockBalanceScore?: number;
  recoveryPositioningScore?: number;
  competitiveSaturationProfile?: unknown;
  regionalDominanceProfile?: unknown;
  institutionalExpansionSequencingProfile?: unknown;
  portfolioRiskBalancingProfile?: unknown;
  capitalCycleProfile?: unknown;
  multiAssetExpansionProfile?: unknown;
  corridorIntelligenceProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EconomicShockResilienceScoreBreakdown = CorridorScoreBreakdown & {
  economicShockResilienceScore: number;
  liquidityStressDurabilityScore: number;
  demandDisruptionResilienceScore: number;
  capitalAccessResilienceScore: number;
  incomeDisruptionProxyScore: number;
  buyerExitResilienceScore: number;
  corridorStressDurabilityScore: number;
  assetDefensiveStrengthScore: number;
  downsideAbsorptionCapacityScore: number;
  expansionSlowdownToleranceScore: number;
  multiAssetShockBalanceScore: number;
  recoveryPositioningQualityScore: number;
};

export type EconomicShockResilienceExplainability = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  assumptions: string[];
};

export type EconomicShockResilienceResult = {
  economicShockResilience: number;
  economicShockResilienceClassification: EconomicShockResilienceClassification;
  liquidityStressDurability: number;
  demandDisruptionResilience: number;
  capitalAccessResilience: number;
  incomeDisruptionProxy: number;
  buyerExitResilience: number;
  corridorStressDurability: number;
  assetDefensiveStrength: number;
  downsideAbsorptionCapacity: number;
  expansionSlowdownTolerance: number;
  multiAssetShockBalance: number;
  recoveryPositioningQuality: number;
  confidenceScore: number;
  scoreBreakdown: EconomicShockResilienceScoreBreakdown;
  explainability: EconomicShockResilienceExplainability;
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

const REQUIRED_INPUTS: Array<keyof EconomicShockResilienceInput> = [
  "liquidityStressDurabilityScore",
  "demandDisruptionResilienceScore",
  "capitalAccessResilienceScore",
  "incomeDisruptionProxyScore",
  "buyerExitResilienceScore",
  "corridorStressDurabilityScore",
  "assetDefensiveStrengthScore",
  "downsideAbsorptionScore",
  "expansionSlowdownToleranceScore",
  "multiAssetShockBalanceScore",
  "recoveryPositioningScore",
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

function hasFallbackForInput(input: EconomicShockResilienceInput, key: keyof EconomicShockResilienceInput) {
  const competitiveProfile = input.competitiveSaturationProfile;
  const regionalProfile = input.regionalDominanceProfile;
  const sequencingProfile = input.institutionalExpansionSequencingProfile;
  const riskProfile = input.portfolioRiskBalancingProfile;
  const capitalCycleProfile = input.capitalCycleProfile;
  const multiAssetProfile = input.multiAssetExpansionProfile;
  const corridorProfile = input.corridorIntelligenceProfile;

  const fallbackPaths: Partial<Record<keyof EconomicShockResilienceInput, boolean>> = {
    liquidityStressDurabilityScore:
      hasProfileScore(capitalCycleProfile, ["liquidityResilience", "capitalFlexibility"]) ||
      hasProfileScore(riskProfile, ["downsideProtectionBalance", "portfolioResilienceBalance"]),
    demandDisruptionResilienceScore:
      hasProfileScore(competitiveProfile, ["competitiveResilience", "dealFlowDefensibility"]) ||
      hasProfileScore(multiAssetProfile, ["multiMarketSurvivability", "diversificationQuality"]),
    capitalAccessResilienceScore:
      hasProfileScore(capitalCycleProfile, ["capitalFlexibility", "institutionalPatienceAlignment", "capitalCycleAlignment"]) ||
      hasProfileScore(sequencingProfile, ["capitalAlignedExpansionPacing"]),
    incomeDisruptionProxyScore:
      hasProfileScore(riskProfile, ["downsideProtectionBalance", "assetExposureBalance"]) ||
      hasProfileScore(multiAssetProfile, ["assetInteractionStability", "portfolioExpansionDurability"]),
    buyerExitResilienceScore:
      hasProfileScore(competitiveProfile, ["dealFlowDefensibility", "buyerDemandSaturation", "competitiveResilience"]) ||
      hasProfileScore(regionalProfile, ["regionalMoatStrength", "multiMarketDefensibility"]),
    corridorStressDurabilityScore:
      hasProfileScore(corridorProfile, ["scoreBreakdown.durabilityScore", "overallCorridorScore"]) ||
      hasProfileScore(regionalProfile, ["corridorDominanceDurability", "geographicInfluenceDurability"]),
    assetDefensiveStrengthScore:
      hasProfileScore(riskProfile, ["defensivePositioning", "downsideProtectionBalance"]) ||
      hasProfileScore(multiAssetProfile, ["assetInteractionStability", "multiMarketSurvivability"]),
    downsideAbsorptionScore:
      hasProfileScore(riskProfile, ["downsideProtectionBalance", "portfolioResilienceBalance"]) ||
      hasProfileScore(capitalCycleProfile, ["downsideProtectionQuality", "multiAssetCycleResilience"]),
    expansionSlowdownToleranceScore:
      hasProfileScore(sequencingProfile, ["defensiveExpansionTiming", "expansionSurvivabilityQuality"]) ||
      hasProfileScore(capitalCycleProfile, ["expansionTimingDurability", "deploymentCautionLevel"]),
    multiAssetShockBalanceScore:
      hasProfileScore(riskProfile, ["diversificationEffectiveness", "portfolioResilienceBalance"]) ||
      hasProfileScore(multiAssetProfile, ["multiMarketSurvivability", "assetInteractionStability"]),
    recoveryPositioningScore:
      hasProfileScore(regionalProfile, ["strategicRegionalResilience", "expansionPositioningQuality"]) ||
      hasProfileScore(sequencingProfile, ["strategicRolloutResilience", "expansionReadiness"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: EconomicShockResilienceInput) {
  const labels: Record<keyof EconomicShockResilienceInput, string> = {
    liquidityStressDurabilityScore: "liquidity stress durability score",
    demandDisruptionResilienceScore: "demand disruption resilience score",
    capitalAccessResilienceScore: "capital access resilience score",
    incomeDisruptionProxyScore: "income disruption proxy score",
    buyerExitResilienceScore: "buyer-exit resilience score",
    corridorStressDurabilityScore: "corridor stress durability score",
    assetDefensiveStrengthScore: "asset defensive strength score",
    downsideAbsorptionScore: "downside absorption score",
    expansionSlowdownToleranceScore: "expansion slowdown tolerance score",
    multiAssetShockBalanceScore: "multi-asset shock balance score",
    recoveryPositioningScore: "recovery positioning score",
    competitiveSaturationProfile: "competitive saturation profile",
    regionalDominanceProfile: "regional dominance profile",
    institutionalExpansionSequencingProfile: "institutional expansion sequencing profile",
    portfolioRiskBalancingProfile: "portfolio risk-balancing profile",
    capitalCycleProfile: "capital-cycle profile",
    multiAssetExpansionProfile: "multi-asset expansion profile",
    corridorIntelligenceProfile: "corridor intelligence profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: EconomicShockResilienceInput): EconomicShockResilienceScoreBreakdown {
  const competitiveProfile = input.competitiveSaturationProfile;
  const regionalProfile = input.regionalDominanceProfile;
  const sequencingProfile = input.institutionalExpansionSequencingProfile;
  const riskProfile = input.portfolioRiskBalancingProfile;
  const capitalCycleProfile = input.capitalCycleProfile;
  const multiAssetProfile = input.multiAssetExpansionProfile;
  const corridorProfile = input.corridorIntelligenceProfile;
  const liquidityStressDurabilityScore = getScore(
    input.liquidityStressDurabilityScore,
    weightedAverage([
      [extractProfileScore(capitalCycleProfile, ["liquidityResilience", "scoreBreakdown.liquidityResilienceScore"], 54), 0.28],
      [extractProfileScore(capitalCycleProfile, ["capitalFlexibility", "scoreBreakdown.capitalFlexibilityScore"], 54), 0.24],
      [extractProfileScore(riskProfile, ["downsideProtectionBalance", "scoreBreakdown.downsideProtectionBalanceScore"], 54), 0.2],
      [extractProfileScore(riskProfile, ["portfolioResilienceBalance", "scoreBreakdown.portfolioResilienceBalanceScore"], 54), 0.18],
      [extractProfileScore(capitalCycleProfile, ["multiAssetCycleResilience", "scoreBreakdown.multiAssetCycleResilienceScore"], 54), 0.1],
    ]),
  );
  const demandDisruptionResilienceScore = getScore(
    input.demandDisruptionResilienceScore,
    weightedAverage([
      [extractProfileScore(competitiveProfile, ["competitiveResilience", "scoreBreakdown.competitiveResilienceScore"], 54), 0.24],
      [extractProfileScore(competitiveProfile, ["dealFlowDefensibility", "scoreBreakdown.dealFlowDefensibilityScore"], 54), 0.2],
      [100 - extractProfileScore(competitiveProfile, ["buyerDemandSaturation", "scoreBreakdown.buyerDemandSaturationScore"], 48), 0.16],
      [extractProfileScore(multiAssetProfile, ["multiMarketSurvivability", "scoreBreakdown.multiMarketSurvivabilityScore"], 54), 0.18],
      [extractProfileScore(multiAssetProfile, ["diversificationQuality", "scoreBreakdown.diversificationQualityScore"], 54), 0.12],
      [extractProfileScore(regionalProfile, ["multiMarketDefensibility", "scoreBreakdown.multiMarketDefensibilityScore"], 54), 0.1],
    ]),
  );
  const capitalAccessResilienceScore = getScore(
    input.capitalAccessResilienceScore,
    weightedAverage([
      [extractProfileScore(capitalCycleProfile, ["capitalFlexibility", "scoreBreakdown.capitalFlexibilityScore"], 54), 0.28],
      [extractProfileScore(capitalCycleProfile, ["institutionalPatienceAlignment", "scoreBreakdown.institutionalPatienceAlignmentScore"], 54), 0.18],
      [extractProfileScore(capitalCycleProfile, ["capitalCycleAlignment", "scoreBreakdown.capitalCycleAlignmentScore"], 54), 0.18],
      [extractProfileScore(sequencingProfile, ["capitalAlignedExpansionPacing", "scoreBreakdown.capitalAlignedExpansionPacingScore"], 54), 0.16],
      [liquidityStressDurabilityScore, 0.12],
      [100 - extractProfileScore(capitalCycleProfile, ["refinancingPressureProxy", "scoreBreakdown.refinancingPressureProxyScore"], 48), 0.08],
    ]),
  );
  const incomeDisruptionProxyScore = getScore(
    input.incomeDisruptionProxyScore,
    weightedAverage([
      [100 - extractProfileScore(riskProfile, ["downsideProtectionBalance", "scoreBreakdown.downsideProtectionBalanceScore"], 54), 0.24],
      [100 - extractProfileScore(riskProfile, ["assetExposureBalance", "scoreBreakdown.assetExposureBalanceScore"], 54), 0.2],
      [100 - extractProfileScore(multiAssetProfile, ["assetInteractionStability", "scoreBreakdown.assetInteractionStabilityScore"], 54), 0.18],
      [100 - extractProfileScore(multiAssetProfile, ["portfolioExpansionDurability", "scoreBreakdown.portfolioExpansionDurabilityScore"], 54), 0.16],
      [100 - liquidityStressDurabilityScore, 0.12],
      [100 - demandDisruptionResilienceScore, 0.1],
    ]),
  );
  const buyerExitResilienceScore = getScore(
    input.buyerExitResilienceScore,
    weightedAverage([
      [extractProfileScore(competitiveProfile, ["dealFlowDefensibility", "scoreBreakdown.dealFlowDefensibilityScore"], 54), 0.24],
      [extractProfileScore(competitiveProfile, ["competitiveResilience", "scoreBreakdown.competitiveResilienceScore"], 54), 0.2],
      [100 - extractProfileScore(competitiveProfile, ["buyerDemandSaturation", "scoreBreakdown.buyerDemandSaturationScore"], 48), 0.16],
      [extractProfileScore(regionalProfile, ["regionalMoatStrength", "regionalInfluenceStrength"], 54), 0.14],
      [demandDisruptionResilienceScore, 0.14],
      [extractProfileScore(regionalProfile, ["multiMarketDefensibility", "scoreBreakdown.multiMarketDefensibilityScore"], 54), 0.12],
    ]),
  );
  const corridorStressDurabilityScore = getScore(
    input.corridorStressDurabilityScore,
    weightedAverage([
      [extractProfileScore(corridorProfile, ["scoreBreakdown.durabilityScore", "overallCorridorScore"], 54), 0.28],
      [extractProfileScore(regionalProfile, ["corridorDominanceDurability", "scoreBreakdown.corridorDominanceDurabilityScore"], 54), 0.22],
      [extractProfileScore(regionalProfile, ["geographicInfluenceDurability", "scoreBreakdown.geographicInfluenceDurabilityScore"], 54), 0.18],
      [extractProfileScore(riskProfile, ["corridorExposureBalance", "scoreBreakdown.corridorExposureBalanceScore"], 54), 0.14],
      [extractProfileScore(sequencingProfile, ["corridorRolloutDurability", "scoreBreakdown.corridorRolloutDurabilityScore"], 54), 0.12],
      [100 - extractProfileScore(competitiveProfile, ["corridorCompetitionIntensity", "scoreBreakdown.corridorCompetitionIntensityScore"], 48), 0.06],
    ]),
  );
  const assetDefensiveStrengthScore = getScore(
    input.assetDefensiveStrengthScore,
    weightedAverage([
      [extractProfileScore(riskProfile, ["defensivePositioning", "scoreBreakdown.defensivePositioningScore"], 54), 0.24],
      [extractProfileScore(riskProfile, ["downsideProtectionBalance", "scoreBreakdown.downsideProtectionBalanceScore"], 54), 0.22],
      [extractProfileScore(multiAssetProfile, ["assetInteractionStability", "scoreBreakdown.assetInteractionStabilityScore"], 54), 0.18],
      [extractProfileScore(multiAssetProfile, ["multiMarketSurvivability", "scoreBreakdown.multiMarketSurvivabilityScore"], 54), 0.14],
      [liquidityStressDurabilityScore, 0.12],
      [100 - incomeDisruptionProxyScore, 0.1],
    ]),
  );
  const downsideAbsorptionCapacityScore = getScore(
    input.downsideAbsorptionScore,
    weightedAverage([
      [extractProfileScore(riskProfile, ["downsideProtectionBalance", "scoreBreakdown.downsideProtectionBalanceScore"], 54), 0.26],
      [extractProfileScore(riskProfile, ["portfolioResilienceBalance", "scoreBreakdown.portfolioResilienceBalanceScore"], 54), 0.22],
      [extractProfileScore(capitalCycleProfile, ["downsideProtectionQuality", "scoreBreakdown.downsideProtectionQualityScore"], 54), 0.2],
      [assetDefensiveStrengthScore, 0.14],
      [liquidityStressDurabilityScore, 0.1],
      [100 - incomeDisruptionProxyScore, 0.08],
    ]),
  );
  const expansionSlowdownToleranceScore = getScore(
    input.expansionSlowdownToleranceScore,
    weightedAverage([
      [extractProfileScore(sequencingProfile, ["defensiveExpansionTiming", "scoreBreakdown.defensiveExpansionTimingScore"], 54), 0.22],
      [extractProfileScore(sequencingProfile, ["expansionSurvivabilityQuality", "scoreBreakdown.expansionSurvivabilityQualityScore"], 54), 0.2],
      [extractProfileScore(capitalCycleProfile, ["expansionTimingDurability", "scoreBreakdown.expansionTimingDurabilityScore"], 54), 0.16],
      [extractProfileScore(capitalCycleProfile, ["deploymentCautionLevel", "scoreBreakdown.deploymentCautionLevelScore"], 54), 0.12],
      [capitalAccessResilienceScore, 0.12],
      [downsideAbsorptionCapacityScore, 0.1],
      [corridorStressDurabilityScore, 0.08],
    ]),
  );
  const multiAssetShockBalanceScore = getScore(
    input.multiAssetShockBalanceScore,
    weightedAverage([
      [extractProfileScore(riskProfile, ["diversificationEffectiveness", "scoreBreakdown.diversificationEffectivenessScore"], 54), 0.22],
      [extractProfileScore(riskProfile, ["portfolioResilienceBalance", "scoreBreakdown.portfolioResilienceBalanceScore"], 54), 0.2],
      [extractProfileScore(multiAssetProfile, ["multiMarketSurvivability", "scoreBreakdown.multiMarketSurvivabilityScore"], 54), 0.18],
      [extractProfileScore(multiAssetProfile, ["assetInteractionStability", "scoreBreakdown.assetInteractionStabilityScore"], 54), 0.16],
      [assetDefensiveStrengthScore, 0.1],
      [demandDisruptionResilienceScore, 0.08],
      [corridorStressDurabilityScore, 0.06],
    ]),
  );
  const recoveryPositioningQualityScore = getScore(
    input.recoveryPositioningScore,
    weightedAverage([
      [extractProfileScore(regionalProfile, ["strategicRegionalResilience", "scoreBreakdown.strategicRegionalResilienceScore"], 54), 0.22],
      [extractProfileScore(regionalProfile, ["expansionPositioningQuality", "scoreBreakdown.expansionPositioningQualityScore"], 54), 0.16],
      [extractProfileScore(sequencingProfile, ["strategicRolloutResilience", "scoreBreakdown.strategicRolloutResilienceScore"], 54), 0.16],
      [extractProfileScore(sequencingProfile, ["expansionReadiness", "scoreBreakdown.expansionReadinessScore"], 54), 0.12],
      [competitiveProfile ? extractProfileScore(competitiveProfile, ["saturationAdjustedExpansionQuality", "scoreBreakdown.saturationAdjustedExpansionQualityScore"], 54) : 54, 0.1],
      [multiAssetShockBalanceScore, 0.1],
      [capitalAccessResilienceScore, 0.08],
      [buyerExitResilienceScore, 0.06],
    ]),
  );
  const economicShockResilienceScore = weightedAverage([
    [liquidityStressDurabilityScore, 0.12],
    [demandDisruptionResilienceScore, 0.1],
    [capitalAccessResilienceScore, 0.1],
    [100 - incomeDisruptionProxyScore, 0.09],
    [buyerExitResilienceScore, 0.09],
    [corridorStressDurabilityScore, 0.1],
    [assetDefensiveStrengthScore, 0.1],
    [downsideAbsorptionCapacityScore, 0.11],
    [expansionSlowdownToleranceScore, 0.09],
    [multiAssetShockBalanceScore, 0.1],
    [recoveryPositioningQualityScore, 0.1],
  ]);

  return {
    connectivityScore: corridorStressDurabilityScore,
    durabilityScore: downsideAbsorptionCapacityScore,
    expansionScore: expansionSlowdownToleranceScore,
    institutionalScore: capitalAccessResilienceScore,
    logisticsScore: liquidityStressDurabilityScore,
    luxuryScore: buyerExitResilienceScore,
    developmentScore: recoveryPositioningQualityScore,
    economicShockResilienceScore,
    liquidityStressDurabilityScore,
    demandDisruptionResilienceScore,
    capitalAccessResilienceScore,
    incomeDisruptionProxyScore,
    buyerExitResilienceScore,
    corridorStressDurabilityScore,
    assetDefensiveStrengthScore,
    downsideAbsorptionCapacityScore,
    expansionSlowdownToleranceScore,
    multiAssetShockBalanceScore,
    recoveryPositioningQualityScore,
  };
}

function classifyShockResilience(scoreBreakdown: EconomicShockResilienceScoreBreakdown, warnings: CorridorWarning[]): EconomicShockResilienceClassification {
  if (warnings.some((warning) => warning.severity === "high") || scoreBreakdown.economicShockResilienceScore < 42) return "fragile";
  if (scoreBreakdown.liquidityStressDurabilityScore < 48 || scoreBreakdown.downsideAbsorptionCapacityScore < 48) return "exposed";
  if (
    scoreBreakdown.economicShockResilienceScore >= 82 &&
    scoreBreakdown.liquidityStressDurabilityScore >= 72 &&
    scoreBreakdown.downsideAbsorptionCapacityScore >= 72 &&
    scoreBreakdown.multiAssetShockBalanceScore >= 70
  ) {
    return "institutional_grade";
  }
  if (scoreBreakdown.economicShockResilienceScore >= 68 && scoreBreakdown.recoveryPositioningQualityScore >= 62) return "resilient";

  return "selective";
}

function buildWarnings(scoreBreakdown: EconomicShockResilienceScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "ECONOMIC_SHOCK_RESILIENCE_DATA_INCOMPLETE",
            severity: missingData.length >= 6 ? "high" : "medium",
            message: "Economic shock resilience assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.economicShockResilienceScore < 42
      ? [
          createCorridorWarning({
            code: "ECONOMIC_SHOCK_RESILIENCE_FRAGILE",
            severity: "high",
            message: "Economic shock resilience is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.liquidityStressDurabilityScore < 42
      ? [
          createCorridorWarning({
            code: "LIQUIDITY_STRESS_DURABILITY_WEAK",
            severity: "high",
            message: "Liquidity stress durability is weak enough to require manual review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.capitalAccessResilienceScore < 45
      ? [
          createCorridorWarning({
            code: "CAPITAL_ACCESS_RESILIENCE_WEAK",
            severity: "medium",
            message: "Capital access resilience is weak; this is not lending advice or a financing prediction.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.incomeDisruptionProxyScore >= 72
      ? [
          createCorridorWarning({
            code: "INCOME_DISRUPTION_PROXY_HIGH",
            severity: "medium",
            message: "Income disruption proxy is elevated under current structured inputs.",
            category: "mixed",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.buyerExitResilienceScore < 45
      ? [
          createCorridorWarning({
            code: "BUYER_EXIT_RESILIENCE_WEAK",
            severity: "medium",
            message: "Buyer-exit resilience is weak under current structured inputs.",
            category: "mixed",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.corridorStressDurabilityScore < 45
      ? [
          createCorridorWarning({
            code: "CORRIDOR_STRESS_DURABILITY_WEAK",
            severity: "medium",
            message: "Corridor stress durability is weak and requires human review.",
            category: "mixed",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.expansionSlowdownToleranceScore < 45
      ? [
          createCorridorWarning({
            code: "EXPANSION_SLOWDOWN_TOLERANCE_WEAK",
            severity: "medium",
            message: "Expansion slowdown tolerance is weak under current structured inputs.",
            category: "development",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.economicShockResilienceScore >= 70 && scoreBreakdown.incomeDisruptionProxyScore >= 62
      ? [
          createCorridorWarning({
            code: "RESILIENCE_WITH_INCOME_DISRUPTION_WATCHLIST",
            severity: "low",
            message: "Overall shock resilience is strong, but income disruption proxy remains on the review watchlist.",
            category: "institutional",
            requiresHumanReview: false,
          }),
        ]
      : []),
  ];
}

function buildAssumptions(input: EconomicShockResilienceInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0 ? ["Missing economic shock resilience inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."] : []),
    "Economic shock resilience scoring is strategic, deterministic, and read-only; it is not investment advice, portfolio-management advice, lending advice, legal advice, financial advice, market prediction, or autonomous execution logic.",
    "No live market data, live rates, financial APIs, external APIs, scraping, MLS data, county calls, portfolio systems, demographic data, or protected-class data was used.",
  ]);
}

function buildExplainability(params: {
  scoreBreakdown: EconomicShockResilienceScoreBreakdown;
  classification: EconomicShockResilienceClassification;
  warnings: CorridorWarning[];
  missingData: string[];
  assumptions: string[];
}): EconomicShockResilienceExplainability {
  const scoreBreakdown = params.scoreBreakdown;
  const strengths = unique([
    ...(scoreBreakdown.liquidityStressDurabilityScore >= 70 ? ["Liquidity stress durability is strong."] : []),
    ...(scoreBreakdown.demandDisruptionResilienceScore >= 70 ? ["Demand disruption resilience is strong."] : []),
    ...(scoreBreakdown.capitalAccessResilienceScore >= 70 ? ["Capital access resilience is strong."] : []),
    ...(scoreBreakdown.buyerExitResilienceScore >= 70 ? ["Buyer-exit resilience is strong."] : []),
    ...(scoreBreakdown.corridorStressDurabilityScore >= 70 ? ["Corridor stress durability is strong."] : []),
    ...(scoreBreakdown.assetDefensiveStrengthScore >= 70 ? ["Asset defensive strength is strong."] : []),
    ...(scoreBreakdown.downsideAbsorptionCapacityScore >= 70 ? ["Downside absorption capacity is strong."] : []),
    ...(scoreBreakdown.recoveryPositioningQualityScore >= 70 ? ["Recovery positioning quality is strong."] : []),
  ]);
  const weaknesses = unique([
    ...(scoreBreakdown.liquidityStressDurabilityScore < 45 ? ["Liquidity stress durability is weak."] : []),
    ...(scoreBreakdown.demandDisruptionResilienceScore < 45 ? ["Demand disruption resilience is weak."] : []),
    ...(scoreBreakdown.capitalAccessResilienceScore < 45 ? ["Capital access resilience is weak."] : []),
    ...(scoreBreakdown.buyerExitResilienceScore < 45 ? ["Buyer-exit resilience is weak."] : []),
    ...(scoreBreakdown.corridorStressDurabilityScore < 45 ? ["Corridor stress durability is weak."] : []),
    ...(scoreBreakdown.assetDefensiveStrengthScore < 45 ? ["Asset defensive strength is weak."] : []),
    ...(scoreBreakdown.downsideAbsorptionCapacityScore < 45 ? ["Downside absorption capacity is weak."] : []),
    ...(scoreBreakdown.multiAssetShockBalanceScore < 45 ? ["Multi-asset shock balance is weak."] : []),
  ]);
  const risks = unique([
    ...(params.warnings.some((warning) => warning.severity === "high") ? ["High-severity economic shock resilience warning requires manual review."] : []),
    ...(scoreBreakdown.economicShockResilienceScore < 50 ? ["Economic shock resilience is weak under current structured inputs."] : []),
    ...(scoreBreakdown.incomeDisruptionProxyScore >= 70 ? ["Income disruption proxy is elevated; this is not a market prediction."] : []),
    ...(scoreBreakdown.capitalAccessResilienceScore < 45 ? ["Capital access resilience may limit stress durability; this is not lending advice."] : []),
    ...(scoreBreakdown.expansionSlowdownToleranceScore < 45 ? ["Expansion slowdown tolerance may reduce strategic flexibility."] : []),
    ...(params.missingData.length > 0 ? `Missing data reduces confidence: ${params.missingData.slice(0, 4).join(", ")}.` : []),
  ]);

  return {
    summary: `Economic shock resilience classification is ${params.classification} with a ${scoreBreakdown.economicShockResilienceScore}/100 resilience score and ${scoreBreakdown.downsideAbsorptionCapacityScore}/100 downside absorption score. This is deterministic read-only stress-resilience intelligence only and does not predict markets or provide investment, lending, portfolio-management, or legal advice.`,
    strengths,
    weaknesses,
    risks,
    assumptions: params.assumptions,
  };
}

export function analyzeEconomicShockResilienceIntelligence(input: EconomicShockResilienceInput = {}): EconomicShockResilienceResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const economicShockResilienceClassification = classifyShockResilience(scoreBreakdown, warnings);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });
  const explainability = buildExplainability({
    scoreBreakdown,
    classification: economicShockResilienceClassification,
    warnings,
    missingData,
    assumptions,
  });

  return {
    economicShockResilience: scoreBreakdown.economicShockResilienceScore,
    economicShockResilienceClassification,
    liquidityStressDurability: scoreBreakdown.liquidityStressDurabilityScore,
    demandDisruptionResilience: scoreBreakdown.demandDisruptionResilienceScore,
    capitalAccessResilience: scoreBreakdown.capitalAccessResilienceScore,
    incomeDisruptionProxy: scoreBreakdown.incomeDisruptionProxyScore,
    buyerExitResilience: scoreBreakdown.buyerExitResilienceScore,
    corridorStressDurability: scoreBreakdown.corridorStressDurabilityScore,
    assetDefensiveStrength: scoreBreakdown.assetDefensiveStrengthScore,
    downsideAbsorptionCapacity: scoreBreakdown.downsideAbsorptionCapacityScore,
    expansionSlowdownTolerance: scoreBreakdown.expansionSlowdownToleranceScore,
    multiAssetShockBalance: scoreBreakdown.multiAssetShockBalanceScore,
    recoveryPositioningQuality: scoreBreakdown.recoveryPositioningQualityScore,
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

export const getEconomicShockResilienceIntelligence = analyzeEconomicShockResilienceIntelligence;

export type EconomicShockSurvivabilityContractRecord =
  PhaseRSurvivabilityIntelligenceRecord & {
    readonly aggregationMetadata: PhaseRSurvivabilityIntelligenceRecord["aggregationMetadata"] & {
      readonly moduleName: "economic-shock-resilience-intelligence";
    };
  };
