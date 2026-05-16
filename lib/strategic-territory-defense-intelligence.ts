import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import type { PhaseRSurvivabilityIntelligenceRecord } from "./phase-r-survivability-intelligence-contract";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type StrategicTerritoryDefenseClassification = "fragile" | "exposed" | "defensible" | "resilient" | "institutional_grade";

export type StrategicTerritoryDefenseInput = {
  territoryResilienceScore?: number;
  operationalDefensibilityScore?: number;
  corridorContinuityProtectionScore?: number;
  diversificationProtectionScore?: number;
  saturationResilienceDurabilityScore?: number;
  expansionSurvivabilityDefenseScore?: number;
  multiMarketRedundancyScore?: number;
  strategicFlexibilityDurabilityScore?: number;
  geographicResilienceBalanceScore?: number;
  institutionalStabilityProtectionScore?: number;
  defensiveExpansionDurabilityScore?: number;
  corridorDependencyResilienceScore?: number;
  institutionalTerritoryProfile?: unknown;
  marketRotationProfile?: unknown;
  economicShockResilienceProfile?: unknown;
  competitiveSaturationProfile?: unknown;
  regionalDominanceProfile?: unknown;
  institutionalExpansionSequencingProfile?: unknown;
  corridorIntelligenceProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type StrategicTerritoryDefenseScoreBreakdown = CorridorScoreBreakdown & {
  strategicTerritoryDefenseQualityScore: number;
  territoryResilienceScore: number;
  operationalDefensibilityScore: number;
  corridorContinuityProtectionScore: number;
  diversificationProtectionQualityScore: number;
  saturationResilienceDurabilityScore: number;
  expansionSurvivabilityDefenseScore: number;
  multiMarketRedundancyStrengthScore: number;
  strategicFlexibilityDurabilityScore: number;
  geographicResilienceBalanceScore: number;
  institutionalStabilityProtectionScore: number;
  defensiveExpansionDurabilityScore: number;
  corridorDependencyResilienceScore: number;
};

export type StrategicTerritoryDefenseExplainability = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  assumptions: string[];
};

export type StrategicTerritoryDefenseSurvivabilityContractRecord = PhaseRSurvivabilityIntelligenceRecord & {
  readonly aggregationMetadata: PhaseRSurvivabilityIntelligenceRecord["aggregationMetadata"] & {
    readonly moduleName: "strategic-territory-defense-intelligence";
  };
};

export type StrategicTerritoryDefenseResult = {
  strategicTerritoryDefenseQuality: number;
  strategicTerritoryDefenseClassification: StrategicTerritoryDefenseClassification;
  territoryResilience: number;
  operationalDefensibility: number;
  corridorContinuityProtection: number;
  diversificationProtectionQuality: number;
  saturationResilienceDurability: number;
  expansionSurvivabilityDefense: number;
  multiMarketRedundancyStrength: number;
  strategicFlexibilityDurability: number;
  geographicResilienceBalance: number;
  institutionalStabilityProtection: number;
  defensiveExpansionDurability: number;
  corridorDependencyResilience: number;
  confidenceScore: number;
  scoreBreakdown: StrategicTerritoryDefenseScoreBreakdown;
  explainability: StrategicTerritoryDefenseExplainability;
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
    scrapingUsed: false;
    demographicTargetingUsed: false;
    protectedClassLogicUsed: false;
    antiCompetitiveBehavior: false;
    exclusionaryConductLogic: false;
    marketManipulationLogic: false;
    automatedCompetitiveActions: false;
    autonomousExecutionLogic: false;
    lendingAdvice: false;
    investmentAdvice: false;
    portfolioManagementAdvice: false;
    legalAdvice: false;
    marketPrediction: false;
  };
  readOnly: true;
};

