import { buildGovernanceLifecycleContinuityExplainability } from "./governance-lifecycle-continuity-review-explainability";
import {
  calculateLifecycleContinuityAreaScore,
  calculateLifecycleContinuityFindingConfidence,
  calculateOverallLifecycleContinuityScore,
  lifecycleContinuityClassificationFromScore,
} from "./governance-lifecycle-continuity-review-scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
} from "./full-system-governance-audit-types";
import type {
  GovernanceLifecycleContinuityArea,
  GovernanceLifecycleContinuityAreaAssessment,
  GovernanceLifecycleContinuityFinding,
  GovernanceLifecycleContinuityFindingType,
  GovernanceLifecycleContinuityInput,
  GovernanceLifecycleContinuityResult,
} from "./governance-lifecycle-continuity-review-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const getAuditFindings = (input: GovernanceLifecycleContinuityInput): FullSystemGovernanceAuditFinding[] =>
  input.auditFindings ?? input.auditResult?.findings ?? [];

const getRecommendations = (input: GovernanceLifecycleContinuityInput): FullSystemGovernanceAuditRecommendation[] =>
  input.recommendations ?? input.auditResult?.recommendations ?? [];

const metadataString = (input: GovernanceLifecycleContinuityInput, key: string): string | undefined =>
  typeof input.metadata?.[key] === "string" ? input.metadata[key] : undefined;

const countSupplied = (items: unknown[]): number => items.filter(Boolean).length;

const scoreFromStatus = (status: string | undefined): number => {
  if (!status) return 38;
  if (
    [
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
  area: GovernanceLifecycleContinuityArea;
  baseScore: number;
  description: string;
  continuitySignals: string[];
  fragilitySignals: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  findingCount?: number;
}): GovernanceLifecycleContinuityAreaAssessment => {
  const continuitySignals = unique(params.continuitySignals);
  const fragilitySignals = unique(params.fragilitySignals);
  const factors = unique(params.factors);
  const score = calculateLifecycleContinuityAreaScore({
    baseScore: params.baseScore,
    continuitySignalCount: continuitySignals.length,
    fragilitySignalCount: fragilitySignals.length,
    findingCount: params.findingCount ?? 0,
    explainabilityCount: factors.length + params.reasoning.length,
  });

  return {
    area: params.area,
    score,
    classification: lifecycleContinuityClassificationFromScore(score),
    description: params.description,
    continuitySignals,
    fragilitySignals,
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors,
      reasoning: params.reasoning,
    },
  };
};

