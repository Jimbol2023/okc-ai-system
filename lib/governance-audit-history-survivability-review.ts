import { buildGovernanceAuditHistorySurvivabilityExplainability } from "./governance-audit-history-survivability-review-explainability";
import {
  auditHistorySurvivabilityClassificationFromScore,
  calculateAuditHistorySurvivabilityAreaScore,
  calculateAuditHistorySurvivabilityFindingConfidence,
  calculateOverallAuditHistorySurvivabilityScore,
} from "./governance-audit-history-survivability-review-scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
} from "./full-system-governance-audit-types";
import type {
  GovernanceAuditHistorySurvivabilityArea,
  GovernanceAuditHistorySurvivabilityAreaAssessment,
  GovernanceAuditHistorySurvivabilityFinding,
  GovernanceAuditHistorySurvivabilityFindingType,
  GovernanceAuditHistorySurvivabilityInput,
  GovernanceAuditHistorySurvivabilityResult,
} from "./governance-audit-history-survivability-review-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const getAuditFindings = (input: GovernanceAuditHistorySurvivabilityInput): FullSystemGovernanceAuditFinding[] =>
  input.auditFindings ?? input.auditResult?.findings ?? [];

const getRecommendations = (
  input: GovernanceAuditHistorySurvivabilityInput,
): FullSystemGovernanceAuditRecommendation[] => input.recommendations ?? input.auditResult?.recommendations ?? [];

const metadataString = (input: GovernanceAuditHistorySurvivabilityInput, key: string): string | undefined =>
  typeof input.metadata?.[key] === "string" ? input.metadata[key] : undefined;

const countSupplied = (items: unknown[]): number => items.filter(Boolean).length;

const scoreFromStatus = (status: string | undefined): number => {
  if (!status) return 38;
  if (
    [
      "institutionally_survivable",
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
      "survivable",
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
      "partially_survivable",
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
  area: GovernanceAuditHistorySurvivabilityArea;
  baseScore: number;
  description: string;
  survivabilitySignals: string[];
  fragilitySignals: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  findingCount?: number;
}): GovernanceAuditHistorySurvivabilityAreaAssessment => {
  const survivabilitySignals = unique(params.survivabilitySignals);
  const fragilitySignals = unique(params.fragilitySignals);
  const factors = unique(params.factors);
  const score = calculateAuditHistorySurvivabilityAreaScore({
    baseScore: params.baseScore,
    survivabilitySignalCount: survivabilitySignals.length,
    fragilitySignalCount: fragilitySignals.length,
    findingCount: params.findingCount ?? 0,
    explainabilityCount: factors.length + params.reasoning.length,
  });

  return {
    area: params.area,
    score,
    classification: auditHistorySurvivabilityClassificationFromScore(score),
    description: params.description,
    survivabilitySignals,
    fragilitySignals,
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors,
      reasoning: params.reasoning,
    },
  };
};

