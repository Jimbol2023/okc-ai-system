import { buildGovernanceSurvivabilityExpansionExplainability } from "./governance-survivability-expansion-review-explainability";
import {
  calculateExpansionDurabilityScore,
  calculateSurvivabilityAreaScore,
  calculateSurvivabilityFindingConfidence,
  calculateSurvivabilityScore,
  survivabilityExpansionClassificationFromScore,
} from "./governance-survivability-expansion-review-scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
} from "./full-system-governance-audit-types";
import type {
  GovernanceSurvivabilityExpansionArea,
  GovernanceSurvivabilityExpansionAreaAssessment,
  GovernanceSurvivabilityExpansionFinding,
  GovernanceSurvivabilityExpansionFindingType,
  GovernanceSurvivabilityExpansionInput,
  GovernanceSurvivabilityExpansionResult,
} from "./governance-survivability-expansion-review-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const getAuditFindings = (input: GovernanceSurvivabilityExpansionInput): FullSystemGovernanceAuditFinding[] =>
  input.auditFindings ?? input.auditResult?.findings ?? [];

const getRecommendations = (input: GovernanceSurvivabilityExpansionInput): FullSystemGovernanceAuditRecommendation[] =>
  input.recommendations ?? input.auditResult?.recommendations ?? [];

