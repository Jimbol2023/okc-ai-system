import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import {
  calculateCorridorConfidence,
  createCorridorWarning,
  normalizeCorridorScore,
} from "./corridor-intelligence-utils";

export type RecoveryReadinessLevel = "critical" | "fragile" | "developing" | "recovery_ready" | "institutional_grade";

export type EnterpriseRecoveryPlanningInput = {
  operationalRecoveryScore?: number;
  governanceRecoveryScore?: number;
  leadershipRecoveryScore?: number;
  technologyRecoveryScore?: number;
  communicationRecoveryScore?: number;
  expansionRecoveryScore?: number;
  portfolioRecoveryScore?: number;
  capitalRecoveryScore?: number;
  organizationalRecoveryScore?: number;
  enterpriseRecoveryMaturityScore?: number;
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

export type EnterpriseRecoveryPlanningScoreBreakdown = CorridorScoreBreakdown & {
  overallScore: number;
  operationalRecoveryScore: number;
  governanceRecoveryScore: number;
  leadershipRecoveryScore: number;
  technologyRecoveryScore: number;
  communicationRecoveryScore: number;
  expansionRecoveryScore: number;
  portfolioRecoveryScore: number;
  capitalRecoveryScore: number;
  organizationalRecoveryScore: number;
  enterpriseRecoveryMaturityScore: number;
};

export type EnterpriseRecoveryPlanningResult = {
  overallRecoveryScore: number;
  recoveryReadinessLevel: RecoveryReadinessLevel;
  operationalRecoveryScore: number;
  governanceRecoveryScore: number;
  leadershipRecoveryScore: number;
  technologyRecoveryScore: number;
  communicationRecoveryScore: number;
  expansionRecoveryScore: number;
  portfolioRecoveryScore: number;
  capitalRecoveryScore: number;
  organizationalRecoveryScore: number;
  enterpriseRecoveryMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseRecoveryPlanningScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  recoveryWarnings: string[];
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
    recoveryExecution: false;
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
  "operationalRecoveryScore",
  "governanceRecoveryScore",
  "leadershipRecoveryScore",
  "technologyRecoveryScore",
  "communicationRecoveryScore",
  "expansionRecoveryScore",
  "portfolioRecoveryScore",
  "capitalRecoveryScore",
  "organizationalRecoveryScore",
  "enterpriseRecoveryMaturityScore",
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
  input: EnterpriseRecoveryPlanningInput,
  key: keyof EnterpriseRecoveryPlanningInput,
  fallback: number,
): number => {
  const value = input[key];
  return typeof value === "number" && Number.isFinite(value)
    ? normalizeCorridorScore(value)
    : normalizeCorridorScore(fallback);
};

const hasFallbackForInput = (
  input: EnterpriseRecoveryPlanningInput,
  key: (typeof REQUIRED_INPUTS)[number],
): boolean => {
  switch (key) {
    case "operationalRecoveryScore":
      return (
        hasProfileScore(input.enterpriseContingencyPlanningProfile, ["operationalContingencyScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["recoveryReadinessScore", "operationalResilienceScore"]) ||
        hasProfileScore(input.enterpriseRiskProfile, ["operationalContinuityResilience"])
      );
    case "governanceRecoveryScore":
      return (
        hasProfileScore(input.enterpriseContingencyPlanningProfile, ["governanceContingencyScore"]) ||
        hasProfileScore(input.enterpriseScenarioPlanningProfile, ["governanceStrainReadinessScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["governanceResilienceScore"]) ||
        hasProfileScore(input.enterpriseDecisionRightsProfile, ["overallDecisionRightsScore"])
      );
    case "leadershipRecoveryScore":
      return (
        hasProfileScore(input.enterpriseContingencyPlanningProfile, ["leadershipAbsenceContingencyScore"]) ||
        hasProfileScore(input.enterpriseScenarioPlanningProfile, ["leadershipDisruptionReadinessScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["leadershipSurvivabilityScore"]) ||
        hasProfileScore(input.founderDependencyProfile, ["continuityReadinessScore", "backupLeadershipReadinessScore"])
      );
    case "technologyRecoveryScore":
      return (
        hasProfileScore(input.enterpriseContingencyPlanningProfile, ["technologyDisruptionContingencyScore"]) ||
        hasProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]) ||
        hasProfileScore(input.institutionalKnowledgeTransferProfile, ["continuityHandoffScore", "institutionalMemoryScore"])
      );
    case "communicationRecoveryScore":
      return (
        hasProfileScore(input.enterpriseContingencyPlanningProfile, ["communicationOverloadContingencyScore"]) ||
        hasProfileScore(input.enterpriseScenarioPlanningProfile, ["communicationOverloadReadinessScore"]) ||
        hasProfileScore(input.operationalQaProcessDriftProfile, ["communicationConsistencyScore"])
      );
    case "expansionRecoveryScore":
      return (
        hasProfileScore(input.enterpriseContingencyPlanningProfile, ["expansionStressContingencyScore"]) ||
        hasProfileScore(input.enterpriseScenarioPlanningProfile, ["expansionStressReadinessScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["expansionStressDurabilityScore"])
      );
    case "portfolioRecoveryScore":
      return (
        hasProfileScore(input.enterpriseContingencyPlanningProfile, ["portfolioUnderperformanceContingencyScore"]) ||
        hasProfileScore(input.enterpriseScenarioPlanningProfile, ["portfolioUnderperformanceReadinessScore"]) ||
        hasProfileScore(input.operationalPlaybookProfile, ["portfolioReviewPlaybookScore"])
      );
    case "capitalRecoveryScore":
      return (
        hasProfileScore(input.enterpriseContingencyPlanningProfile, ["capitalPressureContingencyScore"]) ||
        hasProfileScore(input.enterpriseScenarioPlanningProfile, ["capitalPressureReadinessScore"]) ||
        hasProfileScore(input.strategicTreasuryProfile, ["liquidityDurability", "reserveResilienceQuality"])
      );
    case "organizationalRecoveryScore":
      return (
        hasProfileScore(input.enterpriseResilienceProfile, ["institutionalStressScore", "enterpriseResilienceMaturityScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalCohesionProfile, ["overallCohesionScore", "scalingCoherenceScore"]) ||
        hasProfileScore(input.enterpriseAccountabilityProfile, ["accountabilityMaturityScore", "continuityAccountabilityScore"])
      );
    case "enterpriseRecoveryMaturityScore":
      return (
        hasProfileScore(input.enterpriseContingencyPlanningProfile, ["enterpriseContingencyMaturityScore"]) ||
        hasProfileScore(input.enterpriseScenarioPlanningProfile, ["scenarioPlanningMaturityScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["enterpriseResilienceMaturityScore"]) ||
        hasProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"])
      );
  }
};

const getMissingData = (input: EnterpriseRecoveryPlanningInput): string[] =>
  REQUIRED_INPUTS.filter((key) => typeof input[key] !== "number" && !hasFallbackForInput(input, key));

const buildScoreBreakdown = (input: EnterpriseRecoveryPlanningInput): EnterpriseRecoveryPlanningScoreBreakdown => {
  const operationalRecoveryScore = getScore(
    input,
    "operationalRecoveryScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["operationalContingencyScore"]), 0.22],
      [extractProfileScore(input.enterpriseResilienceProfile, ["recoveryReadinessScore"]), 0.2],
      [extractProfileScore(input.enterpriseResilienceProfile, ["operationalResilienceScore"]), 0.16],
      [extractProfileScore(input.enterpriseRiskProfile, ["operationalContinuityResilience"]), 0.14],
      [extractProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]), 0.14],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"]), 0.14],
    ]),
  );

  const governanceRecoveryScore = getScore(
    input,
    "governanceRecoveryScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["governanceContingencyScore"]), 0.22],
      [extractProfileScore(input.enterpriseScenarioPlanningProfile, ["governanceStrainReadinessScore"]), 0.18],
      [extractProfileScore(input.enterpriseResilienceProfile, ["governanceResilienceScore"]), 0.18],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["overallDecisionRightsScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["governanceAccountabilityScore"]), 0.14],
      [100 - extractProfileScore(input.enterpriseRiskProfile, ["governanceFragilityExposure"], 48), 0.14],
    ]),
  );

  const leadershipRecoveryScore = getScore(
    input,
    "leadershipRecoveryScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["leadershipAbsenceContingencyScore"]), 0.22],
      [extractProfileScore(input.enterpriseScenarioPlanningProfile, ["leadershipDisruptionReadinessScore"]), 0.18],
      [extractProfileScore(input.enterpriseResilienceProfile, ["leadershipSurvivabilityScore"]), 0.18],
      [extractProfileScore(input.founderDependencyProfile, ["continuityReadinessScore"]), 0.16],
      [extractProfileScore(input.founderDependencyProfile, ["backupLeadershipReadinessScore"]), 0.16],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["continuityAccountabilityScore"]), 0.1],
    ]),
  );

  const technologyRecoveryScore = getScore(
    input,
    "technologyRecoveryScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["technologyDisruptionContingencyScore"]), 0.24],
      [extractProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]), 0.2],
      [extractProfileScore(input.institutionalKnowledgeTransferProfile, ["continuityHandoffScore"]), 0.18],
      [extractProfileScore(input.institutionalKnowledgeTransferProfile, ["institutionalMemoryScore"]), 0.14],
      [100 - extractProfileScore(input.institutionalKnowledgeTransferProfile, ["accessKnowledgeRiskScore"], 48), 0.12],
      [extractProfileScore(input.enterpriseRiskProfile, ["operationalContinuityResilience"]), 0.12],
    ]),
  );

  const communicationRecoveryScore = getScore(
    input,
    "communicationRecoveryScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["communicationOverloadContingencyScore"]), 0.24],
      [extractProfileScore(input.enterpriseScenarioPlanningProfile, ["communicationOverloadReadinessScore"]), 0.18],
      [100 - extractProfileScore(input.enterpriseStressTestProfile, ["communicationLoadStressScore"], 48), 0.16],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["communicationConsistencyScore"]), 0.16],
      [extractProfileScore(input.processOptimizationProfile, ["communicationEfficiencyScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["escalationClarityScore"]), 0.12],
    ]),
  );

  const expansionRecoveryScore = getScore(
    input,
    "expansionRecoveryScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["expansionStressContingencyScore"]), 0.22],
      [extractProfileScore(input.enterpriseScenarioPlanningProfile, ["expansionStressReadinessScore"]), 0.18],
      [extractProfileScore(input.enterpriseResilienceProfile, ["expansionStressDurabilityScore"]), 0.18],
      [100 - extractProfileScore(input.enterpriseResilienceProfile, ["scalingFragilityScore"], 48), 0.14],
      [extractProfileScore(input.enterpriseExpansionGovernanceProfile, ["expansionControlQuality"]), 0.14],
      [extractProfileScore(input.enterpriseExpansionGovernanceProfile, ["expansionOversightQuality"]), 0.14],
    ]),
  );

  const portfolioRecoveryScore = getScore(
    input,
    "portfolioRecoveryScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["portfolioUnderperformanceContingencyScore"]), 0.22],
      [extractProfileScore(input.enterpriseScenarioPlanningProfile, ["portfolioUnderperformanceReadinessScore"]), 0.18],
      [extractProfileScore(input.operationalPlaybookProfile, ["portfolioReviewPlaybookScore"]), 0.16],
      [100 - extractProfileScore(input.portfolioRiskProfile, ["portfolioRiskScore", "concentrationRiskScore"], 48), 0.16],
      [100 - extractProfileScore(input.portfolioCorrelationProfile, ["portfolioCorrelationRisk", "correlationRiskScore"], 48), 0.14],
      [extractProfileScore(input.enterpriseRiskProfile, ["diversificationResilienceQuality"]), 0.14],
    ]),
  );

  const capitalRecoveryScore = getScore(
    input,
    "capitalRecoveryScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["capitalPressureContingencyScore"]), 0.22],
      [extractProfileScore(input.enterpriseScenarioPlanningProfile, ["capitalPressureReadinessScore"]), 0.18],
      [extractProfileScore(input.enterpriseStressTestProfile, ["capitalStressScore"]), 0.16],
      [extractProfileScore(input.strategicTreasuryProfile, ["liquidityDurability"]), 0.16],
      [extractProfileScore(input.strategicTreasuryProfile, ["reserveResilienceQuality"]), 0.16],
      [extractProfileScore(input.strategicTreasuryProfile, ["defensiveReserveBalance"]), 0.12],
    ]),
  );

  const organizationalRecoveryScore = getScore(
    input,
    "organizationalRecoveryScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseResilienceProfile, ["institutionalStressScore"]), 0.18],
      [extractProfileScore(input.enterpriseResilienceProfile, ["enterpriseResilienceMaturityScore"]), 0.16],
      [extractProfileScore(input.enterpriseInstitutionalCohesionProfile, ["overallCohesionScore"]), 0.16],
      [extractProfileScore(input.enterpriseInstitutionalCohesionProfile, ["scalingCoherenceScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["accountabilityMaturityScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["continuityAccountabilityScore"]), 0.12],
      [extractProfileScore(input.enterpriseRiskProfile, ["institutionalStabilityDurability"]), 0.1],
    ]),
  );

  const enterpriseRecoveryMaturityScore = getScore(
    input,
    "enterpriseRecoveryMaturityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["enterpriseContingencyMaturityScore"]), 0.2],
      [extractProfileScore(input.enterpriseScenarioPlanningProfile, ["scenarioPlanningMaturityScore"]), 0.16],
      [extractProfileScore(input.enterpriseStressTestProfile, ["enterpriseStressTestMaturityScore"]), 0.14],
      [extractProfileScore(input.enterpriseResilienceProfile, ["enterpriseResilienceMaturityScore"]), 0.16],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"]), 0.12],
      [extractProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]), 0.12],
      [organizationalRecoveryScore, 0.1],
    ]),
  );

  const overallScore = weightedAverage([
    [operationalRecoveryScore, 0.12],
    [governanceRecoveryScore, 0.11],
    [leadershipRecoveryScore, 0.1],
    [technologyRecoveryScore, 0.1],
    [communicationRecoveryScore, 0.09],
    [expansionRecoveryScore, 0.09],
    [portfolioRecoveryScore, 0.1],
    [capitalRecoveryScore, 0.11],
    [organizationalRecoveryScore, 0.1],
    [enterpriseRecoveryMaturityScore, 0.08],
  ]);

  return {
    connectivityScore: communicationRecoveryScore,
    durabilityScore: overallScore,
    expansionScore: expansionRecoveryScore,
    institutionalScore: enterpriseRecoveryMaturityScore,
    logisticsScore: operationalRecoveryScore,
    luxuryScore: capitalRecoveryScore,
    developmentScore: technologyRecoveryScore,
    overallScore,
    operationalRecoveryScore,
    governanceRecoveryScore,
    leadershipRecoveryScore,
    technologyRecoveryScore,
    communicationRecoveryScore,
    expansionRecoveryScore,
    portfolioRecoveryScore,
    capitalRecoveryScore,
    organizationalRecoveryScore,
    enterpriseRecoveryMaturityScore,
  };
};

