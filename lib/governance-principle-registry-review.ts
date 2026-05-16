import { buildGovernancePrincipleRegistryReviewExplainability } from "./governance-principle-registry-review-explainability";
import {
  calculateReadinessAreaScore,
  calculateRegistryReadinessScore,
  calculateRegistryReviewFindingConfidence,
  registryReadinessClassificationFromScore,
} from "./governance-principle-registry-review-scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
} from "./full-system-governance-audit-types";
import type {
  GovernancePrincipleRegistryReadinessArea,
  GovernancePrincipleRegistryReadinessAreaType,
  GovernancePrincipleRegistryReviewFinding,
  GovernancePrincipleRegistryReviewFindingType,
  GovernancePrincipleRegistryReviewInput,
  GovernancePrincipleRegistryReviewRecommendation,
  GovernancePrincipleRegistryReviewResult,
} from "./governance-principle-registry-review-types";
import type {
  PrincipleEvidenceNormalizedMapping,
  PrincipleEvidenceNormalizationGap,
} from "./principle-evidence-normalization-types";
import type {
  ReputationGovernanceDoctrinePrinciple,
  ReputationGovernanceDoctrinePrincipleType,
} from "./reputation/reputation-governance-doctrine-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const getDoctrinePrinciples = (input: GovernancePrincipleRegistryReviewInput): ReputationGovernanceDoctrinePrinciple[] =>
  input.doctrinePrinciples ?? input.doctrineResult?.principles ?? [];

const getMappings = (input: GovernancePrincipleRegistryReviewInput): PrincipleEvidenceNormalizedMapping[] =>
  input.normalizedMappings ?? input.normalizationResult?.mappings ?? [];

const getNormalizationGaps = (input: GovernancePrincipleRegistryReviewInput): PrincipleEvidenceNormalizationGap[] =>
  input.normalizationResult?.gaps ?? [];

const getAuditFindings = (input: GovernancePrincipleRegistryReviewInput): FullSystemGovernanceAuditFinding[] =>
  input.auditFindings ?? input.auditResult?.findings ?? [];

const getRecommendations = (input: GovernancePrincipleRegistryReviewInput): FullSystemGovernanceAuditRecommendation[] =>
  input.recommendations ?? input.auditResult?.recommendations ?? [];

const countSupplied = (items: unknown[]): number => items.filter(Boolean).length;

const scoreFromStatus = (status: string | undefined): number => {
  if (!status) return 42;
  if (["durable", "institutionally_consistent", "institutionally_traceable", "institutionally_strong"].includes(status)) {
    return 90;
  }
  if (["reliable", "normalized", "strong", "stable"].includes(status)) return 76;
  if (["forming", "partially_normalized", "moderate", "needs_attention"].includes(status)) return 54;
  return 32;
};

const createReadinessArea = (params: {
  areaType: GovernancePrincipleRegistryReadinessAreaType;
  description: string;
  completenessScore: number;
  consistencyScore: number;
  explainabilityScore: number;
  limitations: string[];
  evidence: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  limitationPenalty?: number;
}): GovernancePrincipleRegistryReadinessArea => {
  const score = calculateReadinessAreaScore({
    completenessScore: params.completenessScore,
    consistencyScore: params.consistencyScore,
    explainabilityScore: params.explainabilityScore,
    limitationPenalty: params.limitationPenalty,
  });

  return {
    id: `governance-principle-registry-area-${slug(params.areaType)}`,
    areaType: params.areaType,
    score,
    status: registryReadinessClassificationFromScore(score),
    description: params.description,
    evidence: unique(params.evidence),
    limitations: unique(params.limitations),
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors: unique(params.factors),
      reasoning: params.reasoning,
    },
  };
};

