import { buildGovernanceExplainabilityContinuityExplainability } from "./governance-explainability-continuity-review-explainability";
import {
  calculateExplainabilityContinuityAreaScore,
  calculateExplainabilityContinuityFindingConfidence,
  calculateOverallExplainabilityContinuityScore,
  explainabilityContinuityClassificationFromScore,
} from "./governance-explainability-continuity-review-scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
} from "./full-system-governance-audit-types";
import type {
  GovernanceExplainabilityContinuityArea,
  GovernanceExplainabilityContinuityAreaAssessment,
  GovernanceExplainabilityContinuityFinding,
  GovernanceExplainabilityContinuityFindingType,
  GovernanceExplainabilityContinuityInput,
  GovernanceExplainabilityContinuityResult,
} from "./governance-explainability-continuity-review-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const getAuditFindings = (input: GovernanceExplainabilityContinuityInput): FullSystemGovernanceAuditFinding[] =>
  input.auditFindings ?? input.auditResult?.findings ?? [];

const getRecommendations = (input: GovernanceExplainabilityContinuityInput): FullSystemGovernanceAuditRecommendation[] =>
  input.recommendations ?? input.auditResult?.recommendations ?? [];

const metadataString = (input: GovernanceExplainabilityContinuityInput, key: string): string | undefined =>
  typeof input.metadata?.[key] === "string" ? input.metadata[key] : undefined;

const countSupplied = (items: unknown[]): number => items.filter(Boolean).length;

