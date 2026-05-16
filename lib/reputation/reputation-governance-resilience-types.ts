import type { EnterpriseReputationAggregationResult } from "./reputation-aggregation-types";
import type { ReputationEvidenceQualityResult } from "./reputation-evidence-quality-types";
import type { ReputationGovernanceContinuityResult } from "./reputation-governance-continuity-types";
import type { ReputationGovernanceLineageResult } from "./reputation-governance-lineage-types";
import type { ReputationGovernanceResult } from "./reputation-governance-types";
import type { ReputationRemediationPlanningResult } from "./reputation-remediation-types";
import type { ReputationResolutionTrackingResult } from "./reputation-resolution-types";
import type { ReputationSeverity } from "./reputation-types";
import type { ReputationTrendResult } from "./reputation-trend-types";

export interface ReputationGovernanceResilienceInput {
  continuityResult?: ReputationGovernanceContinuityResult;
  lineageResult?: ReputationGovernanceLineageResult;
  resolutionResult?: ReputationResolutionTrackingResult;
  remediationResult?: ReputationRemediationPlanningResult;
  governanceResult?: ReputationGovernanceResult;
  evidenceQualityResult?: ReputationEvidenceQualityResult;
  trendResult?: ReputationTrendResult;
  aggregationResult?: EnterpriseReputationAggregationResult;
  evaluatedAt: string;
  metadata?: Record<string, unknown>;
}

export type ReputationGovernanceResilienceStatus =
  | "fragile"
  | "pressured"
  | "resilient"
  | "anti_fragile";

export type ReputationGovernanceResilienceFindingType =
  | "stress_absorption_weakness"
  | "recovery_capacity_gap"
  | "stabilization_fragility"
  | "dependency_resilience_gap"
  | "continuity_pressure"
  | "contradiction_recovery_weakness"
  | "anti_fragility_indicator";

export interface ReputationGovernanceResilienceFinding {
  id: string;
  findingType: ReputationGovernanceResilienceFindingType;
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

export type ReputationArchitectureImprovementClassification =
  | "immediate"
  | "future_upgrade"
  | "optional_optimization";

export interface ReputationArchitectureImprovementItem {
  id: string;
  classification: ReputationArchitectureImprovementClassification;
  area: string;
  observation: string;
  recommendedHumanReview: string;
}

export interface ReputationGovernanceResilienceResult {
  resilienceStatus: ReputationGovernanceResilienceStatus;
  governanceResilienceScore: number;
  findings: ReputationGovernanceResilienceFinding[];
  resilienceStrengths: string[];
  resilienceWeaknesses: string[];
  recoveryIndicators: string[];
  fragilityIndicators: string[];
  antiFragilityIndicators: string[];
  recommendations: string[];
  architectureImprovementReview: ReputationArchitectureImprovementItem[];
  explainability: {
    summary: string[];
    resilienceRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
