import { buildGovernanceInstitutionalMemoryContinuityExplainability } from "./governance-institutional-memory-continuity-review-explainability";
import {
  calculateInstitutionalMemoryContinuityAreaScore,
  calculateInstitutionalMemoryContinuityFindingConfidence,
  calculateOverallInstitutionalMemoryContinuityScore,
  institutionalMemoryContinuityClassificationFromScore,
} from "./governance-institutional-memory-continuity-review-scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
} from "./full-system-governance-audit-types";
import type {
  GovernanceInstitutionalMemoryContinuityArea,
  GovernanceInstitutionalMemoryContinuityAreaAssessment,
  GovernanceInstitutionalMemoryContinuityFinding,
  GovernanceInstitutionalMemoryContinuityFindingType,
  GovernanceInstitutionalMemoryContinuityInput,
  GovernanceInstitutionalMemoryContinuityResult,
} from "./governance-institutional-memory-continuity-review-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const getAuditFindings = (input: GovernanceInstitutionalMemoryContinuityInput): FullSystemGovernanceAuditFinding[] =>
  input.auditFindings ?? input.auditResult?.findings ?? [];

const getRecommendations = (
  input: GovernanceInstitutionalMemoryContinuityInput,
): FullSystemGovernanceAuditRecommendation[] => input.recommendations ?? input.auditResult?.recommendations ?? [];

const metadataString = (input: GovernanceInstitutionalMemoryContinuityInput, key: string): string | undefined =>
  typeof input.metadata?.[key] === "string" ? input.metadata[key] : undefined;

const countSupplied = (items: unknown[]): number => items.filter(Boolean).length;

