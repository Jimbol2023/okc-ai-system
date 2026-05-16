import { buildGovernanceDoctrineDurabilityExplainability } from "./governance-doctrine-durability-review-explainability";
import {
  calculateDoctrineDurabilityAreaScore,
  calculateDoctrineDurabilityFindingConfidence,
  calculateOverallDoctrineDurabilityScore,
  doctrineDurabilityClassificationFromScore,
} from "./governance-doctrine-durability-review-scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
} from "./full-system-governance-audit-types";
import type {
  GovernanceDoctrineDurabilityArea,
  GovernanceDoctrineDurabilityAreaAssessment,
  GovernanceDoctrineDurabilityFinding,
  GovernanceDoctrineDurabilityFindingType,
  GovernanceDoctrineDurabilityInput,
  GovernanceDoctrineDurabilityResult,
} from "./governance-doctrine-durability-review-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const getAuditFindings = (input: GovernanceDoctrineDurabilityInput): FullSystemGovernanceAuditFinding[] =>
  input.auditFindings ?? input.auditResult?.findings ?? [];

const getRecommendations = (input: GovernanceDoctrineDurabilityInput): FullSystemGovernanceAuditRecommendation[] =>
  input.recommendations ?? input.auditResult?.recommendations ?? [];

const scoreFromStatus = (status: string | undefined): number => {
  if (!status) return 38;
  if (
    [
      "institutionally_durable",
      "institutionally_stable",
      "institutionally_registry_ready",
      "institutionally_consistent",
      "institutionally_traceable",
      "institutionally_ready",
      "institutionally_strong",
      "durable",
      "anti_fragile",
    ].includes(status)
  ) {
    return 90;
  }
  if (["stable", "registry_candidate", "normalized", "strong", "operationally_ready", "reliable", "resilient", "aligned"].includes(status)) {
    return 76;
  }
  if (["conditionally_durable", "mostly_stable", "developing", "partially_normalized", "moderate", "forming", "pressured"].includes(status)) {
    return 54;
  }
  return 32;
};

const semanticVersionSupplied = (input: GovernanceDoctrineDurabilityInput): boolean =>
  ["semanticVersion", "registryVersion", "doctrineVersion", "taxonomyVersion"].some(
    (key) => typeof input.metadata?.[key] === "string",
  );

