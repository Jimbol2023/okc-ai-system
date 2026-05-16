import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type CompetitiveSaturationClassification = "low" | "manageable" | "watchlist" | "elevated" | "high";

export type CompetitiveSaturationInput = {
  operatorCrowdingScore?: number;
  corridorCompetitionIntensityScore?: number;
  acquisitionChannelSaturationScore?: number;
  buyerDemandSaturationScore?: number;
  pricingPressureProxyScore?: number;
  dealFlowDefensibilityScore?: number;
  regionalMoatStrengthScore?: number;
  differentiationStrengthScore?: number;
  saturationAdjustedExpansionScore?: number;
  competitiveResilienceScore?: number;
  regionalDominanceProfile?: unknown;
  institutionalExpansionSequencingProfile?: unknown;
  portfolioRiskBalancingProfile?: unknown;
  corridorIntelligenceProfile?: unknown;
  buyerDemandProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type CompetitiveSaturationScoreBreakdown = CorridorScoreBreakdown & {
  competitiveSaturationRiskScore: number;
  operatorCrowdingRiskScore: number;
  corridorCompetitionIntensityScore: number;
  acquisitionChannelSaturationScore: number;
  buyerDemandSaturationScore: number;
  pricingPressureProxyScore: number;
  dealFlowDefensibilityScore: number;
  regionalMoatStrengthScore: number;
  differentiationStrengthScore: number;
  competitiveResilienceScore: number;
  saturationAdjustedExpansionQualityScore: number;
};

export type CompetitiveSaturationExplainability = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  assumptions: string[];
};

export type CompetitiveSaturationResult = {
  competitiveSaturationRisk: number;
  competitiveSaturationClassification: CompetitiveSaturationClassification;
  operatorCrowdingRisk: number;
  corridorCompetitionIntensity: number;
  acquisitionChannelSaturation: number;
  buyerDemandSaturation: number;
  pricingPressureProxy: number;
  dealFlowDefensibility: number;
  regionalMoatStrength: number;
  differentiationStrength: number;
  competitiveResilience: number;
  saturationAdjustedExpansionQuality: number;
  confidenceScore: number;
  scoreBreakdown: CompetitiveSaturationScoreBreakdown;
  explainability: CompetitiveSaturationExplainability;
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
    autonomousExecutionLogic: false;
    lendingAdvice: false;
    investmentAdvice: false;
    portfolioManagementAdvice: false;
    legalAdvice: false;
    marketPrediction: false;
  };
  readOnly: true;
};

