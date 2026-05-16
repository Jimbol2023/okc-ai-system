import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import {
  calculateCorridorConfidence,
  createCorridorWarning,
  normalizeCorridorScore,
} from "./corridor-intelligence-utils";

export type ContingencyReadinessLevel = "critical" | "thin" | "developing" | "contingency_ready" | "institutional_grade";

export type EnterpriseContingencyPlanningInput = {
  operationalContingencyScore?: number;
  governanceContingencyScore?: number;
  leadershipAbsenceContingencyScore?: number;
  capitalPressureContingencyScore?: number;
  leadFlowContingencyScore?: number;
  communicationOverloadContingencyScore?: number;
  portfolioUnderperformanceContingencyScore?: number;
  technologyDisruptionContingencyScore?: number;
  expansionStressContingencyScore?: number;
  enterpriseContingencyMaturityScore?: number;
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
  founderDependencyProfile?: unknown;
  institutionalKnowledgeTransferProfile?: unknown;
  portfolioRiskProfile?: unknown;
  portfolioCorrelationProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseContingencyPlanningScoreBreakdown = CorridorScoreBreakdown & {
  overallScore: number;
  operationalContingencyScore: number;
  governanceContingencyScore: number;
  leadershipAbsenceContingencyScore: number;
  capitalPressureContingencyScore: number;
  leadFlowContingencyScore: number;
  communicationOverloadContingencyScore: number;
  portfolioUnderperformanceContingencyScore: number;
  technologyDisruptionContingencyScore: number;
  expansionStressContingencyScore: number;
  enterpriseContingencyMaturityScore: number;
};

export type EnterpriseContingencyPlanningResult = {
  overallContingencyScore: number;
  contingencyReadinessLevel: ContingencyReadinessLevel;
  operationalContingencyScore: number;
  governanceContingencyScore: number;
  leadershipAbsenceContingencyScore: number;
  capitalPressureContingencyScore: number;
  leadFlowContingencyScore: number;
  communicationOverloadContingencyScore: number;
  portfolioUnderperformanceContingencyScore: number;
  technologyDisruptionContingencyScore: number;
  expansionStressContingencyScore: number;
  enterpriseContingencyMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseContingencyPlanningScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  contingencyWarnings: string[];
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
    contingencyExecution: false;
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
  "operationalContingencyScore",
  "governanceContingencyScore",
  "leadershipAbsenceContingencyScore",
  "capitalPressureContingencyScore",
  "leadFlowContingencyScore",
  "communicationOverloadContingencyScore",
  "portfolioUnderperformanceContingencyScore",
  "technologyDisruptionContingencyScore",
  "expansionStressContingencyScore",
  "enterpriseContingencyMaturityScore",
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
  input: EnterpriseContingencyPlanningInput,
  key: keyof EnterpriseContingencyPlanningInput,
  fallback: number,
): number => {
  const value = input[key];
  return typeof value === "number" && Number.isFinite(value)
    ? normalizeCorridorScore(value)
    : normalizeCorridorScore(fallback);
};

const hasFallbackForInput = (
  input: EnterpriseContingencyPlanningInput,
  key: (typeof REQUIRED_INPUTS)[number],
): boolean => {
  switch (key) {
    case "operationalContingencyScore":
      return (
        hasProfileScore(input.enterpriseScenarioPlanningProfile, ["operationalOverloadReadinessScore"]) ||
        hasProfileScore(input.enterpriseStressTestProfile, ["operationalStressScore"]) ||
        hasProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore", "overallPlaybookReadinessScore"])
      );
    case "governanceContingencyScore":
      return (
        hasProfileScore(input.enterpriseScenarioPlanningProfile, ["governanceStrainReadinessScore"]) ||
        hasProfileScore(input.enterpriseStressTestProfile, ["governanceStressScore"]) ||
        hasProfileScore(input.enterpriseDecisionRightsProfile, ["overallDecisionRightsScore"]) ||
        hasProfileScore(input.enterpriseAccountabilityProfile, ["governanceAccountabilityScore"])
      );
    case "leadershipAbsenceContingencyScore":
      return (
        hasProfileScore(input.enterpriseScenarioPlanningProfile, ["leadershipDisruptionReadinessScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["leadershipSurvivabilityScore"]) ||
        hasProfileScore(input.founderDependencyProfile, ["continuityReadinessScore", "backupLeadershipReadinessScore"])
      );
    case "capitalPressureContingencyScore":
      return (
        hasProfileScore(input.enterpriseScenarioPlanningProfile, ["capitalPressureReadinessScore"]) ||
        hasProfileScore(input.enterpriseStressTestProfile, ["capitalStressScore"]) ||
        hasProfileScore(input.strategicTreasuryProfile, ["liquidityDurability", "reserveResilienceQuality"])
      );
    case "leadFlowContingencyScore":
      return (
        hasProfileScore(input.enterpriseScenarioPlanningProfile, ["leadFlowDeclineReadinessScore"]) ||
        hasProfileScore(input.enterpriseStressTestProfile, ["leadFlowStressScore"]) ||
        hasProfileScore(input.operationalPlaybookProfile, ["followUpPlaybookScore", "marketingPlaybookScore"])
      );
    case "communicationOverloadContingencyScore":
      return (
        hasProfileScore(input.enterpriseScenarioPlanningProfile, ["communicationOverloadReadinessScore"]) ||
        hasProfileScore(input.enterpriseStressTestProfile, ["communicationLoadStressScore"]) ||
        hasProfileScore(input.operationalQaProcessDriftProfile, ["communicationConsistencyScore"])
      );
    case "portfolioUnderperformanceContingencyScore":
      return (
        hasProfileScore(input.enterpriseScenarioPlanningProfile, ["portfolioUnderperformanceReadinessScore"]) ||
        hasProfileScore(input.operationalPlaybookProfile, ["portfolioReviewPlaybookScore"]) ||
        hasProfileScore(input.portfolioRiskProfile, ["portfolioRiskScore", "concentrationRiskScore"])
      );
    case "technologyDisruptionContingencyScore":
      return (
        hasProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]) ||
        hasProfileScore(input.institutionalKnowledgeTransferProfile, [
          "accessKnowledgeRiskScore",
          "continuityHandoffScore",
          "institutionalMemoryScore",
        ]) ||
        hasProfileScore(input.enterpriseRiskProfile, ["operationalContinuityResilience"])
      );
    case "expansionStressContingencyScore":
      return (
        hasProfileScore(input.enterpriseScenarioPlanningProfile, ["expansionStressReadinessScore"]) ||
        hasProfileScore(input.enterpriseStressTestProfile, ["expansionPressureStressScore"]) ||
        hasProfileScore(input.enterpriseExpansionGovernanceProfile, ["expansionControlQuality", "expansionOversightQuality"])
      );
    case "enterpriseContingencyMaturityScore":
      return (
        hasProfileScore(input.enterpriseScenarioPlanningProfile, ["scenarioPlanningMaturityScore"]) ||
        hasProfileScore(input.enterpriseStressTestProfile, ["enterpriseStressTestMaturityScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["enterpriseResilienceMaturityScore"]) ||
        hasProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"])
      );
  }
};

const getMissingData = (input: EnterpriseContingencyPlanningInput): string[] =>
  REQUIRED_INPUTS.filter((key) => typeof input[key] !== "number" && !hasFallbackForInput(input, key));

const buildScoreBreakdown = (
  input: EnterpriseContingencyPlanningInput,
): EnterpriseContingencyPlanningScoreBreakdown => {
  const operationalContingencyScore = getScore(
    input,
    "operationalContingencyScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseScenarioPlanningProfile, ["operationalOverloadReadinessScore"]), 0.24],
      [extractProfileScore(input.enterpriseStressTestProfile, ["operationalStressScore"]), 0.2],
      [extractProfileScore(input.enterpriseResilienceProfile, ["operationalResilienceScore"]), 0.18],
      [extractProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]), 0.16],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["overallOperationalConsistencyScore"]), 0.12],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"]), 0.1],
    ]),
  );

  const governanceContingencyScore = getScore(
    input,
    "governanceContingencyScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseScenarioPlanningProfile, ["governanceStrainReadinessScore"]), 0.24],
      [extractProfileScore(input.enterpriseStressTestProfile, ["governanceStressScore"]), 0.18],
      [extractProfileScore(input.enterpriseResilienceProfile, ["governanceResilienceScore"]), 0.16],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["overallDecisionRightsScore"]), 0.16],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["governanceAccountabilityScore"]), 0.14],
      [100 - extractProfileScore(input.enterpriseRiskProfile, ["governanceFragilityExposure"], 48), 0.12],
    ]),
  );

  const leadershipAbsenceContingencyScore = getScore(
    input,
    "leadershipAbsenceContingencyScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseScenarioPlanningProfile, ["leadershipDisruptionReadinessScore"]), 0.24],
      [extractProfileScore(input.enterpriseResilienceProfile, ["leadershipSurvivabilityScore"]), 0.2],
      [extractProfileScore(input.founderDependencyProfile, ["continuityReadinessScore"]), 0.18],
      [extractProfileScore(input.founderDependencyProfile, ["backupLeadershipReadinessScore"]), 0.18],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["continuityAccountabilityScore"]), 0.1],
      [100 - extractProfileScore(input.enterpriseStressTestProfile, ["leadershipDependencyStressScore"], 48), 0.1],
    ]),
  );

  const capitalPressureContingencyScore = getScore(
    input,
    "capitalPressureContingencyScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseScenarioPlanningProfile, ["capitalPressureReadinessScore"]), 0.24],
      [extractProfileScore(input.enterpriseStressTestProfile, ["capitalStressScore"]), 0.2],
      [extractProfileScore(input.strategicTreasuryProfile, ["liquidityDurability"]), 0.18],
      [extractProfileScore(input.strategicTreasuryProfile, ["reserveResilienceQuality"]), 0.18],
      [extractProfileScore(input.strategicTreasuryProfile, ["defensiveReserveBalance"]), 0.12],
      [extractProfileScore(input.enterpriseResilienceProfile, ["recoveryReadinessScore"]), 0.08],
    ]),
  );

  const leadFlowContingencyScore = getScore(
    input,
    "leadFlowContingencyScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseScenarioPlanningProfile, ["leadFlowDeclineReadinessScore"]), 0.24],
      [extractProfileScore(input.enterpriseStressTestProfile, ["leadFlowStressScore"]), 0.2],
      [extractProfileScore(input.operationalPlaybookProfile, ["followUpPlaybookScore"]), 0.18],
      [extractProfileScore(input.operationalPlaybookProfile, ["marketingPlaybookScore"]), 0.14],
      [extractProfileScore(input.processOptimizationProfile, ["followUpEfficiencyScore"]), 0.12],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["followUpRhythmScore"]), 0.12],
    ]),
  );

  const communicationOverloadContingencyScore = getScore(
    input,
    "communicationOverloadContingencyScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseScenarioPlanningProfile, ["communicationOverloadReadinessScore"]), 0.24],
      [100 - extractProfileScore(input.enterpriseStressTestProfile, ["communicationLoadStressScore"], 48), 0.2],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["communicationConsistencyScore"]), 0.18],
      [extractProfileScore(input.processOptimizationProfile, ["communicationEfficiencyScore"]), 0.16],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["escalationClarityScore"]), 0.12],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["escalationAuthorityScore"]), 0.1],
    ]),
  );

  const portfolioUnderperformanceContingencyScore = getScore(
    input,
    "portfolioUnderperformanceContingencyScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseScenarioPlanningProfile, ["portfolioUnderperformanceReadinessScore"]), 0.24],
      [100 - extractProfileScore(input.enterpriseStressTestProfile, ["portfolioConcentrationStressScore"], 48), 0.18],
      [extractProfileScore(input.operationalPlaybookProfile, ["portfolioReviewPlaybookScore"]), 0.16],
      [100 - extractProfileScore(input.portfolioRiskProfile, ["portfolioRiskScore", "concentrationRiskScore"], 48), 0.16],
      [100 - extractProfileScore(input.portfolioCorrelationProfile, ["portfolioCorrelationRisk", "correlationRiskScore"], 48), 0.14],
      [extractProfileScore(input.enterpriseRiskProfile, ["diversificationResilienceQuality"]), 0.12],
    ]),
  );

  const technologyDisruptionContingencyScore = getScore(
    input,
    "technologyDisruptionContingencyScore",
    weightedAverage([
      [extractProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]), 0.24],
      [extractProfileScore(input.institutionalKnowledgeTransferProfile, ["continuityHandoffScore"]), 0.18],
      [extractProfileScore(input.institutionalKnowledgeTransferProfile, ["institutionalMemoryScore"]), 0.16],
      [100 - extractProfileScore(input.institutionalKnowledgeTransferProfile, ["accessKnowledgeRiskScore"], 48), 0.16],
      [extractProfileScore(input.enterpriseRiskProfile, ["operationalContinuityResilience"]), 0.14],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"]), 0.12],
    ]),
  );

  const expansionStressContingencyScore = getScore(
    input,
    "expansionStressContingencyScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseScenarioPlanningProfile, ["expansionStressReadinessScore"]), 0.24],
      [100 - extractProfileScore(input.enterpriseStressTestProfile, ["expansionPressureStressScore"], 48), 0.18],
      [extractProfileScore(input.enterpriseResilienceProfile, ["expansionStressDurabilityScore"]), 0.16],
      [extractProfileScore(input.enterpriseExpansionGovernanceProfile, ["expansionControlQuality"]), 0.16],
      [extractProfileScore(input.enterpriseExpansionGovernanceProfile, ["expansionOversightQuality"]), 0.14],
      [extractProfileScore(input.strategicTreasuryProfile, ["expansionLiquidityResilience"]), 0.12],
    ]),
  );

  const enterpriseContingencyMaturityScore = getScore(
    input,
    "enterpriseContingencyMaturityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseScenarioPlanningProfile, ["scenarioPlanningMaturityScore"]), 0.2],
      [extractProfileScore(input.enterpriseStressTestProfile, ["enterpriseStressTestMaturityScore"]), 0.18],
      [extractProfileScore(input.enterpriseResilienceProfile, ["enterpriseResilienceMaturityScore"]), 0.16],
      [extractProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]), 0.16],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["accountabilityMaturityScore"]), 0.16],
    ]),
  );

  const overallScore = weightedAverage([
    [operationalContingencyScore, 0.12],
    [governanceContingencyScore, 0.11],
    [leadershipAbsenceContingencyScore, 0.1],
    [capitalPressureContingencyScore, 0.11],
    [leadFlowContingencyScore, 0.1],
    [communicationOverloadContingencyScore, 0.09],
    [portfolioUnderperformanceContingencyScore, 0.1],
    [technologyDisruptionContingencyScore, 0.1],
    [expansionStressContingencyScore, 0.09],
    [enterpriseContingencyMaturityScore, 0.08],
  ]);

  return {
    connectivityScore: communicationOverloadContingencyScore,
    durabilityScore: overallScore,
    expansionScore: expansionStressContingencyScore,
    institutionalScore: enterpriseContingencyMaturityScore,
    logisticsScore: operationalContingencyScore,
    luxuryScore: capitalPressureContingencyScore,
    developmentScore: technologyDisruptionContingencyScore,
    overallScore,
    operationalContingencyScore,
    governanceContingencyScore,
    leadershipAbsenceContingencyScore,
    capitalPressureContingencyScore,
    leadFlowContingencyScore,
    communicationOverloadContingencyScore,
    portfolioUnderperformanceContingencyScore,
    technologyDisruptionContingencyScore,
    expansionStressContingencyScore,
    enterpriseContingencyMaturityScore,
  };
};