const createAreaAssessment = (params: {
  area: GovernanceDoctrineDurabilityArea;
  baseScore: number;
  description: string;
  evidence: string[];
  limitations: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  findingCount?: number;
}): GovernanceDoctrineDurabilityAreaAssessment => {
  const evidence = unique(params.evidence);
  const limitations = unique(params.limitations);
  const factors = unique(params.factors);
  const score = calculateDoctrineDurabilityAreaScore({
    baseScore: params.baseScore,
    evidenceCount: evidence.length,
    limitationCount: limitations.length,
    findingCount: params.findingCount ?? 0,
    explainabilityCount: factors.length + params.reasoning.length,
  });

  return {
    area: params.area,
    score,
    classification: doctrineDurabilityClassificationFromScore(score),
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

const buildAreaAssessments = (input: GovernanceDoctrineDurabilityInput): GovernanceDoctrineDurabilityAreaAssessment[] => {
  const doctrinePrinciples = input.doctrinePrinciples ?? input.doctrineResult?.principles ?? [];
  const auditFindings = getAuditFindings(input);
  const recommendations = getRecommendations(input);
  const auditCategories = unique([
    ...auditFindings.map((finding) => finding.category),
    ...recommendations.map((recommendation) => recommendation.category),
    ...Object.keys(input.auditResult?.categoryScores ?? {}),
    ...(input.normalizationResult?.mappings.flatMap((mapping) => mapping.auditCategories) ?? []),
    ...(input.traceabilityResult?.traces.map((trace) => trace.auditCategory) ?? []),
  ]);
  const explainabilityRuleCount =
    (input.doctrineResult?.explainability.doctrineRulesApplied.length ?? 0) +
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
      baseScore: doctrinePrinciples.length >= 6 ? 76 : 48,
      description: "Evaluates whether doctrine principles have enough structure to remain durable as governance modules expand.",
      evidence: doctrinePrinciples.map((principle) => `${principle.principleType}: ${principle.title} (${principle.confidenceScore}/100).`),
      limitations: doctrinePrinciples.length === 0 ? ["Doctrine principles were not supplied."] : [],
      recommendedHumanReview: "Review principle coverage and confidence before relying on doctrine durability.",
      factors: [`Doctrine principles: ${doctrinePrinciples.length}.`],
      reasoning: ["Doctrine principles are more durable when they are typed, explainable, evidence-supported, and broad enough for future modules."],
    }),
    createAreaAssessment({
      area: "doctrine_classifications",
      baseScore: scoreFromStatus(input.doctrineResult?.doctrineStatus),
      description: "Evaluates whether doctrine classification semantics appear durable.",
      evidence: [
        `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
        `Doctrine confidence: ${input.doctrineResult?.doctrineConfidenceScore ?? "not_supplied"}.`,
      ],
      limitations: input.doctrineResult?.doctrineLimitations ?? ["Doctrine result was not supplied."],
      recommendedHumanReview: "Review doctrine status and limitations before using doctrine classification as durable institutional context.",
      factors: [`Doctrine drift findings: ${input.doctrineResult?.driftFindings.length ?? "not_supplied"}.`],
      reasoning: ["Doctrine classification durability requires stable status language, limited drift, and visible limitations."],
      findingCount: input.doctrineResult?.driftFindings.length ?? 1,
    }),
    createAreaAssessment({
      area: "audit_semantics",
      baseScore: scoreFromStatus(input.auditResult?.auditClassification),
      description: "Evaluates whether audit categories and audit classifications can scale without semantic confusion.",
      evidence: [`Audit classification: ${input.auditResult?.auditClassification ?? "not_supplied"}.`, `Audit categories: ${auditCategories.length}.`],
      limitations: input.auditResult?.limitations ?? ["Full system governance audit result was not supplied."],
      recommendedHumanReview: "Review audit taxonomy breadth before relying on audit semantics for future governance expansion.",
      factors: [`Audit findings: ${auditFindings.length}.`, `Audit recommendations: ${recommendations.length}.`],
      reasoning: ["Audit semantics are more durable when category coverage, recommendations, limitations, and explainability are present."],
    }),
    createAreaAssessment({
      area: "scoring_semantics",
      baseScore: Math.min(
        90,
        scoreFromStatus(input.semanticStabilityResult?.semanticStabilityClassification) * 0.5 +
          scoreFromStatus(input.normalizationResult?.normalizationClassification) * 0.5,
      ),
      description: "Evaluates whether scoring driver language remains deterministic and explainable.",
      evidence: [
        `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
        `Normalization: ${input.normalizationResult?.normalizationClassification ?? "not_supplied"}.`,
        ...(input.semanticStabilityResult?.scoringSemanticFindings ?? []),
      ],
      limitations: input.semanticStabilityResult?.explainability.limitations ?? ["Semantic stability result was not supplied."],
      recommendedHumanReview: "Review scoring semantic findings before future score expansion or registry reasoning.",
      factors: [`Scoring semantic findings: ${input.semanticStabilityResult?.scoringSemanticFindings.length ?? "not_supplied"}.`],
      reasoning: ["Scoring semantics are durable only when score drivers remain stable, traceable, and free from hidden interpretation."],
    }),
    createAreaAssessment({
      area: "evidence_semantics",
      baseScore: Math.min(
        90,
        scoreFromStatus(input.traceabilityResult?.traceabilityClassification) * 0.5 +
          scoreFromStatus(input.evidenceQualityResult?.overallReliabilityLevel) * 0.5,
      ),
      description: "Evaluates whether evidence semantics can survive future traceability expansion.",
      evidence: [
        `Traceability: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
        `Evidence reliability: ${input.evidenceQualityResult?.overallReliabilityLevel ?? "not_supplied"}.`,
        ...(input.semanticStabilityResult?.evidenceSemanticFindings ?? []),
      ],
      limitations: [
        ...(!input.traceabilityResult ? ["Traceability result was not supplied."] : []),
        ...(!input.evidenceQualityResult ? ["Evidence quality result was not supplied."] : []),
        ...(input.evidenceQualityResult?.missingEvidenceAreas ?? []),
      ],
      recommendedHumanReview: "Review evidence quality and traceability before expanding evidence semantics.",
      factors: [`Traceability gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
      reasoning: ["Evidence semantics are durable when evidence reliability, trace links, and limitations remain visible."],
    }),
    createAreaAssessment({
      area: "traceability_semantics",
      baseScore: scoreFromStatus(input.traceabilityResult?.traceabilityClassification),
      description: "Evaluates whether traceability semantics remain durable as evidence chains expand.",
      evidence: [
        `Traceability score: ${input.traceabilityResult?.traceabilityScore ?? "not_supplied"}.`,
        `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
        ...(input.semanticStabilityResult?.traceabilitySemanticFindings ?? []),
      ],
      limitations: input.traceabilityResult?.evidenceGaps ?? ["Traceability result was not supplied."],
      recommendedHumanReview: "Review traceability gaps before relying on doctrine durability.",
      factors: [`Trace links: ${input.traceabilityResult?.traces.length ?? "not_supplied"}.`],
      reasoning: ["Traceability durability requires source attribution, evidence links, reasoning links, limitations, and recommendation linkage."],
      findingCount: input.traceabilityResult?.gaps.length ?? 1,
    }),
    createAreaAssessment({
      area: "recommendation_semantics",
      baseScore: recommendations.length > 0 || (input.doctrineResult?.recommendations.length ?? 0) > 0 ? 70 : 42,
      description: "Evaluates whether recommendation language remains neutral, reviewable, and durable.",
      evidence: [
        `Audit recommendations: ${recommendations.length}.`,
        `Doctrine recommendations: ${input.doctrineResult?.recommendations.length ?? "not_supplied"}.`,
        ...(input.semanticStabilityResult?.recommendationSemanticFindings ?? []),
      ],
      limitations: input.semanticStabilityResult?.recommendationSemanticFindings ?? [],
      recommendedHumanReview: "Review recommendation language before future governance expansion.",
      factors: [`Recommendation semantic findings: ${input.semanticStabilityResult?.recommendationSemanticFindings.length ?? "not_supplied"}.`],
      reasoning: ["Recommendation semantics are durable when they stay neutral, human-review oriented, and traceable to evidence."],
    }),
    createAreaAssessment({
      area: "limitation_semantics",
      baseScore: (input.semanticStabilityResult?.limitationSemanticFindings.length ?? 1) === 0 ? 76 : 58,
      description: "Evaluates whether limitation language remains durable enough to preserve reviewability.",
      evidence: [
        `Audit limitations: ${input.auditResult?.limitations.length ?? "not_supplied"}.`,
        `Doctrine limitations: ${input.doctrineResult?.doctrineLimitations.length ?? "not_supplied"}.`,
        ...(input.semanticStabilityResult?.limitationSemanticFindings ?? []),
      ],
      limitations: input.semanticStabilityResult?.limitationSemanticFindings ?? ["Semantic stability result was not supplied."],
      recommendedHumanReview: "Review limitation language before future module or industry expansion.",
      factors: [`Limitation semantic findings: ${input.semanticStabilityResult?.limitationSemanticFindings.length ?? "not_supplied"}.`],
      reasoning: ["Limitation semantics are durable when boundaries, evidence limitations, and human-review constraints remain visible."],
    }),
    createAreaAssessment({
      area: "readiness_semantics",
      baseScore: scoreFromStatus(input.readinessResult?.readinessClassification),
      description: "Evaluates whether readiness semantics can remain durable as governance preparedness expands.",
      evidence: [
        `Readiness classification: ${input.readinessResult?.readinessClassification ?? "not_supplied"}.`,
        `Readiness score: ${input.readinessResult?.overallReadinessScore ?? "not_supplied"}.`,
      ],
      limitations: input.readinessResult?.limitations ?? ["Readiness result was not supplied."],
      recommendedHumanReview: "Review readiness semantics before relying on doctrine durability across new governance surfaces.",
      factors: [`Readiness drift signals: ${input.readinessResult?.driftSignals.length ?? "not_supplied"}.`],
      reasoning: ["Readiness semantics support durability when preparedness classifications and drift signals stay explainable."],
    }),
    createAreaAssessment({
      area: "assurance_semantics",
      baseScore: scoreFromStatus(input.assuranceResult?.overallAssuranceStatus),
      description: "Evaluates whether assurance semantics remain durable for human-review confidence.",
      evidence: [
        `Assurance status: ${input.assuranceResult?.overallAssuranceStatus ?? "not_supplied"}.`,
        `Assurance score: ${input.assuranceResult?.governanceAssuranceScore ?? "not_supplied"}.`,
      ],
      limitations: input.assuranceResult?.explainability.limitations ?? ["Assurance result was not supplied."],
      recommendedHumanReview: "Review assurance weaknesses before treating doctrine as durable.",
      factors: [`Assurance drift findings: ${input.assuranceResult?.assuranceDriftFindings.length ?? "not_supplied"}.`],
      reasoning: ["Assurance semantics help doctrine survive future growth when confidence and limitations remain visible."],
    }),
    createAreaAssessment({
      area: "continuity_semantics",
      baseScore: scoreFromStatus(input.continuityResult?.continuityStatus),
      description: "Evaluates whether continuity semantics support doctrine survival over time.",
      evidence: [
        `Continuity status: ${input.continuityResult?.continuityStatus ?? "not_supplied"}.`,
        `Continuity score: ${input.continuityResult?.governanceContinuityScore ?? "not_supplied"}.`,
      ],
      limitations: input.continuityResult?.explainability.limitations ?? ["Continuity result was not supplied."],
      recommendedHumanReview: "Review continuity drift before relying on long-horizon doctrine durability.",
      factors: [`Continuity drift findings: ${input.continuityResult?.driftFindings.length ?? "not_supplied"}.`],
      reasoning: ["Doctrine durability improves when continuity status, drift findings, and reviewability assessments remain stable."],
    }),
    createAreaAssessment({
      area: "resilience_semantics",
      baseScore: scoreFromStatus(input.resilienceResult?.resilienceStatus),
      description: "Evaluates whether resilience semantics support doctrine under future stress and expansion.",
      evidence: [
        `Resilience status: ${input.resilienceResult?.resilienceStatus ?? "not_supplied"}.`,
        `Resilience score: ${input.resilienceResult?.governanceResilienceScore ?? "not_supplied"}.`,
      ],
      limitations: input.resilienceResult?.explainability.limitations ?? ["Resilience result was not supplied."],
      recommendedHumanReview: "Review resilience weaknesses before relying on doctrine under future operational pressure.",
      factors: [`Resilience weaknesses: ${input.resilienceResult?.resilienceWeaknesses.length ?? "not_supplied"}.`],
      reasoning: ["Doctrine durability under pressure depends on resilient, reviewable, and explainable governance semantics."],
    }),
    createAreaAssessment({
      area: "normalization_semantics",
      baseScore: scoreFromStatus(input.normalizationResult?.normalizationClassification),
      description: "Evaluates whether normalization semantics are durable enough for future registry adoption.",
      evidence: [
        `Normalization classification: ${input.normalizationResult?.normalizationClassification ?? "not_supplied"}.`,
        `Normalization score: ${input.normalizationResult?.normalizationScore ?? "not_supplied"}.`,
      ],
      limitations: input.normalizationResult?.missingMappings ?? ["Normalization result was not supplied."],
      recommendedHumanReview: "Review normalization gaps before future doctrine registry adoption.",
      factors: [`Normalization gaps: ${input.normalizationResult?.gaps.length ?? "not_supplied"}.`],
      reasoning: ["Normalization semantics are durable when principle, evidence, scoring, recommendation, limitation, and reasoning mappings stay stable."],
    }),
    createAreaAssessment({
      area: "registry_readiness_semantics",
      baseScore: scoreFromStatus(input.registryReviewResult?.registryReadinessClassification),
      description: "Evaluates whether registry readiness semantics support future registry adoption without centralizing enforcement.",
      evidence: [
        `Registry readiness: ${input.registryReviewResult?.registryReadinessClassification ?? "not_supplied"}.`,
        `Registry readiness score: ${input.registryReviewResult?.registryReadinessScore ?? "not_supplied"}.`,
        ...(input.registryReviewResult?.registryReadinessClassification === "institutionally_registry_ready"
          ? ["Registry review indicates strong future registry candidate context."]
          : []),
      ],
      limitations: input.registryReviewResult?.reviewLimitations ?? ["Registry review result was not supplied."],
      recommendedHumanReview: "Review registry readiness implications before any future registry design.",
      factors: [`Registry findings: ${input.registryReviewResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Registry readiness semantics should support future consistency without becoming centralized governance enforcement."],
    }),
    createAreaAssessment({
      area: "future_module_expansion",
      baseScore: Math.min(
        86,
        [
          input.semanticStabilityResult,
          input.registryReviewResult,
          input.normalizationResult,
          input.traceabilityResult,
          input.auditResult,
          input.readinessResult,
          input.assuranceResult,
          input.doctrineResult,
          input.resilienceResult,
          input.continuityResult,
        ].filter(Boolean).length * 9,
      ),
      description: "Evaluates whether doctrine context can absorb future governance modules without losing reviewability.",
      evidence: [
        `Governance context layers supplied: ${
          [
            input.semanticStabilityResult,
            input.registryReviewResult,
            input.normalizationResult,
            input.traceabilityResult,
            input.auditResult,
            input.readinessResult,
            input.assuranceResult,
            input.doctrineResult,
            input.resilienceResult,
            input.continuityResult,
          ].filter(Boolean).length
        }.`,
      ],
      limitations: [
        ...(!input.semanticStabilityResult ? ["Semantic stability result was not supplied."] : []),
        ...(!input.registryReviewResult ? ["Registry review result was not supplied."] : []),
        ...(!input.traceabilityResult ? ["Traceability result was not supplied."] : []),
      ],
      recommendedHumanReview: "Review context completeness before expanding doctrine across future modules.",
      factors: ["Future module expansion requires layered, explainable governance context."],
      reasoning: ["Doctrine durability improves when upstream review layers are supplied together and remain read-only."],
    }),
    createAreaAssessment({
      area: "future_orchestration_growth",
      baseScore: 76,
      description: "Evaluates whether doctrine durability remains isolated from future orchestration growth.",
      evidence: [
        "Doctrine durability review is read-only.",
        "No execution, workflow mutation, outreach, messaging, blocking, or remediation pathway is introduced.",
      ],
      limitations: ["Future orchestration integrations must remain separate from pure doctrine review engines."],
      recommendedHumanReview: "Keep future orchestration adoption behind explicit human-reviewed boundaries.",
      factors: ["Read-only orchestration boundary preserved."],
      reasoning: ["Doctrine remains more durable when review engines stay separate from execution and orchestration systems."],
    }),
    createAreaAssessment({
      area: "multi_industry_scalability",
      baseScore: 74,
      description: "Evaluates whether doctrine semantics avoid single-industry coupling.",
      evidence: [
        "Doctrine durability review uses governance, evidence, audit, traceability, and semantic terms rather than property-specific facts.",
        "No protected-class, demographic, legal, tax, lending, or investment conclusion is produced.",
      ],
      limitations: ["Future adapters should remain separate from core doctrine durability review logic."],
      recommendedHumanReview: "Review future adapters for business-specific leakage before broad industry expansion.",
      factors: ["Core review terms remain business-line neutral."],
      reasoning: ["Multi-industry durability improves when doctrine semantics remain operational and adapter-neutral."],
    }),
    createAreaAssessment({
      area: "explainability_expansion",
      baseScore: explainabilityRuleCount >= 24 ? 82 : 56,
      description: "Evaluates whether explainability contracts are deep enough to support future doctrine expansion.",
      evidence: [`Explainability rules supplied across layers: ${explainabilityRuleCount}.`],
      limitations: explainabilityRuleCount < 16 ? ["Explainability rule depth is limited across supplied layers."] : [],
      recommendedHumanReview: "Review explainability depth before future doctrine expansion or registry adoption.",
      factors: [`Explainability rule count: ${explainabilityRuleCount}.`],
      reasoning: ["Doctrine durability depends on visible rules, major drivers, limitations, and human-review recommendations."],
    }),
  ];
};

const createFinding = (params: {
  findingType: GovernanceDoctrineDurabilityFindingType;
  area: GovernanceDoctrineDurabilityArea;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedAuditCategories?: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): GovernanceDoctrineDurabilityFinding => {
  const evidence = unique(params.evidence);
  const factors = unique(params.factors);

  return {
    id: `governance-doctrine-durability-${slug(params.findingType)}-${slug(params.area)}-${slug(params.description)}`,
    findingType: params.findingType,
    area: params.area,
    severity: params.severity,
    description: params.description,
    evidence,
    affectedAuditCategories: unique(params.affectedAuditCategories ?? []) as FullSystemGovernanceAuditCategory[],
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateDoctrineDurabilityFindingConfidence({
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

const buildFindings = (input: GovernanceDoctrineDurabilityInput): GovernanceDoctrineDurabilityFinding[] => {
  const findings: GovernanceDoctrineDurabilityFinding[] = [];
  const auditCategories = unique([
    ...getAuditFindings(input).map((finding) => finding.category),
    ...Object.keys(input.auditResult?.categoryScores ?? {}),
  ]) as FullSystemGovernanceAuditCategory[];

  if (!input.doctrineResult || input.doctrineResult.doctrineStatus === "thin" || input.doctrineResult.driftFindings.length > 0) {
    findings.push(
      createFinding({
        findingType: "brittle_doctrine_assumption",
        area: "doctrine_classifications",
        severity: !input.doctrineResult || input.doctrineResult.doctrineStatus === "thin" ? "elevated" : "moderate",
        description: "Doctrine durability is limited by missing doctrine context, thin status, or drift findings.",
        evidence: [
          `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
          `Doctrine drift findings: ${input.doctrineResult?.driftFindings.length ?? "not_supplied"}.`,
          ...(input.doctrineResult?.driftFindings.map((finding) => finding.description).slice(0, 6) ?? []),
        ],
        recommendedHumanReview: "Review doctrine drift and support before treating doctrine as durable.",
        factors: [`Doctrine supplied: ${Boolean(input.doctrineResult)}.`],
        reasoning: ["Durable doctrine needs stable principles, clear limitations, and limited drift over time."],
      }),
    );
  }

  if (
    input.registryReviewResult &&
    ["registry_candidate", "institutionally_registry_ready"].includes(input.registryReviewResult.registryReadinessClassification) &&
    !semanticVersionSupplied(input)
  ) {
    findings.push(
      createFinding({
        findingType: "governance_rigidity_risk",
        area: "registry_readiness_semantics",
        severity: "moderate",
        description: "Registry readiness is improving, but semantic versioning is not supplied.",
        evidence: [
          `Registry readiness: ${input.registryReviewResult.registryReadinessClassification}.`,
          "Semantic version metadata was not supplied.",
        ],
        recommendedHumanReview: "Review semantic versioning before any future registry adoption to avoid rigid or stale doctrine semantics.",
        factors: ["Registry readiness without versioning can create rigidity risk."],
        reasoning: ["Future registry discipline should preserve adaptability without becoming centralized enforcement."],
      }),
    );
  }

  if (
    !input.semanticStabilityResult ||
    ["unstable", "mostly_stable"].includes(input.semanticStabilityResult.semanticStabilityClassification) ||
    input.semanticStabilityResult.findings.length > 0
  ) {
    findings.push(
      createFinding({
        findingType: "semantic_durability_weakness",
        area: "scoring_semantics",
        severity: !input.semanticStabilityResult || input.semanticStabilityResult.semanticStabilityClassification === "unstable" ? "elevated" : "moderate",
        description: "Semantic stability context indicates doctrine durability should remain under human review.",
        evidence: [
          `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
          ...(input.semanticStabilityResult?.driftRisks.slice(0, 8) ?? []),
        ],
        recommendedHumanReview: "Review semantic stability findings before relying on doctrine durability.",
        factors: [`Semantic findings: ${input.semanticStabilityResult?.findings.length ?? "not_supplied"}.`],
        reasoning: ["Doctrine durability is weaker when terminology, classification, evidence, recommendation, limitation, or traceability semantics are unstable."],
      }),
    );
  }

  if ((input.registryReviewResult?.taxonomyStabilityFindings.length ?? 0) > 0 && auditCategories.length < 12) {
    findings.push(
      createFinding({
        findingType: "taxonomy_expansion_risk",
        area: "audit_semantics",
        severity: "moderate",
        description: "Audit taxonomy and registry taxonomy context may need more review before future expansion.",
        evidence: [
          `Audit categories represented: ${auditCategories.length}.`,
          ...(input.registryReviewResult?.taxonomyStabilityFindings.slice(0, 8) ?? []),
        ],
        affectedAuditCategories: auditCategories,
        recommendedHumanReview: "Review taxonomy coverage before future governance expansion.",
        factors: ["Taxonomy expansion risk is evaluated from audit category coverage and registry taxonomy findings."],
        reasoning: ["Doctrine durability across future modules requires audit taxonomy breadth and stable category semantics."],
      }),
    );
  }

  if (!input.semanticStabilityResult || !input.registryReviewResult || !input.normalizationResult || !input.traceabilityResult) {
    findings.push(
      createFinding({
        findingType: "future_scaling_incompatibility",
        area: "future_module_expansion",
        severity: "elevated",
        description: "Future scaling review context is incomplete.",
        evidence: [
          `Semantic stability supplied: ${Boolean(input.semanticStabilityResult)}.`,
          `Registry review supplied: ${Boolean(input.registryReviewResult)}.`,
          `Normalization supplied: ${Boolean(input.normalizationResult)}.`,
          `Traceability supplied: ${Boolean(input.traceabilityResult)}.`,
        ],
        recommendedHumanReview: "Supply semantic stability, registry review, normalization, and traceability context before relying on scaling durability.",
        factors: ["Future scaling durability requires layered review context."],
        reasoning: ["Doctrine durability under future growth is weaker when upstream review layers are missing."],
      }),
    );
  }

  if (
    (input.registryReviewResult?.semanticDriftRisks.length ?? 0) > 0 ||
    (input.normalizationResult?.inconsistentMappings.length ?? 0) > 0 ||
    (input.doctrineResult?.driftFindings.length ?? 0) > 2
  ) {
    findings.push(
      createFinding({
        findingType: "governance_fragmentation_risk",
        area: "governance_principles",
        severity: "elevated",
        description: "Doctrine, registry, or normalization context indicates governance fragmentation risk.",
        evidence: [
          ...(input.registryReviewResult?.semanticDriftRisks.slice(0, 6) ?? []),
          ...(input.normalizationResult?.inconsistentMappings.slice(0, 6) ?? []),
          ...(input.doctrineResult?.driftFindings.map((finding) => finding.description).slice(0, 6) ?? []),
        ],
        recommendedHumanReview: "Review fragmentation signals before future doctrine expansion.",
        factors: [
          `Registry semantic drift risks: ${input.registryReviewResult?.semanticDriftRisks.length ?? "not_supplied"}.`,
          `Inconsistent normalization mappings: ${input.normalizationResult?.inconsistentMappings.length ?? "not_supplied"}.`,
        ],
        reasoning: ["Fragmented doctrine is less likely to survive future modules, industries, and audit growth without human-reviewed stabilization."],
      }),
    );
  }

  if (
    ["not_ready", "weak", "fragile", "unstable", "fragmented"].includes(input.readinessResult?.readinessClassification ?? "") ||
    ["weak"].includes(input.assuranceResult?.overallAssuranceStatus ?? "") ||
    ["fragile"].includes(input.resilienceResult?.resilienceStatus ?? "") ||
    ["fragile"].includes(input.continuityResult?.continuityStatus ?? "")
  ) {
    findings.push(
      createFinding({
        findingType: "classification_instability_risk",
        area: "readiness_semantics",
        severity: "elevated",
        description: "Some governance classifications indicate fragile or weak durability context.",
        evidence: [
          `Readiness: ${input.readinessResult?.readinessClassification ?? "not_supplied"}.`,
          `Assurance: ${input.assuranceResult?.overallAssuranceStatus ?? "not_supplied"}.`,
          `Resilience: ${input.resilienceResult?.resilienceStatus ?? "not_supplied"}.`,
          `Continuity: ${input.continuityResult?.continuityStatus ?? "not_supplied"}.`,
        ],
        recommendedHumanReview: "Review classification stability before relying on doctrine durability.",
        factors: ["Weak or fragile classifications reduce durability confidence."],
        reasoning: ["Doctrine durability depends on stable classifications across readiness, assurance, resilience, and continuity layers."],
      }),
    );
  }

  if ((input.normalizationResult?.mappings.some((mapping) => mapping.auditCategories.length > 4) ?? false) || auditCategories.length > 18) {
    findings.push(
      createFinding({
        findingType: "doctrine_coupling_risk",
        area: "normalization_semantics",
        severity: "moderate",
        description: "Some doctrine mappings may be carrying broad audit semantics.",
        evidence: [
          ...(input.normalizationResult?.mappings
            .filter((mapping) => mapping.auditCategories.length > 4)
            .map((mapping) => `${mapping.principleLabel}: ${mapping.auditCategories.length} audit categories.`) ?? []),
          `Audit categories represented: ${auditCategories.length}.`,
        ],
        affectedAuditCategories: auditCategories,
        recommendedHumanReview: "Review broad doctrine-to-audit mappings before future taxonomy expansion.",
        factors: ["Broad mappings can create hidden doctrine coupling across audit categories."],
        reasoning: ["Doctrine durability improves when principles are reusable without becoming overloaded taxonomy containers."],
      }),
    );
  }

  if (!input.traceabilityResult || input.traceabilityResult.gaps.length > 0 || ["weak", "moderate"].includes(input.traceabilityResult.traceabilityClassification)) {
    findings.push(
      createFinding({
        findingType: "traceability_durability_risk",
        area: "traceability_semantics",
        severity: !input.traceabilityResult || input.traceabilityResult.traceabilityClassification === "weak" ? "elevated" : "moderate",
        description: "Traceability context has gaps or limited strength.",
        evidence: [
          `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
          ...(input.traceabilityResult?.gaps.map((gap) => gap.description).slice(0, 8) ?? []),
        ],
        recommendedHumanReview: "Review traceability gaps before future evidence chain expansion.",
        factors: [`Traceability gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
        reasoning: ["Doctrine durability requires evidence, reasoning, limitation, and recommendation traceability to survive future expansion."],
      }),
    );
  }

  if (!semanticVersionSupplied(input)) {
    findings.push(
      createFinding({
        findingType: "semantic_versioning_risk",
        area: "registry_readiness_semantics",
        severity: "moderate",
        description: "Semantic versioning metadata is not supplied.",
        evidence: [
          `semanticVersion supplied: ${typeof input.metadata?.semanticVersion === "string"}.`,
          `registryVersion supplied: ${typeof input.metadata?.registryVersion === "string"}.`,
          `doctrineVersion supplied: ${typeof input.metadata?.doctrineVersion === "string"}.`,
          `taxonomyVersion supplied: ${typeof input.metadata?.taxonomyVersion === "string"}.`,
        ],
        recommendedHumanReview: "Define semantic versioning expectations before future registry, doctrine, or taxonomy persistence work.",
        factors: ["No semantic, registry, doctrine, or taxonomy version metadata was supplied."],
        reasoning: ["Semantic versioning helps doctrine survive long-horizon vocabulary and taxonomy changes without hidden mutation."],
      }),
    );
  }

  if (
    !input.semanticStabilityResult ||
    !input.doctrineResult ||
    (input.semanticStabilityResult?.explainability.semanticStabilityRulesApplied.length ?? 0) < 4 ||
    (input.doctrineResult?.explainability.doctrineRulesApplied.length ?? 0) < 4
  ) {
    findings.push(
      createFinding({
        findingType: "explainability_durability_risk",
        area: "explainability_expansion",
        severity: "moderate",
        description: "Explainability depth may be limited for future doctrine expansion.",
        evidence: [
          `Semantic explainability rules: ${input.semanticStabilityResult?.explainability.semanticStabilityRulesApplied.length ?? "not_supplied"}.`,
          `Doctrine explainability rules: ${input.doctrineResult?.explainability.doctrineRulesApplied.length ?? "not_supplied"}.`,
        ],
        recommendedHumanReview: "Review explainability depth before future doctrine expansion.",
        factors: ["Durability depends on stable rules, limitations, major drivers, and review notes across layers."],
        reasoning: ["Explainability durability prevents doctrine from becoming opaque as future modules and audit categories are added."],
      }),
    );
  }

  if (
    !input.memoryResult ||
    !input.lineageResult ||
    !input.continuityResult ||
    (input.continuityResult?.continuityStatus === "fragile" || input.lineageResult?.lineageIntegrityScore < 55)
  ) {
    findings.push(
      createFinding({
        findingType: "institutional_survivability_risk",
        area: "continuity_semantics",
        severity: !input.memoryResult || !input.lineageResult ? "elevated" : "moderate",
        description: "Institutional survivability context is incomplete or weakened.",
        evidence: [
          `Memory supplied: ${Boolean(input.memoryResult)}.`,
          `Lineage supplied: ${Boolean(input.lineageResult)}.`,
          `Continuity status: ${input.continuityResult?.continuityStatus ?? "not_supplied"}.`,
          `Lineage integrity: ${input.lineageResult?.lineageIntegrityScore ?? "not_supplied"}.`,
        ],
        recommendedHumanReview: "Review memory, lineage, and continuity context before treating doctrine as institutionally durable.",
        factors: ["Institutional survivability depends on memory, lineage, continuity, and reviewable historical context."],
        reasoning: ["Doctrine is more durable when institutional memory and lineage preserve why governance meaning changed over time."],
      }),
    );
  }

  return findings;
};

export function analyzeGovernanceDoctrineDurability(
  input: GovernanceDoctrineDurabilityInput,
): GovernanceDoctrineDurabilityResult {
  const areaAssessments = buildAreaAssessments(input);
  const findings = buildFindings(input);
  const doctrineDurabilityScore = calculateOverallDoctrineDurabilityScore({ areaAssessments, findings });
  const resultWithoutExplainability = {
    doctrineDurabilityScore,
    doctrineDurabilityClassification: doctrineDurabilityClassificationFromScore(doctrineDurabilityScore),
    areaAssessments,
    findings,
    durableDoctrineAreas: unique(
      areaAssessments
        .filter((assessment) => assessment.classification === "durable" || assessment.classification === "institutionally_durable")
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    fragileDoctrineAreas: unique(
      areaAssessments
        .filter((assessment) => assessment.classification === "fragile" || assessment.classification === "conditionally_durable")
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    futureScalingRisks: unique(
      findings
        .filter((finding) => finding.findingType === "future_scaling_incompatibility" || finding.findingType === "taxonomy_expansion_risk")
        .map((finding) => finding.description),
    ),
    futureGovernanceExpansionRisks: unique(
      findings
        .filter((finding) =>
          ["governance_rigidity_risk", "governance_fragmentation_risk", "doctrine_coupling_risk"].includes(finding.findingType),
        )
        .map((finding) => finding.description),
    ),
    semanticDurabilityFindings: unique(
      findings
        .filter((finding) =>
          ["semantic_durability_weakness", "semantic_versioning_risk", "classification_instability_risk"].includes(finding.findingType),
        )
        .map((finding) => finding.description),
    ),
    traceabilityDurabilityFindings: unique(
      findings.filter((finding) => finding.findingType === "traceability_durability_risk").map((finding) => finding.description),
    ),
    auditDurabilityFindings: unique(
      findings
        .filter((finding) => finding.area === "audit_semantics" || finding.findingType === "taxonomy_expansion_risk")
        .map((finding) => finding.description),
    ),
    explainabilityDurabilityFindings: unique(
      findings.filter((finding) => finding.findingType === "explainability_durability_risk").map((finding) => finding.description),
    ),
    institutionalSurvivabilityFindings: unique(
      findings.filter((finding) => finding.findingType === "institutional_survivability_risk").map((finding) => finding.description),
    ),
    governanceContinuityImplications: unique([
      `Continuity status: ${input.continuityResult?.continuityStatus ?? "not_supplied"}.`,
      `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
      `Registry readiness: ${input.registryReviewResult?.registryReadinessClassification ?? "not_supplied"}.`,
      ...(input.continuityResult?.continuityWeaknesses ?? []),
      ...(input.semanticStabilityResult?.registryReadinessImplications ?? []),
    ]),
    humanReviewNotes: unique([
      ...findings.map((finding) => finding.recommendedHumanReview),
      "Do not mutate doctrine, centralize governance control, or introduce doctrine enforcement during this review-only stage.",
      "Do not implement persistence, routes, automation, or orchestration pathways from doctrine durability review outputs.",
    ]),
    futureStabilizationRecommendations: [
      "Review semantic versioning before future registry, doctrine, taxonomy, or persistence work.",
      "Review traceability durability before expanding evidence chains or future audit categories.",
      "Review doctrine durability with memory, lineage, continuity, semantic stability, registry review, normalization, and traceability supplied together.",
      "Keep future governance expansion adapters separate from pure doctrine review engines.",
      "Consider shared deterministic utility extraction only after survivability and expansion review confirms stable boundaries.",
    ],
    humanReviewRequired:
      findings.length > 0 ||
      areaAssessments.some(
        (assessment) => assessment.classification === "fragile" || assessment.classification === "conditionally_durable",
      ),
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernanceDoctrineDurabilityExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}

export const getGovernanceDoctrineDurabilityReview = analyzeGovernanceDoctrineDurability;
