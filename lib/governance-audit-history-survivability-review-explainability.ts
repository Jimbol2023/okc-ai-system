import type {
  GovernanceAuditHistorySurvivabilityInput,
  GovernanceAuditHistorySurvivabilityResult,
} from "./governance-audit-history-survivability-review-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceAuditHistorySurvivabilityExplainability(params: {
  input: GovernanceAuditHistorySurvivabilityInput;
  result: Omit<GovernanceAuditHistorySurvivabilityResult, "explainability">;
}) {
  return {
    summary: [
      `Governance audit-history survivability classification is ${params.result.auditHistoryClassification}.`,
      `Audit-history survivability score is ${params.result.auditHistorySurvivabilityScore}/100, where higher indicates stronger long-horizon survivability for audit history, governance findings history, evidence history, traceability history, semantic history, observability history, lineage history, reviewability history, doctrine continuity, lifecycle continuity, versioning continuity, compatibility continuity, migration survivability, and institutional memory continuity.`,
      `Evaluated ${params.result.areaAssessments.length} audit-history survivability areas at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} audit-history survivability findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    auditHistorySurvivabilityRulesApplied: [
      "Audit-history survivability review is read-only and evaluates only supplied audit, evidence, traceability, semantic, observability, lineage, reviewability, doctrine, lifecycle, versioning, compatibility, migration, memory, and governance review outputs.",
      "Area scores are deterministic from survivability signals, fragility signals, finding volume, explainability depth, and supplied upstream classifications.",
      "Findings identify audit-history fragmentation, governance-history gaps, traceability-history discontinuity, evidence-history degradation, semantic-history drift, observability-history gaps, lineage-history weakness, reviewability-history degradation, doctrine-history fragmentation, versioning-history instability, migration-history survivability risks, institutional audit reconstruction risks, and long-horizon audit survivability risks.",
      "This review does not implement persistence, create audit-history storage, mutate audit history, rewrite governance findings, centralize governance control, create lifecycle automation, rewrite semantics, redesign architecture, enforce policy, or trigger orchestration.",
    ],
    majorDrivers: unique([
      ...params.result.areaAssessments
        .slice(0, 8)
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.auditResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.institutionalMemoryContinuityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.lifecycleContinuityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Audit-history survivability review evaluates supplied governance outputs only and does not validate factual truth, certify compliance, or provide legal conclusions.",
      "It does not mutate inputs, write to databases, add routes, create audit-history storage, execute audit-history writes, automate lifecycle actions, enforce policies, block operations, send outreach, or trigger orchestration.",
      "Audit-history survivability is a reconstruction and durability indicator, not a persistence implementation or autonomous audit system.",
      "Compatibility and migration audit history are evaluated from supplied lifecycle, memory, versioning, optional compatibility/migration context, and metadata only.",
    ],
  };
}