const scoreFromStatus = (status: string | undefined): number => {
  if (!status) return 38;
  if (
    [
      "institutionally_reconstructable",
      "institutionally_continuous",
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
      "reconstructable",
      "continuous",
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
  if (
    [
      "stable",
      "registry_candidate",
      "normalized",
      "strong",
      "operationally_ready",
      "reliable",
      "resilient",
      "aligned",
    ].includes(status)
  ) {
    return 76;
  }
  if (
    [
      "partially_reconstructable",
      "partially_continuous",
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
  area: GovernanceInstitutionalMemoryContinuityArea;
  baseScore: number;
  description: string;
  reconstructableSignals: string[];
  memoryFragilitySignals: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  findingCount?: number;
}): GovernanceInstitutionalMemoryContinuityAreaAssessment => {
  const reconstructableSignals = unique(params.reconstructableSignals);
  const memoryFragilitySignals = unique(params.memoryFragilitySignals);
  const factors = unique(params.factors);
  const score = calculateInstitutionalMemoryContinuityAreaScore({
    baseScore: params.baseScore,
    reconstructableSignalCount: reconstructableSignals.length,
    memoryFragilitySignalCount: memoryFragilitySignals.length,
    findingCount: params.findingCount ?? 0,
    explainabilityCount: factors.length + params.reasoning.length,
  });

  return {
    area: params.area,
    score,
    classification: institutionalMemoryContinuityClassificationFromScore(score),
    description: params.description,
    reconstructableSignals,
    memoryFragilitySignals,
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors,
      reasoning: params.reasoning,
    },
  };
};

const buildAreaAssessments = (
  input: GovernanceInstitutionalMemoryContinuityInput,
): GovernanceInstitutionalMemoryContinuityAreaAssessment[] => {
  const auditFindings = getAuditFindings(input);
  const recommendations = getRecommendations(input);
  const auditCategories = unique([
    ...auditFindings.map((finding) => finding.category),
    ...recommendations.map((recommendation) => recommendation.category),
    ...Object.keys(input.auditResult?.categoryScores ?? {}),
    ...(input.traceabilityResult?.traces.map((trace) => trace.auditCategory) ?? []),
    ...(input.normalizationResult?.mappings.flatMap((mapping) => mapping.auditCategories) ?? []),
  ]);
  const suppliedMemoryLayers = countSupplied([
    input.lifecycleContinuityResult,
    input.versioningReadinessResult,
    input.reviewabilityIntegrityResult,
    input.observabilityDurabilityResult,
    input.survivabilityExpansionResult,
    input.doctrineDurabilityResult,
    input.semanticStabilityResult,
    input.normalizationResult,
    input.traceabilityResult,
    input.auditResult,
    input.readinessResult,
    input.assuranceResult,
    input.alignmentResult,
    input.doctrineResult,
    input.memoryResult,
    input.lineageResult,
    input.resilienceResult,
    input.continuityResult,
    input.evidenceQualityResult,
  ]);
  const compatibilitySignals = unique([
    ...(input.lifecycleContinuityResult?.migrationContinuityFindings ?? []),
    ...(input.versioningReadinessResult?.compatibilityFindings ?? []),
    ...(input.compatibilityMigrationContext?.compatibilityFindings ?? []),
    ...(metadataString(input, "compatibilityVersion") ? [`compatibilityVersion: ${metadataString(input, "compatibilityVersion")}.`] : []),
  ]);
  const migrationSignals = unique([
    ...(input.lifecycleContinuityResult?.migrationContinuityFindings ?? []),
    ...(input.versioningReadinessResult?.migrationRiskFindings ?? []),
    ...(input.compatibilityMigrationContext?.migrationFindings ?? []),
    ...(metadataString(input, "migrationReviewVersion")
      ? [`migrationReviewVersion: ${metadataString(input, "migrationReviewVersion")}.`]
      : []),
  ]);

  return [
    createAreaAssessment({
      area: "governance_findings",
      baseScore: Math.min(88, suppliedMemoryLayers * 5),
      description: "Evaluates whether governance outputs are available together for institutional memory reconstruction.",
      reconstructableSignals: [
        `Memory review layers supplied: ${suppliedMemoryLayers}.`,
        `Audit categories represented: ${auditCategories.length}.`,
        `Memory status: ${input.memoryResult?.institutionalMemoryStatus ?? "not_supplied"}.`,
      ],
      memoryFragilitySignals: suppliedMemoryLayers < 12 ? ["Layered governance memory context is incomplete."] : [],
      recommendedHumanReview: "Review governance memory context across layers before relying on institutional reconstruction.",
      factors: [`Memory review layers supplied: ${suppliedMemoryLayers}.`],
      reasoning: ["Institutional memory continuity is stronger when governance outputs can be reviewed together without mutation or storage writes."],
    }),
    createAreaAssessment({
      area: "audit_history",
      baseScore: scoreFromStatus(input.auditResult?.auditClassification),
      description: "Evaluates whether audit history can be reconstructed from findings, category scores, limitations, and recommendations.",
      reconstructableSignals: [
        `Audit classification: ${input.auditResult?.auditClassification ?? "not_supplied"}.`,
        `Audit findings: ${auditFindings.length}.`,
        `Audit recommendations: ${recommendations.length}.`,
      ],
      memoryFragilitySignals: input.auditResult?.futureTechnicalDebtItems ?? ["Audit result was not supplied."],
      recommendedHumanReview: "Review audit findings and future technical debt before relying on audit memory continuity.",
      factors: [`Audit category count: ${auditCategories.length}.`],
      reasoning: ["Audit memory remains reconstructable when findings, risks, limitations, recommendations, and category scores stay visible."],
    }),
    createAreaAssessment({
      area: "evidence_chains",
      baseScore: scoreFromStatus(input.evidenceQualityResult?.overallReliabilityLevel),
      description: "Evaluates whether evidence memory remains reconstructable across future governance evolution.",
      reconstructableSignals: [
        `Evidence reliability: ${input.evidenceQualityResult?.overallReliabilityLevel ?? "not_supplied"}.`,
        `Evidence quality score: ${input.evidenceQualityResult?.evidenceQualityScore ?? "not_supplied"}.`,
        ...(input.evidenceQualityResult?.stabilizationSupportedAreas ?? []),
      ],
      memoryFragilitySignals: input.evidenceQualityResult?.missingEvidenceAreas ?? ["Evidence quality result was not supplied."],
      recommendedHumanReview: "Review evidence gaps before relying on institutional evidence memory.",
      factors: [`Evidence quality findings: ${input.evidenceQualityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Evidence memory is stronger when reliability, missing evidence, stabilization support, and limitations remain visible."],
    }),
    createAreaAssessment({
      area: "traceability_chains",
      baseScore: scoreFromStatus(input.traceabilityResult?.traceabilityClassification),
      description: "Evaluates whether traceability memory preserves evidence, source, reasoning, limitation, and recommendation links.",
      reconstructableSignals: [
        `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
        `Trace links: ${input.traceabilityResult?.traces.length ?? "not_supplied"}.`,
        ...(input.traceabilityResult?.traceStrengths ?? []),
      ],
      memoryFragilitySignals: input.traceabilityResult?.traceWeaknesses ?? ["Traceability result was not supplied."],
      recommendedHumanReview: "Review traceability memory gaps before relying on institutional reconstruction.",
      factors: [`Traceability gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
      reasoning: ["Traceability memory requires durable links between evidence, reasoning, scoring drivers, limitations, and recommendations."],
      findingCount: input.traceabilityResult?.gaps.length ?? 1,
    }),
    createAreaAssessment({
      area: "semantic_history",
      baseScore: scoreFromStatus(input.semanticStabilityResult?.semanticStabilityClassification),
      description: "Evaluates whether semantic memory remains stable across governance evolution.",
      reconstructableSignals: [
        `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
        ...(input.semanticStabilityResult?.stableTerms.slice(0, 8) ?? []),
      ],
      memoryFragilitySignals: input.semanticStabilityResult?.unstableTerms ?? ["Semantic stability result was not supplied."],
      recommendedHumanReview: "Review semantic drift before relying on institutional semantic memory.",
      factors: [`Semantic drift risks: ${input.semanticStabilityResult?.driftRisks.length ?? "not_supplied"}.`],
      reasoning: ["Institutional memory is harder to reconstruct when governance terminology or classification meaning drifts."],
    }),
    createAreaAssessment({
      area: "doctrine_history",
      baseScore: Math.min(
        90,
        scoreFromStatus(input.doctrineResult?.doctrineStatus) * 0.5 +
          scoreFromStatus(input.doctrineDurabilityResult?.doctrineDurabilityClassification) * 0.5,
      ),
      description: "Evaluates whether doctrine history and principle memory remain reconstructable.",
      reconstructableSignals: [
        `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
        `Doctrine durability: ${input.doctrineDurabilityResult?.doctrineDurabilityClassification ?? "not_supplied"}.`,
        ...(input.doctrineDurabilityResult?.durableDoctrineAreas ?? []),
      ],
      memoryFragilitySignals: [
        ...(input.doctrineResult?.doctrineLimitations ?? []),
        ...(input.doctrineDurabilityResult?.fragileDoctrineAreas ?? []),
      ],
      recommendedHumanReview: "Review doctrine history and doctrine durability before relying on doctrine memory.",
      factors: [`Doctrine principles: ${input.doctrineResult?.principles.length ?? "not_supplied"}.`],
      reasoning: ["Doctrine memory is reconstructable when principle evidence, limitations, drift, and durability findings stay visible."],
    }),
    createAreaAssessment({
      area: "observability_history",
      baseScore: scoreFromStatus(input.observabilityDurabilityResult?.observabilityDurabilityClassification),
      description: "Evaluates whether observability history remains visible enough for institutional memory.",
      reconstructableSignals: [
        `Observability durability: ${input.observabilityDurabilityResult?.observabilityDurabilityClassification ?? "not_supplied"}.`,
        `Observability scalability: ${input.observabilityDurabilityResult?.observabilityScalabilityClassification ?? "not_supplied"}.`,
        ...(input.observabilityDurabilityResult?.durableObservabilityAreas ?? []),
      ],
      memoryFragilitySignals: input.observabilityDurabilityResult?.fragileObservabilityAreas ?? ["Observability result was not supplied."],
      recommendedHumanReview: "Review observability gaps before relying on institutional memory visibility.",
      factors: [`Observability findings: ${input.observabilityDurabilityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Observability memory is durable when visibility, blind spots, and reviewability signals remain inspectable."],
    }),
    createAreaAssessment({
      area: "reviewability_history",
      baseScore: scoreFromStatus(input.reviewabilityIntegrityResult?.reviewabilityClassification),
      description: "Evaluates whether reviewability history remains human-auditable and reconstructable.",
      reconstructableSignals: [
        `Reviewability: ${input.reviewabilityIntegrityResult?.reviewabilityClassification ?? "not_supplied"}.`,
        `Reviewability score: ${input.reviewabilityIntegrityResult?.reviewabilityIntegrityScore ?? "not_supplied"}.`,
        ...(input.reviewabilityIntegrityResult?.reviewableAreas ?? []),
      ],
      memoryFragilitySignals: input.reviewabilityIntegrityResult?.weakReviewabilityAreas ?? ["Reviewability result was not supplied."],
      recommendedHumanReview: "Review reviewability history before relying on institutional memory continuity.",
      factors: [`Reviewability findings: ${input.reviewabilityIntegrityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Memory continuity depends on future reviewers being able to inspect evidence, reasoning, limits, and recommendations."],
    }),
    createAreaAssessment({
      area: "lifecycle_continuity",
      baseScore: scoreFromStatus(input.lifecycleContinuityResult?.lifecycleContinuityClassification),
      description: "Evaluates whether lifecycle continuity supports institutional memory reconstruction.",
      reconstructableSignals: [
        `Lifecycle continuity: ${input.lifecycleContinuityResult?.lifecycleContinuityClassification ?? "not_supplied"}.`,
        `Lifecycle continuity score: ${input.lifecycleContinuityResult?.lifecycleContinuityScore ?? "not_supplied"}.`,
        ...(input.lifecycleContinuityResult?.durableContinuityAreas ?? []),
      ],
      memoryFragilitySignals: input.lifecycleContinuityResult?.fragileContinuityAreas ?? ["Lifecycle continuity result was not supplied."],
      recommendedHumanReview: "Review lifecycle continuity before relying on institutional memory continuity.",
      factors: [`Lifecycle findings: ${input.lifecycleContinuityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Lifecycle memory is stronger when governance evolution remains continuous and reconstructable."],
    }),
    createAreaAssessment({
      area: "versioning_readiness",
      baseScore: scoreFromStatus(input.versioningReadinessResult?.versioningReadinessClassification),
      description: "Evaluates whether versioning readiness supports long-horizon memory reconstruction.",
      reconstructableSignals: [
        `Versioning readiness: ${input.versioningReadinessResult?.versioningReadinessClassification ?? "not_supplied"}.`,
        `Versioning score: ${input.versioningReadinessResult?.versioningReadinessScore ?? "not_supplied"}.`,
        ...(input.versioningReadinessResult?.stableVersionReadyAreas ?? []),
      ],
      memoryFragilitySignals: input.versioningReadinessResult?.unstableVersionFragileAreas ?? ["Versioning readiness result was not supplied."],
      recommendedHumanReview: "Review versioning readiness before future memory versioning or storage design.",
      factors: [`Versioning findings: ${input.versioningReadinessResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Memory continuity is easier to preserve when versioning context remains explicit and review-only."],
    }),
    createAreaAssessment({
      area: "compatibility_expectations",
      baseScore: Math.min(
        90,
        input.compatibilityMigrationContext?.compatibilityScore ??
          (compatibilitySignals.length > 0 || metadataString(input, "compatibilityVersion") ? 68 : 40),
      ),
      description: "Evaluates whether compatibility expectations are visible enough for institutional memory continuity.",
      reconstructableSignals: compatibilitySignals,
      memoryFragilitySignals:
        compatibilitySignals.length > 0 ? [] : ["Compatibility expectations were not supplied for memory continuity review."],
      recommendedHumanReview: "Review compatibility expectations before future memory evolution guarantees.",
      factors: [`Compatibility signals: ${compatibilitySignals.length}.`],
      reasoning: ["Compatibility memory should remain explicit before future persistence or migration assumptions are introduced."],
    }),
    createAreaAssessment({
      area: "migration_survivability",
      baseScore: Math.min(
        90,
        input.compatibilityMigrationContext?.migrationSurvivabilityScore ??
          (migrationSignals.length > 0 || metadataString(input, "migrationReviewVersion") ? 68 : 40),
      ),
      description: "Evaluates whether migration survivability context can be remembered without migration execution.",
      reconstructableSignals: migrationSignals,
      memoryFragilitySignals: migrationSignals.length > 0 ? [] : ["Migration survivability context was not supplied."],
      recommendedHumanReview: "Review migration survivability before future memory migration or lifecycle tooling.",
      factors: [`Migration signals: ${migrationSignals.length}.`],
      reasoning: ["Migration memory is review-only here and does not create migration execution or persistence pathways."],
    }),
    createAreaAssessment({
      area: "institutional_lineage",
      baseScore: input.lineageResult?.lineageIntegrityScore ?? 38,
      description: "Evaluates whether lineage can reconstruct how governance memory evolved.",
      reconstructableSignals: [
        `Lineage integrity score: ${input.lineageResult?.lineageIntegrityScore ?? "not_supplied"}.`,
        `Lineage nodes: ${input.lineageResult?.nodes.length ?? "not_supplied"}.`,
        `Lineage edges: ${input.lineageResult?.edges.length ?? "not_supplied"}.`,
        ...(input.lineageResult?.stabilizationChains ?? []),
      ],
      memoryFragilitySignals: input.lineageResult?.weakLineageAreas ?? ["Lineage result was not supplied."],
      recommendedHumanReview: "Review lineage gaps before relying on institutional memory reconstruction.",
      factors: [`Governance dependency chains: ${input.lineageResult?.governanceDependencyChains.length ?? "not_supplied"}.`],
      reasoning: ["Institutional memory is reconstructable when lineage nodes, edges, dependencies, contradictions, and stabilization chains remain visible."],
    }),
    createAreaAssessment({
      area: "human_review_notes",
      baseScore: input.readinessResult?.humanReviewRequired || input.auditResult?.humanReviewRequired ? 72 : 50,
      description: "Evaluates whether human-review notes are durable enough to preserve memory reviewability.",
      reconstructableSignals: [
        `Readiness human review required: ${input.readinessResult?.humanReviewRequired ?? "not_supplied"}.`,
        `Audit human review required: ${input.auditResult?.humanReviewRequired ?? "not_supplied"}.`,
        ...(input.lifecycleContinuityResult?.humanReviewNotes.slice(0, 6) ?? []),
        ...(input.memoryResult?.recommendations ?? []),
      ],
      memoryFragilitySignals: input.traceabilityResult?.recommendationLinkageGaps ?? [],
      recommendedHumanReview: "Review human-review notes before relying on institutional memory continuity.",
      factors: [`Memory recommendations: ${input.memoryResult?.recommendations.length ?? "not_supplied"}.`],
      reasoning: ["Memory continuity stays safer when future reviewers can inspect human-review requirements and neutral recommendations."],
    }),
  ];
};

const createFinding = (params: {
  findingType: GovernanceInstitutionalMemoryContinuityFindingType;
  area: GovernanceInstitutionalMemoryContinuityArea;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedAuditCategories?: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): GovernanceInstitutionalMemoryContinuityFinding => {
  const evidence = unique(params.evidence);
  const factors = unique(params.factors);

  return {
    id: `governance-institutional-memory-continuity-${slug(params.findingType)}-${slug(params.area)}-${slug(params.description)}`,
    findingType: params.findingType,
    area: params.area,
    severity: params.severity,
    description: params.description,
    evidence,
    affectedAuditCategories: unique(params.affectedAuditCategories ?? []) as FullSystemGovernanceAuditCategory[],
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateInstitutionalMemoryContinuityFindingConfidence({
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

const buildFindings = (
  input: GovernanceInstitutionalMemoryContinuityInput,
): GovernanceInstitutionalMemoryContinuityFinding[] => {
  const findings: GovernanceInstitutionalMemoryContinuityFinding[] = [];
  const auditFindings = getAuditFindings(input);
  const auditCategories = unique([
    ...auditFindings.map((finding) => finding.category),
    ...Object.keys(input.auditResult?.categoryScores ?? {}),
    ...(input.traceabilityResult?.traces.map((trace) => trace.auditCategory) ?? []),
  ]) as FullSystemGovernanceAuditCategory[];
  const suppliedMemoryLayers = countSupplied([
    input.lifecycleContinuityResult,
    input.versioningReadinessResult,
    input.reviewabilityIntegrityResult,
    input.observabilityDurabilityResult,
    input.semanticStabilityResult,
    input.traceabilityResult,
    input.auditResult,
    input.doctrineResult,
    input.memoryResult,
    input.lineageResult,
    input.continuityResult,
    input.evidenceQualityResult,
  ]);

  if (!input.memoryResult || input.memoryResult.institutionalMemoryStatus === "thin" || input.memoryResult.snapshotsReviewed.length < 2) {
    findings.push(
      createFinding({
        findingType: "institutional_memory_gap",
        area: "governance_findings",
        severity: !input.memoryResult || input.memoryResult.institutionalMemoryStatus === "thin" ? "elevated" : "moderate",
        description: "Institutional memory context is missing, thin, or has limited snapshots.",
        evidence: [
          `Memory status: ${input.memoryResult?.institutionalMemoryStatus ?? "not_supplied"}.`,
          `Snapshots reviewed: ${input.memoryResult?.snapshotsReviewed.length ?? "not_supplied"}.`,
        ],
        recommendedHumanReview: "Review institutional memory depth before relying on governance memory reconstruction.",
        factors: [`Recurring patterns: ${input.memoryResult?.recurringPatterns.length ?? "not_supplied"}.`],
        reasoning: ["Memory gaps make long-horizon governance history harder to reconstruct without persistence or mutation."],
      }),
    );
  }

  if (suppliedMemoryLayers < 8) {
    findings.push(
      createFinding({
        findingType: "governance_memory_fragmentation",
        area: "governance_findings",
        severity: suppliedMemoryLayers < 5 ? "elevated" : "moderate",
        description: "Layered governance memory context is incomplete.",
        evidence: [`Memory review layers supplied: ${suppliedMemoryLayers}.`],
        recommendedHumanReview: "Supply lifecycle, versioning, reviewability, observability, semantic, traceability, audit, doctrine, memory, lineage, continuity, and evidence context before relying on memory continuity.",
        factors: ["Memory reconstruction depends on layered governance context."],
        reasoning: ["Governance memory fragments when future reviewers cannot inspect upstream context together."],
      }),
    );
  }

  if (!input.auditResult || input.auditResult.auditClassification === "critical_risk" || input.auditResult.futureTechnicalDebtItems.length > 0) {
    findings.push(
      createFinding({
        findingType: "audit_memory_discontinuity",
        area: "audit_history",
        severity: !input.auditResult || input.auditResult.auditClassification === "critical_risk" ? "elevated" : "moderate",
        description: "Audit memory has missing context, critical classification, or future technical debt.",
        evidence: [
          `Audit classification: ${input.auditResult?.auditClassification ?? "not_supplied"}.`,
          ...(input.auditResult?.futureTechnicalDebtItems.slice(0, 8) ?? []),
        ],
        affectedAuditCategories: auditCategories,
        recommendedHumanReview: "Review audit history before relying on institutional audit memory.",
        factors: [`Audit technical debt items: ${input.auditResult?.futureTechnicalDebtItems.length ?? "not_supplied"}.`],
        reasoning: ["Audit memory continuity weakens when audit structures are missing, critical, or difficult to reconstruct."],
      }),
    );
  }

  if (!input.semanticStabilityResult || ["unstable", "mostly_stable"].includes(input.semanticStabilityResult.semanticStabilityClassification)) {
    findings.push(
      createFinding({
        findingType: "semantic_memory_drift",
        area: "semantic_history",
        severity: !input.semanticStabilityResult || input.semanticStabilityResult.semanticStabilityClassification === "unstable" ? "elevated" : "moderate",
        description: "Semantic memory has drift risk or missing semantic stability context.",
        evidence: [
          `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
          ...(input.semanticStabilityResult?.driftRisks.slice(0, 8) ?? []),
        ],
        recommendedHumanReview: "Review semantic history before relying on institutional memory reconstruction.",
        factors: [`Semantic findings: ${input.semanticStabilityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Institutional memory is harder to reconstruct when governance language changes without stable review context."],
      }),
    );
  }

  if (
    !input.lineageResult ||
    input.lineageResult.weakLineageAreas.length > 0 ||
    input.lineageResult.lineageIntegrityScore < 60
  ) {
    findings.push(
      createFinding({
        findingType: "lineage_reconstruction_weakness",
        area: "institutional_lineage",
        severity: !input.lineageResult || input.lineageResult.lineageIntegrityScore < 45 ? "elevated" : "moderate",
        description: "Lineage reconstruction is missing, weak, or has weak lineage areas.",
        evidence: [
          `Lineage integrity score: ${input.lineageResult?.lineageIntegrityScore ?? "not_supplied"}.`,
          ...(input.lineageResult?.weakLineageAreas ?? []),
        ],
        recommendedHumanReview: "Review lineage continuity before relying on institutional governance memory.",
        factors: [`Lineage nodes: ${input.lineageResult?.nodes.length ?? "not_supplied"}.`],
        reasoning: ["Memory reconstruction depends on lineage visibility across governance findings, evidence, dependencies, and stabilization history."],
      }),
    );
  }

  if (
    !input.traceabilityResult ||
    input.traceabilityResult.gaps.length > 0 ||
    ["weak", "moderate"].includes(input.traceabilityResult.traceabilityClassification)
  ) {
    findings.push(
      createFinding({
        findingType: "traceability_memory_gap",
        area: "traceability_chains",
        severity: !input.traceabilityResult || input.traceabilityResult.traceabilityClassification === "weak" ? "elevated" : "moderate",
        description: "Traceability memory has missing context, gaps, or limited trace strength.",
        evidence: [
          `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
          ...(input.traceabilityResult?.gaps.map((gap) => gap.description).slice(0, 8) ?? []),
        ],
        affectedAuditCategories: auditCategories,
        recommendedHumanReview: "Review traceability memory before relying on governance history reconstruction.",
        factors: [`Traceability gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
        reasoning: ["Traceability memory needs stable links across evidence, source modules, scoring drivers, limitations, and recommendations."],
      }),
    );
  }

  if (
    !input.observabilityDurabilityResult ||
    ["fragile", "conditionally_observable"].includes(input.observabilityDurabilityResult.observabilityDurabilityClassification)
  ) {
    findings.push(
      createFinding({
        findingType: "observability_memory_gap",
        area: "observability_history",
        severity:
          !input.observabilityDurabilityResult ||
          input.observabilityDurabilityResult.observabilityDurabilityClassification === "fragile"
            ? "elevated"
            : "moderate",
        description: "Observability memory is missing or not yet strongly observable.",
        evidence: [
          `Observability durability: ${input.observabilityDurabilityResult?.observabilityDurabilityClassification ?? "not_supplied"}.`,
          ...(input.observabilityDurabilityResult?.fragileObservabilityAreas ?? []),
        ],
        recommendedHumanReview: "Review observability memory before future dashboard, audit, or governance expansion.",
        factors: [`Observability findings: ${input.observabilityDurabilityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Institutional memory weakens when past governance visibility or blind spots cannot be reviewed."],
      }),
    );
  }

  if (
    !input.reviewabilityIntegrityResult ||
    ["weak", "partially_reviewable"].includes(input.reviewabilityIntegrityResult.reviewabilityClassification)
  ) {
    findings.push(
      createFinding({
        findingType: "reviewability_memory_weakness",
        area: "reviewability_history",
        severity: !input.reviewabilityIntegrityResult || input.reviewabilityIntegrityResult.reviewabilityClassification === "weak" ? "elevated" : "moderate",
        description: "Reviewability memory is missing or not yet strongly reconstructable.",
        evidence: [
          `Reviewability: ${input.reviewabilityIntegrityResult?.reviewabilityClassification ?? "not_supplied"}.`,
          ...(input.reviewabilityIntegrityResult?.reconstructionRisks ?? []),
        ],
        recommendedHumanReview: "Review reviewability history before relying on institutional memory continuity.",
        factors: [`Reviewability findings: ${input.reviewabilityIntegrityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Memory continuity depends on future reviewers being able to reconstruct evidence, reasoning, limitations, and recommendations."],
      }),
    );
  }

  if (
    !input.lifecycleContinuityResult ||
    ["discontinuous", "partially_continuous"].includes(input.lifecycleContinuityResult.lifecycleContinuityClassification)
  ) {
    findings.push(
      createFinding({
        findingType: "lifecycle_memory_gap",
        area: "lifecycle_continuity",
        severity:
          !input.lifecycleContinuityResult || input.lifecycleContinuityResult.lifecycleContinuityClassification === "discontinuous"
            ? "elevated"
            : "moderate",
        description: "Lifecycle memory is missing or not yet strongly continuous.",
        evidence: [
          `Lifecycle continuity: ${input.lifecycleContinuityResult?.lifecycleContinuityClassification ?? "not_supplied"}.`,
          ...(input.lifecycleContinuityResult?.fragileContinuityAreas ?? []),
        ],
        recommendedHumanReview: "Review lifecycle continuity before future institutional memory expansion.",
        factors: [`Lifecycle findings: ${input.lifecycleContinuityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Institutional memory continuity depends on lifecycle continuity across governance evolution."],
      }),
    );
  }

  if (
    !input.survivabilityExpansionResult ||
    ["fragile", "conditionally_scalable"].includes(input.survivabilityExpansionResult.survivabilityClassification) ||
    !metadataString(input, "memoryVersion")
  ) {
    findings.push(
      createFinding({
        findingType: "future_memory_survivability_risk",
        area: "governance_findings",
        severity: !input.survivabilityExpansionResult || !metadataString(input, "memoryVersion") ? "moderate" : "low",
        description: "Future memory survivability needs stronger survivability context or explicit memoryVersion metadata.",
        evidence: [
          `Survivability: ${input.survivabilityExpansionResult?.survivabilityClassification ?? "not_supplied"}.`,
          `memoryVersion: ${metadataString(input, "memoryVersion") ?? "not_supplied"}.`,
        ],
        recommendedHumanReview: "Review memory survivability and memoryVersion metadata before future memory storage design.",
        factors: ["Future memory survivability is evaluated without creating memory persistence."],
        reasoning: ["Future memory systems should not be introduced until survivability and version context are human-reviewed."],
      }),
    );
  }

  if (!input.memoryResult || !input.lineageResult || !input.traceabilityResult || !input.reviewabilityIntegrityResult) {
    findings.push(
      createFinding({
        findingType: "governance_history_reconstruction_risk",
        area: "institutional_lineage",
        severity: !input.memoryResult || !input.lineageResult ? "elevated" : "moderate",
        description: "Governance history reconstruction context is incomplete.",
        evidence: [
          `Memory supplied: ${Boolean(input.memoryResult)}.`,
          `Lineage supplied: ${Boolean(input.lineageResult)}.`,
          `Traceability supplied: ${Boolean(input.traceabilityResult)}.`,
          `Reviewability supplied: ${Boolean(input.reviewabilityIntegrityResult)}.`,
        ],
        recommendedHumanReview: "Review memory, lineage, traceability, and reviewability together before relying on governance history reconstruction.",
        factors: ["History reconstruction depends on memory, lineage, traceability, and reviewability context."],
        reasoning: ["Institutional memory becomes less defensible when reviewers cannot reconstruct how governance meaning and evidence evolved."],
      }),
    );
  }

  return findings;
};

export function analyzeGovernanceInstitutionalMemoryContinuity(
  input: GovernanceInstitutionalMemoryContinuityInput,
): GovernanceInstitutionalMemoryContinuityResult {
  const areaAssessments = buildAreaAssessments(input);
  const findings = buildFindings(input);
  const institutionalMemoryContinuityScore = calculateOverallInstitutionalMemoryContinuityScore({
    areaAssessments,
    findings,
  });
  const resultWithoutExplainability = {
    institutionalMemoryContinuityScore,
    memoryContinuityClassification: institutionalMemoryContinuityClassificationFromScore(institutionalMemoryContinuityScore),
    areaAssessments,
    findings,
    durableMemoryAreas: unique(
      areaAssessments
        .filter(
          (assessment) =>
            assessment.classification === "reconstructable" ||
            assessment.classification === "institutionally_reconstructable",
        )
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    fragileMemoryAreas: unique(
      areaAssessments
        .filter(
          (assessment) =>
            assessment.classification === "fragmented" || assessment.classification === "partially_reconstructable",
        )
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    auditMemoryFindings: unique(
      findings.filter((finding) => finding.findingType === "audit_memory_discontinuity").map((finding) => finding.description),
    ),
    semanticMemoryFindings: unique(
      findings.filter((finding) => finding.findingType === "semantic_memory_drift").map((finding) => finding.description),
    ),
    traceabilityMemoryFindings: unique(
      findings.filter((finding) => finding.findingType === "traceability_memory_gap").map((finding) => finding.description),
    ),
    observabilityMemoryFindings: unique(
      findings.filter((finding) => finding.findingType === "observability_memory_gap").map((finding) => finding.description),
    ),
    reviewabilityMemoryFindings: unique(
      findings.filter((finding) => finding.findingType === "reviewability_memory_weakness").map((finding) => finding.description),
    ),
    lineageReconstructionFindings: unique(
      findings.filter((finding) => finding.findingType === "lineage_reconstruction_weakness").map((finding) => finding.description),
    ),
    governanceHistoryReconstructionFindings: unique(
      findings
        .filter(
          (finding) =>
            finding.findingType === "governance_history_reconstruction_risk" ||
            finding.findingType === "institutional_memory_gap" ||
            finding.findingType === "governance_memory_fragmentation",
        )
        .map((finding) => finding.description),
    ),
    humanReviewNotes: unique([
      ...findings.map((finding) => finding.recommendedHumanReview),
      ...(input.lifecycleContinuityResult?.humanReviewNotes ?? []),
      ...(input.compatibilityMigrationContext?.humanReviewNotes ?? []),
      "Do not implement persistence, create memory storage, mutate memory, rewrite governance history, centralize memory control, create lifecycle automation, rewrite semantics, redesign architecture, enforce policy, or trigger orchestration during this review-only stage.",
      "Keep future institutional memory, audit history, lifecycle, versioning, compatibility, migration, registry, and observability integrations separate from pure governance review engines.",
    ]),
    futureStabilizationRecommendations: [
      "Prepare Governance Audit History Survivability Review before any persistence, memory storage, governance history tooling, or lifecycle automation.",
      "Review institutional memory continuity with lifecycle, versioning, reviewability, observability, semantic stability, traceability, audit, doctrine, memory, lineage, continuity, and evidence context supplied together.",
      "Review memoryVersion and compatibility/migration metadata before future memory versioning or migration work.",
      "Preserve read-only institutional memory boundaries and human-review requirements before future storage design.",
      "Consider shared deterministic memory-review helper utilities only after audit history survivability confirms stable contracts.",
      ...(input.lifecycleContinuityResult?.futureStabilizationRecommendations ?? []),
      ...(input.compatibilityMigrationContext?.futureStabilizationRecommendations ?? []),
    ],
    humanReviewRequired:
      findings.length > 0 ||
      areaAssessments.some(
        (assessment) =>
          assessment.classification === "fragmented" || assessment.classification === "partially_reconstructable",
      ),
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernanceInstitutionalMemoryContinuityExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}

export const getGovernanceInstitutionalMemoryContinuityReview = analyzeGovernanceInstitutionalMemoryContinuity;
