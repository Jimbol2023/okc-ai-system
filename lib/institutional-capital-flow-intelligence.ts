import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type InstitutionalCapitalFlowClassification = "misaligned" | "watchlist" | "selective" | "aligned" | "institutional_grade";

export type InstitutionalCapitalFlowInput = {
  liquidityDurabilityScore?: number;
  institutionalDeploymentScore?: number;
  expansionCapitalCoherenceScore?: number;
  luxuryCapitalCompatibilityScore?: number;
  developmentCapitalFitScore?: number;
  phasedCapitalSurvivabilityScore?: number;
  corridorCapitalAttractivenessScore?: number;
  capitalFlexibilityScore?: number;
  multiAssetFundingCompatibilityScore?: number;
  strategicScalingDurabilityScore?: number;
  institutionalExpansionReadinessScore?: number;
  corridorIntelligenceProfile?: unknown;
  developmentCorridorProfile?: unknown;
  landIntelligenceProfile?: unknown;
  builderDeveloperProfile?: unknown;
  multiAssetExpansionProfile?: unknown;
  capitalMarketProfile?: unknown;
  liquidityRiskScore?: number;
  debtRiskScore?: number;
  capitalPressureScore?: number;
  executionRiskScore?: number;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type InstitutionalCapitalFlowScoreBreakdown = CorridorScoreBreakdown & {
  strategicCapitalAlignmentScore: number;
  liquidityDurabilityScore: number;
  institutionalDeploymentCompatibilityScore: number;
  expansionCapitalCoherenceScore: number;
  luxuryCapitalCompatibilityScore: number;
  developmentCapitalFitScore: number;
  phasedCapitalSurvivabilityScore: number;
  corridorCapitalAttractivenessScore: number;
  capitalFlexibilityScore: number;
  multiAssetFundingCompatibilityScore: number;
  strategicScalingDurabilityScore: number;
  institutionalExpansionReadinessScore: number;
  capitalPressureRiskScore: number;
};

export type InstitutionalCapitalFlowExplainability = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  assumptions: string[];
};

export type InstitutionalCapitalFlowResult = {
  strategicCapitalAlignment: number;
  capitalFlowClassification: InstitutionalCapitalFlowClassification;
  liquidityDurability: number;
  institutionalDeploymentCompatibility: number;
  expansionCapitalCoherence: number;
  luxuryCapitalCompatibility: number;
  developmentCapitalFit: number;
  phasedCapitalSurvivability: number;
  corridorCapitalAttractiveness: number;
  capitalFlexibility: number;
  multiAssetFundingCompatibility: number;
  strategicScalingDurability: number;
  institutionalExpansionReadiness: number;
  confidenceScore: number;
  scoreBreakdown: InstitutionalCapitalFlowScoreBreakdown;
  explainability: InstitutionalCapitalFlowExplainability;
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
  };
  readOnly: true;
};

const REQUIRED_INPUTS: Array<keyof InstitutionalCapitalFlowInput> = [
  "liquidityDurabilityScore",
  "institutionalDeploymentScore",
  "expansionCapitalCoherenceScore",
  "luxuryCapitalCompatibilityScore",
  "developmentCapitalFitScore",
  "phasedCapitalSurvivabilityScore",
  "corridorCapitalAttractivenessScore",
  "capitalFlexibilityScore",
  "multiAssetFundingCompatibilityScore",
  "strategicScalingDurabilityScore",
  "institutionalExpansionReadinessScore",
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

function getMissingData(input: InstitutionalCapitalFlowInput) {
  const labels: Record<keyof InstitutionalCapitalFlowInput, string> = {
    liquidityDurabilityScore: "liquidity durability score",
    institutionalDeploymentScore: "institutional deployment score",
    expansionCapitalCoherenceScore: "expansion-capital coherence score",
    luxuryCapitalCompatibilityScore: "luxury-capital compatibility score",
    developmentCapitalFitScore: "development-capital fit score",
    phasedCapitalSurvivabilityScore: "phased capital survivability score",
    corridorCapitalAttractivenessScore: "corridor-capital attractiveness score",
    capitalFlexibilityScore: "capital flexibility score",
    multiAssetFundingCompatibilityScore: "multi-asset funding compatibility score",
    strategicScalingDurabilityScore: "strategic scaling durability score",
    institutionalExpansionReadinessScore: "institutional expansion readiness score",
    corridorIntelligenceProfile: "corridor intelligence profile",
    developmentCorridorProfile: "development corridor profile",
    landIntelligenceProfile: "land intelligence profile",
    builderDeveloperProfile: "builder/developer profile",
    multiAssetExpansionProfile: "multi-asset expansion profile",
    capitalMarketProfile: "capital-market profile",
    liquidityRiskScore: "liquidity risk score",
    debtRiskScore: "debt risk score",
    capitalPressureScore: "capital pressure score",
    executionRiskScore: "execution risk score",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined ? [labels[key]] : []));
}

