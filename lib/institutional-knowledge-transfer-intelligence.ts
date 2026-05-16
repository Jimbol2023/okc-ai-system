import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import { calculateCorridorConfidence, createCorridorWarning, normalizeCorridorScore } from "./corridor-intelligence-utils";

export type KnowledgeTransferReadinessLevel = "critical" | "limited" | "developing" | "durable" | "institutional";

export type InstitutionalKnowledgeTransferInput = {
  criticalKnowledgeDocumentationScore?: number;
  sopCoverageScore?: number;
  decisionHistoryPreservationScore?: number;
  relationshipKnowledgeTransferScore?: number;
  vendorProcessTransferScore?: number;
  dealWorkflowTransferScore?: number;
  accessKnowledgeRiskScore?: number;
  trainingReadinessScore?: number;
  institutionalMemoryDurabilityScore?: number;
  continuityHandoffReadinessScore?: number;
  founderDependencyProfile?: unknown;
  legacyContinuityProfile?: unknown;
  institutionalRelationshipProfile?: unknown;
  familyOfficeGovernanceProfile?: unknown;
  enterpriseRiskProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type InstitutionalKnowledgeTransferScoreBreakdown = CorridorScoreBreakdown & {
  overallKnowledgeTransferScore: number;
  institutionalMemoryScore: number;
  criticalKnowledgeDocumentationScore: number;
  sopCoverageScore: number;
  decisionHistoryPreservationScore: number;
  relationshipKnowledgeTransferScore: number;
  vendorProcessTransferScore: number;
  dealWorkflowTransferScore: number;
  accessKnowledgeRiskScore: number;
  trainingReadinessScore: number;
  continuityHandoffScore: number;
};

export type InstitutionalKnowledgeTransferResult = {
  overallKnowledgeTransferScore: number;
  transferReadinessLevel: KnowledgeTransferReadinessLevel;
  institutionalMemoryScore: number;
  sopCoverageScore: number;
  decisionHistoryPreservationScore: number;
  relationshipKnowledgeTransferScore: number;
  vendorProcessTransferScore: number;
  dealWorkflowTransferScore: number;
  accessKnowledgeRiskScore: number;
  trainingReadinessScore: number;
  continuityHandoffScore: number;
  confidenceScore: number;
  scoreBreakdown: InstitutionalKnowledgeTransferScoreBreakdown;
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
    autonomousTrainingActions: false;
    legalAdvice: false;
    hrAdvice: false;
    employmentAdvice: false;
    taxAdvice: false;
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

const REQUIRED_INPUTS: Array<keyof InstitutionalKnowledgeTransferInput> = [
  "criticalKnowledgeDocumentationScore",
  "sopCoverageScore",
  "decisionHistoryPreservationScore",
  "relationshipKnowledgeTransferScore",
  "vendorProcessTransferScore",
  "dealWorkflowTransferScore",
  "accessKnowledgeRiskScore",
  "trainingReadinessScore",
  "institutionalMemoryDurabilityScore",
  "continuityHandoffReadinessScore",
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

function hasFallbackForInput(input: InstitutionalKnowledgeTransferInput, key: keyof InstitutionalKnowledgeTransferInput) {
  const keyPersonProfile = input.founderDependencyProfile;
  const legacyProfile = input.legacyContinuityProfile;
  const relationshipProfile = input.institutionalRelationshipProfile;
  const governanceProfile = input.familyOfficeGovernanceProfile;
  const riskProfile = input.enterpriseRiskProfile;

  const fallbackPaths: Partial<Record<keyof InstitutionalKnowledgeTransferInput, boolean>> = {
    criticalKnowledgeDocumentationScore:
      hasProfileScore(keyPersonProfile, ["documentationReadinessScore", "scoreBreakdown.documentationReadinessScore"]) ||
      hasProfileScore(governanceProfile, ["governanceDocumentationReadiness"]),
    sopCoverageScore:
      hasProfileScore(keyPersonProfile, ["delegationReadinessScore", "documentationReadinessScore"]) ||
      hasProfileScore(governanceProfile, ["operatingDiscipline", "governanceDocumentationReadiness"]),
    decisionHistoryPreservationScore:
      hasProfileScore(governanceProfile, ["decisionAccountability", "governanceDocumentationReadiness"]) ||
      hasProfileScore(legacyProfile, ["scoreBreakdown.humanReviewContinuityScore"]),
    relationshipKnowledgeTransferScore:
      hasProfileScore(relationshipProfile, ["communicationStability", "relationshipDurability"]) ||
      hasProfileScore(keyPersonProfile, ["relationshipConcentrationScore"]),
    vendorProcessTransferScore:
      hasProfileScore(relationshipProfile, ["operationalRelationshipResilience", "partnerReliability"]) ||
      hasProfileScore(keyPersonProfile, ["scoreBreakdown.vendorContactDependencyRiskScore"]),
    dealWorkflowTransferScore:
      hasProfileScore(riskProfile, ["operationalContinuityResilience", "defensiveOperationalResilience"]) ||
      hasProfileScore(keyPersonProfile, ["delegationReadinessScore", "documentationReadinessScore"]),
    accessKnowledgeRiskScore:
      hasProfileScore(keyPersonProfile, ["accessControlConcentrationScore", "scoreBreakdown.accessControlConcentrationScore"]) ||
      hasProfileScore(governanceProfile, ["humanReviewGovernanceAlignment"]),
    trainingReadinessScore:
      hasProfileScore(keyPersonProfile, ["backupLeadershipReadinessScore", "delegationReadinessScore"]) ||
      hasProfileScore(governanceProfile, ["multiEntityCoordinationReadiness", "operatingDiscipline"]),
    institutionalMemoryDurabilityScore:
      hasProfileScore(legacyProfile, ["institutionalMemoryScore", "scoreBreakdown.institutionalMemoryPreservationScore"]) ||
      hasProfileScore(governanceProfile, ["longHorizonStewardshipDurability"]),
    continuityHandoffReadinessScore:
      hasProfileScore(legacyProfile, ["overallContinuityScore", "successionReadiness"]) ||
      hasProfileScore(keyPersonProfile, ["continuityReadinessScore", "backupLeadershipReadinessScore"]),
  };

  return fallbackPaths[key] ?? false;
}

function getMissingData(input: InstitutionalKnowledgeTransferInput) {
  const labels: Record<keyof InstitutionalKnowledgeTransferInput, string> = {
    criticalKnowledgeDocumentationScore: "critical knowledge documentation score",
    sopCoverageScore: "SOP coverage score",
    decisionHistoryPreservationScore: "decision history preservation score",
    relationshipKnowledgeTransferScore: "relationship knowledge transfer score",
    vendorProcessTransferScore: "vendor/process knowledge transfer score",
    dealWorkflowTransferScore: "deal workflow transfer score",
    accessKnowledgeRiskScore: "system access knowledge transfer risk score",
    trainingReadinessScore: "training readiness score",
    institutionalMemoryDurabilityScore: "institutional memory durability score",
    continuityHandoffReadinessScore: "continuity handoff readiness score",
    founderDependencyProfile: "founder dependency/key-person risk profile",
    legacyContinuityProfile: "legacy continuity profile",
    institutionalRelationshipProfile: "institutional relationship profile",
    familyOfficeGovernanceProfile: "family office governance profile",
    enterpriseRiskProfile: "enterprise risk profile",
    dataQualityScore: "data quality score",
    assumptions: "assumptions",
  };

  return REQUIRED_INPUTS.flatMap((key) => (input[key] === undefined && !hasFallbackForInput(input, key) ? [labels[key]] : []));
}

function buildScoreBreakdown(input: InstitutionalKnowledgeTransferInput): InstitutionalKnowledgeTransferScoreBreakdown {
  const keyPersonProfile = input.founderDependencyProfile;
  const legacyProfile = input.legacyContinuityProfile;
  const relationshipProfile = input.institutionalRelationshipProfile;
  const governanceProfile = input.familyOfficeGovernanceProfile;
  const riskProfile = input.enterpriseRiskProfile;
  const criticalKnowledgeDocumentationScore = getScore(
    input.criticalKnowledgeDocumentationScore,
    weightedAverage([
      [extractProfileScore(keyPersonProfile, ["documentationReadinessScore", "scoreBreakdown.documentationReadinessScore"], 54), 0.34],
      [extractProfileScore(governanceProfile, ["governanceDocumentationReadiness", "scoreBreakdown.governanceDocumentationReadinessScore"], 54), 0.28],
      [extractProfileScore(legacyProfile, ["institutionalMemoryScore", "scoreBreakdown.institutionalMemoryPreservationScore"], 54), 0.18],
      [extractProfileScore(governanceProfile, ["longHorizonStewardshipDurability"], 54), 0.1],
      [100 - extractProfileScore(keyPersonProfile, ["knowledgeConcentrationScore", "scoreBreakdown.knowledgeConcentrationScore"], 48), 0.1],
    ]),
  );
  const sopCoverageScore = getScore(
    input.sopCoverageScore,
    weightedAverage([
      [criticalKnowledgeDocumentationScore, 0.28],
      [extractProfileScore(keyPersonProfile, ["delegationReadinessScore", "scoreBreakdown.delegationReadinessScore"], 54), 0.22],
      [extractProfileScore(governanceProfile, ["operatingDiscipline", "scoreBreakdown.operatingDisciplineScore"], 54), 0.18],
      [extractProfileScore(governanceProfile, ["governanceDocumentationReadiness"], 54), 0.16],
      [100 - extractProfileScore(keyPersonProfile, ["operationalContinuityRiskScore"], 48), 0.16],
    ]),
  );
  const decisionHistoryPreservationScore = getScore(
    input.decisionHistoryPreservationScore,
    weightedAverage([
      [extractProfileScore(governanceProfile, ["decisionAccountability", "scoreBreakdown.decisionAccountabilityScore"], 54), 0.24],
      [extractProfileScore(governanceProfile, ["governanceDocumentationReadiness"], 54), 0.22],
      [extractProfileScore(legacyProfile, ["scoreBreakdown.humanReviewContinuityScore"], 54), 0.18],
      [criticalKnowledgeDocumentationScore, 0.14],
      [sopCoverageScore, 0.12],
      [100 - extractProfileScore(keyPersonProfile, ["decisionConcentrationScore"], 48), 0.1],
    ]),
  );
  const relationshipKnowledgeTransferScore = getScore(
    input.relationshipKnowledgeTransferScore,
    weightedAverage([
      [extractProfileScore(relationshipProfile, ["communicationStability", "scoreBreakdown.communicationStabilityScore"], 54), 0.24],
      [extractProfileScore(relationshipProfile, ["relationshipDurability", "scoreBreakdown.relationshipDurabilityScore"], 54), 0.2],
      [extractProfileScore(relationshipProfile, ["institutionalTrustReadiness"], 54), 0.16],
      [100 - extractProfileScore(relationshipProfile, ["relationshipConcentrationRisk", "scoreBreakdown.relationshipConcentrationRiskScore"], 48), 0.16],
      [100 - extractProfileScore(keyPersonProfile, ["relationshipConcentrationScore"], 48), 0.14],
      [criticalKnowledgeDocumentationScore, 0.1],
    ]),
  );
  const vendorProcessTransferScore = getScore(
    input.vendorProcessTransferScore,
    weightedAverage([
      [extractProfileScore(relationshipProfile, ["operationalRelationshipResilience", "scoreBreakdown.operationalRelationshipResilienceScore"], 54), 0.24],
      [extractProfileScore(relationshipProfile, ["partnerReliability", "scoreBreakdown.partnerReliabilityScore"], 54), 0.16],
      [100 - extractProfileScore(keyPersonProfile, ["scoreBreakdown.vendorContactDependencyRiskScore"], 48), 0.2],
      [sopCoverageScore, 0.16],
      [criticalKnowledgeDocumentationScore, 0.12],
      [100 - extractProfileScore(riskProfile, ["dependencyConcentrationRisk"], 48), 0.12],
    ]),
  );
  const dealWorkflowTransferScore = getScore(
    input.dealWorkflowTransferScore,
    weightedAverage([
      [sopCoverageScore, 0.26],
      [criticalKnowledgeDocumentationScore, 0.18],
      [extractProfileScore(riskProfile, ["operationalContinuityResilience", "scoreBreakdown.operationalContinuityResilienceScore"], 54), 0.18],
      [extractProfileScore(riskProfile, ["defensiveOperationalResilience", "scoreBreakdown.defensiveOperationalResilienceScore"], 54), 0.14],
      [extractProfileScore(keyPersonProfile, ["delegationReadinessScore"], 54), 0.14],
      [100 - extractProfileScore(keyPersonProfile, ["operationalContinuityRiskScore"], 48), 0.1],
    ]),
  );
  const accessKnowledgeRiskScore = getScore(
    input.accessKnowledgeRiskScore,
    weightedAverage([
      [extractProfileScore(keyPersonProfile, ["accessControlConcentrationScore", "scoreBreakdown.accessControlConcentrationScore"], 48), 0.34],
      [100 - extractProfileScore(governanceProfile, ["humanReviewGovernanceAlignment", "scoreBreakdown.humanReviewGovernanceAlignmentScore"], 54), 0.22],
      [100 - criticalKnowledgeDocumentationScore, 0.14],
      [100 - sopCoverageScore, 0.1],
      [100 - decisionHistoryPreservationScore, 0.1],
      [extractProfileScore(keyPersonProfile, ["decisionConcentrationScore"], 48), 0.1],
    ]),
  );
  const trainingReadinessScore = getScore(
    input.trainingReadinessScore,
    weightedAverage([
      [extractProfileScore(keyPersonProfile, ["backupLeadershipReadinessScore", "scoreBreakdown.backupLeadershipReadinessScore"], 54), 0.22],
      [extractProfileScore(keyPersonProfile, ["delegationReadinessScore", "scoreBreakdown.delegationReadinessScore"], 54), 0.2],
      [extractProfileScore(governanceProfile, ["multiEntityCoordinationReadiness", "scoreBreakdown.multiEntityCoordinationReadinessScore"], 54), 0.18],
      [sopCoverageScore, 0.16],
      [criticalKnowledgeDocumentationScore, 0.14],
      [extractProfileScore(governanceProfile, ["operatingDiscipline"], 54), 0.1],
    ]),
  );
  const institutionalMemoryScore = getScore(
    input.institutionalMemoryDurabilityScore,
    weightedAverage([
      [extractProfileScore(legacyProfile, ["institutionalMemoryScore", "scoreBreakdown.institutionalMemoryPreservationScore"], 54), 0.26],
      [extractProfileScore(governanceProfile, ["longHorizonStewardshipDurability", "scoreBreakdown.longHorizonStewardshipDurabilityScore"], 54), 0.18],
      [criticalKnowledgeDocumentationScore, 0.16],
      [decisionHistoryPreservationScore, 0.14],
      [relationshipKnowledgeTransferScore, 0.1],
      [vendorProcessTransferScore, 0.08],
      [dealWorkflowTransferScore, 0.08],
    ]),
  );
  const continuityHandoffScore = getScore(
    input.continuityHandoffReadinessScore,
    weightedAverage([
      [extractProfileScore(legacyProfile, ["overallContinuityScore", "scoreBreakdown.overallContinuityScore"], 54), 0.18],
      [extractProfileScore(legacyProfile, ["successionReadiness", "scoreBreakdown.successionReadinessScore"], 54), 0.16],
      [extractProfileScore(keyPersonProfile, ["continuityReadinessScore", "scoreBreakdown.continuityReadinessScore"], 54), 0.18],
      [trainingReadinessScore, 0.14],
      [institutionalMemoryScore, 0.12],
      [100 - accessKnowledgeRiskScore, 0.1],
      [sopCoverageScore, 0.06],
      [dealWorkflowTransferScore, 0.06],
    ]),
  );
  const overallKnowledgeTransferScore = weightedAverage([
    [criticalKnowledgeDocumentationScore, 0.12],
    [sopCoverageScore, 0.12],
    [decisionHistoryPreservationScore, 0.1],
    [relationshipKnowledgeTransferScore, 0.1],
    [vendorProcessTransferScore, 0.09],
    [dealWorkflowTransferScore, 0.1],
    [100 - accessKnowledgeRiskScore, 0.1],
    [trainingReadinessScore, 0.11],
    [institutionalMemoryScore, 0.08],
    [continuityHandoffScore, 0.08],
  ]);

  return {
    connectivityScore: relationshipKnowledgeTransferScore,
    durabilityScore: overallKnowledgeTransferScore,
    expansionScore: continuityHandoffScore,
    institutionalScore: institutionalMemoryScore,
    logisticsScore: sopCoverageScore,
    luxuryScore: decisionHistoryPreservationScore,
    developmentScore: dealWorkflowTransferScore,
    overallKnowledgeTransferScore,
    institutionalMemoryScore,
    criticalKnowledgeDocumentationScore,
    sopCoverageScore,
    decisionHistoryPreservationScore,
    relationshipKnowledgeTransferScore,
    vendorProcessTransferScore,
    dealWorkflowTransferScore,
    accessKnowledgeRiskScore,
    trainingReadinessScore,
    continuityHandoffScore,
  };
}

function classifyTransferReadiness(score: number): KnowledgeTransferReadinessLevel {
  if (score >= 82) return "institutional";
  if (score >= 68) return "durable";
  if (score >= 54) return "developing";
  if (score >= 40) return "limited";

  return "critical";
}

function buildWarnings(scoreBreakdown: InstitutionalKnowledgeTransferScoreBreakdown, missingData: string[]) {
  return [
    ...(missingData.length > 0
      ? [
          createCorridorWarning({
            code: "KNOWLEDGE_TRANSFER_DATA_INCOMPLETE",
            severity: missingData.length >= 5 ? "high" : "medium",
            message: "Knowledge transfer assessment is using incomplete structured inputs and requires human verification.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.overallKnowledgeTransferScore < 42
      ? [
          createCorridorWarning({
            code: "KNOWLEDGE_TRANSFER_READINESS_WEAK",
            severity: "high",
            message: "Overall knowledge transfer readiness is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.criticalKnowledgeDocumentationScore < 45
      ? [
          createCorridorWarning({
            code: "CRITICAL_KNOWLEDGE_DOCUMENTATION_WEAK",
            severity: "medium",
            message: "Critical knowledge documentation readiness is weak and requires operational review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.sopCoverageScore < 45
      ? [
          createCorridorWarning({
            code: "SOP_COVERAGE_WEAK",
            severity: "medium",
            message: "SOP coverage readiness is weak under current structured inputs.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.accessKnowledgeRiskScore >= 72
      ? [
          createCorridorWarning({
            code: "ACCESS_KNOWLEDGE_TRANSFER_RISK_HIGH",
            severity: "high",
            message: "System access knowledge transfer risk is high enough to require human review.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
    ...(scoreBreakdown.continuityHandoffScore < 45
      ? [
          createCorridorWarning({
            code: "CONTINUITY_HANDOFF_WEAK",
            severity: "medium",
            message: "Continuity handoff readiness is weak; no autonomous training or execution is performed.",
            category: "institutional",
            requiresHumanReview: true,
          }),
        ]
      : []),
  ];
}

function buildKeyRisks(scoreBreakdown: InstitutionalKnowledgeTransferScoreBreakdown, missingData: string[]) {
  return unique([
    ...(scoreBreakdown.overallKnowledgeTransferScore < 50 ? ["Overall knowledge transfer readiness is weak."] : []),
    ...(scoreBreakdown.criticalKnowledgeDocumentationScore < 50 ? ["Critical knowledge documentation readiness is weak."] : []),
    ...(scoreBreakdown.sopCoverageScore < 50 ? ["SOP coverage readiness is weak."] : []),
    ...(scoreBreakdown.decisionHistoryPreservationScore < 50 ? ["Decision history preservation is weak."] : []),
    ...(scoreBreakdown.relationshipKnowledgeTransferScore < 50 ? ["Relationship knowledge transfer is weak."] : []),
    ...(scoreBreakdown.vendorProcessTransferScore < 50 ? ["Vendor/process knowledge transfer is weak."] : []),
    ...(scoreBreakdown.dealWorkflowTransferScore < 50 ? ["Deal workflow knowledge transfer is weak."] : []),
    ...(scoreBreakdown.accessKnowledgeRiskScore >= 66 ? ["System access knowledge transfer risk is elevated."] : []),
    ...(scoreBreakdown.trainingReadinessScore < 50 ? ["Training readiness is weak."] : []),
    ...(scoreBreakdown.continuityHandoffScore < 50 ? ["Continuity handoff readiness is weak."] : []),
    ...(missingData.length > 0 ? `Missing data reduces confidence: ${missingData.slice(0, 4).join(", ")}.` : []),
  ]);
}

function buildStrengths(scoreBreakdown: InstitutionalKnowledgeTransferScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.overallKnowledgeTransferScore >= 70 ? ["Overall knowledge transfer readiness is strong."] : []),
    ...(scoreBreakdown.institutionalMemoryScore >= 70 ? ["Institutional memory durability is strong."] : []),
    ...(scoreBreakdown.sopCoverageScore >= 70 ? ["SOP coverage readiness is strong."] : []),
    ...(scoreBreakdown.decisionHistoryPreservationScore >= 70 ? ["Decision history preservation is strong."] : []),
    ...(scoreBreakdown.relationshipKnowledgeTransferScore >= 70 ? ["Relationship knowledge transfer is strong."] : []),
    ...(scoreBreakdown.vendorProcessTransferScore >= 70 ? ["Vendor/process knowledge transfer is strong."] : []),
    ...(scoreBreakdown.dealWorkflowTransferScore >= 70 ? ["Deal workflow transfer is strong."] : []),
    ...(scoreBreakdown.accessKnowledgeRiskScore < 40 ? ["System access knowledge transfer risk is contained."] : []),
    ...(scoreBreakdown.trainingReadinessScore >= 70 ? ["Training readiness is strong."] : []),
    ...(scoreBreakdown.continuityHandoffScore >= 70 ? ["Continuity handoff readiness is strong."] : []),
  ]);
}

function buildRecommendations(scoreBreakdown: InstitutionalKnowledgeTransferScoreBreakdown) {
  return unique([
    ...(scoreBreakdown.criticalKnowledgeDocumentationScore < 58 ? ["Inventory critical operating knowledge and identify documentation gaps for human review."] : []),
    ...(scoreBreakdown.sopCoverageScore < 58 ? ["Review SOP coverage for recurring workflows and mark missing operating steps."] : []),
    ...(scoreBreakdown.decisionHistoryPreservationScore < 58 ? ["Document major decision history and rationale in internal notes for review."] : []),
    ...(scoreBreakdown.relationshipKnowledgeTransferScore < 58 ? ["Capture relationship context and continuity notes without triggering outreach."] : []),
    ...(scoreBreakdown.vendorProcessTransferScore < 58 ? ["Document vendor/process ownership, escalation paths, and handoff notes for review."] : []),
    ...(scoreBreakdown.dealWorkflowTransferScore < 58 ? ["Review deal workflow knowledge gaps and update internal workflow notes."] : []),
    ...(scoreBreakdown.accessKnowledgeRiskScore >= 58 ? ["Flag system access knowledge concentration for human operational review before any access changes."] : []),
    ...(scoreBreakdown.trainingReadinessScore < 58 ? ["Review training readiness indicators and identify knowledge areas needing human-led walkthroughs."] : []),
    ...(scoreBreakdown.continuityHandoffScore < 58 ? ["Prepare a continuity handoff checklist for manual review."] : []),
    "Keep knowledge-transfer actions human-reviewed; this module does not provide legal, HR, ownership, trust, tax, investment, or portfolio-management recommendations.",
  ]);
}

function buildExplanation(params: {
  scoreBreakdown: InstitutionalKnowledgeTransferScoreBreakdown;
  transferReadinessLevel: KnowledgeTransferReadinessLevel;
}) {
  const scoreBreakdown = params.scoreBreakdown;

  return [
    `Transfer readiness level is ${params.transferReadinessLevel} with an overall knowledge transfer score of ${scoreBreakdown.overallKnowledgeTransferScore}/100.`,
    `Institutional memory score is ${scoreBreakdown.institutionalMemoryScore}/100 and continuity handoff readiness is ${scoreBreakdown.continuityHandoffScore}/100.`,
    `Documentation, SOP coverage, decision history, relationship context, vendor/process knowledge, deal workflows, access knowledge risk, and training readiness were scored deterministically from structured inputs and optional read-only profile fallbacks.`,
    "This output flags operational knowledge-transfer risk only and does not provide legal, HR, ownership, trust, tax, investment, portfolio-management, or market-prediction advice.",
  ];
}

function buildTrace(scoreBreakdown: InstitutionalKnowledgeTransferScoreBreakdown, missingData: string[]) {
  return [
    "Normalized all numeric scores to a deterministic 0-100 scale.",
    "Derived optional fallback scores only from supplied in-memory intelligence profiles.",
    `Computed knowledge transfer readiness from documentation (${scoreBreakdown.criticalKnowledgeDocumentationScore}), SOP coverage (${scoreBreakdown.sopCoverageScore}), decision history (${scoreBreakdown.decisionHistoryPreservationScore}), relationship transfer (${scoreBreakdown.relationshipKnowledgeTransferScore}), vendor/process transfer (${scoreBreakdown.vendorProcessTransferScore}), deal workflow transfer (${scoreBreakdown.dealWorkflowTransferScore}), access knowledge risk (${scoreBreakdown.accessKnowledgeRiskScore}), training readiness (${scoreBreakdown.trainingReadinessScore}), institutional memory (${scoreBreakdown.institutionalMemoryScore}), and continuity handoff (${scoreBreakdown.continuityHandoffScore}).`,
    missingData.length > 0 ? `Missing inputs flagged for human verification: ${missingData.join(", ")}.` : "No required structured inputs were missing.",
    "No outreach, SMS, email, Twilio, database writes, schema changes, protected-class logic, demographic targeting, external APIs, scraping, or autonomous execution were used.",
  ];
}

function buildAssumptions(input: InstitutionalKnowledgeTransferInput, missingData: string[]) {
  return unique([
    ...(input.assumptions ?? []),
    ...(missingData.length > 0 ? ["Missing knowledge-transfer inputs were filled with conservative deterministic defaults or optional intelligence-profile fallbacks."] : []),
    "Institutional knowledge transfer scoring is deterministic, explainable, read-only, compliance-first, and designed for human review before any execution.",
    "This engine evaluates documentation readiness, SOP coverage, decision history preservation, relationship/vendor/process/deal workflow knowledge transfer, access knowledge risk, training readiness, institutional memory, and continuity handoff readiness only.",
    "No outreach, SMS, email sending, Twilio, autonomous execution, DB writes, schema changes, external APIs, scraping, demographic data, or protected-class data were used.",
    "This is not legal advice, HR advice, ownership advice, trust advice, tax advice, investment advice, portfolio-management advice, autonomous training action, or market prediction.",
  ]);
}

export function analyzeInstitutionalKnowledgeTransferIntelligence(
  input: InstitutionalKnowledgeTransferInput = {},
): InstitutionalKnowledgeTransferResult {
  const missingData = getMissingData(input);
  const scoreBreakdown = buildScoreBreakdown(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const transferReadinessLevel = classifyTransferReadiness(scoreBreakdown.overallKnowledgeTransferScore);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallKnowledgeTransferScore: scoreBreakdown.overallKnowledgeTransferScore,
    transferReadinessLevel,
    institutionalMemoryScore: scoreBreakdown.institutionalMemoryScore,
    sopCoverageScore: scoreBreakdown.sopCoverageScore,
    decisionHistoryPreservationScore: scoreBreakdown.decisionHistoryPreservationScore,
    relationshipKnowledgeTransferScore: scoreBreakdown.relationshipKnowledgeTransferScore,
    vendorProcessTransferScore: scoreBreakdown.vendorProcessTransferScore,
    dealWorkflowTransferScore: scoreBreakdown.dealWorkflowTransferScore,
    accessKnowledgeRiskScore: scoreBreakdown.accessKnowledgeRiskScore,
    trainingReadinessScore: scoreBreakdown.trainingReadinessScore,
    continuityHandoffScore: scoreBreakdown.continuityHandoffScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown, missingData),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    explanation: buildExplanation({ scoreBreakdown, transferReadinessLevel }),
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
      autonomousTrainingActions: false,
      legalAdvice: false,
      hrAdvice: false,
      employmentAdvice: false,
      taxAdvice: false,
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

export const getInstitutionalKnowledgeTransferIntelligence = analyzeInstitutionalKnowledgeTransferIntelligence;
