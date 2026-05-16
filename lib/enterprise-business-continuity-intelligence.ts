import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import {
  calculateCorridorConfidence,
  createCorridorWarning,
  normalizeCorridorScore,
} from "./corridor-intelligence-utils";

export type ContinuityReadinessLevel = "critical" | "fragile" | "developing" | "continuity_ready" | "institutional_grade";

export type EnterpriseBusinessContinuityInput = {
  operationalContinuityScore?: number;
  governanceContinuityScore?: number;
  leadershipContinuityScore?: number;
  technologyContinuityScore?: number;
  communicationContinuityScore?: number;
  capitalContinuityScore?: number;
  portfolioContinuityScore?: number;
  expansionContinuityScore?: number;
  organizationalContinuityScore?: number;
  enterpriseContinuityMaturityScore?: number;
  enterpriseRecoveryPlanningProfile?: unknown;
  enterpriseContingencyPlanningProfile?: unknown;
  enterpriseScenarioPlanningProfile?: unknown;
  enterpriseStressTestProfile?: unknown;
  enterpriseResilienceProfile?: unknown;
  enterpriseRiskProfile?: unknown;
  strategicTreasuryProfile?: unknown;
  operationalPlaybookProfile?: unknown;
  operationalQaProcessDriftProfile?: unknown;
  processOptimizationProfile?: unknown;
  enterpriseOperatingRhythmProfile?: unknown;
  enterpriseAccountabilityProfile?: unknown;
  enterpriseDecisionRightsProfile?: unknown;
  enterpriseExpansionGovernanceProfile?: unknown;
  enterpriseInstitutionalCohesionProfile?: unknown;
  founderDependencyProfile?: unknown;
  institutionalKnowledgeTransferProfile?: unknown;
  portfolioRiskProfile?: unknown;
  portfolioCorrelationProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseBusinessContinuityScoreBreakdown = CorridorScoreBreakdown & {
  overallScore: number;
  operationalContinuityScore: number;
  governanceContinuityScore: number;
  leadershipContinuityScore: number;
  technologyContinuityScore: number;
  communicationContinuityScore: number;
  capitalContinuityScore: number;
  portfolioContinuityScore: number;
  expansionContinuityScore: number;
  organizationalContinuityScore: number;
  enterpriseContinuityMaturityScore: number;
};

export type EnterpriseBusinessContinuityResult = {
  overallContinuityScore: number;
  continuityReadinessLevel: ContinuityReadinessLevel;
  operationalContinuityScore: number;
  governanceContinuityScore: number;
  leadershipContinuityScore: number;
  technologyContinuityScore: number;
  communicationContinuityScore: number;
  capitalContinuityScore: number;
  portfolioContinuityScore: number;
  expansionContinuityScore: number;
  organizationalContinuityScore: number;
  enterpriseContinuityMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseBusinessContinuityScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  continuityWarnings: string[];
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
    continuityExecution: false;
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
    technologyExecutionAdvice: false;
    demographicTargetingUsed: false;
    protectedClassLogicUsed: false;
    externalDataUsed: false;
    scrapingUsed: false;
    marketPrediction: false;
  };
  readOnly: true;
};

const REQUIRED_INPUTS = [
  "operationalContinuityScore",
  "governanceContinuityScore",
  "leadershipContinuityScore",
  "technologyContinuityScore",
  "communicationContinuityScore",
  "capitalContinuityScore",
  "portfolioContinuityScore",
  "expansionContinuityScore",
  "organizationalContinuityScore",
  "enterpriseContinuityMaturityScore",
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
  input: EnterpriseBusinessContinuityInput,
  key: keyof EnterpriseBusinessContinuityInput,
  fallback: number,
): number => {
  const value = input[key];
  return typeof value === "number" && Number.isFinite(value)
    ? normalizeCorridorScore(value)
    : normalizeCorridorScore(fallback);
};