const REQUIRED_INPUTS: Array<keyof CompetitiveSaturationInput> = [
  "operatorCrowdingScore",
  "corridorCompetitionIntensityScore",
  "acquisitionChannelSaturationScore",
  "buyerDemandSaturationScore",
  "pricingPressureProxyScore",
  "dealFlowDefensibilityScore",
  "regionalMoatStrengthScore",
  "differentiationStrengthScore",
  "saturationAdjustedExpansionScore",
  "competitiveResilienceScore",
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

function hasFallbackForInput(input: CompetitiveSaturationInput, key: keyof CompetitiveSaturationInput) {
  const regionalProfile = input.regionalDominanceProfile;
  const sequencingProfile = input.institutionalExpansionSequencingProfile;
  const riskProfile = input.portfolioRiskBalancingProfile;
  const corridorProfile = input.corridorIntelligenceProfile;
  const buyerDemandProfile = input.buyerDemandProfile;

  const fallbackPaths: Partial<Record<keyof CompetitiveSaturationInput, boolean>> = {
    operatorCrowdingScore:
      hasProfileScore(regionalProfile, ["competitiveSaturationResilience", "scoreBreakdown.competitiveSaturationResilienceScore"]) ||
      hasProfileScore(corridorProfile, ["scoreBreakdown.developmentScore", "scoreBreakdown.institutionalScore"]),
    corridorCompetitionIntensityScore:
      hasProfileScore(corridorProfile, ["scoreBreakdown.developmentScore", "scoreBreakdown.expansionScore"]) ||
      hasProfileScore(regionalProfile, ["corridorDominanceDurability", "corridorConcentrationResilience"]),
    acquisitionChannelSaturationScore:
      hasProfileScore(buyerDemandProfile, ["channelSaturationScore", "acquisitionChannelSaturationScore"]) ||
      hasProfileScore(regionalProfile, ["regionalInfluenceStrength", "strategicTerritoryLeverage"]),
    buyerDemandSaturationScore:
      hasProfileScore(buyerDemandProfile, ["demandScore", "buyerDemandSaturationScore", "marketDemandConcentrationScore"]) ||
      hasProfileScore(riskProfile, ["assetExposureBalance", "diversificationEffectiveness"]),
    pricingPressureProxyScore:
      hasProfileScore(buyerDemandProfile, ["pricingPressureProxyScore", "priceRangeDemandScore"]) ||
      hasProfileScore(corridorProfile, ["scoreBreakdown.luxuryScore", "scoreBreakdown.developmentScore"]),
    dealFlowDefensibilityScore:
      hasProfileScore(regionalProfile, ["strategicTerritoryLeverage", "regionalInfluenceStrength"]) ||
      hasProfileScore(sequencingProfile, ["strategicRolloutResilience", "expansionDependencyManagement"]),
    regionalMoatStrengthScore:
      hasProfileScore(regionalProfile, ["regionalDominanceQuality", "regionalInfluenceStrength", "strategicRegionalResilience"]) ||
      hasProfileScore(corridorProfile, ["overallCorridorScore", "strategicExpansionFit"]),
    differentiationStrengthScore:
      hasProfileScore(regionalProfile, ["diversificationAwareTerritoryBalance", "expansionPositioningQuality"]) ||
      hasProfileScore(riskProfile, ["diversificationEffectiveness", "assetExposureBalance"]),
    saturationAdjustedExpansionScore:
      hasProfileScore(sequencingProfile, ["expansionReadiness", "institutionalExpansionSequencingQuality"]) ||
      hasProfileScore(regionalProfile, ["expansionPositioningQuality", "competitiveSaturationResilience"]),
    competitiveResilienceScore:
      hasProfileScore(regionalProfile, ["competitiveSaturationResilience", "strategicRegionalResilience"]) ||
      hasProfileScore(sequencingProfile, ["expansionSurvivabilityQuality", "strategicRolloutResilience"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: CompetitiveSaturationInput) {
  const labels: Record<keyof CompetitiveSaturationInput, string> = {
    operatorCrowdingScore: "operator crowding score",
    corridorCompetitionIntensityScore: "corridor competition intensity score",
    acquisitionChannelSaturationScore: "acquisition channel saturation score",
    buyerDemandSaturationScore: "buyer demand saturation score",
    pricingPressureProxyScore: "pricing pressure proxy score",
    dealFlowDefensibilityScore: "deal-flow defensibility score",
    regionalMoatStrengthScore: "regional moat strength score",
    differentiationStrengthScore: "differentiation strength score",
    saturationAdjustedExpansionScore: "saturation-adjusted expansion score",
    competitiveResilienceScore: "competitive resilience score",
    regionalDominanceProfile: "regional dominance profile",
    institutionalExpansionSequencingProfile: "institutional expansion sequencing profile",
    portfolioRiskBalancingProfile: "portfolio risk-balancing profile",
    corridorIntelligenceProfile: "corridor intelligence profile",
    buyerDemandProfile: "buyer demand profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: CompetitiveSaturationInput): CompetitiveSaturationScoreBreakdown {
  const regionalProfile = input.regionalDominanceProfile;
  const sequencingProfile = input.institutionalExpansionSequencingProfile;
  const riskProfile = input.portfolioRiskBalancingProfile;
  const corridorProfile = input.corridorIntelligenceProfile;
  const buyerDemandProfile = input.buyerDemandProfile;
  const regionalMoatStrengthScore = getScore(
    input.regionalMoatStrengthScore,
    weightedAverage([
      [extractProfileScore(regionalProfile, ["regionalDominanceQuality", "scoreBreakdown.regionalDominanceQualityScore"], 54), 0.28],
      [extractProfileScore(regionalProfile, ["regionalInfluenceStrength", "scoreBreakdown.regionalInfluenceStrengthScore"], 54), 0.22],
      [extractProfileScore(regionalProfile, ["strategicRegionalResilience", "scoreBreakdown.strategicRegionalResilienceScore"], 54), 0.2],
      [extractProfileScore(corridorProfile, ["overallCorridorScore", "strategicExpansionFit"], 54), 0.16],
      [extractProfileScore(corridorProfile, ["scoreBreakdown.durabilityScore"], 54), 0.14],
    ]),
  );
  const differentiationStrengthScore = getScore(
    input.differentiationStrengthScore,
    weightedAverage([
      [extractProfileScore(regionalProfile, ["diversificationAwareTerritoryBalance", "scoreBreakdown.diversificationAwareTerritoryBalanceScore"], 54), 0.26],
      [extractProfileScore(regionalProfile, ["expansionPositioningQuality", "scoreBreakdown.expansionPositioningQualityScore"], 54), 0.2],
      [extractProfileScore(riskProfile, ["diversificationEffectiveness", "scoreBreakdown.diversificationEffectivenessScore"], 54), 0.2],
      [extractProfileScore(riskProfile, ["assetExposureBalance", "scoreBreakdown.assetExposureBalanceScore"], 54), 0.16],
      [regionalMoatStrengthScore, 0.18],
    ]),
  );
  const dealFlowDefensibilityScore = getScore(
    input.dealFlowDefensibilityScore,
    weightedAverage([
      [extractProfileScore(regionalProfile, ["strategicTerritoryLeverage", "scoreBreakdown.strategicTerritoryLeverageScore"], 54), 0.24],
      [extractProfileScore(regionalProfile, ["regionalInfluenceStrength", "scoreBreakdown.regionalInfluenceStrengthScore"], 54), 0.18],
      [extractProfileScore(sequencingProfile, ["strategicRolloutResilience", "scoreBreakdown.strategicRolloutResilienceScore"], 54), 0.18],
      [extractProfileScore(sequencingProfile, ["expansionDependencyManagement", "scoreBreakdown.expansionDependencyManagementScore"], 54), 0.14],
      [regionalMoatStrengthScore, 0.14],
      [differentiationStrengthScore, 0.12],
    ]),
  );
  const operatorCrowdingRiskScore = getScore(
    input.operatorCrowdingScore,
    weightedAverage([
      [100 - extractProfileScore(regionalProfile, ["competitiveSaturationResilience", "scoreBreakdown.competitiveSaturationResilienceScore"], 54), 0.26],
      [100 - regionalMoatStrengthScore, 0.2],
      [100 - differentiationStrengthScore, 0.16],
      [extractProfileScore(corridorProfile, ["scoreBreakdown.developmentScore", "scoreBreakdown.institutionalScore"], 48), 0.18],
      [100 - dealFlowDefensibilityScore, 0.2],
    ]),
  );
  const corridorCompetitionIntensityScore = getScore(
    input.corridorCompetitionIntensityScore,
    weightedAverage([
      [extractProfileScore(corridorProfile, ["scoreBreakdown.developmentScore", "scoreBreakdown.expansionScore"], 48), 0.26],
      [100 - extractProfileScore(regionalProfile, ["corridorDominanceDurability", "scoreBreakdown.corridorDominanceDurabilityScore"], 54), 0.22],
      [100 - extractProfileScore(regionalProfile, ["corridorConcentrationResilience", "scoreBreakdown.corridorConcentrationResilienceScore"], 54), 0.18],
      [operatorCrowdingRiskScore, 0.18],
      [100 - regionalMoatStrengthScore, 0.16],
    ]),
  );
  const acquisitionChannelSaturationScore = getScore(
    input.acquisitionChannelSaturationScore,
    weightedAverage([
      [extractProfileScore(buyerDemandProfile, ["channelSaturationScore", "acquisitionChannelSaturationScore"], 48), 0.3],
      [operatorCrowdingRiskScore, 0.2],
      [corridorCompetitionIntensityScore, 0.16],
      [100 - dealFlowDefensibilityScore, 0.2],
      [100 - extractProfileScore(regionalProfile, ["strategicTerritoryLeverage", "scoreBreakdown.strategicTerritoryLeverageScore"], 54), 0.14],
    ]),
  );
  const buyerDemandSaturationScore = getScore(
    input.buyerDemandSaturationScore,
    weightedAverage([
      [extractProfileScore(buyerDemandProfile, ["buyerDemandSaturationScore", "marketDemandConcentrationScore"], 48), 0.32],
      [extractProfileScore(buyerDemandProfile, ["demandScore"], 54), 0.14],
      [100 - extractProfileScore(riskProfile, ["diversificationEffectiveness", "scoreBreakdown.diversificationEffectivenessScore"], 54), 0.18],
      [100 - differentiationStrengthScore, 0.16],
      [corridorCompetitionIntensityScore, 0.1],
      [acquisitionChannelSaturationScore, 0.1],
    ]),
  );
  const pricingPressureProxyScore = getScore(
    input.pricingPressureProxyScore,
    weightedAverage([
      [extractProfileScore(buyerDemandProfile, ["pricingPressureProxyScore", "priceRangeDemandScore"], 48), 0.28],
      [buyerDemandSaturationScore, 0.22],
      [corridorCompetitionIntensityScore, 0.18],
      [operatorCrowdingRiskScore, 0.14],
      [extractProfileScore(corridorProfile, ["scoreBreakdown.luxuryScore", "scoreBreakdown.developmentScore"], 48), 0.1],
      [100 - dealFlowDefensibilityScore, 0.08],
    ]),
  );
  const competitiveResilienceScore = getScore(
    input.competitiveResilienceScore,
    weightedAverage([
      [extractProfileScore(regionalProfile, ["competitiveSaturationResilience", "scoreBreakdown.competitiveSaturationResilienceScore"], 54), 0.24],
      [extractProfileScore(regionalProfile, ["strategicRegionalResilience", "scoreBreakdown.strategicRegionalResilienceScore"], 54), 0.18],
      [extractProfileScore(sequencingProfile, ["expansionSurvivabilityQuality", "scoreBreakdown.expansionSurvivabilityQualityScore"], 54), 0.16],
      [extractProfileScore(sequencingProfile, ["strategicRolloutResilience", "scoreBreakdown.strategicRolloutResilienceScore"], 54), 0.14],
      [regionalMoatStrengthScore, 0.12],
      [differentiationStrengthScore, 0.08],
      [dealFlowDefensibilityScore, 0.08],
    ]),
  );
  const competitiveSaturationRiskScore = weightedAverage([
    [operatorCrowdingRiskScore, 0.18],
    [corridorCompetitionIntensityScore, 0.17],
    [acquisitionChannelSaturationScore, 0.15],
    [buyerDemandSaturationScore, 0.14],
    [pricingPressureProxyScore, 0.13],
    [100 - dealFlowDefensibilityScore, 0.09],
    [100 - regionalMoatStrengthScore, 0.06],
    [100 - differentiationStrengthScore, 0.04],
    [100 - competitiveResilienceScore, 0.04],
  ]);
  const saturationAdjustedExpansionQualityScore = getScore(
    input.saturationAdjustedExpansionScore,
    weightedAverage([
      [extractProfileScore(sequencingProfile, ["expansionReadiness", "scoreBreakdown.expansionReadinessScore"], 54), 0.2],
      [extractProfileScore(sequencingProfile, ["institutionalExpansionSequencingQuality", "scoreBreakdown.institutionalExpansionSequencingQualityScore"], 54), 0.18],
      [extractProfileScore(regionalProfile, ["expansionPositioningQuality", "scoreBreakdown.expansionPositioningQualityScore"], 54), 0.16],
      [competitiveResilienceScore, 0.14],
      [dealFlowDefensibilityScore, 0.1],
      [regionalMoatStrengthScore, 0.1],
      [100 - competitiveSaturationRiskScore, 0.12],
    ]),
  );

  return {
    connectivityScore: 100 - corridorCompetitionIntensityScore,
    durabilityScore: competitiveResilienceScore,
    expansionScore: saturationAdjustedExpansionQualityScore,
    institutionalScore: regionalMoatStrengthScore,
    logisticsScore: dealFlowDefensibilityScore,
    luxuryScore: 100 - pricingPressureProxyScore,
    developmentScore: differentiationStrengthScore,
    competitiveSaturationRiskScore,
    operatorCrowdingRiskScore,
    corridorCompetitionIntensityScore,
    acquisitionChannelSaturationScore,
    buyerDemandSaturationScore,
    pricingPressureProxyScore,
    dealFlowDefensibilityScore,
    regionalMoatStrengthScore,
    differentiationStrengthScore,
    competitiveResilienceScore,
    saturationAdjustedExpansionQualityScore,
  };
}

function classifyCompetitiveSaturation(scoreBreakdown: CompetitiveSaturationScoreBreakdown, warnings: CorridorWarning[]): CompetitiveSaturationClassification {
  if (warnings.some((warning) => warning.severity === "high") || scoreBreakdown.competitiveSaturationRiskScore >= 76) return "high";
  if (scoreBreakdown.competitiveSaturationRiskScore >= 64) return "elevated";
  if (scoreBreakdown.competitiveSaturationRiskScore >= 52) return "watchlist";
  if (scoreBreakdown.competitiveResilienceScore >= 68 && scoreBreakdown.regionalMoatStrengthScore >= 64) return "manageable";

  return "low";
}

function buildWarnings(scoreBreakdown: CompetitiveSaturationScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "COMPETITIVE_SATURATION_DATA_INCOMPLETE",
            severity: missingData.length >= 5 ? "high" : "medium",
            message: "Competitive saturation assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.competitiveSaturationRiskScore >= 76
      ? [
          createCorridorWarning({
            code: "COMPETITIVE_SATURATION_RISK_HIGH",
            severity: "high",
            message: "Competitive saturation risk is high under current structured inputs.",
            category: "mixed",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.operatorCrowdingRiskScore >= 74
      ? [
          createCorridorWarning({
            code: "OPERATOR_CROWDING_HIGH",
            severity: "high",
            message: "Operator crowding risk is elevated enough to require manual review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.corridorCompetitionIntensityScore >= 74
      ? [
          createCorridorWarning({
            code: "CORRIDOR_COMPETITION_INTENSITY_HIGH",
            severity: "medium",
            message: "Corridor competition intensity is elevated under current structured inputs.",
            category: "mixed",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.acquisitionChannelSaturationScore >= 72
      ? [
          createCorridorWarning({
            code: "ACQUISITION_CHANNEL_SATURATION_HIGH",
            severity: "medium",
            message: "Acquisition-channel saturation proxy is elevated and requires human review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.pricingPressureProxyScore >= 72
      ? [
          createCorridorWarning({
            code: "PRICING_PRESSURE_PROXY_HIGH",
            severity: "medium",
            message: "Pricing-pressure proxy is elevated; this is not a market prediction.",
            category: "mixed",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.dealFlowDefensibilityScore < 45
      ? [
          createCorridorWarning({
            code: "DEAL_FLOW_DEFENSIBILITY_WEAK",
            severity: "high",
            message: "Deal-flow defensibility is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.saturationAdjustedExpansionQualityScore >= 70 && scoreBreakdown.competitiveSaturationRiskScore >= 60
      ? [
          createCorridorWarning({
            code: "EXPANSION_QUALITY_WITH_SATURATION_WATCHLIST",
            severity: "low",
            message: "Saturation-adjusted expansion quality is strong, but competitive saturation remains on the review watchlist.",
            category: "institutional",
            requiresHumanReview: false,
          }),
        ]
      : []),
  ];
}

function buildAssumptions(input: CompetitiveSaturationInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0 ? ["Missing competitive saturation inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."] : []),
    "Competitive saturation scoring is strategic, deterministic, and read-only; it is not investment advice, lending advice, legal advice, portfolio-management advice, market prediction, or autonomous execution logic.",
    "No live market data, financial APIs, external APIs, scraping, MLS data, county calls, demographic data, or protected-class data was used.",
  ]);
}

function buildExplainability(params: {
  scoreBreakdown: CompetitiveSaturationScoreBreakdown;
  classification: CompetitiveSaturationClassification;
  warnings: CorridorWarning[];
  missingData: string[];
  assumptions: string[];
}): CompetitiveSaturationExplainability {
  const scoreBreakdown = params.scoreBreakdown;
  const strengths = unique([
    ...(scoreBreakdown.dealFlowDefensibilityScore >= 70 ? ["Deal-flow defensibility is strong."] : []),
    ...(scoreBreakdown.regionalMoatStrengthScore >= 70 ? ["Regional moat strength is strong."] : []),
    ...(scoreBreakdown.differentiationStrengthScore >= 70 ? ["Differentiation strength is strong."] : []),
    ...(scoreBreakdown.competitiveResilienceScore >= 70 ? ["Competitive resilience is strong."] : []),
    ...(scoreBreakdown.saturationAdjustedExpansionQualityScore >= 70 ? ["Saturation-adjusted expansion quality is strong."] : []),
    ...(scoreBreakdown.operatorCrowdingRiskScore < 45 ? ["Operator crowding risk is contained."] : []),
    ...(scoreBreakdown.corridorCompetitionIntensityScore < 45 ? ["Corridor competition intensity is contained."] : []),
  ]);
  const weaknesses = unique([
    ...(scoreBreakdown.dealFlowDefensibilityScore < 45 ? ["Deal-flow defensibility is weak."] : []),
    ...(scoreBreakdown.regionalMoatStrengthScore < 45 ? ["Regional moat strength is weak."] : []),
    ...(scoreBreakdown.differentiationStrengthScore < 45 ? ["Differentiation strength is weak."] : []),
    ...(scoreBreakdown.competitiveResilienceScore < 45 ? ["Competitive resilience is weak."] : []),
    ...(scoreBreakdown.saturationAdjustedExpansionQualityScore < 45 ? ["Saturation-adjusted expansion quality is weak."] : []),
  ]);
  const risks = unique([
    ...(params.warnings.some((warning) => warning.severity === "high") ? ["High-severity competitive saturation warning requires manual review."] : []),
    ...(scoreBreakdown.competitiveSaturationRiskScore >= 70 ? ["Competitive saturation risk is elevated across one or more pressure dimensions."] : []),
    ...(scoreBreakdown.acquisitionChannelSaturationScore >= 70 ? ["Acquisition-channel saturation pressure is elevated."] : []),
    ...(scoreBreakdown.buyerDemandSaturationScore >= 70 ? ["Buyer-demand saturation proxy is elevated."] : []),
    ...(scoreBreakdown.pricingPressureProxyScore >= 70 ? ["Pricing-pressure proxy is elevated; this is not a market prediction."] : []),
    ...(params.missingData.length > 0 ? `Missing data reduces confidence: ${params.missingData.slice(0, 4).join(", ")}.` : []),
  ]);

  return {
    summary: `Competitive saturation classification is ${params.classification} with a ${scoreBreakdown.competitiveSaturationRiskScore}/100 saturation risk score and ${scoreBreakdown.competitiveResilienceScore}/100 competitive resilience score. This is deterministic read-only saturation intelligence only and does not use live data or predict markets.`,
    strengths,
    weaknesses,
    risks,
    assumptions: params.assumptions,
  };
}

export function analyzeCompetitiveSaturationIntelligence(input: CompetitiveSaturationInput = {}): CompetitiveSaturationResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const competitiveSaturationClassification = classifyCompetitiveSaturation(scoreBreakdown, warnings);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });
  const explainability = buildExplainability({
    scoreBreakdown,
    classification: competitiveSaturationClassification,
    warnings,
    missingData,
    assumptions,
  });

  return {
    competitiveSaturationRisk: scoreBreakdown.competitiveSaturationRiskScore,
    competitiveSaturationClassification,
    operatorCrowdingRisk: scoreBreakdown.operatorCrowdingRiskScore,
    corridorCompetitionIntensity: scoreBreakdown.corridorCompetitionIntensityScore,
    acquisitionChannelSaturation: scoreBreakdown.acquisitionChannelSaturationScore,
    buyerDemandSaturation: scoreBreakdown.buyerDemandSaturationScore,
    pricingPressureProxy: scoreBreakdown.pricingPressureProxyScore,
    dealFlowDefensibility: scoreBreakdown.dealFlowDefensibilityScore,
    regionalMoatStrength: scoreBreakdown.regionalMoatStrengthScore,
    differentiationStrength: scoreBreakdown.differentiationStrengthScore,
    competitiveResilience: scoreBreakdown.competitiveResilienceScore,
    saturationAdjustedExpansionQuality: scoreBreakdown.saturationAdjustedExpansionQualityScore,
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

export const getCompetitiveSaturationIntelligence = analyzeCompetitiveSaturationIntelligence;
