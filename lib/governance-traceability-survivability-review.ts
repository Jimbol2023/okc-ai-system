import { buildGovernanceTraceabilitySurvivabilityExplainability } from "./governance-traceability-survivability-review-explainability";
import {
  calculateOverallTraceabilitySurvivabilityScore,
  calculateTraceabilitySurvivabilityAreaScore,
  calculateTraceabilitySurvivabilityFindingConfidence,
  traceabilitySurvivabilityClassificationFromScore,
} from "./governance-traceability-survivability-review-scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
} from "./full-system-governance-audit-types";
import type {
  GovernanceTraceabilitySurvivabilityArea,
  GovernanceTraceabilitySurvivabilityAreaAssessment,
  GovernanceTraceabilitySurvivabilityFinding,
  GovernanceTraceabilitySurvivabilityFindingType,
  GovernanceTraceabilitySurvivabilityInput,
  GovernanceTraceabilitySurvivabilityResult,
} from "./governance-traceability-survivability-review-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const getAuditFindings = (input: GovernanceTraceabilitySurvivabilityInput): FullSystemGovernanceAuditFinding[] =>
  input.auditFindings ?? input.auditResult?.findings ?? [];

const getRecommendations = (input: GovernanceTraceabilitySurvivabilityInput): FullSystemGovernanceAuditRecommendation[] =>
  input.recommendations ?? input.auditResult?.recommendations ?? [];

const metadataString = (input: GovernanceTraceabilitySurvivabilityInput, key: string): string | undefined =>
  typeof input.metadata?.[key] === "string" ? input.metadata[key] : undefined;

const countSupplied = (items: unknown[]): number => items.filter(Boolean).length;

const scoreFromStatus = (status: string | undefined): number => {
  if (!status) return 38;
  if (
    [
      "institutionally_traceable",
      "institutionally_explainable",
      "institutionally_survivable",
      "institutionally_reconstructable",
      "institutionally_continuous",
      "institutionally_versionable",
      "institutionally_reviewable",
      "institutionally_observable",
      "institutionally_scalable",
      "institutionally_durable",
      "institutionally_stable",
      "institutionally_ready",
      "institutionally_strong",
      "traceable",
      "explainable",
      "survivable",
      "reconstructable",
      "continuous",
      "version_ready",
      "reviewable",
      "observable",
      "durable",
      "scalable",
      "strong",
      "anti_fragile",
    ].includes(status)
  ) {
    return 90;
  }
  if (["stable", "normalized", "operationally_ready", "reliable", "resilient", "aligned"].includes(status)) {
    return 76;
  }
  if (
    [
      "partially_traceable",
      "partially_explainable",
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
  area: GovernanceTraceabilitySurvivabilityArea;
  baseScore: number;
  description: string;
  traceableSignals: string[];
  fragileSignals: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  findingCount?: number;
}): GovernanceTraceabilitySurvivabilityAreaAssessment => {
  const traceableSignals = unique(params.traceableSignals);
  const fragileSignals = unique(params.fragileSignals);
  const factors = unique(params.factors);
  const score = calculateTraceabilitySurvivabilityAreaScore({
    baseScore: params.baseScore,
    traceableSignalCount: traceableSignals.length,
    fragileSignalCount: fragileSignals.length,
    findingCount: params.findingCount ?? 0,
    explainabilityCount: factors.length + params.reasoning.length,
  });

  return {
    area: params.area,
    score,
    classification: traceabilitySurvivabilityClassificationFromScore(score),
    description: params.description,
    traceableSignals,
    fragileSignals,
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors,
      reasoning: params.reasoning,
    },
  };
};

