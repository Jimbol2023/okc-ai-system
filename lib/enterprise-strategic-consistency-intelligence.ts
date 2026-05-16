import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type StrategicConsistencyLevel = "incoherent" | "fragmented" | "developing" | "consistent" | "institutional";

export type EnterpriseStrategicConsistencyInput = {
  crossFunctionalConsistencyScore?: number;
  operationsConsistencyScore?: number;
  governanceConsistencyScore?: number;
  acquisitionConsistencyScore?: number;
  riskConsistencyScore?: number;
  expansionConsistencyScore?: number;
  portfolioConsistencyScore?: number;
  communicationConsistencyScore?: number;
  longHorizonConsistencyScore?: number;
  institutionalCoherenceScore?: number;
  enterpriseStrategicAlignmentProfile?: unknown;
  enterpriseStrategicDoctrineProfile?: unknown;
  enterpriseStrategicMemoryProfile?: unknown;
  enterpriseDecisionAuditProfile?: unknown;
  enterpriseInstitutionalLearningProfile?: unknown;
  operationalQaProcessDriftProfile?: unknown;
  enterpriseOperatingRhythmProfile?: unknown;
  enterpriseExpansionGovernanceProfile?: unknown;
  portfolioRiskBalancingProfile?: unknown;
  institutionalRelationshipProfile?: unknown;
  longHorizonWealthPreservationProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseStrategicConsistencyScoreBreakdown = CorridorScoreBreakdown & {
  overallConsistencyScore: number;
  crossFunctionalConsistencyScore: number;
  operationsConsistencyScore: number;
  governanceConsistencyScore: number;
  acquisitionConsistencyScore: number;
  riskConsistencyScore: number;
  expansionConsistencyScore: number;
  portfolioConsistencyScore: number;
  communicationConsistencyScore: number;
  longHorizonConsistencyScore: number;
  institutionalCoherenceScore: number;
};

export type EnterpriseStrategicConsistencyResult = {
  overallConsistencyScore: number;
  strategicConsistencyLevel: StrategicConsistencyLevel;
  crossFunctionalConsistencyScore: number;
  operationsConsistencyScore: number;
  governanceConsistencyScore: number;
  acquisitionConsistencyScore: number;
  riskConsistencyScore: number;
  expansionConsistencyScore: number;
  portfolioConsistencyScore: number;
  communicationConsistencyScore: number;
  longHorizonConsistencyScore: number;
  institutionalCoherenceScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseStrategicConsistencyScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  consistencyWarnings: string[];
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
    autonomousConsistencyActions: false;
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

const REQUIRED_INPUTS: Array<keyof EnterpriseStrategicConsistencyInput> = [
  "crossFunctionalConsistencyScore",
  "operationsConsistencyScore",
  "governanceConsistencyScore",
  "acquisitionConsistencyScore",
  "riskConsistencyScore",
  "expansionConsistencyScore",
  "portfolioConsistencyScore",
  "communicationConsistencyScore",
  "longHorizonConsistencyScore",
  "institutionalCoherenceScore",
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

function hasFallbackForInput(input: EnterpriseStrategicConsistencyInput, key: keyof EnterpriseStrategicConsistencyInput) {
  const alignmentProfile = input.enterpriseStrategicAlignmentProfile;
  const doctrineProfile = input.enterpriseStrategicDoctrineProfile;
  const memoryProfile = input.enterpriseStrategicMemoryProfile;
  const auditProfile = input.enterpriseDecisionAuditProfile;
  const learningProfile = input.enterpriseInstitutionalLearningProfile;
  const qaProfile = input.operationalQaProcessDriftProfile;
  const rhythmProfile = input.enterpriseOperatingRhythmProfile;
  const expansionProfile = input.enterpriseExpansionGovernanceProfile;
  const portfolioProfile = input.portfolioRiskBalancingProfile;
  const relationshipProfile = input.institutionalRelationshipProfile;
  const preservationProfile = input.longHorizonWealthPreservationProfile;

  const fallbackPaths: Partial<Record<keyof EnterpriseStrategicConsistencyInput, boolean>> = {
    crossFunctionalConsistencyScore:
      hasProfileScore(alignmentProfile, ["overallAlignmentScore"]) ||
      hasProfileScore(doctrineProfile, ["overallDoctrineScore"]) ||
      hasProfileScore(auditProfile, ["strategicAlignmentScore"]),
    operationsConsistencyScore:
      hasProfileScore(alignmentProfile, ["operationsAlignmentScore"]) ||
      hasProfileScore(qaProfile, ["overallOperationalConsistencyScore", "workflowConsistencyScore"]) ||
      hasProfileScore(rhythmProfile, ["operationalTempoScore"]),
    governanceConsistencyScore:
      hasProfileScore(alignmentProfile, ["governanceAlignmentScore"]) ||
      hasProfileScore(auditProfile, ["governanceAlignmentScore", "reviewDisciplineScore"]) ||
      hasProfileScore(expansionProfile, ["humanReviewGovernanceAlignment"]),
    acquisitionConsistencyScore:
      hasProfileScore(alignmentProfile, ["acquisitionAlignmentScore"]) ||
      hasProfileScore(doctrineProfile, ["acquisitionDoctrineScore"]) ||
      hasProfileScore(learningProfile, ["dealOutcomeLearningScore"]),
    riskConsistencyScore:
      hasProfileScore(alignmentProfile, ["riskAlignmentScore"]) ||
      hasProfileScore(doctrineProfile, ["riskDoctrineScore"]) ||
      hasProfileScore(portfolioProfile, ["riskBalanceQuality", "riskAdjustedPortfolioQuality"]),
    expansionConsistencyScore:
      hasProfileScore(alignmentProfile, ["expansionAlignmentScore"]) ||
      hasProfileScore(expansionProfile, ["expansionControlQuality", "expansionOversightQuality"]) ||
      hasProfileScore(doctrineProfile, ["expansionDoctrineScore"]),
    portfolioConsistencyScore:
      hasProfileScore(alignmentProfile, ["portfolioAlignmentScore"]) ||
      hasProfileScore(portfolioProfile, ["riskAdjustedPortfolioQuality", "diversificationEffectiveness"]) ||
      hasProfileScore(memoryProfile, ["portfolioStrategyMemoryScore"]),
    communicationConsistencyScore:
      hasProfileScore(alignmentProfile, ["brandTrustAlignmentScore"]) ||
      hasProfileScore(relationshipProfile, ["communicationStability", "institutionalTrustReadiness"]) ||
      hasProfileScore(qaProfile, ["communicationConsistencyScore"]),
    longHorizonConsistencyScore:
      hasProfileScore(alignmentProfile, ["longHorizonAlignmentScore"]) ||
      hasProfileScore(memoryProfile, ["longHorizonContinuityScore"]) ||
      hasProfileScore(preservationProfile, ["longHorizonPreservationQuality"]),
    institutionalCoherenceScore:
      hasProfileScore(alignmentProfile, ["overallAlignmentScore"]) ||
      hasProfileScore(memoryProfile, ["enterpriseMemoryMaturityScore"]) ||
      hasProfileScore(learningProfile, ["continuousLearningMaturityScore"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: EnterpriseStrategicConsistencyInput) {
  const labels: Record<keyof EnterpriseStrategicConsistencyInput, string> = {
    crossFunctionalConsistencyScore: "cross-functional strategic consistency score",
    operationsConsistencyScore: "operations consistency score",
    governanceConsistencyScore: "governance consistency score",
    acquisitionConsistencyScore: "acquisition consistency score",
    riskConsistencyScore: "risk posture consistency score",
    expansionConsistencyScore: "expansion consistency score",
    portfolioConsistencyScore: "portfolio behavior consistency score",
    communicationConsistencyScore: "communication/brand consistency score",
    longHorizonConsistencyScore: "long-horizon consistency score",
    institutionalCoherenceScore: "institutional coherence maturity score",
    enterpriseStrategicAlignmentProfile: "enterprise strategic alignment profile",
    enterpriseStrategicDoctrineProfile: "enterprise strategic doctrine profile",
    enterpriseStrategicMemoryProfile: "enterprise strategic memory profile",
    enterpriseDecisionAuditProfile: "enterprise decision audit profile",
    enterpriseInstitutionalLearningProfile: "enterprise institutional learning profile",
    operationalQaProcessDriftProfile: "operational QA/process drift profile",
    enterpriseOperatingRhythmProfile: "enterprise operating rhythm profile",
    enterpriseExpansionGovernanceProfile: "enterprise expansion governance profile",
    portfolioRiskBalancingProfile: "portfolio risk balancing profile",
    institutionalRelationshipProfile: "institutional relationship profile",
    longHorizonWealthPreservationProfile: "long-horizon wealth preservation profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: EnterpriseStrategicConsistencyInput): EnterpriseStrategicConsistencyScoreBreakdown {
  const alignmentProfile = input.enterpriseStrategicAlignmentProfile;
  const doctrineProfile = input.enterpriseStrategicDoctrineProfile;
  const memoryProfile = input.enterpriseStrategicMemoryProfile;
  const auditProfile = input.enterpriseDecisionAuditProfile;
  const learningProfile = input.enterpriseInstitutionalLearningProfile;
  const qaProfile = input.operationalQaProcessDriftProfile;
  const rhythmProfile = input.enterpriseOperatingRhythmProfile;
  const expansionProfile = input.enterpriseExpansionGovernanceProfile;
  const portfolioProfile = input.portfolioRiskBalancingProfile;
  const relationshipProfile = input.institutionalRelationshipProfile;
  const preservationProfile = input.longHorizonWealthPreservationProfile;
  const operationsConsistencyScore = getScore(
    input.operationsConsistencyScore,
    weightedAverage([
      [extractProfileScore(alignmentProfile, ["operationsAlignmentScore", "scoreBreakdown.operationsAlignmentScore"], 54), 0.22],
      [extractProfileScore(qaProfile, ["overallOperationalConsistencyScore", "scoreBreakdown.overallOperationalConsistencyScore"], 54), 0.18],
      [extractProfileScore(qaProfile, ["workflowConsistencyScore", "scoreBreakdown.workflowConsistencyScore"], 54), 0.14],
      [extractProfileScore(rhythmProfile, ["operationalTempoScore", "scoreBreakdown.operationalTempoScore"], 54), 0.12],
      [extractProfileScore(doctrineProfile, ["operatingPhilosophyScore"], 54), 0.12],
      [extractProfileScore(learningProfile, ["processImprovementLearningScore"], 54), 0.1],
      [extractProfileScore(auditProfile, ["reviewDisciplineScore"], 54), 0.12],
    ]),
  );
  const governanceConsistencyScore = getScore(
    input.governanceConsistencyScore,
    weightedAverage([
      [extractProfileScore(alignmentProfile, ["governanceAlignmentScore", "scoreBreakdown.governanceAlignmentScore"], 54), 0.22],
      [extractProfileScore(auditProfile, ["governanceAlignmentScore", "scoreBreakdown.governanceAlignmentScore"], 54), 0.18],
      [extractProfileScore(auditProfile, ["reviewDisciplineScore"], 54), 0.12],
      [extractProfileScore(expansionProfile, ["humanReviewGovernanceAlignment", "scoreBreakdown.humanReviewGovernanceAlignmentScore"], 54), 0.14],
      [extractProfileScore(doctrineProfile, ["governanceDoctrineScore"], 54), 0.12],
      [extractProfileScore(memoryProfile, ["governanceMemoryDurabilityScore"], 54), 0.1],
      [operationsConsistencyScore, 0.12],
    ]),
  );
  const acquisitionConsistencyScore = getScore(
    input.acquisitionConsistencyScore,
    weightedAverage([
      [extractProfileScore(alignmentProfile, ["acquisitionAlignmentScore", "scoreBreakdown.acquisitionAlignmentScore"], 54), 0.24],
      [extractProfileScore(doctrineProfile, ["acquisitionDoctrineScore", "scoreBreakdown.acquisitionDoctrineScore"], 54), 0.16],
      [extractProfileScore(learningProfile, ["dealOutcomeLearningScore", "scoreBreakdown.dealOutcomeLearningScore"], 54), 0.12],
      [extractProfileScore(auditProfile, ["strategicAlignmentScore"], 54), 0.12],
      [extractProfileScore(expansionProfile, ["approvalProcessDurability"], 54), 0.12],
      [operationsConsistencyScore, 0.12],
      [governanceConsistencyScore, 0.12],
    ]),
  );
  const riskConsistencyScore = getScore(
    input.riskConsistencyScore,
    weightedAverage([
      [extractProfileScore(alignmentProfile, ["riskAlignmentScore", "scoreBreakdown.riskAlignmentScore"], 54), 0.24],
      [extractProfileScore(doctrineProfile, ["riskDoctrineScore", "scoreBreakdown.riskDoctrineScore"], 54), 0.16],
      [extractProfileScore(portfolioProfile, ["riskBalanceQuality", "scoreBreakdown.riskBalanceQualityScore"], 54), 0.14],
      [extractProfileScore(portfolioProfile, ["riskAdjustedPortfolioQuality"], 54), 0.12],
      [extractProfileScore(preservationProfile, ["riskAdjustedPreservationQuality"], 54), 0.12],
      [governanceConsistencyScore, 0.1],
      [extractProfileScore(auditProfile, ["governanceAlignmentScore"], 54), 0.12],
    ]),
  );
  const expansionConsistencyScore = getScore(
    input.expansionConsistencyScore,
    weightedAverage([
      [extractProfileScore(alignmentProfile, ["expansionAlignmentScore", "scoreBreakdown.expansionAlignmentScore"], 54), 0.24],
      [extractProfileScore(expansionProfile, ["expansionControlQuality", "scoreBreakdown.expansionControlQualityScore"], 54), 0.18],
      [extractProfileScore(expansionProfile, ["expansionOversightQuality", "scoreBreakdown.expansionOversightQualityScore"], 54), 0.16],
      [extractProfileScore(doctrineProfile, ["expansionDoctrineScore"], 54), 0.12],
      [acquisitionConsistencyScore, 0.1],
      [riskConsistencyScore, 0.1],
      [governanceConsistencyScore, 0.1],
    ]),
  );
  const portfolioConsistencyScore = getScore(
    input.portfolioConsistencyScore,
    weightedAverage([
      [extractProfileScore(alignmentProfile, ["portfolioAlignmentScore", "scoreBreakdown.portfolioAlignmentScore"], 54), 0.22],
      [extractProfileScore(portfolioProfile, ["riskAdjustedPortfolioQuality", "scoreBreakdown.riskAdjustedPortfolioQualityScore"], 54), 0.16],
      [extractProfileScore(portfolioProfile, ["diversificationEffectiveness", "scoreBreakdown.diversificationEffectivenessScore"], 54), 0.14],
      [extractProfileScore(memoryProfile, ["portfolioStrategyMemoryScore"], 54), 0.12],
      [riskConsistencyScore, 0.12],
      [governanceConsistencyScore, 0.1],
      [extractProfileScore(doctrineProfile, ["longHorizonDoctrineScore"], 54), 0.08],
      [extractProfileScore(auditProfile, ["strategicAlignmentScore"], 54), 0.06],
    ]),
  );
  const communicationConsistencyScore = getScore(
    input.communicationConsistencyScore,
    weightedAverage([
      [extractProfileScore(alignmentProfile, ["brandTrustAlignmentScore", "scoreBreakdown.brandTrustAlignmentScore"], 54), 0.22],
      [extractProfileScore(relationshipProfile, ["communicationStability", "scoreBreakdown.communicationStabilityScore"], 54), 0.18],
      [extractProfileScore(relationshipProfile, ["institutionalTrustReadiness", "scoreBreakdown.institutionalTrustReadinessScore"], 54), 0.14],
      [extractProfileScore(qaProfile, ["communicationConsistencyScore", "scoreBreakdown.communicationConsistencyScore"], 54), 0.14],
      [extractProfileScore(doctrineProfile, ["brandTrustDoctrineScore"], 54), 0.12],
      [governanceConsistencyScore, 0.1],
      [operationsConsistencyScore, 0.1],
    ]),
  );
  const longHorizonConsistencyScore = getScore(
    input.longHorizonConsistencyScore,
    weightedAverage([
      [extractProfileScore(alignmentProfile, ["longHorizonAlignmentScore", "scoreBreakdown.longHorizonAlignmentScore"], 54), 0.22],
      [extractProfileScore(memoryProfile, ["longHorizonContinuityScore", "scoreBreakdown.longHorizonContinuityScore"], 54), 0.16],
      [extractProfileScore(preservationProfile, ["longHorizonPreservationQuality", "scoreBreakdown.longHorizonPreservationQualityScore"], 54), 0.16],
      [extractProfileScore(doctrineProfile, ["longHorizonDoctrineScore"], 54), 0.14],
      [portfolioConsistencyScore, 0.1],
      [governanceConsistencyScore, 0.1],
      [riskConsistencyScore, 0.06],
      [expansionConsistencyScore, 0.06],
    ]),
  );
  const crossFunctionalConsistencyScore = getScore(
    input.crossFunctionalConsistencyScore,
    weightedAverage([
      [operationsConsistencyScore, 0.12],
      [governanceConsistencyScore, 0.12],
      [acquisitionConsistencyScore, 0.1],
      [riskConsistencyScore, 0.11],
      [expansionConsistencyScore, 0.1],
      [portfolioConsistencyScore, 0.1],
      [communicationConsistencyScore, 0.09],
      [longHorizonConsistencyScore, 0.1],
      [extractProfileScore(alignmentProfile, ["overallAlignmentScore", "scoreBreakdown.overallAlignmentScore"], 54), 0.08],
      [extractProfileScore(doctrineProfile, ["overallDoctrineScore"], 54), 0.08],
    ]),
  );
  const institutionalCoherenceScore = getScore(
    input.institutionalCoherenceScore,
    weightedAverage([
      [crossFunctionalConsistencyScore, 0.18],
      [extractProfileScore(alignmentProfile, ["overallAlignmentScore"], 54), 0.14],
      [extractProfileScore(memoryProfile, ["enterpriseMemoryMaturityScore", "scoreBreakdown.enterpriseMemoryMaturityScore"], 54), 0.14],
      [extractProfileScore(learningProfile, ["continuousLearningMaturityScore", "scoreBreakdown.continuousLearningMaturityScore"], 54), 0.12],
      [governanceConsistencyScore, 0.12],
      [operationsConsistencyScore, 0.1],
      [longHorizonConsistencyScore, 0.1],
      [communicationConsistencyScore, 0.1],
    ]),
  );
  const overallConsistencyScore = weightedAverage([
    [crossFunctionalConsistencyScore, 0.12],
    [operationsConsistencyScore, 0.11],
    [governanceConsistencyScore, 0.12],
    [acquisitionConsistencyScore, 0.1],
    [riskConsistencyScore, 0.11],
    [expansionConsistencyScore, 0.1],
    [portfolioConsistencyScore, 0.1],
    [communicationConsistencyScore, 0.08],
    [longHorizonConsistencyScore, 0.08],
    [institutionalCoherenceScore, 0.08],
  ]);

  return {
    connectivityScore: communicationConsistencyScore,
    durabilityScore: overallConsistencyScore,
    expansionScore: expansionConsistencyScore,
    institutionalScore: institutionalCoherenceScore,
    logisticsScore: operationsConsistencyScore,
    luxuryScore: acquisitionConsistencyScore,
    developmentScore: longHorizonConsistencyScore,
    overallConsistencyScore,
    crossFunctionalConsistencyScore,
    operationsConsistencyScore,
    governanceConsistencyScore,
    acquisitionConsistencyScore,
    riskConsistencyScore,
    expansionConsistencyScore,
    portfolioConsistencyScore,
    communicationConsistencyScore,
    longHorizonConsistencyScore,
    institutionalCoherenceScore,
  };
}

function classifyStrategicConsistency(score: number): StrategicConsistencyLevel {
  if (score >= 82) return "institutional";
  if (score >= 68) return "consistent";
  if (score >= 54) return "developing";
  if (score >= 40) return "fragmented";

  return "incoherent";
}

function buildWarnings(scoreBreakdown: EnterpriseStrategicConsistencyScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "STRATEGIC_CONSISTENCY_DATA_INCOMPLETE",
            severity: missingData.length >= 5 ? "high" : "medium",
            message: "Enterprise strategic consistency assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.overallConsistencyScore < 42
      ? [
          createCorridorWarning({
            code: "STRATEGIC_CONSISTENCY_INCOHERENT",
            severity: "high",
            message: "Overall enterprise strategic consistency appears incoherent under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.crossFunctionalConsistencyScore < 45
      ? [
          createCorridorWarning({
            code: "CROSS_FUNCTIONAL_CONSISTENCY_WEAK",
            severity: "medium",
            message: "Cross-functional strategic consistency is weak and requires human review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.riskConsistencyScore < 45 || scoreBreakdown.portfolioConsistencyScore < 45
      ? [
          createCorridorWarning({
            code: "RISK_PORTFOLIO_CONSISTENCY_WEAK",
            severity: "medium",
            message: "Risk or portfolio consistency is weak; no investment, lending, or portfolio-management advice is provided.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
  ];
}

function buildConsistencyWarnings(scoreBreakdown: EnterpriseStrategicConsistencyScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.crossFunctionalConsistencyScore < 55 ? ["Cross-functional strategic consistency may be fragmented across operating domains."] : []),
    ...(scoreBreakdown.operationsConsistencyScore < 55 ? ["Operations may be inconsistent with enterprise doctrine and operating philosophy."] : []),
    ...(scoreBreakdown.governanceConsistencyScore < 55 ? ["Governance behavior consistency may require human review."] : []),
    ...(scoreBreakdown.acquisitionConsistencyScore < 55 ? ["Acquisition consistency may be underdeveloped."] : []),
    ...(scoreBreakdown.riskConsistencyScore < 55 ? ["Risk posture consistency may be underdeveloped; no regulated advice is produced."] : []),
    ...(scoreBreakdown.expansionConsistencyScore < 55 ? ["Expansion activity consistency may be underdeveloped."] : []),
    ...(scoreBreakdown.portfolioConsistencyScore < 55
      ? ["Portfolio behavior consistency may be underdeveloped; no investment or portfolio-management advice is produced."]
      : []),
    ...(scoreBreakdown.communicationConsistencyScore < 55 ? ["Communication/brand consistency may be fragmented; no outreach automation is triggered."] : []),
    ...(scoreBreakdown.longHorizonConsistencyScore < 55 ? ["Long-horizon consistency may be underdeveloped."] : []),
    ...(scoreBreakdown.institutionalCoherenceScore < 55 ? ["Institutional coherence maturity may be too thin for durable strategic behavior."] : []),
    ...(missingData.length > 0 ? ["Consistency warnings require human validation because required structured inputs are incomplete."] : []),
  ]);
}

function buildReusableInfrastructureNotes(input: EnterpriseStrategicConsistencyInput, missingData: string[]) {
  return unique([
    "Reuses shared corridor score normalization, warning creation, confidence scoring, missing-data handling, and read-only score breakdown conventions.",
    "Consumes optional in-memory intelligence profiles only; no persistence, external API calls, scraping, routing, orchestration, or automation execution is introduced.",
    ...(input.enterpriseStrategicAlignmentProfile ? ["Enterprise strategic alignment profile supplied as reusable strategic consistency context."] : []),
    ...(input.enterpriseStrategicDoctrineProfile ? ["Enterprise strategic doctrine profile supplied as reusable doctrine baseline."] : []),
    ...(input.operationalQaProcessDriftProfile ? ["Operational QA/process drift profile supplied as reusable operations consistency context."] : []),
    ...(input.portfolioRiskBalancingProfile ? ["Portfolio risk balancing profile supplied as read-only portfolio consistency context without portfolio-management behavior."] : []),
    ...(missingData.length > 0 ? ["Reusable profile coverage is incomplete, so conservative deterministic defaults and human verification remain required."] : []),
  ]);
}

function buildKeyRisks(scoreBreakdown: EnterpriseStrategicConsistencyScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.overallConsistencyScore < 50 ? ["Overall enterprise strategic consistency is weak."] : []),
    ...(scoreBreakdown.crossFunctionalConsistencyScore < 50 ? ["Cross-functional strategic consistency is weak."] : []),
    ...(scoreBreakdown.operationsConsistencyScore < 50 ? ["Operations consistency is weak."] : []),
    ...(scoreBreakdown.governanceConsistencyScore < 50 ? ["Governance consistency is weak."] : []),
    ...(scoreBreakdown.acquisitionConsistencyScore < 50 ? ["Acquisition consistency is weak."] : []),
    ...(scoreBreakdown.riskConsistencyScore < 50 ? ["Risk posture consistency is weak."] : []),
    ...(scoreBreakdown.expansionConsistencyScore < 50 ? ["Expansion consistency is weak."] : []),
    ...(scoreBreakdown.portfolioConsistencyScore < 50 ? ["Portfolio behavior consistency is weak."] : []),
    ...(scoreBreakdown.communicationConsistencyScore < 50 ? ["Communication/brand consistency is weak."] : []),
    ...(scoreBreakdown.longHorizonConsistencyScore < 50 ? ["Long-horizon consistency is weak."] : []),
    ...(scoreBreakdown.institutionalCoherenceScore < 50 ? ["Institutional coherence maturity is weak."] : []),
    ...(missingData.length > 0 ? `Missing data reduces confidence: ${missingData.slice(0, 4).join(", ")}.` : []),
  ]);
}

function buildStrengths(scoreBreakdown: EnterpriseStrategicConsistencyScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.overallConsistencyScore >= 70 ? ["Overall enterprise strategic consistency is strong."] : []),
    ...(scoreBreakdown.crossFunctionalConsistencyScore >= 70 ? ["Cross-functional strategic consistency is strong."] : []),
    ...(scoreBreakdown.operationsConsistencyScore >= 70 ? ["Operations consistency is strong."] : []),
    ...(scoreBreakdown.governanceConsistencyScore >= 70 ? ["Governance consistency is strong."] : []),
    ...(scoreBreakdown.acquisitionConsistencyScore >= 70 ? ["Acquisition consistency is strong."] : []),
    ...(scoreBreakdown.riskConsistencyScore >= 70 ? ["Risk posture consistency is strong."] : []),
    ...(scoreBreakdown.expansionConsistencyScore >= 70 ? ["Expansion consistency is strong."] : []),
    ...(scoreBreakdown.portfolioConsistencyScore >= 70 ? ["Portfolio behavior consistency is strong."] : []),
    ...(scoreBreakdown.communicationConsistencyScore >= 70 ? ["Communication/brand consistency is strong."] : []),
    ...(scoreBreakdown.longHorizonConsistencyScore >= 70 ? ["Long-horizon consistency is strong."] : []),
    ...(scoreBreakdown.institutionalCoherenceScore >= 70 ? ["Institutional coherence maturity is strong."] : []),
  ]);
}

function buildRecommendations(scoreBreakdown: EnterpriseStrategicConsistencyScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.crossFunctionalConsistencyScore < 58 ? ["Review cross-functional strategic consistency and document human-reviewed coherence gaps."] : []),
    ...(scoreBreakdown.operationsConsistencyScore < 58 ? ["Review operations consistency against enterprise doctrine and operating philosophy."] : []),
    ...(scoreBreakdown.governanceConsistencyScore < 58 ? ["Review governance consistency; this is not legal, HR, ownership, or tax advice."] : []),
    ...(scoreBreakdown.acquisitionConsistencyScore < 58
      ? ["Review acquisition consistency without making investment, lending, allocation, or portfolio-management recommendations."]
      : []),
    ...(scoreBreakdown.riskConsistencyScore < 58
      ? ["Review risk posture consistency without creating investment, lending, insurance, legal, or portfolio-management advice."]
      : []),
    ...(scoreBreakdown.expansionConsistencyScore < 58 ? ["Review expansion consistency without autonomous strategy decisions or execution."] : []),
    ...(scoreBreakdown.portfolioConsistencyScore < 58
      ? ["Review portfolio behavior consistency without making investment, allocation, lending, or portfolio-management recommendations."]
      : []),
    ...(scoreBreakdown.communicationConsistencyScore < 58
      ? ["Review communication/brand consistency without outreach, SMS, email, Twilio, CRM automation, or relationship manipulation."]
      : []),
    ...(scoreBreakdown.longHorizonConsistencyScore < 58 ? ["Review long-horizon consistency and preserve human-reviewed doctrine context."] : []),
    ...(scoreBreakdown.institutionalCoherenceScore < 58 ? ["Review institutional coherence maturity and identify strategic behavior variance."] : []),
    "Keep strategic-consistency improvements human-reviewed; this module does not provide autonomous strategy decisions, legal, HR, ownership, tax, lending, investment, portfolio-management, treasury-management, or market-prediction advice.",
  ]);
}

function buildExplanation(params: { scoreBreakdown: EnterpriseStrategicConsistencyScoreBreakdown; strategicConsistencyLevel: StrategicConsistencyLevel }) {
  const scoreBreakdown = params.scoreBreakdown;

  return [
    `Strategic consistency level is ${params.strategicConsistencyLevel} with an overall consistency score of ${scoreBreakdown.overallConsistencyScore}/100.`,
    `Cross-functional consistency is ${scoreBreakdown.crossFunctionalConsistencyScore}/100, governance consistency is ${scoreBreakdown.governanceConsistencyScore}/100, and institutional coherence is ${scoreBreakdown.institutionalCoherenceScore}/100.`,
    "Cross-functional consistency, operations, governance, acquisitions, risk posture, expansion, portfolio behavior, communication/brand standards, long-horizon consistency, and institutional coherence were scored deterministically from structured inputs and optional read-only profile fallbacks.",
    "This output identifies strategic consistency and coherence gaps only and does not provide autonomous strategy decisions, legal, HR, ownership, tax, lending, investment, portfolio-management, treasury-management, autonomous optimization, or market-prediction advice.",
  ];
}

function buildTrace(scoreBreakdown: EnterpriseStrategicConsistencyScoreBreakdown, missingData: string[]) {
  return [
    "Normalized all numeric scores to a deterministic 0-100 scale.",
    "Derived optional fallback scores only from supplied in-memory intelligence profiles.",
    `Computed enterprise strategic consistency from cross-functional consistency (${scoreBreakdown.crossFunctionalConsistencyScore}), operations (${scoreBreakdown.operationsConsistencyScore}), governance (${scoreBreakdown.governanceConsistencyScore}), acquisition (${scoreBreakdown.acquisitionConsistencyScore}), risk (${scoreBreakdown.riskConsistencyScore}), expansion (${scoreBreakdown.expansionConsistencyScore}), portfolio (${scoreBreakdown.portfolioConsistencyScore}), communication (${scoreBreakdown.communicationConsistencyScore}), long-horizon consistency (${scoreBreakdown.longHorizonConsistencyScore}), and institutional coherence (${scoreBreakdown.institutionalCoherenceScore}).`,
    missingData.length > 0 ? `Missing inputs flagged for human verification: ${missingData.join(", ")}.` : "No required structured inputs were missing.",
    "No outreach, SMS, email, Twilio, database writes, schema changes, workflow mutation, protected-class logic, demographic targeting, external APIs, scraping, autonomous strategy decisions, autonomous consistency actions, autonomous optimization, autonomous execution, or autonomous management decisions were used.",
  ];
}

function buildAssumptions(input: EnterpriseStrategicConsistencyInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0
      ? ["Missing enterprise strategic consistency inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."]
      : []),
    "Enterprise strategic consistency intelligence is deterministic, explainable, read-only, compliance-first, and designed for human review before any execution.",
    "This engine evaluates strategic consistency across operations, governance, acquisitions, risk posture, expansion, portfolio behavior, communication standards, long-horizon behavior, and institutional coherence only.",
    "No outreach, SMS, email sending, Twilio, autonomous execution, autonomous strategy decisions, autonomous consistency actions, autonomous optimization, autonomous management decisions, DB writes, schema changes, workflow mutations, external APIs, scraping, demographic data, or protected-class data were used.",
    "This is not legal advice, HR advice, ownership advice, tax advice, lending advice, investment advice, portfolio-management advice, treasury management, autonomous strategy, autonomous optimization, autonomous management, or market prediction.",
  ]);
}