function buildScoreBreakdown(input: InstitutionalCapitalFlowInput): InstitutionalCapitalFlowScoreBreakdown {
  const corridorProfile = input.corridorIntelligenceProfile;
  const developmentProfile = input.developmentCorridorProfile;
  const landProfile = input.landIntelligenceProfile;
  const builderProfile = input.builderDeveloperProfile;
  const multiAssetProfile = input.multiAssetExpansionProfile;
  const capitalProfile = input.capitalMarketProfile;
  const liquidityRiskScore = getScore(input.liquidityRiskScore, extractProfileScore(capitalProfile, ["riskProfile.liquidityRiskScore", "liquidityEnvironmentProfile.resaleLiquidityRiskScore"], 48));
  const debtRiskScore = getScore(input.debtRiskScore, extractProfileScore(capitalProfile, ["riskProfile.debtRiskScore", "debtSensitivityProfile.debtSensitivityScore"], 48));
  const executionRiskScore = getScore(input.executionRiskScore, extractProfileScore(builderProfile, ["scoreBreakdown.executionReadinessScore"], 52) < 50 ? 66 : 42);
  const capitalPressureRiskScore = getScore(
    input.capitalPressureScore,
    extractProfileScore(capitalProfile, ["riskProfile.developmentCapitalRiskScore", "developmentCapitalPressureProfile.landDevelopmentCapitalPressureScore"], 48),
  );
  const liquidityDurabilityScore = getScore(
    input.liquidityDurabilityScore,
    weightedAverage([
      [extractProfileScore(capitalProfile, ["liquidityEnvironmentProfile.marketDepthStrengthScore", "liquidityEnvironmentProfile.capitalExitFlexibilityScore"], 54), 0.36],
      [extractProfileScore(multiAssetProfile, ["portfolioExpansionDurability", "multiMarketSurvivability"], 54), 0.24],
      [extractProfileScore(landProfile, ["institutionalHoldSuitability", "phasedDevelopmentDurability"], 54), 0.14],
      [100 - liquidityRiskScore, 0.26],
    ]),
  );
  const institutionalDeploymentCompatibilityScore = getScore(
    input.institutionalDeploymentScore,
    weightedAverage([
      [extractProfileScore(capitalProfile, ["institutionalCapitalClimate.institutionalAcquisitionAttractivenessScore", "institutionalCapitalClimate.riskAdjustedHoldClimateScore"], 54), 0.34],
      [extractProfileScore(multiAssetProfile, ["institutionalScalability", "scoreBreakdown.institutionalScalabilityScore"], 54), 0.24],
      [extractProfileScore(corridorProfile, ["institutionalAttractiveness", "scoreBreakdown.institutionalScore"], 54), 0.18],
      [extractProfileScore(builderProfile, ["institutionalPartnershipReadiness", "capitalSophisticationFit"], 54), 0.14],
      [100 - capitalPressureRiskScore, 0.1],
    ]),
  );
  const expansionCapitalCoherenceScore = getScore(
    input.expansionCapitalCoherenceScore,
    weightedAverage([
      [extractProfileScore(multiAssetProfile, ["expansionCoherence", "crossAssetExpansionStrength"], 54), 0.3],
      [extractProfileScore(corridorProfile, ["strategicExpansionFit", "scoreBreakdown.expansionScore"], 54), 0.22],
      [extractProfileScore(capitalProfile, ["scores.riskAdjustedAcquisitionTimingScore", "scores.capitalStackFlexibilityScore"], 54), 0.22],
      [extractProfileScore(developmentProfile, ["expansionDurability", "phasedGrowthSurvivability"], 54), 0.14],
      [100 - debtRiskScore, 0.12],
    ]),
  );
  const luxuryCapitalCompatibilityScore = getScore(
    input.luxuryCapitalCompatibilityScore,
    weightedAverage([
      [extractProfileScore(multiAssetProfile, ["luxuryDevelopmentCompatibility", "scoreBreakdown.luxuryDevelopmentCompatibilityScore"], 52), 0.28],
      [extractProfileScore(developmentProfile, ["luxuryDevelopmentCompatibility", "scoreBreakdown.luxuryDevelopmentCompatibilityScore"], 52), 0.2],
      [extractProfileScore(capitalProfile, ["institutionalCapitalClimate.capitalPreservationFitScore", "liquidityEnvironmentProfile.luxuryLiquidityRiskScore"], 52), 0.2],
      [extractProfileScore(corridorProfile, ["luxuryCorridorStrength", "scoreBreakdown.luxuryScore"], 52), 0.16],
      [100 - liquidityRiskScore, 0.16],
    ]),
  );
  const developmentCapitalFitScore = getScore(
    input.developmentCapitalFitScore,
    weightedAverage([
      [extractProfileScore(developmentProfile, ["developmentReadiness", "institutionalDevelopmentAttractiveness"], 54), 0.24],
      [extractProfileScore(landProfile, ["scalabilityPotential", "infrastructureAlignment"], 54), 0.18],
      [extractProfileScore(builderProfile, ["capitalSophisticationFit", "landDevelopmentCapability"], 54), 0.18],
      [extractProfileScore(capitalProfile, ["scores.developmentCapitalReadinessScore", "developmentCapitalPressureProfile.phasedDevelopmentFlexibilityScore"], 54), 0.26],
      [100 - capitalPressureRiskScore, 0.14],
    ]),
  );
  const phasedCapitalSurvivabilityScore = getScore(
    input.phasedCapitalSurvivabilityScore,
    weightedAverage([
      [extractProfileScore(multiAssetProfile, ["phasedExpansionCompatibility", "scoreBreakdown.phasedExpansionCompatibilityScore"], 54), 0.26],
      [extractProfileScore(developmentProfile, ["phasedGrowthSurvivability", "scoreBreakdown.phasedGrowthSurvivabilityScore"], 54), 0.22],
      [extractProfileScore(landProfile, ["phasedDevelopmentDurability"], 54), 0.18],
      [extractProfileScore(capitalProfile, ["developmentCapitalPressureProfile.phasedDevelopmentFlexibilityScore", "capitalStackFlexibilityProfile.delayedCloseRelevanceScore"], 54), 0.18],
      [100 - capitalPressureRiskScore, 0.1],
      [100 - executionRiskScore, 0.06],
    ]),
  );
  const corridorCapitalAttractivenessScore = getScore(
    input.corridorCapitalAttractivenessScore,
    weightedAverage([
      [extractProfileScore(corridorProfile, ["institutionalAttractiveness", "overallCorridorScore"], 54), 0.28],
      [extractProfileScore(developmentProfile, ["institutionalDevelopmentAttractiveness", "overallDevelopmentCorridorScore"], 54), 0.22],
      [extractProfileScore(landProfile, ["corridorLeverage", "institutionalHoldSuitability"], 54), 0.18],
      [liquidityDurabilityScore, 0.16],
      [institutionalDeploymentCompatibilityScore, 0.16],
    ]),
  );
  const capitalFlexibilityScore = getScore(
    input.capitalFlexibilityScore,
    weightedAverage([
      [extractProfileScore(capitalProfile, ["scores.capitalStackFlexibilityScore", "capitalStackFlexibilityProfile.privateCapitalFitScore"], 54), 0.36],
      [extractProfileScore(capitalProfile, ["capitalAvailabilityProfile.privateCapitalFitScore", "capitalAvailabilityProfile.partnershipUsefulnessScore"], 54), 0.2],
      [extractProfileScore(builderProfile, ["capitalSophisticationFit"], 54), 0.14],
      [extractProfileScore(landProfile, ["strategicFlexibility", "optionalityStrength"], 54), 0.14],
      [100 - debtRiskScore, 0.16],
    ]),
  );
  const multiAssetFundingCompatibilityScore = getScore(
    input.multiAssetFundingCompatibilityScore,
    weightedAverage([
      [extractProfileScore(multiAssetProfile, ["crossAssetExpansionStrength", "strategicBalancing"], 54), 0.26],
      [extractProfileScore(multiAssetProfile, ["diversificationQuality", "assetInteractionStability"], 54), 0.2],
      [capitalFlexibilityScore, 0.2],
      [institutionalDeploymentCompatibilityScore, 0.16],
      [100 - capitalPressureRiskScore, 0.1],
      [100 - debtRiskScore, 0.08],
    ]),
  );
  const strategicScalingDurabilityScore = getScore(
    input.strategicScalingDurabilityScore,
    weightedAverage([
      [liquidityDurabilityScore, 0.18],
      [phasedCapitalSurvivabilityScore, 0.18],
      [multiAssetFundingCompatibilityScore, 0.18],
      [extractProfileScore(multiAssetProfile, ["portfolioExpansionDurability", "multiMarketSurvivability"], 54), 0.18],
      [corridorCapitalAttractivenessScore, 0.14],
      [100 - executionRiskScore, 0.08],
      [100 - capitalPressureRiskScore, 0.06],
    ]),
  );
  const institutionalExpansionReadinessScore = getScore(
    input.institutionalExpansionReadinessScore,
    weightedAverage([
      [institutionalDeploymentCompatibilityScore, 0.22],
      [expansionCapitalCoherenceScore, 0.18],
      [capitalFlexibilityScore, 0.16],
      [strategicScalingDurabilityScore, 0.18],
      [multiAssetFundingCompatibilityScore, 0.14],
      [100 - capitalPressureRiskScore, 0.08],
      [100 - debtRiskScore, 0.04],
    ]),
  );
  const strategicCapitalAlignmentScore = weightedAverage([
    [liquidityDurabilityScore, 0.11],
    [institutionalDeploymentCompatibilityScore, 0.13],
    [expansionCapitalCoherenceScore, 0.12],
    [luxuryCapitalCompatibilityScore, 0.08],
    [developmentCapitalFitScore, 0.1],
    [phasedCapitalSurvivabilityScore, 0.1],
    [corridorCapitalAttractivenessScore, 0.1],
    [capitalFlexibilityScore, 0.1],
    [multiAssetFundingCompatibilityScore, 0.1],
    [strategicScalingDurabilityScore, 0.08],
    [institutionalExpansionReadinessScore, 0.08],
  ]);

  return {
    connectivityScore: corridorCapitalAttractivenessScore,
    durabilityScore: strategicScalingDurabilityScore,
    expansionScore: expansionCapitalCoherenceScore,
    institutionalScore: institutionalDeploymentCompatibilityScore,
    logisticsScore: phasedCapitalSurvivabilityScore,
    luxuryScore: luxuryCapitalCompatibilityScore,
    developmentScore: developmentCapitalFitScore,
    strategicCapitalAlignmentScore,
    liquidityDurabilityScore,
    institutionalDeploymentCompatibilityScore,
    expansionCapitalCoherenceScore,
    luxuryCapitalCompatibilityScore,
    developmentCapitalFitScore,
    phasedCapitalSurvivabilityScore,
    corridorCapitalAttractivenessScore,
    capitalFlexibilityScore,
    multiAssetFundingCompatibilityScore,
    strategicScalingDurabilityScore,
    institutionalExpansionReadinessScore,
    capitalPressureRiskScore,
  };
}

