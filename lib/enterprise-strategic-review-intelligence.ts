import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type StrategicReviewLevel = "weak" | "irregular" | "developing" | "disciplined" | "institutional";

export type EnterpriseStrategicReviewInput = {
  reassessmentDisciplineScore?: number;
  governanceReviewScore?: number;
  doctrineReviewCadenceScore?: number;
  executiveReviewScore?: number;
  strategicAdaptationScore?: number;
  expansionReassessmentScore?: number;
  portfolioReassessmentScore?: number;
  longHorizonReviewScore?: number;
  institutionalReassessmentScore?: number;
  strategicReviewMaturityScore?: number;
  enterpriseOperatingRhythmProfile?: unknown;
  enterpriseDecisionAuditProfile?: unknown;
  enterpriseStrategicDoctrineProfile?: unknown;
  enterpriseStrategicMemoryProfile?: unknown;
  enterpriseInstitutionalLearningProfile?: unknown;
  enterpriseInstitutionalCohesionProfile?: unknown;
  enterpriseStrategicConsistencyProfile?: unknown;
  enterpriseExpansionGovernanceProfile?: unknown;
  portfolioRiskBalancingProfile?: unknown;
  longHorizonWealthPreservationProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseStrategicReviewScoreBreakdown = CorridorScoreBreakdown & {
  overallStrategicReviewScore: number;
  reassessmentDisciplineScore: number;
  governanceReviewScore: number;
  doctrineReviewCadenceScore: number;
  executiveReviewScore: number;
  strategicAdaptationScore: number;
  expansionReassessmentScore: number;
  portfolioReassessmentScore: number;
  longHorizonReviewScore: number;
  institutionalReassessmentScore: number;
  strategicReviewMaturityScore: number;
};

export type EnterpriseStrategicReviewResult = {
  overallStrategicReviewScore: number;
  strategicReviewLevel: StrategicReviewLevel;
  reassessmentDisciplineScore: number;
  governanceReviewScore: number;
  doctrineReviewCadenceScore: number;
  executiveReviewScore: number;
  strategicAdaptationScore: number;
  expansionReassessmentScore: number;
  portfolioReassessmentScore: number;
  longHorizonReviewScore: number;
  institutionalReassessmentScore: number;
  strategicReviewMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseStrategicReviewScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  reviewWarnings: string[];
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
    autonomousReviewActions: false;
    autonomousApprovalSystemsUsed: false;
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

const REQUIRED_INPUTS: Array<keyof EnterpriseStrategicReviewInput> = [
  "reassessmentDisciplineScore",
  "governanceReviewScore",
  "doctrineReviewCadenceScore",
  "executiveReviewScore",
  "strategicAdaptationScore",
  "expansionReassessmentScore",
  "portfolioReassessmentScore",
  "longHorizonReviewScore",
  "institutionalReassessmentScore",
  "strategicReviewMaturityScore",
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

function hasFallbackForInput(input: EnterpriseStrategicReviewInput, key: keyof EnterpriseStrategicReviewInput) {
  const rhythmProfile = input.enterpriseOperatingRhythmProfile;
  const auditProfile = input.enterpriseDecisionAuditProfile;
  const doctrineProfile = input.enterpriseStrategicDoctrineProfile;
  const memoryProfile = input.enterpriseStrategicMemoryProfile;
  const learningProfile = input.enterpriseInstitutionalLearningProfile;
  const cohesionProfile = input.enterpriseInstitutionalCohesionProfile;
  const consistencyProfile = input.enterpriseStrategicConsistencyProfile;
  const expansionProfile = input.enterpriseExpansionGovernanceProfile;
  const portfolioProfile = input.portfolioRiskBalancingProfile;
  const preservationProfile = input.longHorizonWealthPreservationProfile;

  const fallbackPaths: Partial<Record<keyof EnterpriseStrategicReviewInput, boolean>> = {
    reassessmentDisciplineScore:
      hasProfileScore(rhythmProfile, ["strategicSynchronizationScore", "decisionReviewTimingScore"]) ||
      hasProfileScore(auditProfile, ["reviewDisciplineScore", "postDecisionEvaluationScore"]),
    governanceReviewScore:
      hasProfileScore(auditProfile, ["governanceAlignmentScore", "reviewDisciplineScore"]) ||
      hasProfileScore(rhythmProfile, ["quarterlyGovernanceScore"]) ||
      hasProfileScore(expansionProfile, ["humanReviewGovernanceAlignment"]),
    doctrineReviewCadenceScore:
      hasProfileScore(doctrineProfile, ["overallDoctrineScore", "doctrineTransferabilityScore"]) ||
      hasProfileScore(memoryProfile, ["doctrinePreservationScore"]) ||
      hasProfileScore(rhythmProfile, ["strategicSynchronizationScore"]),
    executiveReviewScore:
      hasProfileScore(auditProfile, ["strategicAlignmentScore", "decisionAuditMaturityScore"]) ||
      hasProfileScore(cohesionProfile, ["institutionalIdentityScore", "overallCohesionScore"]),
    strategicAdaptationScore:
      hasProfileScore(learningProfile, ["processImprovementLearningScore", "continuousLearningMaturityScore"]) ||
      hasProfileScore(auditProfile, ["outcomeReviewScore", "postDecisionEvaluationScore"]),
    expansionReassessmentScore:
      hasProfileScore(expansionProfile, ["expansionControlQuality", "expansionOversightQuality"]) ||
      hasProfileScore(consistencyProfile, ["expansionConsistencyScore"]),
    portfolioReassessmentScore:
      hasProfileScore(portfolioProfile, ["riskAdjustedPortfolioQuality", "riskBalanceQuality"]) ||
      hasProfileScore(consistencyProfile, ["portfolioConsistencyScore"]),
    longHorizonReviewScore:
      hasProfileScore(preservationProfile, ["longHorizonPreservationQuality", "institutionalContinuityDurability"]) ||
      hasProfileScore(memoryProfile, ["longHorizonContinuityScore"]),
    institutionalReassessmentScore:
      hasProfileScore(cohesionProfile, ["overallCohesionScore", "institutionalIdentityScore"]) ||
      hasProfileScore(learningProfile, ["memoryReinforcementScore", "continuousLearningMaturityScore"]),
    strategicReviewMaturityScore:
      hasProfileScore(auditProfile, ["decisionAuditMaturityScore", "overallDecisionAuditScore"]) ||
      hasProfileScore(rhythmProfile, ["institutionalRhythmMaturityScore"]) ||
      hasProfileScore(consistencyProfile, ["institutionalCoherenceScore"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: EnterpriseStrategicReviewInput) {
  const labels: Record<keyof EnterpriseStrategicReviewInput, string> = {
    reassessmentDisciplineScore: "strategic reassessment discipline score",
    governanceReviewScore: "governance review quality score",
    doctrineReviewCadenceScore: "doctrine review cadence score",
    executiveReviewScore: "executive review maturity score",
    strategicAdaptationScore: "strategic adaptation readiness score",
    expansionReassessmentScore: "expansion reassessment discipline score",
    portfolioReassessmentScore: "portfolio reassessment quality score",
    longHorizonReviewScore: "long-horizon review quality score",
    institutionalReassessmentScore: "institutional reassessment consistency score",
    strategicReviewMaturityScore: "strategic review maturity score",
    enterpriseOperatingRhythmProfile: "enterprise operating rhythm profile",
    enterpriseDecisionAuditProfile: "enterprise decision audit profile",
    enterpriseStrategicDoctrineProfile: "enterprise strategic doctrine profile",
    enterpriseStrategicMemoryProfile: "enterprise strategic memory profile",
    enterpriseInstitutionalLearningProfile: "enterprise institutional learning profile",
    enterpriseInstitutionalCohesionProfile: "enterprise institutional cohesion profile",
    enterpriseStrategicConsistencyProfile: "enterprise strategic consistency profile",
    enterpriseExpansionGovernanceProfile: "enterprise expansion governance profile",
    portfolioRiskBalancingProfile: "portfolio risk balancing profile",
    longHorizonWealthPreservationProfile: "long-horizon wealth preservation profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: EnterpriseStrategicReviewInput): EnterpriseStrategicReviewScoreBreakdown {
  const rhythmProfile = input.enterpriseOperatingRhythmProfile;
  const auditProfile = input.enterpriseDecisionAuditProfile;
  const doctrineProfile = input.enterpriseStrategicDoctrineProfile;
  const memoryProfile = input.enterpriseStrategicMemoryProfile;
  const learningProfile = input.enterpriseInstitutionalLearningProfile;
  const cohesionProfile = input.enterpriseInstitutionalCohesionProfile;
  const consistencyProfile = input.enterpriseStrategicConsistencyProfile;
  const expansionProfile = input.enterpriseExpansionGovernanceProfile;
  const portfolioProfile = input.portfolioRiskBalancingProfile;
  const preservationProfile = input.longHorizonWealthPreservationProfile;
  const governanceReviewScore = getScore(
    input.governanceReviewScore,
    weightedAverage([
      [extractProfileScore(auditProfile, ["governanceAlignmentScore", "scoreBreakdown.governanceAlignmentScore"], 54), 0.22],
      [extractProfileScore(auditProfile, ["reviewDisciplineScore", "scoreBreakdown.reviewDisciplineScore"], 54), 0.18],
      [extractProfileScore(rhythmProfile, ["quarterlyGovernanceScore", "scoreBreakdown.quarterlyGovernanceScore"], 54), 0.16],
      [extractProfileScore(expansionProfile, ["humanReviewGovernanceAlignment", "scoreBreakdown.humanReviewGovernanceAlignmentScore"], 54), 0.16],
      [extractProfileScore(doctrineProfile, ["governanceDoctrineScore"], 54), 0.12],
      [extractProfileScore(cohesionProfile, ["governanceCohesionScore"], 54), 0.08],
      [extractProfileScore(consistencyProfile, ["governanceConsistencyScore"], 54), 0.08],
    ]),
  );
  const reassessmentDisciplineScore = getScore(
    input.reassessmentDisciplineScore,
    weightedAverage([
      [extractProfileScore(rhythmProfile, ["strategicSynchronizationScore", "scoreBreakdown.strategicSynchronizationScore"], 54), 0.18],
      [extractProfileScore(rhythmProfile, ["decisionReviewTimingScore", "scoreBreakdown.decisionReviewTimingScore"], 54), 0.16],
      [extractProfileScore(auditProfile, ["reviewDisciplineScore"], 54), 0.16],
      [extractProfileScore(auditProfile, ["postDecisionEvaluationScore"], 54), 0.14],
      [governanceReviewScore, 0.12],
      [extractProfileScore(learningProfile, ["outcomeFeedbackScore"], 54), 0.12],
      [extractProfileScore(memoryProfile, ["historicalDecisionRetentionScore"], 54), 0.12],
    ]),
  );
  const doctrineReviewCadenceScore = getScore(
    input.doctrineReviewCadenceScore,
    weightedAverage([
      [extractProfileScore(doctrineProfile, ["overallDoctrineScore", "scoreBreakdown.overallDoctrineScore"], 54), 0.18],
      [extractProfileScore(doctrineProfile, ["doctrineTransferabilityScore", "scoreBreakdown.doctrineTransferabilityScore"], 54), 0.16],
      [extractProfileScore(memoryProfile, ["doctrinePreservationScore", "scoreBreakdown.doctrinePreservationScore"], 54), 0.16],
      [extractProfileScore(rhythmProfile, ["strategicSynchronizationScore"], 54), 0.14],
      [reassessmentDisciplineScore, 0.12],
      [governanceReviewScore, 0.1],
      [extractProfileScore(learningProfile, ["memoryReinforcementScore"], 54), 0.08],
      [extractProfileScore(cohesionProfile, ["institutionalIdentityScore"], 54), 0.06],
    ]),
  );
  const executiveReviewScore = getScore(
    input.executiveReviewScore,
    weightedAverage([
      [extractProfileScore(auditProfile, ["strategicAlignmentScore", "scoreBreakdown.strategicAlignmentScore"], 54), 0.18],
      [extractProfileScore(auditProfile, ["decisionAuditMaturityScore", "scoreBreakdown.decisionAuditMaturityScore"], 54), 0.16],
      [governanceReviewScore, 0.14],
      [reassessmentDisciplineScore, 0.12],
      [extractProfileScore(cohesionProfile, ["institutionalIdentityScore"], 54), 0.12],
      [extractProfileScore(cohesionProfile, ["overallCohesionScore"], 54), 0.1],
      [extractProfileScore(rhythmProfile, ["institutionalRhythmMaturityScore"], 54), 0.1],
      [doctrineReviewCadenceScore, 0.08],
    ]),
  );
  const strategicAdaptationScore = getScore(
    input.strategicAdaptationScore,
    weightedAverage([
      [extractProfileScore(learningProfile, ["processImprovementLearningScore", "scoreBreakdown.processImprovementLearningScore"], 54), 0.18],
      [extractProfileScore(learningProfile, ["continuousLearningMaturityScore", "scoreBreakdown.continuousLearningMaturityScore"], 54), 0.16],
      [extractProfileScore(auditProfile, ["outcomeReviewScore", "scoreBreakdown.outcomeReviewScore"], 54), 0.14],
      [extractProfileScore(auditProfile, ["postDecisionEvaluationScore"], 54), 0.12],
      [reassessmentDisciplineScore, 0.12],
      [executiveReviewScore, 0.1],
      [extractProfileScore(consistencyProfile, ["overallConsistencyScore"], 54), 0.1],
      [doctrineReviewCadenceScore, 0.08],
    ]),
  );
  const expansionReassessmentScore = getScore(
    input.expansionReassessmentScore,
    weightedAverage([
      [extractProfileScore(expansionProfile, ["expansionControlQuality", "scoreBreakdown.expansionControlQualityScore"], 54), 0.18],
      [extractProfileScore(expansionProfile, ["expansionOversightQuality", "scoreBreakdown.expansionOversightQualityScore"], 54), 0.16],
      [extractProfileScore(consistencyProfile, ["expansionConsistencyScore", "scoreBreakdown.expansionConsistencyScore"], 54), 0.14],
      [extractProfileScore(doctrineProfile, ["expansionDoctrineScore"], 54), 0.12],
      [governanceReviewScore, 0.12],
      [strategicAdaptationScore, 0.1],
      [extractProfileScore(auditProfile, ["approvalConsistencyScore"], 54), 0.1],
      [extractProfileScore(cohesionProfile, ["scalingCoherenceScore"], 54), 0.08],
    ]),
  );
  const portfolioReassessmentScore = getScore(
    input.portfolioReassessmentScore,
    weightedAverage([
      [extractProfileScore(portfolioProfile, ["riskAdjustedPortfolioQuality", "scoreBreakdown.riskAdjustedPortfolioQualityScore"], 54), 0.18],
      [extractProfileScore(portfolioProfile, ["riskBalanceQuality", "scoreBreakdown.riskBalanceQualityScore"], 54), 0.16],
      [extractProfileScore(consistencyProfile, ["portfolioConsistencyScore"], 54), 0.14],
      [extractProfileScore(rhythmProfile, ["portfolioReviewCadenceScore"], 54), 0.12],
      [governanceReviewScore, 0.12],
      [extractProfileScore(doctrineProfile, ["riskDoctrineScore"], 54), 0.1],
      [strategicAdaptationScore, 0.1],
      [extractProfileScore(memoryProfile, ["portfolioStrategyMemoryScore"], 54), 0.08],
    ]),
  );
  const longHorizonReviewScore = getScore(
    input.longHorizonReviewScore,
    weightedAverage([
      [extractProfileScore(preservationProfile, ["longHorizonPreservationQuality", "scoreBreakdown.longHorizonPreservationQualityScore"], 54), 0.18],
      [extractProfileScore(preservationProfile, ["institutionalContinuityDurability", "scoreBreakdown.institutionalContinuityDurabilityScore"], 54), 0.16],
      [extractProfileScore(memoryProfile, ["longHorizonContinuityScore", "scoreBreakdown.longHorizonContinuityScore"], 54), 0.16],
      [extractProfileScore(doctrineProfile, ["longHorizonDoctrineScore"], 54), 0.12],
      [doctrineReviewCadenceScore, 0.1],
      [portfolioReassessmentScore, 0.08],
      [expansionReassessmentScore, 0.08],
      [executiveReviewScore, 0.06],
      [strategicAdaptationScore, 0.06],
    ]),
  );
  const institutionalReassessmentScore = getScore(
    input.institutionalReassessmentScore,
    weightedAverage([
      [extractProfileScore(cohesionProfile, ["overallCohesionScore", "scoreBreakdown.overallCohesionScore"], 54), 0.16],
      [extractProfileScore(cohesionProfile, ["institutionalIdentityScore"], 54), 0.14],
      [extractProfileScore(learningProfile, ["continuousLearningMaturityScore"], 54), 0.14],
      [extractProfileScore(learningProfile, ["memoryReinforcementScore"], 54), 0.12],
      [reassessmentDisciplineScore, 0.12],
      [governanceReviewScore, 0.1],
      [doctrineReviewCadenceScore, 0.08],
      [longHorizonReviewScore, 0.08],
      [extractProfileScore(consistencyProfile, ["institutionalCoherenceScore"], 54), 0.06],
    ]),
  );
  const strategicReviewMaturityScore = getScore(
    input.strategicReviewMaturityScore,
    weightedAverage([
      [reassessmentDisciplineScore, 0.11],
      [governanceReviewScore, 0.11],
      [doctrineReviewCadenceScore, 0.1],
      [executiveReviewScore, 0.1],
      [strategicAdaptationScore, 0.11],
      [expansionReassessmentScore, 0.09],
      [portfolioReassessmentScore, 0.09],
      [longHorizonReviewScore, 0.11],
      [institutionalReassessmentScore, 0.11],
      [extractProfileScore(auditProfile, ["decisionAuditMaturityScore"], 54), 0.04],
      [extractProfileScore(rhythmProfile, ["institutionalRhythmMaturityScore"], 54), 0.03],
    ]),
  );
  const overallStrategicReviewScore = weightedAverage([
    [reassessmentDisciplineScore, 0.12],
    [governanceReviewScore, 0.12],
    [doctrineReviewCadenceScore, 0.1],
    [executiveReviewScore, 0.1],
    [strategicAdaptationScore, 0.11],
    [expansionReassessmentScore, 0.09],
    [portfolioReassessmentScore, 0.09],
    [longHorizonReviewScore, 0.11],
    [institutionalReassessmentScore, 0.08],
    [strategicReviewMaturityScore, 0.08],
  ]);

  return {
    connectivityScore: executiveReviewScore,
    durabilityScore: overallStrategicReviewScore,
    expansionScore: expansionReassessmentScore,
    institutionalScore: strategicReviewMaturityScore,
    logisticsScore: reassessmentDisciplineScore,
    luxuryScore: portfolioReassessmentScore,
    developmentScore: longHorizonReviewScore,
    overallStrategicReviewScore,
    reassessmentDisciplineScore,
    governanceReviewScore,
    doctrineReviewCadenceScore,
    executiveReviewScore,
    strategicAdaptationScore,
    expansionReassessmentScore,
    portfolioReassessmentScore,
    longHorizonReviewScore,
    institutionalReassessmentScore,
    strategicReviewMaturityScore,
  };
}

function classifyStrategicReview(score: number): StrategicReviewLevel {
  if (score >= 82) return "institutional";
  if (score >= 68) return "disciplined";
  if (score >= 54) return "developing";
  if (score >= 40) return "irregular";

  return "weak";
}

function buildWarnings(scoreBreakdown: EnterpriseStrategicReviewScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "STRATEGIC_REVIEW_DATA_INCOMPLETE",
            severity: missingData.length >= 5 ? "high" : "medium",
            message: "Enterprise strategic review assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.overallStrategicReviewScore < 42
      ? [
          createCorridorWarning({
            code: "STRATEGIC_REVIEW_WEAK",
            severity: "high",
            message: "Overall strategic review maturity is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.governanceReviewScore < 45
      ? [
          createCorridorWarning({
            code: "GOVERNANCE_REVIEW_WEAK",
            severity: "medium",
            message: "Governance review quality is weak and requires human review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.portfolioReassessmentScore < 45
      ? [
          createCorridorWarning({
            code: "PORTFOLIO_REASSESSMENT_WEAK",
            severity: "medium",
            message: "Portfolio reassessment quality is weak; no investment, lending, or portfolio-management advice is provided.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
  ];
}

function buildReviewWarnings(scoreBreakdown: EnterpriseStrategicReviewScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.reassessmentDisciplineScore < 55 ? ["Strategic reassessment discipline may be too irregular for durable review."] : []),
    ...(scoreBreakdown.governanceReviewScore < 55 ? ["Governance review quality may require human review."] : []),
    ...(scoreBreakdown.doctrineReviewCadenceScore < 55 ? ["Doctrine review cadence may be underdeveloped."] : []),
    ...(scoreBreakdown.executiveReviewScore < 55 ? ["Executive review maturity may be too thin."] : []),
    ...(scoreBreakdown.strategicAdaptationScore < 55 ? ["Strategic adaptation readiness may be underdeveloped; no autonomous optimization is performed."] : []),
    ...(scoreBreakdown.expansionReassessmentScore < 55 ? ["Expansion reassessment discipline may be underdeveloped."] : []),
    ...(scoreBreakdown.portfolioReassessmentScore < 55
      ? ["Portfolio reassessment quality may be underdeveloped; no investment or portfolio-management advice is produced."]
      : []),
    ...(scoreBreakdown.longHorizonReviewScore < 55 ? ["Long-horizon review quality may be too weak for durable strategy review."] : []),
    ...(scoreBreakdown.institutionalReassessmentScore < 55 ? ["Institutional reassessment consistency may be fragmented."] : []),
    ...(scoreBreakdown.strategicReviewMaturityScore < 55 ? ["Strategic review maturity may be underdeveloped."] : []),
    ...(missingData.length > 0 ? ["Review warnings require human validation because required structured inputs are incomplete."] : []),
  ]);
}

function buildReusableInfrastructureNotes(input: EnterpriseStrategicReviewInput, missingData: string[]) {
  return unique([
    "Reuses shared corridor score normalization, warning creation, confidence scoring, missing-data handling, and read-only score breakdown conventions.",
    "Consumes optional in-memory intelligence profiles only; no persistence, external API calls, scraping, routing, orchestration, or automation execution is introduced.",
    ...(input.enterpriseOperatingRhythmProfile ? ["Enterprise operating rhythm profile supplied as reusable cadence context."] : []),
    ...(input.enterpriseDecisionAuditProfile ? ["Enterprise decision audit profile supplied as reusable governance review context."] : []),
    ...(input.enterpriseStrategicDoctrineProfile ? ["Enterprise strategic doctrine profile supplied as reusable doctrine review context."] : []),
    ...(input.portfolioRiskBalancingProfile ? ["Portfolio risk balancing profile supplied as read-only portfolio reassessment context without portfolio-management behavior."] : []),
    ...(missingData.length > 0 ? ["Reusable profile coverage is incomplete, so conservative deterministic defaults and human verification remain required."] : []),
  ]);
}

function buildKeyRisks(scoreBreakdown: EnterpriseStrategicReviewScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.overallStrategicReviewScore < 50 ? ["Overall strategic review maturity is weak."] : []),
    ...(scoreBreakdown.reassessmentDisciplineScore < 50 ? ["Strategic reassessment discipline is weak."] : []),
    ...(scoreBreakdown.governanceReviewScore < 50 ? ["Governance review quality is weak."] : []),
    ...(scoreBreakdown.doctrineReviewCadenceScore < 50 ? ["Doctrine review cadence is weak."] : []),
    ...(scoreBreakdown.executiveReviewScore < 50 ? ["Executive review maturity is weak."] : []),
    ...(scoreBreakdown.strategicAdaptationScore < 50 ? ["Strategic adaptation readiness is weak."] : []),
    ...(scoreBreakdown.expansionReassessmentScore < 50 ? ["Expansion reassessment discipline is weak."] : []),
    ...(scoreBreakdown.portfolioReassessmentScore < 50 ? ["Portfolio reassessment quality is weak."] : []),
    ...(scoreBreakdown.longHorizonReviewScore < 50 ? ["Long-horizon review quality is weak."] : []),
    ...(scoreBreakdown.institutionalReassessmentScore < 50 ? ["Institutional reassessment consistency is weak."] : []),
    ...(scoreBreakdown.strategicReviewMaturityScore < 50 ? ["Strategic review maturity is weak."] : []),
    ...(missingData.length > 0 ? `Missing data reduces confidence: ${missingData.slice(0, 4).join(", ")}.` : []),
  ]);
}

function buildStrengths(scoreBreakdown: EnterpriseStrategicReviewScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.overallStrategicReviewScore >= 70 ? ["Overall strategic review maturity is strong."] : []),
    ...(scoreBreakdown.reassessmentDisciplineScore >= 70 ? ["Strategic reassessment discipline is strong."] : []),
    ...(scoreBreakdown.governanceReviewScore >= 70 ? ["Governance review quality is strong."] : []),
    ...(scoreBreakdown.doctrineReviewCadenceScore >= 70 ? ["Doctrine review cadence is strong."] : []),
    ...(scoreBreakdown.executiveReviewScore >= 70 ? ["Executive review maturity is strong."] : []),
    ...(scoreBreakdown.strategicAdaptationScore >= 70 ? ["Strategic adaptation readiness is strong."] : []),
    ...(scoreBreakdown.expansionReassessmentScore >= 70 ? ["Expansion reassessment discipline is strong."] : []),
    ...(scoreBreakdown.portfolioReassessmentScore >= 70 ? ["Portfolio reassessment quality is strong."] : []),
    ...(scoreBreakdown.longHorizonReviewScore >= 70 ? ["Long-horizon review quality is strong."] : []),
    ...(scoreBreakdown.institutionalReassessmentScore >= 70 ? ["Institutional reassessment consistency is strong."] : []),
    ...(scoreBreakdown.strategicReviewMaturityScore >= 70 ? ["Strategic review maturity is strong."] : []),
  ]);
}

function buildRecommendations(scoreBreakdown: EnterpriseStrategicReviewScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.reassessmentDisciplineScore < 58 ? ["Review strategic reassessment discipline and document human-reviewed reassessment checkpoints."] : []),
    ...(scoreBreakdown.governanceReviewScore < 58 ? ["Review governance review quality; this is not legal, HR, ownership, or tax advice."] : []),
    ...(scoreBreakdown.doctrineReviewCadenceScore < 58 ? ["Review doctrine review cadence and preserve human-reviewed doctrine context."] : []),
    ...(scoreBreakdown.executiveReviewScore < 58 ? ["Review executive review maturity and clarify manual review responsibilities."] : []),
    ...(scoreBreakdown.strategicAdaptationScore < 58 ? ["Review strategic adaptation readiness without autonomous strategy decisions or optimization."] : []),
    ...(scoreBreakdown.expansionReassessmentScore < 58 ? ["Review expansion reassessment discipline without autonomous strategy decisions or execution."] : []),
    ...(scoreBreakdown.portfolioReassessmentScore < 58
      ? ["Review portfolio reassessment quality without making investment, allocation, lending, or portfolio-management recommendations."]
      : []),
    ...(scoreBreakdown.longHorizonReviewScore < 58 ? ["Review long-horizon review quality and preserve durable strategic context."] : []),
    ...(scoreBreakdown.institutionalReassessmentScore < 58 ? ["Review institutional reassessment consistency and capture reusable review lessons."] : []),
    ...(scoreBreakdown.strategicReviewMaturityScore < 58 ? ["Review strategic review maturity and identify governance/reassessment gaps."] : []),
    "Keep strategic-review improvements human-reviewed; this module does not provide autonomous strategy decisions, legal, HR, ownership, tax, lending, investment, portfolio-management, treasury-management, or market-prediction advice.",
  ]);
}

function buildExplanation(params: { scoreBreakdown: EnterpriseStrategicReviewScoreBreakdown; strategicReviewLevel: StrategicReviewLevel }) {
  const scoreBreakdown = params.scoreBreakdown;

  return [
    `Strategic review level is ${params.strategicReviewLevel} with an overall strategic review score of ${scoreBreakdown.overallStrategicReviewScore}/100.`,
    `Reassessment discipline is ${scoreBreakdown.reassessmentDisciplineScore}/100, governance review is ${scoreBreakdown.governanceReviewScore}/100, and long-horizon review is ${scoreBreakdown.longHorizonReviewScore}/100.`,
    "Strategic reassessment, governance review, doctrine cadence, executive review, strategic adaptation, expansion reassessment, portfolio reassessment, long-horizon review, institutional reassessment, and strategic review maturity were scored deterministically from structured inputs and optional read-only profile fallbacks.",
    "This output identifies strategic review and reassessment gaps only and does not provide autonomous strategy decisions, legal, HR, ownership, tax, lending, investment, portfolio-management, treasury-management, autonomous optimization, or market-prediction advice.",
  ];
}

function buildTrace(scoreBreakdown: EnterpriseStrategicReviewScoreBreakdown, missingData: string[]) {
  return [
    "Normalized all numeric scores to a deterministic 0-100 scale.",
    "Derived optional fallback scores only from supplied in-memory intelligence profiles.",
    `Computed enterprise strategic review from reassessment discipline (${scoreBreakdown.reassessmentDisciplineScore}), governance review (${scoreBreakdown.governanceReviewScore}), doctrine cadence (${scoreBreakdown.doctrineReviewCadenceScore}), executive review (${scoreBreakdown.executiveReviewScore}), adaptation (${scoreBreakdown.strategicAdaptationScore}), expansion reassessment (${scoreBreakdown.expansionReassessmentScore}), portfolio reassessment (${scoreBreakdown.portfolioReassessmentScore}), long-horizon review (${scoreBreakdown.longHorizonReviewScore}), institutional reassessment (${scoreBreakdown.institutionalReassessmentScore}), and review maturity (${scoreBreakdown.strategicReviewMaturityScore}).`,
    missingData.length > 0 ? `Missing inputs flagged for human verification: ${missingData.join(", ")}.` : "No required structured inputs were missing.",
    "No outreach, SMS, email, Twilio, database writes, schema changes, workflow mutation, protected-class logic, demographic targeting, external APIs, scraping, autonomous strategy decisions, autonomous review actions, autonomous optimization, autonomous execution, or autonomous management decisions were used.",
  ];
}

function buildAssumptions(input: EnterpriseStrategicReviewInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0
      ? ["Missing enterprise strategic review inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."]
      : []),
    "Enterprise strategic review intelligence is deterministic, explainable, read-only, compliance-first, and designed for human review before any execution.",
    "This engine evaluates strategic reassessment discipline, governance review quality, doctrine review cadence, executive review maturity, strategic adaptation readiness, expansion reassessment, portfolio reassessment, long-horizon review, institutional reassessment, and strategic review maturity only.",
    "No outreach, SMS, email sending, Twilio, autonomous execution, autonomous strategy decisions, autonomous review actions, autonomous optimization, autonomous management decisions, DB writes, schema changes, workflow mutations, external APIs, scraping, demographic data, or protected-class data were used.",
    "This is not legal advice, HR advice, ownership advice, tax advice, lending advice, investment advice, portfolio-management advice, treasury management, autonomous strategy, autonomous optimization, autonomous management, or market prediction.",
  ]);
}

