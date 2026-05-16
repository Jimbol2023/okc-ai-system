import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type InstitutionalLearningLevel = "weak" | "fragmented" | "developing" | "disciplined" | "institutional";

export type EnterpriseInstitutionalLearningInput = {
  decisionLearningScore?: number;
  outcomeFeedbackScore?: number;
  operationalLessonCaptureScore?: number;
  dealOutcomeLearningScore?: number;
  responseLearningScore?: number;
  processImprovementLearningScore?: number;
  governanceLearningScore?: number;
  recommendationAccuracyReviewScore?: number;
  memoryReinforcementScore?: number;
  continuousLearningMaturityScore?: number;
  enterpriseDecisionAuditProfile?: unknown;
  processOptimizationProfile?: unknown;
  operationalQaProcessDriftProfile?: unknown;
  institutionalKnowledgeTransferProfile?: unknown;
  enterpriseAccountabilityProfile?: unknown;
  enterpriseOperatingRhythmProfile?: unknown;
  institutionalRelationshipProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseInstitutionalLearningScoreBreakdown = CorridorScoreBreakdown & {
  overallLearningScore: number;
  decisionLearningScore: number;
  outcomeFeedbackScore: number;
  operationalLessonCaptureScore: number;
  dealOutcomeLearningScore: number;
  responseLearningScore: number;
  processImprovementLearningScore: number;
  governanceLearningScore: number;
  recommendationAccuracyReviewScore: number;
  memoryReinforcementScore: number;
  continuousLearningMaturityScore: number;
};

export type EnterpriseInstitutionalLearningResult = {
  overallLearningScore: number;
  institutionalLearningLevel: InstitutionalLearningLevel;
  decisionLearningScore: number;
  outcomeFeedbackScore: number;
  operationalLessonCaptureScore: number;
  dealOutcomeLearningScore: number;
  responseLearningScore: number;
  processImprovementLearningScore: number;
  governanceLearningScore: number;
  recommendationAccuracyReviewScore: number;
  memoryReinforcementScore: number;
  continuousLearningMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseInstitutionalLearningScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  learningWarnings: string[];
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

const REQUIRED_INPUTS: Array<keyof EnterpriseInstitutionalLearningInput> = [
  "decisionLearningScore",
  "outcomeFeedbackScore",
  "operationalLessonCaptureScore",
  "dealOutcomeLearningScore",
  "responseLearningScore",
  "processImprovementLearningScore",
  "governanceLearningScore",
  "recommendationAccuracyReviewScore",
  "memoryReinforcementScore",
  "continuousLearningMaturityScore",
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

function hasFallbackForInput(input: EnterpriseInstitutionalLearningInput, key: keyof EnterpriseInstitutionalLearningInput) {
  const auditProfile = input.enterpriseDecisionAuditProfile;
  const optimizationProfile = input.processOptimizationProfile;
  const qaProfile = input.operationalQaProcessDriftProfile;
  const knowledgeProfile = input.institutionalKnowledgeTransferProfile;
  const accountabilityProfile = input.enterpriseAccountabilityProfile;
  const rhythmProfile = input.enterpriseOperatingRhythmProfile;
  const relationshipProfile = input.institutionalRelationshipProfile;

  const fallbackPaths: Partial<Record<keyof EnterpriseInstitutionalLearningInput, boolean>> = {
    decisionLearningScore:
      hasProfileScore(auditProfile, ["postDecisionEvaluationScore", "institutionalLearningScore"]) ||
      hasProfileScore(knowledgeProfile, ["decisionHistoryPreservationScore"]),
    outcomeFeedbackScore:
      hasProfileScore(auditProfile, ["outcomeReviewScore", "postDecisionEvaluationScore"]) ||
      hasProfileScore(optimizationProfile, ["continuousImprovementReadinessScore"]),
    operationalLessonCaptureScore:
      hasProfileScore(qaProfile, ["documentationConsistencyScore", "overallOperationalConsistencyScore"]) ||
      hasProfileScore(knowledgeProfile, ["criticalKnowledgeDocumentationScore"]),
    dealOutcomeLearningScore:
      hasProfileScore(qaProfile, ["dealProcessingConsistencyScore"]) ||
      hasProfileScore(optimizationProfile, ["pipelineBottleneckScore", "workflowEfficiencyScore"]),
    responseLearningScore:
      hasProfileScore(relationshipProfile, ["communicationStability", "relationshipKnowledgeTransferScore"]) ||
      hasProfileScore(qaProfile, ["followUpConsistencyScore", "communicationConsistencyScore"]),
    processImprovementLearningScore:
      hasProfileScore(optimizationProfile, ["continuousImprovementReadinessScore", "overallOptimizationScore"]) ||
      hasProfileScore(auditProfile, ["outcomeReviewScore"]),
    governanceLearningScore:
      hasProfileScore(auditProfile, ["governanceAlignmentScore", "reviewDisciplineScore"]) ||
      hasProfileScore(accountabilityProfile, ["governanceAccountabilityScore"]),
    recommendationAccuracyReviewScore:
      hasProfileScore(auditProfile, ["outcomeReviewScore", "traceabilityScore"]) ||
      hasProfileScore(optimizationProfile, ["continuousImprovementReadinessScore"]),
    memoryReinforcementScore:
      hasProfileScore(knowledgeProfile, ["institutionalMemoryScore", "decisionHistoryPreservationScore"]) ||
      hasProfileScore(auditProfile, ["institutionalLearningScore"]),
    continuousLearningMaturityScore:
      hasProfileScore(auditProfile, ["decisionAuditMaturityScore", "overallDecisionAuditScore"]) ||
      hasProfileScore(rhythmProfile, ["institutionalRhythmMaturityScore"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: EnterpriseInstitutionalLearningInput) {
  const labels: Record<keyof EnterpriseInstitutionalLearningInput, string> = {
    decisionLearningScore: "decision learning maturity score",
    outcomeFeedbackScore: "outcome feedback loop quality score",
    operationalLessonCaptureScore: "operational lesson capture score",
    dealOutcomeLearningScore: "deal outcome learning score",
    responseLearningScore: "seller/buyer response learning score",
    processImprovementLearningScore: "process improvement learning score",
    governanceLearningScore: "governance learning maturity score",
    recommendationAccuracyReviewScore: "recommendation accuracy review score",
    memoryReinforcementScore: "institutional memory reinforcement score",
    continuousLearningMaturityScore: "continuous learning maturity score",
    enterpriseDecisionAuditProfile: "enterprise decision audit profile",
    processOptimizationProfile: "process optimization profile",
    operationalQaProcessDriftProfile: "operational QA/process drift profile",
    institutionalKnowledgeTransferProfile: "institutional knowledge transfer profile",
    enterpriseAccountabilityProfile: "enterprise accountability profile",
    enterpriseOperatingRhythmProfile: "enterprise operating rhythm profile",
    institutionalRelationshipProfile: "institutional relationship profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: EnterpriseInstitutionalLearningInput): EnterpriseInstitutionalLearningScoreBreakdown {
  const auditProfile = input.enterpriseDecisionAuditProfile;
  const optimizationProfile = input.processOptimizationProfile;
  const qaProfile = input.operationalQaProcessDriftProfile;
  const knowledgeProfile = input.institutionalKnowledgeTransferProfile;
  const accountabilityProfile = input.enterpriseAccountabilityProfile;
  const rhythmProfile = input.enterpriseOperatingRhythmProfile;
  const relationshipProfile = input.institutionalRelationshipProfile;
  const decisionLearningScore = getScore(
    input.decisionLearningScore,
    weightedAverage([
      [extractProfileScore(auditProfile, ["postDecisionEvaluationScore", "scoreBreakdown.postDecisionEvaluationScore"], 54), 0.22],
      [extractProfileScore(auditProfile, ["institutionalLearningScore", "scoreBreakdown.institutionalLearningScore"], 54), 0.2],
      [extractProfileScore(knowledgeProfile, ["decisionHistoryPreservationScore", "scoreBreakdown.decisionHistoryPreservationScore"], 54), 0.2],
      [extractProfileScore(auditProfile, ["traceabilityScore"], 54), 0.12],
      [extractProfileScore(accountabilityProfile, ["reviewAccountabilityScore"], 54), 0.12],
      [extractProfileScore(rhythmProfile, ["decisionReviewTimingScore"], 54), 0.08],
      [extractProfileScore(optimizationProfile, ["continuousImprovementReadinessScore"], 54), 0.06],
    ]),
  );
  const outcomeFeedbackScore = getScore(
    input.outcomeFeedbackScore,
    weightedAverage([
      [extractProfileScore(auditProfile, ["outcomeReviewScore", "scoreBreakdown.outcomeReviewScore"], 54), 0.26],
      [extractProfileScore(auditProfile, ["postDecisionEvaluationScore"], 54), 0.18],
      [extractProfileScore(optimizationProfile, ["continuousImprovementReadinessScore"], 54), 0.16],
      [decisionLearningScore, 0.14],
      [extractProfileScore(accountabilityProfile, ["followThroughScore"], 54), 0.1],
      [extractProfileScore(qaProfile, ["documentationConsistencyScore"], 54), 0.08],
      [extractProfileScore(auditProfile, ["traceabilityScore"], 54), 0.08],
    ]),
  );
  const operationalLessonCaptureScore = getScore(
    input.operationalLessonCaptureScore,
    weightedAverage([
      [extractProfileScore(qaProfile, ["documentationConsistencyScore", "scoreBreakdown.documentationConsistencyScore"], 54), 0.22],
      [extractProfileScore(knowledgeProfile, ["criticalKnowledgeDocumentationScore", "scoreBreakdown.criticalKnowledgeDocumentationScore"], 54), 0.2],
      [extractProfileScore(qaProfile, ["overallOperationalConsistencyScore"], 54), 0.14],
      [extractProfileScore(optimizationProfile, ["documentationEfficiencyScore"], 54), 0.14],
      [outcomeFeedbackScore, 0.1],
      [decisionLearningScore, 0.1],
      [extractProfileScore(knowledgeProfile, ["sopCoverageScore"], 54), 0.1],
    ]),
  );
  const dealOutcomeLearningScore = getScore(
    input.dealOutcomeLearningScore,
    weightedAverage([
      [extractProfileScore(qaProfile, ["dealProcessingConsistencyScore", "scoreBreakdown.dealProcessingConsistencyScore"], 54), 0.2],
      [100 - extractProfileScore(optimizationProfile, ["pipelineBottleneckScore", "scoreBreakdown.pipelineBottleneckScore"], 48), 0.16],
      [extractProfileScore(optimizationProfile, ["workflowEfficiencyScore"], 54), 0.14],
      [extractProfileScore(knowledgeProfile, ["dealWorkflowTransferScore"], 54), 0.12],
      [outcomeFeedbackScore, 0.14],
      [operationalLessonCaptureScore, 0.12],
      [extractProfileScore(auditProfile, ["outcomeReviewScore"], 54), 0.12],
    ]),
  );
  const responseLearningScore = getScore(
    input.responseLearningScore,
    weightedAverage([
      [extractProfileScore(relationshipProfile, ["communicationStability", "scoreBreakdown.communicationStabilityScore"], 54), 0.18],
      [extractProfileScore(relationshipProfile, ["relationshipKnowledgeTransferScore"], 54), 0.16],
      [extractProfileScore(qaProfile, ["followUpConsistencyScore"], 54), 0.16],
      [extractProfileScore(qaProfile, ["communicationConsistencyScore"], 54), 0.14],
      [extractProfileScore(optimizationProfile, ["followUpEfficiencyScore"], 54), 0.12],
      [outcomeFeedbackScore, 0.12],
      [operationalLessonCaptureScore, 0.08],
      [extractProfileScore(knowledgeProfile, ["relationshipKnowledgeTransferScore"], 54), 0.04],
    ]),
  );
  const processImprovementLearningScore = getScore(
    input.processImprovementLearningScore,
    weightedAverage([
      [extractProfileScore(optimizationProfile, ["continuousImprovementReadinessScore", "scoreBreakdown.continuousImprovementReadinessScore"], 54), 0.24],
      [extractProfileScore(optimizationProfile, ["overallOptimizationScore", "scoreBreakdown.overallOptimizationScore"], 54), 0.16],
      [outcomeFeedbackScore, 0.14],
      [operationalLessonCaptureScore, 0.12],
      [dealOutcomeLearningScore, 0.1],
      [extractProfileScore(auditProfile, ["outcomeReviewScore"], 54), 0.1],
      [100 - extractProfileScore(optimizationProfile, ["frictionRiskScore"], 48), 0.08],
      [extractProfileScore(rhythmProfile, ["monthlyCadenceScore"], 54), 0.06],
    ]),
  );
  const governanceLearningScore = getScore(
    input.governanceLearningScore,
    weightedAverage([
      [extractProfileScore(auditProfile, ["governanceAlignmentScore", "scoreBreakdown.governanceAlignmentScore"], 54), 0.2],
      [extractProfileScore(auditProfile, ["reviewDisciplineScore", "scoreBreakdown.reviewDisciplineScore"], 54), 0.18],
      [extractProfileScore(accountabilityProfile, ["governanceAccountabilityScore"], 54), 0.14],
      [extractProfileScore(rhythmProfile, ["quarterlyGovernanceScore"], 54), 0.12],
      [decisionLearningScore, 0.12],
      [processImprovementLearningScore, 0.1],
      [extractProfileScore(knowledgeProfile, ["decisionHistoryPreservationScore"], 54), 0.08],
      [extractProfileScore(auditProfile, ["strategicAlignmentScore"], 54), 0.06],
    ]),
  );
  const recommendationAccuracyReviewScore = getScore(
    input.recommendationAccuracyReviewScore,
    weightedAverage([
      [extractProfileScore(auditProfile, ["outcomeReviewScore"], 54), 0.22],
      [extractProfileScore(auditProfile, ["traceabilityScore"], 54), 0.18],
      [outcomeFeedbackScore, 0.16],
      [processImprovementLearningScore, 0.14],
      [extractProfileScore(optimizationProfile, ["continuousImprovementReadinessScore"], 54), 0.12],
      [governanceLearningScore, 0.08],
      [decisionLearningScore, 0.06],
      [extractProfileScore(accountabilityProfile, ["reviewAccountabilityScore"], 54), 0.04],
    ]),
  );
  const memoryReinforcementScore = getScore(
    input.memoryReinforcementScore,
    weightedAverage([
      [extractProfileScore(knowledgeProfile, ["institutionalMemoryScore", "scoreBreakdown.institutionalMemoryScore"], 54), 0.24],
      [extractProfileScore(knowledgeProfile, ["decisionHistoryPreservationScore"], 54), 0.18],
      [operationalLessonCaptureScore, 0.14],
      [decisionLearningScore, 0.12],
      [governanceLearningScore, 0.1],
      [responseLearningScore, 0.08],
      [processImprovementLearningScore, 0.08],
      [extractProfileScore(auditProfile, ["institutionalLearningScore"], 54), 0.06],
    ]),
  );
  const continuousLearningMaturityScore = getScore(
    input.continuousLearningMaturityScore,
    weightedAverage([
      [decisionLearningScore, 0.11],
      [outcomeFeedbackScore, 0.11],
      [operationalLessonCaptureScore, 0.1],
      [dealOutcomeLearningScore, 0.09],
      [responseLearningScore, 0.08],
      [processImprovementLearningScore, 0.12],
      [governanceLearningScore, 0.11],
      [recommendationAccuracyReviewScore, 0.1],
      [memoryReinforcementScore, 0.12],
      [extractProfileScore(auditProfile, ["decisionAuditMaturityScore"], 54), 0.03],
      [extractProfileScore(rhythmProfile, ["institutionalRhythmMaturityScore"], 54), 0.03],
    ]),
  );
  const overallLearningScore = weightedAverage([
    [decisionLearningScore, 0.11],
    [outcomeFeedbackScore, 0.11],
    [operationalLessonCaptureScore, 0.1],
    [dealOutcomeLearningScore, 0.09],
    [responseLearningScore, 0.09],
    [processImprovementLearningScore, 0.11],
    [governanceLearningScore, 0.1],
    [recommendationAccuracyReviewScore, 0.09],
    [memoryReinforcementScore, 0.1],
    [continuousLearningMaturityScore, 0.1],
  ]);

  return {
    connectivityScore: responseLearningScore,
    durabilityScore: overallLearningScore,
    expansionScore: processImprovementLearningScore,
    institutionalScore: continuousLearningMaturityScore,
    logisticsScore: operationalLessonCaptureScore,
    luxuryScore: dealOutcomeLearningScore,
    developmentScore: memoryReinforcementScore,
    overallLearningScore,
    decisionLearningScore,
    outcomeFeedbackScore,
    operationalLessonCaptureScore,
    dealOutcomeLearningScore,
    responseLearningScore,
    processImprovementLearningScore,
    governanceLearningScore,
    recommendationAccuracyReviewScore,
    memoryReinforcementScore,
    continuousLearningMaturityScore,
  };
}

function classifyInstitutionalLearning(score: number): InstitutionalLearningLevel {
  if (score >= 82) return "institutional";
  if (score >= 68) return "disciplined";
  if (score >= 54) return "developing";
  if (score >= 40) return "fragmented";

  return "weak";
}

function buildWarnings(scoreBreakdown: EnterpriseInstitutionalLearningScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "INSTITUTIONAL_LEARNING_DATA_INCOMPLETE",
            severity: missingData.length >= 5 ? "high" : "medium",
            message: "Enterprise institutional learning assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.overallLearningScore < 42
      ? [
          createCorridorWarning({
            code: "INSTITUTIONAL_LEARNING_WEAK",
            severity: "high",
            message: "Overall institutional learning maturity is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.memoryReinforcementScore < 45
      ? [
          createCorridorWarning({
            code: "MEMORY_REINFORCEMENT_WEAK",
            severity: "medium",
            message: "Institutional memory reinforcement is weak and requires human review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.recommendationAccuracyReviewScore < 45
      ? [
          createCorridorWarning({
            code: "RECOMMENDATION_REVIEW_WEAK",
            severity: "medium",
            message: "Recommendation accuracy review is weak; no autonomous optimization is performed.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
  ];
}

function buildLearningWarnings(scoreBreakdown: EnterpriseInstitutionalLearningScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.decisionLearningScore < 55 ? ["Decision learning maturity may be too weak for durable governance improvement."] : []),
    ...(scoreBreakdown.outcomeFeedbackScore < 55 ? ["Outcome feedback loops may be too fragmented for consistent institutional learning."] : []),
    ...(scoreBreakdown.operationalLessonCaptureScore < 55 ? ["Operational lesson capture may be inconsistent across workflows."] : []),
    ...(scoreBreakdown.dealOutcomeLearningScore < 55 ? ["Deal outcome learning may be underdeveloped."] : []),
    ...(scoreBreakdown.responseLearningScore < 55 ? ["Seller/buyer response learning may be weak; no outreach or response automation is triggered."] : []),
    ...(scoreBreakdown.processImprovementLearningScore < 55 ? ["Process improvement learning may be too weak for continuous improvement discipline."] : []),
    ...(scoreBreakdown.governanceLearningScore < 55 ? ["Governance learning maturity may need human review."] : []),
    ...(scoreBreakdown.recommendationAccuracyReviewScore < 55 ? ["Recommendation accuracy review may be too limited for reliable improvement loops."] : []),
    ...(scoreBreakdown.memoryReinforcementScore < 55 ? ["Institutional memory reinforcement may be underdeveloped."] : []),
    ...(scoreBreakdown.continuousLearningMaturityScore < 55 ? ["Continuous learning maturity may be insufficient for long-horizon durability."] : []),
    ...(missingData.length > 0 ? ["Learning warnings require human validation because required structured inputs are incomplete."] : []),
  ]);
}

function buildReusableInfrastructureNotes(input: EnterpriseInstitutionalLearningInput, missingData: string[]) {
  return unique([
    "Reuses shared corridor score normalization, warning creation, confidence scoring, missing-data handling, and read-only score breakdown conventions.",
    "Consumes optional in-memory intelligence profiles only; no persistence, external API calls, scraping, routing, orchestration, or automation execution is introduced.",
    ...(input.enterpriseDecisionAuditProfile ? ["Enterprise decision audit profile supplied as reusable upstream learning context."] : []),
    ...(input.processOptimizationProfile ? ["Process optimization profile supplied as reusable upstream improvement context."] : []),
    ...(input.institutionalKnowledgeTransferProfile ? ["Institutional knowledge transfer profile supplied as reusable memory context."] : []),
    ...(missingData.length > 0 ? ["Reusable profile coverage is incomplete, so conservative deterministic defaults and human verification remain required."] : []),
  ]);
}

function buildKeyRisks(scoreBreakdown: EnterpriseInstitutionalLearningScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.overallLearningScore < 50 ? ["Overall institutional learning maturity is weak."] : []),
    ...(scoreBreakdown.decisionLearningScore < 50 ? ["Decision learning maturity is weak."] : []),
    ...(scoreBreakdown.outcomeFeedbackScore < 50 ? ["Outcome feedback loop quality is weak."] : []),
    ...(scoreBreakdown.operationalLessonCaptureScore < 50 ? ["Operational lesson capture is weak."] : []),
    ...(scoreBreakdown.dealOutcomeLearningScore < 50 ? ["Deal outcome learning is weak."] : []),
    ...(scoreBreakdown.responseLearningScore < 50 ? ["Seller/buyer response learning is weak."] : []),
    ...(scoreBreakdown.processImprovementLearningScore < 50 ? ["Process improvement learning is weak."] : []),
    ...(scoreBreakdown.governanceLearningScore < 50 ? ["Governance learning maturity is weak."] : []),
    ...(scoreBreakdown.recommendationAccuracyReviewScore < 50 ? ["Recommendation accuracy review is weak."] : []),
    ...(scoreBreakdown.memoryReinforcementScore < 50 ? ["Institutional memory reinforcement is weak."] : []),
    ...(scoreBreakdown.continuousLearningMaturityScore < 50 ? ["Continuous learning maturity is weak."] : []),
    ...(missingData.length > 0 ? `Missing data reduces confidence: ${missingData.slice(0, 4).join(", ")}.` : []),
  ]);
}

function buildStrengths(scoreBreakdown: EnterpriseInstitutionalLearningScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.overallLearningScore >= 70 ? ["Overall institutional learning maturity is strong."] : []),
    ...(scoreBreakdown.decisionLearningScore >= 70 ? ["Decision learning maturity is strong."] : []),
    ...(scoreBreakdown.outcomeFeedbackScore >= 70 ? ["Outcome feedback loop quality is strong."] : []),
    ...(scoreBreakdown.operationalLessonCaptureScore >= 70 ? ["Operational lesson capture is strong."] : []),
    ...(scoreBreakdown.dealOutcomeLearningScore >= 70 ? ["Deal outcome learning is strong."] : []),
    ...(scoreBreakdown.responseLearningScore >= 70 ? ["Seller/buyer response learning is strong."] : []),
    ...(scoreBreakdown.processImprovementLearningScore >= 70 ? ["Process improvement learning is strong."] : []),
    ...(scoreBreakdown.governanceLearningScore >= 70 ? ["Governance learning maturity is strong."] : []),
    ...(scoreBreakdown.recommendationAccuracyReviewScore >= 70 ? ["Recommendation accuracy review is strong."] : []),
    ...(scoreBreakdown.memoryReinforcementScore >= 70 ? ["Institutional memory reinforcement is strong."] : []),
    ...(scoreBreakdown.continuousLearningMaturityScore >= 70 ? ["Continuous learning maturity is strong."] : []),
  ]);
}

function buildRecommendations(scoreBreakdown: EnterpriseInstitutionalLearningScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.decisionLearningScore < 58 ? ["Review decision learning gaps and preserve human-reviewed decision lessons."] : []),
    ...(scoreBreakdown.outcomeFeedbackScore < 58 ? ["Review outcome feedback loops and document recurring feedback themes."] : []),
    ...(scoreBreakdown.operationalLessonCaptureScore < 58 ? ["Review operational lesson capture gaps across bottlenecks, friction, and process misses."] : []),
    ...(scoreBreakdown.dealOutcomeLearningScore < 58 ? ["Review deal outcome learning without making investment, lending, or portfolio-management recommendations."] : []),
    ...(scoreBreakdown.responseLearningScore < 58 ? ["Review seller/buyer response learning without triggering outreach, SMS, email, or CRM automation."] : []),
    ...(scoreBreakdown.processImprovementLearningScore < 58 ? ["Review process improvement learning without autonomous optimization or workflow mutation."] : []),
    ...(scoreBreakdown.governanceLearningScore < 58 ? ["Review governance learning maturity; this is not legal, HR, ownership, or tax advice."] : []),
    ...(scoreBreakdown.recommendationAccuracyReviewScore < 58 ? ["Review recommendation accuracy manually and document calibration notes."] : []),
    ...(scoreBreakdown.memoryReinforcementScore < 58 ? ["Review institutional memory reinforcement and preserve reusable learning notes."] : []),
    ...(scoreBreakdown.continuousLearningMaturityScore < 58 ? ["Review continuous learning maturity and establish human-reviewed learning cadence."] : []),
    "Keep institutional-learning improvements human-reviewed; this module does not provide legal, HR, ownership, tax, lending, investment, portfolio-management, autonomous optimization, autonomous management, or market-prediction advice.",
  ]);
}

function buildExplanation(params: {
  scoreBreakdown: EnterpriseInstitutionalLearningScoreBreakdown;
  institutionalLearningLevel: InstitutionalLearningLevel;
}) {
  const scoreBreakdown = params.scoreBreakdown;

  return [
    `Institutional learning level is ${params.institutionalLearningLevel} with an overall learning score of ${scoreBreakdown.overallLearningScore}/100.`,
    `Decision learning is ${scoreBreakdown.decisionLearningScore}/100, outcome feedback is ${scoreBreakdown.outcomeFeedbackScore}/100, and memory reinforcement is ${scoreBreakdown.memoryReinforcementScore}/100.`,
    "Decision learning, outcome feedback, operational lesson capture, deal outcome learning, seller/buyer response learning, process improvement learning, governance learning, recommendation accuracy review, memory reinforcement, and continuous learning maturity were scored deterministically from structured inputs and optional read-only profile fallbacks.",
    "This output identifies learning-system gaps only and does not provide legal, HR, ownership, tax, lending, investment, portfolio-management, autonomous optimization, autonomous management, or market-prediction advice.",
  ];
}

function buildTrace(scoreBreakdown: EnterpriseInstitutionalLearningScoreBreakdown, missingData: string[]) {
  return [
    "Normalized all numeric scores to a deterministic 0-100 scale.",
    "Derived optional fallback scores only from supplied in-memory intelligence profiles.",
    `Computed enterprise institutional learning from decision learning (${scoreBreakdown.decisionLearningScore}), outcome feedback (${scoreBreakdown.outcomeFeedbackScore}), operational lesson capture (${scoreBreakdown.operationalLessonCaptureScore}), deal outcome learning (${scoreBreakdown.dealOutcomeLearningScore}), response learning (${scoreBreakdown.responseLearningScore}), process improvement learning (${scoreBreakdown.processImprovementLearningScore}), governance learning (${scoreBreakdown.governanceLearningScore}), recommendation accuracy review (${scoreBreakdown.recommendationAccuracyReviewScore}), memory reinforcement (${scoreBreakdown.memoryReinforcementScore}), and continuous learning maturity (${scoreBreakdown.continuousLearningMaturityScore}).`,
    missingData.length > 0 ? `Missing inputs flagged for human verification: ${missingData.join(", ")}.` : "No required structured inputs were missing.",
    "No outreach, SMS, email, Twilio, database writes, schema changes, workflow mutation, protected-class logic, demographic targeting, external APIs, scraping, autonomous learning actions, autonomous optimization, autonomous execution, or autonomous management decisions were used.",
  ];
}

function buildAssumptions(input: EnterpriseInstitutionalLearningInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0
      ? ["Missing enterprise institutional learning inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."]
      : []),
    "Enterprise institutional learning intelligence is deterministic, explainable, read-only, compliance-first, and designed for human review before any execution.",
    "This engine evaluates learning from decisions, outcomes, bottlenecks, missed opportunities, seller/buyer responses, operational friction, governance reviews, and performance patterns only.",
    "No outreach, SMS, email sending, Twilio, autonomous execution, autonomous learning actions, autonomous optimization, autonomous management decisions, DB writes, schema changes, workflow mutations, external APIs, scraping, demographic data, or protected-class data were used.",
    "This is not legal advice, HR advice, ownership advice, tax advice, lending advice, investment advice, portfolio-management advice, autonomous optimization, autonomous management, or market prediction.",
  ]);
}