const REQUIRED_INPUTS: Array<keyof StrategicTerritoryDefenseInput> = [
  "territoryResilienceScore",
  "operationalDefensibilityScore",
  "corridorContinuityProtectionScore",
  "diversificationProtectionScore",
  "saturationResilienceDurabilityScore",
  "expansionSurvivabilityDefenseScore",
  "multiMarketRedundancyScore",
  "strategicFlexibilityDurabilityScore",
  "geographicResilienceBalanceScore",
  "institutionalStabilityProtectionScore",
  "defensiveExpansionDurabilityScore",
  "corridorDependencyResilienceScore",
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

function hasFallbackForInput(input: StrategicTerritoryDefenseInput, key: keyof StrategicTerritoryDefenseInput) {
  const territoryProfile = input.institutionalTerritoryProfile;
  const rotationProfile = input.marketRotationProfile;
  const shockProfile = input.economicShockResilienceProfile;
  const saturationProfile = input.competitiveSaturationProfile;
  const regionalProfile = input.regionalDominanceProfile;
  const sequencingProfile = input.institutionalExpansionSequencingProfile;
  const corridorProfile = input.corridorIntelligenceProfile;

  const fallbackPaths: Partial<Record<keyof StrategicTerritoryDefenseInput, boolean>> = {
    territoryResilienceScore:
      hasProfileScore(territoryProfile, ["institutionalTerritoryQuality", "territoryDurability"]) ||
      hasProfileScore(regionalProfile, ["strategicRegionalResilience"]),
    operationalDefensibilityScore:
      hasProfileScore(territoryProfile, ["regionalOperationalCoherence", "geographicDefensibility"]) ||
      hasProfileScore(saturationProfile, ["dealFlowDefensibility", "regionalMoatStrength"]),
    corridorContinuityProtectionScore:
      hasProfileScore(territoryProfile, ["corridorInfluenceContinuity", "corridorInfrastructureContinuity"]) ||
      hasProfileScore(corridorProfile, ["scoreBreakdown.connectivityScore", "scoreBreakdown.durabilityScore"]),
    diversificationProtectionScore:
      hasProfileScore(territoryProfile, ["diversificationAwareTerritoryStability"]) ||
      hasProfileScore(rotationProfile, ["diversificationAwareRepositioning", "assetCategoryAdaptability"]),
    saturationResilienceDurabilityScore:
      hasProfileScore(territoryProfile, ["territorySaturationResilience"]) ||
      hasProfileScore(saturationProfile, ["competitiveResilience", "regionalMoatStrength"]),
    expansionSurvivabilityDefenseScore:
      hasProfileScore(sequencingProfile, ["expansionSurvivabilityQuality", "strategicRolloutResilience"]) ||
      hasProfileScore(territoryProfile, ["expansionTerritoryResilience"]),
    multiMarketRedundancyScore:
      hasProfileScore(territoryProfile, ["multiMarketOperationalAlignment"]) ||
      hasProfileScore(regionalProfile, ["multiMarketDefensibility"]),
    strategicFlexibilityDurabilityScore:
      hasProfileScore(rotationProfile, ["marketRotationResilience", "strategicRepositioningDiscipline"]) ||
      hasProfileScore(shockProfile, ["recoveryPositioningQuality"]),
    geographicResilienceBalanceScore:
      hasProfileScore(territoryProfile, ["strategicGeographicResilience", "geographicDefensibility"]) ||
      hasProfileScore(regionalProfile, ["geographicInfluenceDurability"]),
    institutionalStabilityProtectionScore:
      hasProfileScore(territoryProfile, ["institutionalExpansionCompatibility", "institutionalTerritoryQuality"]) ||
      hasProfileScore(sequencingProfile, ["institutionalExpansionSequencingQuality"]),
    defensiveExpansionDurabilityScore:
      hasProfileScore(sequencingProfile, ["defensiveExpansionTiming", "expansionSurvivabilityQuality"]) ||
      hasProfileScore(shockProfile, ["expansionSlowdownTolerance"]),
    corridorDependencyResilienceScore:
      hasProfileScore(territoryProfile, ["corridorInfluenceContinuity", "corridorInfrastructureContinuity"]) ||
      hasProfileScore(rotationProfile, ["corridorMigrationFlexibility"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: StrategicTerritoryDefenseInput) {
  const labels: Record<keyof StrategicTerritoryDefenseInput, string> = {
    territoryResilienceScore: "territory resilience score",
    operationalDefensibilityScore: "operational defensibility score",
    corridorContinuityProtectionScore: "corridor continuity protection score",
    diversificationProtectionScore: "diversification protection score",
    saturationResilienceDurabilityScore: "saturation resilience durability score",
    expansionSurvivabilityDefenseScore: "expansion survivability defense score",
    multiMarketRedundancyScore: "multi-market redundancy score",
    strategicFlexibilityDurabilityScore: "strategic flexibility durability score",
    geographicResilienceBalanceScore: "geographic resilience balance score",
    institutionalStabilityProtectionScore: "institutional stability protection score",
    defensiveExpansionDurabilityScore: "defensive expansion durability score",
    corridorDependencyResilienceScore: "corridor dependency resilience score",
    institutionalTerritoryProfile: "institutional territory profile",
    marketRotationProfile: "market rotation profile",
    economicShockResilienceProfile: "economic shock resilience profile",
    competitiveSaturationProfile: "competitive saturation profile",
    regionalDominanceProfile: "regional dominance profile",
    institutionalExpansionSequencingProfile: "institutional expansion sequencing profile",
    corridorIntelligenceProfile: "corridor intelligence profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: StrategicTerritoryDefenseInput): StrategicTerritoryDefenseScoreBreakdown {
  const territoryProfile = input.institutionalTerritoryProfile;
  const rotationProfile = input.marketRotationProfile;
  const shockProfile = input.economicShockResilienceProfile;
  const saturationProfile = input.competitiveSaturationProfile;
  const regionalProfile = input.regionalDominanceProfile;
  const sequencingProfile = input.institutionalExpansionSequencingProfile;
  const corridorProfile = input.corridorIntelligenceProfile;
  const corridorContinuityProtectionScore = getScore(
    input.corridorContinuityProtectionScore,
    weightedAverage([
      [extractProfileScore(territoryProfile, ["corridorInfluenceContinuity", "scoreBreakdown.corridorInfluenceContinuityScore"], 54), 0.26],
      [extractProfileScore(territoryProfile, ["corridorInfrastructureContinuity", "scoreBreakdown.corridorInfrastructureContinuityScore"], 54), 0.22],
      [extractProfileScore(corridorProfile, ["scoreBreakdown.connectivityScore", "strategicExpansionFit"], 54), 0.2],
      [extractProfileScore(corridorProfile, ["scoreBreakdown.durabilityScore", "overallCorridorScore"], 54), 0.18],
      [extractProfileScore(rotationProfile, ["corridorMigrationFlexibility", "corridorTransitionDurability"], 54), 0.14],
    ]),
  );
  const saturationResilienceDurabilityScore = getScore(
    input.saturationResilienceDurabilityScore,
    weightedAverage([
      [extractProfileScore(territoryProfile, ["territorySaturationResilience", "scoreBreakdown.territorySaturationResilienceScore"], 54), 0.26],
      [extractProfileScore(saturationProfile, ["competitiveResilience", "scoreBreakdown.competitiveResilienceScore"], 54), 0.22],
      [extractProfileScore(saturationProfile, ["regionalMoatStrength", "scoreBreakdown.regionalMoatStrengthScore"], 54), 0.18],
      [100 - extractProfileScore(saturationProfile, ["competitiveSaturationRisk", "scoreBreakdown.competitiveSaturationRiskScore"], 48), 0.16],
      [extractProfileScore(regionalProfile, ["competitiveSaturationResilience", "scoreBreakdown.competitiveSaturationResilienceScore"], 54), 0.18],
    ]),
  );
  const multiMarketRedundancyStrengthScore = getScore(
    input.multiMarketRedundancyScore,
    weightedAverage([
      [extractProfileScore(territoryProfile, ["multiMarketOperationalAlignment", "scoreBreakdown.multiMarketOperationalAlignmentScore"], 54), 0.24],
      [extractProfileScore(regionalProfile, ["multiMarketDefensibility", "scoreBreakdown.multiMarketDefensibilityScore"], 54), 0.22],
      [extractProfileScore(rotationProfile, ["multiMarketFlexibility", "scoreBreakdown.multiMarketFlexibilityScore"], 54), 0.18],
      [extractProfileScore(shockProfile, ["multiAssetShockBalance", "scoreBreakdown.multiAssetShockBalanceScore"], 54), 0.16],
      [corridorContinuityProtectionScore, 0.1],
      [saturationResilienceDurabilityScore, 0.1],
    ]),
  );
  const diversificationProtectionQualityScore = getScore(
    input.diversificationProtectionScore,
    weightedAverage([
      [extractProfileScore(territoryProfile, ["diversificationAwareTerritoryStability", "scoreBreakdown.diversificationAwareTerritoryStabilityScore"], 54), 0.26],
      [extractProfileScore(rotationProfile, ["diversificationAwareRepositioning", "scoreBreakdown.diversificationAwareRepositioningScore"], 54), 0.2],
      [extractProfileScore(rotationProfile, ["assetCategoryAdaptability", "scoreBreakdown.assetCategoryAdaptabilityScore"], 54), 0.16],
      [multiMarketRedundancyStrengthScore, 0.14],
      [saturationResilienceDurabilityScore, 0.12],
      [extractProfileScore(regionalProfile, ["diversificationAwareTerritoryBalance"], 54), 0.12],
    ]),
  );
  const operationalDefensibilityScore = getScore(
    input.operationalDefensibilityScore,
    weightedAverage([
      [extractProfileScore(territoryProfile, ["regionalOperationalCoherence", "scoreBreakdown.regionalOperationalCoherenceScore"], 54), 0.22],
      [extractProfileScore(territoryProfile, ["geographicDefensibility", "scoreBreakdown.geographicDefensibilityScore"], 54), 0.2],
      [extractProfileScore(saturationProfile, ["dealFlowDefensibility", "scoreBreakdown.dealFlowDefensibilityScore"], 54), 0.18],
      [extractProfileScore(saturationProfile, ["regionalMoatStrength", "scoreBreakdown.regionalMoatStrengthScore"], 54), 0.14],
      [corridorContinuityProtectionScore, 0.12],
      [multiMarketRedundancyStrengthScore, 0.08],
      [diversificationProtectionQualityScore, 0.06],
    ]),
  );
  const expansionSurvivabilityDefenseScore = getScore(
    input.expansionSurvivabilityDefenseScore,
    weightedAverage([
      [extractProfileScore(sequencingProfile, ["expansionSurvivabilityQuality", "scoreBreakdown.expansionSurvivabilityQualityScore"], 54), 0.22],
      [extractProfileScore(sequencingProfile, ["strategicRolloutResilience", "scoreBreakdown.strategicRolloutResilienceScore"], 54), 0.18],
      [extractProfileScore(territoryProfile, ["expansionTerritoryResilience", "scoreBreakdown.expansionTerritoryResilienceScore"], 54), 0.18],
      [extractProfileScore(shockProfile, ["expansionSlowdownTolerance", "scoreBreakdown.expansionSlowdownToleranceScore"], 54), 0.12],
      [operationalDefensibilityScore, 0.1],
      [saturationResilienceDurabilityScore, 0.1],
      [diversificationProtectionQualityScore, 0.1],
    ]),
  );
  const strategicFlexibilityDurabilityScore = getScore(
    input.strategicFlexibilityDurabilityScore,
    weightedAverage([
      [extractProfileScore(rotationProfile, ["marketRotationResilience", "scoreBreakdown.marketRotationResilienceScore"], 54), 0.24],
      [extractProfileScore(rotationProfile, ["strategicRepositioningDiscipline", "scoreBreakdown.strategicRepositioningDisciplineScore"], 54), 0.18],
      [extractProfileScore(shockProfile, ["recoveryPositioningQuality", "scoreBreakdown.recoveryPositioningQualityScore"], 54), 0.16],
      [expansionSurvivabilityDefenseScore, 0.12],
      [multiMarketRedundancyStrengthScore, 0.1],
      [diversificationProtectionQualityScore, 0.1],
      [corridorContinuityProtectionScore, 0.1],
    ]),
  );
  const geographicResilienceBalanceScore = getScore(
    input.geographicResilienceBalanceScore,
    weightedAverage([
      [extractProfileScore(territoryProfile, ["strategicGeographicResilience", "scoreBreakdown.strategicGeographicResilienceScore"], 54), 0.24],
      [extractProfileScore(territoryProfile, ["geographicDefensibility", "scoreBreakdown.geographicDefensibilityScore"], 54), 0.18],
      [extractProfileScore(regionalProfile, ["geographicInfluenceDurability", "scoreBreakdown.geographicInfluenceDurabilityScore"], 54), 0.16],
      [corridorContinuityProtectionScore, 0.14],
      [multiMarketRedundancyStrengthScore, 0.12],
      [diversificationProtectionQualityScore, 0.08],
      [saturationResilienceDurabilityScore, 0.08],
    ]),
  );
  const institutionalStabilityProtectionScore = getScore(
    input.institutionalStabilityProtectionScore,
    weightedAverage([
      [extractProfileScore(territoryProfile, ["institutionalTerritoryQuality", "scoreBreakdown.institutionalTerritoryQualityScore"], 54), 0.22],
      [extractProfileScore(territoryProfile, ["institutionalExpansionCompatibility", "scoreBreakdown.institutionalExpansionCompatibilityScore"], 54), 0.18],
      [extractProfileScore(sequencingProfile, ["institutionalExpansionSequencingQuality", "scoreBreakdown.institutionalExpansionSequencingQualityScore"], 54), 0.16],
      [operationalDefensibilityScore, 0.12],
      [geographicResilienceBalanceScore, 0.12],
      [strategicFlexibilityDurabilityScore, 0.1],
      [expansionSurvivabilityDefenseScore, 0.1],
    ]),
  );
  const defensiveExpansionDurabilityScore = getScore(
    input.defensiveExpansionDurabilityScore,
    weightedAverage([
      [extractProfileScore(sequencingProfile, ["defensiveExpansionTiming", "scoreBreakdown.defensiveExpansionTimingScore"], 54), 0.2],
      [extractProfileScore(sequencingProfile, ["expansionSurvivabilityQuality", "scoreBreakdown.expansionSurvivabilityQualityScore"], 54), 0.18],
      [extractProfileScore(shockProfile, ["expansionSlowdownTolerance", "scoreBreakdown.expansionSlowdownToleranceScore"], 54), 0.16],
      [expansionSurvivabilityDefenseScore, 0.14],
      [institutionalStabilityProtectionScore, 0.12],
      [strategicFlexibilityDurabilityScore, 0.1],
      [saturationResilienceDurabilityScore, 0.1],
    ]),
  );
  const corridorDependencyResilienceScore = getScore(
    input.corridorDependencyResilienceScore,
    weightedAverage([
      [corridorContinuityProtectionScore, 0.24],
      [extractProfileScore(territoryProfile, ["corridorInfrastructureContinuity", "scoreBreakdown.corridorInfrastructureContinuityScore"], 54), 0.18],
      [extractProfileScore(rotationProfile, ["corridorMigrationFlexibility", "scoreBreakdown.corridorMigrationFlexibilityScore"], 54), 0.16],
      [multiMarketRedundancyStrengthScore, 0.14],
      [diversificationProtectionQualityScore, 0.12],
      [geographicResilienceBalanceScore, 0.1],
      [extractProfileScore(regionalProfile, ["corridorConcentrationResilience", "scoreBreakdown.corridorConcentrationResilienceScore"], 54), 0.06],
    ]),
  );
  const territoryResilienceScore = getScore(
    input.territoryResilienceScore,
    weightedAverage([
      [operationalDefensibilityScore, 0.12],
      [corridorContinuityProtectionScore, 0.1],
      [diversificationProtectionQualityScore, 0.1],
      [saturationResilienceDurabilityScore, 0.1],
      [expansionSurvivabilityDefenseScore, 0.1],
      [multiMarketRedundancyStrengthScore, 0.1],
      [strategicFlexibilityDurabilityScore, 0.1],
      [geographicResilienceBalanceScore, 0.1],
      [institutionalStabilityProtectionScore, 0.1],
      [defensiveExpansionDurabilityScore, 0.09],
      [corridorDependencyResilienceScore, 0.09],
    ]),
  );
  const strategicTerritoryDefenseQualityScore = weightedAverage([
    [territoryResilienceScore, 0.12],
    [operationalDefensibilityScore, 0.11],
    [corridorContinuityProtectionScore, 0.1],
    [diversificationProtectionQualityScore, 0.09],
    [saturationResilienceDurabilityScore, 0.09],
    [expansionSurvivabilityDefenseScore, 0.09],
    [multiMarketRedundancyStrengthScore, 0.09],
    [strategicFlexibilityDurabilityScore, 0.08],
    [geographicResilienceBalanceScore, 0.08],
    [institutionalStabilityProtectionScore, 0.08],
    [defensiveExpansionDurabilityScore, 0.04],
    [corridorDependencyResilienceScore, 0.03],
  ]);

  return {
    connectivityScore: corridorContinuityProtectionScore,
    durabilityScore: territoryResilienceScore,
    expansionScore: defensiveExpansionDurabilityScore,
    institutionalScore: institutionalStabilityProtectionScore,
    logisticsScore: operationalDefensibilityScore,
    luxuryScore: geographicResilienceBalanceScore,
    developmentScore: expansionSurvivabilityDefenseScore,
    strategicTerritoryDefenseQualityScore,
    territoryResilienceScore,
    operationalDefensibilityScore,
    corridorContinuityProtectionScore,
    diversificationProtectionQualityScore,
    saturationResilienceDurabilityScore,
    expansionSurvivabilityDefenseScore,
    multiMarketRedundancyStrengthScore,
    strategicFlexibilityDurabilityScore,
    geographicResilienceBalanceScore,
    institutionalStabilityProtectionScore,
    defensiveExpansionDurabilityScore,
    corridorDependencyResilienceScore,
  };
}

function classifyStrategicTerritoryDefense(
  scoreBreakdown: StrategicTerritoryDefenseScoreBreakdown,
  warnings: CorridorWarning[],
): StrategicTerritoryDefenseClassification {
  if (warnings.some((warning) => warning.severity === "high") || scoreBreakdown.strategicTerritoryDefenseQualityScore < 42) return "fragile";
  if (scoreBreakdown.operationalDefensibilityScore < 48 || scoreBreakdown.corridorContinuityProtectionScore < 48) return "exposed";
  if (
    scoreBreakdown.strategicTerritoryDefenseQualityScore >= 82 &&
    scoreBreakdown.territoryResilienceScore >= 74 &&
    scoreBreakdown.institutionalStabilityProtectionScore >= 70
  ) {
    return "institutional_grade";
  }
  if (scoreBreakdown.strategicTerritoryDefenseQualityScore >= 68 && scoreBreakdown.geographicResilienceBalanceScore >= 62) return "resilient";

  return "defensible";
}

function buildWarnings(scoreBreakdown: StrategicTerritoryDefenseScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "STRATEGIC_TERRITORY_DEFENSE_DATA_INCOMPLETE",
            severity: missingData.length >= 6 ? "high" : "medium",
            message: "Strategic territory defense assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.strategicTerritoryDefenseQualityScore < 42
      ? [
          createCorridorWarning({
            code: "STRATEGIC_TERRITORY_DEFENSE_WEAK",
            severity: "high",
            message: "Strategic territory defense quality is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.operationalDefensibilityScore < 42
      ? [
          createCorridorWarning({
            code: "OPERATIONAL_DEFENSIBILITY_WEAK",
            severity: "high",
            message: "Operational defensibility is weak enough to require manual review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.corridorContinuityProtectionScore < 45
      ? [
          createCorridorWarning({
            code: "CORRIDOR_CONTINUITY_PROTECTION_WEAK",
            severity: "medium",
            message: "Corridor continuity protection is weak under current structured inputs.",
            category: "mixed",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.saturationResilienceDurabilityScore < 45
      ? [
          createCorridorWarning({
            code: "SATURATION_RESILIENCE_DURABILITY_WEAK",
            severity: "medium",
            message: "Saturation resilience durability is weak; this is a resilience flag, not competitive-action guidance.",
            category: "mixed",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.corridorDependencyResilienceScore < 45
      ? [
          createCorridorWarning({
            code: "CORRIDOR_DEPENDENCY_RESILIENCE_WEAK",
            severity: "medium",
            message: "Corridor dependency resilience is weak and requires human review.",
            category: "mixed",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.strategicTerritoryDefenseQualityScore >= 72 && scoreBreakdown.diversificationProtectionQualityScore < 56
      ? [
          createCorridorWarning({
            code: "DEFENSE_QUALITY_WITH_DIVERSIFICATION_WATCHLIST",
            severity: "low",
            message: "Strategic territory defense quality is strong, but diversification protection remains on the review watchlist.",
            category: "institutional",
            requiresHumanReview: false,
          }),
        ]
      : []),
  ];
}

function buildAssumptions(input: StrategicTerritoryDefenseInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0 ? ["Missing strategic territory defense inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."] : []),
    "Strategic territory defense scoring is strategic, deterministic, read-only, compliance-first, and designed for human review before any execution.",
    "This engine evaluates internal resilience, operational durability, corridor continuity, diversification protection, and survivability only.",
    "No demographic data, protected-class data, behavioral targeting, anti-competitive logic, exclusionary conduct logic, market manipulation logic, live market systems, financial APIs, autonomous execution logic, or prediction systems were used.",
    "This is not investment advice, portfolio-management advice, lending advice, legal advice, financial advice, or competitive-action guidance.",
  ]);
}

function buildExplainability(params: {
  scoreBreakdown: StrategicTerritoryDefenseScoreBreakdown;
  classification: StrategicTerritoryDefenseClassification;
  warnings: CorridorWarning[];
  missingData: string[];
  assumptions: string[];
}): StrategicTerritoryDefenseExplainability {
  const scoreBreakdown = params.scoreBreakdown;
  const strengths = unique([
    ...(scoreBreakdown.territoryResilienceScore >= 70 ? ["Territory resilience is strong."] : []),
    ...(scoreBreakdown.operationalDefensibilityScore >= 70 ? ["Operational defensibility is strong."] : []),
    ...(scoreBreakdown.corridorContinuityProtectionScore >= 70 ? ["Corridor continuity protection is strong."] : []),
    ...(scoreBreakdown.diversificationProtectionQualityScore >= 70 ? ["Diversification protection quality is strong."] : []),
    ...(scoreBreakdown.expansionSurvivabilityDefenseScore >= 70 ? ["Expansion survivability defense is strong."] : []),
    ...(scoreBreakdown.multiMarketRedundancyStrengthScore >= 70 ? ["Multi-market redundancy strength is strong."] : []),
    ...(scoreBreakdown.institutionalStabilityProtectionScore >= 70 ? ["Institutional stability protection is strong."] : []),
    ...(scoreBreakdown.corridorDependencyResilienceScore >= 70 ? ["Corridor dependency resilience is strong."] : []),
  ]);
  const weaknesses = unique([
    ...(scoreBreakdown.territoryResilienceScore < 45 ? ["Territory resilience is weak."] : []),
    ...(scoreBreakdown.operationalDefensibilityScore < 45 ? ["Operational defensibility is weak."] : []),
    ...(scoreBreakdown.corridorContinuityProtectionScore < 45 ? ["Corridor continuity protection is weak."] : []),
    ...(scoreBreakdown.diversificationProtectionQualityScore < 45 ? ["Diversification protection quality is weak."] : []),
    ...(scoreBreakdown.saturationResilienceDurabilityScore < 45 ? ["Saturation resilience durability is weak."] : []),
    ...(scoreBreakdown.expansionSurvivabilityDefenseScore < 45 ? ["Expansion survivability defense is weak."] : []),
    ...(scoreBreakdown.geographicResilienceBalanceScore < 45 ? ["Geographic resilience balance is weak."] : []),
    ...(scoreBreakdown.institutionalStabilityProtectionScore < 45 ? ["Institutional stability protection is weak."] : []),
  ]);
  const risks = unique([
    ...(params.warnings.some((warning) => warning.severity === "high") ? ["High-severity strategic territory defense warning requires manual review."] : []),
    ...(scoreBreakdown.strategicTerritoryDefenseQualityScore < 50 ? ["Strategic territory defense quality is weak under current structured inputs."] : []),
    ...(scoreBreakdown.corridorDependencyResilienceScore < 45 ? ["Corridor dependency resilience may limit defense durability."] : []),
    ...(scoreBreakdown.saturationResilienceDurabilityScore < 45 ? ["Saturation resilience durability may constrain territory defense quality."] : []),
    ...(scoreBreakdown.strategicFlexibilityDurabilityScore < 45 ? ["Strategic flexibility durability may limit resilience options."] : []),
    ...(params.missingData.length > 0 ? `Missing data reduces confidence: ${params.missingData.slice(0, 4).join(", ")}.` : []),
  ]);

  return {
    summary: `Strategic territory defense classification is ${params.classification} with a ${scoreBreakdown.strategicTerritoryDefenseQualityScore}/100 defense quality score and ${scoreBreakdown.territoryResilienceScore}/100 territory resilience score. This is deterministic read-only resilience intelligence only; it does not recommend competitive actions, predict markets, or automate execution.`,
    strengths,
    weaknesses,
    risks,
    assumptions: params.assumptions,
  };
}

export function analyzeStrategicTerritoryDefenseIntelligence(input: StrategicTerritoryDefenseInput = {}): StrategicTerritoryDefenseResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const strategicTerritoryDefenseClassification = classifyStrategicTerritoryDefense(scoreBreakdown, warnings);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });
  const explainability = buildExplainability({
    scoreBreakdown,
    classification: strategicTerritoryDefenseClassification,
    warnings,
    missingData,
    assumptions,
  });

  return {
    strategicTerritoryDefenseQuality: scoreBreakdown.strategicTerritoryDefenseQualityScore,
    strategicTerritoryDefenseClassification,
    territoryResilience: scoreBreakdown.territoryResilienceScore,
    operationalDefensibility: scoreBreakdown.operationalDefensibilityScore,
    corridorContinuityProtection: scoreBreakdown.corridorContinuityProtectionScore,
    diversificationProtectionQuality: scoreBreakdown.diversificationProtectionQualityScore,
    saturationResilienceDurability: scoreBreakdown.saturationResilienceDurabilityScore,
    expansionSurvivabilityDefense: scoreBreakdown.expansionSurvivabilityDefenseScore,
    multiMarketRedundancyStrength: scoreBreakdown.multiMarketRedundancyStrengthScore,
    strategicFlexibilityDurability: scoreBreakdown.strategicFlexibilityDurabilityScore,
    geographicResilienceBalance: scoreBreakdown.geographicResilienceBalanceScore,
    institutionalStabilityProtection: scoreBreakdown.institutionalStabilityProtectionScore,
    defensiveExpansionDurability: scoreBreakdown.defensiveExpansionDurabilityScore,
    corridorDependencyResilience: scoreBreakdown.corridorDependencyResilienceScore,
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
      scrapingUsed: false,
      demographicTargetingUsed: false,
      protectedClassLogicUsed: false,
      antiCompetitiveBehavior: false,
      exclusionaryConductLogic: false,
      marketManipulationLogic: false,
      automatedCompetitiveActions: false,
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

export const getStrategicTerritoryDefenseIntelligence = analyzeStrategicTerritoryDefenseIntelligence;
