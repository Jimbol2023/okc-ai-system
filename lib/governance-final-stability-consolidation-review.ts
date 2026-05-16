import { buildGovernanceFinalStabilityConsolidationExplainability } from "./governance-final-stability-consolidation-review-explainability";
import {
  calculateFinalGovernanceStabilityAreaScore,
  calculateFinalGovernanceStabilityFindingConfidence,
  calculateOverallFinalGovernanceStabilityScore,
  finalGovernanceStabilityClassificationFromScore,
} from "./governance-final-stability-consolidation-review-scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
} from "./full-system-governance-audit-types";
import type {
  GovernanceFinalStabilityArea,
  GovernanceFinalStabilityAreaAssessment,
  GovernanceFinalStabilityConsolidationInput,
  GovernanceFinalStabilityConsolidationResult,
  GovernanceFinalStabilityFinding,
  GovernanceFinalStabilityFindingType,
} from "./governance-final-stability-consolidation-review-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

type AreaInput = {
  area: GovernanceFinalStabilityArea;
  description: string;
  baseScore: number;
  stabilitySignals: string[];
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
  return normalize(value).slice(0, 72) || "final_stability";
}

function average(values: number[]): number {
  const usableValues = values.filter((value) => Number.isFinite(value));
  if (usableValues.length === 0) {
    return 50;
  }

  return usableValues.reduce((sum, value) => sum + value, 0) / usableValues.length;
}

