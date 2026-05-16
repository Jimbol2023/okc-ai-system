import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type AccountabilityLevel = "unclear" | "fragile" | "developing" | "disciplined" | "institutional";

export type EnterpriseAccountabilityInput = {
  roleOwnershipScore?: number;
  taskResponsibilityScore?: number;
  followThroughScore?: number;
  escalationClarityScore?: number;
  reviewAccountabilityScore?: number;
  governanceAccountabilityScore?: number;
  portfolioAccountabilityScore?: number;
  dealExecutionAccountabilityScore?: number;
  continuityAccountabilityScore?: number;
  accountabilityMaturityScore?: number;
  enterpriseOperatingRhythmProfile?: unknown;
  processOptimizationProfile?: unknown;
  operationalQaProcessDriftProfile?: unknown;
  operationalPlaybookProfile?: unknown;
  founderDependencyProfile?: unknown;
  enterpriseExpansionGovernanceProfile?: unknown;
  familyOfficeGovernanceProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseAccountabilityScoreBreakdown = CorridorScoreBreakdown & {
  overallAccountabilityScore: number;
  roleOwnershipScore: number;
  taskResponsibilityScore: number;
  followThroughScore: number;
  escalationClarityScore: number;
  reviewAccountabilityScore: number;
  governanceAccountabilityScore: number;
  portfolioAccountabilityScore: number;
  dealExecutionAccountabilityScore: number;
  continuityAccountabilityScore: number;
  accountabilityMaturityScore: number;
};

export type EnterpriseAccountabilityResult = {
  overallAccountabilityScore: number;
  accountabilityLevel: AccountabilityLevel;
  roleOwnershipScore: number;
  taskResponsibilityScore: number;
  followThroughScore: number;
  escalationClarityScore: number;
  reviewAccountabilityScore: number;
  governanceAccountabilityScore: number;
  portfolioAccountabilityScore: number;
  dealExecutionAccountabilityScore: number;
  continuityAccountabilityScore: number;
  accountabilityMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseAccountabilityScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  accountabilityWarnings: string[];
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

const REQUIRED_INPUTS: Array<keyof EnterpriseAccountabilityInput> = [
  "roleOwnershipScore",
  "taskResponsibilityScore",
  "followThroughScore",
  "escalationClarityScore",
  "reviewAccountabilityScore",
  "governanceAccountabilityScore",
  "portfolioAccountabilityScore",
  "dealExecutionAccountabilityScore",
  "continuityAccountabilityScore",
  "accountabilityMaturityScore",
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

function hasFallbackForInput(input: EnterpriseAccountabilityInput, key: keyof EnterpriseAccountabilityInput) {
  const rhythmProfile = input.enterpriseOperatingRhythmProfile;
  const optimizationProfile = input.processOptimizationProfile;
  const qaProfile = input.operationalQaProcessDriftProfile;
  const playbookProfile = input.operationalPlaybookProfile;
  const keyPersonProfile = input.founderDependencyProfile;
  const expansionGovernanceProfile = input.enterpriseExpansionGovernanceProfile;
  const familyGovernanceProfile = input.familyOfficeGovernanceProfile;

  const fallbackPaths: Partial<Record<keyof EnterpriseAccountabilityInput, boolean>> = {
    roleOwnershipScore:
      hasProfileScore(playbookProfile, ["roleClarityScore", "scoreBreakdown.roleClarityScore"]) ||
      hasProfileScore(keyPersonProfile, ["delegationReadinessScore", "backupLeadershipReadinessScore"]),
    taskResponsibilityScore:
      hasProfileScore(playbookProfile, ["roleClarityScore", "updateDisciplineScore"]) ||
      hasProfileScore(qaProfile, ["sopAdherenceScore", "workflowConsistencyScore"]),
    followThroughScore:
      hasProfileScore(rhythmProfile, ["followUpRhythmScore", "operationalTempoScore"]) ||
      hasProfileScore(qaProfile, ["followUpConsistencyScore", "dealProcessingConsistencyScore"]),
    escalationClarityScore:
      hasProfileScore(keyPersonProfile, ["backupLeadershipReadinessScore", "continuityReadinessScore"]) ||
      hasProfileScore(playbookProfile, ["emergencyContinuityPlaybookScore", "roleClarityScore"]),
    reviewAccountabilityScore:
      hasProfileScore(rhythmProfile, ["monthlyCadenceScore", "decisionReviewTimingScore"]) ||
      hasProfileScore(optimizationProfile, ["continuousImprovementReadinessScore"]),
    governanceAccountabilityScore:
      hasProfileScore(expansionGovernanceProfile, ["strategicAccountabilityDiscipline", "humanReviewGovernanceAlignment"]) ||
      hasProfileScore(familyGovernanceProfile, ["decisionAccountability", "humanReviewGovernanceAlignment"]),
    portfolioAccountabilityScore:
      hasProfileScore(rhythmProfile, ["portfolioReviewCadenceScore"]) ||
      hasProfileScore(qaProfile, ["portfolioReviewConsistencyScore"]),
    dealExecutionAccountabilityScore:
      hasProfileScore(qaProfile, ["dealProcessingConsistencyScore", "workflowConsistencyScore"]) ||
      hasProfileScore(playbookProfile, ["closingPlaybookScore", "dispositionPlaybookScore"]),
    continuityAccountabilityScore:
      hasProfileScore(keyPersonProfile, ["continuityReadinessScore", "backupLeadershipReadinessScore"]) ||
      hasProfileScore(rhythmProfile, ["crisisCadenceReadinessScore"]),
    accountabilityMaturityScore:
      hasProfileScore(rhythmProfile, ["institutionalRhythmMaturityScore", "overallRhythmScore"]) ||
      hasProfileScore(expansionGovernanceProfile, ["strategicAccountabilityDiscipline", "enterpriseGovernanceQuality"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: EnterpriseAccountabilityInput) {
  const labels: Record<keyof EnterpriseAccountabilityInput, string> = {
    roleOwnershipScore: "role ownership clarity score",
    taskResponsibilityScore: "task responsibility clarity score",
    followThroughScore: "follow-through discipline score",
    escalationClarityScore: "escalation path clarity score",
    reviewAccountabilityScore: "review accountability score",
    governanceAccountabilityScore: "governance accountability score",
    portfolioAccountabilityScore: "portfolio accountability score",
    dealExecutionAccountabilityScore: "deal execution accountability score",
    continuityAccountabilityScore: "continuity accountability score",
    accountabilityMaturityScore: "accountability maturity score",
    enterpriseOperatingRhythmProfile: "enterprise operating rhythm profile",
    processOptimizationProfile: "process optimization profile",
    operationalQaProcessDriftProfile: "operational QA/process drift profile",
    operationalPlaybookProfile: "operational playbook profile",
    founderDependencyProfile: "founder dependency/key-person risk profile",
    enterpriseExpansionGovernanceProfile: "enterprise expansion governance profile",
    familyOfficeGovernanceProfile: "family office governance profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: EnterpriseAccountabilityInput): EnterpriseAccountabilityScoreBreakdown {
  const rhythmProfile = input.enterpriseOperatingRhythmProfile;
  const optimizationProfile = input.processOptimizationProfile;
  const qaProfile = input.operationalQaProcessDriftProfile;
  const playbookProfile = input.operationalPlaybookProfile;
  const keyPersonProfile = input.founderDependencyProfile;
  const expansionGovernanceProfile = input.enterpriseExpansionGovernanceProfile;
  const familyGovernanceProfile = input.familyOfficeGovernanceProfile;
  const roleOwnershipScore = getScore(
    input.roleOwnershipScore,
    weightedAverage([
      [extractProfileScore(playbookProfile, ["roleClarityScore", "scoreBreakdown.roleClarityScore"], 54), 0.28],
      [extractProfileScore(keyPersonProfile, ["delegationReadinessScore", "scoreBreakdown.delegationReadinessScore"], 54), 0.2],
      [extractProfileScore(keyPersonProfile, ["backupLeadershipReadinessScore"], 54), 0.16],
      [extractProfileScore(familyGovernanceProfile, ["decisionAccountability", "scoreBreakdown.decisionAccountabilityScore"], 54), 0.14],
      [100 - extractProfileScore(keyPersonProfile, ["decisionConcentrationScore"], 48), 0.12],
      [extractProfileScore(rhythmProfile, ["weeklyRhythmScore"], 54), 0.1],
    ]),
  );
  const taskResponsibilityScore = getScore(
    input.taskResponsibilityScore,
    weightedAverage([
      [roleOwnershipScore, 0.22],
      [extractProfileScore(playbookProfile, ["updateDisciplineScore", "scoreBreakdown.updateDisciplineScore"], 54), 0.18],
      [extractProfileScore(qaProfile, ["sopAdherenceScore", "scoreBreakdown.sopAdherenceScore"], 54), 0.2],
      [extractProfileScore(qaProfile, ["workflowConsistencyScore"], 54), 0.16],
      [extractProfileScore(optimizationProfile, ["documentationEfficiencyScore"], 54), 0.12],
      [100 - extractProfileScore(keyPersonProfile, ["knowledgeConcentrationScore"], 48), 0.12],
    ]),
  );
  const escalationClarityScore = getScore(
    input.escalationClarityScore,
    weightedAverage([
      [roleOwnershipScore, 0.2],
      [taskResponsibilityScore, 0.14],
      [extractProfileScore(keyPersonProfile, ["backupLeadershipReadinessScore"], 54), 0.18],
      [extractProfileScore(keyPersonProfile, ["continuityReadinessScore"], 54), 0.16],
      [extractProfileScore(playbookProfile, ["emergencyContinuityPlaybookScore"], 54), 0.14],
      [extractProfileScore(rhythmProfile, ["crisisCadenceReadinessScore"], 54), 0.1],
      [100 - extractProfileScore(keyPersonProfile, ["accessControlConcentrationScore"], 48), 0.08],
    ]),
  );
  const followThroughScore = getScore(
    input.followThroughScore,
    weightedAverage([
      [extractProfileScore(rhythmProfile, ["followUpRhythmScore", "scoreBreakdown.followUpRhythmScore"], 54), 0.18],
      [extractProfileScore(rhythmProfile, ["operationalTempoScore"], 54), 0.16],
      [extractProfileScore(qaProfile, ["followUpConsistencyScore"], 54), 0.16],
      [extractProfileScore(qaProfile, ["dealProcessingConsistencyScore"], 54), 0.14],
      [taskResponsibilityScore, 0.14],
      [roleOwnershipScore, 0.1],
      [100 - extractProfileScore(optimizationProfile, ["frictionRiskScore"], 48), 0.12],
    ]),
  );
  const reviewAccountabilityScore = getScore(
    input.reviewAccountabilityScore,
    weightedAverage([
      [extractProfileScore(rhythmProfile, ["monthlyCadenceScore", "scoreBreakdown.monthlyCadenceScore"], 54), 0.2],
      [extractProfileScore(rhythmProfile, ["decisionReviewTimingScore"], 54), 0.18],
      [extractProfileScore(optimizationProfile, ["continuousImprovementReadinessScore"], 54), 0.16],
      [extractProfileScore(qaProfile, ["documentationConsistencyScore"], 54), 0.14],
      [followThroughScore, 0.12],
      [taskResponsibilityScore, 0.1],
      [extractProfileScore(playbookProfile, ["updateDisciplineScore"], 54), 0.1],
    ]),
  );
  const governanceAccountabilityScore = getScore(
    input.governanceAccountabilityScore,
    weightedAverage([
      [extractProfileScore(expansionGovernanceProfile, ["strategicAccountabilityDiscipline", "scoreBreakdown.strategicAccountabilityDisciplineScore"], 54), 0.22],
      [extractProfileScore(expansionGovernanceProfile, ["humanReviewGovernanceAlignment", "scoreBreakdown.humanReviewGovernanceAlignmentScore"], 54), 0.18],
      [extractProfileScore(familyGovernanceProfile, ["decisionAccountability", "scoreBreakdown.decisionAccountabilityScore"], 54), 0.16],
      [extractProfileScore(rhythmProfile, ["quarterlyGovernanceScore"], 54), 0.14],
      [reviewAccountabilityScore, 0.12],
      [escalationClarityScore, 0.1],
      [roleOwnershipScore, 0.08],
    ]),
  );
  const portfolioAccountabilityScore = getScore(
    input.portfolioAccountabilityScore,
    weightedAverage([
      [extractProfileScore(rhythmProfile, ["portfolioReviewCadenceScore", "scoreBreakdown.portfolioReviewCadenceScore"], 54), 0.22],
      [extractProfileScore(qaProfile, ["portfolioReviewConsistencyScore"], 54), 0.18],
      [extractProfileScore(optimizationProfile, ["portfolioEfficiencyScore"], 54), 0.16],
      [extractProfileScore(playbookProfile, ["portfolioReviewPlaybookScore"], 54), 0.14],
      [governanceAccountabilityScore, 0.12],
      [reviewAccountabilityScore, 0.1],
      [taskResponsibilityScore, 0.08],
    ]),
  );
  const dealExecutionAccountabilityScore = getScore(
    input.dealExecutionAccountabilityScore,
    weightedAverage([
      [extractProfileScore(qaProfile, ["dealProcessingConsistencyScore", "scoreBreakdown.dealProcessingConsistencyScore"], 54), 0.2],
      [extractProfileScore(qaProfile, ["workflowConsistencyScore"], 54), 0.16],
      [extractProfileScore(playbookProfile, ["closingPlaybookScore", "scoreBreakdown.closingPlaybookScore"], 54), 0.16],
      [extractProfileScore(playbookProfile, ["dispositionPlaybookScore"], 54), 0.12],
      [followThroughScore, 0.12],
      [taskResponsibilityScore, 0.1],
      [escalationClarityScore, 0.08],
      [100 - extractProfileScore(optimizationProfile, ["pipelineBottleneckScore"], 48), 0.06],
    ]),
  );
  const continuityAccountabilityScore = getScore(
    input.continuityAccountabilityScore,
    weightedAverage([
      [extractProfileScore(keyPersonProfile, ["continuityReadinessScore", "scoreBreakdown.continuityReadinessScore"], 54), 0.2],
      [extractProfileScore(keyPersonProfile, ["backupLeadershipReadinessScore"], 54), 0.16],
      [extractProfileScore(rhythmProfile, ["crisisCadenceReadinessScore"], 54), 0.16],
      [extractProfileScore(playbookProfile, ["emergencyContinuityPlaybookScore"], 54), 0.14],
      [escalationClarityScore, 0.12],
      [roleOwnershipScore, 0.1],
      [reviewAccountabilityScore, 0.06],
      [100 - extractProfileScore(keyPersonProfile, ["founderDependencyScore"], 48), 0.06],
    ]),
  );
  const accountabilityMaturityScore = getScore(
    input.accountabilityMaturityScore,
    weightedAverage([
      [extractProfileScore(rhythmProfile, ["institutionalRhythmMaturityScore", "scoreBreakdown.institutionalRhythmMaturityScore"], 54), 0.16],
      [extractProfileScore(rhythmProfile, ["overallRhythmScore"], 54), 0.1],
      [governanceAccountabilityScore, 0.12],
      [reviewAccountabilityScore, 0.12],
      [roleOwnershipScore, 0.1],
      [taskResponsibilityScore, 0.1],
      [followThroughScore, 0.1],
      [continuityAccountabilityScore, 0.08],
      [extractProfileScore(expansionGovernanceProfile, ["enterpriseGovernanceQuality", "scoreBreakdown.enterpriseGovernanceQualityScore"], 54), 0.06],
      [extractProfileScore(optimizationProfile, ["continuousImprovementReadinessScore"], 54), 0.06],
    ]),
  );
  const overallAccountabilityScore = weightedAverage([
    [roleOwnershipScore, 0.11],
    [taskResponsibilityScore, 0.11],
    [followThroughScore, 0.11],
    [escalationClarityScore, 0.1],
    [reviewAccountabilityScore, 0.11],
    [governanceAccountabilityScore, 0.11],
    [portfolioAccountabilityScore, 0.08],
    [dealExecutionAccountabilityScore, 0.1],
    [continuityAccountabilityScore, 0.09],
    [accountabilityMaturityScore, 0.08],
  ]);

  return {
    connectivityScore: escalationClarityScore,
    durabilityScore: overallAccountabilityScore,
    expansionScore: dealExecutionAccountabilityScore,
    institutionalScore: accountabilityMaturityScore,
    logisticsScore: taskResponsibilityScore,
    luxuryScore: portfolioAccountabilityScore,
    developmentScore: continuityAccountabilityScore,
    overallAccountabilityScore,
    roleOwnershipScore,
    taskResponsibilityScore,
    followThroughScore,
    escalationClarityScore,
    reviewAccountabilityScore,
    governanceAccountabilityScore,
    portfolioAccountabilityScore,
    dealExecutionAccountabilityScore,
    continuityAccountabilityScore,
    accountabilityMaturityScore,
  };
}

function classifyAccountability(score: number): AccountabilityLevel {
  if (score >= 82) return "institutional";
  if (score >= 68) return "disciplined";
  if (score >= 54) return "developing";
  if (score >= 40) return "fragile";

  return "unclear";
}

function buildWarnings(scoreBreakdown: EnterpriseAccountabilityScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "ENTERPRISE_ACCOUNTABILITY_DATA_INCOMPLETE",
            severity: missingData.length >= 5 ? "high" : "medium",
            message: "Enterprise accountability assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.overallAccountabilityScore < 42
      ? [
          createCorridorWarning({
            code: "ENTERPRISE_ACCOUNTABILITY_WEAK",
            severity: "high",
            message: "Overall enterprise accountability is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.roleOwnershipScore < 45
      ? [
          createCorridorWarning({
            code: "ROLE_OWNERSHIP_UNCLEAR",
            severity: "medium",
            message: "Role ownership clarity is weak and requires manual operational review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.escalationClarityScore < 45
      ? [
          createCorridorWarning({
            code: "ESCALATION_CLARITY_WEAK",
            severity: "medium",
            message: "Escalation path clarity is weak; no autonomous management decision is performed.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.governanceAccountabilityScore < 45
      ? [
          createCorridorWarning({
            code: "GOVERNANCE_ACCOUNTABILITY_WEAK",
            severity: "medium",
            message: "Governance accountability is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
  ];
}

function buildAccountabilityWarnings(scoreBreakdown: EnterpriseAccountabilityScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.roleOwnershipScore < 55 ? ["Role ownership may be too unclear for durable operating accountability."] : []),
    ...(scoreBreakdown.taskResponsibilityScore < 55 ? ["Task responsibility clarity may be too weak for reliable follow-through."] : []),
    ...(scoreBreakdown.followThroughScore < 55 ? ["Follow-through discipline may be inconsistent across operating workflows."] : []),
    ...(scoreBreakdown.escalationClarityScore < 55 ? ["Escalation paths may be unclear; no management action is taken by this engine."] : []),
    ...(scoreBreakdown.reviewAccountabilityScore < 55 ? ["Review accountability may be too weak for consistent governance and QA loops."] : []),
    ...(scoreBreakdown.governanceAccountabilityScore < 55 ? ["Governance accountability may need human review."] : []),
    ...(scoreBreakdown.portfolioAccountabilityScore < 55 ? ["Portfolio accountability may be underdeveloped; no investment or portfolio-management guidance is provided."] : []),
    ...(scoreBreakdown.dealExecutionAccountabilityScore < 55 ? ["Deal execution accountability may be weak across handoffs and closing workflows."] : []),
    ...(scoreBreakdown.continuityAccountabilityScore < 55 ? ["Continuity accountability may be insufficient for emergency or succession handoffs."] : []),
    ...(scoreBreakdown.accountabilityMaturityScore < 55 ? ["Accountability maturity may be underdeveloped at the institutional layer."] : []),
    ...(missingData.length > 0 ? ["Accountability warnings require human validation because required structured inputs are incomplete."] : []),
  ]);
}

function buildKeyRisks(scoreBreakdown: EnterpriseAccountabilityScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.overallAccountabilityScore < 50 ? ["Overall enterprise accountability is weak."] : []),
    ...(scoreBreakdown.roleOwnershipScore < 50 ? ["Role ownership clarity is weak."] : []),
    ...(scoreBreakdown.taskResponsibilityScore < 50 ? ["Task responsibility clarity is weak."] : []),
    ...(scoreBreakdown.followThroughScore < 50 ? ["Follow-through discipline is weak."] : []),
    ...(scoreBreakdown.escalationClarityScore < 50 ? ["Escalation path clarity is weak."] : []),
    ...(scoreBreakdown.reviewAccountabilityScore < 50 ? ["Review accountability is weak."] : []),
    ...(scoreBreakdown.governanceAccountabilityScore < 50 ? ["Governance accountability is weak."] : []),
    ...(scoreBreakdown.portfolioAccountabilityScore < 50 ? ["Portfolio accountability is weak."] : []),
    ...(scoreBreakdown.dealExecutionAccountabilityScore < 50 ? ["Deal execution accountability is weak."] : []),
    ...(scoreBreakdown.continuityAccountabilityScore < 50 ? ["Continuity accountability is weak."] : []),
    ...(scoreBreakdown.accountabilityMaturityScore < 50 ? ["Accountability maturity is weak."] : []),
    ...(missingData.length > 0 ? `Missing data reduces confidence: ${missingData.slice(0, 4).join(", ")}.` : []),
  ]);
}

function buildStrengths(scoreBreakdown: EnterpriseAccountabilityScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.overallAccountabilityScore >= 70 ? ["Overall enterprise accountability is strong."] : []),
    ...(scoreBreakdown.roleOwnershipScore >= 70 ? ["Role ownership clarity is strong."] : []),
    ...(scoreBreakdown.taskResponsibilityScore >= 70 ? ["Task responsibility clarity is strong."] : []),
    ...(scoreBreakdown.followThroughScore >= 70 ? ["Follow-through discipline is strong."] : []),
    ...(scoreBreakdown.escalationClarityScore >= 70 ? ["Escalation path clarity is strong."] : []),
    ...(scoreBreakdown.reviewAccountabilityScore >= 70 ? ["Review accountability is strong."] : []),
    ...(scoreBreakdown.governanceAccountabilityScore >= 70 ? ["Governance accountability is strong."] : []),
    ...(scoreBreakdown.portfolioAccountabilityScore >= 70 ? ["Portfolio accountability is strong."] : []),
    ...(scoreBreakdown.dealExecutionAccountabilityScore >= 70 ? ["Deal execution accountability is strong."] : []),
    ...(scoreBreakdown.continuityAccountabilityScore >= 70 ? ["Continuity accountability is strong."] : []),
    ...(scoreBreakdown.accountabilityMaturityScore >= 70 ? ["Accountability maturity is strong."] : []),
  ]);
}

function buildRecommendations(scoreBreakdown: EnterpriseAccountabilityScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.roleOwnershipScore < 58 ? ["Review role ownership gaps and clarify accountable owners in internal operating notes."] : []),
    ...(scoreBreakdown.taskResponsibilityScore < 58 ? ["Review task responsibility gaps and document human-reviewed responsibility checkpoints."] : []),
    ...(scoreBreakdown.followThroughScore < 58 ? ["Review follow-through gaps without triggering outreach, SMS, email, or CRM automation."] : []),
    ...(scoreBreakdown.escalationClarityScore < 58 ? ["Review escalation path clarity and document manual escalation checkpoints."] : []),
    ...(scoreBreakdown.reviewAccountabilityScore < 58 ? ["Review accountability for recurring QA, cadence, and decision-review loops."] : []),
    ...(scoreBreakdown.governanceAccountabilityScore < 58 ? ["Review governance accountability; this is not HR, legal, ownership, or tax advice."] : []),
    ...(scoreBreakdown.portfolioAccountabilityScore < 58
      ? ["Review portfolio accountability without making investment, allocation, lending, or portfolio-management recommendations."]
      : []),
    ...(scoreBreakdown.dealExecutionAccountabilityScore < 58 ? ["Review deal execution accountability across lead handling, handoffs, and closing checkpoints."] : []),
    ...(scoreBreakdown.continuityAccountabilityScore < 58 ? ["Review continuity accountability and prepare human-reviewed emergency handoff checkpoints."] : []),
    ...(scoreBreakdown.accountabilityMaturityScore < 58 ? ["Review accountability maturity and identify institutional accountability gaps."] : []),
    "Keep accountability improvements human-reviewed; this module does not provide HR, legal, ownership, tax, lending, investment, portfolio-management, autonomous management, or market-prediction advice.",
  ]);
}

function buildExplanation(params: { scoreBreakdown: EnterpriseAccountabilityScoreBreakdown; accountabilityLevel: AccountabilityLevel }) {
  const scoreBreakdown = params.scoreBreakdown;

  return [
    `Accountability level is ${params.accountabilityLevel} with an overall accountability score of ${scoreBreakdown.overallAccountabilityScore}/100.`,
    `Role ownership is ${scoreBreakdown.roleOwnershipScore}/100, task responsibility is ${scoreBreakdown.taskResponsibilityScore}/100, and follow-through discipline is ${scoreBreakdown.followThroughScore}/100.`,
    "Role ownership, task responsibility, follow-through, escalation clarity, review accountability, governance accountability, portfolio accountability, deal execution accountability, continuity accountability, and accountability maturity were scored deterministically from structured inputs and optional read-only profile fallbacks.",
    "This output identifies accountability gaps only and does not provide HR, legal, ownership, tax, lending, investment, portfolio-management, autonomous management, or market-prediction advice.",
  ];
}

function buildTrace(scoreBreakdown: EnterpriseAccountabilityScoreBreakdown, missingData: string[]) {
  return [
    "Normalized all numeric scores to a deterministic 0-100 scale.",
    "Derived optional fallback scores only from supplied in-memory intelligence profiles.",
    `Computed enterprise accountability from role ownership (${scoreBreakdown.roleOwnershipScore}), task responsibility (${scoreBreakdown.taskResponsibilityScore}), follow-through (${scoreBreakdown.followThroughScore}), escalation clarity (${scoreBreakdown.escalationClarityScore}), review accountability (${scoreBreakdown.reviewAccountabilityScore}), governance accountability (${scoreBreakdown.governanceAccountabilityScore}), portfolio accountability (${scoreBreakdown.portfolioAccountabilityScore}), deal execution accountability (${scoreBreakdown.dealExecutionAccountabilityScore}), continuity accountability (${scoreBreakdown.continuityAccountabilityScore}), and accountability maturity (${scoreBreakdown.accountabilityMaturityScore}).`,
    missingData.length > 0 ? `Missing inputs flagged for human verification: ${missingData.join(", ")}.` : "No required structured inputs were missing.",
    "No outreach, SMS, email, Twilio, database writes, schema changes, workflow mutation, protected-class logic, demographic targeting, external APIs, scraping, autonomous execution, or autonomous management decisions were used.",
  ];
}

function buildAssumptions(input: EnterpriseAccountabilityInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0 ? ["Missing enterprise accountability inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."] : []),
    "Enterprise accountability intelligence is deterministic, explainable, read-only, compliance-first, and designed for human review before any execution.",
    "This engine evaluates accountability clarity across operations, governance, portfolio review, lead handling, deal execution, and continuity systems only.",
    "No outreach, SMS, email sending, Twilio, autonomous execution, autonomous management decisions, DB writes, schema changes, workflow mutations, external APIs, scraping, demographic data, or protected-class data were used.",
    "This is not HR advice, legal advice, ownership advice, tax advice, lending advice, investment advice, portfolio-management advice, autonomous management, or market prediction.",
  ]);
}

export function analyzeEnterpriseAccountabilityIntelligence(input: EnterpriseAccountabilityInput = {}): EnterpriseAccountabilityResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const accountabilityLevel = classifyAccountability(scoreBreakdown.overallAccountabilityScore);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallAccountabilityScore: scoreBreakdown.overallAccountabilityScore,
    accountabilityLevel,
    roleOwnershipScore: scoreBreakdown.roleOwnershipScore,
    taskResponsibilityScore: scoreBreakdown.taskResponsibilityScore,
    followThroughScore: scoreBreakdown.followThroughScore,
    escalationClarityScore: scoreBreakdown.escalationClarityScore,
    reviewAccountabilityScore: scoreBreakdown.reviewAccountabilityScore,
    governanceAccountabilityScore: scoreBreakdown.governanceAccountabilityScore,
    portfolioAccountabilityScore: scoreBreakdown.portfolioAccountabilityScore,
    dealExecutionAccountabilityScore: scoreBreakdown.dealExecutionAccountabilityScore,
    continuityAccountabilityScore: scoreBreakdown.continuityAccountabilityScore,
    accountabilityMaturityScore: scoreBreakdown.accountabilityMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown, missingData),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    accountabilityWarnings: buildAccountabilityWarnings(scoreBreakdown, missingData),
    explanation: buildExplanation({ scoreBreakdown, accountabilityLevel }),
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

export const getEnterpriseAccountabilityIntelligence = analyzeEnterpriseAccountabilityIntelligence;
