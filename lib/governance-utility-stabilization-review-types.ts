import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
  FullSystemGovernanceAuditResult,
} from "./full-system-governance-audit-types";
import type { ReputationSeverity } from "./reputation/reputation-types";
import type { SharedGovernanceUtilityExtractionPlanResult } from "./shared-governance-utility-extraction-plan-types";

export type GovernanceUtilityStabilizationClassification =
  | "unstable"
  | "needs_review"
  | "stable"
  | "institutionally_stable";

export type GovernanceUtilityStabilizationArea =
  | "deterministic_behavior_stability"
  | "helper_output_consistency"
  | "semantic_stability"
  | "explainability_continuity"
  | "traceability_continuity"
  | "survivability_continuity"
  | "coupling_risk"
  | "dependency_risk"
  | "import_safety"
  | "hidden_execution_pathways"
  | "orchestration_contamination"
  | "old_module_compatibility"
  | "future_adoption_readiness";

export type GovernanceUtilityStabilizationFindingType =
  | "utility_instability"
  | "changed_scoring_behavior"
  | "changed_slug_key_behavior"
  | "hidden_dependency_coupling"
  | "import_cycle_risk"
  | "semantic_drift"
  | "traceability_drift"
  | "explainability_degradation"
  | "governance_boundary_weakening"
  | "premature_adoption_risk"
  | "future_refactor_risk";

export interface GovernanceUtilityStabilizationContext {
  utilityFiles?: string[];
  helperNames?: string[];
  consumingModules?: string[];
  adoptionScope?: string[];
  importGraphNotes?: string[];
  compatibilityNotes?: string[];
  knownLimitations?: string[];
  knownRisks?: string[];
  changedBehaviorNotes?: string[];
  testEvidence?: string[];
  futureCandidates?: string[];
}

export interface GovernanceUtilityStabilizationReviewInput {
  stabilizationContext?: GovernanceUtilityStabilizationContext;
  extractionPlanResult?: SharedGovernanceUtilityExtractionPlanResult;
  auditResult?: FullSystemGovernanceAuditResult;
  auditFindings?: FullSystemGovernanceAuditFinding[];
  recommendations?: FullSystemGovernanceAuditRecommendation[];
  evaluatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface GovernanceUtilityStabilizationAreaAssessment {
  area: GovernanceUtilityStabilizationArea;
  score: number;
  classification: GovernanceUtilityStabilizationClassification;
  description: string;
  stabilitySignals: string[];
  riskSignals: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceUtilityStabilizationFinding {
  id: string;
  findingType: GovernanceUtilityStabilizationFindingType;
  area: GovernanceUtilityStabilizationArea;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedAuditCategories: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
  confidenceScore: number;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceUtilityStabilizationReviewResult {
  stabilizationScore: number;
  stabilizationClassification: GovernanceUtilityStabilizationClassification;
  areaAssessments: GovernanceUtilityStabilizationAreaAssessment[];
  findings: GovernanceUtilityStabilizationFinding[];
  stableHelperFindings: string[];
  unstableHelperFindings: string[];
  compatibilityFindings: string[];
  couplingFindings: string[];
  semanticStabilityFindings: string[];
  traceabilityExplainabilityFindings: string[];
  governanceSafetyFindings: string[];
  adoptionReadinessFindings: string[];
  humanReviewNotes: string[];
  futureRecommendations: string[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    stabilizationRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
