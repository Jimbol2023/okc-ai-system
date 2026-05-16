import { buildGovernanceVersioningReadinessExplainability } from "./governance-versioning-readiness-review-explainability";
import {
  calculateOverallVersioningReadinessScore,
  calculateVersioningAreaScore,
  calculateVersioningFindingConfidence,
  versioningReadinessClassificationFromScore,
} from "./governance-versioning-readiness-review-scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
} from "./full-system-governance-audit-types";
import type {
  GovernanceVersioningReadinessArea,
  GovernanceVersioningReadinessAreaAssessment,
  GovernanceVersioningReadinessFinding,
  GovernanceVersioningReadinessFindingType,
  GovernanceVersioningReadinessInput,
  GovernanceVersioningReadinessResult,
} from "./governance-versioning-readiness-review-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const versionKeys = [
  "semanticVersion",
  "governanceVersion",
  "doctrineVersion",
  "auditContractVersion",
  "traceabilityContractVersion",
  "observabilityContractVersion",
  "normalizationContractVersion",
  "registryVersion",
  "taxonomyVersion",
  "lifecycleVersion",
  "compatibilityVersion",
  "migrationReviewVersion",
];

const compatibilityKeys = [
  "compatibilityVersion",
  "compatibilityPolicy",
  "backwardCompatibility",
  "migrationReview",
  "migrationReviewVersion",
  "contractVersionPolicy",
];

const getAuditFindings = (input: GovernanceVersioningReadinessInput): FullSystemGovernanceAuditFinding[] =>
  input.auditFindings ?? input.auditResult?.findings ?? [];

const getRecommendations = (input: GovernanceVersioningReadinessInput): FullSystemGovernanceAuditRecommendation[] =>
  input.recommendations ?? input.auditResult?.recommendations ?? [];

const metadataString = (input: GovernanceVersioningReadinessInput, key: string): string | undefined =>
  typeof input.metadata?.[key] === "string" ? input.metadata[key] : undefined;

const suppliedVersionKeys = (input: GovernanceVersioningReadinessInput): string[] =>
  versionKeys.filter((key) => typeof input.metadata?.[key] === "string");

const missingVersionKeys = (input: GovernanceVersioningReadinessInput): string[] =>
  versionKeys.filter((key) => typeof input.metadata?.[key] !== "string");

const suppliedCompatibilityKeys = (input: GovernanceVersioningReadinessInput): string[] =>
  compatibilityKeys.filter((key) => typeof input.metadata?.[key] === "string" || typeof input.metadata?.[key] === "boolean");

const scoreFromStatus = (status: string | undefined): number => {
  if (!status) return 38;
  if (
    [
      "institutionally_versionable",
      "institutionally_reviewable",
      "institutionally_observable",
      "institutionally_scalable",
      "institutionally_durable",
      "institutionally_stable",
      "institutionally_registry_ready",
      "institutionally_consistent",
      "institutionally_traceable",
      "institutionally_ready",
      "institutionally_strong",
      "version_ready",
      "reviewable",
      "observable",
      "durable",
      "scalable",
      "anti_fragile",
    ].includes(status)
  ) {
    return 90;
  }
  if (["stable", "registry_candidate", "normalized", "strong", "operationally_ready", "reliable", "resilient", "aligned"].includes(status)) {
    return 76;
  }
  if (
    [
      "partially_version_ready",
      "partially_reviewable",
      "conditionally_observable",
      "conditionally_scalable",
      "conditionally_durable",
      "mostly_stable",
      "developing",
      "partially_normalized",
      "moderate",
      "forming",
      "pressured",
    ].includes(status)
  ) {
    return 54;
  }
  return 32;
};

const createAreaAssessment = (params: {
  area: GovernanceVersioningReadinessArea;
  baseScore: number;
  description: string;
  versionReadySignals: string[];
  versionFragileSignals: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  findingCount?: number;
}): GovernanceVersioningReadinessAreaAssessment => {
  const versionReadySignals = unique(params.versionReadySignals);
  const versionFragileSignals = unique(params.versionFragileSignals);
  const factors = unique(params.factors);
  const score = calculateVersioningAreaScore({
    baseScore: params.baseScore,
    versionReadySignalCount: versionReadySignals.length,
    versionFragileSignalCount: versionFragileSignals.length,
    findingCount: params.findingCount ?? 0,
    explainabilityCount: factors.length + params.reasoning.length,
  });

  return {
    area: params.area,
    score,
    classification: versioningReadinessClassificationFromScore(score),
    description: params.description,
    versionReadySignals,
    versionFragileSignals,
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors,
      reasoning: params.reasoning,
    },
  };
};

