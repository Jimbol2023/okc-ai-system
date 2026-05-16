import type {
  GovernanceObservabilityDurabilityInput,
  GovernanceObservabilityDurabilityResult,
} from "./governance-observability-durability-review-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceObservabilityDurabilityExplainability(params: {
  input: GovernanceObservabilityDurabilityInput;
  result: Omit<GovernanceObservabilityDurabilityResult, "explainability">;
}) {
  return {
    summary: [
      `Governance observability durability classification is ${params.result.observabilityDurabilityClassification}.`,
      `Governance observability scalability classification is ${params.result.observabilityScalabilityClassification}.`,
      `Observability durability score is ${params.result.observabilityDurabilityScore}/100 and observability scalability score is ${params.result.observabilityScalabilityScore}/100.`,
      `Evaluated ${params.result.areaAssessments.length} observability durability areas at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} observability review findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    observabilityDurabilityRulesApplied: [
      "Observability durability review is read-only and evaluates only supplied governance, survivability, doctrine durability, semantic stability, registry, normalization, traceability, audit, preview, readiness, assurance, continuity, resilience, lineage, memory, and evidence-quality outputs.",
      "Durability scoring emphasizes dashboard, audit, traceability, explainability, survivability, semantic, continuity, resilience, and evidence visibility.",
      "Scalability scoring emphasizes orchestration visibility, registry readiness visibility, normalization visibility, dashboard scaling, observability growth, AI-agent growth, multi-tenant visibility, and cross-industry observability.",
      "Findings identify blind spots, visibility degradation, explainability visibility risk, traceability visibility risk, dashboard survivability risk, audit fragmentation, semantic visibility risk, observability coupling, reviewability degradation, scalability bottlenecks, registry incompatibility, institutional observability risk, survivability gaps, and cross-industry visibility risk.",
      "This review does not redesign dashboards, centralize observability systems, implement persistence, enforce observability, execute orchestration, automate governance, rewrite doctrine, or mutate observability semantics.",
    ],
    majorDrivers: unique([
      ...params.result.areaAssessments
        .slice(0, 8)
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.survivabilityExpansionResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.traceabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Observability durability review evaluates supplied governance outputs only and does not validate factual truth or certify compliance.",
      "It does not provide legal, tax, lending, investment, protected-class, demographic, or policy-enforcement conclusions.",
      "It does not mutate inputs, write to databases, add routes, send outreach, automate workflows, block operations, or trigger orchestration.",
      "Observability durability and scalability classifications are neutral operational indicators for human review.",
    ],
  };
}
