import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import {
  calculateCorridorConfidence,
  createCorridorWarning,
  normalizeCorridorScore,
} from "./corridor-intelligence-utils";

export type ContinuityGovernanceLevel = "weak" | "exposed" | "developing" | "governed" | "institutional_grade";

export type EnterpriseContinuityGovernanceInput = {
  continuityGovernanceScore?: number;
  recoveryGovernanceScore?: number;
  resilienceGovernanceScore?: number;
  escalationGovernanceScore?: number;
  reviewGovernanceScore?: number;
  institutionalSafeguardScore?: number;
  leadershipContinuityGovernanceScore?: number;
  operationalContinuityGovernanceScore?: number;
  longHorizonGovernanceScore?: number;
  enterpriseGovernanceMaturityScore?: number;
  enterpriseBusinessContinuityProfile?: unknown;
  enterpriseRecoveryPlanningProfile?: unknown;
  enterpriseContingencyPlanningProfile?: unknown;
  enterpriseResilienceProfile?: unknown;
  enterpriseRiskProfile?: unknown;
  enterpriseDecisionRightsProfile?: unknown;
  enterpriseStrategicReviewProfile?: unknown;
  enterpriseAccountabilityProfile?: unknown;
  enterpriseOperatingRhythmProfile?: unknown;
  enterpriseExpansionGovernanceProfile?: unknown;
  enterpriseInstitutionalCohesionProfile?: unknown;
  founderDependencyProfile?: unknown;
  operationalPlaybookProfile?: unknown;
  institutionalKnowledgeTransferProfile?: unknown;
  longHorizonWealthPreservationProfile?: unknown;
  familyOfficeGovernanceProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseContinuityGovernanceScoreBreakdown = CorridorScoreBreakdown & {
  overallScore: number;
  continuityGovernanceScore: number;
  recoveryGovernanceScore: number;
  resilienceGovernanceScore: number;
  escalationGovernanceScore: number;
  reviewGovernanceScore: number;
  institutionalSafeguardScore: number;
  leadershipContinuityGovernanceScore: number;
  operationalContinuityGovernanceScore: number;
  longHorizonGovernanceScore: number;
  enterpriseGovernanceMaturityScore: number;
};

export type EnterpriseContinuityGovernanceResult = {
  overallContinuityGovernanceScore: number;
  continuityGovernanceLevel: ContinuityGovernanceLevel;
  continuityGovernanceScore: number;
  recoveryGovernanceScore: number;
  resilienceGovernanceScore: number;
  escalationGovernanceScore: number;
  reviewGovernanceScore: number;
  institutionalSafeguardScore: number;
  leadershipContinuityGovernanceScore: number;
  operationalContinuityGovernanceScore: number;
  longHorizonGovernanceScore: number;
  enterpriseGovernanceMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseContinuityGovernanceScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  governanceWarnings: string[];
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
  "continuityGovernanceScore",
  "recoveryGovernanceScore",
  "resilienceGovernanceScore",
  "escalationGovernanceScore",
  "reviewGovernanceScore",
  "institutionalSafeguardScore",
  "leadershipContinuityGovernanceScore",
  "operationalContinuityGovernanceScore",
  "longHorizonGovernanceScore",
  "enterpriseGovernanceMaturityScore",
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
  input: EnterpriseContinuityGovernanceInput,
  key: keyof EnterpriseContinuityGovernanceInput,
  fallback: number,
): number => {
  const value = input[key];
  return typeof value === "number" && Number.isFinite(value)
    ? normalizeCorridorScore(value)
    : normalizeCorridorScore(fallback);
};

const hasFallbackForInput = (
  input: EnterpriseContinuityGovernanceInput,
  key: (typeof REQUIRED_INPUTS)[number],
): boolean => {
  switch (key) {
    case "continuityGovernanceScore":
      return (
        hasProfileScore(input.enterpriseBusinessContinuityProfile, ["governanceContinuityScore", "overallContinuityScore"]) ||
        hasProfileScore(input.enterpriseDecisionRightsProfile, ["governanceAuthorityScore", "overallDecisionRightsScore"]) ||
        hasProfileScore(input.enterpriseStrategicReviewProfile, ["governanceReviewScore"])
      );
    case "recoveryGovernanceScore":
      return (
        hasProfileScore(input.enterpriseRecoveryPlanningProfile, ["governanceRecoveryScore", "enterpriseRecoveryMaturityScore"]) ||
        hasProfileScore(input.enterpriseContingencyPlanningProfile, ["governanceContingencyScore"]) ||
        hasProfileScore(input.enterpriseStrategicReviewProfile, ["reviewGovernanceScore", "governanceReviewScore"])
      );
    case "resilienceGovernanceScore":
      return (
        hasProfileScore(input.enterpriseResilienceProfile, ["governanceResilienceScore", "enterpriseResilienceMaturityScore"]) ||
        hasProfileScore(input.enterpriseRiskProfile, ["governanceFragilityExposure"]) ||
        hasProfileScore(input.enterpriseExpansionGovernanceProfile, ["defensiveGovernanceResilience"])
      );
    case "escalationGovernanceScore":
      return (
        hasProfileScore(input.enterpriseDecisionRightsProfile, ["escalationAuthorityScore", "crisisDecisionAuthorityScore"]) ||
        hasProfileScore(input.enterpriseAccountabilityProfile, ["escalationClarityScore"]) ||
        hasProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"])
      );
    case "reviewGovernanceScore":
      return (
        hasProfileScore(input.enterpriseStrategicReviewProfile, ["governanceReviewScore", "strategicReviewMaturityScore"]) ||
        hasProfileScore(input.enterpriseOperatingRhythmProfile, ["quarterlyGovernanceScore", "decisionReviewTimingScore"]) ||
        hasProfileScore(input.enterpriseAccountabilityProfile, ["reviewAccountabilityScore"])
      );
    case "institutionalSafeguardScore":
      return (
        hasProfileScore(input.enterpriseRiskProfile, ["institutionalStabilityDurability", "systemicSurvivabilityBalance"]) ||
        hasProfileScore(input.enterpriseInstitutionalCohesionProfile, ["institutionalIdentityScore", "overallCohesionScore"]) ||
        hasProfileScore(input.longHorizonWealthPreservationProfile, ["institutionalContinuityDurability"])
      );
    case "leadershipContinuityGovernanceScore":
      return (
        hasProfileScore(input.enterpriseBusinessContinuityProfile, ["leadershipContinuityScore"]) ||
        hasProfileScore(input.founderDependencyProfile, ["continuityReadinessScore", "backupLeadershipReadinessScore"]) ||
        hasProfileScore(input.enterpriseDecisionRightsProfile, ["crisisDecisionAuthorityScore"])
      );
    case "operationalContinuityGovernanceScore":
      return (
        hasProfileScore(input.enterpriseBusinessContinuityProfile, ["operationalContinuityScore"]) ||
        hasProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]) ||
        hasProfileScore(input.enterpriseAccountabilityProfile, ["continuityAccountabilityScore"])
      );
    case "longHorizonGovernanceScore":
      return (
        hasProfileScore(input.enterpriseStrategicReviewProfile, ["longHorizonReviewScore"]) ||
        hasProfileScore(input.longHorizonWealthPreservationProfile, ["longHorizonPreservationQuality"]) ||
        hasProfileScore(input.familyOfficeGovernanceProfile, ["governanceContinuity", "institutionalGovernanceDurability"])
      );
    case "enterpriseGovernanceMaturityScore":
      return (
        hasProfileScore(input.enterpriseBusinessContinuityProfile, ["enterpriseContinuityMaturityScore"]) ||
        hasProfileScore(input.enterpriseRecoveryPlanningProfile, ["enterpriseRecoveryMaturityScore"]) ||
        hasProfileScore(input.enterpriseResilienceProfile, ["enterpriseResilienceMaturityScore"]) ||
        hasProfileScore(input.enterpriseStrategicReviewProfile, ["strategicReviewMaturityScore"])
      );
  }
};

