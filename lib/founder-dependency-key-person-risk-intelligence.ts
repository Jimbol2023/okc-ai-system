import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type KeyPersonRiskLevel = "low" | "moderate" | "elevated" | "high" | "critical";

export type FounderDependencyKeyPersonRiskInput = {
  founderDependencyScore?: number;
  decisionConcentrationScore?: number;
  relationshipConcentrationScore?: number;
  vendorContactDependencyScore?: number;
  knowledgeConcentrationScore?: number;
  accessControlConcentrationScore?: number;
  operationalContinuityRiskScore?: number;
  backupLeadershipReadinessScore?: number;
  documentationReadinessScore?: number;
  delegationReadinessScore?: number;
  legacyContinuityProfile?: unknown;
  enterpriseRiskProfile?: unknown;
  institutionalRelationshipProfile?: unknown;
  familyOfficeGovernanceProfile?: unknown;
  enterpriseExpansionGovernanceProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type FounderDependencyKeyPersonRiskScoreBreakdown = CorridorScoreBreakdown & {
  overallKeyPersonRiskScore: number;
  continuityReadinessScore: number;
  founderDependencyScore: number;
  decisionConcentrationScore: number;
  relationshipConcentrationScore: number;
  vendorContactDependencyRiskScore: number;
  knowledgeConcentrationScore: number;
  accessControlConcentrationScore: number;
  operationalContinuityRiskScore: number;
  backupLeadershipReadinessScore: number;
  documentationReadinessScore: number;
  delegationReadinessScore: number;
};

export type FounderDependencyKeyPersonRiskResult = {
  overallKeyPersonRiskScore: number;
  riskLevel: KeyPersonRiskLevel;
  continuityReadinessScore: number;
  founderDependencyScore: number;
  decisionConcentrationScore: number;
  relationshipConcentrationScore: number;
  knowledgeConcentrationScore: number;
  accessControlConcentrationScore: number;
  backupLeadershipReadinessScore: number;
  documentationReadinessScore: number;
  delegationReadinessScore: number;
  confidenceScore: number;
  scoreBreakdown: FounderDependencyKeyPersonRiskScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  explanation: string[];
  trace: string[];
  warnings: CorridorWarning[];
  missingData: string[];
  assumptions: string[];
  safety: {
    readOnly: true;
    outreachAuthorized: false;
    smsAuthorized: false;
    emailAuthorized: false;
    twilioUsed: false;
    executionAuthorized: false;
    databaseWriteAuthorized: false;
    schemaMutationUsed: false;
    autonomousMitigationAuthorized: false;
    legalAdvice: false;
    hrAdvice: false;
    employmentAdvice: false;
    taxAdvice: false;
    estatePlanningAdvice: false;
    trustAdvice: false;
    ownershipRestructuringAdvice: false;
    investmentAdvice: false;
    portfolioManagementAdvice: false;
    demographicTargetingUsed: false;
    protectedClassLogicUsed: false;
    externalDataUsed: false;
    scrapingUsed: false;
    marketPrediction: false;
  };
  readOnly: true;
};

const REQUIRED_INPUTS: Array<keyof FounderDependencyKeyPersonRiskInput> = [
  "founderDependencyScore",
  "decisionConcentrationScore",
  "relationshipConcentrationScore",
  "vendorContactDependencyScore",
  "knowledgeConcentrationScore",
  "accessControlConcentrationScore",
  "operationalContinuityRiskScore",
  "backupLeadershipReadinessScore",
  "documentationReadinessScore",
  "delegationReadinessScore",
];

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function weightedAverage(values: Array<[number, number]>) {
  const totalWeight = values.reduce((total, [, weight]) => total + weight, 0);

  if (totalWeight <= 0) return 0;

  return normalizeCorridorScore(values.reduce((total, [value, weight]) => total + normalizeCorridorScore(value) * weight, 0) / totalWeight);
}

function getScore(value: number | undefined, fallback: number) {
  return normalizeCorridorScore(value, fallback);
}

function getPath(source: unknown, path: string) {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object" || Array.isArray(current)) return undefined;

    return (current as Record<string, unknown>)[key];
  }, source);
}

function extractProfileScore(profile: unknown, paths: string[], fallback: number) {
  for (const path of paths) {
    const value = getPath(profile, path);

    if (typeof value === "number" && Number.isFinite(value)) return normalizeCorridorScore(value);
  }

  return fallback;
}

