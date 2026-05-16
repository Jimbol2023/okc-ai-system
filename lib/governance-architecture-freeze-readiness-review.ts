import { buildGovernanceArchitectureFreezeReadinessExplainability } from "./governance-architecture-freeze-readiness-review-explainability";
import {
  architectureFreezeReadinessClassificationFromScore,
  calculateArchitectureFreezeReadinessAreaScore,
  calculateArchitectureFreezeReadinessFindingConfidence,
  calculateOverallArchitectureFreezeReadinessScore,
} from "./governance-architecture-freeze-readiness-review-scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
} from "./full-system-governance-audit-types";
import type {
  GovernanceArchitectureFreezeReadinessArea,
  GovernanceArchitectureFreezeReadinessAreaAssessment,
  GovernanceArchitectureFreezeReadinessFinding,
  GovernanceArchitectureFreezeReadinessFindingType,
  GovernanceArchitectureFreezeReadinessInput,
  GovernanceArchitectureFreezeReadinessResult,
} from "./governance-architecture-freeze-readiness-review-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

type AreaInput = {
  area: GovernanceArchitectureFreezeReadinessArea;
  description: string;
  baseScore: number;
  freezeReadySignals: string[];
  freezeRiskSignals: string[];
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
  return normalize(value).slice(0, 72) || "architecture_freeze_readiness";
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
  input: GovernanceArchitectureFreezeReadinessInput,
  key:
    | "candidateContractAreas"
    | "candidateUtilityAreas"
    | "freezeAssumptions"
    | "deploymentAssumptions"
    | "enterpriseIntegrationAssumptions"
    | "freezeLimitations",
): string[] {
  const contextValue = input.freezeContext?.[key];
  if (Array.isArray(contextValue)) {
    return unique(contextValue);
  }

  return unique(stringsFromUnknown(input.metadata?.[key]));
}

function statusScore(status?: string): number {
  switch (status) {
    case "institutionally_freeze_ready":
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
    case "institutionally_stable":
    case "institutionally_registry_ready":
    case "institutionally_consistent":
    case "institutionally_ready":
    case "institutionally_strong":
    case "freeze_ready":
    case "stable":
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
    case "registry_candidate":
    case "normalized":
    case "operationally_ready":
    case "reliable":
    case "aligned":
      return 76;
    case "partially_freeze_ready":
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
  input: GovernanceArchitectureFreezeReadinessInput,
): FullSystemGovernanceAuditFinding[] {
  return [...(input.auditFindings ?? []), ...(input.auditResult?.findings ?? [])];
}

function auditCategories(input: GovernanceArchitectureFreezeReadinessInput): FullSystemGovernanceAuditCategory[] {
  return unique(
    getAuditFindings(input)
      .map((finding) => finding.category)
      .concat(Object.keys(input.auditResult?.categoryScores ?? {}) as FullSystemGovernanceAuditCategory[]),
  ) as FullSystemGovernanceAuditCategory[];
}

function createAreaAssessment(params: AreaInput): GovernanceArchitectureFreezeReadinessAreaAssessment {
  const score = calculateArchitectureFreezeReadinessAreaScore({
    baseScore: params.baseScore,
    freezeReadySignalCount: params.freezeReadySignals.length,
    freezeRiskSignalCount: params.freezeRiskSignals.length,
    findingCount: params.freezeRiskSignals.length,
    explainabilityCount:
      params.reasoning.length > 0 ? params.freezeReadySignals.length + 1 : params.freezeReadySignals.length,
  });

  return {
    area: params.area,
    score,
    classification: architectureFreezeReadinessClassificationFromScore(score),
    description: params.description,
    freezeReadySignals: unique(params.freezeReadySignals),
    freezeRiskSignals: unique(params.freezeRiskSignals),
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors: unique([...params.freezeReadySignals, ...params.freezeRiskSignals]),
      reasoning: unique([
        params.reasoning,
        params.freezeRiskSignals.length > 0
          ? "Freeze readiness depends on human review of unresolved risks before any architecture-freeze or utility-extraction approval."
          : "",
      ]),
    },
  };
}

function stableContractCandidates(input: GovernanceArchitectureFreezeReadinessInput): string[] {
  return unique([
    ...contextSignals(input, "candidateContractAreas"),
    ...(input.finalStabilityConsolidationResult?.stableGovernanceAreas ?? []).map(
      (area) => `Final stability area candidate: ${area}`,
    ),
    ...(input.semanticVersionSurvivabilityResult?.versionStableSemanticAreas ?? []).map(
      (area) => `Semantic-version contract candidate: ${area}`,
    ),
    ...(input.traceabilitySurvivabilityResult?.durableTraceabilityAreas ?? []).map(
      (area) => `Traceability contract candidate: ${area}`,
    ),
    ...(input.lifecycleContinuityResult?.durableContinuityAreas ?? []).map(
      (area) => `Lifecycle contract candidate: ${area}`,
    ),
  ]);
}

function utilityCandidates(input: GovernanceArchitectureFreezeReadinessInput): string[] {
  return unique([
    ...contextSignals(input, "candidateUtilityAreas"),
    "Deterministic unique/string normalization helper",
    "Deterministic score clamping and averaging helper",
    "Status-to-score mapping helper",
    "Finding confidence scoring helper",
    "Human-review recommendation grouping helper",
  ]);
}