const buildAreaAssessments = (input: GovernanceVersioningReadinessInput): GovernanceVersioningReadinessAreaAssessment[] => {
  const auditFindings = getAuditFindings(input);
  const recommendations = getRecommendations(input);
  const auditCategories = unique([
    ...auditFindings.map((finding) => finding.category),
    ...recommendations.map((recommendation) => recommendation.category),
    ...Object.keys(input.auditResult?.categoryScores ?? {}),
    ...(input.normalizationResult?.mappings.flatMap((mapping) => mapping.auditCategories) ?? []),
    ...(input.traceabilityResult?.traces.map((trace) => trace.auditCategory) ?? []),
  ]);
  const suppliedVersions = suppliedVersionKeys(input);
  const missingVersions = missingVersionKeys(input);
  const compatibilitySignals = suppliedCompatibilityKeys(input);

  return [
    createAreaAssessment({
      area: "governance_semantics",
      baseScore: scoreFromStatus(input.semanticStabilityResult?.semanticStabilityClassification),
      description: "Evaluates whether governance semantics are stable enough for semantic versioning.",
      versionReadySignals: [
        `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
        `semanticVersion: ${metadataString(input, "semanticVersion") ?? "not_supplied"}.`,
        ...(input.semanticStabilityResult?.stableTerms.slice(0, 8) ?? []),
      ],
      versionFragileSignals: input.semanticStabilityResult?.unstableTerms ?? ["Semantic stability result was not supplied."],
      recommendedHumanReview: "Review semantic stability and semantic version metadata before future semantic versioning.",
      factors: [`Semantic findings: ${input.semanticStabilityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Semantic versioning readiness depends on stable terminology, visible drift, and explicit semantic version metadata."],
    }),
    createAreaAssessment({
      area: "doctrine_structures",
      baseScore: Math.min(
        90,
        scoreFromStatus(input.doctrineResult?.doctrineStatus) * 0.5 +
          scoreFromStatus(input.doctrineDurabilityResult?.doctrineDurabilityClassification) * 0.5,
      ),
      description: "Evaluates whether doctrine structures are mature enough for doctrine versioning.",
      versionReadySignals: [
        `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
        `Doctrine durability: ${input.doctrineDurabilityResult?.doctrineDurabilityClassification ?? "not_supplied"}.`,
        `doctrineVersion: ${metadataString(input, "doctrineVersion") ?? "not_supplied"}.`,
      ],
      versionFragileSignals: [
        ...(input.doctrineResult?.doctrineLimitations ?? []),
        ...(input.doctrineDurabilityResult?.fragileDoctrineAreas ?? []),
      ],
      recommendedHumanReview: "Review doctrine durability and doctrineVersion metadata before doctrine evolution tracking.",
      factors: [`Doctrine drift findings: ${input.doctrineResult?.driftFindings.length ?? "not_supplied"}.`],
      reasoning: ["Doctrine versioning readiness requires stable principles, visible drift, limitations, and explicit doctrine version metadata."],
    }),
    createAreaAssessment({
      area: "audit_classifications",
      baseScore: scoreFromStatus(input.auditResult?.auditClassification),
      description: "Evaluates whether audit structures and classifications are ready for audit contract versioning.",
      versionReadySignals: [
        `Audit classification: ${input.auditResult?.auditClassification ?? "not_supplied"}.`,
        `Audit categories represented: ${auditCategories.length}.`,
        `auditContractVersion: ${metadataString(input, "auditContractVersion") ?? "not_supplied"}.`,
      ],
      versionFragileSignals: input.auditResult?.futureTechnicalDebtItems ?? ["Audit result was not supplied."],
      recommendedHumanReview: "Review audit category stability and auditContractVersion metadata before audit contract versioning.",
      factors: [`Audit findings: ${auditFindings.length}.`, `Audit recommendations: ${recommendations.length}.`],
      reasoning: ["Audit contract versioning readiness depends on stable categories, classifications, findings, recommendations, and limitations."],
    }),
    createAreaAssessment({
      area: "traceability_contracts",
      baseScore: scoreFromStatus(input.traceabilityResult?.traceabilityClassification),
      description: "Evaluates whether traceability contracts are mature enough for traceability contract versioning.",
      versionReadySignals: [
        `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
        `Trace links: ${input.traceabilityResult?.traces.length ?? "not_supplied"}.`,
        `traceabilityContractVersion: ${metadataString(input, "traceabilityContractVersion") ?? "not_supplied"}.`,
      ],
      versionFragileSignals: input.traceabilityResult?.evidenceGaps ?? ["Traceability result was not supplied."],
      recommendedHumanReview: "Review traceability gaps and traceabilityContractVersion metadata before contract versioning.",
      factors: [`Traceability gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
      reasoning: ["Traceability contract versioning requires durable evidence, source, scoring, reasoning, limitation, and recommendation links."],
      findingCount: input.traceabilityResult?.gaps.length ?? 1,
    }),
    createAreaAssessment({
      area: "observability_contracts",
      baseScore: scoreFromStatus(input.observabilityDurabilityResult?.observabilityDurabilityClassification),
      description: "Evaluates whether observability structures are ready for observability contract versioning.",
      versionReadySignals: [
        `Observability durability: ${input.observabilityDurabilityResult?.observabilityDurabilityClassification ?? "not_supplied"}.`,
        `Observability scalability: ${input.observabilityDurabilityResult?.observabilityScalabilityClassification ?? "not_supplied"}.`,
        `observabilityContractVersion: ${metadataString(input, "observabilityContractVersion") ?? "not_supplied"}.`,
      ],
      versionFragileSignals: input.observabilityDurabilityResult?.fragileObservabilityAreas ?? ["Observability durability result was not supplied."],
      recommendedHumanReview: "Review observability durability and observabilityContractVersion metadata before observability contract versioning.",
      factors: [`Observability findings: ${input.observabilityDurabilityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Observability versioning readiness depends on durable visibility, blind spot review, and contract metadata."],
    }),
    createAreaAssessment({
      area: "normalization_contracts",
      baseScore: scoreFromStatus(input.normalizationResult?.normalizationClassification),
      description: "Evaluates whether normalization contracts are ready for normalization contract versioning.",
      versionReadySignals: [
        `Normalization classification: ${input.normalizationResult?.normalizationClassification ?? "not_supplied"}.`,
        `Normalization score: ${input.normalizationResult?.normalizationScore ?? "not_supplied"}.`,
        `normalizationContractVersion: ${metadataString(input, "normalizationContractVersion") ?? "not_supplied"}.`,
      ],
      versionFragileSignals: input.normalizationResult?.missingMappings ?? ["Normalization result was not supplied."],
      recommendedHumanReview: "Review normalization gaps and normalizationContractVersion metadata before normalization contract versioning.",
      factors: [`Normalization gaps: ${input.normalizationResult?.gaps.length ?? "not_supplied"}.`],
      reasoning: ["Normalization contract versioning requires stable principle, evidence, scoring, limitation, recommendation, and reasoning mappings."],
    }),
    createAreaAssessment({
      area: "registry_readiness",
      baseScore: scoreFromStatus(input.registryReviewResult?.registryReadinessClassification),
      description: "Evaluates whether registry readiness semantics are mature enough for registry versioning.",
      versionReadySignals: [
        `Registry readiness: ${input.registryReviewResult?.registryReadinessClassification ?? "not_supplied"}.`,
        `Registry score: ${input.registryReviewResult?.registryReadinessScore ?? "not_supplied"}.`,
        `registryVersion: ${metadataString(input, "registryVersion") ?? "not_supplied"}.`,
      ],
      versionFragileSignals: input.registryReviewResult?.semanticDriftRisks ?? ["Registry review result was not supplied."],
      recommendedHumanReview: "Review registry readiness and registryVersion metadata before any future registry versioning.",
      factors: [`Registry findings: ${input.registryReviewResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Registry versioning should wait until registry readiness, semantic stability, and doctrine durability are reviewable."],
    }),
    createAreaAssessment({
      area: "taxonomy_semantics",
      baseScore: Math.min(
        90,
        scoreFromStatus(input.semanticStabilityResult?.semanticStabilityClassification) * 0.5 +
          scoreFromStatus(input.registryReviewResult?.registryReadinessClassification) * 0.5,
      ),
      description: "Evaluates whether taxonomy semantics are ready for taxonomy evolution tracking.",
      versionReadySignals: [
        `taxonomyVersion: ${metadataString(input, "taxonomyVersion") ?? "not_supplied"}.`,
        ...(input.registryReviewResult?.taxonomyStabilityFindings ?? []),
      ],
      versionFragileSignals: [
        ...(input.semanticStabilityResult?.driftRisks ?? []),
        ...(input.registryReviewResult?.semanticDriftRisks ?? []),
      ],
      recommendedHumanReview: "Review taxonomyVersion metadata and taxonomy stability before taxonomy evolution tracking.",
      factors: [`Registry taxonomy findings: ${input.registryReviewResult?.taxonomyStabilityFindings.length ?? "not_supplied"}.`],
      reasoning: ["Taxonomy versioning readiness requires stable vocabulary, registry readiness, and explicit taxonomy version metadata."],
    }),
    createAreaAssessment({
      area: "survivability_semantics",
      baseScore: scoreFromStatus(input.survivabilityExpansionResult?.survivabilityClassification),
      description: "Evaluates whether survivability semantics are stable enough for lifecycle versioning.",
      versionReadySignals: [
        `Survivability: ${input.survivabilityExpansionResult?.survivabilityClassification ?? "not_supplied"}.`,
        `Expansion: ${input.survivabilityExpansionResult?.expansionClassification ?? "not_supplied"}.`,
        ...(input.survivabilityExpansionResult?.durableArchitectureAreas ?? []),
      ],
      versionFragileSignals: input.survivabilityExpansionResult?.fragileExpansionAreas ?? ["Survivability review result was not supplied."],
      recommendedHumanReview: "Review survivability and expansion semantics before lifecycle versioning.",
      factors: [`Survivability findings: ${input.survivabilityExpansionResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Lifecycle versioning needs survivability and expansion context to remain reviewable over time."],
    }),
    createAreaAssessment({
      area: "reviewability_semantics",
      baseScore: scoreFromStatus(input.reviewabilityIntegrityResult?.reviewabilityClassification),
      description: "Evaluates whether reviewability structures are mature enough for versioned governance evolution.",
      versionReadySignals: [
        `Reviewability: ${input.reviewabilityIntegrityResult?.reviewabilityClassification ?? "not_supplied"}.`,
        `Reviewability score: ${input.reviewabilityIntegrityResult?.reviewabilityIntegrityScore ?? "not_supplied"}.`,
        ...(input.reviewabilityIntegrityResult?.reviewableAreas ?? []),
      ],
      versionFragileSignals: input.reviewabilityIntegrityResult?.weakReviewabilityAreas ?? ["Reviewability integrity result was not supplied."],
      recommendedHumanReview: "Review reviewability integrity before future versioning, compatibility, or migration work.",
      factors: [`Reviewability findings: ${input.reviewabilityIntegrityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Versioning readiness depends on outputs being reconstructable, human-auditable, and limitation-aware."],
    }),
    createAreaAssessment({
      area: "evidence_semantics",
      baseScore: Math.min(
        90,
        scoreFromStatus(input.evidenceQualityResult?.overallReliabilityLevel) * 0.5 +
          scoreFromStatus(input.traceabilityResult?.traceabilityClassification) * 0.5,
      ),
      description: "Evaluates whether evidence semantics are stable enough for versioned evidence contracts.",
      versionReadySignals: [
        `Evidence reliability: ${input.evidenceQualityResult?.overallReliabilityLevel ?? "not_supplied"}.`,
        `Evidence quality score: ${input.evidenceQualityResult?.evidenceQualityScore ?? "not_supplied"}.`,
      ],
      versionFragileSignals: [
        ...(input.evidenceQualityResult?.missingEvidenceAreas ?? []),
        ...(input.traceabilityResult?.evidenceGaps ?? []),
      ],
      recommendedHumanReview: "Review evidence quality and traceability before evidence semantics are versioned.",
      factors: [`Evidence quality findings: ${input.evidenceQualityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Evidence semantics are more version-ready when reliability, missing evidence, contradictions, and traceability are visible."],
    }),
    createAreaAssessment({
      area: "recommendation_semantics",
      baseScore: recommendations.length + (input.doctrineResult?.recommendations.length ?? 0) > 0 ? 72 : 42,
      description: "Evaluates whether recommendation semantics are stable enough for versioned governance outputs.",
      versionReadySignals: [
        `Audit recommendations: ${recommendations.length}.`,
        `Doctrine recommendations: ${input.doctrineResult?.recommendations.length ?? "not_supplied"}.`,
      ],
      versionFragileSignals: [
        ...(input.reviewabilityIntegrityResult?.recommendationReviewabilityFindings ?? []),
        ...(input.traceabilityResult?.recommendationLinkageGaps ?? []),
      ],
      recommendedHumanReview: "Review recommendation linkage before versioning recommendation semantics.",
      factors: [`Recommendation linkage gaps: ${input.traceabilityResult?.recommendationLinkageGaps.length ?? "not_supplied"}.`],
      reasoning: ["Recommendation versioning readiness requires stable wording and visible linkage to evidence, limitations, and human review."],
    }),
    createAreaAssessment({
      area: "limitation_semantics",
      baseScore: (input.reviewabilityIntegrityResult?.limitationReviewabilityFindings.length ?? 1) === 0 ? 76 : 58,
      description: "Evaluates whether limitation semantics are stable enough for versioning.",
      versionReadySignals: [
        `Audit limitations: ${input.auditResult?.limitations.length ?? "not_supplied"}.`,
        `Doctrine limitations: ${input.doctrineResult?.doctrineLimitations.length ?? "not_supplied"}.`,
      ],
      versionFragileSignals: [
        ...(input.reviewabilityIntegrityResult?.limitationReviewabilityFindings ?? []),
        ...(input.traceabilityResult?.limitationGaps ?? []),
      ],
      recommendedHumanReview: "Review limitation visibility before future versioning and compatibility work.",
      factors: [`Limitation reviewability findings: ${input.reviewabilityIntegrityResult?.limitationReviewabilityFindings.length ?? "not_supplied"}.`],
      reasoning: ["Versioned governance outputs should preserve limitations so older outputs remain interpretable."],
    }),
    createAreaAssessment({
      area: "scoring_semantics",
      baseScore: scoreFromStatus(input.semanticStabilityResult?.semanticStabilityClassification),
      description: "Evaluates whether scoring semantics are stable enough for future compatibility guarantees.",
      versionReadySignals: [
        `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
        ...(input.normalizationResult?.scoringDriverConsistency ?? []),
      ],
      versionFragileSignals: [
        ...(input.semanticStabilityResult?.scoringSemanticFindings ?? []),
        ...(input.normalizationResult?.gaps
          .filter((gap) => gap.gapType === "scoring_driver_inconsistency")
          .map((gap) => gap.description) ?? []),
      ],
      recommendedHumanReview: "Review scoring driver semantics before future compatibility guarantees.",
      factors: [`Scoring semantic findings: ${input.semanticStabilityResult?.scoringSemanticFindings.length ?? "not_supplied"}.`],
      reasoning: ["Scoring semantics are version-ready when score drivers remain deterministic, visible, and stable."],
    }),
    createAreaAssessment({
      area: "governance_metadata",
      baseScore: Math.min(88, suppliedVersionKeys(input).length * 8 + suppliedCompatibilityKeys(input).length * 6),
      description: "Evaluates whether governance metadata is explicit enough for versioning infrastructure.",
      versionReadySignals: [
        ...suppliedVersions.map((key) => `${key}: ${String(input.metadata?.[key])}.`),
        ...compatibilitySignals.map((key) => `${key}: ${String(input.metadata?.[key])}.`),
      ],
      versionFragileSignals: missingVersions.map((key) => `${key} was not supplied.`),
      recommendedHumanReview: "Review version metadata and compatibility metadata before future versioning infrastructure.",
      factors: [`Version metadata supplied: ${suppliedVersions.length}.`, `Compatibility metadata supplied: ${compatibilitySignals.length}.`],
      reasoning: ["Versioning readiness improves when governance, semantic, doctrine, audit, traceability, observability, normalization, registry, taxonomy, lifecycle, compatibility, and migration review versions are explicit."],
    }),
    createAreaAssessment({
      area: "governance_lifecycle_tracking",
      baseScore: metadataString(input, "lifecycleVersion") ? 72 : 42,
      description: "Evaluates whether governance lifecycle tracking metadata is explicit.",
      versionReadySignals: [`lifecycleVersion: ${metadataString(input, "lifecycleVersion") ?? "not_supplied"}.`],
      versionFragileSignals: metadataString(input, "lifecycleVersion") ? [] : ["lifecycleVersion was not supplied."],
      recommendedHumanReview: "Review lifecycleVersion metadata before lifecycle tracking or governance evolution workflows.",
      factors: [`Lifecycle metadata supplied: ${Boolean(metadataString(input, "lifecycleVersion"))}.`],
      reasoning: ["Lifecycle versioning readiness requires explicit lifecycle version metadata and human-reviewed evolution context."],
    }),
    createAreaAssessment({
      area: "backward_compatibility_review",
      baseScore: compatibilitySignals.length >= 2 ? 72 : 42,
      description: "Evaluates whether backward compatibility expectations are explicit enough for future guarantees.",
      versionReadySignals: compatibilitySignals.map((key) => `${key}: ${String(input.metadata?.[key])}.`),
      versionFragileSignals: compatibilitySignals.length >= 2 ? [] : ["Backward compatibility and contract version policy metadata are limited."],
      recommendedHumanReview: "Review compatibility expectations before future compatibility guarantees.",
      factors: [`Compatibility metadata supplied: ${compatibilitySignals.length}.`],
      reasoning: ["Compatibility guarantees should wait until policy, migration, and version metadata are explicit."],
    }),
    createAreaAssessment({
      area: "governance_migration_review",
      baseScore:
        metadataString(input, "migrationReview") ||
        metadataString(input, "migrationReadiness") ||
        metadataString(input, "migrationReviewVersion")
          ? 70
          : 40,
      description: "Evaluates whether governance migration review assumptions are explicit.",
      versionReadySignals: [
        `migrationReview: ${metadataString(input, "migrationReview") ?? "not_supplied"}.`,
        `migrationReadiness: ${metadataString(input, "migrationReadiness") ?? "not_supplied"}.`,
        `migrationReviewVersion: ${metadataString(input, "migrationReviewVersion") ?? "not_supplied"}.`,
      ],
      versionFragileSignals:
        metadataString(input, "migrationReview") ||
        metadataString(input, "migrationReadiness") ||
        metadataString(input, "migrationReviewVersion")
          ? []
          : ["Migration review metadata was not supplied."],
      recommendedHumanReview: "Review migration readiness before future governance migration or compatibility work.",
      factors: ["Migration review remains read-only and does not create a migration engine."],
      reasoning: ["Migration review readiness requires explicit human-reviewed assumptions before any future migration tooling."],
    }),
  ];
};

const createFinding = (params: {
  findingType: GovernanceVersioningReadinessFindingType;
  area: GovernanceVersioningReadinessArea;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedAuditCategories?: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): GovernanceVersioningReadinessFinding => {
  const evidence = unique(params.evidence);
  const factors = unique(params.factors);

  return {
    id: `governance-versioning-readiness-${slug(params.findingType)}-${slug(params.area)}-${slug(params.description)}`,
    findingType: params.findingType,
    area: params.area,
    severity: params.severity,
    description: params.description,
    evidence,
    affectedAuditCategories: unique(params.affectedAuditCategories ?? []) as FullSystemGovernanceAuditCategory[],
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateVersioningFindingConfidence({
      evidenceCount: evidence.length,
      factorCount: factors.length,
      baseConfidence: params.baseConfidence,
    }),
    explainability: {
      factors,
      reasoning: params.reasoning,
    },
  };
};

const buildFindings = (input: GovernanceVersioningReadinessInput): GovernanceVersioningReadinessFinding[] => {
  const findings: GovernanceVersioningReadinessFinding[] = [];
  const missingVersions = missingVersionKeys(input);
  const compatibilitySignals = suppliedCompatibilityKeys(input);
  const auditCategories = unique([
    ...getAuditFindings(input).map((finding) => finding.category),
    ...Object.keys(input.auditResult?.categoryScores ?? {}),
  ]) as FullSystemGovernanceAuditCategory[];

  if (!input.semanticStabilityResult || ["unstable", "mostly_stable"].includes(input.semanticStabilityResult.semanticStabilityClassification)) {
    findings.push(
      createFinding({
        findingType: "unstable_semantics",
        area: "governance_semantics",
        severity: !input.semanticStabilityResult || input.semanticStabilityResult.semanticStabilityClassification === "unstable" ? "elevated" : "moderate",
        description: "Semantic stability is not strong enough for versioning without human review.",
        evidence: [
          `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
          ...(input.semanticStabilityResult?.driftRisks.slice(0, 8) ?? []),
        ],
        recommendedHumanReview: "Review semantic stability before future semantic versioning.",
        factors: [`Semantic findings: ${input.semanticStabilityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Versioning unstable semantics can lock in unclear terminology and drift."],
      }),
    );
  }

  if (
    input.auditResult?.auditClassification === "critical_risk" ||
    input.reviewabilityIntegrityResult?.reviewabilityClassification === "weak" ||
    input.observabilityDurabilityResult?.observabilityDurabilityClassification === "fragile"
  ) {
    findings.push(
      createFinding({
        findingType: "unstable_classifications",
        area: "audit_classifications",
        severity: "elevated",
        description: "Some governance classifications are too weak or fragile for versioning readiness.",
        evidence: [
          `Audit: ${input.auditResult?.auditClassification ?? "not_supplied"}.`,
          `Reviewability: ${input.reviewabilityIntegrityResult?.reviewabilityClassification ?? "not_supplied"}.`,
          `Observability: ${input.observabilityDurabilityResult?.observabilityDurabilityClassification ?? "not_supplied"}.`,
        ],
        affectedAuditCategories: auditCategories,
        recommendedHumanReview: "Review weak classifications before future contract versioning.",
        factors: ["Weak classifications reduce confidence in versioning stability."],
        reasoning: ["Versioned contracts should not stabilize classifications that are still fragile or weak."],
      }),
    );
  }

  if (!input.reviewabilityIntegrityResult || !input.observabilityDurabilityResult || !input.traceabilityResult || !input.auditResult) {
    findings.push(
      createFinding({
        findingType: "incompatible_governance_structure",
        area: "governance_metadata",
        severity: "elevated",
        description: "Core governance structures needed for versioning review are missing.",
        evidence: [
          `Reviewability supplied: ${Boolean(input.reviewabilityIntegrityResult)}.`,
          `Observability supplied: ${Boolean(input.observabilityDurabilityResult)}.`,
          `Traceability supplied: ${Boolean(input.traceabilityResult)}.`,
          `Audit supplied: ${Boolean(input.auditResult)}.`,
        ],
        recommendedHumanReview: "Supply core reviewability, observability, traceability, and audit context before relying on versioning readiness.",
        factors: ["Versioning readiness requires core structures to be available together."],
        reasoning: ["Contract versioning cannot be reviewed well when foundational contract surfaces are missing."],
      }),
    );
  }

  if ((input.registryReviewResult?.taxonomyStabilityFindings.length ?? 0) > 0 || !metadataString(input, "taxonomyVersion")) {
    findings.push(
      createFinding({
        findingType: "taxonomy_instability",
        area: "taxonomy_semantics",
        severity: !metadataString(input, "taxonomyVersion") ? "moderate" : "low",
        description: "Taxonomy versioning needs stronger taxonomy stability or explicit taxonomyVersion metadata.",
        evidence: [
          `taxonomyVersion: ${metadataString(input, "taxonomyVersion") ?? "not_supplied"}.`,
          ...(input.registryReviewResult?.taxonomyStabilityFindings.slice(0, 8) ?? []),
        ],
        recommendedHumanReview: "Review taxonomy stability and taxonomyVersion metadata before taxonomy evolution tracking.",
        factors: [`Taxonomy findings: ${input.registryReviewResult?.taxonomyStabilityFindings.length ?? "not_supplied"}.`],
        reasoning: ["Taxonomy versioning should wait until vocabulary and category evolution are explicit and reviewable."],
      }),
    );
  }

  if (missingVersions.length > 0) {
    findings.push(
      createFinding({
        findingType: "version_fragile_semantics",
        area: "governance_metadata",
        severity: missingVersions.length >= 6 ? "elevated" : "moderate",
        description: "Governance version metadata is incomplete.",
        evidence: missingVersions.map((key) => `${key} was not supplied.`),
        recommendedHumanReview: "Review missing version metadata before future versioning infrastructure.",
        factors: [`Missing version metadata fields: ${missingVersions.length}.`],
        reasoning: ["Versioning readiness depends on explicit metadata for semantic, governance, doctrine, audit, traceability, observability, normalization, registry, taxonomy, and lifecycle contracts."],
      }),
    );
  }

  if (!input.traceabilityResult || input.traceabilityResult.gaps.length > 0 || ["weak", "moderate"].includes(input.traceabilityResult.traceabilityClassification)) {
    findings.push(
      createFinding({
        findingType: "traceability_contract_instability",
        area: "traceability_contracts",
        severity: !input.traceabilityResult || input.traceabilityResult.traceabilityClassification === "weak" ? "elevated" : "moderate",
        description: "Traceability contract context has gaps or limited strength.",
        evidence: [
          `Traceability: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
          ...(input.traceabilityResult?.gaps.map((gap) => gap.description).slice(0, 8) ?? []),
        ],
        recommendedHumanReview: "Review traceability contract stability before traceability contract versioning.",
        factors: [`Traceability gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
        reasoning: ["Traceability contract versioning needs stable links between evidence, source, scoring, reasoning, limitations, and recommendations."],
      }),
    );
  }

  if (!input.auditResult || input.auditResult.auditClassification === "critical_risk" || input.auditResult.futureTechnicalDebtItems.length > 0) {
    findings.push(
      createFinding({
        findingType: "audit_contract_instability",
        area: "audit_classifications",
        severity: !input.auditResult || input.auditResult.auditClassification === "critical_risk" ? "elevated" : "moderate",
        description: "Audit contract context is missing, critical, or has future technical debt.",
        evidence: [
          `Audit classification: ${input.auditResult?.auditClassification ?? "not_supplied"}.`,
          ...(input.auditResult?.futureTechnicalDebtItems.slice(0, 8) ?? []),
        ],
        affectedAuditCategories: auditCategories,
        recommendedHumanReview: "Review audit contract stability before audit contract versioning.",
        factors: [`Audit technical debt items: ${input.auditResult?.futureTechnicalDebtItems.length ?? "not_supplied"}.`],
        reasoning: ["Audit contract versioning should wait until audit structure and technical debt are reviewable."],
      }),
    );
  }

  if (!input.normalizationResult || input.normalizationResult.normalizationClassification === "fragmented" || input.normalizationResult.gaps.length > 0) {
    findings.push(
      createFinding({
        findingType: "normalization_instability",
        area: "normalization_contracts",
        severity: !input.normalizationResult || input.normalizationResult.normalizationClassification === "fragmented" ? "elevated" : "moderate",
        description: "Normalization contract context is missing, fragmented, or has mapping gaps.",
        evidence: [
          `Normalization: ${input.normalizationResult?.normalizationClassification ?? "not_supplied"}.`,
          ...(input.normalizationResult?.gaps.map((gap) => gap.description).slice(0, 8) ?? []),
        ],
        recommendedHumanReview: "Review normalization stability before normalization contract versioning.",
        factors: [`Normalization gaps: ${input.normalizationResult?.gaps.length ?? "not_supplied"}.`],
        reasoning: ["Normalization versioning depends on stable principle-to-evidence and score-driver mappings."],
      }),
    );
  }

  if (
    !input.observabilityDurabilityResult ||
    ["fragile", "conditionally_observable"].includes(input.observabilityDurabilityResult.observabilityDurabilityClassification)
  ) {
    findings.push(
      createFinding({
        findingType: "observability_instability",
        area: "observability_contracts",
        severity: !input.observabilityDurabilityResult || input.observabilityDurabilityResult.observabilityDurabilityClassification === "fragile" ? "elevated" : "moderate",
        description: "Observability contract context is missing or not yet strongly observable.",
        evidence: [
          `Observability durability: ${input.observabilityDurabilityResult?.observabilityDurabilityClassification ?? "not_supplied"}.`,
          ...(input.observabilityDurabilityResult?.fragileObservabilityAreas ?? []),
        ],
        recommendedHumanReview: "Review observability durability before observability contract versioning.",
        factors: [`Observability findings: ${input.observabilityDurabilityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Observability contract versioning should wait until visibility and blind spot review are durable."],
      }),
    );
  }

  if (!input.doctrineResult || input.doctrineResult.doctrineStatus === "thin" || input.doctrineResult.driftFindings.length > 0 || !metadataString(input, "doctrineVersion")) {
    findings.push(
      createFinding({
        findingType: "doctrine_evolution_risk",
        area: "doctrine_structures",
        severity: !input.doctrineResult || input.doctrineResult.doctrineStatus === "thin" ? "elevated" : "moderate",
        description: "Doctrine evolution tracking needs stronger doctrine stability or doctrineVersion metadata.",
        evidence: [
          `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
          `doctrineVersion: ${metadataString(input, "doctrineVersion") ?? "not_supplied"}.`,
          ...(input.doctrineResult?.driftFindings.map((finding) => finding.description).slice(0, 8) ?? []),
        ],
        recommendedHumanReview: "Review doctrine stability and doctrineVersion metadata before doctrine evolution tracking.",
        factors: [`Doctrine drift findings: ${input.doctrineResult?.driftFindings.length ?? "not_supplied"}.`],
        reasoning: ["Doctrine evolution should be versioned only after principle drift and limitations are human-reviewed."],
      }),
    );
  }

  if (compatibilitySignals.length < 2) {
    findings.push(
      createFinding({
        findingType: "backward_compatibility_risk",
        area: "backward_compatibility_review",
        severity: "moderate",
        description: "Backward compatibility expectations are not explicit enough for future guarantees.",
        evidence: compatibilityKeys.map((key) => `${key}: ${String(input.metadata?.[key] ?? "not_supplied")}.`),
        recommendedHumanReview: "Review backward compatibility and contract version policy metadata before compatibility guarantees.",
        factors: [`Compatibility metadata fields supplied: ${compatibilitySignals.length}.`],
        reasoning: ["Backward compatibility should not be promised until compatibility policy and migration review assumptions are explicit."],
      }),
    );
  }

  if (
    !metadataString(input, "migrationReview") &&
    !metadataString(input, "migrationReadiness") &&
    !metadataString(input, "migrationReviewVersion")
  ) {
    findings.push(
      createFinding({
        findingType: "governance_migration_risk",
        area: "governance_migration_review",
        severity: "moderate",
        description: "Governance migration review metadata is not supplied.",
        evidence: [
          "migrationReview was not supplied.",
          "migrationReadiness was not supplied.",
          "migrationReviewVersion was not supplied.",
        ],
        recommendedHumanReview: "Review migration assumptions before future governance migration work.",
        factors: ["Migration review remains review-only and no migration engine was created."],
        reasoning: ["Migration readiness should be explicit before future contract migration or compatibility reviews."],
      }),
    );
  }

  if (!metadataString(input, "semanticVersion") || !metadataString(input, "governanceVersion")) {
    findings.push(
      createFinding({
        findingType: "semantic_version_drift_risk",
        area: "governance_semantics",
        severity: "moderate",
        description: "Semantic or governance version metadata is missing.",
        evidence: [
          `semanticVersion: ${metadataString(input, "semanticVersion") ?? "not_supplied"}.`,
          `governanceVersion: ${metadataString(input, "governanceVersion") ?? "not_supplied"}.`,
        ],
        recommendedHumanReview: "Review semantic and governance version metadata before future versioning infrastructure.",
        factors: ["Semantic version drift risk is evaluated from missing semanticVersion and governanceVersion metadata."],
        reasoning: ["Semantic version drift is harder to manage when semantic and governance version identifiers are absent."],
      }),
    );
  }

  if (!input.registryReviewResult || ["unstable", "developing"].includes(input.registryReviewResult.registryReadinessClassification) || !metadataString(input, "registryVersion")) {
    findings.push(
      createFinding({
        findingType: "future_registry_incompatibility_risk",
        area: "registry_readiness",
        severity: !input.registryReviewResult || input.registryReviewResult.registryReadinessClassification === "unstable" ? "elevated" : "moderate",
        description: "Future registry versioning readiness is missing or not yet mature.",
        evidence: [
          `Registry readiness: ${input.registryReviewResult?.registryReadinessClassification ?? "not_supplied"}.`,
          `registryVersion: ${metadataString(input, "registryVersion") ?? "not_supplied"}.`,
          ...(input.registryReviewResult?.semanticDriftRisks ?? []),
        ],
        recommendedHumanReview: "Review registry readiness and registryVersion metadata before future registry versioning.",
        factors: [`Registry findings: ${input.registryReviewResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Registry versioning should wait until registry readiness, semantic stability, and doctrine durability are reviewable."],
      }),
    );
  }

  return findings;
};

export function analyzeGovernanceVersioningReadiness(
  input: GovernanceVersioningReadinessInput,
): GovernanceVersioningReadinessResult {
  const areaAssessments = buildAreaAssessments(input);
  const findings = buildFindings(input);
  const versioningReadinessScore = calculateOverallVersioningReadinessScore({ areaAssessments, findings });
  const resultWithoutExplainability = {
    versioningReadinessScore,
    versioningReadinessClassification: versioningReadinessClassificationFromScore(versioningReadinessScore),
    areaAssessments,
    findings,
    stableVersionReadyAreas: unique(
      areaAssessments
        .filter((assessment) => assessment.classification === "version_ready" || assessment.classification === "institutionally_versionable")
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    unstableVersionFragileAreas: unique(
      areaAssessments
        .filter((assessment) => assessment.classification === "version_fragile" || assessment.classification === "partially_version_ready")
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    semanticVersioningFindings: unique(
      findings
        .filter((finding) =>
          ["unstable_semantics", "version_fragile_semantics", "semantic_version_drift_risk"].includes(finding.findingType),
        )
        .map((finding) => finding.description),
    ),
    taxonomyVersioningFindings: unique(
      findings.filter((finding) => finding.findingType === "taxonomy_instability").map((finding) => finding.description),
    ),
    doctrineVersioningFindings: unique(
      findings.filter((finding) => finding.findingType === "doctrine_evolution_risk").map((finding) => finding.description),
    ),
    auditContractFindings: unique(
      findings.filter((finding) => finding.findingType === "audit_contract_instability").map((finding) => finding.description),
    ),
    traceabilityContractFindings: unique(
      findings.filter((finding) => finding.findingType === "traceability_contract_instability").map((finding) => finding.description),
    ),
    observabilityContractFindings: unique(
      findings.filter((finding) => finding.findingType === "observability_instability").map((finding) => finding.description),
    ),
    compatibilityFindings: unique(
      findings.filter((finding) => finding.findingType === "backward_compatibility_risk").map((finding) => finding.description),
    ),
    migrationRiskFindings: unique(
      findings.filter((finding) => finding.findingType === "governance_migration_risk").map((finding) => finding.description),
    ),
    institutionalEvolutionFindings: unique([
      `Lifecycle version: ${metadataString(input, "lifecycleVersion") ?? "not_supplied"}.`,
      `Reviewability: ${input.reviewabilityIntegrityResult?.reviewabilityClassification ?? "not_supplied"}.`,
      `Continuity: ${input.continuityResult?.continuityStatus ?? "not_supplied"}.`,
      ...(input.reviewabilityIntegrityResult?.institutionalTrustFindings ?? []),
      ...(input.doctrineDurabilityResult?.institutionalSurvivabilityFindings ?? []),
    ]),
    registryReadinessImplications: unique([
      `Registry readiness: ${input.registryReviewResult?.registryReadinessClassification ?? "not_supplied"}.`,
      `registryVersion: ${metadataString(input, "registryVersion") ?? "not_supplied"}.`,
      ...(input.registryReviewResult?.futureRegistryRecommendations ?? []),
      ...(input.reviewabilityIntegrityResult?.futureStabilizationRecommendations ?? []),
      "Registry versioning should remain review-only until semantic stability, doctrine durability, reviewability integrity, and version metadata are human-reviewed.",
    ]),
    humanReviewNotes: unique([
      ...findings.map((finding) => finding.recommendedHumanReview),
      "Do not implement persistence, registry storage, migration engines, semantic rewriting, governance enforcement, contract mutation, or orchestration execution during this review-only stage.",
      "Keep future versioning, compatibility, migration, registry, and lifecycle integrations separate from pure governance review engines.",
    ]),
    futureStabilizationRecommendations: [
      "Prepare Governance Compatibility & Migration Survivability Review before any persistence, registry storage, or migration tooling.",
      "Review version metadata for semantic, governance, doctrine, audit, traceability, observability, normalization, registry, taxonomy, and lifecycle contracts.",
      "Review backward compatibility and migration assumptions before future compatibility guarantees.",
      "Review versioning readiness with reviewability, observability, survivability, doctrine durability, semantic stability, registry, normalization, traceability, audit, readiness, assurance, memory, lineage, continuity, resilience, and evidence quality supplied together.",
      "Consider shared deterministic versioning helpers only after compatibility and migration survivability review confirms stable contracts.",
    ],
    humanReviewRequired:
      findings.length > 0 ||
      areaAssessments.some(
        (assessment) => assessment.classification === "version_fragile" || assessment.classification === "partially_version_ready",
      ),
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernanceVersioningReadinessExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}

export const getGovernanceVersioningReadinessReview = analyzeGovernanceVersioningReadiness;
