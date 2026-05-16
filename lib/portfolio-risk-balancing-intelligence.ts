import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type PortfolioRiskConcentrationLevel = "low" | "balanced" | "watchlist" | "elevated" | "high";

export type PortfolioRiskBalancingInput = {
  assetExposureBalanceScore?: number;
  corridorExposureBalanceScore?: number;
  capitalCycleExposureBalanceScore?: number;
  strategyExposureBalanceScore?: number;
  expansionRiskBalanceScore?: number;
  downsideProtectionBalanceScore?: number;
  defensivePositioningScore?: number;
  diversificationEffectivenessScore?: number;
  resilienceBalanceScore?: number;
  correlationAdjustedRiskScore?: number;
  portfolioCorrelationProfile?: unknown;
  capitalCycleProfile?: unknown;
  institutionalCapitalFlowProfile?: unknown;
  multiAssetExpansionProfile?: unknown;
  corridorIntelligenceProfile?: unknown;
  landIntelligenceProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type PortfolioRiskBalancingScoreBreakdown = CorridorScoreBreakdown & {
  portfolioRiskBalanceScore: number;
  concentrationRiskScore: number;
  assetExposureBalanceScore: number;
  corridorExposureBalanceScore: number;
  capitalCycleExposureBalanceScore: number;
  strategyExposureBalanceScore: number;
  expansionRiskBalanceScore: number;
  downsideProtectionBalanceScore: number;
  defensivePositioningScore: number;
  diversificationEffectivenessScore: number;
  portfolioResilienceBalanceScore: number;
  correlationAdjustedRiskBalanceScore: number;
};

export type PortfolioRiskBalancingExplainability = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  assumptions: string[];
};

export type PortfolioRiskBalancingResult = {
  portfolioRiskBalance: number;
  concentrationRiskLevel: PortfolioRiskConcentrationLevel;
  assetExposureBalance: number;
  corridorExposureBalance: number;
  capitalCycleExposureBalance: number;
  strategyExposureBalance: number;
  expansionRiskBalance: number;
  downsideProtectionBalance: number;
  defensivePositioning: number;
  diversificationEffectiveness: number;
  portfolioResilienceBalance: number;
  correlationAdjustedRiskBalance: number;
  confidenceScore: number;
  scoreBreakdown: PortfolioRiskBalancingScoreBreakdown;
  explainability: PortfolioRiskBalancingExplainability;
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
    lendingAdvice: false;
    investmentAdvice: false;
    portfolioManagementAdvice: false;
    legalAdvice: false;
    marketPrediction: false;
  };
  readOnly: true;
};

