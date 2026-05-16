import type {
  ReputationGovernanceDoctrineInput,
  ReputationGovernanceDoctrineResult,
} from "./reputation-governance-doctrine-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceDoctrineRecommendations(
  result: Omit<ReputationGovernanceDoctrineResult, "recommendations" | "explainability">,
): string[] {
  const driftTypes = new Set(result.driftFindings.map((finding) => finding.driftType));

  return unique([
    ...(result.doctrineStatus === "thin"
      ? ["Review upstream governance memory, continuity, lineage, and evidence context before relying on doctrine indicators."]
      : []),
    ...(driftTypes.has("unsupported_principle")
      ? ["Review doctrine principles with limited supporting evidence before treating them as durable institutional guidance."]
      : []),
    ...(driftTypes.has("evidence_support_gap")
      ? ["Review evidence support gaps and preserve traceable evidence before interpreting doctrine as reliable."]
      : []),
    ...(driftTypes.has("continuity_context_gap") || driftTypes.has("lineage_context_gap")
      ? ["Provide continuity and lineage context for human review before relying on doctrine confidence."]
      : []),
    ...(driftTypes.has("contradictory_governance_pattern") || driftTypes.has("doctrine_inconsistency")
      ? ["Compare doctrine principles against contradiction and drift context before operational interpretation."]
      : []),
    "Use governance doctrine intelligence as read-only decision support; it does not enforce policy, execute actions, mutate data, send outreach, or trigger autonomous governance.",
  ]);
}

export function buildGovernanceDoctrineExplainability(params: {
  input: ReputationGovernanceDoctrineInput;
  result: Omit<ReputationGovernanceDoctrineResult, "recommendations" | "explainability">;
}) {
  return {
    summary: [
      `Governance doctrine status is ${params.result.doctrineStatus}.`,
      `Doctrine confidence score is ${params.result.doctrineConfidenceScore}/100, where higher indicates stronger support for human-reviewed institutional principles.`,
      `Generated ${params.result.principles.length} doctrine principles at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.driftFindings.length} doctrine drift findings.`,
      `Architecture improvement review items: ${params.result.architectureImprovementReview.length}.`,
    ],
    doctrineRulesApplied: [
      "Doctrine principles are formed only from supplied read-only memory, resilience, continuity, lineage, evidence, resolution, remediation, governance, trend, and aggregation outputs.",
      "Principles require supporting evidence, recurring patterns, and explicit limitations to avoid hidden scoring or unsupported doctrine formation.",
      "Doctrine drift is flagged when principles are weakly supported, contradicted, or missing continuity, lineage, or evidence context.",
      "Doctrine confidence score is deterministic from principle confidence, memory, resilience, continuity, lineage, evidence quality, durable patterns, and drift penalties.",
      "Architecture improvement review is emitted as structured decision-support context and does not redesign existing modules.",
      "Doctrine intelligence is read-only and does not enforce policy, automate governance, persist memory, or execute actions.",
    ],
    majorDrivers: unique([
      ...params.result.principles
        .slice(0, 8)
        .map((principle) => `${principle.principleType}: ${principle.description}`),
      ...params.result.driftFindings
        .slice(0, 6)
        .map((finding) => `${finding.driftType}: ${finding.description}`),
      ...params.result.durablePatterns.slice(0, 5),
      ...(params.input.memoryResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.resilienceResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.continuityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Governance doctrine intelligence evaluates only supplied read-only governance intelligence outputs.",
      "It does not enforce policy, certify compliance, determine fault, profile demographics, infer protected characteristics, or make legal, tax, lending, or investment conclusions.",
      "It does not mutate inputs, write to databases, persist doctrine, send messages, automate outreach, block operations, auto-remediate, or trigger autonomous governance actions.",
      "Doctrine principles are neutral operational indicators for human review and require human judgment before any operational decision.",
    ],
  };
}
