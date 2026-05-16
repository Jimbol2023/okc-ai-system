import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type EnterpriseExpansionGovernanceClassification = "weak" | "exposed" | "controlled" | "durable" | "institutional_grade";

export type EnterpriseExpansionGovernanceInput = {
  governanceDurabilityScore?: number;
  expansionOversightScore?: number;
  strategicAccountabilityScore?: number;
  operationalGovernanceResilienceScore?: number;
  approvalProcessDurabilityScore?: number;
  multiMarketGovernanceStabilityScore?: number;
  expansionControlQualityScore?: number;
  diversificationGovernanceBalanceScore?: number;
  institutionalOversightReadinessScore?: number;
  humanReviewGovernanceAlignmentScore?: number;
  defensiveGovernanceResilienceScore?: number;
  crossMarketOperationalAccountabilityScore?: number;
  longHorizonWealthPreservationProfile?: unknown;
  strategicTerritoryDefenseProfile?: unknown;
  institutionalTerritoryProfile?: unknown;
  institutionalExpansionSequencingProfile?: unknown;
  portfolioRiskBalancingProfile?: unknown;
  corridorIntelligenceProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseExpansionGovernanceScoreBreakdown = CorridorScoreBreakdown & {
  enterpriseGovernanceQualityScore: number;
  governanceDurabilityScore: number;
  expansionOversightQualityScore: number;
  strategicAccountabilityDisciplineScore: number;
  operationalGovernanceResilienceScore: number;
  approvalProcessDurabilityScore: number;
  multiMarketGovernanceStabilityScore: number;
  expansionControlQualityScore: number;
  diversificationGovernanceBalanceScore: number;
  institutionalOversightReadinessScore: number;
  humanReviewGovernanceAlignmentScore: number;
  defensiveGovernanceResilienceScore: number;
  crossMarketOperationalAccountabilityScore: number;
};

export type EnterpriseExpansionGovernanceExplainability = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  assumptions: string[];
};

export type EnterpriseExpansionGovernanceResult = {
  enterpriseGovernanceQuality: number;
  enterpriseGovernanceClassification: EnterpriseExpansionGovernanceClassification;
  governanceDurability: number;
  expansionOversightQuality: number;
  strategicAccountabilityDiscipline: number;
  operationalGovernanceResilience: number;
  approvalProcessDurability: number;
  multiMarketGovernanceStability: number;
  expansionControlQuality: number;
  diversificationGovernanceBalance: number;
  institutionalOversightReadiness: number;
  humanReviewGovernanceAlignment: number;
  defensiveGovernanceResilience: number;
  crossMarketOperationalAccountability: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseExpansionGovernanceScoreBreakdown;
  explainability: EnterpriseExpansionGovernanceExplainability;
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
    autonomousApprovalSystemsUsed: false;
    approvalAutomationCreated: false;
    workflowMutationUsed: false;
    expansionDecisionAutomation: false;
    autonomousGovernanceLogic: false;
    legalAdvice: false;
    complianceAdvice: false;
    investmentAdvice: false;
    portfolioManagementAdvice: false;
    marketPrediction: false;
  };
  readOnly: true;
};

