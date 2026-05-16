import { buildGovernanceLongHorizonInstitutionalResilienceExplainability } from "./governance-long-horizon-institutional-resilience-review-explainability";
import {
  calculateLongHorizonInstitutionalResilienceAreaScore,
  calculateLongHorizonInstitutionalResilienceFindingConfidence,
  calculateOverallLongHorizonInstitutionalResilienceScore,
  longHorizonInstitutionalResilienceClassificationFromScore,
} from "./governance-long-horizon-institutional-resilience-review-scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
} from "./full-system-governance-audit-types";
import type {
  GovernanceLongHorizonInstitutionalResilienceArea,
  GovernanceLongHorizonInstitutionalResilienceAreaAssessment,
  GovernanceLongHorizonInstitutionalResilienceFinding,
  GovernanceLongHorizonInstitutionalResilienceFindingType,
  GovernanceLongHorizonInstitutionalResilienceInput,
  GovernanceLongHorizonInstitutionalResilienceResult,
} from "./governance-long-horizon-institutional-resilience-review-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

type AreaInput = {
  area: GovernanceLongHorizonInstitutionalResilienceArea;
  description: string;
  baseScore: number;
  resilienceSignals: string[];
  fragilitySignals: string[];
  recommendedHumanReview: string;
  reasoning: string;
};

function unique(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter((value) => value.length > 0)),
  );
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function slug(value: string): string {
  return normalize(value).slice(0, 72) || "long_horizon_resilience";
}

function average(values: number[]): number {
  const usableValues = values.filter((value) => Number.isFinite(value));
  if (usableValues.length === 0) {
    return 50;
  }

  return usableValues.reduce((sum, value) => sum + value, 0) / usableValues.length;
}

function stringsFromUnknown(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  return typeof value === "string" && value.trim().length > 0 ? [value] : [];
}

function contextSignals(
  input: GovernanceLongHorizonInstitutionalResilienceInput,
  key:
    | "futureAiAgentScope"
    | "futureOrchestrationScenarios"
    | "futureEnterpriseExpansionScenarios"
    | "operationalStressScenarios"
    | "continuityDisruptionScenarios"
    | "longHorizonAssumptions"
    | "resilienceLimitations",
): string[] {
  const contextValue = input.resilienceContext?.[key];
  if (Array.isArray(contextValue)) {
    return unique(contextValue);
  }

  return unique(stringsFromUnknown(input.metadata?.[key]));
}

function horizonSignal(input: GovernanceLongHorizonInstitutionalResilienceInput): string | undefined {
  const label = input.resilienceContext?.horizonLabel;
  if (typeof label === "string" && label.trim().length > 0) {
    return `Horizon label: ${label.trim()}`;
  }

  const years = input.resilienceContext?.horizonYears;
  if (typeof years === "number" && Number.isFinite(years)) {
    return `Horizon years: ${years}`;
  }

  const metadataLabel = input.metadata?.horizonLabel;
  return typeof metadataLabel === "string" && metadataLabel.trim().length > 0
    ? `Horizon label: ${metadataLabel.trim()}`
    : undefined;
}

function missingResilienceContext(input: GovernanceLongHorizonInstitutionalResilienceInput): string[] {
  return [
    horizonSignal(input) ? "" : "Long-horizon label or horizon years context is not supplied.",
    contextSignals(input, "futureAiAgentScope").length === 0
      ? "Future AI-agent scope context is not supplied."
      : "",
    contextSignals(input, "futureOrchestrationScenarios").length === 0
      ? "Future orchestration scenario context is not supplied."
      : "",
    contextSignals(input, "operationalStressScenarios").length === 0
      ? "Operational stress scenario context is not supplied."
      : "",
    contextSignals(input, "continuityDisruptionScenarios").length === 0
      ? "Continuity disruption scenario context is not supplied."
      : "",
  ].filter(Boolean);
}

function getAuditFindings(
  input: GovernanceLongHorizonInstitutionalResilienceInput,
): FullSystemGovernanceAuditFinding[] {
  return [...(input.auditFindings ?? []), ...(input.auditResult?.findings ?? [])];
}

function getRecommendations(
  input: GovernanceLongHorizonInstitutionalResilienceInput,
): FullSystemGovernanceAuditRecommendation[] {
  return [...(input.recommendations ?? []), ...(input.auditResult?.recommendations ?? [])];
}

function auditCategories(
  input: GovernanceLongHorizonInstitutionalResilienceInput,
): FullSystemGovernanceAuditCategory[] {
  return unique(
    getAuditFindings(input)
      .map((finding) => finding.category)
      .concat(Object.keys(input.auditResult?.categoryScores ?? {}) as FullSystemGovernanceAuditCategory[]),
  ) as FullSystemGovernanceAuditCategory[];
}

