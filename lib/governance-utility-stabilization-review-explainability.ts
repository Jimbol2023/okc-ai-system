import { uniqueNonEmptyStrings } from "./governance-utils/deterministic";
import type {
  GovernanceUtilityStabilizationReviewInput,
  GovernanceUtilityStabilizationReviewResult,
} from "./governance-utility-stabilization-review-types";

export function buildGovernanceUtilityStabilizationExplainability(params: {
  input: GovernanceUtilityStabilizationReviewInput;
  result: Omit<GovernanceUtilityStabilizationReviewResult, "explainability">;
}) {
  return {
    summary: [
      `Governance utility stabilization classification is ${params.result.stabilizationClassification}.`,
      `Stabilization score is ${params.result.stabilizationScore}/100, where higher indicates stronger confidence that Phase 1 utilities preserved deterministic behavior, semantic stability, explainability continuity, traceability continuity, survivability continuity, governance safety, and orchestration isolation.`,
      `Evaluated ${params.result.areaAssessments.length} stabilization areas at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} utility stabilization findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    stabilizationRulesApplied: [
      "Governance utility stabilization review is read-only and evaluates the Phase 1 utility surface, optional extraction-plan result, optional audit context, and supplied stabilization context.",
      "Scores are deterministic from stable helper signals, risk signals, finding volume, upstream extraction-plan signals, and audit safety indicators.",
      "Findings identify utility instability, changed scoring behavior, changed slug/key behavior, hidden dependency coupling, import-cycle risk, semantic drift, traceability drift, explainability degradation, governance boundary weakening, premature adoption risk, and future refactor risk.",
      "This review does not extract additional utilities, mutate semantics, add routes, write to databases, trigger orchestration, automate governance, enforce policy, or redesign architecture.",
    ],
    majorDrivers: uniqueNonEmptyStrings([
      ...params.result.areaAssessments
        .slice(0, 8)
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.extractionPlanResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.auditResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "This review validates stabilization signals only; it does not prove behavioral equivalence through runtime instrumentation or approve broad utility adoption.",
      "It does not mutate inputs, write to databases, add routes, implement persistence, perform orchestration, enforce policies, block operations, send outreach, trigger automation, or rewrite governance findings.",
      "Old module compatibility is inferred from the limited adoption scope unless callers supply deeper import graph or compatibility evidence.",
      "Future adoption should remain staged until human review confirms no instability, coupling, orchestration contamination, or semantic drift.",
    ],
  };
}