export function analyzeEnterpriseInstitutionalLearningIntelligence(
  input: EnterpriseInstitutionalLearningInput = {},
): EnterpriseInstitutionalLearningResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const institutionalLearningLevel = classifyInstitutionalLearning(scoreBreakdown.overallLearningScore);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallLearningScore: scoreBreakdown.overallLearningScore,
    institutionalLearningLevel,
    decisionLearningScore: scoreBreakdown.decisionLearningScore,
    outcomeFeedbackScore: scoreBreakdown.outcomeFeedbackScore,
    operationalLessonCaptureScore: scoreBreakdown.operationalLessonCaptureScore,
    dealOutcomeLearningScore: scoreBreakdown.dealOutcomeLearningScore,
    responseLearningScore: scoreBreakdown.responseLearningScore,
    processImprovementLearningScore: scoreBreakdown.processImprovementLearningScore,
    governanceLearningScore: scoreBreakdown.governanceLearningScore,
    recommendationAccuracyReviewScore: scoreBreakdown.recommendationAccuracyReviewScore,
    memoryReinforcementScore: scoreBreakdown.memoryReinforcementScore,
    continuousLearningMaturityScore: scoreBreakdown.continuousLearningMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown, missingData),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    learningWarnings: buildLearningWarnings(scoreBreakdown, missingData),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input, missingData),
    explanation: buildExplanation({ scoreBreakdown, institutionalLearningLevel }),
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

export const getEnterpriseInstitutionalLearningIntelligence = analyzeEnterpriseInstitutionalLearningIntelligence;