function statusScore(status?: string): number {
  switch (status) {
    case "institutionally_resilient":
    case "institutionally_isolated":
    case "institutionally_version_survivable":
    case "institutionally_traceable":
    case "institutionally_explainable":
    case "institutionally_survivable":
    case "institutionally_reconstructable":
    case "institutionally_continuous":
    case "institutionally_versionable":
    case "institutionally_reviewable":
    case "institutionally_observable":
    case "institutionally_scalable":
    case "institutionally_durable":
    case "institutionally_stable":
    case "institutionally_registry_ready":
    case "institutionally_consistent":
    case "institutionally_ready":
    case "institutionally_strong":
    case "semantically_survivable":
    case "traceable":
    case "explainable":
    case "survivable":
    case "reconstructable":
    case "continuous":
    case "version_ready":
    case "reviewable":
    case "observable":
    case "durable":
    case "scalable":
    case "isolated":
    case "resilient":
    case "anti_fragile":
      return 90;
    case "stable":
    case "registry_candidate":
    case "normalized":
    case "operationally_ready":
    case "reliable":
    case "aligned":
      return 76;
    case "conditionally_resilient":
    case "partially_isolated":
    case "partially_survivable":
    case "partially_traceable":
    case "partially_explainable":
    case "partially_reconstructable":
    case "partially_continuous":
    case "partially_version_ready":
    case "partially_reviewable":
    case "partially_normalized":
    case "conditionally_observable":
    case "conditionally_scalable":
    case "conditionally_durable":
    case "mostly_stable":
    case "developing":
    case "forming":
    case "moderate":
    case "pressured":
      return 54;
    case undefined:
      return 42;
    default:
      return 32;
  }
}

function createAreaAssessment(
  params: AreaInput,
): GovernanceLongHorizonInstitutionalResilienceAreaAssessment {
  const score = calculateLongHorizonInstitutionalResilienceAreaScore({
    baseScore: params.baseScore,
    resilienceSignalCount: params.resilienceSignals.length,
    fragilitySignalCount: params.fragilitySignals.length,
    findingCount: params.fragilitySignals.length,
    explainabilityCount:
      params.reasoning.length > 0 ? params.resilienceSignals.length + 1 : params.resilienceSignals.length,
  });

  return {
    area: params.area,
    score,
    classification: longHorizonInstitutionalResilienceClassificationFromScore(score),
    description: params.description,
    resilienceSignals: unique(params.resilienceSignals),
    fragilitySignals: unique(params.fragilitySignals),
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors: unique([...params.resilienceSignals, ...params.fragilitySignals]),
      reasoning: unique([
        params.reasoning,
        params.fragilitySignals.length > 0
          ? "Long-horizon resilience depends on human review of fragile governance signals before future expansion or stress scenarios."
          : "",
      ]),
    },
  };
}

