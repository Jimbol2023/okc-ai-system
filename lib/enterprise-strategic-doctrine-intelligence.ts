import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type DoctrineMaturityLevel = "unclear" | "thin" | "developing" | "disciplined" | "institutional";

export type EnterpriseStrategicDoctrineInput = {
  strategicPrincipleScore?: number;
  acquisitionDoctrineScore?: number;
  riskDoctrineScore?: number;
  capitalDisciplineScore?: number;
  governanceDoctrineScore?: number;
  expansionDoctrineScore?: number;
  brandTrustDoctrineScore?: number;
  operatingPhilosophyScore?: number;
  doctrineTransferabilityScore?: number;
  longHorizonDoctrineScore?: number;
  enterpriseStrategicMemoryProfile?: unknown;
  enterpriseInstitutionalLearningProfile?: unknown;
  enterpriseDecisionAuditProfile?: unknown;
  longHorizonWealthPreservationProfile?: unknown;
  enterpriseExpansionGovernanceProfile?: unknown;
  strategicTreasuryProfile?: unknown;
  institutionalRelationshipProfile?: unknown;
  portfolioRiskBalancingProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseStrategicDoctrineScoreBreakdown = CorridorScoreBreakdown & {
  overallDoctrineScore: number;
  strategicPrincipleScore: number;
  acquisitionDoctrineScore: number;
  riskDoctrineScore: number;
  capitalDisciplineScore: number;
  governanceDoctrineScore: number;
  expansionDoctrineScore: number;
  brandTrustDoctrineScore: number;
  operatingPhilosophyScore: number;
  doctrineTransferabilityScore: number;
  longHorizonDoctrineScore: number;
};

export type EnterpriseStrategicDoctrineResult = {
  overallDoctrineScore: number;
  doctrineMaturityLevel: DoctrineMaturityLevel;
  strategicPrincipleScore: number;
  acquisitionDoctrineScore: number;
  riskDoctrineScore: number;
  capitalDisciplineScore: number;
  governanceDoctrineScore: number;
  expansionDoctrineScore: number;
  brandTrustDoctrineScore: number;
  operatingPhilosophyScore: number;
  doctrineTransferabilityScore: number;
  longHorizonDoctrineScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseStrategicDoctrineScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  doctrineWarnings: string[];
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

const REQUIRED_INPUTS: Array<keyof EnterpriseStrategicDoctrineInput> = [
  "strategicPrincipleScore",
  "acquisitionDoctrineScore",
  "riskDoctrineScore",
  "capitalDisciplineScore",
  "governanceDoctrineScore",
  "expansionDoctrineScore",
  "brandTrustDoctrineScore",
  "operatingPhilosophyScore",
  "doctrineTransferabilityScore",
  "longHorizonDoctrineScore",
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

function hasFallbackForInput(input: EnterpriseStrategicDoctrineInput, key: keyof EnterpriseStrategicDoctrineInput) {
  const memoryProfile = input.enterpriseStrategicMemoryProfile;
  const learningProfile = input.enterpriseInstitutionalLearningProfile;
  const auditProfile = input.enterpriseDecisionAuditProfile;
  const preservationProfile = input.longHorizonWealthPreservationProfile;
  const expansionGovernanceProfile = input.enterpriseExpansionGovernanceProfile;
  const treasuryProfile = input.strategicTreasuryProfile;
  const relationshipProfile = input.institutionalRelationshipProfile;
  const portfolioProfile = input.portfolioRiskBalancingProfile;

  const fallbackPaths: Partial<Record<keyof EnterpriseStrategicDoctrineInput, boolean>> = {
    strategicPrincipleScore:
      hasProfileScore(memoryProfile, ["doctrinePreservationScore", "strategicContextPreservationScore"]) ||
      hasProfileScore(preservationProfile, ["strategicPreservationStability"]),
    acquisitionDoctrineScore:
      hasProfileScore(memoryProfile, ["strategicContextPreservationScore"]) ||
      hasProfileScore(expansionGovernanceProfile, ["expansionControlQuality", "approvalProcessDurability"]),
    riskDoctrineScore:
      hasProfileScore(portfolioProfile, ["riskBalanceQuality", "assetExposureBalance", "correlationAdjustedRiskBalance"]) ||
      hasProfileScore(preservationProfile, ["riskAdjustedPreservationQuality"]) ||
      hasProfileScore(expansionGovernanceProfile, ["defensiveGovernanceResilience"]),
    capitalDisciplineScore:
      hasProfileScore(treasuryProfile, ["strategicTreasuryDurability", "liquidityDurability", "reserveResilienceQuality"]) ||
      hasProfileScore(expansionGovernanceProfile, ["approvalProcessDurability"]),
    governanceDoctrineScore:
      hasProfileScore(expansionGovernanceProfile, ["humanReviewGovernanceAlignment", "governanceDurability"]) ||
      hasProfileScore(auditProfile, ["governanceAlignmentScore"]),
    expansionDoctrineScore:
      hasProfileScore(expansionGovernanceProfile, ["expansionControlQuality", "expansionOversightQuality"]) ||
      hasProfileScore(memoryProfile, ["longHorizonContinuityScore"]),
    brandTrustDoctrineScore:
      hasProfileScore(relationshipProfile, ["institutionalTrustReadiness", "communicationStability"]) ||
      hasProfileScore(memoryProfile, ["strategicContextPreservationScore"]),
    operatingPhilosophyScore:
      hasProfileScore(memoryProfile, ["doctrinePreservationScore", "enterpriseMemoryMaturityScore"]) ||
      hasProfileScore(learningProfile, ["continuousLearningMaturityScore"]),
    doctrineTransferabilityScore:
      hasProfileScore(memoryProfile, ["enterpriseMemoryMaturityScore", "institutionalLessonRetentionScore"]) ||
      hasProfileScore(learningProfile, ["memoryReinforcementScore"]),
    longHorizonDoctrineScore:
      hasProfileScore(memoryProfile, ["longHorizonContinuityScore"]) ||
      hasProfileScore(preservationProfile, ["longHorizonPreservationQuality"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: EnterpriseStrategicDoctrineInput) {
  const labels: Record<keyof EnterpriseStrategicDoctrineInput, string> = {
    strategicPrincipleScore: "strategic principle clarity score",
    acquisitionDoctrineScore: "acquisition doctrine clarity score",
    riskDoctrineScore: "risk doctrine maturity score",
    capitalDisciplineScore: "capital discipline doctrine score",
    governanceDoctrineScore: "governance doctrine clarity score",
    expansionDoctrineScore: "expansion doctrine maturity score",
    brandTrustDoctrineScore: "brand/trust doctrine clarity score",
    operatingPhilosophyScore: "operating philosophy consistency score",
    doctrineTransferabilityScore: "doctrine transferability score",
    longHorizonDoctrineScore: "long-horizon doctrine maturity score",
    enterpriseStrategicMemoryProfile: "enterprise strategic memory profile",
    enterpriseInstitutionalLearningProfile: "enterprise institutional learning profile",
    enterpriseDecisionAuditProfile: "enterprise decision audit profile",
    longHorizonWealthPreservationProfile: "long-horizon wealth preservation profile",
    enterpriseExpansionGovernanceProfile: "enterprise expansion governance profile",
    strategicTreasuryProfile: "strategic treasury profile",
    institutionalRelationshipProfile: "institutional relationship profile",
    portfolioRiskBalancingProfile: "portfolio risk balancing profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: EnterpriseStrategicDoctrineInput): EnterpriseStrategicDoctrineScoreBreakdown {
  const memoryProfile = input.enterpriseStrategicMemoryProfile;
  const learningProfile = input.enterpriseInstitutionalLearningProfile;
  const auditProfile = input.enterpriseDecisionAuditProfile;
  const preservationProfile = input.longHorizonWealthPreservationProfile;
  const expansionGovernanceProfile = input.enterpriseExpansionGovernanceProfile;
  const treasuryProfile = input.strategicTreasuryProfile;
  const relationshipProfile = input.institutionalRelationshipProfile;
  const portfolioProfile = input.portfolioRiskBalancingProfile;
  const strategicPrincipleScore = getScore(
    input.strategicPrincipleScore,
    weightedAverage([
      [extractProfileScore(memoryProfile, ["doctrinePreservationScore", "scoreBreakdown.doctrinePreservationScore"], 54), 0.28],
      [extractProfileScore(memoryProfile, ["strategicContextPreservationScore", "scoreBreakdown.strategicContextPreservationScore"], 54), 0.2],
      [extractProfileScore(preservationProfile, ["strategicPreservationStability", "scoreBreakdown.strategicPreservationStabilityScore"], 54), 0.18],
      [extractProfileScore(auditProfile, ["strategicAlignmentScore", "scoreBreakdown.strategicAlignmentScore"], 54), 0.14],
      [extractProfileScore(learningProfile, ["governanceLearningScore"], 54), 0.1],
      [extractProfileScore(memoryProfile, ["enterpriseMemoryMaturityScore"], 54), 0.1],
    ]),
  );
  const acquisitionDoctrineScore = getScore(
    input.acquisitionDoctrineScore,
    weightedAverage([
      [extractProfileScore(memoryProfile, ["strategicContextPreservationScore", "scoreBreakdown.strategicContextPreservationScore"], 54), 0.18],
      [extractProfileScore(expansionGovernanceProfile, ["expansionControlQuality", "scoreBreakdown.expansionControlQualityScore"], 54), 0.18],
      [extractProfileScore(expansionGovernanceProfile, ["approvalProcessDurability", "scoreBreakdown.approvalProcessDurabilityScore"], 54), 0.16],
      [extractProfileScore(auditProfile, ["approvalConsistencyScore"], 54), 0.14],
      [strategicPrincipleScore, 0.12],
      [extractProfileScore(learningProfile, ["dealOutcomeLearningScore"], 54), 0.12],
      [extractProfileScore(memoryProfile, ["historicalDecisionRetentionScore"], 54), 0.1],
    ]),
  );
  const riskDoctrineScore = getScore(
    input.riskDoctrineScore,
    weightedAverage([
      [extractProfileScore(portfolioProfile, ["riskBalanceQuality", "scoreBreakdown.riskBalanceQualityScore"], 54), 0.18],
      [extractProfileScore(portfolioProfile, ["assetExposureBalance", "scoreBreakdown.assetExposureBalanceScore"], 54), 0.14],
      [extractProfileScore(portfolioProfile, ["correlationAdjustedRiskBalance", "scoreBreakdown.correlationAdjustedRiskBalanceScore"], 54), 0.14],
      [extractProfileScore(preservationProfile, ["riskAdjustedPreservationQuality", "scoreBreakdown.riskAdjustedPreservationQualityScore"], 54), 0.16],
      [extractProfileScore(expansionGovernanceProfile, ["defensiveGovernanceResilience"], 54), 0.12],
      [extractProfileScore(auditProfile, ["governanceAlignmentScore"], 54), 0.1],
      [strategicPrincipleScore, 0.08],
      [extractProfileScore(memoryProfile, ["portfolioStrategyMemoryScore"], 54), 0.08],
    ]),
  );
  const capitalDisciplineScore = getScore(
    input.capitalDisciplineScore,
    weightedAverage([
      [extractProfileScore(treasuryProfile, ["strategicTreasuryDurability", "scoreBreakdown.strategicTreasuryDurability"], 54), 0.2],
      [extractProfileScore(treasuryProfile, ["liquidityDurability", "scoreBreakdown.liquidityDurabilityScore"], 54), 0.16],
      [extractProfileScore(treasuryProfile, ["reserveResilienceQuality", "scoreBreakdown.reserveResilienceQualityScore"], 54), 0.16],
      [extractProfileScore(expansionGovernanceProfile, ["approvalProcessDurability"], 54), 0.14],
      [riskDoctrineScore, 0.12],
      [extractProfileScore(preservationProfile, ["longHorizonPreservationQuality"], 54), 0.1],
      [strategicPrincipleScore, 0.06],
      [extractProfileScore(auditProfile, ["reviewDisciplineScore"], 54), 0.06],
    ]),
  );
  const governanceDoctrineScore = getScore(
    input.governanceDoctrineScore,
    weightedAverage([
      [extractProfileScore(expansionGovernanceProfile, ["humanReviewGovernanceAlignment", "scoreBreakdown.humanReviewGovernanceAlignmentScore"], 54), 0.2],
      [extractProfileScore(expansionGovernanceProfile, ["governanceDurability", "scoreBreakdown.governanceDurabilityScore"], 54), 0.18],
      [extractProfileScore(auditProfile, ["governanceAlignmentScore", "scoreBreakdown.governanceAlignmentScore"], 54), 0.16],
      [extractProfileScore(auditProfile, ["reviewDisciplineScore"], 54), 0.12],
      [strategicPrincipleScore, 0.1],
      [riskDoctrineScore, 0.1],
      [extractProfileScore(memoryProfile, ["governanceMemoryDurabilityScore"], 54), 0.08],
      [extractProfileScore(learningProfile, ["governanceLearningScore"], 54), 0.06],
    ]),
  );
  const expansionDoctrineScore = getScore(
    input.expansionDoctrineScore,
    weightedAverage([
      [extractProfileScore(expansionGovernanceProfile, ["expansionControlQuality", "scoreBreakdown.expansionControlQualityScore"], 54), 0.2],
      [extractProfileScore(expansionGovernanceProfile, ["expansionOversightQuality", "scoreBreakdown.expansionOversightQualityScore"], 54), 0.18],
      [acquisitionDoctrineScore, 0.14],
      [governanceDoctrineScore, 0.12],
      [capitalDisciplineScore, 0.1],
      [extractProfileScore(memoryProfile, ["longHorizonContinuityScore"], 54), 0.1],
      [extractProfileScore(auditProfile, ["strategicAlignmentScore"], 54), 0.08],
      [riskDoctrineScore, 0.08],
    ]),
  );
  const brandTrustDoctrineScore = getScore(
    input.brandTrustDoctrineScore,
    weightedAverage([
      [extractProfileScore(relationshipProfile, ["institutionalTrustReadiness", "scoreBreakdown.institutionalTrustReadinessScore"], 54), 0.22],
      [extractProfileScore(relationshipProfile, ["communicationStability", "scoreBreakdown.communicationStabilityScore"], 54), 0.16],
      [extractProfileScore(memoryProfile, ["strategicContextPreservationScore"], 54), 0.14],
      [strategicPrincipleScore, 0.12],
      [extractProfileScore(learningProfile, ["responseLearningScore"], 54), 0.1],
      [governanceDoctrineScore, 0.1],
      [extractProfileScore(relationshipProfile, ["longTermRelationshipValue"], 54), 0.08],
      [extractProfileScore(auditProfile, ["strategicAlignmentScore"], 54), 0.08],
    ]),
  );
  const operatingPhilosophyScore = getScore(
    input.operatingPhilosophyScore,
    weightedAverage([
      [strategicPrincipleScore, 0.16],
      [extractProfileScore(memoryProfile, ["doctrinePreservationScore"], 54), 0.16],
      [extractProfileScore(memoryProfile, ["enterpriseMemoryMaturityScore"], 54), 0.14],
      [extractProfileScore(learningProfile, ["continuousLearningMaturityScore", "scoreBreakdown.continuousLearningMaturityScore"], 54), 0.14],
      [governanceDoctrineScore, 0.12],
      [riskDoctrineScore, 0.1],
      [brandTrustDoctrineScore, 0.1],
      [extractProfileScore(auditProfile, ["decisionAuditMaturityScore"], 54), 0.08],
    ]),
  );
  const doctrineTransferabilityScore = getScore(
    input.doctrineTransferabilityScore,
    weightedAverage([
      [extractProfileScore(memoryProfile, ["enterpriseMemoryMaturityScore", "scoreBreakdown.enterpriseMemoryMaturityScore"], 54), 0.18],
      [extractProfileScore(memoryProfile, ["institutionalLessonRetentionScore", "scoreBreakdown.institutionalLessonRetentionScore"], 54), 0.16],
      [extractProfileScore(learningProfile, ["memoryReinforcementScore", "scoreBreakdown.memoryReinforcementScore"], 54), 0.16],
      [operatingPhilosophyScore, 0.14],
      [strategicPrincipleScore, 0.12],
      [governanceDoctrineScore, 0.1],
      [extractProfileScore(memoryProfile, ["continuityMemoryScore"], 54), 0.08],
      [extractProfileScore(learningProfile, ["decisionLearningScore"], 54), 0.06],
    ]),
  );
  const longHorizonDoctrineScore = getScore(
    input.longHorizonDoctrineScore,
    weightedAverage([
      [extractProfileScore(memoryProfile, ["longHorizonContinuityScore", "scoreBreakdown.longHorizonContinuityScore"], 54), 0.2],
      [extractProfileScore(preservationProfile, ["longHorizonPreservationQuality", "scoreBreakdown.longHorizonPreservationQualityScore"], 54), 0.18],
      [operatingPhilosophyScore, 0.12],
      [doctrineTransferabilityScore, 0.12],
      [strategicPrincipleScore, 0.1],
      [capitalDisciplineScore, 0.1],
      [governanceDoctrineScore, 0.08],
      [riskDoctrineScore, 0.06],
      [extractProfileScore(preservationProfile, ["institutionalContinuityDurability"], 54), 0.04],
    ]),
  );
  const overallDoctrineScore = weightedAverage([
    [strategicPrincipleScore, 0.12],
    [acquisitionDoctrineScore, 0.1],
    [riskDoctrineScore, 0.11],
    [capitalDisciplineScore, 0.1],
    [governanceDoctrineScore, 0.11],
    [expansionDoctrineScore, 0.1],
    [brandTrustDoctrineScore, 0.09],
    [operatingPhilosophyScore, 0.11],
    [doctrineTransferabilityScore, 0.08],
    [longHorizonDoctrineScore, 0.08],
  ]);

  return {
    connectivityScore: brandTrustDoctrineScore,
    durabilityScore: overallDoctrineScore,
    expansionScore: expansionDoctrineScore,
    institutionalScore: longHorizonDoctrineScore,
    logisticsScore: operatingPhilosophyScore,
    luxuryScore: acquisitionDoctrineScore,
    developmentScore: doctrineTransferabilityScore,
    overallDoctrineScore,
    strategicPrincipleScore,
    acquisitionDoctrineScore,
    riskDoctrineScore,
    capitalDisciplineScore,
    governanceDoctrineScore,
    expansionDoctrineScore,
    brandTrustDoctrineScore,
    operatingPhilosophyScore,
    doctrineTransferabilityScore,
    longHorizonDoctrineScore,
  };
}

function classifyDoctrineMaturity(score: number): DoctrineMaturityLevel {
  if (score >= 82) return "institutional";
  if (score >= 68) return "disciplined";
  if (score >= 54) return "developing";
  if (score >= 40) return "thin";

  return "unclear";
}

function buildWarnings(scoreBreakdown: EnterpriseStrategicDoctrineScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "STRATEGIC_DOCTRINE_DATA_INCOMPLETE",
            severity: missingData.length >= 5 ? "high" : "medium",
            message: "Enterprise strategic doctrine assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.overallDoctrineScore < 42
      ? [
          createCorridorWarning({
            code: "STRATEGIC_DOCTRINE_UNCLEAR",
            severity: "high",
            message: "Overall enterprise strategic doctrine maturity is unclear under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.governanceDoctrineScore < 45
      ? [
          createCorridorWarning({
            code: "GOVERNANCE_DOCTRINE_WEAK",
            severity: "medium",
            message: "Governance doctrine clarity is weak and requires human review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.capitalDisciplineScore < 45
      ? [
          createCorridorWarning({
            code: "CAPITAL_DISCIPLINE_DOCTRINE_WEAK",
            severity: "medium",
            message: "Capital discipline doctrine is weak; no lending, investment, allocation, or portfolio-management advice is provided.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
  ];
}

function buildDoctrineWarnings(scoreBreakdown: EnterpriseStrategicDoctrineScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.strategicPrincipleScore < 55 ? ["Strategic principle clarity may be too weak for consistent enterprise decision review."] : []),
    ...(scoreBreakdown.acquisitionDoctrineScore < 55 ? ["Acquisition doctrine clarity may be underdeveloped."] : []),
    ...(scoreBreakdown.riskDoctrineScore < 55 ? ["Risk doctrine maturity may need human review."] : []),
    ...(scoreBreakdown.capitalDisciplineScore < 55
      ? ["Capital discipline doctrine may be too thin; no lending, investment, allocation, or portfolio-management guidance is produced."]
      : []),
    ...(scoreBreakdown.governanceDoctrineScore < 55 ? ["Governance doctrine clarity may be fragmented and requires human review."] : []),
    ...(scoreBreakdown.expansionDoctrineScore < 55 ? ["Expansion doctrine maturity may be insufficient for disciplined growth review."] : []),
    ...(scoreBreakdown.brandTrustDoctrineScore < 55 ? ["Brand/trust doctrine clarity may be underdeveloped; no outreach or CRM automation is triggered."] : []),
    ...(scoreBreakdown.operatingPhilosophyScore < 55 ? ["Operating philosophy consistency may be too weak for transferable enterprise behavior."] : []),
    ...(scoreBreakdown.doctrineTransferabilityScore < 55 ? ["Doctrine transferability may be insufficient for leadership or team handoffs."] : []),
    ...(scoreBreakdown.longHorizonDoctrineScore < 55 ? ["Long-horizon doctrine maturity may be underdeveloped."] : []),
    ...(missingData.length > 0 ? ["Doctrine warnings require human validation because required structured inputs are incomplete."] : []),
  ]);
}

function buildReusableInfrastructureNotes(input: EnterpriseStrategicDoctrineInput, missingData: string[]) {
  return unique([
    "Reuses shared corridor score normalization, warning creation, confidence scoring, missing-data handling, and read-only score breakdown conventions.",
    "Consumes optional in-memory intelligence profiles only; no persistence, external API calls, scraping, routing, orchestration, or automation execution is introduced.",
    ...(input.enterpriseStrategicMemoryProfile ? ["Enterprise strategic memory profile supplied as reusable doctrine-preservation context."] : []),
    ...(input.enterpriseInstitutionalLearningProfile ? ["Enterprise institutional learning profile supplied as reusable continuous-learning context."] : []),
    ...(input.enterpriseExpansionGovernanceProfile ? ["Enterprise expansion governance profile supplied as reusable governance and expansion doctrine context."] : []),
    ...(input.strategicTreasuryProfile ? ["Strategic treasury profile supplied as read-only capital discipline context without treasury management behavior."] : []),
    ...(missingData.length > 0 ? ["Reusable profile coverage is incomplete, so conservative deterministic defaults and human verification remain required."] : []),
  ]);
}

function buildKeyRisks(scoreBreakdown: EnterpriseStrategicDoctrineScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.overallDoctrineScore < 50 ? ["Overall enterprise strategic doctrine maturity is weak."] : []),
    ...(scoreBreakdown.strategicPrincipleScore < 50 ? ["Strategic principle clarity is weak."] : []),
    ...(scoreBreakdown.acquisitionDoctrineScore < 50 ? ["Acquisition doctrine clarity is weak."] : []),
    ...(scoreBreakdown.riskDoctrineScore < 50 ? ["Risk doctrine maturity is weak."] : []),
    ...(scoreBreakdown.capitalDisciplineScore < 50 ? ["Capital discipline doctrine is weak."] : []),
    ...(scoreBreakdown.governanceDoctrineScore < 50 ? ["Governance doctrine clarity is weak."] : []),
    ...(scoreBreakdown.expansionDoctrineScore < 50 ? ["Expansion doctrine maturity is weak."] : []),
    ...(scoreBreakdown.brandTrustDoctrineScore < 50 ? ["Brand/trust doctrine clarity is weak."] : []),
    ...(scoreBreakdown.operatingPhilosophyScore < 50 ? ["Operating philosophy consistency is weak."] : []),
    ...(scoreBreakdown.doctrineTransferabilityScore < 50 ? ["Doctrine transferability is weak."] : []),
    ...(scoreBreakdown.longHorizonDoctrineScore < 50 ? ["Long-horizon doctrine maturity is weak."] : []),
    ...(missingData.length > 0 ? `Missing data reduces confidence: ${missingData.slice(0, 4).join(", ")}.` : []),
  ]);
}

function buildStrengths(scoreBreakdown: EnterpriseStrategicDoctrineScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.overallDoctrineScore >= 70 ? ["Overall enterprise strategic doctrine maturity is strong."] : []),
    ...(scoreBreakdown.strategicPrincipleScore >= 70 ? ["Strategic principle clarity is strong."] : []),
    ...(scoreBreakdown.acquisitionDoctrineScore >= 70 ? ["Acquisition doctrine clarity is strong."] : []),
    ...(scoreBreakdown.riskDoctrineScore >= 70 ? ["Risk doctrine maturity is strong."] : []),
    ...(scoreBreakdown.capitalDisciplineScore >= 70 ? ["Capital discipline doctrine is strong."] : []),
    ...(scoreBreakdown.governanceDoctrineScore >= 70 ? ["Governance doctrine clarity is strong."] : []),
    ...(scoreBreakdown.expansionDoctrineScore >= 70 ? ["Expansion doctrine maturity is strong."] : []),
    ...(scoreBreakdown.brandTrustDoctrineScore >= 70 ? ["Brand/trust doctrine clarity is strong."] : []),
    ...(scoreBreakdown.operatingPhilosophyScore >= 70 ? ["Operating philosophy consistency is strong."] : []),
    ...(scoreBreakdown.doctrineTransferabilityScore >= 70 ? ["Doctrine transferability is strong."] : []),
    ...(scoreBreakdown.longHorizonDoctrineScore >= 70 ? ["Long-horizon doctrine maturity is strong."] : []),
  ]);
}

function buildRecommendations(scoreBreakdown: EnterpriseStrategicDoctrineScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.strategicPrincipleScore < 58 ? ["Review strategic principle clarity and preserve durable enterprise principles for human review."] : []),
    ...(scoreBreakdown.acquisitionDoctrineScore < 58
      ? ["Review acquisition doctrine clarity without making investment, lending, allocation, or portfolio-management recommendations."]
      : []),
    ...(scoreBreakdown.riskDoctrineScore < 58
      ? ["Review risk doctrine maturity without creating investment, lending, insurance, legal, or portfolio-management advice."]
      : []),
    ...(scoreBreakdown.capitalDisciplineScore < 58
      ? ["Review capital discipline doctrine without making treasury, banking, lending, investment, allocation, or portfolio-management recommendations."]
      : []),
    ...(scoreBreakdown.governanceDoctrineScore < 58 ? ["Review governance doctrine clarity; this is not legal, HR, ownership, or tax advice."] : []),
    ...(scoreBreakdown.expansionDoctrineScore < 58 ? ["Review expansion doctrine maturity without autonomous strategy decisions or execution."] : []),
    ...(scoreBreakdown.brandTrustDoctrineScore < 58 ? ["Review brand/trust doctrine without outreach, SMS, email, Twilio, CRM automation, or relationship manipulation."] : []),
    ...(scoreBreakdown.operatingPhilosophyScore < 58 ? ["Review operating philosophy consistency and document human-reviewed operating principles."] : []),
    ...(scoreBreakdown.doctrineTransferabilityScore < 58 ? ["Review doctrine transferability and preserve doctrine context for leadership and team handoffs."] : []),
    ...(scoreBreakdown.longHorizonDoctrineScore < 58 ? ["Review long-horizon doctrine maturity and preserve durable operating philosophy context."] : []),
    "Keep strategic-doctrine improvements human-reviewed; this module does not provide autonomous strategy decisions, legal, HR, ownership, tax, lending, investment, portfolio-management, treasury-management, or market-prediction advice.",
  ]);
}

function buildExplanation(params: { scoreBreakdown: EnterpriseStrategicDoctrineScoreBreakdown; doctrineMaturityLevel: DoctrineMaturityLevel }) {
  const scoreBreakdown = params.scoreBreakdown;

  return [
    `Doctrine maturity level is ${params.doctrineMaturityLevel} with an overall doctrine score of ${scoreBreakdown.overallDoctrineScore}/100.`,
    `Strategic principle clarity is ${scoreBreakdown.strategicPrincipleScore}/100, governance doctrine is ${scoreBreakdown.governanceDoctrineScore}/100, and long-horizon doctrine maturity is ${scoreBreakdown.longHorizonDoctrineScore}/100.`,
    "Strategic principles, acquisition doctrine, risk doctrine, capital discipline, governance doctrine, expansion doctrine, brand/trust doctrine, operating philosophy, doctrine transferability, and long-horizon doctrine maturity were scored deterministically from structured inputs and optional read-only profile fallbacks.",
    "This output identifies strategic doctrine gaps only and does not provide autonomous strategy decisions, legal, HR, ownership, tax, lending, investment, portfolio-management, treasury-management, autonomous optimization, or market-prediction advice.",
  ];
}

function buildTrace(scoreBreakdown: EnterpriseStrategicDoctrineScoreBreakdown, missingData: string[]) {
  return [
    "Normalized all numeric scores to a deterministic 0-100 scale.",
    "Derived optional fallback scores only from supplied in-memory intelligence profiles.",
    `Computed enterprise strategic doctrine from strategic principles (${scoreBreakdown.strategicPrincipleScore}), acquisition doctrine (${scoreBreakdown.acquisitionDoctrineScore}), risk doctrine (${scoreBreakdown.riskDoctrineScore}), capital discipline (${scoreBreakdown.capitalDisciplineScore}), governance doctrine (${scoreBreakdown.governanceDoctrineScore}), expansion doctrine (${scoreBreakdown.expansionDoctrineScore}), brand/trust doctrine (${scoreBreakdown.brandTrustDoctrineScore}), operating philosophy (${scoreBreakdown.operatingPhilosophyScore}), transferability (${scoreBreakdown.doctrineTransferabilityScore}), and long-horizon doctrine (${scoreBreakdown.longHorizonDoctrineScore}).`,
    missingData.length > 0 ? `Missing inputs flagged for human verification: ${missingData.join(", ")}.` : "No required structured inputs were missing.",
    "No outreach, SMS, email, Twilio, database writes, schema changes, workflow mutation, protected-class logic, demographic targeting, external APIs, scraping, autonomous strategy decisions, autonomous learning actions, autonomous optimization, autonomous execution, or autonomous management decisions were used.",
  ];
}

function buildAssumptions(input: EnterpriseStrategicDoctrineInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0
      ? ["Missing enterprise strategic doctrine inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."]
      : []),
    "Enterprise strategic doctrine intelligence is deterministic, explainable, read-only, compliance-first, and designed for human review before any execution.",
    "This engine evaluates strategic principle clarity, acquisition doctrine clarity, risk doctrine maturity, capital discipline doctrine, governance doctrine clarity, expansion doctrine maturity, brand/trust doctrine clarity, operating philosophy consistency, doctrine transferability, and long-horizon doctrine maturity only.",
    "No outreach, SMS, email sending, Twilio, autonomous execution, autonomous strategy decisions, autonomous learning actions, autonomous optimization, autonomous management decisions, DB writes, schema changes, workflow mutations, external APIs, scraping, demographic data, or protected-class data were used.",
    "This is not legal advice, HR advice, ownership advice, tax advice, lending advice, investment advice, portfolio-management advice, treasury management, autonomous strategy, autonomous optimization, autonomous management, or market prediction.",
  ]);
}