const buildReadinessAreas = (input: GovernancePrincipleRegistryReviewInput): GovernancePrincipleRegistryReadinessArea[] => {
  const principles = getDoctrinePrinciples(input);
  const mappings = getMappings(input);
  const findings = getAuditFindings(input);
  const recommendations = getRecommendations(input);
  const traceability = input.traceabilityResult;
  const normalization = input.normalizationResult;
  const completePrincipleIds = principles.filter((principle) => principle.id && principle.principleType && principle.title).length;
  const mappedPrinciples = unique(mappings.map((mapping) => mapping.principleType)).length;
  const auditCategories = unique([
    ...findings.map((finding) => finding.category),
    ...mappings.flatMap((mapping) => mapping.auditCategories),
    ...recommendations.map((recommendation) => recommendation.category),
  ]);
  const evidenceTypes = unique(traceability?.traces.map((trace) => trace.evidenceType) ?? []);
  const metadataVersion =
    typeof input.metadata?.semanticVersion === "string" || typeof input.metadata?.registryVersion === "string";

  return [
    createReadinessArea({
      areaType: "principle_ids",
      description: "Evaluates whether governance principles already have stable identifiers, types, and labels.",
      completenessScore: principles.length === 0 ? 30 : Math.min(100, (completePrincipleIds / principles.length) * 100),
      consistencyScore: principles.length >= 5 ? 82 : 58,
      explainabilityScore: principles.some((principle) => principle.explainability.reasoning.length > 0) ? 82 : 42,
      evidence: principles.map((principle) => `${principle.id}: ${principle.principleType} / ${principle.title}.`),
      limitations: principles.length === 0 ? ["Doctrine principles were not supplied."] : [],
      recommendedHumanReview: "Review principle identifiers and labels before approving any future registry design.",
      factors: [`Principles supplied: ${principles.length}.`, `Complete principle IDs: ${completePrincipleIds}.`],
      reasoning: ["Future registry readiness requires stable principle IDs, typed principle values, and human-readable labels."],
    }),
    createReadinessArea({
      areaType: "doctrine_categories",
      description: "Evaluates whether doctrine categories are mature enough to become reusable registry categories.",
      completenessScore: scoreFromStatus(input.doctrineResult?.doctrineStatus),
      consistencyScore: Math.max(35, 90 - (input.doctrineResult?.driftFindings.length ?? 4) * 8),
      explainabilityScore: input.doctrineResult?.explainability.doctrineRulesApplied.length ? 82 : 42,
      evidence: [
        `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
        `Doctrine drift findings: ${input.doctrineResult?.driftFindings.length ?? "not_supplied"}.`,
      ],
      limitations: !input.doctrineResult ? ["Doctrine result was not supplied."] : input.doctrineResult.doctrineLimitations.slice(0, 6),
      recommendedHumanReview: "Review doctrine stability and drift findings before treating doctrine categories as registry candidates.",
      factors: [
        `Doctrine score: ${input.doctrineResult?.doctrineConfidenceScore ?? "not_supplied"}.`,
        `Doctrine principles: ${principles.length}.`,
      ],
      reasoning: ["Doctrine categories are stronger registry candidates when status is reliable or durable and drift remains limited."],
    }),
    createReadinessArea({
      areaType: "governance_metadata",
      description: "Evaluates whether governance metadata is consistently present across principles and mappings.",
      completenessScore: Math.min(100, countSupplied([input.doctrineResult, input.normalizationResult, input.traceabilityResult, input.auditResult]) * 24),
      consistencyScore: principles.some((principle) => principle.affectedGovernanceDomains.length > 0) ? 76 : 52,
      explainabilityScore: principles.some((principle) => principle.limitations.length > 0) || mappings.some((mapping) => mapping.limitations.length > 0) ? 78 : 46,
      evidence: [
        `Doctrine supplied: ${Boolean(input.doctrineResult)}.`,
        `Normalization supplied: ${Boolean(input.normalizationResult)}.`,
        `Traceability supplied: ${Boolean(input.traceabilityResult)}.`,
        `Audit supplied: ${Boolean(input.auditResult)}.`,
      ],
      limitations: [
        ...(!input.normalizationResult ? ["Normalization result was not supplied."] : []),
        ...(!input.traceabilityResult ? ["Traceability result was not supplied."] : []),
      ],
      recommendedHumanReview: "Review whether governance metadata is complete enough to support future registry definitions.",
      factors: [`Context modules supplied: ${countSupplied([input.doctrineResult, input.normalizationResult, input.traceabilityResult, input.auditResult])}.`],
      reasoning: ["Registry metadata maturity depends on consistent principle, evidence, audit, limitation, and recommendation context."],
    }),
    createReadinessArea({
      areaType: "registry_driven_normalization",
      description: "Evaluates whether normalization output is stable enough to inform a future registry.",
      completenessScore: scoreFromStatus(normalization?.normalizationClassification),
      consistencyScore: Math.max(30, 88 - (normalization?.gaps.length ?? 6) * 4),
      explainabilityScore: normalization?.explainability.normalizationRulesApplied.length ? 84 : 42,
      evidence: [
        `Normalization classification: ${normalization?.normalizationClassification ?? "not_supplied"}.`,
        `Normalized mappings: ${mappings.length}.`,
        `Normalization gaps: ${normalization?.gaps.length ?? "not_supplied"}.`,
      ],
      limitations: !normalization ? ["Principle-to-evidence normalization result was not supplied."] : normalization.explainability.limitations,
      recommendedHumanReview: "Use normalization maturity as review context only; do not implement registry-driven normalization yet.",
      factors: [`Mapped principles: ${mappedPrinciples}.`, `Weak mappings: ${normalization?.weakMappings.length ?? "not_supplied"}.`],
      reasoning: ["A registry should wait until principle-to-evidence normalization is stable, explainable, and human-reviewed."],
    }),
    createReadinessArea({
      areaType: "reusable_governance_taxonomy",
      description: "Evaluates whether governance principle and audit terms appear reusable across enterprise contexts.",
      completenessScore: Math.min(100, (principles.length + auditCategories.length) * 8),
      consistencyScore: Math.max(38, 86 - getNormalizationGaps(input).filter((gap) => gap.gapType === "duplicated_governance_semantics").length * 12),
      explainabilityScore: mappings.some((mapping) => mapping.explainability.reasoning.length > 0) ? 80 : 44,
      evidence: [`Principles: ${principles.length}.`, `Audit categories represented: ${auditCategories.length}.`],
      limitations: auditCategories.length < 6 ? ["Limited audit category coverage was supplied."] : [],
      recommendedHumanReview: "Review taxonomy breadth and duplicated semantics before proposing reusable governance taxonomy.",
      factors: [`Unique mapped principles: ${mappedPrinciples}.`, `Audit category count: ${auditCategories.length}.`],
      reasoning: ["Reusable taxonomy readiness depends on stable terms that can travel across modules and business lines."],
    }),
    createReadinessArea({
      areaType: "evidence_taxonomy",
      description: "Evaluates whether evidence semantics are structured enough for future registry reference.",
      completenessScore: traceability ? Math.min(100, traceability.traces.length * 12) : 34,
      consistencyScore: scoreFromStatus(traceability?.traceabilityClassification),
      explainabilityScore: traceability?.explainability.traceabilityRulesApplied.length ? 84 : 42,
      evidence: [`Evidence trace types: ${evidenceTypes.join(", ") || "not_supplied"}.`, `Trace count: ${traceability?.traces.length ?? "not_supplied"}.`],
      limitations: !traceability ? ["Traceability result was not supplied."] : traceability.evidenceGaps.slice(0, 6),
      recommendedHumanReview: "Review evidence taxonomy and traceability gaps before registry design.",
      factors: [`Traceability score: ${traceability?.traceabilityScore ?? "not_supplied"}.`, `Evidence type count: ${evidenceTypes.length}.`],
      reasoning: ["Future registry references require evidence categories that are traceable, named, and explainable."],
    }),
    createReadinessArea({
      areaType: "audit_taxonomy",
      description: "Evaluates whether audit categories and recommendation classifications are stable enough for registry context.",
      completenessScore: auditCategories.length >= 12 ? 88 : Math.max(36, auditCategories.length * 6),
      consistencyScore: scoreFromStatus(input.auditResult?.auditClassification),
      explainabilityScore: input.auditResult?.explainability.auditRulesApplied.length ? 82 : 42,
      evidence: [`Audit categories represented: ${auditCategories.length}.`, `Recommendations: ${recommendations.length}.`],
      limitations: !input.auditResult ? ["Full system governance audit result was not supplied."] : input.auditResult.limitations.slice(0, 6),
      recommendedHumanReview: "Review audit taxonomy stability before using audit categories in a future registry.",
      factors: [`Audit classification: ${input.auditResult?.auditClassification ?? "not_supplied"}.`],
      reasoning: ["Audit taxonomy readiness depends on stable category names, explainable scores, and reviewable recommendation classes."],
    }),
    createReadinessArea({
      areaType: "semantic_versioning",
      description: "Evaluates whether future registry semantics have explicit versioning context.",
      completenessScore: metadataVersion ? 76 : 36,
      consistencyScore: metadataVersion ? 72 : 42,
      explainabilityScore: 58,
      evidence: [
        `Metadata semanticVersion supplied: ${typeof input.metadata?.semanticVersion === "string"}.`,
        `Metadata registryVersion supplied: ${typeof input.metadata?.registryVersion === "string"}.`,
      ],
      limitations: metadataVersion ? [] : ["No explicit semantic version or registry version metadata was supplied."],
      recommendedHumanReview: "Document semantic versioning requirements before implementing any future registry.",
      factors: [`Version metadata present: ${metadataVersion}.`],
      reasoning: ["Registry-driven governance semantics should be versioned before persistence or broader enterprise reuse."],
      limitationPenalty: metadataVersion ? 0 : 8,
    }),
    createReadinessArea({
      areaType: "institutional_governance_vocabulary",
      description: "Evaluates whether vocabulary appears stable enough for institutional governance use.",
      completenessScore: Math.min(100, unique([...principles.map((principle) => principle.title), ...mappings.map((mapping) => mapping.principleLabel)]).length * 10),
      consistencyScore: Math.max(40, 88 - getNormalizationGaps(input).filter((gap) => gap.gapType.includes("semantic")).length * 10),
      explainabilityScore: input.doctrineResult?.governancePhilosophyIndicators.length ? 78 : 48,
      evidence: unique([...principles.map((principle) => principle.title), ...mappings.map((mapping) => mapping.principleLabel)]).slice(0, 10),
      limitations: input.doctrineResult?.doctrineLimitations.slice(0, 6) ?? ["Doctrine vocabulary limitations were not supplied."],
      recommendedHumanReview: "Review governance vocabulary for clarity, neutrality, and cross-module consistency.",
      factors: [`Vocabulary terms: ${unique([...principles.map((principle) => principle.title), ...mappings.map((mapping) => mapping.principleLabel)]).length}.`],
      reasoning: ["Institutional vocabulary should be stable, neutral, explainable, and reusable before registry adoption."],
    }),
    createReadinessArea({
      areaType: "deterministic_registry_reasoning",
      description: "Evaluates whether future registry reasoning can stay deterministic and explainable.",
      completenessScore: Math.min(100, countSupplied([input.doctrineResult, input.normalizationResult, input.traceabilityResult, input.auditResult]) * 25),
      consistencyScore: 82,
      explainabilityScore: Math.min(
        100,
        (input.doctrineResult?.explainability.doctrineRulesApplied.length ?? 0) * 8 +
          (input.normalizationResult?.explainability.normalizationRulesApplied.length ?? 0) * 8 +
          (input.traceabilityResult?.explainability.traceabilityRulesApplied.length ?? 0) * 8 +
          (input.auditResult?.explainability.auditRulesApplied.length ?? 0) * 8,
      ),
      evidence: [
        `Doctrine explainability supplied: ${Boolean(input.doctrineResult?.explainability)}.`,
        `Normalization explainability supplied: ${Boolean(input.normalizationResult?.explainability)}.`,
        `Traceability explainability supplied: ${Boolean(input.traceabilityResult?.explainability)}.`,
        `Audit explainability supplied: ${Boolean(input.auditResult?.explainability)}.`,
      ],
      limitations: ["Future registry reasoning should remain deterministic and should not dynamically mutate principle meanings."],
      recommendedHumanReview: "Confirm any future registry remains deterministic, explainable, and separate from execution systems.",
      factors: ["Deterministic scoring and explainability contracts are reviewed from supplied governance outputs."],
      reasoning: ["Registry reasoning should be rule-based and human-reviewable, not dynamic policy interpretation or autonomous governance."],
    }),
  ];
};

const createFinding = (params: {
  findingType: GovernancePrincipleRegistryReviewFindingType;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedPrinciples?: ReputationGovernanceDoctrinePrincipleType[];
  affectedAuditCategories?: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): GovernancePrincipleRegistryReviewFinding => {
  const evidence = unique(params.evidence);
  const factors = unique(params.factors);

  return {
    id: `governance-principle-registry-finding-${slug(params.findingType)}-${slug(params.description)}`,
    findingType: params.findingType,
    severity: params.severity,
    description: params.description,
    evidence,
    affectedPrinciples: unique(params.affectedPrinciples ?? []) as ReputationGovernanceDoctrinePrincipleType[],
    affectedAuditCategories: unique(params.affectedAuditCategories ?? []) as FullSystemGovernanceAuditCategory[],
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateRegistryReviewFindingConfidence({
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

const duplicateLabels = (mappings: PrincipleEvidenceNormalizedMapping[]): string[] => {
  const labels = mappings.map((mapping) => normalize(mapping.principleLabel));
  return unique(labels.filter((label, index) => label && labels.indexOf(label) !== index));
};

const buildFindings = (input: GovernancePrincipleRegistryReviewInput): GovernancePrincipleRegistryReviewFinding[] => {
  const principles = getDoctrinePrinciples(input);
  const mappings = getMappings(input);
  const normalizationGaps = getNormalizationGaps(input);
  const traceGaps = input.traceabilityResult?.gaps ?? [];
  const findings: GovernancePrincipleRegistryReviewFinding[] = [];
  const duplicatedLabels = duplicateLabels(mappings);
  const categoryToPrinciples = new Map<FullSystemGovernanceAuditCategory, string[]>();

  mappings.forEach((mapping) => {
    mapping.auditCategories.forEach((category) => {
      categoryToPrinciples.set(category, unique([...(categoryToPrinciples.get(category) ?? []), mapping.principleType]));
    });
  });

  if (principles.some((principle) => !principle.id || !principle.title || !principle.principleType)) {
    findings.push(
      createFinding({
        findingType: "inconsistent_principle_naming",
        severity: "elevated",
        description: "Some governance principles are missing stable identifiers, labels, or typed principle values.",
        evidence: principles
          .filter((principle) => !principle.id || !principle.title || !principle.principleType)
          .map((principle) => `${principle.id || "missing_id"} / ${principle.principleType || "missing_type"} / ${principle.title || "missing_title"}.`),
        affectedPrinciples: principles.map((principle) => principle.principleType),
        recommendedHumanReview: "Review principle naming before considering a future registry.",
        factors: ["Principle naming requires stable id, principleType, and title."],
        reasoning: ["Registry readiness depends on deterministic principle identifiers and stable human-readable labels."],
      }),
    );
  }

  if (duplicatedLabels.length > 0) {
    findings.push(
      createFinding({
        findingType: "duplicated_principle_semantics",
        severity: duplicatedLabels.length >= 3 ? "elevated" : "moderate",
        description: "Multiple mappings share the same normalized governance vocabulary.",
        evidence: duplicatedLabels,
        recommendedHumanReview: "Review duplicated principle labels before proposing registry vocabulary.",
        factors: [`Duplicated normalized labels: ${duplicatedLabels.length}.`],
        reasoning: ["Duplicated labels can weaken registry uniqueness and principle-to-evidence clarity."],
      }),
    );
  }

  if (!input.doctrineResult || input.doctrineResult.doctrineStatus === "thin" || input.doctrineResult.driftFindings.length > 0) {
    findings.push(
      createFinding({
        findingType: "weak_doctrine_consistency",
        severity: !input.doctrineResult || input.doctrineResult.doctrineStatus === "thin" ? "elevated" : "moderate",
        description: "Doctrine consistency is not yet strong enough to treat principles as registry-ready without human review.",
        evidence: [
          `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
          `Doctrine drift findings: ${input.doctrineResult?.driftFindings.length ?? "not_supplied"}.`,
          ...(input.doctrineResult?.driftFindings.map((finding) => finding.description).slice(0, 6) ?? []),
        ],
        affectedPrinciples: principles.map((principle) => principle.principleType),
        recommendedHumanReview: "Review doctrine drift and principle support before approving registry direction.",
        factors: [`Doctrine confidence score: ${input.doctrineResult?.doctrineConfidenceScore ?? "not_supplied"}.`],
        reasoning: ["Future registry design should wait until doctrine semantics are stable, explainable, and supported by evidence."],
      }),
    );
  }

  Array.from(categoryToPrinciples.entries())
    .filter(([, principlesForCategory]) => principlesForCategory.length > 3)
    .forEach(([category, principlesForCategory]) => {
      findings.push(
        createFinding({
          findingType: "semantic_overlap",
          severity: principlesForCategory.length > 5 ? "elevated" : "moderate",
          description: "An audit category maps to many governance principles and may need semantic boundary review.",
          evidence: [`${category}: ${principlesForCategory.join(", ")}.`],
          affectedAuditCategories: [category],
          recommendedHumanReview: "Review category-to-principle boundaries before future registry taxonomy work.",
          factors: [`Principles mapped to category: ${principlesForCategory.length}.`],
          reasoning: ["Broad semantic overlap can make future registry mappings harder to maintain."],
        }),
      );
    });

  principles
    .map((principle) => ({
      principle,
      mismatchedMappings: mappings.filter(
        (mapping) =>
          mapping.principleType === principle.principleType &&
          normalize(mapping.principleLabel) !== normalize(principle.title),
      ),
    }))
    .filter((item) => item.mismatchedMappings.length > 0)
    .forEach((item) => {
      findings.push(
        createFinding({
          findingType: "conflicting_principle_meaning",
          severity: "moderate",
          description: "Doctrine principle and normalized mapping appear inconsistent.",
          evidence: [
            `Doctrine label: ${item.principle.title}.`,
            ...item.mismatchedMappings.map((mapping) => `Mapping label: ${mapping.principleLabel}.`),
          ],
          affectedPrinciples: [item.principle.principleType],
          recommendedHumanReview: "Review principle meaning across doctrine and normalization outputs.",
          factors: ["Doctrine title and normalized mapping label do not match for the same principle type."],
          reasoning: ["Registry candidates should preserve consistent meaning between doctrine principles and normalized evidence mappings."],
        }),
      );
    });

  if (normalizationGaps.some((gap) => gap.gapType === "duplicated_governance_semantics" || gap.gapType === "inconsistent_principle_label")) {
    findings.push(
      createFinding({
        findingType: "fragmented_governance_terminology",
        severity: "moderate",
        description: "Normalization gaps indicate fragmented governance terminology.",
        evidence: normalizationGaps
          .filter((gap) => gap.gapType === "duplicated_governance_semantics" || gap.gapType === "inconsistent_principle_label")
          .map((gap) => gap.description),
        recommendedHumanReview: "Review governance terminology before proposing a principle registry.",
        factors: [`Terminology-related normalization gaps: ${normalizationGaps.length}.`],
        reasoning: ["Stable registry vocabulary requires consistent principle labels and non-duplicative governance semantics."],
      }),
    );
  }

  if (!input.auditResult || !input.normalizationResult || input.normalizationResult.normalizationClassification === "fragmented") {
    findings.push(
      createFinding({
        findingType: "unstable_governance_taxonomy",
        severity: !input.auditResult || !input.normalizationResult ? "elevated" : "moderate",
        description: "Governance taxonomy context is incomplete or not normalized enough for registry implementation.",
        evidence: [
          `Audit supplied: ${Boolean(input.auditResult)}.`,
          `Normalization supplied: ${Boolean(input.normalizationResult)}.`,
          `Normalization classification: ${input.normalizationResult?.normalizationClassification ?? "not_supplied"}.`,
        ],
        recommendedHumanReview: "Keep this stage as review-only until audit and normalization taxonomy context is stable.",
        factors: ["Registry readiness depends on audit taxonomy and normalization taxonomy being available together."],
        reasoning: ["A future registry should not precede stable audit categories and normalized principle-to-evidence mappings."],
      }),
    );
  }

  if (
    normalizationGaps.some((gap) =>
      ["weak_principle_evidence_mapping", "unsupported_evidence_relationship", "traceability_inconsistency"].includes(gap.gapType),
    ) ||
    traceGaps.length > 0
  ) {
    findings.push(
      createFinding({
        findingType: "principle_evidence_inconsistency",
        severity: traceGaps.length + normalizationGaps.length >= 8 ? "elevated" : "moderate",
        description: "Principle-to-evidence consistency has gaps that should be reviewed before registry design.",
        evidence: [
          ...normalizationGaps
            .filter((gap) =>
              ["weak_principle_evidence_mapping", "unsupported_evidence_relationship", "traceability_inconsistency"].includes(gap.gapType),
            )
            .map((gap) => gap.description),
          ...traceGaps.map((gap) => gap.description).slice(0, 6),
        ],
        recommendedHumanReview: "Review principle-to-evidence and traceability gaps before approving registry readiness.",
        factors: [`Normalization gaps: ${normalizationGaps.length}.`, `Traceability gaps: ${traceGaps.length}.`],
        reasoning: ["Registry-driven reasoning depends on traceable evidence relationships and stable principle-to-evidence links."],
      }),
    );
  }

  if (normalizationGaps.some((gap) => gap.gapType === "scoring_driver_inconsistency")) {
    findings.push(
      createFinding({
        findingType: "principle_score_inconsistency",
        severity: "moderate",
        description: "Some principle mappings are missing or weakening scoring-driver consistency.",
        evidence: normalizationGaps
          .filter((gap) => gap.gapType === "scoring_driver_inconsistency")
          .map((gap) => gap.description),
        recommendedHumanReview: "Review scoring driver semantics before any registry-driven reasoning is considered.",
        factors: ["Scoring-driver normalization gaps were detected."],
        reasoning: ["Registry reasoning must preserve deterministic score traceability and avoid hidden scoring semantics."],
      }),
    );
  }

  if (
    normalizationGaps.some((gap) => gap.gapType === "governance_semantic_drift_risk") ||
    (input.normalizationResult?.governanceSemanticDriftRisks.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        findingType: "principle_drift_risk",
        severity: "elevated",
        description: "Governance semantic drift risk is present in normalization context.",
        evidence: input.normalizationResult?.governanceSemanticDriftRisks ?? ["Normalization semantic drift gap detected."],
        recommendedHumanReview: "Review semantic drift risks before future registry design.",
        factors: [`Semantic drift risks: ${input.normalizationResult?.governanceSemanticDriftRisks.length ?? "not_supplied"}.`],
        reasoning: ["A registry should not lock in principle semantics that are still drifting or weakly supported."],
      }),
    );
  }

  if ((input.doctrineResult?.driftFindings.length ?? 0) > 2 || (input.normalizationResult?.inconsistentMappings.length ?? 0) > 2) {
    findings.push(
      createFinding({
        findingType: "governance_doctrine_fragmentation_risk",
        severity: "elevated",
        description: "Doctrine or normalization signals suggest fragmentation risk.",
        evidence: [
          `Doctrine drift findings: ${input.doctrineResult?.driftFindings.length ?? "not_supplied"}.`,
          `Inconsistent normalization mappings: ${input.normalizationResult?.inconsistentMappings.length ?? "not_supplied"}.`,
        ],
        affectedPrinciples: principles.map((principle) => principle.principleType),
        recommendedHumanReview: "Review doctrine fragmentation before considering registry adoption.",
        factors: ["Fragmentation risk is evaluated from doctrine drift and inconsistent normalized mappings."],
        reasoning: ["Registry adoption should follow stable doctrine, not create centralized rigidity around fragmented semantics."],
      }),
    );
  }

  return findings;
};