function buildAreaAssessments(
  input: GovernanceLongHorizonInstitutionalResilienceInput,
): GovernanceLongHorizonInstitutionalResilienceAreaAssessment[] {
  const recommendations = getRecommendations(input);
  const resilienceLimitations = contextSignals(input, "resilienceLimitations");

  return [
    createAreaAssessment({
      area: "governance_resilience",
      description:
        "Reviews whether governance structures can absorb long-horizon growth without brittleness, enforcement drift, or review loss.",
      baseScore: average([
        statusScore(input.resilienceResult?.resilienceStatus),
        input.resilienceResult?.governanceResilienceScore ?? 42,
        input.auditResult?.categoryScores.governance_safety ?? 42,
        statusScore(input.multiBusinessTenantIsolationResult?.isolationClassification),
      ]),
      resilienceSignals: [
        ...(input.resilienceResult?.resilienceStrengths ?? []),
        ...(input.auditResult?.governanceSafetyNotes ?? []),
        ...(input.multiBusinessTenantIsolationResult?.durableIsolationAreas ?? []),
      ],
      fragilitySignals: [
        ...(input.resilienceResult?.resilienceWeaknesses ?? []),
        ...(input.resilienceResult?.fragilityIndicators ?? []),
        ...(input.multiBusinessTenantIsolationResult?.governanceBoundaryFindings ?? []),
        ...recommendations
          .filter((recommendation) => recommendation.classification === "Immediate")
          .map((recommendation) => `Immediate governance review item: ${recommendation.recommendation}`),
      ],
      recommendedHumanReview:
        "Review governance resilience, isolation boundaries, and immediate review items before future enterprise expansion.",
      reasoning:
        "Governance resilience improves when governance remains human-reviewed, isolated from execution, and supported by resilience strengths.",
    }),
    createAreaAssessment({
      area: "audit_resilience",
      description:
        "Evaluates whether audit structures can remain reconstructable under long-horizon audit growth and enterprise scaling.",
      baseScore: average([
        statusScore(input.auditHistorySurvivabilityResult?.auditHistoryClassification),
        input.auditHistorySurvivabilityResult?.auditHistorySurvivabilityScore ?? 42,
        input.auditResult?.categoryScores.long_horizon_maintainability ?? 42,
      ]),
      resilienceSignals: [
        ...(input.auditHistorySurvivabilityResult?.durableAuditHistoryAreas ?? []),
        ...(input.auditResult?.strengths ?? []),
      ],
      fragilitySignals: [
        ...(input.auditHistorySurvivabilityResult?.fragileAuditHistoryAreas ?? []),
        ...(input.auditHistorySurvivabilityResult?.governanceHistoryFindings ?? []),
        ...(input.auditHistorySurvivabilityResult?.institutionalAuditabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review audit-history fragility and institutional auditability findings before future audit scaling.",
      reasoning:
        "Audit resilience depends on durable audit history, stable classifications, and reconstructable governance findings.",
    }),
    createAreaAssessment({
      area: "traceability_resilience",
      description:
        "Checks whether traceability structures can withstand long-horizon evidence, lineage, and recommendation growth.",
      baseScore: average([
        statusScore(input.traceabilitySurvivabilityResult?.traceabilitySurvivabilityClassification),
        input.traceabilitySurvivabilityResult?.traceabilitySurvivabilityScore ?? 42,
        input.auditResult?.categoryScores.traceability_integrity ?? 42,
      ]),
      resilienceSignals: [
        ...(input.traceabilitySurvivabilityResult?.durableTraceabilityAreas ?? []),
        ...(input.traceabilityResult?.traceStrengths ?? []),
      ],
      fragilitySignals: [
        ...(input.traceabilitySurvivabilityResult?.fragileTraceabilityAreas ?? []),
        ...(input.traceabilitySurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
        ...(input.traceabilityResult?.evidenceGaps ?? []),
      ],
      recommendedHumanReview:
        "Review fragile traceability areas and evidence gaps before future evidence-chain expansion.",
      reasoning:
        "Traceability resilience improves when evidence, reasoning, lineage, and recommendation links stay reconstructable over time.",
    }),
    createAreaAssessment({
      area: "explainability_resilience",
      description:
        "Reviews whether reasoning, scoring, limitation, and evidence explanation can remain durable under future governance complexity.",
      baseScore: average([
        statusScore(input.explainabilityContinuityResult?.explainabilityContinuityClassification),
        input.explainabilityContinuityResult?.explainabilityContinuityScore ?? 42,
        input.auditResult?.categoryScores.explainability_integrity ?? 42,
      ]),
      resilienceSignals: [
        ...(input.explainabilityContinuityResult?.durableExplainabilityAreas ?? []),
        ...(input.explainabilityContinuityResult?.institutionalExplainabilityFindings ?? []),
      ],
      fragilitySignals: [
        ...(input.explainabilityContinuityResult?.fragileExplainabilityAreas ?? []),
        ...(input.explainabilityContinuityResult?.reasoningContinuityFindings ?? []),
        ...(input.explainabilityContinuityResult?.reconstructionContinuityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review explainability fragility and reconstruction continuity findings before future AI-agent growth.",
      reasoning:
        "Explainability resilience requires durable reasoning structures, visible limitations, and reconstructable scoring explanations.",
    }),
    createAreaAssessment({
      area: "survivability_resilience",
      description:
        "Evaluates whether survivability and expansion structures can remain graceful under future module, AI-agent, and enterprise growth.",
      baseScore: average([
        statusScore(input.survivabilityExpansionResult?.survivabilityClassification),
        statusScore(input.survivabilityExpansionResult?.expansionClassification),
        input.survivabilityExpansionResult?.survivabilityScore ?? 42,
      ]),
      resilienceSignals: [
        ...(input.survivabilityExpansionResult?.durableArchitectureAreas ?? []),
        ...(input.resilienceResult?.antiFragilityIndicators ?? []),
      ],
      fragilitySignals: [
        ...(input.survivabilityExpansionResult?.fragileExpansionAreas ?? []),
        ...(input.survivabilityExpansionResult?.institutionalContinuityFindings ?? []),
        ...(input.survivabilityExpansionResult?.crossIndustrySurvivabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review survivability bottlenecks and cross-industry findings before future enterprise scaling.",
      reasoning:
        "Survivability resilience improves when growth surfaces fragility early and keeps modular review boundaries intact.",
    }),
    createAreaAssessment({
      area: "semantic_resilience",
      description:
        "Reviews whether terminology, classifications, taxonomy, and semantic-version structures remain resilient under future evolution.",
      baseScore: average([
        statusScore(input.semanticStabilityResult?.semanticStabilityClassification),
        statusScore(input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityClassification),
        input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityScore ?? 42,
      ]),
      resilienceSignals: [
        ...(input.semanticStabilityResult?.stableTerms ?? []).map((term) => `Stable term: ${term}`),
        ...(input.semanticVersionSurvivabilityResult?.versionStableSemanticAreas ?? []),
      ],
      fragilitySignals: [
        ...(input.semanticStabilityResult?.driftRisks ?? []),
        ...(input.semanticVersionSurvivabilityResult?.versionFragileSemanticAreas ?? []),
        ...(input.semanticVersionSurvivabilityResult?.taxonomyVersionFindings ?? []),
      ],
      recommendedHumanReview:
        "Review semantic drift and version-fragile semantic areas before future taxonomy growth.",
      reasoning:
        "Semantic resilience depends on stable terminology, version survivability, and reconstructable taxonomy changes.",
    }),
    createAreaAssessment({
      area: "doctrine_resilience",
      description:
        "Evaluates whether doctrine remains durable without centralization, enforcement drift, or brittle principle assumptions.",
      baseScore: average([
        statusScore(input.doctrineDurabilityResult?.doctrineDurabilityClassification),
        input.doctrineDurabilityResult?.doctrineDurabilityScore ?? 42,
        statusScore(input.doctrineResult?.doctrineStatus),
      ]),
      resilienceSignals: [
        ...(input.doctrineDurabilityResult?.durableDoctrineAreas ?? []),
        ...(input.doctrineResult?.durablePatterns ?? []),
      ],
      fragilitySignals: [
        ...(input.doctrineDurabilityResult?.fragileDoctrineAreas ?? []),
        ...(input.doctrineDurabilityResult?.futureGovernanceExpansionRisks ?? []),
        ...(input.doctrineResult?.doctrineLimitations ?? []),
      ],
      recommendedHumanReview:
        "Review doctrine durability and future governance expansion risks before doctrine-dependent scaling.",
      reasoning:
        "Doctrine resilience improves when principles remain neutral, reviewable, durable, and free of enforcement coupling.",
    }),
    createAreaAssessment({
      area: "observability_resilience",
      description:
        "Checks whether governance visibility remains durable through future dashboards, observability growth, and AI-agent expansion.",
      baseScore: average([
        statusScore(input.observabilityDurabilityResult?.observabilityDurabilityClassification),
        statusScore(input.observabilityDurabilityResult?.observabilityScalabilityClassification),
        input.observabilityDurabilityResult?.observabilityDurabilityScore ?? 42,
      ]),
      resilienceSignals: [
        ...(input.observabilityDurabilityResult?.durableObservabilityAreas ?? []),
        ...(input.observabilityDurabilityResult?.institutionalReviewabilityFindings ?? []),
      ],
      fragilitySignals: [
        ...(input.observabilityDurabilityResult?.fragileObservabilityAreas ?? []),
        ...(input.observabilityDurabilityResult?.dashboardDurabilityFindings ?? []),
        ...(input.observabilityDurabilityResult?.crossIndustryObservabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review observability fragility and dashboard durability findings before future visibility expansion.",
      reasoning:
        "Observability resilience depends on durable, boundary-aware visibility that remains human-reviewable across scale.",
    }),
    createAreaAssessment({
      area: "reviewability_resilience",
      description:
        "Reviews whether findings remain understandable, reconstructable, and defensible under long-horizon complexity.",
      baseScore: average([
        statusScore(input.reviewabilityIntegrityResult?.reviewabilityClassification),
        input.reviewabilityIntegrityResult?.reviewabilityIntegrityScore ?? 42,
      ]),
      resilienceSignals: [
        ...(input.reviewabilityIntegrityResult?.reviewableAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.humanReviewFindings ?? []),
      ],
      fragilitySignals: [
        ...(input.reviewabilityIntegrityResult?.weakReviewabilityAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.reconstructionRisks ?? []),
        ...(input.reviewabilityIntegrityResult?.institutionalTrustFindings ?? []),
      ],
      recommendedHumanReview:
        "Review weak reviewability and institutional trust findings before future governance complexity increases.",
      reasoning:
        "Reviewability resilience requires humans to reconstruct evidence, reasoning, limitations, and recommendations over time.",
    }),
    createAreaAssessment({
      area: "institutional_memory_resilience",
      description:
        "Evaluates whether governance memory and audit memory can remain reconstructable through long-horizon institutional complexity.",
      baseScore: average([
        statusScore(input.institutionalMemoryContinuityResult?.memoryContinuityClassification),
        input.institutionalMemoryContinuityResult?.institutionalMemoryContinuityScore ?? 42,
        statusScore(input.memoryResult?.institutionalMemoryStatus),
      ]),
      resilienceSignals: [
        ...(input.institutionalMemoryContinuityResult?.durableMemoryAreas ?? []),
        ...(input.memoryResult?.longHorizonContext ?? []),
      ],
      fragilitySignals: [
        ...(input.institutionalMemoryContinuityResult?.fragileMemoryAreas ?? []),
        ...(input.institutionalMemoryContinuityResult?.governanceHistoryReconstructionFindings ?? []),
        ...(input.institutionalMemoryContinuityResult?.lineageReconstructionFindings ?? []),
      ],
      recommendedHumanReview:
        "Review institutional memory gaps and reconstruction findings before future long-horizon memory work.",
      reasoning:
        "Institutional memory resilience depends on durable memory areas, lineage reconstruction, and governance-history continuity.",
    }),
    createAreaAssessment({
      area: "lifecycle_resilience",
      description:
        "Reviews whether lifecycle continuity survives future compatibility, versioning, migration, and governance evolution.",
      baseScore: average([
        statusScore(input.lifecycleContinuityResult?.lifecycleContinuityClassification),
        input.lifecycleContinuityResult?.lifecycleContinuityScore ?? 42,
        statusScore(input.versioningReadinessResult?.versioningReadinessClassification),
      ]),
      resilienceSignals: [
        ...(input.lifecycleContinuityResult?.durableContinuityAreas ?? []),
        ...(input.versioningReadinessResult?.stableVersionReadyAreas ?? []),
      ],
      fragilitySignals: [
        ...(input.lifecycleContinuityResult?.fragileContinuityAreas ?? []),
        ...(input.lifecycleContinuityResult?.migrationContinuityFindings ?? []),
        ...(input.versioningReadinessResult?.migrationRiskFindings ?? []),
      ],
      recommendedHumanReview:
        "Review lifecycle fragility, versioning readiness, and migration continuity before future governance evolution.",
      reasoning:
        "Lifecycle resilience improves when compatibility, versioning, migration, and continuity remain explicit and reviewable.",
    }),
    createAreaAssessment({
      area: "reconstruction_resilience",
      description:
        "Checks whether governance history, audit history, lineage, traceability, and explainability can be reconstructed over time.",
      baseScore: average([
        statusScore(input.traceabilitySurvivabilityResult?.traceabilitySurvivabilityClassification),
        statusScore(input.auditHistorySurvivabilityResult?.auditHistoryClassification),
        statusScore(input.reviewabilityIntegrityResult?.reviewabilityClassification),
      ]),
      resilienceSignals: [
        ...(input.traceabilitySurvivabilityResult?.durableTraceabilityAreas ?? []),
        ...(input.auditHistorySurvivabilityResult?.durableAuditHistoryAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.reviewableAreas ?? []),
      ],
      fragilitySignals: [
        ...(input.traceabilitySurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
        ...(input.auditHistorySurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
        ...(input.multiBusinessTenantIsolationResult?.reconstructionIsolationFindings ?? []),
      ],
      recommendedHumanReview:
        "Review reconstruction survivability and isolation findings before relying on long-horizon history reconstruction.",
      reasoning:
        "Reconstruction resilience requires durable audit history, traceability, reviewability, and isolation boundaries.",
    }),
    createAreaAssessment({
      area: "compatibility_resilience",
      description:
        "Evaluates whether compatibility expectations remain resilient under semantic-version, taxonomy, and registry evolution.",
      baseScore: average([
        input.compatibilityMigrationContext?.compatibilityScore ?? 42,
        statusScore(input.compatibilityMigrationContext?.compatibilityClassification),
        statusScore(input.versioningReadinessResult?.versioningReadinessClassification),
      ]),
      resilienceSignals: [
        ...(input.compatibilityMigrationContext?.humanReviewNotes ?? []),
        ...(input.versioningReadinessResult?.stableVersionReadyAreas ?? []),
      ],
      fragilitySignals: [
        ...(input.compatibilityMigrationContext?.compatibilityFindings ?? []),
        ...(input.versioningReadinessResult?.compatibilityFindings ?? []),
        ...(input.semanticVersionSurvivabilityResult?.backwardCompatibilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review compatibility findings before future semantic-version or registry evolution.",
      reasoning:
        "Compatibility resilience depends on explicit backward-compatibility expectations and human-reviewed versioning boundaries.",
    }),
    createAreaAssessment({
      area: "migration_survivability_resilience",
      description:
        "Reviews whether migration survivability remains durable under future governance evolution and continuity disruption scenarios.",
      baseScore: average([
        input.compatibilityMigrationContext?.migrationSurvivabilityScore ?? 42,
        statusScore(input.compatibilityMigrationContext?.migrationClassification),
        statusScore(input.lifecycleContinuityResult?.lifecycleContinuityClassification),
      ]),
      resilienceSignals: [
        ...(input.compatibilityMigrationContext?.futureStabilizationRecommendations ?? []),
        ...contextSignals(input, "continuityDisruptionScenarios").map(
          (scenario) => `Continuity disruption scenario reviewed: ${scenario}`,
        ),
      ],
      fragilitySignals: [
        ...(input.compatibilityMigrationContext?.migrationFindings ?? []),
        ...(input.versioningReadinessResult?.migrationRiskFindings ?? []),
        ...contextSignals(input, "resilienceLimitations"),
      ],
      recommendedHumanReview:
        "Review migration findings and continuity disruption scenarios before future migration planning.",
      reasoning:
        "Migration survivability resilience improves when migration risks, disruption scenarios, and stabilization recommendations remain explicit.",
    }),
  ].map((assessment) => ({
    ...assessment,
    resilienceSignals: unique([
      ...assessment.resilienceSignals,
      horizonSignal(input) ?? "",
      ...contextSignals(input, "longHorizonAssumptions").map((assumption) => `Assumption: ${assumption}`),
    ]),
    fragilitySignals: unique([...assessment.fragilitySignals, ...resilienceLimitations]),
  }));
}

function severityFor(
  findingType: GovernanceLongHorizonInstitutionalResilienceFindingType,
  evidenceCount: number,
): ReputationSeverity {
  if (
    findingType === "governance_brittleness" ||
    findingType === "survivability_collapse_risk" ||
    findingType === "long_horizon_resilience_fragility" ||
    findingType === "institutional_survivability_degradation"
  ) {
    return evidenceCount >= 4 ? "elevated" : "moderate";
  }

  return evidenceCount >= 4 ? "moderate" : "low";
}

function createFinding(params: {
  type: GovernanceLongHorizonInstitutionalResilienceFindingType;
  area: GovernanceLongHorizonInstitutionalResilienceArea;
  description: string;
  evidence: string[];
  affectedAuditCategories?: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
}): GovernanceLongHorizonInstitutionalResilienceFinding {
  const evidence = unique(params.evidence);
  const confidenceScore = calculateLongHorizonInstitutionalResilienceFindingConfidence({
    evidenceCount: evidence.length,
    factorCount: 2 + (params.recommendedHumanReview.length > 0 ? 1 : 0),
  });

  return {
    id: `long-horizon-resilience-${slug(params.type)}-${slug(params.description)}`,
    findingType: params.type,
    area: params.area,
    severity: severityFor(params.type, evidence.length),
    description: params.description,
    evidence,
    affectedAuditCategories: unique(params.affectedAuditCategories ?? []) as FullSystemGovernanceAuditCategory[],
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore,
    explainability: {
      factors: evidence,
      reasoning: unique([
        "This finding is produced from deterministic read-only long-horizon resilience checks across supplied governance review outputs and resilience context.",
        evidence.length === 0
          ? "Finding confidence is limited because supporting long-horizon resilience evidence was not supplied."
          : "",
      ]),
    },
  };
}

function buildFindings(
  input: GovernanceLongHorizonInstitutionalResilienceInput,
): GovernanceLongHorizonInstitutionalResilienceFinding[] {
  const categories = auditCategories(input);
  const findings: GovernanceLongHorizonInstitutionalResilienceFinding[] = [];
  const missingContext = missingResilienceContext(input);
  const reconstructionRisks = unique([
    ...(input.traceabilitySurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
    ...(input.auditHistorySurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
    ...(input.reviewabilityIntegrityResult?.reconstructionRisks ?? []),
    ...(input.institutionalMemoryContinuityResult?.governanceHistoryReconstructionFindings ?? []),
    ...(input.multiBusinessTenantIsolationResult?.reconstructionIsolationFindings ?? []),
  ]);

  if (
    !input.resilienceResult ||
    input.resilienceResult.resilienceStatus === "fragile" ||
    input.resilienceResult.resilienceStatus === "pressured" ||
    input.resilienceResult.fragilityIndicators.length > 0
  ) {
    findings.push(
      createFinding({
        type: "governance_brittleness",
        area: "governance_resilience",
        description:
          "Governance resilience appears brittle or pressured under supplied long-horizon context.",
        evidence: [
          input.resilienceResult
            ? `Governance resilience status: ${input.resilienceResult.resilienceStatus}`
            : "Governance resilience result was not supplied.",
          ...(input.resilienceResult?.fragilityIndicators ?? []),
          ...(input.resilienceResult?.resilienceWeaknesses ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review governance fragility indicators before future enterprise expansion or operational stress scenarios.",
      }),
    );
  }

  if (
    !input.survivabilityExpansionResult ||
    input.survivabilityExpansionResult.survivabilityClassification === "fragile" ||
    input.survivabilityExpansionResult.fragileExpansionAreas.length > 0
  ) {
    findings.push(
      createFinding({
        type: "survivability_collapse_risk",
        area: "survivability_resilience",
        description:
          "Survivability resilience needs stronger expansion evidence before future module, AI-agent, or enterprise scaling.",
        evidence: [
          input.survivabilityExpansionResult
            ? `Survivability classification: ${input.survivabilityExpansionResult.survivabilityClassification}`
            : "Survivability expansion result was not supplied.",
          ...(input.survivabilityExpansionResult?.fragileExpansionAreas ?? []),
          ...(input.survivabilityExpansionResult?.institutionalContinuityFindings ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review fragile expansion areas before relying on long-horizon survivability.",
      }),
    );
  }

  if (
    missingContext.length > 0 ||
    contextSignals(input, "operationalStressScenarios").length === 0 ||
    contextSignals(input, "continuityDisruptionScenarios").length === 0
  ) {
    findings.push(
      createFinding({
        type: "resilience_degradation_risk",
        area: "governance_resilience",
        description:
          "Long-horizon resilience confidence is limited by missing operational stress or continuity disruption context.",
        evidence: missingContext,
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review long-horizon assumptions, operational stress scenarios, and continuity disruption scenarios before future resilience planning.",
      }),
    );
  }

  if (
    !input.auditHistorySurvivabilityResult ||
    input.auditHistorySurvivabilityResult.auditHistoryClassification === "fragmented" ||
    input.auditHistorySurvivabilityResult.auditHistoryClassification === "partially_survivable" ||
    input.auditHistorySurvivabilityResult.fragileAuditHistoryAreas.length > 0
  ) {
    findings.push(
      createFinding({
        type: "audit_resilience_weakness",
        area: "audit_resilience",
        description:
          "Audit resilience needs stronger audit-history survivability for long-horizon reconstruction.",
        evidence: [
          input.auditHistorySurvivabilityResult
            ? `Audit-history classification: ${input.auditHistorySurvivabilityResult.auditHistoryClassification}`
            : "Audit-history survivability result was not supplied.",
          ...(input.auditHistorySurvivabilityResult?.fragileAuditHistoryAreas ?? []),
          ...(input.auditHistorySurvivabilityResult?.institutionalAuditabilityFindings ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review audit-history fragility and institutional auditability before long-horizon audit growth.",
      }),
    );
  }

  if (
    !input.explainabilityContinuityResult ||
    input.explainabilityContinuityResult.explainabilityContinuityClassification === "opaque" ||
    input.explainabilityContinuityResult.explainabilityContinuityClassification === "partially_explainable" ||
    input.explainabilityContinuityResult.fragileExplainabilityAreas.length > 0
  ) {
    findings.push(
      createFinding({
        type: "explainability_resilience_weakness",
        area: "explainability_resilience",
        description:
          "Explainability resilience needs stronger reasoning continuity before future AI-agent or governance complexity.",
        evidence: [
          input.explainabilityContinuityResult
            ? `Explainability continuity classification: ${input.explainabilityContinuityResult.explainabilityContinuityClassification}`
            : "Explainability continuity result was not supplied.",
          ...(input.explainabilityContinuityResult?.fragileExplainabilityAreas ?? []),
          ...(input.explainabilityContinuityResult?.reasoningContinuityFindings ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review explainability continuity and reasoning reconstruction before future AI-agent expansion.",
      }),
    );
  }

  if (
    !input.traceabilitySurvivabilityResult ||
    input.traceabilitySurvivabilityResult.traceabilitySurvivabilityClassification === "collapsed" ||
    input.traceabilitySurvivabilityResult.traceabilitySurvivabilityClassification === "partially_traceable" ||
    input.traceabilitySurvivabilityResult.fragileTraceabilityAreas.length > 0
  ) {
    findings.push(
      createFinding({
        type: "traceability_resilience_weakness",
        area: "traceability_resilience",
        description:
          "Traceability resilience needs stronger evidence, lineage, and recommendation linkage survivability.",
        evidence: [
          input.traceabilitySurvivabilityResult
            ? `Traceability survivability classification: ${input.traceabilitySurvivabilityResult.traceabilitySurvivabilityClassification}`
            : "Traceability survivability result was not supplied.",
          ...(input.traceabilitySurvivabilityResult?.fragileTraceabilityAreas ?? []),
          ...(input.traceabilitySurvivabilityResult?.evidenceLinkageFindings ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review traceability fragility and evidence linkage before future evidence-chain expansion.",
      }),
    );
  }

  if (
    !input.semanticVersionSurvivabilityResult ||
    input.semanticVersionSurvivabilityResult.semanticVersionSurvivabilityClassification ===
      "version_fragile" ||
    input.semanticVersionSurvivabilityResult.versionFragileSemanticAreas.length > 0
  ) {
    findings.push(
      createFinding({
        type: "semantic_resilience_instability",
        area: "semantic_resilience",
        description:
          "Semantic resilience needs stronger semantic-version survivability and stable terminology before future taxonomy growth.",
        evidence: [
          input.semanticVersionSurvivabilityResult
            ? `Semantic-version survivability classification: ${input.semanticVersionSurvivabilityResult.semanticVersionSurvivabilityClassification}`
            : "Semantic-version survivability result was not supplied.",
          ...(input.semanticVersionSurvivabilityResult?.versionFragileSemanticAreas ?? []),
          ...(input.semanticStabilityResult?.driftRisks ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review semantic-version fragility and terminology drift before future semantic evolution.",
      }),
    );
  }

  if (
    !input.doctrineDurabilityResult ||
    input.doctrineDurabilityResult.doctrineDurabilityClassification === "fragile" ||
    input.doctrineDurabilityResult.fragileDoctrineAreas.length > 0
  ) {
    findings.push(
      createFinding({
        type: "doctrine_resilience_weakness",
        area: "doctrine_resilience",
        description:
          "Doctrine resilience needs stronger durability evidence before future governance evolution.",
        evidence: [
          input.doctrineDurabilityResult
            ? `Doctrine durability classification: ${input.doctrineDurabilityResult.doctrineDurabilityClassification}`
            : "Doctrine durability result was not supplied.",
          ...(input.doctrineDurabilityResult?.fragileDoctrineAreas ?? []),
          ...(input.doctrineDurabilityResult?.futureGovernanceExpansionRisks ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review doctrine durability and expansion risks before doctrine-dependent scaling.",
      }),
    );
  }

  if (
    !input.lifecycleContinuityResult ||
    input.lifecycleContinuityResult.lifecycleContinuityClassification === "discontinuous" ||
    input.lifecycleContinuityResult.lifecycleContinuityClassification === "partially_continuous" ||
    input.lifecycleContinuityResult.fragileContinuityAreas.length > 0
  ) {
    findings.push(
      createFinding({
        type: "institutional_continuity_risk",
        area: "lifecycle_resilience",
        description:
          "Institutional continuity may weaken under long-horizon governance evolution without stronger lifecycle continuity.",
        evidence: [
          input.lifecycleContinuityResult
            ? `Lifecycle continuity classification: ${input.lifecycleContinuityResult.lifecycleContinuityClassification}`
            : "Lifecycle continuity result was not supplied.",
          ...(input.lifecycleContinuityResult?.fragileContinuityAreas ?? []),
          ...(input.lifecycleContinuityResult?.institutionalMemoryFindings ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review lifecycle continuity and institutional memory findings before future governance evolution.",
      }),
    );
  }

  if (reconstructionRisks.length > 0) {
    findings.push(
      createFinding({
        type: "reconstruction_survivability_weakness",
        area: "reconstruction_resilience",
        description:
          "Long-horizon reconstruction resilience needs stronger evidence across traceability, audit history, memory, and isolation outputs.",
        evidence: reconstructionRisks,
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review reconstruction risks before relying on long-horizon governance history reconstruction.",
      }),
    );
  }

  if (
    missingContext.length >= 3 ||
    contextSignals(input, "resilienceLimitations").length > 0 ||
    input.multiBusinessTenantIsolationResult?.isolationClassification === "contaminated" ||
    input.multiBusinessTenantIsolationResult?.isolationClassification === "partially_isolated"
  ) {
    findings.push(
      createFinding({
        type: "long_horizon_resilience_fragility",
        area: "survivability_resilience",
        description:
          "Long-horizon resilience remains fragile without stronger stress, isolation, and limitation context.",
        evidence: [
          ...missingContext,
          ...contextSignals(input, "resilienceLimitations"),
          ...(input.multiBusinessTenantIsolationResult?.fragileIsolationAreas ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review long-horizon assumptions, resilience limitations, and isolation fragility before future expansion.",
      }),
    );
  }

  if (
    (input.auditResult?.orchestrationContaminationRisks.length ?? 0) > 0 ||
    (input.auditResult?.hiddenExecutionPathwayRisks.length ?? 0) > 0 ||
    (input.multiBusinessTenantIsolationResult?.findings ?? []).some(
      (finding) => finding.findingType === "orchestration_boundary_weakness",
    )
  ) {
    findings.push(
      createFinding({
        type: "orchestration_resilience_risk",
        area: "governance_resilience",
        description:
          "Orchestration resilience depends on continued separation from execution pathways and workflow mutation.",
        evidence: [
          ...(input.auditResult?.orchestrationContaminationRisks ?? []),
          ...(input.auditResult?.hiddenExecutionPathwayRisks ?? []),
          ...(input.multiBusinessTenantIsolationResult?.findings ?? [])
            .filter((finding) => finding.findingType === "orchestration_boundary_weakness")
            .map((finding) => finding.description),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review orchestration contamination and hidden execution risks before future AI-agent orchestration growth.",
      }),
    );
  }

  if (
    !input.institutionalMemoryContinuityResult ||
    input.institutionalMemoryContinuityResult.memoryContinuityClassification === "fragmented" ||
    input.institutionalMemoryContinuityResult.fragileMemoryAreas.length > 0 ||
    input.auditResult?.auditClassification === "critical_risk"
  ) {
    findings.push(
      createFinding({
        type: "institutional_survivability_degradation",
        area: "institutional_memory_resilience",
        description:
          "Institutional survivability may degrade without stronger memory continuity, audit stability, and reconstruction evidence.",
        evidence: [
          input.institutionalMemoryContinuityResult
            ? `Memory continuity classification: ${input.institutionalMemoryContinuityResult.memoryContinuityClassification}`
            : "Institutional memory continuity result was not supplied.",
          ...(input.institutionalMemoryContinuityResult?.fragileMemoryAreas ?? []),
          input.auditResult ? `Audit classification: ${input.auditResult.auditClassification}` : "",
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review institutional memory continuity and audit stability before long-horizon governance expansion.",
      }),
    );
  }

  return findings;
}

function buildHumanReviewNotes(
  input: GovernanceLongHorizonInstitutionalResilienceInput,
  findings: GovernanceLongHorizonInstitutionalResilienceFinding[],
): string[] {
  return unique([
    "Human review is required before any long-horizon resilience, migration, orchestration, or enterprise expansion decision.",
    "This review is read-only and does not create resilience enforcement, persistence, orchestration, or automation.",
    ...findings.map((finding) => finding.recommendedHumanReview),
    ...(input.multiBusinessTenantIsolationResult?.humanReviewNotes ?? []),
    ...(input.traceabilitySurvivabilityResult?.humanReviewNotes ?? []),
    ...(input.explainabilityContinuityResult?.humanReviewNotes ?? []),
    ...(input.lifecycleContinuityResult?.humanReviewNotes ?? []),
    ...(input.auditHistorySurvivabilityResult?.humanReviewNotes ?? []),
  ]);
}

function buildFutureStabilizationRecommendations(
  input: GovernanceLongHorizonInstitutionalResilienceInput,
  findings: GovernanceLongHorizonInstitutionalResilienceFinding[],
): string[] {
  return unique([
    missingResilienceContext(input).length > 0
      ? `Review missing long-horizon resilience context: ${missingResilienceContext(input).join(", ")}.`
      : "",
    "Preserve long-horizon resilience as a read-only review concern until explicit resilience infrastructure is approved.",
    "Preserve shared deterministic utility extraction as a future upgrade after governance review modules stabilize.",
    "Prepare Governance Final Stability Consolidation Review as the next read-only stage.",
    ...findings.map((finding) => finding.recommendedHumanReview),
    ...(input.survivabilityExpansionResult?.futureStabilizationRecommendations ?? []),
    ...(input.multiBusinessTenantIsolationResult?.futureStabilizationRecommendations ?? []),
    ...(input.lifecycleContinuityResult?.futureStabilizationRecommendations ?? []),
  ]);
}

export function runGovernanceLongHorizonInstitutionalResilienceReview(
  input: GovernanceLongHorizonInstitutionalResilienceInput,
): GovernanceLongHorizonInstitutionalResilienceResult {
  const areaAssessments = buildAreaAssessments(input);
  const findings = buildFindings(input);
  const institutionalResilienceScore = calculateOverallLongHorizonInstitutionalResilienceScore({
    areaAssessments,
    findings,
  });
  const resilienceClassification =
    longHorizonInstitutionalResilienceClassificationFromScore(institutionalResilienceScore);

  const resultWithoutExplainability: Omit<
    GovernanceLongHorizonInstitutionalResilienceResult,
    "explainability"
  > = {
    institutionalResilienceScore,
    resilienceClassification,
    areaAssessments,
    findings,
    resilientGovernanceAreas: areaAssessments
      .filter((area) => ["resilient", "institutionally_resilient"].includes(area.classification))
      .map((area) => `${area.area}: ${area.classification} at ${area.score}/100`),
    fragileGovernanceAreas: areaAssessments
      .filter((area) => ["brittle", "conditionally_resilient"].includes(area.classification))
      .map((area) => `${area.area}: ${area.classification} at ${area.score}/100`),
    governanceResilienceFindings: findings
      .filter((finding) =>
        ["governance_brittleness", "resilience_degradation_risk"].includes(finding.findingType),
      )
      .map((finding) => finding.description),
    auditResilienceFindings: findings
      .filter((finding) => finding.findingType === "audit_resilience_weakness")
      .map((finding) => finding.description),
    traceabilityResilienceFindings: findings
      .filter((finding) => finding.findingType === "traceability_resilience_weakness")
      .map((finding) => finding.description),
    explainabilityResilienceFindings: findings
      .filter((finding) => finding.findingType === "explainability_resilience_weakness")
      .map((finding) => finding.description),
    semanticResilienceFindings: findings
      .filter((finding) => finding.findingType === "semantic_resilience_instability")
      .map((finding) => finding.description),
    doctrineResilienceFindings: findings
      .filter((finding) => finding.findingType === "doctrine_resilience_weakness")
      .map((finding) => finding.description),
    observabilityResilienceFindings: findings
      .filter((finding) => finding.area === "observability_resilience")
      .map((finding) => finding.description),
    reconstructionResilienceFindings: findings
      .filter((finding) => finding.findingType === "reconstruction_survivability_weakness")
      .map((finding) => finding.description),
    institutionalContinuityFindings: findings
      .filter((finding) =>
        ["institutional_continuity_risk", "institutional_survivability_degradation"].includes(
          finding.findingType,
        ),
      )
      .map((finding) => finding.description),
    longHorizonSurvivabilityFindings: findings
      .filter((finding) =>
        [
          "survivability_collapse_risk",
          "long_horizon_resilience_fragility",
          "orchestration_resilience_risk",
          "institutional_survivability_degradation",
        ].includes(finding.findingType),
      )
      .map((finding) => finding.description),
    humanReviewNotes: buildHumanReviewNotes(input, findings),
    futureStabilizationRecommendations: buildFutureStabilizationRecommendations(input, findings),
    humanReviewRequired:
      findings.length > 0 ||
      areaAssessments.some((area) => ["brittle", "conditionally_resilient"].includes(area.classification)),
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernanceLongHorizonInstitutionalResilienceExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}
