import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type StrategicRenewalLevel = "stagnant" | "fragile" | "developing" | "adaptive" | "institutional";

export type EnterpriseStrategicRenewalInput = {
  adaptationReadinessScore?: number;
  doctrineEvolutionScore?: number;
  innovationBalanceScore?: number;
  stagnationRiskScore?: number;
  longHorizonRenewalScore?: number;
  expansionAdaptationScore?: number;
  governanceAdaptationScore?: number;
  marketRelevanceScore?: number;
  organizationalEvolutionScore?: number;
  strategicRenewalMaturityScore?: number;
  enterpriseStrategicReviewProfile?: unknown;
  enterpriseInstitutionalLearningProfile?: unknown;
  enterpriseStrategicDoctrineProfile?: unknown;
  enterpriseStrategicMemoryProfile?: unknown;
  enterpriseInstitutionalCohesionProfile?: unknown;
  enterpriseStrategicConsistencyProfile?: unknown;
  enterpriseExpansionGovernanceProfile?: unknown;
  processOptimizationProfile?: unknown;
  portfolioRiskBalancingProfile?: unknown;
  longHorizonWealthPreservationProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseStrategicRenewalScoreBreakdown = CorridorScoreBreakdown & {
  overallRenewalScore: number;
  adaptationReadinessScore: number;
  doctrineEvolutionScore: number;
  innovationBalanceScore: number;
  stagnationRiskScore: number;
  longHorizonRenewalScore: number;
  expansionAdaptationScore: number;
  governanceAdaptationScore: number;
  marketRelevanceScore: number;
  organizationalEvolutionScore: number;
  strategicRenewalMaturityScore: number;
};

export type EnterpriseStrategicRenewalResult = {
  overallRenewalScore: number;
  strategicRenewalLevel: StrategicRenewalLevel;
  adaptationReadinessScore: number;
  doctrineEvolutionScore: number;
  innovationBalanceScore: number;
  stagnationRiskScore: number;
  longHorizonRenewalScore: number;
  expansionAdaptationScore: number;
  governanceAdaptationScore: number;
  marketRelevanceScore: number;
  organizationalEvolutionScore: number;
  strategicRenewalMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseStrategicRenewalScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  renewalWarnings: string[];
  reusableInfrastructureNotes: string[];
  explanation: string[];
  trace: string[];
  warnings: CorridorWarning[];
  missingData: string[];
  assumptions: string[];
  safety: {
    readOnly: true;
    outreachAuthorized: false;
    smsAuthorized: false;
    emailAuthorized: false;
    twilioUsed: false;
    executionAuthorized: false;
    databaseWriteAuthorized: false;
    schemaMutationUsed: false;
    workflowMutationUsed: false;
    automationExecutionUsed: false;
    autonomousStrategyDecisions: false;
    autonomousRenewalActions: false;
    autonomousOptimizationActions: false;
    autonomousManagementDecisions: false;
    legalAdvice: false;
    hrAdvice: false;
    ownershipAdvice: false;
    taxAdvice: false;
    lendingAdvice: false;
    investmentAdvice: false;
    portfolioManagementAdvice: false;
    demographicTargetingUsed: false;
    protectedClassLogicUsed: false;
    externalDataUsed: false;
    scrapingUsed: false;
    marketPrediction: false;
  };
  readOnly: true;
};

const REQUIRED_INPUTS: Array<keyof EnterpriseStrategicRenewalInput> = [
  "adaptationReadinessScore",
  "doctrineEvolutionScore",
  "innovationBalanceScore",
  "stagnationRiskScore",
  "longHorizonRenewalScore",
  "expansionAdaptationScore",
  "governanceAdaptationScore",
  "marketRelevanceScore",
  "organizationalEvolutionScore",
  "strategicRenewalMaturityScore",
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

function hasFallbackForInput(input: EnterpriseStrategicRenewalInput, key: keyof EnterpriseStrategicRenewalInput) {
  const reviewProfile = input.enterpriseStrategicReviewProfile;
  const learningProfile = input.enterpriseInstitutionalLearningProfile;
  const doctrineProfile = input.enterpriseStrategicDoctrineProfile;
  const memoryProfile = input.enterpriseStrategicMemoryProfile;
  const cohesionProfile = input.enterpriseInstitutionalCohesionProfile;
  const consistencyProfile = input.enterpriseStrategicConsistencyProfile;
  const expansionProfile = input.enterpriseExpansionGovernanceProfile;
  const optimizationProfile = input.processOptimizationProfile;
  const preservationProfile = input.longHorizonWealthPreservationProfile;

  const fallbackPaths: Partial<Record<keyof EnterpriseStrategicRenewalInput, boolean>> = {
    adaptationReadinessScore:
      hasProfileScore(reviewProfile, ["strategicAdaptationScore", "overallStrategicReviewScore"]) ||
      hasProfileScore(learningProfile, ["processImprovementLearningScore", "continuousLearningMaturityScore"]),
    doctrineEvolutionScore:
      hasProfileScore(reviewProfile, ["doctrineReviewCadenceScore"]) ||
      hasProfileScore(doctrineProfile, ["doctrineTransferabilityScore", "overallDoctrineScore"]) ||
      hasProfileScore(memoryProfile, ["doctrinePreservationScore"]),
    innovationBalanceScore:
      hasProfileScore(optimizationProfile, ["continuousImprovementReadinessScore", "overallOptimizationScore"]) ||
      hasProfileScore(consistencyProfile, ["overallConsistencyScore"]) ||
      hasProfileScore(preservationProfile, ["longHorizonPreservationQuality"]),
    stagnationRiskScore:
      hasProfileScore(optimizationProfile, ["frictionRiskScore", "scalabilityBottleneckScore"]) ||
      hasProfileScore(cohesionProfile, ["fragmentationRiskScore"]) ||
      hasProfileScore(learningProfile, ["continuousLearningMaturityScore"]),
    longHorizonRenewalScore:
      hasProfileScore(reviewProfile, ["longHorizonReviewScore"]) ||
      hasProfileScore(preservationProfile, ["longHorizonPreservationQuality", "institutionalContinuityDurability"]) ||
      hasProfileScore(memoryProfile, ["longHorizonContinuityScore"]),
    expansionAdaptationScore:
      hasProfileScore(reviewProfile, ["expansionReassessmentScore"]) ||
      hasProfileScore(expansionProfile, ["expansionControlQuality", "expansionOversightQuality"]) ||
      hasProfileScore(consistencyProfile, ["expansionConsistencyScore"]),
    governanceAdaptationScore:
      hasProfileScore(reviewProfile, ["governanceReviewScore"]) ||
      hasProfileScore(learningProfile, ["governanceLearningScore"]) ||
      hasProfileScore(expansionProfile, ["humanReviewGovernanceAlignment"]),
    marketRelevanceScore:
      hasProfileScore(doctrineProfile, ["brandTrustDoctrineScore", "strategicPrincipleScore"]) ||
      hasProfileScore(cohesionProfile, ["institutionalIdentityScore", "communicationCohesionScore"]) ||
      hasProfileScore(learningProfile, ["responseLearningScore"]),
    organizationalEvolutionScore:
      hasProfileScore(cohesionProfile, ["overallCohesionScore", "scalingCoherenceScore"]) ||
      hasProfileScore(learningProfile, ["continuousLearningMaturityScore"]) ||
      hasProfileScore(reviewProfile, ["institutionalReassessmentScore"]),
    strategicRenewalMaturityScore:
      hasProfileScore(reviewProfile, ["strategicReviewMaturityScore", "overallStrategicReviewScore"]) ||
      hasProfileScore(learningProfile, ["overallLearningScore"]) ||
      hasProfileScore(preservationProfile, ["longHorizonPreservationQuality"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: EnterpriseStrategicRenewalInput) {
  const labels: Record<keyof EnterpriseStrategicRenewalInput, string> = {
    adaptationReadinessScore: "strategic adaptation readiness score",
    doctrineEvolutionScore: "doctrine evolution discipline score",
    innovationBalanceScore: "innovation-vs-stability balance score",
    stagnationRiskScore: "institutional stagnation risk score",
    longHorizonRenewalScore: "long-horizon renewal capability score",
    expansionAdaptationScore: "expansion adaptation maturity score",
    governanceAdaptationScore: "governance adaptation discipline score",
    marketRelevanceScore: "market relevance durability score",
    organizationalEvolutionScore: "organizational evolution maturity score",
    strategicRenewalMaturityScore: "strategic renewal maturity score",
    enterpriseStrategicReviewProfile: "enterprise strategic review profile",
    enterpriseInstitutionalLearningProfile: "enterprise institutional learning profile",
    enterpriseStrategicDoctrineProfile: "enterprise strategic doctrine profile",
    enterpriseStrategicMemoryProfile: "enterprise strategic memory profile",
    enterpriseInstitutionalCohesionProfile: "enterprise institutional cohesion profile",
    enterpriseStrategicConsistencyProfile: "enterprise strategic consistency profile",
    enterpriseExpansionGovernanceProfile: "enterprise expansion governance profile",
    processOptimizationProfile: "process optimization profile",
    portfolioRiskBalancingProfile: "portfolio risk balancing profile",
    longHorizonWealthPreservationProfile: "long-horizon wealth preservation profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: EnterpriseStrategicRenewalInput): EnterpriseStrategicRenewalScoreBreakdown {
  const reviewProfile = input.enterpriseStrategicReviewProfile;
  const learningProfile = input.enterpriseInstitutionalLearningProfile;
  const doctrineProfile = input.enterpriseStrategicDoctrineProfile;
  const memoryProfile = input.enterpriseStrategicMemoryProfile;
  const cohesionProfile = input.enterpriseInstitutionalCohesionProfile;
  const consistencyProfile = input.enterpriseStrategicConsistencyProfile;
  const expansionProfile = input.enterpriseExpansionGovernanceProfile;
  const optimizationProfile = input.processOptimizationProfile;
  const preservationProfile = input.longHorizonWealthPreservationProfile;
  const adaptationReadinessScore = getScore(
    input.adaptationReadinessScore,
    weightedAverage([
      [extractProfileScore(reviewProfile, ["strategicAdaptationScore", "scoreBreakdown.strategicAdaptationScore"], 54), 0.22],
      [extractProfileScore(learningProfile, ["processImprovementLearningScore", "scoreBreakdown.processImprovementLearningScore"], 54), 0.18],
      [extractProfileScore(learningProfile, ["continuousLearningMaturityScore", "scoreBreakdown.continuousLearningMaturityScore"], 54), 0.16],
      [extractProfileScore(reviewProfile, ["reassessmentDisciplineScore"], 54), 0.12],
      [extractProfileScore(optimizationProfile, ["continuousImprovementReadinessScore"], 54), 0.12],
      [extractProfileScore(consistencyProfile, ["overallConsistencyScore"], 54), 0.1],
      [extractProfileScore(reviewProfile, ["overallStrategicReviewScore"], 54), 0.1],
    ]),
  );
  const doctrineEvolutionScore = getScore(
    input.doctrineEvolutionScore,
    weightedAverage([
      [extractProfileScore(reviewProfile, ["doctrineReviewCadenceScore", "scoreBreakdown.doctrineReviewCadenceScore"], 54), 0.2],
      [extractProfileScore(doctrineProfile, ["doctrineTransferabilityScore", "scoreBreakdown.doctrineTransferabilityScore"], 54), 0.16],
      [extractProfileScore(doctrineProfile, ["overallDoctrineScore", "scoreBreakdown.overallDoctrineScore"], 54), 0.14],
      [extractProfileScore(memoryProfile, ["doctrinePreservationScore", "scoreBreakdown.doctrinePreservationScore"], 54), 0.14],
      [adaptationReadinessScore, 0.12],
      [extractProfileScore(learningProfile, ["memoryReinforcementScore"], 54), 0.1],
      [extractProfileScore(reviewProfile, ["governanceReviewScore"], 54), 0.08],
      [extractProfileScore(cohesionProfile, ["institutionalIdentityScore"], 54), 0.06],
    ]),
  );
  const innovationBalanceScore = getScore(
    input.innovationBalanceScore,
    weightedAverage([
      [adaptationReadinessScore, 0.16],
      [doctrineEvolutionScore, 0.12],
      [extractProfileScore(optimizationProfile, ["continuousImprovementReadinessScore", "scoreBreakdown.continuousImprovementReadinessScore"], 54), 0.16],
      [extractProfileScore(optimizationProfile, ["overallOptimizationScore", "scoreBreakdown.overallOptimizationScore"], 54), 0.12],
      [extractProfileScore(consistencyProfile, ["overallConsistencyScore"], 54), 0.12],
      [extractProfileScore(preservationProfile, ["longHorizonPreservationQuality"], 54), 0.12],
      [extractProfileScore(reviewProfile, ["longHorizonReviewScore"], 54), 0.1],
      [extractProfileScore(cohesionProfile, ["fragmentationRiskScore"], 48) <= 45 ? 70 : 48, 0.1],
    ]),
  );
  const governanceAdaptationScore = getScore(
    input.governanceAdaptationScore,
    weightedAverage([
      [extractProfileScore(reviewProfile, ["governanceReviewScore", "scoreBreakdown.governanceReviewScore"], 54), 0.2],
      [extractProfileScore(learningProfile, ["governanceLearningScore", "scoreBreakdown.governanceLearningScore"], 54), 0.18],
      [extractProfileScore(expansionProfile, ["humanReviewGovernanceAlignment", "scoreBreakdown.humanReviewGovernanceAlignmentScore"], 54), 0.16],
      [extractProfileScore(consistencyProfile, ["governanceConsistencyScore"], 54), 0.12],
      [doctrineEvolutionScore, 0.12],
      [adaptationReadinessScore, 0.1],
      [extractProfileScore(reviewProfile, ["strategicReviewMaturityScore"], 54), 0.08],
      [extractProfileScore(doctrineProfile, ["governanceDoctrineScore"], 54), 0.04],
    ]),
  );
  const expansionAdaptationScore = getScore(
    input.expansionAdaptationScore,
    weightedAverage([
      [extractProfileScore(reviewProfile, ["expansionReassessmentScore", "scoreBreakdown.expansionReassessmentScore"], 54), 0.2],
      [extractProfileScore(expansionProfile, ["expansionControlQuality", "scoreBreakdown.expansionControlQualityScore"], 54), 0.16],
      [extractProfileScore(expansionProfile, ["expansionOversightQuality", "scoreBreakdown.expansionOversightQualityScore"], 54), 0.16],
      [extractProfileScore(consistencyProfile, ["expansionConsistencyScore"], 54), 0.12],
      [adaptationReadinessScore, 0.12],
      [governanceAdaptationScore, 0.1],
      [extractProfileScore(cohesionProfile, ["scalingCoherenceScore"], 54), 0.08],
      [extractProfileScore(doctrineProfile, ["expansionDoctrineScore"], 54), 0.06],
    ]),
  );
  const longHorizonRenewalScore = getScore(
    input.longHorizonRenewalScore,
    weightedAverage([
      [extractProfileScore(reviewProfile, ["longHorizonReviewScore", "scoreBreakdown.longHorizonReviewScore"], 54), 0.18],
      [extractProfileScore(preservationProfile, ["longHorizonPreservationQuality", "scoreBreakdown.longHorizonPreservationQualityScore"], 54), 0.18],
      [extractProfileScore(preservationProfile, ["institutionalContinuityDurability", "scoreBreakdown.institutionalContinuityDurabilityScore"], 54), 0.14],
      [extractProfileScore(memoryProfile, ["longHorizonContinuityScore"], 54), 0.12],
      [doctrineEvolutionScore, 0.1],
      [innovationBalanceScore, 0.1],
      [adaptationReadinessScore, 0.08],
      [extractProfileScore(doctrineProfile, ["longHorizonDoctrineScore"], 54), 0.06],
      [governanceAdaptationScore, 0.04],
    ]),
  );
  const marketRelevanceScore = getScore(
    input.marketRelevanceScore,
    weightedAverage([
      [extractProfileScore(doctrineProfile, ["brandTrustDoctrineScore", "scoreBreakdown.brandTrustDoctrineScore"], 54), 0.16],
      [extractProfileScore(doctrineProfile, ["strategicPrincipleScore", "scoreBreakdown.strategicPrincipleScore"], 54), 0.14],
      [extractProfileScore(cohesionProfile, ["institutionalIdentityScore", "scoreBreakdown.institutionalIdentityScore"], 54), 0.14],
      [extractProfileScore(cohesionProfile, ["communicationCohesionScore"], 54), 0.12],
      [extractProfileScore(learningProfile, ["responseLearningScore"], 54), 0.12],
      [adaptationReadinessScore, 0.1],
      [innovationBalanceScore, 0.1],
      [longHorizonRenewalScore, 0.08],
      [extractProfileScore(consistencyProfile, ["communicationConsistencyScore"], 54), 0.04],
    ]),
  );
  const organizationalEvolutionScore = getScore(
    input.organizationalEvolutionScore,
    weightedAverage([
      [extractProfileScore(cohesionProfile, ["overallCohesionScore", "scoreBreakdown.overallCohesionScore"], 54), 0.16],
      [extractProfileScore(cohesionProfile, ["scalingCoherenceScore", "scoreBreakdown.scalingCoherenceScore"], 54), 0.14],
      [extractProfileScore(learningProfile, ["continuousLearningMaturityScore"], 54), 0.14],
      [extractProfileScore(reviewProfile, ["institutionalReassessmentScore"], 54), 0.12],
      [adaptationReadinessScore, 0.12],
      [governanceAdaptationScore, 0.1],
      [doctrineEvolutionScore, 0.08],
      [longHorizonRenewalScore, 0.08],
      [extractProfileScore(memoryProfile, ["enterpriseMemoryMaturityScore"], 54), 0.06],
    ]),
  );
  const stagnationRiskScore = getScore(
    input.stagnationRiskScore,
    weightedAverage([
      [100 - adaptationReadinessScore, 0.16],
      [100 - doctrineEvolutionScore, 0.12],
      [100 - innovationBalanceScore, 0.12],
      [100 - organizationalEvolutionScore, 0.12],
      [extractProfileScore(optimizationProfile, ["frictionRiskScore", "scoreBreakdown.frictionRiskScore"], 48), 0.12],
      [extractProfileScore(optimizationProfile, ["scalabilityBottleneckScore", "scoreBreakdown.scalabilityBottleneckScore"], 48), 0.1],
      [extractProfileScore(cohesionProfile, ["fragmentationRiskScore", "scoreBreakdown.fragmentationRiskScore"], 48), 0.1],
      [100 - extractProfileScore(learningProfile, ["continuousLearningMaturityScore"], 54), 0.08],
      [100 - longHorizonRenewalScore, 0.08],
    ]),
  );
  const strategicRenewalMaturityScore = getScore(
    input.strategicRenewalMaturityScore,
    weightedAverage([
      [adaptationReadinessScore, 0.12],
      [doctrineEvolutionScore, 0.11],
      [innovationBalanceScore, 0.1],
      [100 - stagnationRiskScore, 0.1],
      [longHorizonRenewalScore, 0.11],
      [expansionAdaptationScore, 0.09],
      [governanceAdaptationScore, 0.11],
      [marketRelevanceScore, 0.09],
      [organizationalEvolutionScore, 0.1],
      [extractProfileScore(reviewProfile, ["strategicReviewMaturityScore"], 54), 0.04],
      [extractProfileScore(learningProfile, ["overallLearningScore"], 54), 0.03],
    ]),
  );
  const overallRenewalScore = weightedAverage([
    [adaptationReadinessScore, 0.12],
    [doctrineEvolutionScore, 0.11],
    [innovationBalanceScore, 0.1],
    [100 - stagnationRiskScore, 0.1],
    [longHorizonRenewalScore, 0.11],
    [expansionAdaptationScore, 0.09],
    [governanceAdaptationScore, 0.11],
    [marketRelevanceScore, 0.09],
    [organizationalEvolutionScore, 0.09],
    [strategicRenewalMaturityScore, 0.08],
  ]);

  return {
    connectivityScore: marketRelevanceScore,
    durabilityScore: overallRenewalScore,
    expansionScore: expansionAdaptationScore,
    institutionalScore: strategicRenewalMaturityScore,
    logisticsScore: adaptationReadinessScore,
    luxuryScore: innovationBalanceScore,
    developmentScore: longHorizonRenewalScore,
    overallRenewalScore,
    adaptationReadinessScore,
    doctrineEvolutionScore,
    innovationBalanceScore,
    stagnationRiskScore,
    longHorizonRenewalScore,
    expansionAdaptationScore,
    governanceAdaptationScore,
    marketRelevanceScore,
    organizationalEvolutionScore,
    strategicRenewalMaturityScore,
  };
}

function classifyStrategicRenewal(score: number, stagnationRiskScore: number): StrategicRenewalLevel {
  if (score >= 82 && stagnationRiskScore < 28) return "institutional";
  if (score >= 68 && stagnationRiskScore < 42) return "adaptive";
  if (score >= 54 && stagnationRiskScore < 58) return "developing";
  if (score >= 40 && stagnationRiskScore < 72) return "fragile";

  return "stagnant";
}

function buildWarnings(scoreBreakdown: EnterpriseStrategicRenewalScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "STRATEGIC_RENEWAL_DATA_INCOMPLETE",
            severity: missingData.length >= 5 ? "high" : "medium",
            message: "Enterprise strategic renewal assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.overallRenewalScore < 42
      ? [
          createCorridorWarning({
            code: "STRATEGIC_RENEWAL_WEAK",
            severity: "high",
            message: "Overall strategic renewal maturity is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.stagnationRiskScore >= 72
      ? [
          createCorridorWarning({
            code: "INSTITUTIONAL_STAGNATION_RISK_HIGH",
            severity: "high",
            message: "Institutional stagnation risk is elevated enough to require human governance review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.governanceAdaptationScore < 45
      ? [
          createCorridorWarning({
            code: "GOVERNANCE_ADAPTATION_WEAK",
            severity: "medium",
            message: "Governance adaptation discipline is weak and requires human review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
  ];
}

function buildRenewalWarnings(scoreBreakdown: EnterpriseStrategicRenewalScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.adaptationReadinessScore < 55 ? ["Strategic adaptation readiness may be underdeveloped."] : []),
    ...(scoreBreakdown.doctrineEvolutionScore < 55 ? ["Doctrine evolution discipline may be too weak for durable renewal."] : []),
    ...(scoreBreakdown.innovationBalanceScore < 55 ? ["Innovation-vs-stability balance may require human review."] : []),
    ...(scoreBreakdown.stagnationRiskScore >= 58 ? ["Institutional stagnation risk may require human governance review."] : []),
    ...(scoreBreakdown.longHorizonRenewalScore < 55 ? ["Long-horizon renewal capability may be underdeveloped."] : []),
    ...(scoreBreakdown.expansionAdaptationScore < 55 ? ["Expansion adaptation maturity may be underdeveloped."] : []),
    ...(scoreBreakdown.governanceAdaptationScore < 55 ? ["Governance adaptation discipline may require human review."] : []),
    ...(scoreBreakdown.marketRelevanceScore < 55 ? ["Market relevance durability may be thin; no market prediction is produced."] : []),
    ...(scoreBreakdown.organizationalEvolutionScore < 55 ? ["Organizational evolution maturity may be underdeveloped."] : []),
    ...(scoreBreakdown.strategicRenewalMaturityScore < 55 ? ["Strategic renewal maturity may be underdeveloped."] : []),
    ...(missingData.length > 0 ? ["Renewal warnings require human validation because required structured inputs are incomplete."] : []),
  ]);
}

function buildReusableInfrastructureNotes(input: EnterpriseStrategicRenewalInput, missingData: string[]) {
  return unique([
    "Reuses shared corridor score normalization, warning creation, confidence scoring, missing-data handling, and read-only score breakdown conventions.",
    "Consumes optional in-memory intelligence profiles only; no persistence, external API calls, scraping, routing, orchestration, or automation execution is introduced.",
    ...(input.enterpriseStrategicReviewProfile ? ["Enterprise strategic review profile supplied as reusable renewal/reassessment context."] : []),
    ...(input.enterpriseInstitutionalLearningProfile ? ["Enterprise institutional learning profile supplied as reusable adaptation context."] : []),
    ...(input.enterpriseStrategicDoctrineProfile ? ["Enterprise strategic doctrine profile supplied as reusable doctrine evolution context."] : []),
    ...(input.processOptimizationProfile ? ["Process optimization profile supplied as read-only improvement context without autonomous optimization."] : []),
    ...(missingData.length > 0 ? ["Reusable profile coverage is incomplete, so conservative deterministic defaults and human verification remain required."] : []),
  ]);
}

function buildKeyRisks(scoreBreakdown: EnterpriseStrategicRenewalScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.overallRenewalScore < 50 ? ["Overall strategic renewal maturity is weak."] : []),
    ...(scoreBreakdown.adaptationReadinessScore < 50 ? ["Strategic adaptation readiness is weak."] : []),
    ...(scoreBreakdown.doctrineEvolutionScore < 50 ? ["Doctrine evolution discipline is weak."] : []),
    ...(scoreBreakdown.innovationBalanceScore < 50 ? ["Innovation-vs-stability balance is weak."] : []),
    ...(scoreBreakdown.stagnationRiskScore >= 66 ? ["Institutional stagnation risk is elevated."] : []),
    ...(scoreBreakdown.longHorizonRenewalScore < 50 ? ["Long-horizon renewal capability is weak."] : []),
    ...(scoreBreakdown.expansionAdaptationScore < 50 ? ["Expansion adaptation maturity is weak."] : []),
    ...(scoreBreakdown.governanceAdaptationScore < 50 ? ["Governance adaptation discipline is weak."] : []),
    ...(scoreBreakdown.marketRelevanceScore < 50 ? ["Market relevance durability is weak."] : []),
    ...(scoreBreakdown.organizationalEvolutionScore < 50 ? ["Organizational evolution maturity is weak."] : []),
    ...(scoreBreakdown.strategicRenewalMaturityScore < 50 ? ["Strategic renewal maturity is weak."] : []),
    ...(missingData.length > 0 ? `Missing data reduces confidence: ${missingData.slice(0, 4).join(", ")}.` : []),
  ]);
}

function buildStrengths(scoreBreakdown: EnterpriseStrategicRenewalScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.overallRenewalScore >= 70 ? ["Overall strategic renewal maturity is strong."] : []),
    ...(scoreBreakdown.adaptationReadinessScore >= 70 ? ["Strategic adaptation readiness is strong."] : []),
    ...(scoreBreakdown.doctrineEvolutionScore >= 70 ? ["Doctrine evolution discipline is strong."] : []),
    ...(scoreBreakdown.innovationBalanceScore >= 70 ? ["Innovation-vs-stability balance is strong."] : []),
    ...(scoreBreakdown.stagnationRiskScore < 40 ? ["Institutional stagnation risk is contained."] : []),
    ...(scoreBreakdown.longHorizonRenewalScore >= 70 ? ["Long-horizon renewal capability is strong."] : []),
    ...(scoreBreakdown.expansionAdaptationScore >= 70 ? ["Expansion adaptation maturity is strong."] : []),
    ...(scoreBreakdown.governanceAdaptationScore >= 70 ? ["Governance adaptation discipline is strong."] : []),
    ...(scoreBreakdown.marketRelevanceScore >= 70 ? ["Market relevance durability is strong."] : []),
    ...(scoreBreakdown.organizationalEvolutionScore >= 70 ? ["Organizational evolution maturity is strong."] : []),
    ...(scoreBreakdown.strategicRenewalMaturityScore >= 70 ? ["Strategic renewal maturity is strong."] : []),
  ]);
}

function buildRecommendations(scoreBreakdown: EnterpriseStrategicRenewalScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.adaptationReadinessScore < 58 ? ["Review strategic adaptation readiness and document human-reviewed adaptation checkpoints."] : []),
    ...(scoreBreakdown.doctrineEvolutionScore < 58 ? ["Review doctrine evolution discipline and preserve human-reviewed doctrine context."] : []),
    ...(scoreBreakdown.innovationBalanceScore < 58 ? ["Review innovation-vs-stability balance without autonomous optimization or strategy execution."] : []),
    ...(scoreBreakdown.stagnationRiskScore >= 58 ? ["Flag institutional stagnation indicators for human governance review."] : []),
    ...(scoreBreakdown.longHorizonRenewalScore < 58 ? ["Review long-horizon renewal capability and preserve durable strategic context."] : []),
    ...(scoreBreakdown.expansionAdaptationScore < 58 ? ["Review expansion adaptation maturity without autonomous strategy decisions or execution."] : []),
    ...(scoreBreakdown.governanceAdaptationScore < 58 ? ["Review governance adaptation discipline; this is not legal, HR, ownership, or tax advice."] : []),
    ...(scoreBreakdown.marketRelevanceScore < 58 ? ["Review market relevance durability without market prediction, outreach automation, or demographic targeting."] : []),
    ...(scoreBreakdown.organizationalEvolutionScore < 58 ? ["Review organizational evolution maturity and identify human-reviewed renewal gaps."] : []),
    ...(scoreBreakdown.strategicRenewalMaturityScore < 58 ? ["Review strategic renewal maturity and identify safe governance review improvements."] : []),
    "Keep strategic-renewal improvements human-reviewed; this module does not provide autonomous strategy decisions, legal, HR, ownership, tax, lending, investment, portfolio-management, treasury-management, autonomous optimization, or market-prediction advice.",
  ]);
}

function buildExplanation(params: { scoreBreakdown: EnterpriseStrategicRenewalScoreBreakdown; strategicRenewalLevel: StrategicRenewalLevel }) {
  const scoreBreakdown = params.scoreBreakdown;

  return [
    `Strategic renewal level is ${params.strategicRenewalLevel} with an overall renewal score of ${scoreBreakdown.overallRenewalScore}/100.`,
    `Adaptation readiness is ${scoreBreakdown.adaptationReadinessScore}/100, doctrine evolution is ${scoreBreakdown.doctrineEvolutionScore}/100, and stagnation risk is ${scoreBreakdown.stagnationRiskScore}/100.`,
    "Adaptation readiness, doctrine evolution, innovation-vs-stability balance, stagnation risk, long-horizon renewal, expansion adaptation, governance adaptation, market relevance, organizational evolution, and renewal maturity were scored deterministically from structured inputs and optional read-only profile fallbacks.",
    "This output identifies strategic renewal and adaptation gaps only and does not provide autonomous strategy decisions, legal, HR, ownership, tax, lending, investment, portfolio-management, treasury-management, autonomous optimization, or market-prediction advice.",
  ];
}

function buildTrace(scoreBreakdown: EnterpriseStrategicRenewalScoreBreakdown, missingData: string[]) {
  return [
    "Normalized all numeric scores to a deterministic 0-100 scale.",
    "Derived optional fallback scores only from supplied in-memory intelligence profiles.",
    `Computed enterprise strategic renewal from adaptation readiness (${scoreBreakdown.adaptationReadinessScore}), doctrine evolution (${scoreBreakdown.doctrineEvolutionScore}), innovation balance (${scoreBreakdown.innovationBalanceScore}), stagnation risk (${scoreBreakdown.stagnationRiskScore}), long-horizon renewal (${scoreBreakdown.longHorizonRenewalScore}), expansion adaptation (${scoreBreakdown.expansionAdaptationScore}), governance adaptation (${scoreBreakdown.governanceAdaptationScore}), market relevance (${scoreBreakdown.marketRelevanceScore}), organizational evolution (${scoreBreakdown.organizationalEvolutionScore}), and renewal maturity (${scoreBreakdown.strategicRenewalMaturityScore}).`,
    missingData.length > 0 ? `Missing inputs flagged for human verification: ${missingData.join(", ")}.` : "No required structured inputs were missing.",
    "No outreach, SMS, email, Twilio, database writes, schema changes, workflow mutation, protected-class logic, demographic targeting, external APIs, scraping, autonomous strategy decisions, autonomous renewal actions, autonomous optimization, autonomous execution, or autonomous management decisions were used.",
  ];
}

function buildAssumptions(input: EnterpriseStrategicRenewalInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0
      ? ["Missing enterprise strategic renewal inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."]
      : []),
    "Enterprise strategic renewal intelligence is deterministic, explainable, read-only, compliance-first, and designed for human review before any execution.",
    "This engine evaluates strategic adaptation readiness, doctrine evolution discipline, innovation-vs-stability balance, institutional stagnation risk, long-horizon renewal capability, expansion adaptation, governance adaptation, market relevance durability, organizational evolution maturity, and strategic renewal maturity only.",
    "No outreach, SMS, email sending, Twilio, autonomous execution, autonomous strategy decisions, autonomous renewal actions, autonomous optimization, autonomous management decisions, DB writes, schema changes, workflow mutations, external APIs, scraping, demographic data, or protected-class data were used.",
    "This is not legal advice, HR advice, ownership advice, tax advice, lending advice, investment advice, portfolio-management advice, treasury management, autonomous strategy, autonomous optimization, autonomous management, or market prediction.",
  ]);
}