const buildClassifiedRecommendations = (
  input: GovernancePrincipleRegistryReviewInput,
  findings: GovernancePrincipleRegistryReviewFinding[],
): GovernancePrincipleRegistryReviewRecommendation[] => {
  const recommendations: GovernancePrincipleRegistryReviewRecommendation[] = [
    {
      id: "registry-review-read-only-boundary",
      classification: "Immediate",
      recommendation: "Keep this stage as review-only and do not implement a production registry yet.",
      rationale: "The requested stage is architectural maturity evaluation only and must preserve strict build order.",
    },
    {
      id: "registry-review-semantic-stability",
      classification: findings.some((finding) => finding.severity === "critical" || finding.severity === "elevated")
        ? "Immediate"
        : "Future Upgrade",
      recommendation: "Review elevated semantic, doctrine, evidence, and taxonomy findings before approving any future registry design.",
      rationale: "Registry maturity depends on stable principle semantics, traceability compatibility, and deterministic scoring semantics.",
    },
    {
      id: "registry-review-semantic-versioning",
      classification: "Future Upgrade",
      recommendation: "Define semantic versioning requirements before any future registry persistence or enterprise reuse.",
      rationale: "Versioning helps preserve institutional continuity when principle definitions evolve over time.",
    },
    {
      id: "registry-review-shared-utilities",
      classification: "Future Upgrade",
      recommendation: "Continue preserving shared deterministic utility extraction as a separate review after semantic stability is assessed.",
      rationale: "Utility extraction remains useful, but broad refactor would violate the current review-first stage.",
    },
    {
      id: "registry-review-preview",
      classification: "Optional Optimization",
      recommendation: "Consider a read-only registry-readiness preview after human reviewers validate the review module outputs.",
      rationale: "A preview may help reviewers inspect readiness without introducing registry behavior.",
    },
  ];

  if (!input.normalizationResult || !input.traceabilityResult) {
    recommendations.push({
      id: "registry-review-context-completeness",
      classification: "Immediate",
      recommendation: "Supply normalization and traceability context before relying on registry readiness score.",
      rationale: "Registry readiness is weaker when principle-to-evidence and traceability context are missing.",
    });
  }

  return recommendations;
};