function statusScore(status?: string): number {
  switch (status) {
    case "institutionally_stable":
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
    case "stable":
    case "anti_fragile":
      return 90;
    case "registry_candidate":
    case "normalized":
    case "operationally_ready":
    case "reliable":
    case "aligned":
      return 76;
    case "partially_stable":
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

function getAuditFindings(
  input: GovernanceFinalStabilityConsolidationInput,
): FullSystemGovernanceAuditFinding[] {
  return [...(input.auditFindings ?? []), ...(input.auditResult?.findings ?? [])];
}

function getRecommendations(
  input: GovernanceFinalStabilityConsolidationInput,
): FullSystemGovernanceAuditRecommendation[] {
  return [...(input.recommendations ?? []), ...(input.auditResult?.recommendations ?? [])];
}

function auditCategories(input: GovernanceFinalStabilityConsolidationInput): FullSystemGovernanceAuditCategory[] {
  return unique(
    getAuditFindings(input)
      .map((finding) => finding.category)
      .concat(Object.keys(input.auditResult?.categoryScores ?? {}) as FullSystemGovernanceAuditCategory[]),
  ) as FullSystemGovernanceAuditCategory[];
}

function createAreaAssessment(params: AreaInput): GovernanceFinalStabilityAreaAssessment {
  const score = calculateFinalGovernanceStabilityAreaScore({
    baseScore: params.baseScore,
    stabilitySignalCount: params.stabilitySignals.length,
    fragilitySignalCount: params.fragilitySignals.length,
    findingCount: params.fragilitySignals.length,
    explainabilityCount:
      params.reasoning.length > 0 ? params.stabilitySignals.length + 1 : params.stabilitySignals.length,
  });

  return {
    area: params.area,
    score,
    classification: finalGovernanceStabilityClassificationFromScore(score),
    description: params.description,
    stabilitySignals: unique(params.stabilitySignals),
    fragilitySignals: unique(params.fragilitySignals),
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors: unique([...params.stabilitySignals, ...params.fragilitySignals]),
      reasoning: unique([
        params.reasoning,
        params.fragilitySignals.length > 0
          ? "Final stability depends on human review of fragile subsystem signals before any architecture-freeze decision."
          : "",
      ]),
    },
  };
}

function buildAreaAssessments(
  input: GovernanceFinalStabilityConsolidationInput,
): GovernanceFinalStabilityAreaAssessment[] {
  const recommendations = getRecommendations(input);

  return [
    createAreaAssessment({
      area: "governance_readiness",
      description:
        "Consolidates governance readiness, assurance, alignment, and governance safety into a final stability view.",
      baseScore: average([
        input.readinessResult?.overallReadinessScore ?? 42,
        input.assuranceResult?.governanceAssuranceScore ?? 42,
        input.alignmentResult?.governanceAlignmentScore ?? 42,
        input.auditResult?.categoryScores.governance_safety ?? 42,
      ]),
      stabilitySignals: [
        ...(input.readinessResult?.strengths ?? []),
        ...(input.assuranceResult?.assuranceStrengths ?? []),
        ...(input.alignmentResult?.alignmentStrengths ?? []),
        ...(input.auditResult?.governanceSafetyNotes ?? []),
      ],
      fragilitySignals: [
        ...(input.readinessResult?.weaknesses ?? []),
        ...(input.assuranceResult?.assuranceWeaknesses ?? []),
        ...(input.alignmentResult?.alignmentGaps ?? []),
        ...recommendations
          .filter((recommendation) => recommendation.classification === "Immediate")
          .map((recommendation) => `Immediate review recommendation: ${recommendation.recommendation}`),
      ],
      recommendedHumanReview:
        "Review readiness, assurance, alignment, and governance safety findings before stability consolidation is treated as durable.",
      reasoning:
        "Governance readiness is stable when assurance, alignment, and safety signals reinforce the same human-review posture.",
    }),
    createAreaAssessment({
      area: "auditability",
      description:
        "Consolidates full-system auditability and audit-history survivability into a final audit stability view.",
      baseScore: average([
        input.auditResult?.overallAuditScore ?? 42,
        input.auditHistorySurvivabilityResult?.auditHistorySurvivabilityScore ?? 42,
        input.auditResult?.categoryScores.enterprise_durability ?? 42,
      ]),
      stabilitySignals: [
        ...(input.auditResult?.strengths ?? []),
        ...(input.auditHistorySurvivabilityResult?.durableAuditHistoryAreas ?? []),
        ...(input.auditResult?.architectureObservations ?? []),
      ],
      fragilitySignals: [
        ...(input.auditResult?.weaknesses ?? []),
        ...(input.auditResult?.risks ?? []),
        ...(input.auditHistorySurvivabilityResult?.fragileAuditHistoryAreas ?? []),
        ...(input.auditHistorySurvivabilityResult?.institutionalAuditabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review audit weaknesses, risks, and audit-history fragility before final governance stability claims.",
      reasoning:
        "Auditability is stable when full-system audit results and audit-history survivability remain reconstructable and durable.",
    }),
    createAreaAssessment({
      area: "traceability",
      description:
        "Consolidates traceability contract strength, traceability survivability, and evidence-chain durability.",
      baseScore: average([
        input.traceabilityResult?.traceabilityScore ?? 42,
        input.traceabilitySurvivabilityResult?.traceabilitySurvivabilityScore ?? 42,
        input.auditResult?.categoryScores.traceability_integrity ?? 42,
      ]),
      stabilitySignals: [
        ...(input.traceabilityResult?.traceStrengths ?? []),
        ...(input.traceabilitySurvivabilityResult?.durableTraceabilityAreas ?? []),
      ],
      fragilitySignals: [
        ...(input.traceabilityResult?.traceWeaknesses ?? []),
        ...(input.traceabilityResult?.missingLinks ?? []),
        ...(input.traceabilitySurvivabilityResult?.fragileTraceabilityAreas ?? []),
        ...(input.traceabilitySurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review missing links, trace weaknesses, and reconstruction survivability findings before final stability closure.",
      reasoning:
        "Traceability stability depends on evidence, reasoning, lineage, and recommendation links remaining reconstructable.",
    }),
    createAreaAssessment({
      area: "explainability",
      description:
        "Consolidates explainability integrity, reasoning continuity, scoring visibility, and limitation visibility.",
      baseScore: average([
        input.explainabilityContinuityResult?.explainabilityContinuityScore ?? 42,
        input.auditResult?.categoryScores.explainability_integrity ?? 42,
      ]),
      stabilitySignals: [
        ...(input.explainabilityContinuityResult?.durableExplainabilityAreas ?? []),
        ...(input.explainabilityContinuityResult?.institutionalExplainabilityFindings ?? []),
      ],
      fragilitySignals: [
        ...(input.explainabilityContinuityResult?.fragileExplainabilityAreas ?? []),
        ...(input.explainabilityContinuityResult?.reasoningContinuityFindings ?? []),
        ...(input.explainabilityContinuityResult?.reconstructionContinuityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review explainability fragility and reasoning continuity findings before final consolidation.",
      reasoning:
        "Explainability stability requires transparent reasoning, visible limitations, and deterministic score explanations.",
    }),
    createAreaAssessment({
      area: "survivability",
      description:
        "Consolidates survivability expansion and long-horizon institutional resilience into a final survivability view.",
      baseScore: average([
        input.survivabilityExpansionResult?.survivabilityScore ?? 42,
        input.longHorizonInstitutionalResilienceResult?.institutionalResilienceScore ?? 42,
        input.auditResult?.categoryScores.enterprise_durability ?? 42,
      ]),
      stabilitySignals: [
        ...(input.survivabilityExpansionResult?.durableArchitectureAreas ?? []),
        ...(input.longHorizonInstitutionalResilienceResult?.resilientGovernanceAreas ?? []),
      ],
      fragilitySignals: [
        ...(input.survivabilityExpansionResult?.fragileExpansionAreas ?? []),
        ...(input.survivabilityExpansionResult?.institutionalContinuityFindings ?? []),
        ...(input.longHorizonInstitutionalResilienceResult?.fragileGovernanceAreas ?? []),
        ...(input.longHorizonInstitutionalResilienceResult?.longHorizonSurvivabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review survivability gaps and long-horizon resilience findings before considering the governance stack stable.",
      reasoning:
        "Survivability stability improves when architecture, expansion, and long-horizon resilience reviews agree.",
    }),
    createAreaAssessment({
      area: "continuity",
      description:
        "Consolidates governance continuity, lifecycle continuity, compatibility, and migration continuity.",
      baseScore: average([
        input.continuityResult?.governanceContinuityScore ?? 42,
        input.lifecycleContinuityResult?.lifecycleContinuityScore ?? 42,
        input.compatibilityMigrationContext?.compatibilityScore ?? 42,
      ]),
      stabilitySignals: [
        ...(input.continuityResult?.continuityStrengths ?? []),
        ...(input.lifecycleContinuityResult?.durableContinuityAreas ?? []),
        ...(input.compatibilityMigrationContext?.humanReviewNotes ?? []),
      ],
      fragilitySignals: [
        ...(input.continuityResult?.continuityWeaknesses ?? []),
        ...(input.lifecycleContinuityResult?.fragileContinuityAreas ?? []),
        ...(input.lifecycleContinuityResult?.migrationContinuityFindings ?? []),
        ...(input.compatibilityMigrationContext?.compatibilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review continuity weaknesses, compatibility findings, and migration continuity findings before final stabilization.",
      reasoning:
        "Continuity stability requires governance, lifecycle, compatibility, and migration signals to remain durable over time.",
    }),
    createAreaAssessment({
      area: "semantic_stability",
      description:
        "Consolidates semantic stability, semantic-version survivability, registry readiness, and normalization consistency.",
      baseScore: average([
        statusScore(input.semanticStabilityResult?.semanticStabilityClassification),
        input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityScore ?? 42,
        input.normalizationResult?.normalizationScore ?? 42,
      ]),
      stabilitySignals: [
        ...(input.semanticStabilityResult?.stableTerms ?? []).map((term) => `Stable term: ${term}`),
        ...(input.semanticVersionSurvivabilityResult?.versionStableSemanticAreas ?? []),
        ...(input.normalizationResult?.principleMappingStrength ?? []),
      ],
      fragilitySignals: [
        ...(input.semanticStabilityResult?.unstableTerms ?? []).map((term) => `Unstable term: ${term}`),
        ...(input.semanticStabilityResult?.driftRisks ?? []),
        ...(input.semanticVersionSurvivabilityResult?.versionFragileSemanticAreas ?? []),
        ...(input.normalizationResult?.governanceSemanticDriftRisks ?? []),
      ],
      recommendedHumanReview:
        "Review semantic drift, unstable terminology, and normalization drift before final stability closure.",
      reasoning:
        "Semantic stability requires terminology, taxonomy, and normalization mappings to remain deterministic and reconstructable.",
    }),
    createAreaAssessment({
      area: "doctrine_durability",
      description:
        "Consolidates doctrine durability, doctrine confidence, doctrine semantics, and principle consistency.",
      baseScore: average([
        input.doctrineDurabilityResult?.doctrineDurabilityScore ?? 42,
        input.doctrineResult?.doctrineConfidenceScore ?? 42,
        statusScore(input.doctrineDurabilityResult?.doctrineDurabilityClassification),
      ]),
      stabilitySignals: [
        ...(input.doctrineDurabilityResult?.durableDoctrineAreas ?? []),
        ...(input.doctrineResult?.durablePatterns ?? []),
      ],
      fragilitySignals: [
        ...(input.doctrineDurabilityResult?.fragileDoctrineAreas ?? []),
        ...(input.doctrineDurabilityResult?.futureGovernanceExpansionRisks ?? []),
        ...(input.doctrineResult?.doctrineLimitations ?? []),
      ],
      recommendedHumanReview:
        "Review doctrine fragility and expansion risks before architecture-freeze readiness work.",
      reasoning:
        "Doctrine durability is stable when doctrine remains neutral, evidence-supported, and free of enforcement coupling.",
    }),
    createAreaAssessment({
      area: "observability_durability",
      description:
        "Consolidates governance observability, dashboard durability, visibility, and institutional reviewability.",
      baseScore: average([
        input.observabilityDurabilityResult?.observabilityDurabilityScore ?? 42,
        input.observabilityDurabilityResult?.observabilityScalabilityScore ?? 42,
      ]),
      stabilitySignals: [
        ...(input.observabilityDurabilityResult?.durableObservabilityAreas ?? []),
        ...(input.observabilityDurabilityResult?.institutionalReviewabilityFindings ?? []),
      ],
      fragilitySignals: [
        ...(input.observabilityDurabilityResult?.fragileObservabilityAreas ?? []),
        ...(input.observabilityDurabilityResult?.dashboardDurabilityFindings ?? []),
        ...(input.observabilityDurabilityResult?.crossIndustryObservabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review observability blind spots and dashboard durability findings before final consolidation.",
      reasoning:
        "Observability durability supports final stability when governance visibility remains clear, bounded, and scalable.",
    }),
    createAreaAssessment({
      area: "reviewability_integrity",
      description:
        "Consolidates reviewability integrity, audit defensibility, human-review linkage, and institutional trust.",
      baseScore: average([
        input.reviewabilityIntegrityResult?.reviewabilityIntegrityScore ?? 42,
        statusScore(input.reviewabilityIntegrityResult?.reviewabilityClassification),
      ]),
      stabilitySignals: [
        ...(input.reviewabilityIntegrityResult?.reviewableAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.humanReviewFindings ?? []),
      ],
      fragilitySignals: [
        ...(input.reviewabilityIntegrityResult?.weakReviewabilityAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.reconstructionRisks ?? []),
        ...(input.reviewabilityIntegrityResult?.institutionalTrustFindings ?? []),
      ],
      recommendedHumanReview:
        "Review weak reviewability, reconstruction, and institutional trust findings before final stability closure.",
      reasoning:
        "Reviewability stability requires humans to reconstruct outputs, limitations, evidence, and recommendations.",
    }),
    createAreaAssessment({
      area: "semantic_version_survivability",
      description:
        "Consolidates semantic-version survivability, backward compatibility, taxonomy versioning, and reconstruction semantics.",
      baseScore: average([
        input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityScore ?? 42,
        statusScore(input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityClassification),
      ]),
      stabilitySignals: [...(input.semanticVersionSurvivabilityResult?.versionStableSemanticAreas ?? [])],
      fragilitySignals: [
        ...(input.semanticVersionSurvivabilityResult?.versionFragileSemanticAreas ?? []),
        ...(input.semanticVersionSurvivabilityResult?.backwardCompatibilityFindings ?? []),
        ...(input.semanticVersionSurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review semantic-version fragility and backward compatibility findings before governance freeze readiness.",
      reasoning:
        "Semantic-version survivability is stable when future semantic evolution remains backward-compatible and reconstructable.",
    }),
    createAreaAssessment({
      area: "isolation_durability",
      description:
        "Consolidates multi-business, multi-tenant, orchestration-review, and reconstruction isolation durability.",
      baseScore: average([
        input.multiBusinessTenantIsolationResult?.isolationSurvivabilityScore ?? 42,
        statusScore(input.multiBusinessTenantIsolationResult?.isolationClassification),
      ]),
      stabilitySignals: [...(input.multiBusinessTenantIsolationResult?.durableIsolationAreas ?? [])],
      fragilitySignals: [
        ...(input.multiBusinessTenantIsolationResult?.fragileIsolationAreas ?? []),
        ...(input.multiBusinessTenantIsolationResult?.tenantBoundaryFindings ?? []),
        ...(input.multiBusinessTenantIsolationResult?.reconstructionIsolationFindings ?? []),
      ],
      recommendedHumanReview:
        "Review tenant, business, orchestration, and reconstruction isolation findings before final consolidation.",
      reasoning:
        "Isolation durability is stable when tenant, business, and orchestration review boundaries remain explicit and reconstructable.",
    }),
    createAreaAssessment({
      area: "resilience_durability",
      description:
        "Consolidates governance resilience, long-horizon institutional resilience, anti-fragility, and stress durability.",
      baseScore: average([
        input.resilienceResult?.governanceResilienceScore ?? 42,
        input.longHorizonInstitutionalResilienceResult?.institutionalResilienceScore ?? 42,
        statusScore(input.longHorizonInstitutionalResilienceResult?.resilienceClassification),
      ]),
      stabilitySignals: [
        ...(input.resilienceResult?.resilienceStrengths ?? []),
        ...(input.resilienceResult?.antiFragilityIndicators ?? []),
        ...(input.longHorizonInstitutionalResilienceResult?.resilientGovernanceAreas ?? []),
      ],
      fragilitySignals: [
        ...(input.resilienceResult?.resilienceWeaknesses ?? []),
        ...(input.resilienceResult?.fragilityIndicators ?? []),
        ...(input.longHorizonInstitutionalResilienceResult?.fragileGovernanceAreas ?? []),
        ...(input.longHorizonInstitutionalResilienceResult?.longHorizonSurvivabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review resilience weaknesses, fragility indicators, and long-horizon survivability findings before final stabilization.",
      reasoning:
        "Resilience durability requires continuity under stress, recoverable governance structures, and visible fragility indicators.",
    }),
    createAreaAssessment({
      area: "institutional_memory_continuity",
      description:
        "Consolidates institutional memory continuity, long-horizon context, governance history, and memory reconstruction.",
      baseScore: average([
        input.institutionalMemoryContinuityResult?.institutionalMemoryContinuityScore ?? 42,
        input.memoryResult?.memoryConfidenceScore ?? 42,
        statusScore(input.institutionalMemoryContinuityResult?.memoryContinuityClassification),
      ]),
      stabilitySignals: [
        ...(input.institutionalMemoryContinuityResult?.durableMemoryAreas ?? []),
        ...(input.memoryResult?.longHorizonContext ?? []),
      ],
      fragilitySignals: [
        ...(input.institutionalMemoryContinuityResult?.fragileMemoryAreas ?? []),
        ...(input.institutionalMemoryContinuityResult?.governanceHistoryReconstructionFindings ?? []),
        ...(input.institutionalMemoryContinuityResult?.lineageReconstructionFindings ?? []),
      ],
      recommendedHumanReview:
        "Review institutional memory fragility and governance-history reconstruction findings before final stability closure.",
      reasoning:
        "Institutional memory stability requires durable governance memory, lineage reconstruction, and long-horizon context.",
    }),
    createAreaAssessment({
      area: "audit_history_survivability",
      description:
        "Consolidates audit-history survivability, governance-history findings, and long-horizon audit reconstruction.",
      baseScore: average([
        input.auditHistorySurvivabilityResult?.auditHistorySurvivabilityScore ?? 42,
        statusScore(input.auditHistorySurvivabilityResult?.auditHistoryClassification),
      ]),
      stabilitySignals: [...(input.auditHistorySurvivabilityResult?.durableAuditHistoryAreas ?? [])],
      fragilitySignals: [
        ...(input.auditHistorySurvivabilityResult?.fragileAuditHistoryAreas ?? []),
        ...(input.auditHistorySurvivabilityResult?.governanceHistoryFindings ?? []),
        ...(input.auditHistorySurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review audit-history survivability and reconstruction findings before final consolidation.",
      reasoning:
        "Audit-history survivability supports final stability when governance findings history remains reconstructable.",
    }),
    createAreaAssessment({
      area: "orchestration_safety",
      description:
        "Consolidates orchestration purity, hidden execution pathway risk, isolation boundaries, and review-only guarantees.",
      baseScore: average([
        input.auditResult?.categoryScores.orchestration_purity ?? 42,
        input.auditResult?.categoryScores.hidden_execution_pathways ?? 42,
        statusScore(input.multiBusinessTenantIsolationResult?.isolationClassification),
      ]),
      stabilitySignals: [
        "Final stability consolidation is read-only and does not trigger orchestration.",
        ...(input.multiBusinessTenantIsolationResult?.durableIsolationAreas ?? []).filter((area) =>
          normalize(area).includes("orchestration"),
        ),
      ],
      fragilitySignals: [
        ...(input.auditResult?.orchestrationContaminationRisks ?? []),
        ...(input.auditResult?.hiddenExecutionPathwayRisks ?? []),
        ...(input.multiBusinessTenantIsolationResult?.findings ?? [])
          .filter((finding) => finding.findingType === "orchestration_boundary_weakness")
          .map((finding) => finding.description),
      ],
      recommendedHumanReview:
        "Review orchestration contamination and hidden execution pathway risks before architecture freeze readiness.",
      reasoning:
        "Orchestration safety remains stable when governance review engines stay separate from workflow mutation and execution systems.",
    }),
    createAreaAssessment({
      area: "reconstruction_survivability",
      description:
        "Consolidates reconstruction across traceability, explainability, audit history, institutional memory, isolation, and resilience.",
      baseScore: average([
        statusScore(input.traceabilitySurvivabilityResult?.traceabilitySurvivabilityClassification),
        statusScore(input.reviewabilityIntegrityResult?.reviewabilityClassification),
        statusScore(input.auditHistorySurvivabilityResult?.auditHistoryClassification),
        input.longHorizonInstitutionalResilienceResult?.institutionalResilienceScore ?? 42,
      ]),
      stabilitySignals: [
        ...(input.traceabilitySurvivabilityResult?.durableTraceabilityAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.reviewableAreas ?? []),
        ...(input.auditHistorySurvivabilityResult?.durableAuditHistoryAreas ?? []),
      ],
      fragilitySignals: [
        ...(input.traceabilitySurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
        ...(input.explainabilityContinuityResult?.reconstructionContinuityFindings ?? []),
        ...(input.auditHistorySurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
        ...(input.multiBusinessTenantIsolationResult?.reconstructionIsolationFindings ?? []),
        ...(input.longHorizonInstitutionalResilienceResult?.reconstructionResilienceFindings ?? []),
      ],
      recommendedHumanReview:
        "Review reconstruction survivability findings across traceability, explainability, audit history, isolation, and resilience.",
      reasoning:
        "Reconstruction survivability is stable when prior findings can be rebuilt from evidence, reasoning, lineage, limitations, and audit history.",
    }),
  ];
}

function severityFor(findingType: GovernanceFinalStabilityFindingType, evidenceCount: number): ReputationSeverity {
  if (
    findingType === "hidden_governance_fragility" ||
    findingType === "orchestration_contamination_risk" ||
    findingType === "institutional_durability_weakness" ||
    findingType === "reconstruction_instability"
  ) {
    return evidenceCount >= 4 ? "elevated" : "moderate";
  }

  return evidenceCount >= 4 ? "moderate" : "low";
}

function createFinding(params: {
  type: GovernanceFinalStabilityFindingType;
  area: GovernanceFinalStabilityArea;
  description: string;
  evidence: string[];
  affectedAuditCategories?: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
}): GovernanceFinalStabilityFinding {
  const evidence = unique(params.evidence);
  const confidenceScore = calculateFinalGovernanceStabilityFindingConfidence({
    evidenceCount: evidence.length,
    factorCount: 2 + (params.recommendedHumanReview.length > 0 ? 1 : 0),
  });

  return {
    id: `final-stability-${slug(params.type)}-${slug(params.description)}`,
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
        "This finding is produced from deterministic read-only final stability checks across supplied governance subsystem outputs.",
        evidence.length === 0
          ? "Finding confidence is limited because supporting final stability evidence was not supplied."
          : "",
      ]),
    },
  };
}

function missingCriticalSubsystems(input: GovernanceFinalStabilityConsolidationInput): string[] {
  return [
    !input.readinessResult ? "governance readiness" : "",
    !input.auditResult ? "full-system audit" : "",
    !input.traceabilitySurvivabilityResult ? "traceability survivability" : "",
    !input.explainabilityContinuityResult ? "explainability continuity" : "",
    !input.semanticVersionSurvivabilityResult ? "semantic-version survivability" : "",
    !input.multiBusinessTenantIsolationResult ? "multi-business / multi-tenant isolation" : "",
    !input.longHorizonInstitutionalResilienceResult ? "long-horizon institutional resilience" : "",
    !input.auditHistorySurvivabilityResult ? "audit-history survivability" : "",
  ].filter(Boolean);
}

function buildFindings(input: GovernanceFinalStabilityConsolidationInput): GovernanceFinalStabilityFinding[] {
  const categories = auditCategories(input);
  const findings: GovernanceFinalStabilityFinding[] = [];
  const missingSubsystems = missingCriticalSubsystems(input);
  const reconstructionRisks = unique([
    ...(input.traceabilitySurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
    ...(input.explainabilityContinuityResult?.reconstructionContinuityFindings ?? []),
    ...(input.auditHistorySurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
    ...(input.reviewabilityIntegrityResult?.reconstructionRisks ?? []),
    ...(input.multiBusinessTenantIsolationResult?.reconstructionIsolationFindings ?? []),
    ...(input.longHorizonInstitutionalResilienceResult?.reconstructionResilienceFindings ?? []),
  ]);

  if (
    input.readinessResult?.readinessClassification === "not_ready" ||
    input.readinessResult?.readinessClassification === "developing" ||
    input.assuranceResult?.overallAssuranceStatus === "weak" ||
    (input.auditResult?.hiddenExecutionPathwayRisks.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "hidden_governance_fragility",
        area: "governance_readiness",
        description:
          "Final governance stability needs stronger readiness, assurance, or hidden execution pathway review.",
        evidence: [
          input.readinessResult
            ? `Readiness classification: ${input.readinessResult.readinessClassification}`
            : "Governance readiness result was not supplied.",
          input.assuranceResult
            ? `Assurance status: ${input.assuranceResult.overallAssuranceStatus}`
            : "Governance assurance result was not supplied.",
          ...(input.auditResult?.hiddenExecutionPathwayRisks ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review readiness, assurance, and hidden execution pathway risks before final stability closure.",
      }),
    );
  }

  if (missingSubsystems.length > 0) {
    findings.push(
      createFinding({
        type: "subsystem_inconsistency",
        area: "governance_readiness",
        description:
          "Final stability confidence is limited because one or more governance subsystem results were not supplied.",
        evidence: missingSubsystems.map((subsystem) => `Missing subsystem: ${subsystem}`),
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review missing subsystem outputs before treating final governance stability as institutionally durable.",
      }),
    );
  }

  if (reconstructionRisks.length > 0) {
    findings.push(
      createFinding({
        type: "reconstruction_instability",
        area: "reconstruction_survivability",
        description:
          "Reconstruction survivability still has unresolved risks across traceability, explainability, audit history, reviewability, isolation, or resilience outputs.",
        evidence: reconstructionRisks,
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review reconstruction survivability findings before architecture-freeze readiness work.",
      }),
    );
  }

  if (
    missingSubsystems.length >= 3 ||
    (input.survivabilityExpansionResult?.fragileExpansionAreas.length ?? 0) > 0 ||
    (input.multiBusinessTenantIsolationResult?.fragileIsolationAreas.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "governance_stack_fragmentation",
        area: "survivability",
        description:
          "Governance stack stability may fragment without stronger subsystem completeness and expansion/isolation stability.",
        evidence: [
          ...missingSubsystems.map((subsystem) => `Missing subsystem: ${subsystem}`),
          ...(input.survivabilityExpansionResult?.fragileExpansionAreas ?? []),
          ...(input.multiBusinessTenantIsolationResult?.fragileIsolationAreas ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review subsystem completeness, expansion fragility, and isolation fragility before final consolidation.",
      }),
    );
  }

  if (
    input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityClassification ===
      "version_fragile" ||
    input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityClassification ===
      "partially_survivable" ||
    (input.semanticStabilityResult?.driftRisks.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "semantic_survivability_weakness",
        area: "semantic_version_survivability",
        description:
          "Semantic survivability needs stronger stability before governance architecture freeze readiness.",
        evidence: [
          input.semanticVersionSurvivabilityResult
            ? `Semantic-version classification: ${input.semanticVersionSurvivabilityResult.semanticVersionSurvivabilityClassification}`
            : "Semantic-version survivability result was not supplied.",
          ...(input.semanticVersionSurvivabilityResult?.versionFragileSemanticAreas ?? []),
          ...(input.semanticStabilityResult?.driftRisks ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review semantic-version fragility and semantic drift before final stability closure.",
      }),
    );
  }

  if (
    (input.auditResult?.orchestrationContaminationRisks.length ?? 0) > 0 ||
    (input.auditResult?.hiddenExecutionPathwayRisks.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "orchestration_contamination_risk",
        area: "orchestration_safety",
        description:
          "Orchestration purity requires human review before final governance stability can be treated as durable.",
        evidence: [
          ...(input.auditResult?.orchestrationContaminationRisks ?? []),
          ...(input.auditResult?.hiddenExecutionPathwayRisks ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review orchestration contamination and hidden execution pathways before architecture-freeze readiness.",
      }),
    );
  }

  if (
    input.explainabilityContinuityResult?.explainabilityContinuityClassification === "opaque" ||
    input.explainabilityContinuityResult?.explainabilityContinuityClassification === "partially_explainable" ||
    (input.explainabilityContinuityResult?.fragileExplainabilityAreas.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "explainability_continuity_weakness",
        area: "explainability",
        description:
          "Explainability continuity remains a final stability review item.",
        evidence: [
          input.explainabilityContinuityResult
            ? `Explainability classification: ${input.explainabilityContinuityResult.explainabilityContinuityClassification}`
            : "Explainability continuity result was not supplied.",
          ...(input.explainabilityContinuityResult?.fragileExplainabilityAreas ?? []),
          ...(input.explainabilityContinuityResult?.reasoningContinuityFindings ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review explainability continuity and reasoning findings before final consolidation.",
      }),
    );
  }

  if (
    input.traceabilitySurvivabilityResult?.traceabilitySurvivabilityClassification === "collapsed" ||
    input.traceabilitySurvivabilityResult?.traceabilitySurvivabilityClassification === "partially_traceable" ||
    (input.traceabilitySurvivabilityResult?.fragileTraceabilityAreas.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "traceability_continuity_weakness",
        area: "traceability",
        description:
          "Traceability continuity remains a final stability review item.",
        evidence: [
          input.traceabilitySurvivabilityResult
            ? `Traceability classification: ${input.traceabilitySurvivabilityResult.traceabilitySurvivabilityClassification}`
            : "Traceability survivability result was not supplied.",
          ...(input.traceabilitySurvivabilityResult?.fragileTraceabilityAreas ?? []),
          ...(input.traceabilityResult?.missingLinks ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review traceability continuity and missing links before final consolidation.",
      }),
    );
  }

  if (
    input.auditResult?.auditClassification === "critical_risk" ||
    input.auditResult?.auditClassification === "needs_attention" ||
    input.auditHistorySurvivabilityResult?.auditHistoryClassification === "fragmented" ||
    input.auditHistorySurvivabilityResult?.auditHistoryClassification === "partially_survivable"
  ) {
    findings.push(
      createFinding({
        type: "auditability_degradation_risk",
        area: "auditability",
        description:
          "Auditability needs final human review before stability consolidation.",
        evidence: [
          input.auditResult
            ? `Audit classification: ${input.auditResult.auditClassification}`
            : "Full-system audit result was not supplied.",
          input.auditHistorySurvivabilityResult
            ? `Audit-history classification: ${input.auditHistorySurvivabilityResult.auditHistoryClassification}`
            : "Audit-history survivability result was not supplied.",
          ...(input.auditHistorySurvivabilityResult?.fragileAuditHistoryAreas ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review auditability and audit-history survivability before final consolidation.",
      }),
    );
  }

  if (
    input.institutionalMemoryContinuityResult?.memoryContinuityClassification === "fragmented" ||
    input.institutionalMemoryContinuityResult?.memoryContinuityClassification === "partially_reconstructable" ||
    (input.longHorizonInstitutionalResilienceResult?.institutionalContinuityFindings.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "institutional_durability_weakness",
        area: "institutional_memory_continuity",
        description:
          "Institutional durability needs stronger memory continuity or long-horizon continuity evidence.",
        evidence: [
          input.institutionalMemoryContinuityResult
            ? `Memory continuity classification: ${input.institutionalMemoryContinuityResult.memoryContinuityClassification}`
            : "Institutional memory continuity result was not supplied.",
          ...(input.institutionalMemoryContinuityResult?.fragileMemoryAreas ?? []),
          ...(input.longHorizonInstitutionalResilienceResult?.institutionalContinuityFindings ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review institutional memory continuity and long-horizon continuity findings before final consolidation.",
      }),
    );
  }

  if (
    input.longHorizonInstitutionalResilienceResult?.resilienceClassification === "brittle" ||
    input.longHorizonInstitutionalResilienceResult?.resilienceClassification === "conditionally_resilient" ||
    (input.longHorizonInstitutionalResilienceResult?.longHorizonSurvivabilityFindings.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "long_horizon_survivability_gap",
        area: "resilience_durability",
        description:
          "Long-horizon survivability requires final human review before architecture-freeze readiness.",
        evidence: [
          input.longHorizonInstitutionalResilienceResult
            ? `Long-horizon resilience classification: ${input.longHorizonInstitutionalResilienceResult.resilienceClassification}`
            : "Long-horizon institutional resilience result was not supplied.",
          ...(input.longHorizonInstitutionalResilienceResult?.longHorizonSurvivabilityFindings ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review long-horizon survivability gaps before final consolidation.",
      }),
    );
  }

  if (
    input.reviewabilityIntegrityResult?.reviewabilityClassification === "weak" ||
    input.reviewabilityIntegrityResult?.reviewabilityClassification === "partially_reviewable" ||
    (input.reviewabilityIntegrityResult?.weakReviewabilityAreas.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "reviewability_inconsistency",
        area: "reviewability_integrity",
        description:
          "Reviewability consistency remains a final stability review item.",
        evidence: [
          input.reviewabilityIntegrityResult
            ? `Reviewability classification: ${input.reviewabilityIntegrityResult.reviewabilityClassification}`
            : "Reviewability integrity result was not supplied.",
          ...(input.reviewabilityIntegrityResult?.weakReviewabilityAreas ?? []),
          ...(input.reviewabilityIntegrityResult?.institutionalTrustFindings ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review weak reviewability and institutional trust findings before final consolidation.",
      }),
    );
  }

  if (
    input.multiBusinessTenantIsolationResult?.isolationClassification === "contaminated" ||
    input.multiBusinessTenantIsolationResult?.isolationClassification === "partially_isolated" ||
    (input.multiBusinessTenantIsolationResult?.fragileIsolationAreas.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "isolation_instability",
        area: "isolation_durability",
        description:
          "Isolation durability remains a final stability review item.",
        evidence: [
          input.multiBusinessTenantIsolationResult
            ? `Isolation classification: ${input.multiBusinessTenantIsolationResult.isolationClassification}`
            : "Multi-business / multi-tenant isolation result was not supplied.",
          ...(input.multiBusinessTenantIsolationResult?.fragileIsolationAreas ?? []),
          ...(input.multiBusinessTenantIsolationResult?.tenantBoundaryFindings ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review isolation boundaries before final consolidation.",
      }),
    );
  }

  if (
    input.resilienceResult?.resilienceStatus === "fragile" ||
    input.resilienceResult?.resilienceStatus === "pressured" ||
    (input.resilienceResult?.fragilityIndicators.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "resilience_weakness",
        area: "resilience_durability",
        description:
          "Governance resilience remains a final stability review item.",
        evidence: [
          input.resilienceResult
            ? `Governance resilience status: ${input.resilienceResult.resilienceStatus}`
            : "Governance resilience result was not supplied.",
          ...(input.resilienceResult?.fragilityIndicators ?? []),
          ...(input.resilienceResult?.resilienceWeaknesses ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review resilience weaknesses and fragility indicators before final consolidation.",
      }),
    );
  }

  return findings;
}

function buildHumanReviewNotes(
  input: GovernanceFinalStabilityConsolidationInput,
  findings: GovernanceFinalStabilityFinding[],
): string[] {
  return unique([
    "Human review is required before any governance architecture freeze or stability conclusion.",
    "This consolidation is read-only and does not redesign architecture, centralize governance, mutate semantics, persist data, or trigger orchestration.",
    ...findings.map((finding) => finding.recommendedHumanReview),
    ...(input.longHorizonInstitutionalResilienceResult?.humanReviewNotes ?? []),
    ...(input.multiBusinessTenantIsolationResult?.humanReviewNotes ?? []),
    ...(input.semanticVersionSurvivabilityResult?.humanReviewNotes ?? []),
    ...(input.traceabilitySurvivabilityResult?.humanReviewNotes ?? []),
    ...(input.explainabilityContinuityResult?.humanReviewNotes ?? []),
  ]);
}

function buildFinalStabilizationRecommendations(
  input: GovernanceFinalStabilityConsolidationInput,
  findings: GovernanceFinalStabilityFinding[],
): string[] {
  return unique([
    missingCriticalSubsystems(input).length > 0
      ? `Review missing subsystem outputs: ${missingCriticalSubsystems(input).join(", ")}.`
      : "",
    "Keep final stability consolidation read-only until architecture freeze readiness is reviewed and explicitly approved.",
    "Preserve shared deterministic utility extraction as a future upgrade after architecture-freeze readiness review.",
    "Prepare Governance Architecture Freeze Readiness Review as the next read-only stage.",
    ...findings.map((finding) => finding.recommendedHumanReview),
    ...(input.longHorizonInstitutionalResilienceResult?.futureStabilizationRecommendations ?? []),
    ...(input.multiBusinessTenantIsolationResult?.futureStabilizationRecommendations ?? []),
    ...(input.auditHistorySurvivabilityResult?.futureStabilizationRecommendations ?? []),
  ]);
}

export function runGovernanceFinalStabilityConsolidationReview(
  input: GovernanceFinalStabilityConsolidationInput,
): GovernanceFinalStabilityConsolidationResult {
  const areaAssessments = buildAreaAssessments(input);
  const findings = buildFindings(input);
  const finalGovernanceStabilityScore = calculateOverallFinalGovernanceStabilityScore({
    areaAssessments,
    findings,
  });
  const governanceStabilityClassification =
    finalGovernanceStabilityClassificationFromScore(finalGovernanceStabilityScore);

  const resultWithoutExplainability: Omit<
    GovernanceFinalStabilityConsolidationResult,
    "explainability"
  > = {
    finalGovernanceStabilityScore,
    governanceStabilityClassification,
    areaAssessments,
    findings,
    stableGovernanceAreas: areaAssessments
      .filter((area) => ["stable", "institutionally_stable"].includes(area.classification))
      .map((area) => `${area.area}: ${area.classification} at ${area.score}/100`),
    fragileGovernanceAreas: areaAssessments
      .filter((area) => ["unstable", "partially_stable"].includes(area.classification))
      .map((area) => `${area.area}: ${area.classification} at ${area.score}/100`),
    consolidatedAuditabilityFindings: findings
      .filter((finding) => finding.findingType === "auditability_degradation_risk")
      .map((finding) => finding.description),
    consolidatedExplainabilityFindings: findings
      .filter((finding) => finding.findingType === "explainability_continuity_weakness")
      .map((finding) => finding.description),
    consolidatedTraceabilityFindings: findings
      .filter((finding) => finding.findingType === "traceability_continuity_weakness")
      .map((finding) => finding.description),
    consolidatedSurvivabilityFindings: findings
      .filter((finding) =>
        ["governance_stack_fragmentation", "long_horizon_survivability_gap"].includes(finding.findingType),
      )
      .map((finding) => finding.description),
    consolidatedContinuityFindings: findings
      .filter((finding) => finding.findingType === "institutional_durability_weakness")
      .map((finding) => finding.description),
    consolidatedSemanticFindings: findings
      .filter((finding) => finding.findingType === "semantic_survivability_weakness")
      .map((finding) => finding.description),
    consolidatedResilienceFindings: findings
      .filter((finding) =>
        ["resilience_weakness", "long_horizon_survivability_gap"].includes(finding.findingType),
      )
      .map((finding) => finding.description),
    institutionalDurabilityFindings: findings
      .filter((finding) =>
        [
          "institutional_durability_weakness",
          "long_horizon_survivability_gap",
          "governance_stack_fragmentation",
        ].includes(finding.findingType),
      )
      .map((finding) => finding.description),
    reconstructionSurvivabilityFindings: findings
      .filter((finding) => finding.findingType === "reconstruction_instability")
      .map((finding) => finding.description),
    humanReviewNotes: buildHumanReviewNotes(input, findings),
    finalStabilizationRecommendations: buildFinalStabilizationRecommendations(input, findings),
    humanReviewRequired:
      findings.length > 0 ||
      areaAssessments.some((area) => ["unstable", "partially_stable"].includes(area.classification)),
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernanceFinalStabilityConsolidationExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}
