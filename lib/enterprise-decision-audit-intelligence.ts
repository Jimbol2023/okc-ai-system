import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type DecisionAuditLevel = "weak" | "incomplete" | "developing" | "disciplined" | "institutional";

export type EnterpriseDecisionAuditInput = {
  traceabilityScore?: number;
  governanceAlignmentScore?: number;
  approvalConsistencyScore?: number;
  escalationCorrectnessScore?: number;
  reviewDisciplineScore?: number;
  postDecisionEvaluationScore?: number;
  outcomeReviewScore?: number;
  strategicAlignmentScore?: number;
  institutionalLearningScore?: number;
  decisionAuditMaturityScore?: number;
  enterpriseDecisionRightsProfile?: unknown;
  enterpriseAccountabilityProfile?: unknown;
  enterpriseOperatingRhythmProfile?: unknown;
  processOptimizationProfile?: unknown;
  institutionalKnowledgeTransferProfile?: unknown;
  enterpriseExpansionGovernanceProfile?: unknown;
  familyOfficeGovernanceProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseDecisionAuditScoreBreakdown = CorridorScoreBreakdown & {
  overallDecisionAuditScore: number;
  traceabilityScore: number;
  governanceAlignmentScore: number;
  approvalConsistencyScore: number;
  escalationCorrectnessScore: number;
  reviewDisciplineScore: number;
  postDecisionEvaluationScore: number;
  outcomeReviewScore: number;
  strategicAlignmentScore: number;
  institutionalLearningScore: number;
  decisionAuditMaturityScore: number;
};

export type EnterpriseDecisionAuditResult = {
  overallDecisionAuditScore: number;
  decisionAuditLevel: DecisionAuditLevel;
  traceabilityScore: number;
  governanceAlignmentScore: number;
  approvalConsistencyScore: number;
  escalationCorrectnessScore: number;
  reviewDisciplineScore: number;
  postDecisionEvaluationScore: number;
  outcomeReviewScore: number;
  strategicAlignmentScore: number;
  institutionalLearningScore: number;
  decisionAuditMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseDecisionAuditScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  auditWarnings: string[];
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
    autonomousAuditActions: false;
    autonomousApprovalSystemsUsed: false;
    approvalAutomationCreated: false;
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

const REQUIRED_INPUTS: Array<keyof EnterpriseDecisionAuditInput> = [
  "traceabilityScore",
  "governanceAlignmentScore",
  "approvalConsistencyScore",
  "escalationCorrectnessScore",
  "reviewDisciplineScore",
  "postDecisionEvaluationScore",
  "outcomeReviewScore",
  "strategicAlignmentScore",
  "institutionalLearningScore",
  "decisionAuditMaturityScore",
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

function hasFallbackForInput(input: EnterpriseDecisionAuditInput, key: keyof EnterpriseDecisionAuditInput) {
  const rightsProfile = input.enterpriseDecisionRightsProfile;
  const accountabilityProfile = input.enterpriseAccountabilityProfile;
  const rhythmProfile = input.enterpriseOperatingRhythmProfile;
  const optimizationProfile = input.processOptimizationProfile;
  const knowledgeProfile = input.institutionalKnowledgeTransferProfile;
  const expansionGovernanceProfile = input.enterpriseExpansionGovernanceProfile;

  const fallbackPaths: Partial<Record<keyof EnterpriseDecisionAuditInput, boolean>> = {
    traceabilityScore:
      hasProfileScore(knowledgeProfile, ["decisionHistoryPreservationScore", "criticalKnowledgeDocumentationScore"]) ||
      hasProfileScore(accountabilityProfile, ["reviewAccountabilityScore"]),
    governanceAlignmentScore:
      hasProfileScore(rightsProfile, ["governanceAuthorityScore", "strategicGovernanceScore"]) ||
      hasProfileScore(expansionGovernanceProfile, ["humanReviewGovernanceAlignment"]),
    approvalConsistencyScore:
      hasProfileScore(rightsProfile, ["approvalRightsScore", "overrideDisciplineScore"]) ||
      hasProfileScore(expansionGovernanceProfile, ["approvalProcessDurability"]),
    escalationCorrectnessScore:
      hasProfileScore(rightsProfile, ["escalationAuthorityScore", "crisisDecisionAuthorityScore"]) ||
      hasProfileScore(accountabilityProfile, ["escalationClarityScore"]),
    reviewDisciplineScore:
      hasProfileScore(accountabilityProfile, ["reviewAccountabilityScore"]) ||
      hasProfileScore(rhythmProfile, ["decisionReviewTimingScore", "monthlyCadenceScore"]),
    postDecisionEvaluationScore:
      hasProfileScore(optimizationProfile, ["continuousImprovementReadinessScore"]) ||
      hasProfileScore(knowledgeProfile, ["decisionHistoryPreservationScore"]),
    outcomeReviewScore:
      hasProfileScore(optimizationProfile, ["continuousImprovementReadinessScore", "documentationEfficiencyScore"]) ||
      hasProfileScore(accountabilityProfile, ["followThroughScore"]),
    strategicAlignmentScore:
      hasProfileScore(rightsProfile, ["strategicGovernanceScore"]) ||
      hasProfileScore(rhythmProfile, ["strategicSynchronizationScore"]),
    institutionalLearningScore:
      hasProfileScore(knowledgeProfile, ["institutionalMemoryScore", "decisionHistoryPreservationScore"]) ||
      hasProfileScore(optimizationProfile, ["continuousImprovementReadinessScore"]),
    decisionAuditMaturityScore:
      hasProfileScore(rightsProfile, ["institutionalHierarchyMaturityScore", "overallDecisionRightsScore"]) ||
      hasProfileScore(accountabilityProfile, ["accountabilityMaturityScore"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: EnterpriseDecisionAuditInput) {
  const labels: Record<keyof EnterpriseDecisionAuditInput, string> = {
    traceabilityScore: "decision traceability quality score",
    governanceAlignmentScore: "governance alignment consistency score",
    approvalConsistencyScore: "approval consistency score",
    escalationCorrectnessScore: "escalation correctness score",
    reviewDisciplineScore: "review discipline quality score",
    postDecisionEvaluationScore: "post-decision evaluation maturity score",
    outcomeReviewScore: "decision outcome review quality score",
    strategicAlignmentScore: "strategic alignment consistency score",
    institutionalLearningScore: "institutional learning integration score",
    decisionAuditMaturityScore: "decision audit maturity score",
    enterpriseDecisionRightsProfile: "enterprise decision rights profile",
    enterpriseAccountabilityProfile: "enterprise accountability profile",
    enterpriseOperatingRhythmProfile: "enterprise operating rhythm profile",
    processOptimizationProfile: "process optimization profile",
    institutionalKnowledgeTransferProfile: "institutional knowledge transfer profile",
    enterpriseExpansionGovernanceProfile: "enterprise expansion governance profile",
    familyOfficeGovernanceProfile: "family office governance profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: EnterpriseDecisionAuditInput): EnterpriseDecisionAuditScoreBreakdown {
  const rightsProfile = input.enterpriseDecisionRightsProfile;
  const accountabilityProfile = input.enterpriseAccountabilityProfile;
  const rhythmProfile = input.enterpriseOperatingRhythmProfile;
  const optimizationProfile = input.processOptimizationProfile;
  const knowledgeProfile = input.institutionalKnowledgeTransferProfile;
  const expansionGovernanceProfile = input.enterpriseExpansionGovernanceProfile;
  const familyGovernanceProfile = input.familyOfficeGovernanceProfile;
  const traceabilityScore = getScore(
    input.traceabilityScore,
    weightedAverage([
      [extractProfileScore(knowledgeProfile, ["decisionHistoryPreservationScore", "scoreBreakdown.decisionHistoryPreservationScore"], 54), 0.28],
      [extractProfileScore(knowledgeProfile, ["criticalKnowledgeDocumentationScore", "scoreBreakdown.criticalKnowledgeDocumentationScore"], 54), 0.18],
      [extractProfileScore(accountabilityProfile, ["reviewAccountabilityScore", "scoreBreakdown.reviewAccountabilityScore"], 54), 0.18],
      [extractProfileScore(optimizationProfile, ["documentationEfficiencyScore"], 54), 0.14],
      [extractProfileScore(familyGovernanceProfile, ["governanceDocumentationReadiness"], 54), 0.12],
      [extractProfileScore(rightsProfile, ["authorityClarityScore"], 54), 0.1],
    ]),
  );
  const governanceAlignmentScore = getScore(
    input.governanceAlignmentScore,
    weightedAverage([
      [extractProfileScore(rightsProfile, ["governanceAuthorityScore", "scoreBreakdown.governanceAuthorityScore"], 54), 0.22],
      [extractProfileScore(rightsProfile, ["strategicGovernanceScore"], 54), 0.16],
      [extractProfileScore(expansionGovernanceProfile, ["humanReviewGovernanceAlignment", "scoreBreakdown.humanReviewGovernanceAlignmentScore"], 54), 0.18],
      [extractProfileScore(accountabilityProfile, ["governanceAccountabilityScore"], 54), 0.14],
      [extractProfileScore(rhythmProfile, ["quarterlyGovernanceScore"], 54), 0.12],
      [traceabilityScore, 0.1],
      [extractProfileScore(familyGovernanceProfile, ["decisionAccountability"], 54), 0.08],
    ]),
  );
  const approvalConsistencyScore = getScore(
    input.approvalConsistencyScore,
    weightedAverage([
      [extractProfileScore(rightsProfile, ["approvalRightsScore", "scoreBreakdown.approvalRightsScore"], 54), 0.26],
      [extractProfileScore(rightsProfile, ["overrideDisciplineScore"], 54), 0.16],
      [extractProfileScore(expansionGovernanceProfile, ["approvalProcessDurability", "scoreBreakdown.approvalProcessDurabilityScore"], 54), 0.2],
      [governanceAlignmentScore, 0.14],
      [traceabilityScore, 0.1],
      [extractProfileScore(accountabilityProfile, ["reviewAccountabilityScore"], 54), 0.08],
      [extractProfileScore(rhythmProfile, ["decisionReviewTimingScore"], 54), 0.06],
    ]),
  );
  const escalationCorrectnessScore = getScore(
    input.escalationCorrectnessScore,
    weightedAverage([
      [extractProfileScore(rightsProfile, ["escalationAuthorityScore", "scoreBreakdown.escalationAuthorityScore"], 54), 0.26],
      [extractProfileScore(rightsProfile, ["crisisDecisionAuthorityScore"], 54), 0.16],
      [extractProfileScore(accountabilityProfile, ["escalationClarityScore"], 54), 0.18],
      [extractProfileScore(accountabilityProfile, ["continuityAccountabilityScore"], 54), 0.12],
      [governanceAlignmentScore, 0.1],
      [traceabilityScore, 0.1],
      [extractProfileScore(rhythmProfile, ["crisisCadenceReadinessScore"], 54), 0.08],
    ]),
  );
  const reviewDisciplineScore = getScore(
    input.reviewDisciplineScore,
    weightedAverage([
      [extractProfileScore(accountabilityProfile, ["reviewAccountabilityScore"], 54), 0.22],
      [extractProfileScore(rhythmProfile, ["decisionReviewTimingScore", "scoreBreakdown.decisionReviewTimingScore"], 54), 0.18],
      [extractProfileScore(rhythmProfile, ["monthlyCadenceScore"], 54), 0.14],
      [traceabilityScore, 0.14],
      [approvalConsistencyScore, 0.1],
      [escalationCorrectnessScore, 0.1],
      [extractProfileScore(optimizationProfile, ["continuousImprovementReadinessScore"], 54), 0.12],
    ]),
  );
  const postDecisionEvaluationScore = getScore(
    input.postDecisionEvaluationScore,
    weightedAverage([
      [extractProfileScore(optimizationProfile, ["continuousImprovementReadinessScore", "scoreBreakdown.continuousImprovementReadinessScore"], 54), 0.24],
      [reviewDisciplineScore, 0.18],
      [traceabilityScore, 0.16],
      [extractProfileScore(knowledgeProfile, ["decisionHistoryPreservationScore"], 54), 0.14],
      [extractProfileScore(accountabilityProfile, ["followThroughScore"], 54), 0.12],
      [governanceAlignmentScore, 0.08],
      [approvalConsistencyScore, 0.08],
    ]),
  );
  const outcomeReviewScore = getScore(
    input.outcomeReviewScore,
    weightedAverage([
      [postDecisionEvaluationScore, 0.22],
      [reviewDisciplineScore, 0.18],
      [extractProfileScore(optimizationProfile, ["documentationEfficiencyScore"], 54), 0.14],
      [extractProfileScore(optimizationProfile, ["continuousImprovementReadinessScore"], 54), 0.14],
      [extractProfileScore(accountabilityProfile, ["followThroughScore"], 54), 0.12],
      [traceabilityScore, 0.1],
      [governanceAlignmentScore, 0.1],
    ]),
  );
  const strategicAlignmentScore = getScore(
    input.strategicAlignmentScore,
    weightedAverage([
      [extractProfileScore(rightsProfile, ["strategicGovernanceScore", "scoreBreakdown.strategicGovernanceScore"], 54), 0.22],
      [extractProfileScore(rhythmProfile, ["strategicSynchronizationScore", "scoreBreakdown.strategicSynchronizationScore"], 54), 0.18],
      [governanceAlignmentScore, 0.16],
      [extractProfileScore(expansionGovernanceProfile, ["strategicAccountabilityDiscipline"], 54), 0.14],
      [approvalConsistencyScore, 0.1],
      [outcomeReviewScore, 0.1],
      [extractProfileScore(accountabilityProfile, ["accountabilityMaturityScore"], 54), 0.1],
    ]),
  );
  const institutionalLearningScore = getScore(
    input.institutionalLearningScore,
    weightedAverage([
      [extractProfileScore(knowledgeProfile, ["institutionalMemoryScore", "scoreBreakdown.institutionalMemoryScore"], 54), 0.2],
      [extractProfileScore(knowledgeProfile, ["decisionHistoryPreservationScore"], 54), 0.18],
      [postDecisionEvaluationScore, 0.16],
      [outcomeReviewScore, 0.16],
      [extractProfileScore(optimizationProfile, ["continuousImprovementReadinessScore"], 54), 0.14],
      [reviewDisciplineScore, 0.1],
      [strategicAlignmentScore, 0.06],
    ]),
  );
  const decisionAuditMaturityScore = getScore(
    input.decisionAuditMaturityScore,
    weightedAverage([
      [traceabilityScore, 0.11],
      [governanceAlignmentScore, 0.11],
      [approvalConsistencyScore, 0.1],
      [escalationCorrectnessScore, 0.1],
      [reviewDisciplineScore, 0.11],
      [postDecisionEvaluationScore, 0.1],
      [outcomeReviewScore, 0.1],
      [strategicAlignmentScore, 0.1],
      [institutionalLearningScore, 0.11],
      [extractProfileScore(rightsProfile, ["institutionalHierarchyMaturityScore"], 54), 0.03],
      [extractProfileScore(accountabilityProfile, ["accountabilityMaturityScore"], 54), 0.03],
    ]),
  );
  const overallDecisionAuditScore = weightedAverage([
    [traceabilityScore, 0.12],
    [governanceAlignmentScore, 0.11],
    [approvalConsistencyScore, 0.1],
    [escalationCorrectnessScore, 0.1],
    [reviewDisciplineScore, 0.11],
    [postDecisionEvaluationScore, 0.1],
    [outcomeReviewScore, 0.1],
    [strategicAlignmentScore, 0.1],
    [institutionalLearningScore, 0.08],
    [decisionAuditMaturityScore, 0.08],
  ]);

  return {
    connectivityScore: escalationCorrectnessScore,
    durabilityScore: overallDecisionAuditScore,
    expansionScore: strategicAlignmentScore,
    institutionalScore: decisionAuditMaturityScore,
    logisticsScore: traceabilityScore,
    luxuryScore: outcomeReviewScore,
    developmentScore: institutionalLearningScore,
    overallDecisionAuditScore,
    traceabilityScore,
    governanceAlignmentScore,
    approvalConsistencyScore,
    escalationCorrectnessScore,
    reviewDisciplineScore,
    postDecisionEvaluationScore,
    outcomeReviewScore,
    strategicAlignmentScore,
    institutionalLearningScore,
    decisionAuditMaturityScore,
  };
}

function classifyDecisionAudit(score: number): DecisionAuditLevel {
  if (score >= 82) return "institutional";
  if (score >= 68) return "disciplined";
  if (score >= 54) return "developing";
  if (score >= 40) return "incomplete";

  return "weak";
}

function buildWarnings(scoreBreakdown: EnterpriseDecisionAuditScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "DECISION_AUDIT_DATA_INCOMPLETE",
            severity: missingData.length >= 5 ? "high" : "medium",
            message: "Enterprise decision audit assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.overallDecisionAuditScore < 42
      ? [
          createCorridorWarning({
            code: "DECISION_AUDIT_MATURITY_WEAK",
            severity: "high",
            message: "Overall decision audit maturity is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.traceabilityScore < 45
      ? [
          createCorridorWarning({
            code: "DECISION_TRACEABILITY_WEAK",
            severity: "medium",
            message: "Decision traceability quality is weak and requires manual governance review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.approvalConsistencyScore < 45
      ? [
          createCorridorWarning({
            code: "APPROVAL_CONSISTENCY_WEAK",
            severity: "medium",
            message: "Approval consistency is weak; this engine does not automate approvals.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.reviewDisciplineScore < 45
      ? [
          createCorridorWarning({
            code: "DECISION_REVIEW_DISCIPLINE_WEAK",
            severity: "medium",
            message: "Decision review discipline is weak; no autonomous management decision is performed.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
  ];
}

function buildAuditWarnings(scoreBreakdown: EnterpriseDecisionAuditScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.traceabilityScore < 55 ? ["Decision traceability may be too weak for durable governance review."] : []),
    ...(scoreBreakdown.governanceAlignmentScore < 55 ? ["Governance alignment may be inconsistent across decision records."] : []),
    ...(scoreBreakdown.approvalConsistencyScore < 55 ? ["Approval consistency may be weak; no approval automation is created."] : []),
    ...(scoreBreakdown.escalationCorrectnessScore < 55 ? ["Escalation correctness may be underdeveloped; no autonomous escalation action is taken."] : []),
    ...(scoreBreakdown.reviewDisciplineScore < 55 ? ["Review discipline may be too weak for reliable decision audit loops."] : []),
    ...(scoreBreakdown.postDecisionEvaluationScore < 55 ? ["Post-decision evaluation maturity may be underdeveloped."] : []),
    ...(scoreBreakdown.outcomeReviewScore < 55 ? ["Decision outcome review quality may be too inconsistent for institutional learning."] : []),
    ...(scoreBreakdown.strategicAlignmentScore < 55 ? ["Strategic alignment consistency may need human governance review."] : []),
    ...(scoreBreakdown.institutionalLearningScore < 55 ? ["Institutional learning integration may be underdeveloped."] : []),
    ...(scoreBreakdown.decisionAuditMaturityScore < 55 ? ["Decision audit maturity may be insufficient for institutional governance."] : []),
    ...(missingData.length > 0 ? ["Audit warnings require human validation because required structured inputs are incomplete."] : []),
  ]);
}

function buildKeyRisks(scoreBreakdown: EnterpriseDecisionAuditScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.overallDecisionAuditScore < 50 ? ["Overall decision audit maturity is weak."] : []),
    ...(scoreBreakdown.traceabilityScore < 50 ? ["Decision traceability quality is weak."] : []),
    ...(scoreBreakdown.governanceAlignmentScore < 50 ? ["Governance alignment consistency is weak."] : []),
    ...(scoreBreakdown.approvalConsistencyScore < 50 ? ["Approval consistency is weak."] : []),
    ...(scoreBreakdown.escalationCorrectnessScore < 50 ? ["Escalation correctness is weak."] : []),
    ...(scoreBreakdown.reviewDisciplineScore < 50 ? ["Review discipline quality is weak."] : []),
    ...(scoreBreakdown.postDecisionEvaluationScore < 50 ? ["Post-decision evaluation maturity is weak."] : []),
    ...(scoreBreakdown.outcomeReviewScore < 50 ? ["Decision outcome review quality is weak."] : []),
    ...(scoreBreakdown.strategicAlignmentScore < 50 ? ["Strategic alignment consistency is weak."] : []),
    ...(scoreBreakdown.institutionalLearningScore < 50 ? ["Institutional learning integration is weak."] : []),
    ...(scoreBreakdown.decisionAuditMaturityScore < 50 ? ["Decision audit maturity is weak."] : []),
    ...(missingData.length > 0 ? `Missing data reduces confidence: ${missingData.slice(0, 4).join(", ")}.` : []),
  ]);
}

function buildStrengths(scoreBreakdown: EnterpriseDecisionAuditScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.overallDecisionAuditScore >= 70 ? ["Overall decision audit maturity is strong."] : []),
    ...(scoreBreakdown.traceabilityScore >= 70 ? ["Decision traceability quality is strong."] : []),
    ...(scoreBreakdown.governanceAlignmentScore >= 70 ? ["Governance alignment consistency is strong."] : []),
    ...(scoreBreakdown.approvalConsistencyScore >= 70 ? ["Approval consistency is strong."] : []),
    ...(scoreBreakdown.escalationCorrectnessScore >= 70 ? ["Escalation correctness is strong."] : []),
    ...(scoreBreakdown.reviewDisciplineScore >= 70 ? ["Review discipline quality is strong."] : []),
    ...(scoreBreakdown.postDecisionEvaluationScore >= 70 ? ["Post-decision evaluation maturity is strong."] : []),
    ...(scoreBreakdown.outcomeReviewScore >= 70 ? ["Decision outcome review quality is strong."] : []),
    ...(scoreBreakdown.strategicAlignmentScore >= 70 ? ["Strategic alignment consistency is strong."] : []),
    ...(scoreBreakdown.institutionalLearningScore >= 70 ? ["Institutional learning integration is strong."] : []),
    ...(scoreBreakdown.decisionAuditMaturityScore >= 70 ? ["Decision audit maturity is strong."] : []),
  ]);
}

function buildRecommendations(scoreBreakdown: EnterpriseDecisionAuditScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.traceabilityScore < 58 ? ["Review decision traceability gaps and strengthen human-reviewed decision records."] : []),
    ...(scoreBreakdown.governanceAlignmentScore < 58 ? ["Review governance alignment consistency; this is not legal, HR, ownership, or tax advice."] : []),
    ...(scoreBreakdown.approvalConsistencyScore < 58 ? ["Review approval consistency without creating approval automation or autonomous approval systems."] : []),
    ...(scoreBreakdown.escalationCorrectnessScore < 58 ? ["Review escalation correctness and document manual escalation audit checkpoints."] : []),
    ...(scoreBreakdown.reviewDisciplineScore < 58 ? ["Review decision-review discipline and clarify human-reviewed audit cadence."] : []),
    ...(scoreBreakdown.postDecisionEvaluationScore < 58 ? ["Review post-decision evaluation maturity and document evaluation checkpoints."] : []),
    ...(scoreBreakdown.outcomeReviewScore < 58 ? ["Review decision outcome review quality and capture manual learning notes."] : []),
    ...(scoreBreakdown.strategicAlignmentScore < 58 ? ["Review strategic alignment consistency against governance expectations."] : []),
    ...(scoreBreakdown.institutionalLearningScore < 58 ? ["Review institutional learning integration and preserve decision lessons for future review."] : []),
    ...(scoreBreakdown.decisionAuditMaturityScore < 58 ? ["Review decision audit maturity and identify governance/review gaps."] : []),
    "Keep decision-audit improvements human-reviewed; this module does not provide legal, HR, ownership, tax, lending, investment, portfolio-management, autonomous approval, autonomous audit, autonomous management, or market-prediction advice.",
  ]);
}

function buildExplanation(params: { scoreBreakdown: EnterpriseDecisionAuditScoreBreakdown; decisionAuditLevel: DecisionAuditLevel }) {
  const scoreBreakdown = params.scoreBreakdown;

  return [
    `Decision audit level is ${params.decisionAuditLevel} with an overall decision audit score of ${scoreBreakdown.overallDecisionAuditScore}/100.`,
    `Traceability is ${scoreBreakdown.traceabilityScore}/100, governance alignment is ${scoreBreakdown.governanceAlignmentScore}/100, and review discipline is ${scoreBreakdown.reviewDisciplineScore}/100.`,
    "Traceability, governance alignment, approval consistency, escalation correctness, review discipline, post-decision evaluation, outcome review, strategic alignment, institutional learning, and decision audit maturity were scored deterministically from structured inputs and optional read-only profile fallbacks.",
    "This output identifies governance/review/audit maturity gaps only and does not provide legal, HR, ownership, tax, lending, investment, portfolio-management, autonomous approval, autonomous audit, autonomous management, or market-prediction advice.",
  ];
}

function buildTrace(scoreBreakdown: EnterpriseDecisionAuditScoreBreakdown, missingData: string[]) {
  return [
    "Normalized all numeric scores to a deterministic 0-100 scale.",
    "Derived optional fallback scores only from supplied in-memory intelligence profiles.",
    `Computed enterprise decision audit from traceability (${scoreBreakdown.traceabilityScore}), governance alignment (${scoreBreakdown.governanceAlignmentScore}), approval consistency (${scoreBreakdown.approvalConsistencyScore}), escalation correctness (${scoreBreakdown.escalationCorrectnessScore}), review discipline (${scoreBreakdown.reviewDisciplineScore}), post-decision evaluation (${scoreBreakdown.postDecisionEvaluationScore}), outcome review (${scoreBreakdown.outcomeReviewScore}), strategic alignment (${scoreBreakdown.strategicAlignmentScore}), institutional learning (${scoreBreakdown.institutionalLearningScore}), and audit maturity (${scoreBreakdown.decisionAuditMaturityScore}).`,
    missingData.length > 0 ? `Missing inputs flagged for human verification: ${missingData.join(", ")}.` : "No required structured inputs were missing.",
    "No outreach, SMS, email, Twilio, database writes, schema changes, workflow mutation, protected-class logic, demographic targeting, external APIs, scraping, approval automation, autonomous audit actions, autonomous execution, or autonomous management decisions were used.",
  ];
}

function buildAssumptions(input: EnterpriseDecisionAuditInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0 ? ["Missing enterprise decision audit inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."] : []),
    "Enterprise decision audit intelligence is deterministic, explainable, read-only, compliance-first, and designed for human review before any execution.",
    "This engine evaluates decision traceability, governance alignment, approval consistency, escalation correctness, review discipline, post-decision evaluation, outcome review, strategic alignment, institutional learning, and audit maturity only.",
    "No outreach, SMS, email sending, Twilio, autonomous execution, autonomous audit actions, autonomous management decisions, approval automation, DB writes, schema changes, workflow mutations, external APIs, scraping, demographic data, or protected-class data were used.",
    "This is not legal advice, HR advice, ownership advice, tax advice, lending advice, investment advice, portfolio-management advice, autonomous approval, autonomous audit, autonomous management, or market prediction.",
  ]);
}

export function analyzeEnterpriseDecisionAuditIntelligence(input: EnterpriseDecisionAuditInput = {}): EnterpriseDecisionAuditResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const decisionAuditLevel = classifyDecisionAudit(scoreBreakdown.overallDecisionAuditScore);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallDecisionAuditScore: scoreBreakdown.overallDecisionAuditScore,
    decisionAuditLevel,
    traceabilityScore: scoreBreakdown.traceabilityScore,
    governanceAlignmentScore: scoreBreakdown.governanceAlignmentScore,
    approvalConsistencyScore: scoreBreakdown.approvalConsistencyScore,
    escalationCorrectnessScore: scoreBreakdown.escalationCorrectnessScore,
    reviewDisciplineScore: scoreBreakdown.reviewDisciplineScore,
    postDecisionEvaluationScore: scoreBreakdown.postDecisionEvaluationScore,
    outcomeReviewScore: scoreBreakdown.outcomeReviewScore,
    strategicAlignmentScore: scoreBreakdown.strategicAlignmentScore,
    institutionalLearningScore: scoreBreakdown.institutionalLearningScore,
    decisionAuditMaturityScore: scoreBreakdown.decisionAuditMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown, missingData),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    auditWarnings: buildAuditWarnings(scoreBreakdown, missingData),
    explanation: buildExplanation({ scoreBreakdown, decisionAuditLevel }),
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
      autonomousAuditActions: false,
      autonomousApprovalSystemsUsed: false,
      approvalAutomationCreated: false,
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

export const getEnterpriseDecisionAuditIntelligence = analyzeEnterpriseDecisionAuditIntelligence;
