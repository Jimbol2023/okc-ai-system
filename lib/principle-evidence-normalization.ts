import { buildPrincipleEvidenceNormalizationExplainability } from "./principle-evidence-normalization-explainability";
import {
  calculatePrincipleEvidenceGapConfidence,
  calculatePrincipleEvidenceMappingScore,
  calculatePrincipleEvidenceNormalizationScore,
  mappingStrengthFromScore,
  principleEvidenceNormalizationClassificationFromScore,
} from "./principle-evidence-normalization-scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
} from "./full-system-governance-audit-types";
import type { GovernanceEvidenceTraceLink } from "./governance-evidence-traceability-types";
import type {
  PrincipleEvidenceNormalizedMapping,
  PrincipleEvidenceNormalizedPrinciple,
  PrincipleEvidenceNormalizationGap,
  PrincipleEvidenceNormalizationGapType,
  PrincipleEvidenceNormalizationInput,
  PrincipleEvidenceNormalizationResult,
} from "./principle-evidence-normalization-types";
import type {
  ReputationGovernanceDoctrinePrinciple,
  ReputationGovernanceDoctrinePrincipleType,
} from "./reputation/reputation-governance-doctrine-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const average = (values: number[]): number =>
  values.length === 0 ? 0 : Math.round(values.reduce((total, value) => total + value, 0) / values.length);

const principleLabel = (principle: PrincipleEvidenceNormalizedPrinciple): string =>
  principle
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const isDoctrinePrincipleType = (
  principle: PrincipleEvidenceNormalizedPrinciple,
): principle is ReputationGovernanceDoctrinePrincipleType =>
  principle !== "system_governance_safety" && principle !== "not_supplied";

const getDoctrinePrinciples = (input: PrincipleEvidenceNormalizationInput): ReputationGovernanceDoctrinePrinciple[] =>
  input.doctrinePrinciples ?? input.doctrineResult?.principles ?? [];

const getAuditFindings = (input: PrincipleEvidenceNormalizationInput): FullSystemGovernanceAuditFinding[] =>
  input.auditFindings ?? input.auditResult?.findings ?? [];

const getRecommendations = (input: PrincipleEvidenceNormalizationInput): FullSystemGovernanceAuditRecommendation[] =>
  input.recommendations ?? input.auditResult?.recommendations ?? [];

const getTraceLinks = (input: PrincipleEvidenceNormalizationInput): GovernanceEvidenceTraceLink[] =>
  input.traceLinks ?? input.traceabilityResult?.traces ?? [];

const getTracePrinciples = (traces: GovernanceEvidenceTraceLink[]): PrincipleEvidenceNormalizedPrinciple[] =>
  unique(traces.map((trace) => trace.governancePrinciple)).filter(
    (principle): principle is PrincipleEvidenceNormalizedPrinciple =>
      principle === "system_governance_safety" ||
      principle === "not_supplied" ||
      [
        "stabilization_first",
        "continuity_preservation",
        "evidence_supported_remediation",
        "reviewability_preservation",
        "dependency_resilience",
        "anti_fragility_learning",
        "human_reviewed_governance",
      ].includes(principle),
  );

const categoriesFromRecommendations = (
  recommendationIds: string[],
  recommendations: FullSystemGovernanceAuditRecommendation[],
): FullSystemGovernanceAuditCategory[] =>
  unique(
    recommendations
      .filter((recommendation) => recommendationIds.includes(recommendation.id))
      .map((recommendation) => recommendation.category),
  ) as FullSystemGovernanceAuditCategory[];

