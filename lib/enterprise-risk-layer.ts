import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type EnterpriseRiskDurabilityClassification = "fragile" | "exposed" | "review_required" | "resilient" | "institutional_grade";

export type EnterpriseRiskLayerInput = {
  operationalRiskScore?: number;
  dependencyConcentrationScore?: number;
  governanceFragilityScore?: number;
  strategicSurvivabilityScore?: number;
  operationalContinuityResilienceScore?: number;
  multiMarketExposureBalanceScore?: number;
  expansionFragilityScore?: number;
  corridorDependencyExposureScore?: number;
  diversificationResilienceScore?: number;
  institutionalStabilityDurabilityScore?: number;
  defensiveOperationalResilienceScore?: number;
  systemicSurvivabilityBalanceScore?: number;
  familyOfficeGovernanceProfile?: unknown;
  enterpriseExpansionGovernanceProfile?: unknown;
  longHorizonWealthPreservationProfile?: unknown;
  strategicTerritoryDefenseProfile?: unknown;
  institutionalTerritoryProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseRiskLayerScoreBreakdown = CorridorScoreBreakdown & {
  enterpriseRiskDurabilityScore: number;
  operationalRiskExposureScore: number;
  dependencyConcentrationRiskScore: number;
  governanceFragilityExposureScore: number;
  strategicSurvivabilityQualityScore: number;
  operationalContinuityResilienceScore: number;
  multiMarketExposureBalanceScore: number;
  expansionFragilityScore: number;
  corridorDependencyExposureScore: number;
  diversificationResilienceQualityScore: number;
  institutionalStabilityDurabilityScore: number;
  defensiveOperationalResilienceScore: number;
  systemicSurvivabilityBalanceScore: number;
};

export type EnterpriseRiskLayerExplainability = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  assumptions: string[];
};

export type EnterpriseRiskLayerResult = {
  enterpriseRiskDurability: number;
  durabilityClassification: EnterpriseRiskDurabilityClassification;
  operationalRiskExposure: number;
  dependencyConcentrationRisk: number;
  governanceFragilityExposure: number;
  strategicSurvivabilityQuality: number;
  operationalContinuityResilience: number;
  multiMarketExposureBalance: number;
  expansionFragility: number;
  corridorDependencyExposure: number;
  diversificationResilienceQuality: number;
  institutionalStabilityDurability: number;
  defensiveOperationalResilience: number;
  systemicSurvivabilityBalance: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseRiskLayerScoreBreakdown;
  explainability: EnterpriseRiskLayerExplainability;
  warnings: CorridorWarning[];
  missingData: string[];
  assumptions: string[];
  safety: {
    readOnly: true;
    outreachAuthorized: false;
    executionAuthorized: false;
    autonomousMitigationAuthorized: false;
    databaseWriteAuthorized: false;
    externalDataUsed: false;
    financialApiUsed: false;
    liveMarketDataUsed: false;
    liveRatesUsed: false;
    livePortfolioSystemUsed: false;
    legalSystemUsed: false;
    insuranceSystemUsed: false;
    cybersecurityExecutionSystemUsed: false;
    scrapingUsed: false;
    mlsIntegrationUsed: false;
    countyCallUsed: false;
    demographicTargetingUsed: false;
    protectedClassLogicUsed: false;
    legalAdvice: false;
    insuranceAdvice: false;
    investmentAdvice: false;
    portfolioManagementAdvice: false;
    marketPrediction: false;
    cybersecurityExecutionBehavior: false;
  };
  readOnly: true;
};