const REQUIRED_INPUTS: Array<keyof EnterpriseExpansionGovernanceInput> = [
  "governanceDurabilityScore",
  "expansionOversightScore",
  "strategicAccountabilityScore",
  "operationalGovernanceResilienceScore",
  "approvalProcessDurabilityScore",
  "multiMarketGovernanceStabilityScore",
  "expansionControlQualityScore",
  "diversificationGovernanceBalanceScore",
  "institutionalOversightReadinessScore",
  "humanReviewGovernanceAlignmentScore",
  "defensiveGovernanceResilienceScore",
  "crossMarketOperationalAccountabilityScore",
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

function hasFallbackForInput(input: EnterpriseExpansionGovernanceInput, key: keyof EnterpriseExpansionGovernanceInput) {
  const preservationProfile = input.longHorizonWealthPreservationProfile;
  const defenseProfile = input.strategicTerritoryDefenseProfile;
  const territoryProfile = input.institutionalTerritoryProfile;
  const sequencingProfile = input.institutionalExpansionSequencingProfile;
  const riskProfile = input.portfolioRiskBalancingProfile;
  const corridorProfile = input.corridorIntelligenceProfile;

  const fallbackPaths: Partial<Record<keyof EnterpriseExpansionGovernanceInput, boolean>> = {
    governanceDurabilityScore:
      hasProfileScore(preservationProfile, ["longHorizonPreservationQuality", "institutionalContinuityDurability"]) ||
      hasProfileScore(defenseProfile, ["institutionalStabilityProtection", "strategicTerritoryDefenseQuality"]),
    expansionOversightScore:
      hasProfileScore(sequencingProfile, ["phasedExpansionDiscipline", "institutionalScalingCadence"]) ||
      hasProfileScore(defenseProfile, ["defensiveExpansionDurability", "expansionSurvivabilityDefense"]),
    strategicAccountabilityScore:
      hasProfileScore(defenseProfile, ["operationalDefensibility", "institutionalStabilityProtection"]) ||
      hasProfileScore(preservationProfile, ["strategicPreservationStability"]),
    operationalGovernanceResilienceScore:
      hasProfileScore(preservationProfile, ["operationalContinuityProtection", "strategicSustainabilityResilience"]) ||
      hasProfileScore(territoryProfile, ["regionalOperationalCoherence"]),
    approvalProcessDurabilityScore:
      hasProfileScore(sequencingProfile, ["phasedExpansionDiscipline", "capitalAlignedExpansionPacing"]) ||
      hasProfileScore(defenseProfile, ["strategicFlexibilityDurability"]),
    multiMarketGovernanceStabilityScore:
      hasProfileScore(territoryProfile, ["multiMarketOperationalAlignment"]) ||
      hasProfileScore(preservationProfile, ["multiMarketSurvivabilityQuality"]),
    expansionControlQualityScore:
      hasProfileScore(sequencingProfile, ["expansionDependencyManagement", "phasedExpansionDiscipline"]) ||
      hasProfileScore(riskProfile, ["expansionRiskBalance", "correlationAdjustedRiskBalance"]),
    diversificationGovernanceBalanceScore:
      hasProfileScore(riskProfile, ["diversificationEffectiveness", "assetExposureBalance"]) ||
      hasProfileScore(preservationProfile, ["diversificationPreservationQuality"]),
    institutionalOversightReadinessScore:
      hasProfileScore(preservationProfile, ["institutionalContinuityDurability", "operationalContinuityProtection"]) ||
      hasProfileScore(territoryProfile, ["institutionalExpansionCompatibility"]),
    humanReviewGovernanceAlignmentScore:
      hasProfileScore(sequencingProfile, ["phasedExpansionDiscipline", "defensiveExpansionTiming"]) ||
      hasProfileScore(defenseProfile, ["institutionalStabilityProtection"]),
    defensiveGovernanceResilienceScore:
      hasProfileScore(defenseProfile, ["territoryResilience", "defensiveExpansionDurability"]) ||
      hasProfileScore(preservationProfile, ["defensiveSustainabilityBalance"]),
    crossMarketOperationalAccountabilityScore:
      hasProfileScore(territoryProfile, ["multiMarketOperationalAlignment", "regionalOperationalCoherence"]) ||
      hasProfileScore(corridorProfile, ["scoreBreakdown.connectivityScore", "scoreBreakdown.logisticsScore"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: EnterpriseExpansionGovernanceInput) {
  const labels: Record<keyof EnterpriseExpansionGovernanceInput, string> = {
    governanceDurabilityScore: "governance durability score",
    expansionOversightScore: "expansion oversight score",
    strategicAccountabilityScore: "strategic accountability score",
    operationalGovernanceResilienceScore: "operational governance resilience score",
    approvalProcessDurabilityScore: "approval-process durability score",
    multiMarketGovernanceStabilityScore: "multi-market governance stability score",
    expansionControlQualityScore: "expansion control quality score",
    diversificationGovernanceBalanceScore: "diversification governance balance score",
    institutionalOversightReadinessScore: "institutional oversight readiness score",
    humanReviewGovernanceAlignmentScore: "human-review governance alignment score",
    defensiveGovernanceResilienceScore: "defensive governance resilience score",
    crossMarketOperationalAccountabilityScore: "cross-market operational accountability score",
    longHorizonWealthPreservationProfile: "long-horizon wealth preservation profile",
    strategicTerritoryDefenseProfile: "strategic territory defense profile",
    institutionalTerritoryProfile: "institutional territory profile",
    institutionalExpansionSequencingProfile: "institutional expansion sequencing profile",
    portfolioRiskBalancingProfile: "portfolio risk-balancing profile",
    corridorIntelligenceProfile: "corridor intelligence profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: EnterpriseExpansionGovernanceInput): EnterpriseExpansionGovernanceScoreBreakdown {
  const preservationProfile = input.longHorizonWealthPreservationProfile;
  const defenseProfile = input.strategicTerritoryDefenseProfile;
  const territoryProfile = input.institutionalTerritoryProfile;
  const sequencingProfile = input.institutionalExpansionSequencingProfile;
  const riskProfile = input.portfolioRiskBalancingProfile;
  const corridorProfile = input.corridorIntelligenceProfile;
  const diversificationGovernanceBalanceScore = getScore(
    input.diversificationGovernanceBalanceScore,
    weightedAverage([
      [extractProfileScore(riskProfile, ["diversificationEffectiveness", "scoreBreakdown.diversificationEffectivenessScore"], 54), 0.24],
      [extractProfileScore(riskProfile, ["assetExposureBalance", "scoreBreakdown.assetExposureBalanceScore"], 54), 0.18],
      [extractProfileScore(preservationProfile, ["diversificationPreservationQuality", "scoreBreakdown.diversificationPreservationQualityScore"], 54), 0.2],
      [extractProfileScore(defenseProfile, ["diversificationProtectionQuality", "scoreBreakdown.diversificationProtectionQualityScore"], 54), 0.18],
      [extractProfileScore(territoryProfile, ["diversificationAwareTerritoryStability"], 54), 0.1],
      [extractProfileScore(sequencingProfile, ["diversificationAwareExpansionQuality"], 54), 0.1],
    ]),
  );
  const expansionControlQualityScore = getScore(
    input.expansionControlQualityScore,
    weightedAverage([
      [extractProfileScore(sequencingProfile, ["expansionDependencyManagement", "scoreBreakdown.expansionDependencyManagementScore"], 54), 0.22],
      [extractProfileScore(sequencingProfile, ["phasedExpansionDiscipline", "scoreBreakdown.phasedExpansionDisciplineScore"], 54), 0.22],
      [extractProfileScore(riskProfile, ["expansionRiskBalance", "scoreBreakdown.expansionRiskBalanceScore"], 54), 0.18],
      [extractProfileScore(riskProfile, ["correlationAdjustedRiskBalance", "scoreBreakdown.correlationAdjustedRiskBalanceScore"], 54), 0.14],
      [diversificationGovernanceBalanceScore, 0.12],
      [extractProfileScore(defenseProfile, ["defensiveExpansionDurability"], 54), 0.12],
    ]),
  );
  const approvalProcessDurabilityScore = getScore(
    input.approvalProcessDurabilityScore,
    weightedAverage([
      [extractProfileScore(sequencingProfile, ["phasedExpansionDiscipline", "scoreBreakdown.phasedExpansionDisciplineScore"], 54), 0.26],
      [extractProfileScore(sequencingProfile, ["capitalAlignedExpansionPacing", "scoreBreakdown.capitalAlignedExpansionPacingScore"], 54), 0.18],
      [extractProfileScore(defenseProfile, ["strategicFlexibilityDurability", "scoreBreakdown.strategicFlexibilityDurabilityScore"], 54), 0.16],
      [expansionControlQualityScore, 0.14],
      [diversificationGovernanceBalanceScore, 0.1],
      [extractProfileScore(preservationProfile, ["strategicPreservationStability"], 54), 0.08],
      [extractProfileScore(corridorProfile, ["scoreBreakdown.durabilityScore"], 54), 0.08],
    ]),
  );
  const humanReviewGovernanceAlignmentScore = getScore(
    input.humanReviewGovernanceAlignmentScore,
    weightedAverage([
      [approvalProcessDurabilityScore, 0.24],
      [extractProfileScore(sequencingProfile, ["defensiveExpansionTiming", "scoreBreakdown.defensiveExpansionTimingScore"], 54), 0.18],
      [extractProfileScore(defenseProfile, ["institutionalStabilityProtection", "scoreBreakdown.institutionalStabilityProtectionScore"], 54), 0.18],
      [expansionControlQualityScore, 0.16],
      [extractProfileScore(preservationProfile, ["operationalContinuityProtection", "strategicPreservationStability"], 54), 0.12],
      [diversificationGovernanceBalanceScore, 0.12],
    ]),
  );
  const crossMarketOperationalAccountabilityScore = getScore(
    input.crossMarketOperationalAccountabilityScore,
    weightedAverage([
      [extractProfileScore(territoryProfile, ["multiMarketOperationalAlignment", "scoreBreakdown.multiMarketOperationalAlignmentScore"], 54), 0.24],
      [extractProfileScore(territoryProfile, ["regionalOperationalCoherence", "scoreBreakdown.regionalOperationalCoherenceScore"], 54), 0.2],
      [extractProfileScore(corridorProfile, ["scoreBreakdown.connectivityScore", "scoreBreakdown.logisticsScore"], 54), 0.16],
      [extractProfileScore(sequencingProfile, ["multiMarketPacingQuality", "institutionalScalingCadence"], 54), 0.14],
      [approvalProcessDurabilityScore, 0.12],
      [humanReviewGovernanceAlignmentScore, 0.08],
      [diversificationGovernanceBalanceScore, 0.06],
    ]),
  );
  const operationalGovernanceResilienceScore = getScore(
    input.operationalGovernanceResilienceScore,
    weightedAverage([
      [extractProfileScore(preservationProfile, ["operationalContinuityProtection", "scoreBreakdown.operationalContinuityProtectionScore"], 54), 0.24],
      [extractProfileScore(preservationProfile, ["strategicSustainabilityResilience", "scoreBreakdown.strategicSustainabilityResilienceScore"], 54), 0.16],
      [extractProfileScore(territoryProfile, ["regionalOperationalCoherence", "scoreBreakdown.regionalOperationalCoherenceScore"], 54), 0.18],
      [crossMarketOperationalAccountabilityScore, 0.14],
      [humanReviewGovernanceAlignmentScore, 0.12],
      [approvalProcessDurabilityScore, 0.08],
      [expansionControlQualityScore, 0.08],
    ]),
  );
  const multiMarketGovernanceStabilityScore = getScore(
    input.multiMarketGovernanceStabilityScore,
    weightedAverage([
      [extractProfileScore(territoryProfile, ["multiMarketOperationalAlignment", "scoreBreakdown.multiMarketOperationalAlignmentScore"], 54), 0.22],
      [extractProfileScore(preservationProfile, ["multiMarketSurvivabilityQuality", "scoreBreakdown.multiMarketSurvivabilityQualityScore"], 54), 0.18],
      [extractProfileScore(defenseProfile, ["multiMarketRedundancyStrength", "scoreBreakdown.multiMarketRedundancyStrengthScore"], 54), 0.16],
      [crossMarketOperationalAccountabilityScore, 0.14],
      [diversificationGovernanceBalanceScore, 0.12],
      [operationalGovernanceResilienceScore, 0.1],
      [extractProfileScore(sequencingProfile, ["strategicRolloutResilience"], 54), 0.08],
    ]),
  );
  const institutionalOversightReadinessScore = getScore(
    input.institutionalOversightReadinessScore,
    weightedAverage([
      [extractProfileScore(preservationProfile, ["institutionalContinuityDurability", "scoreBreakdown.institutionalContinuityDurabilityScore"], 54), 0.22],
      [extractProfileScore(territoryProfile, ["institutionalExpansionCompatibility", "scoreBreakdown.institutionalExpansionCompatibilityScore"], 54), 0.16],
      [extractProfileScore(defenseProfile, ["institutionalStabilityProtection", "scoreBreakdown.institutionalStabilityProtectionScore"], 54), 0.16],
      [humanReviewGovernanceAlignmentScore, 0.14],
      [operationalGovernanceResilienceScore, 0.12],
      [approvalProcessDurabilityScore, 0.1],
      [multiMarketGovernanceStabilityScore, 0.1],
    ]),
  );
  const expansionOversightQualityScore = getScore(
    input.expansionOversightScore,
    weightedAverage([
      [expansionControlQualityScore, 0.2],
      [approvalProcessDurabilityScore, 0.16],
      [humanReviewGovernanceAlignmentScore, 0.14],
      [extractProfileScore(sequencingProfile, ["institutionalScalingCadence", "scoreBreakdown.institutionalScalingCadenceScore"], 54), 0.14],
      [extractProfileScore(sequencingProfile, ["phasedExpansionDiscipline"], 54), 0.12],
      [extractProfileScore(defenseProfile, ["defensiveExpansionDurability", "expansionSurvivabilityDefense"], 54), 0.12],
      [institutionalOversightReadinessScore, 0.12],
    ]),
  );
  const strategicAccountabilityDisciplineScore = getScore(
    input.strategicAccountabilityScore,
    weightedAverage([
      [humanReviewGovernanceAlignmentScore, 0.2],
      [operationalGovernanceResilienceScore, 0.16],
      [institutionalOversightReadinessScore, 0.14],
      [crossMarketOperationalAccountabilityScore, 0.14],
      [extractProfileScore(defenseProfile, ["operationalDefensibility", "institutionalStabilityProtection"], 54), 0.14],
      [extractProfileScore(preservationProfile, ["strategicPreservationStability", "scoreBreakdown.strategicPreservationStabilityScore"], 54), 0.12],
      [expansionControlQualityScore, 0.1],
    ]),
  );
  const defensiveGovernanceResilienceScore = getScore(
    input.defensiveGovernanceResilienceScore,
    weightedAverage([
      [extractProfileScore(defenseProfile, ["territoryResilience", "scoreBreakdown.territoryResilienceScore"], 54), 0.18],
      [extractProfileScore(defenseProfile, ["defensiveExpansionDurability", "scoreBreakdown.defensiveExpansionDurabilityScore"], 54), 0.16],
      [extractProfileScore(preservationProfile, ["defensiveSustainabilityBalance", "scoreBreakdown.defensiveSustainabilityBalanceScore"], 54), 0.16],
      [operationalGovernanceResilienceScore, 0.14],
      [institutionalOversightReadinessScore, 0.12],
      [humanReviewGovernanceAlignmentScore, 0.12],
      [diversificationGovernanceBalanceScore, 0.12],
    ]),
  );
  const governanceDurabilityScore = getScore(
    input.governanceDurabilityScore,
    weightedAverage([
      [expansionOversightQualityScore, 0.11],
      [strategicAccountabilityDisciplineScore, 0.11],
      [operationalGovernanceResilienceScore, 0.11],
      [approvalProcessDurabilityScore, 0.1],
      [multiMarketGovernanceStabilityScore, 0.1],
      [expansionControlQualityScore, 0.09],
      [diversificationGovernanceBalanceScore, 0.08],
      [institutionalOversightReadinessScore, 0.1],
      [humanReviewGovernanceAlignmentScore, 0.1],
      [defensiveGovernanceResilienceScore, 0.06],
      [crossMarketOperationalAccountabilityScore, 0.04],
    ]),
  );
  const enterpriseGovernanceQualityScore = weightedAverage([
    [governanceDurabilityScore, 0.12],
    [expansionOversightQualityScore, 0.1],
    [strategicAccountabilityDisciplineScore, 0.1],
    [operationalGovernanceResilienceScore, 0.1],
    [approvalProcessDurabilityScore, 0.09],
    [multiMarketGovernanceStabilityScore, 0.09],
    [expansionControlQualityScore, 0.09],
    [diversificationGovernanceBalanceScore, 0.08],
    [institutionalOversightReadinessScore, 0.09],
    [humanReviewGovernanceAlignmentScore, 0.08],
    [defensiveGovernanceResilienceScore, 0.04],
    [crossMarketOperationalAccountabilityScore, 0.02],
  ]);

  return {
    connectivityScore: crossMarketOperationalAccountabilityScore,
    durabilityScore: governanceDurabilityScore,
    expansionScore: expansionOversightQualityScore,
    institutionalScore: institutionalOversightReadinessScore,
    logisticsScore: operationalGovernanceResilienceScore,
    luxuryScore: strategicAccountabilityDisciplineScore,
    developmentScore: expansionControlQualityScore,
    enterpriseGovernanceQualityScore,
    governanceDurabilityScore,
    expansionOversightQualityScore,
    strategicAccountabilityDisciplineScore,
    operationalGovernanceResilienceScore,
    approvalProcessDurabilityScore,
    multiMarketGovernanceStabilityScore,
    expansionControlQualityScore,
    diversificationGovernanceBalanceScore,
    institutionalOversightReadinessScore,
    humanReviewGovernanceAlignmentScore,
    defensiveGovernanceResilienceScore,
    crossMarketOperationalAccountabilityScore,
  };
}

function classifyEnterpriseGovernance(
  scoreBreakdown: EnterpriseExpansionGovernanceScoreBreakdown,
  warnings: CorridorWarning[],
): EnterpriseExpansionGovernanceClassification {
  if (warnings.some((warning) => warning.severity === "high") || scoreBreakdown.enterpriseGovernanceQualityScore < 42) return "weak";
  if (scoreBreakdown.humanReviewGovernanceAlignmentScore < 48 || scoreBreakdown.expansionControlQualityScore < 48) return "exposed";
  if (
    scoreBreakdown.enterpriseGovernanceQualityScore >= 82 &&
    scoreBreakdown.governanceDurabilityScore >= 74 &&
    scoreBreakdown.institutionalOversightReadinessScore >= 70
  ) {
    return "institutional_grade";
  }
  if (scoreBreakdown.enterpriseGovernanceQualityScore >= 68 && scoreBreakdown.operationalGovernanceResilienceScore >= 62) return "durable";

  return "controlled";
}

function buildWarnings(scoreBreakdown: EnterpriseExpansionGovernanceScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "ENTERPRISE_GOVERNANCE_DATA_INCOMPLETE",
            severity: missingData.length >= 6 ? "high" : "medium",
            message: "Enterprise expansion governance assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.enterpriseGovernanceQualityScore < 42
      ? [
          createCorridorWarning({
            code: "ENTERPRISE_GOVERNANCE_QUALITY_WEAK",
            severity: "high",
            message: "Enterprise governance quality is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.humanReviewGovernanceAlignmentScore < 45
      ? [
          createCorridorWarning({
            code: "HUMAN_REVIEW_GOVERNANCE_ALIGNMENT_WEAK",
            severity: "high",
            message: "Human-review governance alignment is weak; this engine does not automate approvals.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.expansionControlQualityScore < 45
      ? [
          createCorridorWarning({
            code: "EXPANSION_CONTROL_QUALITY_WEAK",
            severity: "medium",
            message: "Expansion control quality is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.approvalProcessDurabilityScore < 45
      ? [
          createCorridorWarning({
            code: "APPROVAL_PROCESS_DURABILITY_WEAK",
            severity: "medium",
            message: "Approval-process durability is weak; this is a review flag, not approval automation.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.operationalGovernanceResilienceScore < 45
      ? [
          createCorridorWarning({
            code: "OPERATIONAL_GOVERNANCE_RESILIENCE_WEAK",
            severity: "medium",
            message: "Operational governance resilience is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.enterpriseGovernanceQualityScore >= 72 && scoreBreakdown.diversificationGovernanceBalanceScore < 56
      ? [
          createCorridorWarning({
            code: "GOVERNANCE_QUALITY_WITH_DIVERSIFICATION_WATCHLIST",
            severity: "low",
            message: "Enterprise governance quality is strong, but diversification governance remains on the review watchlist.",
            category: "institutional",
            requiresHumanReview: false,
          }),
        ]
      : []),
  ];
}

function buildAssumptions(input: EnterpriseExpansionGovernanceInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0 ? ["Missing enterprise expansion governance inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."] : []),
    "Enterprise expansion governance scoring is deterministic, explainable, read-only, compliance-first, and designed for human review before any execution.",
    "This engine evaluates governance durability, oversight quality, accountability, control discipline, and review alignment only.",
    "No autonomous approval systems, execution systems, workflow mutation systems, legal/compliance systems, financial APIs, live market systems, prediction systems, demographic data, or protected-class data were used.",
    "This is not legal advice, compliance advice, investment advice, portfolio-management advice, market prediction, approval automation, governance automation, or expansion authorization.",
  ]);
}

function buildExplainability(params: {
  scoreBreakdown: EnterpriseExpansionGovernanceScoreBreakdown;
  classification: EnterpriseExpansionGovernanceClassification;
  warnings: CorridorWarning[];
  missingData: string[];
  assumptions: string[];
}): EnterpriseExpansionGovernanceExplainability {
  const scoreBreakdown = params.scoreBreakdown;
  const strengths = unique([
    ...(scoreBreakdown.governanceDurabilityScore >= 70 ? ["Governance durability is strong."] : []),
    ...(scoreBreakdown.expansionOversightQualityScore >= 70 ? ["Expansion oversight quality is strong."] : []),
    ...(scoreBreakdown.strategicAccountabilityDisciplineScore >= 70 ? ["Strategic accountability discipline is strong."] : []),
    ...(scoreBreakdown.operationalGovernanceResilienceScore >= 70 ? ["Operational governance resilience is strong."] : []),
    ...(scoreBreakdown.approvalProcessDurabilityScore >= 70 ? ["Approval-process durability is strong."] : []),
    ...(scoreBreakdown.institutionalOversightReadinessScore >= 70 ? ["Institutional oversight readiness is strong."] : []),
    ...(scoreBreakdown.humanReviewGovernanceAlignmentScore >= 70 ? ["Human-review governance alignment is strong."] : []),
    ...(scoreBreakdown.crossMarketOperationalAccountabilityScore >= 70 ? ["Cross-market operational accountability is strong."] : []),
  ]);
  const weaknesses = unique([
    ...(scoreBreakdown.governanceDurabilityScore < 45 ? ["Governance durability is weak."] : []),
    ...(scoreBreakdown.expansionOversightQualityScore < 45 ? ["Expansion oversight quality is weak."] : []),
    ...(scoreBreakdown.strategicAccountabilityDisciplineScore < 45 ? ["Strategic accountability discipline is weak."] : []),
    ...(scoreBreakdown.operationalGovernanceResilienceScore < 45 ? ["Operational governance resilience is weak."] : []),
    ...(scoreBreakdown.approvalProcessDurabilityScore < 45 ? ["Approval-process durability is weak."] : []),
    ...(scoreBreakdown.expansionControlQualityScore < 45 ? ["Expansion control quality is weak."] : []),
    ...(scoreBreakdown.humanReviewGovernanceAlignmentScore < 45 ? ["Human-review governance alignment is weak."] : []),
    ...(scoreBreakdown.crossMarketOperationalAccountabilityScore < 45 ? ["Cross-market operational accountability is weak."] : []),
  ]);
  const risks = unique([
    ...(params.warnings.some((warning) => warning.severity === "high") ? ["High-severity enterprise governance warning requires manual review."] : []),
    ...(scoreBreakdown.enterpriseGovernanceQualityScore < 50 ? ["Enterprise governance quality is weak under current structured inputs."] : []),
    ...(scoreBreakdown.humanReviewGovernanceAlignmentScore < 45 ? ["Human-review governance alignment may be insufficient; no approval automation is performed."] : []),
    ...(scoreBreakdown.expansionControlQualityScore < 45 ? ["Expansion control quality may limit governance durability."] : []),
    ...(scoreBreakdown.approvalProcessDurabilityScore < 45 ? ["Approval-process durability may require human process review."] : []),
    ...(params.missingData.length > 0 ? `Missing data reduces confidence: ${params.missingData.slice(0, 4).join(", ")}.` : []),
  ]);

  return {
    summary: `Enterprise expansion governance classification is ${params.classification} with a ${scoreBreakdown.enterpriseGovernanceQualityScore}/100 governance quality score and ${scoreBreakdown.governanceDurabilityScore}/100 governance durability score. This is deterministic read-only governance intelligence only and does not automate approvals, mutate workflows, provide legal/compliance advice, predict markets, or authorize expansion.`,
    strengths,
    weaknesses,
    risks,
    assumptions: params.assumptions,
  };
}

export function analyzeEnterpriseExpansionGovernanceIntelligence(input: EnterpriseExpansionGovernanceInput = {}): EnterpriseExpansionGovernanceResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const enterpriseGovernanceClassification = classifyEnterpriseGovernance(scoreBreakdown, warnings);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });
  const explainability = buildExplainability({
    scoreBreakdown,
    classification: enterpriseGovernanceClassification,
    warnings,
    missingData,
    assumptions,
  });

  return {
    enterpriseGovernanceQuality: scoreBreakdown.enterpriseGovernanceQualityScore,
    enterpriseGovernanceClassification,
    governanceDurability: scoreBreakdown.governanceDurabilityScore,
    expansionOversightQuality: scoreBreakdown.expansionOversightQualityScore,
    strategicAccountabilityDiscipline: scoreBreakdown.strategicAccountabilityDisciplineScore,
    operationalGovernanceResilience: scoreBreakdown.operationalGovernanceResilienceScore,
    approvalProcessDurability: scoreBreakdown.approvalProcessDurabilityScore,
    multiMarketGovernanceStability: scoreBreakdown.multiMarketGovernanceStabilityScore,
    expansionControlQuality: scoreBreakdown.expansionControlQualityScore,
    diversificationGovernanceBalance: scoreBreakdown.diversificationGovernanceBalanceScore,
    institutionalOversightReadiness: scoreBreakdown.institutionalOversightReadinessScore,
    humanReviewGovernanceAlignment: scoreBreakdown.humanReviewGovernanceAlignmentScore,
    defensiveGovernanceResilience: scoreBreakdown.defensiveGovernanceResilienceScore,
    crossMarketOperationalAccountability: scoreBreakdown.crossMarketOperationalAccountabilityScore,
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
      autonomousApprovalSystemsUsed: false,
      approvalAutomationCreated: false,
      workflowMutationUsed: false,
      expansionDecisionAutomation: false,
      autonomousGovernanceLogic: false,
      legalAdvice: false,
      complianceAdvice: false,
      investmentAdvice: false,
      portfolioManagementAdvice: false,
      marketPrediction: false,
    },
    readOnly: true,
  };
}

export const getEnterpriseExpansionGovernanceIntelligence = analyzeEnterpriseExpansionGovernanceIntelligence;