const createMapping = (params: {
  principleType: PrincipleEvidenceNormalizedPrinciple;
  doctrinePrinciple?: ReputationGovernanceDoctrinePrinciple;
  traces: GovernanceEvidenceTraceLink[];
  findings: FullSystemGovernanceAuditFinding[];
  recommendations: FullSystemGovernanceAuditRecommendation[];
}): PrincipleEvidenceNormalizedMapping => {
  const doctrinePrinciple = params.doctrinePrinciple;
  const traceRecommendationIds = params.traces.map((trace) => trace.recommendationId);
  const principleAuditCategories = unique([
    ...params.traces.map((trace) => trace.auditCategory),
    ...categoriesFromRecommendations(traceRecommendationIds, params.recommendations),
  ]) as FullSystemGovernanceAuditCategory[];
  const matchingFindings = params.findings.filter((finding) => principleAuditCategories.includes(finding.category));
  const label = doctrinePrinciple?.title ?? principleLabel(params.principleType);
  const evidenceSummaries = unique([
    ...(doctrinePrinciple?.supportingEvidence ?? []),
    ...params.traces.map((trace) => trace.evidenceSummary),
    ...matchingFindings.flatMap((finding) => finding.evidence),
  ]);
  const limitations = unique([
    ...(doctrinePrinciple?.limitations ?? []),
    ...params.traces.map((trace) => trace.limitation),
    ...matchingFindings.flatMap((finding) => finding.risks),
  ]);
  const recommendationIds = unique([
    ...traceRecommendationIds,
    ...params.recommendations
      .filter((recommendation) => principleAuditCategories.includes(recommendation.category))
      .map((recommendation) => recommendation.id),
  ]);
  const mappingWithoutStrength = {
    mappingId: `principle-evidence-${slug(params.principleType)}-${slug(label)}`,
    principleType: params.principleType,
    principleLabel: label,
    auditCategories: principleAuditCategories,
    evidenceIds: unique(params.traces.map((trace) => trace.evidenceId)),
    evidenceSummaries,
    scoringDrivers: unique([
      ...(doctrinePrinciple?.explainability.factors ?? []),
      ...params.traces.map((trace) => trace.scoringDriver),
      ...matchingFindings.flatMap((finding) => finding.explainability.factors),
    ]),
    reasoningChains: unique([
      ...(doctrinePrinciple?.explainability.reasoning ?? []),
      ...params.traces.map((trace) => trace.reasoningLink),
      ...matchingFindings.flatMap((finding) => finding.explainability.reasoning),
    ]),
    limitations,
    recommendationIds,
    traceIds: unique(params.traces.map((trace) => trace.traceId)),
    confidenceImpact: average([
      ...(doctrinePrinciple ? [doctrinePrinciple.confidenceScore - 50] : []),
      ...params.traces.map((trace) => trace.confidenceImpact),
      ...matchingFindings.map((finding) => finding.score - 50),
    ]),
    riskImpact: average([
      ...params.traces.map((trace) => trace.riskImpact),
      ...matchingFindings.map((finding) => finding.risks.length * 12),
    ]),
    humanReviewRequired:
      params.traces.some((trace) => trace.humanReviewRequired) ||
      matchingFindings.some((finding) => finding.classification === "critical_risk" || finding.classification === "needs_attention"),
    explainability: {
      factors: unique([
        `Trace links: ${params.traces.length}.`,
        `Audit categories: ${principleAuditCategories.length}.`,
        `Evidence summaries: ${evidenceSummaries.length}.`,
        `Recommendations: ${recommendationIds.length}.`,
      ]),
      reasoning: [
        "Mapping is normalized from supplied doctrine principles, evidence traces, audit findings, and human-review recommendations.",
        "This mapping is read-only and does not alter supplied evidence, scoring drivers, limitations, or recommendations.",
      ],
    },
  };

  return {
    ...mappingWithoutStrength,
    mappingStrength: mappingStrengthFromScore(calculatePrincipleEvidenceMappingScore(mappingWithoutStrength)),
  };
};

const buildMappings = (input: PrincipleEvidenceNormalizationInput): PrincipleEvidenceNormalizedMapping[] => {
  const doctrinePrinciples = getDoctrinePrinciples(input);
  const findings = getAuditFindings(input);
  const recommendations = getRecommendations(input);
  const traces = getTraceLinks(input);
  const principleTypes = unique([
    ...doctrinePrinciples.map((principle) => principle.principleType),
    ...getTracePrinciples(traces),
  ]) as PrincipleEvidenceNormalizedPrinciple[];

  return principleTypes.map((principleType) =>
    createMapping({
      principleType,
      doctrinePrinciple: isDoctrinePrincipleType(principleType)
        ? doctrinePrinciples.find((principle) => principle.principleType === principleType)
        : undefined,
      traces: traces.filter((trace) => trace.governancePrinciple === principleType),
      findings,
      recommendations,
    }),
  );
};

