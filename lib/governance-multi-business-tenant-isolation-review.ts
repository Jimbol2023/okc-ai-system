import { buildGovernanceMultiBusinessTenantIsolationExplainability } from "./governance-multi-business-tenant-isolation-review-explainability";
import {
  calculateMultiBusinessTenantIsolationAreaScore,
  calculateMultiBusinessTenantIsolationFindingConfidence,
  calculateOverallMultiBusinessTenantIsolationScore,
  multiBusinessTenantIsolationClassificationFromScore,
} from "./governance-multi-business-tenant-isolation-review-scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
} from "./full-system-governance-audit-types";
import type {
  GovernanceMultiBusinessTenantIsolationArea,
  GovernanceMultiBusinessTenantIsolationAreaAssessment,
  GovernanceMultiBusinessTenantIsolationFinding,
  GovernanceMultiBusinessTenantIsolationFindingType,
  GovernanceMultiBusinessTenantIsolationInput,
  GovernanceMultiBusinessTenantIsolationResult,
} from "./governance-multi-business-tenant-isolation-review-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

type AreaInput = {
  area: GovernanceMultiBusinessTenantIsolationArea;
  description: string;
  baseScore: number;
  isolationStrengthSignals: string[];
  isolationRiskSignals: string[];
  recommendedHumanReview: string;
  reasoning: string;
};

const BOUNDARY_METADATA_KEYS = [
  "businessLineId",
  "tenantId",
  "businessUnitScope",
  "tenantScope",
  "isolationBoundaryId",
  "dataPartitionStrategy",
  "auditIsolationScope",
  "traceabilityIsolationScope",
  "explainabilityIsolationScope",
  "observabilityIsolationScope",
  "orchestrationIsolationScope",
  "reconstructionScope",
] as const;