export function analyzeGovernancePrincipleRegistryReview(
  input: GovernancePrincipleRegistryReviewInput,
): GovernancePrincipleRegistryReviewResult {
  const readinessAreas = buildReadinessAreas(input);
  const findings = buildFindings(input);
  const registryReadinessScore = calculateRegistryReadinessScore({ input, readinessAreas, findings });
  const classifiedRecommendations = buildClassifiedRecommendations(input, findings);
  const resultWithoutExplainability = {
    registryReadinessScore,
    registryReadinessClassification: registryReadinessClassificationFromScore(registryReadinessScore),
    readinessAreas,
    findings,
    semanticStabilityFindings: unique([
      ...readinessAreas
        .filter((area) => ["principle_ids", "institutional_governance_vocabulary", "deterministic_registry_reasoning"].includes(area.areaType))
        .map((area) => `${area.areaType}: ${area.status} at ${area.score}/100.`),
      ...findings
        .filter((finding) =>
          ["inconsistent_principle_naming", "fragmented_governance_terminology", "principle_drift_risk"].includes(finding.findingType),
        )
        .map((finding) => finding.description),
    ]),
    doctrineConsistencyFindings: unique([
      `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
      `Doctrine confidence score: ${input.doctrineResult?.doctrineConfidenceScore ?? "not_supplied"}.`,
      ...findings.filter((finding) => finding.findingType === "weak_doctrine_consistency").map((finding) => finding.description),
    ]),
    governanceVocabularyFindings: unique([
      ...getDoctrinePrinciples(input).map((principle) => `${principle.principleType}: ${principle.title}.`),
      ...getMappings(input).map((mapping) => `${mapping.principleType}: ${mapping.principleLabel}.`),
    ]),
    taxonomyStabilityFindings: unique([
      ...readinessAreas
        .filter((area) => ["reusable_governance_taxonomy", "evidence_taxonomy", "audit_taxonomy"].includes(area.areaType))
        .map((area) => `${area.areaType}: ${area.status} at ${area.score}/100.`),
      ...findings.filter((finding) => finding.findingType === "unstable_governance_taxonomy").map((finding) => finding.description),
    ]),
    semanticDriftRisks: unique(
      findings
        .filter((finding) => finding.findingType === "principle_drift_risk" || finding.findingType === "governance_doctrine_fragmentation_risk")
        .map((finding) => finding.description),
    ),
    overlapConflictFindings: unique(
      findings
        .filter((finding) => ["semantic_overlap", "conflicting_principle_meaning", "duplicated_principle_semantics"].includes(finding.findingType))
        .map((finding) => finding.description),
    ),
    futureRegistryRecommendations: unique(
      classifiedRecommendations
        .filter((recommendation) => recommendation.classification !== "Immediate")
        .map((recommendation) => recommendation.recommendation),
    ),
    humanReviewRecommendations: unique([
      ...findings.map((finding) => finding.recommendedHumanReview),
      ...readinessAreas.map((area) => area.recommendedHumanReview),
      "Do not implement a production registry until human reviewers approve semantic stability and traceability readiness.",
    ]),
    futureExtractionRecommendations: [
      "Review shared deterministic helper extraction separately after semantic stability review passes.",
      "Consider future registry schema or persistence only after explicit approval and after semantic versioning requirements are reviewed.",
      "Keep future registry, storage, route, and orchestration integrations separated from pure read-only engines.",
    ],
    classifiedRecommendations,
    architectureReviewFindings: [
      "Registry readiness review remains isolated from routes, APIs, UI, DB, automation, messaging, and orchestration.",
      "Future registry implementation would introduce stronger central semantics and should wait for semantic stability review.",
      "Repeated helper functions remain a future utility extraction opportunity, not an immediate refactor in this stage.",
      "Semantic versioning is not yet formalized and should be reviewed before registry persistence or enterprise taxonomy reuse.",
    ],
    reviewLimitations: [
      "This module reviews future registry readiness only and does not implement a registry.",
      "Readiness depends on supplied doctrine, normalization, traceability, and audit context.",
      "Review output is neutral operational guidance for human review and is not policy enforcement.",
      "No legal, compliance, lending, tax, investment, protected-class, or demographic conclusion is produced.",
    ],
    humanReviewRequired:
      findings.length > 0 ||
      readinessAreas.some((area) => area.status === "unstable" || area.status === "developing") ||
      !input.normalizationResult ||
      !input.traceabilityResult,
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernancePrincipleRegistryReviewExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}

export const getGovernancePrincipleRegistryReview = analyzeGovernancePrincipleRegistryReview;
