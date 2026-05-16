import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import {
  calculateCorridorConfidence,
  createCorridorWarning,
  normalizeCorridorScore,
} from "./corridor-intelligence-utils";

export type ScenarioReadinessLevel = "unprepared" | "thin" | "developing" | "scenario_ready" | "institutional_grade";

export type EnterpriseScenarioPlanningInput = {
  marketContractionReadinessScore?: number;
  leadFlowDeclineReadinessScore?: number;
  capitalPressureReadinessScore?: number;
  operationalOverloadReadinessScore?: number;
  leadershipDisruptionReadinessScore?: number;
  expansionStressReadinessScore?: number;
  portfolioUnderperformanceReadinessScore?: number;
  communicationOverloadReadinessScore?: number;
  governanceStrainReadinessScore?: number;
  scenarioPlanningMaturityScore?: number;
  enterpriseStressTestProfile?: unknown;
  enterpriseResilienceProfile?: unknown;
  enterpriseRiskProfile?: unknown;
  strategicTreasuryProfile?: unknown;
  enterpriseExpansionGovernanceProfile?: unknown;
  enterpriseOperatingRhythmProfile?: unknown;
  enterpriseAccountabilityProfile?: unknown;
  enterpriseDecisionRightsProfile?: unknown;
  operationalPlaybookProfile?: unknown;
  operationalQaProcessDriftProfile?: unknown;
  processOptimizationProfile?: unknown;
  founderDependencyProfile?: unknown;
  portfolioRiskProfile?: unknown;
  portfolioCorrelationProfile?: unknown;
  enterpriseStrategicReviewProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseScenarioPlanningScoreBreakdown = CorridorScoreBreakdown & {
  overallScore: number;
  marketContractionReadinessScore: number;
  leadFlowDeclineReadinessScore: number;
  capitalPressureReadinessScore: number;
  operationalOverloadReadinessScore: number;
  leadershipDisruptionReadinessScore: number;
  expansionStressReadinessScore: number;
  portfolioUnderperformanceReadinessScore: number;
  communicationOverloadReadinessScore: number;
  governanceStrainReadinessScore: number;
  scenarioPlanningMaturityScore: number;
};

export type EnterpriseScenarioPlanningResult = {
  overallScenarioPlanningScore: number;
  scenarioReadinessLevel: ScenarioReadinessLevel;
  marketContractionReadinessScore: number;
  leadFlowDeclineReadinessScore: number;
  capitalPressureReadinessScore: number;
  operationalOverloadReadinessScore: number;
  leadershipDisruptionReadinessScore: number;
  expansionStressReadinessScore: number;
  portfolioUnderperformanceReadinessScore: number;
  communicationOverloadReadinessScore: number;
  governanceStrainReadinessScore: number;
  scenarioPlanningMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseScenarioPlanningScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  scenarioWarnings: string[];
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
    scenarioExecution: false;
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
  "marketContractionReadinessScore",
  "leadFlowDeclineReadinessScore",
  "capitalPressureReadinessScore",
  "operationalOverloadReadinessScore",
  "leadershipDisruptionReadinessScore",
  "expansionStressReadinessScore",
  "portfolioUnderperformanceReadinessScore",
  "communicationOverloadReadinessScore",
  "governanceStrainReadinessScore",
  "scenarioPlanningMaturityScore",
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
  input: EnterpriseScenarioPlanningInput,
  key: keyof EnterpriseScenarioPlanningInput,
  fallback: number,
): number => {
  const value = input[key];
  return typeof value === "number" && Number.isFinite(value)
    ? normalizeCorridorScore(value)
    : normalizeCorridorScore(fallback);
};

const hasFallbackForInput = (
  input: EnterpriseScenarioPlanningInput,
  key: (typeof REQUIRED_INPUTS)[number],
): boolean => {
  switch (key) {
    case "marketContractionReadinessScore":
      return (
        hasProfileScore(input.enterpriseStressTestProfile, ["overallStressTestScore", "capitalStressScore"]) ||
        hasProfileScore(input.enterpriseRiskProfile, ["strategicSurvivabilityQuality", "systemicSurvivabilityBalance"]) ||
        hasProfileScore(input.strategicTreasuryProfile, ["strategicTreasuryDurability", "liquidityDurability"])
      );
    case "leadFlowDeclineReadinessScore":
      return (
        hasProfileScore(input.enterpriseStressTestProfile, ["leadFlowStressScore"]) ||
        hasProfileScore(input.processOptimizationProfile, ["followUpEfficiencyScore"]) ||
        hasProfileScore(input.operationalPlaybookProfile, ["followUpPlaybookScore", "marketingPlaybookScore"])
      );
    case "capitalPressureReadinessScore":
      return (
        hasProfileScore(input.enterpriseStressTestProfile, ["capitalStressScore"]) ||
        hasProfileScore(input.strategicTreasuryProfile, ["liquidityDurability", "reserveResilienceQuality"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["recoveryReadinessScore"])
      );
    case "operationalOverloadReadinessScore":
      return (
        hasProfileScore(input.enterpriseStressTestProfile, ["operationalStressScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["operationalResilienceScore"]) ||
        hasProfileScore(input.operationalQaProcessDriftProfile, ["overallOperationalConsistencyScore"])
      );
    case "leadershipDisruptionReadinessScore":
      return (
        hasProfileScore(input.enterpriseStressTestProfile, ["leadershipDependencyStressScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["leadershipSurvivabilityScore"]) ||
        hasProfileScore(input.founderDependencyProfile, ["continuityReadinessScore", "backupLeadershipReadinessScore"])
      );
    case "expansionStressReadinessScore":
      return (
        hasProfileScore(input.enterpriseStressTestProfile, ["expansionPressureStressScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["expansionStressDurabilityScore", "scalingFragilityScore"]) ||
        hasProfileScore(input.enterpriseExpansionGovernanceProfile, ["expansionControlQuality", "expansionOversightQuality"])
      );
    case "portfolioUnderperformanceReadinessScore":
      return (
        hasProfileScore(input.portfolioRiskProfile, ["portfolioRiskScore", "portfolioBalanceScore"]) ||
        hasProfileScore(input.portfolioCorrelationProfile, ["portfolioCorrelationRisk", "correlationRiskScore"]) ||
        hasProfileScore(input.enterpriseStressTestProfile, ["portfolioConcentrationStressScore"])
      );
    case "communicationOverloadReadinessScore":
      return (
        hasProfileScore(input.enterpriseStressTestProfile, ["communicationLoadStressScore"]) ||
        hasProfileScore(input.processOptimizationProfile, ["communicationEfficiencyScore"]) ||
        hasProfileScore(input.operationalQaProcessDriftProfile, ["communicationConsistencyScore"])
      );
    case "governanceStrainReadinessScore":
      return (
        hasProfileScore(input.enterpriseStressTestProfile, ["governanceStressScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["governanceResilienceScore"]) ||
        hasProfileScore(input.enterpriseDecisionRightsProfile, ["overallDecisionRightsScore"]) ||
        hasProfileScore(input.enterpriseStrategicReviewProfile, ["governanceReviewScore"])
      );
    case "scenarioPlanningMaturityScore":
      return (
        hasProfileScore(input.enterpriseStressTestProfile, ["enterpriseStressTestMaturityScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["enterpriseResilienceMaturityScore"]) ||
        hasProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"]) ||
        hasProfileScore(input.enterpriseStrategicReviewProfile, ["strategicReviewMaturityScore"])
      );
  }
};

const getMissingData = (input: EnterpriseScenarioPlanningInput): string[] =>
  REQUIRED_INPUTS.filter((key) => typeof input[key] !== "number" && !hasFallbackForInput(input, key));

const buildScoreBreakdown = (input: EnterpriseScenarioPlanningInput): EnterpriseScenarioPlanningScoreBreakdown => {
  const marketContractionReadinessScore = getScore(
    input,
    "marketContractionReadinessScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseStressTestProfile, ["overallStressTestScore"]), 0.22],
      [extractProfileScore(input.enterpriseRiskProfile, ["strategicSurvivabilityQuality", "systemicSurvivabilityBalance"]), 0.2],
      [extractProfileScore(input.strategicTreasuryProfile, ["strategicTreasuryDurability"]), 0.18],
      [extractProfileScore(input.strategicTreasuryProfile, ["liquidityDurability"]), 0.16],
      [extractProfileScore(input.enterpriseResilienceProfile, ["strategicResilienceScore"]), 0.14],
      [extractProfileScore(input.enterpriseStrategicReviewProfile, ["longHorizonReviewScore"]), 0.1],
    ]),
  );

  const leadFlowDeclineReadinessScore = getScore(
    input,
    "leadFlowDeclineReadinessScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseStressTestProfile, ["leadFlowStressScore"]), 0.24],
      [extractProfileScore(input.processOptimizationProfile, ["followUpEfficiencyScore"]), 0.18],
      [extractProfileScore(input.operationalPlaybookProfile, ["followUpPlaybookScore"]), 0.18],
      [extractProfileScore(input.operationalPlaybookProfile, ["marketingPlaybookScore"]), 0.14],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["followUpConsistencyScore"]), 0.14],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["followUpRhythmScore"]), 0.12],
    ]),
  );

  const capitalPressureReadinessScore = getScore(
    input,
    "capitalPressureReadinessScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseStressTestProfile, ["capitalStressScore"]), 0.24],
      [extractProfileScore(input.strategicTreasuryProfile, ["liquidityDurability"]), 0.2],
      [extractProfileScore(input.strategicTreasuryProfile, ["reserveResilienceQuality"]), 0.2],
      [extractProfileScore(input.strategicTreasuryProfile, ["defensiveReserveBalance"]), 0.16],
      [extractProfileScore(input.enterpriseResilienceProfile, ["recoveryReadinessScore"]), 0.12],
      [extractProfileScore(input.enterpriseRiskProfile, ["enterpriseRiskDurability"]), 0.08],
    ]),
  );

  const operationalOverloadReadinessScore = getScore(
    input,
    "operationalOverloadReadinessScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseStressTestProfile, ["operationalStressScore"]), 0.24],
      [extractProfileScore(input.enterpriseResilienceProfile, ["operationalResilienceScore"]), 0.2],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["overallOperationalConsistencyScore"]), 0.18],
      [extractProfileScore(input.operationalPlaybookProfile, ["overallPlaybookReadinessScore"]), 0.16],
      [extractProfileScore(input.processOptimizationProfile, ["workflowEfficiencyScore"]), 0.12],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["taskResponsibilityScore"]), 0.1],
    ]),
  );

  const leadershipDisruptionReadinessScore = getScore(
    input,
    "leadershipDisruptionReadinessScore",
    weightedAverage([
      [100 - extractProfileScore(input.enterpriseStressTestProfile, ["leadershipDependencyStressScore"], 48), 0.22],
      [extractProfileScore(input.enterpriseResilienceProfile, ["leadershipSurvivabilityScore"]), 0.22],
      [extractProfileScore(input.founderDependencyProfile, ["continuityReadinessScore"]), 0.18],
      [extractProfileScore(input.founderDependencyProfile, ["backupLeadershipReadinessScore"]), 0.18],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["continuityAccountabilityScore"]), 0.1],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["escalationAuthorityScore"]), 0.1],
    ]),
  );

  const expansionStressReadinessScore = getScore(
    input,
    "expansionStressReadinessScore",
    weightedAverage([
      [100 - extractProfileScore(input.enterpriseStressTestProfile, ["expansionPressureStressScore"], 48), 0.22],
      [extractProfileScore(input.enterpriseResilienceProfile, ["expansionStressDurabilityScore"]), 0.2],
      [100 - extractProfileScore(input.enterpriseResilienceProfile, ["scalingFragilityScore"], 48), 0.16],
      [extractProfileScore(input.enterpriseExpansionGovernanceProfile, ["expansionControlQuality"]), 0.16],
      [extractProfileScore(input.enterpriseExpansionGovernanceProfile, ["expansionOversightQuality"]), 0.14],
      [extractProfileScore(input.strategicTreasuryProfile, ["expansionLiquidityResilience"]), 0.12],
    ]),
  );

  const portfolioUnderperformanceReadinessScore = getScore(
    input,
    "portfolioUnderperformanceReadinessScore",
    weightedAverage([
      [100 - extractProfileScore(input.enterpriseStressTestProfile, ["portfolioConcentrationStressScore"], 48), 0.2],
      [100 - extractProfileScore(input.portfolioRiskProfile, ["portfolioRiskScore", "concentrationRiskScore"], 48), 0.2],
      [100 - extractProfileScore(input.portfolioCorrelationProfile, ["portfolioCorrelationRisk", "correlationRiskScore"], 48), 0.18],
      [extractProfileScore(input.enterpriseRiskProfile, ["diversificationResilienceQuality"]), 0.18],
      [extractProfileScore(input.enterpriseStrategicReviewProfile, ["portfolioReassessmentScore"]), 0.14],
      [extractProfileScore(input.operationalPlaybookProfile, ["portfolioReviewPlaybookScore"]), 0.1],
    ]),
  );

  const communicationOverloadReadinessScore = getScore(
    input,
    "communicationOverloadReadinessScore",
    weightedAverage([
      [100 - extractProfileScore(input.enterpriseStressTestProfile, ["communicationLoadStressScore"], 48), 0.22],
      [extractProfileScore(input.processOptimizationProfile, ["communicationEfficiencyScore"]), 0.2],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["communicationConsistencyScore"]), 0.2],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["operationalTempoScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["escalationClarityScore"]), 0.14],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["escalationAuthorityScore"]), 0.1],
    ]),
  );

  const governanceStrainReadinessScore = getScore(
    input,
    "governanceStrainReadinessScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseStressTestProfile, ["governanceStressScore"]), 0.22],
      [extractProfileScore(input.enterpriseResilienceProfile, ["governanceResilienceScore"]), 0.2],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["overallDecisionRightsScore"]), 0.16],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["governanceAccountabilityScore"]), 0.14],
      [extractProfileScore(input.enterpriseStrategicReviewProfile, ["governanceReviewScore"]), 0.14],
      [100 - extractProfileScore(input.enterpriseRiskProfile, ["governanceFragilityExposure"], 48), 0.14],
    ]),
  );

  const scenarioPlanningMaturityScore = getScore(
    input,
    "scenarioPlanningMaturityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseStressTestProfile, ["enterpriseStressTestMaturityScore"]), 0.2],
      [extractProfileScore(input.enterpriseResilienceProfile, ["enterpriseResilienceMaturityScore"]), 0.18],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"]), 0.16],
      [extractProfileScore(input.enterpriseStrategicReviewProfile, ["strategicReviewMaturityScore"]), 0.16],
      [extractProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["accountabilityMaturityScore"]), 0.16],
    ]),
  );

  const overallScore = weightedAverage([
    [marketContractionReadinessScore, 0.11],
    [leadFlowDeclineReadinessScore, 0.1],
    [capitalPressureReadinessScore, 0.11],
    [operationalOverloadReadinessScore, 0.11],
    [leadershipDisruptionReadinessScore, 0.1],
    [expansionStressReadinessScore, 0.1],
    [portfolioUnderperformanceReadinessScore, 0.1],
    [communicationOverloadReadinessScore, 0.09],
    [governanceStrainReadinessScore, 0.1],
    [scenarioPlanningMaturityScore, 0.08],
  ]);

  return {
    connectivityScore: leadFlowDeclineReadinessScore,
    durabilityScore: overallScore,
    expansionScore: expansionStressReadinessScore,
    institutionalScore: scenarioPlanningMaturityScore,
    logisticsScore: operationalOverloadReadinessScore,
    luxuryScore: capitalPressureReadinessScore,
    developmentScore: marketContractionReadinessScore,
    overallScore,
    marketContractionReadinessScore,
    leadFlowDeclineReadinessScore,
    capitalPressureReadinessScore,
    operationalOverloadReadinessScore,
    leadershipDisruptionReadinessScore,
    expansionStressReadinessScore,
    portfolioUnderperformanceReadinessScore,
    communicationOverloadReadinessScore,
    governanceStrainReadinessScore,
    scenarioPlanningMaturityScore,
  };
};

