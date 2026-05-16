import { buildGovernanceEvidenceTraceabilityExplainability } from "./governance-evidence-traceability-explainability";
import {
  calculateGovernanceEvidenceTraceabilityScore,
  calculateTraceGapConfidence,
  calculateTraceLinkScore,
  traceStrengthFromScore,
} from "./governance-evidence-traceability-scoring";
import type {
  GovernanceEvidenceTraceGap,
  GovernanceEvidenceTraceGapType,
  GovernanceEvidenceTraceLink,
  GovernanceEvidenceTraceabilityInput,
  GovernanceEvidenceTraceabilityResult,
  GovernanceTraceEvidenceType,
} from "./governance-evidence-traceability-types";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
} from "./full-system-governance-audit-types";
import type { ReputationGovernanceDoctrinePrincipleType } from "./reputation/reputation-governance-doctrine-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const principleFromCategory = (
  category: FullSystemGovernanceAuditCategory,
): ReputationGovernanceDoctrinePrincipleType | "system_governance_safety" => {
  switch (category) {
    case "traceability_integrity":
    case "dependency_integrity":
      return "dependency_resilience";
    case "resilience_consistency":
    case "anti_fragility_opportunities":
      return "anti_fragility_learning";
    case "doctrine_consistency":
      return "human_reviewed_governance";
    case "enterprise_durability":
    case "institutional_continuity_risks":
      return "continuity_preservation";
    case "governance_safety":
    case "orchestration_purity":
    case "hidden_execution_pathways":
      return "system_governance_safety";
    case "explainability_integrity":
    case "deterministic_scoring_integrity":
      return "reviewability_preservation";
    case "future_technical_debt":
    case "reusable_infrastructure_opportunities":
    case "utility_duplication":
    case "type_duplication":
      return "evidence_supported_remediation";
    default:
      return "human_reviewed_governance";
  }
};

const evidenceTypeFromFinding = (finding: FullSystemGovernanceAuditFinding): GovernanceTraceEvidenceType => {
  if (finding.risks.length > 0) return "risk";
  if (finding.evidence.some((item) => normalize(item).includes("limitation"))) return "limitation";
  return "audit_finding";
};

const matchingRecommendation = (
  finding: FullSystemGovernanceAuditFinding,
  recommendations: FullSystemGovernanceAuditRecommendation[],
): FullSystemGovernanceAuditRecommendation | undefined =>
  recommendations.find((recommendation) => recommendation.category === finding.category);

const createTraceFromFinding = (
  finding: FullSystemGovernanceAuditFinding,
  recommendations: FullSystemGovernanceAuditRecommendation[],
): GovernanceEvidenceTraceLink => {
  const recommendation = matchingRecommendation(finding, recommendations);
  const traceWithoutStrength = {
    traceId: `trace-${slug(finding.id)}`,
    evidenceId: finding.evidence[0] ? `evidence-${slug(finding.category)}-primary` : "",
    evidenceType: evidenceTypeFromFinding(finding),
    evidenceSource: finding.evidence[0] ?? "",
    sourceModule: "full-system-governance-audit",
    auditCategory: finding.category,
    governancePrinciple: principleFromCategory(finding.category),
    scoringDriver: finding.explainability.factors[0] ?? finding.description,
    evidenceSummary: finding.evidence[0] ?? "",
    reasoningLink: finding.explainability.reasoning[0] ?? "",
    limitation: finding.risks[0] ?? "No category-specific limitation supplied.",
    confidenceImpact: finding.score - 50,
    riskImpact: finding.risks.length * 12 + (finding.classification === "critical_risk" ? 20 : 0),
    recommendationId: recommendation?.id ?? "",
    humanReviewRequired: finding.classification === "critical_risk" || finding.classification === "needs_attention",
  };

  return {
    ...traceWithoutStrength,
    traceStrength: traceStrengthFromScore(calculateTraceLinkScore(traceWithoutStrength)),
  };
};

const normalizeTrace = (trace: GovernanceEvidenceTraceLink): GovernanceEvidenceTraceLink => {
  const scorableTrace = {
    traceId: trace.traceId,
    evidenceId: trace.evidenceId,
    evidenceType: trace.evidenceType,
    evidenceSource: trace.evidenceSource,
    sourceModule: trace.sourceModule,
    auditCategory: trace.auditCategory,
    governancePrinciple: trace.governancePrinciple,
    scoringDriver: trace.scoringDriver,
    evidenceSummary: trace.evidenceSummary,
    reasoningLink: trace.reasoningLink,
    limitation: trace.limitation,
    confidenceImpact: trace.confidenceImpact,
    riskImpact: trace.riskImpact,
    recommendationId: trace.recommendationId,
    humanReviewRequired: trace.humanReviewRequired,
  };

  return {
    ...trace,
    traceStrength: traceStrengthFromScore(calculateTraceLinkScore(scorableTrace)),
  };
};

