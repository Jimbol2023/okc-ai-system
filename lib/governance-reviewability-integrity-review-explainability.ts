import type {
  GovernanceReviewabilityIntegrityInput,
  GovernanceReviewabilityIntegrityResult,
} from "./governance-reviewability-integrity-review-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceReviewabilityIntegrityExplainability(params: {
  input: GovernanceReviewabilityIntegrityInput;
  result: Omit<GovernanceReviewabilityIntegrityResult, "explainability">;
}) {
  return {
    summary: [
      `Governance reviewability classification is ${params.result.reviewabilityClassification}.`,
      `Reviewability integrity score is ${params.result.reviewabilityIntegrityScore}/100, where higher indicates stronger human reviewability, reconstruction, auditability, limitation visibility, and evidence linkage.`,
      `Evaluated ${params.result.areaAssessments.length} reviewability areas at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} reviewability integrity findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    reviewabilityIntegrityRulesApplied: [
      "Reviewability integrity review is read-only and evaluates only supplied governance, audit, traceability, explainability, survivability, readiness, assurance, doctrine, semantic stability, observability, recommendation, limitation, evidence, memory, lineage, continuity, and resilience outputs.",
      "Area scores are deterministic from reviewable signals, weak signals, finding volume, explainability depth, and supplied upstream classifications.",
      "Findings identify reviewability gaps, unclear finding structure, weak evidence reconstruction, weak reasoning reconstruction, weak limitation visibility, weak human-review linkage, audit defensibility risk, explainability fragmentation, traceability fragmentation, institutional trust risk, future reviewability degradation, and governance opacity risk.",
      "This review does not mutate findings, rewrite outputs, enforce reviewability, redesign observability, centralize governance control, add execution systems, persist data, add routes, or generate rewritten governance content.",
    ],
    majorDrivers: unique([
      ...params.result.areaAssessments
        .slice(0, 8)
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.observabilityDurabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.traceabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Reviewability integrity review evaluates supplied governance outputs only and does not validate factual truth or certify compliance.",
      "It does not provide legal, tax, lending, investment, protected-class, demographic, or policy-enforcement conclusions.",
      "It does not mutate inputs, write to databases, add routes, send outreach, automate workflows, block operations, or trigger orchestration.",
      "Reviewability classification is a neutral operational indicator for human review.",
    ],
  };
}