const buildAreaAssessments = (input: GovernanceLifecycleContinuityInput): GovernanceLifecycleContinuityAreaAssessment[] => {
  const auditFindings = getAuditFindings(input);
  const recommendations = getRecommendations(input);
  const auditCategories = unique([
    ...auditFindings.map((finding) => finding.category),
    ...recommendations.map((recommendation) => recommendation.category),
    ...Object.keys(input.auditResult?.categoryScores ?? {}),
    ...(input.traceabilityResult?.traces.map((trace) => trace.auditCategory) ?? []),
    ...(input.normalizationResult?.mappings.flatMap((mapping) => mapping.auditCategories) ?? []),
  ]);
  const suppliedLifecycleLayers = countSupplied([
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
    ...(input.versioningReadinessResult?.compatibilityFindings ?? []),
    ...(input.compatibilityMigrationContext?.compatibilityFindings ?? []),
    ...(metadataString(input, "compatibilityVersion") ? [`compatibilityVersion: ${metadataString(input, "compatibilityVersion")}.`] : []),
    ...(metadataString(input, "compatibilityPolicy") ? [`compatibilityPolicy: ${metadataString(input, "compatibilityPolicy")}.`] : []),
  ]);
  const migrationSignals = unique([
    ...(input.versioningReadinessResult?.migrationRiskFindings ?? []),
    ...(input.compatibilityMigrationContext?.migrationFindings ?? []),
    ...(metadataString(input, "migrationReviewVersion")
      ? [`migrationReviewVersion: ${metadataString(input, "migrationReviewVersion")}.`]
      : []),
    ...(metadataString(input, "migrationReview") ? [`migrationReview: ${metadataString(input, "migrationReview")}.`] : []),
  ]);

  return [
    createAreaAssessment({
      area: "governance_findings",
      baseScore: Math.min(88, suppliedLifecycleLayers * 5),
      description: "Evaluates whether governance review layers are available together for lifecycle continuity review.",
      continuitySignals: [
        `Lifecycle review layers supplied: ${suppliedLifecycleLayers}.`,
        `Audit categories represented: ${auditCategories.length}.`,
        `Human review remains required: ${Boolean(input.readinessResult?.humanReviewRequired || input.auditResult?.humanReviewRequired)}.`,
      ],
      fragilitySignals: suppliedLifecycleLayers < 12 ? ["Layered governance lifecycle context is incomplete."] : [],
      recommendedHumanReview: "Review supplied governance layers together before relying on lifecycle continuity.",
      factors: [`Lifecycle layers supplied: ${suppliedLifecycleLayers}.`],
      reasoning: ["Lifecycle continuity is stronger when governance outputs can be reviewed together without execution side effects."],
    }),
    createAreaAssessment({
      area: "audit_findings",
      baseScore: scoreFromStatus(input.auditResult?.auditClassification),
      description: "Evaluates whether audit findings, categories, limitations, and recommendations remain continuous.",
      continuitySignals: [
        `Audit classification: ${input.auditResult?.auditClassification ?? "not_supplied"}.`,
        `Audit findings: ${auditFindings.length}.`,
        `Audit recommendations: ${recommendations.length}.`,
      ],
      fragilitySignals: input.auditResult?.futureTechnicalDebtItems ?? ["Audit result was not supplied."],
      recommendedHumanReview: "Review audit structure and future technical debt before relying on audit continuity.",
      factors: [`Audit category count: ${auditCategories.length}.`],
      reasoning: ["Audit continuity depends on stable findings, category scores, limitations, recommendations, and human-review linkage."],
    }),
    createAreaAssessment({
      area: "evidence_chains",
      baseScore: scoreFromStatus(input.evidenceQualityResult?.overallReliabilityLevel),
      description: "Evaluates whether evidence chains remain durable across governance lifecycle evolution.",
      continuitySignals: [
        `Evidence reliability: ${input.evidenceQualityResult?.overallReliabilityLevel ?? "not_supplied"}.`,
        `Evidence quality score: ${input.evidenceQualityResult?.evidenceQualityScore ?? "not_supplied"}.`,
        ...(input.evidenceQualityResult?.stabilizationSupportedAreas ?? []),
      ],
      fragilitySignals: input.evidenceQualityResult?.missingEvidenceAreas ?? ["Evidence quality result was not supplied."],
      recommendedHumanReview: "Review evidence quality and missing evidence before relying on lifecycle evidence continuity.",
      factors: [`Evidence quality findings: ${input.evidenceQualityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Evidence continuity improves when reliability, missing areas, and stabilization support remain visible."],
    }),
    createAreaAssessment({
      area: "traceability_chains",
      baseScore: scoreFromStatus(input.traceabilityResult?.traceabilityClassification),
      description: "Evaluates whether traceability chains remain continuous across evidence, scoring, limitations, and recommendations.",
      continuitySignals: [
        `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
        `Trace links: ${input.traceabilityResult?.traces.length ?? "not_supplied"}.`,
        ...(input.traceabilityResult?.traceStrengths ?? []),
      ],
      fragilitySignals: input.traceabilityResult?.traceWeaknesses ?? ["Traceability result was not supplied."],
      recommendedHumanReview: "Review traceability gaps before relying on lifecycle reconstruction.",
      factors: [`Traceability gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
      reasoning: ["Traceability continuity depends on inspectable links across evidence, reasoning, limitations, and recommendations."],
      findingCount: input.traceabilityResult?.gaps.length ?? 1,
    }),
    createAreaAssessment({
      area: "doctrine_structures",
      baseScore: Math.min(
        90,
        scoreFromStatus(input.doctrineResult?.doctrineStatus) * 0.5 +
          scoreFromStatus(input.doctrineDurabilityResult?.doctrineDurabilityClassification) * 0.5,
      ),
      description: "Evaluates whether doctrine principles and durability signals remain continuous.",
      continuitySignals: [
        `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
        `Doctrine durability: ${input.doctrineDurabilityResult?.doctrineDurabilityClassification ?? "not_supplied"}.`,
        ...(input.doctrineDurabilityResult?.durableDoctrineAreas ?? []),
      ],
      fragilitySignals: [
        ...(input.doctrineResult?.doctrineLimitations ?? []),
        ...(input.doctrineDurabilityResult?.fragileDoctrineAreas ?? []),
      ],
      recommendedHumanReview: "Review doctrine limitations and durability before relying on doctrine continuity.",
      factors: [`Doctrine drift findings: ${input.doctrineResult?.driftFindings.length ?? "not_supplied"}.`],
      reasoning: ["Doctrine continuity depends on stable principles, visible drift, durability signals, and reviewable limitations."],
    }),
    createAreaAssessment({
      area: "semantic_structures",
      baseScore: scoreFromStatus(input.semanticStabilityResult?.semanticStabilityClassification),
      description: "Evaluates whether governance terminology and semantic structures remain continuous.",
      continuitySignals: [
        `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
        ...(input.semanticStabilityResult?.stableTerms.slice(0, 8) ?? []),
      ],
      fragilitySignals: input.semanticStabilityResult?.unstableTerms ?? ["Semantic stability result was not supplied."],
      recommendedHumanReview: "Review semantic drift before future lifecycle evolution.",
      factors: [`Semantic drift risks: ${input.semanticStabilityResult?.driftRisks.length ?? "not_supplied"}.`],
      reasoning: ["Semantic continuity weakens when terminology, scoring semantics, recommendations, or limitations drift without review."],
    }),
    createAreaAssessment({
      area: "classification_structures",
      baseScore: Math.min(
        90,
        (scoreFromStatus(input.auditResult?.auditClassification) +
          scoreFromStatus(input.readinessResult?.readinessClassification) +
          scoreFromStatus(input.assuranceResult?.overallAssuranceStatus) +
          scoreFromStatus(input.versioningReadinessResult?.versioningReadinessClassification)) /
          4,
      ),
      description: "Evaluates whether classifications remain stable and comparable across lifecycle stages.",
      continuitySignals: [
        `Audit: ${input.auditResult?.auditClassification ?? "not_supplied"}.`,
        `Readiness: ${input.readinessResult?.readinessClassification ?? "not_supplied"}.`,
        `Assurance: ${input.assuranceResult?.overallAssuranceStatus ?? "not_supplied"}.`,
        `Versioning: ${input.versioningReadinessResult?.versioningReadinessClassification ?? "not_supplied"}.`,
      ],
      fragilitySignals: input.semanticStabilityResult?.conflictingTerms ?? [],
      recommendedHumanReview: "Review classification comparability before future lifecycle reporting.",
      factors: ["Classification continuity compares audit, readiness, assurance, and versioning classification strength."],
      reasoning: ["Lifecycle continuity depends on classifications staying understandable and comparable as governance expands."],
    }),
    createAreaAssessment({
      area: "observability_outputs",
      baseScore: scoreFromStatus(input.observabilityDurabilityResult?.observabilityDurabilityClassification),
      description: "Evaluates whether observability outputs remain durable across future lifecycle growth.",
      continuitySignals: [
        `Observability durability: ${input.observabilityDurabilityResult?.observabilityDurabilityClassification ?? "not_supplied"}.`,
        `Observability scalability: ${input.observabilityDurabilityResult?.observabilityScalabilityClassification ?? "not_supplied"}.`,
        ...(input.observabilityDurabilityResult?.durableObservabilityAreas ?? []),
      ],
      fragilitySignals: input.observabilityDurabilityResult?.fragileObservabilityAreas ?? ["Observability durability result was not supplied."],
      recommendedHumanReview: "Review observability fragmentation before future lifecycle dashboards or visibility systems.",
      factors: [`Observability findings: ${input.observabilityDurabilityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Lifecycle continuity is more durable when observability remains reviewable and separated from execution."],
    }),
    createAreaAssessment({
      area: "reviewability_outputs",
      baseScore: scoreFromStatus(input.reviewabilityIntegrityResult?.reviewabilityClassification),
      description: "Evaluates whether reviewability outputs remain reconstructable through lifecycle evolution.",
      continuitySignals: [
        `Reviewability: ${input.reviewabilityIntegrityResult?.reviewabilityClassification ?? "not_supplied"}.`,
        `Reviewability score: ${input.reviewabilityIntegrityResult?.reviewabilityIntegrityScore ?? "not_supplied"}.`,
        ...(input.reviewabilityIntegrityResult?.reviewableAreas ?? []),
      ],
      fragilitySignals: input.reviewabilityIntegrityResult?.weakReviewabilityAreas ?? ["Reviewability integrity result was not supplied."],
      recommendedHumanReview: "Review reconstruction and defensibility risks before relying on lifecycle continuity.",
      factors: [`Reviewability findings: ${input.reviewabilityIntegrityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Lifecycle continuity requires governance history to remain reconstructable, explainable, and human-auditable."],
    }),
    createAreaAssessment({
      area: "versioning_readiness",
      baseScore: scoreFromStatus(input.versioningReadinessResult?.versioningReadinessClassification),
      description: "Evaluates whether versioning readiness supports lifecycle continuity without persistence or automation.",
      continuitySignals: [
        `Versioning readiness: ${input.versioningReadinessResult?.versioningReadinessClassification ?? "not_supplied"}.`,
        `Versioning score: ${input.versioningReadinessResult?.versioningReadinessScore ?? "not_supplied"}.`,
        ...(input.versioningReadinessResult?.stableVersionReadyAreas ?? []),
      ],
      fragilitySignals: input.versioningReadinessResult?.unstableVersionFragileAreas ?? ["Versioning readiness result was not supplied."],
      recommendedHumanReview: "Review versioning readiness before future lifecycle version tracking.",
      factors: [`Versioning findings: ${input.versioningReadinessResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Lifecycle versioning should remain review-only until readiness, compatibility, and migration assumptions are visible."],
    }),
    createAreaAssessment({
      area: "compatibility_expectations",
      baseScore: Math.min(
        90,
        input.compatibilityMigrationContext?.compatibilityScore ??
          (compatibilitySignals.length > 0 || metadataString(input, "compatibilityVersion") ? 68 : 40),
      ),
      description: "Evaluates whether compatibility expectations are explicit enough to preserve continuity.",
      continuitySignals: compatibilitySignals,
      fragilitySignals:
        compatibilitySignals.length > 0 ? [] : ["Compatibility expectations were not supplied as explicit lifecycle context."],
      recommendedHumanReview: "Review compatibility expectations before future lifecycle guarantees.",
      factors: [`Compatibility signals: ${compatibilitySignals.length}.`],
      reasoning: ["Compatibility continuity should be reviewed before future backward-compatibility or migration guarantees."],
    }),
    createAreaAssessment({
      area: "migration_survivability",
      baseScore: Math.min(
        90,
        input.compatibilityMigrationContext?.migrationSurvivabilityScore ??
          (migrationSignals.length > 0 || metadataString(input, "migrationReviewVersion") ? 68 : 40),
      ),
      description: "Evaluates whether migration survivability assumptions are explicit and reviewable.",
      continuitySignals: migrationSignals,
      fragilitySignals: migrationSignals.length > 0 ? [] : ["Migration survivability context was not supplied."],
      recommendedHumanReview: "Review migration survivability before future migration or lifecycle evolution tooling.",
      factors: [`Migration signals: ${migrationSignals.length}.`],
      reasoning: ["Migration continuity is review-only here and does not create migration execution pathways."],
    }),
    createAreaAssessment({
      area: "institutional_memory",
      baseScore: scoreFromStatus(input.memoryResult?.institutionalMemoryStatus),
      description: "Evaluates whether institutional memory is sufficient for long-horizon lifecycle continuity.",
      continuitySignals: [
        `Memory status: ${input.memoryResult?.institutionalMemoryStatus ?? "not_supplied"}.`,
        `Snapshots reviewed: ${input.memoryResult?.snapshotsReviewed.length ?? "not_supplied"}.`,
        ...(input.memoryResult?.longHorizonContext ?? []),
      ],
      fragilitySignals: input.memoryResult
        ? input.memoryResult.snapshotsReviewed.length < 2
          ? ["Institutional memory has limited historical snapshots."]
          : []
        : ["Memory result was not supplied."],
      recommendedHumanReview: "Review institutional memory depth before relying on lifecycle continuity.",
      factors: [`Recurring patterns: ${input.memoryResult?.recurringPatterns.length ?? "not_supplied"}.`],
      reasoning: ["Lifecycle continuity is stronger when durable memory, recurring patterns, and long-horizon context are visible."],
    }),
    createAreaAssessment({
      area: "lineage_continuity",
      baseScore: input.lineageResult?.lineageIntegrityScore ?? 38,
      description: "Evaluates whether governance lineage supports reconstructing lifecycle history.",
      continuitySignals: [
        `Lineage integrity score: ${input.lineageResult?.lineageIntegrityScore ?? "not_supplied"}.`,
        `Lineage nodes: ${input.lineageResult?.nodes.length ?? "not_supplied"}.`,
        `Lineage edges: ${input.lineageResult?.edges.length ?? "not_supplied"}.`,
      ],
      fragilitySignals: input.lineageResult?.weakLineageAreas ?? ["Lineage result was not supplied."],
      recommendedHumanReview: "Review lineage gaps before relying on governance history reconstruction.",
      factors: [`Governance dependency chains: ${input.lineageResult?.governanceDependencyChains.length ?? "not_supplied"}.`],
      reasoning: ["Lifecycle history is easier to reconstruct when lineage nodes, edges, dependencies, and limitations remain visible."],
    }),
  ];
};

const createFinding = (params: {
  findingType: GovernanceLifecycleContinuityFindingType;
  area: GovernanceLifecycleContinuityArea;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedAuditCategories?: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): GovernanceLifecycleContinuityFinding => {
  const evidence = unique(params.evidence);
  const factors = unique(params.factors);

  return {
    id: `governance-lifecycle-continuity-${slug(params.findingType)}-${slug(params.area)}-${slug(params.description)}`,
    findingType: params.findingType,
    area: params.area,
    severity: params.severity,
    description: params.description,
    evidence,
    affectedAuditCategories: unique(params.affectedAuditCategories ?? []) as FullSystemGovernanceAuditCategory[],
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateLifecycleContinuityFindingConfidence({
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

const buildFindings = (input: GovernanceLifecycleContinuityInput): GovernanceLifecycleContinuityFinding[] => {
  const findings: GovernanceLifecycleContinuityFinding[] = [];
  const auditFindings = getAuditFindings(input);
  const auditCategories = unique([
    ...auditFindings.map((finding) => finding.category),
    ...Object.keys(input.auditResult?.categoryScores ?? {}),
    ...(input.traceabilityResult?.traces.map((trace) => trace.auditCategory) ?? []),
  ]) as FullSystemGovernanceAuditCategory[];
  const suppliedLifecycleLayers = countSupplied([
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

  if (suppliedLifecycleLayers < 8) {
    findings.push(
      createFinding({
        findingType: "lifecycle_continuity_gap",
        area: "governance_findings",
        severity: suppliedLifecycleLayers < 5 ? "elevated" : "moderate",
        description: "Layered governance lifecycle context is incomplete.",
        evidence: [`Lifecycle layers supplied: ${suppliedLifecycleLayers}.`],
        recommendedHumanReview: "Supply versioning, reviewability, observability, semantic, traceability, audit, doctrine, memory, lineage, continuity, and evidence context before relying on lifecycle continuity.",
        factors: ["Lifecycle continuity depends on layered governance context."],
        reasoning: ["Continuity gaps emerge when future reviewers cannot inspect the upstream context needed to reconstruct governance evolution."],
      }),
    );
  }

  if (!input.auditResult || input.auditResult.auditClassification === "critical_risk" || input.auditResult.futureTechnicalDebtItems.length > 0) {
    findings.push(
      createFinding({
        findingType: "audit_continuity_risk",
        area: "audit_findings",
        severity: !input.auditResult || input.auditResult.auditClassification === "critical_risk" ? "elevated" : "moderate",
        description: "Audit continuity is limited by missing audit context, critical classification, or future technical debt.",
        evidence: [
          `Audit classification: ${input.auditResult?.auditClassification ?? "not_supplied"}.`,
          ...(input.auditResult?.futureTechnicalDebtItems.slice(0, 8) ?? []),
        ],
        affectedAuditCategories: auditCategories,
        recommendedHumanReview: "Review audit continuity before future lifecycle reporting or audit contract evolution.",
        factors: [`Audit technical debt items: ${input.auditResult?.futureTechnicalDebtItems.length ?? "not_supplied"}.`],
        reasoning: ["Audit continuity weakens when audit structures are missing, critical, or carrying unresolved technical debt."],
      }),
    );
  }

  if (!input.semanticStabilityResult || ["unstable", "mostly_stable"].includes(input.semanticStabilityResult.semanticStabilityClassification)) {
    findings.push(
      createFinding({
        findingType: "semantic_continuity_drift",
        area: "semantic_structures",
        severity: !input.semanticStabilityResult || input.semanticStabilityResult.semanticStabilityClassification === "unstable" ? "elevated" : "moderate",
        description: "Semantic continuity has drift risk or missing semantic stability context.",
        evidence: [
          `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
          ...(input.semanticStabilityResult?.driftRisks.slice(0, 8) ?? []),
        ],
        recommendedHumanReview: "Review semantic drift before future lifecycle, registry, taxonomy, or versioning work.",
        factors: [`Semantic findings: ${input.semanticStabilityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Lifecycle continuity is less durable when governance meaning can drift across evaluation periods."],
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
        findingType: "traceability_discontinuity",
        area: "traceability_chains",
        severity: !input.traceabilityResult || input.traceabilityResult.traceabilityClassification === "weak" ? "elevated" : "moderate",
        description: "Traceability continuity has missing context, visible gaps, or limited trace strength.",
        evidence: [
          `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
          ...(input.traceabilityResult?.gaps.map((gap) => gap.description).slice(0, 8) ?? []),
        ],
        affectedAuditCategories: auditCategories,
        recommendedHumanReview: "Review traceability gaps before relying on lifecycle reconstruction.",
        factors: [`Traceability gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
        reasoning: ["Governance lifecycle continuity depends on preserving evidence, reasoning, scoring, limitation, and recommendation links."],
      }),
    );
  }

  if (
    !input.observabilityDurabilityResult ||
    ["fragile", "conditionally_observable"].includes(input.observabilityDurabilityResult.observabilityDurabilityClassification)
  ) {
    findings.push(
      createFinding({
        findingType: "observability_fragmentation",
        area: "observability_outputs",
        severity:
          !input.observabilityDurabilityResult ||
          input.observabilityDurabilityResult.observabilityDurabilityClassification === "fragile"
            ? "elevated"
            : "moderate",
        description: "Observability continuity may fragment under future lifecycle growth.",
        evidence: [
          `Observability durability: ${input.observabilityDurabilityResult?.observabilityDurabilityClassification ?? "not_supplied"}.`,
          ...(input.observabilityDurabilityResult?.fragileObservabilityAreas ?? []),
        ],
        recommendedHumanReview: "Review observability durability before future lifecycle dashboards or visibility expansion.",
        factors: [`Observability findings: ${input.observabilityDurabilityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Lifecycle continuity is harder to preserve when observability outputs fragment or become incomplete."],
      }),
    );
  }

  if (
    !input.reviewabilityIntegrityResult ||
    ["weak", "partially_reviewable"].includes(input.reviewabilityIntegrityResult.reviewabilityClassification)
  ) {
    findings.push(
      createFinding({
        findingType: "reviewability_degradation",
        area: "reviewability_outputs",
        severity: !input.reviewabilityIntegrityResult || input.reviewabilityIntegrityResult.reviewabilityClassification === "weak" ? "elevated" : "moderate",
        description: "Reviewability continuity is missing or not yet institutionally strong.",
        evidence: [
          `Reviewability: ${input.reviewabilityIntegrityResult?.reviewabilityClassification ?? "not_supplied"}.`,
          ...(input.reviewabilityIntegrityResult?.reconstructionRisks ?? []),
        ],
        recommendedHumanReview: "Review reconstruction and defensibility context before relying on lifecycle continuity.",
        factors: [`Reviewability findings: ${input.reviewabilityIntegrityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Lifecycle continuity depends on future reviewers being able to reconstruct evidence, reasoning, limits, and recommendations."],
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
        findingType: "doctrine_continuity_weakness",
        area: "doctrine_structures",
        severity: !input.doctrineResult || input.doctrineResult.doctrineStatus === "thin" ? "elevated" : "moderate",
        description: "Doctrine continuity has missing doctrine context, thin doctrine status, or fragile doctrine areas.",
        evidence: [
          `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
          ...(input.doctrineDurabilityResult?.fragileDoctrineAreas ?? []),
        ],
        recommendedHumanReview: "Review doctrine continuity before future governance doctrine or lifecycle evolution.",
        factors: [`Doctrine principles: ${input.doctrineResult?.principles.length ?? "not_supplied"}.`],
        reasoning: ["Doctrine continuity weakens when principles or durability signals are thin, fragile, or missing."],
      }),
    );
  }

  if (
    !input.versioningReadinessResult ||
    ["version_fragile", "partially_version_ready"].includes(input.versioningReadinessResult.versioningReadinessClassification)
  ) {
    findings.push(
      createFinding({
        findingType: "versioning_continuity_risk",
        area: "versioning_readiness",
        severity:
          !input.versioningReadinessResult || input.versioningReadinessResult.versioningReadinessClassification === "version_fragile"
            ? "elevated"
            : "moderate",
        description: "Versioning readiness is missing or not yet strong enough for lifecycle continuity.",
        evidence: [
          `Versioning readiness: ${input.versioningReadinessResult?.versioningReadinessClassification ?? "not_supplied"}.`,
          ...(input.versioningReadinessResult?.unstableVersionFragileAreas ?? []),
        ],
        recommendedHumanReview: "Review versioning readiness before future lifecycle version tracking.",
        factors: [`Versioning findings: ${input.versioningReadinessResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Lifecycle continuity is harder to preserve when version metadata, contract stability, or compatibility review are weak."],
      }),
    );
  }

  if (
    (input.versioningReadinessResult?.compatibilityFindings.length ?? 0) > 0 ||
    (input.compatibilityMigrationContext?.compatibilityFindings?.length ?? 0) > 0 ||
    (!metadataString(input, "compatibilityVersion") && !metadataString(input, "compatibilityPolicy"))
  ) {
    findings.push(
      createFinding({
        findingType: "compatibility_continuity_risk",
        area: "compatibility_expectations",
        severity: !metadataString(input, "compatibilityVersion") && !metadataString(input, "compatibilityPolicy") ? "moderate" : "low",
        description: "Compatibility continuity requires stronger explicit compatibility expectations.",
        evidence: [
          `compatibilityVersion: ${metadataString(input, "compatibilityVersion") ?? "not_supplied"}.`,
          `compatibilityPolicy: ${metadataString(input, "compatibilityPolicy") ?? "not_supplied"}.`,
          ...(input.versioningReadinessResult?.compatibilityFindings ?? []),
          ...(input.compatibilityMigrationContext?.compatibilityFindings ?? []),
        ],
        recommendedHumanReview: "Review compatibility expectations before future lifecycle compatibility guarantees.",
        factors: ["Compatibility continuity is evaluated from versioning findings, optional context, and metadata."],
        reasoning: ["Backward compatibility should remain human-reviewed until explicit compatibility expectations are stable."],
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
        findingType: "migration_continuity_risk",
        area: "migration_survivability",
        severity: !metadataString(input, "migrationReviewVersion") && !metadataString(input, "migrationReview") ? "moderate" : "low",
        description: "Migration continuity requires stronger explicit migration review context.",
        evidence: [
          `migrationReviewVersion: ${metadataString(input, "migrationReviewVersion") ?? "not_supplied"}.`,
          `migrationReview: ${metadataString(input, "migrationReview") ?? "not_supplied"}.`,
          ...(input.versioningReadinessResult?.migrationRiskFindings ?? []),
          ...(input.compatibilityMigrationContext?.migrationFindings ?? []),
        ],
        recommendedHumanReview: "Review migration survivability before future lifecycle migration work.",
        factors: ["Migration continuity is evaluated without creating a migration engine."],
        reasoning: ["Lifecycle continuity should not depend on migration execution; migration assumptions must remain explicit and human-reviewed."],
      }),
    );
  }

  if (!input.memoryResult || input.memoryResult.institutionalMemoryStatus === "thin" || input.memoryResult.snapshotsReviewed.length < 2) {
    findings.push(
      createFinding({
        findingType: "institutional_memory_fragmentation",
        area: "institutional_memory",
        severity: !input.memoryResult || input.memoryResult.institutionalMemoryStatus === "thin" ? "elevated" : "moderate",
        description: "Institutional memory continuity is missing, thin, or has limited historical snapshots.",
        evidence: [
          `Memory status: ${input.memoryResult?.institutionalMemoryStatus ?? "not_supplied"}.`,
          `Snapshots reviewed: ${input.memoryResult?.snapshotsReviewed.length ?? "not_supplied"}.`,
        ],
        recommendedHumanReview: "Review institutional memory depth before relying on lifecycle continuity.",
        factors: [`Memory patterns: ${input.memoryResult?.recurringPatterns.length ?? "not_supplied"}.`],
        reasoning: ["Institutional memory fragmentation makes governance evolution harder to reconstruct over long horizons."],
      }),
    );
  }

  if (!input.lineageResult || !input.memoryResult || !input.traceabilityResult || !input.reviewabilityIntegrityResult) {
    findings.push(
      createFinding({
        findingType: "governance_history_reconstruction_risk",
        area: "lineage_continuity",
        severity: !input.lineageResult || !input.memoryResult ? "elevated" : "moderate",
        description: "Governance history reconstruction context is incomplete.",
        evidence: [
          `Lineage supplied: ${Boolean(input.lineageResult)}.`,
          `Memory supplied: ${Boolean(input.memoryResult)}.`,
          `Traceability supplied: ${Boolean(input.traceabilityResult)}.`,
          `Reviewability supplied: ${Boolean(input.reviewabilityIntegrityResult)}.`,
        ],
        recommendedHumanReview: "Review lineage, memory, traceability, and reviewability together before relying on governance history reconstruction.",
        factors: ["History reconstruction depends on lineage, memory, traceability, and reviewability context."],
        reasoning: ["Lifecycle continuity weakens when reviewers cannot reconstruct how governance meaning, evidence, and decisions evolved."],
      }),
    );
  }

  return findings;
};

export function analyzeGovernanceLifecycleContinuity(
  input: GovernanceLifecycleContinuityInput,
): GovernanceLifecycleContinuityResult {
  const areaAssessments = buildAreaAssessments(input);
  const findings = buildFindings(input);
  const lifecycleContinuityScore = calculateOverallLifecycleContinuityScore({ areaAssessments, findings });
  const resultWithoutExplainability = {
    lifecycleContinuityScore,
    lifecycleContinuityClassification: lifecycleContinuityClassificationFromScore(lifecycleContinuityScore),
    areaAssessments,
    findings,
    durableContinuityAreas: unique(
      areaAssessments
        .filter((assessment) => assessment.classification === "continuous" || assessment.classification === "institutionally_continuous")
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    fragileContinuityAreas: unique(
      areaAssessments
        .filter((assessment) => assessment.classification === "discontinuous" || assessment.classification === "partially_continuous")
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    auditContinuityFindings: unique(
      findings.filter((finding) => finding.findingType === "audit_continuity_risk").map((finding) => finding.description),
    ),
    semanticContinuityFindings: unique(
      findings.filter((finding) => finding.findingType === "semantic_continuity_drift").map((finding) => finding.description),
    ),
    traceabilityContinuityFindings: unique(
      findings.filter((finding) => finding.findingType === "traceability_discontinuity").map((finding) => finding.description),
    ),
    observabilityContinuityFindings: unique(
      findings.filter((finding) => finding.findingType === "observability_fragmentation").map((finding) => finding.description),
    ),
    reviewabilityContinuityFindings: unique(
      findings.filter((finding) => finding.findingType === "reviewability_degradation").map((finding) => finding.description),
    ),
    doctrineContinuityFindings: unique(
      findings.filter((finding) => finding.findingType === "doctrine_continuity_weakness").map((finding) => finding.description),
    ),
    versioningContinuityFindings: unique(
      findings.filter((finding) => finding.findingType === "versioning_continuity_risk").map((finding) => finding.description),
    ),
    migrationContinuityFindings: unique(
      findings
        .filter(
          (finding) =>
            finding.findingType === "migration_continuity_risk" || finding.findingType === "compatibility_continuity_risk",
        )
        .map((finding) => finding.description),
    ),
    institutionalMemoryFindings: unique(
      findings
        .filter(
          (finding) =>
            finding.findingType === "institutional_memory_fragmentation" ||
            finding.findingType === "governance_history_reconstruction_risk",
        )
        .map((finding) => finding.description),
    ),
    humanReviewNotes: unique([
      ...findings.map((finding) => finding.recommendedHumanReview),
      ...(input.compatibilityMigrationContext?.humanReviewNotes ?? []),
      "Do not implement persistence, lifecycle automation, governance history mutation, migration execution, semantic rewriting, governance centralization, or orchestration execution during this review-only stage.",
      "Keep future lifecycle, compatibility, migration, memory, registry, and observability integrations separate from pure governance review engines.",
    ]),
    futureStabilizationRecommendations: [
      "Prepare Governance Institutional Memory Continuity Review before any persistence, lifecycle automation, or governance history tooling.",
      "Review lifecycle continuity with versioning readiness, reviewability, observability, semantic stability, traceability, audit, doctrine, memory, lineage, continuity, and evidence quality supplied together.",
      "Review compatibility and migration assumptions as explicit metadata before future lifecycle guarantees.",
      "Preserve read-only lifecycle review boundaries and human-review requirements before future storage or automation design.",
      "Consider shared deterministic lifecycle helper utilities only after institutional memory continuity confirms stable contracts.",
      ...(input.compatibilityMigrationContext?.futureStabilizationRecommendations ?? []),
    ],
    humanReviewRequired:
      findings.length > 0 ||
      areaAssessments.some(
        (assessment) => assessment.classification === "discontinuous" || assessment.classification === "partially_continuous",
      ),
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernanceLifecycleContinuityExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}

export const getGovernanceLifecycleContinuityReview = analyzeGovernanceLifecycleContinuity;
