import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import {
  calculateCorridorConfidence,
  createCorridorWarning,
  normalizeCorridorScore,
} from "./corridor-intelligence-utils";

export type StressReadinessLevel = "critical" | "strained" | "review_ready" | "stress_ready" | "institutional_grade";

export type EnterpriseStressTestInput = {
  operationalStressScore?: number;
  governanceStressScore?: number;
  capitalStressScore?: number;
  leadFlowStressScore?: number;
  dealPipelineStressScore?: number;
  portfolioConcentrationStressScore?: number;
  leadershipDependencyStressScore?: number;
  communicationLoadStressScore?: number;
  expansionPressureStressScore?: number;
  enterpriseStressTestMaturityScore?: number;
  enterpriseRiskProfile?: unknown;
  strategicTreasuryProfile?: unknown;
  enterpriseResilienceProfile?: unknown;
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
  institutionalRelationshipProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseStressTestScoreBreakdown = CorridorScoreBreakdown & {
  overallScore: number;
  operationalStressScore: number;
  governanceStressScore: number;
  capitalStressScore: number;
  leadFlowStressScore: number;
  dealPipelineStressScore: number;
  portfolioConcentrationStressScore: number;
  leadershipDependencyStressScore: number;
  communicationLoadStressScore: number;
  expansionPressureStressScore: number;
  enterpriseStressTestMaturityScore: number;
};

export type EnterpriseStressTestResult = {
  overallStressTestScore: number;
  stressReadinessLevel: StressReadinessLevel;
  operationalStressScore: number;
  governanceStressScore: number;
  capitalStressScore: number;
  leadFlowStressScore: number;
  dealPipelineStressScore: number;
  portfolioConcentrationStressScore: number;
  leadershipDependencyStressScore: number;
  communicationLoadStressScore: number;
  expansionPressureStressScore: number;
  enterpriseStressTestMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseStressTestScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  stressWarnings: string[];
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
    autonomousMitigationActions: false;
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
  "operationalStressScore",
  "governanceStressScore",
  "capitalStressScore",
  "leadFlowStressScore",
  "dealPipelineStressScore",
  "portfolioConcentrationStressScore",
  "leadershipDependencyStressScore",
  "communicationLoadStressScore",
  "expansionPressureStressScore",
  "enterpriseStressTestMaturityScore",
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
  input: EnterpriseStressTestInput,
  key: keyof EnterpriseStressTestInput,
  fallback: number,
): number => {
  const value = input[key];
  return typeof value === "number" && Number.isFinite(value)
    ? normalizeCorridorScore(value)
    : normalizeCorridorScore(fallback);
};

const hasFallbackForInput = (
  input: EnterpriseStressTestInput,
  key: (typeof REQUIRED_INPUTS)[number],
): boolean => {
  switch (key) {
    case "operationalStressScore":
      return (
        hasProfileScore(input.enterpriseResilienceProfile, ["operationalResilienceScore"]) ||
        hasProfileScore(input.enterpriseRiskProfile, [
          "operationalContinuityResilience",
          "scoreBreakdown.operationalContinuityResilienceScore",
          "defensiveOperationalResilience",
        ]) ||
        hasProfileScore(input.operationalPlaybookProfile, ["overallPlaybookReadinessScore"]) ||
        hasProfileScore(input.operationalQaProcessDriftProfile, ["overallOperationalConsistencyScore"])
      );
    case "governanceStressScore":
      return (
        hasProfileScore(input.enterpriseResilienceProfile, ["governanceResilienceScore"]) ||
        hasProfileScore(input.enterpriseExpansionGovernanceProfile, [
          "governanceDurability",
          "defensiveGovernanceResilience",
          "humanReviewGovernanceAlignment",
        ]) ||
        hasProfileScore(input.enterpriseDecisionRightsProfile, ["overallDecisionRightsScore"]) ||
        hasProfileScore(input.enterpriseAccountabilityProfile, ["governanceAccountabilityScore"])
      );
    case "capitalStressScore":
      return (
        hasProfileScore(input.strategicTreasuryProfile, [
          "strategicTreasuryDurability",
          "liquidityDurability",
          "reserveResilienceQuality",
          "defensiveReserveBalance",
        ]) ||
        hasProfileScore(input.enterpriseRiskProfile, ["enterpriseRiskDurability", "scoreBreakdown.enterpriseRiskDurabilityScore"])
      );
    case "leadFlowStressScore":
      return (
        hasProfileScore(input.processOptimizationProfile, ["followUpEfficiencyScore", "communicationEfficiencyScore"]) ||
        hasProfileScore(input.operationalQaProcessDriftProfile, [
          "followUpConsistencyScore",
          "communicationConsistencyScore",
        ]) ||
        hasProfileScore(input.operationalPlaybookProfile, ["followUpPlaybookScore", "marketingPlaybookScore"])
      );
    case "dealPipelineStressScore":
      return (
        hasProfileScore(input.processOptimizationProfile, ["pipelineBottleneckScore", "workflowEfficiencyScore"]) ||
        hasProfileScore(input.operationalQaProcessDriftProfile, [
          "dealProcessingConsistencyScore",
          "workflowConsistencyScore",
        ]) ||
        hasProfileScore(input.operationalPlaybookProfile, ["acquisitionPlaybookScore", "closingPlaybookScore"])
      );
    case "portfolioConcentrationStressScore":
      return (
        hasProfileScore(input.portfolioRiskProfile, [
          "portfolioRiskScore",
          "concentrationRiskScore",
          "portfolioConcentrationRiskScore",
        ]) ||
        hasProfileScore(input.portfolioCorrelationProfile, [
          "portfolioCorrelationRisk",
          "correlationRiskScore",
          "marketCorrelationScore",
        ]) ||
        hasProfileScore(input.enterpriseRiskProfile, ["dependencyConcentrationRisk", "dependencyConcentrationRiskScore"])
      );
    case "leadershipDependencyStressScore":
      return (
        hasProfileScore(input.founderDependencyProfile, [
          "overallKeyPersonRiskScore",
          "founderDependencyScore",
          "continuityReadinessScore",
        ]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["leadershipSurvivabilityScore"])
      );
    case "communicationLoadStressScore":
      return (
        hasProfileScore(input.processOptimizationProfile, ["communicationEfficiencyScore"]) ||
        hasProfileScore(input.operationalQaProcessDriftProfile, ["communicationConsistencyScore"]) ||
        hasProfileScore(input.enterpriseOperatingRhythmProfile, ["followUpRhythmScore", "operationalTempoScore"]) ||
        hasProfileScore(input.institutionalRelationshipProfile, ["communicationStability"])
      );
    case "expansionPressureStressScore":
      return (
        hasProfileScore(input.enterpriseRiskProfile, ["expansionFragility", "expansionFragilityScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["scalingFragilityScore", "expansionStressDurabilityScore"]) ||
        hasProfileScore(input.enterpriseExpansionGovernanceProfile, [
          "expansionControlQuality",
          "expansionOversightQuality",
        ])
      );
    case "enterpriseStressTestMaturityScore":
      return (
        hasProfileScore(input.enterpriseResilienceProfile, [
          "overallResilienceScore",
          "enterpriseResilienceMaturityScore",
        ]) ||
        hasProfileScore(input.enterpriseRiskProfile, ["enterpriseRiskDurability", "scoreBreakdown.enterpriseRiskDurabilityScore"]) ||
        hasProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"]) ||
        hasProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"])
      );
  }
};

const getMissingData = (input: EnterpriseStressTestInput): string[] =>
  REQUIRED_INPUTS.filter((key) => typeof input[key] !== "number" && !hasFallbackForInput(input, key));

const buildScoreBreakdown = (input: EnterpriseStressTestInput): EnterpriseStressTestScoreBreakdown => {
  const operationalStressScore = getScore(
    input,
    "operationalStressScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseResilienceProfile, ["operationalResilienceScore"]), 0.28],
      [
        extractProfileScore(input.enterpriseRiskProfile, [
          "operationalContinuityResilience",
          "scoreBreakdown.operationalContinuityResilienceScore",
        ]),
        0.22,
      ],
      [extractProfileScore(input.operationalPlaybookProfile, ["overallPlaybookReadinessScore"]), 0.18],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["overallOperationalConsistencyScore"]), 0.18],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["operationalTempoScore"]), 0.14],
    ]),
  );

  const governanceStressScore = getScore(
    input,
    "governanceStressScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseResilienceProfile, ["governanceResilienceScore"]), 0.24],
      [
        extractProfileScore(input.enterpriseExpansionGovernanceProfile, [
          "governanceDurability",
          "defensiveGovernanceResilience",
        ]),
        0.22,
      ],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["overallDecisionRightsScore"]), 0.18],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["governanceAccountabilityScore"]), 0.16],
      [100 - extractProfileScore(input.enterpriseRiskProfile, ["governanceFragilityExposure"], 46), 0.2],
    ]),
  );

  const capitalStressScore = getScore(
    input,
    "capitalStressScore",
    weightedAverage([
      [extractProfileScore(input.strategicTreasuryProfile, ["strategicTreasuryDurability"]), 0.22],
      [extractProfileScore(input.strategicTreasuryProfile, ["liquidityDurability"]), 0.2],
      [extractProfileScore(input.strategicTreasuryProfile, ["reserveResilienceQuality"]), 0.2],
      [extractProfileScore(input.strategicTreasuryProfile, ["defensiveReserveBalance"]), 0.18],
      [extractProfileScore(input.enterpriseRiskProfile, ["enterpriseRiskDurability"]), 0.1],
      [extractProfileScore(input.enterpriseResilienceProfile, ["recoveryReadinessScore"]), 0.1],
    ]),
  );

  const leadFlowStressScore = getScore(
    input,
    "leadFlowStressScore",
    weightedAverage([
      [extractProfileScore(input.processOptimizationProfile, ["followUpEfficiencyScore"]), 0.2],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["followUpConsistencyScore"]), 0.2],
      [extractProfileScore(input.operationalPlaybookProfile, ["followUpPlaybookScore"]), 0.18],
      [extractProfileScore(input.operationalPlaybookProfile, ["marketingPlaybookScore"]), 0.16],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["followUpRhythmScore"]), 0.14],
      [extractProfileScore(input.processOptimizationProfile, ["communicationEfficiencyScore"]), 0.12],
    ]),
  );

  const dealPipelineStressScore = getScore(
    input,
    "dealPipelineStressScore",
    weightedAverage([
      [100 - extractProfileScore(input.processOptimizationProfile, ["pipelineBottleneckScore"], 46), 0.22],
      [extractProfileScore(input.processOptimizationProfile, ["workflowEfficiencyScore"]), 0.18],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["dealProcessingConsistencyScore"]), 0.18],
      [extractProfileScore(input.operationalPlaybookProfile, ["acquisitionPlaybookScore"]), 0.14],
      [extractProfileScore(input.operationalPlaybookProfile, ["closingPlaybookScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["dealExecutionAccountabilityScore"]), 0.14],
    ]),
  );

  const portfolioConcentrationStressScore = getScore(
    input,
    "portfolioConcentrationStressScore",
    weightedAverage([
      [extractProfileScore(input.portfolioRiskProfile, ["concentrationRiskScore", "portfolioConcentrationRiskScore"], 48), 0.26],
      [extractProfileScore(input.portfolioCorrelationProfile, ["portfolioCorrelationRisk", "correlationRiskScore"], 48), 0.22],
      [extractProfileScore(input.enterpriseRiskProfile, ["dependencyConcentrationRisk", "dependencyConcentrationRiskScore"], 48), 0.2],
      [extractProfileScore(input.enterpriseRiskProfile, ["corridorDependencyExposure", "corridorDependencyExposureScore"], 48), 0.16],
      [100 - extractProfileScore(input.enterpriseRiskProfile, ["diversificationResilienceQuality"], 52), 0.16],
    ]),
  );

  const leadershipDependencyStressScore = getScore(
    input,
    "leadershipDependencyStressScore",
    weightedAverage([
      [extractProfileScore(input.founderDependencyProfile, ["overallKeyPersonRiskScore", "founderDependencyScore"], 48), 0.3],
      [extractProfileScore(input.founderDependencyProfile, ["decisionConcentrationScore"], 48), 0.18],
      [100 - extractProfileScore(input.founderDependencyProfile, ["continuityReadinessScore"], 52), 0.18],
      [100 - extractProfileScore(input.founderDependencyProfile, ["backupLeadershipReadinessScore"], 52), 0.18],
      [100 - extractProfileScore(input.enterpriseResilienceProfile, ["leadershipSurvivabilityScore"], 52), 0.16],
    ]),
  );

  const communicationLoadStressScore = getScore(
    input,
    "communicationLoadStressScore",
    weightedAverage([
      [100 - extractProfileScore(input.processOptimizationProfile, ["communicationEfficiencyScore"], 52), 0.24],
      [100 - extractProfileScore(input.operationalQaProcessDriftProfile, ["communicationConsistencyScore"], 52), 0.22],
      [100 - extractProfileScore(input.enterpriseOperatingRhythmProfile, ["followUpRhythmScore"], 52), 0.18],
      [100 - extractProfileScore(input.institutionalRelationshipProfile, ["communicationStability"], 52), 0.18],
      [100 - extractProfileScore(input.enterpriseAccountabilityProfile, ["escalationClarityScore"], 52), 0.18],
    ]),
  );

  const expansionPressureStressScore = getScore(
    input,
    "expansionPressureStressScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseRiskProfile, ["expansionFragility", "expansionFragilityScore"], 48), 0.24],
      [extractProfileScore(input.enterpriseResilienceProfile, ["scalingFragilityScore"], 48), 0.22],
      [100 - extractProfileScore(input.enterpriseResilienceProfile, ["expansionStressDurabilityScore"], 52), 0.16],
      [100 - extractProfileScore(input.enterpriseExpansionGovernanceProfile, ["expansionControlQuality"], 52), 0.14],
      [100 - extractProfileScore(input.enterpriseExpansionGovernanceProfile, ["expansionOversightQuality"], 52), 0.14],
      [100 - extractProfileScore(input.strategicTreasuryProfile, ["expansionLiquidityResilience"], 52), 0.1],
    ]),
  );

  const enterpriseStressTestMaturityScore = getScore(
    input,
    "enterpriseStressTestMaturityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseResilienceProfile, ["overallResilienceScore"]), 0.2],
      [extractProfileScore(input.enterpriseResilienceProfile, ["enterpriseResilienceMaturityScore"]), 0.18],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"]), 0.16],
      [extractProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]), 0.16],
      [extractProfileScore(input.enterpriseRiskProfile, ["enterpriseRiskDurability"]), 0.16],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["accountabilityMaturityScore"]), 0.14],
    ]),
  );

  const riskAdjustedStressScore = weightedAverage([
    [operationalStressScore, 0.12],
    [governanceStressScore, 0.11],
    [capitalStressScore, 0.11],
    [leadFlowStressScore, 0.09],
    [dealPipelineStressScore, 0.1],
    [100 - portfolioConcentrationStressScore, 0.1],
    [100 - leadershipDependencyStressScore, 0.1],
    [100 - communicationLoadStressScore, 0.09],
    [100 - expansionPressureStressScore, 0.1],
    [enterpriseStressTestMaturityScore, 0.08],
  ]);

  return {
    connectivityScore: leadFlowStressScore,
    durabilityScore: riskAdjustedStressScore,
    expansionScore: 100 - expansionPressureStressScore,
    institutionalScore: enterpriseStressTestMaturityScore,
    logisticsScore: operationalStressScore,
    luxuryScore: capitalStressScore,
    developmentScore: dealPipelineStressScore,
    overallScore: riskAdjustedStressScore,
    operationalStressScore,
    governanceStressScore,
    capitalStressScore,
    leadFlowStressScore,
    dealPipelineStressScore,
    portfolioConcentrationStressScore,
    leadershipDependencyStressScore,
    communicationLoadStressScore,
    expansionPressureStressScore,
    enterpriseStressTestMaturityScore,
  };
};

