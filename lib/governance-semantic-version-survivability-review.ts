import { buildGovernanceSemanticVersionSurvivabilityExplainability } from "./governance-semantic-version-survivability-review-explainability";
import {
  calculateOverallSemanticVersionSurvivabilityScore,
  calculateSemanticVersionSurvivabilityAreaScore,
  calculateSemanticVersionSurvivabilityFindingConfidence,
  semanticVersionSurvivabilityClassificationFromScore,
} from "./governance-semantic-version-survivability-review-scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
} from "./full-system-governance-audit-types";
import type { GovernanceSemanticStabilityDomain } from "./governance-semantic-stability-review-types";
import type {
  GovernanceSemanticVersionSurvivabilityArea,
  GovernanceSemanticVersionSurvivabilityAreaAssessment,
  GovernanceSemanticVersionSurvivabilityFinding,
  GovernanceSemanticVersionSurvivabilityFindingType,
  GovernanceSemanticVersionSurvivabilityInput,
  GovernanceSemanticVersionSurvivabilityResult,
} from "./governance-semantic-version-survivability-review-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

type AreaInput = {
  area: GovernanceSemanticVersionSurvivabilityArea;
  description: string;
  baseScore: number;
  versionStableSignals: string[];
  versionFragileSignals: string[];
  recommendedHumanReview: string;
  reasoning: string;
};

const SEMANTIC_VERSION_METADATA_KEYS = [
  "semanticVersion",
  "taxonomyVersion",
  "registryVersion",
  "normalizationContractVersion",
  "traceabilityVersion",
  "explainabilityVersion",
  "auditHistoryVersion",
  "doctrineVersion",
  "compatibilityVersion",
  "migrationReviewVersion",
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
  return normalize(value).slice(0, 72) || "semantic_version_review";
}

function average(values: number[]): number {
  const usableValues = values.filter((value) => Number.isFinite(value));
  if (usableValues.length === 0) {
    return 50;
  }

  return usableValues.reduce((sum, value) => sum + value, 0) / usableValues.length;
}