function unique(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter((value) => value.length > 0)),
  );
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function slug(value: string): string {
  return normalize(value).slice(0, 72) || "isolation_review";
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

function contextValue(
  input: GovernanceMultiBusinessTenantIsolationInput,
  key: (typeof BOUNDARY_METADATA_KEYS)[number],
): string | undefined {
  const contextValueCandidate = input.isolationContext?.[key];
  if (typeof contextValueCandidate === "string" && contextValueCandidate.trim().length > 0) {
    return contextValueCandidate.trim();
  }

  const metadataValue = input.metadata?.[key];
  return typeof metadataValue === "string" && metadataValue.trim().length > 0
    ? metadataValue.trim()
    : undefined;
}

function contextList(
  input: GovernanceMultiBusinessTenantIsolationInput,
  key: "businessUnitScope" | "tenantScope",
): string[] {
  const contextValueCandidate = input.isolationContext?.[key];
  if (Array.isArray(contextValueCandidate)) {
    return unique(contextValueCandidate);
  }

  return unique(stringsFromUnknown(input.metadata?.[key]));
}

function missingBoundarySignals(input: GovernanceMultiBusinessTenantIsolationInput): string[] {
  return BOUNDARY_METADATA_KEYS.filter((key) => {
    if (key === "businessUnitScope" || key === "tenantScope") {
      return contextList(input, key).length === 0;
    }

    return !contextValue(input, key);
  }).map((key) => `Missing boundary context: ${key}`);
}

function getAuditFindings(
  input: GovernanceMultiBusinessTenantIsolationInput,
): FullSystemGovernanceAuditFinding[] {
  return [...(input.auditFindings ?? []), ...(input.auditResult?.findings ?? [])];
}

function getRecommendations(
  input: GovernanceMultiBusinessTenantIsolationInput,
): FullSystemGovernanceAuditRecommendation[] {
  return [...(input.recommendations ?? []), ...(input.auditResult?.recommendations ?? [])];
}

function auditCategories(
  input: GovernanceMultiBusinessTenantIsolationInput,
): FullSystemGovernanceAuditCategory[] {
  return unique(
    getAuditFindings(input)
      .map((finding) => finding.category)
      .concat(Object.keys(input.auditResult?.categoryScores ?? {}) as FullSystemGovernanceAuditCategory[]),
  ) as FullSystemGovernanceAuditCategory[];
}

function statusScore(status?: string): number {
  switch (status) {
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
    case "anti_fragile":
      return 90;
    case "stable":
    case "registry_candidate":
    case "normalized":
    case "operationally_ready":
    case "reliable":
    case "resilient":
    case "aligned":
      return 76;
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

function boundaryMetadataScore(input: GovernanceMultiBusinessTenantIsolationInput, keys: string[]): number {
  const suppliedCount = keys.filter((key) => {
    if (key === "businessUnitScope" || key === "tenantScope") {
      return contextList(input, key).length > 0;
    }

    return Boolean(contextValue(input, key as (typeof BOUNDARY_METADATA_KEYS)[number]));
  }).length;

  return keys.length === 0 ? 50 : Math.round((suppliedCount / keys.length) * 100);
}

function createAreaAssessment(params: AreaInput): GovernanceMultiBusinessTenantIsolationAreaAssessment {
  const score = calculateMultiBusinessTenantIsolationAreaScore({
    baseScore: params.baseScore,
    isolationStrengthSignalCount: params.isolationStrengthSignals.length,
    isolationRiskSignalCount: params.isolationRiskSignals.length,
    findingCount: params.isolationRiskSignals.length,
    explainabilityCount:
      params.reasoning.length > 0
        ? params.isolationStrengthSignals.length + 1
        : params.isolationStrengthSignals.length,
  });

  return {
    area: params.area,
    score,
    classification: multiBusinessTenantIsolationClassificationFromScore(score),
    description: params.description,
    isolationStrengthSignals: unique(params.isolationStrengthSignals),
    isolationRiskSignals: unique(params.isolationRiskSignals),
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors: unique([...params.isolationStrengthSignals, ...params.isolationRiskSignals]),
      reasoning: unique([
        params.reasoning,
        params.isolationRiskSignals.length > 0
          ? "Isolation survivability depends on human review of weak boundary signals before future tenant or business expansion."
          : "",
      ]),
    },
  };
}

function buildAreaAssessments(
  input: GovernanceMultiBusinessTenantIsolationInput,
): GovernanceMultiBusinessTenantIsolationAreaAssessment[] {
  const recommendations = getRecommendations(input);
  const sharedInfrastructureNotes = unique([
    ...(input.isolationContext?.sharedInfrastructureNotes ?? []),
    ...stringsFromUnknown(input.metadata?.sharedInfrastructureNotes),
  ]);
  const boundaryLimitations = unique([
    ...(input.isolationContext?.boundaryLimitations ?? []),
    ...stringsFromUnknown(input.metadata?.boundaryLimitations),
  ]);

  return [
    createAreaAssessment({
      area: "business_isolation",
      description:
        "Reviews whether governance structures can remain separated across future business lines and operating divisions.",
      baseScore: average([
        statusScore(input.survivabilityExpansionResult?.expansionClassification),
        statusScore(input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityClassification),
        boundaryMetadataScore(input, ["businessLineId", "businessUnitScope", "isolationBoundaryId"]),
      ]),
      isolationStrengthSignals: [
        contextValue(input, "businessLineId") ? `Business line context: ${contextValue(input, "businessLineId")}` : "",
        ...contextList(input, "businessUnitScope").map((scope) => `Business unit scope: ${scope}`),
        ...(input.survivabilityExpansionResult?.crossIndustrySurvivabilityFindings ?? []),
      ],
      isolationRiskSignals: [
        !contextValue(input, "businessLineId") ? "Business line boundary context is not supplied." : "",
        contextList(input, "businessUnitScope").length === 0
          ? "Business unit scope is not supplied."
          : "",
        ...(input.survivabilityExpansionResult?.fragileExpansionAreas ?? []).filter((area) =>
          normalize(area).includes("business"),
        ),
        ...boundaryLimitations,
      ],
      recommendedHumanReview:
        "Review business-line and business-unit boundaries before future multi-business reuse.",
      reasoning:
        "Business isolation improves when business line, business unit scope, and expansion survivability signals remain explicit.",
    }),
    createAreaAssessment({
      area: "tenant_isolation",
      description:
        "Evaluates whether future tenant-level governance review can remain separated without tenant persistence or execution.",
      baseScore: average([
        statusScore(input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityClassification),
        statusScore(input.observabilityDurabilityResult?.observabilityScalabilityClassification),
        boundaryMetadataScore(input, ["tenantId", "tenantScope", "isolationBoundaryId", "dataPartitionStrategy"]),
      ]),
      isolationStrengthSignals: [
        contextValue(input, "tenantId") ? `Tenant context: ${contextValue(input, "tenantId")}` : "",
        ...contextList(input, "tenantScope").map((scope) => `Tenant scope: ${scope}`),
        contextValue(input, "dataPartitionStrategy")
          ? `Data partition strategy: ${contextValue(input, "dataPartitionStrategy")}`
          : "",
      ],
      isolationRiskSignals: [
        !contextValue(input, "tenantId") ? "Tenant boundary context is not supplied." : "",
        contextList(input, "tenantScope").length === 0 ? "Tenant scope is not supplied." : "",
        !contextValue(input, "dataPartitionStrategy")
          ? "Data partition strategy context is not supplied."
          : "",
        ...(input.observabilityDurabilityResult?.crossIndustryObservabilityFindings ?? []).filter((finding) =>
          normalize(finding).includes("tenant"),
        ),
        ...sharedInfrastructureNotes.map((note) => `Shared infrastructure note: ${note}`),
      ],
      recommendedHumanReview:
        "Review tenant boundary assumptions and shared infrastructure notes before future tenant scaling.",
      reasoning:
        "Tenant isolation reviewability improves when tenant scope and partitioning assumptions are explicit without adding runtime tenant execution.",
    }),
    createAreaAssessment({
      area: "governance_isolation",
      description:
        "Reviews whether governance review structures remain isolated from execution, tenant mutation, and cross-business leakage.",
      baseScore: average([
        input.auditResult?.categoryScores.governance_safety ?? 42,
        statusScore(input.readinessResult?.readinessClassification),
        statusScore(input.assuranceResult?.overallAssuranceStatus),
      ]),
      isolationStrengthSignals: [
        ...(input.auditResult?.governanceSafetyNotes ?? []),
        ...(input.doctrineDurabilityResult?.durableDoctrineAreas ?? []),
      ],
      isolationRiskSignals: [
        ...(input.auditResult?.risks ?? []).filter((risk) => normalize(risk).includes("governance")),
        ...(input.auditResult?.hiddenExecutionPathwayRisks ?? []),
        ...recommendations
          .filter((recommendation) => recommendation.classification === "Immediate")
          .map((recommendation) => `Immediate governance review item: ${recommendation.recommendation}`),
      ],
      recommendedHumanReview:
        "Review governance safety and execution-boundary findings before future cross-business reuse.",
      reasoning:
        "Governance isolation is stronger when review outputs remain separate from routes, execution, automation, and tenant mutation.",
    }),
    createAreaAssessment({
      area: "audit_isolation",
      description:
        "Evaluates whether audit structures can remain separated and reconstructable across business and tenant boundaries.",
      baseScore: average([
        input.auditResult?.categoryScores.architecture_integrity ?? 42,
        input.auditResult?.categoryScores.dependency_integrity ?? 42,
        statusScore(input.auditHistorySurvivabilityResult?.auditHistoryClassification),
      ]),
      isolationStrengthSignals: [
        ...(input.auditResult?.architectureObservations ?? []),
        ...(input.auditHistorySurvivabilityResult?.durableAuditHistoryAreas ?? []),
        contextValue(input, "auditIsolationScope")
          ? `Audit isolation scope: ${contextValue(input, "auditIsolationScope")}`
          : "",
      ],
      isolationRiskSignals: [
        ...(input.auditHistorySurvivabilityResult?.fragileAuditHistoryAreas ?? []),
        ...(input.auditHistorySurvivabilityResult?.governanceHistoryFindings ?? []),
        !contextValue(input, "auditIsolationScope") ? "Audit isolation scope is not supplied." : "",
      ],
      recommendedHumanReview:
        "Review audit boundaries and audit-history reconstruction assumptions before future tenant or business scaling.",
      reasoning:
        "Audit isolation remains durable when audit categories, findings, and history can be reconstructed within a clear boundary scope.",
    }),
    createAreaAssessment({
      area: "traceability_isolation",
      description:
        "Checks whether evidence, recommendation, principle, reasoning, lineage, and audit links can stay separated across boundaries.",
      baseScore: average([
        statusScore(input.traceabilitySurvivabilityResult?.traceabilitySurvivabilityClassification),
        statusScore(input.traceabilityResult?.traceabilityClassification),
        input.auditResult?.categoryScores.traceability_integrity ?? 42,
      ]),
      isolationStrengthSignals: [
        ...(input.traceabilitySurvivabilityResult?.durableTraceabilityAreas ?? []),
        contextValue(input, "traceabilityIsolationScope")
          ? `Traceability isolation scope: ${contextValue(input, "traceabilityIsolationScope")}`
          : "",
      ],
      isolationRiskSignals: [
        ...(input.traceabilitySurvivabilityResult?.fragileTraceabilityAreas ?? []),
        ...(input.traceabilitySurvivabilityResult?.lineageLinkageFindings ?? []),
        ...(input.traceabilityResult?.missingLinks ?? []),
        !contextValue(input, "traceabilityIsolationScope")
          ? "Traceability isolation scope is not supplied."
          : "",
      ],
      recommendedHumanReview:
        "Review traceability scopes and lineage-linkage findings before future multi-tenant reconstruction.",
      reasoning:
        "Traceability isolation improves when evidence and reasoning links remain reconstructable inside clear tenant and business scopes.",
    }),
    createAreaAssessment({
      area: "explainability_isolation",
      description:
        "Reviews whether reasoning, score explanation, limitation visibility, and human-review notes remain boundary-safe.",
      baseScore: average([
        statusScore(input.explainabilityContinuityResult?.explainabilityContinuityClassification),
        input.auditResult?.categoryScores.explainability_integrity ?? 42,
        boundaryMetadataScore(input, ["explainabilityIsolationScope"]),
      ]),
      isolationStrengthSignals: [
        ...(input.explainabilityContinuityResult?.durableExplainabilityAreas ?? []),
        contextValue(input, "explainabilityIsolationScope")
          ? `Explainability isolation scope: ${contextValue(input, "explainabilityIsolationScope")}`
          : "",
      ],
      isolationRiskSignals: [
        ...(input.explainabilityContinuityResult?.fragileExplainabilityAreas ?? []),
        ...(input.explainabilityContinuityResult?.reasoningContinuityFindings ?? []),
        !contextValue(input, "explainabilityIsolationScope")
          ? "Explainability isolation scope is not supplied."
          : "",
      ],
      recommendedHumanReview:
        "Review explainability scopes so future tenant or business outputs remain separately understandable.",
      reasoning:
        "Explainability isolation depends on boundary-specific reasoning, limitations, and human-review context.",
    }),
    createAreaAssessment({
      area: "survivability_isolation",
      description:
        "Evaluates whether survivability and expansion reviews remain modular across future industries, tenants, and AI-agent clusters.",
      baseScore: average([
        statusScore(input.survivabilityExpansionResult?.survivabilityClassification),
        statusScore(input.survivabilityExpansionResult?.expansionClassification),
        statusScore(input.resilienceResult?.resilienceStatus),
      ]),
      isolationStrengthSignals: [
        ...(input.survivabilityExpansionResult?.durableArchitectureAreas ?? []),
        ...(input.resilienceResult?.resilienceStrengths ?? []),
      ],
      isolationRiskSignals: [
        ...(input.survivabilityExpansionResult?.fragileExpansionAreas ?? []),
        ...(input.survivabilityExpansionResult?.crossIndustrySurvivabilityFindings ?? []).filter(
          (finding) => normalize(finding).includes("risk") || normalize(finding).includes("weak"),
        ),
        ...(input.resilienceResult?.fragilityIndicators ?? []),
      ],
      recommendedHumanReview:
        "Review survivability fragmentation risks before future multi-business or AI-agent expansion.",
      reasoning:
        "Survivability isolation improves when resilience and expansion findings remain modular and business-neutral.",
    }),
    createAreaAssessment({
      area: "semantic_isolation",
      description:
        "Reviews whether terminology, classifications, taxonomy, and semantic-version structures can avoid cross-business contamination.",
      baseScore: average([
        statusScore(input.semanticStabilityResult?.semanticStabilityClassification),
        statusScore(input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityClassification),
      ]),
      isolationStrengthSignals: [
        ...(input.semanticStabilityResult?.stableTerms ?? []).map((term) => `Stable term: ${term}`),
        ...(input.semanticVersionSurvivabilityResult?.versionStableSemanticAreas ?? []),
      ],
      isolationRiskSignals: [
        ...(input.semanticStabilityResult?.driftRisks ?? []),
        ...(input.semanticVersionSurvivabilityResult?.versionFragileSemanticAreas ?? []),
        ...(input.semanticVersionSurvivabilityResult?.classificationVersionFindings ?? []),
      ],
      recommendedHumanReview:
        "Review semantic drift and classification-version findings before future cross-business taxonomy reuse.",
      reasoning:
        "Semantic isolation is stronger when terminology remains stable and versioned meanings can be reconstructed per business scope.",
    }),
    createAreaAssessment({
      area: "doctrine_isolation",
      description:
        "Evaluates whether doctrine principles and durability findings remain reusable without cross-business enforcement.",
      baseScore: average([
        statusScore(input.doctrineDurabilityResult?.doctrineDurabilityClassification),
        statusScore(input.doctrineResult?.doctrineStatus),
        statusScore(input.registryReviewResult?.registryReadinessClassification),
      ]),
      isolationStrengthSignals: [
        ...(input.doctrineDurabilityResult?.durableDoctrineAreas ?? []),
        ...(input.doctrineResult?.durablePatterns ?? []),
      ],
      isolationRiskSignals: [
        ...(input.doctrineDurabilityResult?.fragileDoctrineAreas ?? []),
        ...(input.doctrineDurabilityResult?.futureGovernanceExpansionRisks ?? []),
        ...(input.doctrineResult?.doctrineLimitations ?? []),
      ],
      recommendedHumanReview:
        "Review doctrine scope and expansion risks so doctrine remains review-only and business-neutral.",
      reasoning:
        "Doctrine isolation improves when doctrine remains principle-level guidance for human review rather than centralized enforcement.",
    }),
    createAreaAssessment({
      area: "observability_isolation",
      description:
        "Checks whether governance visibility and dashboard semantics can avoid tenant or business leakage.",
      baseScore: average([
        statusScore(input.observabilityDurabilityResult?.observabilityDurabilityClassification),
        statusScore(input.observabilityDurabilityResult?.observabilityScalabilityClassification),
        boundaryMetadataScore(input, ["observabilityIsolationScope"]),
      ]),
      isolationStrengthSignals: [
        ...(input.observabilityDurabilityResult?.durableObservabilityAreas ?? []),
        contextValue(input, "observabilityIsolationScope")
          ? `Observability isolation scope: ${contextValue(input, "observabilityIsolationScope")}`
          : "",
      ],
      isolationRiskSignals: [
        ...(input.observabilityDurabilityResult?.fragileObservabilityAreas ?? []),
        ...(input.observabilityDurabilityResult?.crossIndustryObservabilityFindings ?? []),
        !contextValue(input, "observabilityIsolationScope")
          ? "Observability isolation scope is not supplied."
          : "",
      ],
      recommendedHumanReview:
        "Review observability and dashboard boundary assumptions before future multi-tenant visibility expansion.",
      reasoning:
        "Observability isolation requires dashboard and visibility structures that remain reviewable without cross-tenant leakage.",
    }),
    createAreaAssessment({
      area: "reviewability_isolation",
      description:
        "Reviews whether findings remain understandable, reconstructable, and human-auditable inside future business or tenant boundaries.",
      baseScore: average([
        statusScore(input.reviewabilityIntegrityResult?.reviewabilityClassification),
        input.reviewabilityIntegrityResult?.reviewabilityIntegrityScore ?? 42,
      ]),
      isolationStrengthSignals: [
        ...(input.reviewabilityIntegrityResult?.reviewableAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.humanReviewFindings ?? []),
      ],
      isolationRiskSignals: [
        ...(input.reviewabilityIntegrityResult?.weakReviewabilityAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.reconstructionRisks ?? []),
      ],
      recommendedHumanReview:
        "Review weak reviewability and reconstruction areas before future tenant-scoped audits.",
      reasoning:
        "Reviewability isolation improves when humans can reconstruct findings within each boundary without relying on mixed context.",
    }),
    createAreaAssessment({
      area: "orchestration_review_isolation",
      description:
        "Evaluates whether governance review structures remain isolated from orchestration growth and execution pathways.",
      baseScore: average([
        input.auditResult?.categoryScores.orchestration_purity ?? 42,
        boundaryMetadataScore(input, ["orchestrationIsolationScope"]),
      ]),
      isolationStrengthSignals: [
        contextValue(input, "orchestrationIsolationScope")
          ? `Orchestration isolation scope: ${contextValue(input, "orchestrationIsolationScope")}`
          : "",
        "Review module does not trigger orchestration or workflow mutation.",
      ],
      isolationRiskSignals: [
        ...(input.auditResult?.orchestrationContaminationRisks ?? []),
        ...(input.auditResult?.hiddenExecutionPathwayRisks ?? []),
        !contextValue(input, "orchestrationIsolationScope")
          ? "Orchestration isolation scope is not supplied."
          : "",
      ],
      recommendedHumanReview:
        "Review orchestration contamination and hidden execution pathway risks before future AI-agent clusters.",
      reasoning:
        "Orchestration review isolation requires governance review outputs to remain separate from execution, messaging, and workflow mutation.",
    }),
    createAreaAssessment({
      area: "institutional_memory_isolation",
      description:
        "Reviews whether governance memory and audit history can remain reconstructable within business and tenant boundaries.",
      baseScore: average([
        statusScore(input.institutionalMemoryContinuityResult?.memoryContinuityClassification),
        statusScore(input.memoryResult?.institutionalMemoryStatus),
        boundaryMetadataScore(input, ["reconstructionScope"]),
      ]),
      isolationStrengthSignals: [
        ...(input.institutionalMemoryContinuityResult?.durableMemoryAreas ?? []),
        ...(input.memoryResult?.longHorizonContext ?? []),
        contextValue(input, "reconstructionScope")
          ? `Reconstruction scope: ${contextValue(input, "reconstructionScope")}`
          : "",
      ],
      isolationRiskSignals: [
        ...(input.institutionalMemoryContinuityResult?.fragileMemoryAreas ?? []),
        ...(input.institutionalMemoryContinuityResult?.lineageReconstructionFindings ?? []),
        ...(input.institutionalMemoryContinuityResult?.governanceHistoryReconstructionFindings ?? []),
        !contextValue(input, "reconstructionScope") ? "Reconstruction scope is not supplied." : "",
      ],
      recommendedHumanReview:
        "Review memory and reconstruction scopes before future tenant-specific institutional history work.",
      reasoning:
        "Institutional memory isolation improves when history, lineage, and memory context remain reconstructable by boundary.",
    }),
    createAreaAssessment({
      area: "lifecycle_continuity_isolation",
      description:
        "Evaluates whether lifecycle, compatibility, migration, and versioning continuity can stay boundary-safe over time.",
      baseScore: average([
        statusScore(input.lifecycleContinuityResult?.lifecycleContinuityClassification),
        statusScore(input.versioningReadinessResult?.versioningReadinessClassification),
        statusScore(input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityClassification),
      ]),
      isolationStrengthSignals: [
        ...(input.lifecycleContinuityResult?.durableContinuityAreas ?? []),
        ...(input.versioningReadinessResult?.stableVersionReadyAreas ?? []),
        ...(input.compatibilityMigrationContext?.humanReviewNotes ?? []),
      ],
      isolationRiskSignals: [
        ...(input.lifecycleContinuityResult?.fragileContinuityAreas ?? []),
        ...(input.lifecycleContinuityResult?.migrationContinuityFindings ?? []),
        ...(input.versioningReadinessResult?.migrationRiskFindings ?? []),
        ...(input.compatibilityMigrationContext?.migrationFindings ?? []),
      ],
      recommendedHumanReview:
        "Review lifecycle, compatibility, and migration boundaries before future tenant-aware evolution.",
      reasoning:
        "Lifecycle isolation improves when versioning, migration, and compatibility reviews remain human-reviewed and boundary-specific.",
    }),
  ];
}

function severityFor(
  findingType: GovernanceMultiBusinessTenantIsolationFindingType,
  evidenceCount: number,
): ReputationSeverity {
  if (
    findingType === "tenant_contamination_risk" ||
    findingType === "governance_leakage_risk" ||
    findingType === "orchestration_boundary_weakness" ||
    findingType === "cross_business_reconstruction_risk"
  ) {
    return evidenceCount >= 4 ? "elevated" : "moderate";
  }

  return evidenceCount >= 4 ? "moderate" : "low";
}

function createFinding(params: {
  type: GovernanceMultiBusinessTenantIsolationFindingType;
  area: GovernanceMultiBusinessTenantIsolationArea;
  description: string;
  evidence: string[];
  affectedAuditCategories?: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
}): GovernanceMultiBusinessTenantIsolationFinding {
  const evidence = unique(params.evidence);
  const confidenceScore = calculateMultiBusinessTenantIsolationFindingConfidence({
    evidenceCount: evidence.length,
    factorCount: 2 + (params.recommendedHumanReview.length > 0 ? 1 : 0),
  });

  return {
    id: `multi-business-tenant-isolation-${slug(params.type)}-${slug(params.description)}`,
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
        "This finding is produced from deterministic read-only isolation checks across supplied governance review outputs and boundary context.",
        evidence.length === 0
          ? "Finding confidence is limited because supporting boundary evidence was not supplied."
          : "",
      ]),
    },
  };
}

