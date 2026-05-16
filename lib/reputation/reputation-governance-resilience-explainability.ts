import type {
  ReputationGovernanceResilienceInput,
  ReputationGovernanceResilienceResult,
} from "./reputation-governance-resilience-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceResilienceRecommendations(
  result: Omit<ReputationGovernanceResilienceResult, "recommendations" | "explainability">,
): string[] {
  const findingTypes = new Set(result.findings.map((finding) => finding.findingType));

  return unique([
    ...(result.resilienceStatus === "fragile"
      ? ["Prioritize human review of governance resilience before relying on pressure-period governance indicators."]
      : []),
    ...(findingTypes.has("stress_absorption_weakness")
      ? ["Review pressure signals, trend movement, and exposure context before interpreting stress absorption capacity."]
      : []),
    ...(findingTypes.has("recovery_capacity_gap")
      ? ["Review recovery indicators, remediation readiness, and resolution progress before treating governance recovery as durable."]
      : []),
    ...(findingTypes.has("stabilization_fragility")
      ? ["Review stabilization chains and supporting evidence before interpreting stabilized areas as resilient."]
      : []),
    ...(findingTypes.has("dependency_resilience_gap")
      ? ["Review weak lineage areas and evidence dependency chains before relying on governance dependency resilience."]
      : []),
    ...(findingTypes.has("continuity_pressure")
      ? ["Review continuity drift findings and reviewability assessment before taking operational action."]
      : []),
    ...(findingTypes.has("contradiction_recovery_weakness")
      ? ["Review contradiction chains and evidence quality limitations before interpreting recovery capacity."]
      : []),
    ...(result.antiFragilityIndicators.length > 0
      ? ["Continue human monitoring of anti-fragility indicators across future evaluation periods."]
      : []),
    "Use governance resilience intelligence as read-only decision support; it does not validate compliance, assign fault, execute remediation, mutate data, send outreach, or trigger governance action.",
  ]);
}

export function buildGovernanceResilienceExplainability(params: {
  input: ReputationGovernanceResilienceInput;
  result: Omit<ReputationGovernanceResilienceResult, "recommendations" | "explainability">;
}) {
  return {
    summary: [
      `Governance resilience status is ${params.result.resilienceStatus}.`,
      `Governance resilience score is ${params.result.governanceResilienceScore}/100, where higher indicates stronger stress resilience and recovery capacity.`,
      `Evaluated ${params.result.findings.length} resilience findings at ${params.input.evaluatedAt}.`,
      `Recovery indicators: ${params.result.recoveryIndicators.length}. Fragility indicators: ${params.result.fragilityIndicators.length}. Anti-fragility indicators: ${params.result.antiFragilityIndicators.length}.`,
      `Architecture improvement review items: ${params.result.architectureImprovementReview.length}.`,
    ],
    resilienceRulesApplied: [
      "Stress absorption is evaluated from trend movement, aggregation exposure, continuity status, and lineage integrity.",
      "Recovery capacity is evaluated from remediation readiness, resolution progress, evidence reliability, and continuity resilience indicators.",
      "Stabilization fragility is flagged when stabilization chains are limited, deteriorating, or contradicted by current evidence context.",
      "Dependency resilience gaps are flagged when weak lineage areas, low dependency chains, or weak evidence quality reduce reviewable durability.",
      "Continuity pressure is flagged from supplied continuity status, continuity score, and drift findings.",
      "Contradiction recovery weakness is flagged when contradiction chains persist without adequate recovery or evidence quality support.",
      "Anti-fragility indicators are identified only when continuity, lineage, evidence, stabilization, and contradiction patterns strengthen under supplied pressure context.",
      "Governance resilience score is deterministic from 0 to 100 and does not mutate source data.",
    ],
    majorDrivers: unique([
      ...params.result.findings
        .slice(0, 8)
        .map((finding) => `${finding.findingType}: ${finding.description}`),
      ...params.result.recoveryIndicators.slice(0, 5),
      ...params.result.antiFragilityIndicators.slice(0, 5),
      ...(params.input.continuityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.lineageResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.evidenceQualityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Governance resilience intelligence evaluates only supplied read-only reputation intelligence outputs.",
      "It does not prove completion, certify compliance, determine fault, profile demographics, infer protected characteristics, or make legal, tax, lending, or investment conclusions.",
      "It does not mutate inputs, write to databases, send messages, automate outreach, block operations, auto-remediate, or trigger autonomous governance actions.",
      "Resilience status is a neutral operational indicator for human review and requires human judgment before any operational decision.",
    ],
  };
}
