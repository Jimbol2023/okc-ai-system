import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type StrategicMemoryLevel = "fragile" | "thin" | "developing" | "durable" | "institutional";

export type EnterpriseStrategicMemoryInput = {
  doctrinePreservationScore?: number;
  historicalDecisionRetentionScore?: number;
  organizationalPatternMemoryScore?: number;
  governanceMemoryDurabilityScore?: number;
  portfolioStrategyMemoryScore?: number;
  institutionalLessonRetentionScore?: number;
  continuityMemoryScore?: number;
  strategicContextPreservationScore?: number;
  longHorizonContinuityScore?: number;
  enterpriseMemoryMaturityScore?: number;
  enterpriseInstitutionalLearningProfile?: unknown;
  institutionalKnowledgeTransferProfile?: unknown;
  enterpriseDecisionAuditProfile?: unknown;
  legacyContinuityProfile?: unknown;
  familyOfficeGovernanceProfile?: unknown;
  longHorizonWealthPreservationProfile?: unknown;
  portfolioRiskBalancingProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseStrategicMemoryScoreBreakdown = CorridorScoreBreakdown & {
  overallStrategicMemoryScore: number;
  doctrinePreservationScore: number;
  historicalDecisionRetentionScore: number;
  organizationalPatternMemoryScore: number;
  governanceMemoryDurabilityScore: number;
  portfolioStrategyMemoryScore: number;
  institutionalLessonRetentionScore: number;
  continuityMemoryScore: number;
  strategicContextPreservationScore: number;
  longHorizonContinuityScore: number;
  enterpriseMemoryMaturityScore: number;
};

export type EnterpriseStrategicMemoryResult = {
  overallStrategicMemoryScore: number;
  strategicMemoryLevel: StrategicMemoryLevel;
  doctrinePreservationScore: number;
  historicalDecisionRetentionScore: number;
  organizationalPatternMemoryScore: number;
  governanceMemoryDurabilityScore: number;
  portfolioStrategyMemoryScore: number;
  institutionalLessonRetentionScore: number;
  continuityMemoryScore: number;
  strategicContextPreservationScore: number;
  longHorizonContinuityScore: number;
  enterpriseMemoryMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseStrategicMemoryScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  memoryWarnings: string[];
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
    autonomousLearningActions: false;
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

const REQUIRED_INPUTS: Array<keyof EnterpriseStrategicMemoryInput> = [
  "doctrinePreservationScore",
  "historicalDecisionRetentionScore",
  "organizationalPatternMemoryScore",
  "governanceMemoryDurabilityScore",
  "portfolioStrategyMemoryScore",
  "institutionalLessonRetentionScore",
  "continuityMemoryScore",
  "strategicContextPreservationScore",
  "longHorizonContinuityScore",
  "enterpriseMemoryMaturityScore",
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

function hasFallbackForInput(input: EnterpriseStrategicMemoryInput, key: keyof EnterpriseStrategicMemoryInput) {
  const learningProfile = input.enterpriseInstitutionalLearningProfile;
  const knowledgeProfile = input.institutionalKnowledgeTransferProfile;
  const auditProfile = input.enterpriseDecisionAuditProfile;
  const legacyProfile = input.legacyContinuityProfile;
  const governanceProfile = input.familyOfficeGovernanceProfile;
  const preservationProfile = input.longHorizonWealthPreservationProfile;
  const portfolioProfile = input.portfolioRiskBalancingProfile;

  const fallbackPaths: Partial<Record<keyof EnterpriseStrategicMemoryInput, boolean>> = {
    doctrinePreservationScore:
      hasProfileScore(legacyProfile, ["strategicDoctrinePreservationScore", "scoreBreakdown.strategicDoctrinePreservationScore"]) ||
      hasProfileScore(preservationProfile, ["strategicPreservationStability"]),
    historicalDecisionRetentionScore:
      hasProfileScore(knowledgeProfile, ["decisionHistoryPreservationScore", "scoreBreakdown.decisionHistoryPreservationScore"]) ||
      hasProfileScore(auditProfile, ["traceabilityScore"]),
    organizationalPatternMemoryScore:
      hasProfileScore(learningProfile, ["operationalLessonCaptureScore", "institutionalLearningScore"]) ||
      hasProfileScore(auditProfile, ["outcomeReviewScore"]),
    governanceMemoryDurabilityScore:
      hasProfileScore(governanceProfile, ["governanceDocumentationReadiness", "decisionAccountability"]) ||
      hasProfileScore(auditProfile, ["governanceAlignmentScore"]),
    portfolioStrategyMemoryScore:
      hasProfileScore(portfolioProfile, ["diversificationEffectiveness", "riskAdjustedPortfolioQuality"]) ||
      hasProfileScore(governanceProfile, ["riskOversightDiscipline"]),
    institutionalLessonRetentionScore:
      hasProfileScore(learningProfile, ["memoryReinforcementScore", "decisionLearningScore"]) ||
      hasProfileScore(knowledgeProfile, ["institutionalMemoryScore"]),
    continuityMemoryScore:
      hasProfileScore(legacyProfile, ["institutionalMemoryScore", "overallContinuityScore"]) ||
      hasProfileScore(knowledgeProfile, ["continuityHandoffScore"]),
    strategicContextPreservationScore:
      hasProfileScore(learningProfile, ["governanceLearningScore", "decisionLearningScore"]) ||
      hasProfileScore(preservationProfile, ["strategicPreservationStability"]),
    longHorizonContinuityScore:
      hasProfileScore(preservationProfile, ["longHorizonPreservationQuality", "institutionalContinuityDurability"]) ||
      hasProfileScore(legacyProfile, ["overallContinuityScore"]),
    enterpriseMemoryMaturityScore:
      hasProfileScore(learningProfile, ["overallLearningScore", "continuousLearningMaturityScore"]) ||
      hasProfileScore(knowledgeProfile, ["institutionalMemoryScore"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: EnterpriseStrategicMemoryInput) {
  const labels: Record<keyof EnterpriseStrategicMemoryInput, string> = {
    doctrinePreservationScore: "strategic doctrine preservation score",
    historicalDecisionRetentionScore: "historical decision retention score",
    organizationalPatternMemoryScore: "organizational pattern memory score",
    governanceMemoryDurabilityScore: "governance memory durability score",
    portfolioStrategyMemoryScore: "portfolio strategy memory score",
    institutionalLessonRetentionScore: "institutional lesson retention score",
    continuityMemoryScore: "continuity memory quality score",
    strategicContextPreservationScore: "strategic context preservation score",
    longHorizonContinuityScore: "long-horizon intelligence continuity score",
    enterpriseMemoryMaturityScore: "enterprise memory maturity score",
    enterpriseInstitutionalLearningProfile: "enterprise institutional learning profile",
    institutionalKnowledgeTransferProfile: "institutional knowledge transfer profile",
    enterpriseDecisionAuditProfile: "enterprise decision audit profile",
    legacyContinuityProfile: "legacy continuity profile",
    familyOfficeGovernanceProfile: "family office governance profile",
    longHorizonWealthPreservationProfile: "long-horizon wealth preservation profile",
    portfolioRiskBalancingProfile: "portfolio risk balancing profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: EnterpriseStrategicMemoryInput): EnterpriseStrategicMemoryScoreBreakdown {
  const learningProfile = input.enterpriseInstitutionalLearningProfile;
  const knowledgeProfile = input.institutionalKnowledgeTransferProfile;
  const auditProfile = input.enterpriseDecisionAuditProfile;
  const legacyProfile = input.legacyContinuityProfile;
  const governanceProfile = input.familyOfficeGovernanceProfile;
  const preservationProfile = input.longHorizonWealthPreservationProfile;
  const portfolioProfile = input.portfolioRiskBalancingProfile;
  const historicalDecisionRetentionScore = getScore(
    input.historicalDecisionRetentionScore,
    weightedAverage([
      [extractProfileScore(knowledgeProfile, ["decisionHistoryPreservationScore", "scoreBreakdown.decisionHistoryPreservationScore"], 54), 0.32],
      [extractProfileScore(auditProfile, ["traceabilityScore", "scoreBreakdown.traceabilityScore"], 54), 0.2],
      [extractProfileScore(auditProfile, ["reviewDisciplineScore"], 54), 0.12],
      [extractProfileScore(knowledgeProfile, ["criticalKnowledgeDocumentationScore"], 54), 0.12],
      [extractProfileScore(governanceProfile, ["governanceDocumentationReadiness"], 54), 0.12],
      [extractProfileScore(learningProfile, ["decisionLearningScore"], 54), 0.12],
    ]),
  );
  const doctrinePreservationScore = getScore(
    input.doctrinePreservationScore,
    weightedAverage([
      [extractProfileScore(legacyProfile, ["strategicDoctrinePreservationScore", "scoreBreakdown.strategicDoctrinePreservationScore"], 54), 0.24],
      [extractProfileScore(preservationProfile, ["strategicPreservationStability", "scoreBreakdown.strategicPreservationStabilityScore"], 54), 0.2],
      [historicalDecisionRetentionScore, 0.16],
      [extractProfileScore(learningProfile, ["governanceLearningScore"], 54), 0.12],
      [extractProfileScore(governanceProfile, ["longHorizonStewardshipDurability"], 54), 0.12],
      [extractProfileScore(auditProfile, ["strategicAlignmentScore"], 54), 0.1],
      [extractProfileScore(knowledgeProfile, ["institutionalMemoryScore"], 54), 0.06],
    ]),
  );
  const organizationalPatternMemoryScore = getScore(
    input.organizationalPatternMemoryScore,
    weightedAverage([
      [extractProfileScore(learningProfile, ["operationalLessonCaptureScore", "scoreBreakdown.operationalLessonCaptureScore"], 54), 0.2],
      [extractProfileScore(learningProfile, ["outcomeFeedbackScore"], 54), 0.16],
      [extractProfileScore(auditProfile, ["outcomeReviewScore"], 54), 0.16],
      [extractProfileScore(learningProfile, ["processImprovementLearningScore"], 54), 0.14],
      [historicalDecisionRetentionScore, 0.12],
      [extractProfileScore(knowledgeProfile, ["sopCoverageScore"], 54), 0.12],
      [extractProfileScore(auditProfile, ["postDecisionEvaluationScore"], 54), 0.1],
    ]),
  );
  const governanceMemoryDurabilityScore = getScore(
    input.governanceMemoryDurabilityScore,
    weightedAverage([
      [extractProfileScore(governanceProfile, ["governanceDocumentationReadiness", "scoreBreakdown.governanceDocumentationReadinessScore"], 54), 0.22],
      [extractProfileScore(governanceProfile, ["decisionAccountability", "scoreBreakdown.decisionAccountabilityScore"], 54), 0.18],
      [extractProfileScore(auditProfile, ["governanceAlignmentScore"], 54), 0.16],
      [extractProfileScore(learningProfile, ["governanceLearningScore"], 54), 0.14],
      [doctrinePreservationScore, 0.12],
      [historicalDecisionRetentionScore, 0.1],
      [extractProfileScore(auditProfile, ["reviewDisciplineScore"], 54), 0.08],
    ]),
  );
  const portfolioStrategyMemoryScore = getScore(
    input.portfolioStrategyMemoryScore,
    weightedAverage([
      [extractProfileScore(portfolioProfile, ["diversificationEffectiveness", "scoreBreakdown.diversificationEffectivenessScore"], 54), 0.16],
      [extractProfileScore(portfolioProfile, ["riskAdjustedPortfolioQuality", "scoreBreakdown.riskAdjustedPortfolioQualityScore"], 54), 0.16],
      [extractProfileScore(governanceProfile, ["riskOversightDiscipline", "scoreBreakdown.riskOversightDisciplineScore"], 54), 0.16],
      [extractProfileScore(auditProfile, ["strategicAlignmentScore"], 54), 0.14],
      [governanceMemoryDurabilityScore, 0.12],
      [historicalDecisionRetentionScore, 0.1],
      [doctrinePreservationScore, 0.08],
      [extractProfileScore(learningProfile, ["dealOutcomeLearningScore"], 54), 0.08],
    ]),
  );
  const institutionalLessonRetentionScore = getScore(
    input.institutionalLessonRetentionScore,
    weightedAverage([
      [extractProfileScore(learningProfile, ["memoryReinforcementScore", "scoreBreakdown.memoryReinforcementScore"], 54), 0.22],
      [extractProfileScore(learningProfile, ["decisionLearningScore"], 54), 0.16],
      [extractProfileScore(knowledgeProfile, ["institutionalMemoryScore", "scoreBreakdown.institutionalMemoryScore"], 54), 0.18],
      [organizationalPatternMemoryScore, 0.14],
      [historicalDecisionRetentionScore, 0.12],
      [extractProfileScore(auditProfile, ["institutionalLearningScore"], 54), 0.1],
      [extractProfileScore(learningProfile, ["operationalLessonCaptureScore"], 54), 0.08],
    ]),
  );
  const continuityMemoryScore = getScore(
    input.continuityMemoryScore,
    weightedAverage([
      [extractProfileScore(legacyProfile, ["institutionalMemoryScore", "scoreBreakdown.institutionalMemoryPreservationScore"], 54), 0.2],
      [extractProfileScore(legacyProfile, ["overallContinuityScore", "scoreBreakdown.overallContinuityScore"], 54), 0.16],
      [extractProfileScore(knowledgeProfile, ["continuityHandoffScore", "scoreBreakdown.continuityHandoffScore"], 54), 0.16],
      [institutionalLessonRetentionScore, 0.14],
      [governanceMemoryDurabilityScore, 0.12],
      [doctrinePreservationScore, 0.1],
      [extractProfileScore(preservationProfile, ["institutionalContinuityDurability"], 54), 0.08],
      [extractProfileScore(knowledgeProfile, ["trainingReadinessScore"], 54), 0.04],
    ]),
  );
  const strategicContextPreservationScore = getScore(
    input.strategicContextPreservationScore,
    weightedAverage([
      [doctrinePreservationScore, 0.18],
      [historicalDecisionRetentionScore, 0.14],
      [governanceMemoryDurabilityScore, 0.12],
      [portfolioStrategyMemoryScore, 0.12],
      [extractProfileScore(learningProfile, ["governanceLearningScore"], 54), 0.12],
      [extractProfileScore(auditProfile, ["strategicAlignmentScore"], 54), 0.12],
      [extractProfileScore(preservationProfile, ["strategicPreservationStability"], 54), 0.12],
      [institutionalLessonRetentionScore, 0.08],
    ]),
  );
  const longHorizonContinuityScore = getScore(
    input.longHorizonContinuityScore,
    weightedAverage([
      [extractProfileScore(preservationProfile, ["longHorizonPreservationQuality", "scoreBreakdown.longHorizonPreservationQualityScore"], 54), 0.2],
      [extractProfileScore(preservationProfile, ["institutionalContinuityDurability", "scoreBreakdown.institutionalContinuityDurabilityScore"], 54), 0.18],
      [continuityMemoryScore, 0.16],
      [strategicContextPreservationScore, 0.14],
      [doctrinePreservationScore, 0.12],
      [extractProfileScore(legacyProfile, ["overallContinuityScore"], 54), 0.1],
      [institutionalLessonRetentionScore, 0.06],
      [governanceMemoryDurabilityScore, 0.04],
    ]),
  );
  const enterpriseMemoryMaturityScore = getScore(
    input.enterpriseMemoryMaturityScore,
    weightedAverage([
      [doctrinePreservationScore, 0.1],
      [historicalDecisionRetentionScore, 0.1],
      [organizationalPatternMemoryScore, 0.1],
      [governanceMemoryDurabilityScore, 0.1],
      [portfolioStrategyMemoryScore, 0.08],
      [institutionalLessonRetentionScore, 0.12],
      [continuityMemoryScore, 0.1],
      [strategicContextPreservationScore, 0.1],
      [longHorizonContinuityScore, 0.12],
      [extractProfileScore(learningProfile, ["overallLearningScore", "scoreBreakdown.overallLearningScore"], 54), 0.04],
      [extractProfileScore(knowledgeProfile, ["institutionalMemoryScore"], 54), 0.04],
    ]),
  );
  const overallStrategicMemoryScore = weightedAverage([
    [doctrinePreservationScore, 0.11],
    [historicalDecisionRetentionScore, 0.11],
    [organizationalPatternMemoryScore, 0.1],
    [governanceMemoryDurabilityScore, 0.1],
    [portfolioStrategyMemoryScore, 0.09],
    [institutionalLessonRetentionScore, 0.11],
    [continuityMemoryScore, 0.1],
    [strategicContextPreservationScore, 0.1],
    [longHorizonContinuityScore, 0.1],
    [enterpriseMemoryMaturityScore, 0.08],
  ]);

  return {
    connectivityScore: organizationalPatternMemoryScore,
    durabilityScore: overallStrategicMemoryScore,
    expansionScore: strategicContextPreservationScore,
    institutionalScore: enterpriseMemoryMaturityScore,
    logisticsScore: historicalDecisionRetentionScore,
    luxuryScore: portfolioStrategyMemoryScore,
    developmentScore: longHorizonContinuityScore,
    overallStrategicMemoryScore,
    doctrinePreservationScore,
    historicalDecisionRetentionScore,
    organizationalPatternMemoryScore,
    governanceMemoryDurabilityScore,
    portfolioStrategyMemoryScore,
    institutionalLessonRetentionScore,
    continuityMemoryScore,
    strategicContextPreservationScore,
    longHorizonContinuityScore,
    enterpriseMemoryMaturityScore,
  };
}

function classifyStrategicMemory(score: number): StrategicMemoryLevel {
  if (score >= 82) return "institutional";
  if (score >= 68) return "durable";
  if (score >= 54) return "developing";
  if (score >= 40) return "thin";

  return "fragile";
}

function buildWarnings(scoreBreakdown: EnterpriseStrategicMemoryScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "STRATEGIC_MEMORY_DATA_INCOMPLETE",
            severity: missingData.length >= 5 ? "high" : "medium",
            message: "Enterprise strategic memory assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.overallStrategicMemoryScore < 42
      ? [
          createCorridorWarning({
            code: "STRATEGIC_MEMORY_FRAGILE",
            severity: "high",
            message: "Overall strategic memory durability is fragile under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.doctrinePreservationScore < 45
      ? [
          createCorridorWarning({
            code: "DOCTRINE_PRESERVATION_WEAK",
            severity: "medium",
            message: "Strategic doctrine preservation is weak and requires human review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.longHorizonContinuityScore < 45
      ? [
          createCorridorWarning({
            code: "LONG_HORIZON_MEMORY_WEAK",
            severity: "medium",
            message: "Long-horizon intelligence continuity is weak; no autonomous learning or execution is performed.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
  ];
}

function buildMemoryWarnings(scoreBreakdown: EnterpriseStrategicMemoryScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.doctrinePreservationScore < 55 ? ["Strategic doctrine preservation may be too weak for durable enterprise continuity."] : []),
    ...(scoreBreakdown.historicalDecisionRetentionScore < 55 ? ["Historical decision retention may be insufficient for explainable future strategy review."] : []),
    ...(scoreBreakdown.organizationalPatternMemoryScore < 55 ? ["Organizational pattern memory may be underdeveloped."] : []),
    ...(scoreBreakdown.governanceMemoryDurabilityScore < 55 ? ["Governance memory durability may need human review."] : []),
    ...(scoreBreakdown.portfolioStrategyMemoryScore < 55 ? ["Portfolio strategy memory may be underdeveloped; no investment or portfolio-management guidance is provided."] : []),
    ...(scoreBreakdown.institutionalLessonRetentionScore < 55 ? ["Institutional lesson retention may be too weak for long-cycle learning."] : []),
    ...(scoreBreakdown.continuityMemoryScore < 55 ? ["Continuity memory quality may be insufficient for future handoffs."] : []),
    ...(scoreBreakdown.strategicContextPreservationScore < 55 ? ["Strategic context preservation may be fragmented."] : []),
    ...(scoreBreakdown.longHorizonContinuityScore < 55 ? ["Long-horizon intelligence continuity may be underdeveloped."] : []),
    ...(scoreBreakdown.enterpriseMemoryMaturityScore < 55 ? ["Enterprise memory maturity may be too thin for institutional-grade continuity."] : []),
    ...(missingData.length > 0 ? ["Memory warnings require human validation because required structured inputs are incomplete."] : []),
  ]);
}

function buildReusableInfrastructureNotes(input: EnterpriseStrategicMemoryInput, missingData: string[]) {
  return unique([
    "Reuses shared corridor score normalization, warning creation, confidence scoring, missing-data handling, and read-only score breakdown conventions.",
    "Consumes optional in-memory intelligence profiles only; no persistence, external API calls, scraping, routing, orchestration, or automation execution is introduced.",
    ...(input.enterpriseInstitutionalLearningProfile ? ["Enterprise institutional learning profile supplied as reusable upstream memory context."] : []),
    ...(input.institutionalKnowledgeTransferProfile ? ["Institutional knowledge transfer profile supplied as reusable knowledge-retention context."] : []),
    ...(input.legacyContinuityProfile ? ["Legacy continuity profile supplied as reusable long-horizon continuity context."] : []),
    ...(missingData.length > 0 ? ["Reusable profile coverage is incomplete, so conservative deterministic defaults and human verification remain required."] : []),
  ]);
}

function buildKeyRisks(scoreBreakdown: EnterpriseStrategicMemoryScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.overallStrategicMemoryScore < 50 ? ["Overall strategic memory durability is weak."] : []),
    ...(scoreBreakdown.doctrinePreservationScore < 50 ? ["Strategic doctrine preservation is weak."] : []),
    ...(scoreBreakdown.historicalDecisionRetentionScore < 50 ? ["Historical decision retention is weak."] : []),
    ...(scoreBreakdown.organizationalPatternMemoryScore < 50 ? ["Organizational pattern memory is weak."] : []),
    ...(scoreBreakdown.governanceMemoryDurabilityScore < 50 ? ["Governance memory durability is weak."] : []),
    ...(scoreBreakdown.portfolioStrategyMemoryScore < 50 ? ["Portfolio strategy memory is weak."] : []),
    ...(scoreBreakdown.institutionalLessonRetentionScore < 50 ? ["Institutional lesson retention is weak."] : []),
    ...(scoreBreakdown.continuityMemoryScore < 50 ? ["Continuity memory quality is weak."] : []),
    ...(scoreBreakdown.strategicContextPreservationScore < 50 ? ["Strategic context preservation is weak."] : []),
    ...(scoreBreakdown.longHorizonContinuityScore < 50 ? ["Long-horizon intelligence continuity is weak."] : []),
    ...(scoreBreakdown.enterpriseMemoryMaturityScore < 50 ? ["Enterprise memory maturity is weak."] : []),
    ...(missingData.length > 0 ? `Missing data reduces confidence: ${missingData.slice(0, 4).join(", ")}.` : []),
  ]);
}

function buildStrengths(scoreBreakdown: EnterpriseStrategicMemoryScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.overallStrategicMemoryScore >= 70 ? ["Overall strategic memory durability is strong."] : []),
    ...(scoreBreakdown.doctrinePreservationScore >= 70 ? ["Strategic doctrine preservation is strong."] : []),
    ...(scoreBreakdown.historicalDecisionRetentionScore >= 70 ? ["Historical decision retention is strong."] : []),
    ...(scoreBreakdown.organizationalPatternMemoryScore >= 70 ? ["Organizational pattern memory is strong."] : []),
    ...(scoreBreakdown.governanceMemoryDurabilityScore >= 70 ? ["Governance memory durability is strong."] : []),
    ...(scoreBreakdown.portfolioStrategyMemoryScore >= 70 ? ["Portfolio strategy memory is strong."] : []),
    ...(scoreBreakdown.institutionalLessonRetentionScore >= 70 ? ["Institutional lesson retention is strong."] : []),
    ...(scoreBreakdown.continuityMemoryScore >= 70 ? ["Continuity memory quality is strong."] : []),
    ...(scoreBreakdown.strategicContextPreservationScore >= 70 ? ["Strategic context preservation is strong."] : []),
    ...(scoreBreakdown.longHorizonContinuityScore >= 70 ? ["Long-horizon intelligence continuity is strong."] : []),
    ...(scoreBreakdown.enterpriseMemoryMaturityScore >= 70 ? ["Enterprise memory maturity is strong."] : []),
  ]);
}

function buildRecommendations(scoreBreakdown: EnterpriseStrategicMemoryScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.doctrinePreservationScore < 58 ? ["Review strategic doctrine preservation gaps and document durable enterprise principles for human review."] : []),
    ...(scoreBreakdown.historicalDecisionRetentionScore < 58 ? ["Review historical decision retention gaps and preserve decision rationale in internal notes."] : []),
    ...(scoreBreakdown.organizationalPatternMemoryScore < 58 ? ["Review organizational pattern memory gaps and capture recurring operating patterns."] : []),
    ...(scoreBreakdown.governanceMemoryDurabilityScore < 58 ? ["Review governance memory durability; this is not legal, HR, ownership, or tax advice."] : []),
    ...(scoreBreakdown.portfolioStrategyMemoryScore < 58
      ? ["Review portfolio strategy memory without making investment, allocation, lending, or portfolio-management recommendations."]
      : []),
    ...(scoreBreakdown.institutionalLessonRetentionScore < 58 ? ["Review institutional lesson retention and preserve reusable human-reviewed lessons."] : []),
    ...(scoreBreakdown.continuityMemoryScore < 58 ? ["Review continuity memory quality and strengthen manual handoff context."] : []),
    ...(scoreBreakdown.strategicContextPreservationScore < 58 ? ["Review strategic context preservation and document assumptions behind major strategy shifts."] : []),
    ...(scoreBreakdown.longHorizonContinuityScore < 58 ? ["Review long-horizon intelligence continuity and preserve durable context for future governance reviews."] : []),
    ...(scoreBreakdown.enterpriseMemoryMaturityScore < 58 ? ["Review enterprise memory maturity and identify institutional memory gaps."] : []),
    "Keep strategic-memory improvements human-reviewed; this module does not provide legal, HR, ownership, tax, lending, investment, portfolio-management, autonomous learning, autonomous optimization, autonomous management, or market-prediction advice.",
  ]);
}

function buildExplanation(params: { scoreBreakdown: EnterpriseStrategicMemoryScoreBreakdown; strategicMemoryLevel: StrategicMemoryLevel }) {
  const scoreBreakdown = params.scoreBreakdown;

  return [
    `Strategic memory level is ${params.strategicMemoryLevel} with an overall strategic memory score of ${scoreBreakdown.overallStrategicMemoryScore}/100.`,
    `Doctrine preservation is ${scoreBreakdown.doctrinePreservationScore}/100, historical decision retention is ${scoreBreakdown.historicalDecisionRetentionScore}/100, and long-horizon continuity is ${scoreBreakdown.longHorizonContinuityScore}/100.`,
    "Strategic doctrine preservation, historical decision retention, organizational pattern memory, governance memory, portfolio strategy memory, lesson retention, continuity memory, strategic context preservation, long-horizon continuity, and enterprise memory maturity were scored deterministically from structured inputs and optional read-only profile fallbacks.",
    "This output identifies institutional memory and strategic continuity gaps only and does not provide legal, HR, ownership, tax, lending, investment, portfolio-management, autonomous learning, autonomous optimization, autonomous management, or market-prediction advice.",
  ];
}

function buildTrace(scoreBreakdown: EnterpriseStrategicMemoryScoreBreakdown, missingData: string[]) {
  return [
    "Normalized all numeric scores to a deterministic 0-100 scale.",
    "Derived optional fallback scores only from supplied in-memory intelligence profiles.",
    `Computed enterprise strategic memory from doctrine preservation (${scoreBreakdown.doctrinePreservationScore}), historical decision retention (${scoreBreakdown.historicalDecisionRetentionScore}), organizational pattern memory (${scoreBreakdown.organizationalPatternMemoryScore}), governance memory (${scoreBreakdown.governanceMemoryDurabilityScore}), portfolio strategy memory (${scoreBreakdown.portfolioStrategyMemoryScore}), lesson retention (${scoreBreakdown.institutionalLessonRetentionScore}), continuity memory (${scoreBreakdown.continuityMemoryScore}), strategic context (${scoreBreakdown.strategicContextPreservationScore}), long-horizon continuity (${scoreBreakdown.longHorizonContinuityScore}), and enterprise memory maturity (${scoreBreakdown.enterpriseMemoryMaturityScore}).`,
    missingData.length > 0 ? `Missing inputs flagged for human verification: ${missingData.join(", ")}.` : "No required structured inputs were missing.",
    "No outreach, SMS, email, Twilio, database writes, schema changes, workflow mutation, protected-class logic, demographic targeting, external APIs, scraping, autonomous learning actions, autonomous optimization, autonomous execution, or autonomous management decisions were used.",
  ];
}

function buildAssumptions(input: EnterpriseStrategicMemoryInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0 ? ["Missing enterprise strategic memory inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."] : []),
    "Enterprise strategic memory intelligence is deterministic, explainable, read-only, compliance-first, and designed for human review before any execution.",
    "This engine evaluates institutional memory durability, strategic doctrine preservation, historical decision retention, organizational pattern memory, governance memory, portfolio strategy memory, strategic context preservation, and long-horizon intelligence continuity only.",
    "No outreach, SMS, email sending, Twilio, autonomous execution, autonomous learning actions, autonomous optimization, autonomous management decisions, DB writes, schema changes, workflow mutations, external APIs, scraping, demographic data, or protected-class data were used.",
    "This is not legal advice, HR advice, ownership advice, tax advice, lending advice, investment advice, portfolio-management advice, autonomous learning, autonomous optimization, autonomous management, or market prediction.",
  ]);
}