const getMissingData = (input: EnterpriseContinuityGovernanceInput): string[] =>
  REQUIRED_INPUTS.filter((key) => typeof input[key] !== "number" && !hasFallbackForInput(input, key));

const buildScoreBreakdown = (
  input: EnterpriseContinuityGovernanceInput,
): EnterpriseContinuityGovernanceScoreBreakdown => {
  const continuityGovernanceScore = getScore(
    input,
    "continuityGovernanceScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["governanceContinuityScore"]), 0.22],
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["enterpriseContinuityMaturityScore"]), 0.16],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["governanceAuthorityScore"]), 0.16],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["overallDecisionRightsScore"]), 0.14],
      [extractProfileScore(input.enterpriseStrategicReviewProfile, ["governanceReviewScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["governanceAccountabilityScore"]), 0.1],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["quarterlyGovernanceScore"]), 0.08],
    ]),
  );

  const recoveryGovernanceScore = getScore(
    input,
    "recoveryGovernanceScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["governanceRecoveryScore"]), 0.22],
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["enterpriseRecoveryMaturityScore"]), 0.18],
      [extractProfileScore(input.enterpriseContingencyPlanningProfile, ["governanceContingencyScore"]), 0.16],
      [extractProfileScore(input.enterpriseStrategicReviewProfile, ["governanceReviewScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["continuityAccountabilityScore"]), 0.14],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"]), 0.08],
      [continuityGovernanceScore, 0.08],
    ]),
  );

  const resilienceGovernanceScore = getScore(
    input,
    "resilienceGovernanceScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseResilienceProfile, ["governanceResilienceScore"]), 0.22],
      [extractProfileScore(input.enterpriseResilienceProfile, ["enterpriseResilienceMaturityScore"]), 0.18],
      [100 - extractProfileScore(input.enterpriseRiskProfile, ["governanceFragilityExposure"], 48), 0.16],
      [extractProfileScore(input.enterpriseExpansionGovernanceProfile, ["defensiveGovernanceResilience"]), 0.14],
      [extractProfileScore(input.enterpriseExpansionGovernanceProfile, ["humanReviewGovernanceAlignment"]), 0.12],
      [continuityGovernanceScore, 0.1],
      [recoveryGovernanceScore, 0.08],
    ]),
  );

  const escalationGovernanceScore = getScore(
    input,
    "escalationGovernanceScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["escalationAuthorityScore"]), 0.24],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["crisisDecisionAuthorityScore"]), 0.18],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["escalationClarityScore"]), 0.18],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["continuityAccountabilityScore"]), 0.14],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"]), 0.12],
      [extractProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]), 0.08],
      [continuityGovernanceScore, 0.06],
    ]),
  );

  const reviewGovernanceScore = getScore(
    input,
    "reviewGovernanceScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseStrategicReviewProfile, ["governanceReviewScore"]), 0.22],
      [extractProfileScore(input.enterpriseStrategicReviewProfile, ["strategicReviewMaturityScore"]), 0.16],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["quarterlyGovernanceScore"]), 0.16],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["decisionReviewTimingScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["reviewAccountabilityScore"]), 0.14],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["governanceAuthorityScore"]), 0.1],
      [continuityGovernanceScore, 0.08],
    ]),
  );

  const institutionalSafeguardScore = getScore(
    input,
    "institutionalSafeguardScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseRiskProfile, ["institutionalStabilityDurability"]), 0.18],
      [extractProfileScore(input.enterpriseRiskProfile, ["systemicSurvivabilityBalance"]), 0.16],
      [extractProfileScore(input.enterpriseInstitutionalCohesionProfile, ["institutionalIdentityScore"]), 0.16],
      [extractProfileScore(input.enterpriseInstitutionalCohesionProfile, ["overallCohesionScore"]), 0.14],
      [extractProfileScore(input.longHorizonWealthPreservationProfile, ["institutionalContinuityDurability"]), 0.14],
      [extractProfileScore(input.institutionalKnowledgeTransferProfile, ["institutionalMemoryScore"]), 0.12],
      [reviewGovernanceScore, 0.1],
    ]),
  );

  const leadershipContinuityGovernanceScore = getScore(
    input,
    "leadershipContinuityGovernanceScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["leadershipContinuityScore"]), 0.2],
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["leadershipRecoveryScore"]), 0.16],
      [extractProfileScore(input.founderDependencyProfile, ["continuityReadinessScore"]), 0.16],
      [extractProfileScore(input.founderDependencyProfile, ["backupLeadershipReadinessScore"]), 0.16],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["crisisDecisionAuthorityScore"]), 0.12],
      [escalationGovernanceScore, 0.1],
      [continuityGovernanceScore, 0.1],
    ]),
  );

  const operationalContinuityGovernanceScore = getScore(
    input,
    "operationalContinuityGovernanceScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["operationalContinuityScore"]), 0.2],
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["operationalRecoveryScore"]), 0.16],
      [extractProfileScore(input.operationalPlaybookProfile, ["emergencyContinuityPlaybookScore"]), 0.16],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["continuityAccountabilityScore"]), 0.14],
      [extractProfileScore(input.enterpriseRiskProfile, ["operationalContinuityResilience"]), 0.12],
      [reviewGovernanceScore, 0.12],
      [escalationGovernanceScore, 0.1],
    ]),
  );

  const longHorizonGovernanceScore = getScore(
    input,
    "longHorizonGovernanceScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseStrategicReviewProfile, ["longHorizonReviewScore"]), 0.2],
      [extractProfileScore(input.longHorizonWealthPreservationProfile, ["longHorizonPreservationQuality"]), 0.18],
      [extractProfileScore(input.longHorizonWealthPreservationProfile, ["institutionalContinuityDurability"]), 0.16],
      [extractProfileScore(input.familyOfficeGovernanceProfile, ["governanceContinuity"]), 0.14],
      [extractProfileScore(input.familyOfficeGovernanceProfile, ["institutionalGovernanceDurability"]), 0.12],
      [institutionalSafeguardScore, 0.1],
      [reviewGovernanceScore, 0.1],
    ]),
  );

  const enterpriseGovernanceMaturityScore = getScore(
    input,
    "enterpriseGovernanceMaturityScore",
    weightedAverage([
      [continuityGovernanceScore, 0.12],
      [recoveryGovernanceScore, 0.11],
      [resilienceGovernanceScore, 0.11],
      [escalationGovernanceScore, 0.1],
      [reviewGovernanceScore, 0.11],
      [institutionalSafeguardScore, 0.1],
      [leadershipContinuityGovernanceScore, 0.09],
      [operationalContinuityGovernanceScore, 0.1],
      [longHorizonGovernanceScore, 0.1],
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["enterpriseContinuityMaturityScore"]), 0.03],
      [extractProfileScore(input.enterpriseResilienceProfile, ["enterpriseResilienceMaturityScore"]), 0.03],
    ]),
  );

  const overallScore = weightedAverage([
    [continuityGovernanceScore, 0.12],
    [recoveryGovernanceScore, 0.11],
    [resilienceGovernanceScore, 0.11],
    [escalationGovernanceScore, 0.1],
    [reviewGovernanceScore, 0.12],
    [institutionalSafeguardScore, 0.1],
    [leadershipContinuityGovernanceScore, 0.09],
    [operationalContinuityGovernanceScore, 0.1],
    [longHorizonGovernanceScore, 0.08],
    [enterpriseGovernanceMaturityScore, 0.07],
  ]);

  return {
    connectivityScore: escalationGovernanceScore,
    durabilityScore: overallScore,
    expansionScore: operationalContinuityGovernanceScore,
    institutionalScore: enterpriseGovernanceMaturityScore,
    logisticsScore: continuityGovernanceScore,
    luxuryScore: longHorizonGovernanceScore,
    developmentScore: institutionalSafeguardScore,
    overallScore,
    continuityGovernanceScore,
    recoveryGovernanceScore,
    resilienceGovernanceScore,
    escalationGovernanceScore,
    reviewGovernanceScore,
    institutionalSafeguardScore,
    leadershipContinuityGovernanceScore,
    operationalContinuityGovernanceScore,
    longHorizonGovernanceScore,
    enterpriseGovernanceMaturityScore,
  };
};