const buildAreaAssessments = (
  input: GovernanceTraceabilitySurvivabilityInput,
): GovernanceTraceabilitySurvivabilityAreaAssessment[] => {
  const auditFindings = getAuditFindings(input);
  const recommendations = getRecommendations(input);
  const auditCategories = unique([
    ...auditFindings.map((finding) => finding.category),
    ...recommendations.map((recommendation) => recommendation.category),
    ...Object.keys(input.auditResult?.categoryScores ?? {}),
    ...(input.traceabilityResult?.traces.map((trace) => trace.auditCategory) ?? []),
    ...(input.normalizationResult?.mappings.flatMap((mapping) => mapping.auditCategories) ?? []),
  ]);
  const traceCount = input.traceabilityResult?.traces.length ?? 0;
  const strongTraceCount =
    input.traceabilityResult?.traces.filter(
      (trace) => trace.traceStrength === "strong" || trace.traceStrength === "institutionally_traceable",
    ).length ?? 0;
  const principleTraceCount =
    input.traceabilityResult?.traces.filter((trace) => trace.governancePrinciple !== "not_supplied").length ?? 0;
  const reasoningTraceCount =
    input.traceabilityResult?.traces.filter((trace) => trace.reasoningLink.trim().length > 0).length ?? 0;
  return [
    createAreaAssessment({
      area: "evidence_linkage",
      baseScore: Math.min(
        90,
        scoreFromStatus(input.traceabilityResult?.traceabilityClassification) * 0.55 +
          scoreFromStatus(input.evidenceQualityResult?.overallReliabilityLevel) * 0.45,
      ),
      description: "Evaluates whether evidence linkage can survive future governance evolution.",
      traceableSignals: [
        `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
        `Trace links: ${traceCount}.`,
        `Strong trace links: ${strongTraceCount}.`,
        `Evidence reliability: ${input.evidenceQualityResult?.overallReliabilityLevel ?? "not_supplied"}.`,
      ],
      fragileSignals: [
        ...(input.traceabilityResult?.missingLinks ?? []),
        ...(input.traceabilityResult?.evidenceGaps ?? []),
        ...(input.evidenceQualityResult?.missingEvidenceAreas ?? []),
      ],
      recommendedHumanReview: "Review evidence linkage before relying on traceability survivability.",
      factors: [`Trace gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
      reasoning: ["Evidence linkage survives when evidence IDs, sources, summaries, and quality limitations remain visible."],
      findingCount: input.traceabilityResult?.gaps.filter((gap) => gap.gapType === "missing_evidence_link").length ?? 1,
    }),
    createAreaAssessment({
      area: "recommendation_linkage",
      baseScore: input.traceabilityResult?.recommendationLinkageGaps.length ? 52 : recommendations.length > 0 ? 74 : 44,
      description: "Evaluates whether recommendations remain linked to evidence, findings, and human review.",
      traceableSignals: [
        `Recommendations: ${recommendations.length}.`,
        ...(input.normalizationResult?.recommendationLinkageConsistency ?? []),
        ...(input.traceabilityResult?.traces
          .filter((trace) => trace.recommendationId !== "not_supplied")
          .slice(0, 8)
          .map((trace) => `${trace.traceId}: recommendation ${trace.recommendationId}.`) ?? []),
      ],
      fragileSignals: input.traceabilityResult?.recommendationLinkageGaps ?? ["Traceability result was not supplied."],
      recommendedHumanReview: "Review recommendation linkage before relying on traceability survivability.",
      factors: [`Recommendation linkage gaps: ${input.traceabilityResult?.recommendationLinkageGaps.length ?? "not_supplied"}.`],
      reasoning: ["Recommendation linkage survives when recommendations remain connected to evidence, findings, limitations, and human-review notes."],
    }),
    createAreaAssessment({
      area: "principle_linkage",
      baseScore: scoreFromStatus(input.normalizationResult?.normalizationClassification),
      description: "Evaluates whether governance principles remain linked to evidence and trace references.",
      traceableSignals: [
        `Principle-linked traces: ${principleTraceCount}.`,
        `Doctrine principles: ${input.doctrineResult?.principles.length ?? "not_supplied"}.`,
        ...(input.normalizationResult?.principleMappingStrength ?? []),
      ],
      fragileSignals: [
        ...(input.normalizationResult?.gaps
          .filter((gap) => gap.gapType === "weak_principle_evidence_mapping")
          .map((gap) => gap.description) ?? []),
        ...(!input.doctrineResult ? ["Doctrine result was not supplied."] : []),
      ],
      recommendedHumanReview: "Review principle-to-evidence linkage before future semantic or registry work.",
      factors: [`Normalization mappings: ${input.normalizationResult?.mappings.length ?? "not_supplied"}.`],
      reasoning: ["Principle linkage survives when doctrine principles remain normalized to evidence, audit categories, and trace IDs."],
    }),
    createAreaAssessment({
      area: "reasoning_linkage",
      baseScore: Math.min(
        90,
        reasoningTraceCount * 4 + scoreFromStatus(input.explainabilityContinuityResult?.explainabilityContinuityClassification) * 0.5,
      ),
      description: "Evaluates whether reasoning links remain visible and reconstructable.",
      traceableSignals: [
        `Reasoning-linked traces: ${reasoningTraceCount}.`,
        `Explainability continuity: ${input.explainabilityContinuityResult?.explainabilityContinuityClassification ?? "not_supplied"}.`,
        ...(input.normalizationResult?.reasoningChainConsistency ?? []),
      ],
      fragileSignals: [
        ...(input.traceabilityResult?.gaps
          .filter((gap) => gap.gapType === "unclear_reasoning_chain")
          .map((gap) => gap.description) ?? []),
        ...(input.explainabilityContinuityResult?.reasoningContinuityFindings ?? []),
      ],
      recommendedHumanReview: "Review reasoning linkage before relying on governance reconstruction.",
      factors: [`Reasoning continuity findings: ${input.explainabilityContinuityResult?.reasoningContinuityFindings.length ?? "not_supplied"}.`],
      reasoning: ["Reasoning linkage survives when trace links preserve why evidence, scores, limitations, and recommendations are connected."],
    }),
    createAreaAssessment({
      area: "lineage_linkage",
      baseScore: input.lineageResult?.lineageIntegrityScore ?? 38,
      description: "Evaluates whether lineage links preserve governance evolution and dependency reconstruction.",
      traceableSignals: [
        `Lineage integrity score: ${input.lineageResult?.lineageIntegrityScore ?? "not_supplied"}.`,
        `Lineage nodes: ${input.lineageResult?.nodes.length ?? "not_supplied"}.`,
        `Lineage edges: ${input.lineageResult?.edges.length ?? "not_supplied"}.`,
        ...(input.lineageResult?.governanceDependencyChains ?? []),
      ],
      fragileSignals: input.lineageResult?.weakLineageAreas ?? ["Lineage result was not supplied."],
      recommendedHumanReview: "Review lineage linkage before relying on long-horizon traceability reconstruction.",
      factors: [`Lineage recommendations: ${input.lineageResult?.recommendations.length ?? "not_supplied"}.`],
      reasoning: ["Lineage linkage survives when nodes, edges, dependencies, contradictions, and stabilization chains remain visible."],
    }),
    createAreaAssessment({
      area: "audit_linkage",
      baseScore: scoreFromStatus(input.auditResult?.auditClassification),
      description: "Evaluates whether audit findings and categories remain connected to trace references.",
      traceableSignals: [
        `Audit classification: ${input.auditResult?.auditClassification ?? "not_supplied"}.`,
        `Audit categories represented: ${auditCategories.length}.`,
        `Audit findings: ${auditFindings.length}.`,
      ],
      fragileSignals: [
        ...(input.normalizationResult?.gaps
          .filter((gap) => gap.gapType === "audit_category_drift")
          .map((gap) => gap.description) ?? []),
        ...(input.traceabilityResult?.gaps
          .filter((gap) => gap.gapType === "inconsistent_audit_category_mapping")
          .map((gap) => gap.description) ?? []),
        ...(!input.auditResult ? ["Audit result was not supplied."] : []),
      ],
      recommendedHumanReview: "Review audit linkage before relying on traceability survivability.",
      factors: [`Audit-history findings: ${input.auditHistorySurvivabilityResult?.governanceHistoryFindings.length ?? "not_supplied"}.`],
      reasoning: ["Audit linkage survives when findings, categories, scores, evidence, and recommendations stay traceable."],
    }),
    createAreaAssessment({
      area: "explainability_linkage",
      baseScore: scoreFromStatus(input.explainabilityContinuityResult?.explainabilityContinuityClassification),
      description: "Evaluates whether explainability links reinforce traceability survivability.",
      traceableSignals: [
        `Explainability continuity: ${input.explainabilityContinuityResult?.explainabilityContinuityClassification ?? "not_supplied"}.`,
        ...(input.explainabilityContinuityResult?.durableExplainabilityAreas ?? []),
      ],
      fragileSignals: input.explainabilityContinuityResult?.traceabilityExplainabilityFindings ?? [
        "Explainability continuity result was not supplied.",
      ],
      recommendedHumanReview: "Review explainability linkage before relying on traceability survivability.",
      factors: [`Explainability findings: ${input.explainabilityContinuityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Traceability survivability is stronger when explainability links keep evidence, reasoning, limitations, and drivers reviewable."],
    }),
    createAreaAssessment({
      area: "survivability_linkage",
      baseScore: scoreFromStatus(input.survivabilityExpansionResult?.survivabilityClassification),
      description: "Evaluates whether survivability context supports traceability under future expansion.",
      traceableSignals: [
        `Survivability: ${input.survivabilityExpansionResult?.survivabilityClassification ?? "not_supplied"}.`,
        ...(input.survivabilityExpansionResult?.traceabilitySurvivabilityFindings ?? []),
      ],
      fragileSignals: input.survivabilityExpansionResult?.fragileExpansionAreas ?? ["Survivability result was not supplied."],
      recommendedHumanReview: "Review survivability linkage before future traceability expansion.",
      factors: [`Survivability findings: ${input.survivabilityExpansionResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Survivability linkage keeps traceability reviewable under future governance, audit, and enterprise scaling."],
    }),
    createAreaAssessment({
      area: "semantic_linkage",
      baseScore: scoreFromStatus(input.semanticStabilityResult?.semanticStabilityClassification),
      description: "Evaluates whether semantic links remain stable enough for traceability survivability.",
      traceableSignals: [
        `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
        ...(input.semanticStabilityResult?.stableTerms.slice(0, 8) ?? []),
      ],
      fragileSignals: [
        ...(input.semanticStabilityResult?.traceabilitySemanticFindings ?? []),
        ...(input.normalizationResult?.governanceSemanticDriftRisks ?? []),
      ],
      recommendedHumanReview: "Review semantic linkage before future traceability, taxonomy, or registry work.",
      factors: [`Semantic drift risks: ${input.semanticStabilityResult?.driftRisks.length ?? "not_supplied"}.`],
      reasoning: ["Semantic linkage survives when trace terminology, audit categories, principles, and evidence labels remain stable."],
    }),
    createAreaAssessment({
      area: "doctrine_linkage",
      baseScore: Math.min(
        90,
        scoreFromStatus(input.doctrineResult?.doctrineStatus) * 0.5 +
          scoreFromStatus(input.doctrineDurabilityResult?.doctrineDurabilityClassification) * 0.5,
      ),
      description: "Evaluates whether doctrine links remain connected to traceability and evidence.",
      traceableSignals: [
        `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
        `Doctrine durability: ${input.doctrineDurabilityResult?.doctrineDurabilityClassification ?? "not_supplied"}.`,
        ...(input.normalizationResult?.principleMappingStrength ?? []),
      ],
      fragileSignals: [
        ...(input.doctrineResult?.doctrineLimitations ?? []),
        ...(input.doctrineDurabilityResult?.traceabilityDurabilityFindings ?? []),
      ],
      recommendedHumanReview: "Review doctrine linkage before relying on principle traceability.",
      factors: [`Doctrine principles: ${input.doctrineResult?.principles.length ?? "not_supplied"}.`],
      reasoning: ["Doctrine linkage survives when principles remain connected to evidence, traces, limitations, and recommendations."],
    }),
    createAreaAssessment({
      area: "observability_linkage",
      baseScore: scoreFromStatus(input.observabilityDurabilityResult?.observabilityDurabilityClassification),
      description: "Evaluates whether observability keeps traceability visible.",
      traceableSignals: [
        `Observability durability: ${input.observabilityDurabilityResult?.observabilityDurabilityClassification ?? "not_supplied"}.`,
        ...(input.observabilityDurabilityResult?.traceabilityVisibilityFindings ?? []),
      ],
      fragileSignals: input.observabilityDurabilityResult?.fragileObservabilityAreas ?? ["Observability result was not supplied."],
      recommendedHumanReview: "Review observability linkage before future traceability visibility work.",
      factors: [`Observability findings: ${input.observabilityDurabilityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Observability linkage keeps traceability visible without creating execution or orchestration paths."],
    }),
    createAreaAssessment({
      area: "reviewability_linkage",
      baseScore: scoreFromStatus(input.reviewabilityIntegrityResult?.reviewabilityClassification),
      description: "Evaluates whether reviewability links keep traceability human-auditable.",
      traceableSignals: [
        `Reviewability: ${input.reviewabilityIntegrityResult?.reviewabilityClassification ?? "not_supplied"}.`,
        ...(input.reviewabilityIntegrityResult?.evidenceReviewabilityFindings ?? []),
      ],
      fragileSignals: [
        ...(input.reviewabilityIntegrityResult?.weakReviewabilityAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.reconstructionRisks ?? []),
      ],
      recommendedHumanReview: "Review reviewability linkage before relying on traceability survivability.",
      factors: [`Reviewability findings: ${input.reviewabilityIntegrityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Reviewability linkage ensures traceability remains understandable, reconstructable, and human-auditable."],
    }),
    createAreaAssessment({
      area: "institutional_memory_linkage",
      baseScore: scoreFromStatus(input.institutionalMemoryContinuityResult?.memoryContinuityClassification),
      description: "Evaluates whether institutional memory preserves traceability context.",
      traceableSignals: [
        `Memory continuity: ${input.institutionalMemoryContinuityResult?.memoryContinuityClassification ?? "not_supplied"}.`,
        ...(input.institutionalMemoryContinuityResult?.traceabilityMemoryFindings ?? []),
      ],
      fragileSignals: input.institutionalMemoryContinuityResult?.fragileMemoryAreas ?? [
        "Institutional memory continuity result was not supplied.",
      ],
      recommendedHumanReview: "Review institutional memory linkage before future traceability storage or migration work.",
      factors: [`Memory continuity findings: ${input.institutionalMemoryContinuityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Institutional memory linkage helps preserve traceability context over long governance horizons."],
    }),
    createAreaAssessment({
      area: "lifecycle_continuity_linkage",
      baseScore: scoreFromStatus(input.lifecycleContinuityResult?.lifecycleContinuityClassification),
      description: "Evaluates whether lifecycle continuity preserves traceability links over time.",
      traceableSignals: [
        `Lifecycle continuity: ${input.lifecycleContinuityResult?.lifecycleContinuityClassification ?? "not_supplied"}.`,
        ...(input.lifecycleContinuityResult?.traceabilityContinuityFindings ?? []),
        `traceabilityVersion: ${metadataString(input, "traceabilityVersion") ?? "not_supplied"}.`,
      ],
      fragileSignals: input.lifecycleContinuityResult?.fragileContinuityAreas ?? ["Lifecycle continuity result was not supplied."],
      recommendedHumanReview: "Review lifecycle traceability linkage before future semantic version survivability work.",
      factors: [`Lifecycle findings: ${input.lifecycleContinuityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Lifecycle continuity linkage keeps traceability reconstructable as governance modules evolve."],
    }),
  ];
};

const createFinding = (params: {
  findingType: GovernanceTraceabilitySurvivabilityFindingType;
  area: GovernanceTraceabilitySurvivabilityArea;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedAuditCategories?: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): GovernanceTraceabilitySurvivabilityFinding => {
  const evidence = unique(params.evidence);
  const factors = unique(params.factors);

  return {
    id: `governance-traceability-survivability-${slug(params.findingType)}-${slug(params.area)}-${slug(params.description)}`,
    findingType: params.findingType,
    area: params.area,
    severity: params.severity,
    description: params.description,
    evidence,
    affectedAuditCategories: unique(params.affectedAuditCategories ?? []) as FullSystemGovernanceAuditCategory[],
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateTraceabilitySurvivabilityFindingConfidence({
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
  input: GovernanceTraceabilitySurvivabilityInput,
): GovernanceTraceabilitySurvivabilityFinding[] => {
  const findings: GovernanceTraceabilitySurvivabilityFinding[] = [];
  const auditFindings = getAuditFindings(input);
  const auditCategories = unique([
    ...auditFindings.map((finding) => finding.category),
    ...Object.keys(input.auditResult?.categoryScores ?? {}),
    ...(input.traceabilityResult?.traces.map((trace) => trace.auditCategory) ?? []),
  ]) as FullSystemGovernanceAuditCategory[];
  const suppliedTraceabilityLayers = countSupplied([
    input.explainabilityContinuityResult,
    input.auditHistorySurvivabilityResult,
    input.institutionalMemoryContinuityResult,
    input.lifecycleContinuityResult,
    input.reviewabilityIntegrityResult,
    input.observabilityDurabilityResult,
    input.semanticStabilityResult,
    input.normalizationResult,
    input.traceabilityResult,
    input.auditResult,
    input.lineageResult,
    input.evidenceQualityResult,
  ]);

  if (!input.traceabilityResult || input.traceabilityResult.traceabilityClassification === "weak" || suppliedTraceabilityLayers < 8) {
    findings.push(
      createFinding({
        findingType: "traceability_collapse_risk",
        area: "evidence_linkage",
        severity: !input.traceabilityResult || input.traceabilityResult.traceabilityClassification === "weak" ? "elevated" : "moderate",
        description: "Traceability survivability has missing traceability context, weak traceability, or incomplete layered context.",
        evidence: [
          `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
          `Traceability layers supplied: ${suppliedTraceabilityLayers}.`,
        ],
        affectedAuditCategories: auditCategories,
        recommendedHumanReview: "Review traceability context before relying on traceability survivability.",
        factors: ["Traceability survivability depends on supplied traceability, normalization, explainability, audit, lineage, and evidence context."],
        reasoning: ["Traceability can collapse when evidence, reasoning, audit, and lineage links cannot be inspected together."],
      }),
    );
  }

  if (
    !input.evidenceQualityResult ||
    !input.traceabilityResult ||
    input.traceabilityResult.evidenceGaps.length > 0 ||
    input.evidenceQualityResult.missingEvidenceAreas.length > 0
  ) {
    findings.push(
      createFinding({
        findingType: "weak_evidence_chain",
        area: "evidence_linkage",
        severity: !input.evidenceQualityResult || !input.traceabilityResult ? "elevated" : "moderate",
        description: "Evidence chains are missing or have visible gaps.",
        evidence: [
          ...(input.traceabilityResult?.evidenceGaps ?? []),
          ...(input.evidenceQualityResult?.missingEvidenceAreas ?? []),
          `Evidence quality supplied: ${Boolean(input.evidenceQualityResult)}.`,
          `Traceability supplied: ${Boolean(input.traceabilityResult)}.`,
        ],
        recommendedHumanReview: "Review evidence chains before relying on long-horizon traceability reconstruction.",
        factors: ["Evidence chain survivability requires evidence quality and traceability context together."],
        reasoning: ["Evidence chains are the foundation for reconstructable traceability."],
      }),
    );
  }

  if ((input.traceabilityResult?.recommendationLinkageGaps.length ?? 0) > 0) {
    findings.push(
      createFinding({
        findingType: "weak_recommendation_linkage",
        area: "recommendation_linkage",
        severity: "moderate",
        description: "Recommendation linkage has traceability gaps.",
        evidence: input.traceabilityResult?.recommendationLinkageGaps ?? [],
        recommendedHumanReview: "Review recommendation linkage before relying on traceability survivability.",
        factors: [`Recommendation linkage gaps: ${input.traceabilityResult?.recommendationLinkageGaps.length ?? 0}.`],
        reasoning: ["Recommendations are harder to review when they are not linked to evidence, limitations, and findings."],
      }),
    );
  }

  if (
    !input.doctrineResult ||
    (input.normalizationResult?.gaps.some((gap) => gap.gapType === "weak_principle_evidence_mapping") ?? false)
  ) {
    findings.push(
      createFinding({
        findingType: "weak_principle_linkage",
        area: "principle_linkage",
        severity: !input.doctrineResult ? "elevated" : "moderate",
        description: "Principle linkage is missing or has weak principle-to-evidence mapping.",
        evidence: [
          `Doctrine supplied: ${Boolean(input.doctrineResult)}.`,
          ...(input.normalizationResult?.gaps
            .filter((gap) => gap.gapType === "weak_principle_evidence_mapping")
            .map((gap) => gap.description) ?? []),
        ],
        recommendedHumanReview: "Review principle linkage before future semantic, registry, or traceability expansion.",
        factors: ["Principle linkage depends on doctrine, normalization, evidence IDs, and trace IDs."],
        reasoning: ["Principles are less durable when reviewers cannot trace them back to evidence and reasoning."],
      }),
    );
  }

  if (
    (input.traceabilityResult?.gaps.some((gap) => gap.gapType === "unclear_reasoning_chain") ?? false) ||
    (input.explainabilityContinuityResult?.reasoningContinuityFindings.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        findingType: "weak_reasoning_linkage",
        area: "reasoning_linkage",
        severity: "moderate",
        description: "Reasoning linkage has unclear reasoning chains or explainability continuity findings.",
        evidence: [
          ...(input.traceabilityResult?.gaps
            .filter((gap) => gap.gapType === "unclear_reasoning_chain")
            .map((gap) => gap.description) ?? []),
          ...(input.explainabilityContinuityResult?.reasoningContinuityFindings ?? []),
        ],
        recommendedHumanReview: "Review reasoning linkage before relying on traceability reconstruction.",
        factors: ["Reasoning linkage depends on trace reasoning links and explainability continuity."],
        reasoning: ["Traceability weakens when reviewers cannot reconstruct why evidence supports a finding, score, or recommendation."],
      }),
    );
  }

  if (!input.lineageResult || input.lineageResult.weakLineageAreas.length > 0 || input.lineageResult.lineageIntegrityScore < 60) {
    findings.push(
      createFinding({
        findingType: "weak_lineage_linkage",
        area: "lineage_linkage",
        severity: !input.lineageResult || input.lineageResult.lineageIntegrityScore < 45 ? "elevated" : "moderate",
        description: "Lineage linkage is missing, weak, or has weak lineage areas.",
        evidence: [
          `Lineage integrity score: ${input.lineageResult?.lineageIntegrityScore ?? "not_supplied"}.`,
          ...(input.lineageResult?.weakLineageAreas ?? []),
        ],
        recommendedHumanReview: "Review lineage linkage before relying on long-horizon traceability.",
        factors: [`Lineage nodes: ${input.lineageResult?.nodes.length ?? "not_supplied"}.`],
        reasoning: ["Lineage linkage helps preserve how governance findings, evidence chains, and decisions evolved."],
      }),
    );
  }

  if (
    !input.auditResult ||
    (input.traceabilityResult?.gaps.some((gap) => gap.gapType === "inconsistent_audit_category_mapping") ?? false) ||
    (input.normalizationResult?.gaps.some((gap) => gap.gapType === "audit_category_drift") ?? false)
  ) {
    findings.push(
      createFinding({
        findingType: "audit_linkage_fragmentation",
        area: "audit_linkage",
        severity: !input.auditResult ? "elevated" : "moderate",
        description: "Audit linkage is missing or fragmented by category mapping drift.",
        evidence: [
          `Audit supplied: ${Boolean(input.auditResult)}.`,
          ...(input.traceabilityResult?.gaps
            .filter((gap) => gap.gapType === "inconsistent_audit_category_mapping")
            .map((gap) => gap.description) ?? []),
          ...(input.normalizationResult?.gaps
            .filter((gap) => gap.gapType === "audit_category_drift")
            .map((gap) => gap.description) ?? []),
        ],
        affectedAuditCategories: auditCategories,
        recommendedHumanReview: "Review audit linkage before future audit-history or traceability expansion.",
        factors: ["Audit linkage requires stable audit category mapping and trace references."],
        reasoning: ["Audit linkage fragments when trace links and audit categories drift apart."],
      }),
    );
  }

  if (
    !input.explainabilityContinuityResult ||
    (input.explainabilityContinuityResult.traceabilityExplainabilityFindings.length ?? 0) > 0 ||
    ["opaque", "partially_explainable"].includes(input.explainabilityContinuityResult.explainabilityContinuityClassification)
  ) {
    findings.push(
      createFinding({
        findingType: "explainability_linkage_gap",
        area: "explainability_linkage",
        severity:
          !input.explainabilityContinuityResult ||
          input.explainabilityContinuityResult.explainabilityContinuityClassification === "opaque"
            ? "elevated"
            : "moderate",
        description: "Explainability linkage is missing or has traceability explainability gaps.",
        evidence: [
          `Explainability continuity: ${input.explainabilityContinuityResult?.explainabilityContinuityClassification ?? "not_supplied"}.`,
          ...(input.explainabilityContinuityResult?.traceabilityExplainabilityFindings ?? []),
        ],
        recommendedHumanReview: "Review explainability linkage before relying on traceability survivability.",
        factors: [`Explainability findings: ${input.explainabilityContinuityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Traceability survivability depends on explanation continuity across evidence, reasoning, limitations, and drivers."],
      }),
    );
  }

  if (
    !input.semanticStabilityResult ||
    ["unstable", "mostly_stable"].includes(input.semanticStabilityResult.semanticStabilityClassification) ||
    input.semanticStabilityResult.traceabilitySemanticFindings.length > 0
  ) {
    findings.push(
      createFinding({
        findingType: "semantic_linkage_instability",
        area: "semantic_linkage",
        severity: !input.semanticStabilityResult || input.semanticStabilityResult.semanticStabilityClassification === "unstable" ? "elevated" : "moderate",
        description: "Semantic linkage is missing, unstable, or has traceability terminology findings.",
        evidence: [
          `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
          ...(input.semanticStabilityResult?.traceabilitySemanticFindings ?? []),
        ],
        recommendedHumanReview: "Review semantic linkage before future semantic version survivability work.",
        factors: ["Semantic linkage depends on stable terminology for trace IDs, evidence labels, audit categories, and governance principles."],
        reasoning: ["Traceability becomes harder to reconstruct when terms and mappings change without stable review context."],
      }),
    );
  }

  if (!input.doctrineResult || input.doctrineResult.doctrineStatus === "thin" || (input.doctrineDurabilityResult?.traceabilityDurabilityFindings.length ?? 0) > 0) {
    findings.push(
      createFinding({
        findingType: "doctrine_linkage_weakness",
        area: "doctrine_linkage",
        severity: !input.doctrineResult || input.doctrineResult.doctrineStatus === "thin" ? "elevated" : "moderate",
        description: "Doctrine linkage is missing, thin, or has traceability durability findings.",
        evidence: [
          `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
          ...(input.doctrineDurabilityResult?.traceabilityDurabilityFindings ?? []),
        ],
        recommendedHumanReview: "Review doctrine linkage before relying on principle traceability.",
        factors: [`Doctrine principles: ${input.doctrineResult?.principles.length ?? "not_supplied"}.`],
        reasoning: ["Doctrine linkage is weaker when principles cannot be traced through evidence, limitations, and recommendations."],
      }),
    );
  }

  if (
    !input.observabilityDurabilityResult ||
    (input.observabilityDurabilityResult.traceabilityVisibilityFindings.length ?? 0) > 0 ||
    ["fragile", "conditionally_observable"].includes(input.observabilityDurabilityResult.observabilityDurabilityClassification)
  ) {
    findings.push(
      createFinding({
        findingType: "observability_linkage_gap",
        area: "observability_linkage",
        severity:
          !input.observabilityDurabilityResult ||
          input.observabilityDurabilityResult.observabilityDurabilityClassification === "fragile"
            ? "elevated"
            : "moderate",
        description: "Observability linkage is missing, fragile, or has traceability visibility findings.",
        evidence: [
          `Observability durability: ${input.observabilityDurabilityResult?.observabilityDurabilityClassification ?? "not_supplied"}.`,
          ...(input.observabilityDurabilityResult?.traceabilityVisibilityFindings ?? []),
        ],
        recommendedHumanReview: "Review observability linkage before future traceability visibility work.",
        factors: [`Observability findings: ${input.observabilityDurabilityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Traceability survivability weakens when trace links are not visible to human reviewers."],
      }),
    );
  }

  if (
    !input.reviewabilityIntegrityResult ||
    ["weak", "partially_reviewable"].includes(input.reviewabilityIntegrityResult.reviewabilityClassification)
  ) {
    findings.push(
      createFinding({
        findingType: "reviewability_linkage_degradation",
        area: "reviewability_linkage",
        severity: !input.reviewabilityIntegrityResult || input.reviewabilityIntegrityResult.reviewabilityClassification === "weak" ? "elevated" : "moderate",
        description: "Reviewability linkage is missing or not strongly reconstructable.",
        evidence: [
          `Reviewability: ${input.reviewabilityIntegrityResult?.reviewabilityClassification ?? "not_supplied"}.`,
          ...(input.reviewabilityIntegrityResult?.reconstructionRisks ?? []),
        ],
        recommendedHumanReview: "Review reviewability linkage before relying on traceability survivability.",
        factors: [`Reviewability findings: ${input.reviewabilityIntegrityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Traceability is less durable when reviewers cannot reconstruct evidence, reasoning, limitations, and recommendations."],
      }),
    );
  }

  if (!metadataString(input, "traceabilityVersion") || !input.lifecycleContinuityResult || !input.institutionalMemoryContinuityResult) {
    findings.push(
      createFinding({
        findingType: "future_traceability_survivability_risk",
        area: "lifecycle_continuity_linkage",
        severity: !input.lifecycleContinuityResult || !input.institutionalMemoryContinuityResult ? "elevated" : "moderate",
        description: "Future traceability survivability needs stronger lifecycle, institutional memory, or traceabilityVersion context.",
        evidence: [
          `traceabilityVersion: ${metadataString(input, "traceabilityVersion") ?? "not_supplied"}.`,
          `Lifecycle continuity supplied: ${Boolean(input.lifecycleContinuityResult)}.`,
          `Institutional memory continuity supplied: ${Boolean(input.institutionalMemoryContinuityResult)}.`,
        ],
        recommendedHumanReview: "Review traceability version metadata, lifecycle continuity, and institutional memory before semantic version survivability work.",
        factors: ["Future traceability survivability is evaluated without persistence or trace mutation."],
        reasoning: ["Long-horizon traceability is easier to preserve when version, lifecycle, and memory context are explicit."],
      }),
    );
  }

  if (!input.auditHistorySurvivabilityResult || !input.explainabilityContinuityResult || !input.lineageResult) {
    findings.push(
      createFinding({
        findingType: "long_horizon_reconstruction_risk",
        area: "lineage_linkage",
        severity: !input.lineageResult || !input.auditHistorySurvivabilityResult ? "elevated" : "moderate",
        description: "Long-horizon traceability reconstruction context is incomplete.",
        evidence: [
          `Audit-history survivability supplied: ${Boolean(input.auditHistorySurvivabilityResult)}.`,
          `Explainability continuity supplied: ${Boolean(input.explainabilityContinuityResult)}.`,
          `Lineage supplied: ${Boolean(input.lineageResult)}.`,
        ],
        recommendedHumanReview: "Review audit-history, explainability, and lineage together before relying on long-horizon traceability reconstruction.",
        factors: ["Long-horizon reconstruction depends on audit history, explainability, and lineage context."],
        reasoning: ["Traceability survivability weakens when reviewers cannot inspect audit history, explanations, and lineage together."],
      }),
    );
  }

  return findings;
};

export function analyzeGovernanceTraceabilitySurvivability(
  input: GovernanceTraceabilitySurvivabilityInput,
): GovernanceTraceabilitySurvivabilityResult {
  const areaAssessments = buildAreaAssessments(input);
  const findings = buildFindings(input);
  const traceabilitySurvivabilityScore = calculateOverallTraceabilitySurvivabilityScore({
    areaAssessments,
    findings,
  });
  const resultWithoutExplainability = {
    traceabilitySurvivabilityScore,
    traceabilitySurvivabilityClassification: traceabilitySurvivabilityClassificationFromScore(traceabilitySurvivabilityScore),
    areaAssessments,
    findings,
    durableTraceabilityAreas: unique(
      areaAssessments
        .filter(
          (assessment) =>
            assessment.classification === "traceable" || assessment.classification === "institutionally_traceable",
        )
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    fragileTraceabilityAreas: unique(
      areaAssessments
        .filter(
          (assessment) => assessment.classification === "collapsed" || assessment.classification === "partially_traceable",
        )
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    evidenceLinkageFindings: unique(
      findings.filter((finding) => finding.findingType === "weak_evidence_chain").map((finding) => finding.description),
    ),
    recommendationLinkageFindings: unique(
      findings.filter((finding) => finding.findingType === "weak_recommendation_linkage").map((finding) => finding.description),
    ),
    principleLinkageFindings: unique(
      findings.filter((finding) => finding.findingType === "weak_principle_linkage").map((finding) => finding.description),
    ),
    reasoningLinkageFindings: unique(
      findings.filter((finding) => finding.findingType === "weak_reasoning_linkage").map((finding) => finding.description),
    ),
    lineageLinkageFindings: unique(
      findings.filter((finding) => finding.findingType === "weak_lineage_linkage").map((finding) => finding.description),
    ),
    auditLinkageFindings: unique(
      findings.filter((finding) => finding.findingType === "audit_linkage_fragmentation").map((finding) => finding.description),
    ),
    explainabilityLinkageFindings: unique(
      findings.filter((finding) => finding.findingType === "explainability_linkage_gap").map((finding) => finding.description),
    ),
    reconstructionSurvivabilityFindings: unique(
      findings
        .filter((finding) =>
          [
            "traceability_collapse_risk",
            "future_traceability_survivability_risk",
            "long_horizon_reconstruction_risk",
            "weak_lineage_linkage",
            "weak_reasoning_linkage",
            "audit_linkage_fragmentation",
          ].includes(finding.findingType),
        )
        .map((finding) => finding.description),
    ),
    humanReviewNotes: unique([
      ...findings.map((finding) => finding.recommendedHumanReview),
      ...(input.explainabilityContinuityResult?.humanReviewNotes ?? []),
      ...(input.auditHistorySurvivabilityResult?.humanReviewNotes ?? []),
      ...(input.institutionalMemoryContinuityResult?.humanReviewNotes ?? []),
      "Do not mutate traceability structures, rewrite evidence links, redesign governance architecture, centralize traceability control, introduce governance automation, add execution systems, implement persistence, rewrite governance outputs, enforce policy, or trigger orchestration during this review-only stage.",
      "Keep future traceability, semantic version, explainability, audit history, memory, lifecycle, versioning, compatibility, registry, and observability integrations separate from pure governance review engines.",
    ]),
    futureStabilizationRecommendations: [
      "Prepare Governance Semantic Version Survivability Review before any persistence, traceability mutation, evidence-link storage, governance history tooling, or lifecycle automation.",
      "Review traceability survivability with explainability continuity, audit-history survivability, institutional memory continuity, lifecycle continuity, versioning readiness, reviewability, observability, semantic stability, normalization, audit, doctrine, memory, lineage, continuity, and evidence context supplied together.",
      "Review traceabilityVersion metadata before future semantic version survivability or traceability storage work.",
      "Preserve read-only traceability boundaries and human-review requirements before future observability or storage design.",
      "Consider shared deterministic traceability helper utilities only after semantic version survivability confirms stable contracts.",
      ...(input.explainabilityContinuityResult?.futureStabilizationRecommendations ?? []),
      ...(input.auditHistorySurvivabilityResult?.futureStabilizationRecommendations ?? []),
      ...(input.institutionalMemoryContinuityResult?.futureStabilizationRecommendations ?? []),
    ],
    humanReviewRequired:
      findings.length > 0 ||
      areaAssessments.some(
        (assessment) => assessment.classification === "collapsed" || assessment.classification === "partially_traceable",
      ),
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernanceTraceabilitySurvivabilityExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}

export const getGovernanceTraceabilitySurvivabilityReview = analyzeGovernanceTraceabilitySurvivability;
