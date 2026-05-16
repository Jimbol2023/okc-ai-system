import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
  FullSystemGovernanceAuditRecommendationClassification,
  FullSystemGovernanceAuditResult,
} from "./full-system-governance-audit-types";
import type { GovernanceArchitectureFreezeReadinessResult } from "./governance-architecture-freeze-readiness-review-types";
import type { GovernanceEvidenceTraceabilityResult } from "./governance-evidence-traceability-types";
import type { GovernanceExplainabilityContinuityResult } from "./governance-explainability-continuity-review-types";
import type { GovernanceFinalStabilityConsolidationResult } from "./governance-final-stability-consolidation-review-types";
import type { GovernanceLifecycleContinuityResult } from "./governance-lifecycle-continuity-review-types";
import type { GovernanceLongHorizonInstitutionalResilienceResult } from "./governance-long-horizon-institutional-resilience-review-types";
import type { GovernanceMultiBusinessTenantIsolationResult } from "./governance-multi-business-tenant-isolation-review-types";
import type { GovernanceReviewabilityIntegrityResult } from "./governance-reviewability-integrity-review-types";
import type { GovernanceSemanticVersionSurvivabilityResult } from "./governance-semantic-version-survivability-review-types";
import type { GovernanceTraceabilitySurvivabilityResult } from "./governance-traceability-survivability-review-types";
import type { GovernanceVersioningReadinessResult } from "./governance-versioning-readiness-review-types";
import type { PrincipleEvidenceNormalizationResult } from "./principle-evidence-normalization-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

export type SharedGovernanceUtilityExtractionReadinessClassification =
  | "not_ready_for_extraction"
  | "partially_extractable"
  | "extractable"
  | "institutionally_reusable";

export type SharedGovernanceUtilityExtractionArea =
  | "deterministic_scoring_helpers"
  | "explainability_helpers"
  | "traceability_helpers"
  | "normalization_helpers"
  | "metadata_contracts"
  | "survivability_contracts"
  | "continuity_contracts"
  | "reconstruction_helpers"
  | "reviewability_helpers"
  | "isolation_helpers"
  | "resilience_helpers"
  | "semantic_version_helpers"
  | "governance_utility_patterns"
  | "shared_contract_candidates";

export type SharedGovernanceUtilityCandidateType =
  | "deterministic_helper"
  | "explainability_helper"
  | "traceability_helper"
  | "normalization_helper"
  | "metadata_contract"
  | "survivability_contract"
  | "continuity_contract"
  | "reconstruction_helper"
  | "reviewability_helper"
  | "isolation_helper"
  | "resilience_helper"
  | "semantic_version_helper";

export type SharedGovernanceUtilityExtractionFindingType =
  | "unstable_helper_pattern"
  | "premature_extraction_risk"
  | "hidden_coupling_risk"
  | "orchestration_contamination_risk"
  | "unstable_metadata_contract"
  | "survivability_helper_instability"
  | "normalization_fragility"
  | "explainability_helper_inconsistency"
  | "traceability_helper_inconsistency"
  | "shared_contract_immaturity"
  | "governance_stack_dependency_risk"
  | "future_refactor_risk";

export type SharedGovernanceUtilityExtractionPhase =
  | "phase_1_low_risk"
  | "phase_2_contract_review"
  | "defer_until_stable";

export interface SharedGovernanceUtilityExtractionPlanContext {
  proposedUtilityCandidates?: string[];
  proposedMetadataContractCandidates?: string[];
  proposedSurvivabilityContractCandidates?: string[];
  proposedNormalizationContractCandidates?: string[];
  knownHelperDuplication?: string[];
  knownExtractionRisks?: string[];
  extractionAssumptions?: string[];
  extractionLimitations?: string[];
  allowedPhaseOneCandidates?: string[];
  deferredCandidates?: string[];
}

export interface SharedGovernanceUtilityExtractionPlanInput {
  extractionContext?: SharedGovernanceUtilityExtractionPlanContext;
  architectureFreezeReadinessResult?: GovernanceArchitectureFreezeReadinessResult;
  finalStabilityConsolidationResult?: GovernanceFinalStabilityConsolidationResult;
  longHorizonInstitutionalResilienceResult?: GovernanceLongHorizonInstitutionalResilienceResult;
  multiBusinessTenantIsolationResult?: GovernanceMultiBusinessTenantIsolationResult;
  semanticVersionSurvivabilityResult?: GovernanceSemanticVersionSurvivabilityResult;
  traceabilitySurvivabilityResult?: GovernanceTraceabilitySurvivabilityResult;
  explainabilityContinuityResult?: GovernanceExplainabilityContinuityResult;
  lifecycleContinuityResult?: GovernanceLifecycleContinuityResult;
  versioningReadinessResult?: GovernanceVersioningReadinessResult;
  reviewabilityIntegrityResult?: GovernanceReviewabilityIntegrityResult;
  normalizationResult?: PrincipleEvidenceNormalizationResult;
  traceabilityResult?: GovernanceEvidenceTraceabilityResult;
  auditResult?: FullSystemGovernanceAuditResult;
  auditFindings?: FullSystemGovernanceAuditFinding[];
  recommendations?: FullSystemGovernanceAuditRecommendation[];
  evaluatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface SharedGovernanceUtilityAreaAssessment {
  area: SharedGovernanceUtilityExtractionArea;
  score: number;
  classification: SharedGovernanceUtilityExtractionReadinessClassification;
  description: string;
  extractionReadySignals: string[];
  extractionRiskSignals: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface SharedGovernanceUtilityCandidate {
  id: string;
  candidateType: SharedGovernanceUtilityCandidateType;
  title: string;
  description: string;
  readinessScore: number;
  extractionReadiness: SharedGovernanceUtilityExtractionReadinessClassification;
  supportingSignals: string[];
  riskSignals: string[];
  recommendedPhase: SharedGovernanceUtilityExtractionPhase;
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface SharedGovernanceUtilityExtractionFinding {
  id: string;
  findingType: SharedGovernanceUtilityExtractionFindingType;
  area: SharedGovernanceUtilityExtractionArea;
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

export interface SharedGovernanceUtilityExtractionRecommendation {
  id: string;
  classification: FullSystemGovernanceAuditRecommendationClassification;
  recommendation: string;
  rationale: string;
  humanReviewRequired: boolean;
}

export interface SharedGovernanceUtilityExtractionPlanResult {
  extractionReadinessScore: number;
  extractionReadinessClassification: SharedGovernanceUtilityExtractionReadinessClassification;
  areaAssessments: SharedGovernanceUtilityAreaAssessment[];
  utilityCandidates: SharedGovernanceUtilityCandidate[];
  findings: SharedGovernanceUtilityExtractionFinding[];
  extractionReadyUtilityCandidates: string[];
  unstableUtilityCandidates: string[];
  stableMetadataContractCandidates: string[];
  survivabilityContractCandidates: string[];
  normalizationContractCandidates: string[];
  deterministicHelperFindings: string[];
  explainabilityHelperFindings: string[];
  traceabilityHelperFindings: string[];
  governanceUtilityMaturityFindings: string[];
  humanReviewNotes: string[];
  stagedExtractionRecommendations: SharedGovernanceUtilityExtractionRecommendation[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    extractionPlanningRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