const buildAreaAssessments = (
  input: GovernanceAuditHistorySurvivabilityInput,
): GovernanceAuditHistorySurvivabilityAreaAssessment[] => {
  const auditFindings = getAuditFindings(input);
  const recommendations = getRecommendations(input);
  const auditCategories = unique([
    ...auditFindings.map((finding) => finding.category),
    ...recommendations.map((recommendation) => recommendation.category),
    ...Object.keys(input.auditResult?.categoryScores ?? {}),
    ...(input.traceabilityResult?.traces.map((trace) => trace.auditCategory) ?? []),
    ...(input.normalizationResult?.mappings.flatMap((mapping) => mapping.auditCategories) ?? []),
  ]);
  const suppliedAuditHistoryLayers = countSupplied([
    input.institutionalMemoryContinuityResult,
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
      area: "governance_findings_history",
      baseScore: Math.min(88, suppliedAuditHistoryLayers * 5),
      description: "Evaluates whether governance findings history is available together for audit-history reconstruction.",
      survivabilitySignals: [
        `Audit-history review layers supplied: ${suppliedAuditHistoryLayers}.`,
        `Audit categories represented: ${auditCategories.length}.`,
        `Governance memory classification: ${input.institutionalMemoryContinuityResult?.memoryContinuityClassification ?? "not_supplied"}.`,
      ],
      fragilitySignals: suppliedAuditHistoryLayers < 12 ? ["Layered audit-history context is incomplete."] : [],
      recommendedHumanReview: "Review governance findings history across layers before relying on audit-history survivability.",
      factors: [`Audit-history layers supplied: ${suppliedAuditHistoryLayers}.`],
      reasoning: ["Audit-history survivability is stronger when governance outputs can be reviewed together without history mutation or storage writes."],
    }),
    createAreaAssessment({
      area: "audit_classifications",
      baseScore: scoreFromStatus(input.auditResult?.auditClassification),
      description: "Evaluates whether audit classifications and category scores can survive future governance evolution.",
      survivabilitySignals: [
        `Audit classification: ${input.auditResult?.auditClassification ?? "not_supplied"}.`,
        `Audit score: ${input.auditResult?.overallAuditScore ?? "not_supplied"}.`,
        `Audit findings: ${auditFindings.length}.`,
        `Audit recommendations: ${recommendations.length}.`,
      ],
      fragilitySignals: input.auditResult?.futureTechnicalDebtItems ?? ["Audit result was not supplied."],
      recommendedHumanReview: "Review audit classifications and future technical debt before relying on audit-history survivability.",
      factors: [`Audit category count: ${auditCategories.length}.`],
      reasoning: ["Audit classifications survive better when category scores, findings, risks, limitations, and recommendations remain visible."],
    }),
    createAreaAssessment({
      area: "evidence_history",
      baseScore: scoreFromStatus(input.evidenceQualityResult?.overallReliabilityLevel),
      description: "Evaluates whether evidence history remains durable enough for audit reconstruction.",
      survivabilitySignals: [
        `Evidence reliability: ${input.evidenceQualityResult?.overallReliabilityLevel ?? "not_supplied"}.`,
        `Evidence quality score: ${input.evidenceQualityResult?.evidenceQualityScore ?? "not_supplied"}.`,
        ...(input.evidenceQualityResult?.stabilizationSupportedAreas ?? []),
      ],
      fragilitySignals: input.evidenceQualityResult?.missingEvidenceAreas ?? ["Evidence quality result was not supplied."],
      recommendedHumanReview: "Review evidence-history gaps before relying on long-horizon audit reconstruction.",
      factors: [`Evidence quality findings: ${input.evidenceQualityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Evidence history survives better when evidence reliability, missing areas, and limitations remain visible."],
    }),
    createAreaAssessment({
      area: "traceability_history",
      baseScore: scoreFromStatus(input.traceabilityResult?.traceabilityClassification),
      description: "Evaluates whether traceability history preserves links across evidence, scoring, reasoning, limitations, and recommendations.",
      survivabilitySignals: [
        `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
        `Trace links: ${input.traceabilityResult?.traces.length ?? "not_supplied"}.`,
        ...(input.traceabilityResult?.traceStrengths ?? []),
      ],
      fragilitySignals: input.traceabilityResult?.traceWeaknesses ?? ["Traceability result was not supplied."],
      recommendedHumanReview: "Review traceability-history gaps before relying on institutional auditability.",
      factors: [`Traceability gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
      reasoning: ["Traceability history survives when source, evidence, scoring driver, limitation, and recommendation links remain inspectable."],
      findingCount: input.traceabilityResult?.gaps.length ?? 1,
    }),
    createAreaAssessment({
      area: "semantic_history",
      baseScore: scoreFromStatus(input.semanticStabilityResult?.semanticStabilityClassification),
      description: "Evaluates whether semantic history remains stable enough for future audit reconstruction.",
      survivabilitySignals: [
        `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
        ...(input.semanticStabilityResult?.stableTerms.slice(0, 8) ?? []),
      ],
      fragilitySignals: input.semanticStabilityResult?.unstableTerms ?? ["Semantic stability result was not supplied."],
      recommendedHumanReview: "Review semantic-history drift before future audit-history or registry work.",
      factors: [`Semantic drift risks: ${input.semanticStabilityResult?.driftRisks.length ?? "not_supplied"}.`],
      reasoning: ["Audit history becomes harder to reconstruct when governance terms or classifications drift without review context."],
    }),
    createAreaAssessment({
      area: "observability_history",
      baseScore: scoreFromStatus(input.observabilityDurabilityResult?.observabilityDurabilityClassification),
      description: "Evaluates whether observability history remains durable enough for institutional auditability.",
      survivabilitySignals: [
        `Observability durability: ${input.observabilityDurabilityResult?.observabilityDurabilityClassification ?? "not_supplied"}.`,
        `Observability scalability: ${input.observabilityDurabilityResult?.observabilityScalabilityClassification ?? "not_supplied"}.`,
        ...(input.observabilityDurabilityResult?.durableObservabilityAreas ?? []),
      ],
      fragilitySignals: input.observabilityDurabilityResult?.fragileObservabilityAreas ?? ["Observability result was not supplied."],
      recommendedHumanReview: "Review observability-history gaps before relying on audit-history visibility.",
      factors: [`Observability findings: ${input.observabilityDurabilityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Observability history survives better when visibility, blind spots, and reviewability signals remain inspectable."],
    }),
    createAreaAssessment({
      area: "lineage_reconstruction",
      baseScore: input.lineageResult?.lineageIntegrityScore ?? 38,
      description: "Evaluates whether lineage history can reconstruct audit-history evolution.",
      survivabilitySignals: [
        `Lineage integrity score: ${input.lineageResult?.lineageIntegrityScore ?? "not_supplied"}.`,
        `Lineage nodes: ${input.lineageResult?.nodes.length ?? "not_supplied"}.`,
        `Lineage edges: ${input.lineageResult?.edges.length ?? "not_supplied"}.`,
        ...(input.lineageResult?.governanceDependencyChains ?? []),
      ],
      fragilitySignals: input.lineageResult?.weakLineageAreas ?? ["Lineage result was not supplied."],
      recommendedHumanReview: "Review lineage-history weakness before relying on audit-history reconstruction.",
      factors: [`Stabilization chains: ${input.lineageResult?.stabilizationChains.length ?? "not_supplied"}.`],
      reasoning: ["Audit history is more survivable when lineage nodes, edges, dependencies, contradictions, and stabilization chains are visible."],
    }),
    createAreaAssessment({
      area: "reviewability_reconstruction",
      baseScore: scoreFromStatus(input.reviewabilityIntegrityResult?.reviewabilityClassification),
      description: "Evaluates whether reviewability history supports institutional audit reconstruction.",
      survivabilitySignals: [
        `Reviewability: ${input.reviewabilityIntegrityResult?.reviewabilityClassification ?? "not_supplied"}.`,
        `Reviewability score: ${input.reviewabilityIntegrityResult?.reviewabilityIntegrityScore ?? "not_supplied"}.`,
        ...(input.reviewabilityIntegrityResult?.reviewableAreas ?? []),
      ],
      fragilitySignals: input.reviewabilityIntegrityResult?.weakReviewabilityAreas ?? ["Reviewability result was not supplied."],
      recommendedHumanReview: "Review reviewability-history degradation before relying on institutional auditability.",
      factors: [`Reviewability findings: ${input.reviewabilityIntegrityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Audit-history survivability depends on future reviewers being able to reconstruct evidence, reasoning, limitations, and recommendations."],
    }),
    createAreaAssessment({
      area: "doctrine_continuity",
      baseScore: Math.min(
        90,
        scoreFromStatus(input.doctrineResult?.doctrineStatus) * 0.5 +
          scoreFromStatus(input.doctrineDurabilityResult?.doctrineDurabilityClassification) * 0.5,
      ),
      description: "Evaluates whether doctrine history remains continuous enough for audit-history survivability.",
      survivabilitySignals: [
        `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
        `Doctrine durability: ${input.doctrineDurabilityResult?.doctrineDurabilityClassification ?? "not_supplied"}.`,
        ...(input.doctrineDurabilityResult?.durableDoctrineAreas ?? []),
      ],
      fragilitySignals: [
        ...(input.doctrineResult?.doctrineLimitations ?? []),
        ...(input.doctrineDurabilityResult?.fragileDoctrineAreas ?? []),
      ],
      recommendedHumanReview: "Review doctrine-history continuity before relying on audit-history survivability.",
      factors: [`Doctrine principles: ${input.doctrineResult?.principles.length ?? "not_supplied"}.`],
      reasoning: ["Doctrine history survives better when principle evidence, drift, limits, and durability findings stay visible."],
    }),
    createAreaAssessment({
      area: "lifecycle_continuity",
      baseScore: scoreFromStatus(input.lifecycleContinuityResult?.lifecycleContinuityClassification),
      description: "Evaluates whether lifecycle continuity supports long-horizon audit-history survivability.",
      survivabilitySignals: [
        `Lifecycle continuity: ${input.lifecycleContinuityResult?.lifecycleContinuityClassification ?? "not_supplied"}.`,
        `Lifecycle continuity score: ${input.lifecycleContinuityResult?.lifecycleContinuityScore ?? "not_supplied"}.`,
        ...(input.lifecycleContinuityResult?.durableContinuityAreas ?? []),
      ],
      fragilitySignals: input.lifecycleContinuityResult?.fragileContinuityAreas ?? ["Lifecycle continuity result was not supplied."],
      recommendedHumanReview: "Review lifecycle continuity before relying on audit-history survivability.",
      factors: [`Lifecycle findings: ${input.lifecycleContinuityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Audit-history survivability is stronger when lifecycle continuity remains reconstructable across governance evolution."],
    }),
    createAreaAssessment({
      area: "versioning_continuity",
      baseScore: scoreFromStatus(input.versioningReadinessResult?.versioningReadinessClassification),
      description: "Evaluates whether versioning continuity supports durable audit-history reconstruction.",
      survivabilitySignals: [
        `Versioning readiness: ${input.versioningReadinessResult?.versioningReadinessClassification ?? "not_supplied"}.`,
        `Versioning score: ${input.versioningReadinessResult?.versioningReadinessScore ?? "not_supplied"}.`,
        ...(input.versioningReadinessResult?.stableVersionReadyAreas ?? []),
      ],
      fragilitySignals: input.versioningReadinessResult?.unstableVersionFragileAreas ?? ["Versioning readiness result was not supplied."],
      recommendedHumanReview: "Review versioning-history stability before future audit-history versioning or storage design.",
      factors: [`Versioning findings: ${input.versioningReadinessResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Audit history is more survivable when versioning context and compatibility assumptions remain explicit."],
    }),
    createAreaAssessment({
      area: "compatibility_continuity",
      baseScore: Math.min(
        90,
        input.compatibilityMigrationContext?.compatibilityScore ??
          (compatibilitySignals.length > 0 || metadataString(input, "compatibilityVersion") ? 68 : 40),
      ),
      description: "Evaluates whether compatibility continuity is explicit enough for future audit-history reconstruction.",
      survivabilitySignals: compatibilitySignals,
      fragilitySignals:
        compatibilitySignals.length > 0 ? [] : ["Compatibility continuity context was not supplied for audit-history review."],
      recommendedHumanReview: "Review compatibility continuity before future audit-history guarantees.",
      factors: [`Compatibility signals: ${compatibilitySignals.length}.`],
      reasoning: ["Compatibility history should remain explicit before future audit-history persistence or migration assumptions."],
    }),
    createAreaAssessment({
      area: "migration_survivability",
      baseScore: Math.min(
        90,
        input.compatibilityMigrationContext?.migrationSurvivabilityScore ??
          (migrationSignals.length > 0 || metadataString(input, "migrationReviewVersion") ? 68 : 40),
      ),
      description: "Evaluates whether migration survivability context can survive without migration execution.",
      survivabilitySignals: migrationSignals,
      fragilitySignals: migrationSignals.length > 0 ? [] : ["Migration survivability context was not supplied."],
      recommendedHumanReview: "Review migration survivability before future audit-history migration or lifecycle tooling.",
      factors: [`Migration signals: ${migrationSignals.length}.`],
      reasoning: ["Migration-history survivability is review-only here and does not create migration execution or persistence pathways."],
    }),
    createAreaAssessment({
      area: "institutional_memory_continuity",
      baseScore: scoreFromStatus(input.institutionalMemoryContinuityResult?.memoryContinuityClassification),
      description: "Evaluates whether institutional memory continuity supports audit-history survivability.",
      survivabilitySignals: [
        `Memory continuity: ${input.institutionalMemoryContinuityResult?.memoryContinuityClassification ?? "not_supplied"}.`,
        `Memory continuity score: ${input.institutionalMemoryContinuityResult?.institutionalMemoryContinuityScore ?? "not_supplied"}.`,
        ...(input.institutionalMemoryContinuityResult?.durableMemoryAreas ?? []),
      ],
      fragilitySignals: input.institutionalMemoryContinuityResult?.fragileMemoryAreas ?? [
        "Institutional memory continuity result was not supplied.",
      ],
      recommendedHumanReview: "Review institutional memory continuity before relying on audit-history survivability.",
      factors: [`Memory continuity findings: ${input.institutionalMemoryContinuityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Audit-history survivability depends on institutional memory remaining reconstructable and human-reviewable."],
    }),
  ];
};

const createFinding = (params: {
  findingType: GovernanceAuditHistorySurvivabilityFindingType;
  area: GovernanceAuditHistorySurvivabilityArea;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedAuditCategories?: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): GovernanceAuditHistorySurvivabilityFinding => {
  const evidence = unique(params.evidence);
  const factors = unique(params.factors);

  return {
    id: `governance-audit-history-survivability-${slug(params.findingType)}-${slug(params.area)}-${slug(params.description)}`,
    findingType: params.findingType,
    area: params.area,
    severity: params.severity,
    description: params.description,
    evidence,
    affectedAuditCategories: unique(params.affectedAuditCategories ?? []) as FullSystemGovernanceAuditCategory[],
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateAuditHistorySurvivabilityFindingConfidence({
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
  input: GovernanceAuditHistorySurvivabilityInput,
): GovernanceAuditHistorySurvivabilityFinding[] => {
  const findings: GovernanceAuditHistorySurvivabilityFinding[] = [];
  const auditFindings = getAuditFindings(input);
  const auditCategories = unique([
    ...auditFindings.map((finding) => finding.category),
    ...Object.keys(input.auditResult?.categoryScores ?? {}),
    ...(input.traceabilityResult?.traces.map((trace) => trace.auditCategory) ?? []),
  ]) as FullSystemGovernanceAuditCategory[];
  const suppliedAuditHistoryLayers = countSupplied([
    input.institutionalMemoryContinuityResult,
    input.lifecycleContinuityResult,
    input.versioningReadinessResult,
    input.reviewabilityIntegrityResult,
    input.observabilityDurabilityResult,
    input.semanticStabilityResult,
    input.traceabilityResult,
    input.auditResult,
    input.memoryResult,
    input.lineageResult,
    input.evidenceQualityResult,
  ]);

  if (!input.auditResult || input.auditResult.futureTechnicalDebtItems.length > 0 || auditFindings.length === 0) {
    findings.push(
      createFinding({
        findingType: "audit_history_fragmentation",
        area: "audit_classifications",
        severity: !input.auditResult || auditFindings.length === 0 ? "elevated" : "moderate",
        description: "Audit history is missing, has no findings, or includes future technical debt.",
        evidence: [
          `Audit supplied: ${Boolean(input.auditResult)}.`,
          `Audit findings: ${auditFindings.length}.`,
          ...(input.auditResult?.futureTechnicalDebtItems.slice(0, 8) ?? []),
        ],
        affectedAuditCategories: auditCategories,
        recommendedHumanReview: "Review audit history structure before relying on audit-history survivability.",
        factors: ["Audit-history survivability requires durable findings, classifications, category scores, limitations, and recommendations."],
        reasoning: ["Audit history fragments when reviewers cannot reconstruct finding history or category context."],
      }),
    );
  }

  if (suppliedAuditHistoryLayers < 8) {
    findings.push(
      createFinding({
        findingType: "governance_history_gap",
        area: "governance_findings_history",
        severity: suppliedAuditHistoryLayers < 5 ? "elevated" : "moderate",
        description: "Layered governance history context is incomplete for audit-history review.",
        evidence: [`Audit-history layers supplied: ${suppliedAuditHistoryLayers}.`],
        recommendedHumanReview: "Supply institutional memory continuity, lifecycle continuity, versioning, reviewability, observability, semantic, traceability, audit, memory, lineage, and evidence context before relying on audit-history survivability.",
        factors: ["Governance-history reconstruction depends on layered context."],
        reasoning: ["Audit-history gaps emerge when future reviewers cannot inspect upstream governance history together."],
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
        findingType: "traceability_history_discontinuity",
        area: "traceability_history",
        severity: !input.traceabilityResult || input.traceabilityResult.traceabilityClassification === "weak" ? "elevated" : "moderate",
        description: "Traceability history is missing, discontinuous, or below strong traceability.",
        evidence: [
          `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
          ...(input.traceabilityResult?.gaps.map((gap) => gap.description).slice(0, 8) ?? []),
        ],
        affectedAuditCategories: auditCategories,
        recommendedHumanReview: "Review traceability-history continuity before relying on institutional auditability.",
        factors: [`Traceability gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
        reasoning: ["Audit-history survivability needs durable links across evidence, source, scoring, reasoning, limitations, and recommendations."],
      }),
    );
  }

  if (!input.evidenceQualityResult || input.evidenceQualityResult.missingEvidenceAreas.length > 0) {
    findings.push(
      createFinding({
        findingType: "evidence_history_degradation",
        area: "evidence_history",
        severity: !input.evidenceQualityResult ? "elevated" : "moderate",
        description: "Evidence history is missing or has evidence gaps.",
        evidence: [
          `Evidence reliability: ${input.evidenceQualityResult?.overallReliabilityLevel ?? "not_supplied"}.`,
          ...(input.evidenceQualityResult?.missingEvidenceAreas ?? []),
        ],
        recommendedHumanReview: "Review evidence-history gaps before relying on audit-history reconstruction.",
        factors: [`Evidence quality findings: ${input.evidenceQualityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Audit history degrades when evidence history and evidence limitations are not visible."],
      }),
    );
  }

  if (!input.semanticStabilityResult || ["unstable", "mostly_stable"].includes(input.semanticStabilityResult.semanticStabilityClassification)) {
    findings.push(
      createFinding({
        findingType: "semantic_history_drift",
        area: "semantic_history",
        severity: !input.semanticStabilityResult || input.semanticStabilityResult.semanticStabilityClassification === "unstable" ? "elevated" : "moderate",
        description: "Semantic history has drift risk or missing semantic stability context.",
        evidence: [
          `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
          ...(input.semanticStabilityResult?.driftRisks.slice(0, 8) ?? []),
        ],
        recommendedHumanReview: "Review semantic-history drift before relying on long-horizon audit reconstruction.",
        factors: [`Semantic findings: ${input.semanticStabilityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Audit history is harder to reconstruct when governance language changes without stable review context."],
      }),
    );
  }

  if (
    !input.observabilityDurabilityResult ||
    ["fragile", "conditionally_observable"].includes(input.observabilityDurabilityResult.observabilityDurabilityClassification)
  ) {
    findings.push(
      createFinding({
        findingType: "observability_history_gap",
        area: "observability_history",
        severity:
          !input.observabilityDurabilityResult ||
          input.observabilityDurabilityResult.observabilityDurabilityClassification === "fragile"
            ? "elevated"
            : "moderate",
        description: "Observability history is missing or not yet strongly observable.",
        evidence: [
          `Observability durability: ${input.observabilityDurabilityResult?.observabilityDurabilityClassification ?? "not_supplied"}.`,
          ...(input.observabilityDurabilityResult?.fragileObservabilityAreas ?? []),
        ],
        recommendedHumanReview: "Review observability-history gaps before future audit visibility growth.",
        factors: [`Observability findings: ${input.observabilityDurabilityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Audit-history survivability weakens when historical visibility or blind spots cannot be reviewed."],
      }),
    );
  }

  if (!input.lineageResult || input.lineageResult.weakLineageAreas.length > 0 || input.lineageResult.lineageIntegrityScore < 60) {
    findings.push(
      createFinding({
        findingType: "lineage_history_weakness",
        area: "lineage_reconstruction",
        severity: !input.lineageResult || input.lineageResult.lineageIntegrityScore < 45 ? "elevated" : "moderate",
        description: "Lineage history is missing, weak, or has weak lineage areas.",
        evidence: [
          `Lineage integrity score: ${input.lineageResult?.lineageIntegrityScore ?? "not_supplied"}.`,
          ...(input.lineageResult?.weakLineageAreas ?? []),
        ],
        recommendedHumanReview: "Review lineage-history weakness before relying on audit-history reconstruction.",
        factors: [`Lineage nodes: ${input.lineageResult?.nodes.length ?? "not_supplied"}.`],
        reasoning: ["Audit-history survivability depends on lineage visibility across governance findings, evidence, and dependencies."],
      }),
    );
  }

  if (
    !input.reviewabilityIntegrityResult ||
    ["weak", "partially_reviewable"].includes(input.reviewabilityIntegrityResult.reviewabilityClassification)
  ) {
    findings.push(
      createFinding({
        findingType: "reviewability_history_degradation",
        area: "reviewability_reconstruction",
        severity: !input.reviewabilityIntegrityResult || input.reviewabilityIntegrityResult.reviewabilityClassification === "weak" ? "elevated" : "moderate",
        description: "Reviewability history is missing or not yet strongly reconstructable.",
        evidence: [
          `Reviewability: ${input.reviewabilityIntegrityResult?.reviewabilityClassification ?? "not_supplied"}.`,
          ...(input.reviewabilityIntegrityResult?.reconstructionRisks ?? []),
        ],
        recommendedHumanReview: "Review reviewability-history degradation before relying on institutional auditability.",
        factors: [`Reviewability findings: ${input.reviewabilityIntegrityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Audit history remains survivable when future reviewers can reconstruct evidence, reasoning, limitations, and recommendations."],
      }),
    );
  }

  if (
    !input.doctrineResult ||
    input.doctrineResult.doctrineStatus === "thin" ||
    (input.doctrineDurabilityResult?.fragileDoctrineAreas.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        findingType: "doctrine_history_fragmentation",
        area: "doctrine_continuity",
        severity: !input.doctrineResult || input.doctrineResult.doctrineStatus === "thin" ? "elevated" : "moderate",
        description: "Doctrine history is missing, thin, or has fragile doctrine areas.",
        evidence: [
          `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
          ...(input.doctrineDurabilityResult?.fragileDoctrineAreas ?? []),
        ],
        recommendedHumanReview: "Review doctrine-history continuity before relying on audit-history survivability.",
        factors: [`Doctrine principles: ${input.doctrineResult?.principles.length ?? "not_supplied"}.`],
        reasoning: ["Audit history can fragment when doctrine principles, limitations, or durability signals are thin or missing."],
      }),
    );
  }

  if (
    !input.versioningReadinessResult ||
    ["version_fragile", "partially_version_ready"].includes(input.versioningReadinessResult.versioningReadinessClassification)
  ) {
    findings.push(
      createFinding({
        findingType: "versioning_history_instability",
        area: "versioning_continuity",
        severity:
          !input.versioningReadinessResult || input.versioningReadinessResult.versioningReadinessClassification === "version_fragile"
            ? "elevated"
            : "moderate",
        description: "Versioning history is missing or not yet strong enough for audit-history survivability.",
        evidence: [
          `Versioning readiness: ${input.versioningReadinessResult?.versioningReadinessClassification ?? "not_supplied"}.`,
          ...(input.versioningReadinessResult?.unstableVersionFragileAreas ?? []),
        ],
        recommendedHumanReview: "Review versioning-history stability before future audit-history versioning or storage design.",
        factors: [`Versioning findings: ${input.versioningReadinessResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Audit-history survivability weakens when versioning context and compatibility expectations are not stable."],
      }),
    );
  }

  if (
    (input.versioningReadinessResult?.migrationRiskFindings.length ?? 0) > 0 ||
    (input.compatibilityMigrationContext?.migrationFindings?.length ?? 0) > 0 ||
    (!metadataString(input, "migrationReviewVersion") && !metadataString(input, "migrationReview"))
  ) {
    findings.push(
      createFinding({
        findingType: "migration_history_survivability_risk",
        area: "migration_survivability",
        severity: !metadataString(input, "migrationReviewVersion") && !metadataString(input, "migrationReview") ? "moderate" : "low",
        description: "Migration-history survivability requires stronger explicit migration review context.",
        evidence: [
          `migrationReviewVersion: ${metadataString(input, "migrationReviewVersion") ?? "not_supplied"}.`,
          `migrationReview: ${metadataString(input, "migrationReview") ?? "not_supplied"}.`,
          ...(input.versioningReadinessResult?.migrationRiskFindings ?? []),
          ...(input.compatibilityMigrationContext?.migrationFindings ?? []),
        ],
        recommendedHumanReview: "Review migration-history survivability before future audit-history migration or lifecycle tooling.",
        factors: ["Migration-history survivability is evaluated without creating a migration engine."],
        reasoning: ["Audit history should not rely on migration execution; migration assumptions must remain explicit and human-reviewed."],
      }),
    );
  }

  if (
    !input.institutionalMemoryContinuityResult ||
    ["fragmented", "partially_reconstructable"].includes(input.institutionalMemoryContinuityResult.memoryContinuityClassification) ||
    !input.lifecycleContinuityResult
  ) {
    findings.push(
      createFinding({
        findingType: "institutional_audit_reconstruction_risk",
        area: "institutional_memory_continuity",
        severity:
          !input.institutionalMemoryContinuityResult ||
          input.institutionalMemoryContinuityResult.memoryContinuityClassification === "fragmented"
            ? "elevated"
            : "moderate",
        description: "Institutional audit reconstruction context is missing or not yet strongly reconstructable.",
        evidence: [
          `Memory continuity: ${input.institutionalMemoryContinuityResult?.memoryContinuityClassification ?? "not_supplied"}.`,
          `Lifecycle continuity supplied: ${Boolean(input.lifecycleContinuityResult)}.`,
        ],
        recommendedHumanReview: "Review institutional memory and lifecycle continuity before relying on institutional audit reconstruction.",
        factors: [`Memory continuity findings: ${input.institutionalMemoryContinuityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Institutional auditability depends on memory and lifecycle context remaining reconstructable."],
      }),
    );
  }

  if (
    !input.survivabilityExpansionResult ||
    ["fragile", "conditionally_scalable"].includes(input.survivabilityExpansionResult.survivabilityClassification) ||
    !metadataString(input, "auditHistoryVersion")
  ) {
    findings.push(
      createFinding({
        findingType: "long_horizon_audit_survivability_risk",
        area: "governance_findings_history",
        severity: !input.survivabilityExpansionResult || !metadataString(input, "auditHistoryVersion") ? "moderate" : "low",
        description: "Long-horizon audit survivability needs stronger survivability context or explicit auditHistoryVersion metadata.",
        evidence: [
          `Survivability: ${input.survivabilityExpansionResult?.survivabilityClassification ?? "not_supplied"}.`,
          `auditHistoryVersion: ${metadataString(input, "auditHistoryVersion") ?? "not_supplied"}.`,
        ],
        recommendedHumanReview: "Review audit-history survivability and auditHistoryVersion metadata before future audit-history storage design.",
        factors: ["Long-horizon audit survivability is evaluated without creating audit-history persistence."],
        reasoning: ["Future audit-history systems should not be introduced until survivability and version context are human-reviewed."],
      }),
    );
  }

  return findings;
};

export function analyzeGovernanceAuditHistorySurvivability(
  input: GovernanceAuditHistorySurvivabilityInput,
): GovernanceAuditHistorySurvivabilityResult {
  const areaAssessments = buildAreaAssessments(input);
  const findings = buildFindings(input);
  const auditHistorySurvivabilityScore = calculateOverallAuditHistorySurvivabilityScore({
    areaAssessments,
    findings,
  });
  const resultWithoutExplainability = {
    auditHistorySurvivabilityScore,
    auditHistoryClassification: auditHistorySurvivabilityClassificationFromScore(auditHistorySurvivabilityScore),
    areaAssessments,
    findings,
    durableAuditHistoryAreas: unique(
      areaAssessments
        .filter(
          (assessment) =>
            assessment.classification === "survivable" ||
            assessment.classification === "institutionally_survivable",
        )
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    fragileAuditHistoryAreas: unique(
      areaAssessments
        .filter(
          (assessment) =>
            assessment.classification === "fragmented" || assessment.classification === "partially_survivable",
        )
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    governanceHistoryFindings: unique(
      findings
        .filter(
          (finding) =>
            finding.findingType === "audit_history_fragmentation" || finding.findingType === "governance_history_gap",
        )
        .map((finding) => finding.description),
    ),
    evidenceHistoryFindings: unique(
      findings.filter((finding) => finding.findingType === "evidence_history_degradation").map((finding) => finding.description),
    ),
    traceabilityHistoryFindings: unique(
      findings
        .filter((finding) => finding.findingType === "traceability_history_discontinuity")
        .map((finding) => finding.description),
    ),
    semanticHistoryFindings: unique(
      findings.filter((finding) => finding.findingType === "semantic_history_drift").map((finding) => finding.description),
    ),
    observabilityHistoryFindings: unique(
      findings.filter((finding) => finding.findingType === "observability_history_gap").map((finding) => finding.description),
    ),
    lineageHistoryFindings: unique(
      findings.filter((finding) => finding.findingType === "lineage_history_weakness").map((finding) => finding.description),
    ),
    reviewabilityHistoryFindings: unique(
      findings
        .filter((finding) => finding.findingType === "reviewability_history_degradation")
        .map((finding) => finding.description),
    ),
    institutionalAuditabilityFindings: unique(
      findings
        .filter((finding) => finding.findingType === "institutional_audit_reconstruction_risk")
        .map((finding) => finding.description),
    ),
    reconstructionSurvivabilityFindings: unique(
      findings
        .filter((finding) =>
          [
            "institutional_audit_reconstruction_risk",
            "long_horizon_audit_survivability_risk",
            "migration_history_survivability_risk",
            "lineage_history_weakness",
            "reviewability_history_degradation",
          ].includes(finding.findingType),
        )
        .map((finding) => finding.description),
    ),
    humanReviewNotes: unique([
      ...findings.map((finding) => finding.recommendedHumanReview),
      ...(input.institutionalMemoryContinuityResult?.humanReviewNotes ?? []),
      ...(input.lifecycleContinuityResult?.humanReviewNotes ?? []),
      ...(input.compatibilityMigrationContext?.humanReviewNotes ?? []),
      "Do not implement persistence, create audit-history storage, mutate audit history, rewrite governance findings, centralize governance control, create lifecycle automation, rewrite semantics, redesign architecture, enforce policy, or trigger orchestration during this review-only stage.",
      "Keep future audit history, explainability, memory, lifecycle, versioning, compatibility, migration, registry, and observability integrations separate from pure governance review engines.",
    ]),
    futureStabilizationRecommendations: [
      "Prepare Governance Explainability Continuity Review before any persistence, audit-history storage, governance history tooling, or lifecycle automation.",
      "Review audit-history survivability with institutional memory continuity, lifecycle continuity, versioning readiness, reviewability, observability, semantic stability, traceability, audit, doctrine, memory, lineage, continuity, and evidence context supplied together.",
      "Review auditHistoryVersion and compatibility/migration metadata before future audit-history versioning or migration work.",
      "Preserve read-only audit-history boundaries and human-review requirements before future storage design.",
      "Consider shared deterministic audit-history helper utilities only after explainability continuity confirms stable contracts.",
      ...(input.institutionalMemoryContinuityResult?.futureStabilizationRecommendations ?? []),
      ...(input.lifecycleContinuityResult?.futureStabilizationRecommendations ?? []),
      ...(input.compatibilityMigrationContext?.futureStabilizationRecommendations ?? []),
    ],
    humanReviewRequired:
      findings.length > 0 ||
      areaAssessments.some(
        (assessment) => assessment.classification === "fragmented" || assessment.classification === "partially_survivable",
      ),
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernanceAuditHistorySurvivabilityExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}

export const getGovernanceAuditHistorySurvivabilityReview = analyzeGovernanceAuditHistorySurvivability;