export function analyzeEnterpriseStrategicReviewIntelligence(input: EnterpriseStrategicReviewInput = {}): EnterpriseStrategicReviewResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const strategicReviewLevel = classifyStrategicReview(scoreBreakdown.overallStrategicReviewScore);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallStrategicReviewScore: scoreBreakdown.overallStrategicReviewScore,
    strategicReviewLevel,
    reassessmentDisciplineScore: scoreBreakdown.reassessmentDisciplineScore,
    governanceReviewScore: scoreBreakdown.governanceReviewScore,
    doctrineReviewCadenceScore: scoreBreakdown.doctrineReviewCadenceScore,
    executiveReviewScore: scoreBreakdown.executiveReviewScore,
    strategicAdaptationScore: scoreBreakdown.strategicAdaptationScore,
    expansionReassessmentScore: scoreBreakdown.expansionReassessmentScore,
    portfolioReassessmentScore: scoreBreakdown.portfolioReassessmentScore,
    longHorizonReviewScore: scoreBreakdown.longHorizonReviewScore,
    institutionalReassessmentScore: scoreBreakdown.institutionalReassessmentScore,
    strategicReviewMaturityScore: scoreBreakdown.strategicReviewMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown, missingData),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    reviewWarnings: buildReviewWarnings(scoreBreakdown, missingData),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input, missingData),
    explanation: buildExplanation({ scoreBreakdown, strategicReviewLevel }),
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
      autonomousReviewActions: false,
      autonomousApprovalSystemsUsed: false,
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

export const getEnterpriseStrategicReviewIntelligence = analyzeEnterpriseStrategicReviewIntelligence;