function hasProfileScore(profile: unknown, paths: string[]) {
  return paths.some((path) => {
    const value = getPath(profile, path);

    return typeof value === "number" && Number.isFinite(value);
  });
}

function hasFallbackForInput(input: FounderDependencyKeyPersonRiskInput, key: keyof FounderDependencyKeyPersonRiskInput) {
  const legacyProfile = input.legacyContinuityProfile;
  const riskProfile = input.enterpriseRiskProfile;
  const relationshipProfile = input.institutionalRelationshipProfile;
  const familyGovernanceProfile = input.familyOfficeGovernanceProfile;
  const expansionGovernanceProfile = input.enterpriseExpansionGovernanceProfile;

  const fallbackPaths: Partial<Record<keyof FounderDependencyKeyPersonRiskInput, boolean>> = {
    founderDependencyScore:
      hasProfileScore(legacyProfile, ["leadershipDependencyRisk", "scoreBreakdown.founderOperatorDependencyRiskScore"]) ||
      hasProfileScore(riskProfile, ["governanceFragilityExposure", "dependencyConcentrationRisk"]),
    decisionConcentrationScore:
      hasProfileScore(familyGovernanceProfile, ["decisionAccountability", "humanReviewGovernanceAlignment"]) ||
      hasProfileScore(expansionGovernanceProfile, ["strategicAccountabilityDiscipline", "crossMarketOperationalAccountability"]),
    relationshipConcentrationScore:
      hasProfileScore(relationshipProfile, ["relationshipConcentrationRisk", "dependencyRisk"]) ||
      hasProfileScore(riskProfile, ["dependencyConcentrationRisk"]),
    vendorContactDependencyScore:
      hasProfileScore(relationshipProfile, ["operationalRelationshipResilience", "partnerReliability"]) ||
      hasProfileScore(riskProfile, ["operationalRiskExposure", "dependencyConcentrationRisk"]),
    knowledgeConcentrationScore:
      hasProfileScore(legacyProfile, ["institutionalMemoryScore", "scoreBreakdown.institutionalMemoryPreservationScore"]) ||
      hasProfileScore(familyGovernanceProfile, ["governanceDocumentationReadiness"]),
    accessControlConcentrationScore:
      hasProfileScore(familyGovernanceProfile, ["humanReviewGovernanceAlignment", "decisionAccountability"]) ||
      hasProfileScore(expansionGovernanceProfile, ["approvalProcessDurability", "humanReviewGovernanceAlignment"]),
    operationalContinuityRiskScore:
      hasProfileScore(riskProfile, ["operationalRiskExposure", "operationalContinuityResilience"]) ||
      hasProfileScore(legacyProfile, ["overallContinuityScore", "continuityGrade"]),
    backupLeadershipReadinessScore:
      hasProfileScore(legacyProfile, ["successionReadiness", "scoreBreakdown.successionReadinessScore"]) ||
      hasProfileScore(familyGovernanceProfile, ["successionReadinessProxy"]),
    documentationReadinessScore:
      hasProfileScore(familyGovernanceProfile, ["governanceDocumentationReadiness"]) ||
      hasProfileScore(legacyProfile, ["institutionalMemoryScore"]),
    delegationReadinessScore:
      hasProfileScore(familyGovernanceProfile, ["multiEntityCoordinationReadiness", "operatingDiscipline"]) ||
      hasProfileScore(expansionGovernanceProfile, ["crossMarketOperationalAccountability", "operationalGovernanceResilience"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: FounderDependencyKeyPersonRiskInput) {
  const labels: Record<keyof FounderDependencyKeyPersonRiskInput, string> = {
    founderDependencyScore: "founder dependency score",
    decisionConcentrationScore: "decision concentration score",
    relationshipConcentrationScore: "relationship concentration score",
    vendorContactDependencyScore: "vendor/contact dependency score",
    knowledgeConcentrationScore: "knowledge concentration score",
    accessControlConcentrationScore: "access/control concentration score",
    operationalContinuityRiskScore: "operational continuity risk score",
    backupLeadershipReadinessScore: "backup leadership readiness score",
    documentationReadinessScore: "documentation readiness score",
    delegationReadinessScore: "delegation readiness score",
    legacyContinuityProfile: "legacy continuity profile",
    enterpriseRiskProfile: "enterprise risk profile",
    institutionalRelationshipProfile: "institutional relationship profile",
    familyOfficeGovernanceProfile: "family office governance profile",
    enterpriseExpansionGovernanceProfile: "enterprise expansion governance profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: FounderDependencyKeyPersonRiskInput): FounderDependencyKeyPersonRiskScoreBreakdown {
  const legacyProfile = input.legacyContinuityProfile;
  const riskProfile = input.enterpriseRiskProfile;
  const relationshipProfile = input.institutionalRelationshipProfile;
  const familyGovernanceProfile = input.familyOfficeGovernanceProfile;
  const expansionGovernanceProfile = input.enterpriseExpansionGovernanceProfile;
  const documentationReadinessScore = getScore(
    input.documentationReadinessScore,
    weightedAverage([
      [extractProfileScore(familyGovernanceProfile, ["governanceDocumentationReadiness", "scoreBreakdown.governanceDocumentationReadinessScore"], 54), 0.34],
      [extractProfileScore(legacyProfile, ["institutionalMemoryScore", "scoreBreakdown.institutionalMemoryPreservationScore"], 54), 0.24],
      [extractProfileScore(relationshipProfile, ["communicationStability", "scoreBreakdown.communicationStabilityScore"], 54), 0.14],
      [extractProfileScore(expansionGovernanceProfile, ["approvalProcessDurability", "scoreBreakdown.approvalProcessDurabilityScore"], 54), 0.14],
      [extractProfileScore(familyGovernanceProfile, ["humanReviewGovernanceAlignment"], 54), 0.14],
    ]),
  );
  const backupLeadershipReadinessScore = getScore(
    input.backupLeadershipReadinessScore,
    weightedAverage([
      [extractProfileScore(legacyProfile, ["successionReadiness", "scoreBreakdown.successionReadinessScore"], 54), 0.3],
      [extractProfileScore(familyGovernanceProfile, ["successionReadinessProxy", "scoreBreakdown.successionReadinessProxyScore"], 54), 0.24],
      [extractProfileScore(familyGovernanceProfile, ["multiEntityCoordinationReadiness", "scoreBreakdown.multiEntityCoordinationReadinessScore"], 54), 0.16],
      [documentationReadinessScore, 0.16],
      [extractProfileScore(relationshipProfile, ["institutionalTrustReadiness", "continuityStrength"], 54), 0.14],
    ]),
  );
  const delegationReadinessScore = getScore(
    input.delegationReadinessScore,
    weightedAverage([
      [extractProfileScore(familyGovernanceProfile, ["multiEntityCoordinationReadiness", "scoreBreakdown.multiEntityCoordinationReadinessScore"], 54), 0.24],
      [extractProfileScore(familyGovernanceProfile, ["operatingDiscipline", "scoreBreakdown.operatingDisciplineScore"], 54), 0.2],
      [extractProfileScore(expansionGovernanceProfile, ["crossMarketOperationalAccountability", "scoreBreakdown.crossMarketOperationalAccountabilityScore"], 54), 0.18],
      [extractProfileScore(expansionGovernanceProfile, ["operationalGovernanceResilience", "scoreBreakdown.operationalGovernanceResilienceScore"], 54), 0.14],
      [backupLeadershipReadinessScore, 0.12],
      [documentationReadinessScore, 0.12],
    ]),
  );
  const decisionConcentrationScore = getScore(
    input.decisionConcentrationScore,
    weightedAverage([
      [100 - extractProfileScore(familyGovernanceProfile, ["decisionAccountability", "scoreBreakdown.decisionAccountabilityScore"], 54), 0.22],
      [100 - extractProfileScore(familyGovernanceProfile, ["humanReviewGovernanceAlignment", "scoreBreakdown.humanReviewGovernanceAlignmentScore"], 54), 0.2],
      [100 - extractProfileScore(expansionGovernanceProfile, ["strategicAccountabilityDiscipline", "scoreBreakdown.strategicAccountabilityDisciplineScore"], 54), 0.18],
      [100 - delegationReadinessScore, 0.16],
      [100 - backupLeadershipReadinessScore, 0.14],
      [extractProfileScore(riskProfile, ["governanceFragilityExposure", "scoreBreakdown.governanceFragilityExposureScore"], 48), 0.1],
    ]),
  );
  const knowledgeConcentrationScore = getScore(
    input.knowledgeConcentrationScore,
    weightedAverage([
      [100 - documentationReadinessScore, 0.34],
      [100 - extractProfileScore(legacyProfile, ["institutionalMemoryScore", "scoreBreakdown.institutionalMemoryPreservationScore"], 54), 0.22],
      [100 - extractProfileScore(familyGovernanceProfile, ["longHorizonStewardshipDurability", "scoreBreakdown.longHorizonStewardshipDurabilityScore"], 54), 0.14],
      [100 - delegationReadinessScore, 0.12],
      [100 - backupLeadershipReadinessScore, 0.1],
      [extractProfileScore(riskProfile, ["governanceFragilityExposure"], 48), 0.08],
    ]),
  );
  const accessControlConcentrationScore = getScore(
    input.accessControlConcentrationScore,
    weightedAverage([
      [100 - extractProfileScore(familyGovernanceProfile, ["humanReviewGovernanceAlignment", "scoreBreakdown.humanReviewGovernanceAlignmentScore"], 54), 0.24],
      [100 - extractProfileScore(expansionGovernanceProfile, ["approvalProcessDurability", "scoreBreakdown.approvalProcessDurabilityScore"], 54), 0.22],
      [decisionConcentrationScore, 0.18],
      [100 - delegationReadinessScore, 0.14],
      [100 - backupLeadershipReadinessScore, 0.12],
      [100 - documentationReadinessScore, 0.1],
    ]),
  );
  const relationshipConcentrationScore = getScore(
    input.relationshipConcentrationScore,
    weightedAverage([
      [extractProfileScore(relationshipProfile, ["relationshipConcentrationRisk", "scoreBreakdown.relationshipConcentrationRiskScore"], 48), 0.32],
      [extractProfileScore(relationshipProfile, ["dependencyRisk", "scoreBreakdown.dependencyRiskScore"], 48), 0.22],
      [extractProfileScore(riskProfile, ["dependencyConcentrationRisk", "scoreBreakdown.dependencyConcentrationRiskScore"], 48), 0.18],
      [100 - extractProfileScore(relationshipProfile, ["coordinationQuality", "relationshipDurability"], 54), 0.12],
      [100 - delegationReadinessScore, 0.08],
      [100 - backupLeadershipReadinessScore, 0.08],
    ]),
  );
  const vendorContactDependencyRiskScore = getScore(
    input.vendorContactDependencyScore,
    weightedAverage([
      [100 - extractProfileScore(relationshipProfile, ["operationalRelationshipResilience", "scoreBreakdown.operationalRelationshipResilienceScore"], 54), 0.24],
      [100 - extractProfileScore(relationshipProfile, ["partnerReliability", "scoreBreakdown.partnerReliabilityScore"], 54), 0.18],
      [relationshipConcentrationScore, 0.2],
      [extractProfileScore(riskProfile, ["operationalRiskExposure", "scoreBreakdown.operationalRiskExposureScore"], 48), 0.14],
      [extractProfileScore(riskProfile, ["dependencyConcentrationRisk"], 48), 0.12],
      [100 - documentationReadinessScore, 0.12],
    ]),
  );
  const operationalContinuityRiskScore = getScore(
    input.operationalContinuityRiskScore,
    weightedAverage([
      [extractProfileScore(riskProfile, ["operationalRiskExposure", "scoreBreakdown.operationalRiskExposureScore"], 48), 0.22],
      [100 - extractProfileScore(riskProfile, ["operationalContinuityResilience", "scoreBreakdown.operationalContinuityResilienceScore"], 54), 0.2],
      [100 - extractProfileScore(legacyProfile, ["overallContinuityScore", "scoreBreakdown.overallContinuityScore"], 54), 0.16],
      [decisionConcentrationScore, 0.1],
      [knowledgeConcentrationScore, 0.1],
      [accessControlConcentrationScore, 0.1],
      [relationshipConcentrationScore, 0.06],
      [vendorContactDependencyRiskScore, 0.06],
    ]),
  );
  const founderDependencyScore = getScore(
    input.founderDependencyScore,
    weightedAverage([
      [extractProfileScore(legacyProfile, ["leadershipDependencyRisk", "scoreBreakdown.founderOperatorDependencyRiskScore"], 48), 0.28],
      [extractProfileScore(riskProfile, ["governanceFragilityExposure", "scoreBreakdown.governanceFragilityExposureScore"], 48), 0.16],
      [decisionConcentrationScore, 0.14],
      [relationshipConcentrationScore, 0.12],
      [knowledgeConcentrationScore, 0.12],
      [accessControlConcentrationScore, 0.1],
      [100 - backupLeadershipReadinessScore, 0.08],
    ]),
  );
  const continuityReadinessScore = weightedAverage([
    [backupLeadershipReadinessScore, 0.22],
    [documentationReadinessScore, 0.2],
    [delegationReadinessScore, 0.2],
    [100 - decisionConcentrationScore, 0.12],
    [100 - knowledgeConcentrationScore, 0.1],
    [100 - accessControlConcentrationScore, 0.08],
    [100 - operationalContinuityRiskScore, 0.08],
  ]);
  const overallKeyPersonRiskScore = weightedAverage([
    [founderDependencyScore, 0.16],
    [decisionConcentrationScore, 0.13],
    [relationshipConcentrationScore, 0.12],
    [vendorContactDependencyRiskScore, 0.1],
    [knowledgeConcentrationScore, 0.13],
    [accessControlConcentrationScore, 0.12],
    [operationalContinuityRiskScore, 0.12],
    [100 - backupLeadershipReadinessScore, 0.05],
    [100 - documentationReadinessScore, 0.04],
    [100 - delegationReadinessScore, 0.03],
  ]);

  return {
    connectivityScore: 100 - relationshipConcentrationScore,
    durabilityScore: continuityReadinessScore,
    expansionScore: 100 - operationalContinuityRiskScore,
    institutionalScore: backupLeadershipReadinessScore,
    logisticsScore: documentationReadinessScore,
    luxuryScore: 100 - founderDependencyScore,
    developmentScore: delegationReadinessScore,
    overallKeyPersonRiskScore,
    continuityReadinessScore,
    founderDependencyScore,
    decisionConcentrationScore,
    relationshipConcentrationScore,
    vendorContactDependencyRiskScore,
    knowledgeConcentrationScore,
    accessControlConcentrationScore,
    operationalContinuityRiskScore,
    backupLeadershipReadinessScore,
    documentationReadinessScore,
    delegationReadinessScore,
  };
}

function classifyRisk(score: number): KeyPersonRiskLevel {
  if (score >= 82) return "critical";
  if (score >= 68) return "high";
  if (score >= 54) return "elevated";
  if (score >= 38) return "moderate";

  return "low";
}

function buildWarnings(scoreBreakdown: FounderDependencyKeyPersonRiskScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "KEY_PERSON_RISK_DATA_INCOMPLETE",
            severity: missingData.length >= 5 ? "high" : "medium",
            message: "Key-person risk assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.overallKeyPersonRiskScore >= 78
      ? [
          createCorridorWarning({
            code: "KEY_PERSON_RISK_HIGH",
            severity: "high",
            message: "Overall key-person risk is high under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.founderDependencyScore >= 74
      ? [
          createCorridorWarning({
            code: "FOUNDER_DEPENDENCY_HIGH",
            severity: "high",
            message: "Founder dependency is high and requires human operational continuity review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.accessControlConcentrationScore >= 72
      ? [
          createCorridorWarning({
            code: "ACCESS_CONTROL_CONCENTRATION_HIGH",
            severity: "medium",
            message: "Access/control concentration is elevated; this is an operational review flag, not legal or employment advice.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.backupLeadershipReadinessScore < 45
      ? [
          createCorridorWarning({
            code: "BACKUP_LEADERSHIP_READINESS_WEAK",
            severity: "medium",
            message: "Backup leadership readiness is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.documentationReadinessScore < 45
      ? [
          createCorridorWarning({
            code: "PROCESS_DOCUMENTATION_READINESS_WEAK",
            severity: "medium",
            message: "Process documentation readiness is weak enough to require manual review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
  ];
}

function buildKeyRisks(scoreBreakdown: FounderDependencyKeyPersonRiskScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.overallKeyPersonRiskScore >= 66 ? ["Overall key-person risk is elevated."] : []),
    ...(scoreBreakdown.founderDependencyScore >= 66 ? ["Founder/operator dependency risk is elevated."] : []),
    ...(scoreBreakdown.decisionConcentrationScore >= 66 ? ["Decision concentration risk is elevated."] : []),
    ...(scoreBreakdown.relationshipConcentrationScore >= 66 ? ["Relationship concentration risk is elevated."] : []),
    ...(scoreBreakdown.vendorContactDependencyRiskScore >= 66 ? ["Vendor/contact dependency risk is elevated."] : []),
    ...(scoreBreakdown.knowledgeConcentrationScore >= 66 ? ["Knowledge concentration risk is elevated."] : []),
    ...(scoreBreakdown.accessControlConcentrationScore >= 66 ? ["Access/control concentration risk is elevated."] : []),
    ...(scoreBreakdown.operationalContinuityRiskScore >= 66 ? ["Operational continuity risk is elevated."] : []),
    ...(scoreBreakdown.backupLeadershipReadinessScore < 45 ? ["Backup leadership readiness is weak."] : []),
    ...(scoreBreakdown.documentationReadinessScore < 45 ? ["Documentation readiness is weak."] : []),
    ...(scoreBreakdown.delegationReadinessScore < 45 ? ["Delegation readiness is weak."] : []),
    ...(missingData.length > 0 ? `Missing data reduces confidence: ${missingData.slice(0, 4).join(", ")}.` : []),
  ]);
}

function buildStrengths(scoreBreakdown: FounderDependencyKeyPersonRiskScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.overallKeyPersonRiskScore < 40 ? ["Overall key-person risk is contained."] : []),
    ...(scoreBreakdown.continuityReadinessScore >= 70 ? ["Continuity readiness is strong."] : []),
    ...(scoreBreakdown.backupLeadershipReadinessScore >= 70 ? ["Backup leadership readiness is strong."] : []),
    ...(scoreBreakdown.documentationReadinessScore >= 70 ? ["Process documentation readiness is strong."] : []),
    ...(scoreBreakdown.delegationReadinessScore >= 70 ? ["Delegation readiness is strong."] : []),
    ...(scoreBreakdown.decisionConcentrationScore < 45 ? ["Decision concentration risk is contained."] : []),
    ...(scoreBreakdown.knowledgeConcentrationScore < 45 ? ["Knowledge concentration risk is contained."] : []),
    ...(scoreBreakdown.accessControlConcentrationScore < 45 ? ["Access/control concentration risk is contained."] : []),
  ]);
}

function buildRecommendations(scoreBreakdown: FounderDependencyKeyPersonRiskScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.founderDependencyScore >= 58 ? ["Schedule human review of founder/operator dependency assumptions and continuity coverage."] : []),
    ...(scoreBreakdown.decisionConcentrationScore >= 58 ? ["Map recurring decision points and identify which ones need documented review coverage."] : []),
    ...(scoreBreakdown.relationshipConcentrationScore >= 58 ? ["Inventory critical relationships and note where continuity coverage depends on one person."] : []),
    ...(scoreBreakdown.vendorContactDependencyRiskScore >= 58 ? ["Document critical vendor/contact ownership and escalation paths for manual review."] : []),
    ...(scoreBreakdown.knowledgeConcentrationScore >= 58 ? ["Capture key operating knowledge in internal documentation for human review."] : []),
    ...(scoreBreakdown.accessControlConcentrationScore >= 58 ? ["Review access/control concentration with appropriate internal stakeholders before making changes."] : []),
    ...(scoreBreakdown.backupLeadershipReadinessScore < 58 ? ["Review backup leadership readiness indicators without making HR or employment recommendations."] : []),
    ...(scoreBreakdown.delegationReadinessScore < 58 ? ["Identify operational tasks that may need clearer delegation documentation."] : []),
    "Keep all continuity responses human-reviewed; this module does not provide legal, HR, employment, tax, trust, ownership, investment, or portfolio-management recommendations.",
  ]);
}

function buildExplanation(params: { scoreBreakdown: FounderDependencyKeyPersonRiskScoreBreakdown; riskLevel: KeyPersonRiskLevel }) {
  const scoreBreakdown = params.scoreBreakdown;

  return [
    `Risk level is ${params.riskLevel} with an overall key-person risk score of ${scoreBreakdown.overallKeyPersonRiskScore}/100.`,
    `Continuity readiness is ${scoreBreakdown.continuityReadinessScore}/100, derived from backup leadership readiness, documentation readiness, delegation readiness, and reduced concentration risk.`,
    `Founder dependency, decision concentration, relationship concentration, vendor/contact dependency, knowledge concentration, access/control concentration, and operational continuity risk were scored deterministically from structured inputs and optional read-only profile fallbacks.`,
    "This output is advisory operational intelligence only and does not provide legal, HR, employment, tax, trust, ownership, investment, portfolio-management, or market-prediction advice.",
  ];
}

function buildTrace(scoreBreakdown: FounderDependencyKeyPersonRiskScoreBreakdown, missingData: string[]) {
  return [
    "Normalized all numeric scores to a deterministic 0-100 scale.",
    "Derived optional fallback scores only from supplied in-memory intelligence profiles.",
    `Computed key-person risk from founder dependency (${scoreBreakdown.founderDependencyScore}), decision concentration (${scoreBreakdown.decisionConcentrationScore}), relationship concentration (${scoreBreakdown.relationshipConcentrationScore}), vendor/contact dependency (${scoreBreakdown.vendorContactDependencyRiskScore}), knowledge concentration (${scoreBreakdown.knowledgeConcentrationScore}), access/control concentration (${scoreBreakdown.accessControlConcentrationScore}), operational continuity risk (${scoreBreakdown.operationalContinuityRiskScore}), backup leadership readiness (${scoreBreakdown.backupLeadershipReadinessScore}), documentation readiness (${scoreBreakdown.documentationReadinessScore}), and delegation readiness (${scoreBreakdown.delegationReadinessScore}).`,
    missingData.length > 0 ? `Missing inputs flagged for human verification: ${missingData.join(", ")}.` : "No required structured inputs were missing.",
    "No outreach, SMS, email, Twilio, database writes, schema changes, protected-class logic, demographic targeting, external APIs, or autonomous execution were used.",
  ];
}

function buildAssumptions(input: FounderDependencyKeyPersonRiskInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0 ? ["Missing key-person risk inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."] : []),
    "Founder dependency and key-person risk scoring is deterministic, explainable, read-only, compliance-first, and designed for human review before any execution.",
    "This engine evaluates founder/operator dependency, concentration risk, backup readiness, process documentation, delegation readiness, and operational continuity exposure only.",
    "No outreach, SMS, email sending, Twilio, autonomous execution, DB writes, schema changes, external APIs, scraping, demographic data, or protected-class data were used.",
    "This is not legal advice, HR advice, employment advice, tax advice, estate-planning advice, trust advice, ownership restructuring advice, investment advice, portfolio-management advice, autonomous mitigation, or market prediction.",
  ]);
}

export function analyzeFounderDependencyKeyPersonRiskIntelligence(
  input: FounderDependencyKeyPersonRiskInput = {},
): FounderDependencyKeyPersonRiskResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const riskLevel = classifyRisk(scoreBreakdown.overallKeyPersonRiskScore);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallKeyPersonRiskScore: scoreBreakdown.overallKeyPersonRiskScore,
    riskLevel,
    continuityReadinessScore: scoreBreakdown.continuityReadinessScore,
    founderDependencyScore: scoreBreakdown.founderDependencyScore,
    decisionConcentrationScore: scoreBreakdown.decisionConcentrationScore,
    relationshipConcentrationScore: scoreBreakdown.relationshipConcentrationScore,
    knowledgeConcentrationScore: scoreBreakdown.knowledgeConcentrationScore,
    accessControlConcentrationScore: scoreBreakdown.accessControlConcentrationScore,
    backupLeadershipReadinessScore: scoreBreakdown.backupLeadershipReadinessScore,
    documentationReadinessScore: scoreBreakdown.documentationReadinessScore,
    delegationReadinessScore: scoreBreakdown.delegationReadinessScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown, missingData),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    explanation: buildExplanation({ scoreBreakdown, riskLevel }),
    trace: buildTrace(scoreBreakdown, missingData),
    warnings,
    missingData,
    assumptions,
    safety: {
      readOnly: true,
      outreachAuthorized: false,
      smsAuthorized: false,
      emailAuthorized: false,
      twilioUsed: false,
      executionAuthorized: false,
      databaseWriteAuthorized: false,
      schemaMutationUsed: false,
      autonomousMitigationAuthorized: false,
      legalAdvice: false,
      hrAdvice: false,
      employmentAdvice: false,
      taxAdvice: false,
      estatePlanningAdvice: false,
      trustAdvice: false,
      ownershipRestructuringAdvice: false,
      investmentAdvice: false,
      portfolioManagementAdvice: false,
      demographicTargetingUsed: false,
      protectedClassLogicUsed: false,
      externalDataUsed: false,
      scrapingUsed: false,
      marketPrediction: false,
    },
    readOnly: true,
  };
}

export const getFounderDependencyKeyPersonRiskIntelligence = analyzeFounderDependencyKeyPersonRiskIntelligence;
