import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import {
  calculateCorridorConfidence,
  createCorridorWarning,
  normalizeCorridorScore,
} from "./corridor-intelligence-utils";

export type ComplianceReadinessLevel = "weak" | "exposed" | "developing" | "review_ready" | "institutional_grade";

export type EnterpriseComplianceReadinessInput = {
  governanceComplianceScore?: number;
  communicationComplianceScore?: number;
  outreachSafeguardScore?: number;
  dataHandlingReadinessScore?: number;
  documentationReadinessScore?: number;
  approvalControlScore?: number;
  auditTrailReadinessScore?: number;
  reputationProtectionScore?: number;
  escalationReviewScore?: number;
  enterpriseComplianceMaturityScore?: number;
  enterpriseInternalControlsProfile?: unknown;
  enterpriseControlFrameworkProfile?: unknown;
  enterpriseInstitutionalSafeguardsProfile?: unknown;
  enterpriseContinuityGovernanceProfile?: unknown;
  enterpriseDecisionRightsProfile?: unknown;
  enterpriseDecisionAuditProfile?: unknown;
  enterpriseAccountabilityProfile?: unknown;
  enterpriseOperatingRhythmProfile?: unknown;
  operationalPlaybookProfile?: unknown;
  operationalQaProcessDriftProfile?: unknown;
  institutionalKnowledgeTransferProfile?: unknown;
  enterpriseInstitutionalLearningProfile?: unknown;
  institutionalRelationshipProfile?: unknown;
  enterpriseStrategicDoctrineProfile?: unknown;
  enterpriseStrategicReviewProfile?: unknown;
  enterpriseRiskProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseComplianceReadinessScoreBreakdown = CorridorScoreBreakdown & {
  overallScore: number;
  governanceComplianceScore: number;
  communicationComplianceScore: number;
  outreachSafeguardScore: number;
  dataHandlingReadinessScore: number;
  documentationReadinessScore: number;
  approvalControlScore: number;
  auditTrailReadinessScore: number;
  reputationProtectionScore: number;
  escalationReviewScore: number;
  enterpriseComplianceMaturityScore: number;
};

export type EnterpriseComplianceReadinessResult = {
  overallComplianceReadinessScore: number;
  complianceReadinessLevel: ComplianceReadinessLevel;
  governanceComplianceScore: number;
  communicationComplianceScore: number;
  outreachSafeguardScore: number;
  dataHandlingReadinessScore: number;
  documentationReadinessScore: number;
  approvalControlScore: number;
  auditTrailReadinessScore: number;
  reputationProtectionScore: number;
  escalationReviewScore: number;
  enterpriseComplianceMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseComplianceReadinessScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  complianceWarnings: string[];
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
    complianceAutomation: false;
    legalDetermination: false;
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
  "governanceComplianceScore",
  "communicationComplianceScore",
  "outreachSafeguardScore",
  "dataHandlingReadinessScore",
  "documentationReadinessScore",
  "approvalControlScore",
  "auditTrailReadinessScore",
  "reputationProtectionScore",
  "escalationReviewScore",
  "enterpriseComplianceMaturityScore",
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
  input: EnterpriseComplianceReadinessInput,
  key: keyof EnterpriseComplianceReadinessInput,
  fallback: number,
): number => {
  const value = input[key];
  return typeof value === "number" && Number.isFinite(value)
    ? normalizeCorridorScore(value)
    : normalizeCorridorScore(fallback);
};

const hasFallbackForInput = (
  input: EnterpriseComplianceReadinessInput,
  key: (typeof REQUIRED_INPUTS)[number],
): boolean => {
  switch (key) {
    case "governanceComplianceScore":
      return (
        hasProfileScore(input.enterpriseInternalControlsProfile, ["governanceControlsScore"]) ||
        hasProfileScore(input.enterpriseControlFrameworkProfile, ["governanceControlScore"]) ||
        hasProfileScore(input.enterpriseContinuityGovernanceProfile, ["reviewGovernanceScore"])
      );
    case "communicationComplianceScore":
      return (
        hasProfileScore(input.enterpriseInternalControlsProfile, ["communicationControlsScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["communicationSafeguardScore"]) ||
        hasProfileScore(input.operationalQaProcessDriftProfile, ["communicationConsistencyScore"])
      );
    case "outreachSafeguardScore":
      return (
        hasProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["communicationSafeguardScore"]) ||
        hasProfileScore(input.enterpriseInternalControlsProfile, ["communicationControlsScore"]) ||
        hasProfileScore(input.institutionalRelationshipProfile, ["communicationStability", "institutionalTrustReadiness"])
      );
    case "dataHandlingReadinessScore":
      return (
        hasProfileScore(input.institutionalKnowledgeTransferProfile, ["accessKnowledgeRiskScore", "continuityHandoffScore"]) ||
        hasProfileScore(input.enterpriseInternalControlsProfile, ["safeguardEnforcementScore"]) ||
        hasProfileScore(input.enterpriseRiskProfile, ["institutionalStabilityDurability"])
      );
    case "documentationReadinessScore":
      return (
        hasProfileScore(input.operationalPlaybookProfile, ["updateDisciplineScore", "roleClarityScore"]) ||
        hasProfileScore(input.operationalQaProcessDriftProfile, ["documentationConsistencyScore"]) ||
        hasProfileScore(input.institutionalKnowledgeTransferProfile, ["sopCoverageScore", "decisionHistoryPreservationScore"])
      );
    case "approvalControlScore":
      return (
        hasProfileScore(input.enterpriseDecisionRightsProfile, ["approvalRightsScore", "overrideDisciplineScore"]) ||
        hasProfileScore(input.enterpriseControlFrameworkProfile, ["decisionControlScore"]) ||
        hasProfileScore(input.enterpriseInternalControlsProfile, ["governanceControlsScore"])
      );
    case "auditTrailReadinessScore":
      return (
        hasProfileScore(input.enterpriseDecisionAuditProfile, ["traceabilityScore", "decisionAuditMaturityScore"]) ||
        hasProfileScore(input.enterpriseInternalControlsProfile, ["enterpriseInternalControlsMaturityScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalLearningProfile, ["recommendationAccuracyReviewScore"])
      );
    case "reputationProtectionScore":
      return (
        hasProfileScore(input.institutionalRelationshipProfile, ["institutionalTrustReadiness", "communicationStability"]) ||
        hasProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["strategicSafeguardScore", "communicationSafeguardScore"]) ||
        hasProfileScore(input.enterpriseStrategicDoctrineProfile, ["brandTrustDoctrineScore"])
      );
    case "escalationReviewScore":
      return (
        hasProfileScore(input.enterpriseInternalControlsProfile, ["escalationControlsScore"]) ||
        hasProfileScore(input.enterpriseDecisionRightsProfile, ["escalationAuthorityScore"]) ||
        hasProfileScore(input.enterpriseAccountabilityProfile, ["escalationClarityScore"])
      );
    case "enterpriseComplianceMaturityScore":
      return (
        hasProfileScore(input.enterpriseInternalControlsProfile, ["enterpriseInternalControlsMaturityScore"]) ||
        hasProfileScore(input.enterpriseControlFrameworkProfile, ["enterpriseControlMaturityScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["enterpriseSafeguardMaturityScore"])
      );
  }
};

const getMissingData = (input: EnterpriseComplianceReadinessInput): string[] =>
  REQUIRED_INPUTS.filter((key) => typeof input[key] !== "number" && !hasFallbackForInput(input, key));

const invertRiskScore = (score: number): number => normalizeCorridorScore(100 - normalizeCorridorScore(score));

const buildScoreBreakdown = (
  input: EnterpriseComplianceReadinessInput,
): EnterpriseComplianceReadinessScoreBreakdown => {
  const governanceComplianceScore = getScore(
    input,
    "governanceComplianceScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseInternalControlsProfile, ["governanceControlsScore"]), 0.2],
      [extractProfileScore(input.enterpriseControlFrameworkProfile, ["governanceControlScore"]), 0.18],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["reviewGovernanceScore"]), 0.16],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["governanceAuthorityScore"]), 0.14],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["governanceAccountabilityScore"]), 0.12],
      [extractProfileScore(input.enterpriseStrategicReviewProfile, ["governanceReviewScore"]), 0.1],
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["governanceSafeguardScore"]), 0.1],
    ]),
  );

  const communicationComplianceScore = getScore(
    input,
    "communicationComplianceScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseInternalControlsProfile, ["communicationControlsScore"]), 0.2],
      [extractProfileScore(input.enterpriseControlFrameworkProfile, ["communicationControlScore"]), 0.16],
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["communicationSafeguardScore"]), 0.16],
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["communicationConsistencyScore"]), 0.14],
      [extractProfileScore(input.institutionalRelationshipProfile, ["communicationStability"]), 0.12],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["escalationClarityScore"]), 0.1],
      [governanceComplianceScore, 0.12],
    ]),
  );

  const outreachSafeguardScore = getScore(
    input,
    "outreachSafeguardScore",
    weightedAverage([
      [communicationComplianceScore, 0.2],
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["communicationSafeguardScore"]), 0.18],
      [extractProfileScore(input.enterpriseInternalControlsProfile, ["communicationControlsScore"]), 0.16],
      [extractProfileScore(input.institutionalRelationshipProfile, ["institutionalTrustReadiness"]), 0.14],
      [extractProfileScore(input.institutionalRelationshipProfile, ["communicationStability"]), 0.12],
      [extractProfileScore(input.enterpriseStrategicDoctrineProfile, ["brandTrustDoctrineScore"]), 0.1],
      [governanceComplianceScore, 0.1],
    ]),
  );

  const dataHandlingReadinessScore = getScore(
    input,
    "dataHandlingReadinessScore",
    weightedAverage([
      [extractProfileScore(input.institutionalKnowledgeTransferProfile, ["continuityHandoffScore"]), 0.18],
      [invertRiskScore(extractProfileScore(input.institutionalKnowledgeTransferProfile, ["accessKnowledgeRiskScore"], 48)), 0.18],
      [extractProfileScore(input.enterpriseInternalControlsProfile, ["safeguardEnforcementScore"]), 0.16],
      [extractProfileScore(input.enterpriseRiskProfile, ["institutionalStabilityDurability"]), 0.14],
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["enterpriseSafeguardMaturityScore"]), 0.12],
      [extractProfileScore(input.operationalPlaybookProfile, ["roleClarityScore"]), 0.1],
      [governanceComplianceScore, 0.12],
    ]),
  );

  const documentationReadinessScore = getScore(
    input,
    "documentationReadinessScore",
    weightedAverage([
      [extractProfileScore(input.operationalQaProcessDriftProfile, ["documentationConsistencyScore"]), 0.18],
      [extractProfileScore(input.operationalPlaybookProfile, ["updateDisciplineScore"]), 0.16],
      [extractProfileScore(input.institutionalKnowledgeTransferProfile, ["sopCoverageScore"]), 0.16],
      [extractProfileScore(input.institutionalKnowledgeTransferProfile, ["decisionHistoryPreservationScore"]), 0.14],
      [extractProfileScore(input.enterpriseDecisionAuditProfile, ["traceabilityScore"]), 0.14],
      [extractProfileScore(input.enterpriseInstitutionalLearningProfile, ["operationalLessonCaptureScore"]), 0.1],
      [dataHandlingReadinessScore, 0.12],
    ]),
  );

  const approvalControlScore = getScore(
    input,
    "approvalControlScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["approvalRightsScore"]), 0.2],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["overrideDisciplineScore"]), 0.16],
      [extractProfileScore(input.enterpriseControlFrameworkProfile, ["decisionControlScore"]), 0.16],
      [extractProfileScore(input.enterpriseInternalControlsProfile, ["governanceControlsScore"]), 0.14],
      [extractProfileScore(input.enterpriseDecisionAuditProfile, ["approvalConsistencyScore"]), 0.12],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["governanceAccountabilityScore"]), 0.1],
      [governanceComplianceScore, 0.12],
    ]),
  );

  const auditTrailReadinessScore = getScore(
    input,
    "auditTrailReadinessScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseDecisionAuditProfile, ["traceabilityScore"]), 0.2],
      [extractProfileScore(input.enterpriseDecisionAuditProfile, ["decisionAuditMaturityScore"]), 0.18],
      [extractProfileScore(input.enterpriseDecisionAuditProfile, ["reviewDisciplineScore"]), 0.14],
      [extractProfileScore(input.enterpriseInstitutionalLearningProfile, ["recommendationAccuracyReviewScore"]), 0.12],
      [documentationReadinessScore, 0.12],
      [approvalControlScore, 0.12],
      [extractProfileScore(input.enterpriseInternalControlsProfile, ["enterpriseInternalControlsMaturityScore"]), 0.12],
    ]),
  );

  const reputationProtectionScore = getScore(
    input,
    "reputationProtectionScore",
    weightedAverage([
      [extractProfileScore(input.institutionalRelationshipProfile, ["institutionalTrustReadiness"]), 0.18],
      [extractProfileScore(input.institutionalRelationshipProfile, ["communicationStability"]), 0.16],
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["strategicSafeguardScore"]), 0.16],
      [extractProfileScore(input.enterpriseStrategicDoctrineProfile, ["brandTrustDoctrineScore"]), 0.14],
      [communicationComplianceScore, 0.12],
      [outreachSafeguardScore, 0.12],
      [governanceComplianceScore, 0.12],
    ]),
  );

  const escalationReviewScore = getScore(
    input,
    "escalationReviewScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseInternalControlsProfile, ["escalationControlsScore"]), 0.2],
      [extractProfileScore(input.enterpriseControlFrameworkProfile, ["escalationControlScore"]), 0.16],
      [extractProfileScore(input.enterpriseDecisionRightsProfile, ["escalationAuthorityScore"]), 0.16],
      [extractProfileScore(input.enterpriseAccountabilityProfile, ["escalationClarityScore"]), 0.14],
      [extractProfileScore(input.enterpriseContinuityGovernanceProfile, ["escalationGovernanceScore"]), 0.12],
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"]), 0.1],
      [auditTrailReadinessScore, 0.12],
    ]),
  );

  const enterpriseComplianceMaturityScore = getScore(
    input,
    "enterpriseComplianceMaturityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseInternalControlsProfile, ["enterpriseInternalControlsMaturityScore"]), 0.16],
      [extractProfileScore(input.enterpriseControlFrameworkProfile, ["enterpriseControlMaturityScore"]), 0.14],
      [extractProfileScore(input.enterpriseInstitutionalSafeguardsProfile, ["enterpriseSafeguardMaturityScore"]), 0.14],
      [governanceComplianceScore, 0.08],
      [communicationComplianceScore, 0.08],
      [outreachSafeguardScore, 0.08],
      [dataHandlingReadinessScore, 0.08],
      [documentationReadinessScore, 0.08],
      [approvalControlScore, 0.08],
      [auditTrailReadinessScore, 0.08],
      [reputationProtectionScore, 0.04],
      [escalationReviewScore, 0.04],
    ]),
  );

  const overallScore = weightedAverage([
    [governanceComplianceScore, 0.12],
    [communicationComplianceScore, 0.1],
    [outreachSafeguardScore, 0.1],
    [dataHandlingReadinessScore, 0.1],
    [documentationReadinessScore, 0.11],
    [approvalControlScore, 0.11],
    [auditTrailReadinessScore, 0.11],
    [reputationProtectionScore, 0.09],
    [escalationReviewScore, 0.09],
    [enterpriseComplianceMaturityScore, 0.07],
  ]);

  return {
    connectivityScore: communicationComplianceScore,
    durabilityScore: overallScore,
    expansionScore: outreachSafeguardScore,
    institutionalScore: enterpriseComplianceMaturityScore,
    logisticsScore: governanceComplianceScore,
    luxuryScore: reputationProtectionScore,
    developmentScore: auditTrailReadinessScore,
    overallScore,
    governanceComplianceScore,
    communicationComplianceScore,
    outreachSafeguardScore,
    dataHandlingReadinessScore,
    documentationReadinessScore,
    approvalControlScore,
    auditTrailReadinessScore,
    reputationProtectionScore,
    escalationReviewScore,
    enterpriseComplianceMaturityScore,
  };
};