const hasFallbackForInput = (
  input: EnterpriseBusinessContinuityInput,
  key: (typeof REQUIRED_INPUTS)[number],
): boolean => {
  switch (key) {
    case "operationalContinuityScore":
      return (
        hasProfileScore(input.enterpriseRecoveryPlanningProfile, ["operationalRecoveryScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["operationalResilienceScore", "recoveryReadinessScore"]) ||
        hasProfileScore(input.enterpriseRiskProfile, ["operationalContinuityResilience"])
      );
    case "governanceContinuityScore":
      return (
        hasProfileScore(input.enterpriseRecoveryPlanningProfile, ["governanceRecoveryScore"]) ||
        hasProfileScore(input.enterpriseContingencyPlanningProfile, ["governanceContingencyScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["governanceResilienceScore"]) ||
        hasProfileScore(input.enterpriseDecisionRightsProfile, ["overallDecisionRightsScore"])
      );
    case "leadershipContinuityScore":
      return (
        hasProfileScore(input.enterpriseRecoveryPlanningProfile, ["leadershipRecoveryScore"]) ||
        hasProfileScore(input.enterpriseContingencyPlanningProfile, ["leadershipAbsenceContingencyScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["leadershipSurvivabilityScore"]) ||
        hasProfileScore(input.founderDependencyProfile, ["continuityReadinessScore", "backupLeadershipReadinessScore"])
      );
    case "technologyContinuityScore":
      return (
        hasProfileScore(input.enterpriseRecoveryPlanningProfile, ["technologyRecoveryScore"]) ||
        hasProfileScore(input.enterpriseContingencyPlanningProfile, ["technologyDisruptionContingencyScore"]) ||
        hasProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]) ||
        hasProfileScore(input.institutionalKnowledgeTransferProfile, ["continuityHandoffScore"])
      );
    case "communicationContinuityScore":
      return (
        hasProfileScore(input.enterpriseRecoveryPlanningProfile, ["communicationRecoveryScore"]) ||
        hasProfileScore(input.enterpriseContingencyPlanningProfile, ["communicationOverloadContingencyScore"]) ||
        hasProfileScore(input.operationalQaProcessDriftProfile, ["communicationConsistencyScore"])
      );
    case "capitalContinuityScore":
      return (
        hasProfileScore(input.enterpriseRecoveryPlanningProfile, ["capitalRecoveryScore"]) ||
        hasProfileScore(input.enterpriseContingencyPlanningProfile, ["capitalPressureContingencyScore"]) ||
        hasProfileScore(input.strategicTreasuryProfile, ["liquidityDurability", "reserveResilienceQuality"])
      );
    case "portfolioContinuityScore":
      return (
        hasProfileScore(input.enterpriseRecoveryPlanningProfile, ["portfolioRecoveryScore"]) ||
        hasProfileScore(input.enterpriseContingencyPlanningProfile, ["portfolioUnderperformanceContingencyScore"]) ||
        hasProfileScore(input.operationalPlaybookProfile, ["portfolioReviewPlaybookScore"])
      );
    case "expansionContinuityScore":
      return (
        hasProfileScore(input.enterpriseRecoveryPlanningProfile, ["expansionRecoveryScore"]) ||
        hasProfileScore(input.enterpriseContingencyPlanningProfile, ["expansionStressContingencyScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["expansionStressDurabilityScore"])
      );
    case "organizationalContinuityScore":
      return (
        hasProfileScore(input.enterpriseRecoveryPlanningProfile, ["organizationalRecoveryScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["institutionalStressScore", "enterpriseResilienceMaturityScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalCohesionProfile, ["overallCohesionScore", "scalingCoherenceScore"])
      );
    case "enterpriseContinuityMaturityScore":
      return (
        hasProfileScore(input.enterpriseRecoveryPlanningProfile, ["enterpriseRecoveryMaturityScore"]) ||
        hasProfileScore(input.enterpriseContingencyPlanningProfile, ["enterpriseContingencyMaturityScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["enterpriseResilienceMaturityScore"]) ||
        hasProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"])
      );
  }
};

const getMissingData = (input: EnterpriseBusinessContinuityInput): string[] =>
  REQUIRED_INPUTS.filter((key) => typeof input[key] !== "number" && !hasFallbackForInput(input, key));

const buildScoreBreakdown = (
  input: EnterpriseBusinessContinuityInput,
): EnterpriseBusinessContinuityScoreBreakdown => {
  const operationalContinuityScore = getScore(
    input,
    "operationalContinuityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["operationalRecoveryScore"]), 0.22],
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["operationalContingencyScore"]), 0.18],
      [extractProfileScore(input.enterpriseResilienceProfile, ["operationalResilienceScore"]), 0.18],
      [extractProfileScore(input.enterpriseRiskProfile, ["operationalContinuityResilience"]), 0.14],
      [extractProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]), 0.14],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"]), 0.14],
    ]),
  );

  const governanceContinuityScore = getScore(
    input,
    "governanceContinuityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["governanceRecoveryScore"]), 0.22],
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["governanceContingencyScore"]), 0.18],
      [extractProfileScore(input.enterpriseResilienceProfile, ["governanceResilienceScore"]), 0.18],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["overallDecisionRightsScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["governanceAccountabilityScore"]), 0.14],
      [100 - extractProfileScore(input.enterpriseRiskProfile, ["governanceFragilityExposure"], 48), 0.14],
    ]),
  );

  const leadershipContinuityScore = getScore(
    input,
    "leadershipContinuityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["leadershipRecoveryScore"]), 0.22],
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["leadershipAbsenceContingencyScore"]), 0.18],
      [extractProfileScore(input.enterpriseResilienceProfile, ["leadershipSurvivabilityScore"]), 0.18],
      [extractProfileScore(input.founderDependencyProfile, ["continuityReadinessScore"]), 0.16],
      [extractProfileScore(input.founderDependencyProfile, ["backupLeadershipReadinessScore"]), 0.16],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["continuityAccountabilityScore"]), 0.1],
    ]),
  );

  const technologyContinuityScore = getScore(
    input,
    "technologyContinuityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["technologyRecoveryScore"]), 0.22],
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["technologyDisruptionContingencyScore"]), 0.2],
      [extractProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]), 0.18],
      [extractProfileScore(input.institutionalKnowledgeTransferProfile, ["continuityHandoffScore"]), 0.16],
      [100 - extractProfileScore(input.institutionalKnowledgeTransferProfile, ["accessKnowledgeRiskScore"], 48), 0.12],
      [extractProfileScore(input.enterpriseRiskProfile, ["operationalContinuityResilience"]), 0.12],
    ]),
  );

  const communicationContinuityScore = getScore(
    input,
    "communicationContinuityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["communicationRecoveryScore"]), 0.22],
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["communicationOverloadContingencyScore"]), 0.2],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["communicationConsistencyScore"]), 0.18],
      [extractProfileScore(input.processOptimizationProfile, ["communicationEfficiencyScore"]), 0.16],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["escalationClarityScore"]), 0.12],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["escalationAuthorityScore"]), 0.12],
    ]),
  );

  const capitalContinuityScore = getScore(
    input,
    "capitalContinuityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["capitalRecoveryScore"]), 0.22],
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["capitalPressureContingencyScore"]), 0.18],
      [extractProfileScore(input.strategicTreasuryProfile, ["liquidityDurability"]), 0.18],
      [extractProfileScore(input.strategicTreasuryProfile, ["reserveResilienceQuality"]), 0.18],
      [extractProfileScore(input.strategicTreasuryProfile, ["defensiveReserveBalance"]), 0.12],
      [extractProfileScore(input.enterpriseStressTestProfile, ["capitalStressScore"]), 0.12],
    ]),
  );

  const portfolioContinuityScore = getScore(
    input,
    "portfolioContinuityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["portfolioRecoveryScore"]), 0.22],
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["portfolioUnderperformanceContingencyScore"]), 0.18],
      [extractProfileScore(input.operationalPlaybookProfile, ["portfolioReviewPlaybookScore"]), 0.16],
      [100 - extractProfileScore(input.portfolioRiskProfile, ["portfolioRiskScore", "concentrationRiskScore"], 48), 0.16],
      [100 - extractProfileScore(input.portfolioCorrelationProfile, ["portfolioCorrelationRisk", "correlationRiskScore"], 48), 0.14],
      [extractProfileScore(input.enterpriseRiskProfile, ["diversificationResilienceQuality"]), 0.14],
    ]),
  );

  const expansionContinuityScore = getScore(
    input,
    "expansionContinuityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["expansionRecoveryScore"]), 0.22],
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["expansionStressContingencyScore"]), 0.18],
      [extractProfileScore(input.enterpriseResilienceProfile, ["expansionStressDurabilityScore"]), 0.16],
      [100 - extractProfileScore(input.enterpriseResilienceProfile, ["scalingFragilityScore"], 48), 0.14],
      [extractProfileScore(input.enterpriseExpansionGovernanceProfile, ["expansionControlQuality"]), 0.14],
      [extractProfileScore(input.enterpriseExpansionGovernanceProfile, ["expansionOversightQuality"]), 0.16],
    ]),
  );

  const organizationalContinuityScore = getScore(
    input,
    "organizationalContinuityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["organizationalRecoveryScore"]), 0.2],
      [extractProfileScore(input.enterpriseResilienceProfile, ["institutionalStressScore"]), 0.16],
      [extractProfileScore(input.enterpriseInstitutionalCohesionProfile, ["overallCohesionScore"]), 0.16],
      [extractProfileScore(input.enterpriseInstitutionalCohesionProfile, ["scalingCoherenceScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["accountabilityMaturityScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["continuityAccountabilityScore"]), 0.12],
      [extractProfileScore(input.enterpriseRiskProfile, ["institutionalStabilityDurability"]), 0.08],
    ]),
  );

  const enterpriseContinuityMaturityScore = getScore(
    input,
    "enterpriseContinuityMaturityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["enterpriseRecoveryMaturityScore"]), 0.2],
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["enterpriseContingencyMaturityScore"]), 0.16],
      [extractProfileScore(input.enterpriseScenarioPlanningProfile, ["scenarioPlanningMaturityScore"]), 0.14],
      [extractProfileScore(input.enterpriseResilienceProfile, ["enterpriseResilienceMaturityScore"]), 0.16],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"]), 0.12],
      [extractProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]), 0.12],
      [organizationalContinuityScore, 0.1],
    ]),
  );

  const overallScore = weightedAverage([
    [operationalContinuityScore, 0.13],
    [governanceContinuityScore, 0.11],
    [leadershipContinuityScore, 0.11],
    [technologyContinuityScore, 0.1],
    [communicationContinuityScore, 0.09],
    [capitalContinuityScore, 0.11],
    [portfolioContinuityScore, 0.09],
    [expansionContinuityScore, 0.09],
    [organizationalContinuityScore, 0.1],
    [enterpriseContinuityMaturityScore, 0.07],
  ]);

  return {
    connectivityScore: communicationContinuityScore,
    durabilityScore: overallScore,
    expansionScore: expansionContinuityScore,
    institutionalScore: enterpriseContinuityMaturityScore,
    logisticsScore: operationalContinuityScore,
    luxuryScore: capitalContinuityScore,
    developmentScore: technologyContinuityScore,
    overallScore,
    operationalContinuityScore,
    governanceContinuityScore,
    leadershipContinuityScore,
    technologyContinuityScore,
    communicationContinuityScore,
    capitalContinuityScore,
    portfolioContinuityScore,
    expansionContinuityScore,
    organizationalContinuityScore,
    enterpriseContinuityMaturityScore,
  };
};

