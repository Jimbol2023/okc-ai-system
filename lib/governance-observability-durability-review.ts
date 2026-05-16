import { buildGovernanceObservabilityDurabilityExplainability } from "./governance-observability-durability-review-explainability";
import {
  calculateObservabilityAreaScore,
  calculateObservabilityDurabilityScore,
  calculateObservabilityFindingConfidence,
  calculateObservabilityScalabilityScore,
  observabilityDurabilityClassificationFromScore,
} from "./governance-observability-durability-review-scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
  FullSystemGovernanceAuditResult,
} from "./full-system-governance-audit-types";
import type {
  GovernanceObservabilityDurabilityArea,
  GovernanceObservabilityDurabilityAreaAssessment,
  GovernanceObservabilityDurabilityFinding,
  GovernanceObservabilityDurabilityFindingType,
  GovernanceObservabilityDurabilityInput,
  GovernanceObservabilityDurabilityResult,
} from "./governance-observability-durability-review-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const getAuditResult = (input: GovernanceObservabilityDurabilityInput): FullSystemGovernanceAuditResult | undefined =>
  input.auditResult ?? input.auditPreview?.result;

const getAuditFindings = (input: GovernanceObservabilityDurabilityInput): FullSystemGovernanceAuditFinding[] =>
  input.auditFindings ?? getAuditResult(input)?.findings ?? [];

const getRecommendations = (input: GovernanceObservabilityDurabilityInput): FullSystemGovernanceAuditRecommendation[] =>
  input.recommendations ?? getAuditResult(input)?.recommendations ?? [];

const countSupplied = (items: unknown[]): number => items.filter(Boolean).length;