const classifyStressReadiness = (breakdown: EnterpriseStressTestScoreBreakdown): StressReadinessLevel => {
  if (
    breakdown.overallScore >= 82 &&
    breakdown.portfolioConcentrationStressScore <= 32 &&
    breakdown.leadershipDependencyStressScore <= 32 &&
    breakdown.expansionPressureStressScore <= 32
  ) {
    return "institutional_grade";
  }
  if (breakdown.overallScore >= 68 && breakdown.expansionPressureStressScore <= 46) return "stress_ready";
  if (breakdown.overallScore >= 54) return "review_ready";
  if (breakdown.overallScore >= 40) return "strained";
  return "critical";
};

const buildWarnings = (breakdown: EnterpriseStressTestScoreBreakdown, missingData: string[]): CorridorWarning[] => [
  ...(missingData.length > 0
    ? [
        createCorridorWarning({
          code: "ENTERPRISE_STRESS_TEST_DATA_INCOMPLETE",
          severity: missingData.length >= 5 ? "high" : "medium",
          message: "Enterprise stress-test assessment is using incomplete structured inputs and requires human verification.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.overallScore < 42
    ? [
        createCorridorWarning({
          code: "ENTERPRISE_STRESS_READINESS_WEAK",
          severity: "high",
          message: "Enterprise stress-test readiness is weak under current structured inputs.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.capitalStressScore < 45
    ? [
        createCorridorWarning({
          code: "CAPITAL_STRESS_READINESS_WEAK",
          severity: "high",
          message: "Capital discipline stress readiness is weak; this is not financial, lending, or investment advice.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.portfolioConcentrationStressScore >= 70
    ? [
        createCorridorWarning({
          code: "PORTFOLIO_CONCENTRATION_STRESS_HIGH",
          severity: "medium",
          message: "Portfolio concentration stress risk is elevated; this is not portfolio-management advice.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.leadershipDependencyStressScore >= 70
    ? [
        createCorridorWarning({
          code: "LEADERSHIP_DEPENDENCY_STRESS_HIGH",
          severity: "medium",
          message: "Leadership dependency stress risk is elevated and requires human continuity review.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.expansionPressureStressScore >= 70
    ? [
        createCorridorWarning({
          code: "EXPANSION_PRESSURE_STRESS_HIGH",
          severity: "medium",
          message: "Expansion pressure stress risk is elevated; no expansion decision or execution is automated.",
          category: "development",
          requiresHumanReview: true,
        }),
      ]
    : []),
];

const buildKeyRisks = (breakdown: EnterpriseStressTestScoreBreakdown): string[] =>
  unique([
    ...(breakdown.operationalStressScore < 55 ? ["Operational stress readiness may be insufficient for continuity pressure."] : []),
    ...(breakdown.governanceStressScore < 55 ? ["Governance stress readiness may be insufficient for review discipline under load."] : []),
    ...(breakdown.capitalStressScore < 55
      ? ["Capital discipline stress readiness may be constrained; this is not financial or investment advice."]
      : []),
    ...(breakdown.leadFlowStressScore < 55 ? ["Lead-flow stress readiness may weaken during volume spikes or process interruptions."] : []),
    ...(breakdown.dealPipelineStressScore < 55 ? ["Deal-pipeline stress readiness may weaken under bottlenecks or handoff pressure."] : []),
    ...(breakdown.portfolioConcentrationStressScore >= 60
      ? ["Portfolio concentration stress risk may reduce enterprise flexibility under adverse scenarios."]
      : []),
    ...(breakdown.leadershipDependencyStressScore >= 60
      ? ["Leadership dependency stress risk may reduce continuity if key people are unavailable."]
      : []),
    ...(breakdown.communicationLoadStressScore >= 60
      ? ["Communication load stress risk may reduce coordination during high-pressure operating periods."]
      : []),
    ...(breakdown.expansionPressureStressScore >= 60
      ? ["Expansion pressure stress risk may reduce controlled execution during scaling."]
      : []),
  ]);

const buildStrengths = (breakdown: EnterpriseStressTestScoreBreakdown): string[] =>
  unique([
    ...(breakdown.operationalStressScore >= 72 ? ["Operational stress readiness appears durable."] : []),
    ...(breakdown.governanceStressScore >= 72 ? ["Governance stress readiness appears strong and reviewable."] : []),
    ...(breakdown.capitalStressScore >= 72 ? ["Capital discipline stress readiness appears durable without execution behavior."] : []),
    ...(breakdown.leadFlowStressScore >= 72 ? ["Lead-flow stress readiness appears stable."] : []),
    ...(breakdown.dealPipelineStressScore >= 72 ? ["Deal-pipeline stress readiness appears stable."] : []),
    ...(breakdown.portfolioConcentrationStressScore <= 35 ? ["Portfolio concentration stress risk appears contained."] : []),
    ...(breakdown.leadershipDependencyStressScore <= 35 ? ["Leadership dependency stress risk appears contained."] : []),
    ...(breakdown.enterpriseStressTestMaturityScore >= 72 ? ["Enterprise stress-test maturity appears institutionally durable."] : []),
  ]);

const buildRecommendations = (breakdown: EnterpriseStressTestScoreBreakdown): string[] =>
  unique([
    ...(breakdown.operationalStressScore < 65
      ? ["Review operational stress readiness and continuity handoffs through human-approved operating reviews."]
      : []),
    ...(breakdown.governanceStressScore < 65
      ? ["Review governance stress readiness, escalation clarity, and decision rights without creating legal or HR directives."]
      : []),
    ...(breakdown.capitalStressScore < 65
      ? ["Review capital discipline stress assumptions; this is not financial, lending, investment, or treasury advice."]
      : []),
    ...(breakdown.leadFlowStressScore < 65
      ? ["Review lead-flow surge handling, follow-up discipline, and communication cadence as operational process checks only."]
      : []),
    ...(breakdown.dealPipelineStressScore < 65
      ? ["Review deal-pipeline bottlenecks and handoff pressure without automating execution."]
      : []),
    ...(breakdown.portfolioConcentrationStressScore > 45
      ? ["Review portfolio concentration stress exposure as a governance signal, not portfolio-management advice."]
      : []),
    ...(breakdown.leadershipDependencyStressScore > 45
      ? ["Review leadership dependency stress exposure and continuity backups without creating HR, ownership, or legal advice."]
      : []),
    ...(breakdown.expansionPressureStressScore > 45
      ? ["Review expansion pressure assumptions before strategic discussions; no expansion decision is made by this module."]
      : []),
    "Use this module as read-only stress-test intelligence for human review, not as a scenario execution or mitigation system.",
  ]);

const buildReusableInfrastructureNotes = (input: EnterpriseStressTestInput): string[] =>
  unique([
    "Reuses corridor scoring utilities for normalization, warnings, and confidence.",
    "Designed as a pure TypeScript module with deterministic structured inputs and explainable outputs.",
    ...(input.enterpriseRiskProfile ? ["Can consume enterprise risk layer outputs as read-only stress exposure signals."] : []),
    ...(input.strategicTreasuryProfile ? ["Can consume strategic treasury intelligence as read-only capital discipline stress context."] : []),
    ...(input.enterpriseResilienceProfile ? ["Can consume resilience and anti-fragility intelligence as read-only survivability context."] : []),
    ...(input.operationalPlaybookProfile ? ["Can consume operational playbook intelligence as read-only process readiness context."] : []),
    ...(input.enterpriseOperatingRhythmProfile ? ["Can consume operating rhythm intelligence as read-only cadence and crisis-readiness context."] : []),
  ]);

const buildExplanation = (
  breakdown: EnterpriseStressTestScoreBreakdown,
  stressReadinessLevel: StressReadinessLevel,
): string[] => [
  `Overall stress-test score is ${breakdown.overallScore}, classified as ${stressReadinessLevel}.`,
  `Readiness dimensions: operational ${breakdown.operationalStressScore}, governance ${breakdown.governanceStressScore}, capital ${breakdown.capitalStressScore}, lead-flow ${breakdown.leadFlowStressScore}, and deal-pipeline ${breakdown.dealPipelineStressScore}.`,
  `Risk dimensions are inverse-weighted into the overall score: portfolio concentration ${breakdown.portfolioConcentrationStressScore}, leadership dependency ${breakdown.leadershipDependencyStressScore}, communication load ${breakdown.communicationLoadStressScore}, and expansion pressure ${breakdown.expansionPressureStressScore}.`,
  `Enterprise stress-test maturity is ${breakdown.enterpriseStressTestMaturityScore}.`,
  "This module is deterministic, explainable, read-only, compliance-first, and limited to human-reviewed governance and operational review signals.",
];

const buildTrace = (input: EnterpriseStressTestInput, breakdown: EnterpriseStressTestScoreBreakdown): string[] => [
  "Normalized all direct numeric inputs to a 0-100 deterministic scoring range.",
  "Used only optional read-only upstream intelligence profiles as fallback signals when direct stress-test inputs were absent.",
  "Treated operational, governance, capital, lead-flow, deal-pipeline, and maturity scores as higher-is-better readiness scores.",
  "Treated portfolio concentration, leadership dependency, communication load, and expansion pressure scores as higher-is-worse stress-risk scores.",
  `Computed overallStressTestScore=${breakdown.overallScore} with dataQualityScore=${typeof input.dataQualityScore === "number" ? normalizeCorridorScore(input.dataQualityScore) : "not provided"}.`,
  "No outreach, database writes, schema changes, automation execution, scenario execution, market prediction, or financial/legal/HR advice was generated.",
];

const buildAssumptions = (input: EnterpriseStressTestInput, missingData: string[]): string[] =>
  unique([
    ...(input.assumptions ?? []),
    "All stress-test inputs are deterministic structured signals supplied by human-reviewed systems.",
    "No live market, banking, financial, demographic, protected-class, or scraped data is used.",
    "Stress-risk scores represent review flags only and do not trigger autonomous mitigation or execution.",
    ...(missingData.length > 0
      ? ["Some stress-test dimensions were inferred from available read-only profile fallbacks or neutral deterministic defaults."]
      : []),
  ]);

export function analyzeEnterpriseStressTestIntelligence(
  input: EnterpriseStressTestInput = {},
): EnterpriseStressTestResult {
  const scoreBreakdown = buildScoreBreakdown(input);
  const missingData = getMissingData(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const stressReadinessLevel = classifyStressReadiness(scoreBreakdown);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallStressTestScore: scoreBreakdown.overallScore,
    stressReadinessLevel,
    operationalStressScore: scoreBreakdown.operationalStressScore,
    governanceStressScore: scoreBreakdown.governanceStressScore,
    capitalStressScore: scoreBreakdown.capitalStressScore,
    leadFlowStressScore: scoreBreakdown.leadFlowStressScore,
    dealPipelineStressScore: scoreBreakdown.dealPipelineStressScore,
    portfolioConcentrationStressScore: scoreBreakdown.portfolioConcentrationStressScore,
    leadershipDependencyStressScore: scoreBreakdown.leadershipDependencyStressScore,
    communicationLoadStressScore: scoreBreakdown.communicationLoadStressScore,
    expansionPressureStressScore: scoreBreakdown.expansionPressureStressScore,
    enterpriseStressTestMaturityScore: scoreBreakdown.enterpriseStressTestMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    stressWarnings: warnings.map((warning) => warning.message),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input),
    explanation: buildExplanation(scoreBreakdown, stressReadinessLevel),
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
      autonomousMitigationActions: false,
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

export const getEnterpriseStressTestIntelligence = analyzeEnterpriseStressTestIntelligence;