const classifyContinuityReadiness = (
  breakdown: EnterpriseBusinessContinuityScoreBreakdown,
): ContinuityReadinessLevel => {
  const criticalMinimum = Math.min(
    breakdown.operationalContinuityScore,
    breakdown.governanceContinuityScore,
    breakdown.leadershipContinuityScore,
    breakdown.technologyContinuityScore,
    breakdown.capitalContinuityScore,
    breakdown.organizationalContinuityScore,
  );

  if (breakdown.overallScore >= 82 && criticalMinimum >= 72 && breakdown.enterpriseContinuityMaturityScore >= 76) {
    return "institutional_grade";
  }
  if (breakdown.overallScore >= 68 && criticalMinimum >= 58) return "continuity_ready";
  if (breakdown.overallScore >= 54) return "developing";
  if (breakdown.overallScore >= 40) return "fragile";
  return "critical";
};

const buildWarnings = (
  breakdown: EnterpriseBusinessContinuityScoreBreakdown,
  missingData: string[],
): CorridorWarning[] => [
  ...(missingData.length > 0
    ? [
        createCorridorWarning({
          code: "ENTERPRISE_CONTINUITY_DATA_INCOMPLETE",
          severity: missingData.length >= 5 ? "high" : "medium",
          message: "Enterprise business continuity assessment is using incomplete structured inputs and requires human verification.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.overallScore < 42
    ? [
        createCorridorWarning({
          code: "ENTERPRISE_CONTINUITY_WEAK",
          severity: "high",
          message: "Enterprise business continuity readiness is weak under current structured inputs.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.capitalContinuityScore < 45
    ? [
        createCorridorWarning({
          code: "CAPITAL_CONTINUITY_WEAK",
          severity: "high",
          message: "Capital continuity readiness is weak; this is not financial, lending, investment, or treasury advice.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.leadershipContinuityScore < 45
    ? [
        createCorridorWarning({
          code: "LEADERSHIP_CONTINUITY_WEAK",
          severity: "medium",
          message: "Leadership continuity readiness is weak and requires human continuity review.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.technologyContinuityScore < 45
    ? [
        createCorridorWarning({
          code: "TECHNOLOGY_CONTINUITY_WEAK",
          severity: "medium",
          message: "Technology continuity readiness is weak; this module does not execute technology changes.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
];

const buildKeyRisks = (breakdown: EnterpriseBusinessContinuityScoreBreakdown): string[] =>
  unique([
    ...(breakdown.operationalContinuityScore < 55 ? ["Operational continuity readiness may be fragile."] : []),
    ...(breakdown.governanceContinuityScore < 55 ? ["Governance continuity readiness may be fragile."] : []),
    ...(breakdown.leadershipContinuityScore < 55 ? ["Leadership continuity readiness may depend on narrow continuity capacity."] : []),
    ...(breakdown.technologyContinuityScore < 55 ? ["Technology continuity readiness may be fragile."] : []),
    ...(breakdown.communicationContinuityScore < 55 ? ["Communication continuity readiness may be fragile."] : []),
    ...(breakdown.capitalContinuityScore < 55
      ? ["Capital continuity readiness may be fragile; this is not financial or lending advice."]
      : []),
    ...(breakdown.portfolioContinuityScore < 55
      ? ["Portfolio continuity readiness may be fragile; this is not portfolio-management advice."]
      : []),
    ...(breakdown.expansionContinuityScore < 55 ? ["Expansion continuity readiness may be fragile."] : []),
    ...(breakdown.organizationalContinuityScore < 55 ? ["Organizational continuity readiness may be fragmented."] : []),
  ]);

const buildStrengths = (breakdown: EnterpriseBusinessContinuityScoreBreakdown): string[] =>
  unique([
    ...(breakdown.operationalContinuityScore >= 72 ? ["Operational continuity readiness appears durable."] : []),
    ...(breakdown.governanceContinuityScore >= 72 ? ["Governance continuity readiness appears durable."] : []),
    ...(breakdown.leadershipContinuityScore >= 72 ? ["Leadership continuity readiness appears durable."] : []),
    ...(breakdown.technologyContinuityScore >= 72 ? ["Technology continuity readiness appears durable."] : []),
    ...(breakdown.communicationContinuityScore >= 72 ? ["Communication continuity readiness appears durable."] : []),
    ...(breakdown.capitalContinuityScore >= 72 ? ["Capital continuity readiness appears durable without execution behavior."] : []),
    ...(breakdown.organizationalContinuityScore >= 72 ? ["Organizational continuity readiness appears durable."] : []),
    ...(breakdown.enterpriseContinuityMaturityScore >= 72 ? ["Enterprise continuity maturity appears institutionally reviewable."] : []),
  ]);

const buildRecommendations = (breakdown: EnterpriseBusinessContinuityScoreBreakdown): string[] =>
  unique([
    ...(breakdown.operationalContinuityScore < 65
      ? ["Review operational continuity checkpoints and handoffs through human-approved operating reviews."]
      : []),
    ...(breakdown.governanceContinuityScore < 65
      ? ["Review governance continuity readiness without creating legal, ownership, tax, or management directives."]
      : []),
    ...(breakdown.leadershipContinuityScore < 65
      ? ["Review leadership continuity backups without creating HR, ownership, or legal advice."]
      : []),
    ...(breakdown.technologyContinuityScore < 65
      ? ["Review technology continuity readiness as an operational check only; no technology execution is performed."]
      : []),
    ...(breakdown.communicationContinuityScore < 65
      ? ["Review communication continuity cadence and escalation clarity without sending messages."]
      : []),
    ...(breakdown.capitalContinuityScore < 65
      ? ["Review capital continuity readiness; this is not financial, lending, investment, or treasury advice."]
      : []),
    ...(breakdown.portfolioContinuityScore < 65
      ? ["Review portfolio continuity readiness as a governance signal, not portfolio-management advice."]
      : []),
    ...(breakdown.expansionContinuityScore < 65
      ? ["Review expansion continuity readiness before strategic discussions; no expansion decision is automated."]
      : []),
    ...(breakdown.organizationalContinuityScore < 65
      ? ["Review organizational continuity cohesion, accountability, and continuity practices through human review."]
      : []),
    "Use this module as read-only business continuity intelligence for human review, not as an autonomous continuity execution system.",
  ]);

const buildReusableInfrastructureNotes = (input: EnterpriseBusinessContinuityInput): string[] =>
  unique([
    "Reuses corridor scoring utilities for normalization, warnings, and confidence.",
    "Designed as a pure TypeScript module with deterministic structured inputs and explainable outputs.",
    ...(input.enterpriseRecoveryPlanningProfile
      ? ["Can consume recovery planning intelligence as read-only continuity recovery context."]
      : []),
    ...(input.enterpriseContingencyPlanningProfile
      ? ["Can consume contingency planning intelligence as read-only continuity backup-plan context."]
      : []),
    ...(input.enterpriseResilienceProfile ? ["Can consume resilience intelligence as read-only continuity durability context."] : []),
    ...(input.operationalPlaybookProfile ? ["Can consume operational playbook intelligence as read-only continuity procedure context."] : []),
    ...(input.institutionalKnowledgeTransferProfile
      ? ["Can consume institutional knowledge transfer intelligence as read-only technology and handoff context."]
      : []),
  ]);

const buildExplanation = (
  breakdown: EnterpriseBusinessContinuityScoreBreakdown,
  continuityReadinessLevel: ContinuityReadinessLevel,
): string[] => [
  `Overall continuity score is ${breakdown.overallScore}, classified as ${continuityReadinessLevel}.`,
  `Core continuity dimensions include operational ${breakdown.operationalContinuityScore}, governance ${breakdown.governanceContinuityScore}, leadership ${breakdown.leadershipContinuityScore}, technology ${breakdown.technologyContinuityScore}, and organizational ${breakdown.organizationalContinuityScore}.`,
  `Business pressure continuity dimensions include communication ${breakdown.communicationContinuityScore}, capital ${breakdown.capitalContinuityScore}, portfolio ${breakdown.portfolioContinuityScore}, and expansion ${breakdown.expansionContinuityScore}.`,
  `Enterprise continuity maturity is ${breakdown.enterpriseContinuityMaturityScore}.`,
  "This module is deterministic, explainable, read-only, compliance-first, and limited to human-reviewed governance and operational review signals.",
];

const buildTrace = (
  input: EnterpriseBusinessContinuityInput,
  breakdown: EnterpriseBusinessContinuityScoreBreakdown,
): string[] => [
  "Normalized all direct numeric inputs to a 0-100 deterministic scoring range.",
  "Used only optional read-only upstream intelligence profiles as fallback signals when direct continuity inputs were absent.",
  "Treated every continuity dimension as higher-is-better readiness; no continuity plan is executed or automated.",
  `Computed overallContinuityScore=${breakdown.overallScore} with dataQualityScore=${typeof input.dataQualityScore === "number" ? normalizeCorridorScore(input.dataQualityScore) : "not provided"}.`,
  "No outreach, database writes, schema changes, automation execution, continuity execution, market prediction, or financial/legal/HR advice was generated.",
];

const buildAssumptions = (input: EnterpriseBusinessContinuityInput, missingData: string[]): string[] =>
  unique([
    ...(input.assumptions ?? []),
    "All business-continuity inputs are deterministic structured signals supplied by human-reviewed systems.",
    "No live market, banking, financial, demographic, protected-class, or scraped data is used.",
    "Continuity readiness scores represent review flags only and do not trigger autonomous actions, mitigation, or execution.",
    ...(missingData.length > 0
      ? ["Some business-continuity dimensions were inferred from available read-only profile fallbacks or neutral deterministic defaults."]
      : []),
  ]);

export function analyzeEnterpriseBusinessContinuityIntelligence(
  input: EnterpriseBusinessContinuityInput = {},
): EnterpriseBusinessContinuityResult {
  const scoreBreakdown = buildScoreBreakdown(input);
  const missingData = getMissingData(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const continuityReadinessLevel = classifyContinuityReadiness(scoreBreakdown);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallContinuityScore: scoreBreakdown.overallScore,
    continuityReadinessLevel,
    operationalContinuityScore: scoreBreakdown.operationalContinuityScore,
    governanceContinuityScore: scoreBreakdown.governanceContinuityScore,
    leadershipContinuityScore: scoreBreakdown.leadershipContinuityScore,
    technologyContinuityScore: scoreBreakdown.technologyContinuityScore,
    communicationContinuityScore: scoreBreakdown.communicationContinuityScore,
    capitalContinuityScore: scoreBreakdown.capitalContinuityScore,
    portfolioContinuityScore: scoreBreakdown.portfolioContinuityScore,
    expansionContinuityScore: scoreBreakdown.expansionContinuityScore,
    organizationalContinuityScore: scoreBreakdown.organizationalContinuityScore,
    enterpriseContinuityMaturityScore: scoreBreakdown.enterpriseContinuityMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    continuityWarnings: warnings.map((warning) => warning.message),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input),
    explanation: buildExplanation(scoreBreakdown, continuityReadinessLevel),
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
      continuityExecution: false,
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
      technologyExecutionAdvice: false,
      demographicTargetingUsed: false,
      protectedClassLogicUsed: false,
      externalDataUsed: false,
      scrapingUsed: false,
      marketPrediction: false,
    },
    readOnly: true,
  };
}

export const getEnterpriseBusinessContinuityIntelligence =
  analyzeEnterpriseBusinessContinuityIntelligence;