const scoreFromStatus = (status: string | undefined): number => {
  if (!status) return 38;
  if (
    [
      "institutionally_observable",
      "institutionally_scalable",
      "institutionally_durable",
      "institutionally_stable",
      "institutionally_registry_ready",
      "institutionally_consistent",
      "institutionally_traceable",
      "institutionally_ready",
      "institutionally_strong",
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

const observabilityVersionSupplied = (input: GovernanceObservabilityDurabilityInput): boolean =>
  ["observabilityVersion", "semanticVersion", "registryVersion", "taxonomyVersion"].some(
    (key) => typeof input.metadata?.[key] === "string",
  );

const createAreaAssessment = (params: {
  area: GovernanceObservabilityDurabilityArea;
  baseScore: number;
  description: string;
  visibleSignals: string[];
  blindSpots: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  findingCount?: number;
}): GovernanceObservabilityDurabilityAreaAssessment => {
  const visibleSignals = unique(params.visibleSignals);
  const blindSpots = unique(params.blindSpots);
  const factors = unique(params.factors);
  const score = calculateObservabilityAreaScore({
    baseScore: params.baseScore,
    visibleSignalCount: visibleSignals.length,
    blindSpotCount: blindSpots.length,
    findingCount: params.findingCount ?? 0,
    explainabilityCount: factors.length + params.reasoning.length,
  });

  return {
    area: params.area,
    score,
    classification: observabilityDurabilityClassificationFromScore(score),
    description: params.description,
    visibleSignals,
    blindSpots,
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors,
      reasoning: params.reasoning,
    },
  };
};

const buildAreaAssessments = (
  input: GovernanceObservabilityDurabilityInput,
): GovernanceObservabilityDurabilityAreaAssessment[] => {
  const auditResult = getAuditResult(input);
  const auditFindings = getAuditFindings(input);
  const recommendations = getRecommendations(input);
  const auditCategories = unique([
    ...auditFindings.map((finding) => finding.category),
    ...recommendations.map((recommendation) => recommendation.category),
    ...Object.keys(auditResult?.categoryScores ?? {}),
    ...(input.normalizationResult?.mappings.flatMap((mapping) => mapping.auditCategories) ?? []),
    ...(input.traceabilityResult?.traces.map((trace) => trace.auditCategory) ?? []),
  ]);
  const suppliedCoreLayers = countSupplied([
    input.survivabilityExpansionResult,
    input.doctrineDurabilityResult,
    input.semanticStabilityResult,
    input.registryReviewResult,
    input.normalizationResult,
    input.traceabilityResult,
    auditResult,
    input.readinessResult,
    input.assuranceResult,
    input.doctrineResult,
    input.memoryResult,
    input.lineageResult,
    input.resilienceResult,
    input.continuityResult,
    input.evidenceQualityResult,
  ]);
  const explainabilityRuleCount =
    (input.survivabilityExpansionResult?.explainability.survivabilityRulesApplied.length ?? 0) +
    (input.doctrineDurabilityResult?.explainability.doctrineDurabilityRulesApplied.length ?? 0) +
    (input.semanticStabilityResult?.explainability.semanticStabilityRulesApplied.length ?? 0) +
    (input.registryReviewResult?.explainability.registryReviewRulesApplied.length ?? 0) +
    (input.normalizationResult?.explainability.normalizationRulesApplied.length ?? 0) +
    (input.traceabilityResult?.explainability.traceabilityRulesApplied.length ?? 0) +
    (auditResult?.explainability.auditRulesApplied.length ?? 0) +
    (input.readinessResult?.explainability.readinessRulesApplied.length ?? 0) +
    (input.assuranceResult?.explainability.assuranceRulesApplied.length ?? 0);

  return [
    createAreaAssessment({
      area: "governance_dashboards",
      baseScore: input.auditPreview ? 72 : 44,
      description: "Evaluates whether existing read-only dashboard preview context supports durable governance visibility.",
      visibleSignals: [
        ...(input.auditPreview ? [input.auditPreview.previewNotice, input.auditPreview.sourceLabel] : []),
        ...(auditResult ? [`Audit classification visible: ${auditResult.auditClassification}.`] : []),
      ],
      blindSpots: input.auditPreview ? [] : ["Read-only governance audit preview was not supplied."],
      recommendedHumanReview: "Review dashboard preview visibility before future dashboard growth.",
      factors: [`Audit preview supplied: ${Boolean(input.auditPreview)}.`],
      reasoning: ["Dashboard observability is more durable when reviewers can inspect read-only audit context without execution side effects."],
    }),
    createAreaAssessment({
      area: "audit_visibility",
      baseScore: scoreFromStatus(auditResult?.auditClassification),
      description: "Evaluates whether audit findings, category scores, risks, limitations, and recommendations remain visible.",
      visibleSignals: [
        `Audit classification: ${auditResult?.auditClassification ?? "not_supplied"}.`,
        `Audit categories represented: ${auditCategories.length}.`,
        `Audit findings: ${auditFindings.length}.`,
        `Audit recommendations: ${recommendations.length}.`,
      ],
      blindSpots: auditResult ? auditResult.limitations : ["Full system governance audit result was not supplied."],
      recommendedHumanReview: "Review audit visibility before future audit complexity or dashboard scaling.",
      factors: [`Audit category count: ${auditCategories.length}.`],
      reasoning: ["Audit visibility is durable when scores, findings, evidence, risks, limitations, and recommendations remain inspectable."],
    }),
    createAreaAssessment({
      area: "traceability_visibility",
      baseScore: scoreFromStatus(input.traceabilityResult?.traceabilityClassification),
      description: "Evaluates whether evidence traceability remains visible under future traceability expansion.",
      visibleSignals: [
        `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
        `Trace links: ${input.traceabilityResult?.traces.length ?? "not_supplied"}.`,
        ...(input.traceabilityResult?.traceStrengths ?? []),
      ],
      blindSpots: input.traceabilityResult?.evidenceGaps ?? ["Traceability result was not supplied."],
      recommendedHumanReview: "Review traceability gaps before future evidence or observability expansion.",
      factors: [`Traceability gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
      reasoning: ["Traceability visibility is durable when evidence, source, scoring, reasoning, limitation, and recommendation links are inspectable."],
      findingCount: input.traceabilityResult?.gaps.length ?? 1,
    }),
    createAreaAssessment({
      area: "explainability_visibility",
      baseScore: Math.min(88, explainabilityRuleCount * 2),
      description: "Evaluates whether explainability rules, drivers, and limitations remain visible across governance layers.",
      visibleSignals: [`Explainability rules supplied across layers: ${explainabilityRuleCount}.`],
      blindSpots: explainabilityRuleCount < 20 ? ["Explainability rule depth may be limited for future observability systems."] : [],
      recommendedHumanReview: "Review explainability depth before future observability growth.",
      factors: [`Explainability rule count: ${explainabilityRuleCount}.`],
      reasoning: ["Explainability visibility is durable when rules, drivers, limitations, and summaries are consistently available."],
    }),
    createAreaAssessment({
      area: "survivability_visibility",
      baseScore: scoreFromStatus(input.survivabilityExpansionResult?.survivabilityClassification),
      description: "Evaluates whether survivability and expansion risks remain visible.",
      visibleSignals: [
        `Survivability classification: ${input.survivabilityExpansionResult?.survivabilityClassification ?? "not_supplied"}.`,
        `Expansion classification: ${input.survivabilityExpansionResult?.expansionClassification ?? "not_supplied"}.`,
        ...(input.survivabilityExpansionResult?.durableArchitectureAreas ?? []),
      ],
      blindSpots: input.survivabilityExpansionResult?.fragileExpansionAreas ?? ["Survivability and expansion review result was not supplied."],
      recommendedHumanReview: "Review survivability visibility before future enterprise scaling.",
      factors: [`Survivability findings: ${input.survivabilityExpansionResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Survivability visibility is durable when growth risks and durable architecture areas remain inspectable."],
    }),
    createAreaAssessment({
      area: "orchestration_visibility",
      baseScore: 78 - Math.min(28, (auditResult?.orchestrationContaminationRisks.length ?? 0) * 7),
      description: "Evaluates whether orchestration risks remain visible without coupling review engines to execution.",
      visibleSignals: [
        "Observability durability review adds no execution pathway.",
        `Orchestration contamination risks: ${auditResult?.orchestrationContaminationRisks.length ?? "not_supplied"}.`,
        `Hidden execution pathway risks: ${auditResult?.hiddenExecutionPathwayRisks.length ?? "not_supplied"}.`,
      ],
      blindSpots: auditResult?.orchestrationContaminationRisks ?? ["Audit orchestration risk context was not supplied."],
      recommendedHumanReview: "Review orchestration visibility before future orchestration growth.",
      factors: ["Read-only orchestration isolation preserved."],
      reasoning: ["Orchestration visibility is durable when risks are visible but review layers remain separate from execution systems."],
    }),
    createAreaAssessment({
      area: "semantic_visibility",
      baseScore: scoreFromStatus(input.semanticStabilityResult?.semanticStabilityClassification),
      description: "Evaluates whether semantic stability, drift, and unstable terms remain visible.",
      visibleSignals: [
        `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
        ...(input.semanticStabilityResult?.stableTerms.slice(0, 8) ?? []),
      ],
      blindSpots: input.semanticStabilityResult?.unstableTerms ?? ["Semantic stability result was not supplied."],
      recommendedHumanReview: "Review semantic visibility before registry, taxonomy, or dashboard expansion.",
      factors: [`Semantic findings: ${input.semanticStabilityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Semantic visibility is durable when stable terms, unstable terms, drift, and limitations remain inspectable."],
    }),
    createAreaAssessment({
      area: "registry_readiness_visibility",
      baseScore: scoreFromStatus(input.registryReviewResult?.registryReadinessClassification),
      description: "Evaluates whether registry readiness implications remain visible without creating a registry.",
      visibleSignals: [
        `Registry readiness: ${input.registryReviewResult?.registryReadinessClassification ?? "not_supplied"}.`,
        ...(input.registryReviewResult?.futureRegistryRecommendations ?? []),
      ],
      blindSpots: input.registryReviewResult?.reviewLimitations ?? ["Registry review result was not supplied."],
      recommendedHumanReview: "Review registry readiness visibility before any future registry adoption.",
      factors: [`Registry findings: ${input.registryReviewResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Registry readiness visibility is durable when readiness remains review-only and future-facing."],
    }),
    createAreaAssessment({
      area: "normalization_visibility",
      baseScore: scoreFromStatus(input.normalizationResult?.normalizationClassification),
      description: "Evaluates whether principle-to-evidence normalization visibility remains durable.",
      visibleSignals: [
        `Normalization classification: ${input.normalizationResult?.normalizationClassification ?? "not_supplied"}.`,
        `Normalization score: ${input.normalizationResult?.normalizationScore ?? "not_supplied"}.`,
        ...(input.normalizationResult?.principleMappingStrength ?? []),
      ],
      blindSpots: input.normalizationResult?.missingMappings ?? ["Normalization result was not supplied."],
      recommendedHumanReview: "Review normalization visibility before future taxonomy or registry work.",
      factors: [`Normalization gaps: ${input.normalizationResult?.gaps.length ?? "not_supplied"}.`],
      reasoning: ["Normalization visibility is durable when mappings, weak links, gaps, and semantic drift risks remain inspectable."],
    }),
    createAreaAssessment({
      area: "doctrine_visibility",
      baseScore: scoreFromStatus(input.doctrineResult?.doctrineStatus),
      description: "Evaluates whether doctrine principles, limits, and recommendations remain visible.",
      visibleSignals: [
        `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
        ...(input.doctrineResult?.principles.map((principle) => `${principle.principleType}: ${principle.title}.`) ?? []),
      ],
      blindSpots: input.doctrineResult?.doctrineLimitations ?? ["Doctrine result was not supplied."],
      recommendedHumanReview: "Review doctrine visibility before future governance layers.",
      factors: [`Doctrine principles: ${input.doctrineResult?.principles.length ?? "not_supplied"}.`],
      reasoning: ["Doctrine visibility is durable when principles, recommendations, limitations, and drift remain visible."],
    }),
    createAreaAssessment({
      area: "continuity_visibility",
      baseScore: scoreFromStatus(input.continuityResult?.continuityStatus),
      description: "Evaluates whether continuity status, drift, and reviewability remain visible.",
      visibleSignals: [
        `Continuity status: ${input.continuityResult?.continuityStatus ?? "not_supplied"}.`,
        `Continuity score: ${input.continuityResult?.governanceContinuityScore ?? "not_supplied"}.`,
        input.continuityResult?.reviewabilityAssessment ?? "",
      ],
      blindSpots: input.continuityResult?.continuityWeaknesses ?? ["Continuity result was not supplied."],
      recommendedHumanReview: "Review continuity visibility before future expansion.",
      factors: [`Continuity drift findings: ${input.continuityResult?.driftFindings.length ?? "not_supplied"}.`],
      reasoning: ["Continuity visibility is durable when drift, reviewability, and continuity indicators remain inspectable."],
    }),
    createAreaAssessment({
      area: "resilience_visibility",
      baseScore: scoreFromStatus(input.resilienceResult?.resilienceStatus),
      description: "Evaluates whether resilience and fragility indicators remain visible.",
      visibleSignals: [
        `Resilience status: ${input.resilienceResult?.resilienceStatus ?? "not_supplied"}.`,
        `Resilience score: ${input.resilienceResult?.governanceResilienceScore ?? "not_supplied"}.`,
        ...(input.resilienceResult?.resilienceStrengths ?? []),
      ],
      blindSpots: input.resilienceResult?.resilienceWeaknesses ?? ["Resilience result was not supplied."],
      recommendedHumanReview: "Review resilience visibility before future pressure or module growth.",
      factors: [`Fragility indicators: ${input.resilienceResult?.fragilityIndicators.length ?? "not_supplied"}.`],
      reasoning: ["Resilience visibility is durable when strengths, weaknesses, recovery indicators, and fragility indicators remain reviewable."],
    }),
    createAreaAssessment({
      area: "recommendation_visibility",
      baseScore: recommendations.length + (input.doctrineResult?.recommendations.length ?? 0) > 0 ? 72 : 42,
      description: "Evaluates whether recommendations stay visible, neutral, and human-review oriented.",
      visibleSignals: [
        `Audit recommendations: ${recommendations.length}.`,
        `Doctrine recommendations: ${input.doctrineResult?.recommendations.length ?? "not_supplied"}.`,
        ...(input.readinessResult?.recommendations ?? []),
      ],
      blindSpots: input.semanticStabilityResult?.recommendationSemanticFindings ?? [],
      recommendedHumanReview: "Review recommendation visibility before future dashboard or agent growth.",
      factors: [`Recommendation semantic findings: ${input.semanticStabilityResult?.recommendationSemanticFindings.length ?? "not_supplied"}.`],
      reasoning: ["Recommendation visibility is durable when recommendations remain traceable, neutral, and human-review only."],
    }),
    createAreaAssessment({
      area: "limitation_visibility",
      baseScore: (input.semanticStabilityResult?.limitationSemanticFindings.length ?? 1) === 0 ? 76 : 58,
      description: "Evaluates whether limitations remain visible enough to preserve reviewability.",
      visibleSignals: [
        `Audit limitations: ${auditResult?.limitations.length ?? "not_supplied"}.`,
        `Doctrine limitations: ${input.doctrineResult?.doctrineLimitations.length ?? "not_supplied"}.`,
      ],
      blindSpots: [
        ...(input.semanticStabilityResult?.limitationSemanticFindings ?? []),
        ...(!auditResult ? ["Audit limitations were not supplied."] : []),
      ],
      recommendedHumanReview: "Review limitation visibility before future governance observability growth.",
      factors: [`Limitation semantic findings: ${input.semanticStabilityResult?.limitationSemanticFindings.length ?? "not_supplied"}.`],
      reasoning: ["Limitation visibility is durable when boundaries and caveats stay attached to audit, doctrine, traceability, and recommendations."],
    }),
    createAreaAssessment({
      area: "evidence_visibility",
      baseScore: Math.min(
        90,
        scoreFromStatus(input.evidenceQualityResult?.overallReliabilityLevel) * 0.5 +
          scoreFromStatus(input.traceabilityResult?.traceabilityClassification) * 0.5,
      ),
      description: "Evaluates whether evidence quality and evidence traceability remain visible.",
      visibleSignals: [
        `Evidence reliability: ${input.evidenceQualityResult?.overallReliabilityLevel ?? "not_supplied"}.`,
        `Evidence quality score: ${input.evidenceQualityResult?.evidenceQualityScore ?? "not_supplied"}.`,
        ...(input.evidenceQualityResult?.stabilizationSupportedAreas ?? []),
      ],
      blindSpots: input.evidenceQualityResult?.missingEvidenceAreas ?? ["Evidence quality result was not supplied."],
      recommendedHumanReview: "Review evidence visibility before traceability or observability expansion.",
      factors: [`Evidence quality findings: ${input.evidenceQualityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Evidence visibility is durable when quality, missing areas, contradictions, and traceability are reviewable together."],
    }),
    createAreaAssessment({
      area: "future_dashboard_scaling",
      baseScore: input.auditPreview ? 66 : 42,
      description: "Evaluates whether dashboard growth can remain read-only and human-review oriented.",
      visibleSignals: [
        ...(input.auditPreview ? ["Read-only audit dashboard preview context supplied."] : []),
        `Governance context layers supplied: ${suppliedCoreLayers}.`,
      ],
      blindSpots: input.auditPreview ? [] : ["Dashboard preview context was not supplied."],
      recommendedHumanReview: "Review dashboard scaling requirements before adding any future views.",
      factors: ["Dashboard scaling should remain preview-only unless explicitly approved."],
      reasoning: ["Dashboard observability is more durable when growth preserves read-only status and avoids enforcement language."],
    }),
    createAreaAssessment({
      area: "future_observability_growth",
      baseScore: Math.min(88, suppliedCoreLayers * 5 + explainabilityRuleCount),
      description: "Evaluates whether observability can grow without losing deterministic reviewability.",
      visibleSignals: [`Governance context layers supplied: ${suppliedCoreLayers}.`, `Explainability rules: ${explainabilityRuleCount}.`],
      blindSpots: [
        ...(!observabilityVersionSupplied(input) ? ["Observability, semantic, registry, or taxonomy version metadata was not supplied."] : []),
      ],
      recommendedHumanReview: "Review observability versioning before future telemetry, monitoring, or preview expansion.",
      factors: [`Observability version supplied: ${observabilityVersionSupplied(input)}.`],
      reasoning: ["Observability growth is more durable when layered visibility, explainability, and versioning are present."],
    }),
    createAreaAssessment({
      area: "future_ai_agent_growth",
      baseScore: 72,
      description: "Evaluates whether future AI-agent observability can remain separated from governance automation.",
      visibleSignals: ["Review module adds no autonomous governance or execution pathway."],
      blindSpots: ["Future AI-agent observability contracts are not yet formalized."],
      recommendedHumanReview: "Review AI-agent observability boundaries before future agent growth.",
      factors: ["AI-agent growth must keep observability separate from action execution."],
      reasoning: ["AI-agent observability survives when review signals do not become autonomous governance actions."],
    }),
    createAreaAssessment({
      area: "future_multi_tenant_visibility",
      baseScore: typeof input.metadata?.tenantModel === "string" ? 66 : 44,
      description: "Evaluates whether future multi-tenant visibility assumptions are explicit.",
      visibleSignals: [`Tenant model metadata supplied: ${typeof input.metadata?.tenantModel === "string"}.`],
      blindSpots: typeof input.metadata?.tenantModel === "string" ? [] : ["Tenant model metadata was not supplied."],
      recommendedHumanReview: "Review tenant visibility boundaries before multi-tenant observability growth.",
      factors: ["Multi-tenant observability requires explicit ownership and visibility boundaries."],
      reasoning: ["Multi-tenant visibility is weaker when tenant isolation and review boundaries are not documented."],
    }),
    createAreaAssessment({
      area: "cross_industry_observability",
      baseScore: typeof input.metadata?.businessVerticals === "number" || typeof input.metadata?.businessVerticals === "string" ? 70 : 56,
      description: "Evaluates whether observability language can survive cross-industry reuse.",
      visibleSignals: [
        "Core observability review uses governance, audit, evidence, traceability, and reviewability terms rather than property-specific facts.",
        `Business vertical metadata supplied: ${typeof input.metadata?.businessVerticals === "number" || typeof input.metadata?.businessVerticals === "string"}.`,
      ],
      blindSpots: typeof input.metadata?.businessVerticals === "number" || typeof input.metadata?.businessVerticals === "string" ? [] : ["Business vertical metadata was not supplied."],
      recommendedHumanReview: "Review business vertical assumptions before cross-industry observability reuse.",
      factors: ["Cross-industry observability requires adapter-neutral visibility semantics."],
      reasoning: ["Cross-industry observability is more durable when core review logic stays business-line neutral."],
    }),
  ];
};

const createFinding = (params: {
  findingType: GovernanceObservabilityDurabilityFindingType;
  area: GovernanceObservabilityDurabilityArea;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedAuditCategories?: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): GovernanceObservabilityDurabilityFinding => {
  const evidence = unique(params.evidence);
  const factors = unique(params.factors);

  return {
    id: `governance-observability-durability-${slug(params.findingType)}-${slug(params.area)}-${slug(params.description)}`,
    findingType: params.findingType,
    area: params.area,
    severity: params.severity,
    description: params.description,
    evidence,
    affectedAuditCategories: unique(params.affectedAuditCategories ?? []) as FullSystemGovernanceAuditCategory[],
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateObservabilityFindingConfidence({
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
  input: GovernanceObservabilityDurabilityInput,
): GovernanceObservabilityDurabilityFinding[] => {
  const findings: GovernanceObservabilityDurabilityFinding[] = [];
  const auditResult = getAuditResult(input);
  const auditCategories = unique([
    ...getAuditFindings(input).map((finding) => finding.category),
    ...Object.keys(auditResult?.categoryScores ?? {}),
  ]) as FullSystemGovernanceAuditCategory[];
  const suppliedVisibilityLayers = countSupplied([
    input.survivabilityExpansionResult,
    input.doctrineDurabilityResult,
    input.semanticStabilityResult,
    input.registryReviewResult,
    input.normalizationResult,
    input.traceabilityResult,
    auditResult,
    input.auditPreview,
    input.readinessResult,
    input.assuranceResult,
    input.doctrineResult,
    input.memoryResult,
    input.lineageResult,
    input.resilienceResult,
    input.continuityResult,
    input.evidenceQualityResult,
  ]);
  const explainabilityRuleCount =
    (input.survivabilityExpansionResult?.explainability.survivabilityRulesApplied.length ?? 0) +
    (input.doctrineDurabilityResult?.explainability.doctrineDurabilityRulesApplied.length ?? 0) +
    (input.semanticStabilityResult?.explainability.semanticStabilityRulesApplied.length ?? 0) +
    (input.registryReviewResult?.explainability.registryReviewRulesApplied.length ?? 0) +
    (input.normalizationResult?.explainability.normalizationRulesApplied.length ?? 0) +
    (input.traceabilityResult?.explainability.traceabilityRulesApplied.length ?? 0) +
    (auditResult?.explainability.auditRulesApplied.length ?? 0);

  if (suppliedVisibilityLayers < 10) {
    findings.push(
      createFinding({
        findingType: "observability_blind_spot",
        area: "future_observability_growth",
        severity: suppliedVisibilityLayers < 7 ? "elevated" : "moderate",
        description: "Governance observability context is incomplete for future expansion review.",
        evidence: [`Visibility layers supplied: ${suppliedVisibilityLayers}.`],
        recommendedHumanReview: "Supply survivability, doctrine durability, semantic stability, registry, normalization, traceability, audit, preview, readiness, assurance, memory, lineage, continuity, resilience, and evidence context before relying on observability scores.",
        factors: ["Observability durability depends on layered review visibility."],
        reasoning: ["Observability is less durable when key governance review layers are not visible together."],
      }),
    );
  }

  if (
    !input.readinessResult ||
    !input.assuranceResult ||
    input.readinessResult.readinessClassification === "not_ready" ||
    input.assuranceResult.overallAssuranceStatus === "weak"
  ) {
    findings.push(
      createFinding({
        findingType: "governance_visibility_degradation_risk",
        area: "governance_dashboards",
        severity: !input.readinessResult || !input.assuranceResult ? "elevated" : "moderate",
        description: "Readiness or assurance visibility is missing or weak.",
        evidence: [
          `Readiness: ${input.readinessResult?.readinessClassification ?? "not_supplied"}.`,
          `Assurance: ${input.assuranceResult?.overallAssuranceStatus ?? "not_supplied"}.`,
        ],
        recommendedHumanReview: "Review readiness and assurance visibility before future dashboard or observability expansion.",
        factors: ["Governance visibility requires readiness and assurance context."],
        reasoning: ["Governance visibility can degrade when preparedness and assurance signals are not visible."],
      }),
    );
  }

  if (explainabilityRuleCount < 22) {
    findings.push(
      createFinding({
        findingType: "explainability_visibility_risk",
        area: "explainability_visibility",
        severity: explainabilityRuleCount < 14 ? "elevated" : "moderate",
        description: "Explainability visibility depth may be limited for future observability growth.",
        evidence: [`Explainability rules supplied: ${explainabilityRuleCount}.`],
        recommendedHumanReview: "Review explainability rules, drivers, and limitations before future observability systems.",
        factors: ["Explainability visibility requires consistent rules across core governance review layers."],
        reasoning: ["Explainability becomes harder to inspect as systems grow unless rules, drivers, and limitations remain visible."],
      }),
    );
  }

  if (!input.traceabilityResult || input.traceabilityResult.gaps.length > 0 || ["weak", "moderate"].includes(input.traceabilityResult.traceabilityClassification)) {
    findings.push(
      createFinding({
        findingType: "traceability_visibility_risk",
        area: "traceability_visibility",
        severity: !input.traceabilityResult || input.traceabilityResult.traceabilityClassification === "weak" ? "elevated" : "moderate",
        description: "Traceability visibility has gaps or limited strength.",
        evidence: [
          `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
          ...(input.traceabilityResult?.gaps.map((gap) => gap.description).slice(0, 8) ?? []),
        ],
        recommendedHumanReview: "Review traceability gaps before future audit, observability, or dashboard growth.",
        factors: [`Traceability gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
        reasoning: ["Traceability visibility is required for durable evidence, reasoning, limitation, and recommendation review."],
      }),
    );
  }

  if (!input.auditPreview) {
    findings.push(
      createFinding({
        findingType: "dashboard_survivability_risk",
        area: "governance_dashboards",
        severity: "moderate",
        description: "Read-only governance dashboard preview context was not supplied.",
        evidence: ["Audit preview context: not_supplied."],
        recommendedHumanReview: "Review dashboard visibility requirements before future dashboard scaling.",
        factors: ["Dashboard durability is stronger when read-only preview context is supplied."],
        reasoning: ["Dashboard growth can become harder to review when preview context is missing from observability evaluation."],
      }),
    );
  }

  if (!auditResult || auditCategories.length < 10 || auditResult.futureTechnicalDebtItems.length > 0) {
    findings.push(
      createFinding({
        findingType: "audit_visibility_fragmentation_risk",
        area: "audit_visibility",
        severity: !auditResult ? "elevated" : "moderate",
        description: "Audit visibility may fragment under future audit growth.",
        evidence: [
          `Audit supplied: ${Boolean(auditResult)}.`,
          `Audit categories represented: ${auditCategories.length}.`,
          ...(auditResult?.futureTechnicalDebtItems.slice(0, 6) ?? []),
        ],
        affectedAuditCategories: auditCategories,
        recommendedHumanReview: "Review audit visibility and technical debt before future audit complexity expands.",
        factors: ["Audit visibility fragmentation is evaluated from category breadth and future technical debt items."],
        reasoning: ["Audit observability is less durable when category coverage or future technical debt weakens visibility."],
      }),
    );
  }

  if (!input.semanticStabilityResult || ["unstable", "mostly_stable"].includes(input.semanticStabilityResult.semanticStabilityClassification)) {
    findings.push(
      createFinding({
        findingType: "semantic_visibility_risk",
        area: "semantic_visibility",
        severity: !input.semanticStabilityResult || input.semanticStabilityResult.semanticStabilityClassification === "unstable" ? "elevated" : "moderate",
        description: "Semantic visibility is not yet strong enough for future observability growth.",
        evidence: [
          `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
          ...(input.semanticStabilityResult?.driftRisks.slice(0, 8) ?? []),
        ],
        recommendedHumanReview: "Review semantic visibility before future dashboards, registry adoption, or taxonomy growth.",
        factors: [`Semantic findings: ${input.semanticStabilityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Observability can amplify unclear terminology if semantic stability is weak."],
      }),
    );
  }

  if ((auditResult?.orchestrationContaminationRisks.length ?? 0) > 0 || (auditResult?.hiddenExecutionPathwayRisks.length ?? 0) > 0) {
    findings.push(
      createFinding({
        findingType: "observability_coupling_risk",
        area: "orchestration_visibility",
        severity: "elevated",
        description: "Audit context includes orchestration contamination or hidden execution pathway risks.",
        evidence: [
          ...(auditResult?.orchestrationContaminationRisks ?? []),
          ...(auditResult?.hiddenExecutionPathwayRisks ?? []),
        ],
        recommendedHumanReview: "Review orchestration coupling risks before future observability integrations.",
        factors: ["Observability systems must not become execution or orchestration pathways."],
        reasoning: ["Observability durability weakens when visibility surfaces become coupled to action systems."],
      }),
    );
  }

  if (!input.memoryResult || !input.lineageResult || !input.continuityResult || !input.readinessResult?.humanReviewRequired) {
    findings.push(
      createFinding({
        findingType: "reviewability_degradation_risk",
        area: "continuity_visibility",
        severity: !input.memoryResult || !input.lineageResult ? "elevated" : "moderate",
        description: "Institutional reviewability context is incomplete or human-review requirement visibility may be weak.",
        evidence: [
          `Memory supplied: ${Boolean(input.memoryResult)}.`,
          `Lineage supplied: ${Boolean(input.lineageResult)}.`,
          `Continuity supplied: ${Boolean(input.continuityResult)}.`,
          `Readiness human review required: ${input.readinessResult?.humanReviewRequired ?? "not_supplied"}.`,
        ],
        recommendedHumanReview: "Review memory, lineage, continuity, and human-review visibility before future observability growth.",
        factors: ["Reviewability visibility depends on historical context and explicit human-review signals."],
        reasoning: ["Observability is less durable when reviewers cannot inspect why governance meaning evolved."],
      }),
    );
  }

  if (suppliedVisibilityLayers < 12 || !observabilityVersionSupplied(input)) {
    findings.push(
      createFinding({
        findingType: "scalability_visibility_bottleneck",
        area: "future_observability_growth",
        severity: !observabilityVersionSupplied(input) ? "moderate" : "low",
        description: "Future observability scalability may be limited by incomplete context or missing version metadata.",
        evidence: [
          `Visibility layers supplied: ${suppliedVisibilityLayers}.`,
          `Observability or semantic version metadata supplied: ${observabilityVersionSupplied(input)}.`,
        ],
        recommendedHumanReview: "Review observability versioning and layer completeness before future observability growth.",
        factors: ["Scalable observability requires layered visibility and versioned semantics."],
        reasoning: ["Future observability systems are harder to maintain when versioning and layer completeness are missing."],
      }),
    );
  }

  if (!input.registryReviewResult || ["unstable", "developing"].includes(input.registryReviewResult.registryReadinessClassification)) {
    findings.push(
      createFinding({
        findingType: "future_registry_observability_incompatibility",
        area: "registry_readiness_visibility",
        severity: !input.registryReviewResult || input.registryReviewResult.registryReadinessClassification === "unstable" ? "elevated" : "moderate",
        description: "Registry readiness visibility is missing or not yet mature enough for future registry observability.",
        evidence: [
          `Registry readiness: ${input.registryReviewResult?.registryReadinessClassification ?? "not_supplied"}.`,
          ...(input.registryReviewResult?.semanticDriftRisks ?? []),
        ],
        recommendedHumanReview: "Review registry readiness visibility before future registry adoption or registry dashboards.",
        factors: [`Registry findings: ${input.registryReviewResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Registry observability should wait until registry readiness, semantic stability, and doctrine durability are reviewable."],
      }),
    );
  }

  if (!input.survivabilityExpansionResult || ["fragile", "conditionally_scalable"].includes(input.survivabilityExpansionResult.survivabilityClassification)) {
    findings.push(
      createFinding({
        findingType: "survivability_visibility_gap",
        area: "survivability_visibility",
        severity: !input.survivabilityExpansionResult || input.survivabilityExpansionResult.survivabilityClassification === "fragile" ? "elevated" : "moderate",
        description: "Survivability visibility is missing or not yet strong enough for future observability growth.",
        evidence: [
          `Survivability classification: ${input.survivabilityExpansionResult?.survivabilityClassification ?? "not_supplied"}.`,
          ...(input.survivabilityExpansionResult?.fragileExpansionAreas ?? []),
        ],
        recommendedHumanReview: "Review survivability visibility before future observability or enterprise expansion.",
        factors: [`Survivability findings: ${input.survivabilityExpansionResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Observability durability depends on visible survivability risks and expansion constraints."],
      }),
    );
  }

  if (!input.memoryResult || !input.lineageResult || !input.continuityResult) {
    findings.push(
      createFinding({
        findingType: "institutional_observability_risk",
        area: "continuity_visibility",
        severity: "elevated",
        description: "Institutional observability context is incomplete.",
        evidence: [
          `Memory supplied: ${Boolean(input.memoryResult)}.`,
          `Lineage supplied: ${Boolean(input.lineageResult)}.`,
          `Continuity supplied: ${Boolean(input.continuityResult)}.`,
        ],
        recommendedHumanReview: "Review memory, lineage, and continuity visibility before relying on institutional observability.",
        factors: ["Institutional observability depends on historical context and lineage visibility."],
        reasoning: ["Long-horizon governance reviewability weakens when institutional history is not visible."],
      }),
    );
  }

  if (typeof input.metadata?.businessVerticals !== "number" && typeof input.metadata?.businessVerticals !== "string") {
    findings.push(
      createFinding({
        findingType: "cross_industry_observability_risk",
        area: "cross_industry_observability",
        severity: "moderate",
        description: "Cross-industry observability assumptions are not explicitly supplied.",
        evidence: ["businessVerticals metadata was not supplied."],
        recommendedHumanReview: "Review business vertical assumptions before cross-industry observability reuse.",
        factors: ["Cross-industry observability is stronger when business vertical assumptions are explicit and adapters remain isolated."],
        reasoning: ["Multi-business observability can weaken if core visibility semantics quietly absorb business-specific assumptions."],
      }),
    );
  }

  return findings;
};

export function analyzeGovernanceObservabilityDurability(
  input: GovernanceObservabilityDurabilityInput,
): GovernanceObservabilityDurabilityResult {
  const areaAssessments = buildAreaAssessments(input);
  const findings = buildFindings(input);
  const observabilityDurabilityScore = calculateObservabilityDurabilityScore({ areaAssessments, findings });
  const observabilityScalabilityScore = calculateObservabilityScalabilityScore({ areaAssessments, findings });
  const resultWithoutExplainability = {
    observabilityDurabilityScore,
    observabilityScalabilityScore,
    observabilityDurabilityClassification: observabilityDurabilityClassificationFromScore(observabilityDurabilityScore),
    observabilityScalabilityClassification: observabilityDurabilityClassificationFromScore(observabilityScalabilityScore),
    areaAssessments,
    findings,
    durableObservabilityAreas: unique(
      areaAssessments
        .filter((assessment) => assessment.classification === "observable" || assessment.classification === "institutionally_observable")
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    fragileObservabilityAreas: unique(
      areaAssessments
        .filter((assessment) => assessment.classification === "fragile" || assessment.classification === "conditionally_observable")
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    governanceVisibilityFindings: unique(
      findings
        .filter((finding) =>
          ["observability_blind_spot", "governance_visibility_degradation_risk", "reviewability_degradation_risk"].includes(
            finding.findingType,
          ),
        )
        .map((finding) => finding.description),
    ),
    explainabilityVisibilityFindings: unique(
      findings.filter((finding) => finding.findingType === "explainability_visibility_risk").map((finding) => finding.description),
    ),
    traceabilityVisibilityFindings: unique(
      findings.filter((finding) => finding.findingType === "traceability_visibility_risk").map((finding) => finding.description),
    ),
    auditVisibilityFindings: unique(
      findings.filter((finding) => finding.findingType === "audit_visibility_fragmentation_risk").map((finding) => finding.description),
    ),
    survivabilityVisibilityFindings: unique(
      findings.filter((finding) => finding.findingType === "survivability_visibility_gap").map((finding) => finding.description),
    ),
    dashboardDurabilityFindings: unique(
      findings.filter((finding) => finding.findingType === "dashboard_survivability_risk").map((finding) => finding.description),
    ),
    institutionalReviewabilityFindings: unique(
      findings
        .filter((finding) =>
          ["institutional_observability_risk", "reviewability_degradation_risk", "observability_coupling_risk"].includes(finding.findingType),
        )
        .map((finding) => finding.description),
    ),
    crossIndustryObservabilityFindings: unique(
      findings.filter((finding) => finding.findingType === "cross_industry_observability_risk").map((finding) => finding.description),
    ),
    registryReadinessImplications: unique([
      `Registry readiness: ${input.registryReviewResult?.registryReadinessClassification ?? "not_supplied"}.`,
      `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
      `Observability version supplied: ${observabilityVersionSupplied(input)}.`,
      ...(input.registryReviewResult?.futureRegistryRecommendations ?? []),
      ...(input.survivabilityExpansionResult?.registryReadinessImplications ?? []),
      "Registry observability should remain review-only until registry readiness, semantic stability, doctrine durability, and observability durability are human-reviewed.",
    ]),
    humanReviewNotes: unique([
      ...findings.map((finding) => finding.recommendedHumanReview),
      "Do not redesign dashboards, centralize observability systems, implement persistence, add enforcement, or introduce orchestration execution during this review-only stage.",
      "Keep future observability, AI-agent, registry, dashboard, and orchestration integrations separate from pure governance review engines.",
    ]),
    futureStabilizationRecommendations: [
      "Prepare Governance Reviewability Integrity Review before adding any observability, dashboard, registry, or automation integration.",
      "Review observability versioning before future monitoring, telemetry, multi-tenant, or dashboard growth.",
      "Review observability durability with survivability, doctrine durability, semantic stability, registry, normalization, traceability, audit, preview, readiness, assurance, memory, lineage, continuity, resilience, and evidence quality supplied together.",
      "Keep any future observability dashboard read-only and human-review first.",
      "Consider shared deterministic visibility utilities only after reviewability integrity confirms stable contracts.",
    ],
    humanReviewRequired:
      findings.length > 0 ||
      areaAssessments.some(
        (assessment) => assessment.classification === "fragile" || assessment.classification === "conditionally_observable",
      ),
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernanceObservabilityDurabilityExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}

export const getGovernanceObservabilityDurabilityReview = analyzeGovernanceObservabilityDurability;