const scoreFromStatus = (status: string | undefined): number => {
  if (!status) return 38;
  if (
    [
      "institutionally_scalable",
      "institutionally_durable",
      "institutionally_stable",
      "institutionally_registry_ready",
      "institutionally_consistent",
      "institutionally_traceable",
      "institutionally_ready",
      "institutionally_strong",
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

const countSupplied = (items: unknown[]): number => items.filter(Boolean).length;

const semanticVersionSupplied = (input: GovernanceSurvivabilityExpansionInput): boolean =>
  ["semanticVersion", "registryVersion", "doctrineVersion", "taxonomyVersion", "observabilityVersion"].some(
    (key) => typeof input.metadata?.[key] === "string",
  );

const createAreaAssessment = (params: {
  area: GovernanceSurvivabilityExpansionArea;
  baseScore: number;
  description: string;
  evidence: string[];
  limitations: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  findingCount?: number;
}): GovernanceSurvivabilityExpansionAreaAssessment => {
  const evidence = unique(params.evidence);
  const limitations = unique(params.limitations);
  const factors = unique(params.factors);
  const score = calculateSurvivabilityAreaScore({
    baseScore: params.baseScore,
    evidenceCount: evidence.length,
    limitationCount: limitations.length,
    findingCount: params.findingCount ?? 0,
    explainabilityCount: factors.length + params.reasoning.length,
  });

  return {
    area: params.area,
    score,
    classification: survivabilityExpansionClassificationFromScore(score),
    description: params.description,
    evidence,
    limitations,
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors,
      reasoning: params.reasoning,
    },
  };
};

const buildAreaAssessments = (
  input: GovernanceSurvivabilityExpansionInput,
): GovernanceSurvivabilityExpansionAreaAssessment[] => {
  const auditFindings = getAuditFindings(input);
  const recommendations = getRecommendations(input);
  const auditCategories = unique([
    ...auditFindings.map((finding) => finding.category),
    ...recommendations.map((recommendation) => recommendation.category),
    ...Object.keys(input.auditResult?.categoryScores ?? {}),
    ...(input.normalizationResult?.mappings.flatMap((mapping) => mapping.auditCategories) ?? []),
    ...(input.traceabilityResult?.traces.map((trace) => trace.auditCategory) ?? []),
  ]);
  const suppliedCoreLayers = countSupplied([
    input.doctrineDurabilityResult,
    input.semanticStabilityResult,
    input.registryReviewResult,
    input.normalizationResult,
    input.traceabilityResult,
    input.auditResult,
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
    (input.doctrineDurabilityResult?.explainability.doctrineDurabilityRulesApplied.length ?? 0) +
    (input.semanticStabilityResult?.explainability.semanticStabilityRulesApplied.length ?? 0) +
    (input.registryReviewResult?.explainability.registryReviewRulesApplied.length ?? 0) +
    (input.normalizationResult?.explainability.normalizationRulesApplied.length ?? 0) +
    (input.traceabilityResult?.explainability.traceabilityRulesApplied.length ?? 0) +
    (input.auditResult?.explainability.auditRulesApplied.length ?? 0) +
    (input.readinessResult?.explainability.readinessRulesApplied.length ?? 0) +
    (input.assuranceResult?.explainability.assuranceRulesApplied.length ?? 0);

  return [
    createAreaAssessment({
      area: "governance_principles",
      baseScore: scoreFromStatus(input.doctrineResult?.doctrineStatus),
      description: "Evaluates whether governance principles remain durable under future agents, modules, and business lines.",
      evidence: [
        `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
        `Doctrine durability: ${input.doctrineDurabilityResult?.doctrineDurabilityClassification ?? "not_supplied"}.`,
      ],
      limitations: input.doctrineResult?.doctrineLimitations ?? ["Doctrine result was not supplied."],
      recommendedHumanReview: "Review principle durability before expanding governance layers.",
      factors: [`Doctrine principles: ${input.doctrineResult?.principles.length ?? "not_supplied"}.`],
      reasoning: ["Governance principles survive expansion when typed, explainable, traceable, and not over-coupled to execution systems."],
    }),
    createAreaAssessment({
      area: "doctrine_structures",
      baseScore: scoreFromStatus(input.doctrineDurabilityResult?.doctrineDurabilityClassification),
      description: "Evaluates whether doctrine structures can survive future governance expansion.",
      evidence: [
        `Doctrine durability score: ${input.doctrineDurabilityResult?.doctrineDurabilityScore ?? "not_supplied"}.`,
        ...(input.doctrineDurabilityResult?.durableDoctrineAreas ?? []),
      ],
      limitations: input.doctrineDurabilityResult?.fragileDoctrineAreas ?? ["Doctrine durability result was not supplied."],
      recommendedHumanReview: "Review fragile doctrine areas before relying on expansion durability.",
      factors: [`Doctrine durability findings: ${input.doctrineDurabilityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Doctrine structures are more survivable when durability review indicates stable doctrine, traceability, and explainability areas."],
      findingCount: input.doctrineDurabilityResult?.findings.length ?? 1,
    }),
    createAreaAssessment({
      area: "audit_semantics",
      baseScore: scoreFromStatus(input.auditResult?.auditClassification),
      description: "Evaluates whether audit semantics can scale with future audit complexity.",
      evidence: [`Audit classification: ${input.auditResult?.auditClassification ?? "not_supplied"}.`, `Audit categories: ${auditCategories.length}.`],
      limitations: input.auditResult?.limitations ?? ["Audit result was not supplied."],
      recommendedHumanReview: "Review audit taxonomy before future audit scaling.",
      factors: [`Audit findings: ${auditFindings.length}.`, `Audit recommendations: ${recommendations.length}.`],
      reasoning: ["Audit semantics survive growth when categories, findings, recommendations, and limitations remain stable and explainable."],
    }),
    createAreaAssessment({
      area: "evidence_semantics",
      baseScore: Math.min(
        90,
        scoreFromStatus(input.evidenceQualityResult?.overallReliabilityLevel) * 0.5 +
          scoreFromStatus(input.traceabilityResult?.traceabilityClassification) * 0.5,
      ),
      description: "Evaluates whether evidence semantics can survive future traceability and observability expansion.",
      evidence: [
        `Evidence reliability: ${input.evidenceQualityResult?.overallReliabilityLevel ?? "not_supplied"}.`,
        `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
      ],
      limitations: [
        ...(!input.evidenceQualityResult ? ["Evidence quality result was not supplied."] : []),
        ...(!input.traceabilityResult ? ["Traceability result was not supplied."] : []),
        ...(input.evidenceQualityResult?.missingEvidenceAreas ?? []),
      ],
      recommendedHumanReview: "Review evidence reliability and missing evidence before future evidence expansion.",
      factors: [`Evidence quality findings: ${input.evidenceQualityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Evidence semantics survive expansion when evidence quality and traceability remain aligned."],
    }),
    createAreaAssessment({
      area: "scoring_semantics",
      baseScore: scoreFromStatus(input.semanticStabilityResult?.semanticStabilityClassification),
      description: "Evaluates whether scoring semantics remain deterministic under future modules.",
      evidence: [
        `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
        ...(input.semanticStabilityResult?.scoringSemanticFindings ?? []),
      ],
      limitations: input.semanticStabilityResult?.explainability.limitations ?? ["Semantic stability result was not supplied."],
      recommendedHumanReview: "Review scoring semantic findings before future scoring expansion.",
      factors: [`Scoring semantic findings: ${input.semanticStabilityResult?.scoringSemanticFindings.length ?? "not_supplied"}.`],
      reasoning: ["Scoring semantics survive growth when drivers remain deterministic, visible, and traceable."],
    }),
    createAreaAssessment({
      area: "traceability_semantics",
      baseScore: scoreFromStatus(input.traceabilityResult?.traceabilityClassification),
      description: "Evaluates whether traceability semantics can survive future evidence and audit growth.",
      evidence: [
        `Traceability score: ${input.traceabilityResult?.traceabilityScore ?? "not_supplied"}.`,
        `Trace links: ${input.traceabilityResult?.traces.length ?? "not_supplied"}.`,
      ],
      limitations: input.traceabilityResult?.evidenceGaps ?? ["Traceability result was not supplied."],
      recommendedHumanReview: "Review traceability gaps before future traceability expansion.",
      factors: [`Traceability gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
      reasoning: ["Traceability survives expansion when evidence, reasoning, limitations, scoring drivers, and recommendations remain linked."],
      findingCount: input.traceabilityResult?.gaps.length ?? 1,
    }),
    createAreaAssessment({
      area: "recommendation_semantics",
      baseScore: recommendations.length + (input.doctrineResult?.recommendations.length ?? 0) > 0 ? 70 : 42,
      description: "Evaluates whether recommendation semantics remain neutral and human-review oriented.",
      evidence: [`Audit recommendations: ${recommendations.length}.`, `Doctrine recommendations: ${input.doctrineResult?.recommendations.length ?? "not_supplied"}.`],
      limitations: input.semanticStabilityResult?.recommendationSemanticFindings ?? [],
      recommendedHumanReview: "Review recommendation wording before future governance expansion.",
      factors: [`Recommendation semantic findings: ${input.semanticStabilityResult?.recommendationSemanticFindings.length ?? "not_supplied"}.`],
      reasoning: ["Recommendation semantics survive expansion when they remain neutral, traceable, and do not imply enforcement."],
    }),
    createAreaAssessment({
      area: "limitation_semantics",
      baseScore: (input.semanticStabilityResult?.limitationSemanticFindings.length ?? 1) === 0 ? 76 : 58,
      description: "Evaluates whether limitation semantics preserve reviewability under future growth.",
      evidence: [
        `Audit limitations: ${input.auditResult?.limitations.length ?? "not_supplied"}.`,
        `Semantic limitation findings: ${input.semanticStabilityResult?.limitationSemanticFindings.length ?? "not_supplied"}.`,
      ],
      limitations: input.semanticStabilityResult?.limitationSemanticFindings ?? ["Semantic stability result was not supplied."],
      recommendedHumanReview: "Review limitation semantics before future governance expansion.",
      factors: [`Doctrine limitations: ${input.doctrineResult?.doctrineLimitations.length ?? "not_supplied"}.`],
      reasoning: ["Limitation semantics survive when governance boundaries remain explicit and human-reviewable."],
    }),
    createAreaAssessment({
      area: "observability_semantics",
      baseScore: Math.min(86, explainabilityRuleCount * 2 + suppliedCoreLayers * 4),
      description: "Evaluates whether current explainability and audit outputs can support future observability systems.",
      evidence: [`Explainability rules supplied across layers: ${explainabilityRuleCount}.`, `Core context layers supplied: ${suppliedCoreLayers}.`],
      limitations: [
        ...(!input.auditResult ? ["Audit result was not supplied."] : []),
        ...(!input.traceabilityResult ? ["Traceability result was not supplied."] : []),
        ...(!input.semanticStabilityResult ? ["Semantic stability result was not supplied."] : []),
      ],
      recommendedHumanReview: "Review observability semantics before future monitoring or preview systems.",
      factors: [`Observability version supplied: ${typeof input.metadata?.observabilityVersion === "string"}.`],
      reasoning: ["Observability survives growth when evidence, traceability, audit, and explainability outputs remain structured and read-only."],
    }),
    createAreaAssessment({
      area: "registry_readiness_semantics",
      baseScore: scoreFromStatus(input.registryReviewResult?.registryReadinessClassification),
      description: "Evaluates whether registry readiness can support future semantic growth without centralizing enforcement.",
      evidence: [
        `Registry readiness: ${input.registryReviewResult?.registryReadinessClassification ?? "not_supplied"}.`,
        `Registry readiness score: ${input.registryReviewResult?.registryReadinessScore ?? "not_supplied"}.`,
      ],
      limitations: input.registryReviewResult?.reviewLimitations ?? ["Registry review result was not supplied."],
      recommendedHumanReview: "Review registry readiness and versioning before future registry adoption.",
      factors: [`Registry findings: ${input.registryReviewResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Registry readiness supports expansion only when it remains review-only until explicitly approved."],
    }),
    createAreaAssessment({
      area: "normalization_semantics",
      baseScore: scoreFromStatus(input.normalizationResult?.normalizationClassification),
      description: "Evaluates whether normalization semantics can survive future taxonomy and registry growth.",
      evidence: [
        `Normalization classification: ${input.normalizationResult?.normalizationClassification ?? "not_supplied"}.`,
        `Normalization score: ${input.normalizationResult?.normalizationScore ?? "not_supplied"}.`,
      ],
      limitations: input.normalizationResult?.missingMappings ?? ["Normalization result was not supplied."],
      recommendedHumanReview: "Review normalization gaps before future taxonomy expansion.",
      factors: [`Normalization gaps: ${input.normalizationResult?.gaps.length ?? "not_supplied"}.`],
      reasoning: ["Normalization semantics survive when principle, evidence, score, limitation, recommendation, and trace links remain stable."],
    }),
    createAreaAssessment({
      area: "orchestration_review_semantics",
      baseScore: 78 - Math.min(24, (input.auditResult?.orchestrationContaminationRisks.length ?? 0) * 6),
      description: "Evaluates whether governance review semantics remain isolated from future orchestration complexity.",
      evidence: [
        "Survivability review is read-only and adds no orchestration pathway.",
        `Audit orchestration risks: ${input.auditResult?.orchestrationContaminationRisks.length ?? "not_supplied"}.`,
      ],
      limitations: input.auditResult?.orchestrationContaminationRisks ?? ["Future orchestration integrations must remain separate from pure review engines."],
      recommendedHumanReview: "Review orchestration contamination risks before future orchestration growth.",
      factors: ["No execution, automation, outreach, or workflow mutation is introduced by this review."],
      reasoning: ["Governance survives orchestration growth when review engines remain separate from execution systems."],
    }),
    createAreaAssessment({
      area: "continuity_semantics",
      baseScore: scoreFromStatus(input.continuityResult?.continuityStatus),
      description: "Evaluates whether continuity semantics survive future expansion.",
      evidence: [
        `Continuity status: ${input.continuityResult?.continuityStatus ?? "not_supplied"}.`,
        `Continuity score: ${input.continuityResult?.governanceContinuityScore ?? "not_supplied"}.`,
      ],
      limitations: input.continuityResult?.continuityWeaknesses ?? ["Continuity result was not supplied."],
      recommendedHumanReview: "Review continuity weakness before future expansion.",
      factors: [`Continuity drift findings: ${input.continuityResult?.driftFindings.length ?? "not_supplied"}.`],
      reasoning: ["Continuity semantics survive expansion when drift and reviewability remain visible."],
    }),
    createAreaAssessment({
      area: "resilience_semantics",
      baseScore: scoreFromStatus(input.resilienceResult?.resilienceStatus),
      description: "Evaluates whether resilience semantics survive future pressure and module growth.",
      evidence: [
        `Resilience status: ${input.resilienceResult?.resilienceStatus ?? "not_supplied"}.`,
        `Resilience score: ${input.resilienceResult?.governanceResilienceScore ?? "not_supplied"}.`,
      ],
      limitations: input.resilienceResult?.resilienceWeaknesses ?? ["Resilience result was not supplied."],
      recommendedHumanReview: "Review resilience weaknesses before relying on expansion durability.",
      factors: [`Fragility indicators: ${input.resilienceResult?.fragilityIndicators.length ?? "not_supplied"}.`],
      reasoning: ["Resilience semantics survive when governance remains reviewable under operational pressure."],
    }),
    createAreaAssessment({
      area: "future_ai_agents",
      baseScore: Math.min(86, suppliedCoreLayers * 6),
      description: "Evaluates whether governance review context can survive future AI-agent expansion without autonomous governance.",
      evidence: [`Core context layers supplied: ${suppliedCoreLayers}.`, "No autonomous governance or execution pathway is added."],
      limitations: ["Future AI agents must remain separated from governance enforcement and execution unless explicitly approved."],
      recommendedHumanReview: "Review AI-agent expansion boundaries before future agent integrations.",
      factors: ["Read-only governance review boundary preserved."],
      reasoning: ["Future AI-agent expansion is more survivable when pure review engines remain isolated from action systems."],
    }),
    createAreaAssessment({
      area: "future_business_verticals",
      baseScore: 74,
      description: "Evaluates whether governance semantics avoid single-business coupling.",
      evidence: [
        "Review logic uses governance, evidence, audit, traceability, semantic, and continuity terms rather than property-specific facts.",
        "No protected-class, demographic, legal, tax, lending, or investment conclusion is produced.",
      ],
      limitations: ["Future business adapters should remain separate from core governance review logic."],
      recommendedHumanReview: "Review future adapters for business-specific leakage before cross-vertical expansion.",
      factors: ["Core review terminology remains business-line neutral."],
      reasoning: ["Cross-vertical survivability improves when governance infrastructure stays adapter-neutral."],
    }),
    createAreaAssessment({
      area: "future_governance_layers",
      baseScore: Math.min(88, suppliedCoreLayers * 6),
      description: "Evaluates whether governance architecture can absorb future governance layers.",
      evidence: [`Core context layers supplied: ${suppliedCoreLayers}.`],
      limitations: suppliedCoreLayers < 10 ? ["Layered governance context is incomplete."] : [],
      recommendedHumanReview: "Review layer completeness before adding future governance review layers.",
      factors: ["Future governance layers require stable upstream review contracts."],
      reasoning: ["Governance layers survive growth when each layer remains modular, deterministic, explainable, and read-only."],
    }),
    createAreaAssessment({
      area: "future_enterprise_scaling",
      baseScore: Math.min(88, suppliedCoreLayers * 5 + auditCategories.length * 2),
      description: "Evaluates whether governance review architecture can scale at enterprise breadth.",
      evidence: [`Core context layers supplied: ${suppliedCoreLayers}.`, `Audit categories represented: ${auditCategories.length}.`],
      limitations: [
        ...(!semanticVersionSupplied(input) ? ["Semantic, registry, doctrine, taxonomy, or observability version metadata was not supplied."] : []),
      ],
      recommendedHumanReview: "Review semantic versioning and audit breadth before enterprise scaling.",
      factors: [`Version metadata supplied: ${semanticVersionSupplied(input)}.`],
      reasoning: ["Enterprise scaling survivability improves with complete review layers, audit breadth, and versioned semantics."],
    }),
    createAreaAssessment({
      area: "future_multi_tenant_growth",
      baseScore: typeof input.metadata?.tenantModel === "string" ? 68 : 48,
      description: "Evaluates whether multi-tenant growth assumptions are explicit enough for review.",
      evidence: [`Tenant model metadata supplied: ${typeof input.metadata?.tenantModel === "string"}.`],
      limitations: typeof input.metadata?.tenantModel === "string" ? [] : ["Tenant model metadata was not supplied."],
      recommendedHumanReview: "Review tenant model assumptions before future multi-tenant governance expansion.",
      factors: ["Multi-tenant survivability requires explicit ownership, isolation, and review boundaries."],
      reasoning: ["Multi-tenant growth is weaker when tenancy assumptions are not documented for human review."],
    }),
    createAreaAssessment({
      area: "multi_business_reuse",
      baseScore: 72,
      description: "Evaluates whether governance infrastructure can be reused across multiple business lines.",
      evidence: [
        "Review outputs are neutral and operational.",
        "Core logic does not depend on a specific real estate property fact or single business vertical.",
      ],
      limitations: ["Future business-specific adapters should not leak into core governance review engines."],
      recommendedHumanReview: "Review adapter boundaries before multi-business infrastructure reuse.",
      factors: ["Core review layer remains adapter-neutral."],
      reasoning: ["Multi-business reuse is more survivable when business-specific facts remain outside pure governance engines."],
    }),
  ];
};

const createFinding = (params: {
  findingType: GovernanceSurvivabilityExpansionFindingType;
  area: GovernanceSurvivabilityExpansionArea;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedAuditCategories?: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): GovernanceSurvivabilityExpansionFinding => {
  const evidence = unique(params.evidence);
  const factors = unique(params.factors);

  return {
    id: `governance-survivability-expansion-${slug(params.findingType)}-${slug(params.area)}-${slug(params.description)}`,
    findingType: params.findingType,
    area: params.area,
    severity: params.severity,
    description: params.description,
    evidence,
    affectedAuditCategories: unique(params.affectedAuditCategories ?? []) as FullSystemGovernanceAuditCategory[],
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateSurvivabilityFindingConfidence({
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

const buildFindings = (input: GovernanceSurvivabilityExpansionInput): GovernanceSurvivabilityExpansionFinding[] => {
  const findings: GovernanceSurvivabilityExpansionFinding[] = [];
  const auditCategories = unique([
    ...getAuditFindings(input).map((finding) => finding.category),
    ...Object.keys(input.auditResult?.categoryScores ?? {}),
  ]) as FullSystemGovernanceAuditCategory[];
  const suppliedCoreLayers = countSupplied([
    input.doctrineDurabilityResult,
    input.semanticStabilityResult,
    input.registryReviewResult,
    input.normalizationResult,
    input.traceabilityResult,
    input.auditResult,
    input.readinessResult,
    input.assuranceResult,
    input.doctrineResult,
    input.memoryResult,
    input.lineageResult,
    input.resilienceResult,
    input.continuityResult,
    input.evidenceQualityResult,
  ]);

  if (suppliedCoreLayers < 9) {
    findings.push(
      createFinding({
        findingType: "survivability_bottleneck",
        area: "future_governance_layers",
        severity: suppliedCoreLayers < 6 ? "elevated" : "moderate",
        description: "Governance survivability context is incomplete for future expansion review.",
        evidence: [`Core context layers supplied: ${suppliedCoreLayers}.`],
        recommendedHumanReview: "Supply doctrine durability, semantic stability, registry, normalization, traceability, audit, readiness, assurance, continuity, resilience, memory, lineage, and evidence context before relying on survivability score.",
        factors: ["Survivability depends on layered governance review context."],
        reasoning: ["Expansion review is weaker when upstream governance layers are missing."],
      }),
    );
  }

  if (
    (input.doctrineDurabilityResult?.futureGovernanceExpansionRisks.length ?? 0) > 0 ||
    (input.registryReviewResult?.semanticDriftRisks.length ?? 0) > 0 ||
    (input.normalizationResult?.inconsistentMappings.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        findingType: "governance_fragmentation_risk",
        area: "governance_principles",
        severity: "elevated",
        description: "Governance fragmentation signals are present across durability, registry, or normalization layers.",
        evidence: [
          ...(input.doctrineDurabilityResult?.futureGovernanceExpansionRisks.slice(0, 6) ?? []),
          ...(input.registryReviewResult?.semanticDriftRisks.slice(0, 6) ?? []),
          ...(input.normalizationResult?.inconsistentMappings.slice(0, 6) ?? []),
        ],
        recommendedHumanReview: "Review fragmentation signals before adding future governance layers.",
        factors: ["Fragmentation risk is evaluated from doctrine durability, registry readiness, and normalization findings."],
        reasoning: ["Governance architecture is less survivable when principles, taxonomy, or mappings fragment under growth."],
      }),
    );
  }

  if ((input.auditResult?.orchestrationContaminationRisks.length ?? 0) > 0 || (input.auditResult?.hiddenExecutionPathwayRisks.length ?? 0) > 0) {
    findings.push(
      createFinding({
        findingType: "orchestration_survivability_risk",
        area: "orchestration_review_semantics",
        severity: "elevated",
        description: "Audit context includes orchestration or hidden execution pathway risks.",
        evidence: [
          ...(input.auditResult?.orchestrationContaminationRisks ?? []),
          ...(input.auditResult?.hiddenExecutionPathwayRisks ?? []),
        ],
        recommendedHumanReview: "Review orchestration and hidden execution risks before future orchestration growth.",
        factors: ["Survivability requires pure review engines to stay isolated from orchestration and execution systems."],
        reasoning: ["Governance reviewability degrades when analysis layers become coupled to execution pathways."],
      }),
    );
  }

  if (!input.semanticStabilityResult || ["unstable", "mostly_stable"].includes(input.semanticStabilityResult.semanticStabilityClassification)) {
    findings.push(
      createFinding({
        findingType: "semantic_scaling_risk",
        area: "scoring_semantics",
        severity: !input.semanticStabilityResult || input.semanticStabilityResult.semanticStabilityClassification === "unstable" ? "elevated" : "moderate",
        description: "Semantic stability is not strong enough for unconstrained governance expansion.",
        evidence: [
          `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
          ...(input.semanticStabilityResult?.driftRisks.slice(0, 8) ?? []),
        ],
        recommendedHumanReview: "Review semantic stability before future semantic, taxonomy, or registry growth.",
        factors: [`Semantic findings: ${input.semanticStabilityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Semantic scaling is weaker when terms, classifications, evidence, and scoring semantics are not stable."],
      }),
    );
  }

  if (!input.doctrineDurabilityResult || ["fragile", "conditionally_durable"].includes(input.doctrineDurabilityResult.doctrineDurabilityClassification)) {
    findings.push(
      createFinding({
        findingType: "doctrine_scaling_risk",
        area: "doctrine_structures",
        severity: !input.doctrineDurabilityResult || input.doctrineDurabilityResult.doctrineDurabilityClassification === "fragile" ? "elevated" : "moderate",
        description: "Doctrine durability is not yet strong enough for broad governance expansion.",
        evidence: [
          `Doctrine durability: ${input.doctrineDurabilityResult?.doctrineDurabilityClassification ?? "not_supplied"}.`,
          ...(input.doctrineDurabilityResult?.fragileDoctrineAreas ?? []),
        ],
        recommendedHumanReview: "Review doctrine durability before future governance layer expansion.",
        factors: [`Doctrine durability findings: ${input.doctrineDurabilityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Doctrine structures are less survivable when durability review remains fragile or conditional."],
      }),
    );
  }

  if (!input.auditResult || input.auditResult.auditClassification === "critical_risk" || auditCategories.length < 10) {
    findings.push(
      createFinding({
        findingType: "audit_scaling_risk",
        area: "audit_semantics",
        severity: !input.auditResult || input.auditResult.auditClassification === "critical_risk" ? "elevated" : "moderate",
        description: "Audit semantics may be underdeveloped for future audit scaling.",
        evidence: [
          `Audit classification: ${input.auditResult?.auditClassification ?? "not_supplied"}.`,
          `Audit categories represented: ${auditCategories.length}.`,
        ],
        affectedAuditCategories: auditCategories,
        recommendedHumanReview: "Review audit taxonomy and category breadth before future audit scaling.",
        factors: ["Audit scaling depends on durable category semantics and explainable audit findings."],
        reasoning: ["Future audit complexity can overwhelm governance review if audit categories are weak or incomplete."],
      }),
    );
  }

  if (!input.traceabilityResult || input.traceabilityResult.gaps.length > 0 || ["weak", "moderate"].includes(input.traceabilityResult.traceabilityClassification)) {
    findings.push(
      createFinding({
        findingType: "traceability_scaling_risk",
        area: "traceability_semantics",
        severity: !input.traceabilityResult || input.traceabilityResult.traceabilityClassification === "weak" ? "elevated" : "moderate",
        description: "Traceability context has gaps or limited strength for future expansion.",
        evidence: [
          `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
          ...(input.traceabilityResult?.gaps.map((gap) => gap.description).slice(0, 8) ?? []),
        ],
        recommendedHumanReview: "Review traceability gaps before future evidence, audit, or observability expansion.",
        factors: [`Traceability gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
        reasoning: ["Traceability scaling depends on stable evidence, scoring, reasoning, limitation, and recommendation chains."],
      }),
    );
  }

  const explainabilityRuleCount =
    (input.doctrineDurabilityResult?.explainability.doctrineDurabilityRulesApplied.length ?? 0) +
    (input.semanticStabilityResult?.explainability.semanticStabilityRulesApplied.length ?? 0) +
    (input.registryReviewResult?.explainability.registryReviewRulesApplied.length ?? 0) +
    (input.normalizationResult?.explainability.normalizationRulesApplied.length ?? 0) +
    (input.traceabilityResult?.explainability.traceabilityRulesApplied.length ?? 0) +
    (input.auditResult?.explainability.auditRulesApplied.length ?? 0);

  if (explainabilityRuleCount < 20) {
    findings.push(
      createFinding({
        findingType: "explainability_scaling_risk",
        area: "observability_semantics",
        severity: explainabilityRuleCount < 12 ? "elevated" : "moderate",
        description: "Explainability depth may be limited for future observability and governance expansion.",
        evidence: [`Explainability rules supplied across core layers: ${explainabilityRuleCount}.`],
        recommendedHumanReview: "Review explainability depth before future observability systems or governance layer expansion.",
        factors: ["Explainability scaling depends on visible rules, drivers, limitations, and review recommendations."],
        reasoning: ["Future governance layers become harder to review when explainability contracts are shallow."],
      }),
    );
  }

  if (!semanticVersionSupplied(input) || (input.registryReviewResult?.taxonomyStabilityFindings.length ?? 0) > 0) {
    findings.push(
      createFinding({
        findingType: "taxonomy_survivability_risk",
        area: "registry_readiness_semantics",
        severity: !semanticVersionSupplied(input) ? "moderate" : "low",
        description: "Taxonomy survivability requires versioning and stable registry readiness context.",
        evidence: [
          `Version metadata supplied: ${semanticVersionSupplied(input)}.`,
          ...(input.registryReviewResult?.taxonomyStabilityFindings.slice(0, 8) ?? []),
        ],
        recommendedHumanReview: "Review semantic, registry, doctrine, taxonomy, and observability versioning before future taxonomy growth.",
        factors: ["Taxonomy survivability depends on versioned semantics and stable registry readiness review."],
        reasoning: ["Taxonomy growth is weaker when semantic versioning and registry readiness are not reviewed together."],
      }),
    );
  }

  if (!input.registryReviewResult || ["unstable", "developing"].includes(input.registryReviewResult.registryReadinessClassification)) {
    findings.push(
      createFinding({
        findingType: "future_registry_incompatibility",
        area: "registry_readiness_semantics",
        severity: !input.registryReviewResult || input.registryReviewResult.registryReadinessClassification === "unstable" ? "elevated" : "moderate",
        description: "Future registry readiness is missing or not yet mature enough for registry adoption.",
        evidence: [
          `Registry readiness: ${input.registryReviewResult?.registryReadinessClassification ?? "not_supplied"}.`,
          ...(input.registryReviewResult?.semanticDriftRisks ?? []),
        ],
        recommendedHumanReview: "Keep registry adoption review-only until semantic stability, doctrine durability, and survivability review improve.",
        factors: [`Registry findings: ${input.registryReviewResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Registry adoption should not precede stable semantics, durable doctrine, and traceable governance review."],
      }),
    );
  }

  if (!input.auditResult || !input.traceabilityResult || !input.semanticStabilityResult || typeof input.metadata?.observabilityVersion !== "string") {
    findings.push(
      createFinding({
        findingType: "observability_survivability_risk",
        area: "observability_semantics",
        severity: !input.auditResult || !input.traceabilityResult ? "elevated" : "moderate",
        description: "Observability survivability context is incomplete.",
        evidence: [
          `Audit supplied: ${Boolean(input.auditResult)}.`,
          `Traceability supplied: ${Boolean(input.traceabilityResult)}.`,
          `Semantic stability supplied: ${Boolean(input.semanticStabilityResult)}.`,
          `Observability version supplied: ${typeof input.metadata?.observabilityVersion === "string"}.`,
        ],
        recommendedHumanReview: "Review observability semantics before future monitoring, telemetry, or preview systems.",
        factors: ["Observability durability depends on audit, traceability, semantic stability, and versioned observability context."],
        reasoning: ["Observability systems can amplify unclear governance semantics if traceability and audit context are incomplete."],
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
        findingType: "governance_reviewability_degradation_risk",
        area: "future_governance_layers",
        severity: !input.readinessResult || !input.assuranceResult ? "elevated" : "moderate",
        description: "Readiness or assurance context may weaken future governance reviewability.",
        evidence: [
          `Readiness: ${input.readinessResult?.readinessClassification ?? "not_supplied"}.`,
          `Assurance: ${input.assuranceResult?.overallAssuranceStatus ?? "not_supplied"}.`,
        ],
        recommendedHumanReview: "Review readiness and assurance before adding future governance review layers.",
        factors: ["Reviewability depends on governance readiness and assurance confidence."],
        reasoning: ["Future governance layers are harder to maintain when readiness and assurance are weak or missing."],
      }),
    );
  }

  if (
    !input.memoryResult ||
    !input.lineageResult ||
    !input.continuityResult ||
    input.continuityResult?.continuityStatus === "fragile" ||
    (input.lineageResult?.lineageIntegrityScore ?? 0) < 55
  ) {
    findings.push(
      createFinding({
        findingType: "institutional_continuity_risk",
        area: "continuity_semantics",
        severity: !input.memoryResult || !input.lineageResult ? "elevated" : "moderate",
        description: "Institutional continuity context is incomplete or weakened.",
        evidence: [
          `Memory supplied: ${Boolean(input.memoryResult)}.`,
          `Lineage supplied: ${Boolean(input.lineageResult)}.`,
          `Continuity status: ${input.continuityResult?.continuityStatus ?? "not_supplied"}.`,
          `Lineage integrity: ${input.lineageResult?.lineageIntegrityScore ?? "not_supplied"}.`,
        ],
        recommendedHumanReview: "Review memory, lineage, and continuity before relying on institutional survivability.",
        factors: ["Institutional continuity depends on memory, lineage, continuity, and reviewable historical context."],
        reasoning: ["Governance survivability weakens when institutional context cannot explain how governance meaning evolved."],
      }),
    );
  }

  if (typeof input.metadata?.businessVerticals !== "number" && typeof input.metadata?.businessVerticals !== "string") {
    findings.push(
      createFinding({
        findingType: "cross_industry_survivability_risk",
        area: "future_business_verticals",
        severity: "moderate",
        description: "Cross-industry expansion context is not explicitly supplied.",
        evidence: ["businessVerticals metadata was not supplied."],
        recommendedHumanReview: "Review future business vertical assumptions before cross-industry expansion.",
        factors: ["Cross-industry survivability is stronger when business vertical assumptions are explicit and adapter boundaries are reviewed."],
        reasoning: ["Multi-business reuse depends on adapter-neutral core logic and explicit business vertical assumptions."],
      }),
    );
  }

  return findings;
};

export function analyzeGovernanceSurvivabilityExpansion(
  input: GovernanceSurvivabilityExpansionInput,
): GovernanceSurvivabilityExpansionResult {
  const areaAssessments = buildAreaAssessments(input);
  const findings = buildFindings(input);
  const survivabilityScore = calculateSurvivabilityScore({ areaAssessments, findings });
  const expansionDurabilityScore = calculateExpansionDurabilityScore({ areaAssessments, findings });
  const resultWithoutExplainability = {
    survivabilityScore,
    expansionDurabilityScore,
    survivabilityClassification: survivabilityExpansionClassificationFromScore(survivabilityScore),
    expansionClassification: survivabilityExpansionClassificationFromScore(expansionDurabilityScore),
    areaAssessments,
    findings,
    durableArchitectureAreas: unique(
      areaAssessments
        .filter((assessment) => assessment.classification === "scalable" || assessment.classification === "institutionally_scalable")
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    fragileExpansionAreas: unique(
      areaAssessments
        .filter((assessment) => assessment.classification === "fragile" || assessment.classification === "conditionally_scalable")
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    governanceScalabilityFindings: unique(
      findings
        .filter((finding) =>
          ["survivability_bottleneck", "governance_fragmentation_risk", "doctrine_scaling_risk", "governance_reviewability_degradation_risk"].includes(
            finding.findingType,
          ),
        )
        .map((finding) => finding.description),
    ),
    orchestrationSurvivabilityFindings: unique(
      findings.filter((finding) => finding.findingType === "orchestration_survivability_risk").map((finding) => finding.description),
    ),
    semanticSurvivabilityFindings: unique(
      findings
        .filter((finding) =>
          ["semantic_scaling_risk", "taxonomy_survivability_risk", "future_registry_incompatibility"].includes(finding.findingType),
        )
        .map((finding) => finding.description),
    ),
    traceabilitySurvivabilityFindings: unique(
      findings.filter((finding) => finding.findingType === "traceability_scaling_risk").map((finding) => finding.description),
    ),
    observabilitySurvivabilityFindings: unique(
      findings
        .filter((finding) => ["observability_survivability_risk", "explainability_scaling_risk"].includes(finding.findingType))
        .map((finding) => finding.description),
    ),
    institutionalContinuityFindings: unique(
      findings.filter((finding) => finding.findingType === "institutional_continuity_risk").map((finding) => finding.description),
    ),
    crossIndustrySurvivabilityFindings: unique(
      findings.filter((finding) => finding.findingType === "cross_industry_survivability_risk").map((finding) => finding.description),
    ),
    registryReadinessImplications: unique([
      `Registry readiness: ${input.registryReviewResult?.registryReadinessClassification ?? "not_supplied"}.`,
      `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
      `Doctrine durability: ${input.doctrineDurabilityResult?.doctrineDurabilityClassification ?? "not_supplied"}.`,
      ...(input.registryReviewResult?.futureRegistryRecommendations ?? []),
      ...(input.semanticStabilityResult?.registryReadinessImplications ?? []),
      "Registry adoption should remain review-only until semantic stability, doctrine durability, and survivability review are all human-reviewed.",
    ]),
    humanReviewNotes: unique([
      ...findings.map((finding) => finding.recommendedHumanReview),
      "Do not mutate governance semantics, centralize governance enforcement, redesign architecture, add persistence, or introduce orchestration execution during this review-only stage.",
      "Keep future AI-agent, registry, observability, and orchestration integrations separate from pure governance review engines.",
    ]),
    futureStabilizationRecommendations: [
      "Review observability durability before future monitoring, telemetry, or governance preview expansion.",
      "Review semantic versioning before future registry, doctrine, taxonomy, observability, or multi-tenant growth.",
      "Review survivability with doctrine durability, semantic stability, registry review, normalization, traceability, audit, readiness, assurance, memory, lineage, continuity, resilience, and evidence quality supplied together.",
      "Keep future AI-agent and orchestration integrations behind explicit human-reviewed boundaries.",
      "Consider shared deterministic utility extraction only after observability durability review confirms stable reusable contracts.",
    ],
    humanReviewRequired:
      findings.length > 0 ||
      areaAssessments.some(
        (assessment) => assessment.classification === "fragile" || assessment.classification === "conditionally_scalable",
      ),
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernanceSurvivabilityExpansionExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}

export const getGovernanceSurvivabilityExpansionReview = analyzeGovernanceSurvivabilityExpansion;