function missingCoreSubsystems(input: GovernanceArchitectureFreezeReadinessInput): string[] {
  return [
    !input.finalStabilityConsolidationResult ? "final stability consolidation" : "",
    !input.longHorizonInstitutionalResilienceResult ? "long-horizon institutional resilience" : "",
    !input.multiBusinessTenantIsolationResult ? "multi-business / multi-tenant isolation" : "",
    !input.semanticVersionSurvivabilityResult ? "semantic-version survivability" : "",
    !input.readinessResult ? "governance readiness" : "",
    !input.auditResult ? "full-system governance audit" : "",
    !input.traceabilitySurvivabilityResult ? "traceability survivability" : "",
    !input.explainabilityContinuityResult ? "explainability continuity" : "",
  ].filter(Boolean);
}

function buildAreaAssessments(
  input: GovernanceArchitectureFreezeReadinessInput,
): GovernanceArchitectureFreezeReadinessAreaAssessment[] {
  const contractCandidates = stableContractCandidates(input);
  const utilities = utilityCandidates(input);
  const freezeLimitations = contextSignals(input, "freezeLimitations");

  return [
    createAreaAssessment({
      area: "governance_readiness",
      description:
        "Reviews whether governance readiness, assurance, and alignment are mature enough for freeze-readiness review.",
      baseScore: average([
        input.readinessResult?.overallReadinessScore ?? 42,
        input.assuranceResult?.governanceAssuranceScore ?? 42,
        input.alignmentResult?.governanceAlignmentScore ?? 42,
      ]),
      freezeReadySignals: [
        ...(input.readinessResult?.strengths ?? []),
        ...(input.assuranceResult?.assuranceStrengths ?? []),
        ...(input.alignmentResult?.alignmentStrengths ?? []),
      ],
      freezeRiskSignals: [
        ...(input.readinessResult?.weaknesses ?? []),
        ...(input.assuranceResult?.assuranceWeaknesses ?? []),
        ...(input.alignmentResult?.alignmentGaps ?? []),
        ...freezeLimitations,
      ],
      recommendedHumanReview:
        "Review readiness, assurance, and alignment before architecture freeze readiness is accepted.",
      reasoning:
        "Architecture freeze readiness improves when governance readiness, assurance, and alignment are stable and mutually reinforcing.",
    }),
    createAreaAssessment({
      area: "auditability",
      description:
        "Reviews whether auditability and audit-history survivability are stable enough for future operational deployment.",
      baseScore: average([
        input.auditResult?.overallAuditScore ?? 42,
        input.auditHistorySurvivabilityResult?.auditHistorySurvivabilityScore ?? 42,
        input.auditResult?.categoryScores.enterprise_durability ?? 42,
      ]),
      freezeReadySignals: [
        ...(input.auditResult?.strengths ?? []),
        ...(input.auditHistorySurvivabilityResult?.durableAuditHistoryAreas ?? []),
      ],
      freezeRiskSignals: [
        ...(input.auditResult?.risks ?? []),
        ...(input.auditHistorySurvivabilityResult?.fragileAuditHistoryAreas ?? []),
        ...(input.auditHistorySurvivabilityResult?.institutionalAuditabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review audit risks and audit-history fragility before freeze readiness.",
      reasoning:
        "Freeze readiness requires auditability that remains reconstructable, reviewable, and institutionally durable.",
    }),
    createAreaAssessment({
      area: "explainability",
      description:
        "Reviews whether explainability continuity is mature enough for stable reusable governance contracts.",
      baseScore: average([
        input.explainabilityContinuityResult?.explainabilityContinuityScore ?? 42,
        input.auditResult?.categoryScores.explainability_integrity ?? 42,
      ]),
      freezeReadySignals: [...(input.explainabilityContinuityResult?.durableExplainabilityAreas ?? [])],
      freezeRiskSignals: [
        ...(input.explainabilityContinuityResult?.fragileExplainabilityAreas ?? []),
        ...(input.explainabilityContinuityResult?.reasoningContinuityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review explainability fragility before freeze-ready contracts are identified.",
      reasoning:
        "Freeze readiness depends on explainable scores, visible limitations, and reconstructable reasoning.",
    }),
    createAreaAssessment({
      area: "traceability",
      description:
        "Reviews whether traceability contracts and evidence chains are stable enough for future reuse.",
      baseScore: average([
        input.traceabilityResult?.traceabilityScore ?? 42,
        input.traceabilitySurvivabilityResult?.traceabilitySurvivabilityScore ?? 42,
        input.auditResult?.categoryScores.traceability_integrity ?? 42,
      ]),
      freezeReadySignals: [
        ...(input.traceabilityResult?.traceStrengths ?? []),
        ...(input.traceabilitySurvivabilityResult?.durableTraceabilityAreas ?? []),
      ],
      freezeRiskSignals: [
        ...(input.traceabilityResult?.missingLinks ?? []),
        ...(input.traceabilitySurvivabilityResult?.fragileTraceabilityAreas ?? []),
        ...(input.traceabilitySurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review traceability gaps and reconstruction findings before freeze readiness.",
      reasoning:
        "Reusable governance contracts need traceability that remains evidence-linked and reconstructable.",
    }),
    createAreaAssessment({
      area: "survivability",
      description:
        "Reviews survivability expansion, long-horizon resilience, and future scaling maturity.",
      baseScore: average([
        input.survivabilityExpansionResult?.survivabilityScore ?? 42,
        input.longHorizonInstitutionalResilienceResult?.institutionalResilienceScore ?? 42,
      ]),
      freezeReadySignals: [
        ...(input.survivabilityExpansionResult?.durableArchitectureAreas ?? []),
        ...(input.longHorizonInstitutionalResilienceResult?.resilientGovernanceAreas ?? []),
      ],
      freezeRiskSignals: [
        ...(input.survivabilityExpansionResult?.fragileExpansionAreas ?? []),
        ...(input.longHorizonInstitutionalResilienceResult?.fragileGovernanceAreas ?? []),
        ...(input.longHorizonInstitutionalResilienceResult?.longHorizonSurvivabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review survivability gaps and long-horizon resilience findings before future governance scaling.",
      reasoning:
        "Architecture freeze readiness depends on durable survivability under growth and stress scenarios.",
    }),
    createAreaAssessment({
      area: "semantic_stability",
      description:
        "Reviews semantic stability, normalization, and registry-readiness maturity.",
      baseScore: average([
        statusScore(input.semanticStabilityResult?.semanticStabilityClassification),
        input.normalizationResult?.normalizationScore ?? 42,
        input.registryReviewResult?.registryReadinessScore ?? 42,
      ]),
      freezeReadySignals: [
        ...(input.semanticStabilityResult?.stableTerms ?? []).map((term) => `Stable term: ${term}`),
        ...(input.normalizationResult?.principleMappingStrength ?? []),
      ],
      freezeRiskSignals: [
        ...(input.semanticStabilityResult?.driftRisks ?? []),
        ...(input.normalizationResult?.governanceSemanticDriftRisks ?? []),
        ...(input.registryReviewResult?.semanticDriftRisks ?? []),
      ],
      recommendedHumanReview:
        "Review semantic drift and normalization gaps before freeze readiness.",
      reasoning:
        "Stable reusable contracts need deterministic terminology, normalized mappings, and registry-compatible semantics.",
    }),
    createAreaAssessment({
      area: "doctrine_durability",
      description:
        "Reviews doctrine durability and principle stability for future governance reuse.",
      baseScore: average([
        input.doctrineDurabilityResult?.doctrineDurabilityScore ?? 42,
        input.doctrineResult?.doctrineConfidenceScore ?? 42,
      ]),
      freezeReadySignals: [
        ...(input.doctrineDurabilityResult?.durableDoctrineAreas ?? []),
        ...(input.doctrineResult?.durablePatterns ?? []),
      ],
      freezeRiskSignals: [
        ...(input.doctrineDurabilityResult?.fragileDoctrineAreas ?? []),
        ...(input.doctrineDurabilityResult?.futureGovernanceExpansionRisks ?? []),
        ...(input.doctrineResult?.doctrineLimitations ?? []),
      ],
      recommendedHumanReview:
        "Review doctrine fragility before future governance contract reuse.",
      reasoning:
        "Doctrine is freeze-ready when it remains durable, neutral, reviewable, and free of enforcement coupling.",
    }),
    createAreaAssessment({
      area: "observability_durability",
      description:
        "Reviews whether observability and dashboard visibility are mature enough for future deployment review.",
      baseScore: average([
        input.observabilityDurabilityResult?.observabilityDurabilityScore ?? 42,
        input.observabilityDurabilityResult?.observabilityScalabilityScore ?? 42,
      ]),
      freezeReadySignals: [
        ...(input.observabilityDurabilityResult?.durableObservabilityAreas ?? []),
        ...(input.observabilityDurabilityResult?.institutionalReviewabilityFindings ?? []),
      ],
      freezeRiskSignals: [
        ...(input.observabilityDurabilityResult?.fragileObservabilityAreas ?? []),
        ...(input.observabilityDurabilityResult?.dashboardDurabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review observability blind spots before operational deployment readiness work.",
      reasoning:
        "Deployment readiness needs durable observability and reviewable visibility without execution coupling.",
    }),
    createAreaAssessment({
      area: "reviewability_integrity",
      description:
        "Reviews whether human reviewability and audit defensibility are mature enough for freeze readiness.",
      baseScore: average([
        input.reviewabilityIntegrityResult?.reviewabilityIntegrityScore ?? 42,
        statusScore(input.reviewabilityIntegrityResult?.reviewabilityClassification),
      ]),
      freezeReadySignals: [
        ...(input.reviewabilityIntegrityResult?.reviewableAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.humanReviewFindings ?? []),
      ],
      freezeRiskSignals: [
        ...(input.reviewabilityIntegrityResult?.weakReviewabilityAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.institutionalTrustFindings ?? []),
      ],
      recommendedHumanReview:
        "Review weak reviewability and institutional trust findings before freeze readiness.",
      reasoning:
        "Architecture freeze readiness depends on findings remaining understandable, reconstructable, and human-auditable.",
    }),
    createAreaAssessment({
      area: "institutional_memory_continuity",
      description:
        "Reviews memory continuity and governance-history reconstruction maturity.",
      baseScore: average([
        input.institutionalMemoryContinuityResult?.institutionalMemoryContinuityScore ?? 42,
        input.memoryResult?.memoryConfidenceScore ?? 42,
      ]),
      freezeReadySignals: [
        ...(input.institutionalMemoryContinuityResult?.durableMemoryAreas ?? []),
        ...(input.memoryResult?.longHorizonContext ?? []),
      ],
      freezeRiskSignals: [
        ...(input.institutionalMemoryContinuityResult?.fragileMemoryAreas ?? []),
        ...(input.institutionalMemoryContinuityResult?.governanceHistoryReconstructionFindings ?? []),
      ],
      recommendedHumanReview:
        "Review institutional memory and governance-history reconstruction before freeze readiness.",
      reasoning:
        "Freeze readiness requires institutional memory that can survive future governance evolution.",
    }),
    createAreaAssessment({
      area: "lifecycle_continuity",
      description:
        "Reviews lifecycle continuity, versioning readiness, compatibility, and migration survivability.",
      baseScore: average([
        input.lifecycleContinuityResult?.lifecycleContinuityScore ?? 42,
        input.versioningReadinessResult?.versioningReadinessScore ?? 42,
        input.compatibilityMigrationContext?.compatibilityScore ?? 42,
      ]),
      freezeReadySignals: [
        ...(input.lifecycleContinuityResult?.durableContinuityAreas ?? []),
        ...(input.versioningReadinessResult?.stableVersionReadyAreas ?? []),
      ],
      freezeRiskSignals: [
        ...(input.lifecycleContinuityResult?.fragileContinuityAreas ?? []),
        ...(input.versioningReadinessResult?.migrationRiskFindings ?? []),
        ...(input.compatibilityMigrationContext?.compatibilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review lifecycle and versioning risks before freeze readiness.",
      reasoning:
        "Architecture freeze readiness requires stable lifecycle, version, compatibility, and migration semantics.",
    }),
    createAreaAssessment({
      area: "semantic_version_survivability",
      description:
        "Reviews semantic-version survivability and backward compatibility maturity.",
      baseScore: average([
        input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityScore ?? 42,
        statusScore(input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityClassification),
      ]),
      freezeReadySignals: [...(input.semanticVersionSurvivabilityResult?.versionStableSemanticAreas ?? [])],
      freezeRiskSignals: [
        ...(input.semanticVersionSurvivabilityResult?.versionFragileSemanticAreas ?? []),
        ...(input.semanticVersionSurvivabilityResult?.backwardCompatibilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review semantic-version survivability before stable contract candidates are treated as mature.",
      reasoning:
        "Freeze readiness requires semantics that remain backward-compatible and reconstructable.",
    }),
    createAreaAssessment({
      area: "multi_business_isolation",
      description:
        "Reviews multi-business and multi-tenant isolation durability for future reuse.",
      baseScore: average([
        input.multiBusinessTenantIsolationResult?.isolationSurvivabilityScore ?? 42,
        statusScore(input.multiBusinessTenantIsolationResult?.isolationClassification),
      ]),
      freezeReadySignals: [...(input.multiBusinessTenantIsolationResult?.durableIsolationAreas ?? [])],
      freezeRiskSignals: [
        ...(input.multiBusinessTenantIsolationResult?.fragileIsolationAreas ?? []),
        ...(input.multiBusinessTenantIsolationResult?.tenantBoundaryFindings ?? []),
      ],
      recommendedHumanReview:
        "Review isolation boundaries before future multi-business reuse.",
      reasoning:
        "Freeze readiness requires boundaries that can survive tenant, business, and orchestration expansion.",
    }),
    createAreaAssessment({
      area: "long_horizon_resilience",
      description:
        "Reviews long-horizon resilience durability for future AI-agent and enterprise scaling.",
      baseScore: average([
        input.longHorizonInstitutionalResilienceResult?.institutionalResilienceScore ?? 42,
        statusScore(input.longHorizonInstitutionalResilienceResult?.resilienceClassification),
      ]),
      freezeReadySignals: [...(input.longHorizonInstitutionalResilienceResult?.resilientGovernanceAreas ?? [])],
      freezeRiskSignals: [
        ...(input.longHorizonInstitutionalResilienceResult?.fragileGovernanceAreas ?? []),
        ...(input.longHorizonInstitutionalResilienceResult?.longHorizonSurvivabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review long-horizon resilience risks before future AI-agent expansion readiness.",
      reasoning:
        "Freeze readiness depends on long-horizon resilience under operational stress and governance evolution.",
    }),
    createAreaAssessment({
      area: "final_stability_consolidation",
      description:
        "Reviews final stability consolidation as the main architecture freeze readiness precursor.",
      baseScore: average([
        input.finalStabilityConsolidationResult?.finalGovernanceStabilityScore ?? 42,
        statusScore(input.finalStabilityConsolidationResult?.governanceStabilityClassification),
      ]),
      freezeReadySignals: [...(input.finalStabilityConsolidationResult?.stableGovernanceAreas ?? [])],
      freezeRiskSignals: [
        ...(input.finalStabilityConsolidationResult?.fragileGovernanceAreas ?? []),
        ...(input.finalStabilityConsolidationResult?.institutionalDurabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review final stability fragile areas before any architecture freeze readiness conclusion.",
      reasoning:
        "Architecture freeze readiness should follow strong final stability consolidation, not replace it.",
    }),
    createAreaAssessment({
      area: "stable_reusable_contracts",
      description:
        "Reviews whether reusable contract candidates appear stable enough for future contract formalization.",
      baseScore: average([
        contractCandidates.length > 0 ? 76 : 42,
        statusScore(input.finalStabilityConsolidationResult?.governanceStabilityClassification),
        statusScore(input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityClassification),
      ]),
      freezeReadySignals: contractCandidates,
      freezeRiskSignals: [
        ...(input.finalStabilityConsolidationResult?.consolidatedSemanticFindings ?? []),
        ...(input.semanticVersionSurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
        ...(contractCandidates.length === 0 ? ["No stable contract candidates were supplied or inferred."] : []),
      ],
      recommendedHumanReview:
        "Review stable contract candidates before formalizing shared governance contracts.",
      reasoning:
        "Contract areas become freeze-ready when stable subsystem outputs and semantic-version survivability reinforce them.",
    }),
    createAreaAssessment({
      area: "shared_utility_extraction",
      description:
        "Reviews whether repeated deterministic helper patterns are mature enough for a future extraction plan.",
      baseScore: average([
        utilities.length > 0 ? 76 : 42,
        statusScore(input.finalStabilityConsolidationResult?.governanceStabilityClassification),
      ]),
      freezeReadySignals: utilities.map((candidate) => `Utility extraction candidate: ${candidate}`),
      freezeRiskSignals: [
        ...(input.auditResult?.futureTechnicalDebtItems ?? []).filter((item) =>
          normalize(item).includes("utility") || normalize(item).includes("duplication"),
        ),
        ...(input.finalStabilityConsolidationResult?.fragileGovernanceAreas ?? []).filter((area) =>
          normalize(area).includes("stability"),
        ),
      ],
      recommendedHumanReview:
        "Prepare a read-only shared utility extraction plan before any utility refactor.",
      reasoning:
        "Utility extraction is freeze-ready only as a plan while governance modules remain stable and build order is preserved.",
    }),
    createAreaAssessment({
      area: "governance_scaling",
      description:
        "Reviews maturity for future governance scaling, multi-business reuse, and AI-agent expansion.",
      baseScore: average([
        input.survivabilityExpansionResult?.expansionDurabilityScore ?? 42,
        input.multiBusinessTenantIsolationResult?.isolationSurvivabilityScore ?? 42,
        input.longHorizonInstitutionalResilienceResult?.institutionalResilienceScore ?? 42,
      ]),
      freezeReadySignals: [
        ...(input.survivabilityExpansionResult?.durableArchitectureAreas ?? []),
        ...(input.multiBusinessTenantIsolationResult?.durableIsolationAreas ?? []),
      ],
      freezeRiskSignals: [
        ...(input.survivabilityExpansionResult?.fragileExpansionAreas ?? []),
        ...(input.multiBusinessTenantIsolationResult?.fragileIsolationAreas ?? []),
        ...(input.longHorizonInstitutionalResilienceResult?.longHorizonSurvivabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review scaling, isolation, and long-horizon resilience risks before future governance scaling.",
      reasoning:
        "Governance scaling is freeze-ready when expansion, isolation, and long-horizon resilience are all durable.",
    }),
    createAreaAssessment({
      area: "operational_deployment",
      description:
        "Reviews operational deployment readiness without approving deployment or adding runtime behavior.",
      baseScore: average([
        input.readinessResult?.overallReadinessScore ?? 42,
        input.auditResult?.categoryScores.hidden_execution_pathways ?? 42,
        input.auditResult?.categoryScores.orchestration_purity ?? 42,
      ]),
      freezeReadySignals: [
        ...contextSignals(input, "deploymentAssumptions").map((assumption) => `Deployment assumption: ${assumption}`),
        ...(input.readinessResult?.governancePreparednessIndicators ?? []),
      ],
      freezeRiskSignals: [
        ...(input.auditResult?.hiddenExecutionPathwayRisks ?? []),
        ...(input.auditResult?.orchestrationContaminationRisks ?? []),
        ...(input.readinessResult?.limitations ?? []),
      ],
      recommendedHumanReview:
        "Review deployment assumptions, hidden execution pathways, and orchestration purity before operational deployment planning.",
      reasoning:
        "Operational deployment readiness requires review-only engines to remain isolated from execution and automation.",
    }),
    createAreaAssessment({
      area: "enterprise_integration",
      description:
        "Reviews enterprise integration readiness without adding integrations, persistence, or execution systems.",
      baseScore: average([
        input.finalStabilityConsolidationResult?.finalGovernanceStabilityScore ?? 42,
        input.multiBusinessTenantIsolationResult?.isolationSurvivabilityScore ?? 42,
        input.longHorizonInstitutionalResilienceResult?.institutionalResilienceScore ?? 42,
      ]),
      freezeReadySignals: [
        ...contextSignals(input, "enterpriseIntegrationAssumptions").map(
          (assumption) => `Enterprise integration assumption: ${assumption}`,
        ),
        ...(input.finalStabilityConsolidationResult?.stableGovernanceAreas ?? []),
      ],
      freezeRiskSignals: [
        ...(input.finalStabilityConsolidationResult?.fragileGovernanceAreas ?? []),
        ...(input.multiBusinessTenantIsolationResult?.institutionalBoundaryFindings ?? []),
      ],
      recommendedHumanReview:
        "Review enterprise integration assumptions and institutional boundary findings before enterprise integration planning.",
      reasoning:
        "Enterprise integration is freeze-ready only when subsystem stability, isolation, and resilience remain durable.",
    }),
    createAreaAssessment({
      area: "orchestration_isolation",
      description:
        "Reviews orchestration isolation and hidden execution pathway safety before freeze readiness.",
      baseScore: average([
        input.auditResult?.categoryScores.orchestration_purity ?? 42,
        input.auditResult?.categoryScores.hidden_execution_pathways ?? 42,
        statusScore(input.multiBusinessTenantIsolationResult?.isolationClassification),
      ]),
      freezeReadySignals: [
        "Freeze readiness review is read-only and does not trigger orchestration.",
        ...(input.multiBusinessTenantIsolationResult?.durableIsolationAreas ?? []).filter((area) =>
          normalize(area).includes("orchestration"),
        ),
      ],
      freezeRiskSignals: [
        ...(input.auditResult?.orchestrationContaminationRisks ?? []),
        ...(input.auditResult?.hiddenExecutionPathwayRisks ?? []),
      ],
      recommendedHumanReview:
        "Review orchestration contamination and hidden execution pathway risks before freeze readiness.",
      reasoning:
        "Architecture freeze readiness requires clear separation between governance review and execution systems.",
    }),
  ];
}

function severityFor(
  findingType: GovernanceArchitectureFreezeReadinessFindingType,
  evidenceCount: number,
): ReputationSeverity {
  if (
    findingType === "premature_freeze_risk" ||
    findingType === "hidden_orchestration_contamination" ||
    findingType === "hidden_execution_pathway_risk" ||
    findingType === "unresolved_architecture_fragility"
  ) {
    return evidenceCount >= 4 ? "elevated" : "moderate";
  }

  return evidenceCount >= 4 ? "moderate" : "low";
}

function createFinding(params: {
  type: GovernanceArchitectureFreezeReadinessFindingType;
  area: GovernanceArchitectureFreezeReadinessArea;
  description: string;
  evidence: string[];
  affectedAuditCategories?: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
}): GovernanceArchitectureFreezeReadinessFinding {
  const evidence = unique(params.evidence);
  const confidenceScore = calculateArchitectureFreezeReadinessFindingConfidence({
    evidenceCount: evidence.length,
    factorCount: 2 + (params.recommendedHumanReview.length > 0 ? 1 : 0),
  });

  return {
    id: `architecture-freeze-readiness-${slug(params.type)}-${slug(params.description)}`,
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
        "This finding is produced from deterministic read-only architecture freeze readiness checks across supplied governance subsystem outputs.",
        evidence.length === 0
          ? "Finding confidence is limited because supporting freeze-readiness evidence was not supplied."
          : "",
      ]),
    },
  };
}

function buildFindings(
  input: GovernanceArchitectureFreezeReadinessInput,
): GovernanceArchitectureFreezeReadinessFinding[] {
  const categories = auditCategories(input);
  const findings: GovernanceArchitectureFreezeReadinessFinding[] = [];
  const missingSubsystems = missingCoreSubsystems(input);

  if (
    input.finalStabilityConsolidationResult?.governanceStabilityClassification === "unstable" ||
    input.finalStabilityConsolidationResult?.governanceStabilityClassification === "partially_stable" ||
    (input.finalStabilityConsolidationResult?.fragileGovernanceAreas.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "unresolved_architecture_fragility",
        area: "final_stability_consolidation",
        description:
          "Architecture freeze readiness is limited by unresolved final stability fragility.",
        evidence: [
          input.finalStabilityConsolidationResult
            ? `Final stability classification: ${input.finalStabilityConsolidationResult.governanceStabilityClassification}`
            : "Final stability consolidation result was not supplied.",
          ...(input.finalStabilityConsolidationResult?.fragileGovernanceAreas ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review final stability fragile areas before architecture freeze readiness is accepted.",
      }),
    );
  }

  if (
    input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityClassification ===
      "version_fragile" ||
    input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityClassification ===
      "partially_survivable" ||
    input.traceabilitySurvivabilityResult?.traceabilitySurvivabilityClassification === "collapsed" ||
    input.traceabilitySurvivabilityResult?.traceabilitySurvivabilityClassification === "partially_traceable" ||
    input.normalizationResult?.normalizationClassification === "fragmented" ||
    input.normalizationResult?.normalizationClassification === "partially_normalized"
  ) {
    findings.push(
      createFinding({
        type: "unstable_contract",
        area: "stable_reusable_contracts",
        description:
          "Reusable governance contract candidates need stronger semantic, traceability, or normalization stability.",
        evidence: [
          input.semanticVersionSurvivabilityResult
            ? `Semantic-version classification: ${input.semanticVersionSurvivabilityResult.semanticVersionSurvivabilityClassification}`
            : "Semantic-version survivability result was not supplied.",
          input.traceabilitySurvivabilityResult
            ? `Traceability survivability classification: ${input.traceabilitySurvivabilityResult.traceabilitySurvivabilityClassification}`
            : "Traceability survivability result was not supplied.",
          input.normalizationResult
            ? `Normalization classification: ${input.normalizationResult.normalizationClassification}`
            : "Normalization result was not supplied.",
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review semantic, traceability, and normalization stability before formalizing reusable contracts.",
      }),
    );
  }

  if (
    missingSubsystems.length > 0 ||
    !["stable", "institutionally_stable"].includes(
      input.finalStabilityConsolidationResult?.governanceStabilityClassification ?? "",
    )
  ) {
    findings.push(
      createFinding({
        type: "premature_freeze_risk",
        area: "final_stability_consolidation",
        description:
          "Architecture freeze would be premature without complete subsystem evidence and stable final consolidation.",
        evidence: [
          ...missingSubsystems.map((subsystem) => `Missing subsystem: ${subsystem}`),
          input.finalStabilityConsolidationResult
            ? `Final stability classification: ${input.finalStabilityConsolidationResult.governanceStabilityClassification}`
            : "Final stability consolidation result was not supplied.",
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review subsystem completeness and final stability before any architecture freeze decision.",
      }),
    );
  }

  if ((input.auditResult?.orchestrationContaminationRisks.length ?? 0) > 0) {
    findings.push(
      createFinding({
        type: "hidden_orchestration_contamination",
        area: "orchestration_isolation",
        description:
          "Orchestration contamination risks must be reviewed before freeze readiness.",
        evidence: [...(input.auditResult?.orchestrationContaminationRisks ?? [])],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review orchestration contamination risks before freeze readiness.",
      }),
    );
  }

  if ((input.auditResult?.hiddenExecutionPathwayRisks.length ?? 0) > 0) {
    findings.push(
      createFinding({
        type: "hidden_execution_pathway_risk",
        area: "orchestration_isolation",
        description:
          "Hidden execution pathway risks must be reviewed before freeze readiness.",
        evidence: [...(input.auditResult?.hiddenExecutionPathwayRisks ?? [])],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review hidden execution pathway risks before freeze readiness.",
      }),
    );
  }

  if (missingSubsystems.length > 0) {
    findings.push(
      createFinding({
        type: "subsystem_inconsistency",
        area: "governance_readiness",
        description:
          "Freeze readiness confidence is limited by missing governance subsystem outputs.",
        evidence: missingSubsystems.map((subsystem) => `Missing subsystem: ${subsystem}`),
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Supply and review missing subsystem outputs before freeze readiness.",
      }),
    );
  }

  if (
    utilityCandidates(input).length === 0 ||
    !["stable", "institutionally_stable"].includes(
      input.finalStabilityConsolidationResult?.governanceStabilityClassification ?? "",
    )
  ) {
    findings.push(
      createFinding({
        type: "reusable_utility_instability",
        area: "shared_utility_extraction",
        description:
          "Shared utility extraction should remain review-only until final stability is strong enough.",
        evidence: [
          `Utility candidates identified: ${utilityCandidates(input).length}`,
          input.finalStabilityConsolidationResult
            ? `Final stability classification: ${input.finalStabilityConsolidationResult.governanceStabilityClassification}`
            : "Final stability consolidation result was not supplied.",
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Prepare a shared utility extraction plan only after freeze readiness is reviewed.",
      }),
    );
  }

  if ((input.semanticStabilityResult?.driftRisks.length ?? 0) > 0) {
    findings.push(
      createFinding({
        type: "semantic_instability",
        area: "semantic_stability",
        description:
          "Semantic drift risks should be reviewed before freeze readiness.",
        evidence: [...(input.semanticStabilityResult?.driftRisks ?? [])],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review semantic drift before architecture freeze readiness.",
      }),
    );
  }

  if ((input.traceabilityResult?.missingLinks.length ?? 0) > 0) {
    findings.push(
      createFinding({
        type: "traceability_weakness",
        area: "traceability",
        description:
          "Traceability weaknesses should be reviewed before freeze readiness.",
        evidence: [...(input.traceabilityResult?.missingLinks ?? [])],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review missing traceability links before architecture freeze readiness.",
      }),
    );
  }

  if ((input.explainabilityContinuityResult?.fragileExplainabilityAreas.length ?? 0) > 0) {
    findings.push(
      createFinding({
        type: "explainability_weakness",
        area: "explainability",
        description:
          "Explainability weaknesses should be reviewed before freeze readiness.",
        evidence: [...(input.explainabilityContinuityResult?.fragileExplainabilityAreas ?? [])],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review fragile explainability areas before architecture freeze readiness.",
      }),
    );
  }

  if (
    input.auditResult?.auditClassification === "critical_risk" ||
    input.auditResult?.auditClassification === "needs_attention" ||
    input.auditHistorySurvivabilityResult?.auditHistoryClassification === "fragmented"
  ) {
    findings.push(
      createFinding({
        type: "auditability_weakness",
        area: "auditability",
        description:
          "Auditability should be stronger before freeze readiness.",
        evidence: [
          input.auditResult
            ? `Audit classification: ${input.auditResult.auditClassification}`
            : "Full-system audit result was not supplied.",
          input.auditHistorySurvivabilityResult
            ? `Audit-history classification: ${input.auditHistorySurvivabilityResult.auditHistoryClassification}`
            : "Audit-history survivability result was not supplied.",
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review auditability before architecture freeze readiness.",
      }),
    );
  }

  if (
    input.survivabilityExpansionResult?.survivabilityClassification === "fragile" ||
    input.longHorizonInstitutionalResilienceResult?.resilienceClassification === "brittle"
  ) {
    findings.push(
      createFinding({
        type: "survivability_weakness",
        area: "survivability",
        description:
          "Survivability should be stronger before freeze readiness.",
        evidence: [
          input.survivabilityExpansionResult
            ? `Survivability classification: ${input.survivabilityExpansionResult.survivabilityClassification}`
            : "Survivability expansion result was not supplied.",
          input.longHorizonInstitutionalResilienceResult
            ? `Long-horizon resilience classification: ${input.longHorizonInstitutionalResilienceResult.resilienceClassification}`
            : "Long-horizon resilience result was not supplied.",
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review survivability and long-horizon resilience before freeze readiness.",
      }),
    );
  }

  if (
    (input.survivabilityExpansionResult?.fragileExpansionAreas.length ?? 0) > 0 ||
    (input.multiBusinessTenantIsolationResult?.fragileIsolationAreas.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "future_scaling_risk",
        area: "governance_scaling",
        description:
          "Future scaling risks should be reviewed before freeze readiness.",
        evidence: [
          ...(input.survivabilityExpansionResult?.fragileExpansionAreas ?? []),
          ...(input.multiBusinessTenantIsolationResult?.fragileIsolationAreas ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review expansion and isolation fragility before governance scaling.",
      }),
    );
  }

  if (
    (input.finalStabilityConsolidationResult?.institutionalDurabilityFindings.length ?? 0) > 0 ||
    (input.longHorizonInstitutionalResilienceResult?.institutionalContinuityFindings.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "institutional_durability_gap",
        area: "enterprise_integration",
        description:
          "Institutional durability gaps should be reviewed before freeze readiness.",
        evidence: [
          ...(input.finalStabilityConsolidationResult?.institutionalDurabilityFindings ?? []),
          ...(input.longHorizonInstitutionalResilienceResult?.institutionalContinuityFindings ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review institutional durability gaps before enterprise integration planning.",
      }),
    );
  }

  return findings;
}

function buildHumanReviewNotes(
  input: GovernanceArchitectureFreezeReadinessInput,
  findings: GovernanceArchitectureFreezeReadinessFinding[],
): string[] {
  return unique([
    "Human review is required before architecture freeze, shared utility extraction, operational deployment, or enterprise integration.",
    "This review is read-only and does not freeze architecture, extract utilities, implement persistence, mutate semantics, or trigger orchestration.",
    ...findings.map((finding) => finding.recommendedHumanReview),
    ...(input.finalStabilityConsolidationResult?.humanReviewNotes ?? []),
    ...(input.longHorizonInstitutionalResilienceResult?.humanReviewNotes ?? []),
    ...(input.multiBusinessTenantIsolationResult?.humanReviewNotes ?? []),
    ...(input.semanticVersionSurvivabilityResult?.humanReviewNotes ?? []),
  ]);
}

function buildFinalRecommendations(
  input: GovernanceArchitectureFreezeReadinessInput,
  findings: GovernanceArchitectureFreezeReadinessFinding[],
): string[] {
  return unique([
    missingCoreSubsystems(input).length > 0
      ? `Review missing subsystem outputs: ${missingCoreSubsystems(input).join(", ")}.`
      : "",
    "Keep architecture freeze readiness review-only until human approval explicitly authorizes a freeze or utility extraction plan.",
    "Prepare Shared Governance Utility Extraction Plan as REVIEW-ONLY first; do not extract utilities until explicitly approved.",
    ...findings.map((finding) => finding.recommendedHumanReview),
    ...(input.finalStabilityConsolidationResult?.finalStabilizationRecommendations ?? []),
    ...(input.longHorizonInstitutionalResilienceResult?.futureStabilizationRecommendations ?? []),
    ...(input.auditResult?.reusableInfrastructureOpportunities ?? []),
  ]);
}

export function runGovernanceArchitectureFreezeReadinessReview(
  input: GovernanceArchitectureFreezeReadinessInput,
): GovernanceArchitectureFreezeReadinessResult {
  const areaAssessments = buildAreaAssessments(input);
  const findings = buildFindings(input);
  const architectureFreezeReadinessScore = calculateOverallArchitectureFreezeReadinessScore({
    areaAssessments,
    findings,
  });
  const freezeReadinessClassification =
    architectureFreezeReadinessClassificationFromScore(architectureFreezeReadinessScore);

  const resultWithoutExplainability: Omit<
    GovernanceArchitectureFreezeReadinessResult,
    "explainability"
  > = {
    architectureFreezeReadinessScore,
    freezeReadinessClassification,
    areaAssessments,
    findings,
    freezeReadyAreas: areaAssessments
      .filter((area) => ["freeze_ready", "institutionally_freeze_ready"].includes(area.classification))
      .map((area) => `${area.area}: ${area.classification} at ${area.score}/100`),
    notFreezeReadyAreas: areaAssessments
      .filter((area) => ["not_ready_to_freeze", "partially_freeze_ready"].includes(area.classification))
      .map((area) => `${area.area}: ${area.classification} at ${area.score}/100`),
    stableContractCandidates: stableContractCandidates(input),
    unstableContractAreas: unique([
      ...areaAssessments
        .filter((area) =>
          ["stable_reusable_contracts", "semantic_version_survivability", "traceability", "lifecycle_continuity"].includes(
            area.area,
          ),
        )
        .filter((area) => ["not_ready_to_freeze", "partially_freeze_ready"].includes(area.classification))
        .map((area) => `${area.area}: ${area.classification} at ${area.score}/100`),
      ...findings
        .filter((finding) => finding.findingType === "unstable_contract")
        .map((finding) => finding.description),
    ]),
    reusableUtilityExtractionCandidates: utilityCandidates(input),
    governanceScalingFindings: findings
      .filter((finding) => finding.findingType === "future_scaling_risk")
      .map((finding) => finding.description),
    operationalDeploymentReadinessFindings: findings
      .filter((finding) =>
        ["hidden_execution_pathway_risk", "hidden_orchestration_contamination", "premature_freeze_risk"].includes(
          finding.findingType,
        ),
      )
      .map((finding) => finding.description),
    enterpriseIntegrationFindings: findings
      .filter((finding) =>
        ["institutional_durability_gap", "future_scaling_risk", "subsystem_inconsistency"].includes(
          finding.findingType,
        ),
      )
      .map((finding) => finding.description),
    institutionalDurabilityFindings: findings
      .filter((finding) =>
        [
          "institutional_durability_gap",
          "unresolved_architecture_fragility",
          "premature_freeze_risk",
          "survivability_weakness",
        ].includes(finding.findingType),
      )
      .map((finding) => finding.description),
    humanReviewNotes: buildHumanReviewNotes(input, findings),
    finalRecommendations: buildFinalRecommendations(input, findings),
    humanReviewRequired:
      findings.length > 0 ||
      areaAssessments.some((area) =>
        ["not_ready_to_freeze", "partially_freeze_ready"].includes(area.classification),
      ),
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernanceArchitectureFreezeReadinessExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}