const scoreFromStatus = (status: string | undefined): number => {
  if (!status) return 38;
  if (
    [
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
      "institutionally_traceable",
      "institutionally_ready",
      "institutionally_strong",
      "explainable",
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
  if (["stable", "normalized", "strong", "operationally_ready", "reliable", "resilient", "aligned"].includes(status)) {
    return 76;
  }
  if (
    [
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

const countExplainabilityRules = (input: GovernanceExplainabilityContinuityInput): number =>
  (input.auditHistorySurvivabilityResult?.explainability.auditHistorySurvivabilityRulesApplied.length ?? 0) +
  (input.institutionalMemoryContinuityResult?.explainability.institutionalMemoryContinuityRulesApplied.length ?? 0) +
  (input.lifecycleContinuityResult?.explainability.lifecycleContinuityRulesApplied.length ?? 0) +
  (input.versioningReadinessResult?.explainability.versioningReadinessRulesApplied.length ?? 0) +
  (input.reviewabilityIntegrityResult?.explainability.reviewabilityIntegrityRulesApplied.length ?? 0) +
  (input.observabilityDurabilityResult?.explainability.observabilityDurabilityRulesApplied.length ?? 0) +
  (input.survivabilityExpansionResult?.explainability.survivabilityRulesApplied.length ?? 0) +
  (input.doctrineDurabilityResult?.explainability.doctrineDurabilityRulesApplied.length ?? 0) +
  (input.semanticStabilityResult?.explainability.semanticStabilityRulesApplied.length ?? 0) +
  (input.normalizationResult?.explainability.normalizationRulesApplied.length ?? 0) +
  (input.traceabilityResult?.explainability.traceabilityRulesApplied.length ?? 0) +
  (input.auditResult?.explainability.auditRulesApplied.length ?? 0) +
  (input.readinessResult?.explainability.readinessRulesApplied.length ?? 0) +
  (input.assuranceResult?.explainability.assuranceRulesApplied.length ?? 0) +
  (input.alignmentResult?.explainability.alignmentRulesApplied.length ?? 0) +
  (input.doctrineResult?.explainability.doctrineRulesApplied.length ?? 0) +
  (input.memoryResult?.explainability.memoryRulesApplied.length ?? 0) +
  (input.lineageResult?.explainability.lineageRulesApplied.length ?? 0);

const incompleteAuditFindings = (findings: FullSystemGovernanceAuditFinding[]): FullSystemGovernanceAuditFinding[] =>
  findings.filter(
    (finding) =>
      finding.evidence.length === 0 ||
      finding.explainability.factors.length === 0 ||
      finding.explainability.reasoning.length === 0 ||
      !finding.recommendedHumanReview,
  );

const createAreaAssessment = (params: {
  area: GovernanceExplainabilityContinuityArea;
  baseScore: number;
  description: string;
  explainabilitySignals: string[];
  opacitySignals: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  findingCount?: number;
}): GovernanceExplainabilityContinuityAreaAssessment => {
  const explainabilitySignals = unique(params.explainabilitySignals);
  const opacitySignals = unique(params.opacitySignals);
  const factors = unique(params.factors);
  const score = calculateExplainabilityContinuityAreaScore({
    baseScore: params.baseScore,
    explainabilitySignalCount: explainabilitySignals.length,
    opacitySignalCount: opacitySignals.length,
    findingCount: params.findingCount ?? 0,
    explainabilityCount: factors.length + params.reasoning.length,
  });

  return {
    area: params.area,
    score,
    classification: explainabilityContinuityClassificationFromScore(score),
    description: params.description,
    explainabilitySignals,
    opacitySignals,
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors,
      reasoning: params.reasoning,
    },
  };
};

const buildAreaAssessments = (
  input: GovernanceExplainabilityContinuityInput,
): GovernanceExplainabilityContinuityAreaAssessment[] => {
  const auditFindings = getAuditFindings(input);
  const recommendations = getRecommendations(input);
  const incompleteFindings = incompleteAuditFindings(auditFindings);
  const ruleCount = countExplainabilityRules(input);
  const auditCategories = unique([
    ...auditFindings.map((finding) => finding.category),
    ...recommendations.map((recommendation) => recommendation.category),
    ...Object.keys(input.auditResult?.categoryScores ?? {}),
    ...(input.traceabilityResult?.traces.map((trace) => trace.auditCategory) ?? []),
    ...(input.normalizationResult?.mappings.flatMap((mapping) => mapping.auditCategories) ?? []),
  ]);
  const suppliedExplainabilityLayers = countSupplied([
    input.auditHistorySurvivabilityResult,
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
    input.doctrineResult,
    input.memoryResult,
    input.lineageResult,
    input.evidenceQualityResult,
  ]);

  return [
    createAreaAssessment({
      area: "governance_findings",
      baseScore: Math.min(88, suppliedExplainabilityLayers * 5 + Math.min(20, ruleCount)),
      description: "Evaluates whether governance findings remain explainable across supplied review layers.",
      explainabilitySignals: [
        `Explainability layers supplied: ${suppliedExplainabilityLayers}.`,
        `Explainability rules supplied: ${ruleCount}.`,
        `Audit categories represented: ${auditCategories.length}.`,
      ],
      opacitySignals: suppliedExplainabilityLayers < 12 ? ["Layered explainability context is incomplete."] : [],
      recommendedHumanReview: "Review governance explainability across layers before relying on long-horizon explainability continuity.",
      factors: [`Explainability layers supplied: ${suppliedExplainabilityLayers}.`, `Rule count: ${ruleCount}.`],
      reasoning: ["Governance findings remain explainable when rules, drivers, limitations, evidence, and human-review notes stay visible."],
    }),
    createAreaAssessment({
      area: "audit_findings",
      baseScore: scoreFromStatus(input.auditResult?.auditClassification),
      description: "Evaluates whether audit findings preserve evidence, reasoning, factors, and human-review linkage.",
      explainabilitySignals: [
        `Audit classification: ${input.auditResult?.auditClassification ?? "not_supplied"}.`,
        `Audit findings: ${auditFindings.length}.`,
        `Complete audit findings: ${auditFindings.length - incompleteFindings.length}.`,
      ],
      opacitySignals: [
        ...(!input.auditResult ? ["Audit result was not supplied."] : []),
        ...incompleteFindings.map((finding) => `${finding.id}: incomplete explainability structure.`),
      ],
      recommendedHumanReview: "Review audit finding explainability before relying on audit continuity.",
      factors: [`Incomplete audit findings: ${incompleteFindings.length}.`],
      reasoning: ["Audit explainability depends on findings retaining evidence, factors, reasoning, and human-review notes."],
      findingCount: incompleteFindings.length,
    }),
    createAreaAssessment({
      area: "reasoning_structures",
      baseScore: Math.min(90, ruleCount * 2),
      description: "Evaluates whether reasoning structures remain visible across governance layers.",
      explainabilitySignals: [`Explainability rules supplied: ${ruleCount}.`],
      opacitySignals: ruleCount < 28 ? ["Explainability rule depth may be limited for future governance evolution."] : [],
      recommendedHumanReview: "Review reasoning structures before future governance expansion.",
      factors: [`Rule count: ${ruleCount}.`],
      reasoning: ["Reasoning continuity requires summaries, rules, drivers, and limitations to remain visible across layers."],
    }),
    createAreaAssessment({
      area: "evidence_visibility",
      baseScore: Math.min(
        90,
        scoreFromStatus(input.evidenceQualityResult?.overallReliabilityLevel) * 0.5 +
          scoreFromStatus(input.traceabilityResult?.traceabilityClassification) * 0.5,
      ),
      description: "Evaluates whether evidence visibility supports explainability continuity.",
      explainabilitySignals: [
        `Evidence reliability: ${input.evidenceQualityResult?.overallReliabilityLevel ?? "not_supplied"}.`,
        `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
        ...(input.evidenceQualityResult?.stabilizationSupportedAreas ?? []),
      ],
      opacitySignals: [
        ...(input.evidenceQualityResult?.missingEvidenceAreas ?? []),
        ...(input.traceabilityResult?.evidenceGaps ?? []),
      ],
      recommendedHumanReview: "Review evidence visibility before relying on explainability continuity.",
      factors: [`Evidence quality findings: ${input.evidenceQualityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Explainability depends on evidence remaining visible, traceable, and limitation-aware."],
    }),
    createAreaAssessment({
      area: "scoring_visibility",
      baseScore: scoreFromStatus(input.semanticStabilityResult?.semanticStabilityClassification),
      description: "Evaluates whether scoring explainability and scoring semantics remain durable.",
      explainabilitySignals: [
        `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
        ...(input.normalizationResult?.scoringDriverConsistency ?? []),
      ],
      opacitySignals: [
        ...(input.semanticStabilityResult?.scoringSemanticFindings ?? []),
        ...(input.normalizationResult?.gaps
          .filter((gap) => gap.gapType === "scoring_driver_inconsistency")
          .map((gap) => gap.description) ?? []),
      ],
      recommendedHumanReview: "Review scoring explainability before future score or doctrine evolution.",
      factors: [`Scoring semantic findings: ${input.semanticStabilityResult?.scoringSemanticFindings.length ?? "not_supplied"}.`],
      reasoning: ["Scoring explainability is durable when score drivers remain deterministic, visible, and stable."],
    }),
    createAreaAssessment({
      area: "limitation_visibility",
      baseScore: (input.semanticStabilityResult?.limitationSemanticFindings.length ?? 1) === 0 ? 76 : 58,
      description: "Evaluates whether limitations remain visible enough to prevent unsupported interpretation.",
      explainabilitySignals: [
        `Audit limitations: ${input.auditResult?.limitations.length ?? "not_supplied"}.`,
        `Doctrine limitations: ${input.doctrineResult?.doctrineLimitations.length ?? "not_supplied"}.`,
        ...(input.auditHistorySurvivabilityResult?.explainability.limitations ?? []),
      ],
      opacitySignals: [
        ...(input.traceabilityResult?.limitationGaps ?? []),
        ...(input.semanticStabilityResult?.limitationSemanticFindings ?? []),
      ],
      recommendedHumanReview: "Review limitation visibility before relying on institutional explainability.",
      factors: [`Traceability limitation gaps: ${input.traceabilityResult?.limitationGaps.length ?? "not_supplied"}.`],
      reasoning: ["Limitation visibility keeps explainability grounded and reduces unsupported governance interpretation."],
    }),
    createAreaAssessment({
      area: "traceability_explainability",
      baseScore: scoreFromStatus(input.traceabilityResult?.traceabilityClassification),
      description: "Evaluates whether traceability explainability preserves reasoning links.",
      explainabilitySignals: [
        `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
        `Trace links: ${input.traceabilityResult?.traces.length ?? "not_supplied"}.`,
        ...(input.traceabilityResult?.traceStrengths ?? []),
      ],
      opacitySignals: input.traceabilityResult?.traceWeaknesses ?? ["Traceability result was not supplied."],
      recommendedHumanReview: "Review traceability explainability before relying on governance reconstruction.",
      factors: [`Traceability gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
      reasoning: ["Traceability explainability depends on evidence, source, reasoning, scoring, limitation, and recommendation links."],
      findingCount: input.traceabilityResult?.gaps.length ?? 1,
    }),
    createAreaAssessment({
      area: "survivability_explainability",
      baseScore: scoreFromStatus(input.survivabilityExpansionResult?.survivabilityClassification),
      description: "Evaluates whether survivability explainability remains visible under future expansion.",
      explainabilitySignals: [
        `Survivability: ${input.survivabilityExpansionResult?.survivabilityClassification ?? "not_supplied"}.`,
        ...(input.survivabilityExpansionResult?.durableArchitectureAreas ?? []),
      ],
      opacitySignals: input.survivabilityExpansionResult?.fragileExpansionAreas ?? ["Survivability result was not supplied."],
      recommendedHumanReview: "Review survivability explainability before future enterprise scaling.",
      factors: [`Survivability findings: ${input.survivabilityExpansionResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Survivability explainability is durable when expansion risks and durable architecture areas remain inspectable."],
    }),
    createAreaAssessment({
      area: "semantic_explainability",
      baseScore: scoreFromStatus(input.semanticStabilityResult?.semanticStabilityClassification),
      description: "Evaluates whether semantic explainability remains stable.",
      explainabilitySignals: [
        `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
        ...(input.semanticStabilityResult?.stableTerms.slice(0, 8) ?? []),
      ],
      opacitySignals: input.semanticStabilityResult?.unstableTerms ?? ["Semantic stability result was not supplied."],
      recommendedHumanReview: "Review semantic explainability before future registry, doctrine, or audit-history work.",
      factors: [`Semantic drift risks: ${input.semanticStabilityResult?.driftRisks.length ?? "not_supplied"}.`],
      reasoning: ["Semantic explainability is durable when terminology, classifications, and drift risks remain visible."],
    }),
    createAreaAssessment({
      area: "doctrine_explainability",
      baseScore: Math.min(
        90,
        scoreFromStatus(input.doctrineResult?.doctrineStatus) * 0.5 +
          scoreFromStatus(input.doctrineDurabilityResult?.doctrineDurabilityClassification) * 0.5,
      ),
      description: "Evaluates whether doctrine explainability remains reconstructable.",
      explainabilitySignals: [
        `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
        `Doctrine durability: ${input.doctrineDurabilityResult?.doctrineDurabilityClassification ?? "not_supplied"}.`,
        ...(input.doctrineDurabilityResult?.durableDoctrineAreas ?? []),
      ],
      opacitySignals: [
        ...(input.doctrineResult?.doctrineLimitations ?? []),
        ...(input.doctrineDurabilityResult?.fragileDoctrineAreas ?? []),
      ],
      recommendedHumanReview: "Review doctrine explainability before relying on governance reasoning continuity.",
      factors: [`Doctrine principles: ${input.doctrineResult?.principles.length ?? "not_supplied"}.`],
      reasoning: ["Doctrine explainability requires principles, evidence, drift, limitations, and recommendations to remain visible."],
    }),
    createAreaAssessment({
      area: "observability_explainability",
      baseScore: scoreFromStatus(input.observabilityDurabilityResult?.observabilityDurabilityClassification),
      description: "Evaluates whether observability explainability remains visible.",
      explainabilitySignals: [
        `Observability durability: ${input.observabilityDurabilityResult?.observabilityDurabilityClassification ?? "not_supplied"}.`,
        ...(input.observabilityDurabilityResult?.durableObservabilityAreas ?? []),
      ],
      opacitySignals: input.observabilityDurabilityResult?.fragileObservabilityAreas ?? ["Observability result was not supplied."],
      recommendedHumanReview: "Review observability explainability before future dashboards or observability growth.",
      factors: [`Observability findings: ${input.observabilityDurabilityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Observability explainability is durable when visible signals and blind spots remain inspectable."],
    }),
    createAreaAssessment({
      area: "reviewability_explainability",
      baseScore: scoreFromStatus(input.reviewabilityIntegrityResult?.reviewabilityClassification),
      description: "Evaluates whether reviewability explainability remains reconstructable.",
      explainabilitySignals: [
        `Reviewability: ${input.reviewabilityIntegrityResult?.reviewabilityClassification ?? "not_supplied"}.`,
        ...(input.reviewabilityIntegrityResult?.reviewableAreas ?? []),
      ],
      opacitySignals: input.reviewabilityIntegrityResult?.weakReviewabilityAreas ?? ["Reviewability result was not supplied."],
      recommendedHumanReview: "Review reviewability explainability before relying on long-horizon reasoning continuity.",
      factors: [`Reviewability findings: ${input.reviewabilityIntegrityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Reviewability explainability depends on reconstructable evidence, reasoning, limitations, and human-review notes."],
    }),
    createAreaAssessment({
      area: "institutional_memory_continuity",
      baseScore: scoreFromStatus(input.institutionalMemoryContinuityResult?.memoryContinuityClassification),
      description: "Evaluates whether institutional memory continuity preserves explainability.",
      explainabilitySignals: [
        `Memory continuity: ${input.institutionalMemoryContinuityResult?.memoryContinuityClassification ?? "not_supplied"}.`,
        ...(input.institutionalMemoryContinuityResult?.durableMemoryAreas ?? []),
      ],
      opacitySignals: input.institutionalMemoryContinuityResult?.fragileMemoryAreas ?? [
        "Institutional memory continuity result was not supplied.",
      ],
      recommendedHumanReview: "Review institutional memory explainability before future memory or audit-history storage work.",
      factors: [`Memory continuity findings: ${input.institutionalMemoryContinuityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Institutional explainability survives when memory continuity and audit-history continuity remain reconstructable."],
    }),
    createAreaAssessment({
      area: "lineage_continuity",
      baseScore: input.lineageResult?.lineageIntegrityScore ?? 38,
      description: "Evaluates whether lineage continuity preserves governance reasoning.",
      explainabilitySignals: [
        `Lineage integrity score: ${input.lineageResult?.lineageIntegrityScore ?? "not_supplied"}.`,
        `Lineage nodes: ${input.lineageResult?.nodes.length ?? "not_supplied"}.`,
        `Lineage edges: ${input.lineageResult?.edges.length ?? "not_supplied"}.`,
        ...(input.lineageResult?.governanceDependencyChains ?? []),
      ],
      opacitySignals: input.lineageResult?.weakLineageAreas ?? ["Lineage result was not supplied."],
      recommendedHumanReview: "Review lineage continuity before relying on governance reasoning reconstruction.",
      factors: [`Lineage recommendations: ${input.lineageResult?.recommendations.length ?? "not_supplied"}.`],
      reasoning: ["Lineage continuity helps reviewers reconstruct how governance reasoning evolved over time."],
    }),
  ];
};

const createFinding = (params: {
  findingType: GovernanceExplainabilityContinuityFindingType;
  area: GovernanceExplainabilityContinuityArea;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedAuditCategories?: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): GovernanceExplainabilityContinuityFinding => {
  const evidence = unique(params.evidence);
  const factors = unique(params.factors);

  return {
    id: `governance-explainability-continuity-${slug(params.findingType)}-${slug(params.area)}-${slug(params.description)}`,
    findingType: params.findingType,
    area: params.area,
    severity: params.severity,
    description: params.description,
    evidence,
    affectedAuditCategories: unique(params.affectedAuditCategories ?? []) as FullSystemGovernanceAuditCategory[],
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateExplainabilityContinuityFindingConfidence({
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

const buildFindings = (input: GovernanceExplainabilityContinuityInput): GovernanceExplainabilityContinuityFinding[] => {
  const findings: GovernanceExplainabilityContinuityFinding[] = [];
  const auditFindings = getAuditFindings(input);
  const incompleteFindings = incompleteAuditFindings(auditFindings);
  const ruleCount = countExplainabilityRules(input);
  const auditCategories = unique([
    ...auditFindings.map((finding) => finding.category),
    ...Object.keys(input.auditResult?.categoryScores ?? {}),
    ...(input.traceabilityResult?.traces.map((trace) => trace.auditCategory) ?? []),
  ]) as FullSystemGovernanceAuditCategory[];
  const suppliedExplainabilityLayers = countSupplied([
    input.auditHistorySurvivabilityResult,
    input.institutionalMemoryContinuityResult,
    input.lifecycleContinuityResult,
    input.reviewabilityIntegrityResult,
    input.observabilityDurabilityResult,
    input.semanticStabilityResult,
    input.traceabilityResult,
    input.auditResult,
    input.lineageResult,
    input.evidenceQualityResult,
  ]);

  if (!input.semanticStabilityResult || ["unstable", "mostly_stable"].includes(input.semanticStabilityResult.semanticStabilityClassification)) {
    findings.push(
      createFinding({
        findingType: "explainability_drift",
        area: "semantic_explainability",
        severity: !input.semanticStabilityResult || input.semanticStabilityResult.semanticStabilityClassification === "unstable" ? "elevated" : "moderate",
        description: "Explainability continuity has semantic drift risk or missing semantic stability context.",
        evidence: [
          `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
          ...(input.semanticStabilityResult?.driftRisks.slice(0, 8) ?? []),
        ],
        recommendedHumanReview: "Review semantic explainability drift before relying on long-horizon explainability continuity.",
        factors: [`Semantic findings: ${input.semanticStabilityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Explainability can drift when governance language and classification meaning are not stable."],
      }),
    );
  }

  if (ruleCount < 28 || incompleteFindings.length > 0) {
    findings.push(
      createFinding({
        findingType: "reasoning_fragmentation",
        area: "reasoning_structures",
        severity: ruleCount < 16 || incompleteFindings.length >= 4 ? "elevated" : "moderate",
        description: "Reasoning structures are incomplete or fragmented across supplied governance layers.",
        evidence: [`Explainability rules supplied: ${ruleCount}.`, `Incomplete audit findings: ${incompleteFindings.length}.`],
        affectedAuditCategories: incompleteFindings.map((finding) => finding.category),
        recommendedHumanReview: "Review reasoning structures, rules, factors, and audit finding explainability before relying on reconstruction.",
        factors: ["Reasoning continuity requires visible rules, factors, reasoning, summaries, and limitations."],
        reasoning: ["Reasoning fragmentation makes governance outputs harder to reconstruct for human reviewers."],
      }),
    );
  }

  if (!input.evidenceQualityResult || !input.traceabilityResult || input.evidenceQualityResult.missingEvidenceAreas.length > 0) {
    findings.push(
      createFinding({
        findingType: "evidence_visibility_gap",
        area: "evidence_visibility",
        severity: !input.evidenceQualityResult || !input.traceabilityResult ? "elevated" : "moderate",
        description: "Evidence visibility is missing or has evidence gaps.",
        evidence: [
          `Evidence quality supplied: ${Boolean(input.evidenceQualityResult)}.`,
          `Traceability supplied: ${Boolean(input.traceabilityResult)}.`,
          ...(input.evidenceQualityResult?.missingEvidenceAreas ?? []),
          ...(input.traceabilityResult?.evidenceGaps ?? []),
        ],
        recommendedHumanReview: "Review evidence quality and traceability before relying on explainability continuity.",
        factors: ["Evidence visibility requires both evidence quality and traceability context."],
        reasoning: ["Explainability is weaker when reviewers cannot see the evidence behind reasoning and scores."],
      }),
    );
  }

  if (
    (input.semanticStabilityResult?.scoringSemanticFindings.length ?? 0) > 0 ||
    (input.normalizationResult?.gaps.some((gap) => gap.gapType === "scoring_driver_inconsistency") ?? false)
  ) {
    findings.push(
      createFinding({
        findingType: "scoring_explainability_degradation",
        area: "scoring_visibility",
        severity: "moderate",
        description: "Scoring explainability has semantic or scoring-driver consistency findings.",
        evidence: [
          ...(input.semanticStabilityResult?.scoringSemanticFindings ?? []),
          ...(input.normalizationResult?.gaps
            .filter((gap) => gap.gapType === "scoring_driver_inconsistency")
            .map((gap) => gap.description) ?? []),
        ],
        recommendedHumanReview: "Review scoring semantics and scoring-driver consistency before relying on score explainability.",
        factors: ["Scoring explainability depends on stable score-driver terminology and deterministic scoring rules."],
        reasoning: ["Score explanations degrade when scoring drivers or scoring semantics become inconsistent."],
      }),
    );
  }

  if (
    (input.traceabilityResult?.limitationGaps.length ?? 0) > 0 ||
    (input.semanticStabilityResult?.limitationSemanticFindings.length ?? 0) > 0 ||
    !input.auditResult
  ) {
    findings.push(
      createFinding({
        findingType: "limitation_visibility_degradation",
        area: "limitation_visibility",
        severity: !input.auditResult ? "elevated" : "moderate",
        description: "Limitation visibility is incomplete or degraded.",
        evidence: [
          ...(input.traceabilityResult?.limitationGaps ?? []),
          ...(input.semanticStabilityResult?.limitationSemanticFindings ?? []),
          ...(!input.auditResult ? ["Audit result was not supplied for limitation review."] : []),
        ],
        recommendedHumanReview: "Review limitation visibility before relying on institutional explainability.",
        factors: ["Limitations must remain attached to evidence, findings, scores, and recommendations."],
        reasoning: ["Explainability can become misleading when limitations are not visible to human reviewers."],
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
        findingType: "traceability_explainability_gap",
        area: "traceability_explainability",
        severity: !input.traceabilityResult || input.traceabilityResult.traceabilityClassification === "weak" ? "elevated" : "moderate",
        description: "Traceability explainability is missing, limited, or has gaps.",
        evidence: [
          `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
          ...(input.traceabilityResult?.gaps.map((gap) => gap.description).slice(0, 8) ?? []),
        ],
        affectedAuditCategories: auditCategories,
        recommendedHumanReview: "Review traceability explainability before relying on governance reconstruction.",
        factors: [`Traceability gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
        reasoning: ["Traceability explainability connects evidence, source, scoring, reasoning, limitations, and recommendations."],
      }),
    );
  }

  if (!input.semanticStabilityResult || (input.semanticStabilityResult.traceabilitySemanticFindings.length ?? 0) > 0) {
    findings.push(
      createFinding({
        findingType: "semantic_explainability_instability",
        area: "semantic_explainability",
        severity: !input.semanticStabilityResult ? "elevated" : "moderate",
        description: "Semantic explainability is missing or has traceability terminology findings.",
        evidence: [
          `Semantic stability supplied: ${Boolean(input.semanticStabilityResult)}.`,
          ...(input.semanticStabilityResult?.traceabilitySemanticFindings ?? []),
        ],
        recommendedHumanReview: "Review semantic explainability before future traceability or doctrine expansion.",
        factors: ["Semantic explainability depends on stable terminology across traceability, doctrine, evidence, and audit categories."],
        reasoning: ["Semantic instability makes explanations harder to compare across governance periods."],
      }),
    );
  }

  if (!input.auditResult || incompleteFindings.length > 0 || (input.auditHistorySurvivabilityResult?.fragileAuditHistoryAreas.length ?? 0) > 0) {
    findings.push(
      createFinding({
        findingType: "audit_explainability_fragmentation",
        area: "audit_findings",
        severity: !input.auditResult ? "elevated" : "moderate",
        description: "Audit explainability is missing or fragmented.",
        evidence: [
          `Audit supplied: ${Boolean(input.auditResult)}.`,
          `Incomplete audit findings: ${incompleteFindings.length}.`,
          ...(input.auditHistorySurvivabilityResult?.fragileAuditHistoryAreas ?? []),
        ],
        affectedAuditCategories: auditCategories,
        recommendedHumanReview: "Review audit explainability and audit-history survivability before relying on institutional audit defensibility.",
        factors: ["Audit explainability requires findings, evidence, reasoning, limitations, and audit-history survivability."],
        reasoning: ["Audit explanations fragment when audit findings or audit-history continuity cannot be reconstructed."],
      }),
    );
  }

  if (
    !input.observabilityDurabilityResult ||
    (input.observabilityDurabilityResult.explainabilityVisibilityFindings.length ?? 0) > 0 ||
    ["fragile", "conditionally_observable"].includes(input.observabilityDurabilityResult.observabilityDurabilityClassification)
  ) {
    findings.push(
      createFinding({
        findingType: "observability_explainability_gap",
        area: "observability_explainability",
        severity:
          !input.observabilityDurabilityResult ||
          input.observabilityDurabilityResult.observabilityDurabilityClassification === "fragile"
            ? "elevated"
            : "moderate",
        description: "Observability explainability is missing, fragile, or has explainability visibility findings.",
        evidence: [
          `Observability durability: ${input.observabilityDurabilityResult?.observabilityDurabilityClassification ?? "not_supplied"}.`,
          ...(input.observabilityDurabilityResult?.explainabilityVisibilityFindings ?? []),
        ],
        recommendedHumanReview: "Review observability explainability before future dashboard or governance visibility expansion.",
        factors: [`Observability findings: ${input.observabilityDurabilityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Explainability continuity weakens when reviewers cannot observe how explanations were produced."],
      }),
    );
  }

  if (
    !input.institutionalMemoryContinuityResult ||
    !input.auditHistorySurvivabilityResult ||
    ["fragmented", "partially_reconstructable"].includes(input.institutionalMemoryContinuityResult.memoryContinuityClassification)
  ) {
    findings.push(
      createFinding({
        findingType: "institutional_explainability_survivability_risk",
        area: "institutional_memory_continuity",
        severity:
          !input.institutionalMemoryContinuityResult ||
          input.institutionalMemoryContinuityResult.memoryContinuityClassification === "fragmented"
            ? "elevated"
            : "moderate",
        description: "Institutional explainability survivability context is incomplete or not yet strongly reconstructable.",
        evidence: [
          `Memory continuity: ${input.institutionalMemoryContinuityResult?.memoryContinuityClassification ?? "not_supplied"}.`,
          `Audit-history survivability supplied: ${Boolean(input.auditHistorySurvivabilityResult)}.`,
        ],
        recommendedHumanReview: "Review institutional memory and audit-history survivability before relying on long-horizon explainability.",
        factors: ["Institutional explainability depends on durable memory and audit-history reconstruction."],
        reasoning: ["Institutional explainability becomes less durable when memory or audit history cannot be reconstructed."],
      }),
    );
  }

  if (suppliedExplainabilityLayers < 8 || ruleCount < 20) {
    findings.push(
      createFinding({
        findingType: "governance_opacity_risk",
        area: "governance_findings",
        severity: suppliedExplainabilityLayers < 5 || ruleCount < 12 ? "elevated" : "moderate",
        description: "Governance explainability context is incomplete enough to create opacity risk.",
        evidence: [`Explainability layers supplied: ${suppliedExplainabilityLayers}.`, `Explainability rules supplied: ${ruleCount}.`],
        recommendedHumanReview: "Supply core explainability, audit, traceability, reviewability, memory, lineage, and evidence context before relying on explainability continuity.",
        factors: ["Opacity risk is evaluated from missing layers and limited rule depth."],
        reasoning: ["Governance opacity grows when reviewers cannot inspect the rules, evidence, drivers, and limitations behind outputs."],
      }),
    );
  }

  if (
    !input.reviewabilityIntegrityResult ||
    ["weak", "partially_reviewable"].includes(input.reviewabilityIntegrityResult.reviewabilityClassification)
  ) {
    findings.push(
      createFinding({
        findingType: "reviewability_degradation_risk",
        area: "reviewability_explainability",
        severity: !input.reviewabilityIntegrityResult || input.reviewabilityIntegrityResult.reviewabilityClassification === "weak" ? "elevated" : "moderate",
        description: "Reviewability explainability is missing or not yet strongly reconstructable.",
        evidence: [
          `Reviewability: ${input.reviewabilityIntegrityResult?.reviewabilityClassification ?? "not_supplied"}.`,
          ...(input.reviewabilityIntegrityResult?.reconstructionRisks ?? []),
        ],
        recommendedHumanReview: "Review reviewability explainability before relying on governance reasoning reconstruction.",
        factors: [`Reviewability findings: ${input.reviewabilityIntegrityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Explainability continuity depends on reviewability continuity and reconstruction integrity."],
      }),
    );
  }

  if (!metadataString(input, "explainabilityVersion") || !input.lineageResult || !input.auditHistorySurvivabilityResult) {
    findings.push(
      createFinding({
        findingType: "long_horizon_explainability_continuity_risk",
        area: "lineage_continuity",
        severity: !input.lineageResult || !input.auditHistorySurvivabilityResult ? "elevated" : "moderate",
        description: "Long-horizon explainability continuity needs stronger lineage, audit-history, or explainabilityVersion context.",
        evidence: [
          `explainabilityVersion: ${metadataString(input, "explainabilityVersion") ?? "not_supplied"}.`,
          `Lineage supplied: ${Boolean(input.lineageResult)}.`,
          `Audit-history survivability supplied: ${Boolean(input.auditHistorySurvivabilityResult)}.`,
        ],
        recommendedHumanReview: "Review explainability version metadata, lineage, and audit-history survivability before future traceability work.",
        factors: ["Long-horizon explainability continuity is evaluated without persistence or reasoning mutation."],
        reasoning: ["Long-horizon explanations are easier to preserve when version context, lineage, and audit-history survivability are explicit."],
      }),
    );
  }

  return findings;
};

export function analyzeGovernanceExplainabilityContinuity(
  input: GovernanceExplainabilityContinuityInput,
): GovernanceExplainabilityContinuityResult {
  const areaAssessments = buildAreaAssessments(input);
  const findings = buildFindings(input);
  const explainabilityContinuityScore = calculateOverallExplainabilityContinuityScore({
    areaAssessments,
    findings,
  });
  const resultWithoutExplainability = {
    explainabilityContinuityScore,
    explainabilityContinuityClassification: explainabilityContinuityClassificationFromScore(explainabilityContinuityScore),
    areaAssessments,
    findings,
    durableExplainabilityAreas: unique(
      areaAssessments
        .filter(
          (assessment) =>
            assessment.classification === "explainable" || assessment.classification === "institutionally_explainable",
        )
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    fragileExplainabilityAreas: unique(
      areaAssessments
        .filter(
          (assessment) => assessment.classification === "opaque" || assessment.classification === "partially_explainable",
        )
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    reasoningContinuityFindings: unique(
      findings
        .filter((finding) => finding.findingType === "reasoning_fragmentation" || finding.findingType === "explainability_drift")
        .map((finding) => finding.description),
    ),
    evidenceVisibilityFindings: unique(
      findings.filter((finding) => finding.findingType === "evidence_visibility_gap").map((finding) => finding.description),
    ),
    scoringExplainabilityFindings: unique(
      findings
        .filter((finding) => finding.findingType === "scoring_explainability_degradation")
        .map((finding) => finding.description),
    ),
    limitationVisibilityFindings: unique(
      findings
        .filter((finding) => finding.findingType === "limitation_visibility_degradation")
        .map((finding) => finding.description),
    ),
    traceabilityExplainabilityFindings: unique(
      findings
        .filter((finding) => finding.findingType === "traceability_explainability_gap")
        .map((finding) => finding.description),
    ),
    semanticExplainabilityFindings: unique(
      findings
        .filter(
          (finding) =>
            finding.findingType === "semantic_explainability_instability" || finding.findingType === "explainability_drift",
        )
        .map((finding) => finding.description),
    ),
    auditExplainabilityFindings: unique(
      findings
        .filter((finding) => finding.findingType === "audit_explainability_fragmentation")
        .map((finding) => finding.description),
    ),
    institutionalExplainabilityFindings: unique(
      findings
        .filter(
          (finding) =>
            finding.findingType === "institutional_explainability_survivability_risk" ||
            finding.findingType === "governance_opacity_risk",
        )
        .map((finding) => finding.description),
    ),
    reconstructionContinuityFindings: unique(
      findings
        .filter((finding) =>
          [
            "reasoning_fragmentation",
            "traceability_explainability_gap",
            "reviewability_degradation_risk",
            "long_horizon_explainability_continuity_risk",
            "audit_explainability_fragmentation",
          ].includes(finding.findingType),
        )
        .map((finding) => finding.description),
    ),
    humanReviewNotes: unique([
      ...findings.map((finding) => finding.recommendedHumanReview),
      ...(input.auditHistorySurvivabilityResult?.humanReviewNotes ?? []),
      ...(input.institutionalMemoryContinuityResult?.humanReviewNotes ?? []),
      ...(input.lifecycleContinuityResult?.humanReviewNotes ?? []),
      "Do not mutate explainability structures, rewrite reasoning, redesign governance architecture, centralize explainability control, introduce governance automation, add execution systems, implement persistence, rewrite governance outputs, enforce policy, or trigger orchestration during this review-only stage.",
      "Keep future explainability, traceability, audit history, memory, lifecycle, versioning, compatibility, registry, and observability integrations separate from pure governance review engines.",
    ]),
    futureStabilizationRecommendations: [
      "Prepare Governance Traceability Survivability Review before any persistence, explainability mutation, traceability storage, governance history tooling, or lifecycle automation.",
      "Review explainability continuity with audit-history survivability, institutional memory continuity, lifecycle continuity, versioning readiness, reviewability, observability, semantic stability, traceability, audit, doctrine, memory, lineage, continuity, and evidence context supplied together.",
      "Review explainabilityVersion metadata before future explainability versioning or traceability survivability work.",
      "Preserve read-only explainability boundaries and human-review requirements before future observability or storage design.",
      "Consider shared deterministic explainability helper utilities only after traceability survivability confirms stable contracts.",
      ...(input.auditHistorySurvivabilityResult?.futureStabilizationRecommendations ?? []),
      ...(input.institutionalMemoryContinuityResult?.futureStabilizationRecommendations ?? []),
      ...(input.lifecycleContinuityResult?.futureStabilizationRecommendations ?? []),
    ],
    humanReviewRequired:
      findings.length > 0 ||
      areaAssessments.some(
        (assessment) => assessment.classification === "opaque" || assessment.classification === "partially_explainable",
      ),
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernanceExplainabilityContinuityExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}

export const getGovernanceExplainabilityContinuityReview = analyzeGovernanceExplainabilityContinuity;
