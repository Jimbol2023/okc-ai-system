import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type OperatingRhythmLevel = "unstable" | "inconsistent" | "developing" | "disciplined" | "institutional";

export type EnterpriseOperatingRhythmInput = {
  weeklyRhythmScore?: number;
  monthlyCadenceScore?: number;
  quarterlyGovernanceScore?: number;
  portfolioReviewCadenceScore?: number;
  followUpRhythmScore?: number;
  decisionReviewTimingScore?: number;
  operationalTempoScore?: number;
  strategicSynchronizationScore?: number;
  crisisCadenceReadinessScore?: number;
  institutionalRhythmMaturityScore?: number;
  processOptimizationProfile?: unknown;
  operationalQaProcessDriftProfile?: unknown;
  operationalPlaybookProfile?: unknown;
  institutionalKnowledgeTransferProfile?: unknown;
  familyOfficeGovernanceProfile?: unknown;
  enterpriseRiskProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseOperatingRhythmScoreBreakdown = CorridorScoreBreakdown & {
  overallRhythmScore: number;
  weeklyRhythmScore: number;
  monthlyCadenceScore: number;
  quarterlyGovernanceScore: number;
  portfolioReviewCadenceScore: number;
  followUpRhythmScore: number;
  decisionReviewTimingScore: number;
  operationalTempoScore: number;
  strategicSynchronizationScore: number;
  crisisCadenceReadinessScore: number;
  institutionalRhythmMaturityScore: number;
};

export type EnterpriseOperatingRhythmResult = {
  overallRhythmScore: number;
  operatingRhythmLevel: OperatingRhythmLevel;
  weeklyRhythmScore: number;
  monthlyCadenceScore: number;
  quarterlyGovernanceScore: number;
  portfolioReviewCadenceScore: number;
  followUpRhythmScore: number;
  decisionReviewTimingScore: number;
  operationalTempoScore: number;
  strategicSynchronizationScore: number;
  crisisCadenceReadinessScore: number;
  institutionalRhythmMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseOperatingRhythmScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  cadenceWarnings: string[];
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

const REQUIRED_INPUTS: Array<keyof EnterpriseOperatingRhythmInput> = [
  "weeklyRhythmScore",
  "monthlyCadenceScore",
  "quarterlyGovernanceScore",
  "portfolioReviewCadenceScore",
  "followUpRhythmScore",
  "decisionReviewTimingScore",
  "operationalTempoScore",
  "strategicSynchronizationScore",
  "crisisCadenceReadinessScore",
  "institutionalRhythmMaturityScore",
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

function hasFallbackForInput(input: EnterpriseOperatingRhythmInput, key: keyof EnterpriseOperatingRhythmInput) {
  const optimizationProfile = input.processOptimizationProfile;
  const qaProfile = input.operationalQaProcessDriftProfile;
  const playbookProfile = input.operationalPlaybookProfile;
  const knowledgeProfile = input.institutionalKnowledgeTransferProfile;
  const governanceProfile = input.familyOfficeGovernanceProfile;
  const riskProfile = input.enterpriseRiskProfile;

  const fallbackPaths: Partial<Record<keyof EnterpriseOperatingRhythmInput, boolean>> = {
    weeklyRhythmScore:
      hasProfileScore(qaProfile, ["sopAdherenceScore", "workflowConsistencyScore"]) ||
      hasProfileScore(optimizationProfile, ["workflowEfficiencyScore", "continuousImprovementReadinessScore"]),
    monthlyCadenceScore:
      hasProfileScore(optimizationProfile, ["continuousImprovementReadinessScore", "documentationEfficiencyScore"]) ||
      hasProfileScore(playbookProfile, ["updateDisciplineScore"]),
    quarterlyGovernanceScore:
      hasProfileScore(qaProfile, ["governanceConsistencyScore"]) ||
      hasProfileScore(governanceProfile, ["operatingDiscipline", "humanReviewGovernanceAlignment"]),
    portfolioReviewCadenceScore:
      hasProfileScore(qaProfile, ["portfolioReviewConsistencyScore"]) ||
      hasProfileScore(playbookProfile, ["portfolioReviewPlaybookScore"]),
    followUpRhythmScore:
      hasProfileScore(qaProfile, ["followUpConsistencyScore", "communicationConsistencyScore"]) ||
      hasProfileScore(optimizationProfile, ["followUpEfficiencyScore"]),
    decisionReviewTimingScore:
      hasProfileScore(knowledgeProfile, ["decisionHistoryPreservationScore"]) ||
      hasProfileScore(governanceProfile, ["decisionAccountability", "governanceDocumentationReadiness"]),
    operationalTempoScore:
      hasProfileScore(optimizationProfile, ["workflowEfficiencyScore", "frictionRiskScore"]) ||
      hasProfileScore(qaProfile, ["overallOperationalConsistencyScore", "operationalEntropyRiskScore"]),
    strategicSynchronizationScore:
      hasProfileScore(governanceProfile, ["humanReviewGovernanceAlignment", "multiEntityCoordinationReadiness"]) ||
      hasProfileScore(optimizationProfile, ["governanceEfficiencyScore"]),
    crisisCadenceReadinessScore:
      hasProfileScore(qaProfile, ["emergencyContinuityConsistencyScore"]) ||
      hasProfileScore(riskProfile, ["operationalContinuityResilience", "defensiveOperationalResilience"]),
    institutionalRhythmMaturityScore:
      hasProfileScore(optimizationProfile, ["overallOptimizationScore", "continuousImprovementReadinessScore"]) ||
      hasProfileScore(playbookProfile, ["overallPlaybookReadinessScore", "updateDisciplineScore"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: EnterpriseOperatingRhythmInput) {
  const labels: Record<keyof EnterpriseOperatingRhythmInput, string> = {
    weeklyRhythmScore: "weekly operating rhythm discipline score",
    monthlyCadenceScore: "monthly review cadence score",
    quarterlyGovernanceScore: "quarterly governance review cadence score",
    portfolioReviewCadenceScore: "portfolio review timing consistency score",
    followUpRhythmScore: "follow-up rhythm consistency score",
    decisionReviewTimingScore: "decision review timing discipline score",
    operationalTempoScore: "operational tempo stability score",
    strategicSynchronizationScore: "strategic review synchronization score",
    crisisCadenceReadinessScore: "crisis-response cadence readiness score",
    institutionalRhythmMaturityScore: "institutional rhythm maturity score",
    processOptimizationProfile: "process optimization profile",
    operationalQaProcessDriftProfile: "operational QA/process drift profile",
    operationalPlaybookProfile: "operational playbook profile",
    institutionalKnowledgeTransferProfile: "institutional knowledge transfer profile",
    familyOfficeGovernanceProfile: "family office governance profile",
    enterpriseRiskProfile: "enterprise risk profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: EnterpriseOperatingRhythmInput): EnterpriseOperatingRhythmScoreBreakdown {
  const optimizationProfile = input.processOptimizationProfile;
  const qaProfile = input.operationalQaProcessDriftProfile;
  const playbookProfile = input.operationalPlaybookProfile;
  const knowledgeProfile = input.institutionalKnowledgeTransferProfile;
  const governanceProfile = input.familyOfficeGovernanceProfile;
  const riskProfile = input.enterpriseRiskProfile;
  const weeklyRhythmScore = getScore(
    input.weeklyRhythmScore,
    weightedAverage([
      [extractProfileScore(qaProfile, ["sopAdherenceScore", "scoreBreakdown.sopAdherenceScore"], 54), 0.22],
      [extractProfileScore(qaProfile, ["workflowConsistencyScore", "scoreBreakdown.workflowConsistencyScore"], 54), 0.22],
      [extractProfileScore(optimizationProfile, ["workflowEfficiencyScore", "scoreBreakdown.workflowEfficiencyScore"], 54), 0.2],
      [extractProfileScore(optimizationProfile, ["continuousImprovementReadinessScore"], 54), 0.14],
      [extractProfileScore(playbookProfile, ["roleClarityScore"], 54), 0.12],
      [100 - extractProfileScore(qaProfile, ["operationalEntropyRiskScore"], 48), 0.1],
    ]),
  );
  const monthlyCadenceScore = getScore(
    input.monthlyCadenceScore,
    weightedAverage([
      [weeklyRhythmScore, 0.16],
      [extractProfileScore(optimizationProfile, ["continuousImprovementReadinessScore", "scoreBreakdown.continuousImprovementReadinessScore"], 54), 0.22],
      [extractProfileScore(optimizationProfile, ["documentationEfficiencyScore"], 54), 0.16],
      [extractProfileScore(playbookProfile, ["updateDisciplineScore", "scoreBreakdown.updateDisciplineScore"], 54), 0.2],
      [extractProfileScore(knowledgeProfile, ["decisionHistoryPreservationScore"], 54), 0.14],
      [extractProfileScore(qaProfile, ["documentationConsistencyScore"], 54), 0.12],
    ]),
  );
  const quarterlyGovernanceScore = getScore(
    input.quarterlyGovernanceScore,
    weightedAverage([
      [extractProfileScore(qaProfile, ["governanceConsistencyScore", "scoreBreakdown.governanceConsistencyScore"], 54), 0.24],
      [extractProfileScore(optimizationProfile, ["governanceEfficiencyScore", "scoreBreakdown.governanceEfficiencyScore"], 54), 0.18],
      [extractProfileScore(governanceProfile, ["operatingDiscipline", "scoreBreakdown.operatingDisciplineScore"], 54), 0.18],
      [extractProfileScore(governanceProfile, ["humanReviewGovernanceAlignment"], 54), 0.16],
      [monthlyCadenceScore, 0.12],
      [extractProfileScore(playbookProfile, ["governanceReviewPlaybookScore"], 54), 0.12],
    ]),
  );
  const portfolioReviewCadenceScore = getScore(
    input.portfolioReviewCadenceScore,
    weightedAverage([
      [extractProfileScore(qaProfile, ["portfolioReviewConsistencyScore", "scoreBreakdown.portfolioReviewConsistencyScore"], 54), 0.24],
      [extractProfileScore(optimizationProfile, ["portfolioEfficiencyScore", "scoreBreakdown.portfolioEfficiencyScore"], 54), 0.2],
      [extractProfileScore(playbookProfile, ["portfolioReviewPlaybookScore", "scoreBreakdown.portfolioReviewPlaybookScore"], 54), 0.18],
      [extractProfileScore(governanceProfile, ["riskOversightDiscipline"], 54), 0.14],
      [quarterlyGovernanceScore, 0.12],
      [monthlyCadenceScore, 0.12],
    ]),
  );
  const followUpRhythmScore = getScore(
    input.followUpRhythmScore,
    weightedAverage([
      [extractProfileScore(qaProfile, ["followUpConsistencyScore", "scoreBreakdown.followUpConsistencyScore"], 54), 0.26],
      [extractProfileScore(optimizationProfile, ["followUpEfficiencyScore", "scoreBreakdown.followUpEfficiencyScore"], 54), 0.22],
      [extractProfileScore(qaProfile, ["communicationConsistencyScore"], 54), 0.16],
      [extractProfileScore(playbookProfile, ["followUpPlaybookScore"], 54), 0.14],
      [weeklyRhythmScore, 0.12],
      [extractProfileScore(knowledgeProfile, ["relationshipKnowledgeTransferScore"], 54), 0.1],
    ]),
  );
  const decisionReviewTimingScore = getScore(
    input.decisionReviewTimingScore,
    weightedAverage([
      [extractProfileScore(knowledgeProfile, ["decisionHistoryPreservationScore", "scoreBreakdown.decisionHistoryPreservationScore"], 54), 0.22],
      [extractProfileScore(governanceProfile, ["decisionAccountability", "scoreBreakdown.decisionAccountabilityScore"], 54), 0.2],
      [extractProfileScore(governanceProfile, ["governanceDocumentationReadiness"], 54), 0.14],
      [monthlyCadenceScore, 0.14],
      [quarterlyGovernanceScore, 0.14],
      [extractProfileScore(optimizationProfile, ["documentationEfficiencyScore"], 54), 0.08],
      [extractProfileScore(playbookProfile, ["updateDisciplineScore"], 54), 0.08],
    ]),
  );
  const operationalTempoScore = getScore(
    input.operationalTempoScore,
    weightedAverage([
      [extractProfileScore(optimizationProfile, ["workflowEfficiencyScore"], 54), 0.18],
      [extractProfileScore(qaProfile, ["overallOperationalConsistencyScore", "scoreBreakdown.overallOperationalConsistencyScore"], 54), 0.18],
      [weeklyRhythmScore, 0.16],
      [100 - extractProfileScore(optimizationProfile, ["frictionRiskScore"], 48), 0.14],
      [100 - extractProfileScore(optimizationProfile, ["pipelineBottleneckScore"], 48), 0.12],
      [100 - extractProfileScore(qaProfile, ["operationalEntropyRiskScore"], 48), 0.12],
      [followUpRhythmScore, 0.1],
    ]),
  );
  const strategicSynchronizationScore = getScore(
    input.strategicSynchronizationScore,
    weightedAverage([
      [quarterlyGovernanceScore, 0.18],
      [portfolioReviewCadenceScore, 0.16],
      [decisionReviewTimingScore, 0.16],
      [extractProfileScore(governanceProfile, ["humanReviewGovernanceAlignment"], 54), 0.16],
      [extractProfileScore(governanceProfile, ["multiEntityCoordinationReadiness"], 54), 0.12],
      [extractProfileScore(optimizationProfile, ["governanceEfficiencyScore"], 54), 0.12],
      [monthlyCadenceScore, 0.1],
    ]),
  );
  const crisisCadenceReadinessScore = getScore(
    input.crisisCadenceReadinessScore,
    weightedAverage([
      [extractProfileScore(qaProfile, ["emergencyContinuityConsistencyScore", "scoreBreakdown.emergencyContinuityConsistencyScore"], 54), 0.24],
      [extractProfileScore(playbookProfile, ["emergencyContinuityPlaybookScore", "scoreBreakdown.emergencyContinuityPlaybookScore"], 54), 0.18],
      [extractProfileScore(riskProfile, ["operationalContinuityResilience", "scoreBreakdown.operationalContinuityResilienceScore"], 54), 0.18],
      [extractProfileScore(riskProfile, ["defensiveOperationalResilience"], 54), 0.14],
      [operationalTempoScore, 0.1],
      [weeklyRhythmScore, 0.08],
      [decisionReviewTimingScore, 0.08],
    ]),
  );
  const institutionalRhythmMaturityScore = getScore(
    input.institutionalRhythmMaturityScore,
    weightedAverage([
      [extractProfileScore(optimizationProfile, ["overallOptimizationScore", "scoreBreakdown.overallOptimizationScore"], 54), 0.16],
      [extractProfileScore(playbookProfile, ["overallPlaybookReadinessScore", "scoreBreakdown.overallPlaybookReadinessScore"], 54), 0.14],
      [weeklyRhythmScore, 0.12],
      [monthlyCadenceScore, 0.12],
      [quarterlyGovernanceScore, 0.12],
      [strategicSynchronizationScore, 0.12],
      [crisisCadenceReadinessScore, 0.1],
      [extractProfileScore(optimizationProfile, ["continuousImprovementReadinessScore"], 54), 0.08],
      [extractProfileScore(qaProfile, ["overallOperationalConsistencyScore"], 54), 0.04],
    ]),
  );
  const overallRhythmScore = weightedAverage([
    [weeklyRhythmScore, 0.11],
    [monthlyCadenceScore, 0.1],
    [quarterlyGovernanceScore, 0.11],
    [portfolioReviewCadenceScore, 0.09],
    [followUpRhythmScore, 0.09],
    [decisionReviewTimingScore, 0.1],
    [operationalTempoScore, 0.11],
    [strategicSynchronizationScore, 0.11],
    [crisisCadenceReadinessScore, 0.09],
    [institutionalRhythmMaturityScore, 0.09],
  ]);

  return {
    connectivityScore: followUpRhythmScore,
    durabilityScore: overallRhythmScore,
    expansionScore: operationalTempoScore,
    institutionalScore: institutionalRhythmMaturityScore,
    logisticsScore: weeklyRhythmScore,
    luxuryScore: portfolioReviewCadenceScore,
    developmentScore: crisisCadenceReadinessScore,
    overallRhythmScore,
    weeklyRhythmScore,
    monthlyCadenceScore,
    quarterlyGovernanceScore,
    portfolioReviewCadenceScore,
    followUpRhythmScore,
    decisionReviewTimingScore,
    operationalTempoScore,
    strategicSynchronizationScore,
    crisisCadenceReadinessScore,
    institutionalRhythmMaturityScore,
  };
}

function classifyOperatingRhythm(score: number): OperatingRhythmLevel {
  if (score >= 82) return "institutional";
  if (score >= 68) return "disciplined";
  if (score >= 54) return "developing";
  if (score >= 40) return "inconsistent";

  return "unstable";
}

function buildWarnings(scoreBreakdown: EnterpriseOperatingRhythmScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "OPERATING_RHYTHM_DATA_INCOMPLETE",
            severity: missingData.length >= 5 ? "high" : "medium",
            message: "Enterprise operating rhythm assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.overallRhythmScore < 42
      ? [
          createCorridorWarning({
            code: "OPERATING_RHYTHM_UNSTABLE",
            severity: "high",
            message: "Overall enterprise operating rhythm is unstable under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.weeklyRhythmScore < 45
      ? [
          createCorridorWarning({
            code: "WEEKLY_RHYTHM_WEAK",
            severity: "medium",
            message: "Weekly operating rhythm discipline is weak and requires manual review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.quarterlyGovernanceScore < 45
      ? [
          createCorridorWarning({
            code: "QUARTERLY_GOVERNANCE_CADENCE_WEAK",
            severity: "medium",
            message: "Quarterly governance review cadence is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.crisisCadenceReadinessScore < 45
      ? [
          createCorridorWarning({
            code: "CRISIS_CADENCE_READINESS_WEAK",
            severity: "medium",
            message: "Crisis-response cadence readiness is weak; no autonomous management action is performed.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
  ];
}

function buildCadenceWarnings(scoreBreakdown: EnterpriseOperatingRhythmScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.weeklyRhythmScore < 55 ? ["Weekly operating rhythm may be too inconsistent for stable execution tempo."] : []),
    ...(scoreBreakdown.monthlyCadenceScore < 55 ? ["Monthly review cadence may be too inconsistent for continuous improvement discipline."] : []),
    ...(scoreBreakdown.quarterlyGovernanceScore < 55 ? ["Quarterly governance cadence may be too weak for institutional review rhythm."] : []),
    ...(scoreBreakdown.portfolioReviewCadenceScore < 55 ? ["Portfolio review timing may be too inconsistent for durable oversight."] : []),
    ...(scoreBreakdown.followUpRhythmScore < 55 ? ["Follow-up rhythm may be inconsistent; no outreach automation is triggered."] : []),
    ...(scoreBreakdown.decisionReviewTimingScore < 55 ? ["Decision review timing may be too irregular for explainable operating discipline."] : []),
    ...(scoreBreakdown.operationalTempoScore < 55 ? ["Operational tempo may be unstable under current structured inputs."] : []),
    ...(scoreBreakdown.strategicSynchronizationScore < 55 ? ["Strategic review synchronization may be weak across operating rhythms."] : []),
    ...(scoreBreakdown.crisisCadenceReadinessScore < 55 ? ["Crisis-response cadence readiness may be insufficient for continuity review."] : []),
    ...(scoreBreakdown.institutionalRhythmMaturityScore < 55 ? ["Institutional rhythm maturity may be underdeveloped."] : []),
    ...(missingData.length > 0 ? ["Cadence warnings require human validation because required structured inputs are incomplete."] : []),
  ]);
}

function buildKeyRisks(scoreBreakdown: EnterpriseOperatingRhythmScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.overallRhythmScore < 50 ? ["Overall enterprise operating rhythm is weak."] : []),
    ...(scoreBreakdown.weeklyRhythmScore < 50 ? ["Weekly operating rhythm discipline is weak."] : []),
    ...(scoreBreakdown.monthlyCadenceScore < 50 ? ["Monthly review cadence is weak."] : []),
    ...(scoreBreakdown.quarterlyGovernanceScore < 50 ? ["Quarterly governance review cadence is weak."] : []),
    ...(scoreBreakdown.portfolioReviewCadenceScore < 50 ? ["Portfolio review timing consistency is weak."] : []),
    ...(scoreBreakdown.followUpRhythmScore < 50 ? ["Follow-up rhythm consistency is weak."] : []),
    ...(scoreBreakdown.decisionReviewTimingScore < 50 ? ["Decision review timing discipline is weak."] : []),
    ...(scoreBreakdown.operationalTempoScore < 50 ? ["Operational tempo stability is weak."] : []),
    ...(scoreBreakdown.strategicSynchronizationScore < 50 ? ["Strategic review synchronization is weak."] : []),
    ...(scoreBreakdown.crisisCadenceReadinessScore < 50 ? ["Crisis-response cadence readiness is weak."] : []),
    ...(scoreBreakdown.institutionalRhythmMaturityScore < 50 ? ["Institutional rhythm maturity is weak."] : []),
    ...(missingData.length > 0 ? `Missing data reduces confidence: ${missingData.slice(0, 4).join(", ")}.` : []),
  ]);
}

function buildStrengths(scoreBreakdown: EnterpriseOperatingRhythmScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.overallRhythmScore >= 70 ? ["Overall enterprise operating rhythm is strong."] : []),
    ...(scoreBreakdown.weeklyRhythmScore >= 70 ? ["Weekly operating rhythm discipline is strong."] : []),
    ...(scoreBreakdown.monthlyCadenceScore >= 70 ? ["Monthly review cadence is strong."] : []),
    ...(scoreBreakdown.quarterlyGovernanceScore >= 70 ? ["Quarterly governance review cadence is strong."] : []),
    ...(scoreBreakdown.portfolioReviewCadenceScore >= 70 ? ["Portfolio review timing consistency is strong."] : []),
    ...(scoreBreakdown.followUpRhythmScore >= 70 ? ["Follow-up rhythm consistency is strong."] : []),
    ...(scoreBreakdown.decisionReviewTimingScore >= 70 ? ["Decision review timing discipline is strong."] : []),
    ...(scoreBreakdown.operationalTempoScore >= 70 ? ["Operational tempo stability is strong."] : []),
    ...(scoreBreakdown.strategicSynchronizationScore >= 70 ? ["Strategic review synchronization is strong."] : []),
    ...(scoreBreakdown.crisisCadenceReadinessScore >= 70 ? ["Crisis-response cadence readiness is strong."] : []),
    ...(scoreBreakdown.institutionalRhythmMaturityScore >= 70 ? ["Institutional rhythm maturity is strong."] : []),
  ]);
}

function buildRecommendations(scoreBreakdown: EnterpriseOperatingRhythmScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.weeklyRhythmScore < 58 ? ["Review weekly operating rhythm gaps and clarify manual review checkpoints."] : []),
    ...(scoreBreakdown.monthlyCadenceScore < 58 ? ["Review monthly review cadence and document human-reviewed improvement notes."] : []),
    ...(scoreBreakdown.quarterlyGovernanceScore < 58 ? ["Review quarterly governance cadence; this is not HR, legal, ownership, or tax advice."] : []),
    ...(scoreBreakdown.portfolioReviewCadenceScore < 58
      ? ["Review portfolio review timing without making investment, allocation, lending, or portfolio-management recommendations."]
      : []),
    ...(scoreBreakdown.followUpRhythmScore < 58 ? ["Review follow-up rhythm consistency without triggering outreach, SMS, email, or CRM automation."] : []),
    ...(scoreBreakdown.decisionReviewTimingScore < 58 ? ["Review decision timing discipline and strengthen manual decision-record cadence."] : []),
    ...(scoreBreakdown.operationalTempoScore < 58 ? ["Review operational tempo stability and identify recurring cadence disruptions."] : []),
    ...(scoreBreakdown.strategicSynchronizationScore < 58 ? ["Review strategic synchronization across weekly, monthly, quarterly, and portfolio review rhythms."] : []),
    ...(scoreBreakdown.crisisCadenceReadinessScore < 58 ? ["Review crisis-response cadence readiness and prepare human-reviewed continuity checkpoints."] : []),
    ...(scoreBreakdown.institutionalRhythmMaturityScore < 58 ? ["Review institutional rhythm maturity and document cadence discipline gaps."] : []),
    "Keep cadence improvements human-reviewed; this module does not provide HR, legal, ownership, tax, lending, investment, portfolio-management, autonomous management, or market-prediction advice.",
  ]);
}

function buildExplanation(params: { scoreBreakdown: EnterpriseOperatingRhythmScoreBreakdown; operatingRhythmLevel: OperatingRhythmLevel }) {
  const scoreBreakdown = params.scoreBreakdown;

  return [
    `Operating rhythm level is ${params.operatingRhythmLevel} with an overall rhythm score of ${scoreBreakdown.overallRhythmScore}/100.`,
    `Weekly rhythm is ${scoreBreakdown.weeklyRhythmScore}/100, monthly cadence is ${scoreBreakdown.monthlyCadenceScore}/100, and quarterly governance cadence is ${scoreBreakdown.quarterlyGovernanceScore}/100.`,
    "Weekly rhythm, monthly cadence, quarterly governance, portfolio review cadence, follow-up rhythm, decision review timing, operational tempo, strategic synchronization, crisis cadence readiness, and institutional rhythm maturity were scored deterministically from structured inputs and optional read-only profile fallbacks.",
    "This output identifies cadence/rhythm discipline risks only and does not provide HR, legal, ownership, tax, lending, investment, portfolio-management, autonomous management, or market-prediction advice.",
  ];
}

function buildTrace(scoreBreakdown: EnterpriseOperatingRhythmScoreBreakdown, missingData: string[]) {
  return [
    "Normalized all numeric scores to a deterministic 0-100 scale.",
    "Derived optional fallback scores only from supplied in-memory intelligence profiles.",
    `Computed enterprise operating rhythm from weekly rhythm (${scoreBreakdown.weeklyRhythmScore}), monthly cadence (${scoreBreakdown.monthlyCadenceScore}), quarterly governance (${scoreBreakdown.quarterlyGovernanceScore}), portfolio review cadence (${scoreBreakdown.portfolioReviewCadenceScore}), follow-up rhythm (${scoreBreakdown.followUpRhythmScore}), decision review timing (${scoreBreakdown.decisionReviewTimingScore}), operational tempo (${scoreBreakdown.operationalTempoScore}), strategic synchronization (${scoreBreakdown.strategicSynchronizationScore}), crisis cadence readiness (${scoreBreakdown.crisisCadenceReadinessScore}), and institutional rhythm maturity (${scoreBreakdown.institutionalRhythmMaturityScore}).`,
    missingData.length > 0 ? `Missing inputs flagged for human verification: ${missingData.join(", ")}.` : "No required structured inputs were missing.",
    "No outreach, SMS, email, Twilio, database writes, schema changes, workflow mutation, protected-class logic, demographic targeting, external APIs, scraping, autonomous execution, or autonomous management decisions were used.",
  ];
}

function buildAssumptions(input: EnterpriseOperatingRhythmInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0 ? ["Missing enterprise operating rhythm inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."] : []),
    "Enterprise operating rhythm intelligence is deterministic, explainable, read-only, compliance-first, and designed for human review before any execution.",
    "This engine evaluates cadence discipline across weekly, monthly, quarterly, portfolio review, follow-up, decision review, operational tempo, strategic synchronization, crisis response, and institutional rhythm maturity only.",
    "No outreach, SMS, email sending, Twilio, autonomous execution, autonomous management decisions, DB writes, schema changes, workflow mutations, external APIs, scraping, demographic data, or protected-class data were used.",
    "This is not HR advice, legal advice, ownership advice, tax advice, lending advice, investment advice, portfolio-management advice, autonomous management, or market prediction.",
  ]);
}

export function analyzeEnterpriseOperatingRhythmIntelligence(input: EnterpriseOperatingRhythmInput = {}): EnterpriseOperatingRhythmResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const operatingRhythmLevel = classifyOperatingRhythm(scoreBreakdown.overallRhythmScore);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallRhythmScore: scoreBreakdown.overallRhythmScore,
    operatingRhythmLevel,
    weeklyRhythmScore: scoreBreakdown.weeklyRhythmScore,
    monthlyCadenceScore: scoreBreakdown.monthlyCadenceScore,
    quarterlyGovernanceScore: scoreBreakdown.quarterlyGovernanceScore,
    portfolioReviewCadenceScore: scoreBreakdown.portfolioReviewCadenceScore,
    followUpRhythmScore: scoreBreakdown.followUpRhythmScore,
    decisionReviewTimingScore: scoreBreakdown.decisionReviewTimingScore,
    operationalTempoScore: scoreBreakdown.operationalTempoScore,
    strategicSynchronizationScore: scoreBreakdown.strategicSynchronizationScore,
    crisisCadenceReadinessScore: scoreBreakdown.crisisCadenceReadinessScore,
    institutionalRhythmMaturityScore: scoreBreakdown.institutionalRhythmMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown, missingData),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    cadenceWarnings: buildCadenceWarnings(scoreBreakdown, missingData),
    explanation: buildExplanation({ scoreBreakdown, operatingRhythmLevel }),
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

export const getEnterpriseOperatingRhythmIntelligence = analyzeEnterpriseOperatingRhythmIntelligence;
