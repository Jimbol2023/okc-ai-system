import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type StrategicAlignmentLevel = "misaligned" | "fragmented" | "developing" | "aligned" | "institutional";

export type EnterpriseStrategicAlignmentInput = {
  operationsAlignmentScore?: number;
  acquisitionAlignmentScore?: number;
  riskAlignmentScore?: number;
  capitalAlignmentScore?: number;
  expansionAlignmentScore?: number;
  portfolioAlignmentScore?: number;
  governanceAlignmentScore?: number;
  brandTrustAlignmentScore?: number;
  continuityAlignmentScore?: number;
  longHorizonAlignmentScore?: number;
  enterpriseStrategicDoctrineProfile?: unknown;
  enterpriseStrategicMemoryProfile?: unknown;
  enterpriseDecisionAuditProfile?: unknown;
  enterpriseInstitutionalLearningProfile?: unknown;
  enterpriseExpansionGovernanceProfile?: unknown;
  operationalPlaybookProfile?: unknown;
  operationalQaProcessDriftProfile?: unknown;
  enterpriseOperatingRhythmProfile?: unknown;
  strategicTreasuryProfile?: unknown;
  portfolioRiskBalancingProfile?: unknown;
  institutionalRelationshipProfile?: unknown;
  longHorizonWealthPreservationProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseStrategicAlignmentScoreBreakdown = CorridorScoreBreakdown & {
  overallAlignmentScore: number;
  operationsAlignmentScore: number;
  acquisitionAlignmentScore: number;
  riskAlignmentScore: number;
  capitalAlignmentScore: number;
  expansionAlignmentScore: number;
  portfolioAlignmentScore: number;
  governanceAlignmentScore: number;
  brandTrustAlignmentScore: number;
  continuityAlignmentScore: number;
  longHorizonAlignmentScore: number;
};

export type EnterpriseStrategicAlignmentResult = {
  overallAlignmentScore: number;
  strategicAlignmentLevel: StrategicAlignmentLevel;
  operationsAlignmentScore: number;
  acquisitionAlignmentScore: number;
  riskAlignmentScore: number;
  capitalAlignmentScore: number;
  expansionAlignmentScore: number;
  portfolioAlignmentScore: number;
  governanceAlignmentScore: number;
  brandTrustAlignmentScore: number;
  continuityAlignmentScore: number;
  longHorizonAlignmentScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseStrategicAlignmentScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  alignmentWarnings: string[];
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
    autonomousAlignmentActions: false;
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

const REQUIRED_INPUTS: Array<keyof EnterpriseStrategicAlignmentInput> = [
  "operationsAlignmentScore",
  "acquisitionAlignmentScore",
  "riskAlignmentScore",
  "capitalAlignmentScore",
  "expansionAlignmentScore",
  "portfolioAlignmentScore",
  "governanceAlignmentScore",
  "brandTrustAlignmentScore",
  "continuityAlignmentScore",
  "longHorizonAlignmentScore",
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

function hasFallbackForInput(input: EnterpriseStrategicAlignmentInput, key: keyof EnterpriseStrategicAlignmentInput) {
  const doctrineProfile = input.enterpriseStrategicDoctrineProfile;
  const memoryProfile = input.enterpriseStrategicMemoryProfile;
  const auditProfile = input.enterpriseDecisionAuditProfile;
  const expansionGovernanceProfile = input.enterpriseExpansionGovernanceProfile;
  const playbookProfile = input.operationalPlaybookProfile;
  const qaProfile = input.operationalQaProcessDriftProfile;
  const treasuryProfile = input.strategicTreasuryProfile;
  const portfolioProfile = input.portfolioRiskBalancingProfile;
  const relationshipProfile = input.institutionalRelationshipProfile;
  const preservationProfile = input.longHorizonWealthPreservationProfile;

  const fallbackPaths: Partial<Record<keyof EnterpriseStrategicAlignmentInput, boolean>> = {
    operationsAlignmentScore:
      hasProfileScore(doctrineProfile, ["operatingPhilosophyScore", "overallDoctrineScore"]) ||
      hasProfileScore(playbookProfile, ["overallPlaybookReadinessScore"]) ||
      hasProfileScore(qaProfile, ["overallOperationalConsistencyScore"]),
    acquisitionAlignmentScore:
      hasProfileScore(doctrineProfile, ["acquisitionDoctrineScore"]) ||
      hasProfileScore(playbookProfile, ["acquisitionPlaybookScore"]) ||
      hasProfileScore(auditProfile, ["strategicAlignmentScore"]),
    riskAlignmentScore:
      hasProfileScore(doctrineProfile, ["riskDoctrineScore"]) ||
      hasProfileScore(portfolioProfile, ["riskBalanceQuality", "riskAdjustedPortfolioQuality"]) ||
      hasProfileScore(preservationProfile, ["riskAdjustedPreservationQuality"]),
    capitalAlignmentScore:
      hasProfileScore(doctrineProfile, ["capitalDisciplineScore"]) ||
      hasProfileScore(treasuryProfile, ["strategicTreasuryDurability", "liquidityDurability"]) ||
      hasProfileScore(expansionGovernanceProfile, ["approvalProcessDurability"]),
    expansionAlignmentScore:
      hasProfileScore(doctrineProfile, ["expansionDoctrineScore"]) ||
      hasProfileScore(expansionGovernanceProfile, ["expansionControlQuality", "expansionOversightQuality"]),
    portfolioAlignmentScore:
      hasProfileScore(doctrineProfile, ["riskDoctrineScore", "longHorizonDoctrineScore"]) ||
      hasProfileScore(portfolioProfile, ["riskAdjustedPortfolioQuality", "diversificationEffectiveness"]),
    governanceAlignmentScore:
      hasProfileScore(doctrineProfile, ["governanceDoctrineScore"]) ||
      hasProfileScore(auditProfile, ["governanceAlignmentScore"]) ||
      hasProfileScore(expansionGovernanceProfile, ["humanReviewGovernanceAlignment"]),
    brandTrustAlignmentScore:
      hasProfileScore(doctrineProfile, ["brandTrustDoctrineScore"]) ||
      hasProfileScore(relationshipProfile, ["institutionalTrustReadiness", "communicationStability"]),
    continuityAlignmentScore:
      hasProfileScore(doctrineProfile, ["doctrineTransferabilityScore", "longHorizonDoctrineScore"]) ||
      hasProfileScore(memoryProfile, ["continuityMemoryScore", "enterpriseMemoryMaturityScore"]),
    longHorizonAlignmentScore:
      hasProfileScore(doctrineProfile, ["longHorizonDoctrineScore", "overallDoctrineScore"]) ||
      hasProfileScore(memoryProfile, ["longHorizonContinuityScore"]) ||
      hasProfileScore(preservationProfile, ["longHorizonPreservationQuality"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: EnterpriseStrategicAlignmentInput) {
  const labels: Record<keyof EnterpriseStrategicAlignmentInput, string> = {
    operationsAlignmentScore: "operations-to-doctrine alignment score",
    acquisitionAlignmentScore: "acquisition-to-doctrine alignment score",
    riskAlignmentScore: "risk posture alignment score",
    capitalAlignmentScore: "capital discipline alignment score",
    expansionAlignmentScore: "expansion alignment score",
    portfolioAlignmentScore: "portfolio strategy alignment score",
    governanceAlignmentScore: "governance behavior alignment score",
    brandTrustAlignmentScore: "brand/trust alignment score",
    continuityAlignmentScore: "continuity alignment score",
    longHorizonAlignmentScore: "long-horizon strategic alignment score",
    enterpriseStrategicDoctrineProfile: "enterprise strategic doctrine profile",
    enterpriseStrategicMemoryProfile: "enterprise strategic memory profile",
    enterpriseDecisionAuditProfile: "enterprise decision audit profile",
    enterpriseInstitutionalLearningProfile: "enterprise institutional learning profile",
    enterpriseExpansionGovernanceProfile: "enterprise expansion governance profile",
    operationalPlaybookProfile: "operational playbook profile",
    operationalQaProcessDriftProfile: "operational QA/process drift profile",
    enterpriseOperatingRhythmProfile: "enterprise operating rhythm profile",
    strategicTreasuryProfile: "strategic treasury profile",
    portfolioRiskBalancingProfile: "portfolio risk balancing profile",
    institutionalRelationshipProfile: "institutional relationship profile",
    longHorizonWealthPreservationProfile: "long-horizon wealth preservation profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: EnterpriseStrategicAlignmentInput): EnterpriseStrategicAlignmentScoreBreakdown {
  const doctrineProfile = input.enterpriseStrategicDoctrineProfile;
  const memoryProfile = input.enterpriseStrategicMemoryProfile;
  const auditProfile = input.enterpriseDecisionAuditProfile;
  const learningProfile = input.enterpriseInstitutionalLearningProfile;
  const expansionGovernanceProfile = input.enterpriseExpansionGovernanceProfile;
  const playbookProfile = input.operationalPlaybookProfile;
  const qaProfile = input.operationalQaProcessDriftProfile;
  const rhythmProfile = input.enterpriseOperatingRhythmProfile;
  const treasuryProfile = input.strategicTreasuryProfile;
  const portfolioProfile = input.portfolioRiskBalancingProfile;
  const relationshipProfile = input.institutionalRelationshipProfile;
  const preservationProfile = input.longHorizonWealthPreservationProfile;
  const operationsAlignmentScore = getScore(
    input.operationsAlignmentScore,
    weightedAverage([
      [extractProfileScore(doctrineProfile, ["operatingPhilosophyScore", "scoreBreakdown.operatingPhilosophyScore"], 54), 0.18],
      [extractProfileScore(doctrineProfile, ["overallDoctrineScore", "scoreBreakdown.overallDoctrineScore"], 54), 0.14],
      [extractProfileScore(playbookProfile, ["overallPlaybookReadinessScore", "scoreBreakdown.overallPlaybookReadinessScore"], 54), 0.16],
      [extractProfileScore(qaProfile, ["overallOperationalConsistencyScore", "scoreBreakdown.overallOperationalConsistencyScore"], 54), 0.16],
      [extractProfileScore(rhythmProfile, ["operationalTempoScore", "scoreBreakdown.operationalTempoScore"], 54), 0.12],
      [extractProfileScore(learningProfile, ["processImprovementLearningScore"], 54), 0.12],
      [extractProfileScore(auditProfile, ["strategicAlignmentScore"], 54), 0.12],
    ]),
  );
  const acquisitionAlignmentScore = getScore(
    input.acquisitionAlignmentScore,
    weightedAverage([
      [extractProfileScore(doctrineProfile, ["acquisitionDoctrineScore", "scoreBreakdown.acquisitionDoctrineScore"], 54), 0.22],
      [extractProfileScore(playbookProfile, ["acquisitionPlaybookScore", "scoreBreakdown.acquisitionPlaybookScore"], 54), 0.16],
      [extractProfileScore(auditProfile, ["strategicAlignmentScore", "scoreBreakdown.strategicAlignmentScore"], 54), 0.16],
      [extractProfileScore(learningProfile, ["dealOutcomeLearningScore"], 54), 0.12],
      [operationsAlignmentScore, 0.1],
      [extractProfileScore(expansionGovernanceProfile, ["approvalProcessDurability"], 54), 0.12],
      [extractProfileScore(memoryProfile, ["strategicContextPreservationScore"], 54), 0.12],
    ]),
  );
  const riskAlignmentScore = getScore(
    input.riskAlignmentScore,
    weightedAverage([
      [extractProfileScore(doctrineProfile, ["riskDoctrineScore", "scoreBreakdown.riskDoctrineScore"], 54), 0.22],
      [extractProfileScore(portfolioProfile, ["riskBalanceQuality", "scoreBreakdown.riskBalanceQualityScore"], 54), 0.16],
      [extractProfileScore(portfolioProfile, ["riskAdjustedPortfolioQuality", "scoreBreakdown.riskAdjustedPortfolioQualityScore"], 54), 0.14],
      [extractProfileScore(preservationProfile, ["riskAdjustedPreservationQuality"], 54), 0.14],
      [extractProfileScore(auditProfile, ["governanceAlignmentScore"], 54), 0.1],
      [extractProfileScore(expansionGovernanceProfile, ["defensiveGovernanceResilience"], 54), 0.1],
      [extractProfileScore(doctrineProfile, ["strategicPrincipleScore"], 54), 0.08],
      [extractProfileScore(memoryProfile, ["portfolioStrategyMemoryScore"], 54), 0.06],
    ]),
  );
  const capitalAlignmentScore = getScore(
    input.capitalAlignmentScore,
    weightedAverage([
      [extractProfileScore(doctrineProfile, ["capitalDisciplineScore", "scoreBreakdown.capitalDisciplineScore"], 54), 0.22],
      [extractProfileScore(treasuryProfile, ["strategicTreasuryDurability", "scoreBreakdown.strategicTreasuryDurability"], 54), 0.18],
      [extractProfileScore(treasuryProfile, ["liquidityDurability", "scoreBreakdown.liquidityDurabilityScore"], 54), 0.14],
      [extractProfileScore(expansionGovernanceProfile, ["approvalProcessDurability"], 54), 0.12],
      [riskAlignmentScore, 0.12],
      [extractProfileScore(preservationProfile, ["longHorizonPreservationQuality"], 54), 0.08],
      [extractProfileScore(auditProfile, ["approvalConsistencyScore"], 54), 0.08],
      [extractProfileScore(doctrineProfile, ["longHorizonDoctrineScore"], 54), 0.06],
    ]),
  );
  const expansionAlignmentScore = getScore(
    input.expansionAlignmentScore,
    weightedAverage([
      [extractProfileScore(doctrineProfile, ["expansionDoctrineScore", "scoreBreakdown.expansionDoctrineScore"], 54), 0.22],
      [extractProfileScore(expansionGovernanceProfile, ["expansionControlQuality", "scoreBreakdown.expansionControlQualityScore"], 54), 0.18],
      [extractProfileScore(expansionGovernanceProfile, ["expansionOversightQuality", "scoreBreakdown.expansionOversightQualityScore"], 54), 0.16],
      [acquisitionAlignmentScore, 0.12],
      [capitalAlignmentScore, 0.1],
      [riskAlignmentScore, 0.08],
      [extractProfileScore(auditProfile, ["strategicAlignmentScore"], 54), 0.08],
      [extractProfileScore(memoryProfile, ["longHorizonContinuityScore"], 54), 0.06],
    ]),
  );
  const portfolioAlignmentScore = getScore(
    input.portfolioAlignmentScore,
    weightedAverage([
      [extractProfileScore(portfolioProfile, ["riskAdjustedPortfolioQuality", "scoreBreakdown.riskAdjustedPortfolioQualityScore"], 54), 0.18],
      [extractProfileScore(portfolioProfile, ["diversificationEffectiveness", "scoreBreakdown.diversificationEffectivenessScore"], 54), 0.14],
      [extractProfileScore(doctrineProfile, ["riskDoctrineScore"], 54), 0.14],
      [extractProfileScore(doctrineProfile, ["longHorizonDoctrineScore"], 54), 0.12],
      [riskAlignmentScore, 0.12],
      [capitalAlignmentScore, 0.1],
      [extractProfileScore(memoryProfile, ["portfolioStrategyMemoryScore"], 54), 0.1],
      [extractProfileScore(auditProfile, ["strategicAlignmentScore"], 54), 0.1],
    ]),
  );
  const governanceAlignmentScore = getScore(
    input.governanceAlignmentScore,
    weightedAverage([
      [extractProfileScore(doctrineProfile, ["governanceDoctrineScore", "scoreBreakdown.governanceDoctrineScore"], 54), 0.22],
      [extractProfileScore(auditProfile, ["governanceAlignmentScore", "scoreBreakdown.governanceAlignmentScore"], 54), 0.18],
      [extractProfileScore(expansionGovernanceProfile, ["humanReviewGovernanceAlignment", "scoreBreakdown.humanReviewGovernanceAlignmentScore"], 54), 0.16],
      [extractProfileScore(auditProfile, ["reviewDisciplineScore"], 54), 0.12],
      [extractProfileScore(rhythmProfile, ["quarterlyGovernanceScore"], 54), 0.1],
      [extractProfileScore(memoryProfile, ["governanceMemoryDurabilityScore"], 54), 0.08],
      [operationsAlignmentScore, 0.08],
      [riskAlignmentScore, 0.06],
    ]),
  );
  const brandTrustAlignmentScore = getScore(
    input.brandTrustAlignmentScore,
    weightedAverage([
      [extractProfileScore(doctrineProfile, ["brandTrustDoctrineScore", "scoreBreakdown.brandTrustDoctrineScore"], 54), 0.22],
      [extractProfileScore(relationshipProfile, ["institutionalTrustReadiness", "scoreBreakdown.institutionalTrustReadinessScore"], 54), 0.18],
      [extractProfileScore(relationshipProfile, ["communicationStability", "scoreBreakdown.communicationStabilityScore"], 54), 0.14],
      [extractProfileScore(learningProfile, ["responseLearningScore"], 54), 0.1],
      [governanceAlignmentScore, 0.1],
      [operationsAlignmentScore, 0.08],
      [extractProfileScore(memoryProfile, ["strategicContextPreservationScore"], 54), 0.08],
      [extractProfileScore(doctrineProfile, ["strategicPrincipleScore"], 54), 0.1],
    ]),
  );
  const continuityAlignmentScore = getScore(
    input.continuityAlignmentScore,
    weightedAverage([
      [extractProfileScore(doctrineProfile, ["doctrineTransferabilityScore", "scoreBreakdown.doctrineTransferabilityScore"], 54), 0.18],
      [extractProfileScore(doctrineProfile, ["longHorizonDoctrineScore", "scoreBreakdown.longHorizonDoctrineScore"], 54), 0.16],
      [extractProfileScore(memoryProfile, ["continuityMemoryScore", "scoreBreakdown.continuityMemoryScore"], 54), 0.14],
      [extractProfileScore(memoryProfile, ["enterpriseMemoryMaturityScore"], 54), 0.12],
      [governanceAlignmentScore, 0.1],
      [operationsAlignmentScore, 0.1],
      [extractProfileScore(learningProfile, ["memoryReinforcementScore"], 54), 0.1],
      [extractProfileScore(preservationProfile, ["institutionalContinuityDurability"], 54), 0.1],
    ]),
  );
  const longHorizonAlignmentScore = getScore(
    input.longHorizonAlignmentScore,
    weightedAverage([
      [extractProfileScore(doctrineProfile, ["longHorizonDoctrineScore", "scoreBreakdown.longHorizonDoctrineScore"], 54), 0.2],
      [extractProfileScore(memoryProfile, ["longHorizonContinuityScore", "scoreBreakdown.longHorizonContinuityScore"], 54), 0.16],
      [extractProfileScore(preservationProfile, ["longHorizonPreservationQuality", "scoreBreakdown.longHorizonPreservationQualityScore"], 54), 0.16],
      [continuityAlignmentScore, 0.12],
      [capitalAlignmentScore, 0.1],
      [governanceAlignmentScore, 0.1],
      [portfolioAlignmentScore, 0.08],
      [extractProfileScore(doctrineProfile, ["overallDoctrineScore"], 54), 0.08],
    ]),
  );
  const overallAlignmentScore = weightedAverage([
    [operationsAlignmentScore, 0.11],
    [acquisitionAlignmentScore, 0.1],
    [riskAlignmentScore, 0.11],
    [capitalAlignmentScore, 0.1],
    [expansionAlignmentScore, 0.1],
    [portfolioAlignmentScore, 0.1],
    [governanceAlignmentScore, 0.12],
    [brandTrustAlignmentScore, 0.08],
    [continuityAlignmentScore, 0.09],
    [longHorizonAlignmentScore, 0.09],
  ]);

  return {
    connectivityScore: brandTrustAlignmentScore,
    durabilityScore: overallAlignmentScore,
    expansionScore: expansionAlignmentScore,
    institutionalScore: longHorizonAlignmentScore,
    logisticsScore: operationsAlignmentScore,
    luxuryScore: acquisitionAlignmentScore,
    developmentScore: continuityAlignmentScore,
    overallAlignmentScore,
    operationsAlignmentScore,
    acquisitionAlignmentScore,
    riskAlignmentScore,
    capitalAlignmentScore,
    expansionAlignmentScore,
    portfolioAlignmentScore,
    governanceAlignmentScore,
    brandTrustAlignmentScore,
    continuityAlignmentScore,
    longHorizonAlignmentScore,
  };
}

function classifyStrategicAlignment(score: number): StrategicAlignmentLevel {
  if (score >= 82) return "institutional";
  if (score >= 68) return "aligned";
  if (score >= 54) return "developing";
  if (score >= 40) return "fragmented";

  return "misaligned";
}

function buildWarnings(scoreBreakdown: EnterpriseStrategicAlignmentScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "STRATEGIC_ALIGNMENT_DATA_INCOMPLETE",
            severity: missingData.length >= 5 ? "high" : "medium",
            message: "Enterprise strategic alignment assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.overallAlignmentScore < 42
      ? [
          createCorridorWarning({
            code: "STRATEGIC_ALIGNMENT_MISALIGNED",
            severity: "high",
            message: "Overall strategic alignment appears misaligned under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.governanceAlignmentScore < 45
      ? [
          createCorridorWarning({
            code: "GOVERNANCE_ALIGNMENT_WEAK",
            severity: "medium",
            message: "Governance behavior alignment is weak and requires human review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.capitalAlignmentScore < 45
      ? [
          createCorridorWarning({
            code: "CAPITAL_ALIGNMENT_WEAK",
            severity: "medium",
            message: "Capital discipline alignment is weak; no lending, investment, allocation, or portfolio-management advice is provided.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
  ];
}

function buildAlignmentWarnings(scoreBreakdown: EnterpriseStrategicAlignmentScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.operationsAlignmentScore < 55 ? ["Operations may be drifting away from documented doctrine."] : []),
    ...(scoreBreakdown.acquisitionAlignmentScore < 55 ? ["Acquisition behavior may be under-aligned with acquisition doctrine."] : []),
    ...(scoreBreakdown.riskAlignmentScore < 55 ? ["Risk posture may be under-aligned with risk doctrine."] : []),
    ...(scoreBreakdown.capitalAlignmentScore < 55
      ? ["Capital discipline may be under-aligned with doctrine; no lending, investment, allocation, or portfolio-management guidance is produced."]
      : []),
    ...(scoreBreakdown.expansionAlignmentScore < 55 ? ["Expansion decisions may be under-aligned with expansion doctrine."] : []),
    ...(scoreBreakdown.portfolioAlignmentScore < 55
      ? ["Portfolio direction may be under-aligned with doctrine; no investment or portfolio-management advice is produced."]
      : []),
    ...(scoreBreakdown.governanceAlignmentScore < 55 ? ["Governance behavior may be under-aligned with governance doctrine."] : []),
    ...(scoreBreakdown.brandTrustAlignmentScore < 55 ? ["Brand/trust behavior may be under-aligned with trust standards; no outreach automation is triggered."] : []),
    ...(scoreBreakdown.continuityAlignmentScore < 55 ? ["Continuity practices may be under-aligned with doctrine transferability expectations."] : []),
    ...(scoreBreakdown.longHorizonAlignmentScore < 55 ? ["Long-horizon strategic alignment may be underdeveloped."] : []),
    ...(missingData.length > 0 ? ["Alignment warnings require human validation because required structured inputs are incomplete."] : []),
  ]);
}

function buildReusableInfrastructureNotes(input: EnterpriseStrategicAlignmentInput, missingData: string[]) {
  return unique([
    "Reuses shared corridor score normalization, warning creation, confidence scoring, missing-data handling, and read-only score breakdown conventions.",
    "Consumes optional in-memory intelligence profiles only; no persistence, external API calls, scraping, routing, orchestration, or automation execution is introduced.",
    ...(input.enterpriseStrategicDoctrineProfile ? ["Enterprise strategic doctrine profile supplied as reusable alignment baseline."] : []),
    ...(input.enterpriseDecisionAuditProfile ? ["Enterprise decision audit profile supplied as reusable governance alignment context."] : []),
    ...(input.operationalQaProcessDriftProfile ? ["Operational QA/process drift profile supplied as reusable operational alignment context."] : []),
    ...(input.strategicTreasuryProfile ? ["Strategic treasury profile supplied as read-only capital alignment context without treasury management behavior."] : []),
    ...(missingData.length > 0 ? ["Reusable profile coverage is incomplete, so conservative deterministic defaults and human verification remain required."] : []),
  ]);
}

function buildKeyRisks(scoreBreakdown: EnterpriseStrategicAlignmentScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.overallAlignmentScore < 50 ? ["Overall enterprise strategic alignment is weak."] : []),
    ...(scoreBreakdown.operationsAlignmentScore < 50 ? ["Operations-to-doctrine alignment is weak."] : []),
    ...(scoreBreakdown.acquisitionAlignmentScore < 50 ? ["Acquisition-to-doctrine alignment is weak."] : []),
    ...(scoreBreakdown.riskAlignmentScore < 50 ? ["Risk posture alignment is weak."] : []),
    ...(scoreBreakdown.capitalAlignmentScore < 50 ? ["Capital discipline alignment is weak."] : []),
    ...(scoreBreakdown.expansionAlignmentScore < 50 ? ["Expansion alignment is weak."] : []),
    ...(scoreBreakdown.portfolioAlignmentScore < 50 ? ["Portfolio strategy alignment is weak."] : []),
    ...(scoreBreakdown.governanceAlignmentScore < 50 ? ["Governance behavior alignment is weak."] : []),
    ...(scoreBreakdown.brandTrustAlignmentScore < 50 ? ["Brand/trust alignment is weak."] : []),
    ...(scoreBreakdown.continuityAlignmentScore < 50 ? ["Continuity alignment is weak."] : []),
    ...(scoreBreakdown.longHorizonAlignmentScore < 50 ? ["Long-horizon strategic alignment is weak."] : []),
    ...(missingData.length > 0 ? `Missing data reduces confidence: ${missingData.slice(0, 4).join(", ")}.` : []),
  ]);
}

function buildStrengths(scoreBreakdown: EnterpriseStrategicAlignmentScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.overallAlignmentScore >= 70 ? ["Overall enterprise strategic alignment is strong."] : []),
    ...(scoreBreakdown.operationsAlignmentScore >= 70 ? ["Operations-to-doctrine alignment is strong."] : []),
    ...(scoreBreakdown.acquisitionAlignmentScore >= 70 ? ["Acquisition-to-doctrine alignment is strong."] : []),
    ...(scoreBreakdown.riskAlignmentScore >= 70 ? ["Risk posture alignment is strong."] : []),
    ...(scoreBreakdown.capitalAlignmentScore >= 70 ? ["Capital discipline alignment is strong."] : []),
    ...(scoreBreakdown.expansionAlignmentScore >= 70 ? ["Expansion alignment is strong."] : []),
    ...(scoreBreakdown.portfolioAlignmentScore >= 70 ? ["Portfolio strategy alignment is strong."] : []),
    ...(scoreBreakdown.governanceAlignmentScore >= 70 ? ["Governance behavior alignment is strong."] : []),
    ...(scoreBreakdown.brandTrustAlignmentScore >= 70 ? ["Brand/trust alignment is strong."] : []),
    ...(scoreBreakdown.continuityAlignmentScore >= 70 ? ["Continuity alignment is strong."] : []),
    ...(scoreBreakdown.longHorizonAlignmentScore >= 70 ? ["Long-horizon strategic alignment is strong."] : []),
  ]);
}

function buildRecommendations(scoreBreakdown: EnterpriseStrategicAlignmentScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.operationsAlignmentScore < 58 ? ["Review operations-to-doctrine alignment and document human-reviewed operating adjustments."] : []),
    ...(scoreBreakdown.acquisitionAlignmentScore < 58
      ? ["Review acquisition-to-doctrine alignment without making investment, lending, allocation, or portfolio-management recommendations."]
      : []),
    ...(scoreBreakdown.riskAlignmentScore < 58
      ? ["Review risk posture alignment without creating investment, lending, insurance, legal, or portfolio-management advice."]
      : []),
    ...(scoreBreakdown.capitalAlignmentScore < 58
      ? ["Review capital discipline alignment without making treasury, banking, lending, investment, allocation, or portfolio-management recommendations."]
      : []),
    ...(scoreBreakdown.expansionAlignmentScore < 58 ? ["Review expansion alignment without autonomous strategy decisions or execution."] : []),
    ...(scoreBreakdown.portfolioAlignmentScore < 58
      ? ["Review portfolio strategy alignment without making investment, allocation, lending, or portfolio-management recommendations."]
      : []),
    ...(scoreBreakdown.governanceAlignmentScore < 58 ? ["Review governance behavior alignment; this is not legal, HR, ownership, or tax advice."] : []),
    ...(scoreBreakdown.brandTrustAlignmentScore < 58
      ? ["Review brand/trust alignment without outreach, SMS, email, Twilio, CRM automation, or relationship manipulation."]
      : []),
    ...(scoreBreakdown.continuityAlignmentScore < 58 ? ["Review continuity alignment and preserve human-reviewed handoff expectations."] : []),
    ...(scoreBreakdown.longHorizonAlignmentScore < 58 ? ["Review long-horizon strategic alignment and preserve durable doctrine context."] : []),
    "Keep strategic-alignment improvements human-reviewed; this module does not provide autonomous strategy decisions, legal, HR, ownership, tax, lending, investment, portfolio-management, treasury-management, or market-prediction advice.",
  ]);
}

function buildExplanation(params: { scoreBreakdown: EnterpriseStrategicAlignmentScoreBreakdown; strategicAlignmentLevel: StrategicAlignmentLevel }) {
  const scoreBreakdown = params.scoreBreakdown;

  return [
    `Strategic alignment level is ${params.strategicAlignmentLevel} with an overall alignment score of ${scoreBreakdown.overallAlignmentScore}/100.`,
    `Operations alignment is ${scoreBreakdown.operationsAlignmentScore}/100, governance alignment is ${scoreBreakdown.governanceAlignmentScore}/100, and long-horizon alignment is ${scoreBreakdown.longHorizonAlignmentScore}/100.`,
    "Operations, acquisitions, risk posture, capital discipline, expansion, portfolio direction, governance behavior, brand/trust standards, continuity, and long-horizon strategy were scored deterministically from structured inputs and optional read-only profile fallbacks.",
    "This output identifies strategic alignment gaps only and does not provide autonomous strategy decisions, legal, HR, ownership, tax, lending, investment, portfolio-management, treasury-management, autonomous optimization, or market-prediction advice.",
  ];
}

function buildTrace(scoreBreakdown: EnterpriseStrategicAlignmentScoreBreakdown, missingData: string[]) {
  return [
    "Normalized all numeric scores to a deterministic 0-100 scale.",
    "Derived optional fallback scores only from supplied in-memory intelligence profiles.",
    `Computed enterprise strategic alignment from operations (${scoreBreakdown.operationsAlignmentScore}), acquisition (${scoreBreakdown.acquisitionAlignmentScore}), risk (${scoreBreakdown.riskAlignmentScore}), capital (${scoreBreakdown.capitalAlignmentScore}), expansion (${scoreBreakdown.expansionAlignmentScore}), portfolio (${scoreBreakdown.portfolioAlignmentScore}), governance (${scoreBreakdown.governanceAlignmentScore}), brand/trust (${scoreBreakdown.brandTrustAlignmentScore}), continuity (${scoreBreakdown.continuityAlignmentScore}), and long-horizon alignment (${scoreBreakdown.longHorizonAlignmentScore}).`,
    missingData.length > 0 ? `Missing inputs flagged for human verification: ${missingData.join(", ")}.` : "No required structured inputs were missing.",
    "No outreach, SMS, email, Twilio, database writes, schema changes, workflow mutation, protected-class logic, demographic targeting, external APIs, scraping, autonomous strategy decisions, autonomous alignment actions, autonomous optimization, autonomous execution, or autonomous management decisions were used.",
  ];
}

function buildAssumptions(input: EnterpriseStrategicAlignmentInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0
      ? ["Missing enterprise strategic alignment inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."]
      : []),
    "Enterprise strategic alignment intelligence is deterministic, explainable, read-only, compliance-first, and designed for human review before any execution.",
    "This engine evaluates whether operations, acquisitions, risk posture, capital discipline, expansion, portfolio direction, governance behavior, brand/trust standards, continuity, and long-horizon strategy align with strategic doctrine only.",
    "No outreach, SMS, email sending, Twilio, autonomous execution, autonomous strategy decisions, autonomous alignment actions, autonomous optimization, autonomous management decisions, DB writes, schema changes, workflow mutations, external APIs, scraping, demographic data, or protected-class data were used.",
    "This is not legal advice, HR advice, ownership advice, tax advice, lending advice, investment advice, portfolio-management advice, treasury management, autonomous strategy, autonomous optimization, autonomous management, or market prediction.",
  ]);
}