const REQUIRED_INPUTS: Array<keyof PortfolioRiskBalancingInput> = [
  "assetExposureBalanceScore",
  "corridorExposureBalanceScore",
  "capitalCycleExposureBalanceScore",
  "strategyExposureBalanceScore",
  "expansionRiskBalanceScore",
  "downsideProtectionBalanceScore",
  "defensivePositioningScore",
  "diversificationEffectivenessScore",
  "resilienceBalanceScore",
  "correlationAdjustedRiskScore",
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

function hasFallbackForInput(input: PortfolioRiskBalancingInput, key: keyof PortfolioRiskBalancingInput) {
  const portfolioCorrelationProfile = input.portfolioCorrelationProfile;
  const capitalCycleProfile = input.capitalCycleProfile;
  const capitalFlowProfile = input.institutionalCapitalFlowProfile;
  const multiAssetProfile = input.multiAssetExpansionProfile;
  const corridorProfile = input.corridorIntelligenceProfile;
  const landProfile = input.landIntelligenceProfile;

  const fallbackPaths: Partial<Record<keyof PortfolioRiskBalancingInput, boolean>> = {
    assetExposureBalanceScore:
      hasProfileScore(portfolioCorrelationProfile, ["diversificationQuality", "scoreBreakdown.diversificationQualityScore"]) ||
      hasProfileScore(multiAssetProfile, ["diversificationQuality", "assetInteractionStability", "scoreBreakdown.assetInteractionStabilityScore"]),
    corridorExposureBalanceScore:
      hasProfileScore(portfolioCorrelationProfile, ["corridorConcentrationRisk", "scoreBreakdown.corridorConcentrationRiskScore"]) ||
      hasProfileScore(corridorProfile, ["strategicExpansionFit", "overallCorridorScore", "scoreBreakdown.connectivityScore"]),
    capitalCycleExposureBalanceScore:
      hasProfileScore(portfolioCorrelationProfile, ["capitalCycleExposureOverlap", "scoreBreakdown.capitalCycleExposureOverlapScore"]) ||
      hasProfileScore(capitalCycleProfile, ["capitalCycleAlignment", "multiAssetCycleResilience", "downsideProtectionQuality"]),
    strategyExposureBalanceScore:
      hasProfileScore(portfolioCorrelationProfile, ["strategyOverlapRisk", "scoreBreakdown.strategyOverlapRiskScore"]) ||
      hasProfileScore(multiAssetProfile, ["strategicBalancing", "expansionCoherence", "scoreBreakdown.strategicBalancingScore"]),
    expansionRiskBalanceScore:
      hasProfileScore(portfolioCorrelationProfile, ["correlationAdjustedExpansionQuality", "scoreBreakdown.correlationAdjustedExpansionQualityScore"]) ||
      hasProfileScore(multiAssetProfile, ["phasedExpansionCompatibility", "portfolioExpansionDurability", "expansionCoherence"]),
    downsideProtectionBalanceScore:
      hasProfileScore(capitalCycleProfile, ["downsideProtectionQuality", "scoreBreakdown.downsideProtectionQualityScore"]) ||
      hasProfileScore(landProfile, ["holdDurability", "incomeTransitionCompatibility"]),
    defensivePositioningScore:
      hasProfileScore(portfolioCorrelationProfile, ["defensiveBalance", "scoreBreakdown.defensiveBalanceScore"]) ||
      hasProfileScore(capitalCycleProfile, ["acquisitionTimingDiscipline", "capitalFlexibility", "institutionalPatienceAlignment"]),
    diversificationEffectivenessScore:
      hasProfileScore(portfolioCorrelationProfile, ["diversificationQuality", "scoreBreakdown.diversificationQualityScore"]) ||
      hasProfileScore(multiAssetProfile, ["diversificationQuality", "strategicBalancing"]),
    resilienceBalanceScore:
      hasProfileScore(portfolioCorrelationProfile, ["portfolioResilienceProxy", "scoreBreakdown.portfolioResilienceProxyScore"]) ||
      hasProfileScore(capitalCycleProfile, ["multiAssetCycleResilience", "liquidityResilience"]) ||
      hasProfileScore(capitalFlowProfile, ["liquidityDurability", "phasedCapitalSurvivability"]),
    correlationAdjustedRiskScore:
      hasProfileScore(portfolioCorrelationProfile, ["portfolioCorrelationRisk", "scoreBreakdown.portfolioCorrelationRiskScore"]) ||
      hasProfileScore(multiAssetProfile, ["assetInteractionStability", "portfolioExpansionDurability"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: PortfolioRiskBalancingInput) {
  const labels: Record<keyof PortfolioRiskBalancingInput, string> = {
    assetExposureBalanceScore: "asset exposure balance score",
    corridorExposureBalanceScore: "corridor exposure balance score",
    capitalCycleExposureBalanceScore: "capital-cycle exposure balance score",
    strategyExposureBalanceScore: "strategy exposure balance score",
    expansionRiskBalanceScore: "expansion risk balance score",
    downsideProtectionBalanceScore: "downside protection balance score",
    defensivePositioningScore: "defensive positioning score",
    diversificationEffectivenessScore: "diversification effectiveness score",
    resilienceBalanceScore: "resilience balance score",
    correlationAdjustedRiskScore: "correlation-adjusted risk score",
    portfolioCorrelationProfile: "portfolio correlation profile",
    capitalCycleProfile: "capital-cycle profile",
    institutionalCapitalFlowProfile: "institutional capital-flow profile",
    multiAssetExpansionProfile: "multi-asset expansion profile",
    corridorIntelligenceProfile: "corridor intelligence profile",
    landIntelligenceProfile: "land intelligence profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: PortfolioRiskBalancingInput): PortfolioRiskBalancingScoreBreakdown {
  const portfolioCorrelationProfile = input.portfolioCorrelationProfile;
  const capitalCycleProfile = input.capitalCycleProfile;
  const capitalFlowProfile = input.institutionalCapitalFlowProfile;
  const multiAssetProfile = input.multiAssetExpansionProfile;
  const corridorProfile = input.corridorIntelligenceProfile;
  const landProfile = input.landIntelligenceProfile;
  const assetExposureBalanceScore = getScore(
    input.assetExposureBalanceScore,
    weightedAverage([
      [extractProfileScore(portfolioCorrelationProfile, ["diversificationQuality", "scoreBreakdown.diversificationQualityScore"], 54), 0.3],
      [100 - extractProfileScore(portfolioCorrelationProfile, ["assetCorrelationRisk", "scoreBreakdown.assetCorrelationRiskScore"], 46), 0.26],
      [extractProfileScore(multiAssetProfile, ["assetInteractionStability", "scoreBreakdown.assetInteractionStabilityScore"], 54), 0.22],
      [extractProfileScore(multiAssetProfile, ["diversificationQuality", "scoreBreakdown.diversificationQualityScore"], 54), 0.22],
    ]),
  );
  const corridorExposureBalanceScore = getScore(
    input.corridorExposureBalanceScore,
    weightedAverage([
      [100 - extractProfileScore(portfolioCorrelationProfile, ["corridorConcentrationRisk", "scoreBreakdown.corridorConcentrationRiskScore"], 48), 0.36],
      [extractProfileScore(corridorProfile, ["strategicExpansionFit", "overallCorridorScore"], 54), 0.22],
      [extractProfileScore(corridorProfile, ["scoreBreakdown.connectivityScore"], 54), 0.18],
      [extractProfileScore(multiAssetProfile, ["corridorContinuity", "scoreBreakdown.corridorContinuityScore"], 54), 0.24],
    ]),
  );
  const capitalCycleExposureBalanceScore = getScore(
    input.capitalCycleExposureBalanceScore,
    weightedAverage([
      [100 - extractProfileScore(portfolioCorrelationProfile, ["capitalCycleExposureOverlap", "scoreBreakdown.capitalCycleExposureOverlapScore"], 48), 0.3],
      [extractProfileScore(capitalCycleProfile, ["capitalCycleAlignment", "scoreBreakdown.capitalCycleAlignmentScore"], 54), 0.24],
      [extractProfileScore(capitalCycleProfile, ["multiAssetCycleResilience", "scoreBreakdown.multiAssetCycleResilienceScore"], 54), 0.24],
      [extractProfileScore(capitalFlowProfile, ["phasedCapitalSurvivability", "liquidityDurability"], 54), 0.22],
    ]),
  );
  const strategyExposureBalanceScore = getScore(
    input.strategyExposureBalanceScore,
    weightedAverage([
      [100 - extractProfileScore(portfolioCorrelationProfile, ["strategyOverlapRisk", "scoreBreakdown.strategyOverlapRiskScore"], 48), 0.32],
      [extractProfileScore(multiAssetProfile, ["strategicBalancing", "scoreBreakdown.strategicBalancingScore"], 54), 0.3],
      [extractProfileScore(multiAssetProfile, ["expansionCoherence", "scoreBreakdown.expansionCoherenceScore"], 54), 0.2],
      [assetExposureBalanceScore, 0.18],
    ]),
  );
  const expansionRiskBalanceScore = getScore(
    input.expansionRiskBalanceScore,
    weightedAverage([
      [extractProfileScore(portfolioCorrelationProfile, ["correlationAdjustedExpansionQuality", "scoreBreakdown.correlationAdjustedExpansionQualityScore"], 54), 0.28],
      [extractProfileScore(multiAssetProfile, ["phasedExpansionCompatibility", "scoreBreakdown.phasedExpansionCompatibilityScore"], 54), 0.24],
      [extractProfileScore(multiAssetProfile, ["portfolioExpansionDurability", "scoreBreakdown.portfolioExpansionDurabilityScore"], 54), 0.2],
      [100 - extractProfileScore(portfolioCorrelationProfile, ["expansionDependencyRisk", "scoreBreakdown.expansionDependencyRiskScore"], 48), 0.18],
      [corridorExposureBalanceScore, 0.1],
    ]),
  );
  const downsideProtectionBalanceScore = getScore(
    input.downsideProtectionBalanceScore,
    weightedAverage([
      [extractProfileScore(capitalCycleProfile, ["downsideProtectionQuality", "scoreBreakdown.downsideProtectionQualityScore"], 54), 0.34],
      [extractProfileScore(capitalCycleProfile, ["capitalFlexibility", "scoreBreakdown.capitalFlexibilityScore"], 54), 0.22],
      [extractProfileScore(portfolioCorrelationProfile, ["defensiveBalance", "scoreBreakdown.defensiveBalanceScore"], 54), 0.24],
      [extractProfileScore(landProfile, ["holdDurability", "institutionalHoldSuitability", "incomeTransitionCompatibility"], 54), 0.2],
    ]),
  );
  const defensivePositioningScore = getScore(
    input.defensivePositioningScore,
    weightedAverage([
      [extractProfileScore(portfolioCorrelationProfile, ["defensiveBalance", "scoreBreakdown.defensiveBalanceScore"], 54), 0.3],
      [extractProfileScore(capitalCycleProfile, ["acquisitionTimingDiscipline", "scoreBreakdown.acquisitionTimingDisciplineScore"], 54), 0.22],
      [extractProfileScore(capitalCycleProfile, ["institutionalPatienceAlignment", "scoreBreakdown.institutionalPatienceAlignmentScore"], 54), 0.18],
      [downsideProtectionBalanceScore, 0.18],
      [capitalCycleExposureBalanceScore, 0.12],
    ]),
  );
  const diversificationEffectivenessScore = getScore(
    input.diversificationEffectivenessScore,
    weightedAverage([
      [extractProfileScore(portfolioCorrelationProfile, ["diversificationQuality", "scoreBreakdown.diversificationQualityScore"], 54), 0.34],
      [assetExposureBalanceScore, 0.2],
      [corridorExposureBalanceScore, 0.18],
      [strategyExposureBalanceScore, 0.16],
      [extractProfileScore(multiAssetProfile, ["strategicBalancing", "diversificationQuality"], 54), 0.12],
    ]),
  );
  const portfolioResilienceBalanceScore = getScore(
    input.resilienceBalanceScore,
    weightedAverage([
      [extractProfileScore(portfolioCorrelationProfile, ["portfolioResilienceProxy", "scoreBreakdown.portfolioResilienceProxyScore"], 54), 0.24],
      [extractProfileScore(capitalCycleProfile, ["multiAssetCycleResilience", "liquidityResilience"], 54), 0.22],
      [downsideProtectionBalanceScore, 0.18],
      [defensivePositioningScore, 0.16],
      [diversificationEffectivenessScore, 0.12],
      [capitalCycleExposureBalanceScore, 0.08],
    ]),
  );
  const correlationAdjustedRiskBalanceScore = getScore(
    input.correlationAdjustedRiskScore,
    weightedAverage([
      [100 - extractProfileScore(portfolioCorrelationProfile, ["portfolioCorrelationRisk", "scoreBreakdown.portfolioCorrelationRiskScore"], 48), 0.36],
      [diversificationEffectivenessScore, 0.2],
      [assetExposureBalanceScore, 0.14],
      [corridorExposureBalanceScore, 0.12],
      [strategyExposureBalanceScore, 0.1],
      [portfolioResilienceBalanceScore, 0.08],
    ]),
  );
  const concentrationRiskScore = weightedAverage([
    [100 - assetExposureBalanceScore, 0.18],
    [100 - corridorExposureBalanceScore, 0.18],
    [100 - capitalCycleExposureBalanceScore, 0.15],
    [100 - strategyExposureBalanceScore, 0.16],
    [100 - diversificationEffectivenessScore, 0.18],
    [100 - correlationAdjustedRiskBalanceScore, 0.15],
  ]);
  const portfolioRiskBalanceScore = weightedAverage([
    [assetExposureBalanceScore, 0.12],
    [corridorExposureBalanceScore, 0.12],
    [capitalCycleExposureBalanceScore, 0.11],
    [strategyExposureBalanceScore, 0.11],
    [expansionRiskBalanceScore, 0.1],
    [downsideProtectionBalanceScore, 0.11],
    [defensivePositioningScore, 0.1],
    [diversificationEffectivenessScore, 0.12],
    [portfolioResilienceBalanceScore, 0.11],
    [correlationAdjustedRiskBalanceScore, 0.1],
  ]);

  return {
    connectivityScore: corridorExposureBalanceScore,
    durabilityScore: portfolioResilienceBalanceScore,
    expansionScore: expansionRiskBalanceScore,
    institutionalScore: defensivePositioningScore,
    logisticsScore: capitalCycleExposureBalanceScore,
    luxuryScore: downsideProtectionBalanceScore,
    developmentScore: strategyExposureBalanceScore,
    portfolioRiskBalanceScore,
    concentrationRiskScore,
    assetExposureBalanceScore,
    corridorExposureBalanceScore,
    capitalCycleExposureBalanceScore,
    strategyExposureBalanceScore,
    expansionRiskBalanceScore,
    downsideProtectionBalanceScore,
    defensivePositioningScore,
    diversificationEffectivenessScore,
    portfolioResilienceBalanceScore,
    correlationAdjustedRiskBalanceScore,
  };
}

function classifyConcentrationRisk(scoreBreakdown: PortfolioRiskBalancingScoreBreakdown, warnings: CorridorWarning[]): PortfolioRiskConcentrationLevel {
  if (warnings.some((warning) => warning.severity === "high") || scoreBreakdown.concentrationRiskScore >= 74) return "high";
  if (scoreBreakdown.concentrationRiskScore >= 62) return "elevated";
  if (scoreBreakdown.concentrationRiskScore >= 50) return "watchlist";
  if (scoreBreakdown.portfolioRiskBalanceScore >= 66 && scoreBreakdown.diversificationEffectivenessScore >= 64) return "balanced";

  return "low";
}

function buildWarnings(scoreBreakdown: PortfolioRiskBalancingScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "PORTFOLIO_RISK_BALANCE_DATA_INCOMPLETE",
            severity: missingData.length >= 5 ? "high" : "medium",
            message: "Portfolio risk balance assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.concentrationRiskScore >= 74
      ? [
          createCorridorWarning({
            code: "PORTFOLIO_CONCENTRATION_RISK_HIGH",
            severity: "high",
            message: "Exposure concentration risk is high under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.assetExposureBalanceScore < 42
      ? [
          createCorridorWarning({
            code: "ASSET_EXPOSURE_BALANCE_WEAK",
            severity: "high",
            message: "Asset exposure balance is weak and requires manual review.",
            category: "mixed",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.corridorExposureBalanceScore < 42
      ? [
          createCorridorWarning({
            code: "CORRIDOR_EXPOSURE_BALANCE_WEAK",
            severity: "high",
            message: "Corridor exposure balance is weak enough to require manual review.",
            category: "mixed",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.capitalCycleExposureBalanceScore < 44
      ? [
          createCorridorWarning({
            code: "CAPITAL_CYCLE_EXPOSURE_BALANCE_WEAK",
            severity: "medium",
            message: "Capital-cycle exposure balance is weak; this is a deterministic risk flag, not a market prediction.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.downsideProtectionBalanceScore < 45 || scoreBreakdown.defensivePositioningScore < 45
      ? [
          createCorridorWarning({
            code: "DEFENSIVE_BALANCE_WEAK",
            severity: "medium",
            message: "Defensive balance is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.expansionRiskBalanceScore < 45 && scoreBreakdown.correlationAdjustedRiskBalanceScore < 52
      ? [
          createCorridorWarning({
            code: "EXPANSION_RISK_BALANCE_REVIEW",
            severity: "medium",
            message: "Expansion risk balance and correlation-adjusted risk balance both require human review before expansion planning.",
            category: "development",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.portfolioRiskBalanceScore >= 70 && scoreBreakdown.concentrationRiskScore >= 58
      ? [
          createCorridorWarning({
            code: "GOOD_BALANCE_WITH_CONCENTRATION_WATCHLIST",
            severity: "low",
            message: "Overall balance is strong, but concentration risk remains high enough to keep on a review watchlist.",
            category: "institutional",
            requiresHumanReview: false,
          }),
        ]
      : []),
  ];
}

function buildAssumptions(input: PortfolioRiskBalancingInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0 ? ["Missing portfolio risk-balancing inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."] : []),
    "Portfolio risk-balancing scoring is strategic, deterministic, and read-only; it is not investment advice, portfolio-management advice, lending advice, legal advice, financial advice, or market prediction.",
    "No live portfolio systems, financial APIs, live market data, external APIs, scraping, MLS data, county calls, demographic data, or protected-class data was used.",
  ]);
}

function buildExplainability(params: {
  scoreBreakdown: PortfolioRiskBalancingScoreBreakdown;
  concentrationRiskLevel: PortfolioRiskConcentrationLevel;
  warnings: CorridorWarning[];
  missingData: string[];
  assumptions: string[];
}): PortfolioRiskBalancingExplainability {
  const scoreBreakdown = params.scoreBreakdown;
  const strengths = unique([
    ...(scoreBreakdown.assetExposureBalanceScore >= 70 ? ["Asset exposure balance is strong."] : []),
    ...(scoreBreakdown.corridorExposureBalanceScore >= 70 ? ["Corridor exposure balance is strong."] : []),
    ...(scoreBreakdown.capitalCycleExposureBalanceScore >= 70 ? ["Capital-cycle exposure balance is strong."] : []),
    ...(scoreBreakdown.strategyExposureBalanceScore >= 70 ? ["Strategy exposure balance is strong."] : []),
    ...(scoreBreakdown.downsideProtectionBalanceScore >= 70 ? ["Downside protection balance is strong under current structured inputs."] : []),
    ...(scoreBreakdown.defensivePositioningScore >= 70 ? ["Defensive positioning is strong."] : []),
    ...(scoreBreakdown.diversificationEffectivenessScore >= 70 ? ["Diversification effectiveness is strong."] : []),
    ...(scoreBreakdown.correlationAdjustedRiskBalanceScore >= 70 ? ["Correlation-adjusted risk balance is strong."] : []),
  ]);
  const weaknesses = unique([
    ...(scoreBreakdown.assetExposureBalanceScore < 45 ? ["Asset exposure balance is weak."] : []),
    ...(scoreBreakdown.corridorExposureBalanceScore < 45 ? ["Corridor exposure balance is weak."] : []),
    ...(scoreBreakdown.capitalCycleExposureBalanceScore < 45 ? ["Capital-cycle exposure balance is weak."] : []),
    ...(scoreBreakdown.strategyExposureBalanceScore < 45 ? ["Strategy exposure balance is weak."] : []),
    ...(scoreBreakdown.downsideProtectionBalanceScore < 45 ? ["Downside protection balance is weak."] : []),
    ...(scoreBreakdown.defensivePositioningScore < 45 ? ["Defensive positioning is weak."] : []),
    ...(scoreBreakdown.diversificationEffectivenessScore < 45 ? ["Diversification effectiveness is weak."] : []),
    ...(scoreBreakdown.portfolioResilienceBalanceScore < 45 ? ["Portfolio resilience balance is weak."] : []),
  ]);
  const risks = unique([
    ...(params.warnings.some((warning) => warning.severity === "high") ? ["High-severity portfolio risk-balance warning requires manual review."] : []),
    ...(scoreBreakdown.concentrationRiskScore >= 70 ? ["Exposure concentration risk is elevated across one or more balance dimensions."] : []),
    ...(scoreBreakdown.correlationAdjustedRiskBalanceScore < 45 ? ["Correlation-adjusted risk balance is weak."] : []),
    ...(scoreBreakdown.expansionRiskBalanceScore < 45 ? ["Expansion risk balance is weak under current structured inputs."] : []),
    ...(scoreBreakdown.capitalCycleExposureBalanceScore < 45 ? ["Capital-cycle imbalance may reduce defensive resilience; this is not a market prediction."] : []),
    ...(params.missingData.length > 0 ? `Missing data reduces confidence: ${params.missingData.slice(0, 4).join(", ")}.` : []),
  ]);

  return {
    summary: `Portfolio concentration risk level is ${params.concentrationRiskLevel} with a ${scoreBreakdown.portfolioRiskBalanceScore}/100 portfolio risk balance score and ${scoreBreakdown.concentrationRiskScore}/100 concentration risk score. This is deterministic read-only risk-balancing intelligence only and does not provide investment, portfolio-management, lending, legal, or market-prediction advice.`,
    strengths,
    weaknesses,
    risks,
    assumptions: params.assumptions,
  };
}

export function analyzePortfolioRiskBalancingIntelligence(input: PortfolioRiskBalancingInput = {}): PortfolioRiskBalancingResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const concentrationRiskLevel = classifyConcentrationRisk(scoreBreakdown, warnings);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });
  const explainability = buildExplainability({
    scoreBreakdown,
    concentrationRiskLevel,
    warnings,
    missingData,
    assumptions,
  });

  return {
    portfolioRiskBalance: scoreBreakdown.portfolioRiskBalanceScore,
    concentrationRiskLevel,
    assetExposureBalance: scoreBreakdown.assetExposureBalanceScore,
    corridorExposureBalance: scoreBreakdown.corridorExposureBalanceScore,
    capitalCycleExposureBalance: scoreBreakdown.capitalCycleExposureBalanceScore,
    strategyExposureBalance: scoreBreakdown.strategyExposureBalanceScore,
    expansionRiskBalance: scoreBreakdown.expansionRiskBalanceScore,
    downsideProtectionBalance: scoreBreakdown.downsideProtectionBalanceScore,
    defensivePositioning: scoreBreakdown.defensivePositioningScore,
    diversificationEffectiveness: scoreBreakdown.diversificationEffectivenessScore,
    portfolioResilienceBalance: scoreBreakdown.portfolioResilienceBalanceScore,
    correlationAdjustedRiskBalance: scoreBreakdown.correlationAdjustedRiskBalanceScore,
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
      lendingAdvice: false,
      investmentAdvice: false,
      portfolioManagementAdvice: false,
      legalAdvice: false,
      marketPrediction: false,
    },
    readOnly: true,
  };
}

export const getPortfolioRiskBalancingIntelligence = analyzePortfolioRiskBalancingIntelligence;