export function analyzeEnterpriseStrategicConsistencyIntelligence(
  input: EnterpriseStrategicConsistencyInput = {},
): EnterpriseStrategicConsistencyResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const strategicConsistencyLevel = classifyStrategicConsistency(scoreBreakdown.overallConsistencyScore);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallConsistencyScore: scoreBreakdown.overallConsistencyScore,
    strategicConsistencyLevel,
    crossFunctionalConsistencyScore: scoreBreakdown.crossFunctionalConsistencyScore,
    operationsConsistencyScore: scoreBreakdown.operationsConsistencyScore,
    governanceConsistencyScore: scoreBreakdown.governanceConsistencyScore,
    acquisitionConsistencyScore: scoreBreakdown.acquisitionConsistencyScore,
    riskConsistencyScore: scoreBreakdown.riskConsistencyScore,
    expansionConsistencyScore: scoreBreakdown.expansionConsistencyScore,
    portfolioConsistencyScore: scoreBreakdown.portfolioConsistencyScore,
    communicationConsistencyScore: scoreBreakdown.communicationConsistencyScore,
    longHorizonConsistencyScore: scoreBreakdown.longHorizonConsistencyScore,
    institutionalCoherenceScore: scoreBreakdown.institutionalCoherenceScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown, missingData),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    consistencyWarnings: buildConsistencyWarnings(scoreBreakdown, missingData),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input, missingData),
    explanation: buildExplanation({ scoreBreakdown, strategicConsistencyLevel }),
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
      autonomousConsistencyActions: false,
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

export const getEnterpriseStrategicConsistencyIntelligence = analyzeEnterpriseStrategicConsistencyIntelligence;
