import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type InstitutionalCohesionLevel = "fragmented" | "thin" | "developing" | "cohesive" | "institutional";

export type EnterpriseInstitutionalCohesionInput = {
  organizationalCohesionScore?: number;
  crossFunctionalCohesionScore?: number;
  governanceCohesionScore?: number;
  operationalCohesionScore?: number;
  expansionCohesionScore?: number;
  portfolioCohesionScore?: number;
  communicationCohesionScore?: number;
  institutionalIdentityScore?: number;
  scalingCoherenceScore?: number;
  fragmentationRiskScore?: number;
  enterpriseStrategicConsistencyProfile?: unknown;
  enterpriseStrategicAlignmentProfile?: unknown;
  enterpriseStrategicDoctrineProfile?: unknown;
  enterpriseStrategicMemoryProfile?: unknown;
  enterpriseInstitutionalLearningProfile?: unknown;
  institutionalRelationshipProfile?: unknown;
  operationalQaProcessDriftProfile?: unknown;
  enterpriseOperatingRhythmProfile?: unknown;
  enterpriseExpansionGovernanceProfile?: unknown;
  portfolioRiskBalancingProfile?: unknown;
  longHorizonWealthPreservationProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseInstitutionalCohesionScoreBreakdown = CorridorScoreBreakdown & {
  overallCohesionScore: number;
  organizationalCohesionScore: number;
  crossFunctionalCohesionScore: number;
  governanceCohesionScore: number;
  operationalCohesionScore: number;
  expansionCohesionScore: number;
  portfolioCohesionScore: number;
  communicationCohesionScore: number;
  institutionalIdentityScore: number;
  scalingCoherenceScore: number;
  fragmentationRiskScore: number;
};

export type EnterpriseInstitutionalCohesionResult = {
  overallCohesionScore: number;
  institutionalCohesionLevel: InstitutionalCohesionLevel;
  organizationalCohesionScore: number;
  crossFunctionalCohesionScore: number;
  governanceCohesionScore: number;
  operationalCohesionScore: number;
  expansionCohesionScore: number;
  portfolioCohesionScore: number;
  communicationCohesionScore: number;
  institutionalIdentityScore: number;
  scalingCoherenceScore: number;
  fragmentationRiskScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseInstitutionalCohesionScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  cohesionWarnings: string[];
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
    autonomousCohesionActions: false;
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

const REQUIRED_INPUTS: Array<keyof EnterpriseInstitutionalCohesionInput> = [
  "organizationalCohesionScore",
  "crossFunctionalCohesionScore",
  "governanceCohesionScore",
  "operationalCohesionScore",
  "expansionCohesionScore",
  "portfolioCohesionScore",
  "communicationCohesionScore",
  "institutionalIdentityScore",
  "scalingCoherenceScore",
  "fragmentationRiskScore",
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

function hasFallbackForInput(input: EnterpriseInstitutionalCohesionInput, key: keyof EnterpriseInstitutionalCohesionInput) {
  const consistencyProfile = input.enterpriseStrategicConsistencyProfile;
  const alignmentProfile = input.enterpriseStrategicAlignmentProfile;
  const doctrineProfile = input.enterpriseStrategicDoctrineProfile;
  const memoryProfile = input.enterpriseStrategicMemoryProfile;
  const learningProfile = input.enterpriseInstitutionalLearningProfile;
  const relationshipProfile = input.institutionalRelationshipProfile;
  const qaProfile = input.operationalQaProcessDriftProfile;
  const rhythmProfile = input.enterpriseOperatingRhythmProfile;
  const expansionProfile = input.enterpriseExpansionGovernanceProfile;
  const portfolioProfile = input.portfolioRiskBalancingProfile;
  const preservationProfile = input.longHorizonWealthPreservationProfile;

  const fallbackPaths: Partial<Record<keyof EnterpriseInstitutionalCohesionInput, boolean>> = {
    organizationalCohesionScore:
      hasProfileScore(consistencyProfile, ["overallConsistencyScore", "institutionalCoherenceScore"]) ||
      hasProfileScore(memoryProfile, ["enterpriseMemoryMaturityScore"]) ||
      hasProfileScore(learningProfile, ["continuousLearningMaturityScore"]),
    crossFunctionalCohesionScore:
      hasProfileScore(consistencyProfile, ["crossFunctionalConsistencyScore"]) ||
      hasProfileScore(alignmentProfile, ["overallAlignmentScore"]) ||
      hasProfileScore(rhythmProfile, ["strategicSynchronizationScore"]),
    governanceCohesionScore:
      hasProfileScore(consistencyProfile, ["governanceConsistencyScore"]) ||
      hasProfileScore(alignmentProfile, ["governanceAlignmentScore"]) ||
      hasProfileScore(expansionProfile, ["humanReviewGovernanceAlignment"]),
    operationalCohesionScore:
      hasProfileScore(consistencyProfile, ["operationsConsistencyScore"]) ||
      hasProfileScore(qaProfile, ["overallOperationalConsistencyScore"]) ||
      hasProfileScore(rhythmProfile, ["operationalTempoScore"]),
    expansionCohesionScore:
      hasProfileScore(consistencyProfile, ["expansionConsistencyScore"]) ||
      hasProfileScore(expansionProfile, ["expansionControlQuality", "expansionOversightQuality"]) ||
      hasProfileScore(doctrineProfile, ["expansionDoctrineScore"]),
    portfolioCohesionScore:
      hasProfileScore(consistencyProfile, ["portfolioConsistencyScore"]) ||
      hasProfileScore(portfolioProfile, ["riskAdjustedPortfolioQuality", "diversificationEffectiveness"]) ||
      hasProfileScore(memoryProfile, ["portfolioStrategyMemoryScore"]),
    communicationCohesionScore:
      hasProfileScore(consistencyProfile, ["communicationConsistencyScore"]) ||
      hasProfileScore(relationshipProfile, ["communicationStability", "institutionalTrustReadiness"]) ||
      hasProfileScore(qaProfile, ["communicationConsistencyScore"]),
    institutionalIdentityScore:
      hasProfileScore(doctrineProfile, ["strategicPrincipleScore", "brandTrustDoctrineScore"]) ||
      hasProfileScore(memoryProfile, ["doctrinePreservationScore", "strategicContextPreservationScore"]),
    scalingCoherenceScore:
      hasProfileScore(expansionProfile, ["multiMarketGovernanceStability", "expansionControlQuality"]) ||
      hasProfileScore(consistencyProfile, ["institutionalCoherenceScore"]) ||
      hasProfileScore(alignmentProfile, ["expansionAlignmentScore"]),
    fragmentationRiskScore:
      hasProfileScore(qaProfile, ["operationalEntropyRiskScore"]) ||
      hasProfileScore(relationshipProfile, ["relationshipConcentrationRisk", "dependencyRisk"]) ||
      hasProfileScore(preservationProfile, ["institutionalContinuityDurability"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: EnterpriseInstitutionalCohesionInput) {
  const labels: Record<keyof EnterpriseInstitutionalCohesionInput, string> = {
    organizationalCohesionScore: "organizational cohesion score",
    crossFunctionalCohesionScore: "cross-functional cohesion score",
    governanceCohesionScore: "governance cohesion score",
    operationalCohesionScore: "operational cohesion score",
    expansionCohesionScore: "expansion cohesion score",
    portfolioCohesionScore: "portfolio cohesion score",
    communicationCohesionScore: "communication/brand cohesion score",
    institutionalIdentityScore: "institutional identity durability score",
    scalingCoherenceScore: "scaling coherence score",
    fragmentationRiskScore: "fragmentation risk maturity score",
    enterpriseStrategicConsistencyProfile: "enterprise strategic consistency profile",
    enterpriseStrategicAlignmentProfile: "enterprise strategic alignment profile",
    enterpriseStrategicDoctrineProfile: "enterprise strategic doctrine profile",
    enterpriseStrategicMemoryProfile: "enterprise strategic memory profile",
    enterpriseInstitutionalLearningProfile: "enterprise institutional learning profile",
    institutionalRelationshipProfile: "institutional relationship profile",
    operationalQaProcessDriftProfile: "operational QA/process drift profile",
    enterpriseOperatingRhythmProfile: "enterprise operating rhythm profile",
    enterpriseExpansionGovernanceProfile: "enterprise expansion governance profile",
    portfolioRiskBalancingProfile: "portfolio risk balancing profile",
    longHorizonWealthPreservationProfile: "long-horizon wealth preservation profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: EnterpriseInstitutionalCohesionInput): EnterpriseInstitutionalCohesionScoreBreakdown {
  const consistencyProfile = input.enterpriseStrategicConsistencyProfile;
  const alignmentProfile = input.enterpriseStrategicAlignmentProfile;
  const doctrineProfile = input.enterpriseStrategicDoctrineProfile;
  const memoryProfile = input.enterpriseStrategicMemoryProfile;
  const learningProfile = input.enterpriseInstitutionalLearningProfile;
  const relationshipProfile = input.institutionalRelationshipProfile;
  const qaProfile = input.operationalQaProcessDriftProfile;
  const rhythmProfile = input.enterpriseOperatingRhythmProfile;
  const expansionProfile = input.enterpriseExpansionGovernanceProfile;
  const portfolioProfile = input.portfolioRiskBalancingProfile;
  const preservationProfile = input.longHorizonWealthPreservationProfile;
  const operationalCohesionScore = getScore(
    input.operationalCohesionScore,
    weightedAverage([
      [extractProfileScore(consistencyProfile, ["operationsConsistencyScore", "scoreBreakdown.operationsConsistencyScore"], 54), 0.22],
      [extractProfileScore(qaProfile, ["overallOperationalConsistencyScore", "scoreBreakdown.overallOperationalConsistencyScore"], 54), 0.2],
      [extractProfileScore(rhythmProfile, ["operationalTempoScore", "scoreBreakdown.operationalTempoScore"], 54), 0.14],
      [extractProfileScore(alignmentProfile, ["operationsAlignmentScore"], 54), 0.14],
      [extractProfileScore(learningProfile, ["processImprovementLearningScore"], 54), 0.1],
      [extractProfileScore(doctrineProfile, ["operatingPhilosophyScore"], 54), 0.1],
      [100 - extractProfileScore(qaProfile, ["operationalEntropyRiskScore"], 48), 0.1],
    ]),
  );
  const governanceCohesionScore = getScore(
    input.governanceCohesionScore,
    weightedAverage([
      [extractProfileScore(consistencyProfile, ["governanceConsistencyScore", "scoreBreakdown.governanceConsistencyScore"], 54), 0.22],
      [extractProfileScore(alignmentProfile, ["governanceAlignmentScore", "scoreBreakdown.governanceAlignmentScore"], 54), 0.16],
      [extractProfileScore(expansionProfile, ["humanReviewGovernanceAlignment", "scoreBreakdown.humanReviewGovernanceAlignmentScore"], 54), 0.16],
      [extractProfileScore(doctrineProfile, ["governanceDoctrineScore"], 54), 0.12],
      [extractProfileScore(memoryProfile, ["governanceMemoryDurabilityScore"], 54), 0.12],
      [operationalCohesionScore, 0.1],
      [extractProfileScore(rhythmProfile, ["quarterlyGovernanceScore"], 54), 0.12],
    ]),
  );
  const communicationCohesionScore = getScore(
    input.communicationCohesionScore,
    weightedAverage([
      [extractProfileScore(consistencyProfile, ["communicationConsistencyScore", "scoreBreakdown.communicationConsistencyScore"], 54), 0.2],
      [extractProfileScore(relationshipProfile, ["communicationStability", "scoreBreakdown.communicationStabilityScore"], 54), 0.18],
      [extractProfileScore(relationshipProfile, ["institutionalTrustReadiness", "scoreBreakdown.institutionalTrustReadinessScore"], 54), 0.16],
      [extractProfileScore(doctrineProfile, ["brandTrustDoctrineScore"], 54), 0.12],
      [extractProfileScore(alignmentProfile, ["brandTrustAlignmentScore"], 54), 0.12],
      [governanceCohesionScore, 0.1],
      [operationalCohesionScore, 0.08],
      [extractProfileScore(qaProfile, ["communicationConsistencyScore"], 54), 0.04],
    ]),
  );
  const portfolioCohesionScore = getScore(
    input.portfolioCohesionScore,
    weightedAverage([
      [extractProfileScore(consistencyProfile, ["portfolioConsistencyScore", "scoreBreakdown.portfolioConsistencyScore"], 54), 0.2],
      [extractProfileScore(portfolioProfile, ["riskAdjustedPortfolioQuality", "scoreBreakdown.riskAdjustedPortfolioQualityScore"], 54), 0.16],
      [extractProfileScore(portfolioProfile, ["diversificationEffectiveness", "scoreBreakdown.diversificationEffectivenessScore"], 54), 0.14],
      [extractProfileScore(memoryProfile, ["portfolioStrategyMemoryScore"], 54), 0.12],
      [extractProfileScore(alignmentProfile, ["portfolioAlignmentScore"], 54), 0.12],
      [governanceCohesionScore, 0.1],
      [extractProfileScore(doctrineProfile, ["riskDoctrineScore"], 54), 0.08],
      [extractProfileScore(preservationProfile, ["longHorizonPreservationQuality"], 54), 0.08],
    ]),
  );
  const expansionCohesionScore = getScore(
    input.expansionCohesionScore,
    weightedAverage([
      [extractProfileScore(consistencyProfile, ["expansionConsistencyScore", "scoreBreakdown.expansionConsistencyScore"], 54), 0.2],
      [extractProfileScore(expansionProfile, ["expansionControlQuality", "scoreBreakdown.expansionControlQualityScore"], 54), 0.18],
      [extractProfileScore(expansionProfile, ["expansionOversightQuality", "scoreBreakdown.expansionOversightQualityScore"], 54), 0.16],
      [extractProfileScore(expansionProfile, ["multiMarketGovernanceStability"], 54), 0.12],
      [extractProfileScore(alignmentProfile, ["expansionAlignmentScore"], 54), 0.12],
      [governanceCohesionScore, 0.1],
      [operationalCohesionScore, 0.06],
      [portfolioCohesionScore, 0.06],
    ]),
  );
  const crossFunctionalCohesionScore = getScore(
    input.crossFunctionalCohesionScore,
    weightedAverage([
      [extractProfileScore(consistencyProfile, ["crossFunctionalConsistencyScore", "scoreBreakdown.crossFunctionalConsistencyScore"], 54), 0.2],
      [operationalCohesionScore, 0.13],
      [governanceCohesionScore, 0.13],
      [expansionCohesionScore, 0.1],
      [portfolioCohesionScore, 0.1],
      [communicationCohesionScore, 0.1],
      [extractProfileScore(alignmentProfile, ["overallAlignmentScore"], 54), 0.1],
      [extractProfileScore(rhythmProfile, ["strategicSynchronizationScore"], 54), 0.08],
      [extractProfileScore(learningProfile, ["continuousLearningMaturityScore"], 54), 0.06],
    ]),
  );
  const institutionalIdentityScore = getScore(
    input.institutionalIdentityScore,
    weightedAverage([
      [extractProfileScore(doctrineProfile, ["strategicPrincipleScore", "scoreBreakdown.strategicPrincipleScore"], 54), 0.18],
      [extractProfileScore(doctrineProfile, ["brandTrustDoctrineScore", "scoreBreakdown.brandTrustDoctrineScore"], 54), 0.14],
      [extractProfileScore(memoryProfile, ["doctrinePreservationScore", "scoreBreakdown.doctrinePreservationScore"], 54), 0.16],
      [extractProfileScore(memoryProfile, ["strategicContextPreservationScore"], 54), 0.12],
      [communicationCohesionScore, 0.12],
      [crossFunctionalCohesionScore, 0.1],
      [extractProfileScore(relationshipProfile, ["institutionalTrustReadiness"], 54), 0.1],
      [extractProfileScore(learningProfile, ["memoryReinforcementScore"], 54), 0.08],
    ]),
  );
  const scalingCoherenceScore = getScore(
    input.scalingCoherenceScore,
    weightedAverage([
      [expansionCohesionScore, 0.18],
      [crossFunctionalCohesionScore, 0.16],
      [extractProfileScore(expansionProfile, ["multiMarketGovernanceStability", "scoreBreakdown.multiMarketGovernanceStabilityScore"], 54), 0.14],
      [extractProfileScore(expansionProfile, ["expansionControlQuality"], 54), 0.12],
      [operationalCohesionScore, 0.1],
      [governanceCohesionScore, 0.1],
      [portfolioCohesionScore, 0.08],
      [extractProfileScore(consistencyProfile, ["institutionalCoherenceScore"], 54), 0.06],
      [extractProfileScore(preservationProfile, ["institutionalContinuityDurability"], 54), 0.06],
    ]),
  );
  const fragmentationRiskScore = getScore(
    input.fragmentationRiskScore,
    weightedAverage([
      [100 - crossFunctionalCohesionScore, 0.16],
      [100 - operationalCohesionScore, 0.12],
      [100 - governanceCohesionScore, 0.12],
      [100 - communicationCohesionScore, 0.1],
      [100 - scalingCoherenceScore, 0.12],
      [extractProfileScore(qaProfile, ["operationalEntropyRiskScore", "scoreBreakdown.operationalEntropyRiskScore"], 48), 0.12],
      [extractProfileScore(relationshipProfile, ["relationshipConcentrationRisk", "relationshipConcentrationRiskScore"], 48), 0.1],
      [extractProfileScore(relationshipProfile, ["dependencyRisk", "dependencyRiskScore"], 48), 0.08],
      [100 - extractProfileScore(preservationProfile, ["institutionalContinuityDurability"], 54), 0.08],
    ]),
  );
  const organizationalCohesionScore = getScore(
    input.organizationalCohesionScore,
    weightedAverage([
      [crossFunctionalCohesionScore, 0.14],
      [governanceCohesionScore, 0.12],
      [operationalCohesionScore, 0.12],
      [communicationCohesionScore, 0.1],
      [institutionalIdentityScore, 0.14],
      [scalingCoherenceScore, 0.12],
      [extractProfileScore(consistencyProfile, ["overallConsistencyScore", "scoreBreakdown.overallConsistencyScore"], 54), 0.1],
      [extractProfileScore(memoryProfile, ["enterpriseMemoryMaturityScore"], 54), 0.08],
      [100 - fragmentationRiskScore, 0.08],
    ]),
  );
  const overallCohesionScore = weightedAverage([
    [organizationalCohesionScore, 0.12],
    [crossFunctionalCohesionScore, 0.12],
    [governanceCohesionScore, 0.11],
    [operationalCohesionScore, 0.11],
    [expansionCohesionScore, 0.1],
    [portfolioCohesionScore, 0.09],
    [communicationCohesionScore, 0.09],
    [institutionalIdentityScore, 0.1],
    [scalingCoherenceScore, 0.09],
    [100 - fragmentationRiskScore, 0.07],
  ]);

  return {
    connectivityScore: communicationCohesionScore,
    durabilityScore: overallCohesionScore,
    expansionScore: expansionCohesionScore,
    institutionalScore: institutionalIdentityScore,
    logisticsScore: operationalCohesionScore,
    luxuryScore: portfolioCohesionScore,
    developmentScore: scalingCoherenceScore,
    overallCohesionScore,
    organizationalCohesionScore,
    crossFunctionalCohesionScore,
    governanceCohesionScore,
    operationalCohesionScore,
    expansionCohesionScore,
    portfolioCohesionScore,
    communicationCohesionScore,
    institutionalIdentityScore,
    scalingCoherenceScore,
    fragmentationRiskScore,
  };
}

function classifyInstitutionalCohesion(score: number, fragmentationRiskScore: number): InstitutionalCohesionLevel {
  if (score >= 82 && fragmentationRiskScore < 28) return "institutional";
  if (score >= 68 && fragmentationRiskScore < 42) return "cohesive";
  if (score >= 54 && fragmentationRiskScore < 58) return "developing";
  if (score >= 40 && fragmentationRiskScore < 72) return "thin";

  return "fragmented";
}

function buildWarnings(scoreBreakdown: EnterpriseInstitutionalCohesionScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "INSTITUTIONAL_COHESION_DATA_INCOMPLETE",
            severity: missingData.length >= 5 ? "high" : "medium",
            message: "Enterprise institutional cohesion assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.overallCohesionScore < 42
      ? [
          createCorridorWarning({
            code: "INSTITUTIONAL_COHESION_FRAGMENTED",
            severity: "high",
            message: "Overall institutional cohesion appears fragmented under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.fragmentationRiskScore >= 72
      ? [
          createCorridorWarning({
            code: "FRAGMENTATION_RISK_HIGH",
            severity: "high",
            message: "Fragmentation risk is elevated enough to require human institutional review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.governanceCohesionScore < 45
      ? [
          createCorridorWarning({
            code: "GOVERNANCE_COHESION_WEAK",
            severity: "medium",
            message: "Governance cohesion is weak and requires human review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
  ];
}

function buildCohesionWarnings(scoreBreakdown: EnterpriseInstitutionalCohesionScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.organizationalCohesionScore < 55 ? ["Organizational cohesion may be too thin for durable expansion."] : []),
    ...(scoreBreakdown.crossFunctionalCohesionScore < 55 ? ["Cross-functional cohesion may be fragmented across operating domains."] : []),
    ...(scoreBreakdown.governanceCohesionScore < 55 ? ["Governance cohesion may require human review."] : []),
    ...(scoreBreakdown.operationalCohesionScore < 55 ? ["Operational cohesion may be underdeveloped."] : []),
    ...(scoreBreakdown.expansionCohesionScore < 55 ? ["Expansion cohesion may be too weak for multi-market coherence."] : []),
    ...(scoreBreakdown.portfolioCohesionScore < 55
      ? ["Portfolio cohesion may be underdeveloped; no investment or portfolio-management advice is produced."]
      : []),
    ...(scoreBreakdown.communicationCohesionScore < 55 ? ["Communication/brand cohesion may be fragmented; no outreach automation is triggered."] : []),
    ...(scoreBreakdown.institutionalIdentityScore < 55 ? ["Institutional identity durability may be too thin."] : []),
    ...(scoreBreakdown.scalingCoherenceScore < 55 ? ["Scaling coherence may be underdeveloped during expansion."] : []),
    ...(scoreBreakdown.fragmentationRiskScore >= 58 ? ["Fragmentation risk may require human institutional review."] : []),
    ...(missingData.length > 0 ? ["Cohesion warnings require human validation because required structured inputs are incomplete."] : []),
  ]);
}

function buildReusableInfrastructureNotes(input: EnterpriseInstitutionalCohesionInput, missingData: string[]) {
  return unique([
    "Reuses shared corridor score normalization, warning creation, confidence scoring, missing-data handling, and read-only score breakdown conventions.",
    "Consumes optional in-memory intelligence profiles only; no persistence, external API calls, scraping, routing, orchestration, or automation execution is introduced.",
    ...(input.enterpriseStrategicConsistencyProfile ? ["Enterprise strategic consistency profile supplied as reusable cohesion context."] : []),
    ...(input.enterpriseStrategicMemoryProfile ? ["Enterprise strategic memory profile supplied as reusable institutional identity context."] : []),
    ...(input.enterpriseExpansionGovernanceProfile ? ["Enterprise expansion governance profile supplied as reusable scaling cohesion context."] : []),
    ...(input.institutionalRelationshipProfile ? ["Institutional relationship profile supplied as read-only communication and trust cohesion context without outreach behavior."] : []),
    ...(missingData.length > 0 ? ["Reusable profile coverage is incomplete, so conservative deterministic defaults and human verification remain required."] : []),
  ]);
}

function buildKeyRisks(scoreBreakdown: EnterpriseInstitutionalCohesionScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.overallCohesionScore < 50 ? ["Overall institutional cohesion is weak."] : []),
    ...(scoreBreakdown.organizationalCohesionScore < 50 ? ["Organizational cohesion is weak."] : []),
    ...(scoreBreakdown.crossFunctionalCohesionScore < 50 ? ["Cross-functional cohesion is weak."] : []),
    ...(scoreBreakdown.governanceCohesionScore < 50 ? ["Governance cohesion is weak."] : []),
    ...(scoreBreakdown.operationalCohesionScore < 50 ? ["Operational cohesion is weak."] : []),
    ...(scoreBreakdown.expansionCohesionScore < 50 ? ["Expansion cohesion is weak."] : []),
    ...(scoreBreakdown.portfolioCohesionScore < 50 ? ["Portfolio cohesion is weak."] : []),
    ...(scoreBreakdown.communicationCohesionScore < 50 ? ["Communication/brand cohesion is weak."] : []),
    ...(scoreBreakdown.institutionalIdentityScore < 50 ? ["Institutional identity durability is weak."] : []),
    ...(scoreBreakdown.scalingCoherenceScore < 50 ? ["Scaling coherence is weak."] : []),
    ...(scoreBreakdown.fragmentationRiskScore >= 66 ? ["Fragmentation risk is elevated."] : []),
    ...(missingData.length > 0 ? `Missing data reduces confidence: ${missingData.slice(0, 4).join(", ")}.` : []),
  ]);
}

function buildStrengths(scoreBreakdown: EnterpriseInstitutionalCohesionScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.overallCohesionScore >= 70 ? ["Overall institutional cohesion is strong."] : []),
    ...(scoreBreakdown.organizationalCohesionScore >= 70 ? ["Organizational cohesion is strong."] : []),
    ...(scoreBreakdown.crossFunctionalCohesionScore >= 70 ? ["Cross-functional cohesion is strong."] : []),
    ...(scoreBreakdown.governanceCohesionScore >= 70 ? ["Governance cohesion is strong."] : []),
    ...(scoreBreakdown.operationalCohesionScore >= 70 ? ["Operational cohesion is strong."] : []),
    ...(scoreBreakdown.expansionCohesionScore >= 70 ? ["Expansion cohesion is strong."] : []),
    ...(scoreBreakdown.portfolioCohesionScore >= 70 ? ["Portfolio cohesion is strong."] : []),
    ...(scoreBreakdown.communicationCohesionScore >= 70 ? ["Communication/brand cohesion is strong."] : []),
    ...(scoreBreakdown.institutionalIdentityScore >= 70 ? ["Institutional identity durability is strong."] : []),
    ...(scoreBreakdown.scalingCoherenceScore >= 70 ? ["Scaling coherence is strong."] : []),
    ...(scoreBreakdown.fragmentationRiskScore < 40 ? ["Fragmentation risk is contained."] : []),
  ]);
}

function buildRecommendations(scoreBreakdown: EnterpriseInstitutionalCohesionScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.organizationalCohesionScore < 58 ? ["Review organizational cohesion and document human-reviewed fragmentation themes."] : []),
    ...(scoreBreakdown.crossFunctionalCohesionScore < 58 ? ["Review cross-functional cohesion and identify coordination variance across operating domains."] : []),
    ...(scoreBreakdown.governanceCohesionScore < 58 ? ["Review governance cohesion; this is not legal, HR, ownership, or tax advice."] : []),
    ...(scoreBreakdown.operationalCohesionScore < 58 ? ["Review operational cohesion and compare execution patterns against established playbooks."] : []),
    ...(scoreBreakdown.expansionCohesionScore < 58 ? ["Review expansion cohesion without autonomous strategy decisions or execution."] : []),
    ...(scoreBreakdown.portfolioCohesionScore < 58
      ? ["Review portfolio cohesion without making investment, allocation, lending, or portfolio-management recommendations."]
      : []),
    ...(scoreBreakdown.communicationCohesionScore < 58
      ? ["Review communication/brand cohesion without outreach, SMS, email, Twilio, CRM automation, or relationship manipulation."]
      : []),
    ...(scoreBreakdown.institutionalIdentityScore < 58 ? ["Review institutional identity durability and preserve human-reviewed doctrine context."] : []),
    ...(scoreBreakdown.scalingCoherenceScore < 58 ? ["Review scaling coherence during expansion and identify manual governance checkpoints."] : []),
    ...(scoreBreakdown.fragmentationRiskScore >= 58 ? ["Flag fragmentation risk indicators for human institutional review."] : []),
    "Keep institutional-cohesion improvements human-reviewed; this module does not provide autonomous strategy decisions, legal, HR, ownership, tax, lending, investment, portfolio-management, treasury-management, or market-prediction advice.",
  ]);
}

function buildExplanation(params: { scoreBreakdown: EnterpriseInstitutionalCohesionScoreBreakdown; institutionalCohesionLevel: InstitutionalCohesionLevel }) {
  const scoreBreakdown = params.scoreBreakdown;

  return [
    `Institutional cohesion level is ${params.institutionalCohesionLevel} with an overall cohesion score of ${scoreBreakdown.overallCohesionScore}/100.`,
    `Organizational cohesion is ${scoreBreakdown.organizationalCohesionScore}/100, cross-functional cohesion is ${scoreBreakdown.crossFunctionalCohesionScore}/100, and fragmentation risk is ${scoreBreakdown.fragmentationRiskScore}/100.`,
    "Organizational cohesion, cross-functional cohesion, governance cohesion, operational cohesion, expansion cohesion, portfolio cohesion, communication/brand cohesion, institutional identity, scaling coherence, and fragmentation risk were scored deterministically from structured inputs and optional read-only profile fallbacks.",
    "This output identifies institutional cohesion and fragmentation risks only and does not provide autonomous strategy decisions, legal, HR, ownership, tax, lending, investment, portfolio-management, treasury-management, autonomous optimization, or market-prediction advice.",
  ];
}

function buildTrace(scoreBreakdown: EnterpriseInstitutionalCohesionScoreBreakdown, missingData: string[]) {
  return [
    "Normalized all numeric scores to a deterministic 0-100 scale.",
    "Derived optional fallback scores only from supplied in-memory intelligence profiles.",
    `Computed enterprise institutional cohesion from organizational cohesion (${scoreBreakdown.organizationalCohesionScore}), cross-functional cohesion (${scoreBreakdown.crossFunctionalCohesionScore}), governance (${scoreBreakdown.governanceCohesionScore}), operations (${scoreBreakdown.operationalCohesionScore}), expansion (${scoreBreakdown.expansionCohesionScore}), portfolio (${scoreBreakdown.portfolioCohesionScore}), communication (${scoreBreakdown.communicationCohesionScore}), institutional identity (${scoreBreakdown.institutionalIdentityScore}), scaling coherence (${scoreBreakdown.scalingCoherenceScore}), and fragmentation risk (${scoreBreakdown.fragmentationRiskScore}).`,
    missingData.length > 0 ? `Missing inputs flagged for human verification: ${missingData.join(", ")}.` : "No required structured inputs were missing.",
    "No outreach, SMS, email, Twilio, database writes, schema changes, workflow mutation, protected-class logic, demographic targeting, external APIs, scraping, autonomous strategy decisions, autonomous cohesion actions, autonomous optimization, autonomous execution, or autonomous management decisions were used.",
  ];
}

function buildAssumptions(input: EnterpriseInstitutionalCohesionInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0
      ? ["Missing enterprise institutional cohesion inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."]
      : []),
    "Enterprise institutional cohesion intelligence is deterministic, explainable, read-only, compliance-first, and designed for human review before any execution.",
    "This engine evaluates organizational cohesion, cross-functional cohesion, governance cohesion, operational cohesion, expansion cohesion, portfolio cohesion, communication/brand cohesion, institutional identity durability, scaling coherence, and fragmentation risk only.",
    "No outreach, SMS, email sending, Twilio, autonomous execution, autonomous strategy decisions, autonomous cohesion actions, autonomous optimization, autonomous management decisions, DB writes, schema changes, workflow mutations, external APIs, scraping, demographic data, or protected-class data were used.",
    "This is not legal advice, HR advice, ownership advice, tax advice, lending advice, investment advice, portfolio-management advice, treasury management, autonomous strategy, autonomous optimization, autonomous management, or market prediction.",
  ]);
}

