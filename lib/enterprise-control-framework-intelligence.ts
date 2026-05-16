import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import {
  calculateCorridorConfidence,
  createCorridorWarning,
  normalizeCorridorScore,
} from "./corridor-intelligence-utils";

export type ControlFrameworkLevel = "weak" | "exposed" | "developing" | "controlled" | "institutional_grade";

export type EnterpriseControlFrameworkInput = {
  governanceControlScore?: number;
  operationalControlScore?: number;
  decisionControlScore?: number;
  escalationControlScore?: number;
  communicationControlScore?: number;
  recoveryControlScore?: number;
  continuityControlScore?: number;
  safeguardControlScore?: number;
  longHorizonControlScore?: number;
  enterpriseControlMaturityScore?: number;
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
  founderDependencyProfile?: unknown;
  institutionalKnowledgeTransferProfile?: unknown;
  enterpriseInstitutionalCohesionProfile?: unknown;
  longHorizonWealthPreservationProfile?: unknown;
  familyOfficeGovernanceProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseControlFrameworkScoreBreakdown = CorridorScoreBreakdown & {
  overallScore: number;
  governanceControlScore: number;
  operationalControlScore: number;
  decisionControlScore: number;
  escalationControlScore: number;
  communicationControlScore: number;
  recoveryControlScore: number;
  continuityControlScore: number;
  safeguardControlScore: number;
  longHorizonControlScore: number;
  enterpriseControlMaturityScore: number;
};

export type EnterpriseControlFrameworkResult = {
  overallControlFrameworkScore: number;
  controlFrameworkLevel: ControlFrameworkLevel;
  governanceControlScore: number;
  operationalControlScore: number;
  decisionControlScore: number;
  escalationControlScore: number;
  communicationControlScore: number;
  recoveryControlScore: number;
  continuityControlScore: number;
  safeguardControlScore: number;
  longHorizonControlScore: number;
  enterpriseControlMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseControlFrameworkScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  controlWarnings: string[];
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
    controlExecution: false;
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
  "governanceControlScore",
  "operationalControlScore",
  "decisionControlScore",
  "escalationControlScore",
  "communicationControlScore",
  "recoveryControlScore",
  "continuityControlScore",
  "safeguardControlScore",
  "longHorizonControlScore",
  "enterpriseControlMaturityScore",
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
  input: EnterpriseControlFrameworkInput,
  key: keyof EnterpriseControlFrameworkInput,
  fallback: number,
): number => {
  const value = input[key];
  return typeof value === "number" && Number.isFinite(value)
    ? normalizeCorridorScore(value)
    : normalizeCorridorScore(fallback);
};

const hasFallbackForInput = (
  input: EnterpriseControlFrameworkInput,
  key: (typeof REQUIRED_INPUTS)[number],
): boolean => {
  switch (key) {
    case "governanceControlScore":
      return (
        hasProfileScore(input.enterpriseContinuityGovernanceProfile, ["continuityGovernanceScore", "reviewGovernanceScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["governanceSafeguardScore"]) ||
        hasProfileScore(input.enterpriseDecisionRightsProfile, ["governanceAuthorityScore"])
      );
    case "operationalControlScore":
      return (
        hasProfileScore(input.enterpriseBusinessContinuityProfile, ["operationalContinuityScore"]) ||
        hasProfileScore(input.operationalPlaybookProfile, ["roleClarityScore", "updateDisciplineScore"]) ||
        hasProfileScore(input.operationalQaProcessDriftProfile, ["overallOperationalConsistencyScore"])
      );
    case "decisionControlScore":
      return (
        hasProfileScore(input.enterpriseDecisionRightsProfile, ["overallDecisionRightsScore", "approvalRightsScore"]) ||
        hasProfileScore(input.enterpriseAccountabilityProfile, ["roleOwnershipScore", "taskResponsibilityScore"])
      );
    case "escalationControlScore":
      return (
        hasProfileScore(input.enterpriseDecisionRightsProfile, ["escalationAuthorityScore", "crisisDecisionAuthorityScore"]) ||
        hasProfileScore(input.enterpriseAccountabilityProfile, ["escalationClarityScore"]) ||
        hasProfileScore(input.enterpriseContinuityGovernanceProfile, ["escalationGovernanceScore"])
      );
    case "communicationControlScore":
      return (
        hasProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["communicationSafeguardScore"]) ||
        hasProfileScore(input.enterpriseBusinessContinuityProfile, ["communicationContinuityScore"]) ||
        hasProfileScore(input.operationalQaProcessDriftProfile, ["communicationConsistencyScore"])
      );
    case "recoveryControlScore":
      return (
        hasProfileScore(input.enterpriseRecoveryPlanningProfile, ["overallRecoveryScore", "enterpriseRecoveryMaturityScore"]) ||
        hasProfileScore(input.enterpriseContinuityGovernanceProfile, ["recoveryGovernanceScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["recoverySafeguardScore"])
      );
    case "continuityControlScore":
      return (
        hasProfileScore(input.enterpriseBusinessContinuityProfile, ["overallContinuityScore", "enterpriseContinuityMaturityScore"]) ||
        hasProfileScore(input.enterpriseContinuityGovernanceProfile, ["continuityGovernanceScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["continuitySafeguardScore"])
      );
    case "safeguardControlScore":
      return (
        hasProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["overallSafeguardScore", "enterpriseSafeguardMaturityScore"]) ||
        hasProfileScore(input.enterpriseContinuityGovernanceProfile, ["institutionalSafeguardScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalCohesionProfile, ["institutionalIdentityScore"])
      );
    case "longHorizonControlScore":
      return (
        hasProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["longHorizonSafeguardScore"]) ||
        hasProfileScore(input.enterpriseContinuityGovernanceProfile, ["longHorizonGovernanceScore"]) ||
        hasProfileScore(input.longHorizonWealthPreservationProfile, ["longHorizonPreservationQuality"])
      );
    case "enterpriseControlMaturityScore":
      return (
        hasProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["enterpriseSafeguardMaturityScore"]) ||
        hasProfileScore(input.enterpriseContinuityGovernanceProfile, ["enterpriseGovernanceMaturityScore"]) ||
        hasProfileScore(input.enterpriseDecisionRightsProfile, ["institutionalHierarchyMaturityScore"]) ||
        hasProfileScore(input.enterpriseBusinessContinuityProfile, ["enterpriseContinuityMaturityScore"])
      );
  }
};

const getMissingData = (input: EnterpriseControlFrameworkInput): string[] =>
  REQUIRED_INPUTS.filter((key) => typeof input[key] !== "number" && !hasFallbackForInput(input, key));

const buildScoreBreakdown = (input: EnterpriseControlFrameworkInput): EnterpriseControlFrameworkScoreBreakdown => {
  const governanceControlScore = getScore(
    input,
    "governanceControlScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["continuityGovernanceScore"]), 0.2],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["reviewGovernanceScore"]), 0.16],
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["governanceSafeguardScore"]), 0.16],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["governanceAuthorityScore"]), 0.14],
      [extractProfileScore(input.enterpriseStrategicReviewProfile, ["governanceReviewScore"]), 0.12],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["governanceAccountabilityScore"]), 0.12],
      [extractProfileScore(input.familyOfficeGovernanceProfile, ["governanceContinuity"]), 0.1],
    ]),
  );

  const operationalControlScore = getScore(
    input,
    "operationalControlScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["operationalContinuityScore"]), 0.18],
      [extractProfileScore(input.operationalPlaybookProfile, ["roleClarityScore"]), 0.16],
      [extractProfileScore(input.operationalPlaybookProfile, ["updateDisciplineScore"]), 0.14],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["overallOperationalConsistencyScore"]), 0.14],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["sopAdherenceScore"]), 0.12],
      [extractProfileScore(input.processOptimizationProfile, ["workflowEfficiencyScore"]), 0.1],
      [governanceControlScore, 0.16],
    ]),
  );

  const decisionControlScore = getScore(
    input,
    "decisionControlScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["overallDecisionRightsScore"]), 0.2],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["approvalRightsScore"]), 0.16],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["authorityClarityScore"]), 0.16],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["overrideDisciplineScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["roleOwnershipScore"]), 0.12],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["taskResponsibilityScore"]), 0.1],
      [governanceControlScore, 0.12],
    ]),
  );

  const escalationControlScore = getScore(
    input,
    "escalationControlScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["escalationAuthorityScore"]), 0.22],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["crisisDecisionAuthorityScore"]), 0.16],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["escalationClarityScore"]), 0.16],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["escalationGovernanceScore"]), 0.14],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"]), 0.12],
      [extractProfileScore(input.founderDependencyProfile, ["backupLeadershipReadinessScore"]), 0.1],
      [decisionControlScore, 0.1],
    ]),
  );

  const communicationControlScore = getScore(
    input,
    "communicationControlScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["communicationSafeguardScore"]), 0.2],
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["communicationContinuityScore"]), 0.16],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["communicationConsistencyScore"]), 0.16],
      [extractProfileScore(input.processOptimizationProfile, ["communicationEfficiencyScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["escalationClarityScore"]), 0.12],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["escalationAuthorityScore"]), 0.1],
      [escalationControlScore, 0.12],
    ]),
  );

  const recoveryControlScore = getScore(
    input,
    "recoveryControlScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["overallRecoveryScore"]), 0.22],
      [extractProfileScore(input.enterpriseRecoveryPlanningProfile, ["enterpriseRecoveryMaturityScore"]), 0.18],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["recoveryGovernanceScore"]), 0.16],
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["recoverySafeguardScore"]), 0.14],
      [extractProfileScore(input.enterpriseResilienceProfile, ["recoveryReadinessScore"]), 0.12],
      [governanceControlScore, 0.1],
      [operationalControlScore, 0.08],
    ]),
  );

  const continuityControlScore = getScore(
    input,
    "continuityControlScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["overallContinuityScore"]), 0.22],
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["enterpriseContinuityMaturityScore"]), 0.18],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["continuityGovernanceScore"]), 0.16],
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["continuitySafeguardScore"]), 0.14],
      [extractProfileScore(input.enterpriseRiskProfile, ["operationalContinuityResilience"]), 0.12],
      [recoveryControlScore, 0.1],
      [operationalControlScore, 0.08],
    ]),
  );

  const safeguardControlScore = getScore(
    input,
    "safeguardControlScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["overallSafeguardScore"]), 0.22],
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["enterpriseSafeguardMaturityScore"]), 0.18],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["institutionalSafeguardScore"]), 0.16],
      [extractProfileScore(input.enterpriseInstitutionalCohesionProfile, ["institutionalIdentityScore"]), 0.12],
      [extractProfileScore(input.institutionalKnowledgeTransferProfile, ["institutionalMemoryScore"]), 0.1],
      [governanceControlScore, 0.1],
      [continuityControlScore, 0.12],
    ]),
  );

  const longHorizonControlScore = getScore(
    input,
    "longHorizonControlScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["longHorizonSafeguardScore"]), 0.2],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["longHorizonGovernanceScore"]), 0.18],
      [extractProfileScore(input.longHorizonWealthPreservationProfile, ["longHorizonPreservationQuality"]), 0.16],
      [extractProfileScore(input.longHorizonWealthPreservationProfile, ["institutionalContinuityDurability"]), 0.14],
      [extractProfileScore(input.enterpriseStrategicDoctrineProfile, ["longHorizonDoctrineScore"]), 0.12],
      [extractProfileScore(input.enterpriseStrategicConsistencyProfile, ["longHorizonConsistencyScore"]), 0.1],
      [safeguardControlScore, 0.1],
    ]),
  );

  const enterpriseControlMaturityScore = getScore(
    input,
    "enterpriseControlMaturityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["enterpriseSafeguardMaturityScore"]), 0.16],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["enterpriseGovernanceMaturityScore"]), 0.14],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["institutionalHierarchyMaturityScore"]), 0.14],
      [extractProfileScore(input.enterpriseBusinessContinuityProfile, ["enterpriseContinuityMaturityScore"]), 0.12],
      [governanceControlScore, 0.08],
      [decisionControlScore, 0.08],
      [operationalControlScore, 0.08],
      [continuityControlScore, 0.08],
      [safeguardControlScore, 0.08],
      [longHorizonControlScore, 0.04],
    ]),
  );

  const overallScore = weightedAverage([
    [governanceControlScore, 0.12],
    [operationalControlScore, 0.11],
    [decisionControlScore, 0.11],
    [escalationControlScore, 0.1],
    [communicationControlScore, 0.09],
    [recoveryControlScore, 0.1],
    [continuityControlScore, 0.11],
    [safeguardControlScore, 0.1],
    [longHorizonControlScore, 0.08],
    [enterpriseControlMaturityScore, 0.08],
  ]);

  return {
    connectivityScore: communicationControlScore,
    durabilityScore: overallScore,
    expansionScore: operationalControlScore,
    institutionalScore: enterpriseControlMaturityScore,
    logisticsScore: governanceControlScore,
    luxuryScore: longHorizonControlScore,
    developmentScore: safeguardControlScore,
    overallScore,
    governanceControlScore,
    operationalControlScore,
    decisionControlScore,
    escalationControlScore,
    communicationControlScore,
    recoveryControlScore,
    continuityControlScore,
    safeguardControlScore,
    longHorizonControlScore,
    enterpriseControlMaturityScore,
  };
};

