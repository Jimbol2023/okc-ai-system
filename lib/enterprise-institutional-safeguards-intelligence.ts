import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import {
  calculateCorridorConfidence,
  createCorridorWarning,
  normalizeCorridorScore,
} from "./corridor-intelligence-utils";

export type SafeguardReadinessLevel = "weak" | "exposed" | "developing" | "safeguarded" | "institutional_grade";

export type EnterpriseInstitutionalSafeguardsInput = {
  governanceSafeguardScore?: number;
  operationalSafeguardScore?: number;
  leadershipSafeguardScore?: number;
  communicationSafeguardScore?: number;
  strategicSafeguardScore?: number;
  recoverySafeguardScore?: number;
  continuitySafeguardScore?: number;
  doctrineSafeguardScore?: number;
  longHorizonSafeguardScore?: number;
  enterpriseSafeguardMaturityScore?: number;
  enterpriseContinuityGovernanceProfile?: unknown;
  enterpriseBusinessContinuityProfile?: unknown;
  enterpriseRecoveryPlanningProfile?: unknown;
  enterpriseResilienceProfile?: unknown;
  enterpriseRiskProfile?: unknown;
  enterpriseStrategicDoctrineProfile?: unknown;
  enterpriseStrategicReviewProfile?: unknown;
  enterpriseStrategicConsistencyProfile?: unknown;
  enterpriseDecisionRightsProfile?: unknown;
  enterpriseAccountabilityProfile?: unknown;
  enterpriseOperatingRhythmProfile?: unknown;
  operationalPlaybookProfile?: unknown;
  operationalQaProcessDriftProfile?: unknown;
  processOptimizationProfile?: unknown;
  founderDependencyProfile?: unknown;
  institutionalKnowledgeTransferProfile?: unknown;
  enterpriseInstitutionalCohesionProfile?: unknown;
  longHorizonWealthPreservationProfile?: unknown;
  familyOfficeGovernanceProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseInstitutionalSafeguardsScoreBreakdown = CorridorScoreBreakdown & {
  overallScore: number;
  governanceSafeguardScore: number;
  operationalSafeguardScore: number;
  leadershipSafeguardScore: number;
  communicationSafeguardScore: number;
  strategicSafeguardScore: number;
  recoverySafeguardScore: number;
  continuitySafeguardScore: number;
  doctrineSafeguardScore: number;
  longHorizonSafeguardScore: number;
  enterpriseSafeguardMaturityScore: number;
};

export type EnterpriseInstitutionalSafeguardsResult = {
  overallSafeguardScore: number;
  safeguardReadinessLevel: SafeguardReadinessLevel;
  governanceSafeguardScore: number;
  operationalSafeguardScore: number;
  leadershipSafeguardScore: number;
  communicationSafeguardScore: number;
  strategicSafeguardScore: number;
  recoverySafeguardScore: number;
  continuitySafeguardScore: number;
  doctrineSafeguardScore: number;
  longHorizonSafeguardScore: number;
  enterpriseSafeguardMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseInstitutionalSafeguardsScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  safeguardWarnings: string[];
  reusableInfrastructureNotes: string[];
  explanation: string[];
  trace: string[];
  warnings: CorridorWarning[];
  missingData: string[];
  assumptions: string[];
  safety: {
    readOnly: true;
    outreachGenerated: false;
    smsGenerated: false;
    emailGenerated: false;
    twilioTouched: false;
    dbWrites: false;
    schemaChanges: false;
    automationExecution: false;
    safeguardExecution: false;
    governanceAutomation: false;
    autonomousActions: false;
    autonomousStrategyDecisions: false;
    autonomousManagementDecisions: false;
    legalAdvice: false;
    hrAdvice: false;
    ownershipAdvice: false;
    taxAdvice: false;
    lendingAdvice: false;
    investmentAdvice: false;
    portfolioManagementAdvice: false;
    financialAdvice: false;
    demographicTargetingUsed: false;
    protectedClassLogicUsed: false;
    externalDataUsed: false;
    scrapingUsed: false;
    marketPrediction: false;
  };
  readOnly: true;
};

const REQUIRED_INPUTS = [
  "governanceSafeguardScore",
  "operationalSafeguardScore",
  "leadershipSafeguardScore",
  "communicationSafeguardScore",
  "strategicSafeguardScore",
  "recoverySafeguardScore",
  "continuitySafeguardScore",
  "doctrineSafeguardScore",
  "longHorizonSafeguardScore",
  "enterpriseSafeguardMaturityScore",
] as const;

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const weightedAverage = (entries: Array<[number, number]>): number => {
  const totals = entries.reduce(
    (acc, [score, weight]) => ({
      weighted: acc.weighted + normalizeCorridorScore(score) * weight,
      weight: acc.weight + weight,
    }),
    { weighted: 0, weight: 0 },
  );

  return totals.weight <= 0 ? 0 : normalizeCorridorScore(totals.weighted / totals.weight);
};

const getPath = (source: unknown, path: string): unknown => {
  if (!source || typeof source !== "object" || Array.isArray(source)) return undefined;

  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object" || Array.isArray(current)) return undefined;
    return (current as Record<string, unknown>)[key];
  }, source);
};