const classifyContinuityGovernance = (
  breakdown: EnterpriseContinuityGovernanceScoreBreakdown,
): ContinuityGovernanceLevel => {
  const coreMinimum = Math.min(
    breakdown.continuityGovernanceScore,
    breakdown.recoveryGovernanceScore,
    breakdown.resilienceGovernanceScore,
    breakdown.escalationGovernanceScore,
    breakdown.reviewGovernanceScore,
  );

  if (breakdown.overallScore >= 82 && coreMinimum >= 72 && breakdown.enterpriseGovernanceMaturityScore >= 76) {
    return "institutional_grade";
  }
  if (breakdown.overallScore >= 68 && coreMinimum >= 58) return "governed";
  if (breakdown.overallScore >= 54) return "developing";
  if (breakdown.overallScore >= 40) return "exposed";
  return "weak";
};

const buildWarnings = (
  breakdown: EnterpriseContinuityGovernanceScoreBreakdown,
  missingData: string[],
): CorridorWarning[] => [
  ...(missingData.length > 0
    ? [
        createCorridorWarning({
          code: "CONTINUITY_GOVERNANCE_DATA_INCOMPLETE",
          severity: missingData.length >= 5 ? "high" : "medium",
          message: "Enterprise continuity governance assessment is using incomplete structured inputs and requires human verification.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.overallScore < 42
    ? [
        createCorridorWarning({
          code: "CONTINUITY_GOVERNANCE_WEAK",
          severity: "high",
          message: "Enterprise continuity governance maturity is weak under current structured inputs.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.escalationGovernanceScore < 45
    ? [
        createCorridorWarning({
          code: "ESCALATION_GOVERNANCE_WEAK",
          severity: "medium",
          message: "Escalation governance discipline is weak; this module does not automate escalation or management decisions.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.reviewGovernanceScore < 45
    ? [
        createCorridorWarning({
          code: "REVIEW_GOVERNANCE_WEAK",
          severity: "medium",
          message: "Review governance discipline is weak and requires human governance review.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.longHorizonGovernanceScore < 45
    ? [
        createCorridorWarning({
          code: "LONG_HORIZON_GOVERNANCE_WEAK",
          severity: "medium",
          message: "Long-horizon governance durability is weak; this is not legal, tax, ownership, or investment advice.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
];

const buildKeyRisks = (breakdown: EnterpriseContinuityGovernanceScoreBreakdown): string[] =>
  unique([
    ...(breakdown.continuityGovernanceScore < 55 ? ["Continuity governance maturity may be underdeveloped."] : []),
    ...(breakdown.recoveryGovernanceScore < 55 ? ["Recovery governance maturity may be underdeveloped."] : []),
    ...(breakdown.resilienceGovernanceScore < 55 ? ["Resilience governance maturity may be underdeveloped."] : []),
    ...(breakdown.escalationGovernanceScore < 55 ? ["Escalation governance discipline may be unclear."] : []),
    ...(breakdown.reviewGovernanceScore < 55 ? ["Review governance discipline may be irregular."] : []),
    ...(breakdown.institutionalSafeguardScore < 55 ? ["Institutional safeguard governance may be thin."] : []),
    ...(breakdown.leadershipContinuityGovernanceScore < 55
      ? ["Leadership continuity governance may depend on narrow continuity capacity."]
      : []),
    ...(breakdown.operationalContinuityGovernanceScore < 55
      ? ["Operational continuity governance may be underdefined."]
      : []),
    ...(breakdown.longHorizonGovernanceScore < 55 ? ["Long-horizon governance durability may be weak."] : []),
  ]);

const buildStrengths = (breakdown: EnterpriseContinuityGovernanceScoreBreakdown): string[] =>
  unique([
    ...(breakdown.continuityGovernanceScore >= 72 ? ["Continuity governance maturity appears durable."] : []),
    ...(breakdown.recoveryGovernanceScore >= 72 ? ["Recovery governance maturity appears durable."] : []),
    ...(breakdown.resilienceGovernanceScore >= 72 ? ["Resilience governance maturity appears durable."] : []),
    ...(breakdown.escalationGovernanceScore >= 72 ? ["Escalation governance discipline appears durable."] : []),
    ...(breakdown.reviewGovernanceScore >= 72 ? ["Review governance discipline appears durable."] : []),
    ...(breakdown.institutionalSafeguardScore >= 72 ? ["Institutional safeguard governance appears durable."] : []),
    ...(breakdown.longHorizonGovernanceScore >= 72 ? ["Long-horizon governance durability appears strong."] : []),
    ...(breakdown.enterpriseGovernanceMaturityScore >= 72
      ? ["Enterprise continuity governance maturity appears institutionally reviewable."]
      : []),
  ]);

const buildRecommendations = (breakdown: EnterpriseContinuityGovernanceScoreBreakdown): string[] =>
  unique([
    ...(breakdown.continuityGovernanceScore < 65
      ? ["Review continuity governance ownership, standards, and maintenance cadence through human governance review."]
      : []),
    ...(breakdown.recoveryGovernanceScore < 65
      ? ["Review recovery governance maturity without creating autonomous recovery actions or management directives."]
      : []),
    ...(breakdown.resilienceGovernanceScore < 65
      ? ["Review resilience governance maturity and safeguard maintenance without autonomous strategy decisions."]
      : []),
    ...(breakdown.escalationGovernanceScore < 65
      ? ["Review escalation governance discipline and manual escalation authority boundaries."]
      : []),
    ...(breakdown.reviewGovernanceScore < 65
      ? ["Review continuity review discipline, cadence, and evidence quality through human-approved governance reviews."]
      : []),
    ...(breakdown.institutionalSafeguardScore < 65
      ? ["Review institutional safeguard governance without creating legal, ownership, tax, or investment advice."]
      : []),
    ...(breakdown.leadershipContinuityGovernanceScore < 65
      ? ["Review leadership continuity governance without creating HR, ownership, or legal advice."]
      : []),
    ...(breakdown.operationalContinuityGovernanceScore < 65
      ? ["Review operational continuity governance, role clarity, and playbook maintenance through human review."]
      : []),
    ...(breakdown.longHorizonGovernanceScore < 65
      ? ["Review long-horizon governance durability without legal, tax, ownership, lending, investment, or portfolio-management advice."]
      : []),
    "Use this module as read-only continuity governance intelligence for human review, not as a governance automation or execution system.",
  ]);

const buildReusableInfrastructureNotes = (input: EnterpriseContinuityGovernanceInput): string[] =>
  unique([
    "Reuses corridor scoring utilities for normalization, warnings, and confidence.",
    "Designed as a pure TypeScript module with deterministic structured inputs and explainable outputs.",
    ...(input.enterpriseBusinessContinuityProfile
      ? ["Can consume business continuity intelligence as read-only continuity governance context."]
      : []),
    ...(input.enterpriseRecoveryPlanningProfile
      ? ["Can consume recovery planning intelligence as read-only recovery governance context."]
      : []),
    ...(input.enterpriseResilienceProfile
      ? ["Can consume resilience intelligence as read-only resilience governance context."]
      : []),
    ...(input.enterpriseDecisionRightsProfile
      ? ["Can consume decision rights intelligence as read-only escalation and authority context."]
      : []),
    ...(input.enterpriseStrategicReviewProfile
      ? ["Can consume strategic review intelligence as read-only review governance context."]
      : []),
  ]);

const buildExplanation = (
  breakdown: EnterpriseContinuityGovernanceScoreBreakdown,
  continuityGovernanceLevel: ContinuityGovernanceLevel,
): string[] => [
  `Overall continuity governance score is ${breakdown.overallScore}, classified as ${continuityGovernanceLevel}.`,
  `Governance dimensions include continuity ${breakdown.continuityGovernanceScore}, recovery ${breakdown.recoveryGovernanceScore}, resilience ${breakdown.resilienceGovernanceScore}, escalation ${breakdown.escalationGovernanceScore}, and review discipline ${breakdown.reviewGovernanceScore}.`,
  `Safeguard dimensions include institutional safeguards ${breakdown.institutionalSafeguardScore}, leadership continuity governance ${breakdown.leadershipContinuityGovernanceScore}, operational continuity governance ${breakdown.operationalContinuityGovernanceScore}, and long-horizon governance ${breakdown.longHorizonGovernanceScore}.`,
  `Enterprise continuity governance maturity is ${breakdown.enterpriseGovernanceMaturityScore}.`,
  "This module is deterministic, explainable, read-only, compliance-first, and limited to human-reviewed continuity governance review signals.",
];

const buildTrace = (
  input: EnterpriseContinuityGovernanceInput,
  breakdown: EnterpriseContinuityGovernanceScoreBreakdown,
): string[] => [
  "Normalized all direct numeric inputs to a 0-100 deterministic scoring range.",
  "Used only optional read-only upstream intelligence profiles as fallback signals when direct continuity-governance inputs were absent.",
  "Treated every governance dimension as higher-is-better maturity; no governance procedure is executed or automated.",
  `Computed overallContinuityGovernanceScore=${breakdown.overallScore} with dataQualityScore=${typeof input.dataQualityScore === "number" ? normalizeCorridorScore(input.dataQualityScore) : "not provided"}.`,
  "No outreach, database writes, schema changes, automation execution, governance automation, market prediction, or financial/legal/HR advice was generated.",
];

const buildAssumptions = (input: EnterpriseContinuityGovernanceInput, missingData: string[]): string[] =>
  unique([
    ...(input.assumptions ?? []),
    "All continuity-governance inputs are deterministic structured signals supplied by human-reviewed systems.",
    "No live market, banking, financial, demographic, protected-class, or scraped data is used.",
    "Continuity governance scores represent review flags only and do not trigger autonomous actions, mitigation, governance automation, or execution.",
    ...(missingData.length > 0
      ? ["Some continuity-governance dimensions were inferred from available read-only profile fallbacks or neutral deterministic defaults."]
      : []),
  ]);

export function analyzeEnterpriseContinuityGovernanceIntelligence(
  input: EnterpriseContinuityGovernanceInput = {},
): EnterpriseContinuityGovernanceResult {
  const scoreBreakdown = buildScoreBreakdown(input);
  const missingData = getMissingData(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const continuityGovernanceLevel = classifyContinuityGovernance(scoreBreakdown);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallContinuityGovernanceScore: scoreBreakdown.overallScore,
    continuityGovernanceLevel,
    continuityGovernanceScore: scoreBreakdown.continuityGovernanceScore,
    recoveryGovernanceScore: scoreBreakdown.recoveryGovernanceScore,
    resilienceGovernanceScore: scoreBreakdown.resilienceGovernanceScore,
    escalationGovernanceScore: scoreBreakdown.escalationGovernanceScore,
    reviewGovernanceScore: scoreBreakdown.reviewGovernanceScore,
    institutionalSafeguardScore: scoreBreakdown.institutionalSafeguardScore,
    leadershipContinuityGovernanceScore: scoreBreakdown.leadershipContinuityGovernanceScore,
    operationalContinuityGovernanceScore: scoreBreakdown.operationalContinuityGovernanceScore,
    longHorizonGovernanceScore: scoreBreakdown.longHorizonGovernanceScore,
    enterpriseGovernanceMaturityScore: scoreBreakdown.enterpriseGovernanceMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    governanceWarnings: warnings.map((warning) => warning.message),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input),
    explanation: buildExplanation(scoreBreakdown, continuityGovernanceLevel),
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

export const getEnterpriseContinuityGovernanceIntelligence =
  analyzeEnterpriseContinuityGovernanceIntelligence;