function buildWarnings(input: InstitutionalCapitalFlowInput, scoreBreakdown: InstitutionalCapitalFlowScoreBreakdown, missingData: string[]) {
  const liquidityRiskScore = getScore(input.liquidityRiskScore, 48);
  const debtRiskScore = getScore(input.debtRiskScore, 48);

  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "CAPITAL_FLOW_DATA_INCOMPLETE",
            severity: missingData.length >= 6 ? "high" : "medium",
            message: "Institutional capital-flow assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.strategicCapitalAlignmentScore < 45
      ? [
          createCorridorWarning({
            code: "STRATEGIC_CAPITAL_ALIGNMENT_WEAK",
            severity: "high",
            message: "Strategic capital alignment is too weak for institutional expansion assumptions.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.capitalPressureRiskScore >= 76
      ? [
          createCorridorWarning({
            code: "CAPITAL_PRESSURE_HIGH",
            severity: "high",
            message: "Capital pressure risk is high enough to reduce institutional expansion readiness.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.institutionalDeploymentCompatibilityScore >= 72 && scoreBreakdown.capitalFlexibilityScore < 55
      ? [
          createCorridorWarning({
            code: "DEPLOYMENT_FLEXIBILITY_GAP",
            severity: "medium",
            message: "Institutional deployment compatibility is stronger than capital flexibility and needs review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.developmentCapitalFitScore >= 72 && scoreBreakdown.phasedCapitalSurvivabilityScore < 55
      ? [
          createCorridorWarning({
            code: "DEVELOPMENT_CAPITAL_PHASE_GAP",
            severity: "medium",
            message: "Development-capital fit is attractive, but phased capital survivability needs verification.",
            category: "development",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.luxuryCapitalCompatibilityScore >= 72 && scoreBreakdown.liquidityDurabilityScore < 55
      ? [
          createCorridorWarning({
            code: "LUXURY_CAPITAL_LIQUIDITY_REVIEW",
            severity: "medium",
            message: "Luxury-capital compatibility is strong, but liquidity durability is not yet strong enough.",
            category: "luxury",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(liquidityRiskScore >= 74 || debtRiskScore >= 74
      ? [
          createCorridorWarning({
            code: "CAPITAL_RISK_ELEVATED",
            severity: "high",
            message: "Liquidity or debt risk is elevated enough to require manual capital review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
  ];
}

function classifyCapitalFlow(score: number, warnings: CorridorWarning[]): InstitutionalCapitalFlowClassification {
  const normalized = normalizeCorridorScore(score);

  if (warnings.some((warning) => warning.severity === "high") || normalized < 38) return "misaligned";
  if (normalized >= 86) return "institutional_grade";
  if (normalized >= 74) return "aligned";
  if (normalized >= 58) return "selective";

  return "watchlist";
}

function buildAssumptions(input: InstitutionalCapitalFlowInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0 ? ["Missing institutional capital-flow inputs were filled with conservative deterministic defaults."] : []),
    "Institutional capital-flow scoring is strategic and read-only; it is not lending, investment, portfolio-management, legal, securities, tax, or financing advice.",
    "No financial APIs, banking systems, live portfolio systems, live market feeds, external APIs, scraping, demographic data, or protected-class data was used.",
  ]);
}

function buildExplainability(params: {
  scoreBreakdown: InstitutionalCapitalFlowScoreBreakdown;
  classification: InstitutionalCapitalFlowClassification;
  warnings: CorridorWarning[];
  missingData: string[];
  assumptions: string[];
}): InstitutionalCapitalFlowExplainability {
  const scoreBreakdown = params.scoreBreakdown;
  const strengths = unique([
    ...(scoreBreakdown.strategicCapitalAlignmentScore >= 72 ? ["Strategic capital alignment is strong."] : []),
    ...(scoreBreakdown.liquidityDurabilityScore >= 70 ? ["Liquidity durability supports longer expansion sequencing."] : []),
    ...(scoreBreakdown.institutionalDeploymentCompatibilityScore >= 70 ? ["Institutional deployment compatibility is strong."] : []),
    ...(scoreBreakdown.expansionCapitalCoherenceScore >= 70 ? ["Expansion-capital coherence supports disciplined scaling."] : []),
    ...(scoreBreakdown.developmentCapitalFitScore >= 70 ? ["Development-capital fit supports corridor and land systems."] : []),
    ...(scoreBreakdown.phasedCapitalSurvivabilityScore >= 70 ? ["Phased capital survivability supports controlled deployment."] : []),
    ...(scoreBreakdown.multiAssetFundingCompatibilityScore >= 70 ? ["Multi-asset funding compatibility is strong."] : []),
    ...(scoreBreakdown.institutionalExpansionReadinessScore >= 70 ? ["Institutional expansion readiness is strong."] : []),
  ]);
  const weaknesses = unique([
    ...(scoreBreakdown.strategicCapitalAlignmentScore < 50 ? ["Strategic capital alignment is weak under current inputs."] : []),
    ...(scoreBreakdown.liquidityDurabilityScore < 45 ? ["Liquidity durability is weak."] : []),
    ...(scoreBreakdown.capitalFlexibilityScore < 45 ? ["Capital flexibility is weak."] : []),
    ...(scoreBreakdown.expansionCapitalCoherenceScore < 45 ? ["Expansion-capital coherence is weak."] : []),
    ...(scoreBreakdown.institutionalExpansionReadinessScore < 45 ? ["Institutional expansion readiness is weak."] : []),
  ]);
  const risks = unique([
    ...(params.warnings.some((warning) => warning.severity === "high") ? ["High-severity capital-flow warning requires manual review."] : []),
    ...(scoreBreakdown.capitalPressureRiskScore >= 70 ? ["Capital pressure may reduce strategic scaling durability."] : []),
    ...(scoreBreakdown.developmentCapitalFitScore >= 70 && scoreBreakdown.phasedCapitalSurvivabilityScore < 55 ? ["Development-capital fit is stronger than phased survivability."] : []),
    ...(params.missingData.length > 0 ? `Missing data reduces confidence: ${params.missingData.slice(0, 4).join(", ")}.` : []),
  ]);

  return {
    summary: `Institutional capital-flow classification is ${params.classification} with a ${scoreBreakdown.strategicCapitalAlignmentScore}/100 strategic capital alignment score. This is deterministic read-only capital intelligence only.`,
    strengths,
    weaknesses,
    risks,
    assumptions: params.assumptions,
  };
}

export function analyzeInstitutionalCapitalFlowIntelligence(input: InstitutionalCapitalFlowInput = {}): InstitutionalCapitalFlowResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(input, scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const capitalFlowClassification = classifyCapitalFlow(scoreBreakdown.strategicCapitalAlignmentScore, warnings);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });
  const explainability = buildExplainability({
    scoreBreakdown,
    classification: capitalFlowClassification,
    warnings,
    missingData,
    assumptions,
  });

  return {
    strategicCapitalAlignment: scoreBreakdown.strategicCapitalAlignmentScore,
    capitalFlowClassification,
    liquidityDurability: scoreBreakdown.liquidityDurabilityScore,
    institutionalDeploymentCompatibility: scoreBreakdown.institutionalDeploymentCompatibilityScore,
    expansionCapitalCoherence: scoreBreakdown.expansionCapitalCoherenceScore,
    luxuryCapitalCompatibility: scoreBreakdown.luxuryCapitalCompatibilityScore,
    developmentCapitalFit: scoreBreakdown.developmentCapitalFitScore,
    phasedCapitalSurvivability: scoreBreakdown.phasedCapitalSurvivabilityScore,
    corridorCapitalAttractiveness: scoreBreakdown.corridorCapitalAttractivenessScore,
    capitalFlexibility: scoreBreakdown.capitalFlexibilityScore,
    multiAssetFundingCompatibility: scoreBreakdown.multiAssetFundingCompatibilityScore,
    strategicScalingDurability: scoreBreakdown.strategicScalingDurabilityScore,
    institutionalExpansionReadiness: scoreBreakdown.institutionalExpansionReadinessScore,
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
    },
    readOnly: true,
  };
}

export const getInstitutionalCapitalFlowIntelligence = analyzeInstitutionalCapitalFlowIntelligence;