export function analyzeEnterpriseInstitutionalCohesionIntelligence(
  input: EnterpriseInstitutionalCohesionInput = {},
): EnterpriseInstitutionalCohesionResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const institutionalCohesionLevel = classifyInstitutionalCohesion(scoreBreakdown.overallCohesionScore, scoreBreakdown.fragmentationRiskScore);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallCohesionScore: scoreBreakdown.overallCohesionScore,
    institutionalCohesionLevel,
    organizationalCohesionScore: scoreBreakdown.organizationalCohesionScore,
    crossFunctionalCohesionScore: scoreBreakdown.crossFunctionalCohesionScore,
    governanceCohesionScore: scoreBreakdown.governanceCohesionScore,
    operationalCohesionScore: scoreBreakdown.operationalCohesionScore,
    expansionCohesionScore: scoreBreakdown.expansionCohesionScore,
    portfolioCohesionScore: scoreBreakdown.portfolioCohesionScore,
    communicationCohesionScore: scoreBreakdown.communicationCohesionScore,
    institutionalIdentityScore: scoreBreakdown.institutionalIdentityScore,
    scalingCoherenceScore: scoreBreakdown.scalingCoherenceScore,
    fragmentationRiskScore: scoreBreakdown.fragmentationRiskScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown, missingData),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    cohesionWarnings: buildCohesionWarnings(scoreBreakdown, missingData),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input, missingData),
    explanation: buildExplanation({ scoreBreakdown, institutionalCohesionLevel }),
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
      autonomousCohesionActions: false,
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

export const getEnterpriseInstitutionalCohesionIntelligence = analyzeEnterpriseInstitutionalCohesionIntelligence;
