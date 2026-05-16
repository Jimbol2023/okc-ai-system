import type {
  ReputationEvidenceQualityFinding,
  ReputationEvidenceQualityInput,
  ReputationEvidenceQualityResult,
  ReputationEvidenceReliabilityLevel,
} from "./reputation-evidence-quality-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildEvidenceQualityRecommendations(params: {
  overallReliabilityLevel: ReputationEvidenceReliabilityLevel;
  findings: ReputationEvidenceQualityFinding[];
}): string[] {
  const findingTypes = new Set(params.findings.map((finding) => finding.findingType));

  return unique([
    ...(params.overallReliabilityLevel === "weak" || params.overallReliabilityLevel === "partial"
      ? ["Prioritize human review of missing, incomplete, or inconsistent evidence before relying on resolution status indicators."]
      : []),
    ...(findingTypes.has("remediation_without_supporting_evidence")
      ? ["Review remediation plan items that have limited supporting evidence before confirming resolution progress."]
      : []),
    ...(findingTypes.has("recurring_issue_without_resolution_evidence")
      ? ["Review recurring reputation areas and add human-reviewed resolution evidence before treating them as stabilized."]
      : []),
    ...(findingTypes.has("evidence_outdated")
      ? ["Refresh dated evidence through human review before interpreting current reliability."]
      : []),
    ...(findingTypes.has("evidence_contradicts_stabilization") || findingTypes.has("evidence_inconsistent")
      ? ["Compare stabilization-supporting evidence against current trend, warning, and aggregation signals before taking operational action."]
      : []),
    ...(findingTypes.has("evidence_supports_stabilization")
      ? ["Continue lightweight human monitoring of stabilization-supported areas across future review periods."]
      : []),
    "Use evidence quality intelligence as read-only decision support; it does not validate compliance, assign fault, execute remediation, mutate data, send outreach, or trigger governance action.",
  ]);
}

export function buildEvidenceQualityExplainability(params: {
  input: ReputationEvidenceQualityInput;
  result: Omit<ReputationEvidenceQualityResult, "explainability" | "recommendations">;
}) {
  return {
    summary: [
      `Overall evidence reliability is ${params.result.overallReliabilityLevel}.`,
      `Evidence quality score is ${params.result.evidenceQualityScore}/100, where higher indicates stronger evidence reliability.`,
      `Evaluated ${params.result.findings.length} evidence quality findings at ${params.input.evaluatedAt}.`,
      `Missing evidence areas: ${params.result.missingEvidenceAreas.join(", ") || "none"}.`,
      `Contradiction areas: ${params.result.contradictionAreas.join(", ") || "none"}.`,
      `Stabilization-supported areas: ${params.result.stabilizationSupportedAreas.join(", ") || "none"}.`,
    ],
    rulesApplied: [
      "Missing evidence is flagged when remediation or resolution objects are absent while review pressure remains present.",
      "Incomplete evidence is flagged when plan or resolution items have limited supporting evidence for their claims.",
      "Outdated evidence is flagged only when supplied signal timestamps can be parsed and unresolved evidence is older than the deterministic recency threshold.",
      "Inconsistent evidence is flagged when plan or resolution evidence does not align with current trend, warning, or exposure context.",
      "Stabilization support is flagged when resolution evidence aligns with stable or improving trend, reduced warning pressure, and stable or watch-level exposure.",
      "Contradiction risk is flagged when stabilization or improvement claims coexist with deteriorating trend, urgent warning, critical/elevated exposure, or unresolved backlog.",
      "Evidence quality score is deterministic from 0 to 100 and does not mutate source data.",
    ],
    majorDrivers: unique([
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.resolutionResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.remediationResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.trendResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.aggregationResult?.topEnterpriseDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Evidence quality intelligence evaluates only supplied read-only remediation, resolution, governance, early warning, trend, aggregation, and signal inputs.",
      "It does not prove task completion, certify compliance, determine fault, profile demographics, infer protected characteristics, or make legal conclusions.",
      "It does not mutate inputs, write to databases, send messages, automate outreach, block operations, auto-remediate, auto-punish, or trigger autonomous governance actions.",
      "Reliability levels are neutral operational indicators for human review and require human judgment before any operational decision.",
    ],
  };
}