export function analyzeEnterpriseStrategicDoctrineIntelligence(
  input: EnterpriseStrategicDoctrineInput = {},
): EnterpriseStrategicDoctrineResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const doctrineMaturityLevel = classifyDoctrineMaturity(scoreBreakdown.overallDoctrineScore);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallDoctrineScore: scoreBreakdown.overallDoctrineScore,
    doctrineMaturityLevel,
    strategicPrincipleScore: scoreBreakdown.strategicPrincipleScore,
    acquisitionDoctrineScore: scoreBreakdown.acquisitionDoctrineScore,
    riskDoctrineScore: scoreBreakdown.riskDoctrineScore,
    capitalDisciplineScore: scoreBreakdown.capitalDisciplineScore,
    governanceDoctrineScore: scoreBreakdown.governanceDoctrineScore,
    expansionDoctrineScore: scoreBreakdown.expansionDoctrineScore,
    brandTrustDoctrineScore: scoreBreakdown.brandTrustDoctrineScore,
    operatingPhilosophyScore: scoreBreakdown.operatingPhilosophyScore,
    doctrineTransferabilityScore: scoreBreakdown.doctrineTransferabilityScore,
    longHorizonDoctrineScore: scoreBreakdown.longHorizonDoctrineScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown, missingData),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    doctrineWarnings: buildDoctrineWarnings(scoreBreakdown, missingData),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input, missingData),
    explanation: buildExplanation({ scoreBreakdown, doctrineMaturityLevel }),
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

export const getEnterpriseStrategicDoctrineIntelligence = analyzeEnterpriseStrategicDoctrineIntelligence;