const classifyControlFramework = (breakdown: EnterpriseControlFrameworkScoreBreakdown): ControlFrameworkLevel => {
  const coreMinimum = Math.min(
    breakdown.governanceControlScore,
    breakdown.operationalControlScore,
    breakdown.decisionControlScore,
    breakdown.escalationControlScore,
    breakdown.continuityControlScore,
  );

  if (breakdown.overallScore >= 82 && coreMinimum >= 72 && breakdown.enterpriseControlMaturityScore >= 76) {
    return "institutional_grade";
  }
  if (breakdown.overallScore >= 68 && coreMinimum >= 58) return "controlled";
  if (breakdown.overallScore >= 54) return "developing";
  if (breakdown.overallScore >= 40) return "exposed";
  return "weak";
};

const buildWarnings = (
  breakdown: EnterpriseControlFrameworkScoreBreakdown,
  missingData: string[],
): CorridorWarning[] => [
  ...(missingData.length > 0
    ? [
        createCorridorWarning({
          code: "CONTROL_FRAMEWORK_DATA_INCOMPLETE",
          severity: missingData.length >= 5 ? "high" : "medium",
          message: "Enterprise control framework assessment is using incomplete structured inputs and requires human verification.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.overallScore < 42
    ? [
        createCorridorWarning({
          code: "CONTROL_FRAMEWORK_WEAK",
          severity: "high",
          message: "Enterprise control framework maturity is weak under current structured inputs.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.decisionControlScore < 45
    ? [
        createCorridorWarning({
          code: "DECISION_CONTROL_WEAK",
          severity: "medium",
          message: "Decision control maturity is weak; this module does not automate approvals or management decisions.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.escalationControlScore < 45
    ? [
        createCorridorWarning({
          code: "ESCALATION_CONTROL_WEAK",
          severity: "medium",
          message: "Escalation control maturity is weak; this module does not execute or automate escalation.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.longHorizonControlScore < 45
    ? [
        createCorridorWarning({
          code: "LONG_HORIZON_CONTROL_WEAK",
          severity: "medium",
          message: "Long-horizon control durability is weak; this is not legal, tax, ownership, lending, investment, or portfolio-management advice.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
];

const buildKeyRisks = (breakdown: EnterpriseControlFrameworkScoreBreakdown): string[] =>
  unique([
    ...(breakdown.governanceControlScore < 55 ? ["Governance control maturity may be underdeveloped."] : []),
    ...(breakdown.operationalControlScore < 55 ? ["Operational control maturity may be inconsistent."] : []),
    ...(breakdown.decisionControlScore < 55 ? ["Decision control maturity may be unclear."] : []),
    ...(breakdown.escalationControlScore < 55 ? ["Escalation control maturity may be underdefined."] : []),
    ...(breakdown.communicationControlScore < 55 ? ["Communication control maturity may be inconsistent."] : []),
    ...(breakdown.recoveryControlScore < 55 ? ["Recovery control maturity may be weak."] : []),
    ...(breakdown.continuityControlScore < 55 ? ["Continuity control maturity may be fragile."] : []),
    ...(breakdown.safeguardControlScore < 55 ? ["Institutional safeguard controls may be thin."] : []),
    ...(breakdown.longHorizonControlScore < 55 ? ["Long-horizon control durability may be weak."] : []),
  ]);

const buildStrengths = (breakdown: EnterpriseControlFrameworkScoreBreakdown): string[] =>
  unique([
    ...(breakdown.governanceControlScore >= 72 ? ["Governance controls appear mature and reviewable."] : []),
    ...(breakdown.operationalControlScore >= 72 ? ["Operational controls appear durable."] : []),
    ...(breakdown.decisionControlScore >= 72 ? ["Decision controls appear clear without approval automation."] : []),
    ...(breakdown.escalationControlScore >= 72 ? ["Escalation controls appear clear without escalation automation."] : []),
    ...(breakdown.communicationControlScore >= 72 ? ["Communication controls appear stable without outreach automation."] : []),
    ...(breakdown.recoveryControlScore >= 72 ? ["Recovery controls appear durable."] : []),
    ...(breakdown.continuityControlScore >= 72 ? ["Continuity controls appear durable."] : []),
    ...(breakdown.safeguardControlScore >= 72 ? ["Institutional safeguard controls appear mature."] : []),
    ...(breakdown.longHorizonControlScore >= 72 ? ["Long-horizon control durability appears strong."] : []),
    ...(breakdown.enterpriseControlMaturityScore >= 72 ? ["Enterprise control framework maturity appears institutionally reviewable."] : []),
  ]);

const buildRecommendations = (breakdown: EnterpriseControlFrameworkScoreBreakdown): string[] =>
  unique([
    ...(breakdown.governanceControlScore < 65
      ? ["Review governance control ownership, evidence quality, and review cadence through human governance review."]
      : []),
    ...(breakdown.operationalControlScore < 65
      ? ["Review operational controls, playbook coverage, and QA consistency without executing operational changes."]
      : []),
    ...(breakdown.decisionControlScore < 65
      ? ["Review decision controls and approval boundaries without creating approval automation or autonomous management decisions."]
      : []),
    ...(breakdown.escalationControlScore < 65
      ? ["Review escalation controls and manual escalation authority without automating escalation."]
      : []),
    ...(breakdown.communicationControlScore < 65
      ? ["Review communication controls and standards without sending messages or modifying CRM/outreach systems."]
      : []),
    ...(breakdown.recoveryControlScore < 65
      ? ["Review recovery controls without creating autonomous recovery actions or execution steps."]
      : []),
    ...(breakdown.continuityControlScore < 65
      ? ["Review continuity controls and maintenance discipline as human-reviewed operational governance signals."]
      : []),
    ...(breakdown.safeguardControlScore < 65
      ? ["Review institutional safeguard controls without legal, HR, ownership, tax, lending, investment, or portfolio-management advice."]
      : []),
    ...(breakdown.longHorizonControlScore < 65
      ? ["Review long-horizon control durability without legal, tax, ownership, lending, investment, or portfolio-management advice."]
      : []),
    "Use this module as read-only control framework intelligence for human review, not as a control execution, approval automation, escalation automation, or management-decision system.",
  ]);

const buildReusableInfrastructureNotes = (input: EnterpriseControlFrameworkInput): string[] =>
  unique([
    "Reuses corridor scoring utilities for normalization, warnings, and confidence.",
    "Designed as a pure TypeScript module with deterministic structured inputs and explainable outputs.",
    ...(input.enterpriseInstitutionalSafeguardsProfile
      ? ["Can consume institutional safeguards intelligence as read-only control safeguard context."]
      : []),
    ...(input.enterpriseDecisionRightsProfile
      ? ["Can consume decision rights intelligence as read-only decision and escalation control context."]
      : []),
    ...(input.enterpriseContinuityGovernanceProfile
      ? ["Can consume continuity governance intelligence as read-only governance and continuity control context."]
      : []),
    ...(input.enterpriseBusinessContinuityProfile
      ? ["Can consume business continuity intelligence as read-only operational continuity control context."]
      : []),
    ...(input.enterpriseRecoveryPlanningProfile
      ? ["Can consume recovery planning intelligence as read-only recovery control context."]
      : []),
  ]);

const buildExplanation = (
  breakdown: EnterpriseControlFrameworkScoreBreakdown,
  controlFrameworkLevel: ControlFrameworkLevel,
): string[] => [
  `Overall control framework score is ${breakdown.overallScore}, classified as ${controlFrameworkLevel}.`,
  `Core controls include governance ${breakdown.governanceControlScore}, operational ${breakdown.operationalControlScore}, decision ${breakdown.decisionControlScore}, escalation ${breakdown.escalationControlScore}, and communication ${breakdown.communicationControlScore}.`,
  `Continuity controls include recovery ${breakdown.recoveryControlScore}, continuity ${breakdown.continuityControlScore}, institutional safeguards ${breakdown.safeguardControlScore}, and long-horizon durability ${breakdown.longHorizonControlScore}.`,
  `Enterprise control framework maturity is ${breakdown.enterpriseControlMaturityScore}.`,
  "This module is deterministic, explainable, read-only, compliance-first, and limited to human-reviewed control framework review signals.",
];

const buildTrace = (
  input: EnterpriseControlFrameworkInput,
  breakdown: EnterpriseControlFrameworkScoreBreakdown,
): string[] => [
  "Normalized all direct numeric inputs to a 0-100 deterministic scoring range.",
  "Used only optional read-only upstream intelligence profiles as fallback signals when direct control-framework inputs were absent.",
  "Treated every control dimension as higher-is-better maturity; no control, approval, escalation, governance, communication, recovery, or continuity action is executed or automated.",
  `Computed overallControlFrameworkScore=${breakdown.overallScore} with dataQualityScore=${typeof input.dataQualityScore === "number" ? normalizeCorridorScore(input.dataQualityScore) : "not provided"}.`,
  "No outreach, SMS, email, Twilio, database writes, schema changes, automation execution, control execution, approval automation, escalation automation, market prediction, protected-class logic, demographic targeting, or financial/legal/HR advice was generated.",
];

const buildAssumptions = (input: EnterpriseControlFrameworkInput, missingData: string[]): string[] =>
  unique([
    ...(input.assumptions ?? []),
    "All control-framework inputs are deterministic structured signals supplied by human-reviewed systems.",
    "No live market, banking, financial, demographic, protected-class, or scraped data is used.",
    "Control framework scores represent review flags only and do not trigger autonomous actions, approval automation, escalation automation, mitigation, governance automation, outreach, or execution.",
    ...(missingData.length > 0
      ? ["Some control framework dimensions were inferred from available read-only profile fallbacks or neutral deterministic defaults."]
      : []),
  ]);

export function analyzeEnterpriseControlFrameworkIntelligence(
  input: EnterpriseControlFrameworkInput = {},
): EnterpriseControlFrameworkResult {
  const scoreBreakdown = buildScoreBreakdown(input);
  const missingData = getMissingData(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const controlFrameworkLevel = classifyControlFramework(scoreBreakdown);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallControlFrameworkScore: scoreBreakdown.overallScore,
    controlFrameworkLevel,
    governanceControlScore: scoreBreakdown.governanceControlScore,
    operationalControlScore: scoreBreakdown.operationalControlScore,
    decisionControlScore: scoreBreakdown.decisionControlScore,
    escalationControlScore: scoreBreakdown.escalationControlScore,
    communicationControlScore: scoreBreakdown.communicationControlScore,
    recoveryControlScore: scoreBreakdown.recoveryControlScore,
    continuityControlScore: scoreBreakdown.continuityControlScore,
    safeguardControlScore: scoreBreakdown.safeguardControlScore,
    longHorizonControlScore: scoreBreakdown.longHorizonControlScore,
    enterpriseControlMaturityScore: scoreBreakdown.enterpriseControlMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    controlWarnings: warnings.map((warning) => warning.message),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input),
    explanation: buildExplanation(scoreBreakdown, controlFrameworkLevel),
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
      controlExecution: false,
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

export const getEnterpriseControlFrameworkIntelligence =
  analyzeEnterpriseControlFrameworkIntelligence;