const classifyComplianceReadiness = (
  breakdown: EnterpriseComplianceReadinessScoreBreakdown,
): ComplianceReadinessLevel => {
  const coreMinimum = Math.min(
    breakdown.governanceComplianceScore,
    breakdown.communicationComplianceScore,
    breakdown.outreachSafeguardScore,
    breakdown.dataHandlingReadinessScore,
    breakdown.auditTrailReadinessScore,
  );

  if (breakdown.overallScore >= 82 && coreMinimum >= 72 && breakdown.enterpriseComplianceMaturityScore >= 76) {
    return "institutional_grade";
  }
  if (breakdown.overallScore >= 68 && coreMinimum >= 58) return "review_ready";
  if (breakdown.overallScore >= 54) return "developing";
  if (breakdown.overallScore >= 40) return "exposed";
  return "weak";
};

const buildWarnings = (
  breakdown: EnterpriseComplianceReadinessScoreBreakdown,
  missingData: string[],
): CorridorWarning[] => [
  ...(missingData.length > 0
    ? [
        createCorridorWarning({
          code: "COMPLIANCE_READINESS_DATA_INCOMPLETE",
          severity: missingData.length >= 5 ? "high" : "medium",
          message: "Enterprise compliance readiness assessment is using incomplete structured inputs and requires human verification.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.overallScore < 42
    ? [
        createCorridorWarning({
          code: "COMPLIANCE_READINESS_WEAK",
          severity: "high",
          message: "Enterprise compliance readiness is weak under current structured inputs; this is not legal advice.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.outreachSafeguardScore < 45
    ? [
        createCorridorWarning({
          code: "OUTREACH_SAFEGUARDS_WEAK",
          severity: "medium",
          message: "Outreach safeguard readiness is weak; this module does not send messages or modify outreach systems.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.dataHandlingReadinessScore < 45
    ? [
        createCorridorWarning({
          code: "DATA_HANDLING_READINESS_WEAK",
          severity: "medium",
          message: "Data handling readiness is weak and requires human operational review.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
  ...(breakdown.auditTrailReadinessScore < 45
    ? [
        createCorridorWarning({
          code: "AUDIT_TRAIL_READINESS_WEAK",
          severity: "medium",
          message: "Audit trail readiness is weak and requires human review; no legal determination is made.",
          category: "institutional",
          requiresHumanReview: true,
        }),
      ]
    : []),
];

const buildKeyRisks = (breakdown: EnterpriseComplianceReadinessScoreBreakdown): string[] =>
  unique([
    ...(breakdown.governanceComplianceScore < 55 ? ["Governance compliance readiness may be underdeveloped."] : []),
    ...(breakdown.communicationComplianceScore < 55 ? ["Communication compliance readiness may be inconsistent."] : []),
    ...(breakdown.outreachSafeguardScore < 55 ? ["Outreach safeguards may be too thin for review discipline."] : []),
    ...(breakdown.dataHandlingReadinessScore < 55 ? ["Data handling readiness may be underdeveloped."] : []),
    ...(breakdown.documentationReadinessScore < 55 ? ["Documentation readiness may be weak."] : []),
    ...(breakdown.approvalControlScore < 55 ? ["Approval control readiness may be unclear."] : []),
    ...(breakdown.auditTrailReadinessScore < 55 ? ["Audit trail readiness may be weak."] : []),
    ...(breakdown.reputationProtectionScore < 55 ? ["Reputation protection readiness may be underdeveloped."] : []),
    ...(breakdown.escalationReviewScore < 55 ? ["Escalation review readiness may be weak."] : []),
  ]);

const buildStrengths = (breakdown: EnterpriseComplianceReadinessScoreBreakdown): string[] =>
  unique([
    ...(breakdown.governanceComplianceScore >= 72 ? ["Governance compliance readiness appears mature."] : []),
    ...(breakdown.communicationComplianceScore >= 72 ? ["Communication compliance readiness appears stable."] : []),
    ...(breakdown.outreachSafeguardScore >= 72 ? ["Outreach safeguards appear review-ready without automation."] : []),
    ...(breakdown.dataHandlingReadinessScore >= 72 ? ["Data handling readiness appears durable."] : []),
    ...(breakdown.documentationReadinessScore >= 72 ? ["Documentation readiness appears strong."] : []),
    ...(breakdown.approvalControlScore >= 72 ? ["Approval controls appear review-ready without approval automation."] : []),
    ...(breakdown.auditTrailReadinessScore >= 72 ? ["Audit trail readiness appears mature."] : []),
    ...(breakdown.reputationProtectionScore >= 72 ? ["Reputation protection readiness appears durable."] : []),
    ...(breakdown.escalationReviewScore >= 72 ? ["Escalation review readiness appears mature."] : []),
    ...(breakdown.enterpriseComplianceMaturityScore >= 72
      ? ["Enterprise compliance maturity appears institutionally reviewable."]
      : []),
  ]);

const buildRecommendations = (breakdown: EnterpriseComplianceReadinessScoreBreakdown): string[] =>
  unique([
    ...(breakdown.governanceComplianceScore < 65
      ? ["Review governance compliance readiness, evidence quality, and review cadence with qualified human oversight."]
      : []),
    ...(breakdown.communicationComplianceScore < 65
      ? ["Review communication compliance readiness without sending messages or changing outreach systems."]
      : []),
    ...(breakdown.outreachSafeguardScore < 65
      ? ["Review outreach safeguards, consent checks, and do-not-contact awareness without automating outreach or legal determinations."]
      : []),
    ...(breakdown.dataHandlingReadinessScore < 65
      ? ["Review data handling readiness and access discipline without changing schema, persistence, or data systems."]
      : []),
    ...(breakdown.documentationReadinessScore < 65
      ? ["Review documentation readiness, decision history, and SOP evidence through human operational review."]
      : []),
    ...(breakdown.approvalControlScore < 65
      ? ["Review approval controls without creating approval automation, autonomous execution, or management decisions."]
      : []),
    ...(breakdown.auditTrailReadinessScore < 65
      ? ["Review audit trail readiness and traceability without making legal or compliance determinations."]
      : []),
    ...(breakdown.reputationProtectionScore < 65
      ? ["Review reputation protection readiness and brand/trust standards without relationship manipulation or outreach automation."]
      : []),
    ...(breakdown.escalationReviewScore < 65
      ? ["Review escalation review readiness without automating escalation or management decisions."]
      : []),
    "Use this module as read-only compliance readiness intelligence for human review, not as legal advice, compliance certification, enforcement, outreach automation, or execution.",
  ]);

const buildReusableInfrastructureNotes = (input: EnterpriseComplianceReadinessInput): string[] =>
  unique([
    "Reuses corridor scoring utilities for normalization, warnings, and confidence.",
    "Designed as a pure TypeScript module with deterministic structured inputs and explainable outputs.",
    ...(input.enterpriseInternalControlsProfile
      ? ["Can consume internal controls intelligence as read-only compliance readiness context."]
      : []),
    ...(input.enterpriseDecisionAuditProfile
      ? ["Can consume decision audit intelligence as read-only audit trail context."]
      : []),
    ...(input.enterpriseInstitutionalSafeguardsProfile
      ? ["Can consume institutional safeguards intelligence as read-only outreach and reputation safeguard context."]
      : []),
    ...(input.institutionalKnowledgeTransferProfile
      ? ["Can consume knowledge transfer intelligence as read-only documentation and data-handling context."]
      : []),
    ...(input.institutionalRelationshipProfile
      ? ["Can consume institutional relationship intelligence as read-only trust and communication context."]
      : []),
  ]);

const buildExplanation = (
  breakdown: EnterpriseComplianceReadinessScoreBreakdown,
  complianceReadinessLevel: ComplianceReadinessLevel,
): string[] => [
  `Overall compliance readiness score is ${breakdown.overallScore}, classified as ${complianceReadinessLevel}.`,
  `Readiness dimensions include governance ${breakdown.governanceComplianceScore}, communication ${breakdown.communicationComplianceScore}, outreach safeguards ${breakdown.outreachSafeguardScore}, data handling ${breakdown.dataHandlingReadinessScore}, and documentation ${breakdown.documentationReadinessScore}.`,
  `Review-control dimensions include approval controls ${breakdown.approvalControlScore}, audit trails ${breakdown.auditTrailReadinessScore}, reputation protection ${breakdown.reputationProtectionScore}, and escalation review ${breakdown.escalationReviewScore}.`,
  `Enterprise compliance maturity is ${breakdown.enterpriseComplianceMaturityScore}.`,
  "This module is deterministic, explainable, read-only, compliance-first, and limited to human-reviewed compliance-readiness review signals.",
];

const buildTrace = (
  input: EnterpriseComplianceReadinessInput,
  breakdown: EnterpriseComplianceReadinessScoreBreakdown,
): string[] => [
  "Normalized all direct numeric inputs to a 0-100 deterministic scoring range.",
  "Used only optional read-only upstream intelligence profiles as fallback signals when direct compliance-readiness inputs were absent.",
  "Treated every compliance-readiness dimension as higher-is-better maturity; no legal determination, compliance certification, outreach, approval, escalation, governance, or data action is executed or automated.",
  `Computed overallComplianceReadinessScore=${breakdown.overallScore} with dataQualityScore=${typeof input.dataQualityScore === "number" ? normalizeCorridorScore(input.dataQualityScore) : "not provided"}.`,
  "No outreach, SMS, email, Twilio, database writes, schema changes, automation execution, compliance automation, legal advice, market prediction, protected-class logic, demographic targeting, or financial/HR/tax advice was generated.",
];

const buildAssumptions = (input: EnterpriseComplianceReadinessInput, missingData: string[]): string[] =>
  unique([
    ...(input.assumptions ?? []),
    "All compliance-readiness inputs are deterministic structured signals supplied by human-reviewed systems.",
    "No live market, banking, financial, demographic, protected-class, or scraped data is used.",
    "Compliance readiness scores represent review flags only and do not certify compliance, provide legal advice, automate outreach, or trigger execution.",
    ...(missingData.length > 0
      ? ["Some compliance-readiness dimensions were inferred from available read-only profile fallbacks or neutral deterministic defaults."]
      : []),
  ]);

export function analyzeEnterpriseComplianceReadinessIntelligence(
  input: EnterpriseComplianceReadinessInput = {},
): EnterpriseComplianceReadinessResult {
  const scoreBreakdown = buildScoreBreakdown(input);
  const missingData = getMissingData(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const complianceReadinessLevel = classifyComplianceReadiness(scoreBreakdown);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallComplianceReadinessScore: scoreBreakdown.overallScore,
    complianceReadinessLevel,
    governanceComplianceScore: scoreBreakdown.governanceComplianceScore,
    communicationComplianceScore: scoreBreakdown.communicationComplianceScore,
    outreachSafeguardScore: scoreBreakdown.outreachSafeguardScore,
    dataHandlingReadinessScore: scoreBreakdown.dataHandlingReadinessScore,
    documentationReadinessScore: scoreBreakdown.documentationReadinessScore,
    approvalControlScore: scoreBreakdown.approvalControlScore,
    auditTrailReadinessScore: scoreBreakdown.auditTrailReadinessScore,
    reputationProtectionScore: scoreBreakdown.reputationProtectionScore,
    escalationReviewScore: scoreBreakdown.escalationReviewScore,
    enterpriseComplianceMaturityScore: scoreBreakdown.enterpriseComplianceMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    complianceWarnings: warnings.map((warning) => warning.message),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input),
    explanation: buildExplanation(scoreBreakdown, complianceReadinessLevel),
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
      complianceAutomation: false,
      legalDetermination: false,
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

export const getEnterpriseComplianceReadinessIntelligence =
  analyzeEnterpriseComplianceReadinessIntelligence;