export function analyzeEnterpriseStrategicMemoryIntelligence(input: EnterpriseStrategicMemoryInput = {}): EnterpriseStrategicMemoryResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const strategicMemoryLevel = classifyStrategicMemory(scoreBreakdown.overallStrategicMemoryScore);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallStrategicMemoryScore: scoreBreakdown.overallStrategicMemoryScore,
    strategicMemoryLevel,
    doctrinePreservationScore: scoreBreakdown.doctrinePreservationScore,
    historicalDecisionRetentionScore: scoreBreakdown.historicalDecisionRetentionScore,
    organizationalPatternMemoryScore: scoreBreakdown.organizationalPatternMemoryScore,
    governanceMemoryDurabilityScore: scoreBreakdown.governanceMemoryDurabilityScore,
    portfolioStrategyMemoryScore: scoreBreakdown.portfolioStrategyMemoryScore,
    institutionalLessonRetentionScore: scoreBreakdown.institutionalLessonRetentionScore,
    continuityMemoryScore: scoreBreakdown.continuityMemoryScore,
    strategicContextPreservationScore: scoreBreakdown.strategicContextPreservationScore,
    longHorizonContinuityScore: scoreBreakdown.longHorizonContinuityScore,
    enterpriseMemoryMaturityScore: scoreBreakdown.enterpriseMemoryMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown, missingData),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    memoryWarnings: buildMemoryWarnings(scoreBreakdown, missingData),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input, missingData),
    explanation: buildExplanation({ scoreBreakdown, strategicMemoryLevel }),
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
      autonomousLearningActions: false,
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

export const getEnterpriseStrategicMemoryIntelligence = analyzeEnterpriseStrategicMemoryIntelligence;
