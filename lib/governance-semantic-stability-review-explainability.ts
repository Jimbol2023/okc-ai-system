import type {
  GovernanceSemanticStabilityInput,
  GovernanceSemanticStabilityResult,
} from "./governance-semantic-stability-review-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceSemanticStabilityExplainability(params: {
  input: GovernanceSemanticStabilityInput;
  result: Omit<GovernanceSemanticStabilityResult, "explainability">;
}) {
  return {
    summary: [
      `Governance semantic stability classification is ${params.result.semanticStabilityClassification}.`,
      `Semantic stability score is ${params.result.semanticStabilityScore}/100, where higher indicates more stable, deterministic, explainable governance terminology across modules.`,
      `Evaluated ${params.result.domainAssessments.length} semantic domains at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} semantic stability findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    semanticStabilityRulesApplied: [
      "Semantic stability is reviewed only from supplied read-only governance, audit, doctrine, traceability, registry, normalization, readiness, assurance, resilience, continuity, and evidence-quality outputs.",
      "Domain scores are deterministic from observed term coverage, source diversity, explainability context, semantic drift findings, ambiguity findings, classification mismatches, scoring instability, and traceability terminology gaps.",
      "Findings identify semantic drift, terminology inconsistency, duplicated meanings, conflicting meanings, classification mismatch, scoring instability, weak evidence alignment, weak principle alignment, recommendation ambiguity, limitation ambiguity, traceability gaps, doctrine vocabulary instability, and future registry instability risk.",
      "This review does not rename terms, mutate module semantics, centralize terminology, implement a registry, enforce terminology, refactor utilities, or generate rewritten doctrine.",
    ],
    majorDrivers: unique([
      ...params.result.domainAssessments
        .slice(0, 8)
        .map((assessment) => `${assessment.domain}: ${assessment.classification} at ${assessment.score}/100.`),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.registryReviewResult?.semanticDriftRisks.slice(0, 4) ?? []),
      ...(params.input.normalizationResult?.governanceSemanticDriftRisks.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Semantic stability review evaluates supplied governance outputs only and does not validate factual truth or certify compliance.",
      "It does not provide legal, tax, lending, investment, protected-class, demographic, or policy-enforcement conclusions.",
      "It does not mutate inputs, write to databases, add routes, send outreach, automate workflows, block operations, or trigger orchestration.",
      "Semantic stability classification is a neutral operational indicator for human review.",
    ],
  };
}