const classifyContingencyReadiness = (
  breakdown: EnterpriseContingencyPlanningScoreBreakdown,
): ContingencyReadinessLevel => {
  const criticalMinimum = Math.min(
    breakdown.operationalContingencyScore,
    breakdown.governanceContingencyScore,
    breakdown.leadershipAbsenceContingencyScore,
    breakdown.technologyDisruptionContingencyScore,
  );

  if (breakdown.overallScore >= 82 && criticalMinimum >= 72 && breakdown.enterpriseContingencyMaturityScore >= 76) {
    return "institutional_grade";
  }
  if (breakdown.overallScore >= 68 && criticalMinimum >= 58) return "contingency_ready";
  if (breakdown.overallScore >= 54) return "developing";
  if (breakdown.overallScore >= 40) return "thin";
  return "critical";
};

const buildWarnings = (
  breakdown: EnterpriseContingencyPlanningScoreBreakdown,
  missingData: string[],
): CorridorWarning[] => [
  ...(missingData.length > 0
    ? [
        createCorridorWarning({
          code: "ENTERPRISE_CONTINGENCY_DATA_INCOMPLETE",
          severity: missingData.length >= 5 ? "high" : "medium",
          message: "Enterprise contingency planning assessment is using incomplete structured inputs and requires human verification.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.overallScore < 42
    ? [
        createCorridorWarning({
          code: "ENTERPRISE_CONTINGENCY_WEAK",
          severity: "high",
          message: "Enterprise contingency readiness is weak under current structured inputs.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.capitalPressureContingencyScore < 45
    ? [
        createCorridorWarning({
          code: "CAPITAL_PRESSURE_CONTINGENCY_WEAK",
          severity: "high",
          message: "Capital pressure contingency readiness is weak; this is not financial, lending, or investment advice.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.leadershipAbsenceContingencyScore < 45
    ? [
        createCorridorWarning({
          code: "LEADERSHIP_ABSENCE_CONTINGENCY_WEAK",
          severity: "medium",
          message: "Leadership absence contingency readiness is weak and requires human continuity review.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.technologyDisruptionContingencyScore < 45
    ? [
        createCorridorWarning({
          code: "TECHNOLOGY_DISRUPTION_CONTINGENCY_WEAK",
          severity: "medium",
          message: "Technology disruption contingency readiness is weak; this module does not execute technology changes.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
];

const buildKeyRisks = (breakdown: EnterpriseContingencyPlanningScoreBreakdown): string[] =>
  unique([
    ...(breakdown.operationalContingencyScore < 55 ? ["Operational contingency readiness may be thin."] : []),
    ...(breakdown.governanceContingencyScore < 55 ? ["Governance contingency readiness may be thin."] : []),
    ...(breakdown.leadershipAbsenceContingencyScore < 55
      ? ["Leadership absence contingency readiness may depend on narrow continuity capacity."]
      : []),
    ...(breakdown.capitalPressureContingencyScore < 55
      ? ["Capital pressure contingency readiness may be thin; this is not financial or lending advice."]
      : []),
    ...(breakdown.leadFlowContingencyScore < 55 ? ["Lead-flow disruption contingency readiness may be thin."] : []),
    ...(breakdown.communicationOverloadContingencyScore < 55
      ? ["Communication overload contingency readiness may be thin."]
      : []),
    ...(breakdown.portfolioUnderperformanceContingencyScore < 55
      ? ["Portfolio underperformance contingency readiness may be thin; this is not portfolio-management advice."]
      : []),
    ...(breakdown.technologyDisruptionContingencyScore < 55
      ? ["Technology disruption contingency readiness may be thin."]
      : []),
    ...(breakdown.expansionStressContingencyScore < 55 ? ["Expansion stress contingency readiness may be thin."] : []),
  ]);

const buildStrengths = (breakdown: EnterpriseContingencyPlanningScoreBreakdown): string[] =>
  unique([
    ...(breakdown.operationalContingencyScore >= 72 ? ["Operational contingency readiness appears durable."] : []),
    ...(breakdown.governanceContingencyScore >= 72 ? ["Governance contingency readiness appears durable."] : []),
    ...(breakdown.leadershipAbsenceContingencyScore >= 72 ? ["Leadership absence contingency readiness appears durable."] : []),
    ...(breakdown.capitalPressureContingencyScore >= 72
      ? ["Capital pressure contingency readiness appears durable without execution behavior."]
      : []),
    ...(breakdown.leadFlowContingencyScore >= 72 ? ["Lead-flow disruption contingency readiness appears durable."] : []),
    ...(breakdown.technologyDisruptionContingencyScore >= 72
      ? ["Technology disruption contingency readiness appears durable."]
      : []),
    ...(breakdown.expansionStressContingencyScore >= 72 ? ["Expansion stress contingency readiness appears durable."] : []),
    ...(breakdown.enterpriseContingencyMaturityScore >= 72
      ? ["Enterprise contingency maturity appears institutionally reviewable."]
      : []),
  ]);

const buildRecommendations = (breakdown: EnterpriseContingencyPlanningScoreBreakdown): string[] =>
  unique([
    ...(breakdown.operationalContingencyScore < 65
      ? ["Review operational contingency backup plans and continuity handoffs through human-approved operating reviews."]
      : []),
    ...(breakdown.governanceContingencyScore < 65
      ? ["Review governance contingency backups without creating legal, ownership, tax, or management directives."]
      : []),
    ...(breakdown.leadershipAbsenceContingencyScore < 65
      ? ["Review leadership absence contingency backups without creating HR, ownership, or legal advice."]
      : []),
    ...(breakdown.capitalPressureContingencyScore < 65
      ? ["Review capital pressure contingency readiness; this is not financial, lending, investment, or treasury advice."]
      : []),
    ...(breakdown.leadFlowContingencyScore < 65
      ? ["Review lead-flow disruption contingencies and follow-up playbooks without automating outreach."]
      : []),
    ...(breakdown.communicationOverloadContingencyScore < 65
      ? ["Review communication overload contingencies and escalation clarity without sending messages."]
      : []),
    ...(breakdown.portfolioUnderperformanceContingencyScore < 65
      ? ["Review portfolio underperformance contingencies as governance signals, not portfolio-management advice."]
      : []),
    ...(breakdown.technologyDisruptionContingencyScore < 65
      ? ["Review technology disruption contingencies as operational readiness checks only; no technology execution is performed."]
      : []),
    ...(breakdown.expansionStressContingencyScore < 65
      ? ["Review expansion stress contingencies before strategic discussions; no expansion decision is automated."]
      : []),
    "Use this module as read-only contingency planning intelligence for human review, not as an autonomous action or contingency execution system.",
  ]);

const buildReusableInfrastructureNotes = (input: EnterpriseContingencyPlanningInput): string[] =>
  unique([
    "Reuses corridor scoring utilities for normalization, warnings, and confidence.",
    "Designed as a pure TypeScript module with deterministic structured inputs and explainable outputs.",
    ...(input.enterpriseScenarioPlanningProfile
      ? ["Can consume scenario planning intelligence as read-only contingency context."]
      : []),
    ...(input.enterpriseStressTestProfile ? ["Can consume stress-test intelligence as read-only stress context."] : []),
    ...(input.operationalPlaybookProfile ? ["Can consume operational playbook intelligence as read-only backup-plan context."] : []),
    ...(input.institutionalKnowledgeTransferProfile
      ? ["Can consume institutional knowledge transfer intelligence as read-only technology and handoff context."]
      : []),
    ...(input.strategicTreasuryProfile
      ? ["Can consume strategic treasury intelligence as read-only capital pressure contingency context."]
      : []),
  ]);

const buildExplanation = (
  breakdown: EnterpriseContingencyPlanningScoreBreakdown,
  contingencyReadinessLevel: ContingencyReadinessLevel,
): string[] => [
  `Overall contingency score is ${breakdown.overallScore}, classified as ${contingencyReadinessLevel}.`,
  `Core contingencies include operational ${breakdown.operationalContingencyScore}, governance ${breakdown.governanceContingencyScore}, leadership absence ${breakdown.leadershipAbsenceContingencyScore}, and technology disruption ${breakdown.technologyDisruptionContingencyScore}.`,
  `Business pressure contingencies include capital pressure ${breakdown.capitalPressureContingencyScore}, lead-flow disruption ${breakdown.leadFlowContingencyScore}, communication overload ${breakdown.communicationOverloadContingencyScore}, portfolio underperformance ${breakdown.portfolioUnderperformanceContingencyScore}, and expansion stress ${breakdown.expansionStressContingencyScore}.`,
  `Enterprise contingency maturity is ${breakdown.enterpriseContingencyMaturityScore}.`,
  "This module is deterministic, explainable, read-only, compliance-first, and limited to human-reviewed governance and operational review signals.",
];

const buildTrace = (
  input: EnterpriseContingencyPlanningInput,
  breakdown: EnterpriseContingencyPlanningScoreBreakdown,
): string[] => [
  "Normalized all direct numeric inputs to a 0-100 deterministic scoring range.",
  "Used only optional read-only upstream intelligence profiles as fallback signals when direct contingency inputs were absent.",
  "Treated every contingency dimension as higher-is-better backup-plan readiness; no contingency is executed or automated.",
  `Computed overallContingencyScore=${breakdown.overallScore} with dataQualityScore=${typeof input.dataQualityScore === "number" ? normalizeCorridorScore(input.dataQualityScore) : "not provided"}.`,
  "No outreach, database writes, schema changes, automation execution, contingency execution, market prediction, or financial/legal/HR advice was generated.",
];

const buildAssumptions = (input: EnterpriseContingencyPlanningInput, missingData: string[]): string[] =>
  unique([
    ...(input.assumptions ?? []),
    "All contingency-planning inputs are deterministic structured signals supplied by human-reviewed systems.",
    "No live market, banking, financial, demographic, protected-class, or scraped data is used.",
    "Contingency readiness scores represent review flags only and do not trigger autonomous actions, mitigation, or execution.",
    ...(missingData.length > 0
      ? ["Some contingency-planning dimensions were inferred from available read-only profile fallbacks or neutral deterministic defaults."]
      : []),
  ]);

export function analyzeEnterpriseContingencyPlanningIntelligence(
  input: EnterpriseContingencyPlanningInput = {},
): EnterpriseContingencyPlanningResult {
  const scoreBreakdown = buildScoreBreakdown(input);
  const missingData = getMissingData(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const contingencyReadinessLevel = classifyContingencyReadiness(scoreBreakdown);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallContingencyScore: scoreBreakdown.overallScore,
    contingencyReadinessLevel,
    operationalContingencyScore: scoreBreakdown.operationalContingencyScore,
    governanceContingencyScore: scoreBreakdown.governanceContingencyScore,
    leadershipAbsenceContingencyScore: scoreBreakdown.leadershipAbsenceContingencyScore,
    capitalPressureContingencyScore: scoreBreakdown.capitalPressureContingencyScore,
    leadFlowContingencyScore: scoreBreakdown.leadFlowContingencyScore,
    communicationOverloadContingencyScore: scoreBreakdown.communicationOverloadContingencyScore,
    portfolioUnderperformanceContingencyScore: scoreBreakdown.portfolioUnderperformanceContingencyScore,
    technologyDisruptionContingencyScore: scoreBreakdown.technologyDisruptionContingencyScore,
    expansionStressContingencyScore: scoreBreakdown.expansionStressContingencyScore,
    enterpriseContingencyMaturityScore: scoreBreakdown.enterpriseContingencyMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    contingencyWarnings: warnings.map((warning) => warning.message),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input),
    explanation: buildExplanation(scoreBreakdown, contingencyReadinessLevel),
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
      contingencyExecution: false,
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

export const getEnterpriseContingencyPlanningIntelligence =
  analyzeEnterpriseContingencyPlanningIntelligence;