export function analyzeEnterpriseStrategicAlignmentIntelligence(
  input: EnterpriseStrategicAlignmentInput = {},
): EnterpriseStrategicAlignmentResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const strategicAlignmentLevel = classifyStrategicAlignment(scoreBreakdown.overallAlignmentScore);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallAlignmentScore: scoreBreakdown.overallAlignmentScore,
    strategicAlignmentLevel,
    operationsAlignmentScore: scoreBreakdown.operationsAlignmentScore,
    acquisitionAlignmentScore: scoreBreakdown.acquisitionAlignmentScore,
    riskAlignmentScore: scoreBreakdown.riskAlignmentScore,
    capitalAlignmentScore: scoreBreakdown.capitalAlignmentScore,
    expansionAlignmentScore: scoreBreakdown.expansionAlignmentScore,
    portfolioAlignmentScore: scoreBreakdown.portfolioAlignmentScore,
    governanceAlignmentScore: scoreBreakdown.governanceAlignmentScore,
    brandTrustAlignmentScore: scoreBreakdown.brandTrustAlignmentScore,
    continuityAlignmentScore: scoreBreakdown.continuityAlignmentScore,
    longHorizonAlignmentScore: scoreBreakdown.longHorizonAlignmentScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown, missingData),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    alignmentWarnings: buildAlignmentWarnings(scoreBreakdown, missingData),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input, missingData),
    explanation: buildExplanation({ scoreBreakdown, strategicAlignmentLevel }),
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
      autonomousAlignmentActions: false,
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

export const getEnterpriseStrategicAlignmentIntelligence = analyzeEnterpriseStrategicAlignmentIntelligence;