export function analyzeEnterpriseStrategicRenewalIntelligence(input: EnterpriseStrategicRenewalInput = {}): EnterpriseStrategicRenewalResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const strategicRenewalLevel = classifyStrategicRenewal(scoreBreakdown.overallRenewalScore, scoreBreakdown.stagnationRiskScore);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallRenewalScore: scoreBreakdown.overallRenewalScore,
    strategicRenewalLevel,
    adaptationReadinessScore: scoreBreakdown.adaptationReadinessScore,
    doctrineEvolutionScore: scoreBreakdown.doctrineEvolutionScore,
    innovationBalanceScore: scoreBreakdown.innovationBalanceScore,
    stagnationRiskScore: scoreBreakdown.stagnationRiskScore,
    longHorizonRenewalScore: scoreBreakdown.longHorizonRenewalScore,
    expansionAdaptationScore: scoreBreakdown.expansionAdaptationScore,
    governanceAdaptationScore: scoreBreakdown.governanceAdaptationScore,
    marketRelevanceScore: scoreBreakdown.marketRelevanceScore,
    organizationalEvolutionScore: scoreBreakdown.organizationalEvolutionScore,
    strategicRenewalMaturityScore: scoreBreakdown.strategicRenewalMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown, missingData),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    renewalWarnings: buildRenewalWarnings(scoreBreakdown, missingData),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input, missingData),
    explanation: buildExplanation({ scoreBreakdown, strategicRenewalLevel }),
    trace: buildTrace(scoreBreakdown, missingData),
    warnings,
    missingData,
    assumptions,
    safety: {
      readOnly: true,
      outreachAuthorized: false,
      smsAuthorized: false,
      emailAuthorized: false,
      twilioUsed: false,
      executionAuthorized: false,
      databaseWriteAuthorized: false,
      schemaMutationUsed: false,
      workflowMutationUsed: false,
      automationExecutionUsed: false,
      autonomousStrategyDecisions: false,
      autonomousRenewalActions: false,
      autonomousOptimizationActions: false,
      autonomousManagementDecisions: false,
      legalAdvice: false,
      hrAdvice: false,
      ownershipAdvice: false,
      taxAdvice: false,
      lendingAdvice: false,
      investmentAdvice: false,
      portfolioManagementAdvice: false,
      demographicTargetingUsed: false,
      protectedClassLogicUsed: false,
      externalDataUsed: false,
      scrapingUsed: false,
      marketPrediction: false,
    },
    readOnly: true,
  };
}

export const getEnterpriseStrategicRenewalIntelligence = analyzeEnterpriseStrategicRenewalIntelligence;
