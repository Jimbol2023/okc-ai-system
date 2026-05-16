import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type DecisionGovernanceLevel = "unclear" | "exposed" | "defined" | "disciplined" | "institutional";

export type EnterpriseDecisionRightsInput = {
  authorityClarityScore?: number;
  approvalRightsScore?: number;
  escalationAuthorityScore?: number;
  governanceAuthorityScore?: number;
  overrideDisciplineScore?: number;
  operationalDecisionOwnershipScore?: number;
  portfolioDecisionAuthorityScore?: number;
  crisisDecisionAuthorityScore?: number;
  strategicGovernanceScore?: number;
  institutionalHierarchyMaturityScore?: number;
  enterpriseAccountabilityProfile?: unknown;
  enterpriseOperatingRhythmProfile?: unknown;
  operationalPlaybookProfile?: unknown;
  founderDependencyProfile?: unknown;
  enterpriseExpansionGovernanceProfile?: unknown;
  familyOfficeGovernanceProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseDecisionRightsScoreBreakdown = CorridorScoreBreakdown & {
  overallDecisionRightsScore: number;
  authorityClarityScore: number;
  approvalRightsScore: number;
  escalationAuthorityScore: number;
  governanceAuthorityScore: number;
  overrideDisciplineScore: number;
  operationalDecisionOwnershipScore: number;
  portfolioDecisionAuthorityScore: number;
  crisisDecisionAuthorityScore: number;
  strategicGovernanceScore: number;
  institutionalHierarchyMaturityScore: number;
};

export type EnterpriseDecisionRightsResult = {
  overallDecisionRightsScore: number;
  decisionGovernanceLevel: DecisionGovernanceLevel;
  authorityClarityScore: number;
  approvalRightsScore: number;
  escalationAuthorityScore: number;
  governanceAuthorityScore: number;
  overrideDisciplineScore: number;
  operationalDecisionOwnershipScore: number;
  portfolioDecisionAuthorityScore: number;
  crisisDecisionAuthorityScore: number;
  strategicGovernanceScore: number;
  institutionalHierarchyMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseDecisionRightsScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  authorityWarnings: string[];
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

const REQUIRED_INPUTS: Array<keyof EnterpriseDecisionRightsInput> = [
  "authorityClarityScore",
  "approvalRightsScore",
  "escalationAuthorityScore",
  "governanceAuthorityScore",
  "overrideDisciplineScore",
  "operationalDecisionOwnershipScore",
  "portfolioDecisionAuthorityScore",
  "crisisDecisionAuthorityScore",
  "strategicGovernanceScore",
  "institutionalHierarchyMaturityScore",
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

function hasFallbackForInput(input: EnterpriseDecisionRightsInput, key: keyof EnterpriseDecisionRightsInput) {
  const accountabilityProfile = input.enterpriseAccountabilityProfile;
  const rhythmProfile = input.enterpriseOperatingRhythmProfile;
  const playbookProfile = input.operationalPlaybookProfile;
  const keyPersonProfile = input.founderDependencyProfile;
  const expansionGovernanceProfile = input.enterpriseExpansionGovernanceProfile;
  const familyGovernanceProfile = input.familyOfficeGovernanceProfile;

  const fallbackPaths: Partial<Record<keyof EnterpriseDecisionRightsInput, boolean>> = {
    authorityClarityScore:
      hasProfileScore(accountabilityProfile, ["roleOwnershipScore", "taskResponsibilityScore"]) ||
      hasProfileScore(playbookProfile, ["roleClarityScore"]),
    approvalRightsScore:
      hasProfileScore(expansionGovernanceProfile, ["approvalProcessDurability", "humanReviewGovernanceAlignment"]) ||
      hasProfileScore(accountabilityProfile, ["governanceAccountabilityScore"]),
    escalationAuthorityScore:
      hasProfileScore(accountabilityProfile, ["escalationClarityScore", "continuityAccountabilityScore"]) ||
      hasProfileScore(keyPersonProfile, ["backupLeadershipReadinessScore", "continuityReadinessScore"]),
    governanceAuthorityScore:
      hasProfileScore(expansionGovernanceProfile, ["humanReviewGovernanceAlignment", "strategicAccountabilityDiscipline"]) ||
      hasProfileScore(familyGovernanceProfile, ["decisionAccountability", "humanReviewGovernanceAlignment"]),
    overrideDisciplineScore:
      hasProfileScore(expansionGovernanceProfile, ["humanReviewGovernanceAlignment", "approvalProcessDurability"]) ||
      hasProfileScore(rhythmProfile, ["decisionReviewTimingScore"]),
    operationalDecisionOwnershipScore:
      hasProfileScore(accountabilityProfile, ["roleOwnershipScore", "dealExecutionAccountabilityScore"]) ||
      hasProfileScore(playbookProfile, ["roleClarityScore", "updateDisciplineScore"]),
    portfolioDecisionAuthorityScore:
      hasProfileScore(accountabilityProfile, ["portfolioAccountabilityScore"]) ||
      hasProfileScore(rhythmProfile, ["portfolioReviewCadenceScore"]),
    crisisDecisionAuthorityScore:
      hasProfileScore(accountabilityProfile, ["continuityAccountabilityScore", "escalationClarityScore"]) ||
      hasProfileScore(rhythmProfile, ["crisisCadenceReadinessScore"]),
    strategicGovernanceScore:
      hasProfileScore(expansionGovernanceProfile, ["strategicAccountabilityDiscipline", "enterpriseGovernanceQuality"]) ||
      hasProfileScore(rhythmProfile, ["strategicSynchronizationScore"]),
    institutionalHierarchyMaturityScore:
      hasProfileScore(accountabilityProfile, ["accountabilityMaturityScore", "overallAccountabilityScore"]) ||
      hasProfileScore(rhythmProfile, ["institutionalRhythmMaturityScore"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: EnterpriseDecisionRightsInput) {
  const labels: Record<keyof EnterpriseDecisionRightsInput, string> = {
    authorityClarityScore: "decision authority clarity score",
    approvalRightsScore: "approval rights clarity score",
    escalationAuthorityScore: "escalation authority structure score",
    governanceAuthorityScore: "governance review authority score",
    overrideDisciplineScore: "override authority discipline score",
    operationalDecisionOwnershipScore: "operational decision ownership score",
    portfolioDecisionAuthorityScore: "portfolio decision authority score",
    crisisDecisionAuthorityScore: "crisis-response decision authority score",
    strategicGovernanceScore: "strategic decision governance score",
    institutionalHierarchyMaturityScore: "institutional decision hierarchy maturity score",
    enterpriseAccountabilityProfile: "enterprise accountability profile",
    enterpriseOperatingRhythmProfile: "enterprise operating rhythm profile",
    operationalPlaybookProfile: "operational playbook profile",
    founderDependencyProfile: "founder dependency/key-person risk profile",
    enterpriseExpansionGovernanceProfile: "enterprise expansion governance profile",
    familyOfficeGovernanceProfile: "family office governance profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: EnterpriseDecisionRightsInput): EnterpriseDecisionRightsScoreBreakdown {
  const accountabilityProfile = input.enterpriseAccountabilityProfile;
  const rhythmProfile = input.enterpriseOperatingRhythmProfile;
  const playbookProfile = input.operationalPlaybookProfile;
  const keyPersonProfile = input.founderDependencyProfile;
  const expansionGovernanceProfile = input.enterpriseExpansionGovernanceProfile;
  const familyGovernanceProfile = input.familyOfficeGovernanceProfile;
  const authorityClarityScore = getScore(
    input.authorityClarityScore,
    weightedAverage([
      [extractProfileScore(accountabilityProfile, ["roleOwnershipScore", "scoreBreakdown.roleOwnershipScore"], 54), 0.24],
      [extractProfileScore(accountabilityProfile, ["taskResponsibilityScore"], 54), 0.18],
      [extractProfileScore(playbookProfile, ["roleClarityScore", "scoreBreakdown.roleClarityScore"], 54), 0.2],
      [extractProfileScore(familyGovernanceProfile, ["decisionAccountability", "scoreBreakdown.decisionAccountabilityScore"], 54), 0.14],
      [100 - extractProfileScore(keyPersonProfile, ["decisionConcentrationScore"], 48), 0.14],
      [extractProfileScore(rhythmProfile, ["decisionReviewTimingScore"], 54), 0.1],
    ]),
  );
  const approvalRightsScore = getScore(
    input.approvalRightsScore,
    weightedAverage([
      [authorityClarityScore, 0.16],
      [extractProfileScore(expansionGovernanceProfile, ["approvalProcessDurability", "scoreBreakdown.approvalProcessDurabilityScore"], 54), 0.24],
      [extractProfileScore(expansionGovernanceProfile, ["humanReviewGovernanceAlignment", "scoreBreakdown.humanReviewGovernanceAlignmentScore"], 54), 0.2],
      [extractProfileScore(accountabilityProfile, ["governanceAccountabilityScore"], 54), 0.14],
      [extractProfileScore(playbookProfile, ["updateDisciplineScore"], 54), 0.12],
      [extractProfileScore(familyGovernanceProfile, ["governanceDocumentationReadiness"], 54), 0.08],
      [100 - extractProfileScore(keyPersonProfile, ["accessControlConcentrationScore"], 48), 0.06],
    ]),
  );
  const escalationAuthorityScore = getScore(
    input.escalationAuthorityScore,
    weightedAverage([
      [extractProfileScore(accountabilityProfile, ["escalationClarityScore", "scoreBreakdown.escalationClarityScore"], 54), 0.26],
      [authorityClarityScore, 0.16],
      [extractProfileScore(accountabilityProfile, ["continuityAccountabilityScore"], 54), 0.14],
      [extractProfileScore(keyPersonProfile, ["backupLeadershipReadinessScore"], 54), 0.16],
      [extractProfileScore(keyPersonProfile, ["continuityReadinessScore"], 54), 0.12],
      [extractProfileScore(playbookProfile, ["emergencyContinuityPlaybookScore"], 54), 0.08],
      [extractProfileScore(rhythmProfile, ["crisisCadenceReadinessScore"], 54), 0.08],
    ]),
  );
  const governanceAuthorityScore = getScore(
    input.governanceAuthorityScore,
    weightedAverage([
      [approvalRightsScore, 0.16],
      [extractProfileScore(expansionGovernanceProfile, ["humanReviewGovernanceAlignment"], 54), 0.22],
      [extractProfileScore(expansionGovernanceProfile, ["strategicAccountabilityDiscipline", "scoreBreakdown.strategicAccountabilityDisciplineScore"], 54), 0.18],
      [extractProfileScore(familyGovernanceProfile, ["decisionAccountability"], 54), 0.14],
      [extractProfileScore(accountabilityProfile, ["governanceAccountabilityScore"], 54), 0.12],
      [extractProfileScore(rhythmProfile, ["quarterlyGovernanceScore"], 54), 0.1],
      [authorityClarityScore, 0.08],
    ]),
  );
  const overrideDisciplineScore = getScore(
    input.overrideDisciplineScore,
    weightedAverage([
      [extractProfileScore(expansionGovernanceProfile, ["humanReviewGovernanceAlignment"], 54), 0.22],
      [approvalRightsScore, 0.18],
      [governanceAuthorityScore, 0.16],
      [extractProfileScore(expansionGovernanceProfile, ["approvalProcessDurability"], 54), 0.14],
      [extractProfileScore(rhythmProfile, ["decisionReviewTimingScore", "scoreBreakdown.decisionReviewTimingScore"], 54), 0.12],
      [extractProfileScore(accountabilityProfile, ["reviewAccountabilityScore"], 54), 0.1],
      [100 - extractProfileScore(keyPersonProfile, ["decisionConcentrationScore"], 48), 0.08],
    ]),
  );
  const operationalDecisionOwnershipScore = getScore(
    input.operationalDecisionOwnershipScore,
    weightedAverage([
      [authorityClarityScore, 0.18],
      [extractProfileScore(accountabilityProfile, ["roleOwnershipScore"], 54), 0.18],
      [extractProfileScore(accountabilityProfile, ["dealExecutionAccountabilityScore"], 54), 0.16],
      [extractProfileScore(playbookProfile, ["roleClarityScore"], 54), 0.14],
      [extractProfileScore(playbookProfile, ["updateDisciplineScore"], 54), 0.12],
      [extractProfileScore(rhythmProfile, ["operationalTempoScore"], 54), 0.12],
      [100 - extractProfileScore(keyPersonProfile, ["operationalContinuityRiskScore"], 48), 0.1],
    ]),
  );
  const portfolioDecisionAuthorityScore = getScore(
    input.portfolioDecisionAuthorityScore,
    weightedAverage([
      [extractProfileScore(accountabilityProfile, ["portfolioAccountabilityScore", "scoreBreakdown.portfolioAccountabilityScore"], 54), 0.22],
      [extractProfileScore(rhythmProfile, ["portfolioReviewCadenceScore", "scoreBreakdown.portfolioReviewCadenceScore"], 54), 0.18],
      [governanceAuthorityScore, 0.16],
      [approvalRightsScore, 0.14],
      [overrideDisciplineScore, 0.12],
      [extractProfileScore(playbookProfile, ["portfolioReviewPlaybookScore"], 54), 0.1],
      [extractProfileScore(familyGovernanceProfile, ["riskOversightDiscipline"], 54), 0.08],
    ]),
  );
  const crisisDecisionAuthorityScore = getScore(
    input.crisisDecisionAuthorityScore,
    weightedAverage([
      [escalationAuthorityScore, 0.24],
      [extractProfileScore(accountabilityProfile, ["continuityAccountabilityScore"], 54), 0.18],
      [extractProfileScore(rhythmProfile, ["crisisCadenceReadinessScore"], 54), 0.16],
      [extractProfileScore(keyPersonProfile, ["backupLeadershipReadinessScore"], 54), 0.14],
      [extractProfileScore(playbookProfile, ["emergencyContinuityPlaybookScore"], 54), 0.12],
      [authorityClarityScore, 0.08],
      [overrideDisciplineScore, 0.08],
    ]),
  );
  const strategicGovernanceScore = getScore(
    input.strategicGovernanceScore,
    weightedAverage([
      [governanceAuthorityScore, 0.18],
      [approvalRightsScore, 0.14],
      [overrideDisciplineScore, 0.14],
      [extractProfileScore(expansionGovernanceProfile, ["strategicAccountabilityDiscipline"], 54), 0.18],
      [extractProfileScore(expansionGovernanceProfile, ["enterpriseGovernanceQuality", "scoreBreakdown.enterpriseGovernanceQualityScore"], 54), 0.12],
      [extractProfileScore(rhythmProfile, ["strategicSynchronizationScore", "scoreBreakdown.strategicSynchronizationScore"], 54), 0.12],
      [extractProfileScore(accountabilityProfile, ["accountabilityMaturityScore"], 54), 0.12],
    ]),
  );
  const institutionalHierarchyMaturityScore = getScore(
    input.institutionalHierarchyMaturityScore,
    weightedAverage([
      [authorityClarityScore, 0.11],
      [approvalRightsScore, 0.11],
      [escalationAuthorityScore, 0.1],
      [governanceAuthorityScore, 0.11],
      [overrideDisciplineScore, 0.1],
      [operationalDecisionOwnershipScore, 0.1],
      [portfolioDecisionAuthorityScore, 0.09],
      [crisisDecisionAuthorityScore, 0.09],
      [strategicGovernanceScore, 0.11],
      [extractProfileScore(accountabilityProfile, ["accountabilityMaturityScore", "scoreBreakdown.accountabilityMaturityScore"], 54), 0.04],
      [extractProfileScore(rhythmProfile, ["institutionalRhythmMaturityScore"], 54), 0.04],
    ]),
  );
  const overallDecisionRightsScore = weightedAverage([
    [authorityClarityScore, 0.12],
    [approvalRightsScore, 0.11],
    [escalationAuthorityScore, 0.1],
    [governanceAuthorityScore, 0.11],
    [overrideDisciplineScore, 0.1],
    [operationalDecisionOwnershipScore, 0.1],
    [portfolioDecisionAuthorityScore, 0.09],
    [crisisDecisionAuthorityScore, 0.09],
    [strategicGovernanceScore, 0.1],
    [institutionalHierarchyMaturityScore, 0.08],
  ]);

  return {
    connectivityScore: escalationAuthorityScore,
    durabilityScore: overallDecisionRightsScore,
    expansionScore: operationalDecisionOwnershipScore,
    institutionalScore: institutionalHierarchyMaturityScore,
    logisticsScore: authorityClarityScore,
    luxuryScore: portfolioDecisionAuthorityScore,
    developmentScore: crisisDecisionAuthorityScore,
    overallDecisionRightsScore,
    authorityClarityScore,
    approvalRightsScore,
    escalationAuthorityScore,
    governanceAuthorityScore,
    overrideDisciplineScore,
    operationalDecisionOwnershipScore,
    portfolioDecisionAuthorityScore,
    crisisDecisionAuthorityScore,
    strategicGovernanceScore,
    institutionalHierarchyMaturityScore,
  };
}

function classifyDecisionGovernance(score: number): DecisionGovernanceLevel {
  if (score >= 82) return "institutional";
  if (score >= 68) return "disciplined";
  if (score >= 54) return "defined";
  if (score >= 40) return "exposed";

  return "unclear";
}

function buildWarnings(scoreBreakdown: EnterpriseDecisionRightsScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "DECISION_RIGHTS_DATA_INCOMPLETE",
            severity: missingData.length >= 5 ? "high" : "medium",
            message: "Enterprise decision rights assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.overallDecisionRightsScore < 42
      ? [
          createCorridorWarning({
            code: "DECISION_RIGHTS_UNCLEAR",
            severity: "high",
            message: "Overall enterprise decision rights clarity is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.approvalRightsScore < 45
      ? [
          createCorridorWarning({
            code: "APPROVAL_RIGHTS_WEAK",
            severity: "medium",
            message: "Approval rights clarity is weak; this engine does not automate approvals.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.escalationAuthorityScore < 45
      ? [
          createCorridorWarning({
            code: "ESCALATION_AUTHORITY_WEAK",
            severity: "medium",
            message: "Escalation authority structure is weak; no autonomous management decision is performed.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.overrideDisciplineScore < 45
      ? [
          createCorridorWarning({
            code: "OVERRIDE_DISCIPLINE_WEAK",
            severity: "medium",
            message: "Override authority discipline is weak and requires manual governance review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
  ];
}

function buildAuthorityWarnings(scoreBreakdown: EnterpriseDecisionRightsScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.authorityClarityScore < 55 ? ["Decision authority clarity may be too weak for durable operating governance."] : []),
    ...(scoreBreakdown.approvalRightsScore < 55 ? ["Approval rights may be unclear; no approval automation is created."] : []),
    ...(scoreBreakdown.escalationAuthorityScore < 55 ? ["Escalation authority may be underdefined; no autonomous escalation action is taken."] : []),
    ...(scoreBreakdown.governanceAuthorityScore < 55 ? ["Governance review authority may need human clarification."] : []),
    ...(scoreBreakdown.overrideDisciplineScore < 55 ? ["Override authority discipline may be too weak for explainable governance review."] : []),
    ...(scoreBreakdown.operationalDecisionOwnershipScore < 55 ? ["Operational decision ownership may be unclear across execution workflows."] : []),
    ...(scoreBreakdown.portfolioDecisionAuthorityScore < 55 ? ["Portfolio decision authority may be underdefined; no investment or portfolio-management guidance is provided."] : []),
    ...(scoreBreakdown.crisisDecisionAuthorityScore < 55 ? ["Crisis-response decision authority may be insufficient for continuity review."] : []),
    ...(scoreBreakdown.strategicGovernanceScore < 55 ? ["Strategic decision governance may be underdeveloped."] : []),
    ...(scoreBreakdown.institutionalHierarchyMaturityScore < 55 ? ["Institutional decision hierarchy maturity may be underdeveloped."] : []),
    ...(missingData.length > 0 ? ["Authority warnings require human validation because required structured inputs are incomplete."] : []),
  ]);
}

function buildKeyRisks(scoreBreakdown: EnterpriseDecisionRightsScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.overallDecisionRightsScore < 50 ? ["Overall decision rights clarity is weak."] : []),
    ...(scoreBreakdown.authorityClarityScore < 50 ? ["Decision authority clarity is weak."] : []),
    ...(scoreBreakdown.approvalRightsScore < 50 ? ["Approval rights clarity is weak."] : []),
    ...(scoreBreakdown.escalationAuthorityScore < 50 ? ["Escalation authority structure is weak."] : []),
    ...(scoreBreakdown.governanceAuthorityScore < 50 ? ["Governance review authority is weak."] : []),
    ...(scoreBreakdown.overrideDisciplineScore < 50 ? ["Override authority discipline is weak."] : []),
    ...(scoreBreakdown.operationalDecisionOwnershipScore < 50 ? ["Operational decision ownership is weak."] : []),
    ...(scoreBreakdown.portfolioDecisionAuthorityScore < 50 ? ["Portfolio decision authority is weak."] : []),
    ...(scoreBreakdown.crisisDecisionAuthorityScore < 50 ? ["Crisis-response decision authority is weak."] : []),
    ...(scoreBreakdown.strategicGovernanceScore < 50 ? ["Strategic decision governance is weak."] : []),
    ...(scoreBreakdown.institutionalHierarchyMaturityScore < 50 ? ["Institutional decision hierarchy maturity is weak."] : []),
    ...(missingData.length > 0 ? `Missing data reduces confidence: ${missingData.slice(0, 4).join(", ")}.` : []),
  ]);
}

function buildStrengths(scoreBreakdown: EnterpriseDecisionRightsScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.overallDecisionRightsScore >= 70 ? ["Overall decision rights clarity is strong."] : []),
    ...(scoreBreakdown.authorityClarityScore >= 70 ? ["Decision authority clarity is strong."] : []),
    ...(scoreBreakdown.approvalRightsScore >= 70 ? ["Approval rights clarity is strong."] : []),
    ...(scoreBreakdown.escalationAuthorityScore >= 70 ? ["Escalation authority structure is strong."] : []),
    ...(scoreBreakdown.governanceAuthorityScore >= 70 ? ["Governance review authority is strong."] : []),
    ...(scoreBreakdown.overrideDisciplineScore >= 70 ? ["Override authority discipline is strong."] : []),
    ...(scoreBreakdown.operationalDecisionOwnershipScore >= 70 ? ["Operational decision ownership is strong."] : []),
    ...(scoreBreakdown.portfolioDecisionAuthorityScore >= 70 ? ["Portfolio decision authority is strong."] : []),
    ...(scoreBreakdown.crisisDecisionAuthorityScore >= 70 ? ["Crisis-response decision authority is strong."] : []),
    ...(scoreBreakdown.strategicGovernanceScore >= 70 ? ["Strategic decision governance is strong."] : []),
    ...(scoreBreakdown.institutionalHierarchyMaturityScore >= 70 ? ["Institutional decision hierarchy maturity is strong."] : []),
  ]);
}

function buildRecommendations(scoreBreakdown: EnterpriseDecisionRightsScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.authorityClarityScore < 58 ? ["Review decision authority clarity and document manual authority boundaries for human review."] : []),
    ...(scoreBreakdown.approvalRightsScore < 58 ? ["Review approval rights clarity without creating approval automation or autonomous approval systems."] : []),
    ...(scoreBreakdown.escalationAuthorityScore < 58 ? ["Review escalation authority and document manual escalation checkpoints."] : []),
    ...(scoreBreakdown.governanceAuthorityScore < 58 ? ["Review governance review authority; this is not legal, HR, ownership, or tax advice."] : []),
    ...(scoreBreakdown.overrideDisciplineScore < 58 ? ["Review override authority discipline and strengthen human-reviewed exception notes."] : []),
    ...(scoreBreakdown.operationalDecisionOwnershipScore < 58 ? ["Review operational decision ownership across recurring execution workflows."] : []),
    ...(scoreBreakdown.portfolioDecisionAuthorityScore < 58
      ? ["Review portfolio decision authority without making investment, allocation, lending, or portfolio-management recommendations."]
      : []),
    ...(scoreBreakdown.crisisDecisionAuthorityScore < 58 ? ["Review crisis-response decision authority and prepare human-reviewed continuity decision checkpoints."] : []),
    ...(scoreBreakdown.strategicGovernanceScore < 58 ? ["Review strategic decision governance and clarify review forums for major decisions."] : []),
    ...(scoreBreakdown.institutionalHierarchyMaturityScore < 58 ? ["Review institutional decision hierarchy maturity and identify authority clarity gaps."] : []),
    "Keep decision-rights improvements human-reviewed; this module does not provide legal, HR, ownership, tax, lending, investment, portfolio-management, autonomous approval, autonomous management, or market-prediction advice.",
  ]);
}

function buildExplanation(params: { scoreBreakdown: EnterpriseDecisionRightsScoreBreakdown; decisionGovernanceLevel: DecisionGovernanceLevel }) {
  const scoreBreakdown = params.scoreBreakdown;

  return [
    `Decision governance level is ${params.decisionGovernanceLevel} with an overall decision rights score of ${scoreBreakdown.overallDecisionRightsScore}/100.`,
    `Authority clarity is ${scoreBreakdown.authorityClarityScore}/100, approval rights clarity is ${scoreBreakdown.approvalRightsScore}/100, and escalation authority is ${scoreBreakdown.escalationAuthorityScore}/100.`,
    "Decision authority, approval rights, escalation authority, governance authority, override discipline, operational decision ownership, portfolio authority, crisis authority, strategic governance, and institutional hierarchy maturity were scored deterministically from structured inputs and optional read-only profile fallbacks.",
    "This output identifies decision-rights/governance clarity risks only and does not provide legal, HR, ownership, tax, lending, investment, portfolio-management, autonomous approval, autonomous management, or market-prediction advice.",
  ];
}

function buildTrace(scoreBreakdown: EnterpriseDecisionRightsScoreBreakdown, missingData: string[]) {
  return [
    "Normalized all numeric scores to a deterministic 0-100 scale.",
    "Derived optional fallback scores only from supplied in-memory intelligence profiles.",
    `Computed enterprise decision rights from authority clarity (${scoreBreakdown.authorityClarityScore}), approval rights (${scoreBreakdown.approvalRightsScore}), escalation authority (${scoreBreakdown.escalationAuthorityScore}), governance authority (${scoreBreakdown.governanceAuthorityScore}), override discipline (${scoreBreakdown.overrideDisciplineScore}), operational ownership (${scoreBreakdown.operationalDecisionOwnershipScore}), portfolio authority (${scoreBreakdown.portfolioDecisionAuthorityScore}), crisis authority (${scoreBreakdown.crisisDecisionAuthorityScore}), strategic governance (${scoreBreakdown.strategicGovernanceScore}), and hierarchy maturity (${scoreBreakdown.institutionalHierarchyMaturityScore}).`,
    missingData.length > 0 ? `Missing inputs flagged for human verification: ${missingData.join(", ")}.` : "No required structured inputs were missing.",
    "No outreach, SMS, email, Twilio, database writes, schema changes, workflow mutation, protected-class logic, demographic targeting, external APIs, scraping, approval automation, autonomous execution, or autonomous management decisions were used.",
  ];
}

function buildAssumptions(input: EnterpriseDecisionRightsInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0 ? ["Missing enterprise decision rights inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."] : []),
    "Enterprise decision rights intelligence is deterministic, explainable, read-only, compliance-first, and designed for human review before any execution.",
    "This engine evaluates decision authority clarity, approval rights, escalation authority, governance authority, override discipline, operational ownership, portfolio authority, crisis authority, strategic governance, and institutional hierarchy maturity only.",
    "No outreach, SMS, email sending, Twilio, autonomous execution, autonomous management decisions, approval automation, DB writes, schema changes, workflow mutations, external APIs, scraping, demographic data, or protected-class data were used.",
    "This is not legal advice, HR advice, ownership advice, tax advice, lending advice, investment advice, portfolio-management advice, autonomous approval, autonomous management, or market prediction.",
  ]);
}

export function analyzeEnterpriseDecisionRightsIntelligence(input: EnterpriseDecisionRightsInput = {}): EnterpriseDecisionRightsResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const decisionGovernanceLevel = classifyDecisionGovernance(scoreBreakdown.overallDecisionRightsScore);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallDecisionRightsScore: scoreBreakdown.overallDecisionRightsScore,
    decisionGovernanceLevel,
    authorityClarityScore: scoreBreakdown.authorityClarityScore,
    approvalRightsScore: scoreBreakdown.approvalRightsScore,
    escalationAuthorityScore: scoreBreakdown.escalationAuthorityScore,
    governanceAuthorityScore: scoreBreakdown.governanceAuthorityScore,
    overrideDisciplineScore: scoreBreakdown.overrideDisciplineScore,
    operationalDecisionOwnershipScore: scoreBreakdown.operationalDecisionOwnershipScore,
    portfolioDecisionAuthorityScore: scoreBreakdown.portfolioDecisionAuthorityScore,
    crisisDecisionAuthorityScore: scoreBreakdown.crisisDecisionAuthorityScore,
    strategicGovernanceScore: scoreBreakdown.strategicGovernanceScore,
    institutionalHierarchyMaturityScore: scoreBreakdown.institutionalHierarchyMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown, missingData),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    authorityWarnings: buildAuthorityWarnings(scoreBreakdown, missingData),
    explanation: buildExplanation({ scoreBreakdown, decisionGovernanceLevel }),
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

export const getEnterpriseDecisionRightsIntelligence = analyzeEnterpriseDecisionRightsIntelligence;
