import type {
  GovernanceDoctrineDurabilityInput,
  GovernanceDoctrineDurabilityResult,
} from "./governance-doctrine-durability-review-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceDoctrineDurabilityExplainability(params: {
  input: GovernanceDoctrineDurabilityInput;
  result: Omit<GovernanceDoctrineDurabilityResult, "explainability">;
}) {
  return {
    summary: [
      `Governance doctrine durability classification is ${params.result.doctrineDurabilityClassification}.`,
      `Doctrine durability score is ${params.result.doctrineDurabilityScore}/100, where higher indicates stronger ability for governance doctrine to remain reviewable, explainable, and scalable under future growth.`,
      `Evaluated ${params.result.areaAssessments.length} doctrine durability areas at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} doctrine durability findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    doctrineDurabilityRulesApplied: [
      "Doctrine durability is reviewed only from supplied read-only governance, doctrine, semantic stability, registry, normalization, traceability, audit, readiness, assurance, continuity, resilience, lineage, memory, and evidence-quality outputs.",
      "Durability area scores are deterministic from supplied status strength, evidence depth, limitations, explainability depth, and related durability findings.",
      "Findings detect brittle doctrine assumptions, governance rigidity, semantic durability weakness, taxonomy expansion risk, future scaling incompatibility, fragmentation, classification instability, doctrine coupling, traceability durability risk, semantic versioning risk, explainability durability risk, and institutional survivability risk.",
      "This review does not mutate doctrine, centralize governance control, enforce policy, implement persistence, create execution pathways, or generate rewritten governance doctrine.",
    ],
    majorDrivers: unique([
      ...params.result.areaAssessments
        .slice(0, 8)
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.semanticStabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.registryReviewResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Doctrine durability review evaluates supplied governance outputs only and does not validate factual truth or certify compliance.",
      "It does not provide legal, tax, lending, investment, protected-class, demographic, or policy-enforcement conclusions.",
      "It does not mutate inputs, write to databases, add routes, send outreach, automate workflows, block operations, or trigger orchestration.",
      "Doctrine durability classification is a neutral operational indicator for human review.",
    ],
  };
}