const createGap = (params: {
  gapType: PrincipleEvidenceNormalizationGapType;
  principleType?: PrincipleEvidenceNormalizedPrinciple;
  auditCategory?: FullSystemGovernanceAuditCategory;
  mappingId?: string;
  description: string;
  evidence: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): PrincipleEvidenceNormalizationGap => {
  const evidence = unique(params.evidence);
  const factors = unique(params.factors);

  return {
    id: `principle-evidence-gap-${slug(params.gapType)}-${slug(params.mappingId ?? params.description)}`,
    gapType: params.gapType,
    principleType: params.principleType,
    auditCategory: params.auditCategory,
    mappingId: params.mappingId,
    description: params.description,
    evidence,
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculatePrincipleEvidenceGapConfidence({
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

const buildMappingGaps = (
  mappings: PrincipleEvidenceNormalizedMapping[],
  input: PrincipleEvidenceNormalizationInput,
): PrincipleEvidenceNormalizationGap[] => {
  const gaps: PrincipleEvidenceNormalizationGap[] = [];
  const labels = mappings.map((mapping) => normalize(mapping.principleLabel));
  const traceGaps = input.traceGaps ?? input.traceabilityResult?.gaps ?? [];

  mappings.forEach((mapping) => {
    if (!mapping.principleLabel || mapping.principleType === "not_supplied") {
      gaps.push(
        createGap({
          gapType: "inconsistent_principle_label",
          principleType: mapping.principleType,
          mappingId: mapping.mappingId,
          description: "Mapping has a missing or non-specific governance principle label.",
          evidence: [mapping.mappingId, mapping.principleLabel],
          recommendedHumanReview: "Review principle labels before relying on normalized doctrine-to-evidence relationships.",
          factors: [`Principle type: ${mapping.principleType}.`, `Principle label supplied: ${Boolean(mapping.principleLabel)}.`],
          reasoning: ["Principle-to-evidence normalization requires a stable governance principle label."],
        }),
      );
    }

    if (mapping.evidenceIds.length === 0 || mapping.evidenceSummaries.length === 0 || mapping.mappingStrength === "weak") {
      gaps.push(
        createGap({
          gapType: "weak_principle_evidence_mapping",
          principleType: mapping.principleType,
          mappingId: mapping.mappingId,
          description: "Principle-to-evidence mapping is weak or incomplete.",
          evidence: [mapping.mappingId, ...mapping.evidenceSummaries.slice(0, 4)],
          recommendedHumanReview: "Review evidence references before treating this principle as institutionally normalized.",
          factors: [
            `Evidence ids: ${mapping.evidenceIds.length}.`,
            `Evidence summaries: ${mapping.evidenceSummaries.length}.`,
            `Mapping strength: ${mapping.mappingStrength}.`,
          ],
          reasoning: ["Evidence mapping strength is lower when identifiers, summaries, or trace depth are missing."],
        }),
      );
    }

    if (mapping.traceIds.length === 0 && mapping.evidenceSummaries.length > 0) {
      gaps.push(
        createGap({
          gapType: "unsupported_evidence_relationship",
          principleType: mapping.principleType,
          mappingId: mapping.mappingId,
          description: "Evidence context exists without a traceability reference.",
          evidence: mapping.evidenceSummaries.slice(0, 6),
          recommendedHumanReview: "Link evidence context to traceability references before relying on normalized evidence relationships.",
          factors: [`Trace ids: ${mapping.traceIds.length}.`, `Evidence summaries: ${mapping.evidenceSummaries.length}.`],
          reasoning: ["Evidence relationships are less reviewable when they cannot be traced to source evidence links."],
        }),
      );
    }

    if (mapping.scoringDrivers.length === 0) {
      gaps.push(
        createGap({
          gapType: "scoring_driver_inconsistency",
          principleType: mapping.principleType,
          mappingId: mapping.mappingId,
          description: "Mapping is missing scoring driver context.",
          evidence: [mapping.mappingId],
          recommendedHumanReview: "Review scoring driver linkage before relying on normalized scoring consistency.",
          factors: ["No scoring drivers were supplied for this principle mapping."],
          reasoning: ["Scoring driver consistency requires explicit links between principles, evidence, and score behavior."],
        }),
      );
    }

    if (mapping.recommendationIds.length === 0) {
      gaps.push(
        createGap({
          gapType: "unclear_recommendation_mapping",
          principleType: mapping.principleType,
          mappingId: mapping.mappingId,
          description: "Mapping is missing recommendation linkage.",
          evidence: [mapping.mappingId],
          recommendedHumanReview: "Review recommendation linkage before relying on principle-to-recommendation consistency.",
          factors: ["No recommendation ids were linked to this mapping."],
          reasoning: ["Human-review recommendations should remain visibly connected to the principles and evidence that support them."],
        }),
      );
    }

    if (mapping.limitations.length === 0) {
      gaps.push(
        createGap({
          gapType: "weak_limitation_linkage",
          principleType: mapping.principleType,
          mappingId: mapping.mappingId,
          description: "Mapping is missing limitation linkage.",
          evidence: [mapping.mappingId],
          recommendedHumanReview: "Add or review limitation context before relying on normalized principle relationships.",
          factors: ["No limitations were linked to this mapping."],
          reasoning: ["Limitations preserve human-review context and reduce unsupported governance interpretation."],
        }),
      );
    }

    if (mapping.auditCategories.length > 4) {
      gaps.push(
        createGap({
          gapType: "audit_category_drift",
          principleType: mapping.principleType,
          mappingId: mapping.mappingId,
          description: "Principle maps across many audit categories and may need semantic review.",
          evidence: mapping.auditCategories,
          recommendedHumanReview: "Review whether the principle is carrying too many audit meanings without clearer category boundaries.",
          factors: [`Audit categories: ${mapping.auditCategories.length}.`],
          reasoning: ["Very broad category coverage can indicate audit category drift or overloaded governance semantics."],
        }),
      );
    }

    if (mapping.riskImpact >= 24 || mapping.confidenceImpact < -12) {
      gaps.push(
        createGap({
          gapType: "governance_semantic_drift_risk",
          principleType: mapping.principleType,
          mappingId: mapping.mappingId,
          description: "Mapping has elevated risk impact or reduced confidence impact.",
          evidence: [
            `Risk impact: ${mapping.riskImpact}.`,
            `Confidence impact: ${mapping.confidenceImpact}.`,
            ...mapping.evidenceSummaries.slice(0, 4),
          ],
          recommendedHumanReview: "Review governance semantics and supporting evidence before treating this mapping as durable.",
          factors: [`Risk impact: ${mapping.riskImpact}.`, `Confidence impact: ${mapping.confidenceImpact}.`],
          reasoning: ["High risk impact or low confidence impact can indicate semantic drift in governance interpretation."],
        }),
      );
    }
  });

  labels.forEach((label, index) => {
    if (label && labels.indexOf(label) !== index) {
      const mapping = mappings[index];
      gaps.push(
        createGap({
          gapType: "duplicated_governance_semantics",
          principleType: mapping.principleType,
          mappingId: mapping.mappingId,
          description: "Multiple mappings share the same normalized governance label.",
          evidence: mappings.filter((candidate) => normalize(candidate.principleLabel) === label).map((candidate) => candidate.mappingId),
          recommendedHumanReview: "Review duplicated governance semantics before relying on normalized principle labels.",
          factors: [`Duplicated label: ${mapping.principleLabel}.`],
          reasoning: ["Repeated labels across separate mappings can make doctrine-to-evidence normalization less clear."],
        }),
      );
    }
  });

  traceGaps.forEach((gap) => {
    gaps.push(
      createGap({
        gapType: "traceability_inconsistency",
        auditCategory: gap.auditCategory,
        description: "Underlying evidence traceability gap affects normalization confidence.",
        evidence: [gap.description, ...gap.evidence.slice(0, 4)],
        recommendedHumanReview: "Review the underlying traceability gap before relying on principle-to-evidence normalization.",
        factors: [`Trace gap type: ${gap.gapType}.`, `Trace gap confidence: ${gap.confidenceScore}.`],
        reasoning: ["Normalization depends on traceable evidence links; upstream traceability gaps lower mapping confidence."],
        baseConfidence: gap.confidenceScore,
      }),
    );
  });

  return gaps;
};

export function analyzePrincipleEvidenceNormalization(
  input: PrincipleEvidenceNormalizationInput,
): PrincipleEvidenceNormalizationResult {
  const mappings = buildMappings(input);
  const gaps = buildMappingGaps(mappings, input);
  const normalizationScore = calculatePrincipleEvidenceNormalizationScore({ input, mappings, gaps });
  const weakMappings = unique(
    mappings
      .filter((mapping) => mapping.mappingStrength === "weak" || mapping.mappingStrength === "moderate")
      .map((mapping) => `${mapping.principleLabel}: ${mapping.mappingStrength} principle-to-evidence mapping.`),
  );
  const resultWithoutExplainability = {
    normalizationScore,
    normalizationClassification: principleEvidenceNormalizationClassificationFromScore(normalizationScore),
    mappings,
    gaps,
    principleMappingStrength: unique(
      mappings.map((mapping) => `${mapping.principleLabel}: ${mapping.mappingStrength} principle mapping.`),
    ),
    evidenceMappingStrength: unique(
      mappings.map((mapping) => `${mapping.principleLabel}: ${mapping.evidenceIds.length} evidence ids and ${mapping.evidenceSummaries.length} evidence summaries.`),
    ),
    scoringDriverConsistency: unique(
      mappings.map((mapping) => `${mapping.principleLabel}: ${mapping.scoringDrivers.length} scoring drivers linked.`),
    ),
    recommendationLinkageConsistency: unique(
      mappings.map((mapping) => `${mapping.principleLabel}: ${mapping.recommendationIds.length} recommendation links.`),
    ),
    limitationLinkageConsistency: unique(
      mappings.map((mapping) => `${mapping.principleLabel}: ${mapping.limitations.length} limitation links.`),
    ),
    reasoningChainConsistency: unique(
      mappings.map((mapping) => `${mapping.principleLabel}: ${mapping.reasoningChains.length} reasoning chain links.`),
    ),
    weakMappings,
    missingMappings: unique(
      gaps
        .filter((gap) =>
          [
            "weak_principle_evidence_mapping",
            "unsupported_evidence_relationship",
            "unclear_recommendation_mapping",
            "weak_limitation_linkage",
          ].includes(gap.gapType),
        )
        .map((gap) => gap.description),
    ),
    inconsistentMappings: unique(
      gaps
        .filter((gap) =>
          [
            "inconsistent_principle_label",
            "scoring_driver_inconsistency",
            "duplicated_governance_semantics",
            "audit_category_drift",
            "traceability_inconsistency",
          ].includes(gap.gapType),
        )
        .map((gap) => gap.description),
    ),
    governanceSemanticDriftRisks: unique(
      gaps.filter((gap) => gap.gapType === "governance_semantic_drift_risk").map((gap) => gap.description),
    ),
    humanReviewNotes: unique([
      ...mappings.filter((mapping) => mapping.humanReviewRequired).map((mapping) => `Human review required for ${mapping.principleLabel}.`),
      ...gaps.map((gap) => gap.recommendedHumanReview),
      "Principle-to-evidence normalization is read-only and does not enforce policy, mutate recommendations, or execute remediation.",
    ]),
    futureUpgradeRecommendations: [
      "Review shared deterministic utility extraction after governance normalization, traceability, and audit modules stabilize.",
      "Consider a formal enterprise principle registry after human reviewers validate principle labels across modules.",
      "Consider deeper traceability normalization for future storage or orchestration-adjacent layers, while keeping execution separate from pure engines.",
    ],
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildPrincipleEvidenceNormalizationExplainability({ input, result: resultWithoutExplainability }),
  };
}

export const getPrincipleEvidenceNormalization = analyzePrincipleEvidenceNormalization;
