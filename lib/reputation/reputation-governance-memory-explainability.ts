import type {
  ReputationGovernanceMemoryInput,
  ReputationGovernanceMemoryResult,
} from "./reputation-governance-memory-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceMemoryRecommendations(
  result: Omit<ReputationGovernanceMemoryResult, "recommendations" | "explainability">,
): string[] {
  const patternTypes = new Set(result.recurringPatterns.map((pattern) => pattern.patternType));

  return unique([
    ...(result.institutionalMemoryStatus === "thin"
      ? ["Add more human-reviewed historical governance snapshots before relying on long-horizon memory indicators."]
      : []),
    ...(patternTypes.has("recurring_governance_weakness")
      ? ["Review recurring governance weaknesses and compare them against continuity and resilience context."]
      : []),
    ...(patternTypes.has("recurring_dependency_fragility")
      ? ["Review recurring dependency fragility and confirm lineage and evidence chains remain traceable."]
      : []),
    ...(patternTypes.has("recurring_evidence_gap")
      ? ["Review recurring evidence gaps before interpreting governance memory as durable."]
      : []),
    ...(patternTypes.has("recurring_contradiction_chain")
      ? ["Review recurring contradiction chains with current evidence quality and stabilization context."]
      : []),
    ...(patternTypes.has("recurring_stabilization_success") || patternTypes.has("anti_fragility_evolution")
      ? ["Continue human monitoring of durable stabilization and anti-fragility indicators across future evaluation periods."]
      : []),
    "Use governance memory intelligence as read-only decision support; it does not persist data, write autonomous memory, execute remediation, mutate data, send outreach, or trigger governance action.",
  ]);
}

export function buildGovernanceMemoryExplainability(params: {
  input: ReputationGovernanceMemoryInput;
  result: Omit<ReputationGovernanceMemoryResult, "recommendations" | "explainability">;
}) {
  return {
    summary: [
      `Institutional memory status is ${params.result.institutionalMemoryStatus}.`,
      `Governance memory confidence score is ${params.result.memoryConfidenceScore}/100, where higher indicates stronger historical governance memory confidence.`,
      `Reviewed ${params.result.snapshotsReviewed.length} governance memory snapshots at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.recurringPatterns.length} recurring governance memory patterns.`,
      `Architecture improvement review items: ${params.result.architectureImprovementReview.length}.`,
    ],
    memoryRulesApplied: [
      "Memory snapshots are derived only from supplied read-only resilience, continuity, lineage, evidence quality, resolution, remediation, governance, trend, and aggregation context.",
      "Previous resilience results are treated as historical read-only inputs and are not persisted or mutated.",
      "Recurring patterns are detected deterministically from repeated normalized indicators across current and previous snapshots.",
      "Governance lessons are neutral institutional observations for human review, not operational instructions or compliance conclusions.",
      "Memory confidence score is deterministic from snapshot depth, pattern support, evidence quality, learning indicators, and context completeness.",
      "Architecture improvement review is emitted as structured decision-support context and does not redesign existing modules.",
    ],
    majorDrivers: unique([
      ...params.result.recurringPatterns
        .slice(0, 8)
        .map((pattern) => `${pattern.patternType}: ${pattern.description}`),
      ...params.result.continuityLearningIndicators.slice(0, 5),
      ...params.result.resilienceLearningIndicators.slice(0, 5),
      ...(params.input.currentResilienceResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.continuityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.lineageResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Governance memory intelligence evaluates only supplied read-only governance intelligence outputs.",
      "It does not persist memory, write to databases, create autonomous memory records, or connect to storage systems.",
      "It does not prove completion, certify compliance, determine fault, profile demographics, infer protected characteristics, or make legal, tax, lending, or investment conclusions.",
      "It does not mutate inputs, send messages, automate outreach, block operations, auto-remediate, or trigger autonomous governance actions.",
      "Memory status is a neutral operational indicator for human review and requires human judgment before any operational decision.",
    ],
  };
}