const extractProfileScore = (source: unknown, paths: string[], fallback = 54): number => {
  for (const path of paths) {
    const value = getPath(source, path);
    if (typeof value === "number" && Number.isFinite(value)) return normalizeCorridorScore(value);
  }

  return fallback;
};

const hasProfileScore = (source: unknown, paths: string[]): boolean =>
  paths.some((path) => typeof getPath(source, path) === "number");

const getScore = (
  input: EnterpriseInstitutionalSafeguardsInput,
  key: keyof EnterpriseInstitutionalSafeguardsInput,
  fallback: number,
): number => {
  const value = input[key];
  return typeof value === "number" && Number.isFinite(value)
    ? normalizeCorridorScore(value)
    : normalizeCorridorScore(fallback);
};

const hasFallbackForInput = (
  input: EnterpriseInstitutionalSafeguardsInput,
  key: (typeof REQUIRED_INPUTS)[number],
): boolean => {
  switch (key) {
    case "governanceSafeguardScore":
      return (
        hasProfileScore(input.enterpriseContinuityGovernanceProfile, [
          "institutionalSafeguardScore",
          "continuityGovernanceScore",
          "overallContinuityGovernanceScore",
        ]) ||
        hasProfileScore(input.enterpriseDecisionRightsProfile, ["governanceAuthorityScore"]) ||
        hasProfileScore(input.enterpriseStrategicReviewProfile, ["governanceReviewScore"])
      );
    case "operationalSafeguardScore":
      return (
        hasProfileScore(input.enterpriseBusinessContinuityProfile, ["operationalContinuityScore"]) ||
        hasProfileScore(input.enterpriseRecoveryPlanningProfile, ["operationalRecoveryScore"]) ||
        hasProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]) ||
        hasProfileScore(input.operationalQaProcessDriftProfile, ["overallOperationalConsistencyScore"])
      );
    case "leadershipSafeguardScore":
      return (
        hasProfileScore(input.enterpriseBusinessContinuityProfile, ["leadershipContinuityScore"]) ||
        hasProfileScore(input.enterpriseRecoveryPlanningProfile, ["leadershipRecoveryScore"]) ||
        hasProfileScore(input.founderDependencyProfile, ["continuityReadinessScore", "backupLeadershipReadinessScore"]) ||
        hasProfileScore(input.enterpriseContinuityGovernanceProfile, ["leadershipContinuityGovernanceScore"])
      );
    case "communicationSafeguardScore":
      return (
        hasProfileScore(input.enterpriseBusinessContinuityProfile, ["communicationContinuityScore"]) ||
        hasProfileScore(input.enterpriseRecoveryPlanningProfile, ["communicationRecoveryScore"]) ||
        hasProfileScore(input.operationalQaProcessDriftProfile, ["communicationConsistencyScore"]) ||
        hasProfileScore(input.processOptimizationProfile, ["communicationEfficiencyScore"]) ||
        hasProfileScore(input.enterpriseAccountabilityProfile, ["escalationClarityScore"])
      );
    case "strategicSafeguardScore":
      return (
        hasProfileScore(input.enterpriseStrategicDoctrineProfile, [
          "overallDoctrineScore",
          "riskDoctrineScore",
          "governanceDoctrineScore",
        ]) ||
        hasProfileScore(input.enterpriseStrategicReviewProfile, ["strategicReviewMaturityScore"]) ||
        hasProfileScore(input.enterpriseStrategicConsistencyProfile, ["overallConsistencyScore"])
      );
    case "recoverySafeguardScore":
      return (
        hasProfileScore(input.enterpriseRecoveryPlanningProfile, ["overallRecoveryScore", "enterpriseRecoveryMaturityScore"]) ||
        hasProfileScore(input.enterpriseContinuityGovernanceProfile, ["recoveryGovernanceScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["recoveryReadinessScore"])
      );
    case "continuitySafeguardScore":
      return (
        hasProfileScore(input.enterpriseBusinessContinuityProfile, [
          "overallContinuityScore",
          "enterpriseContinuityMaturityScore",
        ]) ||
        hasProfileScore(input.enterpriseContinuityGovernanceProfile, ["continuityGovernanceScore"]) ||
        hasProfileScore(input.enterpriseRiskProfile, ["operationalContinuityResilience"])
      );
    case "doctrineSafeguardScore":
      return (
        hasProfileScore(input.enterpriseStrategicDoctrineProfile, [
          "overallDoctrineScore",
          "doctrineTransferabilityScore",
          "longHorizonDoctrineScore",
        ]) ||
        hasProfileScore(input.institutionalKnowledgeTransferProfile, ["institutionalMemoryScore"]) ||
        hasProfileScore(input.enterpriseStrategicReviewProfile, ["doctrineReviewCadenceScore"])
      );
    case "longHorizonSafeguardScore":
      return (
        hasProfileScore(input.enterpriseContinuityGovernanceProfile, ["longHorizonGovernanceScore"]) ||
        hasProfileScore(input.longHorizonWealthPreservationProfile, [
          "longHorizonPreservationQuality",
          "institutionalContinuityDurability",
        ]) ||
        hasProfileScore(input.enterpriseStrategicDoctrineProfile, ["longHorizonDoctrineScore"]) ||
        hasProfileScore(input.enterpriseBusinessContinuityProfile, ["enterpriseContinuityMaturityScore"])
      );
    case "enterpriseSafeguardMaturityScore":
      return (
        hasProfileScore(input.enterpriseContinuityGovernanceProfile, ["enterpriseGovernanceMaturityScore"]) ||
        hasProfileScore(input.enterpriseBusinessContinuityProfile, ["enterpriseContinuityMaturityScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["enterpriseResilienceMaturityScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalCohesionProfile, ["overallCohesionScore"])
      );
  }
};

const getMissingData = (input: EnterpriseInstitutionalSafeguardsInput): string[] =>
  REQUIRED_INPUTS.filter((key) => typeof input[key] !== "number" && !hasFallbackForInput(input, key));

const buildScoreBreakdown = (
  input: EnterpriseInstitutionalSafeguardsInput,
): EnterpriseInstitutionalSafeguardsScoreBreakdown => {
  const governanceSafeguardScore = getScore(
    input,
    "governanceSafeguardScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["institutionalSafeguardScore"]), 0.2],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["continuityGovernanceScore"]), 0.18],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["overallContinuityGovernanceScore"]), 0.16],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["governanceAuthorityScore"]), 0.14],
      [extractProfileScore(input.enterpriseStrategicReviewProfile, ["governanceReviewScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["governanceAccountabilityScore"]), 0.1],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["quarterlyGovernanceScore"]), 0.08],
    ]),
  );

  const operationalSafeguardScore = getScore(
    input,
    "operationalSafeguardScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["operationalContinuityScore"]), 0.2],
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["operationalRecoveryScore"]), 0.16],
      [extractProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]), 0.16],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["overallOperationalConsistencyScore"]), 0.14],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["sopAdherenceScore"]), 0.12],
      [extractProfileScore(input.processOptimizationProfile, ["workflowEfficiencyScore"]), 0.1],
      [governanceSafeguardScore, 0.12],
    ]),
  );

  const leadershipSafeguardScore = getScore(
    input,
    "leadershipSafeguardScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["leadershipContinuityScore"]), 0.2],
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["leadershipRecoveryScore"]), 0.16],
      [extractProfileScore(input.founderDependencyProfile, ["continuityReadinessScore"]), 0.16],
      [extractProfileScore(input.founderDependencyProfile, ["backupLeadershipReadinessScore"]), 0.16],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["leadershipContinuityGovernanceScore"]), 0.14],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["crisisDecisionAuthorityScore"]), 0.1],
      [governanceSafeguardScore, 0.08],
    ]),
  );

  const communicationSafeguardScore = getScore(
    input,
    "communicationSafeguardScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["communicationContinuityScore"]), 0.2],
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["communicationRecoveryScore"]), 0.16],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["communicationConsistencyScore"]), 0.16],
      [extractProfileScore(input.processOptimizationProfile, ["communicationEfficiencyScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["escalationClarityScore"]), 0.12],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["escalationAuthorityScore"]), 0.12],
      [operationalSafeguardScore, 0.1],
    ]),
  );

  const strategicSafeguardScore = getScore(
    input,
    "strategicSafeguardScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseStrategicDoctrineProfile, ["overallDoctrineScore"]), 0.2],
      [extractProfileScore(input.enterpriseStrategicDoctrineProfile, ["riskDoctrineScore"]), 0.16],
      [extractProfileScore(input.enterpriseStrategicDoctrineProfile, ["governanceDoctrineScore"]), 0.16],
      [extractProfileScore(input.enterpriseStrategicReviewProfile, ["strategicReviewMaturityScore"]), 0.14],
      [extractProfileScore(input.enterpriseStrategicConsistencyProfile, ["overallConsistencyScore"]), 0.14],
      [extractProfileScore(input.enterpriseStrategicConsistencyProfile, ["institutionalCoherenceScore"]), 0.1],
      [governanceSafeguardScore, 0.1],
    ]),
  );

  const recoverySafeguardScore = getScore(
    input,
    "recoverySafeguardScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["overallRecoveryScore"]), 0.22],
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["enterpriseRecoveryMaturityScore"]), 0.18],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["recoveryGovernanceScore"]), 0.16],
      [extractProfileScore(input.enterpriseResilienceProfile, ["recoveryReadinessScore"]), 0.16],
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["enterpriseContinuityMaturityScore"]), 0.12],
      [operationalSafeguardScore, 0.08],
      [governanceSafeguardScore, 0.08],
    ]),
  );

  const continuitySafeguardScore = getScore(
    input,
    "continuitySafeguardScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["overallContinuityScore"]), 0.22],
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["enterpriseContinuityMaturityScore"]), 0.18],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["continuityGovernanceScore"]), 0.16],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["operationalContinuityGovernanceScore"]), 0.14],
      [extractProfileScore(input.enterpriseRiskProfile, ["operationalContinuityResilience"]), 0.12],
      [recoverySafeguardScore, 0.1],
      [operationalSafeguardScore, 0.08],
    ]),
  );

  const doctrineSafeguardScore = getScore(
    input,
    "doctrineSafeguardScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseStrategicDoctrineProfile, ["overallDoctrineScore"]), 0.2],
      [extractProfileScore(input.enterpriseStrategicDoctrineProfile, ["doctrineTransferabilityScore"]), 0.18],
      [extractProfileScore(input.enterpriseStrategicDoctrineProfile, ["longHorizonDoctrineScore"]), 0.16],
      [extractProfileScore(input.institutionalKnowledgeTransferProfile, ["institutionalMemoryScore"]), 0.14],
      [extractProfileScore(input.enterpriseStrategicReviewProfile, ["doctrineReviewCadenceScore"]), 0.12],
      [extractProfileScore(input.enterpriseStrategicConsistencyProfile, ["longHorizonConsistencyScore"]), 0.1],
      [strategicSafeguardScore, 0.1],
    ]),
  );

  const longHorizonSafeguardScore = getScore(
    input,
    "longHorizonSafeguardScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["longHorizonGovernanceScore"]), 0.2],
      [extractProfileScore(input.longHorizonWealthPreservationProfile, ["longHorizonPreservationQuality"]), 0.18],
      [extractProfileScore(input.longHorizonWealthPreservationProfile, ["institutionalContinuityDurability"]), 0.16],
      [extractProfileScore(input.enterpriseStrategicDoctrineProfile, ["longHorizonDoctrineScore"]), 0.14],
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["enterpriseContinuityMaturityScore"]), 0.12],
      [extractProfileScore(input.familyOfficeGovernanceProfile, ["institutionalGovernanceDurability", "governanceContinuity"]), 0.1],
      [doctrineSafeguardScore, 0.1],
    ]),
  );

  const enterpriseSafeguardMaturityScore = getScore(
    input,
    "enterpriseSafeguardMaturityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["enterpriseGovernanceMaturityScore"]), 0.18],
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["enterpriseContinuityMaturityScore"]), 0.16],
      [extractProfileScore(input.enterpriseResilienceProfile, ["enterpriseResilienceMaturityScore"]), 0.16],
      [extractProfileScore(input.enterpriseInstitutionalCohesionProfile, ["overallCohesionScore"]), 0.14],
      [governanceSafeguardScore, 0.08],
      [continuitySafeguardScore, 0.08],
      [strategicSafeguardScore, 0.08],
      [longHorizonSafeguardScore, 0.08],
      [doctrineSafeguardScore, 0.04],
    ]),
  );

  const overallScore = weightedAverage([
    [governanceSafeguardScore, 0.12],
    [operationalSafeguardScore, 0.11],
    [leadershipSafeguardScore, 0.1],
    [communicationSafeguardScore, 0.09],
    [strategicSafeguardScore, 0.11],
    [recoverySafeguardScore, 0.1],
    [continuitySafeguardScore, 0.11],
    [doctrineSafeguardScore, 0.09],
    [longHorizonSafeguardScore, 0.09],
    [enterpriseSafeguardMaturityScore, 0.08],
  ]);

  return {
    connectivityScore: communicationSafeguardScore,
    durabilityScore: overallScore,
    expansionScore: operationalSafeguardScore,
    institutionalScore: enterpriseSafeguardMaturityScore,
    logisticsScore: governanceSafeguardScore,
    luxuryScore: longHorizonSafeguardScore,
    developmentScore: doctrineSafeguardScore,
    overallScore,
    governanceSafeguardScore,
    operationalSafeguardScore,
    leadershipSafeguardScore,
    communicationSafeguardScore,
    strategicSafeguardScore,
    recoverySafeguardScore,
    continuitySafeguardScore,
    doctrineSafeguardScore,
    longHorizonSafeguardScore,
    enterpriseSafeguardMaturityScore,
  };
};

