import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import {
  calculateCorridorConfidence,
  createCorridorWarning,
  normalizeCorridorScore,
} from "./corridor-intelligence-utils";

export type InternalControlsLevel = "weak" | "exposed" | "developing" | "controlled" | "institutional_grade";

export type EnterpriseInternalControlsInput = {
  governanceControlsScore?: number;
  operationalControlsScore?: number;
  communicationControlsScore?: number;
  escalationControlsScore?: number;
  recoveryControlsScore?: number;
  continuityControlsScore?: number;
  strategicControlsScore?: number;
  safeguardEnforcementScore?: number;
  institutionalStabilityControlsScore?: number;
  enterpriseInternalControlsMaturityScore?: number;
  enterpriseControlFrameworkProfile?: unknown;
  enterpriseInstitutionalSafeguardsProfile?: unknown;
  enterpriseContinuityGovernanceProfile?: unknown;
  enterpriseBusinessContinuityProfile?: unknown;
  enterpriseRecoveryPlanningProfile?: unknown;
  enterpriseDecisionRightsProfile?: unknown;
  enterpriseAccountabilityProfile?: unknown;
  enterpriseOperatingRhythmProfile?: unknown;
  operationalPlaybookProfile?: unknown;
  operationalQaProcessDriftProfile?: unknown;
  processOptimizationProfile?: unknown;
  enterpriseStrategicDoctrineProfile?: unknown;
  enterpriseStrategicReviewProfile?: unknown;
  enterpriseStrategicConsistencyProfile?: unknown;
  enterpriseResilienceProfile?: unknown;
  enterpriseRiskProfile?: unknown;
  institutionalKnowledgeTransferProfile?: unknown;
  enterpriseInstitutionalCohesionProfile?: unknown;
  longHorizonWealthPreservationProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseInternalControlsScoreBreakdown = CorridorScoreBreakdown & {
  overallScore: number;
  governanceControlsScore: number;
  operationalControlsScore: number;
  communicationControlsScore: number;
  escalationControlsScore: number;
  recoveryControlsScore: number;
  continuityControlsScore: number;
  strategicControlsScore: number;
  safeguardEnforcementScore: number;
  institutionalStabilityControlsScore: number;
  enterpriseInternalControlsMaturityScore: number;
};

export type EnterpriseInternalControlsResult = {
  overallInternalControlsScore: number;
  internalControlsLevel: InternalControlsLevel;
  governanceControlsScore: number;
  operationalControlsScore: number;
  communicationControlsScore: number;
  escalationControlsScore: number;
  recoveryControlsScore: number;
  continuityControlsScore: number;
  strategicControlsScore: number;
  safeguardEnforcementScore: number;
  institutionalStabilityControlsScore: number;
  enterpriseInternalControlsMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseInternalControlsScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  internalControlWarnings: string[];
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
    internalControlExecution: false;
    enforcementAutomation: false;
    approvalAutomation: false;
    escalationAutomation: false;
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
  "governanceControlsScore",
  "operationalControlsScore",
  "communicationControlsScore",
  "escalationControlsScore",
  "recoveryControlsScore",
  "continuityControlsScore",
  "strategicControlsScore",
  "safeguardEnforcementScore",
  "institutionalStabilityControlsScore",
  "enterpriseInternalControlsMaturityScore",
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
  input: EnterpriseInternalControlsInput,
  key: keyof EnterpriseInternalControlsInput,
  fallback: number,
): number => {
  const value = input[key];
  return typeof value === "number" && Number.isFinite(value)
    ? normalizeCorridorScore(value)
    : normalizeCorridorScore(fallback);
};

const hasFallbackForInput = (
  input: EnterpriseInternalControlsInput,
  key: (typeof REQUIRED_INPUTS)[number],
): boolean => {
  switch (key) {
    case "governanceControlsScore":
      return (
        hasProfileScore(input.enterpriseControlFrameworkProfile, ["governanceControlScore"]) ||
        hasProfileScore(input.enterpriseContinuityGovernanceProfile, ["reviewGovernanceScore", "continuityGovernanceScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["governanceSafeguardScore"])
      );
    case "operationalControlsScore":
      return (
        hasProfileScore(input.enterpriseControlFrameworkProfile, ["operationalControlScore"]) ||
        hasProfileScore(input.operationalQaProcessDriftProfile, ["overallOperationalConsistencyScore", "sopAdherenceScore"]) ||
        hasProfileScore(input.operationalPlaybookProfile, ["roleClarityScore", "updateDisciplineScore"])
      );
    case "communicationControlsScore":
      return (
        hasProfileScore(input.enterpriseControlFrameworkProfile, ["communicationControlScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["communicationSafeguardScore"]) ||
        hasProfileScore(input.operationalQaProcessDriftProfile, ["communicationConsistencyScore"])
      );
    case "escalationControlsScore":
      return (
        hasProfileScore(input.enterpriseControlFrameworkProfile, ["escalationControlScore"]) ||
        hasProfileScore(input.enterpriseDecisionRightsProfile, ["escalationAuthorityScore"]) ||
        hasProfileScore(input.enterpriseAccountabilityProfile, ["escalationClarityScore"])
      );
    case "recoveryControlsScore":
      return (
        hasProfileScore(input.enterpriseControlFrameworkProfile, ["recoveryControlScore"]) ||
        hasProfileScore(input.enterpriseRecoveryPlanningProfile, ["overallRecoveryScore", "enterpriseRecoveryMaturityScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["recoverySafeguardScore"])
      );
    case "continuityControlsScore":
      return (
        hasProfileScore(input.enterpriseControlFrameworkProfile, ["continuityControlScore"]) ||
        hasProfileScore(input.enterpriseBusinessContinuityProfile, ["overallContinuityScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["continuitySafeguardScore"])
      );
    case "strategicControlsScore":
      return (
        hasProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["strategicSafeguardScore"]) ||
        hasProfileScore(input.enterpriseStrategicDoctrineProfile, ["governanceDoctrineScore", "riskDoctrineScore"]) ||
        hasProfileScore(input.enterpriseStrategicConsistencyProfile, ["overallConsistencyScore"])
      );
    case "safeguardEnforcementScore":
      return (
        hasProfileScore(input.enterpriseControlFrameworkProfile, ["safeguardControlScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["overallSafeguardScore", "enterpriseSafeguardMaturityScore"]) ||
        hasProfileScore(input.enterpriseContinuityGovernanceProfile, ["institutionalSafeguardScore"])
      );
    case "institutionalStabilityControlsScore":
      return (
        hasProfileScore(input.enterpriseRiskProfile, ["institutionalStabilityDurability", "systemicSurvivabilityBalance"]) ||
        hasProfileScore(input.enterpriseInstitutionalCohesionProfile, ["overallCohesionScore", "institutionalIdentityScore"]) ||
        hasProfileScore(input.longHorizonWealthPreservationProfile, ["institutionalContinuityDurability"])
      );
    case "enterpriseInternalControlsMaturityScore":
      return (
        hasProfileScore(input.enterpriseControlFrameworkProfile, ["enterpriseControlMaturityScore", "overallControlFrameworkScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["enterpriseSafeguardMaturityScore"]) ||
        hasProfileScore(input.enterpriseContinuityGovernanceProfile, ["enterpriseGovernanceMaturityScore"])
      );
  }
};

const getMissingData = (input: EnterpriseInternalControlsInput): string[] =>
  REQUIRED_INPUTS.filter((key) => typeof input[key] !== "number" && !hasFallbackForInput(input, key));

const buildScoreBreakdown = (input: EnterpriseInternalControlsInput): EnterpriseInternalControlsScoreBreakdown => {
  const governanceControlsScore = getScore(
    input,
    "governanceControlsScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseControlFrameworkProfile, ["governanceControlScore"]), 0.2],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["reviewGovernanceScore"]), 0.16],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["continuityGovernanceScore"]), 0.14],
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["governanceSafeguardScore"]), 0.14],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["governanceAuthorityScore"]), 0.12],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["governanceAccountabilityScore"]), 0.12],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["quarterlyGovernanceScore"]), 0.12],
    ]),
  );

  const operationalControlsScore = getScore(
    input,
    "operationalControlsScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseControlFrameworkProfile, ["operationalControlScore"]), 0.2],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["overallOperationalConsistencyScore"]), 0.16],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["sopAdherenceScore"]), 0.14],
      [extractProfileScore(input.operationalPlaybookProfile, ["roleClarityScore"]), 0.12],
      [extractProfileScore(input.operationalPlaybookProfile, ["updateDisciplineScore"]), 0.12],
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["operationalContinuityScore"]), 0.12],
      [governanceControlsScore, 0.14],
    ]),
  );

  const communicationControlsScore = getScore(
    input,
    "communicationControlsScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseControlFrameworkProfile, ["communicationControlScore"]), 0.2],
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["communicationSafeguardScore"]), 0.18],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["communicationConsistencyScore"]), 0.16],
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["communicationContinuityScore"]), 0.14],
      [extractProfileScore(input.processOptimizationProfile, ["communicationEfficiencyScore"]), 0.12],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["escalationClarityScore"]), 0.1],
      [operationalControlsScore, 0.1],
    ]),
  );

  const escalationControlsScore = getScore(
    input,
    "escalationControlsScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseControlFrameworkProfile, ["escalationControlScore"]), 0.22],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["escalationAuthorityScore"]), 0.18],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["crisisDecisionAuthorityScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["escalationClarityScore"]), 0.14],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["escalationGovernanceScore"]), 0.12],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"]), 0.1],
      [governanceControlsScore, 0.1],
    ]),
  );

  const recoveryControlsScore = getScore(
    input,
    "recoveryControlsScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseControlFrameworkProfile, ["recoveryControlScore"]), 0.22],
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["overallRecoveryScore"]), 0.18],
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["enterpriseRecoveryMaturityScore"]), 0.16],
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["recoverySafeguardScore"]), 0.14],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["recoveryGovernanceScore"]), 0.12],
      [extractProfileScore(input.enterpriseResilienceProfile, ["recoveryReadinessScore"]), 0.1],
      [operationalControlsScore, 0.08],
    ]),
  );

  const continuityControlsScore = getScore(
    input,
    "continuityControlsScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseControlFrameworkProfile, ["continuityControlScore"]), 0.22],
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["overallContinuityScore"]), 0.18],
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["enterpriseContinuityMaturityScore"]), 0.16],
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["continuitySafeguardScore"]), 0.14],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["continuityGovernanceScore"]), 0.12],
      [extractProfileScore(input.enterpriseRiskProfile, ["operationalContinuityResilience"]), 0.1],
      [recoveryControlsScore, 0.08],
    ]),
  );

  const strategicControlsScore = getScore(
    input,
    "strategicControlsScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["strategicSafeguardScore"]), 0.2],
      [extractProfileScore(input.enterpriseStrategicDoctrineProfile, ["governanceDoctrineScore"]), 0.16],
      [extractProfileScore(input.enterpriseStrategicDoctrineProfile, ["riskDoctrineScore"]), 0.14],
      [extractProfileScore(input.enterpriseStrategicReviewProfile, ["strategicReviewMaturityScore"]), 0.14],
      [extractProfileScore(input.enterpriseStrategicConsistencyProfile, ["overallConsistencyScore"]), 0.14],
      [extractProfileScore(input.enterpriseControlFrameworkProfile, ["longHorizonControlScore"]), 0.1],
      [governanceControlsScore, 0.12],
    ]),
  );

  const safeguardEnforcementScore = getScore(
    input,
    "safeguardEnforcementScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseControlFrameworkProfile, ["safeguardControlScore"]), 0.22],
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["overallSafeguardScore"]), 0.18],
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["enterpriseSafeguardMaturityScore"]), 0.16],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["institutionalSafeguardScore"]), 0.14],
      [extractProfileScore(input.institutionalKnowledgeTransferProfile, ["institutionalMemoryScore"]), 0.1],
      [governanceControlsScore, 0.1],
      [continuityControlsScore, 0.1],
    ]),
  );

  const institutionalStabilityControlsScore = getScore(
    input,
    "institutionalStabilityControlsScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseRiskProfile, ["institutionalStabilityDurability"]), 0.18],
      [extractProfileScore(input.enterpriseRiskProfile, ["systemicSurvivabilityBalance"]), 0.16],
      [extractProfileScore(input.enterpriseInstitutionalCohesionProfile, ["overallCohesionScore"]), 0.16],
      [extractProfileScore(input.enterpriseInstitutionalCohesionProfile, ["institutionalIdentityScore"]), 0.14],
      [extractProfileScore(input.longHorizonWealthPreservationProfile, ["institutionalContinuityDurability"]), 0.14],
      [safeguardEnforcementScore, 0.12],
      [strategicControlsScore, 0.1],
    ]),
  );

  const enterpriseInternalControlsMaturityScore = getScore(
    input,
    "enterpriseInternalControlsMaturityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseControlFrameworkProfile, ["enterpriseControlMaturityScore"]), 0.16],
      [extractProfileScore(input.enterpriseControlFrameworkProfile, ["overallControlFrameworkScore"]), 0.14],
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["enterpriseSafeguardMaturityScore"]), 0.14],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["enterpriseGovernanceMaturityScore"]), 0.12],
      [governanceControlsScore, 0.08],
      [operationalControlsScore, 0.08],
      [escalationControlsScore, 0.08],
      [continuityControlsScore, 0.08],
      [safeguardEnforcementScore, 0.08],
      [institutionalStabilityControlsScore, 0.04],
    ]),
  );

  const overallScore = weightedAverage([
    [governanceControlsScore, 0.12],
    [operationalControlsScore, 0.12],
    [communicationControlsScore, 0.09],
    [escalationControlsScore, 0.1],
    [recoveryControlsScore, 0.1],
    [continuityControlsScore, 0.11],
    [strategicControlsScore, 0.11],
    [safeguardEnforcementScore, 0.1],
    [institutionalStabilityControlsScore, 0.08],
    [enterpriseInternalControlsMaturityScore, 0.07],
  ]);

  return {
    connectivityScore: communicationControlsScore,
    durabilityScore: overallScore,
    expansionScore: operationalControlsScore,
    institutionalScore: enterpriseInternalControlsMaturityScore,
    logisticsScore: governanceControlsScore,
    luxuryScore: institutionalStabilityControlsScore,
    developmentScore: safeguardEnforcementScore,
    overallScore,
    governanceControlsScore,
    operationalControlsScore,
    communicationControlsScore,
    escalationControlsScore,
    recoveryControlsScore,
    continuityControlsScore,
    strategicControlsScore,
    safeguardEnforcementScore,
    institutionalStabilityControlsScore,
    enterpriseInternalControlsMaturityScore,
  };
};