function getMetadataValue(
  input: GovernanceSemanticVersionSurvivabilityInput,
  key: (typeof SEMANTIC_VERSION_METADATA_KEYS)[number],
): string | undefined {
  const value = input.metadata?.[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function missingSemanticVersionMetadata(
  input: GovernanceSemanticVersionSurvivabilityInput,
): string[] {
  return SEMANTIC_VERSION_METADATA_KEYS.filter((key) => !getMetadataValue(input, key));
}

function getAuditFindings(
  input: GovernanceSemanticVersionSurvivabilityInput,
): FullSystemGovernanceAuditFinding[] {
  return [...(input.auditFindings ?? []), ...(input.auditResult?.findings ?? [])];
}

function getRecommendations(
  input: GovernanceSemanticVersionSurvivabilityInput,
): FullSystemGovernanceAuditRecommendation[] {
  return [...(input.recommendations ?? []), ...(input.auditResult?.recommendations ?? [])];
}

function statusScore(status?: string): number {
  switch (status) {
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
    case "strong":
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

function semanticDomainScore(
  input: GovernanceSemanticVersionSurvivabilityInput,
  domain: GovernanceSemanticStabilityDomain,
): number {
  const assessment = input.semanticStabilityResult?.domainAssessments.find(
    (candidate) => candidate.domain === domain,
  );

  return assessment?.score ?? statusScore(input.semanticStabilityResult?.semanticStabilityClassification);
}

function auditCategories(
  input: GovernanceSemanticVersionSurvivabilityInput,
): FullSystemGovernanceAuditCategory[] {
  return unique(
    getAuditFindings(input)
      .map((finding) => finding.category)
      .concat(Object.keys(input.auditResult?.categoryScores ?? {}) as FullSystemGovernanceAuditCategory[]),
  ) as FullSystemGovernanceAuditCategory[];
}

function createAreaAssessment(params: AreaInput): GovernanceSemanticVersionSurvivabilityAreaAssessment {
  const score = calculateSemanticVersionSurvivabilityAreaScore({
    baseScore: params.baseScore,
    versionStableSignalCount: params.versionStableSignals.length,
    versionFragileSignalCount: params.versionFragileSignals.length,
    findingCount: params.versionFragileSignals.length,
    explainabilityCount: params.reasoning.length > 0 ? params.versionStableSignals.length + 1 : params.versionStableSignals.length,
  });

  return {
    area: params.area,
    score,
    classification: semanticVersionSurvivabilityClassificationFromScore(score),
    description: params.description,
    versionStableSignals: unique(params.versionStableSignals),
    versionFragileSignals: unique(params.versionFragileSignals),
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors: unique([...params.versionStableSignals, ...params.versionFragileSignals]),
      reasoning: unique([
        params.reasoning,
        params.versionFragileSignals.length > 0
          ? "Version survivability depends on reviewing fragile semantic signals before future migration."
          : "",
      ]),
    },
  };
}

function buildAreaAssessments(
  input: GovernanceSemanticVersionSurvivabilityInput,
): GovernanceSemanticVersionSurvivabilityAreaAssessment[] {
  const recommendations = getRecommendations(input);
  const categories = auditCategories(input);
  const missingMetadata = missingSemanticVersionMetadata(input);
  const normalizationGaps = input.normalizationResult?.weakMappings ?? [];
  const normalizationMissing = input.normalizationResult?.missingMappings ?? [];
  const normalizationInconsistent = input.normalizationResult?.inconsistentMappings ?? [];

  return [
    createAreaAssessment({
      area: "governance_terminology",
      description:
        "Reviews whether governance terminology can remain understandable and compatible across future semantic versions.",
      baseScore: statusScore(input.semanticStabilityResult?.semanticStabilityClassification),
      versionStableSignals: [
        ...(input.semanticStabilityResult?.stableTerms ?? []).map((term) => `Stable term: ${term}`),
        getMetadataValue(input, "semanticVersion")
          ? `Semantic version metadata present: ${getMetadataValue(input, "semanticVersion")}`
          : "",
      ],
      versionFragileSignals: [
        ...(input.semanticStabilityResult?.unstableTerms ?? []).map((term) => `Unstable term: ${term}`),
        ...(input.semanticStabilityResult?.driftRisks ?? []),
        missingMetadata.includes("semanticVersion")
          ? "Semantic version metadata is not supplied for this review input."
          : "",
      ],
      recommendedHumanReview:
        "Review unstable terminology and confirm future semantic versions can preserve prior meaning.",
      reasoning:
        "Terminology survivability improves when stable terms and explicit semantic version metadata are available.",
    }),
    createAreaAssessment({
      area: "governance_classifications",
      description:
        "Evaluates whether governance classifications remain consistent enough for backward-compatible interpretation.",
      baseScore: average([
        statusScore(input.auditResult?.auditClassification),
        statusScore(input.readinessResult?.readinessClassification),
        statusScore(input.assuranceResult?.overallAssuranceStatus),
        statusScore(input.versioningReadinessResult?.versioningReadinessClassification),
        statusScore(input.semanticStabilityResult?.semanticStabilityClassification),
      ]),
      versionStableSignals: [
        input.auditResult?.auditClassification
          ? `Audit classification: ${input.auditResult.auditClassification}`
          : "",
        input.readinessResult?.readinessClassification
          ? `Readiness classification: ${input.readinessResult.readinessClassification}`
          : "",
        input.assuranceResult?.overallAssuranceStatus
          ? `Assurance classification: ${input.assuranceResult.overallAssuranceStatus}`
          : "",
      ],
      versionFragileSignals: [
        ...(input.semanticStabilityResult?.conflictingTerms ?? []).map(
          (term) => `Conflicting classification term: ${term}`,
        ),
        ...(input.semanticStabilityResult?.duplicatedTerms ?? []).map(
          (term) => `Duplicated classification term: ${term}`,
        ),
        ...(input.versioningReadinessResult?.unstableVersionFragileAreas ?? []).map(
          (area) => `Version-fragile classification area: ${area}`,
        ),
      ],
      recommendedHumanReview:
        "Review classification terms for stable meaning before future versioned governance contracts are introduced.",
      reasoning:
        "Classification survivability depends on stable status vocabulary across audit, readiness, assurance, and versioning layers.",
    }),
    createAreaAssessment({
      area: "audit_categories",
      description:
        "Checks whether audit categories are stable enough for future audit contract versioning.",
      baseScore: semanticDomainScore(input, "audit_categories"),
      versionStableSignals: [
        ...categories.map((category) => `Observed audit category: ${category}`),
        getMetadataValue(input, "auditHistoryVersion")
          ? `Audit history version metadata present: ${getMetadataValue(input, "auditHistoryVersion")}`
          : "",
      ],
      versionFragileSignals: [
        ...(input.auditResult?.futureTechnicalDebtItems ?? []),
        ...normalizationGaps
          .filter((gap) => normalize(gap).includes("audit"))
          .map((gap) => `Audit category normalization gap: ${gap}`),
        missingMetadata.includes("auditHistoryVersion")
          ? "Audit history version metadata is not supplied."
          : "",
      ],
      recommendedHumanReview:
        "Confirm audit categories can be reconstructed under future audit contract versions.",
      reasoning:
        "Audit category version survivability improves when category vocabulary and audit history metadata remain explicit.",
    }),
    createAreaAssessment({
      area: "evidence_categories",
      description:
        "Reviews evidence category semantics for version survivability and future reconstruction.",
      baseScore: average([
        semanticDomainScore(input, "evidence_categories"),
        statusScore(input.evidenceQualityResult?.overallReliabilityLevel),
        statusScore(input.traceabilityResult?.traceabilityClassification),
      ]),
      versionStableSignals: [
        input.evidenceQualityResult?.overallReliabilityLevel
          ? `Evidence quality level: ${input.evidenceQualityResult.overallReliabilityLevel}`
          : "",
        input.traceabilityResult?.traceabilityClassification
          ? `Traceability classification: ${input.traceabilityResult.traceabilityClassification}`
          : "",
      ],
      versionFragileSignals: [
        ...(input.semanticStabilityResult?.evidenceSemanticFindings ?? []),
        ...(input.traceabilityResult?.evidenceGaps ?? []),
        ...(input.traceabilitySurvivabilityResult?.evidenceLinkageFindings ?? []),
      ],
      recommendedHumanReview:
        "Review evidence vocabulary and linkage gaps before future evidence taxonomy versioning.",
      reasoning:
        "Evidence semantics are more survivable when evidence quality, traceability, and linkage reviews align.",
    }),
    createAreaAssessment({
      area: "scoring_drivers",
      description:
        "Checks whether scoring driver semantics can remain deterministic and explainable across versions.",
      baseScore: average([
        semanticDomainScore(input, "scoring_drivers"),
        input.normalizationResult?.normalizationScore ?? 42,
        statusScore(input.normalizationResult?.normalizationClassification),
      ]),
      versionStableSignals: [
        ...(input.normalizationResult?.scoringDriverConsistency ?? []),
        ...(input.auditResult?.explainability.majorDrivers ?? []).map(
          (driver) => `Audit scoring driver: ${driver}`,
        ),
      ],
      versionFragileSignals: [
        ...(input.semanticStabilityResult?.scoringSemanticFindings ?? []),
        ...normalizationGaps
          .filter((gap) => normalize(gap).includes("scoring"))
          .map((gap) => `Scoring normalization gap: ${gap}`),
      ],
      recommendedHumanReview:
        "Review scoring driver names and meanings before future version compatibility expectations are set.",
      reasoning:
        "Scoring semantics remain durable when deterministic score drivers keep stable labels, meanings, and supporting explanation.",
    }),
    createAreaAssessment({
      area: "doctrine_principles",
      description:
        "Evaluates whether doctrine principle semantics can survive future doctrine evolution.",
      baseScore: average([
        semanticDomainScore(input, "doctrine_principles"),
        statusScore(input.doctrineResult?.doctrineStatus),
        statusScore(input.doctrineDurabilityResult?.doctrineDurabilityClassification),
      ]),
      versionStableSignals: [
        ...(input.doctrineResult?.principles ?? []).map(
          (principle) => `Doctrine principle: ${principle.principleType}`,
        ),
        getMetadataValue(input, "doctrineVersion")
          ? `Doctrine version metadata present: ${getMetadataValue(input, "doctrineVersion")}`
          : "",
      ],
      versionFragileSignals: [
        ...(input.semanticStabilityResult?.doctrineSemanticFindings ?? []),
        ...(input.doctrineResult?.doctrineLimitations ?? []),
        ...(input.doctrineDurabilityResult?.fragileDoctrineAreas ?? []),
        missingMetadata.includes("doctrineVersion") ? "Doctrine version metadata is not supplied." : "",
      ],
      recommendedHumanReview:
        "Review doctrine principle vocabulary for stable meaning before future doctrine versioning.",
      reasoning:
        "Doctrine survivability depends on stable principle labels, explicit limitations, and durable doctrine review structures.",
    }),
    createAreaAssessment({
      area: "normalization_mappings",
      description:
        "Reviews principle-to-evidence normalization mappings for future compatibility and semantic drift.",
      baseScore: average([
        input.normalizationResult?.normalizationScore ?? 42,
        statusScore(input.normalizationResult?.normalizationClassification),
      ]),
      versionStableSignals: [
        input.normalizationResult
          ? `Normalization classification: ${input.normalizationResult.normalizationClassification}`
          : "",
        ...(input.normalizationResult?.principleMappingStrength ?? []),
        getMetadataValue(input, "normalizationContractVersion")
          ? `Normalization contract version metadata present: ${getMetadataValue(
              input,
              "normalizationContractVersion",
            )}`
          : "",
      ],
      versionFragileSignals: [
        ...normalizationGaps,
        ...normalizationMissing,
        ...normalizationInconsistent,
        ...(input.normalizationResult?.governanceSemanticDriftRisks ?? []),
        missingMetadata.includes("normalizationContractVersion")
          ? "Normalization contract version metadata is not supplied."
          : "",
      ],
      recommendedHumanReview:
        "Review weak or missing mappings before using normalization outputs for future semantic compatibility.",
      reasoning:
        "Normalization mappings are more survivable when principle, evidence, scoring, recommendation, and limitation links stay consistent.",
    }),
    createAreaAssessment({
      area: "traceability_semantics",
      description:
        "Evaluates whether traceability semantics can remain reconstructable across future versions.",
      baseScore: average([
        semanticDomainScore(input, "traceability_language"),
        statusScore(input.traceabilitySurvivabilityResult?.traceabilitySurvivabilityClassification),
        statusScore(input.traceabilityResult?.traceabilityClassification),
      ]),
      versionStableSignals: [
        input.traceabilitySurvivabilityResult
          ? `Traceability survivability classification: ${input.traceabilitySurvivabilityResult.traceabilitySurvivabilityClassification}`
          : "",
        ...(input.traceabilitySurvivabilityResult?.durableTraceabilityAreas ?? []),
        getMetadataValue(input, "traceabilityVersion")
          ? `Traceability version metadata present: ${getMetadataValue(input, "traceabilityVersion")}`
          : "",
      ],
      versionFragileSignals: [
        ...(input.semanticStabilityResult?.traceabilitySemanticFindings ?? []),
        ...(input.traceabilitySurvivabilityResult?.fragileTraceabilityAreas ?? []),
        ...(input.traceabilityResult?.missingLinks ?? []),
        missingMetadata.includes("traceabilityVersion")
          ? "Traceability version metadata is not supplied."
          : "",
      ],
      recommendedHumanReview:
        "Review traceability terms and link structures for backward-compatible evidence reconstruction.",
      reasoning:
        "Traceability semantics survive version changes when link vocabulary, evidence references, and reasoning paths stay explicit.",
    }),
    createAreaAssessment({
      area: "explainability_semantics",
      description:
        "Reviews explainability semantics for deterministic future interpretation and reasoning reconstruction.",
      baseScore: average([
        semanticDomainScore(input, "traceability_language"),
        statusScore(input.explainabilityContinuityResult?.explainabilityContinuityClassification),
      ]),
      versionStableSignals: [
        input.explainabilityContinuityResult
          ? `Explainability continuity classification: ${input.explainabilityContinuityResult.explainabilityContinuityClassification}`
          : "",
        ...(input.explainabilityContinuityResult?.durableExplainabilityAreas ?? []),
        getMetadataValue(input, "explainabilityVersion")
          ? `Explainability version metadata present: ${getMetadataValue(
              input,
              "explainabilityVersion",
            )}`
          : "",
      ],
      versionFragileSignals: [
        ...(input.explainabilityContinuityResult?.fragileExplainabilityAreas ?? []),
        ...(input.explainabilityContinuityResult?.reasoningContinuityFindings ?? []),
        missingMetadata.includes("explainabilityVersion")
          ? "Explainability version metadata is not supplied."
          : "",
      ],
      recommendedHumanReview:
        "Review reasoning labels, score explanations, and limitation language for future compatibility.",
      reasoning:
        "Explainability version survivability depends on stable reasoning vocabulary and reconstructable evidence visibility.",
    }),
    createAreaAssessment({
      area: "recommendation_semantics",
      description:
        "Checks whether recommendation language remains stable, non-executing, and version-compatible.",
      baseScore: average([
        semanticDomainScore(input, "recommendation_language"),
        input.normalizationResult?.normalizationScore ?? 42,
        statusScore(input.normalizationResult?.normalizationClassification),
      ]),
      versionStableSignals: [
        ...recommendations.map(
          (recommendation) => `Recommendation classification: ${recommendation.classification}`,
        ),
        ...(input.normalizationResult?.recommendationLinkageConsistency ?? []),
      ],
      versionFragileSignals: [
        ...(input.semanticStabilityResult?.recommendationSemanticFindings ?? []),
        ...normalizationGaps
          .filter((gap) => normalize(gap).includes("recommendation"))
          .map((gap) => `Recommendation mapping gap: ${gap}`),
      ],
      recommendedHumanReview:
        "Review recommendation labels for clear human-review language and no implied execution semantics.",
      reasoning:
        "Recommendation semantics remain compatible when they preserve neutral human-review language across future versions.",
    }),
    createAreaAssessment({
      area: "limitation_semantics",
      description:
        "Reviews limitation language for stable future interpretation and visible confidence boundaries.",
      baseScore: average([
        semanticDomainScore(input, "limitation_language"),
        input.normalizationResult?.normalizationScore ?? 42,
        statusScore(input.normalizationResult?.normalizationClassification),
      ]),
      versionStableSignals: [
        ...(input.normalizationResult?.limitationLinkageConsistency ?? []),
        ...(input.auditResult?.limitations ?? []).map((limitation) => `Audit limitation: ${limitation}`),
      ],
      versionFragileSignals: [
        ...(input.semanticStabilityResult?.limitationSemanticFindings ?? []),
        ...(input.traceabilityResult?.limitationGaps ?? []),
        ...normalizationGaps
          .filter((gap) => normalize(gap).includes("limitation"))
          .map((gap) => `Limitation mapping gap: ${gap}`),
      ],
      recommendedHumanReview:
        "Review limitation terminology so future versions preserve the same confidence boundaries.",
      reasoning:
        "Limitation semantics are durable when confidence boundaries remain visible and linked to evidence and scoring assumptions.",
    }),
    createAreaAssessment({
      area: "observability_semantics",
      description:
        "Evaluates observability vocabulary and dashboard visibility semantics for future survivability.",
      baseScore: average([
        statusScore(input.observabilityDurabilityResult?.observabilityDurabilityClassification),
        input.observabilityDurabilityResult?.observabilityDurabilityScore ?? 42,
      ]),
      versionStableSignals: [
        ...(input.observabilityDurabilityResult?.durableObservabilityAreas ?? []),
        ...(input.observabilityDurabilityResult?.governanceVisibilityFindings ?? []),
      ],
      versionFragileSignals: [
        ...(input.observabilityDurabilityResult?.fragileObservabilityAreas ?? []),
        ...(input.observabilityDurabilityResult?.explainabilityVisibilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review observability terms and visibility assumptions before future dashboard or telemetry expansion.",
      reasoning:
        "Observability semantics survive expansion when governance visibility, explainability visibility, and audit visibility remain stable.",
    }),
    createAreaAssessment({
      area: "reviewability_semantics",
      description:
        "Checks whether reviewability language can stay reconstructable and institutionally understandable.",
      baseScore: average([
        statusScore(input.reviewabilityIntegrityResult?.reviewabilityClassification),
        input.reviewabilityIntegrityResult?.reviewabilityIntegrityScore ?? 42,
      ]),
      versionStableSignals: [
        ...(input.reviewabilityIntegrityResult?.reviewableAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.humanReviewFindings ?? []),
      ],
      versionFragileSignals: [
        ...(input.reviewabilityIntegrityResult?.weakReviewabilityAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.reconstructionRisks ?? []),
      ],
      recommendedHumanReview:
        "Review whether future semantic versions preserve the ability for humans to reconstruct findings.",
      reasoning:
        "Reviewability semantics are survivable when finding structures, evidence, limitations, and recommendations remain human-auditable.",
    }),
    createAreaAssessment({
      area: "registry_readiness_semantics",
      description:
        "Evaluates whether registry-readiness vocabulary can support future semantic version discipline.",
      baseScore: average([
        statusScore(input.registryReviewResult?.registryReadinessClassification),
        input.registryReviewResult?.registryReadinessScore ?? 42,
      ]),
      versionStableSignals: [
        ...(input.registryReviewResult?.governanceVocabularyFindings ?? []),
        getMetadataValue(input, "registryVersion")
          ? `Registry version metadata present: ${getMetadataValue(input, "registryVersion")}`
          : "",
      ],
      versionFragileSignals: [
        ...(input.registryReviewResult?.semanticDriftRisks ?? []),
        ...(input.registryReviewResult?.overlapConflictFindings ?? []),
        missingMetadata.includes("registryVersion") ? "Registry version metadata is not supplied." : "",
      ],
      recommendedHumanReview:
        "Review registry-readiness vocabulary before introducing any future registry or taxonomy versioning.",
      reasoning:
        "Registry semantics become more durable when governance vocabulary, taxonomy readiness, and overlap findings are explicit.",
    }),
    createAreaAssessment({
      area: "lifecycle_continuity_semantics",
      description:
        "Reviews whether lifecycle, compatibility, and migration semantics can remain continuous across future versions.",
      baseScore: average([
        statusScore(input.lifecycleContinuityResult?.lifecycleContinuityClassification),
        statusScore(input.versioningReadinessResult?.versioningReadinessClassification),
        input.lifecycleContinuityResult?.lifecycleContinuityScore ?? 42,
      ]),
      versionStableSignals: [
        ...(input.lifecycleContinuityResult?.durableContinuityAreas ?? []),
        ...(input.versioningReadinessResult?.stableVersionReadyAreas ?? []),
        getMetadataValue(input, "compatibilityVersion")
          ? `Compatibility version metadata present: ${getMetadataValue(input, "compatibilityVersion")}`
          : "",
      ],
      versionFragileSignals: [
        ...(input.lifecycleContinuityResult?.fragileContinuityAreas ?? []),
        ...(input.versioningReadinessResult?.migrationRiskFindings ?? []),
        ...(input.compatibilityMigrationContext?.migrationFindings ?? []),
        missingMetadata.includes("compatibilityVersion")
          ? "Compatibility version metadata is not supplied."
          : "",
        missingMetadata.includes("migrationReviewVersion")
          ? "Migration review version metadata is not supplied."
          : "",
      ],
      recommendedHumanReview:
        "Review lifecycle, compatibility, and migration semantics before future semantic migration planning.",
      reasoning:
        "Lifecycle semantics survive version changes when compatibility, migration, and lifecycle continuity remain reconstructable.",
    }),
  ];
}

function severityFor(
  findingType: GovernanceSemanticVersionSurvivabilityFindingType,
  evidenceCount: number,
): ReputationSeverity {
  if (
    findingType === "semantic_version_fragility" ||
    findingType === "backward_compatibility_risk" ||
    findingType === "semantic_migration_survivability_risk" ||
    findingType === "long_horizon_semantic_reconstruction_risk"
  ) {
    return evidenceCount >= 4 ? "elevated" : "moderate";
  }

  return evidenceCount >= 4 ? "moderate" : "low";
}

function createFinding(params: {
  type: GovernanceSemanticVersionSurvivabilityFindingType;
  description: string;
  evidence: string[];
  affectedAreas: GovernanceSemanticVersionSurvivabilityArea[];
  affectedAuditCategories?: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
}): GovernanceSemanticVersionSurvivabilityFinding {
  const evidence = unique(params.evidence);
  const confidenceScore = calculateSemanticVersionSurvivabilityFindingConfidence({
    evidenceCount: evidence.length,
    factorCount: params.affectedAreas.length + (params.recommendedHumanReview.length > 0 ? 1 : 0),
  });

  return {
    id: `semantic-version-${slug(params.type)}-${slug(params.description)}`,
    findingType: params.type,
    area: params.affectedAreas[0] ?? "governance_terminology",
    severity: severityFor(params.type, evidence.length),
    description: params.description,
    evidence,
    affectedAuditCategories: unique(params.affectedAuditCategories ?? []) as FullSystemGovernanceAuditCategory[],
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore,
    explainability: {
      factors: evidence,
      reasoning: unique([
        "This finding is produced from deterministic semantic-version survivability checks across supplied governance review inputs.",
        evidence.length === 0
          ? "Finding confidence is limited because supporting evidence was not supplied."
          : "",
      ]),
    },
  };
}

function buildFindings(
  input: GovernanceSemanticVersionSurvivabilityInput,
): GovernanceSemanticVersionSurvivabilityFinding[] {
  const findings: GovernanceSemanticVersionSurvivabilityFinding[] = [];
  const missingMetadata = missingSemanticVersionMetadata(input);
  const semanticFindings = input.semanticStabilityResult?.findings ?? [];
  const versioningFindings = input.versioningReadinessResult?.findings ?? [];
  const normalizationWeaknesses = [
    ...(input.normalizationResult?.weakMappings ?? []),
    ...(input.normalizationResult?.missingMappings ?? []),
    ...(input.normalizationResult?.inconsistentMappings ?? []),
  ];
  const categories = auditCategories(input);

  if (
    !input.semanticStabilityResult ||
    input.semanticStabilityResult.semanticStabilityClassification === "unstable" ||
    input.semanticStabilityResult.semanticStabilityClassification === "mostly_stable" ||
    missingMetadata.includes("semanticVersion") ||
    (input.semanticStabilityResult?.driftRisks.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "semantic_version_fragility",
        description:
          "Semantic version survivability is limited by missing or unstable semantic stability context.",
        evidence: [
          input.semanticStabilityResult
            ? `Semantic stability classification: ${input.semanticStabilityResult.semanticStabilityClassification}`
            : "Semantic stability review result was not supplied.",
          ...missingMetadata
            .filter((key) => key === "semanticVersion")
            .map((key) => `Missing metadata: ${key}`),
          ...(input.semanticStabilityResult?.driftRisks ?? []),
        ],
        affectedAreas: ["governance_terminology", "governance_classifications"],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review semantic version metadata and unstable terminology before future semantic versioning work.",
      }),
    );
  }

  if (
    !input.versioningReadinessResult ||
    (input.versioningReadinessResult.compatibilityFindings.length ?? 0) > 0 ||
    (input.compatibilityMigrationContext?.compatibilityFindings?.length ?? 0) > 0 ||
    missingMetadata.includes("compatibilityVersion")
  ) {
    findings.push(
      createFinding({
        type: "backward_compatibility_risk",
        description:
          "Backward compatibility review needs stronger explicit compatibility evidence before future semantic evolution.",
        evidence: [
          input.versioningReadinessResult
            ? `Versioning readiness classification: ${input.versioningReadinessResult.versioningReadinessClassification}`
            : "Versioning readiness review result was not supplied.",
          ...(input.versioningReadinessResult?.compatibilityFindings ?? []),
          ...(input.compatibilityMigrationContext?.compatibilityFindings ?? []),
          missingMetadata.includes("compatibilityVersion")
            ? "Compatibility version metadata is not supplied."
            : "",
        ],
        affectedAreas: ["lifecycle_continuity_semantics", "governance_classifications"],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review backward compatibility expectations before introducing future semantic or taxonomy versions.",
      }),
    );
  }

  if (
    !input.registryReviewResult ||
    missingMetadata.includes("taxonomyVersion") ||
    missingMetadata.includes("registryVersion") ||
    (input.registryReviewResult?.semanticDriftRisks.length ?? 0) > 0 ||
    (input.registryReviewResult?.taxonomyStabilityFindings.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "taxonomy_version_instability",
        description:
          "Taxonomy version survivability needs stronger registry-readiness and taxonomy stability evidence.",
        evidence: [
          input.registryReviewResult
            ? `Registry readiness classification: ${input.registryReviewResult.registryReadinessClassification}`
            : "Governance principle registry review result was not supplied.",
          ...(input.registryReviewResult?.semanticDriftRisks ?? []),
          ...(input.registryReviewResult?.taxonomyStabilityFindings ?? []),
          ...missingMetadata
            .filter((key) => key === "taxonomyVersion" || key === "registryVersion")
            .map((key) => `Missing metadata: ${key}`),
        ],
        affectedAreas: ["registry_readiness_semantics", "governance_terminology"],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review taxonomy and registry-readiness findings before defining future semantic version expectations.",
      }),
    );
  }

  if (
    (input.semanticStabilityResult?.conflictingTerms.length ?? 0) > 0 ||
    (input.semanticStabilityResult?.duplicatedTerms.length ?? 0) > 0 ||
    semanticFindings.some((finding) => finding.findingType === "classification_mismatch")
  ) {
    findings.push(
      createFinding({
        type: "classification_version_mismatch",
        description:
          "Classification vocabulary may not remain backward-compatible without review of duplicated or conflicting meanings.",
        evidence: [
          ...(input.semanticStabilityResult?.conflictingTerms ?? []).map(
            (term) => `Conflicting term: ${term}`,
          ),
          ...(input.semanticStabilityResult?.duplicatedTerms ?? []).map(
            (term) => `Duplicated term: ${term}`,
          ),
          ...semanticFindings
            .filter((finding) => finding.findingType === "classification_mismatch")
            .map((finding) => finding.description),
        ],
        affectedAreas: ["governance_classifications"],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review classification meanings and preserve prior interpretation before future version adoption.",
      }),
    );
  }

  if (
    !input.normalizationResult ||
    input.normalizationResult.normalizationClassification === "fragmented" ||
    input.normalizationResult.normalizationClassification === "partially_normalized" ||
    normalizationWeaknesses.length > 0 ||
    missingMetadata.includes("normalizationContractVersion")
  ) {
    findings.push(
      createFinding({
        type: "normalization_version_drift",
        description:
          "Principle-to-evidence normalization mappings may drift across future semantic versions.",
        evidence: [
          input.normalizationResult
            ? `Normalization classification: ${input.normalizationResult.normalizationClassification}`
            : "Principle-to-evidence normalization result was not supplied.",
          ...normalizationWeaknesses,
          ...(input.normalizationResult?.governanceSemanticDriftRisks ?? []),
          missingMetadata.includes("normalizationContractVersion")
            ? "Normalization contract version metadata is not supplied."
            : "",
        ],
        affectedAreas: ["normalization_mappings", "doctrine_principles", "evidence_categories"],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review normalization mappings before depending on them for future versioned governance reasoning.",
      }),
    );
  }

  if (
    !input.traceabilitySurvivabilityResult ||
    input.traceabilitySurvivabilityResult.traceabilitySurvivabilityClassification === "collapsed" ||
    input.traceabilitySurvivabilityResult.traceabilitySurvivabilityClassification === "partially_traceable" ||
    (input.semanticStabilityResult?.traceabilitySemanticFindings.length ?? 0) > 0 ||
    (input.traceabilityResult?.missingLinks.length ?? 0) > 0 ||
    missingMetadata.includes("traceabilityVersion")
  ) {
    findings.push(
      createFinding({
        type: "traceability_semantic_incompatibility",
        description:
          "Traceability semantics need stronger evidence linkage and version metadata for future reconstruction.",
        evidence: [
          input.traceabilitySurvivabilityResult
            ? `Traceability survivability classification: ${input.traceabilitySurvivabilityResult.traceabilitySurvivabilityClassification}`
            : "Traceability survivability review result was not supplied.",
          ...(input.semanticStabilityResult?.traceabilitySemanticFindings ?? []),
          ...(input.traceabilityResult?.missingLinks ?? []),
          missingMetadata.includes("traceabilityVersion")
            ? "Traceability version metadata is not supplied."
            : "",
        ],
        affectedAreas: ["traceability_semantics", "evidence_categories"],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review traceability vocabulary and evidence links before future semantic migration planning.",
      }),
    );
  }

  if (
    !input.explainabilityContinuityResult ||
    input.explainabilityContinuityResult.explainabilityContinuityClassification === "opaque" ||
    input.explainabilityContinuityResult.explainabilityContinuityClassification === "partially_explainable" ||
    (input.explainabilityContinuityResult?.fragileExplainabilityAreas.length ?? 0) > 0 ||
    missingMetadata.includes("explainabilityVersion")
  ) {
    findings.push(
      createFinding({
        type: "explainability_semantic_incompatibility",
        description:
          "Explainability semantics need stronger continuity evidence for future version survivability.",
        evidence: [
          input.explainabilityContinuityResult
            ? `Explainability continuity classification: ${input.explainabilityContinuityResult.explainabilityContinuityClassification}`
            : "Explainability continuity review result was not supplied.",
          ...(input.explainabilityContinuityResult?.fragileExplainabilityAreas ?? []),
          ...(input.explainabilityContinuityResult?.reasoningContinuityFindings ?? []),
          missingMetadata.includes("explainabilityVersion")
            ? "Explainability version metadata is not supplied."
            : "",
        ],
        affectedAreas: ["explainability_semantics", "reviewability_semantics"],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review reasoning labels and explainability limitations before future version compatibility is assumed.",
      }),
    );
  }

  if (
    !input.auditResult ||
    input.auditResult.auditClassification === "critical_risk" ||
    normalizationWeaknesses.some((weakness) => normalize(weakness).includes("audit"))
  ) {
    findings.push(
      createFinding({
        type: "audit_semantic_incompatibility",
        description:
          "Audit semantic compatibility needs stronger audit result and category mapping evidence.",
        evidence: [
          input.auditResult
            ? `Audit classification: ${input.auditResult.auditClassification}`
            : "Full-system governance audit result was not supplied.",
          ...normalizationWeaknesses.filter((weakness) => normalize(weakness).includes("audit")),
        ],
        affectedAreas: ["audit_categories"],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review audit category vocabulary and category mappings before future audit contract versioning.",
      }),
    );
  }

  if (
    !input.doctrineResult ||
    input.doctrineResult.doctrineStatus === "thin" ||
    (input.semanticStabilityResult?.doctrineSemanticFindings.length ?? 0) > 0 ||
    (input.doctrineDurabilityResult?.fragileDoctrineAreas.length ?? 0) > 0 ||
    missingMetadata.includes("doctrineVersion")
  ) {
    findings.push(
      createFinding({
        type: "doctrine_semantic_incompatibility",
        description:
          "Doctrine principle semantics need stronger durability and version context for future semantic evolution.",
        evidence: [
          input.doctrineResult
            ? `Doctrine status: ${input.doctrineResult.doctrineStatus}`
            : "Governance doctrine result was not supplied.",
          ...(input.semanticStabilityResult?.doctrineSemanticFindings ?? []),
          ...(input.doctrineDurabilityResult?.fragileDoctrineAreas ?? []),
          missingMetadata.includes("doctrineVersion") ? "Doctrine version metadata is not supplied." : "",
        ],
        affectedAreas: ["doctrine_principles", "registry_readiness_semantics"],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review doctrine vocabulary and principle definitions before future doctrine versioning.",
      }),
    );
  }

  if (
    (input.semanticStabilityResult?.recommendationSemanticFindings.length ?? 0) > 0 ||
    normalizationWeaknesses.some((weakness) => normalize(weakness).includes("recommendation"))
  ) {
    findings.push(
      createFinding({
        type: "recommendation_semantic_drift",
        description:
          "Recommendation semantics may drift without stronger linkage between recommendations, principles, and evidence.",
        evidence: [
          ...(input.semanticStabilityResult?.recommendationSemanticFindings ?? []),
          ...normalizationWeaknesses.filter((weakness) =>
            normalize(weakness).includes("recommendation"),
          ),
        ],
        affectedAreas: ["recommendation_semantics", "normalization_mappings"],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review recommendation labels to preserve neutral human-review meaning across future semantic versions.",
      }),
    );
  }

  if (
    (input.semanticStabilityResult?.limitationSemanticFindings.length ?? 0) > 0 ||
    (input.traceabilityResult?.limitationGaps.length ?? 0) > 0 ||
    normalizationWeaknesses.some((weakness) => normalize(weakness).includes("limitation"))
  ) {
    findings.push(
      createFinding({
        type: "limitation_semantic_drift",
        description:
          "Limitation semantics may drift without stronger linkage to evidence, scoring drivers, and recommendations.",
        evidence: [
          ...(input.semanticStabilityResult?.limitationSemanticFindings ?? []),
          ...(input.traceabilityResult?.limitationGaps ?? []),
          ...normalizationWeaknesses.filter((weakness) => normalize(weakness).includes("limitation")),
        ],
        affectedAreas: ["limitation_semantics", "traceability_semantics"],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review limitation labels and linkage so future versions preserve confidence boundaries.",
      }),
    );
  }

  if (
    (input.semanticStabilityResult?.scoringSemanticFindings.length ?? 0) > 0 ||
    normalizationWeaknesses.some((weakness) => normalize(weakness).includes("scoring"))
  ) {
    findings.push(
      createFinding({
        type: "scoring_semantic_drift",
        description:
          "Scoring semantics may drift without stable scoring-driver terminology and normalization links.",
        evidence: [
          ...(input.semanticStabilityResult?.scoringSemanticFindings ?? []),
          ...normalizationWeaknesses.filter((weakness) => normalize(weakness).includes("scoring")),
        ],
        affectedAreas: ["scoring_drivers", "normalization_mappings"],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review deterministic scoring driver meanings before future semantic versioning.",
      }),
    );
  }

  if (
    !input.registryReviewResult ||
    input.registryReviewResult.registryReadinessClassification === "unstable" ||
    input.registryReviewResult.registryReadinessClassification === "developing" ||
    missingMetadata.includes("registryVersion") ||
    versioningFindings.some((finding) => finding.findingType === "future_registry_incompatibility_risk")
  ) {
    findings.push(
      createFinding({
        type: "future_registry_version_risk",
        description:
          "Future registry versioning may need additional semantic stability and metadata before adoption.",
        evidence: [
          input.registryReviewResult
            ? `Registry readiness classification: ${input.registryReviewResult.registryReadinessClassification}`
            : "Governance principle registry review result was not supplied.",
          ...versioningFindings
            .filter((finding) => finding.findingType === "future_registry_incompatibility_risk")
            .map((finding) => finding.description),
          missingMetadata.includes("registryVersion") ? "Registry version metadata is not supplied." : "",
        ],
        affectedAreas: ["registry_readiness_semantics", "governance_terminology"],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review registry readiness and version metadata before any future registry implementation.",
      }),
    );
  }

  if (
    (input.versioningReadinessResult?.migrationRiskFindings.length ?? 0) > 0 ||
    (input.compatibilityMigrationContext?.migrationFindings?.length ?? 0) > 0 ||
    missingMetadata.includes("migrationReviewVersion")
  ) {
    findings.push(
      createFinding({
        type: "semantic_migration_survivability_risk",
        description:
          "Future semantic migration survivability needs stronger migration review context and version metadata.",
        evidence: [
          ...(input.versioningReadinessResult?.migrationRiskFindings ?? []),
          ...(input.compatibilityMigrationContext?.migrationFindings ?? []),
          missingMetadata.includes("migrationReviewVersion")
            ? "Migration review version metadata is not supplied."
            : "",
        ],
        affectedAreas: ["lifecycle_continuity_semantics", "registry_readiness_semantics"],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review migration survivability assumptions before future semantic migration planning.",
      }),
    );
  }

  const missingReconstructionInputs = [
    !input.auditHistorySurvivabilityResult ? "audit-history survivability" : "",
    !input.lifecycleContinuityResult ? "lifecycle continuity" : "",
    !input.institutionalMemoryContinuityResult ? "institutional memory continuity" : "",
    !input.traceabilitySurvivabilityResult ? "traceability survivability" : "",
    !input.explainabilityContinuityResult ? "explainability continuity" : "",
  ].filter(Boolean);

  if (
    missingReconstructionInputs.length > 0 ||
    (input.auditHistorySurvivabilityResult?.reconstructionSurvivabilityFindings.length ?? 0) > 0 ||
    (input.traceabilitySurvivabilityResult?.reconstructionSurvivabilityFindings.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "long_horizon_semantic_reconstruction_risk",
        description:
          "Long-horizon semantic reconstruction depends on stronger continuity across audit history, memory, traceability, and explainability inputs.",
        evidence: [
          ...missingReconstructionInputs.map((inputName) => `Missing input: ${inputName}`),
          ...(input.auditHistorySurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
          ...(input.traceabilitySurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
        ],
        affectedAreas: [
          "traceability_semantics",
          "explainability_semantics",
          "lifecycle_continuity_semantics",
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review reconstruction pathways before relying on future semantic versions for long-horizon audit history.",
      }),
    );
  }

  return findings;
}

function buildHumanReviewNotes(
  input: GovernanceSemanticVersionSurvivabilityInput,
  findings: GovernanceSemanticVersionSurvivabilityFinding[],
): string[] {
  return unique([
    "Human review is required before any semantic versioning, taxonomy versioning, or migration planning.",
    "This review is read-only and does not mutate terminology, doctrine, traceability, or audit history.",
    ...findings.map((finding) => finding.recommendedHumanReview),
    ...(input.traceabilitySurvivabilityResult?.humanReviewNotes ?? []),
    ...(input.explainabilityContinuityResult?.humanReviewNotes ?? []),
    ...(input.auditHistorySurvivabilityResult?.humanReviewNotes ?? []),
    ...(input.lifecycleContinuityResult?.humanReviewNotes ?? []),
  ]);
}

function buildFutureStabilizationRecommendations(
  input: GovernanceSemanticVersionSurvivabilityInput,
  findings: GovernanceSemanticVersionSurvivabilityFinding[],
): string[] {
  const missingMetadata = missingSemanticVersionMetadata(input);

  return unique([
    missingMetadata.length > 0
      ? `Review missing semantic-version metadata fields: ${missingMetadata.join(", ")}.`
      : "",
    "Preserve future shared deterministic utility extraction as a separate approved upgrade after the review sequence stabilizes.",
    "Preserve formal traceability, normalization, and version metadata contracts as future infrastructure work; do not connect them to execution systems.",
    "Prepare the Governance Multi-Business / Multi-Tenant Isolation Review as the next read-only stage.",
    ...findings.map((finding) => finding.recommendedHumanReview),
    ...(input.versioningReadinessResult?.futureStabilizationRecommendations ?? []),
    ...(input.semanticStabilityResult?.futureStabilizationRecommendations ?? []),
    ...(input.registryReviewResult?.futureRegistryRecommendations ?? []),
  ]);
}

export function runGovernanceSemanticVersionSurvivabilityReview(
  input: GovernanceSemanticVersionSurvivabilityInput,
): GovernanceSemanticVersionSurvivabilityResult {
  const areaAssessments = buildAreaAssessments(input);
  const findings = buildFindings(input);
  const semanticVersionSurvivabilityScore = calculateOverallSemanticVersionSurvivabilityScore({
    areaAssessments,
    findings,
  });
  const semanticVersionSurvivabilityClassification =
    semanticVersionSurvivabilityClassificationFromScore(semanticVersionSurvivabilityScore);

  const resultWithoutExplainability: Omit<
    GovernanceSemanticVersionSurvivabilityResult,
    "explainability"
  > = {
    semanticVersionSurvivabilityScore,
    semanticVersionSurvivabilityClassification,
    areaAssessments,
    findings,
    versionStableSemanticAreas: areaAssessments
      .filter((area) =>
        ["semantically_survivable", "institutionally_version_survivable"].includes(area.classification),
      )
      .map((area) => `${area.area}: ${area.classification} at ${area.score}/100`),
    versionFragileSemanticAreas: areaAssessments
      .filter((area) => ["version_fragile", "partially_survivable"].includes(area.classification))
      .map((area) => `${area.area}: ${area.classification} at ${area.score}/100`),
    backwardCompatibilityFindings: findings.filter(
      (finding) => finding.findingType === "backward_compatibility_risk",
    ).map((finding) => finding.description),
    taxonomyVersionFindings: findings.filter(
      (finding) => finding.findingType === "taxonomy_version_instability",
    ).map((finding) => finding.description),
    classificationVersionFindings: findings.filter(
      (finding) => finding.findingType === "classification_version_mismatch",
    ).map((finding) => finding.description),
    normalizationVersionFindings: findings.filter(
      (finding) => finding.findingType === "normalization_version_drift",
    ).map((finding) => finding.description),
    traceabilitySemanticFindings: findings.filter(
      (finding) => finding.findingType === "traceability_semantic_incompatibility",
    ).map((finding) => finding.description),
    explainabilitySemanticFindings: findings.filter(
      (finding) => finding.findingType === "explainability_semantic_incompatibility",
    ).map((finding) => finding.description),
    auditSemanticFindings: findings.filter(
      (finding) => finding.findingType === "audit_semantic_incompatibility",
    ).map((finding) => finding.description),
    doctrineSemanticFindings: findings.filter(
      (finding) => finding.findingType === "doctrine_semantic_incompatibility",
    ).map((finding) => finding.description),
    reconstructionSurvivabilityFindings: findings.filter((finding) =>
      [
        "semantic_migration_survivability_risk",
        "long_horizon_semantic_reconstruction_risk",
        "traceability_semantic_incompatibility",
        "explainability_semantic_incompatibility",
      ].includes(finding.findingType),
    ).map((finding) => finding.description),
    humanReviewNotes: buildHumanReviewNotes(input, findings),
    futureStabilizationRecommendations: buildFutureStabilizationRecommendations(input, findings),
    humanReviewRequired:
      findings.length > 0 ||
      areaAssessments.some((area) =>
        ["version_fragile", "partially_survivable"].includes(area.classification),
      ),
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernanceSemanticVersionSurvivabilityExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}