const classifySafeguardReadiness = (
  breakdown: EnterpriseInstitutionalSafeguardsScoreBreakdown,
): SafeguardReadinessLevel => {
  const coreMinimum = Math.min(
    breakdown.governanceSafeguardScore,
    breakdown.operationalSafeguardScore,
    breakdown.leadershipSafeguardScore,
    breakdown.strategicSafeguardScore,
    breakdown.continuitySafeguardScore,
  );

  if (breakdown.overallScore >= 82 && coreMinimum >= 72 && breakdown.enterpriseSafeguardMaturityScore >= 76) {
    return "institutional_grade";
  }
  if (breakdown.overallScore >= 68 && coreMinimum >= 58) return "safeguarded";
  if (breakdown.overallScore >= 54) return "developing";
  if (breakdown.overallScore >= 40) return "exposed";
  return "weak";
};

const buildWarnings = (
  breakdown: EnterpriseInstitutionalSafeguardsScoreBreakdown,
  missingData: string[],
): CorridorWarning[] => [
  ...(missingData.length > 0
    ? [
        createCorridorWarning({
          code: "INSTITUTIONAL_SAFEGUARDS_DATA_INCOMPLETE",
          severity: missingData.length >= 5 ? "high" : "medium",
          message: "Enterprise institutional safeguards assessment is using incomplete structured inputs and requires human verification.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.overallScore < 42
    ? [
        createCorridorWarning({
          code: "INSTITUTIONAL_SAFEGUARDS_WEAK",
          severity: "high",
          message: "Enterprise institutional safeguard readiness is weak under current structured inputs.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.governanceSafeguardScore < 45
    ? [
        createCorridorWarning({
          code: "GOVERNANCE_SAFEGUARDS_WEAK",
          severity: "medium",
          message: "Governance safeguard maturity is weak and requires human governance review.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.leadershipSafeguardScore < 45
    ? [
        createCorridorWarning({
          code: "LEADERSHIP_SAFEGUARDS_WEAK",
          severity: "medium",
          message: "Leadership safeguard maturity is weak; this module does not provide HR, legal, or ownership advice.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.doctrineSafeguardScore < 45
    ? [
        createCorridorWarning({
          code: "DOCTRINE_SAFEGUARDS_WEAK",
          severity: "medium",
          message: "Institutional doctrine safeguard maturity is weak and requires human strategic review.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.longHorizonSafeguardScore < 45
    ? [
        createCorridorWarning({
          code: "LONG_HORIZON_SAFEGUARDS_WEAK",
          severity: "medium",
          message: "Long-horizon safeguard durability is weak; this is not legal, tax, ownership, lending, investment, or portfolio-management advice.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
];

const buildKeyRisks = (breakdown: EnterpriseInstitutionalSafeguardsScoreBreakdown): string[] =>
  unique([
    ...(breakdown.governanceSafeguardScore < 55 ? ["Governance safeguard maturity may be underdeveloped."] : []),
    ...(breakdown.operationalSafeguardScore < 55 ? ["Operational safeguards may be too thin for continuity protection."] : []),
    ...(breakdown.leadershipSafeguardScore < 55 ? ["Leadership safeguards may depend on narrow continuity capacity."] : []),
    ...(breakdown.communicationSafeguardScore < 55 ? ["Communication safeguards may be inconsistent or underdefined."] : []),
    ...(breakdown.strategicSafeguardScore < 55 ? ["Strategic discipline safeguards may be underdeveloped."] : []),
    ...(breakdown.recoverySafeguardScore < 55 ? ["Recovery integrity safeguards may be weak."] : []),
    ...(breakdown.continuitySafeguardScore < 55 ? ["Continuity safeguards may be fragile."] : []),
    ...(breakdown.doctrineSafeguardScore < 55 ? ["Institutional doctrine safeguards may be insufficiently transferable."] : []),
    ...(breakdown.longHorizonSafeguardScore < 55 ? ["Long-horizon safeguard durability may be weak."] : []),
  ]);

const buildStrengths = (breakdown: EnterpriseInstitutionalSafeguardsScoreBreakdown): string[] =>
  unique([
    ...(breakdown.governanceSafeguardScore >= 72 ? ["Governance safeguards appear mature and reviewable."] : []),
    ...(breakdown.operationalSafeguardScore >= 72 ? ["Operational safeguards appear durable."] : []),
    ...(breakdown.leadershipSafeguardScore >= 72 ? ["Leadership safeguards appear durable."] : []),
    ...(breakdown.communicationSafeguardScore >= 72 ? ["Communication safeguards appear stable without outreach automation."] : []),
    ...(breakdown.strategicSafeguardScore >= 72 ? ["Strategic safeguards appear disciplined."] : []),
    ...(breakdown.recoverySafeguardScore >= 72 ? ["Recovery safeguards appear durable."] : []),
    ...(breakdown.continuitySafeguardScore >= 72 ? ["Continuity safeguards appear durable."] : []),
    ...(breakdown.doctrineSafeguardScore >= 72 ? ["Institutional doctrine safeguards appear transferable."] : []),
    ...(breakdown.longHorizonSafeguardScore >= 72 ? ["Long-horizon safeguard durability appears strong."] : []),
    ...(breakdown.enterpriseSafeguardMaturityScore >= 72
      ? ["Enterprise safeguard maturity appears institutionally reviewable."]
      : []),
  ]);

const buildRecommendations = (breakdown: EnterpriseInstitutionalSafeguardsScoreBreakdown): string[] =>
  unique([
    ...(breakdown.governanceSafeguardScore < 65
      ? ["Review governance safeguards, review cadence, and decision-control evidence through human governance review."]
      : []),
    ...(breakdown.operationalSafeguardScore < 65
      ? ["Review operational safeguards, playbook coverage, and process-drift checks without executing operational changes."]
      : []),
    ...(breakdown.leadershipSafeguardScore < 65
      ? ["Review leadership safeguards and continuity coverage without creating HR, legal, ownership, or employment advice."]
      : []),
    ...(breakdown.communicationSafeguardScore < 65
      ? ["Review communication standards and escalation safeguards without sending messages or automating CRM behavior."]
      : []),
    ...(breakdown.strategicSafeguardScore < 65
      ? ["Review strategic discipline safeguards without autonomous strategy decisions, market prediction, or investment advice."]
      : []),
    ...(breakdown.recoverySafeguardScore < 65
      ? ["Review recovery-integrity safeguards without creating autonomous recovery actions or execution steps."]
      : []),
    ...(breakdown.continuitySafeguardScore < 65
      ? ["Review continuity safeguards and maintenance discipline as human-reviewed operational governance signals."]
      : []),
    ...(breakdown.doctrineSafeguardScore < 65
      ? ["Review institutional doctrine safeguards and transferability without legal, tax, trust, ownership, or investment advice."]
      : []),
    ...(breakdown.longHorizonSafeguardScore < 65
      ? ["Review long-horizon safeguard durability without legal, tax, lending, investment, ownership, or portfolio-management advice."]
      : []),
    "Use this module as read-only institutional safeguard intelligence for human review, not as a safeguard execution, governance automation, or management-decision system.",
  ]);

const buildReusableInfrastructureNotes = (input: EnterpriseInstitutionalSafeguardsInput): string[] =>
  unique([
    "Reuses corridor scoring utilities for normalization, warnings, and confidence.",
    "Designed as a pure TypeScript module with deterministic structured inputs and explainable outputs.",
    ...(input.enterpriseContinuityGovernanceProfile
      ? ["Can consume continuity governance intelligence as read-only safeguard governance context."]
      : []),
    ...(input.enterpriseBusinessContinuityProfile
      ? ["Can consume business continuity intelligence as read-only continuity safeguard context."]
      : []),
    ...(input.enterpriseRecoveryPlanningProfile
      ? ["Can consume recovery planning intelligence as read-only recovery safeguard context."]
      : []),
    ...(input.enterpriseStrategicDoctrineProfile
      ? ["Can consume strategic doctrine intelligence as read-only doctrine safeguard context."]
      : []),
    ...(input.enterpriseInstitutionalCohesionProfile
      ? ["Can consume institutional cohesion intelligence as read-only enterprise safeguard maturity context."]
      : []),
  ]);

const buildExplanation = (
  breakdown: EnterpriseInstitutionalSafeguardsScoreBreakdown,
  safeguardReadinessLevel: SafeguardReadinessLevel,
): string[] => [
  `Overall institutional safeguard score is ${breakdown.overallScore}, classified as ${safeguardReadinessLevel}.`,
  `Safeguard dimensions include governance ${breakdown.governanceSafeguardScore}, operational ${breakdown.operationalSafeguardScore}, leadership ${breakdown.leadershipSafeguardScore}, communication ${breakdown.communicationSafeguardScore}, and strategic ${breakdown.strategicSafeguardScore}.`,
  `Continuity protection dimensions include recovery ${breakdown.recoverySafeguardScore}, continuity ${breakdown.continuitySafeguardScore}, doctrine ${breakdown.doctrineSafeguardScore}, and long-horizon durability ${breakdown.longHorizonSafeguardScore}.`,
  `Enterprise safeguard maturity is ${breakdown.enterpriseSafeguardMaturityScore}.`,
  "This module is deterministic, explainable, read-only, compliance-first, and limited to human-reviewed institutional safeguard review signals.",
];

const buildTrace = (
  input: EnterpriseInstitutionalSafeguardsInput,
  breakdown: EnterpriseInstitutionalSafeguardsScoreBreakdown,
): string[] => [
  "Normalized all direct numeric inputs to a 0-100 deterministic scoring range.",
  "Used only optional read-only upstream intelligence profiles as fallback signals when direct safeguard inputs were absent.",
  "Treated every safeguard dimension as higher-is-better maturity; no safeguard, governance, communication, recovery, or continuity action is executed or automated.",
  `Computed overallSafeguardScore=${breakdown.overallScore} with dataQualityScore=${typeof input.dataQualityScore === "number" ? normalizeCorridorScore(input.dataQualityScore) : "not provided"}.`,
  "No outreach, SMS, email, Twilio, database writes, schema changes, automation execution, safeguard execution, market prediction, protected-class logic, demographic targeting, or financial/legal/HR advice was generated.",
];

const buildAssumptions = (input: EnterpriseInstitutionalSafeguardsInput, missingData: string[]): string[] =>
  unique([
    ...(input.assumptions ?? []),
    "All institutional-safeguard inputs are deterministic structured signals supplied by human-reviewed systems.",
    "No live market, banking, financial, demographic, protected-class, or scraped data is used.",
    "Institutional safeguard scores represent review flags only and do not trigger autonomous actions, mitigation, governance automation, outreach, or execution.",
    ...(missingData.length > 0
      ? ["Some institutional safeguard dimensions were inferred from available read-only profile fallbacks or neutral deterministic defaults."]
      : []),
  ]);

export function analyzeEnterpriseInstitutionalSafeguardsIntelligence(
  input: EnterpriseInstitutionalSafeguardsInput = {},
): EnterpriseInstitutionalSafeguardsResult {
  const scoreBreakdown = buildScoreBreakdown(input);
  const missingData = getMissingData(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const safeguardReadinessLevel = classifySafeguardReadiness(scoreBreakdown);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallSafeguardScore: scoreBreakdown.overallScore,
    safeguardReadinessLevel,
    governanceSafeguardScore: scoreBreakdown.governanceSafeguardScore,
    operationalSafeguardScore: scoreBreakdown.operationalSafeguardScore,
    leadershipSafeguardScore: scoreBreakdown.leadershipSafeguardScore,
    communicationSafeguardScore: scoreBreakdown.communicationSafeguardScore,
    strategicSafeguardScore: scoreBreakdown.strategicSafeguardScore,
    recoverySafeguardScore: scoreBreakdown.recoverySafeguardScore,
    continuitySafeguardScore: scoreBreakdown.continuitySafeguardScore,
    doctrineSafeguardScore: scoreBreakdown.doctrineSafeguardScore,
    longHorizonSafeguardScore: scoreBreakdown.longHorizonSafeguardScore,
    enterpriseSafeguardMaturityScore: scoreBreakdown.enterpriseSafeguardMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    safeguardWarnings: warnings.map((warning) => warning.message),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input),
    explanation: buildExplanation(scoreBreakdown, safeguardReadinessLevel),
    trace: buildTrace(input, scoreBreakdown),
    warnings,
    missingData,
    assumptions,
    safety: {
      readOnly: true,
      outreachGenerated: false,
      smsGenerated: false,
      emailGenerated: false,
      twilioTouched: false,
      dbWrites: false,
      schemaChanges: false,
      automationExecution: false,
      safeguardExecution: false,
      governanceAutomation: false,
      autonomousActions: false,
      autonomousStrategyDecisions: false,
      autonomousManagementDecisions: false,
      legalAdvice: false,
      hrAdvice: false,
      ownershipAdvice: false,
      taxAdvice: false,
      lendingAdvice: false,
      investmentAdvice: false,
      portfolioManagementAdvice: false,
      financialAdvice: false,
      demographicTargetingUsed: false,
      protectedClassLogicUsed: false,
      externalDataUsed: false,
      scrapingUsed: false,
      marketPrediction: false,
    },
    readOnly: true,
  };
}

export const getEnterpriseInstitutionalSafeguardsIntelligence =
  analyzeEnterpriseInstitutionalSafeguardsIntelligence;
