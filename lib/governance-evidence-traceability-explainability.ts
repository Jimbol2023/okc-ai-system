import type {
  GovernanceEvidenceTraceabilityInput,
  GovernanceEvidenceTraceabilityResult,
} from "./governance-evidence-traceability-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceEvidenceTraceabilityExplainability(params: {
  input: GovernanceEvidenceTraceabilityInput;
  result: Omit<GovernanceEvidenceTraceabilityResult, "explainability">;
}) {
  return {
    summary: [
      `Governance evidence traceability classification is ${params.result.traceabilityClassification}.`,
      `Traceability score is ${params.result.traceabilityScore}/100, where higher indicates stronger linkage between audit findings, evidence, reasoning, limitations, scoring drivers, principles, and recommendations.`,
      `Evaluated ${params.result.traces.length} evidence trace links at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.gaps.length} traceability gaps.`,
      `Human review notes: ${params.result.humanReviewNotes.length}.`,
    ],
    traceabilityRulesApplied: [
      "Trace links are generated only from supplied read-only audit results, audit findings, recommendations, and optional trace records.",
      "Trace strength is deterministic from source attribution, audit category mapping, principle linkage, scoring driver linkage, evidence summary, reasoning linkage, limitation linkage, recommendation linkage, confidence impact, and risk impact.",
      "Missing evidence links, weak source attribution, unsupported scoring drivers, unclear reasoning, missing limitations, weak recommendations, weak principle links, and inconsistent category mapping are flagged as trace gaps.",
      "This contract standardizes traceability only; it does not redesign evidence modules, extract shared utilities, persist traces, execute actions, or enforce policy.",
    ],
    majorDrivers: unique([
      ...params.result.traces
        .slice(0, 8)
        .map((trace) => `${trace.auditCategory}: ${trace.traceStrength} trace for ${trace.evidenceId}.`),
      ...params.result.gaps.slice(0, 8).map((gap) => `${gap.gapType}: ${gap.description}`),
      ...(params.input.auditResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Governance evidence traceability evaluates only supplied read-only audit context and optional trace records.",
      "It does not validate factual truth, certify compliance, provide legal conclusions, profile demographics, infer protected characteristics, or enforce policy.",
      "It does not mutate inputs, write to databases, call routes, send outreach, automate workflows, block operations, or trigger orchestration.",
      "Traceability classification is a neutral operational indicator for human review.",
    ],
  };
}
