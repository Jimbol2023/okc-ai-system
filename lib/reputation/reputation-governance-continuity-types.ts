import type { EnterpriseReputationAggregationResult } from "./reputation-aggregation-types";
import type { ReputationEvidenceQualityResult } from "./reputation-evidence-quality-types";
import type { ReputationGovernanceLineageResult } from "./reputation-governance-lineage-types";
import type { ReputationGovernanceResult } from "./reputation-governance-types";
import type { ReputationRemediationPlanningResult } from "./reputation-remediation-types";
import type { ReputationResolutionTrackingResult } from "./reputation-resolution-types";
import type { ReputationSeverity } from "./reputation-types";
import type { ReputationTrendResult } from "./reputation-trend-types";

export interface ReputationGovernanceContinuityInput {
  currentLineageResult?: ReputationGovernanceLineageResult;
  previousLineageResult?: ReputationGovernanceLineageResult;
  governanceResult?: ReputationGovernanceResult;
  remediationResult?: ReputationRemediationPlanningResult;
  resolutionResult?: ReputationResolutionTrackingResult;
  evidenceQualityResult?: ReputationEvidenceQualityResult;
  trendResult?: ReputationTrendResult;
  aggregationResult?: EnterpriseReputationAggregationResult;
  evaluatedAt: string;
  metadata?: Record<string, unknown>;
}

export type ReputationGovernanceContinuityStatus =
  | "fragile"
  | "stable"
  | "resilient"
  | "anti_fragile";

export type ReputationGovernanceDriftType =
  | "lineage_integrity_decline"
  | "reviewability_decline"
  | "evidence_dependency_weakening"
  | "remediation_pattern_instability"
  | "resolution_pattern_instability"
  | "stabilization_chain_deterioration"
  | "governance_reasoning_inconsistency";

export interface ReputationGovernanceDriftFinding {
  id: string;
  driftType: ReputationGovernanceDriftType;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedGovernanceDomains: string[];
  affectedBusinessUnits: string[];
  recommendedHumanReview: string;
  confidenceScore: number;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface ReputationGovernanceContinuityResult {
  continuityStatus: ReputationGovernanceContinuityStatus;
  governanceContinuityScore: number;
  driftFindings: ReputationGovernanceDriftFinding[];
  continuityStrengths: string[];
  continuityWeaknesses: string[];
  resilienceIndicators: string[];
  reviewabilityAssessment: string;
  recommendations: string[];
  explainability: {
    summary: string[];
    continuityRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