const createGap = (params: {
  gapType: GovernanceEvidenceTraceGapType;
  auditCategory?: FullSystemGovernanceAuditCategory;
  evidenceId?: string;
  description: string;
  evidence: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
}): GovernanceEvidenceTraceGap => {
  const evidence = unique(params.evidence);
  const factors = unique(params.factors);

  return {
    id: `trace-gap-${slug(params.gapType)}-${slug(params.auditCategory ?? params.evidenceId ?? params.description)}`,
    gapType: params.gapType,
    auditCategory: params.auditCategory,
    evidenceId: params.evidenceId,
    description: params.description,
    evidence,
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateTraceGapConfidence({
      evidenceCount: evidence.length,
      factorCount: factors.length,
    }),
    explainability: {
      factors,
      reasoning: params.reasoning,
    },
  };
};

const buildTraces = (input: GovernanceEvidenceTraceabilityInput): GovernanceEvidenceTraceLink[] => {
  const findings = input.auditFindings ?? input.auditResult?.findings ?? [];
  const recommendations = input.recommendations ?? input.auditResult?.recommendations ?? [];
  const generatedTraces = findings.map((finding) => createTraceFromFinding(finding, recommendations));
  const suppliedTraces = (input.traceLinks ?? []).map(normalizeTrace);

  return [...generatedTraces, ...suppliedTraces].filter(
    (trace, index, traces) => traces.findIndex((candidate) => candidate.traceId === trace.traceId) === index,
  );
};

const buildGaps = (traces: GovernanceEvidenceTraceLink[]): GovernanceEvidenceTraceGap[] => {
  const gaps: GovernanceEvidenceTraceGap[] = [];

  traces.forEach((trace) => {
    if (!trace.evidenceId || !trace.evidenceSummary) {
      gaps.push(
        createGap({
          gapType: "missing_evidence_link",
          auditCategory: trace.auditCategory,
          evidenceId: trace.evidenceId,
          description: "Trace is missing an evidence identifier or evidence summary.",
          evidence: [trace.traceId, trace.evidenceSummary],
          recommendedHumanReview: "Add a human-reviewed evidence identifier and summary before relying on this trace.",
          factors: [`Evidence id supplied: ${Boolean(trace.evidenceId)}.`, `Evidence summary supplied: ${Boolean(trace.evidenceSummary)}.`],
          reasoning: ["Evidence links require a stable evidence id and a summary of the supporting source input."],
        }),
      );
    }

    if (!trace.sourceModule || !trace.evidenceSource) {
      gaps.push(
        createGap({
          gapType: "weak_source_attribution",
          auditCategory: trace.auditCategory,
          evidenceId: trace.evidenceId,
          description: "Trace has weak source attribution.",
          evidence: [trace.sourceModule, trace.evidenceSource],
          recommendedHumanReview: "Review source module and evidence source attribution before relying on this trace.",
          factors: [`Source module supplied: ${Boolean(trace.sourceModule)}.`, `Evidence source supplied: ${Boolean(trace.evidenceSource)}.`],
          reasoning: ["Traceability requires visible source attribution for human review."],
        }),
      );
    }

    if (!trace.scoringDriver) {
      gaps.push(
        createGap({
          gapType: "unsupported_scoring_driver",
          auditCategory: trace.auditCategory,
          evidenceId: trace.evidenceId,
          description: "Trace is missing a scoring driver linkage.",
          evidence: [trace.traceId],
          recommendedHumanReview: "Add a scoring driver reference before relying on score traceability.",
          factors: ["Scoring driver was not supplied."],
          reasoning: ["Score traceability requires an explicit driver connecting evidence to scoring behavior."],
        }),
      );
    }

    if (!trace.reasoningLink) {
      gaps.push(
        createGap({
          gapType: "unclear_reasoning_chain",
          auditCategory: trace.auditCategory,
          evidenceId: trace.evidenceId,
          description: "Trace is missing a reasoning link.",
          evidence: [trace.traceId],
          recommendedHumanReview: "Add a reasoning link before relying on trace explainability.",
          factors: ["Reasoning link was not supplied."],
          reasoning: ["Explainable trace chains require a visible reasoning statement."],
        }),
      );
    }

    if (!trace.limitation) {
      gaps.push(
        createGap({
          gapType: "missing_limitation_linkage",
          auditCategory: trace.auditCategory,
          evidenceId: trace.evidenceId,
          description: "Trace is missing limitation linkage.",
          evidence: [trace.traceId],
          recommendedHumanReview: "Add a limitation reference before relying on trace completeness.",
          factors: ["Limitation linkage was not supplied."],
          reasoning: ["Institutional traceability requires limitations to remain visible with the evidence chain."],
        }),
      );
    }

    if (!trace.recommendationId) {
      gaps.push(
        createGap({
          gapType: "weak_recommendation_linkage",
          auditCategory: trace.auditCategory,
          evidenceId: trace.evidenceId,
          description: "Trace is missing recommendation linkage.",
          evidence: [trace.traceId],
          recommendedHumanReview: "Link this trace to a human-review recommendation before relying on recommendation traceability.",
          factors: ["Recommendation id was not supplied."],
          reasoning: ["Recommendation linkage helps reviewers understand how evidence supports human-review recommendations."],
        }),
      );
    }

    if (trace.governancePrinciple === "not_supplied") {
      gaps.push(
        createGap({
          gapType: "weak_principle_evidence_connection",
          auditCategory: trace.auditCategory,
          evidenceId: trace.evidenceId,
          description: "Trace is missing governance principle linkage.",
          evidence: [trace.traceId],
          recommendedHumanReview: "Link this trace to a governance principle before relying on doctrine-level traceability.",
          factors: ["Governance principle was not supplied."],
          reasoning: ["Principle-to-evidence traceability requires explicit doctrine or governance principle context."],
        }),
      );
    }
  });

  return gaps;
};