const classifyScenarioReadiness = (breakdown: EnterpriseScenarioPlanningScoreBreakdown): ScenarioReadinessLevel => {
  const scenarioMinimum = Math.min(
    breakdown.marketContractionReadinessScore,
    breakdown.capitalPressureReadinessScore,
    breakdown.operationalOverloadReadinessScore,
    breakdown.governanceStrainReadinessScore,
  );

  if (breakdown.overallScore >= 82 && scenarioMinimum >= 72 && breakdown.scenarioPlanningMaturityScore >= 76) {
    return "institutional_grade";
  }
  if (breakdown.overallScore >= 68 && scenarioMinimum >= 58) return "scenario_ready";
  if (breakdown.overallScore >= 54) return "developing";
  if (breakdown.overallScore >= 40) return "thin";
  return "unprepared";
};

const buildWarnings = (breakdown: EnterpriseScenarioPlanningScoreBreakdown, missingData: string[]): CorridorWarning[] => [
  ...(missingData.length > 0
    ? [
        createCorridorWarning({
          code: "ENTERPRISE_SCENARIO_PLANNING_DATA_INCOMPLETE",
          severity: missingData.length >= 5 ? "high" : "medium",
          message: "Enterprise scenario-planning assessment is using incomplete structured inputs and requires human verification.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.overallScore < 42
    ? [
        createCorridorWarning({
          code: "ENTERPRISE_SCENARIO_PLANNING_WEAK",
          severity: "high",
          message: "Enterprise scenario-planning readiness is weak under current structured inputs.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.capitalPressureReadinessScore < 45
    ? [
        createCorridorWarning({
          code: "CAPITAL_PRESSURE_SCENARIO_WEAK",
          severity: "high",
          message: "Capital pressure scenario readiness is weak; this is not financial, lending, or investment advice.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.leadershipDisruptionReadinessScore < 45
    ? [
        createCorridorWarning({
          code: "LEADERSHIP_DISRUPTION_SCENARIO_WEAK",
          severity: "medium",
          message: "Leadership disruption scenario readiness is weak and requires human continuity review.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.governanceStrainReadinessScore < 45
    ? [
        createCorridorWarning({
          code: "GOVERNANCE_STRAIN_SCENARIO_WEAK",
          severity: "medium",
          message: "Governance strain scenario readiness is weak; this module does not create legal or governance directives.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
];

const buildKeyRisks = (breakdown: EnterpriseScenarioPlanningScoreBreakdown): string[] =>
  unique([
    ...(breakdown.marketContractionReadinessScore < 55 ? ["Market contraction scenario readiness may be thin."] : []),
    ...(breakdown.leadFlowDeclineReadinessScore < 55 ? ["Lead-flow decline scenario readiness may be thin."] : []),
    ...(breakdown.capitalPressureReadinessScore < 55
      ? ["Capital pressure scenario readiness may be thin; this is not financial or lending advice."]
      : []),
    ...(breakdown.operationalOverloadReadinessScore < 55 ? ["Operational overload scenario readiness may be thin."] : []),
    ...(breakdown.leadershipDisruptionReadinessScore < 55
      ? ["Leadership disruption scenario readiness may depend on narrow continuity capacity."]
      : []),
    ...(breakdown.expansionStressReadinessScore < 55 ? ["Expansion stress scenario readiness may be thin."] : []),
    ...(breakdown.portfolioUnderperformanceReadinessScore < 55
      ? ["Portfolio underperformance scenario readiness may be thin; this is not portfolio-management advice."]
      : []),
    ...(breakdown.communicationOverloadReadinessScore < 55 ? ["Communication overload scenario readiness may be thin."] : []),
    ...(breakdown.governanceStrainReadinessScore < 55 ? ["Governance strain scenario readiness may be thin."] : []),
  ]);

const buildStrengths = (breakdown: EnterpriseScenarioPlanningScoreBreakdown): string[] =>
  unique([
    ...(breakdown.marketContractionReadinessScore >= 72 ? ["Market contraction scenario readiness appears durable."] : []),
    ...(breakdown.leadFlowDeclineReadinessScore >= 72 ? ["Lead-flow decline scenario readiness appears durable."] : []),
    ...(breakdown.capitalPressureReadinessScore >= 72 ? ["Capital pressure scenario readiness appears durable without execution behavior."] : []),
    ...(breakdown.operationalOverloadReadinessScore >= 72 ? ["Operational overload scenario readiness appears durable."] : []),
    ...(breakdown.leadershipDisruptionReadinessScore >= 72 ? ["Leadership disruption scenario readiness appears durable."] : []),
    ...(breakdown.expansionStressReadinessScore >= 72 ? ["Expansion stress scenario readiness appears durable."] : []),
    ...(breakdown.governanceStrainReadinessScore >= 72 ? ["Governance strain scenario readiness appears durable."] : []),
    ...(breakdown.scenarioPlanningMaturityScore >= 72 ? ["Scenario planning maturity appears institutionally reviewable."] : []),
  ]);

const buildRecommendations = (breakdown: EnterpriseScenarioPlanningScoreBreakdown): string[] =>
  unique([
    ...(breakdown.marketContractionReadinessScore < 65
      ? ["Review market contraction scenario assumptions as governance context only; do not treat this as market prediction."]
      : []),
    ...(breakdown.leadFlowDeclineReadinessScore < 65
      ? ["Review lead-flow decline playbooks and follow-up cadence without automating outreach."]
      : []),
    ...(breakdown.capitalPressureReadinessScore < 65
      ? ["Review capital pressure scenario readiness; this is not financial, lending, investment, or treasury advice."]
      : []),
    ...(breakdown.operationalOverloadReadinessScore < 65
      ? ["Review operational overload capacity, role clarity, and continuity handoffs through human-approved operating reviews."]
      : []),
    ...(breakdown.leadershipDisruptionReadinessScore < 65
      ? ["Review leadership disruption continuity backups without creating HR, ownership, or legal advice."]
      : []),
    ...(breakdown.expansionStressReadinessScore < 65
      ? ["Review expansion stress scenario readiness before strategic discussions; no expansion decision is automated."]
      : []),
    ...(breakdown.portfolioUnderperformanceReadinessScore < 65
      ? ["Review portfolio underperformance scenario readiness as a governance signal, not portfolio-management advice."]
      : []),
    ...(breakdown.communicationOverloadReadinessScore < 65
      ? ["Review communication overload scenario readiness and escalation clarity without sending messages."]
      : []),
    ...(breakdown.governanceStrainReadinessScore < 65
      ? ["Review governance strain scenario readiness without creating legal, tax, ownership, or management directives."]
      : []),
    "Use this module as read-only scenario-planning intelligence for human review, not as a scenario execution system.",
  ]);

const buildReusableInfrastructureNotes = (input: EnterpriseScenarioPlanningInput): string[] =>
  unique([
    "Reuses corridor scoring utilities for normalization, warnings, and confidence.",
    "Designed as a pure TypeScript module with deterministic structured inputs and explainable outputs.",
    ...(input.enterpriseStressTestProfile ? ["Can consume stress-test intelligence as read-only scenario stress context."] : []),
    ...(input.enterpriseResilienceProfile ? ["Can consume resilience intelligence as read-only survivability context."] : []),
    ...(input.strategicTreasuryProfile ? ["Can consume strategic treasury intelligence as read-only capital pressure context."] : []),
    ...(input.operationalPlaybookProfile ? ["Can consume operational playbook intelligence as read-only scenario process context."] : []),
    ...(input.enterpriseStrategicReviewProfile ? ["Can consume strategic review intelligence as read-only reassessment context."] : []),
  ]);

const buildExplanation = (
  breakdown: EnterpriseScenarioPlanningScoreBreakdown,
  scenarioReadinessLevel: ScenarioReadinessLevel,
): string[] => [
  `Overall scenario planning score is ${breakdown.overallScore}, classified as ${scenarioReadinessLevel}.`,
  `Scenario readiness includes market contraction ${breakdown.marketContractionReadinessScore}, lead-flow decline ${breakdown.leadFlowDeclineReadinessScore}, capital pressure ${breakdown.capitalPressureReadinessScore}, and operational overload ${breakdown.operationalOverloadReadinessScore}.`,
  `Continuity scenarios include leadership disruption ${breakdown.leadershipDisruptionReadinessScore}, expansion stress ${breakdown.expansionStressReadinessScore}, portfolio underperformance ${breakdown.portfolioUnderperformanceReadinessScore}, communication overload ${breakdown.communicationOverloadReadinessScore}, and governance strain ${breakdown.governanceStrainReadinessScore}.`,
  `Scenario planning maturity is ${breakdown.scenarioPlanningMaturityScore}.`,
  "This module is deterministic, explainable, read-only, compliance-first, and limited to human-reviewed governance and operational review signals.",
];

const buildTrace = (input: EnterpriseScenarioPlanningInput, breakdown: EnterpriseScenarioPlanningScoreBreakdown): string[] => [
  "Normalized all direct numeric inputs to a 0-100 deterministic scoring range.",
  "Used only optional read-only upstream intelligence profiles as fallback signals when direct scenario-planning inputs were absent.",
  "Treated every scenario readiness dimension as higher-is-better preparedness; no scenario is executed or automated.",
  `Computed overallScenarioPlanningScore=${breakdown.overallScore} with dataQualityScore=${typeof input.dataQualityScore === "number" ? normalizeCorridorScore(input.dataQualityScore) : "not provided"}.`,
  "No outreach, database writes, schema changes, automation execution, scenario execution, market prediction, or financial/legal/HR advice was generated.",
];

const buildAssumptions = (input: EnterpriseScenarioPlanningInput, missingData: string[]): string[] =>
  unique([
    ...(input.assumptions ?? []),
    "All scenario-planning inputs are deterministic structured signals supplied by human-reviewed systems.",
    "No live market, banking, financial, demographic, protected-class, or scraped data is used.",
    "Scenario readiness scores represent review flags only and do not trigger autonomous strategy, mitigation, or execution.",
    ...(missingData.length > 0
      ? ["Some scenario-planning dimensions were inferred from available read-only profile fallbacks or neutral deterministic defaults."]
      : []),
  ]);

export function analyzeEnterpriseScenarioPlanningIntelligence(
  input: EnterpriseScenarioPlanningInput = {},
): EnterpriseScenarioPlanningResult {
  const scoreBreakdown = buildScoreBreakdown(input);
  const missingData = getMissingData(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const scenarioReadinessLevel = classifyScenarioReadiness(scoreBreakdown);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallScenarioPlanningScore: scoreBreakdown.overallScore,
    scenarioReadinessLevel,
    marketContractionReadinessScore: scoreBreakdown.marketContractionReadinessScore,
    leadFlowDeclineReadinessScore: scoreBreakdown.leadFlowDeclineReadinessScore,
    capitalPressureReadinessScore: scoreBreakdown.capitalPressureReadinessScore,
    operationalOverloadReadinessScore: scoreBreakdown.operationalOverloadReadinessScore,
    leadershipDisruptionReadinessScore: scoreBreakdown.leadershipDisruptionReadinessScore,
    expansionStressReadinessScore: scoreBreakdown.expansionStressReadinessScore,
    portfolioUnderperformanceReadinessScore: scoreBreakdown.portfolioUnderperformanceReadinessScore,
    communicationOverloadReadinessScore: scoreBreakdown.communicationOverloadReadinessScore,
    governanceStrainReadinessScore: scoreBreakdown.governanceStrainReadinessScore,
    scenarioPlanningMaturityScore: scoreBreakdown.scenarioPlanningMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    scenarioWarnings: warnings.map((warning) => warning.message),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input),
    explanation: buildExplanation(scoreBreakdown, scenarioReadinessLevel),
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
      scenarioExecution: false,
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

export const getEnterpriseScenarioPlanningIntelligence =
  analyzeEnterpriseScenarioPlanningIntelligence;