const classifyRecoveryReadiness = (breakdown: EnterpriseRecoveryPlanningScoreBreakdown): RecoveryReadinessLevel => {
  const criticalMinimum = Math.min(
    breakdown.operationalRecoveryScore,
    breakdown.governanceRecoveryScore,
    breakdown.leadershipRecoveryScore,
    breakdown.technologyRecoveryScore,
    breakdown.organizationalRecoveryScore,
  );

  if (breakdown.overallScore >= 82 && criticalMinimum >= 72 && breakdown.enterpriseRecoveryMaturityScore >= 76) {
    return "institutional_grade";
  }
  if (breakdown.overallScore >= 68 && criticalMinimum >= 58) return "recovery_ready";
  if (breakdown.overallScore >= 54) return "developing";
  if (breakdown.overallScore >= 40) return "fragile";
  return "critical";
};

const buildWarnings = (
  breakdown: EnterpriseRecoveryPlanningScoreBreakdown,
  missingData: string[],
): CorridorWarning[] => [
  ...(missingData.length > 0
    ? [
        createCorridorWarning({
          code: "ENTERPRISE_RECOVERY_DATA_INCOMPLETE",
          severity: missingData.length >= 5 ? "high" : "medium",
          message: "Enterprise recovery planning assessment is using incomplete structured inputs and requires human verification.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.overallScore < 42
    ? [
        createCorridorWarning({
          code: "ENTERPRISE_RECOVERY_WEAK",
          severity: "high",
          message: "Enterprise recovery readiness is weak under current structured inputs.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.capitalRecoveryScore < 45
    ? [
        createCorridorWarning({
          code: "CAPITAL_RECOVERY_WEAK",
          severity: "high",
          message: "Capital recovery readiness is weak; this is not financial, lending, investment, or treasury advice.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.leadershipRecoveryScore < 45
    ? [
        createCorridorWarning({
          code: "LEADERSHIP_RECOVERY_WEAK",
          severity: "medium",
          message: "Leadership recovery readiness is weak and requires human continuity review.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.technologyRecoveryScore < 45
    ? [
        createCorridorWarning({
          code: "TECHNOLOGY_RECOVERY_WEAK",
          severity: "medium",
          message: "Technology recovery readiness is weak; this module does not execute technology changes.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
];

const buildKeyRisks = (breakdown: EnterpriseRecoveryPlanningScoreBreakdown): string[] =>
  unique([
    ...(breakdown.operationalRecoveryScore < 55 ? ["Operational recovery readiness may be fragile."] : []),
    ...(breakdown.governanceRecoveryScore < 55 ? ["Governance recovery readiness may be fragile."] : []),
    ...(breakdown.leadershipRecoveryScore < 55 ? ["Leadership recovery readiness may depend on narrow continuity capacity."] : []),
    ...(breakdown.technologyRecoveryScore < 55 ? ["Technology recovery readiness may be fragile."] : []),
    ...(breakdown.communicationRecoveryScore < 55 ? ["Communication recovery readiness may be fragile."] : []),
    ...(breakdown.expansionRecoveryScore < 55 ? ["Expansion recovery readiness may be fragile."] : []),
    ...(breakdown.portfolioRecoveryScore < 55
      ? ["Portfolio recovery readiness may be fragile; this is not portfolio-management advice."]
      : []),
    ...(breakdown.capitalRecoveryScore < 55
      ? ["Capital recovery readiness may be fragile; this is not financial or lending advice."]
      : []),
    ...(breakdown.organizationalRecoveryScore < 55 ? ["Organizational recovery readiness may be fragmented."] : []),
  ]);

const buildStrengths = (breakdown: EnterpriseRecoveryPlanningScoreBreakdown): string[] =>
  unique([
    ...(breakdown.operationalRecoveryScore >= 72 ? ["Operational recovery readiness appears durable."] : []),
    ...(breakdown.governanceRecoveryScore >= 72 ? ["Governance recovery readiness appears durable."] : []),
    ...(breakdown.leadershipRecoveryScore >= 72 ? ["Leadership recovery readiness appears durable."] : []),
    ...(breakdown.technologyRecoveryScore >= 72 ? ["Technology recovery readiness appears durable."] : []),
    ...(breakdown.communicationRecoveryScore >= 72 ? ["Communication recovery readiness appears durable."] : []),
    ...(breakdown.capitalRecoveryScore >= 72 ? ["Capital recovery readiness appears durable without execution behavior."] : []),
    ...(breakdown.organizationalRecoveryScore >= 72 ? ["Organizational recovery readiness appears durable."] : []),
    ...(breakdown.enterpriseRecoveryMaturityScore >= 72 ? ["Enterprise recovery maturity appears institutionally reviewable."] : []),
  ]);

const buildRecommendations = (breakdown: EnterpriseRecoveryPlanningScoreBreakdown): string[] =>
  unique([
    ...(breakdown.operationalRecoveryScore < 65
      ? ["Review operational recovery handoffs and continuity checkpoints through human-approved operating reviews."]
      : []),
    ...(breakdown.governanceRecoveryScore < 65
      ? ["Review governance recovery readiness without creating legal, ownership, tax, or management directives."]
      : []),
    ...(breakdown.leadershipRecoveryScore < 65
      ? ["Review leadership recovery backups without creating HR, ownership, or legal advice."]
      : []),
    ...(breakdown.technologyRecoveryScore < 65
      ? ["Review technology recovery readiness as an operational check only; no technology execution is performed."]
      : []),
    ...(breakdown.communicationRecoveryScore < 65
      ? ["Review communication recovery cadence and escalation clarity without sending messages."]
      : []),
    ...(breakdown.expansionRecoveryScore < 65
      ? ["Review expansion recovery readiness before strategic discussions; no expansion decision is automated."]
      : []),
    ...(breakdown.portfolioRecoveryScore < 65
      ? ["Review portfolio recovery readiness as a governance signal, not portfolio-management advice."]
      : []),
    ...(breakdown.capitalRecoveryScore < 65
      ? ["Review capital recovery readiness; this is not financial, lending, investment, or treasury advice."]
      : []),
    ...(breakdown.organizationalRecoveryScore < 65
      ? ["Review organizational recovery cohesion, accountability, and continuity practices through human review."]
      : []),
    "Use this module as read-only recovery planning intelligence for human review, not as an autonomous recovery execution system.",
  ]);

const buildReusableInfrastructureNotes = (input: EnterpriseRecoveryPlanningInput): string[] =>
  unique([
    "Reuses corridor scoring utilities for normalization, warnings, and confidence.",
    "Designed as a pure TypeScript module with deterministic structured inputs and explainable outputs.",
    ...(input.enterpriseContingencyPlanningProfile
      ? ["Can consume contingency planning intelligence as read-only recovery backup-plan context."]
      : []),
    ...(input.enterpriseScenarioPlanningProfile
      ? ["Can consume scenario planning intelligence as read-only recovery scenario context."]
      : []),
    ...(input.enterpriseResilienceProfile ? ["Can consume resilience intelligence as read-only recovery durability context."] : []),
    ...(input.operationalPlaybookProfile ? ["Can consume operational playbook intelligence as read-only recovery procedure context."] : []),
    ...(input.institutionalKnowledgeTransferProfile
      ? ["Can consume institutional knowledge transfer intelligence as read-only technology and handoff context."]
      : []),
  ]);

const buildExplanation = (
  breakdown: EnterpriseRecoveryPlanningScoreBreakdown,
  recoveryReadinessLevel: RecoveryReadinessLevel,
): string[] => [
  `Overall recovery score is ${breakdown.overallScore}, classified as ${recoveryReadinessLevel}.`,
  `Core recovery dimensions include operational ${breakdown.operationalRecoveryScore}, governance ${breakdown.governanceRecoveryScore}, leadership ${breakdown.leadershipRecoveryScore}, technology ${breakdown.technologyRecoveryScore}, and organizational ${breakdown.organizationalRecoveryScore}.`,
  `Business pressure recovery dimensions include communication ${breakdown.communicationRecoveryScore}, expansion ${breakdown.expansionRecoveryScore}, portfolio ${breakdown.portfolioRecoveryScore}, and capital ${breakdown.capitalRecoveryScore}.`,
  `Enterprise recovery maturity is ${breakdown.enterpriseRecoveryMaturityScore}.`,
  "This module is deterministic, explainable, read-only, compliance-first, and limited to human-reviewed governance and operational review signals.",
];

const buildTrace = (
  input: EnterpriseRecoveryPlanningInput,
  breakdown: EnterpriseRecoveryPlanningScoreBreakdown,
): string[] => [
  "Normalized all direct numeric inputs to a 0-100 deterministic scoring range.",
  "Used only optional read-only upstream intelligence profiles as fallback signals when direct recovery inputs were absent.",
  "Treated every recovery dimension as higher-is-better readiness; no recovery plan is executed or automated.",
  `Computed overallRecoveryScore=${breakdown.overallScore} with dataQualityScore=${typeof input.dataQualityScore === "number" ? normalizeCorridorScore(input.dataQualityScore) : "not provided"}.`,
  "No outreach, database writes, schema changes, automation execution, recovery execution, market prediction, or financial/legal/HR advice was generated.",
];

const buildAssumptions = (input: EnterpriseRecoveryPlanningInput, missingData: string[]): string[] =>
  unique([
    ...(input.assumptions ?? []),
    "All recovery-planning inputs are deterministic structured signals supplied by human-reviewed systems.",
    "No live market, banking, financial, demographic, protected-class, or scraped data is used.",
    "Recovery readiness scores represent review flags only and do not trigger autonomous actions, mitigation, or execution.",
    ...(missingData.length > 0
      ? ["Some recovery-planning dimensions were inferred from available read-only profile fallbacks or neutral deterministic defaults."]
      : []),
  ]);

export function analyzeEnterpriseRecoveryPlanningIntelligence(
  input: EnterpriseRecoveryPlanningInput = {},
): EnterpriseRecoveryPlanningResult {
  const scoreBreakdown = buildScoreBreakdown(input);
  const missingData = getMissingData(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const recoveryReadinessLevel = classifyRecoveryReadiness(scoreBreakdown);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallRecoveryScore: scoreBreakdown.overallScore,
    recoveryReadinessLevel,
    operationalRecoveryScore: scoreBreakdown.operationalRecoveryScore,
    governanceRecoveryScore: scoreBreakdown.governanceRecoveryScore,
    leadershipRecoveryScore: scoreBreakdown.leadershipRecoveryScore,
    technologyRecoveryScore: scoreBreakdown.technologyRecoveryScore,
    communicationRecoveryScore: scoreBreakdown.communicationRecoveryScore,
    expansionRecoveryScore: scoreBreakdown.expansionRecoveryScore,
    portfolioRecoveryScore: scoreBreakdown.portfolioRecoveryScore,
    capitalRecoveryScore: scoreBreakdown.capitalRecoveryScore,
    organizationalRecoveryScore: scoreBreakdown.organizationalRecoveryScore,
    enterpriseRecoveryMaturityScore: scoreBreakdown.enterpriseRecoveryMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    recoveryWarnings: warnings.map((warning) => warning.message),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input),
    explanation: buildExplanation(scoreBreakdown, recoveryReadinessLevel),
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
      recoveryExecution: false,
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

export const getEnterpriseRecoveryPlanningIntelligence =
  analyzeEnterpriseRecoveryPlanningIntelligence;