function buildFindings(
  input: GovernanceMultiBusinessTenantIsolationInput,
): GovernanceMultiBusinessTenantIsolationFinding[] {
  const categories = auditCategories(input);
  const findings: GovernanceMultiBusinessTenantIsolationFinding[] = [];
  const missingBoundaries = missingBoundarySignals(input);
  const traceabilityRisks = unique([
    ...(input.traceabilitySurvivabilityResult?.fragileTraceabilityAreas ?? []),
    ...(input.traceabilitySurvivabilityResult?.lineageLinkageFindings ?? []),
    ...(input.traceabilityResult?.missingLinks ?? []),
  ]);
  const explainabilityRisks = unique([
    ...(input.explainabilityContinuityResult?.fragileExplainabilityAreas ?? []),
    ...(input.explainabilityContinuityResult?.reasoningContinuityFindings ?? []),
  ]);
  const semanticRisks = unique([
    ...(input.semanticStabilityResult?.driftRisks ?? []),
    ...(input.semanticVersionSurvivabilityResult?.versionFragileSemanticAreas ?? []),
  ]);
  const reconstructionRisks = unique([
    ...(input.reviewabilityIntegrityResult?.reconstructionRisks ?? []),
    ...(input.traceabilitySurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
    ...(input.institutionalMemoryContinuityResult?.governanceHistoryReconstructionFindings ?? []),
    ...(input.auditHistorySurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
  ]);

  if (
    missingBoundaries.some((signal) => normalize(signal).includes("tenant")) ||
    !contextValue(input, "dataPartitionStrategy") ||
    (input.observabilityDurabilityResult?.crossIndustryObservabilityFindings ?? []).some((finding) =>
      normalize(finding).includes("tenant"),
    )
  ) {
    findings.push(
      createFinding({
        type: "tenant_contamination_risk",
        area: "tenant_isolation",
        description:
          "Tenant isolation confidence is limited by missing tenant boundary or partitioning context.",
        evidence: [
          ...missingBoundaries.filter((signal) => normalize(signal).includes("tenant")),
          !contextValue(input, "dataPartitionStrategy")
            ? "Data partition strategy context is not supplied."
            : "",
          ...(input.observabilityDurabilityResult?.crossIndustryObservabilityFindings ?? []).filter(
            (finding) => normalize(finding).includes("tenant"),
          ),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review tenant boundary, tenant scope, and partitioning assumptions before future tenant scaling.",
      }),
    );
  }

  if (
    (input.auditResult?.hiddenExecutionPathwayRisks.length ?? 0) > 0 ||
    (input.auditResult?.risks ?? []).some((risk) => normalize(risk).includes("governance")) ||
    missingBoundaries.some((signal) => normalize(signal).includes("business"))
  ) {
    findings.push(
      createFinding({
        type: "governance_leakage_risk",
        area: "governance_isolation",
        description:
          "Governance isolation needs clearer business-boundary context and continued separation from execution pathways.",
        evidence: [
          ...(input.auditResult?.hiddenExecutionPathwayRisks ?? []),
          ...(input.auditResult?.risks ?? []).filter((risk) => normalize(risk).includes("governance")),
          ...missingBoundaries.filter((signal) => normalize(signal).includes("business")),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review governance boundary notes and execution-pathway risks before future cross-business reuse.",
      }),
    );
  }

  if (traceabilityRisks.length > 0 || !contextValue(input, "traceabilityIsolationScope")) {
    findings.push(
      createFinding({
        type: "traceability_crossover_risk",
        area: "traceability_isolation",
        description:
          "Traceability links may be harder to reconstruct by business or tenant boundary without stronger scope context.",
        evidence: [
          ...traceabilityRisks,
          !contextValue(input, "traceabilityIsolationScope")
            ? "Traceability isolation scope is not supplied."
            : "",
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review traceability scope, lineage linkage, and missing links before future boundary-specific audits.",
      }),
    );
  }

  if (explainabilityRisks.length > 0 || !contextValue(input, "explainabilityIsolationScope")) {
    findings.push(
      createFinding({
        type: "explainability_crossover_risk",
        area: "explainability_isolation",
        description:
          "Explainability may blend boundary context unless reasoning and limitation scopes remain explicit.",
        evidence: [
          ...explainabilityRisks,
          !contextValue(input, "explainabilityIsolationScope")
            ? "Explainability isolation scope is not supplied."
            : "",
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review explainability and reasoning scopes before future tenant or business-specific review outputs.",
      }),
    );
  }

  if (
    semanticRisks.length > 0 ||
    input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityClassification ===
      "version_fragile" ||
    input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityClassification ===
      "partially_survivable"
  ) {
    findings.push(
      createFinding({
        type: "semantic_contamination_risk",
        area: "semantic_isolation",
        description:
          "Semantic isolation may weaken if terminology or classification meanings drift across business or tenant contexts.",
        evidence: [
          ...semanticRisks,
          input.semanticVersionSurvivabilityResult
            ? `Semantic-version survivability classification: ${input.semanticVersionSurvivabilityResult.semanticVersionSurvivabilityClassification}`
            : "Semantic-version survivability review result was not supplied.",
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review semantic-version and terminology risks before future cross-business taxonomy reuse.",
      }),
    );
  }

  if (
    input.auditResult?.auditClassification === "critical_risk" ||
    input.auditResult?.auditClassification === "needs_attention" ||
    (input.auditHistorySurvivabilityResult?.fragileAuditHistoryAreas.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "audit_contamination_risk",
        area: "audit_isolation",
        description:
          "Audit isolation needs stronger audit-history and category-boundary evidence before future scaling.",
        evidence: [
          input.auditResult
            ? `Audit classification: ${input.auditResult.auditClassification}`
            : "Full-system governance audit result was not supplied.",
          ...(input.auditHistorySurvivabilityResult?.fragileAuditHistoryAreas ?? []),
          ...(input.auditHistorySurvivabilityResult?.governanceHistoryFindings ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review audit category isolation and audit-history reconstruction before future tenant or business expansion.",
      }),
    );
  }

  if (
    input.survivabilityExpansionResult?.survivabilityClassification === "fragile" ||
    input.survivabilityExpansionResult?.survivabilityClassification === "conditionally_scalable" ||
    (input.survivabilityExpansionResult?.fragileExpansionAreas.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "survivability_fragmentation_risk",
        area: "survivability_isolation",
        description:
          "Expansion survivability may fragment without stronger modular boundary evidence.",
        evidence: [
          input.survivabilityExpansionResult
            ? `Survivability classification: ${input.survivabilityExpansionResult.survivabilityClassification}`
            : "Survivability expansion review result was not supplied.",
          ...(input.survivabilityExpansionResult?.fragileExpansionAreas ?? []),
          ...(input.survivabilityExpansionResult?.crossIndustrySurvivabilityFindings ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review survivability fragmentation areas before future multi-business or multi-tenant growth.",
      }),
    );
  }

  if (
    !input.lineageResult ||
    input.lineageResult.lineageIntegrityScore < 70 ||
    input.lineageResult.weakLineageAreas.length > 0
  ) {
    findings.push(
      createFinding({
        type: "lineage_crossover_risk",
        area: "traceability_isolation",
        description:
          "Lineage isolation needs stronger lineage integrity before future cross-boundary reconstruction.",
        evidence: [
          input.lineageResult
            ? `Lineage integrity score: ${input.lineageResult.lineageIntegrityScore}/100`
            : "Governance lineage result was not supplied.",
          ...(input.lineageResult?.weakLineageAreas ?? []),
          ...(input.lineageResult?.governanceDependencyChains ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review lineage integrity and dependency chains before future tenant or business-specific reconstruction.",
      }),
    );
  }

  if (
    (input.observabilityDurabilityResult?.fragileObservabilityAreas.length ?? 0) > 0 ||
    !contextValue(input, "observabilityIsolationScope")
  ) {
    findings.push(
      createFinding({
        type: "observability_leakage_risk",
        area: "observability_isolation",
        description:
          "Observability outputs need clearer boundary scope to avoid future visibility leakage across tenants or businesses.",
        evidence: [
          ...(input.observabilityDurabilityResult?.fragileObservabilityAreas ?? []),
          ...(input.observabilityDurabilityResult?.crossIndustryObservabilityFindings ?? []),
          !contextValue(input, "observabilityIsolationScope")
            ? "Observability isolation scope is not supplied."
            : "",
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review observability scopes and dashboard durability assumptions before future multi-tenant visibility growth.",
      }),
    );
  }

  if (
    (input.reviewabilityIntegrityResult?.weakReviewabilityAreas.length ?? 0) > 0 ||
    reconstructionRisks.length > 0
  ) {
    findings.push(
      createFinding({
        type: "reviewability_contamination_risk",
        area: "reviewability_isolation",
        description:
          "Reviewability may degrade if findings cannot be reconstructed within distinct business or tenant scopes.",
        evidence: [
          ...(input.reviewabilityIntegrityResult?.weakReviewabilityAreas ?? []),
          ...reconstructionRisks,
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review weak reviewability and reconstruction risks before future boundary-specific audit workflows.",
      }),
    );
  }

  if (
    (input.auditResult?.orchestrationContaminationRisks.length ?? 0) > 0 ||
    (input.auditResult?.hiddenExecutionPathwayRisks.length ?? 0) > 0 ||
    !contextValue(input, "orchestrationIsolationScope")
  ) {
    findings.push(
      createFinding({
        type: "orchestration_boundary_weakness",
        area: "orchestration_review_isolation",
        description:
          "Orchestration review isolation depends on explicit separation from execution pathways and workflow mutation.",
        evidence: [
          ...(input.auditResult?.orchestrationContaminationRisks ?? []),
          ...(input.auditResult?.hiddenExecutionPathwayRisks ?? []),
          !contextValue(input, "orchestrationIsolationScope")
            ? "Orchestration isolation scope is not supplied."
            : "",
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review orchestration boundaries before future AI-agent clusters or tenant-aware orchestration designs.",
      }),
    );
  }

  if (missingBoundaries.length >= 4 || (input.isolationContext?.boundaryLimitations?.length ?? 0) > 0) {
    findings.push(
      createFinding({
        type: "weak_governance_boundary",
        area: "governance_isolation",
        description:
          "Governance boundary review needs stronger explicit boundary metadata before future isolation claims.",
        evidence: [...missingBoundaries, ...(input.isolationContext?.boundaryLimitations ?? [])],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review boundary metadata and document assumptions before future multi-business or multi-tenant expansion.",
      }),
    );
  }

  if (reconstructionRisks.length > 0 || !contextValue(input, "reconstructionScope")) {
    findings.push(
      createFinding({
        type: "cross_business_reconstruction_risk",
        area: "institutional_memory_isolation",
        description:
          "Cross-business reconstruction may weaken without explicit reconstruction scope and isolated memory/history links.",
        evidence: [
          ...reconstructionRisks,
          !contextValue(input, "reconstructionScope") ? "Reconstruction scope is not supplied." : "",
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review reconstruction scope, institutional memory findings, and audit-history links before future expansion.",
      }),
    );
  }

  if (
    missingBoundaries.some((signal) => normalize(signal).includes("tenant")) ||
    (input.lifecycleContinuityResult?.fragileContinuityAreas.length ?? 0) > 0 ||
    (input.versioningReadinessResult?.migrationRiskFindings.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "future_tenant_survivability_risk",
        area: "lifecycle_continuity_isolation",
        description:
          "Future tenant survivability needs stronger lifecycle, migration, and tenant-boundary review context.",
        evidence: [
          ...missingBoundaries.filter((signal) => normalize(signal).includes("tenant")),
          ...(input.lifecycleContinuityResult?.fragileContinuityAreas ?? []),
          ...(input.versioningReadinessResult?.migrationRiskFindings ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review tenant lifecycle, compatibility, and migration assumptions before future tenant expansion.",
      }),
    );
  }

  return findings;
}

function buildHumanReviewNotes(
  input: GovernanceMultiBusinessTenantIsolationInput,
  findings: GovernanceMultiBusinessTenantIsolationFinding[],
): string[] {
  return unique([
    "Human review is required before any multi-business or multi-tenant isolation architecture decision.",
    "This review is read-only and does not create tenant routing, tenant persistence, tenant-aware execution, or governance automation.",
    ...findings.map((finding) => finding.recommendedHumanReview),
    ...(input.semanticVersionSurvivabilityResult?.humanReviewNotes ?? []),
    ...(input.traceabilitySurvivabilityResult?.humanReviewNotes ?? []),
    ...(input.explainabilityContinuityResult?.humanReviewNotes ?? []),
    ...(input.observabilityDurabilityResult?.humanReviewNotes ?? []),
    ...(input.lifecycleContinuityResult?.humanReviewNotes ?? []),
  ]);
}

function buildFutureStabilizationRecommendations(
  input: GovernanceMultiBusinessTenantIsolationInput,
  findings: GovernanceMultiBusinessTenantIsolationFinding[],
): string[] {
  return unique([
    missingBoundarySignals(input).length > 0
      ? `Review missing boundary context fields: ${missingBoundarySignals(input).join(", ")}.`
      : "",
    "Preserve tenant and business isolation as a review-only architecture concern until explicit tenant persistence or routing is approved.",
    "Preserve shared deterministic utility extraction as a future upgrade after governance review modules stabilize.",
    "Prepare Governance Long-Horizon Institutional Resilience Review as the next read-only stage.",
    ...findings.map((finding) => finding.recommendedHumanReview),
    ...(input.semanticVersionSurvivabilityResult?.futureStabilizationRecommendations ?? []),
    ...(input.survivabilityExpansionResult?.futureStabilizationRecommendations ?? []),
    ...(input.observabilityDurabilityResult?.futureStabilizationRecommendations ?? []),
  ]);
}

export function runGovernanceMultiBusinessTenantIsolationReview(
  input: GovernanceMultiBusinessTenantIsolationInput,
): GovernanceMultiBusinessTenantIsolationResult {
  const areaAssessments = buildAreaAssessments(input);
  const findings = buildFindings(input);
  const isolationSurvivabilityScore = calculateOverallMultiBusinessTenantIsolationScore({
    areaAssessments,
    findings,
  });
  const isolationClassification =
    multiBusinessTenantIsolationClassificationFromScore(isolationSurvivabilityScore);

  const resultWithoutExplainability: Omit<
    GovernanceMultiBusinessTenantIsolationResult,
    "explainability"
  > = {
    isolationSurvivabilityScore,
    isolationClassification,
    areaAssessments,
    findings,
    durableIsolationAreas: areaAssessments
      .filter((area) => ["isolated", "institutionally_isolated"].includes(area.classification))
      .map((area) => `${area.area}: ${area.classification} at ${area.score}/100`),
    fragileIsolationAreas: areaAssessments
      .filter((area) => ["contaminated", "partially_isolated"].includes(area.classification))
      .map((area) => `${area.area}: ${area.classification} at ${area.score}/100`),
    tenantBoundaryFindings: findings
      .filter((finding) =>
        ["tenant_contamination_risk", "future_tenant_survivability_risk"].includes(finding.findingType),
      )
      .map((finding) => finding.description),
    governanceBoundaryFindings: findings
      .filter((finding) =>
        ["governance_leakage_risk", "weak_governance_boundary"].includes(finding.findingType),
      )
      .map((finding) => finding.description),
    auditIsolationFindings: findings
      .filter((finding) => finding.findingType === "audit_contamination_risk")
      .map((finding) => finding.description),
    traceabilityIsolationFindings: findings
      .filter((finding) =>
        ["traceability_crossover_risk", "lineage_crossover_risk"].includes(finding.findingType),
      )
      .map((finding) => finding.description),
    explainabilityIsolationFindings: findings
      .filter((finding) => finding.findingType === "explainability_crossover_risk")
      .map((finding) => finding.description),
    semanticIsolationFindings: findings
      .filter((finding) => finding.findingType === "semantic_contamination_risk")
      .map((finding) => finding.description),
    observabilityIsolationFindings: findings
      .filter((finding) => finding.findingType === "observability_leakage_risk")
      .map((finding) => finding.description),
    institutionalBoundaryFindings: findings
      .filter((finding) =>
        ["governance_leakage_risk", "weak_governance_boundary", "cross_business_reconstruction_risk"].includes(
          finding.findingType,
        ),
      )
      .map((finding) => finding.description),
    reconstructionIsolationFindings: findings
      .filter((finding) =>
        [
          "cross_business_reconstruction_risk",
          "reviewability_contamination_risk",
          "traceability_crossover_risk",
          "lineage_crossover_risk",
        ].includes(finding.findingType),
      )
      .map((finding) => finding.description),
    humanReviewNotes: buildHumanReviewNotes(input, findings),
    futureStabilizationRecommendations: buildFutureStabilizationRecommendations(input, findings),
    humanReviewRequired:
      findings.length > 0 ||
      areaAssessments.some((area) => ["contaminated", "partially_isolated"].includes(area.classification)),
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernanceMultiBusinessTenantIsolationExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}