const REQUIRED_INPUTS: Array<keyof EnterpriseRiskLayerInput> = [
  "operationalRiskScore",
  "dependencyConcentrationScore",
  "governanceFragilityScore",
  "strategicSurvivabilityScore",
  "operationalContinuityResilienceScore",
  "multiMarketExposureBalanceScore",
  "expansionFragilityScore",
  "corridorDependencyExposureScore",
  "diversificationResilienceScore",
  "institutionalStabilityDurabilityScore",
  "defensiveOperationalResilienceScore",
  "systemicSurvivabilityBalanceScore",
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

function hasFallbackForInput(input: EnterpriseRiskLayerInput, key: keyof EnterpriseRiskLayerInput) {
  const familyOfficeProfile = input.familyOfficeGovernanceProfile;
  const enterpriseGovernanceProfile = input.enterpriseExpansionGovernanceProfile;
  const preservationProfile = input.longHorizonWealthPreservationProfile;
  const defenseProfile = input.strategicTerritoryDefenseProfile;
  const territoryProfile = input.institutionalTerritoryProfile;

  const fallbackPaths: Partial<Record<keyof EnterpriseRiskLayerInput, boolean>> = {
    operationalRiskScore:
      hasProfileScore(enterpriseGovernanceProfile, ["operationalGovernanceResilience", "scoreBreakdown.operationalGovernanceResilienceScore"]) ||
      hasProfileScore(preservationProfile, ["operationalContinuityProtection", "scoreBreakdown.operationalContinuityProtectionScore"]),
    dependencyConcentrationScore:
      hasProfileScore(defenseProfile, ["multiMarketRedundancyStrength", "diversificationProtectionQuality"]) ||
      hasProfileScore(territoryProfile, ["multiMarketOperationalAlignment", "diversificationAwareTerritoryStability"]),
    governanceFragilityScore:
      hasProfileScore(enterpriseGovernanceProfile, ["governanceDurability", "enterpriseGovernanceQuality"]) ||
      hasProfileScore(familyOfficeProfile, ["governanceDurability", "familyOfficeGovernanceQuality"]),
    strategicSurvivabilityScore:
      hasProfileScore(preservationProfile, ["strategicSustainabilityResilience", "longHorizonPreservationQuality"]) ||
      hasProfileScore(defenseProfile, ["territoryResilience", "strategicTerritoryDefenseQuality"]),
    operationalContinuityResilienceScore:
      hasProfileScore(preservationProfile, ["operationalContinuityProtection", "scoreBreakdown.operationalContinuityProtectionScore"]) ||
      hasProfileScore(enterpriseGovernanceProfile, ["operationalGovernanceResilience", "scoreBreakdown.operationalGovernanceResilienceScore"]),
    multiMarketExposureBalanceScore:
      hasProfileScore(territoryProfile, ["multiMarketOperationalAlignment", "regionalOperationalCoherence"]) ||
      hasProfileScore(preservationProfile, ["multiMarketSurvivabilityQuality", "scoreBreakdown.multiMarketSurvivabilityQualityScore"]),
    expansionFragilityScore:
      hasProfileScore(enterpriseGovernanceProfile, ["expansionControlQuality", "expansionOversightQuality"]) ||
      hasProfileScore(defenseProfile, ["defensiveExpansionDurability", "expansionSurvivabilityDefense"]),
    corridorDependencyExposureScore:
      hasProfileScore(territoryProfile, ["regionalOperationalCoherence", "multiMarketOperationalAlignment"]) ||
      hasProfileScore(defenseProfile, ["multiMarketRedundancyStrength", "territoryResilience"]),
    diversificationResilienceScore:
      hasProfileScore(preservationProfile, ["diversificationPreservationQuality", "defensiveSustainabilityBalance"]) ||
      hasProfileScore(defenseProfile, ["diversificationProtectionQuality", "territoryResilience"]),
    institutionalStabilityDurabilityScore:
      hasProfileScore(preservationProfile, ["institutionalContinuityDurability", "longHorizonPreservationQuality"]) ||
      hasProfileScore(defenseProfile, ["institutionalStabilityProtection", "strategicTerritoryDefenseQuality"]),
    defensiveOperationalResilienceScore:
      hasProfileScore(defenseProfile, ["territoryResilience", "defensiveExpansionDurability"]) ||
      hasProfileScore(enterpriseGovernanceProfile, ["defensiveGovernanceResilience", "operationalGovernanceResilience"]),
    systemicSurvivabilityBalanceScore:
      hasProfileScore(preservationProfile, ["strategicSustainabilityResilience", "multiMarketSurvivabilityQuality"]) ||
      hasProfileScore(enterpriseGovernanceProfile, ["enterpriseGovernanceQuality", "multiMarketGovernanceStability"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: EnterpriseRiskLayerInput) {
  const labels: Record<keyof EnterpriseRiskLayerInput, string> = {
    operationalRiskScore: "operational risk score",
    dependencyConcentrationScore: "dependency concentration score",
    governanceFragilityScore: "governance fragility score",
    strategicSurvivabilityScore: "strategic survivability score",
    operationalContinuityResilienceScore: "operational continuity resilience score",
    multiMarketExposureBalanceScore: "multi-market exposure balance score",
    expansionFragilityScore: "expansion fragility score",
    corridorDependencyExposureScore: "corridor dependency exposure score",
    diversificationResilienceScore: "diversification resilience score",
    institutionalStabilityDurabilityScore: "institutional stability durability score",
    defensiveOperationalResilienceScore: "defensive operational resilience score",
    systemicSurvivabilityBalanceScore: "systemic survivability balance score",
    familyOfficeGovernanceProfile: "family office governance profile",
    enterpriseExpansionGovernanceProfile: "enterprise expansion governance profile",
    longHorizonWealthPreservationProfile: "long-horizon wealth preservation profile",
    strategicTerritoryDefenseProfile: "strategic territory defense profile",
    institutionalTerritoryProfile: "institutional territory profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: EnterpriseRiskLayerInput): EnterpriseRiskLayerScoreBreakdown {
  const familyOfficeProfile = input.familyOfficeGovernanceProfile;
  const enterpriseGovernanceProfile = input.enterpriseExpansionGovernanceProfile;
  const preservationProfile = input.longHorizonWealthPreservationProfile;
  const defenseProfile = input.strategicTerritoryDefenseProfile;
  const territoryProfile = input.institutionalTerritoryProfile;
  const operationalContinuityResilienceScore = getScore(
    input.operationalContinuityResilienceScore,
    weightedAverage([
      [extractProfileScore(preservationProfile, ["operationalContinuityProtection", "scoreBreakdown.operationalContinuityProtectionScore"], 54), 0.32],
      [extractProfileScore(enterpriseGovernanceProfile, ["operationalGovernanceResilience", "scoreBreakdown.operationalGovernanceResilienceScore"], 54), 0.26],
      [extractProfileScore(territoryProfile, ["regionalOperationalCoherence", "scoreBreakdown.regionalOperationalCoherenceScore"], 54), 0.18],
      [extractProfileScore(defenseProfile, ["operationalDefensibility", "institutionalStabilityProtection"], 54), 0.14],
      [extractProfileScore(familyOfficeProfile, ["operationalContinuityGovernance", "governanceDurability"], 54), 0.1],
    ]),
  );
  const multiMarketExposureBalanceScore = getScore(
    input.multiMarketExposureBalanceScore,
    weightedAverage([
      [extractProfileScore(territoryProfile, ["multiMarketOperationalAlignment", "scoreBreakdown.multiMarketOperationalAlignmentScore"], 54), 0.3],
      [extractProfileScore(preservationProfile, ["multiMarketSurvivabilityQuality", "scoreBreakdown.multiMarketSurvivabilityQualityScore"], 54), 0.24],
      [extractProfileScore(defenseProfile, ["multiMarketRedundancyStrength", "scoreBreakdown.multiMarketRedundancyStrengthScore"], 54), 0.22],
      [extractProfileScore(enterpriseGovernanceProfile, ["multiMarketGovernanceStability", "crossMarketOperationalAccountability"], 54), 0.16],
      [operationalContinuityResilienceScore, 0.08],
    ]),
  );
  const diversificationResilienceQualityScore = getScore(
    input.diversificationResilienceScore,
    weightedAverage([
      [extractProfileScore(preservationProfile, ["diversificationPreservationQuality", "scoreBreakdown.diversificationPreservationQualityScore"], 54), 0.26],
      [extractProfileScore(defenseProfile, ["diversificationProtectionQuality", "scoreBreakdown.diversificationProtectionQualityScore"], 54), 0.24],
      [extractProfileScore(territoryProfile, ["diversificationAwareTerritoryStability"], 54), 0.18],
      [extractProfileScore(enterpriseGovernanceProfile, ["diversificationGovernanceBalance", "scoreBreakdown.diversificationGovernanceBalanceScore"], 54), 0.18],
      [multiMarketExposureBalanceScore, 0.14],
    ]),
  );
  const governanceFragilityExposureScore = getScore(
    input.governanceFragilityScore,
    weightedAverage([
      [100 - extractProfileScore(enterpriseGovernanceProfile, ["governanceDurability", "scoreBreakdown.governanceDurabilityScore"], 54), 0.24],
      [100 - extractProfileScore(enterpriseGovernanceProfile, ["humanReviewGovernanceAlignment", "scoreBreakdown.humanReviewGovernanceAlignmentScore"], 54), 0.2],
      [100 - extractProfileScore(familyOfficeProfile, ["governanceDurability", "familyOfficeGovernanceQuality"], 54), 0.2],
      [100 - operationalContinuityResilienceScore, 0.16],
      [100 - diversificationResilienceQualityScore, 0.1],
      [100 - extractProfileScore(preservationProfile, ["institutionalContinuityDurability"], 54), 0.1],
    ]),
  );
  const dependencyConcentrationRiskScore = getScore(
    input.dependencyConcentrationScore,
    weightedAverage([
      [100 - multiMarketExposureBalanceScore, 0.24],
      [100 - diversificationResilienceQualityScore, 0.22],
      [100 - extractProfileScore(defenseProfile, ["multiMarketRedundancyStrength", "scoreBreakdown.multiMarketRedundancyStrengthScore"], 54), 0.18],
      [100 - extractProfileScore(territoryProfile, ["multiMarketOperationalAlignment", "regionalOperationalCoherence"], 54), 0.16],
      [100 - extractProfileScore(enterpriseGovernanceProfile, ["crossMarketOperationalAccountability", "multiMarketGovernanceStability"], 54), 0.12],
      [governanceFragilityExposureScore, 0.08],
    ]),
  );
  const corridorDependencyExposureScore = getScore(
    input.corridorDependencyExposureScore,
    weightedAverage([
      [100 - extractProfileScore(territoryProfile, ["regionalOperationalCoherence", "scoreBreakdown.regionalOperationalCoherenceScore"], 54), 0.24],
      [100 - extractProfileScore(defenseProfile, ["territoryResilience", "scoreBreakdown.territoryResilienceScore"], 54), 0.2],
      [100 - extractProfileScore(defenseProfile, ["multiMarketRedundancyStrength"], 54), 0.18],
      [100 - multiMarketExposureBalanceScore, 0.18],
      [dependencyConcentrationRiskScore, 0.2],
    ]),
  );
  const expansionFragilityScore = getScore(
    input.expansionFragilityScore,
    weightedAverage([
      [100 - extractProfileScore(enterpriseGovernanceProfile, ["expansionControlQuality", "scoreBreakdown.expansionControlQualityScore"], 54), 0.22],
      [100 - extractProfileScore(enterpriseGovernanceProfile, ["expansionOversightQuality", "scoreBreakdown.expansionOversightQualityScore"], 54), 0.2],
      [100 - extractProfileScore(defenseProfile, ["defensiveExpansionDurability", "expansionSurvivabilityDefense"], 54), 0.18],
      [100 - multiMarketExposureBalanceScore, 0.14],
      [governanceFragilityExposureScore, 0.14],
      [corridorDependencyExposureScore, 0.12],
    ]),
  );
  const institutionalStabilityDurabilityScore = getScore(
    input.institutionalStabilityDurabilityScore,
    weightedAverage([
      [extractProfileScore(preservationProfile, ["institutionalContinuityDurability", "scoreBreakdown.institutionalContinuityDurabilityScore"], 54), 0.26],
      [extractProfileScore(defenseProfile, ["institutionalStabilityProtection", "scoreBreakdown.institutionalStabilityProtectionScore"], 54), 0.24],
      [extractProfileScore(enterpriseGovernanceProfile, ["institutionalOversightReadiness", "enterpriseGovernanceQuality"], 54), 0.18],
      [extractProfileScore(territoryProfile, ["institutionalExpansionCompatibility", "regionalOperationalCoherence"], 54), 0.14],
      [operationalContinuityResilienceScore, 0.1],
      [diversificationResilienceQualityScore, 0.08],
    ]),
  );
  const defensiveOperationalResilienceScore = getScore(
    input.defensiveOperationalResilienceScore,
    weightedAverage([
      [extractProfileScore(defenseProfile, ["territoryResilience", "scoreBreakdown.territoryResilienceScore"], 54), 0.22],
      [extractProfileScore(defenseProfile, ["defensiveExpansionDurability", "scoreBreakdown.defensiveExpansionDurabilityScore"], 54), 0.18],
      [extractProfileScore(enterpriseGovernanceProfile, ["defensiveGovernanceResilience", "scoreBreakdown.defensiveGovernanceResilienceScore"], 54), 0.18],
      [operationalContinuityResilienceScore, 0.18],
      [institutionalStabilityDurabilityScore, 0.14],
      [diversificationResilienceQualityScore, 0.1],
    ]),
  );
  const strategicSurvivabilityQualityScore = getScore(
    input.strategicSurvivabilityScore,
    weightedAverage([
      [extractProfileScore(preservationProfile, ["strategicSustainabilityResilience", "scoreBreakdown.strategicSustainabilityResilienceScore"], 54), 0.22],
      [extractProfileScore(preservationProfile, ["longHorizonPreservationQuality", "scoreBreakdown.longHorizonPreservationQualityScore"], 54), 0.2],
      [extractProfileScore(defenseProfile, ["strategicTerritoryDefenseQuality", "territoryResilience"], 54), 0.18],
      [institutionalStabilityDurabilityScore, 0.14],
      [defensiveOperationalResilienceScore, 0.12],
      [diversificationResilienceQualityScore, 0.08],
      [100 - dependencyConcentrationRiskScore, 0.06],
    ]),
  );
  const systemicSurvivabilityBalanceScore = getScore(
    input.systemicSurvivabilityBalanceScore,
    weightedAverage([
      [strategicSurvivabilityQualityScore, 0.16],
      [operationalContinuityResilienceScore, 0.14],
      [multiMarketExposureBalanceScore, 0.12],
      [diversificationResilienceQualityScore, 0.12],
      [institutionalStabilityDurabilityScore, 0.14],
      [defensiveOperationalResilienceScore, 0.12],
      [100 - dependencyConcentrationRiskScore, 0.08],
      [100 - governanceFragilityExposureScore, 0.06],
      [100 - expansionFragilityScore, 0.06],
      [100 - corridorDependencyExposureScore, 0.1],
    ]),
  );
  const operationalRiskExposureScore = getScore(
    input.operationalRiskScore,
    weightedAverage([
      [100 - operationalContinuityResilienceScore, 0.22],
      [dependencyConcentrationRiskScore, 0.16],
      [governanceFragilityExposureScore, 0.16],
      [expansionFragilityScore, 0.14],
      [corridorDependencyExposureScore, 0.12],
      [100 - defensiveOperationalResilienceScore, 0.1],
      [100 - systemicSurvivabilityBalanceScore, 0.1],
    ]),
  );
  const enterpriseRiskDurabilityScore = weightedAverage([
    [100 - operationalRiskExposureScore, 0.12],
    [100 - dependencyConcentrationRiskScore, 0.1],
    [100 - governanceFragilityExposureScore, 0.1],
    [strategicSurvivabilityQualityScore, 0.12],
    [operationalContinuityResilienceScore, 0.11],
    [multiMarketExposureBalanceScore, 0.09],
    [100 - expansionFragilityScore, 0.08],
    [100 - corridorDependencyExposureScore, 0.08],
    [diversificationResilienceQualityScore, 0.08],
    [institutionalStabilityDurabilityScore, 0.09],
    [defensiveOperationalResilienceScore, 0.07],
    [systemicSurvivabilityBalanceScore, 0.06],
  ]);

  return {
    connectivityScore: 100 - corridorDependencyExposureScore,
    durabilityScore: enterpriseRiskDurabilityScore,
    expansionScore: 100 - expansionFragilityScore,
    institutionalScore: institutionalStabilityDurabilityScore,
    logisticsScore: operationalContinuityResilienceScore,
    luxuryScore: strategicSurvivabilityQualityScore,
    developmentScore: diversificationResilienceQualityScore,
    enterpriseRiskDurabilityScore,
    operationalRiskExposureScore,
    dependencyConcentrationRiskScore,
    governanceFragilityExposureScore,
    strategicSurvivabilityQualityScore,
    operationalContinuityResilienceScore,
    multiMarketExposureBalanceScore,
    expansionFragilityScore,
    corridorDependencyExposureScore,
    diversificationResilienceQualityScore,
    institutionalStabilityDurabilityScore,
    defensiveOperationalResilienceScore,
    systemicSurvivabilityBalanceScore,
  };
}

function classifyEnterpriseRiskDurability(
  scoreBreakdown: EnterpriseRiskLayerScoreBreakdown,
  warnings: CorridorWarning[],
): EnterpriseRiskDurabilityClassification {
  if (warnings.some((warning) => warning.severity === "high") || scoreBreakdown.enterpriseRiskDurabilityScore < 42) return "fragile";
  if (
    scoreBreakdown.operationalRiskExposureScore >= 68 ||
    scoreBreakdown.dependencyConcentrationRiskScore >= 68 ||
    scoreBreakdown.governanceFragilityExposureScore >= 68
  ) {
    return "exposed";
  }
  if (scoreBreakdown.enterpriseRiskDurabilityScore >= 82 && scoreBreakdown.systemicSurvivabilityBalanceScore >= 74) return "institutional_grade";
  if (scoreBreakdown.enterpriseRiskDurabilityScore >= 68 && scoreBreakdown.defensiveOperationalResilienceScore >= 62) return "resilient";

  return "review_required";
}

function buildWarnings(scoreBreakdown: EnterpriseRiskLayerScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "ENTERPRISE_RISK_DATA_INCOMPLETE",
            severity: missingData.length >= 6 ? "high" : "medium",
            message: "Enterprise risk assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.enterpriseRiskDurabilityScore < 42
      ? [
          createCorridorWarning({
            code: "ENTERPRISE_RISK_DURABILITY_WEAK",
            severity: "high",
            message: "Enterprise risk durability is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.operationalRiskExposureScore >= 74
      ? [
          createCorridorWarning({
            code: "OPERATIONAL_RISK_EXPOSURE_HIGH",
            severity: "high",
            message: "Operational risk exposure is high enough to require human review; no mitigation is executed.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.dependencyConcentrationRiskScore >= 72
      ? [
          createCorridorWarning({
            code: "DEPENDENCY_CONCENTRATION_HIGH",
            severity: "high",
            message: "Dependency concentration risk is elevated under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.governanceFragilityExposureScore >= 70
      ? [
          createCorridorWarning({
            code: "GOVERNANCE_FRAGILITY_EXPOSURE_HIGH",
            severity: "high",
            message: "Governance fragility exposure is elevated; this engine does not provide legal advice or governance automation.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.operationalContinuityResilienceScore < 45
      ? [
          createCorridorWarning({
            code: "OPERATIONAL_CONTINUITY_RESILIENCE_WEAK",
            severity: "medium",
            message: "Operational continuity resilience is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.expansionFragilityScore >= 70
      ? [
          createCorridorWarning({
            code: "EXPANSION_FRAGILITY_HIGH",
            severity: "medium",
            message: "Expansion fragility is elevated and requires human review before expansion planning.",
            category: "development",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.corridorDependencyExposureScore >= 70
      ? [
          createCorridorWarning({
            code: "CORRIDOR_DEPENDENCY_EXPOSURE_HIGH",
            severity: "medium",
            message: "Corridor dependency exposure is elevated under current structured inputs.",
            category: "mixed",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.diversificationResilienceQualityScore < 45
      ? [
          createCorridorWarning({
            code: "DIVERSIFICATION_RESILIENCE_WEAK",
            severity: "medium",
            message: "Diversification resilience quality is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.enterpriseRiskDurabilityScore >= 72 && scoreBreakdown.dependencyConcentrationRiskScore >= 58
      ? [
          createCorridorWarning({
            code: "DURABILITY_WITH_DEPENDENCY_WATCHLIST",
            severity: "low",
            message: "Enterprise risk durability is strong, but dependency concentration remains on the review watchlist.",
            category: "institutional",
            requiresHumanReview: false,
          }),
        ]
      : []),
  ];
}

function buildAssumptions(input: EnterpriseRiskLayerInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0 ? ["Missing enterprise risk inputs were filled with conservative deterministic defaults or optional read-only intelligence-profile fallbacks."] : []),
    "Enterprise risk scoring is deterministic, explainable, read-only, compliance-first, and designed for human review before any execution.",
    "This engine evaluates operational resilience, dependency exposure, governance fragility, continuity resilience, diversification quality, institutional durability, and systemic survivability only.",
    "No legal systems, insurance systems, cybersecurity execution systems, external APIs, financial APIs, live rates, live market data, live portfolio systems, scraping, MLS integrations, county calls, demographic data, or protected-class data were used.",
    "This is not legal advice, insurance advice, investment advice, portfolio-management advice, market prediction, cybersecurity execution, autonomous mitigation, or execution authorization.",
  ]);
}

function buildExplainability(params: {
  scoreBreakdown: EnterpriseRiskLayerScoreBreakdown;
  classification: EnterpriseRiskDurabilityClassification;
  warnings: CorridorWarning[];
  missingData: string[];
  assumptions: string[];
}): EnterpriseRiskLayerExplainability {
  const scoreBreakdown = params.scoreBreakdown;
  const strengths = unique([
    ...(scoreBreakdown.enterpriseRiskDurabilityScore >= 70 ? ["Enterprise risk durability is strong."] : []),
    ...(scoreBreakdown.strategicSurvivabilityQualityScore >= 70 ? ["Strategic survivability quality is strong."] : []),
    ...(scoreBreakdown.operationalContinuityResilienceScore >= 70 ? ["Operational continuity resilience is strong."] : []),
    ...(scoreBreakdown.multiMarketExposureBalanceScore >= 70 ? ["Multi-market exposure balance is strong."] : []),
    ...(scoreBreakdown.diversificationResilienceQualityScore >= 70 ? ["Diversification resilience quality is strong."] : []),
    ...(scoreBreakdown.institutionalStabilityDurabilityScore >= 70 ? ["Institutional stability durability is strong."] : []),
    ...(scoreBreakdown.defensiveOperationalResilienceScore >= 70 ? ["Defensive operational resilience is strong."] : []),
    ...(scoreBreakdown.systemicSurvivabilityBalanceScore >= 70 ? ["Systemic survivability balance is strong."] : []),
  ]);
  const weaknesses = unique([
    ...(scoreBreakdown.enterpriseRiskDurabilityScore < 45 ? ["Enterprise risk durability is weak."] : []),
    ...(scoreBreakdown.operationalRiskExposureScore >= 66 ? ["Operational risk exposure is elevated."] : []),
    ...(scoreBreakdown.dependencyConcentrationRiskScore >= 66 ? ["Dependency concentration risk is elevated."] : []),
    ...(scoreBreakdown.governanceFragilityExposureScore >= 66 ? ["Governance fragility exposure is elevated."] : []),
    ...(scoreBreakdown.operationalContinuityResilienceScore < 45 ? ["Operational continuity resilience is weak."] : []),
    ...(scoreBreakdown.multiMarketExposureBalanceScore < 45 ? ["Multi-market exposure balance is weak."] : []),
    ...(scoreBreakdown.expansionFragilityScore >= 66 ? ["Expansion fragility is elevated."] : []),
    ...(scoreBreakdown.corridorDependencyExposureScore >= 66 ? ["Corridor dependency exposure is elevated."] : []),
    ...(scoreBreakdown.diversificationResilienceQualityScore < 45 ? ["Diversification resilience quality is weak."] : []),
    ...(scoreBreakdown.systemicSurvivabilityBalanceScore < 45 ? ["Systemic survivability balance is weak."] : []),
  ]);
  const risks = unique([
    ...(params.warnings.some((warning) => warning.severity === "high") ? ["High-severity enterprise risk warning requires manual review."] : []),
    ...(scoreBreakdown.operationalRiskExposureScore >= 70 ? ["Operational exposure may reduce enterprise continuity resilience."] : []),
    ...(scoreBreakdown.dependencyConcentrationRiskScore >= 70 ? ["Dependency concentration may reduce strategic survivability."] : []),
    ...(scoreBreakdown.governanceFragilityExposureScore >= 70 ? ["Governance fragility may reduce institutional durability; this is not legal advice."] : []),
    ...(scoreBreakdown.expansionFragilityScore >= 70 ? ["Expansion fragility may reduce controlled survivability during scaling."] : []),
    ...(scoreBreakdown.corridorDependencyExposureScore >= 70 ? ["Corridor dependency exposure may reduce multi-market resilience."] : []),
    ...(scoreBreakdown.systemicSurvivabilityBalanceScore < 45 ? ["Systemic survivability balance is weak under current structured inputs."] : []),
    ...(params.missingData.length > 0 ? `Missing data reduces confidence: ${params.missingData.slice(0, 4).join(", ")}.` : []),
  ]);

  return {
    summary: `Enterprise risk durability classification is ${params.classification} with a ${scoreBreakdown.enterpriseRiskDurabilityScore}/100 durability score and ${scoreBreakdown.operationalRiskExposureScore}/100 operational risk exposure score. This is deterministic read-only enterprise risk intelligence only and does not provide legal advice, insurance advice, investment advice, autonomous mitigation, execution logic, cybersecurity execution, or market prediction.`,
    strengths,
    weaknesses,
    risks,
    assumptions: params.assumptions,
  };
}

export function analyzeEnterpriseRiskLayer(input: EnterpriseRiskLayerInput = {}): EnterpriseRiskLayerResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const durabilityClassification = classifyEnterpriseRiskDurability(scoreBreakdown, warnings);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });
  const explainability = buildExplainability({
    scoreBreakdown,
    classification: durabilityClassification,
    warnings,
    missingData,
    assumptions,
  });

  return {
    enterpriseRiskDurability: scoreBreakdown.enterpriseRiskDurabilityScore,
    durabilityClassification,
    operationalRiskExposure: scoreBreakdown.operationalRiskExposureScore,
    dependencyConcentrationRisk: scoreBreakdown.dependencyConcentrationRiskScore,
    governanceFragilityExposure: scoreBreakdown.governanceFragilityExposureScore,
    strategicSurvivabilityQuality: scoreBreakdown.strategicSurvivabilityQualityScore,
    operationalContinuityResilience: scoreBreakdown.operationalContinuityResilienceScore,
    multiMarketExposureBalance: scoreBreakdown.multiMarketExposureBalanceScore,
    expansionFragility: scoreBreakdown.expansionFragilityScore,
    corridorDependencyExposure: scoreBreakdown.corridorDependencyExposureScore,
    diversificationResilienceQuality: scoreBreakdown.diversificationResilienceQualityScore,
    institutionalStabilityDurability: scoreBreakdown.institutionalStabilityDurabilityScore,
    defensiveOperationalResilience: scoreBreakdown.defensiveOperationalResilienceScore,
    systemicSurvivabilityBalance: scoreBreakdown.systemicSurvivabilityBalanceScore,
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
      autonomousMitigationAuthorized: false,
      databaseWriteAuthorized: false,
      externalDataUsed: false,
      financialApiUsed: false,
      liveMarketDataUsed: false,
      liveRatesUsed: false,
      livePortfolioSystemUsed: false,
      legalSystemUsed: false,
      insuranceSystemUsed: false,
      cybersecurityExecutionSystemUsed: false,
      scrapingUsed: false,
      mlsIntegrationUsed: false,
      countyCallUsed: false,
      demographicTargetingUsed: false,
      protectedClassLogicUsed: false,
      legalAdvice: false,
      insuranceAdvice: false,
      investmentAdvice: false,
      portfolioManagementAdvice: false,
      marketPrediction: false,
      cybersecurityExecutionBehavior: false,
    },
    readOnly: true,
  };
}

export const getEnterpriseRiskLayer = analyzeEnterpriseRiskLayer;