export function analyzeGovernanceEvidenceTraceability(
  input: GovernanceEvidenceTraceabilityInput,
): GovernanceEvidenceTraceabilityResult {
  const traces = buildTraces(input);
  const gaps = buildGaps(traces);
  const traceabilityScore = calculateGovernanceEvidenceTraceabilityScore({ input, traces, gaps });
  const resultWithoutExplainability = {
    traceabilityScore,
    traceabilityClassification: traceStrengthFromScore(traceabilityScore),
    traces,
    gaps,
    traceStrengths: unique(
      traces
        .filter((trace) => trace.traceStrength === "strong" || trace.traceStrength === "institutionally_traceable")
        .map((trace) => `${trace.auditCategory}: ${trace.traceStrength} trace for ${trace.evidenceId}.`),
    ),
    traceWeaknesses: unique(
      traces
        .filter((trace) => trace.traceStrength === "weak" || trace.traceStrength === "moderate")
        .map((trace) => `${trace.auditCategory}: ${trace.traceStrength} trace for ${trace.evidenceId || trace.traceId}.`),
    ),
    missingLinks: unique(gaps.filter((gap) => gap.gapType === "missing_evidence_link").map((gap) => gap.description)),
    evidenceGaps: unique(
      gaps
        .filter((gap) => ["missing_evidence_link", "weak_source_attribution", "unsupported_scoring_driver"].includes(gap.gapType))
        .map((gap) => gap.description),
    ),
    limitationGaps: unique(gaps.filter((gap) => gap.gapType === "missing_limitation_linkage").map((gap) => gap.description)),
    recommendationLinkageGaps: unique(
      gaps.filter((gap) => gap.gapType === "weak_recommendation_linkage").map((gap) => gap.description),
    ),
    humanReviewNotes: unique([
      ...traces.filter((trace) => trace.humanReviewRequired).map((trace) => `Human review required for ${trace.auditCategory}.`),
      ...gaps.map((gap) => gap.recommendedHumanReview),
      "Traceability contract is read-only and does not enforce policy or execute remediation.",
    ]),
    futureUpgradeRecommendations: [
      "Formalize a shared evidence traceability contract across future governance, audit, and preview layers.",
      "Add principle-to-evidence normalization after this contract is validated.",
      "Consider shared deterministic traceability utilities after the strict build sequence stabilizes.",
    ],
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernanceEvidenceTraceabilityExplainability({ input, result: resultWithoutExplainability }),
  };
}

export const getGovernanceEvidenceTraceability = analyzeGovernanceEvidenceTraceability;