const classifyInternalControls = (breakdown: EnterpriseInternalControlsScoreBreakdown): InternalControlsLevel => {
  const coreMinimum = Math.min(
    breakdown.governanceControlsScore,
    breakdown.operationalControlsScore,
    breakdown.escalationControlsScore,
    breakdown.continuityControlsScore,
    breakdown.safeguardEnforcementScore,
  );

  if (breakdown.overallScore >= 82 && coreMinimum >= 72 && breakdown.enterpriseInternalControlsMaturityScore >= 76) {
    return "institutional_grade";
  }
  if (breakdown.overallScore >= 68 && coreMinimum >= 58) return "controlled";
  if (breakdown.overallScore >= 54) return "developing";
  if (breakdown.overallScore >= 40) return "exposed";
  return "weak";
};

const buildWarnings = (
  breakdown: EnterpriseInternalControlsScoreBreakdown,
  missingData: string[],
): CorridorWarning[] => [
  ...(missingData.length > 0
    ? [
        createCorridorWarning({
          code: "INTERNAL_CONTROLS_DATA_INCOMPLETE",
          severity: missingData.length >= 5 ? "high" : "medium",
          message: "Enterprise internal controls assessment is using incomplete structured inputs and requires human verification.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.overallScore < 42
    ? [
        createCorridorWarning({
          code: "INTERNAL_CONTROLS_WEAK",
          severity: "high",
          message: "Enterprise internal controls maturity is weak under current structured inputs.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.escalationControlsScore < 45
    ? [
        createCorridorWarning({
          code: "ESCALATION_INTERNAL_CONTROLS_WEAK",
          severity: "medium",
          message: "Escalation internal controls are weak; this module does not execute or automate escalation.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.safeguardEnforcementScore < 45
    ? [
        createCorridorWarning({
          code: "SAFEGUARD_ENFORCEMENT_CONTROLS_WEAK",
          severity: "medium",
          message: "Safeguard enforcement controls are weak; this module does not enforce controls or automate management actions.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.institutionalStabilityControlsScore < 45
    ? [
        createCorridorWarning({
          code: "INSTITUTIONAL_STABILITY_CONTROLS_WEAK",
          severity: "medium",
          message: "Institutional stability controls are weak; this is not legal, tax, ownership, lending, investment, or portfolio-management advice.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
];

const buildKeyRisks = (breakdown: EnterpriseInternalControlsScoreBreakdown): string[] =>
  unique([
    ...(breakdown.governanceControlsScore < 55 ? ["Governance internal controls may be underdeveloped."] : []),
    ...(breakdown.operationalControlsScore < 55 ? ["Operational internal controls may be inconsistent."] : []),
    ...(breakdown.communicationControlsScore < 55 ? ["Communication internal controls may be underdefined."] : []),
    ...(breakdown.escalationControlsScore < 55 ? ["Escalation internal controls may be weak."] : []),
    ...(breakdown.recoveryControlsScore < 55 ? ["Recovery internal controls may be weak."] : []),
    ...(breakdown.continuityControlsScore < 55 ? ["Continuity internal controls may be fragile."] : []),
    ...(breakdown.strategicControlsScore < 55 ? ["Strategic internal controls may be underdeveloped."] : []),
    ...(breakdown.safeguardEnforcementScore < 55 ? ["Safeguard enforcement controls may be thin."] : []),
    ...(breakdown.institutionalStabilityControlsScore < 55
      ? ["Institutional stability controls may be underdeveloped."]
      : []),
  ]);

const buildStrengths = (breakdown: EnterpriseInternalControlsScoreBreakdown): string[] =>
  unique([
    ...(breakdown.governanceControlsScore >= 72 ? ["Governance internal controls appear mature."] : []),
    ...(breakdown.operationalControlsScore >= 72 ? ["Operational internal controls appear durable."] : []),
    ...(breakdown.communicationControlsScore >= 72 ? ["Communication internal controls appear stable without outreach automation."] : []),
    ...(breakdown.escalationControlsScore >= 72 ? ["Escalation internal controls appear clear without escalation automation."] : []),
    ...(breakdown.recoveryControlsScore >= 72 ? ["Recovery internal controls appear durable."] : []),
    ...(breakdown.continuityControlsScore >= 72 ? ["Continuity internal controls appear durable."] : []),
    ...(breakdown.strategicControlsScore >= 72 ? ["Strategic internal controls appear disciplined."] : []),
    ...(breakdown.safeguardEnforcementScore >= 72 ? ["Safeguard enforcement controls appear reviewable."] : []),
    ...(breakdown.institutionalStabilityControlsScore >= 72 ? ["Institutional stability controls appear durable."] : []),
    ...(breakdown.enterpriseInternalControlsMaturityScore >= 72
      ? ["Enterprise internal controls maturity appears institutionally reviewable."]
      : []),
  ]);

const buildRecommendations = (breakdown: EnterpriseInternalControlsScoreBreakdown): string[] =>
  unique([
    ...(breakdown.governanceControlsScore < 65
      ? ["Review governance internal controls, evidence quality, and review discipline through human governance review."]
      : []),
    ...(breakdown.operationalControlsScore < 65
      ? ["Review operational internal controls, SOP adherence, and playbook update discipline without executing changes."]
      : []),
    ...(breakdown.communicationControlsScore < 65
      ? ["Review communication internal controls without sending messages or modifying CRM/outreach systems."]
      : []),
    ...(breakdown.escalationControlsScore < 65
      ? ["Review escalation internal controls without automating escalation or management decisions."]
      : []),
    ...(breakdown.recoveryControlsScore < 65
      ? ["Review recovery internal controls without creating autonomous recovery actions."]
      : []),
    ...(breakdown.continuityControlsScore < 65
      ? ["Review continuity internal controls and maintenance discipline as human-reviewed operating signals."]
      : []),
    ...(breakdown.strategicControlsScore < 65
      ? ["Review strategic internal controls without autonomous strategy decisions, market prediction, or investment advice."]
      : []),
    ...(breakdown.safeguardEnforcementScore < 65
      ? ["Review safeguard enforcement controls without control execution, legal, HR, ownership, tax, lending, investment, or portfolio-management advice."]
      : []),
    ...(breakdown.institutionalStabilityControlsScore < 65
      ? ["Review institutional stability controls without legal, tax, ownership, lending, investment, or portfolio-management advice."]
      : []),
    "Use this module as read-only internal controls intelligence for human review, not as an internal-control execution, enforcement automation, approval automation, escalation automation, or management-decision system.",
  ]);

const buildReusableInfrastructureNotes = (input: EnterpriseInternalControlsInput): string[] =>
  unique([
    "Reuses corridor scoring utilities for normalization, warnings, and confidence.",
    "Designed as a pure TypeScript module with deterministic structured inputs and explainable outputs.",
    ...(input.enterpriseControlFrameworkProfile
      ? ["Can consume control framework intelligence as read-only internal controls context."]
      : []),
    ...(input.enterpriseInstitutionalSafeguardsProfile
      ? ["Can consume institutional safeguards intelligence as read-only safeguard control context."]
      : []),
    ...(input.enterpriseContinuityGovernanceProfile
      ? ["Can consume continuity governance intelligence as read-only governance control context."]
      : []),
    ...(input.operationalQaProcessDriftProfile
      ? ["Can consume process drift intelligence as read-only operational control context."]
      : []),
    ...(input.enterpriseDecisionRightsProfile
      ? ["Can consume decision rights intelligence as read-only escalation and governance control context."]
      : []),
  ]);

const buildExplanation = (
  breakdown: EnterpriseInternalControlsScoreBreakdown,
  internalControlsLevel: InternalControlsLevel,
): string[] => [
  `Overall internal controls score is ${breakdown.overallScore}, classified as ${internalControlsLevel}.`,
  `Internal control dimensions include governance ${breakdown.governanceControlsScore}, operational ${breakdown.operationalControlsScore}, communication ${breakdown.communicationControlsScore}, escalation ${breakdown.escalationControlsScore}, and recovery ${breakdown.recoveryControlsScore}.`,
  `Continuity and stability dimensions include continuity ${breakdown.continuityControlsScore}, strategic ${breakdown.strategicControlsScore}, safeguard enforcement ${breakdown.safeguardEnforcementScore}, and institutional stability ${breakdown.institutionalStabilityControlsScore}.`,
  `Enterprise internal controls maturity is ${breakdown.enterpriseInternalControlsMaturityScore}.`,
  "This module is deterministic, explainable, read-only, compliance-first, and limited to human-reviewed internal-control review signals.",
];

const buildTrace = (
  input: EnterpriseInternalControlsInput,
  breakdown: EnterpriseInternalControlsScoreBreakdown,
): string[] => [
  "Normalized all direct numeric inputs to a 0-100 deterministic scoring range.",
  "Used only optional read-only upstream intelligence profiles as fallback signals when direct internal-control inputs were absent.",
  "Treated every internal-control dimension as higher-is-better maturity; no control, enforcement, approval, escalation, governance, communication, recovery, or continuity action is executed or automated.",
  `Computed overallInternalControlsScore=${breakdown.overallScore} with dataQualityScore=${typeof input.dataQualityScore === "number" ? normalizeCorridorScore(input.dataQualityScore) : "not provided"}.`,
  "No outreach, SMS, email, Twilio, database writes, schema changes, automation execution, internal-control execution, enforcement automation, approval automation, escalation automation, market prediction, protected-class logic, demographic targeting, or financial/legal/HR advice was generated.",
];

const buildAssumptions = (input: EnterpriseInternalControlsInput, missingData: string[]): string[] =>
  unique([
    ...(input.assumptions ?? []),
    "All internal-control inputs are deterministic structured signals supplied by human-reviewed systems.",
    "No live market, banking, financial, demographic, protected-class, or scraped data is used.",
    "Internal control scores represent review flags only and do not trigger autonomous actions, enforcement automation, approval automation, escalation automation, governance automation, outreach, or execution.",
    ...(missingData.length > 0
      ? ["Some internal-control dimensions were inferred from available read-only profile fallbacks or neutral deterministic defaults."]
      : []),
  ]);

export function analyzeEnterpriseInternalControlsIntelligence(
  input: EnterpriseInternalControlsInput = {},
): EnterpriseInternalControlsResult {
  const scoreBreakdown = buildScoreBreakdown(input);
  const missingData = getMissingData(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const internalControlsLevel = classifyInternalControls(scoreBreakdown);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallInternalControlsScore: scoreBreakdown.overallScore,
    internalControlsLevel,
    governanceControlsScore: scoreBreakdown.governanceControlsScore,
    operationalControlsScore: scoreBreakdown.operationalControlsScore,
    communicationControlsScore: scoreBreakdown.communicationControlsScore,
    escalationControlsScore: scoreBreakdown.escalationControlsScore,
    recoveryControlsScore: scoreBreakdown.recoveryControlsScore,
    continuityControlsScore: scoreBreakdown.continuityControlsScore,
    strategicControlsScore: scoreBreakdown.strategicControlsScore,
    safeguardEnforcementScore: scoreBreakdown.safeguardEnforcementScore,
    institutionalStabilityControlsScore: scoreBreakdown.institutionalStabilityControlsScore,
    enterpriseInternalControlsMaturityScore: scoreBreakdown.enterpriseInternalControlsMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    internalControlWarnings: warnings.map((warning) => warning.message),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input),
    explanation: buildExplanation(scoreBreakdown, internalControlsLevel),
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
      internalControlExecution: false,
      enforcementAutomation: false,
      approvalAutomation: false,
      escalationAutomation: false,
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

export const getEnterpriseInternalControlsIntelligence =
  analyzeEnterpriseInternalControlsIntelligence;
