import type {
  SharedGovernanceUtilityExtractionPlanInput,
  SharedGovernanceUtilityExtractionPlanResult,
} from "./shared-governance-utility-extraction-plan-types";
import { uniqueNonEmptyStrings } from "./governance-utils/deterministic";

export function buildSharedGovernanceUtilityExtractionPlanExplainability(params: {
  input: SharedGovernanceUtilityExtractionPlanInput;
  result: Omit<SharedGovernanceUtilityExtractionPlanResult, "explainability">;
}) {
  return {
    summary: [
      `Shared governance utility extraction readiness classification is ${params.result.extractionReadinessClassification}.`,
      `Extraction readiness score is ${params.result.extractionReadinessScore}/100, where higher indicates stronger maturity for future shared deterministic helpers, explainability helpers, traceability helpers, scoring helpers, metadata contracts, survivability contracts, continuity helpers, reconstruction helpers, normalization helpers, and reusable governance utility patterns.`,
      `Evaluated ${params.result.areaAssessments.length} extraction-planning areas and ${params.result.utilityCandidates.length} utility candidates at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} extraction-planning findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    extractionPlanningRulesApplied: [
      "Shared governance utility extraction planning is read-only and evaluates supplied governance subsystem outputs, optional extraction context, and metadata only.",
      "Area and candidate scores are deterministic from extraction-ready signals, extraction-risk signals, finding volume, candidate support, and supplied upstream classifications.",
      "Findings identify unstable helper patterns, premature extraction risks, hidden coupling risks, orchestration contamination risks, unstable metadata contracts, survivability helper instability, normalization fragility, explainability helper inconsistency, traceability helper inconsistency, shared contract immaturity, governance-stack dependency risks, and future refactor risks.",
      "This planning review does not extract utilities, centralize governance logic, redesign governance architecture, implement persistence, mutate semantics, introduce execution systems, enforce policy, trigger automation, or perform orchestration.",
    ],
    majorDrivers: uniqueNonEmptyStrings([
      ...params.result.areaAssessments
        .slice(0, 8)
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
      ...params.result.utilityCandidates
        .slice(0, 8)
        .map(
          (candidate) =>
            `${candidate.title}: ${candidate.extractionReadiness} at ${candidate.readinessScore}/100, ${candidate.recommendedPhase}.`,
        ),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.architectureFreezeReadinessResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.finalStabilityConsolidationResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.auditResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "This output is an extraction plan, not implementation approval, architecture centralization, production registry creation, or deployment approval.",
      "It does not mutate inputs, write to databases, add routes, create persistence, perform orchestration, enforce policies, block operations, send outreach, trigger automation, or rewrite governance findings.",
      "Extraction readiness depends on upstream subsystem completeness, stable contract candidates, stable semantics, traceability durability, explainability continuity, and human-reviewed boundaries.",
      "Controlled Shared Governance Utility Extraction Phase 1 should begin only after explicit human approval and should be limited to low-risk deterministic helpers.",
    ],
  };
}
